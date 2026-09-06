---
name: sprint
description: Execute one sprint of docs/implementation-sprints.md end to end — resolve the sprint, walk its task rows in order, run each backlog id through the /improve procedure (skip ✅ DONE and ✅ HOLDS with a note, refuse ⏳ BLOCKED · owner and point at owner-actions), judge `npm run gate` against the known baseline after every item and stop on the first regression, then `/audit <scope>` and tick the sprint's exit criteria only where a command output proves it. Never deploys — Sprint 0 and every deploy step stop and hand to deploy-dangates on the owner's word; Track B is the owner's and is never run by an agent. Use when working the roadmap sprint by sprint. Triggers: "/sprint", "run sprint", "execute the sprint", "start sprint 1", "what is next in the plan", "הרץ ספרינט", "הספרינט הבא".
argument-hint: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9"
allowed-tools: Read, Grep, Glob, Bash, Skill, Agent
---

# /sprint <n>

One sprint per invocation, in the order [docs/implementation-sprints.md](../../../docs/implementation-sprints.md)
fixes, every item through `/improve`, every step proven by a script. The sprints doc decides _what
order and why_; this skill only walks it. `/improve` owns the per-item routing, gate and reviewers;
`/audit` owns the report; `deploy-dangates` owns production. This skill adds nothing to those three
except the loop and the stop rule.

## 1. Resolve the sprint

```bash
grep -n -E '^## Sprint <n> ' docs/implementation-sprints.md      # the heading
```

Read the whole sprint section: goal, the task table (# · Task · Backlog · Standard), the exit
criteria, and any "run in parallel with" note. Read §0 (live verification) and the sequencing
principles above it too — a sprint is only correct relative to the state §0 records, and that
state changes without a repo change (the AI-crawler policy did, twice).

| Argument | Action                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `0`      | **Stop.** Sprint 0 is a deploy of what is already built. Load `deploy-dangates`, run the dry run, report, and wait for the owner's word. Nothing else. |
| `1`–`9`  | proceed                                                                                                                                                |
| `B`      | **Refuse.** Track B is the owner's list (`docs/owner-actions.md`). Print the rows, their status and what each unblocks; do not attempt any of them.    |
| other    | list the sprints with their status and stop                                                                                                            |

## 2. Walk the task rows, in order

For each row, take the backlog id(s) in its Backlog column and run the `/improve` procedure —
load the `improve` skill and follow it exactly: resolve the heading, honour the status tag, route
through `docs/agent-roster.md` §3, implement through the named writer, hand to the named reviewers,
record the verifying command in the backlog row. The rules that decide whether a row is touched at all:

| Heading tag          | What this loop does                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `NOT STARTED`        | run it                                                                                                                                 |
| `PARTIAL`            | run the stated remainder only                                                                                                          |
| `✅ DONE` `✅ HOLDS` | re-run the row's verifying command, note "holds" or "regressed", move on — never re-implement                                          |
| `⏳ BLOCKED · owner` | **skip with a note** naming the owner-actions row; a sprint row that cites a blocked id was mis-sequenced — say so in the final report |
| `new` (no id)        | implement per the row text and the standard it cites, then add the item to the backlog under the section its standard names            |

A row that names a **deploy** (Sprint 0, the end of Sprint 1, "ship it") stops the loop: dry run via
`deploy-dangates`, report, wait. The guard hook blocks the real deploy without `-Confirm` and
`# APPROVED:` — that marker is the owner's, not yours.

## 3. Gate after every item, stop on regression

```bash
npm run audit:env          # step 0 — the environment's own self-test
npm run gate               # lint → typecheck → format:check → build → audit
```

Judge the audit exit against the **known baseline** in `qa-build-gate` (37 failures on
2026-08-24 across 10 checks, minus whatever earlier sprints closed). The bar is _no failure absent
from the latest `docs/audits/` report_, and every number the sprint's exit criterion names must move
the right way. A new failure, or a number moving the wrong way, **stops the sprint** at that item:
report the item, the failing check and its output, leave the working tree as it is, and hand back.
Do not "fix forward" into the next row.

Copy rows (`hebrew-copywriter` → `hebrew-editor` → `claims-verifier`) and markup rows
(`rtl-frontend-engineer` → `ts-react-reviewer`) may run as parallel agents when the sprint says so
(Sprints 4–6), but the gate runs once per landed item, serially, on the merged tree.

## 4. Close the sprint

1. `/audit <scope>` for the sprint's scope (the sprints doc names it; `full` when it names several).
2. Tick the sprint's exit criteria in `docs/implementation-sprints.md` **only** where a command output
   in the audit report proves it — paste the command and the number next to the tick.
3. Confirm every backlog row the sprint touched carries its verifying command (`/improve` does this;
   check it did).
4. Report: rows run · rows skipped and why · the gate result per item · the audit verdict · what the
   next sprint needs from the owner (Track B rows still open).

Nothing in this skill deploys. A sprint whose exit criterion is "live" (Sprint 0, the 301s at the end
of Sprint 1) is closed only after `deploy-dangates` ran on the owner's word and the runbook's one-shot
verification passed against the live response.

## Gotchas

- **The sprints doc is a plan, the backlog is the truth.** If a row's id no longer matches its
  heading (status moved, item re-scoped), follow the heading and note the drift in the report.
- **Sprints 5–7 are content work** measured by `content-depth.mjs`; a row is not done because the
  words exist — it is done when the floor and the doorway delta pass and the reviewers signed.
- **Never start a 19th city or an 8th service** inside a sprint; the expansion cap is
  `docs/content-standards.md` §2 and it is not a sprint row.
- **Owner-blocked is not "later"** — it is a different list. A sprint that cannot exit without a
  Track B row says so at the top of its report instead of waiting.
- Deploying, Cloudflare changes and `business-facts.md` values are the owner's; the guard hooks and
  `.claude/rules/protected-files.md` enforce the first two — do not try another tool.
