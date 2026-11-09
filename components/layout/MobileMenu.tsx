"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useNavData } from "@/components/layout/nav-context";

const linkClass =
  "flex min-h-11 items-center rounded-lg px-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Id shared by the panel and the toggle's aria-controls. */
const MENU_ID = "mobile-menu";

const FOCUSABLE =
  'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * The panel holds collapsible groups (native <details>): a link inside a closed one cannot take
 * focus, so the Tab trap must not count it as the last stop. A <summary> is always reachable.
 */
function isReachable(el: HTMLElement): boolean {
  if (el.tagName === "SUMMARY") return true;
  const group = el.closest("details");
  return !group || group.open;
}

/** Tailwind `lg` — the menu is `lg:hidden`, so an open menu must close when the layout leaves it. */
const DESKTOP_QUERY = "(min-width: 1024px)";

type MobileMenuProps = {
  phone: string;
  phoneHref: string;
  labels: {
    navLabel: string;
    openMenu: string;
    closeMenu: string;
    callNow: string;
  };
};

/**
 * The mobile client leaf of the header: toggle + panel. It renders inside `DesktopNav`, which owns the
 * link data (`useNavData`). The list is built only while the panel is open: the toggle is the one way in and it needs the
 * script anyway, so rendering the 23 links into every page's HTML a second time (the desktop nav
 * already carries them) would only add weight to all 47 pages. Each group is a native <details>.
 *
 * While open: Escape closes and returns focus to the toggle, Tab and Shift+Tab cycle through the
 * toggle and the panel's reachable links and group summaries, the page behind does not scroll, and
 * following any link in the panel closes it. The panel is positioned
 * against the sticky <header>, so it overlays the page instead of pushing it down.
 */
export function MobileMenu({ phone, phoneHref, labels }: MobileMenuProps) {
  // The disclosures (as collapsible groups) and the plain links after them: read from `DesktopNav`'s
  // context, not from props, so the server hands the link data to ONE client leaf (audit L1).
  const { menus, links } = useNavData();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const toggle = toggleRef.current;
      const panel = panelRef.current;
      if (!toggle || !panel) return;

      const nodes = [
        toggle,
        ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isReachable),
      ];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      const active = document.activeElement;
      const inside = active instanceof HTMLElement && nodes.includes(active);
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    }

    const root = document.documentElement;
    const previousRoot = root.style.overflow;
    const previousBody = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const desktop = window.matchMedia(DESKTOP_QUERY);
    function onViewportChange(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }

    // Delegated: one listener on the panel instead of one per link.
    const panel = panelRef.current;
    function onPanelClick(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest("a[href]")) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    panel?.addEventListener("click", onPanelClick);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      panel?.removeEventListener("click", onPanelClick);
      desktop.removeEventListener("change", onViewportChange);
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousBody;
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
        aria-label={open ? labels.closeMenu : labels.openMenu}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden />
        ) : (
          <Menu className="h-6 w-6" aria-hidden />
        )}
      </button>

      <div
        ref={panelRef}
        id={MENU_ID}
        className={cn(
          "absolute inset-x-0 top-full max-h-[calc(100dvh-8rem)] overflow-y-auto border-t border-gray-100 bg-white shadow-lg lg:hidden",
          open ? "block" : "hidden",
        )}
        // While the menu is open the seasonal card (public/assets/live.js) never opens over it.
        data-live-block={open ? "" : undefined}
      >
        <Container className="py-4">
          <nav aria-label={labels.navLabel}>
            {open && (
              <ul className="flex flex-col gap-1">
                {menus.map((menu) => (
                  <li key={menu.id}>
                    <details className="group">
                      <summary
                        className={cn(
                          linkClass,
                          "cursor-pointer list-none justify-between [&::-webkit-details-marker]:hidden",
                        )}
                      >
                        {menu.label}
                        <ChevronDown
                          className="h-5 w-5 transition-transform group-open:rotate-180"
                          aria-hidden
                        />
                      </summary>
                      <ul
                        className={cn(
                          "grid gap-x-2 ps-3 pb-2",
                          menu.id === "areas" ? "grid-cols-2" : "grid-cols-1",
                        )}
                      >
                        <li className={menu.id === "areas" ? "col-span-2" : undefined}>
                          <Link
                            href={menu.hub.href}
                            className={cn(linkClass, "font-bold text-primary")}
                          >
                            {menu.hub.label}
                          </Link>
                        </li>
                        {menu.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className={linkClass}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
                {links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>
          <Button
            href={phoneHref}
            data-cta="header-call"
            variant="accent"
            size="lg"
            className="mt-3 w-full"
          >
            <Phone className="h-5 w-5" aria-hidden />
            {labels.callNow} <span dir="ltr">{phone}</span>
          </Button>
        </Container>
      </div>
    </>
  );
}
