import Image from "next/image";
import Link from "next/link";
import { headingId, type Block, type InlineLink } from "@/lib/guide-types";
import { guidesCopy } from "@/lib/content";
import { Faq } from "@/components/marketing/Faq";
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

const linkClass =
  "font-semibold text-secondary underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

/**
 * Splits a paragraph on each anchor and links it in place. Anchors match on first occurrence and
 * each is applied once; `lib/guides.ts` rejects an anchor that is not present, which is the failure
 * worth catching.
 */
function withLinks(text: string, links?: readonly InlineLink[]): React.ReactNode {
  if (!links || links.length === 0) return text;

  let nodes: React.ReactNode[] = [text];
  for (const { anchor, href } of links) {
    const next: React.ReactNode[] = [];
    let linked = false;
    for (const node of nodes) {
      if (linked || typeof node !== "string") {
        next.push(node);
        continue;
      }
      const i = node.indexOf(anchor);
      if (i === -1) {
        next.push(node);
        continue;
      }
      linked = true;
      next.push(
        node.slice(0, i),
        /^https?:\/\//.test(href) ? (
          <a key={href} href={href} className={linkClass} rel="noopener">
            {anchor}
          </a>
        ) : (
          <Link
            key={href}
            href={href}
            className={linkClass}
            {...(href === "/צור-קשר/" ? { "data-cta": "article-contact" } : {})}
          >
            {anchor}
          </Link>
        ),
        node.slice(i + anchor.length),
      );
    }
    nodes = next;
  }
  return nodes;
}

export function ArticleBody({
  blocks,
  guideTitle,
}: {
  blocks: readonly Block[];
  /** The guide's title, for the WhatsApp opener a CTA block prefills. */
  guideTitle: string;
}) {
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
              <AnswerBlock key={i} q={block.q} a={block.a} id={headingId(block.q)} />
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

          case "image":
            return (
              <figure key={i} className="mt-8">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                  className="w-full rounded-2xl"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-xs text-gray-600">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

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
