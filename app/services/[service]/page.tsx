import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, Phone } from "lucide-react";
import {
  services,
  type ServiceSlug,
  siteConfig,
  manifest,
  telHref,
  whatsappHref,
} from "@/lib/site-config";
import {
  serviceCards,
  processSteps,
  serviceTriggers,
  servicePageCopy,
  serviceCtaCardTitle,
  serviceWhatsappMessage,
  crumbLabels,
} from "@/lib/content";
import { ogBase, routeUrl } from "@/lib/seo";
import { serviceJsonLd, jsonLdScript } from "@ishub/site-kit/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { service: ServiceSlug }[] {
  return services.map((s) => ({ service: s.slug }));
}

/** Match the route param against a slug, tolerant of URL-encoding + Unicode normalization
 *  (Hebrew dynamic segments arrive percent-encoded during static export). */
function findCard(param: string) {
  const target = decodeURIComponent(param).normalize("NFC");
  return serviceCards.find((c) => c.slug.normalize("NFC") === target);
}

export function generateMetadata({ params }: { params: { service: string } }): Metadata {
  const card = findCard(params.service);
  if (!card) return {};
  const url = routeUrl(`services/${card.slug}`);
  return {
    alternates: { canonical: url },
    // Bare subject only — app/layout.tsx already appends "| דן שערים חשמליים" via the
    // title template. Appending it here too is what shipped the doubled suffix on 25 pages.
    title: card.name,
    description: card.description,
    openGraph: { ...ogBase, url, title: card.name, description: card.description },
  };
}

export default function ServicePage({ params }: { params: { service: string } }) {
  const card = findCard(params.service);
  if (!card) notFound();

  const others = serviceCards.filter((c) => c.slug !== card.slug).slice(0, 4);
  const triggers = serviceTriggers[card.slug];
  const jsonLd = serviceJsonLd(manifest, {
    name: card.name,
    description: card.description,
    slug: card.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <PageHeader
        title={card.name}
        subtitle={card.tagline}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.services, href: "/שירותים/" },
          { label: card.name, href: `/services/${card.slug}/` },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-gray-700">{card.description}</p>

            <h2 className="mt-10 font-heading text-xl font-bold text-primary">
              {servicePageCopy.triggersHeading}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {triggers.map((t) => (
                <li key={t} className="flex items-start gap-2 text-gray-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-heading text-xl font-bold text-primary">
              {servicePageCopy.processHeading}
            </h2>
            <ol className="mt-4 space-y-3">
              {processSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">
                    <strong className="text-primary">{step.title}.</strong> {step.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sticky CTA card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <p className="font-heading text-lg font-bold text-primary">
                {serviceCtaCardTitle(card.name)}
              </p>
              <p className="mt-1 text-sm text-gray-600">{servicePageCopy.ctaSubtitle}</p>
              <div className="mt-5 flex flex-col gap-3">
                <Button href={telHref} data-cta="service-call" variant="accent" size="lg">
                  <Phone className="h-5 w-5" aria-hidden />
                  <span dir="ltr">{siteConfig.phone}</span>
                </Button>
                <Button
                  href={whatsappHref(serviceWhatsappMessage(card.name))}
                  data-cta="service-whatsapp"
                  variant="whatsapp"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {servicePageCopy.whatsappLabel}
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related services */}
        <div className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="font-heading text-xl font-bold text-primary">
            {servicePageCopy.relatedHeading}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary"
                >
                  {o.name}
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
