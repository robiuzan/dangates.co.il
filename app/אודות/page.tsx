import type { Metadata } from "next";
import { Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { aboutSections, aboutValues } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { TrustBar } from "@/components/marketing/TrustBar";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/אודות/" },
  title: "אודות דן שערים חשמליים",
  description:
    "דן שערים חשמליים — מומחים בתיקון והתקנת שערים חשמליים עם ניסיון רב שנים. שירות מהיר ואמין, אחריות מלאה, צוות מומחים וזמינות 24/7 לקריאות חירום.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="אודות דן שערים חשמליים"
        subtitle="מומחים בתיקון והתקנת שערים חשמליים — פתרון מותאם אישית לכל שער, עם דגש על איכות, מקצועיות ובטיחות."
        crumbs={[{ label: "בית", href: "/" }, { label: "אודות" }]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            ברוכים הבאים ל{siteConfig.name} — מתמחים בתיקון והתקנת שערים חשמליים. עם ניסיון
            רב שנים בתחום, אנו מספקים שירות ברמה הגבוהה ביותר, תוך הקפדה על איכות, מקצועיות
            ובטיחות. המטרה שלנו היא להבטיח שהשערים החשמליים שלכם יתפקדו בצורה מושלמת וישרתו
            אתכם נאמנה לאורך זמן.
          </p>

          {aboutSections.map((sec) => (
            <div key={sec.title}>
              <h2 className="mt-10 font-heading text-xl font-bold text-primary">
                {sec.title}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">{sec.body}</p>
            </div>
          ))}

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">הערכים שלנו</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {aboutValues.map((v) => (
              <li key={v.title} className="flex items-start gap-2 text-gray-700">
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                <span>
                  <strong className="text-primary">{v.title}.</strong> {v.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <TrustBar />
      <FinalCta />
    </>
  );
}
