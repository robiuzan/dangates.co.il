import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { manifest, siteConfig, telHref, whatsappHref } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { businessNode, pageNode } from "@/lib/jsonld";
import {
  crumbLabels,
  contactMetaDescription,
  contactHeroTitle,
  contactHeroSubtitle,
  contactPageCopy,
  defaultWhatsappMessage,
  leadFormHeading,
} from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";

const contactUrl = routeUrl("צור-קשר");

export const metadata: Metadata = {
  alternates: { canonical: contactUrl },
  title: contactHeroTitle,
  description: contactMetaDescription,
  openGraph: {
    ...ogBase,
    url: contactUrl,
    title: contactHeroTitle,
    description: contactMetaDescription,
  },
};

// ContactPage `mainEntity` → the business, so the business node rides along.
const nodes = [
  businessNode(manifest),
  pageNode(manifest, "ContactPage", {
    path: "/צור-קשר/",
    name: contactHeroTitle,
    business: "mainEntity",
  }),
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={contactHeroTitle}
        subtitle={contactHeroSubtitle}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.contact, href: "/צור-קשר/" },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Details */}
          <div>
            <h2 className="font-heading text-xl font-bold text-primary">
              {contactPageCopy.detailsHeading}
            </h2>
            <ul className="mt-5 space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <a
                  href={telHref}
                  data-cta="contact-call"
                  className="font-medium hover:text-primary"
                  dir="ltr"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-whatsapp/10 text-whatsapp">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
                <a
                  href={whatsappHref(defaultWhatsappMessage)}
                  data-cta="contact-whatsapp"
                  className="font-medium hover:text-primary"
                >
                  {contactPageCopy.whatsappLabel}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  data-cta="contact-email"
                  className="font-medium hover:text-primary"
                  dir="ltr"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  {contactPageCopy.areaLine}
                  <br />
                  <span className="text-sm text-gray-500">{siteConfig.serviceArea}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  {siteConfig.hours.weekday}
                  <br />
                  {siteConfig.hours.friday}
                  <br />
                  <span className="text-sm text-accent-600">
                    {siteConfig.hours.emergency}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-primary">
              {leadFormHeading}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{contactPageCopy.formSubtitle}</p>
            <div className="mt-5">
              <LeadForm placement="contact" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
