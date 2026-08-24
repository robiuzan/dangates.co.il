# Google Business Profile runbook — דן שערים חשמליים

For the day the profile (**פרופיל העסק ב-Google**, formerly "Google עסק שלי") arrives — status ⏳ in
`docs/business-facts.md` §A and `docs/owner-actions.md` §2.1. It is the top local-SEO lever on this
site (`/local-seo-il` §2): the map pack, the only legitimate source of reviews, and the `sameAs` anchor
that lets a crawler or an assistant confirm the business is real.

**Owner-facing.** Agents document; they never create, edit or verify a profile, and they never type a
review, a rating, a price or an address into anything. Hebrew terms in parentheses are what the
Google UI shows at the time of writing — Google renames menu items, so search by meaning.

---

## 0. The NAP strings — copy these, never retype them

Every profile, directory and citation must carry **byte-identical** values. They come from the
manifest (`site.config.json:13-20`, synced from the roster), nowhere else.

| Field          | Value                                      | Note                                                                                                                    |
| -------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Business name  | `דן שערים חשמליים`                         | Exactly this — no city, no "תיקון", no slogan appended (Google suspends keyword-stuffed names).                         |
| Phone          | `072-2587772`                              | `contact.phoneOverride: true` — the one fleet site **not** on `055-6601006`. Never "correct" it.                        |
| WhatsApp       | same number                                | 🔶 owner-actions §3.7 — the live site never advertised WhatsApp; confirm before listing it as a chat channel.           |
| Email          | `info@dangates.co.il`                      |                                                                                                                         |
| Website        | `https://dangates.co.il/`                  | Apex, https, trailing slash. Never `www` (backlog §1.7).                                                                |
| Street address | **none**                                   | Service-area business. An invented or borrowed address is a suspension risk, not a ranking tactic (`/local-seo-il` §1). |
| Area (wording) | `מרכז הארץ ופריסה ארצית`                   | The manifest's `schema.areaServed`; "פריסה ארצית" itself is 🔶 (business-facts §E). In GBP use the city list in §2.     |
| Hours          | ראשון–חמישי 08:00–18:00 · שישי 08:00–15:00 | `lib/site-config.ts:41-46`; manifest `schema.openingHours` (`site.config.json:29-46`). Saturday: closed.                |

---

## 1. Create it as a service-area business (עסק באזור שירות)

1. `business.google.com` → add the business → name **exactly** as §0.
2. Category → §3. Then the question _"Do you want to add a location customers can visit?"_
   (**"האם להוסיף מיקום שלקוחות יכולים לבקר בו?"**) → **No (לא)**. This is what makes it a
   service-area business: no pin, no address on the listing.
3. _"Where do you provide services?"_ (**"היכן אתם מספקים שירות?"**) → the areas in §2.
4. Contact: phone, website from §0. Do not add a second phone.
5. Verification (**אימות**). Google picks the method; for address-less businesses it is commonly video
   verification (a walk-through showing the van, tools, signage). If Google insists on a mailing
   address for verification only, enter it and make sure **"show address"** stays off — the
   listing must not display one. 🔶 The exact method is Google's call; do not pre-plan around one.
6. Send the agents the public profile URL (§11). Prefer the stable long form
   `https://www.google.com/maps?cid=<number>` over a `maps.app.goo.gl` short link.

---

## 2. Service areas (אזורי שירות) — the 18 locations, as you confirm them

The site publishes 18 location pages (`lib/site-config.ts:82-101`). Add an area **only if the business
genuinely sends a technician there**; the profile's area list and the site's location list should
match, or a customer in a listed city calls and is refused. Google caps the count (20 at the time of
writing 🔶) and prefers areas reachable from your base — 18 fits.

| Add now (cities)                                                                                                        | Pending your answer — business-facts §E, owner-actions §3.6                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| תל אביב · ירושלים · חיפה · ראשון לציון · פתח תקווה · נתניה · חולון · כפר סבא · מודיעין · רחובות · יבנה · אשדוד · אשקלון | **באר שבע** (a long call-out — is it served?) · **קריות**, **שרון**, **צפון**, **דרום** (regions, not cities — Google's picker wants a city, a district or a region name; pick the real one, never a made-up town) |

Order them by business priority (מרכז first) — Google shows the first few on the listing.

---

## 3. Categories (קטגוריות)

Google's taxonomy is fixed and localised; the picker autocompletes as you type. The names below are
**suggestions to type into the picker**, not assertions that Google spells them this way — 🔶 on every
row until you see it in the dropdown. Pick **one** primary; add secondaries only for work you actually
do.

| Role      | Try (Hebrew UI)            | Try (English UI)                    | Why / caveat                                                                                                                 |
| --------- | -------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Primary   | שערים / מתקין שערים        | Gate installer / Gate               | Closest to the head term `תיקון שערים חשמליים` (keyword-map §1). 🔶 If nothing matches, fall back to the next row.           |
| Primary   | קבלן גדרות                 | Fence contractor                    | The established category that covers gates when no gate-specific one exists.                                                 |
| Secondary | ספק דלתות מוסך             | Garage door supplier                | Covers שערים מתרוממים and תריסי גלילה חשמליים (two of the 7 services).                                                       |
| Secondary | חברת אוטומציה / בקרת כניסה | Automation company / Access control | Covers מנועים, שלטים, בקרי כניסה.                                                                                            |
| Avoid     | חשמלאי                     | Electrician                         | Implies a licensed electrical trade. No licence is confirmed (business-facts §C, owner-actions §3.2) — do not claim it here. |

---

## 4. Services (שירותים) — the 7, with the site's canonical URLs

GBP service entries have a name, an optional description (about 300 characters at the time of writing)
and an optional price. Use the **service name exactly as the site's H1** (`app/services/[service]/page.tsx:38`
sets the title to the same `card.name`), draft the description from that page's opening
paragraph (no new claims — the `hebrew-editor` → `claims-verifier` review applies to this text too),
and **leave every price field empty**: real prices are not coming (business-facts §D, owner-actions
§3.4) and the one sourced figure (150–350 ₪ visit fee) is itself 🔶 "still current?". The URL is for
posts, messages and your own reference — the service entry has no link field.

| Service (name as H1) | Canonical URL                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| שערים נגררים         | `https://dangates.co.il/services/%D7%A9%D7%A2%D7%A8%D7%99%D7%9D-%D7%A0%D7%92%D7%A8%D7%A8%D7%99%D7%9D/`                                      |
| שערי כנף             | `https://dangates.co.il/services/%D7%A9%D7%A2%D7%A8%D7%99-%D7%9B%D7%A0%D7%A3/`                                                              |
| שערים מתרוממים       | `https://dangates.co.il/services/%D7%A9%D7%A2%D7%A8%D7%99%D7%9D-%D7%9E%D7%AA%D7%A8%D7%95%D7%9E%D7%9E%D7%99%D7%9D/`                          |
| שערים לחניה          | `https://dangates.co.il/services/%D7%A9%D7%A2%D7%A8%D7%99%D7%9D-%D7%9C%D7%97%D7%A0%D7%99%D7%94/`                                            |
| שער זרוע             | `https://dangates.co.il/services/%D7%A9%D7%A2%D7%A8-%D7%96%D7%A8%D7%95%D7%A2/`                                                              |
| תריסי גלילה חשמליים  | `https://dangates.co.il/services/%D7%AA%D7%A8%D7%99%D7%A1%D7%99-%D7%92%D7%9C%D7%99%D7%9C%D7%94-%D7%97%D7%A9%D7%9E%D7%9C%D7%99%D7%99%D7%9D/` |
| שערים לדירה          | `https://dangates.co.il/services/%D7%A9%D7%A2%D7%A8%D7%99%D7%9D-%D7%9C%D7%93%D7%99%D7%A8%D7%94/`                                            |

Do **not** add per-city services ("תיקון שער חשמלי בחולון" × 18) — that is the doorway pattern in
profile form (`docs/content-standards.md` §2) and Google treats it as spam.

---

## 5. Hours (שעות פעילות)

Primary hours = when a person answers the phone: **ראשון–חמישי 08:00–18:00, שישי 08:00–15:00, שבת
סגור** — identical to the footer and to `openingHoursSpecification` in the schema.

The site also claims **שירות חירום 24/7** (`lib/site-config.ts:45`, `trustStats`). That claim is
🔶 (business-facts §E, owner-actions §3.5). Put it on the profile **only once §E is ✅**, and then as
a note in the description or as _more hours_ (**שעות נוספות**) — never by marking primary hours as
"open 24 hours", which is how businesses get their hours flagged. If §E comes back "not everywhere",
the site copy is bounded first (Phase 6), then the profile copies the bounded wording.

---

## 6. Website link, appointment link, UTM

Google shows one website link and, optionally, an appointment link. Tag both so GA4 can separate
profile traffic from organic search once the property exists (owner-actions §2.4 — until then the tags
cost nothing and the history starts the day GA4 lands). `docs/event-taxonomy.md` sets the rules these
follow: no PII, snake_case, one `campaign` for the channel.

| Link        | Value                                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Website     | `https://dangates.co.il/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=profile`                                           |
| Appointment | `https://dangates.co.il/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=appointment` |
| Posts (§8)  | the post's canonical URL + `?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post-<slug>`                                   |

`utm_medium=organic` keeps the sessions inside GA4's organic channel; `utm_campaign=gbp` is what you
filter on. The query string goes **after** the trailing slash. Legacy URLs are never used here, and
after Phase 1 (`public/_redirects`, ADR 0004) a query string survives a 301 anyway.

Messaging (**הודעות / צ׳אט**): optional. If you turn it on, Google expects a reply within 24 hours
and disables it otherwise — only enable it if someone actually watches it.

---

## 7. Photos, logo, cover

Shooting notes and what to capture per photo are in `docs/business-facts.md` §F (owner-actions §4.1):
each gate type, before/after pairs, detail shots of מנוע / לוח פיקוד / עינית / מסילה / גלגלת, with
city + gate type + month per photo, landscape ≥ 1600 px, no watermark, permission for anything
identifiable. The same set feeds the site (`/site-images`) and the profile.

Profile specifics: **logo** (לוגו) = a square crop of `public/dangates-logo.png` on a plain
background; **cover** (תמונת שער) = one landscape job photo, not the logo. Google's published
minimums at the time of writing: JPG/PNG, 720 × 720 px or larger, 10 KB – 5 MB, no heavy filters or
text overlays. Add photos in batches as jobs happen — a profile with dated, varied photos outranks one
with a single upload.

---

## 8. Posts (עדכונים) — cadence

One post per guide or article the site publishes (`docs/content-calendar.md` §5 runs at two guides a
month from Phase 4), plus one seasonal maintenance reminder. So **1–2 posts a month**, each:

- an _Update_ (עדכון) with a real photo, 2–3 sentences in the site's register
  (`docs/content-standards.md` §4), and the canonical URL tagged per §6;
- no _Offer_ (מבצע) unless there is a real, dated offer with terms — the repo still carries a "הנחות
  סתיו בלעדיות לתושבי יוסטון" stub inherited from the cloned source (backlog N4) as a reminder of what
  an invented promotion looks like;
- no claim the site doesn't make (`claims-verifier` reads post drafts too).

---

## 9. Q&A (שאלות ותשובות) — seed from the homepage FAQ, verbatim

Google lets the owner post a question and answer it. Seed the 10 pairs below **exactly as they appear
in `lib/content.ts:170-211`** — the same text a crawler already sees in the homepage `FAQPage` — so
the profile and the site never disagree. When the site copy changes (Phase 3 rewrites several of
these; Phase 6 softens claims), update the profile the same week.

| #   | Q (verbatim)                             | A (verbatim)                                                             | Post?                                                                                  |
| --- | ---------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| 1   | כמה זמן לוקח לתקן שער חשמלי?             | התיקון אורך לרוב בין שעה ליום עבודה, תלוי בסוג התקלה ובזמינות החלקים.    | yes                                                                                    |
| 2   | האם יש אחריות על התיקון?                 | כן, אנו מספקים אחריות מלאה על כל שירותי התיקון וההתקנה שלנו.             | **hold** — "אחריות מלאה" is 🔶 (§D); post after Phase 6 softens it to אחריות על העבודה |
| 3   | מה כוללת תחזוקה שוטפת לשער?              | התחזוקה כוללת בדיקת מנוע, ניקוי מסילות, בדיקת חיישנים ושימון חלקים נעים. | yes                                                                                    |
| 4   | איך לבחור שער חשמלי חדש?                 | יש להתחשב בסוג השער, אופן הפתיחה, החומר והצרכים האישיים שלכם.            | yes                                                                                    |
| 5   | מה העלות של ביקור טכנאי לבדיקה?          | עלות ביקור טכנאי לבדיקת שער היא 150–350 ₪, תלוי במיקום ובשעה.            | **hold** — the range is 🔶 "still current?" (§D, owner-actions §3.4)                   |
| 6   | האם אתם עובדים עם לקוחות פרטיים ועסקיים? | כן, אנו משרתים את שני הסקטורים.                                          | yes                                                                                    |
| 7   | מה כוללת התקנה של שער חדש?               | ייעוץ, התקנה והתאמה אישית.                                               | yes                                                                                    |
| 8   | איך ניתן ליצור קשר?                      | ניתן ליצור קשר טלפוני או דרך האתר.                                       | yes                                                                                    |
| 9   | האם אתם מציעים שירותי חירום?             | כן, אנו זמינים למקרי חירום.                                              | **hold** — 24/7 / emergency is 🔶 (§E)                                                 |
| 10  | כמה זמן לוקחת התקנה?                     | משך ההתקנה תלוי בסוג השער ובדרישות הלקוח.                                | yes                                                                                    |

Answer public questions from customers within a day; the profile lets anyone answer, and a wrong
stranger's answer becomes the visible one.

---

## 10. Reviews (ביקורות) — the request flow

**After every job, the same way, for every customer.** Google's policy and the site's golden rule 1
both forbid the alternatives:

- **Never incentivised** — no discount, no gift, no "ביקורת = הנחה". Not on the site, not in the van.
- **Never gated** — do not ask "were you happy?" first and send the link only to the happy ones.
  Everyone who had a job done gets the same message.
- **Never written by staff, family, or the business** — and never a review for a job that didn't
  happen.
- **Reply to every review**, positive or negative, in the site's register, without arguing and without
  naming the customer's address or gate details.

The mechanics: the profile's **"בקשת ביקורות" / Ask for reviews** gives a short link of the form
`g.page/r/<id>/review`. Send it by WhatsApp or SMS after the job is closed and paid:

> שלום, כאן דן שערים חשמליים. תודה שבחרתם בנו לתיקון השער. אם יש לכם דקה, נשמח לביקורת קצרה בגוגל —
> זה עוזר לנו מאוד: `<g.page link>`. תודה!

That is the whole script. No star prompt, no "5 כוכבים", no follow-up pressure.

---

## 11. Restoring reviews on the site — verbatim only, and the code enforces it

The site previously shipped ten invented testimonials under ten real names as `Review` +
`AggregateRating` JSON-LD (business-facts §A — read it once). It was removed 2026-08-17 and a gate
now stands in the code: `components/marketing/Reviews.tsx:41` returns `null` unless
**both** `reviews` and `REVIEW_SOURCE_URL` are populated, and `scripts/audit/schema.mjs:71` only
permits `aggregateRating` when `REVIEW_SOURCE_URL` is a literal `"http…"` string. Do not work around
either.

When the profile has reviews, the restore is three edits and takes minutes:

1. **`lib/content.ts:242`** — paste each review into `reviews`, matching the `Review` interface at
   `lib/content.ts:231-240`:

   ```ts
   export const reviews: readonly Review[] = [
     {
       name: "<reviewer name exactly as the profile shows it>",
       role: "<only what the profile shows under the name — e.g. the month/year; never an invented city>",
       rating: 5, // the stars the profile shows — never rounded
       text: "<the review text, verbatim, including its typos>",
     },
   ];
   ```

   - **Verbatim.** No paraphrase, no trimming, no fixing the Hebrew. A quoted review is evidence; an
     edited one is authorship.
   - **Every review the profile shows, or a transparent rule for the subset** (e.g. "the 10 most
     recent"); never only the 5-star ones — that is gating in schema form and `reviewCount` would lie.
   - `REVIEW_AVG` (`lib/content.ts:253-256`) is derived from the ratings; never hand-set it.
   - The interface has no `date` field today. The restore PR adds `date: "YYYY-MM-DD"` and emits
     `datePublished` per review (`rtl-frontend-engineer`, `/schema-structured-data`) — a dated
     review is what Google's rich-result guidance expects.

2. **`lib/content.ts:248`** — `export const REVIEW_SOURCE_URL: string | null = "https://www.google.com/maps?cid=<number>";`
   (keep that exact declaration shape — the audit's regex reads it).

3. **The roster** — `Israeli services sites/roster/sites/dangates.json` → `schema.sameAs` += the same
   URL, then sync to `site.config.json:45`. `@ishub/site-kit`'s `localBusinessJsonLd` emits
   `sameAs` from the manifest, so `#business` gains the link without a component change. Never edit
   `site.config.json` directly (golden rule 2).

Then `npm run gate` (the `schema` and `content` scopes flip from "must be absent" to "must be
consistent"), `hebrew-editor` is **not** involved (nothing to edit — the text is quoted), and
`claims-verifier` checks that the rating and count on the page equal the profile's on the day of the
commit. Re-sync quarterly: a stale `reviewCount` is a small lie that compounds.

---

## 12. Israeli citations — NAP exactly as §0

Second-tier listings corroborate the entity. Each must carry the **same** name, phone, website and
hours as §0 — a different phone or a street address on one directory is worse than no listing. The
hard question for an address-less business is whether the directory accepts a service-area listing;
🔶 on each until you open the sign-up form. **If a directory demands a street address, skip it** —
never invent or borrow one.

| Directory                            | Type                   | No-address listing?                                                                                                                                             |
| ------------------------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| דפי זהב (`d.co.il`)                  | general directory      | 🔶 — has "service area" style listings for trades; confirm on the form                                                                                          |
| B144 (`b144.co.il`, Bezeq)           | phone directory        | 🔶 — keyed on the phone number; address field may be mandatory                                                                                                  |
| זאפ (`zap.co.il`)                    | consumer directory     | 🔶                                                                                                                                                              |
| מידרג (`midrag.co.il`)               | trade reviews / quotes | 🔶 — contractor profiles by trade and region; the most relevant review source after Google                                                                      |
| easy (`easy.co.il`)                  | local directory        | 🔶 — map-centric; may require a pin                                                                                                                             |
| Waze · Apple Maps (Business Connect) | map places             | 🔶 — both are place-based; a service-area business with no premises usually cannot list honestly. Skip unless the platform offers an explicit no-address option |
| Facebook page                        | social                 | yes — `siteConfig.social.facebook` is empty (`lib/site-config.ts:49-53`); fill via the roster `sameAs`                                                          |

Where a directory offers a website field, tag it per `docs/event-taxonomy.md` "Campaign tagging":
`https://dangates.co.il/?utm_source=<directory>&utm_medium=referral&utm_campaign=citations`
(`utm_source` = `dapei-zahav`, `zap`, `b144`, `midrag`, `easy` — lowercase ASCII, one token each).

Every profile created goes into the roster `schema.sameAs` (same sync as §11 step 3).

---

## 13. NAP-consistency check — quarterly

1. Copy §0 into a scratch note. Open each listing in §12 plus the GBP and compare **character by
   character**: name, phone (with the hyphen), website (https, apex, trailing slash), hours.
2. Search Google for `"דן שערים חשמליים"` and for `"072-2587772"` (with quotes). Every result that
   shows a listing you don't recognise is a stray citation — usually WordPress-era directory entries
   carrying old URLs. Claim or correct it; old URLs 301 to the new ones after Phase 1, so a stray
   link is harmless but a stray phone is not.
3. Check the site itself: footer (`siteConfig.serviceArea`, phone), `/צור-קשר/`, the JSON-LD
   `#business` node (`telephone`, `openingHoursSpecification`, `sameAs`) — `scripts/audit/schema.mjs`
   covers the schema side; the footer is a visual check.
4. Record the date and any fix in `docs/business-facts.md` §A (it is the owner's sheet).

---

## 14. What changes on the site once the profile exists

| Change                                                                                                  | Where                                                                     | Who                                  |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------ |
| `sameAs` gains the profile URL → `#business` emits it                                                   | roster → sync → `site.config.json:45` → kit `localBusinessJsonLd`         | owner (roster) · agent (sync + gate) |
| `siteConfig.social.googleBusiness` stops being an empty literal and reads from `manifest.schema.sameAs` | `lib/site-config.ts:49-53` (read by nothing today — wire it or delete it) | rtl-frontend-engineer                |
| The reviews section and its `AggregateRating` un-hide themselves                                        | `components/marketing/Reviews.tsx:41` gate opens once §11 steps 1–2 land  | owner supplies text · agent pastes   |
| A "ביקורות בגוגל" link near the reviews and in the footer                                               | Phase 6 (`/eeat-build`), only after §11                                   | rtl-frontend-engineer                |
| Backlog rows close                                                                                      | §5.1 (no GBP link), §7.1 restore path; business-facts §A rows → ✅        | whoever runs `/improve`              |
| `claims-grep.mjs` §A rows (ratings, review counts) pass instead of fail                                 | `scripts/audit/claims.json` section `A`                                   | automatic                            |

Nothing else changes by itself: the profile does not fix doorway pages (content-standards §2), does not
bound the 24/7 claim (§E) and does not replace photos (§F).

---

## Checklist

- [ ] Profile created as a service-area business; **no address shown**; name/phone/website exactly §0.
- [ ] Service areas = the 13 cities now; the 5 pending entries added only after business-facts §E is ✅.
- [ ] One primary category chosen from the picker; "חשמלאי" not used.
- [ ] 7 services named as the site's H1s; descriptions from page copy; **no prices**.
- [ ] Hours = the site's; no "open 24 hours"; emergency wording only after §E.
- [ ] Website and appointment links tagged per §6.
- [ ] Logo + cover + first photo batch per business-facts §F.
- [ ] Q&A seeded — 7 now, 3 held until their claims resolve.
- [ ] Review request sent after every job, same message, never incentivised or gated.
- [ ] Reviews restored on the site **verbatim** with `REVIEW_SOURCE_URL` and roster `sameAs`; `npm run gate` green.
- [ ] Citations created only where a no-address listing is honest; all with §0 values; quarterly check dated in business-facts §A.
