/**
 * pages.mjs — shared access to the static export (`out/`) and the source tree for every
 * scripts/audit/* check. Zero dependencies; regex-based HTML reading that is good enough for
 * the markup Next emits (one <main>, one <title>, well-formed attributes).
 *
 * Route set = out/sitemap.xml (the 45 content URLs). Emitted tree = every out/**\/index.html,
 * classified as content / stub (the generated legacy redirects: noindex + location.replace) /
 * notfound. Page text is measured INSIDE <main> (app/layout.tsx wraps every page in one), so
 * header, footer and the mobile CTA bar never count toward a page's own words.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root and the export directory. */
export const ROOT = path.resolve(__dirname, "..", "..", "..");
export const OUT = path.join(ROOT, "out");
export const SITE = "https://dangates.co.il";

// ── filesystem ──────────────────────────────────────────────────────────────

/** Recursively list files under `dir` (absolute paths). Skips node_modules/.git. */
export function walk(dir, filter = () => true) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out;
}

/** Source files that, when newer than out/index.html, mean the export is stale. */
export function outStaleness() {
  const indexHtml = path.join(OUT, "index.html");
  if (!existsSync(indexHtml)) return { missing: true, stale: true, newest: null };
  const built = statSync(indexHtml).mtimeMs;
  let newest = { file: null, mtime: 0 };
  for (const d of [
    "app",
    "components",
    "lib",
    "public",
    "site.config.json",
    "next.config.mjs",
  ]) {
    const abs = path.join(ROOT, d);
    if (!existsSync(abs)) continue;
    const files = statSync(abs).isDirectory() ? walk(abs) : [abs];
    for (const f of files) {
      const m = statSync(f).mtimeMs;
      if (m > newest.mtime) newest = { file: path.relative(ROOT, f), mtime: m };
    }
  }
  return {
    missing: false,
    stale: newest.mtime > built,
    newest: newest.file,
    builtAt: new Date(built).toISOString(),
  };
}

/** Read a repo file as UTF-8 (relative to ROOT). */
export function readSrc(rel) {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

/** Source files matching a simple glob set, e.g. ["app/**\/*.tsx", "components/**\/*.tsx"]. */
export function sourceFiles(globs) {
  const results = new Set();
  for (const g of globs) {
    const [base, ...rest] = g.split("/**/");
    const ext = rest.length ? rest[rest.length - 1].replace("*", "") : null; // ".tsx"
    const abs = path.join(ROOT, base);
    if (!existsSync(abs)) continue;
    if (statSync(abs).isFile()) {
      results.add(abs);
      continue;
    }
    for (const f of walk(abs)) {
      if (!ext || f.endsWith(ext)) results.add(f);
    }
  }
  return [...results].map((f) => ({
    abs: f,
    rel: path.relative(ROOT, f).replace(/\\/g, "/"),
  }));
}

// ── routes ──────────────────────────────────────────────────────────────────

/** Decode a site URL or href to a normalized path: decoded Hebrew, leading + trailing slash. */
export function normalizePath(urlOrHref) {
  let p = String(urlOrHref).trim();
  if (p.startsWith(SITE)) p = p.slice(SITE.length);
  p = p.split("#")[0].split("?")[0];
  if (!p.startsWith("/")) return null; // external or relative
  try {
    p = decodeURIComponent(p);
  } catch {
    /* leave as-is */
  }
  p = p.normalize("NFC");
  if (!p.endsWith("/")) {
    // file-ish paths (sitemap.xml, robots.txt, _next/...) stay as they are
    if (/\.[a-z0-9]+$/i.test(p)) return p;
    p += "/";
  }
  return p;
}

/** The sitemap's URL set — the declared content routes. */
export function readSitemap() {
  const file = path.join(OUT, "sitemap.xml");
  if (!existsSync(file)) return [];
  const xml = readFileSync(file, "utf8");
  const urls = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "";
    const lastmod = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null;
    urls.push({ loc: loc.trim(), path: normalizePath(loc.trim()), lastmod });
  }
  return urls;
}

/** Route type from a normalized path. Drives floors, required schema and heading rules. */
export function routeType(p) {
  if (p === "/") return "home";
  if (p.startsWith("/services/")) return "service";
  if (p.startsWith("/locations/")) return "location";
  if (p === "/blog/") return "blog-index";
  if (p.startsWith("/blog/")) return "post";
  if (p === "/מדריכים/") return "guides-index";
  if (p.startsWith("/מדריכים/")) return "guide";
  if (p === "/שירותים/") return "services-index";
  if (p === "/איזורי-שירות/") return "areas-index";
  if (p === "/מחירון/") return "pricing";
  if (p === "/אודות/") return "about";
  if (p === "/צור-קשר/") return "contact";
  if (p === "/תודה/") return "thanks";
  if (p === "/מדיניות-פרטיות/" || p === "/הצהרת-נגישות/") return "legal";
  return "other";
}

/** content | stub | notfound, from the emitted HTML. */
export function classify(html, p) {
  if (p === "/404/" || /<title>[^<]*הדף לא נמצא/.test(html)) return "notfound";
  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
  const replace = /location\.replace\(/.test(html);
  if (noindex && replace) return "stub";
  return "content";
}

/**
 * Every emitted index.html with its normalized path, kind and (lazily read) html.
 * @returns {{ path: string, file: string, kind: 'content'|'stub'|'notfound', type: string, html: string }[]}
 */
export function emittedPages() {
  const files = walk(OUT, (f) => path.basename(f) === "index.html");
  return files.map((file) => {
    const rel = path.relative(OUT, path.dirname(file)).replace(/\\/g, "/");
    const p = rel === "" ? "/" : `/${rel}/`.normalize("NFC");
    const html = readFileSync(file, "utf8");
    return {
      path: p,
      file: path.relative(ROOT, file).replace(/\\/g, "/"),
      kind: classify(html, p),
      type: routeType(p),
      html,
    };
  });
}

/** Only the content pages (no stubs, no 404). */
export function contentPages() {
  return emittedPages().filter((p) => p.kind === "content");
}

// ── html reading ────────────────────────────────────────────────────────────

/** Decode the handful of entities Next emits into text. */
export function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

/** Strip scripts, styles, templates and tags; collapse whitespace. */
export function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<template[\s\S]*?<\/template>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** The text inside <main> (falls back to <body> if a page has no main). */
export function mainText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const inner = m ? m[1] : (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html);
  return stripTags(inner);
}

/** Word tokens: split on whitespace, strip punctuation, drop empties and pure punctuation. */
export function tokens(text) {
  return text
    .split(/\s+/)
    .map((t) =>
      t.replace(
        /^[\s"'“”‘’«»()[\]{}.,;:!?־–—…·•|/\\]+|[\s"'“”‘’«»()[\]{}.,;:!?־–—…·•|/\\]+$/g,
        "",
      ),
    )
    .filter((t) => t.length > 0 && !/^[\d.,:%₪$€-]+$/.test(t));
}

export function title(html) {
  return decodeEntities(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "").trim();
}
export function metaContent(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]*>`, "i");
  const tag = html.match(re)?.[0];
  if (!tag) return null;
  return decodeEntities(tag.match(/content="([^"]*)"/)?.[1] ?? "");
}
export function canonical(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? null;
}
/** All headings in document order: [{ level, text }]. */
export function headings(html) {
  const out = [];
  for (const m of html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    out.push({ level: Number(m[1]), text: stripTags(m[2]) });
  }
  return out;
}
/** Headings inside <main> only (the chrome has none today, but guard anyway). */
export function mainHeadings(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return headings(m ? m[1] : html);
}
/** Every internal href on the page, normalized; duplicates kept (callers dedupe). */
export function internalLinks(html) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/gi)) {
    const p = normalizePath(m[1]);
    if (p && !p.startsWith("/_next/")) out.push(p);
  }
  return out;
}
/** Parsed JSON-LD blocks on a page (each block as parsed; arrays kept as arrays). */
export function jsonLdBlocks(html) {
  const blocks = [];
  for (const m of html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch (e) {
      blocks.push({ __parseError: String(e.message) });
    }
  }
  return blocks;
}
/** Flatten blocks → every node object (top-level, arrays, @graph, and nested objects with @type). */
export function jsonLdNodes(html) {
  const nodes = [];
  const visit = (v) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (v && typeof v === "object") {
      if (v["@type"] || v["@graph"]) nodes.push(v);
      for (const k of Object.keys(v)) if (k !== "@context") visit(v[k]);
    }
  };
  jsonLdBlocks(html).forEach(visit);
  return nodes;
}
/** All `@type` values (string or array) across the page's nodes, flattened. */
export function jsonLdTypes(html) {
  return jsonLdNodes(html).flatMap((n) =>
    Array.isArray(n["@type"]) ? n["@type"] : n["@type"] ? [n["@type"]] : [],
  );
}

/** Attribute tags of one element type, e.g. tagsOf(html, "a") → [{ raw, attrs }]. */
export function tagsOf(html, tag) {
  const out = [];
  for (const m of html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, "gi"))) {
    const attrs = {};
    for (const a of m[1].matchAll(/([\w:-]+)(?:="([^"]*)")?/g))
      attrs[a[1]] = a[2] ?? true;
    out.push({ raw: m[0], attrs });
  }
  return out;
}
