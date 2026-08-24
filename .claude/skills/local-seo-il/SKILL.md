---
name: local-seo-il
description: Israeli local-SEO doctrine for דן שערים חשמליים — NAP consistency across site, schema and Google עסק שלי; the 7-service × 18-location matrix and its expansion cap; Hebrew ב+city grammar and the four region-not-city entries (the kind/prefixed fields land in Phase 3); the service-area business model with no street address; the Google Business Profile the owner is now producing as the top lever; and the non-negotiable doorway-page policy measured by content-depth.mjs. Use when populating locations or services for local ranking, or auditing local visibility. Triggers: "local SEO", "NAP", "city pages", "Google עסק שלי", "doorway pages", "areaServed", "add a city", "דפי ערים", "קידום מקומי".
---

# Local SEO — Israel

A **service-area business with no street address**, publishing 18 location pages. Everything below
follows from that asymmetry.

## Proof — measure first

```bash
node scripts/audit/content-depth.mjs   # word floors + the doorway delta per location/service
node scripts/audit/links.mjs           # chrome reach, orphans — the 6 locations not in the footer
node scripts/audit/schema.mjs          # Service/areaServed presence per location page
```

As of 2026-08-23 every location page scores a doorway delta of **2** (3 for two-word names) against
a threshold of 120, and 122–128 unique words against a 350 floor; the 7 services score 13–23. Quote
the script, not this paragraph.

## 1. NAP consistency

The name, address and phone must be **byte-identical** everywhere they appear: the site, the
JSON-LD, the Google Business Profile and every Israeli citation (`docs/gbp-runbook.md` §0 holds the
canonical strings — copy, never retype).

- **There is no address anywhere** — not in the manifest, the schema, or `/צור-קשר/`. That is
  consistent and correct for a service-area business. **Do not add one to "improve local SEO."** An
  invented or borrowed address is a profile-suspension risk, not a ranking tactic (backlog §4.11, §5.6).
- The footer shows `siteConfig.serviceArea` (`מרכז הארץ ופריסה ארצית`) and the phone. For an
  address-less business that is the right NAP surface.
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

`locations` mixes cities with **regions**: קריות, שרון, צפון, דרום. Templates interpolate a bare
`ב${loc.name}`, producing `בשרון` and `בצפון` where the correct Hebrew is `באזור השרון` and
`בצפון הארץ` (backlog §5.2, content-standards §8). The fix is two fields per entry:

```ts
{ slug: "צפון", name: "צפון", kind: "region", prefixed: "בצפון הארץ" }
{ slug: "שרון", name: "שרון", kind: "region", prefixed: "באזור השרון" }
{ slug: "תל-אביב", name: "תל אביב", kind: "city", prefixed: "בתל אביב" }
```

`prefixed` carries the preposition so no template guesses; `kind` drives the schema type — `City`
versus `AdministrativeArea` (schema-graph §5). **Neither field exists yet** — today an entry is
`{ slug, name }` only (`lib/site-config.ts:82-100`). Phase 3 builds them through `/new-city`; until
then write region copy with the correct form by hand in the per-city content, never in a template.

## 4. The doorway policy — non-negotiable

> Take the page. Replace the city name with a different city name. Is it now a correct, publishable
> page for that other city?
>
> **If yes, it is a doorway page and must not ship.**

All 18 currently fail: `app/locations/[city]/page.tsx` interpolates `loc.name` into one shared
template and adds nothing else (backlog §3.1, §5.3). This is the highest-risk item on the site —
doorway clusters are an explicit Google spam policy, and the penalty lands on the domain, not the page.

To pass, a location page needs **three or more** true, specific items: named neighbourhoods or
industrial zones; the local gate reality (villa neighbourhoods with wide sliding gates, apartment
blocks with shared parking barriers, moshav plots with long driveways); a real local job reference;
travel and same-day reality for that distance; a city-specific FAQ; local pricing if it differs. Full
spec: `docs/content-standards.md` §2–§3. The measurable half is the doorway delta in
`content-depth.mjs` (≥ 120 tokens the nearest sibling lacks) — necessary, not sufficient.

**If none of those can be said truthfully about a city, that city does not warrant a page.** Whether
קריות, שרון, צפון, דרום and באר שבע are genuinely served is an open owner question
(business-facts §E) — those five pages exist on an unconfirmed premise.

## 5. The expansion cap

7 services × 18 locations = 126 possible cells. **Do not build them.** Order of operations:

1. All 18 existing location pages pass the doorway test.
2. Each earns its depth per content-standards §3.
3. Only then consider a service × location second tier, and only for services with genuine local
   demand — `תיקון שער נגרר בתל אביב`, not `שער זרוע ביבנה` — with evidence from
   `keyword-research` (a row in keyword-map §13 with a source URL, never an invented volume).

No 19th location until step 1 is done. Scaling a doorway pattern multiplies risk, not reach.

## 6. Coverage honesty

`schema.areaServed` claims `מרכז הארץ ופריסה ארצית`, and the location set includes צפון, דרום, קריות,
באר שבע and חיפה — well outside המרכז. An `areaServed` the business cannot actually service is a
liability: it produces leads it can't serve and a claim it can't defend. Emergency 24/7 availability is
claimed sitewide and has the same exposure. Both are 🔶 in `docs/business-facts.md` §E (backlog
§5.4); `claims-grep.mjs` flags `פריסה ארצית` in new copy. Write around them until answered.

## 7. Schema for a service-area business

Location pages emit **only `BreadcrumbList`** today — no `Service`, no `areaServed` (`schema.mjs`,
backlog §4.2/§4.8). The target (schema-graph §5, Phase 2): one `Service` per location page with
`provider: {"@id": "…#business"}`, a percent-escaped `url`, and `areaServed: { "@type": "City" }`
(`AdministrativeArea` once `kind` exists), built by `locationServiceJsonLd` in `lib/jsonld.ts` —
the kit's `serviceJsonLd` has no per-location `areaServed`. The business node's `areaServed`
becomes a list of those nodes instead of a marketing phrase typed as `AdministrativeArea`.

**Never** a fake `PostalAddress`, never `GeoCoordinates` around an invented midpoint, and **never a
`LocalBusiness` node per city** — one business, one node. See `/schema-structured-data`.

## 8. Internal equity

Six of 18 location pages are absent from the sitewide chrome — `components/layout/Footer.tsx:76`
renders `locations.slice(0, 12)` (backlog §9.2; `links.mjs` names the six). No service page links to
a city and no location links to another (§9.3). Phase 3 builds the header reach, the full footer and
the `nearby`/`relatedServices` mesh — `/internal-linking`.

## Checklist

- [ ] No street address invented anywhere; NAP renders from the manifest; gbp-runbook §0 strings match.
- [ ] Every region entry reads `בצפון הארץ`-style in copy; `kind`/`prefixed` added in Phase 3, not patched.
- [ ] `content-depth.mjs`: every location clears the 350 floor **and** the 120-token doorway delta.
- [ ] `schema.mjs`: every location emits `Service` + `areaServed` of the right type (Phase 2).
- [ ] `sameAs` populated from the roster once the GBP URL lands; until then the 🔶 row stands.
- [ ] `links.mjs`: `notInChrome` = 0 for locations.

## Gotchas

- **Never** a `LocalBusiness` node per city. One business, one node.
- Never invent a street address, review, rating, coordinate or coverage claim to fill a checkbox.
- Never rename `/איזורי-שירות/` without a 301 — it holds live ranking signal (golden rule 3).
- A page that passes the numeric delta with padded filler still fails the human test;
  `local-seo-strategist` and `claims-verifier` review every new city page before it ships.
