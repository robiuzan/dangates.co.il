/**
 * rtl-lint.mjs — banned physical Tailwind utilities and hardcoded colours in markup
 * (CLAUDE.md §6–§7, backlog §11.5, .claude/rules/rtl-markup.md).
 *
 *   - regex A: pl-/pr-/ml-/mr-/left-/right-/text-left/text-right in app/**\/*.tsx, components/**\/*.tsx
 *     → ONE failure with the count and a file:line list (CLAUDE.md §6). A line carrying the literal
 *     marker "direction-agnostic" is the sanctioned exception and is skipped.
 *   - regex B: hex colour literals (#RGB/#RGBA/#RRGGBB/#RRGGBBAA) in the same files → ONE failure
 *     (CLAUDE.md §7 — use the @theme tokens). Matches sitting in href="#…" / id="#…" are anchors,
 *     not colours, and are ignored.
 *   - "use client" census: every file carrying the directive is listed; any outside the known set
 *     (Header, Faq, LeadForm, Reveal) is a warning (CLAUDE.md §7 "RSC by default").
 *
 * The two regexes are byte-identical to .claude/hooks/post-edit-lint.ps1 ($rtlRx / $hexRx). Change
 * them in both places or the edit-time hook and the audit will disagree.
 *
 * Source-only: does not need out/. Usage: node scripts/audit/rtl-lint.mjs [--json]
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { sourceFiles } from "./lib/pages.mjs";
import { Report, finish, isMain, parseArgs } from "./lib/report.mjs";

/** Same as $rtlRx in post-edit-lint.ps1. */
// eslint-disable-next-line no-useless-escape -- kept byte-identical to the PowerShell hook
const BANNED_UTILITY_RX =
  /(?<![\w-])-?(pl|pr|ml|mr|left|right)-[0-9a-z\[\(]|(?<![\w-])text-(left|right)(?![\w-])/g;
/** Same as $hexRx in post-edit-lint.ps1. */
const HEX_LITERAL_RX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
/** A `#…` immediately after href=" / id=" is a fragment or element id, not a colour. */
const ANCHOR_PREFIX_RX = /\b(?:href|id)=["'`{]*$/;
/** The sanctioned per-line escape hatch (CLAUDE.md §6). Case-insensitive like the hook. */
const EXEMPT_MARKER = /direction-agnostic/i;
/** `"use client"` as the first statement (leading comments and blank lines allowed). */
const USE_CLIENT_RX = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["']/;

const SOURCE_GLOBS = ["app/**/*.tsx", "components/**/*.tsx"];
/** CLAUDE.md §7 — the components that are allowed to be client components today. */
const KNOWN_CLIENT = new Set(["Header", "Faq", "LeadForm", "Reveal"]);

/** Every match of `rx` on `line`, optionally rejecting matches by their left context. */
function matchesOn(line, rx, rejectPrefix = null) {
  const out = [];
  for (const m of line.matchAll(rx)) {
    if (rejectPrefix && rejectPrefix.test(line.slice(0, m.index))) continue;
    out.push(m[0].trim());
  }
  return out;
}

export function run() {
  const r = new Report(
    "rtl-lint",
    "Banned physical Tailwind utilities and hardcoded colours in markup (CLAUDE.md §6–§7, backlog §11.5).",
  );
  const files = sourceFiles(SOURCE_GLOBS);

  /** @type {{ where: string, match: string }[]} */ const banned = [];
  /** @type {{ where: string, match: string }[]} */ const hex = [];
  const bannedLines = new Set();
  const hexLines = new Set();
  const clientFiles = [];
  let exemptLines = 0;

  for (const f of files) {
    const src = readFileSync(f.abs, "utf8");
    if (USE_CLIENT_RX.test(src)) clientFiles.push(f.rel);

    src.split(/\r?\n/).forEach((line, i) => {
      if (EXEMPT_MARKER.test(line)) {
        exemptLines++;
        return;
      }
      const where = `${f.rel}:${i + 1}`;
      for (const match of matchesOn(line, BANNED_UTILITY_RX)) {
        banned.push({ where, match });
        bannedLines.add(where);
      }
      for (const match of matchesOn(line, HEX_LITERAL_RX, ANCHOR_PREFIX_RX)) {
        hex.push({ where, match });
        hexLines.add(where);
      }
    });
  }

  const list = (hits) => hits.map((h) => `${h.where} — ${h.match}`).join("\n");

  if (banned.length)
    r.fail(
      `${banned.length} banned physical utilit${banned.length === 1 ? "y" : "ies"} on ${bannedLines.size} line(s) — use ps/pe/ms/me/start/end/text-start/text-end`,
      list(banned),
      "CLAUDE.md §6 / backlog §11.5",
    );
  if (hex.length)
    r.fail(
      `${hex.length} hardcoded hex colour literal(s) on ${hexLines.size} line(s) in ${new Set([...hexLines].map((w) => w.split(":")[0])).size} file(s) — use a @theme token (primary/secondary/accent-*)`,
      list(hex),
      "CLAUDE.md §7 / rules/rtl-markup.md",
    );

  const unexpectedClient = clientFiles.filter(
    (rel) => !KNOWN_CLIENT.has(path.basename(rel, ".tsx")),
  );
  if (unexpectedClient.length)
    r.warn(
      `${unexpectedClient.length} "use client" file(s) outside the known set (${[...KNOWN_CLIENT].join(", ")})`,
      unexpectedClient.join("\n"),
      "CLAUDE.md §7 (RSC by default)",
    );
  r.note(
    `${clientFiles.length} client component(s): ${clientFiles.map((rel) => path.basename(rel, ".tsx")).join(", ") || "none"}`,
    undefined,
    "CLAUDE.md §7",
  );
  if (exemptLines)
    r.note(
      `${exemptLines} line(s) skipped via the "direction-agnostic" marker`,
      undefined,
      "CLAUDE.md §6",
    );

  r.metric("filesScanned", files.length);
  r.metric("bannedUtilities", banned.length);
  r.metric("bannedUtilityLines", bannedLines.size);
  r.metric("hexLiterals", hex.length);
  r.metric("hexLiteralLines", hexLines.size);
  r.metric("clientComponents", clientFiles.length);
  r.metric("clientComponentFiles", clientFiles);
  r.metric("directionAgnosticExemptions", exemptLines);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
