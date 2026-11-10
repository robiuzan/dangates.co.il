# Content coverage and benchmark — 2026-11-10

Scope: the 7 service pages, 14 location pages and 4 guides, read from the built `<main>` text of
commit `669582e`. Each cell was checked by a second independent pass (26 cells corrected). Written
before any page was rewritten. Backlog: N23–N33.

## Per-page coverage

Cost · Process · What to check · where it sits. ✅ full, 🟡 partial, ❌ missing, — does not fit.

| Page                    | Cost                  | Process                                 | What to check           | Position |
| ----------------------- | --------------------- | --------------------------------------- | ----------------------- | -------- |
| שערים-נגררים            | ✅                    | 🟡 no gate-specific step                | 🟡 no questions         | Middle   |
| שערי-כנף                | ✅                    | 🟡 no gate-specific step                | 🟡 no questions         | Middle   |
| שערים-מתרוממים          | 🟡 two sentences      | 🟡 no gate-specific step                | 🟡 no questions         | Middle   |
| שערים-לחניה             | 🟡 one line           | 🟡 no gate-specific step                | 🟡 scattered            | Buried   |
| שער-זרוע                | ✅                    | 🟡 no gate-specific step                | 🟡 no questions         | Buried   |
| תריסי-גלילה-חשמליים     | ✅ only in FAQ        | 🟡 no gate-specific step                | 🟡 one question         | Buried   |
| שערים-לדירה             | ✅                    | 🟡 step names a motor most entries lack | 🟡 no questions         | Middle   |
| תל-אביב                 | ❌                    | 🟡 no call-to-finish                    | 🟡 no stop or questions | Buried   |
| ירושלים                 | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Middle   |
| חיפה                    | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Middle   |
| ראשון-לציון             | ❌                    | 🟡 no call-to-finish                    | 🟡 no stop or questions | Buried   |
| פתח-תקווה               | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Buried   |
| נתניה                   | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Middle   |
| חולון                   | 🟡 one line           | 🟡 no call-to-finish                    | 🟡 no questions         | Middle   |
| כפר-סבא                 | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Buried   |
| מודיעין                 | 🟡 one line           | 🟡 no call-to-finish                    | 🟡 no questions         | Middle   |
| רחובות                  | ❌                    | 🟡 no call-to-finish                    | 🟡 no stop or questions | Middle   |
| יבנה                    | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Middle   |
| אשדוד                   | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Buried   |
| אשקלון                  | ❌                    | 🟡 no call-to-finish                    | 🟡 no stop or questions | Buried   |
| שרון                    | ❌                    | 🟡 no call-to-finish                    | 🟡 no questions         | Middle   |
| מחסום-חניה-ועד-בית      | ✅ no `/מחירון/` link | 🟡 no steps after the vote              | 🟡 no safety stop       | Middle   |
| שער-חשמלי-רועש          | 🟡 no heading         | 🟡 stops before the repair              | 🟡 no questions         | Buried   |
| שער-נגרר-כנף-או-קונזולי | ✅                    | 🟡 no steps per gate type               | 🟡 narrow stop only     | Middle   |
| תקן-900-שער-חשמלי       | —                     | —                                       | ✅                      | Middle   |

## Link reach in the body, before this work

Service pages link 5–6 of 14 areas, 2–4 sibling types and 1–3 guides. Location pages link 4–7 types
and 1–4 sibling areas; only ירושלים links a guide. Guides link 0–1 locations. Hubs: home 7 types, 14
areas, 1 guide; `/שירותים/` 7, 0, 0; `/איזורי-שירות/` 0, 14, 0; `/מדריכים/` 0, 0, 4; `/מחירון/` 0, 0, 0.

## Benchmark

**Rank order is unverified.** The capture in [competitors.md](../competitors.md) §4 has never been
run, so nothing here shows who ranks where for any Hebrew query. The comparison is page structure
only, from up to three pages per site loaded once with curl on 2026-11-10, eight criteria, one point
per criterion per page.

| Site             | Score /24 | Note                                                                                           |
| ---------------- | --------- | ---------------------------------------------------------------------------------------------- |
| peretztec.co.il  | 18        | **Role model.** The only site with cost, owner checks and a safety stop on every page measured |
| masgernet.co.il  | 15        | One URL per symptom and good tables, but no safety stop or answer-first opening                |
| midrag.co.il     | 14        | Strong family links; provider listings interrupt the guides                                    |
| pro.co.il        | 11        | Clean symptom-page order; no safety stop, no table                                             |
| elrongates.co.il | 7         | Separates owner checks from technician work; no cost, FAQ or table                             |
| shearim.co.il    | 5         | The repair page is a pitch                                                                     |
| hisherik.co.il   | 3         | A manufacturer, no repair page                                                                 |

Copy from the role model (`https://www.peretztec.co.il/מדריך-מקיף-לתיקון-שער-חשמלי-שלא-נפתח-או/`) the
section order only: causes, warning signs, owner checks, when to call, FAQ, one triage table per
guide. Its prices, wording and guarantees are not used. Where this site is already ahead and must not
copy it: answer-first openings, contents lists, family links, one gate type per URL.

## Gap analysis, in order of work

1. No guide for a gate that will not close (N29).
2. 12 of 14 location pages are silent on cost, and none links `/מחירון/` (N27).
3. Safety stop missing on 4 location pages and the committee guide (N27, N28).
4. Cost section missing or thin on 3 service pages (N26).
5. No gate-specific process step on any of the 7 service pages (N26).
6. No labelled owner-check section on 4 service pages (N26).
7. No what-to-ask list on 5 of 7 service pages (N26).
8. No triage table on any service or location page (N26, service pages only).
9. No call-to-finish and no gathered checks on location pages (N27).
10. Guide job steps and cost headings (N28).

## Corrections found in passing

- `content/locations/אשקלון.ts` told readers to hose the photocells; `יבנה` and `אשדוד` say to keep
  them dry. Fixed under N27.
- The comparison guide filed ירושלים under a heading that reads as coverage. Fixed under N28.
- The safety guide could imply the technician holds an electrical licence. Fixed under N28.
- The shared GTM container routes `dangates.co.il` to `G-EMV602DCL3` (read from the live `gtm.js` on
  2026-11-10). The owner sent `G-8GFFY333F7`, which the same container routes to `3locksmiths.co.il`.
  The roster's `ga4MeasurementId` stays null until the owner says which is right.
