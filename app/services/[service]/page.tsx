import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, Phone } from "lucide-react";
import { faqJsonLd } from "@ishub/site-kit/seo";
import {
  services,
  locations,
  type ServiceSlug,
  siteConfig,
  manifest,
  telHref,
  whatsappHref,
} from "@/lib/site-config";
import {
  serviceCards,
  serviceTriggers,
  servicePageCopy,
  serviceDepthCopy,
  serviceVisitBandCopy,
  serviceVisitBandApplies,
  visitFeeRange,
  areaLinkLabel,
  serviceCtaCardTitle,
  serviceWhatsappMessage,
  crumbLabels,
} from "@/lib/content";
import { serviceDepth, serviceProcessSteps } from "@/lib/service-depth";
import { getPost } from "@/lib/posts";
import { guidesForService } from "@/lib/guides";
import { buildToc, headingId } from "@/lib/toc";
import { relatedAttr } from "@/lib/engagement";
import { ogBase, routeUrl } from "@/lib/seo";
import { businessNode, serviceNode, type JsonLd } from "@/lib/jsonld";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Toc } from "@/components/ui/Toc";
import { RelatedGuides } from "@/components/article/chrome";
import { Faq } from "@/components/marketing/Faq";
import { ContentSections } from "@/components/marketing/ContentSections";
import { FamilyLinks } from "@/components/marketing/FamilyLinks";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { service: ServiceSlug }[] {
  return services.map((s) => ({ service: s.slug }));
}

/** Match the route param against a slug, tolerant of URL-encoding + Unicode normalization
 *  (Hebrew dynamic segments arrive percent-encoded during static export). */
function findCard(param: string) {
  const target = decodeURIComponent(param).normalize("NFC");
  return serviceCards.find((c) => c.slug.normalize("NFC") === target);
}

const linkCardClass =
  "flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary";

export function generateMetadata({ params }: { params: { service: string } }): Metadata {
  const card = findCard(params.service);
  if (!card) return {};
  const url = routeUrl(`services/${card.slug}`);
  // The meta line is its own field: `description` is the page's unique paragraph, not a snippet.
  const description = serviceDepth[card.slug].metaDescription;
  return {
    alternates: { canonical: url },
    // Bare subject only — app/layout.tsx already appends "| דן שערים חשמליים" via the
    // title template. Appending it here too is what shipped the doubled suffix on 25 pages.
    title: card.name,
    description,
    openGraph: { ...ogBase, url, title: card.name, description },
  };
}

export default function ServicePage({ params }: { params: { service: string } }) {
  const card = findCard(params.service);
  if (!card) notFound();

  const depth = serviceDepth[card.slug];
  // An entry with an empty answer keeps the card's paragraph and tagline in its place.
  const hasAnswer = depth.answer !== "";
  const triggers = serviceTriggers[card.slug];

  // Declared relevance, never array order.
  const related = depth.relatedServices.flatMap(
    (slug) => serviceCards.find((c) => c.slug === slug) ?? [],
  );
  const cities = depth.locations.flatMap(
    (slug) => locations.find((l) => l.slug === slug) ?? [],
  );
  const relatedPosts = depth.relatedPosts.flatMap((slug) => getPost(slug) ?? []);
  // The reverse index: every guide that declares this service appears here, nothing to edit by hand.
  const guides = guidesForService(card.slug);

  // The table of contents: every H2 of the article column after the answer block, in page order,
  // gated on the prose length the column renders (lib/toc.ts).
  const faqHeading = serviceDepthCopy.faqHeading(card.name);
  const upfront = [depth.upfront.cost, depth.upfront.check, depth.upfront.ask];
  const steps = serviceProcessSteps(depth);
  const tocHeadings = [
    ...upfront.map((section) => section.heading),
    servicePageCopy.processHeading,
    ...depth.sections.map((section) => section.heading),
    servicePageCopy.triggersHeading,
    ...(depth.caveats.length > 0 ? [serviceDepthCopy.caveatsHeading] : []),
    ...(depth.faqs.length > 0 ? [{ id: "faq", text: faqHeading }] : []),
  ];
  const toc = buildToc(tocHeadings, [
    hasAnswer ? depth.answerHeading : "",
    hasAnswer ? depth.answer : card.description,
    ...[...upfront, ...depth.sections].flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.list ?? []),
    ]),
    servicePageCopy.processHeading,
    ...steps.flatMap((step) => [step.title, step.body]),
    servicePageCopy.triggersHeading,
    ...triggers,
    ...depth.caveats,
    ...depth.faqs.flatMap(({ q, a }) => [q, a]),
  ]);

  // Handed to PageHeader, which renders them with the page's breadcrumb as ONE @graph. The
  // business node rides along because the Service's `provider` points at it. The FAQPage joins
  // only when the entry has questions, and carries exactly the { q, a } the <Faq> below shows.
  const nodes: JsonLd[] = [
    businessNode(manifest),
    serviceNode(manifest, {
      name: card.name,
      description: card.description,
      slug: card.slug,
    }),
    ...(depth.faqs.length > 0
      ? [faqJsonLd(depth.faqs.map(({ q, a }) => ({ q, a })))]
      : []),
  ];

  return (
    <>
      <PageHeader
        title={card.name}
        // Once written, the answer block below is the first paragraph in <main>, so the tagline
        // (a second paragraph above it) steps aside. A stub keeps it.
        subtitle={hasAnswer ? undefined : card.tagline}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.services, href: "/שירותים/" },
          { label: card.name, href: `/services/${card.slug}/` },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hasAnswer ? (
              <>
                <h2 className="font-heading text-xl font-bold text-primary">
                  {depth.answerHeading}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-gray-700">
                  {depth.answer}
                </p>
              </>
            ) : (
              <p className="text-lg leading-relaxed text-gray-700">{card.description}</p>
            )}

            <Toc items={toc} />

            <ContentSections sections={upfront} />

            <h2
              id={headingId(servicePageCopy.processHeading)}
              className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
            >
              {servicePageCopy.processHeading}
            </h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">
                    <strong className="text-primary">{step.title}.</strong> {step.body}
                  </span>
                </li>
              ))}
            </ol>

            {hasAnswer && (
              <p className="mt-6 text-gray-700">
                {serviceVisitBandApplies[card.slug] ? (
                  <>
                    {serviceVisitBandCopy.before(card.name)}
                    <span className="ltr">{visitFeeRange}</span>
                    {serviceVisitBandCopy.after}
                  </>
                ) : (
                  serviceVisitBandCopy.withoutBand
                )}
                <Link
                  href={serviceVisitBandCopy.href}
                  className="font-semibold text-secondary underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  {serviceVisitBandCopy.linkLabel}
                </Link>
              </p>
            )}

            <ContentSections sections={depth.sections} />

            <h2
              id={headingId(servicePageCopy.triggersHeading)}
              className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
            >
              {servicePageCopy.triggersHeading}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {triggers.map((t) => (
                <li key={t} className="flex items-start gap-2 text-gray-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>

            {depth.caveats.length > 0 && (
              <>
                <h2
                  id={headingId(serviceDepthCopy.caveatsHeading)}
                  className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
                >
                  {serviceDepthCopy.caveatsHeading}
                </h2>
                <ul className="mt-4 list-disc space-y-2 ps-6 text-gray-700">
                  {depth.caveats.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </>
            )}

            {depth.faqs.length > 0 && (
              <div className="mt-10">
                <Faq
                  items={depth.faqs}
                  heading={faqHeading}
                  id="faq"
                  name={serviceDepthCopy.faqGroupName}
                  className="mx-0 mt-5 max-w-none"
                />
              </div>
            )}
          </div>

          {/* Sticky CTA card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <p className="font-heading text-lg font-bold text-primary">
                {serviceCtaCardTitle(card.name)}
              </p>
              <p className="mt-1 text-sm text-gray-600">{servicePageCopy.ctaSubtitle}</p>
              <div className="mt-5 flex flex-col gap-3">
                <Button href={telHref} data-cta="service-call" variant="accent" size="lg">
                  <Phone className="h-5 w-5" aria-hidden />
                  <span dir="ltr">{siteConfig.phone}</span>
                </Button>
                <Button
                  href={whatsappHref(serviceWhatsappMessage(card.name))}
                  data-cta="service-whatsapp"
                  variant="whatsapp"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {servicePageCopy.whatsappLabel}
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related services, cities and posts — declared per service in lib/service-depth.ts */}
        <div className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="font-heading text-xl font-bold text-primary">
            {serviceDepthCopy.relatedServicesHeading}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}/`}
                  className={linkCardClass}
                  {...relatedAttr("service")}
                >
                  {o.name}
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>

          {cities.length > 0 && (
            <>
              <h2 className="mt-10 font-heading text-xl font-bold text-primary">
                {serviceDepthCopy.locationsHeading}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/locations/${c.slug}/`}
                      className={linkCardClass}
                      {...relatedAttr("location")}
                    >
                      {areaLinkLabel(c.prefixed)}
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {relatedPosts.length > 0 && (
            <>
              <h2 className="mt-10 font-heading text-xl font-bold text-primary">
                {serviceDepthCopy.relatedPostsHeading}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {relatedPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}/`}
                      className={linkCardClass}
                      {...relatedAttr("post")}
                    >
                      {post.title}
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <RelatedGuides guides={guides} className="mt-10" />

          <FamilyLinks current={{ kind: "service", slug: card.slug }} className="mt-10" />
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
