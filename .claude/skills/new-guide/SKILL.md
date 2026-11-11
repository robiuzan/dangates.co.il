---
name: new-guide
description: Build one Hebrew guide under /מדריכים/[slug]/ from a family template — symptom, component, brand, comparison, safety or committee — as a typed content/guides/<slug>.ts module: the required blocks per family in order, the answer block first, the captioned citable table each family must carry, CTA placement and cap, TechArticle/Article + FAQPage + BreadcrumbList schema, link targets into services, locations and sibling guides, registration in lib/guides.ts (built in Sprint 7 with its module-load throws; five guides built in the repo) and the reverse index, the deploy-day dates, then typecheck, build, the audit scripts and the article-auditor → hebrew-editor → claims-verifier chain. Use only after /content-hub has said the topic earns a page. Triggers: "new guide", "write a guide about", "symptom page", "component page", "comparison page", "brand page", "מדריך חדש", "עמוד תקלה", "/new-guide".
argument-hint: "symptom|component|brand|comparison|safety|committee <hebrew-slug>"
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# /new-guide <family> <slug>

One parameterized skill, not six. The family sets the required blocks and their order, the CTA
placement and cap, the schema type, the link targets and the one table that makes the page citable.
Whether the topic earns a page at all is `/content-hub`'s verdict — run it first and quote the
calendar row. Whether the result is publishable is `article-auditor`'s verdict — run it last.

## What is built (Sprint 7, `89439b7`, 2026-11-09)

**The hub is BUILT in the repo** (not deployed until the next deploy). Sprint 7 built the model from
this skill's templates (ADR 0002, ADR 0003) and shipped the first four guides with it:
`תקן-900-שער-חשמלי` (`safety`), `שער-חשמלי-רועש` (`symptom`), `מחסום-חניה-ועד-בית` (`committee`) and
`שער-נגרר-כנף-או-קונזולי` (`comparison`); `שער-חשמלי-לא-נסגר` (`symptom`) followed in `c457c31`, so
there are five as of 2026-11-10. A new guide is one module plus one registry line — never a
guide parked in `lib/posts.ts` (the 11 legacy posts still use the flat `PostBlock` model) and never a
one-off route.

| Asset                                         | State                                                                                      | Does                                                                                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/guide-types.ts`                          | ✅ built from `templates/guide-types.ts` (this skill — still the authority for new fields) | `Guide`, `Block`, `Family`, `Pillar`, `familyPillar`, `schemaTypeFor`, `familyCtaCap`, `headingId`                                                                   |
| `lib/guides.ts`                               | ✅ built (galbath `lib/articles.ts`, retargeted)                                           | the `guides` tuple, `guideList`, `findGuide()`, the total `relatedGuides` record, `guidesForService()` / `guidesForLocation()`, `guidesByPillar()`, the throws below |
| `content/guides/<slug>.ts`                    | ✅ five guides                                                                             | one guide, `export const guide = {…} as const satisfies Guide`                                                                                                       |
| `components/article/*`                        | ✅ `ArticleBody`, `GuideView`, `blocks`, `chrome`                                          | block renderer, TOC, meta, CTAs (`data-cta` `article-{inline,aside,quote}-{call,whatsapp}`)                                                                          |
| `app/מדריכים/page.tsx`, `[slug]/`             | ✅ index (`CollectionPage` + `ItemList`, copy in `content/pages/guides-index.ts`) + detail | Hebrew-param decode + NFC via `findGuide()`                                                                                                                          |
| `lib/jsonld.ts` `articleJsonLd`               | ✅ takes `type` and `citation`                                                             | `TechArticle` / `Article` in the page's one `@graph`, `author` → `#business`                                                                                         |
| `app/sitemap.ts`, `lib/llms.ts`, `lib/nav.ts` | ✅ read `guideList`                                                                        | the sitemap rows (`lastModified` = `dateModified`), the `llms.txt` Guides section, the header and footer entry (shown while `hasGuides`)                             |
| `scripts/audit/schema.mjs` `requiredTypes`    | **not extended** — still requires only `BreadcrumbList` on a `guide` page                  | the article type + `FAQPage` are not script-required yet; check the type census by hand (`TechArticle` 1 · `Article` 3 · `FAQPage` 4 as of 2026-11-09)               |

Also in place: `scripts/audit/lib/pages.mjs` `routeType()` classifies `/מדריכים/` as `guides-index`
/ `guide`; `thresholds.json` carries `guide: 900` and `guides-index: 250`; `content-depth.mjs`
measures the answer block on `guide` pages. As of 2026-11-11 the five guides measure 2984 unique words
(median, `content-depth.mjs` → `byType.guide.medianUnique`; the four of Sprint 7 measured 2470.5 at
`2b0d802`, 2026-11-09, and 2395.5 before each gained a TOC in `98e38f0`) and open with answers of
56–58 words.

## The family table

| Family       | Required blocks, in order                                                                                                                                                                                                                                                                            | Citable table (caption required)                                                                                                                      | CTA                                                         | Schema                                                            | Answer-block question                             | Link targets                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `symptom`    | answer · intro ¶ · h2 likely causes + **table** · h2 DIY checks (ordered list) · **warn callout** (stop here) · h2 when it is a technician job · cta · h2 typical fix and duration · faq                                                                                                             | cause → DIY check → when to call → typical fix                                                                                                        | 1 inline after "when to call", optional quote at end; cap 2 | `Article` + `FAQPage` + `BreadcrumbList`                          | `למה השער החשמלי {symptom}?`                      | the gate-type service(s) the symptom lives on · the component guide of the failing part · ≤ 1 city |
| `component`  | answer · intro ¶ · h2 what it does · h2 failure modes + **table** · h2 symptoms it produces · h2 replace or repair · cta · h2 what drives the price (no number) · faq                                                                                                                                | failure mode → symptom → replace-or-repair                                                                                                            | 1 after replace-or-repair; cap 1                            | `TechArticle` + `FAQPage` + `BreadcrumbList`                      | `מה עושה {part} בשער חשמלי ומתי מחליפים אותו?`    | `/מחירון/` · the service(s) · the symptom guide(s) it causes                                       |
| `comparison` | answer · intro ¶ · h2 the matrix + **table** · h2 per option (h3 each) · h2 which fits which entrance · cta · faq                                                                                                                                                                                    | 3-axis matrix: option × (space/clearance · weight/width · cost drivers)                                                                               | 1 quote after "which fits"; cap 1                           | `Article` + `FAQPage` + `BreadcrumbList`                          | `{A} או {B} — מה מתאים לכניסה שלכם?`              | the 2–3 services compared · `/מחירון/`                                                             |
| `safety`     | answer · intro ¶ · h2 what the standard is and covers · h2 its official status · h2 the building rule · h2 what SII says and advises · h2 the safety devices gates are usually built with · h2 what to check on an existing gate + **table** · cta · h2 who may work on the supply · faq · `sources` | device → what it does → how to check it safely → when to stop using the gate — captioned as common construction, **not** a list of legal requirements | 1 inline after the check order; cap 1                       | `TechArticle` + `FAQPage` + `BreadcrumbList` + `citation`         | `מה זה ת״י 900 חלק 21.03, ועל אילו שערים הוא חל?` | the services (`relatedServices`) · `/אודות/`                                                       |
| `committee`  | answer · intro ¶ · h2 why it is a building decision · h2 what the model bylaws say, and what they do not · h2 the decision steps + **table** · h2 which costs are voted on · h2 what the quote must show · cta · faq                                                                                 | step → who is involved → what to check → source (statute section or SII URL) — never a "majority required" column                                     | 1 quote after the costs; cap 1                              | `Article` + `FAQPage` + `BreadcrumbList`                          | `מה ועד הבית צריך לבדוק לפני התקנת מחסום בחניה?`  | שער-זרוע · שערים-לחניה · שערים-לדירה · `/צור-קשר/`                                                 |
| `brand`      | answer · intro ¶ · h2 what characterises the motors · h2 what fails first + **table** · h2 parts and repair economics · cta · faq — **🔶 blocked on business-facts §C**                                                                                                                              | model line → typical failure → symptom → repairable?                                                                                                  | 1 inline; cap 1                                             | `Article` + `FAQPage` + `BreadcrumbList`, **no `brand` property** | `מה מאפיין מנועי {brand} ומה נכשל בהם?`           | the services the motor is fitted on · the symptom guide of its typical failure                     |

Word floor 900 unique (content-standards §1; `guide` in `thresholds.json`). Answer block 40–60 words
(§5). Sentences ≤ 25 words, an H2 at least every 200 words (§4). Every H2 in question form and unique
across the hub. Buyer vocabulary: עינית not חיישן, לוח פיקוד not לוח בקרה, מחסום alongside שער זרוע
(keyword-map §2 Tier 4).

## Procedure

1. **Verdict first.** `/content-hub`: the four-question test, the family, the silo it hands off to, the
   calendar row (`docs/content-calendar.md` §2–§3). No row, no guide.
2. **Model check.** `ls lib/guide-types.ts lib/guides.ts components/article app/מדריכים` — all four
   exist since `89439b7`. If one is missing, the tree is broken: stop and route to `/improve`.
3. **Create `content/guides/<slug>.ts` from `templates/<family>.ts`.** Replace every `TODO`; keep the
   block order; keep the comments that cite content-standards §3/§5 until the draft is final. Slug is
   the Hebrew query, hyphenated, NFC; `title` is the question verbatim, **bare** — the layout appends
   the brand.
4. **Answer block first** — within the first two blocks, the whole answer in the first sentence,
   self-contained, no pronoun pointing outside it (§5). Reuse the §5 "good" example for #5.
5. **Write the table** before the prose. If the family's table cannot be filled truthfully, the topic
   failed question 4 — go back to step 1.
6. **In-copy links** on `paragraph.links`: ≥ 2, ≥ 1 to a service, anchors lifted **verbatim** from the
   paragraph's own `text`, descriptive Hebrew. A location link only if `relatedLocations` names it.
7. **Every claim free or written around.** The dangates 🔶 list: the 150–350 ₪ visit fee is the only
   sourced price and is itself 🔶 current; no per-job price; "אחריות על העבודה", never "מלאה"; no
   licence, insurance, founding year or named person; 24/7 and "פריסה ארצית" are bounded. External
   facts (ת״י 900, חוק החשמל, בתים משותפים) cite sii.org.il / gov.il / the statute text via
   `sources`, read there first and recorded in `docs/research/2026-11-08-standards-and-law.md` —
   never a competitor. Statute wording read on he.wikisource says so beside the quote (whether that
   source is enough is owner-actions 3.10). `scripts/audit/claims.json` is the lexicon the hook and
   `claims-grep.mjs` apply.
8. **Register in `lib/guides.ts`:** import, append to `guides`, place on `relatedGuides` — a total
   `Record`, so omitting it is a compile error. `generateStaticParams`, `app/sitemap.ts`, `lib/llms.ts` (the
   `llms.txt` Guides section) and the nav read the registry, so there is nothing else to wire (ADR
   0002 requires the sitemap derive the hub — backlog §1.4). If a homepage FAQ gains a
   `moreAt`, add it to `faqs` in `lib/content.ts` now (content-hub contract).
9. **Verify** (below). 10. **Hand off:** `article-auditor` → `hebrew-editor` → `claims-verifier`; then
   flip the calendar row to review, and to published only after `npm run gate` passes on the build
   that contains it. 11. **Dates at deploy:** `datePublished` / `dateModified` written while drafting
   are placeholders — before the first deploy that carries the guide, both are set to the real deploy
   day in the deploy commit, never backdated (`deploy-dangates`, "Before you deploy").

## Schema — derived, never authored twice

The route emits one `@graph`: `familySchemaType[family]` via `articleJsonLd` (`lib/jsonld.ts`,
schema-graph §6/§8) with `@id {pageUrl}#article`, `isPartOf → #website`, `publisher → #business`,
percent-encoded `mainEntityOfPage` (N2), `datePublished`/`dateModified` from the guide, `citation`
from `sources`; `FAQPage` derived from the guide's `faq` blocks; `BreadcrumbList` from `PageHeader`'s
`crumbs` (`{label, href}` — it maps to the kit's `{name, path}`; the last crumb carries an `href` so
the trail ends on this page; **never a second one**). `author` is the business (`{ "@id": …#business }`) — `lib/authors.ts`
ships empty and `schema.mjs` fails a page that emits a `Person` author while it is. No `Offer`, no `Review`,
no `brand` property.

## Verification

```bash
npm run typecheck                          # the registry throws list below; the total Record
npm run build                              # /מדריכים/<slug>/ in out/ and out/sitemap.xml
node scripts/audit/content-depth.mjs       # guide ≥ 900 unique; answer block 40–60; shared blocks
node scripts/audit/schema.mjs              # article type + FAQPage + BreadcrumbList; FAQ parity; no raw Hebrew URL
node scripts/audit/links.mjs               # orphans 0; one H1; heading order; breadcrumb on the page
node scripts/audit/claims-grep.mjs         # 🔶/⛔ phrases live in out/ = stop-ship
node scripts/audit/spam-grep.mjs           # emoji, curly quotes, fused words in content/**
node scripts/audit/perf.mjs                # outBytes under thresholds.json perf.maxOutBytes (15 MB)
```

`lib/guides.ts` throws at module load on: under 900 words · zero or several `answer` blocks, or one
outside the first two positions · an answer outside 30–80 words (§5 targets 40–60) · an `h3` before any
`h2` · no `table` · a `faq` under 3 items · a FAQ question used by the homepage or another guide · more
CTAs than `familyCtaCap`, or two `quote`s · an `InlineLink.anchor` absent from its paragraph · an
`href` that resolves nowhere · fewer than 2 in-copy links or none to a service · a title or H2 equal to
a service `name` or `{service} ב{city}` · `family`/`pillar` mismatch · `safety` without `sources` · an
unknown slug in any related array · a `moreAt` with no matching guide. Rebuild before asserting (N12).

## Checklist

- [ ] Calendar row exists; family and pillar match `familyPillar`.
- [ ] `as const satisfies Guide`; no `TODO` or 🔶 left in a string that ships.
- [ ] Answer block in the first two blocks, 40–60 words, complete in its first sentence.
- [ ] The family's table, captioned, with real rows — the thing a reader would screenshot.
- [ ] Question-form H2s, none repeated across `content/guides/`; no h4; one H1 (from `title`).
- [ ] ≥ 2 `links` with verbatim anchors, ≥ 1 to a service; `relatedServices` non-empty and honest.
- [ ] CTA count ≤ cap, placed after an unresolved-variable block, `service` set for the prefill.
- [ ] FAQ ≥ 3, every question unique sitewide; no price, warranty term, licence, person or rating.
- [ ] `sources` on a safety guide; every external fact has its URL beside it.
- [ ] Registered; on `relatedGuides`; `moreAt` wired if a homepage FAQ is answered in depth.
- [ ] All eight commands above clean; `article-auditor` says publishable; `hebrew-editor` and
      `claims-verifier` signed off.

## Gotchas

- **The export has almost no room left — check the size before you draft.** Every copy byte ships
  about four times in `out/`: in the page HTML, in the RSC payload inlined in it, in the page's
  `index.txt`, and — for FAQ text — in the `FAQPage` JSON-LD. As of 2026-11-10 the export is
  12.90 MB (`perf.mjs` → `outBytes` 12898445) against `maxOutBytes` 15000000, the owner's limit
  (raised from 13 MB on 2026-11-11 by the owner's word; 12 MB before 2026-11-10), so about 2.1 MB is left. No byte cut
  is needed before the next guide; never raise the cap yourself (`docs/content-calendar.md` §5).
- **`openGraph` merges shallowly** — the route's `generateMetadata` must restate
  `images: ogImageMeta(manifest.images)` or every guide ships without an OG image.
- **Hebrew params arrive percent-encoded** in static export: `decodeURIComponent(param).normalize("NFC")`
  before matching, exactly as `app/services/[service]/page.tsx` does. Works in dev, 404s live otherwise.
- **Widen when iterating:** `guides` is a tuple of `as const` literals; search it as `readonly Guide[]`
  or TS reports every optional field missing.
- **Figures (N37, `page-imagery`):** one `{ kind: "figure", slot: "mid" }` block after the first
  `table` block — a reuse of a service detail or work frame; the `lead` renders under the answer block
  through `afterAnswer` without a block. Both are AI renderings under the site note: the caption claims
  nothing, names nobody and no city. The legacy `image` kind is unused (it rendered through
  `next/image`) and is replaced by `figure` in N37's kit commit.
- **Brand family:** no dealer, factory-training or manufacturer-warranty claim, ever — and no `brand`
  property in JSON-LD. It asserts an affiliation the business has not confirmed.
- **Safety family — verified 2026-11-08/09** (`docs/research/2026-11-08-standards-and-law.md`; it
  outranks keyword-map §12, which predates it): the "official since October 2006" date is
  **refuted** — never state a first-declaration date; the official status is verified (SII "מעמד:
  רשמי", which may be in whole or in part; the November 2011 edition) — state the cancellation of
  the 2006 edition only as the SII page gives it. **No primary list of required devices exists** (the
  requirements are in the paid standard text): photocells (עיניות), a flashing light, force
  limitation, safety edges or a manual release are described as devices gates are commonly built
  with and how they work — never as a requirement of ת״י 900 or of Israeli law. Never state a single
  voltage ceiling (the scope names two). חוק החשמל §6(א) — electrical work on the supply is licensed
  work — is verified; **which licence grade** a gate motor needs is unverified: never state it. SII's
  statements stay SII's: the criminal-offence statement, the ₪800,000 award ("according to SII", no
  case name), the insurance cover that "may" be lost; the deaths and injuries are news headlines SII
  quotes, never verified findings. Each needs the SII URL in `sources` and beside the sentence.
- **Committee family — verified 2026-11-09** (same file, §C): **no section of חוק המקרקעין sets a
  majority for the general assembly's own decision to install a gate or a parking barrier for the
  building — never state or imply one.** §59ג is a separate accessibility route (an owner's
  adjustment at their own cost; part ב׳ of the second schedule, which includes a yard-entrance gate,
  needs "הסכמת רוב בעלי הדירות"): name it only as that route (narrowed 2026-11-09, `8768ce2`). Quote the model bylaws
  (§5(א), §12(א) "ברוב דעות", §13(ב)), say the building's registered bylaws may differ, state the §8(א)
  quorum only with its notice condition and §8(ב), never cut §12(ב) before "מסוג או שיעור שלא פורשו",
  and leave whether a cost binds an objecting owner to a lawyer or the מפקח על רישום מקרקעין. The
  statute text was read on he.wikisource, not Reshumot — the copy says so.
- The `tool` block renders nothing — no component exists. Leave it out of the first guides.
