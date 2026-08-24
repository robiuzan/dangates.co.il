---
name: eeat-build
description: Build E-E-A-T for דן שערים חשמליים without a named person, licence, insurance, founding year, warranty term or real prices (all ❌ per the owner intake) — the ת״י 900 חלק 21.03 safety standard as the anchor, mechanism depth per gate type and component, honest 230V boundaries, the one sourced price band, an empty lib/authors.ts with a data-only path, /אודות/ to the 500-word floor with AboutPage + knowsAbout, logo/image on #business, sameAs from the roster only, the trustStats/differentiators rewrite that retires the four unbacked claims, and the footer-hours-vs-24/7 fix — every step gated on a docs/business-facts.md row and signed off by claims-verifier. Use when softening claims, rewriting the about page, adding authorship or trust schema, or when a name, licence, GBP or photos finally arrive. Triggers: "E-E-A-T", "EEAT build", "trust signals", "soften the claims", "אחריות מלאה", "ניסיון רב שנים", "about page", "אודות", "authors registry", "knowsAbout", "אמינות".
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

As of 2026-08-24 `claims-grep` exits 5: `warranty-full` ("אחריות מלאה") 13 source hits, **77 live
occurrences on 41 pages** · `around-the-clock` (24/7) 14 hits, **75 live on 42 pages** · `experience`
("ניסיון רב שנים") 9 hits, 9 live on 3 pages · `national-coverage` ("פריסה ארצית") 8 hits, 7 live on
4 pages · `superlative` ("הטובה ביותר") at `lib/posts.ts:319` and `:557`. `licence`, `insurance`,
`certification`, `founded`, `named-person` are all 0 — keep them there. `rating` is gated and holding
(0 live). The numbers move; the script is the truth.

## What is not coming — and what is

| Fact                                      | Row               | Status  | What the site does instead                                                                    |
| ----------------------------------------- | ----------------- | ------- | --------------------------------------------------------------------------------------------- |
| Warranty term, scope, exclusions          | business-facts §D | ❌      | "אחריות על העבודה" — true, unquantified. Never "מלאה"; `claims.json` fails it                 |
| Licence, insurance, manufacturer training | §C                | ❌      | Nothing claimed. Expertise is **shown** as mechanism depth, never as a badge                  |
| Founding year, owner/technician name      | §B                | ❌      | No `foundingDate`, no `Person`, no byline. `lib/authors.ts` stays empty                       |
| Real prices                               | §D                | ❌ / 🔶 | `/מחירון/` pivots to "what determines the price" (keyword-map §10). `Offer` stays forbidden   |
| 24/7 emergency, response times            | §E                | 🔶      | Bounded to what §E confirms; until then the promise comes off (step 3)                        |
| "פריסה ארצית"                             | §E                | 🔶      | Copy names the 18 real areas; the manifest phrase is a roster question (step 4)               |
| GBP + reviews · job photos                | §A · §F           | ⏳      | Gated on `REVIEW_SOURCE_URL` (`docs/gbp-runbook.md` §11) · `/site-images`; zero `<img>` today |

**Available now, and enough to build on:** the SII safety standard **ת״י 900 חלק 21.03** (keyword-map
§12 — verified on sii.org.il; the October-2006 date and the licensed-electrician requirement are
**not** and stay out); the mechanics of seven gate types and their components (מנוע, לוח פיקוד, עינית,
מסילה, גלגלים, מפסק גבול, קבל, סוללת גיבוי); the boundary between what a customer may check and what
needs a technician; the visit band **150–350 ₪** (`lib/content.ts:158` — the one sourced number, itself
🔶 "still current?"); the real hours; the phone that is answered.

## Build steps — each names the row it depends on

**1. Retire the four unbacked claims (§7.2 · rows §B, §D, §E).** The inventory from `claims-grep`:

| Claim              | Source lines (as of 2026-08-24)                                                                                                                                                                                                                                                                                                     | Replacement                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| אחריות מלאה        | `lib/content.ts:100-101` (differentiator), `:140` (process step), `:148` (trustStats), `:177` (homepage FAQ); `components/marketing/Hero.tsx:7`, `:29-30`; `FinalCta.tsx:15-16`; `ServicesGrid.tsx:34`; `app/locations/[city]/page.tsx:31`, `:43`; `app/שירותים/page.tsx:10`, `:18`; `app/אודות/page.tsx:15`; `site.config.json:12` | **אחריות על העבודה** — content-standards §4 favours it; never add a term or "בכתב" |
| 24/7 · שירות חירום | `lib/content.ts:132`, `:147`; `lib/site-config.ts:45` (rendered at `app/צור-קשר/page.tsx:86`); `Hero.tsx:7`, `:23`, `:30`; `FinalCta.tsx:16`; `ServiceAreas.tsx:13`; `app/locations/[city]/page.tsx:31`, `:43`; `app/איזורי-שירות/page.tsx:13`, `:21`; `app/צור-קשר/page.tsx:12`; `app/אודות/page.tsx:15`; `site.config.json:12`    | step 3                                                                             |
| ניסיון רב שנים     | `lib/content.ts:90-91`, `:146`, `:274`, `:294`; `Hero.tsx:23`; `app/אודות/page.tsx:15`, `:34`; `lib/posts.ts:850`                                                                                                                                                                                                                   | mechanism depth (step 2) — what the visit involves, never how long we have done it |
| פריסה ארצית        | `lib/content.ts:149`; `Hero.tsx:23`; `ServiceAreas.tsx:12`; `Footer.tsx:142`; `app/איזורי-שירות/page.tsx:13`, `:21`; `app/צור-קשר/page.tsx:12`, `:71`; `site.config.json:32` (`areaServed`)                                                                                                                                         | step 4                                                                             |
| הטובה ביותר        | `lib/posts.ts:319`, `:557`                                                                                                                                                                                                                                                                                                          | delete the superlative (content-standards §6 — never permitted)                    |

Two mechanics apply while you are in there. Copy inside JSX (`Hero.tsx:7`, `:23`, `FinalCta.tsx:15-16`,
`ServiceAreas.tsx:12-13`, the page descriptions) moves into `lib/content.ts` as it is rewritten —
golden rule 6, `rtl-frontend-engineer` wires it. And `site.config.json:12` (`shortPitch`) carries all
three claims into the business node's `description` (`site-kit/src/seo/index.ts:101`): a **roster**
edit (`Israeli services sites/roster/sites/dangates.json`), then sync — never the synced file (golden rule 2, hook-blocked).

**2. Rewrite `trustStats` and `differentiators` as things a customer can see (§B, §D).**
`lib/content.ts:145-150` feeds `TrustBar.tsx` (a 4-column `<dl>`; keep 4 items) and `:87-118` feeds
`WhyUs.tsx` (6 items). Three of the four stats are the claims above. The rule: **every item names
something observable during one visit** — diagnosis before the price, price before the work, parts
called by their real names, the test at the end — or a number derived from data (`services.length`
gate types, `locations.length` areas, `siteConfig.hours`). "צוות מומחים" (`:105-106`) is claimed with
nobody behind it (§B) — rewrite it around what the technician does, not who he is. Register:
content-standards §4.

**3. Bound the hours (§7.6 · row §E "Is 24/7 emergency service real, and where?").** The footer
(`components/layout/Footer.tsx:47-49`) shows ראשון–חמישי 08:00–18:00 and שישי 08:00–15:00 directly
under a `FinalCta` promising 24/7. Both cannot be true. Until §E is ✅ the copy promises only what
the schema's `openingHoursSpecification` states — "מענה מהיר" without a clock is fine, "24/7" is not —
and `lib/site-config.ts:45` (`hours.emergency`, rendered at `app/צור-קשר/page.tsx:86`) is deleted or
marked `// 🔶 confirm`. "Yes, everywhere" → the roster gains the emergency hours and the footer shows
them; "yes, in these cities" → the wording lives on those location pages only (Phase 3 `cityContent`).
`docs/gbp-runbook.md` §5 copies the site's wording — the profile never leads.

**4. Coverage (row §E "Is פריסה ארצית true?").** Copy names מרכז הארץ and the 18 published areas;
"פריסה ארצית" comes out of the copy and stays a roster question for `schema.areaServed`
(`site.config.json:32`). Phase 2's `businessNode` (`/schema-structured-data`) replaces `areaServed`
with the 18 real places anyway; the phrase then survives only inside `shortPitch` — step 1.

**5. `lib/authors.ts` — an empty registry with a data-only path (§7.4 · row §B).** Copy
`c:/Users/robiu/antigravity/Projects/galbath.co.il/lib/authors.ts` and retarget its header: brand
name is not an author (never put "דן שערים חשמליים" in it — the business is already `publisher` →
`#business`), the row is business-facts §B, the consumer is `articleJsonLd` in `lib/jsonld.ts`
(Phase 2). The shape:

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
author is tolerated — `app/blog/[slug]/page.tsx:88` emits one today; Phase 2's `articleJsonLd` omits
the key entirely. Either passes; inventing a byline does not. Articles stay attributed to the
organisation (§7.4): no "מאת" line, no byline component — `date` / `updated` carry the freshness
signal (`/aeo-answer-content`).

**6. `/אודות/` to the 500-word floor with `AboutPage` + `knowsAbout` (§B, §C, §D).** `content-depth.mjs`
measures ~277 unique words against 500 (`thresholds.json` `"about": 500`); its description
(`app/אודות/page.tsx:15`) carries three of the four claims and the inline paragraph at `:32-37` is
copy in JSX. The rewrite goes into `aboutSections` / `aboutValues` (`lib/content.ts:287`, `:259`) and
an About-specific answer block, in this order:

1. Question-form H2 + a 40–60-word answer (content-standards §5): who we are, what we repair and
   install, where, how a visit works — no years, no team size.
2. **What a visit involves** — diagnosis by mechanism (מנוע, לוח פיקוד, עינית, מסילה, גלגלים, שלט), the
   price stated before the work, the end-to-end test. This is the "ניסיון" paragraph, shown.
3. **The seven gate types**, linked to their service pages (`services` from `lib/site-config.ts`).
4. **Honest boundaries — the 230V line.** What a customer may check (power to the motor, the remote
   battery, an obstruction in the track, a dirty עינית lens) and what they must not open (motor
   housing, control board, anything at 230V). Boundaries are the strongest trust signal a trade with
   no credential to show can offer.
5. **The standard** — ת״י 900 חלק 21.03 as what a compliant gate must have, the SII page cited inline
   (keyword-map §12; the ₪800,000 judgment and fatalities only with that URL beside them); link the
   safety guide once `/new-guide safety` ships it (Phase 4).
6. Areas (the 18, linked), hours as they are, the visit band 150–350 ₪ as an estimate to confirm.

Schema: `pageNode(m, "AboutPage", …)` + `businessNode(m)` (which carries `knowsAbout` — the gate
types and the standard, **standards, never credentials**) in one `@graph`, via `/schema-structured-data`.
No `Person`, no `founder`, no `employee`. `schema-auditor` checks it.

**7. `logo` + `image` on `#business` (backlog §4.5).** `public/dangates-logo.png` is unreferenced and
the header is text (`components/layout/Header.tsx:23`). `businessNode` passes `logo: "/dangates-logo.png"`
and `image` = the manifest OG card (`ogImageMeta(m.images)?.[0]?.url`); `schema.mjs:217` warns while
both are missing. The header `<img>` with a Hebrew `alt` is the first `/site-images` task.

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
`eeat-trust-auditor` re-runs the sweep in the `docs/audits/` row format. Backlog §7.2, §7.4, §7.6
close with the command output quoted.

## Checklist

- [ ] `claims-grep.mjs` → 0 failures; `licence` / `insurance` / `founded` / `named-person` still 0.
- [ ] Roster `shortPitch` softened and synced; `site.config.json` untouched by hand.
- [ ] `trustStats` (4) and `differentiators` (6) name observable things; no copy left in JSX.
- [ ] Footer hours and every CTA agree; `hours.emergency` gone or 🔶 until §E is ✅.
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
- The Reviews guard (`lib/content.ts:242`, `:248`; `Reviews.tsx`) is golden rule 1 made mechanical —
  ten authored review texts under real names shipped until 2026-08-17. Do not work around it.
