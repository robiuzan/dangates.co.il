/**
 * authors.ts — the author registry (backlog §7.4, docs/eeat-and-trust.md §3).
 *
 * EMPTY BY DESIGN. No person is named on this site and none is coming (docs/business-facts.md §B):
 * every article is authored by the business `Organization`, with no byline and no author box.
 * `scripts/audit/schema.mjs` reads this file — while the registry is empty it fails any `Person`
 * author in `out/`; the day an entry exists the gate opens for exactly that entry.
 *
 * The data-only path, for the day the owner decides otherwise. An entry needs ALL of:
 *   1. a real full name, with the person's written permission to be named;
 *   2. a specific role (`jobTitle`) — what they do on site, not "מומחה";
 *   3. a real photograph of that person, with permission, through the site-images pipeline.
 * `sameAs` lists only profiles that exist. A start year is added only if business-facts confirms it.
 *
 * Adding an entry is a data edit here, never a code change: `articleJsonLd` in lib/jsonld.ts then
 * uses the entry as the article author, and until one exists it stays `Organization`. Never invent
 * a person, a team label presented as a person, or a first-name-only byline.
 */

export interface Author {
  /** URL-safe identifier, unique in the registry. */
  readonly slug: string;
  /** Real full name — written permission to be named is required. */
  readonly name: string;
  /** Specific role on site (`jobTitle`), not a generic claim of expertise. */
  readonly jobTitle: string;
  /** Site-relative path of a real photograph, supplied through the site-images pipeline. */
  readonly photo: string;
  /** Profiles that exist, absolute URLs. */
  readonly sameAs?: readonly string[];
}

export const authors: readonly Author[] = [];
