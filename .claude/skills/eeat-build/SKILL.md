---
name: eeat-build
description: Build E-E-A-T for דן שערים חשמליים without a named person, licence, insurance, founding year, warranty term or real prices (all ❌ per the owner intake) — the ת״י 900 חלק 21.03 safety standard as the anchor, mechanism depth per gate type and component, honest 230V boundaries, the one sourced price band, an empty lib/authors.ts with a data-only path, /אודות/ to the 500-word floor with AboutPage + knowsAbout, logo/image on #business, sameAs from the roster only, the trustStats/differentiators rewrite that retired the four unbacked claims and the footer-hours-vs-24/7 fix (both done in Sprint 4, 1796ee7) — every step gated on a docs/business-facts.md row and signed off by claims-verifier. Use when softening claims, rewriting the about page, adding authorship or trust schema, or when a name, licence, GBP or photos finally arrive. Triggers: "E-E-A-T", "EEAT build", "trust signals", "soften the claims", "אחריות מלאה", "ניסיון רב שנים", "about page", "אודות", "authors registry", "knowsAbout", "אמינות".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# E-E-A-T without a named person

Phase 6 of the roadmap (`docs/growth-roadmap.md` §2, backlog §7). The owner said on 2026-08-17 that
the warranty term, licence, insurance, founding year, real prices and any named person are **not
coming** (`docs/business-facts.md` intake, `docs/owner-actions.md` §3.1–3.4). This skill builds
authority from what the site can prove and removes what it cannot. Writers: `hebrew-copywriter`
(copy), `rtl-frontend-engineer` (`lib/authors.ts`, About schema). Reviewers: `claims-verifier` on
every diff, `eeat-trust-auditor` for the sweep. The writer never reviews itself.

## Baseline — re-measure first

```bash
node scripts/audit/claims-grep.mjs --json     # the lexicon (scripts/audit/claims.json) vs source and out/
node scripts/audit/schema.mjs --json          # Person author, image/logo, dangling #business
node scripts/audit/content-depth.mjs --json   # /אודות/ against the 500-word floor (thresholds.json "about")
```

As of 2026-11-09 `claims-grep` passes: `failingClaims 0`, every `liveOccurrences` value 0,
`totalHits 1` (the gated `rating` row in `Reviews.tsx`, 0 live). Sprint 4 (`1796ee7`) took it there
from 5 failing claims on 2026-08-24 — `warranty-full` 77 live on 41 pages, `around-the-clock` 75 on
42, `experience` 9 on 3, `national-coverage` 7 on 4, two `superlative` hits in the posts. Keep every
bucket at 0. Since `8768ce2` (2026-11-09) the lexicon has 18 ids (`claimsChecked 18`):
`workmanship-absolute` (4F, `9195c9b`) catches "ללא פשרות", "בלי פשרות", "מצוינות בכל" and
"למצוינות", and `quote-before-work`, `no-obligation`, `durability-promise` and `price-list-pointer`
catch the pricing-policy, no-obligation, durability and "full price list" lines the 2026-11-09 audit
found (H2, M1, M2). It still has no pattern for team claims
("צוות מומחים") or for other absolute promises (like the "שום חלק לא מוחלף…" line 4F took off `/`)
— those are `claims-verifier` judgment. The numbers move; the script is the truth.

## What is not coming — and what is

| Fact                                      | Row               | Status  | What the site does instead                                                                                                         |
| ----------------------------------------- | ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Warranty term, scope, exclusions          | business-facts §D | ❌      | "אחריות על העבודה" — true, unquantified. Never "מלאה"; `claims.json` fails it                                                      |
| Licence, insurance, manufacturer training | §C                | ❌      | Nothing claimed. Expertise is **shown** as mechanism depth, never as a badge                                                       |
| Founding year, owner/technician name      | §B                | ❌      | No `foundingDate`, no `Person`, no byline. `lib/authors.ts` stays empty                                                            |
| Real prices                               | §D                | ❌ / 🔶 | `/מחירון/` explains "what determines the price" since `af8ba4c` (N14). `Offer` stays forbidden                                     |
| 24/7 emergency, response times            | §E                | 🔶      | Off the site since `1796ee7`; urgent faults handled within the hours (step 3)                                                      |
| "פריסה ארצית"                             | §E                | ❌      | Refuted (owner-actions 3.6, 2026-11-09); copy says `serviceAreaLine` and names the 14 areas; the manifest phrase left in `8e8843d` |
| GBP + reviews · job photos                | §A · §F           | ⏳      | Gated on `REVIEW_SOURCE_URL` (`docs/gbp-runbook.md` §11) · `/site-images`; zero `<img>` today                                      |

**Available now, and enough to build on:** the SII safety standard **ת״י 900 חלק 21.03** — guide #1
since Sprint 7 (`89439b7`), its facts read on primary sources 2026-11-08/09
(`docs/research/2026-11-08-standards-and-law.md`, which outranks keyword-map §12): scope and official
status verified; the "official since October 2006" date **refuted** and never stated; no primary
list of required devices, so no device is ever "required by the standard"; the licence grade a gate
motor needs unverified and never stated (that electrical work is licensed, חוק החשמל §6(א), is
verified); the mechanics of seven gate types and their components (מנוע, לוח פיקוד, עינית,
מסילה, גלגלים, מפסק גבול, קבל, סוללת גיבוי); the boundary between what a customer may check and what
needs a technician; the visit band **150–350 ₪** (`priceRows` → `visitFeeRange` — the one sourced number, itself
🔶 "still current?"); the real hours; the phone that is answered.

## Build steps — each names the row it depends on

**1. Retire the four unbacked claims (§7.2 · rows §B, §D, §E) — done 2026-11-08 (`1796ee7`).**
Sprint 4.1 rewrote every hit the lexicon flagged, after N13 had moved the copy out of the route files:
"אחריות מלאה" → **אחריות על העבודה** (never a term or "בכתב"); "ניסיון רב שנים" → mechanism depth
(step 2); 24/7 → the hours (step 3); "פריסה ארצית" → the published areas (step 4); both "הטובה ביותר"
superlatives and the posts' team and guarantee sentences rewritten. `claims-grep.mjs` → 0 live on
every claim. **The roster half closed 2026-11-09** (`ad2f1ab`): the `shortPitch` that carried
"שירות מהיר ואמין, אחריות מלאה וזמינות 24/7 לחירום, בפריסה ארצית" now reads only what the pages say
(diagnosis before repair, אחריות על העבודה, מרכז הארץ). No page or JSON-LD node rendered it
(`businessNode` uses the tagline as `description`), but the synced manifest is bundled into a client
JS chunk, so it shipped under `out/_next/static/` — `grep -rl 'אחריות מלאה\|24/7' out/_next/static`
→ 0 now. That was a **roster** edit (`Israeli services sites/roster/sites/dangates.json`), then sync
— never the synced file (golden rule 2, hook-blocked); the same path handles `schema.areaServed`
(step 4). New copy goes in `lib/content.ts` (golden rule 6), so each claim stays one edit.

**2. Rewrite `trustStats` and `differentiators` as things a customer can see (§B, §D) — done in
`1796ee7`.** `trustStats` (typed `readonly TrustStat[]`, 4 items for `TrustBar`'s `<dl>`) states
what the data proves — the service count from `publishedCounts`, the hours label from
`siteConfig.hours`, the warranty only as "אחריות על העבודה", no count of areas; `differentiators` (6, `WhyUs`) lead with diagnosis before repair, scheduling
within the hours and אחריות על העבודה. The rule stays: **every item names something observable
during one visit**, or a number derived from data. 4F (`9195c9b`) retitled the over-wide
"כל סוגי השערים והמנגנונים" item "מנגנון אחר לכל סוג שער" and replaced "ציוד מתקדם" with "תיקון לפי
החלק שנכשל". Still open as `consider` (eeat-trust-auditor, change set 4A): the `Users` / `Award`
icons still carry the meaning of the removed "צוות מומחים" / "ניסיון" items.
Register: content-standards §4.

**3. Bound the hours (§7.6 · row §E "Is 24/7 emergency service real, and where?") — done in
`1796ee7`.** `siteConfig.hours.weekday` / `.friday` are built by `hoursLine()` from the manifest
`schema.openingHours`, the same rows as `openingHoursSpecification`; `hours.emergency` is gone and
its line is `contactPageCopy.emergencyLine`, which promises nothing outside the hours. Until §E is ✅
the copy promises only those hours — "מענה מהיר" without a clock is allowed, "24/7" is not. "Yes,
everywhere" → the roster gains the emergency hours and the footer shows them; "yes, in these
cities" → the wording lives on those location pages only (Phase 3 `cityContent`).
`docs/gbp-runbook.md` §5 copies the site's wording — the profile never leads.

**4. Coverage (row §E "Is פריסה ארצית true?") — done; the owner said no (owner-actions 3.6, 2026-11-09).** The footer and `/צור-קשר/` say
`serviceAreaLine` ("מרכז הארץ והאזורים שמופיעים באתר", in `lib/content.ts` since `1796ee7`) and the
copy names the published areas. Since `d8edb28` `businessNode` (`/schema-structured-data`) emits the
real places as `areaServed` — 14 since `7ed1acd` retired קריות, צפון, דרום and באר שבע. The phrase
survived in the roster `schema.areaServed` (`shortPitch` was cleared in `ad2f1ab`, step 1), shipping
once in the client bundle, until the roster sync `8e8843d` (B5) set it to "מרכז הארץ והאזורים
שמופיעים באתר": `grep -rl 'פריסה ארצית' out/_next/static | wc -l` → 0 as of 2026-11-09.

**5. `lib/authors.ts` — an empty registry with a data-only path (§7.4 · row §B).** Copy
`c:/Users/robiu/antigravity/Projects/galbath.co.il/lib/authors.ts` and retarget its header: brand
name is not an author (never put "דן שערים חשמליים" in it — the business is already `publisher` →
`#business`), the row is business-facts §B, the consumer is `articleJsonLd` in `lib/jsonld.ts`.
**Done 2026-11-08** (`d8edb28`, §7.4): `lib/authors.ts` exists with exactly this shape and an empty
array. The shape:

```ts
export interface Author {
  name: string;
  jobTitle?: string;
  bio?: string;
  photo?: string;
}
/** Keyed by `authorId`. EMPTY BY DESIGN — read the header before adding to it. */
export const authors: Record<string, Author> = {};
export function authorById(id: string | undefined): Author | undefined {
  return id ? authors[id] : undefined;
}
```

`scripts/audit/schema.mjs:66-70` reads this file: an export initialised to `{}` or `[]` keeps the
`authors` gate closed, and `:172-179` then fails any `Person` author in `out/`. An `Organization`
author is tolerated — `app/blog/[slug]/page.tsx` emits one today; Phase 2's `articleJsonLd` omits
the key entirely. Either passes; inventing a byline does not. Articles stay attributed to the
organisation (§7.4): no "מאת" line, no byline component — `date` / `updated` carry the freshness
signal (`/aeo-answer-content`).

**6. `/אודות/` to the 500-word floor with `AboutPage` + `knowsAbout` (§B, §C, §D).** `content-depth.mjs`
measures 317 unique words against 500 as of 2026-11-09, after 4F (`thresholds.json`
`"about": 500`; 277 on 2026-08-24, 307 before 4F). Its copy lives in `lib/content.ts` since N13 (`aboutMetaDescription`, `aboutIntro`) and
carries none of the four claims since `1796ee7`. The rewrite (Sprint 6.8) goes into `aboutSections` /
`aboutValues` and an About-specific answer block, in this order:

1. Question-form H2 + a 40–60-word answer (content-standards §5): who we are, what we repair and
   install, where, how a visit works — no years, no team size.
2. **What a visit involves** — diagnosis by mechanism (מנוע, לוח פיקוד, עינית, מסילה, גלגלים, שלט), the
   price stated before the work, the end-to-end test. This is the "ניסיון" paragraph, shown.
3. **The seven gate types**, linked to their service pages (`services` from `lib/site-config.ts`).
4. **Honest boundaries — the 230V line.** What a customer may check (power to the motor, the remote
   battery, an obstruction in the track, a dirty עינית lens) and what they must not open (motor
   housing, control board, anything at 230V). Boundaries are the strongest trust signal a trade with
   no credential to show can offer.
5. **The standard** — ת״י 900 חלק 21.03: what it covers and its official status, the SII page cited
   inline — never "what a compliant gate must have" (no primary list exists; research §A). SII's own
   statements (the ₪800,000 award, the criminal-offence line) only attributed to SII with that URL
   beside them; the deaths and injuries are headlines SII quotes, never findings. Link the safety
   guide `/מדריכים/תקן-900-שער-חשמלי/` (built in Sprint 7, `89439b7`).
6. Areas (the 14, linked), hours as they are, the visit band 150–350 ₪ as an estimate to confirm.

Schema: `pageNode(m, "AboutPage", …)` + `businessNode(m)` (which carries `knowsAbout` — the gate
types and the standard, **standards, never credentials**) in one `@graph`, via `/schema-structured-data`.
No `Person`, no `founder`, no `employee`. `schema-auditor` checks it.

**7. `logo` + `image` on `#business` (backlog §4.5 ✅ 2026-11-08, `02a3144`).** `businessNode` passes
`logo: "/dangates-logo.png"` and `image` = the manifest OG card (`ogImageMeta(m.images)?.[0]?.url`);
`schema.mjs` no longer warns. The header is still text (the home `<Link>` in
`components/layout/Header.tsx`). The header `<img>` with a Hebrew `alt` is the first `/site-images` task.

**8. `sameAs` — roster only (row §A ⏳).** Empty today (`site.config.json:45`). When the GBP URL
arrives it goes into the roster `schema.sameAs`, then sync; the kit emits it (`index.ts:113`). Never
typed into `site.config.json`, never a directory the business has not actually claimed.

## The day a fact arrives — data-only changes

| Arrives                    | Change (data only — no component work)                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| A named person             | one `authors` entry + `authorId` on the pieces they wrote; §B ✅ with permission noted; `schema.mjs` then allows `Person`        |
| Licence / insurance        | a `credentials` export in `lib/content.ts` (add it then) + §C ✅; one sentence on the About page, not a badge wall               |
| Warranty term · 24/7       | §D / §E ✅; the term or the hours stated where the claim lives, bounded to the confirmed scope or areas                          |
| GBP URL + reviews · photos | `docs/gbp-runbook.md` §11 (verbatim `reviews`, `REVIEW_SOURCE_URL`, roster `sameAs`) · `/site-images` (city · gate type · month) |

`claims-grep.mjs` reads the lexicon's `status`, not the ledger — a confirmed row means editing
`scripts/audit/claims.json` in the same commit as the copy, and saying so in the backlog row.

## Proof and hand-off

Rebuild, then `node scripts/audit/claims-grep.mjs` (exit 0 — no unconfirmed phrase live) ·
`node scripts/audit/schema.mjs` (no `Person`, `Review`, `Offer`, `foundingDate`; `image` + `logo`
present) · `node scripts/audit/content-depth.mjs` (`/אודות/` ≥ 500) · `npm run gate` (judged on
regressions vs the `/qa-build-gate` baseline). Copy → `hebrew-editor` → `claims-verifier` (a live
🔶/⛔ claim is stop-ship); markup → `ts-react-reviewer`; schema → `schema-auditor`; then
`eeat-trust-auditor` re-runs the sweep in the `docs/audits/` row format. Backlog §7.2, §7.4 and §7.6
closed that way (2026-11-08); what this skill still closes is the `/אודות/` floor (§3.13) and the
rows that move when a fact arrives.

## Checklist

- [ ] `claims-grep.mjs` → 0 failures; `licence` / `insurance` / `founded` / `named-person` still 0.
- [x] Roster `shortPitch` softened and synced; `site.config.json` untouched by hand (`ad2f1ab`).
- [x] Roster `schema.areaServed` bounded on the owner's 3.6 answer (B5 — step 4, `8e8843d`).
- [x] `trustStats` (4) and `differentiators` (6) name observable things; no copy left in JSX (`1796ee7`).
- [x] Footer hours and every CTA agree; `hours.emergency` gone (`1796ee7`) — a 24/7 line only once §E is ✅.
- [ ] `lib/authors.ts` exists, empty, header intact; `schema.mjs` reports the gate closed.
- [ ] `/אודות/` ≥ 500 words, answer block first, boundaries section, standard cited with the SII URL;
      `AboutPage` + `businessNode` with `knowsAbout`, `logo`, `image`; no `Person`.
- [ ] Every softened claim's business-facts row cited in the backlog note.

## Gotchas

- **"אחריות בכתב", "אחריות מורחבת", "אחריות יצרן"** are the same fabrication with a different adjective.
  Only "אחריות על העבודה" until §D says otherwise.
- **Mechanism depth is not jargon depth.** Buyer vocabulary per keyword-map §2: עינית not חיישן, לוח
  פיקוד not לוח בקרה, מחסום beside שער זרוע.
- `claims-grep` downgrades a hit whose line carries `🔶` or `confirm` to a warning — that is for a
  placeholder awaiting the owner, never a way to ship the claim.
- The Reviews guard (`reviews` and `REVIEW_SOURCE_URL` in `lib/content.ts`; `Reviews.tsx`) is golden rule 1 made mechanical —
  ten authored review texts under real names shipped until 2026-08-17. Do not work around it.
