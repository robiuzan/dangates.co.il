import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { faqJsonLd } from "@ishub/site-kit/seo";
import { locations, manifest, type LocationSlug } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import {
  serviceCards,
  areaLinkLabel,
  crumbLabels,
  locationPageTitle,
  locationMetaDescription,
  locationHeroTitle,
  locationHeroSubtitle,
  locationIntroParagraph1,
  locationIntroParagraph2,
  locationServicesHeading,
  locationServiceType,
  locationPageCopy,
} from "@/lib/content";
import { cityContent, isCityWritten } from "@/lib/city-content";
import { nearby } from "@/lib/nearby";
import { guidesForLocationPage } from "@/lib/guides";
import { buildToc, headingId, type TocHeading } from "@/lib/toc";
import { relatedAttr } from "@/lib/engagement";
import { serviceDepth } from "@/lib/service-depth";
import { businessNode, locationServiceJsonLd, type JsonLd } from "@/lib/jsonld";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Toc } from "@/components/ui/Toc";
import { RelatedGuides } from "@/components/article/chrome";
import { Faq } from "@/components/marketing/Faq";
import {
  AnswerBlock,
  BulletedBlock,
  CityGlanceBlock,
  ContentSections,
} from "@/components/marketing/ContentSections";
import { FamilyLinks } from "@/components/marketing/FamilyLinks";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { city: LocationSlug }[] {
  return locations.map((c) => ({ city: c.slug }));
}

/** Match the route param against a slug, tolerant of URL-encoding + Unicode normalization
 *  (Hebrew dynamic segments arrive percent-encoded during static export). */
function findLocation(param: string) {
  const target = decodeURIComponent(param).normalize("NFC");
  return locations.find((c) => c.slug.normalize("NFC") === target);
}

const linkCardClass =
  "flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary";

/**
 * Title, H1 and description: the city's own strings once written, the shared builders (switched to
 * the entry's `prefixed`) for any field still empty. One function, so the metadata, the H1 and the
 * `Service` node's name cannot drift apart.
 */
function pageStrings(loc: NonNullable<ReturnType<typeof findLocation>>) {
  const content = cityContent[loc.slug];
  return {
    title: content.title !== "" ? content.title : locationPageTitle(loc.prefixed),
    h1: content.h1 !== "" ? content.h1 : locationHeroTitle(loc.prefixed),
    description:
      content.metaDescription !== ""
        ? content.metaDescription
        : locationMetaDescription(loc.prefixed),
  };
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const loc = findLocation(params.city);
  if (!loc) return {};
  const url = routeUrl(`locations/${loc.slug}`);
  const { title, description } = pageStrings(loc);
  return {
    alternates: { canonical: url },
    // Bare subject only — app/layout.tsx already appends "| דן שערים חשמליים" via the
    // title template. Appending it here too is what shipped the doubled suffix on 25 pages.
    title,
    description,
    openGraph: { ...ogBase, url, title, description },
  };
}

export default function LocationPage({ params }: { params: { city: string } }) {
  const loc = findLocation(params.city);
  if (!loc) notFound();

  const content = cityContent[loc.slug];
  // An entry with an empty answer is a stub: the page keeps today's shared copy in its place.
  const written = isCityWritten(content);
  const { h1 } = pageStrings(loc);

  // The services this city's housing makes relevant, plus — the reverse direction of the mesh —
  // every service whose own page lists this city. A written entry with neither falls back to all.
  const relevantSlugs = new Set<string>(content.services);
  for (const [slug, depth] of Object.entries(serviceDepth)) {
    if (depth.locations.some((l) => l === loc.slug)) relevantSlugs.add(slug);
  }
  const relevant = serviceCards.filter((s) => relevantSlugs.has(s.slug));
  const showRelevantOnly = written && relevant.length > 0;
  const listed = showRelevantOnly ? relevant : serviceCards;

  const neighbours = written
    ? nearby(loc.slug).flatMap((slug) => locations.find((l) => l.slug === slug) ?? [])
    : [];

  // The H2 over those links: the page's own `nearbyHeading` when its list holds a far place
  // (lib/nearby.ts), else the shared one.
  const nearbyHeading = content.nearbyHeading ?? locationPageCopy.nearbyHeading;

  // The reverse index: guides that name this city (and declare it) appear here by themselves.
  const guides = guidesForLocationPage(loc.slug);

  // The table of contents: every H2 of the article column after the answer block, in page order,
  // for the city pages whose prose passes the bar (lib/toc.ts) — some do, some do not.
  const neighbourhoodsHeading = locationPageCopy.neighborhoodsHeading(
    loc.prefixed,
    loc.kind,
  );
  const servicesHeading = showRelevantOnly
    ? locationPageCopy.relevantServicesHeading(loc.prefixed)
    : locationServicesHeading(loc.prefixed);
  const faqHeading = locationPageCopy.faqHeading(loc.prefixed);
  const neighbourhoods = content.neighborhoods ?? [];
  const glance = content.glance;
  const tocHeadings: TocHeading[] = [
    ...(glance ? [glance.heading] : []),
    ...content.localNotes.map((section) => section.heading),
    ...(neighbourhoods.length > 0 ? [neighbourhoodsHeading] : []),
    servicesHeading,
    ...(content.faqs.length > 0 ? [{ id: "faq", text: faqHeading }] : []),
    ...(neighbours.length > 0 ? [nearbyHeading] : []),
  ];
  const toc = buildToc(tocHeadings, [
    ...(written
      ? [content.answerHeading, content.answer]
      : [locationIntroParagraph1(loc.prefixed), locationIntroParagraph2(loc.prefixed)]),
    ...(glance
      ? [glance.heading, glance.cost.text, glance.process.text, glance.check.text]
      : []),
    ...content.localNotes.flatMap((section) => [section.heading, ...section.paragraphs]),
    neighbourhoodsHeading,
    ...neighbourhoods,
    servicesHeading,
    ...listed.map((s) => s.name),
    faqHeading,
    ...content.faqs.flatMap(({ q, a }) => [q, a]),
    nearbyHeading,
    ...(neighbours.length > 0 && content.nearbyNote ? [content.nearbyNote] : []),
    ...neighbours.map((n) => areaLinkLabel(n.prefixed)),
  ]);

  // Handed to PageHeader, which renders them with the breadcrumb as ONE @graph. The Service's
  // `provider` points at the business, so the business node rides along (never a LocalBusiness
  // per city — coverage is `areaServed`). The FAQPage joins only when the entry has questions, and
  // carries exactly the { q, a } the <Faq> below shows.
  const nodes: JsonLd[] = [
    businessNode(manifest),
    locationServiceJsonLd(manifest, { name: h1, serviceType: locationServiceType }, loc),
    ...(content.faqs.length > 0
      ? [faqJsonLd(content.faqs.map(({ q, a }) => ({ q, a })))]
      : []),
  ];

  return (
    <>
      <PageHeader
        title={h1}
        // Once written, the answer block below is the first paragraph in <main>, so the shared
        // subtitle (a second paragraph above it) steps aside. A stub keeps it.
        subtitle={written ? undefined : locationHeroSubtitle(loc.prefixed)}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.areas, href: "/איזורי-שירות/" },
          { label: loc.name, href: `/locations/${loc.slug}/` },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          {written ? (
            <AnswerBlock heading={content.answerHeading} answer={content.answer} />
          ) : (
            <>
              <p className="text-lg leading-relaxed text-gray-700">
                {locationIntroParagraph1(loc.prefixed)}
              </p>
              <p className="mt-4 text-gray-700">
                {locationIntroParagraph2(loc.prefixed)}
              </p>
            </>
          )}

          <Toc items={toc} />

          <CityGlanceBlock glance={glance} labels={locationPageCopy.glanceLabels} />

          <ContentSections sections={content.localNotes} />

          <BulletedBlock heading={neighbourhoodsHeading} items={neighbourhoods} />

          <h2
            id={headingId(servicesHeading)}
            className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
          >
            {servicesHeading}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {listed.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className={linkCardClass}
                  {...relatedAttr("service")}
                >
                  {s.name}
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          {showRelevantOnly && (
            <p className="mt-4">
              <Link
                href="/שירותים/"
                className="font-semibold text-secondary underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {locationPageCopy.allServicesLabel}
              </Link>
            </p>
          )}

          {content.faqs.length > 0 && (
            <div className="mt-10">
              <Faq
                items={content.faqs}
                heading={faqHeading}
                id="faq"
                name={locationPageCopy.faqGroupName}
                className="mx-0 mt-5 max-w-none"
              />
            </div>
          )}

          {neighbours.length > 0 && (
            <>
              <h2
                id={headingId(nearbyHeading)}
                className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
              >
                {nearbyHeading}
              </h2>
              {content.nearbyNote && (
                <p className="mt-4 text-gray-700">{content.nearbyNote}</p>
              )}
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {neighbours.map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/locations/${n.slug}/`}
                      className={linkCardClass}
                      {...relatedAttr("location")}
                    >
                      {areaLinkLabel(n.prefixed)}
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <RelatedGuides guides={guides} className="mt-10" />

          <FamilyLinks current={{ kind: "location", slug: loc.slug }} className="mt-10" />
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
