import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { manifest, telHref, whatsappHref } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { pageNode } from "@/lib/jsonld";
import {
  crumbLabels,
  pricingCtaCopy,
  pricingPageCopy,
  type PriceDriver,
} from "@/lib/content";
import { imageFor, leadSlotOf } from "@/lib/images";
import { withLinks } from "@/components/ui/LinkedText";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Toc } from "@/components/ui/Toc";
import { buildToc } from "@/lib/toc";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { Figure } from "@/components/images/Figure";

const pricingUrl = routeUrl("מחירון");

export const metadata: Metadata = {
  alternates: { canonical: pricingUrl },
  title: pricingPageCopy.metaTitle,
  description: pricingPageCopy.metaDescription,
  openGraph: {
    ...ogBase,
    url: pricingUrl,
    title: pricingPageCopy.metaTitle,
    description: pricingPageCopy.metaDescription,
  },
};

// A plain WebPage: no Offer, no price (the only number is the visit band — backlog §4.10, N14).
const nodes = [
  pageNode(manifest, "WebPage", { path: "/מחירון/", name: pricingPageCopy.h1 }),
];

// The copy is `as const`, so its drivers are a tuple of differently-shaped literals; widen to the
// interface to read the optional `items` / `after` uniformly.
const drivers: readonly PriceDriver[] = pricingPageCopy.drivers;
const { answer, quoteTips } = pricingPageCopy;

// The table of contents under the answer block: the driver sections and the quote tips, linked by
// the ids their wrappers already carry; shown only while the page's prose passes the bar.
const toc = buildToc(
  [
    ...drivers.map((driver) => ({ id: driver.id, text: driver.heading })),
    { id: "quote-tips", text: quoteTips.heading },
  ],
  [
    answer.heading,
    answer.text,
    pricingPageCopy.subtitle,
    ...drivers.flatMap((driver) => [
      driver.heading,
      ...driver.paragraphs,
      ...(driver.items ?? []),
      ...(driver.after ? [driver.after] : []),
    ]),
    quoteTips.heading,
    quoteTips.intro,
    ...quoteTips.items,
    quoteTips.after,
  ],
);

// Optional: a pointer from the quote tips to the guides, rendered only once the copy carries it.
const guidesPointer = pricingPageCopy.guidesPointer;

const listClass = "mt-4 list-disc space-y-2 ps-6 leading-relaxed text-gray-700";
const h2Class = "font-heading text-2xl font-bold text-primary";

export default function PricingPage() {
  // Illustrations (CLAUDE.md §15): the survey sits under the answer block, the layers frame between
  // the drivers and the teaser. Neither is a price; the page still lists none.
  const route = "/מחירון/";
  const survey = imageFor(route, "survey");
  const layers = imageFor(route, "layers");
  const eager = leadSlotOf(route, ["survey", "layers"]);

  return (
    <>
      <PageHeader
        title={pricingPageCopy.h1}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: pricingPageCopy.crumbLabel, href: "/מחירון/" },
        ]}
      />

      {/* The answer block is the first paragraph under the H1 (no PageHeader subtitle). */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <h2 className={h2Class}>{answer.heading}</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-800">{answer.text}</p>
          <p className="mt-3 leading-relaxed text-gray-600">{pricingPageCopy.subtitle}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={telHref} data-cta="pricing-call" variant="outline" size="lg">
              <Phone className="h-5 w-5" aria-hidden />
              {pricingCtaCopy.callLabel}
            </Button>
            <Button
              href={whatsappHref(quoteTips.whatsappMessage)}
              data-cta="pricing-whatsapp"
              variant="whatsapp"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {pricingCtaCopy.whatsappLabel}
            </Button>
          </div>
          {survey && (
            <Figure image={survey} priority={eager === "survey"} className="mt-8" />
          )}
          <Toc items={toc} className="mt-8" />
        </div>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-3xl space-y-12">
          {drivers.map((driver) => (
            <div key={driver.id} id={driver.id} className="scroll-mt-24">
              <h2 className={h2Class}>{driver.heading}</h2>
              {driver.paragraphs.map((text) => (
                <p key={text} className="mt-4 leading-relaxed text-gray-700">
                  {text}
                </p>
              ))}
              {driver.items && (
                <ul className={listClass}>
                  {driver.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {driver.after && (
                <p className="mt-4 leading-relaxed text-gray-700">{driver.after}</p>
              )}
            </div>
          ))}

          <div id="quote-tips" className="scroll-mt-24">
            <h2 className={h2Class}>{quoteTips.heading}</h2>
            <p className="mt-4 leading-relaxed text-gray-700">{quoteTips.intro}</p>
            <ul className={listClass}>
              {quoteTips.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed text-gray-700">{quoteTips.after}</p>
            {guidesPointer && (
              <p className="mt-4 leading-relaxed text-gray-700">
                {withLinks(guidesPointer.text, guidesPointer.links)}
              </p>
            )}
          </div>
        </div>
      </Section>

      {layers && (
        <Section tone="white">
          <div className="mx-auto max-w-3xl">
            <Figure image={layers} priority={eager === "layers"} />
          </div>
        </Section>
      )}

      <PricingTeaser directCta />

      <Section tone="muted">
        <p className="mx-auto max-w-2xl text-center text-sm text-gray-500">
          {pricingPageCopy.footnote}
        </p>
      </Section>
    </>
  );
}
