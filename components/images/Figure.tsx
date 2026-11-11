import type { ReactNode } from "react";
import { SiteImage } from "@ishub/site-kit/components";
import { manifest } from "@/lib/site-config";
import { imagesDraftMode, PHONE_MEDIA, type PlacedImage } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * The one way a content image renders on this site: a `PlacedImage` from lib/images.ts, through
 * the kit's `SiteImage` (plain <img> with intrinsic width/height — `images.unoptimized` is true, so
 * next/image would emit no srcset and only add client JS). Dimensions reserve the box; CLS stays 0.
 *
 * The phone copy goes through <picture>, not srcset (the fleet's phone copies: gagoline.co.il's
 * opt-in, on by default in every port since 2026-11-11). SiteImage serves a local file verbatim
 * and the kit is vendored, so a <source> around it is how a phone gets the 720-px file while the
 * <img>, its dimensions and its loading attributes stay exactly as the kit writes them. Both files
 * have the same shape (manifest-rules.mjs checks it), so the box does not move. React writes no
 * preload link for an <img> inside <picture>, so phones fetch only the small file. Do not add
 * ReactDOM.preload here: this React build drops `media`, so phones would fetch both. A thumbnail
 * card shows the 480-px thumb and needs no copy.
 *
 * `priority` is the page's single LCP candidate — the FIRST content image in DOM order, exactly one
 * per page (scripts/images/check-images-out.mjs fails a page with two, or with a lazy first image).
 * The wrapper carries `id="img-<id>"` so the review board can deep-link a candidate on the real
 * page, and `data-image-id` / `data-image-status` so the gate can match figures to the manifest.
 *
 * In draft mode (`IMAGES_DRAFT=1`) a candidate shows a small badge; a production build never
 * renders a candidate at all, so the badge cannot reach a visitor.
 *
 * Server component. No client JS, no brand hex — the `@theme` tokens from app/globals.css.
 */
export function Figure({
  image,
  priority = false,
  caption = true,
  captionExtra,
  thumbnail = false,
  className,
}: {
  image: PlacedImage;
  priority?: boolean;
  /** `false` hides the figcaption (strip tiles, thumbnails); the alt still ships. */
  caption?: boolean;
  /** Extra figcaption content after the caption — the gallery's link to the page it illustrates. */
  captionExtra?: ReactNode;
  /** Render the derived thumbnail when there is one: a card of a `thumb` slot. */
  thumbnail?: boolean;
  className?: string;
}) {
  const draft = imagesDraftMode && image.status === "candidate";
  const shownThumb = thumbnail && image.thumb ? image.thumb : null;
  const shown = shownThumb ?? image;
  const phone = shownThumb ? null : (image.phone ?? null);
  const showCaption = caption && (image.caption !== null || captionExtra !== undefined);
  const img = (
    <SiteImage
      images={manifest.images}
      src={shown.src}
      alt={image.alt}
      width={shown.width}
      height={shown.height}
      priority={priority}
      className="w-full rounded-2xl border border-gray-100 bg-gray-50"
    />
  );

  return (
    <figure
      id={`img-${image.id}`}
      data-image-id={image.id}
      data-image-status={image.status}
      className={cn("relative", className)}
    >
      {phone ? (
        <picture className="block">
          <source
            media={PHONE_MEDIA}
            srcSet={phone.src}
            width={phone.width}
            height={phone.height}
          />
          {img}
        </picture>
      ) : (
        img
      )}
      {draft && (
        <span
          className={cn(
            "absolute rounded-md border border-accent-200 bg-accent-50 font-semibold text-accent-700",
            thumbnail
              ? "end-0.5 top-0.5 px-0.5 text-[0.5rem] leading-none"
              : "end-2 top-2 px-2 py-0.5 text-xs",
          )}
        >
          טיוטה — ממתין לאישור
        </span>
      )}
      {showCaption && (
        <figcaption className="mt-2 text-sm leading-relaxed text-gray-600">
          {image.caption}
          {captionExtra !== undefined && <span className="block">{captionExtra}</span>}
        </figcaption>
      )}
    </figure>
  );
}
