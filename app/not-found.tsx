import type { Metadata } from "next";
import Link from "next/link";

/**
 * 404 — הדף לא נמצא.
 *
 * `alternates.canonical: null` is the fix that matters: without it the page inherits the root
 * canonical from app/layout.tsx and every broken URL declares itself a duplicate of the
 * homepage, which is exactly what shipped before.
 *
 * No `robots` key here on purpose — Next already emits `<meta name="robots" content="noindex">`
 * on the 404 route, and setting it again produces a duplicate tag.
 */
export const metadata: Metadata = {
  title: "הדף לא נמצא",
  description: "הדף שחיפשתם לא נמצא באתר דן שערים חשמליים.",
  alternates: { canonical: null },
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
