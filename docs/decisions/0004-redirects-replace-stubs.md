# ADR 0004 — Real 301s via `public/_redirects`; retire the meta-refresh stubs and the dead origins

**Date:** 2026-08-23 · **Status:** **accepted; implemented in the repo 2026-09-06** (commit
`a0e0fe2`, Sprint 1 rows 1.1–1.3) · **live after the next deploy**

## Context

37 legacy URLs from the WordPress site are served by generated HTML stubs under `public/` — each a
200 response carrying `<meta name="robots" content="noindex">`, a canonical to the destination and
`location.replace()`. The generator's own comment explains the premise: "on static GitHub Pages
there is no server to issue 301s". Production has been Cloudflare Pages since the domain moved; the
premise is obsolete. The stubs combine `noindex` with a canonical (Google's guidance is not to), add
45 % to the crawlable URL count, strip `gclid`/`utm` on every legacy entry, and one of them is a
Houston, Texas promo URL inherited from the cloned source. Meanwhile `.github/workflows/deploy.yml`
still publishes to GitHub Pages on every push, with `public/CNAME` and `public/.htaccess` as dead
companions — a live second origin serving a redirect-less copy of the site.

## Decision

- Emit `public/_redirects` (`<from> <to> 301`, one line per pair, both columns percent-encoded)
  from the map in `REDIRECTS.md`, and **delete the 37 stub directories in the same change** — a
  static asset at a path shadows the redirect rule, so deletion is mandatory.
- Drop the Houston promo mapping rather than redirecting it; sweep `REDIRECTS.md` for other
  foreign-market URLs.
- Retire `.github/workflows/deploy.yml`, `public/CNAME` and `public/.htaccess`. Retire
  `scripts/gen-redirects.mjs` once `_redirects` is verified live; keep `REDIRECTS.md` as the map.
- Adopt the zone-supplied security headers into `public/_headers` in the same release so the posture
  is version-controlled (backlog §12.1).

## Consequences

- Ranking signal from the 17 old city URLs and 11 old post URLs consolidates through true 301s; query
  strings survive, so paid/campaign attribution on legacy links is fixed for free (backlog §13.3).
- `scripts/audit/edge.mjs` fails while stubs remain or `_redirects` is absent; after the change it
  verifies every destination resolves and no stub shadows a rule.
- The deploy skill's post-deploy checks add `curl -sSI` on three legacy URLs expecting `301` with
  `Location` set.
- The protected-path guard's `public/**/index.html` rule becomes moot once the stubs are gone; keep
  it — it costs nothing and prevents the pattern returning.

## Implementation — 2026-09-06, commit `a0e0fe2`

Everything above landed in one change. `scripts/gen-redirects.mjs` was **not** retired: it now emits
`public/_redirects` from the same `REDIRECTS.md` map and is wired as both `npm run redirects` and
`prebuild`, so the map and the emitted file cannot drift (backlog §1.6). It writes only when the
content actually changes, so a rebuild cannot bump the file's mtime and trip the audit's staleness
guard (N12). One delta from the decision as written: each mapped path is emitted in **both** its
slashed and bare form — Cloudflare Pages matches a source path literally and this export ships
nothing at the bare path, so a bare-form inbound link would otherwise reach `/404`. That is why
`_redirects` carries **72 rules** for the 36 mapped paths.

The 37 stub directories, the Houston stub, `.github/workflows/deploy.yml`, `public/CNAME` and
`public/.htaccess` are deleted; `public/_headers` adopts the five zone headers plus a report-only
CSP. Pushing to `main` now publishes nothing anywhere.

**Verified in the repo** after a clean rebuild (2026-09-06):

```bash
node scripts/audit/edge.mjs
# ✅ redirectRules 72 · stubs 0 · redirectsFile true · headersFile true
#    deadHostArtifacts 0 · foreignStubs 0 · envDocumented 1 · envUsed 1
node scripts/audit/links.mjs
# ✅ contentPages 45 · sitemapUrls 45 · brokenLinks 0 · linksToStubs 0 · orphans 0
find public -name index.html | wc -l   # 0
```

**Not yet verified live.** The repo change is inert until the next deploy; the three-URL `301` probe
in `deploy-dangates` is the acceptance test, and the owner deletes the zone header rule (B7) only
after `_headers` is confirmed on `dangates.pages.dev`.
