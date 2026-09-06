---
name: i18n-locale-architecture
description: Adding a second locale to dangates — why English is not recommended yet (Search Console is unverified, so no demand evidence exists; the old WordPress /en/ was abandoned and is a generated stub redirecting to /), what evidence would change that, and the exact architecture if it ships — two root layouts in route groups for per-locale lang/dir under a static export with no middleware and no Accept-Language negotiation, sub-path /en/ routing, one locale map feeding reciprocal self-referencing hreflang with x-default → Hebrew through metadata alternates and sitemap alternates, one shared #business @id, Latin slugs never transliterated, and the scope rule that translates services, statics, contact and legal but never the 18 location pages, the 11 posts or the guides. Use before building any English page, language switcher or hreflang tag. Triggers: "add English", "English version", "multilingual", "hreflang", "second language", "translate the site", "i18n", "en version", "LTR", "אנגלית", "גרסה באנגלית", "תרגום האתר", "שפה שנייה".
allowed-tools: Read, Grep, Glob, Bash
---

# Locale architecture

The standard is [docs/accessibility-and-i18n.md Part II](../../../docs/accessibility-and-i18n.md).
This skill is the mechanics: the readiness check, the architecture, the gates.

## Read this before writing any code

**The site is single-locale by design, and the recommendation is to keep it that way for now.** If
someone has asked for English pages, the first job is to make sure that is a decision rather than an
assumption.

- The business is an electric-gate repair and installation service for מרכז הארץ. Its customers —
  homeowners, ועדי בתים, property managers, businesses with a vehicle gate — transact in Hebrew, and
  every conversion path ends in a **phone call or WhatsApp to a Hebrew-speaking business** at
  `072-2587772`.
- **Search Console is unverified** — `analytics.googleSiteVerification` is `null` in the manifest
  (owner-actions 2.3, backlog §13.7; `app/layout.tsx` reads nothing yet — the verification meta tag
  is a Sprint 1 task under §13.7 once the owner supplies the token) and `gsc-ingest.mjs` has nothing
  to ingest (§15.3). There is no query, country or language data at all. Building for a segment
  nobody has measured is speculative cost.
- The previous WordPress site **had an English version and abandoned it**. `/en/` is now one of the
  37 generated meta-refresh stubs (the `/en/` row in `REDIRECTS.md`, emitted by
  `scripts/gen-redirects.mjs` into `public/en/index.html`, target `/`). No traffic data survives
  from it, so it is evidence of nothing — neither demand nor its absence.
- An English mirror would take the site from **45 content pages to ~90** — and 41 of the 45 are
  already under their depth floor as of 2026-08-24 (`content-depth.mjs`, content-standards §1).
  Doubling thin pages doubles the doorway risk; it does not add authority.
- The 11 migrated posts are untrusted input still under repair (golden rule 7), and the
  `/מדריכים/` hub (ADR 0002) is planned as a Hebrew-language authority play. Neither transfers.

**What would change the recommendation:** Search Console verified through the roster manifest
(owner-actions 2.3), then two quarters of monthly `gsc-ingest.mjs` snapshots in
`docs/rank-tracking.md` showing sustained English-language queries or non-Hebrew impressions that
convert — or the owner reporting English-speaking callers from actual customer contact. **The
decision is the owner's.** When it is taken, record it as an ADR in `docs/decisions/` before any
code, and build the narrow version below, not a mirror.

## Proof — measure first

```bash
grep -n googleSiteVerification site.config.json   # null → unverified → no demand evidence
ls public/en/                                     # the generated stub that still owns /en/
node scripts/audit/rtl-lint.mjs                   # banned physical utilities = the i18n readiness debt
node scripts/audit/links.mjs                      # sitemap ↔ route-tree parity; both trees must pass
```

## The good news — the codebase is already prepared

Because the RTL rules in CLAUDE.md §6 have been followed, adding an LTR locale is a **layout
non-event**:

- Logical Tailwind utilities throughout (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`) mean
  flipping `dir` flips the layout for free. As of 2026-08-24 the lint reports **3 banned
  utilities**, all `text-right` (§11.5) — a one-word swap each. Re-run `rtl-lint.mjs` before
  quoting the number.
- **Rubik** is loaded once in `app/layout.tsx` via `next/font` with `subsets: ["hebrew", "latin"]`
  — one font for body and headings, and the Latin subset already ships. No font work.
- The `.ltr` helper (`direction: ltr; unicode-bidi: isolate`) in `app/globals.css` is established.
- Copy lives in `lib/content.ts`, not in JSX — the hardest precondition for i18n is already met.
  The exception is N13: user-facing Hebrew and a phone literal typed into route files. That is
  i18n debt; close it before the first English page, not during.
- The manifest already carries the one English identity string: `brandNameEn` → `siteConfig.nameEn`
  (`Dan Electric Gates`). Do not invent another spelling of the brand.

**Protect this.** Every physical utility that sneaks in (`hebrew-rtl` bans it; `rtl-lint.mjs` and
`post-edit-lint.ps1` catch it), and every string typed directly into JSX, is a future i18n cost.
That is the real reason those rules exist.

## If English ships — the architecture

### Routing: sub-path, and two root layouts

`dangates.co.il/en/…` keeps authority on one domain. A subdomain splits it, and this domain has
little to spare. Hebrew stays **unprefixed at the root** — every existing URL is unchanged.

`<html lang="he" dir="rtl">` is set in the single root layout today. A second locale needs a
second `<html>`, which in the App Router means **two root layouts in route groups**: remove the
top-level `app/layout.tsx`, and give each group its own root layout. Group names never appear in
the URL, so the Hebrew tree is byte-identical to what ships now.

```text
app/
  sitemap.ts  robots.ts        stay top-level — metadata routes need no layout
  (he)/
    layout.tsx                 <html lang="he" dir="rtl">, Rubik, GTM, title template with siteConfig.name
    not-found.tsx              handles notFound() inside the Hebrew tree only — see the 404 note below
    page.tsx  services/  locations/  blog/  שירותים/  איזורי-שירות/  מחירון/  אודות/  צור-קשר/ …
  (en)/
    en/
      layout.tsx               <html lang="en" dir="ltr">, same font, same GTM, template with siteConfig.nameEn
      page.tsx  services/[service]/  service-areas/  about/  contact/  privacy/  accessibility/
```

- `output: "export"` and `trailingSlash: true` apply to both trees; `out/en/…/index.html` is
  produced exactly like the Hebrew pages.
- Navigating between the groups is a **full page load**. That is correct — the switcher is a plain
  link, not client routing.
- **`out/404.html` inherits neither root layout.** It is exported from the implicit `/_not-found`
  route at `app/` level; with no top-level `layout.tsx`, Next 14.2 wraps a top-level
  `app/not-found.tsx` (or, if absent, its own English not-found) in a bare `<html><body>` with no
  `lang`, `dir`, CSS or font (`next-app-loader`, `defaultLayoutPath`). Keep `app/not-found.tsx`
  top-level and self-contained with its own `lang="he" dir="rtl"` wrapper, and verify `out/404.html`
  after the build; `/404` must still carry its own canonical (§1.2 fixed it once; do not regress it).
- **Delete the `/en/` stub in the same change** — remove the `"/en/": "/"` pair from the `REDIRECTS`
  map inside `scripts/gen-redirects.mjs` (the generator does not read `REDIRECTS.md`) and the row
  from `REDIRECTS.md`, delete the orphaned `public/en/` directory by hand (the generator writes, it
  never prunes), then re-run `node scripts/gen-redirects.mjs`. `public/` is copied verbatim into
  `out/`, so a leftover stub collides with the exported `/en/` route. Once ADR 0004's
  `public/_redirects` exists, it must not carry `/en/ → /` either.

### Scope: a narrow set, not a mirror

| Translate                                                                                     | Never translate                                                      |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Home                                                                                          | The 18 `/locations/[city]/` pages — doorway pages already (§3.1)     |
| The 7 `/services/[service]/` pages, starting with 3–4 flagship ones                           | The 11 `/blog/[slug]/` posts — untrusted, mid-repair (golden rule 7) |
| `/שירותים/` → `/en/services/`, `/איזורי-שירות/` → `/en/service-areas/`                        | `/מדריכים/` and every guide (ADR 0002) — Hebrew authority, no export |
| `/אודות/` → `/en/about/`, `/צור-קשר/` → `/en/contact/`                                        | `/מחירון/` until the N14 pivot lands — 8 of 9 prices are unsourced   |
| `/מדיניות-פרטיות/` → `/en/privacy/`, `/הצהרת-נגישות/` → `/en/accessibility/` (must stay true) |                                                                      |

First cut: home, 3–4 services, contact — about 6 pages. Ceiling: the left column, ~13 pages. The
right column is not a phase 2; it is the boundary.

### One locale map, three consumers

Reciprocity must be structural, not remembered. One registry — `lib/locales.ts`, planned with the
English build — holds the Hebrew ↔ English pairs:

```ts
// lib/locales.ts (planned) — decoded paths; encodeURI happens at the edges, as in app/sitemap.ts
export const localePairs = [
  { he: "/", en: "/en/" },
  { he: "/services/שערים-נגררים/", en: "/en/services/sliding-gates/" },
  { he: "/איזורי-שירות/", en: "/en/service-areas/" },
  { he: "/צור-קשר/", en: "/en/contact/" },
] as const;
```

Three things read it and nothing else may hard-code a cross-locale URL:

1. `generateMetadata` on every page in both trees → `alternates.languages`.
2. `app/sitemap.ts` → `alternates.languages` on each entry (supported by `MetadataRoute.Sitemap`
   in Next 14.2), through the same `url()` helper that `encodeURI`s the Hebrew.
3. The header language switcher → the equivalent page, falling back to that locale's home when the
   pair does not exist. Never a dead link.

Note the `/איזורי-שירות/` pair: the Hebrew side keeps its **live, intentionally misspelled** slug
(golden rule 3). The English slug is a translation, not a transliteration, so the misspelling never
crosses over — and nobody "corrects" the Hebrew side while adding the English one.

### The static-export constraints that shape everything

`output: "export"` means **no middleware, no `redirects()`, no `Accept-Language` negotiation.**

- **No automatic locale detection.** Not a client-side redirect (delays LCP, breaks Back, and
  search engines index the redirect), and not a Cloudflare edge rule either — zone rules are the
  owner's (§12 scope guardrails), and Googlebot crawls with English `Accept-Language` from non-IL
  addresses, so an edge redirect would hide the Hebrew site from the crawler that matters.
- Locale is chosen by a **visible language switcher** in `Header` on every page of both trees — a
  link rendered server-side from the locale map. Link text is the target language in its own
  script (`English` with `lang="en"`, `עברית` with `lang="he"`), `hrefLang` on the anchor, no flag
  icons, no cookie or `localStorage` auto-redirect. English nav labels are a `navItemsEn` array in
  `lib/content.ts`, same pattern as `navItems`; no label is typed into JSX.

### hreflang — required, and easy to get wrong

In Next metadata terms, on `/services/שערים-נגררים/` and on its English pair alike:

```ts
alternates: {
  canonical: "/services/שערים-נגררים/",          // self-referencing, per locale
  languages: {
    "he-IL": "/services/שערים-נגררים/",
    en: "/en/services/sliding-gates/",
    "x-default": "/",                               // the Hebrew home — one constant in both trees
  },
},
```

Next resolves each against `metadataBase` and percent-escapes the Hebrew, so the rendered
`<link rel="alternate" hreflang>` hrefs are byte-identical to the sitemap `<loc>` and the canonical
(`seo-metadata` explains why that identity matters).

- **Reciprocal** — Hebrew points to English, English points back, or Google ignores both.
- **Self-referencing** — every page lists its own locale, alongside its own canonical.
- **Absolute, percent-escaped** URLs, never raw Hebrew (the schema `url` defect, §4.7, is the same
  mistake in another place).
- `x-default` → the Hebrew home page — the fleet convention in Part II; do not mix it with the
  per-page alternative.

### What forks per locale, and what must not

| Concern           | Rule                                                                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lang` + `dir`    | Per-locale root layout, **server-side**. Never a client-side `document.dir` flip — visible reflow.                                                                                                                                                    |
| Title template    | Hebrew: `%s \| ${siteConfig.name}`. English: `%s \| ${siteConfig.nameEn}`. Brand exactly once, either way.                                                                                                                                            |
| Canonical         | Self-referencing per locale. Never cross-locale.                                                                                                                                                                                                      |
| `openGraph`       | Per-locale `ogBase` (`seo-metadata`): `locale: "he_IL"` vs `en_US`; same `images` from `ogImageMeta(manifest.images)` — the manifest already carries an English `alt` and a Hebrew `altHe`.                                                           |
| `sitemap.ts`      | One sitemap, both trees, each entry with its `alternates.languages`.                                                                                                                                                                                  |
| JSON-LD           | `inLanguage` per page (`he-IL` today on `BlogPosting`; `en` on English pages). **One business node, one `@id`** — `${manifest.url}/#business` — referenced from both trees. `WebSite` (§4.9): `["he", "en"]`.                                         |
| Business `name`   | Hebrew, unchanged. `siteConfig.nameEn` goes in `alternateName` — the business is one entity in two languages, not two businesses.                                                                                                                     |
| NAP               | Byte-identical: `072-2587772`, `info@dangates.co.il`, the manifest `openingHours`. **No street address in either language** — none exists, and English does not license inventing one.                                                                |
| Hours copy        | `siteConfig.hours` is hand-typed Hebrew; the English rendering says the same times. The 24/7 emergency string is 🔶 (owner-actions 3.5) — it does not enter English before it is confirmed.                                                           |
| Dates / currency  | `dd/mm/yyyy` and `₪` after the number in both — Israeli conventions, not the locale's.                                                                                                                                                                |
| Slugs             | English slugs in Latin, translated. Hebrew slugs unchanged. **Never transliterate a Hebrew slug.**                                                                                                                                                    |
| `llms.txt` (§6.5) | Stays Hebrew-primary; add an English section, not a second file.                                                                                                                                                                                      |
| `robots.ts`       | Unchanged. Whatever the Cloudflare edge does to AI crawlers applies to `/en/` too — 200 to every probed bot as of 2026-09-06 (§6.1 ✅), after a 2026-08 block that can return without a repo change; re-probe per `aeo-answer-content`, never assume. |

### The audit gate is single-locale today

`npm run gate` would go blind on `/en/` unless the scripts learn the second tree **in the same
change**:

- `titles.mjs` asserts one `brandToken` (Hebrew) per title — English titles would fail it.
- `claims.json` is a Hebrew lexicon. English copy would carry "full warranty", "licensed",
  "insured", "years of experience", "nationwide", "since <year>" straight past `claims-grep.mjs`
  and `post-edit-lint.ps1`. Add the English patterns to the same rows first — the facts behind them
  are ❌ or 🔶 in every language.
- The nine static routes live in the `staticPages` registry in `lib/site-config.ts`, which the sitemap and `links.mjs` both read (backlog §1.4, done 2026-09-06). The English statics register there too, never as a second hand-maintained list.
- `content-depth.mjs` floors and `schema.mjs` dangling-`@id` checks apply per page, in both trees.

### Translation quality gate

Every English page is written or reviewed by a fluent human. A machine-translated page is a thin
page, and thin pages are the failure mode `docs/content-standards.md` exists to prevent. The depth
bar does not drop because the language changed. `hebrew-editor` cannot review English; the review
chain for an English page is a fluent human reviewer → `claims-verifier` (the claim rules are
language-independent) → `ts-react-reviewer` for the markup.

## Checklist

- [ ] The decision to build English is the owner's, backed by Search Console evidence — recorded
      as an ADR, not assumed
- [ ] Two root layouts in route groups; Hebrew unprefixed and byte-identical at the root
- [ ] Per-locale `lang` + `dir` set server-side; `out/404.html` verified Hebrew after the build
      (it inherits neither root layout)
- [ ] The `/en/` pair removed from `scripts/gen-redirects.mjs` and `REDIRECTS.md`, `public/en/`
      deleted, generator re-run
- [ ] One locale map read by metadata, sitemap and switcher — no hard-coded cross-locale URL
- [ ] Reciprocal, self-referencing `hreflang` on every page in both trees; `x-default` → `/`
- [ ] Self-referencing canonical per locale; brand once per title in each locale's template
- [ ] Visible switcher linking to the equivalent page, with a home fallback
- [ ] One `#business` `@id` across locales; `alternateName` from `siteConfig.nameEn`
- [ ] NAP byte-identical; no address in either language; no 🔶 claim enters English
- [ ] `/איזורי-שירות/` untouched; no Hebrew slug transliterated
- [ ] Locations, posts, guides and (until N14) `/מחירון/` not translated
- [ ] `claims.json` extended with English patterns; `titles.mjs` and `links.mjs` cover both trees
- [ ] Every English page human-written or human-reviewed; no client-side or edge locale redirect
- [ ] `npm run gate` passes with no failure absent from the latest `docs/audits/` report

## Gotchas

- Route groups share nothing by default: GTM, the font variable, `MobileCtaBar`, the footer spacer
  and `metadataBase` live in the root layout today and must be present in **both** root layouts,
  or the English tree ships without analytics. Golden rule 8 still applies — a snippet in the HTML
  proves nothing.
- The `/en/` stub is `noindex` with a canonical to `/` and a `location.replace("/")`. Until it is
  deleted, an exported `/en/` page and the stub fight over the same `out/en/index.html`.
- An English service page that lists Hebrew city names, or a Hebrew page that links to English
  ones outside the switcher, is cross-locale leakage — the mesh (`internal-linking`) stays within
  its tree except through the locale map.
- Do not "fix" `/איזורי-שירות/` while pairing it. The English slug is where the correct spelling
  lives (golden rule 3).
