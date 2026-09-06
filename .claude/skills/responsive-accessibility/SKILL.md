---
name: responsive-accessibility
description: WCAG 2.1 AA and Israeli IS 5568 compliance for dangates, measured by scripts/audit/a11y.mjs and rtl-lint.mjs — the accent-button hover (2.76:1) and WhatsApp-surface (1.98:1) contrast failures and the accent-500 token that already fixes the first, 44px tap targets, keyboard and focus order, the mobile menu's missing aria-controls/focus trap/Escape, semantic landmarks and one H1, the Process list broken by an interposed Reveal wrapper, the TrustBar's doubled screen-reader text, FAQ answers hidden with display:none, programmatic form errors with aria-invalid and aria-describedby, reduced motion, and keeping /הצהרת-נגישות/ truthful. Use before shipping or when auditing accessibility. Triggers: "accessibility pass", "WCAG", "contrast check", "tap targets", "keyboard navigation", "נגישות", "IS 5568", "ת״י 5568".
---

# Accessibility — WCAG 2.1 AA + IS 5568

This site **publishes an accessibility statement** at `/הצהרת-נגישות/` claiming ת״י 5568 / WCAG AA
conformance. A failure here is not just a bug — it makes a published statement false. Keep the
statement and the site in sync in both directions. Reviewer: `perf-a11y-auditor` (and
`ts-react-reviewer` for markup); writer: `rtl-frontend-engineer` (`docs/agent-roster.md` §3, row §11).

## Proof — measure, don't eyeball

```bash
node scripts/audit/a11y.mjs            # contrast pairs, alt, labels, empty links, landmarks, source checks
node scripts/audit/rtl-lint.mjs        # banned physical utilities, hex literals, "use client" inventory
npm run audit -- --scope a11y          # both, exit code = failures
```

`a11y.mjs` computes the contrast ratios itself and checks the named components at source. As of
2026-08-23 (re-run, do not copy): **4 failures** — `Process.tsx` interposed wrapper (§11.2),
`LeadForm.tsx` `noValidate` with no `aria-invalid` (§8.1), accent hover **2.76:1** and the WhatsApp
surfaces **1.98:1** (§11.1) — plus **4 warnings**: `Faq.tsx` answers `display:none` (N8), `Header.tsx`
focus management (§11.4), the `tel` input has no `pattern` (§8.1), `TrustBar.tsx` duplicate SR text
(§11.3). `rtl-lint.mjs`: 3 `text-right`, 8 hex literals on 5 lines (§11.5).

## Contrast — the palette is good, two states are not

| Pair (from `a11y.mjs` `contrastPairs`)                    | Ratio    | Verdict    |
| --------------------------------------------------------- | -------- | ---------- |
| white on `primary` `#B6070C`                              | **6.94** | ✅         |
| `accent-foreground` `#3d2b00` on `accent` `#ffd700`       | **9.70** | ✅         |
| `accent-foreground` on `accent-600` `#8a6d00` — **hover** | **2.76** | ❌         |
| white on `#25D366` — WhatsApp rest                        | **1.98** | ❌         |
| white on `#1da851` — WhatsApp hover                       | **3.10** | ❌         |
| `accent-foreground` on `accent-500` `#d9b400`             | **6.79** | ✅ the fix |

1. **Accent button hover (§11.1 / N11).** `components/ui/Button.tsx:11` is
   `bg-accent text-accent-foreground hover:bg-accent-600`. The AA-safe hover token **already exists**:
   `--color-accent-500: #d9b400` at `app/globals.css:47`. The fix is one word —
   `hover:bg-accent-600` → `hover:bg-accent-500` — on the primary CTA of every page.
2. **WhatsApp surfaces (§11.1).** `Button.tsx:13` (`bg-[#25D366] text-white hover:bg-[#1da851]`) and
   `components/layout/MobileCtaBar.tsx:22` repeat the pairing on the sticky bar — the phone
   conversion path; `components/forms/LeadForm.tsx:222` and `app/צור-קשר/page.tsx:42` use the greens
   as text. The hex is inlined in four files, which `.claude/rules/rtl-markup.md` forbids. Fix once:
   add a `whatsapp` token pair to the `@theme` block in `app/globals.css` (dark text on the brand green,
   or a darkened surface that clears 4.5:1 with white — compute it, `a11y.mjs` will), swap the four
   literals for `bg-whatsapp text-whatsapp-foreground`, and watch `rtl-lint.mjs` `hexLiterals` drop.

Rest-state contrast is not enough — both failures live in `hover:` variants and a hardcoded literal.
A checker that samples the default state passes them. Flag any visible brand change before shipping.

## Semantics

- **One `<h1>` per page** (`links.mjs` asserts it); heading order unbroken; `header` / `nav` /
  `main` / `footer` present.
- **Interposed wrappers break lists (§11.2).** `components/marketing/Process.tsx:13` puts `<Reveal>`
  (a `<div>`) between `<ol>` and each `<li>`, so the five steps are not announced as a list. The
  wrapper goes **inside** the `<li>` — or give `Reveal` an `as="li"` prop — never between a list and
  its items. Same rule for the `Reveal` pattern anywhere else.
- **Duplicated screen-reader text (§11.3).** `components/marketing/TrustBar.tsx:11` renders
  `<dt class="sr-only">{stat.label}</dt>` and then repeats the label visibly inside the `<dd>`.
  Make the visible label the `<dt>` and the value the `<dd>` (a real definition list), and drop the
  `sr-only` copy. The values it shows are also claim-lexicon territory — `/eeat-build`, §7.2.
- Real `<button>` / `<a>`; never a clickable `div`. Every CTA carries `data-cta` (`cta-coverage.mjs`).

## Keyboard and the mobile menu (§11.4)

`focus-visible:ring-2` on `Button` — good, keep it. The mobile menu in `components/layout/Header.tsx`
sets `aria-expanded` at `:57` but has **no `aria-controls`** (the menu `<div>` at `:66-68` has no
`id`), **no Escape handler, no focus trap, no scroll lock**, and closes only through each link's
`onClick`. Fix when the Header is split into a server shell + a `MobileMenu` client leaf
(`/performance-web-vitals`): `id` on the panel, `aria-controls` on the toggle, `Escape` closes and
returns focus to the toggle, focus stays inside while open, body scroll locked. Do **not** copy the
current pattern into the services/locations mega-menu that `/internal-linking` calls for. Tab order
follows DOM order — correct in RTL; never reorder visually with CSS.

## FAQ answers must be in the DOM (N8)

`components/marketing/Faq.tsx:47` hides closed answers with `hidden={!isOpen}` — 9 of 10 answers are
`display:none` across the export. Find-in-page misses them, an assistant extracting the answer sees
the question only, and the accordion is client JS for nothing. Replace with `<details>/<summary>`
(template: `.claude/skills/engagement-ux/templates/Faq.tsx`): native keyboard support, zero JS,
answers always in the DOM, `FAQPage` parity preserved (`schema.mjs` checks it). Keep `text-right` out
of the rewrite — `Faq.tsx:25` is one of the three banned utilities (`text-start`).

## Forms (§8.1, N1)

Every `LeadForm` field has a `<label htmlFor>` — good. Missing: `components/forms/LeadForm.tsx:120`
sets `noValidate` and nothing sets `aria-invalid`; the only error is one generic string
(`LeadForm.tsx:49`, "נא למלא שם וטלפון") in a single `<p role="alert">` at `:201-205` that never says
**which** field; the `tel` input at `:143-153` has no `pattern`; and the network-error branch at
`:85-90` sets `status("error")` with **no JSX branch that renders it** (N1 — the user sees nothing).

Recipe: per-field `errors` state → each invalid input gets `aria-invalid` and
`aria-describedby="lf-<field>-error"` pointing at a visible message; focus moves to the first invalid
field on submit; keep a summary `role="alert"`. Phone pattern must accept Israeli landlines as well as
mobiles — this business answers on `072-…` — start from `^0(5\d|7\d|[2-4]|[89])-?\d{7}$` and have
the reviewer confirm. The full form design (consent, `/תודה/` route, city field, pricing-page CTA) is
`/conversion-cro`; `cro-engagement-auditor` reviews it.

## Images and figures

`a11y.mjs` `imgCount 0` — there is nothing to alt-check until photos exist (business-facts §F).
When they land, `/site-images` applies: Hebrew `alt` on meaningful images, `alt=""` only for
decorative, and `SiteImage` refuses an empty `alt` at compile time. Figures get a visible caption.

## Tap targets and mobile

- 44×44 px minimum for anything tappable, with spacing. The `MobileCtaBar` halves are `py-3.5`
  full-width anchors — verify the rendered height, not the class.
- The `h-16 lg:hidden` spacer at `app/layout.tsx:76` keeps the fixed bar off the footer — keep it.
- Test at 360 px; text reflows to 320 px without horizontal scroll; 200 % zoom loses nothing.

## Motion

`app/globals.css:96` is the global `prefers-reduced-motion` reset. `components/ui/Reveal.tsx`
initialises **visible** and only hides after mount, so content is never stranded at `opacity: 0`.
`framer-motion` was uninstalled on 2026-09-06 (§10.3) — do not reinstall it; a JS animation would
have to be `useReducedMotion()`-gated to honour the reset.

## RTL

`<html lang="he" dir="rtl">`; LTR islands for phone, email, price, URL. The three live `text-right`
hits (`LeadForm.tsx:151`, `Faq.tsx:25`, `PricingTeaser.tsx:17`) are a one-word swap each to
`text-start`. Full rule set and the `direction-agnostic` exception: `/hebrew-rtl`.

## Checklist

- [ ] `npm run audit -- --scope a11y` run on a fresh build; no failure that the latest `docs/audits/`
      report does not already list.
- [ ] Every text/background pair ≥ 4.5:1 — **including hover, focus and active states**.
- [ ] One `<h1>`; heading order unbroken; landmarks present.
- [ ] No wrapper element between a list and its `<li>`s; no duplicated SR text.
- [ ] Menus: `id` + `aria-controls`, `aria-expanded`, Escape closes, focus returns.
- [ ] Form errors: `aria-invalid` + `aria-describedby`, focus to the first invalid field, the error
      state actually renders (N1).
- [ ] FAQ answers present in the DOM (`<details>`), `FAQPage` parity intact.
- [ ] Meaningful `alt`; 44 px targets; 360 px clean; 200 % zoom usable.
- [ ] `/הצהרת-נגישות/` still describes reality — update it in the same change if it does not.

## Gotchas

- **The hover token exists — use it.** N11: `accent-500` was defined for exactly this; adding a new
  colour would be the wrong fix.
- **A hex in JSX fails lint** (`rtl-lint.mjs`, `post-edit-lint.ps1`). Tokens live in the `@theme` block
  of `app/globals.css`; brand changes go upstream to the roster's brand block, then into `@theme`.
- **`hidden` is not "collapsed".** Anything a reader or crawler should be able to find has to be in the
  rendered DOM — that is why the FAQ moves to `<details>` rather than to a nicer accordion.
- **The statement is a claim.** Fixing a contrast failure and leaving the statement's "conforms" line
  unchanged is fine; shipping a new failure without amending it is not.
