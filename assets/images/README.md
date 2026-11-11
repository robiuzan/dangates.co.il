# assets/images — masters and review copies (not shipped)

Local, per-machine copies of the material behind `public/images/`. **Only this README is in git**:
`/assets/images/*` is gitignored (the masters show people in scenes that never happened), and
nothing in this folder is deployed. What ships is `public/images/<group>/<file>.webp`, written by
the Media Studio page-images toolkit's `install` step and described entry by entry in
`content/images/manifest.json`.

- `masters/` holds full-size renders and their `.json` sidecars for every image that reached
  `public/images/`. The durable copy is `Media Studio/masters/dangates/<slot-id>/`.
- `review/` holds copies of the board decisions, QA notes and rejected candidates. The durable
  copies are `Media Studio/review/dangates/decisions.json` and
  `Media Studio/finished/dangates/rejected/`.
- **Fresh clone / another machine:** this folder holds only this file. Nothing in the build reads
  this folder, so an empty one is fine.
- **Never put a file here to "get it on the site".** The only way pixels reach `public/images/` is
  the toolkit's `stage → review → install` path. A file dropped straight into `public/images/` with
  no manifest entry fails `npm run images:check`.
- **Reference portraits and the emblem reference never come here.** They live in
  `Media Studio/refs/dangates/` (gitignored, never published and never put in a repo, sent only to
  the AI vendors named in the consent text) with the consent record `CONSENT.md` beside them.

## What the images are

Every picture the toolkit installs is an AI-made illustration of electric gate repair work, in the look
of a phone snapshot taken on site. The site says so once, in plain Hebrew: the footer line on every
page, the line under the team figure on the about page, and the intro of `/גלריה/` (texts
in `content/images/notice.json`). No image is evidence of a specific
job, address, customer, date or measurement, and no alt text or caption may claim one. The people shown are synthetic characters, never named and never presented as staff.

## The never-delete rule

A file under `public/images/` that has been deployed is **never deleted or renamed casually**.
Crawled HTML, Google Images and shared links keep the URL. To replace an image: generate the
replacement, install it at a **new slug**, set `retired: "YYYY-MM-DD"` on the old manifest entry,
keep the old file for at least 60 days, and only then remove it — in one commit that also drops the
manifest entry. A rollback never deletes an image either: redeploy `out.prev/` or revert the
manifest commit.

## Revoked consent is the one exception

A person's likeness leaves the site within 14 days of written notice. Set `retired` and
`revoked: "YYYY-MM-DD"` (the day the notice arrived) on every entry that shows that person, delete
the files from `public/images/` in that same commit, rebuild and deploy. The 60-day rule does not
apply, and `npm run images:check` fails while a revoked file still exists in `public/` or `out/`.
A people-free replacement goes in at a new slug. The entry stays in the manifest as the record that
the file left, and its `/images/*` cache can keep a copy in a browser for up to 30 days. Never roll
back to an `out.prev/` older than the notice: it still holds the file, so rebuild instead.
