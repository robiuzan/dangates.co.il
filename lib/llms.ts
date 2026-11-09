/**
 * llms.ts — builds the text of /llms.txt from the data, the way app/sitemap.ts builds the sitemap
 * (backlog §6.5, `.claude/skills/aeo-answer-content/templates/llms.txt`). Identity, contact and
 * hours come from `siteConfig`; the page list from `staticPages`, `services`, `locations` and the
 * guides registry, so a new page cannot be missing and a removed one cannot linger. Every URL is
 * percent-encoded with the trailing slash the export serves — byte-identical to the sitemap `<loc>`.
 * The fixed wording is `llmsCopy` in lib/content.ts; nothing is typed here.
 */
import { locations, services, siteConfig, staticPages } from "@/lib/site-config";
import {
  areaLinkLabel,
  crumbLabels,
  legalPageNames,
  llmsCopy,
  guidesCopy,
  pricingPageCopy,
  serviceAreaLine,
  visitFeeRange,
} from "@/lib/content";
import { guideList, guidePath } from "@/lib/guides";

/** Absolute, percent-encoded URL with the trailing slash (`""` = the homepage). */
function url(path: string): string {
  return encodeURI(
    `${siteConfig.domain}/${path ? `${path.replace(/^\/|\/$/g, "")}/` : ""}`,
  );
}

/** Display name of a static route; an unknown path falls back to itself so it still appears. */
const staticLabels: Record<string, string> = {
  "": siteConfig.name,
  שירותים: crumbLabels.services,
  "איזורי-שירות": crumbLabels.areas,
  מחירון: pricingPageCopy.h1,
  blog: crumbLabels.blog,
  מדריכים: guidesCopy.hubTitle,
  אודות: crumbLabels.about,
  "צור-קשר": crumbLabels.contact,
  "מדיניות-פרטיות": legalPageNames.privacy,
  "הצהרת-נגישות": legalPageNames.accessibility,
};

export function buildLlmsTxt(): string {
  const lines: string[] = [];
  const add = (...l: string[]) => lines.push(...l);

  add(
    `# ${siteConfig.name} (${siteConfig.nameEn})`,
    "",
    `> ${siteConfig.tagline}.`,
    "",
    llmsCopy.summary,
    "",
    `## ${llmsCopy.contactHeading}`,
    "",
    `- Phone: ${siteConfig.phone} (${siteConfig.phoneE164})`,
    `- WhatsApp: +${siteConfig.whatsapp}`,
    `- Email: ${siteConfig.email}`,
    `- Hours: ${siteConfig.hours.weekday}; ${siteConfig.hours.friday}`,
    `- ${llmsCopy.addressLine}`,
    `- Site: ${url("")}`,
    `- Contact page: ${url("צור-קשר")}`,
    "",
    `## ${llmsCopy.servicesHeading}`,
    "",
  );
  for (const s of services) {
    add(`- [${s.name}](${url(`services/${s.slug}`)}) — ${llmsCopy.serviceGloss[s.slug]}`);
  }
  add("", `${llmsCopy.servicesIndexLabel}: ${url("שירותים")}`, "");

  add(`## ${llmsCopy.areasHeading}`, "", serviceAreaLine, "");
  // Each area by its display form (`areaLinkLabel(prefixed)`: "שערים חשמליים באזור השרון"), never the bare
  // `name`: a bare region name in a list reads as coverage of the whole region, and the list is a set of
  // published pages, not a coverage promise.
  for (const l of locations) {
    add(`- [${areaLinkLabel(l.prefixed)}](${url(`locations/${l.slug}`)})`);
  }
  add("", llmsCopy.areasNote, "");

  add(`## ${llmsCopy.pagesHeading}`, "");
  for (const p of staticPages) {
    if (p.noindex) continue;
    add(`- [${staticLabels[p.path] ?? p.path}](${url(p.path)})`);
  }
  add("");

  // The guides section appears only once the registry holds a guide.
  if (guideList.length > 0) {
    add(`## ${llmsCopy.guidesHeading}`, "", llmsCopy.guidesNote, "");
    for (const g of guideList) {
      add(`- [${g.title}](${url(guidePath(g.slug))}) — ${g.description}`);
    }
    add("");
  }

  add(
    `## ${llmsCopy.factsHeading}`,
    "",
    `- ${llmsCopy.facts.serviceArea}`,
    `- ${llmsCopy.facts.visitFee(visitFeeRange)} ${url("מחירון")}`,
    `- ${llmsCopy.facts.warranty}`,
    `- ${llmsCopy.facts.customers}`,
    "",
    `## ${llmsCopy.notesHeading}`,
    "",
    ...llmsCopy.notes.map((n) => `- ${n}`),
    "",
  );

  return lines.join("\n");
}
