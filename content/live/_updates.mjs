/**
 * dangates.co.il — the homepage updates strip (fleet live-kit; CLAUDE.md §14). The newest three
 * show after the trust bar; /assets/live.js hides the strip once the newest item is 45 days old,
 * so a quiet month shows nothing rather than old news. A new item is a real content change.
 *
 * Each item: { date: "YYYY-MM-DD" (the day it went live, never in the future), text (≤ 140,
 * no typed phone number, no price, no promise), href (a page of this site), linkLabel (≤ 18),
 * source (the fact it rests on) }. One item per date. scripts/live/check-live-register.mjs
 * enforces it. Never a customer, street, review, count, price or response time.
 *
 * ✅ APPROVED by the owner on 2026-10-12, on the fleet wording sign-off page — approved fingerprint
 *   4d0513a5efd6 (sha256 of _campaigns.mjs + _updates.mjs as approved). A wording change needs a
 *   new approval; the build refuses a register without its `approved` stamp.
 * The fact below is real and dated: the per-service lists were
 *   written 2026-09-06 and reached the live site with the 2026-10-12 deploy. The other change that
 *   deploy carried for visitors (the lead form's error message, fee7f69) went live the same day —
 *   one item per date, so it is not listed.
 */
export default {
  approved:
    "2026-10-12 — Robi (owner), fleet wording sign-off page, fingerprint 4d0513a5efd6",
  heading: "מה השתנה באתר",
  items: [
    {
      date: "2026-10-12",
      text: "מה מעיד על תקלה בשער נגרר, ומה בשער כנף או בתריס גלילה? הסימנים של כל אחד מפורטים עכשיו בעמוד השירות שלו.",
      href: "/שירותים/",
      linkLabel: "לעמודי השירות",
      source:
        "lib/content.ts serviceTriggers — one list per service page (commit cfff52f, 2026-09-06), live since the 2026-10-12 deploy (Israel services sites/logs/deploys.csv: 2026-10-12T01:28:55Z, 134 files)",
    },
  ],
};
