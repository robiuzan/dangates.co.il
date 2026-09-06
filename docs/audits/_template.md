# Audit — <scope> — <YYYY-MM-DD>

**Verdict:** <one sentence: ship / don't ship / the single most important finding>

**Previous report:** `<YYYY-MM-DD-scope.md>` or "baseline" · **Export built:** <ISO timestamp from
`npm run audit` export check> · **Commit:** `<git rev-parse --short HEAD>`

## 1. Δ vs previous

| Moved        | Item   | Was → Now |
| ------------ | ------ | --------- |
| ✅ fixed     | §x.y … | …         |
| ⚠️ regressed | …      | …         |
| 🆕 new       | …      | …         |

## 2. Deterministic checks (`npm run audit -- --scope <scope>`)

Paste the markdown output verbatim. Exit code: `<n>`.

## 3. Findings

Grouped by severity. One row per root cause, with a count; every row carries a backlog id and a
`file:line` or a command whose output proves it.

### Critical — shipping something wrong or harmful

| #   | Finding | Evidence | Backlog | Fix owner |
| --- | ------- | -------- | ------- | --------- |

### High — material ranking / conversion loss

| #   | Finding | Evidence | Backlog | Fix owner |
| --- | ------- | -------- | ------- | --------- |

### Medium — real improvement

| #   | Finding | Evidence | Backlog | Fix owner |
| --- | ------- | -------- | ------- | --------- |

### Low — polish

| #   | Finding | Evidence | Backlog | Fix owner |
| --- | ------- | -------- | ------- | --------- |

## 4. Owner-blocked (no repo change can move these)

| Item | Blocked on        | Where documented      |
| ---- | ----------------- | --------------------- |
| …    | business-facts §H | docs/owner-actions.md |

## 5. Backlog updates made in this run

- §x.y → DONE (verified by `<command>` → `<output>`)
- §x.y → PARTIAL (…)
- 🆕 N<nn> added: …

## 6. Next up

The three items to run `/improve` on next, in order, with the one-line reason.

## 7. AI-citation panel (`full` scope only, monthly)

The ten fixed Hebrew prompts in `docs/seo-geo-aeo-strategy.md` §6.1, run by `aeo-geo-strategist`
against ChatGPT, Perplexity, Claude and AI Overviews. First row of the section: the gate-1 probe
result (`docs/cloudflare-runbook.md` step 1) — if any allowed crawler is refused, say so and stop.
Leave the table empty and say why when the panel was not run.

| Date | Engine | Prompt # | Cited? | URL cited (ours or a competitor's — note its page type) |
| ---- | ------ | -------- | ------ | ------------------------------------------------------- |

## Agents run

| Agent | Scope | Turn summary |
| ----- | ----- | ------------ |
