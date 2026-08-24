# ADR 0003 — Replace the flat `PostBlock` with a typed block model whose rules throw at build time

**Date:** 2026-08-23 · **Status:** accepted (implemented in Phase 4)

## Context

`lib/posts.ts` models an article as `{ type: "h" | "p" | "li"; text: string }[]`. That model cannot
express a heading level (every heading renders `<h2>` — 45 heading-after-heading pairs), an in-copy
link (42 link phrases survived migration as plain text), a table, an answer block, a FAQ, an image or
a CTA. Four backlog items — §3.8 links, §3.10 hierarchy, §6.2 answer blocks, §6.3 citable tables —
are one data-model change, not four edits. Separately, every content rule (word floor, one answer
block first, no cannibalising title, captioned table) lives only in prose, which is how the first
environment drifted.

## Decision

Adopt galbath's discriminated-union `Block` model (`paragraph` with `links: InlineLink[]`, `heading`
level 2|3, `list`, `table` with a required `caption`, `answer` `{q, a}`, `faq`, `image` with
width/height, `callout`, `cta` with a cap, `tool`) as `lib/guide-types.ts`, and a registry
(`lib/guides.ts`) where the rules are **module-load throws**: a guide whose title equals a service
name or matches `{service} ב{city}`, whose first two blocks lack exactly one `answer`, whose `table`
has no caption, whose `InlineLink.anchor` is not verbatim in its paragraph, or which is missing from
the total-`Record` related map fails `npm run build`. Authors write `as const satisfies Guide`, never
`const g: Guide`, so literal types survive.

The 11 blog posts migrate to the same model (the renderer in `app/blog/[slug]/page.tsx` switches to
`components/article/ArticleBody`), which restores their outline and makes the lost links real.

## Consequences

- `content-standards.md` §3 and §5 become enforceable rather than advisory for guides and posts.
- `hebrew-copywriter` needs `Bash` to typecheck what it writes (it already does after ADR 0001).
- `scripts/audit/content-depth.mjs` measures the answer block on the export; the registry guarantees
  it exists in the source — two independent checks of the same bar.
- `article-auditor` judges what the throws cannot: whether the 900 words are genuinely unique and
  whether the table is worth citing.
