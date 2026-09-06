# E-E-A-T & trust — the standards

> **Layer:** standards. This file decides _what a trust signal must contain before it is allowed on
> dangates.co.il_ — a review, a photo, a credential, a warranty word, a byline, a badge. The how-to is
> the `eeat-build` skill (authority without a named person) and the `site-images` skill (the photo
> pipeline); `eeat-trust-auditor` audits against this file, `claims-verifier` reviews every copy diff
> against it, `claims-grep.mjs` and `schema.mjs` measure it. Reads with:
> [business-facts.md](business-facts.md) (the ledger — the one file an agent may not fill in),
> [owner-actions.md](owner-actions.md), [content-standards.md](content-standards.md),
> [schema-graph.md](schema-graph.md), [gbp-runbook.md](gbp-runbook.md).
>
> The single rule that governs everything below: **an unsourced trust signal is worse than no trust
> signal.** Until 2026-08-17 this site shipped ten invented review texts under ten real reviewers'
> names as `Review` + `AggregateRating`, with an empty `sameAs` so nothing could check them — a Google
> policy violation and words put in named people's mouths. It is gone from the repo since 2026-08-17
> and gated (§1.3): golden rule 1 made mechanical. It was **live on the domain until the Sprint 0 deploy on 2026-09-06**; the live homepage now carries none. When in doubt, ship without the claim.

---

## 0. Current state — verified 2026-08-24

Figures are from `docs/audits/2026-08-24-full.md` (`npm run audit`, commit `82a2a73`); re-run before
quoting. They describe the repo build, which has been live since the Sprint 0 deploy on 2026-09-06 (11:06 UTC). Until then the domain served the 2026-08-03 build: ten `Review` nodes and `aggregateRating` on the live homepage, doubled brand in location titles, no `BreadcrumbList` on a live location page — all fixed in the repo, and now shipped. AI crawlers: 200 on the full-UA probe, verified 2026-09-06
(backlog §6.1 ✅ · owner-actions §1.1 ✅).

| Pillar                | Strength   | What exists                                                                                 | The binding constraint                                                                                                                                                                                                                                     |
| --------------------- | ---------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Experience**        | 🔴 none    | Nothing.                                                                                    | Zero `<img>` on 45 pages (`a11y.mjs` `imgCount: 0`). No case note, no first-person account, no job reference. Photos are ⏳ coming (business-facts §F).                                                                                                    |
| **Expertise**         | 🔴 weak    | 11 migrated posts attributed to the `Organization`.                                         | No named person, and none is coming (business-facts §B). No guide yet (`/מדריכים/` is Phase 4, [ADR 0002](decisions/0002-guides-hub-route.md)). The ת״י 900 חלק 21.03 anchor (keyword-map §12) needs no owner fact and is buildable today.                 |
| **Authoritativeness** | 🔴 none    | Nothing recorded off-site.                                                                  | No claimed profile recorded (`schema.sameAs: []`); `reviews = []`; GBP ⏳ (owner-actions §2.1). Stray WordPress-era directory listings may exist — gbp-runbook §13 finds and claims them. A visitor or an assistant has no verified path to this business. |
| **Trustworthiness**   | 🟡 partial | Real NAP (`072-2587772`, no street address — correct), HTTPS + HSTS, privacy and a11y pages | Four unconfirmed claims render **168 times on 42 of 45 pages** (§7.2); 8 of 9 prices on `/מחירון/` are authored estimates (§7.3); the footer hours contradict the 24/7 CTA in one viewport (§7.6); `/הצהרת-נגישות/` claims contrast the site fails.        |

**The honest read:** the ceiling is set by assets that do not exist, not by bad copy. Warranty term,
licence, insurance, founding year, real prices and a named person are **❌ not coming** (owner intake
2026-08-17, owner-actions §3); the Google Business Profile and real job photos **are**, and they are
the two highest-leverage items here. Everything else is written _around_ the unknowns, never over them.

---

## 1. The claim gate — mandatory before any trust copy ships

### 1.1 Status key and lexicon

`docs/business-facts.md` is the ledger: 🔶 unconfirmed (never state as fact) · ⏳ owner is supplying
it · ⛔ fabricated and shipping · ✅ confirmed · ❌ decided against. `scripts/audit/claims.json` is
that ledger made mechanical — each entry is a regex mapped to a business-facts row with a `status`:
`unconfirmed` (a 🔶 row; a live hit fails, downgraded to a warning only when **every** source hit's
line carries `🔶` or `confirm` — the script does not check that the ledger row exists;
`claims-verifier` does) · `gated` (allowed only while the named guard is set — `rating` →
`REVIEW_SOURCE_URL`) · `never` (no owner answer unlocks it — superlatives). There is no confirmed
status: the audit honours no `ok`, so a confirmed row is **removed** from `claims.json` in the same
commit as the copy (`eeat-build`, "The day a fact arrives").

### 1.2 Where the gate runs

```text
Is the claim in lib/site-config.ts, lib/content.ts, or a ✅ row of business-facts.md?
├── YES ──► ship it, worded exactly as sourced
└── NO ───► can it be softened to something demonstrably true?
             ├── YES ──► ship the softened form (§1.4), and only that
             └── NO ───► do not ship. Mark // 🔶 confirm, add the row, tell the owner.
```

- **Edit time** — `.claude/hooks/post-edit-lint.ps1` (PostToolUse) scans the text just written to
  `lib/content.ts`, `lib/posts.ts`, `lib/site-config.ts` and `content/**/*.ts` against the lexicon.
  It does **not** scan `app/**` or `components/**` — copy hardcoded in JSX (N13) goes unwarned until
  audit time.
- **Audit time** — `node scripts/audit/claims-grep.mjs` scans the copy files _and_ every route and
  component, then counts live occurrences in visible `<main>` text of `out/` (scripts stripped). A
  claim with no source hit but live text still fails; a claim that reaches the page **only through
  JSON-LD** — `shortPitch` → the business node's `description` — is unmeasured by `claims-grep.mjs`
  and by `schema.mjs`. That path is a roster edit (`eeat-build` step 1) that only `claims-verifier`
  and `schema-auditor` catch by reading the graph.
- **Review** — `claims-verifier` maps every fact in a diff to its row: OK · 🔶 mark + row · ⛔ remove.
  **A live 🔶 or ⛔ claim is stop-ship**; existing debt (§7.2) does not license one more occurrence.

### 1.3 The reviews guard — the rule made mechanical

`lib/content.ts` exports `reviews = []` and `REVIEW_SOURCE_URL = null` (`REVIEW_AVG` is derived, never
hand-set). `components/marketing/Reviews.tsx` returns `null` — no section, no schema — unless **both**
are populated. `scripts/audit/schema.mjs` fails if `Review` or `AggregateRating` appears in `out/`
while the guard is null; `claims-grep.mjs` fails any rating or review-count phrase for the same
reason. Do not remove, relax or work around any of it. The only restore path is §4.2. The guard has been live on the domain since the Sprint 0 deploy on 2026-09-06.

### 1.4 Banned and softened — the exact substitutions

| Claim as written                                 | Rule                              | Ship instead                                                                                                                                                                                                             | Row                           |
| ------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| אחריות מלאה · אחריות בכתב · אחריות ל־X שנים      | soften                            | **אחריות על העבודה** — true, unquantified. Never a term, never "מלאה", "מורחבת", "יצרן", "בכתב" (the lexicon matches only מלאה and a term; the adjectives are `claims-verifier` judgment — `eeat-build` gotchas)         | business-facts §D (❌)        |
| ניסיון רב שנים · שנות ניסיון · מאז / משנת YYYY   | soften                            | **Mechanism depth** — what the visit involves and why the part fails, never how long we have done it                                                                                                                     | §B (❌ · `foundedYear: null`) |
| רישיון · מוסמך · חשמלאי מוסמך · ביטוח · הסמכה    | unconfirmed — nothing until §C ✅ | Nothing. Expertise is shown (§3.3), not badged; a boundary ("what we do not open") beats a credential we lack. The owner said ❌                                                                                         | §C (❌)                       |
| דירוג X · X כוכבים · X ביקורות · X לקוחות מרוצים | gated                             | Only with `REVIEW_SOURCE_URL` set and verbatim reviews (§4.2)                                                                                                                                                            | §A (⏳)                       |
| המובילים · הטובים ביותר · מספר 1 · הכי טוב       | never                             | Delete. No owner answer unlocks a superlative                                                                                                                                                                            | content-standards §6          |
| הבעלים X · המייסד X · הטכנאי שלנו X              | unconfirmed — nothing until §B ✅ | No byline, no `Person`. `Organization` as author                                                                                                                                                                         | §B (❌)                       |
| זמינות 24/7 · מסביב לשעון · תוך שעה · באותו היום | bound or remove                   | Only `siteConfig.hours.weekday` / `.friday` and the manifest `openingHoursSpecification`; `hours.emergency` is itself the 🔶 string and goes, or is marked, per `eeat-build` step 3. "מענה מהיר" without a clock is fine | §E (🔶)                       |
| פריסה ארצית · בכל הארץ                           | bound or remove                   | Name מרכז הארץ and the 18 published areas; the manifest `areaServed` phrase is a roster question                                                                                                                         | §E (🔶)                       |
| A price stated as a fact                         | blocked                           | The 150–350 ₪ visit band — sourced from the live-site FAQ (`priceRows`), currency 🔶 (§D) — and no other number; everything else as _what drives the price_ (§5.1 pricing row · N14)                                     | §D (❌ / 🔶)                  |

---

## 2. Experience — the pillar that starts from zero

### 2.1 The photo policy is preventive

No photograph exists to audit yet — the moment to fix the rule. When the batch lands (owner-actions §4.1, business-facts §F):

| Requirement | Standard                                                                                                                                                                                                                                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provenance  | A real photograph of work this business performed. **Never stock. Never AI-generated. Never a competitor's or a manufacturer's image presented as ours.** An illustrative image, if ever used, says so in its caption and never sits on a location page. Permission recorded for any identifiable person or recognisable property. |
| Metadata    | Per photo: **city · gate type · month.** Without all three it is decoration — gallery only, no evidence claim. Month, never a date that implies a record we do not keep.                                                                                                                                                           |
| `alt`       | Hebrew, descriptive, names the gate type and the place: «שער נגרר חשמלי אחרי החלפת מנוע, פתח תקווה». Decorative → the `decorative` prop (`SiteImage` refuses `alt=""` at compile time). `a11y.mjs` fails a missing `alt`.                                                                                                          |
| Dimensions  | `width` and `height` always — the static export has no resizer, so intrinsic size is the CLS reserve. `perf.mjs` warns on an unsized image.                                                                                                                                                                                        |
| Pipeline    | Media Studio catalog → `ops/sync-media.ps1` → `manifest.images` → `SiteImage` from `@ishub/site-kit` → Cloudflare Image Transformations (on, owner-actions §1.4). Never a raw `<img>`, never `next/image`. Originals landscape, ≥ 1600 px, no watermark.                                                                           |

### 2.2 The before/after pair — the conversion format for this trade

Same position, angle, framing and time of day; no wide-angle on the "after" only; no staging the
"before" worse than it was. Hebrew caption labelled לפני / אחרי with the same city · gate type · month
the `alt` carries. An `ImageObject` (`contentUrl`, `width`, `height`, Hebrew `caption`) on the page's
own node — the `Service` or the guide's article node (the `site-images` skill; the article node per
schema-graph §6) — never one generic photo on 18 location nodes.

### 2.3 Case notes — one true sentence per job

The cheapest Experience artifact; it needs only the owner's job log (growth-roadmap §6). The format
is fixed: **city · gate type · fault · outcome** — «[עיר], [סוג שער], [תקלה], [תוצאה]» (growth-roadmap
§6 shows the shape with an illustration, not a record).

- **No price** — prices are ❌ (§5.1 pricing row · N14); a case note that names one becomes an
  authored price.
- **No customer name, street or house**; permission on record before it ships (content-standards §2).
- **No adjectives, no invented job, ever** — a fabricated case note is the removed reviews in a
  different shape; the value of a real one is that it is checkable.

Case notes and dated photos are the evidence a location page needs to pass the doorway test
(content-standards §2 — three true local items, delta ≥ 120, `content-depth.mjs`). They land in the
per-city data (`cityContent`, Phase 3, `new-city`), never in JSX; the `photoEvidence` shape the
`site-images` skill describes does not exist yet — do not improvise it.

---

## 3. Expertise — without a human on the site

### 3.1 The absent-author rule

No person is named anywhere, and none is coming (business-facts §B, owner-actions §3.3). So every
`BlogPosting` / `Article` carries the **`Organization` as author** (or omits `author`) — never a
`Person`, never "צוות" as a pseudo-person, never a first name; no byline, no "מאת" line, no author box,
no stock team grid. `lib/authors.ts` is **planned, not built** (Phase 6, backlog §7.4): an empty
registry with a data-only path. `schema.mjs` already reads it — absent or empty keeps the gate closed
and fails any `Person` author in `out/`. Omitting a signal is legitimate; inventing one is not.

### 3.2 What an author entity needs the day someone is named

| Field                     | Requirement                                                                      | Lands in                                       |
| ------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------- |
| Real full name            | The person who does or supervises the work, with written permission to be named  | business-facts §B → `lib/authors.ts` entry     |
| Role                      | Specific — what they do on site, not "מומחה"                                     | `jobTitle`                                     |
| Photo                     | A real photograph of that person, with permission (owner-actions §4.3)           | `photo`, through the `site-images` pipeline    |
| `sameAs` · years in trade | Only profiles that exist; a start year only if §B confirms it — otherwise absent | the roster manifest · never in copy until then |

### 3.3 Expertise shown, not claimed

1. **The safety standard** — ת״י 900 חלק 21.03, verified on sii.org.il (keyword-map §12). The
   fatality record, the 800,000 ₪ judgment and the criminal-offence framing are citable **only with
   the SII URL inline**; the October 2006 date and "a licensed electrician is legally required" are
   unverified and stay out. Needs nothing from the owner.
2. **Mechanism depth per gate type and component** — why an עינית fails, what a לוח פיקוד does, when
   a מנוע is reusable, what salt air does to a track. Buyer vocabulary per keyword-map §2 (עינית not
   חיישן, לוח פיקוד not לוח בקרה). This is what replaces "ניסיון רב שנים".
3. **Honest 230V boundaries** — what a homeowner may check (power to the motor, the remote battery,
   an obstruction in the track, a dirty עינית lens) and what they must not open (the motor housing,
   the control board, anything at 230V). A boundary, not a licence claim.
4. **"When to call" per service** — the shared four bullets that put "השער נתקע" on the
   rolling-shutters page (backlog §3.3) are the opposite of expertise; per-service triggers live in
   `serviceDepth` (Phase 3, `new-service`).

### 3.4 Editorial freshness

`updated` on `services`, `locationsUpdated`, the `staticPages` registry in `lib/site-config.ts` (backlog §1.4, done 2026-09-06) and a post's `updated` feed the
sitemap `lastmod`. `BlogPosting.dateModified` is pinned to `post.date` today and follows `updated`
once backlog §6.4 lands (schema-graph §6). Dates move **only on a substantive copy edit** — never for
styling, metadata or analytics work, never to fake freshness. Price bands and standards citations age
fastest — schedule their re-read.

---

## 4. Authoritativeness

### 4.1 Reviews — the acquisition policy

gbp-runbook §10: after every job, the same message to every customer, with the profile's own review
link. **Never incentivised, never gated, never written by staff or family, never for a job that did
not happen.** Reply to every review without naming the customer's address or gate. Reviews originate
on the profile; the site only quotes them (§4.2).

### 4.2 Restoring reviews on the site — verbatim, and the code enforces it

The standard (business-facts §A): every review **verbatim**, typos included — name and city only as
the profile shows them, the rating as given, never rounded, with its date; the complete set or a
stated rule for the subset, never only the five-star ones; `REVIEW_SOURCE_URL` set to the profile and
the same URL mirrored in the roster `sameAs`. `Review` and `AggregateRating` ship only when the review
is from a real customer on a public profile, visible on the page to a human, and `reviewCount` /
`ratingValue` equal what is displayed and what the profile shows. The three-edit procedure, the
reviewer chain (`claims-verifier`, not `hebrew-editor` — quoted text is not edited) and the quarterly
re-sync are gbp-runbook §11. Until then: no star, no rating, no count, anywhere.

### 4.3 `sameAs` and Israeli citations

`sameAs` comes from the roster manifest **only** — a profile the business has actually claimed, never
a directory it has not. Priority: GBP → Facebook → the directories in gbp-runbook §12 (דפי זהב, B144,
זאפ, מידרג, easy — each 🔶 until the sign-up form proves it accepts a listing with no street address;
**if a directory demands an address, skip it**). NAP on every listing is **byte-identical to
gbp-runbook §0**: `דן שערים חשמליים` · `072-2587772` · `info@dangates.co.il` · `https://dangates.co.il/`
· the site's hours · no address. A different phone or a borrowed address on one directory is worse
than no listing. Quarterly check: gbp-runbook §13.

---

## 5. Trustworthiness

### 5.1 Trust surfaces the site must carry

| Surface                                     | Status | Standard                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phone                                       | ✅     | `072-2587772` (`phoneOverride: true` — never "corrected" to the fleet number), click-to-call on every page, `dir="ltr"`                                                                                                                                                    |
| No street address                           | ✅     | Correct for a service-area business (backlog §5.6 HOLDS). Never invent one — on the site, in schema, or on a directory                                                                                                                                                     |
| WhatsApp                                    | 🔶     | Same number, unconfirmed as a chat channel (owner-actions §3.7). The CTA stays or goes on that answer                                                                                                                                                                      |
| Hours, consistent everywhere                | ❌     | Footer, `/צור-קשר/`, `FinalCta`, `TrustBar`, `openingHoursSpecification` and the GBP must agree. Today the footer ends at 18:00 under a CTA promising 24/7 — **fix §7.6** by bounding the promise to §E                                                                    |
| Privacy policy                              | 🟡     | `/מדיניות-פרטיות/` exists but names no processor. It must name **Web3Forms** (the form endpoint) and **GTM / GA4** (analytics), and the form must link to it with a consent line (backlog §8.2, which this row extends: the processor must be named)                       |
| Accessibility statement                     | ❌     | `/הצהרת-נגישות/` claims "ניגודיות צבעים תקינה" while `a11y.mjs` measures 2.76:1 and 1.98:1 on the conversion buttons (§11.1), and names WCAG 2.0 where the site's bar is 2.1 AA (CLAUDE.md, backlog §11). **Both particulars are corrected or the statement is re-worded** |
| HTTPS + HSTS                                | ✅     | Served live from Cloudflare zone rules the repo does not own (owner-actions §1.3, backlog §12.1); `edge.mjs` measures. Verified 2026-09-06: `max-age=15552000`, no CSP                                                                                                     |
| Transparency beyond a phone number          | ❌     | No legal entity name, no ח״פ / ע״מ, no complaints route, no cancellation path (**N15**). The complaints and cancellation channel needs no owner fact; the ח״פ stays 🔶 (business-facts §B)                                                                                 |
| Pricing page as "what determines the price" | ❌     | **N14** — fault type, gate weight and width, motor class, reuse of the existing motor, access and cabling, whether the visit fee is credited. The 150–350 ₪ band stays (currency 🔶); no `Offer` (§4.10)                                                                   |
| Named human · photos · reviews · warranty   | ❌     | §3, §2, §4, §5.3                                                                                                                                                                                                                                                           |

### 5.2 On security badges

No self-issued seals: no SSL badge, "100% מאובטח", "עסק מאומת" graphic or "מומלץ" ribbon. They are
unverifiable, read as low quality, and cost image weight for nothing. What signals security is the
browser padlock (true today), a real phone and honest hours, a privacy policy that names the real
processors, a form that says what happens to the data next to the button, and no unexpected
third-party request. **The only badge worth displaying is one issued by a verifiable body that the
business actually holds** — a standards mark, an insurer, a manufacturer — and it passes §1 first.
Today that set is empty (business-facts §C ❌).

### 5.3 The warranty

No warranty page, and none until business-facts §D changes — which the owner has said it will not.
The site says **אחריות על העבודה** — true, with no number — and nothing more: no term, no scope, no
exclusions, no "בכתב", no "מלאה". A warranty promise whose terms the business cannot state is a promise
it cannot honour on stated terms (business-facts §D); whether it is also a consumer-protection
exposure is a question for the owner's counsel (🔶). The phrase ("אחריות מלאה") rendered 77 times on
41 pages as of 2026-08-24, including inside the homepage `FAQPage` JSON-LD. Softening it is a
correctness fix, decided in CLAUDE.md §1, needing no owner input.

---

## 6. How E-E-A-T shows in the AI answer layer

Doctrine: [seo-geo-aeo-strategy.md §4](seo-geo-aeo-strategy.md), not repeated here. The trust signals an assistant weights, and their state:

- **Attribution** — absent by design (§3.1). The substitute is the `Organization` with `knowsAbout`,
  `logo`, `image` and `sameAs` on `#business` (Phase 2), and a real `dateModified`.
- **Balance** — the 230V boundary and a "when repair is the wrong choice" block are trust assets,
  not conversion leaks; pages that say when not to buy get cited.
- **Specificity with units** — only where sourced: the 150–350 ₪ band, the standard's clause, the
  real hours. Superlatives are unquotable and `never` in the lexicon.
- **Entity resolution** — `sameAs`, byte-identical NAP (§4.3), `llms.txt` (backlog §6.5; 404 today)
  — readable only while the edge admits the crawlers. Verified 2026-09-06: 200 for every AI-crawler
  signature on the full-UA probe (backlog §6.1 ✅). The block existed (managed `robots.txt`
  2026-08-16, enforced 403 2026-08-23) and can return without a repo change — re-probe per
  cloudflare-runbook step 1 first, every time, before claiming anything.

---

## 7. Audit cadence

| Check                                                                                                           | When                 | Owner                                           |
| --------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------- |
| Every claim traces to a source; the reviews guard holds; images are real and captioned                          | every `/audit`       | `eeat-trust-auditor` (rows into `docs/audits/`) |
| `claims-grep.mjs` = 0; `schema.mjs` no `Person` / `Review` / `AggregateRating` / `Offer`                        | every `npm run gate` | script                                          |
| Every copy diff → `claims-verifier` verdict table                                                               | every copy change    | `claims-verifier` (after `hebrew-editor`)       |
| Review count and rating equal the profile; NAP byte-identical; open business-facts rows reviewed with the owner | quarterly            | human (gbp-runbook §11, §13)                    |
| `/הצהרת-נגישות/` true in every particular                                                                       | before each ship     | `perf-a11y-auditor` · `a11y.mjs`                |

---

## 8. Explicitly not doing

| Not doing                                                                         | Why                                                                                                                                                            |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A placeholder author, a first name, or "צוות" as a person                         | A fabricated author is worse than none; `Person` pointing at nobody is a structured-data violation. Registry stays empty (§3.1)                                |
| A warranty page, a licence, insurance or certification line — or waiting for them | None on record and none coming (business-facts §C, §D ❌); absence is the honest state for this trade (§5.3); the copy is written around them now (§7.2 is P1) |
| Stock or generated imagery "for now"                                              | A stock gate presented as our work is the removed reviews in a different medium (§2.1)                                                                         |
| A `LocalBusiness` node per city, or a street address                              | No premises; 18 phantom businesses is a local-spam pattern (schema-graph §5); an invented address is a GBP suspension risk                                     |
| `Offer` / `OfferCatalog` with prices                                              | 8 of 9 prices are authored (§4.10 blocked); the page pivots instead (N14)                                                                                      |
| Paraphrased, trimmed or "cleaned" reviews; trust seals                            | An edited review is authorship (§4.2); a self-issued seal is unverifiable (§5.2)                                                                               |

---

## 9. Enforcement map

| Rule                                                              | Enforced by                                                                                                       | Gap                                                                                                                                               |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| No unconfirmed / never claim live (§1)                            | `claims-grep.mjs` (audit, in `npm run gate`) · `post-edit-lint.ps1` (edit time, copy files) · `claims-verifier`   | Hook does not scan JSX copy → N13 moves it to `lib/content.ts`; §7.2 retires the four claims; a claim living only in JSON-LD is unmeasured (§1.2) |
| Reviews guard (§1.3, §4.2); no `Offer`, `foundingDate`, `address` | `Reviews.tsx` null-return · `schema.mjs` forbidden-until-sourced · `claims-grep.mjs` `rating` gated               | none — live on the domain since the Sprint 0 deploy on 2026-09-06 (post-deploy probe: `aggregateRating` 0)                                        |
| No `Person` author while unnamed (§3.1)                           | `schema.mjs` reads `lib/authors.ts` (absent or empty → `Person` forbidden)                                        | registry file itself not built → §7.4                                                                                                             |
| `sameAs` from the roster only (§4.3)                              | `guard-protected-paths.ps1` + `permissions.deny` on `site.config.json`; the kit emits from the manifest           | none                                                                                                                                              |
| Real photos, Hebrew `alt`, width/height (§2.1)                    | `a11y.mjs` (alt) · `perf.mjs` (unsized) · `SiteImage` compile-time alt                                            | provenance and city · gate type · month are judged by `eeat-trust-auditor`, not measured → §7.5                                                   |
| Case-note format, no price, permission (§2.3)                     | not enforced — `claims-verifier` judgment (prices other than the visit fee are ⛔ in its verdict table)           | no price-literal pattern in `claims.json` (add one → mechanical); no `cityContent` field yet → backlog §3.1 / Phase 3 (`new-city`)                |
| Hours consistent everywhere (§5.1)                                | not enforced on either half — `schema.mjs` never reads `openingHoursSpecification`; `eeat-trust-auditor` judgment | two sources today (manifest hours vs hand-typed `siteConfig.hours`) → §7.6 (`eeat-build` step 3)                                                  |
| Privacy policy names Web3Forms and GTM/GA4; consent line (§5.1)   | not enforced                                                                                                      | → §8.2 (`conversion-cro`, `security-auditor`)                                                                                                     |
| Accessibility statement true (§5.1)                               | `a11y.mjs` contrast pairs; `perf-a11y-auditor` judgment                                                           | the statement text itself is unmeasured → §11.1 fixes the facts                                                                                   |
| Transparency surface (§5.1) · pricing pivot (§5.1 row · N14)      | not enforced · `schema.mjs` (no `Offer`), `content-depth.mjs` (400-word `pricing` floor)                          | → N15 · → N14                                                                                                                                     |
| Freshness dates move only on copy edits (§3.4)                    | not enforced — convention in `lib/site-config.ts` comments; `ts-react-reviewer` judgment                          | `staticPages` registry and its `links.mjs` parity check are planned (§1.4, Sprint 1)                                                              |

---

## 10. Acceptance checklist

- [ ] `node scripts/audit/claims-grep.mjs` exits 0; `licence`, `insurance`, `certification`, `founded`, `named-person` are 0 in source and in `out/`.
- [ ] `node scripts/audit/schema.mjs` reports no `Review`, `AggregateRating`, `Person` author, `Offer`, `foundingDate` or `address`; `image` and `logo` on `#business` (Phase 2); no byline anywhere and `lib/authors.ts` empty.
- [ ] `grep -rl 'aggregateRating' out --include=index.html | wc -l` → 0 until §4.2 is done — then exactly the pages that render the reviews section; after Sprint 0 the same on the live homepage.
- [ ] `reviews`, when populated, are verbatim with name · rating · date, `REVIEW_SOURCE_URL` set, the same URL in the roster `sameAs`; `claims-verifier` confirmed count and rating against the profile.
- [ ] Every `<img>` is a real photograph through `SiteImage` with Hebrew `alt`, `width`/`height`, and city · gate type · month in data — `a11y.mjs` no-alt 0, `perf.mjs` unsized 0, `eeat-trust-auditor` passed provenance; every case note is city · gate type · fault · outcome, no price, permission on record.
- [ ] Footer hours, `/צור-קשר/`, every CTA, `TrustBar` and `openingHoursSpecification` agree (§7.6 closed).
- [ ] `/מדיניות-פרטיות/` names Web3Forms and GTM/GA4 and the form links it with a consent line (§8.2 closed and Web3Forms named); `/הצהרת-נגישות/` is true — `node scripts/audit/a11y.mjs` exits 0 and the statement names WCAG 2.1 AA.
- [ ] A complaints and cancellation channel exists (N15 closed), ח״פ shown only if §B is ✅; `/מחירון/` explains what determines the price, no `Offer`, `content-depth.mjs` ≥ 400 (N14 closed).
- [ ] No trust-seal image anywhere; any badge traces to a ✅ business-facts §C row.
- [ ] Copy went `hebrew-copywriter` → `hebrew-editor` → `claims-verifier`; the writer never reviewed itself.
- [ ] Before any AEO claim: the full-UA probe (cloudflare-runbook step 1) returned 200 today, not on a remembered date.
