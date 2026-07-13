import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locations, type LocationSlug, siteConfig } from "@/lib/site-config";
import { serviceCards } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { city: LocationSlug }[] {
  return locations.map((c) => ({ city: c.slug }));
}

/** Match the route param against a slug, tolerant of URL-encoding + Unicode normalization
 *  (Hebrew dynamic segments arrive percent-encoded during static export). */
function findLocation(param: string) {
  const target = decodeURIComponent(param).normalize("NFC");
  return locations.find((c) => c.slug.normalize("NFC") === target);
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const loc = findLocation(params.city);
  if (!loc) return {};
  return {
    title: `תיקון והתקנת שערים חשמליים ב${loc.name} | ${siteConfig.name}`,
    description: `תיקון והתקנת שערים חשמליים ב${loc.name} — שירות מהיר ואמין, אחריות מלאה וזמינות 24/7 לקריאות חירום. לכל סוגי השערים: נגררים, כנף, מתרוממים, חניה, זרוע ותריסי גלילה.`,
  };
}

export default function LocationPage({ params }: { params: { city: string } }) {
  const loc = findLocation(params.city);
  if (!loc) notFound();

  return (
    <>
      <PageHeader
        title={`תיקון והתקנת שערים חשמליים ב${loc.name}`}
        subtitle={`שירות מקצועי לתיקון והתקנת שערים חשמליים ב${loc.name} והסביבה — מענה מהיר, אחריות מלאה וזמינות 24/7 לקריאות חירום.`}
        crumbs={[
          { label: "בית", href: "/" },
          { label: "אזורי שירות", href: "/איזורי-שירות" },
          { label: loc.name },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            מחפשים תיקון או התקנה של שער חשמלי ב{loc.name}? ב{siteConfig.name} מטפלים בכל
            סוגי השערים החשמליים — נגררים, כנף, מתרוממים, שערים לחניה, שערי זרוע ותריסי
            גלילה — עם אבחון מדויק, ציוד מתקדם ותיקונים עמידים לאורך זמן.
          </p>
          <p className="mt-4 text-gray-700">
            אנחנו נותנים שירות ללקוחות פרטיים, ועדי בתים ועסקים ב{loc.name} ובכל אזור
            המרכז, עם מענה מהיר וזמינות 24/7 לקריאות חירום. השער תקוע, לא נסגר או שהמנוע לא
            מגיב? התקשרו ונגיע לבדוק ולתקן.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            השירותים שלנו ב{loc.name}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {serviceCards.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary"
                >
                  {s.name}
                  <ChevronLeft className="h-4 w-4" aria-hidden />
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
