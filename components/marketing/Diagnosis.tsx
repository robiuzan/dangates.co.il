import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeDiagnosisCopy } from "@/lib/content";

/**
 * Homepage: how a fault is diagnosed and how the price is formed (backlog §3.13, §6.2). Copy is
 * `homeDiagnosisCopy`. A server component — static prose, an ordered list and one link.
 */
export function Diagnosis() {
  return (
    <Section id="diagnosis" tone="muted">
      <SectionHeading
        eyebrow={homeDiagnosisCopy.eyebrow}
        title={homeDiagnosisCopy.heading}
        subtitle={homeDiagnosisCopy.intro}
      />

      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {homeDiagnosisCopy.checks.map((check, i) => (
          <li
            key={check.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-50 font-heading text-base font-bold text-secondary">
              {i + 1}
            </span>
            <h3 className="mt-4 font-heading text-lg font-bold text-primary">
              {check.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{check.body}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-12 max-w-3xl">
        <h3 className="font-heading text-xl font-bold text-primary">
          {homeDiagnosisCopy.priceHeading}
        </h3>
        {homeDiagnosisCopy.priceParagraphs.map((text) => (
          <p key={text} className="mt-3 leading-relaxed text-gray-700">
            {text}
          </p>
        ))}
        <p className="mt-5">
          <Link
            href={homeDiagnosisCopy.link.href}
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-secondary underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            {homeDiagnosisCopy.link.label}
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </div>
    </Section>
  );
}
