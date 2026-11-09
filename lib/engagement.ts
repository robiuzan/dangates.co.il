/**
 * What server markup and the engagement-events leaf agree on (docs/event-taxonomy.md, "Engagement
 * events"). A related-content link carries `data-related="<kind>"`; the one client leaf reads it on
 * click and pushes `related_click`. Kept free of "use client" so server components can import it.
 */

export type RelatedKind = "service" | "location" | "guide" | "post";

/** Spread onto the `<Link>` of a related service / location / guide / post card. */
export function relatedAttr(kind: RelatedKind): { "data-related": RelatedKind } {
  return { "data-related": kind };
}
