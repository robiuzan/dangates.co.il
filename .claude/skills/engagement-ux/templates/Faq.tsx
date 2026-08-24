import { ChevronDown } from "lucide-react";

/**
 * FAQ as native disclosures — the replacement for components/marketing/Faq.tsx (backlog N8).
 *
 * Server component: no "use client", no state, no hydration JS. Every answer stays in the DOM
 * (FAQPage parity with the kit's faqJsonLd holds exactly as before) and is no longer display:none
 * for readers who do not click, for find-in-page, or for crawlers that honour visibility.
 *
 *   - <summary> MUST be the first child of <details>; the spec allows one heading element inside
 *     a summary, so the <h3> goes inside it (not around it) and heading navigation still works
 *   - `open` on the first item preserves the accordion's old default (useState(0))
 *   - `name="faq"` makes the group exclusive where supported (one open at a time) and degrades to
 *     independent disclosures elsewhere — no JS polyfill, on purpose (needs @types/react ≥ 18.2.66)
 *   - the chevron rotates on [open] via the group-open variant; no transition library
 *   - text-start, not text-right (CLAUDE.md §6); min-h-11 keeps the tap target at 44 px
 *
 * Keep the FaqItem shape: lib/content.ts `faqs` and faqJsonLd([...faqs]) on app/page.tsx consume it.
 * The engagement hook pushes `faq_open` from a document-level `toggle` listener; nothing here
 * needs an id for that — it reads the <summary> text.
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
          <summary className="flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-start [&::-webkit-details-marker]:hidden">
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
