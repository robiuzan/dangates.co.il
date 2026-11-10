/**
 * The knowledge-hub registry (ADR 0002, ADR 0003) — and the place the content rules stop being
 * guidelines. Retargeted from galbath.co.il `lib/articles.ts`.
 *
 * Every check below runs at MODULE LOAD, so `npm run build` fails rather than shipping a thin,
 * mis-structured or cannibalising guide. A checklist in a doc gets skipped under deadline; a throw
 * does not. It is the same reasoning as the total `Record`s in lib/site-config.ts and
 * lib/service-depth.ts.
 *
 * ── Adding a guide (the `/new-guide` procedure, step 8) ──────────────────────────────────────
 *   1. Fill `content/guides/<slug>.ts` (`export const guide = {…} as const satisfies Guide`).
 *   2. Import it below and append it to `guides`.
 *   3. Place it on `relatedGuides` — a total `Record<GuideSlug, …>`, so omitting it fails typecheck.
 *   The hub, the sitemap, `generateStaticParams`, `llms.txt`, the nav entry and the reverse index on
 *   the service and location pages all read this array, so there is nothing else to wire.
 */
import {
  locations,
  services,
  staticPages,
  type LocationSlug,
  type ServiceSlug,
} from "@/lib/site-config";
import {
  faqs,
  locationHeroTitle,
  locationPageTitle,
  pricingPageCopy,
} from "@/lib/content";
import { posts } from "@/lib/posts";
import { serviceDepth } from "@/lib/service-depth";
import { cityContent } from "@/lib/city-content";
import { pageContent } from "@/lib/page-content";
import { NON_DESCRIPTIVE_ANCHORS, type InlineLink } from "@/lib/inline-links";
import {
  familyCtaCap,
  familyPillar,
  headingId,
  pillarOrder,
  type Block,
  type Guide,
  type Pillar,
} from "@/lib/guide-types";

import { guide as standard900 } from "@/content/guides/תקן-900-שער-חשמלי";
import { guide as noisyGate } from "@/content/guides/שער-חשמלי-רועש";
import { guide as parkingBarrier } from "@/content/guides/מחסום-חניה-ועד-בית";
import { guide as gateTypes } from "@/content/guides/שער-נגרר-כנף-או-קונזולי";
import { guide as notClosing } from "@/content/guides/שער-חשמלי-לא-נסגר";

/** The registry, in authoring order. Tuple of `as const` literals. */
export const guides = [
  standard900,
  noisyGate,
  parkingBarrier,
  gateTypes,
  notClosing,
] as const;

export type GuideSlug = (typeof guides)[number]["slug"];

/**
 * Widened to `Guide` on purpose. `guides` is a tuple of `as const` literals, so iterating it
 * directly gives TS the exact literal shape of each one, and it then reports every validator as an
 * impossible comparison and every optional field as missing on the members that omit it. The
 * literal types are what `GuideSlug` and the total Records need; the validators need the interface.
 */
const allGuides: readonly Guide[] = guides;

/** Newest first — the hub grid and the sitemap read this order; ties break on slug. */
export const guideList: readonly Guide[] = [...allGuides].sort(
  (a, b) =>
    b.datePublished.localeCompare(a.datePublished) || a.slug.localeCompare(b.slug),
);

export const guideBySlug = new Map<string, Guide>(
  allGuides.map((g) => [g.slug.normalize("NFC"), g]),
);

/** Whether the hub has anything to show. The nav and footer entries render only while this is true. */
export const hasGuides: boolean = guideList.length > 0;

/** Site-relative path of a guide, trailing slash (`pageUrl()` / `encodeURI` do the escaping). */
export function guidePath(slug: string): string {
  return `/מדריכים/${slug}/`;
}

/**
 * Match a route param against a slug, tolerant of URL-encoding + Unicode normalization (Hebrew
 * dynamic segments arrive percent-encoded during static export — a route that skips this works in
 * dev and 404s in production).
 */
export function findGuide(param: string): Guide | undefined {
  return guideBySlug.get(decodeURIComponent(param).normalize("NFC"));
}

/**
 * Curated adjacency, not "the newest three". A total Record, so adding a guide without placing it
 * on the map is a compile error — the same guard that stopped `.slice(0, 4)` from letting the
 * first posts hoard internal link equity (backlog §9.4).
 */
export const relatedGuides: Record<GuideSlug, readonly GuideSlug[]> = {
  "תקן-900-שער-חשמלי": [
    "שער-חשמלי-רועש",
    "שער-חשמלי-לא-נסגר",
    "מחסום-חניה-ועד-בית",
    "שער-נגרר-כנף-או-קונזולי",
  ],
  "שער-חשמלי-רועש": ["שער-חשמלי-לא-נסגר", "תקן-900-שער-חשמלי", "שער-נגרר-כנף-או-קונזולי"],
  "מחסום-חניה-ועד-בית": ["תקן-900-שער-חשמלי", "שער-נגרר-כנף-או-קונזולי"],
  "שער-נגרר-כנף-או-קונזולי": [
    "שער-חשמלי-רועש",
    "שער-חשמלי-לא-נסגר",
    "מחסום-חניה-ועד-בית",
    "תקן-900-שער-חשמלי",
  ],
  "שער-חשמלי-לא-נסגר": ["שער-חשמלי-רועש", "תקן-900-שער-חשמלי", "שער-נגרר-כנף-או-קונזולי"],
};

/** The guides `relatedGuides` places beside `guide`, resolved and in declared order. */
export function relatedGuidesOf(guide: Guide): Guide[] {
  const slugs: readonly string[] =
    (relatedGuides as Readonly<Record<string, readonly string[]>>)[guide.slug] ?? [];
  return slugs.flatMap((s) => guideBySlug.get(s.normalize("NFC")) ?? []);
}

// ── Reverse indexes ──────────────────────────────────────────────────────────────────────────
// These are what make an orphaned guide structurally impossible: a guide that declares a service
// appears on that service's page without anyone editing the page. Empty registry → empty lists, so
// the service and location routes render nothing.

export function guidesForService(slug: ServiceSlug): Guide[] {
  return guideList.filter((g) => g.relatedServices.includes(slug));
}

export function guidesForLocation(slug: LocationSlug): Guide[] {
  return guideList.filter((g) => g.relatedLocations?.includes(slug) ?? false);
}

/**
 * The guides a location page lists: the ones its own `cityContent[slug].guides` picks, resolved and
 * in declared order, then the reverse index (`guidesForLocation`), de-duplicated by slug.
 */
export function guidesForLocationPage(slug: LocationSlug): Guide[] {
  const picked: readonly string[] = cityContent[slug].guides ?? [];
  const chosen = picked.flatMap((s) => guideBySlug.get(s.normalize("NFC")) ?? []);
  const seen = new Set<string>();
  return [...chosen, ...guidesForLocation(slug)].filter((g) => {
    if (seen.has(g.slug)) return false;
    seen.add(g.slug);
    return true;
  });
}

/** The hub grid: guides grouped by pillar in the `/content-hub` order; empty pillars are omitted. */
export function guidesByPillar(): { pillar: Pillar; guides: Guide[] }[] {
  return pillarOrder.flatMap((pillar) => {
    const inPillar = guideList.filter((g) => familyPillar[g.family] === pillar);
    return inPillar.length > 0 ? [{ pillar, guides: inPillar }] : [];
  });
}

// ── Derived helpers ──────────────────────────────────────────────────────────────────────────

/** Text-bearing blocks only. Table cells and headings count; alt text and captions do not. */
function blockWords(b: Block): string[] {
  const text = (() => {
    switch (b.kind) {
      case "paragraph":
      case "callout":
      case "cta":
      case "heading":
        return b.text;
      case "list":
        return b.items.join(" ");
      case "table":
        return [...b.head, ...b.rows.flat()].join(" ");
      case "answer":
        return `${b.q} ${b.a}`;
      case "faq":
        return b.items.map((i) => `${i.q} ${i.a}`).join(" ");
      default:
        return "";
    }
  })();
  return text.split(/\s+/).filter(Boolean);
}

export function wordCount(g: Guide): number {
  return g.blocks.reduce((n, b) => n + blockWords(b).length, 0);
}

/** ~200 wpm is the usual Hebrew prose estimate. Stated here so the number is not a mystery. */
export function readingMinutes(g: Guide): number {
  return Math.max(1, Math.round(wordCount(g) / 200));
}

/** Every heading the page renders, in order (the answer block's question is an H2 too). */
export function guideHeadings(g: Guide): { level: 2 | 3; text: string; id: string }[] {
  return g.blocks.flatMap((b) => {
    if (b.kind === "heading")
      return [{ level: b.level, text: b.text, id: headingId(b.text) }];
    if (b.kind === "answer")
      return [{ level: 2 as const, text: b.q, id: headingId(b.q) }];
    return [];
  });
}

// ── Validators (run at module load) ──────────────────────────────────────────────────────────

const WORD_FLOOR = 900; // docs/content-standards.md §1
const ANSWER_MIN = 30; // §5 targets 40–60; Hebrew is denser, so tolerate a band
const ANSWER_MAX = 80;
const MIN_FAQ_ITEMS = 3;
const MIN_IN_COPY_LINKS = 2;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(slug: string, msg: string): never {
  throw new Error(`[guides] ${slug}: ${msg}`);
}

/** Text as compared for uniqueness and cannibalisation: NFC, no question mark, one space. */
function norm(s: string): string {
  return s.normalize("NFC").replace(/[?؟]/g, "").replace(/\s+/g, " ").trim();
}

const serviceSlugs = new Set<string>(services.map((s) => s.slug.normalize("NFC")));
const locationSlugs = new Set<string>(locations.map((l) => l.slug.normalize("NFC")));
const postSlugs = new Set<string>(posts.map((p) => p.slug.normalize("NFC")));

/** Pages whose own text a guide may not repeat as its title or an H2: the silos' phrase space. */
const reservedExact = new Set<string>(
  [
    ...services.map((s) => s.name),
    ...services.flatMap((s) =>
      locations.flatMap((l) => [`${s.name} ${l.prefixed}`, `${s.name} ב${l.name}`]),
    ),
    ...locations.flatMap((l) => [
      locationHeroTitle(l.prefixed),
      locationPageTitle(l.prefixed),
    ]),
    pricingPageCopy.h1,
    pricingPageCopy.metaTitle,
    ...posts.map((p) => p.title),
  ].map(norm),
);

/** `{service} ב{city}` anywhere in a title or heading is the location pages' query. */
const reservedFragments: string[] = services
  .flatMap((s) =>
    locations.flatMap((l) => [`${s.name} ${l.prefixed}`, `${s.name} ב${l.name}`]),
  )
  .map(norm);

/** Homepage, service and city questions: a guide may repeat none of them (schema-graph §4). */
const questionOwners = new Map<string, string>();
for (const f of faqs) questionOwners.set(norm(f.q), "the homepage FAQ in lib/content.ts");
for (const s of services) {
  for (const { q } of serviceDepth[s.slug].faqs) {
    questionOwners.set(norm(q), `serviceDepth["${s.slug}"]`);
  }
}
for (const l of locations) {
  for (const { q } of cityContent[l.slug].faqs) {
    questionOwners.set(norm(q), `cityContent["${l.slug}"]`);
  }
}

const seenSlugs = new Set<string>();
const seenTargetQueries = new Map<string, string>(); // query → owning slug
const seenH2 = new Map<string, string>(); // heading → owning slug
const staticPaths = new Set<string>(
  staticPages.filter((p) => !p.noindex).map((p) => (p.path === "" ? "/" : `/${p.path}`)),
);

/** Where an internal href lands, as a comparable path: no hash, no query, no trailing slash. */
function bare(href: string): string {
  const noHash = href.split("#")[0] ?? href;
  const noQuery = noHash.split("?")[0] ?? noHash;
  const decoded = decodeURIComponent(noQuery).normalize("NFC");
  return decoded.length > 1 ? decoded.replace(/\/$/, "") : decoded;
}

function validateGuide(g: Guide): void {
  const slug = g.slug.normalize("NFC");
  if (slug !== g.slug) fail(g.slug, "slug is not NFC-normalised");
  if (seenSlugs.has(slug)) fail(g.slug, "duplicate slug in the registry");
  seenSlugs.add(slug);
  if (serviceSlugs.has(slug)) fail(g.slug, "slug equals a service slug");
  if (g.title.trim() === "") fail(g.slug, "empty title — is this still a stub?");

  // Dates
  if (!ISO_DATE.test(g.datePublished))
    fail(g.slug, "datePublished must be ISO yyyy-mm-dd");
  if (!ISO_DATE.test(g.dateModified)) fail(g.slug, "dateModified must be ISO yyyy-mm-dd");
  if (g.dateModified < g.datePublished)
    fail(g.slug, "dateModified is before datePublished");

  // Related slugs must be real
  if (g.relatedServices.length === 0) {
    fail(
      g.slug,
      "needs at least one relatedService — that is what puts it on a service page",
    );
  }
  const seenRel = new Set<string>();
  for (const s of g.relatedServices) {
    if (!serviceSlugs.has(s))
      fail(g.slug, `relatedServices references unknown service "${s}"`);
    if (seenRel.has(s)) fail(g.slug, `relatedServices lists "${s}" twice`);
    seenRel.add(s);
  }
  for (const l of g.relatedLocations ?? []) {
    if (!locationSlugs.has(l))
      fail(g.slug, `relatedLocations references unknown location "${l}"`);
  }

  // Family-specific
  const sources = g.sources ?? [];
  if (g.family === "safety" && sources.length === 0) {
    fail(
      g.slug,
      "a safety guide needs `sources` — every external fact cites sii.org.il / gov.il",
    );
  }
  for (const src of sources) {
    if (!/^https:\/\//.test(src.url))
      fail(g.slug, `source "${src.label}" is not an https URL`);
  }

  // Depth
  const words = wordCount(g);
  if (words < WORD_FLOOR) {
    fail(
      g.slug,
      `${words} words, below the ${WORD_FLOOR} floor (docs/content-standards.md §1)`,
    );
  }

  // Answer block: exactly one, in the first two blocks, within the word band
  const answerAt = g.blocks.flatMap((b, i) => (b.kind === "answer" ? [i] : []));
  if (answerAt.length !== 1) {
    fail(g.slug, `expected exactly one answer block, found ${answerAt.length}`);
  }
  const answerIndex = answerAt[0] ?? -1;
  if (answerIndex > 1)
    fail(g.slug, "the answer block must be within the first two blocks");
  const answerBlock = g.blocks[answerIndex];
  if (answerBlock?.kind === "answer") {
    const n = answerBlock.a.split(/\s+/).filter(Boolean).length;
    if (n < ANSWER_MIN || n > ANSWER_MAX) {
      fail(
        g.slug,
        `answer is ${n} words; must be ${ANSWER_MIN}–${ANSWER_MAX} (§5 targets 40–60)`,
      );
    }
  }

  // Heading order and uniqueness. `answer` and `faq` emit their own H2, so they open a section.
  let sawH2 = false;
  const ids = new Set<string>();
  for (const b of g.blocks) {
    if (b.kind === "answer" || b.kind === "faq") sawH2 = true;
    if (b.kind !== "heading" && b.kind !== "answer") continue;
    const text = b.kind === "answer" ? b.q : b.text;
    if (b.kind === "heading" && b.level === 2) sawH2 = true;
    if (b.kind === "heading" && b.level === 3 && !sawH2) {
      fail(g.slug, `h3 "${b.text}" appears before any h2`);
    }
    const id = headingId(text);
    if (ids.has(id)) fail(g.slug, `two headings share the anchor id "${id}"`);
    ids.add(id);
    // Every H2 is unique across the hub (the doorway test applies inside it).
    if (b.kind === "answer" || b.level === 2) {
      const key = norm(text);
      const owner = seenH2.get(key);
      if (owner !== undefined) fail(g.slug, `H2 "${text}" is already used by "${owner}"`);
      seenH2.set(key, g.slug);
    }
  }

  // A citable table
  const tables = g.blocks.flatMap((b) => (b.kind === "table" ? [b] : []));
  if (tables.length === 0) {
    fail(g.slug, "needs at least one table — it is what makes the guide citable");
  }
  for (const t of tables) {
    if (t.caption.trim() === "") fail(g.slug, "a table needs a visible caption");
    if (t.head.length === 0 || t.rows.length === 0)
      fail(g.slug, "a table needs a head and rows");
    for (const row of t.rows) {
      if (row.length !== t.head.length) {
        fail(
          g.slug,
          `a table row has ${row.length} cells but the head has ${t.head.length}`,
        );
      }
    }
  }

  // FAQ and answer questions — the SAME uniqueness problem: the answer block is a visible Q/A, and
  // a question that the homepage, a service page, a city page or another guide already owns would
  // ship two answers to one question on one domain.
  const ownQuestions = new Set<string>();
  for (const b of g.blocks) {
    const items =
      b.kind === "faq" ? b.items : b.kind === "answer" ? [{ q: b.q, a: b.a }] : null;
    if (!items) continue;
    if (b.kind === "faq" && items.length < MIN_FAQ_ITEMS) {
      fail(g.slug, `a faq block needs at least ${MIN_FAQ_ITEMS} questions`);
    }
    for (const item of items) {
      const key = norm(item.q);
      const owner = questionOwners.get(key);
      if (owner !== undefined) {
        fail(g.slug, `${b.kind} question "${item.q}" is already used by ${owner}`);
      }
      if (ownQuestions.has(key))
        fail(g.slug, `question "${item.q}" appears twice in the guide`);
      ownQuestions.add(key);
    }
  }
  for (const key of ownQuestions) questionOwners.set(key, `the guide "${g.slug}"`);

  // CTA discipline (engagement-ux): the family cap, one quote, a real service
  const ctas = g.blocks.flatMap((b) => (b.kind === "cta" ? [b] : []));
  const cap = familyCtaCap[g.family];
  if (ctas.length > cap)
    fail(g.slug, `${ctas.length} CTA blocks; the cap for ${g.family} is ${cap}`);
  if (ctas.filter((c) => c.variant === "quote").length > 1) {
    fail(g.slug, "at most one quote-variant CTA per guide");
  }
  if (g.blocks.filter((b) => b.kind === "tool").length > 1) {
    fail(g.slug, "at most one tool block per guide");
  }
  for (const c of ctas) {
    if (c.service && !serviceSlugs.has(c.service)) {
      fail(g.slug, `cta references unknown service "${c.service}"`);
    }
  }
  for (const b of g.blocks) {
    if (b.kind === "image" && b.alt.trim() === "")
      fail(g.slug, "an image needs a Hebrew alt");
  }

  // In-copy links (content-standards §3 item 6)
  let inCopy = 0;
  let toService = 0;
  const linkedLocations = new Set<string>();
  const sourceUrls = new Set(sources.map((s) => s.url));
  for (const b of g.blocks) {
    if (b.kind !== "paragraph" || !b.links) continue;
    for (const l of b.links) {
      inCopy++;
      if (!b.text.includes(l.anchor)) {
        fail(
          g.slug,
          `in-copy link anchor "${l.anchor}" does not appear in its paragraph`,
        );
      }
      if (NON_DESCRIPTIVE_ANCHORS.has(l.anchor.trim())) {
        fail(g.slug, `in-copy link anchor "${l.anchor}" is not descriptive`);
      }
      if (/^https?:\/\//.test(l.href)) {
        if (!sourceUrls.has(l.href)) {
          fail(g.slug, `external link "${l.href}" is not listed in \`sources\``);
        }
        continue;
      }
      const path = bare(l.href);
      const service = path.startsWith("/services/")
        ? path.slice("/services/".length)
        : "";
      const location = path.startsWith("/locations/")
        ? path.slice("/locations/".length)
        : "";
      const post = path.startsWith("/blog/") ? path.slice("/blog/".length) : "";
      const guideSlug = path.startsWith("/מדריכים/")
        ? path.slice("/מדריכים/".length)
        : "";
      if (service !== "" && serviceSlugs.has(service)) toService++;
      else if (location !== "" && locationSlugs.has(location)) {
        linkedLocations.add(location);
      } else if (post !== "" && postSlugs.has(post)) {
        // a kept post
      } else if (guideSlug !== "" && guideSlug !== slug) {
        // another guide: resolved against the whole registry once every guide is loaded (below)
      } else if (!staticPaths.has(path)) {
        fail(g.slug, `in-copy link points nowhere: "${l.href}"`);
      }
    }
  }
  if (inCopy < MIN_IN_COPY_LINKS) {
    fail(
      g.slug,
      `${inCopy} in-copy links; needs at least ${MIN_IN_COPY_LINKS} (content-standards §3 item 6)`,
    );
  }
  if (toService < 1) {
    fail(
      g.slug,
      "no in-copy link to a service page — the guide has to hand the transaction somewhere",
    );
  }
  // A city is named in copy only when the guide declares it, and a declared city is linked.
  const declared = new Set<string>(g.relatedLocations ?? []);
  for (const l of declared) {
    if (!linkedLocations.has(l)) {
      fail(
        g.slug,
        `declares relatedLocations "${l}" but links none of them in copy — name the city or drop it`,
      );
    }
  }
  for (const l of linkedLocations) {
    if (!declared.has(l))
      fail(
        g.slug,
        `links the "${l}" page in copy but does not declare it in relatedLocations`,
      );
  }

  // One Tier-3 query, one guide
  const queryKey = norm(g.targetQuery);
  if (queryKey === "") fail(g.slug, "targetQuery is empty");
  const queryOwner = seenTargetQueries.get(queryKey);
  if (queryOwner !== undefined) {
    fail(
      g.slug,
      `targetQuery "${g.targetQuery}" is already the target of "${queryOwner}"`,
    );
  }
  seenTargetQueries.set(queryKey, g.slug);

  // Cannibalisation: never target a phrase the silos own
  const candidates = [
    g.title,
    g.targetQuery,
    ...g.blocks.flatMap((b) =>
      b.kind === "heading" && b.level === 2 ? [b.text] : b.kind === "answer" ? [b.q] : [],
    ),
  ];
  for (const phrase of candidates) {
    const key = norm(phrase);
    if (reservedExact.has(key)) {
      fail(
        g.slug,
        `"${phrase}" is a service, location, pricing or post title — that phrase space is taken`,
      );
    }
    if (reservedFragments.some((f) => key.includes(f))) {
      fail(
        g.slug,
        `"${phrase}" contains a "{service} ב{city}" phrase — that query belongs to the location pages`,
      );
    }
  }
  for (const phrase of [g.title, g.targetQuery]) {
    if (norm(phrase).includes("כמה עולה")) {
      fail(
        g.slug,
        `"${phrase}" is a price query — it belongs to /מחירון/, never to a guide`,
      );
    }
  }
}

/**
 * Validate every guide and report ALL failures in one throw. `fail()` throws so it can keep its
 * `never` return type; catching per guide gives the same guarantee (a bad guide still stops the
 * build) without the cost of one build per violation.
 */
const violations: string[] = [];
for (const g of allGuides) {
  try {
    validateGuide(g);
  } catch (err) {
    violations.push(err instanceof Error ? err.message : String(err));
  }
}
if (violations.length > 0) {
  throw new Error(
    `${violations.length} guide violation(s):\n  ${violations.join("\n  ")}\n`,
  );
}

// Links from one guide to another resolve once the whole registry is loaded.
for (const g of allGuides) {
  for (const b of g.blocks) {
    if (b.kind !== "paragraph") continue;
    for (const l of b.links ?? []) {
      const path = /^https?:\/\//.test(l.href) ? "" : bare(l.href);
      if (!path.startsWith("/מדריכים/")) continue;
      const target = path.slice("/מדריכים/".length);
      if (target !== "" && !seenSlugs.has(target)) {
        throw new Error(
          `[guides] ${g.slug}: in-copy link points at an unregistered guide "${l.href}"`,
        );
      }
    }
  }
}

// The prose models of the silos and indexes may link to a guide; lib/inline-links.ts left those
// hrefs to this registry, so every one must resolve to a registered guide.
function assertGuideLinks(owner: string, links: readonly InlineLink[] | undefined): void {
  for (const { href } of links ?? []) {
    const path = bare(href);
    if (!path.startsWith("/מדריכים/")) continue;
    const target = path.slice("/מדריכים/".length);
    if (target === "" || !seenSlugs.has(target)) {
      throw new Error(`[guides] ${owner} links to an unregistered guide "${href}"`);
    }
  }
}
for (const s of services) {
  const depth = serviceDepth[s.slug];
  const owner = `serviceDepth["${s.slug}"]`;
  for (const section of depth.sections) assertGuideLinks(owner, section.links);
  if (depth.upfront) {
    for (const section of [depth.upfront.cost, depth.upfront.check, depth.upfront.ask]) {
      assertGuideLinks(`${owner}.upfront`, section.links);
    }
  }
}
for (const l of locations) {
  const city = cityContent[l.slug];
  const owner = `cityContent["${l.slug}"]`;
  for (const note of city.localNotes) assertGuideLinks(owner, note.links);
  if (city.glance) {
    for (const part of [city.glance.cost, city.glance.process, city.glance.check]) {
      assertGuideLinks(`${owner}.glance`, part.links);
    }
  }
}
for (const [name, content] of Object.entries(pageContent)) {
  for (const section of content.sections)
    assertGuideLinks(`pageContent.${name}`, section.links);
}

// The homepage FAQ's link-outs must point at guides that actually exist. `lib/content.ts` cannot
// import this module (this one reads `faqs`), so the hrefs there are plain strings; this keeps them
// honest. Link-outs to the blog, a service or /מחירון/ are checked by links.mjs on the export.
for (const f of faqs) {
  const href = f.moreAt?.href;
  if (href === undefined) continue;
  const path = bare(href);
  if (!path.startsWith("/מדריכים/")) continue;
  const target = path.slice("/מדריכים/".length);
  if (!seenSlugs.has(target)) {
    throw new Error(
      `[guides] homepage FAQ links to a guide that is not registered: "${href}"`,
    );
  }
}

// relatedGuides must reference real slugs, never itself, never twice (the Record's keys are already
// compiler-checked).
for (const [from, tos] of Object.entries(
  relatedGuides as Readonly<Record<string, readonly string[]>>,
)) {
  const once = new Set<string>();
  for (const to of tos) {
    if (!seenSlugs.has(to))
      throw new Error(`[guides] ${from}: unknown relatedGuide "${to}"`);
    if (to === from) throw new Error(`[guides] ${from}: relatedGuides includes itself`);
    if (once.has(to))
      throw new Error(`[guides] ${from}: relatedGuides lists "${to}" twice`);
    once.add(to);
  }
}
