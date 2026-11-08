import Link from "next/link";
import { manifest } from "@/lib/site-config";
import { jsonLdScript } from "@ishub/site-kit/seo";
import { breadcrumbNode, graph, type JsonLd } from "@/lib/jsonld";
import { Container } from "@/components/ui/Container";

export interface Crumb {
  label: string;
  /**
   * Path for this crumb, site-relative and starting with "/".
   *
   * REQUIRED, including on the last crumb (the current page). The last crumb still renders as
   * plain text rather than a link — that is positional, not driven by this field — but
   * `BreadcrumbList` needs a resolvable `item` for every position, so the path must exist.
   */
  href: string;
}

/**
 * Inner-page hero band: breadcrumb + title + optional subtitle.
 *
 * Also emits the page's JSON-LD: ONE script holding ONE `@graph` — the `nodes` the page hands in
 * (business, Service, BlogPosting …) plus the `BreadcrumbList`, built from the SAME `crumbs` array
 * this component renders. That coupling is deliberate: the visible trail and the structured data
 * cannot drift, and a page never builds its own breadcrumb or its own script — so it can never carry
 * two (44 routes — all but `/` and `/404`). `lib/jsonld.ts` `breadcrumbNode` does the `{ label, href }`
 * → `{ name, path }` mapping and the trailing-slash / percent-encoding, so the `item` URLs byte-match
 * the canonical.
 */
export function PageHeader({
  title,
  subtitle,
  crumbs,
  nodes = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  /** Page-specific JSON-LD nodes. Site-local, so no `@context` of their own. */
  nodes?: JsonLd[];
}) {
  const hasCrumbs = crumbs && crumbs.length > 0;

  return (
    <div className="bg-primary text-white">
      {(hasCrumbs || nodes.length > 0) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(
              graph(...nodes, hasCrumbs && breadcrumbNode(manifest, crumbs)),
            ),
          }}
        />
      )}
      <Container className="py-12 sm:py-16">
        {hasCrumbs && (
          <nav aria-label="פירורי לחם" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
              {crumbs.map((c, i) => {
                const isCurrent = i === crumbs.length - 1;
                return (
                  <li key={c.href} className="flex items-center gap-1.5">
                    {isCurrent ? (
                      <span className="text-white/90" aria-current="page">
                        {c.label}
                      </span>
                    ) : (
                      <Link href={c.href} className="hover:text-white">
                        {c.label}
                      </Link>
                    )}
                    {!isCurrent && <span aria-hidden>/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-white/85">{subtitle}</p>}
      </Container>
    </div>
  );
}
