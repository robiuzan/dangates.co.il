import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { locations, manifest } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import {
  areaLinkLabel,
  areasPageCopy,
  crumbLabels,
  familyLinksCopy,
} from "@/lib/content";
import { itemListJsonLd } from "@/lib/jsonld";
import { isPageWritten, pageContent } from "@/lib/page-content";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContentBlock } from "@/components/marketing/ContentSections";
import { FamilyLinks } from "@/components/marketing/FamilyLinks";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

// Never renamed to the spelled-correctly "אזורי" — this is the live URL (golden rule 3).
const areasUrl = routeUrl("איזורי-שירות");

export const metadata: Metadata = {
  alternates: { canonical: areasUrl },
  title: areasPageCopy.title,
  description: areasPageCopy.metaDescription,
  openGraph: {
    ...ogBase,
    url: areasUrl,
    title: areasPageCopy.title,
    description: areasPageCopy.metaDescription,
  },
};

// The full array the list renders (every published location) — never a slice.
const nodes = [
  itemListJsonLd(
    manifest,
    locations.map((c) => ({
      name: areaLinkLabel(c.prefixed),
      path: `/locations/${c.slug}/`,
    })),
    { path: "/איזורי-שירות/", name: crumbLabels.areas },
  ),
];

export default function AreasPage() {
  const content = pageContent.areasIndex;
  return (
    <>
      <PageHeader
        title={areasPageCopy.title}
        nodes={nodes}
        // Once written, the answer block is the first paragraph in <main>, so the subtitle steps aside.
        subtitle={isPageWritten(content) ? undefined : areasPageCopy.subtitle}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.areas, href: "/איזורי-שירות/" },
        ]}
      />

      <PageContentBlock content={content} />

      <Section tone="white">
        <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/locations/${c.slug}`}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary"
              >
                <MapPin className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                {areaLinkLabel(c.prefixed)}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <FamilyLinks showLocations={false} heading={familyLinksCopy.areasHubHeading} />
      </Section>

      <FinalCta />
    </>
  );
}
