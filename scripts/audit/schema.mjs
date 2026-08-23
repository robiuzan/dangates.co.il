/**
 * schema.mjs — the JSON-LD graph on every content page vs docs/schema-graph.md (backlog §4,
 * schema-auditor, schema-structured-data skill).
 *
 *   - every ld+json block parses; the required node set per route type is present (schema-graph §2)
 *   - no dangling @id: a reference such as provider → #business must be defined on the same page
 *   - URL-like fields are percent-escaped and trailing-slashed, byte-equal to the canonical (§1)
 *   - forbidden until sourced: Person author, Review/AggregateRating, Offer, address, foundingDate
 *   - one @graph per page; the business node carries image/logo; areaServed names a real place
 *   - FAQPage questions are visible inside <main> and marked up once sitewide (schema-graph §4)
 *
 * The business @type and the areaServed phrase come from site.config.json, never from a literal.
 *
 * Usage: node scripts/audit/schema.mjs [--json]
 */

import { existsSync } from "node:fs";
import path from "node:path";
import {
  ROOT,
  SITE,
  contentPages,
  jsonLdBlocks,
  mainText,
  readSrc,
} from "./lib/pages.mjs";
import { Report, finish, isMain, parseArgs } from "./lib/report.mjs";

const HEBREW = /[֐-׿]/;
const URL_FIELDS = new Set([
  "url",
  "@id",
  "item",
  "mainEntityOfPage",
  "sameAs",
  "image",
  "logo",
]);
const PAGE_URL_FIELDS = new Set(["url", "@id", "item", "mainEntityOfPage"]);

// ── local helpers (candidates for lib/pages.mjs) ────────────────────────────

/** Visit every plain object inside a parsed JSON-LD value: fn(obj, keyUnderParent). */
function eachObject(v, fn, key = null) {
  if (Array.isArray(v)) return v.forEach((x) => eachObject(x, fn, key));
  if (!v || typeof v !== "object") return;
  fn(v, key);
  for (const k of Object.keys(v)) eachObject(v[k], fn, k);
}
const typesOf = (n) =>
  Array.isArray(n?.["@type"]) ? n["@type"] : n?.["@type"] ? [n["@type"]] : [];
/** Keys that carry data (not @context/@type/@id). Fewer than 2 → a reference, not a definition. */
const dataKeys = (n) => Object.keys(n).filter((k) => !k.startsWith("@"));
const push = (map, key, val) => map.set(key, [...(map.get(key) ?? []), val]);

/** Required top-level types per route type (schema-graph §2: every inner page gets a breadcrumb). */
function requiredTypes(type, business) {
  if (type === "home") return [business, "WebSite"];
  if (type === "service" || type === "location") return ["Service", "BreadcrumbList"];
  if (type === "post") return ["BlogPosting", "BreadcrumbList"];
  return ["BreadcrumbList"];
}

/** Source-side gates: a populated author registry, a set REVIEW_SOURCE_URL. */
function sourceGates() {
  const authorsSrc = existsSync(path.join(ROOT, "lib", "authors.ts"))
    ? readSrc("lib/authors.ts")
    : "";
  return {
    authors: /export\s+const\s+\w+[^=]*=\s*(?!\[\s*\]|\{\s*\})[[{]/.test(authorsSrc),
    reviews: /REVIEW_SOURCE_URL\s*:\s*string\s*\|\s*null\s*=\s*"http/.test(
      readSrc("lib/content.ts"),
    ),
  };
}

// ── the check ───────────────────────────────────────────────────────────────

export function run() {
  const r = new Report(
    "schema",
    "JSON-LD graph on every content page vs docs/schema-graph.md (backlog §4).",
  );
  const manifest = JSON.parse(readSrc("site.config.json"));
  const BUSINESS = manifest.schema?.type ?? "LocalBusiness";
  const PHRASE = manifest.schema?.areaServed ?? null;
  const gates = sourceGates();
  const pages = contentPages();

  const parseErrors = [];
  const missing = new Map(); // "routeType|Type" → pages
  const dangling = new Map(); // @id → pages
  const rawHebrew = new Map(); // field → "page: value"
  const noSlash = new Map(); // field → "page: value"
  const forbidden = new Map(); // reason → { ref, pages:Set }
  const multiBlock = [];
  const arrayBlock = [];
  const noImage = [];
  const phraseArea = [];
  const faqHidden = new Map(); // page → questions not in <main>
  const faqNames = new Map(); // question → pages
  const census = {};
  let withJsonLd = 0;
  let faqPages = 0;

  const forbid = (reason, ref, page) => {
    const e = forbidden.get(reason) ?? { ref, pages: new Set() };
    e.pages.add(page);
    forbidden.set(reason, e);
  };

  for (const page of pages) {
    const blocks = jsonLdBlocks(page.html);
    if (blocks.length) withJsonLd++;
    const good = blocks.filter((b) => !(b && b.__parseError));
    for (const b of blocks)
      if (b && b.__parseError) parseErrors.push(`${page.path}: ${b.__parseError}`);
    if (blocks.length > 1) multiBlock.push(`${page.path} (${blocks.length} blocks)`);
    for (const b of good)
      if (Array.isArray(b) && b.filter((o) => o && o["@context"]).length >= 2)
        arrayBlock.push(page.path);

    const types = new Set();
    const defined = new Set();
    const referenced = new Set();
    const questions = [];
    let business = null;

    eachObject(good, (node, key) => {
      const t = typesOf(node);
      t.forEach((x) => types.add(x));
      const isDefinition = dataKeys(node).length >= 2;
      if (typeof node["@id"] === "string")
        (isDefinition ? defined : referenced).add(node["@id"]);
      if (t.includes(BUSINESS) && isDefinition) business = node;
      if (t.includes("Question") && typeof node.name === "string")
        questions.push(node.name);

      // forbidden-until-sourced (schema-graph §3–§4)
      if (t.includes("Review") && !gates.reviews)
        forbid(
          "Review node without REVIEW_SOURCE_URL",
          "schema-graph §4.1 · backlog §4.1",
          page.path,
        );
      if (t.includes("Offer") || t.includes("AggregateOffer"))
        forbid(
          "Offer node (prices are authored estimates)",
          "backlog §4.10 · schema-graph §4.4",
          page.path,
        );
      for (const k of Object.keys(node)) {
        if (k === "aggregateRating" && !gates.reviews)
          forbid(
            "aggregateRating without REVIEW_SOURCE_URL",
            "schema-graph §4.1 · backlog §4.1",
            page.path,
          );
        if (k === "priceSpecification" || k === "offers")
          forbid(
            `"${k}" (prices are authored estimates)`,
            "backlog §4.10 · schema-graph §4.4",
            page.path,
          );
        if (k === "foundingDate")
          forbid(
            "foundingDate while foundedYear is null",
            "schema-graph §4.7 · schema-graph §3",
            page.path,
          );
        if (
          k === "author" &&
          !gates.authors &&
          [node.author]
            .flat()
            .some((a) => typeof a === "string" || typesOf(a).includes("Person"))
        )
          forbid(
            "named Person author while lib/authors.ts has no registry",
            "schema-graph §6 · business-facts §B",
            page.path,
          );
        if (
          k === "areaServed" &&
          PHRASE &&
          [node.areaServed]
            .flat()
            .some((a) => (typeof a === "string" ? a : a?.name) === PHRASE)
        )
          phraseArea.push(`${page.path} (${key ?? t.join("/")})`);

        // URL-like fields (schema-graph §1)
        if (!URL_FIELDS.has(k)) continue;
        for (const v of [node[k]].flat()) {
          if (typeof v !== "string") continue;
          if (HEBREW.test(v)) push(rawHebrew, k, `${page.path}: ${v}`);
          const u = v.split("#")[0];
          const isPage =
            u.startsWith(SITE) && !/\.[a-z0-9]+$/i.test(u.slice(SITE.length)); // bare origin counts
          if (PAGE_URL_FIELDS.has(k) && isPage && !u.endsWith("/"))
            push(noSlash, k, `${page.path}: ${v}`);
        }
      }
    });

    const c = (census[page.type] ??= {});
    for (const t of types) c[t] = (c[t] ?? 0) + 1;
    for (const req of requiredTypes(page.type, BUSINESS))
      if (!types.has(req)) push(missing, `${page.type}|${req}`, page.path);
    for (const id of referenced) if (!defined.has(id)) push(dangling, id, page.path);
    if (business && business.address)
      forbid(
        "address on the business node (service-area business, no premises)",
        "backlog §4.11 · schema-graph §3",
        page.path,
      );
    if (business && !business.image && !business.logo) noImage.push(page.path);

    if (types.has("FAQPage")) {
      faqPages++;
      const text = mainText(page.html);
      for (const q of questions) {
        const name = q.replace(/\s+/g, " ").trim();
        if (!text.includes(name)) push(faqHidden, page.path, name);
        push(faqNames, name, page.path);
      }
    }
  }

  // ── findings, one per root cause ──────────────────────────────────────────
  if (parseErrors.length)
    r.fail(
      `ld+json does not parse on ${parseErrors.length} page(s)`,
      parseErrors.join("\n"),
      "backlog §4.2",
    );
  for (const [key, paths] of missing) {
    const [type, req] = key.split("|");
    const ref =
      req === "WebSite"
        ? "backlog §4.9"
        : req === "BreadcrumbList"
          ? "backlog §4.3"
          : "backlog §4.2 · schema-graph §2";
    r.fail(`${type}: ${paths.length} page(s) emit no ${req} node`, paths.join("\n"), ref);
  }
  for (const [id, paths] of dangling)
    r.fail(
      `@id ${id} is referenced but never defined on ${paths.length} page(s)`,
      paths.join("\n"),
      "backlog §4.4 · schema-graph §4.5",
    );
  for (const [k, items] of rawHebrew)
    r.fail(
      `${k}: raw Hebrew in ${items.length} URL value(s) — must be percent-escaped like the canonical`,
      items.join("\n"),
      "backlog §4.7 · schema-graph §1",
    );
  for (const [reason, { ref, pages: ps }] of forbidden)
    r.fail(`${reason} on ${ps.size} page(s)`, [...ps].join("\n"), ref);
  for (const [p, qs] of faqHidden)
    r.fail(
      `${p}: ${qs.length} FAQPage question(s) not visible in <main>`,
      qs.join("\n"),
      "schema-graph §4.2",
    );
  for (const [q, paths] of faqNames)
    if (paths.length > 1)
      r.fail(
        `FAQ question marked up ${paths.length}× sitewide`,
        `"${q}"\n${paths.join("\n")}`,
        "schema-graph §4.6",
      );

  for (const [k, items] of noSlash)
    r.warn(
      `${k}: ${items.length} page URL(s) on ${SITE} lack the trailing slash the export enforces`,
      items.join("\n"),
      "backlog §4.12 · schema-graph §1",
    );
  if (multiBlock.length)
    r.warn(
      `${multiBlock.length} page(s) split JSON-LD across ≥ 2 <script> blocks — merge into one @graph`,
      multiBlock.join("\n"),
      "backlog §4.6",
    );
  if (arrayBlock.length)
    r.warn(
      `${arrayBlock.length} page(s) emit one block as a JSON array of @context objects instead of a single @graph`,
      arrayBlock.join("\n"),
      "backlog §4.6",
    );
  if (noImage.length)
    r.warn(
      `business node carries no image/logo on ${noImage.length} page(s)`,
      noImage.join("\n"),
      "backlog §4.5",
    );
  if (phraseArea.length)
    r.warn(
      `areaServed is the marketing phrase "${PHRASE}" on ${phraseArea.length} node(s)`,
      phraseArea.join("\n"),
      "backlog §4.8 · schema-graph §5",
    );
  if (!gates.authors)
    r.note(
      "lib/authors.ts absent or empty — Organization author tolerated, a Person author is forbidden",
      undefined,
      "schema-graph §6",
    );
  if (!gates.reviews)
    r.note(
      "REVIEW_SOURCE_URL unset — Review/AggregateRating forbidden",
      undefined,
      "schema-graph §4.1",
    );

  r.metric("pages", pages.length);
  r.metric("pagesWithJsonLd", withJsonLd);
  r.metric("typeCensus", census);
  r.metric(
    "danglingIds",
    [...dangling.values()].reduce((n, p) => n + p.length, 0),
  );
  r.metric(
    "rawHebrewUrls",
    [...rawHebrew.values()].reduce((n, p) => n + p.length, 0),
  );
  r.metric("faqPages", faqPages);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
