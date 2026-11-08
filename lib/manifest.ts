/**
 * manifest.ts — narrows the synced `site.config.json` (read as untyped JSON) into the kit's
 * `SiteManifest` at the boundary, so nothing downstream needs a cast (backlog N16).
 *
 * `site.config.json` is written by the roster sync, never by hand. When a sync drops a field this
 * site reads, or changes its type, the build must say so — not render `undefined` into the phone
 * link, the JSON-LD or the form. Every check throws at module evaluation, which is build time under
 * `output: "export"`, with the JSON path of the offending field.
 *
 * Checked: identity (domain, url, brandName, locale, dir), contact, brand, schema, analytics and
 * images. `silos` is optional in the kit type and this site reads none of it, so it is not carried.
 */

import type {
  GalleryBlock,
  GalleryItem,
  ImageRef,
  SiteAnalytics,
  SiteBrand,
  SiteContact,
  SiteImages,
  SiteManifest,
  SiteSchema,
} from "@ishub/site-kit";

type Obj = Record<string, unknown>;

function fail(path: string, want: string): never {
  throw new Error(`site.config.json: "${path}" must be ${want}`);
}

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function obj(v: unknown, path: string): Obj {
  if (!isObj(v)) return fail(path, "an object");
  return v;
}

/** Absent or null → undefined; present → must be an object. */
function optObj(v: unknown, path: string): Obj | undefined {
  return v === undefined || v === null ? undefined : obj(v, path);
}

function str(o: Obj, key: string, path: string): string {
  const v = o[key];
  if (typeof v !== "string" || v.trim() === "") {
    return fail(`${path}.${key}`, "a non-empty string");
  }
  return v;
}

/** Keeps `null` and `undefined` apart: the kit types allow both. */
function optStr(o: Obj, key: string, path: string): string | null | undefined {
  const v = o[key];
  if (v === undefined || v === null) return v;
  if (typeof v !== "string") return fail(`${path}.${key}`, "a string or null");
  return v;
}

function num(o: Obj, key: string, path: string): number {
  const v = o[key];
  if (typeof v !== "number" || !Number.isFinite(v)) {
    return fail(`${path}.${key}`, "a finite number");
  }
  return v;
}

function optNum(o: Obj, key: string, path: string): number | null | undefined {
  const v = o[key];
  if (v === undefined || v === null) return v;
  if (typeof v !== "number" || !Number.isFinite(v)) {
    return fail(`${path}.${key}`, "a finite number or null");
  }
  return v;
}

function optStrList(o: Obj, key: string, path: string): string[] | undefined {
  const v = o[key];
  if (v === undefined || v === null) return undefined;
  if (!Array.isArray(v)) return fail(`${path}.${key}`, "an array of strings");
  return v.map((item: unknown, i) =>
    typeof item === "string" ? item : fail(`${path}.${key}[${i}]`, "a string"),
  );
}

function list(v: unknown, path: string): unknown[] {
  if (!Array.isArray(v)) return fail(path, "an array");
  return v;
}

// ── images ───────────────────────────────────────────────────────────────────

function imageRef(v: unknown, path: string): ImageRef {
  const o = obj(v, path);
  const rawKind = o.kind;
  const kind = rawKind === "raster" || rawKind === "vector" ? rawKind : undefined;
  if (rawKind !== undefined && rawKind !== null && kind === undefined) {
    fail(`${path}.kind`, '"raster" or "vector"');
  }
  const f = optObj(o.focal, `${path}.focal`);
  return {
    key: str(o, "key", path),
    sha256: optStr(o, "sha256", path),
    alt: str(o, "alt", path),
    altHe: optStr(o, "altHe", path),
    width: num(o, "width", path),
    height: num(o, "height", path),
    bytes: optNum(o, "bytes", path),
    kind,
    focal: f
      ? { x: num(f, "x", `${path}.focal`), y: num(f, "y", `${path}.focal`) }
      : null,
    legacySrc: optStr(o, "legacySrc", path),
  };
}

function optImageRef(o: Obj, key: string, path: string): ImageRef | null | undefined {
  const v = o[key];
  if (v === undefined || v === null) return v;
  return imageRef(v, `${path}.${key}`);
}

function gallery(v: unknown, path: string): GalleryBlock | null | undefined {
  if (v === undefined || v === null) return v;
  const o = obj(v, path);
  const mode = o.mode;
  if (mode !== "baked" && mode !== "fetched")
    fail(`${path}.mode`, '"baked" or "fetched"');
  const items: GalleryItem[] = list(o.items, `${path}.items`).map((item, i) => {
    const at = `${path}.items[${i}]`;
    return { ...imageRef(item, at), category: str(obj(item, at), "category", at) };
  });
  return {
    mode: mode === "fetched" ? "fetched" : "baked",
    catalogUrl: optStr(o, "catalogUrl", path),
    version: optStr(o, "version", path),
    categories: optStrList(o, "categories", path) ?? [],
    items,
  };
}

function images(v: unknown, path: string): SiteImages | null | undefined {
  if (v === undefined || v === null) return v;
  const o = obj(v, path);
  const badges =
    o.badges === undefined || o.badges === null ? [] : list(o.badges, `${path}.badges`);
  return {
    mediaHost: str(o, "mediaHost", path),
    defaultQuality: optNum(o, "defaultQuality", path) ?? undefined,
    logo: optImageRef(o, "logo", path),
    hero: optImageRef(o, "hero", path),
    og: optImageRef(o, "og", path),
    badges: badges.map((b, i) => imageRef(b, `${path}.badges[${i}]`)),
    gallery: gallery(o.gallery, `${path}.gallery`),
  };
}

// ── the rest of the manifest ─────────────────────────────────────────────────

function contact(v: unknown): SiteContact {
  const path = "contact";
  const o = obj(v, path);
  const override = o.phoneOverride;
  if (override !== undefined && typeof override !== "boolean") {
    fail(`${path}.phoneOverride`, "a boolean");
  }
  return {
    phoneDisplay: str(o, "phoneDisplay", path),
    phoneE164: str(o, "phoneE164", path),
    whatsappE164: str(o, "whatsappE164", path),
    email: str(o, "email", path),
    formAccessKey: optStr(o, "formAccessKey", path),
    phoneOverride: override,
  };
}

function brand(v: unknown): SiteBrand {
  const path = "brand";
  const o = obj(v, path);
  return {
    themeColor: optStr(o, "themeColor", path),
    primary: optStr(o, "primary", path),
    secondary: optStr(o, "secondary", path),
    accent: optStr(o, "accent", path),
    fontHeading: optStr(o, "fontHeading", path),
    fontBody: optStr(o, "fontBody", path),
  };
}

function schema(v: unknown): SiteSchema {
  const path = "schema";
  const o = obj(v, path);
  const hours = o.openingHours;
  const openingHours =
    hours === undefined || hours === null
      ? undefined
      : list(hours, `${path}.openingHours`).map((h, i) =>
          obj(h, `${path}.openingHours[${i}]`),
        );
  return {
    // The JSON-LD @type is read from here (never typed in code), so null is not acceptable.
    type: str(o, "type", path),
    priceRange: optStr(o, "priceRange", path),
    areaServed: optStr(o, "areaServed", path),
    openingHours,
    address: optObj(o.address, `${path}.address`) ?? null,
    sameAs: optStrList(o, "sameAs", path),
  };
}

function analytics(v: unknown): SiteAnalytics | undefined {
  const path = "analytics";
  const o = optObj(v, path);
  if (!o) return undefined;
  return {
    gtmId: optStr(o, "gtmId", path),
    ga4MeasurementId: optStr(o, "ga4MeasurementId", path),
    googleSiteVerification: optStr(o, "googleSiteVerification", path),
  };
}

/**
 * Validate the parsed `site.config.json` and return it typed. Throws, naming the JSON path, on the
 * first missing or mistyped field this site depends on.
 */
export function parseManifest(raw: unknown): SiteManifest {
  const o = obj(raw, "(root)");
  const url = str(o, "url", "(root)");
  if (!/^https?:\/\/[^/]+$/.test(url)) {
    fail(
      "url",
      'an origin without a path or trailing slash, e.g. "https://example.co.il"',
    );
  }
  const dir = o.dir;
  if (dir !== "rtl" && dir !== "ltr") fail("dir", '"rtl" or "ltr"');
  const founded = optNum(o, "foundedYear", "(root)");

  return {
    domain: str(o, "domain", "(root)"),
    url,
    images: images(o.images, "images"),
    brandName: str(o, "brandName", "(root)"),
    brandNameEn: optStr(o, "brandNameEn", "(root)"),
    legalName: optStr(o, "legalName", "(root)"),
    locale: str(o, "locale", "(root)"),
    dir: dir === "ltr" ? "ltr" : "rtl",
    foundedYear: founded,
    tagline: optStr(o, "tagline", "(root)"),
    shortPitch: optStr(o, "shortPitch", "(root)"),
    contact: contact(o.contact),
    brand: brand(o.brand),
    schema: schema(o.schema),
    analytics: analytics(o.analytics),
  };
}
