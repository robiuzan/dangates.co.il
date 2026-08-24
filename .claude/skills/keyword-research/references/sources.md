# Evidence sources — what counts, what each proves, how to cite it

Companion to `/keyword-research` §5. A keyword-map §13 row needs **one URL from this list**; anything
not on it is an opinion. Strength tiers: `strong` · `medium` · `weak` (keyword-map §13 definitions).

## 1. The Israeli SERP — a real browser, not the search tool

The one source that shows phrasing, features and rank order together, and the only one that can
confirm who ranks from an Israeli IP. Procedure, storage and the query set: `docs/competitors.md` §4
(fresh private window, `https://www.google.com/search?hl=he&gl=il&q=…`, full-page dated screenshot
kept **outside** the repo, observation logged in competitors.md §6).

What to harvest from one capture, beyond positions:

- **People Also Ask** — question phrasings verbatim (`למה השער החשמלי לא נסגר עד הסוף?`). These are
  the strongest evidence of how a query is actually worded and become question-form H2s.
- **Autocomplete** — type the stem (`שער חשמלי לא`) and record the suggestions. Evidence that the
  phrasing is typed; `weak` on its own, `medium` with a dedicated competitor page.
- **"חיפושים קשורים"** at the foot of the page — sibling phrasings for the variant row.
- **SERP features** — map pack, AI Overview, video, price snippets. A map pack means the query is
  local-intent (`new-city` territory); an AI Overview means the answer block matters (`aeo-answer-content`).

`WebSearch` from this environment is **US-located** (keyword-map evidence note): use it to discover
that a page exists, then verify it in the browser. Never log a position from it.

## 2. Competitor sites — structure is evidence, text is not a source

The set and what each ranks with: `docs/competitors.md` §1–§2; brands: keyword-map §9; patterns that
win: §11. A **dedicated URL** for a query (`/services/electric-gate-does-not-close`, `Expanel/1071`)
is `medium`; two independent sites with dedicated pages, or a page plus a SERP capture, is `strong`.
A mention inside a maintenance article is `weak`.

Record: the URL, the page type (symptom page / component page / price page / brand page / guide),
the H1 if visible, and the date. Never paste their copy, prices, ratings or review counts anywhere
(competitors.md §3). Several operator sites return **403 to curl and WebFetch** (Cloudflare) — open
them in a browser; a 403 is not "no page".

## 3. Directories and marketplaces — midrag (מידרג), pro.co.il

Query-shaped category pages (`Expanel/1071` לא נסגר, `Expanel/806` לא נפתח) show which intents a
directory found worth a route; midrag running **both a guide and a price page** for `שכפול שלט` is
why that term sits at `strong`. Their review counts and prices are not evidence of anything here.

## 4. The Standards Institution — sii.org.il (WebFetch allow-listed)

The authority for the safety family and the site's strongest E-E-A-T angle (keyword-map §12): ת״י 900
חלק 21.03, the fatality record, the criminal-offence framing, the ₪800,000 judgment. Terms it
evidences: `תקן שערים חשמליים`, `ת״י 900 שער חשמלי`, `בדיקת תקן לשער חשמלי`, `שער חשמלי מסוכן`.
Any **fact** from here that reaches copy is cited to the SII page itself, never to a competitor
restating it — `claims-verifier` checks. Two open items to confirm on sii.org.il / gov.il before the
safety guide ships: the 2006 effective date; whether a licensed electrician is legally required for
the whole installation or only the 230V connection.

## 5. gov.il and primary law (WebFetch allow-listed for www.gov.il)

חוק החשמל תשי״ד-1954 and the Ministry of Labour licensing grades evidence the `legal` intent
(`חשמלאי מוסמך לשער חשמלי`, `רישיון להתקנת שער`). For the ועד בית guide (content-calendar #3) the
approval/majority thresholds must cite the law text (gov.il, or the statute on a legal database
opened in the browser), not a blog. Ampere thresholds in secondary sources are unverified
(keyword-map §12) — do not carry them into a term's evidence cell as fact.

## 6. Search Console — the only numeric source, and it is blocked

Pipeline: Performance → Export (Queries, and Pages) as CSV →
`node scripts/audit/gsc-ingest.mjs <queries.csv> --month YYYY-MM --pages <pages.csv> --write` →
`docs/rank-tracking.md` gets a `## YYYY-MM` section between the marker comments (never hand-edited).
The script buckets every query into `location · service · symptom · component · brand · generic`,
refuses a file marked FIXTURE, and errors on a missing column rather than guessing.

Blocked until the owner verifies the property and grants a user (owner-actions §2.3; business-facts
§H). Dry-run now: `node scripts/audit/gsc-ingest.mjs scripts/audit/fixtures/gsc-sample.csv --month 2026-01`
prints the section; `--write` on it refuses.

Once it runs: a query present in the export is `strong` evidence of demand on this domain; cite it
as `rank-tracking.md ## YYYY-MM, query "…"`. The clicks/impressions/position stay in that file — a
§13 row never repeats them, and they are still not "search volume".

## 7. How to write the evidence cell

`<host/path or doc anchor> (<page type or observation>, <YYYY-MM-DD>)` — examples:

- `midrag.co.il/Expanel/1071 (symptom page, 2026-08-17)`
- `competitors.md §6 row 2026-10-03 "שער חשמלי רועש" (PAA + no dedicated result)`
- `sii.org.il — "שער חשמלי עלול גם להרוג" (standard page, 2026-08-17)`
- `rank-tracking.md ## 2026-11, query "שער חשמלי לא נפתח"`
- `rejected: equals the שער-זרוע service name — silo, not a guide`

## 8. What is not evidence

- A volume, CPC or difficulty from memory of any tool, or from a screenshot nobody can reproduce.
- "Everyone searches for this", an LLM's guess, a competitor's `<meta keywords>`.
- Google Trends **as volume** — it may be cited, URL included with `geo=IL`, only for a _relative_
  comparison between two Hebrew phrasings (`weak`).
- A competitor's JSON-LD or "they emit FAQPage" — unverifiable here (competitors.md caveat).
- Rank order from a US-located search tool.
