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
and widened to every page type here, because dangates has no guide family yet (Phase 4) and its
service and location pages are the pages that must start earning engagement first.

## Baseline — re-measure first

```bash
npm run build                                   # N12: never assert against a stale out/
node scripts/audit/run-all.mjs --scope a11y     # Faq.tsx hidden answers (N8), Process.tsx list (§11.2)
node scripts/audit/run-all.mjs --scope cro      # data-cta coverage, pages with no CTA in <main>
node scripts/audit/run-all.mjs --scope perf     # client components, unused deps, JS budget
```

As of 2026-08-23: 9 of 10 FAQ answers are `display:none` in the export (`a11y.mjs` → N8); 4
`"use client"` components (`LeadForm`, `Header`, `Faq`, `Reveal`); `framer-motion` imported nowhere;
24 CTA page-instances without `data-cta`; no TOC anywhere; no engagement event pushed anywhere.
`cro-engagement-auditor` reads the same scripts — cite its report, not these numbers.

## TOC — build-time, for pages past ~900 words

- **Threshold:** 4+ level-2 headings, which in practice means ~900+ words (content-standards §1:
  posts and guides). Service and location pages at today's depth (~150 words) get no TOC; they get
  one only after Phase 3 rewrites them past the floor.
- **Derived from the block array at build** — zero client JS. Every H2 gets a stable `id` (a slug of
  the heading text), which also gives AEO section targeting something to anchor to. The block model
  (`PostBlock`, `lib/guides.ts`) that makes this derivable is Phase 4; until then the 11 `/blog/`
  posts are `{type:"h"|"p"|"li"; text}` with no ids and no TOC.
- **Pattern:** galbath `components/article/chrome.tsx` `ArticleToc` — one component, an explicit
  `variant: "mobile" | "desktop"`, one visible element per call site. Mobile = a collapsed
  `<details>` in the flow so it never pushes the answer block below the fold; desktop = a
  `sticky top-24` `<nav aria-label="תוכן העניינים">` in the aside, with the call + WhatsApp card
  below it. Copy the structure into `components/article/` in Phase 4; do not copy galbath's
  `lib/articles.ts` imports.
- **RTL:** logical utilities only (`ps-*`, `ms-*`, `start-*`) — `rules/rtl-markup.md` lints the file.
- Links are `#id` anchors, so `toc_click` is the only event they need (see below).

## FAQ — `<details>`/`<summary>`, not a client accordion

`components/marketing/Faq.tsx` is `"use client"`, holds `useState`, and renders every answer with
`hidden={!isOpen}` (`Faq.tsx:43-51`). The answers are in the DOM (so `FAQPage` parity holds — the
kit's `faqJsonLd` on `app/page.tsx:29` and the visible text match) but `display:none` to every reader
who does not click, to find-in-page, and to crawlers that honour visibility. It also ships hydration
JS on every page that renders it, and its button still carries `text-right` (`Faq.tsx:25`).

Replace it with `templates/Faq.tsx`: a server component, one `<details>` per item, the question in
`<summary>` inside the `<h3>`, the answer as a `<div>` child. `open` on the first item preserves
today's default-open behaviour. `name="faq"` makes it an exclusive accordion where supported and
degrades to independent disclosures elsewhere. `a11y.mjs` clears the N8 warning the moment the file
contains both `<details` and `<summary`; `perf.mjs` drops the client-component count to 3.

Keep the `FaqItem` shape (`{ q, a }`) — `faqs` in `lib/content.ts` and `faqJsonLd` consume it.
Per-service FAQs arrive with Phase 3 (`new-service`); one Q/A may appear in exactly one `FAQPage`
sitewide (`schema.mjs`), so a service FAQ must not repeat a homepage question.

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
  Build-enforced in the Phase-4 registry (`lib/guides.ts`, copied from galbath `lib/articles.ts`,
  which throws `"N CTA blocks; the cap is 2"` at module load). Until that registry exists the cap
  is a review rule for `article-auditor`.
- Every CTA anchor carries `data-cta` as `{location}-{action}` (`article-inline-call`,
  `article-aside-whatsapp`) — `cta-coverage.mjs` fails otherwise, and GTM reads nothing else.
- 🔶 Never promise a response time in a CTA ("תוך שעה", "מיד") — business-facts §E.
- Service pages today: the shared `triggers` bullets at `app/services/[service]/page.tsx:43` are
  the unresolved-variable block; the page's CTA belongs directly after them, not only in
  `FinalCta` at `:157`.

## No pop-ups, no exit-intent, no chat widgets

A deliberate no, for three independent reasons: INP on a site whose entire performance story is
"almost no JS"; focus-management and CLS liabilities against `/הצהרת-נגישות/`, which claims
WCAG AA; and `MobileCtaBar` already occupies the persistent-prompt role. A third-party chat bubble
also adds a script origin the future CSP (`/web-security-headers`) would have to allow. "Was this
helpful", reading-progress bars, share buttons and newsletters are also out — galbath's triage
applies unchanged: static export, no backend, ~dozens of clicks a month cannot inform a decision.

## Exit order

**body → related services → locations → FAQ → more guides → `FinalCta`.** The FAQ sits immediately
before the banner on purpose — the last objection handler — and `FinalCta` must never be the only
exit: a reader still deciding needs a lateral link. Related services by relevance, not
`.slice(0, 4)` (`app/services/[service]/page.tsx:54`); locations all 18, not `Footer.tsx:76`'s
`.slice(0, 12)` — both are `/internal-linking` Phase 3 work. "More guides" exists once `/מדריכים/`
exists (Phase 4).

## Engagement events — exactly `docs/event-taxonomy.md`

Six events, names and parameters verbatim from the "Engagement events (Phase 5)" table:
`scroll_depth` (25/50/75/90 % of `<main>`) · `engaged_time` (15/45/120 s visible **and** focused)
· `toc_click` (`target` = heading id) · `faq_open` (`question` ≤ 80 chars) · `related_click`
(`target`, `kind`) · `outbound_click` (`target_host`). Every push carries `page`, `page_type` and
`site: "dangates"`. **No PII** (golden rule 10) — the question text and a path are the most
specific strings allowed.

Implementation: `templates/useEngagementEvents.ts` → `lib/hooks/useEngagementEvents.ts`, mounted by
one null-rendering client leaf (`components/engagement/EngagementEvents.tsx`) in `app/layout.tsx`.
Passive listeners, one rAF-throttled scroll handler, `toggle` captured at the document (it does not
bubble), `related_click` read from `data-related="service|location|guide|post"` on the card link.
GTM consumes them as Custom Event triggers; GA4 is **owner-blocked** (backlog §13.7,
owner-actions §2.4) — events are pushed but counted nowhere until the property lands. Do not add
them to the container before `tracking-analytics` has the hostname row.

## Mobile

The sticky bar stays (`components/layout/MobileCtaBar.tsx`) — add nothing else fixed, or it
double-stacks and eats a third of the screen. Tap targets 44 px (house bar, `/responsive-accessibility`);
the header menu button is a 40 px box at `components/layout/Header.tsx:55`. A mobile TOC is
collapsed by default. Test at 360 px wide with the bar visible.

## Measure

`cro-engagement-auditor` (TOC on long pages, FAQ in DOM, event coverage, CTA per page type) ·
`node scripts/audit/a11y.mjs` (N8, §11.2) · `node scripts/audit/cta-coverage.mjs` (§13.2) ·
`node scripts/audit/perf.mjs` (client components, deps). Then `npm run gate`.

## Checklist

- [ ] `npm run build` before any assertion (N12).
- [ ] Faq is a server component with `<details>`/`<summary>`; `a11y.mjs` shows no N8 warning;
      `faqJsonLd` text still equals the visible text (`schema.mjs` FAQ parity).
- [ ] TOC only where 4+ H2s; ids stable; one visible TOC per viewport; `aria-label="תוכן העניינים"`.
- [ ] Answer block first; sentence ≤ 25 words; H2 ≤ 200 words; a list/table per ~300 words.
- [ ] ≤ 2 CTA blocks, each after an unresolved-variable block, each with `data-cta`.
- [ ] Exit order ends FAQ → guides → `FinalCta`, never a bare `FinalCta`.
- [ ] Events match `docs/event-taxonomy.md` names and parameters; `site: "dangates"`; no PII.
- [ ] No new `"use client"` beyond the one events leaf; no new dependency; `rtl-lint.mjs` clean.
- [ ] Hand copy to `hebrew-editor` → `claims-verifier`; markup to `ts-react-reviewer`.

## Gotchas

- **The `Reveal` wrapper breaks list semantics.** `components/marketing/Process.tsx:13` puts a
  `<Reveal>` `<div>` between `<ol>` and each `<li>`; screen readers stop announcing a list
  (backlog §11.2, `a11y.mjs`). Animate the `<li>` itself or drop the wrapper — never wrap list
  items, table rows or `<details>` in a block element.
- **`framer-motion` is a dependency imported nowhere** (`perf.mjs` §10.3). Do not "use it since it
  is there"; uninstall it. `components/ui/Reveal.tsx` already does the one animation the site has
  with an IntersectionObserver and `prefers-reduced-motion`.
- `toggle` does not bubble — listen on `document` with `{ capture: true }`, or `faq_open` never fires.
- Two TOC call sites rendering both variants and hiding one with breakpoint classes emitted four
  `nav` landmarks with one name on galbath. One variant per call site.
- Chromium auto-opens a closed `<details>` for find-in-page and text fragments; Firefox and Safari
  do not yet. Still strictly better than `display:none`, and the crawler sees the text either way.
- Related links must end in `/` (N10) or the export's `trailingSlash` redirect adds a hop.
- Never push the lead's name, phone, email or message as an event parameter, even truncated.
