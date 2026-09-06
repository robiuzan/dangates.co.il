---
name: web-security-headers
description: Security posture for a static export on Cloudflare Pages — the security headers this repo owns since 2026-09 in public/_headers, adopted from the zone rule that still merges with them (HSTS without preload, XFO, nosniff, Referrer-Policy, Permissions-Policy, a report-only-first CSP around the inline GTM snippet), the public/_redirects cutover that already replaced the 37 meta-refresh stubs with real 301s and retired the GitHub Pages / Apache leftovers (ADR 0004) — live only after the next deploy, PII and consent on the lead form, .env.example drift, and secret hygiene with the repo's own hooks. Use when adding headers, planning a CSP, running the redirect cutover, or auditing security. Triggers: "security headers", "CSP", "HSTS", "_headers", "_redirects", "301", "is the form safe", "clickjacking", "כותרות אבטחה", "הפניות 301".
allowed-tools: Read, Grep, Glob, Bash
---

# Security headers & posture

`output: "export"` means Next's `headers()` and `redirects()` are unavailable. **Cloudflare Pages
reads `public/_headers` and `public/_redirects`** — Next copies `public/` verbatim into `out/`, wrangler
ships it. **This repo owns both since 2026-09-06** (ADR 0004, commit `a0e0fe2`); they take effect at
the edge only on the next deploy. Writer `rtl-frontend-engineer` (roster §3 rows §1, §12); reviewer
`security-auditor`; proof `edge.mjs`.

## Baseline — re-measure first

```bash
node scripts/audit/edge.mjs                 # _redirects, _headers, dead-host artifacts, foreign stubs, llms.txt, .env drift
curl -sSI https://dangates.co.il/      | grep -iE 'strict-transport|content-security|x-frame|permissions|referrer|content-type-options|access-control'
curl -sSI https://dangates.pages.dev/  | grep -iE 'strict-transport|x-frame|permissions'
npm audit --omit=dev                        # runtime advisories — the ones that ship
```

As of 2026-09-06 `edge.mjs` **passes**: `redirectRules 72 · stubs 0 · redirectsFile true ·
headersFile true · deadHostArtifacts 0 · foreignStubs 0 · envDocumented 1 / envUsed 1 ·
sourceMaps 0 · devBuildFiles 0`; `llmsTxt false` remains as a warning (§6.5). The cutover shipped in
commit `a0e0fe2` (ADR 0004) along with the `next.config.mjs` cPanel-comment fix (N7). Its predecessor
run, 2026-08-23, read `stubs 37 · redirectsFile false · headersFile false · deadHostArtifacts 3 ·
foreignStubs 1 · envDocumented 4 / envUsed 1`.

**`edge.mjs` measures files in the repo, not responses at the edge.** Everything below is green in
`main` and **not yet live** — the deploy that makes it real has not happened. Only the two `curl`
lines above measure reality.

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

The split is proven by `dangates.pages.dev` — the same build, no zone rules — which returned only the
three Pages defaults. The finding (backlog §12.1) was never "add headers" but "**the headers are
unowned**": a zone edit, account move or Pages re-bind drops HSTS, XFO and Permissions-Policy
silently and nothing in CI notices.

**That is fixed in the repo.** `public/_headers` has existed since 2026-09-06 (commit `a0e0fe2`) and
declares all five plus a report-only CSP — but it has not been deployed, so the table above is still
what the live domain returns. The owner identifies the zone rule (owner-actions §1.3;
`docs/cloudflare-runbook.md` step 4) and deletes it **only after** `curl` shows the repo serving the
same set — check `dangates.pages.dev` for that, since it has no zone rules in front of it.

## `public/_headers` — what shipped, and why each choice

`public/_headers` is in the repo (it came from `templates/_headers`; the template stays as the fleet
reference). Pages **merges** `_headers` with its defaults and with zone transforms rather than
replacing them, so adopting the values is additive — and until the zone rule goes, the same header
can be emitted twice, which is harmless. What it decides, and why:

- **HSTS `max-age=31536000`, no `preload`, no `includeSubDomains`.** `preload` is close to
  irreversible (months to leave the browser list); `includeSubDomains` waits until the owner confirms
  no non-HTTPS subdomain exists. Raising 180 d → 1 y is the normal step.
- `SAMEORIGIN` over `DENY` — leaves room to embed the site's own pages.
- `Permissions-Policy` = the live three plus `payment=()`, `usb=()`. No `interest-cohort` (obsolete).
- `/_next/static/*` → `immutable` — hashed assets. HTML keeps the Pages default
  (`max-age=0, must-revalidate`), which is what makes a deploy visible immediately; never add an HTML
  cache rule (runbook "leave these alone").

Deploy, then re-run the two `curl`s in the baseline. A header present in `_headers` but absent from
the response means the zone overrides it — worth knowing, not worth guessing.

## CSP — report-only first, always

GTM is injected via `dangerouslySetInnerHTML` and **a static export cannot mint a per-request
nonce**, so it is a hash of the inline snippet or `'unsafe-inline'` for scripts. `public/_headers`
ships `Content-Security-Policy-Report-Only` with `'unsafe-inline'` today (§12.2, PARTIAL). Hosts that
must be present or something breaks:

- `www.googletagmanager.com` — `script-src`, `connect-src` (`*.googletagmanager.com`), `frame-src` for
  the `<noscript>` iframe (`app/layout.tsx:58-68`); `google-analytics.com` + regional
  `*.google-analytics.com` for GA4 beacons once the property exists (owner-actions §2.4).
- `api.web3forms.com` — the lead-form POST (`components/forms/LeadForm.tsx:19`), in `connect-src` **and** `form-action`.
- `imgquarry.com` — the manifest media host (OG card; photos via `/site-images`); `/cdn-cgi/image/…` is same-origin.
- `font-src 'self' data:` (Rubik is self-hosted by `next/font`) · `style-src 'unsafe-inline'` (Next inline styles).

**One obstacle is gone.** Until 2026-09-06 the 37 redirect stubs each carried an inline
`<script>location.replace(...)</script>`, so an enforcing `script-src` would have broken every legacy
URL. The cutover below deleted them; nothing on the site relies on an inline `location.replace()` any
more. The GTM snippet is the only remaining inline script, and it is why `'unsafe-inline'` is still
in `script-src`.

Without a `report-to` endpoint, report-only violations appear only in the browser console (a
collector is an optional later decision). **Process, and §12.2 stays PARTIAL until it completes:**
deploy report-only → a week of real traffic including one real form submission, one tracked call
click and one legacy-URL hit → tighten → switch to the enforcing header. An untested enforcing CSP
kills analytics or the form silently; on a lead-gen site that is a revenue bug. Nothing has been
observed yet, because the report-only header has not been deployed.

## The `_redirects` cutover — done in the repo (ADR 0004, backlog §1.1, commit `a0e0fe2`)

**Do not re-run this. It shipped 2026-09-06.** What exists now:

- `public/_redirects` — **72 rules**, both columns percent-encoded (`edge.mjs` fails on raw Hebrew),
  covering 36 mapped paths in **both** their slashed and bare form, because Cloudflare Pages matches
  a source path literally and this export ships nothing at a bare path.
- `scripts/gen-redirects.mjs` generates it from the `REDIRECTS.md` map and is wired as
  `npm run redirects` and `prebuild`, writing only on a real change so a rebuild cannot bump the
  file's mtime and trip the staleness guard (N12). **Edit the map, then run it** — a hand-edit to
  `_redirects` is overwritten by the next build.
- The 37 stub directories, the Houston mapping (N4), `.github/workflows/deploy.yml`, `public/CNAME`
  and `public/.htaccess` are deleted. `public/_headers` shipped in the same release, and the
  `next.config.mjs` cPanel comment (N7) was corrected.

Why it mattered: each stub was a 200-status HTML page combining `<meta refresh>`, a canonical **and**
`noindex` — a combination Google explicitly advises against, since the `noindex` can be attributed to
the canonical target. They stripped `gclid`/`utm` (§13.3) and added 45 % to the crawlable URL count.
Deleting them was mandatory rather than tidy: a static asset at a path shadows its own redirect rule,
and `edge.mjs` fails on any from-path that still has a stub directory.

**If you touch the map**, the repo-side proof is unchanged: `npm run redirects` (then
`git status --porcelain public/` clean), `npm run build`, `node scripts/audit/edge.mjs` →
`redirectRules · stubs 0 · redirectsFile true · headersFile true · deadHostArtifacts 0 ·
foreignStubs 0`, `find out -name index.html | wc -l` → 46 (45 content + `/404/`), every destination
an emitted content page. Then `/qa-build-gate` and `/deploy-dangates` (dry run first — the user says
go).

**Still open: prove it live.** Nothing above is served until the next deploy. Probe three legacy URLs
(a city, `/contact/`, a long blog slug), expecting `301` + `Location` with the query string preserved:

```bash
curl -sSI "https://dangates.co.il/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test" | grep -iE '^HTTP|^location'
#  expect: HTTP/1.1 301 · location: /locations/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test
curl -sS "https://dangates.co.il/locations/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/" | grep -c 'application/ld+json'   # destination is a content page
```

A `200` means a stub survived or `_redirects` did not ship; purge the Cloudflare cache before
concluding it failed. `/deploy-dangates` carries the same checks post-deploy.

`REDIRECTS.md` stays the map and `gen-redirects.mjs` stays the generator — its stub half is gone, not the script. The `public/**/index.html` deny rule stays too, even with nothing left to guard: it stops the pattern returning. Golden rule 3 still holds: `/איזורי-שירות/` is never renamed, with or without a 301.

## The lead form

- POSTs to `https://api.web3forms.com/submit` (`LeadForm.tsx:19`) with a **public-by-design** access
  key from the manifest — not a leaked secret (§12.5); `secret-scan.ps1` allow-lists it.
- Honeypot `company` (`LeadForm.tsx:45`); no client rate limiting — fine at this volume. The WhatsApp
  fallback carries the user's own data to the user's own app — fine; don't extend the pattern.
- **Consent:** PII collected, `/מדיניות-פרטיות/` never linked (§8.2) — still open, via `/conversion-cro`, reviewed by `cro-engagement-auditor`. **Silent failure is fixed** (N1 ✅ 2026-09-06): the error state renders a `role="alert"` block with a real WhatsApp link and a `tel:` link, and reports `lead_error` with a `reason`. §8.6 stays PARTIAL only because nothing consumes that event yet.
- **No PII in `dataLayer`** — `trackEvent("lead_submit", { form: "lead" })` (`LeadForm.tsx:97`) sends
  none; still none when §13.4 adds page/service/city (golden rule 10, `docs/event-taxonomy.md`).

## Secret hygiene and `.env.example`

The only key in the repo is the public Web3Forms key. `.env.example` has **inverse drift** (N6, §12.3) — **fixed 2026-09-06 in commit `a0e0fe2`; `edge.mjs` now reads `envDocumented 1 / envUsed 1`.** It used to document `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP` and a dead `LEAD_EMAIL_TO` / `public/lead.php` path that
nothing read — everything comes from the manifest — while omitting the one variable the app does read,
`NEXT_PUBLIC_WEB3FORMS_KEY` (an optional override). It now documents exactly that one; keep it that way — a dead path in `.env.example` invites a real secret. `npm audit --omit=dev` is the run that ships; report dev-only
advisories separately.

## In-loop controls — the hooks that already enforce this

- `.claude/hooks/secret-scan.ps1` (PreToolUse Edit/Write) blocks credential-shaped strings — Cloudflare /
  GitHub / AWS tokens, private-key blocks, generic `secret=` / `api_key=` — and allow-lists the public
  fleet values (Web3Forms key, GTM id, site-verification token).
- `.claude/hooks/guard-destructive-ops.ps1` (PreToolUse Bash/PowerShell) blocks force-push, `reset --hard`,
  `git clean -f`, `rm -rf`, `Remove-Item -Recurse -Force`, `deploy-site.ps1`, `wrangler pages deploy` and
  any `api.cloudflare.com` call unless the command carries `-DryRun`, or `-Confirm` **and**
  `# APPROVED: <reason>`. Zone and DNS changes are the owner's (`docs/owner-actions.md`).
- `.claude/hooks/guard-protected-paths.ps1` + `permissions.deny` refuse writes to `site.config.json`, `out/`, `out.prev/`, `vendor/`, `node_modules/`, `.next/` and `public/**/index.html` (the stub pattern, kept after the stubs themselves were deleted).

## Checklist

- [ ] Live headers captured with `curl -sSI` on apex **and** `pages.dev` before any change.
- [ ] `public/_headers` present; `edge.mjs` → `headersFile: true`; **re-verified live after the deploy**; HSTS without `preload` (and without `includeSubDomains` until the owner confirms).
- [ ] CSP is **report-only**, observed for a full week incl. a real form submit and a legacy-URL hit.
- [ ] `_redirects` regenerated from the map and committed (`git status --porcelain public/` clean), both columns percent-encoded — `edge.mjs` → `stubs 0 · deadHostArtifacts 0 · foreignStubs 0`.
- [ ] Three legacy URLs return `301` + `Location` live, query string intact.
- [ ] Form links to the privacy policy (still open, §8.2); error state renders (done); no PII in `dataLayer`.
- [ ] `.env.example` still documents only `NEXT_PUBLIC_WEB3FORMS_KEY`; `npm audit --omit=dev` clean or triaged.

## Gotchas

- Never verify a header from the repo — Cloudflare adds, merges and sometimes overrides. `public/_headers` declaring a value is not the same as the edge sending it, and until the owner deletes the zone rule the same header can arrive twice.
- A CSP that blocks `googletagmanager.com` or `api.web3forms.com` silently kills every conversion
  signal — the pages still look fine. That is why the CSP is report-only and stays that way until a week of real traffic has been observed.
- A redirect rule whose from-path still has a static file is dead — the file wins. Delete, then deploy.
- The deploy is a production mutation: dry run, the user's go, then `-Confirm` + `# APPROVED: <reason>`.
