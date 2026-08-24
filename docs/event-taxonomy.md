# Event taxonomy — GTM `GTM-KWGGH438` (shared IL fleet container), dangates.co.il

What the site pushes to `dataLayer`, what each parameter means, and which trigger in the container
consumes it. `tracking-analytics` and `engagement-ux` write against this file;
`cro-engagement-auditor` and `scripts/audit/cta-coverage.mjs` check coverage.

**Rules.** No PII in `dataLayer` (golden rule 10) — never the name, phone, email or message. Every
event carries `site: "dangates"` so the shared container can route by site as well as by hostname.
Event names are snake_case, parameters are flat strings, and a `data-cta` attribute — not a CSS
class — is the click-trigger hook.

## Conversion events

| Event                  | Fires                                                          | Parameters                                                                                                                                                                       | Trigger (container)                                                                                                                            | Status                                                   |
| ---------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `tel_click`            | click on any `a[href^="tel:"]`                                 | `cta` (the `data-cta` value), `page` (pathname), `placement` (`header` \| `hero` \| `mobile_bar` \| `final_cta` \| `service` \| `contact` \| `footer` \| `pricing` \| `article`) | Click – Just Links, `Click Element matches CSS selector a[data-cta][href^="tel:"]`                                                             | partial — 9 of ~30 CTAs carry `data-cta` (backlog §13.2) |
| `whatsapp_click`       | click on any `a[href*="wa.me"]`, `a[href*="api.whatsapp.com"]` | same                                                                                                                                                                             | same selector on WhatsApp hrefs. **Two WhatsApp opens are JS-driven** (`window.open` in `LeadForm.tsx`) — those must push the event explicitly | partial                                                  |
| `email_click`          | click on `a[href^="mailto:"]`                                  | same                                                                                                                                                                             | selector                                                                                                                                       | missing (footer email)                                   |
| `form_start`           | first focus/input in the lead form                             | `form: "lead"`, `page`                                                                                                                                                           | Custom Event                                                                                                                                   | missing (backlog §13.5)                                  |
| `form_submit_attempt`  | submit pressed, before validation                              | `form`, `page`                                                                                                                                                                   | Custom Event                                                                                                                                   | missing (backlog §13.5)                                  |
| `lead_submit`          | successful Web3Forms POST                                      | `form: "lead"`, `page`, `service` (selected service slug or `""`), `city` (selected city slug or `""`), `placement`                                                              | Custom Event → GA4 conversion                                                                                                                  | exists without dimensions (backlog §13.4)                |
| `lead_error`           | POST failed / popup blocked                                    | `form`, `page`, `reason` (`network` \| `http_<code>` \| `popup_blocked`)                                                                                                         | Custom Event                                                                                                                                   | missing (backlog §8.6, N1)                               |
| _(page view)_ `/תודה/` | thank-you route after a successful submit                      | —                                                                                                                                                                                | Page View trigger on path `/תודה/` → GA4 conversion, Google Ads conversion                                                                     | missing (backlog §8.3)                                   |

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

## Container-side notes

- GA4 is resolved inside the container by a hostname RegEx table; dangates needs its own
  `G-XXXXXXX` (owner-actions §2.4). Until then events are pushed but counted nowhere.
- Every container-id change is 200-checked:
  `curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"`.
- Icons render inside the CTA anchors, so click triggers must read `data-cta` from the **closest
  anchor** (`Click Element` → `closest('a[data-cta]')` in a custom JS variable), not from the event
  target.
- Consent: GTM loads unconditionally today and the privacy policy does not mention analytics. The
  consent affordance (backlog §8.2) lands with Phase 5; until then no event may carry PII.

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
