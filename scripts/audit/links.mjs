/**
 * links.mjs — link graph, sitemap parity, heading structure and breadcrumb schema on the export
 * (backlog §9, §1.4, §1.8, §3.10, §4.3; internal-linking + seo-metadata skills).
 *
 *   - inbound graph from every content page's internal hrefs (self-links and stubs excluded):
 *     zero inbound = orphan (fail); a page whose siblings sit in the sitewide chrome (the hrefs
 *     common to ≥ CHROME_SHARE of pages = header/footer/mobile bar) but which does not = warn (§9.2)
 *   - sitemap.xml ↔ emitted content tree, both directions (fail, §1.4/§1.8); stubs + 404 as metrics
 *   - the staticPages registry (lib/site-config.ts) ↔ the app/ route tree (fail, §1.4): the nine
 *     static routes derive from no data array, so this is what stops one drifting out of the sitemap
 *   - <lastmod> is a real, non-future W3C date on every entry (fail, §1.8)
 *   - exactly one <h1> inside <main> (fail, CLAUDE.md §8); skipped heading levels (warn, §3.10)
 *   - BreadcrumbList JSON-LD on every page but "/" (fail, §4.3)
 *   - hrefs that resolve to nothing in out/ (fail, §9) or to a redirect stub / the 404 (warn, §1.1)
 *   - related-item monotony on services and posts: array-order `.slice(0, N)` lets the same N+1
 *     leading siblings absorb every related link (warn, §9.4; N = thresholds.links.maxRelatedSlice)
 *
 * Usage: node scripts/audit/links.mjs [--json]
 */

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  OUT,
  ROOT,
  readSrc,
  emittedPages,
  readSitemap,
  internalLinks,
  mainHeadings,
  jsonLdTypes,
} from "./lib/pages.mjs";
import { Report, THRESHOLDS, finish, isMain, parseArgs } from "./lib/report.mjs";

/** An href is "chrome" when this share of content pages carries it. Not in thresholds.json yet. */
const CHROME_SHARE = THRESHOLDS.links?.chromeShare ?? 0.9;

/**
 * The fleet live-kit's bar and seasonal cards are sitewide chrome (CLAUDE.md §14): they sit on
 * every page, hidden until their season, so their links are boilerplate, not context. Counted,
 * the guide a seasonal line points at would read every page as an inbound link (masking a real
 * orphan), and its href would join the chrome set and turn every sibling post into a notInChrome
 * warning. Stripped before the link graph is built — the regions exactly as lib/live/render.mjs
 * prints them (kit README step 8). The homepage updates strip is in <main> and stays: it is
 * content on one page.
 */
const stripLive = (html) =>
  html
    .replace(/<div class="live-topbar"[\s\S]*?<\/div><\/div>/g, " ")
    .replace(/<div class="live-dialogs"[\s\S]*?<\/dialog><\/div>/g, " ");

/** Raw inner HTML of <main> (pages.mjs exposes only its text and headings). */
function mainHtml(html) {
  return html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
}

/** Does a normalized href resolve to something in out/ — a route's index.html or a plain file? */
function resolvesInOut(p) {
  return existsSync(
    p.endsWith("/") ? path.join(OUT, p, "index.html") : path.join(OUT, p),
  );
}

/** Is `YYYY-MM-DD` a date that actually exists (rejects 2026-02-30, 2026-13-01)? */
function isRealDate(d) {
  const [y, m, day] = d.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, day));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === day;
}

/**
 * Top-level routes that exist in the app/ tree: every directory directly under app/ holding
 * its own page.tsx, plus app/page.tsx as the homepage (registered as ""). services/ and
 * locations/ hold only dynamic children, so they carry no page.tsx here and drop out on
 * their own — their URLs come from the data arrays instead.
 */
function appStaticRoutes() {
  const app = path.join(ROOT, "app");
  if (!existsSync(app)) return [];
  const routes = readdirSync(app, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("[") && !e.name.startsWith("("))
    .filter((e) => existsSync(path.join(app, e.name, "page.tsx")))
    .map((e) => e.name);
  if (existsSync(path.join(app, "page.tsx"))) routes.push("");
  return routes;
}

const push = (map, key, value) => map.set(key, [...(map.get(key) ?? []), value]);
const list = (items, max = 12) =>
  (items.length > max ? [...items.slice(0, max), `… (${items.length})`] : items).join(
    "\n",
  );

export function run() {
  const r = new Report(
    "links",
    "Link graph, orphans, sitemap parity, H1/heading order, breadcrumbs (backlog §9, §1.8, §4.3).",
  );
  const all = emittedPages();
  const pages = all.filter((p) => p.kind === "content");
  const byPath = new Map(all.map((p) => [p.path, p]));
  const contentSet = new Set(pages.map((p) => p.path));

  // ── 1. inbound graph, orphans, chrome reach, broken links ──────────────────
  const inbound = new Map(pages.map((p) => [p.path, new Set()]));
  const hrefFreq = new Map(); // href → number of content pages carrying it
  const broken = new Map(); // href → source pages (nothing in out/)
  const toStub = new Map(); // href → source pages (a redirect stub or the 404)
  for (const page of pages) {
    for (const h of new Set(internalLinks(stripLive(page.html)))) {
      hrefFreq.set(h, (hrefFreq.get(h) ?? 0) + 1);
      if (contentSet.has(h)) {
        if (h !== page.path) inbound.get(h).add(page.path);
      } else if (byPath.has(h)) push(toStub, h, page.path);
      else if (!resolvesInOut(h)) push(broken, h, page.path);
    }
  }

  const orphans = pages.filter((p) => inbound.get(p.path).size === 0).map((p) => p.path);
  if (orphans.length)
    r.fail(
      `${orphans.length} orphan page(s) — no inbound link from any other content page`,
      list(orphans),
      "backlog §9.2",
    );

  const chrome = new Set(
    [...hrefFreq]
      .filter(([, n]) => n >= Math.ceil(pages.length * CHROME_SHARE))
      .map(([h]) => h),
  );
  // A route type belongs in the chrome when any sibling of that type is there; then all of them should be.
  const chromeTypes = new Set(pages.filter((p) => chrome.has(p.path)).map((p) => p.type));
  const notInChrome = pages
    .filter((p) => chromeTypes.has(p.type) && !chrome.has(p.path))
    .map((p) => p.path);
  if (notInChrome.length)
    r.warn(
      `${notInChrome.length} page(s) missing from the sitewide chrome while siblings of the same type are in it`,
      list(notInChrome),
      "backlog §9.2",
    );
  const offChrome = [
    ...new Set(pages.filter((p) => !chromeTypes.has(p.type)).map((p) => p.type)),
  ];
  r.note(
    `chrome = ${chrome.size} hrefs on ≥ ${CHROME_SHARE * 100}% of pages; types reached only via indexes/related links: ${offChrome.join(", ") || "none"}`,
    undefined,
    "backlog §9.1",
  );

  if (broken.size)
    r.fail(
      `${broken.size} internal href(s) resolve to nothing in out/`,
      list([...broken].map(([h, src]) => `${h} ← ${src.length} page(s), e.g. ${src[0]}`)),
      "backlog §9",
    );
  if (toStub.size)
    r.warn(
      `${toStub.size} internal href(s) point at a redirect stub or the 404 instead of the final URL`,
      list([...toStub].map(([h, src]) => `${h} ← ${src.length} page(s), e.g. ${src[0]}`)),
      "backlog §1.1",
    );

  // ── 2. sitemap ↔ emitted tree ──────────────────────────────────────────────
  const sitemap = readSitemap();
  const sitemapPaths = new Set(sitemap.map((u) => u.path));
  if (!sitemap.length)
    r.fail(
      "out/sitemap.xml is missing or has no <url> entries",
      undefined,
      "backlog §1.8",
    );
  if (sitemapPaths.size !== sitemap.length)
    r.warn(
      `sitemap.xml repeats ${sitemap.length - sitemapPaths.size} <loc>(s)`,
      undefined,
      "backlog §1.8",
    );
  const sitemapNotEmitted = [...sitemapPaths].filter((p) => !contentSet.has(p));
  const emittedNotInSitemap = pages
    .map((p) => p.path)
    .filter((p) => !sitemapPaths.has(p));
  if (sitemapNotEmitted.length)
    r.fail(
      `${sitemapNotEmitted.length} sitemap URL(s) are not emitted content pages (stub, 404 or missing)`,
      list(sitemapNotEmitted),
      "backlog §1.8",
    );
  if (emittedNotInSitemap.length)
    r.fail(
      `${emittedNotInSitemap.length} content page(s) are absent from sitemap.xml`,
      list(emittedNotInSitemap),
      "backlog §1.4",
    );

  // ── 2b. staticPages registry ↔ the app/ route tree (§1.4) ───────────────────
  // The parity check above catches a missing page only after a build, and only names the
  // URL. This names the route AND the file to fix, and fails even on a build that never ran.
  const registry =
    readSrc("lib/site-config.ts").match(
      /export const staticPages[^=]*=\s*\[([\s\S]*?)\n\];/,
    )?.[1] ?? null;
  if (registry === null)
    r.fail(
      "staticPages registry not found in lib/site-config.ts",
      "app/sitemap.ts derives its static entries from it; this check cannot run without it.",
      "backlog §1.4",
    );
  else {
    const registered = new Set(
      [...registry.matchAll(/path:\s*"([^"]*)"/g)].map((m) => m[1]),
    );
    const appRoutes = appStaticRoutes();
    const unregistered = appRoutes.filter((n) => !registered.has(n));
    const ghosts = [...registered].filter((n) => !appRoutes.includes(n));
    if (unregistered.length)
      r.fail(
        `${unregistered.length} top-level route(s) exist in app/ but are absent from the staticPages registry`,
        [
          list(unregistered.map((n) => `/${n}` + (n ? "/" : ""))),
          "Add them to staticPages in lib/site-config.ts, with the date the copy last changed.",
        ].join("\n"),
        "backlog §1.4",
      );
    if (ghosts.length)
      r.fail(
        `${ghosts.length} staticPages entr(ies) name a route that no longer exists in app/`,
        [
          list(ghosts.map((n) => `/${n}` + (n ? "/" : ""))),
          "Remove them from lib/site-config.ts, or the sitemap will list a 404.",
        ].join("\n"),
        "backlog §1.4",
      );
    r.metric("staticRoutesRegistered", registered.size);
  }

  // ── 2c. <lastmod> is a real, non-future date (§1.8) ─────────────────────────
  // Nothing asserted anything about <lastmod> before: pages.mjs parsed the field and no
  // check read it. Google honours <lastmod> only while it stays verifiably accurate, so a
  // malformed or future date is worse than none at all.
  const today = new Date().toISOString().slice(0, 10);
  const malformed = [];
  const future = [];
  for (const u of sitemap) {
    if (!u.lastmod) {
      malformed.push(`${u.path} — missing`);
      continue;
    }
    const day = u.lastmod.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}([T ].*)?$/.test(u.lastmod) || !isRealDate(day))
      malformed.push(`${u.path} — ${u.lastmod}`);
    else if (day > today) future.push(`${u.path} — ${u.lastmod}`);
  }
  if (malformed.length)
    r.fail(
      `${malformed.length} sitemap entr(ies) carry no valid W3C <lastmod>`,
      list(malformed),
      "backlog §1.8",
    );
  if (future.length)
    r.fail(
      `${future.length} sitemap <lastmod> value(s) are in the future (today is ${today})`,
      list(future),
      "backlog §1.8",
    );

  // ── 3. one <h1> in <main>; no skipped heading levels ───────────────────────
  const badH1 = [];
  const skips = [];
  let pagesWithoutH1 = 0;
  for (const page of pages) {
    const hs = mainHeadings(page.html);
    const h1s = hs.filter((h) => h.level === 1).length;
    if (h1s !== 1) badH1.push(`${page.path}: ${h1s} <h1>`);
    if (h1s === 0) pagesWithoutH1++;
    let prev = 1; // the page is rooted at h1; an h2 opening <main> is not a skip
    for (const h of hs) {
      if (h.level > prev + 1)
        skips.push(`${page.path}: h${prev}→h${h.level} "${h.text.slice(0, 60)}"`);
      prev = h.level;
    }
  }
  if (badH1.length)
    r.fail(
      `${badH1.length} page(s) do not have exactly one <h1> inside <main>`,
      list(badH1),
      "CLAUDE.md §8",
    );
  const skipPages = new Set(skips.map((s) => s.split(": ")[0])).size;
  if (skips.length)
    r.warn(
      `heading level skipped on ${skipPages} page(s) (${skips.length} instance(s))`,
      list(skips),
      "backlog §3.10",
    );

  // ── 4. BreadcrumbList on every page except "/" ─────────────────────────────
  const crumbPages = pages
    .filter((p) => jsonLdTypes(p.html).includes("BreadcrumbList"))
    .map((p) => p.path);
  const crumbSet = new Set(crumbPages);
  const missingCrumbs = pages
    .filter((p) => p.path !== "/" && !crumbSet.has(p.path))
    .map((p) => p.path);
  if (missingCrumbs.length)
    r.fail(
      `BreadcrumbList missing on ${missingCrumbs.length} of ${pages.length - 1} nested page(s)`,
      list(missingCrumbs),
      "backlog §4.3",
    );

  // ── 5. related-item monotony on services and posts ─────────────────────────
  const N = THRESHOLDS.links.maxRelatedSlice;
  for (const [type, prefix, key] of [
    ["service", "/services/", "relatedServiceTargets"],
    ["post", "/blog/", "relatedPostTargets"],
  ]) {
    const group = pages.filter((p) => p.type === type);
    const leading = new Set(); // union of every page's first N related targets
    const reached = new Set(); // union of every related target
    let linking = 0;
    for (const p of group) {
      const rel = [
        ...new Set(
          internalLinks(mainHtml(p.html)).filter(
            (h) => h.startsWith(prefix) && h !== prefix && h !== p.path,
          ),
        ),
      ];
      rel.slice(0, N).forEach((h) => leading.add(h));
      rel.forEach((h) => reached.add(h));
      if (rel.length) linking++;
    }
    r.metric(key, reached.size);
    if (group.length > N + 1 && linking === group.length && leading.size <= N + 1)
      r.warn(
        `${type} pages: the first ${N} related links on every page come from the same ${leading.size} array-leading siblings; ${group.length - reached.size} of ${group.length} ${type} pages receive no related link`,
        list([...leading]),
        "backlog §9.4",
      );
  }

  // ── metrics ────────────────────────────────────────────────────────────────
  r.metric("contentPages", pages.length);
  r.metric("stubs", all.filter((p) => p.kind === "stub").length);
  r.metric("notfound", all.filter((p) => p.kind === "notfound").length);
  r.metric("sitemapUrls", sitemap.length);
  r.metric("chromeLinks", chrome.size);
  r.metric("orphans", orphans.length);
  r.metric("notInChrome", notInChrome.length);
  r.metric("brokenLinks", broken.size);
  r.metric("linksToStubs", toStub.size);
  r.metric("pagesWithoutH1", pagesWithoutH1);
  r.metric("pagesNotExactlyOneH1", badH1.length);
  r.metric("headingSkips", skips.length);
  r.metric("breadcrumbPages", crumbPages.length);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
