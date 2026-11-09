---
name: new-service
description: Add or deepen a service page the data-driven way — append to services in lib/site-config.ts, add the serviceMeta and serviceTriggers entries in lib/content.ts and a ServiceDepth module in content/services/<slug>.ts registered in lib/service-depth.ts (answer, sections, caveats, FAQs, relatedServices, locations, relatedPosts, metaDescription), so the route, the services grid, cross-links, the FAQPage, schema and the sitemap update automatically. The depth model is built (Sprint 5, 225ff45) and all 7 pages pass. Proof is scripts/audit/content-depth.mjs (450-word floor, doorway delta ≥ 120). Use when editing a service page's depth copy or, now that the seven pass, adding an eighth. Triggers: "add a service", "new service page", "deepen the service copy", "per-service FAQ", "edit a service page", "עמוד שירות", "שאלות נפוצות לשירות".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Add or deepen a service page

**All 7 service pages carry their own depth copy since Sprint 5** (commit `225ff45`, 2026-11-09).
Measure before quoting:

```bash
node scripts/audit/content-depth.mjs          # floors, doorway delta, answer-block proxy, shared blocks
```

As of 2026-11-09 (at `2b0d802`) the service type has `belowFloor 0`: 1380–1630 unique words inside
`<main>` (median 1468; 1294–1542, median 1387, before each page gained a TOC in `98e38f0`) against
the **450** floor, and a doorway delta of 403–466 tokens (`serviceMedianDelta 437`) against the
**120** threshold. Before Sprint 5 they carried 167–173 unique words and a delta
of 28–50 (151–155 and 13–23 on 2026-08-23) — one paragraph of their own each, the rest shared. The
script's `--json` gives only per-type medians; per-page values need a scratch run over its own
`contentPages()` / `tokens()` helpers in `scripts/audit/lib/pages.mjs`.

An edit must keep all seven above the floor and the delta. The cap in CLAUDE.md §12 now waits only on
the locations: no eighth service until the 14 location pages pass the doorway test too (the measured
proxy passes; the local-seo-strategist sign-off is not on record).

## The data model — built

Four places, each with one job:

| Where                                                 | What                                                                                                                                                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `services` in `lib/site-config.ts`                    | `{ slug, name, updated }`. `updated` is the page's sitemap `<lastmod>` — bump it for a real copy edit only (all seven are `2026-11-09` since `225ff45`)                                                                         |
| `serviceMeta` in `lib/content.ts`                     | `{ tagline, description, icon }` → `serviceCards`. `description` is the card paragraph on `/` and `/שירותים/` and the `Service` node's description; it renders on the service page itself only when the depth `answer` is empty |
| `serviceTriggers` in `lib/content.ts`                 | the per-service "מתי כדאי לפנות אלינו?" list (since `cfff52f`, backlog §3.3) — a total `Record<ServiceSlug, readonly string[]>`; it is **not** part of `ServiceDepth`                                                           |
| `content/services/<slug>.ts` → `lib/service-depth.ts` | one module per service, `export const depth: ServiceDepth`; `lib/service-depth.ts` holds the types, imports the seven and exports `serviceDepth: Record<ServiceSlug, ServiceDepth>` — a missing service fails typecheck         |

```ts
// lib/service-depth.ts — the shape (the JSDoc there is the field contract)
export interface ServiceDepth {
  answerHeading: string; // question-form H2 above the answer
  answer: string; // 40–60 words; the FIRST <p> in <main>. Empty → the card's description + tagline
  metaDescription: string; // meta + og:description, 120–160 chars, terminal punctuation (backlog §2.4)
  sections: readonly {
    heading: string;
    paragraphs: readonly string[];
    list?: readonly string[];
  }[];
  caveats: readonly string[]; // when this type is the wrong answer; what shortens motor life
  faqs: readonly { q: string; a: string }[]; // 3–5, rendered AND the FAQPage
  relatedServices: readonly ServiceSlug[]; // 2–4 by relevance, never the service itself
  locations: readonly LocationSlug[]; // 4–6 published cities; never an unconfirmed region
  relatedPosts: readonly string[]; // existing slugs in lib/posts.ts; may be empty (see below)
}
```

The headings and link frames around these fields are UI copy in `lib/content.ts`:
`serviceDepthCopy` (caveats, related services, cities, related posts, the FAQ heading
`שאלות נפוצות על …` and the `<details>` group name `service-faq`), `servicePageCopy` (triggers and
process headings, the CTA card subtitle), and the visit line — `serviceVisitBandCopy` plus
`serviceVisitBandApplies`, a total record that prints the `visitFeeRange` band on the six gate pages
and the no-number line on the shutters page (business-facts §D: no source covers a shutter visit).
Per-service prose never goes in `lib/content.ts`, and UI labels never go in a depth module.

### Module-load checks (`validateServiceDepth()` in `lib/service-depth.ts`)

They throw at import, so a bad entry fails `next build` with a message naming the service:

- `relatedServices` lists the service itself, or lists one service twice;
- a `relatedPosts` slug is not a post in `lib/posts.ts` (compared NFC-normalized);
- a FAQ question (NFC, trimmed, whitespace collapsed) repeats a homepage `faqs` question or another
  service's.

The types enforce the rest of the shape: `ServiceSlug` / `LocationSlug` unions for the link fields,
the total `Record` for the entry set. The counts (40–60 words, 3–5 FAQs, 2–4 related, 4–6 cities)
are conventions the scripts measure, not throws — `content-depth.mjs` warns on an answer outside
40–60 words, `titles.mjs` on a description outside 120–160.

### Rendering order (`app/services/[service]/page.tsx`)

1. `PageHeader` — the H1 (`card.name`); the tagline only while `answer` is empty; one `@graph` of
   the business node, `serviceNode()`, `FAQPage` from `depth.faqs` when there are any, and the
   breadcrumb `PageHeader` appends.
2. `answerHeading` (H2) + `answer` — or `card.description` when the answer is empty.
3. `sections` — each a question-form H2, its paragraphs, then its list if any.
4. Triggers — `servicePageCopy.triggersHeading` over `serviceTriggers[slug]`.
5. Caveats — omitted when empty.
6. Process — `servicePageCopy.processHeading` over `processSteps` (shared with `/`; every step names
   only what a gate and a shutter share).
7. The visit line — the band or the no-number form, then the link to `/מחירון/`; only when `answer`
   is written.
8. FAQ — `Faq` with `heading`, `id="faq"`, `name="service-faq"`; omitted when empty.
9. The sticky CTA card (`service-call`, `service-whatsapp`) beside the column.
10. Related services → cities ("מחפשים שירות בעיר שלכם?", omitted when empty) → related posts
    (omitted when empty), in declared order — never array order.
11. `FinalCta`.

`generateMetadata` reads `serviceDepth[slug].metaDescription` for the description and the
openGraph block; `title` stays the bare `card.name` (the layout template adds the brand once).

## The depth bar

450 unique words (content-standards §1), and the doorway test applies with the service name swapped:
**does the page still read correctly?** What carries the seven today, and what any edit must keep:

- **Mechanism and fit** — which motor and drive suit this type, at what weight and width. A נגרר and a
  כנף fail for different reasons; say so. Buyer vocabulary: עינית, לוח פיקוד, מחסום (keyword-map §2).
- **Failure modes** — what goes wrong on _this_ type, what causes it, what moves the repair price (the
  driver, never a new number — business-facts §D).
- **Who this isn't for** — the caveats; honest limits are disproportionately citable.
- **The 230V boundary** — what the owner may check and where it stops; a boundary, never a licence
  claim (eeat-and-trust §3.3).

`תריסי-גלילה-חשמליים` is written with the shutter's own parts (ארגז, ציר גלילה, מנוע צינורי, שלבים,
תעלות הובלה) and no gate vocabulary; its `relatedPosts` is empty because no post covers a shutter,
and the route omits the section. `שערים-לחניה`, `שערים-לדירה` and `שער-זרוע` overlap in the field and
stay differentiated: the shared car-park gate, the building's pedestrian entrance, the barrier arm.

## Steps

1. **Cap** — no eighth service until the 14 locations pass the doorway test by hand as well
   (`content-depth.mjs` passes them since `7c3f2db`). For a new
   one, append to `services` (flagship-first; the array drives grid order). No `priceRows` row —
   since N14 (`af8ba4c`) `priceRows` holds only the visit band.
2. **`serviceMeta` + `serviceTriggers`** — `tagline`, `description`, a valid `IconName` (`ServicesGrid`
   keys on it); a trigger list specific to this service. Then decide `serviceVisitBandApplies[slug]`.
3. **Depth module** — `content/services/<slug>.ts` exporting `depth: ServiceDepth`, with a header
   comment naming what it may not claim; import it in `lib/service-depth.ts` and add it to
   `serviceDepth`.
4. **FAQs** — 3–5 questions this page answers and no other page asks. Never copy a homepage FAQ; the
   module-load check throws and `schema.mjs` fails a question marked up twice.
5. **Links** — `relatedServices` by relevance, 4–6 published cities (rotate so every city sits on 2+
   services; only the 14 published locations — קריות, צפון, דרום and באר שבע are not served and
   their pages are retired, owner-actions 3.6), existing
   posts only (`/internal-linking`).
6. **Metadata** — `metaDescription` 120–160 characters, terminal punctuation, from the depth copy.
7. **Gate** — `npm run gate`. Proof: `content-depth.mjs` → `service.belowFloor 0`, every delta ≥ 120,
   no service row in the answer-block warning; `schema.mjs` 0 failures (`faqPages` = 1 + the services
   with FAQs, 8 today); `links.mjs` → `relatedServiceTargets` = the service count (7 today), no
   service-page monotony warning; `titles.mjs` 0 warnings; `claims-grep.mjs` 0.
8. **Hand-off** — copy to `hebrew-editor` → `claims-verifier`; markup to `ts-react-reviewer`.

## What follows automatically

`generateStaticParams` · `ServicesGrid` on `/` and `/שירותים/` · the footer service column
(`Footer`) · the `LeadForm` service `<select>` · `app/sitemap.ts` with the entry's own `updated` ·
the `FAQPage` and the `hasOfferCatalog` entry on the business node.

## Checklist

- [ ] `serviceMeta` complete with a valid `IconName`; `serviceTriggers` entry specific to the service.
- [ ] Depth module present and registered; ≥ 450 unique words in `<main>`; delta ≥ 120.
- [ ] Opens with a 40–60-word answer under a question-form heading.
- [ ] 3–5 FAQs, rendered on the page, each unique sitewide; the build passes the module-load checks.
- [ ] No per-service price; the visit band only through `visitFeeRange`; no new number anywhere.
- [ ] `relatedServices`, `locations` and `relatedPosts` declared — nothing chosen by array order.
- [ ] `metaDescription` 120–160 characters; title is the bare name; brand appears once.
- [ ] One `@graph`: business, `Service`, `FAQPage`, one `BreadcrumbList`.
- [ ] Present in `out/` and `out/sitemap.xml` with the new `updated`.

## Gotchas

- Hebrew slugs arrive percent-encoded — keep the `decodeURIComponent().normalize("NFC")` matcher,
  and the module file name is the Hebrew slug itself.
- Never invent materials, durations, warranty terms, brands or prices. 8 of the 9 `priceRows` were
  authored estimates and were deleted with N14 (`af8ba4c`; business-facts §D) — do not add one back.
- "אחריות מלאה", "ניסיון רב שנים", "24/7", "פריסה ארצית" and quote-before-work or no-obligation
  promises are 🔶 — `claims-grep.mjs` fails on the lexicon; the Sprint 5 review stopped the rest.
  Say `אחריות על העבודה`; replace duration claims with mechanism depth.
- `processSteps`, `finalCtaCopy` and `servicePageCopy` render on the shutters page too — a gate-only
  word there is false on one of seven pages.
- A paragraph rendered verbatim on three or more pages counts on none (`sharedParagraphs`); keep the
  depth prose out of shared components.
- Seven services with genuine depth beat twelve that paraphrase each other.
