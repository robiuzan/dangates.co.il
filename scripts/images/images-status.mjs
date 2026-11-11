/**
 * images-status.mjs — plan vs manifest, per route. A status report, not a gate: exit 0 always.
 *
 * content/images/plan.json (authored by the art-director agent; the toolkit only reads it) says
 * which slots each route SHOULD carry; content/images/manifest.json (written by the toolkit) says
 * what exists and in which status. This prints, for every content route, the planned slots, what
 * is approved, what is still a candidate, and what is missing — the list the next batch is built
 * from. A missing plan.json is tolerated (manifest-only view), so the report works on day one.
 *
 * The routes come from the same rows and layout the gate reads; this file is the fleet's.
 *
 * Usage: node scripts/images/images-status.mjs   (= npm run images:status)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contentRoutesOf } from "./lib/manifest-rules.mjs";
import { readRows } from "./lib/site-lists.mjs";

process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".."));

const read = (f) =>
  fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, "")) : null;
const plan = read("content/images/plan.json");
const manifest = read("content/images/manifest.json");
if (!manifest) {
  console.error("images-status: content/images/manifest.json is missing");
  process.exit(1);
}

const rows = readRows();
const contentRoutes = contentRoutesOf(rows);
if (!rows.services.length)
  console.warn("images-status: WARNING — read no services; check lists in site.json");

/** One position on a route: the gallery's twelve tiles share the slot `generated` and differ by order. */
const positionOf = ({ slot, order }) => `${slot} #${order ?? 1}`;

const planned = new Map(); // route → [position]
if (plan) {
  for (const s of [...(plan.slots ?? []), ...(plan.reuse ?? [])])
    planned.set(s.route, [...(planned.get(s.route) ?? []), positionOf(s)]);
}
const have = new Map(); // route → { position → [status] }
for (const e of manifest.images ?? [])
  for (const pl of e.placements ?? []) {
    const positions = have.get(pl.route) ?? new Map();
    const at = positionOf(pl);
    positions.set(at, [...(positions.get(at) ?? []), e.status]);
    have.set(pl.route, positions);
  }

const routes = [...new Set([...contentRoutes, ...planned.keys(), ...have.keys()])].sort();
const totals = { planned: 0, approved: 0, candidate: 0, missing: 0 };
console.log(
  `images-status: ${plan ? `plan ${(plan.slots ?? []).length} slots + ${(plan.reuse ?? []).length} reuse` : "no content/images/plan.json yet"}; manifest ${(manifest.images ?? []).length} entries; ${contentRoutes.length} content routes\n`,
);
console.log(
  "  route                                            approved  candidate  missing (planned slot)",
);
for (const route of routes) {
  const positions = have.get(route) ?? new Map();
  const approved = [...positions]
    .filter(([, st]) => st.includes("approved"))
    .map(([s]) => s);
  const candidate = [...positions]
    .filter(([, st]) => st.includes("candidate") && !st.includes("approved"))
    .map(([s]) => s);
  const want = planned.get(route) ?? [];
  const missing = want.filter((w) => !approved.includes(w) && !candidate.includes(w));
  totals.planned += want.length;
  totals.approved += approved.length;
  totals.candidate += candidate.length;
  totals.missing += missing.length;
  const flag = !contentRoutes.includes(route) ? "  ⚠ not a content route" : "";
  console.log(
    `  ${route.padEnd(48)} ${String(approved.length).padStart(8)} ${String(candidate.length).padStart(10)}  ${missing.join(", ") || (want.length ? "—" : plan ? "(unplanned)" : "")}${flag}`,
  );
}
console.log(
  `\n  planned ${totals.planned} · approved ${totals.approved} · candidate ${totals.candidate} · missing ${totals.missing}` +
    (plan ? "" : " (no plan: nothing can be missing yet)"),
);
