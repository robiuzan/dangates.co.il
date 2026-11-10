import Link from "next/link";
import { locations, services } from "@/lib/site-config";
import { familyLinksCopy } from "@/lib/content";
import { guidePath } from "@/lib/guides";
import type { Guide } from "@/lib/guide-types";
import { cn } from "@/lib/utils";

/**
 * The compact all-types, all-areas block (ADR 0005). Navigation, not evidence of coverage: it
 * follows the curated related lists, which stay and still lead. Deliberately bare — no card class,
 * no chevron, no `relatedAttr` — the link styling sits once on each <ul> through child selectors, so
 * a link prints no class attribute at all (the export has little headroom left).
 */
const listClass =
  "mt-2 flex flex-wrap gap-x-5 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:text-sm [&_a]:font-medium [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary";
const currentClass = "inline-flex min-h-11 items-center text-sm font-bold text-gray-700";
const labelClass = "mt-4 text-sm font-semibold text-gray-600";
const headingId = "family-links-heading";

export function FamilyLinks({
  current,
  showServices = true,
  showLocations = true,
  guides,
  heading = familyLinksCopy.heading,
  className,
}: {
  current?: { kind: "service" | "location"; slug: string };
  showServices?: boolean;
  showLocations?: boolean;
  guides?: readonly Guide[];
  heading?: string;
  className?: string;
}) {
  const item = (kind: "service" | "location", slug: string, name: string) => (
    <li key={slug}>
      {current?.kind === kind && current.slug === slug ? (
        <span aria-current="page" className={currentClass}>
          {name}
        </span>
      ) : (
        <Link href={`/${kind === "service" ? "services" : "locations"}/${slug}/`}>
          {name}
        </Link>
      )}
    </li>
  );

  return (
    <nav aria-labelledby={headingId} className={cn(className)}>
      <h2 id={headingId} className="font-heading text-xl font-bold text-primary">
        {heading}
      </h2>
      {showServices && (
        <>
          <p className={labelClass}>{familyLinksCopy.servicesLabel}</p>
          <ul className={listClass}>
            {services.map((s) => item("service", s.slug, s.name))}
          </ul>
        </>
      )}
      {showLocations && (
        <>
          <p className={labelClass}>{familyLinksCopy.locationsLabel}</p>
          <ul className={listClass}>
            {locations.map((l) => item("location", l.slug, l.name))}
          </ul>
        </>
      )}
      {guides && guides.length > 0 && (
        <>
          <p className={labelClass}>{familyLinksCopy.guidesLabel}</p>
          <ul className={listClass}>
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={guidePath(g.slug)}>{g.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
}
