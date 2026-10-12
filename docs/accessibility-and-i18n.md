# Accessibility & internationalisation — architecture rules

> **Layer:** standards. This file decides the conformance target, the accessibility rules every
> component must meet, the RTL rules that double as accessibility rules, and whether — and how — a
> second locale is ever built. The `responsive-accessibility` and `hebrew-rtl` skills are the
> how-to and the `i18n-locale-architecture` skill is the locale procedure; `perf-a11y-auditor` and
> `ts-react-reviewer` audit against it; `a11y.mjs` and `rtl-lint.mjs` measure it. Reads with:
> [optimization-backlog.md](optimization-backlog.md) §11, [business-facts.md](business-facts.md),
> [owner-actions.md](owner-actions.md), [content-standards.md](content-standards.md),
> [schema-graph.md](schema-graph.md), [ux-cro-security.md](ux-cro-security.md) (form errors, §8.1),
> [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) (tap targets, 360 px).
>
> **`/הצהרת-נגישות/` is a published declaration, not marketing.** It is the one page on the site
> that asserts conformance, and every accessibility defect makes that assertion false. 🔶 Its legal
> status and required contents under the Israeli accessibility regulations are unverified (§2) —
> treat it as binding until a human legal check says otherwise. Keep the site and the statement in
> sync in both directions; if a fix will take time, amend the statement first.

---

## 0. Current state — verified 2026-08-24

Figures from `docs/audits/2026-08-24-full.md` and the repo; re-run `a11y.mjs` and `rtl-lint.mjs`
before quoting. Every row describes the repo, which the domain has served since the Sprint 0 deploy on 2026-09-06 (until then it ran the 2026-08-03 build).

| Measure                                      | As of 2026-08-24                                                                                              | Source                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `a11y.mjs`                                   | **4 failures**, 4 warnings, 45 pages                                                                          | audit §2 `a11y`                                                     |
| `rtl-lint.mjs`                               | **2 failures**: 3 banned utilities (all `text-right`), 8 hex literals on 5 lines, 0 exemptions                | audit §2 `rtl-lint`                                                 |
| Contrast, rest state                         | white on `primary` 6.94:1 · `accent-foreground` on `accent` 9.70:1 — pass                                     | `a11y.mjs` → `contrastPairs`                                        |
| Contrast, interaction state                  | accent **hover** 2.76:1 · WhatsApp surface **1.98:1** (hover 3.1:1) — fail                                    | §11.1 · N11                                                         |
| `<img>` on the export                        | 0 — nothing to alt-check until photos land (business-facts §F)                                                | `a11y.mjs` → `imgCount`                                             |
| Unlabeled controls · empty links             | 0 · 0                                                                                                         | `a11y.mjs`                                                          |
| Client components                            | 4: `Header`, `Faq`, `LeadForm`, `Reveal`                                                                      | `rtl-lint.mjs` census                                               |
| `/הצהרת-נגישות/`                             | claims ת״י 5568 + WCAG 2.0 AA, "ניגודיות צבעים תקינה", keyboard navigation, screen-reader support — **false** | audit H13 (contrast) · M13 (list, SR text, menu) · §8.1 / N1 (form) |
| Locale                                       | one: `he-IL`, `dir: rtl`, set once in `app/layout.tsx`; OG `locale` `he_IL`; `BlogPosting.inLanguage` `he-IL` | `site.config.json`, `app/layout.tsx`                                |
| `hreflang`, language switcher, English pages | none                                                                                                          | —                                                                   |

**The fleet live-kit's surfaces (2026-10-12, CLAUDE.md §14)** — measured pairs, none failing: the
bar, white on `#2b3a75` (secondary-700), 10.69:1 at 13px / 500; card text `#172040` on white
15.94:1; the card's call button `accent-foreground` on `accent` 9.70:1 (the site's own gold CTA
pair); its WhatsApp button white on `#075e54` 7.67:1 (not the failing `#25D366`); links `#33468f`
8.70:1 on white, 7.71:1 on the strip's `#eef1fa`. The card is a native `<dialog>` (the browser's
focus trap, Escape and focus return; focus lands on the title, never the call link); its ✕ and its
link are 44px tap targets, 8px clear of the buttons, measured at 360, 390, 991–1024 and 1366px.
`a11y.mjs` reads only the `@theme` pairs, so these are recorded here, not in `contrastPairs`.

---

## Part I — Accessibility

### 1. The conformance target

| Standard               | Status                                                                                                                                                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ת״י 5568 (IS 5568)** | The Israeli standard the statement names. 🔶 Its legal force, and whether the current revision tracks WCAG 2.0 or 2.1, are unverified — confirm with the Standards Institute before the statement names a version or a legal basis. |
| **WCAG 2.1 AA**        | The working target: a superset of what the statement names, adding the mobile-era criteria (orientation, reflow, motion) a click-to-call site lives or dies on.                                                                     |
| WCAG 2.2 AA            | Not required. Its `2.5.8 Target Size (Minimum)` asks only 24 × 24 px; the house floor is the stricter 44 × 44 px of `2.5.5 Target Size (Enhanced)` (AAA, present since 2.1), adopted deliberately — see §3.                         |

**Rule:** build to WCAG 2.1 AA; declare IS 5568; never declare a level the scripts have not verified.

### 2. What the statement claims, and what is true

`app/הצהרת-נגישות/page.tsx` says the site is being made accessible per ת״י 5568 and WCAG 2.0 AA and
lists four things "הונגש באתר": semantic structure with keyboard navigation, correct contrast, alt on
meaningful images, screen-reader support with full RTL. It gives phone and email as the contact
route; it carries no date, no accessibility coordinator and no known-exceptions list. 🔶 What the
regulation requires the statement to contain is not verified here. Each row below names its backlog
item, or says there is none yet.

| Statement claim                                   | Defect that falsifies it                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Backlog                |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| ניגודיות צבעים תקינה                              | `Button` accent variant hovers to `accent-600` under `accent-foreground` = 2.76:1. The existing `accent-500` token gives 6.79:1 — a one-word fix.                                                                                                                                                                                                                                                                                                                              | §11.1 · N11            |
| ניגודיות צבעים תקינה                              | WhatsApp surface: white on the literal `#25D366` = 1.98:1 on `Button` (whatsapp variant) and `MobileCtaBar` — the two files `a11y.mjs` reads. The contact page inlines the same greens as a tint and icon colour, `LeadForm` as link text: that is the hex-literal half (§11.5), not a measured pair. The two greens are six of the 8 hex hits `rtl-lint.mjs` counts (the other two are gradient stops in `Hero`). Fix all four once with a `whatsapp` token pair in `@theme`. | §11.1 · §11.5          |
| ניווט באמצעות מקלדת                               | Mobile menu toggle sets `aria-expanded` but the panel has no `id`, so no `aria-controls`; no Escape, no focus trap, no scroll lock.                                                                                                                                                                                                                                                                                                                                            | §11.4                  |
| התאמה לקוראי מסך                                  | `Process`: `<Reveal>` (a `<div>`) sits between `<ol>` and each `<li>`; the five steps are not announced as a list.                                                                                                                                                                                                                                                                                                                                                             | §11.2                  |
| התאמה לקוראי מסך                                  | `TrustBar`: an `sr-only` `<dt>` repeats the visible label; every stat is read twice. Its four values are also claim-lexicon phrases.                                                                                                                                                                                                                                                                                                                                           | §11.3 · §7.2           |
| מבנה סמנטי                                        | `LeadForm`: `noValidate`, one generic error string, no `aria-invalid`, no `aria-describedby`, no focus move, no phone pattern; the delivery-failure state renders nothing.                                                                                                                                                                                                                                                                                                     | §8.1 · N1              |
| כיווניות RTL מלאה (not falsified, still a defect) | Three `text-right` utilities survive because they render correctly in RTL today — exactly why the ban is mechanical.                                                                                                                                                                                                                                                                                                                                                           | §11.5                  |
| (not claimed, still a defect)                     | `Faq`: 9 of 10 answers ship with `hidden` — `display:none` for find-in-page and every reader that does not click.                                                                                                                                                                                                                                                                                                                                                              | N8                     |
| (not claimed)                                     | No skip link; `<main>` has no `id`. The hamburger is `h-10 w-10` (40 px) and `Button size="md"` computes to about 40 px from `py-2.5` + `text-sm` — under the 44 px house floor (§3). Derived from the classes, not measured; `a11y.mjs` does not check target size.                                                                                                                                                                                                           | not in the backlog yet |

### 3. The rules

#### Perceivable

- **Contrast: 4.5:1 for text, 3:1 for large text, UI boundaries and focus rings — in every state.**
  Rest, hover, focus, active and disabled are each a pair; both live failures hide in a `hover:`
  variant or a literal. Compute from the `@theme` tokens; never eyeball, never add a hex to fix a hex.
- **Never colour alone.** An error is a message plus `aria-invalid`, not a red border.
- **`alt` in Hebrew**, describing the content; decorative `alt=""`. 0 images today; when photos
  land the `site-images` skill applies and `SiteImage` refuses an empty `alt` at compile time.
- **Text resizes to 200 %** without loss; **reflow at 320 px** with no horizontal scroll. Wide tables
  get their own `overflow-x-auto` container — `PricingTeaser` today (its wrapper is
  `overflow-hidden`, which clips), the guides' citable tables tomorrow.

#### Operable

- **Everything reachable by keyboard, in DOM order, with a visible focus ring.** The
  `focus-visible:ring-2` in `Button` is correct; anchors styled as buttons (`MobileCtaBar`) need the
  same ring. Never remove `:focus-visible` styling to tidy a design.
- **Tap targets ≥ 44 × 44 px** (WCAG 2.1 `2.5.5`, AAA, adopted as the house floor; 2.2's AA `2.5.8`
  minimum of 24 px is not the bar). Verify `MobileCtaBar`'s rendered height, not its class; raise
  the hamburger and `Button size="md"`, or reserve `md` for desktop-only actions.
- **Menus are real disclosures:** `id` on the panel, `aria-controls` + `aria-expanded` on the
  toggle, Escape closes and returns focus, focus confined while open, body scroll locked. Do not copy
  the current `Header` pattern into the services/locations menu `internal-linking` calls for (§9.1).
- **Skip link** — `דילוג לתוכן הראשי` → `#main`, visually hidden until focused, first in the DOM.
- **No keyboard trap** Escape cannot leave. **Motion respects `prefers-reduced-motion`** — the global
  reset in `app/globals.css` and the JS check in `Reveal` both exist; keep both. No `framer-motion`.

#### Understandable

- **`lang` must be correct.** `he` on `<html>`; `lang="en"` on any genuinely English run — "WCAG",
  a brand name, `brandNameEn` if it is ever rendered. A Hebrew voice reading English is unintelligible.
- **Every input has a `<label htmlFor>`** — `LeadForm` does; keep it. A placeholder is not a label.
- **Errors are per field and programmatic:** `aria-invalid` on the field, `aria-describedby` to a
  visible message that says how to fix it, focus to the first invalid field, a summary in
  `role="alert"`. The phone pattern must accept every Israeli prefix — 02–04/08/09 landlines, the
  072/073/077 lines and 05x mobiles; this business answers on `072-` (shape: ux-cro-security §2.2
  row 3). The delivery-failure branch must render something (N1). Full form design:
  ux-cro-security §2 and the `conversion-cro` skill.

#### Robust

- **Semantic HTML first, ARIA last.** `<button>` before a clickable `div`; `<details>/<summary>`
  before a hand-rolled accordion (N8; template in the `engagement-ux` skill).
- **Landmarks and headings:** `<header>`, `<main>`, `<footer>`, every `<nav>` with a Hebrew
  `aria-label` (today: ראשי, ראשי נייד, פירורי לחם, שירותים, אזורי שירות, קישורים). One `<h1>`
  (`links.mjs` fails), no skipped levels (`links.mjs` warns); landmark presence is an `a11y.mjs`
  warning; `<nav>` labels are review-only — no script reads them.
- **No wrapper between a list and its items.** `Reveal` goes inside the `<li>` or grows an `as` prop.
- **Nothing a reader needs lives in `display:none`.** `hidden` is not "collapsed".

### 4. RTL-specific accessibility

RTL adds failure modes an English checklist misses. The `hebrew-rtl` skill is the full rule set;
these are the ones that are accessibility defects, not style.

- **Logical utilities are an accessibility matter.** The logical set mirrors with `dir`; the banned
  physical set does not. The three live `text-right` hits look harmless because the site is RTL-only.
  The one in `LeadForm` sits **inside a `dir="ltr"` input**, where the logical equivalent of
  `text-right` is `text-end`, not `text-start` — a `text-start` swap would left-align the digits.
  The other two (`Faq`, `PricingTeaser`) are `text-start`. The only sanctioned exception carries the
  literal `direction-agnostic` comment; there are 0 today.
- **LTR islands** — phone, email, URL, price — get `dir="ltr"` and the `.ltr` helper
  (`direction: ltr; unicode-bidi: isolate`). Without isolation the bidi algorithm reorders a number
  next to Hebrew and the screen shows a **wrong phone number**. Every render of `siteConfig.phone` must.
- **Screen-reader order is DOM order, not visual order.** `dir="rtl"` already mirrors flex and grid;
  never fix an order visually with `flex-row-reverse` or `order-*` (0 uses today — keep it so).
  `MobileCtaBar` is last in `<body>`: first for a thumb, last for a keyboard. Acceptable because the
  header's call button and the in-page CTAs come earlier in DOM order; do not move it up with CSS.
- **Directional icons mirror.** "Next" points left in Hebrew; the site's forward chevron is
  `ChevronLeft` (blog, services, locations, `ServicesGrid`) — correct for RTL, wrong for an English
  locale, so wrap the choice rather than hardcode it. Icons are `aria-hidden`; text carries the name.

### 5. Testing

| Layer           | Tool                                                                                                           | Frequency                      |
| --------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Mechanical      | `node scripts/audit/a11y.mjs` · `node scripts/audit/rtl-lint.mjs` (`npm run audit -- --scope a11y`)            | Every build; the gate          |
| Keyboard-only   | Tab through every control on `/`, a service, a location, `/צור-קשר/`; Escape on the mobile menu                | Every UI change                |
| Screen reader   | NVDA with a Hebrew voice on Windows; VoiceOver iOS set to Hebrew; listen for double announcements and LTR runs | Before each ship               |
| Zoom and reflow | 200 % text; 320 px viewport; the sticky bar must not cover content (the spacer in `app/layout.tsx`)            | Every UI change                |
| Contrast        | Every new pairing computed from the tokens, hover and focus included                                           | Any `@theme` change            |
| Statement truth | Read `/הצהרת-נגישות/` in `out/` against the `a11y.mjs` output; amend the page in the same change if it lies    | Every ship that touches §11/§8 |

`a11y.mjs` checks the export for `alt`, labels, accessible names, `lang`/`dir` and landmarks, plus
the five named components and the token pairs — no target size, focus order or `hreflang`. **The
keyboard pass takes two minutes and is the one that matters.** Routing: `docs/agent-roster.md` §3.

---

## Part II — Internationalisation

### 6. Current state: one locale, no i18n layer

`app/layout.tsx` hardcodes `<html lang="he" dir="rtl">`; the manifest declares `locale: "he-IL"`,
`dir: "rtl"`, `brandNameEn: "Dan Electric Gates"`. No locale routing, no translation layer, no
`hreflang`, no switcher, no English copy; every slug, every string in `lib/content.ts` and every
`Intl.DateTimeFormat("he-IL")` call assumes Hebrew.

One piece of history: the old WordPress site had an abandoned `/en/`. The `"/en/": "/"` pair in the
`REDIRECTS` map of `scripts/gen-redirects.mjs` (documented in `REDIRECTS.md`) emits the stub at
`public/en/index.html`; ADR 0004 turns it into a 301 in `public/_redirects` (§1.1). **Evidence, not
a mandate:** English was tried and let die. Nothing says why.

### 7. The recommendation: do not build English yet

Stated plainly, because it is the expensive decision in this document.

- **The conversion path is Hebrew end to end.** The site, the lead form, the WhatsApp prefill and
  `siteConfig.hours` are Hebrew-only, and the audience CLAUDE.md §1 names (homeowners, ועדי בתים,
  property managers, businesses with a vehicle gate) is addressed in Hebrew on every page. 🔶 Whether
  the business fields English-speaking callers is unrecorded — not a row in owner-actions §3; ask
  before assuming either way.
- **English widens the claim surface.** A full mirror would take 45 pages to ~90; even the narrow
  §9 cut adds ~13 pages on which the four unconfirmed claims (rendering 168 times on 42 pages as of
  2026-08-24, §7.2) need an English lexicon before `claims-grep.mjs` could catch "full warranty" —
  today it cannot.
- **There is no demand evidence at all.** Search Console is unverified: `googleSiteVerification`
  is `null` (owner-actions 2.3; the verification meta tag is a Sprint 1 task under §13.7 once the
  owner supplies the token), so no language or country data exists — speculative cost on a site with
  41 of 45 pages under their Hebrew word floor.
- **The Hebrew depth work comes first.** Content-standards §2 is the doorway test; an English mirror
  of doorway pages is twice the doorway risk.

**What would change the recommendation:** two quarters of verified Search Console data showing
sustained non-Hebrew query or non-IL country demand, or the owner's own contact evidence (calls,
WhatsApp threads, emails in English). **The decision is the owner's** — ask, and record it as an ADR.

### 8. The codebase is already prepared

Because the RTL rules have been followed, an LTR locale is a layout non-event — the payoff for the ban.

| Precondition                   | State                                                                                                                                     | Guard                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Logical utilities throughout   | 3 physical hits left (§11.5); flipping `dir` flips everything else for free                                                               | `rtl-lint.mjs`, `post-edit-lint.ps1` |
| Copy outside JSX               | `lib/content.ts` holds the marketing copy; **N13 is the leak** — Hebrew and a phone literal in route files and three marketing components | `rtl-markup.md` rule; N13            |
| Fonts                          | Rubik loads `hebrew` + `latin` subsets via `next/font`                                                                                    | `app/layout.tsx`                     |
| Manifest fields                | `brandNameEn`, `locale`, `dir` already in `site.config.json`                                                                              | roster sync (golden rule 2)          |
| LTR isolation pattern          | `.ltr` helper and `dir="ltr"` islands established                                                                                         | `hebrew-rtl` skill                   |
| Percent-encoded URL discipline | `encodeURI` in `sitemap()`; canonicals and `BreadcrumbList` byte-identical                                                                | `titles.mjs`, `schema.mjs`           |

**Protect this.** Every physical utility and every JSX string is a future i18n cost; close N13 first.

### 9. If English ships — the decisions

Static-export-safe, and exact. The code shapes — route tree, `alternates.languages`, the locale
map, the switcher — live in the `i18n-locale-architecture` skill; this section fixes the decisions.

1. **Sub-path `/en/`, never a subdomain.** Hebrew stays unprefixed and byte-identical at the root.
   Two root layouts in route groups — `(he)/` and `(en)/en/` — so `lang` and `dir` are per locale
   and server-side, never a client `document.dir` flip. Procedure: skill § Routing.
2. **No `Accept-Language` negotiation, no middleware, no client or edge redirect.** The static
   export forbids the first two; a JS redirect delays LCP, breaks Back and gets indexed. The locale
   is chosen by a **visible switcher** in the header of both trees: a plain link to the equivalent
   page with the locale home as fallback, text in the target language's own script (`English` with
   `lang="en"`, `עברית` with `lang="he"`), `hrefLang` on the anchor, no flags.
3. **The 404 does not inherit either root layout.** `out/404.html` comes from the implicit
   `/_not-found` route at `app/` level; with two root layouts and no top-level `layout.tsx`, Next
   14.2 wraps a top-level `app/not-found.tsx` (or, if absent, its own English not-found) in a bare
   `<html><body>` with no `lang`, `dir`, CSS or font (`next-app-loader`, `defaultLayoutPath`).
   Keep `app/not-found.tsx` top-level and self-contained — its own `lang="he" dir="rtl"` wrapper —
   and verify `out/404.html` after every build.
4. **Scope: home, the 7 services, `/שירותים/`, `/איזורי-שירות/`, `/אודות/`, `/צור-קשר/` and the
   two legal pages — never the 18 location pages (doorway, §3.1), the 11 posts (golden rule 7),
   `/מדריכים/` (ADR 0002), or `/מחירון/` until N14 lands.** Full table: skill § Scope.
5. **`hreflang` — reciprocal, self-referencing, absolute, percent-escaped identically to the sitemap
   `<loc>`, `x-default` → the Hebrew home.** One locale map (`lib/locales.ts`, planned with the
   English build) feeds `alternates.languages` in `generateMetadata`, each `sitemap()` entry's
   `alternates.languages`, and the switcher — never two lists. No script checks `hreflang` parity
   today; extend `titles.mjs` (page ↔ sitemap alternates) in the same change. Skill § hreflang.
6. **One business, two languages.** One `#business` `@id` and one `GeneralContractor` node shared
   across locales (schema-graph §1, §3); `name` stays the Hebrew brand in both trees and
   `brandNameEn` rides in `alternateName` — the kit's `localBusinessJsonLd` already does this;
   `inLanguage` per page. NAP byte-identical: `072-2587772`, no address, `₪` after the number,
   `dd/mm/yyyy`. 🔶 `siteConfig.hours` is hand-typed Hebrew with no English counterpart — an English
   locale needs a roster field for it, never an ad-hoc JSX string. OG: `openGraph.locale` `en_US`
   with `alternateLocale` `he_IL` on English pages, and the reverse on Hebrew pages.
7. **The legacy `/en/` redirect is re-pointed before launch.** Remove the `"/en/": "/"` pair from
   the generator's `REDIRECTS` map and the row from `REDIRECTS.md`, delete `public/en/` by hand —
   the generator only writes, it never prunes — re-run `node scripts/gen-redirects.mjs`, drop the
   `/en/` line from `public/_redirects` once ADR 0004 lands, and confirm `out/en/index.html` is the
   English home before the deploy dry run — `public/` is copied verbatim into `out/`, so a leftover
   stub collides with the exported route.
8. **Translation quality gate.** Every English page is human-written or human-reviewed and meets
   the content-standards §1 floors; each claim in `scripts/audit/claims.json` gains an English
   `pattern` on the same row before launch; `titles.mjs` learns a per-locale brand token; the audit
   gate learns the second tree in the same change, not after.

### 10. Explicitly not doing

| Not doing                                        | Why                                                                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| English locale now                               | No demand evidence, a Hebrew-only conversion path, a doubled claim surface — §7. Owner decision, evidence first. |
| Subdomain (`en.dangates.co.il`)                  | Splits authority the domain does not have to spare.                                                              |
| `Accept-Language` or JS locale redirect          | Static export forbids the first; the second delays LCP, breaks Back and gets indexed.                            |
| Translating `/מדריכים/`, the 11 posts, locations | The guides are the Hebrew moat; the posts are untrusted input; the locations are doorway pages (§3.1).           |
| Transliterating Hebrew slugs                     | Hebrew slugs stay; English slugs are Latin words. `/איזורי-שירות/` stays as it is (golden rule 3).               |
| Filling the statement's coordinator name or date | Business facts are the owner's; `business-facts.md` is the one file an agent may not fill in.                    |

---

## 11. Enforcement map

| Rule                                                                           | Script                                                      | Hook                              | Skill / agent                                                                                | Status                                                                                                |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Contrast ≥ 4.5:1, hover/focus included                                         | `a11y.mjs` → `contrastPairs` (named pairs only)             | —                                 | `responsive-accessibility` · `perf-a11y-auditor`                                             | enforced for the named pairs; failing → §11.1, N11                                                    |
| No hex literal in markup; tokens only                                          | `rtl-lint.mjs` → `hexLiterals`                              | `post-edit-lint.ps1` (warn)       | `rtl-markup.md` rule · `ts-react-reviewer`                                                   | enforced; failing → §11.5                                                                             |
| Logical utilities only; `direction-agnostic` exception; LTR islands            | `rtl-lint.mjs` → `bannedUtilities` (islands: none)          | `post-edit-lint.ps1` (warn)       | `hebrew-rtl` · `ts-react-reviewer`                                                           | enforced; failing → §11.5; islands review only                                                        |
| `lang`/`dir`, labels, empty links, one `<h1>`; landmarks, heading order        | `a11y.mjs` (export) · `links.mjs`                           | —                                 | `responsive-accessibility` · `hebrew-rtl` (`seo-metadata` for the `<h1>`)                    | `<h1>`, `lang`/`dir`, labels, empty links enforced and passing; landmarks and heading order warn only |
| Every `<nav>` carries a Hebrew `aria-label`                                    | —                                                           | —                                 | `perf-a11y-auditor` by inspection                                                            | not measured; six labels present today                                                                |
| No wrapper between `<ol>` and `<li>` (`Process`)                               | `a11y.mjs` (source)                                         | —                                 | `responsive-accessibility`                                                                   | enforced; failing → §11.2                                                                             |
| No duplicated SR text (`TrustBar`)                                             | `a11y.mjs` (warning)                                        | —                                 | `responsive-accessibility` · `eeat-build` (values)                                           | warns only → §11.3                                                                                    |
| Menu: `aria-controls`, Escape, focus trap, scroll lock                         | `a11y.mjs` (warning: `aria-controls`, Escape)               | —                                 | `responsive-accessibility` · `internal-linking`                                              | partial → §11.4                                                                                       |
| Form: `aria-invalid` (fail) · tel `pattern`/`inputMode` (warn)                 | `a11y.mjs` (source)                                         | —                                 | `conversion-cro`                                                                             | enforced; failing → §8.1                                                                              |
| Form: `aria-describedby`, focus to first invalid field, failure branch renders | —                                                           | —                                 | `cro-engagement-auditor` by inspection                                                       | not measured → §8.1, N1                                                                               |
| FAQ answers in the DOM (`<details>`)                                           | `a11y.mjs` (warning) · `schema.mjs` (FAQ parity)            | —                                 | `engagement-ux`                                                                              | warns only → N8                                                                                       |
| Reduced motion; tap targets ≥ 44 px; skip link                                 | —                                                           | —                                 | `perf-a11y-auditor` by inspection                                                            | not measured → no backlog row yet; file under §11                                                     |
| `alt` on every meaningful image, in Hebrew                                     | `a11y.mjs` → `imgCount`, missing `alt`                      | —                                 | `site-images` (`SiteImage` refuses empty `alt`, defaults to `altHe`)                         | presence enforced; language by review; 0 images today                                                 |
| Statement truth (`/הצהרת-נגישות/`)                                             | `a11y.mjs` exit 0 is the proxy                              | —                                 | `perf-a11y-auditor` reads the page against findings                                          | judged, not measured → false today (§11.1)                                                            |
| Copy in `lib/content.ts`, never JSX; claim phrases in any locale               | `claims-grep.mjs` (Hebrew lexicon)                          | `post-edit-lint.ps1` (copy files) | `rtl-markup.md` rule (no copy in JSX) · `content-data.md` rule (lexicon) · `claims-verifier` | copy leak not measured → N13; lexicon Hebrew only                                                     |
| `hreflang`, switcher, route groups                                             | — (`titles.mjs` checks canonical = sitemap, not alternates) | —                                 | `i18n-locale-architecture` skill                                                             | no backlog id — none opens until §7's evidence exists                                                 |
| `/en/` legacy redirect re-pointed before an English launch                     | `edge.mjs` (stubs / `_redirects`)                           | —                                 | `web-security-headers` (ADR 0004 cutover)                                                    | not yet; blocked on the §7 decision                                                                   |

## 12. Acceptance checklist

**Accessibility — every ship that touches `app/` or `components/`:**

- [ ] `npm run audit -- --scope a11y` on a fresh build — no failure absent from the latest
      `docs/audits/` report, none moved the wrong way
- [ ] Every text/background pair ≥ 4.5:1 **including hover, focus, active**, computed from
      `app/globals.css`; no new hex literal (`rtl-lint.mjs`)
- [ ] Keyboard-only pass: every control reachable in DOM order, visible focus ring, Escape leaves
      any disclosure and returns focus to its trigger
- [ ] One `<h1>` (`links.mjs` fails), heading order unbroken (`links.mjs` warns), landmarks present
      (`a11y.mjs` warns); every `<nav>` labelled — `grep -rn '<nav' app components` and read the
      `aria-label`s, no script checks this; no element between a list and its `<li>`s; no `sr-only`
      text duplicating visible text
- [ ] Form errors: per-field `aria-invalid` + `aria-describedby`, focus to the first invalid field
      (`a11y.mjs` form checks cover `aria-invalid` and the tel `pattern` only); the delivery-failure
      branch renders a message with a `tel:` link (N1 — `cro-engagement-auditor` review, not measured)
- [ ] Anything a reader needs is in the DOM, not `display:none`; FAQ via `<details>`
- [ ] Tap targets ≥ 44 × 44 px measured at 360 px; 200 % zoom and 320 px reflow clean; phone,
      email, URL and price inside a `dir="ltr"` island
- [ ] `/הצהרת-נגישות/` read in `out/` against the `a11y.mjs` output; amended in the same change if
      any claim is false (`perf-a11y-auditor` signs off)

**Internationalisation — only if the owner has decided on English (§7, recorded as an ADR):**

- [ ] N13 closed first: no copy or phone literal in route files (`ts-react-reviewer` review); scope
      is §9 item 4 — no guide, post, location or `/מחירון/` page translated
- [ ] Two root layouts via route groups; `lang` + `dir` server-side per locale; `out/404.html`
      verified Hebrew after the build, with `lang`/`dir` handled explicitly (it inherits neither)
- [ ] Reciprocal, self-referencing `hreflang` on every page in both trees; `x-default` → Hebrew
      home; the same set in `sitemap.xml` — `titles.mjs` extended to alternates parity in the same
      change, canonical parity kept green
- [ ] One `#business` `@id`, one `GeneralContractor` node, `inLanguage` per page (`schema.mjs` → 0);
      `name` Hebrew, `alternateName` from `siteConfig.nameEn`; phone bytes identical, hours from a
      roster field, not JSX
- [ ] `/en/` pair removed from `scripts/gen-redirects.mjs` and `REDIRECTS.md`, `public/en/` deleted,
      generator re-run, no `^/en/` line in `_redirects` (`grep`; `edge.mjs` → 0); `out/en/index.html`
      is the English home
- [ ] Visible switcher on every page, equivalent-page link with a home fallback, no auto-redirect
- [ ] `scripts/audit/claims.json` carries English patterns on the same claim rows;
      `claims-grep.mjs` → 0 on `/en/`
- [ ] Every English page human-written or human-reviewed, past the content-standards §1 floors
