---
name: content-hub
description: The /מדריכים/ knowledge-hub doctrine for dangates — the five pillars (תקלות, רכיבים, בחירה, בטיחות ותקנים, ועד בית) and which query family belongs where, the four-question "does it earn a page" test, the anti-cannibalisation rules that are module-load throws in lib/guides.ts (the hub and guides #1–#4 are built since Sprint 7) against the 7 service pages, the 14 location pages and /מחירון/, the one-Q/A-per-FAQPage rule and the homepage-FAQ moreAt link-out contract, the reverse index that makes an orphaned guide impossible, the pricing pivot, and the two-guides-a-month cadence kept in docs/content-calendar.md. Use when deciding what to publish next, whether a topic earns a guide at all, or how the hub connects to the silos. Triggers: "what should we write next", "does this need a guide", "topic cluster", "cannibalisation", "content plan", "editorial calendar", "מה לכתוב עכשיו", "מדריך חדש", "האם זה מצדיק עמוד".
---

# The knowledge hub

`/new-guide <family> <slug>` is _how_ to build a guide. This is _what_ to build and why — without it,
guide #7 duplicates guide #3, or a symptom page competes with the service page that already ranks.

**State as of 2026-11-09: the hub is BUILT in the repo** (Sprint 7, commit `89439b7`; not live until
the next deploy). `app/מדריכים/` (index + `[slug]`), `lib/guide-types.ts` (the ADR 0003 block
model), `lib/guides.ts` (the registry, the reverse index and the module-load throws below) and
`content/guides/` with guides #1–#4: `תקן-900-שער-חשמלי`, `שער-חשמלי-רועש`, `מחסום-חניה-ועד-בית`,
`שער-נגרר-כנף-או-קונזולי`. `content-depth.mjs` → guide `belowFloor 0`, median 2395.5 unique / 900;
`links.mjs` → `orphans 0`. The 11 legacy posts still use the flat `PostBlock` model in
`lib/posts.ts`; moving them waits on owner-actions 3.8. `/keyword-research` feeds this skill; `/new-guide` consumes
its verdict; `article-auditor` gates what ships; `docs/content-calendar.md` is the queue.

## The governing idea

The 7 service pages own **"what we do, buy it."** The 14 location pages own **"we do it near you."**
Neither can own **"what is wrong, what should I choose, what does the law require"** — and that is
where the Tier-3/4 families in `docs/keyword-map.md` §2 and §8 live: symptom queries competitors
treat as first-class URLs, component queries with a page per part, the ועד בית audience the site
names and never served, and the ת״י 900 angle nobody in the market had assembled on one page (§12) —
guides #1 and #3 now carry the last two.

The hub's job: be the best Hebrew answer to that question, then hand the transaction to the silo
page that already ranks for the commercial term. A guide that sells is a worse service page; a
service page that explains is a worse guide.

## Five pillars

| Pillar        | `pillar`    | Family       | Owns (one topic per URL)                                                                                                                                           | Hands off to                                              |
| ------------- | ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| תקלות         | `faults`    | `symptom`    | לא נסגר · לא נפתח · לא מגיב לשלט · נתקע · רועש/חורק · הפסקת חשמל ושחרור חירום — DIY diagnosis first, then the safety gate (keyword-map §11.3)                      | the gate-type service page the symptom lives on, one city |
| רכיבים        | `parts`     | `component`  | מנוע · שלט + שכפול · עינית · לוח פיקוד · גלגלים/מסילה/פס שיניים · מפסק גבול · קבל הנעה · חיישן כביש · סוללת גיבוי — role, failure modes, replace-or-repair         | `/מחירון/` (what drives the price), the service           |
| בחירה         | `choice`    | `comparison` | קונזולי/נגרר/כנף · לתקן או להחליף · מינוע שער קיים · brands (BFT, Nice, Somfy, Beninca — 🔶, see below)                                                            | the two or three services being compared                  |
| בטיחות ותקנים | `safety`    | `safety`     | ת״י 900 חלק 21.03 — scope, official status, the building rule, what SII says and advises, the devices gates are usually built with (never as law), periodic checks | every service; `/אודות/` (`knowsAbout`, `eeat-build`)     |
| ועד בית       | `committee` | `committee`  | shared car parks, barrier decisions under the model bylaws (no statute sets a gate majority), which costs are voted on, B2B procurement                            | שער-זרוע · שערים-לחניה · שערים-לדירה · `/צור-קשר/`        |

`brand` is a family of the בחירה pillar and is **🔶 blocked**: a brand page is honest only for a brand
the business actually services (keyword-map §9 warning; business-facts §C "manufacturer training /
brands"). Until §C is answered, at most one overview guide that names no brand as "ours"
(content-calendar #16). Never claim dealer status, factory training or a manufacturer warranty.

**The safety pillar is the E-E-A-T anchor.** The facts were read on primary sources 2026-11-08/09 —
`docs/research/2026-11-08-standards-and-law.md`, which outranks keyword-map §12 (it predates the
reading). Verified: the standard's title and scope (two voltage ceilings, never one), its official
status (SII "מעמד: רשמי", which may be in whole or in part; the November 2011 edition) and the 2019
building rule (תקנה 8). SII's own statements stay SII's, each with the SII URL beside it: a
non-compliant installation "נחשבת כעבירה פלילית", the ₪800,000 award ("according to SII", no case
name), cover that "may" be lost; the deaths and injuries are news headlines SII quotes. **⛔ Refuted
or unverified, never stated:** "official since October 2006" (refuted — no first-declaration date at
all); photocells, a flashing light, force limitation, safety edges or a manual release as a
requirement of ת״י 900 or of the law (no primary list exists — describe them as common devices and
how they work); which licence grade a gate motor needs (חוק החשמל §6(א) — electrical work is
licensed — is verified, the grade is not). **The committee pillar:** no section of חוק המקרקעין sets
a majority for a gate or a parking barrier — never state or imply one (research §C). `claims-verifier`
checks every external fact against the source, never a competitor; statute wording read on
he.wikisource says so on the page (owner-actions 3.10).

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

These are **module-load throws in `lib/guides.ts`** since `89439b7` (ADR 0003), so `npm run build`
fails instead of shipping a competing page; `article-auditor` still reads the body under each H2 by
hand, which no throw can:

- **No guide `title` or H2 equals a service `name` or matches `{service} ב{city}`.** That phrase space
  belongs to pages that already rank for buying intent (`services`, `locations` in
  `lib/site-config.ts`; the `{service} ב{city}` set is 126 cells nobody builds — keyword-map §6).
- **One Q/A string in exactly one `FAQPage` sitewide.** A guide FAQ or answer-block question may not
  repeat a homepage `faqs` question (`lib/content.ts`), a service or city FAQ (`serviceDepth`,
  `cityContent`) or another guide's — the registry throws on each. `node scripts/audit/schema.mjs`
  checks the parity on the export (backlog §4.13).
- **No guide title or target query is a price query** (`כמה עולה` → `/מחירון/`) — a throw too.
- **No two guides target the same Tier-3 query.** One symptom per URL: `לא נסגר` (#5), `לא נפתח`
  (#10) and `הפסקת חשמל` (#11) are three guides, not one with three H2s — and the legacy post
  `שער-חשמלי-לא-מגיב` splits into #6 and #11 (content-calendar §4).
- **Every H2 is unique across the hub**, and the body under a similar heading is written from that
  guide's angle. The doorway test (content-standards §2) applies inside the hub.

Deliberately **not** forbidden: prose overlap. A 1,200-word guide and a 40-word homepage accordion
answer are not competing; pretending they are produces thin guides that dodge their own topic.

## The homepage-FAQ contract

Do **not** shrink the homepage FAQ. It was the only `FAQPage` on the site until Sprint 5 (the
`graph(` call in `app/page.tsx`; `faqPages 26` since `7ed1acd` — `/`, the 7 services, the 14
locations and the 4 guides; 30 with 18 locations after `89439b7`) and it makes the homepage convert. Each question with a deep owner gains `moreAt: { href, label }` on its
`faqs` entry; `Faq.tsx` renders it inside the answer panel **outside the `a` string**, so
`faqJsonLd([...faqs])` still receives clean text. `lib/guides.ts` throws if a `moreAt` href names a
slug that is not registered. The homepage passes more equity than any other page — this turns the
biggest cannibalisation worry into the hub's strongest internal-link source.

Since `af8ba4c` (2026-11-08, Sprint 4.3) seven entries carry a `moreAt` (`data-cta="faq-more"`,
`links.mjs` → `brokenLinks 0`); each is retargeted to its guide when the guide ships. As of
2026-11-09 one points at a guide (#4); #3 has shipped but its row still points at the interim page.

| Homepage FAQ (`faqs` in `lib/content.ts`) | `moreAt` today (`af8ba4c`)           | Guide owner later                                                                | Status                      |
| ----------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- | --------------------------- |
| כמה זמן לוקח לתקן שער חשמלי?              | `/blog/תקלות-נפוצות-בשערים-חשמליים/` | the תקלות overview guide (fold of `תקלות-נפוצות…`, cal. §4)                      | ✅ interim · Ph 4           |
| האם יש אחריות על התיקון?                  | —                                    | stays home — no term is coming (business-facts §D)                               | no link-out                 |
| מה כוללת תחזוקה שוטפת לשער?               | `/blog/תחזוקה-מונעת-לשערים-חשמליים/` | the same post once migrated to the block model                                   | ✅                          |
| איך לבחור שער חשמלי חדש?                  | `/מדריכים/שער-נגרר-כנף-או-קונזולי/`  | #4 gate-type comparison (retargeted Sprint 7, 2026-11-09)                        | ✅ guide                    |
| מה העלות של ביקור טכנאי לבדיקה?           | `/מחירון/`                           | stays `/מחירון/` (N14 pivot, "what determines the price")                        | ✅                          |
| האם אתם עובדים עם לקוחות פרטיים ועסקיים?  | `/services/שערים-לדירה/`             | #3 ועד בית (shipped `89439b7`)                                                   | ✅ interim · retarget OPEN  |
| מה כוללת התקנה של שער חדש?                | —                                    | #1 ת״י 900 (what SII advises asking the installer for — never a compliance list) | ⏳ guide shipped, not wired |
| איך ניתן ליצור קשר?                       | `/צור-קשר/`                          | stays `/צור-קשר/`                                                                | ✅                          |
| האם אתם מציעים שירותי חירום?              | `/blog/שער-חשמלי-לא-מגיב/`           | #11 הפסקת חשמל ושחרור חירום                                                      | ✅ interim · Ph 4+          |
| כמה זמן לוקחת התקנה?                      | —                                    | #4, only if its matrix carries an install-duration axis — check before wiring    | ⏳ not wired                |

The `moreAt` wiring never edits the `a` strings. The thin 4–7-word answers were deepened in
`af8ba4c` (backlog §3.5 ✅) and "אחריות מלאה" was softened to "אחריות על העבודה" in `1796ee7`
(§7.2 ✅) — both separate changes from the link-outs, as this contract requires.

## Wiring — why an orphan is impossible

Each guide declares `relatedServices` (validated against `services` at module load; at least one).
`guidesForService()` in `lib/guides.ts` is the reverse index, and the service and location routes
render a `מדריכים בנושא` block from it — so a guide that declares a service **appears on that
service's page automatically**. `relatedGuides` is a total `Record<GuideSlug, …>`, so adding a guide
without placing it on the adjacency map is a compile error. The hub index emits the full list as
`ItemList` in the same order it renders. `guidesForLocation()` is the second index; a guide declares
a location only when it genuinely names that city in copy (a throw checks both ways — a declared
city must be linked in copy, a linked city must be declared), using `loc.prefixed` (built in Sprint 6) — never `בשרון`/`בצפון` (content-standards §8).

Target: every guide reachable from **≥ 2 non-hub pages** plus the index. `node scripts/audit/links.mjs`
reports `orphans 0` on 51 pages and `notInChrome 0` as of 2026-11-09; measured inside `<main>`, all 7
service pages link 1–3 guides and `/locations/ירושלים/` links one. The three-axis mesh city × gate
type × symptom is `/internal-linking`'s.

## The pricing pivot

`/מחירון/` published 9 ranges until `af8ba4c` (N14, 2026-11-08); only the 150–350 ₪ visit fee was
sourced, and it is now the one number the page shows (`priceRows` → `visitFeeRange`, 🔶 as to
whether it is current; business-facts §D). Real prices are **not coming**. So the hub never carries
a price: component and comparison guides explain _what determines the price_ — fault type, gate
weight and width, motor class, whether the existing motor is reusable, cabling run, whether the
visit fee is credited — and link to `/מחירון/`, which has carried that framing since N14
(keyword-map §10). `כמה עולה…` queries route
there, never to a guide. Prices, where quoted at all, interpolate `visitFeeRange`.

## Cadence and the calendar

- **Two guides a month** now that Sprint 7 shipped #1–#4 (ת״י 900 · רועש · ועד בית · gate-type
  comparison — `89439b7`, 2026-11-09; live after the deploy, with their dates set to the deploy day
  first — `deploy-dangates`).
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
      in `content/guides/` (the registry throws on a repeated H2; `grep -h 'level: 2' content/guides/*.ts`
      lists them while planning).
- [ ] Planned FAQ questions checked against `lib/content.ts` `faqs` and every other guide.
- [ ] Not a second guide on a Tier-3 query the calendar already assigns.
- [ ] Owner facts it would like are listed as 🔶/❌ and the guide is written around them.
- [ ] If it answers a homepage FAQ in depth, the `moreAt` row above is updated.
- [ ] The calendar row exists before `/new-guide` runs.

## Gotchas

- Never rename a published slug without a 301 — a `REDIRECTS.md` row, generated into
  `public/_redirects` by `node scripts/gen-redirects.mjs` (ADR 0004).
- A guide that names a city uses `loc.prefixed` (on every `locations` entry since Sprint 6,
  `7c3f2db`) — never a bare `ב` + name. Owner-actions 3.6 is answered (2026-11-09): a
  guide never says קריות, צפון, דרום or באר שבע are served (they are not; their pages are retired),
  and names a place as served only if it is one of the 14 published locations.
- `מחסום` is the buyer's word for שער זרוע (keyword-map §2 Tier 4) — it goes into the שער-זרוע
  service title (`/new-service`, Phase 3), not into a guide.
- `דלת מוסך פנלים` and `שער קונזולי` as _services_ are an 8th service, capped by CLAUDE.md §12; the
  comparison guide (#4) is the only page that may discuss קונזולי until then.
- The legacy `/blog/` stays where it is; a post moves to the hub only when rewritten to the bar, with
  a 301 (content-calendar §4) — one `_redirects` line each since ADR 0004. The rewrite and the moves
  are ⏳ BLOCKED · owner 3.8 (Sprint 7.3, 7.4), and the live registers quote post sentences
  (CLAUDE.md §14).
