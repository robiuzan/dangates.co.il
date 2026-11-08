import { ChevronDown } from "lucide-react";

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
 *   - the chevron rotates on [open] via the group-open variant; min-h-11 keeps a 44px tap target
 */
export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
      {items.map((item, i) => (
        <details key={item.q} name="faq" open={i === 0} className="group">
          <summary className="flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-start focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-secondary [&::-webkit-details-marker]:hidden">
            <h3 className="font-heading text-base font-semibold text-primary">
              {item.q}
            </h3>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
