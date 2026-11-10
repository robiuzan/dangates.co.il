# Monthly AI probe — the owner's one-page sheet

Once a month, ask ten fixed questions in four AI engines and write down whether the answer cites
dangates.co.il. **You run it** (owner decision, 2026-11-10); no agent runs the questions or types a
row. Send the filled table to us, and the next `/audit full` copies your rows into that month's
`docs/audits/<date>-full.md` §7. Start after the 2026-11-10 deploy. The questions are copied exactly
from [seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md) §6.1: **never reword one** — a changed
question starts a new series and breaks the month-to-month comparison.

## 1. First, the monthly Cloudflare check

Cloudflare dashboard → zone `dangates.co.il` → **AI Crawl Control** (search "AI Crawl" if the menu
moved). Confirm that **no crawler is set to Block** and that the per-crawler counts show allowed
requests, not blocked ones. Your policy since 2026-11-10 is **allow everything**, training crawlers
included ([owner-actions.md](owner-actions.md) 1.5). This page is the true view; the curl probe in
[cloudflare-runbook.md](cloudflare-runbook.md) step 1 only imitates the bots. If anything shows
Block, set it back to Allow, write it in the log's URL column, and tell us: a month with a block
measures the block, not the pages.

## 2. The ten questions — copy each one exactly

| #   | Family          | Prompt                                     |
| --- | --------------- | ------------------------------------------ |
| 1   | symptom         | שער חשמלי לא נסגר עד הסוף — מה לבדוק?      |
| 2   | symptom         | השער החשמלי לא מגיב לשלט, מה עושים?        |
| 3   | symptom         | למה שער חשמלי רועש או חורק?                |
| 4   | service + city  | מי מתקן שערים חשמליים בתל אביב?            |
| 5   | service + city  | תיקון שער חשמלי בפתח תקווה — למי פונים?    |
| 6   | component       | מה זה עינית לשער חשמלי ולמה היא נכשלת?     |
| 7   | component       | מתי מחליפים לוח פיקוד לשער חשמלי?          |
| 8   | comparison      | שער נגרר או שער כנף — מה מתאים לכניסה צרה? |
| 9   | pricing drivers | מה משפיע על מחיר תיקון שער חשמלי?          |
| 10  | safety standard | מה דורש תקן ת״י 900 חלק 21.03 משער חשמלי?  |

## 3. The four engines

Ask each question in each engine — 40 rows a month. Use a private window, signed out where the
engine allows it, so earlier chats do not steer the answer. Paste the question; do not add words.

- **ChatGPT** — chatgpt.com (turn its web search on if it offers the choice).
- **Perplexity** — perplexity.ai.
- **Gemini** — gemini.google.com.
- **Google** — google.com search; log the AI Overview at the top of the results. If no overview
  shows, write `no overview` in the URL column and `no` under cited.

## 4. The log

One row per question per engine. **Cited** is `yes` only when the answer links to, or names as its
source, a dangates.co.il page. **URL** is the page the answer cites: ours, or else the first other
site it cites, with its page type (guide, directory listing, map pack, video). Write only what you
see on the screen — never a number or a rank from memory.

| Date (dd/mm/yyyy) | Engine | Question # | Cited (yes / no) | URL cited |
| ----------------- | ------ | ---------- | ---------------- | --------- |
|                   |        |            |                  |           |

Keep this table blank in the repo; the history lives in the monthly audit reports.
