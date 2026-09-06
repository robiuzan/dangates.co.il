# Implementation sprints — the execution plan

> **Layer:** operations. This is the **sequenced plan** that turns the standards docs into shipped
> changes. [growth-roadmap.md](growth-roadmap.md) is the strategy; [optimization-backlog.md](optimization-backlog.md)
> is the numbered defect list. This file decides **what order, and why that order.** The `sprint`
> skill executes one sprint of it; `/improve <id>` closes one row; `/audit <scope>` proves the exit.
> Reads with: [agent-roster.md](agent-roster.md), [owner-actions.md](owner-actions.md),
> [business-facts.md](business-facts.md), [content-calendar.md](content-calendar.md).
>
> Every task cites its backlog id (`§3.5`, `N8`) and its standard (`eeat-and-trust §1.4`). Nothing
> here invents a new numbering scheme. Written 2026-09-06.

---

## 0. Live verification — 2026-09-06

**The live site was probed rather than the backlog trusted.** The finding that outranks every
other: **the ten fabricated reviews were live on the domain until 11:06 UTC that day** — gone from the repo since 2026-08-17, while the previous deploy in `Israeli services sites/logs/deploys.csv` was 2026-08-03. Sprint 0 shipped the same afternoon on the owner's word; the table records the state it replaced.

| Item                   | Recorded                             | Live reality (curl, 2026-09-06)                                                                                                                                                                                                                                                                              |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Phase 0 deploy         | growth-roadmap §2: "built, waiting"  | **Was not live** (homepage served ten `Review` nodes and `aggregateRating`, a doubled location title, `BreadcrumbList` 0, plain two-line `robots.txt`). **Deployed 2026-09-06 11:06 UTC** — probe: `aggregateRating` 0, titles single-brand, `BreadcrumbList` present, per-bot `robots.txt` live, sitemap 45 |
| §6.1 AI crawlers       | 403 at the edge (2026-08-23)         | **200** for ClaudeBot, OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, Perplexity-User, `CCBot/2.0`, Googlebot and bingbot on the full-UA probe. Backlog §6.1 ✅ owner 2026-09-06; owner-actions 1.1 ✅; business-facts §H row ✅ (the owner delegated the flip). Can revert with no repo change         |
| §12.1 security headers | "from a zone rule nobody documented" | Confirmed from the zone: `Strict-Transport-Security: max-age=15552000`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), microphone=(), camera=()`. No CSP. `public/_headers` absent               |
| §1.7 `www`             | 200 duplicate                        | Still 200, no redirect                                                                                                                                                                                                                                                                                       |
| §1.1 legacy URLs       | 37 meta-refresh stubs                | `/חולון/` → 200 (stub), not 301                                                                                                                                                                                                                                                                              |
| §6.5 `llms.txt`        | absent                               | 404                                                                                                                                                                                                                                                                                                          |
| GTM `GTM-KWGGH438`     | must be 200-checked (golden rule 8)  | `gtm.js?id=GTM-KWGGH438` → 200                                                                                                                                                                                                                                                                               |
| GA4 · Search Console   | `null` · `null`                      | Still null (owner-actions 2.3, 2.4); `app/layout.tsx` reads `analytics.googleSiteVerification` since `c047d4d` (row 1.5) and emits nothing while it is null                                                                                                                                                  |
| §1.4 `staticRoutes`    | NOT STARTED → ✅ 2026-09-06          | Was a literal inside `app/sitemap.ts` at probe time; **closed the same day** by commit `c047d4d` on branch `sitemap-static-routes-registry` (a peer session's work; rows 1.4–1.5) — registry + `links.mjs` cross-check verified after a clean rebuild; not deployed yet                                      |
| Environment            | —                                    | `node scripts/audit/env-doctor.mjs`: 0 dead citations, 2 planned-path warnings                                                                                                                                                                                                                               |

Repo-side numbers below are as of 2026-08-24 ([audits/2026-08-24-full.md](audits/2026-08-24-full.md), exit 37) unless dated later; re-run before quoting.

### 0.1 The owner's framing, mapped

| Owner's sprint                       | Here                                                              |
| ------------------------------------ | ----------------------------------------------------------------- |
| "Sprint 1 — Technical SEO & Schema"  | Sprints 1–2                                                       |
| "Sprint 2 — Content & AEO structure" | Sprints 4–7                                                       |
| "Sprint 3 — UX & Performance"        | Sprint 3, plus the perf items folded into Sprint 1 (§10.1, §10.3) |

---

## 1. Sequencing principles

1. **Ship what is already built and verified before building more.** The reviews are a Google
   policy risk every day they stay live (CLAUDE.md golden rule 1). Sprint 0 is a deploy, not code.
2. **Fix what is actively misleading before what is merely missing.** Four unconfirmed claims render
   168 times on 42 pages, eight of nine prices are authored, and the footer contradicts the CTA in one
   viewport (as of 2026-08-24) — eeat-and-trust §1 outranks a font preload.
3. **Unblock measurement early, but do not wait for it.** GA4 and Search Console are owner-blocked
   (owner-actions 2.3, 2.4); Track B starts on day one, and everything measurable in-repo —
   `data-cta`, event dimensions, `/תודה/` — ships regardless (data-tracking-infrastructure §2).
4. **Content depth is the long pole and the ranking decision.** §3.1 / §3.2 decide whether the
   domain ranks at all (content-standards §2). Start by Sprint 4, run in parallel, expect it to span
   sprints. No 19th city and no 8th service until the doorway test passes (CLAUDE.md §12).
5. **Mechanism before copy.** Move copy out of route files (N13) before softening claims (§7.2), so
   the truth pass is one edit per claim instead of a hunt across nine files.

---

## 2. Sprint 0 — Ship Phase 0 and true up the state (½ day)

**Goal:** the live domain matches `main`. **Blocked on:** the owner's go-ahead (Track B, B0).

| #   | Task                                                                                                                                                                                                                                                                                                        | Backlog               | Standard                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------ |
| 0.1 | ✅ 2026-09-06 — `deploy-dangates`: dry run → the owner's word → `-Confirm` with `# APPROVED: <reason>` on the same command. No other path deploys this domain (CLAUDE.md §10)                                                                                                                               | §0                    | qa-build-gate · deploy-dangates            |
| 0.2 | ✅ 2026-09-06 — Post-deploy: cloudflare-runbook "One-shot verification", plus homepage `aggregateRating` count 0, one location title carrying the brand once, `BreadcrumbList` on 44 pages, `robots.txt` showing the per-bot list — verification of three ✅ DONE items against the live response, not work | verify §7.1 §2.1 §4.3 | cloudflare-runbook "After the next deploy" |
| 0.3 | ✅ 2026-09-06 — committed on `main`: today's docs batch (the seven standards docs, this file, the `sprint` skill, and the backlog, owner-doc, skill, agent and `edge.mjs` updates now in the working tree)                                                                                                  | §15.1                 | agent-roster §6                            |
| 0.4 | ✅ 2026-09-06 — the owner delegated the flip; the business-facts §H crawler row is ✅ (closes N18)                                                                                                                                                                                                          | N18                   | eeat-and-trust §1.1                        |

**Exit — met 2026-09-06 (11:06 UTC):** the live homepage carries no `Review`; `grep -c aggregateRating` on the live HTML → 0; sitemap 45; per-bot `robots.txt` live; `BreadcrumbList` present; AI crawlers 200. 0.3 and 0.4 closed 2026-09-06: the batch is committed on `main` (fast-forwarded to `c047d4d` first) and the §H row is ✅.

---

## 3. Sprint 1 — Edge, technical SEO and tracking foundations (Phase 1; 2–3 days)

**Goal:** the edge posture is version-controlled, every legacy URL is a real 301, every CTA is countable. Writer rtl-frontend-engineer; reviewers seo-auditor, security-auditor.

| #    | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Backlog                  | Standard                                                 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------------------- |
| 1.1  | `public/_redirects` from the `REDIRECTS.md` map, both columns percent-encoded; **delete the 37 stub directories in the same change**; drop the Houston stub; the generator, wired into an npm script until then, retires with them                                                                                                                                                                                                                                   | §1.1 §13.3 N4 §1.6       | ux-cro-security §4.4 · ADR 0004                          |
| 1.2  | Retire `.github/workflows/deploy.yml`, `public/CNAME`, `public/.htaccess`; fix the cPanel comment in `next.config.mjs`                                                                                                                                                                                                                                                                                                                                               | §12.4 N5 N7              | ux-cro-security §4.4                                     |
| 1.3  | `public/_headers` from the `web-security-headers` template: the five zone headers adopted, no `preload`, no `includeSubDomains`, `/_next/static/*` immutable, CSP **report-only** (enforcing waits for the stubs to be gone — 1.1). Two deliberate deltas from the live zone values in §0: HSTS a year instead of 180 d, and the template's wider `Permissions-Policy`                                                                                               | §12.1 §12.2              | ux-cro-security §4.2, §4.3 · performance-guidelines §5.2 |
| 1.4  | ✅ 2026-09-06 (commit `c047d4d`, session dangates-co-il-f6) — `staticPages` registry in `lib/site-config.ts` with the `noindex` flag; `app/sitemap.ts` derives from it; `links.mjs` cross-checks both ways and asserts `<lastmod>` validity. Verified after a clean rebuild: `node scripts/audit/links.mjs` → `staticRoutesRegistered 9`, 45 = 45, 0 orphans; sitemap byte-identical; not deployed yet. `/תודה/` (Sprint 3.8) joins this registry, never the sitemap | §1.4                     | seo-geo-aeo-strategy §1 · seo-metadata                   |
| 1.5  | ✅ 2026-09-06 (commit `c047d4d`) — `verification.google` emitted from `analytics.googleSiteVerification` in `app/layout.tsx`, the **repo half** of §13.7; renders nothing while the roster value is `null`, and the token itself is B1. A `new` row for the `sprint` loop, not a §13.7 run                                                                                                                                                                           | new (repo half of §13.7) | data-tracking-infrastructure §4                          |
| 1.6  | `og:url` on all 45 pages via the layout `openGraph` block                                                                                                                                                                                                                                                                                                                                                                                                            | §1.5                     | seo-metadata                                             |
| 1.7  | GTM init script from `<body>` to `<head>`; `<noscript>` stays in `<body>`; 200-check the loader after (§13.6 is the standing rule, re-run, not work)                                                                                                                                                                                                                                                                                                                 | §13.1                    | data-tracking-infrastructure §3                          |
| 1.8  | `data-cta` on every tel, WhatsApp, mailto and submit — 24 missing as of 2026-08-24 — `{placement}-{action}` naming                                                                                                                                                                                                                                                                                                                                                   | §13.2                    | ux-cro-security §1.4 · data-tracking-infrastructure §2.2 |
| 1.9  | Preload the two `.p.woff2` faces (hebrew, latin) and only those, after a clean rebuild; `npm uninstall framer-motion`                                                                                                                                                                                                                                                                                                                                                | §10.1 §10.3              | performance-guidelines §4, §2.3                          |
| 1.10 | Per-service `triggers` into `lib/content.ts` — the shutters page stops saying "השער נתקע"                                                                                                                                                                                                                                                                                                                                                                            | §3.3                     | eeat-and-trust §3.3                                      |
| 1.11 | Copy and the phone literal out of route files into `lib/content.ts` / `siteConfig` — the mechanism Sprint 4 depends on                                                                                                                                                                                                                                                                                                                                               | N13                      | CLAUDE.md §5 · content-standards §4                      |
| 1.12 | The lead form's delivery-failure state renders a `role="alert"` block with a WhatsApp **link** and a `tel:` link — small P1, not left for Sprint 3                                                                                                                                                                                                                                                                                                                   | N1 §8.6                  | ux-cro-security §2.2 row 1                               |
| 1.13 | `.env.example` both ways; footer year derived at build; trailing slash on `navItems` and crumb hrefs                                                                                                                                                                                                                                                                                                                                                                 | N6 §12.3 N9 N10          | ux-cro-security §4.6 · seo-metadata                      |

**Exit:** `edge.mjs` → `stubs 0 · redirectsFile true · headersFile true · deadHostArtifacts 0 ·
foreignStubs 0`; `titles.mjs` → `ogUrlMissing 0`; `cta-coverage.mjs` 0 missing; `perf.mjs` preloads
present, `unusedDeps []`; gate with no regression; deploy on the owner's word; then three legacy
URLs live return `301` + `Location` with `?utm_source=test` intact, and the owner deletes the zone
header rule (B7) once `_headers` is verified live.

---

## 4. Sprint 2 — Schema and entity (Phase 2; 2 days)

**Goal:** one business entity Google can read on every page. Builder file `lib/jsonld.ts` from the
`schema-structured-data` template (planned until this sprint). Reviewer schema-auditor.

| #    | Task                                                                                                                                                                               | Backlog | Standard                                      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------- |
| 2.1  | `lib/jsonld.ts` — `websiteJsonLd`, `locationServiceJsonLd`, `itemListJsonLd`, `articleJsonLd`; one `@graph` per page, one script tag                                               | §4.6    | schema-graph §8 · schema-structured-data      |
| 2.2  | The `#business` node defined on every page that references it — 18 dangling today                                                                                                  | §4.4    | schema-graph §1, §3 · seo-geo-aeo-strategy §5 |
| 2.3  | `WebSite` `#website` on the homepage, `publisher → #business`                                                                                                                      | §4.9    | schema-graph §2                               |
| 2.4  | Percent-encode `Service.url` and `BlogPosting.mainEntityOfPage` so every schema URL byte-matches its canonical                                                                     | §4.7 N2 | schema-graph §1                               |
| 2.5  | `areaServed` as `City` / `AdministrativeArea` nodes from `locations`, not the marketing phrase — the schema half of the owner-blocked §5.4; the manifest phrase itself is B5 (3.5) | §4.8    | schema-graph §3 · seo-geo-aeo-strategy §3.1   |
| 2.6  | `logo` and `image` on the business node — `public/dangates-logo.png` and the manifest OG card                                                                                      | §4.5    | seo-geo-aeo-strategy §5                       |
| 2.7  | `BlogPosting` polish: `dateModified` from `updated`, `@id`, `isPartOf`, trailing slash on `url`                                                                                    | §4.12   | schema-graph §6 · eeat-and-trust §3.4         |
| 2.8  | `Service` with `areaServed` on the 18 locations; `CollectionPage` / `AboutPage` / `ContactPage` on the 8 statics                                                                   | §4.2    | schema-graph §2, §5                           |
| 2.9  | The unblocked half of §4.10: `hasOfferCatalog` naming the 7 services, **no prices, no `Offer`**                                                                                    | §4.10   | schema-graph §4                               |
| 2.10 | `lib/authors.ts` as an empty registry with the data-only path; `AboutPage` with `knowsAbout` on `/אודות/`                                                                          | §7.4    | eeat-and-trust §3.1, §3.2                     |
| 2.11 | Narrow the manifest at the boundary instead of `as unknown as SiteManifest`                                                                                                        | N16     | CLAUDE.md §7                                  |

**Exit:** `schema.mjs` 0 (`danglingIds 0`, `rawHebrewUrls 0`, no `Review` / `AggregateRating` /
`Offer` / `Person`); Rich Results Test on one route per type — the missing-address error is expected
and stays (§4.11 HOLDS); schema-auditor green.

---

## 5. Sprint 3 — Accessibility, the form and conversion plumbing (Phases 1 + 5; 2–3 days)

**Goal:** the accessibility statement is true and the form stops losing leads. Reviewers cro-engagement-auditor, perf-a11y-auditor, ts-react-reviewer.

| #    | Task                                                                                                                                                                                                                                                                       | Backlog     | Standard                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| 3.1  | Hover to `accent-500`; a `@theme` token pair for the WhatsApp surface replacing the `#25D366` literal                                                                                                                                                                      | §11.1 N11   | accessibility-and-i18n §3 · mobile-ux-and-personalization §3           |
| 3.2  | `Reveal` never sits between `<ol>` and `<li>`; the TrustBar `sr-only` duplication removed                                                                                                                                                                                  | §11.2 §11.3 | accessibility-and-i18n §3 · performance-guidelines §2.1                |
| 3.3  | Split `Header` into a server shell and a `MobileMenu` leaf: `id` + `aria-controls`, Escape, focus trap, scroll lock                                                                                                                                                        | §11.4 §10.2 | accessibility-and-i18n §3 · performance-guidelines §2                  |
| 3.4  | The three `text-right` utilities → `text-end`; the 8 hex literals → tokens                                                                                                                                                                                                 | §11.5       | hebrew-rtl · accessibility-and-i18n §4                                 |
| 3.5  | Per-field validation: `aria-invalid`, `aria-describedby`, focus to the first invalid field, an Israeli phone pattern that accepts `072-` landlines                                                                                                                         | §8.1        | ux-cro-security §2.2 rows 2–3                                          |
| 3.6  | Consent line beside the button; `/מדיניות-פרטיות/` names Web3Forms and GTM / GA4 (hebrew-copywriter → hebrew-editor → claims-verifier)                                                                                                                                     | §8.2        | ux-cro-security §2.2 row 4, §4.5 · data-tracking-infrastructure §6     |
| 3.7  | Optional `city` `<select>` from `locations`; delete the dead `types/index.d.ts`                                                                                                                                                                                            | §8.4 N3     | ux-cro-security §2.2 row 5                                             |
| 3.8  | `app/תודה/` — registered `noindex` in the Sprint 1.4 `staticRoutes` registry and excluded from the sitemap (`links.mjs` exempts registry `noindex` entries from parity and the orphan check), a `tel:` link, `thanks-*` CTAs; the form navigates there after `lead_submit` | §8.3        | ux-cro-security §2.2 row 6                                             |
| 3.9  | `lead_submit` with `page`, `service`, `city`, `placement`, `site`; `form_start`, `form_submit_attempt`, `lead_error` — never PII                                                                                                                                           | §13.4 §13.5 | event-taxonomy "Conversion events" · data-tracking-infrastructure §2.1 |
| 3.10 | A call / WhatsApp CTA inside `<main>` on `/מחירון/`                                                                                                                                                                                                                        | §8.5        | ux-cro-security §1.3                                                   |
| 3.11 | `Faq` → `<details>/<summary>` from the `engagement-ux` template — answers in the DOM, zero client JS                                                                                                                                                                       | N8 §10.2    | performance-guidelines §2.2                                            |
| 3.12 | Both `window.open` WhatsApp paths become real links (§13.2); a skip link to `#main` and `Button size="lg"` for every tap-first action on a phone — no backlog row yet (accessibility-and-i18n §2 files them under §11), so a `new` row that adds one                       | §13.2 · new | mobile-ux-and-personalization §3 rules 3–4 · accessibility-and-i18n §3 |

**Exit:** `a11y.mjs` 0, `rtl-lint.mjs` 0, `cta-coverage.mjs` 0; `perf.mjs` `clientComponents` 3
(`Faq` gone, `Header` replaced by the `MobileMenu` leaf; `LeadForm` and `Reveal` stay) with the
`rtl-lint.mjs` ledger updated in the same change; `/הצהרת-נגישות/` true against
accessibility-and-i18n §2; all three reviewers green.

---

## 6. Sprint 4 — The truth pass: claims, pricing pivot, homepage (Phase 6 copy; 2–3 days)

**Goal:** nothing on the site promises what the owner has not confirmed. hebrew-copywriter → hebrew-editor → claims-verifier; a live 🔶 / ⛔ claim is stop-ship. Runs after N13 (Sprint 1.11).

| #   | Task                                                                                                                                                                                                                                                                                  | Backlog        | Standard                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------ |
| 4.1 | Soften sitewide, one edit per claim: "אחריות מלאה" → "אחריות על העבודה"; "ניסיון רב שנים" → mechanism depth; "24/7" bounded to `siteConfig.hours`; "פריסה ארצית" → the 18 published areas. This is the copy half of the owner-blocked §5.4 — the manifest `areaServed` value stays B5 | §7.2           | eeat-and-trust §1.4                                          |
| 4.2 | `/מחירון/` becomes "what determines the price" — fault type, gate weight and width, motor class, motor reuse, access and cabling, whether the visit fee is credited; the ₪150–350 band stays marked to confirm. N14 resolves the owner-blocked §7.3 by pivot, not by prices           | N14 §3.13      | keyword-map §10 · eeat-and-trust §5.1 · content-standards §3 |
| 4.3 | Homepage FAQ: real answers (the contact one names the number), `moreAt` link-outs, one Q/A per `FAQPage` sitewide                                                                                                                                                                     | §3.5 §4.13     | content-standards §5 · seo-geo-aeo-strategy §4.3             |
| 4.4 | Homepage answer block under the H1 and the fault / price mechanism copy — back over the 800-word floor with substance, not restored volume                                                                                                                                            | §3.13 §6.2     | content-standards §1, §5                                     |
| 4.5 | A transparency surface: complaints and cancellation channel on the existing phone, WhatsApp and email; the ח.פ. stays 🔶                                                                                                                                                              | N15            | eeat-and-trust §5.1                                          |
| 4.6 | Hours vs CTA: footer, `/צור-קשר/`, `FinalCta`, `TrustBar` and `openingHoursSpecification` agree; if owner-actions 3.5 is unanswered the CTA stops promising 24/7                                                                                                                      | §7.6           | eeat-and-trust §5.1 · business-facts §E                      |
| 4.7 | Descriptions to 120–160 chars with terminal punctuation: 5 services, 2 locations, 2 legal statics, the blog index; blog titles under 60                                                                                                                                               | §2.4 §2.5 §2.6 | keyword-map §5 · seo-metadata                                |
| 4.8 | Blog debris: the empty `מקרי מבחן` section, the 4 curly quotes, the two superlatives                                                                                                                                                                                                  | §3.11 §3.12    | content-standards §7, §9                                     |

**Exit:** `claims-grep.mjs` 0; `content-depth.mjs` home ≥ 800; `titles.mjs` description warnings 0;
`spam-grep.mjs` `curlyQuotes 0`; eeat-trust-auditor green.

---

## 7. Sprint 5 — Content depth I: services (Phase 3; 3–5 days)

**Goal:** the 7 service pages differentiate on the mechanics of each gate type. `new-service`; hebrew-copywriter → hebrew-editor → claims-verifier; proof `content-depth.mjs`.

| #   | Task                                                                                                                                                                  | Backlog | Standard                                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------- |
| 5.1 | `serviceDepth` per service: ≥ 450 unique words, mechanism per gate type, the 230V boundary, caveats — `תריסי גלילה חשמליים` is not a gate and gets its own copy       | §3.2    | content-standards §1, §3 · eeat-and-trust §3.3 |
| 5.2 | An answer block first on all 7 (40–60 words)                                                                                                                          | §6.2    | content-standards §5                           |
| 5.3 | Per-service FAQ rendered and marked up — one question per `FAQPage`, unique sitewide                                                                                  | §4.13   | seo-geo-aeo-strategy §4.3                      |
| 5.4 | `relatedServices` and related posts by relevance, not `.slice(0, 4)` — no page receives zero related links                                                            | §9.4    | ux-cro-security §3.2                           |
| 5.5 | Service descriptions re-derived from the depth copy, not the opening paragraph — staying inside the 120–160 window Sprint 4.7 established, so `titles.mjs` stays at 0 | §2.4    | keyword-map §5                                 |

**Exit:** `content-depth.mjs` service floor and delta 7/7; `schema.mjs` FAQ parity; `links.mjs` `relatedServiceTargets` / `relatedPostTargets` warnings 0.

---

## 8. Sprint 6 — Content depth II: locations and navigation (Phase 3; 5–10 days — the long pole)

**Goal:** the 18 location pages survive a manual review. `new-city`, `internal-linking`; reviewers
hebrew-editor → claims-verifier, local-seo-strategist, seo-auditor. Owner answers 3.5 and 3.6 decide
the four region entries and באר שבע; the rest proceeds on what is confirmed.

| #   | Task                                                                                                                                                             | Backlog   | Standard                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------ |
| 6.1 | `cityContent` for all 18: three or more true local items each (named areas, the local gate reality, travel and scheduling at that distance, a city-specific FAQ) | §3.1 §5.3 | content-standards §2 · local-seo-il              |
| 6.2 | `kind` + `prefixed` on `locations`; a per-entry `updated` replacing the shared date — `באזור השרון`, not `בשרון`                                                 | §5.2      | seo-geo-aeo-strategy §3.2 · content-standards §8 |
| 6.3 | Location titles, descriptions and H1s from the per-city data, no longer one token apart                                                                          | §2.3      | keyword-map §3–§5                                |
| 6.4 | Geo copy: neighbourhoods and landmarks in `cityContent`; the map half waits for the GBP                                                                          | §5.5      | seo-geo-aeo-strategy §3.3                        |
| 6.5 | Header reaching all 7 services and 18 locations in one hop — as a real disclosure, with the focus management from Sprint 3.3                                     | §9.1      | ux-cro-security §3.1 · accessibility-and-i18n §3 |
| 6.6 | Footer renders all 18 locations — the `slice(0, 12)` goes                                                                                                        | §9.2      | ux-cro-security §3.1                             |
| 6.7 | The service ↔ location mesh both ways from `nearby` and `relatedServices`                                                                                        | §9.3      | ux-cro-security §3.2                             |
| 6.8 | `/שירותים/`, `/איזורי-שירות/`, `/אודות/` to their floors with copy that is not the homepage teasers                                                              | §3.13     | content-standards §1                             |

**Exit — the doorway test is the gate:** swap the city name; if the page is still valid for another
city it does not ship, and there is no 19th city until all 18 pass. `content-depth.mjs` location
floor and delta 18/18; `links.mjs` → `notInChrome 0`, 0 orphans; `claims-grep.mjs` still 0;
local-seo-strategist green.

---

## 9. Sprint 7 — Guides hub, block model, AEO surface (Phase 4; 5–8 days)

**Goal:** the pages competitors rank with and this site has none of. `content-hub` → `new-guide`,
`new-article`, `aeo-answer-content`; article-auditor gates each guide; reviewers aeo-geo-strategist,
hebrew-editor, claims-verifier. The post moves need owner-actions 3.8.

| #   | Task                                                                                                                                                                                                                                                  | Backlog              | Standard                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------- |
| 7.1 | `lib/guide-types.ts`, `lib/guides.ts` with module-load throws, `content/guides/`, `app/מדריכים/` index + `[slug]`; sitemap from the registry                                                                                                          | §6.3                 | ADR 0002 · ADR 0003 · seo-geo-aeo-strategy §1                         |
| 7.2 | Guides #1–#4 per content-calendar §2, the ת״י 900 חלק 21.03 page first — it needs no owner fact; SII URL inline; the 2006 date and the licence question are verified on sii.org.il / gov.il before publish or left out (calendar §2, keyword-map §12) | §6.3                 | content-calendar §2 · eeat-and-trust §3.3 · seo-geo-aeo-strategy §4.4 |
| 7.3 | Block-model migration of the 11 posts: heading levels restored, the 42 dead link phrases become links, `updated` set where a real edit happened                                                                                                       | §3.8 §3.10 §9.5 §6.4 | ADR 0003 · content-standards §9                                       |
| 7.4 | Keep / fold / 301 per content-calendar §4 (3 keep, 4 fold, 4 redirect) — each move a `_redirects` line, one hop, never a chain                                                                                                                        | §3.8                 | content-calendar §4 · ux-cro-security §4.4                            |
| 7.5 | `public/llms.txt` from the `aeo-answer-content` template — NAP from the manifest, percent-encoded canonicals, the "do not attribute" block; worth shipping now that Gate 1 is open                                                                    | §6.5                 | seo-geo-aeo-strategy §4.4                                             |
| 7.6 | Answer blocks on every remaining page without one (posts, statics)                                                                                                                                                                                    | §6.2                 | content-standards §5                                                  |

**Exit:** article-auditor pass per guide; `links.mjs` 0 orphans, reverse index complete; `edge.mjs`
→ `llmsTxt true` and the live URL 200; `schema.mjs` FAQ parity; aeo-geo-strategist green, the
full-UA probe as its first row.

---

## 10. Sprint 8 — Engagement and measurement (Phases 5 + 7; ongoing)

**Goal:** the ability to know whether any of the above worked. `engagement-ux`, `tracking-analytics`, `keyword-research`; reviewer cro-engagement-auditor.

| #   | Task                                                                                                                                                                                                                                                                   | Backlog                    | Standard                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| 8.1 | Build-time TOC on pages past ~900 words; the six engagement events from one client leaf (`useEngagementEvents` template), inside the §10.2 budget and added to the client-component ledger — no backlog row yet, so a `new` row                                        | new (§10.2 budget)         | event-taxonomy "Engagement events" · engagement-ux                      |
| 8.2 | **Only after B1 and B2:** the measurement id in the roster, verified `gtm.js` 200, the first `gsc-ingest.mjs` month into rank-tracking. Until then the `sprint` loop skips both ids with a note — expected, not mis-sequenced                                          | §13.7 §15.3 (after B1, B2) | data-tracking-infrastructure §4, §8 · rank-tracking                     |
| 8.3 | Monthly `/audit full` with the Δ against the previous report, carrying the AI-citation panel (ten fixed prompts, four engines) under the audit template's existing §7 heading; quarterly competitor SERP captures — the cadence clause of §15.2, which is otherwise ✅ | §15.2 cadence · §6.3       | seo-geo-aeo-strategy §6.1 · competitors §4 · audits/README "Convention" |
| 8.4 | Cloudflare Web Analytics as the CWV field source — an owner toggle (B9), counted on only when the beacon shows in a live response; the repo's only change is the one-script exception in the ledger. No backlog row                                                    | new · B9                   | data-tracking-infrastructure §5.1 · performance-guidelines §6.2         |
| 8.5 | Strip or disallow the 45 RSC `index.txt` payloads — decided in the backlog row (`Disallow: /*/index.txt` in `app/robots.ts`, or a post-build script in `package.json`; the row's "Cloudflare-side" is stale), executed as a script, never a hand delete                | §1.3                       | performance-guidelines §2.3 · seo-geo-aeo-strategy §4.2                 |

**Exit:** three weekly numbers exist in GA4 (call clicks, WhatsApp clicks, `lead_submit` vs `/תודה/`
views — data-tracking-infrastructure §8); `gsc-ingest.mjs --write` has produced one month in
rank-tracking; the first monthly `docs/audits/<date>-full.md` carries a filled §1 Δ and 40 panel rows
(10 prompts × 4 engines) in §7.

---

## 11. Sprint 9 — Trust assets as they arrive (Phase 6; event-driven)

Each row is short once the asset exists and impossible before; each fires on the Track B delivery it names.

| #   | Trigger                                                             | Task                                                                                                                                                  | Backlog   | Standard                                                |
| --- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------- |
| 9.1 | Photos (B4)                                                         | `site-images` pipeline: Hebrew `alt`, width and height, per-photo city · gate type · month; before/after pairs; location-page evidence; `ImageObject` | §7.5 §4.5 | eeat-and-trust §2.1, §2.2 · performance-guidelines §3.2 |
| 9.2 | GBP URL (B3)                                                        | `sameAs` in the roster, synced down; `hasMap`; the profile link in the chrome                                                                         | §5.1 §5.5 | seo-geo-aeo-strategy §5 · gbp-runbook §14               |
| 9.3 | Reviews on the profile (B3)                                         | Verbatim only, through the `REVIEW_SOURCE_URL` gate — the restore path, never a paraphrase                                                            | §7.1      | eeat-and-trust §4.2 · gbp-runbook §11                   |
| 9.4 | The job log (growth-roadmap §6; no owner-actions row yet — add one) | Case notes: city · gate type · fault · outcome, no price, no name                                                                                     | §3.1      | eeat-and-trust §2.3                                     |
| 9.5 | A named person (not coming; if it changes)                          | One `lib/authors.ts` entry with permission, role, real photo — the gate opens itself                                                                  | §7.4      | eeat-and-trust §3.2                                     |

**Exit, per row:** 9.1 `a11y.mjs` `imgCount` > 0 with 0 alt failures and `perf.mjs` 0 image findings;
9.2 `schema.mjs` 0 with `sameAs` non-empty; 9.3 `schema.mjs` 0 with `Review` present only while
`REVIEW_SOURCE_URL` is set; 9.4–9.5 `claims-grep.mjs` 0 and claims-verifier green.

---

## 12. Track B — owner, start now (longest lead time)

**None of this is code. Most of it outranks most of the code.** Ids are owner-actions rows.

| #   | Item                                                                                                                                                                                                                                 | Unblocks                                     | Source                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | --------------------------------- |
| B0  | ✅ 2026-09-06 — **The deploy go-ahead** for Sprint 0 (given: "deploy")                                                                                                                                                               | everything — the reviews are live until then | growth-roadmap §2 Phase 0         |
| B1  | **Search Console** — domain property or the HTML token (2.3)                                                                                                                                                                         | §13.7, §15.3, rank-tracking, Sprint 8.2      | data-tracking-infrastructure §4   |
| B2  | **GA4 property** — the measurement id (2.4)                                                                                                                                                                                          | conversions counted anywhere; Sprint 8.2     | data-tracking-infrastructure §1   |
| B3  | **Google Business Profile** (2.1), then reviews (2.2)                                                                                                                                                                                | §5.1, §7.1 restore path, Sprint 9.2–9.3      | gbp-runbook                       |
| B4  | **Job photos** (4.1), van (4.2), team with naming permission (4.3)                                                                                                                                                                   | §7.5, Sprint 9.1                             | business-facts §F                 |
| B5  | **The four answers** — 24/7 and response times (3.5), the regions and באר שבע (3.6), WhatsApp (3.7), post rewrite approval (3.8)                                                                                                     | Sprint 4.6, Sprint 6, Sprint 7.4             | business-facts §E, §G             |
| B6  | **`www` → apex** 301 (1.2)                                                                                                                                                                                                           | §1.7                                         | cloudflare-runbook Step 3         |
| B7  | **Identify the header rule** (1.3); delete it after Sprint 1 ships `_headers` and the live curl confirms                                                                                                                             | §12.1 owned by the repo                      | cloudflare-runbook Step 4         |
| B8  | ✅ 2026-09-06 (delegated) — **Flip the business-facts §H crawler row** to ✅                                                                                                                                                         | N18 closes                                   | business-facts §H                 |
| B9  | **Cloudflare Web Analytics** toggle — a new owner-actions §1 row naming both paths (zone → Analytics & Logs → Web Analytics; Workers & Pages → project → Metrics → Web Analytics — which covers a Pages custom domain is unverified) | Sprint 8.4                                   | data-tracking-infrastructure §5.1 |
| B10 | **The privacy-law question** — obligations under Israeli law, EU visitors material or not                                                                                                                                            | whether a consent UI exists at all           | data-tracking-infrastructure §6   |

---

## 13. Explicitly not in this plan

| Not doing                       | Why                                                                                                           | Revisit when                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| English / i18n                  | No demand evidence — Search Console is unverified; the old `/en/` was abandoned and is a stub to `/`          | Two quarters of GSC data show non-Hebrew demand (accessibility-and-i18n §7)               |
| Server-side GTM                 | A running server on an architecture whose point is "nothing to operate"; solves a gap this site does not have | data-tracking-infrastructure §5.2 conditions                                              |
| Geolocation personalisation     | The 18 location pages are the personalisation; `Permissions-Policy` disables the API; no cloaking risk        | mobile-ux-and-personalization §9                                                          |
| Trust badges                    | Self-issued, unverifiable; no licence, insurance or certification exists to badge                             | business-facts §C flips to ✅ (eeat-and-trust §5.2)                                       |
| `Review` / `AggregateRating`    | Nothing sourced; the fabricated set shipped until 2026-08-17 and is live until Sprint 0                       | B3 delivers reviews, quoted verbatim (eeat-and-trust §4.2)                                |
| `Offer` schema                  | Eight of nine prices are authored; the owner said real prices are ❌ not coming                               | Only on a sourced price in business-facts §D; never on authored numbers (schema-graph §4) |
| A 19th city / 8th service       | 18 locations and 7 services fail the doorway test as of 2026-08-24                                            | Sprints 5 and 6 exit green                                                                |
| Session recording               | Would capture name and phone typed into the form                                                              | Never while the form collects PII — which is always (data-tracking-infrastructure §3.1)   |
| An edge Worker / Pages Function | The deploy uploads `out/` only; a Worker is a fleet ops change, not a repo change                             | A fleet decision, recorded in the fleet's docs                                            |
| A Next.js major bump for N17    | The three advisories are build-time only on a static export                                                   | The next planned major                                                                    |

---

## 14. Cadence & gates

**Every sprint ends with the same gate, no exceptions:** `npm run audit:env` (step 0), then
`npm run gate` (lint → typecheck → format:check → build → audit) read against the known baseline
(`qa-build-gate`) — judged on regressions, not on the expected failures. Then the roster's reviewers
for the touched sections (agent-roster §3), `/audit <scope>` into `docs/audits/<date>-<scope>.md`,
and the backlog rows updated with the verifying command, never a number from memory (CLAUDE.md
golden rule 11). The `sprint` skill runs exactly this loop.

**Deploy** is `deploy-dangates` on the owner's word, every time: `-DryRun`, the go-ahead, then
`-Confirm` with `# APPROVED: <reason>` on the same command; pushing to `main` deploys nothing. **After
every deploy, verify the live response, never the repo** — cloudflare-runbook "One-shot verification",
plus from Sprint 1 the legacy-URL 301 checks and the header curl. The AI-crawler full-UA probe is
the first row of every AEO finding; a `robots.txt` read proves nothing (seo-geo-aeo-strategy §4.2).

## 15. Rough shape

| Sprint | Focus                                     | Effort       | Gating                                                   |
| ------ | ----------------------------------------- | ------------ | -------------------------------------------------------- |
| 0      | Ship Phase 0                              | ½ day        | **Blocks everything** — B0 given; shipped 2026-09-06     |
| 1      | Edge, technical SEO, tracking foundations | 2–3 days     | Blocks 4 (N13), 3.8 (registry), 7.4 (`_redirects`), B7   |
| 2      | Schema and entity                         | 2 days       | —                                                        |
| 3      | Accessibility, form, conversion plumbing  | 2–3 days     | Blocks 6.5 (menu focus); 3.9 fires into nothing until B2 |
| 4      | The truth pass                            | 2–3 days     | After 1.11; 4.6 bounded by B5                            |
| 5      | Content: services                         | 3–5 days     | —                                                        |
| 6      | Content: locations and navigation         | 5–10 days    | Blocks location expansion; 6.2 shaped by B5              |
| 7      | Guides hub, block model, AEO surface      | 5–8 days     | After 6 (deep pages to link down to); 7.4 on B5          |
| 8      | Engagement and measurement                | ongoing      | 8.2 blocked on B1, B2; 8.4 on B9                         |
| 9      | Trust assets                              | event-driven | Each row on its Track B delivery                         |
| B      | Owner track                               | ongoing      | Blocks 0, 8.2, 9.1–9.3; shapes 4.6, 6.2, 7.4             |

Effort figures are estimates, not measurements — nothing in `scripts/audit/` produces them. Sprints
4–6 are copy work and can run in parallel with 2–3 if there is capacity — the writer chain is the
constraint, not the calendar. Track B runs throughout and starts today; it has the longest
lead time and the highest ceiling.
