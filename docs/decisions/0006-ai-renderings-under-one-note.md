# ADR 0006 — AI renderings as illustrations under one site-wide note

**Date:** 2026-11-11 · **Status:** **accepted** (the owner's decisions in chat, 2026-11-11; backlog
N37, Sprint 10) · **not yet implemented** — the policy commit records it; the kit commit, the plan
commit and the install commit follow, and the kit and the images go live in **one** deploy

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

## Implementation

To be filled at the install commit (Sprint 10.7): the kit commit, the plan commit, the install
commit and the deploy, with the install record of business-facts §F.
