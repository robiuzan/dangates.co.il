import type { Metadata } from "next";
import { ogBase, routeUrl } from "@/lib/seo";
import {
  crumbLabels,
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

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title={servicesIndexHeroTitle}
        subtitle={servicesIndexHeroSubtitle}
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
