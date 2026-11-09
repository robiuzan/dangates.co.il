import Link from "next/link";
import { Calculator, ChevronLeft, MessageCircle, Phone } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  priceRows,
  pricingCtaCopy,
  pricingTeaserCopy,
  defaultWhatsappMessage,
} from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/site-config";

/**
 * The visit-fee band + quote button (copy: `pricingTeaserCopy`; the table holds the one sourced
 * price, `priceRows` — backlog N14). `directCta` adds the call and WhatsApp pair beside it — the
 * /מחירון/ page sets it (backlog §8.5: the highest-intent page needs a call within reach); the
 * homepage already carries both in its hero. `withMoreLink` adds the link to /מחירון/ — the
 * homepage sets it; on /מחירון/ itself it would link the page to itself.
 */
export function PricingTeaser({
  directCta = false,
  withMoreLink = false,
}: {
  directCta?: boolean;
  withMoreLink?: boolean;
}) {
  return (
    <Section id="pricing" tone="white">
      <SectionHeading
        eyebrow={pricingTeaserCopy.eyebrow}
        title={pricingTeaserCopy.title}
        subtitle={pricingTeaserCopy.subtitle}
      />

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-start">
          <caption className="sr-only">{pricingTeaserCopy.tableCaption}</caption>
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                {pricingTeaserCopy.serviceHeader}
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                {pricingTeaserCopy.priceHeader}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {priceRows.map((row) => (
              <tr key={row.service}>
                <td className="px-5 py-4 font-medium text-gray-800">{row.service}</td>
                <td className="px-5 py-4 text-gray-600" dir="ltr">
                  {row.from}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-gray-500">
        {pricingTeaserCopy.note}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/צור-קשר/" data-cta="pricing-contact" variant="accent" size="lg">
          <Calculator className="h-5 w-5" aria-hidden />
          {pricingTeaserCopy.quoteLabel}
        </Button>
        {directCta && (
          <>
            <Button href={telHref} data-cta="pricing-call" variant="outline" size="lg">
              <Phone className="h-5 w-5" aria-hidden />
              {pricingCtaCopy.callLabel}
            </Button>
            <Button
              href={whatsappHref(defaultWhatsappMessage)}
              data-cta="pricing-whatsapp"
              variant="whatsapp"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {pricingCtaCopy.whatsappLabel}
            </Button>
          </>
        )}
      </div>

      {withMoreLink && (
        <p className="mt-6 text-center">
          <Link
            href={pricingTeaserCopy.more.href}
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-secondary underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            {pricingTeaserCopy.more.label}
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      )}
    </Section>
  );
}
