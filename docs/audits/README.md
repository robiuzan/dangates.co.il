# Audit reports

Every `/audit` run writes one dated report here. Reports are the memory of the improvement loop:
the next run diffs against the previous one, and `docs/optimization-backlog.md` statuses are updated
from them — never from a reply that evaporates at the end of a turn.

## Convention

- **File name:** `YYYY-MM-DD-<scope>.md` — scope is `full`, `seo`, `schema`, `content`, `cro`,
  `security`, `perf` or `a11y`. A second run on the same day appends `-2`.
- **Template:** copy [`_template.md`](_template.md). Keep every section, even if empty ("none").
- **Two sources, always both:** the deterministic numbers from `npm run audit -- --scope <scope>`
  (quoted verbatim into §2) and the auditor agents' judgment (§3). A finding with no number and
  no `file:line` is an opinion and does not go in.
- **Δ vs previous:** name the previous report and list what moved — fixed, regressed, new. If there
  is no previous report of this scope, say "baseline".
- **Backlog ids** on every finding (`§3.1`, `N8`). A finding that maps to no backlog item gets a new
  id appended to the backlog in the same change.
- **Owner-blocked** items are listed, not re-argued — they move when `docs/business-facts.md` moves.
- **Verdict line** is the first bold line after the title: `**Verdict:** <one sentence>` — the
  SessionStart hook prints it.

## What the report is not

Not a to-do list for the owner (that is `docs/owner-actions.md`), not the acceptance bar (that is
`docs/content-standards.md` / `docs/schema-graph.md`), and not a place to soften a stop-ship finding.
