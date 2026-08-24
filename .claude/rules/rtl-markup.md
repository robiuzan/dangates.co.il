---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# Markup rules for this file (RTL + tokens) — CLAUDE.md §6–§7, enforced by `post-edit-lint.ps1`

- **Logical utilities only** for horizontal spacing and position: `ps-* pe-* ms-* me-* start-* end-*
text-start text-end space-x-reverse`. **Banned:** `pl- pr- ml- mr- left- right- text-left
text-right`. A genuinely direction-agnostic case must carry the literal comment
  `// direction-agnostic` on the same line — the lint skips that line.
- Let `dir="rtl"` mirror flex/grid. Don't force `flex-row-reverse` except to wrap an LTR island.
- Latin/LTR runs inside Hebrew (phone, email, URL, price) get `dir="ltr"` and the `.ltr` helper.
- **No hex colour literals in markup.** Use the `@theme` tokens from `app/globals.css`: `primary`,
  `secondary`, `accent`, `accent-foreground`; `accent-500` (`#d9b400`) is the AA-safe hover for
  gold surfaces and `accent-600+` the AA-safe text-on-white values. WhatsApp green is **not** a
  token yet — add one in `globals.css` rather than inlining `#25D366`.
- RSC by default. `"use client"` only for state, effects or browser APIs, on the smallest leaf.
  Currently client: `Header`, `Faq`, `LeadForm`, `Reveal`.
- Every CTA anchor/button (`tel:`, `wa.me`, `mailto:`, submit) carries a `data-cta` attribute
  (`scripts/audit/cta-coverage.mjs` fails otherwise).
- Copy never lives in JSX — import it from `lib/content.ts`; business facts from `lib/site-config.ts`.
- `PageHeader` already emits `BreadcrumbList`; never add a second one on a route.

Full rule set: `/hebrew-rtl`, `/responsive-accessibility`.
