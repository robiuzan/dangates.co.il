/**
 * jsonld.ts — the site-local JSON-LD builders (backlog §4.2 §4.4–§4.9 §4.12, docs/schema-graph.md §8).
 *
 * Contract — the same as the kit's (`@ishub/site-kit/seo`):
 *   - pure `(m: SiteManifest, …) => JsonLd`; no React, no `next` imports
 *   - site-local nodes carry NO `@context`; every page renders exactly ONE script, through `graph()`:
 *       <script type="application/ld+json"
 *               dangerouslySetInnerHTML={{ __html: jsonLdScript(graph(...nodes)) }} />
 *     Pages with a `PageHeader` hand it `nodes` instead; it appends the page's one breadcrumb.
 *   - every url / @id goes through `pageUrl()` — trailing slash + encodeURI — so it is byte-identical
 *     to the page's canonical and the sitemap <loc>. The kit's `abs()` does NOT encode, and
 *     `serviceJsonLd` defaults `url` to raw Hebrew; `scripts/audit/schema.mjs` fails on both.
 *
 * Two audit rules shape the nodes. A node with fewer than two data keys counts as a REFERENCE, so
 * `{ "@id": … }` only resolves when a node with that `@id` and real content sits in the same page's
 * graph — every page that points at `#business` therefore carries `businessNode()`. And a
 * reference must never point at a node the page does not define (`#website` lives on `/` only).
 *
 * Nothing here is promoted into the vendored kit (golden rule 9). No copy is authored in this file:
 * names and labels come from the caller or are read
 * from `lib/content.ts`; the business node reads `services` and `locations` from
 * `lib/site-config.ts`, so its catalog and its areaServed can never drift from the published pages.
 */
import { ogImageMeta, type SiteManifest } from "@ishub/site-kit";
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  serviceJsonLd,
  type JsonLd,
} from "@ishub/site-kit/seo";
import { locations, services } from "@/lib/site-config";
import { servicesIndexHeroTitle } from "@/lib/content";

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

/** Site-relative RAW path → encoded, trailing-slashed path (the canonical's form). */
export function schemaPath(href: string): string {
  const p = href.startsWith("/") ? href : `/${href}`;
  return encodeURI(p.endsWith("/") ? p : `${p}/`);
}

/** Absolute page URL, byte-identical to the canonical. Pass RAW Hebrew paths — never pre-encoded. */
export function pageUrl(m: SiteManifest, href: string): string {
  return `${m.url}${schemaPath(href)}`;
}

export const businessId = (m: SiteManifest): string => `${m.url}/#business`;
export const websiteId = (m: SiteManifest): string => `${m.url}/#website`;

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

export type Place = { slug: string; name: string; kind: "city" | "region" };

/**
 * `kind` comes from the `locations` entry (lib/site-config.ts): a region is an `AdministrativeArea`,
 * never typed as a `City` (schema-graph §5).
 */
export function placeNode(loc: Place): JsonLd {
  return {
    "@type": loc.kind === "region" ? "AdministrativeArea" : "City",
    name: loc.name,
  };
}

// ── nodes ────────────────────────────────────────────────────────────────────

/**
 * The business node — `localBusinessJsonLd` plus the `logo` and `image` the manifest cannot carry on
 * its own. Emit it on EVERY page whose graph references `#business` (`provider`, `publisher`,
 * `author`, `about`): `schema.mjs` counts an `@id`-only stub as a reference, so a stub still
 * dangles (§4.4).
 *
 * `description` is the tagline, not the kit's default (`shortPitch`): the roster pitch carries claims
 * `docs/business-facts.md` has not confirmed, and this node now ships on every page.
 *
 * `areaServed` is the 14 published locations as `City` / `AdministrativeArea` nodes (`placeNode`),
 * not the roster's marketing phrase, which includes the unconfirmed "פריסה ארצית" (§4.8).
 * `hasOfferCatalog` names the 7 services as `Service` nodes by `@id` — no `Offer`, no price
 * (§4.10): `OfferCatalog.itemListElement` accepts any `Thing`. Each entry carries `name` and `url` so it
 * counts as defined on every page; on a service page it merges by `@id` with `serviceNode`.
 *
 * NOT here, deliberately: `address` (no premises), `foundingDate` (foundedYear null, not coming),
 * `aggregateRating` / `review` (REVIEW_SOURCE_URL null), any `Offer` (prices are authored estimates).
 */
export function businessNode(
  m: SiteManifest,
  extra: { knowsAbout?: readonly string[] } = {},
): JsonLd {
  const og = ogImageMeta(m.images)?.[0]; // the manifest OG card (1200×630) on the media host
  return prune({
    ...localBusinessJsonLd(m, {
      logo: "/dangates-logo.png", // public/dangates-logo.png
      image: og?.url,
    }),
    description: m.tagline ?? undefined,
    url: `${m.url}/`, // the kit emits the origin without the slash the export enforces
    areaServed: locations.map((loc) => placeNode(loc)),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: servicesIndexHeroTitle,
      itemListElement: services.map((svc) => {
        const url = pageUrl(m, `/services/${svc.slug}/`);
        return { "@type": "Service", "@id": `${url}#service`, name: svc.name, url };
      }),
    },
    knowsAbout: extra.knowsAbout ? [...extra.knowsAbout] : undefined,
  });
}

/** `WebSite` — gives Google a declared site name. Homepage only; nothing else may reference it. */
export function websiteJsonLd(m: SiteManifest): JsonLd {
  return prune({
    "@type": "WebSite",
    "@id": websiteId(m),
    url: `${m.url}/`,
    name: m.brandName ?? undefined,
    inLanguage: m.locale,
    publisher: { "@id": businessId(m) },
  });
}

/** Service page — the kit's node with an explicit encoded `url`, a stable `@id` and a bare provider ref. */
export function serviceNode(
  m: SiteManifest,
  svc: { slug: string; name: string; description?: string },
): JsonLd {
  const url = pageUrl(m, `/services/${svc.slug}/`);
  return prune({
    ...serviceJsonLd(m, { name: svc.name, description: svc.description, url }),
    "@id": `${url}#service`,
    provider: { "@id": businessId(m) },
    // Same reason as businessNode: the kit's areaServed is the unconfirmed roster phrase.
    areaServed: undefined,
  });
}

/**
 * Location page — `Service` × place (schema-graph §5). Never a `LocalBusiness` per city: this is a
 * service-area business with no premises, and one business node per city is a recognised local-spam pattern.
 * `svc.name` is the page's full display name — the caller composes it from `lib/content.ts`.
 */
export function locationServiceJsonLd(
  m: SiteManifest,
  svc: { name: string; serviceType: string; description?: string },
  loc: Place,
): JsonLd {
  const url = pageUrl(m, `/locations/${loc.slug}/`);
  return prune({
    "@type": "Service",
    "@id": `${url}#service`,
    name: svc.name,
    serviceType: svc.serviceType,
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
  /**
   * The index this article sits in. Emitted as a full node (not an `@id` stub) so the reference is
   * defined on the page that makes it.
   */
  isPartOf?: { path: string; name: string; type?: "Blog" | "CollectionPage" };
  /** External sources the copy cites (a guide's `sources`) → `citation`; absolute https URLs only. */
  citation?: ReadonlyArray<{ name: string; url: string }>;
  /** Absolute or site-relative raster ≥ 1200×630. Defaults to the manifest OG card. */
  image?: string;
  /** `TechArticle` for the safety / component guide families, `BlogPosting` for /blog/, else `Article`. */
  type?: "Article" | "BlogPosting" | "TechArticle";
}

/**
 * Article node joined to the business. Author and publisher are the business ORGANISATION — never a
 * `Person`: none is coming (business-facts §B), and `schema.mjs` forbids one while `lib/authors.ts`
 * is empty. `mainEntityOfPage` is the percent-encoded page URL as a plain string, so it is checked
 * against the canonical and does not create an undefined `@id`.
 */
export function articleJsonLd(m: SiteManifest, a: ArticleInput): JsonLd {
  const url = pageUrl(m, a.path);
  const image = a.image
    ? /^https?:\/\//.test(a.image)
      ? a.image
      : `${m.url}${a.image.startsWith("/") ? a.image : `/${a.image}`}`
    : ogImageMeta(m.images)?.[0]?.url;
  return prune({
    "@type": a.type ?? "Article",
    "@id": `${url}#article`,
    headline: a.headline,
    description: a.description ?? undefined,
    url,
    mainEntityOfPage: url,
    isPartOf: a.isPartOf
      ? {
          "@type": a.isPartOf.type ?? "Blog",
          "@id": pageUrl(m, a.isPartOf.path),
          url: pageUrl(m, a.isPartOf.path),
          name: a.isPartOf.name,
        }
      : undefined,
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    image,
    citation: a.citation?.map((c) => ({
      "@type": "CreativeWork",
      name: c.name,
      url: c.url,
    })),
    author: { "@id": businessId(m) },
    publisher: { "@id": businessId(m) },
    inLanguage: m.locale,
  });
}

/**
 * The breadcrumb mapping, in ONE place: PageHeader's `{ label, href }` → the kit's `{ name, path }`.
 * Only `PageHeader` calls this — a page never builds its own, so a page can never carry two.
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

/**
 * `CollectionPage` + `ItemList` for a hub index (/שירותים/, /איזורי-שירות/, /blog/, /מדריכים/).
 * Pass the FULL array the page renders — never a slice: an ItemList that disagrees with the visible
 * grid is a structured-data mismatch, which is worse than no ItemList at all.
 *
 * It carries no `isPartOf → #website`: that node exists on `/` only, so the reference would dangle.
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

export type PageNodeType = "WebPage" | "AboutPage" | "ContactPage";

/**
 * A plain page-type node: `AboutPage`, `ContactPage`, or `WebPage` (pricing, legal). The `@id` is the
 * page URL, as on `itemListJsonLd`'s `CollectionPage`.
 *
 * `business` joins the page to the entity: `about` for an `AboutPage`, `mainEntity` for a
 * `ContactPage`. Either points at `#business`, so the caller must also emit `businessNode()` in the
 * same graph or the reference dangles. No `isPartOf → #website` (that node exists on `/` only), and
 * never an `Offer` or a price — `/מחירון/` is a plain `WebPage`.
 */
export function pageNode(
  m: SiteManifest,
  type: PageNodeType,
  page: {
    path: string;
    name: string;
    description?: string;
    business?: "about" | "mainEntity";
  },
): JsonLd {
  const url = pageUrl(m, page.path);
  return prune({
    "@type": type,
    "@id": url,
    url,
    name: page.name,
    description: page.description ?? undefined,
    inLanguage: m.locale,
    ...(page.business ? { [page.business]: { "@id": businessId(m) } } : {}),
  });
}
