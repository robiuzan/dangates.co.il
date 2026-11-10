/**
 * city-content.ts — the per-city content model that app/locations/[city]/page.tsx renders
 * (backlog §3.1, `.claude/skills/new-city`, docs/content-standards.md §2). One typed entry per
 * location, written in its own module under content/locations/<slug>.ts
 * (`export const city: CityContent`) so the drafters can work in parallel without touching one
 * file. This file only types, assembles and checks them.
 *
 * `cityContent` is a total `Record<LocationSlug, CityContent>`: adding a location to
 * lib/site-config.ts without an entry here fails `npm run typecheck`.
 *
 * An entry is EMPTY while its drafter has not reached it (`answer === ""`): the route then renders
 * today's page — the shared title, H1, description and two intro paragraphs built from the
 * location's `prefixed` value in lib/content.ts — and every section whose data is empty is omitted.
 * Fill a field and its section appears. Fields fall back one by one: an empty `title`, `h1` or
 * `metaDescription` keeps the shared builder's string for that field only.
 *
 * Copy is Hebrew prose to the bar in docs/content-standards.md §2–§5 and §8, and carries no
 * unconfirmed business fact (docs/business-facts.md): general technical knowledge and public
 * geography stated as such, never what this business has done, guarantees or covers. UI labels
 * (headings, link frames) live in lib/content.ts (`locationPageCopy`), never here. Name a place with
 * the location's `prefixed` value (`בתל אביב`, `באזור השרון`), never a bare `ב` + name.
 */
import { faqs, visitFeeRange } from "@/lib/content";
import { serviceDepth } from "@/lib/service-depth";
import { assertInlineLinks, type InlineLink } from "@/lib/inline-links";
import type { GuideSlug } from "@/lib/guides";
import {
  locations,
  services,
  type LocationSlug,
  type ServiceSlug,
} from "@/lib/site-config";

import { city as telAviv } from "@/content/locations/תל-אביב";
import { city as jerusalem } from "@/content/locations/ירושלים";
import { city as haifa } from "@/content/locations/חיפה";
import { city as rishonLezion } from "@/content/locations/ראשון-לציון";
import { city as petahTikva } from "@/content/locations/פתח-תקווה";
import { city as netanya } from "@/content/locations/נתניה";
import { city as holon } from "@/content/locations/חולון";
import { city as kfarSaba } from "@/content/locations/כפר-סבא";
import { city as modiin } from "@/content/locations/מודיעין";
import { city as rehovot } from "@/content/locations/רחובות";
import { city as yavne } from "@/content/locations/יבנה";
import { city as ashdod } from "@/content/locations/אשדוד";
import { city as ashkelon } from "@/content/locations/אשקלון";
import { city as sharon } from "@/content/locations/שרון";

/** One local-notes section: a question-form H2 and its prose. */
export interface CityLocalNote {
  /** Question-form H2 (content-standards §4). */
  heading: string;
  paragraphs: readonly string[];
  /**
   * In-copy links. Each `anchor` must appear verbatim in one of `paragraphs` and be descriptive
   * Hebrew; each `href` is an internal site-relative path with a leading and trailing slash.
   */
  links?: readonly InlineLink[];
}

/** A short text with its own in-copy links; each anchor appears verbatim in `text`. */
export interface LinkedText {
  text: string;
  links: readonly InlineLink[];
}

/**
 * The SHORT local version of cost, process and check, shown right after the table of contents.
 * Each of the three is 15–75 words and must use THIS page's own local facts: a paragraph shared
 * between cities is the doorway pattern. Never a price ("₪" or the visit band), a timing promise
 * or a coverage claim. `cost` links to `/מחירון/`, `process` to a `/services/` page, `check` to a
 * `/services/` page or a guide.
 */
export interface CityGlance {
  heading: string;
  cost: LinkedText;
  process: LinkedText;
  check: LinkedText;
}

/** One city-specific FAQ. `q` and `a` render as the visible answer AND feed the FAQPage. */
export interface CityFaq {
  q: string;
  a: string;
}

export interface CityContent {
  /**
   * The bare <title> subject, e.g. `תיקון שערים חשמליים בתל אביב` — built on the location's
   * `prefixed`. The layout appends ` | דן שערים חשמליים` (19 characters), and titles.mjs measures the
   * RENDERED title against 60, so a bare title is at most 41 characters. Never append the brand here.
   * Empty → `locationPageTitle(prefixed)`.
   */
  title: string;
  /** The one H1; `תיקון שערים חשמליים {prefixed}` (keyword-map §4). Empty → `locationHeroTitle(prefixed)`. */
  h1: string;
  /**
   * Meta description and og:description: 150–160 characters (keyword-map §5 — titles.mjs warns only
   * outside its sitewide 120–160 band), ending on an action and terminal punctuation, unique
   * sitewide, no unconfirmed claim. חיפה, אשקלון and אזור השרון are served (owner-actions 3.6,
   * answered 2026-11-09); the answer named no other published place, so for the rest nothing beyond
   * the page's own wording is confirmed — ירושלים is still 🔶 and its answer and meta keep the bound.
   * Either way it is no booking promise: the action is a call, or the bound — check by phone whether
   * and when a visit is possible — never "נתאם" or another booking certainty.
   * Empty → `locationMetaDescription(prefixed)`.
   */
  metaDescription: string;
  /** Question-form H2 shown above `answer`. */
  answerHeading: string;
  /**
   * 40–60 words, self-contained, complete in its first sentence (content-standards §5). Rendered as
   * the FIRST paragraph inside <main>, directly under the H1 (the PageHeader subtitle and the shared
   * intro paragraphs are dropped once this is non-empty). Empty → the entry counts as NOT written and
   * the page renders today's shared copy.
   */
  answer: string;
  /**
   * The substance: three or more TRUE local items — the local gate reality, the housing stock, the
   * climate, the access pattern (content-standards §2). Rendered after the answer, one H2 each.
   */
  localNotes: readonly CityLocalNote[];
  /** Neighbourhoods, industrial zones or — for a region — towns, as a short list. Only names you are sure of. */
  neighborhoods?: readonly string[];
  /** 2–3 Q/As that would read oddly on another city's page. Each question is unique sitewide (module-load check below). */
  faqs: readonly CityFaq[];
  /**
   * The gate types this city's housing makes relevant. Rendered as links under the relevant-services
   * heading, together with every service whose `serviceDepth[slug].locations` names this city (the
   * reverse direction of the mesh), with a link out to the full list. Empty → the full list of seven.
   */
  services: readonly ServiceSlug[];
  /**
   * Optional H2 over the `nearby(slug)` links, for a page whose links the shared
   * `locationPageCopy.nearbyHeading` ("אילו ערים ואזורים קרובים?") would misdescribe: a page whose
   * list holds a far place, on either side of the pair (lib/nearby.ts) — today חיפה, נתניה, ירושלים
   * and רחובות. The route reads it for the H2, its anchor and the table of contents. A heading that
   * asks which listed place is farther needs a `nearbyNote` that answers it.
   * Question form; asks about the site's pages, never about service. Absent → the shared heading.
   */
  nearbyHeading?: string;
  /**
   * Optional sentence between `nearbyHeading` and the links, answering it: which listed places are
   * close and which listed place is the farther one, so the far place does not read as one of the close
   * ones. Geography only — never a coverage, travel or availability claim. Set it beside every
   * `nearbyHeading` that asks which listed place is farther. Absent → the links follow the H2 directly.
   */
  nearbyNote?: string;
  /** Optional (for now): the short local cost / process / check block. See `CityGlance`. */
  glance?: CityGlance;
  /**
   * Optional: guides to list on this page ahead of the reverse index, in this order
   * (`guidesForLocationPage` in lib/guides.ts). The import above is type-only: no runtime cycle.
   */
  guides?: readonly GuideSlug[];
}

export const cityContent: Record<LocationSlug, CityContent> = {
  "תל-אביב": telAviv,
  ירושלים: jerusalem,
  חיפה: haifa,
  "ראשון-לציון": rishonLezion,
  "פתח-תקווה": petahTikva,
  נתניה: netanya,
  חולון: holon,
  "כפר-סבא": kfarSaba,
  מודיעין: modiin,
  רחובות: rehovot,
  יבנה: yavne,
  אשדוד: ashdod,
  אשקלון: ashkelon,
  שרון: sharon,
};

/** Whether the entry's drafter has written it (the answer block is the gate, as on a service page). */
export function isCityWritten(content: CityContent): boolean {
  return content.answer !== "";
}

// ── module-load checks ───────────────────────────────────────────────────────
// They throw at import time, so a bad entry fails `next build` (and `npm run typecheck` consumers
// that import this file at runtime) with a message naming the city and the offending value.

/** Question text as compared for uniqueness: NFC, trimmed, whitespace collapsed. */
function normalizeQuestion(q: string): string {
  return q.normalize("NFC").trim().replace(/\s+/g, " ");
}

function validateCityContent(): void {
  const knownServices = new Set<string>(services.map((s) => s.slug.normalize("NFC")));
  // question → where it was first seen (the homepage, a service, or the owning city slug)
  const seen = new Map<string, string>();
  for (const f of faqs)
    seen.set(normalizeQuestion(f.q), "the homepage FAQ in lib/content.ts");
  for (const s of services) {
    for (const { q } of serviceDepth[s.slug].faqs) {
      seen.set(normalizeQuestion(q), `serviceDepth["${s.slug}"]`);
    }
  }

  for (const loc of locations) {
    const content = cityContent[loc.slug];
    const listed = new Set<string>();
    for (const slug of content.services) {
      if (!knownServices.has(slug.normalize("NFC"))) {
        throw new Error(
          `cityContent["${loc.slug}"].services names "${slug}", which is not a service slug in lib/site-config.ts.`,
        );
      }
      if (listed.has(slug)) {
        throw new Error(`cityContent["${loc.slug}"].services lists "${slug}" twice.`);
      }
      listed.add(slug);
    }
    const owner = `cityContent["${loc.slug}"]`;
    for (const note of content.localNotes) {
      assertInlineLinks(`${owner} note "${note.heading}"`, note.paragraphs, note.links);
    }
    const glance = content.glance;
    if (glance) {
      if (glance.heading.trim() === "")
        throw new Error(`${owner}.glance.heading is empty.`);
      for (const part of ["cost", "process", "check"] as const) {
        const { text, links } = glance[part];
        const where = `${owner}.glance.${part}`;
        const words = text.split(/\s+/).filter(Boolean).length;
        if (words < 15 || words > 75) {
          throw new Error(`${where} is ${words} words; must be 15–75.`);
        }
        if (text.includes("₪") || text.includes(visitFeeRange)) {
          throw new Error(`${where} states a figure: glance copy never carries a price.`);
        }
        assertInlineLinks(where, [text], links);
      }
      if (!glance.cost.links.some((l) => l.href === "/מחירון/")) {
        throw new Error(`${owner}.glance.cost must link to "/מחירון/".`);
      }
      if (!glance.process.links.some((l) => l.href.startsWith("/services/"))) {
        throw new Error(`${owner}.glance.process must link to a "/services/" page.`);
      }
      if (
        !glance.check.links.some(
          (l) => l.href.startsWith("/services/") || l.href.startsWith("/מדריכים/"),
        )
      ) {
        throw new Error(`${owner}.glance.check must link to a service or a guide.`);
      }
    }
    for (const { q } of content.faqs) {
      const key = normalizeQuestion(q);
      const owner = seen.get(key);
      if (owner !== undefined) {
        throw new Error(
          `cityContent["${loc.slug}"].faqs repeats the question "${q}", already used by ${owner}. Each FAQ question is unique sitewide.`,
        );
      }
      seen.set(key, `cityContent["${loc.slug}"]`);
    }
  }
}

validateCityContent();
