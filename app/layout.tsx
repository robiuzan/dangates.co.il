import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { siteConfig, manifest } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { FONT_PRELOADS } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { gtmHeadSnippet, gtmNoScriptSrc } from "@ishub/site-kit/analytics";
import "./globals.css";

// Brand font — Rubik (used for both body and headings, matching the live dangates.co.il site).
// Exposed as a CSS variable consumed by globals.css (@theme font-sans / font-heading).
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  // Homepage canonical. Every other route sets its own in page metadata, so nothing
  // inherits this — see the skyshade regression where a root canonical with no per-page
  // overrides made all 33 pages claim to be the homepage. (The 37 legacy redirect stubs
  // in public/ carry their own hand-written canonicals and are unaffected.)
  alternates: { canonical: "/" },
  title: {
    default: `${siteConfig.name} – תיקון והתקנת שערים חשמליים`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  // Search Console HTML-tag verification. Inert until the owner puts a token in the roster
  // manifest (analytics.googleSiteVerification, null today), exactly like the GTM loader —
  // the slot has existed in the manifest since the rebuild with nothing reading it, so the
  // meta-tag route silently no-opped. The DNS TXT method needs nothing here.
  ...(manifest.analytics?.googleSiteVerification
    ? { verification: { google: manifest.analytics.googleSiteVerification } }
    : {}),
  // Every route overrides this wholesale with its own `openGraph` (see lib/seo.ts) — kept as
  // the fallback for any route that does not (app/not-found.tsx).
  openGraph: { ...ogBase, url: routeUrl("") },
};

/** Shared GTM loader — inert (renders nothing) until analytics.gtmId is set in the manifest. */
const gtmHead = gtmHeadSnippet(manifest.analytics?.gtmId);
const gtmNoScript = gtmNoScriptSrc(manifest.analytics?.gtmId);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // rubik.className applies the font directly (not just the --font-rubik variable
    // globals.css reads) — the documented Next 14 recipe for automatic font preloading.
    <html lang="he" dir="rtl" className={cn(rubik.variable, rubik.className)}>
      <head>
        {/* Hand-added preload for the two Rubik faces (hebrew + latin) — Next's own
            font-manifest preload injection never fires on this toolchain; see lib/fonts.ts
            for why and how to keep these two hrefs in sync with the build. */}
        {FONT_PRELOADS.map((font) => (
          <link
            key={font.href}
            rel="preload"
            as="font"
            type="font/woff2"
            href={font.href}
            crossOrigin="anonymous"
          />
        ))}
        {manifest.images?.mediaHost && (
          <link
            rel="preconnect"
            href={`https://${manifest.images.mediaHost}`}
            crossOrigin=""
          />
        )}
        {gtmHead && (
          <script id="gtm-init" dangerouslySetInnerHTML={{ __html: gtmHead }} />
        )}
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        {gtmNoScript && (
          <noscript>
            <iframe
              src={gtmNoScript}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Spacer so the fixed mobile CTA bar never overlaps footer content. */}
        <div className="h-16 lg:hidden" aria-hidden />
        <MobileCtaBar />
      </body>
    </html>
  );
}
