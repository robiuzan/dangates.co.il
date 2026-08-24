---
name: new-service
description: Add or deepen a service page the data-driven way — append to services in lib/site-config.ts, add the serviceMeta entry plus a serviceDepth entry in lib/content.ts (answer, involves, per-service triggers replacing the shared array, caveats, FAQs, relatedServices, locations), so the route, the services grid, cross-links, schema and the sitemap update automatically. Proof is scripts/audit/content-depth.mjs (450-word floor, doorway delta ≥ 120). Use when retrofitting one of the 7 thin service pages or, only after they pass, adding an eighth. Triggers: "add a service", "new service page", "deepen the service copy", "per-service FAQ", "service page is thin", "עמוד שירות", "שאלות נפוצות לשירות".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Add or deepen a service page

**All 7 service pages are near-identical.** Measure before quoting:

```bash
node scripts/audit/content-depth.mjs          # floors, doorway delta, answer-block proxy, shared blocks
```

As of 2026-08-23 each carries **151–155 unique words** inside `<main>` against the **450** floor and
a doorway delta of **13–23 tokens** against the **120** threshold (backlog §3.2). The unique text on a
service page is one `serviceMeta.description` paragraph; the trigger list, process steps, CTA card and
related grid are byte-identical across all seven, and the script subtracts every paragraph rendered
verbatim on ≥ 3 routes. Deepening the seven that exist matters far more than adding an eighth.

The worst single defect: `app/services/[service]/page.tsx:43-48` declares a module-scope `triggers`
array — four "מתי כדאי לפנות אלינו" bullets rendered on **every** service page, so `השער נתקע, לא נסגר`
appears on `/services/תריסי-גלילה-חשמליים/`, which is not a gate at all (backlog §3.3). Phase 1 moves
it into `lib/content.ts` as a per-service field; Phase 3 gives it real per-service content.

## The data model — the Phase-3 target

**None of the depth model exists yet.** Today `services` entries are `{ slug, name, updated }`
(`lib/site-config.ts:65-73`) and `serviceMeta` is `{ tagline, description, icon }`
(`lib/content.ts:26`). `/improve §3.2` builds `serviceDepth`; until then **this skill is the spec**.

```ts
// lib/site-config.ts — exists
export const services = [
  { slug: "שערים-נגררים", name: "שערים נגררים", updated: "2026-07-13" },
] as const;
```

`updated` is the page's sitemap `<lastmod>` — bump it for real copy edits only, never for styling or
metadata work.

```ts
// lib/content.ts — target
export interface ServiceDepth {
  answer: string; // 40–60 words: what this service is, for whom (content-standards §5)
  involves: string[]; // concretely: motor/drive fit, weight and width, duration, included / excluded
  triggers: string[]; // PER SERVICE — replaces the shared array at app/services/[service]/page.tsx:43-48
  caveats: string[]; // when this gate type is the wrong answer; what shortens motor life
  faqs: { q: string; a: string }[]; // 3–5, service-specific → FAQPage; each Q/A on exactly one page sitewide
  relatedServices: readonly ServiceSlug[]; // by relevance — replaces .slice(0, 4) at :54
  locations: readonly LocationSlug[]; // 4–6 cities this service is genuinely asked for (content-standards §3)
}
export const serviceDepth: Record<ServiceSlug, ServiceDepth> = { … }; // total Record — a missing service fails typecheck
```

`icon` on `serviceMeta` must be an `IconName` union member — `ServicesGrid` keys on it and
`noUncheckedIndexedAccess` surfaces a miss at compile time.

## The depth bar

450 unique words (content-standards §1), and the doorway test applies with the service name swapped:
**does the page still read correctly?** Today the answer is yes for all seven — they are templates,
not pages. What creates depth (and what a competitor's page usually lacks):

- **Mechanism and fit** — which motor and drive suit this gate type, at what weight and width, on
  what slope. A נגרר and a כנף fail for different reasons; say so. Buyer vocabulary: עינית, לוח פיקוד,
  מחסום (keyword-map §2).
- **What's included and excluded** — the most-asked pre-purchase question.
- **Failure modes** — what goes wrong on _this_ gate type, what causes it, what determines the fix
  cost (the driver, never a new number — business-facts §D).
- **Who this isn't for** — counter-intuitive honesty is disproportionately citable and trusted.
- **Aftercare** — lubrication intervals, עינית cleaning, what shortens motor life.

`תריסי-גלילה-חשמליים` needs genuinely different copy, not a gate page with the noun swapped.
`שערים-לחניה`, `שערים-לדירה` and `שער-זרוע` overlap heavily and need differentiating, not company.

## Steps

1. **Cap** — no eighth service until the seven pass `content-depth.mjs`. For a new one, append to
   `services` (flagship-first; the array drives grid order) **and** add a `priceRows` row
   (`lib/content.ts:157`) or `/מחירון/` silently omits it.
2. **`serviceMeta`** — `tagline`, `description` (120–160 chars; it is also the meta description —
   backlog §2.4), a valid `icon`.
3. **`serviceDepth`** — the entry above. `triggers` **must** be specific to this service; that is the
   fix for the shared-array bug.
4. **FAQs** — 3–5 service-specific Q/As. They become a `FAQPage` (`/schema-structured-data`);
   `schema.mjs` fails a Q/A that appears on two pages or whose question is not visible on the page,
   so never copy a homepage FAQ here.
5. **Route** — `app/services/[service]/page.tsx` renders from `serviceDepth`, in order: answer block
   under the H1 → involves → triggers → process (`processSteps` plus at least one service-specific
   step or caveat) → price interpolated from `priceRows`, never restated as a literal → FAQ →
   `relatedServices` → `locations` → CTA (content-standards §3). Delete the module-scope `triggers`
   and the `.slice(0, 4)` at `:54` in the same change.
6. **Links** — `relatedServices` by relevance (`תריסי-גלילה-חשמליים` relates to motor and shutter
   topics, not to whatever sits first in the array) and 4–6 `locations`; `/internal-linking` §3–§4.
7. **Metadata** — keyword-map §3: `title: card.name` (`app/services/[service]/page.tsx:38`) is
   already the bare subject; the layout template appends the brand and the doubled suffix is
   **fixed** (0 in `out/`). Keep it bare.
8. **Schema** — today: `serviceJsonLd` (kit) plus `BreadcrumbList` from `PageHeader` — two scripts,
   a `Service.url` in raw Hebrew and a `provider` → `#business` that is defined nowhere on the page
   (backlog §4.4, §4.7). Phase 2 replaces both with one `@graph` from `lib/jsonld.ts` and adds
   `FAQPage` from `serviceDepth.faqs`. Never add a second `BreadcrumbList`.
9. **Gate** — `npm run gate`. Proof: `content-depth.mjs` → `service.belowFloor: 0`, delta ≥ 120,
   no shared-block warning naming this page; `links.mjs` → `relatedServiceTargets` = 7 once all
   seven declare relevance; `schema.mjs`, `claims-grep.mjs` → no new failure.
10. **Hand-off** — copy to `hebrew-editor` → `claims-verifier`; markup to `ts-react-reviewer`.

## What follows automatically

`generateStaticParams` · `ServicesGrid` on `/` and `/שירותים/` · the footer service column
(`components/layout/Footer.tsx:59`) · the `LeadForm` service `<select>`
(`components/forms/LeadForm.tsx:165`) · `app/sitemap.ts` with the entry's own `updated`.

## Checklist

- [ ] `serviceMeta` complete with a valid `IconName`; description 120–160 chars.
- [ ] `serviceDepth` present; ≥ 450 unique words in `<main>`; delta ≥ 120 per `content-depth.mjs`.
- [ ] `triggers` specific to this service — the shared array at `:43-48` is gone.
- [ ] 3–5 service-specific FAQs, rendered on the page, each unique sitewide.
- [ ] Opens with a 40–60 word answer block under a question-form heading.
- [ ] Price interpolates from `priceRows`; no new number anywhere.
- [ ] `relatedServices` and `locations` declared; no `.slice(0, 4)`.
- [ ] Title is the bare name; brand appears once.
- [ ] `Service` + one `BreadcrumbList` today; `FAQPage` and a defined `#business` once Phase 2 lands.
- [ ] Present in `out/` and `out/sitemap.xml`.

## Gotchas

- Hebrew slugs arrive percent-encoded — keep the `decodeURIComponent().normalize("NFC")` matcher.
- Never invent materials, durations, warranty terms or prices. 8 of the 9 `priceRows` are authored
  estimates (the comment above `lib/content.ts:157`; business-facts §D) — do not add a tenth. Write
  _what drives the price_ (keyword-map §10).
- "אחריות מלאה", "ניסיון רב שנים", "24/7" and "פריסה ארצית" are 🔶 — `claims-grep.mjs` fails on them.
  Say `אחריות על העבודה`; replace duration claims with mechanism depth (business-facts §B, §D, §E).
- User-facing Hebrew never lives in a route file (the shared `triggers` array is the cautionary
  example). Copy goes in `lib/content.ts`; the route maps it.
- Seven services with genuine depth beat twelve that paraphrase each other.
