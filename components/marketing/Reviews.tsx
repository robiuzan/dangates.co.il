import { Star } from "lucide-react";
import { manifest } from "@/lib/site-config";
import { reviews, REVIEW_AVG, REVIEW_COUNT, REVIEW_SOURCE_URL } from "@/lib/content";
import { jsonLdScript } from "@ishub/site-kit/seo";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Fills `count` of 5 stars. The remainder render greyed — a 4★ review must not look like 5★. */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} מתוך 5 כוכבים`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < count ? "fill-accent-400 text-accent-400" : "fill-gray-200 text-gray-200",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

/**
 * Customer reviews.
 *
 * Renders NOTHING — and emits no Review/AggregateRating markup — unless real reviews are
 * present AND quoted from a verifiable public profile (REVIEW_SOURCE_URL). Both are empty
 * today, so this section is absent from the page by design.
 *
 * The previous version shipped ten authored testimonials under ten real reviewers' names
 * plus AggregateRating 5.0/10, with schema.sameAs empty so nothing corroborated it. That is
 * a Google policy violation; it was removed 2026-08-17. The guard below is what stops it
 * coming back by accident. See lib/content.ts and docs/business-facts.md §A.
 */
export function Reviews() {
  if (reviews.length === 0 || !REVIEW_SOURCE_URL || !REVIEW_AVG) return null;

  // AggregateRating + Review, attached to the LocalBusiness node via its @id (NOT a Product).
  const reviewsJsonLd = {
    "@context": "https://schema.org",
    "@type": manifest.schema?.type ?? "LocalBusiness",
    "@id": `${manifest.url}/#business`,
    name: manifest.brandName ?? undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: REVIEW_AVG,
      reviewCount: REVIEW_COUNT,
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
      url: REVIEW_SOURCE_URL,
    })),
  };

  return (
    <Section id="reviews" tone="muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(reviewsJsonLd) }}
      />
      <SectionHeading
        eyebrow="לקוחות ממליצים"
        title="מה הלקוחות שלנו אומרים"
        subtitle={`דירוג ${REVIEW_AVG} מתוך 5 על סמך ${REVIEW_COUNT} ביקורות של לקוחות מרוצים.`}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 0.06}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Stars count={r.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-700">
                ״{r.text}״
              </blockquote>
              <figcaption className="mt-5 border-t border-gray-100 pt-4">
                <span className="block font-heading font-bold text-primary">
                  {r.name}
                </span>
                <span className="block text-sm text-gray-500">{r.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
