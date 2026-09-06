import type { Metadata } from "next";
import { ogBase, routeUrl } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";

const pricingUrl = routeUrl("מחירון");
const pricingTitle = "מחירון תיקון והתקנת שערים חשמליים";
const pricingDescription =
  "מחירון להתרשמות לתיקון והתקנת שערים חשמליים: ביקור טכנאי, תיקון מנוע, החלפת מסילה, תחזוקה והתקנת שער חדש. עלות ביקור טכנאי 150–350 ₪; המחיר הסופי לפי אבחון.";

export const metadata: Metadata = {
  alternates: { canonical: pricingUrl },
  title: pricingTitle,
  description: pricingDescription,
  openGraph: {
    ...ogBase,
    url: pricingUrl,
    title: pricingTitle,
    description: pricingDescription,
  },
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        title="מחירון תיקון והתקנת שערים חשמליים"
        subtitle="מחירים הוגנים ושקופים. הטווחים מובאים להתרשמות; המחיר הסופי נקבע לאחר אבחון בשטח — תמיד ברור מראש."
        crumbs={[
          { label: "בית", href: "/" },
          { label: "מחירון", href: "/מחירון/" },
        ]}
      />
      <PricingTeaser />
      <Section tone="muted">
        <p className="mx-auto max-w-2xl text-center text-sm text-gray-500">
          הטווחים מובאים להתרשמות בלבד ועשויים להשתנות לפי סוג השער, מצבו, סוג המנוע
          והחלקים הנדרשים. עלות ביקור טכנאי לבדיקה היא 150–350 ₪. המחיר המחייב יינתן רק
          לאחר אבחון בשטח.
        </p>
      </Section>
    </>
  );
}
