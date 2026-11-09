/**
 * nearby.ts — which published locations sit next to which (backlog §9.3, `.claude/skills/new-city`).
 *
 * ONE list of unordered pairs; `nearby(slug)` reads it in both directions. Symmetry is therefore
 * structural: there is no second list to forget to update, so a one-way edge cannot exist. To add a
 * neighbour, add one pair — both pages gain the link.
 *
 * The pairs are geography, not a ranking, and they carry no claim about service: a link from one
 * page to another says the two places are near each other, nothing about coverage. A pair that
 * touches the region (שרון) is a link to the region's page, not an availability promise.
 *
 * A pair whose two places are far apart (over about 30 km in a straight line) stays only where a page
 * would otherwise fall under the 2–4 links content-standards §3 block 5 asks for. The page on EACH
 * side then carries a `CityContent.nearbyHeading` that does not call the far place close — today
 * חיפה–נתניה and ירושלים–רחובות, four modules. Dropping either pair was weighed and rejected: חיפה would
 * be left with no nearby link at all and ירושלים with one. אשקלון–יבנה is under that distance, so
 * both keep the shared heading.
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
  // 2026-11-09 (owner-actions 3.6): קריות, צפון, דרום and באר שבע were retired, and every pair that
  // touched one of them went with it. Two places lost their neighbours and the pairs below restore the
  // nearby links each page needs (content-standards §3, location block 5):
  //  - חיפה had only the retired קריות and צפון. Its nearest published page is נתניה, down the coast
  //    with חדרה, קיסריה and זכרון יעקב (no page of their own) in between — far, but the nearest.
  //    It is חיפה's one link, the documented exception in content-standards §3 block 5. No second
  //    distant place is added to fill a count, and not the שרון region: a region pairs only with its
  //    own towns (/new-city step 4), and חיפה is not one of them. The shared heading over these links
  //    (`locationPageCopy.nearbyHeading`) asks for close places, which נתניה is not, so חיפה's module
  //    carries its own `nearbyHeading` asking which city with a page on the site is the nearest — true
  //    for a single far link — and a `nearbyNote` naming the coast towns in between. The shared heading never says "closest": on the other pages a nearer page
  //    can exist without being paired. The reverse side counts too: נתניה's list holds חיפה, so
  //    נתניה's module carries a heading that asks which listed place is farther as well.
  //  - אשקלון had only the retired דרום and באר שבע, leaving just אשדוד. Its next-nearest published
  //    place up the coast is יבנה.
  ["חיפה", "נתניה"],
  ["אשקלון", "יבנה"],
  // ירושלים gets a second neighbour: רחובות, the nearest published place after מודיעין. It is far,
  // not close, so ירושלים and רחובות both carry a `nearbyHeading` that asks which listed place is farther
  // (audit 2026-11-09 L6).
  ["ירושלים", "רחובות"],
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
