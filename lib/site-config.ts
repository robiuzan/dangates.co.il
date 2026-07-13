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

/** Normalized per-site manifest (single source of truth for NAP/identity/schema). */
export const manifest = siteManifest as unknown as SiteManifest;

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
  formAccessKey: (manifest.contact as { formAccessKey?: string | null }).formAccessKey ?? null,
  serviceArea: manifest.schema.areaServed ?? "",

  /** Business hours (live-site audit). */
  hours: {
    weekday: "ראשון–חמישי 08:00–18:00",
    friday: "שישי 08:00–15:00",
    emergency: "שירות חירום 24/7", // round-the-clock emergency line
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
 */
export const services = [
  { slug: "שערים-נגררים", name: "שערים נגררים" },
  { slug: "שערי-כנף", name: "שערי כנף" },
  { slug: "שערים-מתרוממים", name: "שערים מתרוממים" },
  { slug: "שערים-לחניה", name: "שערים לחניה" },
  { slug: "שער-זרוע", name: "שער זרוע" },
  { slug: "תריסי-גלילה-חשמליים", name: "תריסי גלילה חשמליים" },
  { slug: "שערים-לדירה", name: "שערים לדירה" },
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

// ── Link helpers ───────────────────────────────────────────────────────────

/** `tel:` href for click-to-call (shared @ishub/site-kit, bound to the manifest). */
export const telHref = kitTelHref(manifest);

/** WhatsApp click-to-chat href, with an optional pre-filled message (shared kit). */
export function whatsappHref(message?: string): string {
  return kitWhatsappHref(manifest, message);
}
