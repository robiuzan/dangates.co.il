# Data & tracking infrastructure — the measurement contract for dangates.co.il

> **Layer:** standards. This file decides what the site collects, what it never collects, which
> third-party code is allowed on the page, and where analytics infrastructure stops being this
> repo's business. The `tracking-analytics` skill is the how-to for GTM, `data-cta` and the form
> events; `engagement-ux` is the how-to for the engagement hook; `cro-engagement-auditor` audits
> against this file; `scripts/audit/cta-coverage.mjs` measures CTA coverage and
> `scripts/audit/gsc-ingest.mjs` turns Search Console exports into `docs/rank-tracking.md`. Reads
> with: [event-taxonomy.md](event-taxonomy.md) (the event contract), [rank-tracking.md](rank-tracking.md),
> [owner-actions.md](owner-actions.md) §2, [gbp-runbook.md](gbp-runbook.md) §6, and the fleet's
> [gtm-setup.md](../../Israeli%20services%20sites/docs/gtm-setup.md) for the container mechanics.
>
> **Rule zero: a tag that has not been verified against a live 200 is not installed.** A GTM snippet
> in the HTML proves nothing — one fabricated container id shipped in the markup of five fleet sites
> for 18 days, and the unverified find/replace that followed was a second (golden rule 8, backlog
> §13.6). Whenever a container id changes, and after every deploy:
> `curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"`
> must print `200`.

---

## 0. Current state — verified 2026-08-24

Numbers are from [audits/2026-08-24-full.md](audits/2026-08-24-full.md) unless a later date is given.
The live domain has served the repo build since the Sprint 0 deploy on 2026-09-06 (before it, the 2026-08-03 build); where a row notes an "in the repo" vs "live" gap, it describes the state before that deploy.

| Component                   | State | Detail                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GTM container               | ⚠️    | `GTM-KWGGH438` (shared IL fleet container) from `manifest.analytics.gtmId`; gtm.js → 200 (re-verified 2026-09-06). The init script renders in `<body>` after the `<noscript>` iframe, not in `<head>` — in the repo and on the live build — backlog §13.1                                                                                                                                                                            |
| GA4 property                | ⬜    | `ga4MeasurementId: null` in the roster. GA4 is resolved inside the container by hostname, so every event the site pushes is counted nowhere — backlog §13.7, owner-actions 2.4. Whether the container's hostname table already resolves a `G-` id for `dangates.co.il` is 🔶 (see §1)                                                                                                                                                |
| Search Console              | ⬜    | Unverified; `googleSiteVerification: null`. `app/layout.tsx` emits `verification.google` from it since `c047d4d` (2026-09-06, Sprint 1 row 1.5) — inert until the token lands; owner-actions 2.3. `gsc-ingest.mjs` is ready and has nothing to ingest (backlog §15.3)                                                                                                                                                                |
| `data-cta` coverage         | ❌    | `cta-coverage.mjs`: 113 CTA elements on 45 pages, 89 tagged, **24 missing** (by kind: call 8 · whatsapp 10 · email 2 · submit 2 · contact-link 2), traced to 9 source elements by `cro-engagement-auditor`; 9 tagged source elements, 8 distinct values; 6 chrome CTAs counted once — backlog §13.2                                                                                                                                  |
| `lead_submit`               | ⚠️    | Pushed only on a confirmed Web3Forms send, outside the `try` — correct. Carries `{ form: "lead" }` and nothing else: no `site`, `page`, `service`, `city`, `placement` — backlog §13.4                                                                                                                                                                                                                                               |
| `form_start` / `lead_error` | ⬜    | Neither exists, nor `form_submit_attempt`; a delivery failure sets a status nothing renders — backlog §13.5, §8.6, N1                                                                                                                                                                                                                                                                                                                |
| Thank-you conversion URL    | ⬜    | No `/תודה/` route; success is an inline state swap with no `tel:` link — backlog §8.3. It lands with the `staticRoutes` registry that §1.4 plans for Sprint 1; today the nine static routes are a literal array inside `app/sitemap.ts`                                                                                                                                                                                              |
| Query-string attribution    | ❌    | The 37 legacy stubs call `location.replace()` to a bare path, so `utm_*` and `gclid` die on every legacy entry — backlog §13.3; fixed by real 301s, [ADR 0004](decisions/0004-redirects-replace-stubs.md)                                                                                                                                                                                                                            |
| Consent signal              | ⬜    | None. GTM loads on first paint for every visitor; the form links no policy — backlog §8.2                                                                                                                                                                                                                                                                                                                                            |
| Privacy policy              | ❌    | Read 2026-09-06: `/מדיניות-פרטיות/` names the form, phone and WhatsApp as collection channels and says nothing about cookies, Google Tag Manager, Google Analytics or Web3Forms — the processor the form actually posts to. See §6                                                                                                                                                                                                   |
| CSP allowances              | —     | None, because there is no CSP at all, not even report-only (backlog §12.2). Live 2026-09-06: `Strict-Transport-Security: max-age=15552000`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), microphone=(), camera=()` — all from a Cloudflare zone rule this repo does not own (§12.1; `edge.mjs` → `headersFile: false`) |
| AI-crawler reachability     | ✅    | Verified 2026-09-06: the edge answers 200 to ClaudeBot, OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, Perplexity-User and `CCBot/2.0` (Googlebot, bingbot 200) — §6.1 done, owner-actions 1.1 ✅. It was a managed `robots.txt` block on 2026-08-16 and an enforced 403 on 2026-08-23, and can return without a repo change — re-probe first, every time (§8)                                                                  |
| Cloudflare Web Analytics    | 🔶    | Not documented as on or off anywhere in this repo; a zone toggle — §5                                                                                                                                                                                                                                                                                                                                                                |
| CRM                         | ⬜    | Leads arrive as email via Web3Forms to `info@dangates.co.il` — §7                                                                                                                                                                                                                                                                                                                                                                    |

---

## 1. The shared-container constraint

`GTM-KWGGH438` is **one container for all ~10 Israeli fleet domains** (GTM account
`IL Sites (services)`), with the GA4 Measurement ID resolved _inside_ it by a RegEx Table variable on
`{{Page Hostname}}` — one Google tag, one call tag, one WhatsApp tag, one form tag, for ten sites.
dangates was deliberately folded out of its own container (`GTM-N2MQ27S7`) on 2026-07-13; splitting
again reverses a fleet decision. The mechanics — the RegEx rows, the `CTA Placement` variable that
reads `closest('[data-cta]')`, the trigger selectors, the Key-event marking per property — are in
[gtm-setup.md](../../Israeli%20services%20sites/docs/gtm-setup.md) and are not repeated here.

What that topology imposes on this repo:

- **A container change is a fleet change.** A broken trigger is an outage on ten sites. Never edit a
  shared trigger or variable to solve a dangates problem — add a hostname or `site` condition.
- **Every push carries `site: "dangates"`** so the container can route by site as well as by
  hostname (event-taxonomy); the kit's `trackEvent` does not add it, the caller does.
- **Preview against the live `dangates.co.il` hostname**, not another fleet domain — the RegEx row is
  what is being tested. The fleet doc reports the published container carrying ten `G-` ids while the
  dangates roster says `ga4MeasurementId: null`; which is true for this hostname is 🔶 until someone
  reads the resolved `{{GA4 Measurement ID}}` in Tag Assistant on this domain.
- **The container triggers on `href`, not on `data-cta`.** gtm-setup Steps 5–6 are the container's
  truth: `a[href^="tel:"]` and `a[href*="wa.me"]` catch every call and WhatsApp link fleet-wide, with
  `{{CTA Placement}}` as the dimension on top. event-taxonomy's Trigger column still shows
  `a[data-cta][href^="tel:"]` — stale; the row is corrected under §13.2. Two WhatsApp opens in
  `LeadForm` are `window.open` calls no click trigger can see — they push `whatsapp_click` explicitly
  or they do not exist.
- **`next/link` navigations are client-side even under `output: "export"`** — the 45 RSC
  `index.txt` payloads (§1.3) exist for exactly that. The GA4 tag must fire on History Change (or
  enhanced-measurement page views) or every second page view is lost; a URL-based conversion
  (`/תודה/`, §2.3) must be reached by a full load (`window.location.assign`) or its Page View
  trigger never fires.
- **Rocket Loader and Email Obfuscation stay off** ([cloudflare-runbook.md](cloudflare-runbook.md)
  "Leave these alone"): the first defers GTM, the second rewrites the footer `mailto:` into a 404.

---

## 2. The `dataLayer` contract

**[event-taxonomy.md](event-taxonomy.md) is the contract.** Event names, parameters, triggers and
status live there and only there; `tracking-analytics` wires them, `engagement-ux` wires the six
engagement events, and a new event name or value lands in the taxonomy in the same change that
pushes it. This section restates only what no change may violate.

### 2.1 The inviolable rule

> **No PII in `dataLayer`. Ever.** Not the name, not the phone number, not the email, not the message
> text — not truncated, not hashed, not "just for debugging".

`dataLayer` is readable in DevTools by anyone, flows to Google, and is visible to every tag a
container ten sites share loads. A phone number in it is a data incident (golden rule 10). The
permitted substitutes come from the route and the form's selects, never its text inputs: `page`,
`service` (slug or `""`), `city` (slug or `""`), `placement`, `form`, `reason`. As of 2026-08-24 the
one push in the repo is clean.

### 2.2 `data-cta` naming

`{placement}-{action}` — `header-call`, `sticky-whatsapp`, `form-submit`, `contact-email`.
`cta-coverage.mjs` (which calls the convention `{location}-{action}`) warns on anything outside
`^[a-z0-9]+-[a-z0-9]+$` and on one value naming two element kinds. The prefix maps to the taxonomy's
`placement` in the container's `CTA Placement` variable — `sticky` → `mobile_bar`, `finalcta` →
`final_cta`, the rest identical; the attribute value itself never carries an underscore. TypeScript
does not check hyphenated JSX attributes, so verify the attribute in `out/`, not in the source. **An
un-instrumented CTA is an invisible conversion; adding one without `data-cta` is a defect** the script
fails.

### 2.3 What GA4 treats as a conversion

| Key event (GA4) | Fed by                                                 | Weight                                                                                                                |
| --------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Call click      | `tel_click` — the `a[href^="tel:"]` trigger            | Highest; this business closes on the phone (`072-2587772`, its own line)                                              |
| WhatsApp click  | `whatsapp_click` — `wa.me` trigger + the explicit push | High; the photo channel. WhatsApp on this number is itself 🔶 (owner-actions 3.7)                                     |
| Lead form       | `lead_submit` **and** the `/תודה/` page view           | Moderate; the two cross-check each other — a push fired right before a full-load navigation can be lost with the page |

The container's GA4 event names are set in gtm-setup.md; Key events are marked per property once
owner-actions 2.4 lands. A `tel:` tap is intent, not an answered call. Campaign attribution rides on
the UTM scheme in [gbp-runbook.md](gbp-runbook.md) §6, which survives a legacy entry only after ADR 0004.

---

## 3. The performance budget for tracking

The site ships zero images and 751.1 kB of JS in 29 chunks (`perf.mjs`, 2026-08-24; ceiling
1,200,000 bytes in `scripts/audit/thresholds.json`). The budget for everything analytics adds:

| Rule                            | Limit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Third-party scripts on the page | **One:** the GTM loader, via `gtmHeadSnippet`, in `<head>` (§13.1). Nothing else, on any page                                                                                                                                                                                                                                                                                                                                                                                                              |
| Third-party origins             | By directive, for the CSP §12.2 will write: `script-src` `www.googletagmanager.com` (plus the inline loader); `connect-src` `*.googletagmanager.com`, `*.google-analytics.com` / `*.analytics.google.com`, and `api.web3forms.com` — the form's POST target, which a CSP built from the script list alone would silently kill; `img-src` `imgquarry.com` (the OG/media host `app/layout.tsx` preconnects); the Web Analytics beacon host only once §5.1 is documented. A new origin needs a written reason |
| Tag-added JS on the wire        | **Proposed:** gtm.js plus everything the container loads ≤ 100 KB compressed, measured in DevTools on the live page (`perf.mjs` sees only `out/`). It becomes a rule when `performance-web-vitals` lifts it into the `perf` block of `scripts/audit/thresholds.json` with the measurement behind it                                                                                                                                                                                                        |
| LCP                             | 0 ms from tags — nothing tag-related on the critical path; the font preload gap (§10.1) is the LCP work, not analytics                                                                                                                                                                                                                                                                                                                                                                                     |
| CLS                             | 0 — no tag may inject visible DOM                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Client components               | Engagement events come from **one** null-rendering client leaf mounting `useEngagementEvents`, per `engagement-ux`; no second hook, no per-component pushes. `KNOWN_CLIENT` in `rtl-lint.mjs` gains `EngagementEvents` in the same change as the leaf                                                                                                                                                                                                                                                      |

### 3.1 Banned outright

| Tool class                                       | Why it never ships here                                                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Session recording, heatmaps (Hotjar, Clarity, …) | They record input — on this site that is the name and phone number typed into the lead form. A recording of PII is the incident §2.1 forbids     |
| Chat widgets, pop-ups, exit-intent               | `engagement-ux` bans them; `MobileCtaBar` already holds the persistent-prompt role; each adds a script origin the future CSP would have to allow |
| A/B-testing SDKs                                 | Flicker on a text-only LCP, a long task on every load, and no traffic to power a test                                                            |
| Client-side CRM / marketing-automation SDKs      | They carry PII into a third-party origin from the browser — see §7 for the server-to-server path                                                 |

---

## 4. Search Console — unverified; DNS first

Not verified for this domain (owner-actions 2.3; business-facts §H) — every priority in Phases 3–4
of [growth-roadmap.md](growth-roadmap.md) is inferred rather than observed until it is.
**Recommended: a DNS-verified Domain property** (`dangates.co.il`, no scheme). The owner adds the TXT
record at Cloudflare (owner-actions 2.3) — a DNS mutation this repo's `guard-destructive-ops.ps1`
blocks by design. It needs no deploy, it covers `www` — which serves a full duplicate today (§1.7) —
and it does not ride on the shared container (verification through the installed GTM container works
but lapses with the container). **Fallback: the HTML token**, placed in the roster's
`analytics.googleSiteVerification` and synced. `app/layout.tsx` emits `verification.google` from that field since `c047d4d` (2026-09-06), so a synced token reaches the page on the next deploy; until then the token alone does
nothing until it lands. Never hand-edit `site.config.json` for either (golden rule 2).

Then, in order:

1. Submit `https://dangates.co.il/sitemap.xml` (45 URLs).
2. Check Coverage for the percent-encoded Hebrew routes first — they are the likeliest indexing quirk
   (`seo-metadata`).
3. Confirm the 18 location pages index as pages, not as duplicates of each other — the early warning
   for the doorway risk in [content-standards.md](content-standards.md) §2 (§3.1, §5.3).

**The monthly ingest.** Performance → Export → `node scripts/audit/gsc-ingest.mjs <queries.csv>
--month YYYY-MM [--pages pages.csv] --write` writes one section between the markers in
[rank-tracking.md](rank-tracking.md), bucketed by family (location · service · symptom · component ·
brand · generic). The script converts and never judges: a missing column is a hard error, a file
marked FIXTURE refuses `--write`, and no number in that file is typed by hand. `keyword-researcher`
is the only agent that edits it; reading a month is `keyword-research`'s cadence.

---

## 5. Server-side analytics — the honest recommendation

**Do not build server-side GTM for this site.** A tagging server (Cloud Run, or a Worker) moves tags
off the main thread, lengthens first-party cookies and recovers some ad-blocker loss. Here the costs
win:

- **A running server** with a bill and an uptime obligation, on an architecture whose whole point is
  "static files at the edge, nothing to operate". The deploy uploads `out/` only — no `functions/`,
  no `_worker.js` — so even a Worker is a fleet ops change, not a repo change.
- **Owner territory** (CLAUDE.md §12) — an agent documents it, it does not provision it.
- **It solves a problem this site does not have.** The gap is not ad-blocker attrition; it is that no
  GA4 or Search Console property exists, the head placement is wrong, 24 CTAs are untagged and
  `lead_submit` has no dimensions. A tagging server would measure the same unprovisioned set.

### 5.1 The lightweight layer worth doing

**Cloudflare Web Analytics** — cookieless, no consent implication, one small beacon, and Core Web
Vitals field data independent of GA4 and of ad-blockers; it complements GA4, which keeps the
conversion events. It is a zone toggle and therefore **owner-only** (CLAUDE.md §12): it needs a row
in [owner-actions.md](owner-actions.md) §1 naming both paths — zone → Analytics & Logs → Web
Analytics, and Workers & Pages → project → Metrics → Web Analytics — because which one covers a Pages
custom domain is unverified; it counts as on only when a live response shows the beacon, as with
every zone setting in [cloudflare-runbook.md](cloudflare-runbook.md). Once documented there, its
beacon is the one exception to the "one third-party script" row in §3.

**Cloudflare Zaraz** would move tags to the edge and take GTM out of the client entirely. It is a
zone toggle — owner-only — and it changes how the container is managed for all ten fleet sites, so it
is a fleet decision recorded in the fleet's docs, not this repo's, with the same live verification
before anyone calls it on.

### 5.2 Revisit server-side tagging only when

GA4 and Search Console exist and the event-taxonomy set is complete, **and** lead volume is high
enough that a measurement gap changes a decision, **and** the owner wants to run the infrastructure.

---

## 6. Consent

**What is true today.** The site sends no consent signal; GTM loads on first paint for every visitor
(§8.2). The audience is domestic — homeowners, ועדי בתים, property managers and businesses in מרכז
הארץ (CLAUDE.md §1) — on a Hebrew-only site. No page in this repo states a position on privacy law.

**What must be true regardless of the legal answer:**

- `/מדיניות-פרטיות/` names every processor the data reaches: Google Tag Manager and Google Analytics
  (cookies, what is collected) and **Web3Forms**, the processor the lead form posts to. Read
  2026-09-06, it names none — an inaccurate policy is fixed before any consent UI is discussed, with
  the wording through `hebrew-editor` and `claims-verifier` like any copy.
- The form links the policy next to its submit button (§8.2, `conversion-cro`).
- No PII in `dataLayer` (§2.1). GA4 does not store IP addresses; there is no setting to manage.

**The legal question is 🔶 and belongs in [business-facts.md](business-facts.md), not here:** whether
the business has obligations under Israel's Protection of Privacy Law amendments, and whether EU
visitors are material. Do not implement a banner speculatively; do not claim compliance. If the owner
answers yes to either, the implementation is **Google Consent Mode v2** with `denied` defaults for
`ad_storage`, `analytics_storage`, `ad_user_data` and `ad_personalization` set before the loader
runs, and a minimal banner — a container change (§1) plus one client leaf, scoped to this hostname.

---

## 7. CRM integration

Leads arrive as **email**, via Web3Forms, to `info@dangates.co.il` (`contact.email` in the manifest;
the public access key is `siteConfig.formAccessKey`, public by design, backlog §12.5 HOLDS). For the
current volume this is adequate and costs nothing in CWV.

**If a CRM becomes necessary**, ranked:

1. **Web3Forms webhook → CRM** _(recommended)_. Server-to-server, out of the browser, zero client JS,
   no new origin. The form already posts to Web3Forms; the CRM subscribes to it.
2. **A form backend with a native CRM connector** — same properties as (1) but a migration, and the
   current setup works.
3. **A Zapier / Make bridge** on the webhook — fine; a dependency and a monthly cost.
4. **A client-side CRM SDK — banned** (§3.1).

**Attribution that may travel with the lead.** The Web3Forms payload today carries `name`, `phone`,
`service` (display name) and `message`. Add `page`, the `service` slug, `city` (the select §8.4 adds)
and `placement` — the same non-PII fields `lead_submit` gains under §13.4 — so the email, and any CRM
record built from it, says which page produced the lead. That is the one place the lead's PII and its
attribution legitimately meet: in the email, never in `dataLayer`.

**Rules for any path:** server-to-server only, nothing about the CRM ships to the browser; **a lead
must never be lost to an integration failure** — the WhatsApp fallback stays and gets the visible
error state N1 / §8.6 owe it (a blocked popup is a lost lead today); lead data is PII — minimise
fields, define a retention period, disclose the processor (§6), and never push a CRM record id keyed
to a person into `dataLayer`.

---

## 8. The reporting loop

Measurement nobody reads is overhead. Until owner-actions 2.3 and 2.4 land, the only honest weekly
number is the count of Web3Forms emails in the inbox — say so rather than reporting "tracking works".

| Cadence   | Review                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Weekly    | Three numbers from GA4: call clicks, WhatsApp clicks, form submits (`lead_submit` vs `/תודה/` views — a gap between them is a lost-push signal, not a lead)                                                                                                                                                                                                                                                         |
| Monthly   | Search Console by family into [rank-tracking.md](rank-tracking.md) via `gsc-ingest.mjs`; pages with zero impressions after 90 days are the doorway-risk list (§3.1, §5.3). Read it with the "How to read a month" rules in that file                                                                                                                                                                                |
| Monthly   | The AI-citation panel: a fixed set of symptom and component prompts run by hand against the assistants, logged with a date (`aeo-geo-strategist`). Re-probe the edge first (`aeo-answer-content` Gate 1; §6.1, owner-actions 1.1): it answered 200 to every AI-crawler signature on 2026-09-06 after a 2026-08 block that can return without a repo change — a month with a 403 measures the block, not the content |
| Quarterly | CWV field data (CrUX; Cloudflare Web Analytics once enabled) against `scripts/audit/thresholds.json` `perf`; the gtm.js 200-check re-run                                                                                                                                                                                                                                                                            |
| Quarterly | Container audit in GTM: which tags fire for this hostname, which can be deleted, whether any unscoped tag was added by another site's work                                                                                                                                                                                                                                                                          |

---

## 9. Explicitly not doing

| Decision                                     | Reason                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Server-side GTM                              | A server to run, owner territory, solves a gap this site does not have (§5)                      |
| Cloudflare Zaraz from this repo              | Owner-only zone toggle and a fleet-level decision for ten sites (§5.1)                           |
| Heatmaps, session recording, chat, A/B SDKs  | Record or leak form PII; break the one-script budget (§3.1)                                      |
| A consent banner before the owner answers 🔶 | A legal position nobody has confirmed; costs conversions for an unmeasured benefit (§6)          |
| Hand-typed rank or traffic numbers           | `gsc-ingest.mjs` refuses fixtures for a reason; a number without an export is a fabrication (§4) |

---

## 10. Enforcement map

| Rule                                                                                                                    | Enforced by                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gtm.js 200-check on every id change and deploy                                                                          | Standing rule §13.6; the probe in cloudflare-runbook and `tracking-analytics`; `deploy-dangates` post-deploy step. Not a script yet                                                                                                                                                                                                                           |
| Container id from the roster, never a component                                                                         | `guard-protected-paths.ps1` + `permissions.deny` on `site.config.json` (golden rule 2); `gtmHeadSnippet` returns `null` on a malformed id                                                                                                                                                                                                                     |
| GTM loader in `<head>`, `<noscript>` in `<body>`                                                                        | Not enforced yet → §13.1; the proof is `grep -o 'gtm-init\|</head>' out/index.html` printing `gtm-init` before `</head>` (the file is one line, so `-n` shows nothing)                                                                                                                                                                                        |
| Every CTA carries `data-cta`, named `{placement}-{action}`                                                              | `scripts/audit/cta-coverage.mjs` (cro scope of `run-all.mjs`); `cro-engagement-auditor` → §13.2                                                                                                                                                                                                                                                               |
| No PII in `dataLayer`                                                                                                   | Not mechanical. `cro-engagement-auditor` reads every `trackEvent` push; `ts-react-reviewer` on the markup; golden rule 10                                                                                                                                                                                                                                     |
| `lead_submit` dimensions; `form_start`, `form_submit_attempt`, `lead_error`; explicit `whatsapp_click` on `window.open` | Not enforced yet → §13.4, §13.5, N1 / §8.6; the contract is event-taxonomy; reviewer `cro-engagement-auditor`                                                                                                                                                                                                                                                 |
| `/תודה/` conversion URL, `noindex`, reached by a full load, in the registry                                             | Not enforced yet → §8.3 with §1.4 (the `staticRoutes` registry, Sprint 1). `links.mjs` reads no `noindex` today — `pages.mjs classify()` calls a page a stub only with `noindex` **and** `location.replace(`, so a noindex `/תודה/` fails sitemap parity and the orphan check; the same change teaches `links.mjs` to exempt the registry's `noindex` entries |
| Query string survives every redirect                                                                                    | Not mechanical. `scripts/audit/edge.mjs` proves `public/_redirects` exists and resolves (`redirectsFile: true`, `stubs: 0`); query survival is the live `curl -sSI '<legacy URL>?utm_source=test'` in cloudflare-runbook "After the next deploy" → §1.1 / §13.3, ADR 0004                                                                                     |
| One third-party script; engagement events from one client leaf; no banned tool class                                    | Not mechanical today: `grep -oE '<script[^>]*src="https?://[^"]*"' out/index.html` → `googletagmanager.com` only; `perf.mjs` `clientComponents` and `rtl-lint.mjs` `KNOWN_CLIENT` count client files, not origins; `security-auditor` reads both; a CSP (§12.2, `web-security-headers`) makes the origin count mechanical                                     |
| Privacy policy names GTM/GA4 and Web3Forms; form links it                                                               | Not enforced yet → §8.2; `cro-engagement-auditor` check 1; copy via `hebrew-editor` → `claims-verifier`                                                                                                                                                                                                                                                       |
| No consent claim without owner confirmation                                                                             | `claims-verifier`; the question lives in business-facts as 🔶                                                                                                                                                                                                                                                                                                 |
| Rank numbers only from an export                                                                                        | `scripts/audit/gsc-ingest.mjs` (hard error on a missing column, FIXTURE refuses `--write`); `keyword-researcher` is the sole editor of rank-tracking                                                                                                                                                                                                          |
| Cloudflare toggles are owner-only, verified live                                                                        | `guard-destructive-ops.ps1` blocks Cloudflare API / DNS calls; `owner-actions.md` rows; `cloudflare-runbook.md` probes — including the AI-crawler probe before every AEO claim (§6.1 can revert)                                                                                                                                                              |

---

## 11. Acceptance checklist

- [ ] `curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"` → `200`, run on the id change and after the deploy
- [ ] `grep -o 'gtm-init\|</head>' out/index.html` prints `gtm-init` before `</head>`; the `<noscript>` iframe stays in `<body>`
- [ ] `node scripts/audit/cta-coverage.mjs` → `missingDataCta: 0`, no naming warnings
- [ ] `grep -rn "trackEvent\|dataLayer" components app lib` — every push carries `site: "dangates"` and no name, phone, email or message
- [ ] `lead_submit` fires only on a confirmed send, outside the `try`, with `page`, `service`, `city`, `placement`
- [ ] `form_start`, `form_submit_attempt`, `lead_error` exist; both `window.open` WhatsApp exits push `whatsapp_click`
- [ ] `/תודה/` exists, `noindex`, registered in the §1.4 `staticRoutes` registry, reached by a full load; `node scripts/audit/links.mjs` passes parity with it exempted as `noindex`
- [ ] The GA4 tag fires on History Change for `next/link` navigations — GTM Preview shows a page view on a second in-site page without a reload
- [ ] `node scripts/audit/edge.mjs` → `redirectsFile: true`, `stubs: 0`; a legacy URL with `?utm_source=test` lands with the query intact
- [ ] `grep -oE '<script[^>]*src="https?://[^"]*"' out/index.html` → `googletagmanager.com` only; on the live page DevTools Network (JS) shows nothing else third-party; `perf.mjs` `clientComponents` grew by at most the one engagement leaf
- [ ] `/מדיניות-פרטיות/` names Google Tag Manager, Google Analytics and Web3Forms; the form links it — `cro-engagement-auditor` confirms
- [ ] GTM Preview on `dangates.co.il`: one call click, one WhatsApp click, one submit — each fires once with `cta`, `page`, `placement`; the resolved Measurement ID is this site's; container edits hostname- or `site`-scoped
- [ ] Search Console: Domain property verified by DNS (or the roster token once `app/layout.tsx` emits it), sitemap submitted, first `gsc-ingest.mjs --write` section in `docs/rank-tracking.md`
- [ ] `curl -sS -A "ClaudeBot" -o /dev/null -w "%{http_code}" https://dangates.co.il/` → `200` before any AI-citation number is recorded
- [ ] No consent, compliance or Web-Analytics claim anywhere that owner-actions or business-facts does not back — `claims-verifier`; `npm run audit:env` → 0 dead citations
