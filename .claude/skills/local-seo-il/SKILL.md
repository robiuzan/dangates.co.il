---
name: local-seo-il
description: Israeli local-SEO doctrine for דן שערים חשמליים — NAP consistency across site, schema and Google עסק שלי; the 7-service × 14-location matrix and its expansion cap (four unserved locations retired on owner-actions 3.6); Hebrew ב+city grammar and the region-not-city entry (the kind/prefixed fields, built in Sprint 6); the service-area business model with no street address; the Google Business Profile the owner is now producing as the top lever; and the non-negotiable doorway-page policy measured by content-depth.mjs. Use when populating locations or services for local ranking, or auditing local visibility. Triggers: "local SEO", "NAP", "city pages", "Google עסק שלי", "doorway pages", "areaServed", "add a city", "דפי ערים", "קידום מקומי".
---

# Local SEO — Israel

A **service-area business with no street address**, publishing 14 location pages (13 cities and
אזור השרון; 18 until `7ed1acd` retired the four the owner does not serve, owner-actions 3.6). Everything below
follows from that asymmetry.

## Proof — measure first

```bash
node scripts/audit/content-depth.mjs   # word floors + the doorway delta per location/service
node scripts/audit/links.mjs           # chrome reach (notInChrome), orphans
node scripts/audit/schema.mjs          # Service/areaServed + FAQPage per location page
```

As of 2026-11-09 (at `2b0d802`) every location page clears the measured proxy: 714–1118 unique
words against a 350 floor and a doorway delta of 292–439 against 120 (`locationMedianDelta 343`,
14 pages); the 7 services pass since Sprint 5 (`225ff45`). Before Sprint 6 (`7c3f2db`) the
locations scored a delta of 2–3 on 122–145 words — one template with the city name swapped. What is
left was the human half of the test — the local-seo-strategist sign-off, on record since the
2026-11-09 full audit (public knowledge only; the first-hand layer is §7.5); the five 🔶
entries were resolved by the owner's 3.6 answer (§4). Quote the script, not this paragraph.

## 1. NAP consistency

The name, address and phone must be **byte-identical** everywhere they appear: the site, the
JSON-LD, the Google Business Profile and every Israeli citation (`docs/gbp-runbook.md` §0 holds the
canonical strings — copy, never retype).

- **There is no address anywhere** — not in the manifest, the schema, or `/צור-קשר/`. That is
  consistent and correct for a service-area business. **Do not add one to "improve local SEO."** An
  invented or borrowed address is a profile-suspension risk, not a ranking tactic (backlog §4.11, §5.6).
- The footer shows `serviceAreaLine` ("מרכז הארץ והאזורים שמופיעים באתר", `lib/content.ts`) and the
  phone. It replaced `siteConfig.serviceArea` — the manifest phrase `מרכז הארץ ופריסה ארצית` — in
  `1796ee7`. For an address-less business that is the right NAP surface.
- The phone is `072-2587772` with `contact.phoneOverride: true` — the one fleet site that does not
  use the shared `055-6601006`. Never "correct" it.

If the business does operate from a real, staffed, visitable address, that is a
`docs/business-facts.md` §B question to escalate — not something to fill in from a guess.

## 2. Google עסק שלי — the top lever, now in progress

`schema.sameAs` is `[]` and `siteConfig.social` is three empty strings — **no GBP link exists on the
site today** (backlog §5.1). For a local trade business the profile outranks almost everything on-page:
it drives the map pack, it is where reviews live, and it is the entity anchor that makes `sameAs`
meaningful.

The owner has committed to producing it (`docs/owner-actions.md` §2.1, status ⏳). Until the public
URL arrives nothing changes on the site. When it does:

1. Set up per `docs/gbp-runbook.md` — service-area business, no address shown, categories §3, the 7
   services with the site's canonical URLs §4, hours §5, Q&A seeded from the homepage FAQ verbatim §9.
2. Put the profile URL in the **roster manifest** `schema.sameAs`, then sync; `siteConfig.social`
   should read from `manifest.schema.sameAs` instead of holding empty literals.
3. Reviews come back **verbatim only**, via `reviews` + `REVIEW_SOURCE_URL` in `lib/content.ts`
   (gbp-runbook §11, business-facts §A). The fabricated set that shipped until 2026-08-17 is gone
   and the component guard stays — never author review text to fill the section.
4. Israeli citations (דפי זהב, זאפ, B144, מידרג) with the §0 NAP strings — gbp-runbook §12.

## 3. Hebrew grammar per location

`locations` mixes cities with **regions** — one since `7ed1acd`, שרון (קריות, צפון and דרום were
retired on owner-actions 3.6). Until Sprint 6 templates
interpolated a bare `ב${loc.name}`, producing `בשרון` and `בצפון` where the correct Hebrew is
`באזור השרון` and `בצפון הארץ` (backlog §5.2 ✅, content-standards §8). Every entry in
`lib/site-config.ts` now carries the two fields (since `7c3f2db`, 2026-11-09):

```ts
{ slug: "שרון", name: "אזור השרון", kind: "region", prefixed: "באזור השרון", updated: "2026-11-09" }
{ slug: "תל-אביב", name: "תל אביב", kind: "city", prefixed: "בתל אביב", updated: "2026-11-09" }
```

`prefixed` carries the preposition so no template guesses — the shared builders in
`lib/content.ts` and every `content/locations/*.ts` module use it; `kind` drives the schema type —
`City` versus `AdministrativeArea` (schema-graph §5, `placeNode` in `lib/jsonld.ts`); `updated` is
the page's own sitemap `<lastmod>`. Never patch a string by hand where `prefixed` exists.

## 4. The doorway policy — non-negotiable

> Take the page. Replace the city name with a different city name. Is it now a correct, publishable
> page for that other city?
>
> **If yes, it is a doorway page and must not ship.**

Until Sprint 6 all 18 then published failed: `app/locations/[city]/page.tsx` interpolated `loc.name` into one
shared template and added nothing else. Since `7c3f2db` (2026-11-09) each page renders its own
`content/locations/<slug>.ts` module through `cityContent` (`lib/city-content.ts`, `/new-city`) and
passes the measured proxy (backlog §3.1, §5.3 ✅ — 14 of 14 since `7ed1acd`; the sign-off is not on
record). It
stays the highest-risk item on the site — doorway clusters are an explicit Google spam policy, and
the penalty lands on the domain, not the page — so every edit is re-measured and re-reviewed.

To pass, a location page needs **three or more** true, specific items: named neighbourhoods or
industrial zones; the local gate reality (villa neighbourhoods with wide sliding gates, apartment
blocks with shared parking barriers, moshav plots with long driveways); a real local job reference;
travel and same-day reality for that distance; a city-specific FAQ; local pricing if it differs. Full
spec: `docs/content-standards.md` §2–§3. The measurable half is the doorway delta in
`content-depth.mjs` (≥ 120 tokens the nearest sibling lacks) — necessary, not sufficient.

**If none of those can be said truthfully about a city, that city does not warrant a page — and a
place the business does not serve never gets one.** Until 2026-11-09 קריות, שרון, צפון, דרום and
באר שבע shipped as bounded geography-and-mechanism pages waiting on owner-actions 3.6. The owner
answered that day: קריות, צפון, דרום and באר שבע are not served — `7ed1acd` retired their pages,
each with a 301 to `/איזורי-שירות/` (and their `Service` nodes with them); חיפה, אשקלון and שרון are
served. The answer named no town inside the Sharon and did not name ירושלים, so those pages keep the
bound ("check by phone whether and when a visit is possible"); travel and scheduling reality stays
unwritten everywhere until owner-actions 3.5 is answered.

## 5. The expansion cap

7 services × 14 locations = 98 possible cells. **Do not build them.** Order of operations:

1. All 14 existing location pages pass the doorway test.
2. Each earns its depth per content-standards §3.
3. Only then consider a service × location second tier, and only for services with genuine local
   demand — `תיקון שער נגרר בתל אביב`, not `שער זרוע ביבנה` — with evidence from
   `keyword-research` (a row in keyword-map §13 with a source URL, never an invented volume).

No 15th location until step 1 is done — the measured half is (2026-11-09) and owner-actions 3.6 is
answered; the local-seo-strategist sign-off is on record (2026-11-09 full audit), but 0 of 14 pages
carry a first-hand element and ירושלים is unanswered (owner-actions 3.11). Never re-add one of the four retired
places unless the owner reverses that answer. Scaling a doorway pattern multiplies risk, not reach.

## 6. Coverage honesty

An `areaServed` the business cannot actually service is a liability: it produces leads it can't
serve and a claim it can't defend. Until 2026-11-09 the manifest `schema.areaServed` said `מרכז הארץ
ופריסה ארצית` and the location set ran from קריות and צפון to דרום and באר שבע. The owner answered
owner-actions 3.6 that day — no national coverage; קריות, צפון, דרום and באר שבע not served — so the
roster sync `8e8843d` (B5) set `areaServed` to "מרכז הארץ והאזורים שמופיעים באתר" (`grep -rl
'פריסה ארצית' out/_next/static | wc -l` → 0) and `7ed1acd` retired the four pages. חיפה and אשקלון
stay, served though outside המרכז. Emergency 24/7 availability has the same exposure and is still 🔶
in `docs/business-facts.md` §E (owner-actions 3.5, backlog §5.4). The site writes around it: the
JSON-LD `areaServed` is the 14 published locations, and the copy carries neither phrase (`1796ee7`
— `claims-grep.mjs` `national-coverage 0`, `around-the-clock 0` live). `claims-grep.mjs` fails either
in new copy; the roster `shortPitch` stopped repeating "פריסה ארצית" and 24/7 in `ad2f1ab`.

## 7. Schema for a service-area business

Every location page emits, in one `@graph` (since Sprint 2, `d8edb28`; the FAQ since Sprint 6,
`7c3f2db`): the business node, one `Service` with `provider: {"@id": "…#business"}`, a
percent-escaped `url` and `areaServed` typed from `kind` — `City` on the 13 cities,
`AdministrativeArea` on שרון — built by `locationServiceJsonLd` in `lib/jsonld.ts` (the
kit's `serviceJsonLd` has no per-location `areaServed`), a `FAQPage` from the city's `faqs`, and the
breadcrumb. The business node's `areaServed` is the list of the 14 published places, not the
marketing phrase (backlog §4.2, §4.8 ✅; `schema.mjs` → 0 failures, `faqPages 26`, 2026-11-09).

**Never** a fake `PostalAddress`, never `GeoCoordinates` around an invented midpoint, and **never a
`LocalBusiness` node per city** — one business, one node. See `/schema-structured-data`.

## 8. Internal equity

Since `7c3f2db` (2026-11-09) the footer renders every location — 14 since `7ed1acd` (`links.mjs` →
`notInChrome 0`, `chromeLinks 31`,
backlog §9.2 ✅), and the mesh runs both ways (§9.3 ✅): each service page links the cities its
`ServiceDepth.locations` declares (Sprint 5), and each location page links its neighbours from
`lib/nearby.ts` and the services that fit it. Since `fd72698` (2026-11-09, §9.1 ✅, Sprint 6.5) the
header reaches the 7 services and 14 locations in one hop as well — `/internal-linking`.

## Checklist

- [ ] No street address invented anywhere; NAP renders from the manifest; gbp-runbook §0 strings match.
- [ ] The region entry reads `באזור השרון` in copy, from `prefixed` (built since `7c3f2db`), never patched.
- [ ] `content-depth.mjs`: every location clears the 350 floor **and** the 120-token doorway delta.
- [ ] `schema.mjs`: every location emits `Service` + `areaServed` of the right type (✅ since `d8edb28` — keep it).
- [ ] `sameAs` populated from the roster once the GBP URL lands; until then the 🔶 row stands.
- [ ] `links.mjs`: `notInChrome` = 0 for locations.

## Gotchas

- **Never** a `LocalBusiness` node per city. One business, one node.
- Never invent a street address, review, rating, coordinate or coverage claim to fill a checkbox.
- Never rename `/איזורי-שירות/` without a 301 — it holds live ranking signal (golden rule 3).
- A page that passes the numeric delta with padded filler still fails the human test;
  `local-seo-strategist` and `claims-verifier` review every new city page before it ships.
