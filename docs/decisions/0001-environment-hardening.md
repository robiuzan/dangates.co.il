# ADR 0001 — Make the agent environment enforce its own rules

**Date:** 2026-08-23 · **Status:** accepted

## Context

The `.claude/` environment (10 agents, 17 skills, 5 docs) was written 2026-08-16/17 against a
snapshot of the site. Phase 0 shipped the next day and the environment was not updated: 20 of 29
files asserted defects that no longer existed, one skill taught a crumb shape that emits
`https://dangates.co.il/undefined`, and ~120 `file:line` citations had drifted. At the same time
nothing in the environment was enforced — `settings.json` had an allow-list and one Prettier hook —
and the export proved prose does not hold (three banned RTL utilities and five hex literals shipped
against explicit CLAUDE.md bans). The environment was also untracked in git.

## Decision

1. **Guards before advice.** `permissions.deny` plus PreToolUse hooks block writes to the synced
   manifest, generated output, vendored code and the 37 redirect stubs; destructive git and any
   deploy/infra call need `-DryRun` or `-Confirm` + `# APPROVED:`; a PostToolUse lint feeds banned
   utilities, hex, spam tokens and unconfirmed claims back to the model at edit time.
2. **One copy of every measurement.** Every `node -e` one-liner that lived in 4–5 prose files becomes
   a script under `scripts/audit/` with a shared `Report` contract and exit code = failure count.
   Agents and skills cite the script, not a number.
3. **A self-test.** `scripts/audit/env-doctor.mjs` resolves every `file:line` citation in the
   environment, lints frontmatter, and checks `Skill()` allow parity, hooks and the deny set. It is
   step 0 of the build gate.
4. **Reports persist.** `/audit` writes `docs/audits/<date>-<scope>.md` and updates the backlog from
   it; the SessionStart hook prints the latest verdict.
5. **Path-scoped rules** (`.claude/rules/`) carry the mechanical reminders next to the files they
   govern; CLAUDE.md keeps the narrative.
6. **Commit it.** The environment is versioned on `main` like code.

## Consequences

- Golden rules 2, 7 and 9 can no longer be broken by an agent; rule 1 (no fabrication) is caught at
  edit time for the lexicon in `scripts/audit/claims.json` and at audit time for everything in it.
- Two documented deviations from the fleet's four-field agent frontmatter: the writer agents carry
  `skills:`; command-style skills carry `argument-hint` / `allowed-tools`.
- Hooks are PowerShell 5.1 and ASCII-only; Hebrew lexicons live in JSON the hooks read.
- A stale `out/` fails the audit instead of producing numbers for a build nobody shipped.
