---
name: performance-web-vitals
description: Core Web Vitals for a static export on Cloudflare Pages — measured by scripts/audit/perf.mjs, not by hand — a text-only site with no imagery at all, the missing next/font preloads that sit on the LCP path, the INP client-JS budget (Header client for one boolean, Faq → <details>), the 45 crawlable RSC index.txt payloads, the unused framer-motion dependency, CLS reserves, keeping dev-only chunks out of out/, and the kit's SiteImage/mediaUrl/srcsetFor pipeline (/site-images) for when photos finally arrive. Use before shipping or when LCP, CLS or INP regress. Triggers: "perf pass", "Core Web Vitals", "LCP slow", "image optimization", "bundle size", "srcset", "ביצועים", "מהירות האתר".
---

# Core Web Vitals

Static HTML on Cloudflare's edge — TTFB and caching are already good. This site's profile is unusual
and it changes the priorities: **there are no images at all**, so the font is the LCP path and the
client JS is the INP path. Reviewer: `perf-a11y-auditor`; writer: `rtl-frontend-engineer`
(`docs/agent-roster.md` §3, row §10).

## Proof — measure, don't grep by hand

```bash
node scripts/audit/perf.mjs            # or: npm run audit -- --scope perf   (--json for metrics)
```

`perf.mjs` owns the numbers: `out/` weight, JS chunks, font preloads, RSC payloads, unused
dependencies, `"use client"` inventory, `<img>` count. It refuses a stale `out/` via `run-all.mjs`
— **rebuild before asserting** (backlog N12). As of 2026-08-23 (re-run, do not copy): `out/`
5.42 MB in 170 files · JS 751 KB in 29 chunks, largest 173 KB (within the §10.4 budget) · 6 `.woff2`,
**0 font preloads** (the one failure, §10.1) · 45 `index.txt` RSC payloads, 1.43 MB (§1.3) ·
`framer-motion` imported nowhere (§10.3) · 4 client components (§10.2) · 0 `<img>` (§10.5).

The script reads the artifact; it does not run a browser. For field numbers run Lighthouse / PSI
against the **live** URL, mobile profile, on a service page, a location page and a blog post (the
longest documents), and read CrUX in Search Console once it is provisioned (owner-actions §2.3).

## Start here: the site ships zero imagery

Across all 45 pages there is **not one `<img>`**. The header logo is text (`components/layout/Header.tsx:23`
prints `{siteConfig.name}`); `public/dangates-logo.png` is referenced by nothing; the only image in
play is the OG card served from the `imgquarry.com` media host in the manifest.

- **Performance-wise this is excellent.** LCP is a text element on every route; no image payload, no
  unsized media, no srcset problem. Do not "optimize images" — there are none.
- **Commercially it is the site's biggest trust gap** (business-facts §F, owner-actions §4.1 —
  photos are ⏳ coming). That is an E-E-A-T / CRO finding, not a perf one: `/eeat-build`, `/site-images`.

**When photos land, add them properly the first time** — the full flow is `/site-images`: Media Studio
catalog → `ops/sync-media.ps1` merges the `images` block into the roster manifest **and**
`site.config.json` (never hand-edit) → `SiteImage` / `srcsetFor` / `mediaUrl` / `preloadPropsFor` from
`@ishub/site-kit` → Cloudflare Image Transformations, which are **on** for this zone
(`docs/cloudflare-runbook.md` step 2). `next.config.mjs` sets `images.unoptimized: true`, so
`next/image` would emit a bare `<img>` with no srcset; `SiteImage` is the route that fits. It
requires a non-empty `alt` **at compile time** (`alt=""` is a type error; decorative art opts in
explicitly), and `width`/`height` are mandatory under a static export.

## Fonts — the real LCP lever on this site

Rubik is self-hosted via `next/font/google` (`app/layout.tsx:13-17`: subsets `hebrew` + `latin`,
`display: "swap"`, exposed as `--font-rubik`). The export ships six `.woff2` files, and `next/font`
marks two of them `.p.woff2` — its own preload candidates — yet the built `<head>` carries **no**
`<link rel="preload" as="font">` (the only preload there is the webpack chunk). With a text-only LCP,
every first paint waits on the font. This is the highest-value perf change available (§10.1).

Recipe, in order:

1. Reproduce on a **clean rebuild** (N12) — a polluted `.next/` has dropped framework-injected tags
   on this fleet before.
2. Establish why the framework's default preload is absent (it is on by default for `next/font`);
   the two `.p.woff2` files are the Hebrew + Latin faces the hero renders — confirm that pairing
   by grepping the `@font-face` blocks in `out/_next/static/css/*.css`.
3. If the framework still does not emit them, add the two by hand inside the existing `<head>`
   block of `app/layout.tsx` (next to the `imgquarry` preconnect):
   ```tsx
   <link
     rel="preload"
     as="font"
     type="font/woff2"
     crossOrigin="anonymous"
     href="/_next/static/media/<hash>-s.p.woff2"
   />
   ```
   Hashes are content-derived and stable until the font file changes; extend `perf.mjs` to assert
   every preloaded href exists in `out/` so a font bump cannot leave a dangling preload.
4. **Preload the two `.p.woff2` only.** Preloading all six competes for the bandwidth that the HTML
   and the one CSS file need first.

Done when `perf.mjs` reports `fontPreloads` of 1–2 and the failure clears.

## JS budget — INP

751 KB across 29 chunks for a brochure site is more than it needs. The four `"use client"` files
(`perf.mjs` / `rtl-lint.mjs` `clientComponents`) and what to do with each:

| Component                       | Why client             | Action                                                                                                                                                                                                                   |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `components/layout/Header.tsx`  | one `useState` boolean | Split: server `Header` renders logo, desktop nav, phone button; a leaf `MobileMenu` client component owns the toggle and receives `navItems` + phone as props. Fix §11.4 in the same pass (`/responsive-accessibility`). |
| `components/marketing/Faq.tsx`  | accordion state        | Replace with `<details>/<summary>` — zero JS, answers stay in the DOM (fixes N8 and keeps `FAQPage` parity, `schema.mjs`). Template: `.claude/skills/engagement-ux/templates/Faq.tsx`.                                   |
| `components/forms/LeadForm.tsx` | fetch + state          | Genuinely client. Keep it a leaf.                                                                                                                                                                                        |
| `components/ui/Reveal.tsx`      | IntersectionObserver   | Genuinely client; see Motion below.                                                                                                                                                                                      |

`framer-motion@^11` is a dependency **imported nowhere** — `npm uninstall framer-motion` (§10.3).
It is not in the bundle today; the cost is install time, audit surface and the temptation to animate
around the CSS reduced-motion reset. `perf.mjs` reports `unusedDeps` until it is gone.

## RSC payloads — 45 `index.txt` files (§1.3)

Next writes one `index.txt` beside every `index.html`: the RSC payload `next/link` prefetches for
client-side navigation. They are 1.43 MB of crawlable duplicate copy. Two options, decided in the
backlog row, not as a drive-by: a post-build step in `package.json` that strips `out/**/index.txt`
(a script step, never a hand delete — `out/` is a protected path), after verifying that navigation
falls back cleanly to full page loads; or `Disallow: /*/index.txt` in `app/robots.ts`, which keeps
prefetch and only removes them from the index. Whichever ships, `perf.mjs` `rscPayloads` is the proof.

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
Note that `Reveal` is a `<div>`: wrapping an `<li>` with it (`components/marketing/Process.tsx:13`)
breaks list semantics — an a11y finding (§11.2), handled in `/responsive-accessibility`.

## Checklist

- [ ] `node scripts/audit/perf.mjs` run on a **clean** rebuild; the numbers you quote are from it.
- [ ] Font preloads present for the two `.p.woff2` faces — and no more than two.
- [ ] The LCP element per route type is identified (it is text today — confirm it still is).
- [ ] No new `"use client"` without a stated reason; Header split and Faq → `<details>` tracked (§10.2).
- [ ] `framer-motion` removed, or actually used and `useReducedMotion()`-gated.
- [ ] `out/` has no unreferenced file over 1 MB; total stays near 5.4 MB; `devBuildFiles 0`.
- [ ] If any image is added: `SiteImage`, Hebrew `alt`, `width`/`height`, box reserved, at most one
      `preloadPropsFor()` resource per page.
- [ ] Lighthouse mobile on the live service / location / post URLs after deploy.

## Gotchas

- **A build that "passes" can be the wrong build.** The npm `file:` tarball cache and `.next/` both
  serve stale code silently — `/deploy-dangates` explains both traps; clear `.next/` before you measure.
- **`next/image` is inert here.** `images.unoptimized: true` means `sizes` does nothing; only the
  kit's `SiteImage` produces a real srcset.
- **Preconnect to `imgquarry.com`** (`app/layout.tsx:49-55`) opens a connection no page uses yet.
  Cheap; keep it for the day photos ship.
- **Do not add an animation library** to fix a perceived flatness — the CSS reset and `Reveal` already
  cover motion, and INP is the budget that pays for it.
