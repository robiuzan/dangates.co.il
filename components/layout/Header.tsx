import Link from "next/link";
import { Phone } from "lucide-react";
import { SiteImage } from "@ishub/site-kit/components";
import { siteConfig, telHref } from "@/lib/site-config";
import { headerCopy } from "@/lib/content";
import { headerLinks, headerMenus } from "@/lib/nav";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";

/**
 * Server shell: logo and call button. The two navigation leaves (desktop, mobile) are the only client
 * code; the link data goes to `DesktopNav` alone and `MobileMenu` renders inside it.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-heading text-xl font-extrabold text-primary sm:text-2xl"
          aria-label={`${siteConfig.name} — ${headerCopy.homeLabel}`}
        >
          {/* Decorative: the link already has its accessible name (aria-label + visible text). */}
          <SiteImage
            src="/dangates-logo.png"
            decorative
            width={250}
            height={250}
            fixed
            priority
            className="h-10 w-10 shrink-0"
          />
          <span>{siteConfig.name}</span>
        </Link>

        <DesktopNav
          menus={headerMenus}
          links={headerLinks}
          navLabel={headerCopy.navLabel}
        >
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
        </DesktopNav>
      </Container>
    </header>
  );
}
