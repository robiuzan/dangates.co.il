---
name: hebrew-rtl
description: RTL and Hebrew (he-IL) discipline for dangates — logical Tailwind utilities only with the pl/pr/ml/mr/left/right/text-left/text-right ban (measured by scripts/audit/rtl-lint.mjs and warned at edit time by the post-edit-lint hook), the single sanctioned `direction-agnostic` exception, no hex literals in markup, dir="ltr" islands for phone, email, price and URL, Israeli number and date formats, Hebrew punctuation with גרש and גרשיים, and the percent-encoded Hebrew route trap. Use whenever writing markup, classes or copy that appears on the page. Mandatory per CLAUDE.md §6. Triggers: "RTL", "Hebrew", "which padding utility", "text direction", "LTR island", "Hebrew slug 404", "כיווניות", "עברית".
---

# Hebrew & RTL discipline

`<html lang="he" dir="rtl">` is set in `app/layout.tsx`. Do not remove it. Everything below follows.

## Proof — measure, don't grep by hand

```bash
node scripts/audit/rtl-lint.mjs        # banned utilities, hex literals, "use client" inventory
npm run audit -- --scope a11y          # the same, plus a11y.mjs
```

The script is the one copy of the regexes; `.claude/hooks/post-edit-lint.ps1` runs the same
patterns on every `Edit`/`Write` to `app/**/*.tsx` and `components/**/*.tsx` and feeds the hits
back as a warning, and `.claude/rules/rtl-markup.md` loads the short form whenever one of those
files is open. As of 2026-08-23 the lint reports **3 banned utilities** — all `text-right`, at
`components/forms/LeadForm.tsx:151`, `components/marketing/Faq.tsx:25`,
`components/marketing/PricingTeaser.tsx:17` — and **8 hex literals on 5 lines** (backlog §11.5).
Re-run the script before quoting either number.

## Logical utilities only — the ban list

For horizontal spacing and positioning, use **direction-aware** utilities so the layout mirrors:

| Use                                     | Never use                     |
| --------------------------------------- | ----------------------------- |
| `ps-*` / `pe-*`                         | `pl-*` / `pr-*`               |
| `ms-*` / `me-*`                         | `ml-*` / `mr-*`               |
| `start-*` / `end-*`                     | `left-*` / `right-*`          |
| `text-start` / `text-end`               | `text-left` / `text-right`    |
| `space-x-reverse` alongside `space-x-*` | bare `space-x-*`              |
| `rounded-s-*` / `rounded-e-*`           | `rounded-l-*` / `rounded-r-*` |
| `border-s-*` / `border-e-*`             | `border-l-*` / `border-r-*`   |

In RTL `text-start` already means right-aligned, so the three live `text-right` hits are a
one-word swap each, not a layout change.

**The only sanctioned exception** is a genuinely direction-agnostic case — a centred absolute
overlay, a mathematically symmetric transform — and the line **must carry the literal comment
`// direction-agnostic`** (or `{/* direction-agnostic */}` in JSX). `rtl-lint.mjs` and the hook
skip exactly that marker and count the exemptions, so an unexplained physical utility is always a
finding. There are 0 exemptions today; don't add one to silence the lint.

Let `dir="rtl"` mirror flex and grid naturally. Don't reach for `flex-row-reverse` to "fix" order;
if the order looks wrong, the DOM order is wrong. Vertical utilities (`pt`, `pb`, `mt`, `mb`, `top`,
`bottom`) are unaffected.

## No hex in markup

Colour comes from the `@theme` tokens in `app/globals.css` — `primary`, `secondary`, `accent`,
`accent-foreground`, and the `-50…-900` scales. The lint flags every `#rrggbb` in a `className` or
inline `style`. The live hits and their fixes:

- `components/ui/Button.tsx:13`, `components/layout/MobileCtaBar.tsx:22`,
  `components/forms/LeadForm.tsx:222`, `app/צור-קשר/page.tsx:42` — WhatsApp green `#25D366` /
  `#1da851`. WhatsApp is **not a token yet**: add `--color-whatsapp` (and a hover shade) in
  `globals.css` once, then use `bg-whatsapp`. White on `#25D366` is 1.98:1 — see
  `/responsive-accessibility` before picking the text colour.
- `components/marketing/Hero.tsx:16` — gradient stops `#d21f27` / `#520406` are exactly
  `primary-400` / `primary-900`; write `var(--color-primary-400)` inside the inline gradient.

## LTR islands

Latin and numeric content inside Hebrew must be isolated or the bidi algorithm reorders it — phone
numbers render backwards, prices lose their currency position, URLs fragment.

```tsx
<span className="ltr">072-2587772</span>
<a href={telHref} dir="ltr">{siteConfig.phone}</a>
```

`.ltr` is defined in `app/globals.css` as `direction: ltr; unicode-bidi: isolate`. Use it for phone
numbers, emails, URLs, prices with `₪`, version strings, and code.

**Write the plain value in `lib/content.ts`** — `072-2587772`, `800–1,500 ₪`. The component adds the
isolation. Never put markup in the content file.

## Israeli formats

- Phone: `072-2587772` displayed; `+972722587772` in `tel:` (both from `lib/site-config.ts`).
  This site does **not** use the shared fleet number — `contact.phoneOverride: true`.
- Currency: `₪` **after** the number — `1,500 ₪`.
- Dates: `dd/mm/yyyy`.
- Ranges: en dash, no spaces — `3–6 שעות`, `800–1,500 ₪`.
- Thousands separator: comma.

## Hebrew punctuation

Use **גרש** `׳` (U+05F3) and **גרשיים** `״` (U+05F4) in Hebrew abbreviations — `רח׳`, `ח״פ`, `ע״מ`.
Not the ASCII `'` and `"`, which render wrong and read as English punctuation.

The migrated blog bodies in `lib/posts.ts` were cleaned on 2026-08-17; `scripts/audit/spam-grep.mjs`
still finds **4 Latin curly quotes** around the brand name at `lib/posts.ts:848-849` (backlog
§3.12) and 42 emoji in body copy. Fix them when you touch a post; never copy the pattern into new
copy. Re-run `spam-grep.mjs` after any edit to that file (golden rule 7).

## The percent-encoded route trap

Hebrew dynamic-route params arrive **percent-encoded** during static export:

```ts
const target = decodeURIComponent(param).normalize("NFC");
return items.find((i) => i.slug.normalize("NFC") === target);
```

Both `NFC` normalizations matter — Hebrew with niqqud or certain composed forms won't match otherwise.
A route that skips this **works in dev and 404s in production**. Copy the existing matcher from
`app/services/[service]/page.tsx:27` or `app/locations/[city]/page.tsx:18`. `app/blog/[slug]` takes
Hebrew slugs too, and the Phase 4 `app/מדריכים/[slug]/` route (ADR 0002) must use the same matcher.

The same concern drives `encodeURI` in `app/sitemap.ts` and `schemaPath()` in
`components/layout/PageHeader.tsx`: the sitemap `<loc>`, the page canonical, the `BreadcrumbList`
`item` and Cloudflare's asset key must all be the same escaped string.

## One slug that looks wrong and stays

`/איזורי-שירות/` would be `אזורי`. It is the live slug, kept for URL fidelity — the nav label reads
correctly, the URL does not. Renaming it without a 301 throws away ranking signal.

## Copy rules

- Keep user-facing strings Hebrew. No mid-sentence language mixing — an English material or brand
  name gets its own clause.
- Address the reader as "אתם"; speak as "אנחנו" / דן שערים חשמליים.
- Copy lives in `lib/content.ts` (marketing) and `lib/posts.ts` (articles), never in JSX. Phase 4
  adds `content/guides/` for the `/מדריכים/` hub (ADR 0003) — same rule.
- Region names need a preposition form: `בצפון הארץ`, `באזור השרון`, never a bare `ב${loc.name}`.
  The `prefixed` field that carries it does not exist yet (Phase 3, `/new-city`).
- Full voice and depth rules: `docs/content-standards.md` §4 and §7; second-pass review by
  `hebrew-editor`.

## Checklist

- [ ] `node scripts/audit/rtl-lint.mjs` reports 0 banned utilities and 0 hex literals — or every
      survivor carries `direction-agnostic` with a reason.
- [ ] Every phone, email, URL and price is inside an LTR island.
- [ ] Hebrew abbreviations use `׳` / `״`; `spam-grep.mjs` finds no new curly quotes.
- [ ] Any new Hebrew dynamic route uses `decodeURIComponent` + `normalize("NFC")`.
- [ ] Layout checked at 360px and at desktop, in RTL.

## Gotchas

- The hook only warns (PostToolUse cannot block) — the edit has already landed. Fix it in the same
  turn; `npm run gate` fails on what the hook warned about.
- `text-right` on a `<table>` (`PricingTeaser.tsx:17`) looks harmless because the site is RTL-only.
  It is still a finding: the rule is mechanical so that the next LTR island or mirrored component
  does not inherit a physical alignment.
- Don't "fix" encoded slugs by decoding them in `sitemap.ts` — Cloudflare Pages 404s raw UTF-8 paths.
