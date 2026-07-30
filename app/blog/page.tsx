import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { posts } from "@/lib/posts";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/blog/" },
  title: "בלוג",
  description:
    "טיפים מקצועיים וחדשות מהתחום — מדריכים על תיקון, תחזוקה, בטיחות ושדרוג של שערים חשמליים, מאת דן שערים חשמליים.",
};

const DATE_FMT = new Intl.DateTimeFormat("he-IL", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        title="הבלוג של דן שערים חשמליים"
        subtitle="טיפים מקצועיים וחדשות מהתחום — כל מה שכדאי לדעת על תיקון, תחזוקה ובטיחות של שערים חשמליים."
        crumbs={[{ label: "בית", href: "/" }, { label: "בלוג" }]}
      />

      <Section tone="white">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {sorted.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <time dateTime={post.date} className="text-xs font-medium text-secondary">
                {DATE_FMT.format(new Date(post.date))}
              </time>
              <h2 className="mt-2 font-heading text-lg font-bold text-primary">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:gap-2"
              >
                קראו עוד
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
