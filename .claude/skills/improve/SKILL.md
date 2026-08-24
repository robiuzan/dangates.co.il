---
name: improve
description: Close one backlog item end to end — resolve the id in docs/optimization-backlog.md, route it through docs/agent-roster.md §3 to its skill, writer, reviewers and proof script, implement, run `npm run gate` judged on regressions against the known baseline, hand off to the reviewers, write an ADR when the change is structural, and record the verifying command in the backlog row. Never deploys. Use when working a backlog item by id. Triggers: "/improve", "fix backlog item", "work on §…", "close N8", "טפל בסעיף", "תקן את הפריט".
argument-hint: "§3.1 | N8 | 13.2"
allowed-tools: Read, Edit, Write, Grep, Glob, Bash, Agent
---

# /improve <id>

One backlog item per invocation, routed through the roster, proven by a script, reviewed by someone
other than the writer. The item's row in `docs/optimization-backlog.md` is the deliverable: a status
tag plus the command that proves it. `/audit` reads that row later; `/deploy-dangates` is a separate
decision the owner makes.

## 1. Resolve the item

Accept `§3.1`, `3.1`, `N8`, `§N8`, `13.2`. Find the heading and read the **whole** item plus the
`Script:` line under its section heading:

```bash
grep -n -E '^### (3\.1|N8) ' docs/optimization-backlog.md
```

Status tag in the heading decides what happens next:

| Tag                  | Action                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `NOT STARTED`        | proceed                                                                                                                      |
| `PARTIAL`            | proceed on the stated remainder only                                                                                         |
| `⏳ BLOCKED · owner` | **refuse.** Point at the row's `docs/owner-actions.md` / `docs/business-facts.md` reference; nothing in the repo can move it |
| `✅ DONE`            | re-run the item's verifying command; report whether it still holds; no edit                                                  |
| `✅ HOLDS`           | a standing rule, not work — say so                                                                                           |

## 2. Route

`docs/agent-roster.md` §3 maps the item's section to skill(s) → writer → reviewer(s) → proof script.
Load the skill(s) with the `Skill` tool before touching a file. N-items route by the section their
text names (N1 → §8 form, N2 → §4 schema, N3/N10/N11 → §11 with ts-react-reviewer, N4–N7 → §1/§12
edge, N8 → §8 via `/engagement-ux`, N9 → §9 chrome, N12 is a standing rule).

Quick reference (the roster is authoritative):

| Section       | Skill(s)                                                       | Writer                                    | Reviewer(s)                           | Proof                                 |
| ------------- | -------------------------------------------------------------- | ----------------------------------------- | ------------------------------------- | ------------------------------------- |
| §1 §12 edge   | web-security-headers · seo-metadata                            | rtl-frontend-engineer                     | seo-auditor · security-auditor        | `edge.mjs` `titles.mjs`               |
| §2 metadata   | seo-metadata                                                   | hebrew-copywriter / rtl-frontend-engineer | seo-auditor · hebrew-editor           | `titles.mjs`                          |
| §3 §5 content | new-city · new-service · new-article                           | hebrew-copywriter                         | hebrew-editor → claims-verifier       | `content-depth.mjs` `claims-grep.mjs` |
| §4 schema     | schema-structured-data                                         | rtl-frontend-engineer                     | schema-auditor                        | `schema.mjs`                          |
| §8 §13 CRO    | conversion-cro · tracking-analytics                            | rtl-frontend-engineer                     | cro-engagement-auditor                | `cta-coverage.mjs` `a11y.mjs`         |
| §9 linking    | internal-linking                                               | rtl-frontend-engineer                     | seo-auditor                           | `links.mjs`                           |
| §10 §11 UI    | performance-web-vitals · responsive-accessibility · hebrew-rtl | rtl-frontend-engineer                     | perf-a11y-auditor · ts-react-reviewer | `perf.mjs` `a11y.mjs` `rtl-lint.mjs`  |

## 3. Implement

- **Small, mechanical change** (one file, no copy, no data-model change): do it in the main session,
  following the loaded skill.
- **Copy** (anything a reader sees, in `lib/content.ts` / `lib/posts.ts` / `content/guides/`):
  delegate to `hebrew-copywriter` with the skill named in the prompt. Copy never lands in JSX.
- **Components, routes, schema wiring, forms**: delegate to `rtl-frontend-engineer` with the skill
  named; it runs `npm run gate` itself and reports the audit exit code.
- Business facts come from `lib/site-config.ts`; anything unverified is `// 🔶 confirm` plus a row in
  `docs/business-facts.md` — the value column stays empty (golden rule 1).
- Protected paths (`site.config.json`, `out/`, `vendor/`, `public/**/index.html`, `.next/`) are
  hook-blocked; a block is a pointer to the real source (`.claude/rules/protected-files.md`).

## 4. Gate — judged on regressions

```bash
npm run gate          # lint → typecheck → format:check → build → npm run audit
```

The bar is not "exit 0" until Phase 1 lands; it is **no failure absent from the known-baseline table
in `/qa-build-gate`, and the item's own proof script moved the right way**. Run that script alone
too, so its output can be quoted in step 7:

```bash
node scripts/audit/<proof>.mjs; echo "exit=$?"
```

A number that moved the wrong way anywhere in the run is a regression — fix it or revert before
going on.

## 5. Review — never self-review

| Changed                   | Reviewer(s), in order                                   |
| ------------------------- | ------------------------------------------------------- |
| Hebrew copy               | `hebrew-editor` → `claims-verifier`                     |
| markup / TS / routes      | `ts-react-reviewer`                                     |
| JSON-LD                   | `schema-auditor`                                        |
| a guide under `/מדריכים/` | `article-auditor` → `hebrew-editor` → `claims-verifier` |

Launch reviewers with the `Agent` tool and paste the diff scope (`git diff --stat`, file list). A
live 🔶 or ⛔ claim from `claims-verifier` is stop-ship: the item does not close until it is removed.
Reviewer findings are fixed in the same session, then the proof script is re-run.

## 6. ADR when structural

A new route family, a data-model change (`locations` gaining `kind`/`prefixed`, `cityContent`,
`serviceDepth`, the block model), a redirect or hosting policy, or anything a later agent could
"correct" back — write `docs/decisions/NNNN-<slug>.md` (next number after
`ls docs/decisions/`), same shape as ADR 0001–0004: Context · Decision · Consequences · Verification.
Link it from the backlog row.

## 7. Update the backlog row

Edit the heading tag and append one line to the item body:

```
### 11.5 — P2 · S · [✅ DONE] Three banned RTL utilities ship
…existing text…
Verified 2026-08-24 by `node scripts/audit/rtl-lint.mjs` → bannedUtilities: 0, hexLiterals: 0.
```

`PARTIAL` states what remains. Do not rewrite the item's original text (it is the record of what was
found); do not reorder "Suggested order of work" — strike a finished item through.

## 8. Hand back

Never deploy from here. End with the status line, the proof command and its output, the reviewers'
verdicts, and: **"run `/qa-build-gate` then `/deploy-dangates` when the owner says go."**

## Worked example A — `§11.5` three banned RTL utilities

1. `grep -n '^### 11.5 ' docs/optimization-backlog.md` → P2 · S · NOT STARTED; script `rtl-lint.mjs`.
2. Route: §11 → `/hebrew-rtl` + `/responsive-accessibility` → rtl-frontend-engineer → ts-react-reviewer
   → `rtl-lint.mjs`. `node scripts/audit/rtl-lint.mjs` now: `bannedUtilities: 3` at
   `components/forms/LeadForm.tsx:151`, `components/marketing/Faq.tsx:25`,
   `components/marketing/PricingTeaser.tsx:17` (all `text-right`), plus 8 hex literals on 5 lines.
3. Small and mechanical: `text-right` → `text-start` in the three files (RTL renders the same; the
   lint stops flagging). Hex literals in the same pass → `@theme` tokens; `#25D366` needs a new
   WhatsApp token in `app/globals.css` first (`.claude/rules/rtl-markup.md`).
4. `npm run gate`; `node scripts/audit/rtl-lint.mjs` → `bannedUtilities: 0`.
5. `ts-react-reviewer` on the diff.
6. No ADR — nothing structural.
7. Row → `✅ DONE`, the command and output appended, dated.

## Worked example B — `§3.3` shared `triggers` on the shutters page

1. Item: `app/services/[service]/page.tsx:43-48` declares four gate-fault bullets at module scope, so
   `/services/תריסי-גלילה-חשמליים/` lists "השער נתקע…". User-facing Hebrew in a route file.
2. Route: §3 → `/new-service` → hebrew-copywriter (the per-service wording) + rtl-frontend-engineer
   (the render) → hebrew-editor → claims-verifier → `content-depth.mjs`.
3. `/new-service` specifies `serviceDepth: Record<ServiceSlug, ServiceDepth>` in `lib/content.ts`
   with a `triggers[]` per service; **it does not exist yet** — this item is the first slice of it.
   Add `serviceDepth` with `triggers` only (typed, total record so a missing slug fails typecheck),
   seven Hebrew lists from hebrew-copywriter, and read `serviceDepth[card.slug].triggers` in the
   route; delete the module-scope array.
4. `npm run gate`; `node scripts/audit/content-depth.mjs` — the doorway delta for services should
   rise from the 13–23 range (as of 2026-08-23); no floor may drop.
5. `hebrew-editor` → `claims-verifier` on the seven lists (no "24/7", no "אחריות מלאה" — the claim
   lexicon in `scripts/audit/claims.json`); `ts-react-reviewer` on the route diff.
6. ADR: none — `serviceDepth` is the model `/new-service` already specifies; note in the row that
   `§3.2` builds the rest of it.
7. Row → `✅ DONE`; §3.2 row gains "triggers landed via §3.3".

## Checklist

- [ ] Item read in full; status tag honoured (BLOCKED refused, DONE re-verified only)
- [ ] Routed via the roster; skill(s) loaded before editing
- [ ] Copy in `lib/`, never JSX; facts from `lib/site-config.ts`; 🔶 for anything unverified
- [ ] `npm run gate` — no regression vs `/qa-build-gate`'s baseline; proof script moved the right way
- [ ] Reviewer(s) run by kind; stop-ship claims removed
- [ ] ADR written if structural
- [ ] Backlog row: tag + dated verifying command + output
- [ ] Not deployed; hand-off sentence printed

## Gotchas

- `Skill(<name>)` must be allow-listed in `.claude/settings.json` or the load prompts;
  `npm run audit:env` reports parity.
- `rtl-frontend-engineer` runs the gate itself — do not run it twice in a row for the same diff;
  read its reported exit code.
- A `PARTIAL` remainder that turns out to be owner-blocked (e.g. §3.11's empty `מקרי מבחן` section
  needs real cases) becomes `⏳ BLOCKED · owner` with the business-facts row named, not a fabricated
  case study.
- The hook `post-edit-lint.ps1` warns on banned utilities, hex and claim-lexicon hits at edit time —
  a warning during step 3 is the cheapest place to fix it.
- Hebrew route paths in Bash need quotes; `git diff -- "app/services/[service]/page.tsx"` needs the
  brackets quoted too.
