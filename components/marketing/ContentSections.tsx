import type { PageContent } from "@/lib/page-content";
import { Section } from "@/components/ui/Section";
import { headingId } from "@/lib/toc";

/**
 * The prose blocks a typed content module fills (lib/city-content.ts, lib/page-content.ts), as server
 * markup with the type scale the service page already uses. They render nothing for empty data, so a
 * stub module adds nothing to its page. Copy arrives as props; none is typed here.
 */

/** Question-form H2 and the answer paragraph — the first paragraph in <main> once written. */
export function AnswerBlock({ heading, answer }: { heading: string; answer: string }) {
  if (answer === "") return null;
  return (
    <>
      <h2 className="font-heading text-xl font-bold text-primary">{heading}</h2>
      <p className="mt-3 text-lg leading-relaxed text-gray-700">{answer}</p>
    </>
  );
}

export interface ContentSection {
  heading: string;
  paragraphs: readonly string[];
  list?: readonly string[];
}

/** H2 + paragraphs (+ an optional bulleted list) per section. */
export function ContentSections({ sections }: { sections: readonly ContentSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.heading}>
          <h2
            id={headingId(section.heading)}
            className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
          >
            {section.heading}
          </h2>
          {section.paragraphs.map((para) => (
            <p key={para} className="mt-4 leading-relaxed text-gray-700">
              {para}
            </p>
          ))}
          {section.list && section.list.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 ps-6 text-gray-700">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

/** A plain H2 over a bulleted list; renders nothing for an empty list. */
export function BulletedBlock({
  heading,
  items,
}: {
  heading: string;
  items: readonly string[];
}) {
  if (items.length === 0) return null;
  return (
    <>
      <h2
        id={headingId(heading)}
        className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
      >
        {heading}
      </h2>
      <ul className="mt-4 grid list-disc gap-x-8 gap-y-2 ps-6 text-gray-700 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

/**
 * A whole `PageContent` as its own section, placed ahead of a page's existing content. An empty
 * module (no answer) renders nothing, so the page is unchanged until its copy is written.
 */
export function PageContentBlock({
  content,
  afterAnswer,
}: {
  content: PageContent;
  /** Rendered directly after the answer block — where a table of contents goes. */
  afterAnswer?: React.ReactNode;
}) {
  if (content.answer === "") return null;
  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl">
        <AnswerBlock heading={content.answerHeading} answer={content.answer} />
        {afterAnswer}
        <ContentSections sections={content.sections} />
      </div>
    </Section>
  );
}
