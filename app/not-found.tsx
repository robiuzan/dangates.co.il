import type { Metadata } from "next";
import Link from "next/link";
import { ogBase } from "@/lib/seo";

/**
 * 404 — הדף לא נמצא.
 *
 * Two overrides, for the same reason: this page must claim no URL of its own.
 *
 * `alternates.canonical: null` stops it inheriting the root canonical from app/layout.tsx, which is
 * what made every broken URL declare itself a duplicate of the homepage before (backlog §1.2). The
 * `openGraph` block does the same job for the same claim in a different channel: the layout sets
 * `openGraph.url` for the root, and the 404 inherited it the moment og:url shipped sitewide
 * (§1.5) — social and AI fetchers read og:url as the page's identity and `noindex` does not stop
 * them. Next replaces a parent `openGraph` wholesale rather than merging (see lib/seo.ts), so
 * spreading `ogBase` without a `url` keeps the share image and drops the claim. `url: null` is not
 * an option — unlike `alternates.canonical`, Next's OpenGraph type rejects it. `titles.mjs` now
 * fails if either tag comes back.
 *
 * No `robots` key here on purpose — Next already emits `<meta name="robots" content="noindex">`
 * on the 404 route, and setting it again produces a duplicate tag.
 */
export const metadata: Metadata = {
  title: "הדף לא נמצא",
  description: "הדף שחיפשתם לא נמצא באתר דן שערים חשמליים.",
  alternates: { canonical: null },
  openGraph: { ...ogBase },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-heading text-5xl font-extrabold text-primary">404</h1>
      <p className="mt-4 text-gray-600">הדף שחיפשתם לא נמצא.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
