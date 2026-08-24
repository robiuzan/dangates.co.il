# Competitors — who ranks for the queries we want, with what, and what we may take from it

The competitor set behind [keyword-map.md](keyword-map.md) §2, §9 and §11, what each ranks with,
what this site can legitimately copy (structure) and what it never copies (their numbers, their
reviews, their words). Maintained by `keyword-researcher` — the only agent that edits this file —
on the quarterly cadence in §5. `content-hub` and `article-auditor` read it to decide whether a guide
says something a competitor cannot.

> **Evidence caveat — read before quoting anything below.** The competitor _set_ was verified
> 2026-08-17 from real pages, URLs and result titles. The **rank order is unverified**: the search
> tool used was US-based, so which competitor sits at position 1 vs 6 for a Hebrew query from an
> Israeli IP is unknown until §4 has been run at least once. Competitor JSON-LD could not be
> inspected (markdown conversion strips it), so nothing here says what schema they emit. No search
> volume exists for any query in this file and none may be added without a data source.

---

## 1. Two kinds of competitor, and one kind that is not

| Kind                                      | Who                                                                                             | What it means for us                                                                                                                                                                                                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Directories / marketplaces**            | midrag (מידרג), pro.co.il                                                                       | Ratings directories by nature — a page per query type, backed by a trust signal this site lacks today (business-facts §A); their review counts are **not measured** here. We out-build them on **depth per page** — one symptom explained properly beats a directory stub. |
| **Operators** (same trade, same market)   | masgernet, shearim.co.il, hisherik.co.il, elrongates, peretztec                                 | The real ranking competition for `תיקון שערים חשמליים` and the symptom family. Their page _structure_ is the evidence for keyword-map §11; their copy and prices are theirs.                                                                                               |
| **Distributors** (not repair competitors) | sigma-auto.co.il (Nice), the Somfy Israeli site and store, the BFT distributor referenced in §9 | They own brand queries (`מנוע Nice`, `BFT`) and will keep them. A brand page here competes only if the business genuinely services that brand (§9 warning; business-facts §C — 🔶).                                                                                        |

---

## 2. What each competitor ranks with

Only what keyword-map §2/§9/§11 attributes to that competitor. A blank cell means "not observed",
not "they don't have it". Columns: **structure** = copy the _shape_ of it; **never** = theirs alone.

| Competitor                               | Kind        | Ranks with (evidenced)                                                                                                                         | We can copy (structure only)                                                                                              | We cannot copy                                                            |
| ---------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| midrag (מידרג)                           | directory   | symptom pages as routes (`Expanel/1071` לא נסגר, `Expanel/806` לא נפתח, שער כנפיים לא נפתח); **both a guide and a price page** for `שכפול שלט` | one symptom per URL (calendar #5, #6, #10); a guide _and_ a what-drives-the-price page for a component (#13 + `/מחירון/`) | their prices, their review counts, their ratings                          |
| pro.co.il                                | directory   | a dedicated URL for `electric-gate-does-not-close`                                                                                             | the symptom-as-URL pattern                                                                                                | their reviews                                                             |
| masgernet                                | operator    | `שער חשמלי לא נסגר` standalone; `תקלות נפוצות בשערים חשמליים`                                                                                  | symptom page + a faults overview that links each symptom (calendar §4: the תקלות overview)                                | their copy, any price they publish                                        |
| shearim.co.il                            | operator    | `הפסקת חשמל והשער לא נפתח` / `שחרור חירום` / `מפתח נטרול מנוע`                                                                                 | the emergency-release page, per gate type (calendar #11)                                                                  | their copy                                                                |
| hisherik.co.il                           | operator    | same family as shearim (emergency release, power outage)                                                                                       | as above                                                                                                                  | their copy                                                                |
| elrongates                               | operator    | `תקלות נפוצות בשערים חשמליים`                                                                                                                  | the faults overview                                                                                                       | their copy                                                                |
| peretztec                                | operator    | `תקלות נפוצות בשערים חשמליים`                                                                                                                  | the faults overview                                                                                                       | their copy                                                                |
| sigma-auto.co.il (nice.sigma-auto.co.il) | distributor | exclusive Israeli distributor of Nice — brand and product pages                                                                                | nothing to copy; a link target for the Nice row of calendar #16 **if** the business services Nice (🔶 §C)                 | product specs presented as our own expertise                              |
| Somfy (Israeli site + store)             | distributor | brand pages with a gates category                                                                                                              | same as above                                                                                                             | same                                                                      |
| BFT distributor (§9)                     | distributor | dedicated competitor pages reference an official Israeli distributor                                                                           | same                                                                                                                      | same                                                                      |
| Beninca pages (§9, unnamed operator)     | operator    | the deepest brand evidence — motor category, עינית, HD.80 piston, a technician page                                                            | component-per-part under a brand (calendar #7, #14)                                                                       | their named technician — no person is coming here (owner-actions §3.3 ❌) |

**Unattributed patterns** keyword-map §11 observed on ranking pages without naming the site — keep
them unnamed until §4 captures who:

| Pattern (§11)                                                                | Copy the structure?                                                                                         | Never                                                            |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| ~40 discrete price line items down to a ₪20 spring clip (§10)                | **No.** Prices are not coming (business-facts §D ❌). `/מחירון/` pivots to what determines the price.       | any number of theirs                                             |
| reviews scoped by city (`/review/city/{city}/`)                              | Yes — **after** the GBP lands and reviews are quoted verbatim (business-facts §A)                           | a rating without a public source                                 |
| one question answered by 13 named technicians                                | The format needs people. ❌ no person is coming; the substitute is mechanism depth under the `Organization` | a named technician who does not exist                            |
| DIY diagnosis first, then the safety gate                                    | Yes — the symptom-family template (`new-guide`), every time                                                 | —                                                                |
| comparison tables between gate types; FAQ blocks of 4–8 on nearly everything | Yes — calendar #4; per-service FAQs in Phase 3                                                              | a Q/A string in two `FAQPage` nodes                              |
| 2,500–4,000 words with a TOC on money pages                                  | Yes — `engagement-ux` TOC chrome on long guides                                                             | padding to a word count; the floor is 900 genuinely unique words |
| `מעודכן {year}` in the title; explicit response-time promises                | The freshness token, yes. A response-time promise only once business-facts §E is answered (🔶)              | "24/7" or "same day" beyond what the owner confirms              |
| a flagship safety guide citing UL 325 / ASTM F2200                           | Cite the **Israeli** standard instead (ת״י 900 חלק 21.03, sii.org.il) — calendar #1                         | —                                                                |

---

## 3. The line we do not cross

- **Their prices are their prices.** Not ours, not "market rates" we can quote as ours. The only
  sourced figure on this site is the ₪150–350 visit fee, itself 🔶 current (business-facts §D).
- **Their reviews and ratings** never appear here in any form — not as a benchmark, not as "the
  market average". This site shipped fabricated reviews; they left the repo on 2026-08-17 and leave
  the live domain when Phase 0 deploys ([growth-roadmap.md](growth-roadmap.md) §1). The gate in
  `components/marketing/Reviews.tsx` exists so it cannot happen again.
- **Their text** is evidence of what ranks, not a source to paraphrase. `article-auditor` checks that
  a guide says something they cannot; a guide that restates a competitor's page fails that test by
  definition.
- **Their photos, their named people, their licences** — none of it transfers. The site has none of
  these (business-facts §B, §C, §F) and is written around the absence, not around borrowed proof.
- **Their schema is unverified** (caveat above). Do not cite "competitors emit `FAQPage`" as a reason
  to do anything.

---

## 4. SERP-capture procedure — the only way to verify rank order

Naive fetches do not work: several operator sites sit behind Cloudflare and return **403** to
`curl`/`WebFetch`, and a US-located search tool returns a different SERP. Rank order is a
**browser** observation, done by a person, dated, and kept outside the repo.

1. **A real browser, Israeli context.** Chrome or Firefox, a fresh private window (no account, no
   history), from an Israeli connection. Search on `https://www.google.com/search?hl=he&gl=il&q=…`
   — `hl=he` (Hebrew UI and language) and `gl=il` (Israeli results) are both required. If the
   connection is not Israeli, say so in the log's location column; the capture is still useful but
   the map pack will be wrong.
2. **The query set** — one capture per query, per quarter. Families from keyword-map:
   - head: `תיקון שערים חשמליים` · `התקנת שערים חשמליים` · `טכנאי שערים חשמליים`
   - location: `תיקון שערים חשמליים בתל אביב` · `…בחיפה` · `…בפתח תקווה` (rotate three cities per
     quarter so all 18 are captured within 18 months)
   - symptom: `שער חשמלי לא נסגר` · `שער חשמלי לא נפתח` · `שער חשמלי לא מגיב לשלט` · `שער חשמלי רועש`
   - component: `עינית לשער חשמלי` · `שכפול שלט לשער חשמלי` · `לוח פיקוד לשער חשמלי`
   - standard / committee: `תקן שערים חשמליים` · `מחסום חניה בבית משותף`
   - commercial: `מחירון תיקון שער חשמלי` · `כמה עולה תיקון שער חשמלי`
3. **Capture the full first page** as a dated, full-page screenshot (the browser's "capture full
   size screenshot" in DevTools, or a full-page extension). Include the map pack, People Also Ask, AI
   Overview and any video block — SERP features are part of the observation.
4. **Name and store it outside the repo**: `YYYY-MM-DD_<query>.png` into a folder the **owner** keeps
   (their Drive or equivalent). Screenshots of other companies' pages do not go into git — they bloat
   the repo and they are other people's content. The repo holds only the observation table (§6).
5. **Log the observation** in §6: date, query, positions 1–10 as _site · page type_ (symptom page /
   directory listing / brand page / price page / video / AI Overview present), and whether
   dangates.co.il appears at all. Page type is the useful datum; the exact URL is optional.
6. **Verify before attributing.** A pattern seen once in a screenshot is an observation; it moves into
   §2 as "ranks with" only when the page has been opened in the browser and the structure confirmed.

---

## 5. Refresh cadence

- **Quarterly**, by `keyword-researcher`: re-run §4 for the full query set, update §6 and §2, and
  propose any new candidate into keyword-map §13 with its evidence URL. Target months: the first
  month of each quarter; the first run is the baseline and every later run reports Δ against it.
- **Off-cycle** when: a guide from [content-calendar.md](content-calendar.md) publishes (capture its
  target query 4–6 weeks later); the first Search Console ingest lands (`scripts/audit/gsc-ingest.mjs`
  — blocked on owner-actions §2.3) and shows a family we have not captured; or a named competitor's
  site visibly restructures.
- **What a refresh may change here:** §2 rows (add, re-attribute, retire), §6 observations, the
  query set in §4. **What it may not change:** the line in §3, and it may never add a price, rating
  or volume to any table.

---

## 6. Observation log

No capture has been run yet; the rank-order caveat at the top stands until the first row exists.
One row per query per capture; newest first.

| Date | Query | Location context | Positions 1–10 (site · page type) | SERP features | dangates.co.il position |
| ---- | ----- | ---------------- | --------------------------------- | ------------- | ----------------------- |
|      |       |                  |                                   |               |                         |
