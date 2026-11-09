---
name: performance-web-vitals
description: Core Web Vitals for a static export on Cloudflare Pages — measured by scripts/audit/perf.mjs, not by hand — a text-only site with no imagery at all, the hand-pinned next/font preloads on the LCP path and why Next cannot emit them on Windows, the INP client-JS budget (five client components since 2026-11-09: LeadForm, MobileMenu, Reveal, DesktopNav, EngagementEvents), the RSC index.txt payloads kept for soft navigation and disallowed in robots.txt, the framer-motion dependency removed in 2026-09, CLS reserves, keeping dev-only chunks out of out/, and the kit's SiteImage/mediaUrl/srcsetFor pipeline (/site-images) for when photos finally arrive. Use before shipping or when LCP, CLS or INP regress. Triggers: "perf pass", "Core Web Vitals", "LCP slow", "image optimization", "bundle size", "srcset", "ביצועים", "מהירות האתר".
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
— **rebuild before asserting** (backlog N12). As of 2026-11-09 (at `9886dd1`) `perf.mjs` **passes**
(re-run, do not copy): `out/` 11.51 MB (11509453 B) in 143 files against the 12 MB `maxOutBytes`
(the live-kit surfaces added ≈1.15 MB in 2026-10; ≈0.49 MB headroom left — 11.69 MB at `2b0d802`,
until the header menus stopped being serialised twice into every RSC payload) · JS 783 KB in 33 chunks, largest
173 KB (within the §10.4 budget) · 6 `.woff2` with **2 font preloads** (§10.1 closed) ·
`unusedDeps []` (§10.3 closed) · 47 `index.txt` RSC payloads, 3.43 MB (3.51 MB at `2b0d802`) — kept for soft navigation
and disallowed in `robots.txt` since `2b0d802` (§1.3 ✅) · **5 client components** (§10.2; 3 until
2026-11-09) · 0 `<img>` (§10.5).

The script reads the artifact; it does not run a browser. For field numbers run Lighthouse / PSI
against the **live** URL, mobile profile, on a service page, a location page and a blog post (the
longest documents), and read CrUX in Search Console once it is provisioned (owner-actions §2.3).

## Start here: the site ships zero imagery

Across all 46 pages there is **not one `<img>`**. The header logo is text (`Header` prints
`{siteConfig.name}`); `public/dangates-logo.png` reaches only the JSON-LD `logo` (since `02a3144`); the only image in
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
- [ ] The LCP element per route type is identified (it is text today — confirm it still is).
- [ ] No new `"use client"` without a stated reason and a `KNOWN_CLIENT` entry; `clientComponents` stays 5 (§10.2).
- [ ] `unusedDeps []` — no dependency installed and imported nowhere.
- [ ] `out/` has no unreferenced file over 1 MB; total stays near 5.5 MB; `devBuildFiles 0`.
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
