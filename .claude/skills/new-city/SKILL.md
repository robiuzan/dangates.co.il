---
name: new-city
description: Add or deepen a location page the data-driven way — the model is built (Sprint 6, 7c3f2db) — a locations entry in lib/site-config.ts with kind, prefixed and its own updated date, one typed content/locations/<slug>.ts module assembled and checked by cityContent in lib/city-content.ts (answer, local notes, neighbourhoods, city FAQs, services), a pair in lib/nearby.ts that links both pages, and the route, areas index, footer, link mesh, FAQPage, schema and sitemap following. Proof is scripts/audit/content-depth.mjs (350-word floor, doorway delta ≥ 120 — all 14 pass since 2026-11-09, after four unserved pages were retired on owner-actions 3.6) and links.mjs. Use when editing a city page's copy, or — only after the local-seo-strategist sign-off — adding a city the owner serves. Triggers: "add a city", "new location page", "cover <city>", "edit a city page", "this city page is thin", "doorway", "עמוד עיר", "אזור שירות חדש".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Add or deepen a location page

**Read this first: the model is built and all 14 pages pass the measured doorway proxy** (Sprint 6,
commit `7c3f2db`; four unserved pages retired in `7ed1acd`, both 2026-11-09). Measure before touching anything — never quote the numbers below
without re-running:

```bash
node scripts/audit/content-depth.mjs          # floors + doorway delta (median only; per page needs a scratch run)
node scripts/audit/links.mjs                  # chrome reach, orphans, breadcrumbs
node scripts/audit/schema.mjs                 # Service + areaServed, FAQPage parity per location
```

As of 2026-11-09 (at `2b0d802`): location 14 pages, `belowFloor 0`, unique 714–1118 against the
**350** floor (median 887), `locationMedianDelta 343` against the **120** threshold in
`scripts/audit/thresholds.json` (every page 292–439); `notInChrome 0`, `faqPages 26`. Before Sprint 6 every page carried 122–145 unique
words and a delta of 2–3 tokens — the city name was the only variable (backlog §3.1, §5.3).

**Owner-actions 3.6 is answered (2026-11-09).** The five 🔶 entries that shipped as bounded pages
are resolved: קריות, צפון, דרום and באר שבע are not served — `7ed1acd` retired them, each with a 301
to `/איזורי-שירות/` (`REDIRECTS.md` → `npm run redirects`) — and חיפה, אשקלון and שרון are served.
The answer named no town inside the Sharon and did not name ירושלים, so those two pages keep the
bound ("check by phone whether and when a visit is possible"). **Still open:** local-seo-strategist
sign-off on the 14 is not on record, so **no 15th location yet** — `/local-seo-il` §5 — and none of
the four retired places comes back unless the owner reverses 3.6.

## The data model — as built

Three files, each with one job:

```ts
// lib/site-config.ts — the entry (identity and grammar; `as const`, so it widens LocationSlug)
{ slug: "שרון", name: "אזור השרון", kind: "region", prefixed: "באזור השרון", updated: "2026-11-09" }
// `name` is what the chrome and the JSON-LD read — never a bare form that is also a personal name
// (9886dd1); the slug and URL stay short.
```

- `slug` — the Hebrew route segment. Live and load-bearing on the existing 14; renaming needs a 301,
  and so does retiring one (the four retired in `7ed1acd` point at `/איזורי-שירות/`).
- `kind` — `"city" | "region"`. Drives `City` vs `AdministrativeArea` in `areaServed` through
  `placeNode` in `lib/jsonld.ts` (schema-graph §5). One entry is a region since `7ed1acd`: שרון.
- `prefixed` — the name with its preposition (`בתל אביב`, `באזור השרון`). Every shared
  builder in `lib/content.ts` (title, H1, description, intro, link labels) and every
  `content/locations/*.ts` module uses it — never a bare `ב${loc.name}` (content-standards §8).
- `updated` — **per entry**, the page's own sitemap `<lastmod>` (`app/sitemap.ts` reads `c.updated`;
  the shared `locationsUpdated` is gone). Bump it for real copy edits to that page only.

```ts
// content/locations/<slug>.ts — the copy (one module per city, so drafters never share a file)
export const city: CityContent = {
  title,
  h1,
  metaDescription, // own strings; an empty one falls back to the shared builder
  answerHeading,
  answer, // question-form H2 + 40–60 words; answer "" = entry not written
  localNotes: [{ heading, paragraphs }], // three or more true local items, one question-form H2 each
  neighborhoods, // neighbourhoods, industrial zones or — for a region — towns
  faqs: [{ q, a }], // 2–3 (3 on every page today); each question unique sitewide
  services, // the ServiceSlugs this housing makes relevant
};
```

```ts
// lib/city-content.ts — types, assembles and checks
export const cityContent: Record<LocationSlug, CityContent> = { … }; // total — a missing city fails typecheck
```

Module-load throws (so `next build` fails) on an unknown or repeated service slug and on a FAQ
question already used on `/`, a service page or another city. The field rules are the JSDoc on
`CityContent`; read it before writing.

```ts
// lib/nearby.ts — the mesh: ONE list of unordered pairs, read both ways by nearby(slug)
export const nearbyPairs: readonly NearbyPair[] = [["תל-אביב", "חולון"], …]; // 22 pairs today
```

Symmetry is structural — one pair links both pages, so a one-way edge cannot be written. Throws on a
self-pair and on a pair listed twice in either direction. A pair is geography, never a coverage claim.

UI labels around the copy (section headings, link frames) are `locationPageCopy` in `lib/content.ts`,
never in a content module.

## The doorway test — the gate

> Replace the city name with a different city name. Is the page now correct and publishable for that
> other city? **If yes, it does not ship.**

`content-depth.mjs` measures the half that can be measured (tokens the nearest sibling lacks ≥ 120).
The half it cannot: `localNotes` needs **three or more** true, specific items (content-standards §2):

- Named neighbourhoods, industrial zones, streets or landmarks — only names you are sure of.
- The local gate reality — villa streets with wide sliding gates, apartment blocks with shared
  parking barriers, moshav plots with long driveways and cable runs, coastal towns where salt air
  eats motors and tracks faster, hill towns with wind and slope.
- A real job reference from that city (with permission), or a photo (coming — business-facts §F).
- Travel and scheduling reality — **only once confirmed**. It is unconfirmed for every page
  (business-facts §E, owner-actions 3.5), so no page states a travel or response time.
- A city-specific FAQ that would read oddly anywhere else.
- What drives local pricing, if it differs — never an invented number (business-facts §D).

**If none of those can be said truthfully about a city, that city does not warrant a page.** Record
that in `docs/business-facts.md` §E rather than padding (its Value column is the owner's). A page
that exists to hold a keyword is what Google's doorway policy names, and the penalty lands on the
domain.

## Steps — editing a page

1. **Read** the city's `content/locations/<slug>.ts` header comment (what this page may and may not
   say) and the `CityContent` JSDoc.
2. **Edit** the module. Meet the 350-word floor with local substance: a block rendered verbatim on
   ≥ 3 routes earns no credit (content-standards §1 — the script subtracts it).
3. **Bump** that entry's `updated` in `lib/site-config.ts` — copy edits only.
4. **Gate** — `npm run gate`, then the proof lines below.

## Steps — adding a city (only after the cap lifts)

1. **Check the cap** — `/local-seo-il` §5: the sign-off on record (owner-actions 3.6 is answered),
   and the owner confirms the new place is served — never one of the four retired in `7ed1acd`.
2. **Entry** — append the `locations` row with `slug`, `name`, `kind`, `prefixed`, `updated`.
   Typecheck now fails on `cityContent` — that is the forcing function.
3. **Content** — write `content/locations/<slug>.ts` and add it to `cityContent`.
4. **Nearby** — add one pair per real neighbour (2–4) to `nearbyPairs`; for a region, its
   constituent cities, never another region.
5. **Route** — nothing to do: `app/locations/[city]/page.tsx` renders, in order, the answer block
   directly under the H1 · local notes · the neighbourhood list · the relevant services (the
   entry's `services` plus every service whose `ServiceDepth.locations` names the city, with a link
   to `/שירותים/`) · the city FAQ · nearby locations · `FinalCta` (content-standards §3).
6. **Metadata** — keyword-map §3: `title` = `תיקון שערים חשמליים ${prefixed}`, bare subject, ≤ 41
   characters (the layout template appends the 19-character brand; the doubled suffix is **fixed**,
   never re-add it). Description 150–160 characters, unique sitewide, no 🔶 claim (backlog §2.3).
7. **Schema** — automatic, in one `@graph` through `PageHeader` (never a second `BreadcrumbList`):
   the business node, a `Service` from `locationServiceJsonLd` with `areaServed` typed from `kind`,
   and a `FAQPage` from the entry's `faqs` — the same `{ q, a }` the `<Faq>` renders.
8. **Hand-off** — copy to `hebrew-editor` then `claims-verifier`, page to `local-seo-strategist`;
   any route change to `ts-react-reviewer` (roster §3, §5).

**Proof lines:** `content-depth.mjs` → location `belowFloor 0`, no doorway failure, no location row
in the answer-block warning; `links.mjs` → `orphans 0`, `notInChrome 0`; `schema.mjs` → 0 failures,
`faqPages` up by one per new city; `claims-grep.mjs` → `failingClaims 0`.

## What follows automatically

`generateStaticParams` picks up the route · `/איזורי-שירות/` and `ServiceAreas` list it
(`locations.map`) · `app/sitemap.ts` includes it with its own `<lastmod>` · the footer links it
(`locations.map`, all of them since `7c3f2db` — 14 since `7ed1acd`) · the city select in the lead form offers it.

## Checklist

- [ ] The cap has lifted, or this is an edit to one of the 14.
- [ ] `kind`, `prefixed`, `updated` set; no template or module uses a bare `ב${name}`.
- [ ] ≥ 350 unique words in `<main>`; three or more genuinely local items.
- [ ] `content-depth.mjs` doorway delta ≥ 120 vs the nearest sibling — measured, not assumed.
- [ ] Opens with a 40–60 word answer block under a question-form heading.
- [ ] One `nearbyPairs` entry per neighbour; nothing one-way is possible, but check the geography.
- [ ] Title = bare subject with `prefixed`; brand appears once; canonical has both slashes.
- [ ] Every FAQ question unique sitewide (the module-load check enforces it).
- [ ] Every claim is free or 🔶-rowed in `docs/business-facts.md` — no warranty term, no 24/7, no
      "פריסה ארצית", no coverage of a 🔶 place unless §E confirms it.
- [ ] Present in `out/` and `out/sitemap.xml` with its own `<lastmod>`.

## Gotchas

- Hebrew params arrive percent-encoded — the route matcher already uses
  `decodeURIComponent().normalize("NFC")`. Don't bypass it.
- `content-depth.mjs --json` gives only the medians. For per-page unique words and deltas, run a
  scratch copy of its `contentPages()` / `tokens()` logic outside the repo and delete it after.
- Never invent a neighbourhood, a landmark, a travel time or a local job. Unverified → `// 🔶 confirm`
  - a row in `docs/business-facts.md`. The PostToolUse hook and `claims-grep.mjs` catch the lexicon
    (אחריות מלאה, ניסיון רב, פריסה ארצית, 24/7); they do not catch an invented street name — you do.
- Never rename a live slug without a 301. The city URLs already moved once (root → `/locations/`)
  and are held together by the generated `public/_redirects` rules (ADR 0004); a second move
  compounds the loss.
- `prefixed` is grammar, not marketing: `בתל אביב`, `באזור השרון`, `בחיפה`. Keep it to the preposition
  form the H1 formula expects (keyword-map §4). In body prose `בצפון` / `בדרום` as ordinary words
  ("בצפון יש הרבה מושבים") are fine; the title, H1 and description use `prefixed`.
- An entry with `answer: ""` renders the shared fallback page — that is a stub, and it fails the
  floor. Every one of the 14 is written today; keep it that way.
