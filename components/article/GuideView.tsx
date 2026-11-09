/**
 * GuideView — the page body of /מדריכים/[slug]/, kept as a component because Next's static export
 * refuses a dynamic route whose `generateStaticParams()` is empty ("missing generateStaticParams"):
 * the route file `app/מדריכים/[slug]/page.tsx` is created by the integrate step, together with the
 * first registered guide, and is then only this wrapper (Hebrew params arrive percent-encoded, so it
 * matches with `findGuide`, which decodes and NFC-normalises):
 *
 *   import { notFound } from "next/navigation";
 *   import type { Metadata } from "next";
 *   import { findGuide, guideList } from "@/lib/guides";
 *   import { GuideView, guideMetadata } from "@/components/article/GuideView";
 *
 *   export function generateStaticParams(): { slug: string }[] {
 *     return guideList.map((g) => ({ slug: g.slug }));
 *   }
 *   export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
 *     const g = findGuide(params.slug);
 *     return g ? guideMetadata(g) : {};
 *   }
 *   export default function GuidePage({ params }: { params: { slug: string } }) {
 *     const g = findGuide(params.slug);
 *     if (!g) notFound();
 *     return <GuideView guide={g} />;
 *   }
 *
 * Emits ONE @graph through PageHeader: the business node, the TechArticle / Article (Organization
 * author and publisher → #business, `dateModified` from the guide), the FAQPage when faq blocks
 * exist, and the one BreadcrumbList PageHeader appends.
 */
import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { faqJsonLd } from "@ishub/site-kit/seo";
import {
  locations,
  manifest,
  services,
  siteConfig,
  telHref,
  whatsappHref,
} from "@/lib/site-config";
import { areaLinkLabel, guideWhatsappMessage, guidesCopy } from "@/lib/content";
import { ogBase, routeUrl } from "@/lib/seo";
import { articleJsonLd, businessNode, type JsonLd } from "@/lib/jsonld";
import { schemaTypeFor, type Guide } from "@/lib/guide-types";
import { findGuide, guideList, guidePath, relatedGuidesOf } from "@/lib/guides";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleMeta, LinkCardList, SourcesList } from "@/components/article/chrome";
import { FinalCta } from "@/components/marketing/FinalCta";

/**
 * A source URL as the graph carries it: percent-encoded when it holds raw Hebrew (schema.mjs fails a
 * raw one), untouched when it is already ASCII so an existing escape is never doubled.
 */
function schemaSourceUrl(url: string): string {
  return /[^ -~]/.test(url) ? encodeURI(url) : url;
}

/** The route's `generateMetadata` result for a guide. */
export function guideMetadata(g: Guide): Metadata {
  const url = routeUrl(`מדריכים/${g.slug}`);
  return {
    alternates: { canonical: url },
    // Bare title — app/layout.tsx appends "| דן שערים חשמליים" via the template.
    title: g.title,
    description: g.description,
    // `openGraph` is replaced wholesale, not merged: spread `ogBase` or the guide loses its image.
    openGraph: {
      ...ogBase,
      type: "article",
      url,
      title: g.title,
      description: g.description,
      publishedTime: g.datePublished,
      modifiedTime: g.dateModified,
    },
  };
}

/** The whole guide page for one registered guide: header, body, aside, related blocks, final CTA. */
export function GuideView({ guide: g }: { guide: Guide }) {
  // The FAQPage is derived from the guide's own faq blocks, so the schema cannot drift from the
  // visible <details>. Only emitted when there is a visible Q&A to back it.
  const faqItems = g.blocks.flatMap((b) =>
    b.kind === "faq" ? b.items.map(({ q, a }) => ({ q, a })) : [],
  );

  // One @graph: the business (author and publisher point at it), the article, the FAQPage. The
  // BreadcrumbList is appended by PageHeader from the same `crumbs` it renders.
  const nodes: JsonLd[] = [
    businessNode(manifest),
    articleJsonLd(manifest, {
      type: schemaTypeFor[g.family],
      path: guidePath(g.slug),
      headline: g.title,
      description: g.description,
      datePublished: g.datePublished,
      dateModified: g.dateModified,
      isPartOf: { path: "/מדריכים/", name: guidesCopy.hubTitle, type: "CollectionPage" },
      citation: (g.sources ?? []).map((s) => ({
        name: s.label,
        url: schemaSourceUrl(s.url),
      })),
    }),
    ...(faqItems.length > 0 ? [faqJsonLd(faqItems)] : []),
  ];

  const serviceLinks = g.relatedServices.flatMap((slug) => {
    const s = services.find((x) => x.slug === slug);
    return s ? [{ href: `/services/${s.slug}/`, label: s.name }] : [];
  });
  const locationLinks = (g.relatedLocations ?? []).flatMap((slug) => {
    const l = locations.find((x) => x.slug === slug);
    return l ? [{ href: `/locations/${l.slug}/`, label: areaLinkLabel(l.prefixed) }] : [];
  });
  const moreGuides = relatedGuidesOf(g).map((o) => ({
    href: guidePath(o.slug),
    label: o.title,
  }));

  return (
    <>
      <PageHeader
        title={g.title}
        nodes={nodes}
        crumbs={[
          { label: "בית", href: "/" },
          { label: guidesCopy.crumbLabel, href: "/מדריכים/" },
          // The last crumb carries an href so the BreadcrumbList ends at this page.
          { label: g.crumbLabel ?? g.title, href: guidePath(g.slug) },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ArticleMeta guide={g} />
            <div className="mt-6">
              <ArticleBody blocks={g.blocks} guideTitle={g.title} />
              <SourcesList sources={g.sources} />
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <p className="font-heading text-lg font-bold text-primary">
                {guidesCopy.asideTitle}
              </p>
              <p className="mt-1 text-sm text-gray-600">{guidesCopy.asideSubtitle}</p>
              <div className="mt-5 flex flex-col gap-3">
                <Button
                  href={telHref}
                  data-cta="article-aside-call"
                  variant="accent"
                  size="lg"
                >
                  <Phone className="h-5 w-5" aria-hidden />
                  <span dir="ltr">{siteConfig.phone}</span>
                </Button>
                <Button
                  href={whatsappHref(guideWhatsappMessage(g.title))}
                  data-cta="article-aside-whatsapp"
                  variant="whatsapp"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {guidesCopy.whatsappLabel}
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* body → services → locations → more guides → FinalCta (engagement-ux exit order) */}
        <div className="mt-14 border-t border-gray-100 pt-10">
          <LinkCardList
            heading={guidesCopy.relatedServicesHeading}
            links={serviceLinks}
            columns={3}
          />
          <LinkCardList
            className="mt-10"
            heading={guidesCopy.relatedLocationsHeading}
            links={locationLinks}
            columns={3}
          />
          <LinkCardList
            className="mt-10"
            heading={guidesCopy.moreGuidesHeading}
            links={moreGuides}
          />
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
