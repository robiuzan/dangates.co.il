---
name: performance-web-vitals
description: Core Web Vitals for a static export on Cloudflare Pages — measured by scripts/audit/perf.mjs, not by hand — the 40px header logo (since 6407f83) and, since N37, the AI renderings under one note on every content page through components/images/Figure.tsx (static WebP under public/images/, a 720px phone copy, one fetchpriority=high per page, 900 KB per page and 20 MB in all outside the 15 MB maxOutBytes), the hand-pinned next/font preloads on the LCP path and why Next cannot emit them on Windows, the INP client-JS budget (five client components since 2026-11-09: LeadForm, MobileMenu, Reveal, DesktopNav, EngagementEvents), the RSC index.txt payloads kept for soft navigation and disallowed in robots.txt, the framer-motion dependency removed in 2026-09, CLS reserves, keeping dev-only chunks out of out/, and the kit's SiteImage/mediaUrl/srcsetFor path kept for the OG card and the header logo only (/site-images). Use before shipping or when LCP, CLS or INP regress. Triggers: "perf pass", "Core Web Vitals", "LCP slow", "image optimization", "bundle size", "srcset", "ביצועים", "מהירות האתר".
---

# Core Web Vitals

Static HTML on Cloudflare's edge — TTFB and caching are already good. This site's profile is unusual
and it changes the priorities: until N37 installs its renderings the font is the LCP path and the
client JS is the INP path; after it, the first content image per page (`fetchpriority="high"`) joins
the LCP path and the image budgets of `docs/performance-guidelines.md` §3.2 bind. Reviewer: `perf-a11y-auditor`; writer: `rtl-frontend-engineer`
(`docs/agent-roster.md` §3, row §10).

## Proof — measure, don't grep by hand

```bash
node scripts/audit/perf.mjs            # or: npm run audit -- --scope perf   (--json for metrics)
```

`perf.mjs` owns the numbers: `out/` weight, JS chunks, font preloads, RSC payloads, unused
dependencies, `"use client"` inventory, `<img>` count. It refuses a stale `out/` via `run-all.mjs`
— **rebuild before asserting** (backlog N12). As of 2026-11-09 (at `9886dd1`) `perf.mjs` **passes**
(re-run, do not copy): `out/` 11.51 MB (11509453 B) in 143 files against the 12 MB `maxOutBytes`
(the live-kit surfaces added ≈1.15 MB in 2026-10; ≈0.49 MB headroom left — 11.69 MB at `2b0d802`,
until the header menus stopped being serialised twice into every RSC payload) · JS 783 KB in 33 chunks, largest
173 KB (within the §10.4 budget) · 6 `.woff2` with **2 font preloads** (§10.1 closed) ·
`unusedDeps []` (§10.3 closed) · 47 `index.txt` RSC payloads, 3.43 MB (3.51 MB at `2b0d802`) — kept for soft navigation
and disallowed in `robots.txt` since `2b0d802` (§1.3 ✅) · **5 client components** (§10.2; 3 until
2026-11-09) · 0 `<img>` then (§10.5; the header logo followed in `6407f83` — `images 48` as of
2026-11-10 — and N37's renderings join at install).

The script reads the artifact; it does not run a browser. For field numbers run Lighthouse / PSI
against the **live** URL, mobile profile, on a service page, a location page and a blog post (the
longest documents), and read CrUX in Search Console once it is provisioned (owner-actions §2.3).

## Start here: the images are AI renderings under one note (N37)

Until N37 the only `<img>` per page was the 40 px header logo (`public/dangates-logo.png`, `6407f83`;
`perf.mjs` → `images 48`, as of 2026-11-10), and the only other image in play the OG card served from
the `imgquarry.com` media host in the manifest. The owner's decision of 2026-11-11 (CLAUDE.md §15,
ADR 0006) puts two or more AI renderings on each of the 46 content routes as illustrations under one
site-wide note, plus a `/גלריה/` page — plain `<figure>` elements in the text flow through
`components/images/Figure.tsx`, static WebP files under `public/images/` served by Pages itself.

- **The budgets** (`docs/performance-guidelines.md` §3.2): long edges 1400 / 1200 / 960 / 480 px at
  200 / 170 / 120 / 45 KB; a 720 px phone copy ≤ 120 KB through `<picture><source media>`; ≤ 900 KB
  of images per page, `/גלריה/` ≤ 3 MB (`pageBudgets` 3145728 — decision 7 said 2.5 MB; the gate
  sums the full files, and its 14 tiles at their caps are 2,652,160 B), `out/images/` ≤ 20 MB in
  all; `maxOutBytes` 15 MB measures
  `out/` **without** `out/images/`, and `perf.mjs` reports `imagesBytes` beside `outBytes`.
- **The LCP rule:** exactly one `fetchpriority="high"` per page, on the first content image in DOM
  order; everything else lazy; `width`/`height` on every image (`imagesUnsized 0`). A figure above
  the fold must not push the text LCP later — measure before and after install.
- **The gate:** `node scripts/images/check-images-out.mjs out` runs in `postbuild` (after
  `check-live-out`) and as `npm run images:check`; `npm run images:status` reads the manifest. A build
  with `out/.images-draft` is a local preview and never deploys.
- **What a perf pass does not judge:** provenance, captions and the note — those are
  `image-qa-reviewer`, `eeat-trust-auditor` and `docs/eeat-and-trust.md` §2.1. A real photo enters
  the same manifest as an `owner-supplied` entry (owner-actions 4.5).

**The catalog path stays for the OG card and the header logo only** — `/site-images`: Media Studio
catalog → `ops/sync-media.ps1` merges the `images` block into the roster manifest **and**
`site.config.json` (never hand-edit) → `SiteImage` / `srcsetFor` / `mediaUrl` / `preloadPropsFor` from
`@ishub/site-kit` → Cloudflare Image Transformations, which are **on** for this zone
(`docs/cloudflare-runbook.md` step 2). `next.config.mjs` sets `images.unoptimized: true`, so
`next/image` would emit a bare `<img>` with no srcset; content images never go through it or through
`SiteImage` (`Figure` is a plain `<picture>`/`<img>`). `SiteImage` still requires a non-empty `alt`
**at compile time** (`alt=""` is a type error; decorative art opts in explicitly), and `width`/`height`
are mandatory under a static export for every image, whichever path it takes.

## Fonts — the real LCP lever on this site

Rubik is self-hosted via `next/font/google` (`app/layout.tsx:15-21`: subsets `hebrew` + `latin`,
`display: "swap"`, exposed as `--font-rubik`). The export ships six `.woff2` files, two of them
`.p.woff2` — `next/font`'s own preload candidates. With a text-only LCP, every first paint waits on
the font, which is why this was the highest-value perf change available.

**Done since 2026-09-06 (§10.1, commit `13a6bdc`) — `perf.mjs` → `fontPreloads 2`.** The two hrefs
are pinned in `lib/fonts.ts` as `FONT_PRELOADS` and rendered by `app/layout.tsx` inside the same
`<head>` as the `imgquarry` preconnect.

**Why they are hand-added rather than framework-emitted — read this before "fixing" it.** Next's
`NextFontManifestPlugin` tests `mod.request.includes("/next-font-loader/index.js?")` — a
forward-slash literal — against a webpack `request` built with `path.join`, which yields backslashes
on Windows. The substring can never match on this platform, `next-font-manifest.json` stays
`{"pages":{},"app":{}}` on every build regardless of `output` mode, and no automatic preload link is
ever emitted here. Deleting the hand-added links to "let the framework do it" ships zero preloads.

**If the font config changes** (any edit to the `Rubik({...})` call), the hashes move and the pinned
hrefs go stale. The procedure is in `lib/fonts.ts`'s own header comment: clean rebuild, grep the
`@font-face` blocks in `out/_next/static/css/*.css` for the two `.p.woff2` files, match each to its
`unicode-range` (Hebrew carries `u+0590-05ff`, Latin carries `u+0131`/`u+00??`), update the two
hrefs, re-run `perf.mjs`. It fails on a preloaded href that is not a real file in `out/`, so a stale
hash is caught by the gate rather than shipped as a 404 preload.

**Preload those two and no more.** Preloading all six competes for the bandwidth the HTML and the one
CSS file need first.

## JS budget — INP

783 KB across 33 chunks (2026-11-09, at `2b0d802`; 757 KB in 30 on 2026-11-08) for a brochure site
is more than it needs. The five `"use client"` files (`perf.mjs` / `rtl-lint.mjs`
`clientComponents`) and what to do with each — there were four until Sprint 3 (`Faq` → `<details>`
in `7cfcf4c`, `Header` split into a server shell and the `MobileMenu` leaf in `60ce109`; §10.2 ✅),
three until 2026-11-09, when `DesktopNav` (`fd72698`) and `EngagementEvents` (`98e38f0`) joined the
ledger in their own changes:

| Component                                    | Why client                        | Action                                                                                                           |
| -------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `components/layout/MobileMenu.tsx`           | open state, focus trap            | Keep it the leaf: toggle, panel, Escape, Tab trap, scroll lock. `Header` stays a server component around it.     |
| `components/layout/DesktopNav.tsx`           | open state, Escape, outside click | The two header disclosures (§9.1). Props only from the server shell; never move the nav data into it.            |
| `components/forms/LeadForm.tsx`              | fetch + state                     | Genuinely client. Keep it a leaf; it grew with §8.1 validation and the §13.4–§13.5 events — do not grow it more. |
| `components/ui/Reveal.tsx`                   | IntersectionObserver              | Genuinely client; see Motion below.                                                                              |
| `components/engagement/EngagementEvents.tsx` | document listeners                | Renders nothing; the six engagement events (N20). Passive listeners only — never a polling loop.                 |

`framer-motion@^11` was a dependency **imported nowhere**; it was uninstalled 2026-09-06 (§10.3, commit `13a6bdc`) and `perf.mjs` now reports `unusedDeps []`. It never reached the bundle — the cost was install time, audit surface and the temptation to animate around the CSS reduced-motion reset. Do not add it back: `Reveal` already covers motion with an `IntersectionObserver` and a CSS transition, and `unusedDeps` will flag anything new that lands installed-but-unimported.

## RSC payloads — the `index.txt` files (§1.3, decided 2026-11-09)

Next writes one `index.txt` beside every `index.html`: the RSC payload `next/link` fetches for
client-side navigation. They stay: commit `1ac37ff` deliberately keeps link clicks soft, and deleting the
payloads would make every internal link a full reload. What changed is that they are no longer crawlable
targets: `RSC_PAYLOAD_DISALLOW` in `app/robots.ts` disallows `/index.txt` and `/*/index.txt` in every
user-agent group. A `_headers` noindex would conflict (a disallowed URL never shows it), so there is
one mechanism. Proof: `edge.mjs` → `rscPayloadsDisallowed true`; `perf.mjs` `rscPayloads` still counts
the files (the warn stays by design — they are shipped weight, not crawl exposure).

## Build hygiene — keep dev chunks out of `out/`

On this fleet an export once carried ~14 MB of dev-only chunks (`main.js`, `fallback/*`,
`react-refresh.js`) — a `next dev` run's artifacts surviving in `.next/`. dangates is clean today
(`edge.mjs` `devBuildFiles 0`, `sourceMaps 0`). Hold that line by always building from a clean cache:

```bash
node -e "require('fs').rmSync('.next',{recursive:true,force:true})" && npm run build
```

`rm -rf` is blocked by `guard-destructive-ops.ps1`; `out/` is regenerated by the build and must never
be edited by hand. Deleting files from `out/` afterwards is not the fix; clearing `.next/` is.

## CLS

Sound, largely by default — no media, no late-loading blocks. The sticky mobile bar has its
`h-16 lg:hidden` spacer at `app/layout.tsx:76`. Preserve it, and reserve the box (`width`/`height`)
for every image that `/site-images` eventually places above the fold.

## Motion

`app/globals.css:96` carries the global `prefers-reduced-motion` reset. `components/ui/Reveal.tsx`
starts **visible** and only opts into the hide→show animation after mount with a scroll backstop, so
nothing is stranded at `opacity: 0` and nothing is hidden from crawlers — preserve both properties.
Note that `Reveal` is a `<div>`: wrapping an `<li>` with it breaks list semantics — `Process` did until
`7cfcf4c` (§11.2 ✅); each `<li>` now wraps its own `Reveal` (`/responsive-accessibility`).

## Checklist

- [ ] `node scripts/audit/perf.mjs` run on a **clean** rebuild; the numbers you quote are from it.
- [ ] `fontPreloads 2` for the two `.p.woff2` faces — no more, and no dangling href (the script asserts each resolves in `out/`); re-check the pinned hashes in `lib/fonts.ts` after any `Rubik({...})` change.
- [ ] The LCP element per route type is identified (text until N37 installs; the first content image after — confirm which).
- [ ] No new `"use client"` without a stated reason and a `KNOWN_CLIENT` entry; `clientComponents` stays 5 (§10.2).
- [ ] `unusedDeps []` — no dependency installed and imported nowhere.
- [ ] `out/` has no unreferenced file over 1 MB; total stays near 5.5 MB; `devBuildFiles 0`.
- [ ] Every content image is a `components/images/Figure.tsx` (N37): Hebrew `alt`, `width`/`height`,
      the `<picture>` phone copy, exactly one `fetchpriority="high"` per page;
      `node scripts/images/check-images-out.mjs out` exits 0 and `imagesBytes` stays under the
      manifest's 20 MB.
- [ ] Lighthouse mobile on the live service / location / post URLs after deploy.

## Gotchas

- **A build that "passes" can be the wrong build.** The npm `file:` tarball cache and `.next/` both
  serve stale code silently — `/deploy-dangates` explains both traps; clear `.next/` before you measure.
- **`next/image` is inert here.** `images.unoptimized: true` means `sizes` does nothing; the content
  images are plain `<picture>`/`<img>` through `Figure` with a phone copy, and only the kit's
  `SiteImage` (OG card, header logo) produces a transformation srcset.
- **Preconnect to `imgquarry.com`** (`app/layout.tsx:49-55`) serves the OG card only — the content
  images of N37 are same-origin files under `/images/`. Cheap; keep it.
- **Do not add an animation library** to fix a perceived flatness — the CSS reset and `Reveal` already
  cover motion, and INP is the budget that pays for it.
