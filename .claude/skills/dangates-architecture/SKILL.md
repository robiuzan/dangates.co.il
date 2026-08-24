---
name: dangates-architecture
description: Start-here orientation for dangates.co.il — the roster → site.config.json → lib/site-config.ts → lib/content.ts / lib/posts.ts → routes data flow, the file map, static-export constraints (no headers, redirects, middleware or API routes), the Hebrew dynamic-route matcher, the meta-refresh redirect stubs and their ADR 0004 replacement, the npm scripts including audit / audit:env / gate, the deploy truth, and the environment map (15 agents, 25 skills, 7 hooks, 4 rules, the audit scripts, the docs, /audit and /improve). Use at the start of any task in this repo, or when unsure where content, routes, metadata or business facts come from. Triggers: "where does X live", "how is this site built", "orient me", "architecture", "why is this not working in production", "איפה זה יושב", "איך האתר בנוי".
---

# dangates.co.il architecture

דן שערים חשמליים — electric gate repair and installation. Hebrew RTL marketing site, 45 indexable
pages, Next.js 14 App Router compiled to static HTML, Cloudflare Pages. Read this before changing
anything; the SessionStart hook (`.claude/hooks/session-context.ps1`) has already printed the backlog
order, the latest audit verdict and the two entry points — start from those.

## The stack, and what it forbids

Next **14.2** · React **18** · TypeScript strict + **`noUncheckedIndexedAccess`** · Tailwind **v4**
(CSS-first `@theme` in `app/globals.css` — **no `tailwind.config.ts`**) · `lucide-react` ·
`framer-motion` (imported nowhere, backlog §10.3) · `cn()` from `clsx` + `tailwind-merge` ·
`@ishub/site-kit` (vendored tarball of raw TS, hence `transpilePackages`). Flat layout, alias `@/*`.

`next.config.mjs`: `output: "export"` · `trailingSlash: true` · `images: { unoptimized: true }` ·
`transpilePackages: ["@ishub/site-kit"]`. The export **forbids** `headers()`, `redirects()`,
`rewrites()`, middleware, API routes, ISR and server actions. If a task seems to need one, the answer is at the edge (`public/_headers`,
`public/_redirects`, a zone rule) — never in Next.

> The comment at `next.config.mjs:6-7` claiming a "cPanel (websquadinc) docroot, served by Apache" is
> **stale and wrong** (backlog N7; `edge.mjs` warns). Production is Cloudflare Pages — `/deploy-dangates`.

## Data flow — the thing to internalise

```
Israeli services sites/roster/sites/dangates.json   ← EDIT HERE for NAP, brand, schema, analytics, images
        │  (ops sync)
        ▼
site.config.json          SiteManifest             ← NEVER edit directly (deny list + guard hook)
        │
        ▼
lib/site-config.ts        manifest · siteConfig · services[7] · locations[18] (slug, name only today)
        │                 telHref · whatsappHref() · locationsUpdated (:112 — one shared date)
        ├─► lib/content.ts   serviceCards · serviceMeta · differentiators · processSteps · trustStats
        │                    priceRows · faqs · reviews = [] + REVIEW_SOURCE_URL = null (gated, :242-248)
        │                    aboutValues · aboutSections · navItems
        ├─► lib/posts.ts     posts[11] on the flat PostBlock {type:"h"|"p"|"li"; text} (:9) — untrusted
        ▼
app/**/page.tsx  →  components/{ui,layout,marketing,forms}/**
```

**Identity and NAP go up to the roster. Wording goes in `lib/content.ts`. Article bodies go in
`lib/posts.ts`. Layout goes in components.** A phone number, city or service name typed into JSX is a
bug (`.claude/rules/content-data.md`, `rtl-markup.md`). The site has **no street address** — the
manifest carries none and `schema.areaServed` is `"מרכז הארץ ופריסה ארצית"`; do not invent one.

**The richer data model does not exist yet:** `kind` / `prefixed` / per-entry `updated` on locations,
`cityContent`, `serviceDepth` (Phase 3 — `/new-city`, `/new-service` are the spec); the typed block
model, `lib/guides.ts` + `content/guides/*.ts` (Phase 4 — ADR 0002/0003, `/new-guide`);
`lib/jsonld.ts` (Phase 2); `lib/authors.ts` (Phase 6). `env-doctor.mjs` tracks them as "planned";
never cite a line number in them.

## Routes — 45 URLs in the sitemap

| Route                                                                                             | Source                            | Count |
| ------------------------------------------------------------------------------------------------- | --------------------------------- | ----- |
| `/`                                                                                               | `app/page.tsx`                    | 1     |
| `/שירותים/` `/איזורי-שירות/` `/מחירון/` `/אודות/` `/צור-קשר/` `/מדיניות-פרטיות/` `/הצהרת-נגישות/` | Hebrew-named dirs under `app/`    | 7     |
| `/services/{slug}/`                                                                               | `app/services/[service]/page.tsx` | 7     |
| `/locations/{slug}/`                                                                              | `app/locations/[city]/page.tsx`   | 18    |
| `/blog/` · `/blog/{slug}/`                                                                        | `app/blog/page.tsx` · `[slug]/`   | 1+11  |
| **Planned:** `/מדריכים/` + `/מדריכים/[slug]/` (Phase 4, ADR 0002) · `/תודה/` (Phase 5, §8.3)      | not built                         | —     |

The taxonomy is mixed — pure Hebrew top-level paths, English container segments with Hebrew slugs for
the three silos. It is the live URL scheme and it stays. `/איזורי-שירות/` would spell correctly as
`אזורי`; it is the **live** slug (golden rule 3) — not a cleanup task.

`app/sitemap.ts:32-43` is a hand-maintained `staticPages` list (§1.4): Phase 1 derives it from a
`staticRoutes` const, Phase 4 adds the guides registry, so a new route cannot be silently absent.

## The Hebrew dynamic-route trap

Params arrive **percent-encoded** during static export. Both silo routes match with
`decodeURIComponent(param).normalize("NFC")` (`app/services/[service]/page.tsx:27`,
`app/locations/[city]/page.tsx:18`) — copy that line. A new Hebrew dynamic route that skips `decodeURIComponent` + `normalize("NFC")` **works in dev and
404s in production**. The same concern drives `app/sitemap.ts` (`encodeURI`, so `<loc>` equals the
canonical byte for byte) and the schema `url` fields (`/schema-structured-data`, §4.7).

## Redirects — 37 meta-refresh stubs today, `_redirects` in Phase 1

There is **no `public/_redirects`** yet. `scripts/gen-redirects.mjs` emits a stub at
`public/<old-path>/index.html` for each row of `REDIRECTS.md`; Next copies `public/` into `out/`. The
stubs are protected generated output — edit the map, then rerun the generator. They were a GitHub
Pages workaround; on Cloudflare Pages a real `public/_redirects` issues 301s, keeps the query string
(§13.3) and passes full equity. **ADR 0004** replaces them — same map, percent-encoded, stub
directories deleted in the same commit, `deploy.yml` / `CNAME` / `.htaccess` retired, the Houston
stub (N4) dropped. Procedure: `/web-security-headers`; proof: `edge.mjs`.

## What `@ishub/site-kit` gives you

| Subpath        | Symbols                                                                                 | Used here                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `./contact`    | `telHref`, `whatsappHref`, `phoneDisplay`                                               | yes                                                                                                                                           |
| `./seo`        | `localBusinessJsonLd`, `serviceJsonLd`, `faqJsonLd`, `breadcrumbJsonLd`, `jsonLdScript` | yes — `PageHeader` maps `{label, href}` → the kit's `{name, path}` and emits `BreadcrumbList` on all 44 nested routes; never add a second one |
| `./analytics`  | `gtmHeadSnippet`, `gtmNoScriptSrc`, `trackEvent`                                        | yes — rendered in `<body>` at `app/layout.tsx:69-70` (§13.1 open)                                                                             |
| `./media`      | `mediaUrl`, `srcsetFor`, `ogImageMeta`, `preloadPropsFor`                               | only `ogImageMeta`                                                                                                                            |
| `./components` | `SiteImage` (Cloudflare `/cdn-cgi/image` srcset, compile-time `alt`)                    | **unused** — zero `<img>` sitewide; `/site-images` when photos land                                                                           |

Schema reality (`node scripts/audit/schema.mjs`): all 45 content pages emit JSON-LD, but 18 locations
and 8 static pages carry **only** the breadcrumb, `#business` dangles on 7 services + 11 posts, there
is no `WebSite`, and `Service.url` / `mainEntityOfPage` carry raw Hebrew. Blog posts build
`BlogPosting` inline in `app/blog/[slug]/page.tsx`. Target graph: `docs/schema-graph.md`.

## Commands

| Task                                | Command                                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ | ------- | --- | -------- | ---- | -------------- |
| Dev · build · lint · types · format | `npm run dev` · `build` · `lint` · `typecheck` · `format` / `format:check`                                        |
| Clean rebuild                       | `node -e "require('fs').rmSync('.next',{recursive:true,force:true})" && npm run build` (`rm -rf` is hook-blocked) |
| Audit the export                    | `npm run audit` · `npm run audit -- --scope seo                                                                   | schema | content | cro | security | perf | a11y`·`--json` |
| Audit the environment               | `npm run audit:env` (dead citations, frontmatter, hooks, deny set, roster parity)                                 |
| Full gate                           | `npm run gate` — lint → typecheck → format:check → build → audit                                                  |
| Regenerate redirects                | `node scripts/gen-redirects.mjs`                                                                                  |

`npm run audit` refuses a stale `out/` (N12) and exits with the failure count. Until Phase 1 lands the
bar is **no failure absent from the latest `docs/audits/` report** — the known-baseline table lives in
`/qa-build-gate`. There is **no `image:optimize` script and no `assets/` directory** on this site.

## Environment map — `.claude/` and `docs/`

Three asset kinds, three jobs: **agents** carry judgment (read-only unless the roster says writer),
**skills** carry procedure, **scripts** carry measurement — and when a skill and an agent disagree,
the script decides. `docs/agent-roster.md` is the routing table (backlog § → skill → writer →
reviewer → proof script); `npm run audit:env` checks every name below exists.

- **Agents (15, `.claude/agents/`)** — auditors: `seo-auditor`, `schema-auditor`, `local-seo-strategist`,
  `aeo-geo-strategist`, `eeat-trust-auditor`, `perf-a11y-auditor`, `security-auditor`,
  `ts-react-reviewer`, `cro-engagement-auditor`; reviewers: `hebrew-editor`, `claims-verifier`,
  `article-auditor`; docs-only editor: `keyword-researcher`; writers: `hebrew-copywriter`,
  `rtl-frontend-engineer`. Writers hand copy to `hebrew-editor` → `claims-verifier` and markup to
  `ts-react-reviewer`; nobody self-reviews.
- **Skills (25, `.claude/skills/`)** — commands: `/audit [scope]`, `/improve <id>`, `/new-guide`;
  gates: `qa-build-gate`, `deploy-dangates`; orientation: this one; page families: `new-city`,
  `new-service`, `new-article`, `content-hub`, `internal-linking`; SEO/schema: `seo-metadata`,
  `schema-structured-data`, `local-seo-il`, `aeo-answer-content`, `keyword-research`, `eeat-build`;
  UX/CRO: `conversion-cro`, `engagement-ux`, `tracking-analytics`, `site-images`; quality:
  `hebrew-rtl` (mandatory), `responsive-accessibility`, `performance-web-vitals`, `web-security-headers`.
- **Hooks (7, `.claude/hooks/`)** — PreToolUse: `guard-protected-paths.ps1`, `secret-scan.ps1`
  (Edit/Write), `guard-destructive-ops.ps1` (Bash/PowerShell); PostToolUse: `post-edit-lint.ps1`,
  `audit-logger.ps1`; SessionStart: `session-context.ps1`; Stop: `format-changed.ps1`.
- **Rules (4, `.claude/rules/`)** — `protected-files.md` (always), `rtl-markup.md` (`*.tsx` under
  `app/`, `components/`), `content-data.md` (`lib/content.ts`, `lib/posts.ts`, `lib/site-config.ts`,
  `content/**`), `schema-jsonld.md` (`app/**/page.tsx`, `PageHeader.tsx`, `lib/jsonld.ts`).
- **Scripts (`scripts/audit/`)** — `run-all.mjs` + `titles`, `links`, `content-depth`, `schema`,
  `cta-coverage`, `claims-grep`, `spam-grep`, `rtl-lint`, `a11y`, `perf`, `edge`, `env-doctor`,
  `gsc-ingest`; `thresholds.json`, `claims.json`. Roster §4 maps scope → script.
- **Workflow** — `.claude/workflows/site-audit.js` (`/site-audit`), the deterministic engine behind `/audit`.
- **Docs** — `optimization-backlog.md` (the work, with statuses) · `agent-roster.md` ·
  `content-standards.md` · `keyword-map.md` · `schema-graph.md` · `business-facts.md` (the one file
  an agent may not fill in) · `owner-actions.md` · `event-taxonomy.md` · `rank-tracking.md` ·
  `content-calendar.md` · `competitors.md` · `growth-roadmap.md` · the Cloudflare and GBP runbooks ·
  `audits/` (dated `/audit` reports) · `decisions/` (ADRs 0001–0004).
- **Entry points** — `/audit [scope]`: rebuild → `npm run audit` → auditors in parallel → dated
  report → backlog statuses. `/improve <id>`: route via the roster → implement → `npm run gate` →
  reviewers → backlog row. Neither deploys.

## Protected paths — enforced, not advisory

`site.config.json` · `out/` · `out.prev/` · `.next/` · `vendor/` · `node_modules/` ·
`public/**/index.html` are denied for Edit/Write (settings deny list + `guard-protected-paths.ps1`);
force-push, `reset --hard`, `git clean`, `rm -rf`, deploys and Cloudflare calls are blocked without
`-DryRun` or `-Confirm` + `# APPROVED:`. A block points at the real source: `.claude/rules/protected-files.md`.

## Deploy, and where to go next

**Cloudflare Pages, direct upload via wrangler** (`ops/deploy-site.ps1 -DryRun`, then `-Confirm` with
the approval marker — `/deploy-dangates`). `.github/workflows/deploy.yml` publishes to GitHub Pages,
which no longer serves this domain. Zone settings are owner-only (`docs/owner-actions.md` §1,
`docs/cloudflare-runbook.md`). Backlog id in hand → `/improve <id>`; no id → `docs/agent-roster.md`
§3 "ask → route"; writing markup → `/hebrew-rtl` first, always; shipping → `/qa-build-gate` then
`/deploy-dangates`.
