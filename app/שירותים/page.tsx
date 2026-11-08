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
} from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { FinalCta } from "@/components/marketing/FinalCta";

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
  return (
    <>
      <PageHeader
        title={servicesIndexHeroTitle}
        subtitle={servicesIndexHeroSubtitle}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.services, href: "/שירותים/" },
        ]}
      />
      <ServicesGrid />
      <FinalCta />
    </>
  );
}
