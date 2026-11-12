# CLAUDE.md — דן שערים חשמליים (dangates.co.il) project rulebook

> The operating manual for any AI agent (and human) working in this repo. Project rules here
> **override** global defaults. When this file and the code disagree, fix the code. When this file and
> `Israeli services sites/roster/sites/dangates.json` disagree about a business fact, **the roster wins**.

---

## 1. Business context

- **Business:** דן שערים חשמליים (Dan Electric Gates) — repair, service and installation of electric
  gates, plus electric rolling shutters. **No street address** — the manifest carries none, and
  manifest `schema.areaServed` reads `מרכז הארץ והאזורים שמופיעים באתר` since the roster sync
  `8e8843d` (2026-11-09, Track B B5); it said "ופריסה ארצית" until then, which shipped in the client
  JS because `site.config.json` is bundled whole — `out/_next/static/` now carries 0 occurrences.
  The roster `shortPitch` stopped carrying speed, "אחריות מלאה", 24/7 and "פריסה ארצית" in
  `ad2f1ab` (2026-11-09). Do not invent an address.
- **Phone (click-to-call):** `072-2587772` · WhatsApp `+972556601006` (the owner's own — 072-2587772
  is not on WhatsApp, §14) · `info@dangates.co.il`.
  This site sets `contact.phoneOverride: true` — it is the **one** fleet site that does not use the
  shared `055-6601006` lead number. Never "correct" it to the shared one.
- **Hours:** ראשון–חמישי 08:00–18:00, שישי 08:00–15:00 — the manifest `schema.openingHours`, which
  `siteConfig.hours` is built from (`hoursLine()`). Whether a 24/7 emergency line exists is 🔶
  (owner-actions 3.5); since Sprint 4 (`1796ee7`) the site promises urgent-fault handling only
  within these hours.
- **Service area:** the copy says `serviceAreaLine` ("מרכז הארץ והאזורים שמופיעים באתר") and names
  the published areas — 14 location pages (13 cities and אזור השרון), 7 service pages, 5 guides
  (4 since Sprint 7, the fifth in `c457c31`; as of 2026-11-10), 11 blog posts. **National coverage is ❌:** the owner answered owner-actions 3.6
  on 2026-11-09 — קריות, צפון, דרום and באר שבע are not served (their four pages were retired in
  `7ed1acd` with 301s to `/איזורי-שירות/`); חיפה, אשקלון and שרון are, and ירושלים too (owner-actions 3.11,
  answered in chat 2026-11-11). Never write "פריסה ארצית".
- **Audience:** private homeowners, ועדי בתים (building committees), property managers, businesses
  with vehicle gates.
- **Core promise:** reliable diagnosis before repair, and a warranty on the work — write **אחריות על העבודה**, never "אחריות מלאה": the term, scope and
  exclusions are unconfirmed and not coming. Same-day and emergency availability are 🔶 and the copy
  promises neither. The 13 "אחריות מלאה" source hits were softened in `1796ee7` (backlog §7.2 ✅):
  `claims-grep.mjs` → `warranty-full` 0, every claim 0 live, as of 2026-11-09.
- **Conversion goals, in order:** (1) phone call, (2) WhatsApp, (3) lead form. Every page keeps a
  call/WhatsApp action within reach; the mobile CTA bar is sticky.

> ⚠️ **Not substantiated:** years in business (`foundedYear: null`), the warranty term, licences,
> insurance, 24/7 availability, response times, and every price (national coverage is not merely
> unsubstantiated but refuted — owner-actions 3.6, 2026-11-09) — the one number
> the site shows is the 150–350 ₪ technician-visit band (`priceRows` → `visitFeeRange`), itself 🔶
> as to whether it is current. `/מחירון/` explains what determines the price instead of listing
> authored ranges since `af8ba4c` (N14 — until then 8 of its 9 prices were authored estimates).
> See [docs/business-facts.md](docs/business-facts.md); **never present an unconfirmed value as
> fact.** The phrases those claims hide behind are the **claim lexicon**
> (`scripts/audit/claims.json`) — `node scripts/audit/claims-grep.mjs` and the PostToolUse hook fail
> on any of them. Ten fabricated review texts under ten real names shipped as `Review` +
> `AggregateRating` — removed from the repo and gated on 2026-08-17, off the live domain only with
> the 2026-09-06 deploy — golden rule 1.

---

## 2. Golden rules

1. **Never fabricate a business fact.** Years in business, prices, warranty terms, licences,
   insurance, ratings, reviews, certifications, customer names. If it is not in the roster manifest,
   `lib/site-config.ts`, or `lib/content.ts`, mark it `// 🔶 confirm` and add a row to
   [docs/business-facts.md](docs/business-facts.md). Fabricated reviews or ratings are a Google policy
   violation, not merely a style problem. **This site shipped exactly that until 2026-08-17 in the
   repo, and until the 2026-09-06 deploy on the live domain** — ten invented review texts under ten
   real reviewer names, wired into structured data. It is fixed in the code and live since 2026-09-06:
   `lib/content.ts` exports `reviews = []` plus `REVIEW_SOURCE_URL = null`, and
   `components/marketing/Reviews.tsx` returns `null` unless both are populated; `schema.mjs` fails if
   either type reappears. **That guard is the rule made mechanical — do not remove or work around it.**
2. **Never edit `site.config.json` directly.** It is synced downstream from
   `Israeli services sites/roster/sites/dangates.json`. Edit the roster, then sync. The file says so in
   its own `_comment`. _Hook-enforced:_ `guard-protected-paths.ps1` and the `permissions.deny` list
   refuse the write.
3. **Never "fix" `/איזורי-שירות/`.** It would spell correctly as `אזורי`; the nav label already reads
   correctly and the URL does not. It is the live URL. Renaming it without a 301 discards every ranking
   signal it holds.
4. **Pushing to `main` does not deploy production.** It now publishes nothing at all: the GitHub
   Pages workflow that used to run on every push was retired 2026-09-06 (ADR 0004). Production is
   `wrangler` direct-upload to Cloudflare Pages — see §10.
5. **No page ships under the content bar in [docs/content-standards.md](docs/content-standards.md).**
   A location or service page a find-and-replace could regenerate is a doorway page.
6. **Business facts come from `lib/site-config.ts`, never hardcoded in components.** Import
   `siteConfig`, `services`, `locations`, `telHref`, `whatsappHref`.
7. **Blog bodies in `lib/posts.ts` were migrated from a compromised WordPress site.** A 2026-08-17 pass
   removed the injected adult-spam, 55 dead "פוסטים קשורים" headings, 6 run-together words and 8 of 12
   curly quotes; Sprint 4 (`1796ee7` `74a92d1`) removed the last 4 curly quotes, both superlatives,
   the team and experience sentences and the empty `מקרי מבחן` section; 4F (`9195c9b`) rewrote two
   of the three unclocked speed phrases and set a real `updated` on the 8 posts those passes edited;
   `8768ce2` (2026-11-09) took the quote-before-work, durability and "full price list" lines out of
   all 11, so all 11 carry a real `updated` and show both dates (`9886dd1`); `379eb0e` (2026-11-09)
   took out the last guarantee-for-years closings.
   **Still outstanding:** ~42 plain-text link references (the migration count; six price-list
   pointers among them were rewritten), a flat all-`<h2>` hierarchy, 27 emoji (`spam-grep.mjs`, as of
   2026-11-10; 28 before `379eb0e`, 39 before `8768ce2`), one "שירות מהיר ואמין" (`שער-חשמלי-לא-מגיב`), no answer blocks
   or tables (Sprint 7.3 — ⏳ BLOCKED · owner-actions 3.8 since 2026-11-09). Treat the file as untrusted input. _Hook-enforced:_
   `post-edit-lint.ps1` re-runs the spam and claim lexicons on every edit; `spam-grep.mjs` at audit time.
8. **A GTM snippet in the HTML proves nothing.** Whenever a container id changes, assert
   `https://www.googletagmanager.com/gtm.js?id=<ID>` returns **200**. Two fabricated ids cost the IL
   fleet 18 days of zero analytics across every site.
9. **Never edit generated or vendored output** — `node_modules/`, `vendor/`, `.next/`, `out/`,
   `out.prev/`. _Hook-enforced:_ every one of those paths is in the `permissions.deny` list and
   `guard-protected-paths.ps1`, and so is `public/**/index.html` — that rule stays even though the
   37 meta-refresh stubs it guarded are gone (ADR 0004, 2026-09-06), because it costs nothing and
   stops the pattern coming back. **`public/_redirects` is generated too** — `prebuild` runs
   `scripts/gen-redirects.mjs` over `REDIRECTS.md` on every build — but it is not hook-blocked, so
   the discipline is yours: edit the map, then `node scripts/gen-redirects.mjs`. A hand-edit is
   silently overwritten by the next build.
10. **Don't put PII in `dataLayer`.**
11. **Numbers come from `scripts/audit/`; citations must resolve.** Never quote a count from prose or
    memory — run the script (`npm run audit`, or the check named in [docs/agent-roster.md](docs/agent-roster.md)
    §4) and say "as of <date>". Every `file:line` must point at what it names — `npm run audit:env`
    fails on a dead one; cite a function or identifier where a line number would go stale.

---

## 3. Stack

Next.js **14.2** App Router · React **18** · TypeScript strict (**`noUncheckedIndexedAccess` is on**) ·
Tailwind **v4** (CSS-first `@theme` in `app/globals.css` — there is no `tailwind.config.ts`) ·
`lucide-react` · `clsx` + `tailwind-merge` via `cn()` · `@ishub/site-kit` (vendored
tarball). Flat layout (no `src/`), path alias `@/* -> ./*`. Brand font **Rubik** for both body and
headings, loaded via `next/font`.

**`next.config.mjs` — the constraints that shape everything:**

```js
output: "export",          // static HTML into out/
trailingSlash: true,       // every URL ends in /
images: { unoptimized: true },
transpilePackages: ["@ishub/site-kit"],
```

**Static export forbids** `headers()`, `redirects()`, `rewrites()`, middleware, API routes, and ISR.

> `next.config.mjs` names the real deploy target since 2026-09-06 (N7): Cloudflare Pages via a
> `wrangler` upload of `out/`. It claimed a cPanel/Apache docroot until then — see §10.

---

## 4. Layout

```
app/
  layout.tsx              # metadata, Rubik, GTM, <html lang="he" dir="rtl">
  page.tsx                # homepage — LocalBusiness + FAQPage JSON-LD
  sitemap.ts robots.ts    # /sitemap.xml (47 URLs as of 2026-11-10; 46 from 7ed1acd, 50 after Sprint 7), /robots.txt —
                          #   per-bot Allow + RSC_PAYLOAD_DISALLOW (the index.txt payloads, §1.3, 2b0d802)
  llms.txt/route.ts       # /llms.txt — generated from lib/llms.ts, never hand-written (Sprint 7)
  not-found.tsx           # 404
  services/[service]/     # 7 pages — Service + FAQPage JSON-LD, rendered from serviceDepth
  locations/[city]/       # 14 pages (18 until 7ed1acd retired four, owner-actions 3.6)
  blog/ blog/[slug]/      # index + 11 posts
  מדריכים/ מדריכים/[slug]/  # the guides hub (ADR 0002) — index + 5 guides, rendered from lib/guides.ts
  שירותים/ איזורי-שירות/ מחירון/ אודות/ צור-קשר/
  מדיניות-פרטיות/ הצהרת-נגישות/
  תודה/                   # thank-you page after a confirmed lead — noindex, outside the sitemap
  גלריה/                  # the renderings gallery (§15, N37 — kit commit ff065e4, 14 tiles since the
                          #   install, 2026-11-12): in the header before «מחירון»; 48 sitemap URLs
                          #   and 50 built pages with it
components/
  ui/          Button Container Section SectionHeading Reveal Toc (build-time TOC, server, Sprint 8)
  layout/      Header (server shell) DesktopNav + MobileMenu (the two client nav leaves — every
               service and location in one hop, Sprint 6.5; nav-context.ts hands them the menus
               once, 9886dd1) Footer PageHeader MobileCtaBar
  marketing/   Hero TrustBar ServicesGrid WhyUs Process PricingTeaser
               ServiceAreas Reviews Faq FinalCta
               ContentSections (AnswerBlock · BulletedBlock — the depth-module renderers, Sprint 6)
  article/     ArticleBody GuideView blocks chrome — the guide block renderer, TOC and CTAs (Sprint 7)
  forms/       LeadForm
  engagement/  EngagementEvents — the one client leaf behind the six engagement events (Sprint 8.1)
  live/        Live.tsx — the fleet live-kit surfaces, server components only (§14)
  images/      Figure (the one way a content image renders) + the strip and team-teaser leaves — server
               only, rendered by the toolkit's port (§15, N37 kit commit ff065e4)
lib/
  site-config.ts   # ⭐ NAP, services[7], locations[14] (kind · prefixed · updated), telHref, whatsappHref
  content.ts       # ⭐ all Hebrew marketing copy; reviews = [] (gated)
  posts.ts         # ⭐ 11 migrated blog posts (untrusted — see golden rule 7)
  service-depth.ts # ServiceDepth type + serviceDepth record + module-load checks (Sprint 5)
  city-content.ts  # CityContent type + cityContent record + module-load checks (Sprint 6)
  nearby.ts        # nearbyPairs — one list of unordered location pairs, read both ways (Sprint 6);
                   #   a far pair gets a nearbyHeading on both sides (9886dd1)
  related-posts.ts # relatedPosts(): a post's related list by shared rare stems, every post reached (9886dd1)
  page-content.ts  # the copy model for /שירותים/, /איזורי-שירות/, /אודות/ (Sprint 6), /blog/, /צור-קשר/, /מדריכים/ (Sprint 7)
  guide-types.ts   # the typed block model (ADR 0003): Guide, Block, Family, Pillar, the per-family consts
  guides.ts        # ⭐ the guides registry, relatedGuides, the reverse index + module-load throws (Sprint 7)
  llms.ts          # buildLlmsTxt() — /llms.txt from siteConfig, staticPages, services, locations, guides
  nav.ts           # the header nav: headerMenus (every service / location, from the data) + headerLinks
  toc.ts           # buildToc(): a page's own H2s → TOC items, only past 900 words and 4+ headings
  engagement.ts    # relatedAttr() — the data-related contract the engagement leaf reads
  hooks/           # useEngagementEvents.ts — the six events of docs/event-taxonomy.md, no PII
  jsonld.ts        # site-local JSON-LD builders — one @graph per page (§8)
  manifest.ts      # parseManifest(): narrows site.config.json at the boundary, throws on a bad key
  authors.ts       # empty Author registry — no person is coming; a Person author is forbidden while empty
  phone.ts         # the Israeli phone pattern the lead form validates with (mobiles, 07X, landlines)
  seo.ts           # routeUrl() + ogBase — canonical and og:url from one place
  utils.ts         # cn()
  images.ts        # the images manifest read at module load — placements, slots, the one priority image per
                   #   page — throws on an entry that breaks manifest-rules (§15, N37 kit commit ff065e4)
  live/            # fleet live-kit copies — byte-locked, never edit (§14)
scripts/gen-redirects.mjs   # emits public/_redirects (80 real 301 rules) from REDIRECTS.md; runs on prebuild
scripts/audit/     # ⭐ the measurements (12 checks + thresholds.json + claims.json) — roster §4
scripts/live/      # fleet live-kit gates (prebuild / postbuild) and the weekly reminder — locked (§14)
scripts/images/    # the page-images kit: check-images-out.mjs (the postbuild gate, last) + its lib/ — rendered
                   #   by the Media Studio toolkit's port, re-rendered never hand-edited (§15, N37 kit commit ff065e4)
content/images/    # ⭐ plan.json (the slot plan) · manifest.json (toolkit-written) · notice.json (the site note) (§15)
public/images/     # the approved renderings (full, -thumb, -w720) — only the toolkit's install writes here (§15);
                   #   78 approved, 78 phone copies and 8 derived thumbnails since the install, 2026-11-12
content/services/  # ⭐ one depth module per service (<slug>.ts → ServiceDepth): answer, sections, FAQs, links
content/locations/ # ⭐ one module per location (<slug>.ts → CityContent): answer, local notes, FAQs, services
content/pages/     # ⭐ services-index · areas-index · about · blog-index · contact · guides-index — each page's own copy
content/guides/    # ⭐ one module per guide (<slug>.ts → Guide, as const satisfies) — 5 as of 2026-11-10 (4 since Sprint 7)
content/live/      # ⭐ _campaigns.mjs + _updates.mjs (the live registers) + the synced calendar (§14)
live.config.mjs    # ⭐ calm / no-card pages, this site's ⛔ claim stems, pageOfSource (§14)
live-kit.lock.json # the kit commit and the sha256 of every locked copy (§14)
site.config.json   # SiteManifest — SYNCED FROM THE ROSTER, do not edit here
public/_redirects  # GENERATED — 80 Cloudflare Pages 301 rules; edit REDIRECTS.md, not this
public/_headers    # the repo's own security headers + the report-only CSP (ADR 0004)
public/assets/live.js  # fleet live-kit browser behaviour (the switch, the card, the strip) — locked (§14)
.github/workflows/remind.yml  # the live-kit's weekly reminder — the repo's only workflow (§14)
REDIRECTS.md       # the old→new URL map the redirect generator implements
docs/              # README (the layer map — start there) · implementation-sprints (the sequenced plan)
                   # backlog · content-standards · schema-graph · keyword-map · business-facts
                   # agent-roster (routing) · owner-actions · audits/ · decisions/ (ADRs 0001–0006)
                   # event-taxonomy · rank-tracking · content-calendar · competitors
                   # cloudflare-runbook · gbp-runbook · growth-roadmap
                   # standards: seo-geo-aeo-strategy · eeat-and-trust · ux-cro-security
                   #   performance-guidelines · accessibility-and-i18n
                   #   mobile-ux-and-personalization · data-tracking-infrastructure
.claude/           # agents/ skills/ hooks/ rules/ workflows/ — see §13
```

**Built in Sprint 7** (commit `89439b7`, 2026-11-09; not live until the next deploy): the guides hub —
`lib/guide-types.ts`, `lib/guides.ts`, `content/guides/*.ts`, `app/מדריכים/`
([ADR 0002](docs/decisions/0002-guides-hub-route.md), [ADR 0003](docs/decisions/0003-block-content-model.md))
— and `/llms.txt` (§6.5), which is the generated route `app/llms.txt/route.ts`, not a `public/` file.
**Built in Sprint 10** (backlog N37, [ADR 0006](docs/decisions/0006-ai-renderings-under-one-note.md),
§15; live since the 2026-11-12 deploy): the images layer — `app/גלריה/`, `components/images/`,
`lib/images.ts`, `scripts/images/` and `content/images/` in the kit commit `ff065e4` (2026-11-11,
empty manifest), the slot plan in `08e4820`, and the 78 approved renderings under `public/images/`
in the install commit (2026-11-12). Everything else on this layout is built; `env-doctor.mjs`
still tracks a few old planned names for the docs that mention them. (`lib/jsonld.ts` and
`lib/authors.ts` were built in Sprint 2, 2026-11-08.)

Place by responsibility: reusable presentation primitive → `ui/`; page section → `marketing/`;
structural chrome → `layout/`.

---

## 5. Data flow & source of truth

```
Israeli services sites/roster/sites/dangates.json   ← EDIT HERE for NAP/brand/schema/analytics
        │  (ops sync)
        ▼
site.config.json  (SiteManifest)                    ← never edit directly
        │
        ▼
lib/site-config.ts   manifest · siteConfig · services · locations · telHref · whatsappHref
        │
        ├── lib/content.ts   serviceCards · serviceMeta · differentiators · processSteps
        │                    trustStats · priceRows · faqs · reviews · aboutValues · navItems
        ├── lib/posts.ts     posts[11]
        ├── lib/service-depth.ts  serviceDepth  ← content/services/<slug>.ts (one per service)
        ├── lib/city-content.ts   cityContent   ← content/locations/<slug>.ts (one per location)
        ├── lib/nearby.ts         nearbyPairs · nearby()
        ├── lib/page-content.ts   ← content/pages/*.ts (the indexes, /אודות/, /blog/, /צור-קשר/, the hub)
        ├── lib/guides.ts         guides · relatedGuides · guidesForService/Location  ← content/guides/<slug>.ts
        ├── lib/llms.ts           buildLlmsTxt()  → app/llms.txt/route.ts
        ├── lib/images.ts         placements · slots · the note  ← content/images/{plan,manifest,notice}.json (§15, N37)
        ▼
app/**/page.tsx  →  components/**
```

Rule of thumb: **identity and NAP go up the chain to the roster; wording goes in `lib/content.ts`;
article bodies go in `lib/posts.ts`; each service page's depth prose goes in its own
`content/services/<slug>.ts`, each location page's in `content/locations/<slug>.ts`, each guide's in
`content/guides/<slug>.ts`, and the indexes', `/אודות/`'s, `/blog/`'s, `/צור-קשר/`'s and the hub's in
`content/pages/` (UI labels around them stay in `lib/content.ts`); layout goes in
components.** Copy never gets typed directly
into JSX. The one exception beside the live registers (§14): a figure's alt and caption live in
`content/images/manifest.json`, written by the Media Studio toolkit's `alt` step and never typed by
hand except the two text fields of a `candidate` entry, and the site-wide images note lives in
`content/images/notice.json`, mirrored in `Media Studio/sites/dangates/site.json`
`disclosure.texts` (§15).

---

## 6. RTL & localization — NON-NEGOTIABLE

- `<html lang="he" dir="rtl">` is set in `app/layout.tsx`. Do not remove it.
- Israeli formats: phone `0XX-XXX-XXXX`, currency `₪`, dates `dd/mm/yyyy`.
- **Logical Tailwind utilities ONLY** for horizontal spacing/positioning: `ps-*`/`pe-*`, `ms-*`/`me-*`,
  `start-*`/`end-*`, `text-start`/`text-end`, `space-x-reverse`.
  **BANNED:** `pl-* pr-* ml-* mr-* left-* right-* text-left text-right`. The only exception is a
  genuinely direction-agnostic case, which must carry an explanatory comment.
- Let `dir="rtl"` mirror flex/grid — don't force `flex-row-reverse` except to wrap an LTR island.
- Latin/LTR snippets inside Hebrew (phone, email, URL, price) get `dir="ltr"` and the `.ltr` helper
  from `app/globals.css` (`direction: ltr; unicode-bidi: isolate`).
- Hebrew punctuation: use גרש `׳` and גרשיים `״`, not straight quotes, in Hebrew abbreviations.
- Keep user-facing strings Hebrew. Don't mix languages mid-sentence — and note that the migrated blog
  currently breaks this rule (golden rule 7).

See the `hebrew-rtl` skill for the full rule set.

---

## 7. Code style

- **TypeScript strict.** No `any` (use `unknown` + narrowing). No non-null `!` to silence the
  compiler — handle the null case. `noUncheckedIndexedAccess` means indexed reads are
  `T | undefined`; narrow them.
- **RSC by default.** Add `"use client"` only for state, effects, or browser APIs. Keep client
  components small and leaf-level. Currently client (5, `perf.mjs` → `clientComponents`, as of
  2026-11-09): `LeadForm`, `MobileMenu`, `Reveal`, `DesktopNav` (`fd72698`, the header
  disclosures) and `EngagementEvents` (`98e38f0`, renders nothing) — each on the `KNOWN_CLIENT`
  ledger in `scripts/audit/rtl-lint.mjs`, added in the same change. It was 3 from Sprint 3, when
  `Faq` became native `<details>` and `Header` a server shell. A new client file joins that ledger
  in the change that adds it; the TOC is server-rendered and adds none. (The
  live surfaces add none: `components/live/Live.tsx` is server-only and their browser behaviour is
  the static `public/assets/live.js` — §14.)
- Imports use the `@/*` alias. No `../../..` chains.
- Compose conditional classes with `cn()` from `@/lib/utils`.
- Tailwind utilities only, **mobile-first**. Use the `@theme` tokens (`primary` `#B6070C`,
  `secondary` `#3D55AD`, `accent` gold, `font-heading`, `font-sans`) — **never hardcode brand hex in
  components**. On gold surfaces use `accent-foreground` (dark text); `accent-600+` are the AA-safe
  values as text on white.
- Components PascalCase; hooks `useXxx.ts`; utilities camelCase.

---

## 8. SEO, schema, images

- **One `<h1>` per page**, matched to search intent. Everything else `<h2>`/`<h3>`, no skipped levels.
- **Titles:** the root `template` in `app/layout.tsx` already appends `| דן שערים חשמליים`. A page's
  own `title` must therefore **never append the brand again** (the doubled suffix that shipped on 25
  pages was fixed 2026-08-17; `titles.mjs` fails on a recurrence). See the `seo-metadata` skill.
- **Canonicals:** self-referencing, trailing slash, percent-escaped so they are byte-identical to the
  `sitemap.xml` `<loc>`.
- **JSON-LD** is built with `@ishub/site-kit/seo` (`localBusinessJsonLd`, `serviceJsonLd`,
  `faqJsonLd`, `breadcrumbJsonLd`, `jsonLdScript`) wrapped by the site-local builders in
  `lib/jsonld.ts` — `businessNode`, `websiteJsonLd`, `serviceNode`, `locationServiceJsonLd`,
  `articleJsonLd`, `itemListJsonLd`, `pageNode`, `breadcrumbNode`, `graph`; target graph
  [docs/schema-graph.md](docs/schema-graph.md). Since Sprint 2 (2026-11-08, `02a3144` `d8edb28`) every
  content page emits **one** script holding **one** `@graph`: pages hand `PageHeader` their `nodes`
  and it appends the one `BreadcrumbList` (46 nested routes as of 2026-11-10; 45 from `7ed1acd`, 49
  after Sprint 7 — never add a second). The business node
  ships on every page that references `#business`, with `logo`, `image`, `areaServed` as the 14
  published locations (`City` ×13 + `AdministrativeArea` ×1, named «אזור השרון» since `9886dd1`) and `hasOfferCatalog` naming the
  7 services (no `Offer`, no price); `WebSite`
  is on `/` only; `FAQPage` is on `/`, the 7 service pages, the 14 location pages and the 5 guides
  (`faqPages 27` as of 2026-11-10 — 109 questions, each marked up on one page only; 26 and 103 from
  `7ed1acd`, 30 and 115 after Sprint 7; a guide that repeats a question throws at module load); the
  14 locations emit a `Service` with `areaServed` typed from `kind`,
  the indexes `CollectionPage` + `ItemList`,
  `/אודות/` an `AboutPage` with `knowsAbout` (naming ת״י 900 חלק 21.03 as a subject since the safety
  guide shipped — never a compliance claim), `/צור-קשר/` a `ContactPage`. Blog posts emit
  `BlogPosting` with an `Organization` author, `dateModified` from `updated ?? date` (shown on the
  page beside the publish date through `ArticleMeta` since `9886dd1`) and `isPartOf` the `Blog`; the guides emit `TechArticle` (safety, component) or `Article` with the business as
  author and `citation` from their `sources`, and the hub a `CollectionPage` + `ItemList`; every
  schema URL is percent-encoded. `node scripts/audit/schema.mjs` → 0 failures, 0 warnings,
  `danglingIds 0`, `rawHebrewUrls 0` as of 2026-11-09. `Review`/`AggregateRating`,
  `Offer` and a `Person` author ship **only** when sourced, which today they are not.
- **Images:** content images are AI renderings under one site-wide note, and they render **only**
  through `components/images/Figure.tsx` (§15; backlog N37 — the kit came in the kit commit
  `ff065e4`, the 78 renderings in the install commit `490c1c5` of 2026-11-12, live since that day's deploy).
  The header logo (`public/dangates-logo.png`, `6407f83`, through the kit's `SiteImage`) is the
  only `<img>` that is not an `/images/` path — one decorative mark per page, `alt=""` — and
  `perf.mjs` → `images` and `a11y.mjs` → `imgCount` count both it and the renderings (`168` as of
  2026-11-12, the install; 49 at the kit commit with `/גלריה/`, 48 on 2026-11-10). The OG
  card comes from the `imgquarry.com` media host in the manifest; a rendering is never `og:image`,
  never an `image` in JSON-LD and never an `ImageObject`. Every content image carries a Hebrew
  `alt` written by the toolkit from the finished pixels (40–160 characters, describing only what is
  visible — no job, city, date, customer, count or brand) plus `width` and `height`. There is **no
  `assets/` directory and no `image:optimize` script** on this site: `sharp` and the toolkit live in
  Media Studio, never here.

---

## 9. Build gate

```
npm run audit:env   # step 0 — the environment's own self-test (citations, frontmatter, hooks, deny set)
npm run gate        # lint → typecheck → format:check → build → npm run audit
```

`npm run audit` refuses a stale `out/` — **rebuild before asserting** (backlog N12) — and exits with
the failure count. **Known-baseline rule:** the bar is not "zero failures" but "no failure absent from the
known-baseline table in `qa-build-gate` (or the latest `docs/audits/` report)" — 1 as of 2026-11-09,
the `content-depth` post floor, which waits on the post rewrite (owner-actions 3.8). A change that
adds one, or moves a number the wrong way, does not ship. The `qa-build-gate` skill adds the auditor sweep and the stop-ship list.

Since 2026-10-12 `npm run build` also runs the fleet live-kit's gates (§14) through npm's `prebuild`
(after `gen-redirects`) and `postbuild`. They fail on unapproved live wording, so a draft builds
only as `LIVE_DRAFT=1 npm run build` — a local preview whose `out/` carries `out/.live-draft` and
must never be deployed (`ops/deploy-site.ps1` refuses it, `-DeployOnly` included).

Since Sprint 10's kit commit (`ff065e4`, backlog N37, §15) `postbuild` ends with the images gate,
`scripts/images/check-images-out.mjs` (`npm run images:check`), **after** `check-live-out` — last,
always, because `check-live-out` rewrites `out/.live-draft`. A build that shows candidate renderings
runs only as `IMAGES_DRAFT=1 npm run build`; it writes `out/.images-draft` and appends to
`out/.live-draft`, so the deploy script refuses it too. `thresholds.json` → `maxOutBytes` (15 MB)
measures `out/` **without** `out/images/` from that commit on; `perf.mjs` reports `imagesBytes`
beside `outBytes`, bounded by the manifest's `gates.maxTotalBytes` (20 MB). The baseline moved
twice, and only then: at the kit commit (50 `index.html` under `out/`, 48 sitemap URLs,
`images 49`, `imgCount 49`, `imagesBytes 0`, the gate at 46 content routes / 0 images) and at the
install commit, 2026-11-12 (`npm run gate`: `images 168`, `imgCount 168`, `imagesUnsized 0`,
`imagesBytes 11766080` under `gates.maxTotalBytes` 20971520, `outBytes 13522450` without
`out/images/` under `maxOutBytes` 15000000, the gate at 46 content routes / 46 with images and 78
manifest entries approved, 50 `index.html` and 48 sitemap URLs unchanged, still the one known
`content-depth` failure). `qa-build-gate` records both.

---

## 10. Deploy — read this before shipping

**Production is Cloudflare Pages, direct upload via wrangler.** Pushing to `main` publishes
**nothing**: `.github/workflows/deploy.yml`, `public/CNAME` and `public/.htaccess` were deleted
2026-09-06 (ADR 0004, commit `a0e0fe2`). Until then that workflow published a redirect-less copy of
the site to GitHub Pages on every push — a real deployment nobody saw, because the domain stopped
resolving there. There is no second origin now.

Verified 2026-08-16 from live headers (`Server: cloudflare`, `cf-cache-status: DYNAMIC`, Cloudflare's
managed `robots.txt`, no GitHub/Fastly edge headers — the galbath.co.il fingerprint). The roster's
`hosting.target: cloudflare-pages` is right; its `toolkit.notes` "LIVE on GitHub Pages" is stale.

```powershell
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain dangates.co.il -DryRun
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain dangates.co.il -Confirm
```

The script does the drift check, busts the two staleness traps (npm caches `file:` tarballs; Next
caches under `.next/`), gates the output, preserves `out.prev/` for rollback, and logs the deploy.
**Deploying is a production mutation — always ask first.** The `guard-destructive-ops.ps1` hook
blocks `deploy-site.ps1` / `wrangler pages deploy` unless the call carries `-DryRun`, or `-Confirm`
**and** a `# APPROVED: <reason>` marker on the same command — dry run first, every time. It also
blocks force-push, `reset --hard`, recursive deletes and Cloudflare/DNS mutations. See `deploy-dangates`.

**New guides get their real dates at deploy.** A guide's `datePublished` / `dateModified` are
drafting placeholders (the four Sprint 7 guides went live 2026-11-10 with both set to that day; guide 5,
`שער-חשמלי-לא-נסגר`, carries 2026-11-10 as a placeholder, not yet deployed). Before the first deploy
that carries a guide, set both to the real deploy day in the deploy commit — never backdated — and
only then run the dry run (`deploy-dangates`, "Before you deploy").

**Redirects and headers — this repo owns both since 2026-09-06**
([ADR 0004](docs/decisions/0004-redirects-replace-stubs.md), commit `a0e0fe2`).

- **`public/_redirects`** carries **80 real 301 rules** that Cloudflare Pages issues at the edge —
  each of the 36 mapped legacy paths and the 4 location pages retired in `7ed1acd` (owner-actions
  3.6) in both its slashed and bare form, both columns percent-encoded (72 until 2026-11-09). The
  retired pages and the legacy root paths that reached them all land on `/איזורי-שירות/` in one hop.
  It is **generated**: `scripts/gen-redirects.mjs` builds it from `REDIRECTS.md` and runs on
  `prebuild`, so edit the map, never the file. The 37 meta-refresh stubs it replaced are deleted; a
  static asset at a path would shadow its own redirect rule, which is why deleting them was
  mandatory rather than tidy.
- **`public/_headers`** adopts the five headers the Cloudflare zone was already sending (HSTS,
  `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), plus
  `/_next/static/*` immutable caching and a **report-only** CSP around the inline GTM snippet —
  report-only because a static export cannot mint a per-request nonce, and an enforcing `script-src`
  that gets it wrong kills every conversion signal while the pages still look fine. Cloudflare Pages
  **merges** this with the zone rule rather than replacing it, so a header can be emitted twice
  until the owner deletes the zone rule ([docs/owner-actions.md](docs/owner-actions.md) §1.3) — do
  not delete it before `_headers` is confirmed live on `dangates.pages.dev`, which has no zone rules
  in front of it.

`node scripts/audit/edge.mjs` measures both — `redirectRules 80 · stubs 0 · redirectsFile true ·
headersFile true · deadHostArtifacts 0 · foreignStubs 0 · llmsTxt true` as of 2026-11-09. The 72
original rules are live since the 2026-10-12/13 deploys (the three-URL `301` probe passed
2026-11-08); the 8 rules for the retired location pages are live since the 2026-11-12 deploy
(`/locations/קריות/` → `301` to `/איזורי-שירות/`, probed that day).

---

## 11. Commands

| Task                  | Command                                                                                                                                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev server            | `npm run dev`                                                                                                                                                                                                                                      |
| Production build      | `npm run build`                                                                                                                                                                                                                                    |
| Lint                  | `npm run lint`                                                                                                                                                                                                                                     |
| Type-check            | `npm run typecheck`                                                                                                                                                                                                                                |
| Format / check        | `npm run format` · `npm run format:check`                                                                                                                                                                                                          |
| Audit the export      | `npm run audit` · `npm run audit -- --scope seo` (`--json`)                                                                                                                                                                                        |
| Audit the environment | `npm run audit:env`                                                                                                                                                                                                                                |
| Full gate             | `npm run gate` (lint → typecheck → format:check → build → audit)                                                                                                                                                                                   |
| Regenerate redirects  | `npm run redirects` (also runs on `prebuild`)                                                                                                                                                                                                      |
| Live draft build      | `LIVE_DRAFT=1 npm run build` — local preview only, never deploy (§14)                                                                                                                                                                              |
| Weekly reminder       | `npm run live:remind` (prints; pushes only with `NTFY_TOPIC`, §14)                                                                                                                                                                                 |
| Images gate           | `npm run images:check` — the postbuild gate on `out/`, 46 content routes (§15; from N37's kit commit)                                                                                                                                              |
| Images coverage       | `npm run images:status` — per slot: approved, candidate, held or missing (§15)                                                                                                                                                                     |
| Images draft site     | `IMAGES_DRAFT=1 npm run build`, then `node scripts/serve-out.mjs` — the local site with candidate renderings at `http://localhost:3000`, the owner's board view; never deployed. `npm run dev:images` cannot serve the Hebrew dynamic routes (§15) |

---

## 12. Scope guardrails

- Implement real UI, sections, or content only when asked. Don't opportunistically redesign.
- Don't add a 15th location or an 8th service until the existing ones pass the doorway test in
  [docs/content-standards.md](docs/content-standards.md) — and never re-add one of the four retired
  in `7ed1acd` (קריות, צפון, דרום, באר שבע) unless the owner reverses owner-actions 3.6.
- Don't add dependencies without a reason that survives "can the platform already do this?"
- Cloudflare zone settings (AI crawler policy, Scrape Shield, cache rules, security headers) are **the
  owner's to change**. Document the exact toggle in [docs/owner-actions.md](docs/owner-actions.md);
  never assume it was done.

---

## 13. Agents, skills, hooks

Three kinds of asset, three jobs: **agents** (`.claude/agents/`) carry judgment and are read-only
unless the roster says _writer_; **skills** (`.claude/skills/`) carry procedure — steps, acceptance bar,
gotchas; **scripts** (`scripts/audit/`) carry measurement, and when a skill and an agent disagree the
script decides. Hooks and `.claude/rules/` make golden rules 1, 2, 7 and 9 mechanical.

- **[docs/agent-roster.md](docs/agent-roster.md) is the routing table** — backlog section → skill →
  writer → reviewer → proving script, plus the model/tool matrix. Start there.
- **Entry points:** `/audit [scope]` (rebuild → `npm run audit` → auditors in parallel →
  `docs/audits/<date>-<scope>.md` → backlog statuses) and `/improve <id>` (route → implement →
  `npm run gate` → reviewers → backlog row). Neither deploys.
- **[docs/README.md](docs/README.md) is the map of the docs layers** (strategy → standards → state →
  operations) and **[docs/implementation-sprints.md](docs/implementation-sprints.md) is the sequenced
  plan** — `/sprint <n>` walks one sprint through `/improve`, gates after every item, and stops at any
  deploy step for the owner's word. The seven standards docs (roster §7) are the bar a change must
  clear; when one disagrees with a skill, check the code and fix the skill.
- **SessionStart** prints the orientation — backlog order, latest audit verdict, tree state, the two
  entry points. Read it before asking where to begin.
- **Writers hand off to reviewers:** copy → `hebrew-editor` → `claims-verifier`; markup →
  `ts-react-reviewer`; guides → `article-auditor`. Never self-review; a live 🔶/⛔ claim is stop-ship.

---

## 14. Live surfaces — the announcement bar, the seasonal card, the updates strip

Fleet live-kit, canonical in `../3locksmiths.co.il/fleet/live-kit/` — read its README. Owner
decisions: **2026-10-11** every fleet site gets the bar, the card and the strip, the card
overriding this site's written no-popup rules; **2026-10-12** the card on all ten sites, under the
3locksmiths pilot's rules, at all hours, and ONE shared GTM trigger for the fleet. Every page
carries a thin bar above the sticky header (in flow, **not** sticky — it scrolls away) whose line
is chosen **before first paint** by the Israeli calendar — memorial days and fasts silence it,
Shabbat and chag silence the seasonal lines — and by the fleet status switch
(`https://imgquarry.com/status/fleet.json`: quiet / reduced / off; unreadable = fail closed). One
seasonal card, a native `<dialog>`: never on a page reached from search, on the 2nd page of a visit
(after 4 s) or after 20 s plus a scroll on the first, once per 14 days, never on calm or no-card
pages, never while the mobile menu is open or a form field has focus; on a phone a bottom sheet
that stops 16px above the sticky call bar. The homepage shows an updates strip after the trust bar;
it hides itself 45 days after the newest item and never moves the sitemap `<lastmod>`.

- **Edit here:** `content/live/_campaigns.mjs` (the lines, their windows, the card) and
  `content/live/_updates.mjs` — wording only from sentences the site already shows, each quoted in
  `source` (`check-live-register` checks the quote is still in its file and, through
  `pageOfSource`, that a tip links to the page carrying it; `check-live-out` proves the built page
  shows it). Nothing 🔶 from [docs/business-facts.md](docs/business-facts.md): this site's own pages
  carried many 🔶 claims (24/7, אחריות מלאה, ניסיון רב, פריסה ארצית, שירות מהיר) until Sprint 4
  softened them (2026-11-08), the roster `shortPitch` until `ad2f1ab` and the manifest `areaServed`
  until `8e8843d` (both 2026-11-09, the last one B5) — and the lines still quote only the blog's maintenance and
  troubleshooting advice — no price, warranty, speed, hours,
  availability, coverage, credentials, staff, counts or reviews. Calm / no-card pages and this
  site's own ⛔ claim stems: `live.config.mjs` (mutation-tested — re-test after any edit). Both
  registers need the owner's `approved: "YYYY-MM-DD — who, how"`, or the build fails.
- **The one exception to §5's "wording goes in `lib/content.ts`":** the registers are fleet data
  checked by their own gates. The number is never typed in them: `{phone}` prints
  `site.config.json` → `contact`.
- **Never edit:** `lib/live/**`, `scripts/live/**`, `public/assets/live.js`,
  `content/live/_calendar*.json`, `live-kit.lock.json` — byte-locked kit copies;
  `scripts/live/check-live-copy.mjs` fails the build if they change. Fix the kit upstream and
  re-sync (`node fleet/live-kit/sync.mjs ../dangates.co.il` from 3locksmiths.co.il).
- **Wiring:** `<LiveHead/>` first in `<head>`, `<LiveTopBar/>` directly before `<Header/>`,
  `<LiveDialogs/>` last in `<body>`, `<LiveUpdates/>` after `<TrustBar/>`,
  `suppressHydrationWarning` on `<html>`, `lib/live/live-core.css` imported after `globals.css`; the
  404 marks itself calm (`<div data-live-calm-page hidden />` in `app/not-found.tsx`); the open
  mobile menu carries `data-live-block` (`MobileMenu.tsx`, since Sprint 3 split it out of `Header`),
  and so does an open header disclosure (`DesktopNav.tsx`, since `fd72698`). The `--live-*` colours and the 992–1023px
  band override close `app/globals.css`: this site's mobile layout runs to 1023px (Tailwind `lg`),
  so in that band the bar follows the phone rule (closed on evergreen days, calm pages and the 404)
  and the card stops above the sticky call bar; the evergreen line shows from 1024px.
  `https://imgquarry.com` is in the report-only CSP `connect-src` (`public/_headers`).
- **Gates:** `prebuild` = `gen-redirects` → `check-live-copy` → `check-live-register` →
  `check-live-schedule`; `postbuild` = `check-live-out` (the built pages must carry exactly what the
  registers say). `scripts/audit/links.mjs` strips the bar and the card as chrome (they are on every
  page). The known baseline holds with them: 26 audit failures before and after (2026-10-12). The
  export grows by about 1.15 MB — ≈16.6 KB per HTML page and ≈7.8 KB per RSC payload, every line
  printed in both — inside `thresholds.json` → `maxOutBytes` (15 MB since 2026-11-11, the owner's
  limit, raised from 13 MB on 2026-11-10; `perf.mjs` → `outBytes` 12905638, as of 2026-11-11).
  From N37's kit commit `maxOutBytes` measures `out/` without `out/images/` (`outBytes` 13522450
  at the install, 2026-11-12); `imagesBytes` (11766080 at the install) is reported beside it and
  bounded by the manifest's `gates.maxTotalBytes` (20 MB), §15.
- **Reminder:** `.github/workflows/remind.yml` runs `scripts/live/check-reminders.mjs` every Sunday
  and pushes to the owner's phone only when THIS site needs something; red without the
  `NTFY_TOPIC` secret; a schedule runs only from the default branch on GitHub.
- **Analytics:** the card's `surface_view` / `surface_dismiss` events and the live-kit's `data-cta`
  values are in [docs/event-taxonomy.md](docs/event-taxonomy.md).
- **Popups:** `engagement-ux`, `conversion-cro`, `cro-engagement-auditor`,
  [docs/mobile-ux-and-personalization.md](docs/mobile-ux-and-personalization.md) §3–§4,
  [docs/data-tracking-infrastructure.md](docs/data-tracking-infrastructure.md) §3.1 and
  [docs/agent-roster.md](docs/agent-roster.md) banned them; each now records the owner's exception
  for this one card, dated.
- **Answered 2026-10-12 (owner, fleet wording sign-off page):** the wording is approved as drafted
  (fingerprint `4d0513a5efd6`; the self-help evergreen line kept); the wartime line "פועלים בכפוף
  להנחיות פיקוד העורף" is **confirmed** for this business; the card may show at all hours and the
  fleet keeps ONE shared GTM trigger; the updates strip ships as is (it hides itself 45 days after
  its newest item); WhatsApp goes to `+972556601006`, the owner's own (072-2587772 is not on
  WhatsApp) — synced from the roster into `site.config.json` the same day. The kit is committed
  upstream and re-synced (`live-kit.lock.json` → `cf3a5460aa8b`, clean). **The blog posts' flagged
  claims** (OK for now, fixed later, the owner said): fixed in `1796ee7` (backlog §7.2 ✅) — the two
  superlatives, the experience line ("צוות מנוסה עם ניסיון רב בתחום") and the three team /
  guarantee sentences (`הצוות המומחה`, `צוות דן שערים`, "…לפתור את הבעיה במהירות"), with no
  register-quoted sentence touched (live-out: 13 quoted pieces shown). 4F (`9195c9b`, 2026-11-09)
  rewrote the speed phrases on `שער-חשמלי-חוסך-זמן` and `שער-חשמלי-שעובד-כמו-חדש`, again with
  live-out showing all 13 pieces. **Still open:** one unclocked "שירות מהיר ואמין" on
  `שער-חשמלי-לא-מגיב` — allowed by eeat-and-trust §1.4, left for the post rewrites (Sprint 7.3,
  owner-actions 3.8); and the privacy page — rewritten 2026-11-08
  (`68a4a7f`) to name the status-file read and the four browser-storage values, its copy signed
  off (`fba5957`); backlog §8.2 stays PARTIAL on B2 and B10 only.
- **Amended 2026-11-11 (owner, in chat):** the winter power-cut line «הפסקת חשמל? יש שחרור ידני —
  בזהירות» became «הפסקת חשמל? לא כל שער משחררים ביד», after the owner's safety-only fix to the post it
  quoted (backlog N36); `check-live-out` now shows 12 quoted pieces.
- **Before the first deploy (owner, in the kit README's order):** add the three origins (apex, www, `.pages.dev`) to the status switch's CORS list — without it the
  switch is unreadable here and every seasonal line and the card stay off; widen the one shared GTM
  trigger `CE - popup events (3locksmiths)` to this hostname; `gh secret set NTFY_TOPIC -R
robiuzan/dangates.co.il`; then deploy (`deploy-dangates`, dry run first).

---

## 15. Page images — AI illustrations under one note

**Owner decisions 2026-11-11, in chat** (the record, with the install record of 2026-11-12:
[docs/business-facts.md](docs/business-facts.md) §F; the decision:
[ADR 0006](docs/decisions/0006-ai-renderings-under-one-note.md); the work: backlog N37, Sprint 10).
Every content page carries two or more realistic, phone-snapshot Gemini renderings of electric-gate
and roller-shutter work, each checked for plausibility by two vision judges, watermarked
bottom-right with the logo as supplied, and approved by the owner on the local draft site before
anything goes live. This supersedes the owner's 2026-11-10 answer (photos later, no date, neither
stock nor generated images — owner-actions 4.1, now 4.5) and every rule in this repo that waited for
real photographs. The honesty rule did not go away; it moved from the pixels to the words (below).
**Live since 2026-11-12:** the kit (Sprint 10.3, `ff065e4`) and the 78 approved renderings
(10.7, the install commit `490c1c5` on branch `page-images`) went live together in that day's
deploy (Cloudflare deployment `7a7cc2d1`), on the owner's word ("approved, deploy", in chat).

**The install, as recorded on 2026-11-12:** 78 slots, 78 approved, 0 held — 132 page renders (120
in the slot folders + 12 superseded by the re-scene) plus 38 calibration traps, US$22.38 of the
US$60 cap. Six owner touches, all in chat or on the local board: the Drive share (owner-actions
2.5, 2026-11-11); the yes on digest batch `58391645` (116 prompts — 78 page slots + 38 calibration
traps — which also approved the three softened sentences of `c535392`); board session 1 (board
batch `54c5ed25`), 76 of 76 approved, no text edits; a yes on two re-scened prompts (digest
`f4d2e10f`, stamped as batch `d8025628` because only a pre-authorised fix note on another prompt
moved the id); board session 2 (board batch `ac8deff6`), 2 of 2 approved; the deploy word.
Calibration (Media Studio `a183bd8`): 38 traps rendered, 36 labelled (two clean controls skipped,
each came out with a parked car), every scored HARD code at 100 % recall (16 of 18 scored; `text`
and `nsfw-or-minor` under two labelled frames). Pilot: 12 of 12 passed (7 on attempt 1, 5 on
attempt 2), 0 refusals, about US$2.3; `maxAttempts` stayed 6 and the watermark width 0.13 (the
mark reads at phone width). `judge.json` changed twice during the run: `face-mismatch` only for a
clearly different man (`9bcd072`) and a person on a kerb is not `unsafe-edge` (`60dc90a`). QA
stopped two slots after six attempts — `services-barrier-main` (a hand on the boom holder, or a
boom off its rest) and `cities-kfar-saba-main` (a swing leaf drawn with a sliding gate's wheels
and rail); re-scened with the owner's yes (`f7271da`), they passed on attempts 6 and 4. Before the
board, the `image-qa-reviewer` pass (5 reviewers + 5 verifiers) sent back one frame
(`home-strip-3`, a boom drawn as two arms; passed on attempt 3), and the operator corrected 20 alt
or caption texts through the toolkit (typos, a light-grey polo the alt called dark, captions that
read as a sequence or a promise). The dark rounded panel behind the logo on busy corners is the
`finish` step's deliberate scrim. The install commit also moved the dates to 2026-11-12 on every
route that gained a figure (the 5 guides' `dateModified` with their publish dates unchanged, the
11 posts' `updated`, the 7 services, the 14 locations and the `staticPages` rows `""`, `שירותים`,
`איזורי-שירות`, `מחירון`, `גלריה`, `blog`, `מדריכים`, `אודות`, `צור-קשר`, `הצהרת-נגישות`), put
the alt-text bullet on `/הצהרת-נגישות/` and let `lib/llms.ts` print `llmsCopy.renderingsNote` only
while `hasApprovedRenderings()`.

| #   | Decision                                                                                                                                                                                                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **AI renderings on every content page**, as illustrations under one site-wide Hebrew note — a footer line on every page, the gallery intro, a line under the team frame on `/אודות/`. Excluded: `/מדיניות-פרטיות/`, `/הצהרת-נגישות/`, `/תודה/` and the 404                                                                                                   |
| 2   | **The two portrait sets are AI-made characters, not real people:** ids `tech-a` and `tech-b`, never named, never presented as staff. `policy.personaKind: "synthetic-unnamed"`; no consent flow, no contact sheets. Their source labels stay in Media Studio (`refs/dangates/PERSONAS.md`, outside git) and never enter this public repo                     |
| 3   | **The logo stays as supplied, its «24/7» line included — on the watermark and in the header.** The claim lexicon does not change: no copy, alt, caption or note may say it (the alt writer reads the master, which carries no logo). business-facts §E and ADR 0006 record the contradiction; owner-actions 3.5 stays open                                   |
| 4   | **Portraits come through the toolkit's `drive-pull` `portraits` role** from the one Drive folder «תמונות עובדים» (owner-actions 2.5 — the folder, not its parent). The logo is the 1280 px RGBA PNG export; `brand-prepare` composites it, a model never draws it                                                                                            |
| 5   | **Placement: in the text flow, full column width** — a plain `<figure>` between the paragraphs it illustrates, caption under it, the first one directly after the page's answer block. No slider, lightbox, popup or floating thumbnails. The home and hub strips, the two contact figures and the index thumbnails carry no caption; every body figure does |
| 6   | **Hard spend cap US$60** (`runner.costCapUsd`); expected ≈ US$30 (26–36)                                                                                                                                                                                                                                                                                     |
| 7   | **`out/images/` is outside the audit's 15 MB `maxOutBytes`**; `perf.mjs` reports `imagesBytes` beside it; the images gate enforces ≤ 900 KB of images per page, `/גלריה/` ≤ 2.5 MB and `out/images/` ≤ 20 MB                                                                                                                                                 |
| 8   | **No chest emblem** — plain charcoal-grey work polos, nothing lettered, no `badge` block                                                                                                                                                                                                                                                                     |

Defaults taken from the fleet, changeable without a new decision: a rendering never in `og:image`,
JSON-LD or the Google Business Profile; no file-level AI marker (`metadataLabel: false`); strict
two-judge QA (`qa.strict` + `judge.json strict`) with a dangates trap set; `faceMatchStrict false`
(the fleet lesson: "unsure" loops), `peopleCountStrict true`; `maxAttempts 6`, `maxFailures 3`, the
operator re-scenes a slot stuck at 4; `gemini-3-pro-image` for a frame with a character,
`gemini-nano-banana-2.1` people-free; WebP q80/74; long edges large 1400 / half 1200 / tile 960 /
thumb 480 px at 200 / 170 / 120 / 45 KB; 720 px phone copies; `/גלריה/` in the header before
«מחירון» and in the footer column; city pages people-free; `namedSlots ["team"]`; the team frame
candid (working, one glancing up), never a to-camera pose, placed on `/` and `/אודות/` only; plan
`time` ∈ morning · midday · overcast (never late-afternoon); no vehicle in any frame; every cover,
cabinet and box closed; nobody in a gate's path, under a lifting door or in a boom's lane.

### What the images are — and are not

- **Illustrations, never evidence.** Every content image is a rendering, and none is evidence of a
  job, city, date, customer, price, duration, warranty or rating. The fault and the finished state
  are separate frames of different gates: **לפני ואחרי is banned**, no two files are a genuine pair.
- **One note, three places.** The footer line on every page (`data-images-notice="footer"`, linking
  to `/גלריה/`), the intro of `/גלריה/` (`"gallery"`) and the line under the team frame on
  `/אודות/` (`"about"`). The texts live in `content/images/notice.json`, mirrored in
  `Media Studio/sites/dangates/site.json` `disclosure.texts`; `doctor` fails when the two differ,
  and the gate compares the built HTML to the file **verbatim**. The owner approves the wording with
  the digest, so any later change needs a new approval. The note says «כל התמונות …», never «חלק
  מהתמונות», and names no count, city or price. The footer line appears exactly when a rendering is
  approved, so the site reads as before until the first batch ships.
- **The characters are never staff.** A person in a frame is «גבר בחולצת פולו כהה» in an alt or a
  caption — never «טכנאי», never «הטכנאי שלנו», never a name — and the about note says the two are
  illustrations. The watermark's «24/7» is the logo as supplied (decision 3), recorded in
  business-facts §E and ADR 0006; no alt, caption or note may say it.
- **The words around a picture never claim a record.** Alt text (40–160 characters) and captions
  (40–200) describe only what is visible: no job, city name, date, customer, count, brand, model,
  price, warranty, duration, rating or credential; no first-person job verb («ביצענו», «החלפנו»),
  no result verb («תוקן», «נפתר», «הושלם»), no «שלנו» in a caption; no הדמיה or AI inside an alt
  (the note carries that); גרש and גרשיים, never an ASCII quote touching Hebrew. Alt and caption
  would still be true if the picture were a real photograph. `site.json` `claims` is the single
  source of the stems — this site's `scripts/audit/claims.json` ids and the `live.config.mjs`
  staffing and identity stems mirrored into `claims.extraBannedRegex` — rendered into the kit's
  `images.config.mjs` and enforced by `manifest-rules.mjs`, shared by `lib/images.ts` (throws at
  module load) and the postbuild gate; `claims-grep.mjs` scans the three `content/images/*.json`
  files too.
- **Never** a rendering in `og:image`, in JSON-LD (not as `image`, and no `ImageObject` at all) or
  on the Business Profile; never a stock photograph; never a person other than the two characters;
  never a customer, a certificate, a rating, a vehicle (a plate is a location claim) or a readable
  character in frame (labels, keypads, displays and packaging are blank); never a gate type this
  market does not use.

### The characters

- **`tech-a` and `tech-b`** are the only people in any frame, faces shown. They are two AI-made
  character sets the owner supplied through Drive and declared AI-made on 2026-11-11; no consent
  applies, there is no `CONSENT.md`, no consent flow and no contact sheet. The record is
  `Media Studio/refs/dangates/PERSONAS.md`, outside git. Were the owner ever to say they are real
  people, every render stops until the policy becomes `real-consent-open` and a consent record
  exists (the Media Studio runbook §2).
- **Never named, anywhere.** Not in an alt, a caption, a file name, a commit message or a doc. The
  two names, their surnames and the Drive file labels are `bannedNames` in `site.json` only — never
  the brand's first word on its own — and **this repo is public**, so its docs say "two AI-made
  character sets, `tech-a` and `tech-b`" and nothing more.
- **Illustration, never credit.** The characters are never a byline, an author or a `Person` node;
  business-facts §B's technician rows stay 🔶 and name nobody.
- **Shirt:** a plain charcoal-grey work polo, no emblem, nothing lettered (decision 8); `text` is
  a hard reject, clothing included.
- **The watermark** is the logo bottom-right, composited by the toolkit at `finish` (width 0.13 of
  the long edge, 120–220 px, opacity 0.92 after the preview; 0.15 only if the pilot finds it
  unreadable at phone size — the 2026-11-12 pilot kept 0.13). A model never draws it.
- **Reference portraits** and the prepared brand file live in `Media Studio/refs/dangates/` and
  `sites/dangates/brand/`, outside git, and are never copied into this repo.

### The slots — 46 content routes, every route ≥ 2 images counting reuse

**78 renders**, **36 reuse placements** (33 figure placements — the team frame once on `/אודות/`,
`services-entrance-work` once on `/צור-קשר/`, 5 guide `mid` figures, 3 keeper-post `mid` figures,
16 on the 8 departing posts, 7 gallery tiles — plus 3 `/blog/` thumbnails), **8 derived
thumbnails** (5 guides index, 3 blog index), **19 frames with a character** (`tech-a` alone 9,
`tech-b` alone 8, both 2 — `home-team` and `gallery-generated-4` only; 59 people-free) and **14
gallery tiles** — all 78 approved at the install, 0 held.
46 content routes = the 47 sitemap URLs minus the two legal pages plus `/גלריה/`; `/תודה/` and
the 404 carry none. Ratios are layout decisions: nothing crops, **4:3 scenes, 3:2 details**, one
ratio per row family. Slot ids use the ASCII keys of the toolkit's `keyMap` (services `sliding
swing overhead parking barrier shutters entrance`; cities `tel-aviv … sharon`; guides
`standard-900 noisy-gate parking-barrier gate-types not-closing`; posts by topic) — `home-strip-1`,
`services-sliding-main`, `cities-tel-aviv-detail`, `guides-not-closing-lead`,
`gallery-generated-1`. Exactly one `priority` per page = the first content image in DOM order,
computed from what renders.

| Route                  | Slots (ratio · class)                                                                                     | Position (this site's own section order)                                                                                                                                                                          | People                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `/`                    | `home-strip-1..3` 4:3 tile, no caption · `home-team` 3:2 half, caption                                    | the strip between `Hero` and `TrustBar` · the team teaser between `Process` and `Diagnosis`                                                                                                                       | tech-a · none · tech-b · both (candid, in progress)    |
| `/שירותים/`            | `services-pair-1..2` 4:3 tile, no caption                                                                 | inside `PageContentBlock` via `afterAnswer` — after the answer `<p>`, before the sections                                                                                                                         | none (parts on a cloth) · tech-b                       |
| `/services/<7>/`       | `main` 4:3 large · `detail` 3:2 half · `work` 3:2 half, all captioned                                     | `main` after the answer `<p>`, before `<Toc>` · `detail` after the symptoms table, before `upfront.ask` · `work` after the depth sections, before «מתי כדאי לפנות אלינו?», followed by the per-page gallery line  | `main` one character (the triplet table) · none · none |
| `/איזורי-שירות/`       | `areas-strip-1..3` 4:3 tile, no caption                                                                   | via `afterAnswer`; three building-stock archetypes, never a city                                                                                                                                                  | none · tech-a · none                                   |
| `/locations/<14>/`     | `main` 4:3 large · `detail` 3:2 half, captioned                                                           | `main` after `AnswerBlock`, before `<Toc>` · `detail` after the `localNotes` sections, before the neighbourhoods block                                                                                            | none — the city-archetype table, no city name anywhere |
| `/אודות/`              | `team` (reuse of `home-team`) + the about note · `about-story` 4:3 half · `about-work` 3:2 half           | `team` via `afterAnswer` before the Toc · `story` after the intro `<p>` · `work` after the values `<ul>`                                                                                                          | both · tech-b · none (materials)                       |
| `/צור-קשר/`            | `contact-main` 4:3 half, **no caption** · reuse of `services-entrance-work`, no caption                   | `main` first in the details column, before «פרטי התקשרות» · the reuse centred under the two-column grid, before the complaints section (not the team frame: a held team frame would leave contact with one image) | tech-a · none                                          |
| `/מחירון/`             | `pricing-survey` 3:2 half · `pricing-layers` 3:2 half, captioned                                          | `survey` after the CTA pair, before `<Toc>` · `layers` in its own white Section between the drivers and `PricingTeaser`                                                                                           | tech-b · none (parts on a cloth)                       |
| `/גלריה/`              | `gallery-generated-1..7` 4:3 half, captioned, each linked to its page · the 7 service mains as tiles 8–14 | the 2-column grid under the intro, the note and the H2; every row 4:3                                                                                                                                             | 5 none · tech-a (2) · both (4); all finished states    |
| `/מדריכים/`            | 5 derived thumbnails of the guide leads, no caption                                                       | the start side of each `GuideCard`                                                                                                                                                                                | —                                                      |
| `/מדריכים/<5>/`        | `lead` 4:3 half, captioned · `mid` = reuse of a service `detail` or `work`                                | `lead` via `afterAnswer` before the Toc · `{ kind: "figure", slot: "mid" }` after the guide's first `table` block                                                                                                 | 2 leads with a character, 3 none                       |
| `/blog/`               | 3 reuse thumbnails of the keeper mains                                                                    | the start side of the 3 keeper cards; departing cards stay text                                                                                                                                                   | —                                                      |
| `/blog/<3 keepers>/`   | `main` 4:3 half, captioned, `thumb: true` · `mid` reuse                                                   | the renderer injects `main` after the first `p` block, `mid` after the first `p` past the midpoint                                                                                                                | none                                                   |
| `/blog/<8 departing>/` | `main` reuse · `mid` reuse — no own render, zero spend                                                    | the same two positions                                                                                                                                                                                            | none                                                   |

**Service triplets:** `main` = the character doing the page's own step (covers on, outside the
path), `detail` = the fault close-up, `work` = the finished state — three illustrations, never one
job. **City archetypes:** `main` opens with a clause unique to that city's building stock from its
own `content/locations/<slug>.ts` `localNotes`, `detail` is the exposure the page's glance block
tells the reader to look for; coastal cues only on the coastal cities; no city name in subject,
alt, caption or file slug. **Blog scope** (`docs/content-calendar.md` §4): own renders only on the
3 posts that stay; the 8 scheduled to fold or 301 reuse two service close-ups each, and when a post
is retired its placements leave in the same commit (`lib/images.ts` throws on a placement whose
route is gone). **Copy within one screen of a character:** three sentences in `lib/content.ts`
(`differentiators[2]`, `aboutSections[0]`, `aboutSections[2]`) are softened with the owner's
exact-Hebrew yes in the digest, in a small commit before install; until the yes, `about-story`
renders people-free. (Done: the yes came with digest batch `58391645`, the commit is `c535392`.)

**Budgets:** large 1400 px ≤ 200 KB, half 1200 px ≤ 170 KB, tile 960 px ≤ 120 KB, thumb 480 px ≤
45 KB; a page ≤ 900 KB of images (`maxPageImageBytes 921600`), `/גלריה/` ≤ 3 MB
(`pageBudgets["/גלריה/"] 3145728`, set by hand at the install commit: decision 7 said 2.5 MB, but
the gate sums the full files, and 7 half + 7 large at their caps are 2,652,160 bytes — a threshold
decision recorded in business-facts §F's install record, never a side effect), `out/images/` ≤ 20 MB
(`maxTotalBytes 20971520`). A phone copy is 720 px wide and ≤ 120 KB (`PHONE_COPY` in
`manifest-rules.mjs`); the page budget counts the full files, the desktop worst case. Measured at
the install (2026-11-12; expected ≈ 10–11 MB and ≈ 168): `imagesBytes` 11766080 (`imageFiles`
164 — full images 8,855,580 B, 78 phone copies 2,727,992 B, 8 derived thumbnails 182,508 B;
`out/images/` 11,490 KB), `imgCount` 168; the heaviest page is `/גלריה/` (14 images, 1,474 KB of
its 3 MB) and the heaviest under the 900 KB rule `/services/שער-זרוע/` (3 images, 435 KB).
`gates.minPerContentPage` went from 0 to 2 at the install: 46 of 46 routes carry 2 or more.

### Rendering rules

- **`components/images/Figure.tsx` is the only way** a content image renders: a plain `<img>` with
  its true `width`/`height` and `loading="lazy"`, no `next/image`, no srcset (the export has no
  resizer). An approved image also offers its phone copy, `<group>/<slug>-w720.webp`, through
  `<picture><source media={PHONE_MEDIA}>` around that `<img>`. React writes no preload for an image
  inside `<picture>`, so a phone fetches only the small file; never add `ReactDOM.preload` there
  (it drops `media`, so a phone would fetch both). An index card shows the 480 px thumbnail and
  offers none. Page code never writes an `<img>` for a content image.
- **Exactly one `fetchpriority="high"` content image per image-bearing page — the first content
  image in DOM order — and `loading="lazy"` on every other.** The header logo is eager on every page
  with its own `priority` and is not counted: the gate reads only `/images/` paths as content.
  Pages compute it from what actually renders (`leadSlotOf`, `stripShown`, the guide body's
  `leadShown`), so a held `main` never leaves a page with two eager images or none.
- **Guides:** the block model (ADR 0003) gains `{ kind: "figure"; slot }` and loses the unused
  `image` kind that rendered through `next/image`; each guide carries one `mid` figure after its
  first `table` block, and `lead` renders through `afterAnswer` under the answer block, above the
  Toc. `/מדריכים/` renders all 5 thumbnails or the gate reports them as placed but not rendered.
- **Posts** keep the flat `PostBlock` model (`.claude/rules/content-data.md`): the blog page
  renderer injects the two figure positions; nothing is added to `lib/posts.ts`.
- **A slot with no approved image renders nothing**, and a strip below two approved tiles renders
  nothing, so every page reads correctly before a single image is approved. A figure illustrates;
  it never replaces a paragraph, and no image is the sole carrier of information.
- **`/גלריה/`** has its own title («גלריה — כך נראית עבודה על שער חשמלי»), description, canonical
  and `og:url` (hand-fixed: this site's `PageHeader` wants `crumbs` with `href`, and the layout's
  `og:url` must be overridden), is registered in `staticPages` so `links.mjs`, the sitemap and
  `/llms.txt` know it, and shows the note whether or not a rendering is approved. The word שביצענו
  never sits near a `/גלריה/` link; the per-service line «איך זה נראה — בגלריה: {service.name}»
  stays under 12 tokens and unique per page, so `content-depth.mjs` never counts it as a shared
  block.
- **`JobPhotos` and the Hero's `manifest.images.hero` branch are retired** in the kit commit: both
  would present catalog photos as real field work. The catalog (`site-images`) keeps the OG card and
  the header logo only; `images.hero` and `images.gallery` in the manifest stay null.
- Logical Tailwind utilities only (§6), tokens not hex (§7), server components only (§7 — the kit
  adds no client file). The files are same-origin, so there is no new data flow for
  `/מדיניות-פרטיות/`. In `live.config.mjs`, `forbiddenSources` lists `content/images/`, so a live
  tip can never cite an alt or a caption.

### The pipeline (skill `page-images-pipeline`; toolkit `Media Studio/page-images/`)

`content/images/plan.json` (authored by `image-art-director`, built through
`Media Studio/sites/dangates/plan-generator.mjs`: subject, Hebrew context, character / phase /
season / time rotation, never a city in a file name) → the Media Studio toolkit,
`cd "C:/Users/robiu/antigravity/Projects/Media Studio"` then
`node page-images/cli.mjs <cmd> --site dangates`, every command `--dry-run` first, ASCII ids only on
the PowerShell 5.1 command line, comma lists quoted: `doctor` → `plan lint` →
`node sites/dangates/write-traps.mjs` → `brief` (78 prompts + the traps, `approved: null`) →
`digest` (one page for the owner: prompts, the characters, the note, the three softened sentences,
the watermark preview, the cost) → the owner's **yes in chat** → `approve --batch <sha8> --by "owner
in chat"` → `generate --only "calib-*"` → `label-calibration.mjs` → `qa --calibrate` once (≥ 90 %
recall on every scored HARD code) → a **12-frame pilot** (6 with a character, 6 people-free; the
pilot rules in the plan decide re-scenes, ref order, NOT-clause rewrites and `maxAttempts`) → the
four batches (`services-*` + `gallery-*` · `home-*,services-pair-*,areas-*,about-*,contact-*,
pricing-*` · `cities-*` · `guides-*,blog-*`; `generate` is idempotent by render key, every paid call
in the ledger, refused past the cap) → `qa` (deterministic checks and two vision judges; after any
`judge.json` wording change `node sites/dangates/rejudge.mjs` on the stored masters, never
`qa --force`) → `alt` (Hebrew alt and caption from the finished pixels) → `finish` (exact slot box,
logo bottom-right, WebP) → `stage` (candidates into `public/images/_candidates/` plus `candidate`
manifest entries) → `review --no-dev` (the board at `http://localhost:4310`, or the next free port, beside an `IMAGES_DRAFT=1` build served by `node scripts/serve-out.mjs`; the
`image-qa-reviewer` agent spot-checks first) → `install` (approved → `public/images/<group>/`) →
`node page-images/tools/phone-copies.mjs --site dangates` → `npm run images:status` →
`npm run gate` → deploy (ask) → the post-deploy image checks in `deploy-dangates` → `mirror`. The
contract every path, slot id, text and command obeys: `Media Studio/page-images/docs/contract.md`
(§16 is this site's).

- **The judges.** HARD codes written for this trade: `wrong-gate-type` (one judge is enough),
  `unsafe-mechanism`, `unsafe-electrical`, `vehicle`, `legible-reading`, `impossible` (judged from
  the picture alone — a cantilever leaf hanging free beyond its carriages is NOT impossible),
  `wrong-trade`, `unsafe-edge`, `foreign`; the fleet codes `text`, `extra-person`, `face-mismatch`,
  `rating-or-document`, `landmark`, `sparkle-or-watermark`, `nsfw-or-minor` keep their fleet
  wording. The SOFT codes and every definition: `Media Studio/sites/dangates/judge.json`. Strict mode downgrades
  nothing — a lone judge's HARD code is a `regenerate` — so judge precision (the evidence rule, the
  NOT clauses) and `rejudge` are the cost controls, not the cap. There is no OCR, so 100 % zoom on
  keypads and labels stays a human step.
- **`IMAGES_DRAFT=1`** (read in RSC at build and dev time, like `LIVE_DRAFT`) renders `candidate`
  entries from `/images/_candidates/` with a «טיוטה — ממתין לאישור» badge. In PowerShell:
  `$env:IMAGES_DRAFT="1"; npm run build; Remove-Item env:IMAGES_DRAFT`. Without it only `approved`
  entries render and `_candidates/` is pruned from `out/`. Review stays on the local draft site: a
  `pages.dev` preview would publish candidates. Stop the dev server before any build.
- **Edit here:** `content/images/plan.json` (the slot plan; the toolkit only reads it); alt and
  captions on the board or, for `candidate` entries, the two text fields in the manifest;
  `content/images/notice.json` only with the owner's word, together with `site.json`.
- **After `install`:** the phone copies (the gate fails an approved image without its copy) →
  `npm run images:status` (0 missing, or the held list named) → `gates.minPerContentPage` from 0 to
  2, only at 46/46 → the dates to the install day on every route that gained a figure (the 5
  guides' `dateModified`, the 11 posts' `updated`, `services`, `locations` and the `staticPages`
  rows — never backdated) → the new bullet on `/הצהרת-נגישות/` → the renderings note in
  `lib/llms.ts` → the install record in business-facts §F → ADR 0006's Implementation → N37's
  Closed paragraph → the numbers here and in `qa-build-gate` → `npm run format` →
  `npm run gate`. `git status --short` then shows only `public/images/**`,
  `content/images/manifest.json`, the dated files and the docs; never `_candidates/`,
  `assets/images/*` or anything from `refs/`.
- **Fleet reuse.** The toolkit is site-agnostic; the per-site policy lives in
  `Media Studio/sites/dangates/site.json`. `sharp` and the toolkit code live there, never here;
  this repo keeps the plan, the manifest, the note, the approved files, `lib/images.ts`, the
  components and the gate. The toolkit changes dangates needed — the `keyMap` for Hebrew slugs,
  the `portraits` Drive role, the template at hambabait's live kit — are opt-in and byte-identical
  for the eight sites before it. Next site: `Media Studio/runbooks/page-images-for-a-site.md`.

### The gate — `scripts/images/check-images-out.mjs` (postbuild, last)

Fails the build on: a manifest that breaks `manifest-rules.mjs`; an approved file missing from
`public/` or `out/`, or differing from its recorded dimensions, bytes or sha256; a candidate in a
production export; any file under `out/images/` the manifest does not vouch for; a retired entry
past its keep whose file still exists; an approved image without its phone copy, a figure that does
not offer it, or a `<source>` that is not a visible phone copy at `PHONE_MEDIA`; an `<img>` without
numeric `width`/`height` or a non-empty alt; a content image outside a `Figure`; more or fewer than
one priority content image, or one that is not the first content image (the header logo is not an
`/images/` path and is not counted); a page over its byte budget; a page under
`gates.minPerContentPage`; a rendered alt or caption that breaks the text rules; a placement that
does not render, or an image that renders without a placement; one file on two `/locations/`
pages; an `/images/` path inside JSON-LD, `og:image` or `twitter:image`; an `ImageObject` node; a
note marker missing, doubled or not word-for-word `notice.json`; a note that contains «חלק מ» while
no approved `owner-supplied` entry exists. It prints a coverage table per route. **With the empty
manifest of the kit commit it printed 46 content routes and 0 images**, and the rest of the gate
read: 50 `index.html` under `out/`, 48 sitemap URLs, `images 49`, `imgCount 49`, `imagesBytes 0`,
`imagesUnsized 0`, `rawHebrewUrls 0`, `/גלריה/` registered and not an orphan, `sharedParagraphs`
unchanged, `claims-grep 0`, the one known `content-depth` failure only. **At the install
(2026-11-12) it prints 46 content routes, 46 with images and 78 manifest entries approved**, and
the rest of `npm run gate` reads: 50 `index.html`, 48 sitemap URLs, `images 168`, `imgCount 168`,
`imagesUnsized 0`, `imagesBytes 11766080`, `outBytes 13522450` (without `out/images/`),
`rawHebrewUrls 0`, `sharedParagraphs 1`, `claims-grep` pass, `clientComponents 5`, the one known
`content-depth` failure only (the post floor, 11 of 11 posts under 900 words).

### Operating rules

- **Retire, never delete.** Never delete a deployed image file. A replacement is a **new slug** plus
  `retired: "YYYY-MM-DD"` on the old entry; the old file stays ≥ 60 days, then the file and its
  entry go in one commit. A rollback redeploys `out.prev/` or reverts the manifest commit.
- **No revocation clause.** Nobody real is depicted (decision 2), so there is no consent to
  withdraw and no 14-day removal path; a frame leaves only through retirement. If the owner ever
  says the characters are real people, rendering stops before the next frame and the policy, the
  note and a consent record change together before any further render (the toolkit runbook §2).
- **Install** means the toolkit's `install`; nothing else moves a file into `public/images/`, except
  `tools/phone-copies.mjs`, which writes the phone copy of an image already approved there. A file
  there without a manifest placement fails `images:check` as a stray. Never commit
  `public/images/_candidates/` or anything under `assets/images/` except its README.
- **Never invent a caption's claim.** The writer is Claude, the validator is code and the reviewer
  is the owner: if a caption states a fact, it is wrong.
- **The kit and the images go live in one deploy.** The kit alone would publish an image-less
  `/גלריה/` in the header menu. The pre-deploy step sets every gained figure's date to the deploy
  day (§10).
- **Real photos, later,** enter the same manifest as `owner-supplied` entries through the
  toolkit's `import` and replace renderings one for one (owner-actions 4.5: landscape ≥ 1600 px,
  originals without any added mark — the toolkit composites the logo — and permission for
  identifiable people or property). The first one makes «כל התמונות …» untrue, so the note changes
  with it, under a new approval. A real photo is still never `ImageObject`, never evidence of a
  city or a date in its caption.
- **Owner touches, four and no more:** the Drive share (2.5), one yes on the digest, one board
  session on the local draft site, the deploy word — a second yes only if the pilot forces
  `brief --refresh-blocks`. Nothing here is done until business-facts §F's install record is filled.
