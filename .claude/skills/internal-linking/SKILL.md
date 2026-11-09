---
name: internal-linking
description: Build the link mesh on dangates — a header that reaches all 7 services and 14 locations in one hop (two disclosures from lib/nav.ts, built in Sprint 6.5, fd72698), the footer that lists all 14 locations (since Sprint 6; 18 until four were retired on owner-actions 3.6), the service ↔ location mesh both ways from lib/nearby.ts, cityContent.services and ServiceDepth.locations (built in Sprints 5–6), relevance-based related services and posts instead of .slice(0, 4), the blog's lost in-copy links, the three-axis mesh (city × gate type × symptom) with the guides hub and its reverse index, breadcrumbs kept in parity with BreadcrumbList, and links.mjs as the proof. Use when wiring related links, fixing orphans or chrome gaps, or auditing navigation. Triggers: "internal linking", "orphan pages", "navigation", "related links", "footer links", "mega menu", "breadcrumbs", "קישורים פנימיים", "תפריט".
allowed-tools: Read, Edit, Grep, Glob, Bash
---

# Internal linking

Forty-seven content pages (46 in the sitemap, plus the `noindex` `/תודה/`) whose graph was close to a
star until Sprints 5–6: everything hung off the homepage and the chrome, and almost nothing connected
sideways. Measure before you touch it:

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

## Current state (as of 2026-11-09, at `2b0d802`, after the Sprint 6 header `fd72698` — re-run before quoting)

| Finding                                                                                                                                                              | Anchor                                                                                            | Metric                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ The header reaches all 7 services and 14 locations in one hop since `fd72698` — two disclosures from `headerMenus`, the same groups in the mobile menu            | `lib/nav.ts` `headerMenus` / `headerLinks`; `components/layout/DesktopNav.tsx`, `MobileMenu.tsx`  | 21 service and location hrefs in the homepage `<header>`; `chromeLinks: 31` (unchanged — the footer already carried them); backlog §9.1 ✅, Sprint 6.5      |
| ✅ All locations in the chrome since `7c3f2db` — the footer renders `locations.map` (14 since `7ed1acd`)                                                             | `components/layout/Footer.tsx`                                                                    | `notInChrome: 0` (6 before: אשקלון, באר שבע, דרום, צפון, קריות, שרון), `orphans: 0` — backlog §9.2 ✅                                                       |
| ✅ The service ↔ location mesh both ways: service → 5–6 cities (Sprint 5); location → 2–4 neighbours and 4–7 services (Sprint 6)                                     | `ServiceDepth.locations`; `nearbyPairs` in `lib/nearby.ts`; `cityContent.services`                | backlog §9.3 ✅ — measured on `<main>`; 13 of 14 locations receive 2–4 neighbour links, חיפה 1 (`7ed1acd`); 0 asymmetric edges after `fd72698`              |
| ✅ Related posts on the post pages by relevance since `9886dd1` — `.slice(0, 4)` by array order until then, the same 5 leading siblings absorbing every related link | `relatedPosts()` in `lib/related-posts.ts`; the service route uses declared lists since `225ff45` | `relatedServiceTargets: 7` ✅ (2 of 7 never linked until Sprint 5), `relatedPostTargets: 11` ✅ (5 until `9886dd1`; 6 of 11 never linked) — backlog §9.4 ✅ |
| Blog in-copy links: zero — ~42 anchor-shaped phrases survived migration as dead text                                                                                 | `lib/posts.ts` (the emoji lines `spam-grep.mjs` counts — 27 since `379eb0e`)                      | backlog §3.8, §9.5                                                                                                                                          |

Posts and guides are reached only via indexes and related links (the `links.mjs` info line) — by
design, not a gap. Breadcrumbs are **not** a finding any more: `PageHeader` emits `BreadcrumbList` on all 45 nested
pages (`breadcrumbPages: 45`, 2026-11-09) — §7 is about keeping that parity, not creating it.

## 1. Header — all 7 services and 14 locations in one hop (✅ since `fd72698`)

Built in Sprint 6.5 (2026-11-09, change set 6N). `headerMenus` in `lib/nav.ts` lists every service
and every location from `services` / `locations` — never a hand-typed subset, so a new entry
appears without an edit — and `headerLinks` is what is left of `headerNav` once the two hubs it
replaces are removed. Labels in `headerMenuCopy` (`lib/content.ts`). The rules that keep it right:

- `Header` stays a server component (since `60ce109`); the state lives in the two client leaves it
  renders, `DesktopNav` and `MobileMenu`, which take the menus as props. Never move it back into
  `Header`.
- Keyboard-operable: each `DesktopNav` trigger has `aria-expanded` + `aria-controls`, Escape closes
  and returns focus to it, an outside click closes the panel, and an open panel carries
  `data-live-block` (CLAUDE.md §14). It is non-modal — no Tab trap, no scroll lock. `MobileMenu`
  carries the same two groups inside its existing focus trap (§11.4 ✅, `/responsive-accessibility`).
- Write new entries with the trailing slash (`/שירותים/`) — every `navItems` href carries one
  since N10 (2026-09-06).

Proof: `links.mjs` cannot tell a header link from a footer link — the 7 services and 14 locations
were **already** chrome via the footer (since `7c3f2db`), so the header changed no metric on its own
(`chromeLinks 31` before and after). Verify it directly — it prints 21 as of 2026-11-09:

```bash
sed -n '/<header/,/<\/header>/p' out/index.html | grep -oE 'href="/(services|locations)/[^"]*"' | sort -u | wc -l
```

## 2. Footer — all 14, no slice (✅ since `7c3f2db`)

`components/layout/Footer.tsx` renders `locations.map` — the `slice(0, 12)` that dropped six cities
is gone (Sprint 6.6, 2026-11-09). Never truncate it again; the list is a `grid-cols-2`, so 14 fits (18 did, before `7ed1acd`).
The NAP block correctly shows `serviceAreaLine` (`lib/content.ts`, since `1796ee7`) and the phone —
no street address exists and none gets invented (`/local-seo-il` §1).

Since `fd72698` each footer service and location link is a 44px row on a phone (`min-h-11`, compact
again from `lg`). Proof: `links.mjs` → `notInChrome: 0` (since `7c3f2db`) and `chromeLinks: 31` (34
at `7c3f2db`, 35 with the hub, 31 since `7ed1acd` retired four locations).

## 3. Service ↔ location mesh — built (Sprints 5–6)

- **Service page → 4–6 cities** from `serviceDepth[slug].locations` — built in Sprint 5
  (`225ff45`): 5–6 per page under "מחפשים שירות בעיר שלכם?", rotated so each published city sits on
  2+ services, never an unconfirmed region (business-facts §E). No demand data chose them; revisit
  with Search Console.
- **Location page → 2–4 neighbours** from `nearby(slug)` in `lib/nearby.ts` — built in Sprint 6
  (`7c3f2db`): one list of unordered `nearbyPairs`, read both ways, so a one-way edge cannot be
  written; module-load throws on a self-pair and a duplicate. A pair is geography, never a coverage
  claim.
- **Location page → services**: `cityContent[slug].services` plus every service whose
  `ServiceDepth.locations` names the city (the reverse direction), with a link to `/שירותים/`.

Never fake an edge with a hand-typed list in a route file — add a pair to `nearbyPairs` or a slug to
the data. Proof (measured on `<main>`, 2026-11-09, after `7ed1acd`): 13 of 14 location pages link and
receive 2–4 neighbours; חיפה links and receives 1 (נתניה — far, but the nearest published page, the
documented exception in content-standards §3 block 5, under its own `nearbyHeading`); every location
page links 4–7 services; `links.mjs` → `orphans 0`. Re-read after `fd72698`: 0 asymmetric edges,
and every city a service page links links that service back.

## 4. Relevance-based related items

The service half is done (Sprint 5, `225ff45`): the service route renders
`serviceDepth[slug].relatedServices` (2–4) and `relatedPosts` (0–3) in declared order, and
`lib/service-depth.ts` throws on a self-reference, a duplicate or an unknown post slug. A total
`Record<ServiceSlug, …>` means a service with no entry fails typecheck instead of silently
inheriting the first four. `relatedServiceTargets: 7`, and the service-page monotony warning is
gone. The post half followed in `9886dd1` (2026-11-09) without waiting for the post rewrite:
`relatedPosts(slug)` in `lib/related-posts.ts` ranks the other posts by the rare word stems they
share, deterministically, repairs the set so every post is reached, and throws at module load on a
self-link, a duplicate, a wrong count or an unreached post. Proof: `relatedPostTargets 11` (every
post) and no post-page monotony warning (`links.mjs` prints none).

## 5. Contextual in-copy links

Zero exist today, but the blog is **already written as if they do** — "למידע נוסף על עלויות התחזוקה
והמחירים", "היכנסו למחירון", "בקרו בעמוד צור קשר" — anchor written, target obvious, `<a>` missing.
Making them real needs the typed block model (`paragraph.links: InlineLink[]`, anchor verbatim in the
text or the build throws); `/new-article` Operation B does it per post.

`serviceDepth` and `cityContent` landed with their links in lists below the prose, none inside it;
when the depth copy is next edited, each should carry 2–3 links **inside the prose** with
descriptive Hebrew anchors (the content types would need an inline-link field first):

- ✅ `<Link href="/services/שערים-נגררים/">תיקון מנוע לשער נגרר</Link>`
- ❌ "לחצו כאן", "למידע נוסף", a bare URL

## 6. The three-axis mesh — city × gate type × symptom

Every page should be reachable along at least two axes; a page on one axis only is a weak node.

| Axis                                  | Pages                         | Links out to                                                                                                                   | Links in from                                                                                |
| ------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **City** (`/locations/`)              | 14                            | all 7 services · `nearby` cities · `guidesForLocation(slug)`                                                                   | header, footer, `/איזורי-שירות/` · `serviceDepth.locations` · guides' `relatedLocations`     |
| **Gate type** (`/services/`)          | 7                             | `relatedServices` · `locations` · `guidesForService(slug)` · `/מחירון/`                                                        | header, footer, `/שירותים/`, every location page · guides' `relatedServices`                 |
| **Symptom / component** (`/מדריכים/`) | 4 guides (Sprint 7, ADR 0002) | `relatedServices` (validated at module load; capped CTAs down to the transactional page) · `relatedLocations` · sibling guides | the hub `ItemList` · the reverse index on service and location pages · homepage FAQ `moreAt` |

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

`/שירותים/`, `/איזורי-שירות/`, `/blog/` and `/מדריכים/` are the natural hubs. They carried almost no
prose until Sprints 6–7 (111/250 for the two indexes on 2026-08-24, backlog §3.13 ✅); as of
2026-11-09 `content-depth.mjs` reads 1018 / 526 / 548 / 870 unique words, each over its 250 floor,
from their own `content/pages/` modules. Keep each intro linking contextually into its children; an
index that is only a grid is a weak hub.

## Proof

```bash
npm run build && node scripts/audit/links.mjs
```

Target: `orphans: 0` · `notInChrome: 0` · `chromeLinks: 31` (met since `7ed1acd`; 28 before the
footer fix) · `brokenLinks: 0` · `linksToStubs: 0` · `breadcrumbPages` = content pages − 2 (45 of
47: `/` and `/תודה/` carry none) · `relatedServiceTargets: 7` · `relatedPostTargets` = every
surviving post · no monotony warning · no `notInChrome` warning for the guides (they are reached via
the hub and the reverse index, not the chrome — `links.mjs` only flags a type whose siblings are in
the chrome; it holds since `89439b7`) · 21 header hrefs. `stubs` reads 0: the 37 meta-refresh
stubs were deleted for real 301s in 2026-09 (ADR 0004).

## Checklist

- [ ] All 7 services and 14 locations reachable in one hop from the header, from the data arrays (✅ since `fd72698`).
- [ ] Footer renders all 14 locations — no `slice` (✅ since `7c3f2db`).
- [ ] Every service page links 4–6 locations (✅ since Sprint 5); every location page links 2–4 nearby, both ways (one link only where no other published place is near — חיפה).
- [ ] Related services and posts come from declared adjacency, not `.slice(0, 4)` (✅ on service pages since `225ff45`, on post pages since `9886dd1`).
- [ ] The blog's plain-text link references are real links (after the block-model migration).
- [ ] Guides declare `relatedServices`; the reverse index places them on service pages.
- [ ] Breadcrumbs render and emit exactly one `BreadcrumbList` from the same array.
- [ ] `links.mjs` meets the targets above; the header menu passes `/responsive-accessibility`.

## Gotchas

- Hebrew `href`s are written unescaped in JSX and percent-escaped on output — don't pre-encode them.
- Next normalises internal `href`s to the trailing-slash form on export; don't hand-append slashes to
  "fix" links that already resolve — but do write new `navItems` entries with the slash, as every
  existing one has since N10.
- `links.mjs` measures the export; rebuild before asserting (N12) or `run-all.mjs` refuses a stale
  `out/`.
- Adding links to a thin page doesn't fix the thin page. Depth first (`/new-city`, `/new-service`),
  then the mesh.
