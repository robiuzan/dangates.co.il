import type { Metadata } from "next";
import { Check } from "lucide-react";
import { manifest } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { businessNode, pageNode } from "@/lib/jsonld";
import {
  aboutKnowsAbout,
  aboutSections,
  aboutValues,
  crumbLabels,
  aboutMetaDescription,
  aboutHeroTitle,
  aboutHeroSubtitle,
  aboutIntro,
  aboutValuesHeading,
  imagesNote,
} from "@/lib/content";
import { imageFor, leadSlotOf } from "@/lib/images";
import { isPageWritten, pageContent } from "@/lib/page-content";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContentBlock } from "@/components/marketing/ContentSections";
import { Section } from "@/components/ui/Section";
import { Toc } from "@/components/ui/Toc";
import { buildToc, headingId } from "@/lib/toc";
import { TrustBar } from "@/components/marketing/TrustBar";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Figure } from "@/components/images/Figure";

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

// AboutPage `about` → the business; `knowsAbout` sits on the business node (the Organization
// property), listing only subjects the site covers. No credential, no Person.
const nodes = [
  businessNode(manifest, { knowsAbout: aboutKnowsAbout }),
  pageNode(manifest, "AboutPage", {
    path: "/אודות/",
    name: aboutHeroTitle,
    business: "about",
  }),
];

export default function AboutPage() {
  const content = pageContent.about;
  // The team frame is the page's lead image; the about note renders only under a figure with people,
  // so while it is held the priority moves to the story figure (CLAUDE.md §15).
  const route = "/אודות/";
  const team = imageFor(route, "team");
  const story = imageFor(route, "story");
  const work = imageFor(route, "work");
  const eager = leadSlotOf(route, ["team", "story", "work"]);
  // After the answer block: every H2 of the page's prose, for as long as that prose passes the bar.
  const toc = buildToc(
    [
      ...content.sections.map((section) => section.heading),
      ...aboutSections.map((sec) => sec.title),
      aboutValuesHeading,
    ],
    [
      content.answerHeading,
      content.answer,
      ...content.sections.flatMap((section) => [
        section.heading,
        ...section.paragraphs,
        ...(section.list ?? []),
      ]),
      aboutIntro,
      ...aboutSections.flatMap((sec) => [sec.title, sec.body]),
      aboutValuesHeading,
      ...aboutValues.flatMap((v) => [v.title, v.body]),
    ],
  );
  return (
    <>
      <PageHeader
        title={aboutHeroTitle}
        // Once written, the answer block is the first paragraph in <main>, so the subtitle steps aside.
        subtitle={isPageWritten(content) ? undefined : aboutHeroSubtitle}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.about, href: "/אודות/" },
        ]}
      />

      <PageContentBlock
        content={content}
        afterAnswer={
          <>
            {team && <Figure image={team} priority={eager === "team"} className="mt-6" />}
            {team && team.people.length > 0 && (
              <p
                data-images-notice="about"
                className="mt-4 text-sm leading-relaxed text-gray-600"
              >
                {imagesNote.about}
              </p>
            )}
            <Toc items={toc} />
          </>
        }
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">{aboutIntro}</p>

          {story && (
            <Figure image={story} priority={eager === "story"} className="mt-8" />
          )}

          {aboutSections.map((sec) => (
            <div key={sec.title}>
              <h2
                id={headingId(sec.title)}
                className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
              >
                {sec.title}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">{sec.body}</p>
            </div>
          ))}

          <h2
            id={headingId(aboutValuesHeading)}
            className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
          >
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

          {work && <Figure image={work} priority={eager === "work"} className="mt-10" />}
        </div>
      </Section>

      <TrustBar />
      <FinalCta />
    </>
  );
}
