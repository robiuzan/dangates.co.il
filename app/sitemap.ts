import type { MetadataRoute } from "next";
import { siteConfig, services, locations } from "@/lib/site-config";
import { posts } from "@/lib/posts";

/**
 * Generates /sitemap.xml from the static routes + the service, location and blog matrices.
 * Paths use the Hebrew URL scheme; all cities are normalized under /locations/<he-slug>/.
 * Extend `staticPaths` when new top-level pages are added.
 *
 * Every entry MUST carry a trailing slash: the export runs with `trailingSlash: true`
 * (next.config.mjs), so a slash-less URL 301s to the slashed one and the sitemap would
 * be listing redirects instead of final destinations.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

  /** `path` → absolute URL with the trailing slash the static export serves. */
  const url = (path: string) => `${base}/${path ? `${path}/` : ""}`;

  const staticPaths = [
    "",
    "שירותים",
    "איזורי-שירות",
    "מחירון",
    "blog",
    "אודות",
    "צור-קשר",
    "מדיניות-פרטיות",
    "הצהרת-נגישות",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: url(path),
    lastModified: now,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`services/${s.slug}`),
    lastModified: now,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((c) => ({
    url: url(`locations/${c.slug}`),
    lastModified: now,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: url(`blog/${p.slug}`),
    lastModified: new Date(p.date),
  }));

  return [...staticEntries, ...serviceEntries, ...locationEntries, ...blogEntries];
}
