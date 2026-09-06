---
name: qa-build-gate
description: The release gate before any deploy on dangates — Step 0 `npm run audit:env`, a clean rebuild that clears `.next/` the hook-approved way, `npm run gate` (lint → typecheck → format:check → build → audit) read against the known-baseline table so a run is judged on regressions rather than on the 37 expected failures, four raw sanity greps a human can eyeball, the auditor sweep routed from docs/agent-roster.md §3, and the stop-ship list. Use before every deploy or when asked whether the site is ready to ship. Triggers: "run the build gate", "is this ready to ship", "pre-deploy check", "QA the site", "verify the build", "מוכן לעלות לאוויר", "בדיקה לפני פריסה".
allowed-tools: Read, Grep, Glob, Bash
---

# Build gate

Everything here runs against `out/` — the artifact that actually ships. A passing `npm run build` is
the start of the gate, not the end. Two rules frame every step:

- **Rebuild before asserting (backlog N12).** `scripts/audit/run-all.mjs` refuses a stale export:
  if anything under `app/ components/ lib/ public/` is newer than `out/index.html` it exits without
  measuring. Numbers from an old `out/` describe a build nobody shipped.
- **Judge on regressions, not on the baseline.** `npm run audit` does not exit 0 today and will not
  until Phase 6 (§Known baseline). A gate run passes when every failure it prints is in that table
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
`scripts/audit/thresholds.json`, `devBuildFiles` in `edge.mjs`); as of 2026-08-23 a clean export is
5.4 MB, 29 JS chunks totalling 751 KB, largest 173 KB.

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

### Known baseline — as of 2026-08-23, `npm run audit` exits 37

| Check                 | Fails | What is failing                                                                                                                      | Expected until                                                 |
| --------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `titles`              | 1     | `og:url` missing on 45/45 pages                                                                                                      | Phase 1 (§1.5)                                                 |
| `content-depth`       | 10    | floors: home, about, pricing, both indexes, 18 locations, 7 services, 11 posts · doorway delta < 120 on all 18 + 7                   | Phase 3 (§3.1, §3.2, §3.13); posts Phase 4 (§3.8, §3.10)       |
| `schema`              | 5     | no `WebSite` · 18 locations emit no `Service` · `#business` dangling on 18 pages · raw Hebrew in `url` ×7 and `mainEntityOfPage` ×11 | Phase 2 (§4.2 substance, §4.4, §4.7/N2, §4.9)                  |
| `cta-coverage`        | 5     | 24 page-instances without `data-cta` (call 8, WhatsApp 10, email 2, submit 2, contact-link 2)                                        | Phase 1 (§13.2); form elements Phase 5                         |
| `claims-grep`         | 5     | live unconfirmed: warranty-full 77, around-the-clock 75, experience 9, national-coverage 7 · superlative 2                           | Phase 6 (§7.2) · superlative: `/new-article` cleanup, any time |
| `rtl-lint`            | 2     | 3 banned physical utilities · 8 hex literals on 5 lines                                                                              | Phase 1 (§11.5, N11)                                           |
| `a11y`                | 4     | `Process.tsx` list broken by `Reveal` · LeadForm `noValidate` without `aria-invalid` · accent hover 2.76:1 · WhatsApp 1.98:1         | Phase 1 (§11.1, §11.2); form Phase 5 (§8.1)                    |
| `perf`                | 1     | 6 `.woff2` shipped, 0 font preloads                                                                                                  | Phase 1 (§10.1)                                                |
| `edge`                | 4     | 37 meta-refresh stubs, no `_redirects` · no `_headers` · 3 dead-host artifacts · 1 foreign (Houston) stub                            | Phase 1 (§1.1 ADR 0004, §12.1, §12.4/N5, N4)                   |
| `links` · `spam-grep` | 0     | pass — their metrics are the regression watch-list below                                                                             | keep at 0                                                      |

Phases are the "Suggested order of work" at the end of `docs/optimization-backlog.md`. When a
`docs/audits/<date>-full.md` report is newer than this table, the report wins — and this table
should be re-cut from it.

**Regression watch-list** (metrics in the `--json` output; any move in the wrong direction fails the
gate even though the check itself still passes): `links` → `orphans 0`, `brokenLinks 0`,
`linksToStubs 0`, `pagesNotExactlyOneH1 0`, `headingSkips 0`, `breadcrumbPages 44`,
`sitemapUrls 45` = `contentPages 45` · `titles` → `uniqueTitles 45`, `uniqueDescriptions 45` ·
`spam-grep` → `spamHits 0`, `fusedWords 0`, `relatedTails 0`, `curlyQuotes 4` · `claims-grep`
`liveOccurrences` → `rating 0`, `named-person 0`, `licence 0`, `insurance 0`, `founded 0` ·
`schema` → `pagesWithJsonLd 45`, `danglingIds ≤ 18`, `rawHebrewUrls ≤ 18` · `perf` →
`largestJsBytes`, `fontPreloads`, `devBuildFiles 0` · `rtl-lint` → `bannedUtilities ≤ 3`,
`hexLiterals ≤ 8`.

## Step 3 — raw sanity greps (for a human, after the scripts)

```bash
find out -name index.html | wc -l                                                  # 83 = 45 content + 37 stubs + /404/
grep -c '<url>' out/sitemap.xml                                                    # 45
grep -rl 'aggregateRating\|"@type":"Review"' out --include=index.html | wc -l      # 0 — anything else is a stop-ship
grep -rl '"@type":"Person"' out --include=index.html | wc -l                       # 0 — no person exists; lib/authors.ts is Phase 6
grep -rl 'דן שערים חשמליים | דן שערים חשמליים' out --include=index.html | wc -l  # 0 — doubled brand suffix
find public -name index.html | wc -l                                               # 37 stubs — until ADR 0004 replaces them
```

Do not grep for a bare `"author"` here: all 11 `BlogPosting` nodes carry an `Organization` author by
design (CLAUDE.md §8), so that count is 11, not 0. The invented-byline assertion is `Person` = 0.
Use `find out -path '*מדריכים*'`-style paths rather than Hebrew globs — Git Bash glob expansion over
UTF-8 directory names is unreliable on Windows.

If the route count moves, reconcile before shipping: since §1.4 closed (2026-09-06) the nine static routes are the `staticPages` registry in `lib/site-config.ts`, and `links.mjs` fails on any `app/` route missing from it or any registered route with no page — `staticRoutesRegistered` is the mechanical catch, this grep is the eyeball.

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
- A route in `out/` missing from `sitemap.xml`, `brokenLinks` > 0, or a stub whose target no longer
  resolves (`linksToStubs`, and `node scripts/gen-redirects.mjs` leaving `public/` dirty).
- Any file over 1 MB under `out/_next/`, or `devBuildFiles` > 0.
- A route count that moved with no reconciled reason.
- A GTM container id change without the `https://www.googletagmanager.com/gtm.js?id=<ID>` → 200
  check (golden rule 8).

## Then

`/deploy-dangates` — `ops/deploy-site.ps1 -DryRun` first, every time; the real deploy needs the
user's go-ahead, `-Confirm` **and** a trailing `# APPROVED: <reason>` on the same command. **Pushing
to `main` publishes to GitHub Pages, which nobody sees** (CLAUDE.md §10).

## Gotchas

- `run-all` refusing to run is a message, not a bug: rebuild (Step 1) and re-run.
- The guard hook matches the recursive-delete _string_ anywhere in a command — including inside a
  grep pattern or a comment. Keep it out of the command line entirely.
- Windows PowerShell 5.1 has no `&&`; chain with `;` or `if ($?) { … }`. The Bash tool is fine for
  the `&&` forms above.
- `--json` for comparison across runs (the `docs/audits/` Δ section), the markdown for reading.
- `format:check` failing on a file you did not touch means the Stop hook was skipped in an earlier
  turn — `npm run format`, then re-run the gate.
