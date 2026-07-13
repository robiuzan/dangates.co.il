import { Star } from "lucide-react";
import { manifest } from "@/lib/site-config";
import { reviews, REVIEW_AVG, REVIEW_COUNT } from "@/lib/content";
import { jsonLdScript } from "@ishub/site-kit/seo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} מתוך 5 כוכבים`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-accent-400 text-accent-400"
          aria-hidden
        />
      ))}
    </div>
  );
}

/**
 * AggregateRating + Review JSON-LD, attached to the LocalBusiness node via its @id
 * (NOT modeled as a Product). Rating = 5.0 based on 10 reviews (live-site audit).
 */
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
  })),
};

export function Reviews() {
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
