import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FAQ as native disclosures (backlog N8) — a server component: no "use client", no state, no
 * hydration JS. Every answer stays in the DOM, so find-in-page, crawlers and the FAQPage JSON-LD
 * (faqJsonLd on app/page.tsx) all see the same questions and answers the visitor can open.
 *
 *   - <summary> is the first child of <details>; the <h3> sits inside it so heading navigation
 *     still works
 *   - `open` on the first item keeps the accordion's old default
 *   - `name="faq"` makes the group exclusive where supported (one open at a time) and degrades to
 *     independent disclosures elsewhere
 *   - an optional `moreAt` renders as a real <Link> in its own paragraph AFTER the answer paragraph,
 *     inside the <details> body — the answer text itself stays clean, so it is byte-identical to
 *     what faqJsonLd receives (callers pass only { q, a } to the schema)
 *   - the chevron rotates on [open] via the group-open variant; min-h-11 keeps a 44px tap target
 */
export interface FaqItem {
  q: string;
  a: string;
  /** A link-out to the route that answers this question in full; visible only, never in JSON-LD. */
  moreAt?: { href: string; label: string };
}

export interface FaqProps {
  items: readonly FaqItem[];
  /**
   * Optional H2 rendered above the list, inside a wrapper that carries `id`. The homepage omits it
   * (its heading is a SectionHeading outside this component) and gets the unchanged markup.
   */
  heading?: string;
  /** Anchor id for the heading wrapper; only used together with `heading`. */
  id?: string;
  /** The `name` of the <details> group — one open at a time per name. Default "faq". */
  name?: string;
  /** Extra classes for the list box; merged over the homepage defaults (centred, `mt-10`). */
  className?: string;
}

export function Faq({ items, heading, id, name = "faq", className }: FaqProps) {
  const list = (
    <div
      className={cn(
        "mx-auto mt-10 max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white",
        className,
      )}
    >
      {items.map((item, i) => (
        <details key={item.q} name={name} open={i === 0} className="group">
          <summary className="flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-start focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-secondary [&::-webkit-details-marker]:hidden">
            <h3 className="font-heading text-base font-semibold text-primary">
              {item.q}
            </h3>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
            <p>{item.a}</p>
            {item.moreAt && (
              <p className="mt-3">
                <Link
                  href={item.moreAt.href}
                  data-cta="faq-more"
                  className="inline-flex min-h-11 items-center font-semibold text-secondary underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  {item.moreAt.label}
                </Link>
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );

  if (!heading) return list;
  return (
    <div id={id}>
      <h2 className="font-heading text-xl font-bold text-primary">{heading}</h2>
      {list}
    </div>
  );
}
