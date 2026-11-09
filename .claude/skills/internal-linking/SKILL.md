---
name: internal-linking
description: Build the link mesh on dangates — a header that reaches all 7 services and 18 locations in one hop, a footer that stops dropping six location pages from the chrome, the service ↔ location mesh from the Phase-3 nearby / relatedServices / locations data, relevance-based related services and posts instead of .slice(0, 4), the blog's lost in-copy links, the three-axis mesh (city × gate type × symptom) with the guides hub and its reverse index, breadcrumbs kept in parity with BreadcrumbList, and links.mjs as the proof. Use when wiring related links, fixing orphans or chrome gaps, or auditing navigation. Triggers: "internal linking", "orphan pages", "navigation", "related links", "footer links", "mega menu", "breadcrumbs", "קישורים פנימיים", "תפריט".
allowed-tools: Read, Edit, Grep, Glob, Bash
---

# Internal linking

Forty-five content pages whose graph is close to a star: everything hangs off the homepage and the
chrome, and almost nothing connects sideways. Measure before you touch it:

```bash
node scripts/audit/links.mjs          # orphans, chrome reach, related monotony, breadcrumbs, parity, H1/heading order
node scripts/audit/links.mjs --json   # metrics: chromeLinks, notInChrome, orphans, relatedServiceTargets, relatedPostTargets
```

**The live surfaces are not links (CLAUDE.md §14).** The announcement bar and the seasonal card sit
on every page, hidden until their season, so `links.mjs` strips both regions before it builds the
graph: counted, the guide a seasonal line points at would read every page as an inbound link
(masking a real orphan), and its href would join the chrome set and turn the ten sibling posts into
`notInChrome` warnings. A hand-rolled in-degree count must strip them too —
`perl -0777 -pe 's/<div class="live-topbar".*?<\/div><\/div>//gs; s/<div class="live-dialogs".*?<\/dialog><\/div>//gs'`.
The homepage updates strip is inside `<main>` and counts: it is content on one page.

## Current state (as of 2026-08-23, the service rows re-measured 2026-11-09 after Sprint 5 — re-run before quoting)

| Finding                                                                                                                                               | Anchor                                                                                           | Metric                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Header reaches no service or location — it renders `navItems` only; the footer is the only chrome that does, and it carries 7 services + 12 locations | `components/layout/Header.tsx`; `navItems` at `lib/content.ts`                                   | `chromeLinks: 28` (6 nav + 7 services + 12 locations + home, blog, legal); posts reached only via indexes          |
| Six locations missing from the chrome (אשקלון, באר שבע, דרום, צפון, קריות, שרון)                                                                      | `components/layout/Footer.tsx` `locations.slice(0, 12)`                                          | `notInChrome: 6`, `orphans: 0` (only `/איזורי-שירות/` saves them)                                                  |
| Service → location: 5–6 cities per service page since Sprint 5 (13 distinct, each on 2+ services); location → location: zero                          | `ServiceDepth.locations` (`content/services/<slug>.ts`); no `nearby` yet — Phase 3               | backlog §9.3 PARTIAL                                                                                               |
| Related posts on the post pages by array order — the same 5 leading siblings absorb every related link                                                | `app/blog/[slug]/page.tsx` `.slice(0, 4)`; the service route uses declared lists since `225ff45` | `relatedServiceTargets: 7` ✅ (2 of 7 never linked until Sprint 5), `relatedPostTargets: 5` (6 of 11 never linked) |
| Blog in-copy links: zero — 42 anchor-shaped phrases survived migration as dead text                                                                   | `lib/posts.ts` (the 42 emoji lines `spam-grep.mjs` counts)                                       | backlog §3.8, §9.5                                                                                                 |

Breadcrumbs are **not** a finding any more: `PageHeader` emits `BreadcrumbList` on all 44 nested
pages (`breadcrumbPages: 44`) — §7 is about keeping that parity, not creating it.

## 1. Header — all 7 services and 18 locations in one hop

Add a disclosure (desktop: two-column panel; mobile: nested inside the existing menu) listing every
service and every location from `services` / `locations` — never a hand-typed subset. Constraints:

- `Header` is a server component since `60ce109` (2026-11-08); the client state lives in the
  `MobileMenu` leaf. Put the disclosure's state in that leaf (or a sibling leaf), never back in `Header`.
- Keyboard-operable: reuse `MobileMenu`'s pattern — `aria-expanded` + `aria-controls`, Escape closes
  and returns focus to the trigger, a Tab trap while open (§11.4 ✅, `/responsive-accessibility`).
- `navItems` hrefs lack the trailing slash (`/שירותים`, not `/שירותים/` — N10). Next normalises on
  export, but write the canonical form in new entries.

Proof: `links.mjs` cannot tell a header link from a footer link — the 7 services and 12 locations are
**already** chrome via the footer, so the header changes no metric on its own. Verify it directly
(must print 25) and run the menu through `/responsive-accessibility`; the chrome metrics move with §2:

```bash
sed -n '/<header/,/<\/header>/p' out/index.html | grep -o 'href="/\(services\|locations\)/[^"]*"' | sort -u | wc -l
```

## 2. Footer — all 18, no slice

Delete the `locations.slice(0, 12)` in `components/layout/Footer.tsx`; the list is already a
`grid-cols-2`, so 18 fits. Truncation is what created the gap. The NAP block correctly shows
`serviceAreaLine` (`lib/content.ts`, since `1796ee7`) and the phone — no street address exists and none gets invented
(`/local-seo-il` §1).

Proof: `links.mjs` → `notInChrome: 0` and `chromeLinks: 34` (28 + the six cities).

## 3. Service ↔ location mesh — from the Phase-3 model

The service half exists since Sprint 5 (`225ff45`, `/new-service`); the location half does not yet
(`/new-city`, `/improve §3.1`):

- **Service page → 4–6 cities** from `serviceDepth[slug].locations` — built: 5–6 per page under
  "מחפשים שירות בעיר שלכם?", rotated so each published city sits on 2+ services, never an
  unconfirmed region (business-facts §E). No demand data chose them; revisit with Search Console.
- **Location page → 2–4 neighbours** from `cityContent[slug].nearby`, declared **on both sides**; a
  region's "nearby" is its constituent cities, never another region.
- The full service list on every location page already exists (`serviceCards.map`); keep it.

Until `nearby` lands, do not fake the location edge with a hand-typed list in a route file — that is
the same pattern as the shared `triggers` array.

## 4. Relevance-based related items

The service half is done (Sprint 5, `225ff45`): the service route renders
`serviceDepth[slug].relatedServices` (2–4) and `relatedPosts` (0–3) in declared order, and
`lib/service-depth.ts` throws on a self-reference, a duplicate or an unknown post slug. A total
`Record<ServiceSlug, …>` means a service with no entry fails typecheck instead of silently
inheriting the first four. `relatedServiceTargets: 7`, and the service-page monotony warning is
gone. **Left:** the post route's `.slice(0, 4)` — a `relatedServices` / `related` field on posts and
guides (Phase 4, ADR 0003; Sprint 7.3). Proof: `relatedPostTargets` = every surviving post, and the
post-page monotony warning disappears.

## 5. Contextual in-copy links

Zero exist today, but the blog is **already written as if they do** — "למידע נוסף על עלויות התחזוקה
והמחירים", "היכנסו למחירון", "בקרו בעמוד צור קשר" — anchor written, target obvious, `<a>` missing.
Making them real needs the typed block model (`paragraph.links: InlineLink[]`, anchor verbatim in the
text or the build throws); `/new-article` Operation B does it per post.

`serviceDepth` landed with its links in lists below the prose, none inside it; as `cityContent` lands
and the depth copy is next edited, each should carry 2–3 links **inside the prose** with descriptive
Hebrew anchors:

- ✅ `<Link href="/services/שערים-נגררים/">תיקון מנוע לשער נגרר</Link>`
- ❌ "לחצו כאן", "למידע נוסף", a bare URL

## 6. The three-axis mesh — city × gate type × symptom

Every page should be reachable along at least two axes; a page on one axis only is a weak node.

| Axis                                  | Pages                      | Links out to                                                                                                                   | Links in from                                                                                |
| ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **City** (`/locations/`)              | 18                         | all 7 services · `nearby` cities · `guidesForLocation(slug)`                                                                   | header, footer, `/איזורי-שירות/` · `serviceDepth.locations` · guides' `relatedLocations`     |
| **Gate type** (`/services/`)          | 7                          | `relatedServices` · `locations` · `guidesForService(slug)` · `/מחירון/`                                                        | header, footer, `/שירותים/`, every location page · guides' `relatedServices`                 |
| **Symptom / component** (`/מדריכים/`) | guides (Phase 4, ADR 0002) | `relatedServices` (validated at module load; capped CTAs down to the transactional page) · `relatedLocations` · sibling guides | the hub `ItemList` · the reverse index on service and location pages · homepage FAQ `moreAt` |

The **reverse index** is what makes an orphaned guide structurally impossible: a guide that declares
`relatedServices: ["שערים-נגררים"]` appears on `/services/שערים-נגררים/` through `guidesForService`
without anyone editing the service page (ADR 0003; galbath `lib/articles.ts` is the reference).
Symptom pages stay informational — they link **down** to the service with at most two CTAs and never
duplicate a service title (`/content-hub` throws on that). The homepage FAQ's `moreAt` contract links
each long answer out to its guide, which is the third axis' entry from the most-linked page on the
site.

## 7. Breadcrumbs — keep the parity

`PageHeader` renders the visible trail **and** the `BreadcrumbList` from the same `crumbs` array, so
they cannot drift. Never add a second `BreadcrumbList` on a page; when Phase 2 moves the node into a
single `@graph`, `PageHeader` stops emitting its own script in the same change (schema-graph §7,
`.claude/rules/schema-jsonld.md`). `links.mjs` fails any nested page without one.

## 8. Hub pages

`/שירותים/`, `/איזורי-שירות/` and `/blog/` (and `/מדריכים/` when built) are the natural hubs and carry
almost no prose — `content-depth.mjs`: 111/250 for the two indexes (backlog §3.13). Give each an intro
that links contextually into its children; an index that is only a grid is a weak hub.

## Proof

```bash
npm run build && node scripts/audit/links.mjs
```

Target: `orphans: 0` · `notInChrome: 0` · `chromeLinks: 34` (28 today + the six cities the footer
drops) · `brokenLinks: 0` · `linksToStubs: 0` · `breadcrumbPages` = content pages − 1 ·
`relatedServiceTargets: 7` · `relatedPostTargets` = every surviving post · no monotony warning · no
`notInChrome` warning when `/מדריכים/` lands (guides are reached via the hub and the reverse index,
not the chrome — `links.mjs` only flags a type whose siblings are in the chrome). The 37 redirect
stubs are `noindex` by design and are meant to be unlinked; `links.mjs` counts them separately
(`stubs`).

## Checklist

- [ ] All 7 services and 18 locations reachable in one hop from the header, from the data arrays.
- [ ] Footer renders all 18 locations — no `slice`.
- [ ] Every service page links 4–6 locations (✅ since Sprint 5); every location page links 2–4 nearby, both ways.
- [ ] Related services and posts come from declared adjacency, not `.slice(0, 4)` (✅ on service pages; posts left).
- [ ] The blog's plain-text link references are real links (after the block-model migration).
- [ ] Guides declare `relatedServices`; the reverse index places them on service pages.
- [ ] Breadcrumbs render and emit exactly one `BreadcrumbList` from the same array.
- [ ] `links.mjs` meets the targets above; the header menu passes `/responsive-accessibility`.

## Gotchas

- Hebrew `href`s are written unescaped in JSX and percent-escaped on output — don't pre-encode them.
- Next normalises internal `href`s to the trailing-slash form on export; don't hand-append slashes to
  "fix" links that already resolve — but do write new `navItems` entries with the slash (N10).
- `links.mjs` measures the export; rebuild before asserting (N12) or `run-all.mjs` refuses a stale
  `out/`.
- Adding links to a thin page doesn't fix the thin page. Depth first (`/new-city`, `/new-service`),
  then the mesh.
