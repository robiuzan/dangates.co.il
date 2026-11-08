/**
 * site-config.ts — single source of truth for business data (NAP, services, locations).
 *
 * Derived from the live-site audit of dangates.co.il (דן שערים חשמליים). Components import
 * these values rather than hardcoding the phone number, service names, or location slugs.
 *
 * Slugs are the EXACT Hebrew slugs from the live services sitemap (SEO fidelity). Locations
 * are NORMALIZED to `/locations/<he-slug>/` for all 18 cities (the live site scattered most
 * of them at the site root; the old URLs are 301-redirected — see REDIRECTS.md).
 */

import siteManifest from "@/site.config.json";
import {
  telHref as kitTelHref,
  whatsappHref as kitWhatsappHref,
  type SiteManifest,
} from "@ishub/site-kit";
import { parseManifest } from "@/lib/manifest";

/**
 * Normalized per-site manifest (single source of truth for NAP/identity/schema). Narrowed from the
 * synced JSON at the boundary — a missing or mistyped field fails the build (N16), no cast.
 */
export const manifest: SiteManifest = parseManifest(siteManifest);

const HEBREW_DAYS: Record<string, string> = {
  su: "ראשון",
  mo: "שני",
  tu: "שלישי",
  we: "רביעי",
  th: "חמישי",
  fr: "שישי",
  sa: "שבת",
};
const DAY_ORDER = ["su", "mo", "tu", "we", "th", "fr", "sa"];

/**
 * One manifest `openingHours` row rendered as a display line ("ראשון–חמישי 08:00–18:00"). The row
 * is found by a day it must contain, so the visible hours and the `openingHoursSpecification` in
 * the JSON-LD graph read the same manifest rows. A manifest that drops the row or changes its
 * shape fails the build here, rather than printing a blank line.
 */
function hoursLine(anchorDay: string): string {
  for (const row of manifest.schema.openingHours ?? []) {
    const { days, opens, closes } = row;
    if (!Array.isArray(days) || typeof opens !== "string" || typeof closes !== "string") {
      continue;
    }
    const codes = days.filter((d): d is string => typeof d === "string");
    if (!codes.includes(anchorDay)) continue;
    const names = DAY_ORDER.filter((code) => codes.includes(code)).map(
      (code) => HEBREW_DAYS[code],
    );
    const first = names[0];
    const last = names[names.length - 1];
    if (first === undefined || last === undefined) continue;
    const dayText = names.length === 1 ? first : `${first}–${last}`;
    return `${dayText} ${opens}–${closes}`;
  }
  throw new Error(
    `site.config.json: schema.openingHours has no usable row for "${anchorDay}"`,
  );
}

export const siteConfig = {
  name: manifest.brandName ?? "",
  nameEn: manifest.brandNameEn ?? "",
  /** One-line elevator pitch. */
  tagline: manifest.tagline ?? "",
  domain: manifest.url,
  founded: manifest.foundedYear ?? 0,

  // ── Contact ──────────────────────────────────────────────────────────────
  phone: manifest.contact.phoneDisplay,
  /** E.164 form for `tel:` links. */
  phoneE164: manifest.contact.phoneE164,
  whatsapp: manifest.contact.whatsappE164.replace(/\D/g, ""),
  email: manifest.contact.email,
  /** Web3Forms PUBLIC access key (per-site UUID). Delivery inbox = email. null until provisioned. */
  formAccessKey: manifest.contact.formAccessKey ?? null,
  /**
   * Business hours, built from the manifest `schema.openingHours` — the same rows the
   * `openingHoursSpecification` in the JSON-LD graph is built from. Every surface that shows
   * hours reads these two lines; none types a time. The emergency line is copy, not a schedule:
   * it lives in lib/content.ts (`contactPageCopy.emergencyLine`).
   */
  hours: {
    weekday: hoursLine("su"),
    friday: hoursLine("fr"),
  },

  // ── Social / listings — fill when available ──────────────────────────────
  social: {
    facebook: "",
    instagram: "",
    googleBusiness: "",
  },
} as const;

/**
 * Services (live-site services silo), flagship first.
 * `slug` = Hebrew route segment (`app/services/[service]`); `name` = Hebrew display name.
 * Marketing descriptions live with the page content (lib/content.ts), not here.
 *
 * `updated` = ISO date this service's copy (its serviceMeta and serviceTriggers entries in
 * lib/content.ts) last changed. It becomes the page's sitemap <lastmod>, so bump it ONLY for real
 * copy edits — never for styling, metadata or analytics work, or the signal stops meaning anything.
 *
 * 2026-09-06: bumped on all seven because each page gained visible copy — the
 * "מתי כדאי לפנות אלינו?" heading and its own per-service trigger list (backlog §3.3). Nothing else
 * in that release was a copy edit: og:url, GTM in <head>, data-cta, the font preloads and the
 * route-file copy move were metadata, infrastructure or a verbatim refactor, so `locationsUpdated`
 * and the `staticPages` dates deliberately did not move. The lead-form error block is client-only
 * and absent from the crawled bytes, so /צור-קשר/ did not move either. **No script catches a stale
 * date** — `links.mjs` asserts a <lastmod> is a real, non-future date, not that it is current — so
 * this judgement is part of the pre-deploy check in `/deploy-dangates`.
 */
export const services = [
  { slug: "שערים-נגררים", name: "שערים נגררים", updated: "2026-09-06" },
  { slug: "שערי-כנף", name: "שערי כנף", updated: "2026-09-06" },
  { slug: "שערים-מתרוממים", name: "שערים מתרוממים", updated: "2026-09-06" },
  { slug: "שערים-לחניה", name: "שערים לחניה", updated: "2026-09-06" },
  { slug: "שער-זרוע", name: "שער זרוע", updated: "2026-09-06" },
  { slug: "תריסי-גלילה-חשמליים", name: "תריסי גלילה חשמליים", updated: "2026-09-06" },
  { slug: "שערים-לדירה", name: "שערים לדירה", updated: "2026-09-06" },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];

/**
 * Local-SEO location matrix (live-site locations silo) — מרכז הארץ + ארצי.
 * Drives `app/locations/[city]` (`תיקון שערים חשמליים ב[עיר]`). All 18 cities normalized
 * to `/locations/<he-slug>/` (old root-level URLs are 301-redirected — see REDIRECTS.md).
 */
export const locations = [
  { slug: "תל-אביב", name: "תל אביב" },
  { slug: "ירושלים", name: "ירושלים" },
  { slug: "חיפה", name: "חיפה" },
  { slug: "ראשון-לציון", name: "ראשון לציון" },
  { slug: "פתח-תקווה", name: "פתח תקווה" },
  { slug: "נתניה", name: "נתניה" },
  { slug: "חולון", name: "חולון" },
  { slug: "כפר-סבא", name: "כפר סבא" },
  { slug: "מודיעין", name: "מודיעין" },
  { slug: "רחובות", name: "רחובות" },
  { slug: "יבנה", name: "יבנה" },
  { slug: "אשדוד", name: "אשדוד" },
  { slug: "באר-שבע", name: "באר שבע" },
  { slug: "קריות", name: "קריות" },
  { slug: "אשקלון", name: "אשקלון" },
  { slug: "צפון", name: "צפון" },
  { slug: "דרום", name: "דרום" },
  { slug: "שרון", name: "שרון" },
] as const;

export type LocationSlug = (typeof locations)[number]["slug"];

/**
 * ISO date the location copy last changed — the sitemap <lastmod> for all 18 city pages.
 * One date, not eighteen: every city renders from the same template
 * (`app/locations/[city]/page.tsx`) with only the name interpolated, so they always change
 * together. Bump it when that template's copy changes; per-city dates would be false
 * precision until a city gets bespoke copy.
 */
export const locationsUpdated = "2026-07-13";

/**
 * A top-level route whose copy is hand-written in its own `page.tsx`.
 *
 * `path`     route segment as it appears after the domain, decoded (`""` = homepage).
 * `updated`  ISO date this page's copy last changed — it becomes the sitemap <lastmod>,
 *           so bump it ONLY for real copy edits, never for styling, metadata or
 *           analytics work, or the signal stops meaning anything.
 * `noindex`  the route exists but is deliberately kept out of the sitemap (a thank-you
 *           page, say). Recorded rather than omitted so the audit can tell "excluded on
 *           purpose" from "forgotten" — without it, backlog §8.3's planned /תודה/ would
 *           make the links.mjs parity check fail the moment it shipped.
 */
export type StaticPage = {
  readonly path: string;
  readonly updated: string;
  readonly noindex?: boolean;
};

/**
 * The static routes, completing the URL set: every other page the sitemap emits derives
 * from `services`, `locations` or `posts`, and these nine derive from nothing.
 *
 * They lived as a literal inside `app/sitemap.ts` until backlog §1.4. The sitemap was the
 * only thing that knew they existed, so nothing tied the list to the routes it claimed to
 * describe and a tenth top-level page would ship absent from it. Keeping them here puts
 * every sitemap-eligible route in one file, and `scripts/audit/links.mjs` now cross-checks
 * this array against the `app/` tree — so drift fails at the registry, naming the route.
 */
export const staticPages: readonly StaticPage[] = [
  { path: "", updated: "2026-07-13" },
  { path: "שירותים", updated: "2026-07-13" },
  { path: "איזורי-שירות", updated: "2026-07-13" },
  { path: "מחירון", updated: "2026-07-13" },
  { path: "blog", updated: "2026-07-13" },
  { path: "אודות", updated: "2026-07-13" },
  { path: "צור-קשר", updated: "2026-07-13" },
  { path: "מדיניות-פרטיות", updated: "2026-11-08" },
  { path: "הצהרת-נגישות", updated: "2026-07-13" },
  // The post-submit page: registered so the parity check knows it is deliberate, kept out of the
  // sitemap by `noindex`. `updated` is never read for it.
  { path: "תודה", updated: "2026-11-08", noindex: true },
];

// ── Link helpers ───────────────────────────────────────────────────────────

/** `tel:` href for click-to-call (shared @ishub/site-kit, bound to the manifest). */
export const telHref = kitTelHref(manifest);

/** WhatsApp click-to-chat href, with an optional pre-filled message (shared kit). */
export function whatsappHref(message?: string): string {
  return kitWhatsappHref(manifest, message);
}
