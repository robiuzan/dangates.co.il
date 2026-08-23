import Link from "next/link";
import { manifest } from "@/lib/site-config";
import { breadcrumbJsonLd, jsonLdScript } from "@ishub/site-kit/seo";
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
 * Normalises a crumb href into the exact string the page's canonical uses, so the
 * `BreadcrumbList` `item` byte-matches it:
 *   - trailing slash, because the export runs with `trailingSlash: true`
 *   - percent-encoded, because canonicals and sitemap <loc> are (app/sitemap.ts does the same)
 */
function schemaPath(href: string): string {
  return encodeURI(href.endsWith("/") ? href : `${href}/`);
}

/**
 * Inner-page hero band: breadcrumb + title + optional subtitle.
 *
 * Also emits the page's `BreadcrumbList` JSON-LD, built from the SAME `crumbs` array it renders.
 * That coupling is deliberate: the visible trail and the structured data cannot drift, and every
 * page using this component gets breadcrumb markup for free (44 routes — all but `/` and `/404`).
 *
 * NOTE the kit's `breadcrumbJsonLd` takes `{ name, path }`, NOT `{ name, url }` and NOT the
 * `Crumb` shape. Passing `Crumb[]` through unmapped throws at build time, and mapping `href` to
 * the wrong key silently emits `https://dangates.co.il/undefined`.
 */
export function PageHeader({
  title,
  subtitle,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
}) {
  const hasCrumbs = crumbs && crumbs.length > 0;

  return (
    <div className="bg-primary text-white">
      {hasCrumbs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(
              breadcrumbJsonLd(
                manifest,
                crumbs.map((c) => ({ name: c.label, path: schemaPath(c.href) })),
              ),
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
