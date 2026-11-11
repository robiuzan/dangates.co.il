# GEO plan — being the answer AI assistants and Google quote

The plan from the 2026-11-10 GEO review, as of 2026-11-10: what is already done in the repo, what
only the owner can do, and what the rules forbid. The strategy behind it is
[seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md) §4–§6; the open owner rows are in
[owner-actions.md](owner-actions.md).

**Where things stand.** The site was deployed on 2026-11-10 at `669582e`, `main` was pushed, the
post-deploy probes passed, and full user-agent probes of 14 crawlers (ClaudeBot, OAI-SearchBot,
GPTBot, PerplexityBot, ChatGPT-User, Perplexity-User, Claude-User, Claude-SearchBot, `CCBot/2.0`,
Bytespider, Amazonbot, meta-externalagent, Googlebot, bingbot) all returned 200. **Everything
committed after `669582e` is local and not deployed** — items 2–10 in (a) reach the live site only
with the next deploy, on the owner's word.

---

## (a) Done in the repo

| #   | What                                                                                                                                                                                           | Commit(s)                               | Live?         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------- |
| 1   | The four guides' dates set to the deploy day; the deploy put the hub, the four guides and `/llms.txt` live                                                                                     | `669582e`                               | ✅ 2026-11-10 |
| 2   | The Business Profile link `https://www.google.com/maps?cid=14267763263292409079` in the roster `schema.sameAs`, synced to `site.config.json`                                                   | `1f1b1ec`                               | next deploy   |
| 3   | The content models carry in-text links, a table on service sections and a short local block on location pages (N25); the new fields made required                                              | `aa84b18` `f019863` `0c70e17` `bcbf822` | next deploy   |
| 4   | The logo in the header (one `<img>` per page), and photo slots that stay empty until the owner's photos arrive (N24)                                                                           | `6407f83`                               | next deploy   |
| 5   | One compact block linking all 7 gate types and all 14 areas on the 21 family pages, and the hubs linked to each other and to the guides (N30, N31)                                             | `63effb1` `96679e0`                     | next deploy   |
| 6   | The homepage leads with repair in its answer block, headings and description (N23)                                                                                                             | `96679e0`                               | next deploy   |
| 7   | The four guides reworked for cost, steps and a safety stop (N28); guide #5 «שער חשמלי לא נסגר עד הסוף» built (N29); `maxOutBytes` 12 → 13 MB after a compact build did not fit (owner's limit) | `c457c31`                               | next deploy   |
| 8   | The 7 service pages answer cost (linking `/מחירון/`, no new ₪ figure), the job steps, what an owner may check and what to ask (N26)                                                            | `0f3c74f`                               | next deploy   |
| 9   | The 14 location pages carry a short local cost, steps and checks block written from their own facts, plus one or two chosen guides (N27)                                                       | `3c5bcc9`                               | next deploy   |
| 10  | One full make-safe procedure, in guide #5; short forms and a link everywhere else; no release steps on location and index pages; a barrier arm is technician-only                              | `526d19b`                               | next deploy   |
| 11  | The 2026-11-10 decisions in the docs, the monthly [ai-probe-sheet.md](ai-probe-sheet.md), this plan, and the counts re-measured (N32)                                                          | this commit                             | docs only     |

Measured on 2026-11-10 at `bcbf822` (`npm run audit`): 1 failure, the known blog-post word floor,
which waits on the post rewrite; 47 sitemap URLs; 5 guides; 27 `FAQPage` pages; `outBytes`
12898445 against the 13000000 cap, raised by the owner to 15000000 on 2026-11-11.

**Still open in the repo:**

- Guides #6 and #7 ([content-calendar.md](content-calendar.md) §2), and moving #9 ahead of #8 —
  they answer probe questions 2, 6 and 7. The owner raised the cap to 15 MB on 2026-11-11, so about 2.1 MB is left and
  no byte cut is needed first (content-calendar §5).
- קונזולי in the comparison guide's CTA and `lib/llms.ts` — backlog N33, blocked until the owner
  fills business-facts §C. Still no 8th service page.
- Guide #5's title is 65 characters, over the 60 the title check warns at (`titles.mjs`, backlog
  §2.5) — a copy change, not made here.
- The next deploy sets guide #5's `datePublished` and `dateModified` to that deploy day, in the
  deploy commit (`deploy-dangates`).

---

## (b) The owner's checklist

1. **Approve the deploy — ✅ done 2026-11-10** (`669582e`). The CORS list, the shared GTM trigger
   and `NTFY_TOPIC` were verified in place on 2026-11-10 (owner-actions 5.3–5.5). The next deploy,
   which carries (a) items 2–10, needs your word again.
2. **Rename the Business Profile.** Google shows «דן תיקון שערים חשמליים». You confirmed on
   2026-11-10 that the real name is «דן שערים חשמליים», as on the site and in the roster, so change
   the profile name to match. It may trigger re-verification ([gbp-runbook.md](gbp-runbook.md)).
3. **Check the rest of the profile.** Compare phone, hours and website with gbp-runbook §0 and make
   sure no street address shows. Use the 14 areas in §2, listing ירושלים only if you really take
   jobs there (it is unconfirmed), and leave every price field empty.
4. **Two approvals for the repo.** The profile link in the roster `sameAs` is ✅ done (`1f1b1ec`).
   Still yours: fill the קונזולי row in [business-facts.md](business-facts.md) §C yourself (Value
   yes, Status ✅) — you said yes in chat on 2026-11-10, but agents may not fill in that file.
5. **Keep the profile active.** Send every customer the same review request after each job, with no
   reward and no filtering, and reply to every review. Post 1–2 updates a month, and tell us when
   there are reviews to quote word for word.
6. **Search Console.** The account exists; tell us whether `dangates.co.il` is verified. If not, add
   the DNS TXT record or send the HTML-tag token. Then submit `https://dangates.co.il/sitemap.xml`
   there, and give us a user for the monthly export.
7. **Settle the GA4 id.** The property exists, but the ids conflict: the live `GTM-KWGGH438` table
   routes `dangates.co.il` to `G-EMV602DCL3`, while the id you sent, `G-8GFFY333F7`, is the one that
   table routes to `3locksmiths.co.il`. Tell us which is this site's; the roster value stays `null`
   until you do. The four custom dimensions for the seasonal card (owner-actions 5.4) wait on it.
8. **Directory listings.** After step 2, list the business on דפי זהב, B144, זאפ, מידרג, easy and
   Facebook with exactly the gbp-runbook §0 details. Skip any that demand a street address, and send
   us each listing URL for `sameAs`.
9. **Run the monthly 10-question AI probe** from [ai-probe-sheet.md](ai-probe-sheet.md): the ten
   questions in ChatGPT, Perplexity, Gemini and Google, logging date, engine, question number, cited
   yes or no, and URL. Open Cloudflare AI Crawl Control first and confirm no crawler is blocked — it
   is the true view; the curl probe only imitates the bots.
10. **Answer the open facts when you can.** Is 150–350 ₪ still current, is it credited against a
    repair, and is ירושלים served? The fee is the one price assistants can quote, so a wrong number
    would spread.

---

## (c) What the rules forbid

- Inventing any business fact: years, licence, insurance, warranty term, 24/7, response time,
  rating, review or customer name.
- Adding `Review` or `AggregateRating` unless quoted word for word from the profile, or weakening the
  gate in `components/marketing/Reviews.tsx`.
- Writing אחריות מלאה or פריסה ארצית, or bringing back קריות, צפון, דרום or באר שבע.
- Adding any ₪ figure beyond 150–350 where it appears today, adding `Offer` schema, or saying the
  visit fee is credited against a repair.
- Adding a 15th location, an 8th service (קונזולי included), a motor brand page, or naming any brand
  as serviced.
- Putting full repeated sections or a template paragraph on location pages — the doorway pattern.
- Dropping the ירושלים "call to check" limit while it is unconfirmed.
- Editing the 11 old blog posts now: their rewrite is a separate, later project.
- Adding a `Person` author, an invented byline, or an invented or backdated date.
- Using stock or AI images.
- Agents changing Cloudflare, Business Profile, Search Console or GA4 settings, or guessing an id or
  token.
- Deploying without the owner's word and a dry run first, or pushing unless the owner asks.
- Editing `site.config.json`, `out/`, `.next/`, `vendor/` or `node_modules/`, hand-editing
  `public/_redirects`, or renaming `/איזורי-שירות/`.
- Agents filling in the Value column of `docs/business-facts.md`.
- Showing a street address or invented coordinates, or using a keyword-stuffed profile name,
  per-city profile services, "open 24 hours", or paid or filtered reviews.
- Removing the on-page disclosure beside the he.wikisource.org statute links.
- Raising `maxOutBytes` before trying a compact build, or above 15 MB (the owner's limit since 2026-11-11).
- Treating a `robots.txt` 200 or a bare-token probe as proof that crawlers are allowed.
- Typing search, ranking or citation numbers by hand instead of taking them from scripts or real
  exports.
