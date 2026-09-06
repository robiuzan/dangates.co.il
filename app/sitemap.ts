import type { MetadataRoute } from "next";
import {
  siteConfig,
  services,
  locations,
  locationsUpdated,
  staticPages,
} from "@/lib/site-config";
import { posts } from "@/lib/posts";

/**
 * Generates /sitemap.xml from the static routes + the service, location and blog matrices.
 * Paths use the Hebrew URL scheme; all cities are normalized under /locations/<he-slug>/.
 * The route set is entirely data-driven: `staticPages`, `services`, `locations` and
 * `posts`, all from lib/. Nothing is declared here, so a new page cannot ship missing —
 * `scripts/audit/links.mjs` fails when the registry and the `app/` tree disagree.
 *
 * Every entry MUST carry a trailing slash: the export runs with `trailingSlash: true`
 * (next.config.mjs), so a slash-less URL 301s to the slashed one and the sitemap would
 * be listing redirects instead of final destinations.
 *
 * <lastmod> is a real content date, never the build clock. Stamping `new Date()` gave all
 * 34 non-blog entries a fresh timestamp on every deploy — including deploys that changed
 * no copy at all — which teaches crawlers to ignore the field. The dates live next to the
 * content they describe (site-config for services/locations, `staticPages` here, `posts`
 * for the blog) and are bumped by hand when the copy actually changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;

  /**
   * `path` → absolute URL with the trailing slash the static export serves.
   *
   * `encodeURI` percent-escapes the Hebrew slugs. The sitemap protocol requires escaped
   * URLs, and Cloudflare Pages only matches the escaped asset key — it 404s a path sent
   * as raw UTF-8 bytes. Escaping also makes `loc` byte-identical to the page's canonical.
   */
  const url = (path: string) => encodeURI(`${base}/${path ? `${path}/` : ""}`);

  /** `noindex` routes are registered but never listed — see `StaticPage`. */
  const staticEntries: MetadataRoute.Sitemap = staticPages
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: url(p.path),
      lastModified: p.updated,
    }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`services/${s.slug}`),
    lastModified: s.updated,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((c) => ({
    url: url(`locations/${c.slug}`),
    lastModified: locationsUpdated,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: url(`blog/${p.slug}`),
    lastModified: p.updated ?? p.date,
  }));

  return [...staticEntries, ...serviceEntries, ...locationEntries, ...blogEntries];
}
