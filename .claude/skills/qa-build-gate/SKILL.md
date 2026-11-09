---
name: qa-build-gate
description: The release gate before any deploy on dangates — Step 0 `npm run audit:env`, a clean rebuild that clears `.next/` the hook-approved way, `npm run gate` (lint → typecheck → format:check → build → audit) read against the known-baseline table (re-cut 2026-11-09 after the Sprint 6 content to 1 expected failure, the content-depth post floor, down from 5, 8, 15, 26 and 37) so a run is judged on regressions rather than on that baseline, seven raw sanity greps a human can eyeball, the auditor sweep routed from docs/agent-roster.md §3, and the stop-ship list. Use before every deploy or when asked whether the site is ready to ship. Triggers: "run the build gate", "is this ready to ship", "pre-deploy check", "QA the site", "verify the build", "מוכן לעלות לאוויר", "בדיקה לפני פריסה".
allowed-tools: Read, Grep, Glob, Bash
---

# Build gate

Everything here runs against `out/` — the artifact that actually ships. A passing `npm run build` is
the start of the gate, not the end. Two rules frame every step:

- **Rebuild before asserting (backlog N12).** `scripts/audit/run-all.mjs` refuses a stale export:
  if anything under `app/ components/ lib/ public/` is newer than `out/index.html` it exits without
  measuring. Numbers from an old `out/` describe a build nobody shipped.
- **Judge on regressions, not on the baseline.** `npm run audit` does not exit 0 today and will not
  until Sprint 7 rewrites the posts (§Known baseline — 1 as of 2026-11-09). A gate run passes when every failure it prints is in that table
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
`scripts/audit/thresholds.json`, `devBuildFiles` in `edge.mjs`); as of 2026-11-09 (after the
Sprint 6 content, `7c3f2db`) a clean export is 9.96 MB in 137 files (the live-kit surfaces added
≈1.15 MB in 2026-10, the service depth copy ≈0.7 MB and the location and index-page copy ≈1.3 MB in
HTML and RSC payloads), 30 JS chunks totalling 762 KB, largest 173 KB.

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

### Known baseline — as of 2026-11-09 (post-Sprint 6 content), `npm run audit` exits 1

Re-cut from `npm run audit -- --scope full` on 2026-11-09 against the current `out/` (source tree
at `7c3f2db`, the Sprint 6 location and index-page content). The previous baseline was 5 the same
day at `225ff45` (8 at `9195c9b`, 15 on 2026-11-08, 26 on 2026-09-06, 37 on 2026-08-23).
`content-depth` 5 → 1: the location floor (139–145 → 717–1022 unique / 350, median 842), the
location doorway delta (median 2 → 343.5 / 120), the areas-index floor (101 → 456 / 250) and the
about floor (320 → 1145 / 500) pass; the services index now passes on its own copy (336 → 1018).
Everything else moved only by design (home 1765 → 1770, `serviceMedianDelta` 438 → 436 with the
service pages' city link labels now built on `prefixed`, posts 442–577 → 447–582, `chromeLinks`
28 → 34 with the full footer, `faqPages` 8 → 26 with the city FAQs). Every other check still passes
exactly as before.

| Check                 | Fails | What is failing                                                                                                                                                                                                                                                                | Expected until                     |
| --------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `content-depth`       | 1     | the post floor: 11 posts 447–582/900. ✅ since `7c3f2db`: the 18 locations (floor and delta), the areas index and `/אודות/`; since `225ff45`: the 7 services (floor and delta). The post answer-block warning (11/11, 1 word — the date) stays                                 | posts Sprint 7 (§3.8, §3.10, §6.2) |
| `claims-grep`         | 0     | ✅ since `1796ee7` (§7.2, §7.6) — `failingClaims` 5 → 0, every `liveOccurrences` 0 over `claimsChecked 14` (`workmanship-absolute` added in `9195c9b`); `totalHits 1` is the gated rating row in `Reviews.tsx`. It reads `<main>` text only — see the bundle note under Step 3 | keep at 0                          |
| `schema`              | 0     | ✅ since `d8edb28` (§4.2, §4.4–§4.9, §4.12, N2) — `danglingIds` 18 → 0, `rawHebrewUrls` 18 → 0, `WebSite` on `/`, `Service` on 18 locations; 0 warnings                                                                                                                        | keep at 0                          |
| `a11y`                | 0     | ✅ since `68a4a7f` (§11.1–§11.3, N11, §8.1) — every contrast pair ≥ 5.42:1, lists intact, per-field `aria-invalid`; 0 warnings                                                                                                                                                 | keep at 0                          |
| `rtl-lint`            | 0     | ✅ since `7cfcf4c` (§11.5) — `bannedUtilities` 3 → 0, `hexLiterals` 7 → 0                                                                                                                                                                                                      | keep at 0                          |
| `titles`              | 0     | ✅ since `13a6bdc` (§1.5) — `ogUrlMissing` 45 → 0; 0 warnings since `74a92d1` (§2.4–§2.6, 24 → 0)                                                                                                                                                                              | keep at 0                          |
| `cta-coverage`        | 0     | ✅ since `fee7f69` (§13.2) — `missingDataCta` 24 → 0; the `/מחירון/` warning gone since `68a4a7f` (§8.5)                                                                                                                                                                       | keep at 0                          |
| `perf`                | 0     | ✅ since `13a6bdc` (§10.1, §10.3) — `fontPreloads` 0 → 2, `unusedDeps` → `[]`; the RSC-payload warning (§1.3) stays                                                                                                                                                            | keep at 0                          |
| `edge`                | 0     | ✅ since `a0e0fe2` (§1.1 ADR 0004, §12.1, §12.4/N5, N4) — 37 stubs → 72 real 301 rules, `_headers` owned, 0 dead-host artifacts; the `llms.txt` warning (§6.5) stays                                                                                                           | keep at 0                          |
| `export`              | 0     | pass — asserts `out/` is a current build of the source tree (N12)                                                                                                                                                                                                              | keep at 0                          |
| `links` · `spam-grep` | 0     | pass — their metrics are the regression watch-list below                                                                                                                                                                                                                       | keep at 0                          |

The ✅ rows are green **in the repo**. Sprint 1 is live (the 2026-10-12/13 deploys, probed
2026-11-08); Sprints 2, 3, 4, 5 and the Sprint 6 content are not deployed yet. `edge` in particular measures files, not
responses — the live probe is `deploy-dangates`'s job.

Phases are the "Suggested order of work" at the end of `docs/optimization-backlog.md`. When a
`docs/audits/<date>-full.md` report is newer than this table, the report wins — and this table
should be re-cut from it.

**Regression watch-list** (metrics in the `--json` output; any move in the wrong direction fails the
gate even though the check itself still passes): `links` → `orphans 0`, `brokenLinks 0`,
`linksToStubs 0`, `pagesNotExactlyOneH1 0`, `headingSkips 0`, `breadcrumbPages 44`,
`sitemapUrls 45`, `contentPages 46` (45 + the `noindex` `/תודה/`), `staticRoutesRegistered 10` ·
`titles` → `pages 46`, `uniqueTitles 46`, `uniqueDescriptions 46` ·
`titles` → 0 warnings (since `74a92d1`) ·
`spam-grep` → `spamHits 0`, `fusedWords 0`, `relatedTails 0`, `curlyQuotes 0`, `emojiCount 39` ·
`claims-grep` → `failingClaims 0`, `totalHits 1`, `claimsChecked 14`, every `liveOccurrences`
value 0 · `content-depth` → home `belowFloor 0` (1770 unique), pricing `belowFloor 0` (914 unique),
service `belowFloor 0` (median 1392 unique), location `belowFloor 0` (median 842 unique), services
index `belowFloor 0` (1018 unique), areas index `belowFloor 0` (456 unique), about `belowFloor 0`
(1145 unique), `locationMedianDelta 343.5`, `serviceMedianDelta 436`, `sharedParagraphs 1`, no
service or location row in the answer-block warning · `links` → `relatedServiceTargets 7`,
`notInChrome 0`, `chromeLinks 34`, no service-page monotony warning (the post-page one stays until
Sprint 7.3, `relatedPostTargets 5`) ·
`schema` → `pagesWithJsonLd 45`, `danglingIds 0`, `rawHebrewUrls 0`, `faqPages 26` · `perf` →
`largestJsBytes 172834`, `clientComponents 3` (`LeadForm`, `MobileMenu`, `Reveal`), `fontPreloads 2`,
`unusedDeps []`, `devBuildFiles 0`, `sourceMaps 0` · `rtl-lint` → `bannedUtilities 0`,
`hexLiterals 0` · `a11y` → `unlabeledControls 0`, `emptyLinks 0`, every `contrastPairs` value ≥ 4.5 ·
`titles` → `ogUrlMissing 0` · `cta-coverage` → `missingDataCta 0`, `ctaElements 125`,
`distinctTaggedElements 35` (113 / 24 after Sprint 1; 115 / 26 with the fleet live-kit's card —
CLAUDE.md §14; 119 / 30 with the pricing and thank-you CTAs of Sprint 3; 125 / 35 with Sprint 4's
pricing, FAQ link-out and complaints CTAs) · `edge` → `stubs 0`, `redirectRules 72`, `redirectsFile true`, `headersFile true`,
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
find out -name index.html | wc -l                                                  # 47 = 45 content + /תודה/ (noindex) + /404/ (was 83 while the 37 stubs shipped)
grep -c '<url>' out/sitemap.xml                                                    # 45
grep -rl 'aggregateRating\|"@type":"Review"' out --include=index.html | wc -l      # 0 — anything else is a stop-ship
grep -rl '"@type":"Person"' out --include=index.html | wc -l                       # 0 — no person exists; lib/authors.ts is an empty registry
grep -rl 'דן שערים חשמליים | דן שערים חשמליים' out --include=index.html | wc -l  # 0 — doubled brand suffix
find public -name index.html | wc -l                                               # 0 — stubs gone (ADR 0004); anything > 0 means one came back
grep -c ' 301$' public/_redirects                                                  # 72 — the real 301s that replaced them
```

**The client bundle is not in any script's scope.** `claims-grep` reads `<main>` text, and
`site.config.json` is bundled whole into a JS chunk, so a roster string no page renders still
ships. Since `ad2f1ab` (2026-11-09) the roster `shortPitch` carries none of the four claims;
`grep -rl 'אחריות מלאה\|24/7' out/_next/static | wc -l` → 0, and
`grep -rl 'פריסה ארצית' out/_next/static | wc -l` → 1, the manifest `areaServed`
"מרכז הארץ ופריסה ארצית" — expected until the owner answers B5 (owner-actions 3.6); any other hit
is a new roster claim.

Do not grep for a bare `"author"` here: all 11 `BlogPosting` nodes carry an `Organization` author by
design (CLAUDE.md §8), so that count is 11, not 0. The invented-byline assertion is `Person` = 0.
Use `find out -path '*מדריכים*'`-style paths rather than Hebrew globs — Git Bash glob expansion over
UTF-8 directory names is unreliable on Windows.

If the route count moves, reconcile before shipping: since §1.4 closed (2026-09-06) the ten static routes (nine indexable + the `noindex` `/תודה/`) are the `staticPages` registry in `lib/site-config.ts`, and `links.mjs` fails on any `app/` route missing from it or any registered route with no page — `staticRoutesRegistered` is the mechanical catch, this grep is the eyeball.

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
| a `/מדריכים/` guide (Phase 4)                  | `article-auditor` → `hebrew-editor` → `claims-verifier` | `content-depth.mjs`, `schema.mjs`, `links.mjs` |
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
