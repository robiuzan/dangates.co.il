import type { MetadataRoute } from "next";
import { siteConfig, services, locations } from "@/lib/site-config";
import { posts } from "@/lib/posts";

/**
 * Generates /sitemap.xml from the static routes + the service, location and blog matrices.
 * Paths use the Hebrew URL scheme; all cities are normalized under /locations/<he-slug>/.
 * Extend `staticPaths` when new top-level pages are added.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

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
    url: path ? `${base}/${path}` : base,
    lastModified: now,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((c) => ({
    url: `${base}/locations/${c.slug}`,
    lastModified: now,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticEntries, ...serviceEntries, ...locationEntries, ...blogEntries];
}
