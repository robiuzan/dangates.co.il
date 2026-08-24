// .claude/workflows/site-audit.js — the deterministic engine behind /audit.
//
// Invoke as `/site-audit` with args = { scope: 'full'|'seo'|'schema'|'content'|'cro'|'security'|'perf'|'a11y', date: 'YYYY-MM-DD' }.
// `date` is passed in because a workflow script must be deterministic — it cannot read the clock
// or draw randomness; when it is missing the synthesis agent reads today's date from the shell.
//
// Stage 1  Measure — one agent: clean rebuild + `node scripts/audit/run-all.mjs --scope <scope> --json`.
// Stage 2  Judge   — the scope's read-only auditor agents in parallel (project agents by agentType),
//                    each returning report rows in the docs/audits/_template.md format.
// Stage 3  Report  — one synthesis agent writes docs/audits/<date>-<scope>.md and updates
//                    docs/optimization-backlog.md statuses only where a command output proves it.
//
// The scope→checks→agents map must stay identical to .claude/skills/audit/SKILL.md.

export const meta = {
  name: "site-audit",
  description:
    "Site audit for one scope: clean rebuild + scripts/audit/run-all.mjs, the scope's read-only auditor agents in parallel, one synthesis agent writing docs/audits/<date>-<scope>.md and updating backlog statuses with proof",
  phases: [
    { title: "Measure", detail: "clean rebuild + run-all.mjs --scope <scope> --json" },
    { title: "Judge", detail: "the scope's auditor agents in parallel" },
    { title: "Report", detail: "docs/audits/<date>-<scope>.md + backlog statuses" },
  ],
};

// ── scope map (mirror of /audit) ────────────────────────────────────────────
const SCOPES = {
  full: {
    checks:
      "titles links content-depth schema cta-coverage spam-grep claims-grep rtl-lint a11y perf edge",
    agents: [
      "seo-auditor",
      "schema-auditor",
      "local-seo-strategist",
      "aeo-geo-strategist",
      "eeat-trust-auditor",
      "perf-a11y-auditor",
      "security-auditor",
      "ts-react-reviewer",
      "cro-engagement-auditor",
    ],
  },
  seo: {
    checks: "titles links content-depth",
    agents: ["seo-auditor", "local-seo-strategist"],
  },
  schema: { checks: "schema", agents: ["schema-auditor"] },
  content: {
    checks: "content-depth spam-grep claims-grep",
    agents: ["eeat-trust-auditor", "aeo-geo-strategist", "local-seo-strategist"],
  },
  cro: { checks: "cta-coverage", agents: ["cro-engagement-auditor"] },
  security: { checks: "edge spam-grep", agents: ["security-auditor"] },
  perf: { checks: "perf", agents: ["perf-a11y-auditor", "ts-react-reviewer"] },
  a11y: { checks: "a11y rtl-lint", agents: ["perf-a11y-auditor", "ts-react-reviewer"] },
};

const scope = (args && args.scope) || "full";
const date = (args && args.date) || null;
if (!SCOPES[scope]) {
  return { error: `unknown scope "${scope}" — known: ${Object.keys(SCOPES).join(", ")}` };
}
const { checks, agents: auditorNames } = SCOPES[scope];

const REPO = "c:/Users/robiu/antigravity/Projects/dangates.co.il";
const COMMON = `
Repo: ${REPO} (Next.js 14 static export, Hebrew RTL site for דן שערים חשמליים, Cloudflare Pages).
Rules for every stage: never edit site code (app/, components/, lib/, public/, scripts/); never
deploy; never invent a number — every figure comes from a command you ran in this turn; quote
Hebrew as written (גרש ׳ / גרשיים ״). Use absolute paths. Read CLAUDE.md §2 and §9 first.
`;

// ── output schemas ──────────────────────────────────────────────────────────
const MEASURE = {
  type: "object",
  required: ["exitCode", "markdown"],
  properties: {
    exitCode: { type: "number", description: "run-all.mjs exit code = failure count" },
    markdown: {
      type: "string",
      description: "the full markdown output of run-all.mjs, verbatim",
    },
    summaryLine: { type: "string", description: "the final **scope … failure(s)** line" },
    builtAt: {
      type: "string",
      description: 'the export check\'s "out/ built <timestamp>" value',
    },
    commit: { type: "string", description: "git rev-parse --short HEAD" },
    json: { type: "string", description: "the --json output, verbatim (may be long)" },
  },
};

const ROW = {
  type: "object",
  required: ["severity", "finding", "evidence", "backlog", "fixOwner"],
  properties: {
    severity: { type: "string", enum: ["Critical", "High", "Medium", "Low"] },
    finding: { type: "string", description: "one root cause, with an instance count" },
    evidence: {
      type: "string",
      description: "file:line, or a command and the output that proves it",
    },
    backlog: {
      type: "string",
      description: "§x.y or Nn from docs/optimization-backlog.md, or NEW",
    },
    fixOwner: {
      type: "string",
      description: 'writer agent per docs/agent-roster.md §3, or "owner"',
    },
  },
};

const JUDGE = {
  type: "object",
  required: ["rows"],
  properties: {
    rows: { type: "array", items: ROW },
    ownerBlocked: {
      type: "array",
      items: {
        type: "object",
        required: ["item", "blockedOn", "where"],
        properties: {
          item: { type: "string" },
          blockedOn: { type: "string" },
          where: { type: "string" },
        },
      },
    },
    summary: {
      type: "string",
      description: 'one line for the report\'s "Agents run" table',
    },
  },
};

const REPORT = {
  type: "object",
  required: ["file", "verdict", "critical", "high"],
  properties: {
    file: { type: "string" },
    verdict: { type: "string" },
    critical: { type: "array", items: { type: "string" } },
    high: { type: "array", items: { type: "string" } },
    backlogUpdates: { type: "array", items: { type: "string" } },
    nextUp: { type: "array", items: { type: "string" } },
  },
};

// ── Stage 1 — Measure ───────────────────────────────────────────────────────
phase("Measure");
const measured = await agent(
  COMMON +
    `
## Task: clean rebuild + deterministic audit for scope "${scope}"
1. Clean rebuild. \`rm -rf\` is hook-blocked; use exactly:
   node -e "require('fs').rmSync('.next',{recursive:true,force:true})" && npm run build
   If the build fails, return exitCode -1 and the build error as markdown.
2. Run \`node scripts/audit/run-all.mjs --scope ${scope}\` and capture the complete markdown
   output and the exit code (call node directly, not npm, so the exit code is the failure count).
   The checks in this scope are: ${checks}.
3. Run \`node scripts/audit/run-all.mjs --scope ${scope} --json\` and capture it as a string.
4. Record \`git rev-parse --short HEAD\` and the "out/ built <timestamp>" line from the export check.
Return the object. Do not summarise or trim the markdown — it is pasted verbatim into the report.`,
  { label: "measure:run-all", phase: "Measure", schema: MEASURE },
);

if (!measured) {
  return {
    error: "measure stage returned nothing — the run was stopped or the agent failed",
  };
}
if (measured.exitCode < 0) {
  return { error: "build failed", markdown: measured.markdown };
}
log(`Measure: run-all --scope ${scope} exited ${measured.exitCode}`);

// ── Stage 2 — Judge (the scope's auditors, in parallel) ─────────────────────
phase("Judge");
const judgePrompt = (name) =>
  COMMON +
  `
## Task: audit judgment for scope "${scope}" (you are ${name})
run-all.mjs exited ${measured.exitCode}. Per-check line: ${measured.summaryLine || "(not captured)"}.
Re-measure per your "## Baseline — re-measure first" block — do not trust these numbers second-hand.
out/ is a fresh build (${measured.builtAt || "timestamp not captured"}); do NOT rebuild.
Return:
- rows: one per ROOT CAUSE (count instances), severity Critical / High / Medium / Low per
  docs/audits/_template.md §3; every row carries a backlog id from docs/optimization-backlog.md
  (§x.y or Nn — "NEW" only if none fits), evidence that is a file:line or a command plus its
  output, and fixOwner = the writer for that section in docs/agent-roster.md §3 ("owner" when the
  item is owner-blocked). A row without evidence is not a finding — leave it out.
- ownerBlocked: items no repo change can move, citing docs/business-facts.md §A–H or
  docs/owner-actions.md.
- summary: one line for the "Agents run" table.
History is not a finding: fabricated reviews (removed 2026-08-17, gated), doubled titles (fixed),
blog spam (clean), zero BreadcrumbList (44 pages emit one), 26 pages without JSON-LD (45/45 emit)
— verify with schema.mjs / titles.mjs / spam-grep.mjs / links.mjs before reporting anything similar.
Read-only: do not edit, rebuild or deploy.`;

const judged = await parallel(
  auditorNames.map(
    (name) => () =>
      agent(judgePrompt(name), {
        agentType: name,
        label: name,
        phase: "Judge",
        schema: JUDGE,
      }),
  ),
);
const judgments = auditorNames.map((name, i) => ({
  agent: name,
  result: judged[i] || null,
}));
const returned = judgments.filter((j) => j.result);
log(
  `Judge: ${returned.length}/${auditorNames.length} auditors returned; rows: ${returned.reduce((n, j) => n + (j.result.rows ? j.result.rows.length : 0), 0)}`,
);

// ── Stage 3 — Report ────────────────────────────────────────────────────────
phase("Report");
const dateInstruction = date
  ? `Report date: ${date}.`
  : `No date was passed. Get today's date from the shell — \`date +%F\` in Bash or \`Get-Date -Format yyyy-MM-dd\` in PowerShell — and \`git log -1 --format=%cd --date=short\` for the last commit date. Use today's date (not the commit date) for the file name and the title.`;

const report = await agent(
  COMMON +
    `
## Task: write the audit report for scope "${scope}" and update backlog statuses with proof
${dateInstruction}
File: docs/audits/<date>-${scope}.md — if it already exists, use <date>-${scope}-2.md (never
overwrite). Copy docs/audits/_template.md and fill EVERY section ("none" where empty). Read
docs/audits/README.md for the convention.

Header: Verdict = one sentence, first bold line after the title. Previous report = the newest
existing docs/audits/*-${scope}.md before this one, or "baseline". Export built = ${measured.builtAt || "(read it from the markdown below)"}.
Commit = ${measured.commit || "(run git rev-parse --short HEAD)"}.

§1 Δ vs previous: fixed / regressed / new by backlog id, diffed against the previous report's §2
numbers and §3 rows; "baseline" if there is none.

§2 Deterministic checks: paste this markdown VERBATIM, then "Exit code: ${measured.exitCode}".
<<<RUN-ALL
${measured.markdown}
RUN-ALL>>>

§3 Findings: merge the auditor rows below. Dedupe by root cause (keep the strongest evidence,
sum the instance counts), keep the backlog id, set Fix owner from docs/agent-roster.md §3. Drop
any row whose evidence is neither a file:line nor a command output. Drop any row that contradicts
§2 — the script decides.
<<<AUDITOR-ROWS (JSON)
${JSON.stringify(judgments, null, 1)}
AUDITOR-ROWS>>>

§4 Owner-blocked: the ownerBlocked entries, deduped, listed not re-argued.
§5 Backlog updates: edit docs/optimization-backlog.md ONLY where a command output in §2 or a
row's evidence proves a status change (NOT STARTED → PARTIAL / ✅ DONE, or back on a regression):
change the heading tag and append "Verified <date> by \`<command>\` → <output>". Findings tagged
NEW get a new "### N<next> — P<n> · <effort> · [NOT STARTED] <title>" under §14 (next number after
the last existing N-item) and the report row is relabelled with it. §15.2 becomes ✅ DONE on the
first report. Never rewrite item text, priorities or "Suggested order of work".
§6 Next up: three /improve targets in order with a one-line reason each.
"Agents run" table: one row per auditor in this list — ${auditorNames.join(", ")} — using each
summary; an auditor with result null is listed as "no return".

Do not edit anything outside docs/audits/ and docs/optimization-backlog.md. Return the object.`,
  { label: "report:synthesis", phase: "Report", schema: REPORT, effort: "high" },
);

if (!report) {
  return {
    error: "report stage returned nothing",
    exitCode: measured.exitCode,
    judgments,
  };
}
log(`Report: ${report.file} — ${report.verdict}`);

return {
  scope,
  exitCode: measured.exitCode,
  file: report.file,
  verdict: report.verdict,
  critical: report.critical,
  high: report.high,
  backlogUpdates: report.backlogUpdates || [],
  nextUp: report.nextUp || [],
  auditorsReturned: `${returned.length}/${auditorNames.length}`,
};
