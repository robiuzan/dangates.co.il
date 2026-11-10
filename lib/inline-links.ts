/**
 * inline-links.ts — the one check every prose model runs over its `InlineLink`s at module load
 * (service depth, city content, page content). The guides keep their own, stricter check in
 * lib/guides.ts (they alone may link out, and must hand off to a service); this one is for the
 * internal-only models. `NON_DESCRIPTIVE_ANCHORS` lives here so both read the same list.
 *
 * Hrefs under /מדריכים/ are NOT resolved here — lib/guides.ts imports the models and checks them
 * against the registry once every guide is loaded.
 */
import { locations, services, staticPages } from "@/lib/site-config";
import { posts } from "@/lib/posts";
import type { InlineLink } from "@/lib/guide-types";

export type { InlineLink };

/** Anchors that say nothing about the target (content-standards §3 item 6). */
export const NON_DESCRIPTIVE_ANCHORS = new Set([
  "כאן",
  "לחצו כאן",
  "למידע נוסף",
  "קראו עוד",
]);

const serviceSlugs = new Set<string>(services.map((s) => s.slug.normalize("NFC")));
const locationSlugs = new Set<string>(locations.map((l) => l.slug.normalize("NFC")));
const postSlugs = new Set<string>(posts.map((p) => p.slug.normalize("NFC")));
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

/**
 * Throws, naming `owner` and the offending value, when a link's anchor is absent from every one of
 * `texts`, is non-descriptive, when its href is external, lacks the leading or trailing slash, or
 * points at a page that does not exist. `undefined` links pass.
 */
export function assertInlineLinks(
  owner: string,
  texts: readonly string[],
  links: readonly InlineLink[] | undefined,
): void {
  for (const { anchor, href } of links ?? []) {
    if (!texts.some((t) => t.includes(anchor))) {
      throw new Error(
        `${owner}: in-copy link anchor "${anchor}" does not appear in its text.`,
      );
    }
    if (NON_DESCRIPTIVE_ANCHORS.has(anchor.trim())) {
      throw new Error(`${owner}: in-copy link anchor "${anchor}" is not descriptive.`);
    }
    if (/^https?:\/\//.test(href)) {
      throw new Error(
        `${owner}: in-copy link "${href}" is external — only guides may link out.`,
      );
    }
    if (!href.startsWith("/") || !href.endsWith("/")) {
      throw new Error(
        `${owner}: in-copy link "${href}" must start and end with "/" (a site-relative path).`,
      );
    }
    const path = bare(href);
    if (path.startsWith("/מדריכים/")) continue; // resolved by lib/guides.ts
    const service = path.startsWith("/services/") ? path.slice("/services/".length) : "";
    const location = path.startsWith("/locations/")
      ? path.slice("/locations/".length)
      : "";
    const post = path.startsWith("/blog/") ? path.slice("/blog/".length) : "";
    const ok =
      (service !== "" && serviceSlugs.has(service)) ||
      (location !== "" && locationSlugs.has(location)) ||
      (post !== "" && postSlugs.has(post)) ||
      staticPaths.has(path);
    if (!ok) {
      throw new Error(`${owner}: in-copy link points nowhere: "${href}".`);
    }
  }
}
