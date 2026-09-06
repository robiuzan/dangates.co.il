---
name: tracking-analytics
description: GTM, GA4 and conversion events for dangates on the shared Israeli fleet container GTM-KWGGH438 — the init script now loading from <head> (moved 2026-09), hostname-based GA4 routing inside the container, the data-cta inventory measured by cta-coverage.mjs, the event contract in docs/event-taxonomy.md (lead_submit with page/service/city, form_start, lead_error, the /תודה/ page view), and the mandatory gtm.js 200-check whenever a container id changes. Use when turning on analytics, wiring an event, or when conversions are not being recorded. Triggers: "set up GTM", "GA4", "track calls", "conversion tracking not firing", "data-cta", "lead_submit", "Search Console", "container id", "אנליטיקס", "מעקב המרות".
allowed-tools: Read, Grep, Glob, Bash
---

# Tracking & analytics

Routing (agent-roster §3, backlog §13): writer **rtl-frontend-engineer** · reviewer
**cro-engagement-auditor** · proof `scripts/audit/cta-coverage.mjs` + the gtm.js 200-check. The
events themselves are defined **once**, in `docs/event-taxonomy.md` — this skill says how to wire
them, never redefines them. Engagement events (scroll, TOC, FAQ) belong to `/engagement-ux`.

## Baseline — re-measure first

```bash
npm run build                                        # N12 — never assert against a stale out/
node scripts/audit/cta-coverage.mjs                  # data-cta coverage, chrome counted once
grep -n 'gtm-init\|</head>' out/index.html           # where the init script actually lands
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

As of 2026-09-06 `cta-coverage.mjs` **passes**: 113 CTA elements on 45 pages, **113 tagged, 0
missing**, 24 distinct tagged source elements across 17 values seen in the export (18 exist in
source); `gtm-init` is emitted **inside** `<head>` on all 46 pages; gtm.js → 200. The repo half of
tracking is done — everything still missing is container-side.

## The container is shared — this changes everything

`GTM-KWGGH438` is **one container for all ~10 Israeli fleet domains**; GA4 is resolved _inside_ it by
a RegEx table on `{{Page Hostname}}`. So: never edit a shared trigger or variable to fix one site —
add a hostname (or `site`) condition; every event carries `site: "dangates"`; the container id lives
in the **roster manifest**, never typed into `site.config.json` (golden rule 2).

## The 200-check — non-negotiable (golden rule 8, backlog §13.6)

**A GTM snippet in the HTML proves nothing** — a wrong id renders identical markup and collects
nothing. Two fabricated ids in a row cost the fleet **18 days of zero analytics on every site**. Run
the `curl` above whenever an id changes, and again after deploy. `GTM-KWGGH438` is the first verified id.

## Head placement — done, and the check that keeps it done (backlog §13.1)

`app/layout.tsx` renders `<script id="gtm-init">` (the kit's `gtmHeadSnippet`) inside `<head>`, beside
the `imgquarry.com` preconnect, with the `<noscript>` iframe still in `<body>` where it belongs.
Closed 2026-09-06 by commit `13a6bdc`; before that the loader was a child of `<body>`, after the
`<noscript>`, which delays the container and can miss early events.

**Prove it after any layout change** — a byte-offset comparison, not an eyeball, and across the whole
export rather than one page:

```bash
node -e "const fs=require('fs'),p=require('path');let n=0,bad=0;(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())w(f);else if(e.name==='index.html'){const h=fs.readFileSync(f,'utf8');n++;if(!(h.indexOf('gtm-init')>-1&&h.indexOf('gtm-init')<h.indexOf('</head>')))bad++;}}})('out');console.log(n,bad);"
# 46 0
```

This inline script is what the report-only CSP in `public/_headers` accommodates with
`script-src 'unsafe-inline'` — a static export cannot mint a per-request nonce
(`/web-security-headers`).

## The `data-cta` inventory

Call, WhatsApp and email clicks are tracked **in the container** by click triggers reading
`data-cta` — no JS ships for them, so an untagged CTA is a click nobody will ever count. Convention:
`{location}-{action}` (the script warns on anything outside `^[a-z0-9]+-[a-z0-9]+$`, and on one value
shared by two element kinds). The prefix maps to the taxonomy's `placement` parameter.

**The inventory is complete as of 2026-09-06** (§13.2, commit `fee7f69`) — 18 values across 24
source elements. Read the live list rather than trusting this one:

```bash
grep -rho 'data-cta="[^"]*"' app components | sort | uniq -c | sort -rn
```

| Placement   | Values                                                      |
| ----------- | ----------------------------------------------------------- |
| `header-`   | `header-call` (×2 elements — desktop and mobile menu)       |
| `hero-`     | `hero-call` · `hero-whatsapp`                               |
| `finalcta-` | `finalcta-call` · `finalcta-whatsapp`                       |
| `footer-`   | `footer-call` · `footer-email`                              |
| `sticky-`   | `sticky-call` · `sticky-whatsapp`                           |
| `service-`  | `service-call` · `service-whatsapp` (sticky card, ×7 pages) |
| `contact-`  | `contact-call` · `contact-whatsapp` · `contact-email`       |
| `pricing-`  | `pricing-contact`                                           |
| `form-`     | `form-submit` · `form-whatsapp` (×2) · `form-call`          |

`Button` spreads its props, so `data-cta` on a `<Button>` reaches the anchor. Adding a CTA without a
value is the only way `missingDataCta` moves off 0 — re-run the script after touching any of them.

**Why the script reports 17 values, not 18:** `form-call` and one of the two `form-whatsapp` elements
render only when the form is in its `status === "error"` state, so a scan of the static export never
sees them. That gap is expected and is not a coverage failure; the source grep above is the full list.

**Container side:** icons render _inside_ the anchors, so the click variable must read
`closest('a[data-cta]')`, not the event target. The WhatsApp fallback open is **JS-driven** (`window.open` in `openWhatsappFallback`) and no click trigger can ever see it — so since `fee7f69` that function pushes `whatsapp_click` itself, with `cta: "form-whatsapp"`, `page` and `placement: "form"`. A blocked popup reports `lead_error` with `reason: "popup_blocked"`. Any new JS-driven open must push its own event the same way, and add the value to the taxonomy table in the same change.

## Events — wire against `docs/event-taxonomy.md`

The contract, summarised (names, parameters and triggers live in the doc — read it before editing):
`tel_click` · `whatsapp_click` · `email_click` (click triggers off `data-cta`) · `form_start` ·
`form_submit_attempt` · `lead_submit` · `lead_error` (pushed from `LeadForm`) · a page view on
`/תודה/` (Phase 5). Parameters are flat snake_case strings; every push carries `site: "dangates"`;
**no PII, ever** (golden rule 10) — not name, phone, email or message text. `trackEvent` from
`@ishub/site-kit/analytics` is the push helper (`components/forms/LeadForm.tsx:8`); it is a safe
no-op without `dataLayer`.

- **`lead_submit`** fires at `components/forms/LeadForm.tsx:97` **only on confirmed Web3Forms
  success**, deliberately outside the `try` so delivery and analytics never share a failure path.
  Keep that. It must gain dimensions (backlog §13.4): `{ form: "lead", site: "dangates", page:
window.location.pathname, service, city, placement }`. The service `<option>` value is the display
  name (`:166`) because it doubles as the email body — derive the slug for the event with
  `services.find((s) => s.name === value)?.slug ?? ""`. `city` comes from the select `/conversion-cro`
  §8.4 adds (slug or `""`).
- **`form_start`** (§13.5): once per mount, on the first `focusin` inside the form, guarded by a
  `useRef` flag — `{ form: "lead", site, page }`. **`form_submit_attempt`**: at the top of
  `handleSubmit`, before validation.
- **`lead_error`** (§8.6, N1): in the catch at `:85-90` and the missing-key branch at `:64-66` —
  `reason` is `network` (fetch threw), `http_<code>` (`!res.ok`), or `popup_blocked`
  (`window.open` returned `null`). The visible error UI is the other half of N1 — `/conversion-cro`.
- **Thank-you page view** (§8.3): a Page View trigger on `/תודה/` is the cleanest GA4 key event and
  Google Ads target. Keep the `lead_submit` push as well — a push immediately before navigation can
  be lost, and the two signals cross-check each other.
- A static export does full page loads: **no History Change trigger** — it will never fire.

## GA4 and Search Console — owner-blocked

Both are provisioned by the owner, not by this repo: `docs/owner-actions.md` **§2.4** (GA4 measurement
id → roster `analytics.ga4MeasurementId` → the container's hostname table) and **§2.3** (Search
Console token → roster `analytics.googleSiteVerification`; `app/layout.tsx` emits nothing while it is
`null`). Until then events are pushed and counted nowhere — say so in any audit rather than reporting
"tracking works". When GA4 exists: mark `lead_submit`, `tel_click`, `whatsapp_click` and the `/תודה/`
view as **Key events**, then submit `https://dangates.co.il/sitemap.xml` in Search Console.
`scripts/audit/gsc-ingest.mjs` waits on the same token.

## Verifying a deploy

1. Live source: `gtm.js?id=GTM-KWGGH438` **inside `<head>`** (§13.1, done 2026-09-06).
2. `curl` the gtm.js URL → 200.
3. GTM Preview on the live domain: one call click, one WhatsApp click, one form submit — each trigger
   fires **once**, with `cta`, `page` and `placement` populated.
4. GA4 Realtime (once provisioned) shows the events under hostname `dangates.co.il`.
5. No PII in any `dataLayer` push (inspect the array in DevTools).
6. `node scripts/audit/cta-coverage.mjs` on the deployed build → `missingDataCta: 0`.

## Checklist

- [ ] GTM init script in `<head>`, `<noscript>` iframe in `<body>` (`grep` on `out/index.html`).
- [ ] `gtm.js?id=…` returns 200 — on every id change and after every deploy.
- [ ] Every tel / WhatsApp / mailto / submit / contact link carries `{location}-{action}` — script = 0.
- [ ] `lead_submit` fires only on confirmed success and carries `page`, `service`, `city`.
- [ ] `form_start`, `form_submit_attempt`, `lead_error` wired per the taxonomy; JS-driven WhatsApp
      opens push `whatsapp_click` explicitly.
- [ ] No PII in `dataLayer`; every push has `site: "dangates"`.
- [ ] Container edits are hostname- or site-scoped; tested in Preview before publishing.
- [ ] New event names or values added to `docs/event-taxonomy.md` in the same change.

## Gotchas

- A shared container means a broken trigger is a **fleet-wide** outage. Preview first, always.
- The footer `mailto:` is a conversion path — Cloudflare Email Obfuscation must stay **off**
  (`docs/cloudflare-runbook.md` "Leave these alone") or the click 404s before any trigger sees it.
- Rocket Loader defers scripts and is a classic cause of GTM firing late — also stays off.
- Legacy URLs are real 301s since 2026-09-06 (ADR 0004), so `gclid`/`utm` survive an old inbound link — the 37 meta-refresh stubs that used to destroy them are gone (§13.3). It is only actually fixed once the deploy lands: probe with `curl -sSI ".../?utm_source=test"` and check the query survives into `Location` (`/deploy-dangates`).
