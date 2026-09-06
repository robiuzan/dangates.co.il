# Redirect map — dangates.co.il rebuild

301 redirects, applied via `public/_redirects` (old live WordPress URL → new Next.js URL) — Cloudflare
Pages reads that file at the edge and issues the real 301s; `scripts/gen-redirects.mjs` generates it
from the map below. All old→new pairs below. Hebrew paths are shown decoded; the generator emits them
URL-encoded (percent-encoded UTF-8). Trailing slashes match the site's `trailingSlash: true` output —
and because Cloudflare Pages matches a source path literally, the generator emits **each mapped path
twice**, in its slashed and bare form, so an inbound link in either shape 301s instead of reaching the 404. That is why `_redirects` carries 72 rules for the 37 pairs listed here.

## 1. Locations — normalize all 18 cities to `/locations/<he-slug>/`

The live site scattered most cities at the site root; the rebuild serves them all under `/locations/`.

| Old (live root)      | New                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `/תל-אביב/`          | `/locations/תל-אביב/`                                                                           |
| `/ירושלים/`          | `/locations/ירושלים/`                                                                           |
| `/חיפה/`             | `/locations/חיפה/`                                                                              |
| `/ראשון-לציון/`      | `/locations/ראשון-לציון/`                                                                       |
| `/פתח-תקווה/`        | `/locations/פתח-תקווה/`                                                                         |
| `/נתניה/`            | `/locations/נתניה/`                                                                             |
| `/חולון/`            | `/locations/חולון/`                                                                             |
| `/כפר-סבא/`          | `/locations/כפר-סבא/`                                                                           |
| `/מודיעין/`          | `/locations/מודיעין/`                                                                           |
| `/רחובות/`           | `/locations/רחובות/`                                                                            |
| `/יבנה/`             | `/locations/יבנה/`                                                                              |
| `/אשדוד/`            | `/locations/אשדוד/`                                                                             |
| `/באר-שבע/`          | `/locations/באר-שבע/`                                                                           |
| `/קריות/`            | `/locations/קריות/`                                                                             |
| `/צפון/`             | `/locations/צפון/`                                                                              |
| `/דרום/`             | `/locations/דרום/`                                                                              |
| `/שרון/`             | `/locations/שרון/`                                                                              |
| `/locations/אשקלון/` | `/locations/אשקלון/` (unchanged — the one city already under `/locations/`; no redirect needed) |

## 2. Blog — old long slugs → clean `/blog/<slug>/`

| Old (live)                                               | New                                                                                                                           |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `/שערים-חשמליים-השקעה-שמחזירה-את-עצמה-ומה-כדאי-לדעת/`    | `/blog/שערים-חשמליים-השקעה/`                                                                                                  |
| `/תקלות-נפוצות-בשערים-חשמליים-ואיך-לפתור-אותן-בעצמכם/`   | `/blog/תקלות-נפוצות-בשערים-חשמליים/`                                                                                          |
| `/האם-כדאי-להשקיע-בשדרוג-לשער-חשמלי-חכם-התשובות-כאן/`    | `/blog/שדרוג-לשער-חשמלי-חכם/`                                                                                                 |
| `/כך-תשפרו-את-בטיחות-השער-החשמלי-שלכם-ב-3-שלבים-פשוטים/` | `/blog/בטיחות-שער-חשמלי-3-שלבים/`                                                                                             |
| `/האם-שער-חשמלי-באמת-חוסך-זמן-המיתוס-נבדק/`              | `/blog/שער-חשמלי-חוסך-זמן/`                                                                                                   |
| `/תחזוקה-מונעת-לשערים-חשמליים-המדריך-המהיר/`             | `/blog/תחזוקה-מונעת-לשערים-חשמליים/`                                                                                          |
| `/7-יתרונות-של-שער-חשמלי-אוטומטי-לעסק-שלכם/`             | `/blog/יתרונות-שער-חשמלי-לעסק/`                                                                                               |
| `/תחזוקת-שערים-חשמליים-כמה-זה-באמת-חשוב/`                | `/blog/חשיבות-תחזוקת-שערים-חשמליים/`                                                                                          |
| `/איך-לזהות-אם-השער-החשמלי-שלכם-זקוק-להחלפה-או-תיקון/`   | `/blog/החלפה-או-תיקון-שער-חשמלי/`                                                                                             |
| `/מה-עושים-כשמערכת-השער-החשמלי-לא-מגיבה-פתרונות-פשוטים/` | `/blog/שער-חשמלי-לא-מגיב/`                                                                                                    |
| `/הסוד-לשער-חשמלי-שעובד-כמו-חדש-מה-עליכם-לדעת/`          | `/blog/שער-חשמלי-שעובד-כמו-חדש/`                                                                                              |
| `/שערים-חשמליים-ועיצוב-איך-לשלב-אסתטיקה-ובטיחות/`        | `/blog/` (source page was broken on the live site — served the homepage — so it was NOT migrated; redirect to the blog index) |
| `/blog/`                                                 | `/blog/` (unchanged)                                                                                                          |

## 3. Pages

| Old (live)                         | New                     |
| ---------------------------------- | ----------------------- |
| `/contact` , `/contact/`           | `/צור-קשר/`             |
| `/services/` (live services index) | `/שירותים/`             |
| `/accessibility-statement/`        | `/הצהרת-נגישות/`        |
| `/privacy/`                        | `/מדיניות-פרטיות/`      |
| `/מפת-אתר/` (HTML sitemap page)    | `/` (or `/sitemap.xml`) |
| `/table-of-content/`               | `/`                     |
| `/en/` (abandoned English version) | `/`                     |

## 4. Drop the Houston leftover (allgatesrepair automation)

| Old (live)                                                                         | New                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/pages_automation/*` (e.g. `/pages_automation/הנחות-סתיו-בלעדיות-לתושבי-יוסטון/`) | **no rule — let it 404.** Irrelevant "Houston" automation content from the un-rebranded theme; it is not a page of this business, so it is dropped rather than redirected (ADR 0004). The generator's map omits it deliberately |

## Notes

- Services already lived under `/services/<he-slug>/` on the live site (same scheme as the rebuild),
  so no service redirects are needed — the 6 live service slugs map 1:1. The rebuild adds a 7th
  service, `/services/שערים-לדירה/` (no old URL to redirect).
- The static `/sitemap.xml`, `/robots.txt` are regenerated by Next; the old Rank Math
  `*-sitemap.xml` files can be left to 404 or redirected to `/sitemap.xml`.
