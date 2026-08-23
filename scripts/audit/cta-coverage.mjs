/**
 * cta-coverage.mjs — every conversion element carries `data-cta` (backlog §13.2, §8.5;
 * tracking-analytics + conversion-cro skills). GTM click triggers read the attribute and no JS
 * ships for them, so an untagged CTA is a click nobody will ever count.
 *
 *   - conversion elements: <a href="tel:"> · wa.me / api.whatsapp.com · <a href="mailto:"> ·
 *     <button|input type="submit"> · a button-styled link to /צור-קשר/ inside <main> (the pricing CTA)
 *   - chrome (header, footer, mobile bar): outside <main> and the identical raw tag on
 *     ≥ thresholds.cta.chromeShare of pages — counted ONCE, reported as metric chromeCtas
 *   - page-body element without data-cta → ONE fail per kind with a "path — snippet" list
 *   - page with no CTA in <main> and none in chrome → fail; commercial page whose <main> has no
 *     call/WhatsApp/form CTA → warn (the pricing page is the known instance, backlog §8.5)
 *   - data-cta values: one value must not name two element kinds, and follows {location}-{action}
 *
 * Usage: node scripts/audit/cta-coverage.mjs [--json]
 */

import { contentPages, tagsOf, normalizePath } from "./lib/pages.mjs";
import { Report, THRESHOLDS, finish, isMain, parseArgs } from "./lib/report.mjs";

// Not in thresholds.json yet — lift there as `"cta": { "chromeShare": 0.9, "maxDetail": 20 }`.
const CHROME_SHARE = THRESHOLDS.cta?.chromeShare ?? 0.9;
const MAX_DETAIL = THRESHOLDS.cta?.maxDetail ?? 20;

const KINDS = ["call", "whatsapp", "email", "submit", "contact-link"];
/** Kinds that satisfy "this page can convert" on its own (backlog §8.5): tel / WhatsApp / form. */
const HARD_CONVERSION = new Set(["call", "whatsapp", "submit"]);
const COMMERCIAL_TYPES = new Set(["home", "service", "location", "pricing", "about"]);
const CONTACT_PATH = "/צור-קשר/";

// ── local helpers (candidates for lib/pages.mjs) ────────────────────────────

/** Split a page into its <main> inner html and everything else (the chrome). */
function splitMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return { main: html, chrome: "" };
  return {
    main: m[1],
    chrome: html.slice(0, m.index) + html.slice(m.index + m[0].length),
  };
}

/** Conversion kind of one parsed tag (from tagsOf), or null when it is not a CTA. */
function ctaKind(tagName, t, inMain) {
  const href = typeof t.attrs.href === "string" ? t.attrs.href : "";
  if (tagName === "a") {
    if (/^tel:/i.test(href)) return "call";
    if (/wa\.me|api\.whatsapp\.com/i.test(href)) return "whatsapp";
    if (/^mailto:/i.test(href)) return "email";
    if (inMain && normalizePath(href) === CONTACT_PATH) return "contact-link";
    return null;
  }
  return t.attrs.type === "submit" ? "submit" : null;
}

/** Every conversion element on a page: { kind, raw, inMain, cta }. */
function ctaElements(html) {
  const { main, chrome } = splitMain(html);
  const out = [];
  for (const [segment, inMain] of [
    [main, true],
    [chrome, false],
  ]) {
    for (const tagName of ["a", "button", "input"]) {
      for (const t of tagsOf(segment, tagName)) {
        const kind = ctaKind(tagName, t, inMain);
        if (!kind) continue;
        const v = t.attrs["data-cta"];
        out.push({
          kind,
          raw: t.raw,
          inMain,
          cta: typeof v === "string" && v.trim() ? v.trim() : null,
        });
      }
    }
  }
  return out;
}

/** A readable form of a raw tag: drop the Tailwind class soup, trim the WhatsApp prefill query. */
function snippet(raw) {
  const s = raw.replace(/\sclass="[^"]*"/, "").replace(/(href="[^"?]*)\?[^"]*"/, '$1?…"');
  return s.length > 110 ? `${s.slice(0, 107)}…>` : s;
}

/** "path — snippet" lines, identical lines collapsed with ×n, capped at MAX_DETAIL. */
function detailList(items) {
  const counts = new Map();
  for (const { path, raw } of items) {
    const line = `${path} — ${snippet(raw)}`;
    counts.set(line, (counts.get(line) ?? 0) + 1);
  }
  const lines = [...counts].map(([line, n]) => (n > 1 ? `${line} ×${n}` : line));
  const shown = lines.slice(0, MAX_DETAIL);
  if (lines.length > MAX_DETAIL) shown.push(`… ${lines.length - MAX_DETAIL} more`);
  return shown.join("\n");
}

// ── the check ───────────────────────────────────────────────────────────────

export function run() {
  const r = new Report(
    "cta-coverage",
    "Every conversion element carries data-cta; chrome counted once (backlog §13.2, §8.5).",
  );
  const pages = contentPages();
  const scanned = pages.map((page) => ({ page, els: ctaElements(page.html) }));

  // Chrome = outside <main> and the identical raw tag on ≥ CHROME_SHARE of pages (header, footer, sticky bar).
  const chromeMin = Math.ceil(pages.length * CHROME_SHARE);
  const outsideFreq = new Map();
  for (const { els } of scanned)
    for (const e of els)
      if (!e.inMain) outsideFreq.set(e.raw, (outsideFreq.get(e.raw) ?? 0) + 1);
  const chrome = new Map(); // raw → element, recorded once
  for (const { els } of scanned)
    for (const e of els)
      if (!e.inMain && outsideFreq.get(e.raw) >= chromeMin && !chrome.has(e.raw))
        chrome.set(e.raw, e);

  const missing = new Map(KINDS.map((k) => [k, []])); // kind → [{ path, raw }]
  const values = new Map(); // data-cta value → Set(kind)
  const taggedRaw = new Set(); // distinct raw tags that carry data-cta
  let total = 0;
  let withCta = 0;
  const noCtaPages = [];
  const commercialNoCta = [];

  const record = (e, path) => {
    total++;
    if (e.cta) {
      withCta++;
      taggedRaw.add(e.raw);
      values.set(e.cta, (values.get(e.cta) ?? new Set()).add(e.kind));
    } else missing.get(e.kind).push({ path, raw: e.raw });
  };
  for (const e of chrome.values()) record(e, "(chrome)");

  for (const { page, els } of scanned) {
    let mainConversions = 0;
    for (const e of els) {
      if (chrome.has(e.raw)) continue; // counted once above
      record(e, page.path);
      if (e.inMain && HARD_CONVERSION.has(e.kind)) mainConversions++;
    }
    if (!els.length) noCtaPages.push(page.path);
    else if (COMMERCIAL_TYPES.has(page.type) && mainConversions === 0)
      commercialNoCta.push(`${page.path} (${page.type})`);
  }

  // 1. untagged elements — one failure per kind
  for (const kind of KINDS) {
    const list = missing.get(kind);
    if (list.length)
      r.fail(
        `${list.length} ${kind} CTA(s) without data-cta`,
        detailList(list),
        "backlog §13.2",
      );
  }

  // 2. chrome, reported once
  r.note(
    `${chrome.size} chrome CTA(s) outside <main> on ≥ ${Math.round(CHROME_SHARE * 100)}% of pages — counted once`,
    [...chrome.values()]
      .map((e) => `${e.cta ?? "MISSING data-cta"} — ${snippet(e.raw)}`)
      .join("\n"),
    "tracking-analytics",
  );

  // 3. page-level coverage
  if (noCtaPages.length)
    r.fail(
      `${noCtaPages.length} page(s) with no CTA in <main> and none in the chrome`,
      noCtaPages.join("\n"),
      "backlog §8.5",
    );
  if (commercialNoCta.length)
    r.warn(
      `${commercialNoCta.length} commercial page(s) whose <main> has no call/WhatsApp/form CTA`,
      commercialNoCta.join("\n"),
      "backlog §8.5",
    );

  // 4. data-cta values
  const ambiguous = [...values].filter(([, kinds]) => kinds.size > 1);
  if (ambiguous.length)
    r.warn(
      `${ambiguous.length} data-cta value(s) shared across element kinds (ambiguous GTM trigger)`,
      ambiguous.map(([v, k]) => `${v}: ${[...k].join(", ")}`).join("\n"),
      "tracking-analytics",
    );
  const offConvention = [...values.keys()].filter(
    (v) => !/^[a-z0-9]+-[a-z0-9]+$/.test(v),
  );
  if (offConvention.length)
    r.warn(
      `${offConvention.length} data-cta value(s) off the {location}-{action} convention`,
      offConvention.join("\n"),
      "tracking-analytics",
    );

  r.metric("pagesScanned", pages.length);
  r.metric("ctaElements", total);
  r.metric("withDataCta", withCta);
  r.metric("missingDataCta", total - withCta);
  r.metric("distinctValues", values.size);
  r.metric("distinctTaggedElements", taggedRaw.size);
  r.metric("chromeCtas", chrome.size);
  r.metric(
    "missingByKind",
    Object.fromEntries(KINDS.map((k) => [k, missing.get(k).length])),
  );
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
