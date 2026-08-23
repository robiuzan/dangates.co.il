/**
 * gsc-ingest.mjs — turn a Google Search Console "Performance → Export" CSV into the monthly
 * rank-tracking table in docs/rank-tracking.md (keyword-map §2 tiers; backlog §13.7).
 *
 * NOT an audit check: no Report, not registered in run-all.mjs. It converts, it never judges —
 * and it never invents a number: a missing column is a hard error (exit 1), a row whose numbers
 * do not parse is skipped and counted on stderr, and a file marked FIXTURE refuses --write.
 *
 * Every query is mapped to one site family by keyword (first match wins):
 *   location   a `name` from `locations` in lib/site-config.ts          (keyword-map tier 2)
 *   service    a `name` from `services`                                 (tier 2)
 *   symptom    לא נסגר | לא נפתח | לא מגיב | נתקע | רועש | תקלה          (tier 3)
 *   component  מנוע | שלט | עינית | לוח פיקוד | מסילה | גלגל | פס שיניים | קבל   (tier 4)
 *   brand      BFT | Nice | Somfy | Beninca | FAAC | CAME                 (keyword-map §9)
 *   generic    everything else                                            (tier 1)
 *
 * Usage: node scripts/audit/gsc-ingest.mjs <queries.csv> [--month YYYY-MM] [--pages pages.csv] [--write] [--top 50] [--json]
 *   Prints the "## <month>" markdown section to stdout (--json: the same numbers as JSON). --write
 *   inserts/replaces that month between the `<!-- gsc-ingest:sections-start/end -->` markers in
 *   docs/rank-tracking.md (file created with a short header if missing; other months kept, newest
 *   first; prose outside the markers untouched). --pages adds a top-pages table from the "Pages"
 *   export, with each URL decoded to its route and typed via lib/pages.mjs routeType().
 *   Fixture for a dry run: scripts/audit/fixtures/gsc-sample.csv (invented numbers; --write refuses it).
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, normalizePath, readSrc, routeType } from "./lib/pages.mjs";

const DOC = path.join(ROOT, "docs", "rank-tracking.md");
const USAGE =
  "usage: node scripts/audit/gsc-ingest.mjs <queries.csv> [--month YYYY-MM] [--pages pages.csv] [--write] [--top N] [--json]";
const FAMILIES = ["location", "service", "symptom", "component", "brand", "generic"];
const SYMPTOM = /לא נסגר|לא נפתח|לא מגיב|נתקע|רועש|תקלה/;
const COMPONENT = /מנוע|שלט|עינית|לוח פיקוד|מסילה|גלגל|פס שיניים|קבל/;
const BRAND = /\b(BFT|Nice|Somfy|Beninca|FAAC|CAME)\b/i;

/** Header recognisers — the export is English or Hebrew depending on the Search Console UI language. */
const COLUMNS = {
  query: /^(top queries|queries|query|שאילתות מובילות|שאילתות|שאילתה)$/i,
  page: /^(top pages|pages|page|דפים מובילים|דפים|דף|כתובת)$/i,
  clicks: /^(clicks|קליקים|לחיצות)$/i,
  impressions: /^(impressions|הופעות|חשיפות)$/i,
  ctr: /^ctr$|^שיעור קליקים/i,
  position: /^position$|^מיקום/i,
};

const die = (msg) => {
  process.stderr.write(`${msg}\n`);
  process.exit(1);
};

/** `--k v`, `--k=v`, bare `--write`, one positional (report.mjs's parseArgs only knows `--k=v`). */
function parseCli(argv) {
  const o = { file: null, month: null, pages: null, write: false, json: false, top: 50 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const eq = a.indexOf("=");
    const key = a.startsWith("--") ? a.slice(2, eq > 0 ? eq : undefined) : null;
    const val = () => (eq > 0 ? a.slice(eq + 1) : argv[++i]);
    if (key === "month") o.month = val();
    else if (key === "pages") o.pages = val();
    else if (key === "top") o.top = Number(val());
    else if (key === "write") o.write = true;
    else if (key === "json") o.json = true;
    else if (key !== null) die(`unknown flag --${key}\n${USAGE}`);
    else if (!o.file) o.file = a;
    else die(`unexpected argument "${a}"\n${USAGE}`);
  }
  return o;
}

/**
 * RFC-4180-ish CSV: quoted fields, "" escapes, commas and newlines inside quotes, CRLF, BOM.
 * Rows whose first cell starts with # are comments (the fixture carries one); blank rows drop.
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };
  const s = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"' && s[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") endCell();
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      endRow();
    } else cell += c;
  }
  if (cell !== "" || row.length) endRow();
  return rows.filter(
    (r) => r.some((c) => c.trim() !== "") && !r[0].trimStart().startsWith("#"),
  );
}

/** "1,234" → 1234 · "3.6%" → 3.6 · anything unparsable → null (never a guessed zero). */
const num = (s) => {
  const n = parseFloat(String(s ?? "").replace(/[%,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
};

/** Read one export. `keyCol` is "query" or "page"; the four metric columns are mandatory. */
function loadExport(file, keyCol) {
  if (!existsSync(file)) die(`${file}: no such file`);
  const text = readFileSync(file, "utf8");
  const [header, ...body] = parseCsv(text);
  if (!header) die(`${file}: empty file`);
  const idx = {};
  const missing = [];
  for (const key of [keyCol, "clicks", "impressions", "ctr", "position"]) {
    const i = header.findIndex((h) => COLUMNS[key].test(h.trim()));
    if (i < 0) missing.push(key);
    else idx[key] = i;
  }
  if (missing.length)
    die(
      `${file}: missing column(s) ${missing.join(", ")} — header was: ${header.join(" | ")}\n` +
        "Expected a Search Console Performance export (Top queries / שאילתות מובילות, Clicks / קליקים, " +
        "Impressions / הופעות, CTR, Position / מיקום). Nothing was written.",
    );
  const rows = [];
  const skipped = [];
  for (const r of body) {
    const rec = {
      key: (r[idx[keyCol]] ?? "").trim(),
      clicks: num(r[idx.clicks]),
      impressions: num(r[idx.impressions]),
      ctr: num(r[idx.ctr]),
      position: num(r[idx.position]),
    };
    if (
      !rec.key ||
      [rec.clicks, rec.impressions, rec.ctr, rec.position].some((v) => v === null)
    )
      skipped.push(r.join(","));
    else rows.push(rec);
  }
  return { rows, skipped, fixture: /^#.*FIXTURE/im.test(text) };
}

/** The `name` values of one `export const X = [ … ] as const` tuple in lib/site-config.ts (no TS import). */
function namesFrom(src, constName) {
  const block =
    src.match(
      new RegExp(`export const ${constName} = \\[([\\s\\S]*?)\\] as const`),
    )?.[1] ?? "";
  return [...block.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function family(q, locations, services) {
  if (locations.some((n) => q.includes(n))) return "location";
  if (services.some((n) => q.includes(n))) return "service";
  if (SYMPTOM.test(q)) return "symptom";
  if (COMPONENT.test(q)) return "component";
  if (BRAND.test(q)) return "brand";
  return "generic";
}

const byImpressions = (a, b) =>
  b.impressions - a.impressions || b.clicks - a.clicks || a.position - b.position;
const round1 = (n) => Math.round(n * 10) / 10;

/** The numbers behind both outputs: per-family rollup (position weighted by impressions) + top-N lists. */
function compute(month, queries, pages, top) {
  const acc = Object.fromEntries(
    [...FAMILIES, "total"].map((f) => [
      f,
      { queries: 0, clicks: 0, impressions: 0, posImp: 0 },
    ]),
  );
  for (const r of queries) {
    for (const a of [acc[r.family], acc.total]) {
      a.queries += 1;
      a.clicks += r.clicks;
      a.impressions += r.impressions;
      a.posImp += r.position * r.impressions; // weighted-mean numerator
    }
  }
  const families = {};
  for (const [f, a] of Object.entries(acc)) {
    const ctr = a.impressions ? round1((a.clicks / a.impressions) * 100) : null;
    const position = a.impressions ? round1(a.posImp / a.impressions) : null;
    families[f] = {
      queries: a.queries,
      clicks: a.clicks,
      impressions: a.impressions,
      ctr,
      position,
    };
  }
  const topQueries = [...queries].sort(byImpressions).slice(0, top);
  const topPages = [...(pages ?? [])]
    .sort(byImpressions)
    .slice(0, top)
    .map((r) => {
      const p = normalizePath(r.key.replace(/^https?:\/\/[^/]+/, "")) ?? r.key; // GSC exports percent-encoded Hebrew URLs
      return { ...r, key: p, type: routeType(p) };
    });
  return {
    month,
    queryCount: queries.length,
    pageCount: pages?.length ?? null,
    families,
    topQueries,
    topPages: pages ? topPages : null,
  };
}

const esc = (s) => s.replace(/\|/g, "\\|");
const pct = (n) => (n === null ? "—" : `${n.toFixed(1)}%`);
const pos = (n) => (n === null ? "—" : n.toFixed(1));

function renderMarkdown(d) {
  const L = [`## ${d.month}`, ""];
  L.push(
    `_Search Console Performance export: ${d.queryCount} queries${d.pageCount === null ? "" : `, ${d.pageCount} pages`}. Family position is the impression-weighted mean; family CTR is clicks ÷ impressions._`,
    "",
  );
  L.push(
    "| family | queries | clicks | impressions | CTR | avg position |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  );
  for (const [f, a] of Object.entries(d.families))
    L.push(
      `| ${f === "total" ? "**total**" : f} | ${a.queries} | ${a.clicks} | ${a.impressions} | ${pct(a.ctr)} | ${pos(a.position)} |`,
    );
  L.push("", `### Top ${d.topQueries.length} queries by impressions`, "");
  L.push(
    "| # | query | family | clicks | impressions | CTR | position |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: |",
  );
  d.topQueries.forEach((r, i) =>
    L.push(
      `| ${i + 1} | ${esc(r.key)} | ${r.family} | ${r.clicks} | ${r.impressions} | ${pct(r.ctr)} | ${pos(r.position)} |`,
    ),
  );
  if (d.topPages) {
    L.push("", `### Top ${d.topPages.length} pages by impressions`, "");
    L.push(
      "| # | page | type | clicks | impressions | CTR | position |",
      "| ---: | --- | --- | ---: | ---: | ---: | ---: |",
    );
    d.topPages.forEach((r, i) =>
      L.push(
        `| ${i + 1} | \`${esc(r.key)}\` | ${r.type} | ${r.clicks} | ${r.impressions} | ${pct(r.ctr)} | ${pos(r.position)} |`,
      ),
    );
  }
  return L.join("\n");
}

/**
 * Insert or replace one `## YYYY-MM` section inside the doc's marker comments (newest month first).
 * Everything outside the markers is the owner's prose and is left byte-for-byte; a doc without
 * markers gets them appended, a missing doc is created with a short header.
 */
const START = "<!-- gsc-ingest:sections-start -->";
const END = "<!-- gsc-ingest:sections-end -->";
function writeDoc(month, section) {
  const HEADER =
    "# Rank tracking — דן שערים חשמליים\n\n" +
    "Monthly Search Console snapshots generated by `scripts/audit/gsc-ingest.mjs` (families = keyword-map §2 tiers; " +
    "backlog §13.7). Month sections live between the two marker comments, newest first — never hand-edit them; " +
    "re-run the script on that month's export to replace one. Run `npm run format` afterwards so the tables pass `format:check`.\n";
  let doc = existsSync(DOC) ? readFileSync(DOC, "utf8") : HEADER;
  if (!doc.includes(START) || !doc.includes(END))
    doc = `${doc.trimEnd()}\n\n${START}\n${END}\n`;
  const [head, rest] = doc.split(START);
  const [inner, tail] = rest.split(END);
  const sections = new Map(
    inner
      .split(/^(?=## )/m)
      .filter((p) => p.startsWith("## "))
      .map((p) => [p.match(/^## (\S+)/)[1], p.trimEnd()]),
  );
  sections.set(month, section);
  const block = [...sections.keys()]
    .sort((a, b) => b.localeCompare(a))
    .map((k) => sections.get(k));
  writeFileSync(DOC, `${head}${START}\n${block.join("\n\n")}\n${END}${tail}`);
}

// ── main ────────────────────────────────────────────────────────────────────

const cli = parseCli(process.argv.slice(2));
if (!cli.file) die(USAGE);
const month = cli.month ?? new Date().toISOString().slice(0, 7);
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))
  die(`--month must be YYYY-MM, got "${month}"`);
if (!Number.isInteger(cli.top) || cli.top < 1)
  die(`--top must be a positive integer, got "${cli.top}"`);

const src = readSrc("lib/site-config.ts");
const locations = namesFrom(src, "locations");
const services = namesFrom(src, "services");
if (!locations.length || !services.length)
  die("could not read the locations/services names out of lib/site-config.ts");

const queries = loadExport(cli.file, "query");
for (const r of queries.rows) r.family = family(r.key, locations, services);
const pages = cli.pages ? loadExport(cli.pages, "page") : null;
for (const skipped of [queries.skipped, pages?.skipped ?? []]) {
  if (skipped.length)
    process.stderr.write(
      `skipped ${skipped.length} row(s) with an unparsable number or empty key:\n  ${skipped.join("\n  ")}\n`,
    );
}
if (!cli.month)
  process.stderr.write(`no --month given; using the current month ${month}\n`);
if (cli.write && (queries.fixture || pages?.fixture))
  die(
    "refusing --write: the input is marked FIXTURE — invented numbers never reach docs/rank-tracking.md",
  );

const data = compute(month, queries.rows, pages?.rows ?? null, cli.top);
const section = renderMarkdown(data);
process.stdout.write(cli.json ? `${JSON.stringify(data, null, 2)}\n` : `${section}\n`);
if (cli.write) {
  writeDoc(month, section);
  process.stderr.write(`wrote ## ${month} to ${path.relative(ROOT, DOC)}\n`);
}
