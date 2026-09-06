# SEO / GEO / AEO strategy — dangates.co.il

> **Layer:** strategy. This document decides _what the site competes for and how it is shaped_.
> [keyword-map.md](keyword-map.md) is the tactical layer beneath it (tiers, title/H1 formulas, the
> route → keyword table); [content-standards.md](content-standards.md) is the acceptance bar for the
> copy. How-to: `seo-metadata`, `local-seo-il`, `aeo-answer-content`, `content-hub`,
> `keyword-research`, `schema-structured-data`. Audited by `seo-auditor`, `local-seo-strategist`,
> `aeo-geo-strategist`, `schema-auditor`; measured by `content-depth.mjs`, `schema.mjs`,
> `titles.mjs`, `links.mjs`, `edge.mjs`, `claims-grep.mjs`. Reads with:
> [growth-roadmap.md](growth-roadmap.md), [optimization-backlog.md](optimization-backlog.md),
> [business-facts.md](business-facts.md).
>
> One rule governs everything below: **a query family is owned by exactly one route family, and a
> page earns its place by saying something true and specific that a city-name or service-name swap
> could not produce.** Where this file and a skill disagree, check the code, then fix the skill; when
> a skill and an agent disagree, the script decides ([agent-roster.md](agent-roster.md)).

---

## 0. Current state — verified 2026-08-24 (AI crawlers re-verified 2026-09-06)

| Signal                                        | State                                                | Consequence                                                                                                                                                                                                                          |
| --------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `schema.sameAs`                               | `[]` in `site.config.json`                           | No entity graph; Google and every assistant infer the business from one unlinked domain. Lands in the roster, never here (golden rule 2).                                                                                            |
| `googleSiteVerification` · `ga4MeasurementId` | both `null`                                          | Search Console **unverified**, GA4 unprovisioned — every priority below is inferred, not observed; conversions are counted nowhere ([owner-actions.md](owner-actions.md) §2.3–2.4; backlog §13.7).                                   |
| `foundedYear`                                 | `null`, and **not coming**                           | No `foundingDate`; "ניסיון רב שנים" is unsourced and is replaced by mechanism depth (business-facts §B; backlog §7.2).                                                                                                               |
| Reviews / ratings                             | `reviews = []`, `REVIEW_SOURCE_URL = null` — gated   | `Review` and `AggregateRating` **forbidden** until quoted verbatim from a public profile. Ten fabricated reviews are gone from the repo since 2026-08-17 and off the domain since the Sprint 0 deploy on 2026-09-06 — golden rule 1. |
| Google Business Profile                       | ⏳ owner is producing it                             | For a service-area trade business this outranks every on-page lever in this repo ([gbp-runbook.md](gbp-runbook.md)).                                                                                                                 |
| AI crawlers                                   | **200** on the full-UA probe as of 2026-09-06 — open | Was an enforced **403** to 10 of 10 AI signatures on 2026-08-23/24 (backlog §6.1, now ✅; owner-actions §1.1). A zone setting that can close again with no repo change — re-probed before every AEO claim.                           |
| Content depth                                 | 41 of 45 pages under their word floor                | Locations score a doorway delta of 2–3 tokens against 120; services 13–23 (`content-depth.mjs`; backlog §3.1, §3.2).                                                                                                                 |
| Unconfirmed claims                            | four phrases render 168 times on 42 pages            | "אחריות מלאה", "24/7", "ניסיון רב שנים", "פריסה ארצית" — the lexicon in `scripts/audit/claims.json` (backlog §7.2).                                                                                                                  |

**Strategic implication.** On-page work has a ceiling. The ranking hierarchy for a service-area
business — profile, reviews, then depth, citations, technical SEO ([growth-roadmap.md](growth-roadmap.md)
§1) — puts the three highest-leverage moves off-site: GBP, verbatim reviews, `sameAs`; none lives in
this repo. The gate-1 opening (2026-09-06) lifts the cap on §4, not the ceiling. Off-site items move
through owner-actions and are never assumed done.

---

## 1. Site architecture — three silos, one hub

Each intent class owns a URL space, and **no silo answers another silo's question** — that is what
keeps 45 pages, and the guides to come, from cannibalising. The hub is the only expansion surface.

```text
/                              the head term + the brand entity
├── /services/[service]/       SILO A — 7 pages — "what we do, buy it" — transactional, by gate type
├── /locations/[city]/         SILO B — 18 pages — "we do it near you" — 14 cities + 4 region entries
├── /blog/                     the 11 legacy posts — keep / fold / redirect per content-calendar §4
├── /מדריכים/                  PLANNED (Phase 4, ADR 0002) — "what is wrong, what to choose, what the law requires"
│                              five pillars (content-calendar §1): תקלות · רכיבים · בחירה · בטיחות ותקנים · ועד בית
└── /שירותים/ /איזורי-שירות/ /מחירון/ /אודות/ /צור-קשר/   index + trust surfaces
```

`/איזורי-שירות/` is the live URL, misspelling included — never "correct" it (golden rule 3).
`/מדריכים/`, `lib/guides.ts` and `content/guides/` do not exist yet: `new-guide` builds them per
[decisions/0002](decisions/0002-guides-hub-route.md) and [decisions/0003](decisions/0003-block-content-model.md);
`app/sitemap.ts` derives its nine static routes from the `staticPages` registry in `lib/site-config.ts` (backlog §1.4, done 2026-09-06 in `c047d4d`); the hub's guides registry joins it in Phase 4.

### 1.1 The ownership contract

| Query family                                                              | Owner                                                                                             | Must not answer it                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Transactional service terms — `שער נגרר`, `מחסום חניה`, `תיקון שער חשמלי` | Silo A. `מחסום` goes into the שער-זרוע title/H1 (`new-service`, Phase 3), not a guide             | A guide title never equals a service `name`                                      |
| `תיקון שערים חשמליים ב{city}` and every ב+city form                       | Silo B, with `prefixed` for the four regions (backlog §5.2)                                       | Silo A never names a city in an H1/H2; a guide never matches `{service} ב{city}` |
| Symptom · component · brand · comparison · safety · committee             | The hub, one topic per URL, per the pillar table in [content-calendar.md](content-calendar.md) §1 | Silo A states its own case; it does not diagnose or compare                      |
| `כמה עולה` · `מחיר` · `מחירון`                                            | `/מחירון/`, pivoted to _what determines the price_ (N14; keyword-map §10)                         | No guide carries a price; guides link down to `/מחירון/`                         |
| "מי אתם"                                                                  | `/אודות/` (`AboutPage` + `knowsAbout`, Phase 6)                                                   | Nowhere else                                                                     |
| The 11 legacy posts                                                       | Keep 3, fold 4 into guides, 301 4 — content-calendar §4 (owner approval, owner-actions §3.8)      | Never a 12th legacy-style post; new editorial starts at `content-hub`            |

**No service × location matrix.** 7 × 18 = 126 cells; keyword-map §6 says do not build them. The
18 location pages differ by 2–3 tokens today; multiplying that pattern multiplies risk, not reach.
**Expansion cap:** no 19th city and no 8th service (`שער קונזולי`, `דלת מוסך פנלים`) until the 18
and the 7 pass the doorway test in content-standards §2 (CLAUDE.md §12).

### 1.2 Explicitly not doing

| Not doing                                                         | Why                                                                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| A `{service}-{city}` page per cell                                | The doorway pattern; a domain-level penalty (content-standards §2, keyword-map §6)                     |
| A `LocalBusiness` node per city, or a street address              | One business with no premises; an invented address is a suspension risk (schema-graph §5; §4.11 HOLDS) |
| A price table copied from the market                              | Their prices are theirs; 8 of 9 published ranges are authored estimates (competitors §3; backlog §7.3) |
| Brand pages, a named author, a rating, a licence, a warranty term | Brands 🔶 until business-facts §C (keyword-map §9); the rest ❌ not coming (owner-actions §3.1–3.3)    |

---

## 2. Keyword clustering model

Cluster by **intent × modifier**, never by search volume — there is none for this site and none may
be written without a cited source (`keyword-research` §2). The tiers are keyword-map §2, not
re-listed: Tier 1 head terms won by authority and depth; Tier 2 `{service} ב{city}` and the seven
gate-type pages (the silos); Tier 3 symptom and Tier 4 component queries (the hub — the biggest
under-served cluster and the AEO beachhead); Tier 5 commercial modifiers (titles and `/מחירון/`).
**One query family = one URL** — if two URLs would target the same term, one is wrong; deepen the
existing owner instead of publishing a sibling.

**The buyer-vocabulary rule.** Copy and headings use the term buyers type: **עינית** not חיישן,
**לוח פיקוד** not לוח בקרה, **מחסום** beside שער זרוע, **שכפול שלט**, **מינוע שער קיים** (keyword-map
§2 Tier 4). As of 2026-08-24 `עינית`, `לוח פיקוד`, `רועש` and `שחרור חירום` occur **0 times**
sitewide — the vocabulary gap is the content gap.

**How a term enters.** `keyword-research` finds evidence (a competitor page, an Israeli SERP capture,
sii.org.il, a GSC export) → `keyword-researcher` appends one row to keyword-map §13 with the URL and a
strength tier → `content-hub` runs the four-question "does it earn a page" test → a content-calendar
row → `/new-guide <family> <slug>` → `article-auditor`. A candidate whose target route already exists
is a cannibalisation flag, not a page; cannibalisation against the 7 services, the 18 locations,
`/מחירון/` and other guides becomes a **module-load throw in `lib/guides.ts`** (Phase 4, ADR 0003).

---

## 3. Local SEO

### 3.1 NAP for an address-less service-area business

The canonical strings are gbp-runbook §0 — copy, never retype: `דן שערים חשמליים`, `072-2587772`
(`phoneOverride: true`; never the shared fleet number), `info@dangates.co.il`,
`https://dangates.co.il/`, **no street address**. They flow roster → `site.config.json` →
`lib/site-config.ts` → footer, `/צור-קשר/`, `#business`, the profile, every citation and (Phase 6)
`public/llms.txt`; a mismatch splits the entity. The absent `address` is **correct** and holds
(backlog §4.11); WhatsApp on the same number is 🔶 (owner-actions §3.7) and is never the NAP.

### 3.2 The four entries that are not cities

קריות, שרון, צפון, דרום are regions. `locations` is `{slug, name}` only, so templates ship `בשרון`
and `בצפון` where Hebrew requires `באזור השרון` and `בצפון הארץ` (backlog §5.2). Phase 3 adds `kind`
and `prefixed` through `new-city`; schema switches `City` → `AdministrativeArea` on `kind`
(schema-graph §5); until then no guide names a region. Whether these four and באר שבע are genuinely
served is an open owner question (business-facts §E).

### 3.3 Geo signals, ranked by value per effort

1. **Google Business Profile** — service-area business, no pin, the 13 confirmed cities, the 7
   services named as the site's H1s, hours as the footer (gbp-runbook §1–§5). Not in this repo.
2. **A `Service` node per location page and a defined `#business` on every page** — today locations
   carry only `BreadcrumbList` and `#business` dangles on 18 pages (backlog §4.2, §4.4). Phase 2.
3. **`areaServed` as place nodes** — `City` / `AdministrativeArea` matching the published set, not
   the marketing phrase typed as `AdministrativeArea` on 8 nodes (backlog §4.8; owner-gated value).
4. **Genuinely local copy** — neighbourhoods, industrial zones, the local gate reality, travel and
   scheduling at that distance (`cityContent`, Phase 3). Zero geo signals exist today (backlog §5.5).
5. **Israeli citations** (gbp-runbook §12) only where a no-address listing is honest, each feeding
   roster `sameAs`; **GBP links tagged** `utm_campaign=gbp` ([event-taxonomy.md](event-taxonomy.md)).

### 3.4 The doorway line

> Take the page. Replace the city name with a different city name. Is it now a correct, publishable
> page for that other city? **If yes, it is a doorway page and must not ship.**

The measurable half is the doorway delta in `content-depth.mjs` — tokens a page carries that its
nearest sibling lacks, threshold `doorwayMinUniqueTokens: 120` in `scripts/audit/thresholds.json`.
As of 2026-08-24 every location scores 2–3, every service 13–23. The delta is necessary, not
sufficient: `local-seo-strategist` and `claims-verifier` read every new city page. A city about which
nothing true and specific can be said does not warrant a page — say so in business-facts §E.

**Coverage honesty.** "24/7" and "פריסה ארצית" are bounded to what the owner confirms (business-facts
§E; backlog §5.4): the copy is written around them, `claims-grep.mjs` fails on the phrases, and
neither enters a title, an `areaServed` node or the profile's hours (gbp-runbook §5).

---

## 4. AEO / GEO — being the quoted answer

Answer engines do not rank pages; they **extract passages and attribute them**. Four gates, in order;
failing gate 1 made gates 2–4 irrelevant until 2026-09-06.

### 4.1 Gate 1 — edge access (owner-only, re-probed every time)

**Open as of 2026-09-06**: ClaudeBot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot,
Perplexity-User and `CCBot/2.0` return **200** on the full-UA probe (backlog §6.1 ✅; owner-actions
§1.1 ✅). Until then the edge answered **403** to every AI-crawler signature while Googlebot, bingbot
and curl got 200. The toggle is the zone's AI Crawl Control — [cloudflare-runbook.md](cloudflare-runbook.md)
step 1 (recommended: allow retrieval, block training) — and it can revert with no repo change. So
the probe is the first row of every AEO finding, with the **full published UA string**, never the
bare token; if an allowed crawler is refused, gates 2–4 are capped again and every finding says so.
No repo change overrides the zone (`guard-destructive-ops.ps1` blocks Cloudflare calls by agents).

```bash
curl -sS -A "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" -o /dev/null -w "%{http_code}" https://dangates.co.il/   # want 200
```

### 4.2 Gate 2 — robots.txt proves nothing

`app/robots.ts` allows every AI crawler declaratively (`AI_CRAWLERS`, the fleet-wide per-bot list — live since the Sprint 0 deploy on 2026-09-06). `robots.txt` returned `200 Allow: /` **even while the edge refused
every AI UA**, so a robots-only check is a false pass in either direction (N18). The one `Disallow`
candidate is the 45 crawlable RSC `index.txt` payloads (backlog §1.3). Enforcement is the zone's.

### 4.3 Gate 3 — the extraction contract

Every service page, location page, post and guide carries, in this order:

- **An answer block first** — 40–60 words as the first `<p>` after the `<h1>`, complete in the first
  sentence, self-contained, buyer vocabulary (`thresholds.json` `answerBlock`; content-standards §5).
  As of 2026-08-24, **0 of 36** service, location and post pages have one (backlog §6.2). Beneath
  it, **question-form H2s** with real `<h3>`s — the typed block model (ADR 0003), not a wall of `<h2>`s.
- **One `FAQPage` question per page sitewide** (`content-hub`; `schema.mjs` checks parity). The
  homepage FAQ is not shrunk; deep owners get a `moreAt` link-out. Its answers run 4–12 words (§3.5).
- **Answers in the DOM at first paint** — `<details>/<summary>`, not `display:none` (N8); never mark up an unrendered answer.
- **Captioned tables**, definition blocks ("שער נגרר הוא…") and comparison blocks — the formats
  assistants lift; every guide family carries one required table (`new-guide`).
- **`dateModified` from a real `updated` field** — pinned to `datePublished` on 11 of 11 posts today
  (backlog §6.4). `מעודכן 2026` in a title only where `updated` is real.

### 4.4 Gate 4 — citability

An assistant picks the source that answers most precisely; reassurance loses to a competitor with a
number. Nothing on the site carries a citable number or table today (backlog §6.3). The substance,
in build order ([content-calendar.md](content-calendar.md) §2):

1. **The ת״י 900 חלק 21.03 safety page** — the SII fatality record, the 800,000 ₪ judgment, the
   criminal-offence framing, the insurance consequence and a conformity checklist on one page; no
   competitor combines them (keyword-map §12). Citable **only with the sii.org.il URL inline**; the
   2006 date and the licensed-electrician question stay 🔶 until sii.org.il or gov.il says so.
2. **Mechanism depth per gate type** — which motor and drive suit which weight and width, what
   shortens an operator's life, the self-fix boundary where 230V work must stop.
3. **"What determines the price"** — fault type, gate weight, motor class, motor reuse, cabling run,
   whether the visit fee is credited (N14; keyword-map §10). The 150–350 ₪ visit fee interpolates from `priceRows`.

**`public/llms.txt`** ships from `.claude/skills/aeo-answer-content/templates/llms.txt` (backlog
§6.5): NAP from the manifest, the 7 services and 18 areas with percent-encoded canonicals, and a
"notes for AI assistants" block naming what must **not** be attributed — no warranty term, years,
rating, licence or response-time promise. `edge.mjs` → `llmsTxt: false`; live 404 as of 2026-09-06.
**No author → `Organization`:** no person is coming (owner-actions §3.3); `lib/authors.ts` (Phase 6)
stays empty and `schema.mjs` forbids a `Person` author while it is. Expertise is mechanism depth.

---

## 5. Entity strategy

The business must resolve as an **entity**, not a domain. Today it does not: `sameAs` is `[]`,
`#business` is defined only on the homepage, there is no `WebSite` node, nothing off-site
corroborates the name. Target graph — [schema-graph.md](schema-graph.md) §1–§3, in this order:

1. **One `GeneralContractor` `#business` node defined on every page** that references it — dangling
   on 7 services and 11 posts today (backlog §4.4). Never a `Product`, never a per-city `LocalBusiness`.
2. **A `WebSite` `#website` node** on the homepage, `publisher → #business` (backlog §4.9); every
   `url` / `@id` / `mainEntityOfPage` percent-escaped (18 raw-Hebrew values today; backlog §4.7, N2).
3. **`sameAs` populated only with confirmed profiles**, GBP first, then each citation — in the
   roster, synced down, emitted by `localBusinessJsonLd`. 🔶 on every entry until its URL exists.
4. **`logo` and `image`** — the manifest OG card (wired) and `public/dangates-logo.png` (unreferenced),
   reaching the graph on no page (backlog §4.5).
5. **`AboutPage` with `knowsAbout`** — the standard and the gate types — on `/אודות/` (Phase 6,
   `eeat-build`). Brand strings byte-identical everywhere (§3.1). Absent on purpose: `Offer`,
   `Review` / `AggregateRating` (until quoted verbatim from the profile), `Person`, `foundingDate`,
   `PostalAddress`, `GeoCoordinates` around an invented midpoint.

---

## 6. What we measure

| Question                        | Instrument                                                                          | Status                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Are we indexed, and for what?   | Search Console → `gsc-ingest.mjs` → [rank-tracking.md](rank-tracking.md), by family | ⏳ blocked on the token (owner-actions §2.3; backlog §15.3)        |
| Which queries convert?          | GA4 landing-page report + `lead_submit` dimensions                                  | ⏳ blocked on the property (owner-actions §2.4)                    |
| Are we cited by AI engines?     | the AI-citation panel below, monthly                                                | ⬜ not yet run; unblocked since gate 1 opened 2026-09-06           |
| Who ranks, with what page type? | browser SERP captures, `hl=he&gl=il` ([competitors.md](competitors.md) §4)          | ⬜ no capture yet; rank order unverified until one exists          |
| Is gate 1 still open?           | the full-UA curl in §4.1                                                            | ✅ 200 on 2026-09-06; re-run as the first row of every AEO finding |

**Monthly GSC ingest.** `gsc-ingest.mjs <queries.csv> --month YYYY-MM --write` buckets queries into
generic · service · location · symptom · component · brand; movement is read per family, never per
page. A number typed by hand there is a fabrication.

### 6.1 The AI-citation panel

Ten fixed Hebrew prompts derived from the keyword-map families, run monthly against ChatGPT,
Perplexity, Claude and AI Overviews. Fixed wording — a changed prompt is a new series.

| #   | Family          | Prompt                                     |
| --- | --------------- | ------------------------------------------ |
| 1   | symptom         | שער חשמלי לא נסגר עד הסוף — מה לבדוק?      |
| 2   | symptom         | השער החשמלי לא מגיב לשלט, מה עושים?        |
| 3   | symptom         | למה שער חשמלי רועש או חורק?                |
| 4   | service + city  | מי מתקן שערים חשמליים בתל אביב?            |
| 5   | service + city  | תיקון שער חשמלי בפתח תקווה — למי פונים?    |
| 6   | component       | מה זה עינית לשער חשמלי ולמה היא נכשלת?     |
| 7   | component       | מתי מחליפים לוח פיקוד לשער חשמלי?          |
| 8   | comparison      | שער נגרר או שער כנף — מה מתאים לכניסה צרה? |
| 9   | pricing drivers | מה משפיע על מחיר תיקון שער חשמלי?          |
| 10  | safety standard | מה דורש תקן ת״י 900 חלק 21.03 משער חשמלי?  |

One row per prompt per engine: **date · engine · prompt # · cited yes/no · URL cited** (ours or a
competitor's — its page type is the useful datum). Logged in the month's `docs/audits/<date>-full.md`
by `aeo-geo-strategist` during `/audit full` — section 7 of `docs/audits/_template.md`, added 2026-09-06.
Prompts 4–5 will return the map pack or directories until the GBP exists; that is the point.
**Quarterly competitor captures** (competitors §4) may reorder the calendar; the **monthly `/audit
full`** report carries the Δ on every script above (baseline 2026-08-24).

---

## 7. Enforcement map

| Rule                                                                                                              | Enforced by                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| One query family = one URL; no guide in the silos' phrase space                                                   | `article-auditor` by hand → `lib/guides.ts` module-load throws (not yet → backlog §6.3, ADR 0003)                                                      |
| No service × location matrix; no 19th city / 8th service                                                          | `local-seo-il`, `content-hub` doctrine; CLAUDE.md §12 — judgment, not mechanical                                                                       |
| Doorway delta ≥ 120; word floors; answer block 40–60 words                                                        | `content-depth.mjs` (`thresholds.json`) — the answer block warns until Phase 3 copy lands (backlog §6.2); `local-seo-strategist` reads new city pages  |
| One Q/A per `FAQPage` sitewide; answers rendered                                                                  | `schema.mjs` parity; `<details>` not yet → N8                                                                                                          |
| `#business` defined on every page; `WebSite`; escaped URLs                                                        | `schema.mjs` — fails on all three today (backlog §4.4, §4.9, §4.7)                                                                                     |
| `Review` / `AggregateRating` / `Person` / `Offer` absent until sourced; no address; `sameAs` only from the roster | `schema.mjs`; `Reviews.tsx` gate on `REVIEW_SOURCE_URL`; `schema-auditor` (backlog §4.11 HOLDS); `guard-protected-paths.ps1` denies `site.config.json` |
| Buyer vocabulary; region grammar (`prefixed`)                                                                     | `hebrew-editor` review; `prefixed` not yet → backlog §5.2 (`new-city`, Phase 3)                                                                        |
| Unconfirmed claims (24/7, ארצית, אחריות מלאה, ניסיון)                                                             | `claims-grep.mjs` (`claims.json`); `post-edit-lint.ps1` at edit time; `claims-verifier`                                                                |
| Title brand once; canonical = sitemap; one H1; orphans; chrome reach                                              | `titles.mjs`, `links.mjs`                                                                                                                              |
| Gate 1 re-probed live, full UA string, never inferred; no zone mutation by an agent                               | `aeo-answer-content` checklist; `aeo-geo-strategist` brief; `guard-destructive-ops.ps1` — the probe is manual (🔶 no script probes the live edge)      |
| `llms.txt` present and in sync; `dateModified` from a real `updated`                                              | `edge.mjs` `llmsTxt` (presence only; not yet → backlog §6.5); not yet → backlog §6.4 (`new-article`, `articleJsonLd` in Phase 2)                       |
| No volume / CPC / difficulty without a source; GSC numbers only via the script; citations in this file resolve    | `keyword-research` §2 rule; `gsc-ingest.mjs` `--write` refuses the fixture (backlog §15.3); `env-doctor.mjs` (`npm run audit:env`)                     |

---

## 8. Acceptance checklist

No page ships without all of these; each line is a command or a named agent.

- [ ] Exactly one `<h1>`, one search intent; heading order unbroken; ≥ 2 in-copy internal links with descriptive anchors; reachable from ≥ 2 non-index pages — `links.mjs`
- [ ] Title unique sitewide, brand suffix **exactly once**; canonical self-referencing, trailing slash, percent-escaped byte-identically to the sitemap `<loc>` — `titles.mjs`
- [ ] The route family owns the primary query per §1.1; no cross-silo collision — `article-auditor` (guides), `lib/guides.ts` throws once built
- [ ] Word floor met with unique copy; for a location or service, doorway delta ≥ 120; a 40–60 word answer block as the first `<p>` after the `<h1>` — `content-depth.mjs`
- [ ] Every FAQ question in exactly one `FAQPage` sitewide, rendered in the DOM; JSON-LD per [schema-graph.md](schema-graph.md) with `#business` defined, escaped URLs, one `@graph`, no `Review` / `Offer` / `Person` / `PostalAddress` — `schema.mjs`
- [ ] Every claim free per content-standards §6 or marked 🔶 with a business-facts row; a live 🔶/⛔ phrase is stop-ship — `claims-grep.mjs`, `claims-verifier`; buyer vocabulary (עינית, לוח פיקוד, מחסום) — `hebrew-editor`
- [ ] Guides only: the family's required table, `relatedServices` declared, reverse-index entry — `article-auditor`
- [ ] Any AEO finding opens with the dated gate-1 probe; if an allowed crawler is refused it says gates 2–4 are capped — `aeo-geo-strategist`
