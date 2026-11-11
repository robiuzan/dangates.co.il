/**
 * images.mjs — the page-images gate as an audit check (CLAUDE.md §15, backlog N37).
 *
 * A thin wrapper: scripts/images/check-images-out.mjs is the gate (it also runs last in `postbuild`);
 * this check runs it against out/ and turns every failing check it prints into one failure, so the
 * `images` scope and `npm run audit` count it like any other. It owns no rule of its own.
 *
 * Run it in the same mode as the build: the gate prunes out/images/_candidates/ and a stale
 * .images-draft in a production run, and marks out/ as a draft when IMAGES_DRAFT=1 is set.
 *
 * Usage: node scripts/audit/images.mjs [--json]
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { ROOT, OUT } from "./lib/pages.mjs";
import { Report, finish, isMain, parseArgs } from "./lib/report.mjs";

const GATE = path.join(ROOT, "scripts", "images", "check-images-out.mjs");

export function run() {
  const r = new Report(
    "images",
    "Does the export carry exactly the images content/images/manifest.json says? (CLAUDE.md §15)",
  );
  const res = spawnSync(process.execPath, [GATE, path.relative(ROOT, OUT) || "out"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (res.error) {
    r.fail(
      "could not run scripts/images/check-images-out.mjs",
      String(res.error.message),
    );
    return r;
  }
  const stdout = res.stdout ?? "";
  const stderr = res.stderr ?? "";

  // The gate's own one-line summaries, for the audit report.
  const emitted = stdout.match(/(\d+) emitted routes?/);
  const summary = stdout.match(
    /(\d+) content routes · (\d+) with images · (\d+) manifest entries/,
  );
  if (emitted) r.metric("emittedRoutes", Number(emitted[1]));
  if (summary) {
    r.metric("contentRoutes", Number(summary[1]));
    r.metric("routesWithImages", Number(summary[2]));
    r.metric("manifestEntries", Number(summary[3]));
  }

  if (res.status === 0) return r;

  // Failing checks print as "  ✗ <label>", then an optional hint (4 spaces) and offenders (6 spaces).
  const lines = stderr.split(/\r?\n/);
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^ {2}✗ (.+)$/);
    if (!m) continue;
    const detail = [];
    while (i + 1 < lines.length && /^ {4,}\S/.test(lines[i + 1]))
      detail.push(lines[++i].trim());
    r.fail(m[1], detail.join("\n") || undefined, "backlog N37");
    count++;
  }
  if (count === 0)
    r.fail(
      `the images gate exited ${res.status} without a failing check`,
      (stderr || stdout).trim().split(/\r?\n/).slice(-8).join("\n"),
      "backlog N37",
    );
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
