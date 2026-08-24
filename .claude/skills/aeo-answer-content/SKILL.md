---
name: aeo-answer-content
description: Answer-engine and LLM-citability layer for dangates — the Cloudflare edge that today answers 403 to every AI-crawler user agent (owner-blocked, the first gate), the per-bot Allow target for app/robots.ts, question-form H2s with a 40–60 word extractable answer first, definition and comparison blocks, templates/llms.txt, and freshness/authorship signals without a named person. Use when optimizing a page to be quoted by AI Overviews, ChatGPT or Perplexity, or when wiring robots.ts / llms.txt. Triggers: "AEO", "GEO", "AI Overviews", "llms.txt", "will an LLM cite this", "answer block", "AI crawlers", "robots.ts", "האם ChatGPT יצטט אותנו", "בלוק תשובה".
allowed-tools: Read, Grep, Glob, Bash
---

# Answer-engine optimization

The question is not "does this rank" but **"can an assistant reach this page, parse it, and prefer to
quote it?"** Three gates, in that order. Gate 1 is closed and only the owner can open it; everything
after it is capped until then — do the work anyway, but say so in every finding.

## Baseline — re-measure first

```bash
node scripts/audit/content-depth.mjs        # answer-block proxy: first <p> after <h1>, 40–60 words (warn)
node scripts/audit/schema.mjs               # dates, author gate, FAQ parity, dangling #business
node scripts/audit/edge.mjs                 # llmsTxt metric + the out/robots.txt note
curl -sS https://dangates.co.il/robots.txt  # what actually serves — never read app/robots.ts and assume
```

As of 2026-08-23: **0 of 36** service, location and post pages open with a 40–60-word paragraph
(services 3–4 words, locations 16–17, posts 1 — the first `<p>` is the `PageHeader` subtitle or a
date); `edge.mjs` → `llmsTxt: false`; FAQPage on 1 page; `updated` set on 0 of 11 posts. The
`robots.txt` note in `edge.mjs` still describes the 2026-08-16 managed-`robots.txt` state — it is
informational; whoever closes backlog §6.1 re-words it.

## Gate 1 — reachability. Check this first.

**Status 2026-08-23: CLOSED, and closed harder than before.** Cloudflare's managed `robots.txt` is
**off** — the live file is byte-identical to what `app/robots.ts:6-9` emits (`User-Agent: *` /
`Allow: /` / `Sitemap:`, 68 bytes). But the edge now answers **403 "Your request was blocked."**
(`Server: cloudflare`, no origin hit) to page requests whose user agent is a real AI-crawler
signature, while search engines pass:

```
403  GPTBot · OAI-SearchBot · ChatGPT-User · ClaudeBot · Claude-User · Claude-SearchBot
     PerplexityBot · Perplexity-User · CCBot · Amazonbot · Bytespider · meta-externalagent
200  Googlebot · bingbot · Applebot · plain curl
n/a  Google-Extended · Applebot-Extended — robots.txt product tokens, never a wire UA
```

An advisory `Disallow` became an **enforced refusal**: a crawler refused at the edge cannot read the
answer blocks, the schema or a future `llms.txt` — and `robots.txt` still returns 200 to a blocked UA,
so reading it alone proves nothing. **No repo change overrides this.** Owner's zone setting:
`docs/owner-actions.md` §1.1 (the toggle; "if still 403, check WAF / Super Bot Fight Mode") and
`docs/cloudflare-runbook.md` step 1 (decision table — recommended: allow retrieval, block training). Backlog §6.1.

**Verify with the full published UA string, not the bare token** — the edge matches the crawler's
signature: a bare `CCBot` passes while `CCBot/2.0 (https://commoncrawl.org/faq/)` is refused, so a
bare-token probe reports a false pass:

```bash
for ua in "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" \
  "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"; do
  curl -sS -A "$ua" -o /dev/null -w "%{http_code}  ${ua:0:60}\n" https://dangates.co.il/
done
```

`200` on every allowed crawler is the only proof that counts. Three different permissions:
**`ai-train`** (may the content train a model), **retrieval** (may an assistant fetch the page to
answer a live question — **this produces citations**), **`use=reference`** (attribution). Blocking
training while allowing retrieval is coherent; blocking retrieval means no citation, ever.

### The `app/robots.ts` target (Phase 6 — documents intent, changes no enforcement)

Once the zone allows the bots, `rtl-frontend-engineer` replaces the blanket allow with this per-bot
list (reviewer `aeo-geo-strategist`; roster §3 row §6). Shape from `galbath.co.il/app/robots.ts:21-43`;
Next serializes the named group as one `User-Agent:` line per bot over a single `Allow: /`:

```ts
rules: [
  { userAgent: "*", allow: "/" },
  { // retrieval and indexing agents behind AI answers — a blocked crawler cannot cite what it cannot read
    userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot",
      "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"],
    allow: "/" },
],
```

Drop `CCBot` if the owner chose "allow retrieval, block training" — a bulk-corpus crawler. The doc
comment must say the zone, not this file, decides. Backlog §1.3 (45 crawlable `index.txt` RSC
payloads) is the one `Disallow` candidate to add here.

## Gate 2 — extractability

An answer engine lifts a **contiguous, self-contained span**. Structure for that. Spec:
`docs/content-standards.md` §5; writer `hebrew-copywriter`, reviewed by `hebrew-editor` then `claims-verifier`.

**The answer block** — every service page, location page, post and guide opens with one:

- Directly under a **question-form heading** (`<h2>כמה עולה תיקון מנוע לשער חשמלי?`).
- **40–60 words**; **complete in the first sentence** — no "there are several factors" preamble.
- Self-contained — no pronouns pointing outside the block, because that is how it gets quoted.
- Contains the concrete number, range or duration where one exists **and is sourced** (§6 — today
  only the 150–350 ₪ visit fee). Buyer vocabulary: **עינית** not חיישן, **לוח פיקוד** not לוח בקרה
  (`docs/keyword-map.md` §2).

```
## למה השער החשמלי לא נסגר עד הסוף?
ברוב המקרים הסיבה היא עינית בטיחות מלוכלכת או לא מיושרת, שמזהה מכשול מדומה ועוצרת את התנועה.
ניקוי עדשת העינית ויישור מחדש פותרים את התקלה בדקות. אם השער עדיין נעצר, הבעיה בדרך כלל
בהגדרות מרחק הסגירה בלוח הפיקוד — שם נדרש טכנאי.
```

Other liftable shapes: a **definition** ("שער נגרר הוא…"), a **comparison table** (תיקון מול החלפה;
נגרר / כנף / מתרומם by plot width and clearance), a **spec list** (which operator suits which gate weight).

**Where the copy lives — none of it exists yet.** Phase 3 adds `cityContent[slug].answer` and
`serviceDepth[slug].answer` to `lib/content.ts` (`/new-city`, `/new-service`); Phase 4 adds guides
whose first block is the answer (`/new-guide`, ADR 0003). The route must render it as the **first
`<p>` after the `<h1>`** — what `content-depth.mjs` measures; today the `PageHeader` subtitle sits there.

**Rendering rules:** the answer is in the HTML at first paint — not behind a tab, not client-fetched.
`components/marketing/Faq.tsx:47` keeps every answer in the DOM but `hidden` (`display:none`) except
the first — an **extraction risk today (N8)**: present for a parser, invisible to a renderer-based
crawler. `/engagement-ux` moves it to `<details>/<summary>`, keeping FAQPage parity.

## Gate 3 — worth citing

An assistant picks the source that answers most precisely. Generic reassurance loses to a competitor
with a number. What this site lacks (backlog §6.3), and where each gets built:

- A **fault → what-determines-the-price map** (motor, לוח פיקוד, עינית, שלט, מסילה/גלגלים) — not a
  price table: the per-gate ranges on `/מחירון/` are authored estimates (business-facts §D,
  keyword-map §10 pivot). Say what moves the price; quote only the visit fee.
- **תיקון מול החלפה**: cost drivers, downtime, expected remaining life, when each is right.
- **Gate-type selection**: נגרר / כנף / מתרומם / זרוע by plot width, slope, clearance, traffic.
- **Operator lifespan and what shortens it** — mechanism depth, no invented years.
- **The self-fix boundary** — what an owner can safely check, where 230V work must stop.
- **ת״י 900 חלק 21.03** — the strongest E-E-A-T angle available (keyword-map §12); its facts are
  citable **only with the SII URL inline**.

The blog gestures at several (`/blog/תקלות-נפוצות-בשערים-חשמליים/`,
`/blog/תחזוקה-מונעת-לשערים-חשמליים/`) in reassurance prose without a number or a table. Substance is
built through `/content-hub` (does it earn a page?) → `/new-guide` (the required table per family) →
`article-auditor`; order in `docs/content-calendar.md`. One useful comparison table earns more
citations than ten reassuring pages.

## Freshness and authorship

Assistants discount undated, unattributed content. The 11 posts emit `datePublished` and
`dateModified` (`app/blog/[slug]/page.tsx:84-85`), but `dateModified` is pinned to the publish date
and `updated` is set on 0 of 11 (backlog §6.4) — a freshness signal that says nothing. Set `updated`
only for a real copy change (`/new-article`).

**Authorship: no person, by design** — the owner intake says no name is coming (owner-actions §3.3).
`BlogPosting.author` is the `Organization` (`app/blog/[slug]/page.tsx:88`) and stays so; the planned
`articleJsonLd` prunes `author` while `lib/authors.ts` (Phase 6, empty registry — `/eeat-build`) has
no entry, and `schema.mjs` forbids a `Person` author until it does (schema-graph §4 rule 8). **Never
invent an author** — a fabricated byline is worse than none, and this site has already paid once for
fabricated attribution (golden rule 1). Expertise is shown through mechanism depth, not a name.

## Entity consistency

An assistant resolves "דן שערים חשמליים" by cross-referencing sources. `schema.sameAs` is empty
(`site.config.json:45`), there is no postal address (correct — service-area business), GBP is ⏳
(owner-actions §2.1, `docs/gbp-runbook.md`). Until then the only signals are the site's own: name,
phone `072-2587772`, hours, service area and description identical across schema, visible copy and
`llms.txt`. `sameAs` lands in the roster, never in `site.config.json`.

## llms.txt

`templates/llms.txt` → `public/llms.txt` (Phase 6, backlog §6.5; `edge.mjs` warns while absent). A
plain-language map: who the business is, the 7 services and 18 areas with **percent-encoded**
canonical URLs (byte-identical to `sitemap.xml` `<loc>`), the key facts that are **true**, and a
"notes for AI assistants" block naming what must _not_ be attributed — no warranty term, years,
rating, licence or response-time promise. Adapted from `galbath.co.il/public/llms.txt`, NAP from the
manifest. A pointer file, not a second website; update it in the change that adds a service, location
or guide. Verify: `curl -sS -o /dev/null -w "%{http_code}" https://dangates.co.il/llms.txt`. Ship it
before Gate 1 opens anyway — cheap and harmless.

## Checklist

- [ ] Live `robots.txt` fetched **and** a full-UA probe run; the stance recorded as found, not assumed.
- [ ] Every finding says Gates 2–3 are capped while Gate 1 is closed (owner-actions §1.1).
- [ ] Every service, location, post and guide opens with a 40–60 word answer as the first `<p>` after
      the `<h1>` — `content-depth.mjs` 0 outside range; every number sourced (`claims-grep.mjs`).
- [ ] Answers ship at first paint, not `display:none` (N8); one comparison table a competitor lacks.
- [ ] Posts carry `datePublished` and a true `dateModified`; `author` Organization or absent — never a Person.
- [ ] `public/llms.txt` published, percent-encoded, accurate — `edge.mjs` → `llmsTxt: true`.

## Gotchas

- A `200` on `robots.txt` says nothing about the pages; a bare-token UA probe says nothing either.
- Never fabricate dates, authors, prices or data to look authoritative — `claims-verifier` stops ship;
  never mark up an answer in `FAQPage` that is not rendered on the page (schema-graph §4 rule 2).
- Zone settings are the owner's — document the toggle in `docs/owner-actions.md`, never assume it was
  flipped, never call the Cloudflare API (`guard-destructive-ops.ps1` blocks it).
- A blocked crawler makes perfect on-page AEO worth nothing. Gate 1 first, always.
