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

"Today" is the script's median for the type as of **2026-08-23**. Re-run before quoting.

| Page type                     | Minimum unique body words | Today (`content-depth.mjs`)                                                                                    |
| ----------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Homepage                      | 800                       | ~675 ❌ (887 total, 212 in shared blocks; the reviews section is gone)                                         |
| Service page                  | 450                       | ~152 ❌ (7 of 7)                                                                                               |
| Location page                 | 350                       | ~122 ❌ (18 of 18; 128 for the two-word names)                                                                 |
| Blog post                     | 900                       | ~512 ❌ (11 of 11, range 438–584)                                                                              |
| Guide (`/מדריכים/`)           | 900                       | route family not built yet (Phase 4)                                                                           |
| Index page (services / areas) | 250                       | `/שירותים/` ~111 ❌ (323 total — its copy is all shared teasers) · `/איזורי-שירות/` ~111 ❌ · `/blog/` ~392 ✅ |
| Pricing                       | 400                       | 144 ❌                                                                                                         |
| About                         | 500                       | 277 ❌                                                                                                         |
| Contact, legal, thank-you     | no minimum                | fine as-is                                                                                                     |

A block rendered identically on another route earns no credit anywhere — a service page that reuses
the homepage's `processSteps` gets nothing for those words, and the four shared "מתי כדאי לפנות
אלינו" bullets hardcoded at `app/services/[service]/page.tsx:43-48` count on exactly one page, not
seven. The script lists the shared paragraphs it subtracted (8 as of 2026-08-23).

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
template) and the services score **13–23**. Both fail by an order of magnitude.

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
  that distance. For באר שבע, קריות and צפון that is a real question (business-facts §E).
- A city-specific FAQ that would read oddly anywhere else.
- Local pricing reality if it differs — as _what drives it_, never an invented number.

If none of those can be said truthfully about a city, **that city does not warrant a page.** Say so in
[business-facts.md](business-facts.md) §E rather than padding.

The same test applies to service pages with the service name swapped — `תריסי גלילה חשמליים` is not
even a gate. The per-city and per-service content lands in `cityContent` / `serviceDepth` in
`lib/content.ts` — fields that **do not exist yet** (Phase 3, `new-city` / `new-service`).

---

## 3. Required blocks per page type

**Service page**

1. H1 = the service name.
2. Answer block (§5) — what this service is, in 40–60 words.
3. What it involves, concretely: which motor and drive suit this gate type at what weight and width,
   duration, what's included and excluded.
4. **Per-service** "when to call us" — not the shared four bullets currently hardcoded at
   `app/services/[service]/page.tsx:43-48`, which put "השער נתקע" on the rolling-shutters page.
5. Process — may reuse `processSteps` but must add at least one service-specific step or caveat.
6. Price range for this service, interpolated from `priceRows` — never restated as a literal.
7. **Per-service FAQ**, 3–5 questions, feeding `FAQPage` — each Q/A on exactly one page sitewide.
8. Related services chosen by relevance, plus links to 2–3 locations.
9. CTA.

**Location page**

1. H1 = `תיקון שערים חשמליים {prefixed}`.
2. Answer block — do we serve this city, how fast, at what cost.
3. Local substance — at least three items from §2.
4. Full service list with links.
5. Nearby locations (2–4 links).
6. City-specific FAQ, 2–3 questions.
7. CTA.

**Blog post / guide**

1. H1 = the question or topic, verbatim.
2. Answer block in the first 60 words — the whole answer, before any preamble. None of the 11 existing
   posts do this; they all open with scene-setting (`content-depth.mjs` answer-block proxy: first
   paragraph outside 40–60 words on 36 of 36 service, location and post pages).
3. Body with question-form `<h2>`s and real `<h3>`s — which needs the typed block model (Phase 4,
   ADR 0003); today `PostBlock` is `{ type: "h" | "p" | "li"; text }` and every heading is an `<h2>`.
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
- **Favour:** אבחון מהיר · טכנאי באותו היום · שירות חירום · אחריות על העבודה · מחיר שקוף · בלי הפתעות ·
  התאמה אישית לשער · חלקי חילוף מקוריים.
- **Avoid:** "זול", superlatives without evidence, exclamation spam, heavy jargon, "פתרון קסם",
  "המובילים בישראל" (unprovable — and `claims-grep.mjs` fails on it).
- **Emoji:** a `✓` inside a UI element is fine. **Never in body copy** — the migrated blog uses 📌 and 💡
  as structure (42 of them, `spam-grep.mjs`); strip them rather than imitating them.
- **Reference line for the register:** _"השער נתקע או לא נסגר עד הסוף? טכנאי מגיע לאבחון, מסביר מה
  התקלה ומה העלות לפני שמתחילים — עם אחריות על העבודה."_

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
opening hours, the 7 services, the 18 locations, the 150–350 ₪ technician visit fee, and the service
area as written in the manifest.

**Gated on [business-facts.md](business-facts.md)** — mark `// 🔶 confirm` and never state as fact
until confirmed. The owner has said most of these are **not coming**, so write around them:

- "ניסיון רב שנים" or any duration of experience (`foundedYear` is `null`, and stays so)
- Warranty length, scope or exclusions — write **"אחריות על העבודה"**, never "אחריות מלאה"
- **Every per-gate price range** — `lib/content.ts:152-156` records them as authored estimates
- 24/7 emergency availability, and any response-time promise
- "פריסה ארצית" as a coverage claim
- Licences, insurance, certifications, association membership
- Any named person
- Superlatives: "המובילים", "הטובים ביותר", "מספר 1" — never permitted

**The claim lexicon is mechanical.** `scripts/audit/claims.json` maps each of those phrases to its
business-facts row and status; the PostToolUse hook (`.claude/hooks/post-edit-lint.ps1`) warns the
moment one is written into `lib/content.ts`, `lib/posts.ts` or `content/**`, and
`node scripts/audit/claims-grep.mjs` fails the audit while a 🔶/⛔ phrase is live in `out/`.
`claims-verifier` reviews every copy diff against the same file.

**Never permitted:** an invented customer name or quote; a rating without a public source; a
certification the business doesn't hold; a photo presented as our work that isn't.

> ✅ **Resolved 2026-08-17 — history.** The site shipped ten review texts attributed to ten real
> reviewer names as `Review` + `AggregateRating`. `reviews` is now empty and gated behind
> `REVIEW_SOURCE_URL` (`lib/content.ts:242`, `:248`; `components/marketing/Reviews.tsx:41`). Do not
> cite it as precedent, and restore only verbatim text from the GBP when it lands (business-facts §A).

---

## 7. Hebrew mechanics

- Israeli formats: phone `072-2587772`, currency `₪` after the number, dates `dd/mm/yyyy`.
- Hebrew abbreviations use גרש `׳` and גרשיים `״` — `רח׳`, `ח״פ` — not straight ASCII quotes, and not
  the curly `’`/`”` the migrated blog wraps brand names in (4 remain, `lib/posts.ts:848-849`).
- Numerals stay LTR inside RTL text; the components wrap them with `dir="ltr"` and the `.ltr` helper.
  Write the plain number; don't add markup in `content.ts`.
- Ranges use an en dash: `3–6 שעות`, `800–1,500 ₪`.
- No language mixing mid-sentence. English brand or material names get their own clause.
- Copy lives in `lib/content.ts` (marketing), `lib/posts.ts` (the 11 legacy posts) and
  `content/guides/` (guides, Phase 4), never in JSX.

---

## 8. Hebrew grammar for locations

`locations` mixes cities with **regions** — קריות, שרון, צפון, דרום — and templates interpolate a bare
`ב${loc.name}`, producing `בשרון` and `בצפון`. Correct Hebrew is `באזור השרון` and `בצפון הארץ`. Add a
`prefixed` field rather than hand-patching a string; see the `new-city` skill. The field does not exist
yet (Phase 3).

---

## 9. Migrated-content hygiene

`lib/posts.ts` came from a compromised WordPress site. Status as of 2026-08-23
(`node scripts/audit/spam-grep.mjs`):

- [x] No injected spam — `spamHits: 0`. The PostToolUse hook re-checks every edit.
- [x] No run-together words from stripped markup — `fusedWords: 0`.
- [x] The duplicated "פוסטים קשורים" tail is gone — `relatedTails: 0`.
- [x] No leftovers from the source theme (`allgatesrepair`) — 0.
- [ ] **42 plain-text link references** ("📌 היכנסו למחירון", "בקרו בעמוד צור קשר") are still not links
      — needs the typed block model (Phase 4, ADR 0003; backlog §3.8).
- [ ] 4 curly quotes (`lib/posts.ts:848-849`), 42 structural emoji, an empty `מקרי מבחן` section
      (`:416-418`), two superlatives (`:319`, `:557`), a flat all-`<h2>` outline.

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
