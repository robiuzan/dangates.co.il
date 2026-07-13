// Generate static redirect stubs for dangates.co.il's URL normalization.
//
// The rebuild moved/renamed many live WordPress URLs (see REDIRECTS.md). On static
// GitHub Pages there is no server to issue 301s, so for every old->new pair we emit
// a tiny HTML stub at  public/<old-path>/index.html  that:
//   - <meta http-equiv="refresh"> redirects immediately,
//   - <link rel="canonical"> points crawlers at the new URL,
//   - <meta robots noindex> keeps the stub itself out of the index,
//   - location.replace() bounces the browser without leaving a history entry.
//
// Next copies public/ verbatim into out/, so these ship as-is. None of the old
// paths collide with a real new route (cities live under /locations/, posts under
// /blog/, pages under their Hebrew slugs), so the stubs are safe to place in public/.
//
// Run:  node scripts/gen-redirects.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

// old live path  ->  new Next.js path
const REDIRECTS = {
  // 1. Locations — root-level cities normalized under /locations/<he-slug>/
  "/תל-אביב/": "/locations/תל-אביב/",
  "/ירושלים/": "/locations/ירושלים/",
  "/חיפה/": "/locations/חיפה/",
  "/ראשון-לציון/": "/locations/ראשון-לציון/",
  "/פתח-תקווה/": "/locations/פתח-תקווה/",
  "/נתניה/": "/locations/נתניה/",
  "/חולון/": "/locations/חולון/",
  "/כפר-סבא/": "/locations/כפר-סבא/",
  "/מודיעין/": "/locations/מודיעין/",
  "/רחובות/": "/locations/רחובות/",
  "/יבנה/": "/locations/יבנה/",
  "/אשדוד/": "/locations/אשדוד/",
  "/באר-שבע/": "/locations/באר-שבע/",
  "/קריות/": "/locations/קריות/",
  "/צפון/": "/locations/צפון/",
  "/דרום/": "/locations/דרום/",
  "/שרון/": "/locations/שרון/",

  // 2. Blog — old long slugs -> clean /blog/<slug>/
  "/שערים-חשמליים-השקעה-שמחזירה-את-עצמה-ומה-כדאי-לדעת/": "/blog/שערים-חשמליים-השקעה/",
  "/תקלות-נפוצות-בשערים-חשמליים-ואיך-לפתור-אותן-בעצמכם/": "/blog/תקלות-נפוצות-בשערים-חשמליים/",
  "/האם-כדאי-להשקיע-בשדרוג-לשער-חשמלי-חכם-התשובות-כאן/": "/blog/שדרוג-לשער-חשמלי-חכם/",
  "/כך-תשפרו-את-בטיחות-השער-החשמלי-שלכם-ב-3-שלבים-פשוטים/": "/blog/בטיחות-שער-חשמלי-3-שלבים/",
  "/האם-שער-חשמלי-באמת-חוסך-זמן-המיתוס-נבדק/": "/blog/שער-חשמלי-חוסך-זמן/",
  "/תחזוקה-מונעת-לשערים-חשמליים-המדריך-המהיר/": "/blog/תחזוקה-מונעת-לשערים-חשמליים/",
  "/7-יתרונות-של-שער-חשמלי-אוטומטי-לעסק-שלכם/": "/blog/יתרונות-שער-חשמלי-לעסק/",
  "/תחזוקת-שערים-חשמליים-כמה-זה-באמת-חשוב/": "/blog/חשיבות-תחזוקת-שערים-חשמליים/",
  "/איך-לזהות-אם-השער-החשמלי-שלכם-זקוק-להחלפה-או-תיקון/": "/blog/החלפה-או-תיקון-שער-חשמלי/",
  "/מה-עושים-כשמערכת-השער-החשמלי-לא-מגיבה-פתרונות-פשוטים/": "/blog/שער-חשמלי-לא-מגיב/",
  "/הסוד-לשער-חשמלי-שעובד-כמו-חדש-מה-עליכם-לדעת/": "/blog/שער-חשמלי-שעובד-כמו-חדש/",
  // Broken on the live site (served the homepage) — was NOT migrated; send to the blog index.
  "/שערים-חשמליים-ועיצוב-איך-לשלב-אסתטיקה-ובטיחות/": "/blog/",

  // 3. Pages
  "/contact/": "/צור-קשר/",
  "/services/": "/שירותים/",
  "/accessibility-statement/": "/הצהרת-נגישות/",
  "/privacy/": "/מדיניות-פרטיות/",
  "/מפת-אתר/": "/",
  "/table-of-content/": "/",
  "/en/": "/",

  // 4. Houston leftover from the un-rebranded theme — drop to the homepage.
  "/pages_automation/הנחות-סתיו-בלעדיות-לתושבי-יוסטון/": "/",
};

function stub(newPath) {
  const enc = encodeURI(newPath);
  const json = JSON.stringify(newPath);
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${enc}">
<link rel="canonical" href="https://dangates.co.il${enc}">
<title>מעבר…</title></head>
<body><p>העמוד עבר. <a href="${enc}">המשך לעמוד החדש</a>.</p>
<script>location.replace(${json})</script></body></html>
`;
}

let count = 0;
for (const [oldPath, newPath] of Object.entries(REDIRECTS)) {
  const inner = oldPath.replace(/^\/+/, "").replace(/\/+$/, "");
  const dir = join(PUBLIC, inner);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), stub(newPath), "utf8");
  count++;
  console.log(`  ${oldPath}  ->  ${newPath}`);
}
console.log(`\nGenerated ${count} redirect stubs under public/`);
