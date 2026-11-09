"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { NavItem, NavMenu } from "@/lib/nav";
import { NavDataProvider } from "@/components/layout/nav-context";

/** Tailwind `lg` — the nav is `hidden lg:block`, so an open panel must close when the layout leaves it. */
const DESKTOP_QUERY = "(min-width: 1024px)";

const linkClass =
  "rounded text-sm font-medium text-gray-700 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type DesktopNavProps = {
  /** The disclosures — services, then service areas. */
  menus: readonly NavMenu[];
  /** The remaining plain links, after the disclosures. */
  links: readonly NavItem[];
  navLabel: string;
  /**
   * The rest of the header's end group, server-built (the call button and `MobileMenu`). It
   * renders as the <nav>'s sibling, so the DOM order is unchanged.
   */
  children?: ReactNode;
};

/**
 * The desktop navigation: two non-modal disclosures (every service, every location) and the plain
 * links. A client leaf because Escape and an outside click must close a panel, which native
 * <details> cannot do; everything it renders arrives as props from the server shell.
 *
 * Same pattern as `MobileMenu`: `aria-expanded` + `aria-controls` on the trigger, Escape closes and
 * returns focus to the trigger. No Tab trap and no scroll lock — the panel is not a modal — so
 * Tab or a click leaving the nav closes it instead. The panel is positioned against the sticky
 * <header>, so it overlays the page, and carries `data-live-block` while open so the seasonal card
 * never opens over it. The links are in the server-rendered HTML whether or not the script runs.
 *
 * It is also where the link data enters the client: `Header` hands `menus` and `links` to this leaf
 * ONLY, and `MobileMenu` (rendered as `children`) reads them back through `useNavData`. Passed to
 * both as props they were serialised into every page's RSC payload twice (audit 2026-11-09 L1).
 */
export function DesktopNav({ menus, links, navLabel, children }: DesktopNavProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const navData = useMemo(() => ({ menus, links }), [menus, links]);
  const rootRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (openId === null) return;
    const id = openId;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpenId(null);
      triggerRefs.current.get(id)?.focus();
    }
    function onOutside(event: Event) {
      const root = rootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setOpenId(null);
      }
    }

    const desktop = window.matchMedia(DESKTOP_QUERY);
    function onViewportChange(event: MediaQueryListEvent) {
      if (!event.matches) setOpenId(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [openId]);

  const close = () => setOpenId(null);

  return (
    <NavDataProvider value={navData}>
      <nav ref={rootRef} aria-label={navLabel} className="hidden lg:block">
        <ul className="flex items-center gap-6">
          {menus.map((menu) => {
            const open = openId === menu.id;
            const panelId = `nav-panel-${menu.id}`;
            return (
              <li key={menu.id}>
                <button
                  ref={(node) => {
                    if (node) triggerRefs.current.set(menu.id, node);
                    else triggerRefs.current.delete(menu.id);
                  }}
                  type="button"
                  className={cn(linkClass, "inline-flex min-h-10 items-center gap-1")}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : menu.id)}
                >
                  {menu.label}
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                    aria-hidden
                  />
                </button>

                <div
                  id={panelId}
                  className={cn(
                    "absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-gray-100 bg-white shadow-lg",
                    open ? "block" : "hidden",
                  )}
                  data-live-block={open ? "" : undefined}
                >
                  <Container className="py-6">
                    <ul className="grid grid-cols-4 gap-x-6 gap-y-1">
                      <li className="col-span-4 mb-2">
                        <Link
                          href={menu.hub.href}
                          className={cn(
                            linkClass,
                            "inline-block py-2 font-bold text-primary",
                          )}
                          onClick={close}
                        >
                          {menu.hub.label}
                        </Link>
                      </li>
                      {menu.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(linkClass, "block py-2")}
                            onClick={close}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Container>
                </div>
              </li>
            );
          })}
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </NavDataProvider>
  );
}
