import { SiteImage } from "@ishub/site-kit/components";
import { manifest } from "@/lib/site-config";
import { jobPhotosCopy } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const MAX_PHOTOS = 6;

/** Job-photo gallery from the manifest. Renders nothing until the catalog publishes photos. */
export function JobPhotos() {
  const items = manifest.images?.gallery?.items.slice(0, MAX_PHOTOS) ?? [];
  if (items.length === 0) return null;

  return (
    <Section tone="muted">
      <SectionHeading eyebrow={jobPhotosCopy.eyebrow} title={jobPhotosCopy.title} />
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.key} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <SiteImage
              image={item}
              images={manifest.images}
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/3] h-auto w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
