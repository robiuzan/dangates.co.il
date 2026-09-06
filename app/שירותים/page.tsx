import type { Metadata } from "next";
import { ogBase, routeUrl } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { FinalCta } from "@/components/marketing/FinalCta";

const servicesUrl = routeUrl("שירותים");
const servicesDescription =
  "שירותי תיקון והתקנת שערים חשמליים: שערים נגררים, שערי כנף, שערים מתרוממים, שערים לחניה, שער זרוע, תריסי גלילה חשמליים ושערים לדירה — עם אחריות מלאה ושירות מהיר.";

export const metadata: Metadata = {
  alternates: { canonical: servicesUrl },
  title: "השירותים שלנו",
  description: servicesDescription,
  openGraph: {
    ...ogBase,
    url: servicesUrl,
    title: "השירותים שלנו",
    description: servicesDescription,
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="השירותים שלנו"
        subtitle="פתרון לכל סוג שער חשמלי — מתיקון תקלות ומנועים ועד התקנת שער חדש, עם שירות מהיר ואחריות מלאה."
        crumbs={[
          { label: "בית", href: "/" },
          { label: "השירותים שלנו", href: "/שירותים/" },
        ]}
      />
      <ServicesGrid />
      <FinalCta />
    </>
  );
}
