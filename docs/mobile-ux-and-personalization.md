# Mobile UX & personalisation — the buyer standing at a stuck gate

> **Layer:** standards. This file decides what the mobile experience must do for a visitor whose gate
> will not open, and what "personalisation" may and may not mean on a static export served as one
> file to everyone. The how-to is `conversion-cro` (the bar, the form), `responsive-accessibility`
> (targets, contrast, focus), `hebrew-rtl` (the utilities) and `new-city` (the only personalisation
> worth building); `perf-a11y-auditor`, `cro-engagement-auditor` and `ts-react-reviewer` audit against
> it; `a11y.mjs`, `rtl-lint.mjs`, `cta-coverage.mjs` and `edge.mjs` measure it. Reads with:
> [content-standards.md](content-standards.md), [ux-cro-security.md](ux-cro-security.md),
> [accessibility-and-i18n.md](accessibility-and-i18n.md),
> [performance-guidelines.md](performance-guidelines.md), [event-taxonomy.md](event-taxonomy.md),
> [cloudflare-runbook.md](cloudflare-runbook.md), [owner-actions.md](owner-actions.md),
> [optimization-backlog.md](optimization-backlog.md), [business-facts.md](business-facts.md).
>
> One rule governs both halves: **the page a crawler indexes is the page every visitor gets.** Mobile
> work makes that one page reachable with a thumb; personalisation may only add a post-hydration
> convenience on top of it, never a different page.

---

## 0. Current state — verified 2026-08-24

Figures from `docs/audits/2026-08-24-full.md` unless a row says 2026-09-06 (source or `curl` that
day). Backlog ids (`§8.1`, `N1`) mean `optimization-backlog.md`; this file's sections read "§5 item 6".

| Item                                                                                                           | State                                                                                                                                                                                                                                                                                                      | Proof · backlog                                                     |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Sticky mobile bar: call + WhatsApp, `data-cta="sticky-call"` / `"sticky-whatsapp"`, `lg:hidden`, `h-16` spacer | ✅ built — `MobileCtaBar`, spacer in `app/layout.tsx`; both halves counted once as chrome CTAs                                                                                                                                                                                                             | `cta-coverage.mjs` → `chromeCtas: 6`                                |
| WhatsApp half of the bar                                                                                       | ❌ white on `#25D366` = **1.98:1**; the hex literal sits in `MobileCtaBar`, `Button` and `/צור-קשר/` (three files)                                                                                                                                                                                         | `a11y.mjs`, `rtl-lint.mjs` → §11.1, §11.5                           |
| Accent call buttons on hover                                                                                   | ❌ `accent-foreground` on `accent-600` = **2.76:1**; `accent-500` (6.79:1) already defined                                                                                                                                                                                                                 | `a11y.mjs` → §11.1, N11                                             |
| Header call button                                                                                             | `hidden sm:inline-flex` — absent below 640 px; `PageHeader` carries no CTA, so at 375 px on every inner page except `/צור-קשר/` (its contact list has a `tel:` link near the top of the body) the bar is the only call action without scrolling (computed from the classes 2026-09-06; verify in DevTools) | `Header`, `PageHeader` source                                       |
| Lead form on a phone                                                                                           | ✅ `type="tel"` + `inputMode="tel"` + `autoComplete="tel"` + `dir="ltr"`; ❌ `text-right`, no `aria-invalid`, no `pattern`, error state renders nothing, no `city`, no `/תודה/`. Renders on `/` (`Hero`) and `/צור-קשר/` only                                                                              | `a11y.mjs`, `rtl-lint.mjs` → §8.1, §8.3, §8.4, §11.5, N1            |
| Mobile menu                                                                                                    | ❌ `aria-expanded` without `aria-controls`, no focus trap, no Escape, no scroll lock                                                                                                                                                                                                                       | `a11y.mjs` → §11.4                                                  |
| `Permissions-Policy`                                                                                           | live `geolocation=(), microphone=(), camera=()` from a **zone rule** (curl 2026-09-06); no `public/_headers`                                                                                                                                                                                               | `edge.mjs` → `headersFile: false`, §12.1                            |
| Server-side personalisation surface                                                                            | none — no `wrangler.toml` / `wrangler.json(c)`, no `functions/`, no `public/_worker.js` (2026-09-06). `.wrangler/` at the root is the CLI's local temp state, not configuration                                                                                                                            | `ls`; `ops/deploy-site.ps1` uploads `out/` only                     |
| Client-side personalisation                                                                                    | none — the four client components (`Header`, `Faq`, `LeadForm`, `Reveal`) read no storage                                                                                                                                                                                                                  | `rtl-lint.mjs` → `clientComponents: 4`                              |
| Emergency / WhatsApp facts the bar depends on                                                                  | 🔶 "24/7" unconfirmed (owner-actions 3.5); 🔶 WhatsApp on `072-2587772` unconfirmed (owner-actions 3.7)                                                                                                                                                                                                    | `claims-grep.mjs` → `around-the-clock` live on 42 pages; §5.4, §7.2 |

---

## Part I — Mobile UX

### 1. Design assumptions

| Assumption       | Value for this buyer                                                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Situation        | A gate that will not open or close. The visitor is at the gate — in a car in the driveway, at a building entrance, sometimes at night, sometimes with traffic behind them. A ועד בית member may be forwarding a neighbour's complaint. |
| Posture          | One hand, thumb only; the other hand holds a remote, a key or a steering wheel. Glare, rain, a dark driveway.                                                                                                                          |
| Urgency          | High. The decision is "who do I call", not "which company is best". Seconds to a working `tel:` link matter more than any section below the fold.                                                                                      |
| Primary viewport | 360–430 px wide. Test at 375 px first, 360 px second, 320 px for reflow. RTL — DOM order decides what sits on the right (§2 below).                                                                                                    |
| Network          | Assume a cold cache and a driveway with weak signal. A text-only page with a preloaded font (not yet — §10.1) is the whole budget.                                                                                                     |
| What they need   | The number, WhatsApp, a 40–60 word answer to "can you come, how fast, what decides the cost" (content-standards §5), and nothing that blocks any of those.                                                                             |

**Mobile-first is literal.** Base utilities are written for 375 px; `sm:` and `lg:` add upward. There
is no `tailwind.config.ts` — tokens live in the `@theme` block of `app/globals.css` and every colour
on a mobile surface comes from there (`hebrew-rtl`). A style written desktop-first and patched
downward is how a hidden header button becomes the only header on a phone (§0).

### 2. The thumb zone, in RTL

```text
┌─────────────────────────┐
│  HARD  ·  stretch       │  top — logo (start side), hamburger (end side).
│                         │  Never a primary action here on a phone.
├─────────────────────────┤
│  OK    ·  reachable     │  H1, the answer block, body copy
│                         │
├─────────────────────────┤
│  EASY  ·  natural       │  ← MobileCtaBar: call (start/right) · WhatsApp (end/left)
└─────────────────────────┘
```

The reach arc depends on which hand holds the phone, not on text direction, so the **bottom third**
stays the primary-action zone in RTL as in LTR. What RTL changes is **scan order**: the eye enters at
the top-right, and `dir="rtl"` renders the first DOM child of a row on the right. So the
higher-priority item goes **first in the DOM** and lands on the start side. Never reorder visually
with `flex-row-reverse` — fix the DOM order. CLAUDE.md §6 allows `flex-row-reverse` only to wrap an
LTR island; the `direction-agnostic` marker is a different thing — the per-line exemption from the
physical-utility lint (`hebrew-rtl`), with no effect on `flex-row-reverse`.

- `MobileCtaBar` is `grid grid-cols-2`, call first → right, WhatsApp second → left. That is the
  conversion order in CLAUDE.md §1 (phone → WhatsApp → form) rendered as geometry. ✅
- The `Header` puts the logo first (right) and the hamburger last (left, `lg:hidden`). Top-left is
  the hardest corner for a right thumb, acceptable for a **secondary** action; the menu's own
  full-width `size="lg"` call button restores a primary action once it opens. Tab order follows DOM
  order too, so the same rule keeps keyboard and screen-reader order correct.

### 3. Mobile rules

1. **The sticky bar is a contract.** `MobileCtaBar` stays `fixed inset-x-0 bottom-0 lg:hidden`, two
   halves — `telHref` and `whatsappHref(...)` from `lib/site-config.ts`, never a literal number —
   each tagged `data-cta` (`cta-coverage.mjs` counts them once as chrome), with the `h-16 lg:hidden`
   spacer in `app/layout.tsx` so it never covers the footer. It carries the two live defects of §0:
   the `#25D366` literal and its 1.98:1 contrast. The fix is one token pair in `@theme` applied in
   all three files (`responsive-accessibility`), not a bar redesign — §11.1, §11.5.
2. **A call action without scrolling on every page at 375 px.** Today that is the bar alone on every
   inner page except `/צור-קשר/`, because the header button is `hidden sm:inline-flex` and
   `PageHeader` has no CTA (§0). Acceptable **only while the bar exists**; a change that hides the bar
   on any route must add a visible `tel:` above the fold on that route. The `conversion-cro`
   checklist owns this.
3. **Tap targets ≥ 44 × 44 px, ≥ 8 px apart.** Computed from the classes in `Button` and the bar:
   `size="lg"` (`py-3.5 text-base`) and the bar halves (`py-3.5`, body 16 px) render ~52 px ✅;
   `size="md"` (`py-2.5 text-sm`) renders ~40 px ❌ — use `lg` for any tap-first action on a phone;
   the hamburger is `h-10 w-10` = 40 px ❌; mobile-menu links (`py-2.5 text-base`) ~44 px ✅. Verify
   the rendered box, not the class.
4. **`tel:` and WhatsApp links everywhere.** Every visible number is an `<a href={telHref}>` with
   `dir="ltr"` on the digits; every WhatsApp exit is a real `<a href={whatsappHref(...)}>`, never
   `window.open` — a link cannot be popup-blocked and a click trigger can see it (event-taxonomy
   `whatsapp_click`; the two `window.open` calls in `LeadForm` are §13.2 / N1). The success screen
   after a form send carries a clickable `tel:` (§8.3).
5. **The form on a phone.** Phone: `type="tel"` + `inputMode="tel"` + `autoComplete="tel"` +
   `dir="ltr"` ✅; name: `autoComplete="name"` ✅; the city `<select>` from `locations` (§8.4);
   `text-end`, not `text-right`, inside the LTR island (§11.5). Inputs keep the body 16 px — below
   that iOS Safari zooms on focus and reflows the page; never "fix" it with `maximum-scale` or
   `user-scalable=no`. Per-field errors with `aria-invalid` + `aria-describedby`, focus to the first
   invalid field, a phone pattern that accepts landlines and `072-` (§8.1); the delivery-failure state
   renders a message, a WhatsApp **link** and a `tel:` link (N1). Full spec: ux-cro-security §2 and
   `conversion-cro`.
6. **No pop-ups, no interstitials, no self-opening chat.** Nothing may appear between the visitor
   and the number (`engagement-ux`). A future chat or consent widget may not occlude the bar.
7. **The answer block above the fold.** Under the H1 on services, locations, posts and — once built —
   guides: 40–60 words answering "do you come here, how fast, what decides the cost"
   (content-standards §5). Today 0 of the 36 service, location and post pages have one (§6.2,
   `content-depth.mjs` answer-block proxy). At 375 px it must be visible before the first scroll.
8. **Nothing reflows.** Any `<table>` (guides, the price-driver table of N14) sits in a wrapper with
   `overflow-x: auto`; the body never scrolls horizontally at 320 px; when photos land
   (business-facts §F) every one ships with `width` and `height` through `SiteImage` (`site-images`).
9. **Reduced motion is honoured.** The `prefers-reduced-motion` reset in `app/globals.css` and
   `Reveal`'s visible-first paint stay. No `framer-motion` (§10.3): a JS animation would need its own
   `useReducedMotion()` gate. Nothing animates on the conversion path.
10. **The mobile menu** gets `id` + `aria-controls`, Escape, a focus trap and scroll lock when the
    `Header` is split into a server shell and a `MobileMenu` leaf (§11.4, `performance-web-vitals`);
    its close control sits in the thumb zone, not only at the top corner.

### 4. What NOT to do on mobile

- No interstitial, overlay or pop-up before the content is readable — a mobile-usability signal
  against the page and a lost call.
- No fixed element that takes more than ~15 % of the viewport height. The bar is ~52 px of a 667 px
  viewport; the sticky header is 64 px; together they are the ceiling.
- No `user-scalable=no`, no `maximum-scale` — an accessibility failure and a false line in
  `/הצהרת-נגישות/`.
- No physical utilities to "fix" RTL geometry (`rtl-lint.mjs`, the `post-edit-lint.ps1` hook), and
  no `flex-row-reverse` for the same purpose — the latter is in neither regex and is caught only by
  `ts-react-reviewer` and the `hebrew-rtl` checklist.
- No new client component for a decoration. Four ship today (`rtl-lint.mjs`); each one is hydration
  JS on the phone that is trying to load a phone number (§10.2).

---

## Part II — Personalisation

### 5. The architecture reality — read this first

"Show the visitor content for their city" collides with six verifiable properties of this site.

1. **`output: "export"` — there is no server.** `next.config.mjs` sets `output: "export"` and
   `trailingSlash: true`; Next forbids `headers()`, `redirects()`, `rewrites()`, middleware, API
   routes and ISR under it (CLAUDE.md §3). One HTML file per route is built once and served to
   everyone; there is no request-time hook in this repo. (The config's stale cPanel comment is N7.)
2. **Production is `out/` and nothing else.** `ops/deploy-site.ps1` builds, gates `out/`, preserves
   `out.prev/`, then runs `wrangler pages deploy .\out` against the roster's project on branch
   `main`. Nothing in the repo puts a Function there — but that same command would compile a
   `functions/` directory at the site root and pick up an `out/_worker.js` (copied from `public/`)
   with no script change. So the §11 grep for those files is the guard, not the script. A Pages
   Function or an edge Worker is a **fleet-level ops decision and owner territory** (CLAUDE.md §12);
   `guard-destructive-ops.ps1` blocks the `wrangler pages deploy` command outside the deploy contract
   (`deploy-dangates`), not the file.
3. **One file is served to everyone.** The HTML comes from the Pages asset store
   (`cf-cache-status: DYNAMIC` — CLAUDE.md §10, live 2026-08-16). A Worker that varies it by country,
   city or cookie turns every request into compute and forces a cache key of its own — the site's
   simplest property traded for a cosmetic change on a text LCP.
4. **The browser Geolocation API is disabled, and stays disabled.** The live response carries
   `Permissions-Policy: geolocation=(), microphone=(), camera=()` — from a Cloudflare zone rule the
   repo does not own (cloudflare-runbook step 4, §12.1; read it with `curl -sSI https://dangates.co.il/`
   before quoting, never from this file). The planned `public/_headers`
   (`web-security-headers/templates/_headers`, §12.1) keeps `geolocation=()` and adds `payment=()`,
   `usb=()`. Either way: **never prompt a visitor standing at a stuck gate for GPS.** The prompt is a
   conversion event in the wrong direction, and the answer is less accurate than the URL they arrived on.
5. **Nothing a static export can read exposes the city.** `https://dangates.co.il/cdn-cgi/trace`
   exposes `loc=IL` and the colo (`TLV`) — a country code and a data-centre name (read 2026-09-06);
   `CF-IPCountry` is the same country code. City-level fields exist only on `request.cf` inside a
   Worker — the thing item 2 says this repo cannot ship — and are unreliable at Israeli city
   granularity anyway (item 6). Nothing here can tell חולון from באר שבע.
6. **Cloaking.** Serving visitors materially different main content than a crawler gets is cloaking.
   Googlebot crawls predominantly from the US, so an IP-based swap shows it the "not in Israel"
   variant of all 45 pages. IP geolocation inside Israel is also often wrong at city granularity —
   "ב<wrong city>" in an H1 is worse than no city. The location pages already fail the doorway test
   (§3.1); a geo swap would make them doorway pages that also cloak.

### 6. The insight: the 18 location pages are the personalisation

Someone searching `תיקון שער חשמלי בנתניה` lands on `/locations/נתניה/` and should see Netanya — named
areas, the local gate reality, travel at that distance, a city FAQ. That is personalisation delivered
by **routing**, and it beats a runtime swap on every axis that matters:

|               | Routing — the location pages                                                        | Runtime geo-swap                                               |
| ------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Indexable     | ✅ each city is its own URL in `sitemap.xml`                                        | ❌ one URL, variants invisible to the index                    |
| Served        | ✅ one static file from the asset store                                             | ❌ compute per request, a cache key of its own                 |
| CLS           | ✅ none (budget: performance-guidelines §1)                                         | ❌ content shifts after hydration                              |
| Cloaking      | ✅ none — crawler and visitor get the same file                                     | 🔴 real, and it lands on the domain                            |
| Accuracy      | ✅ the visitor's own query named the city                                           | ❌ country-level at the edge; city-level IP data is unreliable |
| Cost          | ✅ the routes, sitemap, breadcrumbs and areas index already exist                   | ❌ a Worker, a cache-key strategy, an owner decision           |
| What it needs | content — 350 unique words and a doorway delta ≥ 120 per city (`content-depth.mjs`) | infrastructure nobody in this repo may ship                    |

As of 2026-08-24 every location page carries 122–128 unique words against the 350 floor and a doorway
delta of 2–3 tokens against 120 — the city name is the only variable. **Therefore the personalisation
investment is content-standards §2 depth through `new-city`, which adds the data model that does not
exist yet — `kind` + `prefixed` (Phase 3, §5.2), `cityContent` and `nearby` (§3.1) — not a
geo-swap.** The same model gives the four region entries correct Hebrew (`באזור השרון`, not `בשרון` —
§5.2, content-standards §8); the Phase-2 `Service` + `areaServed` node per city (schema-graph §5, the
planned `lib/jsonld.ts` `locationServiceJsonLd` — §4.2) is the machine-readable half. Anyone proposing
runtime geo-targeting is pointed here first; `local-seo-strategist` reviews the plan.

### 7. What personalisation IS permitted

> Personalisation may never change indexable content. It may only change a **low-risk affordance**,
> after hydration, invisibly to crawlers, with zero layout shift, storing no PII, and degrading to a
> correct, complete page with JavaScript off or storage unavailable.

In order of value:

1. **Prefill the city from the route.** A location page knows its city at **build time**. Today that
   reaches only the WhatsApp prefill (item 2) — `LeadForm` renders on `/` and `/צור-קשר/` alone. If
   a form ever lands on `/locations/[city]/` (not a content-standards §3 required block), its `city`
   select (§8.4) renders with that city selected; on every other route it stays empty and is never
   filled from an IP or `loc=`. Zero JS, zero storage, exact because the visitor's query supplied it.
2. **Contextual WhatsApp prefill.** Today five surfaces share one generic string
   ("היי, אני מעוניין/ת בהצעת מחיר לתיקון/התקנת שער חשמלי") — `Hero`, `MobileCtaBar`, `FinalCta`, the
   `LeadForm` footer link and `/צור-קשר/` (grep `whatsappHref(` 2026-09-06) — and only the service
   page names the service. Target: service + city from the route, plus an invitation to send a photo
   or a short video of the gate — a picture of the motor housing or the track is the fastest
   diagnosis this business can get from a driveway. Example shape, for `hebrew-editor` to finalise:
   `שלום, יש לי בעיה ב{service} {prefixed}. אפשר לשלוח תמונה או סרטון קצר של השער?` — `{prefixed}` is
   the planned `new-city` field (`בתל אביב`, `באזור השרון`), never a bare `ב{city}` (§5.2). Built per
   route through `whatsappHref(message)`; no runtime lookup.
3. **Remember the last-viewed service.** On a service page write the slug to `localStorage`
   (`dangates:lastService`); on the next visit the form's service `<select>` opens on it. Options are
   `value={s.name}` today, so resolve the slug against `services` on mount or switch the value to
   `s.slug` in the same change (§8.1 touches the form anyway). Additive, no PII, a `useEffect` after
   mount that sets a `<select>` value — no layout shift; `try/catch`, so private browsing and cleared
   storage leave the default. WhatsApp itself is 🔶 until owner-actions 3.7 is answered; if the answer
   is "no", items 1 and 3 survive and the WhatsApp surfaces go.
4. **Time-aware CTA labelling — bounded.** The manifest's `schema.openingHours` (ראשון–חמישי
   08:00–18:00, שישי 08:00–15:00) is the only confirmed availability fact. Outside those hours a
   small line may appear beside the form or the bar ("מחוץ לשעות הפעילות — השאירו פרטים ונחזור
   אליכם"), promoting the form and WhatsApp. It may **not** say the phone is answered now, use "24/7",
   "חירום" or "מיידי", or hide or relabel the `tel:` link — emergency availability is unconfirmed
   (business-facts §E, owner-actions 3.5; `siteConfig.hours.emergency` is the 🔶 string — §5.4, §7.2).
   Neutral markup on the server, text adjusted after mount in a reserved box. When the owner answers,
   the fact lands in the roster and the label reads from it — never from a component literal.
5. **A returning-visitor acknowledgement — subtle at most.** A one-line "שוב כאן? חייגו ישירות" near
   the form, gated on the same storage key. Not a different homepage, not a different H1.

Each item must: reserve its space (no CLS — budget performance-guidelines §1); read only the route,
the manifest or one non-identifying storage key; push nothing to `dataLayer` beyond a flag
event-taxonomy lists (no name, phone or message — golden rule 10); and pass `ts-react-reviewer` as a
small leaf client component.

### 8. What is forbidden

Decisions with reasons, so they are not silently revisited.

| Forbidden                                                                                          | Why                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IP- or `CF-IPCountry`-based swapping of headings, copy, prices or the service list                 | Cloaking (§5 item 6); country-only data (§5 item 5); breaks the one-file property (§5 item 3)                                                                                                                         |
| Any per-visitor variation of `<title>`, `<h1>`, `rel="canonical"` or JSON-LD                       | `titles.mjs`, `links.mjs` and `schema.mjs` measure the static file; a client mutation is invisible to them and to the index — the export must be the truth                                                            |
| Weakening `Permissions-Policy: geolocation=()` in the zone rule or in `public/_headers`            | A GPS prompt at a stuck gate loses the call; the route already knows the city (§5 item 4, §7 item 1)                                                                                                                  |
| A client-side redirect by inferred location (`loc=`, `navigator.language`, timezone)               | Wrong at city level; a redirect on a static page is a redirect for the crawler too                                                                                                                                    |
| Injecting a city name from any IP lookup into copy, form or WhatsApp text                          | "ב<wrong city>" is worse than no city; the only trusted city is the route's (§7 item 1)                                                                                                                               |
| Anything that delays LCP or shifts layout — a blocking script, a late-inserted banner, a font swap | The LCP element is text; the bar and the answer block are the conversion path (`performance-web-vitals`)                                                                                                              |
| A/B tests that vary indexable content without canonical discipline                                 | Duplicate variants in the index; and no GA4 key event exists to judge one by (owner-actions 2.4)                                                                                                                      |
| A Pages Function, `_worker.js` or edge rule shipped from this repo                                 | Not a repo change (§5 item 2); owner territory (CLAUDE.md §12). `guard-destructive-ops.ps1` blocks the deploy / Cloudflare-API command, not the file — the file is caught only by the §11 grep and `security-auditor` |
| Storing name, phone or message text client-side "for convenience"                                  | PII in storage with no consent affordance yet (§8.2); golden rule 10 applies to storage as it does to `dataLayer`                                                                                                     |
| A promise of emergency or same-day availability in any time-aware label                            | 🔶 business-facts §E; `claims-grep.mjs` fails the lexicon in source and export; `claims-verifier` is stop-ship                                                                                                        |

### 9. If genuinely needed later

The only sound path, in order — each step exhausted before the next is opened:

1. **Routing first.** A deeper existing location page, or a real neighbourhood section inside one,
   beats any runtime trick. If a city cannot support three true local items it does not earn a page
   (content-standards §2) — and it does not earn a geo-swap either.
2. **Then client-side, cosmetic only.** §7's list, post-hydration, CLS-free, storage-optional,
   reviewed by `ts-react-reviewer` and `cro-engagement-auditor`.
3. **Only then an edge Worker — as an owner decision.** In writing, before any code: a cache-key
   strategy (what the response varies on, and its cost), a cloaking review (what Googlebot from a US
   IP receives on every route), a measured hypothesis (which GA4 key event moves — owner-actions 2.4
   first), a row in `docs/owner-actions.md` and an ADR under `docs/decisions/`. Not an `/improve` item.

## 10. Enforcement map

| Rule                                                                               | Enforced by                                                                                                                                                                                                                                                | Gap                                                                                                                                                                               |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sticky bar present, both halves tagged `data-cta`, counted once                    | `cta-coverage.mjs` (`chromeCtas`); `cro-engagement-auditor`                                                                                                                                                                                                | presence is a metric, not a failure — the script fails only a page with no CTA anywhere; `cro-engagement-auditor` reads it                                                        |
| Bar and button contrast ≥ 4.5:1 in every state                                     | `a11y.mjs` `contrastPairs` (reads `Button` and `MobileCtaBar` source); `perf-a11y-auditor`                                                                                                                                                                 | failing today → §11.1, N11                                                                                                                                                        |
| No hex literal, no physical utility on a mobile surface                            | `rtl-lint.mjs`; `post-edit-lint.ps1` at edit time; `ts-react-reviewer`                                                                                                                                                                                     | failing today → §11.5                                                                                                                                                             |
| Tap targets ≥ 44 px, ≥ 8 px apart                                                  | **not enforced yet** — `a11y.mjs` has no target-size check; `responsive-accessibility` checklist; `perf-a11y-auditor` by hand                                                                                                                              | not yet → new backlog row under §11 (`Button size="md"` ≈ 40 px, hamburger `h-10 w-10` = 40 px; an `a11y.mjs` target-size check) — the gap accessibility-and-i18n §11 records too |
| Form: `tel` keyboard, autocomplete, 16 px inputs, per-field errors, `072-` pattern | `a11y.mjs` (labels; `noValidate` without `aria-invalid` → fail; tel input without `pattern` / `inputMode` → warn); `cro-engagement-auditor`                                                                                                                | `autoComplete` and the 16 px input size are not checked mechanically → §8.1, N1                                                                                                   |
| `tel:` / WhatsApp as real links, no `window.open`                                  | `cta-coverage.mjs` sees only anchors — a `window.open` is invisible to it by construction; `cro-engagement-auditor`                                                                                                                                        | two JS opens today → §13.2, N1                                                                                                                                                    |
| Mobile menu focus management                                                       | `a11y.mjs` warns; `perf-a11y-auditor`                                                                                                                                                                                                                      | → §11.4                                                                                                                                                                           |
| Answer block above the fold                                                        | `content-depth.mjs` answer-block proxy (40–60 words); `hebrew-editor`                                                                                                                                                                                      | 0 of 36 today → §6.2                                                                                                                                                              |
| Reduced motion; no `framer-motion`; FAQ answers in the DOM                         | `perf.mjs` `unusedDeps`; `a11y.mjs` warns on `Faq`; `ts-react-reviewer`                                                                                                                                                                                    | the reset itself is not tested → §10.3, N8                                                                                                                                        |
| No pop-ups / interstitials; tables scroll in a container; no reflow                | **not enforced yet**; `engagement-ux`; `cro-engagement-auditor`, `perf-a11y-auditor` at 320 px                                                                                                                                                             | —                                                                                                                                                                                 |
| `Permissions-Policy: geolocation=()` present                                       | `edge.mjs` warns only when `public/_headers` lacks a `Permissions-Policy` line — it does not read the directives; the `geolocation=()` value is proved only by `curl -sSI` (live) or `grep -n 'geolocation=()' public/_headers` (repo); `security-auditor` | zone-owned today → §12.1                                                                                                                                                          |
| No visitor-varying title / H1 / canonical / JSON-LD                                | `titles.mjs`, `links.mjs`, `schema.mjs` prove the export; **client mutation not enforced** — `ts-react-reviewer` + `seo-auditor`                                                                                                                           | no backlog id; a client component touching `document.title` or `<head>` is a review stop                                                                                          |
| No IP / country / Worker personalisation from the repo                             | convention + review: no `functions/`, `_worker.js` or wrangler config exists, and the §11 grep proves it; `ops/deploy-site.ps1` ships `out/`; `guard-destructive-ops.ps1` gates the deploy command; `security-auditor`                                     | the deploy command would pick such a file up unasked (§5 item 2) — the grep is the guard                                                                                          |
| Personalisation PII-free, CLS-free, storage key non-identifying                    | **not measured in the repo** — `perf.mjs` is static analysis; event-taxonomy contract; `cro-engagement-auditor`, `perf-a11y-auditor` on a device                                                                                                           | CLS budget is performance-guidelines §1 (< 0.05, hard fail > 0.1), checked in its §9 PageSpeed step; a personalisation element must add 0 to it; consent → §8.2                   |
| Time-aware label never promises 24/7 / חירום / same-day                            | `claims-grep.mjs` ids `around-the-clock` and `response-time` on source and export; `post-edit-lint.ps1` only when the string lives in `lib/content.ts` (where CLAUDE.md §5 puts it); `claims-verifier`                                                     | `חירום` and bare `מיידי` are not in `claims.json` — reviewer-only until the lexicon gains them → §5.4, §7.2                                                                       |
| City prefill from the route only                                                   | **not enforced yet**; `ts-react-reviewer`; `new-city` builds the data (none of it exists today — §3.1, §5.2)                                                                                                                                               | field itself → §8.4                                                                                                                                                               |

## 11. Acceptance checklist

- [ ] At 375 px on `/`, a service page and a location page, a `tel:` action is visible without
      scrolling and sits in the bottom third — `MobileCtaBar` first in DOM order = right side.
- [ ] `node scripts/audit/cta-coverage.mjs` lists `sticky-call` and `sticky-whatsapp` among the chrome
      CTAs; no new CTA without `data-cta`.
- [ ] `node scripts/audit/a11y.mjs` — no contrast pair below 4.5:1 including hover; no new failure
      absent from the latest `docs/audits/` report.
- [ ] `node scripts/audit/rtl-lint.mjs` — `hexLiterals` and `bannedUtilities` not higher than the
      latest report; the bar's WhatsApp colour is a `@theme` token.
- [ ] Every tap-first control renders ≥ 44 px (measured in DevTools, not inferred from the class);
      `size="lg"` on the phone conversion path.
- [ ] Phone input: `type="tel"`, `inputMode="tel"`, `autoComplete="tel"`, `dir="ltr"`, `text-end`;
      body and inputs 16 px; viewport meta has no `user-scalable=no` / `maximum-scale`.
- [ ] No horizontal scroll at 320 px; every `<table>` in an `overflow-x: auto` wrapper; no pop-up,
      interstitial or self-opening widget on any route; nothing occludes the bar.
- [ ] Any personalisation is post-hydration, in a reserved box, storage-optional, PII-free, and the
      page is complete with JavaScript off (`ts-react-reviewer` sign-off).
- [ ] `curl -sSI https://dangates.co.il/ | grep -i permissions-policy` still contains
      `geolocation=()`; once `public/_headers` exists, `grep -n 'geolocation=()' public/_headers`
      hits (`edge.mjs` checks only that the header line is present).
- [ ] `grep -rl "CF-IPCountry\|cdn-cgi/trace\|navigator.geolocation" app components lib` → nothing;
      no `functions/`, no `public/_worker.js`, no `wrangler.toml` / `wrangler.json(c)`;
      `ops/deploy-site.ps1` unchanged.
- [ ] `node scripts/audit/claims-grep.mjs` — no new `around-the-clock` / `response-time` hit from a
      time-aware label; `claims-verifier` has read every new user-facing string; `titles.mjs` and
      `schema.mjs` still prove one title, canonical and JSON-LD per page.
