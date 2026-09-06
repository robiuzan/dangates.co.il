---
name: seo-metadata
description: Per-route metadata for dangates — the Hebrew title and description formulas, the layout title template that appends the brand once (the doubled-suffix defect is fixed; the rule that keeps it fixed), self-referencing percent-escaped trailing-slash canonicals, og:url and the OG block, Search Console verification, and deriving sitemap.ts from the data arrays and the future guides registry instead of a hand-maintained list. Use when writing generateMetadata for a route, fixing duplicate or over-long titles, or auditing on-page SEO. Triggers: "set the metadata", "titles and descriptions", "canonical", "double brand suffix", "og:url", "sitemap", "one H1", "כותרות", "מטא".
---

# Per-route SEO metadata

Formulas live in `docs/keyword-map.md` §3–§5. This skill is the mechanics.

## Proof — measure first

```bash
node scripts/audit/titles.mjs          # title/brand/length, description, canonical, og:url
node scripts/audit/links.mjs           # one H1, heading order, sitemap parity, breadcrumbs
npm run audit -- --scope seo           # both, plus content-depth.mjs
```

As of 2026-09-06 `titles.mjs` **passes**: 45 pages, 45 unique titles, 45 unique descriptions, brand
once on every page, `ogUrlMissing 0` (§1.5 closed by `13a6bdc`). Its remaining output is 24
warnings, none of them failures: **7 blog titles render at 63–72 chars** (§2.5); service
descriptions run **163–229 chars** on 5 of 7, three of them 190–229 (§2.4); **2 blog descriptions
end mid-sentence** with no terminal punctuation (§2.6); 10 more descriptions sit outside the 120–160
band, the two legal pages worst at 40 and 57 (§2.4); 18 location descriptions are one interpolated
token apart (§2.3). Re-run the script before quoting any of these.

## The template rule

`app/layout.tsx` sets:

```ts
title: {
  default: `${siteConfig.name} – תיקון והתקנת שערים חשמליים`,
  template: `%s | ${siteConfig.name}`,
}
```

The template **already appends the brand**, so a page writes the bare subject:

```ts
// ✅ renders "שערים נגררים | דן שערים חשמליים"
title: card.name;

// ❌ renders the brand twice — this shipped on 25 pages until 2026-08-17
title: `${card.name} | ${siteConfig.name}`;
```

Fixed everywhere: `app/services/[service]/page.tsx:38` is `title: card.name`,
`app/locations/[city]/page.tsx:30` is the bare `תיקון שערים חשמליים ב${loc.name}`, `/אודות/` is
`title: "אודות"`. `titles.mjs` fails on a second brand token, so the regression cannot ship through
`npm run gate`. If a page ever needs the brand suppressed, use `title: { absolute: "…" }` — never a
second brand token to "work around" the template.

## Titles

| Route    | What you write                                                                        |
| -------- | ------------------------------------------------------------------------------------- |
| Service  | `שערים נגררים` (optionally + `–` + one true differentiator)                           |
| Location | `תיקון שערים חשמליים ב${loc.name}` — `${loc.prefixed}` once Phase 3 adds it           |
| Static   | the page name — `מחירון תיקון שערים חשמליים`, `אזורי שירות`, `אודות`                  |
| Article  | the question, **trimmed to fit** — the H1 keeps the full question, the title need not |
| Guide    | the question form from the family template (`/new-guide`, Phase 4)                    |

Keep the **rendered** title (subject + ` | דן שערים חשמליים`, 19 chars) under ~60. The 7 blog
titles over budget are `Post.title` used verbatim; the fix is a separate `seoTitle` (or a shortened
`title` with the H1 kept in the body), not a longer template.

**Hebrew grammar:** `locations` in `lib/site-config.ts` is `{ slug, name }` only, so `ב${name}`
produces `בשרון`/`בצפון` for the four region entries where the correct Hebrew is `באזור השרון` /
`בצפון הארץ` (§5.2, content-standards §8). The `prefixed` field that fixes it is built in Phase 3
(`/new-city`); until then do not hand-patch a title string.

## Descriptions

120–160 chars (`thresholds.json`), unique per route, ending in terminal punctuation, following
keyword-map §5: service + place, one **true** differentiator, then an action with the phone.
Service descriptions today are `card.description` — the page's opening paragraph verbatim — which is
why they overrun; write a dedicated meta string in `lib/content.ts` (`serviceMeta`) instead.
Locations need a per-city string from the Phase 3 `cityContent` map, not a template.

Only claim what `docs/business-facts.md` marks ✅. The warranty term, licence, insurance, years in
business and 24/7 are 🔶 or ❌ — `claims-grep.mjs` fails the build on the lexicon. `אחריות מלאה`
and `זמינות 24/7` appear in every location description today (§7.2) — soften when rewriting.

## Canonicals

Every route sets its own. There is no inheritance — the root `alternates.canonical: "/"` is the
homepage's own canonical, and the comment above it in `app/layout.tsx` records the skyshade
regression where a root canonical with no per-page overrides made every page claim to be the homepage.

```ts
alternates: {
  canonical: `/services/${card.slug}/`;
} // leading + trailing slash
```

Next percent-escapes the Hebrew on output, which makes the canonical byte-identical to the sitemap
`<loc>` (`encodeURI` in `app/sitemap.ts`) and to the `BreadcrumbList` items (`schemaPath()` in
`components/layout/PageHeader.tsx`). `titles.mjs` asserts canonical = sitemap entry.

Legacy URLs carry no canonical of their own any more: since ADR 0004 (2026-09-06, commit `a0e0fe2`)
they are **301s** from the generated `public/_redirects`, not stub pages. The 37 meta-refresh stubs
that used to sit under `public/` each combined `noindex` with a canonical — which Google explicitly
advises against, because the `noindex` can be attributed to the canonical target — and they are gone.
Nothing about a legacy URL is a metadata question now; it is a redirect rule, and the map is
`REDIRECTS.md`.

## og:url and the OG block

**This is built — use it, don't re-derive it.** `lib/seo.ts` is the one place `alternates.canonical`
and `openGraph.url` come from, so the two cannot diverge (§1.5, closed 2026-09-06 by `13a6bdc`):

- `ogBase` — the static half of every route's OG block: `images` (`ogImageMeta(manifest.images)`,
  served from the `imgquarry.com` media host), `type`, `locale: "he_IL"`, `siteName`.
- `routeUrl(path)` — the canonical/`og:url` path for a **decoded** route path (`""` for the homepage,
  no leading or trailing slash, e.g. `services/${card.slug}`). Write the plain Hebrew segment and let
  Next percent-escape it on output; pre-encoding here double-encodes `%` into `%25`.

```ts
import { ogBase, routeUrl } from "@/lib/seo";

const url = routeUrl(`services/${card.slug}`);
export const metadata = {
  alternates: { canonical: url },
  openGraph: { ...ogBase, url, title: card.name, description },
};
```

**Spreading `ogBase` is mandatory, not stylistic.** Next replaces a parent `openGraph` object
wholesale the moment a route sets its own — it does not merge — so a route that writes
`openGraph: { url }` without the spread silently ships with no OG image. All twelve route files do
it today. `url` resolves against `metadataBase`, so it comes out percent-escaped like the canonical;
Twitter tags derive from OG. `titles.mjs` counts `og:url` per page and reads `ogUrlMissing 0` — a
new route that skips this is the only way that number moves.

## Sitemap

`app/sitemap.ts` builds services, locations and posts from the data arrays, gives every entry a
trailing slash, `encodeURI`s the Hebrew, and uses **real content dates** for `<lastmod>`
(`services[].updated`, `locationsUpdated` at `lib/site-config.ts:112`, `posts[].updated ?? date`).
Never `new Date()` — bump the dates only for real copy edits.

The registry: `staticPages` in `lib/site-config.ts` (typed `StaticPage`, optional `noindex`) is the one list of the nine static routes; `app/sitemap.ts` derives from it and `links.mjs` cross-checks it against the `app/` tree both ways (§1.4, done 2026-09-06 in `c047d4d`). Add a top-level page → add its row, or `links.mjs` fails naming the route. Still open: `navItems` hrefs lack the trailing slash (N10). Phase 4: the guides registry `lib/guides.ts` (ADR 0002) appends the `/מדריכים/` entries the same way. Never hand-maintain a second URL list.

`links.mjs` asserts sitemap ↔ emitted-tree parity both ways and every `<lastmod>` as a real, non-future date; 45 URLs today.

## Robots

`app/robots.ts` emits a blanket allow plus the sitemap. **It is not what serves** — Cloudflare prepends
a managed block at the edge that blocks every major AI crawler (backlog §6.1, owner-actions §1,
`docs/cloudflare-runbook.md` step 1). Per-bot `Allow` rules go in via `/aeo-answer-content`.

## Verification

Search Console: set `analytics.googleSiteVerification` in the **roster manifest** → the layout emits
`verification.google`. It is `null` today (owner-actions §2.3). Never edit `site.config.json`
directly. `brand.themeColor` (`#B6070C`) exists in the manifest and is never read — worth wiring.

## One H1 per page

Exactly one `<h1>`, matching the title's intent; `<h2>`/`<h3>` below with no skipped levels.
`links.mjs` reports `pagesNotExactlyOneH1` and `headingSkips` — both 0 today; keep them there.

## Checklist

- [ ] Title is the bare subject; rendered title ≤ ~60 chars; brand appears exactly once.
- [ ] Description 120–160 chars, unique, ends with punctuation, claims nothing 🔶/❌.
- [ ] `alternates.canonical` with both slashes; `openGraph` spreads `ogBase` and sets `url`.
- [ ] Route reachable from `app/sitemap.ts` without editing an array by hand.
- [ ] Exactly one `<h1>`; heading order unbroken.
- [ ] `npm run build && node scripts/audit/titles.mjs` → 0 failures (rebuild first — N12).

## Gotchas

- Forgetting the trailing slash in `canonical` splits signals against the exported directory URL.
- Don't set `metadataBase` per page — it's set once in `app/layout.tsx`.
- A page-level `openGraph` without the spread drops the OG image — see above.
- Don't "fix" `/איזורי-שירות/`. It is live-URL fidelity (golden rule 3).
