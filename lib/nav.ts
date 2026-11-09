/**
 * nav.ts — the header navigation, composed. `navItems` (lib/content.ts) is the fixed set; the
 * guides hub joins it only while the registry holds a guide, so a build with no guides ships no link
 * to an empty hub. The entry sits after the pricing page, ahead of the blog. The footer reads
 * `hasGuides` and `guidesNavItem` directly.
 *
 * Two of the entries — the services hub and the service-areas hub — are not plain links in the
 * header: each opens a disclosure that lists every service / every location (`headerMenus`, built
 * from `services` / `locations`, so a new entry appears without a hand edit). `headerLinks` is
 * what is left for the plain links.
 */
import { guidesNavItem, headerMenuCopy, navItems } from "@/lib/content";
import { hasGuides } from "@/lib/guides";
import { locations, services } from "@/lib/site-config";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavMenu {
  id: "services" | "areas";
  /** The trigger's text. */
  label: string;
  /** The hub page — the first link inside the panel. */
  hub: NavItem;
  /** One link per service / location. */
  links: readonly NavItem[];
}

export const headerNav: readonly NavItem[] = hasGuides
  ? navItems.flatMap((item): NavItem[] =>
      item.href === "/blog/" ? [guidesNavItem, item] : [item],
    )
  : navItems;

export const headerMenus: readonly NavMenu[] = [
  {
    id: "services",
    label: headerMenuCopy.services.label,
    hub: { label: headerMenuCopy.services.allLabel, href: headerMenuCopy.services.href },
    links: services.map((s) => ({ label: s.name, href: `/services/${s.slug}/` })),
  },
  {
    id: "areas",
    label: headerMenuCopy.areas.label,
    hub: { label: headerMenuCopy.areas.allLabel, href: headerMenuCopy.areas.href },
    links: locations.map((l) => ({ label: l.name, href: `/locations/${l.slug}/` })),
  },
];

const menuHubs = new Set<string>(headerMenus.map((m) => m.hub.href));

/** The header entries that stay plain links: everything except the two hubs the disclosures replace. */
export const headerLinks: readonly NavItem[] = headerNav.filter(
  (item) => !menuHubs.has(item.href),
);
