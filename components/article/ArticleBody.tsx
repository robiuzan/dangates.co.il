import { Fragment } from "react";
import { headingId, type Block } from "@/lib/guide-types";
import { guidesCopy } from "@/lib/content";
import { withLinks } from "@/components/ui/LinkedText";
import { imageFor } from "@/lib/images";
import { Faq } from "@/components/marketing/Faq";
import { Figure } from "@/components/images/Figure";
import {
  AnswerBlock,
  ArticleTable,
  Callout,
  InlineCta,
} from "@/components/article/blocks";

/**
 * Renders the typed block array (ADR 0003). A server component — a guide ships no client JS of its
 * own: the FAQ is native `<details>` through the shared `Faq`.
 *
 * Headings render inline with a stable `id` (`headingId`), start-aligned in the prose column. Body
 * blocks are deliberately NOT wrapped in `Reveal`: fading body copy into view hurts reading.
 * An empty block array renders an empty wrapper, so a stub guide cannot crash the renderer.
 */

export function ArticleBody({
  blocks,
  guideTitle,
  route,
  afterAnswer,
}: {
  blocks: readonly Block[];
  /** The guide's title, for the WhatsApp opener a CTA block prefills. */
  guideTitle: string;
  /** The guide's own route, for its figure blocks (the manifest places images by route + slot). */
  route: string;
  /** Rendered directly after the answer block — where the table of contents goes. */
  afterAnswer?: React.ReactNode;
}) {
  // The lead (rendered by the page through afterAnswer, so only when an answer block exists) is the
  // eager image when it renders; otherwise the first figure block that does — exactly one per page.
  const leadShown =
    blocks.some((b) => b.kind === "answer") && imageFor(route, "lead") !== undefined;
  const firstFigure = blocks.findIndex(
    (b) => b.kind === "figure" && imageFor(route, b.slot) !== undefined,
  );

  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "paragraph":
            return (
              <p key={i} className="mt-4 leading-relaxed text-gray-700">
                {withLinks(block.text, block.links)}
              </p>
            );

          case "heading":
            return block.level === 2 ? (
              <h2
                key={i}
                id={headingId(block.text)}
                className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-primary"
              >
                {block.text}
              </h2>
            ) : (
              <h3
                key={i}
                id={headingId(block.text)}
                className="mt-6 scroll-mt-24 font-heading text-base font-bold text-primary"
              >
                {block.text}
              </h3>
            );

          case "list": {
            // Logical start padding: the marker sits on the start edge in RTL.
            const cls = "mt-4 space-y-2 ps-6 text-gray-700";
            return block.ordered ? (
              <ol key={i} className={`list-decimal ${cls}`}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className={`list-disc ${cls}`}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }

          case "table":
            return (
              <ArticleTable
                key={i}
                caption={block.caption}
                head={block.head}
                rows={block.rows}
              />
            );

          case "answer":
            return (
              <Fragment key={i}>
                <AnswerBlock q={block.q} a={block.a} id={headingId(block.q)} />
                {afterAnswer}
              </Fragment>
            );

          case "faq":
            return (
              <div key={i} className="mt-10">
                {/* Native <details> through the shared Faq: every answer is in the DOM at first
                    paint, which is what makes the derived FAQPage node legitimate. */}
                <Faq
                  items={block.items}
                  heading={guidesCopy.faqHeading}
                  id={headingId(guidesCopy.faqHeading)}
                  name={guidesCopy.faqGroupName}
                  className="mx-0 mt-5 max-w-none"
                />
              </div>
            );

          case "figure": {
            const image = imageFor(route, block.slot);
            if (!image) return null;
            return (
              <Figure
                key={i}
                image={image}
                priority={!leadShown && i === firstFigure}
                className="mt-8"
              />
            );
          }

          case "callout":
            return <Callout key={i} tone={block.tone} text={block.text} />;

          case "cta":
            return (
              <InlineCta
                key={i}
                text={block.text}
                variant={block.variant}
                service={block.service}
                guideTitle={guideTitle}
              />
            );

          case "tool":
            // No island exists yet. Rendering nothing is correct: a guide that declares a tool
            // early still ships, just without it.
            return null;
        }
      })}
    </div>
  );
}
