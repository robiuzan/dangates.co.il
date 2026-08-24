---
name: new-guide
description: Build one Hebrew guide under /מדריכים/[slug]/ from a family template — symptom, component, brand, comparison, safety or committee — as a typed content/guides/<slug>.ts module: the required blocks per family in order, the answer block first, the captioned citable table each family must carry, CTA placement and cap, TechArticle/Article + FAQPage + BreadcrumbList schema, link targets into services, locations and sibling guides, registration in lib/guides.ts and the reverse index, then typecheck, build, the audit scripts and the article-auditor → hebrew-editor → claims-verifier chain. Use only after /content-hub has said the topic earns a page. Triggers: "new guide", "write a guide about", "symptom page", "component page", "comparison page", "brand page", "מדריך חדש", "עמוד תקלה", "/new-guide".
argument-hint: "symptom|component|brand|comparison|safety|committee <hebrew-slug>"
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# /new-guide <family> <slug>

One parameterized skill, not six. The family sets the required blocks and their order, the CTA
placement and cap, the schema type, the link targets and the one table that makes the page citable.
Whether the topic earns a page at all is `/content-hub`'s verdict — run it first and quote the
calendar row. Whether the result is publishable is `article-auditor`'s verdict — run it last.

## What exists today vs what Phase 4 builds

**Nothing below exists as of 2026-08-23.** The only editorial model is
`PostBlock = {type: "h" | "p" | "li"; text}` (`lib/posts.ts:9`). Phase 4 (`/improve` against ADR 0002
and ADR 0003) builds the hub; this skill describes the model it builds so the first guides and the
route family land together. If `lib/guide-types.ts` is absent when this skill is invoked, **stop at
step 2** and route to `/improve` — never park a guide in `lib/posts.ts` or invent a one-off route.

| Asset                                      | Built from                                                   | Does                                                               |
| ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `lib/guide-types.ts`                       | `templates/guide-types.ts` (this skill) — the authority      | `Guide`, `Block`, `Family`, `Pillar`, the per-family consts        |
| `lib/guides.ts`                            | galbath `lib/articles.ts`, retargeted                        | registry, `guidesForService/Location`, `relatedGuides`, the throws |
| `content/guides/<slug>.ts`                 | `templates/<family>.ts`                                      | one guide, `as const satisfies Guide`                              |
| `components/article/*`                     | galbath `components/article/*`                               | `ArticleBody` (block renderer), TOC, meta                          |
| `app/מדריכים/page.tsx`, `[slug]/`          | galbath `app/מדריכים/**`                                     | index (`ItemList`) + detail; Hebrew-param decode + NFC             |
| `lib/jsonld.ts` `articleJsonLd`            | schema-graph §8 (Phase 2 builds it first)                    | `TechArticle`/`Article` in one `@graph`                            |
| `scripts/audit/schema.mjs` `requiredTypes` | `schema.mjs:57-62` returns only `BreadcrumbList` for `guide` | Phase 4 extends it to the article type + `FAQPage`                 |

Already in place: `scripts/audit/lib/pages.mjs:138-139` classifies `/מדריכים/` as `guides-index` /
`guide`; `thresholds.json` carries `guide: 900` and `guides-index: 250`; `content-depth.mjs` measures
the answer block on `guide` pages.

## The family table

| Family       | Required blocks, in order                                                                                                                                                                | Citable table (caption required)                                        | CTA                                                         | Schema                                                            | Answer-block question                          | Link targets                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `symptom`    | answer · intro ¶ · h2 likely causes + **table** · h2 DIY checks (ordered list) · **warn callout** (stop here) · h2 when it is a technician job · cta · h2 typical fix and duration · faq | cause → DIY check → when to call → typical fix                          | 1 inline after "when to call", optional quote at end; cap 2 | `Article` + `FAQPage` + `BreadcrumbList`                          | `למה השער החשמלי {symptom}?`                   | the gate-type service(s) the symptom lives on · the component guide of the failing part · ≤ 1 city |
| `component`  | answer · intro ¶ · h2 what it does · h2 failure modes + **table** · h2 symptoms it produces · h2 replace or repair · cta · h2 what drives the price (no number) · faq                    | failure mode → symptom → replace-or-repair                              | 1 after replace-or-repair; cap 1                            | `TechArticle` + `FAQPage` + `BreadcrumbList`                      | `מה עושה {part} בשער חשמלי ומתי מחליפים אותו?` | `/מחירון/` · the service(s) · the symptom guide(s) it causes                                       |
| `comparison` | answer · intro ¶ · h2 the matrix + **table** · h2 per option (h3 each) · h2 which fits which entrance · cta · faq                                                                        | 3-axis matrix: option × (space/clearance · weight/width · cost drivers) | 1 quote after "which fits"; cap 1                           | `Article` + `FAQPage` + `BreadcrumbList`                          | `{A} או {B} — מה מתאים לכניסה שלכם?`           | the 2–3 services compared · `/מחירון/`                                                             |
| `safety`     | answer · intro ¶ · h2 what the standard requires + **table** · h2 who is liable · h2 the conformity checklist (ordered) · h2 periodic checks · cta · faq · `sources`                     | conformity checklist with an SII citation per row                       | 1 inline after the checklist; cap 1                         | `TechArticle` + `FAQPage` + `BreadcrumbList` + `citation`         | `מה דורש ת״י 900 חלק 21.03 משער חשמלי?`        | all 7 services (`relatedServices`) · `/אודות/`                                                     |
| `committee`  | answer · intro ¶ · h2 why approval is needed · h2 approval steps + **table** · h2 who pays · h2 what to put in the tender · cta · faq                                                    | step → who decides → threshold (law citation) → who pays                | 1 quote after "who pays"; cap 1                             | `Article` + `FAQPage` + `BreadcrumbList`                          | `מה ועד הבית צריך לאשר לפני התקנת מחסום?`      | שער-זרוע · שערים-לחניה · שערים-לדירה · `/צור-קשר/`                                                 |
| `brand`      | answer · intro ¶ · h2 what characterises the motors · h2 what fails first + **table** · h2 parts and repair economics · cta · faq — **🔶 blocked on business-facts §C**                  | model line → typical failure → symptom → repairable?                    | 1 inline; cap 1                                             | `Article` + `FAQPage` + `BreadcrumbList`, **no `brand` property** | `מה מאפיין מנועי {brand} ומה נכשל בהם?`        | the services the motor is fitted on · the symptom guide of its typical failure                     |

Word floor 900 unique (content-standards §1; `guide` in `thresholds.json`). Answer block 40–60 words
(§5). Sentences ≤ 25 words, an H2 at least every 200 words (§4). Every H2 in question form and unique
across the hub. Buyer vocabulary: עינית not חיישן, לוח פיקוד not לוח בקרה, מחסום alongside שער זרוע
(keyword-map §2 Tier 4).

## Procedure

1. **Verdict first.** `/content-hub`: the four-question test, the family, the silo it hands off to, the
   calendar row (`docs/content-calendar.md` §2–§3). No row, no guide.
2. **Model check.** `ls lib/guide-types.ts lib/guides.ts components/article app/מדריכים` — absent →
   route to `/improve` (Phase 4). Present → continue.
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
   facts (ת״י 900, חוק החשמל, בתים משותפים) cite sii.org.il / gov.il / nevo via `sources` — never a
   competitor. `scripts/audit/claims.json` is the lexicon the hook and `claims-grep.mjs` apply.
8. **Register in `lib/guides.ts`:** import, append to `guides`, place on `relatedGuides` — a total
   `Record`, so omitting it is a compile error. `generateStaticParams` and `app/sitemap.ts` read the
   registry (ADR 0002 requires the sitemap derive the hub — backlog §1.4). If a homepage FAQ gains a
   `moreAt`, add it to `faqs` in `lib/content.ts` now (content-hub contract).
9. **Verify** (below). 10. **Hand off:** `article-auditor` → `hebrew-editor` → `claims-verifier`; then
   flip the calendar row to review, and to published only after `npm run gate` passes on the build
   that contains it.

## Schema — derived, never authored twice

The route emits one `@graph`: `familySchemaType[family]` via `articleJsonLd` (`lib/jsonld.ts`,
schema-graph §6/§8) with `@id {pageUrl}#article`, `isPartOf → #website`, `publisher → #business`,
percent-encoded `mainEntityOfPage` (N2), `datePublished`/`dateModified` from the guide, `citation`
from `sources`; `FAQPage` derived from the guide's `faq` blocks; `BreadcrumbList` from `PageHeader`'s
`crumbs` (`{label, href}` — it maps to the kit's `{name, path}`; the last crumb carries an `href` so
the trail ends on this page; **never a second one**). `author` is the Organization — `lib/authors.ts`
ships empty and `schema.mjs` fails a page that emits `author` while it is. No `Offer`, no `Review`,
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
- [ ] All seven commands above clean; `article-auditor` says publishable; `hebrew-editor` and
      `claims-verifier` signed off.

## Gotchas

- **`openGraph` merges shallowly** — the route's `generateMetadata` must restate
  `images: ogImageMeta(manifest.images)` or every guide ships without an OG image.
- **Hebrew params arrive percent-encoded** in static export: `decodeURIComponent(param).normalize("NFC")`
  before matching, exactly as `app/services/[service]/page.tsx` does. Works in dev, 404s live otherwise.
- **Widen when iterating:** `guides` is a tuple of `as const` literals; search it as `readonly Guide[]`
  or TS reports every optional field missing.
- **No image block** until `/site-images` has a real file with width/height (business-facts §F).
- **Brand family:** no dealer, factory-training or manufacturer-warranty claim, ever — and no `brand`
  property in JSON-LD. It asserts an affiliation the business has not confirmed.
- **Safety family:** the October-2006 date and the licensed-electrician requirement are **unverified**
  (keyword-map §12). The ₪800,000 judgment, the criminal-offence framing and the fatality record are
  citable only with the SII URL in `sources` and beside the sentence.
- The `tool` block renders nothing — no component exists. Leave it out of the first guides.
