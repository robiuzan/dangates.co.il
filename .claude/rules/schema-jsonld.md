---
paths:
  - "app/**/page.tsx"
  - "components/layout/PageHeader.tsx"
  - "lib/jsonld.ts"
---

# Structured-data rules for this file — `docs/schema-graph.md`, verified by `scripts/audit/schema.mjs`

- **`PageHeader` already emits `BreadcrumbList`** on every route that passes `crumbs`. Never add a
  second `breadcrumbJsonLd` call on a page. `crumbs` are `{ label, href }[]`; the kit builder takes
  `{ name, path }[]` and `PageHeader.tsx` does that mapping (`schemaPath()` adds the trailing slash
  and percent-encodes). Passing `{ name, url }` silently emits `https://dangates.co.il/undefined`.
- Builders come from `@ishub/site-kit/seo`: `localBusinessJsonLd`, `serviceJsonLd`, `faqJsonLd`,
  `breadcrumbJsonLd`, `jsonLdScript`. Render with
  `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(node) }} />`.
  Site-local extensions (`articleJsonLd`, `itemListJsonLd`, location `Service` with a local
  `areaServed`) belong in `lib/jsonld.ts`, never in the vendored kit.
- **URLs in schema must byte-match the canonical**: percent-encoded Hebrew, trailing slash. The
  kit's `serviceJsonLd` defaults `url` to raw Hebrew — pass an explicit encoded `url`.
- `@id` scheme: business `…/#business`, website `…/#website`. A page that references `#business`
  (`provider`, `publisher`) must also define it, or reference-only nodes dangle.
- One `<script>` per page holding one `@graph`, not an array of separate `@context` objects.
- Absent until sourced — never emit: `author` (while `lib/authors.ts` is empty), `aggregateRating` /
  `Review` (while `REVIEW_SOURCE_URL` is null), `Offer` / `priceSpecification` (prices are authored
  estimates), `address` (service-area business — correct as absent), `foundingDate` (`foundedYear`
  null). `FAQPage` only where the Q/A is visible on that page, and each Q/A string in exactly one
  `FAQPage` sitewide.

Procedure: `/schema-structured-data`. Audit: `schema-auditor`.
