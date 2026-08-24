# Schema graph — target JSON-LD

What every route should emit. `schema-auditor` validates against this file with
`node scripts/audit/schema.mjs`; `schema-structured-data` implements it. Builders come from
`@ishub/site-kit/seo`: `localBusinessJsonLd` · `serviceJsonLd` · `faqJsonLd` · `breadcrumbJsonLd` ·
`jsonLdScript`. Everything the kit does not cover is built in **`lib/jsonld.ts`** — planned, Phase 2
(§8 below); it does not exist yet.

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
`encodeURI` for the same reason; `PageHeader.schemaPath()` does it for breadcrumbs. `schema.mjs`
fails on any non-ASCII URL value. (The `#person-{n}` scheme is retired — no person is coming,
business-facts §B.)

---

## 2. Node per route type

**Coverage as of 2026-08-23** (`schema.mjs` → `pagesWithJsonLd: 45`, `breadcrumbPages: 44`):
**45 of 45 content pages emit JSON-LD; 44 emit `BreadcrumbList`.** Coverage is closed — what remains
is substance.

| Route                    | Required                                                               | Currently                                                                                           |
| ------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `/`                      | one `@graph`: `GeneralContractor` + `WebSite` + `FAQPage`              | business + FAQPage as an **array of two `@context` objects**; no `WebSite` ❌                       |
| `/services/{slug}/` ×7   | `Service` + `BreadcrumbList` (+ `FAQPage` once per-service FAQs exist) | `Service` ✅ + breadcrumb ✅ in two blocks; `url` raw Hebrew ❌; `provider` `#business` dangling ❌ |
| `/locations/{slug}/` ×18 | `Service` with local `areaServed` + `BreadcrumbList`                   | **only** `BreadcrumbList` ❌                                                                        |
| `/שירותים/`              | `CollectionPage` + `BreadcrumbList`                                    | only `BreadcrumbList`                                                                               |
| `/איזורי-שירות/`         | `CollectionPage` + `BreadcrumbList`                                    | only `BreadcrumbList`                                                                               |
| `/blog/`                 | `CollectionPage` (or `Blog`) + `BreadcrumbList`                        | only `BreadcrumbList`                                                                               |
| `/blog/{slug}/` ×11      | `BlogPosting` + `BreadcrumbList` (+ `FAQPage`)                         | both ✅ in two blocks; `mainEntityOfPage` raw Hebrew ❌; `publisher` `#business` dangling ❌        |
| `/מדריכים/{slug}/`       | `TechArticle`/`Article` + `FAQPage` + `BreadcrumbList`                 | route family does not exist yet (Phase 4, ADR 0002)                                                 |
| `/מחירון/`               | `BreadcrumbList` only — `OfferCatalog` is **blocked** (§4.4)           | only `BreadcrumbList` ✅ (correct while prices are unsourced)                                       |
| `/אודות/`                | `AboutPage` + `BreadcrumbList` (no `Person` — none is coming)          | only `BreadcrumbList`                                                                               |
| `/צור-קשר/`              | `ContactPage` + `BreadcrumbList`                                       | only `BreadcrumbList`                                                                               |
| Legal pages              | `BreadcrumbList`                                                       | ✅                                                                                                  |
| `/404`                   | none                                                                   | —                                                                                                   |
| Redirect stubs ×37       | none — they are `noindex`                                              | correct ✅ (and gone once `_redirects` lands, ADR 0004)                                             |

**The real gaps, in order** (each is a `schema.mjs` failure or warning):

1. 18 location pages and 8 static pages carry **only** `BreadcrumbList` — no `Service`/`areaServed`,
   no page-type node (backlog §4.2).
2. `#business` is referenced on 7 services + 11 posts but **defined only on the homepage** — 18
   dangling `@id`s (backlog §4.4).
3. No `WebSite` node anywhere (backlog §4.9).
4. Raw Hebrew in `Service.url` ×7 and `BlogPosting.mainEntityOfPage` ×11 (backlog §4.7, N2).
5. No `image` / `logo` on the business node (backlog §4.5).
6. The homepage emits a JSON **array**, not one `@graph`; services and posts split across two
   `<script>` blocks (backlog §4.6).
7. `areaServed` is the marketing phrase `מרכז הארץ ופריסה ארצית` typed as `AdministrativeArea` on 8
   nodes (backlog §4.8); the business `url` lacks the trailing slash (backlog §4.12).

---

## 3. The business node

Built by `localBusinessJsonLd(manifest, opts)` from the roster manifest. Never hand-assemble it, and
never hardcode a value the manifest already carries.

`@type` is **`GeneralContractor`** from `manifest.schema.type`. The rebuild had to correct an inherited
`Product` node — do not reintroduce one. This business sells a service, not a product.

**Present and correct today:** `@type`, `name`, `alternateName`, `description`, `url`, `telephone`,
`email`, `priceRange`, `areaServed`, two `OpeningHoursSpecification` entries, `knowsLanguage: "he"`.

**Deliberately absent — do not "fix":** `address` / `PostalAddress`. This is a **service-area business
with no premises**. Model coverage with `areaServed` (and optionally `serviceArea` + `GeoCircle`).
Inventing an address is a Google Business Profile suspension risk, not a completeness improvement.

**Missing — unblocked (Phase 2):** `logo` = `public/dangates-logo.png`, `image` = the manifest OG
card, `hasOfferCatalog` listing the 7 services by `@id` (no prices), `knowsAbout` (ת״י 900 חלק 21.03,
the gate types), `sameAs` from the manifest **only** (empty today).

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
   > reviewers, with `sameAs` empty. `lib/content.ts:242` now exports `reviews = []`, `:248`
   > `REVIEW_SOURCE_URL = null`, and `components/marketing/Reviews.tsx:41` returns `null` unless both
   > are populated. `schema.mjs` fails if either type appears while the gate is null. Restore path:
   > business-facts §A, verbatim text from the GBP only. **Do not remove or work around the guard.**

2. **Schema must match what the user sees.** A `FAQPage` question that isn't rendered on the page is a
   violation. `Offer` prices must equal the visible `priceRows`. Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible.** The homepage qualifies today because the answers ship in
   the DOM (`components/marketing/Faq.tsx:43-51` uses `hidden`, not conditional rendering — N8 moves it
   to `<details>` without changing this). Service pages qualify only once they render their own FAQs.
   One Q/A pair per `FAQPage` sitewide (`content-hub`).
4. **Don't promote an authored estimate into `Offer`.** The comment at `lib/content.ts:152-156`
   records that the per-gate price ranges are estimates; only the 150–350 ₪ visit fee is sourced, and
   real prices are **not coming**. `OfferCatalog` on `/מחירון/` is **blocked on business-facts §D**,
   not merely unimplemented.
5. **No dangling `@id`s.** If `provider` or `publisher` points at `#business`, that node must exist on
   that page. Today it doesn't on 18 pages — Phase 2 emits the business node wherever it is referenced.
6. **One node per concept per page, one `<script>` per page.** Merge into a single `@graph`.
7. **`foundingDate` follows `foundedYear`.** If the manifest is `null`, the field is absent — it is
   never guessed from copy.
8. **`author` is the `Organization` until `lib/authors.ts` holds a real person.** `schema.mjs` forbids
   a `Person` author while that registry is empty (it does not exist yet — Phase 6).

---

## 5. Location-page schema

The 18 location pages are the largest substance gap by page count. Each should emit, in one `@graph`:

- **`Service`** — `name: "תיקון שערים חשמליים {prefixed}"`,
  `serviceType: "תיקון שערים חשמליים"`, `provider: { "@id": ".../#business" }` (with the business
  node present on the page), `url` percent-escaped, `areaServed: { "@type": "City", name }`.
- **`BreadcrumbList`** — `בית › אזורי שירות › {city}` — already emitted by `PageHeader`.
- **`FAQPage`** once city-specific FAQs exist (content-standards §3).

Use `City` for real cities and `AdministrativeArea` for the four region entries (קריות, שרון, צפון,
דרום). Marking a region as a `City` is a factual error in the graph. **Neither `kind` nor `prefixed`
exists on `locations` yet** — today an entry is `{ slug, name }` only; Phase 3 (`new-city`) adds them,
so the location `Service` builder lands in Phase 2 with `City` for all 18 and switches on `kind` when
it arrives.

The kit's `serviceJsonLd` has no per-location `areaServed` and defaults `url` to raw Hebrew — which is
why `locationServiceJsonLd` lives in `lib/jsonld.ts` (§8), not in the kit.

**Do not** emit a business node per location. This business has **no premises at all**; a
`LocalBusiness` per city implies 18 that don't exist and is a well-known local-spam pattern. Coverage is
`areaServed`, always.

---

## 6. Blog-post and guide schema

`app/blog/[slug]/page.tsx` emits `BlogPosting` inline (not via the kit) with `headline`,
`description`, `datePublished`, `inLanguage`, `mainEntityOfPage` and `publisher` → `#business`.
Corrections, all Phase 2 unless noted:

| Issue                                                         | Fix                                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `mainEntityOfPage` raw Hebrew (`app/blog/[slug]/page.tsx:87`) | `encodeURI` — N2                                                          |
| `dateModified` hardcoded to `post.date` (`:85`)               | Use `post.updated ?? post.date`, as `app/sitemap.ts` already does         |
| `publisher` → `#business` dangling                            | Emit the business node on the page, in the same `@graph`                  |
| `author` is the `Organization`                                | Stays so — no person is coming (business-facts §B). **Never invent one.** |
| No `@id` / `isPartOf`                                         | `{pageUrl}#article`, `isPartOf: { "@id": ".../#website" }`                |
| Two `<script>` blocks (post + `PageHeader` breadcrumb)        | One `@graph` via `articleJsonLd` (§8)                                     |

Guides under `/מדריכים/` (Phase 4) use the same `articleJsonLd` with `TechArticle` for the safety /
component families and `Article` otherwise, plus `FAQPage` derived from the guide's FAQ blocks.
Deriving it from the blocks rather than authoring it separately is what keeps rule §4.2 from breaking
as copy is edited.

---

## 7. How `PageHeader` emits the breadcrumb — and why the shape matters

`components/layout/PageHeader.tsx` receives `crumbs: { label, href }[]` and renders the visible trail.
The kit's `breadcrumbJsonLd(manifest, crumbs)` takes **`{ name, path }`** — not `{ name, url }` and not
the `Crumb` type. `PageHeader.tsx:57-59` maps explicitly:

```ts
breadcrumbJsonLd(
  manifest,
  crumbs.map((c) => ({ name: c.label, path: schemaPath(c.href) })),
);
```

`schemaPath()` (`PageHeader.tsx:24-25`) appends the trailing slash and `encodeURI`s, so the `item`
URLs byte-match the canonical. Passing `{ name, url }` emits `https://dangates.co.il/undefined`;
passing `Crumb[]` unmapped throws at build time. **Never add a second `BreadcrumbList` to a page** —
every nested route already has one (`.claude/rules/schema-jsonld.md`). When Phase 2 merges pages
into one `@graph`, the breadcrumb node moves into the graph and `PageHeader` stops emitting its own
script — in the same change, never leaving both.

---

## 8. `lib/jsonld.ts` — planned builders (Phase 2)

Thin wrappers over the kit, each returning a node for the page's `@graph`. Not built yet; the
`schema-structured-data` skill carries the recipes.

| Builder                        | Emits                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `businessNode(manifest)`       | `localBusinessJsonLd` + `logo`, `image`, `hasOfferCatalog`, `knowsAbout`, trailing-slash `url` |
| `webSiteNode(manifest)`        | `WebSite` `#website`, `name`, `inLanguage: "he"`, `publisher → #business`                      |
| `locationServiceJsonLd(loc)`   | §5 — `Service` with explicit percent-encoded `url` and a local `City`/`AdministrativeArea`     |
| `articleJsonLd(post \| guide)` | §6 — `BlogPosting`/`TechArticle`/`Article` with `@id`, `isPartOf`, encoded `mainEntityOfPage`  |
| `itemListJsonLd(items)`        | `CollectionPage` + `ItemList` for `/שירותים/`, `/איזורי-שירות/`, `/blog/`, `/מדריכים/`         |
| `pageNode(type)`               | `AboutPage` / `ContactPage` wrappers                                                           |
| `graph(...nodes)`              | One `{ "@context", "@graph": [...] }` per page, through `jsonLdScript`                         |

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
