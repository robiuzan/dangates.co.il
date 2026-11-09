---
name: engagement-ux
description: Reading-engagement discipline for dangates — a build-time TOC on pages past ~900 words, a <details>/<summary> FAQ that keeps every answer in the DOM with zero client JS, the readability bar (sentence ≤ 25 words, an H2 every ≤ 200 words, a list or table per ~300 words, the answer block first), the CTA placement rule and the two-per-guide cap, the no-pop-up policy, the body → services → locations → FAQ → guides → FinalCta exit order, and the six engagement events from docs/event-taxonomy.md pushed by one client hook. Use when a page reads like a brochure, when adding a TOC, FAQ or CTA to a guide, or when wiring engagement tracking. Triggers: "table of contents", "TOC", "FAQ accordion", "details summary", "readability", "CTA placement", "engagement events", "scroll depth", "exit-intent", "חלון קופץ", "תוכן עניינים", "שאלות נפוצות".
allowed-tools: Read, Grep, Glob, Bash
---

# Engagement UX

`/conversion-cro` owns the transactional surfaces (click-to-call, the sticky bar, the lead form).
This skill owns what happens between landing and converting: whether a reader who arrived to
**decide** can find, read and finish the page — and whether we can see that they did.

Adapted from galbath's `article-conversion` (`c:/Users/robiu/antigravity/Projects/galbath.co.il/.claude/skills/article-conversion/SKILL.md`)
and widened to every page type here, because dangates had no guide family until Sprint 7 (four
guides since `89439b7`) and its service and location pages are the pages that must earn engagement
too.

## Baseline — re-measure first

```bash
npm run build                                   # N12: never assert against a stale out/
node scripts/audit/run-all.mjs --scope a11y     # Faq.tsx hidden answers (N8), Process.tsx list (§11.2)
node scripts/audit/run-all.mjs --scope cro      # data-cta coverage, pages with no CTA in <main>
node scripts/audit/run-all.mjs --scope perf     # client components, unused deps, JS budget
```

As of 2026-11-09 (current `out/`, repo, at `2b0d802`): a build-time TOC on 17 pages and the six
engagement events pushed from one leaf — both since `98e38f0` (Sprint 8.1, backlog N20); 5
`"use client"` components (`EngagementEvents`, `LeadForm`, `DesktopNav`, `MobileMenu`, `Reveal` —
`perf.mjs` → `clientComponents 5`; it was 3 from Sprint 3 until `fd72698` added `DesktopNav`).
Closed before that: the FAQ is native `<details>` with every answer in the DOM (N8, `7cfcf4c`,
which took `Faq` out of the client set), every CTA carries `data-cta` (`cta-coverage.mjs` → 0
missing, §13.2), `framer-motion` is uninstalled (§10.3), and the form events (`form_start`,
`form_submit_attempt`, `lead_submit` with dimensions) shipped in `68a4a7f`. Every event is pushed
but **counted nowhere** until GA4 exists (B2). `cro-engagement-auditor` reads the same scripts —
cite its report, not these numbers.

## TOC — build-time, for pages past ~900 words

Built in `98e38f0` (2026-11-09, Sprint 8.1 — backlog N20). The rule and where it lives:

- **Threshold — both bars, judged per page:** `buildToc` (`lib/toc.ts`) returns items only when the
  page's prose passes `TOC_MIN_WORDS` (900) **and** it has `TOC_MIN_HEADINGS` (4) or more H2s;
  otherwise `[]` and nothing renders. The prose is the same data the page maps (or a guide's
  registry `wordCount`), so the count cannot drift from the copy. As of 2026-11-09: 17 pages — the
  4 guides, the 7 service pages, `/אודות/`, and the five cities over the bar (חיפה, יבנה, ירושלים,
  פתח-תקווה, ראשון-לציון); the other 9 cities sit under it. The set moves when copy does.
- **Derived at build** — zero client JS. Every linked H2 carries a stable `id` from `headingId()`
  (the same slug the guide renderer uses, so AEO section targeting has something to anchor to) and
  `scroll-mt-24` so the sticky header never covers the target; a duplicate id throws at build. On the
  11 `/blog/` posts the flat `{type:"h"|"p"|"li"; text}` model still has no ids and the posts sit
  under 900 words — no TOC until their migration (owner-actions 3.8).
- **Pattern:** one server component, `components/ui/Toc.tsx` — a `nav[data-toc]` landmark labelled
  `tocLabel` ("תוכן העניינים") around a native `<details>`, collapsed by default so it never pushes
  the answer block below the fold, and the **same single element on desktop** (no second hidden
  variant, so no doubled landmark — the galbath gotcha below). It sits directly after the answer
  block: the service, location and about routes render it themselves, `GuideView` passes it as
  `afterAnswer`. Proof on the export: 163 TOC links over the 17 pages, 0 missing targets, 0
  duplicate ids.
- **RTL:** logical utilities only (`ps-*`, `ms-*`, `start-*`) — `rules/rtl-markup.md` lints the file.
- Links are `#id` anchors, so `toc_click` (read from `nav[data-toc]`) is the only event they need.

## FAQ — `<details>`/`<summary>`, not a client accordion (done 2026-11-08)

`components/marketing/Faq.tsx` was `"use client"` with `useState`, rendering every answer with
`hidden={!isOpen}` — in the DOM (so `FAQPage` parity held) but `display:none` to every reader who
did not click, to find-in-page and to crawlers that honour visibility, plus hydration JS on every page
that rendered it. Since `7cfcf4c` it follows `templates/Faq.tsx`: a server component, one `<details>`
per item, the `<h3>` question inside `<summary>`, the answer as a `<div>` child, `open` on the first
item, `name="faq"` for an exclusive accordion where supported (independent disclosures elsewhere).
`a11y.mjs` no longer warns (N8) and `Faq` left the client set (3 then; 5 since `fd72698` and
`98e38f0` added `DesktopNav` and `EngagementEvents`). Any new FAQ surface uses the same shape.

Keep the `FaqItem` shape (`{ q, a }`) — `faqs` in `lib/content.ts` and `faqJsonLd` consume it.
Per-service FAQs shipped in Sprint 5 (`225ff45`, `new-service`): each service page renders its
`ServiceDepth.faqs` through the same `Faq` component (a `<details>` group named `service-faq`, with
its own H2). One Q/A may appear in exactly one `FAQPage` sitewide (`schema.mjs`), and
`lib/service-depth.ts` throws at module load when a service question repeats a homepage one.

## The readability bar

Hebrew readers on a phone, mid-fault, scanning for their symptom. Per page, enforced by
`hebrew-editor` (copy) and `content-depth.mjs` (answer block):

- Sentence ≤ 25 words. Split on the second comma.
- An H2 at least every 200 words, question-form where the section answers one (aeo-answer-content).
- One list or table per ~300 words — a symptom → cause → fix table is the citable unit.
- The **answer block first**: 40–60 words directly under the opening question-form heading
  (content-standards §5). Not after a preamble, not after a CTA.
- Buyer vocabulary (עינית, לוח פיקוד, מחסום — keyword-map §2), גרש/גרשיים, no emoji in body copy.

## CTA placement and caps

A CTA earns its place when it resolves the uncertainty the paragraph above just created. The rule is
**"after an unresolved-variable block"** — the moment the reader learns the fix needs a technician:
"אם השער עדיין נעצר, הבעיה בדרך כלל בלוח הפיקוד — שם נדרש טכנאי" → the call/WhatsApp pair. A CTA
that appears because we are 40 % down the page reads as "this was an ad all along" and spends the
trust the page was written to build.

- **≤ 2 CTA blocks per guide**, at most one of them the WhatsApp "send a photo of the gate" bridge.
  Build-enforced since Sprint 7 (`89439b7`): `lib/guides.ts` throws "N CTA blocks; the cap for
  <family> is <cap>" at module load from `familyCtaCap` (the galbath `lib/articles.ts` pattern).
  On the other page types the cap stays a review rule for `cro-engagement-auditor`.
- Every CTA anchor carries `data-cta` as `{placement}-{action}`, exactly two segments
  (`articleinline-call`, `articleaside-whatsapp` — renamed from `article-inline-call` /
  `article-aside-whatsapp` in `9886dd1`, N21) — `cta-coverage.mjs` fails on a missing tag and warns
  on an off-convention name, and GTM reads nothing else.
- 🔶 Never promise a response time in a CTA ("תוך שעה", "מיד") — business-facts §E.
- Service pages today: the per-service `serviceTriggers` bullets (shared by all seven until `cfff52f`)
  are the unresolved-variable block; the sticky CTA card (`service-call`, `service-whatsapp`) sits
  beside them, and `FinalCta` closes the page.

## No pop-ups, no exit-intent, no chat widgets

A deliberate no, for three independent reasons: INP on a site whose entire performance story is
"almost no JS"; focus-management and CLS liabilities against `/הצהרת-נגישות/`, which claims
WCAG AA; and `MobileCtaBar` already occupies the persistent-prompt role. A third-party chat bubble
also adds a script origin the future CSP (`/web-security-headers`) would have to allow. "Was this
helpful", reading-progress bars, share buttons and newsletters are also out — galbath's triage
applies unchanged: static export, no backend, ~dozens of clicks a month cannot inform a decision.

> **One sanctioned exception — owner decisions 2026-10-11 and 2026-10-12, fleet live-kit**
> (CLAUDE.md §14): the **seasonal card**, on every fleet site, under the 3locksmiths pilot's rules,
> at all hours. It keeps what this rule protects: no client component and no third-party origin
> (`public/assets/live.js` is static, deferred, first-party); a native `<dialog>` — the browser's
> own focus trap, Escape and focus return, focus on the title rather than the call link — closed
> in the HTML and opened in the top layer, so it reserves no space and shifts nothing; never on a
> page reached from search, on the 2nd page of a visit (after 4 s) or after 20 s and a scroll on
> the first, once per 14 days, never on the calm or no-card pages (`live.config.mjs`), never while
> the mobile menu is open or a form field has focus; on a phone a bottom sheet that stops 16px
> above `MobileCtaBar`, never over it. Exit-intent, countdowns, chat widgets and every other
> interruption stay banned. Flag the card only when it breaks one of its own rules.

## Exit order

**body → related services → locations → FAQ → more guides → `FinalCta`.** The FAQ sits immediately
before the banner on purpose — the last objection handler — and `FinalCta` must never be the only
exit: a reader still deciding needs a lateral link. Related services by relevance — the service
pages use declared `relatedServices`, cities and posts since Sprint 5 (`225ff45`); the post route's
`others` list comes from `relatedPosts()` (`lib/related-posts.ts`) since `9886dd1`, by relevance
rather than `.slice(0, 4)`. Locations all 14 — the footer renders them
all and each location page links its `nearby` neighbours since Sprint 6 (`7c3f2db`), and the header
reaches every service and location in one hop since `fd72698` (Sprint 6.5, `/internal-linking`). Each
related card carries `data-related` (`relatedAttr()` in `lib/engagement.ts`) for `related_click`. "More guides" is the `relatedGuides` list on each guide since Sprint 7 (`89439b7`).

## Engagement events — exactly `docs/event-taxonomy.md`

Six events, names and parameters verbatim from the "Engagement events (Phase 5)" table:
`scroll_depth` (25/50/75/90 % of `<main>`) · `engaged_time` (15/45/120 s visible **and** focused)
· `toc_click` (`target` = heading id) · `faq_open` (`question` ≤ 80 chars) · `related_click`
(`target`, `kind`) · `outbound_click` (`target_host`). Every push carries `page`, `page_type` and
`site: "dangates"`. **No PII** (golden rule 10) — the question text and a path are the most
specific strings allowed.

Implementation (built in `98e38f0`, from `templates/useEngagementEvents.ts`):
`lib/hooks/useEngagementEvents.ts`, mounted once by one null-rendering client leaf
(`components/engagement/EngagementEvents.tsx`) in `app/layout.tsx`, on the `KNOWN_CLIENT` ledger in
`scripts/audit/rtl-lint.mjs`; `usePathname` re-arms the once-per-view marks. Passive listeners, one rAF-throttled scroll handler, `toggle` captured at the document (it does not
bubble), `related_click` read from `data-related="service|location|guide|post"` on the card link.
GTM consumes them as Custom Event triggers; GA4 is **owner-blocked** (backlog §13.7,
owner-actions §2.4) — events are pushed but counted nowhere until the property lands. Do not add
them to the container before `tracking-analytics` has the hostname row.

## Mobile

The sticky bar stays (`components/layout/MobileCtaBar.tsx`) — add nothing else fixed, or it
double-stacks and eats a third of the screen. (The live-kit's announcement bar is in flow and
scrolls away, and its card is a short-lived modal above the sticky bar — neither is a second fixed
element; CLAUDE.md §14.) Tap targets 44 px (house bar, `/responsive-accessibility`);
the header menu button is 44 px (`h-11 w-11` in `MobileMenu`) since `60ce109`. A mobile TOC is
collapsed by default. Test at 360 px wide with the bar visible.

## Measure

`cro-engagement-auditor` (TOC on long pages, FAQ in DOM, event coverage, CTA per page type) ·
`node scripts/audit/a11y.mjs` (N8, §11.2) · `node scripts/audit/cta-coverage.mjs` (§13.2) ·
`node scripts/audit/perf.mjs` (client components, deps). Then `npm run gate`.

## Checklist

- [ ] `npm run build` before any assertion (N12).
- [ ] Faq is a server component with `<details>`/`<summary>`; `a11y.mjs` shows no N8 warning;
      `faqJsonLd` text still equals the visible text (`schema.mjs` FAQ parity).
- [ ] TOC through `buildToc` (900 words and 4+ H2s) and `<Toc>` only; ids stable; one TOC element per page; `aria-label` from `tocLabel`.
- [ ] Answer block first; sentence ≤ 25 words; H2 ≤ 200 words; a list/table per ~300 words.
- [ ] ≤ 2 CTA blocks, each after an unresolved-variable block, each with `data-cta`.
- [ ] Exit order ends FAQ → guides → `FinalCta`, never a bare `FinalCta`.
- [ ] Events match `docs/event-taxonomy.md` names and parameters; `site: "dangates"`; no PII.
- [ ] No new `"use client"` beyond the five on the ledger (the events leaf is already one of them); no new dependency; `rtl-lint.mjs` clean.
- [ ] Hand copy to `hebrew-editor` → `claims-verifier`; markup to `ts-react-reviewer`.

## Gotchas

- **The `Reveal` wrapper breaks list semantics.** `Process` put a `<Reveal>` `<div>` between `<ol>`
  and each `<li>` until `7cfcf4c` (2026-11-08); screen readers stopped announcing a list (backlog
  §11.2 ✅, `a11y.mjs` fails on a recurrence). Animate the `<li>` itself or drop the wrapper — never wrap list
  items, table rows or `<details>` in a block element.
- **`framer-motion` was a dependency imported nowhere** and was uninstalled on 2026-09-06
  (`perf.mjs` → `unusedDeps: []`, §10.3). Do not reinstall it: `components/ui/Reveal.tsx` already
  does the one animation the site has, with an IntersectionObserver and `prefers-reduced-motion`.
- `toggle` does not bubble — listen on `document` with `{ capture: true }`, or `faq_open` never fires.
- Two TOC call sites rendering both variants and hiding one with breakpoint classes emitted four
  `nav` landmarks with one name on galbath. One variant per call site.
- Chromium auto-opens a closed `<details>` for find-in-page and text fragments; Firefox and Safari
  do not yet. Still strictly better than `display:none`, and the crawler sees the text either way.
- Related links must end in `/` (N10) or the export's `trailingSlash` redirect adds a hop.
- Never push the lead's name, phone, email or message as an event parameter, even truncated.
