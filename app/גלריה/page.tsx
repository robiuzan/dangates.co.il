import type { Metadata } from "next";
import Link from "next/link";
import notice from "@/content/images/notice.json";
import { galleryRoute } from "@/scripts/images/lib/images.config.mjs";
import { crumbLabels } from "@/lib/content";
import { ogBase, routeUrl } from "@/lib/seo";
import { imagesFor, pageLinkFor } from "@/lib/images";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Figure } from "@/components/images/Figure";
import { FinalCta } from "@/components/marketing/FinalCta";

/** Bare subject: the root layout's title template appends the brand. */
const TITLE = "גלריה — כך נראית עבודה על שער חשמלי";

const galleryUrl = routeUrl("גלריה");

export const metadata: Metadata = {
  alternates: { canonical: galleryUrl },
  title: TITLE,
  description: notice.galleryDescription,
  openGraph: {
    ...ogBase,
    url: galleryUrl,
    title: TITLE,
    description: notice.galleryDescription,
  },
};

/**
 * The home of the site-wide image disclosure. Each tile links to the page it illustrates. The texts
 * come from content/images/notice.json, which the gate compares verbatim. No ImageObject on purpose:
 * renderings are never evidence, so nothing here reaches the structured data (the images gate fails
 * the build if it ever does). The BreadcrumbList comes from `crumbs` (this site's PageHeader has no
 * `currentPath`).
 */
export default function GalleryPage() {
  const tiles = imagesFor(galleryRoute, "generated");

  return (
    <>
      <PageHeader
        title={TITLE}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.gallery, href: galleryUrl },
        ]}
      />
      <Section>
        <p className="mx-auto max-w-2xl text-center text-gray-600">
          {notice.galleryIntro}
        </p>

        {/* The disclosure — verbatim from content/images/notice.json (the gate compares it). */}
        <p
          data-images-notice="gallery"
          className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-gray-500"
        >
          {notice.gallery}
        </p>

        {tiles.length > 0 && (
          <>
            <h2 className="mt-14 text-center font-heading text-2xl font-bold text-primary">
              {notice.generatedTitle}
            </h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2">
              {tiles.map((image, i) => {
                const link = pageLinkFor(image);
                return (
                  <li key={image.id}>
                    <Figure
                      image={image}
                      priority={i === 0}
                      captionExtra={
                        link ? (
                          <Link
                            href={link.href}
                            className="font-semibold text-secondary underline underline-offset-4 hover:text-primary"
                          >
                            {link.label}
                          </Link>
                        ) : undefined
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <p className="mx-auto mt-12 max-w-2xl text-center text-gray-600">
          {notice.galleryCta}
        </p>
      </Section>
      <FinalCta />
    </>
  );
}
