---
name: content-hub
description: The /מדריכים/ knowledge-hub doctrine for dangates — the five pillars (תקלות, רכיבים, בחירה, בטיחות ותקנים, ועד בית) and which query family belongs where, the four-question "does it earn a page" test, the anti-cannibalisation rules that become module-load throws against the 7 service pages, the 18 location pages and /מחירון/, the one-Q/A-per-FAQPage rule and the homepage-FAQ moreAt link-out contract, the reverse index that makes an orphaned guide impossible, the pricing pivot, and the two-guides-a-month cadence kept in docs/content-calendar.md. Use when deciding what to publish next, whether a topic earns a guide at all, or how the hub connects to the silos. Triggers: "what should we write next", "does this need a guide", "topic cluster", "cannibalisation", "content plan", "editorial calendar", "מה לכתוב עכשיו", "מדריך חדש", "האם זה מצדיק עמוד".
---

# The knowledge hub

`/new-guide <family> <slug>` is _how_ to build a guide. This is _what_ to build and why — without it,
guide #7 duplicates guide #3, or a symptom page competes with the service page that already ranks.

**State as of 2026-08-23:** the hub does not exist. There is no `app/מדריכים/`, no `lib/guides.ts`,
no `content/guides/`, and the only editorial model is `PostBlock = {type: "h" | "p" | "li"; text}`
(`lib/posts.ts:9`). Phase 4 builds the route family and the block model (ADR 0002, ADR 0003) and
ships guides #1–#4 with it. Every decision below is made _now_ so that Phase 4 builds the right
thing; nothing below is a live route. `/keyword-research` feeds this skill; `/new-guide` consumes
its verdict; `article-auditor` gates what ships; `docs/content-calendar.md` is the queue.

## The governing idea

The 7 service pages own **"what we do, buy it."** The 18 location pages own **"we do it near you."**
Neither can own **"what is wrong, what should I choose, what does the law require"** — and that is
where the Tier-3/4 families in `docs/keyword-map.md` §2 and §8 live: symptom queries competitors
treat as first-class URLs, component queries with a page per part, the ועד בית audience the site
names and never serves, and the ת״י 900 angle nobody in the market has assembled on one page (§12).

The hub's job: be the best Hebrew answer to that question, then hand the transaction to the silo
page that already ranks for the commercial term. A guide that sells is a worse service page; a
service page that explains is a worse guide.

## Five pillars

| Pillar        | `pillar`    | Family       | Owns (one topic per URL)                                                                                                                                   | Hands off to                                              |
| ------------- | ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| תקלות         | `faults`    | `symptom`    | לא נסגר · לא נפתח · לא מגיב לשלט · נתקע · רועש/חורק · הפסקת חשמל ושחרור חירום — DIY diagnosis first, then the safety gate (keyword-map §11.3)              | the gate-type service page the symptom lives on, one city |
| רכיבים        | `parts`     | `component`  | מנוע · שלט + שכפול · עינית · לוח פיקוד · גלגלים/מסילה/פס שיניים · מפסק גבול · קבל הנעה · חיישן כביש · סוללת גיבוי — role, failure modes, replace-or-repair | `/מחירון/` (what drives the price), the service           |
| בחירה         | `choice`    | `comparison` | קונזולי/נגרר/כנף · לתקן או להחליף · מינוע שער קיים · brands (BFT, Nice, Somfy, Beninca — 🔶, see below)                                                    | the two or three services being compared                  |
| בטיחות ותקנים | `safety`    | `safety`     | ת״י 900 חלק 21.03 — what it requires, who is liable, the conformity checklist, periodic checks                                                             | every service; `/אודות/` (`knowsAbout`, `eeat-build`)     |
| ועד בית       | `committee` | `committee`  | shared car parks, barrier approval, owners' majority, who pays, B2B procurement                                                                            | שער-זרוע · שערים-לחניה · שערים-לדירה · `/צור-קשר/`        |

`brand` is a family of the בחירה pillar and is **🔶 blocked**: a brand page is honest only for a brand
the business actually services (keyword-map §9 warning; business-facts §C "manufacturer training /
brands"). Until §C is answered, at most one overview guide that names no brand as "ours"
(content-calendar #16). Never claim dealer status, factory training or a manufacturer warranty.

**The safety pillar is the E-E-A-T anchor.** Keyword-map §12 verified on sii.org.il: the standard is
ת״י 900 חלק 21.03, a non-compliant installation is a criminal offence, fatalities are documented, a
court awarded ₪800,000. Those facts are citable **only with the SII URL beside them**. The October-2006
date and whether a licensed electrician is legally required are **unverified** — 🔶 until sii.org.il
or gov.il says so. `claims-verifier` checks every external fact against the source, never a competitor.

## Does this topic earn a page?

Four questions. Any "no" means it is a paragraph on an existing page, not a guide.

1. **Is it a diagnosis, decision or obligation question?** "מהו שער נגרר" is a definition — it belongs
   on `/services/שערים-נגררים/`. "שער נגרר או כנף" is a decision. "למה השער לא נסגר" is a diagnosis.
2. **Can we say something specific and true that a competitor cannot?** If the honest draft is generic
   reassurance — or needs a 🔶 fact to be useful — it will neither rank nor be cited.
3. **Does it stay out of the silos' phrase space?** See the throws below. `כמה עולה תיקון שער` belongs
   to `/מחירון/`; `תיקון שערים חשמליים בחולון` belongs to `/locations/חולון/`. Never a guide.
4. **Is there a table, comparison, checklist or sequence in it?** The family table in `/new-guide`
   names the citable asset each family must carry. No table, no page.

A candidate passes here **before** it gets a row in `docs/content-calendar.md`; evidence for it lives
in keyword-map §13 (`keyword-researcher` appends there and nowhere else — a source URL, never a volume).

## Anti-cannibalisation — enforced, not advised

These become **module-load throws in `lib/guides.ts`** (Phase 4, ADR 0003) so `npm run build` fails
instead of shipping a competing page. Until that file exists, `article-auditor` applies them by hand:

- **No guide `title` or H2 equals a service `name` or matches `{service} ב{city}`.** That phrase space
  belongs to pages that already rank for buying intent (`services`, `locations` in
  `lib/site-config.ts`; the `{service} ב{city}` set is 126 cells nobody builds — keyword-map §6).
- **One Q/A string in exactly one `FAQPage` sitewide.** A guide FAQ question may not repeat a homepage
  `faqs` question (`lib/content.ts:170-211`) or another guide's. `node scripts/audit/schema.mjs`
  checks the parity on the export (backlog §4.13).
- **No two guides target the same Tier-3 query.** One symptom per URL: `לא נסגר` (#5), `לא נפתח`
  (#10) and `הפסקת חשמל` (#11) are three guides, not one with three H2s — and the legacy post
  `שער-חשמלי-לא-מגיב` splits into #6 and #11 (content-calendar §4).
- **Every H2 is unique across the hub**, and the body under a similar heading is written from that
  guide's angle. The doorway test (content-standards §2) applies inside the hub.

Deliberately **not** forbidden: prose overlap. A 1,200-word guide and a 40-word homepage accordion
answer are not competing; pretending they are produces thin guides that dodge their own topic.

## The homepage-FAQ contract

Do **not** shrink the homepage FAQ. It is the only `FAQPage` on the site (`app/page.tsx:33`) and it
makes the homepage convert. Each question with a deep owner gains `moreAt: { href, label }` on its
`faqs` entry; `Faq.tsx` renders it inside the answer panel **outside the `a` string**, so
`faqJsonLd([...faqs])` still receives clean text. `lib/guides.ts` throws if a `moreAt` href names a
slug that is not registered. The homepage passes more equity than any other page — this turns the
biggest cannibalisation worry into the hub's strongest internal-link source.

| Homepage FAQ (`lib/content.ts`)          | Owner                                                                 | Status      |
| ---------------------------------------- | --------------------------------------------------------------------- | ----------- |
| כמה זמן לוקח לתקן שער חשמלי?             | the תקלות overview guide (fold of `תקלות-נפוצות…`, cal. §4)           | ⏳ Phase 4  |
| האם יש אחריות על התיקון?                 | stays home — no term is coming (business-facts §D)                    | no link-out |
| מה כוללת תחזוקה שוטפת לשער?              | `/blog/תחזוקה-מונעת-לשערים-חשמליים/` once migrated to the block model | ⏳ Phase 4  |
| איך לבחור שער חשמלי חדש?                 | #4 gate-type comparison                                               | ⏳ Phase 4  |
| מה העלות של ביקור טכנאי לבדיקה?          | stays home → `/מחירון/` is already in the nav                         | no link-out |
| האם אתם עובדים עם לקוחות פרטיים ועסקיים? | #3 ועד בית                                                            | ⏳ Phase 4  |
| מה כוללת התקנה של שער חדש?               | #1 ת״י 900 (what a compliant installation must include)               | ⏳ Phase 4  |
| איך ניתן ליצור קשר?                      | stays home; `/צור-קשר/`                                               | no link-out |
| האם אתם מציעים שירותי חירום?             | #11 הפסקת חשמל ושחרור חירום                                           | ⏳ Phase 4+ |
| כמה זמן לוקחת התקנה?                     | #4 (the matrix carries an install-duration axis)                      | ⏳ Phase 4  |

The `moreAt` wiring never edits the `a` strings. Deepening the 4–7-word answers is backlog §3.5 and
the "אחריות מלאה" at `lib/content.ts:177` is `eeat-build`'s to soften — separate changes.

## Wiring — why an orphan is impossible

Each guide declares `relatedServices` (validated against `services` at module load; at least one).
`guidesForService()` in `lib/guides.ts` is the reverse index, and the service and location routes
render a `מדריכים בנושא` block from it — so a guide that declares a service **appears on that
service's page automatically**. `relatedGuides` is a total `Record<GuideSlug, …>`, so adding a guide
without placing it on the adjacency map is a compile error. The hub index emits the full list as
`ItemList` in the same order it renders. `guidesForLocation()` is the second index; a guide declares
a location only when it genuinely names that city in copy — and until Phase 3 adds `prefixed`, it
names **no region** (`בשרון`/`בצפון` is wrong Hebrew; content-standards §8).

Target: every guide reachable from **≥ 2 non-hub pages** plus the index. `node scripts/audit/links.mjs`
reports `orphans` (0 today on 45 pages) and `notInChrome` (6 location pages, backlog §9.2); the
three-axis mesh city × gate type × symptom is `/internal-linking`'s.

## The pricing pivot

`/מחירון/` publishes 9 ranges of which only the 150–350 ₪ visit fee is sourced (`lib/content.ts:157`,
business-facts §D); real prices are **not coming**. So the hub never carries a price: component and
comparison guides explain _what determines the price_ — fault type, gate weight and width, motor
class, whether the existing motor is reusable, cabling run, whether the visit fee is credited — and
link to `/מחירון/`, which keyword-map §10 pivots to the same framing. `כמה עולה…` queries route
there, never to a guide. Prices, where quoted at all, interpolate from `priceRows`.

## Cadence and the calendar

- **Two guides a month** after Phase 4 ships #1–#4 (ת״י 900 · רועש · ועד בית · gate-type comparison).
  The order in content-calendar §2 is evidence strength × under-served × owner input needed;
  re-order only on evidence (keyword-map §13 row, or a GSC ingest once the token lands).
- **No seasonality is evidenced** for this trade — do not plan around one.
- **Refresh beats republish.** A `dateModified` bump on #1 when sii.org.il changes, or on the
  component guides when the `/מחירון/` copy changes, is worth more than a 17th guide.
- **Upkeep of `docs/content-calendar.md`:** a row enters only after the four-question test; status
  moves planned → drafting (the `content/guides/<slug>.ts` file exists) → review (the three reviewers
  invoked) → published (`npm run gate` passes on the build that contains it and the sitemap lists it).
  The "owner facts needed" column is filled from business-facts, never from memory.

## Hand-offs

`keyword-research` (evidence into keyword-map §13) → **content-hub** (does it earn a page; which
family; which silo it hands off to; the calendar row) → `/new-guide <family> <slug>` (the file, the
registry, the mesh) → `article-auditor` → `hebrew-editor` → `claims-verifier` → `npm run gate`.
Routing table: `docs/agent-roster.md` §3, rows §3, §6 and "keyword expansion".

## Checklist

- [ ] The topic passed all four questions, and the answer to #2 is written down in the calendar row.
- [ ] Family and pillar assigned; the silo page it hands the transaction to is named.
- [ ] Title and planned H2s checked against `services[].name`, `{service} ב{city}` and every H2 already
      in `content/guides/` (`grep -h 'level: 2' content/guides/*.ts | sort | uniq -d` once it exists).
- [ ] Planned FAQ questions checked against `lib/content.ts` `faqs` and every other guide.
- [ ] Not a second guide on a Tier-3 query the calendar already assigns.
- [ ] Owner facts it would like are listed as 🔶/❌ and the guide is written around them.
- [ ] If it answers a homepage FAQ in depth, the `moreAt` row above is updated.
- [ ] The calendar row exists before `/new-guide` runs.

## Gotchas

- Never rename a published slug without a 301 — `public/_redirects` after Phase 1 (ADR 0004), a
  generated stub before it (`node scripts/gen-redirects.mjs`).
- A guide that names a city uses `loc.prefixed` once Phase 3 adds it; until then no guide names
  קריות, שרון, צפון or דרום at all.
- `מחסום` is the buyer's word for שער זרוע (keyword-map §2 Tier 4) — it goes into the שער-זרוע
  service title (`/new-service`, Phase 3), not into a guide.
- `דלת מוסך פנלים` and `שער קונזולי` as _services_ are an 8th service, capped by CLAUDE.md §12; the
  comparison guide (#4) is the only page that may discuss קונזולי until then.
- The legacy `/blog/` stays where it is; a post moves to the hub only when rewritten to the bar, with
  a 301 (content-calendar §4) — and the blog moves are batched after Phase 1 so they are not 11 more
  meta-refresh stubs.
