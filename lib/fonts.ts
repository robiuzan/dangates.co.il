/**
 * The two `next/font/google` Rubik faces (hebrew + latin) that `<head>` preloads — and
 * only those (backlog §10.1, performance-web-vitals skill §"Fonts").
 *
 * Why hardcoded: on this toolchain (Next 14.2.35, static export, Windows dev host) the
 * build-time `NextFontManifestPlugin` that normally auto-injects these preload links never
 * attributes any font module to any `app/*` chunk group — `.next/server/next-font-manifest.json`
 * stays `{"pages":{},"app":{}}` on every build regardless of `output` mode. Root cause: the
 * plugin's module match (`next-font-manifest-plugin.js`) tests
 * `mod.request.includes("/next-font-loader/index.js?")` — a forward-slash literal — against a
 * webpack module `request` string built from `path.join(...)`, which yields **backslashes** on
 * Windows. The substring never matches on this platform, so `nextFontManifest.app` never gets an
 * entry and no automatic preload link is ever emitted here. This is the sanctioned fallback the
 * skill documents for exactly this case: hand-add the two hrefs, and let `perf.mjs` assert they
 * still resolve to a real file in `out/` so a font-config change can't leave a dangling preload
 * silently — a mismatch fails the audit instead of shipping a 404 preload.
 *
 * The two hashes are content-derived (they change only if the Rubik subset/weight config
 * changes) — after any edit to the `Rubik({...})` call in `app/layout.tsx`:
 *   1. `node -e "require('fs').rmSync('.next',{recursive:true,force:true})"` then `npm run build`
 *   2. `grep -o "@font-face{[^}]*}" out/_next/static/css/*.css | grep '\.p\.woff2'`
 *   3. Match each `.p.woff2` file to its `unicode-range` (Hebrew: `u+0590-05ff` present; Latin:
 *      `u+0131`/`u+00??` present) and update the two `href`s below.
 *   4. `node scripts/audit/perf.mjs` must report `fontPreloads: 2` with no dangling-href failure.
 */
export const FONT_PRELOADS = [
  {
    lang: "hebrew",
    href: "/_next/static/media/99e31c27a1524300-s.p.woff2",
  },
  {
    lang: "latin",
    href: "/_next/static/media/0a86735c6520d94f-s.p.woff2",
  },
] as const;
