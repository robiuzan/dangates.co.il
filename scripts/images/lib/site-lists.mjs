/**
 * site-lists.mjs — the rows behind the route groups, read out of the site's own TS files.
 *
 * This code cannot import TS, and typing the lists here would be a second copy that drifts, so it
 * reads the same arrays with ts-scan.mjs, the scanner the toolkit itself uses (a byte-for-byte
 * copy). The gate then checks the rows against the directories of out/, so a row the scanner
 * cannot read fails the build instead of quietly leaving a page out of every rule.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lists } from "./images.config.mjs";
import { TOPIC_GROUPS } from "./manifest-rules.mjs";
import { objectStrings, topLevelObjects, tsArray } from "./ts-scan.mjs";

/** @typedef {import("./manifest-rules.mjs").SiteRow} SiteRow */

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const read = (rel) =>
  fs.readFileSync(path.join(ROOT, rel), "utf8").replace(/^\uFEFF/, "");

function arrayRows(cfg, what) {
  if (!fs.existsSync(path.join(ROOT, cfg.file)))
    throw new Error(`lists.${what}: ${cfg.file} is missing`);
  const array = tsArray(read(cfg.file), cfg.const);
  if (!array)
    throw new Error(`lists.${what}: no "export const ${cfg.const}" array in ${cfg.file}`);
  return topLevelObjects(array).map(objectStrings);
}

/** One row per data file of a folder; the registry and the types file are not content. */
function folderRows(cfg, keys) {
  const firstString = (text, key) =>
    new RegExp(`^\\s*${key}:\\s*"([^"]+)"`, "m").exec(text)?.[1] ?? null;
  return fs
    .readdirSync(path.join(ROOT, cfg.dir))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts")
    .sort()
    .map((f) => {
      const text = read(path.join(cfg.dir, f));
      return Object.fromEntries(keys.map((k) => [k, firstString(text, k)]));
    });
}

const rowsOf = (cfg, what, keys) =>
  cfg.file ? arrayRows(cfg, what) : folderRows(cfg, keys);

/**
 * The rows of every configured group, the site's own lists included: lib/images.ts holds the same
 * groups, so the app and the gate see one set of routes. A group the site does not have is an
 * empty list.
 * @returns {{ services: SiteRow[], areas: SiteRow[], articles: SiteRow[], jobs: SiteRow[], [group: string]: SiteRow[] }}
 */
export function readRows() {
  const { services, areas, articles, jobs } = lists;
  const rows = {
    services: services
      ? rowsOf(services, "services", ["slug", "name", "title"]).filter((r) => r.slug)
      : [],
    areas: areas
      ? rowsOf(areas, "areas", ["slug", "name", "title"]).filter((r) => r.name ?? r.title)
      : [],
    articles: articles
      ? rowsOf(articles, "articles", ["slug", "title"]).filter((r) => r.slug)
      : [],
    jobs: jobs
      ? rowsOf(jobs, "jobs", ["pillar", "slug", "title"]).filter(
          (r) => r.pillar && r.slug,
        )
      : [],
  };
  for (const group of TOPIC_GROUPS)
    rows[group] = rowsOf(lists[group], group, ["slug", "name", "title"]).filter(
      (r) => r.slug,
    );
  return rows;
}
