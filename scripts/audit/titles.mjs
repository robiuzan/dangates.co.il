/**
 * titles.mjs — on-page metadata on the export (backlog §2, seo-metadata skill, keyword-map §3–§5).
 *
 *   - <title> unique sitewide, brand token exactly once, ≤ thresholds.title.maxChars (warn)
 *   - meta description present, unique, within thresholds.description, ends with punctuation
 *   - one self-referencing canonical: percent-encoded, trailing slash, byte-equal to the sitemap <loc>
 *   - og:url present (backlog §1.5)
 *
 * Usage: node scripts/audit/titles.mjs [--json]
 */

import {
  contentPages,
  readSitemap,
  title,
  metaContent,
  canonical,
  SITE,
} from "./lib/pages.mjs";
import { Report, THRESHOLDS, finish, isMain, parseArgs } from "./lib/report.mjs";

export function run() {
  const r = new Report(
    "titles",
    "Title, description, canonical and og:url on every content page (backlog §2, §1.5).",
  );
  const pages = contentPages();
  const sitemapLocs = new Map(readSitemap().map((u) => [u.path, u.loc]));
  const brand = THRESHOLDS.title.brandToken;

  const titles = new Map();
  const descriptions = new Map();
  let noOgUrl = 0;

  for (const page of pages) {
    const t = title(page.html);
    const d = metaContent(page.html, "description");
    const c = canonical(page.html);
    const og = metaContent(page.html, "og:url");

    // title
    if (!t) r.fail(`${page.path}: no <title>`, undefined, "backlog §2");
    else {
      titles.set(t, [...(titles.get(t) ?? []), page.path]);
      const brandCount = t.split(brand).length - 1;
      if (brandCount !== 1)
        r.fail(
          `${page.path}: brand token appears ${brandCount}× in title`,
          t,
          "backlog §2.1",
        );
      if (t.length > THRESHOLDS.title.maxChars)
        r.warn(
          `${page.path}: title ${t.length} chars (> ${THRESHOLDS.title.maxChars})`,
          t,
          "backlog §2.5",
        );
    }

    // description
    if (!d) r.fail(`${page.path}: no meta description`, undefined, "backlog §2.2");
    else {
      descriptions.set(d, [...(descriptions.get(d) ?? []), page.path]);
      if (
        d.length < THRESHOLDS.description.minChars ||
        d.length > THRESHOLDS.description.maxChars
      )
        r.warn(
          `${page.path}: description ${d.length} chars (want ${THRESHOLDS.description.minChars}–${THRESHOLDS.description.maxChars})`,
          d,
          "backlog §2.4",
        );
      if (!/[.!?׳״"'»)…]$/.test(d.trim()))
        r.warn(
          `${page.path}: description has no terminal punctuation`,
          d,
          "backlog §2.6",
        );
    }

    // canonical
    const expectedLoc = sitemapLocs.get(page.path);
    if (!c) r.fail(`${page.path}: no canonical`, undefined, "backlog §1.8");
    else {
      if (!c.startsWith(SITE))
        r.fail(`${page.path}: canonical is not absolute on ${SITE}`, c);
      if (!c.endsWith("/")) r.fail(`${page.path}: canonical lacks the trailing slash`, c);
      if (/[֐-׿]/.test(c))
        r.fail(
          `${page.path}: canonical carries raw Hebrew (must be percent-encoded)`,
          c,
          "backlog §4.7",
        );
      if (expectedLoc && c !== expectedLoc)
        r.fail(
          `${page.path}: canonical ≠ sitemap <loc>`,
          `canonical ${c}\nsitemap   ${expectedLoc}`,
          "backlog §1.8",
        );
    }

    // og:url
    if (!og) noOgUrl++;
    else if (expectedLoc && og !== expectedLoc)
      r.warn(`${page.path}: og:url ≠ canonical`, og, "backlog §1.5");
  }

  for (const [t, paths] of titles)
    if (paths.length > 1)
      r.fail(
        `duplicate title on ${paths.length} pages`,
        `"${t}"\n${paths.join("\n")}`,
        "backlog §2",
      );
  for (const [d, paths] of descriptions)
    if (paths.length > 1)
      r.fail(
        `duplicate description on ${paths.length} pages`,
        `"${d.slice(0, 80)}…"\n${paths.join("\n")}`,
        "backlog §2.3",
      );
  if (noOgUrl)
    r.fail(
      `og:url missing on ${noOgUrl} of ${pages.length} pages`,
      undefined,
      "backlog §1.5",
    );

  r.metric("pages", pages.length);
  r.metric("uniqueTitles", titles.size);
  r.metric("uniqueDescriptions", descriptions.size);
  r.metric("ogUrlMissing", noOgUrl);
  return r;
}

if (isMain(import.meta.url)) finish(run(), parseArgs());
