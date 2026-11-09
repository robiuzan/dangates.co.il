import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { posts } from "@/lib/posts";
import { manifest } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { blogIndexMetaDescription, crumbLabels } from "@/lib/content";
import { itemListJsonLd } from "@/lib/jsonld";
import { isPageWritten, pageContent } from "@/lib/page-content";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContentBlock } from "@/components/marketing/ContentSections";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

const blogUrl = routeUrl("blog");
const blogDescription = blogIndexMetaDescription;

export const metadata: Metadata = {
  alternates: { canonical: blogUrl },
  title: "בלוג",
  description: blogDescription,
  openGraph: { ...ogBase, url: blogUrl, title: "בלוג", description: blogDescription },
};

const DATE_FMT = new Intl.DateTimeFormat("he-IL", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function BlogIndexPage() {
  const content = pageContent.blogIndex;
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  // The full array the grid renders, in the same order.
  const nodes = [
    itemListJsonLd(
      manifest,
      sorted.map((p) => ({ name: p.title, path: `/blog/${p.slug}/` })),
      { path: "/blog/", name: crumbLabels.blog, description: blogDescription },
    ),
  ];

  return (
    <>
      <PageHeader
        title="הבלוג של דן שערים חשמליים"
        // Once written, the answer block is the first paragraph in <main>, so the subtitle steps aside.
        subtitle={
          isPageWritten(content)
            ? undefined
            : "טיפים מקצועיים וחדשות מהתחום — כל מה שכדאי לדעת על תיקון, תחזוקה ובטיחות של שערים חשמליים."
        }
        nodes={nodes}
        crumbs={[
          { label: "בית", href: "/" },
          { label: "בלוג", href: "/blog/" },
        ]}
      />

      <PageContentBlock content={content} />

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
