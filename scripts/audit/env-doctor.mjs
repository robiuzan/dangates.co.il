/**
 * env-doctor.mjs — self-test of the Claude Code environment (agent-roster §6, qa-build-gate step 0).
 *
 * The .claude/ layer had no staleness mechanism: a skill can cite `lib/content.ts:213` long after the
 * line moved, an agent can preload a skill nobody wrote, settings.json can allow a Skill() that does
 * not exist. Source-only — never reads out/. Also `npm run audit:env`.
 *
 *   1. file:line citations in .claude/**, docs/**, CLAUDE.md exist and are in range
 *      (targets the docs plan but nobody built yet are reported as info, not as dead)
 *   2. agent frontmatter: name = filename, description, known tools/model, skills resolve
 *   3. skill frontmatter: name = directory, description, allowed-tools known; Skill() allow parity
 *   4. hooks: every wired hook file exists, every hook file is wired, every hook is ASCII-only
 *      (PowerShell 5.1 mis-decodes non-ASCII in -File scripts)
 *   5. permissions.deny covers every generated or synced path (CLAUDE.md §2 rules 2 and 9)
 *   6. rule `paths:` globs point at something on disk
 *   7. docs/agent-roster.md names resolve to agents, skills, hooks and scripts on disk
 *   8. package.json carries the audit / audit:env / gate scripts
 *
 * Usage: node scripts/audit/env-doctor.mjs [--json]
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, readSrc, sourceFiles } from "./lib/pages.mjs";
import { Report, finish, isMain, parseArgs } from "./lib/report.mjs";

const KNOWN_TOOLS = [
  "Read",
  "Edit",
  "Write",
  "MultiEdit",
  "Grep",
  "Glob",
  "Bash",
  "PowerShell",
  "WebFetch",
  "WebSearch",
  "Skill",
  "Agent",
  "NotebookEdit",
  "TodoWrite",
];
const KNOWN_MODELS = ["opus", "sonnet", "haiku", "inherit", "fable"];
const DENY_PATHS = [
  "site.config.json",
  "out/**",
  "out.prev/**",
  "vendor/**",
  "node_modules/**",
  ".next/**",
  "public/**/index.html",
];
const NPM_SCRIPTS = ["audit", "audit:env", "gate"];
/** Paths the docs may reference before they exist, with the backlog item that builds each one. */
const PLANNED = {
  "lib/jsonld.ts": "backlog §4.2",
  "lib/authors.ts": "backlog §7.4",
  "lib/guides.ts": "backlog §6.3",
  "content/guides": "backlog §6.3",
  "app/מדריכים": "backlog §6.3",
  "app/תודה": "backlog §8.3",
  "public/_headers": "backlog §12.1",
  "public/_redirects": "backlog §1.1",
  "public/llms.txt": "backlog §6.5",
};
const CITATION =
  /(?:^|[\s(`])((?:app|components|lib|scripts|public|docs|\.claude|types)\/[\w\u0590-\u05FF.\[\]/-]+\.(?:tsx?|mjs|js|json|css|md|ps1)):(\d+)(?:-(\d+))?/g;

// ── local helpers (candidates for lib/pages.mjs) ─────────────────────────────
const exists = (rel) => existsSync(path.join(ROOT, rel));
const lineCount = (rel) => {
  const t = readSrc(rel);
  return t.split(/\r?\n/).length - (t.endsWith("\n") ? 1 : 0);
};
const plannedFor = (rel) =>
  Object.keys(PLANNED).find((p) => rel === p || rel.startsWith(p + "/"));
const unquote = (s) => s.trim().replace(/^(["'])(.*)\1$/, "$2");
/** Minimal YAML frontmatter: `key: value` scalars and `  - item` lists. null when absent. */
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      fm[key] = unquote(kv[2]);
      continue;
    }
    const li = key && line.match(/^\s+-\s+(.*)$/);
    if (li)
      fm[key] = [
        ...(Array.isArray(fm[key]) ? fm[key] : fm[key] ? [fm[key]] : []),
        unquote(li[1]),
      ];
  }
  return fm;
}
/** A frontmatter value as a list: a YAML list, or a comma-separated scalar (commas inside () kept). */
const listOf = (v) =>
  Array.isArray(v)
    ? v
    : v
      ? v
          .split(/,(?![^(]*\))/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
const toolOk = (t) =>
  KNOWN_TOOLS.includes(t.replace(/\(.*\)$/, "")) || t.startsWith("mcp__");
const subdirs = (rel) =>
  exists(rel)
    ? readdirSync(path.join(ROOT, rel), { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : [];
const filesIn = (rel, ext) =>
  exists(rel) ? readdirSync(path.join(ROOT, rel)).filter((f) => f.endsWith(ext)) : [];
/** Line of the first byte ≥ 0x80, or null when the file is pure ASCII. */
function firstNonAsciiLine(rel) {
  const buf = readFileSync(path.join(ROOT, rel));
  const i = buf.findIndex((b) => b >= 0x80);
  return i < 0 ? null : buf.subarray(0, i).filter((b) => b === 0x0a).length + 1;
}

export function run(/* opts from run-all.mjs — unused: this check has no scope-specific mode */) {
  const r = new Report(
    "env-doctor",
    "Self-test of the .claude/ layer: citations, frontmatter, Skill() parity, hooks, deny set, roster (agent-roster §6).",
  );
  const agents = filesIn(".claude/agents", ".md").map((f) => f.slice(0, -3));
  const skills = subdirs(".claude/skills");
  const hooks = filesIn(".claude/hooks", ".ps1");
  const rules = filesIn(".claude/rules", ".md");
  const settings = JSON.parse(readSrc(".claude/settings.json"));
  const allow = settings.permissions?.allow ?? [];
  const deny = settings.permissions?.deny ?? [];

  // 1. file:line citations
  const docs = sourceFiles([".claude/**/*.md", "docs/**/*.md", "CLAUDE.md"]).map((d) => ({
    rel: d.rel,
    text: readSrc(d.rel),
  }));
  const dead = [],
    outOfRange = [],
    plannedCited = {};
  let checked = 0;
  for (const doc of docs) {
    for (const [, target, from, to] of doc.text.matchAll(CITATION)) {
      checked++;
      const where = `${doc.rel} → ${target}:${from}${to ? `-${to}` : ""}`;
      const planned = plannedFor(target);
      if (planned && !exists(target)) (plannedCited[planned] ??= []).push(where);
      else if (!exists(target)) dead.push(where);
      else {
        const n = lineCount(target);
        if (Math.max(Number(from), Number(to ?? 0)) > n)
          outOfRange.push(`${where} (file has ${n} lines)`);
      }
    }
  }
  if (dead.length)
    r.fail(
      `${dead.length} dead file:line citation(s) — the cited file does not exist`,
      dead.join("\n"),
      "agent-roster §6",
    );
  if (outOfRange.length)
    r.fail(
      `${outOfRange.length} file:line citation(s) point past the end of the file`,
      outOfRange.join("\n"),
      "agent-roster §6",
    );
  if (!dead.length && !outOfRange.length)
    r.note(
      `${checked} file:line citations across ${docs.length} docs all resolve and are in range`,
    );
  let plannedRefs = 0;
  for (const [p, ref] of Object.entries(PLANNED)) {
    if (exists(p)) continue;
    const re = new RegExp(`(?<![\\w/])${p.replace(/\./g, "\\.")}(?![\\w])`, "g");
    const mentions = docs
      .map((d) => ({ rel: d.rel, n: (d.text.match(re) ?? []).length }))
      .filter((d) => d.n);
    if (!mentions.length) continue;
    const total = mentions.reduce((s, d) => s + d.n, 0);
    plannedRefs += total;
    const cited = plannedCited[p]?.length
      ? `\ncited with a line number (nothing to point at yet):\n${plannedCited[p].join("\n")}`
      : "";
    r.note(
      `${p} — planned, not yet built (${total} mention(s) in ${mentions.length} doc(s))`,
      mentions.map((d) => `${d.rel} ×${d.n}`).join(", ") + cited,
      ref,
    );
  }

  // 2. agent frontmatter
  const agentIssues = [];
  for (const name of agents) {
    const fm = frontmatter(readSrc(`.claude/agents/${name}.md`));
    if (!fm) {
      agentIssues.push(`${name}: no YAML frontmatter`);
      continue;
    }
    if (!/^[a-z0-9-]+$/.test(fm.name ?? "") || fm.name !== name)
      agentIssues.push(
        `${name}: name "${fm.name ?? ""}" must be kebab-case and equal the filename`,
      );
    if (!fm.description) agentIssues.push(`${name}: empty description`);
    if (fm.model && !KNOWN_MODELS.includes(fm.model))
      agentIssues.push(
        `${name}: unknown model "${fm.model}" (want ${KNOWN_MODELS.join("|")})`,
      );
    for (const t of listOf(fm.tools))
      if (!toolOk(t)) agentIssues.push(`${name}: unknown tool "${t}"`);
    for (const s of listOf(fm.skills))
      if (!exists(`.claude/skills/${s}/SKILL.md`))
        agentIssues.push(`${name}: skills: "${s}" has no .claude/skills/${s}/SKILL.md`);
  }
  if (agentIssues.length)
    r.fail(
      `${agentIssues.length} agent frontmatter violation(s)`,
      agentIssues.join("\n"),
      "agent-roster §6",
    );

  // 3. skill frontmatter + Skill() allow parity
  const skillIssues = [];
  for (const name of skills) {
    const file = `.claude/skills/${name}/SKILL.md`;
    const fm = exists(file) ? frontmatter(readSrc(file)) : null;
    if (!fm) {
      skillIssues.push(
        `${name}: ${exists(file) ? "no YAML frontmatter" : "no SKILL.md"}`,
      );
      continue;
    }
    if (fm.name !== name)
      skillIssues.push(`${name}: name "${fm.name ?? ""}" must equal the directory name`);
    if (!fm.description) skillIssues.push(`${name}: empty description`);
    for (const t of listOf(fm["allowed-tools"]))
      if (!toolOk(t)) skillIssues.push(`${name}: unknown allowed-tool "${t}"`);
  }
  if (skillIssues.length)
    r.fail(
      `${skillIssues.length} skill frontmatter violation(s)`,
      skillIssues.join("\n"),
      "agent-roster §6",
    );
  const allowedSkills = allow
    .map((a) => a.match(/^Skill\(([^)]+)\)$/)?.[1])
    .filter(Boolean);
  const missingAllow = skills.filter((s) => !allowedSkills.includes(s));
  const staleAllow = allowedSkills.filter((s) => !skills.includes(s));
  if (missingAllow.length)
    r.fail(
      `${missingAllow.length} skill(s) have no Skill() entry in settings.json permissions.allow`,
      missingAllow.join(", "),
      "agent-roster §6",
    );
  if (staleAllow.length)
    r.warn(
      `${staleAllow.length} Skill() allow entries name a skill that does not exist on disk`,
      staleAllow.join(", "),
      "agent-roster §2",
    );

  // 4. hooks
  const wired = [
    ...new Set(
      [
        ...JSON.stringify(settings.hooks ?? {}).matchAll(
          /\$CLAUDE_PROJECT_DIR\/\.claude\/hooks\/([\w.-]+)/g,
        ),
      ].map((m) => m[1]),
    ),
  ];
  const missingHooks = wired.filter((h) => !exists(`.claude/hooks/${h}`));
  const unwired = hooks.filter((h) => !wired.includes(h));
  const nonAscii = hooks
    .map((h) => ({ h, line: firstNonAsciiLine(`.claude/hooks/${h}`) }))
    .filter((x) => x.line !== null);
  if (missingHooks.length)
    r.fail(
      `settings.json wires ${missingHooks.length} hook file(s) that do not exist`,
      missingHooks.join(", "),
      "agent-roster §5",
    );
  if (unwired.length)
    r.warn(
      `${unwired.length} hook file(s) are not referenced from settings.json`,
      unwired.join(", "),
      "agent-roster §5",
    );
  if (nonAscii.length)
    r.fail(
      `${nonAscii.length} hook(s) contain non-ASCII bytes — PowerShell 5.1 mis-decodes -File scripts`,
      nonAscii.map((x) => `${x.h}: first at line ${x.line}`).join("\n"),
      "agent-roster §5",
    );

  // 5. deny set
  const missingDeny = DENY_PATHS.flatMap((p) => [`Edit(${p})`, `Write(${p})`]).filter(
    (e) => !deny.includes(e),
  );
  if (missingDeny.length)
    r.fail(
      `permissions.deny is missing ${missingDeny.length} protected-path entries`,
      missingDeny.join("\n"),
      "CLAUDE.md §2 rule 9",
    );

  // 6. rule paths
  const ruleIssues = [];
  for (const f of rules) {
    for (const g of listOf(frontmatter(readSrc(`.claude/rules/${f}`))?.paths)) {
      const segs = g.split("/");
      const i = segs.findIndex((s) => /[*?[{]/.test(s));
      const base = i < 0 ? g : segs.slice(0, i).join("/");
      if (!exists(base))
        ruleIssues.push(
          `${f}: "${g}" → ${base} does not exist${plannedFor(base) ? " (planned)" : ""}`,
        );
    }
  }
  if (ruleIssues.length)
    r.warn(
      `${ruleIssues.length} rule path(s) point at nothing on disk yet`,
      ruleIssues.join("\n"),
      "agent-roster §5",
    );

  // 7. roster — first-column names in the Agent / Skill / Hook / Script tables must exist
  const roster = "docs/agent-roster.md";
  let rosterNames = 0;
  if (!exists(roster))
    r.warn("docs/agent-roster.md not written yet", undefined, "agent-roster §1");
  else {
    const auditScripts = filesIn("scripts/audit", ".mjs");
    const resolve = {
      Agent: (n) => agents.includes(n),
      Skill: (n) => skills.includes(n),
      Hook: (n) => hooks.includes(n),
      Script: (n) => auditScripts.includes(n),
    };
    const missing = { Agent: [], Skill: [], Hook: [], Script: [] };
    let column = null;
    for (const line of readSrc(roster).split(/\r?\n/)) {
      const header = line.match(/^\|\s*(Agent|Skill|Hook|Script)\s*\|/);
      if (header) column = header[1];
      else if (!line.startsWith("|")) column = null;
      else if (column && !/^\|\s*-/.test(line)) {
        for (const m of (line.split("|")[1] ?? "").matchAll(/`([^`]+)`/g)) {
          rosterNames++;
          if (!resolve[column](m[1]))
            missing[column].push(`${column.toLowerCase()} ${m[1]}`);
        }
      }
    }
    const hard = [...missing.Agent, ...missing.Skill, ...missing.Hook];
    if (hard.length)
      r.fail(
        `docs/agent-roster.md names ${hard.length} agent/skill/hook(s) that do not exist on disk`,
        hard.join("\n"),
        "agent-roster §1",
      );
    if (missing.Script.length)
      r.warn(
        `docs/agent-roster.md lists ${missing.Script.length} audit script(s) not yet on disk`,
        missing.Script.join(", "),
        "agent-roster §4",
      );
  }

  // 8. package.json scripts
  const scripts = JSON.parse(readSrc("package.json")).scripts ?? {};
  const missingScripts = NPM_SCRIPTS.filter((s) => !scripts[s]);
  if (missingScripts.length)
    r.fail(
      `package.json lacks npm script(s): ${missingScripts.join(", ")}`,
      undefined,
      "agent-roster §4",
    );

  r.metric("agents", agents.length);
  r.metric("skills", skills.length);
  r.metric("hooks", hooks.length);
  r.metric("rules", rules.length);
  r.metric("citationsChecked", checked);
  r.metric("deadCitations", dead.length);
  r.metric("outOfRange", outOfRange.length);
  r.metric("missingSkillAllow", missingAllow.length);
  r.metric("staleSkillAllow", staleAllow.length);
  r.metric("plannedRefs", plannedRefs);
  r.metric("rosterNames", rosterNames);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
