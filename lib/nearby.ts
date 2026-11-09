/**
 * nearby.ts — which published locations sit next to which (backlog §9.3, `.claude/skills/new-city`).
 *
 * ONE list of unordered pairs; `nearby(slug)` reads it in both directions. Symmetry is therefore
 * structural: there is no second list to forget to update, so a one-way edge cannot exist. To add a
 * neighbour, add one pair — both pages gain the link.
 *
 * The pairs are geography, not a ranking, and they carry no claim about service: a link from one
 * page to another says the two places are near each other, nothing about coverage. A pair that
 * touches a region (קריות, שרון, צפון, דרום) is a link to the region's page, not an availability promise.
 *
 * Module-load checks throw (so `next build` fails) on a self-pair and on a pair listed twice in
 * either direction. An unknown slug cannot be written: the tuple is typed on `LocationSlug`.
 */
import type { LocationSlug } from "@/lib/site-config";

export type NearbyPair = readonly [LocationSlug, LocationSlug];

export const nearbyPairs: readonly NearbyPair[] = [
  ["תל-אביב", "חולון"],
  ["תל-אביב", "ראשון-לציון"],
  ["תל-אביב", "פתח-תקווה"],
  ["חולון", "ראשון-לציון"],
  ["ראשון-לציון", "רחובות"],
  ["רחובות", "יבנה"],
  ["יבנה", "אשדוד"],
  ["אשדוד", "אשקלון"],
  ["פתח-תקווה", "כפר-סבא"],
  ["כפר-סבא", "נתניה"],
  ["נתניה", "שרון"],
  ["כפר-סבא", "שרון"],
  ["מודיעין", "ירושלים"],
  ["מודיעין", "פתח-תקווה"],
  ["מודיעין", "רחובות"],
  ["חיפה", "קריות"],
  ["חיפה", "צפון"],
  ["קריות", "צפון"],
  ["באר-שבע", "דרום"],
  ["אשקלון", "דרום"],
  // The two pairs below give ירושלים and באר שבע a second neighbour (content-standards §3, location
  // block 5: 2–4 nearby links). Each is among the nearest published places after the first pair:
  // רחובות after מודיעין for ירושלים, אשקלון after the region for באר שבע.
  ["ירושלים", "רחובות"],
  ["באר-שבע", "אשקלון"],
];

/** The neighbours of a location, from either side of every pair, in the order the pairs are listed. */
export function nearby(slug: LocationSlug): readonly LocationSlug[] {
  const out: LocationSlug[] = [];
  for (const [a, b] of nearbyPairs) {
    if (a === slug) out.push(b);
    else if (b === slug) out.push(a);
  }
  return out;
}

// ── module-load checks ───────────────────────────────────────────────────────

function validateNearbyPairs(): void {
  const seen = new Set<string>();
  for (const [a, b] of nearbyPairs) {
    if (a === b) {
      throw new Error(
        `nearbyPairs pairs "${a}" with itself — a page is not its own neighbour.`,
      );
    }
    const key = [a, b]
      .map((s) => s.normalize("NFC"))
      .sort()
      .join("|");
    if (seen.has(key)) {
      throw new Error(
        `nearbyPairs lists "${a}"–"${b}" twice (in either direction) — one pair already links both pages.`,
      );
    }
    seen.add(key);
  }
}

validateNearbyPairs();
