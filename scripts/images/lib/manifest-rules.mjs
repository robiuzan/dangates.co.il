/**
 * manifest-rules.mjs — the rules of content/images/manifest.json, in ONE place.
 *
 * Imported by BOTH `lib/images.ts` (which throws at module init, so a bad manifest cannot build a
 * page) and `scripts/images/check-images-out.mjs` (which proves the export). Two copies of these
 * rules would drift, so there is one. Pure: no fs, no network — the gate supplies the file-system
 * facts, this module supplies the judgement. JSDoc types are what `tsc` reads at the import
 * boundary (allowJs).
 *
 * This file is the fleet's: everything about this site comes from images.config.mjs. The contract
 * is Media Studio/page-images/docs/contract.md §2 (slots) and §4 (manifest + rules).
 *
 * Images are illustrations under one site-wide note, never evidence: the rules below are on the
 * WORDS around a picture — an alt or a caption never claims a job, a figure, a date, a customer or
 * a name.
 */

import {
  aboutRoute,
  ambiguousCityNames,
  areaSlugs,
  bannedNamesHe,
  excludedRoutes,
  extraBanned,
  extraBannedRegex,
  fileGroups,
  firstNamesHe,
  layout,
  lists,
  peopleIds,
  sizeClasses,
  textLimits,
} from "./images.config.mjs";

/** Every slot id a placement may name (contract §2). */
export const SLOT_IDS = Object.freeze([
  "main",
  "detail",
  "work",
  "strip-1",
  "strip-2",
  "strip-3",
  "pair-1",
  "pair-2",
  "team",
  "story",
  "survey",
  "layers",
  "lead",
  "mid",
  "end",
  "supplied",
  "generated",
  "thumb",
]);

export const STATUSES = Object.freeze(["candidate", "approved", "rejected", "retired"]);
export const PHASES = Object.freeze(["done", "in-progress", "diagnosis", "materials"]);

export const FILE_GROUPS = Object.freeze([...fileGroups]);
export const SIZE_CLASSES = Object.freeze({ ...sizeClasses });
export const EXCLUDED_ROUTES = Object.freeze([...excludedRoutes]);
export const PEOPLE_IDS = Object.freeze([...peopleIds]);
export const FIRST_NAMES_HE = Object.freeze([...firstNamesHe]);
export const BANNED_NAMES_HE = Object.freeze([...bannedNamesHe]);
export const AREA_SLUGS_EN = Object.freeze([...areaSlugs]);

/** A `retired` entry keeps its file at least this long (contract §4). */
export const RETIRED_KEEP_DAYS = 60;

/**
 * The phone copy of an image (contract §2; the fleet's phone copies: gagoline.co.il's opt-in, on
 * by default in every port since 2026-11-11): a static export has no resizer, so a phone would
 * otherwise download the 1200–1400 px file. Written after install by Media Studio
 * page-images/tools/phone-copies.mjs, which reads these two numbers from here; Figure offers it
 * through <picture> at PHONE_MEDIA. Measured on hambabait.co.il before its port: the full-size
 * first image cost a phone 0.5–1.2 s of LCP. Opting out is CHECKLIST §5b; the tool refuses to
 * run on a site that exports no PHONE_COPY.
 */
export const PHONE_COPY = Object.freeze({ width: 720, maxBytes: 122880 });
export const PHONE_MEDIA = "(max-width: 640px)";

export const GATE_KEYS = Object.freeze([
  "minPerContentPage",
  "maxImageBytes",
  "maxPageImageBytes",
  "maxTotalBytes",
]);

/**
 * @typedef {object} RulesContext
 * @property {readonly string[]} contentRoutes  every route a placement may name
 * @property {readonly string[]} cityNames      the Hebrew area names
 * @property {readonly string[]} citySlugs      ASCII area tokens — never inside a file name
 * @property {readonly string[]} serviceSlugs   the service slugs
 */

/**
 * One row of a site list: the strings the routes and titles are built from. `lib/images.ts` passes
 * the site's own arrays, the gate passes what site-lists.mjs reads from the same files.
 * @typedef {{ readonly slug?: string | null, readonly name?: string | null, readonly title?: string | null, readonly pillar?: string | null }} SiteRow
 */

/**
 * The rows of each route group, the site's own lists under their own names.
 * @typedef {{ readonly services?: readonly SiteRow[], readonly areas?: readonly SiteRow[], readonly articles?: readonly SiteRow[], readonly jobs?: readonly SiteRow[], readonly [group: string]: readonly SiteRow[] | undefined }} SiteRows
 */

/** A list's configuration, or undefined when the site does not have that list. */
const listOf = (group) => /** @type {Record<string, any>} */ (lists)[group];

/** The groups read by name. Any other list with a route is one of the site's own. */
const NAMED_GROUPS = ["services", "jobs", "areas", "articles"];

/** The site's own lists (a brand or a fault silo), the ones the toolkit calls topics. */
export const TOPIC_GROUPS = Object.freeze(
  Object.keys(lists).filter(
    (group) => !NAMED_GROUPS.includes(group) && listOf(group)?.route,
  ),
);

/** Every group of rows: the one set the gate, the titles and lib/images.ts all walk. */
export const ROW_GROUPS = Object.freeze([...NAMED_GROUPS, ...TOPIC_GROUPS]);

/** @param {string} pattern @param {SiteRow} row */
const fillRoute = (pattern, row) =>
  pattern.replace(
    /\{(\w+)\}/g,
    (_, key) => /** @type {Record<string, any>} */ (row)[key] ?? "",
  );

/**
 * The route of one list row, or null when the group has no pages.
 * @param {string} group
 * @param {SiteRow} row
 * @returns {string | null}
 */
export function routeOfRow(group, row) {
  const pattern = listOf(group)?.route;
  return pattern ? fillRoute(pattern, row) : null;
}

/**
 * Every route the layout names: the static routes in order, each `{ group }` expanded through its
 * list. `lib/images.ts` calls this with the arrays the pages are generated from, the gate and the
 * status report with the rows ts-scan reads from the same files.
 * @param {SiteRows} rows
 * @returns {string[]} the routes, excluded ones included
 */
export function layoutRoutes(rows) {
  const out = [];
  for (const item of layout) {
    if ("route" in item) {
      out.push(item.route);
      continue;
    }
    const group = item.group;
    for (const row of /** @type {Record<string, readonly SiteRow[]>} */ (rows)[group] ??
      []) {
      const route = routeOfRow(group, row);
      if (route) out.push(route);
    }
  }
  return out;
}

/**
 * Every route that may carry a content image.
 * @param {SiteRows} rows
 * @returns {string[]}
 */
export function contentRoutesOf(rows) {
  return layoutRoutes(rows).filter((r) => !EXCLUDED_ROUTES.includes(r));
}

const areaName = (row) => row.name ?? row.title ?? null;

/** A row's title, the way the toolkit reads it: the list's `nameKey`, then name, title, slug. */
const titleOf = (group, row) =>
  row[listOf(group)?.nameKey ?? "name"] ?? row.name ?? row.title ?? row.slug ?? "";

/** @param {SiteRow} row @returns {string} */
export const serviceName = (row) => titleOf("services", row);

/**
 * The route of every list row with its title, so a gallery tile can link to the page it
 * illustrates.
 * @param {SiteRows} rows
 * @returns {Map<string, string>}
 */
export function pageTitles(rows) {
  const titles = new Map();
  for (const group of ROW_GROUPS) {
    for (const row of /** @type {Record<string, readonly SiteRow[]>} */ (rows)[group] ??
      []) {
      const route = routeOfRow(group, row);
      if (route) titles.set(route, titleOf(group, row));
    }
  }
  return titles;
}

/**
 * The context the rules need, from the site's rows. Both callers build it here, so `lib/images.ts`
 * and the gate can never judge a manifest by two different lists.
 * @param {SiteRows} rows
 * @returns {RulesContext}
 */
export function rulesContext(rows) {
  const areas = rows.areas ?? [];
  const aliases = listOf("areas")?.aliases ?? {};
  const tokens = areas
    .map((row) => aliases[areaName(row) ?? ""] ?? row.slug)
    .filter((slug) => typeof slug === "string" && /^[a-z0-9-]+$/.test(slug));
  return {
    contentRoutes: contentRoutesOf(rows),
    cityNames: areas.map(areaName).filter((name) => typeof name === "string"),
    citySlugs: [...new Set([...AREA_SLUGS_EN, ...tokens])],
    serviceSlugs: (rows.services ?? []).flatMap((row) => (row.slug ? [row.slug] : [])),
  };
}

const HEBREW = /[א-ת]/;
const isObj = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
const isPosInt = (x) => Number.isInteger(x) && x > 0;
const isNonNegInt = (x) => Number.isInteger(x) && x >= 0;
const DATE_STAMP = /^\d{4}-\d{2}-\d{2}\s*[—–-]\s*\S/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** @param {string} s */
export function hasHebrew(s) {
  return HEBREW.test(String(s));
}

/** @param {string} s */
export function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** A name of several words, also when they are joined by a hyphen or a maqaf ("תל-אביב"). */
const spaced = (name) => escapeRe(name).replace(/ /g, "[\\s\\-־]+");

/** Hebrew word edges — \b is ASCII-only. Up to two prefix letters (ב, ל, מ, ו, ה, ש, כ). */
const hebrewWord = (name) =>
  new RegExp(`(?<![\\u05d0-\\u05ea])[ובלמהשכ]{0,2}${spaced(name)}(?![\\u05d0-\\u05ea])`);

/**
 * City names that are also ordinary Hebrew nouns (images.config.mjs `ambiguousCityNames`) are
 * flagged only when they stand alone at the end of a clause, where a place name would sit, never
 * mid-sentence before a noun.
 */
const AMBIGUOUS_CITY_NAMES = new Set(ambiguousCityNames);
const ambiguousWord = (name) =>
  new RegExp(
    `(?<![\\u05d0-\\u05ea])[ובלמ]?${spaced(name)}(?![\\u05d0-\\u05ea])(?=\\s*(?:[.,;:!?—–-]|$))`,
  );

/**
 * The claim stems an alt or caption may never carry (contract §4). Disclosure is site-wide, so the
 * words that would label one image ("הדמיה", "AI") are banned too: a label on some images implies
 * the others are photographs.
 *
 * These patterns are the toolkit's own, character for character (Media Studio
 * page-images/lib/alt.mjs BANNED_HE; a test compares the two). The toolkit validates a caption
 * before it reaches this manifest and `lib/images.ts` throws on what it refuses here, so a stem
 * this list adds on its own could take the dev server down over a text the toolkit passed. A
 * site's own stems go in site.json `claims`, which reaches both sides.
 */
export const FLEET_BANNED = Object.freeze([
  {
    re: /תמונה של/,
    why: "״תמונה של״ — describe what is in frame, not that it is a picture",
  },
  { re: /לפני ואחרי/, why: "״לפני ואחרי״ — no pair exists, so it is a claim" },
  {
    re: /כוכב|דירוג|★|מומל[צץ]/,
    why: "a rating stem (כוכב / דירוג / ★ / מומלץ)",
  },
  {
    re: /הדמי|(?<![A-Za-z])AI(?![A-Za-z])|(?<![א-ת])בינה(?![א-ת])/,
    why: "a per-image AI label (הדמיה / AI / בינה) — the disclosure is the site-wide note",
  },
  { re: /(?<!\d)\d{4}(?!\d)/, why: "a 4-digit number reads as a year" },
  { re: /\d{1,2}\s*[./]\s*\d{1,2}/, why: "a date-like number pair" },
  {
    re: /\d\s*מ[״"׳']?[רמ](?![א-ת])/,
    why: "digits before מ״ר / מ״מ — an area or thickness is a job fact",
  },
  {
    re: /₪|ש["״]ח|(?<![א-ת])[ובלה]?שקל(?:ים)?(?![א-ת])|מחיר/,
    why: "a price stem (₪ / ש״ח / שקל / מחיר)",
  },
  {
    re: /\d\s*(שעות|שעה|ימים|יום|שבועות|שבוע|חודשים|חודש|שנים|שנה|שנות)(?![א-ת])/,
    why: "digits with a duration word — how long a job took is a job fact",
  },
  { re: /אחריות/, why: "a warranty word — a term, not a picture" },
  {
    re: /לקוח|דייר(?:ים|י|ת)?(?![א-ת])|משפחת\s/,
    why: "a customer stem (לקוח / דייר / משפחת)",
  },
  { re: /מעל\s*\d+\s*שנ/, why: "a count of years — a number needs a source" },
  { re: /["']/, why: "an ASCII quote — use גרש ׳ and גרשיים ״" },
]);

/** The fleet's stems plus this site's own (site.json `claims`, through images.config.mjs). */
const BANNED = [
  ...FLEET_BANNED,
  ...extraBanned.map((stem) => ({
    re: new RegExp(escapeRe(stem)),
    why: `״${stem}״ — a banned stem of this site`,
  })),
  ...extraBannedRegex.map((source) => ({
    re: new RegExp(source),
    why: `a banned pattern of this site (${source})`,
  })),
];

/**
 * Problems with one alt or caption text. Empty array = clean.
 * @param {unknown} text
 * @param {"alt"|"caption"} kind
 * @param {RulesContext} ctx
 * @param {{ firstNamesAllowed?: boolean }} [opts]  captions on the about page only
 * @returns {string[]}
 */
export function textProblems(text, kind, ctx, opts = {}) {
  const out = [];
  if (typeof text !== "string" || !text.trim()) return [`${kind} is empty`];
  const t = text.trim();
  if (!hasHebrew(t)) out.push(`${kind} has no Hebrew letters`);
  const { min, max } = textLimits[kind];
  if (t.length < min || t.length > max)
    out.push(`${kind} is ${t.length} chars (${min}–${max} allowed)`);
  for (const b of BANNED) if (b.re.test(t)) out.push(`${kind} carries ${b.why}`);
  for (const name of ctx.cityNames) {
    const re = AMBIGUOUS_CITY_NAMES.has(name) ? ambiguousWord(name) : hebrewWord(name);
    if (re.test(t))
      out.push(`${kind} names an area (${name}) — the page's own headings supply it`);
  }
  if (!opts.firstNamesAllowed)
    for (const name of FIRST_NAMES_HE)
      if (hebrewWord(name).test(t))
        out.push(
          `${kind} names ${name} — first names only in a caption whose every placement is the about page`,
        );
  for (const name of BANNED_NAMES_HE)
    if (hebrewWord(name).test(t))
      out.push(
        `${kind} names ${name} — a full name or surname never appears in image text`,
      );
  return out;
}

/**
 * The public path an entry renders from. `legacySrc` (an untouched original) wins; an approved
 * file lives under /images/, a candidate under /images/_candidates/.
 * @param {{ file: string, legacySrc?: string | null, status: string }} entry
 * @returns {string}
 */
export function srcOf(entry) {
  if (entry.legacySrc) return entry.legacySrc;
  return entry.status === "candidate"
    ? `/images/_candidates/${entry.file}`
    : `/images/${entry.file}`;
}

/**
 * The public path of an entry's derived thumbnail, or null.
 * @param {{ status: string, thumb?: { file: string } | null }} entry
 * @returns {string | null}
 */
export function thumbSrcOf(entry) {
  if (!entry.thumb) return null;
  return entry.status === "candidate"
    ? `/images/_candidates/${entry.thumb.file}`
    : `/images/${entry.thumb.file}`;
}

/**
 * The public path of an entry's phone copy, or null. Only approved entries carry one.
 * @param {{ phone?: { file: string } | null }} entry
 * @returns {string | null}
 */
export function phoneSrcOf(entry) {
  return entry.phone ? `/images/${entry.phone.file}` : null;
}

/**
 * Whether an entry renders: approved always; a candidate only in draft mode (IMAGES_DRAFT=1).
 * @param {{ status: string }} entry
 * @param {boolean} draft
 */
export function isVisible(entry, draft) {
  return entry.status === "approved" || (draft && entry.status === "candidate");
}

/**
 * Whether a file slug carries an area token as a dash-separated run ("tel-aviv-wall-01").
 * @param {string} fileSlug
 * @param {readonly string[]} citySlugs
 * @returns {string | null} the offending area slug
 */
export function citySlugInFile(fileSlug, citySlugs) {
  const tokens = fileSlug.split("-");
  for (const slug of citySlugs) {
    const parts = slug.split("-");
    for (let i = 0; i + parts.length <= tokens.length; i++) {
      if (parts.every((p, j) => tokens[i + j] === p)) return slug;
    }
  }
  return null;
}

/** @param {unknown} v */
const provenanceProblems = (v) => {
  if (!isObj(v)) return ["provenance must be an object"];
  const out = [];
  if (v.kind === "ai-generated") {
    for (const k of ["tool", "model", "created", "prompt", "promptSha"])
      if (typeof v[k] !== "string" || !v[k]) out.push(`provenance.${k} is required`);
    if (!Array.isArray(v.refs)) out.push("provenance.refs must be an array");
  } else if (v.kind === "owner-supplied") {
    if (typeof v.received !== "string" || !ISO_DATE.test(v.received))
      out.push("provenance.received must be an ISO date");
    if (v.originAsserted !== false)
      out.push("provenance.originAsserted must be false — never ״verified real״");
  } else out.push(`provenance.kind must be ai-generated | owner-supplied`);
  return out;
};

/**
 * Problems with one entry (shape + text rules + status consistency). Prefixed by the caller.
 * @param {unknown} e
 * @param {RulesContext} ctx
 * @param {{ maxImageBytes: number }} gates
 * @returns {string[]}
 */
export function entryProblems(e, ctx, gates) {
  if (!isObj(e)) return ["entry is not an object"];
  const out = [];
  const p = (m) => out.push(m);

  if (typeof e.id !== "string" || !/^[a-z0-9-]+$/.test(e.id))
    p("id must match [a-z0-9-]+");
  const fileRe = new RegExp(
    `^(${FILE_GROUPS.join("|")})/([a-z0-9-]+)\\.(webp|jpg|jpeg|png)$`,
  );
  const fm = typeof e.file === "string" ? fileRe.exec(e.file) : null;
  if (!fm)
    p(`file must be <group>/<slug>.webp|jpg|png with group in ${FILE_GROUPS.join("|")}`);
  else {
    const city = citySlugInFile(fm[2], ctx.citySlugs);
    if (city)
      p(`file names an area (${city}) — file names are subject-based, never a place`);
    for (const n of PEOPLE_IDS)
      if (`-${fm[2]}-`.includes(`-${n}-`)) p(`file names a person (${n})`);
  }
  if (e.legacySrc !== null && e.legacySrc !== undefined) {
    if (typeof e.legacySrc !== "string" || !/^\/[^/]/.test(e.legacySrc))
      p("legacySrc must be an absolute /path or null");
    else if (e.legacySrc.startsWith("/images/"))
      p("legacySrc must point at the original location, not /images/");
  }
  const legacy = Boolean(e.legacySrc);

  if (!isPosInt(e.width) || !isPosInt(e.height))
    p("width/height must be positive integers");
  if (!isPosInt(e.bytes)) p("bytes must be a positive integer");
  if (typeof e.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(e.sha256))
    p("sha256 must be 64 lowercase hex chars");
  const cls = typeof e.sizeClass === "string" ? SIZE_CLASSES[e.sizeClass] : undefined;
  if (!cls) p(`sizeClass must be one of ${Object.keys(SIZE_CLASSES).join("|")}`);
  else if (!legacy) {
    const cap = Math.min(gates.maxImageBytes, cls.maxBytes);
    if (isPosInt(e.bytes) && e.bytes > cap)
      p(`bytes ${e.bytes} exceed the ${e.sizeClass} budget of ${cap}`);
    if (
      isPosInt(e.width) &&
      isPosInt(e.height) &&
      Math.max(e.width, e.height) !== cls.longEdge
    )
      p(`long edge must be ${cls.longEdge} for sizeClass ${e.sizeClass}`);
  }

  // A retired entry has usually lost its placements to whatever replaced it: only its file stays.
  if (
    !Array.isArray(e.placements) ||
    (e.placements.length === 0 && e.status !== "retired")
  )
    p("placements must be a non-empty array");
  const placements = Array.isArray(e.placements) ? e.placements : [];
  for (const pl of placements) {
    if (!isObj(pl)) {
      p("placement is not an object");
      continue;
    }
    if (typeof pl.route !== "string" || !ctx.contentRoutes.includes(pl.route))
      p(`placement route ${JSON.stringify(pl.route)} is not a content route`);
    if (!SLOT_IDS.includes(pl.slot))
      p(`placement slot ${JSON.stringify(pl.slot)} is not a SlotId`);
    if (!isPosInt(pl.order)) p("placement order must be a positive integer");
  }

  // A retired entry renders nowhere, so a caption that was legal while it was live stays legal.
  const everyAbout =
    e.status === "retired" ||
    (placements.length > 0 &&
      placements.every((pl) => isObj(pl) && pl.route === aboutRoute));
  for (const m of textProblems(e.alt, "alt", ctx)) p(m);
  if (e.caption !== null && e.caption !== undefined)
    for (const m of textProblems(e.caption, "caption", ctx, {
      firstNamesAllowed: everyAbout,
    }))
      p(m);
  if (e.altEn !== null && e.altEn !== undefined && typeof e.altEn !== "string")
    p("altEn must be a string or null");

  if (e.thumb !== null && e.thumb !== undefined) {
    if (!isObj(e.thumb) || typeof e.thumb.file !== "string" || !fileRe.test(e.thumb.file))
      p("thumb.file must be <group>/<slug>.<ext>");
    else if (!isPosInt(e.thumb.width) || !isPosInt(e.thumb.height))
      p("thumb.width/height must be positive integers");
    else if (Math.max(e.thumb.width, e.thumb.height) !== SIZE_CLASSES.thumb.longEdge)
      p(`thumb long edge must be ${SIZE_CLASSES.thumb.longEdge}`);
    if (
      isObj(e.thumb) &&
      isPosInt(e.thumb.bytes) &&
      e.thumb.bytes > SIZE_CLASSES.thumb.maxBytes
    )
      p(`thumb bytes exceed ${SIZE_CLASSES.thumb.maxBytes}`);
  }

  if (e.phone !== null && e.phone !== undefined) {
    const wantFile =
      typeof e.file === "string"
        ? e.file.replace(/\.(webp|jpe?g|png)$/, `-w${PHONE_COPY.width}.webp`)
        : null;
    if (!isObj(e.phone) || e.phone.file !== wantFile)
      p(`phone.file must be ${wantFile}: a phone copy belongs to its own entry`);
    else if (!isPosInt(e.phone.width) || !isPosInt(e.phone.height))
      p("phone.width/height must be positive integers");
    else {
      if (e.phone.width !== Math.min(PHONE_COPY.width, e.width))
        p(
          `phone.width must be ${PHONE_COPY.width} (or the file's own width, if smaller)`,
        );
      // Same shape as the full file: the <img> width and height reserve the box for both.
      if (Math.abs(e.phone.height - (e.phone.width * e.height) / e.width) > 1)
        p("phone copy must keep the shape of the full file");
    }
    if (
      isObj(e.phone) &&
      (!isPosInt(e.phone.bytes) || e.phone.bytes > PHONE_COPY.maxBytes)
    )
      p(`phone bytes must be a positive integer ≤ ${PHONE_COPY.maxBytes}`);
    if (
      isObj(e.phone) &&
      (typeof e.phone.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(e.phone.sha256))
    )
      p("phone.sha256 must be 64 lowercase hex chars");
    if (e.status === "candidate")
      p("a candidate has no phone copy; phone-copies.mjs runs after install");
  }

  if (!STATUSES.includes(e.status)) p(`status must be ${STATUSES.join("|")}`);
  // A revoked entry may still name a person who has since left the people list: the record of
  // whose likeness left the site must survive that person's removal.
  const revoked = e.revoked !== null && e.revoked !== undefined;
  if (
    !Array.isArray(e.people) ||
    (!revoked && e.people.some((x) => !PEOPLE_IDS.includes(x)))
  )
    p(`people must list only ${PEOPLE_IDS.join("|")}`);
  if (e.phase !== null && !PHASES.includes(e.phase))
    p(`phase must be null or ${PHASES.join("|")}`);
  if (e.service !== null && !ctx.serviceSlugs.includes(e.service))
    p(`service ${JSON.stringify(e.service)} is not a service slug`);
  if (e.city !== null && e.city !== undefined && !ctx.citySlugs.includes(e.city))
    p(`city ${JSON.stringify(e.city)} is not an area slug`);

  for (const m of provenanceProblems(e.provenance)) p(m);
  const kind = isObj(e.provenance) ? e.provenance.kind : undefined;

  if (e.watermark === null || e.watermark === undefined) {
    if (!legacy)
      p("watermark is required on every entry except the untouched legacy originals");
  } else if (
    !isObj(e.watermark) ||
    e.watermark.corner !== "bottom-right" ||
    !["white", "navy"].includes(e.watermark.logo) ||
    !(typeof e.watermark.widthPct === "number" && e.watermark.widthPct > 0)
  )
    p("watermark must be { logo: white|navy, corner: bottom-right, widthPct > 0 }");

  if (!isObj(e.review)) p("review must be an object with automated and owner");
  const automated = isObj(e.review) ? e.review.automated : undefined;
  const owner = isObj(e.review) ? e.review.owner : undefined;
  if (automated !== null && automated !== undefined) {
    if (
      !isObj(automated) ||
      !["pass", "pass-with-note", "regenerate", "reject"].includes(automated.verdict)
    )
      p("review.automated.verdict must be pass | pass-with-note | regenerate | reject");
  }
  if (owner !== null && owner !== undefined) {
    if (!isObj(owner) || !["approved", "rejected", "regenerate"].includes(owner.decision))
      p("review.owner.decision must be approved | rejected | regenerate");
  }

  if (e.status === "approved") {
    if (typeof e.approved !== "string" || !DATE_STAMP.test(e.approved))
      p('approved must read "YYYY-MM-DD — who" on an approved entry');
    if (!isObj(owner) || owner.decision !== "approved")
      p("an approved entry needs review.owner.decision === approved");
    if (
      kind === "ai-generated" &&
      !(isObj(automated) && ["pass", "pass-with-note"].includes(automated.verdict))
    )
      p("an approved rendering needs review.automated.verdict pass | pass-with-note");
  } else if (e.status !== "retired" && e.approved !== null && e.approved !== undefined)
    p("approved must be null unless status is approved or retired");
  if (e.status === "retired") {
    if (typeof e.retired !== "string" || !ISO_DATE.test(e.retired))
      p("retired must be an ISO date on a retired entry");
  } else if (e.retired !== null && e.retired !== undefined)
    p("retired must be null unless status is retired");
  if (revoked) {
    if (e.status !== "retired") p("revoked is set only on a retired entry");
    if (typeof e.revoked !== "string" || !ISO_DATE.test(e.revoked))
      p("revoked must be an ISO date (the day the written notice arrived)");
  }

  return out;
}

/**
 * Every problem in a manifest object, each prefixed `images[i] (<id>): `. Empty array = valid.
 * @param {unknown} raw
 * @param {RulesContext} ctx
 * @returns {string[]}
 */
export function manifestProblems(raw, ctx) {
  const out = [];
  const p = (m) => out.push(m);
  if (!isObj(raw)) return ["manifest is not an object"];
  if (raw.version !== 1) p(`version must be 1 (got ${JSON.stringify(raw.version)})`);
  if (typeof raw.site !== "string" || !raw.site) p("site must be a non-empty string");
  const gates = isObj(raw.gates) ? raw.gates : null;
  if (!gates) p("gates must be an object");
  else {
    for (const k of GATE_KEYS)
      if (!isNonNegInt(gates[k])) p(`gates.${k} must be a non-negative integer`);
    if (gates.pageBudgets !== undefined) {
      if (!isObj(gates.pageBudgets))
        p("gates.pageBudgets must be an object (route → bytes)");
      else
        for (const [route, bytes] of Object.entries(gates.pageBudgets))
          if (!ctx.contentRoutes.includes(route) || !isPosInt(bytes))
            p(
              `gates.pageBudgets[${JSON.stringify(route)}] must be a positive integer for a content route`,
            );
    }
  }
  if (!Array.isArray(raw.images)) {
    p("images must be an array");
    return out;
  }
  const maxImageBytes =
    gates && isPosInt(gates.maxImageBytes) ? gates.maxImageBytes : Infinity;
  const ids = new Map();
  const files = new Map();
  const slots = new Map();
  raw.images.forEach((e, i) => {
    const label = `images[${i}]${isObj(e) && typeof e.id === "string" ? ` (${e.id})` : ""}`;
    for (const m of entryProblems(e, ctx, { maxImageBytes })) p(`${label}: ${m}`);
    if (!isObj(e)) return;
    if (typeof e.id === "string") {
      if (ids.has(e.id)) p(`${label}: duplicate id (also images[${ids.get(e.id)}])`);
      ids.set(e.id, i);
    }
    for (const f of [
      e.file,
      isObj(e.thumb) ? e.thumb.file : null,
      isObj(e.phone) ? e.phone.file : null,
    ]) {
      if (typeof f !== "string") continue;
      if (files.has(f)) p(`${label}: duplicate file ${f} (also images[${files.get(f)}])`);
      files.set(f, i);
    }
    if (e.status === "approved" && Array.isArray(e.placements))
      for (const pl of e.placements) {
        if (!isObj(pl)) continue;
        const key = `${pl.route} ${pl.slot} ${pl.order}`;
        if (slots.has(key))
          p(
            `${label}: two approved entries occupy ${key} (also images[${slots.get(key)}])`,
          );
        slots.set(key, i);
      }
  });
  return out;
}
