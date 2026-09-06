# Performance guidelines — Core Web Vitals budgets for a text-only static export

> **Layer:** standards. This file decides the byte budgets a build must meet, the Core Web Vitals
> the live site is held to, and which of the four client components earn their hydration. The
> `performance-web-vitals` skill is the how-to (`site-images` for the day photos land); the
> `perf-a11y-auditor` agent audits against this file; `scripts/audit/perf.mjs` measures it and
> `edge.mjs` covers output hygiene and the headers file. Reads with:
> [optimization-backlog.md](optimization-backlog.md) §10, [owner-actions.md](owner-actions.md) §1–§2,
> [cloudflare-runbook.md](cloudflare-runbook.md), [data-tracking-infrastructure.md](data-tracking-infrastructure.md).
>
> **One rule governs everything below: this site ships zero images, so the brand font is the LCP
> path and client JavaScript is the INP path.** Every number in §0 comes from `perf.mjs` or a
> dated command; re-measure before citing (§6 below). Nothing here is a field measurement (§6.2
> below). Bare `§n.n` is a backlog id; this file's own sections are marked "above" or "below".

---

## 0. Current state — verified 2026-08-24

The `perf` block of [audits/2026-08-24-full.md](audits/2026-08-24-full.md), verbatim
(`node scripts/audit/run-all.mjs --scope full`, export built 2026-08-24T16:36Z, commit `82a2a73`):

| metric               | value                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| outBytes             | 5424052                                                                                                             |
| outFiles             | 170                                                                                                                 |
| jsFiles              | 29                                                                                                                  |
| jsTotalBytes         | 751143                                                                                                              |
| largestJs            | \_next/static/chunks/fd9d1056-0807e69ea9c303ac.js                                                                   |
| largestJsBytes       | 172834                                                                                                              |
| woff2Files           | 6                                                                                                                   |
| fontPreloads         | 0                                                                                                                   |
| rscPayloads          | 45                                                                                                                  |
| rscBytes             | 1434799                                                                                                             |
| unusedDeps           | framer-motion                                                                                                       |
| clientComponents     | 4                                                                                                                   |
| clientComponentFiles | components/forms/LeadForm.tsx, components/layout/Header.tsx, components/marketing/Faq.tsx, components/ui/Reveal.tsx |
| images               | 0                                                                                                                   |
| imagesUnsized        | 0                                                                                                                   |
| resourceHints        | preconnect https://imgquarry.com                                                                                    |

Verdict that day: **1 failure** (0 font preloads, §10.1), 2 warnings (45 RSC payloads §1.3;
`framer-motion` unused §10.3). `edge.mjs` in the same run: `sourceMaps 0`, `devBuildFiles 0`,
`headersFile false` — hygiene holds (§10.4) while every build starts from a clean `.next/`.

All of it went live with the Sprint 0 deploy on 2026-09-06 (11:06 UTC; until then the domain served the 2026-08-03 build), so a live `curl` or PageSpeed run now describes the same code as `out/` — until the next repo change ships.

### 0.1 Binding budgets — `scripts/audit/thresholds.json` → `perf`

The only budgets a build is held to today. `perf.mjs` reads them; nothing else is enforced.

| Key               | Bytes      | Measured 2026-08-24 | Severity in `perf.mjs` | Backlog |
| ----------------- | ---------- | ------------------- | ---------------------- | ------- |
| `maxOutBytes`     | 12,000,000 | 5,424,052           | fail                   | §10.4   |
| `maxJsFileBytes`  | 1,000,000  | 172,834 (largest)   | fail                   | §10.4   |
| `maxJsTotalBytes` | 1,200,000  | 751,143             | warn                   | §10.2   |

The first two exist to catch a polluted `.next/` (this fleet once shipped ~14 MB of dev-only
chunks); they are not targets. The JS total is the one that speaks to INP, and it is loose.

### 0.2 Proposed budgets — not in `thresholds.json`

Measured 2026-09-06 with `node` + `zlib` against the `out/` in the tree (built 2026-09-06T06:01Z).
`perf.mjs` records none yet; a proposal binds only once it is in `thresholds.json` and read there.

| Budget (per route, gzip unless stated)    | Measured on `/`             | Proposed ceiling | Status                               |
| ----------------------------------------- | --------------------------- | ---------------- | ------------------------------------ |
| HTML                                      | 172,377 raw / 23,161 gz     | ≤ 40,000 gz      | proposed — not in thresholds → new   |
| CSS (1 file)                              | 33,308 raw / 7,100 gz       | ≤ 15,000 gz      | proposed — not in thresholds → new   |
| JS referenced by the page (11 chunks)     | 489,352 raw / 154,682 gz    | ≤ 110,000 gz     | proposed — not in thresholds → §10.2 |
| Fonts on the critical path (2 `.p.woff2`) | 44,676 raw (9,352 + 35,324) | ≤ 60,000         | proposed — not in thresholds → §10.1 |
| LCP image                                 | none ships                  | ≤ 120,000        | proposed — not in thresholds → §10.5 |

---

## 1. Core Web Vitals targets

Fleet **targets**, not measurements. There is no field data for this domain: GA4 and Search
Console are unprovisioned (owner-actions §2.3, §2.4; backlog §13.7), Cloudflare Web Analytics is
an owner toggle nobody has flipped (§6.2 below), so the only numbers are lab runs.

| Metric                            | Target   | Hard fail | Primary lever on this site                                       |
| --------------------------------- | -------- | --------- | ---------------------------------------------------------------- |
| **LCP** Largest Contentful Paint  | < 2.0 s  | > 2.5 s   | Rubik on the critical path — the missing preload (§4 below)      |
| **INP** Interaction to Next Paint | < 150 ms | > 200 ms  | Hydration JS from the four client components (§2 below)          |
| **CLS** Cumulative Layout Shift   | < 0.05   | > 0.1     | Font swap; the sticky bar's spacer; image boxes when photos land |
| **TTFB**                          | < 400 ms | > 800 ms  | Static HTML on Cloudflare's edge — already the case (§5 below)   |

### 1.1 The LCP element is text

With 0 `<img>` on 45 pages, the LCP candidate on every route is a heading or paragraph set in
Rubik, loaded through `next/font/google` in `app/layout.tsx` — `subsets: ["hebrew", "latin"]`,
`display: "swap"`, exposed as `--font-rubik` to the `@theme` tokens in `app/globals.css`. That
mechanism self-hosts the font: the `.woff2` files are emitted under `/_next/static/media/` with
content hashes, so nothing goes to Google Fonts at runtime and they fall under the immutable cache
rule of §5 below. `display: "swap"` paints first with the fallback stack (`system-ui, Arial,
sans-serif`) and re-renders when Rubik arrives — no invisible text, but a reflow that counts
against CLS and moves the LCP paint to the swap. **The preload rule (§4 below) is therefore on the
LCP path** and §10.1 is the highest-value performance change available; as of 2026-08-24 the only
`<link rel="preload">` in the built `<head>` is the webpack chunk.

---

## 2. JavaScript budget — INP

751 kB across 29 chunks in `out/` as of 2026-08-24; the 11 chunks `/` references weigh 154,682
bytes gzipped (measured 2026-09-06) — for a site whose interactive surface is a menu toggle, an FAQ
and a lead form. The four `"use client"` files:

| Component                       | Why it is client       | Verdict                                                                                                                                     | Backlog      |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `components/layout/Header.tsx`  | one `useState` boolean | Hydrates the whole nav tree for a mobile toggle. Split: server `Header`, leaf `MobileMenu` client. Fix §11.4 in the same pass.              | §10.2, §11.4 |
| `components/marketing/Faq.tsx`  | accordion `useState`   | Replace with native `<details>`/`<summary>` — zero JS, answers stay in the DOM. Template: `.claude/skills/engagement-ux/templates/Faq.tsx`. | §10.2, N8    |
| `components/forms/LeadForm.tsx` | fetch + form state     | Genuinely client. Keep it a leaf; fix its silent error state (N1) without growing it.                                                       | §8.1, N1     |
| `components/ui/Reveal.tsx`      | `IntersectionObserver` | Correct implementation, wrong shape — §2.1 below.                                                                                           | §10.2, §11.2 |

### 2.1 `Reveal` — the pattern, not the implementation

The component is well built: it starts `"static"` (fully visible), returns early under
`prefers-reduced-motion`, and only opts into hide→show after mount, so nothing can strand at
`opacity: 0` on a static export. Do not rewrite it for correctness. The cost is structural: it is a
client component **used as a wrapper around content subtrees** — `Process`, `ServicesGrid`, `WhyUs`
and `Reviews` all pass their markup through it — so every wrapped subtree crosses the client boundary
and is hydrated to animate a fade. It also breaks semantics: `Process` renders `<Reveal>` between
the `<ol>` and each `<li>`, so the five steps are not announced as a list (§11.2, `a11y.mjs`).
**Target:** keep the behaviour, move the boundary — a CSS-only reveal (`animation-timeline: view()`
under the reduced-motion reset in `app/globals.css`) or one small script toggling a class on
`[data-reveal]` elements; never a React wrapper around content. The `<li>` fix does not wait for
that: `Reveal` must never sit between a list and its items.

### 2.2 `Faq` → `<details>`/`<summary>`

Every answer renders `hidden={!isOpen}` today: in the DOM (so `FAQPage` parity holds under
`schema.mjs`) but `display:none` for find-in-page, readers who do not click, and crawlers that
honour visibility (N8). The engagement-ux template is a server component with the same `FaqItem`
shape, `open` on the first item, `name="faq"` for exclusive disclosure where supported and
`min-h-11` for the 44 px tap target — one change removes a client component and closes N8.

### 2.3 Dead weight and duplicates

- **`framer-motion`** (`^11.3.31`) is in `package.json` `dependencies` and imported nowhere under
  `app/`, `components/`, `lib/` or `scripts/`. Not in the bundle; the cost is install time, audit
  surface and the temptation to animate around the reduced-motion reset. `npm uninstall` (§10.3);
  if motion is ever wanted, the answer is CSS.
- **45 RSC `index.txt` payloads**, 1,434,799 bytes as of 2026-08-24 (§1.3) — one beside every
  `index.html` for `next/link` prefetch; not on the JS budget, but crawlable duplicates of every
  page's copy. Decide in the backlog row: strip `out/**/index.txt` as a post-build step in
  `package.json` (a script, never a hand delete — `out/` is protected) after confirming navigation
  falls back to full loads, or `Disallow: /*/index.txt` in `app/robots.ts` — the backlog row still
  says "Cloudflare-side"; the managed `robots.txt` has been off since 2026-08-23 (cloudflare-runbook
  step 1), so the repo file is the place.

### 2.4 The `"use client"` ledger and the rules

`scripts/audit/rtl-lint.mjs` carries the known set — `Header`, `Faq`, `LeadForm`, `Reveal` — and
warns on any file outside it; `perf.mjs` reports the same census as `clientComponentFiles`. **That
set is the ledger.** A new client component is added to it in the same change with the reason in
the commit; a removed one (Faq, then Header) comes out so the audit cannot silently accept it back.
RSC by default; `"use client"` only for state, effects or browser APIs, at the leaf, wrapping the
control and never the content subtree (CLAUDE.md §7). `lucide-react` icons by name, never as a
namespace. No dependency that duplicates the platform — no animation, carousel or form library
(CLAUDE.md §12); `perf.mjs` catches an unused one, nothing catches a new one (§8 below). GTM stays
the only third-party script — the one documented exception is the Cloudflare Web Analytics beacon
once the owner enables it ([data-tracking-infrastructure.md](data-tracking-infrastructure.md)
§5.1); §13.1 moves the GTM init to `<head>`, and as the loader is `async` that is a
tracking-correctness change, not a perf regression.

---

## 3. Images

### 3.1 Today: zero

45 pages, 0 `<img>` (`perf.mjs` → `images: 0`; `a11y.mjs` → `imgCount: 0`). The header renders the
brand as text; `public/dangates-logo.png` is referenced by nothing; the only image served is the OG
card — `ogImageMeta(manifest.images)` in `app/layout.tsx` — from the `imgquarry.com` media host.
No LCP image, no srcset, no CLS from media. **Do not file image findings against images that do
not exist** (§10.5). The absence is a trust problem, not a perf one (§7.5, business-facts §F).

### 3.2 When the job photos land — the constraints the `site-images` pipeline must satisfy

- **Only `SiteImage`** from `@ishub/site-kit/components`, backed by `srcsetFor` / `mediaUrl` and a
  catalog key in the manifest. `images.unoptimized: true` in `next.config.mjs` makes `next/image`
  a bare `<img>` with no srcset — inert here. Resizing and WebP/AVIF (`format=auto`) happen at the
  edge: Cloudflare Image Transformations on `imgquarry.com`, on for this zone (owner-actions §1.4,
  cloudflare-runbook step 2), verifiable only against a live `/cdn-cgi/image/…` response.
- **`width` and `height` on every image** — under a static export the intrinsic dimensions in the
  markup are the only CLS reserve (`perf.mjs` warns). **`sizes` on every fluid image**; `fixed`
  for the logo and badges.
- **One `priority` image per page** — the LCP candidate — paired with `preloadPropsFor()` in the
  `<head>` next to the existing `preconnect`; everything else lazy. Measure before granting it: a
  hero photo must not push the text LCP later.
- **Hebrew `alt` on every meaningful image; `alt=""` (the `decorative` prop) only for decoration.**
  `SiteImage` refuses an empty alt at compile time; `a11y.mjs` fails a missing one.
- **Budget:** LCP image ≤ 120,000 bytes, any other ≤ 80,000 — proposed (§0.2 above). Real photos
  only; a stock image presented as work is a fabrication of the class of the reviews gone from the
  repo since 2026-08-17 (off the domain since the Sprint 0 deploy on 2026-09-06).

---

## 4. Fonts

One family, Rubik, for body and headings (`font-sans` and `font-heading` both resolve to
`--font-rubik`). Six `.woff2` ship under `/_next/static/media/`, 123,840 bytes in total (measured
2026-09-06), because `next/font` emits an `@font-face` per unicode range Rubik offers; a browser
downloads only the ranges a page uses. Two carry the `.p.woff2` preload marker — the two subsets
`app/layout.tsx` requested. Hashes are content-derived and change only with the font file:

| File                         | Range                  | Bytes  | Role                                               |
| ---------------------------- | ---------------------- | ------ | -------------------------------------------------- |
| `99e31c27a1524300-s.p.woff2` | `u+0590-05ff` (hebrew) | 9,352  | every heading and paragraph — the LCP face         |
| `0a86735c6520d94f-s.p.woff2` | `u+00??` (latin)       | 35,324 | digits, phone, email, price, URL — the LTR islands |

- 🔴 **Preload these two, and only these two.** As of 2026-08-24 the built `<head>` carries 0
  `<link rel="preload" as="font">` (§10.1, `perf.mjs` fails); the 2026-09-06 export in the tree
  carries 0 as well. `next/font` normally injects them: first a clean rebuild (N12) to rule out a
  polluted `.next/`; then, if the framework still omits them, the hand-written pair in the `<head>`
  block of `app/layout.tsx`, with `perf.mjs` extended to assert every preloaded href exists in
  `out/`. All six would compete with HTML and CSS.
- **Keep the `latin` subset** — the `dir="ltr"` islands render in it — and **keep
  `display: "swap"`** with the fallback already in the tokens; `optional` would leave the brand
  font invisible on first visit, which on a text-only LCP is worse than a swap. One family is the
  ceiling (§7 below).

---

## 5. Caching & delivery

### 5.1 What Cloudflare Pages serves today

Measured 2026-09-06 with `curl -sSI https://dangates.co.il/`: `Server: cloudflare`,
`cf-cache-status: DYNAMIC`, `Cache-Control: public, max-age=0, must-revalidate`,
`Strict-Transport-Security: max-age=15552000` (a zone rule, with `X-Frame-Options: SAMEORIGIN`,
`nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(),
microphone=(), camera=()`; no CSP — §12.1, §12.2). The cache values are the Pages default for HTML
— every deploy is visible on the next request — and they are correct. No `public/_headers` exists
(`edge.mjs` → `headersFile false`); `/_next/static/` assets get the platform default.

### 5.2 Planned — `public/_headers` (§12.1, ADR 0004 Phase 1)

The cache block of `.claude/skills/web-security-headers/templates/_headers`:

```text
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

Everything under `/_next/static/` — chunks, CSS, the six `.woff2` — is content-hashed, so a year
and `immutable` are safe. HTML keeps the Pages default; never add a long TTL to it. The same file
adopts the zone's security headers, which is why it ships with §12.1.

### 5.3 Origins

`preconnect` to `https://imgquarry.com` already ships from the `<head>` block of `app/layout.tsx`
when the manifest carries a `mediaHost` — unused until photos land, cheap, and `preloadPropsFor`
assumes it. The only third-party origins a page may touch: `www.googletagmanager.com` (GTM),
`google-analytics.com` (GA4, inside the container), `api.web3forms.com` (lead-form POST) and
`imgquarry.com` (media) — the list the report-only CSP in the same template encodes; a new origin is
a §12.2 conversation first. No other font host, no CDN-loaded library, no runtime-fetched gallery.

---

## 6. How to measure

### 6.1 The export and the live site

```bash
npm run build
node scripts/audit/perf.mjs      # or: npm run audit -- --scope perf   (--json for the metrics)
grep -c 'as="font"' out/index.html    # expect 2 after §10.1
curl -sS -o /dev/null -w "code=%{http_code} ttfb=%{time_starttransfer}s total=%{time_total}s bytes=%{size_download}\n" https://dangates.co.il/
curl -sSI https://dangates.co.il/ | grep -iE 'cache-control|cf-cache-status|strict-transport'
```

`run-all.mjs` refuses a stale `out/` (N12). Quote only what this run printed, dated. For the live
site: PageSpeed Insights, mobile, on a service page, a location page and a blog post, not only `/`
— and say which deploy it measured (§0 above: the domain has run the repo build since 2026-09-06).
Lab scores on a static export flatter the site; INP only shows its cost with real interaction.

### 6.2 Field data — what arrives when

| Source                       | Gives                    | State                                                                                                               | Unblocks                        |
| ---------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| CrUX via Search Console      | LCP/INP/CLS at p75       | 🔶 unprovisioned — owner-actions §2.3; needs traffic                                                                | backlog §13.7                   |
| GA4 (via GTM `GTM-KWGGH438`) | engagement, event timing | 🔶 `ga4MeasurementId: null` — owner-actions §2.4                                                                    | backlog §13.7                   |
| Cloudflare Web Analytics     | RUM CWV with no cookie   | 🔶 owner toggle, no owner-actions row yet — [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §5.1 | a field baseline before Phase 7 |

---

## 7. Explicitly not doing

| Rejected                                         | Why                                                                                    |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| "Enable image optimisation" in `next.config.mjs` | Static export, no server. Cloudflare transforms at the edge; `SiteImage` is the route. |
| A second font family                             | One family is the LCP path already; two doubles the critical bytes.                    |
| An animation library (`framer-motion` included)  | Bypasses the reduced-motion reset, adds hydration to static content. CSS does the job. |

---

## 8. Enforcement map

| Rule                                                                          | Enforced by                                                                                                | Gap → backlog                                                                              |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `out/` ≤ 12,000,000 B; no JS file > 1,000,000 B; total JS ≤ 1,200,000 B       | `perf.mjs` fail / fail / warn (`thresholds.perf`)                                                          | — (§10.4 HOLDS); tighten total → §10.2                                                     |
| Per-route gzip budgets (§0.2 above)                                           | not measured                                                                                               | not yet → new (`perf.mjs` metrics)                                                         |
| Two font preloads, no more                                                    | `perf.mjs` fails on 0; nothing caps the count                                                              | §10.1; cap → new                                                                           |
| RSC `index.txt` payloads                                                      | `perf.mjs` warn                                                                                            | §1.3                                                                                       |
| No unused dependency; no new one without a reason                             | `perf.mjs` warn (unused); CLAUDE.md §12 + `ts-react-reviewer` (new)                                        | §10.3; new-dep check → new                                                                 |
| `"use client"` only from the ledger                                           | `rtl-lint.mjs` warn (`KNOWN_CLIENT`); `perf.mjs` census                                                    | Faq/Header removal → §10.2, N8                                                             |
| `Reveal` never between a list and its items                                   | `a11y.mjs`                                                                                                 | §11.2                                                                                      |
| FAQ answers in the DOM, not `display:none`                                    | `schema.mjs` (FAQPage parity); visibility itself unmeasured                                                | N8                                                                                         |
| Every `<img>` sized, Hebrew alt, one `priority`                               | `perf.mjs` warn (size); `a11y.mjs` fail (alt); `SiteImage` types; priority unmeasured                      | — (0 images); priority → §10.5                                                             |
| No dev chunks or source maps in `out/`; never audit a stale export            | `edge.mjs` (`devBuildFiles`, `sourceMaps`); the `qa-build-gate` clean rebuild; `run-all.mjs` refuses (N12) | `deploy-site.ps1` clears `.next/` only when the kit tarball changed → gap stays procedural |
| Immutable cache on `/_next/static/*`; HTML stays `max-age=0, must-revalidate` | `edge.mjs` → `headersFile`; live `curl` after deploy                                                       | §12.1; live probe in `edge.mjs` → new                                                      |
| Third-party origins limited to §5.3 above                                     | report-only CSP in `templates/_headers` once shipped                                                       | §12.2                                                                                      |
| CWV targets (§1 above)                                                        | nothing — no field data                                                                                    | §13.7; owner-actions §2.3, §2.4                                                            |
| Reduced motion respected                                                      | `app/globals.css` reset; `Reveal` early return; `perf-a11y-auditor`                                        | not mechanical → new                                                                       |

---

## 9. Acceptance checklist

- [ ] Before any deploy (the perf slice of `qa-build-gate`): `npm run build` from a clean `.next/`;
      `node scripts/audit/perf.mjs` run on that build; every number quoted is from it, dated.
- [ ] `perf.mjs`: 0 failures; `jsTotalBytes` not above the previous report; `unusedDeps` empty;
      `fontPreloads` = 2 with each href present in `out/`.
- [ ] `clientComponentFiles` matches the `rtl-lint.mjs` ledger (additions carry a written reason);
      `rscPayloads` decision recorded in §1.3; `edge.mjs` `devBuildFiles 0`, `sourceMaps 0`.
- [ ] If any image ships: `imagesUnsized` 0, one `priority` per page, `a11y.mjs` no-alt 0.
- [ ] After deploy: `curl -sSI https://dangates.co.il/` shows `max-age=0, must-revalidate` and the
      five zone headers of §5.1 above; a `/_next/static/` asset shows `immutable` once §12.1 ships.
- [ ] PageSpeed Insights, mobile, on a live service, location and blog URL: LCP < 2.0 s,
      CLS < 0.05, INP < 150 ms (lab, not field); `perf-a11y-auditor` green on §10 (roster §3).
