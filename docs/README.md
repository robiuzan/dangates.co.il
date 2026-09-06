# docs/ — the map

Twenty-two documents, four ADRs and the audit reports, in four layers. **Read the layer, not just
the filename** — most contradictions between docs are a strategy doc and a defect list describing
the same thing at different altitudes, and the resolution rule differs per layer.

```text
STRATEGY      what we are trying to win, and why
   │          seo-geo-aeo-strategy · growth-roadmap
   ▼
STANDARDS     the bar a change must clear   ← most "is this allowed?" questions live here
   │          content-standards · keyword-map · schema-graph · event-taxonomy
   │          eeat-and-trust · ux-cro-security · performance-guidelines
   │          accessibility-and-i18n · mobile-ux-and-personalization
   │          data-tracking-infrastructure
   ▼
STATE         what is true right now, and what is unresolved
   │          business-facts · optimization-backlog · audits/ · rank-tracking · competitors
   ▼
OPERATIONS    how to change production safely
              implementation-sprints · agent-roster · owner-actions
              cloudflare-runbook · gbp-runbook · content-calendar · decisions/
```

**Starting work?** → `implementation-sprints.md`. It sequences everything
below into Sprint 0–9 plus Track B (the owner's), and its §0 records where the backlog had drifted
from the live site on 2026-09-06 — Phase 0 was not live until Sprint 0 deployed it on 2026-09-06 (11:06 UTC).

**Entry points.** `/sprint <n>` walks one sprint through `/improve`, runs `npm run gate` after every
item and stops at any deploy step for the owner's word. `/improve <id>` closes one backlog row —
route through `agent-roster.md` §3, implement, gate, reviewers, proof in the row.
`/audit [scope]` rebuilds, measures, fans out the auditors and writes `audits/<date>-<scope>.md`.
None of the three deploys; `deploy-dangates` does, on the owner's word, dry run first.

## The documents

### Strategy

| Doc                                                | Answers                                                                                                                                                                          |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md) | What do we compete for? How is the site shaped — three silos, one hub? What makes a page citable by an AI engine? §0 is the measured state (AI crawlers re-verified 2026-09-06). |
| [growth-roadmap.md](growth-roadmap.md)             | What order do we do things in, in plain language — what each phase buys, what is not coming and how the site is written around it, and what the owner must supply.               |

### Standards — the acceptance bars

| Doc                                                                  | Answers                                                                                                                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [content-standards.md](content-standards.md)                         | Is this page deep enough to ship? Is it a doorway page? What may copy state as fact? Hebrew mechanics and location grammar. `content-depth.mjs` is the measurement, never a hand count. |
| [keyword-map.md](keyword-map.md)                                     | What term does this route target? The title, H1 and description formulas; the service × location matrix; the evidenced gaps. No search volumes — none exist here, none may be added.    |
| [schema-graph.md](schema-graph.md)                                   | What JSON-LD does this route emit, under which `@id`, and what is gated (`Review`, `AggregateRating`, `Offer`)? The planned `lib/jsonld.ts` builders.                                   |
| [event-taxonomy.md](event-taxonomy.md)                               | What does the site push to `dataLayer` on `GTM-KWGGH438`, with which parameters, and which container trigger consumes it? UTM tagging. Never PII.                                       |
| [eeat-and-trust.md](eeat-and-trust.md)                               | Is this trust signal allowed — a review, a photo, a credential, a warranty word, a byline, a badge — and what must it contain first? An unsourced signal is worse than none.            |
| [ux-cro-security.md](ux-cro-security.md)                             | Does this page ask for the lead? What must the lead form, the navigation and the edge posture look like?                                                                                |
| [performance-guidelines.md](performance-guidelines.md)               | What are the byte budgets and Core Web Vitals targets for a text-only static export? Which of the four client components earn their hydration?                                          |
| [accessibility-and-i18n.md](accessibility-and-i18n.md)               | WCAG 2.1 AA / IS 5568 rules, the RTL rules that double as accessibility rules, and whether — and how — a second locale is ever built.                                                   |
| [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) | What must mobile do for a visitor standing at a stuck gate? What may "personalisation" mean when one static file is served to everyone?                                                 |
| [data-tracking-infrastructure.md](data-tracking-infrastructure.md)   | What does the site collect, what must never reach `dataLayer`, which third-party code is allowed, and where does analytics infrastructure stop being this repo's business?              |

### State

| Doc                                                | Answers                                                                                                                                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [business-facts.md](business-facts.md)             | **The intake ledger.** Every unverified claim, its status (🔶 ⏳ ⛔ ✅ ❌) and who must confirm it. Every 🔶 marker in the codebase points here. **The one file an agent may not fill in** — the `Value` column is the owner's. |
| [optimization-backlog.md](optimization-backlog.md) | The ranked defect list every agent cites by id (`§3.1`, `N8`), each row with its proving script and a status. Numbers are context, not truth — re-run the script before quoting one.                                            |
| [audits/](audits/README.md)                        | Dated `/audit` reports — the memory of the improvement loop. [2026-08-24-full.md](audits/2026-08-24-full.md) is the baseline every later Δ is computed against; [\_template.md](audits/_template.md) is the shape.              |
| [rank-tracking.md](rank-tracking.md)               | Monthly Search Console snapshots per keyword family, written only by `gsc-ingest.mjs`. No data yet — the property is unverified; nothing here is filled in by hand.                                                             |
| [competitors.md](competitors.md)                   | Who ranks for the queries we want, with what, what we may take (structure) and what we never take (their numbers, reviews, words). Rank order is unverified until §4 has run.                                                   |

### Operations

| Doc                                                         | Answers                                                                                                                                                                                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [implementation-sprints.md](implementation-sprints.md)      | **What do we do next, in what order, and why that order?** Sprint 0–9 plus Track B; §0 is the live verification of 2026-09-06.                                                                                                       |
| [agent-roster.md](agent-roster.md)                          | **The routing table.** Backlog section → skill → writer → reviewer → proof script; the scripts, hooks and rules; §7 maps each standards doc to the skill that implements it, the agent that audits it and the script that proves it. |
| [owner-actions.md](owner-actions.md)                        | The list nothing in this repo can move — each row an exact toggle or deliverable, what it unblocks, and where the value lands once supplied.                                                                                         |
| [cloudflare-runbook.md](cloudflare-runbook.md)              | Which zone toggles matter, what they do, and how to **prove** one was flipped. Step 1 is the AI-crawler probe. Owner-only changes.                                                                                                   |
| [gbp-runbook.md](gbp-runbook.md)                            | How the Google Business Profile gets created as a service-area business from the §0 NAP strings, and the verbatim-only path by which reviews may return to the site.                                                                 |
| [content-calendar.md](content-calendar.md)                  | What guide gets written next for `/מדריכים/` and in what order — the five pillars, the first eight, and the keep / fold / redirect decision for each of the 11 legacy posts.                                                         |
| [decisions/0001](decisions/0001-environment-hardening.md)   | Why the `.claude/` environment enforces its own rules with hooks, a deny list and `env-doctor.mjs` instead of prose.                                                                                                                 |
| [decisions/0002](decisions/0002-guides-hub-route.md)        | Why new editorial pages live in a `/מדריכים/` hub, not in `/blog/` and not as top-level slugs.                                                                                                                                       |
| [decisions/0003](decisions/0003-block-content-model.md)     | Why the flat `PostBlock` is replaced by a typed block model whose content rules throw at build time.                                                                                                                                 |
| [decisions/0004](decisions/0004-redirects-replace-stubs.md) | Why the 37 meta-refresh stubs and the dead GitHub Pages / Apache origins give way to real 301s in `public/_redirects`.                                                                                                               |

## Resolution rules

When two sources disagree:

1. **Roster > everything** for a business fact. `Israeli services sites/roster/sites/dangates.json`
   wins over `site.config.json`, over these docs, over the code.
2. **Code > docs** for what the site currently does. Docs drift; verify before citing. The backlog
   carried the homepage at "~1,130 ✅" until `content-depth.mjs` measured 675 unique words against an
   800 floor on 2026-08-24 (backlog §3.13) — that is what drift looks like. When you find drift,
   **fix the doc in the same change**; when a standards doc and a skill disagree, check the code and
   fix the skill.
3. **Standards > strategy** for whether a specific change may ship. Strategy sets direction; the
   standards docs set the gate.
4. **Script > skill > agent** when they disagree (CLAUDE.md §13). Scripts measure, skills carry
   procedure, agents carry judgment. A number quoted from prose or memory is not a number.
5. **Live response > repo** for anything served at the edge — headers, `robots.txt`, redirects,
   cache, and the answer an AI crawler gets. That answer changed twice with no commit: a managed
   `robots.txt` block (2026-08-16), an edge 403 with the block gone (2026-08-23), 200 across the board
   (2026-09-06). `cloudflare-runbook` Step 1 is the only measurement; `app/robots.ts` and the planned
   `public/_headers` are _inputs_, not evidence.
6. **`business-facts.md` > optimism.** An unsourced claim does not ship, however good it would look;
   a live 🔶/⛔ claim is stop-ship.

## The rules that override everything

These are golden rules 1, 2, 3, 4 and 9 in [../CLAUDE.md](../CLAUDE.md), and no document here
relaxes them:

- **Never fabricate a business fact.** Unsourced → `// 🔶 confirm` + a row in `business-facts.md`.
  The reviews guard (`reviews = []`, `REVIEW_SOURCE_URL = null`, `schema.mjs`) is that rule made
  mechanical — do not remove or work around it.
- **Never edit `site.config.json` directly** — it syncs down from the roster, and the hook and deny
  list refuse the write.
- **Never "fix" `/איזורי-שירות/`.** It is the live URL; renaming it without a 301 discards every
  ranking signal it holds.
- **Pushing to `main` deploys nothing.** It publishes to a GitHub Pages origin the domain no longer
  resolves to. Production is `wrangler` direct upload to Cloudflare Pages, and deploying is a
  production mutation — **ask first**, dry run first.
- **Never edit generated or vendored output** — `node_modules/`, `vendor/`, `.next/`, `out/`,
  `out.prev/`, and `public/_redirects` (regenerate it with `node scripts/gen-redirects.mjs`, which
  `prebuild` runs on every build; edit `REDIRECTS.md`, never the generated file).
