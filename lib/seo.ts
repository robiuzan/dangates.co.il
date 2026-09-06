/**
 * seo.ts — the one place `alternates.canonical` and `openGraph.url` are derived from, so the
 * two can never diverge (backlog §1.5). Every route calls `routeUrl()` with its own decoded
 * path and spreads `ogBase` into its `openGraph` block.
 *
 * Next replaces a parent `openGraph` object wholesale the moment a route sets its own — it
 * does not merge — so every route that sets `openGraph` must spread `ogBase` itself or it
 * silently drops the OG image. See `.claude/skills/seo-metadata/SKILL.md` §"og:url and the OG
 * block".
 */

import { ogImageMeta } from "@ishub/site-kit";
import { manifest, siteConfig } from "@/lib/site-config";

/** Static half of every route's OpenGraph block — image, type, locale, site name. */
export const ogBase = {
  images: ogImageMeta(manifest.images),
  type: "website" as const,
  locale: "he_IL",
  siteName: siteConfig.name,
};

/**
 * Canonical / og:url for a decoded route path (`""` for the homepage, no leading slash,
 * no trailing slash — e.g. `services/${card.slug}`). Resolved against `metadataBase`
 * (app/layout.tsx) and percent-escaped by Next on output; write the plain Hebrew segment,
 * never pre-encode it here (double-encoding turns "%" into "%25").
 */
export function routeUrl(path: string): string {
  return path === "" ? "/" : `/${path}/`;
}
