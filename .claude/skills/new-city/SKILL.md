---
name: new-city
description: Add or deepen a location page the data-driven way — append to locations in lib/site-config.ts with kind, prefixed and a per-entry updated date, author genuinely unique per-city content in the cityContent map, wire nearby both ways, and let the route, areas index, link mesh, schema and sitemap follow. Proof is scripts/audit/content-depth.mjs (350-word floor, doorway delta ≥ 120) and links.mjs. Use when retrofitting one of the 18 thin city pages or, only after they pass, adding a city. Triggers: "add a city", "new location page", "cover <city>", "this city page is thin", "doorway", "עמוד עיר", "אזור שירות חדש".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Add or deepen a location page

**Read this first: all 18 location pages fail the doorway test, and not marginally.** Measure it
before touching anything — never quote the numbers below without re-running:

```bash
node scripts/audit/content-depth.mjs          # floors + doorway delta per page, nearest sibling named
node scripts/audit/links.mjs                  # chrome reach, orphans, breadcrumbs
```

As of 2026-08-23 every location carries **122 unique words** inside `<main>` (128 for the two-word
names) against the **350** floor, and a doorway delta of **2 tokens** (3 for two-word names) against
the **120** threshold in `scripts/audit/thresholds.json` — the only variable is `${loc.name}`,
interpolated into one shared template in `app/locations/[city]/page.tsx`. A find-and-replace
regenerates any of the 18 from any other (backlog §3.1, §5.3).

Until that is fixed, **retrofitting existing pages outranks adding new ones** — `/local-seo-il` §5:
no 19th location while the 18 fail.

## The data model — the Phase-3 target

**None of this model exists yet.** Today a location is `{ slug, name }` only
(`lib/site-config.ts:82`), one shared `locationsUpdated` date serves all 18 sitemap entries
(`lib/site-config.ts:112`), and there is no `cityContent`, `kind`, `prefixed` or `nearby` anywhere.
`/improve §3.1` builds it; until then **this skill is the spec**, not a description of the code.

```ts
// lib/site-config.ts — target
export const locations = [
  {
    slug: "תל-אביב",
    name: "תל אביב",
    kind: "city",
    prefixed: "בתל אביב",
    updated: "2026-09-01",
  },
  {
    slug: "צפון",
    name: "צפון",
    kind: "region",
    prefixed: "בצפון הארץ",
    updated: "2026-09-01",
  },
] as const;
```

- `slug` — the Hebrew route segment. Live and load-bearing on the existing 18; renaming needs a 301.
- `kind` — `"city" | "region"`. Drives `City` vs `AdministrativeArea` in `areaServed`
  (schema-graph §5). Four entries are regions: קריות, שרון, צפון, דרום.
- `prefixed` — the name with its preposition. Every template today interpolates a bare `ב${loc.name}`,
  which is wrong Hebrew for the regions (`בשרון` → `באזור השרון`, `בצפון` → `בצפון הארץ`;
  content-standards §8, backlog §5.2). Title, H1, description and body all switch to it.
- `updated` — **per entry**, replacing the shared `locationsUpdated`. One date for 18 pages is
  correct only while they render from one template; the moment copy diverges it is false precision.
  `app/sitemap.ts` switches to `c.updated` in the same change. Bump it for copy edits only.

```ts
// lib/content.ts — target
export interface CityContent {
  answer: string; // 40–60 words: do we serve this city, how fast, what drives cost (content-standards §5)
  intro: string[]; // 2–3 city-specific paragraphs
  localNotes: string[]; // the substance — three or more true local items (see below)
  neighborhoods?: string[];
  travel?: string; // scheduling reality at this distance — bounded, never "24/7" unless confirmed
  faqs: { q: string; a: string }[]; // 2–3, city-specific → FAQPage; each Q/A on exactly one page sitewide
  nearby: readonly LocationSlug[]; // 2–4 real neighbours, declared on both sides
}
export const cityContent: Record<LocationSlug, CityContent> = { … }; // total Record — a missing city fails typecheck
```

`Record<LocationSlug, …>` is deliberate: with `noUncheckedIndexedAccess` on, a city without content
is a compile error, not a blank page.

## The doorway test — the gate

> Replace the city name with a different city name. Is the page now correct and publishable for that
> other city? **If yes, it does not ship.**

`content-depth.mjs` measures the half that can be measured (tokens the nearest sibling lacks ≥ 120).
The half it cannot: `localNotes` needs **three or more** true, specific items (content-standards §2):

- Named neighbourhoods, industrial zones, streets or landmarks.
- The local gate reality — villa streets with wide sliding gates, apartment blocks with shared
  parking barriers, moshav plots with long driveways and cable runs, coastal towns where salt air
  eats motors and tracks faster.
- A real job reference from that city (with permission), or a photo (coming — business-facts §F).
- Travel and scheduling reality — how far, and whether the emergency promise genuinely holds at that
  distance. For באר שבע, קריות and צפון that is an open question (business-facts §E, owner-actions
  3.5–3.6), so write the bounded version.
- A city-specific FAQ that would read oddly anywhere else.
- What drives local pricing, if it differs — never an invented number (business-facts §D).

**If none of those can be said truthfully about a city, that city does not warrant a page.** Record
that in `docs/business-facts.md` §E rather than padding. A page that exists to hold a keyword is what
Google's doorway policy names, and the penalty lands on the domain.

## Steps

1. **Check the cap** — `/local-seo-il` §5. Retrofit before expansion.
2. **Entry** — add or complete the `locations` row with `slug`, `name`, `kind`, `prefixed`, `updated`.
   When the first per-entry date lands, delete `locationsUpdated` and point `app/sitemap.ts` at
   `c.updated`.
3. **Content** — add the `cityContent` entry. Meet the 350-word floor with local substance, not longer
   versions of the shared paragraphs: a block rendered verbatim on ≥ 3 routes earns no credit
   (content-standards §1 — the script subtracts it).
4. **Nearby, both ways** — set `nearby` from real geography and add this city to each neighbour's
   `nearby`. A one-way edge is a modelling error. For a region, "nearby" means its constituent cities,
   never another region.
5. **Route** — `app/locations/[city]/page.tsx` renders, in order: answer block directly under the
   H1 · intro · local notes · the full service list (already there) · nearby locations · city FAQ ·
   CTA (content-standards §3). Copy stays in `lib/content.ts`; the route only maps it.
6. **Metadata** — keyword-map §3: `title: \`תיקון שערים חשמליים ${loc.prefixed}\``, bare subject.
The `app/layout.tsx`template appends the brand; the doubled suffix is **fixed** (0 in`out/`),
   so never re-add it. Description 120–160 chars, unique per city, no 🔶 claim (backlog §2.3).
7. **Schema** — today every location page emits **only** `BreadcrumbList`, from
   `components/layout/PageHeader.tsx:57-59` (never add a second one). Phase 2 adds
   `locationServiceJsonLd` in `lib/jsonld.ts` — `Service` + `areaServed` as `City` or
   `AdministrativeArea` by `kind`, percent-encoded `url`, the business node on the page — and
   `FAQPage` derived from `cityContent.faqs`. `/schema-structured-data` has the recipes.
8. **Gate** — `npm run gate`. Proof lines: `content-depth.mjs` → `location.belowFloor: 0` and no
   doorway failure for this page; `links.mjs` → `orphans: 0`, this page in `nearby` targets both ways;
   `schema.mjs` → no new failure; `claims-grep.mjs` → no new 🔶 hit.
9. **Hand-off** — copy to `hebrew-editor` then `claims-verifier`; the route change to
   `ts-react-reviewer` (roster §3, §5).

## What follows automatically

`generateStaticParams` picks up the route · `/איזורי-שירות/` and `ServiceAreas` list it
(`locations.map`) · `app/sitemap.ts` includes it · the footer links it **once the `slice(0, 12)`
at `components/layout/Footer.tsx:76` is gone** (`/internal-linking` §2 — six cities are missing from
the chrome today).

## Checklist

- [ ] Existing 18 pass the doorway test, or this is a retrofit of one of them.
- [ ] `kind`, `prefixed`, `updated` set; no template interpolates a bare `ב${name}`.
- [ ] ≥ 350 unique words in `<main>`; three or more genuinely local items.
- [ ] `content-depth.mjs` doorway delta ≥ 120 vs the nearest sibling — measured, not assumed.
- [ ] Opens with a 40–60 word answer block under a question-form heading.
- [ ] `nearby` declared on both sides; `links.mjs` shows the edges.
- [ ] Title = bare subject with `prefixed`; brand appears once; canonical has both slashes.
- [ ] `BreadcrumbList` (one) today; `Service` + `areaServed` + `FAQPage` once Phase 2 lands.
- [ ] Every claim is free or 🔶-rowed in `docs/business-facts.md` — no warranty term, no 24/7, no
      "פריסה ארצית" unless §E confirms it.
- [ ] Present in `out/` and `out/sitemap.xml` with its own `<lastmod>`.

## Gotchas

- Hebrew params arrive percent-encoded — the route matcher already uses
  `decodeURIComponent().normalize("NFC")`. Don't bypass it.
- Never invent a neighbourhood, a landmark, a travel time or a local job. Unverified → `// 🔶 confirm`
  - a row in `docs/business-facts.md`. The PostToolUse hook and `claims-grep.mjs` catch the lexicon
    (אחריות מלאה, ניסיון רב, פריסה ארצית, 24/7); they do not catch an invented street name — you do.
- Never rename a live slug without a 301. The city URLs already moved once (root → `/locations/`)
  and are held together by 37 generated stubs; a second move compounds the loss.
- `prefixed` is grammar, not marketing: `בתל אביב`, `באזור השרון`, `בקריות`. Keep it to the preposition
  form the H1 formula expects (keyword-map §4).
- Adding links to a thin page doesn't fix the thin page. Depth first, then the mesh
  (`/internal-linking`).
