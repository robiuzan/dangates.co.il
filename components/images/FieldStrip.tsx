import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/images/Figure";
import { stripFor } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * A row of two or three renderings — the `strip-1..3` / `pair-1..2` slots of a route (contract §2).
 * Renders NOTHING below two images: one tile in a row reads as a broken grid, and every page already
 * renders correctly with no approved image.
 *
 * The first tile is the page's `priority` image, so a page that uses the strip must put it before
 * any other content image. The columns follow what renders, so two approved tiles of a three-column
 * strip leave no empty column. With three tiles the third is hidden on phones (two across is the
 * readable width there); it is lazy, so a hidden tile costs no bytes until it intersects.
 *
 * `band` wraps the row in a white band + Container for the homepage, where it sits between the
 * full-bleed hero and the trust bar rather than inside a Section.
 */
export function FieldStrip({
  route,
  cols = 3,
  className,
  band = false,
}: {
  route: string;
  cols?: 2 | 3;
  className?: string;
  band?: boolean;
}) {
  const images = stripFor(route).slice(0, cols);
  if (images.length < 2) return null;
  const three = images.length === 3;

  const list = (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4",
        three ? "sm:grid-cols-3" : "sm:grid-cols-2",
        !band && className,
      )}
    >
      {images.map((img, i) => (
        <li key={img.id} className={cn(three && i === 2 && "hidden sm:block")}>
          <Figure image={img} priority={i === 0} caption={false} />
        </li>
      ))}
    </ul>
  );

  if (!band) return list;
  return (
    <div className={cn("bg-white pt-6 sm:pt-8", className)}>
      <Container>{list}</Container>
    </div>
  );
}
