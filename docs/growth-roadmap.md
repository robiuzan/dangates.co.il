# Growth roadmap — dangates.co.il

Where the site goes after Phase 0, in plain language. [optimization-backlog.md](optimization-backlog.md)
is the defect list with a verification command on every row; this is the narrative — what to do, in
what order, why that order, and what it needs from you. Nothing here is a number that was not
measured; every figure is "as of 2026-08-23" from `npm run audit`, and the scripts re-measure it.

Written 2026-08-23. Phase 0 — the fabricated reviews removed and gated, the blog spam cleaned, the
doubled titles fixed, breadcrumb schema on 44 pages — is built and verified on `out/`. **It was not live until 2026-09-06** (deployed that day at 11:06 UTC; the checks below describe the 2026-08-23 state). Checked against the domain the same day: the homepage still emits ten `Review` nodes under
real people's names, every service and location title still doubles the brand, no page carries
`BreadcrumbList`, one post still contains the injected spam token and all eleven still end in the dead
"פוסטים קשורים" tail. Production was the pre-Phase-0 build until 2026-09-06. Deploying is a production mutation that
needs your go-ahead (`deploy-dangates`) — and it comes before anything else on this page.

---

## 1. The uncomfortable part, first

You asked for better SEO, AI visibility, trust, rankings, content, navigation, engagement,
conversions and security. For a service-area trade business that converts on phone calls, the
ranking hierarchy is:

1. **Google Business Profile** — owns the map pack, where most "שער תקוע, מי מגיע היום" calls start
2. **Reviews** — feed the profile, the trust decision, and (when sourced) star rich results
3. **Content depth and local relevance** on the site
4. **Citations and links**
5. **Technical SEO**

This site has **nothing in tiers 1 and 2**. `schema.sameAs` is empty, no profile is linked anywhere,
and the reviews section is empty — deliberately. The homepage carried ten invented review texts
under ten real people's names, emitted as `Review` + `AggregateRating` schema. In the repo they are
gone since 2026-08-17 and the component is gated so they cannot come back without a public source
(business-facts §A). **On the live domain they stayed until 2026-09-06**, when the build that
removes them was deployed (11:06 UTC). Until then the site was one report away from a Google policy
action, and every other item on this page was secondary to that deploy. The fix itself is right,
and it leaves the site with **no proof of work at all**:

- **Zero photographs.** `grep -rho '<img' out --include=index.html | wc -l` → 0 across 45 pages. No
  gate, no job, no van, no person. The logo is text.
- **No person.** No owner, founder or technician is named. For a trade that sends a stranger to your
  gate with 230V tools, anonymity costs conversions as much as it costs E-E-A-T.
- **No reviews, no profile, no rating** — and the site is written so that none is implied.

The second problem is the one that decides whether the domain ranks: **the doorway pages.** All 18
location pages are one template with the city name swapped — each carries 2–3 tokens its nearest
sibling lacks (`node scripts/audit/content-depth.mjs`, doorway proxy), on a median of 122 unique words
against a 350-word floor. The 7 service pages differ by 13–23 tokens on ~152 words against 450. 41 of
the 45 content pages are under their floor. Doorway clusters are an explicit Google spam policy and
the penalty lands on the domain, not the page.

The third is outside the repo: **the AI crawlers are refused at the Cloudflare edge.** On
2026-08-16 that was a managed `robots.txt` saying `Disallow: /` to ClaudeBot, GPTBot and the rest. As
of 2026-08-23 the managed file is gone — the live `robots.txt` is ours and allows everything — but the
edge now answers **403** to a request that identifies as ClaudeBot, GPTBot, ChatGPT-User, Claude-User
or PerplexityBot while Googlebot and bingbot get 200. An advisory "please don't" became an enforced
refusal: no answer block, `llms.txt` or schema can be read by an assistant that is turned away at the
door. Every AI-visibility item below is capped until you change that zone setting
([owner-actions.md](owner-actions.md) §1.1; the exact steps and the decision table are
[cloudflare-runbook.md](cloudflare-runbook.md) step 1).

**Update 2026-09-06:** you changed it — the zone now answers **200** to every AI-crawler signature
on the full-UA probe (backlog §6.1 ✅). The cap is lifted. The probe stays the first step of every
AEO finding because the setting can revert without a repo change.

And the fourth is a set of claims the export makes over 160 times that nobody can back: "אחריות
מלאה" on 41 pages with no term, "24/7" on 42 pages, "ניסיון רב שנים" with `foundedYear: null`,
"פריסה ארצית" in the schema (`node scripts/audit/claims-grep.mjs`). You have told us the warranty term, licence,
insurance and founding year are **not coming** (§3 below). So the copy gets written around them —
honestly, and soon — rather than waiting.

Everything below is sequenced accordingly.

---

## 2. The phases — what each one buys

Each phase is a follow-up session with its own approval. Phases overlap; this is dependency order.

### Phase 0 — built 2026-08-17, deployed 2026-09-06

**Buys:** the fabricated reviews off the live domain; clean blog bodies; one brand suffix per title;
breadcrumb schema on 44 pages; a real 404. The build passes lint, typecheck, format and build; what
`npm run audit` still flags is the Phase 1–3 work below, not a regression. The deploy script dry-runs
first and keeps the previous build for rollback. **Blocked on you:** the go-ahead. Nothing else in
this document is worth starting while the live site still carries the reviews. **Deployed 2026-09-06 (11:06 UTC):** the live homepage carries no `Review`; the reviews are off the domain.

### Phase 1 — Correctness leftovers

**Buys:** the 37 old URLs become real 301s instead of meta-refresh stubs (keeps every ranking signal
they hold and stops stripping `gclid`/`utm` from campaign traffic); the security headers the site
already serves become owned by this repo instead of a zone rule nobody documented; the second
origin (GitHub Pages workflow, `CNAME`, `.htaccess`, one leftover Houston stub) is retired; the
sitemap is derived from data so a new page cannot be silently absent; the lead form tells a user
when delivery failed (today the error state renders **nothing**); the two contrast failures on the
conversion buttons are fixed; GTM moves from `<body>` to `<head>`; fonts are preloaded (the brand
font is the critical path on a text-only page); every call/WhatsApp/form CTA is tagged for tracking
(24 instances are not). **Blocked on you:** only the `www` → apex redirect (§1.2).

### Phase 2 — Schema completion

**Buys:** one business entity Google can read on every page instead of 18 pages pointing at a
`#business` node that is never defined; a `Service` node on each location page (today they carry
only breadcrumbs); a `WebSite` node for the site name in results; percent-encoded URLs that match the
canonicals; the logo and OG image on the graph. **Stays absent on purpose:** `Offer` (prices are not
coming), `Review`/`AggregateRating` (until the profile exists), `Person` (until someone is named).
`node scripts/audit/schema.mjs` = 0 is the acceptance.

### Phase 3 — Depth and navigation — the one that decides whether the domain ranks

**Buys:** 18 location pages that each say three or more true local things — named areas, the local
gate reality, travel and scheduling at that distance, a city-specific FAQ — so a city name swap no
longer produces a valid page; the four region entries (קריות, שרון, צפון, דרום) rendering correct
Hebrew (`באזור השרון`, not `בשרון`); 7 service pages that differentiate on the mechanics of each gate
type, with their own "when to call" list (today the shutters page says "השער נתקע") and their own
FAQ; a header that reaches all 7 services and 18 locations in one hop; a footer that stops omitting
six locations (`components/layout/Footer.tsx:76` slices to 12); service ↔ location cross-links that do not
exist today; related links chosen by relevance instead of array order. The bar is
[content-standards.md](content-standards.md); the doorway delta and word floors are measured, not
assumed. **Blocked on you:** nothing — but §3.5–3.6 answers make it better.

### Phase 4 — The guides hub and the block model

**Buys:** a `/מדריכים/` section for the pages that competitors rank with and this site has none of —
one symptom per URL, one component per URL, gate-type comparisons, the ועד בית guide, and the
ת״י 900 safety-standard page that is the strongest expertise asset available and needs no fact from
you. The first four ship with the hub; the queue, the order and the reasons are in
[content-calendar.md](content-calendar.md). The same change replaces the blog's flat content model,
which restores the heading outline, turns 42 dead link phrases into links, and lets a post carry a
table or an answer block. Three of the 11 migrated posts survive; the rest fold into guides or
redirect (calendar §4 — **needs your approval**, §3.8).

### Phase 5 — Engagement and conversion

**Buys:** a table of contents on long pages; FAQ answers that are in the page for assistants and
crawlers instead of hidden until clicked; a `/תודה/` page so a form submission is a URL that can be
counted; consent wording on the form; the city field the form declares but never collects; a CTA on
`/מחירון/` — the highest-intent page and the only commercial page without one; engagement events
(`tel_click`, `whatsapp_click`, `form_start`, `lead_submit` with page/service/city). **Blocked on
you:** the GA4 property (§2.4) — without it the events fire into nothing.

### Phase 6 — Trust and AI visibility

**Buys:** an authors registry that stays empty until someone is named, with the data-only path ready
for that day; an `AboutPage` with `knowsAbout` (the standard, the gate types); "אחריות מלאה" softened
sitewide to "אחריות על העבודה" and "ניסיון רב שנים" replaced by mechanism depth — claims the site can
stand behind; `llms.txt` and per-bot `robots.ts` rules ready for the moment the edge block lifts; the
photo pipeline wired the day photos arrive (Cloudflare Image Transformations are already on).
**Blocked on you:** the AI-crawler toggle (§1.1), the profile URL (§2.1), the photos (§4.1).

### Phase 7 — Measurement

**Buys:** the ability to know whether any of the above worked. Search Console queries ingested
monthly into [rank-tracking.md](rank-tracking.md) by family (generic · service · location · symptom ·
component · brand); a rank baseline; a monthly `/audit full` with a Δ against the previous report;
competitor SERP captures each quarter ([competitors.md](competitors.md) §4). **Blocked on you:** the
Search Console token (§2.3). Until it lands, every priority in Phases 3–4 is inferred rather than
observed — which is why §2.3 is cheap and should be first.

---

## 3. What is not coming — and how the site is written around it

You told us (business-facts, owner intake 2026-08-17) these are ❌ not available. The site does not
wait for them; it is written so that their absence is not a lie.

| Not coming                    | What the site does instead                                                                                                                                                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Warranty term, scope          | "אחריות על העבודה" — a true statement with no number; never "מלאה" with an implied duration. No warranty page.                                                                                                                                                                                                         |
| Licence, insurance            | No licence, insurance or certification is claimed anywhere. Expertise is shown by **mechanism depth** — why an עינית fails, what ת״י 900 requires — not by a badge.                                                                                                                                                    |
| Founding year, a named person | No `foundingDate`, no `Person`, no byline; articles are attributed to the organisation; "ניסיון רב שנים" goes. The ת״י 900 guide carries the expertise signal instead of a CV.                                                                                                                                         |
| Real prices                   | `/מחירון/` becomes "what determines the price" — fault type, gate weight, motor class, access, whether the visit fee is credited. The one sourced figure (₪150–350 visit) stays, marked as needing confirmation. No `Offer` schema. At least one competitor publishes a ~40-line price table; we will not copy theirs. |

Two things **are** coming — the Google Business Profile and real job photos — and they are the two
highest-leverage items in this whole document. They unblock tiers 1 and 2 of §1.

---

## 4. What I need from you

The full list with the exact toggle or deliverable for each is [owner-actions.md](owner-actions.md);
this is the summary, in the order it pays off.

0. **"Deploy it."** Phase 0 is built and gated; the reviews leave the live site the day you say so.
1. **Search Console** (§2.3) — a domain property or the HTML token, then a user for monthly exports.
   The cheapest item on the list and the only way to stop guessing what you already rank for.
2. **The AI-crawler setting** (§1.1) — Cloudflare → the zone → AI Crawl Control, allow at least
   ClaudeBot, GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended (the runbook recommends "allow
   retrieval, block training"). Read that page's per-crawler counts first; the cross-check is
   `curl -sS -A "ClaudeBot" -o /dev/null -w "%{http_code}" https://dangates.co.il/` → **200**
   (**done — verified 2026-09-06**; keep it that way). The `robots.txt` is already fine — checking
   it proves nothing.
3. **The Google Business Profile** (§2.1) — as a service-area business, no street address, the cities
   on the site as the area, phone `072-2587772`. Send the public URL. Then reviews accumulate there and
   we quote them verbatim (§2.2) — never paraphrased, never rounded. Setup detail:
   [gbp-runbook.md](gbp-runbook.md).
4. **Photos** (§4.1) — at least 8: each gate type, before/after pairs, detail shots of motor, control
   board, safety eye, track and roller; per photo the city, gate type and month. Landscape, ≥ 1600 px,
   no watermark, permission for anything identifiable.
5. **The GA4 property** (§2.4) — a measurement id; it is wired inside the shared container by hostname.
6. **Four answers** (§3.5–3.8): is 24/7 real, where, and what response time you will stand behind;
   which of קריות / שרון / צפון / דרום / באר שבע are genuinely served, as regions or cities; is
   WhatsApp on the lead number real; and approval to rewrite the migrated blog posts per the calendar.
7. **The `www` → apex redirect and the security-header rule** (§1.2, §1.3) — cleanup, not urgent.

---

## 5. What "better" looks like in six months

Targets to judge the work against, each one measurable by a script or a screenshot — not traffic
predictions, which nobody can honestly make without the baseline §4.1 provides.

- **Zero pages under their word floor** (today 41 of 45) and **18 of 18 location pages passing the
  doorway delta** (today 0) — `npm run audit -- --scope content` exit 0.
- **The 7 service pages each with their own FAQ, triggers and mechanics** — the service doorway delta
  above threshold.
- **`/מדריכים/` live with the first eight guides** of the calendar published, each past
  `article-auditor`, each reachable from at least two non-hub pages.
- **A Business Profile linked in `sameAs`, and the reviews section visible** with real reviews quoted
  verbatim — `grep -rl aggregateRating out` returns the homepage because it finally may.
- **Photos on every service page** with Hebrew `alt` and city/gate-type/month, shipped through the kit
  pipeline; `<img>` count > 0 for the first time.
- **AI crawlers allowed at the edge** (`curl -A "ClaudeBot"` → 200) and `llms.txt` served; the site
  cited in an assistant answer for a symptom query — checked by hand, logged with a date.
- **Real 301s, no stubs, one origin** — `node scripts/audit/edge.mjs` exit 0.
- **Every claim on the site traceable** — `node scripts/audit/claims-grep.mjs` exit 0; "אחריות מלאה"
  and "ניסיון רב שנים" gone from the copy.
- **Calls, WhatsApp clicks and form submissions counted as GA4 key events**, a `/תודה/` URL, and a
  Search Console baseline table in `rank-tracking.md` with a first monthly Δ.
- **`/הצהרת-נגישות/` true in every particular** — `node scripts/audit/a11y.mjs` exit 0.

---

## 6. Beyond the backlog — worth considering, not defects

**WhatsApp Business** on the lead number (once §3.7 confirms it): quick replies, away message with
the emergency line, a catalogue of the 7 services. WhatsApp is already the second conversion path.

**A follow-up for unconverted leads.** Most quote requests do not close on first contact; one polite
message two days later is the cheapest conversion improvement available and needs no SEO.

**ועדי בתים as an account, not a lead.** A building with a shared barrier has the same barrier next
year. A maintenance visit offer aimed at committees fits the audience the site names and the ועד בית
guide will bring.

**Local citations** — דפי זהב, זאפ, B144, מידרג — with the NAP exactly as the manifest (no address,
the `072-` number). Consistent citations support the map-pack ranking tier 1 depends on; the list and
the exact NAP string are in [gbp-runbook.md](gbp-runbook.md).

**A 60-second video of a real repair.** Real footage is proof nobody can fabricate, a `VideoObject`
is eligible for rich results, and it partly substitutes for the named person who is not coming.

**Case notes with real facts and no price.** "שער נגרר בחולון, גלגלים שחוקים, הוחלפו באותו ביקור" —
city, gate type, fault, outcome. One true sentence per job does more for local relevance and trust
than a paragraph of adjectives, and it needs only your job log.

**A symptom finder.** A small client-side tool: what the gate does → likely causes in order → the
guide that explains it → the CTA. Static-export friendly, a genuine lead magnet, and it needs no number
the business has not confirmed — unlike the cost calculator competitors run.

**Competitor SERP captures** — ten minutes a quarter in a real browser ([competitors.md](competitors.md)
§4) will reorder the calendar more accurately than inference can.

---

## 7. Suggested sequence

| Order         | Work                                                                        | Why here                                                               |
| ------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **First**     | Deploy Phase 0 (`deploy-dangates`, on your go-ahead)                        | The fabricated reviews are live until this happens                     |
| **Now**       | Search Console · AI-crawler setting · GBP claim · GA4 (owner-actions §1–2)  | None depends on code; each unblocks a phase                            |
| **Next**      | Phase 1 correctness · Phase 2 schema                                        | Small, mechanical, all verifiable by script                            |
| **Then**      | Phase 3 depth + navigation                                                  | The largest lever on the site and the one that clears the doorway risk |
| **Then**      | Phase 4 hub + first four guides + blog migration                            | The pages that get cited; the ת״י 900 anchor needs nothing from you    |
| **Alongside** | Photos arrive → Phase 6 image pipeline; reviews arrive → restore verbatim   | Each is a short, mechanical change once the asset exists               |
| **Ongoing**   | Phase 5 engagement · Phase 7 measurement · 2 guides a month · monthly audit | Continuous                                                             |
