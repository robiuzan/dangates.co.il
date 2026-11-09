/**
 * The table of contents rule (engagement-ux): built at render time from a page's own H2s, with no
 * client JS. A page earns one when its prose passes ~900 words (content-standards §1 floor for posts
 * and guides) AND it has four or more sections to jump between. Below either bar `buildToc` returns
 * `[]` and `<Toc>` renders nothing, so a short page never grows a list of two links.
 *
 * Ids are `headingId(text)` — the same slug the guide renderer already puts on its headings — so a
 * heading's anchor is stable for as long as its text is. A duplicate throws: that fails the build
 * instead of shipping two targets for one link.
 */
import { headingId } from "@/lib/guide-types";

export { headingId };

/** Prose length (whitespace-separated words) from which a page gets a table of contents. */
export const TOC_MIN_WORDS = 900;
/** The fewest sections worth a table of contents. */
export const TOC_MIN_HEADINGS = 4;

export interface TocItem {
  id: string;
  text: string;
}

/** A heading to link to: its text, or its text with an id the page already publishes (`#faq`). */
export type TocHeading = string | TocItem;

/** Whitespace-separated words across the strings a page renders as its prose. */
export function countWords(texts: readonly string[]): number {
  return texts.reduce((n, t) => n + t.split(/\s+/).filter(Boolean).length, 0);
}

/**
 * `headings` are the H2s to link to, in page order (text, or text plus an existing id); `prose` is every string the page renders as
 * body copy (headings included) — the same data the page maps, so the count cannot drift from it —
 * or a word count a registry already keeps (a guide's `wordCount`).
 */
export function buildToc(
  headings: readonly TocHeading[],
  prose: readonly string[] | number,
): TocItem[] {
  const words = typeof prose === "number" ? prose : countWords(prose);
  if (headings.length < TOC_MIN_HEADINGS || words < TOC_MIN_WORDS) return [];
  const items = headings.map((h) =>
    typeof h === "string" ? { id: headingId(h), text: h } : h,
  );
  const seen = new Set<string>();
  for (const { id, text } of items) {
    if (seen.has(id)) throw new Error(`[toc] two headings share the id "${id}": ${text}`);
    seen.add(id);
  }
  return items;
}
