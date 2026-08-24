# ADR 0004 — Real 301s via `public/_redirects`; retire the meta-refresh stubs and the dead origins

**Date:** 2026-08-23 · **Status:** accepted (implemented in Phase 1)

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
