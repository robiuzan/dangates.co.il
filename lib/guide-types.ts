/**
 * The `/מדריכים/` content model (ADR 0002, ADR 0003) — built from the `/new-guide` skill's
 * `templates/guide-types.ts`, which stays the authority for the shape.
 *
 * Types live apart from the registry so a guide module can import `Guide` without importing
 * `lib/guides.ts`, which imports every guide back.
 *
 * ── WRITE GUIDES AS `as const satisfies Guide`, NEVER `const g: Guide = {…}` ─────────────────
 * A type annotation widens `slug` to `string`, collapses `GuideSlug` to `string`, and silently turns
 * every total-`Record` adjacency check in `lib/guides.ts` into a no-op. `satisfies` validates the
 * shape while preserving the literal types — the same reason `services` and `locations` in
 * `lib/site-config.ts` are `as const`. Every array below is `readonly` because `as const` makes it so.
 *
 * Dates are `datePublished` and `dateModified` (ISO yyyy-mm-dd). `dateModified` is the guide's
 * sitemap `<lastmod>` and the `dateModified` of its `TechArticle` / `Article` node.
 */
import type { ServiceSlug, LocationSlug } from "@/lib/site-config";

/**
 * An in-copy link. `anchor` must appear VERBATIM in the paragraph's own `text` — the renderer splits
 * on the first occurrence, and `lib/guides.ts` throws when it is absent, so a typo cannot silently
 * drop the link. Descriptive Hebrew anchors only; never "כאן" (content-standards §3 item 6).
 * `href` is a site-relative path (a service, a location, `/מחירון/`, a post, another guide …) or an
 * external https URL that is also listed in the guide's `sources`.
 */
export interface InlineLink {
  anchor: string;
  href: string;
}

export type Block =
  /** `links` is what lets prose route: the 11 legacy posts lost 42 link phrases to plain text
   *  because their model could not express one (backlog §3.8). */
  | { kind: "paragraph"; text: string; links?: readonly InlineLink[] }
  /** 2 | 3 only. The page's single <h1> belongs to PageHeader; h4+ on a 1,200-word guide is
   *  structure nobody reads. The registry rejects an h3 before any h2. H2s are question-form. */
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "list"; ordered?: boolean; items: readonly string[] }
  /** The block that earns citations. `caption` is REQUIRED and visible: it names what the rows are
   *  and where they came from — an uncaptioned table is quoted without attribution or not at all.
   *  Every family carries one specific table shape (see /new-guide, "The family table"). */
  | {
      kind: "table";
      caption: string;
      head: readonly string[];
      rows: readonly (readonly string[])[];
    }
  /** The AEO unit (content-standards §5): a question-form heading plus a self-contained answer in
   *  the 40–60 word band of `scripts/audit/thresholds.json` → `answerBlock`. Exactly one per guide,
   *  within the first two blocks; `content-depth.mjs` measures the same thing on the export. */
  | { kind: "answer"; q: string; a: string }
  /** Rendered through components/marketing/Faq.tsx — native <details>, every answer in the DOM,
   *  which is what keeps the derived FAQPage legitimate (schema-graph §4). Each Q string is unique
   *  sitewide, including against the homepage, the service pages and the location pages. */
  | { kind: "faq"; items: readonly { q: string; a: string }[] }
  /** width/height are REQUIRED: `images.unoptimized` + static export means next/image cannot infer
   *  them, and omitting them is a guaranteed CLS regression. No photo exists yet (business-facts §F);
   *  when they arrive they ship through the kit's SiteImage pipeline (/site-images). */
  | {
      kind: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    }
  /** `warn` is the safety gate — the point past which a reader must stop and call. */
  | { kind: "callout"; tone: "note" | "warn"; text: string }
  /** `quote` = the video-or-photo-to-WhatsApp bridge; `inline` = the quieter end-of-section form.
   *  `service` builds the WhatsApp prefill. Cap: `familyCtaCap[family]` per guide, at most one
   *  `quote`, placed after an unresolved-variable block — never mid-answer (engagement-ux). */
  | { kind: "cta"; text: string; variant?: "inline" | "quote"; service?: ServiceSlug }
  /** Client island placed mid-guide. No component exists; the renderer emits nothing for it. */
  | { kind: "tool"; name: "diagnostic" };

/** The six page families `/new-guide <family> <slug>` builds. One family per guide, never two. */
export type Family =
  | "symptom"
  | "component"
  | "brand"
  | "comparison"
  | "safety"
  | "committee";

/** The five pillars of docs/content-calendar.md §1. Derived from `family`; authors never set it. */
export type Pillar = "faults" | "parts" | "choice" | "safety" | "committee";

export const familyPillar: Record<Family, Pillar> = {
  symptom: "faults",
  component: "parts",
  comparison: "choice",
  brand: "choice", // 🔶 a brand page is honest only for brands the business services (business-facts §C)
  safety: "safety",
  committee: "committee",
};

/** The order the hub groups guides in: the pillar table of `/content-hub`, not alphabetical. */
export const pillarOrder: readonly Pillar[] = [
  "faults",
  "parts",
  "choice",
  "safety",
  "committee",
];

export const pillarLabels: Record<Pillar, string> = {
  faults: "תקלות",
  parts: "רכיבים",
  choice: "בחירה",
  safety: "בטיחות ותקנים",
  committee: "ועד בית",
};

/** schema-graph §6: TechArticle for the safety and component families, Article otherwise. One
 *  place to change if that mapping is ever revised. */
export const schemaTypeFor: Record<Family, "TechArticle" | "Article"> = {
  safety: "TechArticle",
  component: "TechArticle",
  symptom: "Article",
  comparison: "Article",
  brand: "Article",
  committee: "Article",
};

/** The `/new-guide` family table, "CTA" column: the most CTA blocks a guide of the family may carry.
 *  `lib/guides.ts` throws above it. */
export const familyCtaCap: Record<Family, number> = {
  symptom: 2,
  component: 1,
  comparison: 1,
  safety: 1,
  committee: 1,
  brand: 1,
};

export interface Guide {
  /** Hebrew slug — the route segment under /מדריכים/. Never renamed once published without a 301
   *  (public/_redirects, ADR 0004). Never equal to a service slug. */
  slug: string;
  /** The question or symptom, verbatim. Becomes the <h1> and the BARE <title> — app/layout.tsx
   *  appends "| דן שערים חשמליים" via the template (keyword-map §3). Never a service `name`, never
   *  `{service} ב{city}` — both throw in lib/guides.ts. */
  title: string;
  /** Shorter breadcrumb label when the title is a long question. Falls back to `title`. */
  crumbLabel?: string;
  /** 120–160 chars with terminal punctuation (`titles.mjs`). */
  description: string;
  family: Family;
  /** ISO yyyy-mm-dd. The day it actually published — never backdated to look established. */
  datePublished: string;
  /** ISO yyyy-mm-dd. Equal to datePublished until the content is genuinely revised; bumping it is
   *  the freshness signal (content-calendar §5 "refresh beats republish"). It is the sitemap
   *  `<lastmod>` too, so never bump it for styling or metadata work. */
  dateModified: string;
  /** Key into lib/authors.ts — a registry that ships EMPTY. No person is coming (business-facts §B),
   *  so omit it; the Article node then carries no `author` person and the publisher is the
   *  Organization. */
  authorId?: string;
  heroImage?: { src: string; alt: string; width: number; height: number };
  blocks: readonly Block[];
  /** ≥ 1, validated against `services` at module load. Drives `guidesForService()` — the reverse
   *  index that renders this guide on those service pages, which is what makes an orphan impossible. */
  relatedServices: readonly ServiceSlug[];
  /** Only when the copy genuinely names a city — and then with the entry's `prefixed` value
   *  ("בצפון הארץ", never a bare "בצפון"). A declared location needs an in-copy link to its page,
   *  and an in-copy link to a location page needs the declaration. Names no coverage claim. */
  relatedLocations?: readonly LocationSlug[];
  /** The evidenced query this guide targets (keyword-map §2/§8/§13 phrasing, verbatim). The registry
   *  throws when two guides declare the same one — one Tier-3 query, one guide. */
  targetQuery: string;
  /** External sources the copy cites — required on the `safety` family (the registry throws without
   *  one) and rendered as a "מקורות" list; each entry must be a real page a claims-verifier can open
   *  (sii.org.il, gov.il, nevo). Never a competitor blog as the only source for a legal or safety fact.
   *  An external `InlineLink.href` must also appear here. */
  sources?: readonly { label: string; url: string }[];
}

/**
 * What the homepage FAQ gains in Phase 4 (content-hub, "The homepage-FAQ contract"): each entry in
 * `faqs` (lib/content.ts) may carry a `moreAt` pointing at the guide, kept post or `/מחירון/` that
 * owns the long answer. It renders outside the `a` string so faqJsonLd stays clean; lib/guides.ts
 * throws when a `/מדריכים/…` href resolves to no registered guide.
 */
export interface MoreAt {
  href: string;
  label: string;
}

/**
 * Stable in-page anchor for a heading: strip punctuation, collapse whitespace to hyphens. Kept here
 * (not in the registry) so a renderer can compute an id without importing every guide.
 */
export function headingId(text: string): string {
  return text
    .replace(/[?׳״"'.,:;!()[\]]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
