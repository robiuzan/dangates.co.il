# ADR 0005 — One compact family-link block after the curated related lists

**Date:** 2026-11-10 · **Status:** **accepted; implemented in the repo 2026-11-10** (backlog N30; the
hub wiring half of N31) · **live after the next deploy**

## Context

[content-standards §3](../content-standards.md) keeps a page's related links chosen by relevance:
a service page declares its related services and cities, a location page its neighbours and services.
That rule stays right for the lists that lead, but it leaves a service page unable to reach most of
its siblings in one hop, and a location page the same. The owner's 2026-11-10 brief asked for a
compact all-types and all-areas block on the 21 family pages, modelled in structure on the family hub
at https://3locksmiths.co.il/services/שכפול-מפתח-לרכב/ (see `renderFamilyHub` in
`lib/enrich/render.mjs` in `../3locksmiths.co.il`). The export has little headroom under
`maxOutBytes` (12 MB), so the block has to be small.

## Decision

- One shared server component, `components/marketing/FamilyLinks.tsx`, rendered after the curated
  lists and `RelatedGuides` on the 7 service pages and the 14 location pages. The curated lists stay
  exactly as they are and still lead.
- It lists all 7 types and all 14 areas from `services` and `locations`. The current page is shown as
  `<span aria-current="page">` text, never a link to itself.
- The headings name pages, never service: ירושלים is unconfirmed, and a heading that reads as
  coverage would claim it. Copy is `familyLinksCopy` in `lib/content.ts`.
- Compact markup for the size budget: no card class, no chevron, no `relatedAttr`; the link style sits
  once on each `<ul>` through child selectors (`min-h-11` keeps the 44px target), so a link prints no
  class attribute.
- Hubs reuse it: `/שירותים/` shows the areas and the guides, `/איזורי-שירות/` the types.
  `/מחירון/` accepts an optional `pricingPageCopy.guidesPointer`, rendered with `withLinks` and
  nothing while absent.

## Rejected

- Replacing the curated lists with the full block: relevance ordering is the point of the lists.
- Service × city pages (7 × 14): still forbidden as doorway pages.
- Re-adding קריות, צפון, דרום or באר שבע: retired by owner-actions 3.6.

## Consequences

- Every family page reaches every sibling in one hop inside `<main>`. Checked on the built HTML: each
  of the 21 pages links all 7 types and all 14 areas minus itself.
- Byte cost: `perf.mjs` `outBytes` 11567820 before, 11804703 after (+236883), under `maxOutBytes` 12000000. `thresholds.json` is unchanged.
- The block is navigation, not evidence of coverage; its headings say so by naming pages.
- content-standards §3 and the `internal-linking` skill change in the same commit.
