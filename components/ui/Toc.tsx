import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { tocLabel } from "@/lib/content";
import type { TocItem } from "@/lib/toc";

/**
 * Table of contents — a server component, no JS. One `<nav>` landmark holding a native
 * `<details>`: collapsed by default so it never pushes the answer block below the fold on a phone,
 * and the same single element on a desktop (no second, hidden copy to double the landmark).
 *
 * Place it directly after the page's answer block. The links are plain `#id` anchors; the matching
 * headings carry `id` and `scroll-mt-24`, so the 64px sticky header never covers a target.
 * `data-toc` is the hook the engagement leaf reads for `toc_click`. Renders nothing for an empty
 * list (`buildToc` returns `[]` below the bar).
 */
export function Toc({
  items,
  className,
}: {
  items: readonly TocItem[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={tocLabel} data-toc className={cn("mt-6", className)}>
      <details className="group rounded-2xl border border-gray-200 bg-gray-50">
        <summary className="flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-start font-heading text-base font-semibold text-primary focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-secondary [&::-webkit-details-marker]:hidden">
          {tocLabel}
          <ChevronDown
            className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <ol className="list-decimal ps-11 pe-5 pb-3 text-gray-700">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="inline-flex min-h-11 items-center font-medium text-secondary underline-offset-4 hover:text-primary hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
