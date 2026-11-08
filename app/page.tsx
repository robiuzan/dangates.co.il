import type { Metadata } from "next";
import { manifest } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { faqs, homeMetaDescription, homeFaqHeading } from "@/lib/content";
import { faqJsonLd, jsonLdScript } from "@ishub/site-kit/seo";
import { businessNode, graph, websiteJsonLd } from "@/lib/jsonld";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { WhyUs } from "@/components/marketing/WhyUs";
import { Process } from "@/components/marketing/Process";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { ServiceAreas } from "@/components/marketing/ServiceAreas";
import { Reviews } from "@/components/marketing/Reviews";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { LiveUpdates } from "@/components/live/Live";

/**
 * The homepage previously exported no metadata at all, so it fell back to the layout's
 * `description: siteConfig.tagline` — 34 characters on the site's most important page.
 * The title still comes from the layout's `title.default`; only the description is set here.
 */
const description = homeMetaDescription;

export const metadata: Metadata = {
  description,
  openGraph: { ...ogBase, url: routeUrl(""), description },
};

// One @graph: the business, the WebSite that names it as publisher, and the visible FAQ. The
// homepage has no PageHeader, so it renders the single script itself (lib/jsonld.ts).
const jsonLd = graph(
  businessNode(manifest),
  websiteJsonLd(manifest),
  faqJsonLd([...faqs]),
);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Hero />
      <TrustBar />
      {/* The updates strip (fleet live-kit, content/live/_updates.mjs — CLAUDE.md §14).
          Server-rendered, and hidden before first paint once its newest item is 45 days old —
          no layout shift. It never moves the sitemap <lastmod>. */}
      <LiveUpdates />
      <ServicesGrid />
      <WhyUs />
      <Process />
      <PricingTeaser />
      <ServiceAreas />
      <Reviews />

      <Section id="faq" tone="white">
        <SectionHeading eyebrow={homeFaqHeading.eyebrow} title={homeFaqHeading.title} />
        <Faq items={faqs} />
      </Section>

      <FinalCta />
    </>
  );
}
