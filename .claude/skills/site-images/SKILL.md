---
name: site-images
description: The Media Studio catalog path for the OG card and the header logo on dangates — catalog → ops/sync-media.ps1 merges the images block into the roster manifest and site.config.json → ogImageMeta in lib/seo.ts for og:image and the business node, the kit's SiteImage for the header logo — and why content images never come from it (they are AI renderings under one site-wide note through the page-images kit, see page-imagery); the catalog hero and gallery slots stay null, JobPhotos and the Hero branch are retired. Use when touching the OG card, the header logo, the manifest images block or sync-media. Triggers: "og image", "logo image", "sync-media", "catalog", "the media host", "הלוגו", "תמונת שיתוף".
allowed-tools: Read, Grep, Glob, Bash, PowerShell
---

# Site images — the catalog path, for two images only

Since the owner's decisions of 2026-11-11 (CLAUDE.md §15, `docs/business-facts.md` §F, ADR 0006)
this site has two kinds of image, and this skill covers only the first:

| Kind                                                | Source                                                                      | Path                                                                                                                                                                                            | Skill                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Brand images** — the OG card and the header logo  | the Media Studio catalog (`dangates/og.jpg`) and `public/dangates-logo.png` | catalog → `ops/sync-media.ps1` → `site.config.json` `images` → `lib/seo.ts` `ogBase` / `lib/jsonld.ts` `businessNode`; the logo through the kit's `SiteImage` in `components/layout/Header.tsx` | this one                               |
| **Content images** — every figure on a content page | AI renderings, approved by the owner on the local site                      | `content/images/plan.json` → Media Studio page-images → `public/images/<group>/` + `content/images/manifest.json` → `components/images/Figure.tsx`                                              | `page-imagery`, `page-images-pipeline` |

**Content images never come from the catalog.** A catalog photo placed on a service or location
page would be presented as a record of this business's work with no note under it, which is the
class of fabrication the removed reviews belonged to (golden rule 1). The renderings are
illustrations under one site-wide disclosure, validated by `lib/images.ts` and
`scripts/images/check-images-out.mjs`; the catalog knows nothing about them and `sync-media` never
touches them. The catalog's `images.hero` and `images.gallery` slots **stay `null`**:
`components/marketing/JobPhotos.tsx` («תמונות מהעבודה», with `jobPhotosCopy` in `lib/content.ts`) and
the `manifest.images.hero` branch in `components/marketing/Hero.tsx` rendered nothing today and
would have shown catalog photos as field work — both are retired in the kit commit (B) and are never
revived.

## Baseline — re-measure first

```bash
npm run build
node scripts/audit/run-all.mjs --scope perf     # images, imagesUnsized, imagesBytes, resourceHints
node scripts/audit/run-all.mjs --scope a11y     # <img> without alt, imgCount
node scripts/audit/run-all.mjs --scope schema   # business node image/logo, rawHebrewUrls 0
grep -n '"images"' -A 18 site.config.json        # what the manifest carries today
grep -o '<meta property="og:image" content="[^"]*"' out/index.html   # the catalog card, never an /images/ path
```

As of 2026-08-23 the `images` block is `mediaHost: imgquarry.com`, an `og` ref (`dangates/og.jpg`,
1200×630, Hebrew `altHe`), `badges: []`, `gallery: null` — no `logo`, no `hero`. A
`<link rel="preconnect">` to the media host ships from `app/layout.tsx` (the `preconnect` link in
the `<head>`). The header logo is one eager decorative `<img>` per page (`perf.mjs` → `images 48`,
`a11y.mjs` → `imgCount 48`, 48 pages, as of 2026-11-10); from the kit commit the two scripts count
the content images too, so quote their output, not this line.

## The catalog pipeline — the OG card's real flow

```
og card (ops/make-og-card.ps1) ──► Media Studio  https://studio.imgquarry.com   (c:/Users/robiu/antigravity/Projects/Media Studio)
                                     scripts/studio-api.ps1 -Action Upload | AltDraft | Publish   (-DryRun, then -Confirm + "# APPROVED:")
                                     R2 bucket `media` + D1 catalog; key = <slug>/<slot>.<ext>, IMMUTABLE
        │
        ▼  ops/sync-media.ps1 -Domain dangates.co.il -DryRun → -Confirm      (Israeli services sites/ops)
roster/sites/dangates.json  ═══ MERGES the `images` key only ═══►  site.config.json   (never hand-edit either)
        │  ops/validate-manifests.ps1  (Test-ImageRef: key not a URL · width/height ≥ 1 · altHe ≥ 6 chars with Hebrew · not a filename)
        ▼
lib/site-config.ts  `manifest.images`
        │
        ├──► lib/seo.ts        ogBase.images = ogImageMeta(manifest.images)   → og:image on every route
        └──► lib/jsonld.ts     businessNode: logo "/dangates-logo.png", image = the OG card's URL
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
- The slots this site uses: `og` (in use) and, as the better end state for the header mark, `logo`
  (`studio-api.ps1 -Slot logo`, SVG allowed there). `hero`, `gallery` and `badges` stay empty.

## Rules that do not bend

1. **Hebrew `alt` for every meaningful image; `alt=""` only for decorative.** `SiteImage` defaults
   `preferHebrewAlt` to true and refuses an empty `alt` at compile time — decorative art must pass
   `decorative` (renders `alt=""` + `aria-hidden`), which is what the header logo does: the home link
   already carries the accessible name. `a11y.mjs` fails any `<img>` with no `alt` attribute. The OG
   card's `altHe` lives in the catalog row.
2. **`width` and `height` always.** `output: "export"` + `images.unoptimized` means there is no
   resizer and no `next/image` placeholder — the intrinsic dimensions in the markup are the CLS
   reserve. `SiteImage` emits them from the ref; ad-hoc use requires both props. `perf.mjs` warns
   on any unsized `<img>`. Page code never writes a raw `<img>`, and `next/image` is not used on this
   site (it would add client JS and no `srcset`).
3. **`sizes` on every fluid catalog image**, or the browser assumes `100vw` and the srcset ladder is
   wasted. `fixed` (the logo) skips it: 1x/2x only. Content images are local `public/` paths and get
   no `srcset`, correctly (`page-imagery` §4).
4. **One `priority` content image per page** (`page-imagery` §4), plus the header logo, which is
   eager with its own `priority` through `SiteImage` (a 40 px above-the-fold mark must not be lazy).
   They coexist by design: the images gate counts `fetchpriority="high"` on `/images/` paths only,
   and the logo is not one.
5. **Never SVG through `/cdn-cgi/image`** (`isVector` short-circuits); a local `/public` path is
   served verbatim with no srcset.
6. **Replacing a catalog image is an overwrite at the same key, same aspect ratio, width ≥ current.**
   The dimensions are baked into every deployed page; a portrait swap behind a landscape key brings
   CLS back fleet-wide with no build to catch it (`site-kit/src/media/types.ts`, Media Studio golden
   rule 1).
7. **Content images are renderings under the note, never catalog photos.** Which picture belongs in
   which slot, what the words beside it may say, the manifest, the gate and the never-delete policy
   are `page-imagery`; the commands are `page-images-pipeline`. A rendering never enters the catalog,
   `og:image`, JSON-LD or the Google Business Profile.
8. **Real job photos, when the owner supplies them (owner-actions 4.5), do not come through the
   catalog either.** They enter `content/images/manifest.json` as `owner-supplied` through the
   toolkit's `import` and replace renderings one for one; the first one changes the site note under a
   new approval. The Google Business Profile wants them too, without a note — that path is
   `docs/gbp-runbook.md`, not this skill.

## Schema

- **Business node:** `logo` = `/dangates-logo.png` (absolute through the site URL), `image` = the
  manifest OG card via `ogImageMeta(manifest.images)` — `lib/jsonld.ts` `businessNode()`, schema-graph
  §3; `schema.mjs` fails "business node carries no image/logo" if either is dropped, and fails Hebrew
  in an `image` or `logo` URL field.
- **Articles and guides:** `articleJsonLd` falls back to the OG card for `image` when none is given.
  **No `ImageObject` anywhere, and a rendering never enters an `image` field** — `schema.mjs` and the
  images gate both check that no `/images/` path appears inside `application/ld+json`.
- **Location `Service` node:** no `image`. A generic gate picture on 14 location nodes would be the
  schema version of a doorway page, and the renderings are not from any city.

## The header logo — the record (N24, `6407f83`, 2026-11-10)

`public/dangates-logo.png` (250×250, the supplied artwork; the same file carries «תיקון והתקנה 24/7»
and is the renderings' watermark master — owner decision 3, ADR 0006) renders in `Header`'s home
`<Link>` through the kit's `SiteImage` in ad-hoc form — local path, `decorative`, `width={250}
height={250}`, `fixed`, `priority`, `className="h-10 w-10 shrink-0"` — beside the visible brand text
(the logo is a square mark, not a wordmark). `Header` is a server shell since Sprint 3; `SiteImage`
carries no directive and is safe in either kind of component — do not add `"use client"` to anything
under the kit. `priority` here means eager + `fetchpriority=high`: `SiteImage` has no plain-eager
mode. The better end state is the catalog `logo` slot → `manifest.images.logo` →
`<SiteImage image={manifest.images.logo} fixed />`; the local PNG is the `legacySrc`-style
transition. Measured when it shipped: `a11y.mjs` `imgCount 48` (one per page), 0 without alt;
`perf.mjs` `imagesUnsized 0`. Never propose a rendering for the logo, the favicon or the OG card.

## Checklist — OG card and logo only

- [ ] Catalog row for `dangates.co.il` has `dir='rtl'`; every upload dry-run first, then `-Confirm`.
- [ ] `altHe` read and corrected by a human — AI drafts are drafts (Media Studio rule 4).
- [ ] `ops/sync-media.ps1 -Domain dangates.co.il -DryRun` diff reviewed, then `-Confirm`;
      `ops/validate-manifests.ps1` exits 0; `site.config.json` changed only under `images`, and
      `hero` / `gallery` still `null`.
- [ ] `og:image` on every route is the catalog card (`titles.mjs` `ogUrlMissing 0`; no `/images/`
      path in any `og:image`); `schema.mjs` shows `image`/`logo` on the business node and 0
      `ImageObject`.
- [ ] The header logo is the one non-`/images/` `<img>` per page: `SiteImage`, `decorative`,
      width/height, `fixed`, `priority`.
- [ ] `npm run gate`; `perf.mjs` `imagesUnsized 0`; `a11y.mjs` no-alt 0; LCP not regressed.

## Gotchas

- **The OG card is generated, not hand-made:** `ops/make-og-card.ps1 -Domain dangates.co.il`
  renders a 1200×630 JPEG from the manifest's brand, tagline and colours (System.Drawing, no npm),
  then `studio-api.ps1 -Slot og` uploads it. **SVG OG cards render blank** on Facebook, X and
  LinkedIn, and `validate-manifests.ps1` rejects a vector `og` or `hero` outright.
- `public/` holds the logo, the `legacySrc`-style transition and — since the kit commit — the
  renderings under `public/images/<group>/` with their phone copies, governed by the page-images
  manifest and gate, not by this skill. Only catalog keys get srcset, format negotiation and the
  no-rebuild swap; a rendering gets neither and does not need them.
- The catalog gallery block has `mode: "fetched"` (runtime refresh from the public
  `/catalog/<domain>/gallery.json`). Never use it here: it adds client JS and a runtime dependency to
  a site whose performance story is "almost no JS", and the gallery slot stays `null` anyway. The
  site's `/גלריה/` is the renderings' page, built from the manifest at build time.
- ESLint `@next/next/no-img-element` is disabled inside `SiteImage` on purpose; a raw `<img>` in
  app code trips it and `a11y.mjs`/`perf.mjs` both look for what the kit guarantees.
- `images.unoptimized: true` is load-bearing (static export). Do not "enable optimisation" — there
  is no server to run it; Cloudflare does that job at the edge for catalog keys, and the renderings
  ship pre-encoded WebP at fixed boxes.
- Transformations on **this** zone serve `/cdn-cgi/image/…/dangates-logo.png` too
  (cloudflare-runbook step 2 verifies it), but `SiteImage` never emits that URL for a local path —
  if a local asset needs a srcset, move it to the catalog rather than hand-writing `cdn-cgi` URLs.
- PS 5.1 corrupts Hebrew in three places; `sync-media.ps1` works around all three. Do not
  "simplify" it, and do not write `altHe` with `Set-Content` or `ConvertTo-Json`.
