# Content calendar — the `/מדריכים/` pillar/spoke map and build order

What gets written next, in what order, and why that order. `content-hub` decides whether a topic
earns a page; `/new-guide <family> <slug>` builds it; `article-auditor` gates it; this file is the
queue. `keyword-researcher` feeds it from [keyword-map.md](keyword-map.md) §13 candidates;
`hebrew-copywriter` drafts against [content-standards.md](content-standards.md).

**State as of 2026-08-23:** the hub does not exist. There is no `app/מדריכים/`, no `lib/guides.ts`,
no `content/guides/`, and the only editorial model is `PostBlock = {type: "h" | "p" | "li"; text}`
in `lib/posts.ts`. Phase 4 builds the route family and the block model
([decisions/0002](decisions/0002-guides-hub-route.md), [0003](decisions/0003-block-content-model.md))
and ships the first four guides with it. Every row below is therefore **planned**; nothing is
drafting. `node scripts/audit/content-depth.mjs` is the measurement once pages exist.

**Status key:** planned · drafting · review (`article-auditor` + `hebrew-editor` + `claims-verifier`)
· published. **Owner-facts column:** 🔶 = a [business-facts.md](business-facts.md) row the guide
would like but is written around; ❌ = not coming, never wait for it.

---

## 1. The five pillars

The 7 service pages own "what we do, buy it"; the 18 location pages own "we do it near you". The hub
owns **"what is wrong, what should I choose, what does the law require"** — the Tier-3/4 families in
keyword-map §2 and §8 that no page on this site serves today.

| Pillar        | `pillar` value | Families   | Owns                                                                               | Hands off to                                    |
| ------------- | -------------- | ---------- | ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| תקלות         | `faults`       | symptom    | one symptom per URL, DIY diagnosis first, then the safety gate (keyword-map §11.3) | the matching gate-type service page + a city    |
| רכיבים        | `parts`        | component  | one part per URL — role, failure modes, when it is replaced                        | `/מחירון/` (what drives the price), the service |
| בחירה         | `choice`       | comparison | gate-type matrices, מינוע שער קיים, repair-vs-replace, brands (🔶)                 | the two or three services being compared        |
| בטיחות ותקנים | `safety`       | safety     | ת״י 900 חלק 21.03, liability, the conformity checklist, periodic checks            | every service; `/אודות/` (`knowsAbout`)         |
| ועד בית       | `committee`    | committee  | shared car parks, barrier approval, owners' majority, B2B procurement              | שער-זרוע · שערים-לחניה · שערים-לדירה            |

Rules that apply to every spoke: no guide title equals a service `name` or matches `{service} ב{city}`
(that phrase space belongs to the silos; `lib/guides.ts` throws on it in Phase 4); one Q/A string in
exactly one `FAQPage` sitewide; every guide declares `relatedServices` and appears on those service
pages through the reverse index, so an orphan is impossible; a guide that names a city uses
`loc.prefixed` (a Phase 3 field — until then, name no region).

---

## 2. The first eight — build order

Ordered by evidence strength × how under-served the query is × how little owner input it needs.
Target queries are **evidenced phrasings** from keyword-map §2/§8/§12 — pages competitors built, not
volumes; no volume exists for any of them and none may be added without a data source.

| #   | Pillar        | Family     | Working title (Hebrew)                                                      | Target query                                    | Evidence                                                               | Links down to                                                         | Status  | Owner facts needed                                                                                                                                                    |
| --- | ------------- | ---------- | --------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | בטיחות ותקנים | safety     | ת״י 900 חלק 21.03 — מה התקן דורש משער חשמלי, ומי אחראי כשהוא לא עומד בו     | `תקן שערים חשמליים` · `ת״י 900 שער חשמלי`       | §12 (sii.org.il; one competitor's flagship guide cites UL 325 instead) | all 7 services; `/אודות/`                                             | planned | none — buildable now. Two **external** facts to verify on sii.org.il / gov.il before publish: the 2006 date, whether a licensed electrician is legally required (§12) |
| 2   | תקלות         | symptom    | שער חשמלי רועש או חורק — מאיפה הרעש מגיע ומה לבדוק לפני שקוראים לטכנאי      | `שער חשמלי רועש` · `שער חשמלי חורק`             | §2 Tier 3, §8.1 — no standalone page anywhere in the market            | שערים-נגררים (גלגלים/מסילה) · שערי-כנף (צירים/בוכנה) · שערים-מתרוממים | planned | none. Visit fee interpolates from `priceRows` (`lib/content.ts:157`); whether it is current is 🔶 (§D)                                                                |
| 3   | ועד בית       | committee  | מחסום חניה בבית משותף — מה ועד הבית צריך לאשר, ומתי נדרש רוב של בעלי הדירות | `מחסום חניה ועד בית` · `התקנת מחסום בבית משותף` | §8.6 (communal property → committee approval)                          | שער-זרוע · שערים-לחניה · שערים-לדירה                                  | planned | none. The approval/majority thresholds must cite the law text (gov.il/nevo), not a competitor — `claims-verifier`                                                     |
| 4   | בחירה         | comparison | שער נגרר, שער כנף או שער קונזולי — איזה שער מתאים לכניסה שלכם               | `שער קונזולי` · `שער נגרר או כנף`               | §8.4, §8.8, §11.6 (competitors run the matrix)                         | שערים-נגררים · שערי-כנף · שערים-לחניה                                 | planned | 🔶 does the business install cantilever gates — shapes the CTA, not the content. No 8th service (CLAUDE.md §12)                                                       |
| 5   | תקלות         | symptom    | שער חשמלי לא נסגר עד הסוף — מה לבדוק, לפי הסדר                              | `שער חשמלי לא נסגר`                             | §2 Tier 3 (midrag, pro.co.il, masgernet)                               | שערים-נגררים · שערי-כנף · guide #7 (עינית)                            | planned | none. The content-standards §5 "good" answer block is this exact question — reuse it                                                                                  |
| 6   | תקלות         | symptom    | השער החשמלי לא מגיב לשלט — סוללה, קידוד או מקלט: איך מבדילים בלי ציוד       | `שער חשמלי לא מגיב לשלט`                        | §2 Tier 3 ("multiple")                                                 | שערים-לחניה · שערים-לדירה · guide #13 (שכפול שלט)                     | planned | none. Seeded from the legacy post `שער-חשמלי-לא-מגיב` (§4)                                                                                                            |
| 7   | רכיבים        | component  | עינית לשער חשמלי — מה היא עושה, למה היא נכשלת ומתי מחליפים אותה             | `עינית לשער חשמלי` · `פוטוצל לשער`              | §2 Tier 4 (עינית, not חיישן)                                           | guide #5 · guide #1 · שערים-לחניה · `/מחירון/`                        | planned | ❌ replacement price — write "what determines the price" (§10)                                                                                                        |
| 8   | בחירה         | comparison | מינוע שער קיים — האם אפשר להפוך שער ידני לחשמלי, ומתי עדיף להחליף           | `מינוע שער קיים` · `הפיכת שער רגיל לשער חשמלי`  | §8.3                                                                   | שערים-נגררים · שערי-כנף · `/מחירון/`                                  | planned | ❌ price — write around; 🔶 motor brands fitted (§C) — name none until confirmed                                                                                      |

Why this order: #1 is the strongest E-E-A-T asset available and needs **no** owner input — it makes
the site the one Hebrew page that combines the SII fatality record, the ₪800,000 judgment, the
criminal-offence framing, the insurance consequence and a checklist (§12). #2 is the only query in the
map with **no standalone page anywhere**. #3 speaks to an audience the site names and never serves.
#4 is the first page that can mention קונזולי at all. #5–#6 are the highest-urgency symptom queries.
#7 is the first component page and the natural link target of #5 and #1. #8 is an installation-value
job rather than a small repair. Phase 4 ships #1–#4 with the hub; #5–#8 follow at cadence.

---

## 3. The next eight

| #   | Pillar | Family     | Working title (Hebrew)                                                     | Target query                                   | Evidence                                         | Seeds / notes                                                                                                                                                                   | Owner facts needed                                             |
| --- | ------ | ---------- | -------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 9   | רכיבים | component  | לוח פיקוד לשער חשמלי — תפקיד, תסמיני כשל, ומה בודקים לפני שמחליפים         | `לוח פיקוד לשער חשמלי` · `כרטיס אלקטרוני לשער` | §2 Tier 4                                        | links to #5, #6, #10                                                                                                                                                            | ❌ price                                                       |
| 10  | תקלות  | symptom    | שער חשמלי לא נפתח — חשמל, שחרור ידני, עינית או מנוע: סדר הבדיקה            | `שער חשמלי לא נפתח` · `שער כנפיים לא נפתח`     | §2 Tier 3 (midrag Expanel/806)                   | keep clearly apart from #5 and #11 — each owns one symptom                                                                                                                      | none                                                           |
| 11  | תקלות  | symptom    | הפסקת חשמל והשער לא נפתח — שחרור חירום ומפתח נטרול, לפי סוג השער           | `הפסקת חשמל שער חשמלי` · `שחרור חירום שער`     | §2 Tier 3 (shearim, hisherik)                    | takes the manual-release material out of the legacy `שער-חשמלי-לא-מגיב`; cross-links #1 (emergency instructions are a ת״י 900 item)                                             | 🔶 whether a backup battery is offered on installs             |
| 12  | בחירה  | comparison | לתקן או להחליף שער חשמלי — מה מכריע את ההחלטה                              | `החלפה או תיקון שער חשמלי`                     | backlog §6.3; keyword-map §10                    | rewrite of the legacy `החלפה-או-תיקון-שער-חשמלי` (§4); the decision table is the citable asset                                                                                  | ❌ prices; 🔶 motor warranty terms the business passes on (§D) |
| 13  | רכיבים | component  | שלט לשער חשמלי — שכפול, קידוד ושלט אוניברסלי: מה אפשר לעשות לבד            | `שכפול שלט לשער חשמלי` · `תכנות שלט לשער`      | §2 Tier 4 (midrag runs a guide and a price page) | links from #6                                                                                                                                                                   | ❌ price                                                       |
| 14  | רכיבים | component  | מנוע לשער חשמלי — נגרר, כנף, מתרומם: איך בוחרים לפי משקל ורוחב             | `מנוע לשער חשמלי` · `מנוע לשער נגרר`           | §2 Tier 1 + Tier 4                               | the motor-class material #8 points at; never restate a supply-and-fit figure                                                                                                    | ❌ price; 🔶 brands (§C)                                       |
| 15  | רכיבים | component  | גלגלים, מסילה ופס שיניים לשער נגרר — הבלאי שמייצר את רוב התקלות            | `גלגלים לשער נגרר` · `פס שיניים לשער`          | §2 Tier 4                                        | links from #2 and #5; sliding-gate only                                                                                                                                         | ❌ price                                                       |
| 16  | בחירה  | brand      | מותגי מנועים לשערים — BFT, Nice, Somfy, Beninca: מה ההבדל ומה אנחנו מתקנים | `מנוע BFT` · `מנוע Nice לשער`                  | §9                                               | **🔶 blocked** — one page per brand is honest only for brands the business services (§9 warning); until §C is answered, at most one overview page that names no brand as "ours" | 🔶 brands serviced / manufacturer training (§C)                |

**Not earning a guide — handled elsewhere:** `מחסום` as a concept (§8.5) is a transactional term →
the שער-זרוע service page's title/H1 (`new-service`, Phase 3), not a guide. `דלת מוסך פנלים` (§8.4)
would be an 8th service and is capped by CLAUDE.md §12 until the 7 pass the doorway test. `כמה עולה`
queries → `/מחירון/` pivoted to "what determines the price" (§10), not a guide with a number in it.
`{service} ב{city}` cells → never (keyword-map §6).

---

## 4. The 11 legacy posts — keep, fold, or redirect

`/blog/` holds 11 posts migrated from the compromised WordPress site (golden rule 7). As of
2026-08-23 the repo and `out/` are clean of spam (`spam-grep.mjs`: 0 hits, 0 fused words, 0 dead
tails) — and since the Sprint 0 deploy on 2026-09-06 so is the **live domain** (until then one post
still served the injected token and all 11 ended in the dead "פוסטים קשורים" tail —
[growth-roadmap.md](growth-roadmap.md) §1). In the clean build, **all 11 are under the 900-word
floor** (438–584 unique words), all 11 open with scene-setting instead of an answer block, every
heading renders `<h2>` (`app/blog/[slug]/page.tsx:55-59`), 42 in-copy link phrases are still plain
text, 4 Latin curly quotes remain at `lib/posts.ts:848-849`, and 42 emoji (💡 ×33) are used as
structure. Two clusters of three posts each cover one topic under three titles (benefits;
maintenance).

The decisions below are a **proposal**. Rewriting migrated posts needs owner approval
([owner-actions.md](owner-actions.md) §3.8; business-facts §G). Until the hub exists every post stays
where it is; ADR 0002 moves a post to `/מדריכים/` only once it is rewritten to the bar, with a 301.

| Post (`/blog/…/`)           | Published  | Decision        | Goes to                                                                    | Why                                                                                                                               |
| --------------------------- | ---------- | --------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| שערים-חשמליים-השקעה         | 29/10/2025 | keep + migrate  | stays in `/blog/`, block model, absorbs a לעסק section                     | newest, broadest "is it worth it" piece; the survivor of the three benefits posts                                                 |
| תקלות-נפוצות-בשערים-חשמליים | 30/09/2025 | fold into guide | the תקלות pillar overview in `/מדריכים/`, 301                              | `תקלות נפוצות בשערים חשמליים` is an evidenced route (§2: elrongates, masgernet, peretztec); the overview links each symptom guide |
| שדרוג-לשער-חשמלי-חכם        | 02/09/2025 | keep + migrate  | stays in `/blog/`, block model; last in the queue                          | distinct topic (app/intercom control); no evidenced query → demote to 301 → #8 if the first GSC ingest shows no impressions       |
| בטיחות-שער-חשמלי-3-שלבים    | 04/08/2025 | fold into guide | guide #1 (ת״י 900), 301                                                    | a generic safety post next to the standards page would cannibalise the site's strongest E-E-A-T asset                             |
| שער-חשמלי-חוסך-זמן          | 05/07/2025 | 301             | `/blog/שערים-חשמליים-השקעה/`                                               | same argument as the survivor; carries the empty `מקרי מבחן` section that claims data it does not have (backlog §3.11)            |
| תחזוקה-מונעת-לשערים-חשמליים | 08/06/2025 | keep + migrate  | stays in `/blog/`, block model, pillar תקלות (prevention)                  | the most specific of the three maintenance posts; gains the inspection checklist and links to #2, #7, #15                         |
| יתרונות-שער-חשמלי-לעסק      | 12/05/2025 | 301             | `/blog/שערים-חשמליים-השקעה/` (its לעסק section)                            | benefits post #2 of 3; the B2B angle that has real demand is ועד בית (guide #3), not generic "for your business"                  |
| חשיבות-תחזוקת-שערים-חשמליים | 12/05/2025 | 301             | `/blog/תחזוקה-מונעת-לשערים-חשמליים/`                                       | maintenance post #2 of 3, shares a publish date with the one above                                                                |
| החלפה-או-תיקון-שער-חשמלי    | 16/04/2025 | fold into guide | guide #12, 301                                                             | the one post with a decision question; carries the 4 curly quotes (`lib/posts.ts:848-849`) and a `למה לבחור ב…` section to drop   |
| שער-חשמלי-לא-מגיב           | 23/02/2025 | fold into guide | guide #6 (the remote half) + #11 (the power/manual-release half), 301 → #6 | one legacy post, two evidenced symptoms; splitting is what makes each rank                                                        |
| שער-חשמלי-שעובד-כמו-חדש     | 30/01/2025 | 301             | `/blog/תחזוקה-מונעת-לשערים-חשמליים/`                                       | maintenance post #3 of 3                                                                                                          |

Net: 3 keep + migrate, 4 fold into a guide, 4 plain 301s — `/blog/` shrinks from 11 to 3 posts and
the hub starts with 4 seeded guides. **Redirect mechanics:** the 11 legacy WordPress URLs already
map to `/blog/<slug>/` in `REDIRECTS.md` §2. When a post folds, point the **legacy** row straight at
the final destination (one hop, not a chain through `/blog/`), and add the `/blog/<slug>/` → target
line alongside. Phase 1 replaces the 37 meta-refresh stubs with `public/_redirects`
([decisions/0004](decisions/0004-redirects-replace-stubs.md)); until it lands, every new redirect is
one more stub from `node scripts/gen-redirects.mjs`, so batch the blog moves after Phase 1.

---

## 5. Cadence and sequencing

- **Two guides a month** after Phase 4 ships the hub with #1–#4. At that rate #5–#8 land within two
  months of the hub and #9–#16 within six. The constraint is drafting quality and the review chain,
  not the calendar.
- **Phase dependency:** Phase 3 first (`cityContent`, `serviceDepth`, `prefixed`, the header and
  footer reaching all 18 locations) so guides have deep pages to link down to; Phase 4 builds the hub
  and migrates the block model; guides #5+ run alongside Phases 5–7.
- **No seasonality is evidenced** for this trade. Symptom queries are urgent and year-round; do not
  plan around a season until [rank-tracking.md](rank-tracking.md) shows one.
- **Refresh beats republish.** A guide whose `dateModified` moves because its table was updated is
  worth more than a 17th guide. Bump #1 whenever sii.org.il changes; bump #7/#9/#13–#15 whenever the
  `/מחירון/` "what drives the price" copy changes.
- **Re-order on evidence, not on taste.** `keyword-researcher` proposes a new row into keyword-map
  §13 with a source URL; `content-hub` runs the "does it earn a page" test; only then does a row move
  here. The first Search Console ingest (`scripts/audit/gsc-ingest.mjs`, blocked on owner-actions §2.3)
  re-ranks §2–§3 by observed impressions per family.

---

## 6. Rules — the gates every row passes through

1. **No guide before `content-hub` says it earns a page**: a decision question, something specific
   and true a competitor cannot say, outside the silos' phrase space, and containing a table,
   comparison or number. Any "no" means it is a paragraph on an existing page.
2. **`article-auditor` gates publication**: 900 genuinely unique words, one 40–60 word answer block
   in the first two blocks, question-form H2s, at least one captioned citable table, no cannibalisation
   against the 7 services, 18 locations, `/מחירון/` or another guide, reverse-index entry, link mesh.
3. **Review chain for every draft:** `hebrew-editor` → `claims-verifier` → `article-auditor`. A live
   🔶/⛔ claim is stop-ship (`node scripts/audit/claims-grep.mjs`).
4. **The dangates 🔶 list** the auditors apply: the ₪150–350 visit fee is the only sourced price and
   is itself 🔶 current; no per-job price; no warranty term ("אחריות על העבודה", never "מלאה" with a
   number); no licence, insurance or founding year; no named person — `author` stays the
   `Organization`; WhatsApp on the lead number is unconfirmed; 24/7 and "פריסה ארצית" are bounded
   claims. External facts (ת״י 900, חוק החשמל) cite sii.org.il or gov.il, never a competitor.
5. **Every H2 in the hub is unique across all guides** — and the body under a similar heading is
   written from that guide's angle. The doorway test applies inside the hub exactly as it does across
   the 18 location pages.
6. **Never rename a published slug without a 301.** Never add a `{service} ב{city}` cell.
7. **Status moves only with evidence:** planned → drafting when the `content/guides/<slug>.ts` file
   exists; → review when the three reviewers are invoked; → published when `npm run gate` passes on
   the build that contains it and the sitemap lists it.
