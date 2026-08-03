import type { MetadataRoute } from "next";
import { siteConfig, services, locations, locationsUpdated } from "@/lib/site-config";
import { posts } from "@/lib/posts";

/**
 * Generates /sitemap.xml from the static routes + the service, location and blog matrices.
 * Paths use the Hebrew URL scheme; all cities are normalized under /locations/<he-slug>/.
 * Extend `staticPages` when new top-level pages are added.
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

  /** Top-level routes whose copy is hand-written in their own `page.tsx`. */
  const staticPages = [
    { path: "", updated: "2026-07-13" },
    { path: "שירותים", updated: "2026-07-13" },
    { path: "איזורי-שירות", updated: "2026-07-13" },
    { path: "מחירון", updated: "2026-07-13" },
    { path: "blog", updated: "2026-07-13" },
    { path: "אודות", updated: "2026-07-13" },
    { path: "צור-קשר", updated: "2026-07-13" },
    { path: "מדיניות-פרטיות", updated: "2026-07-13" },
    { path: "הצהרת-נגישות", updated: "2026-07-13" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((p) => ({
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
