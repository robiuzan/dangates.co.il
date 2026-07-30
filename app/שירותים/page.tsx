import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/שירותים/" },
  title: "השירותים שלנו",
  description:
    "שירותי תיקון והתקנת שערים חשמליים: שערים נגררים, שערי כנף, שערים מתרוממים, שערים לחניה, שער זרוע, תריסי גלילה חשמליים ושערים לדירה — עם אחריות מלאה ושירות מהיר.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="השירותים שלנו"
        subtitle="פתרון לכל סוג שער חשמלי — מתיקון תקלות ומנועים ועד התקנת שער חדש, עם שירות מהיר ואחריות מלאה."
        crumbs={[{ label: "בית", href: "/" }, { label: "השירותים שלנו" }]}
      />
      <ServicesGrid />
      <FinalCta />
    </>
  );
}
