/**
 * lib/jsonld.ts — RECIPE for the Phase-2 site-local JSON-LD builders (backlog §4.2 §4.4–§4.9 §4.12,
 * docs/schema-graph.md §8). The file does not exist yet; copy this to `lib/jsonld.ts` when Phase 2
 * starts and delete this header.
 *
 * Contract — the same as the kit's (`Israeli services sites/packages/site-kit/src/seo/index.ts`):
 *   - pure `(m: SiteManifest, …) => JsonLd`; no React, no `next` imports
 *   - site-local nodes carry NO `@context`; every page renders exactly ONE script through `graph()`:
 *       <script type="application/ld+json"
 *               dangerouslySetInnerHTML={{ __html: jsonLdScript(graph(...nodes)) }} />
 *   - every url / @id goes through `pageUrl()` — trailing slash + encodeURI — so it is byte-identical
 *     to the page's canonical and the sitemap <loc>. The kit's `abs()` does NOT encode, and
 *     `serviceJsonLd` defaults `url` to raw Hebrew; `scripts/audit/schema.mjs` fails on any non-ASCII
 *     URL value (schema-graph §1).
 *
 * Nothing here may be promoted into the vendored kit from this repo (golden rule 9) — a kit change is
 * a fleet mutation done from the packages/site-kit source, as one deliberate promotion.
 */
import { ogImageMeta, type SiteManifest } from "@ishub/site-kit";
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  serviceJsonLd,
  type JsonLd,
} from "@ishub/site-kit/seo";
import { locations, services } from "@/lib/site-config";

export type { JsonLd };

// ── helpers ──────────────────────────────────────────────────────────────────

/** Drop null / undefined / "" / [] — the kit's prune(), copied because the kit does not export it. */
function prune<T extends Record<string, unknown>>(obj: T): T {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (
      v === null ||
      v === undefined ||
      v === "" ||
      (Array.isArray(v) && v.length === 0)
    ) {
      delete obj[k];
    }
  }
  return obj;
}

/** Site-relative RAW path → encoded, trailing-slashed path (what PageHeader.schemaPath does). */
export function schemaPath(href: string): string {
  const p = href.startsWith("/") ? href : `/${href}`;
  return encodeURI(p.endsWith("/") ? p : `${p}/`);
}

/** Absolute page URL, byte-identical to the canonical. Pass RAW Hebrew paths — never pre-encoded. */
export function pageUrl(m: SiteManifest, href: string): string {
  return `${m.url}${schemaPath(href)}`;
}

const abs = (m: SiteManifest, p: string): string =>
  /^https?:\/\//.test(p) ? p : `${m.url}${p.startsWith("/") ? p : `/${p}`}`;

export const businessId = (m: SiteManifest): string => `${m.url}/#business`;
export const websiteId = (m: SiteManifest): string => `${m.url}/#website`;
export const serviceId = (m: SiteManifest, slug: string): string =>
  `${pageUrl(m, `/services/${slug}/`)}#service`;

/** One `@graph` per page. Strips the `@context` the kit builders add to each node. */
export function graph(...nodes: Array<JsonLd | null | undefined | false>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.flatMap((n) => {
      if (!n) return [];
      const rest: JsonLd = { ...n };
      delete rest["@context"];
      return [rest];
    }),
  };
}

// ── places ───────────────────────────────────────────────────────────────────

export type Place = { slug: string; name: string; kind?: "city" | "region" };

/**
 * `kind` arrives with the Phase-3 location model (`/new-city`); today `locations` is `{ slug, name }`
 * only. Until then the four region entries are named here so a region is never typed as a `City`
 * (schema-graph §5). Delete this set when `kind` lands.
 */
const REGION_SLUGS: ReadonlySet<string> = new Set(["קריות", "שרון", "צפון", "דרום"]);

export function placeNode(loc: Place): JsonLd {
  const region = loc.kind ? loc.kind === "region" : REGION_SLUGS.has(loc.slug);
  return { "@type": region ? "AdministrativeArea" : "City", name: loc.name };
}

// ── nodes ────────────────────────────────────────────────────────────────────

/** What the business demonstrably knows (schema-graph §3). Standards only — never a credential. */
const KNOWS_ABOUT = [
  "תיקון שערים חשמליים",
  "התקנת שערים חשמליים",
  "שערים נגררים",
  "שערי כנף",
  "שערים מתרוממים",
  "תריסי גלילה חשמליים",
  "ת״י 900 חלק 21.03",
];

/**
 * The business node — `localBusinessJsonLd` plus what the manifest cannot carry. Emit it on EVERY
 * page whose graph references `#business` (`provider`, `publisher`): schema.mjs counts a node with
 * fewer than two data keys as a reference, so an `@id`-only stub still dangles (backlog §4.4).
 *
 * NOT here, deliberately: `address` (no premises), `foundingDate` (foundedYear null, not coming),
 * `aggregateRating` (REVIEW_SOURCE_URL null), `hasOfferCatalog` — it needs `Offer` items and
 * schema.mjs forbids the `Offer` type outright while prices are unsourced (backlog §4.10).
 */
export function businessNode(m: SiteManifest): JsonLd {
  const og = ogImageMeta(m.images)?.[0]; // the manifest OG card (1200×630) on the media host
  return prune({
    ...localBusinessJsonLd(m, {
      logo: "/dangates-logo.png", // public/dangates-logo.png (backlog §4.5)
      image: og?.url,
    }),
    url: `${m.url}/`, // the kit emits m.url without the slash the export enforces (backlog §4.12)
    areaServed: locations.map(placeNode), // real places, not the marketing phrase (backlog §4.8)
    knowsAbout: KNOWS_ABOUT,
  });
}

/** `WebSite` — gives Google a declared site name (backlog §4.9). */
export function websiteJsonLd(m: SiteManifest): JsonLd {
  return prune({
    "@type": "WebSite",
    "@id": websiteId(m),
    url: `${m.url}/`,
    name: m.brandName ?? undefined,
    inLanguage: m.locale ?? "he-IL",
    publisher: { "@id": businessId(m) },
  });
}

/** Service page — the kit's node with an explicit encoded `url`, a stable `@id` and real places. */
export function serviceNode(
  m: SiteManifest,
  svc: { slug: string; name: string; description?: string },
): JsonLd {
  const url = pageUrl(m, `/services/${svc.slug}/`);
  return prune({
    ...serviceJsonLd(m, { name: svc.name, description: svc.description, url }),
    "@id": `${url}#service`,
    areaServed: locations.map(placeNode),
  });
}

/**
 * Location page — `Service` × place (schema-graph §5). Never a `LocalBusiness` per city: this is a
 * service-area business with no premises, and 18 business nodes is a recognised local-spam pattern.
 * Phase 3 replaces the `ב${loc.name}` interpolation with `loc.prefixed` (content-standards §8).
 */
export function locationServiceJsonLd(
  m: SiteManifest,
  svc: { name: string; description?: string },
  loc: Place,
): JsonLd {
  const url = pageUrl(m, `/locations/${loc.slug}/`);
  return prune({
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${svc.name} ב${loc.name}`,
    serviceType: svc.name,
    description: svc.description ?? undefined,
    url,
    provider: { "@id": businessId(m) },
    areaServed: placeNode(loc),
  });
}

export interface ArticleInput {
  headline: string;
  description?: string;
  /** RAW site-relative path, e.g. `/blog/${post.slug}/` — `pageUrl()` encodes it. */
  path: string;
  /** ISO yyyy-mm-dd — the day it actually published, never backdated to look established. */
  datePublished: string;
  /** ISO. `post.updated ?? post.date` — as app/sitemap.ts already does. */
  dateModified?: string;
  /** Absolute or site-relative raster ≥ 1200×630. Defaults to the manifest OG card. */
  image?: string;
  /**
   * A REAL, confirmed person. OMIT when none — prune() drops the key and the node ships without a
   * byline, which is correct. Never invent one: schema.mjs forbids a `Person` author while
   * lib/authors.ts is empty (business-facts §B — no person is coming).
   */
  authorName?: string | null;
  /** `TechArticle` for the safety / component guide families, `BlogPosting` for /blog/, else `Article`. */
  type?: "Article" | "BlogPosting" | "TechArticle";
}

/** Article node joined to the website and the business (schema-graph §6). */
export function articleJsonLd(m: SiteManifest, a: ArticleInput): JsonLd {
  const url = pageUrl(m, a.path);
  return prune({
    "@type": a.type ?? "Article",
    "@id": `${url}#article`,
    headline: a.headline,
    description: a.description ?? undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": websiteId(m) },
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    image: a.image ? abs(m, a.image) : ogImageMeta(m.images)?.[0]?.url,
    author: a.authorName ? { "@type": "Person", name: a.authorName } : undefined,
    publisher: { "@id": businessId(m) },
    inLanguage: m.locale ?? "he-IL",
  });
}

/**
 * `CollectionPage` + `ItemList` for a hub index (/שירותים/, /איזורי-שירות/, /blog/, /מדריכים/).
 * Pass the FULL array the page renders — never a slice: an ItemList that disagrees with the visible
 * grid is a structured-data mismatch, which is worse than no ItemList at all.
 */
export function itemListJsonLd(
  m: SiteManifest,
  items: ReadonlyArray<{ name: string; path: string }>,
  page: { path: string; name: string; description?: string },
): JsonLd {
  const url = pageUrl(m, page.path);
  return prune({
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: page.name,
    description: page.description ?? undefined,
    isPartOf: { "@id": websiteId(m) },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: pageUrl(m, it.path),
      })),
    },
  });
}

/** `AboutPage` / `ContactPage` / plain `WebPage` wrapper. No `Person` on the about page — none is coming. */
export function pageNode(
  m: SiteManifest,
  type: "AboutPage" | "ContactPage" | "WebPage",
  page: { path: string; name: string; description?: string },
): JsonLd {
  const url = pageUrl(m, page.path);
  return prune({
    "@type": type,
    "@id": url,
    url,
    name: page.name,
    description: page.description ?? undefined,
    isPartOf: { "@id": websiteId(m) },
    about: { "@id": businessId(m) },
  });
}

/**
 * The breadcrumb mapping, in ONE place: PageHeader's `{ label, href }` → the kit's `{ name, path }`.
 * PageHeader imports this; pages never call breadcrumbJsonLd themselves.
 */
export function breadcrumbNode(
  m: SiteManifest,
  crumbs: ReadonlyArray<{ label: string; href: string }>,
): JsonLd {
  return breadcrumbJsonLd(
    m,
    crumbs.map((c) => ({ name: c.label, path: schemaPath(c.href) })),
  );
}

/** Service lookup for pages that need the 7 services by @id (e.g. a future `makesOffer`). */
export const serviceIds = (m: SiteManifest): string[] =>
  services.map((s) => serviceId(m, s.slug));
