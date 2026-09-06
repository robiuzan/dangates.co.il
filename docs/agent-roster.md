# Agent roster — who does what on dangates.co.il

The routing table for the `.claude/` environment. `/improve` resolves a backlog id through §3;
`/audit` fans out the auditors in §1. `scripts/audit/env-doctor.mjs` checks that every name here
exists on disk.

**Three kinds of asset, three jobs.** Agents carry _judgment_ and run with restricted tools (most are
read-only). Skills carry _procedure_ — the repeatable steps, acceptance bars and gotchas for one kind
of change. Scripts carry _measurement_ — deterministic numbers with an exit code. When a skill and an
agent disagree, the script decides.

---

## 1. Agents (`.claude/agents/`)

| Agent                    | Model  | Tools                                                                                                                | Mode                                                                                     | Owns                                                                                                            | Invoke with                                           |
| ------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `seo-auditor`            | sonnet | Read Grep Glob Bash WebFetch                                                                                         | read-only                                                                                | technical + on-page SEO of `out/`: titles, canonicals, H1s, sitemap parity, stubs, thin pages                   | "SEO audit", "check the metadata"                     |
| `schema-auditor`         | sonnet | Read Grep Glob Bash WebFetch                                                                                         | read-only                                                                                | the JSON-LD graph vs `docs/schema-graph.md`                                                                     | "schema audit", "validate the JSON-LD"                |
| `local-seo-strategist`   | opus   | Read Grep Glob Bash WebFetch                                                                                         | read-only                                                                                | NAP, the 7×18 matrix, ב+city grammar, doorway risk, GBP as the blocked lever                                    | "local SEO plan", "will these city pages rank"        |
| `aeo-geo-strategist`     | opus   | Read Grep Glob Bash WebFetch                                                                                         | read-only                                                                                | AI-crawler reachability, answer blocks, citability, freshness, llms.txt                                         | "AEO audit", "will ChatGPT cite us"                   |
| `eeat-trust-auditor`     | opus   | Read Grep Glob Bash WebFetch                                                                                         | read-only                                                                                | every experience/expertise/authority/trust claim traced to a source                                             | "EEAT audit", "trust gaps"                            |
| `perf-a11y-auditor`      | sonnet | Read Grep Glob Bash WebFetch                                                                                         | read-only                                                                                | Core Web Vitals + WCAG 2.1 AA / IS 5568 on the export                                                           | "perf audit", "a11y audit", "בדיקת נגישות"            |
| `security-auditor`       | sonnet | Read Grep Glob Bash WebFetch                                                                                         | read-only                                                                                | headers the repo doesn't own, CSP path, form PII, secrets, the dead second origin                               | "security audit", "is the form safe"                  |
| `ts-react-reviewer`      | sonnet | Read Grep Glob Bash                                                                                                  | read-only                                                                                | RSC boundaries, strict TS, static-export safety, RTL utilities, hex                                             | "review this component", "TS/React check"             |
| `cro-engagement-auditor` | sonnet | Read Grep Glob Bash                                                                                                  | read-only                                                                                | `data-cta` coverage, form error/consent/thank-you, CTA per page type, TOC, FAQ-in-DOM, event taxonomy           | "CRO audit", "why aren't leads tracked"               |
| `claims-verifier`        | sonnet | Read Grep Glob Bash WebFetch                                                                                         | read-only · **reviewer**                                                                 | every claim in a diff → a `business-facts.md` row; schema ↔ visible copy parity; 🔶 live = stop-ship            | "verify the claims", "fact-check this copy"           |
| `hebrew-editor`          | opus   | Read Grep Glob Bash                                                                                                  | read-only · **reviewer**                                                                 | second-pass Hebrew proofreading of new copy: register, גרשיים, scannability, ב+city grammar, answer-block shape | "edit this copy", "הגהה"                              |
| `article-auditor`        | opus   | Read Grep Glob Bash                                                                                                  | read-only · **reviewer**                                                                 | pre-publish gate for a `/מדריכים/` guide: 900 unique words, answer block, table, cannibalisation, mesh          | "is this guide publishable"                           |
| `keyword-researcher`     | opus   | Read Grep Glob Bash WebSearch WebFetch Edit                                                                          | edits **only** `docs/keyword-map.md` §13, `docs/competitors.md`, `docs/rank-tracking.md` | evidence-only keyword & SERP discovery; never a volume without a source                                         | "find keywords for…", "what do competitors rank for"  |
| `hebrew-copywriter`      | opus   | Read Edit Write Grep Glob Bash · skills: hebrew-rtl new-city new-service new-guide                                   | **writer**                                                                               | Hebrew copy into `lib/content.ts`, `lib/posts.ts`, `content/guides/` — never JSX; never a fact                  | "write the copy for…", "deepen this page"             |
| `rtl-frontend-engineer`  | sonnet | Read Edit Write Bash Grep Glob · skills: hebrew-rtl internal-linking schema-structured-data responsive-accessibility | **writer**                                                                               | components, routes, schema wiring, forms, navigation; runs `npm run gate` before handing back                   | "build…", "fix the form", "add the breadcrumb schema" |

Read-only agents **report**; they never edit, rebuild or deploy. Writers hand every copy change to
`hebrew-editor` → `claims-verifier`, and every markup change to `ts-react-reviewer`, before it ships.

---

## 2. Skills (`.claude/skills/`)

| Skill                                      | Kind                                     | One line                                                                                                  |
| ------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `dangates-architecture`                    | orientation                              | start here — data flow, file map, static-export limits, the environment map                               |
| `audit`                                    | **command** `/audit [scope]`             | clean build → `npm run audit` → auditors in parallel → `docs/audits/<date>-<scope>.md` → backlog statuses |
| `improve`                                  | **command** `/improve <id>`              | backlog id → this table → implement → `npm run gate` → reviewers → backlog row                            |
| `qa-build-gate`                            | gate                                     | `npm run audit:env`, clean rebuild, `npm run gate`, the auditor sweep, stop-ship list                     |
| `deploy-dangates`                          | procedure                                | `ops/deploy-site.ps1 -DryRun` → `-Confirm` + `# APPROVED:`; rollback; post-deploy checks                  |
| `seo-metadata`                             | reference                                | title/description/canonical formulas; no doubled brand; sitemap from data                                 |
| `schema-structured-data`                   | procedure                                | the kit builders, `lib/jsonld.ts` extensions, `@graph`, what stays absent until sourced                   |
| `local-seo-il`                             | doctrine                                 | NAP, the matrix cap, region grammar, doorway policy, GBP                                                  |
| `aeo-answer-content`                       | procedure                                | answer blocks, citable substance, per-bot robots target, `templates/llms.txt`                             |
| `eeat-build`                               | procedure                                | build authority without a named person; everything gated on business-facts                                |
| `keyword-research`                         | procedure                                | evidence-only discovery; candidate table; GSC ingest cadence                                              |
| `content-hub`                              | doctrine                                 | the 5 pillars, "does it earn a page", anti-cannibalisation throws, `moreAt` contract, calendar            |
| `new-guide`                                | **command** `/new-guide <family> <slug>` | one parameterized skill for symptom / component / brand / comparison / safety / committee pages           |
| `new-city` · `new-service` · `new-article` | procedure                                | data-driven page families (`locations`, `services`, the 11 legacy posts)                                  |
| `internal-linking`                         | procedure                                | header/footer reach, service↔location mesh, relevance-based related, reverse index, zero orphans          |
| `engagement-ux`                            | procedure                                | TOC, `<details>` FAQ, readability bar, CTA placement, engagement events, no pop-ups                       |
| `conversion-cro`                           | procedure                                | click-to-call, sticky bar, form validation/consent/thank-you, honest-trust gate                           |
| `tracking-analytics`                       | procedure                                | GTM head placement, `data-cta`, event taxonomy, the gtm.js 200-check                                      |
| `performance-web-vitals`                   | reference                                | text-only LCP, preloads, JS budget, the kit image pipeline                                                |
| `site-images`                              | procedure                                | the photo pipeline when photos arrive: catalog → `sync-media` → `SiteImage`, alt bar, `ImageObject`       |
| `responsive-accessibility`                 | reference                                | WCAG 2.1 AA + IS 5568; contrast, targets, focus, landmarks, the statement's truth                         |
| `web-security-headers`                     | procedure                                | `templates/_headers`, report-only CSP path, `_redirects` cutover, dead-origin retirement                  |
| `hebrew-rtl`                               | mandatory                                | logical utilities, LTR islands, Israeli formats, גרש/גרשיים, the encoded-slug trap                        |
| `i18n-locale-architecture`                 | reference                                | why English is not recommended yet, what evidence would change that, the architecture if it ships         |
| `sprint`                                   | **command** `/sprint <n>`                | `implementation-sprints.md` row → `/improve` each id → gate after every item → `/audit`; never deploys    |

---

## 3. Routing — backlog section → skill → writer → reviewer → proof

| Backlog                                                 | Skill(s)                                           | Writer                                                                     | Reviewer(s)                                                | Proof                                                   |
| ------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| §1 technical SEO (`_redirects`, sitemap, og:url, stubs) | web-security-headers · seo-metadata                | rtl-frontend-engineer                                                      | seo-auditor                                                | `edge.mjs`, `titles.mjs`, `links.mjs`                   |
| §2 metadata                                             | seo-metadata                                       | hebrew-copywriter (descriptions) · rtl-frontend-engineer (routes)          | seo-auditor · hebrew-editor                                | `titles.mjs`                                            |
| §3 content depth (locations, services, blog, static)    | new-city · new-service · new-article · content-hub | hebrew-copywriter                                                          | hebrew-editor → claims-verifier → (guides) article-auditor | `content-depth.mjs`, `claims-grep.mjs`, `spam-grep.mjs` |
| §4 structured data                                      | schema-structured-data                             | rtl-frontend-engineer                                                      | schema-auditor                                             | `schema.mjs`                                            |
| §5 local SEO                                            | local-seo-il · new-city                            | hebrew-copywriter                                                          | local-seo-strategist · claims-verifier                     | `content-depth.mjs`                                     |
| §6 AEO / GEO                                            | aeo-answer-content · content-hub · new-guide       | hebrew-copywriter · rtl-frontend-engineer (`robots.ts`, `llms.txt`)        | aeo-geo-strategist · article-auditor                       | `content-depth.mjs` (answer block), `schema.mjs`        |
| §7 E-E-A-T & trust                                      | eeat-build · site-images                           | hebrew-copywriter · rtl-frontend-engineer (`lib/authors.ts`, About schema) | eeat-trust-auditor · claims-verifier                       | `claims-grep.mjs`, `schema.mjs`                         |
| §8 conversion                                           | conversion-cro · engagement-ux                     | rtl-frontend-engineer                                                      | cro-engagement-auditor · perf-a11y-auditor                 | `cta-coverage.mjs`, `a11y.mjs`                          |
| §9 navigation & linking                                 | internal-linking                                   | rtl-frontend-engineer                                                      | seo-auditor                                                | `links.mjs`                                             |
| §10 performance                                         | performance-web-vitals                             | rtl-frontend-engineer                                                      | perf-a11y-auditor                                          | `perf.mjs`                                              |
| §11 accessibility                                       | responsive-accessibility · hebrew-rtl              | rtl-frontend-engineer                                                      | perf-a11y-auditor · ts-react-reviewer                      | `a11y.mjs`, `rtl-lint.mjs`                              |
| §12 security                                            | web-security-headers                               | rtl-frontend-engineer                                                      | security-auditor                                           | `edge.mjs`, `spam-grep.mjs`                             |
| §13 analytics                                           | tracking-analytics · engagement-ux                 | rtl-frontend-engineer                                                      | cro-engagement-auditor                                     | `cta-coverage.mjs` + the gtm.js 200-check               |
| N-items (new defects)                                   | per the item's section above                       |                                                                            |                                                            |                                                         |
| keyword expansion (`keyword-map.md` §8)                 | keyword-research → content-hub → new-guide         | keyword-researcher (docs) → hebrew-copywriter (copy)                       | article-auditor · claims-verifier                          | `content-depth.mjs`, `schema.mjs`                       |

**Ask → route, when there is no backlog id:** "why don't we rank" → `/audit seo` · "more keywords" →
`keyword-research` · "write a page about X" → `content-hub` (does it earn a page?) then `new-guide` ·
"the form is broken" → `conversion-cro` → rtl-frontend-engineer · "is this safe" → security-auditor ·
"ship it" → `qa-build-gate` then `deploy-dangates` · "what should the owner do" → `docs/owner-actions.md` ·
"what do we do next, in what order" → `docs/implementation-sprints.md` then `/sprint <n>` · "add
English" → `i18n-locale-architecture` · "is this allowed on the site" → the standards doc in §7 below.

---

## 4. Scripts (`scripts/audit/`)

| Script              | Scope(s)         | Measures                                                                                            |
| ------------------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| `run-all.mjs`       | —                | runs the set for a scope; refuses a stale `out/`; exit code = failures                              |
| `titles.mjs`        | seo              | unique titles, brand once, description length/punctuation, canonical = sitemap, og:url              |
| `links.mjs`         | seo              | orphans, chrome reach, sitemap parity, one H1, heading order, breadcrumbs, broken links             |
| `content-depth.mjs` | seo content      | word floors inside `<main>`, doorway delta vs nearest sibling, answer-block length, shared blocks   |
| `schema.mjs`        | schema           | required types per route, dangling `@id`, raw Hebrew URLs, forbidden-until-sourced keys, FAQ parity |
| `cta-coverage.mjs`  | cro              | `data-cta` on every tel / WhatsApp / mailto / submit; pages with no CTA                             |
| `claims-grep.mjs`   | content          | the `claims.json` lexicon vs business-facts status, in source and in the export                     |
| `spam-grep.mjs`     | content security | spam tokens, fused words, emoji, curly quotes, dead "פוסטים קשורים"                                 |
| `rtl-lint.mjs`      | a11y             | banned physical utilities, hex literals, `"use client"` inventory                                   |
| `a11y.mjs`          | a11y             | alt, labels, empty links, landmarks, Process/Faq/Header/LeadForm source checks, contrast ratios     |
| `perf.mjs`          | perf             | `out/` weight, JS budget, font preloads, RSC payloads, unused deps                                  |
| `edge.mjs`          | security         | `_redirects`, `_headers`, dead-host artifacts, foreign stubs, `llms.txt`, `.env.example` drift      |
| `env-doctor.mjs`    | env              | dead `file:line` citations, frontmatter lint, `Skill()` allow parity, hooks, deny set, this roster  |
| `gsc-ingest.mjs`    | —                | Search Console CSV → `docs/rank-tracking.md` monthly table (blocked until the token lands)          |

`npm run audit [-- --scope x]` · `npm run audit:env` · `npm run gate` (lint → typecheck → format:check
→ build → audit). Thresholds: `scripts/audit/thresholds.json`. Lexicon: `scripts/audit/claims.json`.

---

## 5. Hooks and rules (`.claude/hooks/`, `.claude/rules/`)

| Hook                        | Event                      | Does                                                                                                                   |
| --------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `guard-protected-paths.ps1` | PreToolUse Edit/Write      | denies `site.config.json`, `out/`, `out.prev/`, `vendor/`, `node_modules/`, `.next/`, `public/**/index.html`           |
| `secret-scan.ps1`           | PreToolUse Edit/Write      | blocks credential-shaped strings (public fleet values allow-listed)                                                    |
| `guard-destructive-ops.ps1` | PreToolUse Bash/PowerShell | blocks force-push / reset --hard / rm -rf / deploys / Cloudflare calls without `-DryRun` or `-Confirm` + `# APPROVED:` |
| `post-edit-lint.ps1`        | PostToolUse Edit/Write     | warns on banned utilities, hex, spam tokens, unconfirmed claims in the text just written                               |
| `audit-logger.ps1`          | PostToolUse                | `logs/audit.csv` trail                                                                                                 |
| `session-context.ps1`       | SessionStart               | backlog order, latest audit verdict, tree state, entry points                                                          |
| `format-changed.ps1`        | Stop                       | Prettier on changed files                                                                                              |

Rules: `protected-files.md` (always) · `rtl-markup.md` (`app/**/*.tsx`, `components/**/*.tsx`) ·
`content-data.md` (`lib/content.ts`, `lib/posts.ts`, `lib/site-config.ts`, `content/**`) ·
`schema-jsonld.md` (`app/**/page.tsx`, `PageHeader.tsx`, `lib/jsonld.ts`).

---

## 6. Conventions

- **Agent frontmatter:** `name`, `description`, `model`, `tools` in that order (fleet convention).
  The two writers additionally carry `skills:` (a documented deviation — it preloads the procedures
  they write against). `description` is one long line ending in the invocation phrases.
- **Skill frontmatter:** `name` + `description`; the four commands (`audit`, `improve`, `new-guide`,
  `sprint`) add `argument-hint`, and skills that run commands add `allowed-tools`. Supporting files live in `templates/` and `references/`.
- **Every skill has a `Skill(<name>)` entry** in `.claude/settings.json`; `env-doctor.mjs` enforces it.
- **Numbers are not hard-coded in prose.** An agent opens with a `## Baseline — re-measure first`
  block that runs the relevant script; the docs quote the latest `docs/audits/` report.
- **`file:line` citations must resolve** (`env-doctor.mjs`). Cite a function or a script when a line
  number would go stale.
- **Never fabricate.** A business fact not in the roster, `lib/site-config.ts` or a ✅ row of
  `docs/business-facts.md` is marked `🔶` and written around.

---

## 7. Standards and strategy docs — which skill implements, which agent audits, which script proves

The docs layer map is [README.md](README.md) (strategy → standards → state → operations). A
standards doc sets the bar; the skill in its row is the how-to; the agent audits against it; the
script decides. Every doc carries its own Enforcement map naming the same three.

| Doc                                                                  | Layer      | How-to skill(s)                                                                             | Audits against it                                       | Proof                                                                |
| -------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| [README.md](README.md)                                               | map        | `dangates-architecture`                                                                     | —                                                       | `env-doctor.mjs`                                                     |
| [seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md)                   | strategy   | `seo-metadata` · `local-seo-il` · `aeo-answer-content` · `content-hub` · `keyword-research` | seo-auditor · local-seo-strategist · aeo-geo-strategist | `titles.mjs` `links.mjs` `content-depth.mjs` `schema.mjs` `edge.mjs` |
| [eeat-and-trust.md](eeat-and-trust.md)                               | standards  | `eeat-build` · `site-images`                                                                | eeat-trust-auditor · claims-verifier                    | `claims-grep.mjs` `schema.mjs`                                       |
| [ux-cro-security.md](ux-cro-security.md)                             | standards  | `conversion-cro` · `engagement-ux` · `internal-linking` · `web-security-headers`            | cro-engagement-auditor · security-auditor · seo-auditor | `cta-coverage.mjs` `a11y.mjs` `edge.mjs` `links.mjs`                 |
| [performance-guidelines.md](performance-guidelines.md)               | standards  | `performance-web-vitals` · `site-images`                                                    | perf-a11y-auditor                                       | `perf.mjs`                                                           |
| [accessibility-and-i18n.md](accessibility-and-i18n.md)               | standards  | `responsive-accessibility` · `hebrew-rtl` · `i18n-locale-architecture`                      | perf-a11y-auditor · ts-react-reviewer                   | `a11y.mjs` `rtl-lint.mjs`                                            |
| [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) | standards  | `conversion-cro` · `responsive-accessibility` · `new-city`                                  | cro-engagement-auditor · perf-a11y-auditor              | `cta-coverage.mjs` `a11y.mjs` `rtl-lint.mjs`                         |
| [data-tracking-infrastructure.md](data-tracking-infrastructure.md)   | standards  | `tracking-analytics` · `engagement-ux`                                                      | cro-engagement-auditor                                  | `cta-coverage.mjs` `gsc-ingest.mjs` + the gtm.js 200-check           |
| [implementation-sprints.md](implementation-sprints.md)               | operations | `sprint` (→ `improve`) · `qa-build-gate`                                                    | the reviewers §3 names for each sprint's sections       | `env-doctor.mjs` + `npm run gate` + `/audit <scope>`                 |

Where a standards doc and a skill disagree, check the code, then fix the skill in the same change —
skills drift faster than standards. Where a doc and a script disagree, the script decides.
