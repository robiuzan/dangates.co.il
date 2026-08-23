---
paths:
  - "lib/content.ts"
  - "lib/posts.ts"
  - "lib/site-config.ts"
  - "content/**/*.ts"
---

# Copy and data rules for this file — CLAUDE.md golden rules 1 and 7, enforced by `post-edit-lint.ps1`

- **Never state a business fact that `docs/business-facts.md` has not confirmed.** The lint flags
  the lexicon in `scripts/audit/claims.json`: licence/insurance/certification (§C), years of
  experience or founding year (§B), "אחריות מלאה" or any warranty term (§D), "פריסה ארצית", 24/7 and
  response-time promises (§E), ratings and review counts (§A, gated on `REVIEW_SOURCE_URL`),
  superlatives (never), named people (§B). Unconfirmed → write around it, or mark `// 🔶 confirm`
  and add a row to business-facts.
- `reviews` stays empty and `REVIEW_SOURCE_URL` stays `null` until verbatim reviews from a public
  profile exist. The `Reviews.tsx` gate depends on both — never bypass it.
- `priceRows`: only the technician-visit range is sourced. Prices are interpolated from this array,
  never restated as literals elsewhere.
- `lib/posts.ts` is **untrusted migrated input**. After any edit run
  `node scripts/audit/spam-grep.mjs`. The flat `PostBlock` model is slated for replacement by the
  guides block model (ADR 0003) — don't extend it ad hoc.
- `locations` / `services` are `as const` tuples: adding an entry widens `LocationSlug`/`ServiceSlug`
  and every `Record<…>` keyed on them must be completed before `typecheck` passes — that is the
  intended forcing function (`/new-city`, `/new-service`).
- Depth bars: service 450 · location 350 · post/guide 900 · index 250 · pricing 400 · about 500
  unique words (`docs/content-standards.md` §1), measured by `scripts/audit/content-depth.mjs`.
- Hebrew mechanics: גרש `׳` / גרשיים `״`, `₪` after the number, en-dash ranges, no emoji in body copy,
  no language mixing mid-sentence.

Procedures: `/new-city`, `/new-service`, `/new-guide`, `/new-article`. Acceptance bar:
`docs/content-standards.md`.
