---
name: qa-build-gate
description: The release gate before any deploy on dangates — Step 0 `npm run audit:env`, a clean rebuild that clears `.next/` the hook-approved way, `npm run gate` (lint → typecheck → format:check → build → audit) read against the known-baseline table (re-cut 2026-11-10 at 379eb0e, after the 2026-11-09 full audit's pre-deploy polish 8768ce2, 9886dd1 and its last pass 379eb0e — still 1 expected failure, the content-depth post floor, which waits on owner-actions 3.8; down from 5, 8, 15, 26 and 37) so a run is judged on regressions rather than on that baseline, seven raw sanity greps a human can eyeball, the auditor sweep routed from docs/agent-roster.md §3, and the stop-ship list. Use before every deploy or when asked whether the site is ready to ship. Triggers: "run the build gate", "is this ready to ship", "pre-deploy check", "QA the site", "verify the build", "מוכן לעלות לאוויר", "בדיקה לפני פריסה".
allowed-tools: Read, Grep, Glob, Bash
---

# Build gate

Everything here runs against `out/` — the artifact that actually ships. A passing `npm run build` is
the start of the gate, not the end. Two rules frame every step:

- **Rebuild before asserting (backlog N12).** `scripts/audit/run-all.mjs` refuses a stale export:
  if anything under `app/ components/ lib/ public/` is newer than `out/index.html` it exits without
  measuring. Numbers from an old `out/` describe a build nobody shipped.
- **Judge on regressions, not on the baseline.** `npm run audit` does not exit 0 today and will not
  until the posts are rewritten (Sprint 7.3, ⏳ BLOCKED · owner 3.8 — §Known baseline, 1 as of
  2026-11-10). A gate run passes when every failure it prints is in that table
  (or in the latest `docs/audits/` report) and no watched metric moved the wrong way.

## Step 0 — the environment's own self-test

```bash
npm run audit:env        # = node scripts/audit/env-doctor.mjs — 0 failures required
```

It checks dead `file:line` citations, frontmatter, `Skill()` allow-list parity with the skill
directories, the hooks, the deny set and that every name in `docs/agent-roster.md` exists on disk.
A failure here means the `.claude/` layer is mid-change — finish that first; a gate whose own
instruments are inconsistent proves nothing. Source-only: it does not need `out/`.

## Step 1 — clean rebuild

```bash
node -e "require('fs').rmSync('.next',{recursive:true,force:true})" && npm run build
```

The shell recursive delete is blocked by `.claude/hooks/guard-destructive-ops.ps1` (it matches any
`Remove-Item -Recurse -Force` / `rm -rf` form); the `node -e … rmSync` one-liner is the sanctioned
way to clear `.next/`. `next build` rewrites `out/` itself.

**Why clearing `.next/` matters.** On this fleet an export once carried ~14 MB of dev-only chunks
(`main.js`, `fallback/main.js`, `fallback/amp.js`) — a `next dev` run's artifacts surviving into the
export, uploaded on every deploy. Deleting them from `out/` afterwards is not the fix; clearing
`.next/` is. `node scripts/audit/perf.mjs` holds the line (`maxJsFileBytes` 1 MB in
`scripts/audit/thresholds.json`, `devBuildFiles` in `edge.mjs`); as of 2026-11-10 (at `bcbf822`)
a clean export is 12.90 MB (12898445 B) in 145 files against the `maxOutBytes` (15 MB since 2026-11-11, raised by the owner from 13 MB; 13 MB since 2026-11-10, raised from
12 MB) — 11.51 MB (11512187 B)
in 143 files at `379eb0e`; 11.69 MB at
`2b0d802` until `9886dd1` stopped serialising the header menus twice into every RSC payload; 10.61 MB
after `7ed1acd` retired four location pages, before the header disclosures and the TOC (`fd72698`,
`98e38f0`) printed their links in every HTML page and RSC payload; 11.51 MB in 151 after Sprint 7 (the live-kit
surfaces added ≈1.15 MB in 2026-10, the service depth copy ≈0.7 MB, the location and index-page copy
≈1.3 MB and the hub and four guides ≈1.5 MB) — with 33 JS chunks totalling 783 KB (783464 B), largest 173 KB.
The headroom under the cap is ≈0.10 MB: a change that adds bytes to every page is the one to watch.

## Step 2 — `npm run gate`

```bash
npm run gate             # lint → typecheck → format:check → build → npm run audit
npm run audit -- --scope seo --json   # one scope, machine-readable, when iterating
```

All four build-side commands must pass. `format:check` is in the chain because the Stop hook
(`format-changed.ps1`) formats changed files — an unformatted file means something bypassed it.
The audit step prints one markdown table per check and exits with the **failure count**; read the
table against the baseline below. Every inline grep the old gate carried now lives in a script
(`docs/agent-roster.md` §4): titles → `titles.mjs`, canonicals/sitemap parity/H1/orphans/stubs →
`links.mjs`, structured data → `schema.mjs`, content floors → `content-depth.mjs`, CTA tagging →
`cta-coverage.mjs`, RTL utilities and hex → `rtl-lint.mjs`, contrast/forms/lists → `a11y.mjs`,
weight/preloads → `perf.mjs`, `_redirects`/`_headers`/dead hosts → `edge.mjs`, blog debris →
`spam-grep.mjs`, unconfirmed claims → `claims-grep.mjs`.

### Known baseline — as of 2026-11-10 (at `bcbf822`), `npm run audit` exits 1

Counts re-measured on 2026-11-10 at `bcbf822` (`npm run build`, then `npm run audit -- --json`;
backlog N32): still 1 failure, the post floor. The content work since `379eb0e` (N23–N31 and the
safety consolidation `526d19b`) moved the counts below by design — guides 4 → 5, `sitemapUrls`
46 → 47, `contentPages` 47 → 48, `faqPages` 26 → 27 (103 → 109 questions), `images` 0 → 48 (the
header logo, one per page), `outBytes` 11512187 → 12898445 under a cap raised to 13 MB, then 15 MB on 2026-11-11; `about`
1214 → 938 and the areas index 546 → 523 unique fell with `526d19b`, which took the release steps
off both. One new `titles` warning: guide #5's title is 65 characters. Re-cut from `npm run audit -- --scope full` on 2026-11-10 against a clean rebuild (source tree at
`379eb0e`, the polish's last pass: the committee guide's quorum row quoted as the bylaws word it,
the posts' guarantee-for-years lines gone and `durability-promise` widened to the whole class,
`frame-ancestors` described as staged rather than as protection — no failure added or removed;
`emojiCount` 28 → 27, `outBytes` 11509453 → 11512187, `rscBytes` 3425964 → 3426835,
`jsTotalBytes` 783384 → 783396 (the WhatsApp label «עיר או אזור:»), post range 447–583 → 453–599,
guide median 2511.5 → 2514, blog index 548 → 553 unique; all by design). Before that, at
`9886dd1`: the pre-deploy polish from the 2026-11-09 full audit (`docs/audits/2026-11-09-full.md`)
— `8768ce2`, the last unsourced policy, durability, price-list, mains-work and client-base lines out
of the copy and four new lexicon ids; `9886dd1`, honest far-pair headings, «אזור השרון», both dates
on every post, related posts by relevance, the article `data-cta` names, the header menus
serialised once, and `frame-ancestors` with an edge check on `_headers`. The baseline before it was
also 1, at `2b0d802` the same day (1 at `7ed1acd`, `89439b7` and `7c3f2db`, 5 at `225ff45`, 8 at
`9195c9b`, 15 on 2026-11-08, 26 on 2026-09-06, 37 on 2026-08-23). The two change sets added no
failure and removed none — the post floor needs the post rewrite, ⏳ BLOCKED · owner 3.8 — but they
cleared two warnings: `links` (the related-post monotony warning, `relatedPostTargets` 5 → 11) and
`cta-coverage` (the six off-convention `article-*` values, N21). The `content-depth` answer-block
warning on the posts is gone too, **without an answer block**: the date left the first `<p>`, and
the posts' generic 45–60-word openings now pass the proxy (backlog §6.2). Everything else moved only
by design — `claimsChecked` 14 → 18, `edge` → `headerProblems 0` (new metric), `outBytes` 11.69 →
11.51 MB, `rscBytes` 3.51 → 3.43 MB, `jsTotalBytes` 782961 → 783384, `emojiCount` 39 → 28, pricing
914 → 1126 unique, home 1762 → 1786, about 1197 → 1214, areas index 526 → 546, location median 887
→ 890 (`locationMedianDelta` 343 → 343.5), guide median 2470.5 → 2511.5. `clientComponents` stays 5.

| Check                 | Fails | What is failing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Expected until                                       |
| --------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `content-depth`       | 1     | the post floor: 11 posts 453–599/900. ✅ since `89439b7`: the guides — 5 since `c457c31` (median 2986 / 900, as of 2026-11-10; 4 at 2514 before) — and the hub (917 / 250); since `7c3f2db`: the locations (floor and delta — 14 of 14 since `7ed1acd`), the areas index and `/אודות/`; since `225ff45`: the 7 services (floor and delta). Only the shared-paragraph warning prints; the post answer-block warning stopped in `9886dd1` because the date left the first `<p>` — the posts still have no answer block      | posts — Sprint 7.3, ⏳ owner 3.8 (§3.8, §3.10, §6.2) |
| `claims-grep`         | 0     | ✅ since `1796ee7` (§7.2, §7.6) — `failingClaims` 5 → 0, every `liveOccurrences` 0 over `claimsChecked 18` (`workmanship-absolute` added in `9195c9b`; `quote-before-work`, `no-obligation`, `durability-promise` and `price-list-pointer` in `8768ce2`; `durability-promise` widened to the class in `379eb0e`); `totalHits 1` is the gated rating row in `Reviews.tsx`; `commentHits 24` are explanatory comments, skipped by design. It reads `<main>` text only — see the bundle note under Step 3                    | keep at 0                                            |
| `schema`              | 0     | ✅ since `d8edb28` (§4.2, §4.4–§4.9, §4.12, N2) — `danglingIds` 18 → 0, `rawHebrewUrls` 18 → 0, `WebSite` on `/`, `Service` on the 14 locations (18 until `7ed1acd`); 0 warnings                                                                                                                                                                                                                                                                                                                                          | keep at 0                                            |
| `a11y`                | 0     | ✅ since `68a4a7f` (§11.1–§11.3, N11, §8.1) — every contrast pair ≥ 5.42:1, lists intact, per-field `aria-invalid`; 0 warnings, the header disclosures and the TOC included                                                                                                                                                                                                                                                                                                                                               | keep at 0                                            |
| `rtl-lint`            | 0     | ✅ since `7cfcf4c` (§11.5) — `bannedUtilities` 3 → 0, `hexLiterals` 7 → 0; `KNOWN_CLIENT` holds the 5 client files, so no unexpected-client warning                                                                                                                                                                                                                                                                                                                                                                       | keep at 0                                            |
| `titles`              | 0     | ✅ since `13a6bdc` (§1.5) — `ogUrlMissing` 45 → 0; 0 warnings from `74a92d1` (§2.4–§2.6, 24 → 0) until `c457c31`, 1 since: guide #5's title is 65 characters (§2.5), as of 2026-11-10                                                                                                                                                                                                                                                                                                                                     | keep at 0                                            |
| `cta-coverage`        | 0     | ✅ since `fee7f69` (§13.2) — `missingDataCta` 24 → 0; the `/מחירון/` warning gone since `68a4a7f` (§8.5); the six off-convention `article-*` values renamed in `9886dd1` (N21: `articleinline-*`, `articlequote-*`, `articleaside-*`), so 0 warnings                                                                                                                                                                                                                                                                      | keep at 0                                            |
| `perf`                | 0     | ✅ since `13a6bdc` (§10.1, §10.3) — `fontPreloads` 0 → 2, `unusedDeps` → `[]`. The "48 RSC payload files" warning (47 until `c457c31`) stays by design: since `2b0d802` (§1.3) the files are kept for soft navigation and disallowed in `robots.txt`; since `9886dd1` it reads as the byte cost ("3.91 MB of the out/ byte budget (30.3%)", as of 2026-11-10)                                                                                                                                                             | keep at 0                                            |
| `edge`                | 0     | ✅ since `a0e0fe2` (§1.1 ADR 0004, §12.1, §12.4/N5, N4) — 37 stubs → 72 real 301 rules (80 since `7ed1acd`), `_headers` owned, 0 dead-host artifacts; `llmsTxt true` and 0 warnings since `89439b7` (§6.5); `rscPayloadsDisallowed true` since `2b0d802` (§1.3); since `9886dd1` it **fails** if `public/_headers` or `out/_headers` drops a security header or the CSP's staged `frame-ancestors` (`X-Frame-Options` is the protection in force; a Report-Only CSP never blocks — `379eb0e`) (`headerProblems 0`, §12.1) | keep at 0                                            |
| `export`              | 0     | pass — asserts `out/` is a current build of the source tree (N12)                                                                                                                                                                                                                                                                                                                                                                                                                                                         | keep at 0                                            |
| `links` · `spam-grep` | 0     | pass — their metrics are the regression watch-list below; `links` prints no warning since `9886dd1` (§9.4)                                                                                                                                                                                                                                                                                                                                                                                                                | keep at 0                                            |

The ✅ rows are green **in the repo**. Sprint 1 is live (the 2026-10-12/13 deploys, probed
2026-11-08); Sprints 2, 3, 4, 5, 6 (content and header), 7, Sprint 8's repo rows and the 3.6 change
set (`8e8843d` `7ed1acd`) and the pre-deploy polish (`8768ce2` `9886dd1` `379eb0e`) went live on 2026-11-10 at
`669582e`; the content brief N23–N32 that followed (`1f1b1ec` onward) is not deployed yet. `edge` in particular measures files, not
responses — the live probe is `deploy-dangates`'s job.

Phases are the "Suggested order of work" at the end of `docs/optimization-backlog.md`. When a
`docs/audits/<date>-full.md` report is newer than this table, the report wins — and this table
should be re-cut from it.

**Regression watch-list** (metrics in the `--json` output; any move in the wrong direction fails the
gate even though the check itself still passes): `links` → `orphans 0`, `brokenLinks 0`,
`linksToStubs 0`, `pagesNotExactlyOneH1 0`, `headingSkips 0`, `breadcrumbPages 46`,
`sitemapUrls 47`, `contentPages 48` (47 + the `noindex` `/תודה/`), `staticRoutesRegistered 11` ·
`titles` → `pages 48`, `uniqueTitles 48`, `uniqueDescriptions 48` (all as of 2026-11-10) ·
`titles` → 0 warnings (since `74a92d1`) — 1 since `c457c31`, guide #5's 65-character title ·
`spam-grep` → `spamHits 0`, `fusedWords 0`, `relatedTails 0`, `curlyQuotes 0`, `emojiCount 27` ·
`claims-grep` → `failingClaims 0`, `totalHits 1`, `claimsChecked 18`, every `liveOccurrences`
value 0 · `content-depth` (as of 2026-11-10) → home `belowFloor 0` (1809 unique), pricing `belowFloor 0` (1156 unique),
service `belowFloor 0` (median 1978 unique), location `belowFloor 0` (14 pages, median 1196.5 unique),
guide `belowFloor 0` (5 pages, median 2986 unique), guides index `belowFloor 0` (917 unique), services index
`belowFloor 0` (1034 unique), areas index `belowFloor 0` (523 unique), about `belowFloor 0` (938
unique), blog index 561 unique, `locationMedianDelta 357`, `serviceMedianDelta 509`,
`sharedParagraphs 1`, no answer-block warning (one reappearing on any route is a regression) ·
`links` → `relatedServiceTargets 7`, `relatedPostTargets 11`, `notInChrome 0`, `chromeLinks 31`, no
warning · the homepage `<header>` carries 21
distinct `/services/` + `/locations/` hrefs (§9.1; no script counts it — the grep is in backlog
§9.1) and 25 pages carry `nav[data-toc]` (N20; 17 before the N26–N29 rework) ·
`schema` → `pagesWithJsonLd 47`, `danglingIds 0`, `rawHebrewUrls 0`, `faqPages 27` (109 questions) · `perf` →
`largestJsBytes 172834`, `jsTotalBytes` ≤ 783464 unless a change says why, `clientComponents 5`
(`EngagementEvents`, `LeadForm`, `DesktopNav`, `MobileMenu`, `Reveal` — 3 from Sprint 3 until
`fd72698`), `outBytes` under 15000000 (12898445, as of 2026-11-10), `rscBytes` ≤ 3910161, `images 48` (the header logo, one per page), `imagesUnsized 0`, `fontPreloads 2`, `unusedDeps []`,
`devBuildFiles 0`, `sourceMaps 0` · `rtl-lint` → `bannedUtilities 0`, `hexLiterals 0` · `a11y` →
`imgCount 48`, `unlabeledControls 0`, `emptyLinks 0`, every `contrastPairs` value ≥ 4.5 · `titles` →
`ogUrlMissing 0` · `cta-coverage` → `missingDataCta 0`, no warning, `ctaElements 150`,
`distinctTaggedElements 47` (113 / 24 after Sprint 1; 115 / 26 with the fleet live-kit's card —
CLAUDE.md §14; 119 / 30 with the pricing and thank-you CTAs of Sprint 3; 125 / 35 with Sprint 4's
pricing, FAQ link-out and complaints CTAs; 152 / 46 with Sprint 7's guide CTAs; 144 / 46 after
`7ed1acd` took four location pages' CTAs out; 150 / 47 as of 2026-11-10, with guide #5) · `edge` → `stubs 0`, `redirectRules 80`,
`redirectsFile true`, `headersFile true`, `headerProblems 0`, `llmsTxt true`, `rscPayloadsDisallowed true`,
`deadHostArtifacts 0`, `foreignStubs 0`.

**Live surfaces (CLAUDE.md §14).** `npm run build` now runs the kit's gates in `prebuild` and
`postbuild`; a register without the owner's `approved` stamp fails it. A local preview is
`LIVE_DRAFT=1 npm run build`, and its `out/` carries `out/.live-draft` — **stop-ship**: never
deploy an `out/` that has it (`test ! -e out/.live-draft`; `ops/deploy-site.ps1` refuses it too).
The export is ≈1.15 MB larger with them (every line and both inline scripts printed in the HTML
and again in the RSC payload); `perf` → `outBytes` stays inside `maxOutBytes`.

`fontPreloads` is a two-sided watch: `perf.mjs` also fails if a preloaded href is not a real file in
`out/`, so a `Rubik({...})` change that re-hashes the faces without updating `lib/fonts.ts` is caught
here rather than shipping a 404 preload.

## Step 3 — raw sanity greps (for a human, after the scripts)

```bash
find out -name index.html | wc -l                                                  # 49 = 47 content + /תודה/ (noindex) + /404/, as of 2026-11-10 (48 from 7ed1acd until c457c31; 52 from Sprint 7 until 7ed1acd; 47 before Sprint 7; 83 while the 37 stubs shipped)
grep -c '<url>' out/sitemap.xml                                                    # 47 as of 2026-11-10 (46 from 7ed1acd)
grep -rl 'aggregateRating\|"@type":"Review"' out --include=index.html | wc -l      # 0 — anything else is a stop-ship
grep -rl '"@type":"Person"' out --include=index.html | wc -l                       # 0 — no person exists; lib/authors.ts is an empty registry
grep -rl 'דן שערים חשמליים | דן שערים חשמליים' out --include=index.html | wc -l  # 0 — doubled brand suffix
find public -name index.html | wc -l                                               # 0 — stubs gone (ADR 0004); anything > 0 means one came back
grep -c ' 301$' public/_redirects                                                  # 80 — the real 301s that replaced them, plus the 4 retired location pages (7ed1acd)
```

**The client bundle is not in any script's scope.** `claims-grep` reads `<main>` text, and
`site.config.json` is bundled whole into a JS chunk, so a roster string no page renders still
ships. Since `ad2f1ab` (2026-11-09) the roster `shortPitch` carries none of the four claims;
`grep -rl 'אחריות מלאה\|24/7' out/_next/static | wc -l` → 0, and since the roster sync `8e8843d`
(B5, owner-actions 3.6 answered 2026-11-09) `grep -rl 'פריסה ארצית' out/_next/static | wc -l` → 0
too — the manifest `areaServed` reads "מרכז הארץ והאזורים שמופיעים באתר" (it was 1 until then).
Any hit now is a new roster claim — stop-ship.

Do not grep for a bare `"author"` here: all 11 `BlogPosting` nodes and the 4 guide `TechArticle` /
`Article` nodes carry the business as author by design (CLAUDE.md §8), so that count is 15, not 0. The invented-byline assertion is `Person` = 0.
Use `find out -path '*מדריכים*'`-style paths rather than Hebrew globs — Git Bash glob expansion over
UTF-8 directory names is unreliable on Windows.

If the route count moves, reconcile before shipping: since §1.4 closed (2026-09-06) the eleven static routes (ten indexable, the `/מדריכים/` hub among them since `89439b7`, + the `noindex` `/תודה/`) are the `staticPages` registry in `lib/site-config.ts`, and `links.mjs` fails on any `app/` route missing from it or any registered route with no page — `staticRoutesRegistered` is the mechanical catch, this grep is the eyeball.

PowerShell 5.1 equivalent (no `&&`, no `??`):

```powershell
$keys = 'aggregateRating', '"@type":"Review"', '"@type":"Person"', 'דן שערים חשמליים | דן שערים חשמליים'
$n = @{}; foreach ($k in $keys) { $n[$k] = 0 }
foreach ($f in Get-ChildItem out -Recurse -Filter index.html) {
  $t = Get-Content $f.FullName -Raw -Encoding UTF8
  foreach ($k in $keys) { if ($t.Contains($k)) { $n[$k]++ } }
}
$n.GetEnumerator() | Sort-Object Name | ForEach-Object { "{0,-44} {1}" -f $_.Name, $_.Value }   # all four: 0
```

## Step 4 — auditor sweep

For a substantive change, run the reviewers for the changed area against the fresh `out/` — in
parallel, one message. Routing is `docs/agent-roster.md` §3; each agent returns rows in the
`docs/audits/_template.md` format (severity · finding · evidence · backlog id · fix owner) and
`/audit` assembles the file. The writer never reviews its own change.

| Changed                                        | Run                                                     | Proof script                                   |
| ---------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| metadata, routes, sitemap, stubs, `_redirects` | `seo-auditor`                                           | `titles.mjs`, `links.mjs`, `edge.mjs`          |
| JSON-LD, `PageHeader` crumbs                   | `schema-auditor`                                        | `schema.mjs`                                   |
| any new Hebrew copy                            | `hebrew-editor` → `claims-verifier`                     | `spam-grep.mjs`, `claims-grep.mjs`             |
| claims, trust surface, About, footer hours     | `eeat-trust-auditor` · `claims-verifier`                | `claims-grep.mjs`, `schema.mjs`                |
| location or service copy                       | `local-seo-strategist` · `claims-verifier`              | `content-depth.mjs`                            |
| a `/מדריכים/` guide                            | `article-auditor` → `hebrew-editor` → `claims-verifier` | `content-depth.mjs`, `schema.mjs`, `links.mjs` |
| answer blocks, `robots.ts`, `llms.txt`         | `aeo-geo-strategist`                                    | `content-depth.mjs`, `edge.mjs`                |
| components, colours, fonts, lists, focus       | `perf-a11y-auditor`                                     | `a11y.mjs`, `perf.mjs`                         |
| form, CTAs, `data-cta`, tracking, engagement   | `cro-engagement-auditor`                                | `cta-coverage.mjs` + the gtm.js 200-check      |
| headers, stubs, deps, `.env.example`, hooks    | `security-auditor`                                      | `edge.mjs`, `spam-grep.mjs`                    |
| any TS/React                                   | `ts-react-reviewer`                                     | `rtl-lint.mjs`                                 |

## Step 5 — stop-ship list

- `lint`, `typecheck`, `format:check` or `build` failing; `npm run audit:env` above 0.
- Any audit failure **not** in the known-baseline table or the latest `docs/audits/` report, or a
  watch-list metric moving the wrong way — "it was already failing" only counts for listed rows.
- `Review` / `AggregateRating` in any page, a `Person` author, or `claims-grep` reporting a live
  `rating`, `named-person`, `licence`, `insurance` or `founded` occurrence — every one of these is a
  fabricated fact (golden rule 1; the review gate in `components/marketing/Reviews.tsx` stays).
- A new live claim from the lexicon (`scripts/audit/claims.json`) — `claims-grep` counts up — or a
  live claim `docs/business-facts.md` marks 🔶 / ⛔ (`claims-verifier` says stop).
- A doubled brand suffix; a page without a self-referencing canonical; `pagesNotExactlyOneH1` > 0.
- `spamHits` > 0 or non-Hebrew debris in a blog body.
- A route in `out/` missing from `sitemap.xml`, `brokenLinks` > 0, a redirect whose destination no
  longer resolves, or `npm run redirects` leaving `public/` dirty (the map drifted from the
  generated `_redirects` — §1.6). `find public -name index.html` returning anything but 0 means a
  meta-refresh stub has come back and is now shadowing its own 301 rule.
- Any file over 1 MB under `out/_next/`, or `devBuildFiles` > 0.
- A route count that moved with no reconciled reason.
- A GTM container id change without the `https://www.googletagmanager.com/gtm.js?id=<ID>` → 200
  check (golden rule 8).

## Then

`/deploy-dangates` — `ops/deploy-site.ps1 -DryRun` first, every time; the real deploy needs the
user's go-ahead, `-Confirm` **and** a trailing `# APPROVED: <reason>` on the same command. **Pushing
to `main` publishes nothing at all** — the GitHub Pages workflow was retired 2026-09-06 (ADR 0004),
so `wrangler` direct upload is the only path to production (CLAUDE.md §10). Since Sprint 1 that
deploy is also what makes `_redirects` and `_headers` real: hand `deploy-dangates` the three-URL
`301` probe as part of the same run.

## Gotchas

- `run-all` refusing to run is a message, not a bug: rebuild (Step 1) and re-run.
- The guard hook matches the recursive-delete _string_ anywhere in a command — including inside a
  grep pattern or a comment. Keep it out of the command line entirely.
- Windows PowerShell 5.1 has no `&&`; chain with `;` or `if ($?) { … }`. The Bash tool is fine for
  the `&&` forms above.
- `--json` for comparison across runs (the `docs/audits/` Δ section), the markdown for reading.
- `format:check` failing on a file you did not touch means the Stop hook was skipped in an earlier
  turn — `npm run format`, then re-run the gate.
