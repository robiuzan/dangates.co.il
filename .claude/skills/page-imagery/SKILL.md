---
name: page-imagery
description: Which picture belongs in which slot on דן שערים חשמליים and what the words around it may say — the illustration rule (owner decisions of 2026-11-11, AI renderings under one site-wide note, never evidence of a job, city, date, customer, price, duration, warranty, credential or rating; two AI-made characters tech-a and tech-b, never named, never staff, no emblem), the slot inventory of the 46 content routes with ratios, file boxes and rendered widths from the container math (1088, 768, 712, 524 px), the markup contract through components/images/Figure.tsx, the manifest and the plan, draft mode, the Hebrew alt and caption rules with this site's banned stems and the «גבר בחולצת פולו כהה» register, what check-images-out enforces, the legitimacy checklist for electric gates, barriers, shutters and entrances, and the never-delete policy. Use before adding, briefing, judging or captioning any image, or deciding an aspect ratio. Triggers "what image goes here", "which aspect ratio", "add a photo", "can we use this image", "image brief", "alt text", "caption", "gallery", "is this image allowed", "תמונות", "טקסט חלופי", "גלריה".
---

# Page imagery

Two questions, always in this order:

1. **What may the words around this picture say?** On this site a picture never testifies. The
   alt, the caption, the heading and the paragraph beside it are where a claim would be made, and
   those are governed by CLAUDE.md golden rule 1 exactly like a testimonial.
2. **Will it fit?** Geometry — derived from the layout code, not guessed.

Until 2026-11-11 the first question was "may this picture exist at all?", and on this site the answer
was no: the repo waited for the owner's own job photographs, counted the header logo as its only
`<img>` and refused any generated or licensed picture as a record of work. The owner's decisions of
that day (CLAUDE.md §15, `docs/business-facts.md` §F, ADR 0006
`docs/decisions/0006-ai-renderings-under-one-note.md`) moved the rule **from the pixels to the
words**: every content image is an AI rendering, disclosed once for the whole site, and nothing
around it may turn it into a record. The honesty record itself did not move — golden rule 1 still
calls it the site's most valuable asset.

> **Status, 2026-11-11.** Written with the policy commit (A). The kit (`Figure`, the gate, `/גלריה/`)
> comes in the kit commit (B), the plan in C, the images in D; files from B are cited here by bare
> path, and every number marked _filled at install_ is measured then.

---

## 1. The illustration rule (owner decisions 2026-11-11)

Images on dangates.co.il are **illustrations, never evidence** — never evidence of a job, city, date,
customer, price, duration, warranty, credential or rating. Every content image is a rendering: there
is no owner-supplied or photographed content image on the site.

- **The renderings** come from Google Gemini through the Media Studio page-images toolkit, in the
  look of a phone snapshot, each one judged for plausibility by two vision judges under `strict`
  and approved by the owner on the local site before anything goes live. **Never a stock
  photograph.**
- **The characters.** Two only, **`tech-a`** and **`tech-b`** — AI-made characters from two portrait
  sets the owner supplied through Drive (owner decision 2), `policy.personaKind:
"synthetic-unnamed"`. They have **no name on the site, no role, no staff line**, and the about note
  says so. They appear in 19 of the 78 renders (tech-a alone 9, tech-b alone 8, both 2 — `home-team`
  and `gallery-generated-4`). The record is `Media Studio/refs/dangates/PERSONAS.md`, outside git;
  there is no `CONSENT.md`, no consent flow, no contact sheet and no revocation clause, because
  nobody real is depicted. **The public-repo rule:** the portrait sets' file labels and the names
  they carry live in `Media Studio/sites/dangates/site.json` (`bannedNames`) and `PERSONAS.md` only —
  never in this repo, a commit message or a pasted listing. If the owner ever says the characters
  are real people, stop before the next render (runbook §2).
- **Where they appear.** A character appears on home, services hub, service `main`, areas hub,
  about, contact, pricing, two guide leads and gallery frames. **City pages are people-free** by
  owner decision: a face beside «תיקון שערים חשמליים בתל אביב» would read as a local crew, which
  `docs/business-facts.md` §E says nothing supports. `plan lint` refuses a person on a city route
  (`policy.peopleRoutes.cities: false`).
- **No emblem** (owner decision 8). A plain charcoal-grey short-sleeved work polo with no print,
  badge, patch or lettering; the portraits already wear grey and the model copies what it sees.
  There is no `badge` block, no emblem reference image, and any mark on a chest is the `branding`
  code. The lettered logo never goes on clothing.
- **The watermark** is the supplied logo (`C:\Users\robiu\Downloads\dangates_logo.png`, 1280×1280
  RGBA, prepared into `Media Studio/sites/dangates/brand/logo.png`), bottom-right, composited by the
  toolkit after generation. It is never drawn by the model; a drawn logo is the
  `sparkle-or-watermark` hard reject. **The logo carries «תיקון והתקנה 24/7» as supplied** (owner
  decision 3): the claim lexicon is not changed, the alt writer reads the master (which has no
  logo), and no alt, caption or note may say 24/7 — `docs/business-facts.md` §E, owner-actions 3.13
  and ADR 0006 record the contradiction.

**The disclosure is one site-wide note in three places.** There is no per-image label, no הדמיה in
any alt and no file-level marker (`metadataLabel: false`, fleet default; Google's SynthID stays in the
pixels and is never tampered with). Because every content image is a rendering, the note says
**«כל התמונות …», never «חלק מהתמונות»**. The texts live in `content/images/notice.json` (typed as
`imagesNote` in `lib/content.ts`), mirrored in `Media Studio/sites/dangates/site.json`
`disclosure.texts`; `doctor` fails when the two differ, and the gate compares the built HTML to the
file verbatim. `hebrew-editor` → `claims-verifier` review the texts before `port`; the owner approves
the wording with the digest, so a later change needs a new approval.

| Where                                    | Key · marker                               | Text                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Footer line, every page                  | `footer` · `data-images-notice="footer"`   | כל התמונות באתר הן הדמיות להמחשה — פרטים בגלריה.                                                                                                                                                                                                                                                                                                                 |
| `/גלריה/` intro                          | `gallery` · `data-images-notice="gallery"` | כל התמונות באתר הן הדמיות שנוצרו בכלי בינה מלאכותית, כדי להראות איך נראית עבודה על שערים חשמליים, מחסומים ותריסי גלילה. שתי הדמויות שמופיעות בתמונות נוצרו באותו כלי: הן אינן אנשים אמיתיים ואינן עובדים של העסק. ההדמיות ממחישות שיטות עבודה, רכיבים ותקלות אופייניות, ואינן תיעוד של עבודה, לקוח או כתובת מסוימים, והציוד שבהן אינו מייצג דגם או יצרן מסוימים. |
| `/אודות/`, the line under the team image | `about` · `data-images-notice="about"`     | בתמונה: שתי הדמויות שמופיעות בתמונות האתר. הן נוצרו בכלי בינה מלאכותית ואינן אנשים אמיתיים, לא עובדים ולא לקוחות. זו המחשה של עבודה על שער — לא צילום של עובדי העסק ולא תיעוד של עבודה מסוימת.                                                                                                                                                                   |

The footer line renders only when `hasApprovedRenderings()` is true, so the site reads as before until
the first batch ships. The about line renders only under a team figure with people; while the team
frame is held, `leadSlotOf` gives the priority to `about-story` and the note does not render. The
about line is a note, not a caption: it widens nothing.

**What the words may never do** — in an alt, a caption, a figcaption, a heading or a paragraph near
an image:

- claim a specific **job, city, date, customer, price, duration, warranty, credential, standard,
  availability or rating**;
- say **ביצענו** or any first-person job verb near a picture or near a link to `/גלריה/`. The
  service-page sentence is derived from `galleryServiceNames()` and reads «איך זה נראה — בגלריה: …»
  — six tokens, unique per page, never the `content-depth` shared-block warning;
- say **לפני ואחרי** — no two files are a genuine pair. A service's `detail` and `work` frames tell
  the fault and the finish; no word may present them as a before and after;
- **name a person, anywhere.** There is no first-name exception on this site: a character is «גבר
  בחולצת פולו כהה», two are «שני גברים בחולצות פולו כהות», never «טכנאי» as his label, never «הטכנאי
  שלנו», never a role, never in an `alt`, a caption or a file name;
- name a **city** — not in an alt, not in a caption, and **never in a file name** (`fileSlug` is
  subject-based). The page's own headings supply the city; the plan's `city` field is the only other
  place it lives;
- say **24/7**, שעות, זמינות or מסביב לשעון. The watermark is the only place the phrase exists.

**What stays forbidden in the pixels:** a certificate, licence, insurance document, standard mark,
rating, star badge, review or before/after split; readable text, a model plate, a number plate, a
house or bay number, a readable keypad or display, any logo or third-party branding, any mark on a
chest; any person other than the two characters; a customer or anything that identifies a household;
a vehicle or part of one; a motor with its cover off, an open cabinet, a distribution board (לוח חשמל)
open or closed; a hand at the rack and pinion or on a spring; a person in a gate's path, under a
lifting door or in a boom's lane; foreign building stock or a foreign gate (a timber garage door, a
picket fence, a chain-link farm gate).

**Where renderings never go:** `og:image` (the brand card `dangates/og.jpg` from the manifest stays —
`lib/seo.ts` `ogBase`, skill `site-images`), any JSON-LD (no `ImageObject`, no `image` on an article
node; `docs/schema-graph.md`) and the Google Business Profile, which wants real phone photographs and
carries no note (`docs/gbp-runbook.md`).

---

## 2. The slot inventory

Container math, read from the layout code on 2026-11-11: `Container` is `max-w-6xl` = 1152 px with
`px-4 / sm:px-6 / lg:px-8` (`components/ui/Container.tsx:12`), so the widest content column is
**1088 px**; `sm` = 640, `lg` = 1024, no `--breakpoint` or `--container` override in `app/globals.css`.
Service pages (`app/services/[service]/page.tsx`) and guides (`components/article/GuideView.tsx`) use
`grid gap-10 lg:grid-cols-3` with the copy in `lg:col-span-2` = **712 px** on desktop, peaking at
**~975 px** just below `lg` (one column). Prose pages wrap copy in `mx-auto max-w-3xl` = **768 px**:
city pages (`app/locations/[city]/page.tsx`), `/אודות/`, `/מחירון/`, the posts
(`app/blog/[slug]/page.tsx`), and `PageContentBlock` (`components/marketing/ContentSections.tsx:154`),
which is where the two hub strips sit. `/צור-קשר/` is `grid gap-10 lg:grid-cols-2` = **524 px** per
column. The index cards (`/מדריכים/` three columns, `/blog/` two inside `max-w-5xl`) carry a
`w-24 sm:w-32` thumbnail.

Fixed by the contract: scenes **4:3**, details **3:2**, one ratio per row. Size classes: `large` 1400
long edge ≤ 200 KB, `half` 1200 ≤ 170 KB, `tile` 960 ≤ 120 KB, `thumb` 480 ≤ 45 KB. A page carries
≤ 900 KB of images, `/גלריה/` ≤ 3 MB (`pageBudgets` 3145728, set at install — owner decision 7 said
2.5 MB, but the gate sums the full files and its 14 tiles at their caps are 2,652,160 B),
`out/images/` ≤ 20 MB in total (`gates.maxTotalBytes`),
and `out/images/` is excluded from the audit's 15 MB `maxOutBytes` (`perf.mjs` reports `imagesBytes`
beside it). **Exactly one `priority` content image per page = the first content image in DOM
order**; every other content image `loading="lazy" decoding="async"`. The header logo
(`public/dangates-logo.png` through the kit's `SiteImage` in `components/layout/Header.tsx`, not a
content image) is eager on every page with its own `priority` and is not counted. Rendered widths
below are computed from the container math and each component's gap; confirm them on the built
markup at install (the file boxes do not depend on them).

| Route / template      | Slot(s)                                       | Ratio · file box · class  | Position (dangates' own DOM order)                                                                                                                                                              | Priority · caption                     | People                                                                                        | Rendered width (desktop) |
| --------------------- | --------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------ |
| `/`                   | `strip-1..3`                                  | 4:3 · 960×720 · `tile`    | `<FieldStrip route="/" cols={3} band />` between `<Hero />` and `<TrustBar />`; 2 tiles on phones                                                                                               | tile 1 priority; no caption            | tech-a · none · tech-b                                                                        | ≈ 350 px each            |
| `/`                   | `team`                                        | 3:2 · 1200×800 · `half`   | `<TeamTeaser priority={!stripShown} />` between `<Process />` and `<Diagnosis />`; the same entry as `/אודות/`                                                                                  | priority only when the strip is absent | both, candid, working                                                                         | ≈ 524 px                 |
| `/שירותים/`           | `pair-1..2`                                   | 4:3 · 960×720 · `tile`    | `<FieldStrip route="/שירותים/" cols={2} />` via `PageContentBlock`'s `afterAnswer` — after the answer `<p>`, before the sections                                                                | pair-1 priority; no caption            | none (new parts on a cloth) · tech-b                                                          | ≈ 364 px each            |
| `/services/<s>/` ×7   | `main`                                        | 4:3 · 1400×1050 · `large` | after the answer `<p>`, before `<Toc>`                                                                                                                                                          | priority · caption                     | one character (the triplet table)                                                             | 712 px (~975 peak)       |
|                       | `detail`                                      | 3:2 · 1200×800 · `half`   | after `upfront.check` (the symptoms table), before `upfront.ask`                                                                                                                                | caption                                | none                                                                                          | 712 px                   |
|                       | `work`                                        | 3:2 · 1200×800 · `half`   | after the depth sections (`<ContentSections sections={depth.sections} />`), before «מתי כדאי לפנות אלינו?» — away from the visit-band price paragraph — then the «איך זה נראה — בגלריה: …» line | caption                                | none                                                                                          | 712 px                   |
| `/איזורי-שירות/`      | `strip-1..3`                                  | 4:3 · 960×720 · `tile`    | `<FieldStrip route="/איזורי-שירות/" cols={3} />` via `afterAnswer` — three building-stock archetypes, never a city                                                                              | strip-1 priority; no caption           | none · tech-a · none                                                                          | ≈ 235 px each            |
| `/locations/<c>/` ×14 | `main`                                        | 4:3 · 1400×1050 · `large` | after `<AnswerBlock>`, before `<Toc>`                                                                                                                                                           | priority · caption                     | **none** (owner decision)                                                                     | 768 px                   |
|                       | `detail`                                      | 3:2 · 1200×800 · `half`   | after the `localNotes` sections, before the neighbourhoods `BulletedBlock`                                                                                                                      | caption                                | **none**                                                                                      | 768 px                   |
| `/אודות/`             | `team` (reuse of `home-team`)                 | 3:2 · 1200×800 · `half`   | via `afterAnswer` before the Toc, with `<p data-images-notice="about">` directly under it                                                                                                       | priority; names nobody                 | both                                                                                          | 768 px                   |
|                       | `story`                                       | 4:3 · 1200×900 · `half`   | after the `aboutIntro` `<p>`                                                                                                                                                                    | caption                                | tech-b (people-free until the owner's yes on the softened sentences)                          | 768 px                   |
|                       | `work`                                        | 3:2 · 1200×800 · `half`   | after the values `<ul>`                                                                                                                                                                         | caption                                | none (materials)                                                                              | 768 px                   |
| `/צור-קשר/`           | `main`                                        | 4:3 · 1200×900 · `half`   | first in the details column, before «פרטי התקשרות»                                                                                                                                              | priority; **no caption**               | tech-a at a wicket with a tool bag, looking at the keypad post                                | 524 px                   |
|                       | reuse of `services-entrance-work`             | 3:2                       | centred (`max-w-xl`) after the 2-col grid, before the complaints Section — not the team frame: a held team frame would leave contact with one image                                             | no caption                             | none                                                                                          | ≈ 576 px                 |
| `/מחירון/`            | `survey`                                      | 3:2 · 1200×800 · `half`   | after the CTA pair, before `<Toc>`                                                                                                                                                              | priority · caption                     | tech-b (flashlight at a hinge post)                                                           | 768 px                   |
|                       | `layers`                                      | 3:2 · 1200×800 · `half`   | its own white `Section` between the drivers Section and `PricingTeaser`                                                                                                                         | caption                                | none (worn pinion beside a new one, a worn wheel, a rack segment, a run capacitor on a cloth) | 768 px                   |
| `/מדריכים/`           | `thumb` ×5, derived from each guide's `lead`  | 4:3 · 480×360 · `thumb`   | start side of every `GuideCard`; **all 5 must render**                                                                                                                                          | first card priority; no caption        | —                                                                                             | 96–128 px                |
| `/מדריכים/<g>/` ×5    | `lead`                                        | 4:3 · 1200×900 · `half`   | via `afterAnswer` before the Toc                                                                                                                                                                | priority · caption                     | 2 leads with a character (`not-closing` tech-a, `noisy-gate` tech-b), 3 none                  | 712 px                   |
|                       | `mid` (reuse of a service `detail` or `work`) | 3:2                       | a `{ kind: "figure", slot: "mid" }` block after the guide's first `table` block                                                                                                                 | caption                                | as the reused entry                                                                           | 712 px                   |
| `/blog/`              | `thumb` ×3, reuse of the keeper mains         | 4:3 · 480×360 · `thumb`   | start side of the 3 keeper cards (`thumbsFor("/blog/")`); the 8 departing cards stay text                                                                                                       | first priority; no caption             | —                                                                                             | 96–128 px                |
| `/blog/<p>/` ×3       | `main` (`thumb: true`)                        | 4:3 · 1200×900 · `half`   | injected by the post renderer after the first `p` block                                                                                                                                         | priority · caption                     | none                                                                                          | 768 px                   |
|                       | `mid` (reuse)                                 | 3:2                       | after the first `p` past the article's midpoint (else the last `p`, else at the end)                                                                                                            | caption                                | as the reused entry                                                                           | 768 px                   |
| `/blog/<p>/` ×8       | `main` (reuse) · `mid` (reuse)                | 4:3 · 3:2                 | the same two positions — reuse only, zero spend, for the posts `docs/content-calendar.md` §4 folds or 301s                                                                                      | main priority · caption                | as the reused entries                                                                         | 768 px                   |
| `/גלריה/`             | `generated-1..7`                              | 4:3 · 1200×900 · `half`   | under `galleryIntro`, the note and the H2, one finished state per service in `services` order, each with a link to its page                                                                     | tile 1 priority · caption              | 5 none · tech-a (`generated-2`) · both (`generated-4`)                                        | ≈ 528 px                 |
|                       | 7 reuse of the service `main` entries         | 4:3 · 1400×1050 · `large` | the same 2-column grid, orders 8–14 = **14 tiles**                                                                                                                                              | caption                                | as the reused entry                                                                           | ≈ 528 px                 |

**78 new renders** (home 4 · hub 2 · services 21 · areas 3 · cities 28 · about 2 · contact 1 ·
pricing 2 · guides 5 · posts 3 · gallery 7), **36 reuse placements** (33 figure placements — team ×1
on `/אודות/`, `services-entrance-work` ×1 on `/צור-קשר/`, guide mid ×5, keeper mid ×3, departing
posts ×16, gallery ×7 — plus 3 `/blog/` thumbnail placements), **8 derived thumbnails**, **19 frames
with a character**, every chest plain. **46 content routes**, every one ≥ 2 images counting reuse
and thumbnails. The arithmetic: 47 sitemap URLs today (`/` + 9 static + 7 services + 14 locations +
11 posts + 5 guides) minus `/מדיניות-פרטיות/` and `/הצהרת-נגישות/` plus `/גלריה/` = 46 content
routes and 48 sitemap URLs; 50 built pages = 48 + `/תודה/` + the 404 (`a11y.mjs` and `perf.mjs`
count 49 — they exclude the 404). `/גלריה/` is linked from the header nav (before «מחירון»), the
footer column, the footer note and each service page's «איך זה נראה — בגלריה» line.

### What belongs in each frame

A homeowner or a ועד בית mid-fault wants the fault they recognise close up, the person who will come
doing the step the page describes, and the finished, closed, square gate. On a service page that is
the triplet below (`main` = the character doing the page's own step, covers on, outside the path;
`detail` = the fault close up; `work` = the finished state; phase diagnosis → in-progress → done); it
is three illustrations across a page, never one job and never a pair.

| Service (key)                    | `main` — the step                                                                                                                                    | `detail` — the fault up close                                                                                 | `work` — how it ends                                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| שערים-נגררים (`sliding`)         | tech-a crouched inside the property at the motor base of a closed galvanised bar gate, flashlight on a grooved wheel, brush away from the pinion     | a grooved track wheel with a flat worn face, sand and leaves packed ahead of it, the rack's teeth above       | a long galvanised gate closed across an industrial yard, track swept, guide rollers, lamp dark, yard empty       |
| שערי-כנף (`swing`)               | tech-b at the hinge post of a two-leaf gate on stone-clad columns, grease gun at the lower hinge pin, arm-motor cover on                             | a hairline crack across a hinge weld, a rust streak, the curved drag scrape in the paving                     | a single wide leaf closed after rain, piston rod clean, electric lock in its keep, bougainvillea                 |
| שערים-מתרוממים (`overhead`)      | tech-a on the garage floor beside the vertical track of a closed sectional door, flashlight on a roller; spring, drums and cables untouched above    | the torsion spring broken into two coils with a gap, the drum and cable at the shaft end                      | a sectional door fully open under the ceiling from inside, daylight on an empty drive, trolley at the rail's end |
| שערים-לחניה (`parking`)          | tech-b inside a pillar-storey car park beside the column, wiping the photocell lens, plain remote in hand; lamp, rubber edge, cover on               | a photocell filmed with dust and a cobweb, its twin across the opening, the rubber edge, a sealed loop groove | the closed car-park gate at a ramp top, lamp dark, photocell posts, a small oblique keypad, bays empty           |
| שער-זרוע (`barrier`)             | tech-a on the kerb at a closed cabinet, socket wrench at the boom holder's bolts, boom down on its rest post, lane empty                             | a boom snapped near its holder, the stub still bolted, the rest across the kerb with scuffed bands            | a barrier at a ramp after rain, boom down, cabinet closed, photocell pair, sealed loop, lane empty               |
| תריסי-גלילה-חשמליים (`shutters`) | tech-b on the second step of a short ladder at an open shutter box, guiding the slats into their channel, tubular motor head in view, blank switch   | the lower slats jammed askew in their channel, one side lower, a split foam edge                              | a shopfront shutter fully down and square under a plain fascia, pavement empty                                   |
| שערים-לדירה (`entrance`)         | tech-a at the top of a held-open glazed lobby door, screwdriver at the door closer's screw; maglock plate, keypad small through the glass, mailboxes | an electric strike in a fence-gate post, the latch riding on the strike's lip with a bright rub mark          | the lobby door flush in its frame from inside, exit button, closer arm flat, intercom panel dark outside         |

**City pages** take their archetype from each `content/locations/<slug>.ts` `localNotes` — what the
page itself says about the city's housing, climate and industrial zones — and `detail` is the
exposure the page's `glance` block tells the reader to look for. The city name goes only in the
plan's `city` field. Every city `main` opens with a distinct clause, no two cities share (subject
stem, people, time) or a file, coastal cues (salt bloom, dune sand, sea haze) appear only on
תל-אביב, חיפה, נתניה, אשדוד, אשקלון and יבנה, and every archetype is re-read against its module before
the generator is written. The 14 rows are in `.claude/agents/image-art-director.md` (Cities).

**Guides, posts, hubs, about, contact, pricing, gallery:** guide leads — `not-closing` tech-a
wiping a photocell at a leaf stopped a hand short of its stop; `noisy-gate` tech-b with a flashlight
on the rack at a car-park gate; `parking-barrier` a block's entrance with the boom down and the loop
groove; `gate-types` a cantilever gate's two carriages on their footing, no track across the opening;
`standard-900` the safety set on a closed gate (photocell pair, lamp, rubber edge) — each `mid` a
reused service `detail` or `work`. Keeper posts (`docs/content-calendar.md` §4: `שערים-חשמליים-השקעה`,
`שדרוג-לשער-חשמלי-חכם`, `תחזוקה-מונעת-לשערים-חשמליים`) own one `main` each; the 8 departing posts
borrow two service close-ups by topic, and when a post is 301'd its placements leave in the same
commit (`lib/images.ts` throws on a placement whose route is gone). Home strip: a driveway gate, an
underground ramp with its sectional door open, a barrier's loop groove. Hub pair: new parts on a
cloth, the lid of an underground motor box. Areas strip: a house's sliding gate, a pillar-storey gate
lamp, an office car-park barrier. About: sweeping sand out of a track; an open tool bag with a new
photocell pair. Contact: a wicket and its keypad post, plus the closed lobby door. Pricing: a
flashlight at a hinge post; worn parts beside new ones on a cloth. Gallery 1–7: one finished state
per service.

### Not image slots — never propose a picture for these

| Surface                                            | What it is                                                                                             | Why not                                                                                                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hero                                               | text + lead form (`components/marketing/Hero.tsx`)                                                     | The hero stays text. The strip sits directly under it; a picture inside it would move the phone LCP off the H1. Its `manifest.images.hero` branch is retired in the kit commit |
| Sticky CTA bar, form cards, the service-page aside | conversion actions                                                                                     | An image there competes with the call                                                                                                                                          |
| Header logo                                        | `public/dangates-logo.png` through the kit's `SiteImage` in `components/layout/Header.tsx`, decorative | The owner's artwork, not a content image: no manifest entry, no `Figure`, no note. The watermark master stays in `Media Studio/sites/dangates/brand/`                          |
| The catalog `images.hero` / `images.gallery` slots | `site.config.json`, synced from the roster                                                             | They stay `null`. `JobPhotos.tsx` («תמונות מהעבודה») rendered catalog photos as field work and is retired with `jobPhotosCopy` in the kit commit; never revive it              |
| The guides' citable tables                         | the `table` block each guide family must carry (`docs/content-standards.md`)                           | A table explains the mechanism; a rendering illustrates. A `figure` block sits after the first table, never in its place                                                       |
| The live surfaces                                  | the announcement bar, the seasonal card, the updates strip (CLAUDE.md §14)                             | Fleet live-kit, byte-locked; text only                                                                                                                                         |
| Favicon                                            | the logo's mark                                                                                        | Not a content image                                                                                                                                                            |
| OG card                                            | `dangates/og.jpg` on imgquarry.com, 1200×630, via the manifest → `lib/seo.ts` `ogBase`                 | A brand card, never a rendering (skill `site-images`)                                                                                                                          |

---

## 3. Nothing on this site crops

**There is no `aspect-*`, no `object-cover`, no `object-contain` and no CSS background image in any
rendered path** (checked 2026-11-11: the only two hits are the retired `Hero` branch and
`JobPhotos.tsx`, which render nothing today and leave in the kit commit), and `Figure`, `FieldStrip`
and `TeamTeaser` keep it that way. Every image is `w-full` with its intrinsic `width`/`height`
emitted.

- **What is framed is what ships.** The bottom-right corner must be plain paving, concrete, asphalt,
  plaster, the plain side of a leaf or a cabinet, or sky, because the logo is composited there.
- **The file's aspect ratio becomes the page's layout**, so the ratio is fixed per slot and a row
  never mixes ratios.
- **A focal point cannot rescue anything.** There is no focal-point mechanism and no resizer:
  `images.unoptimized` + `output: "export"` means the file in `public/images/` is the file every device
  downloads (the phone gets its own 720 px copy through `<picture>`, §4).
- Long edges: `large` 1400 for the figures that render at 712–768 px and peak at ~975 CSS px (1.4×
  there); `half` 1200; `tile` 960 for the strips; `thumb` 480. Resolution is secondary to trust here —
  the frames are meant to read as phone snapshots.

---

## 4. The markup contract

`images: { unoptimized: true }` in `next.config.mjs`, so `next/image` would emit no `srcset` and only
add client JS; the guide `image` block that rendered through it (`lib/guide-types.ts`,
`components/article/ArticleBody.tsx`) is unused and is replaced by the `figure` block kind in the kit
commit. Every content image goes through **`components/images/Figure.tsx`**: the kit's `SiteImage` in
ad-hoc mode (`src`/`alt`/`width`/`height`), `priority` on the first content image only,
`loading="lazy" decoding="async"` on the rest, an optional figcaption, `id="img-<id>"`,
`data-image-id` and `data-image-status`, and a dev-only badge «טיוטה — ממתין לאישור» on a `candidate`.

- `FieldStrip` (`components/images/FieldStrip.tsx`) renders 2–3 tiles and **nothing below 2**; with
  three columns the third tile is hidden on phones. `band` wraps it for the homepage.
- `TeamTeaser` (`components/images/TeamTeaser.tsx`) renders the team image beside the claim-free
  `aboutTeaser` block in `lib/content.ts` (eyebrow «איך אנחנו עובדים», title «אבחון לפני הכול»), and
  nothing without the image.
- **Guides:** `ArticleBody` takes `route`, renders a `{ kind: "figure"; slot: "mid" | "end" }` block
  through `Figure`, and `GuideView` renders `lead` under the answer through `afterAnswer`. One
  `figure` block per slot at most; `lib/guides.ts` throws otherwise. Skill `new-guide` places one
  `mid` after the first table.
- **Posts keep the flat `PostBlock` model** (`lib/posts.ts`, `.claude/rules/content-data.md`: never
  extend it). The blog page's local `renderBlocks(blocks, route)` injects `main` after the first `p`
  block and `mid` after the first `p` past the article's midpoint (else the last `p`, else at the end).
  A figure waits until the list its paragraph opens has closed, so 3–9 paragraphs separate the two in
  the 11 posts and neither sits under a bare heading (nine of the eleven open with a heading). A
  placement that does not render fails the gate.
- **`width` and `height` are mandatory** and equal to the manifest's measured pixels. They reserve the
  box; CLS stays 0 by construction.
- **Exactly one `priority` content image per page, computed from what actually renders**
  (`leadSlotOf`, `stripShown`, `leadShown`/`firstFigure`), so a held `main` moves the eager image to
  the next slot instead of leaving a page with none or two. The gate counts `fetchpriority="high"` on
  `/images/` paths only and checks it is the first `/images/` image in the DOM (the header logo is not
  an `/images/` path and is not counted).
- **Local `public/` paths get no `srcset`, correctly.** A static export has no resizer; never
  hand-write a `sizes` without a `srcset`.
- **A phone gets the 720 px copy through `<picture>`.** `Figure` wraps the `<img>` in `<picture>`
  with one `<source media="(max-width: 640px)">` naming the entry's `phone` file, made after `install`
  by Media Studio `page-images/tools/phone-copies.mjs`. The gate fails an approved image without it
  and a figure that does not offer it.
- **A slot with no approved image renders nothing**, so every page reads correctly before any image is
  approved. That is also why a figure never replaces a paragraph (`responsive-accessibility`), and
  why `content-depth.mjs` strips `<figure>…</figure>` before it counts words: a figcaption never pads
  a floor or a doorway delta.
- Server components only — **no sixth client component**: the `KNOWN_CLIENT` ledger in
  `scripts/audit/rtl-lint.mjs` stays at five. Logical Tailwind utilities (`end-2`, never `right-2`),
  tokens not hex. Page code never writes an `<img>`.
- **Anything in `public/` is copied into `out/` and published by every deploy.** Approved files live
  in `public/images/<group>/`; staged candidates in `public/images/_candidates/` (gitignored) are
  pruned from `out/` unless `IMAGES_DRAFT=1`. `/images/*` gets `Cache-Control: public,
max-age=2592000` in `public/_headers` (new pixels = new slug).
- Each image carries the anchor `#img-<id>`; the review board links to it.
- `/גלריה/` is a static page (`app/גלריה/page.tsx`) with its own canonical, `og:url`, title «גלריה —
  כך נראית עבודה על שער חשמלי», description, a `BreadcrumbList` from `PageHeader`'s `crumbs` and no
  `ImageObject`; its `staticPages` row feeds the sitemap, `/llms.txt` and the `links.mjs` parity check.

`lib/images.ts` exports `imagesFor(route, slot)`, `imageFor`, `stripFor`, `thumbsFor`, `leadSlotOf`,
`galleryServiceNames`, `hasApprovedRenderings`, `contentRoutes` and `imagesDraftMode`, with
`PersonId = "tech-a" | "tech-b"`. Routes are raw Hebrew with trailing slashes (`/אודות/`), byte-equal
to the `out/` directory names and the built hrefs; canonicals and sitemap `<loc>`s are
percent-escaped. Never compare those two forms.

---

## 5. The manifest and the plan

Two JSON files under `content/images/` (plus `notice.json`, §1):

- **`plan.json` — authored here**, by `Media Studio/sites/dangates/plan-generator.mjs` from compact
  per-slot specs, with the `image-art-director` agent owning the subjects; Prettier-formatted; the
  toolkit only reads it (`plan lint`). One entry per new render: `id`, `route`, `slot`, `order`,
  `group`, `fileSlug` (ASCII, subject-based, no city, no person id), `aspect`, `longEdge`, `sizeClass`,
  `priority`, `caption`, `people` (`none | tech-a | tech-b | both`; **no `badge`**), `phase`
  (`done | in-progress | diagnosis | materials`), `season` (`summer | autumn | winter-dry |
after-rain`), `time` (`morning | midday | overcast` — never `late-afternoon`), `service` (the raw
  Hebrew slug), `city` (`null` — the key carries the city), `subject` (English, 40–120 words),
  `context` (a Hebrew excerpt quoted from the page), `differentiateFrom`; plus a `reuse` list of
  `{ route, slot, order, of, priority, caption }`. Groups: `home services areas cities about contact
pricing gallery guides blog`.
- **`manifest.json` — written by the toolkit** (`stage`, `install`), listed in `.prettierignore`,
  never hand-edited except to flip `gates.minPerContentPage` from 0 to 2 once all 46 routes have
  their images, to set the gate numbers at install (`maxPageImageBytes` 921600, `maxTotalBytes`
  20971520, `pageBudgets["/גלריה/"]`), and for `image-art-director`'s alt and caption edits on
  `candidate` entries. Entry: `id`, `file`, `width`, `height`, `bytes`, `sha256`, `sizeClass`, `alt`,
  `caption`, `altEn`, `thumb`, `phone`, `placements[{route, slot, order}]`, `status` (`candidate |
approved | rejected | retired`), `people[]`, `phase`, `service`, `city`, `provenance`, `watermark`,
  `review`, `approved`, `retired`. Both files are in `scripts/audit/claims.json` `copyFiles`, so the
  audit's claim lexicon reads the alt, caption and note text and attributes a hit to its file.

Ids are the route's ASCII key plus the slot, because a Hebrew route segment cannot be a file or a
`--only` argument; the keys come from the four `keyMap`s in `site.json` (toolkit generalisation T1):

| Route             | Key              | Example ids                                                |
| ----------------- | ---------------- | ---------------------------------------------------------- |
| `/`               | `home`           | `home-strip-1`, `home-team`                                |
| `/שירותים/`       | `services`       | `services-pair-1`                                          |
| `/services/<s>/`  | `services-<key>` | `services-sliding-main`, `services-shutters-detail`        |
| `/איזורי-שירות/`  | `areas`          | `areas-strip-2`                                            |
| `/locations/<c>/` | `cities-<key>`   | `cities-tel-aviv-main`, `cities-sharon-detail`             |
| `/אודות/`         | `about`          | `about-story`, `about-work`                                |
| `/צור-קשר/`       | `contact`        | `contact-main`                                             |
| `/מחירון/`        | `pricing`        | `pricing-survey`, `pricing-layers`                         |
| `/גלריה/`         | `gallery`        | `gallery-generated-1`                                      |
| `/מדריכים/<g>/`   | `guides-<key>`   | `guides-not-closing-lead`, `guides-standard-900-lead`      |
| `/blog/<p>/`      | `blog-<key>`     | `blog-investment-main`, `blog-preventive-maintenance-main` |

Service keys `sliding swing overhead parking barrier shutters entrance`; city keys `tel-aviv
jerusalem haifa rishon-lezion petah-tikva netanya holon kfar-saba modiin rehovot yavne ashdod ashkelon
sharon`; guide keys `standard-900 noisy-gate parking-barrier gate-types not-closing`; post keys
`investment common-faults smart-upgrade safety-3-steps saves-time preventive-maintenance
business-benefits maintenance-importance repair-or-replace not-responding like-new`.

A guide's or a keeper post's card thumbnail is derived by the toolkit's `finish` from its `lead` or
`main` (`thumb: true`) and stored as the entry's `thumb`; it needs no plan entry of its own.

`lib/images.ts` validates the manifest at module init (a refusal takes `next dev` and `next build`
down) and `scripts/images/check-images-out.mjs` validates it again on `out/` (§8).
`manifest.images.gallery` and `manifest.images.hero` in `site.config.json` stay `null`;
`ops/sync-media.ps1` and the roster are not involved in page images. Never edit either for an image.

Adding a slot of an existing kind is a plan edit plus the pipeline. A new slot **kind** needs code
first: add the id to `SLOT_IDS` in `scripts/images/lib/manifest-rules.mjs` and to `SlotId` in
`lib/images.ts`, wire the page, and let the gate prove it renders.

---

## 6. Draft mode — a candidate is a 🔶

Without `IMAGES_DRAFT=1` only `approved` entries render. With it, `candidate` entries render too, from
`/images/_candidates/`, with the dev badge. `npm run dev:images` is that mode on the dev server; a
one-off proof build in this repo's shell (PowerShell 5.1, so no `VAR=1 cmd`):

```powershell
$env:IMAGES_DRAFT="1"; npm run build; Remove-Item env:IMAGES_DRAFT
```

Forget the `Remove-Item` and the next build in that shell is a draft too. A draft build writes
**`out/.images-draft` and appends to `out/.live-draft`**, so the hub's `deploy-site.ps1` refuses it
(it words the refusal as `LIVE_DRAFT`, and `-DeployOnly` included). That append is why the images
gate runs **last** in `postbuild`, after `check-live-out`, which writes and removes `.live-draft`
itself. `.env.example` documents `IMAGES_DRAFT` so `edge.mjs` does not warn on the read. An image
whose status is not `approved` must never reach a visitor; if either marker exists in `out/`, rebuild
without the variable. Review happens on the local site only: a `pages.dev` preview would publish
candidate pixels.

---

## 7. alt and caption

Hebrew, because the page is `lang="he" dir="rtl"`. Written by the toolkit's `alt` step from the
finished pixels — the master, which carries no logo, so the writer never sees the watermark's
«24/7» — edited on the board or by the art director, validated by the toolkit, by `lib/images.ts`
and by the gate. They live in the manifest — the one kind of visitor-facing text that does not sit in
`lib/content.ts` (CLAUDE.md §5's second exception, beside the live registers), which is why the
validators exist.

**Describe what is inside the frame. Nothing else.**

- `alt`: one line, 40–160 characters, ≥ 60 % Hebrew letters. No `תמונה של`. No city name (all 14 from
  `lib/site-config.ts`, the regions, the ~110 neighbourhood names of `content/locations/*.ts`, the
  English spellings). No 4-digit number, no date-like pair. No `לפני ואחרי`. No `כוכב`, `דירוג`, `★`,
  `מומלץ`. No `הדמיה`, `AI`, `בינה` — the disclosure is site-wide, not per image. No ASCII `"` or `'`.
  **Never a name, never «טכנאי» as a person's label, never a role.** The toolkit and the site rules
  hold the same limits, 40–160 (`textLimits`); a hand edit outside them stops the build.
- `caption`: optional, the same rules, 40–200 characters, not identical to the alt. Trade context the
  picture supports — what the step is for, how it is done, what to look at — in impersonal present
  tense (בודקים, מנקים, מכוונים), never a finding in the reader's gate, a result, a promise or a job
  done. A problem frame says what is typical, never what is wrong in the reader's property; a city
  frame names the building type and its consequence, generically; a keypad, a panel or a display is
  «כהה»; on `/מחירון/` a caption never says what moves the price.
- **A person is «גבר בחולצת פולו כהה», two are «שני גברים בחולצות פולו כהות».** The trade word in a
  general sentence («את ההחלפה והכיוון שלו משאירים לטכנאי») is about the trade, not the man, and
  passes; «הטכנאי שלנו», «טכנאי מנוסה» and the plural «טכנאים» do not.
- `רחובות` (streets) is an ordinary word as well as a city, so it counts as a city only at a clause end
  (`claims.ambiguousCityNames`); `מודיעין` and `יבנה` stay fully banned — captions never need them.
  `אשקלון` also trips the `שקל` stem; a city name is refused anyway.
- The stem `(?:צוות|עובד|עובדי|עובדים)` also catches «שעובד» (a motor that works) — say «פועל».
- Abbreviations take גרש `׳` and גרשיים `״` (`ת״י`, `מע״מ` — both banned here anyway), never ASCII
  quotes.
- Trade words come from the GLOSSARY block in `Media Studio/sites/dangates/style.md`: שער נגרר, שער
  קונזולי, שער כנף (כנף, כנפיים), שער מתרומם, שער חניה, מחסום / שער זרוע, זרוע, תריס גלילה חשמלי,
  ארגז התריס, מנוע צינורי, שלבים, מנוע, בסיס המנוע, מכסה המנוע, לוח פיקוד (never לוח בקרה), עינית
  (never חיישן), מנורת אזהרה, פס גומי, לולאה, קודן, לוח אינטרקום, לחצן יציאה, נגדי חשמלי, מנעול
  אלקטרומגנטי, מחזיר דלת, שחרור ידני, פס שיניים, גלגל שיניים, מסילה, גלגל עם חריץ, גלגלי הובלה, מעצור
  קצה, צירים, בוכנה, קפיץ פיתול, תוף, כבל פלדה, עגלה, פשפש, קומת עמודים, רמפה, מטאטא, מברשת, מטלית,
  פנס, מפתח בוקסה, גריז, פלס, סולם, תיק כלים.
- The bar: _would this sentence still be true if the picture were a real photograph?_ If it names
  anything the camera could not have seen, it fails.

**The stems this site refuses in any alt or caption.** The regex source is `claims.extraBanned` and
`claims.extraBannedRegex` in `Media Studio/sites/dangates/site.json`, rendered into
`scripts/images/lib/images.config.mjs`; `doctor` fails when the two differ. They mirror every id in
`scripts/audit/claims.json` (licence · insurance · certification · experience · founded · warranty ·
national-coverage · around-the-clock · response-time · rating · superlative · workmanship-absolute ·
named-person · quote-before-work · no-obligation · durability-promise · price-list-pointer) plus the
`live.config.mjs` staffing and identity stems, bounded so «לתקן» and «פעלות» survive. A refused text in
a staged entry makes `lib/images.ts` throw, which is why there is one source. Edit it there, never in
one copy.

| Family                     | Refused                                                                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Price and fee              | `₪`, ש״ח, שקל, מחיר, מחירון, תעריף, מע״מ, דמי ביקור, תוספות, חינם, ללא עלות, עלות, יקר, זול, משתלם, הצעת מחיר                                                   |
| Warranty and promises      | אחריות, מתחייב, מבטיח, מובטח, לאורך זמן, לאורך שנים, עמידות                                                                                                     |
| Hours, availability, speed | 24/7, מסביב לשעון, שעות ביממה, שעות, בשבת, בלילה, סופ״ש, זמינ־, חירום, דחוף, מיידי, בהקדם, באותו יום, תוך … שעה/דקות/יום                                        |
| Coverage                   | פריסה ארצית, בכל הארץ, ארצי, סניף, השרון, גוש דן, מרכז הארץ, ירושלמי, every city and neighbourhood, the English city names                                      |
| People and identity        | שלנו, אצלנו, הצוות, צוות, עובד־, טכנאים, הטכנאי שלנו, מומח־, מנוס־, מיומנ־, מוסמ־, מקצועי, מקצוענ־, אנשי שטח, המתקינים, בעל העסק, מייסד, הבעלים, a bounded «דן» |
| Experience and tenure      | ותק, ניסיון של N, מעל N שנ־, עשרות שנים, שנות ניסיון, מאז/משנת YYYY, נוסד, הוקמ־                                                                                |
| Credentials and compliance | רישיון, רשיון, מורשה, מוסמך, הסמכ־, ביטוח, מבוטח, תעוד־, תקן, תקני, ת״י, ת״י 900, מכון התקנים, תו תקן, מאושר, בטיחותי, בתקנות                                   |
| Customers and reviews      | לקוח, דייר, ממליצ־, המלצ־, ביקורת, דירוג, כוכב, המוביל, הטוב ביותר, מספר 1, הכי טוב, ללא פשרות, מצוינות, counts of jobs or clients                              |
| First-person job verbs     | ביצענו, החלפנו, תיקנו, התקנו, מצאנו, פירקנו, בדקנו, אבחנו, ניקינו, הגענו, סיימנו, טיפלנו, כיוונו, איזנו                                                         |
| Result verbs               | תוקן, תוקנה, נפתר, נפתרה, הוחלף, הותקן, הושלם, הסתיים, פועל שוב, עובד שוב, חזר לעבוד, בהצלחה                                                                    |
| Labels and formats         | תמונה של, לפני ואחרי, הדמיה, בינה מלאכותית                                                                                                                      |
| Brands                     | FAAC, BFT, Nice, CAME, Beninca, Somfy, LiftMaster, Chamberlain, Genie, Hörmann, Ditec, DEA, Roger, Doorhan, Alutech, Marantec and their Hebrew transliterations |
| Units with digits          | וולט, ואט, אמפר, ק״ג, טון, מטר, ס״מ, מ״מ, °, and digits with דקות / שעות / ימים / שבועות / חודשים / שנים                                                        |

Register examples — the reference pairs that pass every stem (the rest are in the strategy design
and `Media Studio/page-images/test/dangates-site.test.mjs`):

> service `main` — `גבר בחולצת פולו כהה כורע ליד מנוע של שער נגרר סגור, מאיר בפנס על גלגל במסילה, ומברשת קשיחה מונחת לידו על הריצוף.`
> / `בבדיקת שער נגרר מסתכלים קודם על הגלגלים ועל המסילה: גלגל שמחליק במקום להסתובב משאיר צד שטוח, והחול שנאסף במסילה שוחק אותו.`

> service `detail` — `קפיץ פיתול על ציר מעל שער מתרומם מפולח, שבור לשני חלקים עם רווח ביניהם, ולידו תוף עם כבל פלדה כרוך.`
> / `קפיץ פיתול שנשבר נשאר על הציר בשני חלקים עם רווח ביניהם. הקפיץ נמצא תחת מתח גבוה, ולכן את ההחלפה והכיוון שלו משאירים לטכנאי.`

> city `main` — `שער נגרר סגור בפתח חניה בקומת עמודים של בניין מגורים ותיק, המנוע מחובר לעמוד בטון עגול ומנורת אזהרה מעליו.`
> / `בבניין על קומת עמודים שער החניה מותקן לא פעם שנים אחרי הבנייה, והמנוע מחובר לעמוד או לגדר קיימים. תושבת רופפת מוציאה את השער מיישור.`

> team (placed on `/` and `/אודות/`, names nobody) — `שני גברים בחולצות פולו כהות ליד שער נגרר רחב של חניית בניין, האחד כורע עם מברשת ליד המסילה והשני עומד ליד עמוד העינית.`
> / `בבדיקת שער חניה משותף עוברים על המסילה והגלגלים, על העיניות שמשני צדי הפתח ועל מנורת האזהרה שעל העמוד, לפני שנוגעים במנוע.`

---

## 8. What the gate enforces — and what it still cannot

`node scripts/images/check-images-out.mjs out` runs in `postbuild` after `check-live-out` (**last**,
see §6), as `npm run images:check`, and through the thin `scripts/audit/images.mjs` wrapper in `npm
run audit -- --scope images`. It is dependency-free: `scripts/images/lib/imageinfo.mjs` reads image
headers without a library. It fails the build on:

- a manifest that breaks §5, or an alt or caption that breaks §7, including a banned stem, a name and
  an ASCII quote touching Hebrew;
- an `approved` file missing from `public/` or `out/`, or whose dimensions, bytes or sha256 differ from
  the manifest, or over its class budget (200 / 170 / 120 / 45 KB), or without its `phone` copy;
- any `<img>` on any page without numeric `width`/`height` or with an empty `alt` (unless `aria-hidden`);
- a `_candidates` or `rejected` reference in a production build;
- **any file under `out/images/` the manifest does not vouch for** (except `retired` ≤ 60 days) — a
  file nobody placed is a stray;
- a content page below `gates.minPerContentPage`, or over 900 KB of images (`/גלריה/` its own
  budget); `out/images/` over 20 MB;
- zero or more than one `fetchpriority="high"` content image on an image-bearing page, or one that is
  not the first content image (the header logo is not counted);
- a placement that does not render, or an image that renders without a placement — including any of
  the 5 guide thumbnails missing from `/מדריכים/` or the 3 keeper thumbnails from `/blog/`;
- a `/images/` path inside any `application/ld+json` or `og:image`;
- a disclosure marker missing, doubled or not word for word `notice.json`, the about marker anywhere
  but under a team figure with people, or a note containing «חלק מ» while no approved `owner-supplied`
  entry exists;
- a file shared between two `/locations/*` pages — 14 copies of one file would be a doorway signal.

It prints a per-route coverage table (46 content routes, 50 emitted routes). It cannot see a
surname: `bannedNamesHe` is empty by design, because the names stay in `site.json` outside this
public repo. The toolkit's alt step refuses them, and a hand edit in the manifest is caught only by
a reviewer. A production run removes a stale `out/.images-draft`; the deploy script refuses
`out/.live-draft`. `plan lint`, not this gate, refuses a person on a city route and a person id or a
city in a `fileSlug`.

The site's other scripts see the images too: `a11y.mjs` (`imgCount`, no-alt 0), `perf.mjs`
(`images`, `imagesUnsized 0`, `imagesBytes`, `outBytes` without `out/images/`), `content-depth.mjs`
(figures stripped, the gallery line under 12 tokens), `links.mjs` (`/גלריה/` in the sitemap and not an
orphan), `titles.mjs` (the gallery's title, description and `og:url`), `schema.mjs` (`rawHebrewUrls 0`,
no `ImageObject`), `claims-grep.mjs` (the manifest and the note scanned).

**What no script checks:** whether the scene is plausible, whether the gate is the right type,
whether the face is the right character, whether a keypad or a casing carries micro-text, whether
the frame reads as a snapshot or a photoshoot. The deterministic QA has no OCR, so **100 % zoom
inspection stays a human step**. The toolkit's two judges, the `image-qa-reviewer` agent and the
owner's board are that enforcement. Say which half a finding belongs to.

---

## 9. The legitimacy checklist — electric gates

The precedents that seeded this list come from the fleet: a third party's branding on a casing,
invented product names, foreign building stock, stock-photo gloss, golden-hour light. What is specific
to this trade is that an image model's default "garage door" and "driveway gate" are American timber,
that most objects at a gate carry text (keypads, panels, booms, casings), that a gate is a machine
that can crush, and that a chest with a mark is a company claim.

**What a frame must look like here:**

- **Sliding gates:** a galvanised or dark-painted steel leaf of bars or panels on grooved wheels along
  a ground track, the motor inside the property at the leaf's foot with its cover on and its pinion
  in a rack along the bottom rail, upper guide rollers, an end stop, a photocell pair, an orange lamp
  dome, a small oblique blank keypad; a cantilever gate rides on two carriages beside the opening with
  no track across it.
- **Swing gates:** one or two leaves on hinges at plastered or stone-clad columns, a jointed arm, a
  straight piston or a flush underground lid, an electric lock and a ground stop.
- **Overhead doors:** a sectional door on rollers in vertical and horizontal tracks, a torsion spring
  on a shaft above the opening with a drum and a cable at each end, a ceiling motor on a rail with a
  trolley and a plain red release cord; or a one-piece tilting door on pivot arms.
- **Car-park gates and barriers:** a wide leaf or a sectional door at a pillar storey or a ramp, a
  closed control cabinet and battery box, a rubber safety edge, a sealed loop groove, a receiver with a
  short antenna; a boom with plain red and white bands on a holder at the head of a closed cabinet on
  a plinth, a rest post, photocells on short posts.
- **Shutters:** an aluminium slat curtain in a channel at each side under a plain box, a tubular
  motor in the roller tube, a blank wall switch; a short ladder fully opened on a level floor.
- **Entrances:** a glazed aluminium lobby door with a maglock inside across the top of the frame and
  its plate on the leaf, a closer with its arm at the top of the leaf inside, an electric strike on the
  latch side, a brushed-steel intercom panel with one dark face outside at face height, an exit button
  inside, plain grey mailboxes, a terrazzo floor.
- **People:** plain charcoal-grey polo, bare-headed, no hi-vis, nitrile gloves only on a greasy part;
  beside the gate and outside its path; on the kerb, never in the lane; on step one or two of a fully
  opened ladder. No face in a window, a glass door, a tile, a puddle or a dark screen.
- **Electricity and covers:** every motor cover, control cabinet, barrier cabinet and power-supply
  box closed; no distribution board; hands off boards, terminals, springs, drums and cables.
- **The team frame is candid:** working, one man glancing up — never a to-camera pose.
- **Diagnosis frames find before they fix:** the fault shown as found, covers closed, the leaf at its
  stop, the boom on its rest.

**HARD** — any judge, any reviewer → reject or regenerate (`judge.json` is `strict`, so one judge is
enough for every HARD code; `agreement` is inert and kept only as a test pin):

| Code                                                                                         | In this trade                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wrong-gate-type`                                                                            | a timber or carriage-house door, a picket fence, a timber, split-rail, chain-link or farm gate, a lattice gate, a timber-slat or fabric shutter, a roll-up grille where a slat shutter is named, a sliding leaf with no track and no carriages, a boom with no cabinet                                                                                                             |
| `unsafe-mechanism`                                                                           | a hand at the rack and pinion, under a wheel, between panels or leaf and post, on a spring, a drum, a cable, a bottom bracket or a balance spring, holding a raised boom; a person in a leaf's opening, a swing leaf's arc, under a lifted door or in a boom's lane; riding or leaning on a leaf, a boom or a shutter                                                              |
| `unsafe-electrical`                                                                          | a cover off, a cabinet, panel or underground box standing open with a board or terminals showing, a hand at wiring, bare copper, a distribution board, a lead on wet paving, any cover off in rain                                                                                                                                                                                 |
| `vehicle`                                                                                    | any car, van, truck, motorcycle, scooter, bicycle or trailer, or part of one                                                                                                                                                                                                                                                                                                       |
| `legible-reading`                                                                            | a digit, letter, scale, icon or status word on a keypad, panel, reader, remote, display, lamp, casing, boom, shutter box or switch; a bay number                                                                                                                                                                                                                                   |
| `impossible`                                                                                 | a duplicated object, a leaf through a column, a rack with no teeth, a pinion off its rack, a floating track, a leaf hinged both sides, a boom hinged on nothing, a spring with no shaft, a curtain with no box, a closer arm on nothing, merged limbs — never the cantilever leaf, the underground lid, panels into the ceiling, a boom on its fork or a tilting door standing out |
| `wrong-trade`                                                                                | welding, grinding, concrete, an opened wall or floor beyond the loop groove, plumbing, air-conditioning, roofing or painting kit, a thermal camera, a key machine                                                                                                                                                                                                                  |
| `foreign`                                                                                    | a timber garage door, a picket fence, a US mailbox, a deep-green lawn, siding, brick terraces, shingles, UK/US sockets, carpet, snow, a foreign street or script                                                                                                                                                                                                                   |
| `unsafe-edge`                                                                                | a person above step two, on a folded, leaning or part-open ladder, on stairs, a box, a kerb, a leaf, a boom, a cabinet, a wall or a roof; leaning out of a window at a shutter box                                                                                                                                                                                                 |
| `text`, `branding`                                                                           | any readable character; any logo, maker mark, sticker or brand-like mark on a casing, cabinet, boom, device, tool, bag, van or garment — **any mark on a chest** (no emblem exists)                                                                                                                                                                                                |
| `face-mismatch`, `extra-person`                                                              | a face that is clearly not the character's references (`faceMatchStrict: false` — "unsure" is no code; a blend is a mismatch on both); a wrong person count, a customer, a passer-by, a face in a reflection (`peopleCountStrict: true`)                                                                                                                                           |
| `plate-or-number`, `rating-or-document`, `landmark`, `sparkle-or-watermark`, `nsfw-or-minor` | as in the contract, §9 — a plate, a house or bay number, a name on a panel or mailbox; a certificate, a five-star card, an invoice; the Azrieli towers or the Bahai terraces; a drawn logo or AI sparkle                                                                                                                                                                           |

**SOFT** — a note, two are a regenerate: `safety-gear` (a hard hat, hi-vis or safety glasses; the
portrait's own eyeglasses are never this) · `personal-effects` · `showroom-new` · `ornamental` ·
`busy-corner` · `scene-mismatch` (differs from the brief but is sound — a note, never a reject) ·
`photoshoot-look` · `cluttered` · `low-quality` · `season-mismatch`.

The codes and their wording live in `Media Studio/sites/dangates/judge.json`; every code has a
positive `fix` sentence, `fixRefuse` stops a fix that names a mark or a vehicle, and `notes` carries
the evidence rule for both judges (the expected kit is never `wrong-trade`; a gate's closed control
box is not a distribution board; chevrons are patterns, not text; judge the picture, not the brief).
After a wording change the stored masters are re-scored with `node sites/dangates/rejudge.mjs`,
never re-rendered. A frame that passes every code is still subject to §1: the pixels may be fine and
the caption may not be.

---

## 10. Never delete

A deployed `public/images/*` file is never deleted or renamed casually: crawled HTML, Google Images and
shared links keep the URL. Replacement = a new slug, `retired: "YYYY-MM-DD"` on the old entry, the old
file kept ≥ 60 days, then removed in one commit with its entry. `/images/*` is cached for 30 days, so a
withdrawn file can linger in a browser that long. A rollback never deletes an image: it redeploys
`out.prev/` or reverts the manifest commit.

There is **no revocation clause** on this site: nobody real appears, so no consent can be withdrawn.
The one thing that would change that is the owner saying the characters are real people — then stop
before the next render, switch `policy.personaKind` to `real-consent-open`, write `CONSENT.md`, and
change the note under a new approval (runbook §2).

If the owner later supplies real phone photographs (owner-actions 4.5: landscape ≥ 1600 px, the
original without any added mark — the toolkit composites the logo — and permission for any
identifiable person or property), they enter the same manifest as `owner-supplied` through the
toolkit's `import` and replace renderings one for one at the same box. **The first approved one makes
«כל התמונות …» untrue, so the note changes in the same change, with a new approval.** They never go
through the Media Studio catalog (skill `site-images`), and the Google Business Profile wants them
too, without a note.

---

## 11. Where the pixels come from

```
content/images/plan.json  ──▶  Media Studio page-images --site dangates: write-traps → brief → digest → owner yes → approve
                               → calibrate → pilot (12) → generate → qa → alt → finish   (masters/, finished/)
                               → stage ──▶ public/images/_candidates/ + manifest `candidate`
                               → image-qa-reviewer → review (board + npm run dev:images) → the owner decides
                               → install ──▶ public/images/<group>/ + manifest `approved` → phone-copies
                                              → out/ → deploy with the kit, the plan and the softened sentences (ask)
```

The runbook with every command is skill `page-images-pipeline`; the toolkit's own rules are Media
Studio's skill `page-images` (`Media Studio/.claude/skills/page-images/SKILL.md`) and
`page-images/docs/contract.md`. The site repo carries no `sharp`, no toolkit code and no reference
portrait — only the plan, the manifest, the notes, the approved files, the components and the gate.

## Related

`.claude/agents/image-art-director.md` authors the plan · `.claude/agents/image-qa-reviewer.md` is the
second opinion on candidates · `page-images-pipeline` runs it · `site-images` is the catalog path for
the OG card and the header logo · `docs/business-facts.md` §F is the decision record · ADR 0006 ·
`docs/eeat-and-trust.md` · `performance-web-vitals` and `responsive-accessibility` for the mechanics ·
`new-guide` for the `figure` block · `hebrew-rtl` for the markup.
