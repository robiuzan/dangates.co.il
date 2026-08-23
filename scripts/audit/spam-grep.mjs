/**
 * spam-grep.mjs — migrated-content hygiene (CLAUDE.md golden rule 7, content-standards §9).
 *
 *   - claims.json `.spam` tokens (onlyfans, casino, allgatesrepair …), case-insensitive, across
 *     claims.json `.copyFiles` + app/**\/*.tsx + components/**\/*.tsx + out/**\/index.html
 *     (content pages only, raw HTML — the same surface as the §9 grep). Any hit fails, one
 *     finding per token with a file:line list.
 *   - migration debris in lib/posts.ts:
 *       (a) run-together words from a stripped <strong>: a Hebrew word ≥ 14 letters with a
 *           final-form letter (ך ם ן ף ץ) mid-word → warn (backlog §3.9)
 *       (b) emoji in body copy (U+1F300–U+1FAFF, U+2600–U+27BF) → warn, count per emoji
 *           (content-standards §4)
 *       (c) Latin curly quotes U+2018/2019/201C/201D → warn with file:line (backlog §3.12)
 *       (d) the dead "פוסטים קשורים" tail → fail (backlog §3.7)
 *
 * Source-only apart from the out/ sweep, which is skipped with a note when out/ is absent.
 *
 * Usage: node scripts/audit/spam-grep.mjs [--json]
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { OUT, contentPages, readSrc, sourceFiles } from "./lib/pages.mjs";
import { Report, finish, isMain, parseArgs } from "./lib/report.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLAIMS = JSON.parse(readFileSync(path.join(__dirname, "claims.json"), "utf8"));

const RULE7 = "CLAUDE.md golden rule 7 · content-standards §9";
const POSTS = "lib/posts.ts";
const HEB = "א-ת"; // Hebrew letters incl. final forms
const FINAL = "ךםןףץ";
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;
const CURLY_RE = /[‘’“”]/g;
const RELATED_RE = /פוסטים קשורים/g;

// ── local helpers (candidates for lib/pages.mjs) ────────────────────────────

/** Every match of `re` in `text` as { line, col, match, context } (1-based line/col). */
function lineHits(text, re, ctx = 30) {
  const hits = [];
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  for (const m of text.matchAll(re)) {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= m.index) lo = mid;
      else hi = mid - 1;
    }
    const context = text
      .slice(Math.max(0, m.index - ctx), m.index + m[0].length + ctx)
      .replace(/\s+/g, " ")
      .trim();
    hits.push({ line: lo + 1, col: m.index - starts[lo] + 1, match: m[0], context });
  }
  return hits;
}

/** Escape a literal for use inside a RegExp. */
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** `file:line` list, capped so one root cause never floods the report. */
function locList(hits, max = 12) {
  const lines = hits.map((h) => `${h.file}:${h.line}  …${h.context}…`);
  return lines.length > max
    ? [...lines.slice(0, max), `… and ${lines.length - max} more`].join("\n")
    : lines.join("\n");
}

// ── check ───────────────────────────────────────────────────────────────────

export function run() {
  const r = new Report(
    "spam-grep",
    "Injected spam and migration debris in the copy, the components and the export (golden rule 7, content-standards §9).",
  );

  // 1. Files to sweep for the spam lexicon: copy files + JSX + the emitted content pages.
  const sources = sourceFiles([
    ...CLAIMS.copyFiles,
    "app/**/*.tsx",
    "components/**/*.tsx",
  ]).map((f) => ({
    rel: f.rel,
    text: readFileSync(f.abs, "utf8"),
  }));
  const outPages = existsSync(OUT) ? contentPages() : [];
  if (!outPages.length)
    r.note(
      "out/ not present or has no content pages — the export sweep was skipped (source-only run)",
    );
  const files = [...sources, ...outPages.map((p) => ({ rel: p.file, text: p.html }))];

  // 2. Spam tokens — fail, grouped per token.
  let spamHits = 0;
  for (const token of CLAIMS.spam) {
    const re = new RegExp(escapeRe(token), "gi");
    const hits = [];
    for (const f of files)
      for (const h of lineHits(f.text, re)) hits.push({ file: f.rel, ...h });
    if (!hits.length) continue;
    spamHits += hits.length;
    const fileCount = new Set(hits.map((h) => h.file)).size;
    r.fail(
      `spam token "${token}" found ${hits.length}× in ${fileCount} file(s)`,
      locList(hits),
      RULE7,
    );
  }

  // 3. Migration debris in lib/posts.ts.
  const posts = existsSync(path.join(__dirname, "..", "..", POSTS)) ? readSrc(POSTS) : "";
  if (!posts) r.warn(`${POSTS} not found — debris checks skipped`, undefined, RULE7);

  // (a) run-together words: a final-form letter followed by more Hebrew letters inside one long word.
  const fused = [];
  for (const h of lineHits(posts, new RegExp(`[${HEB}]{14,}`, "g"), 0)) {
    if (new RegExp(`[${FINAL}][${HEB}]+`).test(h.match))
      fused.push({ file: POSTS, ...h, context: h.match });
  }
  if (fused.length)
    r.warn(
      `${fused.length} run-together Hebrew word(s) in ${POSTS} (stripped <strong>?)`,
      locList(fused, 20),
      "backlog §3.9 · content-standards §9",
    );

  // (b) emoji in body copy, counted per emoji.
  const emoji = new Map();
  const emojiHits = lineHits(posts, EMOJI_RE, 0);
  for (const h of emojiHits) emoji.set(h.match, (emoji.get(h.match) ?? 0) + 1);
  if (emojiHits.length) {
    const perEmoji = [...emoji.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([e, n]) => `${e} ×${n}`);
    const lines = [...new Set(emojiHits.map((h) => h.line))];
    r.warn(
      `${emojiHits.length} emoji in ${POSTS} body copy (${emoji.size} distinct)`,
      `${perEmoji.join("  ")}\nlines: ${lines.slice(0, 20).join(", ")}${lines.length > 20 ? ` … (${lines.length})` : ""}`,
      "content-standards §4",
    );
  }

  // (c) Latin curly quotes.
  const curly = lineHits(posts, CURLY_RE, 20).map((h) => ({ file: POSTS, ...h }));
  if (curly.length) {
    const reversed = lineHits(posts, /(?<=^|[\s("])”/gm, 0).length; // backlog §3.12: U+201D as an opening mark
    r.warn(
      `${curly.length} Latin curly quote(s) in ${POSTS} — use גרש ׳ / גרשיים ״${reversed ? ` (${reversed} used as an opening mark)` : ""}`,
      locList(curly, 20),
      "backlog §3.12 · content-standards §7",
    );
  }

  // (d) the dead "פוסטים קשורים" tail.
  const related = lineHits(posts, RELATED_RE).map((h) => ({ file: POSTS, ...h }));
  if (related.length)
    r.fail(
      `"פוסטים קשורים" tail still present in ${POSTS} (${related.length} occurrence(s))`,
      locList(related, 20),
      "backlog §3.7",
    );

  r.metric("filesScanned", files.length);
  r.metric("sourceFiles", sources.length);
  r.metric("outPages", outPages.length);
  r.metric("spamTokens", CLAIMS.spam.length);
  r.metric("spamHits", spamHits);
  r.metric("emojiCount", emojiHits.length);
  r.metric("emojiByKind", Object.fromEntries(emoji));
  r.metric("curlyQuotes", curly.length);
  r.metric("fusedWords", fused.length);
  r.metric("relatedTails", related.length);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
