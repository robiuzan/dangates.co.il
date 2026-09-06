import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ogBase, routeUrl } from "@/lib/seo";
import {
  aboutSections,
  aboutValues,
  crumbLabels,
  aboutMetaDescription,
  aboutHeroTitle,
  aboutHeroSubtitle,
  aboutIntro,
  aboutValuesHeading,
} from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { TrustBar } from "@/components/marketing/TrustBar";
import { FinalCta } from "@/components/marketing/FinalCta";

const aboutUrl = routeUrl("אודות");

export const metadata: Metadata = {
  alternates: { canonical: aboutUrl },
  // The layout title template appends the brand — writing it here too repeats it.
  title: crumbLabels.about,
  description: aboutMetaDescription,
  openGraph: {
    ...ogBase,
    url: aboutUrl,
    title: crumbLabels.about,
    description: aboutMetaDescription,
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={aboutHeroTitle}
        subtitle={aboutHeroSubtitle}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.about, href: "/אודות/" },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">{aboutIntro}</p>

          {aboutSections.map((sec) => (
            <div key={sec.title}>
              <h2 className="mt-10 font-heading text-xl font-bold text-primary">
                {sec.title}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">{sec.body}</p>
            </div>
          ))}

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            {aboutValuesHeading}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {aboutValues.map((v) => (
              <li key={v.title} className="flex items-start gap-2 text-gray-700">
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                <span>
                  <strong className="text-primary">{v.title}.</strong> {v.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <TrustBar />
      <FinalCta />
    </>
  );
}
