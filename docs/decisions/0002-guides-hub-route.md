# ADR 0002 — New editorial pages live in a `/מדריכים/` hub

**Date:** 2026-08-23 · **Status:** accepted (route family built in Phase 4)

## Context

`docs/keyword-map.md` §8 evidences demand for page families the site does not have: symptom pages
(`שער חשמלי לא נסגר`, `רועש` — no standalone page anywhere in the market), component pages (עינית,
לוח פיקוד, שלט), brand pages, gate-type comparisons, a ועד בית / shared-car-park guide, and the
ת״י 900 חלק 21.03 safety-standard page (§12 — buildable today with no owner input). Three homes were
possible: the existing `/blog/`, top-level Hebrew slugs, or a new hub.

## Decision

A Hebrew guides hub: `app/מדריכים/` (an `ItemList` index) and `app/מדריכים/[slug]/` (one guide =
`TechArticle`/`Article` + `FAQPage` + `BreadcrumbList`). The block content model, registry with
module-load throws, reverse index and article components are copied from
`galbath.co.il` (`lib/article-types.ts`, `lib/articles.ts`, `lib/jsonld.ts`, `components/article/*`)
and extended with a `family` field: `symptom | component | brand | comparison | safety | committee`.

- `/blog/` keeps the 11 migrated posts. Their 11 legacy-URL redirects point there and stay valid. A
  post migrates to the hub only when it is rewritten to the bar, with a 301 in `public/_redirects`.
- Symptom and component pages are informational-commercial; they stay off `/services/` so
  `serviceJsonLd` remains on the 7 transactional pages, and link down with capped CTAs.
- One hub, families as metadata: concentrated equity, one breadcrumb level, one index, one set of
  rules — instead of six route segments.

## Rejected

- **Extend `/blog/`** — mixes untrusted migrated content with new editorial, has no family structure,
  and the flat `PostBlock` model cannot carry tables, answer blocks or in-copy links.
- **Top-level slugs** — shortest URLs, but no hub page, no breadcrumb hierarchy, a crowded root next
  to eight static pages, and nothing to hang an `ItemList` on.

## Consequences

- `new-guide` is one parameterized skill; `content-hub` decides whether a topic earns a page;
  `article-auditor` gates publication.
- `app/sitemap.ts` must derive the hub from the registry (and the other static routes from one
  `staticRoutes` const — backlog §1.4) so a new guide cannot be silently absent.
- The service × location matrix stays unbuilt (keyword-map §6); guides are the expansion surface.
