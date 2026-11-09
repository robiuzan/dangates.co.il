# Schema graph — target JSON-LD

What every route should emit. `schema-auditor` validates against this file with
`node scripts/audit/schema.mjs`; `schema-structured-data` implements it. Builders come from
`@ishub/site-kit/seo`: `localBusinessJsonLd` · `serviceJsonLd` · `faqJsonLd` · `breadcrumbJsonLd` ·
`jsonLdScript`. Everything the kit does not cover is built in **`lib/jsonld.ts`** (§8 below) — built in Sprint 2
(`02a3144`, 2026-11-08); until then it was planned.

---

## 1. `@id` scheme

Stable `@id`s let nodes reference each other instead of repeating themselves.

| Node                | `@id`                                             |
| ------------------- | ------------------------------------------------- |
| The business        | `https://dangates.co.il/#business`                |
| The website         | `https://dangates.co.il/#website`                 |
| The organization    | `https://dangates.co.il/#organization`            |
| A service           | `https://dangates.co.il/services/{slug}/#service` |
| A guide / article   | `{pageUrl}#article`                               |
| A page's breadcrumb | `{pageUrl}#breadcrumb`                            |

`@id` and every `url` / `item` / `mainEntityOfPage` value use the **percent-escaped** URL with the
trailing slash, matching the canonical and the sitemap `<loc>` byte for byte. `app/sitemap.ts` uses
`encodeURI` for the same reason; `schemaPath()` / `pageUrl()` in `lib/jsonld.ts` do it for every schema URL. `schema.mjs`
fails on any non-ASCII URL value. (The `#person-{n}` scheme is retired — no person is coming,
business-facts §B.)

---

## 2. Node per route type

**Coverage and substance as of 2026-11-08** (`schema.mjs` → 0 failures, 0 warnings ·
`pagesWithJsonLd 45` · `danglingIds 0` · `rawHebrewUrls 0`; `links.mjs` → `breadcrumbPages 44`):
every content page emits **one** `<script>` holding **one** `@graph`, and every page that points
at `#business` defines it. Sprint 2 closed this table (commits `02a3144` `d8edb28`, not deployed
yet); until then 18 locations and 8 statics carried only the breadcrumb.

| Route                    | Required                                                           | Currently (2026-11-09)                                                                                                                                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                      | one `@graph`: `GeneralContractor` + `WebSite` + `FAQPage`          | ✅ one `@graph`: business + `WebSite` `#website` + `FAQPage`                                                                                                                                                                                                                                                                                             |
| `/services/{slug}/` ×7   | `Service` + `BreadcrumbList` + `FAQPage` from the per-service FAQs | ✅ business + `Service` (encoded `url`, `@id` `#service`, `provider` → `#business`) + `FAQPage` (4–5 Q/As, since `225ff45`, §4.13) + breadcrumb                                                                                                                                                                                                          |
| `/locations/{slug}/` ×14 | `Service` with local `areaServed` + `BreadcrumbList` + `FAQPage`   | ✅ business + `Service` with `areaServed` `City` / `AdministrativeArea` from `kind` (§5) + `FAQPage` (3 Q/As, since `7c3f2db`) + breadcrumb                                                                                                                                                                                                              |
| `/שירותים/`              | `CollectionPage` + `BreadcrumbList`                                | ✅ `CollectionPage` + `ItemList` (7) + breadcrumb                                                                                                                                                                                                                                                                                                        |
| `/איזורי-שירות/`         | `CollectionPage` + `BreadcrumbList`                                | ✅ `CollectionPage` + `ItemList` (14 since `7ed1acd`; 18 before) + breadcrumb                                                                                                                                                                                                                                                                            |
| `/blog/`                 | `CollectionPage` (or `Blog`) + `BreadcrumbList`                    | ✅ `CollectionPage` + `ItemList` (11) + breadcrumb                                                                                                                                                                                                                                                                                                       |
| `/blog/{slug}/` ×11      | `BlogPosting` + `BreadcrumbList` (+ `FAQPage`)                     | ✅ business + `BlogPosting` (§6) + breadcrumb, one `@graph`; no FAQ                                                                                                                                                                                                                                                                                      |
| `/מדריכים/{slug}/`       | `TechArticle`/`Article` + `FAQPage` + `BreadcrumbList`             | ✅ since `89439b7` (2026-11-09, not deployed): business + `TechArticle` (safety) or `Article` (symptom, committee, comparison) with `author` → `#business` and `citation` from `sources`, + `FAQPage` + `BreadcrumbList`, one `@graph`; the hub `/מדריכים/` is `CollectionPage` + `ItemList`. `schema.mjs` still requires only the breadcrumb on a guide |
| `/מחירון/`               | `WebPage` + `BreadcrumbList` — `Offer` is **blocked** (§4.4)       | ✅ `WebPage` + breadcrumb, no `Offer` (correct while prices are unsourced)                                                                                                                                                                                                                                                                               |
| `/אודות/`                | `AboutPage` + `BreadcrumbList` (no `Person` — none is coming)      | ✅ business (with `knowsAbout`) + `AboutPage` (`about` → `#business`) + breadcrumb                                                                                                                                                                                                                                                                       |
| `/צור-קשר/`              | `ContactPage` + `BreadcrumbList`                                   | ✅ business + `ContactPage` (`mainEntity` → `#business`) + breadcrumb                                                                                                                                                                                                                                                                                    |
| Legal pages              | `WebPage` + `BreadcrumbList`                                       | ✅ `WebPage` + breadcrumb                                                                                                                                                                                                                                                                                                                                |
| `/תודה/`                 | none — it is `noindex` and outside the sitemap                     | ✅ none (since `68a4a7f`)                                                                                                                                                                                                                                                                                                                                |
| `/404`                   | none                                                               | ✅ none                                                                                                                                                                                                                                                                                                                                                  |

**What is left** — none of it is a `schema.mjs` failure:

1. `FAQPage` on 26 of 46 pages since `7ed1acd` (`/`, the 7 services, the 14 locations and the 4
   guides, 103 questions, none marked up twice — backlog §4.13 ✅; `schema.mjs` → `faqPages 26`,
   2026-11-09; 30 with the 18 locations after Sprint 7).
2. `sameAs` is empty until the GBP exists (§5.1, Track B B3); `hasMap` follows it.
3. The Rich Results Test on one route per type runs after the next deploy (§9 below).
4. ~~The `Service` + `areaServed` node on the five 🔶 entries~~ — resolved 2026-11-09 on the
   owner's 3.6 answer: קריות, צפון, דרום and באר שבע are not served and their pages (and nodes)
   were retired in `7ed1acd`; שרון is served and keeps its `AdministrativeArea` node.

---

## 3. The business node

Built by `localBusinessJsonLd(manifest, opts)` from the roster manifest. Never hand-assemble it, and
never hardcode a value the manifest already carries.

`@type` is **`GeneralContractor`** from `manifest.schema.type`. The rebuild had to correct an inherited
`Product` node — do not reintroduce one. This business sells a service, not a product.

Built by `businessNode()` in `lib/jsonld.ts`, which wraps the kit builder and is emitted on **every page
that references `#business`** (§4 rule 5).

**Present and correct (2026-11-08):** `@type`, `name`, `alternateName`, `description` (the tagline —
the roster pitch carries unconfirmed claims), `url` with the trailing slash, `telephone`, `email`,
`priceRange`, two `OpeningHoursSpecification` entries, `knowsLanguage`, `logo`
(`public/dangates-logo.png`), `image` (the manifest OG card), `areaServed` as the 14 published
locations (`City` ×13, `AdministrativeArea` ×1 since `7ed1acd`; 18 before — never the roster phrase,
which carried "פריסה ארצית" until the roster sync `8e8843d`, 2026-11-09), and `hasOfferCatalog` — an `OfferCatalog` of the 7 services as `Service`
nodes by `@id`, no `Offer`, no price. On `/אודות/` only it also carries `knowsAbout` (the 7 services +
תיקון שערים חשמליים, מנועי שערים, בטיחות שערים חשמליים, and since `89439b7` ת״י 900 חלק 21.03 — a
subject the safety guide covers, never a compliance claim).

**Deliberately absent — do not "fix":** `address` / `PostalAddress`. This is a **service-area business
with no premises**. Model coverage with `areaServed` (and optionally `serviceArea` + `GeoCircle`).
Inventing an address is a Google Business Profile suspension risk, not a completeness improvement.

**Closed in the repo:** `knowsAbout` names ת״י 900 חלק 21.03 since the guide that covers it shipped
(Sprint 7.2, `89439b7`, 2026-11-09) — the list names only what the site already covers. **Still
open:** `sameAs` comes from the manifest **only** (empty today).

**Missing, and each blocked on a specific fact:**

| Field                             | Blocked on                                                                                           |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `foundingDate`                    | `foundedYear` is `null` and is **not coming** — the field stays absent; soften the copy instead (§B) |
| `sameAs`                          | GBP URL — **coming**, business-facts §A ⏳                                                           |
| `geo` (`GeoCoordinates`)          | business-facts §E — and for a service-area business, a `GeoCircle` centre rather than a premises pin |
| `aggregateRating`                 | **Only with a verifiable public source** — business-facts §A; the gate is in code (§4.1)             |
| `founder` / `employee` (`Person`) | No person is named and none is coming — business-facts §B. Absent, not invented.                     |

---

## 4. Gating rules

These are correctness rules, not preferences. Getting them wrong is worse than emitting nothing.
`schema.mjs` enforces 1, 2 (FAQ parity), 4 and 5.

1. **`Review` and `AggregateRating` ship only when the reviews are real and publicly verifiable.**

   > ✅ **Resolved 2026-08-17 — history, not a live finding.** The site shipped `AggregateRating`
   > 5.0/10 and ten `Review` nodes whose text was authored and attributed to ten real named
   > reviewers, with `sameAs` empty. `lib/content.ts` now exports `reviews = []` and
   > `REVIEW_SOURCE_URL = null`, and `components/marketing/Reviews.tsx` returns `null` unless both
   > are populated. `schema.mjs` fails if either type appears while the gate is null. Restore path:
   > business-facts §A, verbatim text from the GBP only. **Do not remove or work around the guard.**

2. **Schema must match what the user sees.** A `FAQPage` question that isn't rendered on the page is a
   violation. An `Offer` price, if one is ever sourced, must equal the visible `priceRows` value.
   Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible.** The homepage qualifies today because the answers ship in
   the DOM (the `Faq` component is native `<details>`, answers always in the DOM — N8). Service pages qualify only once they render their own FAQs.
   One Q/A pair per `FAQPage` sitewide (`content-hub`).
4. **Don't promote an authored estimate into `Offer`.** The per-gate ranges were authored estimates
   and left `/מחירון/` with N14 (`af8ba4c`); `priceRows` keeps only the 150–350 ₪ visit fee (🔶 as to
   whether it is current), and real prices are **not coming**. `OfferCatalog` on `/מחירון/` is **blocked on business-facts §D**,
   not merely unimplemented.
5. **No dangling `@id`s.** If `provider` or `publisher` points at `#business`, that node must exist on
   that page. Since `02a3144` (2026-11-08) it does on every page that references it — `danglingIds 0`.
   `#website` lives on `/` only, so nothing else may point at it.
6. **One node per concept per page, one `<script>` per page.** Merge into a single `@graph` — `graph()`
   in `lib/jsonld.ts`; 45 of 45 content pages comply since `02a3144`.
7. **`foundingDate` follows `foundedYear`.** If the manifest is `null`, the field is absent — it is
   never guessed from copy.
8. **`author` is the `Organization` until `lib/authors.ts` holds a real person.** `schema.mjs` forbids
   a `Person` author while that registry is empty (it exists, empty, since `d8edb28` — 2026-11-08).

---

## 5. Location-page schema

The 14 location pages (18 until `7ed1acd`) are the largest substance gap by page count. Each should emit, in one `@graph`:

- **`Service`** — `name: "תיקון שערים חשמליים {prefixed}"`,
  `serviceType: "תיקון שערים חשמליים"`, `provider: { "@id": ".../#business" }` (with the business
  node present on the page), `url` percent-escaped, `areaServed: { "@type": "City", name }`.
- **`BreadcrumbList`** — `בית › אזורי שירות › {city}` — already emitted by `PageHeader`.
- **`FAQPage`** from the city's `cityContent.faqs` — the same `{ q, a }` the page renders
  (content-standards §3; since `7c3f2db`, 3 per page).

Use `City` for real cities and `AdministrativeArea` for a region entry — שרון, the one left since
`7ed1acd` retired קריות, צפון and דרום (owner-actions 3.6). Marking a region as a `City` is a factual error in the graph. Since Sprint 6 (`7c3f2db`,
2026-11-09) every `locations` entry carries `kind` and `prefixed`, and `placeNode()` in
`lib/jsonld.ts` types the place from `kind` — the interim region-slug set is deleted. The regions
shipped as `AdministrativeArea` since `d8edb28` either way.

**Built 2026-11-08** (`d8edb28`): `locationServiceJsonLd()` emits the `Service` with `name` = the
page's H1 (until Sprint 6 the bare `ב{name}` form, so `/locations/שרון/` shipped `…בשרון`; since
`7c3f2db` it reads `prefixed` — `…באזור השרון`, backlog §5.2 ✅), `serviceType`, the encoded `url` and
`@id` `#service`, `provider` → `#business`.

The kit's `serviceJsonLd` has no per-location `areaServed` and defaults `url` to raw Hebrew — which is
why `locationServiceJsonLd` lives in `lib/jsonld.ts` (§8), not in the kit.

**Do not** emit a business node per location. This business has **no premises at all**; a
`LocalBusiness` per city implies 18 that don't exist and is a well-known local-spam pattern. Coverage is
`areaServed`, always.

---

## 6. Blog-post and guide schema

`app/blog/[slug]/page.tsx` emits `BlogPosting` through `articleJsonLd()` in one `@graph` with the
business node and the breadcrumb. Since `02a3144` (2026-11-08) it carries `headline`, `description`,
`@id` `{pageUrl}#article`, `url` and `mainEntityOfPage` percent-encoded with the slash,
`datePublished`, `dateModified` from `post.updated ?? post.date` (8 of 11 posts carry `updated`
since `9195c9b`, 2026-11-09; on the other three the two are equal), `isPartOf` a full `Blog` node for `/blog/`, `image` (the OG card), `inLanguage`, and
`author` and `publisher` → `#business`.

| Was (until 2026-11-08)                            | Now                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `mainEntityOfPage` raw Hebrew                     | `pageUrl()` — N2 ✅                                                          |
| `dateModified` hardcoded to `post.date`           | `post.updated ?? post.date`, as `app/sitemap.ts` does                        |
| `publisher` → `#business` dangling                | the business node in the same `@graph`                                       |
| No `@id` / `isPartOf`                             | `#article`; `isPartOf` → the `Blog` node (not `#website`, which is `/`-only) |
| Two `<script>` blocks (post + `PageHeader` crumb) | One `@graph`                                                                 |

`author` stays the `Organization` — no person is coming (business-facts §B). **Never invent one.**

Guides under `/מדריכים/` (built in Sprint 7, `89439b7`) use the same `articleJsonLd` with `type: "TechArticle"` for the
safety / component families and `Article` otherwise, plus `FAQPage` derived from the guide's FAQ
blocks. Deriving it from the blocks rather than authoring it separately is what keeps rule §4.2 from
breaking as copy is edited.

---

## 7. How `PageHeader` emits the breadcrumb — and why the shape matters

`components/layout/PageHeader.tsx` receives `crumbs: { label, href }[]` and renders the visible trail.
The kit's `breadcrumbJsonLd(manifest, crumbs)` takes **`{ name, path }`** — not `{ name, url }` and not
the `Crumb` type. The mapping lives in one place, `breadcrumbNode()` in `lib/jsonld.ts`:

```ts
breadcrumbJsonLd(
  m,
  crumbs.map((c) => ({ name: c.label, path: schemaPath(c.href) })),
);
```

`schemaPath()` appends the trailing slash and `encodeURI`s, so the `item` URLs byte-match the
canonical. Passing `{ name, url }` emits `https://dangates.co.il/undefined`; passing `Crumb[]`
unmapped throws at build time. Since `02a3144` a page hands `PageHeader` its own `nodes`, and
`PageHeader` renders the page's **one** script: `graph(...nodes, breadcrumbNode(crumbs))`. **Never add
a second `BreadcrumbList` to a page** (`.claude/rules/schema-jsonld.md`), and never render a second
`application/ld+json` script beside `PageHeader`.

---

## 8. `lib/jsonld.ts` — the builders (built 2026-11-08)

Thin wrappers over the kit, each returning a node for the page's `@graph`. Built in Sprint 2
(`02a3144`, extended in `d8edb28`); the `schema-structured-data` skill carries the recipes.

| Builder                              | Emits                                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `businessNode(m, { knowsAbout? })`   | `localBusinessJsonLd` + `logo`, `image`, `areaServed` (14 places), `hasOfferCatalog`, trailing-slash `url` (§3) |
| `websiteJsonLd(m)`                   | `WebSite` `#website`, `name`, `inLanguage`, `publisher → #business` — homepage only                             |
| `serviceNode(m, svc)`                | the kit's `Service` with an explicit encoded `url`, `@id` `#service`, `provider → #business`                    |
| `locationServiceJsonLd(m, svc, loc)` | §5 — `Service` with an encoded `url` and a local `City`/`AdministrativeArea` via `placeNode()`                  |
| `articleJsonLd(m, a)`                | §6 — `BlogPosting`/`TechArticle`/`Article` with `@id`, `isPartOf`, encoded `mainEntityOfPage`                   |
| `itemListJsonLd(m, items, page)`     | `CollectionPage` + `ItemList` for `/שירותים/`, `/איזורי-שירות/`, `/blog/` (and `/מדריכים/` later)               |
| `pageNode(m, type, page)`            | `AboutPage` / `ContactPage` / `WebPage`, optionally joined to `#business` by `about` or `mainEntity`            |
| `breadcrumbNode(m, crumbs)`          | §7 — called by `PageHeader` only                                                                                |
| `graph(...nodes)`                    | One `{ "@context", "@graph": [...] }` per page, through `jsonLdScript`                                          |

---

## 9. Verification

```bash
node scripts/audit/schema.mjs            # type census vs §2, dangling @id, raw URLs, forbidden keys, FAQ parity
node scripts/audit/schema.mjs --json     # machine-readable; exit code = failures
```

Two raw greps that stay useful as human sanity checks on `out/`:

```bash
grep -rl 'BreadcrumbList' out --include=index.html | wc -l            # target 44
grep -rl 'aggregateRating\|"@type": *"Review"' out --include=index.html   # must print nothing
```

Then run Google's **Rich Results Test** on one URL per route type: home, a service page, a location
page, the pricing page, and a blog post. Zero errors is the bar (the missing `address` warning on
the business node is the documented trade-off, §3); warnings get triaged against this file.
