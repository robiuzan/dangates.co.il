---
name: responsive-accessibility
description: WCAG 2.1 AA and Israeli IS 5568 compliance for dangates, measured by scripts/audit/a11y.mjs and rtl-lint.mjs — both scripts at 0 since Sprint 3 (2026-11): contrast in every state (the accent-500 hover and the whatsapp tokens that fixed 2.76:1 and 1.98:1), 44px tap targets (the form's error-alert buttons too, since fba5957 — N19 closed), keyboard and focus order with the skip link and the MobileMenu focus trap/Escape, semantic landmarks and one H1, lists never broken by a Reveal wrapper, no doubled screen-reader text, FAQ answers in the DOM via details, per-field form errors with aria-invalid and aria-describedby, reduced motion, and keeping /הצהרת-נגישות/ truthful. Use before shipping or when auditing accessibility. Triggers: "accessibility pass", "WCAG", "contrast check", "tap targets", "keyboard navigation", "נגישות", "IS 5568", "ת״י 5568".
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
2026-11-08 (clean rebuild, re-run, do not copy): **0 failures, 0 warnings**; `rtl-lint.mjs`
`bannedUtilities 0 · hexLiterals 0`. Sprint 3 closed the 2026-08-23 set — 4 failures (`Process`
wrapper §11.2, `LeadForm` `aria-invalid` §8.1, accent hover 2.76:1 and WhatsApp 1.98:1 §11.1) and
4 warnings (`Faq` `display:none` N8, menu focus §11.4, tel `pattern` §8.1, `TrustBar` SR text §11.3)
— in commits `7cfcf4c`, `60ce109` and `68a4a7f`. The job now is keeping it at 0.

## Contrast — every measured state passes

| Pair (from `a11y.mjs` `contrastPairs`, 2026-11-08) | Ratio    | Verdict |
| -------------------------------------------------- | -------- | ------- |
| white on `primary` `#B6070C`                       | **6.94** | ✅      |
| `accent-foreground` `#3d2b00` on `accent`          | **9.70** | ✅      |
| `accent-foreground` on `accent-500` — **hover**    | **6.79** | ✅      |
| `whatsapp-foreground` on `whatsapp` — rest         | **5.42** | ✅      |
| `whatsapp-foreground` on `whatsapp-hover`          | **6.63** | ✅      |
| `whatsapp` as text on white                        | **5.42** | ✅      |

Until `7cfcf4c` (2026-11-08) the accent hover was `accent-600` at 2.76:1 and the WhatsApp surface the
literal `#25D366` at 1.98:1 (hover `#1da851` 3.10:1), inlined in four files. Both failures lived in a
`hover:` variant and a hardcoded literal — a checker that samples only the default state passed them.
The rule that keeps them fixed: every new colour pair is a `@theme` token that `a11y.mjs` can read,
computed in every state; never a hex in JSX. Flag any visible brand change before shipping.

## Semantics

- **One `<h1>` per page** (`links.mjs` asserts it); heading order unbroken; `header` / `nav` /
  `main` / `footer` present.
- **Interposed wrappers break lists (§11.2 ✅).** A `<Reveal>` (a `<div>`) between `<ol>` and `<li>`
  hides the list from screen readers. Since `7cfcf4c` each `Process` `<li>` wraps its own `Reveal`;
  `a11y.mjs` fails on a recurrence. Same rule for the `Reveal` pattern anywhere else.
- **Duplicated screen-reader text (§11.3 ✅).** `TrustBar` once rendered an `sr-only` `<dt>` and then
  repeated the label visibly; it is now a real definition list — visible label `<dt>`, value `<dd>`.
  The values it shows are also claim-lexicon territory — `/eeat-build`, §7.2.
- Real `<button>` / `<a>`; never a clickable `div`. Every CTA carries `data-cta` (`cta-coverage.mjs`).

## Keyboard, the skip link and the mobile menu (§11.4 ✅, N19)

`focus-visible` rings on `Button` — keep them. Since `60ce109` (2026-11-08):

- **Skip link.** The first focusable element on every page (`app/layout.tsx`, label `skipLinkLabel`)
  jumps to `<main id="main" tabIndex={-1}>`, ahead of the live-kit bar and the header.
- **`MobileMenu`** is the client leaf inside a server `Header`: `id="mobile-menu"` on the panel,
  `aria-controls` + `aria-expanded` on the 44px toggle, Escape closes and returns focus to the toggle,
  Tab and Shift+Tab cycle inside while open, page scroll locked, and `data-live-block` on the open
  panel so the live-kit card cannot cover it.

The services/locations disclosures `/internal-linking` called for reuse it since `fd72698`
(Sprint 6.5, §9.1 ✅): `MobileMenu` carries the two groups inside its trap, and the desktop
`DesktopNav` triggers keep `aria-controls` + `aria-expanded`, Escape back to the trigger and
`data-live-block` while open — non-modal, so no Tab trap and no scroll lock, and an outside click
closes them. Do not invent a third pattern. Tab order follows DOM order — correct in RTL; never
reorder visually with CSS.

## FAQ answers must be in the DOM (N8 ✅)

The `Faq` component used to hide closed answers with `hidden={!isOpen}` behind a client accordion.
Since `7cfcf4c` it is a server component on native `<details>/<summary>` (template:
`.claude/skills/engagement-ux/templates/Faq.tsx`): native keyboard support, zero JS, answers always in
the DOM, `FAQPage` parity preserved (`schema.mjs` checks it). Keep physical alignment utilities out of
it (`text-start`).

## Forms (§8.1 ✅, N1 ✅)

Every `LeadForm` field has a `<label htmlFor>`. Since `68a4a7f` (2026-11-08) each invalid field gets
`aria-invalid` and `aria-describedby="lf-<field>-error"` pointing at a visible message, the wiring
renders before focus moves to the first invalid field, and the phone check is `lib/phone.ts` — one
expression for the `pattern` attribute and the JS check, accepting mobiles, `07X` lines (this business
answers on `072-…`) and landlines. The delivery-failure branch renders a `role="alert"` block (N1,
`fee7f69`). Before: `noValidate` with one generic string that never said which field, and no pattern.
The full form design (consent, `/תודה/`, city field, pricing-page CTA) is `/conversion-cro`;
`cro-engagement-auditor` reviews it.

## Images and figures

`a11y.mjs` `imgCount` counts the header logo (one per page, decorative) and, since N37, every content
image — AI renderings under one site-wide note through `components/images/Figure.tsx` (`page-imagery`).
Each carries a Hebrew `alt` from `content/images/manifest.json` and every body figure a visible
`<figcaption>`; `a11y.mjs` fails a missing `alt`, and an image-only link needs an accessible name
(the gallery tiles and the index thumbnails). `alt=""` is for the logo only; `SiteImage` (OG card,
logo) still refuses an empty `alt` at compile time.

## Tap targets and mobile

- 44×44 px minimum for anything tappable, with spacing. The `MobileCtaBar` halves are `py-3.5`
  full-width anchors and the phone-first CTAs are `Button size="lg"` — verify the rendered height,
  not the class. The two buttons in `LeadForm`'s delivery-failure alert moved `size="md"` → `size="lg"`
  (≈52px) in `fba5957`, closing N19. No script measures target size.
- The `h-16 lg:hidden` spacer in `app/layout.tsx` keeps the fixed bar off the footer — keep it.
- Test at 360 px; text reflows to 320 px without horizontal scroll; 200 % zoom loses nothing.

## Motion

`app/globals.css` carries the global `prefers-reduced-motion` reset. `components/ui/Reveal.tsx`
initialises **visible** and only hides after mount, so content is never stranded at `opacity: 0`.
`framer-motion` was uninstalled on 2026-09-06 (§10.3) — do not reinstall it; a JS animation would
have to be `useReducedMotion()`-gated to honour the reset.

## RTL

`<html lang="he" dir="rtl">`; LTR islands for phone, email, price, URL. The three `text-right` hits
that survived review (`LeadForm`, `Faq`, `PricingTeaser`) became `text-end` in `7cfcf4c`;
`rtl-lint.mjs` → `bannedUtilities 0`. Full rule set and the `direction-agnostic` exception: `/hebrew-rtl`.

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
- [ ] `/הצהרת-נגישות/` still describes reality — update it in the same change if it does not. It
      names WCAG 2.1 AA since 2026-11-08 (was 2.0); it still has no date or coordinator
      (`docs/accessibility-and-i18n.md` §2).

## Gotchas

- **The hover token exists — use it.** N11: `accent-500` was defined for exactly this; adding a new
  colour would be the wrong fix.
- **A hex in JSX fails lint** (`rtl-lint.mjs`, `post-edit-lint.ps1`). Tokens live in the `@theme` block
  of `app/globals.css`; brand changes go upstream to the roster's brand block, then into `@theme`.
- **`hidden` is not "collapsed".** Anything a reader or crawler should be able to find has to be in the
  rendered DOM — that is why the FAQ moved to `<details>` rather than to a nicer accordion.
- **The statement is a claim.** Fixing a contrast failure and leaving the statement's "conforms" line
  unchanged is fine; shipping a new failure without amending it is not.
