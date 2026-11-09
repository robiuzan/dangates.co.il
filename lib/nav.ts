/**
 * nav.ts — the header navigation, composed. `navItems` (lib/content.ts) is the fixed set; the
 * guides hub joins it only while the registry holds a guide, so a build with no guides ships no link
 * to an empty hub. The entry sits after the pricing page, ahead of the blog. The footer reads
 * `hasGuides` and `guidesNavItem` directly.
 */
import { guidesNavItem, navItems } from "@/lib/content";
import { hasGuides } from "@/lib/guides";

export interface NavItem {
  label: string;
  href: string;
}

export const headerNav: readonly NavItem[] = hasGuides
  ? navItems.flatMap((item): NavItem[] =>
      item.href === "/blog/" ? [guidesNavItem, item] : [item],
    )
  : navItems;
