import type { Metadata } from "next";
import { manifest, siteConfig } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { legalPageNames } from "@/lib/content";
import { pageNode } from "@/lib/jsonld";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";

const a11yUrl = routeUrl("הצהרת-נגישות");
const a11yDescription = "הצהרת הנגישות של אתר דן שערים חשמליים בהתאם לתקן הישראלי.";

export const metadata: Metadata = {
  alternates: { canonical: a11yUrl },
  title: legalPageNames.accessibility,
  description: a11yDescription,
  openGraph: {
    ...ogBase,
    url: a11yUrl,
    title: legalPageNames.accessibility,
    description: a11yDescription,
  },
};

const nodes = [
  pageNode(manifest, "WebPage", {
    path: "/הצהרת-נגישות/",
    name: legalPageNames.accessibility,
  }),
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        title={legalPageNames.accessibility}
        nodes={nodes}
        crumbs={[
          { label: "בית", href: "/" },
          { label: legalPageNames.accessibility, href: "/הצהרת-נגישות/" },
        ]}
      />
      <Section tone="white">
        <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
          <p>
            {siteConfig.name} רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשים, ופועלת
            להנגשת האתר בהתאם לתקן הישראלי (ת״י 5568) ולהנחיות WCAG 2.1 ברמה AA.
          </p>
          <h2 className="font-heading text-lg font-bold text-primary">מה הונגש באתר</h2>
          <ul className="list-disc space-y-1 ps-5">
            <li>מבנה סמנטי ותמיכה בניווט באמצעות מקלדת.</li>
            <li>ניגודיות צבעים תקינה וטקסט קריא.</li>
            <li>תיאורים חלופיים לתמונות בעלות משמעות.</li>
            <li>התאמה לקוראי מסך וכיווניות RTL מלאה.</li>
          </ul>
          <h2 className="font-heading text-lg font-bold text-primary">
            פניות בנושא נגישות
          </h2>
          <p>
            נתקלתם בקושי? נשמח לסייע. ניתן לפנות אלינו בטלפון{" "}
            <span dir="ltr">{siteConfig.phone}</span> או בדוא״ל{" "}
            <span dir="ltr">{siteConfig.email}</span>.
          </p>
        </div>
      </Section>
    </>
  );
}
