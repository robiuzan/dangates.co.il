# Business facts — intake sheet

**This is the one file an AI agent may not fill in.** Everything below is a claim the site either makes
without proof, or needs and doesn't have. Fill in the `Value` column, flip `Status` to ✅, and the
matching agent or skill will wire it into the right place.

> **Owner-facing summary with exact toggles: [docs/owner-actions.md](owner-actions.md).** This file is
> the ledger; that one is the to-do list. The claim phrases each row governs are enumerated in
> `scripts/audit/claims.json`, so `node scripts/audit/claims-grep.mjs` and the PostToolUse hook can
> fail a 🔶/⛔ phrase the moment it is written.

**Status key:** 🔶 unconfirmed (never state as fact) · ⏳ **owner is supplying this** · ⛔ fabricated —
shipping now · ✅ confirmed · ❌ not applicable / decided against

---

## Owner intake — 2026-08-17

Asked what could realistically be supplied in the next few weeks. The answer shapes the whole content
programme, so both halves are recorded here.

**Coming (⏳):**

| Asset                   | Unblocks                                                                                                                                                                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Business Profile | `sameAs`, real reviews, the map pack, entity corroboration, `REVIEW_SOURCE_URL` — §A                                                                                                                                                                                             |
| Real job photos         | Would replace the renderings one for one, as `owner-supplied` manifest entries through the toolkit's `import`; the first one changes the site note — §F, owner-actions 4.5 (no date; since 2026-11-11 the image slots are filled by AI renderings under one note, CLAUDE.md §15) |

**NOT coming — plan around them, do not wait:**

| Not available                                   | Consequence for the content                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Warranty term, licence, insurance, year founded | "אחריות מלאה" must be **softened to what is demonstrably true** ("אחריות על העבודה") rather than quantified. No `foundingDate`. No licence/insurance claim anywhere. No named person → `BlogPosting.author` stays `Organization`.                                                                                  |
| Real prices                                     | The 8 authored estimates on `/מחירון/` stay unsourced. `Offer`/`OfferCatalog` stays **blocked** (§4.10 of the backlog). `/מחירון/` cannot honestly target "כמה עולה" queries; pivot it to _what drives the price_ — fault type, gate weight, motor class — which is genuinely useful and needs no invented number. |

The practical rule: **write around the unknowns rather than filling them.** A page explaining what
determines the cost of a motor replacement outranks a page stating a number the business hasn't
confirmed — and carries none of the risk.

**Where confirmed values land:**

- **Roster** = `Israeli services sites/roster/sites/dangates.json`, then sync to `site.config.json`.
  Anything in NAP, identity, schema, or analytics goes here — never edit `site.config.json` directly.
- **content.ts** = `lib/content.ts` — wording, reviews, team, credentials.
- **Cloudflare** = the zone dashboard; the owner changes these, not an agent.

---

## A. ✅ RESOLVED 2026-08-17 — the fabricated reviews are removed

**The violation is no longer live.** `lib/content.ts` now exports an empty `reviews` array, a derived
`REVIEW_AVG` (no longer hand-set to `"5.0"`), and a `REVIEW_SOURCE_URL` gate.
`components/marketing/Reviews.tsx` returns `null` unless reviews **and** a source URL are both
populated, so the section and its schema cannot return by accident. Verified in the export:
`grep -rl 'aggregateRating' out --include=index.html` → nothing.

The rows below stay open because **restoring real reviews is still valuable** — it is the single
highest-leverage trust item on the site. The history is kept so nobody re-creates the problem.

<details>
<summary>What was wrong (for the record)</summary>

The old `lib/content.ts` comment said it plainly, in the repo's own words:

> _"Customer reviews. The business shows a Google rating of 5.0 based on 10 reviews (live-site audit);
> the individual review text was not retrievable, so the copy below is a faithful reconstruction
> attributed to the 10 real reviewer names (all 5★)."_

So the site published **ten invented testimonials under ten real people's names**, rendered them on the
homepage, and emitted them as `AggregateRating` 5.0/10 plus ten `Review` nodes. `schema.sameAs` was
empty, so there was no profile anyone could check them against. The reviewer **cities** were invented
too, the star display was hardcoded to 5 regardless of the rating field, and `REVIEW_AVG` was a
hand-set `"5.0"` rather than derived.

That was three problems at once: a Google structured-data policy violation, a consumer-protection
exposure, and words placed in named individuals' mouths without their consent.

</details>

### Still needed — to restore reviews properly

| Field                                          | Why it's needed                                                                   | Lands in               | Value | Status |
| ---------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------- | ----- | ------ |
| Google Business Profile URL                    | Top local-SEO lever; the `sameAs` anchor; the source real reviews are quoted from | Roster `schema.sameAs` |       | ⏳     |
| Real review texts (author, city, rating, date) | Populates `reviews` — **verbatim only, never paraphrased**                        | content.ts `reviews`   |       | ⏳     |
| The profile URL for `REVIEW_SOURCE_URL`        | The gate that lets the section and its schema render at all                       | content.ts             |       | ⏳     |

**When the profile arrives**, the restore is mechanical and takes minutes: paste the verbatim review
text into `reviews`, set `REVIEW_SOURCE_URL`, add the profile to `schema.sameAs` in the **roster**
manifest, then sync. The component un-hides itself and the `AggregateRating` becomes legitimate because
it finally has a source. Do not paraphrase, do not round the rating up, and do not add a review the
profile does not show.

## B. Identity & history — blocks the experience claim

Until Sprint 4 (`1796ee7`, 2026-11-08) `trustStats` led with **"ניסיון רב שנים"** and
`differentiators` repeated **"שנות ניסיון רבות"** — vague rather than false, but unsourced. Both are
gone: the copy describes what a repair involves instead (`claims-grep.mjs` → `experience 0`,
`founded 0` live, as of 2026-11-09). The manifest carries `foundedYear: null`, so there is no
`foundingDate` in the JSON-LD, and no human being is named anywhere on the site.

| Field                      | Why it's needed                                                                     | Lands in             | Value | Status |
| -------------------------- | ----------------------------------------------------------------------------------- | -------------------- | ----- | ------ |
| Year founded               | `foundingDate` in schema; lets the copy state a real number instead of "ניסיון רב"  | Roster `foundedYear` |       | 🔶     |
| Legal entity name          | `legalName` in schema; currently duplicates the brand name                          | Roster `legalName`   |       | 🔶     |
| ח.פ. / ע.מ. number         | Standard IL trust signal; absent sitewide                                           | Roster + `/אודות/`   |       | 🔶     |
| Owner / founder name       | `Person` schema, article bylines, the About story. **No person is named anywhere.** | content.ts `team`    |       | 🔶     |
| Owner's years in the trade | The experience half of E-E-A-T                                                      | content.ts `team`    |       | 🔶     |
| Technician count / names   | "צוות מקצועי" is claimed with nobody behind it                                      | content.ts `team`    |       | 🔶     |

Two AI-made characters appear in the page renderings since the owner's decision of 2026-11-11
(§F, CLAUDE.md §15); they are not technicians, not staff and name nobody — an alt or caption calls
one «גבר בחולצת פולו כהה», never «טכנאי». The two rows above stay 🔶 and unanswered.

The ח.פ. / ע.מ. number and the legal entity name are asked for in
[owner-actions.md](owner-actions.md) 3.12 (added 2026-11-09, audit M6); the `/אודות/` slot renders
nothing until their rows here are ✅.

## C. Credentials — an electrical trade with no stated licence

Gate motors are 230V equipment. No licence, certificate, qualification or insurance is claimed
anywhere (`claims-grep.mjs` → `licence 0`, `certification 0`, `insurance 0` live, as of
2026-11-09). The word `חשמלאי` appears only as a boundary — a new supply line to the gate is
"עבודה של חשמלאי, לא של טכנאי שערים" on the service pages, and since `8768ce2` on the homepage FAQ
and `/מחירון/` too — never as a credential of this business. For this trade specifically, the
absence of a stated licence is conspicuous to a careful customer.

| Field                                                          | Why it's needed                                                                     | Lands in                                    | Value                                                                                                            | Status |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------ |
| Electrician licence / grade                                    | Expertise signal; legally relevant for 230V work                                    | content.ts `credentials`                    |                                                                                                                  | 🔶     |
| Insurance (ביטוח צד ג׳)                                        | Standard trade trust signal                                                         | content.ts `credentials`                    |                                                                                                                  | 🔶     |
| Manufacturer training / brands                                 | Differentiator; names the motor systems actually fitted                             | content.ts `credentials`                    |                                                                                                                  | 🔶     |
| Trade association membership                                   | Authority signal                                                                    | content.ts `credentials`                    |                                                                                                                  | 🔶     |
| Does the business install / repair cantilever (קונזולי) gates? | Shapes the guide שער-נגרר-כנף-או-קונזולי CTA and whether llms.txt may list the type | `content/guides/שער-נגרר-כנף-או-קונזולי.ts` | Yes — installs and repairs them (owner, in chat 2026-11-10; recorded 2026-11-11 at the owner's word «record it») | ✅     |

The owner said in chat on 2026-11-10 that the business installs and repairs קונזולי gates
(owner-actions 3.9). The Value cell of the row above awaits the owner's own entry; until it is ✅,
the guide's CTA and `llms.txt` do not say so (backlog N33, blocked on it).

## D. Commercial terms — the price list is authored, not sourced

Only the **150–350 ₪ technician visit fee** came from the live FAQ. Until the N14 pivot (`af8ba4c`,
2026-11-08) every per-gate repair and install range below it was an **estimate authored to be honest
where exact figures are unknown**, published on `/מחירון/` as a price list a customer would quote
back on the phone. The pivot deleted them: the comment above `priceRows` in `lib/content.ts` records
why, `priceRows` holds only the visit band (`visitFeeRange`), and the page explains what determines
the price. The ⛔ on the "Real price range per service" row records what shipped until then; no
authored price ships now, and the Status cell is the owner's to change. Since `8768ce2`
(2026-11-09) the copy also states no pricing policy — not when a quote is given, whether it binds,
or that a request carries no obligation (`claims-grep.mjs` → `quote-before-work 0`,
`no-obligation 0`, `price-list-pointer 0` live).

"אחריות מלאה" was claimed across `trustStats`, `ServicesGrid`, the location template and the FAQ
until `1796ee7` (2026-11-08) softened it to "אחריות על העבודה" — still with **no duration, no scope
and no exclusions**, which is all the site may say until the rows below are answered
(`warranty-full 0`, `warranty-term 0` and, since `8768ce2`, `durability-promise 0` live).

| Field                                    | Why it's needed                                         | Lands in                  | Value | Status |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------- | ----- | ------ |
| Real price range per service             | Replaces authored estimates on a published מחירון       | content.ts `priceRows`    |       | ⛔     |
| Is the 150–350 ₪ visit fee still current | The one sourced number, from an undated live-site audit | content.ts `priceRows`    |       | 🔶     |
| Is the visit fee waived on repair        | The #1 pre-purchase question for this trade             | content.ts                |       | 🔶     |
| Warranty duration                        | Substantiates the most-repeated claim on the site       | content.ts + `/אודות/`    |       | 🔶     |
| Warranty scope + exclusions              | Trust; reduces post-sale disputes                       | content.ts                |       | 🔶     |
| What the price includes / excludes       | AEO answer-block material                               | content.ts `serviceDepth` |       | 🔶     |
| Payment methods / terms                  | Conversion friction                                     | content.ts                |       | 🔶     |

The owner said on 2026-11-10 that the 150–350 ₪ visit fee is unconfirmed: it stays only where it
appears today (`priceRows` → `visitFeeRange`) and is added nowhere else, and nothing says whether it
is credited against a repair (owner-actions 3.4). The Value cells of the two visit-fee rows above
await the owner's own entry.

## E. Coverage & availability — two unbounded promises

Until 2026-11-09 the manifest `schema.areaServed` claimed **מרכז הארץ ופריסה ארצית** while the
location set spanned קריות to באר שבע; since the roster sync `8e8843d` it reads "מרכז הארץ
והאזורים שמופיעים באתר", and the JSON-LD lists the 14 published places instead. Until Sprint 4
(`1796ee7`) **24/7 emergency availability** was claimed in `Hero`, `trustStats`,
`siteConfig.hours.emergency`, `/איזורי-שירות/` and on every location page; the site now promises
urgent-fault handling only within the published hours (`claims-grep.mjs` → `around-the-clock 0`,
`national-coverage 0`, `response-time 0` live, as of 2026-11-09). Both were promises the business
would be held to at 03:00.

Separately, `locations` held **קריות, שרון, צפון, דרום** — regions, not cities — and templates
interpolated a bare `ב${loc.name}`, producing `בשרון` and `בצפון`. Sprint 6 (`7c3f2db`) added `kind`
and `prefixed`; `7ed1acd` retired קריות, צפון, דרום and באר שבע with 301s, leaving one region whose
display name is «אזור השרון» since `9886dd1`. ירושלים is the one published place still bounded
(call to check whether and when a visit is possible): the owner has not named it.

| Field                                                | Why it's needed                                                                                                                                                                                                                                                                                                                           | Lands in                   | Value                   | Status |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------- | ------ |
| Is 24/7 emergency service real, and where?           | Claimed sitewide until `1796ee7`; sets a response expectation. The supplied logo carries «24/7» and is the renderings' bottom-right watermark by the owner's decision of 2026-11-11 (owner-actions 3.13, ADR 0006, §F), while the copy, the alt texts, the captions and the site note still never say it — the claim lexicon is unchanged | content.ts + Roster        |                         | 🔶     |
| Real response-time capability per area               | Same-day was implied for all 18 location pages until Sprint 4                                                                                                                                                                                                                                                                             | content.ts                 |                         | 🔶     |
| Is "פריסה ארצית" true?                               | It was in the manifest `areaServed` until `8e8843d`                                                                                                                                                                                                                                                                                       | Roster `schema.areaServed` |                         | 🔶     |
| Are קריות/שרון/צפון/דרום/באר שבע genuinely served?   | Whether those pages should exist at all                                                                                                                                                                                                                                                                                                   | `lib/site-config.ts`       |                         | 🔶     |
| If yes — as regions, or specific cities within them? | Drives the `kind: "city" \| "region"` flag and the Hebrew prefix                                                                                                                                                                                                                                                                          | `lib/site-config.ts`       |                         | 🔶     |
| Travel / call-out fee by distance                    | The far published places (חיפה, אשקלון) are not local calls                                                                                                                                                                                                                                                                               | content.ts                 |                         | 🔶     |
| Is ירושלים served?                                   | 3.6 did not name it; the page was bounded until N35 (2026-11-11) and the JSON-LD `areaServed` lists it                                                                                                                                                                                                                                    | `lib/site-config.ts`       | Yes (owner, 2026-11-11) | ✅     |

The owner answered owner-actions 3.6 in chat on 2026-11-09 (not served: קריות, צפון, דרום, באר
שבע; served: חיפה, אשקלון, שרון; no national coverage) — the Value cells above await the owner's
own entry. ירושלים is asked separately in owner-actions 3.11, which the owner answered «yes» in chat on
2026-11-11 and entered in the row above the same day, at the owner's request.

## F. Media — AI renderings under one note; no photograph yet

**Decided by the owner in chat on 2026-11-11.** The site's image rule changes from "real job
photographs or nothing" to "AI renderings as illustrations under one site-wide note"
([ADR 0006](decisions/0006-ai-renderings-under-one-note.md); the working rules are
[CLAUDE.md](../CLAUDE.md) §15; the work is backlog N37, Sprint 10). It supersedes the 2026-11-10
answer — photos later, no date, neither stock nor generated images (owner-actions 4.1, now 4.5).
Until the install the built output's only `<img>` was the header logo, one per page (`a11y.mjs` →
`imgCount 48`, `pages 48`, as of 2026-11-10, since `6407f83`); `public/dangates-logo.png` also
feeds the JSON-LD `logo` (since `02a3144`). Since the install of 2026-11-12 the build also carries
the 78 approved renderings (`imgCount 168`; the install record below), and the kit and the
renderings go live together in **one** deploy, the next one. There is still no photograph of a
gate, a job, a vehicle or a person on the site. Cloudflare Image Transformations stay on (owner-actions 1.4) for the OG card and the header
logo; the renderings are static files in `public/images/` and never pass through them.

| #   | Question                                    | Owner's decision                                                                                                                                                                                                                                                                                                                            |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Which pages, and how is it disclosed?       | AI renderings on every content page (46 routes) as illustrations under one site-wide Hebrew note — a footer line, the gallery intro, a line under the team frame on `/אודות/` (`content/images/notice.json`, mirrored in Media Studio's `site.json`). Excluded: `/מדיניות-פרטיות/`, `/הצהרת-נגישות/`, `/תודה/`, the 404. No per-image label |
| 2   | Who appears?                                | Two AI-made character sets, ids `tech-a` and `tech-b` — not real people, never named, never presented as staff; no consent flow. See "The characters" below                                                                                                                                                                                 |
| 3   | The logo's «24/7» line?                     | The logo stays as supplied — on the watermark and in the header. The claim lexicon is unchanged: no copy, alt, caption or note may say 24/7 (owner-actions 3.13; §E records the contradiction; 3.5 stays open)                                                                                                                              |
| 4   | Where do the reference portraits come from? | The toolkit's Drive pull, `portraits` role, from the one folder «תמונות עובדים» — shared with the fleet's reader account as Viewer, the folder and not its parent (owner-actions 2.5). The logo is the 1280 px RGBA PNG export; the toolkit composites it, a model never draws it                                                           |
| 5   | Where do the images sit?                    | In the text flow at full column width — a plain `<figure>` between the paragraphs it illustrates, caption under it, the first directly after the page's answer block. No slider, lightbox, popup or floating thumbnails. The home and hub strips, the two contact figures and the index thumbnails carry no caption; every body figure does |
| 6   | Spend?                                      | Hard cap US$60 (`runner.costCapUsd`); expected ≈ US$30 (26–36)                                                                                                                                                                                                                                                                              |
| 7   | The size budget?                            | `out/images/` is outside the audit's 15 MB `maxOutBytes`; `perf.mjs` reports `imagesBytes` beside it; the images gate enforces ≤ 900 KB of images per page, `/גלריה/` ≤ 2.5 MB and `out/images/` ≤ 20 MB                                                                                                                                    |
| 8   | A chest emblem?                             | No — plain charcoal-grey work polos, nothing lettered, no `badge` block                                                                                                                                                                                                                                                                     |

Defaults the owner did not have to decide (recommended defaults accepted): a rendering never in
`og:image`, JSON-LD or the Business Profile; no file-level AI marker; strict two-judge QA with a
dangates trap set; `/גלריה/` in the header before «מחירון»; city pages people-free; the team frame
candid and placed on `/` and `/אודות/` only; own renders only on the 3 blog posts that stay, reuse
on the 8 scheduled to fold or 301; three sentences within one screen of a character softened with
the owner's exact-Hebrew yes in the digest (CLAUDE.md §15 lists them).

**The characters.** Two AI-made character sets, ids `tech-a` and `tech-b` — AI-made, the owner's
word 2026-11-11, so no consent applies: no `CONSENT.md`, no consent flow, no contact sheets. They
are not technicians, not staff and name nobody; §B's technician rows stay 🔶. The source labels
are not repeated here — this repo is public — and the record is
`Media Studio/refs/dangates/PERSONAS.md`, outside git. Were the owner ever to say they are real
people, every render stops until the policy and the note change together with a consent record.

**The 24/7 logo record.** The logo as supplied reads «תיקון והתקנה 24/7». By the owner's decision
of 2026-11-11 (owner-actions 3.13) it stays as supplied, in the header and as the bottom-right
watermark on every rendering. The claim lexicon (`scripts/audit/claims.json` → `around-the-clock`)
does not change: no copy, alt, caption or note may say it (the toolkit's alt writer reads the
master, which carries no logo), and "Is 24/7 emergency service real?" stays 🔶 in §E. ADR 0006
records the contradiction so nobody "fixes" it in either direction.

### Install record — filled 2026-11-12 at the install commit (Sprint 10.7)

| Item                                          | Planned                                                                                                                                                       | Actual                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install day · commits                         | —                                                                                                                                                             | 2026-11-12, branch `page-images`: kit `ff065e4`, plan `08e4820`, softened sentences `c535392`, re-scene `f7271da`, then the install commit that fills this record                                                                                                                                                                                                                                                                               |
| Prompt batches approved (sha8, by whom, when) | —                                                                                                                                                             | `58391645`: 116 prompts (78 page slots + 38 calibration traps) and the three softened sentences, the owner's yes in chat, 2026-11-12 · `d8025628`: the two re-scened prompts, the owner's yes in chat on digest `f4d2e10f`, 2026-11-12 (stamped `d8025628` because a pre-authorised fix note on another prompt moved the id; nothing else changed)                                                                                              |
| Board review (batch id, approved / rejected)  | —                                                                                                                                                             | Session 1, board batch `54c5ed25`: 76 of 76 approved, 0 rejected, no text edits · session 2, board batch `ac8deff6`: 2 of 2 approved (the two re-scened slots) · both by the owner on the local board, 2026-11-12                                                                                                                                                                                                                               |
| Calibration                                   | ≥ 90 % recall on every scored HARD code                                                                                                                       | 38 traps rendered; 36 labelled, one clean control among them (two clean controls skipped: each came out with a parked car); every scored HARD code at 100 % recall, 16 of 18 scored (`text` and `nsfw-or-minor` had fewer than two labelled frames) — Media Studio `a183bd8`                                                                                                                                                                    |
| Pilot                                         | 12 frames, 6 with a character and 6 people-free                                                                                                               | 12 of 12 passed (7 on attempt 1, 5 on attempt 2), 0 refusals, about US$2.3; `maxAttempts` kept at 6; watermark width kept at 0.13 (the mark reads at phone width)                                                                                                                                                                                                                                                                               |
| Judge wording changes                         | —                                                                                                                                                             | Media Studio `sites/dangates/judge.json`: `face-mismatch` only for a clearly different man (`9bcd072`, after a profile face at the back of a two-man frame was flagged as too small to judge); a person on a kerb is not `unsafe-edge` (`60dc90a`)                                                                                                                                                                                              |
| Slots stopped by QA · re-scened               | —                                                                                                                                                             | 2, each after six attempts: `services-barrier-main` (a hand on the boom holder, or a boom off its rest) and `cities-kfar-saba-main` (a swing leaf drawn with a sliding gate's wheels and rail); re-scened in `f7271da` with the owner's yes (`d8025628`), passed on attempts 6 and 4                                                                                                                                                            |
| Second-opinion review before the board        | `image-qa-reviewer` spot-check                                                                                                                                | 5 reviewers + 5 verifiers: 1 frame to regenerate (`home-strip-3`, a boom drawn as two arms; redone, passed on attempt 3); 20 alt and caption texts corrected by the operator through the toolkit (typos, a light-grey polo the alt called dark, captions that read as a sequence or a promise); the dark rounded panel behind the logo on busy corners is the `finish` step's deliberate scrim                                                  |
| Renders installed                             | 78                                                                                                                                                            | 78 of 78 slots approved, 0 held · 132 page renders in all (120 in the slot folders + 12 superseded by the re-scene) + 38 calibration traps                                                                                                                                                                                                                                                                                                      |
| Reuse placements · derived thumbnails         | 36 · 8                                                                                                                                                        | 36 · 8 (the manifest holds 114 placements for its 78 files)                                                                                                                                                                                                                                                                                                                                                                                     |
| Frames with a character                       | 19 (`tech-a` 9, `tech-b` 8, both 2)                                                                                                                           | 19: `tech-a` 9, `tech-b` 8, both 2 (`home-team`, `gallery-generated-4`) · 59 people-free · 14 gallery tiles                                                                                                                                                                                                                                                                                                                                     |
| Spend                                         | cap US$60, expected ≈ US$30                                                                                                                                   | US$22.38 (brief, calibration, pilot, four batches, re-renders, alt text)                                                                                                                                                                                                                                                                                                                                                                        |
| Heaviest page · `/גלריה/` · `out/images/`     | ≤ 900 KB · ≤ 3 MB (`pageBudgets` 3145728 — decision 7 said 2.5 MB, but the gate sums the full files and the 14 tiles at their caps are 2,652,160 B) · ≤ 20 MB | `/services/שער-זרוע/` 3 images, 435 KB · `/גלריה/` 14 images, 1,474 KB · `out/images/` 11,490 KB; `perf.mjs` → `imagesBytes` 11,766,080, `imageFiles` 164                                                                                                                                                                                                                                                                                       |
| Gallery budget (threshold decision)           | decision 7: ≤ 2.5 MB                                                                                                                                          | `pageBudgets["/גלריה/"]` 3,145,728 B, set by hand in `content/images/manifest.json` at install: 7 half + 7 large files at their caps would be 2,652,160 B, over decision 7's 2.5 MB because the gate sums the full files. The real gallery is 1,474 KB                                                                                                                                                                                          |
| Gates in `content/images/manifest.json`       | `minPerContentPage` 0 → 2 only at 46/46                                                                                                                       | `minPerContentPage` 2 (46 of 46 routes carry 2 or more) · `maxPageImageBytes` 921,600 · `maxTotalBytes` 20,971,520 · `pageBudgets["/גלריה/"]` 3,145,728                                                                                                                                                                                                                                                                                         |
| Phone copies (`<file>-w720.webp`, 720 px)     | one per approved full file                                                                                                                                    | 78, 2,727,992 B · the full files 8,855,580 B · the 8 derived thumbnails 182,508 B                                                                                                                                                                                                                                                                                                                                                               |
| Dates moved to the install day                | every route that gained a figure                                                                                                                              | 2026-11-12 on the 5 guides' `dateModified` (publish dates unchanged; all five are live), the 11 posts' `updated`, the 7 services, the 14 locations and the `staticPages` rows `""`, `שירותים`, `איזורי-שירות`, `מחירון`, `גלריה`, `blog`, `מדריכים`, `אודות`, `צור-קשר`, `הצהרת-נגישות`                                                                                                                                                         |
| Gate after install                            | the one known failure only                                                                                                                                    | `npm run gate`, 2026-11-12: the one known failure only (`content-depth` post floor, 11 of 11 posts under 900 words) · `images:check` 46 content routes, 46 with images, 78 entries approved · `outBytes` 13,522,450 (under `maxOutBytes` 15,000,000) · `images 168`, `imagesUnsized 0`, `imgCount 168` · 50 `index.html` under `out/` · `sitemapUrls 48` · `rawHebrewUrls 0` · `sharedParagraphs 1` · `claims-grep` pass · `clientComponents 5` |
| Deploy                                        | the owner's word; kit and images together                                                                                                                     | The owner's word in chat, 2026-11-12 ("approved, deploy"); the kit and the renderings go live together with the next deploy, which follows the install commit                                                                                                                                                                                                                                                                                   |

### Real photos, later — what still enters the ledger

| Field                                                         | Why it's needed                                                                                                                                                                            | Lands in                                                          | Value | Status |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ----- | ------ |
| Real job photos (any number, per gate type)                   | Enter as `owner-supplied` manifest entries through the toolkit's `import` and replace renderings one for one; the first one changes the site note under a new approval (owner-actions 4.5) | `content/images/manifest.json` + `public/images/` via the toolkit |       | ⏳     |
| Case notes (owner-actions 4.4) — text, never a figure caption | The cheapest proof of real work on a location page: city · gate type · fault · outcome, no price, no name (eeat-and-trust §2.3). A caption never carries them                              | `content/locations/<slug>.ts`                                     |       | 🔶     |
| Team photo with permission to name people                     | Author / `Person` schema. The renderings' two characters are not a team photo (owner-actions 4.3)                                                                                          | the manifest, as `owner-supplied`                                 |       | 🔶     |
| Van / workshop photo                                          | Establishes a real operation                                                                                                                                                               | the manifest, as `owner-supplied`                                 |       | ⏳     |
| Brand logo as an image asset                                  | `public/dangates-logo.png` — the header mark since `6407f83`, the JSON-LD `logo`, and the renderings' watermark since the owner's decision of 2026-11-11                                   | `components/layout/Header` · Media Studio `sites/dangates/brand/` |       | ✅     |

### What to ask for, so a real photo is usable

Shooting notes matter more than volume — one usable photo replaces one rendering:

- **Cover each gate type** in `services` (נגרר, כנף, מתרומם, לחניה, זרוע, תריס גלילה). A service page
  with a photo of _that_ gate type is the depth signal; a generic gate photo on all seven is not.
- **Detail shots** of the parts customers search for — motor, control board, safety sensor, track and
  roller. These carry the component pages and are what image search surfaces.
- **Landscape, ≥ 1600 px wide, originals without any added mark** — the toolkit composites the logo
  bottom-right at `finish`, exactly as on the renderings, and writes the WebP sizes and the phone copy.
- **Anyone identifiable needs permission**, and a property owner's permission for a recognisable house
  or gate is worth having before publishing. The caption still states no city, date or customer: a
  real photo is an illustration under the note's rules too, never `ImageObject`, never evidence.

## G. Content integrity — the migrated blog

`lib/posts.ts` holds 11 posts scraped from a compromised WordPress site.

**✅ Resolved 2026-08-17:** the English adult-spam phrase that was live at
`/blog/יתרונות-שער-חשמלי-לעסק/`, the 55 dead "פוסטים קשורים" headings and the 6 run-together words
are gone — `node scripts/audit/spam-grep.mjs` → `spamHits: 0`, `relatedTails: 0`, `fusedWords: 0`,
and the PostToolUse hook re-checks every edit to the file.

**Remaining debt** (it needs the block model and an editorial pass, which waits on the approval row
below — owner-actions 3.8): the ~42 "📌 link" phrases whose links were lost in migration (the six
"full price list" pointers among them were rewritten in `8768ce2`), a flat all-`<h2>` heading
hierarchy, 28 structural emoji (`spam-grep.mjs` → `emojiCount 28`, as of 2026-11-09; 42 on
2026-08-17), no answer blocks, and one unclocked "שירות מהיר ואמין" in the post
`שער-חשמלי-לא-מגיב`. Gone since this list was written: the 4 Latin curly quotes and the empty
`מקרי מבחן` section (`74a92d1`), and the two "הטובה ביותר" superlatives (`1796ee7`) —
`curlyQuotes 0`, `superlative 0` live.

| Field                                     | Why it's needed                                                            | Lands in          | Value | Status |
| ----------------------------------------- | -------------------------------------------------------------------------- | ----------------- | ----- | ------ |
| Approval to edit / rewrite migrated posts | They cannot ship as-is; scope of rewrite is an owner call                  | `lib/posts.ts`    |       | 🔶     |
| Author to attribute articles to           | `BlogPosting.author` is the `Organization` today                           | content.ts `team` |       | 🔶     |
| The one un-migrated post — restore or not | `/שערים-חשמליים-ועיצוב/` was broken on the live site; now 301s to `/blog/` | `REDIRECTS.md`    |       | 🔶     |

## H. Infrastructure — owner-only changes

| Field                             | Why it's needed                                                                                                                                                                                                                                                                                                                                                              | Lands in           | Value                                                                                                                         | Status |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Unblock AI crawlers**           | Was a Cloudflare managed `robots.txt` `Disallow: /` (2026-08-16), then an enforced 403 at the edge (2026-08-23) — either capped the entire GEO/AEO goal and no repo change could override it. Dashboard → the zone → AI Crawl Control. Owner resolved it on the zone; re-probe per `docs/cloudflare-runbook.md` step 1 before every AEO claim because the setting can revert | Cloudflare         | every AI-crawler signature returns 200 on the full-UA probe, verified live 2026-09-06 (owner delegated the flip the same day) | ✅     |
| Redirect `www` → apex             | `https://www.dangates.co.il/` returns **200** with a full duplicate of the site. Mitigated by the canonical and the sitemap (both apex-only), so this is cleanup, not a defect. Dashboard → Rules → Redirect Rules, 301                                                                                                                                                      | Cloudflare         |                                                                                                                               | 🔶     |
| Confirm the security-header rules | HSTS, `X-Frame-Options`, `Permissions-Policy` are served live but come from **zone rules, not this repo** — nothing in CI would notice if they were dropped. Identify the rule so it can be documented or adopted into `public/_headers`                                                                                                                                     | Cloudflare         |                                                                                                                               | 🔶     |
| GA4 measurement ID                | GA4 is resolved inside the shared container `GTM-KWGGH438` by a hostname RegEx table; dangates needs its own property                                                                                                                                                                                                                                                        | Roster `analytics` |                                                                                                                               | 🔶     |
| Search Console verification token | `analytics.googleSiteVerification` is `null`, so the layout emits nothing                                                                                                                                                                                                                                                                                                    | Roster `analytics` |                                                                                                                               | 🔶     |

## I. The live surfaces' wording — fleet live-kit (CLAUDE.md §14)

The announcement bar, the seasonal card and the homepage updates strip print only what
`content/live/_campaigns.mjs` and `_updates.mjs` say, and every line quotes a sentence the site
already shows. Nothing in them is a 🔶 row above: the claim stems in `live.config.mjs` turn every
🔶 / ⛔ row of §B–§E (and the reviews of §A) into a build failure for any line that states it.
Drafted 2026-10-12 and **approved by the owner the same day** on the fleet wording sign-off page
(fingerprint `4d0513a5efd6`, the `approved` stamp in both registers).

**Owner decisions, 2026-10-12 (fleet wording sign-off page):**

- The wording is approved as drafted — the self-help evergreen line ("תקלה בשער? פתרונות פשוטים
  שאפשר ליישם בעצמכם") is kept.
- The wartime line "פועלים בכפוף להנחיות פיקוד העורף" is **confirmed for this business**.
- The card may show at all hours (fleet decision), and the fleet keeps ONE shared GTM trigger.
- The updates strip ships as is: it hides itself 45 days after its newest item.
- WhatsApp goes to **+972556601006**, the owner's own WhatsApp (as on 3locksmiths), because
  072-2587772 is not on WhatsApp. The roster sync of 2026-10-12 carries it to `site.config.json`
  → `contact.whatsappE164`; it also fixes the sticky bar's WhatsApp link, which led nowhere.
- The flagged claims in the migrated blog posts are OK for now and get fixed later — fixed in the
  repo since then (`1796ee7`, `9195c9b`, `8768ce2`; backlog §7.2): `claims-grep.mjs` → every id 0
  live as of 2026-11-09. The wider rewrite is still owner-actions 3.8.
- When the privacy page (`/מדיניות-פרטיות/`) is rewritten, it should mention the status-file read
  (`https://imgquarry.com/status/fleet.json`) and the values the live surfaces keep in browser
  storage — the page was rewritten to name both in `68a4a7f` (2026-11-08); backlog §8.2 stays
  PARTIAL on B2 and B10 only.

| Field                                                                           | Why it's needed                                                                                                                                                                                                                          | Lands in                                      | Value                                                                                                                                                              | Status |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| The live wording (the evergreen line, six seasonal lines, one card, one update) | Nothing reaches production without it: the build fails until both registers carry the owner's `approved: "YYYY-MM-DD — who, how"`                                                                                                        | `content/live/_campaigns.mjs`, `_updates.mjs` | approved 2026-10-12 as drafted: seasonal lines to 31/10/2027, the card in the autumn window from 18/10/2026; every line quotes the blog's advice in `lib/posts.ts` | ✅     |
| Does the business keep working under Home Front Command restrictions?           | The fleet's wartime line "פועלים בכפוף להנחיות פיקוד העורף" shows on every page while the status switch says `reduced`                                                                                                                   | `_campaigns.mjs` → `reduced`                  | yes — confirmed by the owner 2026-10-12 (fleet wording sign-off page)                                                                                              | ✅     |
| Is 072-2587772 reachable on WhatsApp?                                           | The card's WhatsApp button is fixed in the kit and the sticky bar ships one                                                                                                                                                              | Roster `contact.whatsappE164`                 | no — WhatsApp goes to `+972556601006`, the owner's own WhatsApp (owner, 2026-10-12); synced to `site.config.json` the same day                                     | ✅     |
| Privacy page: the live surfaces' status-file read and browser-storage values    | The page loads `imgquarry.com/status/fleet.json` and remembers the switch's state, the card's last showing and the visit's page count in the browser (`ls-status`, `ls-dlg-*`, `ls-pv`, `ls-t`); `/מדיניות-פרטיות/` mentions neither yet | `/מדיניות-פרטיות/` (backlog §8.2)             | to be added when the privacy page is rewritten (owner, 2026-10-12)                                                                                                 | 🔶     |

---

## Verified during the 2026-08-16 audit — no action needed

- **Deploy path:** Cloudflare Pages, direct upload via wrangler. Live headers show `Server: cloudflare`,
  `cf-cache-status: DYNAMIC`, `Cache-Control: public, max-age=0, must-revalidate` and a Cloudflare
  managed `robots.txt` — the same fingerprint as the confirmed Cloudflare Pages sibling galbath.co.il,
  with no GitHub/Fastly edge headers anywhere. The roster's `toolkit.notes` claim of "LIVE on GitHub
  Pages" is **stale**; its `hosting.target: cloudflare-pages` is correct.
- **No street address is correct.** This is a service-area business; the manifest carries no address and
  the schema models coverage with `areaServed`. Do not add one.
- **The 072- phone is correct.** `contact.phoneOverride: true` — this is the one fleet site that does
  not use the shared `055-6601006`. Do not "fix" it.
- **`mailto:` is not broken.** Cloudflare Scrape Shield email obfuscation — which rewrites `mailto:`
  into a 404 on other fleet zones — is **off** here. Raw `mailto:info@dangates.co.il` is in the live
  HTML.
- **Cloudflare Image Transformations are ON.** `/cdn-cgi/image/…` returns 200, so `SiteImage` works
  whenever real imagery lands. (On galbath the same endpoint 404s.)
- **Security headers are present live** — HSTS (180d), `X-Frame-Options: SAMEORIGIN`,
  `Permissions-Policy`, `nosniff`, `Referrer-Policy` — but they come from the zone, not the repo. No CSP.
- **`app/sitemap.ts` is sound:** real per-content `lastmod` dates, `encodeURI`, trailing slashes, 45 URLs.
- **`out/` is clean:** ~5.6 MB, no JS file over 1 MB, no dev-only chunks.
