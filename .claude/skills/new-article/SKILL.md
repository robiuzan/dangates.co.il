---
name: new-article
description: Repair, migrate or retire one of the 11 legacy blog posts under /blog/[slug]/ — the flat PostBlock model in lib/posts.ts and its limits, the remaining migration debt (curly quotes, superlatives, the empty מקרי מבחן section, 42 dead link phrases, an all-h2 outline), the keep / fold / 301 decisions in content-calendar §4, and the block-model migration per ADR 0003. New editorial never starts here — it goes through /new-guide. Use when cleaning or migrating a migrated post. Triggers: "fix the blog content", "clean up this post", "migrate the posts", "blog post", "מאמר ישן", "לתקן את הבלוג".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Repair or migrate a legacy blog post

**Scope: the 11 posts that already exist under `/blog/`.** They were scraped from a compromised
WordPress site (golden rule 7) and are still `lib/posts.ts` data in a flat block model. **All new
editorial — symptom, component, brand, comparison, safety and committee pages — goes through
`/new-guide <family> <slug>` into `/מדריכים/`** (ADR 0002), after `/content-hub` decides the topic
earns a page. Do not add a twelfth post; do not "rewrite" a post into a topic the calendar routes to
a guide. This skill covers three operations only: **clean** a post inside today's model, **migrate**
it to the typed block model (Phase 4), or **retire** it with a 301.

## Measure first

```bash
node scripts/audit/spam-grep.mjs             # spam tokens, fused words, dead tails, emoji, curly quotes
node scripts/audit/content-depth.mjs         # 900-word floor, answer-block proxy
node scripts/audit/claims-grep.mjs           # 🔶 lexicon in copy and in out/
```

As of 2026-08-23 the repo and `out/` are clean of injected spam (`spamHits: 0`, `fusedWords: 0`,
`relatedTails: 0` — the 55 dead "פוסטים קשורים" headings and the 6 run-together words are gone; the
PostToolUse hook re-checks every edit). What remains, all in `lib/posts.ts`:

| Debt                                                                                            | Where                                                                   | Backlog |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------- |
| 4 Latin curly quotes (U+2019 around the brand) — use גרשיים `״` or drop them                    | `lib/posts.ts:848-849`                                                  | §3.12   |
| Two "הדרך הטובה ביותר" superlatives — unprovable, replace with the mechanism                    | `lib/posts.ts:319`, `:557`                                              | §7.2    |
| Three consecutive headings with no body; `:421` then claims `הנתונים מראים בבירור` with no data | `lib/posts.ts:416-418` (`מקרי מבחן`, `ניתוח נתונים`)                    | §3.11   |
| 42 link phrases ("📌 למידע נוסף…", "היכנסו למחירון", "בקרו בעמוד צור קשר") as plain text        | the 42 emoji lines `spam-grep.mjs` counts (💡 ×33, 📌 ×4, 📞 ×4, 💬 ×1) | §3.8    |
| Every heading renders `<h2>` — 15–31 sibling H2s per post, the source outline is gone           | `app/blog/[slug]/page.tsx:57` (`renderBlocks`, `:34`)                   | §3.10   |
| No post opens with an answer block; all 11 are under the 900-word floor (438–584 unique)        | `content-depth.mjs` post rows                                           | §6.2    |
| No post carries `updated:` — every `<lastmod>` is the 2025 publish date                         | `grep -n "updated:" lib/posts.ts` → nothing                             | §6.4    |

The first three are fixable today inside the flat model. The rest need the block model.

## The model today, and its ceiling

```ts
// lib/posts.ts:9
export type PostBlock = { type: "h" | "p" | "li"; text: string };
// Post = { slug, title, date, updated?, excerpt, blocks }
```

`renderBlocks` maps `h` → `<h2>`, `p` → `<p>`, groups consecutive `li` into `<ul>`. It **cannot**
express a heading level, an in-copy link, a table, an answer block, a FAQ, an image or a CTA. Do not
extend it ad hoc — ADR 0003 already decided the replacement: galbath's discriminated-union `Block`
(`paragraph` with `links: InlineLink[]` whose `anchor` must appear verbatim in the text, `heading`
level 2|3, `list`, `table` with a required `caption`, `answer {q, a}`, `faq`, `image` with
width/height, `callout`, `cta` capped) as `lib/guide-types.ts`, a registry whose rules are
**module-load throws**, and one renderer `components/article/ArticleBody` shared by guides and posts.
Built in Phase 4 by `/improve`; `/new-guide` documents the templates. Until then, no raw HTML in a
string and no second mini-model.

## Keep, fold or 301 — decide before you edit

`docs/content-calendar.md` §4 proposes the fate of each post: **3 keep + migrate**
(שערים-חשמליים-השקעה, שדרוג-לשער-חשמלי-חכם, תחזוקה-מונעת-לשערים-חשמליים), **4 fold into a guide**
with a 301, **4 plain 301s** to the surviving post on the same topic. Rewriting migrated posts needs
owner approval (owner-actions 3.8, business-facts §G) — the table is a proposal until it is ticked.
Redirect mechanics: point the **legacy** WordPress row in `REDIRECTS.md` straight at the final
destination (one hop), and batch blog moves after Phase 1 replaces the 37 stubs with
`public/_redirects` (ADR 0004). A post that folds into a guide takes its usable paragraphs with it
and nothing else — the guide is written to the `/new-guide` bar, not pasted.

## Operation A — clean a post today (flat model)

1. Fix the row you came for: quotes at `:848-849`, superlatives at `:319` / `:557`, the empty
   section at `:416-418` (delete it — there is no data to give it). Keep `date`; set `updated` to
   today's ISO date on any body edit, so `app/sitemap.ts` (`p.updated ?? p.date`) and, after Phase 2,
   `dateModified` move.
2. Do **not** strip the 42 emoji link phrases yet — they mark where the real links go when the post
   migrates. Leave the emoji count to the migration.
3. Re-run `spam-grep.mjs` and `grep -rniE 'onlyfans|leaked|casino|porn|allgatesrepair' lib/posts.ts`
   (must print nothing); `npm run gate`.
4. Hand the diff to `hebrew-editor` → `claims-verifier`. A post that says "ניסיון רב" (`:850`) or
   "אחריות מלאה" is a 🔶 hit — soften per business-facts §B/§D while you are in the file.

## Operation B — migrate a "keep" post to the block model (Phase 4)

1. Convert each `{ type: "h" }` to `heading` with a real `level` — restore the H2/H3 outline the
   migration flattened; an H3 before any H2 throws.
2. Open with `answer {q, a}` in the first two blocks: 40–60 words, the whole answer before any
   scene-setting (content-standards §5). Every post currently opens with preamble.
3. Turn every "📌 למידע נוסף על …" / "היכנסו למחירון" / "בקרו בעמוד צור קשר" into a `paragraph` with
   `links: [{ anchor, href }]` — the anchor text is already written; drop the emoji. Targets:
   `/services/<slug>/`, `/מחירון/`, `/צור-קשר/`, a location, a guide. Descriptive Hebrew anchors
   only (`/internal-linking` §5).
4. Add one captioned `table` a reader would screenshot, and a `faq` block of 3–5 Q/As unique
   sitewide; `FAQPage` derives from the block.
5. Declare `relatedServices` (validated at module load; feeds `guidesForService` so the post can
   never orphan) and, where true, `relatedLocations`.
6. Reach 900 unique words with substance, or fold the post instead — the floor is not a padding
   target. The `article-auditor` verdict gates publication exactly as for a guide.
7. Rebuild; `content-depth.mjs` post row clears the floor and the answer-block proxy;
   `spam-grep.mjs` emoji count drops by the post's share; `links.mjs` → `relatedPostTargets` grows
   past the 5 array-leading siblings that `app/blog/[slug]/page.tsx:77` `.slice(0, 4)` hands every
   related link to today.

## Schema

`app/blog/[slug]/page.tsx` emits `BlogPosting` inline with `headline`, `description`,
`datePublished`, `inLanguage`, `mainEntityOfPage`, `author` (the `Organization`) and `publisher` →
`#business`; `PageHeader` emits the `BreadcrumbList` (**shipped on all 11** — never add a second).
Phase 2 corrections, in `articleJsonLd` (schema-graph §6): `dateModified: post.updated ?? post.date`
(`:85` hardcodes `post.date`), `encodeURI` on `mainEntityOfPage` (`:87` is raw Hebrew — N2), the
business node present in the same `@graph`, `@id` and `isPartOf`. **`author` stays the
`Organization`** — no person is coming (business-facts §B, owner-actions 3.3). Never invent a byline;
this site already paid for fabricated attribution once.

## Checklist

- [ ] The post is on the content-calendar §4 table and the operation matches its decision.
- [ ] `spam-grep.mjs` clean; the sanity grep prints nothing.
- [ ] `updated` set; `date` untouched.
- [ ] No 🔶 claim introduced or left where it was easy to fix (`claims-grep.mjs`).
- [ ] Migrated post: real heading levels, answer block first, every link phrase a real link, one
      captioned table, FAQ unique sitewide, `relatedServices` declared, 900 unique words.
- [ ] `BlogPosting` + one `BreadcrumbList` (+ `FAQPage` from the block); `author` is the organisation.
- [ ] `npm run gate` passes; `hebrew-editor` → `claims-verifier` (→ `article-auditor` for a migrated
      post) have signed off.

## Gotchas

- `lib/posts.ts` is untrusted input, not a model to imitate — its structure is what the ADR replaces.
- A clean repo is not a clean site: as of 2026-08-23 the Phase-0 cleanup has not been deployed, so the
  live domain still serves the injected token and the dead tails (content-calendar §4). Confirm with
  the post-deploy checks in `/deploy-dangates` before telling anyone the blog is clean.
- A 301 from `/blog/<slug>/` to a guide is only valid once the guide is published to the
  `article-auditor` bar; redirecting to a stub or a thin page trades one problem for another.
- Two posts share a publish date (12/05/2025); do not "fix" that — it is the real sitemap date.
