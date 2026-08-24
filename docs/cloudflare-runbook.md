# Cloudflare runbook — dangates.co.il

Zone settings are **owner-only**. No agent changes them; this file says what to change, why, and how
to prove it worked. Cloudflare moves menu items between releases, so each step gives the **searchable
feature name** as well as a path — search the dashboard for the name if the path has moved.

Zone: `dangates.co.il` · account `main` · zone id `77c241ad4db114ac05a7e5e2bdf144b9` · orange-cloud
(proxied) · hosting: **Cloudflare Pages, project `dangates`** (`dangates.pages.dev`), direct upload
via wrangler (`/deploy-dangates`). The roster row is `Israeli services sites/roster/roster.json`.

Verified live **2026-08-23** with the commands at the bottom. Re-verify before citing anything here;
never assume a toggle was flipped. Owner-blocked items are tracked in `docs/owner-actions.md` §1 and
`docs/business-facts.md` §H — this file is the "how", those are the "what is still open".

---

## Step 1 — Unblock the AI crawlers (highest impact)

**Feature name:** _AI Crawl Control_ (earlier names: "AI Audit", "Block AI bots" under **Security →
Bots**). Sidebar of the zone, or search "AI Crawl".

### What's happening now — the block moved, it did not go away

Earlier audits (2026-08-16) saw Cloudflare **prepend a managed block** to `/robots.txt` —
`Disallow: /` for ClaudeBot, GPTBot, Google-Extended, CCBot, Bytespider, Amazonbot, Applebot-Extended,
meta-externalagent, plus `Content-Signal: ai-train=no`. That is what backlog §6.1, business-facts §H
and `/aeo-answer-content` Gate 1 describe.

As of 2026-08-23 the managed `robots.txt` is **no longer served**: the live file is byte-identical
to what `app/robots.ts:6-9` emits (`User-Agent: *` / `Allow: /` / `Sitemap:`, 68 bytes). But the
edge now answers **403 "Your request was blocked."** (`Server: cloudflare`, no origin hit) to page
requests whose user agent is a real AI-crawler signature:

```
403  GPTBot · OAI-SearchBot · ChatGPT-User · ClaudeBot · Claude-User · Claude-SearchBot
     PerplexityBot · Perplexity-User · CCBot · Amazonbot · Bytespider · meta-externalagent
200  Googlebot · bingbot · Applebot · plain curl
n/a  Google-Extended · Applebot-Extended — robots.txt product tokens, never a wire user agent;
     only robots.txt governs them, and the repo's file already allows them
```

Search-engine UAs pass and AI UAs fail, so this is an **AI-specific block action**, not a generic
"fake verified bot" filter. An advisory `Disallow` became an enforced refusal — worse for the AEO
goal, not better: a crawler that is refused at the edge cannot read the answer blocks, the schema or a
future `llms.txt`. **Every AI-visibility item in the backlog (§6.1–§6.5) is capped until this
changes**, and no repo change can override it. `robots.txt` itself still returns 200 to a blocked UA
— only the pages are refused, which is why reading `robots.txt` alone proves nothing.

Two caveats on the probe. (1) **Use the full UA string, not the bare token.** The edge matches the
crawler's published signature: `CCBot/2.0 (https://commoncrawl.org/faq/)` is refused while a UA of
just `CCBot` passes; the same holds for `OAI-SearchBot` and `meta-externalagent` (re-probed three
times, stable). A bare-token probe therefore reports a false pass. (2) A spoofed UA from a non-crawler
IP is an approximation. The authoritative view is the AI Crawl Control page itself, which shows
allowed / blocked request counts **per crawler** over the last days — read that first; curl is the
cross-check.

Backlog §6.1, business-facts §H, `/aeo-answer-content` Gate 1 and the `robots.txt` info line in
`scripts/audit/edge.mjs` still describe the 2026-08-16 managed-`robots.txt` state. The zone control
that fixes both states is the same one; whoever closes §6.1 re-words them.

### The decision

Three coherent positions. Pick one deliberately:

| Option                              | Effect                                                                                                                                              | Who it suits                                                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Allow retrieval, block training** | ChatGPT, Claude and Perplexity can fetch a page to answer a live question and cite you. Your content is still excluded from model training corpora. | **Recommended.** You get the citations without feeding training sets.                                        |
| **Allow everything**                | Also permits training use. Simplest, maximum reach.                                                                                                 | If you don't care about training use.                                                                        |
| **Keep blocked**                    | Status quo. No AI assistant can read or cite the site.                                                                                              | Only if you actively object to AI usage — accept that a competitor who allows it will be the answer instead. |

These are genuinely different permissions. A crawler blocked from _retrieval_ cannot cite you even if
it wanted to; `ai-train=no` alone does not block citation.

### What to do

1. Zone → **AI Crawl Control** (or **Security → Bots**). Open the per-crawler table.
2. Set the crawlers below to **Allow**. For the recommended middle option, allow at minimum:
   **OAI-SearchBot**, **ChatGPT-User**, **GPTBot**, **ClaudeBot**, **Claude-User**,
   **Claude-SearchBot**, **PerplexityBot**, **Perplexity-User**. Leave **Bytespider**, **CCBot**,
   **Amazonbot** and **meta-externalagent** blocked if you want "no training" — those are bulk-corpus
   crawlers, not answer engines. **Google-Extended** and **Applebot-Extended** have no wire UA; if the
   page lists them it is editing `robots.txt` directives, and the repo's file already allows them.
3. If the page still offers a **managed `robots.txt`** toggle, keep it **off**. The repo's
   `app/robots.ts` serves alone then, and Phase 6 (roster §3 row §6: rtl-frontend-engineer, reviewed by
   aeo-geo-strategist) replaces its blanket allow with an explicit per-bot `Allow` list. The target
   shape is `galbath.co.il/app/robots.ts:21-43`: one `userAgent: "*"` group plus one named group
   listing the retrieval bots from step 2 (plus Bingbot, and CCBot only if you chose "allow
   everything"), which Next serializes as one `User-Agent:` line per bot followed by a single
   `Allow: /`. That list documents intent and gives a place for a training-only `Disallow`; it does
   **not** change enforcement — only this zone setting does.
4. If crawlers still get 403 after the change, look for a second layer: **Security → WAF → Custom
   rules** and **Security → Bots → Super Bot Fight Mode** ("Definitely automated" / "AI bots" set to
   Block). `robots.txt` is advisory; a WAF or bot rule is enforced.

### Verify

```bash
curl -sS https://dangates.co.il/robots.txt
for ua in \
  "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)" \
  "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"; do
  curl -sS -A "$ua" -o /dev/null -w "%{http_code}  ${ua:0:60}\n" https://dangates.co.il/
done
```

Expect the repo's own `robots.txt` (no managed block) **and** `200` for every allowed crawler. A 403
on any of them means the zone still refuses that bot, whatever `robots.txt` says. **The 200s are the
only proof that counts.** Then re-run `node scripts/audit/edge.mjs` — its `robots.txt` note is
informational and should be re-worded by whoever edits the backlog row §6.1 once this is done.

---

## Step 2 — Image Transformations: already on, keep it on

**Feature name:** _Transformations_ under **Images** (older path: Speed → Optimization → Images).

Verified 2026-08-23:

```
curl "https://dangates.co.il/cdn-cgi/image/width=200,format=auto/dangates-logo.png"
→ 200 image/png 10500 bytes   (the original public/dangates-logo.png is 23910 bytes)
```

The endpoint is active on this zone — unlike the galbath zone, where the same path 404s. Nothing to
do except **do not turn it off**: `@ishub/site-kit`'s `SiteImage` / `srcsetFor` / `mediaUrl` build
against `/cdn-cgi/image`, the OG card is served through the `imgquarry.com` media host declared in
`site.config.json:51-68`, and the photo pipeline in `/site-images` assumes this works the day real
photos arrive (business-facts §F, owner-actions §4.1). Transformations carry a monthly free
allowance and then bill per unique transformation; the site is small, but glance at the usage graph
once photos ship.

---

## Step 3 — Redirect `www` → apex (low priority, cleanup)

### What's happening now

`https://www.dangates.co.il/` returns **HTTP 200 with the full site** (verified 2026-08-23), and its
`robots.txt` is the same 68 bytes — both hostnames are bound to the Pages project.

**This is mitigated, not broken:** every page's canonical points at the apex, `sitemap.xml` contains
no `www` URL, and `scripts/audit/titles.mjs` asserts canonical = sitemap `<loc>`. It costs some crawl
budget and leaves two live copies of the site (backlog §1.7).

### What to do

Zone → **Rules** → **Redirect Rules** → use the _"Redirect from WWW to Root"_ template (or: when
hostname equals `www.dangates.co.il` → dynamic redirect to
`concat("https://dangates.co.il", http.request.uri.path)` with **preserve query string** on). Create it
as a **301**. Don't hand-roll a Page Rule; the template handles path and query string correctly.

### Verify

```bash
curl -sS -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "https://www.dangates.co.il/?utm_source=test"
```

Expect `301 -> https://dangates.co.il/?utm_source=test`.

---

## Step 4 — Find the security-header rule, then hand it to the repo

### What's happening now

The apex serves these (verified 2026-08-23), **none of which come from this repo** — there is no
`public/_headers` (`scripts/audit/edge.mjs` fails on that, backlog §12.1):

```
Strict-Transport-Security: max-age=15552000          (180 d; no includeSubDomains, no preload)
X-Frame-Options: SAMEORIGIN
Permissions-Policy: geolocation=(), microphone=(), camera=()
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Access-Control-Allow-Origin: *
```

The diagnostic that splits them: `https://dangates.pages.dev/` (the same build, **no zone rules**)
returns only `x-content-type-options`, `referrer-policy` and `access-control-allow-origin`. Those
three are Pages-project defaults. **HSTS, `X-Frame-Options` and `Permissions-Policy` are added by the
zone** — and a zone edit, account move or Pages re-bind drops them silently; nothing in CI notices.

There is no `Content-Security-Policy` at all (backlog §12.2).

### What to do

1. Identify the source. Three candidates — note which one it is (🔶 until you look):
   - **SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS)**. `max-age=15552000` is
     exactly Cloudflare's "6 months" preset, so HSTS very likely lives here.
   - **Rules → Transform Rules → Modify Response Header** — the likely home of `X-Frame-Options`
     and `Permissions-Policy`.
   - **Rules → Settings → Managed Transforms → "Add security headers"**.
2. Decide who owns them. Recommended: **the repo**. Phase 1 ships `public/_headers` (ADR 0004, the
   template in `/web-security-headers`) carrying the same five headers plus a **report-only** CSP.
   Cloudflare Pages merges `_headers` with its defaults — it does not replace them — so keeping the
   zone rule on as well is harmless but duplicative. Once `curl -sSI` shows the headers coming from
   the deploy, delete the zone rule so there is exactly one source of truth.
3. **HSTS stays without `preload`**, and without `includeSubDomains` unless you accept that every
   subdomain of `dangates.co.il` must be HTTPS indefinitely. Adding `preload` is close to
   irreversible.
4. Leave `Access-Control-Allow-Origin: *` alone — it is a Pages default on a static site with no
   credentials, and nothing here depends on it either way.

### Verify (after the Phase 1 deploy)

```bash
curl -sSI https://dangates.co.il/ | grep -iE 'strict-transport|content-security|x-frame|permissions|referrer|content-type-options'
curl -sSI https://dangates.pages.dev/ | grep -iE 'strict-transport|x-frame|permissions'
```

Both hosts should now show HSTS, `X-Frame-Options`, `Permissions-Policy` and
`Content-Security-Policy-Report-Only` — the second line proves the repo, not the zone, is the source.
Then watch the browser console for a week of real traffic — including **one real form submission**
and **one tracked call click** — before tightening the CSP and switching it to enforcing
(`/web-security-headers`).

---

## Leave these alone

| Setting                               | Current | Why                                                                                                                                                                                                                                                                                               |
| ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scrape Shield → Email Obfuscation** | **Off** | Verified: raw `mailto:info@dangates.co.il` in the live HTML, no `email-decode` script. On other zones in this fleet it rewrites `mailto:` into a 404. **Keep it off** — the footer email is a conversion path.                                                                                    |
| **Speed → Rocket Loader**             | **Off** | Verified: no `data-cf-settings` / `rocket-loader` markers. Rocket Loader defers scripts and is a classic cause of GTM firing late or not at all (golden rule 8). Keep it off.                                                                                                                     |
| **Auto Minify**                       | n/a     | Deprecated by Cloudflare and unnecessary — Next already minifies.                                                                                                                                                                                                                                 |
| **Images → Transformations**          | **On**  | Step 2. Do not turn off.                                                                                                                                                                                                                                                                          |
| **Caching / Cache Rules**             | default | HTML is `public, max-age=0, must-revalidate` (Pages default) — that is what makes a deploy visible immediately. `robots.txt` and static files sit at a 4 h edge TTL. Do not add a cache rule for HTML. `_next/static/*` gets `immutable` from `public/_headers` in Phase 1, not from a zone rule. |
| **DNS**                               | as-is   | Apex and `www` both proxied to the Pages project. Don't un-proxy (grey-cloud) either record — the headers in Step 4 and the redirect in Step 3 only exist on the proxied path.                                                                                                                    |

If a check looks stale after a deploy (an old `robots.txt`, an old header), **Caching → Configuration
→ Purge Everything** before concluding the change failed.

---

## After the next deploy

Phase 1 ships three edge files for the first time: `public/_redirects` (real 301s replacing the 37
meta-refresh stubs — ADR 0004), `public/_headers` (Step 4) and, in Phase 6, `public/llms.txt`. Each
is verifiable only against the live site, never against the repo:

```bash
# headers come from the repo now (Step 4)
curl -sSI https://dangates.co.il/ | grep -iE 'strict-transport|content-security|x-frame|permissions|referrer|content-type-options'

# robots.txt is the repo's own, and the allowed crawlers get 200 (Step 1 — full UA string, not a bare token)
curl -sS https://dangates.co.il/robots.txt
curl -sS -A "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" -o /dev/null -w "claudebot: %{http_code}\n" https://dangates.co.il/

# a legacy URL is a real 301 that keeps the query string (today: 200 + meta refresh)
curl -sSI "https://dangates.co.il/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test" | grep -iE '^HTTP|^location'
#   expect: HTTP/1.1 301  ·  location: /locations/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test

# the destination itself is a content page, the stub is gone
curl -sS "https://dangates.co.il/locations/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/" | grep -c 'application/ld+json'

# llms.txt (Phase 6)
curl -sS -o /dev/null -w "llms.txt: %{http_code}\n" https://dangates.co.il/llms.txt
```

`/deploy-dangates` carries the same checks as its post-deploy list; `scripts/audit/edge.mjs` is the
repo-side half (stubs = 0, `_redirects` and `_headers` present, no dead-host artifacts).

---

## One-shot verification

```bash
curl -sS https://dangates.co.il/robots.txt | head -20
for ua in \
  "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot" \
  "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"; do
  curl -sS -A "$ua" -o /dev/null -w "ai-crawler %{http_code}  ${ua:0:50}\n" https://dangates.co.il/
done
curl -sS -o /dev/null -w "img-transform: %{http_code} %{content_type} %{size_download}\n" "https://dangates.co.il/cdn-cgi/image/width=200,format=auto/dangates-logo.png"
curl -sS -o /dev/null -w "www: %{http_code} -> %{redirect_url}\n" "https://www.dangates.co.il/?utm_source=test"
curl -sSI https://dangates.co.il/ | grep -iE 'strict-transport|content-security|x-frame|permissions|referrer|content-type-options'
curl -sSI https://dangates.pages.dev/ | grep -iE 'strict-transport|x-frame|permissions'
curl -sSI "https://dangates.co.il/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/" | grep -iE '^HTTP|^location'
curl -sS -o /dev/null -w "llms.txt: %{http_code}\n" https://dangates.co.il/llms.txt
curl -sS https://dangates.co.il/ | grep -c 'email-decode\|rocket-loader'      # expect 0
curl -o /dev/null -w "gtm: %{http_code}\n" -s "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

Baseline 2026-08-23 (re-run, do not copy): AI crawlers **403** on every full-UA probe ·
img-transform **200 image/png 10500** · www **200** (no redirect) · apex headers HSTS + XFO +
Permissions-Policy from the zone, pages.dev without them · legacy URL **200** (stub) · llms.txt
**404** · obfuscation/rocket markers **0** · gtm **200**. Repo side the same day:
`node scripts/audit/run-all.mjs --scope security` → `stubs 37 · redirectsFile false · headersFile
false · deadHostArtifacts 3 · foreignStubs 1 · llmsTxt false`.
