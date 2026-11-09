# Event taxonomy — GTM `GTM-KWGGH438` (shared IL fleet container), dangates.co.il

What the site pushes to `dataLayer`, what each parameter means, and which trigger in the container
consumes it. `tracking-analytics` and `engagement-ux` write against this file;
`cro-engagement-auditor` and `scripts/audit/cta-coverage.mjs` check coverage.

**Rules.** No PII in `dataLayer` (golden rule 10) — never the name, phone, email or message. Every
event carries `site: "dangates"` so the shared container can route by site as well as by hostname.
Event names are snake_case, parameters are flat strings, and a `data-cta` attribute — not a CSS
class — is the click-trigger hook.

## Conversion events

Statuses as of 2026-11-08 — the repo side. Every row is **counted nowhere** until the GA4 property
exists and the container has the tag (owner-actions §2.4, Track B B2).

| Event                  | Fires                                                                                                         | Parameters                                                                                                                                                                                             | Trigger (container)                                                                                                                                                                                                                                                                                                                                                     | Status (repo)                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `tel_click`            | click on any `a[href^="tel:"]`                                                                                | `cta` (the `data-cta` value), `page` (pathname), `placement` — one of `header` · `hero` · `mobile_bar` · `final_cta` · `service` · `contact` · `footer` · `pricing` · `article` · `form` · `thanks`    | Click – Just Links, `Click Element matches CSS selector a[data-cta][href^="tel:"]`                                                                                                                                                                                                                                                                                      | ✅ `data-cta` on every CTA — `cta-coverage.mjs` → `ctaElements 119 · withDataCta 119 · distinctValues 23` (§13.2) |
| `whatsapp_click`       | click on any `a[href*="wa.me"]`, `a[href*="api.whatsapp.com"]`                                                | same                                                                                                                                                                                                   | same selector on WhatsApp hrefs. Every WhatsApp exit is a real `<a>` since `68a4a7f` (Sprint 3 row 3.12 — no `window.open` left). The lead form's delivery-failure link (`cta: "form-whatsapp"`, `placement: "form"`) also pushes the event on click, so a container that counts both the Just-Links trigger and this push counts that one link twice — pick one in GTM | ✅ tagged; the container trigger is owner work                                                                    |
| `email_click`          | click on `a[href^="mailto:"]`                                                                                 | same                                                                                                                                                                                                   | selector                                                                                                                                                                                                                                                                                                                                                                | ✅ tagged (`footer-email`, `contact-email`); the container trigger is owner work                                  |
| `form_start`           | first focus or input of a real field in the lead form, once per page load (never the honeypot)                | `form: "lead"`, `page`, `placement` (`hero` · `contact` · `form`), `site: "dangates"`                                                                                                                  | Custom Event                                                                                                                                                                                                                                                                                                                                                            | ✅ shipped `68a4a7f` (backlog §13.5)                                                                              |
| `form_submit_attempt`  | submit pressed, before validation                                                                             | `form`, `page`, `placement`, `site`                                                                                                                                                                    | Custom Event                                                                                                                                                                                                                                                                                                                                                            | ✅ shipped `68a4a7f` (backlog §13.5)                                                                              |
| `lead_submit`          | confirmed Web3Forms POST, pushed BEFORE the navigation to `/תודה/`                                            | `form: "lead"`, `page`, `service` (selected service slug or `""`), `city` (selected city slug, `"other"` for the `אחר` option, or `""`), `placement` (`hero` · `contact` · `form`), `site: "dangates"` | Custom Event → GA4 conversion                                                                                                                                                                                                                                                                                                                                           | ✅ shipped `68a4a7f` (backlog §13.4)                                                                              |
| `lead_error`           | POST failed (no-key misconfig, fetch catch, non-ok response)                                                  | `form`, `page`, `placement`, `site`, `reason` (`network` or `http_<code>`) — `popup_blocked` retired with `window.open`                                                                                | Custom Event                                                                                                                                                                                                                                                                                                                                                            | ✅ ships from `LeadForm.tsx` (N1 closed 2026-09-06); nothing consumes it yet — backlog §8.6 PARTIAL               |
| _(page view)_ `/תודה/` | thank-you route after a confirmed submit; `noindex`, outside the sitemap, listed `calm` for the live surfaces | —                                                                                                                                                                                                      | Page View trigger on path `/תודה/` → GA4 conversion, Google Ads conversion                                                                                                                                                                                                                                                                                              | ✅ route shipped `68a4a7f` (backlog §8.3); the container trigger is owner work                                    |

**`data-cta` values added in Sprint 4B** (the pricing pivot and the transparency surface). They follow
`{location}-{action}`, and each names one element kind:

| `data-cta`            | Element                                                                                            | Event            |
| --------------------- | -------------------------------------------------------------------------------------------------- | ---------------- |
| `pricing-call`        | `/מחירון/` — the call button under the answer block (the pair after the drivers already used it)   | `tel_click`      |
| `pricing-whatsapp`    | `/מחירון/` — the WhatsApp button under the answer block, prefilled with the quote-tips message     | `whatsapp_click` |
| `complaints-call`     | `/צור-קשר/#complaints` — the phone number in the complaints and cancellation block                 | `tel_click`      |
| `complaints-whatsapp` | `/צור-קשר/#complaints` — the WhatsApp link in the same block                                       | `whatsapp_click` |
| `complaints-email`    | `/צור-קשר/#complaints` — the email address in the same block                                       | `email_click`    |
| `faq-more`            | a homepage FAQ `moreAt` link-out; a navigation link, not a call, but `/צור-קשר/` is a contact link | _(none)_         |

**`data-cta` values added in Sprint 7** (the guides hub, `components/article/`). They follow
`{location}-{action}`, each names one element kind, and all read as `placement: "article"`:

| `data-cta`                | Element                                                          | Event            |
| ------------------------- | ---------------------------------------------------------------- | ---------------- |
| `article-inline-call`     | a guide's `cta` block, `inline` variant — the call button        | `tel_click`      |
| `article-inline-whatsapp` | the same block's WhatsApp button, prefilled with the guide title | `whatsapp_click` |
| `article-quote-call`      | a guide's `cta` block, `quote` variant — the call button         | `tel_click`      |
| `article-quote-whatsapp`  | the same block's photo-or-video WhatsApp button                  | `whatsapp_click` |
| `article-aside-call`      | the sticky card beside a guide — the phone number                | `tel_click`      |
| `article-aside-whatsapp`  | the sticky card beside a guide — the WhatsApp button             | `whatsapp_click` |
| `article-contact`         | an in-copy link to `/צור-קשר/` inside a guide paragraph          | _(none)_         |

The three `complaints-*` values read as `placement: "contact"` — the block sits on the contact page —
so the container can map them to that placement without a new one (owner work, with the rest of the
container). `faq-more` fires no conversion event — the tag exists so `cta-coverage.mjs` can see that the one
`moreAt` that points at `/צור-קשר/` is tagged.

## Engagement events (Phase 5, `engagement-ux`)

| Event            | Fires                                              | Parameters                                  | Purpose                                    |
| ---------------- | -------------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `scroll_depth`   | 25 / 50 / 75 / 90 % of `<main>`                    | `percent`, `page`, `page_type`              | reading depth on guides and service pages  |
| `engaged_time`   | 15 s, 45 s, 120 s of visible, focused time         | `seconds`, `page`, `page_type`              | dwell without inflating by background tabs |
| `toc_click`      | click on a table-of-contents link                  | `page`, `target` (heading id)               | which sections readers jump to             |
| `faq_open`       | `<details>` toggle open                            | `page`, `question` (the Q text, ≤ 80 chars) | which questions matter                     |
| `related_click`  | click on a related service / location / guide card | `page`, `target` (path), `kind`             | mesh effectiveness                         |
| `outbound_click` | click on an external link (SII, gov.il)            | `page`, `target_host`                       | citation value                             |

`page_type` ∈ `home | service | location | post | guide | pricing | about | contact | other`
(same vocabulary as `scripts/audit/lib/pages.mjs routeType()`).

## Live-surface events (fleet live-kit, CLAUDE.md §14)

Pushed by `public/assets/live.js`, a byte-locked kit copy shared by every fleet site, so the names
and parameters are the fleet's, not this site's — and they carry **no `site` parameter** (the rule
above): the container tells the sites apart by hostname. No PII; the line's id is the most specific
string.

| Event             | Fires                                             | Parameters                                                                                         | Trigger (container)                                                                                                                                                                      |
| ----------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `surface_view`    | the seasonal card opens                           | `surface: "dialog"`, `variant` (the line's id, e.g. `autumn-tracks`)                               | ONE shared trigger for the fleet (owner decision 2026-10-12): `CE - popup events (3locksmiths)`, its hostname condition widened to every fleet site — inert here until the owner does it |
| `surface_dismiss` | the card closes                                   | `surface`, `variant`, `method` (`button` \| `backdrop` \| `action` \| `esc` \| `expired` \| `nav`) | same trigger                                                                                                                                                                             |
| (click)           | a link in the bar, the card or the homepage strip | the `data-cta` value                                                                               | the existing `[data-cta]` click triggers — no container change                                                                                                                           |

Their `data-cta` values, printed by `lib/live/render.mjs`: `popup-call`, `popup-whatsapp` and
`popup-link` (the card, every page), `topbar-link` (a seasonal line's link, and the evergreen
line's), `update-link` (the homepage strip). `topbar-call` / `topbar-whatsapp` exist in the kit
but render only for a line that carries `{phone}` / `{whatsapp:…}`, and no line does today. The
site's GA4 property needs the custom dimensions `surface`, `variant`, `method` and `cta_id` (kit
README) — and the property itself is still owner-blocked (§13.7).

## Container-side notes

- GA4 is resolved inside the container by a hostname RegEx table; dangates needs its own
  `G-XXXXXXX` (owner-actions §2.4). Until then events are pushed but counted nowhere.
- Every container-id change is 200-checked:
  `curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"`.
- Icons render inside the CTA anchors, so click triggers must read `data-cta` from the **closest
  anchor** (`Click Element` → `closest('a[data-cta]')` in a custom JS variable), not from the event
  target.
- Consent: GTM loads unconditionally. Since `68a4a7f` (2026-11-08) the form carries a consent line
  linking the privacy policy, and the policy names Web3Forms and Google Tag Manager — not GA4 until
  the property exists (B2); whether a consent UI is needed at all is B10. Backlog §8.2 stays PARTIAL.
  No event may carry PII, ever.

## Campaign tagging (UTM)

Off-site links the business controls carry UTMs so GA4 can separate them from plain organic search.
The scheme is fixed; `utm_content` names the placement:

| Placement                                      | URL                                                                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Google Business Profile — website              | `https://dangates.co.il/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=profile`            |
| GBP — appointment link                         | `/צור-קשר/` (percent-encoded) `?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=appointment` |
| GBP — posts                                    | the post's canonical URL + `?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post-<slug>`    |
| Directory listings (דפי זהב, זאפ, B144, מידרג) | `?utm_source=<directory>&utm_medium=referral&utm_campaign=citations`                                           |

`utm_medium=organic` keeps GBP sessions inside GA4's organic channel; `utm_campaign=gbp` is the filter.
Legacy URLs must 301 with the query string intact (ADR 0004) or the tags are lost on the redirect.
Details: `docs/gbp-runbook.md`.
