---
name: conversion-cro
description: Lead conversion on dangates — click-to-call above the fold, the sticky mobile bar, the Web3Forms lead form and what keeps it honest (the delivery-failure alert, per-field errors with aria-invalid, Israeli phone validation that accepts landlines, the consent line, the city field and the /תודה/ route — all shipped by 2026-11; what is left is the GTM tags that count them), call and WhatsApp on the pricing page, data-cta on every CTA, and the honest-trust gate now that the fabricated reviews are gone. Use when conversions are weak, a page is missing its CTAs, or the form needs work. Triggers: "improve conversions", "CRO pass", "form validation", "thank you page", "add click-to-call", "why aren't leads tracked", "הטופס לא עובד", "דף תודה".
allowed-tools: Read, Grep, Glob, Bash
---

# Conversion

Three actions, in priority order: **phone call → WhatsApp → lead form.** Routing (agent-roster §3,
backlog §8): writer **rtl-frontend-engineer** · reviewer **cro-engagement-auditor** (form, CTA per
page type, event coverage) and **perf-a11y-auditor** (the form's a11y) · proof
`scripts/audit/cta-coverage.mjs` + `scripts/audit/a11y.mjs`. On-page _engagement_ — TOC, the
`<details>` FAQ, CTA placement inside long copy, no pop-ups (one owner-sanctioned exception since
2026-10-11: the fleet live-kit's seasonal card, CLAUDE.md §14) — is `/engagement-ux`; event wiring
is `/tracking-analytics` against `docs/event-taxonomy.md`.

## Baseline — re-measure first

```bash
npm run build                                  # N12
node scripts/audit/run-all.mjs --scope cro     # data-cta coverage, pages with no CTA in <main>
node scripts/audit/a11y.mjs                    # LeadForm / Process / MobileMenu source checks
```

As of 2026-11-08 (clean rebuild, repo — not deployed yet): `cta-coverage.mjs` **passes with 0
warnings** — `ctaElements 119 · withDataCta 119 · missingDataCta 0 · distinctValues 23`; `a11y.mjs`
**0 failures, 0 warnings**. Sprint 3 (`68a4a7f`) closed every repo-side gap below; what is left is
container and owner work (B2) and the privacy-copy sign-off (§8.2).

## What already works — don't regress it

- `MobileCtaBar` is fixed-bottom, 50/50 call/WhatsApp, `lg:hidden`, with the `h-16 lg:hidden` spacer
  in `app/layout.tsx` so it never covers the footer; its WhatsApp half uses the `whatsapp` tokens
  (5.42:1) since `7cfcf4c`.
- Click-to-call above the fold on every page (header + hero, the bar on phones); `FinalCta` on the
  commercial pages; call and WhatsApp in `<main>` on `/מחירון/` since `68a4a7f`.
- `LeadForm`'s delivery-failure state renders a visible `role="alert"` block with a real WhatsApp
  link and a `tel:` link (Gap 1) — lead-loss insurance no popup blocker can swallow. There is no
  `window.open` anywhere since `68a4a7f`.
- `lead_submit` fires only on a **confirmed** send, outside the `try`, then the form navigates to
  `/תודה/`. Keep that order.
- Every field has a `<label htmlFor>`; the honeypot is the hidden `company` field; the Web3Forms key
  is public by design (backlog §12.5).

## The six gaps — all closed in the repo; the specs stay the bar

### Gap 1 — delivery failure ~~is silent~~ (N1 ✅ 2026-09-06 · §8.6 PARTIAL)

**The UI half shipped** in commit `fee7f69`. `LeadForm` branches on `status === "error"` and renders
a `role="alert"` block **after** the submit button — deliberately after, so it reads in source order
rather than above the control the user just pressed. It carries a real `<a data-cta="form-whatsapp">`
to the prefilled message, a `tel:` link (`data-cta="form-call"`), and relabels the submit button to
`leadFormErrorCopy.retryLabel` so retrying is one press. Its strings live in `leadFormErrorCopy` in
`lib/content.ts`. The three failure paths (no-key misconfig, fetch `catch`, non-ok response) push
`lead_error` with `reason` `network` or `http_<code>`; `popup_blocked` retired with `window.open`.
Its two buttons are `size="md"` (≈40px) — the one tap-target gap left (backlog N19).

**Still open under §8.6:** nothing consumes `lead_error`. No GTM tag or trigger reads it, and no GA4
property exists to receive it (§13.7 ⏳ owner, B2). That is container work, not a repo change.

### Gap 2 — validation and a11y (§8.1 ✅ 2026-11-08)

Shipped in `68a4a7f`: an `errors` record keyed by field; each message in `<p id="lf-<field>-error">`
bound by `aria-describedby`, `aria-invalid` on the field; the wiring renders before focus moves to
the first invalid input. The phone check is `lib/phone.ts` — one expression for both the `pattern`
attribute and the JS check: mobiles, `07X` lines (this business is `072-`), 02/03/04/08/09
landlines, with or without `+972`, dashes or spaces. `noValidate` stays, because Hebrew per-field
messages beat browser defaults. Before: one generic string and no pattern. Do not regress either.

### Gap 3 — consent (§8.2 PARTIAL)

Shipped in `68a4a7f`: one line beside the button (`leadFormConsentCopy`) linking
`/מדיניות-פרטיות/` — an inline statement, not a checkbox, unless the owner asks for opt-in. The
policy (`privacyPageCopy`) names Web3Forms, Google Tag Manager, the fields collected, the live-kit's
status-file read and its storage values. **Open:** the `hebrew-editor` / `claims-verifier` sign-off
on the fix pass; naming GA4 once the property exists (B2); whether any consent UI is needed (B10).

### Gap 4 — the thank-you URL (§8.3 ✅ 2026-11-08)

Shipped in `68a4a7f`: `app/תודה/page.tsx`, `noindex`, registered in `staticPages` and left out of
the sitemap, calm for the live surfaces; it says what happens next, carries `thanks-call` (`tel:`)
and `thanks-whatsapp`, and links back to `/שירותים/`. `LeadForm` pushes `lead_submit` and then
navigates there with a full page load, so the `/תודה/` Page View trigger is the reliable conversion
and `lead_submit` the cross-check. The inline success block stays as the fallback. The audit's
`NOINDEX_ALLOWED` exemption for it awaits the owner's confirmation (backlog §8.3).

### Gap 5 — the `city` field (§8.4 ✅ 2026-11-08)

Shipped in `68a4a7f`: an optional `<select id="lf-city" name="city">` built from `locations` (value
= slug, label = name, plus `אחר` → `"other"`), sent in the Web3Forms body and as `city` on
`lead_submit` — dispatch-relevant across 18 areas from באר שבע to the קריות. The dead
`types/index.d.ts` is deleted (N3).

### Gap 6 — the pricing page's CTA (§8.5 ✅ 2026-11-08)

Shipped in `68a4a7f`: `pricing-call` and `pricing-whatsapp` beside `pricing-contact` in
`PricingTeaser`, so `/מחירון/` has a call and a WhatsApp action inside `<main>`. The page's _copy_
problem — eight of nine prices are authored estimates and real ones are not coming — is backlog
N14 / §7.3 (Sprint 4.2), not a CRO change.

## `data-cta` coverage

GTM click triggers read `data-cta`, and **every CTA carries one since 2026-09-06** (§13.2, commit
`fee7f69`). As of 2026-11-08: `cta-coverage.mjs` → `ctaElements 119 · withDataCta 119 ·
missingDataCta 0 · distinctValues 23 · distinctTaggedElements 30 · chromeCtas 8`. The full value
list is in `/tracking-analytics`; the convention is `{location}-{action}` and the script enforces
it. Any new CTA needs its own value in the same edit — a missing attribute makes the click
permanently invisible, and it is the only way that 0 moves.

## The honest-trust gate — read before adding any trust signal

Conversion work that adds pressure without adding proof makes the page worse.

- **No invented testimonials, ratings, "X customers this month", badges or countdowns.** A fabricated
  trust signal is a Google policy violation and a lie to the customer. This site shipped exactly that
  until 2026-08-17 — ten reconstructed reviews under real names as `Review` + `AggregateRating`. It is
  gone: `lib/content.ts` exports `reviews = []` and `REVIEW_SOURCE_URL = null`, and
  `components/marketing/Reviews.tsx` returns `null` unless both are set. **That guard is the rule
  made mechanical — never bypass it** (`schema.mjs` fails on any `Review`/`AggregateRating`).
- Real reviews arrive one way: the Google Business Profile (`docs/owner-actions.md` §2.1–2.2, ⏳),
  quoted **verbatim** with name, rating and date into `reviews` — `docs/gbp-runbook.md`. Escalate to
  that; never substitute urgency copy.
- What may be used today: the sourced technician-visit fee (150–350 ₪, `priceRows`), the five-step
  process, the hours, "אחריות על העבודה" (not a term). Not: years in business, a warranty term,
  licence, insurance, "פריסה ארצית" — `docs/business-facts.md` §B–§E; `claims-grep.mjs` fails a
  live 🔶 claim and `claims-verifier` reviews every copy change.
- The footer hours (`Footer`) end at 18:00 directly beneath a `FinalCta`
  promising 24/7 (§7.6) — one viewport, two stories. Bound the promise to what the owner confirms
  (§5.4) rather than deleting the hours.
- The accent CTA's **hover** and the WhatsApp button failed AA contrast until 2026-11-08; they pass
  now (`accent-500` 6.79:1, `whatsapp` 5.42:1 — §11.1, N11 ✅). A CTA a person can't read is a
  conversion bug — keep `a11y.mjs` at 0.

## Checklist

- [ ] Call and WhatsApp reachable without scrolling on every page, mobile and desktop.
- [ ] `status === "error"` renders a message, a WhatsApp link and a tel link; `lead_error` fires.
- [ ] Per-field errors with `aria-invalid` + `aria-describedby`; focus moves to the first invalid.
- [ ] Phone validation accepts every real Israeli format, landlines included; `a11y.mjs` passes.
- [ ] Consent line present and linked to `/מדיניות-פרטיות/`; the policy mentions analytics.
- [ ] `/תודה/` exists, is `noindex`, out of the sitemap, and carries a clickable `tel:`.
- [ ] `city` select from `locations`; sent in the email and on `lead_submit`.
- [ ] `/מחירון/` has a call/WhatsApp action in `<main>`; `cta-coverage.mjs` = 0 failures, 0 warnings.
- [ ] `trackEvent("lead_submit")` still fires only on confirmed success — never on submit.
- [ ] No trust signal on the page that `docs/business-facts.md` doesn't confirm; `reviews` stays empty
      until `REVIEW_SOURCE_URL` is real.
