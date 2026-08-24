---
name: site-images
description: The photo pipeline for dangates, ready for the day the owner's job photos arrive (business-facts §F ⏳) — Media Studio catalog → ops/sync-media.ps1 merges the images block into the roster manifest and site.config.json → SiteImage / srcsetFor / mediaUrl from @ishub/site-kit → Cloudflare Image Transformations on imgquarry.com; the Hebrew-alt bar, mandatory width/height under a static export, per-photo city · gate type · month metadata as location-page evidence, before/after pairs as the conversion format, ImageObject on the business node and on guides, and the header logo as the first real image. Use when adding, replacing or wiring any image, or when a photo batch lands. Triggers: "add photos", "job photos", "logo image", "alt text", "before/after", "gallery", "og image", "srcset", "תמונות", "לוגו", "טקסט חלופי".
allowed-tools: Read, Grep, Glob, Bash, PowerShell
---

# Site images

The site ships **zero `<img>` tags** (`perf.mjs` → `images: 0`, `a11y.mjs` → `imgCount: 0`, 45
pages). The header renders the brand as text (`components/layout/Header.tsx:23`) while
`public/dangates-logo.png` (250×250) sits unreferenced. The only image in production is the OG card,
served from the manifest's media host (`app/layout.tsx:32` → `ogImageMeta(manifest.images)`). Real
photos are **coming** (business-facts §F, owner-actions §4.1); this skill is the pipeline they go
through, written so nothing is improvised when the batch lands.

## Baseline — re-measure first

```bash
npm run build
node scripts/audit/run-all.mjs --scope perf     # images, imagesUnsized, resourceHints
node scripts/audit/run-all.mjs --scope a11y     # <img> without alt, imgCount
node scripts/audit/run-all.mjs --scope schema   # business node image/logo (backlog §4.5)
grep -n '"images"' -A 18 site.config.json        # what the manifest carries today
```

As of 2026-08-23 the `images` block is `mediaHost: imgquarry.com`, an `og` ref (`dangates/og.jpg`,
1200×630, Hebrew `altHe`), `badges: []`, `gallery: null` — no `logo`, no `hero`. A
`<link rel="preconnect">` to the media host already ships from `app/layout.tsx:49-55`.

## The pipeline — this is the real flow, not a proposal

```
photos (owner) ──► Media Studio  https://studio.imgquarry.com   (c:/Users/robiu/antigravity/Projects/Media Studio)
                     scripts/studio-api.ps1 -Action Upload | AltDraft | Publish   (-DryRun, then -Confirm + "# APPROVED:")
                     R2 bucket `media` + D1 catalog; key = <slug>/<slot>.<ext>, IMMUTABLE
        │
        ▼  ops/sync-media.ps1 -Domain dangates.co.il -DryRun → -Confirm      (Israeli services sites/ops)
roster/sites/dangates.json  ═══ MERGES the `images` key only ═══►  site.config.json   (never hand-edit either)
        │  ops/validate-manifests.ps1  (Test-ImageRef: key not a URL · width/height ≥ 1 · altHe ≥ 6 chars with Hebrew · not a filename)
        ▼
lib/site-config.ts  `manifest.images`  (lib/site-config.ts:20)
        │
        ▼
<SiteImage image={manifest.images.hero} sizes="…" priority />      import { SiteImage } from "@ishub/site-kit/components"
srcFor / srcsetFor / mediaUrl / preloadPropsFor / ogImageMeta        import { … } from "@ishub/site-kit"   (or "/media")
        │
        ▼
https://imgquarry.com/cdn-cgi/image/width=W,quality=80,format=auto,fit=cover[,gravity=XxY]/<key>
Cloudflare Image Transformations — ON for imgquarry.com and for this zone (cloudflare-runbook step 2, owner-actions §1.4)
```

- The dangates row in the catalog must have `dir='rtl'` — that is what makes `alt_he` mandatory at
  publish. `sync-media` saying "nothing published in the catalog yet" means `published=0`; never
  mentioning the domain means the hub roster lacks it (Media Studio runbook
  `runbooks/add-images-to-a-new-site.md`).
- `sync-media.ps1` is the **only** writer of the `images` block. It backs both files up to `.bak`
  (the stale `site.config.json.bak` in the tree is one of those — not a rollback target) and caches
  the catalog to `ops/.media-catalog.json` for offline validation. The project deny set and
  `guard-protected-paths.ps1` refuse `site.config.json` edits anyway.
- Per-photo **job metadata is not a manifest field.** `GalleryItem` carries `key`, dimensions, alt,
  focal and one `category`. The city · gate type · month that turns a photo into evidence lives in
  `lib/content.ts` — a `photoEvidence` record keyed by catalog key, built in Phase 3 alongside
  `cityContent`/`serviceDepth`. It does not exist today; do not invent the shape ad hoc.

## Rules that do not bend

1. **Hebrew `alt` for every meaningful image; `alt=""` only for decorative.** `SiteImage` defaults
   `preferHebrewAlt` to true and refuses an empty `alt` at compile time — decorative art must pass
   `decorative` (renders `alt=""` + `aria-hidden`). Write what the photo shows with the gate type
   and the place: «שער נגרר חשמלי אחרי החלפת מנוע, פתח תקווה». No «תמונה של», no keyword stuffing,
   no filename. `a11y.mjs` fails any `<img>` with no `alt` attribute.
2. **`width` and `height` always.** `output: "export"` + `images.unoptimized` means there is no
   resizer and no `next/image` placeholder — the intrinsic dimensions in the markup are the CLS
   reserve. `SiteImage` emits them from the ref; ad-hoc use requires both props. `perf.mjs` warns
   on any unsized `<img>`. Never a raw `<img>`; never `next/image`.
3. **`sizes` on every fluid image**, or the browser assumes `100vw` and the srcset ladder is
   wasted. `fixed` (logo, badges) skips it: 1x/2x only.
4. **One `priority` image per page** — the LCP candidate, paired with `preloadPropsFor` in `<head>`
   and the existing preconnect. Everything else lazy (the component's default).
5. **Never SVG through `/cdn-cgi/image`** (`isVector` short-circuits); a local `/public` path is
   served verbatim with no srcset. Raster originals landscape, ≥ 1600 px, no watermark.
6. **Replacing a photo is an overwrite at the same key, same aspect ratio, width ≥ current.** The
   dimensions are baked into every deployed page; a portrait swap behind a landscape key brings CLS
   back fleet-wide with no build to catch it (`site-kit/src/media/types.ts`, Media Studio golden
   rule 1).
7. **No stock photo presented as work.** If an illustrative image is ever used, its caption says
   so, and it never sits on a location page as evidence. **Permission** for any identifiable person
   and for a recognisable house or gate before publishing (business-facts §F).

## Photos as evidence — where each one earns its place

| Photo                                   | Goes to                                        | Carries                                                            |
| --------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| Job photo with city · gate type · month | that city's `cityContent.localNotes` (Phase 3) | a dated, placed proof line: «החלפת מנוע לשער כנף, רחובות, 06/2026» |
| Gate-type photo                         | the matching service page (`serviceDepth`)     | the depth signal a generic gate on all 7 pages is not              |
| Before/after pair, same position        | service page + the symptom guide (Phase 4)     | the conversion format for this trade — `templates/BeforeAfter.tsx` |
| Detail: motor, לוח פיקוד, עינית, track  | component guides (Phase 4), image search       | `ImageObject` with a Hebrew `caption`                              |
| Van / workshop                          | `/אודות/`                                      | "a real operation" (owner-actions §4.2)                            |
| Team                                    | nothing until §B names a person                | 🔶 — a photo of an unnamed "team" is not a trust signal            |

A photo whose city, gate type and month are unknown is decoration; park it in the gallery with a
category and no evidence claim. Month only, never a date that implies a record we do not keep.

## Schema

- **Business node:** `logo` = `public/dangates-logo.png` (absolute URL), `image` = the manifest OG
  via `srcFor(manifest.images, manifest.images.og)` — schema-graph §3, backlog §4.5, built in
  Phase 2's `businessNode()`; `schema.mjs` fails "business node carries no image/logo" until then.
- **Guides/posts:** `image` as an `ImageObject` (`contentUrl`, `width`, `height`, Hebrew
  `caption`) on `articleJsonLd` (schema-graph §6, Phase 4). The primary image's `contentUrl` is the
  `srcFor` URL at intrinsic width, never an SVG — Google rejects SVG for `image`.
- **Location `Service` node:** `image` only when the photo is from that city. A generic gate photo
  on 18 location nodes is the schema version of a doorway page.

## First image task — the header logo

`public/dangates-logo.png` is 250×250 and unused; `Header.tsx:23` prints `{siteConfig.name}`.
`Header` is `"use client"`; `SiteImage` carries no directive and is explicitly safe inside a client
component — do not add `"use client"` to anything under the kit. Ad-hoc form, local path, no
catalog dependency:

```tsx
import { SiteImage } from "@ishub/site-kit/components";
// inside the <Link href="/"> at Header.tsx:18-24, replacing the bare text:
<SiteImage src="/dangates-logo.png" alt={siteConfig.name} width={250} height={250} fixed priority className="h-10 w-10" />
<span className="font-heading text-2xl font-extrabold text-primary">{siteConfig.name}</span>
```

Keep the visible brand text (the logo is a square mark, not a wordmark) and the existing
`aria-label`. `priority` here means eager + `fetchpriority=high` — `SiteImage` has no plain-eager
mode, and a 40 px above-the-fold logo must not be lazy. When a hero image lands it takes
`priority` and the logo keeps it too; that is the one accepted exception to "one per page" (or
extend the kit in its own repo — never in `vendor/`). The better end state is the catalog `logo`
slot (`studio-api.ps1 -Slot logo`, SVG allowed there) → `manifest.images.logo` →
`<SiteImage image={manifest.images.logo} fixed />`; the local PNG is the `legacySrc`-style
transition. After: `a11y.mjs` imgCount 45, 0 without alt; `perf.mjs` imagesUnsized 0.

## Checklist

- [ ] Catalog row for `dangates.co.il` has `dir='rtl'`; every upload dry-run first, then `-Confirm`.
- [ ] `altHe` read and corrected by a human per image — AI drafts are drafts (Media Studio rule 4).
- [ ] `ops/sync-media.ps1 -Domain dangates.co.il -DryRun` diff reviewed, then `-Confirm`;
      `ops/validate-manifests.ps1` exits 0; `site.config.json` changed only under `images`.
- [ ] Every `<img>` is `SiteImage`; Hebrew alt or `decorative`; width/height; `sizes` on fluid;
      exactly one `priority` per page with a `preloadPropsFor` link.
- [ ] Evidence photos carry city · gate type · month in `lib/content.ts` (Phase 3 shape), and the
      visible caption says the same thing the alt says.
- [ ] Before/after pairs shot from the same position, labelled לפני / אחרי in the captions.
- [ ] Permission recorded for identifiable people and recognisable property.
- [ ] `schema.mjs` shows `image`/`logo` on the business node; `ImageObject` on guides.
- [ ] `npm run gate`; `perf.mjs` imagesUnsized 0; `a11y.mjs` no-alt 0; LCP not regressed (the
      hero image must not push the text LCP later — measure before choosing `priority`).

## Gotchas

- **The OG card is generated, not hand-made:** `ops/make-og-card.ps1 -Domain dangates.co.il`
  renders a 1200×630 JPEG from the manifest's brand, tagline and colours (System.Drawing, no npm),
  then `studio-api.ps1 -Slot og` uploads it. **SVG OG cards render blank** on Facebook, X and
  LinkedIn, and `validate-manifests.ps1` rejects a vector `og` or `hero` outright.
- `business-facts.md` §F says photos land in `public/`; the fleet flow is the catalog.
  `SiteImage` serves either, but only catalog keys get srcset, format negotiation and the
  no-rebuild photo swap. `public/` is for the logo and `legacySrc` transitions only.
- The gallery block has `mode: "fetched"` (runtime refresh from the public
  `/catalog/<domain>/gallery.json`). Do not use it here: it adds client JS and a runtime dependency
  to a site whose performance story is "almost no JS". `baked` only.
- ESLint `@next/next/no-img-element` is disabled inside `SiteImage` on purpose; a raw `<img>` in
  app code trips it and `a11y.mjs`/`perf.mjs` both look for what the kit guarantees.
- `images.unoptimized: true` is load-bearing (static export). Do not "enable optimisation" — there
  is no server to run it; Cloudflare does that job at the edge.
- Transformations on **this** zone serve `/cdn-cgi/image/…/dangates-logo.png` too
  (cloudflare-runbook step 2 verifies it), but `SiteImage` never emits that URL for a local path —
  if a local asset needs a srcset, move it to the catalog rather than hand-writing `cdn-cgi` URLs.
- PS 5.1 corrupts Hebrew in three places; `sync-media.ps1` works around all three. Do not
  "simplify" it, and do not write `altHe` with `Set-Content` or `ConvertTo-Json`.
