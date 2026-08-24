---
name: keyword-research
description: Evidence-only Hebrew keyword and SERP discovery for דן שערים חשמליים — the keyword-map tier model, the §13 candidate table every new term is appended to (term · intent · family · evidence URL · strength · target route · status), Hebrew query grammar (ב+city and the region prefixes, symptom phrasing, the buyer vocabulary עינית / לוח פיקוד / מחסום / שכפול שלט / מינוע שער קיים, the מעודכן 2026 freshness token), what counts as evidence (Israeli SERP captures, competitor pages, sii.org.il, gov.il, the Search Console ingest) and the hard rule that no search volume, CPC or difficulty is ever written without a cited data source. Use when hunting for new terms, checking demand before content-hub decides whether a topic earns a page, or running the monthly GSC cadence. Triggers: "find keywords for…", "keyword research", "what do competitors rank for", "is there demand for", "search volume", "מילות מפתח", "מה מחפשים בגוגל".
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch, Edit
---

# Keyword research — evidence only

This site has **no search-volume data and no Search Console access** (owner-actions §2.3 🔶). Every
keyword it targets is therefore justified by _evidence that someone built a page or typed a query_,
never by a number. Run by `keyword-researcher` (docs/agent-roster.md §1) — the one agent that edits
docs, and only three of them: `docs/keyword-map.md` **§13**, `docs/competitors.md`,
`docs/rank-tracking.md` (via the script, never by hand). Output is a candidate row, not copy; the
hand-off is `/content-hub` ("does it earn a page"), then `docs/content-calendar.md`, then `/new-guide`.

## 1. The tier model — keyword-map §2, summarised, not duplicated

| Tier | What                                                               | Won by                                 |
| ---- | ------------------------------------------------------------------ | -------------------------------------- |
| 1    | generic head terms (`תיקון שערים חשמליים`, `שערים אוטומטיים`)      | authority and depth, not more pages    |
| 2    | `{service} ב{city}` and the 7 gate-type pages                      | the silos (`new-city`, `new-service`)  |
| 3    | symptom queries (`שער חשמלי לא נסגר` … `רועש`)                     | one symptom per URL under `/מדריכים/`  |
| 4    | component queries (`עינית`, `לוח פיקוד`, `שכפול שלט`, `מנוע לשער`) | one part per URL                       |
| 5    | commercial modifiers (`מחיר`, `כמה עולה`, `מעודכן 2026`, `מומלץ`)  | titles and `/מחירון/` — never a number |

The `family` column of §13 uses the six `gsc-ingest.mjs` buckets plus the guide families:
`generic · location · service · symptom · component · brand · comparison · safety · committee`.
Read §1, §8 (the evidenced gaps) and §12 (the safety-standard opening) before proposing anything —
most obvious candidates are already there.

## 2. The hard rule — no number without a source

- **Never write a search volume, CPC, difficulty score or "≈N searches/month"** — not from a tool you
  remember, not from a competitor's claim, not as an estimate. keyword-map's evidence note says why:
  nothing in this repo has a data source for it. `strength` is the evidence tier instead:
  `strong` (a dedicated competitor page **and** a second source) · `medium` (one dedicated page) ·
  `weak` (mentioned inside other content only).
- The **only numbers allowed anywhere** are Search Console exports, and those reach
  `docs/rank-tracking.md` through `node scripts/audit/gsc-ingest.mjs`, never typed. A row in that
  export is evidence of demand _on this domain_; it still says nothing about market volume.
- **The search tool is US-located.** `WebSearch` verifies that a competitor page _exists_; it does
  not tell you who ranks first from an Israeli IP. Rank order is a browser observation
  (`docs/competitors.md` §4) and stays "unverified" in every doc until §6 there has a row.

## 3. The candidate table — keyword-map §13

One row per term, appended at the bottom; §1–§12 are the strategist's and are never edited here.

| Column       | Rule                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Term         | Hebrew, verbatim as a user would type it; singular/plural variants are **one** row with the dominant form first          |
| Intent       | `repair-urgent` · `install-considered` · `diagnose` · `price` · `choose` · `legal` — the split in keyword-map §1 matters |
| Family       | one of the nine in §1 above                                                                                              |
| Evidence URL | the page, SERP capture or export that proves demand — format per `references/sources.md` §7; "multiple" is not a URL     |
| Strength     | `strong` / `medium` / `weak` per §2                                                                                      |
| Target route | an existing route (→ a depth note, **not** a new page), a `/new-guide <family>` slug, or `none`                          |
| Status       | `candidate` → `scheduled` (row in content-calendar) → `built` → `rejected` (the reason goes in the evidence cell)        |

A candidate whose target route already exists is a **cannibalisation flag**: it becomes a title,
answer-block or FAQ note for that page, never a second page (§7). Keep the table Prettier-clean —
`npm run format:check` runs on docs.

## 4. Hebrew query grammar — generate variants before you search

- **Head forms:** `תיקון שערים חשמליים` / `תיקון שער חשמלי` (plural construct vs singular — both are
  typed), `טכנאי שערים`, `מתקין שערים`, `חברת שערים`, and the two co-terms competitors brand with and
  this site never uses: `שערים אוטומטיים`, `שערים ומחסומים` (keyword-map §1).
- **ב+city:** `תיקון שערים חשמליים ב{city}` with the city exactly as `locations[].name` in
  `lib/site-config.ts` (two-word names stay two words: `בראשון לציון`, `בפתח תקווה`). The four region
  entries take the phrasing keyword-map §3 sets — `בצפון הארץ`, `באזור השרון` — never a bare `בשרון`;
  the `prefixed` field that carries it lands in Phase 3 (`new-city`), so until then write the region
  form by hand in the term.
- **Symptom phrasing:** `{שער חשמלי | השער החשמלי} + לא + {נסגר | נפתח | מגיב לשלט | עובד}`, plus
  `נתקע`, `רועש`, `חורק`, `נפתח לבד`, `נסגר לבד`, `הפסקת חשמל`. The definite `השער` and the question
  frame `מה עושים כש…` / `למה ה…` are how People-Also-Ask phrases them — record those verbatim; they
  become question-form H2s (content-standards §5).
- **Buyer vocabulary** (keyword-map §2 Tier 4 — two earlier assumptions were wrong):

  | Use                                               | Not              |
  | ------------------------------------------------- | ---------------- |
  | `עינית` (also `עין אלקטרונית`, `פוטוצל`)          | `חיישן`          |
  | `לוח פיקוד` (also `כרטיס אלקטרוני`, `כרטיס בקרה`) | `לוח בקרה`       |
  | `מחסום` / `מחסום חניה` alongside `שער זרוע`       | `שער זרוע` alone |
  | `שכפול שלט`, `תכנות שלט`, `שלט אוניברסלי`         | `ריפרוש שלט`     |
  | `מינוע שער קיים`, `הפיכת שער רגיל לשער חשמלי`     | `אוטומציה לשער`  |
  | `שער קונזולי`                                     | `שער תלוי`       |

- **Commercial modifiers:** `מחיר` / `מחירון` / `כמה עולה` map to `/מחירון/` pivoted to _what drives the
  price_ (keyword-map §10) — never to a page with a number. `מעודכן 2026` is a cheap title token
  **only** on a page whose `updated` date is real (`lib/site-config.ts` `updated`, `lib/posts.ts`
  `updated`) — a freshness token on stale copy is a claim. `24 שעות` / `שירותי חירום` cannot be
  targeted honestly until business-facts §E is ✅.

## 5. Where evidence comes from

Full detail, access notes and the citation format: [references/sources.md](references/sources.md).

| Source                                                   | Proves                                       | Max strength      |
| -------------------------------------------------------- | -------------------------------------------- | ----------------- |
| Israeli SERP in a real browser (`hl=he&gl=il`)           | phrasing, SERP features, who ranks           | strong (w/ a 2nd) |
| Competitor pages — competitors.md §2, keyword-map §9/§11 | someone built a page for it                  | medium → strong   |
| Directories (midrag, pro.co.il)                          | query-shaped category pages                  | medium            |
| sii.org.il · gov.il                                      | the safety / legal families; facts to cite   | strong            |
| Search Console export → `gsc-ingest.mjs`                 | real impressions on this domain (blocked 🔶) | strong            |
| `WebSearch` (US locale)                                  | existence only — never rank order            | medium            |

## 6. Method — one research pass

1. **Frame the question**: a backlog id, a content-calendar row, or "is there demand for X".
2. **Inventory what exists**, so you propose nothing the site already owns:
   ```bash
   grep -n 'name:' lib/site-config.ts          # 7 service names + 18 location names
   grep -n -E '^\s+title:' lib/posts.ts        # the 11 post titles
   ```
   plus keyword-map §7 (route → primary keyword), §8, §13 and content-calendar §2–§3.
3. **Generate variants** per §4 — singular/plural, definite, region form, symptom frame.
4. **Collect evidence** per §5: one URL per row, dated, with the page type observed. A naive fetch
   that returns 403 is not "no evidence" — open it in a browser (competitors.md §4).
5. **Assign the target route**: existing route → depth note; guide family → `/new-guide` slug;
   neither → `rejected` with the reason.
6. **Append** to keyword-map §13; competitor observations go to competitors.md §2 (structure) and
   §6 (the capture log). Run `npm run format:check`.
7. **Hand off**: `/content-hub` runs "does it earn a page"; only then a row moves to
   content-calendar. You never write copy and never create a route.

## 7. Cannibalisation check — before a row is `candidate`

- Equal to a service `name`, or shaped `{service} ב{city}` → belongs to the silo; never a guide
  (content-calendar §1 rules; `lib/guides.ts` will throw on it in Phase 4).
- Same intent as one of the 11 posts or a scheduled guide → one row, target = that page, note "merge".
- Two terms that differ only by number/definiteness → one row.
- A symptom already scheduled (#2, #5, #6, #10, #11) → a phrasing note on that row, not a new row.
- `מחסום` → the שער-זרוע service page's title/H1 (Phase 3), not a guide (content-calendar §3 note).

## 8. Cadence

- **Monthly, after the ingest** — once owner-actions §2.3 lands:
  `node scripts/audit/gsc-ingest.mjs <queries.csv> --month YYYY-MM --pages <pages.csv> --write`,
  then read `docs/rank-tracking.md` "How to read a month": symptom/component impressions with no
  page → §13 rows with evidence = that month's section; location impressions concentrated on 3–4
  cities → where `new-city` depth pays first. Dry-run today on the fixture
  (`scripts/audit/fixtures/gsc-sample.csv` — invented numbers; `--write` refuses it).
- **Quarterly** — the competitors.md §4 browser capture of the full query set.
- **Off-cycle** — 4–6 weeks after a guide publishes, capture its target query.

## Checklist

- [ ] Every new §13 row has a real evidence URL, a strength tier and a dated observation.
- [ ] No volume, CPC, difficulty or "popular" anywhere in the row or the commit message.
- [ ] Term written as typed: buyer vocabulary (§4), region form for the four regions, one row per variant set.
- [ ] Cannibalisation check (§7) run against services, locations, posts and the calendar.
- [ ] Only §13 of keyword-map, competitors.md and (via script) rank-tracking.md were edited.
- [ ] Rank-order claims say "unverified" until competitors.md §6 has a capture.
- [ ] Handed to `/content-hub`; no copy, no route, no calendar row written from here.

## Gotchas

- **Cloudflare 403** on `curl`/`WebFetch` is normal for the operator sites — that is why captures are
  browser screenshots kept outside the repo (competitors.md §4), and why competitor text is never
  pasted into a doc.
- **`WebFetch` is allow-listed only for sii.org.il, www.gov.il and the fleet domains** (`.claude/settings.json`);
  anything else prompts. Fetch to confirm a page exists, not to harvest it.
- **Singular vs plural vs construct state** are different queries to Google and one row to us —
  `שער חשמלי` / `שערים חשמליים` / `שערי חשמל`; record the dominant form first.
- **A keyword never adds a 19th location or an 8th service** (CLAUDE.md §12) — `דלת מוסך פנלים` and
  `שער קונזולי` are guides or notes until the 7 and 18 pass the doorway test.
- **Brand terms** (`BFT`, `Nice`, `Somfy`, `Beninca`) are evidence-rich and owner-blocked: a brand
  page is honest only for brands the business services (keyword-map §9; business-facts §C 🔶).
- **Never "confirm" a volume from memory of a paid tool.** If a screenshot of an export exists, it is
  the owner's to supply and cite; otherwise the strength column is the whole story.
