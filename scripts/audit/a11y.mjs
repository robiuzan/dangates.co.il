/**
 * a11y.mjs — mechanical WCAG 2.1 AA / IS 5568 checks (backlog §11, responsive-accessibility skill).
 *
 * Export (every content page, read from the emitted HTML):
 *   - <img> without an alt attribute (alt="" is fine) · <html lang="he" dir="rtl"> · landmarks
 *   - form controls with no programmatic name (<label for>, aria-label, aria-labelledby)
 *   - <a> / <button> with no text content and no aria-label
 * Source (the components the backlog names):
 *   - Process.tsx  an element interposed between <ol> and its <li>s                (§11.2)
 *   - Faq.tsx      answers removed from the DOM instead of <details>/<summary>     (N8)
 *   - Header.tsx   aria-expanded without aria-controls, no Escape handler           (§11.4)
 *   - LeadForm.tsx noValidate with no aria-invalid; tel input without validation    (§8.1)
 *   - TrustBar.tsx sr-only <dt> repeating the visible label                         (§11.3)
 * Contrast: @theme tokens in app/globals.css → WCAG ratios for the conversion-path pairs (§11.1).
 *
 * Usage: node scripts/audit/a11y.mjs [--json]
 */

import { contentPages, readSrc, stripTags, tagsOf } from "./lib/pages.mjs";
import { Report, THRESHOLDS, finish, isMain, parseArgs } from "./lib/report.mjs";

/** thresholds.json carries no a11y block yet; 4.5:1 is WCAG 1.4.3 (AA, normal text). */
const MIN_CONTRAST = THRESHOLDS.a11y?.minContrast ?? 4.5;

// ── local helpers (candidates for lib/pages.mjs) ─────────────────────────────

/** 1-based line number of a string index in `src`. */
const lineOf = (src, i) => src.slice(0, i).split("\n").length;

/** Elements of one non-nesting tag (a, button) with attrs + inner HTML. */
function elementsOf(html, tag) {
  const out = [];
  for (const m of html.matchAll(
    new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, "gi"),
  )) {
    const attrs = {};
    for (const a of m[1].matchAll(/([\w:-]+)(?:="([^"]*)")?/g))
      attrs[a[1]] = a[2] ?? true;
    out.push({ attrs, inner: m[2] });
  }
  return out;
}

/** `--color-*` tokens in the @theme block of app/globals.css → { accent: "#ffd700", … }. */
function themeColors() {
  const block = readSrc("app/globals.css").match(/@theme\s*{([\s\S]*?)}/)?.[1] ?? "";
  const tokens = {};
  for (const m of block.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})\b/gi))
    tokens[m[1]] = m[2].toLowerCase();
  return tokens;
}

/** WCAG 2.x relative luminance and contrast ratio (6-digit hex). */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/** Map<key, paths[]> → one line per root cause with a page count and a sample. */
const add = (map, key, p) => map.set(key, [...(map.get(key) ?? []), p]);
const grouped = (map) =>
  [...map]
    .map(
      ([k, ps]) =>
        `${k} — ${ps.length} page(s): ${ps.slice(0, 3).join(", ")}${ps.length > 3 ? " …" : ""}`,
    )
    .join("\n");
const instances = (map) => [...map.values()].reduce((n, ps) => n + ps.length, 0);

// ── export checks ───────────────────────────────────────────────────────────

function exportChecks(r, pages) {
  let imgCount = 0;
  const noAlt = new Map(),
    unlabeled = new Map(),
    unnamed = new Map(),
    landmarks = new Map();
  const badHtml = [];
  const faq = { total: 0, hidden: 0 };

  for (const { path, html } of pages) {
    // (1) images — alt must exist; empty alt marks a decorative image
    const imgs = tagsOf(html, "img");
    imgCount += imgs.length;
    for (const img of imgs)
      if (!("alt" in img.attrs))
        add(noAlt, String(img.attrs.src ?? img.raw.slice(0, 80)), path);

    // (2) form controls — a programmatic name via <label for>, aria-label or aria-labelledby
    const labelFor = new Set(
      tagsOf(html, "label")
        .map((l) => l.attrs.for)
        .filter(Boolean),
    );
    for (const { attrs } of [
      ...tagsOf(html, "input"),
      ...tagsOf(html, "select"),
      ...tagsOf(html, "textarea"),
    ]) {
      if (["hidden", "submit", "button", "reset", "image"].includes(String(attrs.type)))
        continue;
      if (
        attrs["aria-label"] ||
        attrs["aria-labelledby"] ||
        (attrs.id && labelFor.has(attrs.id))
      )
        continue;
      add(unlabeled, `#${attrs.id ?? "(no id)"} name="${attrs.name ?? "?"}"`, path);
    }

    // (3) links and buttons — text content, aria-label or aria-labelledby
    for (const tag of ["a", "button"]) {
      for (const { attrs, inner } of elementsOf(html, tag)) {
        if (stripTags(inner) || attrs["aria-label"] || attrs["aria-labelledby"]) continue;
        add(
          unnamed,
          `<${tag}${attrs.href ? ` href="${attrs.href}"` : ""}${attrs["data-cta"] ? ` data-cta="${attrs["data-cta"]}"` : ""}>`,
          path,
        );
      }
    }

    // (4) html lang + dir (CLAUDE.md §6)
    const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
    if (!/\blang="he"/.test(htmlTag) || !/\bdir="rtl"/.test(htmlTag))
      badHtml.push(`${path}: ${htmlTag || "(no <html> tag)"}`);

    // (5) landmarks
    const count = (t) => (html.match(new RegExp(`<${t}\\b`, "gi")) ?? []).length;
    if (count("main") !== 1) add(landmarks, `<main> ×${count("main")}`, path);
    for (const t of ["header", "footer", "nav"])
      if (!count(t)) add(landmarks, `no <${t}>`, path);

    // FAQ panels in the DOM (feeds the Faq.tsx finding below)
    const panels = html.match(/<div\b[^>]*id="faq-panel-\d+"[^>]*>/g) ?? [];
    faq.total += panels.length;
    faq.hidden += panels.filter((p) => /\shidden(=|\s|>)/.test(p)).length;
  }

  if (noAlt.size)
    r.fail(
      `${instances(noAlt)} <img> without an alt attribute`,
      grouped(noAlt),
      "backlog §11 / §7.5",
    );
  if (imgCount === 0)
    r.note(
      "0 <img> tags across the export — there is nothing to alt-check until photos exist",
      undefined,
      "backlog §7.5",
    );
  if (unlabeled.size)
    r.fail(
      `${instances(unlabeled)} form control(s) with no programmatic label`,
      grouped(unlabeled),
      "backlog §8.1",
    );
  if (unnamed.size)
    r.fail(
      `${instances(unnamed)} link(s)/button(s) with no accessible name`,
      grouped(unnamed),
      "backlog §11",
    );
  if (badHtml.length)
    r.fail(
      `<html lang="he" dir="rtl"> missing on ${badHtml.length} page(s)`,
      badHtml.join("\n"),
      "CLAUDE.md §6",
    );
  if (landmarks.size)
    r.warn(
      `landmark problems on ${instances(landmarks)} page(s)`,
      grouped(landmarks),
      "backlog §11",
    );

  r.metric("imgCount", imgCount);
  r.metric("unlabeledControls", instances(unlabeled));
  r.metric("emptyLinks", instances(unnamed));
  return faq;
}

// ── source checks ───────────────────────────────────────────────────────────

function sourceChecks(r, faq) {
  // (6) Process.tsx — anything between <ol>/<ul> and the first <li> breaks list semantics
  const proc = readSrc("components/marketing/Process.tsx");
  const interposed = [];
  for (const m of proc.matchAll(/<(ol|ul)\b[^>]*>([\s\S]*?)<li\b/g)) {
    const el = m[2].match(/<([A-Za-z][\w.]*)\b/);
    if (el)
      interposed.push(
        `<${el[1]}> between <${m[1]}> and <li> at Process.tsx:${lineOf(proc, m.index + m[0].indexOf(el[0]))}`,
      );
  }
  if (interposed.length)
    r.fail(
      "Process.tsx: element interposed between the list and its items — steps are not announced as a list",
      interposed.join("\n"),
      "backlog §11.2",
    );

  // (7) Faq.tsx — collapsed answers leave the DOM instead of a native disclosure
  const faqSrc = readSrc("components/marketing/Faq.tsx");
  const native = /<details\b/.test(faqSrc) && /<summary\b/.test(faqSrc);
  if (!native && (/\bhidden=\{/.test(faqSrc) || /display:\s*none/.test(faqSrc)))
    r.warn(
      "Faq.tsx: answers hidden with hidden={…} instead of <details>/<summary>",
      `${faq.hidden} of ${faq.total} FAQ answers are display:none in the DOM across the export — find-in-page and crawlers see the question only`,
      "backlog N8",
    );

  // (8) Header.tsx — mobile menu focus management
  const header = readSrc("components/layout/Header.tsx");
  const menu = [];
  for (const m of header.matchAll(/<button\b[\s\S]*?<\/button>/g))
    if (/aria-expanded/.test(m[0]) && !/aria-controls/.test(m[0]))
      menu.push(
        `aria-expanded without aria-controls at Header.tsx:${lineOf(header, m.index + m[0].indexOf("aria-expanded"))}`,
      );
  if (!/Escape/.test(header))
    menu.push('no Escape key handler ("Escape" does not appear in the file)');
  if (menu.length)
    r.warn(
      "Header.tsx: mobile menu has no focus management",
      menu.join("\n"),
      "backlog §11.4",
    );

  // (9) LeadForm.tsx — validation a11y
  const form = readSrc("components/forms/LeadForm.tsx");
  if (/\bnoValidate\b/.test(form) && !/aria-invalid/.test(form))
    r.fail(
      "LeadForm.tsx: noValidate disables native validation and nothing sets aria-invalid — errors are invisible to assistive tech",
      "one generic error string, no per-field state, no aria-describedby",
      "backlog §8.1",
    );
  const tel = [...form.matchAll(/<input\b[\s\S]*?\/>/g)]
    .map((m) => m[0])
    .find((s) => /type="tel"/.test(s));
  const missing = tel
    ? ["pattern", "inputMode"].filter((a) => !new RegExp(`\\b${a}=`).test(tel))
    : ['type="tel" input'];
  if (missing.length)
    r.warn(
      `LeadForm.tsx: tel input has no ${missing.join(" / ")} — no phone-format validation`,
      "Israeli formats must include landlines (this business is 072-…)",
      "backlog §8.1",
    );

  // (10) TrustBar.tsx — sr-only <dt> repeating the visible label
  const trust = readSrc("components/marketing/TrustBar.tsx");
  const srDt = trust.match(/<dt\b[^>]*sr-only[^>]*>\s*\{([^}]+)\}/);
  if (srDt && trust.split(`{${srDt[1]}}`).length - 1 > 1)
    r.warn(
      `TrustBar.tsx: sr-only <dt> repeats the visible {${srDt[1].trim()}} — every stat is announced twice`,
      `TrustBar.tsx:${lineOf(trust, srDt.index)}`,
      "backlog §11.3",
    );
}

// ── contrast ────────────────────────────────────────────────────────────────

function contrastChecks(r) {
  const colors = themeColors();
  const hex = (name) =>
    name === "white" ? "#ffffff" : name.startsWith("#") ? name : colors[name];
  const button = readSrc("components/ui/Button.tsx");
  const mobile = readSrc("components/layout/MobileCtaBar.tsx");

  // (a) accent hover: the text token on the hover background token, read from the variant itself
  const accent = button.match(/accent:\s*"([^"]*)"/)?.[1] ?? "";
  const hoverBg = accent.match(/hover:bg-([\w-]+)/)?.[1] ?? "accent-600";
  const accentFg = accent.match(/\btext-([\w-]+)/)?.[1] ?? "accent-foreground";
  // (b) WhatsApp: hardcoded literals in both files (rest + hover), or a --color-whatsapp token
  const literals = [
    ...new Set(
      [...`${button}\n${mobile}`.matchAll(/(hover:)?bg-\[(#[0-9a-f]{6})\]/gi)].map(
        (m) => `${m[2].toLowerCase()}${m[1] ? " (hover)" : ""}`,
      ),
    ),
  ];
  const whatsapp = literals.length
    ? literals.map((l) => ["white", l])
    : colors.whatsapp
      ? [["white", "whatsapp"]]
      : [];

  const groups = [
    { where: "Button.tsx accent variant :hover", pairs: [[accentFg, hoverBg]] },
    {
      where:
        "WhatsApp buttons — Button.tsx whatsapp variant + MobileCtaBar.tsx (hardcoded literal, not a token)",
      pairs: whatsapp,
    },
    {
      where: "primary surfaces (primary buttons, Process section)",
      pairs: [["white", "primary"]],
    },
    {
      where: "accent surfaces at rest (accent buttons, sticky call bar)",
      pairs: [["accent-foreground", "accent"]],
    },
  ];
  const ratios = {};
  for (const g of groups) {
    const failing = [];
    for (const [fgName, bgName] of g.pairs) {
      const [fg, bg] = [hex(fgName), hex(bgName.split(" ")[0])];
      if (!fg || !bg) {
        r.warn(
          `contrast: no colour for "${fgName} on ${bgName}"`,
          g.where,
          "backlog §11.1",
        );
        continue;
      }
      const ratio = contrast(fg, bg);
      ratios[`${fgName} on ${bgName}`] = ratio;
      if (ratio < MIN_CONTRAST)
        failing.push(
          `${fgName} (${fg}) on ${bgName}${bgName.startsWith("#") ? "" : ` (${bg})`} = ${ratio}:1`,
        );
    }
    if (failing.length)
      r.fail(
        `contrast below ${MIN_CONTRAST}:1 on ${g.where}`,
        failing.join("\n"),
        "backlog §11.1",
      );
  }
  if (colors["accent-500"] && colors["accent-foreground"])
    r.note(
      `accent-500 (${colors["accent-500"]}) is the AA-safe hover token: accent-foreground on accent-500 = ${contrast(colors["accent-foreground"], colors["accent-500"])}:1`,
      `swap hover:bg-${hoverBg} → hover:bg-accent-500 in Button.tsx`,
      "backlog N11",
    );
  r.metric("contrastPairs", ratios);
}

export function run() {
  const r = new Report(
    "a11y",
    "Mechanical WCAG 2.1 AA / IS 5568 checks on the export and the named components (backlog §11).",
  );
  const pages = contentPages();
  const faq = exportChecks(r, pages);
  sourceChecks(r, faq);
  contrastChecks(r);
  r.metric("pages", pages.length);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
