/**
 * run-all.mjs — the deterministic half of the site audit. `npm run audit [-- --scope x] [--json]`.
 *
 * Runs every check in scripts/audit/ for the requested scope against the static export and the
 * source tree, prints one markdown report (or JSON), and exits with the failure count — the same
 * contract as ops/validate-manifests.ps1, so `npm run gate` and the /audit skill can count.
 *
 * Refuses to audit a stale export: if anything under app/ components/ lib/ public/ is newer than
 * out/index.html the numbers would describe a build nobody shipped (backlog N12). Rebuild first.
 *
 * Scopes → checks (a check may sit in several scopes):
 *   seo       titles links content-depth
 *   schema    schema
 *   content   content-depth spam-grep claims-grep
 *   cro       cta-coverage
 *   security  edge spam-grep
 *   perf      perf
 *   a11y      a11y rtl-lint
 *   env       env-doctor   (source-only; also `npm run audit:env`)
 *   full      everything except env-doctor
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { outStaleness } from "./lib/pages.mjs";
import { Report, finish, parseArgs } from "./lib/report.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CHECKS = {
  titles: { file: "titles.mjs", scopes: ["seo"], needsOut: true },
  links: { file: "links.mjs", scopes: ["seo"], needsOut: true },
  "content-depth": {
    file: "content-depth.mjs",
    scopes: ["seo", "content"],
    needsOut: true,
  },
  schema: { file: "schema.mjs", scopes: ["schema"], needsOut: true },
  "cta-coverage": { file: "cta-coverage.mjs", scopes: ["cro"], needsOut: true },
  "spam-grep": {
    file: "spam-grep.mjs",
    scopes: ["content", "security"],
    needsOut: false,
  },
  "claims-grep": { file: "claims-grep.mjs", scopes: ["content"], needsOut: false },
  "rtl-lint": { file: "rtl-lint.mjs", scopes: ["a11y"], needsOut: false },
  a11y: { file: "a11y.mjs", scopes: ["a11y"], needsOut: true },
  perf: { file: "perf.mjs", scopes: ["perf"], needsOut: true },
  edge: { file: "edge.mjs", scopes: ["security"], needsOut: true },
  "env-doctor": { file: "env-doctor.mjs", scopes: ["env"], needsOut: false },
};

export function checksForScope(scope) {
  return Object.entries(CHECKS)
    .filter(([name, c]) =>
      scope === "full" ? name !== "env-doctor" : c.scopes.includes(scope),
    )
    .map(([name, c]) => ({ name, ...c }));
}

export async function runAll(scope = "full") {
  const reports = [];
  const selected = checksForScope(scope);
  if (!selected.length) {
    const r = new Report("run-all");
    r.fail(
      `unknown scope "${scope}"`,
      `known: full, ${[...new Set(Object.values(CHECKS).flatMap((c) => c.scopes))].join(", ")}`,
    );
    return [r];
  }

  if (selected.some((c) => c.needsOut)) {
    const s = outStaleness();
    const r = new Report(
      "export",
      "Is out/ a current build of the source tree? (backlog N12)",
    );
    if (s.missing) {
      r.fail("out/ is missing — run `npm run build` first");
      return [r];
    }
    if (s.stale) {
      r.fail(
        `out/ is stale — ${s.newest} is newer than out/index.html (built ${s.builtAt}). Rebuild before auditing.`,
        undefined,
        "backlog N12",
      );
      return [r];
    }
    r.note(`out/ built ${s.builtAt}; source tree unchanged since`);
    reports.push(r);
  }

  for (const c of selected) {
    const abs = path.join(__dirname, c.file);
    if (!existsSync(abs)) {
      const r = new Report(c.name);
      r.warn(`check not implemented yet (${c.file} missing)`);
      reports.push(r);
      continue;
    }
    try {
      const mod = await import(pathToFileURL(abs).href);
      const result = await mod.run({ scope });
      reports.push(...(Array.isArray(result) ? result : [result]));
    } catch (e) {
      const r = new Report(c.name);
      r.fail(`check crashed: ${e.message}`, e.stack);
      reports.push(r);
    }
  }
  return reports;
}

if (
  path.resolve(process.argv[1] ?? "") === path.resolve(fileURLToPath(import.meta.url))
) {
  const args = parseArgs();
  const reports = await runAll(args.scope);
  const failures = finish(reports, args);
  if (!args.json && !args.quiet) {
    const names = reports.map((r) => `${r.ok ? "✅" : "❌"} ${r.name}`).join("  ");
    process.stdout.write(
      `\n---\n**scope ${args.scope} — ${failures} failure(s)**  ${names}\n`,
    );
  }
}
