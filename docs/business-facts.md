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

| Asset                   | Unblocks                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Google Business Profile | `sameAs`, real reviews, the map pack, entity corroboration, `REVIEW_SOURCE_URL` — §A     |
| Real job photos         | The site's only proof of work; image search; `SiteImage` pipeline (already enabled) — §F |

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

`trustStats` leads with **"ניסיון רב שנים"** and `differentiators` repeats **"שנות ניסיון רבות"**, while
the manifest carries `foundedYear: null`, so there is no `foundingDate` in the JSON-LD. The claim is
vague rather than false — which is better than an invented number — but it is still unsourced, and no
human being is named anywhere on the site.

| Field                      | Why it's needed                                                                     | Lands in             | Value | Status |
| -------------------------- | ----------------------------------------------------------------------------------- | -------------------- | ----- | ------ |
| Year founded               | `foundingDate` in schema; lets the copy state a real number instead of "ניסיון רב"  | Roster `foundedYear` |       | 🔶     |
| Legal entity name          | `legalName` in schema; currently duplicates the brand name                          | Roster `legalName`   |       | 🔶     |
| ח.פ. / ע.מ. number         | Standard IL trust signal; absent sitewide                                           | Roster + `/אודות/`   |       | 🔶     |
| Owner / founder name       | `Person` schema, article bylines, the About story. **No person is named anywhere.** | content.ts `team`    |       | 🔶     |
| Owner's years in the trade | The experience half of E-E-A-T                                                      | content.ts `team`    |       | 🔶     |
| Technician count / names   | "צוות מקצועי" is claimed with nobody behind it                                      | content.ts `team`    |       | 🔶     |

## C. Credentials — an electrical trade with no stated licence

Gate motors are 230V equipment. `רישיון`, `תעודה`, `מוסמך`, `ביטוח` and `חשמלאי` appear **nowhere** in
the repo. For this trade specifically, that absence is conspicuous to a careful customer.

| Field                          | Why it's needed                                         | Lands in                 | Value | Status |
| ------------------------------ | ------------------------------------------------------- | ------------------------ | ----- | ------ |
| Electrician licence / grade    | Expertise signal; legally relevant for 230V work        | content.ts `credentials` |       | 🔶     |
| Insurance (ביטוח צד ג׳)        | Standard trade trust signal                             | content.ts `credentials` |       | 🔶     |
| Manufacturer training / brands | Differentiator; names the motor systems actually fitted | content.ts `credentials` |       | 🔶     |
| Trade association membership   | Authority signal                                        | content.ts `credentials` |       | 🔶     |

## D. Commercial terms — the price list is authored, not sourced

`lib/content.ts:152-156` records that only the **150–350 ₪ technician visit fee** came from the live
FAQ; every per-gate repair and install range below it is an **estimate authored to be honest where
exact figures are unknown**. Those estimates are published on `/מחירון/` as a price list, which is what
a customer will quote back on the phone.

"אחריות מלאה" is claimed across `trustStats`, `ServicesGrid`, the location template and the FAQ with
**no duration, no scope and no exclusions** anywhere. "מלאה" is a stronger word than "בכתב" and should
be backed or softened.

| Field                                    | Why it's needed                                         | Lands in                  | Value | Status |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------- | ----- | ------ |
| Real price range per service             | Replaces authored estimates on a published מחירון       | content.ts `priceRows`    |       | ⛔     |
| Is the 150–350 ₪ visit fee still current | The one sourced number, from an undated live-site audit | content.ts `priceRows`    |       | 🔶     |
| Is the visit fee waived on repair        | The #1 pre-purchase question for this trade             | content.ts                |       | 🔶     |
| Warranty duration                        | Substantiates the most-repeated claim on the site       | content.ts + `/אודות/`    |       | 🔶     |
| Warranty scope + exclusions              | Trust; reduces post-sale disputes                       | content.ts                |       | 🔶     |
| What the price includes / excludes       | AEO answer-block material                               | content.ts `serviceDepth` |       | 🔶     |
| Payment methods / terms                  | Conversion friction                                     | content.ts                |       | 🔶     |

## E. Coverage & availability — two unbounded promises

`schema.areaServed` claims **מרכז הארץ ופריסה ארצית** while the location set spans קריות and באר שבע.
**24/7 emergency availability** is claimed in `Hero`, `trustStats`, `siteConfig.hours.emergency`,
`/איזורי-שירות/` and on every location page. Both are promises the business will be held to at 03:00.

Separately, `locations` contains **קריות, שרון, צפון, דרום** — regions, not cities — and templates
interpolate a bare `ב${loc.name}`, producing `בשרון` and `בצפון` where correct Hebrew is `באזור השרון`
and `בצפון הארץ`.

| Field                                                | Why it's needed                                                  | Lands in                   | Value | Status |
| ---------------------------------------------------- | ---------------------------------------------------------------- | -------------------------- | ----- | ------ |
| Is 24/7 emergency service real, and where?           | Claimed sitewide; sets a response expectation                    | content.ts + Roster        |       | 🔶     |
| Real response-time capability per area               | Same-day is implied for all 18 locations                         | content.ts                 |       | 🔶     |
| Is "פריסה ארצית" true?                               | It's in the schema; a false `areaServed` is a liability          | Roster `schema.areaServed` |       | 🔶     |
| Are קריות/שרון/צפון/דרום/באר שבע genuinely served?   | Whether those pages should exist at all                          | `lib/site-config.ts`       |       | 🔶     |
| If yes — as regions, or specific cities within them? | Drives the `kind: "city" \| "region"` flag and the Hebrew prefix | `lib/site-config.ts`       |       | 🔶     |
| Travel / call-out fee by distance                    | באר שבע and קריות are not local calls                            | content.ts                 |       | 🔶     |

## F. Media — the site has no photographs at all

The built output contains **zero `<img>` tags across all 45 pages**. The header logo renders as text;
`public/dangates-logo.png` is not referenced by the app. There is no photograph of a gate, a job, a
vehicle or a person anywhere on the site.

For a physical trade this is a first-order trust and conversion gap, and it is also the reason there is
no imagery provenance to audit. Cloudflare Image Transformations **are enabled on this zone** (verified:
`/cdn-cgi/image/…` returns 200), so the kit's `SiteImage` pipeline will work the day real photos exist.

| Field                                          | Why it's needed                                 | Lands in                   | Value | Status |
| ---------------------------------------------- | ----------------------------------------------- | -------------------------- | ----- | ------ |
| Real job photos (≥8, various gate types)       | The site's only possible proof of work          | `public/` via `SiteImage`  |       | ⏳     |
| Before/after pairs for repairs                 | The highest-converting format for this trade    | `public/`                  |       | ⏳     |
| Job context per photo (city, gate type, month) | Turns a photo into evidence; local-SEO signal   | content.ts                 |       | ⏳     |
| Team photo with permission to name people      | Author / `Person` schema                        | `public/`                  |       | 🔶     |
| Van / workshop photo                           | Establishes a real operation                    | `public/`                  |       | ⏳     |
| Brand logo as an image asset                   | `public/dangates-logo.png` exists but is unused | `components/layout/Header` |       | ✅     |

### What to ask for, so the photos are usable

Shooting notes matter more than volume here — eight useful photos beat forty unusable ones:

- **Cover each gate type** in `services` (נגרר, כנף, מתרומם, לחניה, זרוע, תריס גלילה). A service page
  with a photo of _that_ gate type is the depth signal; a generic gate photo on all seven is not.
- **Before/after pairs** of actual repairs, shot from the same position. This is the format that
  converts in this trade.
- **Detail shots** of the parts customers search for — motor, control board, safety sensor, track and
  roller. These carry the component-keyword pages in Phase 4 and are what image search surfaces.
- **Per photo, capture:** the city, the gate type, and the month. That metadata is what turns a photo
  into evidence on a location page instead of decoration.
- **Landscape, ≥1600px wide, no watermark.** They ship through `SiteImage` → Cloudflare transforms, so
  large originals are correct; the CDN downsizes per breakpoint.
- **Anyone identifiable needs permission**, and a property owner's permission for a recognisable house
  or gate is worth having before publishing.

## G. Content integrity — the migrated blog

`lib/posts.ts` holds 11 posts scraped from a compromised WordPress site.

**✅ Resolved 2026-08-17:** the English adult-spam phrase that was live at
`/blog/יתרונות-שער-חשמלי-לעסק/`, the 55 dead "פוסטים קשורים" headings and the 6 run-together words
are gone — `node scripts/audit/spam-grep.mjs` → `spamHits: 0`, `relatedTails: 0`, `fusedWords: 0`,
and the PostToolUse hook re-checks every edit to the file.

**Remaining debt** (none of it needs an owner answer; it needs the Phase 4 block model and an
editorial pass): ~42 "📌 link" phrases whose links were lost in migration, a flat all-`<h2>` heading
hierarchy, 4 Latin curly quotes (`lib/posts.ts:848-849`), 42 structural emoji, an empty `מקרי מבחן`
section (`:416-418`), and two "הטובה ביותר" superlatives (`:319`, `:557`) that
`claims-grep.mjs` fails as never-permitted (content-standards §6).

| Field                                     | Why it's needed                                                            | Lands in          | Value | Status |
| ----------------------------------------- | -------------------------------------------------------------------------- | ----------------- | ----- | ------ |
| Approval to edit / rewrite migrated posts | They cannot ship as-is; scope of rewrite is an owner call                  | `lib/posts.ts`    |       | 🔶     |
| Author to attribute articles to           | `BlogPosting.author` is the `Organization` today                           | content.ts `team` |       | 🔶     |
| The one un-migrated post — restore or not | `/שערים-חשמליים-ועיצוב/` was broken on the live site; now 301s to `/blog/` | `REDIRECTS.md`    |       | 🔶     |

## H. Infrastructure — owner-only changes

| Field                             | Why it's needed                                                                                                                                                                                                                                                                                                                                               | Lands in           | Value | Status |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----- | ------ |
| **Unblock AI crawlers**           | Cloudflare's managed `robots.txt` sends `Disallow: /` to ClaudeBot, GPTBot, Google-Extended, CCBot, Bytespider, Amazonbot, Applebot-Extended, meta-externalagent and CloudflareBrowserRenderingCrawler, with `Content-Signal: ai-train=no`. **This caps the entire GEO/AEO goal and no repo change can override it.** Dashboard → the zone → AI Crawl Control | Cloudflare         |       | 🔶     |
| Redirect `www` → apex             | `https://www.dangates.co.il/` returns **200** with a full duplicate of the site. Mitigated by the canonical and the sitemap (both apex-only), so this is cleanup, not a defect. Dashboard → Rules → Redirect Rules, 301                                                                                                                                       | Cloudflare         |       | 🔶     |
| Confirm the security-header rules | HSTS, `X-Frame-Options`, `Permissions-Policy` are served live but come from **zone rules, not this repo** — nothing in CI would notice if they were dropped. Identify the rule so it can be documented or adopted into `public/_headers`                                                                                                                      | Cloudflare         |       | 🔶     |
| GA4 measurement ID                | GA4 is resolved inside the shared container `GTM-KWGGH438` by a hostname RegEx table; dangates needs its own property                                                                                                                                                                                                                                         | Roster `analytics` |       | 🔶     |
| Search Console verification token | `analytics.googleSiteVerification` is `null`, so the layout emits nothing                                                                                                                                                                                                                                                                                     | Roster `analytics` |       | 🔶     |

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
