# UX, conversion & security — the standards

> **Layer:** standards. This file decides what a conversion path, the lead form, the navigation and
> the edge posture must look like on dangates.co.il. The `conversion-cro`, `engagement-ux`,
> `internal-linking` and `web-security-headers` skills are the how-to; `cro-engagement-auditor` and
> `security-auditor` audit against this file; `cta-coverage.mjs`, `a11y.mjs`, `links.mjs` and
> `edge.mjs` measure it. Reads with: [event-taxonomy.md](event-taxonomy.md),
> [data-tracking-infrastructure.md](data-tracking-infrastructure.md),
> [accessibility-and-i18n.md](accessibility-and-i18n.md),
> [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md),
> [business-facts.md](business-facts.md), [owner-actions.md](owner-actions.md),
> [cloudflare-runbook.md](cloudflare-runbook.md),
> [decisions/0004-redirects-replace-stubs.md](decisions/0004-redirects-replace-stubs.md).
>
> The one rule: **a conversion path that lies, loses a lead silently, or cannot be counted is a
> defect, not a style choice.** The site converts on a call to `072-2587772`; everything below
> protects that call — the CTA that offers it, the form that catches the after-hours version of it,
> the navigation that gets a reader to it, and the headers that keep the page carrying it intact.

---

## 0. Current state — verified 2026-08-24

Numbers are `docs/audits/2026-08-24-full.md`; headers, `www`, the crawler probe and the deploy state
were re-verified with `curl` on 2026-09-06. `§` marks a backlog id; "see 4.3" points inside this file.

| Surface                   | Measured                                                                                                                                                                                                                                               | Backlog                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| CTAs (`cta-coverage.mjs`) | 113 elements on 45 pages, **24 without `data-cta`** from 9 source elements, 8 distinct values; `/מחירון/` has no CTA in `<main>`                                                                                                                       | §13.2, §8.5               |
| Lead form (source, §8)    | `noValidate`, no `aria-invalid`, no phone pattern (`a11y.mjs`); no consent line, `city` never collected, delivery failure renders no UI, no `/תודה/`; `lead_submit` pushes `{ form: "lead" }` only                                                     | §8.1–§8.6, N1, §13.4      |
| Navigation (`links.mjs`)  | header reaches 0 services / 0 locations; footer omits 6 of 18 locations; related links by array order; breadcrumbs 44/44; 9 of 10 FAQ answers `display:none`                                                                                           | §9.1–§9.4, §9.6 ✅, N8    |
| Headers (`edge.mjs`)      | `headersFile: false` — all five live security headers come from a Cloudflare zone rule; no CSP                                                                                                                                                         | §12.1, §12.2              |
| Redirects / origins       | `stubs: 37`, `redirectsFile: false`, `foreignStubs: 1`, `deadHostArtifacts: 3`; the GitHub Pages origin still answers; `www` serves a full duplicate (200 on 2026-09-06)                                                                               | §1.1, §12.4, N4, N5, §1.7 |
| Edge bot policy (zone)    | AI crawlers **200** on the full-UA probe, verified 2026-09-06 (owner-actions 1.1 ✅); blocked 2026-08-16 (managed `robots.txt`) and 2026-08-23 (enforced 403) — can revert with no repo change; `llms.txt` 404                                         | §6.1 ✅, §6.2–§6.5        |
| Live vs repo              | **Phase 0 deployed 2026-09-06** (11:06 UTC; previous deploy 2026-08-03). Until then the live homepage served ten `Review` nodes + `AggregateRating` and doubled location titles — gone from the repo since 2026-08-17, off the domain since the deploy | Sprint 0 ✅               |
| Secrets / dependencies    | none in the repo; `.env.example` drifts both ways (4 documented / 1 used); `npm audit --omit=dev` → 3 high, `postcss` inside `next`, build-time only                                                                                                   | §12.3, N6, N17            |

## 1. The conversion model

### 1.1 Three actions, one order

| #   | Action         | Why it ranks here                                                                                | Instrumented as                            |
| --- | -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| 1   | **Phone call** | A stuck gate is a now-problem; the call closes on the call. Highest intent, zero friction.       | `data-cta="*-call"` → `tel_click`          |
| 2   | **WhatsApp**   | Lets the customer send the evidence (see 1.2) — how a gate quote gets real.                      | `data-cta="*-whatsapp"` → `whatsapp_click` |
| 3   | **Lead form**  | After-hours and for people who will not call. Slowest path; the only one that can fail silently. | `lead_submit` + the `/תודה/` page view     |

Every page keeps #1 and #2 within reach: the header call button, `MobileCtaBar` (fixed, `lg:hidden`,
with the `h-16 lg:hidden` spacer in `app/layout.tsx`), and `FinalCta` on the 8 routes that render it
(41 of 45 pages). **The WhatsApp caveat, stated once.** WhatsApp on `072-2587772` is 🔶 — the old
WordPress site never advertised it (owner-actions 3.7). The CTA stays until the owner answers; on a
no, every `*-whatsapp` element goes in one pass, `MobileCtaBar` becomes a single call button, and
the form's fallback (see 2.2) becomes a `tel:` link only. Nothing else may depend on WhatsApp until then.

### 1.2 The photo bridge — adapted for gates

For a gate, the quote gets real when the customer sends **a photo or a short video of the gate, the
motor, the לוח פיקוד or the fault itself** (the gate stopping, the noise, the עינית LED). That
removes the biggest objection — how much, really — before anyone drives out, and it is claim-free
trust. Today every prefill says `…בהצעת מחיר לתיקון/התקנת שער חשמלי` (hero, sticky bar, `FinalCta`,
form, contact page) or `…ל${card.name}` (service sidebar); none asks for it. Rule for every `whatsappHref(...)`:

- invite the photo/video in the first line;
- carry the **service** from the current route (`card.name`, or the form's selected service) and the
  **city** on a location page — the business learns whether it can take the job before replying;
- no promised response time (`תוך שעה`, `מיד`) — business-facts §E; גרש/גרשיים, no emoji. Copy is
  `hebrew-copywriter`'s, reviewed by `hebrew-editor` → `claims-verifier`.

### 1.3 CTA placement per page type

| Page type          | Required positions                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home               | `Hero` call + WhatsApp + the form card; `FinalCta`                                                                                                                 |
| Service            | sidebar call + WhatsApp (untagged today, ×7); a pair **directly after the unresolved-variable block** (the `triggers` bullets, Phase 3); `FinalCta`                |
| Location           | a pair after the answer block once Phase 3 gives the page one; `FinalCta`                                                                                          |
| Pricing            | **none today** (§8.5) — `pricing-call` + `pricing-whatsapp` beside the contact link, or `FinalCta`; the copy pivot is N14, a separate change                       |
| Contact            | the form, call, WhatsApp, email — all untagged today                                                                                                               |
| Post / guide       | **≤ 2 inline CTA blocks**, each after an unresolved-variable block, at most one the WhatsApp bridge (`engagement-ux`); build-enforced in `lib/guides.ts` (Phase 4) |
| `/תודה/` (planned) | `thanks-call` + `thanks-whatsapp` as the immediate second touch (§8.3); legal pages and the 404 need nothing beyond the chrome                                     |

A CTA earns its place by resolving the uncertainty the paragraph above it created (`…שם נדרש טכנאי`
→ the pair). One that appears because the reader is 40 % down the page reads as an ad. Never a CTA
before the page has delivered value — no exit-intent, no timed modal, no self-opening chat (see 3.3).

### 1.4 Every CTA carries `data-cta`

GTM's click triggers read the attribute and no JS ships for them — **an untagged CTA is a click
nobody will ever count.** Convention `{location}-{action}`, exactly two lower-case tokens
(`cta-coverage.mjs` warns outside `^[a-z0-9]+-[a-z0-9]+$`). In source today (closed 2026-09-06, all
24 tel/WhatsApp/mailto/submit elements tagged, `cta-coverage.mjs` exit 0): `header-call`,
`hero-call`, `hero-whatsapp`, `sticky-call`, `sticky-whatsapp`, `finalcta-call`,
`finalcta-whatsapp`, `footer-call`, `service-call`, `service-whatsapp`, `contact-call`,
`contact-whatsapp`, `contact-email`, `footer-email`, `form-submit`, `form-whatsapp`, `form-call`,
`pricing-contact`. Since 2026-10-12 the fleet live-kit adds five more in the same convention,
printed by the locked `lib/live/render.mjs` (CLAUDE.md §14): `popup-call`, `popup-whatsapp` and
`popup-link` (the seasonal card), `topbar-link` (the bar), `update-link` (the homepage strip) —
the export then reads 115 elements, 26 distinct tagged, 19 values. Still to add: `pricing-*` beyond `pricing-contact`, `thanks-*`, `article-*`. The
container maps the prefix to `placement` ([event-taxonomy.md](event-taxonomy.md)) and reads
`closest('a[data-cta]')` because icons sit inside the anchors. The WhatsApp fallback in `LeadForm`
(`form-whatsapp`, `placement: "form"`) pushes `whatsapp_click` explicitly since it opens via
`window.open`, not a plain anchor click (see 2.2).

### 1.5 What a CTA may not say

No invented testimonial, rating, badge, countdown or "X customers this month". The ten fabricated
reviews are gone from the repo since 2026-08-17 and off the domain since the Sprint 0 deploy on 2026-09-06 — nothing may be built on the assumption that the live page is the repo; probe first. No
`24/7` or `מיד` in an emergency CTA until business-facts §E is ✅ — `FinalCta` and `Hero` carry it
today (§7.2: four claims, 168 renders on 42 pages as of 2026-08-24) beside a footer whose hours end
at 18:00 (§7.6). Usable now: the sourced 150–350 ₪ visit fee, the process, the hours,
`אחריות על העבודה` (`claims-grep.mjs`, `claims-verifier`).

## 2. The lead form — what is right, and the target spec

`components/forms/LeadForm.tsx` posts JSON to `https://api.web3forms.com/submit`, which emails the
lead to the business inbox; there is no backend. Read it end to end before touching it.

### 2.1 Already right — do not regress

- Only name and phone required; every field has a real `<label htmlFor>`; honeypot `company`;
  `dir="ltr"`, `type="tel"`, `inputMode="tel"`, `autoComplete="tel"`; submit `disabled` while sending.
- WhatsApp fallback on delivery failure with the form contents pre-composed (`buildWhatsapp`).
- `trackEvent("lead_submit")` fires **only on a confirmed send**, outside the `try`; the dev
  simulation does not fire it, and analytics never shares a failure path with delivery.

### 2.2 The gaps, as a target spec

| #   | Gap (backlog)                      | Required end state                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Silent delivery failure (N1, §8.6) | `status === "error"` renders a `role="alert"` block: what happened, a real `<a data-cta="form-whatsapp">` with the `buildWhatsapp` href (a link cannot be popup-blocked), a `tel:` link, submit re-enabled. `window.open` returning `null` pushes `lead_error` with `reason` ∈ `network \| http_<code> \| popup_blocked`; both `window.open` paths push `whatsapp_click`.                                            |
| 2   | Validation and a11y (§8.1)         | Per-field `errors`; each message in `<p id="lf-<field>-error">` bound by `aria-describedby`, `aria-invalid={!!errors.field}`; focus moves to the first invalid field; `aria-busy` while sending, an `aria-live="polite"` status. Keep `noValidate` — Hebrew messages, but per field.                                                                                                                                 |
| 3   | Phone format (§8.1)                | Strip spaces and dashes, accept `^0\d{8,9}$` or `^\+972\d{8,9}$`: 9-digit landlines (02/03/04/08/09), 10-digit `05x` mobiles **and** 10-digit `072`/`073`/`077` lines — this business is `072-`. Reject with the expected shape shown; never silently normalise. `text-right` on the input → `text-end`.                                                                                                             |
| 4   | Consent (§8.2)                     | One line beside the button, not a checkbox: contact by phone or WhatsApp; details go to the business inbox via Web3Forms; not used for mailing; link to `/מדיניות-פרטיות/`. **The policy must name Web3Forms as processor and mention GTM** — today it names neither. Copy: `hebrew-copywriter` → `hebrew-editor`.                                                                                                   |
| 5   | City (§8.4)                        | Optional `<select id="lf-city" name="city">` from `locations` in `lib/site-config.ts` (value = slug, label = name, plus `אחר`). Sent in the Web3Forms body and as `city` on `lead_submit`. Delete the dead `types/index.d.ts` declaration (N3).                                                                                                                                                                      |
| 6   | Thank-you route (§8.3)             | `app/תודה/page.tsx` (planned): `robots: { index: false }`, excluded from `sitemap.ts`, no word floor (`thanks: 0` in `thresholds.json`); says what happens next; `thanks-call` `tel:` link, `thanks-whatsapp`, a link to `/שירותים/`. `LeadForm` pushes `lead_submit`, then `window.location.assign("/%D7%AA%D7%95%D7%93%D7%94/")` — the page view is the countable conversion. Keep the inline success as fallback. |
| 7   | Dimensions, funnel (§13.4, §13.5)  | `lead_submit` carries `page`, `service`, `city` (slugs or `""`), `placement`, `site: "dangates"`; `form_start` once on first interaction; `form_submit_attempt` before validation. Never the name, phone, email or message (golden rule 10).                                                                                                                                                                         |

### 2.3 The Web3Forms key is public by design (§12.5 HOLDS)

`siteConfig.formAccessKey` (with the `NEXT_PUBLIC_WEB3FORMS_KEY` dev override) is a browser-side
key: it only addresses the inbox it was issued for and sits in every visitor's HTML by construction,
so rotating it changes nothing about who can POST. Not a secret, never reported as leaked —
`secret-scan.ps1` allow-lists it. Mitigations: the honeypot (weak), Web3Forms' rate limiting, the
inbox; if spam becomes real, Web3Forms' captcha option.

## 3. Navigation & information architecture

### 3.1 The one-hop rule, and RTL ergonomics

The header must reach **all 7 services and all 18 locations in one hop**, listed from `services` /
`locations` — never a hand-typed subset (§9.1). The footer's `.slice(0, 12)` drops אשקלון, באר שבע,
דרום, צפון, קריות and שרון from the chrome (§9.2). Proof: `links.mjs` → `notInChrome: 0`,
`chromeLinks: 34` (28 + the 6 missing, as of 2026-08-24). The mobile menu gets `aria-controls`,
Escape and focus return in the same pass (§11.4). `dir="rtl"` mirrors flex and grid — never
`flex-row-reverse` except to wrap an LTR island; logical utilities only (CLAUDE.md §6, `hebrew-rtl`,
`rtl-lint.mjs`); phone and email are `dir="ltr"` islands ([accessibility-and-i18n.md](accessibility-and-i18n.md)).

### 3.2 Mesh, relatedness, breadcrumbs

- Service ↔ location is one-way today (§9.3); Phase 3 adds `nearby` and `relatedServices` to the
  data. Related items by relevance, not `.slice(0, 4)` (§9.4); every sibling receives at least one
  inbound related link; cards carry `data-related="service|location|guide|post"` for `related_click`.
- `PageHeader` renders the trail **and** emits `BreadcrumbList` from the same `crumbs` array, mapping
  `{label, href}` to the kit's `{name, path}` through `schemaPath()`. Never add a second
  `BreadcrumbList`; when Phase 2 moves the node into one `@graph`, `PageHeader` stops emitting its
  own script in the same change (schema-graph §7).
- **Hrefs end in `/`.** The export runs `trailingSlash: true`; canonicals and `sitemap.xml` are the
  slashed, percent-encoded form. Source carries it too: `navItems` in `lib/content.ts`, crumb hrefs,
  the `PricingTeaser` contact link and the footer quick links all omit it (N10). `/איזורי-שירות/`
  keeps its spelling — golden rule 3. The nine static routes come from the `staticPages` registry in `lib/site-config.ts` (§1.4, done 2026-09-06); `/תודה/` joins it with the `noindex` flag, never the sitemap.

### 3.3 Page-level UX rules

- **No pop-ups, exit-intent, timed modals or third-party chat widgets.** INP on an "almost no JS"
  site; focus and CLS liabilities against `/הצהרת-נגישות/`; `MobileCtaBar` already owns the
  persistent prompt; a chat bubble adds a CSP origin (see 4.3). Nothing else fixed on mobile; 44 px
  targets; test at 360 px with the bar visible ([mobile-ux-and-personalization.md](mobile-ux-and-personalization.md)).
- **A TOC past ~900 words / 4+ H2s**, derived at build, zero client JS, one visible variant per
  viewport, `aria-label="תוכן העניינים"`. No page qualifies yet; re-check when `/מדריכים/` lands.
- **FAQ is `<details>`/`<summary>` with every answer in the DOM** (N8): a server component, first
  item `open`, the `FaqItem` shape kept so `faqJsonLd` parity holds; one Q/A in one `FAQPage` sitewide.
- **Exit order:** body → related services → locations → FAQ → guides → `FinalCta`; the FAQ is the
  last objection handler and `FinalCta` is never the only exit. One primary action per page; a
  stated price basis beats price hiding — and beats an invented price (§7.3).

## 4. Security — a static export behind Cloudflare Pages

No server, API route, middleware or database. The surface is **response headers, the third-party
form path, the injected analytics, the zone's bot policy, and the deploy chain.** Calibrate: one
form, not a bank.

### 4.1 Response headers — live values and who owns them

`curl -sSI https://dangates.co.il/` on 2026-09-06, identical to the 2026-08-24 report (H10):

| Header                        | Live value                                 | Source                                 | Repo opinion |
| ----------------------------- | ------------------------------------------ | -------------------------------------- | ------------ |
| `Strict-Transport-Security`   | `max-age=15552000` (180 d, no subdomains)  | Cloudflare zone rule                   | none         |
| `X-Frame-Options`             | `SAMEORIGIN`                               | Cloudflare zone rule                   | none         |
| `Permissions-Policy`          | `geolocation=(), microphone=(), camera=()` | Cloudflare zone rule                   | none         |
| `X-Content-Type-Options`      | `nosniff`                                  | Pages project default (runbook step 4) | none         |
| `Referrer-Policy`             | `strict-origin-when-cross-origin`          | Pages project default (runbook step 4) | none         |
| `Access-Control-Allow-Origin` | `*`                                        | Pages project default (runbook step 4) | leave it     |
| `Content-Security-Policy`     | absent                                     | —                                      | see 4.3      |

The zone/default split is cloudflare-runbook step 4's diagnostic (2026-08-23): `dangates.pages.dev`,
the same build with no zone rules, returned only the three Pages defaults. **The finding is
ownership, not absence** (§12.1): a zone change drops HSTS, XFO and Permissions-Policy silently.
Verify against the live response, never the repo; the owner identifies the rule (owner-actions 1.3)
and deletes it once `curl` shows the repo serving the same set. `www.dangates.co.il` also serves the
full site (§1.7) — mitigated by apex-only canonicals and sitemap; the 301 is the owner's zone
Redirect Rule (owner-actions 1.2, runbook step 3).

**The bot policy is a zone setting too.** As of 2026-09-06 the full-UA probe
(`curl -sS -A "ClaudeBot" -o /dev/null -w "%{http_code}" https://dangates.co.il/`) returns 200 for
ClaudeBot, OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, Perplexity-User and `CCBot/2.0`
(§6.1 ✅, owner-actions 1.1 ✅). It was 403 from 2026-08-23, a managed `robots.txt` block before
that, and either can return with no repo change — the probe is the first step of every AEO finding
(`aeo-answer-content` Gate 1, runbook step 1). The per-bot list in `app/robots.ts` (commit `6f4a1a8`) went live with the Sprint 0 deploy on 2026-09-06.

### 4.2 Adopt them into `public/_headers`

Copy `.claude/skills/web-security-headers/templates/_headers` to `public/_headers` (Phase 1, with
4.4 below). Pages **merges** `_headers` with its defaults and zone transforms — a doubled header
until the zone rule is gone is harmless. The template is the decision, and its comments carry the
reasons: HSTS at one year with **no `preload`** (close to irreversible) and **no `includeSubDomains`**
until the owner confirms the subdomain inventory, the same four other headers as live, immutable
`/_next/static/*`, never an HTML cache rule. Proof: `edge.mjs` → `headersFile: true`, then both
`curl`s in the template's header comment.

### 4.3 CSP — report-only first, always

Two obstacles (§12.2): GTM is injected via `dangerouslySetInnerHTML` and a static export cannot mint
a per-request nonce, so `script-src` needs `'unsafe-inline'` (do not hash the snippet — the container
rewrites itself). The second obstacle is gone: **the 37 stubs and their inline
`<script>location.replace(...)</script>` were deleted on 2026-09-06** (4.4), so nothing but the GTM
snippet now needs `'unsafe-inline'`. The template's
`Content-Security-Policy-Report-Only` line is the directive set (`api.web3forms.com` must sit in
**both** `connect-src` and `form-action`); the `web-security-headers` skill carries the tightening
procedure. No `report-to` endpoint exists, so violations surface only in the browser console.
Process: report-only → a week of real traffic including one form submission, one tracked call click
and one legacy-URL hit → tighten → enforce. **Never enforce before the `_redirects` cutover.** Every
new third-party origin (an events hook, a photo host, a chat widget) needs a directive in the same change.

### 4.4 The `_redirects` cutover — ADR 0004 · shipped to the repo 2026-09-06 (`a0e0fe2`)

One commit, per the ADR: emit `public/_redirects` from the `REDIRECTS.md` map, **both columns
percent-encoded**, `301`; delete the 37 stub directories in the same change (a static file at a path
shadows the rule; they are hook-protected `public/**/index.html`, so `git rm -r` — not blocked by
the destructive-ops hook — or let the generator stop emitting them); drop the Houston mapping (N4);
retire `.github/workflows/deploy.yml`, `public/CNAME` and `public/.htaccess` (§12.4, N5) — a second
origin that ignores `_redirects` is worse once the stubs are gone; ship `_headers` alongside; fix the
cPanel comment in `next.config.mjs` (N7). A real 301 keeps the query string, so `gclid`/`utm` on
legacy entries is fixed for free (§13.3); the owner unpublishes GitHub Pages (audit §4). **Done in
the repo on 2026-09-06** — 72 rules for the 37 pairs, since each is emitted in its slashed and bare
form (Cloudflare matches a source literally and nothing is served at the bare path). Live only after
the next deploy. Proof:
`edge.mjs` → `stubs: 0`, `redirectsFile: true`, `headersFile: true`, `deadHostArtifacts: 0`,
`foreignStubs: 0`; three legacy URLs live return `301` + `Location` with `?utm_source=test` intact
(today `/חולון/` is a 200 stub). Deploying is a production mutation — dry run, the user's go, then
`-Confirm` + `# APPROVED:` (`deploy-dangates`).

### 4.5 The form path — PII, processing, disclosure

- **What leaves the origin:** name, phone, optional service and free text (and `city` after 2.2),
  over HTTPS to `api.web3forms.com`, then by email to `info@dangates.co.il`. The consent line and
  `/מדיניות-פרטיות/` say exactly that, name Web3Forms as the processor, and state that GTM loads on
  every page. Today the policy promises no transfer `שלא לצורך מתן השירות` without naming the one it uses.
- **Retention:** 🔶 — nobody has stated how long the inbox keeps a lead or whether Web3Forms retains
  submissions; the owner decides and the policy states it. **The WhatsApp fallback** carries the
  user's own data into the user's own app — fine; do not extend the pattern. **No PII in `dataLayer`**,
  ever (golden rule 10). No client rate limiting (see 2.3).

### 4.6 Secret hygiene and dependency risk

- No server, so no server secret; the only key in the repo is the public Web3Forms key, and
  `NEXT_PUBLIC_*` is never a secret by definition. `wrangler`'s credentials live in the environment
  that runs `ops/deploy-site.ps1`, never in the repo or a log.
- `.env.example` drifts both ways (N6, §12.3): it documents `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP` and a dead `LEAD_EMAIL_TO` / `public/lead.php` path
  nothing reads, and omits `NEXT_PUBLIC_WEB3FORMS_KEY`, the one variable the app does read. Rewrite
  it to that one line — dead paths invite a real secret being wired into one.
- `secret-scan.ps1` blocks credential-shaped strings on every Edit/Write (public fleet values
  allow-listed); `guard-destructive-ops.ps1` blocks deploys and Cloudflare/DNS calls without
  `-DryRun` or `-Confirm` + `# APPROVED:`.
- Run `npm audit --omit=dev` and `npm audit` **separately** — a devDependency advisory on a static
  export is informational. N17: 3 high, the `postcss` source-map family inside `next`'s own tree,
  build-time only — the next planned major, not a release blocker. `framer-motion` was imported nowhere
  and was uninstalled on 2026-09-06 (§10.3). Six `dangerouslySetInnerHTML` uses (JSON-LD, GTM), no user input
  reaching them; `sourceMaps: 0`, `devBuildFiles: 0`, `spamHits: 0` (`security-auditor`, 2026-08-24).

## 5. Explicitly not doing

| Decision                                                                | Reason                                                                                                                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No pop-ups, exit-intent, chat widgets, countdowns                       | INP, the accessibility statement, the sticky bar exists, an extra CSP origin; fake urgency is a lie (1.5, 3.3)                                                           |
| No enforcing CSP before the stubs are gone; no hashed GTM snippet       | 37 inline scripts break; an untested CSP kills GTM or the form silently; the container rewrites itself, so `'unsafe-inline'` is the documented trade-off (4.3)           |
| No HSTS `preload`, no `includeSubDomains` yet                           | Preload is effectively irreversible; the subdomain inventory is unconfirmed (4.2)                                                                                        |
| No consent checkbox; no 18-city-only `<select>`; no homegrown anti-spam | An inline statement is enough for a callback request; `אחר` keeps everyone outside the published set (2.2); the key is public and escalation is Web3Forms' captcha (2.3) |
| No renaming `/איזורי-שירות/`; no HTML cache rule                        | Golden rule 3; the Pages default is what makes a deploy visible immediately (4.2)                                                                                        |
| No repo-side "fix" for the crawler block; no trusting `robots.txt`      | The block was a zone setting both times; only the full-UA probe proves the state (4.1, `aeo-answer-content` Gate 1)                                                      |

## 6. Enforcement map

| Rule                                                                                                                           | Script                                                                                                           | Hook / rule                                              | Skill · agent                                                     | Not yet → backlog                                 |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| Two-token `data-cta` on every CTA; hard CTA on commercial pages                                                                | `cta-coverage.mjs` (fail missing, warn off-convention / no CTA)                                                  | —                                                        | tracking-analytics · cro-engagement-auditor                       | §13.2, §8.5                                       |
| WhatsApp prefill invites photo + service + city; no 🔶 promise                                                                 | `claims-grep.mjs`                                                                                                | `post-edit-lint.ps1` (claims in copy)                    | conversion-cro · hebrew-editor → claims-verifier                  | prefill: not yet → §8                             |
| ≤ 2 CTA blocks per guide, after unresolved variables                                                                           | module-load throw in `lib/guides.ts` (planned)                                                                   | —                                                        | engagement-ux · article-auditor                                   | Phase 4                                           |
| Form: error state renders + `lead_error`; per-field a11y; Israeli phone pattern                                                | `a11y.mjs` (source checks on `LeadForm.tsx`; error state not yet checked)                                        | —                                                        | conversion-cro · cro-engagement-auditor · perf-a11y-auditor       | N1, §8.6, §8.1                                    |
| Consent line; policy names Web3Forms and GTM                                                                                   | —                                                                                                                | —                                                        | conversion-cro · security-auditor · hebrew-editor                 | §8.2                                              |
| `city` collected; `lead_submit` dimensions, confirmed send only, no PII; `form_start`; `/תודה/` noindex and out of the sitemap | `links.mjs` (sitemap ↔ export parity) once `/תודה/` exists                                                       | —                                                        | conversion-cro · tracking-analytics · seo-auditor                 | §8.3, §8.4, §13.4, §13.5; golden rule 10 standing |
| Header one-hop; footer all 18; relevance-based related; breadcrumb ↔ `BreadcrumbList` parity, one per page                     | `links.mjs` (`notInChrome`, `chromeLinks`, related warnings, `breadcrumbPages`), `schema.mjs`                    | `.claude/rules/schema-jsonld.md`                         | internal-linking · seo-auditor · schema-auditor                   | §9.1–§9.4; ✅ holds (§9.6)                        |
| Logical RTL utilities; menu focus management; hrefs end in `/`                                                                 | `rtl-lint.mjs`; `a11y.mjs` (warn on `Header.tsx`)                                                                | `post-edit-lint.ps1`, `.claude/rules/rtl-markup.md`      | hebrew-rtl · responsive-accessibility · ts-react-reviewer         | §11.5, §11.4, N10                                 |
| No pop-ups, nothing else fixed; TOC; FAQ in the DOM                                                                            | `perf.mjs` (client components, deps), `a11y.mjs` (N8), `content-depth.mjs`                                       | —                                                        | engagement-ux · cro-engagement-auditor                            | N8; TOC with Phase 4                              |
| `public/_headers` with the five headers, verified live; CSP report-only before enforcing                                       | `edge.mjs` (`headersFile`); `curl -sSI` (manual)                                                                 | —                                                        | web-security-headers · security-auditor                           | §12.1, §12.2                                      |
| AI crawlers answer 200 at the edge; re-probe before every AEO claim; `llms.txt` shipped                                        | full-UA `curl` probe (manual, owner zone); `edge.mjs` (`llmsTxt`)                                                | —                                                        | aeo-answer-content · aeo-geo-strategist · owner                   | §6.1 ✅ (verified 2026-09-06); §6.2–§6.5          |
| `_redirects` 301s, stubs gone, dead hosts retired; `www` → apex 301 (owner)                                                    | `edge.mjs` (`stubs`, `redirectsFile`, `deadHostArtifacts`, `foreignStubs`); `curl` (runbook step 3)              | `guard-protected-paths.ps1`, `guard-destructive-ops.ps1` | web-security-headers · deploy-dangates · security-auditor · owner | §1.1, §12.4, N4, N5; §1.7 (owner-actions 1.2)     |
| No secret in the repo; `.env.example` matches usage; dependencies triaged; export hygiene                                      | `edge.mjs` (`envDocumented` / `envUsed`, `sourceMaps`, `devBuildFiles`); `npm audit --omit=dev`; `spam-grep.mjs` | `secret-scan.ps1`, `post-edit-lint.ps1` (spam lexicon)   | web-security-headers · security-auditor                           | N6, §12.3, N17, §10.3; ✅ §10.4                   |

## 7. Acceptance checklist

Every line is a command or a named agent. Rebuild first (N12); the live domain lags the repo until Sprint 0 deploys.

- [ ] **Conversion.** A call action is reachable without scrolling at 360 px and on desktop on every
      page; both `MobileCtaBar` halves ≥ 44 px; `node scripts/audit/cta-coverage.mjs` → 0 failures,
      0 warnings, every value two tokens; every WhatsApp prefill invites a photo/video and carries
      the route's service and city; `claims-grep.mjs` → no live 🔶 phrase in any CTA;
      `claims-verifier` signed the copy; guides ≤ 2 inline CTA blocks (`article-auditor`).
- [ ] **Form.** `status === "error"` renders a message, a `form-whatsapp` link and a `tel:` link,
      `lead_error` fires with `reason`, both `window.open` paths push `whatsapp_click`; per-field
      `aria-invalid` + `aria-describedby` with focus on the first invalid field and
      `node scripts/audit/a11y.mjs` clean on `LeadForm.tsx`; phone accepts landlines, `05x` and
      `072…`; consent line links `/מדיניות-פרטיות/` and the policy names Web3Forms and GTM; `city`
      sent in the email and on `lead_submit`; `/תודה/` exists, `noindex`, absent from `sitemap.xml`,
      carries `thanks-call`; `grep -rn "trackEvent\|dataLayer" components app lib` shows no PII.
- [ ] **Navigation.** `node scripts/audit/links.mjs` → `notInChrome: 0`, `orphans: 0`,
      `breadcrumbPages: 44`, no related-link warning; the header reaches 7 services + 18 locations
      and Escape closes the menu; `node scripts/audit/rtl-lint.mjs` → 0 banned utilities; no new
      `"use client"` beyond the one events leaf; no fixed element beyond the bar.
- [ ] **Security.** `curl -sSI` on `https://dangates.co.il/` and `https://dangates.pages.dev/` both
      show HSTS, XFO, `Permissions-Policy`, `nosniff`, `Referrer-Policy`; `node scripts/audit/edge.mjs`
      → `headersFile: true`, `redirectsFile: true`, `stubs: 0`, `deadHostArtifacts: 0`,
      `foreignStubs: 0`, `envDocumented: 1`, `envUsed: 1`; the CSP is report-only and observed for a
      week including a form submit, a call click and a legacy-URL hit; three legacy URLs return `301` + `Location` with `?utm_source=test` intact; no new third-party origin without a CSP directive;
      the full-UA crawler probe returns 200 on the day of the check; `npm audit --omit=dev` clean or
      triaged; `security-auditor` signed the release.
