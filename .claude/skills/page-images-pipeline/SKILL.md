---
name: page-images-pipeline
description: The site-side runbook for putting AI page images on דן שערים חשמליים — the policy that must already be in place, the authored slot plan (78 renders, 36 reuse placements, 8 derived thumbnails on 46 content routes), the Media Studio page-images toolkit with --site dangates in order (plan lint → write-traps → brief → digest → the owner's one yes → approve → calibrate → pilot of 12 → four batches → qa → alt → finish → stage), the image-qa-reviewer pass, review on npm run dev:images and the board, install and the phone copies, npm run gate, deploy with -Domain dangates.co.il (ask first) and the post-deploy image checks, the batch globs, the cost table (≈ US$30 against a US$60 cap), the draft-marker proof in PowerShell syntax, what git status must show, the retire policy and the no-consent rule for the two AI-made characters, and what is site-specific for the next fleet site. Use when adding, regenerating, replacing or retiring images, when a candidate needs review, or when images:check fails. Triggers "generate the images", "run the image pipeline", "approve the batch", "replace this image", "retire an image", "images:check failed", "stage the candidates", "the portraits", "להריץ את התמונות".
allowed-tools: Read, Grep, Glob, Bash, PowerShell
---

# Page images — the pipeline, site side

Read first: `CLAUDE.md` §15 (the decisions), skill `page-imagery` (what the words may say, the slot
inventory, the manifest contract) and the contract that fixes every path and command —
`C:\Users\robiu\antigravity\Projects\Media Studio\page-images\docs\contract.md`. Where this file and
the contract disagree, the contract wins. The fleet runbook is
`Media Studio\runbooks\page-images-for-a-site.md`; the plan this run implements is
`C:\Users\robiu\.claude\plans\pasted-content-id-e70a-i-want-memoized-puppy.md`.

The toolkit lives in Media Studio, not here. This repo contributes the slot plan, the components, the
validator (`lib/images.ts`) and the gate (`scripts/images/check-images-out.mjs`); it carries no `sharp`
and no new dependency. This site's configuration lives in `Media Studio\sites\dangates\` (`site.json`,
`style.md`, `judge.json`, `plan-generator.mjs`, `write-traps.mjs`, `label-calibration.mjs`,
`rejudge.mjs`, `brand\`); the reference portraits (`prepared\tech-a-0N.jpg`, `tech-b-0N.jpg`) and
`PERSONAS.md` live in `Media Studio\refs\dangates\` and never enter git. **The repo is public:** the
portrait sets' Drive file labels and the names they carry stay in `site.json` and `refs\`, never in
this repo, a commit message or a pasted listing — write "tech-a" and "tech-b".

> **Status, 2026-11-11.** Written with the policy commit (A). Every number marked _filled at
> install_ is measured at D.

## The owner's touches — everything else runs unattended

| #   | Touch                                                                                                                                                                                                          | Where                                                                          | State                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------- |
| 0   | Approve the plan (characters, note, gallery, cap)                                                                                                                                                              | chat                                                                           | done 2026-11-11       |
| 1   | Share the Drive folder «תמונות עובדים» (`1Fbvm6whEQ6PJIJSBIeOfhs7Zni5uScOg`) with `drive-reader@gsc-il-fleet-reporting.iam.gserviceaccount.com` as **Viewer** — the folder, not its parent (owner-actions 2.5) | Google Drive → the folder → Share                                              | before `drive-pull`   |
| 2   | One **yes** on the prompt digest (one line per slot, the fixed blocks, the disclosure texts, the three softened sentences, the watermark preview, the cost)                                                    | `Media Studio\sites\dangates\plan-digest.md` → chat                            | before `approve`      |
| 3   | One **board session** on the local draft site ("approve all passing" + spot checks, edit any Hebrew)                                                                                                           | `http://localhost:4310` beside `npm run dev:images`                            | after `stage`         |
| 4   | The **deploy word** after the dry run                                                                                                                                                                          | `ops/deploy-site.ps1 -Domain dangates.co.il -Confirm` + `# APPROVED: <reason>` | after the gate        |
| (5) | A second yes **only** if the pilot forces `brief --refresh-blocks`                                                                                                                                             | chat                                                                           | if the batch id moves |

**There is no consent touch and no contact sheet.** Both characters are AI-made (owner decision 2,
`policy.personaKind: "synthetic-unnamed"`); `generate` needs no consent record and `install` checks
none. The record is `refs\dangates\PERSONAS.md`. If the owner ever says the characters are real
people, stop before the next render, switch to `real-consent-open`, write `CONSENT.md` and change the
note (runbook §2).

Expected spend ≈ US$30 (26–36), against a hard cap of US$60 (`runner.costCapUsd`). Hambabait, the
twin, measured US$31.44 for 86 renders + 31 traps.

## 0. Prerequisites

- The policy is in place: `CLAUDE.md` §15, this skill, `page-imagery`, the two agents, the docs, ADR 0006. The retired-wording grep in the plan's Commit A section returns nothing over `CLAUDE.md docs
.claude` (after the kit commit also over `lib app components scripts/audit`; `docs/audits/` is
  history and excluded).
- **WS-T landed in Media Studio** (`cd page-images && npm test` green): the per-list `keyMap`
  (every dangates slug is Hebrew), the `portraits` role in `scripts/drive-pull.mjs`, the template kit
  at hambabait's level (phone copies by default), `test/dangates-site.test.mjs`.
- `git config core.quotePath false` in this repo. Without it git prints Hebrew paths as octal, and the
  Stop hook `format-changed.ps1` hands that string to Prettier and swallows the error, so
  `app/גלריה/page.tsx` and `app/מדריכים/**` are never auto-formatted. Run `npm run format` before every
  gate either way.
- `npm run gate` is green with the manifest as it is (the one known failure, the `content-depth`
  post floor): an empty `images[]` passes while `gates.minPerContentPage` is 0. The images gate prints
  **46** content routes on 50 emitted routes, 0 images, the gallery marker on `/גלריה/` and 0 footer
  notes; `perf` `images 49`, `imagesBytes 0`; `a11y` `imgCount 49`; `links` 48 sitemap URLs with
  `/גלריה/` inbound from every page.
- Media Studio: `cd page-images && npm install && npm test`; `secrets/.env` holds `GEMINI_API_KEY`
  (billing on) and `ANTHROPIC_API_KEY` — by name, never printed.
- **The portraits are on disk** (after touch 1): `node scripts/drive-pull.mjs --site dangates
--dry-run` → without → 11 files under `refs/dangates/drive/portraits/`; if the folder lands flat,
  split by the original names in `refs/dangates/drive/manifest.json` into `refs/dangates/stage/tech-a/`
  (6) and `stage/tech-b/` (5), then `node page-images/cli.mjs refs import --site dangates --from
refs/dangates/stage/tech-a --as tech-a` (and `tech-b`); view `prepared/`, list the three most frontal
  per character in `site.json` (`refs[0]` is what the judges see); write `refs/dangates/PERSONAS.md`;
  delete the Downloads copies and date it there. Nothing from `refs\` is ever copied into this repo.
- **The brand file is prepared:** `node page-images/tools/brand-prepare.mjs --in
"C:/Users/robiu/Downloads/dangates_logo.png" --out sites/dangates/brand/logo.png --preview --dry-run`
  → without (no `--recolor-neutral`; the 1280 px RGBA PNG is read directly, resized to 1200). The
  preview PNG rides with the digest. The logo carries «תיקון והתקנה 24/7» as supplied (owner
  decision 3): it is not recoloured, cropped or edited.
- `hebrew-editor` → `claims-verifier` have signed off the disclosure texts and the gallery copy
  (`content/images/notice.json` = `site.json` `disclosure.texts`) before `port`.
- `node page-images/cli.mjs doctor --site dangates` is all green: keys, models, 3 + 3 portraits, the
  RGBA logo, `judge.json` strict, the lists with ASCII route keys from the four `keyMap`s (7/14/5/11
  rows), the style blocks including `TRADE:<each Hebrew service slug>` with no `<fill` left,
  `disclosure.texts` = `content/images/notice.json`, `scripts/images/lib/images.config.mjs` =
  `site.json` (stems, people ids, gates).

Toolkit commands run from the Media Studio root:
`cd "C:\Users\robiu\antigravity\Projects\Media Studio"` then
`node page-images/cli.mjs <cmd> --site dangates [--dry-run]`. Every command prints what it would do
with `--dry-run`; use that form before anything that spends money or writes into this repo.

**Keep Hebrew off the PowerShell 5.1 command line.** `--only` takes ASCII ids and globs (the `keyMap`
keys — `services-sliding-main`, never a Hebrew slug), `--by` stays ASCII, and routes live only in JSON
and TS. **Quote a comma list:** an unquoted `a,b` is an array in PowerShell and reaches node as two
arguments.

## 1. The slot plan

`content/images/plan.json` is built by `Media Studio\sites\dangates\plan-generator.mjs` from compact
per-slot specs, run from this repo's root after a fresh `npm run build` (it quotes the Hebrew
`context` from the built pages in `out/`: the answer `<p>`, the body paragraphs, the pricing answer,
the hero lead); the `image-art-director` agent owns the subjects. **78 render slots + 36 `reuse`
entries** (33 figure placements + 3 `/blog/` thumbnails); the 8 card thumbnails (5 guides, 3 keeper
posts) are derived by `finish`. No `badge` field. `time` is never `late-afternoon`. Then:

```powershell
node page-images/cli.mjs plan lint --site dangates     # must be clean
npx prettier --write content/images/plan.json          # in this repo
```

The lint refuses duplicate ids or slugs, unknown routes or slots, a non-ASCII route key, a content route
with fewer than two images counting reuse, mixed aspects in one row, more than one priority on a
route, a city or a person id in a `fileSlug`, two city slots with the same (subject stem, people,
time) tuple, and **a person on a city route** (`policy.peopleRoutes: { cities: false }`). A
people-free subject must not contain man, men, person, people, technician, worker, crew, he, him,
his, hand or hands, not even inside "no people". **Never re-run the generator after `approve`:** it
changes the plan fingerprint and voids the yes.

### Prove the kit without spending — the draft-marker proof

Once, after the plan lints clean and before the first paid call, from this repo's root:

```powershell
node "C:/Users/robiu/antigravity/Projects/Media Studio/page-images/tools/synth-site-test.mjs" approved
npm run build                                    # read the coverage table
$env:IMAGES_DRAFT="1"; npm run build; Remove-Item env:IMAGES_DRAFT
Test-Path out/.images-draft; Test-Path out/.live-draft        # True, True
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain dangates.co.il -DeployOnly -DryRun   # must refuse (plain -DryRun never reads out/)
node "C:/Users/robiu/antigravity/Projects/Media Studio/page-images/tools/synth-site-test.mjs" clean
npm run build                                    # back to the real manifest; both markers gone
```

The production build must show every one of the 46 routes ≥ 2 images, exactly one priority content
image per page (the header logo is not counted), 5 thumbnails on `/מדריכים/` and 3 on `/blog/`. The
draft build must leave both markers, and the hub refuses it (the refusal says `LIVE_DRAFT`, for an
images draft too; `-DeployOnly` included). **Always run `clean`:** the stand-ins land in
`public/images/` and the manifest is overwritten. Nothing from the synth run is committed; `git status
--short` afterwards shows only `content/images/plan.json`. If the validator refuses the tool's
stand-in texts, edit `ALTS`/`CAPTIONS` in the tool (keep «קיר», «פתח», «שלב», «בטון», «בסיום»
unbanned), never the stems.

## 2. Traps, prompts and the digest

```powershell
node sites/dangates/write-traps.mjs                   # the 38 calibration traps (plan Appendix D), bucket calibration, refs: []
node page-images/cli.mjs brief  --site dangates --dry-run
node page-images/cli.mjs brief  --site dangates       # prompts\dangates\<slot-id>.md, approved: null — ≈ US$1
node page-images/cli.mjs digest --site dangates       # sites\dangates\plan-digest.md, prints batch <sha8>
```

`brief` asks Claude (the scene writer) for one paragraph per slot and retries a rejected one; a slot
that still fails is re-run with `--only <id>`. The digest is the owner's page: one line per slot, the
fixed blocks once (PEOPLE:none/one/two, one TRADE block per service plus `generic`, CAMERA, ISRAEL,
NO TEXT, COMPOSITION, FRAMING, the WRITER blocks), the Hebrew notes, the three softened sentences
of `lib/content.ts` (`differentiators[2]`, `aboutSections[0]`, `aboutSections[2]` — exact Hebrew in
the plan), the watermark preview PNG, the cost estimate and the batch fingerprint. After the
portraits are on disk, add one distinguishing clause per character (hair, beard, glasses) to
PEOPLE:two in reference order and run `brief --refresh-blocks` **before** the digest.

## 3. The owner's yes → approve

Only after the owner says yes **in chat** to that digest (silence is not approval — the three softened
sentences included):

```powershell
node page-images/cli.mjs approve --site dangates --batch <sha8> --by "owner in chat"
```

It stamps `approved:` into every prompt whose fingerprint matches and refuses any prompt edited since.
Nobody edits `approved:` by hand. QA amendments (`## Fix after attempt N`) are covered; a new scene is
a new batch, and so is `brief --refresh-blocks` after the yes (touch 5). The same yes approves the
`notice.json` wording; changing it later needs a new approval.

## 4. Calibrate, pilot, then the batches

**Calibrate once.** The trap set — 38 cheap people-free renders (nano, 2K) labelled by hand, ≥ 2 per
relied-on HARD code and 3 clean negatives; only the two `face-mismatch` traps send a prepared
portrait — sits in `page-images/calibration/manifest.json` as `sets.dangates`. Go only when every
scored HARD code reaches ≥ 0.9 recall; 17 of 19 codes are scored (`missing-person` and
`nsfw-or-minor` are not). Tune the wording of a code, never a label. About US$3–4.

```powershell
node page-images/cli.mjs generate --site dangates --only "calib-*" --cap 6
# open every trap; node sites/dangates/label-calibration.mjs labels the three clean traps verdict: "pass", hard: []
node page-images/cli.mjs qa --site dangates --calibrate --cap 12
```

**Pilot, 12 frames** (`--cap 12`): 6 with a character + 6 people-free. `home-team` (both: blend,
refusal, candid), `services-sliding-main` (tech-a: rack and pinion, `text` on the housing),
`services-swing-main` (tech-b: an `unsafe-mechanism` false-fire at a hinge), `services-shutters-main`
(tech-b: an `unsafe-edge` false-fire on step two, shutter stock), `guides-not-closing-lead` (tech-a),
`contact-main` (tech-a); `services-overhead-detail` (spring and drum geometry → `impossible`),
`services-sliding-detail` (the most-reused frame, placed on 5 pages), `cities-tel-aviv-main` +
`cities-jerusalem-main` (archetypes, stone cladding vs `foreign`, near-duplicates),
`guides-gate-types-lead` (a cantilever → the `impossible` NOT clause), `guides-standard-900-lead`
(photocells and lamp → `text` / `legible-reading`). It measures refusals, face match per character,
the judge split rate, `wrong-gate-type` and readings per model. `--cap` bounds the ledger total, not
the run.

```powershell
node page-images/cli.mjs generate --site dangates --only "home-team,services-sliding-main,services-swing-main,services-shutters-main,guides-not-closing-lead,contact-main,services-overhead-detail,services-sliding-detail,cities-tel-aviv-main,cities-jerusalem-main,guides-gate-types-lead,guides-standard-900-lead" --dry-run
node page-images/cli.mjs generate --site dangates --only "<the same 12>" --cap 12
node page-images/cli.mjs qa       --site dangates --only "<the same 12>"
```

Look at them at full size, then apply the decision rules and record the outcome in the report:

| Measured                               | Decision                                                                                                        |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Refusals ≥ 2 of the 6 character frames | `both` becomes one character (`home-team`, `gallery-generated-4`)                                               |
| A character's face "no" > 30 %         | reorder or re-prepare that character's refs                                                                     |
| Judge split > 40 % on a code           | reword the code's NOT clause in `judge.json`, `node sites/dangates/rejudge.mjs` (no render); proceed under 25 % |
| The same HARD code on ≥ 3 frames       | fix the style block, `brief --refresh-blocks`, new digest, second yes **before** the batches                    |
| `large` over 200 KB on ≥ 2 frames      | long edge 1300 before raising any byte budget                                                                   |
| Watermark unreadable at phone size     | `watermark.widthPct` 0.15                                                                                       |
| Pilot spend > US$10                    | `runner.maxAttempts` 4 for the batches                                                                          |

**Batches, under the same digest.** `--only` is an exact id, a comma list, or a `*` glob; a bare prefix
such as `services-` matches nothing. `generate` is idempotent by render key, so a slot the pilot already
rendered is skipped, not billed again. After each batch read the sibling look-alikes before the next.

| Batch | `--only`                                                        | Slots |
| ----- | --------------------------------------------------------------- | ----- |
| 1     | `"services-*-main,services-*-detail,services-*-work,gallery-*"` | 28    |
| 2     | `"home-*,services-pair-*,areas-*,about-*,contact-*,pricing-*"`  | 14    |
| 3     | `"cities-*"`                                                    | 28    |
| 4     | `"guides-*,blog-*"`                                             | 8     |

For each batch:

```powershell
node page-images/cli.mjs generate --site dangates --only "<batch>" --dry-run
node page-images/cli.mjs generate --site dangates --only "<batch>"
node page-images/cli.mjs qa       --site dangates --only "<batch>"
```

After any `judge.json` wording change: `node sites/dangates/rejudge.mjs` on the stored masters,
never `qa --force`. Then, when the batches are through:

```powershell
node page-images/cli.mjs alt    --site dangates
node page-images/cli.mjs finish --site dangates --max-bytes
node page-images/cli.mjs stage  --site dangates --dry-run
node page-images/cli.mjs stage  --site dangates            # add --needs-owner for a stopped slot's best attempt
```

- `generate` runs 2 at a time with 6 s pacing, retries 429/5xx, writes every paid call to
  `logs\page-images\dangates.ledger.jsonl` first and refuses past the cap. `gemini-3-pro-image` renders
  a frame with a character, `gemini-nano-banana-2.1` a people-free one. A Gemini refusal on a face
  prompt gets one framing retry (three-quarter from behind), then a people-free twin of the slot —
  except `home-team`, whose slot is in `policy.namedSlots` and gets no twin. `maxAttempts 6`,
  `maxFailures 3`; a slot stuck at attempt 4 is re-scened by the operator.
- `qa` = deterministic checks + two vision judges with this site's codes (`page-imagery` §9) under
  `strict`: any HARD code from either judge regenerates, so judge precision (the evidence rule, the
  NOT clauses), the split-rate rule and `rejudge` are the cost controls, not the cap. `faceMatchStrict`
  is `false` (an "unsure" face is no code — the fleet lesson that "unsure" loops); `peopleCountStrict`
  is `true` (a wrong count is HARD); `wrong-gate-type` and `vehicle` are binary. There is no OCR, so
  100 % zoom on keypads, panels, booms and casings stays a human step.
- `alt` writes the Hebrew alt, caption and English alt from the finished pixels (the master, which
  carries no logo); two re-asks, then `alt-needs-edit` on the board. Never type alt text into the
  manifest yourself, except `image-art-director`'s alt and caption edits on `candidate` entries.
- `finish` resizes to the slot's long edge (1400 / 1200 / 960 / 480), composites the logo bottom-right
  (the one supplied file, on a plain corner, with a shadow), writes WebP q80 (q74 on re-encode) to the
  byte budget (200 / 170 / 120 / 45 KB), derives the 8 thumbnails and drops metadata.
- `stage` copies candidates to `public/images/_candidates/<group>/` (gitignored) and appends
  `status: "candidate"` entries to `content/images/manifest.json`; strict QA holds judge splits.

## 5. Review on the real pages

Before the owner's session, run the `image-qa-reviewer` agent for a read-only pass: the blind read,
the HARD and SOFT codes, the installer's checklist, the plain chest, the watermark on a plain corner,
and the alt and caption bar "would it still be true if the picture were real". Regenerate what it
finds before the owner sees the board (or edit the alt on the board).

```powershell
$env:IMAGES_DRAFT="1"; npm run build; Remove-Item env:IMAGES_DRAFT   # in this repo: the draft build (next dev 500s on Hebrew dynamic routes)
node scripts/serve-out.mjs                          # the draft site at http://localhost:3000, in this repo
node page-images/cli.mjs review --site dangates --no-dev   # the board at http://localhost:4310 (--port 4311 if another site's board holds it)
```

Candidates render in place with the «טיוטה — ממתין לאישור» badge; each board card links to
`http://localhost:3000<route>#img-<id>`. Check `/`, a service page, a city page, a guide, a keeper
post, a departing post, `/אודות/` (the team figure and its note), `/צור-קשר/`, `/מחירון/`, `/גלריה/`,
`/blog/`, `/מדריכים/` and the footer, on a phone width too. Decisions persist to
`Media Studio\review\dangates\decisions.json`. **Stop the dev server before any build.**

**The review happens on the local draft site only.** A `pages.dev` preview would publish candidate
pixels, and the deploy script refuses drafts. There is no contact sheet and nothing to relay: nobody
real appears.

## 6. Install, status, gate

```powershell
node page-images/cli.mjs install --site dangates --dry-run
node page-images/cli.mjs install --site dangates
node page-images/tools/phone-copies.mjs --site dangates --dry-run
node page-images/tools/phone-copies.mjs --site dangates   # the 720-px phone copies; the gate fails without them
npm run images:status          # plan vs manifest per route: 0 missing, or the held list named
```

Approved → `public/images/<group>/<file>`, `status: "approved"`, the owner's edited text; rejected →
deleted from `_candidates/` (it never entered git), a copy kept under
`Media Studio\finished\dangates\rejected\`; regenerate → queued for the next batch.

When `images:status` shows 46 of 46 routes complete, in this order (commit D):

1. Flip `gates.minPerContentPage` to 2 in the manifest — only at 46/46 — and set the gate numbers by
   hand: `maxPageImageBytes 921600`, `maxTotalBytes 20971520`, `pageBudgets {"/גלריה/": 3145728}`
   (the gate sums full files, and 7 `half` + 7 `large` at their caps is 2,652,160, over port's
   2.5 MB default).
2. Dates to the install day for every route that gained a figure: the 5 guides' `dateModified`
   (`content/guides/<slug>.ts`), the 11 posts' `updated` (`lib/posts.ts`), `services` ×7 and
   `locations` ×14 in `lib/site-config.ts`, and the `staticPages` rows `""`, `שירותים`,
   `איזורי-שירות`, `מחירון`, `blog`, `מדריכים`, `אודות`, `צור-קשר`, `גלריה`, `הצהרת-נגישות` — never
   backdated.
3. `app/הצהרת-נגישות/page.tsx`: the bullet «טקסט חלופי בעברית לכל תמונה, נבדק אוטומטית בבנייה.».
4. `lib/llms.ts`: the renderings note, gated on `hasApprovedRenderings()`.
5. `docs/business-facts.md` §F: the install record (batches, board id, renders, frames per character,
   spend, heaviest page, `out/images` KB, phone copies); ADR 0006 Implementation; backlog N37 Closed.
6. `CLAUDE.md` §15 numbers and the §9 baseline; `qa-build-gate` and `performance-guidelines` measured
   numbers; every _filled at install_ in this repo's docs and skills.
7. `npm run format`, then `npm run gate` (lint · typecheck · format:check · build, whose postbuild runs
   the live gate and then the images gate · audit — the one known failure only).

Expected at D: 46/46 with images, 78 approved (+ the held list), every approved entry with a phone
copy; `imagesBytes` ≈ 10–11 MB ≤ 20 MB; `outBytes` without images < 15,000,000; `imgCount` ≈ 168;
`content-depth` floors identical to B; `claims-grep 0` with the manifest scanned; one
`fetchpriority="high"` on `out/services/שערים-נגררים/index.html`; 2 `/images/` imgs on
`out/locations/תל-אביב/index.html`; 0 `/images/` in ld+json or `og:image`; 0 `ImageObject`;
`data-images-notice="footer"` on every built page. Measured: _filled at install_.

### What `git status` must show

Commit only when asked. With `core.quotePath` off the paths read as Hebrew. Commit order:

| Commit     | `git status --short` shows only                                                                                                                                                                                                                                                                                                                                                                                                                             | Proof                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| A — policy | `CLAUDE.md`, `docs/**`, `.claude/**`                                                                                                                                                                                                                                                                                                                                                                                                                        | retired-wording grep empty; `audit:env` 0 failures; lint, typecheck, format green  |
| B — kit    | `scripts/images/**`, `lib/images.ts`, `components/images/**`, the page wiring, `app/גלריה/`, `content/images/{manifest,notice}.json`, `assets/images/README.md`, `lib/guide-types.ts` and the guides' `figure` blocks, the retired `JobPhotos.tsx` and Hero branch, `scripts/audit/{perf,images,content-depth}.mjs` + `claims.json`, `.env.example`, `.gitignore`, `.prettierignore`, `public/_headers`, `package.json`, `live.config.mjs`, `qa-build-gate` | `npm run gate` the one known failure, 46 routes, 0 images; **no `public/images/`** |
| C — plan   | `content/images/plan.json`                                                                                                                                                                                                                                                                                                                                                                                                                                  | `plan lint` clean; synth proof run and cleaned                                     |
| B2 — copy  | the three softened sentences in `lib/content.ts`                                                                                                                                                                                                                                                                                                                                                                                                            | the owner's exact-Hebrew yes in the digest message                                 |
| D — images | `public/images/**` (full, `-thumb`, `-w720`), `content/images/manifest.json`, the dates, the statement page, `lib/llms.ts`, the docs                                                                                                                                                                                                                                                                                                                        | `npm run gate` the one known failure, `images:status` 0 missing                    |

`content/images/plan.json` is already in the tree, untracked, between C's generation and its commit.
Stage commits by explicit path, never with `git add -A`.

**Never in any commit:** `public/images/_candidates/`, `assets/images/*` except its README, anything
from `Media Studio\refs\`, a `refs/dangates/drive/` listing.

```bash
git status --short | grep -E '_candidates|assets/images/' | grep -v 'assets/images/README.md'    # expect nothing
```

**B, C, B2 and D go live in the same deploy.** B alone would publish an empty «גלריה» in the header
nav and a footer link to it.

## 7. Deploy — ask first

Skill `deploy-dangates`: `-DryRun`, show the delta and the drift check, wait for the owner's word,
then `-Confirm` with `# APPROVED: <reason>` on the same command (the form `guard-destructive-ops.ps1`
accepts):

```powershell
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain dangates.co.il -DryRun
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain dangates.co.il -Confirm   # APPROVED: <the owner's words>
```

Then the post-deploy image checks (added to `deploy-dangates`): every sitemap URL (48) carries ≥ 2
`<img src="/images/…">` with `width`, `height` and a non-empty `alt`, exactly one
`fetchpriority="high"` among them and the footer note once; `og:image` unchanged (the catalog card);
`curl -sSI https://dangates.co.il/images/services/<file>.webp` → `200`, `image/webp`,
`max-age=2592000`; PageSpeed mobile on `/`, `/services/שערים-נגררים/` and `/locations/תל-אביב/` (LCP
≤ 2.5 s — hambabait landed 2.7–2.8; fallback: the strip below `TrustBar`; CLS 0); the Rich Results
Test shows no image in schema; the legacy-URL `301` probe of `deploy-dangates`. Then set `mirrorPath`
and `node page-images/cli.mjs mirror --site dangates`, and a memory note. After four weeks compare
call, WhatsApp and lead-form rates and image impressions in Search Console (owner-actions 2.x for
the GSC record).

Rollback: redeploy `out.prev/` through the hub script, or revert D + B2 + C + B together; never delete
an image file.

## Cost table

| Item                                                                                                               | Unit (USD)              | Expected                           |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------- | ---------------------------------- |
| `gemini-3-pro-image` frame with a character, 2K                                                                    | 0.134                   | 19 slots ≈ 2.5 first attempt       |
| `gemini-nano-banana-2.1` people-free frame, 2K                                                                     | 0.0504                  | 59 slots ≈ 3.0 first attempt       |
| Trap set (38, nano) and calibration judging                                                                        | —                       | ≈ 3–4                              |
| Retries (≈ 2.2 attempts per prompt), two judges (≈ 0.029 per attempt), scene writer (≈ 0.013), alt writer (≈ 0.01) | per provider list price | ≈ 20–25 (the rest of the estimate) |
| **Total**                                                                                                          |                         | **≈ 30 (26–36), hard cap 60**      |

The first attempt for the whole batch is 19 × 0.134 + 59 × 0.0504 ≈ US$5.5. Actual spend: _filled at
install_. `status` prints the running total from the ledger; when `generate` refuses past the cap,
stop and report — the cap is the owner's number.

## Retire, replace — and why there is no revocation clause

- A published `public/images/*` file is **never deleted or renamed casually**. Replacement = new slug +
  `retired: "YYYY-MM-DD"` on the old entry; file kept ≥ 60 days; then removed in one commit with its
  entry. When a departing post is 301'd (`docs/content-calendar.md` §4), its reuse placements leave in
  the same commit — `lib/images.ts` throws on a placement whose route is gone.
- `/images/*` is cached for 30 days (`max-age=2592000`), so a withdrawn file can linger in browser caches
  that long. A file is never edited in place: new pixels = new slug.
- Rollback never deletes an image: redeploy `out.prev/` through the hub script, or `git revert` the
  manifest commit.
- **No consent can be revoked, because nobody real appears.** The two characters are AI-made; the
  `revoked` manifest field and the 14-day rule exist for sites with real people and are inert here.
  The one event that changes this is the owner saying the characters are real: stop before the next
  render, `policy.personaKind: "real-consent-open"`, `CONSENT.md`, a changed note under a new approval
  (runbook §2).
- Real phone photos supplied by the owner (owner-actions 4.5) enter as `owner-supplied` through
  `node page-images/cli.mjs import --site dangates --dry-run` → `import` (with `--retire` only when the
  owner's decision to re-issue those images is in `docs/business-facts.md` §F) and replace renderings
  one for one; the first approved one changes the note, with the owner's word.

## Troubleshooting

| Symptom                                                           | Do                                                                                                                                                                                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next dev` or `build` dies at `lib/images.ts`                     | A staged text the site rules refuse. Fix it on the board. If the toolkit accepted it, the stems drifted: `doctor` names the difference; fix `site.json`                                                                   |
| `images:check` fails on alt or caption stems                      | Fix the text on the board (or ask the art director); never in the manifest by hand, except `image-art-director`'s alt and caption edits on `candidate` entries, and never by weakening the stems                          |
| `images:check`: unreferenced file                                 | A file in `public/images/` with no manifest placement. Fix the manifest through the toolkit; never delete a live file                                                                                                     |
| `images:check`: two `fetchpriority="high"`                        | A component passed `priority` twice; `leadSlotOf` decides — the first content image in DOM order is the only one                                                                                                          |
| `images:check`: a thumbnail does not render                       | All 5 must render on `/מדריכים/` and all 3 on `/blog/`; the card code dropped one                                                                                                                                         |
| `images:check`: a post placement does not render                  | `renderBlocks` found no `p` (for `main`) or `h` (for `mid`) block; check the post's block list in `lib/posts.ts`, never extend `PostBlock`                                                                                |
| `images:check`: `/images/` inside JSON-LD or `og:image`           | Renderings never go there — remove the reference, not the check                                                                                                                                                           |
| `images:check`: a disclosure marker is wrong, or «חלק מ» is found | The built text differs from `content/images/notice.json`, or the wording regressed. Change the component or the note (with a new approval), not the check                                                                 |
| `images:check`: the about marker on a page without a team figure  | The marker renders only under a team figure with people; while `home-team` is held it must not render                                                                                                                     |
| `content-depth`: a shared paragraph on the service pages          | The gallery line must stay under 12 tokens and unique per page («איך זה נראה — בגלריה: {service.name}»); figures are stripped before counting                                                                             |
| `perf`: `outBytes` over 15,000,000                                | `outBytes` is measured without `out/images/` (N37); if it still fails the HTML grew, not the images. `imagesBytes` is bounded by the manifest's 20 MB                                                                     |
| `format:check` fails on `content/images/manifest.json`            | It must be in `.prettierignore` (toolkit-written)                                                                                                                                                                         |
| `out/.images-draft` exists                                        | The last build ran with `IMAGES_DRAFT=1`; `Remove-Item env:IMAGES_DRAFT`, then rebuild                                                                                                                                    |
| `format:check` fails on a Hebrew-named file                       | `git config core.quotePath false`, `npm run format`                                                                                                                                                                       |
| `plan lint`: a route key is not ASCII                             | Add the slug to the list's `keyMap` in `site.json`; `keyProblems` names the unmapped slug                                                                                                                                 |
| `plan lint`: a person on a city route                             | Owner decision: city pages are people-free. Rewrite the slot                                                                                                                                                              |
| `plan lint`: two city slots share a tuple                         | 14 distinct (stem, people, time) with `people` always `none` — change the stem or the time (morning / midday / overcast only)                                                                                             |
| `brief`: a people-free scene mentions a person                    | Remove "no people", "hand", "crew" from the subject; the PEOPLE:none block already says nobody is there                                                                                                                   |
| `wrong-gate-type` keeps firing                                    | The model's default door is American timber. Tighten the ISRAEL block and the subject (galvanised bars on a ground track, plaster or stone columns), then re-brief as a new batch                                         |
| `unsafe-mechanism` false-fires at a hinge pin or a boom holder    | The NOT clause must name the correct hand positions (a grease gun at the pin from the post side, a wrench at the holder's bolts with the boom on its rest); reword in `judge.json`, `rejudge`, proceed under a 25 % split |
| `unsafe-edge` false-fires on step two of a ladder                 | Step one or two of a fully opened ladder on a level floor is correct; reword the NOT clause, `rejudge`                                                                                                                    |
| A keypad, a panel, a boom or a casing shows characters            | `legible-reading` / `text` / `branding`: regenerate; NO TEXT names every blank. Keep the keypad small or oblique with a dark window                                                                                       |
| A chest carries a mark                                            | `branding`: there is no emblem on this site. Regenerate; check the PEOPLE block says "no print, badge, patch or lettering"                                                                                                |
| A vehicle appears                                                 | `vehicle` is binary: regenerate; the subject ends with the drive, lane and bays empty                                                                                                                                     |
| Judge disagreement                                                | Under `strict` one HARD code regenerates; if the split is above 40 % on a code the wording is the problem — reword and `rejudge`, never `qa --force`                                                                      |
| `needs-owner`                                                     | The best attempt is kept; list it for the board (`stage --needs-owner`)                                                                                                                                                   |
| Gemini refuses a face prompt repeatedly                           | The framing fallback already ran; accept the people-free twin for that slot (`home-team` has none — it is held and `/` and `/אודות/` keep their second image from the strip and `story`)                                  |
| Two-man frames keep failing face match                            | Pilot rule: `both` becomes one character on `home-team` and `gallery-generated-4`                                                                                                                                         |
| `drive-pull` pulls a PSD or a Google Doc                          | The site's `drive.portraits` id must be the child folder «תמונות עובדים», not its parent; drive-pull refuses the Doc and would pull the portraits twice                                                                   |
| `doctor`: `TRADE:<slug>` block missing                            | `style.md` needs one TRADE block per Hebrew service slug plus `generic`; a `<fill` placeholder left in any block is red                                                                                                   |

## What is site-specific for the next site

`Media Studio\sites\<slug>\site.json` carries the owner's policy (faces, `personaKind`, names and
where, disclosure mode and texts, excluded routes, city image mode, `peopleRoutes`, `namedSlots`), the
people (real with consent lines, or synthetic with `bannedNames` and a `PERSONAS.md` record), the brand
and logo file, the trade wording, the `lists` with `keyMap`s for Hebrew slugs, the `kit` block, the
claim stems (mirroring the site's own `claims.json` and live-kit stems) and the models and cap;
`style.md` the prompt blocks; `judge.json` the site's QA code tables. On the site side: `port --site
<slug>` renders the kit (phone copies included since WS-T), and the printed checklist covers the hand
wiring — here the `PageHeader` crumbs with `href`, the `og:url` fix, the posts' renderer injection, the
guides' `figure` block, the unique gallery line, `perf.mjs` outBytes-minus-images for a site with an
`out/` cap, the `content-depth` figure strip and the `images` audit scope. Then `plan-generator.mjs`
from `sites/_template/`, `rejudge.mjs` copied from `sites/netomazganim/` (the slug is hard-coded),
then this pipeline. The onboarding steps are `Media Studio\runbooks\page-images-for-a-site.md`.
