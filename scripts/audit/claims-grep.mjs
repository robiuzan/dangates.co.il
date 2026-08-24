/**
 * claims-grep.mjs — unconfirmed business claims in shipped copy (CLAUDE.md golden rule 1,
 * content-standards §6, docs/business-facts.md, backlog §7.2).
 *
 *   - lexicon = scripts/audit/claims.json → .claims: { id, pattern, section, row, status, guard? }
 *   - scanned = claims.json .copyFiles plus app/**\/*.tsx and components/**\/*.tsx (copy still
 *     lives in route templates today). Comment lines (// * # /*) are skipped and counted as info,
 *     so the explanatory comments in lib/content.ts never trip the check.
 *   - status never → fail · unconfirmed → fail, or warn when every hit's line carries "🔶" /
 *     "confirm" (an acknowledged placeholder) · gated → fail unless the named guard is set
 *     (REVIEW_SOURCE_URL = a non-null string literal in lib/content.ts)
 *   - one finding per claim id: hit count, the business-facts row, up to 12 "file:line — match"
 *   - export: occurrences of each claim in contentPages() <main> text → metric liveOccurrences
 *     (what a visitor and an LLM actually see). A claim that is live but absent from the scanned
 *     sources (it reaches the page from site.config.json or the kit) still fails.
 *
 * Usage: node scripts/audit/claims-grep.mjs [--json]
 */

import {
  readSrc,
  sourceFiles,
  contentPages,
  mainText,
  outStaleness,
} from "./lib/pages.mjs";
import { Report, finish, isMain, parseArgs } from "./lib/report.mjs";

const LEXICON = "scripts/audit/claims.json";
const TEMPLATE_GLOBS = ["app/**/*.tsx", "components/**/*.tsx"];
const COMMENT_LINE = /^\s*(\/\/|\/\*|\*|#|\{\/\*)/;
const ACKNOWLEDGED = /🔶|confirm/i;
const MAX_DETAIL = 12;
/** The four claims backlog §7.2 counts (42 occurrences with nothing behind them). */
const BACKLOG_7_2 = new Set([
  "experience",
  "warranty-full",
  "national-coverage",
  "around-the-clock",
]);

/** Is a `gated` claim's guard satisfied? Unknown guard names count as unset. */
function guardIsSet(name) {
  if (name === "REVIEW_SOURCE_URL")
    return /REVIEW_SOURCE_URL:\s*string\s*\|\s*null\s*=\s*"[^"]+"/.test(
      readSrc("lib/content.ts"),
    );
  return false;
}

/** A one-line excerpt of a source line, whitespace collapsed, clipped for the detail list. */
function clip(line, max = 90) {
  const s = line.trim().replace(/\s+/g, " ");
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

/** Doc sections a finding cites: content-standards §6 + the business-facts row (+ backlog §7.2). */
function refFor(claim) {
  const parts = claim.section.startsWith("content-standards")
    ? [claim.section]
    : ["content-standards §6", `business-facts §${claim.section}`];
  if (BACKLOG_7_2.has(claim.id)) parts.push("backlog §7.2");
  return parts.join(" · ");
}

function rowLabel(claim) {
  return claim.section.startsWith("content-standards")
    ? `${claim.section}: ${claim.row}`
    : `business-facts §${claim.section}: ${claim.row}`;
}

function detailFor(hits, claim) {
  const lines = hits
    .slice(0, MAX_DETAIL)
    .map(
      (h) =>
        `${h.rel}:${h.line} — ${h.text}${h.ack ? " (🔶 acknowledged)" : ""} · «${h.snippet}»`,
    );
  if (hits.length > MAX_DETAIL) lines.push(`… and ${hits.length - MAX_DETAIL} more`);
  if (claim.note) lines.push(`lexicon note: ${claim.note}`);
  return lines.join("\n");
}

export function run() {
  const r = new Report(
    "claims-grep",
    "Unconfirmed business claims in shipped copy (golden rule 1, content-standards §6, business-facts.md).",
  );
  const lexicon = JSON.parse(readSrc(LEXICON));
  const claims = lexicon.claims.map((c) => ({ ...c, re: new RegExp(c.pattern, "g") }));
  const files = sourceFiles([...lexicon.copyFiles, ...TEMPLATE_GLOBS]);

  // ── source scan: id → [{ rel, line, text, ack, snippet }], comment-line hits counted apart ──
  const hits = new Map(claims.map((c) => [c.id, []]));
  const commentHits = new Map(claims.map((c) => [c.id, 0]));
  for (const f of files) {
    readSrc(f.rel)
      .split(/\r?\n/)
      .forEach((line, i) => {
        const isComment = COMMENT_LINE.test(line);
        for (const c of claims) {
          for (const m of line.matchAll(c.re)) {
            if (isComment) commentHits.set(c.id, commentHits.get(c.id) + 1);
            else
              hits.get(c.id).push({
                rel: f.rel,
                line: i + 1,
                text: m[0],
                ack: ACKNOWLEDGED.test(line),
                snippet: clip(line),
              });
          }
        }
      });
  }

  // ── export scan: what actually renders inside <main> ──
  const pages = contentPages();
  const live = Object.fromEntries(claims.map((c) => [c.id, 0]));
  const livePages = Object.fromEntries(claims.map((c) => [c.id, 0]));
  for (const p of pages) {
    const text = mainText(p.html);
    for (const c of claims) {
      const n = [...text.matchAll(c.re)].length;
      if (n) {
        live[c.id] += n;
        livePages[c.id] += 1;
      }
    }
  }

  // ── one finding per claim id ──
  let failing = 0;
  let totalHits = 0;
  let acknowledgedHits = 0;
  for (const c of claims) {
    const list = hits.get(c.id);
    const ack = list.filter((h) => h.ack).length;
    const fileCount = new Set(list.map((h) => h.rel)).size;
    totalHits += list.length;
    acknowledgedHits += ack;
    const ref = refFor(c);
    const liveNote = pages.length
      ? `; live: ${live[c.id]} occurrence(s) on ${livePages[c.id]} page(s)`
      : "";
    const head = `${c.id} [${c.status}]: ${list.length} hit(s) in ${fileCount} file(s)${ack ? `, ${ack} acknowledged 🔶` : ""}${liveNote} — ${rowLabel(c)}`;
    const detail = detailFor(list, c);

    if (c.status === "gated" && guardIsSet(c.guard)) {
      if (list.length || live[c.id])
        r.note(`${head} — allowed, guard ${c.guard} is set`, detail, ref);
      continue;
    }
    if (!list.length && !live[c.id]) continue;
    if (!list.length) {
      // Live on the page but not in any scanned source: it arrives via site.config.json or the kit.
      r.fail(
        `${c.id} [${c.status}]: 0 source hits but ${live[c.id]} live occurrence(s) on ${livePages[c.id]} page(s) — reaches the page outside the scanned sources (site.config.json / @ishub/site-kit) — ${rowLabel(c)}`,
        c.note ? `lexicon note: ${c.note}` : undefined,
        ref,
      );
      failing++;
      continue;
    }
    if (c.status === "never") {
      r.fail(`${head} — never permitted`, detail, ref);
      failing++;
    } else if (c.status === "gated") {
      // A gated phrase that never reaches the page (e.g. the aria-label template inside the
      // guarded Reviews component) is the guard working, not a violation.
      if (pages.length && !live[c.id]) {
        r.note(
          `${head} — source-only, 0 live occurrences: the ${c.guard} guard is holding`,
          detail,
          ref,
        );
      } else {
        r.fail(`${head} — guard ${c.guard} is not set`, detail, ref);
        failing++;
      }
    } else if (ack < list.length) {
      r.fail(head, detail, ref);
      failing++;
    } else {
      r.warn(
        `${head} — acknowledged placeholders only; confirm the row or write around it`,
        detail,
        ref,
      );
    }
  }

  // ── context ──
  const skipped = [...commentHits].filter(([, n]) => n > 0);
  if (skipped.length) {
    const n = skipped.reduce((a, [, v]) => a + v, 0);
    r.note(
      `${n} hit(s) on comment lines skipped (explanatory comments, not shipped copy)`,
      skipped.map(([id, v]) => `${id}: ${v}`).join("\n"),
    );
  }
  const s = outStaleness();
  if (s.missing)
    r.note("out/ is missing — liveOccurrences not measured; run `npm run build` first");
  else if (s.stale)
    r.note(
      `out/ is stale (${s.newest} is newer than out/index.html) — liveOccurrences describe the previous build`,
      undefined,
      "backlog N12",
    );

  r.metric("claimsChecked", claims.length);
  r.metric("filesScanned", files.length);
  r.metric("pagesScanned", pages.length);
  r.metric("failingClaims", failing);
  r.metric("totalHits", totalHits);
  r.metric("acknowledgedHits", acknowledgedHits);
  r.metric(
    "commentHits",
    skipped.reduce((a, [, v]) => a + v, 0),
  );
  r.metric("liveOccurrences", live);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
