# CLAUDE.md — דן שערים חשמליים (dangates.co.il) project rulebook

> The operating manual for any AI agent (and human) working in this repo. Project rules here
> **override** global defaults. When this file and the code disagree, fix the code. When this file and
> `Israeli services sites/roster/sites/dangates.json` disagree about a business fact, **the roster wins**.

---

## 1. Business context

- **Business:** דן שערים חשמליים (Dan Electric Gates) — repair, service and installation of electric
  gates, plus electric rolling shutters. **No street address** — the manifest carries none, and
  `schema.areaServed` is `מרכז הארץ ופריסה ארצית`. Do not invent one.
- **Phone (click-to-call):** `072-2587772` · WhatsApp same number · `info@dangates.co.il`.
  This site sets `contact.phoneOverride: true` — it is the **one** fleet site that does not use the
  shared `055-6601006` lead number. Never "correct" it to the shared one.
- **Hours:** ראשון–חמישי 08:00–18:00, שישי 08:00–15:00, plus a 24/7 emergency line.
- **Service area:** מרכז הארץ + פריסה ארצית. 18 location pages, 7 service pages, 11 blog posts.
- **Audience:** private homeowners, ועדי בתים (building committees), property managers, businesses
  with vehicle gates.
- **Core promise:** fast, reliable diagnosis and repair — same-day where possible, emergency
  availability, and a warranty on the work — write **אחריות על העבודה**, never "אחריות מלאה": the
  term, scope and exclusions are unconfirmed and not coming (the 13 source hits left are backlog §7.2).
- **Conversion goals, in order:** (1) phone call, (2) WhatsApp, (3) lead form. Every page keeps a
  call/WhatsApp action within reach; the mobile CTA bar is sticky.

> ⚠️ **Not substantiated:** years in business (`foundedYear: null`), the warranty term, licences,
> insurance, 24/7 availability, national coverage, and 8 of the 9 prices on `/מחירון/` (authored
> estimates). See [docs/business-facts.md](docs/business-facts.md); **never present an unconfirmed
> value as fact.** The phrases those claims hide behind are the **claim lexicon**
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
   curly quotes. **Still outstanding:** ~42 plain-text link references, a flat all-`<h2>` hierarchy,
   4 curly quotes, no answer blocks or tables. Treat the file as untrusted input. _Hook-enforced:_
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
  sitemap.ts robots.ts    # /sitemap.xml (45 URLs), /robots.txt
  not-found.tsx           # 404
  services/[service]/     # 7 pages — Service JSON-LD
  locations/[city]/       # 18 pages
  blog/ blog/[slug]/      # index + 11 posts
  שירותים/ איזורי-שירות/ מחירון/ אודות/ צור-קשר/
  מדיניות-פרטיות/ הצהרת-נגישות/
components/
  ui/          Button Container Section SectionHeading Reveal
  layout/      Header Footer PageHeader MobileCtaBar
  marketing/   Hero TrustBar ServicesGrid WhyUs Process PricingTeaser
               ServiceAreas Reviews Faq FinalCta
  forms/       LeadForm
  live/        Live.tsx — the fleet live-kit surfaces, server components only (§14)
lib/
  site-config.ts   # ⭐ NAP, services[7], locations[18], telHref, whatsappHref
  content.ts       # ⭐ all Hebrew marketing copy; reviews = [] (gated)
  posts.ts         # ⭐ 11 migrated blog posts (untrusted — see golden rule 7)
  utils.ts         # cn()
  live/            # fleet live-kit copies — byte-locked, never edit (§14)
scripts/gen-redirects.mjs   # emits public/_redirects (72 real 301 rules) from REDIRECTS.md; runs on prebuild
scripts/audit/     # ⭐ the measurements (12 checks + thresholds.json + claims.json) — roster §4
scripts/live/      # fleet live-kit gates (prebuild / postbuild) and the weekly reminder — locked (§14)
content/live/      # ⭐ _campaigns.mjs + _updates.mjs (the live registers) + the synced calendar (§14)
live.config.mjs    # ⭐ calm / no-card pages, this site's ⛔ claim stems, pageOfSource (§14)
live-kit.lock.json # the kit commit and the sha256 of every locked copy (§14)
site.config.json   # SiteManifest — SYNCED FROM THE ROSTER, do not edit here
public/_redirects  # GENERATED — 72 Cloudflare Pages 301 rules; edit REDIRECTS.md, not this
public/_headers    # the repo's own security headers + the report-only CSP (ADR 0004)
public/assets/live.js  # fleet live-kit browser behaviour (the switch, the card, the strip) — locked (§14)
.github/workflows/remind.yml  # the live-kit's weekly reminder — the repo's only workflow (§14)
REDIRECTS.md       # the old→new URL map the redirect generator implements
docs/              # README (the layer map — start there) · implementation-sprints (the sequenced plan)
                   # backlog · content-standards · schema-graph · keyword-map · business-facts
                   # agent-roster (routing) · owner-actions · audits/ · decisions/ (ADRs 0001–0004)
                   # event-taxonomy · rank-tracking · content-calendar · competitors
                   # cloudflare-runbook · gbp-runbook · growth-roadmap
                   # standards: seo-geo-aeo-strategy · eeat-and-trust · ux-cro-security
                   #   performance-guidelines · accessibility-and-i18n
                   #   mobile-ux-and-personalization · data-tracking-infrastructure
.claude/           # agents/ skills/ hooks/ rules/ workflows/ — see §13
```

**Planned, not built:** `lib/guides.ts` + `content/guides/*.ts` + `app/מדריכים/` (Phase 4,
[ADR 0002](docs/decisions/0002-guides-hub-route.md)); `lib/jsonld.ts` (Phase 2); `lib/authors.ts`
(Phase 6, an empty registry — no person is coming). `env-doctor.mjs` tracks them as "planned"; never
cite a line number in them.

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
        ▼
app/**/page.tsx  →  components/**
```

Rule of thumb: **identity and NAP go up the chain to the roster; wording goes in `lib/content.ts`;
article bodies go in `lib/posts.ts`; layout goes in components.** Copy never gets typed directly
into JSX.

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
  components small and leaf-level. Currently client: `Header`, `Faq`, `LeadForm`, `Reveal`. (The
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
- **JSON-LD** is built with `@ishub/site-kit/seo` — `localBusinessJsonLd`, `serviceJsonLd`,
  `faqJsonLd`, `breadcrumbJsonLd`, `jsonLdScript`; target graph [docs/schema-graph.md](docs/schema-graph.md).
  Blog posts emit `BlogPosting` inline with an `Organization` author and `dateModified` pinned to
  `date`. All 45 content pages emit JSON-LD and `PageHeader` emits `BreadcrumbList` on all 44 nested
  routes (mapping `{label, href}` → the kit's `{name, path}` — never add a second one); the remaining
  gap is substance: 18 locations + 8 statics carry **only** the breadcrumb, `#business` dangles on 18
  pages, no `WebSite`, raw Hebrew in `Service.url` / `mainEntityOfPage` (`node scripts/audit/schema.mjs`).
  `Review`/`AggregateRating` ship **only** when sourced, which today they are not.
- **Images:** there is **no `assets/` directory and no `image:optimize` script** on this site. Images
  ship pre-optimized in `public/`; the OG card comes from the `imgquarry.com` media host in the
  manifest. Every meaningful image needs a Hebrew `alt`; decorative gets `alt=""`.

---

## 9. Build gate

```
npm run audit:env   # step 0 — the environment's own self-test (citations, frontmatter, hooks, deny set)
npm run gate        # lint → typecheck → format:check → build → npm run audit
```

`npm run audit` refuses a stale `out/` — **rebuild before asserting** (backlog N12) — and exits with
the failure count. **Known-baseline rule:** until Phase 1 lands the bar is not "zero failures" but
"no failure absent from the latest `docs/audits/` report" — a change that adds one, or moves a number
the wrong way, does not ship. The `qa-build-gate` skill adds the auditor sweep and the stop-ship list.

Since 2026-10-12 `npm run build` also runs the fleet live-kit's gates (§14) through npm's `prebuild`
(after `gen-redirects`) and `postbuild`. They fail on unapproved live wording, so a draft builds
only as `LIVE_DRAFT=1 npm run build` — a local preview whose `out/` carries `out/.live-draft` and
must never be deployed (`ops/deploy-site.ps1` refuses it, `-DeployOnly` included).

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

**Redirects and headers — this repo owns both since 2026-09-06**
([ADR 0004](docs/decisions/0004-redirects-replace-stubs.md), commit `a0e0fe2`).

- **`public/_redirects`** carries **72 real 301 rules** that Cloudflare Pages issues at the edge —
  each of the 36 mapped legacy paths in both its slashed and bare form, both columns percent-encoded.
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

`node scripts/audit/edge.mjs` measures both — `redirectRules 72 · stubs 0 · redirectsFile true ·
headersFile true · deadHostArtifacts 0 · foreignStubs 0` as of 2026-09-06. **None of it is live
until the next deploy**; the acceptance test is the three-URL `301` probe in `deploy-dangates`.

---

## 11. Commands

| Task                  | Command                                                               |
| --------------------- | --------------------------------------------------------------------- |
| Dev server            | `npm run dev`                                                         |
| Production build      | `npm run build`                                                       |
| Lint                  | `npm run lint`                                                        |
| Type-check            | `npm run typecheck`                                                   |
| Format / check        | `npm run format` · `npm run format:check`                             |
| Audit the export      | `npm run audit` · `npm run audit -- --scope seo` (`--json`)           |
| Audit the environment | `npm run audit:env`                                                   |
| Full gate             | `npm run gate` (lint → typecheck → format:check → build → audit)      |
| Regenerate redirects  | `npm run redirects` (also runs on `prebuild`)                         |
| Live draft build      | `LIVE_DRAFT=1 npm run build` — local preview only, never deploy (§14) |
| Weekly reminder       | `npm run live:remind` (prints; pushes only with `NTFY_TOPIC`, §14)    |

---

## 12. Scope guardrails

- Implement real UI, sections, or content only when asked. Don't opportunistically redesign.
- Don't add a 19th location or an 8th service until the existing ones pass the doorway test in
  [docs/content-standards.md](docs/content-standards.md).
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
  carry many 🔶 claims (24/7, אחריות מלאה, ניסיון רב, פריסה ארצית, שירות מהיר), so the lines quote
  the blog's maintenance and troubleshooting advice — no price, warranty, speed, hours,
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
  mobile menu carries `data-live-block` (`Header.tsx`). The `--live-*` colours and the 992–1023px
  band override close `app/globals.css`: this site's mobile layout runs to 1023px (Tailwind `lg`),
  so in that band the bar follows the phone rule (closed on evergreen days, calm pages and the 404)
  and the card stops above the sticky call bar; the evergreen line shows from 1024px.
  `https://imgquarry.com` is in the report-only CSP `connect-src` (`public/_headers`).
- **Gates:** `prebuild` = `gen-redirects` → `check-live-copy` → `check-live-register` →
  `check-live-schedule`; `postbuild` = `check-live-out` (the built pages must carry exactly what the
  registers say). `scripts/audit/links.mjs` strips the bar and the card as chrome (they are on every
  page). The known baseline holds with them: 26 audit failures before and after (2026-10-12). The
  export grows by about 1.15 MB — ≈16.6 KB per HTML page and ≈7.8 KB per RSC payload, every line
  printed in both — inside `thresholds.json` → `maxOutBytes` (12 MB).
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
  upstream and re-synced (`live-kit.lock.json` → `cf3a5460aa8b`, clean). **Still open:** the blog
  posts' flagged claims (OK for now, fixed later — backlog §7.2) and the privacy page, which must
  mention the status-file read and the browser-storage values when it is rewritten (backlog §8.2).
- **Before the first deploy (owner, in the kit README's order):** add the three origins (apex, www, `.pages.dev`) to the status switch's CORS list — without it the
  switch is unreadable here and every seasonal line and the card stay off; widen the one shared GTM
  trigger `CE - popup events (3locksmiths)` to this hostname; `gh secret set NTFY_TOPIC -R
robiuzan/dangates.co.il`; then deploy (`deploy-dangates`, dry run first).
