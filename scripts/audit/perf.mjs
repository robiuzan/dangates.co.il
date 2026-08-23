/**
 * perf.mjs — static-export performance budget (backlog §10, §1.3, performance-web-vitals skill).
 *
 *   - out/ total bytes ≤ thresholds.perf.maxOutBytes; no JS file > maxJsFileBytes (fail — §10.4)
 *   - total JS ≤ maxJsTotalBytes (warn — §10.2); chunk count and the largest chunks recorded
 *   - .woff2 files shipped vs <link rel="preload" as="font"> on the homepage: 0 preloads while
 *     fonts exist is a fail — with a text-only LCP the font IS the critical path (§10.1)
 *   - RSC index.txt payloads beside every index.html: count + bytes (warn — §1.3)
 *   - package.json dependencies imported nowhere under app/ components/ lib/ scripts/ (warn — §10.3)
 *   - "use client" components: count and which (metric — §10.2)
 *   - <img> without width/height on content pages (warn, CLS — §10.5; today 0 images ship)
 *   - preconnect / dns-prefetch hints in the homepage <head> (metric; imgquarry.com expected)
 *
 * Usage: node scripts/audit/perf.mjs [--json]
 */

import { readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { OUT, walk, readSrc, sourceFiles, contentPages, tagsOf } from "./lib/pages.mjs";
import { Report, THRESHOLDS, finish, isMain, parseArgs } from "./lib/report.mjs";

/** Runtime packages Next.js itself requires that application code never imports by name. */
const IMPLIED_DEPS = new Set(["react-dom"]);
const SOURCE_EXT = /\.(tsx?|jsx?|mjs|cjs|css)$/;

// ── local helpers (candidates for lib/pages.mjs) ────────────────────────────

/** out/-relative, forward-slash path for display. */
const relOut = (abs) => path.relative(OUT, abs).replace(/\\/g, "/");
/** Sum of file sizes on disk. */
const bytesOf = (files) => files.reduce((n, f) => n + statSync(f).size, 0);
/** Human-readable bytes: "5.61 MB" / "212.4 kB". */
const fmtBytes = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2)} MB` : `${(n / 1e3).toFixed(1)} kB`;

/** Bare package names a source file imports (import/from, require(), import(), CSS @import). */
function importedPackages(src) {
  const pkgs = new Set();
  const re =
    /(?:from\s*|import\s*\(?\s*|require\s*\(\s*|@import\s+(?:url\()?\s*)["']([^"'\n]+)["']/g;
  for (const m of src.matchAll(re)) {
    const spec = m[1];
    if (/^(\.|\/|@\/|node:)/.test(spec)) continue; // relative, alias, builtin
    const parts = spec.split("/");
    pkgs.add(spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
  }
  return pkgs;
}

/** True when the file opens with the "use client" directive (comments allowed above it). */
const isClientComponent = (src) =>
  /^\s*(?:\/\/[^\n]*\n\s*|\/\*[\s\S]*?\*\/\s*)*["']use client["']/.test(src);

export function run() {
  const r = new Report(
    "perf",
    "Static-export performance budget: bytes, JS, fonts, RSC payloads, dependencies, images (backlog §10, §1.3).",
  );
  const P = THRESHOLDS.perf;

  // 1. byte budget ────────────────────────────────────────────────────────────
  const allFiles = walk(OUT);
  const outBytes = bytesOf(allFiles);
  const jsSizes = walk(path.join(OUT, "_next"), (f) => f.endsWith(".js"))
    .map((f) => ({ file: relOut(f), bytes: statSync(f).size }))
    .sort((a, b) => b.bytes - a.bytes);
  const jsTotal = jsSizes.reduce((n, j) => n + j.bytes, 0);
  const largest = jsSizes[0] ?? { file: "(none)", bytes: 0 };
  const top = (n) =>
    jsSizes
      .slice(0, n)
      .map((j) => `${j.file}  ${fmtBytes(j.bytes)}`)
      .join("\n");

  if (outBytes > P.maxOutBytes)
    r.fail(
      `out/ is ${fmtBytes(outBytes)} (> ${fmtBytes(P.maxOutBytes)}, thresholds.perf.maxOutBytes) — dev-only chunks from a polluted .next/?`,
      `${allFiles.length} files; largest JS:\n${top(5)}`,
      "backlog §10.4",
    );
  const oversized = jsSizes.filter((j) => j.bytes > P.maxJsFileBytes);
  if (oversized.length)
    r.fail(
      `${oversized.length} JS file(s) over ${fmtBytes(P.maxJsFileBytes)} (thresholds.perf.maxJsFileBytes) — never ship from a dirty .next/`,
      oversized.map((j) => `${j.file}  ${fmtBytes(j.bytes)}`).join("\n"),
      "backlog §10.4",
    );
  if (jsTotal > P.maxJsTotalBytes)
    r.warn(
      `total JS ${fmtBytes(jsTotal)} across ${jsSizes.length} chunks (> ${fmtBytes(P.maxJsTotalBytes)}, thresholds.perf.maxJsTotalBytes)`,
      top(5),
      "backlog §10.2",
    );
  else
    r.note(
      `out/ ${fmtBytes(outBytes)} in ${allFiles.length} files; JS ${fmtBytes(jsTotal)} in ${jsSizes.length} chunks, largest ${largest.file} ${fmtBytes(largest.bytes)} — within budget`,
      undefined,
      "backlog §10.4",
    );

  // 2. fonts: shipped vs preloaded on the homepage (the LCP page) ─────────────
  const woff2 = walk(path.join(OUT, "_next", "static", "media"), (f) =>
    f.endsWith(".woff2"),
  );
  const preloadable = woff2.filter((f) => f.endsWith(".p.woff2")); // next/font's preload subset
  const homeFile = path.join(OUT, "index.html");
  const home = existsSync(homeFile) ? readFileSync(homeFile, "utf8") : "";
  const head = home.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? home;
  const links = tagsOf(head, "link");
  const fontPreloads = links.filter(
    (l) => l.attrs.rel === "preload" && l.attrs.as === "font",
  );
  if (woff2.length && !fontPreloads.length)
    r.fail(
      `${woff2.length} .woff2 files ship but the homepage <head> has 0 <link rel="preload" as="font"> — the brand font is the text-only LCP's critical path`,
      `${preloadable.length} marked preloadable by next/font (.p.woff2):\n${woff2.map(relOut).join("\n")}`,
      "backlog §10.1",
    );

  // 3. RSC payloads ───────────────────────────────────────────────────────────
  const rsc = walk(OUT, (f) => path.basename(f) === "index.txt");
  const rscBytes = bytesOf(rsc);
  if (rsc.length)
    r.warn(
      `${rsc.length} RSC payload files (index.txt) ship — ${fmtBytes(rscBytes)} of crawlable duplicate copy beside every index.html`,
      "strip them post-build or disallow /*/index.txt at the edge",
      "backlog §1.3",
    );

  // 4 + 5. source scan: unused dependencies, "use client" components ──────────
  const pkg = JSON.parse(readSrc("package.json"));
  const deps = Object.keys(pkg.dependencies ?? {});
  const imported = new Set();
  const clientComponents = [];
  for (const f of sourceFiles([
    "app/**/*",
    "components/**/*",
    "lib/**/*",
    "scripts/**/*",
  ])) {
    if (!SOURCE_EXT.test(f.rel)) continue;
    const text = readFileSync(f.abs, "utf8");
    for (const p of importedPackages(text)) imported.add(p);
    if (/\.tsx?$/.test(f.rel) && isClientComponent(text)) clientComponents.push(f.rel);
  }
  const unusedDeps = deps.filter((d) => !imported.has(d) && !IMPLIED_DEPS.has(d));
  if (unusedDeps.length)
    r.warn(
      `${unusedDeps.length} package.json dependency(ies) imported nowhere under app/ components/ lib/ scripts/: ${unusedDeps.join(", ")}`,
      "npm uninstall — an unused dependency is install time, audit surface and a temptation to animate",
      "backlog §10.3",
    );
  r.note(
    `${clientComponents.length} "use client" components: ${clientComponents.join(", ")}`,
    "each one is hydration JS on every page that renders it; Header is client for one boolean, Faq could be <details>/<summary>",
    "backlog §10.2",
  );

  // 6. images on content pages (CLS reserve) ─────────────────────────────────
  const pages = contentPages();
  let images = 0;
  const unsized = [];
  for (const page of pages) {
    for (const img of tagsOf(page.html, "img")) {
      images++;
      if (!(img.attrs.width && img.attrs.height))
        unsized.push(`${page.path}  ${img.attrs.src ?? "(no src)"}`);
    }
  }
  if (unsized.length)
    r.warn(
      `${unsized.length} of ${images} <img> lack width/height — no CLS reserve`,
      unsized.slice(0, 20).join("\n"),
      "backlog §10.5",
    );
  else if (!images)
    r.note(
      `0 <img> on ${pages.length} content pages — no LCP-image or srcset work applies until photos exist`,
      undefined,
      "backlog §10.5",
    );

  // 7. resource hints ─────────────────────────────────────────────────────────
  const hints = links
    .filter((l) => l.attrs.rel === "preconnect" || l.attrs.rel === "dns-prefetch")
    .map((l) => `${l.attrs.rel} ${l.attrs.href}`);
  const hasMediaHost = hints.some((h) => h.includes("imgquarry.com"));
  if (!hasMediaHost)
    r.note(
      "no preconnect/dns-prefetch to imgquarry.com (the manifest's media host) in the homepage <head>",
      hints.join("\n") || "(no hints)",
      "backlog §10.5",
    );
  else if (!images)
    r.note(
      "preconnect to imgquarry.com opens a connection no page fetches from yet (0 <img>) — cheap, keep it for when images land",
      hints.join("\n"),
      "backlog §10.5",
    );

  r.metric("outBytes", outBytes);
  r.metric("outFiles", allFiles.length);
  r.metric("jsFiles", jsSizes.length);
  r.metric("jsTotalBytes", jsTotal);
  r.metric("largestJs", largest.file);
  r.metric("largestJsBytes", largest.bytes);
  r.metric("woff2Files", woff2.length);
  r.metric("fontPreloads", fontPreloads.length);
  r.metric("rscPayloads", rsc.length);
  r.metric("rscBytes", rscBytes);
  r.metric("unusedDeps", unusedDeps);
  r.metric("clientComponents", clientComponents.length);
  r.metric("clientComponentFiles", clientComponents);
  r.metric("images", images);
  r.metric("imagesUnsized", unsized.length);
  r.metric("resourceHints", hints);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
