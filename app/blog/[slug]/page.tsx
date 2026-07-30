import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { posts, getPost, type PostBlock } from "@/lib/posts";
import { manifest, siteConfig } from "@/lib/site-config";
import { jsonLdScript } from "@ishub/site-kit/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { slug: string }[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    alternates: { canonical: `/blog/${post.slug}/` },
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt },
  };
}

const DATE_FMT = new Intl.DateTimeFormat("he-IL", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Group consecutive `li` blocks into `<ul>`, render `h`→`<h2>` and `p`→`<p>`. */
function renderBlocks(blocks: PostBlock[]) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: number) => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key}`} className="my-4 list-disc space-y-2 ps-6 text-gray-700">
          {list.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  blocks.forEach((b, i) => {
    if (b.type === "li") {
      list.push(b.text);
      return;
    }
    flush(i);
    if (b.type === "h") {
      out.push(
        <h2 key={i} className="mt-8 font-heading text-xl font-bold text-primary">
          {b.text}
        </h2>,
      );
    } else {
      out.push(
        <p key={i} className="mt-4 leading-relaxed text-gray-700">
          {b.text}
        </p>,
      );
    }
  });
  flush(blocks.length);
  return out;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "he-IL",
    mainEntityOfPage: `${manifest.url}/blog/${post.slug}/`,
    author: { "@type": "Organization", name: siteConfig.name, url: manifest.url },
    publisher: {
      "@type": manifest.schema?.type ?? "Organization",
      "@id": `${manifest.url}/#business`,
      name: siteConfig.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <PageHeader
        title={post.title}
        subtitle={DATE_FMT.format(new Date(post.date))}
        crumbs={[
          { label: "בית", href: "/" },
          { label: "בלוג", href: "/blog" },
          { label: post.title },
        ]}
      />

      <Section tone="white">
        <article className="mx-auto max-w-3xl">{renderBlocks(post.blocks)}</article>

        <div className="mx-auto mt-14 max-w-3xl border-t border-gray-100 pt-10">
          <h2 className="font-heading text-xl font-bold text-primary">מאמרים נוספים</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/blog/${o.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary"
                >
                  {o.title}
                  <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
