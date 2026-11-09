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
(`npm run audit` → 37 failures across 10 checks; `npm run audit:env` → 0 dead citations), and again
2026-11-08 after Sprints 2 and 3 on a clean rebuild (`npm run audit -- --scope full` → 15 across
`content-depth` 10 and `claims-grep` 5), and again 2026-11-09 after Sprint 4 (`1796ee7` `af8ba4c`
`74a92d1`): `npm run audit -- --scope full` → **8** failures, all in one check (`content-depth` 8) —
unchanged after the roster sync `ad2f1ab` and the review follow-up `9195c9b` (4F), re-run 2026-11-09 —
and again 2026-11-09 after Sprint 5 (`225ff45`): **5** failures, all `content-depth` (about,
areas index, location floor, post floor, location doorway) — and again 2026-11-09 after the Sprint 6
content (`7c3f2db`): **1** failure, `content-depth` post floor (11 of 11 posts under 900; Sprint 7).

**Severity:** P0 = shipping something wrong or harmful · P1 = material ranking/conversion loss ·
P2 = real improvement · P3 = polish. **Effort:** S = under an hour · M = half a day · L = multi-day.

**Status tag in every heading:** `✅ DONE` · `PARTIAL` (what remains is stated) · `⏳ BLOCKED · owner`
(moves only when [business-facts.md](business-facts.md) / [owner-actions.md](owner-actions.md) moves) ·
`✅ HOLDS` (sound today — don't regress) · `NOT STARTED`.

**Scope reminder:** 45 indexable content pages — 1 home, 7 Hebrew statics, 7 services, 18 locations,
the blog index and 11 posts — plus the `noindex` `/תודה/` (since 2026-11-08) and `/404`, for 47
`index.html` files in `out/`. The 37 legacy redirect stubs that once made it 83 are gone since
2026-09-06 (ADR 0004).

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

Deliberately deferred to Phase 3 (needs the `prefixed` field): the four region pages rendered
`בשרון` / `בצפון` until §5.2 closed with the Sprint 6 content (`7c3f2db`, 2026-11-09).

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

**Next up** (as of 2026-11-09): Phases 1, 2 and 5's repo work, the Sprint 4 truth pass, the
Sprint 5 service depth and the Sprint 6 location and index-page content (`7c3f2db`) have shipped in
the repo. What is left of Sprint 6 is the header (§9.1, row 6.5), the reviewer sign-off and the
owner's answer on the five 🔶 entries (B5, owner-actions 3.6); then Sprint 7 — see "Suggested
order of work" below.

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

**Live — verified 2026-11-08** (shipped by the 2026-10-12/13 deploys): `/תל-אביב/?utm_source=test` →
`301` to `/locations/תל-אביב/?utm_source=test`, `/contact?utm_source=test` → `301` to `/צור-קשר/` with the
query intact, `/en/` → `301` to `/`. The query string survives, so §13.3 is closed in production too.

### 1.2 — P1 · S · [✅ DONE] The 404 page claimed to be the homepage

`out/404.html` shipped the homepage title and `<link rel="canonical" href="https://dangates.co.il/">`.
Fixed in `app/not-found.tsx` (own title, no canonical, `noindex`). Don't regress: a 404 that
canonicalises to the homepage invites Google to treat every broken URL as a duplicate of `/`.

**It regressed once, through a second channel (2026-09-06, caught before deploy).** Shipping `og:url`
sitewide (§1.5) gave the layout an `openGraph.url` for the root, and the 404 inherited it — social and
AI fetchers read `og:url` as the page's identity and `noindex` does not stop them. `app/not-found.tsx`
now sets its own `openGraph` (spreading `ogBase` with no `url`; Next replaces a parent `openGraph`
wholesale rather than merging, and `url: null` does not typecheck). `titles.mjs` gained the assertion:
**`notFoundClaimsUrl` must be `false`** — it fails if the 404 declares either a canonical or an
`og:url`. Any future identity tag on this page needs the same treatment.

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

### 1.7 — P3 · S · [✅ DONE 2026-11-08 · owner] `www.dangates.co.il` returned 200 with a full duplicate

Mitigated by the canonical and the sitemap (both apex-only), so this is cleanup, not a defect.
Cloudflare → Rules → Redirect Rules → 301 to apex. [owner-actions.md](owner-actions.md) §1.

**Closed 2026-11-08:** the owner created the "Redirect from WWW to root" template rule (wildcard
`https://www.*` → `https://${1}`, 301, preserve query string on). Probed: `www/?utm_source=test` →
`301` to `dangates.co.il/?utm_source=test`; a service URL with `?a=1&b=2` keeps both parameters, once;
`http://www` first upgrades to `https://www`, then redirects. A legacy URL on `www` takes two 301s
(to the apex, then to its new page) — acceptable, one hop each.

### 1.8 — [✅ HOLDS] Already sound, don't regress

`app/sitemap.ts` uses real per-content `<lastmod>` dates (never the build clock), `encodeURI`, and
trailing slashes on all 45 URLs. Every page has exactly one self-referencing canonical
(`titles.mjs`). `links.mjs` → 0 broken links, 0 links to stubs, 45 = 45 sitemap parity — and since `c047d4d` (2026-09-06) every `<lastmod>` asserted as a real, non-future W3C date and the static routes cross-checked against the `staticPages` registry.

---

## §2. On-page metadata

Script: `titles.mjs` (unique titles/descriptions, brand token once, length, canonical = sitemap).

### 2.1 — P0 · S · [✅ DONE] Doubled brand suffix on 26 pages

`app/layout.tsx:30` sets `template: "%s | דן שערים חשמליים"`, and three places appended it **again**
(18 locations, 7 services, `/אודות/`). Fixed 2026-08-17 — the routes now write the bare subject:
`app/locations/[city]/page.tsx:30`, `app/services/[service]/page.tsx`, `app/אודות/page.tsx:13`,
each with a comment saying why. `titles.mjs` fails on any title carrying the brand token twice.

Sanity check: `grep -rl 'דן שערים חשמליים | דן שערים חשמליים' out --include=index.html | wc -l` → 0.

### 2.2 — P1 · S · [✅ DONE] The homepage had no metadata export at all

`app/page.tsx` now exports `metadata` with a real description (it inherited the 34-char tagline).

### 2.3 — P1 · L · [✅ DONE 2026-11-09] All 18 location descriptions are one interpolated token apart

Until Sprint 6: title, description and H1 all interpolated only `${loc.name}`. Combined with the
2-token body delta (§3.1), the metadata layer gave Google nothing to tell Haifa from Beer Sheva.

**Closed 2026-11-09** by commit `7c3f2db` (Sprint 6 rows 6.2–6.3). Every `locations` entry in
`lib/site-config.ts` carries `kind`, `prefixed` and its own `updated` (the shared
`locationsUpdated` is gone; `app/sitemap.ts` reads each entry's date). The per-city model is
`cityContent` in `lib/city-content.ts`, one typed module per location in
`content/locations/<slug>.ts`: its own `title`, `h1` and `metaDescription`, each falling back to the
shared builder in `lib/content.ts` (now built on `prefixed`) only while empty — all 18 are filled.
Verified on the current `out/`:

```bash
node scripts/audit/titles.mjs   # ✅ pass · uniqueTitles 46 · uniqueDescriptions 46 · ogUrlMissing 0
# per location page, measured on out/locations/*/index.html: 18 distinct meta descriptions,
#   150–159 characters; H1 = "תיקון שערים חשמליים " + prefixed on all 18
```

### 2.4 — P1 · M · [✅ DONE 2026-11-08] Service descriptions are the on-page opening paragraph verbatim

Until Sprint 4: **five** of seven ran **163–229 characters** and truncated in SERPs (measured
2026-08-24 by `titles.mjs`), because the service route reused `card.description`, which is also
rendered as body copy. Two location descriptions breached at 162 and 164, and the two legal statics
were far **under** at 40 and 57. `titles.mjs` warns on every description outside 120–160.

**Closed 2026-11-08** by commit `74a92d1` (Sprint 4 change set C, row 4.7). The meta line is its own
field: `generateMetadata` in the service route reads `ServiceMeta.metaDescription` and falls back to
`card.description`; the location, index, legal and blog-index descriptions are rewritten in
`lib/content.ts` (`locationMetaDescription`, `accessibilityMetaDescription`,
`blogIndexMetaDescription` and the rest), each 120–160 characters with terminal punctuation.
Verified on the current `out/`:

```bash
node scripts/audit/titles.mjs   # ✅ pass · 0 warnings · pages 46 · uniqueTitles 46 · uniqueDescriptions 46
```

**The service half moved again 2026-11-09** by commit `225ff45` (Sprint 5 row 5.5): the meta line
is now `ServiceDepth.metaDescription`, written with each page's depth copy in
`content/services/<slug>.ts`; `ServiceMeta.metaDescription` and the `card.description` fallback are
gone, and `generateMetadata` reads `serviceDepth[card.slug].metaDescription` for both the
description and its openGraph block. Verified on the current `out/`:

```bash
node scripts/audit/titles.mjs   # ✅ pass · 0 warnings · pages 46 · uniqueTitles 46 · uniqueDescriptions 46
# the 7 service meta descriptions, measured on out/services/*/index.html: 130–149 characters
```

### 2.5 — P2 · S · [✅ DONE 2026-11-08] Blog titles render at 58–72 characters after the template

Until Sprint 4 `titles.mjs` warned on each post title over 60 once `| דן שערים חשמליים` was
appended. **Closed 2026-11-08** by commit `74a92d1` (row 4.7): `postSeo` in `lib/content.ts` gives
every post an SEO title of 60 characters or fewer, read by the post route's `generateMetadata`
(falling back to `post.title`). The posts' own titles — which the live registers quote — are
unchanged. `node scripts/audit/titles.mjs` → 0 warnings.

### 2.6 — P2 · S · [✅ DONE 2026-11-08] Blog descriptions are verbatim openings — some short, two cut mid-sentence

Until Sprint 4 `titles.mjs` warned on the short ones (100–110 chars) and on a missing terminal
punctuation mark. **Closed 2026-11-08** by commit `74a92d1` (row 4.7): `postSeo` carries a
120–160-character description per post (falling back to `post.excerpt`), each ending in
punctuation. `node scripts/audit/titles.mjs` → 0 warnings, `uniqueDescriptions 46`.

---

## §3. Content depth

Acceptance bar: [content-standards.md](content-standards.md) §1–§2. Script: `content-depth.mjs`
(unique words inside `<main>` minus shared blocks, doorway delta vs nearest sibling, answer-block
proxy) · `spam-grep.mjs` · `claims-grep.mjs`.

### 3.1 — P0 · L · [PARTIAL 2026-11-09 · 13 of 18 done · ⏳ BLOCKED · owner 3.6 for five] All 18 location pages are textbook doorway pages

Until Sprint 6: `content-depth.mjs` measured 122 unique words per page (128 for the three two-word
names) against a 350 floor on 2026-08-23 — 139–145 by 2026-11-09 — and a doorway delta of **2
tokens** vs the nearest sibling (3 for two-word names) against the 120 threshold: every unique
token was the city name itself. Doorway clusters are an explicit Google spam policy and the penalty
lands on the **domain**, not the page.

**The measured half closed 2026-11-09** by commit `7c3f2db` (Sprint 6 row 6.1). Each location has
its own typed module `content/locations/<slug>.ts` (`export const city: CityContent`), assembled
and checked in `lib/city-content.ts` (`cityContent: Record<LocationSlug, CityContent>`, module-load
throws on an unknown service slug and on a FAQ question used anywhere else): a question-form
heading over a 40–60-word answer, three or more local notes on the housing stock, terrain and
climate and what they do to gates, a neighbourhood or town list, three city FAQs and the services
that fit. Verified on the current `out/` (export check: source tree unchanged since the build):

```bash
node scripts/audit/content-depth.mjs
# location 18 pages · belowFloor 0 · medianUnique 842 / 350 · locationMedianDelta 343.5 / 120
# per page (unique · delta vs nearest sibling), from the script's own contentPages() / tokens():
#   אשדוד 916 · 354   אשקלון 780 · 296   באר-שבע 798 · 288   דרום 799 · 330   חולון 798 · 298
#   חיפה 938 · 400    יבנה 934 · 371     ירושלים 1022 · 428  כפר-סבא 863 · 346  מודיעין 813 · 326
#   נתניה 907 · 345   פתח-תקווה 932 · 377  צפון 832 · 345   קריות 792 · 342   ראשון-לציון 979 · 342
#   רחובות 717 · 303  שרון 744 · 303     תל-אביב 852 · 346
# no location row in the failures; the answer-block warning no longer lists the location type
```

**Done for the 13 confirmed cities.** **⏳ BLOCKED · owner (owner-actions 3.6, Track B B5) for the
five 🔶 entries** — קריות, שרון, צפון, דרום, באר שבע. They pass the measured proxy as bounded
geography-and-mechanism pages (the decision recorded in implementation-sprints §8): no coverage,
travel or scheduling claim, every answer block and meta description ending on "check by phone
whether a visit is possible". The content-standards §2 item they cannot carry — the travel and
scheduling reality at that distance — waits on the owner's answer, and so does the `Service` node
with `areaServed` that `locationServiceJsonLd` still emits on those five. local-seo-strategist
sign-off on the 18 is not on record.

### 3.2 — P1 · L · [✅ DONE 2026-11-09] All 7 service pages carried 13–23 words their siblings lacked

Until Sprint 5: `content-depth.mjs` measured 151–155 unique words per page (floor 450) and a doorway
delta of 13–23 (threshold 120) on 2026-08-23 — 167–173 and 28–50 by 2026-11-09. Everything but one
paragraph — the process steps, CTA card, related grid — was identical across all seven and shared
with the homepage, and `תריסי גלילה חשמליים`, which is not a gate, read as a gate page.

**Closed 2026-11-09** by commit `225ff45` (Sprint 5 rows 5.1–5.4). Each service has its own typed
module `content/services/<slug>.ts` (`export const depth: ServiceDepth`), assembled and checked in
`lib/service-depth.ts`: a question-form heading over a 40–60-word answer, mechanism sections on how
that gate type works, fails and what moves its repair price, caveats, 4–5 FAQs, and declared related
services, cities and posts. The shutters page uses the shutter's own parts and no gate vocabulary.
Verified on the current `out/` (export check: source tree unchanged since the build):

```bash
node scripts/audit/content-depth.mjs
# service 7 pages · belowFloor 0 · medianUnique 1387 / 450 · serviceMedianDelta 438 / 120
# per page (unique · delta vs nearest sibling): שער-זרוע 1329 · 420 · שערי-כנף 1294 · 404
#   שערים-לדירה 1313 · 417 · שערים-לחניה 1422 · 438 · שערים-מתרוממים 1452 · 459
#   שערים-נגררים 1542 · 468 · תריסי-גלילה-חשמליים 1387 · 458
# no service row in the failures; the answer-block warning no longer lists the service type
```

The per-page values come from the script's own `contentPages()` / `tokens()` helpers in
`scripts/audit/lib/pages.mjs`; `--json` reports only the per-type median. `content-depth` went 8 → 5
failures.

### 3.3 — P1 · S · [✅ DONE 2026-09-06] The shared `triggers` array puts gate faults on the shutters page

`app/services/[service]/page.tsx` declares four "מתי כדאי לפנות אלינו" bullets at module scope,
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
13–23 as of 2026-08-23); the 450-word floor was §3.2's remainder, not this row's — §3.2 closed it
2026-11-09 (`225ff45`, `serviceMedianDelta 438`). `serviceTriggers` is still the source of each
page's "מתי כדאי לפנות אלינו?" list.

### 3.4 — P1 · S · [✅ DONE] Location copy claimed "ובכל אזור המרכז" on pages outside המרכז

Removed from the shared template 2026-08-17 (it was wrong on חיפה, באר שבע, צפון, דרום, קריות, אשקלון
and ירושלים).

### 3.5 — P1 · M · [✅ DONE 2026-11-08] Half the homepage FAQ answers are 4–7 words — and all ten ship as `FAQPage`

Until Sprint 4 they included `איך ניתן ליצור קשר?`, answered **without the phone number**. Thin
answers in structured data are worse than no structured data: they are what an assistant would
quote. `content-hub` owns the `moreAt` link-out contract for homepage FAQs.

**Closed 2026-11-08** by commit `af8ba4c` (Sprint 4 change set B, row 4.3). All ten `faqs` in
`lib/content.ts` carry real answers; the contact answer names `siteConfig.phone`, the email and the
hours. Seven carry a `moreAt` link-out to the page that goes deeper. The `FAQPage` is built from
`faqs.map(({ q, a }) => ({ q, a }))`, so the markup matches the visible answers and `moreAt` never
reaches the JSON-LD. Verified on the current `out/`:

```bash
node scripts/audit/schema.mjs                       # ✅ 0 failures · faqPages 1 · danglingIds 0
grep -o 'data-cta="faq-more"' out/index.html | wc -l  # 7 — one per moreAt
grep -o '<details' out/index.html | wc -l             # 10
node scripts/audit/links.mjs                        # brokenLinks 0 · orphans 0 — every moreAt target exists
```

`content-depth.mjs` → home 1535 unique words / 800 (`belowFloor 0`) at `af8ba4c`. **The review
findings closed 2026-11-09** by commit `9195c9b` (Sprint 4 change set 4F, row 4.9): the five
`hebrew-editor` should-fix items change set B's re-review left on these answers and the pricing copy
and the one `claims-verifier` should-fix on the diagnosis intro. `faqs[0]` opens with its answer
("משך התיקון תלוי בתקלה"), `faqs[1]` speaks as the business, `faqs[4]` asks its visit-fee questions
once, and the intro states the check order instead of an absolute promise. Verified on the current
`out/` (`<main>`, scripts stripped):

```bash
# out/index.html: 'שאלו כשקובעים' 0 · 'שום חלק לא' 0 · '150–350 ₪' 2 (faqs[4] + the PricingTeaser row)
node scripts/audit/schema.mjs          # ✅ 0 failures · faqPages 1 — the FAQPage still matches the visible faqs
node scripts/audit/content-depth.mjs   # home 1788 words · 1549 unique / 800 · belowFloor 0
```

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
"מאמרים נוספים" list at `app/blog/[slug]/page.tsx`.

### 3.8 — P1 · M · [NOT STARTED] 42 unlinked call-to-action phrases across the blog

Migration stripped every `<a>`. The posts say "היכנסו למחירון", "בקרו בעמוד צור קשר", "📌 למידע נוסף" as
plain text — anchor text written, target obvious, link missing. `spam-grep.mjs` also counts the
structural emoji those phrases hang off: 39 as of 2026-11-09 (re-run after 4F) (💡 ×31, 📌 ×4, 📞 ×3, 💬 ×1; 42
before Sprint 4 rewrote three post sentences).

This is the cheapest internal-linking win on the site (§9.5) but needs the typed block model
([ADR 0003](decisions/0003-block-content-model.md), Phase 4, `new-article` skill).

### 3.9 — P2 · S · [✅ DONE] Six run-together list items in the oldest post

A bold label fused to its sentence when `<strong>` was stripped. Fixed 2026-08-17;
`spam-grep.mjs` → `fusedWords: 0`.

### 3.10 — P2 · M · [NOT STARTED] Blog bodies are a flat wall of H2s with zero H3s

`PostBlock` is `{ type: "h" | "p" | "li"; text }` and the renderer maps every `h` to `<h2>`
(`app/blog/[slug]/page.tsx`), producing 15–31 sibling H2s per post. The source hierarchy is destroyed.

**Fix (Phase 4):** the typed block model with `level` — closed by the same refactor as §3.8.

### 3.11 — P2 · S · [✅ DONE 2026-11-08] Mis-typed CTA heading and the empty `מקרי מבחן` section

The 115-character CTA sentence stopped being a heading on 2026-08-17. Until Sprint 4 the post
`שער-חשמלי-חוסך-זמן` then carried three consecutive headings with no body
(`מיתוס מול מציאות: האם זה באמת חוסך זמן?`, `מקרי מבחן`, `ניתוח נתונים`) and a paragraph claiming
`הנתונים מראים בבירור` with no data anywhere on the page.

**Closed 2026-11-08** by commit `74a92d1` (Sprint 4 change set C, row 4.8). The empty headings are
deleted; `ניתוח נתונים` and its paragraph became the question-form heading
`כמה זמן שער חשמלי חוסך לאורך שנה?` over one sentence of plain arithmetic. Verified:

```bash
grep -rl 'מקרי מבחן\|ניתוח נתונים\|הנתונים מראים' out --include=index.html | wc -l   # 0
grep -c 'מקרי מבחן\|ניתוח נתונים\|הנתונים מראים' lib/posts.ts                       # 0
```

The rest of the blog's structural debt is not this row: the ~42 dead link phrases (§3.8), the flat
all-`<h2>` outline (§3.10) and the 39 emoji go with the block-model migration, Sprint 7.3. Commit
`9195c9b` (4F) rewrote this post's "שירות מהיר ואמין" CTA sentence and gave it `updated:
"2026-11-09"` (§6.4).

### 3.12 — P2 · S · [✅ DONE 2026-11-08] Latin curly quotes instead of Hebrew גרשיים

8 of 12 were fixed on 2026-08-17; the last 4 (U+2019 around the brand name in the post
`החלפה-או-תיקון-שער-חשמלי`'s "למה לבחור" section) went in commit `74a92d1` (Sprint 4 change set C, row 4.8) —
the quotes were dropped, not swapped. Verified: `node scripts/audit/spam-grep.mjs` →
`curlyQuotes 0`, `spamHits 0`, `fusedWords 0`. Nothing of this row is left for Sprint 7.3.

### 3.13 — P2 · S · [✅ DONE 2026-11-09] Thin index and static pages

`content-depth.mjs` as of 2026-08-23: `/איזורי-שירות/` 111/250 · `/שירותים/` 111/250 (its 323
words are almost all the shared service teasers) · `/מחירון/` 144/400 · `/אודות/` 277/500, and the
About page is fully substitutable boilerplate. The pricing page pivots to _what drives the price_
([keyword-map.md](keyword-map.md) §10) — real numbers are not coming (business-facts §D); that pivot
is its own item, N14. The homepage joined the list on 2026-08-24 at `675 unique / 800` — removing
the ten fabricated reviews (§7.1) took ~200 words with them — and the fix was substance, not
restored volume.

**The home and pricing halves closed 2026-11-08** by commits `1796ee7` and `af8ba4c` (Sprint 4
rows 4.2 and 4.4): the homepage gained an answer block under the H1 (`homeAnswerBlock`), the
fault-and-price mechanism section (`homeDiagnosisCopy`, rendered by `Diagnosis`) and real FAQ
answers (§3.5); `/מחירון/` became "what determines the price" (N14). Verified on the current `out/`:

```bash
node scripts/audit/content-depth.mjs
# home    1764 words · 1535 unique · floor 800 · belowFloor 0   (675 on 2026-08-24)
# pricing  945 words ·  945 unique · floor 400 · belowFloor 0   (144 on 2026-08-23)
```

Commit `9195c9b` (4F, 2026-11-09) moved both by design and kept them over their floors: home 1788
words · 1549 unique; pricing 914 · 914 unique, after the visit band's repeats were cut to two.

After Sprint 5 (`content-depth.mjs`, 2026-11-09) `/אודות/` measured 320/500 and `/איזורי-שירות/`
101/250; `/שירותים/` passed at 336/250 on the metric only — its words were still the homepage
teasers, which had stopped being subtracted as shared once the service pages dropped them
(`sharedParagraphs` 8 → 1).

**The index and about half closed 2026-11-09** by commit `7c3f2db` (Sprint 6 row 6.8). Each page
has its own typed copy module — `content/pages/services-index.ts`, `content/pages/areas-index.ts`,
`content/pages/about.ts`, through `lib/page-content.ts` — rendered by `ContentSections`, and each
opens with its own answer block under the H1. Verified on the current `out/`:

```bash
node scripts/audit/content-depth.mjs
# services-index 1034 words · 1018 unique · floor 250 · belowFloor 0   (336 on the metric only before)
# areas-index     472 words ·  456 unique · floor 250 · belowFloor 0   (101 before; 111 on 2026-08-23)
# about          1161 words · 1145 unique · floor 500 · belowFloor 0   (320 before; 277 on 2026-08-23)
# first <p> after the H1, by the audit's tokens(): /שירותים/ 56 · /איזורי-שירות/ 45 · /אודות/ 51
```

Every page this row named is over its floor; the blog index stays at 400/250 (unchanged). Home
1770 unique and pricing 914 unique on the same run.

---

## §4. Structured data

Target graph: [schema-graph.md](schema-graph.md). Script: `schema.mjs` (type census per route,
dangling `@id`, raw Hebrew URLs, forbidden-until-sourced keys, FAQ parity). Phase 2 builds
`lib/jsonld.ts` for everything the kit builders don't cover.

### 4.1 — P0 · S · [✅ DONE] Fabricated `Review` + `AggregateRating` on the `LocalBusiness` @id

See §7.1. Removed 2026-08-17 and gated: `schema.mjs` fails if either type appears while
`REVIEW_SOURCE_URL` is null.

### 4.2 — P1 · M · [✅ DONE 2026-11-08] 26 of 45 pages emitted no JSON-LD

`schema.mjs` → `pagesWithJsonLd: 45`. Coverage closed first; until 2026-11-08 the 18 location pages
and 8 static pages still carried **only** the `BreadcrumbList` from `PageHeader` — no `Service`, no
`areaServed`, no `CollectionPage`/`AboutPage`/`ContactPage`.

**Substance closed 2026-11-08** by commit `d8edb28` (Sprint 2 change set B, row 2.8). Each location
page emits a `Service` from `locationServiceJsonLd` with its place as `City` or
`AdministrativeArea` (the four regions), `provider` → `#business`; `/שירותים/`, `/איזורי-שירות/`
and `/blog/` emit `CollectionPage` + `ItemList` over the full array they render; `/אודות/` is an
`AboutPage`, `/צור-קשר/` a `ContactPage`, `/מחירון/` and the two legal pages a plain `WebPage`.
Verified after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ 0 failures · pages 46 · pagesWithJsonLd 45 · danglingIds 0 · rawHebrewUrls 0
# typeCensus: location Service 18 · services-index / areas-index / blog-index CollectionPage + ItemList 1 each
#             about AboutPage 1 · contact ContactPage 1 · pricing WebPage 1 · legal WebPage 2 · thanks {} (noindex)
```

### 4.3 — P1 · M · [✅ DONE] `BreadcrumbList` on zero pages while 44 render visible breadcrumbs

`components/layout/PageHeader.tsx` feeds the same `crumbs` array to the breadcrumb builder;
`links.mjs` → `breadcrumbPages: 44`. The kit takes `{ name, path }`, **not** `{ name, url }` and not
the `Crumb` shape — since `02a3144` (2026-11-08) the mapping `{ label, href }` →
`{ name, path: schemaPath(href) }` lives in `breadcrumbNode()` in `lib/jsonld.ts`, and `PageHeader`
renders it inside the page's one `@graph`.
**Never add a second `BreadcrumbList` on a page** (`.claude/rules/schema-jsonld.md`).

### 4.4 — P1 · M · [✅ DONE 2026-11-08] 18 pages reference an `@id` that resolves to nothing

`schema.mjs` → `danglingIds: 18` until 2026-11-08: `provider: { "@id": ".../#business" }` on 7
service pages and `publisher` on 11 blog posts, while the `#business` node was defined **only on the
homepage**.

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.2). `businessNode()` in
`lib/jsonld.ts` is emitted in the same `@graph` on every page that references `#business` — an
`@id`-only stub would still count as a reference, so the full node ships. Verified after a clean
rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ danglingIds 0 · GeneralContractor on home 1, service 7, post 11, location 18, about 1, contact 1
```

### 4.5 — P1 · S · [✅ DONE 2026-11-08] No `image` or `logo` on any JSON-LD node

Until 2026-11-08 `schema.mjs` warned that the business node carried no image/logo, while the
manifest OG card and `public/dangates-logo.png` were both available.

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.6). `businessNode()` adds
`logo` (`public/dangates-logo.png`) and `image` (the manifest OG card on the media host). The
header still renders the logo as text — that is §7.5, not this row. Verified after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ 0 warnings — the "business node carries no image/logo" warning is gone
# out/index.html #business: logo https://dangates.co.il/dangates-logo.png · image https://imgquarry.com/…/dangates/og.jpg
```

### 4.6 — P2 · S · [✅ DONE 2026-11-08] The homepage JSON-LD is one script tag, but an array, not a `@graph`

Until 2026-11-08 `app/page.tsx` emitted a JSON array of two `@context` objects rather than one
`@graph`, and the 7 service and 11 post pages split across **two** `<script>` blocks (their own node
plus the `PageHeader` breadcrumb).

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.1). `graph()` in
`lib/jsonld.ts` builds one `{ "@context", "@graph" }` per page; pages with a `PageHeader` hand it
their `nodes` and it appends the one breadcrumb, so the breadcrumb is never emitted twice. Verified
after a clean rebuild by counting `application/ld+json` scripts in every exported `index.html`:

```bash
# 47 index.html files: 45 carry exactly 1 script, every one an @graph (0 arrays, 0 bare objects);
# 2 carry none — /404/ and /תודה/, both noindex
node scripts/audit/schema.mjs   # ✅ pagesWithJsonLd 45 · 0 failures · 0 warnings
```

### 4.7 — P2 · S · [✅ DONE 2026-11-08] Schema URLs use raw Hebrew; canonicals use percent-encoding

Until 2026-11-08 breadcrumb `item` URLs were encoded but `Service.url` on all 7 service pages and
`BlogPosting.mainEntityOfPage` on all 11 posts were raw — `schema.mjs` → `rawHebrewUrls: 18`.

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.4), with N2. Every `url`,
`@id` and `mainEntityOfPage` goes through `pageUrl()` in `lib/jsonld.ts` (trailing slash +
`encodeURI`), the same form as the canonical. Verified after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ rawHebrewUrls 0
```

### 4.8 — P2 · S · [✅ DONE 2026-11-08] `areaServed` is a marketing phrase typed as `AdministrativeArea`

Until 2026-11-08 `{"@type":"AdministrativeArea","name":"מרכז הארץ ופריסה ארצית"}` sat on 8 nodes
(`schema.mjs` warned) — not an area name.

**Closed 2026-11-08** by commits `02a3144` (the phrase dropped from every node) and `d8edb28`
(Sprint 2 change set B, row 2.5). The business node's `areaServed` is the 18 published locations as
`placeNode()` entries — `City` ×14 and `AdministrativeArea` ×4 for קריות, שרון, צפון and דרום — so
it can never drift from the location pages. The manifest phrase itself is untouched and still
owner-gated (§5.4, business-facts §E, Track B B5) and still ships in the client JS bundle; only the
graph stopped repeating it. Verified
after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ 0 warnings — the phrase-areaServed warning is gone
# out/index.html #business areaServed: 18 nodes · City 14 · AdministrativeArea 4
# grep -c 'פריסה ארצית' inside the JSON-LD of all 45 pages → 0
```

### 4.9 — P2 · S · [✅ DONE 2026-11-08] No `WebSite` node

Until 2026-11-08 `schema.mjs` failed on `/`: Google had no declared site name for the SERP header.

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.3). `websiteJsonLd()` emits
`WebSite` `#website` on the homepage only, `publisher` → `#business`, `inLanguage` from the
manifest; no other page references `#website`, so nothing dangles. Verified after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ typeCensus home: WebSite 1 · FAQPage 1 · GeneralContractor 1
```

### 4.10 — P2 · M · [⏳ BLOCKED · owner — `Offer` half · ✅ DONE 2026-11-08 — catalog half] `/מחירון/` published 9 price ranges and emits no `Offer`

**Blocked, not merely unimplemented.** Until Sprint 4 eight of the nine ranges were authored
estimates. Marking an invented number as a structured `Offer` makes a soft problem
machine-readable, and the owner has said real prices are **not coming** (business-facts §D).
`schema.mjs` treats `Offer` as forbidden until sourced. The N14 pivot (`af8ba4c`, 2026-11-08)
removed the eight authored ranges, so the page now carries one number — the 150–350 ₪ visit band
(`priceRows`, `visitFeeRange`), itself 🔶 as to whether it is current — and the `Offer` half stays
⏳ on that row, not on a price list.

**The unblocked half closed 2026-11-08** by commit `d8edb28` (Sprint 2 change set B, row 2.9): the
business node carries `hasOfferCatalog`, an `OfferCatalog` whose 7 `itemListElement` entries are
`Service` nodes with an encoded `@id` (`{service url}#service`), `name` and `url` — **no `Offer`,
no price**. `/מחירון/` itself is a plain `WebPage`. Verified after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ 0 forbidden findings · danglingIds 0
# out/index.html #business hasOfferCatalog: OfferCatalog · 7 Service entries · "Offer" in any exported page → 0
```

### 4.11 — P2 · S · [✅ HOLDS] The `LocalBusiness` node has no `address`

This is **correct for the business model** — a service-area business with no premises — and an address
must never be invented. But it does mean the Rich Results Test flags a hard error and the page is
ineligible for the local-business rich result. Record the trade-off; don't "fix" it with a fake address.

### 4.12 — P3 · S · [✅ DONE 2026-11-08] `BlogPosting` polish

Until 2026-11-08: `dateModified` was hardcoded to `post.date`, ignoring the `updated` field the data
model declares · no `@id` or `isPartOf` link to a `Blog` entity · the business node's `url` omitted
the trailing slash the export enforces (`schema.mjs` warned ×12). `author` stays the
`Organization` with no visible byline — a `Person` is **not** coming (business-facts §B).

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.7). `articleJsonLd()` takes
`dateModified` from `post.updated ?? post.date` (as `app/sitemap.ts` already did), gives the post
`@id` `{pageUrl}#article` and `isPartOf` a full `Blog` node for `/blog/`, and the business `url`
carries the trailing slash. No post had an `updated` value then, so `dateModified` equalled
`datePublished` on all 11; since `9195c9b` (2026-11-09) 8 posts carry one and their
`dateModified` follows it (§6.4). Verified after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ 0 warnings · post: BlogPosting 11 · Blog 11
# a built post: @id …/#article · url and mainEntityOfPage percent-encoded with the slash
#               isPartOf {Blog, …/blog/} · author and publisher → #business · business url https://dangates.co.il/
```

### 4.13 — P3 · M · [✅ DONE 2026-11-09] `FAQPage` existed on 1 of 45 pages

Until Sprint 5 `schema.mjs` → `faqPages: 1`. Since Google's August 2023 restriction it produces no
rich result for a site of this type — treat it as machine-readable context (AEO), not as a
rich-result play. One Q/A per `FAQPage` sitewide (`content-hub` rule); `schema.mjs` checks that every
marked-up question is visible in `<main>` and that no question is marked up twice.

**The homepage half closed 2026-11-08** by commit `af8ba4c` (Sprint 4 row 4.3, with §3.5): the one
`FAQPage` now carries ten real answers built from the same `faqs` the page renders, `moreAt` kept
out of the markup.

**The service half closed 2026-11-09** by commit `225ff45` (Sprint 5 row 5.3). Each service page
renders its own `ServiceDepth.faqs` through `Faq` (a `<details>` group named `service-faq` under the
heading "שאלות נפוצות על …") and hands `faqJsonLd` the same `{ q, a }` list, so the markup is the
visible copy. `lib/service-depth.ts` throws at module load if a service question repeats a homepage
question or another service's. Verified on the current `out/`:

```bash
node scripts/audit/schema.mjs   # ✅ 0 failures · faqPages 8 (/ + the 7 services) · danglingIds 0 · rawHebrewUrls 0
# measured on the export's FAQPage nodes: 34 service questions (4 on שערי-כנף, 5 on each of the others),
# 44 questions sitewide, 0 marked up twice; every accepted answer's text is in <main>;
# <details> per service page = its question count
```

**The 18 location pages joined 2026-11-09** with commit `7c3f2db` (Sprint 6 row 6.1): each renders
its three `cityContent.faqs` the same way, and `lib/city-content.ts` throws if a city question
repeats one used on `/`, a service page or another city. `schema.mjs` → 0 failures, **`faqPages 26`**
(`/` + 7 services + 18 locations); 98 questions sitewide (54 on location pages), 0 marked up twice.

---

## §5. Local SEO

Doctrine: `local-seo-il` skill. Script: `content-depth.mjs` (doorway delta).

### 5.1 — P1 · S · [⏳ BLOCKED · owner] No Google Business Profile link anywhere

`schema.sameAs` is `[]`; `siteConfig.social` is three empty strings. The top local lever. The profile
is **coming** (business-facts §A ⏳); the restore path is [gbp-runbook.md](gbp-runbook.md).

### 5.2 — P1 · M · [✅ DONE 2026-11-09] Four regions render wrong Hebrew in shipped titles, descriptions and H1s

Until Sprint 6 `locations` had only `slug` and `name`, so templates interpolated a bare `ב${name}`:
`out/locations/שרון/index.html` shipped **בשרון** where **באזור השרון** is correct; צפון shipped
**בצפון** where **בצפון הארץ** is correct — a copy defect on four pages, in three places each.

**Closed 2026-11-09** by commit `7c3f2db` (Sprint 6 row 6.2). Every entry carries `kind`
(`"city"` ×14, `"region"` ×4) and `prefixed` (`בקריות`, `באזור השרון`, `בצפון הארץ`, `בדרום הארץ`);
the shared title, H1, description and intro builders in `lib/content.ts` take `prefixed`, the
service and location link labels too, and `locationServiceJsonLd` types `areaServed` from `kind`
(the interim region-slug set is gone). Verified on the current `out/`:

```bash
# <title> and <h1> per region page: "תיקון שערים חשמליים באזור השרון" · "… בצפון הארץ" ·
#   "… בדרום הארץ" · "… בקריות"; bare בשרון / בצפון / בדרום in <head>: 0 on all three
node scripts/audit/schema.mjs   # ✅ 0 failures · 0 warnings · danglingIds 0 · rawHebrewUrls 0
# the location Service node's areaServed: AdministrativeArea on קריות, שרון, צפון, דרום; City on the 14 cities
```

The body copy uses `בצפון` / `בדרום` as ordinary prose ("בצפון יש הרבה מושבים") on its own pages —
correct Hebrew there, not the templated defect.

### 5.3 — P1 · L · [PARTIAL 2026-11-09 · 13 of 18 done · ⏳ BLOCKED · owner 3.6 for five] Doorway risk on all 18 location pages

See §3.1. **No 19th location until the existing 18 pass.** 7 × 18 = 126 cells; do not build them.

**The measured doorway proxy passes on all 18 since 2026-11-09** (commit `7c3f2db`):
`content-depth.mjs` → location `belowFloor 0`, `locationMedianDelta 343.5`, every page 288–428
tokens ahead of its nearest sibling. **Done for the 13 confirmed cities; ⏳ BLOCKED · owner
(owner-actions 3.6) for קריות, שרון, צפון, דרום and באר שבע**, which ship as bounded pages with no
coverage claim until the owner says whether they are served (§3.1). The human half of the test —
local-seo-strategist sign-off — is not on record, so the expansion cap stands.

### 5.4 — P2 · S · [⏳ BLOCKED · owner] Coverage and availability claims are unbounded

The manifest `schema.areaServed` still reads `מרכז הארץ ופריסה ארצית` while locations span קריות to
באר שבע, and whether 24/7 emergency service exists is unanswered (business-facts §E,
owner-actions 3.5–3.6). Until Sprint 4 both were claimed sitewide (`claims-grep.mjs`:
`around-the-clock` on 42 pages, `national-coverage` on 4, as of 2026-08-23). **The copy half is
done:** the JSON-LD has emitted the 18 published locations instead of the phrase since `02a3144`
(§4.8), and `1796ee7` (Sprint 4.1) took both out of the copy — `claims-grep.mjs` →
`around-the-clock 0`, `national-coverage 0` live as of 2026-11-09; the footer and `/צור-קשר/` read
`serviceAreaLine` ("מרכז הארץ והאזורים שמופיעים באתר"). The roster `shortPitch` stopped
claiming national coverage, 24/7, speed and a full warranty in `ad2f1ab` (2026-11-09). What stays
blocked is the roster `areaServed` value and the owner's answer (B5, owner-actions 3.6): no page or
JSON-LD node renders the phrase, but `site.config.json` is bundled whole into the client JS, so it
still ships once in `out/_next/static/`:

```bash
grep -rl 'פריסה ארצית' out/_next/static | wc -l    # 1 — areaServed:"מרכז הארץ ופריסה ארצית"
grep -rl 'אחריות מלאה\|24/7' out/_next/static | wc -l  # 0 since ad2f1ab
```

### 5.5 — P2 · S · [PARTIAL 2026-11-09 · copy half done for 13 · ⏳ BLOCKED · owner for five and the map] No geo signals

Until Sprint 6: no `GeoCoordinates`, no `hasMap`, no map embed, no neighbourhood or landmark
reference in any copy.

**The copy half closed 2026-11-09 for the 13 confirmed cities** by commit `7c3f2db` (Sprint 6 row
6.4): each `cityContent` entry names its neighbourhoods, industrial zones or — for a region — towns
(`neighborhoods`, rendered as a list under its own heading), and the local notes name the terrain
and climate they sit in. Verified on the current `out/`: all 18 location pages render the list and
three city FAQs (`<details>` ×3 each; 54 location questions, 98 sitewide, 0 marked up twice —
`schema.mjs` → 0 failures, `faqPages 26`).

**⏳ BLOCKED · owner (owner-actions 3.6) for the five 🔶 entries** (קריות, שרון, צפון, דרום, באר
שבע): their place names are geography, not a service area, until the owner confirms coverage. **⏳
BLOCKED · owner (§5.1, B3) for the map half:** `hasMap` and any map embed wait on the GBP URL; no
`GeoCoordinates` around an invented midpoint, ever.

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

### 6.2 — P1 · M · [PARTIAL 2026-11-09 · `/`, `/מחירון/`, the 7 services, the 18 locations, the indexes and `/אודות/` done] No page opens with an extractable answer block

`content-depth.mjs` (as of 2026-08-23): 0 of 36 service, location and post pages open with a
40–60-word paragraph — services open with 3–4 words, locations with 16–17, posts with 1. Spec:
content-standards §5. Closed by Phases 3–4 page by page.

**`/` and `/מחירון/` closed 2026-11-08** by commit `af8ba4c` (Sprint 4 rows 4.2 and 4.4): the first
`<p>` after the H1 is `homeAnswerBlock` on the homepage and `pricingPageCopy.answer` on the pricing
page. Measured with the audit's own `tokens()` on that paragraph (the proxy itself covers only
service, location, post and guide pages): `/` 46 words, `/מחירון/` 45 words. Commit `9195c9b`
(4F, 2026-11-09) made `homeAnswerBlock` self-contained (the areas list and the WhatsApp button named
outright): `/` 52 words, `/מחירון/` still 45, both inside 40–60.

**The 7 service pages closed 2026-11-09** by commit `225ff45` (Sprint 5 row 5.2): once a depth
entry's `answer` is written, `PageHeader` drops the tagline and the first `<p>` after the H1 is that
answer, under its question-form `answerHeading`. Verified on the current `out/`:

```bash
node scripts/audit/content-depth.mjs   # the answer-block warning lists location 18/18 and post 11/11 — no service row
# first <p> after the H1, by the audit's tokens(): שער-זרוע 56 · שערי-כנף 52 · שערים-לדירה 52
#   שערים-לחניה 55 · שערים-מתרוממים 49 · שערים-נגררים 49 · תריסי-גלילה-חשמליים 56
```

**The 18 location pages closed 2026-11-09** by commit `7c3f2db` (Sprint 6 row 6.1): once a
`cityContent` entry's `answer` is written, the `PageHeader` subtitle and the shared intro step aside
and the answer is the first `<p>` after the H1, under its `answerHeading`. The index pages and
`/אודות/` gained one too (row 6.8). Verified on the current `out/`:

```bash
node scripts/audit/content-depth.mjs   # the answer-block warning lists post 11/11 only — no location row
# first <p> after the H1, by the audit's tokens(): the 18 locations 44–57 words;
#   /שירותים/ 56 · /איזורי-שירות/ 45 · /אודות/ 51
```

**Still open:** the proxy warns on post 11/11 (1 word — the date, Sprint 7.6), as of 2026-11-09.

### 6.3 — P1 · L · [NOT STARTED] Nothing on the site is worth citing over a competitor

No fault-to-cost map, no repair-vs-replace comparison, no gate-type selection matrix, no motor lifespan
data, no DIY/licensed boundary. The blog circles all five and answers none with a number or a table.
**Fix (Phase 4):** the `/מדריכים/` hub ([ADR 0002](decisions/0002-guides-hub-route.md)), first eight
guides in [content-calendar.md](content-calendar.md) §2, each gated by `article-auditor`.

### 6.4 — P2 · S · [PARTIAL 2026-11-09 · 8 of 11 posts] No freshness signal on the blog

Until 2026-11-09 the `updated` field was wired into the sitemap and `BlogPosting.dateModified` but
set on **0 of 11 posts**, so both pinned to the 2025 publish date — though Sprint 4 had edited
several bodies.

**The edited half closed 2026-11-09** by commit `9195c9b` (Sprint 4 change set 4F, row 4.9): each
post Sprint 4 or 4F actually edited carries an honest `updated` — `2026-11-08` on six, `2026-11-09` on
`שער-חשמלי-חוסך-זמן` and `שער-חשמלי-שעובד-כמו-חדש` (4F edited both). The three untouched posts keep
their publish date. Verified on the current `out/`:

```bash
grep -c '^    updated:' lib/posts.ts                                  # 8
grep -o '"dateModified":"[^"]*"' out/blog/שער-חשמלי-חוסך-זמן/index.html   # 2026-11-09
grep -o '"dateModified":"[^"]*"' out/blog/תקלות-נפוצות-בשערים-חשמליים/index.html   # 2025-09-30 (untouched)
```

**Still open:** the page shows only the publish date (the post `PageHeader` subtitle formats
`post.date`), and the three untouched posts get `updated` only with a real edit — Sprint 7.3. Two
posts still share a publish date.

### 6.5 — P2 · S · [NOT STARTED] No `llms.txt`

`edge.mjs` warns. Template ready in `aeo-answer-content/templates/llms.txt`; only useful once §6.1
opens.

---

## §7. E-E-A-T & trust

Skill: `eeat-build` (authority without a named person). Script: `claims-grep.mjs`
(`scripts/audit/claims.json` lexicon → business-facts row; a live 🔶/⛔ claim fails) · `schema.mjs`.

### 7.1 — P0 · M · [✅ DONE] Fabricated reviews — the widest problem the site had

Removed 2026-08-17. the comment above `reviews` in `lib/content.ts` records what was wrong (ten review texts authored and
attributed to ten real named reviewers, invented cities, a hardcoded 5-star display, a hand-set
`"5.0"`, and `AggregateRating` + ten `Review` nodes with an empty `sameAs`). Today
`lib/content.ts` exports `reviews = []` and `REVIEW_SOURCE_URL = null`, and
`components/marketing/Reviews.tsx` returns `null` unless reviews **and** a source URL exist —
the guard is the rule made mechanical. Restore path: business-facts §A, verbatim only.

### 7.2 — P1 · M · [✅ DONE 2026-11-08] Four load-bearing claims appeared on nearly every page with nothing behind them

`claims-grep.mjs` as of 2026-08-23: `warranty-full` ("אחריות מלאה") live on 41 pages ·
`around-the-clock` on 42 · `experience` ("ניסיון רב שנים", against `foundedYear: null`) on 3 ·
`national-coverage` on 4 · two `superlative` hits in `lib/posts.ts` (never permitted). The owner
has said the warranty term, licence, insurance and founding year are **not coming** (business-facts
§B, §D), so the fix was to soften, not to wait. **Owner, 2026-10-12:** the blog posts' flagged
claims were OK for now, to be fixed later — they were fixed in this item.

**Closed 2026-11-08** by commit `1796ee7` (Sprint 4 change set A, row 4.1), after N13 had moved the
copy into `lib/content.ts`: "אחריות מלאה" → "אחריות על העבודה" with no term or scope; years of
experience → what a repair involves; "24/7" → the published hours plus an urgent-fault line bounded
to them; "פריסה ארצית" → `serviceAreaLine` and the 18 published areas; the speed and team claims
out of `lib/content.ts`. In `lib/posts.ts`: the two superlatives, the experience line, and the three
team / guarantee sentences the eeat-trust-auditor review named (`הצוות המומחה`, `צוות דן שערים`,
"…לפתור את הבעיה במהירות"). No sentence the live registers quote was touched. Verified on the
current `out/`:

```bash
node scripts/audit/claims-grep.mjs
# ✅ pass · failingClaims 0 · totalHits 1 (the gated rating row in Reviews.tsx, 0 live)
# liveOccurrences: all 13 claims 0 — warranty-full 0 · around-the-clock 0 · experience 0
#                  national-coverage 0 · superlative 0 (77 · 75 · 9 · 7 · 2 on 2026-08-24)
grep -rlE 'פריסה ארצית|24/7|אחריות מלאה|ניסיון רב' out --include=*.html | wc -l   # 0
grep -rl 'הצוות המומחה\|צוות דן שערים' out --include=index.html | wc -l          # 0
```

**Follow-up closed 2026-11-09** by commits `ad2f1ab` (roster sync) and `9195c9b` (Sprint 4 change
set 4F, row 4.9). The roster `shortPitch` — bundled into the client JS with the rest of
`site.config.json`, though no page rendered it — no longer says "שירות מהיר ואמין, אחריות מלאה
וזמינות 24/7 לחירום, בפריסה ארצית". 4F removed the absolute workmanship promise the change set B
re-review found on `/` ("ושום חלק לא מוחלף…", `homeDiagnosisCopy.intro`), the `aboutValues` /
`aboutSections` lines ("מצוינות", "ללא פשרות", "עד שהשער עובד"), "ציוד מתקדם", the swing-gate
"מייצרים", the final CTA's "עוד היום", the form success state's "בהקדם" / "מענה מיידי", and two
of the three post speed phrases; the lexicon gained `workmanship-absolute`
(`ללא פשרות|בלי פשרות|מצוינות בכל|למצוינות`). Verified on the current `out/`:

```bash
node scripts/audit/claims-grep.mjs
# ✅ pass · claimsChecked 14 · failingClaims 0 · totalHits 1 · every liveOccurrences 0
#    (workmanship-absolute 0 live; its 1 source hit is an explanatory comment, skipped by design)
grep -rl 'אחריות מלאה\|24/7' out/_next/static | wc -l                       # 0
grep -rl --include=index.html 'בהקדם\|מענה מיידי\|מייצרים' out | wc -l       # 0
```

**Left, and why it is not this row:** one unclocked speed phrase, "שירות מהיר ואמין" in the
`שער-חשמלי-לא-מגיב` checklist — permitted by eeat-and-trust §1.4, it goes with the post rewrites
(Sprint 7.3); the manifest `areaServed` phrase in the client bundle (§5.4, B5). The lexicon still
has no pattern for team claims or for absolute promises outside `workmanship-absolute`'s four
phrases — `claims-verifier` reads for them.

### 7.3 — P1 · M · [✅ DONE 2026-11-08 · resolved by the N14 pivot] Eight of nine published prices were authored estimates

Until Sprint 4 they were published on `/מחירון/` as a price list a customer would quote back. Real
prices are **not coming** (business-facts §D), so the item was resolved by pivoting the page to what
drives the price ([keyword-map.md](keyword-map.md) §10) rather than by waiting — N14, commit
`af8ba4c`. `priceRows` now holds only the technician-visit row, marked 🔶 (is the band current?).
Verification is N14's.

### 7.4 — P2 · M · [✅ DONE 2026-11-08 · registry + AboutPage] No person entity anywhere

No author byline, no founder, no team, no credentials. `BlogPosting` attributes all 11 articles to the
`Organization`. A named person is **not coming** (business-facts §B) — so `eeat-build` builds the
`AboutPage` + `knowsAbout` + `logo`/`image` path without one, and `lib/authors.ts` stays an empty
registry with the data-only path for when a name arrives. `schema.mjs` forbids a `Person` author
while that registry is empty.

**The repo half closed 2026-11-08** by commit `d8edb28` (Sprint 2 change set B, row 2.10), with the
`logo`/`image` from `02a3144` (§4.5). `lib/authors.ts` exports the `Author` type and
`authors: readonly Author[] = []`; `/אודות/` emits an `AboutPage` with `about` → `#business`, and the
business node on that page carries `knowsAbout` — the 7 service names plus תיקון שערים חשמליים,
מנועי שערים and בטיחות שערים חשמליים, nothing the site does not cover. What stays absent on purpose:
the person. One registry entry with permission opens the gate (Sprint 9.5). Verified after a clean
rebuild:

```bash
node scripts/audit/schema.mjs
# ✅ about: AboutPage 1 · GeneralContractor 1
# info: lib/authors.ts absent or empty — Organization author tolerated, a Person author is forbidden
# '"Person"' in any exported page → 0
```

`/אודות/` is still under its 500-word floor (`content-depth.mjs`, §3.13) — the schema is in, the
copy is Sprint 6.8.

### 7.5 — P1 · L · [NOT STARTED] The site has no photographs at all

`perf.mjs` / `a11y.mjs` → `images: 0` across 46 pages (2026-11-08). The logo renders as text in the
header; `public/dangates-logo.png` reaches only the JSON-LD `logo` since `02a3144` (§4.5), never the
page. Photos are **coming**
(business-facts §F ⏳); the pipeline is the `site-images` skill. Cloudflare Image Transformations are
enabled on this zone, so `SiteImage` works the day they land.

### 7.6 — P2 · S · [✅ DONE 2026-11-08] The footer contradicted the CTA in a single viewport

Until Sprint 4 the footer hours ended at 18:00 and omitted the emergency line, directly beneath a
full-width CTA promising 24/7 availability — visible together on all `FinalCta` pages.

**Closed 2026-11-08** by commit `1796ee7` (Sprint 4 change set A, row 4.6). The hours have one
source: `siteConfig.hours.weekday` and `.friday` are built by `hoursLine()` from the manifest
`schema.openingHours` — the same rows behind `openingHoursSpecification` — and
`siteConfig.hours.emergency` is gone (its line is `contactPageCopy.emergencyLine`, which promises
nothing outside the hours). The footer and `/צור-קשר/` print the two lines; the trust bar label, the
`FinalCta` body and the homepage contact and urgent-fault answers interpolate them. Owner-actions
3.5 is unanswered, so no CTA promises 24/7. Verified on the current `out/`:

```bash
# out/index.html openingHoursSpecification: Sunday–Thursday 08:00–18:00 · Friday 08:00–15:00 (two rows, no 24/7)
grep -rl '24/7' out --include=index.html | wc -l   # 0
node scripts/audit/claims-grep.mjs                 # around-the-clock 0 live · response-time 0 live
```

No script reads `openingHoursSpecification` against the visible lines (eeat-and-trust §9); the
parity is held by the single source, not measured.

---

## §8. Conversion

Skills: `conversion-cro`, `engagement-ux`. Script: `cta-coverage.mjs` · `a11y.mjs` (form checks).
Reviewer: `cro-engagement-auditor`.

### 8.1 — P1 · M · [✅ DONE 2026-11-08] Lead form validation and a11y

Until 2026-11-08 `LeadForm` set `noValidate` with a single generic string: no per-field state, no
`aria-invalid`, no `aria-describedby`, no focus management, and **no phone-format validation** — a
`type="tel"` field with no pattern. Israeli formats must include landlines (this business's own
number is `072-`). `a11y.mjs` failed on this.

**Closed 2026-11-08** by commit `68a4a7f` (Sprint 3 change set C, row 3.5). Each invalid field
carries `aria-invalid` and `aria-describedby` to its own `lf-<field>-error` message; the wiring
renders before focus moves to the first invalid field. `lib/phone.ts` is the one source for the
`pattern` attribute and the JS check (`ISRAELI_PHONE_PATTERN`, `isIsraeliPhone()`): mobiles, 07X
lines like this business's own `072-`, 02/03/04/08/09 landlines, with or without `+972`.
`noValidate` stays so the messages are Hebrew. Verified after a clean rebuild:

```bash
node scripts/audit/a11y.mjs   # ✅ 0 failures · 0 warnings · unlabeledControls 0 — the noValidate/aria-invalid
                              #    failure and the "tel input has no pattern" warning are both gone
```

### 8.2 — P1 · S · [PARTIAL 2026-11-08] No consent affordance

The form collects PII while `/מדיניות-פרטיות/` exists and is never referenced from it. The privacy
policy also never mentions cookies or analytics while GTM loads unconditionally.

**Owner, 2026-10-12 (fleet wording sign-off page):** when the privacy page is rewritten it should
also mention the live surfaces' status-file read (`https://imgquarry.com/status/fleet.json`) and
the values they keep in browser storage (`ls-status`, `ls-dlg-*`, `ls-pv`, `ls-t`) — CLAUDE.md
§14, business-facts §I. Open.

**State 2026-11-08** (commit `68a4a7f`, Sprint 3 change set C, row 3.6): the consent line
(`leadFormConsentCopy`, beside the submit button, linking `/מדיניות-פרטיות/`) and the rewritten
privacy page (`privacyPageCopy`) are in the tree. The built privacy page names Web3Forms, Google Tag
Manager, the fields collected, the status-file read (`imgquarry.com`) and the four storage values
(`ls-status`, `ls-dlg-*`, `ls-pv`, `ls-t`) — the owner's 2026-10-12 request above is met. The first
`hebrew-editor` / `claims-verifier` pass is applied, and both signed off on the 3C re-review, their
last two should-fix sentences closed in `fba5957` (recorded in `ed24755`) — the row stays PARTIAL
only on B2 and B10. Left out as unconfirmed owner policies, to restore only with a confirmed row in
business-facts: the name Google Analytics (the open "GA4 measurement ID" row, Track B B2), that the
details are never sold, that they are used "only" to call back and never for mailing, and access /
correction / deletion on request. Whether a consent UI is needed at all is B10.

### 8.3 — P1 · M · [✅ DONE 2026-11-08] No thank-you URL

Until 2026-11-08 success was an inline state swap — no URL-based conversion to count, no Google Ads
target, no next step, and the success screen told the user to call with no clickable number.

**Closed 2026-11-08** by commit `68a4a7f` (Sprint 3 change set C, row 3.8). `app/תודה/` is
registered in `staticPages` with `noindex`, kept out of the sitemap, listed `calm` for the live
surfaces, and carries a `tel:` link and the `thanks-call` / `thanks-whatsapp` CTAs. After a
confirmed send the form pushes `lead_submit`, then navigates there; the inline success block stays
as the fallback if navigation is blocked. Verified after a clean rebuild:

```bash
node scripts/audit/links.mjs   # ✅ staticRoutesRegistered 10 · contentPages 46 · sitemapUrls 45 · orphans 0
# out/תודה/index.html: robots "noindex, nofollow" · 1 tel: link · data-cta thanks-call, thanks-whatsapp
# grep -c תודה out/sitemap.xml → 0
```

**Audit exemption — owner sign-off pending (2026-11-08):** `/תודה/` is exempt from the orphan,
sitemap-presence, breadcrumb, schema-type and canonical-presence checks by the exact-path list
`NOINDEX_ALLOWED` in `scripts/audit/lib/pages.mjs` (not by any robots noindex), and `titles.mjs`
requires it to carry no canonical and no og:url. Title and description checks still run on it. Any
other page with a stray noindex still gets every check. Because this loosens scripts, the owner
should confirm the list.

### 8.4 — P2 · S · [✅ DONE 2026-11-08] The `city` field is declared and never collected

Until 2026-11-08 `city?` was declared only in `types/index.d.ts`, a file nothing imported (N3) —
free local-intent signal, dispatch-relevant across 18 areas, never collected.

**Closed 2026-11-08** by commit `68a4a7f` (Sprint 3 change set C, row 3.7), with N3. The form
carries an optional `<select id="lf-city" name="city">` built from `locations` (slug values, plus
`אחר` → `"other"`); the value goes into the Web3Forms body and onto `lead_submit` as `city`.
Verified after a clean rebuild:

```bash
grep -c 'lf-city' out/צור-קשר/index.html   # ≥ 1 — the select renders in the export
ls types                                  # No such file or directory (N3)
```

### 8.5 — P2 · S · [✅ DONE 2026-11-08] `/מחירון/` is the only commercial page with no CTA

Until 2026-11-08 `cta-coverage.mjs` warned that `/מחירון/` had no call/WhatsApp/form CTA inside
`<main>` — the highest-purchase-intent page on the site, and one of the four without `FinalCta`.

**Closed 2026-11-08** by commit `68a4a7f` (Sprint 3 change set C, row 3.10). `PricingTeaser` renders
a call and a WhatsApp button beside the contact link. Verified after a clean rebuild:

```bash
node scripts/audit/cta-coverage.mjs   # ✅ 0 warnings · ctaElements 119 · withDataCta 119 · missingDataCta 0
# <main> of out/מחירון/index.html: 1 tel: · 1 WhatsApp · data-cta pricing-call, pricing-whatsapp, pricing-contact
```

### 8.6 — P2 · M · [PARTIAL 2026-11-08 · measurement half owner-blocked (B2)] Lead-delivery failure is silent

Until 2026-09-06 a failed POST set `status` to `"error"` and opened a WhatsApp window that a popup
blocker could swallow with no notice to the user. N1 is the UI half of this item.

**The UI half landed 2026-09-06** by commit `fee7f69` (Sprint 1 change set D, row 1.12) — see N1 for
the detail. The user sees a `role="alert"` block with a real WhatsApp `<a>`, a `tel:` link and a
retry button. Since `68a4a7f` (2026-11-08, row 3.12) no `window.open` is left at all, so the
`popup_blocked` reason is retired.

**Still open — the measurement half, none of it in this repo:**

- **No tag or trigger consumes `lead_error`.** The event is pushed from the three failure paths in
  `LeadForm.tsx` (no-key misconfig, fetch `catch`, non-ok response) with `placement` and `site`, and
  lands in `dataLayer` where nothing reads it. The GTM container work is manual, in `GTM-KWGGH438`
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

`Header.tsx` renders `navItems` only; `links.mjs` → chrome = 28 hrefs until 2026-11-09, **34**
since the footer lists all 18 locations (§9.2, `7c3f2db`) — the six added links are all footer
links; the header is unchanged. Posts are reachable only via indexes and related links. Still
open — Sprint 6.5.

### 9.2 — P1 · S · [✅ DONE 2026-11-09] Six location pages are missing from the chrome

Until Sprint 6 `components/layout/Footer.tsx` rendered `locations.slice(0, 12)`. `links.mjs` →
`notInChrome: 6` (אשקלון, באר שבע, דרום, צפון, קריות, שרון); they were not strict orphans only
because `/איזורי-שירות/` lists all 18.

**Closed 2026-11-09** by commit `7c3f2db` (Sprint 6 row 6.6): the footer renders `locations.map`,
all 18. Verified on the current `out/`:

```bash
node scripts/audit/links.mjs   # ✅ notInChrome 0 · chromeLinks 34 (28 + the six) · orphans 0 · brokenLinks 0
# "types reached only via indexes/related links": post, thanks — location is no longer listed
```

### 9.3 — P1 · M · [✅ DONE 2026-11-09] The service ↔ location mesh is one-way

Until Sprint 5 no service page linked to any city, and until Sprint 6 no location linked to another. **The service →
city half shipped 2026-11-09** in commit `225ff45` (Sprint 5): each service page links the 5–6
cities its `ServiceDepth.locations` declares, under "מחפשים שירות בעיר שלכם?". Measured on the
current `out/` (`<main>` links): 13 distinct location pages reached from the 7 service pages, each
from at least 2. The five unconfirmed region / far entries (קריות, שרון, צפון, דרום, באר שבע —
business-facts §E) are left out by design.

**The location side closed 2026-11-09** by commit `7c3f2db` (Sprint 6 row 6.7). `lib/nearby.ts`
holds one list of unordered pairs (`nearbyPairs`, 22 pairs) that `nearby(slug)` reads in both
directions, so a one-way edge cannot be written; module-load throws reject a self-pair and a pair
listed twice. Each location page links its neighbours, and its service list is `cityContent.services`
plus every service whose `ServiceDepth.locations` names the city — the reverse direction of the
Sprint 5 half. Measured on the current `out/` (`<main>` links):

```bash
node scripts/audit/links.mjs   # ✅ orphans 0 · notInChrome 0 · brokenLinks 0
# location → location: 18 of 18 pages link 2–4 neighbours; every location receives 2–4 such links
# location → service: 18 of 18 pages link 4–7 service pages
```

The header half of §9 is §9.1, not this row.

### 9.4 — P2 · S · [PARTIAL 2026-11-09 · service half done] Related items are selected by array order

Until Sprint 5 the `others` lists in `app/services/[service]/page.tsx` and `app/blog/[slug]/page.tsx`
both took `.slice(0, 4)`, and `links.mjs` warned that 2 of 7 service pages and 6 of 11 posts
received no related link at all.

**The service half closed 2026-11-09** by commit `225ff45` (Sprint 5 row 5.4): the service route
renders `ServiceDepth.relatedServices` (2–4 per page, never the page itself — a module-load throw)
and `relatedPosts` (0–3; the shutters page declares none because no post covers a shutter), in
declared order. Verified on the current `out/`:

```bash
node scripts/audit/links.mjs   # relatedServiceTargets 7 — every service page receives a related link;
                               # no service-page monotony warning · orphans 0 · brokenLinks 0
# related posts from the 7 service pages, measured on <main>: 9 of the 11 posts reached
```

**Still open:** the post route's `others` list is still `posts.filter(…).slice(0, 4)`; `links.mjs`
still warns "post pages: the first 4 related links on every page come from the same 5 array-leading
siblings; 6 of 11 post pages receive no related link" (`relatedPostTargets 5`). Not owner-blocked;
carried to Sprint 7.3, which rewrites the post route.

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

### 10.2 — P2 · M · [✅ DONE 2026-11-08] JS budget

Until 2026-11-08 `perf.mjs` counted 4 `"use client"` components: `Header` was client for one boolean,
and `Faq` hydrated an accordion `<details>/<summary>` could do with zero JS (N8).

**Closed 2026-11-08** by commits `7cfcf4c` (Sprint 3 change set A, row 3.11 — `Faq` is a server
component on native `<details>`) and `60ce109` (change set B, row 3.3 — `Header` is a server shell
again; the menu is the `MobileMenu` client leaf). **`clientComponents` is 3: `LeadForm`,
`MobileMenu`, `Reveal`.** Total JS did not shrink — `LeadForm` grew with the §8.1 validation and the
§13.4/§13.5 events, so the shipped bytes moved from 746,950 (2026-09-06) to 756,903; the win is the
hydration count, not the byte total. Verified after a clean rebuild:

```bash
node scripts/audit/perf.mjs       # ✅ clientComponents 3 · jsFiles 30 · jsTotalBytes 756903 · largestJsBytes 172834
node scripts/audit/rtl-lint.mjs   # ✅ clientComponentFiles LeadForm.tsx, MobileMenu.tsx, Reveal.tsx
```

Sprint 8.1's engagement-events leaf, when it lands, is the fourth and must be added to the ledger in
the same change.

### 10.3 — P2 · S · [✅ DONE 2026-09-06] `framer-motion` was a dependency imported nowhere

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

The site **publishes a conformance statement** at `/הצהרת-נגישות/`, so each failure below also made a
published claim false. As of 2026-11-08 every row here is ✅ and both scripts read 0, so the
statement's WCAG reference was corrected from 2.0 to 2.1 AA the same day; its other wording is
unchanged. The scripts are mechanical — no manual keyboard or screen-reader pass has been recorded.
Skill: `responsive-accessibility`. Scripts: `a11y.mjs` · `rtl-lint.mjs`.

### 11.1 — P1 · S · [✅ DONE 2026-11-08] Two contrast failures, both on conversion paths

The base palette was always fine (white on `#B6070C` = 6.94:1; `accent-foreground` on gold =
9.70:1). Until 2026-11-08 the failures were in **interaction states and a hardcoded literal**: the
accent **hover** (`accent-foreground` on `accent-600`) at **2.76:1**, and white on the `#25D366`
WhatsApp surface at **1.98:1** in `Button` and `MobileCtaBar` — the primary phone conversion path.

**Closed 2026-11-08** by commit `7cfcf4c` (Sprint 3 change set A, row 3.1), with N11. The accent
hover is `accent-500`; the WhatsApp surface is a `@theme` token set (`--color-whatsapp`,
`--color-whatsapp-hover`, `--color-whatsapp-foreground`) used everywhere the green rendered.
Verified after a clean rebuild:

```bash
node scripts/audit/a11y.mjs   # ✅ 0 failures · contrastPairs: accent-foreground on accent-500 6.79
                              #    whatsapp-foreground on whatsapp 5.42 · on whatsapp-hover 6.63
                              #    whatsapp on white 5.42 · white on primary 6.94 · accent-foreground on accent 9.7
```

### 11.2 — P2 · S · [✅ DONE 2026-11-08] `Reveal` interposed between `<ol>` and its `<li>`s

Until 2026-11-08 `Process` rendered `<ol>` → `<Reveal>` (a `<div>`) → `<li>`, so the process steps
were not announced as a list; `a11y.mjs` failed on it.

**Closed 2026-11-08** by commit `7cfcf4c` (Sprint 3 change set A, row 3.2): each `<li>` is the direct
child of the `<ol>` and wraps its own `Reveal`. Verified after a clean rebuild:

```bash
node scripts/audit/a11y.mjs   # ✅ 0 failures — the interposed-wrapper failure is gone
```

### 11.3 — P2 · S · [✅ DONE 2026-11-08] Duplicated screen-reader text

Until 2026-11-08 `TrustBar` carried an `sr-only` `<dt>` repeating the visible label, so every stat
was announced twice.

**Closed 2026-11-08** by commit `7cfcf4c` (Sprint 3 change set A, row 3.2): one visible `<dt>` label,
one `<dd>` value, no `sr-only` copy. Verified after a clean rebuild:

```bash
node scripts/audit/a11y.mjs   # ✅ 0 warnings — the TrustBar sr-only warning is gone
```

### 11.4 — P2 · M · [✅ DONE 2026-11-08] Mobile menu has no focus management

Until 2026-11-08 the `Header` toggle set `aria-expanded` with no `aria-controls`, no focus trap, no
Escape handler and no scroll lock.

**Closed 2026-11-08** by commit `60ce109` (Sprint 3 change set B, row 3.3). `Header` is a server
shell; `MobileMenu` is the client leaf: panel `id="mobile-menu"` + `aria-controls` on the 44px
toggle, Escape closes and returns focus to the toggle, Tab and Shift+Tab cycle inside the open
panel, the page scroll is locked while open, and the open panel keeps the live-kit's
`data-live-block` so the seasonal card cannot cover it. This is the pattern the §9.1 dropdown
reuses (Sprint 6.5). Verified after a clean rebuild:

```bash
node scripts/audit/a11y.mjs   # ✅ 0 warnings — "mobile menu has no focus management" is gone
# out/index.html: id="mobile-menu" on the panel · aria-controls="mobile-menu" on the toggle
```

### 11.5 — P2 · S · [✅ DONE 2026-11-08] Three banned RTL utilities ship

Until 2026-11-08 `rtl-lint.mjs` counted `bannedUtilities: 3` (`text-right` in `LeadForm`, `Faq` and
`PricingTeaser` — correct in RTL, which is why they survived review) and **8 hex literals** (7 by
2026-09-06) in `Button`, `MobileCtaBar`, `LeadForm`, `Hero` and `/צור-קשר/`.

**Closed 2026-11-08** by commit `7cfcf4c` (Sprint 3 change set A, row 3.4): `text-end` for the three
utilities, `@theme` tokens for every literal. Verified after a clean rebuild:

```bash
node scripts/audit/rtl-lint.mjs   # ✅ bannedUtilities 0 · hexLiterals 0 · directionAgnosticExemptions 0
```

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
`headersFile: true`. **Live — verified 2026-11-08:** on `dangates.pages.dev` (no zone rule in front) the file alone emits
the whole set — HSTS `max-age=31536000`, the report-only CSP, `X-Frame-Options`, `nosniff`,
`Referrer-Policy` and the template's wider `Permissions-Policy` — and `/_next/static/*` carries
`Cache-Control: immutable` on the apex, so the interior blank lines do not orphan the later blocks.
On the apex the zone rule still wins where both speak (HSTS reads `15552000`, the narrower
`Permissions-Policy`). **Zone rule disabled 2026-11-08** (the Transform Rule `ishub baseline security headers`; the HSTS setting in SSL/TLS was never enabled, so it was not the HSTS source) and the apex then matched the repo (HSTS `31536000`, wider `Permissions-Policy`, report-only CSP). **Still open (owner):** delete the zone rule once satisfied, then the apex
shows the repo's values ([owner-actions.md](owner-actions.md) §1.3).

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
(the hidden `company` field in `LeadForm`); no PII in `dataLayer`.

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
`:208` (submit), the sticky-card tel and WhatsApp `Button`s in `app/services/[service]/page.tsx` (×7 pages), the
tel, WhatsApp and mailto links in `app/צור-קשר/page.tsx`, the
`components/marketing/PricingTeaser.tsx` contact link (on `/` and `/מחירון/`) and the footer
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
(§8.6; owner B2).

**The last of it — 2026-11-08**, commit `68a4a7f` (Sprint 3 row 3.12): both `window.open` WhatsApp
paths are now real links, so every WhatsApp exit is visible to a click trigger. With the pricing,
thank-you and live-kit CTAs added since, the scan reads `ctaElements 119 · withDataCta 119 ·
missingDataCta 0 · distinctValues 23 · distinctTaggedElements 30 · chromeCtas 8`
(`node scripts/audit/cta-coverage.mjs`, after a clean rebuild); `grep -rn window.open components app lib`
→ no matches.

### 13.3 — P1 · S · [✅ DONE 2026-09-06 · repo] The 37 stubs stripped the query string

`location.replace()` to a bare path destroyed `gclid`/`utm` on every legacy entry point — all paid and
campaign attribution arriving on an old URL. Fixed for free by §1.1 (a 301 preserves the query), in
the repo since 2026-09-06 and live — verified 2026-11-08:
`curl -sSI "https://dangates.co.il/%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/?utm_source=test"` → `301` with
the query intact in `Location`.

### 13.4 — P2 · S · [✅ DONE 2026-11-08 · repo] `lead_submit` carries no dimension

Until 2026-11-08 `lead_submit` pushed `{ form: "lead" }` only — no site, page, service or city, on a
container shared across ~10 fleet domains. Target parameters: [event-taxonomy.md](event-taxonomy.md).

**Closed in the repo 2026-11-08** by commit `68a4a7f` (Sprint 3 change set C, row 3.9). Every form
event goes through one `track()` helper that adds `form`, `page` and `site: "dangates"`;
`lead_submit` adds `service` (slug or `""`), `city` (slug, `"other"` or `""`) and `placement`
(`hero` | `contact` | `form`), and is pushed only on a confirmed send, before the navigation to
`/תודה/`. Never the name, phone or message (golden rule 10). Nothing counts it until GA4 exists and
the container has a tag for it — owner B2, §13.7. The static export cannot see a runtime push, so the
proof is the source:

```bash
grep -n 'track("lead_submit"' -A4 components/forms/LeadForm.tsx   # service · city · placement (+ form, page, site from track())
```

### 13.5 — P2 · S · [✅ DONE 2026-11-08 · repo] No form-start or submit-attempt event

Until 2026-11-08 abandonment and validation friction were unmeasurable.

**Closed in the repo 2026-11-08** by commit `68a4a7f` (Sprint 3 change set C, row 3.9).
`form_start` fires on the first focus or input of a real field, once per page load (never the
honeypot); `form_submit_attempt` fires when submit is pressed, before validation. Both carry
`placement` plus the `track()` defaults and no PII. Same owner dependency as §13.4 (B2). Proof:

```bash
grep -n 'track("form_start"\|track("form_submit_attempt"' components/forms/LeadForm.tsx   # 2 call sites
```

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

### N2 — P1 · S · [✅ DONE 2026-11-08] `BlogPosting.mainEntityOfPage` carries raw Hebrew

Until 2026-11-08 the post route interpolated `post.slug` unencoded, so the value never byte-matched
the canonical (`schema.mjs` → `rawHebrewUrls` counted 11 here plus 7 `Service.url`). Parent: §4.7.

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.4): `articleJsonLd()` builds
`mainEntityOfPage` through `pageUrl()`. Verified after a clean rebuild:

```bash
node scripts/audit/schema.mjs   # ✅ rawHebrewUrls 0
```

### N3 — P2 · S · [✅ DONE 2026-11-08] `types/index.d.ts` is dead

Until 2026-11-08 nothing imported it, and the `city` field it declared was never wired (§8.4).

**Closed 2026-11-08** by commit `68a4a7f` (Sprint 3 change set C, row 3.7): the file is deleted and
the form collects `city` itself (§8.4). Verified: `ls types` → No such file or directory;
`npm run typecheck` clean.

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

### N8 — P3 · S · [✅ DONE 2026-11-08] FAQ answers are `display:none` in the DOM

Until 2026-11-08 the `Faq` component rendered every answer with `hidden={!isOpen}` — present in the
DOM (so `FAQPage` parity held) but hidden from every reader that didn't click, and hydration JS on
every page that rendered it.

**Closed 2026-11-08** by commit `7cfcf4c` (Sprint 3 change set A, row 3.11). `Faq` is a server
component on native `<details name="faq">` / `<summary>`, the first item open, the `<h3>` inside the
summary; every answer is in the page at first paint with zero client JS. Verified after a clean
rebuild:

```bash
grep -o '<details' out/index.html | wc -l   # 10 — one per question; 0 faq-panel
node scripts/audit/schema.mjs               # ✅ faqPages 1 · FAQPage parity holds
node scripts/audit/perf.mjs                 # ✅ clientComponents 3 — Faq is not one of them
```

### N9 — P3 · S · [✅ DONE 2026-09-06] The footer year is hand-maintained

`components/layout/Footer.tsx` — `const year = 2026;` with a "update yearly" comment. Derive it at
build time; a static export is rebuilt on every deploy anyway.

**Closed 2026-09-06** by commit `13a6bdc` (Sprint 1 change set B, row 1.13). `Footer` is an RSC, so
`new Date().getFullYear()` runs at build time and is baked into the export — the cadence a copyright
year needs, since a static export is rebuilt on every deploy. Verified after a clean rebuild:

```bash
grep -n 'getFullYear' components/layout/Footer.tsx      # const year = new Date().getFullYear();
grep -o '.\{0,12\}2026.\{0,20\}' out/index.html          # >© <!-- -->2026<!-- --> … (baked, not client-rendered)
```

### N10 — P3 · S · [✅ DONE 2026-09-06] `navItems` and crumb hrefs lack the trailing slash the export enforces

`navItems` in `lib/content.ts` (`/שירותים`, `/מחירון`, …) and the crumb `href`s in the routes omit the `/`,
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

### N11 — P2 · S · [✅ DONE 2026-11-08] `accent-500` is the AA hover token, already defined

`app/globals.css` defines `--color-accent-500: #d9b400`; `accent-foreground` (`#3d2b00`) on it
passes 4.5:1, where the old `hover:bg-accent-600` scored 2.76.

**Closed 2026-11-08** by commit `7cfcf4c` (Sprint 3 change set A, row 3.1): the `Button` accent
variant hovers to `accent-500`. Verified after a clean rebuild:

```bash
node scripts/audit/a11y.mjs   # ✅ contrastPairs "accent-foreground on accent-500" 6.79
```

### N12 — P2 · — · [✅ HOLDS · standing rule] Rebuild before asserting

`run-all.mjs` refuses to audit when anything under `app/ components/ lib/ public/` is newer than
`out/index.html`. Never quote a number from a stale export — it describes a build nobody shipped.

---

## §16. New defects found 2026-08-24 (`docs/audits/2026-08-24-full.md`)

### N13 — P2 · M · [✅ DONE 2026-09-06] User-facing Hebrew and a phone literal live in route files

Golden rule 6 says business facts come from `lib/site-config.ts` and CLAUDE.md §5 says copy lives in
`lib/content.ts` — but `app/page.tsx` ends its metadata description with the literal
`חייגו 072-2587772` without importing `siteConfig` at all, and marketing copy is spread across
`app/locations/[city]/page.tsx:31,43`, `app/אודות/page.tsx:15,34`, `app/שירותים/page.tsx:10,18`,
`app/צור-קשר/page.tsx` and `components/marketing/{Hero,FinalCta,ServiceAreas}.tsx`.

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

### N14 — P1 · M · [✅ DONE 2026-11-08] The `/מחירון/` price pivot was unblocked and overdue

§7.3 and §4.10 were recorded as blocked on real prices — but the 2026-08-17 owner intake answered:
real prices are **❌ not coming**. That resolved the item rather than deferring it: the page had to
stop being a price list of eight authored estimates and become _what determines the price_ — the
pivot in `docs/keyword-map.md` §10. Verified 2026-08-24: `grep -rl '800–1,500' out
--include=index.html` → `out/index.html`, `out/מחירון/index.html`.

**Closed 2026-11-08** by commit `af8ba4c` (Sprint 4 change set B, row 4.2). The eight authored rows
are deleted; `priceRows` keeps only "ביקור טכנאי ואבחון" 150–350 ₪, marked `// 🔶 confirm`, and
`visitFeeRange` is the one number any pricing copy interpolates. `/מחירון/` (`pricingPageCopy`)
opens with an answer block and gives one question-form H2 per driver — the fault, the gate's weight
and width, the motor class, whether the motor can be reused, access and cabling, what the visit
covers (and whether its fee is credited, asked rather than stated — §D is 🔶), and what only shows
once the motor is opened. Verified on the current `out/`:

```bash
grep -rl '800–1,500' out --include=index.html | wc -l   # 0
node scripts/audit/content-depth.mjs                    # pricing 945 unique / 400 · belowFloor 0
node scripts/audit/schema.mjs                           # ✅ 0 failures — no Offer, /מחירון/ a plain WebPage
```

Commit `9195c9b` (4F, 2026-11-09) cut the page's five repeats of the visit band to two, both from
`visitFeeRange` / `priceRows` (`'150–350 ₪'` ×2 in `<main>` of `out/מחירון/index.html`); pricing
now 914 unique / 400, `belowFloor 0`.

### N15 — P2 · S · [✅ DONE 2026-11-08] No transparency surface beyond a phone number

Until Sprint 4: `grep -rnE 'ח\.פ\.|ע\.מ\.|תלונ|ביטול עסקה|החזר כספי' lib app` → nothing. No legal
entity name, no ח.פ./ע.מ., no complaints route, no cancellation or refund path. The **absent street
address is correct** for a service-area business (§5.6) and is not part of this item.

**Closed 2026-11-08** by commit `af8ba4c` (Sprint 4 change set B, row 4.5). `/צור-קשר/` carries a
`#complaints` section (`contactTransparencyCopy`): how to complain, cancel or reschedule a visit or
ask about an invoice through the existing phone, WhatsApp and email, with the hours and no
response-time promise; the footer links it (`footerTransparencyLink`). Verified on the current
`out/`:

```bash
grep -c 'id="complaints"' out/צור-קשר/index.html     # 1
grep -o 'href="/צור-קשר/#complaints"' out/index.html  # present in the footer
node scripts/audit/links.mjs                         # brokenLinks 0
```

The ח.פ. and the legal entity name stay 🔶 (business-facts §B) and render nowhere.

### N16 — P2 · S · [✅ DONE 2026-11-08] The manifest is cast rather than narrowed

Until 2026-11-08 `lib/site-config.ts` read `siteManifest as unknown as SiteManifest`, which defeated
strict-mode narrowing on every field downstream (`manifest.contact`, `manifest.schema`,
`manifest.analytics`), so a missing or renamed roster key became a runtime `undefined` instead of an
error.

**Closed 2026-11-08** by commit `02a3144` (Sprint 2 change set A, row 2.11). `lib/manifest.ts`
exports `parseManifest(raw: unknown): SiteManifest`, which narrows every field and throws with the
JSON path of the offending one, so a broken roster sync fails the build under `output: "export"`.
Verified:

```bash
grep -rn 'as unknown as' app components lib   # (no matches)
grep -n 'parseManifest' lib/site-config.ts    # manifest = parseManifest(siteManifest)
npm run typecheck                             # clean
```

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

### N19 — P2 · S · [✅ DONE 2026-11-08] No skip link, and phone-first CTAs under 44px

Filed 2026-11-08 for Sprint 3 row 3.12 (accessibility-and-i18n §2 had no backlog row for either).
The first focusable element on a page was the header, so a keyboard user tabbed through the whole
chrome to reach the content; the mobile-menu toggle was 40px (`h-10 w-10`).

**Mostly closed 2026-11-08** by commit `60ce109` (Sprint 3 change set B, row 3.12). `app/layout.tsx` renders
a skip link to `<main id="main" tabIndex={-1}>` (label `skipLinkLabel` in `lib/content.ts`) as the
first focusable element, before the live-kit bar and the header; the menu toggle is `h-11 w-11`
(44px), and the hero, final-CTA, service, pricing, thank-you and mobile-menu call / WhatsApp
buttons are `Button size="lg"`. **Closed the same day** (commit `fba5957`): the two buttons in the lead form's
delivery-failure alert (`form-whatsapp`, `form-call`) were `size="md"` — about 40px from
`py-2.5` + `text-sm` — and are now `size="lg"` (`py-3.5` + `text-base`, about 52px), derived from
the classes; `a11y.mjs` does not measure target size. The header call button is also `md` but is
hidden below `sm`, so it is never a phone target. Verified after a clean rebuild:

```bash
grep -o 'href="#main"[^>]*>' out/index.html | head -1   # the skip link — the first <a>/<button> in <body>
grep -rn 'size="lg"' components app | wc -l             # 13
node scripts/audit/a11y.mjs                             # ✅ 0 failures · 0 warnings
```

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
   live since the 2026-10-12/13 deploys (verified 2026-11-08).
3. ~~**§10.1** font preloads~~ · ~~**§1.5** `og:url`~~ · ~~**§1.4** sitemap from data~~ ·
   ~~**§12.1** `_headers`~~ · ~~**§3.3** triggers to content~~ · ~~**§3.11–3.12**~~ ·
   ~~**§13.1** GTM to `<head>`~~ · ~~**§13.2** `data-cta`~~ — shipped in the repo 2026-09-06
   (Sprint 1, commits `a0e0fe2` `13a6bdc` `cfff52f` `fee7f69`); also ~~§10.3~~, ~~N1~~, ~~N9~~,
   ~~N10~~, ~~N13~~. §3.11–3.12, the blog-cleanup remainder, shipped with Sprint 4.8 (`74a92d1`).
4. ~~**§11.1** contrast (via N11)~~ · ~~**§11.2–11.5**~~ · ~~**N6 · N7**~~ — §11.1–11.5 and N11
   shipped in the repo 2026-11-08 (Sprint 3, commits `7cfcf4c` `60ce109`); N6 · N7 on 2026-09-06
   with §1.1. → **Phase 1 = 2–4 + N1**, done in the repo.
5. ~~**Phase 2 — schema:** §4.2 substance · §4.4 · §4.5 · §4.6 · §4.7/N2 · §4.8 · §4.9 · §4.10
   catalog half · §4.12 · §7.4 registry + `AboutPage` · N16~~ — shipped in the repo 2026-11-08
   (Sprint 2, commits `02a3144` `d8edb28`); `schema.mjs` → 0 failures, 0 warnings. §4.10's `Offer`
   half stays ⏳ (business-facts §D); the N14 pivot (Sprint 4) removed the authored prices it was
   blocked on, leaving only the 🔶 visit band.
6. ~~**Sprint 4 — the truth pass:** §7.2 claims · N14 / §7.3 / §3.13 pricing pivot · §3.5 / §4.13
   homepage FAQ · §6.2 homepage and pricing answer blocks · N15 · §7.6 · §2.4–2.6 descriptions and
   titles · §3.11–3.12 blog debris~~ — shipped in the repo 2026-11-08 (commits `1796ee7` `af8ba4c`
   `74a92d1`): `claims-grep.mjs` 0, home 1535 unique / 800, `titles.mjs` 0 warnings,
   `curlyQuotes 0`; audit 15 → 8. ~~The 4B / 4C reviewer should-fix items~~ — closed 2026-11-09
   in `9195c9b` (4F), with the roster `shortPitch` cleared in `ad2f1ab`; audit still 8, home 1549
   unique, `claims-grep` 0 over 14 claims. Partial by design: §3.13 (about and both indexes —
   closed in Sprint 6.8, `7c3f2db`), §6.2 (locations closed in Sprint 6; posts → Sprint 7), §6.4
   (8 of 11 posts dated; the rest with Sprint 7.3). Open: the deploy, and the manifest `areaServed` phrase in the client bundle (B5).
7. ~~**Sprint 5 — service depth:** §3.2 · §6.2 and §4.13 for the 7 service pages · §9.4 service
   half · §2.4 re-derived inside the 120–160 window~~ — shipped in the repo 2026-11-09 (commit
   `225ff45`): service `belowFloor 0`, `serviceMedianDelta 438`, `faqPages 8`,
   `relatedServiceTargets 7`, `titles.mjs` 0 warnings; audit 8 → 5. Partial: §9.4 (the post route
   still `.slice(0, 4)` → Sprint 7.3) and §9.3 (service → city done; the location side closed in
   Sprint 6.7, `7c3f2db`). Open: reviewer sign-off on record, and the deploy.
8. **Sprint 6 — locations + navigation:** ~~§2.3 · §5.2 · §3.13 (indexes and about) · §9.2 · the
   rest of §9.3~~ — shipped in the repo 2026-11-09 (commit `7c3f2db`): location `belowFloor 0`,
   `locationMedianDelta 343.5`, the three pages over their floors, `notInChrome 0`, `orphans 0`,
   `faqPages 26`, `claims-grep.mjs` still 0; audit 5 → 1 (the post floor only). §3.1 / §5.3 and the
   §5.5 copy half are done for the 13 confirmed cities and ⏳ BLOCKED · owner (3.6, B5) for the five
   🔶 entries, which ship as bounded pages. **Next:** §9.1 header reach (row 6.5, not
   owner-blocked), local-seo-strategist and claims-verifier sign-off on record, then the deploy.
9. **Phase 4 — guides hub + block model (next after 6.5):** §6.3 · §3.8 · §3.10 · §9.5 · §6.2 for the posts
   (ADR 0002, 0003) · the rest of §6.4 (PARTIAL since 4F) · the post half of §9.4 · §6.5 `llms.txt`.
10. ~~**Phase 5 — engagement + CRO:** §8.1 · §8.3 · §8.4/N3 · §8.5 · N8 · §13.4–13.5 · §10.2 · N19~~
    — shipped in the repo 2026-11-08 (Sprint 3, commits `7cfcf4c` `60ce109` `68a4a7f`; N19 closed
    in `fba5957`, the form alert's buttons now `size="lg"`); `a11y.mjs`, `rtl-lint.mjs` and
    `cta-coverage.mjs` 0, `clientComponents` 3. Left: §8.2 (PARTIAL — B2 / B10 only; the privacy
    copy is signed off), §8.6 (PARTIAL — the GTM tag and B2), and the engagement events (Sprint 8.1).
11. **Phase 6 — E-E-A-T + AEO:** ~~§7.2~~ · ~~§7.6~~ (Sprint 4) · §6.5 · §7.5 photos (B4).
12. **Phase 7 — measurement:** §13.7 · §15.2 cadence · §15.3 (after B1, B2).
13. Everything tagged `⏳ BLOCKED · owner` moves when [owner-actions.md](owner-actions.md) moves.
