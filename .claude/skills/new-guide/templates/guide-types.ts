/**
 * The `/מדריכים/` content model — TEMPLATE for `lib/guide-types.ts` (Phase 4, ADR 0003).
 *
 * As of 2026-08-23 this file exists only here. `lib/guide-types.ts`, `lib/guides.ts`,
 * `components/article/*` and `app/מדריכים/**` are built by `/improve` in Phase 4 from this type
 * and from galbath.co.il's `lib/article-types.ts` / `lib/articles.ts`. Until then the only editorial
 * model in the repo is `PostBlock = { type: "h" | "p" | "li"; text }` (`lib/posts.ts:9`), which
 * cannot carry a heading level, an in-copy link, a table, an answer block or a FAQ.
 *
 * Types live apart from the registry so a guide module can import `Guide` without importing
 * `lib/guides.ts`, which imports every guide back.
 *
 * ── WRITE GUIDES AS `as const satisfies Guide`, NEVER `const g: Guide = {…}` ─────────────────
 * A type annotation widens `slug` to `string`, collapses `GuideSlug` to `string`, and silently turns
 * every total-`Record` adjacency check in `lib/guides.ts` into a no-op. `satisfies` validates the
 * shape while preserving the literal types — the same reason `services` and `locations` in
 * `lib/site-config.ts` are `as const`. Every array below is `readonly` because `as const` makes it so.
 */
import type { ServiceSlug, LocationSlug } from "@/lib/site-config";

/**
 * An in-copy link. `anchor` must appear VERBATIM in the paragraph's own `text` — the renderer splits
 * on the first occurrence, and `lib/guides.ts` throws when it is absent, so a typo cannot silently
 * drop the link. Descriptive Hebrew anchors only; never "כאן" (content-standards §3 item 6).
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
  /** Rendered through components/marketing/Faq.tsx, whose panels stay in the DOM behind the `hidden`
   *  attribute (`Faq.tsx:47`) — that is what keeps the derived FAQPage legitimate (schema-graph §4).
   *  Each Q string is unique sitewide, including against the homepage `faqs` (lib/content.ts:170). */
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
   *  `service` builds the WhatsApp prefill and the `data-cta` name. Cap: 2 per guide, at most one
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
   *  the freshness signal (content-calendar §5 "refresh beats republish"). */
  dateModified: string;
  /** Key into lib/authors.ts — a registry that ships EMPTY. No person is coming (business-facts §B),
   *  so omit it; the Article node then carries no `author` and the publisher is the Organization. */
  authorId?: string;
  heroImage?: { src: string; alt: string; width: number; height: number };
  blocks: readonly Block[];
  /** ≥ 1, validated against `services` at module load. Drives `guidesForService()` — the reverse
   *  index that renders this guide on those service pages, which is what makes an orphan impossible. */
  relatedServices: readonly ServiceSlug[];
  /** Only when the copy genuinely names a city — and then with `loc.prefixed` (a Phase 3 field; until
   *  it exists, name no region: "בצפון" is wrong Hebrew, "בצפון הארץ" is right). */
  relatedLocations?: readonly LocationSlug[];
  /** The evidenced query this guide targets (keyword-map §2/§8/§13 phrasing, verbatim). The registry
   *  throws when two guides declare the same one — one Tier-3 query, one guide. */
  targetQuery: string;
  /** External sources the copy cites — required on the `safety` family (the registry throws without
   *  one) and rendered as a "מקורות" list; each entry must be a real page a claims-verifier can open
   *  (sii.org.il, gov.il, nevo). Never a competitor blog as the only source for a legal or safety fact. */
  sources?: readonly { label: string; url: string }[];
}

/**
 * What the homepage FAQ gains in Phase 4 (content-hub, "The homepage-FAQ contract"): each of the
 * 10 entries in `faqs` (lib/content.ts:170) may carry a `moreAt` pointing at the guide, kept post or
 * `/מחירון/` that owns the long answer. It renders outside the `a` string so faqJsonLd stays clean;
 * lib/guides.ts throws when the href resolves to nothing.
 */
export interface MoreAt {
  href: string;
  label: string;
}
