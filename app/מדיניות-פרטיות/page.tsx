import type { Metadata } from "next";
import { manifest, siteConfig, staticPages } from "@/lib/site-config";
import { ogBase, routeUrl } from "@/lib/seo";
import { legalPageNames, privacyPageCopy, privacyPath } from "@/lib/content";
import { pageNode } from "@/lib/jsonld";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";

const privacyUrl = routeUrl("מדיניות-פרטיות");

export const metadata: Metadata = {
  alternates: { canonical: privacyUrl },
  title: legalPageNames.privacy,
  description: privacyPageCopy.metaDescription,
  openGraph: {
    ...ogBase,
    url: privacyUrl,
    title: legalPageNames.privacy,
    description: privacyPageCopy.metaDescription,
  },
};

const nodes = [
  pageNode(manifest, "WebPage", {
    path: privacyPath,
    name: legalPageNames.privacy,
  }),
];

/** The page's own `updated` from the registry, as dd/mm/yyyy — one date, never typed twice. */
function updatedDisplay(): string | null {
  const iso = staticPages.find((p) => p.path === "מדיניות-פרטיות")?.updated;
  const m = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  return m ? `${m[3]}/${m[2]}/${m[1]}` : null;
}

const headingClass = "font-heading text-lg font-bold text-primary";

export default function PrivacyPage() {
  const updated = updatedDisplay();
  const { request } = privacyPageCopy;
  return (
    <>
      <PageHeader
        title={legalPageNames.privacy}
        nodes={nodes}
        crumbs={[
          { label: "בית", href: "/" },
          { label: legalPageNames.privacy, href: privacyPath },
        ]}
      />
      <Section tone="white">
        <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
          <p>{privacyPageCopy.intro}</p>
          {updated && (
            <p className="text-sm text-gray-500">
              {privacyPageCopy.updatedLabel} <span dir="ltr">{updated}</span>
            </p>
          )}

          {privacyPageCopy.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className={headingClass}>{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.list && (
                <ul className="list-disc space-y-2 ps-6">
                  {section.list.map((item) => (
                    <li key={item.label}>
                      <code dir="ltr" className="font-mono font-semibold text-gray-900">
                        {item.label}
                      </code>{" "}
                      — {item.text}
                    </li>
                  ))}
                </ul>
              )}
              {section.after && <p>{section.after}</p>}
            </section>
          ))}

          <section className="space-y-4">
            <h2 className={headingClass}>{request.heading}</h2>
            <p>{request.body}</p>
            <ul className="list-disc space-y-2 ps-6">
              <li>
                {request.phoneLabel} <span dir="ltr">{siteConfig.phone}</span>
              </li>
              <li>
                {request.emailLabel} <span dir="ltr">{siteConfig.email}</span>
              </li>
            </ul>
          </section>
        </div>
      </Section>
    </>
  );
}
