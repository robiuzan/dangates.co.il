---
name: audit
description: Run the site audit for one scope — clean rebuild, `node scripts/audit/run-all.mjs --scope <x>` for the numbers, the scope's read-only auditor agents in parallel for the judgment, one dated report in docs/audits/<date>-<scope>.md from the template, and backlog statuses updated only where a command output proves it. Never edits site code and never deploys. Use when asked where the site stands, before planning a phase, or after one ships. Triggers: "/audit", "audit the site", "בדיקת האתר", "where do we stand", "run the auditors", "מה מצב האתר".
argument-hint: "full | seo | schema | content | cro | security | perf | a11y"
allowed-tools: Read, Grep, Glob, Bash, Write, Agent
---

# /audit [scope]

Two sources, always both: the deterministic numbers from `scripts/audit/` (§2 of the report) and the
auditor agents' judgment (§3). A finding with no script line and no `file:line` is an opinion and
does not go in. The report is the memory of the improvement loop (`docs/audits/README.md`); the
SessionStart hook prints its verdict line, and `/improve <id>` reads its backlog ids.

The saved workflow `.claude/workflows/site-audit.js` (`/site-audit`, `args = { scope, date }`) runs
the same three stages as a deterministic script; prefer it when workflows are available. This skill
is the same procedure driven from the main session.

## Scope → checks → agents

| Scope      | `run-all.mjs` checks                    | Agents (all read-only)                                                                                                                                                            |
| ---------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `full`     | everything except `env-doctor`          | seo-auditor · schema-auditor · local-seo-strategist · aeo-geo-strategist · eeat-trust-auditor · perf-a11y-auditor · security-auditor · ts-react-reviewer · cro-engagement-auditor |
| `seo`      | titles · links · content-depth          | seo-auditor · local-seo-strategist                                                                                                                                                |
| `schema`   | schema                                  | schema-auditor                                                                                                                                                                    |
| `content`  | content-depth · spam-grep · claims-grep | eeat-trust-auditor · aeo-geo-strategist · local-seo-strategist                                                                                                                    |
| `cro`      | cta-coverage                            | cro-engagement-auditor                                                                                                                                                            |
| `security` | edge · spam-grep                        | security-auditor                                                                                                                                                                  |
| `perf`     | perf                                    | perf-a11y-auditor · ts-react-reviewer                                                                                                                                             |
| `a11y`     | a11y · rtl-lint                         | perf-a11y-auditor · ts-react-reviewer                                                                                                                                             |

Default scope is `full`. An unknown scope is refused by `run-all.mjs` itself — do not improvise one.
Models and tools per agent: `docs/agent-roster.md` §1.

## Procedure

### 0. Resolve scope, date, previous report

- Date = today, `YYYY-MM-DD` (the session context carries it; otherwise
  `node -e "console.log(new Date().toISOString().slice(0,10))"`). A second run on the same day and
  scope is `<date>-<scope>-2.md`.
- Previous report = the newest `docs/audits/*-<scope>.md` (`ls docs/audits/ | sort`). None → the Δ
  section says "baseline".
- Commit = `git rev-parse --short HEAD`.

### 1. Clean rebuild (N12: rebuild before asserting)

```bash
node -e "require('fs').rmSync('.next',{recursive:true,force:true})" && npm run build
```

`rm -rf` is blocked by `guard-destructive-ops.ps1`; the `node -e` form is the sanctioned one.
`run-all.mjs` refuses a stale `out/`, so a skipped rebuild fails loudly, not silently.

### 2. The numbers

```bash
node scripts/audit/run-all.mjs --scope <scope>; echo "exit=$?"
```

Call `node` directly (not `npm run audit`) so the exit code is the failure count and the output
carries no npm noise. Keep the whole markdown — it is pasted verbatim into §2 — and note the
`export` check's "out/ built <timestamp>" line for the header.

### 3. The judgment — auditors in parallel

Launch every agent in the scope's row **in one message, one `Agent` call each**, `subagent_type` =
the agent name. Sequential launches waste the wall-clock the fan-out exists to save. Each prompt:

> Scope `<scope>`, report date `<date>`. `run-all.mjs` exited `<n>`; per-check line:
> `<the **scope … failure(s)** line>`. Re-measure per your `## Baseline — re-measure first` block —
> do not trust these numbers second-hand. Return (a) findings as rows
> `| # | Finding | Evidence | Backlog | Fix owner |` grouped Critical / High / Medium / Low per
> `docs/audits/_template.md` — one row per root cause with an instance count, every row a backlog id
> (`§x.y` or `Nn`, or `NEW` if none fits) and a `file:line` or a command whose output proves it;
> (b) owner-blocked rows `| Item | Blocked on | Where documented |`; (c) a one-line turn summary.
> Read-only: do not edit, rebuild or deploy.

### 4. Write `docs/audits/<date>-<scope>.md`

Copy `docs/audits/_template.md` and fill every section, "none" where empty:

- **Verdict** — one sentence, first bold line after the title (the hook greps `^\*\*Verdict`).
- **Previous report / Export built / Commit** from step 0 and step 2.
- **§1 Δ vs previous** — fixed / regressed / new, by backlog id. Baseline if no previous report.
- **§2** — the step-2 markdown verbatim, plus the exit code.
- **§3 Findings** — merge the agents' rows: dedupe by root cause (two agents naming the same
  `text-right` triple is one row, count 3), keep the strongest evidence, keep the backlog id, set
  **Fix owner** from `docs/agent-roster.md` §3 (the writer for that section; "owner" when blocked).
  A row with no evidence is dropped, not softened.
- **§4 Owner-blocked** — listed, not re-argued; cite `docs/business-facts.md` §A–H or
  `docs/owner-actions.md`.
- **§5 Backlog updates** — exactly what step 5 changed.
- **§6 Next up** — three `/improve` targets in order, one-line reason each.
- **Agents run** — one row per agent with its turn summary; an agent that returned nothing is
  listed as "no return" so the gap is visible.

### 5. Update `docs/optimization-backlog.md` — with proof only

- A status tag moves (`NOT STARTED` → `PARTIAL` / `✅ DONE`, or back to `NOT STARTED` on a
  regression) **only** when a command output in this run proves it. Write the command and its
  output into the item, e.g. `Verified 2026-08-24 by \`node scripts/audit/rtl-lint.mjs\` →
  bannedUtilities: 0`.
- A finding with no id gets a new `### N<next> — P<n> · <effort> · [NOT STARTED] <title>` under
  §14 (`grep -o '^### N[0-9]*' docs/optimization-backlog.md | tail -1` gives the last number) and
  the report row is re-labelled with it. `§15.2` flips to `✅ DONE` on the first report.
- Never touch the item text, priorities or the "Suggested order of work" — that is `/improve`'s and
  the maintainer's job.

### 6. Print

Verdict, the report path, the §6 next-up list, and the sentence "nothing was deployed; run
`/improve <id>` next". Stop.

## Rules

- **Never edit site code** (`app/`, `components/`, `lib/`, `public/`, `scripts/`) — an audit that
  fixes things has no before/after. Only `docs/audits/` and `docs/optimization-backlog.md` change.
- **Never invent a number.** Every count comes from a script line in §2 or a command an agent quoted.
  "As of <date>" on every figure carried into prose.
- **A report with no §2 script output is invalid** — delete it rather than file it.
- **The script decides** when an agent and a script disagree (`docs/agent-roster.md` intro). An
  agent that reports a C1–C5 history item (reviews live, doubled titles, spam, zero breadcrumbs, 26
  pages without JSON-LD) as a live finding is wrong — check `schema.mjs` / `titles.mjs` /
  `spam-grep.mjs` / `links.mjs` and drop the row.
- Hebrew in paths and quoted Hebrew stay as written — no transliteration, גרש ׳ / גרשיים ״ in prose.

## Known baseline — as of 2026-08-23

`node scripts/audit/run-all.mjs --scope full` → **37 failures across 10 checks**: titles 1 ·
content-depth 10 · schema 5 · cta-coverage 5 · claims-grep 5 · rtl-lint 2 · a11y 4 · perf 1 · edge
4; links and spam-grep pass. Which of these are expected until which phase is the table in
`/qa-build-gate`; the first `/audit full` report is the baseline every later Δ is measured against.
Re-run the script — this paragraph is context, not the source of truth.

## Gotchas

- `run-all.mjs` needs `out/` newer than every file under `app/ components/ lib/ public/` — a stray
  `touch` or a formatter pass after the build makes it refuse. Rebuild, don't argue.
- The auditors' own `## Baseline` blocks re-run the scripts — that is by design (independent
  re-measurement), not waste. Do not tell them to skip it.
- `claims-grep.mjs` counts source hits; the same claim can be one row in the report with a count,
  not 77 rows.
- Two runs on one day: name the second `-2`, never overwrite — the hook prints the newest by name.
- Unicode paths in Bash need quoting: `"docs/audits/2026-08-24-full.md"` is safe;
  `"out/איזורי-שירות/index.html"` needs the quotes.
