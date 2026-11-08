import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { siteConfig, telHref, whatsappHref } from "@/lib/site-config";
import { ogBase } from "@/lib/seo";
import { thanksPageCopy } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

/**
 * /תודה/ — where a confirmed lead lands (backlog §8.3). The page view is the countable
 * conversion (docs/event-taxonomy.md), so it must stay out of search and out of the sitemap.
 *
 * Like the 404 it claims no URL of its own: `alternates.canonical: null` stops it inheriting the
 * root canonical, and spreading `ogBase` without a `url` keeps the share image but drops the
 * inherited og:url (Next replaces a parent `openGraph` wholesale — see lib/seo.ts and
 * app/not-found.tsx). `titles.mjs` asserts both. The root `title.template` adds the brand.
 */
export const metadata: Metadata = {
  title: thanksPageCopy.metaTitle,
  description: thanksPageCopy.metaDescription,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: {
    ...ogBase,
    title: thanksPageCopy.metaTitle,
    description: thanksPageCopy.metaDescription,
  },
};

export default function ThanksPage() {
  return (
    <Section tone="white">
      {/* Fleet live-kit (CLAUDE.md §14): a post-conversion page takes no seasonal line and no
          card — it is also listed in live.config.mjs `calm`. */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
          {thanksPageCopy.h1}
        </h1>
        <p className="mt-4 text-lg text-gray-700">{thanksPageCopy.lead}</p>

        <h2 className="mt-10 font-heading text-xl font-bold text-primary">
          {thanksPageCopy.nextHeading}
        </h2>
        <p className="mt-2 text-gray-700">{thanksPageCopy.nextBody}</p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={telHref} data-cta="thanks-call" variant="accent" size="lg">
            <Phone className="h-5 w-5" aria-hidden />
            {thanksPageCopy.callLabel} <span dir="ltr">{siteConfig.phone}</span>
          </Button>
          <Button
            href={whatsappHref(thanksPageCopy.whatsappMessage)}
            data-cta="thanks-whatsapp"
            variant="whatsapp"
            size="lg"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            {thanksPageCopy.whatsappLabel}
          </Button>
        </div>

        <p className="mt-8">
          <Button href="/שירותים/" variant="outline" size="md">
            {thanksPageCopy.servicesLabel}
          </Button>
        </p>
      </div>
    </Section>
  );
}
