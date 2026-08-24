---
name: web-security-headers
description: Security posture for a static export on Cloudflare Pages — the zone-supplied headers this repo does not own and templates/_headers that adopts them (HSTS without preload, XFO, nosniff, Referrer-Policy, Permissions-Policy, a report-only-first CSP around the inline GTM snippet), the public/_redirects cutover that replaces the 37 meta-refresh stubs with real 301s and retires the GitHub Pages / Apache leftovers (ADR 0004), PII and consent on the lead form, .env.example drift, and secret hygiene with the repo's own hooks. Use when adding headers, planning a CSP, running the redirect cutover, or auditing security. Triggers: "security headers", "CSP", "HSTS", "_headers", "_redirects", "301", "is the form safe", "clickjacking", "כותרות אבטחה", "הפניות 301".
allowed-tools: Read, Grep, Glob, Bash
---

# Security headers & posture

`output: "export"` means Next's `headers()` and `redirects()` are unavailable. **Cloudflare Pages
reads `public/_headers` and `public/_redirects`** — Next copies `public/` verbatim into `out/`, wrangler
ships it. This repo has neither yet. Writer `rtl-frontend-engineer` (roster §3 rows §1, §12); reviewer
`security-auditor`; proof `edge.mjs`.

## Baseline — re-measure first

```bash
node scripts/audit/edge.mjs                 # _redirects, _headers, dead-host artifacts, foreign stubs, llms.txt, .env drift
curl -sSI https://dangates.co.il/      | grep -iE 'strict-transport|content-security|x-frame|permissions|referrer|content-type-options|access-control'
curl -sSI https://dangates.pages.dev/  | grep -iE 'strict-transport|x-frame|permissions'
npm audit --omit=dev                        # runtime advisories — the ones that ship
```

As of 2026-08-23: `stubs 37 · redirectsFile false · headersFile false · deadHostArtifacts 3 ·
foreignStubs 1 · llmsTxt false · envDocumented 4 / envUsed 1`, plus the stale cPanel comment at
`next.config.mjs:6-7` (N7). Every number below is that run; re-run before quoting.

## What the live site returns, and where it comes from

| Header                        | Live value (2026-08-23)                    | Source                |
| ----------------------------- | ------------------------------------------ | --------------------- |
| `strict-transport-security`   | `max-age=15552000` (180 d, no subdomains)  | **Cloudflare zone**   |
| `x-frame-options`             | `SAMEORIGIN`                               | **Cloudflare zone**   |
| `permissions-policy`          | `geolocation=(), microphone=(), camera=()` | **Cloudflare zone**   |
| `x-content-type-options`      | `nosniff`                                  | Pages project default |
| `referrer-policy`             | `strict-origin-when-cross-origin`          | Pages project default |
| `access-control-allow-origin` | `*` on HTML — a Pages default; leave it    | Pages project default |
| `content-security-policy`     | absent                                     | —                     |

The split is proven by `dangates.pages.dev` — the same build, no zone rules — which returns only the
three Pages defaults. **None of the security headers is in the repo**: a zone edit, account move or
Pages re-bind drops HSTS, XFO and Permissions-Policy silently and nothing in CI notices. That is the
finding (backlog §12.1) — not "add headers" but "the headers are unowned". The owner identifies the
rule (owner-actions §1.3; `docs/cloudflare-runbook.md` step 4) and deletes it once `curl` shows the
repo serving the same set.

## `public/_headers` — adopt what the zone already gives you

Copy `templates/_headers` to `public/_headers` (Phase 1, with the redirect cutover below). Pages
**merges** `_headers` with its defaults and with zone transforms, so adopting the values is additive.
What the template decides, and why:

- **HSTS `max-age=31536000`, no `preload`, no `includeSubDomains`.** `preload` is close to
  irreversible (months to leave the browser list); `includeSubDomains` waits until the owner confirms
  no non-HTTPS subdomain exists. Raising 180 d → 1 y is the normal step.
- `SAMEORIGIN` over `DENY` — leaves room to embed the site's own pages.
- `Permissions-Policy` = the live three plus `payment=()`, `usb=()`. No `interest-cohort` (obsolete).
- `/_next/static/*` → `immutable` — hashed assets. HTML keeps the Pages default
  (`max-age=0, must-revalidate`), which is what makes a deploy visible immediately; never add an HTML
  cache rule (runbook "leave these alone").

Ship it, then re-run the two `curl`s in the baseline. A header present in `_headers` but absent from
the response means the zone overrides it — worth knowing, not worth guessing.

## CSP — report-only first, always

GTM is injected via `dangerouslySetInnerHTML` (`app/layout.tsx:69-70`) and **a static export cannot
mint a per-request nonce**, so it is a hash of the inline snippet or `'unsafe-inline'` for scripts.
The template ships `Content-Security-Policy-Report-Only` with `'unsafe-inline'`. Hosts that must be
present or something breaks:

- `www.googletagmanager.com` — `script-src`, `connect-src` (`*.googletagmanager.com`), `frame-src` for
  the `<noscript>` iframe (`app/layout.tsx:58-68`); `google-analytics.com` + regional
  `*.google-analytics.com` for GA4 beacons once the property exists (owner-actions §2.4).
- `api.web3forms.com` — the lead-form POST (`components/forms/LeadForm.tsx:19`), in `connect-src` **and** `form-action`.
- `imgquarry.com` — the manifest media host (OG card; photos via `/site-images`); `/cdn-cgi/image/…` is same-origin.
- `font-src 'self' data:` (Rubik is self-hosted by `next/font`) · `style-src 'unsafe-inline'` (Next inline styles).

Two obstacles (backlog §12.2): the GTM snippet, and **the 37 redirect stubs each carry an inline
`<script>location.replace(...)</script>`** (`scripts/gen-redirects.mjs:85`) — an enforcing
`script-src` breaks every legacy URL until the cutover below removes them. Without a `report-to`
endpoint, report-only violations appear only in the browser console (a collector is an optional later
decision). **Process:** ship report-only → a week of real traffic incl. one real form submission, one
tracked call click, one legacy-URL hit → tighten → enforce. An untested enforcing CSP kills analytics
or the form silently; on a lead-gen site that is a revenue bug.

## The `_redirects` cutover — ADR 0004, backlog §1.1

The 37 legacy URLs are 200-status HTML stubs (`<meta refresh>` + canonical + `noindex` +
`location.replace`) from `scripts/gen-redirects.mjs`, built for a GitHub Pages host that is no longer
production. A stub combines `noindex` with a canonical (Google says not to), strips `gclid`/`utm`
(§13.3) and adds 45 % to the crawlable URL count. Cloudflare Pages issues real 301s from
`public/_redirects`. **One commit** for the whole cutover — a static file at a path shadows the
redirect rule, and `edge.mjs` fails on any from-path that still has a stub directory:

1. **Emit `_redirects` from the map.** Extend `scripts/gen-redirects.mjs` (`REDIRECTS` at `:25-74` is
   the machine map; `REDIRECTS.md` the human one) to write one line per pair,
   `encodeURI(from) encodeURI(to) 301` — **both columns percent-encoded**, `edge.mjs` fails on raw
   Hebrew. `REDIRECTS.md` §3 lists `/contact` with and without the slash: emit both Latin forms.
   ```
   /%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/  /locations/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/  301
   /contact/                                 /%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8/            301
   ```
2. **Drop the Houston mapping** (`/pages_automation/הנחות-סתיו-בלעדיות-לתושבי-יוסטון/`, N4) — let it
   404; sweep `REDIRECTS.md` for other foreign-market URLs (`edge.mjs` → `foreignStubs`). Keep
   `/שערים-חשמליים-ועיצוב…/ → /blog/` (the never-migrated post).
3. **Delete the 37 stub directories** in the same commit. They are `public/**/index.html`
   (`guard-protected-paths.ps1` blocks Edit/Write) and `rm -rf` / `Remove-Item -Recurse -Force` are
   hook-blocked without `-DryRun` or `-Confirm` + `# APPROVED:` — use `git rm -r -- public/<dir>`, or
   let the generator `fs.rmSync` what it no longer emits, and stop it emitting stubs at all.
   `public/services/index.html` is one of the 37; deleting it is safe because `app/services/[service]/`
   never emits `out/services/index.html` — verify after the rebuild.
4. **Retire the dead-host artifacts** (§12.4, N5): `.github/workflows/deploy.yml` (a live second origin
   publishing every push to GitHub Pages, which ignores `_redirects`), `public/CNAME`, `public/.htaccess`.
   If CI is wanted, add a build-only `ci.yml` (`npm run gate`) — `edge.mjs` flags `deploy.yml` by path.
5. **Ship `public/_headers`** (above) in the same release; fix the `next.config.mjs:6-7` comment (N7)
   and the `REDIRECTS.md` preamble ("apply at Cloudflare" → `public/_redirects`) while there.
6. **Prove it, repo side:** `npm run build` then `node scripts/audit/edge.mjs` → `stubs 0 ·
redirectsFile true · headersFile true · deadHostArtifacts 0 · foreignStubs 0`, every destination
   an emitted content page; `find out -name index.html | wc -l` → 46 (45 content + 404; today 83).
   Then `/qa-build-gate` and `/deploy-dangates` (dry run first — the user says go).
7. **Prove it, live** — three legacy URLs (a city, `/contact/`, a long blog slug), expecting `301` +
   `Location` with the query string preserved:
   ```bash
   curl -sSI "https://dangates.co.il/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test" | grep -iE '^HTTP|^location'
   #  expect: HTTP/1.1 301 · location: /locations/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test
   curl -sS "https://dangates.co.il/locations/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/" | grep -c 'application/ld+json'   # destination is a content page
   ```
   A `200` means a stub survived or `_redirects` did not ship; purge the Cloudflare cache before
   concluding it failed. `/deploy-dangates` carries the same checks post-deploy.

Keep `REDIRECTS.md` as the map; retire the stub half of `gen-redirects.mjs` once the 301s are verified
live. Leave the `public/**/index.html` deny rule in place — it stops the pattern returning. Golden
rule 3 still holds: `/איזורי-שירות/` is never renamed, with or without a 301.

## The lead form

- POSTs to `https://api.web3forms.com/submit` (`LeadForm.tsx:19`) with a **public-by-design** access
  key from the manifest — not a leaked secret (§12.5); `secret-scan.ps1` allow-lists it.
- Honeypot `company` (`LeadForm.tsx:45`); no client rate limiting — fine at this volume. The WhatsApp
  fallback carries the user's own data to the user's own app — fine; don't extend the pattern.
- **Consent:** PII collected, `/מדיניות-פרטיות/` never linked (§8.2). **Silent failure:** the error
  state renders no UI (N1, §8.6) — a lost lead is the user-facing defect. Both via `/conversion-cro`,
  reviewed by `cro-engagement-auditor`.
- **No PII in `dataLayer`** — `trackEvent("lead_submit", { form: "lead" })` (`LeadForm.tsx:97`) sends
  none; still none when §13.4 adds page/service/city (golden rule 10, `docs/event-taxonomy.md`).

## Secret hygiene and `.env.example`

The only key in the repo is the public Web3Forms key. `.env.example` has **inverse drift** (N6,
§12.3; `edge.mjs` → `envDocumented 4 / envUsed 1`): it documents `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP` and a dead `LEAD_EMAIL_TO` / `public/lead.php` path that
nothing reads — everything comes from the manifest — and omits the one variable the app does read,
`NEXT_PUBLIC_WEB3FORMS_KEY` (`LeadForm.tsx:20-21`, an optional override). Rewrite it to document exactly
that one; dead paths invite a real secret. `npm audit --omit=dev` is the run that ships; report dev-only
advisories separately.

## In-loop controls — the hooks that already enforce this

- `.claude/hooks/secret-scan.ps1` (PreToolUse Edit/Write) blocks credential-shaped strings — Cloudflare /
  GitHub / AWS tokens, private-key blocks, generic `secret=` / `api_key=` — and allow-lists the public
  fleet values (Web3Forms key, GTM id, site-verification token).
- `.claude/hooks/guard-destructive-ops.ps1` (PreToolUse Bash/PowerShell) blocks force-push, `reset --hard`,
  `git clean -f`, `rm -rf`, `Remove-Item -Recurse -Force`, `deploy-site.ps1`, `wrangler pages deploy` and
  any `api.cloudflare.com` call unless the command carries `-DryRun`, or `-Confirm` **and**
  `# APPROVED: <reason>`. Zone and DNS changes are the owner's (`docs/owner-actions.md`).
- `.claude/hooks/guard-protected-paths.ps1` + `permissions.deny` refuse writes to the stubs,
  `site.config.json`, `out/`, `vendor/`, `node_modules/`.

## Checklist

- [ ] Live headers captured with `curl -sSI` on apex **and** `pages.dev` before any change.
- [ ] `public/_headers` from `templates/_headers`; `edge.mjs` → `headersFile: true`; re-verified live;
      HSTS without `preload` (and without `includeSubDomains` until the owner confirms).
- [ ] CSP is **report-only**, observed for a full week incl. a real form submit and a legacy-URL hit.
- [ ] `_redirects` percent-encoded both columns, stubs deleted in the same commit, Houston dropped,
      `deploy.yml` / `CNAME` / `.htaccess` gone — `edge.mjs` → `stubs 0 · deadHostArtifacts 0`.
- [ ] Three legacy URLs return `301` + `Location` live, query string intact.
- [ ] Form links to the privacy policy; error state renders; no PII in `dataLayer`.
- [ ] `.env.example` documents only `NEXT_PUBLIC_WEB3FORMS_KEY`; `npm audit --omit=dev` clean or triaged.

## Gotchas

- Never verify a header from the repo — Cloudflare adds, merges and sometimes overrides, and today
  every security header comes from outside it.
- A CSP that blocks `googletagmanager.com` or `api.web3forms.com` silently kills every conversion
  signal — the pages still look fine. Enforcing `script-src` before the stubs are gone breaks all 37.
- A redirect rule whose from-path still has a static file is dead — the file wins. Delete, then deploy.
- The deploy is a production mutation: dry run, the user's go, then `-Confirm` + `# APPROVED: <reason>`.
