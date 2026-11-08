import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig, telHref } from "@/lib/site-config";
import { headerCopy, navItems } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";

/** Server shell: logo, desktop nav and call button. The mobile menu is the one client leaf. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold text-primary"
          aria-label={`${siteConfig.name} — ${headerCopy.homeLabel}`}
        >
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label={headerCopy.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={telHref}
            data-cta="header-call"
            variant="accent"
            className="hidden sm:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span dir="ltr">{siteConfig.phone}</span>
          </Button>

          <MobileMenu
            items={navItems}
            phone={siteConfig.phone}
            phoneHref={telHref}
            labels={{
              navLabel: headerCopy.mobileNavLabel,
              openMenu: headerCopy.openMenu,
              closeMenu: headerCopy.closeMenu,
              callNow: headerCopy.callNow,
            }}
          />
        </div>
      </Container>
    </header>
  );
}
