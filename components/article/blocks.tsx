import { Info, MessageCircle, Phone, TriangleAlert } from "lucide-react";
import { services, telHref, whatsappHref, type ServiceSlug } from "@/lib/site-config";
import {
  guideQuoteWhatsappMessage,
  guideWhatsappMessage,
  guidesCopy,
} from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * The block-level pieces of a guide body (ADR 0003). All server components — nothing here needs
 * state, and a guide should ship as close to zero client JS as the site's other pages. Labels come
 * from `guidesCopy` in lib/content.ts; the block text arrives as props.
 *
 * RTL: horizontal spacing uses logical utilities only (`ps-*`, `border-s-*`, `text-start`).
 */

/**
 * The AEO unit. Question-form heading + a self-contained 40–60 word answer, sitting in the first
 * screenful so an assistant or a featured snippet can lift it whole (docs/content-standards.md §5).
 * Plain prose in the DOM — never behind a disclosure — so it is extractable at first paint.
 */
export function AnswerBlock({ q, a, id }: { q: string; a: string; id: string }) {
  return (
    <div className="mt-8 first:mt-0">
      <h2 id={id} className="scroll-mt-24 font-heading text-xl font-bold text-primary">
        {q}
      </h2>
      <p className="mt-3 border-s-4 border-accent bg-gray-50 py-3 ps-4 pe-4 text-lg leading-relaxed text-gray-800">
        {a}
      </p>
    </div>
  );
}

/**
 * The block that earns citations. The caption is a real `<caption>`, visible: it names what the
 * rows are and where they came from, which is what lets someone quote the table with attribution.
 * The first cell of each row is a row header. Wrapped in its own overflow container so a wide table
 * scrolls itself rather than the page.
 */
export function ArticleTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-start text-sm">
        <caption className="px-4 py-3 text-start text-sm font-semibold text-gray-700">
          {caption}
        </caption>
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-start font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th
                    key={j}
                    scope="row"
                    className="px-4 py-3 text-start align-top font-medium text-gray-800"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={j} className="px-4 py-3 align-top text-gray-600">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** `warn` is the safety gate: the point past which the reader stops and calls. Colours are tokens. */
export function Callout({ tone, text }: { tone: "note" | "warn"; text: string }) {
  const isWarn = tone === "warn";
  const Icon = isWarn ? TriangleAlert : Info;
  return (
    <div
      role="note"
      className={cn(
        "mt-6 flex gap-3 rounded-xl border-s-4 p-4",
        isWarn
          ? "border-accent-600 bg-accent-50 text-accent-foreground"
          : "border-secondary bg-secondary-50 text-gray-800",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          isWarn ? "text-accent-600" : "text-secondary",
        )}
        aria-hidden
      />
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}

/**
 * The two in-guide conversion treatments.
 *
 * `quote` is the photo-or-video-to-WhatsApp bridge: a gate fault is visual, the reader cannot always
 * name it, and a picture is a ten-second action on a channel already open on their phone. `inline`
 * is the quieter end-of-section form. The cap (`familyCtaCap`, at most one `quote`) is enforced in
 * lib/guides.ts — a CTA earns its place by resolving the uncertainty the paragraph above just
 * created, not by appearing at a scroll depth. Buttons are `size="lg"`: tap-first on a phone.
 */
export function InlineCta({
  text,
  variant = "inline",
  service,
  guideTitle,
}: {
  text: string;
  variant?: "inline" | "quote";
  service?: ServiceSlug;
  guideTitle: string;
}) {
  const serviceName = service
    ? services.find((s) => s.slug === service)?.name
    : undefined;
  const isQuote = variant === "quote";
  const message = isQuote
    ? guideQuoteWhatsappMessage(serviceName)
    : guideWhatsappMessage(guideTitle, serviceName);

  return (
    <aside
      className={cn(
        "mt-8 rounded-2xl p-6",
        isQuote ? "bg-primary text-white" : "border border-gray-100 bg-gray-50",
      )}
    >
      <p
        className={cn(
          "font-heading text-base font-bold",
          isQuote ? "text-white" : "text-primary",
        )}
      >
        {text}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          href={whatsappHref(message)}
          data-cta={isQuote ? "article-quote-whatsapp" : "article-inline-whatsapp"}
          variant="whatsapp"
          size="lg"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          {isQuote ? guidesCopy.quoteWhatsappLabel : guidesCopy.whatsappLabel}
        </Button>
        <Button
          href={telHref}
          data-cta={isQuote ? "article-quote-call" : "article-inline-call"}
          variant={isQuote ? "accent" : "outline"}
          size="lg"
        >
          <Phone className="h-5 w-5" aria-hidden />
          {guidesCopy.callLabel}
        </Button>
      </div>
    </aside>
  );
}
