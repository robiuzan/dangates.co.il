import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Figure } from "@/components/images/Figure";
import type { PlacedImage } from "@/lib/images";

/**
 * The homepage's method band: the `team` image (the same manifest entry the about page renders,
 * contract §2) beside a short text on how the work is done, linking to the about page. Renders
 * nothing without the image — the homepage reads exactly as before until the team rendering is
 * approved.
 *
 * Everything comes in as props, so the words stay in the site's own copy file. No first names
 * here: a caption may name someone only when EVERY placement of its entry is the about page, and
 * this entry is also placed on the homepage. The about page carries the named line.
 *
 * `priority` is passed by the page: true only when no content image precedes this one (the
 * homepage strip rendered nothing), so the page keeps exactly one LCP candidate.
 */
export function TeamTeaser({
  image,
  title,
  text,
  href,
  linkLabel,
  eyebrow,
  priority = false,
}: {
  image: PlacedImage | undefined;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  eyebrow: string;
  priority?: boolean;
}) {
  if (!image) return null;

  return (
    <Section id="team" tone="muted">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <Figure image={image} priority={priority} />
        <div>
          <p className="text-sm font-semibold text-accent-600">{eyebrow}</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">{text}</p>
          <p className="mt-6">
            <Link
              href={href}
              className="font-semibold text-secondary underline underline-offset-4 hover:text-primary"
            >
              {linkLabel}
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}
