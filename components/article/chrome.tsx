import Link from "next/link";
import { CalendarDays, ChevronLeft, Clock } from "lucide-react";
import { familyPillar, headingId, pillarLabels, type Guide } from "@/lib/guide-types";
import { relatedAttr, type RelatedKind } from "@/lib/engagement";
import { guidePath, readingMinutes } from "@/lib/guides";
import { guidesCopy } from "@/lib/content";
import type { PlacedImage } from "@/lib/images";
import { Figure } from "@/components/images/Figure";

/** Israeli display format (CLAUDE.md §6); the machine-readable value stays ISO in `dateTime`. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const linkCardClass =
  "flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary";

/**
 * Freshness, and reading time when the caller has one. Dates are facts this repo owns and ship
 * today. There is no byline: no person is coming (business-facts §B), and the business is already
 * the publisher on the Article node — an invented byline is a worse trust signal than none.
 * Shared by the guides (`GuideView`) and the blog posts (`app/blog/[slug]`): the revised date shows
 * only when it differs from the publish date, so an unrevised article shows the publish date alone.
 */
export function ArticleMeta({
  datePublished,
  dateModified,
  minutes,
}: {
  /** ISO `YYYY-MM-DD`. */
  datePublished: string;
  /** ISO `YYYY-MM-DD`; equal to `datePublished` when the article was never revised. */
  dateModified: string;
  /** Reading time in minutes; omitted → no reading-time item. */
  minutes?: number;
}) {
  const revised = dateModified !== datePublished;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
      <span className="flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4" aria-hidden />
        <span>
          {guidesCopy.published}{" "}
          <time dateTime={datePublished}>{formatDate(datePublished)}</time>
        </span>
      </span>
      {revised && (
        <span>
          {guidesCopy.updated}{" "}
          <time dateTime={dateModified}>{formatDate(dateModified)}</time>
        </span>
      )}
      {minutes !== undefined && (
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden />
          {guidesCopy.readingMinutes(minutes)}
        </span>
      )}
    </div>
  );
}

/** The "מקורות" list: every external fact the copy cites, with its URL. Nothing for an empty list. */
export function SourcesList({ sources }: { sources: Guide["sources"] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-10">
      <h2
        id={headingId(guidesCopy.sourcesHeading)}
        className="scroll-mt-24 font-heading text-xl font-bold text-primary"
      >
        {guidesCopy.sourcesHeading}
      </h2>
      <ul className="mt-4 list-disc space-y-2 ps-6 text-gray-700">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              rel="noopener"
              className="font-semibold text-secondary underline underline-offset-4 hover:text-primary"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hub grid card. */
export function GuideCard({
  guide,
  thumb,
  priority = false,
}: {
  guide: Guide;
  /** The guide's lead image; its derived thumbnail shows at the start side. Absent → text only. */
  thumb?: PlacedImage;
  /** True only for the first card that shows a thumbnail: the page's single eager image. */
  priority?: boolean;
}) {
  return (
    <li>
      <Link
        href={guidePath(guide.slug)}
        className="flex h-full gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-secondary"
      >
        {thumb?.thumb && (
          <Figure
            image={thumb}
            thumbnail
            caption={false}
            priority={priority}
            className="w-24 shrink-0 sm:w-32"
          />
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-semibold text-accent-600">
            {pillarLabels[familyPillar[guide.family]]}
          </span>
          <span className="mt-2 font-heading text-lg font-bold text-primary">
            {guide.title}
          </span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
            {guide.description}
          </span>
          <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-secondary">
            {guidesCopy.cardCta}
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * A heading over a grid of link cards. Renders NOTHING for an empty list, so the reverse index on a
 * service or location page, and the related blocks on a guide, vanish while the registry is empty.
 */
export function LinkCardList({
  heading,
  links,
  kind,
  columns = 2,
  className,
}: {
  heading: string;
  links: readonly { href: string; label: string }[];
  /** What the cards point at; the engagement leaf reports it on `related_click`. */
  kind: RelatedKind;
  columns?: 2 | 3;
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className={className}>
      <h2 className="font-heading text-xl font-bold text-primary">{heading}</h2>
      <ul
        className={
          columns === 3
            ? "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            : "mt-5 grid gap-3 sm:grid-cols-2"
        }
      >
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={linkCardClass} {...relatedAttr(kind)}>
              {l.label}
              <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The reverse index as a `LinkCardList`: guides in, "מדריכים קשורים" out; empty → nothing. */
export function RelatedGuides({
  guides,
  className,
}: {
  guides: readonly Guide[];
  className?: string;
}) {
  return (
    <LinkCardList
      heading={guidesCopy.reverseIndexHeading}
      links={guides.map((g) => ({ href: guidePath(g.slug), label: g.title }))}
      kind="guide"
      className={className}
    />
  );
}
