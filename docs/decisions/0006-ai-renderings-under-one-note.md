# ADR 0006 — AI renderings as illustrations under one site-wide note

**Date:** 2026-11-11 · **Status:** **accepted; implemented 2026-11-12** (the owner's decisions in
chat, 2026-11-11; backlog N37, Sprint 10; policy `2a86f13`, kit `ff065e4`, plan `08e4820`, then the
install commit) · **live with the next deploy** — the kit and the images go live in **one** deploy

## Context

The site ships text only. Its one `<img>` per page is the 40 px header logo (`6407f83`, backlog
N24), and every image rule in the repo — the `site-images` skill, business-facts §F, owner-actions
4.1, eeat-and-trust §2, performance-guidelines §3 — was written for a future in which the owner's
own job photographs fill the pages: real pictures of real work, each with a city, a gate type and
a month, or nothing. The owner's answer of 2026-11-10 kept that doctrine: photos later, with no
date, and neither stock nor generated images in the meantime.

On 2026-11-11 the owner asked for something else, in chat and in the Drive brief «Add images to all
pages prompt»: the image strategy gagoline.co.il and betonplus.co.il already received through the
Media Studio `page-images/` toolkit — realistic, phone-snapshot-style AI renderings on every
content page, a gallery, Hebrew alt and caption on each, the logo composited bottom-right, every
frame judged for plausibility before a human sees it, the owner approving on the local site before
anything goes live, and the process automated end to end. That supersedes the 2026-11-10 answer.
The toolkit exists and has onboarded eight fleet sites; hambabait.co.il is the structural twin
(Next 14, the same Hebrew static routes, guides in `lib/guides.ts`). dangates is onboarded as a
configuration of that toolkit plus a site-side kit, not as new software.

The rule this site must keep while doing so is golden rule 1: a rendering may illustrate, but it
may never testify — not to a job, a city, a date, a customer, a price, a warranty, a rating or a
credential — and no text beside it may say what business-facts marks 🔶.

## Decision

1. **Every content page carries AI renderings as illustrations under one site-wide Hebrew note.**
   46 content routes — the 47 sitemap URLs minus `/מדיניות-פרטיות/` and `/הצהרת-נגישות/`, plus a
   new `/גלריה/`; `/תודה/` and the 404 carry none. The note is one text in three places — a footer
   line on every page linking to the gallery, the gallery intro, a line under the team frame on
   `/אודות/` — kept in `content/images/notice.json` and mirrored in the toolkit's `site.json`; no
   per-image label, and the note says «כל התמונות …», never a fraction. The owner approves its
   wording with the prompt digest, so any later change needs a new approval.
2. **The two portrait sets the owner supplied are AI-made characters, not real people.** They are
   `tech-a` and `tech-b` in every record, never named, never captioned as staff or as technicians,
   never a byline, an author or a `Person` node. The policy is `synthetic-unnamed`: no consent flow,
   no contact sheets, no consent record. Their source labels stay in Media Studio (`PERSONAS.md`,
   outside git) and never enter this public repo, a commit message or a pasted listing; the names
   are banned strings in the toolkit's configuration only.
3. **The logo stays as supplied, its «24/7» line included, on the watermark and in the header.**
   The claim lexicon does not change: no copy, alt, caption or note may say 24/7 (the alt writer
   reads the master, which carries no logo), and owner-actions 3.5 stays open. business-facts §E and
   this ADR record the contradiction so nobody resolves it in either direction without the owner.
4. **The reference portraits come through the toolkit's Drive pull** (`portraits` role) from the one
   folder «תמונות עובדים», shared with the fleet's reader account as Viewer — the folder, not its
   parent (owner-actions 2.5). The logo is the 1280 px RGBA PNG export; the toolkit composites it at
   `finish`, a model never draws it.
5. **Placement is in the text flow at full column width:** a plain `<figure>` between the paragraphs
   it illustrates, caption under it, the first directly after the page's answer block. No slider,
   lightbox, popup or floating thumbnails. The qualification: the home and hub strips, the two
   contact figures and the index thumbnails carry no caption; every body figure does.
6. **Spend is capped at US$60** (`runner.costCapUsd`), expected ≈ US$30.
7. **`out/images/` is outside the audit's 15 MB `maxOutBytes`.** `perf.mjs` reports `imagesBytes`
   beside `outBytes`; the images gate enforces ≤ 900 KB of images per page, `/גלריה/` ≤ 2.5 MB and
   `out/images/` ≤ 20 MB.
8. **No chest emblem** — plain charcoal-grey work polos, nothing lettered.

**Fleet defaults adopted without a new decision** (the owner accepts recommended defaults): a
rendering never in `og:image`, in JSON-LD or on the Google Business Profile; no file-level AI marker;
strict two-judge QA with a trap set calibrated for this trade; the pro model for a frame with a
character, the light model for people-free frames; WebP at 1400 / 1200 / 960 / 480 px long edges
under 200 / 170 / 120 / 45 KB with 720 px phone copies; `/גלריה/` in the header before «מחירון»;
city pages people-free; the team frame candid and placed on `/` and `/אודות/` only; own renders only
on the 3 blog posts that stay, reuse on the 8 scheduled to fold or 301; three sentences within one
screen of a character softened with the owner's exact-Hebrew yes.

**Where it lives:** the working rules in CLAUDE.md §15; the record in business-facts §F; the
owner's rows in owner-actions 2.5, 3.13, 4.5; the work in backlog N37 and Sprint 10; the doctrine
and the procedure in the `page-imagery` and `page-images-pipeline` skills; the toolkit contract in
`Media Studio/page-images/docs/contract.md`.

## Rejected

- **Per-image labels** (a «הדמיה» badge or an AI word in every alt): one site-wide note read once
  beats forty-six interruptions, and the gate proves the note is on every page verbatim.
- **Stock photographs:** a stock gate is somebody else's work presented as this site's setting, and
  nothing about it is checkable; a rendering under the note claims nothing.
- **A chest emblem cut from the lettered logo:** the only emblem available is the wordmark itself,
  which would put the «24/7» line on a chest in every frame with a person; the judges reject
  lettering on clothing instead.
- **A gallery served from the Media Studio catalog** (`JobPhotos`, the Hero's `images.hero` branch):
  both would present catalog pictures as real field work; they are retired in the kit commit and the
  catalog keeps the OG card and the header logo only.
- **Raising `maxOutBytes` for the images:** the 15 MB cap is a budget for the HTML and the RSC
  payloads; folding ten megabytes of WebP into it would hide a chrome regression behind an image
  batch. The images get their own gate and their own total.
- **The team frame on `/צור-קשר/`:** the team slot is held by strict QA more often than any other,
  and a held frame would leave the contact page with one image; it reuses a finished-state service
  frame instead.
- **Waiting for real photographs:** the owner's 2026-11-10 answer, superseded on 2026-11-11.

## Consequences

- **The 24/7 contradiction is recorded, not resolved.** The watermark carries «24/7» on every
  rendering while the copy never says it and the lexicon stays. A reader may notice; the owner
  chose that. A confirmed answer to 3.5 would end it in one direction, a logo without the line in the
  other; neither is an agent's call.
- **The perf budget splits.** `thresholds.json` → `maxOutBytes` measures `out/` without
  `out/images/`; `imagesBytes` is bounded by the manifest's `gates.maxTotalBytes` (20 MB). The
  gallery's own line is `pageBudgets["/גלריה/"]` 3,145,728 B (3 MB), set by hand at the install
  commit: decision 7 said 2.5 MB, but the gate sums the full files, and the 14 tiles at their caps
  are 2,652,160 B — recorded in business-facts §F's install record, never a side effect. The
  known baseline moves twice, at the kit commit and at the install commit, and `qa-build-gate`
  records both.
- **The 8 departing blog posts are reuse-only.** They borrow two service close-ups each at zero
  spend; when a post is folded or redirected (content-calendar §4) its placements leave in the same
  commit, and `lib/images.ts` throws on a placement whose route is gone.
- **Decision 5 has one qualification.** The home and hub strips, the two figures on `/צור-קשר/`
  and the index thumbnails on `/מדריכים/` and `/blog/` carry no caption; every body figure does, and
  the gate checks every rendered caption against the text rules.
- **The honesty rule moves from the pixels to the words.** Alt and caption describe only what is
  visible and would still be true if the picture were a photograph; the stems of
  `scripts/audit/claims.json` and the live-kit's staffing and identity stems are mirrored into the
  toolkit's `claims` and enforced at module load and in the postbuild gate; `claims-grep.mjs` scans
  the three `content/images/*.json` files.
- **Real photographs do not reopen the question.** They enter the same manifest as `owner-supplied`
  entries through the toolkit's `import` and replace renderings one for one; the first one makes
  «כל התמונות …» untrue, so the note changes with it under a new approval (owner-actions 4.5).
- **No revocation path exists**, because nobody real is depicted. Retire-never-delete is the only
  removal rule. If the owner ever says the characters are real people, rendering stops before the
  next frame and the policy, the note and a consent record change together.
- **The repo is public.** The surnames and the Drive file labels of the character sets never enter
  it; the docs say "two AI-made character sets, `tech-a` and `tech-b`" and nothing more.
- Every rule that waited for real photographs — CLAUDE.md §8, the `site-images` skill,
  eeat-and-trust §2, performance-guidelines §3, accessibility-and-i18n, content-standards §3,
  growth-roadmap, geo-plan, gbp-runbook, the auditors and the writer skills — is rewritten to this
  doctrine in the policy commit; audit reports stay as history.

## Implementation — 2026-11-12, Sprint 10

Built on the `page-images` branch in four steps. Every number below is also in business-facts §F's
install record.

- **Policy** (`2a86f13`, 2026-11-11): this ADR, CLAUDE.md §15, and the rewrite of every rule that
  waited for real photographs.
- **Kit** (`ff065e4`, 2026-11-11): the toolkit's port rendered `components/images/Figure.tsx`,
  `FieldStrip`, `TeamTeaser`, `lib/images.ts`, the `/גלריה/` page and the postbuild gate
  `scripts/images/check-images-out.mjs`. The commit wired them into every content template with one
  priority image per page computed from what renders, gave the guide block model a `figure` kind in
  place of the unused `image` kind, and retired `JobPhotos` and the Hero's catalog-image branch.
  With the empty manifest the gate printed 46 content routes and 0 images.
- **Plan** (`08e4820`, 2026-11-11): `content/images/plan.json` from Media Studio's
  `sites/dangates/plan-generator.mjs`, 78 renders and 36 reuse placements on 46 content routes.
  `c535392` (2026-11-12) softened the three sentences near the characters after the owner's yes on
  digest `58391645`; `f7271da` (2026-11-12) re-scened two slots.
- **Run** (the Media Studio toolkit, 2026-11-12): calibration on 38 traps (every scored HARD code at
  100 % recall, Media Studio `a183bd8`), a 12-frame pilot (12 passed, about US$2.3), the four
  batches, `qa`, `alt`, `finish` and `stage`, a second-opinion pass by the `image-qa-reviewer`
  agents, two board sessions with the owner on the local board (`54c5ed25`: 76 of 76 approved;
  `ac8deff6`: 2 of 2), then `install` and the phone copies.
- **Install** (the install commit, 2026-11-12): the 78 approved files in `public/images/` with their
  78 phone copies and 8 derived thumbnails; `content/images/manifest.json` with 78 approved entries
  and its gates set (`minPerContentPage` 2, `maxPageImageBytes` 921,600, `maxTotalBytes`
  20,971,520, `pageBudgets["/גלריה/"]` 3,145,728); the dates moved to 2026-11-12 on every route
  that gained a figure; the `/הצהרת-נגישות/` bullet «טקסט חלופי בעברית לכל תמונת תוכן, שנבדק
  אוטומטית בכל בנייה של האתר.» in place of the general alt-text bullet; `/llms.txt` printing
  `llmsCopy.renderingsNote` (`lib/content.ts`) only while `hasApprovedRenderings()`; and the new
  `scripts/serve-out.mjs`.

**Measured outcome** (`npm run gate`, 2026-11-12):

- 78 of 78 slots approved, 0 held. 132 page renders (120 in the slot folders, 12 superseded by the
  re-scene) and 38 calibration traps. Spend US$22.38 of the US$60 cap, against an expected ≈ US$30.
- Frames: 59 people-free, `tech-a` 9, `tech-b` 8, both 2 (`home-team`, `gallery-generated-4`);
  14 gallery tiles.
- Files: full images 8,855,580 B, phone copies 2,727,992 B, thumbnails 182,508 B; `out/images/`
  11,490 KB; `perf.mjs` → `imagesBytes` 11,766,080 of `maxTotalBytes` 20,971,520, `imageFiles` 164.
- Heaviest pages: `/גלריה/` 14 images, 1,474 KB (budget 3 MB); `/services/שער-זרוע/` 3 images,
  435 KB (budget 900 KB).
- The gate: the one known failure only (the `content-depth` post floor, 11 of 11 posts under 900
  words); `images:check` 46 content routes, 46 with images, 78 entries approved; `outBytes`
  13,522,450 under `maxOutBytes` 15,000,000; `images 168`, `imagesUnsized 0`, `imgCount 168`; 50
  `index.html` under `out/`; `sitemapUrls 48`; `rawHebrewUrls 0`; `sharedParagraphs 1`;
  `claims-grep` pass; `clientComponents 5`.

**Deviations from the decision as written:**

- **Two slots were re-scened, with the owner's yes.** QA stopped `services-barrier-main` (a hand on
  the boom holder, or a boom off its rest) and `cities-kfar-saba-main` (a swing leaf drawn with a
  sliding gate's wheels and rail) after six attempts each. The operator rewrote the two scenes
  (`f7271da`; every other slot in the plan stayed byte-identical), the owner said yes to the two prompts in
  chat (digest `f4d2e10f`, stamped as batch `d8025628` because a pre-authorised fix note on another
  prompt moved the id), and they passed on attempts 6 and 4.
- **The gallery budget is 3 MB, not 2.5 MB.** Decision 7 named 2.5 MB, but the gate sums the full
  files, and 7 half and 7 large files at their caps are 2,652,160 B. `pageBudgets["/גלריה/"]` was
  set by hand to 3,145,728 B at install, as a recorded threshold decision; the real gallery is
  1,474 KB.
- **The owner's board view is a built site, not `next dev`.** `next dev` (14.2.35 with
  `output: "export"`) answers every Hebrew dynamic route with a 500 ("missing param … in
  generateStaticParams()"), so `npm run dev:images` cannot show those pages. The owner reviewed
  beside an `IMAGES_DRAFT=1` build served by `node scripts/serve-out.mjs`, and the docs that named
  `npm run dev:images` as the board view were corrected.
- **The operator corrected texts before the board.** The second-opinion pass (5 `image-qa-reviewer`
  reviewers, 5 verifiers) sent one frame back (`home-strip-3`, a boom drawn as two arms; redone,
  passed on attempt 3), and the operator corrected 20 alt and caption texts through the toolkit:
  typos, a light-grey polo the alt called dark, and captions that read as a sequence or a promise.
  The owner then approved all 76 on the board with no text edits. The dark rounded panel behind the
  logo on busy corners is the `finish` step's deliberate scrim, not a defect.
- **Two judge definitions were narrowed during the run** (Media Studio `sites/dangates/judge.json`):
  `face-mismatch` only for a clearly different man (`9bcd072`, after a profile face at the back of a
  two-man frame was flagged as too small to judge), and a person on a kerb is not `unsafe-edge`
  (`60dc90a`).

**Not yet live.** The install commit is inert until the deploy that follows it on the owner's word
("approved, deploy", in chat 2026-11-12); the kit and the renderings go live together there. The
post-deploy image checks in `deploy-dangates` are the acceptance test.
