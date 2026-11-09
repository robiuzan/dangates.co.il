import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { posts, getPost, type Post, type PostBlock } from "@/lib/posts";
import { manifest } from "@/lib/site-config";
import { crumbLabels, postSeo } from "@/lib/content";
import { ogBase, routeUrl } from "@/lib/seo";
import { articleJsonLd, businessNode } from "@/lib/jsonld";
import { relatedAttr } from "@/lib/engagement";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { slug: string }[] {
  return posts.map((p) => ({ slug: p.slug }));
}

// `Post.slug` is a plain string, so the map cannot be typed against a slug union. A key that names
// no real post (a typo, a renamed or removed post) throws at module load, which fails the build.
for (const key of Object.keys(postSeo)) {
  const target = key.normalize("NFC");
  if (!posts.some((p) => p.slug.normalize("NFC") === target)) {
    throw new Error(`postSeo has a key that is not a post slug: ${key}`);
  }
}

/** The <title> subject and meta description for one post; each falls back to the post's own field. */
function postMeta(post: Post): { title: string; description: string } {
  const seo = postSeo[post.slug];
  return {
    title: seo?.title ?? post.title,
    description: seo?.description ?? post.excerpt,
  };
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = routeUrl(`blog/${post.slug}`);
  const { title, description } = postMeta(post);
  return {
    alternates: { canonical: url },
    title,
    description,
    openGraph: {
      ...ogBase,
      type: "article",
      url,
      title,
      description,
    },
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

  // Handed to PageHeader, which renders them with the page's breadcrumb as ONE @graph. The
  // business node rides along because the article's `author` and `publisher` point at it.
  const nodes = [
    businessNode(manifest),
    articleJsonLd(manifest, {
      type: "BlogPosting",
      path: `/blog/${post.slug}/`,
      headline: post.title,
      description: postMeta(post).description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      isPartOf: { path: "/blog/", name: crumbLabels.blog },
    }),
  ];

  return (
    <>
      <PageHeader
        title={post.title}
        subtitle={DATE_FMT.format(new Date(post.date))}
        nodes={nodes}
        crumbs={[
          { label: crumbLabels.home, href: "/" },
          { label: crumbLabels.blog, href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}/` },
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
                  {...relatedAttr("post")}
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
