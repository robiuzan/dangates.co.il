/**
 * edge.mjs — edge files, redirects and dead-host artifacts (backlog §1.1, §6.1, §6.5, §10.4, §12.1–§12.4,
 * N4–N7; web-security-headers + deploy-dangates skills). Production is Cloudflare Pages (CLAUDE.md §10);
 * GitHub Pages and cPanel/Apache artifacts are dead weight that keep a second origin alive.
 *
 *   - public/_redirects present; rules resolve to emitted content pages, are percent-encoded, and no
 *     from-path is still shadowed by a stub directory under public/
 *   - public/_headers present with HSTS, nosniff, Referrer-Policy, framing and Permissions-Policy
 *   - no .github/workflows/deploy.yml, public/CNAME, public/.htaccess; no foreign-market stub dirs
 *   - public/llms.txt present; out/robots.txt quoted (Cloudflare's managed robots.txt overrides it)
 *   - .env.example ↔ process.env usage drift; stale cPanel comment in next.config.mjs
 *   - out/ carries no source maps and no dev-only React/Next chunks
 *
 * Usage: node scripts/audit/edge.mjs [--json]
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ROOT,
  OUT,
  walk,
  readSrc,
  sourceFiles,
  normalizePath,
  emittedPages,
} from "./lib/pages.mjs";
import { Report, finish, isMain, parseArgs } from "./lib/report.mjs";

const HEBREW = /[֐-׿]/;
const FOREIGN = /יוסטון|houston|dallas|texas/i;
const DEAD_HOST = [".github/workflows/deploy.yml", "public/CNAME", "public/.htaccess"];
const REQUIRED_HEADERS = [
  ["Strict-Transport-Security", /strict-transport-security/i],
  ["X-Content-Type-Options", /x-content-type-options/i],
  ["Referrer-Policy", /referrer-policy/i],
  ["X-Frame-Options or frame-ancestors", /x-frame-options|frame-ancestors/i],
  ["Permissions-Policy", /permissions-policy/i],
];
/** Dev-only Next artifacts: unhashed chunks and hot-update files never belong in an export. */
const DEV_FILE =
  /\/chunks\/(main|amp|react-refresh)\.js$|\/chunks\/fallback\/|\.hot-update\./;

// ── local helpers (candidates for lib/pages.mjs) ────────────────────────────

const exists = (rel) => existsSync(path.join(ROOT, rel));

/** Decoded, NFC-normalized dir paths of every stub index.html under public/ ("/תל-אביב/"). */
function publicStubDirs() {
  const pub = path.join(ROOT, "public");
  return walk(pub, (f) => path.basename(f) === "index.html").map((f) => {
    const rel = path.relative(pub, path.dirname(f)).replace(/\\/g, "/");
    return (rel === "" ? "/" : `/${rel}/`).normalize("NFC");
  });
}

/** Parse Cloudflare `_redirects` lines "<from> <to> [status]"; blanks and # comments skipped. */
function parseRedirects(text) {
  return text
    .split(/\r?\n/)
    .map((line, i) => ({ line: i + 1, raw: line.trim() }))
    .filter((l) => l.raw && !l.raw.startsWith("#"))
    .map((l) => {
      const [from, to, status] = l.raw.split(/\s+/);
      return { ...l, from, to, status: status ?? "302" };
    });
}

/** Variable names declared in .env.example (KEY=…). */
function envDocumented() {
  if (!exists(".env.example")) return null;
  return [
    ...readSrc(".env.example").matchAll(/^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=/gm),
  ].map((m) => m[1]);
}

/** Variable names the app reads: process.env.X and bare NEXT_PUBLIC_X tokens in app/ components/ lib/. */
function envUsed() {
  const names = new Set();
  const globs = [
    "app/**/*.tsx",
    "app/**/*.ts",
    "components/**/*.tsx",
    "components/**/*.ts",
    "lib/**/*.ts",
  ];
  for (const f of sourceFiles(globs)) {
    const src = readFileSync(f.abs, "utf8");
    for (const m of src.matchAll(
      /process\.env\.([A-Z][A-Z0-9_]*)|\b(NEXT_PUBLIC_[A-Z0-9_]+)\b/g,
    ))
      names.add(m[1] ?? m[2]);
  }
  names.delete("NODE_ENV"); // Next's own, never documented in .env.example
  return [...names].sort();
}

// ── the check ───────────────────────────────────────────────────────────────

export function run() {
  const r = new Report(
    "edge",
    "Edge files, redirects and dead-host artifacts (backlog §1.1, §12.1, §12.4, N4–N7).",
  );
  const pages = emittedPages();
  const content = new Set(pages.filter((p) => p.kind === "content").map((p) => p.path));
  const stubs = pages.filter((p) => p.kind === "stub");
  const stubDirs = new Set(publicStubDirs());

  // 1. _redirects
  const hasRedirects = exists("public/_redirects");
  if (!hasRedirects) {
    r.fail(
      `legacy URLs are served by ${stubs.length} meta-refresh stubs instead of 301s (no public/_redirects)`,
      "Emit public/_redirects from the REDIRECTS.md map via scripts/gen-redirects.mjs, then delete the stub directories.",
      "backlog §1.1",
    );
  } else {
    const rules = parseRedirects(readSrc("public/_redirects"));
    const unresolved = rules.filter((x) => !content.has(normalizePath(x.to ?? "") ?? ""));
    const shadowed = rules.filter((x) => stubDirs.has(normalizePath(x.from ?? "") ?? ""));
    const rawHebrew = rules.filter(
      (x) => HEBREW.test(x.from ?? "") || HEBREW.test(x.to ?? ""),
    );
    const non301 = rules.filter((x) => !/^30[18]$/.test(x.status));
    const list = (xs) => xs.map((x) => `line ${x.line}: ${x.raw}`).join("\n");
    if (unresolved.length)
      r.fail(
        `${unresolved.length} of ${rules.length} redirect destinations are not emitted content pages`,
        list(unresolved),
        "backlog §1.1",
      );
    if (shadowed.length)
      r.fail(
        `${shadowed.length} redirect from-paths still have a stub directory under public/ (the static file shadows the rule)`,
        list(shadowed),
        "backlog §1.1",
      );
    if (rawHebrew.length)
      r.fail(
        `${rawHebrew.length} redirect rules carry raw Hebrew (both columns must be percent-encoded)`,
        list(rawHebrew),
        "backlog §1.1",
      );
    if (non301.length)
      r.warn(
        `${non301.length} redirect rules are not 301/308`,
        list(non301),
        "backlog §1.1",
      );
    r.metric("redirectRules", rules.length);
  }

  // 2. _headers
  const hasHeaders = exists("public/_headers");
  if (!hasHeaders) {
    r.fail(
      "no public/_headers — the live security headers come from Cloudflare zone rules this repo does not own",
      undefined,
      "backlog §12.1",
    );
  } else {
    const text = readSrc("public/_headers");
    for (const [name, re] of REQUIRED_HEADERS)
      if (!re.test(text))
        r.warn(`public/_headers lacks ${name}`, undefined, "backlog §12.1");
    const csp = /content-security-policy-report-only/i.test(text)
      ? "Content-Security-Policy-Report-Only"
      : /content-security-policy/i.test(text)
        ? "Content-Security-Policy (enforcing)"
        : null;
    r.note(
      csp
        ? `public/_headers declares ${csp}`
        : "public/_headers declares no Content-Security-Policy(-Report-Only)",
      undefined,
      "backlog §12.2",
    );
  }

  // 3. dead-host artifacts + foreign-market stubs
  const dead = DEAD_HOST.filter(exists);
  if (dead.length) {
    r.fail(
      `${dead.length} dead-host artifact(s) keep a second origin alive (GitHub Pages / Apache) while production is Cloudflare Pages`,
      dead.join("\n"),
      "backlog §12.4, N5",
    );
  }
  const foreign = [...stubDirs].filter((d) => FOREIGN.test(d));
  if (foreign.length)
    r.fail(
      `${foreign.length} stub directory(ies) under public/ redirect foreign-market URLs (Houston/Dallas/Texas — not this business)`,
      foreign.join("\n"),
      "backlog N4",
    );

  // 4. llms.txt + robots.txt
  const hasLlms = exists("public/llms.txt");
  if (!hasLlms) r.warn("no public/llms.txt", undefined, "backlog §6.5");
  const robotsFile = path.join(OUT, "robots.txt");
  if (!existsSync(robotsFile))
    r.fail("out/robots.txt missing from the export", undefined, "backlog §6.1");
  else {
    const lines = readFileSync(robotsFile, "utf8").split(/\r?\n/);
    r.note(
      `out/robots.txt (first ${Math.min(10, lines.length)} of ${lines.length} lines) — Cloudflare's managed robots.txt overrides it at the edge and currently blocks every major AI crawler`,
      lines.slice(0, 10).join("\n"),
      "backlog §6.1",
    );
  }

  // 5. .env.example drift
  const documented = envDocumented();
  const used = envUsed();
  if (documented === null)
    r.note("no .env.example in the repo", undefined, "backlog §12.3, N6");
  else {
    const unused = documented.filter((v) => !used.includes(v));
    const undocumented = used.filter((v) => !documented.includes(v));
    if (unused.length)
      r.warn(
        `${unused.length} variable(s) documented in .env.example that nothing in app/ components/ lib/ reads`,
        unused.join("\n"),
        "backlog §12.3, N6",
      );
    if (undocumented.length)
      r.warn(
        `${undocumented.length} variable(s) read by the app but absent from .env.example`,
        undocumented.join("\n"),
        "backlog §12.3, N6",
      );
  }

  // 6. stale deploy comment + build hygiene on out/
  if (
    exists("next.config.mjs") &&
    /cPanel|Apache|websquadinc/i.test(readSrc("next.config.mjs"))
  )
    r.warn(
      "next.config.mjs still describes the deploy target as cPanel/Apache (websquadinc) — production is Cloudflare Pages",
      undefined,
      "backlog N7",
    );
  const outFiles = walk(OUT).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));
  const maps = outFiles.filter((f) => f.endsWith(".map"));
  if (maps.length)
    r.fail(
      `${maps.length} source map(s) ship in out/`,
      maps.slice(0, 10).join("\n"),
      "backlog §10.4",
    );
  const devFiles = outFiles.filter((f) => DEV_FILE.test(f));
  const devBanners = outFiles.filter(
    (f) =>
      f.endsWith(".js") &&
      /\.development\.js\b/.test(readFileSync(path.join(ROOT, f), "utf8")),
  );
  const dev = [...new Set([...devFiles, ...devBanners])];
  if (dev.length)
    r.fail(
      `${dev.length} file(s) in out/ carry a development React/Next build marker`,
      dev.slice(0, 10).join("\n"),
      "backlog §10.4",
    );

  r.metric("stubs", stubs.length);
  r.metric("redirectsFile", hasRedirects);
  r.metric("headersFile", hasHeaders);
  r.metric("deadHostArtifacts", dead.length);
  r.metric("foreignStubs", foreign.length);
  r.metric("llmsTxt", hasLlms);
  r.metric("envDocumented", documented?.length ?? 0);
  r.metric("envUsed", used.length);
  r.metric("sourceMaps", maps.length);
  r.metric("devBuildFiles", dev.length);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
