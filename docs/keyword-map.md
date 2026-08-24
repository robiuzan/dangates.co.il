# Keyword map — דן שערים חשמליים

The intent model behind every route, and the Hebrew title/H1/description formulas that express it.
`seo-metadata`, `local-seo-il` and `hebrew-copywriter` all resolve against this file.

> **Evidence status (2026-08-17).** §2 and §8–§10 are now based on a competitor and query-space audit of
> the live Israeli market. Every keyword listed is **evidenced by a real page, URL or result title** —
> someone has built a page for it. That is demand _evidence_, not volume.
>
> **There are no search-volume figures in this file and none should be added without a real data
> source.** Two further limits: the search tool used was US-based, so the _competitor set_ is verified
> but the _rank order_ is not; and competitor JSON-LD could not be inspected (markdown conversion strips
> it), so schema claims about competitors are unverified.

---

## 1. The head term

**תיקון שערים חשמליים** is the flagship — the tagline, the H1 intent, and the term every location page
targets. **התקנת שערים חשמליים** is the second head term and the higher-value one per job.

The service array is organised by **gate type** (נגררים, כנף, מתרוממים, לחניה, זרוע, לדירה) plus one
adjacent product (תריסי גלילה חשמליים). That is a legitimate taxonomy — buyers do search by gate type —
but the seven pages must differentiate on the mechanics of each type, not on noun swaps.

Note the split intent: **repair is urgent and local** (a stuck gate at 07:30), **installation is
considered and comparative** (weeks of research). The same page rarely serves both well.

**Co-terms worth owning:** competitors brand themselves **"שערים ומחסומים"** and **"שערים אוטומטיים"**,
not "שערים חשמליים" alone. Both are strong adjacent phrasings this site never uses.

---

## 2. Keyword tiers

**Tier 1 — generic head terms.** תיקון שערים חשמליים · התקנת שערים חשמליים · טכנאי שערים חשמליים ·
מנוע לשער חשמלי · שערים אוטומטיים · תיקון שער חניה חשמלי · חברת שערים · מחסום חניה חשמלי. Won with
authority and depth, not with more pages.

**Tier 2 — local and by gate type.** `{service} ב{city}`; and the seven gate-type pages, which are
under-built. See §6 for the expansion cap.

**Tier 3 — symptom queries. The biggest under-served cluster, and the highest commercial urgency.**

Verified as _dedicated standalone pages_ somewhere in the market — meaning competitors treat these as
routes, not FAQ bullets:

| Query                                                          | Evidence                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `שער חשמלי לא נסגר`                                            | midrag Expanel/1071, pro.co.il `/services/electric-gate-does-not-close`, masgernet          |
| `שער חשמלי לא נפתח`                                            | midrag Expanel/806                                                                          |
| `שער חשמלי לא מגיב לשלט`                                       | multiple                                                                                    |
| `שער כנפיים לא נפתח`                                           | midrag                                                                                      |
| `הפסקת חשמל והשער לא נפתח` / `שחרור חירום` / `מפתח נטרול מנוע` | shearim.co.il, hisherik.co.il                                                               |
| `תקלות נפוצות בשערים חשמליים`                                  | elrongates, masgernet, peretztec                                                            |
| **`שער חשמלי רועש` / `חורק`**                                  | **covered only inside maintenance articles — no standalone page found anywhere. Open gap.** |

**Tier 4 — component queries. A productised category this site lacks entirely.**

Competitors run a page _per part_. Terminology matters here and two of my earlier assumptions were
wrong:

| Correct term                       | Not                  | Note                                                 |
| ---------------------------------- | -------------------- | ---------------------------------------------------- |
| **עינית** / עין אלקטרונית / פוטוצל | ~~חיישן~~            | `עינית` dominates publisher usage for the safety eye |
| **לוח פיקוד**                      | ~~לוח בקרה~~         | also `כרטיס אלקטרוני` / `כרטיס בקרה`                 |
| **מחסום**                          | (alongside שער זרוע) | the buyer's word for a parking barrier               |

Full component set with evidence: `מנוע לשער חשמלי` (+ per type: נגרר / כנף / מתרומם) · `בוכנה
הידראולית` · `שלט לשער חשמלי` · **`שכפול שלט`** (midrag runs _both_ a guide and a price page for this) ·
`שלט אוניברסלי` · `תכנות שלט` / `קידוד שלטים` · `עינית` · `חיישן כביש` (vehicle loop detector) ·
`לוח פיקוד` · `גלגלים לשער נגרר` · `מסילה` · `פס שיניים` (plastic and iron priced separately) ·
`מפסק גבול` · `קבל הנעה` · `צ׳קלקה` / `מנורת אזהרה` · `סוללת גיבוי`.

**Tier 5 — commercial modifiers** (all verified in live titles): `מחיר` · `מחירון` · `כמה עולה` ·
**`מעודכן 2026`** · `מומלץ` · `אחריות` · `24 שעות` · `שירותי חירום` · `פריסה ארצית` · `חוות דעת` ·
`המלצות` · `קופונים`. The `מעודכן {year}` freshness token appears across many ranking titles and is
cheap to adopt.

---

## 3. Title formulas

The root `template` in `app/layout.tsx` already appends `| דן שערים חשמליים`. **A page's own `title`
must never append the brand again.** (Fixed 2026-08-17 on all 26 offending pages.)

| Route type | `title` you write                | Renders as                                         |
| ---------- | -------------------------------- | -------------------------------------------------- |
| Home       | _(uses `title.default`)_         | `דן שערים חשמליים – תיקון והתקנת שערים חשמליים`    |
| Service    | `{gate type}` + a differentiator | `שערים נגררים – תיקון והתקנה \| דן שערים חשמליים`  |
| Location   | `תיקון שערים חשמליים {prefixed}` | `תיקון שערים חשמליים בתל אביב \| דן שערים חשמליים` |
| Symptom    | the symptom verbatim             | `שער חשמלי לא נסגר – מה לבדוק \| דן שערים חשמליים` |
| Component  | the part + intent                | `עינית לשער חשמלי – תפקיד, תקלות והחלפה \| …`      |
| Pricing    | `מחירון תיקון שערים חשמליים`     | `מחירון תיקון שערים חשמליים \| דן שערים חשמליים`   |
| Blog post  | the question verbatim            | `כמה עולה תיקון שער חשמלי? \| דן שערים חשמליים`    |

Keep the rendered title under ~60 characters (`node scripts/audit/titles.mjs` warns past it).

**Region entries.** For קריות / שרון / צפון / דרום the bare `ב{name}` is grammatically wrong — use
`prefixed` (`בצפון הארץ`, `באזור השרון`). The field does not exist yet; it lands in Phase 3.1.

**Symptom / component / brand / comparison pages** are built with `/new-guide <family> <slug>` under
`/מדריכים/` (Phase 4) in the order set by [content-calendar.md](content-calendar.md) — never as ad-hoc
routes.

---

## 4. H1 formulas

| Route type | H1                                  |
| ---------- | ----------------------------------- |
| Home       | `תיקון והתקנת שערים חשמליים`        |
| Service    | `{gate type}`                       |
| Location   | `תיקון שערים חשמליים {prefixed}`    |
| Pricing    | `מחירון תיקון והתקנת שערים חשמליים` |
| Blog post  | the question itself, verbatim       |

Exactly one `<h1>` per page; everything below `<h2>`/`<h3>` with no skipped levels.

---

## 5. Description formulas

150–160 characters, unique per route, lead with service + place, one **true** differentiator, close with
an action.

Only claim what [business-facts.md](business-facts.md) confirms. Experience duration, the warranty term,
every per-gate price and 24/7 availability are all 🔶.

---

## 6. The service × location matrix

18 locations × 7 services = 126 cells. **Do not build them.** The 18 location pages currently differ by
**3 words**; publishing 126 variations of that is the doorway pattern.

Order of operations: (1) all 18 pass the doorway test, (2) each earns Tier-2 depth, (3) only then a
service × location tier.

**Before adding any cell, close the gaps in §8 instead** — they have real evidenced demand and no page
on this site at all.

---

## 7. Route → primary keyword

| Route                            | Primary target                       | Tier |
| -------------------------------- | ------------------------------------ | ---- |
| `/`                              | תיקון שערים חשמליים                  | 1    |
| `/services/שערים-נגררים/`        | שער נגרר / שער הזזה                  | 2    |
| `/services/שערי-כנף/`            | שער כנף                              | 2    |
| `/services/שערים-מתרוממים/`      | שער מתרומם                           | 2    |
| `/services/שערים-לחניה/`         | שער לחניה / מחסום חניה               | 2    |
| `/services/שער-זרוע/`            | מחסום זרוע                           | 3    |
| `/services/תריסי-גלילה-חשמליים/` | תריס גלילה חשמלי                     | 2    |
| `/services/שערים-לדירה/`         | שער לבניין מגורים                    | 3    |
| `/locations/{city}/`             | תיקון שערים חשמליים ב{city}          | 2    |
| `/מחירון/`                       | מה משפיע על מחיר תיקון שער — see §10 | 3    |
| `/blog/{slug}/`                  | one Tier-3 question each             | 3    |

---

## 8. Gaps — evidenced demand, no page on this site

Ranked by (evidence strength × commercial intent × how under-served it is):

1. **Symptom pages** — `שער חשמלי לא נסגר`, `לא נפתח`, `לא מגיב לשלט`, `רועש`, `נתקע`, `הפסקת חשמל /
שחרור חירום`. Competitors treat these as first-class URLs. **`רועש` has no standalone page anywhere
   in the market** — the cleanest opening available.
2. **Component pages** — one per part, each with its own failure modes. `עינית`, `לוח פיקוד`, `שלט` +
   **`שכפול שלט`**, `גלגלים`, `מסילה`/`פס שיניים`, `מפסק גבול`, `קבל הנעה`, `חיישן כביש`.
3. **`מינוע שער קיים` / `הפיכת שער רגיל לשער חשמלי`** — high intent, under-served, and it is an
   installation-value job rather than a small repair.
4. **Gate types not covered at all:** `שער קונזולי` (cantilever) and `דלת מוסך פנלים` (panel garage
   door). Both are standard categories on competitor sites.
5. **`מחסום`** as its own concept — buyers say מחסום, the site says שער זרוע.
6. **ועד בית / בית משותף** — verified: a shared underground car park is communal property, so a barrier
   installation **needs house-committee approval and sometimes an owners' majority**. This site names
   ועדי בתים as a target audience and has zero content for them. Strong B2B angle.
7. **Brand pages** — see §9.
8. **Gate-type comparison** — the 7 service pages are siblings with no comparison layer. Competitors run
   קונזולי/נגרר/כנף matrices.

Each gap becomes a `/new-guide` family (symptom · component · brand · comparison · safety · committee);
the build order and status live in [content-calendar.md](content-calendar.md). New evidence goes into
§13 first — `keyword-researcher` appends there and nowhere else in this file.

---

## 9. Brands with verified Israeli presence

| Brand                                                                                                     | Evidence                                                                |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **BFT**                                                                                                   | Dedicated competitor pages; official Israeli distributor referenced     |
| **Nice**                                                                                                  | **Sigma is the exclusive Israeli distributor** (nice.sigma-auto.co.il)  |
| **Somfy**                                                                                                 | Israeli site **and** an Israeli online store with a gates category      |
| **Beninca**                                                                                               | Deepest evidence — motor category, עינית, HD.80 piston, technician page |
| FAAC · CAME · LiftMaster · GENIUS · Proteco · V2 · Telcoma · SEA · DEA · King · RIB Comunello · Aprimatic | Present as brand pages across competitor sites                          |
| Roger                                                                                                     | **Weakest evidence of the set — verify before building a page**         |

`מנוע איטלקי` is used as a non-brand positioning term.

> Brand pages are only honest if the business genuinely services that brand. **Confirm before
> publishing** — a brand page for a motor nobody on the team can service is a lead you cannot fulfil.

---

## 10. Pricing — the norm is transparency, and this site is the outlier

**Verified:** publishing prices is standard in this niche, and unusually granular. Directories build
price pages as a content type; at least one operator publishes ~40 discrete line items down to a ₪20
spring clip. Independent sources agree on a **₪200–400 call-out/diagnosis band**, and motor
supply-and-fit figures are widely published.

**But this site cannot copy those numbers.** They are other companies' prices, and
[business-facts.md](business-facts.md) records that 8 of the 9 figures already on `/מחירון/` were
authored estimates rather than supplied by the business — and that real prices are **not** coming.

**So the play is not a price table. It is a page about what determines the price**, which ranks for the
same intent, is more useful than a range, and requires no number this business hasn't confirmed:

- Which fault it is — a remote battery, an עינית, a control board and a motor are four different jobs.
- Gate weight, width and type; single vs double leaf.
- Motor class, and whether the existing motor can be reused.
- Access and cabling run.
- Whether the diagnosis fee is credited against the repair.
- What makes a quote go up _after_ the visit — and how to avoid that.

Two further verified facts worth using, both attributable and neither about this business's own pricing:

- **Motors commonly carry 10–15 year warranties** in this market. That reframes "אחריות מלאה" (no term)
  as weak — worth raising with the owner (business-facts §D).
- **Repairs typically take one hour to one business day**, subject to parts availability.

---

## 11. What actually wins in this niche

Observed on the pages that rank, in rough order of leverage:

1. **A published, itemised price table** — the clearest divider between ranking and thin pages.
2. **Symptom pages as standalone URLs**, not FAQ bullets.
3. **Give away the DIY diagnosis first** (batteries → פחת → clean the עינית → check obstruction), _then_
   gate on safety. Establishes competence; the residual cases are the paying ones.
4. **A component page per part**, with its own price and failure modes.
5. **Brand pages.**
6. **Comparison tables** between gate types.
7. **Real review proof with volume, on the page** — one competitor scopes reviews _by city_
   (`/review/city/{city}/`), which is a smart local-proof structure worth copying once the GBP lands.
8. **Named human expertise** — first-person field experience, dated articles. The strongest format seen
   was a single question answered by 13 named technicians.
9. **2,500–4,000 words** on money pages, with a table of contents.
10. **A three-axis internal mesh: city × gate type × symptom.** Most operators link along one axis only.
11. **Explicit response-time promises.**
12. **`מעודכן {year}` in the title.**
13. **FAQ blocks on nearly everything** (4–8 questions).

---

## 12. The safety-standard opportunity — the strongest E-E-A-T angle available

**Verified from the Standards Institution of Israel itself** (sii.org.il, page titled
_"שער חשמלי עלול גם להרוג!!!"_):

- The standard is **ת״י 900 חלק 21.03 — בטיחות שערים**.
- **Installing a non-compliant gate is a criminal offence** (עבירה פלילית).
- Only accredited laboratories may test for it.
- **A court awarded ₪800,000** in damages to an injured woman.
- SII documents **fatalities** — a woman crushed in Migdal HaEmek, a five-year-old crushed — and further
  injuries to a 16-year-old and a teenage girl.
- Owners and operators carry liability. Competitor sources add that **insurers typically refuse cover**
  for non-compliant gates.

A 9-point conformity checklist (anti-entrapment, safety eyes, flashing light, encoder-sensing motor,
safety edges, fencing, approved components, signage, emergency instructions) is published by
competitors — treat as indicative and re-verify against SII before publishing as requirements.

**Why this is the opening:** several competitors have a standards page, but **none combines the SII
fatality record, the ₪800,000 judgment, the criminal-offence framing, the insurance consequence and a
conformity checklist on one page.** One competitor's flagship guide cites **American** standards (UL 325,
ASTM F2200) rather than the Israeli one.

**Two things to verify before publishing:**

- The **October 2006** date for the standard becoming official — sourced only to a competitor blog.
  Confirm on sii.org.il or gov.il.
- **Whether gate installation legally requires a licensed electrician**, or only the 230V connection
  does. No source stated this cleanly, and it determines whether "חשמלאי מוסמך" can be framed as a legal
  requirement or only as a quality signal. Licensing framework itself is verified: חוק החשמל תשי״ד-1954,
  Ministry of Labour licensing unit, grades from חשמלאי-עוזר to חשמלאי-מהנדס, with `מוסמך` covering
  three-phase work. **Exact ampere thresholds came from secondary sources — verify on gov.il.**

This page needs no business fact the owner hasn't supplied. It is buildable now.

---

## 13. Candidates (evidence-only, appended by `keyword-researcher`)

The only section of this file an agent edits. One row per candidate; every row carries a URL that
shows the demand (a SERP observation, a competitor page, an SII/gov.il page, a GSC export). **No
search volume, ever, without a data source** — `strength` is the evidence tier, not a number:
`strong` (dedicated competitor pages + a second source) · `medium` (one dedicated page) · `weak`
(mentioned inside other content only). `status`: `candidate` → `scheduled` (row added to
[content-calendar.md](content-calendar.md)) → `built` (route live) → `rejected` (say why in the
evidence cell). A candidate whose target route already exists is a cannibalisation flag, not a page.

| Term (Hebrew, verbatim) | Intent | Family | Evidence URL | Strength | Target route | Status |
| ----------------------- | ------ | ------ | ------------ | -------- | ------------ | ------ |
|                         |        |        |              |          |              |        |
