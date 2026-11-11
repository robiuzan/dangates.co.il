import type { Metadata } from "next";
import { manifest } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/jsonld";
import {
  crumbLabels,
  serviceCards,
  servicesIndexMetaDescription,
  servicesIndexHeroTitle,
  servicesIndexHeroSubtitle,
  familyLinksCopy,
} from "@/lib/content";
import { guideList } from "@/lib/guides";
import { isPageWritten, pageContent } from "@/lib/page-content";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContentBlock } from "@/components/marketing/ContentSections";
import { Section } from "@/components/ui/Section";
import { FamilyLinks } from "@/components/marketing/FamilyLinks";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { FinalCta } from "@/components/marketing/FinalCta";
import { FieldStrip } from "@/components/images/FieldStrip";

const servicesUrl = routeUrl("שירותים");

export const metadata: Metadata = {
  alternates: { canonical: servicesUrl },
  title: servicesIndexHeroTitle,
  description: servicesIndexMetaDescription,
  openGraph: {
    ...ogBase,
    url: servicesUrl,
    title: servicesIndexHeroTitle,
    description: servicesIndexMetaDescription,
  },
};

// The full array the grid renders — an ItemList that disagrees with the visible grid is worse than none.
const nodes = [
  itemListJsonLd(
    manifest,
    serviceCards.map((s) => ({ name: s.name, path: `/services/${s.slug}/` })),
    { path: "/שירותים/", name: servicesIndexHeroTitle },
  ),
];

export default function ServicesPage() {
  const content = pageContent.servicesIndex;
  return (
    <>
      <PageHeader
        title={servicesIndexHeroTitle}
        // Once written, the answer block is the first paragraph in <main>, so the subtitle steps aside.
        subtitle={isPageWritten(content) ? undefined : servicesIndexHeroSubtitle}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.services, href: "/שירותים/" },
        ]}
      />
      <PageContentBlock
        content={content}
        afterAnswer={<FieldStrip route="/שירותים/" cols={2} className="mt-8" />}
      />
      <ServicesGrid />
      <Section tone="white">
        <FamilyLinks
          showServices={false}
          guides={guideList}
          heading={familyLinksCopy.servicesHubHeading}
        />
      </Section>
      <FinalCta />
    </>
  );
}
