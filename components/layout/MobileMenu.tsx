"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Id shared by the panel and the toggle's aria-controls. */
const MENU_ID = "mobile-menu";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Tailwind `lg` — the menu is `lg:hidden`, so an open menu must close when the layout leaves it. */
const DESKTOP_QUERY = "(min-width: 1024px)";

type MobileMenuProps = {
  items: readonly { label: string; href: string }[];
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
 * The only client leaf of the header: toggle + panel. Everything it needs arrives as props from
 * the server shell, so the content module stays out of the client bundle.
 *
 * While open: Escape closes and returns focus to the toggle, Tab and Shift+Tab cycle through the
 * toggle and the panel's links, and the page behind does not scroll. The panel is positioned
 * against the sticky <header>, so it overlays the page instead of pushing it down.
 */
export function MobileMenu({ items, phone, phoneHref, labels }: MobileMenuProps) {
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
        ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)),
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

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousBody;
    };
  }, [open]);

  const close = () => setOpen(false);

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
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-2 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            href={phoneHref}
            data-cta="header-call"
            variant="accent"
            size="lg"
            className="mt-3 w-full"
            onClick={close}
          >
            <Phone className="h-5 w-5" aria-hidden />
            {labels.callNow} <span dir="ltr">{phone}</span>
          </Button>
        </Container>
      </div>
    </>
  );
}
