/**
 * report.mjs — the one result shape every scripts/audit/* check produces.
 *
 * Contract (cited by docs/agent-roster.md and the qa-build-gate skill):
 *   - a check exports `run(opts)` returning a Report and, when executed directly, calls `finish()`
 *   - failures are the things the acceptance bar forbids; warnings are real but not blocking;
 *     info is context the audit report quotes
 *   - `finish()` prints markdown (or JSON with --json) and sets process.exitCode = failures.length,
 *     mirroring ops/validate-manifests.ps1 so CI and the /audit skill can count
 *
 * No dependencies, Node ≥ 18, ESM.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Thresholds live in one JSON file so agents cite a path, not a number. */
export const THRESHOLDS = JSON.parse(
  readFileSync(path.join(__dirname, "..", "thresholds.json"), "utf8"),
);

/** Parse `--json`, `--scope x`, `--quiet` and free flags from argv. */
export function parseArgs(argv = process.argv.slice(2)) {
  const out = { json: false, quiet: false, scope: "full", flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--quiet") out.quiet = true;
    else if (a === "--scope") out.scope = argv[++i] ?? "full";
    else if (a.startsWith("--scope=")) out.scope = a.slice(8);
    else if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      out.flags[k] = v ?? true;
    }
  }
  return out;
}

/**
 * @typedef {{ msg: string, detail?: string, ref?: string }} Finding
 *   ref = the backlog/doc section this maps to, e.g. "backlog §9.2" or "content-standards §1"
 */

export class Report {
  /** @param {string} name  @param {string} [description] */
  constructor(name, description = "") {
    this.name = name;
    this.description = description;
    /** @type {Finding[]} */ this.failures = [];
    /** @type {Finding[]} */ this.warnings = [];
    /** @type {Finding[]} */ this.info = [];
    /** @type {Record<string, unknown>} */ this.metrics = {};
  }
  fail(msg, detail, ref) {
    this.failures.push({ msg, detail, ref });
    return this;
  }
  warn(msg, detail, ref) {
    this.warnings.push({ msg, detail, ref });
    return this;
  }
  note(msg, detail, ref) {
    this.info.push({ msg, detail, ref });
    return this;
  }
  metric(key, value) {
    this.metrics[key] = value;
    return this;
  }
  get ok() {
    return this.failures.length === 0;
  }
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      ok: this.ok,
      failures: this.failures,
      warnings: this.warnings,
      info: this.info,
      metrics: this.metrics,
    };
  }
  /** Markdown block for the /audit report. */
  toMarkdown() {
    const lines = [];
    const verdict = this.ok ? "✅ pass" : `❌ ${this.failures.length} failure(s)`;
    lines.push(`### ${this.name} — ${verdict}`);
    if (this.description) lines.push(this.description);
    const metricKeys = Object.keys(this.metrics);
    if (metricKeys.length) {
      lines.push("");
      lines.push("| metric | value |", "| --- | --- |");
      for (const k of metricKeys) lines.push(`| ${k} | ${fmt(this.metrics[k])} |`);
    }
    const section = (title, items) => {
      if (!items.length) return;
      lines.push("", `**${title}**`);
      for (const f of items) {
        const ref = f.ref ? ` _(${f.ref})_` : "";
        lines.push(`- ${f.msg}${ref}`);
        if (f.detail) lines.push(`  - ${String(f.detail).replace(/\n/g, "\n    ")}`);
      }
    };
    section("Failures", this.failures);
    section("Warnings", this.warnings);
    section("Info", this.info);
    return lines.join("\n");
  }
}

function fmt(v) {
  if (Array.isArray(v))
    return v.length > 8 ? `${v.slice(0, 8).join(", ")} … (${v.length})` : v.join(", ");
  if (typeof v === "object" && v !== null) return "`" + JSON.stringify(v) + "`";
  return String(v);
}

/**
 * Print and set the exit code. Call once, from the script's direct-execution branch.
 * @param {Report | Report[]} reports
 * @param {{json?: boolean, quiet?: boolean}} [opts]
 */
export function finish(reports, opts = {}) {
  const list = Array.isArray(reports) ? reports : [reports];
  const failures = list.reduce((n, r) => n + r.failures.length, 0);
  if (opts.json) {
    process.stdout.write(
      JSON.stringify(
        { ok: failures === 0, failures, reports: list.map((r) => r.toJSON()) },
        null,
        2,
      ) + "\n",
    );
  } else if (!opts.quiet) {
    process.stdout.write(list.map((r) => r.toMarkdown()).join("\n\n") + "\n");
  }
  process.exitCode = Math.min(failures, 255);
  return failures;
}

/** True when this module file is the entry point (for the `run()`-or-`finish()` split). */
export function isMain(importMetaUrl) {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === path.resolve(fileURLToPath(importMetaUrl));
}
