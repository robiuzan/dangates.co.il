---
name: schema-structured-data
description: Emit the JSON-LD graph with the @ishub/site-kit/seo builders — GeneralContractor from the manifest, Service per service and location page, BreadcrumbList already emitted by PageHeader from its own crumbs, FAQPage matched to visible FAQs, BlogPosting/TechArticle on articles, the Phase-2 lib/jsonld.ts builders (articleJsonLd, itemListJsonLd, locationServiceJsonLd, websiteJsonLd) and one @graph per page, with Offer/Review/AggregateRating/Person author absent until sourced. Use when wiring or auditing structured data, or before a Rich Results Test. Triggers: "add schema", "JSON-LD", "BreadcrumbList", "structured data", "rich results", "סכמה", "@graph".
---

# Structured data

Target graph: `docs/schema-graph.md`. This skill is how to emit it. The measurement is
`node scripts/audit/schema.mjs` — run it before and after every change; its exit code is the failure
count and `schema-auditor` reads the same output.

## Where the site stands — measure, don't assume

```bash
node scripts/audit/schema.mjs            # type census per route, dangling @id, raw Hebrew URLs, forbidden keys, FAQ parity
node scripts/audit/schema.mjs --json     # exit code = failures
```

As of 2026-08-23 (`pagesWithJsonLd: 45`, `breadcrumbPages: 44`): **coverage is closed — every content
page emits JSON-LD and every nested route emits `BreadcrumbList`.** What remains is substance, and it
is all Phase 2 (backlog §4): all 18 location pages and 8 static pages carry **only** `BreadcrumbList`
(no `Service`/`areaServed`, no page-type node); `#business` is referenced on 7 services + 11 posts but
defined only on `/` (18 dangling `@id`s); no `WebSite` node; `Service.url` ×7 and
`BlogPosting.mainEntityOfPage` ×11 carry raw Hebrew (N2); no `image`/`logo`; the homepage is a JSON
array of two `@context` objects rather than one `@graph`; `FAQPage` on 1 page. Five failures, five
warnings — the numbers move, the script is the truth.

## The kit builders — and their limits

```ts
import {
  localBusinessJsonLd, serviceJsonLd, faqJsonLd, breadcrumbJsonLd, jsonLdScript,
} from "@ishub/site-kit/seo";

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(node) }} />
```

Never hand-assemble a node a builder covers; never hardcode a value the manifest carries. `@type` is
`GeneralContractor` from `manifest.schema.type` — read it, don't type it (an inherited `Product` node
once had to be removed; this business sells a service). Limits, from
`Israeli services sites/packages/site-kit/src/seo/index.ts`:

| Builder                        | Limit you must work around                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| all                            | each adds its own `@context`; `prune()` drops `null`/`undefined`/`""`/`[]` at the top level only, so pass `undefined` for "absent", never a placeholder string             |
| `localBusinessJsonLd(m, opts)` | `url: m.url` has no trailing slash (`schema.mjs` warns); `image`/`logo` only via `opts`; an `areaServed` override is typed `AdministrativeArea` for every entry            |
| `serviceJsonLd(m, svc)`        | `url` defaults to **raw Hebrew** `/services/${slug}/` — always pass an explicit encoded `url`; `areaServed` is always the manifest phrase, there is no per-location option |
| `breadcrumbJsonLd(m, crumbs)`  | takes `{ name, path }[]`, **not** `{ name, url }` and not PageHeader's `Crumb`; `abs()` does not encode — pass an already-encoded path                                     |
| `faqJsonLd(items)`             | no manifest; `{ q, a }` or `{ question, answer }`; marks up whatever you pass — visibility is on you                                                                       |
| `jsonLdScript(data)`           | escapes `<`; accepts a node or an array — an array is **not** a `@graph`                                                                                                   |

## Breadcrumbs — already done; never add a second one

`components/layout/PageHeader.tsx` emits `BreadcrumbList` from the **same `crumbs` array it renders**
(`PageHeader.tsx:57-59` maps `{ label, href }` → `{ name, path: schemaPath(href) }`; `schemaPath()` at
`:24-26` adds the trailing slash and `encodeURI`s). A page only passes crumbs:

```tsx
<PageHeader
  title={card.name}
  crumbs={[
    { label: "בית", href: "/" },
    { label: "השירותים שלנו", href: "/שירותים" },
    { label: card.name, href: `/services/${card.slug}/` },
  ]}
/>
```

No manual `<script>`, no `breadcrumbJsonLd` call in a page. Passing `{ name, url }` silently emits
`https://dangates.co.il/undefined`; a second call double-emits (`.claude/rules/schema-jsonld.md`).
The last crumb keeps its `href` — `BreadcrumbList` needs a resolvable `item` at every position.

## Per route type — target vs today

| Route                                 | Target (one `@graph`)                                                             | Today                                                |
| ------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `/`                                   | business + `WebSite` + `FAQPage`                                                  | array of two `@context` objects; no `WebSite`        |
| `/services/{slug}/` ×7                | business + `Service` (`#service`, encoded `url`) + breadcrumb (+ `FAQPage` later) | `Service` raw `url`; `#business` dangling; 2 scripts |
| `/locations/{slug}/` ×18              | business + `Service` with local `areaServed` + breadcrumb                         | breadcrumb only                                      |
| `/שירותים/` `/איזורי-שירות/` `/blog/` | `CollectionPage` + `ItemList` + breadcrumb                                        | breadcrumb only                                      |
| `/blog/{slug}/` ×11                   | business + `BlogPosting` (`#article`, `isPartOf`) + breadcrumb                    | raw `mainEntityOfPage`; dangling; 2 scripts          |
| `/מדריכים/{slug}/` (Phase 4)          | business + `TechArticle`/`Article` + `FAQPage` + breadcrumb                       | route family does not exist                          |
| `/אודות/` · `/צור-קשר/`               | `AboutPage` / `ContactPage` + breadcrumb — no `Person`                            | breadcrumb only                                      |
| `/מחירון/`                            | breadcrumb only — `OfferCatalog` is **blocked** (business-facts §D)               | breadcrumb only ✅                                   |
| 37 stubs · `/404`                     | nothing (`noindex`)                                                               | ✅                                                   |

## Phase 2 — `lib/jsonld.ts` (does not exist yet)

The recipe is `templates/jsonld.ts` in this skill — it typechecks against the repo today. It holds
`graph()`, `pageUrl()`, `businessNode(m)`, `websiteJsonLd(m)`, `serviceNode(m, svc)`,
`locationServiceJsonLd(m, svc, loc)`, `articleJsonLd(m, input)`, `itemListJsonLd(m, items, page)`,
`pageNode(m, type, page)`, `breadcrumbNode(m, crumbs)`. Rules the recipe encodes:

1. **One `<script>`, one `@graph` per page.** Site-local nodes carry no `@context`; `graph()` strips
   the kit's. Wiring that keeps the invariant mechanical: `PageHeader` gains `nodes?: JsonLd[]` and
   emits `graph(...nodes, breadcrumbNode(manifest, crumbs))` — pages hand it nodes and stop rendering
   their own script. `app/page.tsx` (no `PageHeader`) calls `graph()` directly. After the change,
   `grep -rl 'application/ld+json' app components` lists exactly `app/page.tsx` and
   `components/layout/PageHeader.tsx`. Never leave a page with both (schema-graph §7).
2. **Emit `businessNode(m)` on every page whose graph references `#business`** (`provider`,
   `publisher`, `about`). An `@id`-only stub does not count — `schema.mjs` treats a node with fewer
   than two data keys as a reference, so it still dangles.
3. **Every `url` / `@id` / `item` / `mainEntityOfPage` goes through `pageUrl()`** — trailing slash +
   `encodeURI` — byte-identical to the canonical and the sitemap `<loc>`. Pass raw Hebrew paths in;
   never pre-encode (double-encoding turns `%` into `%25`).
4. **`logo` = `/dangates-logo.png`, `image` = the manifest OG card** via `ogImageMeta(m.images)` —
   the same helper `app/layout.tsx:32` uses for `og:image`. No other image exists (business-facts §F).
5. `businessNode` also sets `url` with the trailing slash, `areaServed` as the 18 real places and
   `knowsAbout`. It does **not** set `hasOfferCatalog`: that needs `Offer` items and `schema.mjs`
   forbids the `Offer` type outright while prices are unsourced (backlog §4.10) — the script decides.

### Location pages

`locationServiceJsonLd(m, { name: "תיקון שערים חשמליים" }, loc)` → `Service` with `@id`
`{pageUrl}#service`, encoded `url`, `provider` → `#business`, `areaServed: placeNode(loc)`.
`placeNode` types קריות, שרון, צפון, דרום as `AdministrativeArea` and everything else as `City`;
typing a region as a city is a factual error in the graph. **`kind` and `prefixed` do not exist on
`locations` yet** — today an entry is `{ slug, name }` (`lib/site-config.ts:82-101`); the recipe
carries an interim `REGION_SLUGS` set and switches to `loc.kind` / `loc.prefixed` when Phase 3
(`/new-city`) adds them. **Never a `LocalBusiness` per city** — no premises exist, and 18 business
nodes is a recognised local-spam pattern. Coverage is `areaServed`, always.

### Articles

`app/blog/[slug]/page.tsx:79-94` builds `BlogPosting` inline today: raw `mainEntityOfPage` (`:87`),
`dateModified` pinned to `post.date` (`:85`), `publisher` → dangling `#business`, an `Organization`
`author`. `articleJsonLd(m, { type: "BlogPosting", path: `/blog/${post.slug}/`, headline, description,
datePublished: post.date, dateModified: post.updated ?? post.date })` fixes all four: encoded `@id`
`{url}#article`, `mainEntityOfPage` as a `WebPage` reference, `isPartOf` → `#website`, and **no
`author` key** — `prune()` drops it when `authorName` is absent, and it is absent because no person is
coming (business-facts §B). `schema.mjs` tolerates an `Organization` author and forbids a `Person`
while `lib/authors.ts` (Phase 6) is empty; either is fine, inventing one is not. Guides (Phase 4)
use `TechArticle` for the safety/component families, `Article` otherwise, plus a `FAQPage` derived
from the guide's own FAQ blocks so rule 2 below cannot drift.

## Absent until sourced — correctness, not preference

`schema.mjs` enforces each of these; `.claude/rules/schema-jsonld.md` repeats them at edit time.

1. **`Review` / `AggregateRating`** — only with a verifiable public source. History, not a live
   finding: the site shipped ten authored review texts under ten real names until 2026-08-17.
   `lib/content.ts:242` `reviews = []`, `:248` `REVIEW_SOURCE_URL = null`,
   `components/marketing/Reviews.tsx:41` returns `null` unless both are set. Restore path:
   business-facts §A, verbatim text only. **Do not remove or work around the guard.**
2. **Schema matches what the user sees.** A `FAQPage` question not rendered inside `<main>` is a
   violation; each Q/A string appears in exactly one `FAQPage` sitewide. The homepage qualifies because
   `Faq.tsx:47` ships answers in the DOM (`hidden={!isOpen}`, not conditional rendering — N8 moves this to
   `<details>` without changing it).
3. **`Offer` / `priceSpecification` / `offers`** — 8 of the 9 `priceRows` are authored estimates
   (comment above `lib/content.ts:157`) and real prices are **not coming** (business-facts §D).
4. **`address`** — a service-area business with no premises; absent is correct. The Rich Results Test
   will flag it; record the trade-off (backlog §4.11), never invent a `PostalAddress`.
5. **`foundingDate`** follows `foundedYear` (`null`, not coming) — the kit already omits it.
6. **`Person`** anywhere — author, founder, employee. None is coming.
7. **`sameAs`, `geo`** — from the roster manifest only (`Israeli services sites/roster/sites/dangates.json`),
   never typed into `site.config.json`; GBP is ⏳ (business-facts §A).

## Verify

```bash
node scripts/audit/schema.mjs                                              # must reach 0 failures in Phase 2
grep -rl 'BreadcrumbList' out --include=index.html | wc -l                 # 44 — every route but / and /404
grep -rl 'aggregateRating\|"@type":"Review"' out --include=index.html      # must print nothing
```

Rebuild before asserting — `run-all.mjs` refuses a stale `out/` (N12). Then Google's **Rich Results
Test** on one URL per route type: `/`, a service, a location, `/מחירון/`, a post. Zero errors is the
bar; the missing-`address` warning is the documented trade-off.

## Checklist

- [ ] One `<script>` / one `@graph` per page; `schema.mjs` shows no "split across ≥ 2 blocks" warning.
- [ ] `businessNode` present on every page that references `#business`; `danglingIds: 0`.
- [ ] `rawHebrewUrls: 0` — every URL value byte-matches the canonical.
- [ ] Location pages emit `Service` + local `areaServed` with the right `City` / `AdministrativeArea`.
- [ ] `WebSite` on `/`; `logo` + `image` on the business node.
- [ ] Every `FAQPage` question visible in `<main>`, marked up once sitewide.
- [ ] Nothing from the absent-until-sourced list appears in `out/`.
- [ ] Breadcrumbs come from `PageHeader` only — no page calls `breadcrumbJsonLd`.

## Gotchas

- `jsonLdScript([a, b])` is a JSON array, not a graph — that is exactly what `app/page.tsx:29` does
  today and why `schema.mjs` warns on `/`.
- `prune()` is shallow: an empty nested object (`publisher: {}`) survives and becomes a dangling
  reference. Build nested nodes complete or leave them out.
- `noUncheckedIndexedAccess` is on: `ogImageMeta(m.images)?.[0]?.url` — both optional chains are needed.
- The `triggers` list on service pages (`app/services/[service]/page.tsx:43-48`) is shared by all 7 —
  a per-service `FAQPage` must wait for per-service FAQs in `lib/content.ts` (Phase 3, `/new-service`),
  or seven pages mark up identical questions and fail the sitewide-once rule.
- Business facts in the graph come from the manifest chain (`/dangates-architecture`). If a value is
  not there, the node field stays absent and a row goes to `docs/business-facts.md`.
