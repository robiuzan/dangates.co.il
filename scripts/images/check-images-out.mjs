/**
 * check-images-out.mjs — the images gate. Runs after `next build` (postbuild, LAST: after
 * check-live-out, which owns out/.live-draft), in CI's build and in `npm run gate`, and proves the
 * export carries exactly the images content/images/manifest.json says, and nothing else.
 *
 * Everything about this site comes from lib/images.config.mjs; this file is the fleet's.
 *
 * ROUTES ARE LITERAL. out/ has raw Hebrew directory names and the built pages raw Hebrew hrefs, so
 * a route is compared as it stands. Canonicals, sitemap <loc>s and BreadcrumbList items are
 * percent-escaped: nothing here reads those forms, and nothing may compare them with a route.
 *
 * WHAT IT ENFORCES (contract §4, the site's CLAUDE.md):
 *   - the lists read through ts-scan match the export, group by group, and every layout route is
 *     emitted: a row the scanner silently dropped would otherwise drop out of every rule below;
 *   - the manifest obeys every rule in scripts/images/lib/manifest-rules.mjs — the same module
 *     lib/images.ts throws on, so the two can never disagree about what a valid manifest is;
 *   - every approved file exists in public/ AND out/ with the HEADER dimensions, bytes and sha256
 *     the manifest records (read with lib/imageinfo.mjs, never trusted from the JSON); candidates
 *     only in draft mode; rejected files nowhere; retired files kept ≥ 60 days;
 *   - a retired entry with `revoked` has its files GONE from public/ and out/ (full file, thumbnail
 *     and phone copy): a person's likeness leaves within 14 days of written notice, and the 60-day
 *     rule never applies to it;
 *   - every approved entry has its phone copy on disk, with the manifest's facts, and every figure
 *     that shows the full file offers it to phones through <source media> (a forgotten
 *     phone-copies.mjs run fails here); every <source> names a visible phone copy;
 *   - every <img> on every page carries numeric width/height and a non-empty alt (unless
 *     aria-hidden); every /images/ reference resolves to a visible manifest entry; no
 *     /images/_candidates/ reference survives a production build (the folder is pruned from out/);
 *   - every content image sits inside a <figure data-image-id>, the only markup Figure.tsx writes;
 *   - every file under out/images/ is referenced by the manifest (a stray file is a leak);
 *   - per content page: ≥ gates.minPerContentPage content images (0 until coverage, then 2) and
 *     summed bytes ≤ the page budget (gates.pageBudgets[route] ?? gates.maxPageImageBytes);
 *     out/images/ in total ≤ gates.maxTotalBytes;
 *   - exactly one fetchpriority="high" on an image-bearing page, and it is the FIRST content image
 *     in DOM order (lazy-loading an in-viewport LCP image is the known regression); every other
 *     content image is lazy;
 *   - every rendered alt and figcaption passes the text rules (Hebrew, no claim stems, no area name,
 *     no ASCII quote; first names only in captions on the about page);
 *   - every visible placement renders on its route and every rendered content image is placed
 *     there; every guide lead's thumbnail renders on the blog index; no file is shared between two
 *     city pages; excluded routes carry none;
 *   - no /images/ path inside any application/ld+json, og:image or twitter:image, and no
 *     ImageObject node in JSON-LD whatever its URL — renderings are illustrations, never evidence;
 *   - the disclosure markers: `data-images-notice="gallery"` on the gallery always, `"footer"` on
 *     every page exactly when an approved entry is a rendering, `"about"` on the about page exactly
 *     when a team figure with people in it renders (the note names them, so a people-free twin in
 *     that slot carries none) — each with the text of content/images/notice.json verbatim;
 *   - while no approved entry is owner-supplied, no disclosure text says «חלק מ»: every image is a
 *     rendering, so "some of the images" would misstate the one fact the note exists to state.
 *
 * DRAFT MODE (`IMAGES_DRAFT=1`): candidates render from /images/_candidates/, so the candidate
 * assertions are skipped and the export is marked with out/.images-draft AND out/.live-draft, so
 * the hub's deploy-site.ps1 refuses it and no later step ever archives it.
 *
 * Usage: node scripts/images/check-images-out.mjs [outDir]      (default: out; exit 1 on failure)
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspect } from "./lib/imageinfo.mjs";
import {
  aboutRoute,
  blogIndexRoute,
  cityRoutePattern,
  galleryRoute,
  layout,
  lists,
  noticeFile,
  textLimits,
} from "./lib/images.config.mjs";
import {
  EXCLUDED_ROUTES,
  RETIRED_KEEP_DAYS,
  ROW_GROUPS,
  TOPIC_GROUPS,
  contentRoutesOf,
  escapeRe,
  isVisible,
  manifestProblems,
  routeOfRow,
  rulesContext,
  srcOf,
  textProblems,
  thumbSrcOf,
  PHONE_MEDIA,
  phoneSrcOf,
} from "./lib/manifest-rules.mjs";
import { readRows } from "./lib/site-lists.mjs";

process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".."));

// Positional arg only — flags must not be mistaken for the output directory.
const OUT = process.argv.slice(2).find((a) => !a.startsWith("-")) ?? "out";
const DRAFT = process.env.IMAGES_DRAFT === "1";
const MANIFEST = "content/images/manifest.json";
const PUBLIC = "public";

if (!fs.existsSync(OUT)) {
  console.error(
    `check-images-out: '${OUT}' does not exist — run \`npm run build\` first.`,
  );
  process.exit(1);
}
for (const f of [MANIFEST, noticeFile]) {
  if (!fs.existsSync(f)) {
    console.error(`check-images-out: ${f} is missing.`);
    process.exit(1);
  }
}

const failures = [];
const notes = [];
function check(label, offenders, hint) {
  const list = [...offenders];
  if (list.length) failures.push({ label, offenders: list, hint });
  console.log(
    `  ${list.length ? "FAIL" : "ok  "}  ${label}${list.length ? `  (${list.length})` : ""}`,
  );
}

const isObj = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
const count = (hay, needle) => hay.split(needle).length - 1;
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  String(s ?? "").replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) =>
    e[0] === "#"
      ? String.fromCodePoint(
          e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1)),
        )
      : (ENT[e.toLowerCase()] ?? m),
  );
/** Visible text: tags (and React's `<!-- -->` text separators) removed without adding spaces. */
const textOf = (html) =>
  decode(html.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();

// ── inputs ───────────────────────────────────────────────────────────────────────────────────
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8").replace(/^﻿/, ""));
/** The disclosure texts, asserted verbatim where their markers render. */
const NOTICE = JSON.parse(fs.readFileSync(noticeFile, "utf8").replace(/^﻿/, ""));

/** The lists, read through ts-scan: this script cannot import TS. */
let rows;
try {
  rows = readRows();
} catch (err) {
  console.error(`check-images-out: ${err.message}`);
  process.exit(1);
}

function pages(dir = OUT, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "_next") pages(p, acc);
    } else if (e.name === "index.html") {
      const rel = path.relative(OUT, dir).split(path.sep).join("/");
      acc.push({
        route: rel ? `/${rel}/` : "/",
        file: p,
        html: fs.readFileSync(p, "utf8"),
      });
    }
  }
  return acc;
}
const all = pages();
const NOT_CONTENT = new Set([...EXCLUDED_ROUTES, "/_not-found/"]);
const content = all.filter((p) => !NOT_CONTENT.has(p.route));
const emittedContent = content.map((p) => p.route);

console.log(
  `check-images-out: ${all.length} emitted routes in ${OUT}/, ${content.length} content routes` +
    (DRAFT ? " — IMAGES_DRAFT=1 (candidates render)" : "") +
    "\n",
);

check(
  "the service, area and topic lists were read from the site's TS files",
  ["services", "areas", ...TOPIC_GROUPS]
    .filter((group) => lists[group] && rows[group].length === 0)
    .map((group) => `${group}: no rows in ${lists[group].file ?? lists[group].dir}`),
  "the gate needs the names to ban them from alt/captions; fix lists in site.json, never hardcode the list",
);

// ── 0. the lists against the export ─────────────────────────────────────────────────────────
/**
 * Group by group, the rows read through ts-scan and the directories emitted under out/ must be the
 * same set. A row whose slug is not a plain string is a row the scanner cannot read: it drops out
 * quietly, its page still ships, and no rule below would ever look at it again.
 */
function listMismatches() {
  const out = [];
  const fixed = new Set(layout.flatMap((item) => ("route" in item ? [item.route] : [])));
  for (const group of ROW_GROUPS) {
    const cfg = lists[group];
    if (!cfg?.route) continue;
    const where = cfg.file ?? cfg.dir;
    const shape = new RegExp(`^${escapeRe(cfg.route).replace(/\\\{\w+\\\}/g, "[^/]+")}$`);
    const listed = rows[group].map((row) => routeOfRow(group, row));
    const emitted = all
      .map((p) => p.route)
      .filter((r) => shape.test(r) && !fixed.has(r) && !NOT_CONTENT.has(r));
    const counted = listed.filter((r) => !NOT_CONTENT.has(r));
    if (counted.length !== emitted.length)
      out.push(
        `${group}: ${counted.length} row(s) read from ${where}, ${emitted.length} page(s) under ${OUT}/`,
      );
    for (const r of counted)
      if (!emitted.includes(r))
        out.push(`${group}: ${r} is in ${where} but not in ${OUT}/`);
    for (const r of emitted)
      if (!counted.includes(r))
        out.push(`${group}: ${r} is in ${OUT}/ but no row of ${where} says so`);
  }
  return out;
}
check(
  "the rows read from the lists match the directories emitted under out/",
  listMismatches(),
  "a row the scanner could not read (a slug that is not a plain string) or a page with no row: fix the list, never the count",
);
const layoutContent = contentRoutesOf(rows);
check(
  "every layout route is emitted, and every emitted content route is in the layout",
  [
    ...layoutContent
      .filter((r) => !emittedContent.includes(r))
      .map((r) => `${r} is in the layout but not in ${OUT}/`),
    ...emittedContent
      .filter((r) => !layoutContent.includes(r))
      .map(
        (r) =>
          `${r} is in ${OUT}/ but in no layout (add it to lists.routes or excludedRoutes)`,
      ),
  ],
  "lists.routes in site.json is the layout; re-run `port --diff` after changing it",
);

// ── 1. the manifest itself (shared rules) ───────────────────────────────────────────────────
const ctx = rulesContext(rows);
check(
  "content/images/manifest.json obeys every rule in scripts/images/lib/manifest-rules.mjs",
  manifestProblems(manifest, ctx),
  "lib/images.ts throws on the same rules — the toolkit writes the manifest, fix it there",
);

const images = Array.isArray(manifest.images) ? manifest.images.filter(isObj) : [];
const gates = isObj(manifest.gates) ? manifest.gates : {};
const visible = images.filter((e) => isVisible(e, DRAFT));
const byId = new Map(images.map((e) => [e.id, e]));
const approvedOf = (kind) =>
  images.some(
    (e) => e.status === "approved" && isObj(e.provenance) && e.provenance.kind === kind,
  );
const hasRenderings = approvedOf("ai-generated");

check(
  "no disclosure text says «חלק מ» while every image is a rendering",
  approvedOf("owner-supplied")
    ? []
    : Object.entries(NOTICE)
        .filter(([, text]) => String(text).includes("חלק מ"))
        .map(([key]) => `${noticeFile}: ${key}`),
  "no approved entry is owner-supplied, so all the images are renderings: the note must say every image is one, and the texts change in site.json first",
);

// ── 2. a production export carries no candidate, and no stale draft mark ────────────────────
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
const candidatesDir = path.join(OUT, "images", "_candidates");
if (!DRAFT) {
  if (fs.existsSync(candidatesDir)) {
    const n = walk(candidatesDir).length;
    fs.rmSync(candidatesDir, { recursive: true, force: true });
    notes.push(
      `pruned ${OUT}/images/_candidates/ (${n} file(s)) — a production export ships no candidate`,
    );
  }
  const mark = path.join(OUT, ".images-draft");
  if (fs.existsSync(mark)) fs.rmSync(mark);
}

// ── 3. files: where each status says, with the manifest's header facts ──────────────────────
const under = (root, src) => path.join(root, ...String(src).split("/").filter(Boolean));
const fileProblems = [];
const revokedProblems = [];
function expectFile(label, src, want) {
  for (const file of [under(PUBLIC, src), under(OUT, src)]) {
    if (!fs.existsSync(file)) {
      fileProblems.push(`${label}: ${file} is missing`);
      continue;
    }
    const bytes = fs.readFileSync(file);
    let info;
    try {
      info = inspect(bytes);
    } catch (err) {
      fileProblems.push(`${label}: ${file}: ${err.message}`);
      continue;
    }
    if (info.width !== want.width || info.height !== want.height)
      fileProblems.push(
        `${label}: ${file} is ${info.width}×${info.height}, the manifest says ${want.width}×${want.height}`,
      );
    if (Number.isInteger(want.bytes) && bytes.length !== want.bytes)
      fileProblems.push(
        `${label}: ${file} is ${bytes.length} bytes, the manifest says ${want.bytes}`,
      );
    if (typeof want.sha256 === "string") {
      const sha = crypto.createHash("sha256").update(bytes).digest("hex");
      if (sha !== want.sha256)
        fileProblems.push(`${label}: ${file} sha256 differs from the manifest`);
    }
  }
}
const exists = (src) =>
  fs.existsSync(under(PUBLIC, src)) || fs.existsSync(under(OUT, src));
const now = Date.now();
for (const e of images) {
  const approvedSrc = `/images/${e.file}`;
  const candidateSrc = `/images/_candidates/${e.file}`;
  switch (e.status) {
    case "approved":
      expectFile(e.id, srcOf(e), e);
      if (isObj(e.thumb)) expectFile(`${e.id} thumb`, thumbSrcOf(e), e.thumb);
      if (isObj(e.phone)) expectFile(`${e.id} phone`, phoneSrcOf(e), e.phone);
      else if (!e.legacySrc)
        fileProblems.push(
          `${e.id}: approved but has no phone copy — run node page-images/tools/phone-copies.mjs --site dangates in Media Studio`,
        );
      break;
    case "candidate":
      if (DRAFT) {
        expectFile(e.id, candidateSrc, e);
        if (isObj(e.thumb))
          expectFile(`${e.id} thumb`, `/images/_candidates/${e.thumb.file}`, e.thumb);
      }
      if (fs.existsSync(under(PUBLIC, approvedSrc)))
        fileProblems.push(
          `${e.id}: a candidate must not sit in public/images/ (found ${approvedSrc})`,
        );
      break;
    case "rejected":
      for (const src of [approvedSrc, candidateSrc])
        if (exists(src)) fileProblems.push(`${e.id}: rejected, but ${src} still exists`);
      break;
    case "retired": {
      if (e.revoked) {
        const thumb = isObj(e.thumb) ? e.thumb.file : null;
        const phone = isObj(e.phone) ? e.phone.file : null;
        const srcs = [
          approvedSrc,
          candidateSrc,
          ...(e.legacySrc ? [e.legacySrc] : []),
          ...(thumb ? [`/images/${thumb}`, `/images/_candidates/${thumb}`] : []),
          ...(phone ? [`/images/${phone}`] : []),
        ];
        for (const src of srcs)
          for (const root of [PUBLIC, OUT])
            if (fs.existsSync(under(root, src)))
              revokedProblems.push(
                `${e.id}: revoked ${e.revoked}, but ${under(root, src)} exists`,
              );
        break;
      }
      const days = Math.floor((now - Date.parse(e.retired)) / 864e5);
      // The full file, its thumbnail and its phone copy all keep their URLs for the same 60 days.
      const gone = [
        e.file,
        isObj(e.thumb) ? e.thumb.file : null,
        isObj(e.phone) ? e.phone.file : null,
      ]
        .filter(Boolean)
        .map((file) => `/images/${file}`)
        .filter(
          (src) => !fs.existsSync(under(PUBLIC, src)) || !fs.existsSync(under(OUT, src)),
        );
      if (days < RETIRED_KEEP_DAYS)
        for (const src of gone)
          fileProblems.push(
            `${e.id}: retired ${days} day(s) ago but ${src} is gone — the file stays ≥ ${RETIRED_KEEP_DAYS} days`,
          );
      if (days >= RETIRED_KEEP_DAYS && !gone.length)
        notes.push(
          `${e.id}: retired ${days} days ago — its files, thumbnail and phone copy included, may now be removed in one commit`,
        );
      break;
    }
    default:
      break;
  }
}
check(
  "every manifest file is where its status says, with the manifest's dimensions, bytes and sha256",
  fileProblems,
  "approved → public/images/<file>; candidate → _candidates/ in draft mode only; rejected → nowhere; retired → kept 60 days",
);
check(
  "a revoked entry's files are gone from public/ and out/",
  revokedProblems,
  "a person's likeness leaves within 14 days of written notice: delete the file in one commit, rebuild, and the 60-day rule does not apply",
);

// ── 4. nothing under out/images/ that the manifest does not vouch for ───────────────────────
const allowed = new Set();
for (const e of images) {
  const files = [
    e.file,
    isObj(e.thumb) ? e.thumb.file : null,
    isObj(e.phone) ? e.phone.file : null,
  ].filter(Boolean);
  if (e.status === "approved" && !e.legacySrc)
    for (const f of files) allowed.add(`/images/${f}`);
  if (e.status === "retired" && !e.revoked)
    for (const f of files) allowed.add(`/images/${f}`);
  if (DRAFT && e.status === "candidate")
    for (const f of files) allowed.add(`/images/_candidates/${f}`);
}
const imagesDir = path.join(OUT, "images");
const shipped = fs.existsSync(imagesDir)
  ? walk(imagesDir).map((f) => "/" + path.relative(OUT, f).split(path.sep).join("/"))
  : [];
check(
  "every file under out/images/ is an approved (or ≤60-day retired) manifest entry",
  shipped.filter((s) => !allowed.has(s)),
  "a file nothing references is a leak — add it to the manifest through the toolkit, or delete it",
);
const totalBytes = shipped.reduce((n, s) => n + fs.statSync(under(OUT, s)).size, 0);
check(
  `out/images/ totals ≤ ${(gates.maxTotalBytes / 1048576).toFixed(0)} MB`,
  totalBytes <= gates.maxTotalBytes ? [] : [`${(totalBytes / 1048576).toFixed(1)} MB`],
  "retire and remove old files, or re-encode — the export is uploaded whole on every deploy",
);

// ── 5. every page ───────────────────────────────────────────────────────────────────────────
const srcToEntry = new Map();
for (const e of visible) {
  srcToEntry.set(srcOf(e), { entry: e, thumb: false });
  const t = thumbSrcOf(e);
  if (t) srcToEntry.set(t, { entry: e, thumb: true });
}
const isLead = (entry) => entry.placements.some((pl) => pl.slot === "lead");
/** A thumbnail on the blog index is derived from the guide's own `lead`, so it is placed by it. */
const placedOn = ({ entry, thumb }, route) =>
  entry.placements.some((pl) => pl.route === route) ||
  (thumb && route === blogIndexRoute && isLead(entry));
const stripSlot = (slot) => /^(strip|pair)-\d$/.test(slot);
/**
 * Draft mode only, because `visible` holds a candidate only there: lib/images.ts previews a candidate
 * IN PLACE of the entry at its route, slot and order, so that entry is not missing from the page.
 */
const previewedOver = (entry, { route, slot, order }) =>
  entry.status !== "candidate" &&
  visible.some(
    (e) =>
      e.status === "candidate" &&
      e.placements.some(
        (pl) => pl.route === route && pl.slot === slot && pl.order === order,
      ),
  );

const phoneToEntry = new Map(
  visible.filter((e) => isObj(e.phone)).map((e) => [phoneSrcOf(e), e]),
);
const IMG_RE = /<img\b[^>]*>/gi;
const SOURCE_RE = /<source\b[^>]*>/gi;
/** Either attribute, either network: Open Graph uses property=, Next writes twitter:image with name=. */
const SHARE_IMAGE_META =
  /<meta\b[^>]*(?:property|name)="((?:og|twitter):image)[^"]*"[^>]*>/gi;
/** As a plain @type, in an array of types, or as the full schema.org URL. */
const IMAGE_OBJECT =
  /"@type"\s*:\s*(?:\[[^\]]*)?"(?:https?:\/\/schema\.org\/)?ImageObject"/;
const FIGURE_RE = /<figure\b[^>]*\sdata-image-id="([^"]*)"[^>]*>([\s\S]*?)<\/figure>/g;
const attrsOf = (tag) => {
  const o = {};
  for (const m of tag.matchAll(/\s([a-zA-Z][\w-]*)(?:="([^"]*)")?/g))
    o[m[1].toLowerCase()] = m[2] ?? "";
  return o;
};

const problems = {
  attrs: [],
  candidate: [],
  unknown: [],
  excluded: [],
  min: [],
  pageBytes: [],
  priority: [],
  text: [],
  figure: [],
  placement: [],
  schema: [],
  notice: [],
  phone: [],
};
const coverage = [];
const cityShare = new Map();
const aboutTeamShown = visible.some(
  (e) =>
    Array.isArray(e.people) &&
    e.people.length > 0 &&
    e.placements.some((pl) => pl.route === aboutRoute && pl.slot === "team"),
);
const footerLink = new RegExp(`<a\\b[^>]*href="${escapeRe(galleryRoute)}"`);

for (const p of all) {
  const imgs = [...p.html.matchAll(IMG_RE)].map((m) => ({
    at: m.index,
    a: attrsOf(m[0]),
  }));
  for (const i of imgs) {
    const hidden = "aria-hidden" in i.a && i.a["aria-hidden"] !== "false";
    if (!/^\d+$/.test(i.a.width ?? "") || !/^\d+$/.test(i.a.height ?? ""))
      problems.attrs.push(
        `${p.route}: <img src="${i.a.src}"> without numeric width/height`,
      );
    if (!hidden && !decode(i.a.alt ?? "").trim())
      problems.attrs.push(`${p.route}: <img src="${i.a.src}"> without alt`);
    if (/^\/images\//.test(i.a.src ?? "") && !srcToEntry.has(i.a.src))
      problems.unknown.push(`${p.route}: ${i.a.src}`);
  }
  if (!DRAFT && p.html.includes("/images/_candidates/")) problems.candidate.push(p.route);

  for (const m of p.html.matchAll(SOURCE_RE)) {
    const a = attrsOf(m[0]);
    if (!/^\/images\//.test(a.srcset ?? "")) continue;
    if (!phoneToEntry.has(a.srcset))
      problems.phone.push(
        `${p.route}: <source> names ${a.srcset}, not a visible phone copy`,
      );
    if (decode(a.media ?? "") !== PHONE_MEDIA)
      problems.phone.push(
        `${p.route}: ${a.srcset} has media="${a.media}", not ${PHONE_MEDIA}`,
      );
  }

  for (const m of p.html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    if (m[1].includes("/images/"))
      problems.schema.push(`${p.route}: JSON-LD names an /images/ path`);
    if (IMAGE_OBJECT.test(m[1]))
      problems.schema.push(`${p.route}: JSON-LD carries an ImageObject`);
  }
  for (const m of p.html.matchAll(SHARE_IMAGE_META))
    if (m[0].includes("/images/"))
      problems.schema.push(`${p.route}: ${m[1]} names an /images/ path`);

  const footerNotes = count(p.html, 'data-images-notice="footer"');
  if (hasRenderings ? footerNotes !== 1 : footerNotes !== 0)
    problems.notice.push(
      `${p.route}: ${footerNotes} footer notice(s), expected ${hasRenderings ? 1 : 0} (${hasRenderings ? "a rendering is approved" : "no rendering is approved"})`,
    );
  for (const [key, want] of [
    ["gallery", p.route === galleryRoute ? 1 : 0],
    ["about", p.route === aboutRoute && aboutTeamShown ? 1 : 0],
  ]) {
    const re = new RegExp(
      `<p\\b[^>]*data-images-notice="${key}"[^>]*>([\\s\\S]*?)</p>`,
      "g",
    );
    const hits = [...p.html.matchAll(re)];
    if (hits.length !== want)
      problems.notice.push(
        `${p.route}: ${hits.length} ${key} notice(s), expected ${want}`,
      );
    for (const h of hits)
      if (textOf(h[1]) !== NOTICE[key])
        problems.notice.push(
          `${p.route}: the ${key} notice is not the text of ${noticeFile} verbatim`,
        );
  }
  if (footerNotes === 1) {
    const m = /<p\b[^>]*data-images-notice="footer"[^>]*>([\s\S]*?)<\/p>/.exec(p.html);
    if (m && textOf(m[1]) !== NOTICE.footer)
      problems.notice.push(
        `${p.route}: the footer notice is not the text of ${noticeFile} verbatim`,
      );
    if (m && !footerLink.test(m[1]))
      problems.notice.push(
        `${p.route}: the footer notice does not link to ${galleryRoute} (plain href)`,
      );
  }

  const contentImgs = imgs.filter((i) => srcToEntry.has(i.a.src));
  const isContent = !NOT_CONTENT.has(p.route);
  if (!isContent) {
    if (contentImgs.length)
      problems.excluded.push(
        `${p.route}: carries ${contentImgs.length} content image(s)`,
      );
    continue;
  }

  const n = contentImgs.length;
  if (n < gates.minPerContentPage)
    problems.min.push(
      `${p.route}: ${n} content image(s), minimum ${gates.minPerContentPage}`,
    );
  // An untouched legacy original pre-dates the budgets (manifest-rules.mjs); everything else counts.
  const bytes = contentImgs.reduce((s, i) => {
    const { entry, thumb } = srcToEntry.get(i.a.src);
    if (entry.legacySrc) return s;
    return s + (thumb ? (entry.thumb.bytes ?? 0) : entry.bytes);
  }, 0);
  const budget = gates.pageBudgets?.[p.route] ?? gates.maxPageImageBytes;
  if (bytes > budget)
    problems.pageBytes.push(
      `${p.route}: ${(bytes / 1024).toFixed(0)} KB of images, budget ${(budget / 1024).toFixed(0)} KB`,
    );

  // Content images only: a header logo is a static image and keeps its own priority.
  const high = contentImgs.filter(
    (i) => (i.a.fetchpriority ?? "").toLowerCase() === "high",
  );
  let priorityOk = true;
  if (n > 0 && high.length !== 1) {
    priorityOk = false;
    problems.priority.push(
      `${p.route}: ${high.length} × fetchpriority="high" (exactly one, on the first content image)`,
    );
  } else if (n > 0) {
    const first = contentImgs[0];
    if (high[0].at !== first.at) {
      priorityOk = false;
      problems.priority.push(
        `${p.route}: the priority image is not the first content image in DOM order (${first.a.src})`,
      );
    }
    if (high[0].a.loading === "lazy") {
      priorityOk = false;
      problems.priority.push(`${p.route}: the priority image is loading="lazy"`);
    }
    for (const i of contentImgs)
      if (i !== high[0] && i.a.loading !== "lazy") {
        priorityOk = false;
        problems.priority.push(`${p.route}: ${i.a.src} is not loading="lazy"`);
      }
  }

  for (const i of contentImgs)
    for (const m of textProblems(decode(i.a.alt), "alt", ctx))
      problems.text.push(`${p.route}: ${i.a.src}: ${m}`);

  const figures = [...p.html.matchAll(FIGURE_RE)];
  for (const i of contentImgs)
    if (!figures.some((f) => i.at > f.index && i.at < f.index + f[0].length))
      problems.figure.push(
        `${p.route}: ${i.a.src} is not inside a <figure data-image-id>`,
      );
  for (const f of figures) {
    const id = f[1];
    const entry = byId.get(id);
    if (!entry) {
      problems.figure.push(`${p.route}: figure for unknown image ${id}`);
      continue;
    }
    if (!isVisible(entry, DRAFT))
      problems.figure.push(`${p.route}: figure ${id} is ${entry.status}`);
    // The blog index renders each lead's thumbnail through Figure, so a figure there may be derived.
    if (!placedOn({ entry, thumb: p.route === blogIndexRoute }, p.route))
      problems.figure.push(`${p.route}: figure ${id} has no placement on this route`);
    const shows = [...f[2].matchAll(IMG_RE)].map((m) => attrsOf(m[0]).src);
    const offered = [...f[2].matchAll(SOURCE_RE)].map((m) => attrsOf(m[0]).srcset);
    if (
      isObj(entry.phone) &&
      shows.includes(srcOf(entry)) &&
      !offered.includes(phoneSrcOf(entry))
    )
      problems.phone.push(`${p.route}: figure ${id} does not offer its phone copy`);
    for (const o of offered)
      if (/^\/images\//.test(o ?? "") && phoneToEntry.get(o) !== entry)
        problems.phone.push(
          `${p.route}: figure ${id} offers ${o}, another image's phone copy`,
        );
    const cap = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/.exec(f[2]);
    if (cap) {
      // The gallery's figcaption also carries a link to the page it illustrates; judge the caption alone.
      const text = textOf(cap[1].replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, "")).replace(
        /\s*·\s*$/,
        "",
      );
      if (text)
        for (const m of textProblems(text, "caption", ctx, {
          firstNamesAllowed: p.route === aboutRoute,
        }))
          problems.text.push(`${p.route}: figcaption of ${id}: ${m}`);
    }
  }

  const rendered = new Set(contentImgs.map((i) => i.a.src));
  const stripCount = visible.filter((e) =>
    e.placements.some((pl) => pl.route === p.route && stripSlot(pl.slot)),
  ).length;
  for (const e of visible)
    for (const pl of e.placements) {
      // The blog index shows each guide's lead as its 480-px thumbnail: that IS the placement rendering.
      if (
        pl.route !== p.route ||
        rendered.has(srcOf(e)) ||
        (e.thumb && rendered.has(thumbSrcOf(e)))
      )
        continue;
      if (stripSlot(pl.slot) && stripCount < 2) {
        notes.push(
          `${p.route}: ${e.id} at ${pl.slot} is hidden — a strip renders only with ≥ 2 images`,
        );
        continue;
      }
      if (previewedOver(e, pl)) {
        notes.push(`${p.route}: ${e.id} at ${pl.slot} is previewed over by a candidate`);
        continue;
      }
      problems.placement.push(
        `${p.route}: ${e.id} is placed at ${pl.slot} but does not render`,
      );
    }
  for (const i of contentImgs) {
    const hit = srcToEntry.get(i.a.src);
    if (!placedOn(hit, p.route))
      problems.placement.push(
        `${p.route}: ${i.a.src} (${hit.entry.id}) renders here without a placement on this route`,
      );
  }
  // Draft mode may preview a candidate in place of an approved lead, so it renders one of the two.
  if (p.route === blogIndexRoute && !DRAFT)
    for (const e of visible)
      if (e.thumb && isLead(e) && !rendered.has(thumbSrcOf(e)))
        problems.placement.push(`${p.route}: the thumbnail of ${e.id} does not render`);

  if (cityRoutePattern?.test(p.route))
    for (const i of contentImgs) {
      const set = cityShare.get(i.a.src) ?? new Set();
      set.add(p.route);
      cityShare.set(i.a.src, set);
    }

  coverage.push({ route: p.route, n, bytes, priorityOk });
}

check(
  "every <img> has numeric width/height and a non-empty alt (unless aria-hidden)",
  problems.attrs,
  "the kit's SiteImage emits all three; a hand-written <img> must too — CLS and a11y",
);
check(
  "no reference to /images/_candidates/ in a production export",
  problems.candidate,
  "a page was rendered with IMAGES_DRAFT=1 — rebuild without it; candidates never ship",
);
check(
  "every /images/ reference resolves to a visible manifest entry",
  problems.unknown,
  "approved only (candidate too under IMAGES_DRAFT=1) — the file may exist, the manifest decides",
);
check(
  "excluded routes carry no content image",
  problems.excluded,
  `${EXCLUDED_ROUTES.join(" ")} — the owner's scope decision`,
);
check(
  `every content page carries ≥ ${gates.minPerContentPage} content image(s)`,
  problems.min,
  "flip gates.minPerContentPage to 2 only once every route is covered",
);
check(
  `image bytes per page ≤ ${(gates.maxPageImageBytes / 1024).toFixed(0)} KB (the gallery has its own budget)`,
  problems.pageBytes,
  "too many or too heavy — re-encode, or move a slot off the page",
);
check(
  "exactly one priority image per image-bearing page — the first content image, eager; all others lazy",
  problems.priority,
  "Figure priority goes to the first rendered figure; FieldStrip tile 1; never two",
);
check(
  "every rendered alt and figcaption passes the text rules",
  problems.text,
  `Hebrew, alt ${textLimits.alt.min}–${textLimits.alt.max} chars, caption ${textLimits.caption.min}–${textLimits.caption.max}, no claim stems, no figures with units, no area name, no ASCII quote, first names on the about page only`,
);
check(
  "every content image sits in a <figure data-image-id> that names a visible entry placed on its route",
  problems.figure,
  "a content image renders through Figure.tsx, never as a bare <img>",
);
check(
  "every visible placement renders on its route, and every rendered image is placed there",
  problems.placement,
  "the built page must carry exactly what the manifest says — like the live-kit's out gate",
);
check(
  "every figure offers its phone copy, and every <source> is a visible phone copy",
  problems.phone,
  "Figure writes the <picture>; a missing copy means phone-copies.mjs did not run after install",
);
check(
  "no file is shared between two city pages",
  [...cityShare]
    .filter(([, r]) => r.size > 1)
    .map(([src, r]) => `${src} on ${[...r].join(", ")}`),
  "a city page carries its own scene; one file on many of them would be a doorway signal",
);
check(
  "no /images/ path inside any application/ld+json, og:image or twitter:image, and no ImageObject",
  problems.schema,
  "renderings are illustrations, never evidence — the brand share card stays the og:image",
);
check(
  "the disclosure markers render where the manifest state says, with the notice.json text",
  problems.notice,
  `data-images-notice="gallery" on ${galleryRoute}; "footer" on every page once a rendering is approved; "about" under a team figure with people in it`,
);

// ── 6. draft marks ──────────────────────────────────────────────────────────────────────────
if (DRAFT) {
  const line =
    "This out/ was built with IMAGES_DRAFT=1 and renders candidate images from /images/_candidates/. Never deploy it.\n";
  fs.writeFileSync(path.join(OUT, ".images-draft"), line);
  // check-live-out.mjs owns .live-draft and may have written its own reason first; add ours.
  fs.appendFileSync(path.join(OUT, ".live-draft"), line);
  notes.push(
    `wrote ${OUT}/.images-draft and ${OUT}/.live-draft — ops/deploy-site.ps1 refuses this export`,
  );
}

// ── 7. coverage table ───────────────────────────────────────────────────────────────────────
console.log(
  "\n  route                                            images     KB  priority",
);
for (const c of coverage.sort((a, b) => a.route.localeCompare(b.route)))
  console.log(
    `  ${c.route.padEnd(48)} ${String(c.n).padStart(6)} ${String(Math.round(c.bytes / 1024)).padStart(6)}  ${c.n === 0 ? "—" : c.priorityOk ? "ok" : "FAIL"}`,
  );
const withImages = coverage.filter((c) => c.n > 0).length;
console.log(
  `\n  ${coverage.length} content routes · ${withImages} with images · ${images.length} manifest entries ` +
    `(${images.filter((e) => e.status === "approved").length} approved, ${images.filter((e) => e.status === "candidate").length} candidate) · ` +
    `out/images ${(totalBytes / 1024).toFixed(0)} KB`,
);
for (const n of notes) console.log(`  note  ${n}`);

if (failures.length) {
  console.error(`\ncheck-images-out: ${failures.length} check(s) FAILED\n`);
  for (const f of failures) {
    console.error(`  ✗ ${f.label}`);
    if (f.hint) console.error(`    ${f.hint}`);
    for (const o of f.offenders.slice(0, 25)) console.error(`      ${o}`);
    if (f.offenders.length > 25)
      console.error(`      … and ${f.offenders.length - 25} more`);
    console.error("");
  }
  process.exit(1);
}
console.log("\ncheck-images-out: all checks passed.");
