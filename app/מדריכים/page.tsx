import type { Metadata } from "next";
import { manifest } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { guidesCopy } from "@/lib/content";
import { itemListJsonLd } from "@/lib/jsonld";
import { pillarLabels } from "@/lib/guide-types";
import { guideList, guidePath, guidesByPillar } from "@/lib/guides";
import { imageFor } from "@/lib/images";
import { isPageWritten, pageContent } from "@/lib/page-content";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContentBlock } from "@/components/marketing/ContentSections";
import { GuideCard } from "@/components/article/chrome";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

const hubUrl = routeUrl("מדריכים");

export const metadata: Metadata = {
  alternates: { canonical: hubUrl },
  title: guidesCopy.hubTitle,
  description: guidesCopy.hubMetaDescription,
  openGraph: {
    ...ogBase,
    url: hubUrl,
    title: guidesCopy.hubTitle,
    description: guidesCopy.hubMetaDescription,
  },
};

export default function GuidesIndexPage() {
  const content = pageContent.guidesIndex;
  const groups = guidesByPillar();
  // Each card shows the derived thumbnail of its guide's lead; the first card in DOM order that
  // shows one owns the page's single eager image (CLAUDE.md §15).
  const leadOf = (slug: string) => imageFor(guidePath(slug), "lead");
  const firstWithThumb = groups
    .flatMap((group) => group.guides)
    .find((g) => leadOf(g.slug)?.thumb)?.slug;

  // The FULL list, in the order the grid renders it (pillar groups, newest first inside each). An
  // ItemList that disagrees with what is rendered is worse than none, so it is built from `groups`.
  const nodes = [
    itemListJsonLd(
      manifest,
      groups.flatMap((group) =>
        group.guides.map((g) => ({ name: g.title, path: guidePath(g.slug) })),
      ),
      {
        path: "/מדריכים/",
        name: guidesCopy.hubTitle,
        description: guidesCopy.hubMetaDescription,
      },
    ),
  ];

  return (
    <>
      <PageHeader
        title={guidesCopy.hubTitle}
        // Once written, the answer block is the first paragraph in <main>, so the subtitle steps aside.
        subtitle={isPageWritten(content) ? undefined : guidesCopy.hubSubtitle}
        nodes={nodes}
        crumbs={[
          { label: "בית", href: "/" },
          { label: guidesCopy.crumbLabel, href: "/מדריכים/" },
        ]}
      />

      <PageContentBlock content={content} />

      {guideList.length > 0 && (
        <Section tone="muted">
          {groups.map((group) => (
            <div key={group.pillar} className="mt-14 first:mt-0">
              <h2 className="font-heading text-xl font-bold text-primary">
                {pillarLabels[group.pillar]}
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.guides.map((g) => (
                  <GuideCard
                    key={g.slug}
                    guide={g}
                    thumb={leadOf(g.slug)}
                    priority={g.slug === firstWithThumb}
                  />
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      <FinalCta />
    </>
  );
}
