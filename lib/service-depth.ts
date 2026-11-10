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
import { faqs, processSteps, visitFeeRange } from "@/lib/content";
import { assertInlineLinks, type InlineLink } from "@/lib/inline-links";
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
  /**
   * In-copy links. Each `anchor` must appear verbatim in this section's paragraphs or list items and
   * be descriptive Hebrew (never "כאן"); each `href` is an internal site-relative path with a leading
   * and trailing slash. The renderer links the first occurrence of an anchor in a paragraph.
   */
  links?: readonly InlineLink[];
  /**
   * An optional citable table rendered after the list. Needs a visible `caption`, a `head`, and rows
   * with exactly `head.length` cells each. Facts only: no price, no timing promise.
   */
  table?: ServiceDepthTable;
}

/** A captioned table inside a depth section (checked at module load). */
export interface ServiceDepthTable {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
}

/**
 * The three up-front sections a visitor reads before the process: what sets the cost, what to
 * check, what to ask. Rendered ahead of the process list, in this order.
 *
 * Copy rules: `cost` explains what determines the price and links to `/מחירון/`, never a figure,
 * never "₪" or the visit-fee band; `check` is what the owner can look at before calling; `ask` is a
 * list of at least 3 questions to put to whoever quotes the work. Work on the mains supply reads as
 * an electrician's job, never this business's.
 */
export interface ServiceUpfront {
  cost: ServiceDepthSection;
  check: ServiceDepthSection;
  ask: ServiceDepthSection;
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
  /** 4–6 locations from the published list; the שרון region is never chosen to fill the count. */
  locations: readonly LocationSlug[];
  /** 1–3 slugs of existing posts in lib/posts.ts. */
  relatedPosts: readonly string[];
  /**
   * Optional (for now): the cost / check / ask sections shown between the table of contents and the
   * process list. See `ServiceUpfront` for the rules the copy follows. Absent: the page shows none.
   */
  upfront?: ServiceUpfront;
  /**
   * Optional: the one process step specific to this gate type, inserted directly after the shared
   * step titled "אבחון והסבר". A title and a body in the shape of `processSteps`; no promise of
   * timing, price or availability.
   */
  processStep?: { title: string; body: string };
  /**
   * Optional: a replacement body for a shared process step that is false for this service, keyed by
   * the step's title in `processSteps`. Same rules as `processStep`.
   */
  processStepBodies?: Partial<Record<(typeof processSteps)[number]["title"], string>>;
}

/**
 * The process list for one service's page: the shared `processSteps` with any body replaced from
 * `processStepBodies`, and `processStep` inserted directly after the "אבחון והסבר" step.
 */
export function serviceProcessSteps(
  depth: ServiceDepth,
): { title: string; body: string }[] {
  const steps: { title: string; body: string }[] = [];
  for (const step of processSteps) {
    steps.push({
      title: step.title,
      body: depth.processStepBodies?.[step.title] ?? step.body,
    });
    if (step.title === "אבחון והסבר" && depth.processStep) steps.push(depth.processStep);
  }
  return steps;
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

function checkTable(where: string, table: ServiceDepthTable | undefined): void {
  if (!table) return;
  if (table.caption.trim() === "")
    throw new Error(`${where}: a table needs a visible caption.`);
  if (table.head.length === 0 || table.rows.length === 0) {
    throw new Error(`${where}: a table needs a head and rows.`);
  }
  for (const row of table.rows) {
    if (row.length !== table.head.length) {
      throw new Error(
        `${where}: a table row has ${row.length} cells but the head has ${table.head.length}.`,
      );
    }
  }
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
    const owner = `serviceDepth["${slug}"]`;
    const prose = (sec: ServiceDepthSection): string[] => [
      ...sec.paragraphs,
      ...(sec.list ?? []),
    ];
    for (const sec of depth.sections) {
      assertInlineLinks(`${owner} section "${sec.heading}"`, prose(sec), sec.links);
      checkTable(`${owner} section "${sec.heading}"`, sec.table);
    }
    if (depth.upfront) {
      const { cost, check, ask } = depth.upfront;
      for (const [name, sec] of [
        ["cost", cost],
        ["check", check],
        ["ask", ask],
      ] as const) {
        const where = `${owner}.upfront.${name}`;
        assertInlineLinks(where, prose(sec), sec.links);
        checkTable(where, sec.table);
        for (const text of [sec.heading, ...prose(sec)]) {
          if (text.includes("₪") || text.includes(visitFeeRange)) {
            throw new Error(
              `${where} states a figure ("${text}"): upfront copy never carries a price.`,
            );
          }
        }
      }
      if (!cost.links?.some((l) => l.href === "/מחירון/")) {
        throw new Error(`${owner}.upfront.cost must link to "/מחירון/".`);
      }
      if ((ask.list?.length ?? 0) < 3) {
        throw new Error(`${owner}.upfront.ask.list needs at least 3 questions.`);
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
