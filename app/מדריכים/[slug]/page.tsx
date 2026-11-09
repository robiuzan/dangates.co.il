import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findGuide, guideList } from "@/lib/guides";
import { GuideView, guideMetadata } from "@/components/article/GuideView";

export function generateStaticParams(): { slug: string }[] {
  return guideList.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = findGuide(params.slug);
  return g ? guideMetadata(g) : {};
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const g = findGuide(params.slug);
  if (!g) notFound();
  return <GuideView guide={g} />;
}
