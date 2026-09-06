# Optimization backlog — dangates.co.il

The ranked work list. Every agent and skill in `.claude/` cites section numbers from this file.

**Measure with `npm run audit`** (`node scripts/audit/run-all.mjs [--scope x] [--json]`; exit code =
failure count; refuses a stale `out/`). The per-section script is named in
[agent-roster.md](agent-roster.md) §4 and under each section heading below. Every number in this file
is **"as of 2026-08-23" context, not the source of truth** — re-run the script before quoting one.
`/audit` refreshes statuses from `docs/audits/<date>-<scope>.md`; `/improve <id>` closes an item and
writes the verifying output into its row. The inline one-liners that survive below are human sanity
checks; where a script exists it is the measurement.

**Compiled 2026-08-16/17.** Statuses re-verified 2026-08-23 against a fresh `out/`
(`npm run audit` → 37 failures across 10 checks; `npm run audit:env` → 0 dead citations).

**Severity:** P0 = shipping something wrong or harmful · P1 = material ranking/conversion loss ·
P2 = real improvement · P3 = polish. **Effort:** S = under an hour · M = half a day · L = multi-day.

**Status tag in every heading:** `✅ DONE` · `PARTIAL` (what remains is stated) · `⏳ BLOCKED · owner`
(moves only when [business-facts.md](business-facts.md) / [owner-actions.md](owner-actions.md) moves) ·
`✅ HOLDS` (sound today — don't regress) · `NOT STARTED`.

**Scope reminder:** 45 content pages — 1 home, 7 Hebrew statics, 7 services, 18 locations, the blog
index and 11 posts. `out/` also holds 37 legacy redirect stubs and `/404`, for 83 `index.html` files.

---

## §0. ✅ Phase 0 — DONE 2026-08-17 · deployed 2026-09-06 · ✅ Phase E0 — environment hardened 2026-08-23

**Phase 0** — the three correctness items, plus three cheap fixes shipped alongside them. All verified
against a clean `out/`; `lint`, `typecheck`, `format:check` and `build` all pass.

| #   | Item                                                                     | Section     | Verified today by                                |
| --- | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------ |
| 1   | Fabricated reviews + `AggregateRating` removed and **gated**             | §7.1        | `schema.mjs` (Review/AggregateRating forbidden)  |
| 2   | Blog spam, 55 dead headings, 6 fused words, 8 of 12 curly quotes cleaned | §3.6/7/9/12 | `spam-grep.mjs` → spam 0, fused 0, tails 0       |
| 3   | Doubled brand suffix fixed on all 26 affected pages                      | §2.1        | `titles.mjs` (brand token exactly once)          |
| 4   | Homepage description added (was the 34-char tagline)                     | §2.2        | `titles.mjs`                                     |
| 5   | 404 no longer canonicalises to the homepage                              | §1.2        | no canonical, single `noindex` in `out/404.html` |
| 6   | False "ובכל אזור המרכז" claim removed from 7 out-of-region pages         | §3.4        | `claims-grep.mjs`                                |
| 7   | `BreadcrumbList` wired through `PageHeader` on all 44 nested routes      | §4.3 / §9.6 | `links.mjs` → `breadcrumbPages: 44`              |

Deliberately deferred to Phase 3 (needs the `prefixed` field): the four region pages still render
`בשרון` / `בצפון` (§5.2).

**Phase E0** — the `.claude/` environment stopped being advice and became mechanism
([ADR 0001](decisions/0001-environment-hardening.md)). Acceptance: `npm run audit:env` → 0 failures.

| #   | Item                                                                                                                                                                                                                                                                                            | Where                                                                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | **Guards.** `permissions.deny` + PreToolUse `guard-protected-paths.ps1` / `secret-scan.ps1` / `guard-destructive-ops.ps1`; PostToolUse `post-edit-lint.ps1` (banned utilities, hex, spam, claim lexicon) + `audit-logger.ps1`; SessionStart `session-context.ps1`; path-scoped `.claude/rules/` | `.claude/settings.json`, `.claude/hooks/`, `.claude/rules/`                                         |
| 2   | **Scripts.** Twelve deterministic checks + `thresholds.json` + `claims.json`; `npm run audit`, `npm run audit:env`, `npm run gate`                                                                                                                                                              | `scripts/audit/`, `package.json`                                                                    |
| 3   | **Reports.** `docs/audits/<date>-<scope>.md` convention + template; the SessionStart hook prints the latest verdict                                                                                                                                                                             | `docs/audits/README.md`, `docs/audits/_template.md`                                                 |
| 4   | **ADRs 0001–0004** — environment hardening · `/מדריכים/` hub · typed block model · `_redirects` replace stubs                                                                                                                                                                                   | `docs/decisions/`                                                                                   |
| 5   | **Routing + owner docs.** Agent roster, owner actions, Cloudflare + GBP runbooks, content calendar, event taxonomy, rank tracking, competitors, growth roadmap                                                                                                                                  | `docs/agent-roster.md`, `docs/owner-actions.md`, `docs/*-runbook.md`, `docs/content-calendar.md`, … |
| 6   | **De-stale pass + new assets** per the roster: 15 agents, 25 skills (and the saved `site-audit` workflow where workflows are available); every `file:line` re-anchored; scripts cited instead of numbers                                                                                        | `.claude/agents/`, `.claude/skills/`, `.claude/workflows/`                                          |

**Next up: Phase 1** = suggested order 2–4 below **+ N1** (the form's invisible error state).

---

## §1. Technical SEO

Script: `edge.mjs` (stubs, `_redirects`, `_headers`, dead hosts) · `titles.mjs` (`og:url`) ·
`perf.mjs` (RSC payloads) · `links.mjs` (sitemap parity).

### 1.1 — P0 · M · [✅ DONE 2026-09-06 · repo] The 37 legacy URLs were 200-status meta-refresh stubs, not 301s

The old `scripts/gen-redirects.mjs` explained itself in its own header: _"On static GitHub Pages there
is no server to issue 301s."_ **That premise was obsolete** — the site runs on Cloudflare Pages, which
reads `public/_redirects` and issues real 301s. Decision: [ADR 0004](decisions/0004-redirects-replace-stubs.md).

Each stub is a rendered HTML page returning **200**, carrying both `<meta name="robots" content="noindex">`
**and** `<link rel="canonical">` to the destination. Google's guidance is explicitly not to combine
those two: the `noindex` can be attributed to the canonical target, so a stub meant to consolidate
`/תל-אביב/` into `/locations/תל-אביב/` can instead signal _drop_ for the destination.

Every ranking signal from 17 old root-level city URLs and 11 old blog URLs currently passes through a
client-side redirect instead of a 301. The stubs also add **45% to the crawlable URL count**.

**Fix:** emit `public/_redirects` (`<old> <new> 301`, one line per pair) from the same map, **and delete
the 37 stub directories** — a static asset at that path shadows the redirect rule, so deleting them is
mandatory, not optional. Percent-encode both columns. `public/services/index.html` is one of the 37
(`/services/` → `/שירותים/`); deleting it is safe because `app/services/[service]/` never emits an index
at `out/services/`, but verify after a rebuild. Drop the Houston stub (N4) in the same change — it is
not a redirect this business needs.

Retire `.github/workflows/deploy.yml`, `public/CNAME` and `public/.htaccess` in the same change —
GitHub Pages ignores `_redirects`, so once the stubs are gone that second origin serves a redirect-less
copy of the site (§12.4, N5). Verify: `edge.mjs` → `stubs: 0`, `redirectsFile: true`, `deadHostArtifacts: 0`.

**Closed 2026-09-06 in the repo** (Sprint 1 change set A). `scripts/gen-redirects.mjs` now emits
`public/_redirects` from the same map and writes only on a real change; the 37 stub directories, the
Houston stub, `deploy.yml`, `CNAME` and `.htaccess` are deleted. Each mapped path is emitted in **both**
its slashed and bare form (72 rules from 37 pairs) — Cloudflare Pages matches a source literally and
this export ships nothing at the bare path, so a bare-form request would otherwise reach `/404`.
Verified after a clean rebuild:

```bash
node scripts/audit/edge.mjs   # ✅ redirectRules 72 · stubs 0 · redirectsFile true · headersFile true · deadHostArtifacts 0 · foreignStubs 0
node scripts/audit/links.mjs  # ✅ contentPages 45 · sitemapUrls 45 · brokenLinks 0 · linksToStubs 0
```

**Still open:** the live 301s. Nothing is served until the next deploy — probe three legacy URLs with
`curl -sSI` expecting `301` + `Location` with `?utm_source=test` intact (`deploy-dangates`).

### 1.2 — P1 · S · [✅ DONE] The 404 page claimed to be the homepage

`out/404.html` shipped the homepage title and `<link rel="canonical" href="https://dangates.co.il/">`.
Fixed in `app/not-found.tsx` (own title, no canonical, `noindex`). Don't regress: a 404 that
canonicalises to the homepage invites Google to treat every broken URL as a duplicate of `/`.

### 1.3 — P1 · M · [NOT STARTED] 45 RSC payload files ship to production as crawlable duplicates

`perf.mjs` → `rscPayloads: 45`, `rscBytes` ≈ 1.43 MB (as of 2026-08-23). Next emits an `index.txt`
RSC payload beside every `index.html`. They contain the full readable copy of every page, sit at
crawlable URLs, and `robots.txt` allows them.

**Fix:** disallow `/*/index.txt` in the Cloudflare-side robots policy, or strip them from `out/` as a
post-build step. Confirm nothing references them first.

### 1.4 — P2 · S · [✅ DONE 2026-09-06] `staticPages` in the sitemap was a hand-maintained array of 9

Closed by commit `c047d4d` (session dangates-co-il-f6, branch `sitemap-static-routes-registry`): `staticPages` is a typed registry in `lib/site-config.ts` beside `services` and `locations`, with an optional `noindex` flag for the coming `/תודה/`; `app/sitemap.ts` derives its static entries from it; `links.mjs` cross-checks the registry against the `app/` tree both ways (`staticRoutesRegistered`) and asserts every `<lastmod>` is a real, non-future W3C date. The same commit wires `verification.google` from `analytics.googleSiteVerification` in `app/layout.tsx` (inert while the roster value is null — the repo half of §13.7). Verified 2026-09-06 after a clean rebuild: `node scripts/audit/links.mjs` → ✅ `staticRoutesRegistered 9 · contentPages 45 · sitemapUrls 45 · orphans 0`; `out/sitemap.xml` byte-identical to the previous build (pure refactor; not deployed yet). Phase 4 appends the guides registry the same way (ADR 0002).

### 1.5 — P2 · S · [✅ DONE 2026-09-06] `og:url` is absent on all 45 pages

`titles.mjs` → `ogUrlMissing: 45`. Cheap to add via the layout's `openGraph` block.

**Closed 2026-09-06** by commit `13a6bdc` (Sprint 1 change set B, row 1.6). `lib/seo.ts` is now the single place
`alternates.canonical` and `openGraph.url` are derived from: `routeUrl()` builds the path and
`ogBase` carries image, type, locale and site name, and all twelve route files spread `ogBase` into
their own `openGraph` — so a route that sets `openGraph` can no longer silently drop the OG image,
which is what Next's wholesale replacement of a parent `openGraph` object otherwise causes. Verified
after a clean rebuild:

```bash
node scripts/audit/titles.mjs   # ✅ pages 45 · ogUrlMissing 0 · uniqueTitles 45 · uniqueDescriptions 45
```

### 1.6 — P2 · S · [✅ DONE 2026-09-06] `REDIRECTS.md` and `gen-redirects.mjs` could drift, and nothing ran the generator

The generator is not wired into any npm script, so the map and the emitted stubs can diverge silently.
Closed with §1.1: the generator emits `_redirects` and is wired as both `npm run redirects` and
`prebuild`, so every build regenerates it from the map. It writes only when the content actually
changes, so a rebuild cannot bump the file's mtime and trip the audit's staleness guard (N12).
Verify: `node scripts/gen-redirects.mjs` twice — the second run prints "is current … nothing
written" — then `git status --porcelain public/` is clean.

### 1.7 — P3 · S · [⏳ BLOCKED · owner] `www.dangates.co.il` returns 200 with a full duplicate

Mitigated by the canonical and the sitemap (both apex-only), so this is cleanup, not a defect.
Cloudflare → Rules → Redirect Rules → 301 to apex. [owner-actions.md](owner-actions.md) §1.

### 1.8 — [✅ HOLDS] Already sound, don't regress

`app/sitemap.ts` uses real per-content `<lastmod>` dates (never the build clock), `encodeURI`, and
trailing slashes on all 45 URLs. Every page has exactly one self-referencing canonical
(`titles.mjs`). `links.mjs` → 0 broken links, 0 links to stubs, 45 = 45 sitemap parity — and since `c047d4d` (2026-09-06) every `<lastmod>` asserted as a real, non-future W3C date and the static routes cross-checked against the `staticPages` registry.

---

## §2. On-page metadata

Script: `titles.mjs` (unique titles/descriptions, brand token once, length, canonical = sitemap).

### 2.1 — P0 · S · [✅ DONE] Doubled brand suffix on 26 pages

`app/layout.tsx:28` sets `template: "%s | דן שערים חשמליים"`, and three places appended it **again**
(18 locations, 7 services, `/אודות/`). Fixed 2026-08-17 — the routes now write the bare subject:
`app/locations/[city]/page.tsx:30`, `app/services/[service]/page.tsx:38`, `app/אודות/page.tsx:13`,
each with a comment saying why. `titles.mjs` fails on any title carrying the brand token twice.

Sanity check: `grep -rl 'דן שערים חשמליים | דן שערים חשמליים' out --include=index.html | wc -l` → 0.

### 2.2 — P1 · S · [✅ DONE] The homepage had no metadata export at all

`app/page.tsx` now exports `metadata` with a real description (it inherited the 34-char tagline).

### 2.3 — P1 · L · [NOT STARTED] All 18 location descriptions are one interpolated token apart

Title, description and H1 all interpolate only `${loc.name}`. Combined with the 2-token body delta
(§3.1), the metadata layer gives Google nothing to tell Haifa from Beer Sheva.

**Fix (Phase 3):** add `kind` + `prefixed` to `locations` and a `cityContent` map in **`lib/content.ts`**
(not `site-config.ts`) — the `new-city` skill describes the target model and says plainly it does
not exist yet. Move `locationsUpdated` (`lib/site-config.ts:112`) onto each entry at the same time —
one shared date becomes false precision the moment the pages diverge.

### 2.4 — P1 · M · [NOT STARTED] Service descriptions are the on-page opening paragraph verbatim

**Five** of seven run **163–229 characters** and truncate in SERPs (re-measured 2026-08-24 by
`titles.mjs`; the earlier "three of seven" counted only the 190+ breaches — `שערים-לחניה` and
`תריסי-גלילה-חשמליים` sit at 163). `app/services/[service]/page.tsx:39` reuses `card.description`,
which is also rendered as body copy. Two location descriptions also breach at 162 and 164, and the
two legal statics are far **under** at 40 and 57. `titles.mjs` warns on every description outside
120–160.

### 2.5 — P2 · S · [NOT STARTED] Blog titles render at 58–72 characters after the template

`titles.mjs` warns on each one over 60 once `| דן שערים חשמליים` is appended.

### 2.6 — P2 · S · [NOT STARTED] Blog descriptions are verbatim openings — some short, two cut mid-sentence

`titles.mjs` warns on the short ones (100–110 chars) and on a missing terminal punctuation mark.

---

## §3. Content depth

Acceptance bar: [content-standards.md](content-standards.md) §1–§2. Script: `content-depth.mjs`
(unique words inside `<main>` minus shared blocks, doorway delta vs nearest sibling, answer-block
proxy) · `spam-grep.mjs` · `claims-grep.mjs`.

### 3.1 — P0 · L · [NOT STARTED] All 18 location pages are textbook doorway pages

`content-depth.mjs` as of 2026-08-23: 122 unique words per page (128 for the three two-word names)
against a 350 floor, and a doorway delta of **2 tokens** vs the nearest sibling (3 for two-word names)
against the 120 threshold — every unique token is the city name itself.

Doorway clusters are an explicit Google spam policy and the penalty lands on the **domain**, not the
page. This is the single largest ranking risk on the site.

**Fix (Phase 3):** `new-city` skill — `cityContent` with three or more genuinely local items per
content-standards §2. Verify: `content-depth.mjs` → `location.belowFloor: 0`, delta ≥ 120.

### 3.2 — P1 · L · [NOT STARTED] All 7 service pages carry 13–23 words their siblings lack

`content-depth.mjs`: 151–155 unique words per page (floor 450), doorway delta 13–23 (threshold 120).
Everything else — the trigger list, process steps, CTA card, related grid — is byte-identical across
all seven and duplicated from the homepage.

`תריסי גלילה חשמליים` is not a gate at all and needs genuinely different copy, not a noun swap.
**Fix (Phase 3):** `new-service` skill — `serviceDepth` + per-service `faqs`/`triggers`.

### 3.3 — P1 · S · [✅ DONE 2026-09-06] The shared `triggers` array puts gate faults on the shutters page

`app/services/[service]/page.tsx:43-48` declares four "מתי כדאי לפנות אלינו" bullets at module scope,
so `השער נתקע, לא נסגר או לא נפתח עד הסוף` renders on `/services/תריסי-גלילה-חשמליים/`. It is also
user-facing Hebrew living in a route file rather than `lib/content.ts`. Phase 1: move it to content
as a per-service field.

**Closed 2026-09-06** by commit `cfff52f` (Sprint 1 change set C, row 1.10). `lib/content.ts` exports
`serviceTriggers: Record<ServiceSlug, readonly string[]>` — a total record, so a missing slug fails
typecheck — and the route reads `serviceTriggers[card.slug]`; the module-scope array is gone. Seven
distinct lists, verified in the export after a clean rebuild:

```bash
# "השער נתקע" now appears on /services/שערים-נגררים/ only — the one service it describes
node -e "for (const s of require('fs').readdirSync('out/services')) { const h = require('fs').readFileSync('out/services/'+s+'/index.html','utf8'); console.log(s, h.includes('השער נתקע')); }"
# שער-זרוע false · שערי-כנף false · שערים-לדירה false · שערים-לחניה false
# שערים-מתרוממים false · שערים-נגררים true · תריסי-גלילה-חשמליים false
```

`/services/תריסי-גלילה-חשמליים/` now opens its "מתי כדאי לפנות אלינו?" list with
"התריס לא עולה או לא יורד בלחיצה על המתג". `content-depth.mjs` `serviceMedianDelta` is 40 (was
13–23 as of 2026-08-23); the 450-word floor is §3.2's remainder, not this row's.

### 3.4 — P1 · S · [✅ DONE] Location copy claimed "ובכל אזור המרכז" on pages outside המרכז

Removed from the shared template 2026-08-17 (it was wrong on חיפה, באר שבע, צפון, דרום, קריות, אשקלון
and ירושלים).

### 3.5 — P1 · M · [NOT STARTED] Half the homepage FAQ answers are 4–7 words — and all ten ship as `FAQPage`

Including `איך ניתן ליצור קשר?`, answered **without the phone number**. Thin answers in structured data
are worse than no structured data: they are what an assistant would quote. `content-hub` owns the
`moreAt` link-out contract for homepage FAQs.

### 3.6 — P0 · S · [✅ DONE] Injected adult-spam was live in a blog post

`lib/posts.ts` carried an English adult-spam phrase rendered at `/blog/יתרונות-שער-חשמלי-לעסק/`.
Removed 2026-08-17. `spam-grep.mjs` → `spamHits: 0`; the PostToolUse hook re-checks every edit to
`lib/posts.ts`. Sanity check (must print nothing):

```bash
grep -rniE 'onlyfans|leaked|casino|porn|allgatesrepair' lib/posts.ts out/blog
```

### 3.7 — P1 · S · [✅ DONE] 55 dead H2s: the "פוסטים קשורים" tail on every post

All 11 posts ended with an identical 5-heading block naming four articles that never existed on this
domain. Deleted 2026-08-17; `spam-grep.mjs` → `relatedTails: 0`. The route renders the real
"מאמרים נוספים" list at `app/blog/[slug]/page.tsx:115-130`.

### 3.8 — P1 · M · [NOT STARTED] 42 unlinked call-to-action phrases across the blog

Migration stripped every `<a>`. The posts say "היכנסו למחירון", "בקרו בעמוד צור קשר", "📌 למידע נוסף" as
plain text — anchor text written, target obvious, link missing. `spam-grep.mjs` also counts the 42
structural emoji (💡 ×33, 📌 ×4, 📞 ×4, 💬 ×1) those phrases hang off.

This is the cheapest internal-linking win on the site (§9.5) but needs the typed block model
([ADR 0003](decisions/0003-block-content-model.md), Phase 4, `new-article` skill).

### 3.9 — P2 · S · [✅ DONE] Six run-together list items in the oldest post

A bold label fused to its sentence when `<strong>` was stripped. Fixed 2026-08-17;
`spam-grep.mjs` → `fusedWords: 0`.

### 3.10 — P2 · M · [NOT STARTED] Blog bodies are a flat wall of H2s with zero H3s

`PostBlock` is `{ type: "h" | "p" | "li"; text }` and the renderer maps every `h` to `<h2>`
(`app/blog/[slug]/page.tsx`), producing 15–31 sibling H2s per post. The source hierarchy is destroyed.

**Fix (Phase 4):** the typed block model with `level` — closed by the same refactor as §3.8.

### 3.11 — P2 · S · [PARTIAL] Mis-typed CTA heading — fixed; the empty `מקרי מבחן` section remains

The 115-character CTA sentence is no longer a heading. Still open: `lib/posts.ts:416-418` are three
consecutive headings with no body (`מקרי מבחן`, `ניתוח נתונים`), and the paragraph at `:421` then
claims `הנתונים מראים בבירור` with no data anywhere on the page. Delete the section or give it data.

### 3.12 — P2 · S · [PARTIAL] Latin curly quotes instead of Hebrew גרשיים

8 of 12 fixed. `spam-grep.mjs` → `curlyQuotes: 4`, all at `lib/posts.ts:848-849` (U+2019 around
the brand name). Replace with גרשיים `״` or drop the quotes.

### 3.13 — P2 · S · [NOT STARTED] Thin index and static pages

`content-depth.mjs` as of 2026-08-23: `/איזורי-שירות/` 111/250 · `/שירותים/` 111/250 (its 323
words are almost all the shared service teasers) · `/מחירון/` 144/400 · `/אודות/` 277/500, and the
About page is fully substitutable boilerplate. The pricing page pivots to _what drives the price_
([keyword-map.md](keyword-map.md) §10) — real numbers are not coming (business-facts §D); that pivot
is now its own item, N14.

⚠️ **The homepage joined this list on 2026-08-24**: `675 unique / 800` ❌. It is not a regression in
the ordinary sense — removing the ten fabricated reviews (§7.1) took ~200 words of body copy with
them, and content-standards' "~1,130 ✅" predates that removal. The honest fix is not to restore
volume but to add substance the homepage lacks: an answer block (§6.2) and the fault/price
mechanism copy that N14 needs anyway.

---

## §4. Structured data

Target graph: [schema-graph.md](schema-graph.md). Script: `schema.mjs` (type census per route,
dangling `@id`, raw Hebrew URLs, forbidden-until-sourced keys, FAQ parity). Phase 2 builds
`lib/jsonld.ts` for everything the kit builders don't cover.

### 4.1 — P0 · S · [✅ DONE] Fabricated `Review` + `AggregateRating` on the `LocalBusiness` @id

See §7.1. Removed 2026-08-17 and gated: `schema.mjs` fails if either type appears while
`REVIEW_SOURCE_URL` is null.

### 4.2 — P1 · M · [✅ DONE coverage · PARTIAL substance] 26 of 45 pages emitted no JSON-LD

`schema.mjs` → `pagesWithJsonLd: 45`. But the 18 location pages and 8 static pages carry **only** the
`BreadcrumbList` from `PageHeader` — no `Service`, no `areaServed`, no `CollectionPage`/`AboutPage`/
`ContactPage`. Coverage is closed; the per-route substance in schema-graph §2 is Phase 2.

### 4.3 — P1 · M · [✅ DONE] `BreadcrumbList` on zero pages while 44 render visible breadcrumbs

`components/layout/PageHeader.tsx:57-59` now feeds the same `crumbs` array to `breadcrumbJsonLd()`;
`links.mjs` → `breadcrumbPages: 44`. The trap is documented in the component: the kit takes
`{ name, path }`, **not** `{ name, url }` and not the `Crumb` shape — `PageHeader` maps
`{ label, href }` → `{ name, path: schemaPath(href) }` with the trailing slash and `encodeURI`.
**Never add a second `BreadcrumbList` on a page** (`.claude/rules/schema-jsonld.md`).

### 4.4 — P1 · M · [NOT STARTED] 18 pages reference an `@id` that resolves to nothing

`schema.mjs` → `danglingIds: 18`: `provider: { "@id": ".../#business" }` on 7 service pages and
`publisher` on 11 blog posts — but the `#business` node itself is defined **only on the homepage**.

**Fix (Phase 2):** emit the business node (or a minimal `@id` stub) wherever it is referenced, per
schema-graph §1.

### 4.5 — P1 · S · [NOT STARTED] No `image` or `logo` on any JSON-LD node

`schema.mjs` warns: business node carries no image/logo. A 1200×630 OG card is already wired in the
manifest and `public/dangates-logo.png` is unreferenced; neither reaches the graph.

### 4.6 — P2 · S · [PARTIAL] The homepage JSON-LD is one script tag, but an array, not a `@graph`

The reviews block is gone, so the business node is no longer split across two scripts. What remains:
`app/page.tsx:29` emits `[localBusinessJsonLd(), faqJsonLd()]` — a JSON array of two `@context`
objects rather than a single `@graph` (`schema.mjs` warns on `/`). The 7 service and 11 post pages
also split across **two** `<script>` blocks (their own node + the `PageHeader` breadcrumb). Phase 2
merges each page into one `@graph`.

### 4.7 — P2 · S · [PARTIAL] Schema URLs use raw Hebrew; canonicals use percent-encoding

Breadcrumb `item` URLs are now encoded (`PageHeader.tsx:24-25`). Still raw: `Service.url` on all 7
service pages and `BlogPosting.mainEntityOfPage` on all 11 posts (`app/blog/[slug]/page.tsx:87`) —
`schema.mjs` → `rawHebrewUrls: 18`. Neither byte-matches the page's own canonical. See N2.

### 4.8 — P2 · S · [NOT STARTED] `areaServed` is a marketing phrase typed as `AdministrativeArea`

`{"@type":"AdministrativeArea","name":"מרכז הארץ ופריסה ארצית"}` on 8 nodes (`schema.mjs` warns) —
that is not an area name. Model coverage as a list of `City`/`AdministrativeArea` nodes, or a
`GeoCircle` service area. The manifest value is owner-gated (business-facts §E).

### 4.9 — P2 · S · [NOT STARTED] No `WebSite` node

`schema.mjs` fails on `/`. Google has no declared site name for the SERP header.

### 4.10 — P2 · M · [⏳ BLOCKED · owner] `/מחירון/` publishes 9 price ranges and emits no `Offer`

**Blocked, not merely unimplemented.** Eight of the nine ranges are authored estimates — the comment
above `priceRows` (`lib/content.ts:152-156`; the array starts at `:157`) says so. Marking an invented
number as a structured `Offer` makes a soft problem machine-readable, and the owner has said real
prices are **not coming** (business-facts §D). `schema.mjs` treats `Offer` as forbidden until sourced.

The business node also never references its own 7 services (`hasOfferCatalog` / `makesOffer`) —
that half is unblocked and belongs to Phase 2.

### 4.11 — P2 · S · [✅ HOLDS] The `LocalBusiness` node has no `address`

This is **correct for the business model** — a service-area business with no premises — and an address
must never be invented. But it does mean the Rich Results Test flags a hard error and the page is
ineligible for the local-business rich result. Record the trade-off; don't "fix" it with a fake address.

### 4.12 — P3 · S · [NOT STARTED] `BlogPosting` polish

`dateModified` hardcoded to `post.date` (`app/blog/[slug]/page.tsx:85`), ignoring the `updated` field
the data model declares · `author` is the `Organization` with no visible byline (a `Person` is **not**
coming — business-facts §B) · no `@id` or `isPartOf` link to a `Blog` entity · the business node's
`url` omits the trailing slash the export enforces (`schema.mjs` warns ×12).

### 4.13 — P3 · M · [NOT STARTED] `FAQPage` exists on 1 of 45 pages

`schema.mjs` → `faqPages: 1`. Since Google's August 2023 restriction it produces no rich result for a
site of this type — treat it as machine-readable context (AEO), not as a rich-result play. One Q/A
per `FAQPage` sitewide (`content-hub` rule); `schema.mjs` checks the parity.

---

## §5. Local SEO

Doctrine: `local-seo-il` skill. Script: `content-depth.mjs` (doorway delta).

### 5.1 — P1 · S · [⏳ BLOCKED · owner] No Google Business Profile link anywhere

`schema.sameAs` is `[]`; `siteConfig.social` is three empty strings. The top local lever. The profile
is **coming** (business-facts §A ⏳); the restore path is [gbp-runbook.md](gbp-runbook.md).

### 5.2 — P1 · M · [NOT STARTED] Four regions render wrong Hebrew in shipped titles, descriptions and H1s

`locations` has only `slug` and `name`, so templates interpolate a bare `ב${name}`:
`out/locations/שרון/index.html` ships **בשרון** where **באזור השרון** is correct; צפון ships **בצפון**
where **בצפון הארץ** is correct. A live copy defect on four pages, in three places each. Phase 3
adds `kind` + `prefixed` (deferred from Phase 0 on purpose).

### 5.3 — P1 · L · [NOT STARTED] Doorway risk on all 18 location pages

See §3.1. **No 19th location until the existing 18 pass.** 7 × 18 = 126 cells; do not build them.

### 5.4 — P2 · S · [⏳ BLOCKED · owner] Coverage and availability claims are unbounded

`areaServed` claims `פריסה ארצית` while locations span קריות to באר שבע; 24/7 emergency is claimed
sitewide (`claims-grep.mjs`: `around-the-clock` on 42 pages, `national-coverage` on 4, as of
2026-08-23). Both are promises the business will be held to. Business-facts §E.

### 5.5 — P2 · S · [NOT STARTED] No geo signals

No `GeoCoordinates`, no `hasMap`, no map embed, no neighbourhood or landmark reference in any copy.
The copy half lands with `cityContent` (Phase 3); the map half waits for the GBP (§5.1).

### 5.6 — [✅ HOLDS] NAP is correct as-is

No street address anywhere — correct for a service-area business. The `072-2587772` override is
intentional (`contact.phoneOverride: true`). **Never add an address; never "correct" the phone.**

---

## §6. AEO / GEO

Skill: `aeo-answer-content`. Script: `content-depth.mjs` (answer-block proxy: first paragraph
40–60 words) · `schema.mjs`.

### 6.1 — P1 · [✅ DONE · owner · verified 2026-09-06] Every major AI crawler was blocked at the Cloudflare edge

**Resolved on the zone, verified live 2026-09-06** with the full-UA probe loop from
[cloudflare-runbook.md](cloudflare-runbook.md) step 1: ClaudeBot, OAI-SearchBot, GPTBot, ChatGPT-User,
PerplexityBot, Perplexity-User and `CCBot/2.0` all return **200** (Googlebot and bingbot 200). The per-bot list in `app/robots.ts` (commit `6f4a1a8`) went live with the Sprint 0 deploy on 2026-09-06.

History: on 2026-08-16 a Cloudflare managed `robots.txt` sent `Disallow: /`; on 2026-08-23 that file
was gone but the edge answered **403** to every AI-crawler signature (N18). The zone setting is the
owner's and can revert without a repo change — **re-probe before every AEO claim; a `robots.txt`
read proves nothing.** §6.2–§6.5 are no longer capped by this item.

### 6.2 — P1 · M · [NOT STARTED] No page opens with an extractable answer block

`content-depth.mjs` (as of 2026-08-23): 0 of 36 service, location and post pages open with a
40–60-word paragraph — services open with 3–4 words, locations with 16–17, posts with 1. Spec:
content-standards §5. Closed by Phases 3–4 page by page.

### 6.3 — P1 · L · [NOT STARTED] Nothing on the site is worth citing over a competitor

No fault-to-cost map, no repair-vs-replace comparison, no gate-type selection matrix, no motor lifespan
data, no DIY/licensed boundary. The blog circles all five and answers none with a number or a table.
**Fix (Phase 4):** the `/מדריכים/` hub ([ADR 0002](decisions/0002-guides-hub-route.md)), first eight
guides in [content-calendar.md](content-calendar.md) §2, each gated by `article-auditor`.

### 6.4 — P2 · S · [NOT STARTED] No freshness signal on the blog

The `updated` field exists and is wired into the sitemap but is set on **0 of 11 posts**;
`BlogPosting.dateModified` pins to the publish date; every post is dated 2025 and two share a date.

### 6.5 — P2 · S · [NOT STARTED] No `llms.txt`

`edge.mjs` warns. Template ready in `aeo-answer-content/templates/llms.txt`; only useful once §6.1
opens.

---

## §7. E-E-A-T & trust

Skill: `eeat-build` (authority without a named person). Script: `claims-grep.mjs`
(`scripts/audit/claims.json` lexicon → business-facts row; a live 🔶/⛔ claim fails) · `schema.mjs`.

### 7.1 — P0 · M · [✅ DONE] Fabricated reviews — the widest problem the site had

Removed 2026-08-17. `lib/content.ts:213-221` records what was wrong (ten review texts authored and
attributed to ten real named reviewers, invented cities, a hardcoded 5-star display, a hand-set
`"5.0"`, and `AggregateRating` + ten `Review` nodes with an empty `sameAs`). Today
`lib/content.ts:242` exports `reviews = []`, `:248` `REVIEW_SOURCE_URL = null`, and
`components/marketing/Reviews.tsx:41` returns `null` unless reviews **and** a source URL exist —
the guard is the rule made mechanical. Restore path: business-facts §A, verbatim only.

### 7.2 — P1 · M · [NOT STARTED] Four load-bearing claims appear on nearly every page with nothing behind them

`claims-grep.mjs` as of 2026-08-23: `warranty-full` ("אחריות מלאה") live on 41 pages ·
`around-the-clock` on 42 · `experience` ("ניסיון רב שנים", against `foundedYear: null`) on 3 ·
`national-coverage` on 4 · two `superlative` hits at `lib/posts.ts:319` and `:557` (never permitted).

The owner has said the warranty term, licence, insurance and founding year are **not coming**
(business-facts §B, §D). So the fix is not to wait: soften "אחריות מלאה" → "אחריות על העבודה" and
"ניסיון רב שנים" → mechanism depth, sitewide (Phase 6, `eeat-build`). Verify: `claims-grep.mjs` = 0.

### 7.3 — P1 · M · [⏳ BLOCKED · owner] Eight of nine published prices are authored estimates

`lib/content.ts:152-156` says so in its own comment. They are published on `/מחירון/` as a price list a
customer will quote back. Real prices are **not coming** → pivot the page to what drives the price
([keyword-map.md](keyword-map.md) §10) rather than waiting. Business-facts §D.

### 7.4 — P2 · M · [NOT STARTED] No person entity anywhere

No author byline, no founder, no team, no credentials. `BlogPosting` attributes all 11 articles to the
`Organization`. A named person is **not coming** (business-facts §B) — so `eeat-build` builds the
`AboutPage` + `knowsAbout` + `logo`/`image` path without one, and `lib/authors.ts` stays an empty
registry with the data-only path for when a name arrives. `schema.mjs` forbids a `Person` author
while that registry is empty.

### 7.5 — P1 · L · [NOT STARTED] The site has no photographs at all

`perf.mjs` / `a11y.mjs` → `images: 0` across 45 pages. The logo renders as text
(`components/layout/Header.tsx:23`); `public/dangates-logo.png` is unreferenced. Photos are **coming**
(business-facts §F ⏳); the pipeline is the `site-images` skill. Cloudflare Image Transformations are
enabled on this zone, so `SiteImage` works the day they land.

### 7.6 — P2 · S · [NOT STARTED] The footer contradicts the CTA in a single viewport

Footer hours end at 18:00 and omit the emergency line, directly beneath a full-width CTA promising 24/7
availability — visible together on all `FinalCta` pages. Resolves with §5.4 / §7.2.

---

## §8. Conversion

Skills: `conversion-cro`, `engagement-ux`. Script: `cta-coverage.mjs` · `a11y.mjs` (form checks).
Reviewer: `cro-engagement-auditor`.

### 8.1 — P1 · M · [NOT STARTED] Lead form validation and a11y

`components/forms/LeadForm.tsx:120` sets `noValidate` with a single generic string (`:49`, rendered
at `:201-205`). No per-field state, no `aria-invalid`, no `aria-describedby`, no focus management, and
**no phone-format validation** — the field (`:143-153`) is `type="tel"` with no pattern. Israeli
formats must include landlines (this business's own number is `072-`). `a11y.mjs` fails on this.
See also N1 — the delivery-failure state renders nothing at all.

### 8.2 — P1 · S · [NOT STARTED] No consent affordance

The form collects PII while `/מדיניות-פרטיות/` exists and is never referenced from it. The privacy
policy also never mentions cookies or analytics while GTM loads unconditionally.

### 8.3 — P1 · M · [NOT STARTED] No thank-you URL

Success is an inline state swap — no URL-based conversion to count, no Google Ads target, no next step.
The success screen also tells the user to call but gives no clickable number. Phase 5 adds `app/תודה/`
(`noindex`, listed in `staticRoutes` once §1.4 lands).

### 8.4 — P2 · S · [NOT STARTED] The `city` field is declared and never collected

`types/index.d.ts:27` — in a file nothing imports (N3). Free local-intent signal, and dispatch-relevant
across 18 areas.

### 8.5 — P2 · S · [NOT STARTED] `/מחירון/` is the only commercial page with no CTA

`cta-coverage.mjs` warns: `/מחירון/` has no call/WhatsApp/form CTA inside `<main>`. `FinalCta` ships
on 41 of 45 pages; the four without it are `/צור-קשר/` (has the form), the two legal pages, and
`/מחירון/` — the highest-purchase-intent page on the site.

### 8.6 — P2 · M · [PARTIAL 2026-09-06] Lead-delivery failure is silent

`LeadForm.tsx:64` and `:87` set `status` to `"error"` and open a WhatsApp window that a popup blocker
can swallow with no notice to the user. N1 is the UI half of this item.

**The UI half landed 2026-09-06** by commit `fee7f69` (Sprint 1 change set D, row 1.12) — see N1 for
the detail. The user now sees a `role="alert"` block with a real WhatsApp `<a>` (which no popup
blocker can swallow), a `tel:` link and a retry button; a blocked popup reports itself as
`lead_error` with `reason: "popup_blocked"`.

**Still open — the measurement half, none of it in this repo:**

- **No tag or trigger consumes `lead_error`.** The event is pushed from the four call sites in
  `LeadForm.tsx` (no-key misconfig, fetch `catch`, non-ok response, blocked popup) and lands in
  `dataLayer` where nothing reads it. The GTM container work is manual, in `GTM-KWGGH438`
  ([event-taxonomy.md](event-taxonomy.md) row `lead_error`).
- **No GA4 property exists to receive it** — `analytics.ga4MeasurementId` is `null`, §13.7
  ⏳ BLOCKED · owner ([owner-actions.md](owner-actions.md) §2). Until both move, a delivery failure
  is visible to the user and still invisible to the business.

Not part of this row: the per-field `aria-invalid` errors (§8.1) and the `/תודה/` route (§8.3).

---

## §9. Navigation & internal linking

Skill: `internal-linking`. Script: `links.mjs` (orphans, chrome reach, related-link concentration,
heading order, breadcrumbs).

### 9.1 — P1 · M · [NOT STARTED] Header reaches no service or location page in one hop

`Header.tsx` renders `navItems` only; `links.mjs` → chrome = 28 hrefs, posts reachable only via
indexes and related links.

### 9.2 — P1 · S · [NOT STARTED] Six location pages are missing from the chrome

`components/layout/Footer.tsx:76` renders `locations.slice(0, 12)`. `links.mjs` → `notInChrome: 6`
(אשקלון, באר שבע, דרום, צפון, קריות, שרון); they are not strict orphans only because
`/איזורי-שירות/` lists all 18.

### 9.3 — P1 · M · [NOT STARTED] The service ↔ location mesh is one-way

No service page links to any city; no location links to another. Phase 3 adds `nearby` and
`relatedServices`.

### 9.4 — P2 · S · [NOT STARTED] Related items are selected by array order

`app/services/[service]/page.tsx:54` and `app/blog/[slug]/page.tsx:77` both `.slice(0, 4)`.
`links.mjs` warns: 2 of 7 service pages and 6 of 11 posts receive no related link at all.

### 9.5 — P1 · M · [NOT STARTED] The blog contains zero links

See §3.8 — 42 anchor-shaped phrases survived migration as dead text.

### 9.6 — P2 · S · [✅ DONE] Breadcrumbs render but emitted no schema

See §4.3.

---

## §10. Performance

Skill: `performance-web-vitals`. Script: `perf.mjs`.

### 10.1 — P1 · S · [✅ DONE 2026-09-06] No font preloads

`perf.mjs` → `woff2Files: 6`, `fontPreloads: 0` (two are marked preloadable by `next/font`,
`*.p.woff2`). With a text-only LCP element the font _is_ the critical path. Highest-value perf change
available.

**Closed 2026-09-06** by commit `13a6bdc` (Sprint 1 change set B, row 1.9). `next/font`'s own
`NextFontManifestPlugin` never emitted the preloads on this machine: it matches
`next-font-loader/index.js` as a **forward-slash** substring of `mod.request`, and `path.join` on
win32 produces `next-font-loader\index.js` — so the match can never succeed and `fontPreloads` was
structurally stuck at 0, not merely unconfigured. `lib/fonts.ts` now pins the two preloadable faces
by hash and `app/layout.tsx` emits them as `<link rel="preload" as="font" type="font/woff2"
crossorigin="anonymous">` in `<head>`; `perf.mjs` fails if a preloaded href is not a real file in
`out/`, so a hash that goes stale is caught by the gate rather than shipping a dangling preload.
Only the two `*.p.woff2` faces are preloaded — the hebrew subset (`u+0590-05ff`) and the latin one —
never all six. Verified after a clean rebuild:

```bash
node scripts/audit/perf.mjs   # ✅ fontPreloads 2 · woff2Files 6 · unusedDeps [] · devBuildFiles 0 · sourceMaps 0
```

### 10.2 — P2 · M · [NOT STARTED] JS budget

`perf.mjs`: ~751 kB across 29 chunks, 4 `"use client"` components. `Header` is client for one
boolean; `Faq` could be `<details>/<summary>` with zero JS while keeping answers in the DOM (N8).

### 10.3 — P2 · S · [✅ DONE 2026-09-06] `framer-motion` is a dependency imported nowhere

`perf.mjs` → `unusedDeps: ["framer-motion"]`. `npm uninstall` it.

**Closed 2026-09-06** by commit `13a6bdc` (Sprint 1 change set B, row 1.9) — uninstalled, and gone
from both `package.json` and `package-lock.json`. `Reveal` never imported it — it drives a CSS transition from an
`IntersectionObserver` and honours `prefers-reduced-motion` itself.
Verified after a clean rebuild:

```bash
node scripts/audit/perf.mjs               # ✅ unusedDeps [] · jsFiles 30 · jsTotalBytes 746950
grep -rn framer-motion app components lib # (no matches)
grep -n framer package.json               # (no matches)
```

### 10.4 — [✅ HOLDS] Build hygiene is clean — keep it

`perf.mjs`: `out/` ≈ 5.4 MB in 170 files, largest chunk 173 kB, 0 source maps, 0 dev-build files.
This fleet has previously shipped ~14 MB of dev-only chunks from a polluted `.next/`. Always build
from a clean `.next/`.

### 10.5 — n/a · There is no image work to do

Zero images ship (§7.5). Do not file srcset/LCP-image findings against this site until photos exist.

---

## §11. Accessibility (WCAG 2.1 AA + IS 5568)

The site **publishes a conformance statement** at `/הצהרת-נגישות/`, so each failure below also makes a
published claim false. Skill: `responsive-accessibility`. Scripts: `a11y.mjs` · `rtl-lint.mjs`.

### 11.1 — P1 · S · [NOT STARTED] Two contrast failures, both on conversion paths

The base palette is fine (white on `#B6070C` = 6.94:1; `accent-foreground` on gold = 9.70:1;
`accent-600` on white = 4.92:1). The failures are in **interaction states and a hardcoded literal**
(`a11y.mjs` computes the ratios):

| Where                                                          | Pair                   | Ratio    |
| -------------------------------------------------------------- | ---------------------- | -------- |
| `components/ui/Button.tsx:11` accent **hover**                 | `#3d2b00` on `#8a6d00` | **2.76** |
| `components/ui/Button.tsx:13` + `MobileCtaBar.tsx:22` WhatsApp | white on `#25D366`     | **1.98** |

`MobileCtaBar` is the primary phone conversion path. A rest-state-only checker passes both. The hover
fix is a one-token change — see N11 (`accent-500` already exists and passes).

### 11.2 — P2 · S · [NOT STARTED] `Reveal` interposed between `<ol>` and its `<li>`s

`components/marketing/Process.tsx:13` — `<ol>` → `<Reveal>` (a `<div>`) → `<li>`; the process steps
are not announced as a list. `a11y.mjs` fails on it.

### 11.3 — P2 · S · [NOT STARTED] Duplicated screen-reader text

`components/marketing/TrustBar.tsx:11` — an `sr-only` `<dt>` repeating the visible label inside `<dd>`.
Every stat is announced twice.

### 11.4 — P2 · M · [NOT STARTED] Mobile menu has no focus management

`components/layout/Header.tsx:57` sets `aria-expanded` but there is no `aria-controls`, no focus trap,
no Escape handler and no scroll lock. Don't copy the pattern into the dropdown §9.1 calls for.

### 11.5 — P2 · S · [NOT STARTED] Three banned RTL utilities ship

`rtl-lint.mjs` → `bannedUtilities: 3`: `components/forms/LeadForm.tsx:151`,
`components/marketing/Faq.tsx:25`, `components/marketing/PricingTeaser.tsx:17` — all `text-right`.
They render correctly in RTL today, which is exactly why they survive review. The same script counts
**8 hex literals on 5 lines** (`Button.tsx:13`, `MobileCtaBar.tsx:22`, `LeadForm.tsx:222`,
`Hero.tsx:16`, `app/צור-קשר/page.tsx:42`) — fix them in the same pass with `@theme` tokens.

---

## §12. Security

Skill: `web-security-headers`. Scripts: `edge.mjs` · `spam-grep.mjs`. Reviewer: `security-auditor`.

### 12.1 — P1 · M · [✅ DONE 2026-09-06 · repo] The live security headers were not owned by this repo

The site returns HSTS (180d), `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, `nosniff` and
`Referrer-Policy` — all from **Cloudflare zone rules**. `edge.mjs` → `headersFile: false`. A zone
change, account migration or Pages-project move drops every one silently and nothing in CI notices.

**Closed 2026-09-06 in the repo** (Sprint 1 change set A): `public/_headers` carries the template's
directives verbatim — HSTS `max-age=31536000` (deliberately a year rather than the zone's 180 d, and
without `preload` or `includeSubDomains`), `X-Frame-Options: SAMEORIGIN`, `nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, the template's wider `Permissions-Policy`, the
report-only CSP (§12.2) and `Cache-Control: immutable` for `/_next/static/*`. `edge.mjs` →
`headersFile: true`. **Still open:** it is not live until the next deploy — then `curl -sSI` the apex
and confirm the **whole** set appears (not only the first block), and the owner deletes the zone rule
([owner-actions.md](owner-actions.md) §1.3).

### 12.2 — P2 · M · [PARTIAL 2026-09-06] Report-only CSP ships; enforcing waits on observation

GTM is injected via `dangerouslySetInnerHTML` and a static export cannot generate a per-request nonce,
so the policy carries `'unsafe-inline'` for scripts. The second obstacle is gone: the 37 stubs and
their inline `location.replace()` scripts were deleted with §1.1.

`public/_headers` ships `Content-Security-Policy-Report-Only` (2026-09-06). **Still open:** it reports
to nobody — there is no `report-to` endpoint — so the only signal is the browser console. Watch a week
of real traffic after the deploy, including one form submission, one tracked call click and one legacy
URL, before tightening it or switching to the enforcing header.

### 12.3 — P2 · S · [✅ DONE 2026-09-06] `.env.example` documented a dead server path

`LEAD_EMAIL_TO` / `public/lead.php`, annotated "not used on GitHub Pages" (itself a stale premise), plus
three `NEXT_PUBLIC_*` vars nothing reads. Dead paths invite a real secret being wired into one. The
inverse drift is N6. **Closed 2026-09-06:** the file documents exactly `NEXT_PUBLIC_WEB3FORMS_KEY`, the
one variable the form reads, described as public by design with no value committed. Verify:
`node scripts/audit/edge.mjs` → `envDocumented 1 · envUsed 1` (was 4 / 1).

### 12.4 — P1 · S · [✅ DONE 2026-09-06] A live second origin

`edge.mjs` → `deadHostArtifacts: 3`: `.github/workflows/deploy.yml` builds and publishes to
**GitHub Pages on every push to `main`** while production is wrangler → Cloudflare Pages;
`public/CNAME` is its companion; `public/.htaccess` is an Apache leftover (N5). **All three deleted
2026-09-06** with §1.1; `edge.mjs` → `deadHostArtifacts: 0`. Pushing to `main` now publishes nothing
anywhere — production is only the wrangler upload.

### 12.5 — [✅ HOLDS] The Web3Forms key is public by design

Do not report it as a leaked credential (`secret-scan.ps1` allow-lists it). Honeypot present
(`components/forms/LeadForm.tsx:45`); no PII in `dataLayer`.

---

## §13. Analytics

Skill: `tracking-analytics`. Script: `cta-coverage.mjs` + the gtm.js 200-check. Event names:
[event-taxonomy.md](event-taxonomy.md).

### 13.1 — P1 · S · [✅ DONE 2026-09-06] GTM loads from `<body>`, not `<head>`

`app/layout.tsx:69-70` renders `<script id="gtm-init">` inside `<body>`, after the `<noscript>`
iframe; verified in `out/index.html` (the script sits after `</head>`). The `<head>` already exists
(`:48-56`, it carries the `imgquarry.com` preconnect). Move the init script there; keep the
`<noscript>` iframe in `<body>`. Re-measure on a fresh build before editing (N12).

**Closed 2026-09-06** by commit `13a6bdc` (Sprint 1 change set B, row 1.7). The init script moved
into the `<head>` that already carried the `imgquarry.com` preconnect; the `<noscript>` iframe stayed
in `<body>`, where it belongs. Verified on all 46 exported pages after a clean rebuild — a byte-offset
check, not an eyeball, because "the snippet is in the HTML" proves nothing (golden rule 8):

```bash
node -e "const fs=require('fs'),p=require('path');let n=0,bad=0;(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())w(f);else if(e.name==='index.html'){const h=fs.readFileSync(f,'utf8');n++;if(!(h.indexOf('gtm-init')>-1&&h.indexOf('gtm-init')<h.indexOf('</head>')))bad++;}}})('out');console.log(n,bad);"
# 46 0 — every page, gtm-init inside <head>; the ns.html <noscript> iframe stays after </head>
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"   # 200 (§13.6 re-run)
```

### 13.2 — P1 · M · [✅ DONE 2026-09-06] The highest-intent CTAs are untracked

`cta-coverage.mjs` as of 2026-08-23: 113 CTA elements, 24 missing `data-cta`, only 9 distinct tagged
elements (8 distinct values). Missing on `components/forms/LeadForm.tsx:221` (WhatsApp fallback) and
`:208` (submit), the sticky-card `Button`s at `app/services/[service]/page.tsx:121` (tel) and `:125`
(WhatsApp) (×7 pages), `app/צור-קשר/page.tsx:37` (tel), `:46` (WhatsApp) and `:59` (mailto), the
`components/marketing/PricingTeaser.tsx:49` contact link (on `/` and `/מחירון/`) and the footer
`mailto:`. The contact page is the highest-intent page on the site and reports nothing. The 9 tagged
elements all sit in `Header`, `Footer`, `MobileCtaBar`, `Hero` and `FinalCta`
(`grep -rn data-cta components`).

Note two WhatsApp opens are **JS-driven** (`LeadForm.tsx:65`, `:88`) and unreachable by any click
trigger, and icons render inside the CTA anchors, so a naive `Click Element` dataset read returns
`undefined`.

**Closed 2026-09-06** by commit `fee7f69` (Sprint 1 change set D, row 1.8). Every tel, WhatsApp,
mailto and submit control now carries a `{placement}-{action}` `data-cta`: the seven service-page
sticky-card pairs (`service-call`, `service-whatsapp`), the contact page's three
(`contact-call`, `contact-whatsapp`, `contact-email`), `pricing-contact`, `footer-email`, and the
form's `form-submit`, `form-whatsapp` and `form-call`. The JS-driven WhatsApp open is no longer
left to a click trigger at all — `openWhatsappFallback` pushes `whatsapp_click` itself, because no
GTM click trigger can ever see a `window.open`. Verified after a clean rebuild:

```bash
node scripts/audit/cta-coverage.mjs
# ✅ pagesScanned 45 · ctaElements 113 · withDataCta 113 · missingDataCta 0
#    distinctValues 17 · distinctTaggedElements 24 · chromeCtas 6
#    missingByKind: call 0 · whatsapp 0 · email 0 · submit 0 · contact-link 0
```

`distinctValues` reads 17, not 18: `form-whatsapp` and `form-call` render only on
`status === "error"`, so the static export scan sees `form-whatsapp` once (from the always-visible
"מעדיפים וואטסאפ?" link) and never sees `form-call`. Both exist in source — `grep -rho 'data-cta="[^"]*"' app components | sort -u`
lists 18 values. The GTM tags and triggers that consume them are container-side and still to do
(§13.4, §13.5, §8.6).

### 13.3 — P1 · S · [✅ DONE 2026-09-06 · repo] The 37 stubs stripped the query string

`location.replace()` to a bare path destroyed `gclid`/`utm` on every legacy entry point — all paid and
campaign attribution arriving on an old URL. Fixed for free by §1.1 (a 301 preserves the query), in
the repo since 2026-09-06. Confirm on the live response after the next deploy:
`curl -sSI "https://dangates.co.il/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test"` → `301`
with the query intact in `Location`.

### 13.4 — P2 · S · [NOT STARTED] `lead_submit` carries no dimension

No site, page, service or city field, on a container shared across ~10 fleet domains. The lead email
likewise carries no page/city/campaign attribution, so the business cannot tell which page produced a
lead. Target parameters: [event-taxonomy.md](event-taxonomy.md).

### 13.5 — P2 · S · [NOT STARTED] No form-start or submit-attempt event

Abandonment and validation friction are unmeasurable.

### 13.6 — P1 · S · [✅ HOLDS · standing rule] The container id must be 200-checked on every change

```bash
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

Two fabricated ids in a row previously cost this fleet **18 days of zero analytics across every site**,
with the snippet sitting in the HTML looking correct. `GTM-KWGGH438` is the first verified id.

### 13.7 — P2 · S · [⏳ BLOCKED · owner] GA4 property and Search Console are unprovisioned

`analytics.ga4MeasurementId` and `analytics.googleSiteVerification` are both `null`.
[owner-actions.md](owner-actions.md) §2; `gsc-ingest.mjs` is unusable until the token lands.

---

## §14. New defects found 2026-08-23

Found by the scripted sweep that built Phase E0. Each routes per its parent section in
[agent-roster.md](agent-roster.md) §3.

### N1 — P1 · S · [✅ DONE 2026-09-06] The lead form's error state renders no UI

`components/forms/LeadForm.tsx:64` and `:87` set `status` to `"error"`, but nothing in the JSX
branches on `status === "error"` — the only visible error is the client-side `error` string at
`:201-205`, which delivery failure never sets. A user whose POST failed (and whose WhatsApp popup was
blocked) sees the form sit there with an enabled submit button and no message. Parent: §8.1 / §8.6.

**Closed 2026-09-06** by commit `fee7f69` (Sprint 1 change set D, row 1.12). `LeadForm.tsx` now
branches on `status === "error"` and renders a `role="alert"` block **after** the submit button and
the WhatsApp line, so it reads in source order rather than above the control the user just pressed.
It carries a real `<a data-cta="form-whatsapp">` to the same message the blocked popup would have
opened — a link cannot be popup-blocked — a `tel:` link (`data-cta="form-call"`), and the submit
button relabels to `leadFormErrorCopy.retryLabel` so retrying is one press. All four strings live in
`leadFormErrorCopy` in `lib/content.ts`, never in the JSX (CLAUDE.md §5). The alert's WhatsApp button
overrides the `whatsapp` variant with `bg-green-700 hover:bg-green-800` rather than inheriting the
1.98:1 surface §11.1 still owns everywhere else. That override is a Tailwind palette class, not a hex
literal, and `a11y.mjs` only samples the literals in `Button.tsx` and `MobileCtaBar.tsx` — so it does
**not** move `contrastPairs`, and the ≈5:1 it computes to is a hand figure, not a measured one. §11.1
is where the WhatsApp surface gets fixed for the four other places it renders — `Hero`, `FinalCta`,
the service-page sticky card, and `MobileCtaBar`'s own `#25D366` literal. Verified after a clean
rebuild:

```bash
grep -n 'status === "error"' components/forms/LeadForm.tsx   # the render branch at :268, not only the setters
grep -n 'reportDeliveryFailure(' components/forms/LeadForm.tsx  # 4 call sites: popup_blocked, network ×2, http_<code>
npm run audit -- --scope full   # exit 26 · a11y 4 (unchanged) · cta-coverage 0
```

The measurement half of §8.6 (a GTM tag consuming `lead_error`, a GA4 property to receive it) stays
open there.

### N2 — P1 · S · [NOT STARTED] `BlogPosting.mainEntityOfPage` carries raw Hebrew

`app/blog/[slug]/page.tsx:87` interpolates `post.slug` unencoded, so the value never byte-matches the
canonical (`schema.mjs` → `rawHebrewUrls` counts 11 here plus 7 `Service.url`). Parent: §4.7.

### N3 — P2 · S · [NOT STARTED] `types/index.d.ts` is dead

Nothing under `app/`, `components/`, `lib/` or `scripts/` imports it; the `city` field it declares
(`types/index.d.ts:27`) was never wired (§8.4). Delete it or make the form use it.

### N4 — P2 · S · [✅ DONE 2026-09-06] A Houston promo stub shipped under `public/`

`public/pages_automation/הנחות-סתיו-בלעדיות-לתושבי-יוסטון/` redirects a foreign-market URL that was
never this business's (`edge.mjs` → `foreignStubs: 1`). **Deleted 2026-09-06** with §1.1 and
deliberately not redirected — it is foreign-market content, not a page of this site, so the path 404s.
Verify: `edge.mjs` → `foreignStubs: 0`.

### N5 — P2 · S · [✅ DONE 2026-09-06] `public/.htaccess` was a third dead-host artifact

An Apache rule file on a Cloudflare Pages site. Deleted 2026-09-06 with `deploy.yml` and `CNAME`
(§12.4); `edge.mjs` → `deadHostArtifacts: 0`.

### N6 — P2 · S · [✅ DONE 2026-09-06] `.env.example` inverse drift

`edge.mjs` warns both ways: four documented variables nothing reads (`NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `LEAD_EMAIL_TO`) and the one variable the app does read —
`NEXT_PUBLIC_WEB3FORMS_KEY` — undocumented. Parent: §12.3, closed with it on 2026-09-06:
`edge.mjs` → `envDocumented 1 · envUsed 1`.

### N7 — P2 · S · [✅ DONE 2026-09-06] `next.config.mjs` said the deploy target was cPanel/Apache

Production is Cloudflare Pages (CLAUDE.md §10). The comment now says so — corrected 2026-09-06; it is
the first thing an agent reads about deployment. `edge.mjs` no longer warns.

### N8 — P3 · S · [NOT STARTED] FAQ answers are `display:none` in the DOM

`components/marketing/Faq.tsx:43-51` renders every answer with `hidden={!isOpen}` — present in the
DOM (so `FAQPage` parity holds) but hidden from every reader that doesn't click, and hydration JS on
every page that renders it. `<details>/<summary>` keeps the answers in the DOM with zero JS
(`engagement-ux`, §10.2).

### N9 — P3 · S · [✅ DONE 2026-09-06] The footer year is hand-maintained

`components/layout/Footer.tsx:7` — `const year = 2026;` with a "update yearly" comment. Derive it at
build time; a static export is rebuilt on every deploy anyway.

**Closed 2026-09-06** by commit `13a6bdc` (Sprint 1 change set B, row 1.13). `Footer` is an RSC, so
`new Date().getFullYear()` runs at build time and is baked into the export — the cadence a copyright
year needs, since a static export is rebuilt on every deploy. Verified after a clean rebuild:

```bash
grep -n 'getFullYear' components/layout/Footer.tsx      # const year = new Date().getFullYear();
grep -o '.\{0,12\}2026.\{0,20\}' out/index.html          # >© <!-- -->2026<!-- --> … (baked, not client-rendered)
```

### N10 — P3 · S · [✅ DONE 2026-09-06] `navItems` and crumb hrefs lack the trailing slash the export enforces

`lib/content.ts:303-310` (`/שירותים`, `/מחירון`, …) and the crumb `href`s in the routes omit the `/`,
so every nav click is a client-side redirect to the canonical form. `PageHeader.schemaPath()` patches
it for the schema; the links themselves should carry it.

**Closed 2026-09-06** by commit `cfff52f` (Sprint 1 change set C, row 1.13). All six `navItems`
hrefs carry the trailing slash, and the crumb hrefs moved into `crumbLabels` in `lib/content.ts` in
the same change, slashed. Proven against the **export**, not the source, because that is what a
crawler sees — zero un-slashed internal hrefs across all 46 exported pages:

```bash
node -e "const fs=require('fs'),p=require('path');const bad=[];(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())w(f);else if(/\.html$/.test(e.name)){const h=fs.readFileSync(f,'utf8');for(const m of h.matchAll(/href=\"(\/[^\"]*)\"/g)){const u=m[1];if(!u.endsWith('/')&&!/\.(xml|txt|ico|png|svg|css|js|json|webmanifest)$/.test(u)&&!u.startsWith('/_next'))bad.push(u);}}}})('out');console.log(bad.length, [...new Set(bad)]);"
# 0 []
```

Two source literals survive — the middle crumb in `app/blog/[slug]/page.tsx` (`href: "/blog"`) and
the `PricingTeaser` button (`href="/צור-קשר"`). Both ship correctly anyway: Next's `Link` normalises
under `trailingSlash: true`, and `PageHeader.schemaPath()` normalises the crumb for `BreadcrumbList`
independently — which is why the export scan is clean. Tidy them the next time either file is
touched; the shipped-output assertion above is the one that matters.

### N11 — P2 · S · [NOT STARTED] `accent-500` is the AA hover token, already defined

`app/globals.css:47` defines `--color-accent-500: #d9b400`; `accent-foreground` (`#3d2b00`) on it
passes 4.5:1, where the current `hover:bg-accent-600` (`components/ui/Button.tsx:11`) scores 2.76.
§11.1's first half is a one-token change. `.claude/rules/rtl-markup.md` names it.

### N12 — P2 · — · [✅ HOLDS · standing rule] Rebuild before asserting

`run-all.mjs` refuses to audit when anything under `app/ components/ lib/ public/` is newer than
`out/index.html`. Never quote a number from a stale export — it describes a build nobody shipped.

---

## §16. New defects found 2026-08-24 (`docs/audits/2026-08-24-full.md`)

### N13 — P2 · M · [✅ DONE 2026-09-06] User-facing Hebrew and a phone literal live in route files

Golden rule 6 says business facts come from `lib/site-config.ts` and CLAUDE.md §5 says copy lives in
`lib/content.ts` — but `app/page.tsx:25` ends its metadata description with the literal
`חייגו 072-2587772` without importing `siteConfig` at all, and marketing copy is spread across
`app/locations/[city]/page.tsx:31,43`, `app/אודות/page.tsx:15,34`, `app/שירותים/page.tsx:10,18`,
`app/צור-קשר/page.tsx:12,71` and `components/marketing/{Hero,FinalCta,ServiceAreas}.tsx`.

This is the **mechanism** behind §7.2: each unconfirmed claim is spread over seven to nine files, so
softening it is a hunt rather than one edit. Move the copy first, then soften once.

**Closed 2026-09-06** by commit `cfff52f` (Sprint 1 change set C, row 1.11). Every string named above
moved into `lib/content.ts` under a "Route & component copy" block — `crumbLabels`,
`defaultWhatsappMessage`, `serviceWhatsappMessage`, `leadFormHeading`, `heroCopy`, `finalCtaCopy`,
`serviceAreasCopy`, `homeMetaDescription`, `homeFaqHeading`, `servicePageCopy`, the per-city title /
subtitle / intro builders, and the about, services-index and contact blocks. **Wording is unchanged**
— only the location moved; Sprint 4 is where any of it gets rewritten, which is the whole point of
doing this first. The phone literal is gone: `homeMetaDescription` interpolates `siteConfig.phone`
(golden rule 6). Verified after a clean rebuild:

```bash
grep -rn '072-2587772\|0722587772' app components   # (no matches — the number exists only in siteConfig)
npm run audit -- --scope full                        # exit 26 · claims-grep 5, content-depth 10 — both unmoved
```

`claims-grep` did not move, and that is the expected result, not a miss: this row moves the claims
into one file so §7.2 can soften each of them in one edit instead of nine.

### N14 — P1 · M · [NOT STARTED] The `/מחירון/` price pivot is unblocked and overdue

§7.3 and §4.10 are recorded as blocked on real prices — but the 2026-08-17 owner intake answered:
real prices are **❌ not coming**. That resolves the item rather than deferring it. The page must stop
being a price list of eight authored estimates and become _what determines the price_ (fault type,
gate weight and width, motor class, whether the existing motor can be reused, access and cabling,
whether the diagnosis fee is credited) — the pivot in `docs/keyword-map.md` §10, which targets the
same intent, is more useful than a range, and needs no number the business has not confirmed.

Verified 2026-08-24: `grep -rl '800–1,500' out --include=index.html` → `out/index.html`,
`out/מחירון/index.html`.

### N15 — P2 · S · [NOT STARTED] No transparency surface beyond a phone number

`grep -rnE 'ח\.פ\.|ע\.מ\.|תלונ|ביטול עסקה|החזר כספי' lib app` → nothing. No legal entity name, no
ח.פ./ע.מ., no complaints route, no cancellation or refund path. The **absent street address is
correct** for a service-area business (§5.6) and is not part of this item. A complaints and
cancellation channel needs no owner fact beyond the phone, WhatsApp and email that already exist —
it is the cheapest trust gain on the list. The ח.פ. itself stays 🔶 (business-facts §B).

### N16 — P2 · S · [NOT STARTED] The manifest is cast rather than narrowed

`lib/site-config.ts:20` — `siteManifest as unknown as SiteManifest` defeats strict-mode narrowing on
every field downstream (`manifest.contact`, `manifest.schema`, `manifest.analytics`), so a missing or
renamed roster key becomes a runtime `undefined` instead of a type error. Narrow at the boundary.

### N17 — P3 · M · [NOT STARTED] Three high `npm audit` advisories, build-time only

`npm audit --omit=dev --json` → `{"high":3,"total":3}` (2026-08-24) — all the same `postcss`
source-map path-traversal family bundled inside `next`'s own tree. `postcss` runs at build time only
on a static export: no runtime, no server, no browser exposure. The fix is a semver-major Next.js
bump; track it for the next planned major rather than as a release blocker.

### N18 — P2 · S · [✅ DONE 2026-09-06] Documentation drift on the AI-crawler mechanism

The mechanism changed twice: 2026-08-16 a Cloudflare **managed `robots.txt`** sending `Disallow: /`;
2026-08-23 that file gone but an enforced **403** at the edge for every AI-crawler signature;
**2026-09-06 every signature returns 200** (§6.1 ✅). Each change left docs describing the previous
state. Re-worded 2026-09-06: §6.1, `docs/owner-actions.md` 1.1, `docs/cloudflare-runbook.md` step 1,
`docs/growth-roadmap.md`, the `aeo-answer-content` Gate 1 text, the `aeo-geo-strategist` brief, the
`deploy-dangates` note and the `edge.mjs` info line.

**Closed 2026-09-06:** the owner delegated the flip; `docs/business-facts.md` §H "Unblock AI crawlers" is ✅ with the verified probe result and the history in its Why cell.
Standing consequence: anyone verifying the crawler state by reading `robots.txt` gets a **false
pass** in either direction — the full-UA page probe in the runbook is the only measurement.

---

## §15. Environment

### 15.1 — P2 · S · [PARTIAL] Citation drift is a measured quantity

`npm run audit:env` (`scripts/audit/env-doctor.mjs`) resolves every `file:line` citation in
`.claude/**`, `docs/**` and `CLAUDE.md`, lints frontmatter, and checks `Skill()` allow parity, hooks,
the deny set and the roster. As of 2026-08-23: every citation resolves (0 dead); the one failure is the
roster naming assets still landing in this change (5 agents, 8 skills). Acceptance: 0 failures, and
step 0 of `qa-build-gate` from then on.

### 15.2 — P2 · S · [✅ DONE] The baseline audit report exists

`docs/audits/2026-08-24-full.md` — written by `/audit full` on 2026-08-24 at commit `82a2a73`:
`run-all.mjs --scope full` exit **37** (matching the known baseline exactly — the environment work
introduced no regression), plus nine read-only auditors, each re-measuring rather than trusting the
handed-down numbers. It found six defects the 2026-08-23 pass had missed (N13–N18) and two figures
that had drifted (see the notes on §2.4 and §3.13). Every later run diffs against it. Cadence:
monthly (Phase 7), and after every phase ships.

### 15.3 — P3 · S · [⏳ BLOCKED · owner] `gsc-ingest.mjs` has no data to ingest

Ships with a fixture; unusable until the Search Console token lands (§13.7).

---

## Suggested order of work

0. ✅ **Phase 0** (2026-08-17): §7.1 reviews · §3.6 spam · §2.1 titles · §2.2 · §3.7 · §4.3 ·
   ✅ **Phase E0** (2026-08-23): guards, scripts, reports, ADRs, roster.
1. ~~§7.1 · §3.6 · §2.1~~ — done.
2. ~~**§1.1** real 301s via `_redirects` (also fixed §13.3, N4; retired §12.4 + N5, §1.6, §12.3/N6, N7;
   `_headers` for §12.1 and the report-only CSP for §12.2)~~ — shipped in the repo 2026-09-06, ADR 0004;
   live after the next deploy.
3. ~~**§10.1** font preloads~~ · ~~**§1.5** `og:url`~~ · ~~**§1.4** sitemap from data~~ ·
   ~~**§12.1** `_headers`~~ · ~~**§3.3** triggers to content~~ · **§3.11–3.12** ·
   ~~**§13.1** GTM to `<head>`~~ · ~~**§13.2** `data-cta`~~ — all struck items shipped in the repo
   2026-09-06 (Sprint 1, commits `a0e0fe2` `13a6bdc` `cfff52f` `fee7f69`); also ~~§10.3~~, ~~N1~~,
   ~~N9~~, ~~N10~~, ~~N13~~. §3.11–3.12 are the blog-cleanup remainder and did not ship.
4. **§11.1** contrast (via N11) · **§11.2–11.5** · ~~**N6 · N7**~~ (shipped 2026-09-06 with §1.1).
   → **Phase 1 = 2–4 + N1.** Acceptance: `npm run gate` = 0 for these checks; 45 routes, 0 stubs.
   As of 2026-09-06 the audit exits **26** (was 37): `edge`, `perf`, `titles`, `cta-coverage`,
   `links`, `export` and `spam-grep` all pass. What is left of Phase 1 is §11.1 (2 of the 4 `a11y`
   failures), §11.2 (1), §11.5 + N11 (`rtl-lint` 2) and §3.11–3.12. The fourth `a11y` failure is
   §8.1's `aria-invalid`, which is Phase 5.
5. **Phase 2 — schema:** §4.4 · §4.5 · §4.6 · §4.7/N2 · §4.8 · §4.9 · §4.12 via `lib/jsonld.ts`
   and one `@graph` per page. Acceptance: `schema.mjs` = 0.
6. **Phase 3 — depth + navigation:** §3.1 / §3.2 (the decision on whether this domain ranks) ·
   §2.3 · §5.2 · §9.1–9.4. Acceptance: `content-depth.mjs` floors + delta, `links.mjs` 0 orphans.
7. **Phase 4 — guides hub + block model:** §6.3 · §3.8 · §3.10 · §9.5 · §6.2 (ADR 0002, 0003).
8. **Phase 5 — engagement + CRO:** §8.1–8.6 · N8 · §13.4–13.5 · §10.2.
9. **Phase 6 — E-E-A-T + AEO:** §7.2 · §7.4 · §7.6 · §6.5 · §4.5 (when photos land).
10. **Phase 7 — measurement:** §13.7 · §15.2 · §15.3 (when the GSC token lands).
11. Everything tagged `⏳ BLOCKED · owner` moves when [owner-actions.md](owner-actions.md) moves.
