/**
 * content-depth.mjs — word floors per route type and the doorway-test proxy on the export
 * (content-standards §1–§2 and §5, backlog §3.1/§3.2/§3.13/§6.2, new-city / new-service skills).
 *
 *   - "unique words" inside <main> ≥ thresholds.wordFloors[type]; floor 0 = no minimum. Unique is
 *     content-standards §1's definition: total in-main words MINUS the words of any paragraph that
 *     renders verbatim on ≥ thresholds.sharedBlocks.minPages routes (the FinalCta lede, the shared
 *     service teasers) — site chrome is already outside <main>. Total words and the distinct-token
 *     count are reported alongside for context
 *   - doorway proxy: every location / service page must carry ≥ thresholds.doorwayMinUniqueTokens
 *     tokens that its nearest same-type sibling lacks (token-set difference, min over siblings)
 *   - answer block: the first <p> after the <h1> on service/location/post/guide pages falls inside
 *     thresholds.answerBlock (warn — today that <p> is the PageHeader subtitle, a date on posts)
 *   - shared blocks: a <p> of ≥ thresholds.sharedBlocks.minWords words rendered verbatim on ≥
 *     minPages content pages is listed (warn, top 5) and subtracted from every page's unique count
 *
 * Usage: node scripts/audit/content-depth.mjs [--json]
 */

import { contentPages, mainText, stripTags, tokens } from "./lib/pages.mjs";
import { Report, THRESHOLDS, finish, isMain, parseArgs } from "./lib/report.mjs";

const DOORWAY_TYPES = ["location", "service"];
const ANSWER_TYPES = ["service", "location", "post", "guide"];
const SHARED_MIN_WORDS = THRESHOLDS.sharedBlocks?.minWords ?? 12;
const SHARED_MIN_PAGES = THRESHOLDS.sharedBlocks?.minPages ?? 3;
/** The backlog item that owns each route type's depth problem (content-standards §1 is cited on all). */
const BACKLOG = {
  location: "backlog §3.1",
  service: "backlog §3.2",
  "services-index": "backlog §3.13",
  "areas-index": "backlog §3.13",
  "blog-index": "backlog §3.13",
  "guides-index": "backlog §3.13",
  pricing: "backlog §3.13",
  about: "backlog §3.13",
};

// ── local helpers (candidates for lib/pages.mjs) ────────────────────────────

/** Median of a numeric list; 0 for an empty list. */
function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Inner HTML of <main> (the whole document when a page has no main). */
function mainHtml(html) {
  return html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
}

/** Text of every <p> inside <main>, in document order. */
function paragraphs(html) {
  return [...mainHtml(html).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    stripTags(m[1]),
  );
}

/** Text of the first <p> after </h1> inside <main>; null when there is no h1 or no paragraph after it. */
function firstParagraphAfterH1(html) {
  const main = mainHtml(html);
  const at = main.search(/<\/h1>/i);
  if (at < 0) return null;
  const m = main.slice(at).match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  return m ? stripTags(m[1]) : null;
}

/** Tokens in `a` that `b` lacks (set-difference size). */
function tokensMissingFrom(a, b) {
  let n = 0;
  for (const t of a) if (!b.has(t)) n++;
  return n;
}

const refs = (...parts) => parts.filter(Boolean).join(", ");

// ── the check ───────────────────────────────────────────────────────────────

export function run() {
  const r = new Report(
    "content-depth",
    "Word floors per route type, the doorway-test proxy, the answer block and shared blocks (content-standards §1–§2, §5).",
  );
  const pages = contentPages().map((p) => {
    const toks = tokens(mainText(p.html));
    return {
      ...p,
      words: toks.length,
      set: new Set(toks),
      paras: paragraphs(p.html),
      floor: THRESHOLDS.wordFloors[p.type] ?? 0,
    };
  });
  const types = [...new Set(pages.map((p) => p.type))].sort();
  const ofType = (type) => pages.filter((p) => p.type === type);

  // 0. shared blocks — a paragraph rendered verbatim on several routes counts on none of them
  //    (content-standards §1: "unique excludes any block rendered identically on another route")
  const shared = new Map(); // paragraph text → Set<path>
  for (const p of pages) {
    for (const text of p.paras) {
      if (tokens(text).length < SHARED_MIN_WORDS) continue;
      if (!shared.has(text)) shared.set(text, new Set());
      shared.get(text).add(p.path);
    }
  }
  const repeated = [...shared]
    .filter(([, s]) => s.size >= SHARED_MIN_PAGES)
    .sort((a, b) => b[1].size - a[1].size);
  const sharedText = new Set(repeated.map(([t]) => t));
  for (const p of pages) {
    p.sharedWords = p.paras
      .filter((t) => sharedText.has(t))
      .reduce((n, t) => n + tokens(t).length, 0);
    p.unique = p.words - p.sharedWords;
  }

  // 1. word floors — one finding per route type, judged on unique words
  const byType = {};
  for (const type of types) {
    const group = ofType(type);
    const floor = group[0]?.floor ?? 0;
    const below = floor
      ? group.filter((p) => p.unique < floor).sort((a, b) => a.path.localeCompare(b.path))
      : [];
    byType[type] = {
      pages: group.length,
      medianWords: median(group.map((p) => p.words)),
      medianUnique: median(group.map((p) => p.unique)),
      medianDistinct: median(group.map((p) => p.set.size)),
      floor,
      belowFloor: below.length,
    };
    if (below.length)
      r.fail(
        `${type}: ${below.length} of ${group.length} page(s) under the ${floor}-word floor`,
        below
          .map(
            (p) =>
              `${p.path}: ${p.unique}/${floor} unique (${p.words} total, ${p.sharedWords} in shared blocks)`,
          )
          .join("\n"),
        refs("content-standards §1", BACKLOG[type]),
      );
  }

  // 2. doorway proxy — tokens a page carries that its nearest same-type sibling does not
  const minDelta = THRESHOLDS.doorwayMinUniqueTokens;
  for (const type of DOORWAY_TYPES) {
    const group = ofType(type);
    const deltas = [];
    const doorways = [];
    for (const p of group) {
      let nearest = null;
      for (const s of group) {
        if (s === p) continue;
        const d = tokensMissingFrom(p.set, s.set);
        if (!nearest || d < nearest.delta) nearest = { delta: d, path: s.path };
      }
      if (!nearest) continue; // a lone page has no sibling to be a doorway of
      deltas.push(nearest.delta);
      if (nearest.delta < minDelta)
        doorways.push(`${p.path}: ${nearest.delta} vs nearest sibling ${nearest.path}`);
    }
    r.metric(`${type}MedianDelta`, median(deltas));
    if (doorways.length)
      r.fail(
        `${type}: ${doorways.length} of ${group.length} page(s) carry < ${minDelta} tokens their nearest sibling lacks (doorway proxy)`,
        doorways.sort().join("\n"),
        refs("content-standards §2", BACKLOG[type]),
      );
  }

  // 3. answer-block proxy — the first paragraph under the <h1>
  const { minWords, maxWords } = THRESHOLDS.answerBlock;
  for (const type of ANSWER_TYPES) {
    const group = ofType(type);
    const off = [];
    for (const p of group) {
      const para = firstParagraphAfterH1(p.html);
      const n = para === null ? 0 : tokens(para).length;
      if (n < minWords || n > maxWords)
        off.push(`${p.path}: ${para === null ? "no <p> after <h1>" : `${n} words`}`);
    }
    if (off.length)
      r.warn(
        `${type}: ${off.length} of ${group.length} page(s) open with a paragraph outside ${minWords}–${maxWords} words (answer-block proxy)`,
        off.sort().join("\n"),
        "content-standards §5, backlog §6.2",
      );
  }

  // 4. shared blocks — report the biggest offenders (already subtracted from every page's unique count)
  if (repeated.length)
    r.warn(
      `${repeated.length} paragraph(s) of ≥ ${SHARED_MIN_WORDS} words render verbatim on ≥ ${SHARED_MIN_PAGES} pages — subtracted from every page's unique count`,
      repeated
        .slice(0, 5)
        .map(([t, s]) => `${s.size} pages: "${t.length > 90 ? `${t.slice(0, 90)}…` : t}"`)
        .join("\n"),
      "content-standards §1",
    );

  r.note(
    "Floors are judged on unique words inside <main>: total words minus paragraphs shared verbatim across routes (content-standards §1). `medianDistinct` is the distinct-token count, for context only.",
  );
  r.metric("pages", pages.length);
  r.metric("byType", byType);
  r.metric("sharedParagraphs", repeated.length);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
