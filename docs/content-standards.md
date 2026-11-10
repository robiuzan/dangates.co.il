# Content standards — the acceptance bar for Hebrew copy

`hebrew-copywriter`, `new-city`, `new-service`, `new-article` and `new-guide` all write against this
file. `hebrew-editor`, `claims-verifier`, `article-auditor`, `seo-auditor` and `eeat-trust-auditor`
audit against it. The measurement is `node scripts/audit/content-depth.mjs` — never a hand count.

---

## 1. The depth bar

**Definition.** "Unique body words" = words inside `<main>` (site chrome — header, footer, mobile CTA
bar — is outside it and never counted) **minus every paragraph of ≥ 12 words that renders verbatim on
≥ 3 routes** (the shared `FinalCta` lead, the service teasers, the process steps). That is exactly what
`content-depth.mjs` computes; the floors live in `scripts/audit/thresholds.json` and mirror this table.

"Today" is the script's median for the type as of **2026-11-09** (after Sprint 5, `225ff45`; the
2026-08-23 value in brackets where it moved). Re-run before quoting.

| Page type                     | Minimum unique body words | Today (`content-depth.mjs`)                                                                                                                                                                                             |
| ----------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage                      | 800                       | 1762 ✅ (1778 total, 2026-11-09 at `2b0d802`; 675 on 2026-08-24 after the reviews left — Sprint 4 added the answer block, the diagnosis section and real FAQ answers)                                                   |
| Service page                  | 450                       | 1468 ✅ (7 of 7, range 1380–1630, 2026-11-09 at `2b0d802` — the Sprint 5 depth modules plus the TOC since `98e38f0`; 1387 at `225ff45`, 167–173 before, ~152 on 2026-08-23)                                             |
| Location page                 | 350                       | 887 ✅ (14 of 14, range 714–1118, 2026-11-09 at `2b0d802` — the Sprint 6 `cityContent` modules, four retired in `7ed1acd`, a TOC on five since `98e38f0`; 842 over 18 at `7c3f2db`, 139–145 before, ~122 on 2026-08-23) |
| Blog post                     | 900                       | 518 ❌ (11 of 11 under the floor, range 447–582, 2026-11-09) — the post rewrite waits on owner-actions 3.8                                                                                                              |
| Guide (`/מדריכים/`)           | 900                       | built in Sprint 7 (`89439b7`): 4 pages, `belowFloor 0`, median 2470.5 unique (2026-11-09 at `2b0d802`, with the TOC; 2395.5 before); `lib/guides.ts` also throws below 900 at module load                               |
| Index page (services / areas) | 250                       | `/שירותים/` 1018 ✅ · `/איזורי-שירות/` 526 ✅ (456 at `7c3f2db`, rewritten for one region in `7ed1acd`) · `/blog/` 548 ✅ · `/מדריכים/` 870 ✅ — Sprints 6–7 `content/pages/` (336 and 101 before), as of 2026-11-09    |
| Pricing                       | 400                       | 914 ✅ (144 — the "what determines the price" pivot, N14; 945 before 4F cut the repeated visit band)                                                                                                                    |
| About                         | 500                       | 1197 ✅ (Sprint 6 `content/pages/about.ts` plus the TOC since `98e38f0`, 2026-11-09; 1145 at `7c3f2db`, 320 before, 277 on 2026-08-23)                                                                                  |
| Contact, legal, thank-you     | no minimum                | fine as-is                                                                                                                                                                                                              |

A block rendered identically on another route earns no credit anywhere — a service page that reuses
the homepage's `processSteps` gets nothing for those words, and the four "מתי כדאי לפנות אלינו"
bullets once shared by all seven service pages counted on exactly one page, not seven (per-service
`serviceTriggers` since `cfff52f`). The script lists the shared paragraphs it subtracted (1 as of
2026-11-09, the `FinalCta` body; 8 before Sprint 5). The threshold is three pages: since `225ff45` the
seven service-card descriptions render on `/` and `/שירותים/` only, so they count on both — which is
why `/שירותים/` and the homepage rose without new copy. A page-level reading, not the script, decides
whether an index has copy of its own — since Sprint 6.8 (`7c3f2db`) `/שירותים/`, `/איזורי-שירות/`
and `/אודות/` each render their own `content/pages/` module (1018, 526 and 1197 unique as of
2026-11-09 at `2b0d802`; 456 and 1145 at `7c3f2db`).

Word count is a floor, not a goal. A 500-word page that says five specific true things beats a
900-word page that says one thing five ways — and the 11 blog posts are the proof: they clear 500 words
each while containing no number, price, table or specification worth citing.

---

## 2. The doorway test — mandatory for every location page

> Take the page. Replace the city name with a different city name. Is it now a correct, publishable
> page for that other city?
>
> **If yes, it is a doorway page and must not ship.**

The measurable half is the **doorway delta**: the number of tokens a page carries that its nearest
sibling of the same type does not. `content-depth.mjs` computes it pairwise; the threshold is
`doorwayMinUniqueTokens: 120` in `thresholds.json`. As of 2026-08-23 every location scores **2**
(3 for the two-word names — the only variable is `${loc.name}`, interpolated into one shared
template) and the services scored **13–23**; both failed by an order of magnitude. The services
score 404–468 since their depth modules shipped in Sprint 5 (`225ff45`), and the 14 locations
292–439 (`locationMedianDelta 343`) since theirs shipped in Sprint 6 (`7c3f2db`) and four unserved
ones were retired in `7ed1acd` (owner-actions 3.6), as of 2026-11-09. The human half was open until the 2026-11-09 full audit put the
local-seo-strategist sign-off on record for all 14 (public knowledge only — the first-hand criteria
below are met on none). The five 🔶 entries that shipped as bounded pages
until 3.6 was answered are resolved — קריות, צפון, דרום and באר שבע retired with 301s, שרון kept.

```bash
node scripts/audit/content-depth.mjs        # per-page delta and nearest sibling in the failure detail
```

To pass, a location page needs at least **three** of these, and they must be true:

- Named neighbourhoods, streets, industrial zones or landmarks within the city.
- The local gate reality — villa streets with wide sliding gates, apartment blocks with shared parking
  barriers, moshav plots with long driveways and long cable runs, coastal towns where salt air eats
  tracks and motors faster.
- A real job reference from that city (with the customer's permission), or a photo (coming —
  business-facts §F).
- Travel and scheduling reality — how far it is, and whether the emergency claim genuinely holds at
  that distance. It was a real question for באר שבע, קריות and צפון until the owner said they are
  not served (owner-actions 3.6, 2026-11-09); for חיפה and אשקלון, served but far, the timing is
  still unconfirmed (business-facts §E).
- A city-specific FAQ that would read oddly anywhere else.
- Local pricing reality if it differs — as _what drives it_, never an invented number.

If none of those can be said truthfully about a city, **that city does not warrant a page.** Say so in
[business-facts.md](business-facts.md) §E rather than padding.

The same test applies to service pages with the service name swapped — `תריסי גלילה חשמליים` is not
even a gate, and since Sprint 5 its page is written with the shutter's own parts. The per-service
content lives in `content/services/<slug>.ts`, typed and checked by `lib/service-depth.ts`
(`serviceDepth`, built 2026-11-09 — `new-service`). The per-city content lives in
`content/locations/<slug>.ts`, typed and checked by `lib/city-content.ts` (`cityContent`, built
2026-11-09 in Sprint 6 — `new-city`); `content-depth.mjs` → `locationMedianDelta 343`, 14 of 14 at or
above the floor, as of 2026-11-09 at `2b0d802` (343.5 over 18 at `7c3f2db`).

---

## 3. Required blocks per page type

**Service page**

1. H1 = the service name.
2. Answer block (§5) — what this service is, in 40–60 words.
3. What it involves, concretely: which motor and drive suit this gate type at what weight and width,
   duration, what's included and excluded.
4. **Per-service** "when to call us" — `serviceTriggers` in `lib/content.ts` since `cfff52f`, not the
   shared four bullets that once put "השער נתקע" on the rolling-shutters page.
5. Process — may reuse `processSteps` but must add at least one service-specific step or caveat.
6. No per-service price — none is sourced (business-facts §D). Where a price is needed at all it is
   the visit band, interpolated from `visitFeeRange` (`priceRows`) — never restated as a literal; what
   moves the price is explained, as `/מחירון/` does since N14.
7. **Per-service FAQ**, 3–5 questions, feeding `FAQPage` — each Q/A on exactly one page sitewide.
8. Related services chosen by relevance, plus links to 2–3 locations (the seven pages declare 5–6
   each in `ServiceDepth.locations` since Sprint 5). A compact family block listing all types and
   all areas follows the curated lists ([ADR 0005](decisions/0005-family-link-block.md)); the
   curated lists stay chosen by relevance and stay first.
9. CTA.

**Location page**

1. H1 = `תיקון שערים חשמליים {prefixed}`.
2. Answer block — do we serve this city, how fast, at what cost.
3. Local substance — at least three items from §2.
4. Full service list with links. A compact family block listing all types and all areas follows the
   curated lists ([ADR 0005](decisions/0005-family-link-block.md)); they stay chosen by relevance
   and stay first.
5. Nearby locations (2–4 links) — or the one nearest published page when no other published place
   is near (חיפה, since the 2026-11-09 retirement of קריות and צפון). Never add a distant place to
   reach a count; a region pairs only with its own towns.
6. City-specific FAQ, 2–3 questions.
7. CTA.

**Blog post / guide**

1. H1 = the question or topic, verbatim.
2. Answer block in the first 60 words — the whole answer, before any preamble. None of the 11 existing
   posts do this; they all open with scene-setting (`content-depth.mjs` answer-block proxy: first
   paragraph outside 40–60 words on 36 of 36 service, location and post pages on 2026-08-23; on the
   11 posts only since Sprints 5, 6 and 7 gave the services, locations, statics and guides theirs, as
   of 2026-11-09).
3. Body with question-form `<h2>`s and real `<h3>`s — which needs the typed block model (ADR 0003,
   built for the guides in Sprint 7); the posts still use `PostBlock` (`{ type: "h" | "p" | "li"; text }`,
   every heading an `<h2>`) until their migration, which waits on owner-actions 3.8.
4. At least one captioned table, list or comparison a reader would screenshot.
5. `datePublished` / `dateModified`; the `Organization` as author — no byline until a real person is
   named (none is coming, business-facts §B).
6. Links to 2–3 services and 1–2 locations, in-copy with descriptive anchors.
7. CTA — after an unresolved-variable block, never mid-answer (`engagement-ux`).
8. **No migration debris** — see §9. Guides additionally pass `article-auditor`.

---

## 4. Brand voice

- **Tone:** אמין · מקצועי · רגוע · ענייני · נגיש. Confident without hype.
- **Person:** "אנחנו" / דן שערים חשמליים. Address the reader as "אתם" (plural formal).
- **Reading level:** clear for a homeowner or a ועד בית member aged 30–70, with depth where it builds
  trust. Sentences ≤ 25 words; an H2 at least every 200 words (`hebrew-editor` checks).
- **Favour:** אבחון לפני תיקון · מסבירים מה התקלה ומה צריך לתקן · בודקים לפי סדר (חשמל, שלט ומקלט,
  עיניות, לוח פיקוד, מנוע) · מה קובע את המחיר · אחריות על העבודה · התאמה אישית לשער · תיאום מועד
  בשעות הפעילות · מה אפשר לבדוק בעצמכם, ואיפה עוצרים.
- **Avoid:** "זול", superlatives without evidence, exclamation spam, heavy jargon, "פתרון קסם",
  "המובילים בישראל" (unprovable — and `claims-grep.mjs` fails on it).
- **Avoid — gated, not style:** each of these states a business fact that `docs/business-facts.md`
  does not confirm, so it is a §6 claim, never a phrase to favour. Speed and availability: "אבחון
  מהיר", "טכנאי באותו היום", "שירות חירום" (§E — the site handles urgent faults within the published
  hours only). Pricing policy: "מחיר שקוף", "בלי הפתעות", "מסבירים מה העלות לפני שמתחילים", "ללא
  התחייבות", and any line on when a quote is given or whether it binds (§D, owner-actions 3.4 — say
  what the price depends on instead). Parts and outcomes: "חלקי חילוף מקוריים" (§C), "תיקונים
  עמידים", "שמחזיקים לאורך זמן" (§D — a durability promise reads as a warranty scope; describe the
  method). A pointer to a price list ("המחירון המלא"): `/מחירון/` explains what determines the price
  and shows one number, the visit band. Mains work as the business's own: a new supply line to the
  gate is an electrician's work ("עבודה של חשמלאי, לא של טכנאי שערים"), never a licence claim.
- **Emoji:** a `✓` inside a UI element is fine. **Never in body copy** — the migrated blog uses 📌 and 💡
  as structure (`spam-grep.mjs` counts them); strip them rather than imitating them.
- **Reference line for the register:** _"השער נתקע או לא נסגר עד הסוף? טכנאי מגיע לאבחון, בודק את
  המנוע, את לוח הפיקוד ואת העיניות, ומסביר מה התקלה ומה צריך לתקן — עם אחריות על העבודה."_ It names
  the diagnosis and the allowed warranty wording, and states no price policy, availability or outcome.

---

## 5. The answer block (AEO)

Every service page, location page, post and guide opens with one. This is the unit an AI assistant or
a featured snippet lifts.

- Sits **directly under** a question-form heading.
- **40–60 words.** Shorter reads as thin; longer stops being extractable. `content-depth.mjs` measures
  the first paragraph as a proxy.
- Answers the question **completely in the first sentence.** No "there are several factors to
  consider" preamble.
- Self-contained — comprehensible with zero surrounding context, because that is how it will be quoted.
- Contains the concrete number, duration or price range where one exists — and only where it is
  sourced (§6).
- No pronouns referring outside the block.

**Good:**

> **למה השער החשמלי לא נסגר עד הסוף?**
> ברוב המקרים הסיבה היא עינית בטיחות מלוכלכת או לא מיושרת, שמזהה מכשול מדומה ועוצרת את התנועה. ניקוי
> עדשת העינית ויישור מחדש פותרים את התקלה בדקות. אם השער עדיין נעצר, הבעיה בדרך כלל בהגדרות מרחק
> הסגירה בלוח הפיקוד — שם נדרש טכנאי.

(Buyer vocabulary: **עינית**, not חיישן; **לוח פיקוד**, not לוח בקרה — [keyword-map.md](keyword-map.md) §2.)

**Bad** (this is how every existing blog post opens):

> שערים חשמליים הפכו בשנים האחרונות לפתרון פופולרי לבתים פרטיים ולעסקים כאחד. מעבר לנוחות שהם מספקים,
> הם מציעים רמת אבטחה גבוהה...

---

## 6. Claims — what may be stated as fact

**Free to state** (verified in the manifest or the code): the phone number `072-2587772`, the email,
opening hours, the 7 services, the 14 locations, the 150–350 ₪ technician visit fee, and the service
area as written in the manifest.

**Gated on [business-facts.md](business-facts.md)** — mark `// 🔶 confirm` and never state as fact
until confirmed. The owner has said most of these are **not coming**, so write around them:

- "ניסיון רב שנים" or any duration of experience (`foundedYear` is `null`, and stays so)
- Warranty length, scope or exclusions — write **"אחריות על העבודה"**, never "אחריות מלאה"
- **Every per-gate price range** — none is sourced; the eight authored estimates left `/מחירון/`
  with N14 (`af8ba4c`), and `priceRows` keeps only the 🔶 visit band
- 24/7 emergency availability, and any response-time promise
- "פריסה ארצית" as a coverage claim
- Licences, insurance, certifications, association membership
- Any named person
- Superlatives: "המובילים", "הטובים ביותר", "מספר 1" — never permitted
- Absolute workmanship promises: "ללא פשרות", "מצוינות בכל…", "שום חלק לא מוחלף לפני…" — never
  permitted; describe the check order instead (lexicon id `workmanship-absolute` since `9195c9b`,
  which matches the first two kinds; the rest is `claims-verifier` judgment)
- Pricing policy — when a quote is given, whether it binds, no-obligation or free terms, a visit fee
  credited against the repair — and durability promises about the work (lexicon ids
  `quote-before-work`, `no-obligation`, `durability-promise`, mapped to the §D rows "What the price
  includes / excludes", "Is the visit fee waived on repair" and "Warranty scope + exclusions"; the
  pricing ids match the phrasings the 2026-11-09 audit found, and since `379eb0e` `durability-promise`
  matches the class — any form of a guarantee (יבטיח, תבטיח, מבטיחים, or תוכלו / נוכל / יכולים
  להבטיח, תוכלו ליהנות) followed in the same sentence by לאורך / למשך זמן or שנים; a purpose clause
  (כדי להבטיח…) is advice and stays outside; a credited visit fee, a binding quote, a price ceiling
  and a quote by phone are `claims-verifier` judgment). Say what the price depends on and how
  the work is done, never when the price is given or how long the repair lasts
- A pointer to a full or published price list ("בקרו במחירון המלא", "מחירון השירותים שלנו") —
  `/מחירון/` explains what determines the price and shows only the visit band since N14 (lexicon id
  `price-list-pointer`, mapped to the §D row "Real price range per service"). Point at what the
  page explains — what sets the cost — and tie the pointer to the block before it: a check that
  turned up a fault, a repair the reader is weighing, a part the section just described. Never drop
  one fixed sentence after unrelated blocks; a pointer that would read the same after any list is
  filler

**The claim lexicon is mechanical.** `scripts/audit/claims.json` maps each of those phrases to its
business-facts row and status; the PostToolUse hook (`.claude/hooks/post-edit-lint.ps1`) warns the
moment one is written into `lib/content.ts`, `lib/posts.ts` or `content/**`, and
`node scripts/audit/claims-grep.mjs` fails the audit while a 🔶/⛔ phrase is live in `out/`.
`claims-verifier` reviews every copy diff against the same file.

**Never permitted:** an invented customer name or quote; a rating without a public source; a
certification the business doesn't hold; a photo presented as our work that isn't.

> ✅ **Resolved 2026-08-17 — history.** The site shipped ten review texts attributed to ten real
> reviewer names as `Review` + `AggregateRating`. `reviews` is now empty and gated behind
> `REVIEW_SOURCE_URL` (`reviews` and `REVIEW_SOURCE_URL` in `lib/content.ts`; `components/marketing/Reviews.tsx:41`). Do not
> cite it as precedent, and restore only verbatim text from the GBP when it lands (business-facts §A).

---

## 7. Hebrew mechanics

- Israeli formats: phone `072-2587772`, currency `₪` after the number, dates `dd/mm/yyyy`.
- Hebrew abbreviations use גרש `׳` and גרשיים `״` — `רח׳`, `ח״פ` — not straight ASCII quotes, and not
  the curly `’`/`”` the migrated blog once wrapped brand names in (the last 4 went in `74a92d1`;
  `spam-grep.mjs` → `curlyQuotes 0`).
- Numerals stay LTR inside RTL text; the components wrap them with `dir="ltr"` and the `.ltr` helper.
  Write the plain number; don't add markup in `content.ts`.
- Ranges use an en dash: `3–6 שעות`, `150–350 ₪`.
- No language mixing mid-sentence. English brand or material names get their own clause.
- Copy lives in `lib/content.ts` (marketing), `lib/posts.ts` (the 11 legacy posts) and
  `content/guides/` (guides, since Sprint 7), never in JSX.

---

## 8. Hebrew grammar for locations

`locations` mixes cities with **regions** — one since `7ed1acd`, שרון (קריות, צפון and דרום were
retired, owner-actions 3.6) — and until Sprint 6 templates
interpolated a bare `ב${loc.name}`, producing `בשרון` and `בצפון`. Correct Hebrew is `באזור השרון` and `בצפון הארץ`. Every
entry in `locations` (`lib/site-config.ts`) carries `kind`, `prefixed` and its own `updated` since
Sprint 6 (2026-11-09); templates and `content/locations/*.ts` use `prefixed`, never a bare `ב` + name.

---

## 9. Migrated-content hygiene

`lib/posts.ts` came from a compromised WordPress site. Status as of 2026-08-23
(`node scripts/audit/spam-grep.mjs`):

- [x] No injected spam — `spamHits: 0`. The PostToolUse hook re-checks every edit.
- [x] No run-together words from stripped markup — `fusedWords: 0`.
- [x] The duplicated "פוסטים קשורים" tail is gone — `relatedTails: 0`.
- [x] No leftovers from the source theme (`allgatesrepair`) — 0.
- [ ] **42 plain-text link references** ("📌 היכנסו למחירון", "בקרו בעמוד צור קשר") are still not links
      — needs the posts moved onto the typed block model (ADR 0003, built for the guides in Sprint 7;
      backlog §3.8, ⏳ BLOCKED · owner 3.8).
- [x] No curly quotes, no empty `מקרי מבחן` section, no superlatives — `curlyQuotes 0`,
      `superlative 0` since Sprint 4 (`1796ee7` `74a92d1`).
- [ ] 39 structural emoji and a flat all-`<h2>` outline (Sprint 7.3; backlog §3.8, §3.10).

Sanity check (must print nothing):

```bash
grep -rniE 'onlyfans|leaked|casino|porn|allgatesrepair' lib/posts.ts out/blog
```

---

## 10. Before publishing

- [ ] Meets the §1 word floor with genuinely unique copy — `content-depth.mjs`, not a hand count.
- [ ] Passes the §2 doorway test — delta ≥ 120 measured, not assumed.
- [ ] Has every required block from §3.
- [ ] Opens with a §5 answer block.
- [ ] Every claim is either free (§6) or marked 🔶 with a row in `business-facts.md` —
      `claims-grep.mjs` = 0 on the page.
- [ ] Title and description follow [keyword-map.md](keyword-map.md) and **don't double the brand**
      (`titles.mjs`).
- [ ] Exactly one H1; heading order unbroken (`links.mjs`).
- [ ] Links out to 2+ internal pages with descriptive anchors.
- [ ] Prices interpolate from `priceRows` rather than restating a literal.
- [ ] If it's a legacy post, §9 passes; if it's a guide, `article-auditor` says publishable.
- [ ] Reviewed by `hebrew-editor`, then `claims-verifier` — the writer never reviews itself.
