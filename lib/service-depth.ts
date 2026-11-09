/**
 * service-depth.ts — the per-service depth model that app/services/[service]/page.tsx renders
 * (backlog §3.2, `.claude/skills/new-service`). One typed entry per service, written in its own
 * module under content/services/<slug>.ts (`export const depth: ServiceDepth`) so seven drafters
 * can work in parallel without touching one file. This file only types, assembles and checks them.
 *
 * `serviceDepth` is a total `Record<ServiceSlug, ServiceDepth>`: adding a service to
 * lib/site-config.ts without an entry here fails `npm run typecheck`.
 *
 * An entry whose `answer` is empty falls back to `serviceCards[].description` and the card's
 * tagline; every section whose data is empty is omitted. Fill a field and its section appears.
 *
 * Copy is Hebrew prose to the bar in docs/content-standards.md §3–§5 and carries no unconfirmed
 * business fact (docs/business-facts.md). UI labels (headings, link frames) live in lib/content.ts
 * (`serviceDepthCopy`, `serviceVisitBandCopy`), never here.
 */
import { faqs } from "@/lib/content";
import { posts } from "@/lib/posts";
import type { LocationSlug, ServiceSlug } from "@/lib/site-config";

import { depth as gateSliding } from "@/content/services/שערים-נגררים";
import { depth as gateSwing } from "@/content/services/שערי-כנף";
import { depth as gateSectional } from "@/content/services/שערים-מתרוממים";
import { depth as gateParking } from "@/content/services/שערים-לחניה";
import { depth as gateBarrier } from "@/content/services/שער-זרוע";
import { depth as shutters } from "@/content/services/תריסי-גלילה-חשמליים";
import { depth as gateResidential } from "@/content/services/שערים-לדירה";

/** One mechanism section: a question-form H2, prose, and an optional bulleted list after it. */
export interface ServiceDepthSection {
  /** Question-form H2 (content-standards §4). */
  heading: string;
  paragraphs: readonly string[];
  /** Rendered as a bulleted list after the paragraphs. */
  list?: readonly string[];
}

/** One service-specific FAQ. `q` and `a` render as the visible answer AND feed the FAQPage. */
export interface ServiceDepthFaq {
  q: string;
  a: string;
}

export interface ServiceDepth {
  /** Question-form H2 shown above `answer`. Empty → the route shows the card's paragraph. */
  answerHeading: string;
  /**
   * 40–60 words: what this service is and who it is for. Rendered as the FIRST paragraph inside
   * <main>, directly under the H1 (the PageHeader tagline is dropped once this is non-empty).
   * Empty → the route shows `serviceCards[].description` instead.
   */
  answer: string;
  /** Meta description and og:description: 120–160 chars, terminal punctuation. */
  metaDescription: string;
  /** Mechanism sections, rendered after the answer block. Question-form H2s. */
  sections: readonly ServiceDepthSection[];
  /** When this gate type is the wrong answer; what shortens motor life. One short bullet each. */
  caveats: readonly string[];
  /** 3–5 service-specific Q/As. Each question is unique sitewide (module-load check below). */
  faqs: readonly ServiceDepthFaq[];
  /** 2–4 services by relevance, never the service itself. */
  relatedServices: readonly ServiceSlug[];
  /** 4–6 locations from the published list; an unconfirmed region is never chosen to fill the count. */
  locations: readonly LocationSlug[];
  /** 1–3 slugs of existing posts in lib/posts.ts. */
  relatedPosts: readonly string[];
}

export const serviceDepth: Record<ServiceSlug, ServiceDepth> = {
  "שערים-נגררים": gateSliding,
  "שערי-כנף": gateSwing,
  "שערים-מתרוממים": gateSectional,
  "שערים-לחניה": gateParking,
  "שער-זרוע": gateBarrier,
  "תריסי-גלילה-חשמליים": shutters,
  "שערים-לדירה": gateResidential,
};

// ── module-load checks ───────────────────────────────────────────────────────
// They throw at import time, so a bad entry fails `next build` (and `npm run typecheck` consumers
// that import this file at runtime) with a message naming the service and the offending value.

/** Question text as compared for uniqueness: NFC, trimmed, whitespace collapsed. */
function normalizeQuestion(q: string): string {
  return q.normalize("NFC").trim().replace(/\s+/g, " ");
}

function validateServiceDepth(): void {
  const postSlugs = new Set(posts.map((p) => p.slug.normalize("NFC")));
  // question → where it was first seen ("home" or the owning service slug)
  const seen = new Map<string, string>();
  for (const f of faqs)
    seen.set(normalizeQuestion(f.q), "the homepage FAQ in lib/content.ts");

  const entries = Object.entries(serviceDepth) as [ServiceSlug, ServiceDepth][];
  for (const [slug, depth] of entries) {
    if (depth.relatedServices.includes(slug)) {
      throw new Error(
        `serviceDepth["${slug}"].relatedServices lists the service itself — a page never relates to itself.`,
      );
    }
    const relatedSeen = new Set<string>();
    for (const rel of depth.relatedServices) {
      if (relatedSeen.has(rel)) {
        throw new Error(`serviceDepth["${slug}"].relatedServices lists "${rel}" twice.`);
      }
      relatedSeen.add(rel);
    }
    for (const postSlug of depth.relatedPosts) {
      if (!postSlugs.has(postSlug.normalize("NFC"))) {
        throw new Error(
          `serviceDepth["${slug}"].relatedPosts names "${postSlug}", which is not a post slug in lib/posts.ts.`,
        );
      }
    }
    for (const { q } of depth.faqs) {
      const key = normalizeQuestion(q);
      const owner = seen.get(key);
      if (owner !== undefined) {
        throw new Error(
          `serviceDepth["${slug}"].faqs repeats the question "${q}", already used by ${owner}. Each FAQ question is unique sitewide.`,
        );
      }
      seen.set(key, `serviceDepth["${slug}"]`);
    }
  }
}

validateServiceDepth();
