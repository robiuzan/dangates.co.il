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
4. **Pushing to `main` does not deploy production.** It publishes to GitHub Pages, which no longer
   serves this domain. Production is `wrangler` direct-upload to Cloudflare Pages — see §10.
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
   `out.prev/`, and the 37 generated stubs under `public/` (regenerate them via
   `node scripts/gen-redirects.mjs` instead). _Hook-enforced:_ every one of those paths is in the
   `permissions.deny` list and `guard-protected-paths.ps1`.
10. **Don't put PII in `dataLayer`.**
11. **Numbers come from `scripts/audit/`; citations must resolve.** Never quote a count from prose or
    memory — run the script (`npm run audit`, or the check named in [docs/agent-roster.md](docs/agent-roster.md)
    §4) and say "as of <date>". Every `file:line` must point at what it names — `npm run audit:env`
    fails on a dead one; cite a function or identifier where a line number would go stale.

---

## 3. Stack

Next.js **14.2** App Router · React **18** · TypeScript strict (**`noUncheckedIndexedAccess` is on**) ·
Tailwind **v4** (CSS-first `@theme` in `app/globals.css` — there is no `tailwind.config.ts`) ·
`lucide-react` · `framer-motion` · `clsx` + `tailwind-merge` via `cn()` · `@ishub/site-kit` (vendored
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

> The comment in `next.config.mjs` saying the deploy target is "the cPanel (websquadinc) docroot,
> served by Apache" is **stale and wrong** — see §10 (backlog N7; `edge.mjs` warns on it).

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
lib/
  site-config.ts   # ⭐ NAP, services[7], locations[18], telHref, whatsappHref
  content.ts       # ⭐ all Hebrew marketing copy; reviews = [] (gated)
  posts.ts         # ⭐ 11 migrated blog posts (untrusted — see golden rule 7)
  utils.ts         # cn()
scripts/gen-redirects.mjs   # emits the 37 meta-refresh stubs into public/
scripts/audit/     # ⭐ the measurements (12 checks + thresholds.json + claims.json) — roster §4
site.config.json   # SiteManifest — SYNCED FROM THE ROSTER, do not edit here
REDIRECTS.md       # the old→new URL map the stub generator implements
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
  components small and leaf-level. Currently client: `Header`, `Faq`, `LeadForm`, `Reveal`.
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

---

## 10. Deploy — read this before shipping

**Production is Cloudflare Pages, direct upload via wrangler.** `.github/workflows/deploy.yml` still
publishes to **GitHub Pages** on every push to `main` — a real deployment that nobody sees, because the
domain no longer resolves there. `public/CNAME` is its dead companion.

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

**Redirects and headers.** No `public/_redirects` or `public/_headers` yet. The 37 legacy URLs redirect
via generated meta-refresh stubs (`node scripts/gen-redirects.mjs`, map in `REDIRECTS.md`) — a GitHub
Pages workaround Phase 1 replaces per [ADR 0004](docs/decisions/0004-redirects-replace-stubs.md). The
live security headers (HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`) come from **Cloudflare zone rules, not this repo**; there is no CSP.
`node scripts/audit/edge.mjs` measures both.

---

## 11. Commands

| Task                  | Command                                                          |
| --------------------- | ---------------------------------------------------------------- |
| Dev server            | `npm run dev`                                                    |
| Production build      | `npm run build`                                                  |
| Lint                  | `npm run lint`                                                   |
| Type-check            | `npm run typecheck`                                              |
| Format / check        | `npm run format` · `npm run format:check`                        |
| Audit the export      | `npm run audit` · `npm run audit -- --scope seo` (`--json`)      |
| Audit the environment | `npm run audit:env`                                              |
| Full gate             | `npm run gate` (lint → typecheck → format:check → build → audit) |
| Regenerate redirects  | `node scripts/gen-redirects.mjs`                                 |

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
