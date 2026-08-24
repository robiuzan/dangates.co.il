---
name: conversion-cro
description: Lead conversion on dangates — click-to-call above the fold, the sticky mobile bar, the Web3Forms lead form (the delivery-failure state that renders nothing, per-field errors with aria-invalid, Israeli phone validation that accepts landlines, a consent line, the city field, a real /תודה/ route with a tel link), the pricing page that ends without a CTA, data-cta on every CTA, and the honest-trust gate now that the fabricated reviews are gone. Use when conversions are weak, a page is missing its CTAs, or the form needs work. Triggers: "improve conversions", "CRO pass", "form validation", "thank you page", "add click-to-call", "why aren't leads tracked", "הטופס לא עובד", "דף תודה".
allowed-tools: Read, Grep, Glob, Bash
---

# Conversion

Three actions, in priority order: **phone call → WhatsApp → lead form.** Routing (agent-roster §3,
backlog §8): writer **rtl-frontend-engineer** · reviewer **cro-engagement-auditor** (form, CTA per
page type, event coverage) and **perf-a11y-auditor** (the form's a11y) · proof
`scripts/audit/cta-coverage.mjs` + `scripts/audit/a11y.mjs`. On-page _engagement_ — TOC, the
`<details>` FAQ, CTA placement inside long copy, no pop-ups — is `/engagement-ux`; event wiring is
`/tracking-analytics` against `docs/event-taxonomy.md`.

## Baseline — re-measure first

```bash
npm run build                                  # N12
node scripts/audit/run-all.mjs --scope cro     # data-cta coverage, pages with no CTA in <main>
node scripts/audit/a11y.mjs                    # LeadForm / Faq / Header / Process source checks
```

As of 2026-08-23: 24 CTA instances without `data-cta`; `/מחירון/` is the one commercial page whose
`<main>` has no call/WhatsApp/form CTA; `a11y.mjs` fails on the form (no `aria-invalid`, no pattern).

## What already works — don't regress it

- `MobileCtaBar` is fixed-bottom, 50/50 call/WhatsApp, `lg:hidden`, with the `h-16 lg:hidden` spacer
  in `app/layout.tsx:76` so it never covers the footer.
- Click-to-call above the fold on every page (header + hero); `FinalCta` on 41 of 45 pages.
- `LeadForm` falls back to a **prefilled WhatsApp deep link** when the Web3Forms POST fails
  (`components/forms/LeadForm.tsx:85-90`) — lead-loss insurance. Keep the fallback; fix its UI (Gap 1).
- `trackEvent("lead_submit")` (`:97`) fires only on **confirmed** success, outside the `try`. Keep it.
- Every field has a `<label htmlFor>`; honeypot `company` (`:45`); public-by-design Web3Forms key
  (backlog §12.5).

## The six gaps — each with its fix design

### Gap 1 — delivery failure is silent and the error state renders nothing (N1, §8.6)

`components/forms/LeadForm.tsx:64-66` and `:85-90` set `status` to `"error"` and `window.open` a
WhatsApp link — but nothing in the JSX branches on `status === "error"`; the only visible error is the
client-side `error` string (`:49`, rendered at `:201-205`), which delivery failure never sets. A user
whose POST failed and whose popup was blocked sees the form sit there, submit button enabled, no
message. Fix: an explicit `status === "error"` block above the button — `role="alert"`, Hebrew copy
("השליחה נכשלה — שלחו לנו בוואטסאפ או התקשרו"), the same `buildWhatsapp(form)` href rendered as a
real `<a data-cta="form-whatsapp">` (a link cannot be popup-blocked) plus the `tel:` link, submit
re-enabled for retry. Detect the blocked popup (`window.open` returns `null`) and push `lead_error`
with `reason` per the taxonomy.

### Gap 2 — validation and a11y (§8.1)

`noValidate` (`:120`) with one generic string; no per-field state, no `aria-invalid`, no
`aria-describedby`, no focus management; the phone input (`:143-153`) is `type="tel"` with **no
pattern**, so anything passes. Fix: an `errors` record keyed by field; each message in a `<p
id="lf-<field>-error">` bound by `aria-describedby`, `aria-invalid={!!errors.field}`; on submit, focus
the first invalid input. Phone: strip spaces and dashes, accept `^0\d{8,9}$` (landlines are 9 digits,
mobiles and `072`/`073`/`077` VoIP lines 10 — this business's own number is `072-2587772`) or
`^\+972\d{8,9}$`; reject nothing a real customer would type. Keep `noValidate` — Hebrew messages beat
browser defaults, but only if they are per-field. While there, `text-right` on `:151` is one of the
three banned utilities (`rtl-lint.mjs`): `text-end` renders identically inside that `dir="ltr"` island.

### Gap 3 — consent (§8.2)

The form collects name, phone and free text; `/מדיניות-פרטיות/` exists and the form never links it.
Add one line above the button linking the policy — an inline statement, not a checkbox, unless the
owner asks for opt-in. The policy must also mention analytics, because GTM loads unconditionally
(`docs/event-taxonomy.md` "Container-side notes"); that copy is `hebrew-copywriter`'s.

### Gap 4 — no thank-you URL (§8.3)

Success is an inline state swap (`:100-114`): no URL-based conversion, no Google Ads target, and the
success copy says "התקשרו אלינו" with **no clickable number**. Build `app/תודה/page.tsx` (Phase 5;
`output: "export"` + `trailingSlash` serve it at `/תודה/`): `robots: { index: false }`, left out of
the sitemap;
states what happens next and when; a `tel:` link (`data-cta="thanks-call"`) and a WhatsApp link
(`thanks-whatsapp`) as the immediate second touch; a link back to `/שירותים/`. `LeadForm` navigates
there with `window.location.assign("/%D7%AA%D7%95%D7%93%D7%94/")` after the `trackEvent` push — full
page load, so the `/תודה/` Page View trigger is the reliable conversion and `lead_submit` the
cross-check. Keep the inline success block as the fallback if navigation is prevented.

### Gap 5 — the `city` field (§8.4)

`types/index.d.ts:27` declares `city?` in a file nothing imports (N3); the form never collects it.
Add `<select id="lf-city" name="city">` built from `locations` in `lib/site-config.ts` (value = slug,
label = name, plus "אחר"). Optional, one row of vertical space, and **dispatch-relevant** across 18
areas from באר שבע to the קריות — the business learns whether it can take the job before calling
back. Send it in the Web3Forms body and as the `city` dimension on `lead_submit`.

### Gap 6 — the pricing page ends without a CTA (§8.5)

`/מחירון/` is reached with active buying intent and is the only commercial page whose `<main>` has no
call/WhatsApp/form action (`cta-coverage.mjs` warns). `components/marketing/PricingTeaser.tsx:49`
links to `/צור-קשר` — untagged, and missing the trailing slash the export enforces (N10). Fix: add
`pricing-call` and `pricing-whatsapp` buttons beside it (or render `FinalCta` on the route), tag the
link `pricing-contact`, and write `/צור-קשר/`. The page's _copy_ problem — eight of nine prices are
authored estimates and real ones are not coming — is backlog §4.10/§7.3, not a CRO change.

## `data-cta` coverage

GTM click triggers read `data-cta`; 24 page-instances carry none today — the service-page sidebar
(×7), the contact page's call/WhatsApp/email, the form's submit and WhatsApp fallback, the pricing
link and the footer email. The full table with values to add is in `/tracking-analytics`; the
convention is `{location}-{action}` and the script enforces it. Tagging is free; a missing attribute
makes the click permanently invisible.

## The honest-trust gate — read before adding any trust signal

Conversion work that adds pressure without adding proof makes the page worse.

- **No invented testimonials, ratings, "X customers this month", badges or countdowns.** A fabricated
  trust signal is a Google policy violation and a lie to the customer. This site shipped exactly that
  until 2026-08-17 — ten reconstructed reviews under real names as `Review` + `AggregateRating`. It is
  gone: `lib/content.ts:242` exports `reviews = []`, `:248` `REVIEW_SOURCE_URL = null`, and
  `components/marketing/Reviews.tsx:41` returns `null` unless both are set. **That guard is the rule
  made mechanical — never bypass it** (`schema.mjs` fails on any `Review`/`AggregateRating`).
- Real reviews arrive one way: the Google Business Profile (`docs/owner-actions.md` §2.1–2.2, ⏳),
  quoted **verbatim** with name, rating and date into `reviews` — `docs/gbp-runbook.md`. Escalate to
  that; never substitute urgency copy.
- What may be used today: the sourced technician-visit fee (150–350 ₪, `priceRows`), the five-step
  process, the hours, "אחריות על העבודה" (not a term). Not: years in business, a warranty term,
  licence, insurance, "פריסה ארצית" — `docs/business-facts.md` §B–§E; `claims-grep.mjs` fails a
  live 🔶 claim and `claims-verifier` reviews every copy change.
- The footer hours (`components/layout/Footer.tsx:47-49`) end at 18:00 directly beneath a `FinalCta`
  promising 24/7 (§7.6) — one viewport, two stories. Bound the promise to what the owner confirms
  (§5.4) rather than deleting the hours.
- The accent CTA's **hover** and the WhatsApp button fail AA contrast (`/responsive-accessibility`;
  `accent-500` is the ready AA hover token, N11). A CTA a person can't read is a conversion bug.

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
