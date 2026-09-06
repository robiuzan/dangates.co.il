import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locations, type LocationSlug } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import {
  serviceCards,
  crumbLabels,
  locationPageTitle,
  locationMetaDescription,
  locationHeroTitle,
  locationHeroSubtitle,
  locationIntroParagraph1,
  locationIntroParagraph2,
  locationServicesHeading,
} from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
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

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const loc = findLocation(params.city);
  if (!loc) return {};
  const url = routeUrl(`locations/${loc.slug}`);
  const title = locationPageTitle(loc.name);
  const description = locationMetaDescription(loc.name);
  return {
    alternates: { canonical: url },
    // Bare subject only — app/layout.tsx already appends "| דן שערים חשמליים" via the
    // title template. Appending it here too is what shipped the doubled suffix on 25 pages.
    // Shortened from "תיקון והתקנת…" so the rendered title stays under ~60 chars.
    title,
    description,
    openGraph: { ...ogBase, url, title, description },
  };
}

export default function LocationPage({ params }: { params: { city: string } }) {
  const loc = findLocation(params.city);
  if (!loc) notFound();

  return (
    <>
      <PageHeader
        title={locationHeroTitle(loc.name)}
        subtitle={locationHeroSubtitle(loc.name)}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.areas, href: "/איזורי-שירות/" },
          { label: loc.name, href: `/locations/${loc.slug}/` },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            {locationIntroParagraph1(loc.name)}
          </p>
          <p className="mt-4 text-gray-700">{locationIntroParagraph2(loc.name)}</p>

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            {locationServicesHeading(loc.name)}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {serviceCards.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary"
                >
                  {s.name}
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
