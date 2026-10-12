/**
 * The fleet live-kit's settings for dangates.co.il — the announcement bar, the seasonal card and
 * the homepage updates strip (3locksmiths.co.il/fleet/live-kit; CLAUDE.md §14). Read by
 * components/live/Live.tsx and by every scripts/live/ gate. The registers themselves are
 * content/live/_campaigns.mjs and content/live/_updates.mjs.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The repo root (this file's own folder). Next 14's webpack bundles this file through Live.tsx,
 * and reads `new URL(".", import.meta.url)` as an asset import — "Module not found: Can't resolve
 * '.'" (2026-10-12) — so the folder comes from dirname(), as on hambabait.
 */
const ROOT = dirname(fileURLToPath(import.meta.url));

/** One rule from several families of wording. String.raw: each backslash is typed once. */
const any = (...families) => new RegExp(families.join("|"));
const r = String.raw;

/** What the business does, as a noun — the subject of a speed promise ("שירות מהיר"). */
const NOUN =
  "שירות|שירותים|שירותי|טיפול|טיפולים|תיקון|תיקונים|תיקוני|מענה|הגעה|אבחון|תגובה|יציאה|ביקור|פתרון|פתרונות|החלפה|התקנה|תיאום|טכנאי|הצעה|מוקד";
/** What the business does, as a verb — the subject of a speed promise ("מגיעים מהר"). */
const VERB =
  "נגיע|מגיעים|מגיע|יגיע|נתקן|מתקנים|נטפל|מטפלים|נחזור|חוזרים|יחזור|יחזרו|תחזור|עונים|נענה|יענה|מגיבים|נגיב|מאבחנים|נאבחן|יוצאים|נצא|יוצא|מחליפים|נחליף|מתאמים|נתאם|באים|נבוא|מסיימים|נסיים|פותרים|נפתור|נשלח|שולחים|ישוב|תשוב|יעבוד|יפעל";
/** City and region names — naming one says "we serve it" (business-facts §E: unconfirmed). */
const PLACE =
  "תל\\s*אביב|ירושלים|חיפה|ראשון\\s+לציון|ראשל[״\"']צ|פתח\\s+תקו?וה|פ[״\"']ת|נתניה|חולון|כפר\\s+סבא|מודיעין|רחובות|יבנה|אשדוד|באר\\s+שבע|ב[״\"']ש|אשקלון|קריות|קרי?ית|רמת\\s+גן|בני\\s+ברק|בת\\s+ים|הרצליה|רעננה|הוד\\s+השרון|רמת\\s+השרון|גבעתיים|ראש\\s+העין|נס\\s+ציונה|לוד|רמלה|יהוד|אור\\s+יהודה|חדרה|קיסריה|זכרון|נהריה|עכו|טבריה|עפולה|נצרת|כרמיאל|אילת|בית\\s+שמש|אלעד|גוש\\s+דן|השרון|שרון|השפלה|שפלה|הצפון|צפון|הדרום|דרום|הנגב|נגב|הגליל|גליל|הגולן|גולן|המרכז|הקריות";

export default {
  site: "dangates.co.il",
  url: "https://dangates.co.il",
  dir: "content/live",
  siteConfig: "site.config.json",

  /**
   * Calm pages: no seasonal line, no card (a safety or wartime line still shows). Exact paths, or
   * prefixes ending in "*". The two legal pages. There is no thank-you route (backlog §8.3, the
   * success state is inline in LeadForm), no noindex page but the 404 (it marks itself —
   * app/not-found.tsx), no emergency page, and no page tells the reader to call 100/101/102
   * (checked 2026-10-12: `grep -rn "10[012]" app components lib` finds none).
   */
  calm: ["/מדיניות-פרטיות/", "/הצהרת-נגישות/"],
  /** No card here, but the bar is normal: the lead-form page — the card would compete with it. */
  noDialog: ["/צור-קשר/"],

  /** The homepage strip sits in the site's own container width (components/ui/Container.tsx). */
  updatesContainerClass: "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",

  /**
   * This site's own ⛔ stems, on top of the fleet's (years, arrival times, ratings, counts,
   * discounts, scarcity, prices, warranty). Each family covers 🔶/⛔ rows of
   * docs/business-facts.md — §B tenure, legal entity, owner, staff; §C licence, insurance,
   * training and brands, association; §D prices, the visit fee and its waiver, warranty and
   * durability, what a price includes, payment; §E 24/7 and emergency, response time, national
   * coverage and the named regions, travel fee; §A reviews and rank — or what kit README step 2
   * keeps out of a line even when true (the confirmed opening hours, Sun–Thu 08–18, Fri 08–15:
   * the bar runs at every hour). They apply to the registers' visible copy only; the fleet
   * calendar's labels answer to the fleet rules alone.
   *
   * STEMS, not phrases. Mutation-tested 2026-10-12, before handing the draft to the owner:
   *   - 111 near-miss rewordings of every row above (tenure in digits, words and decades; legal
   *     entity; owner; staff and expertise; licence, insurance, training, brands, standards;
   *     prices, the visit fee, its waiver, payment; warranty and durability; 24/7, emergency and
   *     the hours; speed and same day; coverage, regions, travel fee; reviews, rank, counts):
   *     33 caught by the fleet rules alone, all 111 with these stems.
   *   - two held-out rounds, each written after the stems were frozen and scored once before the
   *     widening it drove: 30 of 40, then 16 of 25 (misses such as "אבחון השער — עלינו",
   *     "שנתיים שקט על כל החלפת מנוע", "מאז שנות השמונים", "שירות אקספרס", "השם הכי מוכר",
   *     "כל החלפה מגובה בכתב", "קרוב לאלף התקנות"); all 65 after. Expect stems to catch about two
   *     thirds of a fresh paraphrase — the owner's approval is the real gate.
   *   - zero hits on the registers' 24 visible strings and on 433 of the site's own claim-free
   *     sentences from the production export, 138 of them chosen because they carry a trap:
   *     "שמזמינים" / "הזמינו" / "להזמנת" (to order), "זמינים במגוון עיצובים" (offered in), "גישה
   *     לא מורשית", "ולמשקל השער", "בשל משקל השער" and "אשקלון" (שקל), "לתקן" (to repair, not a
   *     standard), "לוחיות רישוי", "נותק" (ותק), "הגורם הנפוץ ביותר", "מכל מקום", "לכל שער
   *     חשמלי יש", "עסקים מכל הסוגים", "בשנים האחרונות", "חיסכון לטווח ארוך", "תיקון לא
   *     מקצועי", "השער נופל מהר מדי", "מגיעים עם טכנולוגיות", "המלצה חמה", "מומלץ להזמין
   *     טכנאי", "שמרו על סביבה נקייה", "בשלב מוקדם", "תמונות בעלות משמעות". (The fleet rules
   *     still hit "גישה לא מורשית" and "בעלות" — they over-match on purpose; lines only.)
   *   - the 2026-10-12 review's own held-out rounds, written without the corpus above, each scored
   *     once: 115 of 163 (70.6%), 35 of 50 (70%) and 23 of 30 on the stems as handed over; 25 of 30
   *     (83%) on the widened ones. Expect roughly 70–80% of a fresh paraphrase. Most misses were
   *     paraphrase, but some were systematic and are fixed in the lines marked "Review 2026-10-12":
   *     the doubled vav after a prefix (הוותק, הוותיקים), "במוצאי שבת" (the word edge blocked the
   *     ב), construct, plural and feminine forms (כל אזורי הארץ, כל הישובים, שמחזיקה שנים), and
   *     common phrasings of this site's own 🔶 rows ("סביב השעון", "שירות לילה", "פריסה
   *     לתשלומים", a bare-number visit fee, "עומדים מאחורי כל עבודה", "החברה הגדולה בתחום", "דן"
   *     as a person). The additions are kept narrow on purpose — a first, wider draft blocked gate
   *     tips such as "נקו את המסילה מקצה לקצה", "החורף מאחורינו?", "סערה בשעות הקרובות?" and
   *     "ודאו שהחלק החשמלי מכוסה", which now pass. After them: 0 new hits on the 1,004 unique
   *     sentences of the production export, and the 24 register strings and the 433 claim-free
   *     sentences above still pass. The bare "בלילה" / "בשבת" stems still block an innocent tip
   *     such as "תאורה בכניסה עוזרת לחיישנים בלילה" — fail-safe: reword the tip.
   *
   * Left alone on purpose, because the site's own claim-free sentences use them: a bare "מהר" /
   * "מהיר" (a gate that falls too fast, "פתיחה וסגירה מהירה"), "זמינים" without an availability
   * context, "מומלץ" (advice), "לקוח" (a client's requirements), "לאורך זמן" / "לאורך שנים" (how
   * long a maintained gate lasts), "בטווח הארוך", "להבטיח ש" / "יבטיח" (maintenance will
   * ensure), "קבוע" (regular cleaning), "תקן" alone, "מקור", "פתוח" alone (a gate left open),
   * "לכל" alone, "מקצועי" alone ("בדיקה מקצועית", "עין מקצועית").
   *
   * No \b (ASCII-only in JS); (?<![א-ת]) and (?![א-ת]) are the Hebrew word edges. Final letters:
   * a stem that can end a word lists both forms (זמי[נן], מוסמ[כך], מיומ[נן], מקצוע[נן]).
   * Written in an editor, never through a shell (a shell once ate the kit's backslashes).
   * Re-test after any edit: every near-miss must still fail, and every register string and every
   * claim-free sentence must still pass.
   */
  claims: [
    // §E — emergency framing. "לא דחוף" is reassurance, not urgency.
    {
      id: "emergency",
      re: any(
        r`חירום|(?<!לא\s)דחו(?:ף|פה|פים|פות)|בדחיפות|(?<![א-ת])[הוב]?בהול(?:ה|ים|ות)?(?![א-ת])|(?<!ת)כונ[נן]|תורנ(?:ות|ים|י)|(?<![א-ת])[הלבו]?מוקד(?![א-ת])|קו\s+חם|\bSOS\b`,
        r`(?:אנחנו|אנו|טכנאי|הטכנאי|צוות|הצוות)\s+(?:כבר\s+)?בדרך(?!\s+כלל)|בדרך\s+אלי(?:כם|ך)`,
      ),
    },
    // §E — 24/7 and availability. The confirmed hours too (kit README step 2): the bar runs at
    // every hour. "זמין" only in an availability context: "זמינים במגוון עיצובים" (offered in many
    // designs) and "מזמינים" / "להזמין" / "הזמינו" (to order) are on the site's own pages.
    {
      id: "hours",
      re: any(
        r`24\s*[/\\\-–×x]\s*7|24\s*שעות|עשרים\s+וארבע|מסביב\s+לשעון|(?:כל|בכל)\s+שעות\s+(?:ה)?(?:יממה|יום|לילה|ערב)|כל\s+היממה|יום\s+ולילה|לילה\s+ויום|365`,
        r`(?<![א-ת])[וה]?זמינות(?![א-ת])|(?:אנחנו|אנו|טכנאי|טכנאים|צוות|נציג|נציגים|הקו|השירות|תמיד|כאן|עדיין)\s+(?:\S+\s+)?[וש]?זמי[נן](?:ים|ה)?(?![א-ת])`,
        r`(?<![א-ת])[וש]?זמי[נן](?:ים|ה)?\s+(?:גם|תמיד|לכל|בכל|לכם|עבורכם|בשבילכם|לשירותכם|לקריאות|למקרי|לחירום|לשיחה|בטלפון|בוואטסאפ|עכשיו|היום|כל|כעת|ב-?\d|24|מ-?\d|עד|בשבת|בלילה|בערב|בחג|בסופ)`,
        r`(?<![א-ת])ו?(?:בשבת|בשבתות|בחג|בחגים|בלילה|בלילות|הלילה|בסופ[״"']?ש|בסופי\s+שבוע|בסוף\s+השבוע|מוצאי\s+שבת|במוצ[״"']ש|מוצ[״"']ש)(?![א-ת])|באמצע\s+(?:ה)?(?:לילה|שבת|חג)|בשעות\s+(?:ה)?(?:לילה|ערב|קטנות|הקטנות)`,
        r`(?:גם|אפילו)\s+ב(?:לילה|לילות|ערב|ערבים|שבת|חג|חגים|שישי|סופ)|(?:עובדים|פועלים|זמינים|פתוחים|עונים|מגיעים|נגיע)\s+(?:גם\s+)?כל\s+(?:יום|ערב|לילה|השבוע|השנה|ימות)`,
        r`\d{1,2}:\d{2}|שעות\s+(?:ה)?(?:פעילות|פתיחה|קבלה|עבודה|המשרד)|ראשון\s*(?:[–-]|עד)\s*(?:חמישי|שישי)|א[׳']\s*[–-]\s*[הו][׳']|בימי\s+(?:ראשון|שני|שלישי|רביעי|חמישי|שישי|חול)|(?<![א-ת])(?:ב|עד|וב|ו)שישי(?![א-ת])|עד\s+(?:ה)?שעה\s+\S+`,
        r`(?<![א-ת])פתוחים\s+(?:גם|עד|מ-?|בין|בימי|ביום|בשישי|בשבת|בחג|בלילה|בערב|בבוקר|כל|24|\d|עכשיו|היום)|(?:אנחנו|אנו|המשרד|המוקד|העסק|הקו|הטלפון)\s+(?:\S+\s+)?פתוח(?:ים)?(?![א-ת])|פתוח(?:ים)?\s+עכשיו|(?:שבעה|7)\s+ימים|ימים\s+בשבוע|כל\s+ימות\s+(?:ה)?(?:שבוע|שנה)|בכל\s+(?:שעה|עת)(?![א-ת])`,
        // Review 2026-10-12 (held-out round): "סביב השעון", "שירות לילה", "קו פתוח", "תמיד יש
        // מי שעונה", "מענה … כל היום", "ביום שישי עד הצהריים", "כשכולם סגורים" all passed.
        r`(?:מ)?סביב\s+(?:ל|ה)שעון|(?:שירות|מענה|קריאות|מוקד|טכנאי|תורנות|זמינות)\s+(?:ה)?(?:לילה|לילי|שבת|סופ[״"']?ש|חג|חגים)(?![א-ת])|(?<![א-ת])ה?קו\s+(?:ה)?פתוח|תמיד\s+(?:יש\s+)?(?:מי|מישהו)\s+ש|(?:מענה|עונים|עונה|זמינות)\s+(?:\S+\s+)?כל\s+(?:היום|הזמן|השבוע|השנה|ימות)|ביום\s+(?:ראשון|שני|שלישי|רביעי|חמישי|שישי)(?![א-ת])|עד\s+(?:ה)?צהריים|(?:כש|גם\s+כש)(?:כולם|הכול|הכל)\s+סגור`,
        // "במוצאי שבת": the (?<![א-ת]) edge above blocks the ב prefix. Plural "שבתות", "ערב שבת".
        r`(?<![א-ת])ו?במוצ(?:אי\s+שבת|[״"']ש)|(?<![א-ת])[וב]?(?:שבתות|ערבי\s+שבת|ערב\s+שבת)(?![א-ת])|עד\s+(?:ה)?(?:שעה\s+)?(?:\d{1,2}|אחת|שתיים|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר)\s+ב(?:ערב|בוקר|לילה|צהריים|צהרים)`,
      ),
    },
    // §E — response time, same day, speed. A bare "מהר" / "מהיר" only after a noun or verb of
    // the business: "השער נופל מהר מדי" and "פתיחה וסגירה מהירה" describe a gate.
    {
      id: "speed",
      re: any(
        r`(?:${NOUN})(?:\s+[א-ת]+)?\s+(?:מהיר(?:ה|ים|ות)?|זריז(?:ה|ים|ות)?|בזק|מיידי(?:ת|ים|ות)?|מידי(?:ת)?|קצר(?:ה)?|מיד(?![א-ת]))(?![א-ת])`,
        r`(?:${VERB})(?:\s+[א-ת]+){0,2}\s+(?:מהר|במהירות|בזריזות|בהקדם|מיד|מייד|מיידית|תיכף|עכשיו|היום|הבוקר|הערב|מחר|למחרת|תוך|בתוך|ברגע)(?![א-ת])`,
        r`במהירות|בהקדם|מיידי|זריז|אקספרס|(?<![א-ת])בזק(?![א-ת])|הכי\s+מהר|(?:ב|תוך\s+|בתוך\s+)זמן\s+קצר|בזמן\s+(?:שיא|קצר|מהיר)|בן\s+רגע|בו\s+ביום|מהיום\s+להיום|עוד\s+(?:הלילה|הערב|הבוקר|היום|השבוע)|עוד\s+לפני\s+(?:ה)?(?:צהריים|ערב|לילה|סוף\s+היום|שבת|החג)|כבר\s+מחר|עד\s+מחר|למחרת`,
        r`(?:זמן|זמני)\s+(?:ה)?(?:הגעה|תגובה|מענה|המתנה|טיפול)|(?:בלי|ללא|אין)\s+(?:שום\s+)?(?:המתנה|תור|תורים|עיכוב|עיכובים)(?![א-ת])|(?:בלי|לא)\s+(?:צריך\s+)?(?:לחכות|להמתין)|לא\s+תחכו|(?:תוך|בתוך)\s+(?:כ-?)?(?:\d+|שעה|שעתיים|חצי|רבע|דקות|יום|יממה)`,
        r`(?:התיקון|תיקון|ההתקנה|התקנה|העבודה|עבודה|הטיפול)\s+(?:\S+\s+)?(?:אורך|נמשך|לוקח|לוקחת|נמשכת|אורכת)\s+(?:\S+\s+)?(?:בין|כ-?|רק|עד|פחות|\d|שעה|שעתיים|יום|דקות)`,
        // Review 2026-10-12: "תור קצר", "ממהרים אליכם", "בשעה הקרובה", "בלי ימי המתנה" passed.
        r`תור\s+(?:\S+\s+)?קצר|(?<![א-ת])(?:ממהרים|נמהר|ממהר|ממהרת|למחר)(?![א-ת])|(?:אצלכם|אליכם|נגיע|מגיעים|מגיע|טכנאי|נחזור|נתקן|נטפל)\s+(?:\S+\s+)?בשע(?:ה|ות)\s+ה?קרוב(?:ה|ות)|בשע(?:ה|ות)\s+ה?קרוב(?:ה|ות)\s+(?:אצלכם|אליכם|נגיע|נחזור|נתקן|טכנאי)|(?:בלי|ללא|אין)\s+(?:\S+\s+)?(?:המתנה|המתנות|עיכובים)(?![א-ת])`,
      ),
    },
    // §B — tenure: foundedYear is null. Digits, words, decades, "since", the family business.
    // "ניסיון" is experience, except an attempt ("ניסיון לתקן"); "נותק" (disconnected) is not ותק.
    {
      id: "tenure",
      re: any(
        r`ני?סיון(?!\s+ל(?:תקן|פתוח|פתור|סגור|הפעיל|שחרר|הרים|הזיז|נקות|החליף))|(?<![א-ת])[ובה]?ותק(?![א-ת])|(?<![א-ת])[ובה]?ותיק(?:ים|ה|ות)?(?![א-ת])|מוניטין|היסטוריה\s+(?:עשירה|ארוכה|של)`,
        r`(?:\d{1,2}|אחת?\s+עשרה|שתים\s+עשרה|שלוש\s+עשרה|ארבע\s+עשרה|חמש\s+עשרה|שש\s+עשרה|שבע\s+עשרה|שמונה\s+עשרה|תשע\s+עשרה|עשר|עשרים|שלושים|ארבעים|חמישים|כמה|הרבה|מספר)\s*\+?\s*(?:שנה|שנים|שנות)\s+(?:של\s+)?(?:עבודה|שירות|פעילות|בתחום|בענף|במקצוע|בשטח|בשערים|עם\s+שערים)`,
        r`(?:כבר|מזה|יותר\s+מ|מעל|למעלה\s+מ|קרוב\s+ל|כמעט)\s*-?\s*(?:(?:\d{1,2}|עשר|עשרים|שלושים|ארבעים|חמישים|שני|שלושה|ארבעה|כמה|הרבה)\s*(?:\S+\s+)?)?(?:שנה|שנים|עשור|עשורים)(?![א-ת])`,
        r`עשור(?:ים)?\s+(?:של|בתחום|בענף|במקצוע)|(?:שני|שלושה|ארבעה|כמה)\s+עשורים|רבע\s+מאה|חצי\s+יובל|(?:ה)?דור\s+(?:ה)?(?:שני|שלישי|רביעי)|מדור\s+לדור|עסק\s+משפחתי`,
        r`(?:מאז|משנת|מ-)\s*(?:19|20)\d\d|(?:19|20)\d\d\s+(?:ועד|עד)\s+היום|(?<![א-ת])(?:מאז\s+|מ)שנות\s+(?:ה-?)?(?:\d0|שישים|שבעים|שמונים|תשעים|האלפיים|אלפיים)`,
        r`(?:מכירים|עובדים|מתקנים|מטפלים|פועלים|בתחום|בשטח|בענף)\s+(?:\S+\s+){0,3}מאז(?![א-ת])`,
        r`(?<![א-ת])(?:נוסד|נוסדה|נוסדנו|הוקם|הוקמה|הוקמנו)(?![א-ת])|צברנו|נצבר|לאורך\s+השנים|(?:שנה|שנים)\s+ב(?:תחום|ענף|מקצוע|שטח)(?![א-ת])`,
        // Review 2026-10-12: "עשרים שנה של שערים", "שלושים שנה עם מנועי שערים", "שנים של ידע",
        // "כבר דור", "כל החיים", "מאז שאני זוכר", "בעסק מאז", "מאב לבן" passed.
        r`(?:\d{2}|עשר|עשרים|שלושים|ארבעים|חמישים)\s*\+?\s*(?:שנה|שנים|שנות)\s+(?:של|עם)\s|(?:שנים|עשורים)\s+של\s+(?:ידע|עבודה|שירות|עשייה|התמחות)|כבר\s+דור|דורות\s+של|(?:כל|במשך\s+כל)\s+החיים|מאז\s+שאני\s+זוכר|(?:בעסק|כאן|פה)\s+(?:\S+\s+){0,3}מאז(?![א-ת])|מאב\s+לבן`,
        // Hebrew spelling doubles a word-initial vav after a prefix: ותק → הוותק, ותיק → הוותיקים —
        // the stems above miss both. Also "מאחורינו", "עשור וחצי", "עוד מהימים ש…".
        r`(?<![א-ת])[ובהמלש]{1,2}וות(?:ק|יק(?:ים|ה|ות|י)?)(?![א-ת])|(?:שנים|שנות|עשור|עשורים|ניסיון|ותק)\s+(?:\S+\s+){0,2}מאחורינו|עשור\s+וחצי|עוד\s+מ(?:הימים|התקופה|שנות)`,
      ),
    },
    // §B — staff: "צוות מקצועי" is 🔶 with nobody behind it, so no team, technician count,
    // expertise or professionalism claim. Not a guide's "מומלץ להזמין טכנאי" or "איש מקצוע".
    {
      id: "staffing",
      re: any(
        r`(?:מטפל|מטפלים|נטפל|עונים|עונה|נענה|מגיע|מגיעים|נגיע)\s+(?:\S+\s+)?בכל\s+(?:קריאה|פנייה|תקלה|שעה|מקום)|(?:אנשי|בעלי)\s+(?:ה)?מקצוע\s+(?:עם|בעלי|ש)`,
        r`(?<![א-ת])[הובלמש]?צוות|טכנאים|(?<![א-ת])[הוש]?טכנאי(?:ת)?\s+(?:שלנו|מוסמך|מורשה|מנוסה|מקצועי|מיומן|מומחה|ותיק|בכיר|ראשי|קבוע|תורן|כונן|זמין|באזור|בדרך|מגיע|יגיע|יוצא|יבוא|אצלכם|אליכם|לביתכם|לכל|בכל|מטעמנו|שיגיע)`,
        r`(?<![א-ת])(?:נשלח|נשלחים|שולחים|יגיע|מגיע|יבוא|זימון|הגעת)\s+(?:אליכם\s+|לכם\s+)?טכנאי`,
        r`מומח(?:ה|ים|ית|יות)|מומחיות|מקצוע[נן]|(?:אנשי|בעלי)\s+(?:ה)?מקצוע\s+(?:שלנו|מנוסים|מעולים|מוסמכים|מיומנים|הכי)|מנוס(?:ה|ים|ות)(?![א-ת])|מיומ[נן](?:ים|ה|ות)?(?![א-ת])|מתמח(?:ים|ה|ות)?(?![א-ת])|התמחות`,
        r`(?:${NOUN}|עבודה|יחס|ביצוע|צוות)\s+(?!לא\s)(?:[א-ת]+\s+)?ו?(?:מקצועי(?:ת|ים|ות)?|אמי[נן](?:ה|ים|ות)?)(?![א-ת])|מקצועיות|אמינות`,
        r`(?:מטפלים|מתקנים|מתקינים|עובדים\s+(?:עם|על)|מכירים|יודעים\s+לתקן)\s+(?:\S+\s+){0,2}(?:בכל|לכל|מכל|את\s+כל|כל)\s+(?:ה)?(?:סוגי|סוג|הסוגים|הדגמים|דגם|המותגים|היצרנים|שער)|(?:לכל|בכל)\s+סוגי\s+(?:ה)?(?:שערים|תקלות|מנועים|תריסים|מנגנונים)|כל\s+סוג\s+(?:של\s+)?(?:שער|תקלה|מנוע|תריס)`,
        // Review 2026-10-12: "המתקינים שלנו", "העובדים שלנו", "מנהל העבודה שלנו" passed.
        r`(?<![א-ת])ה?(?:מתקינים|עובדים|אנשים|נציגים|חשמלאים|מנהל\s+העבודה|מנהלי\s+העבודה)\s+שלנו|אנשי\s+(?:ה)?(?:שטח|צוות)|(?<![א-ת])ה?(?:מתקינים|מתקין|מתקינה)\s+(?:\S+\s+)?(?:מקצועי|מנוס|מיומ|אמי[נן])`,
      ),
    },
    // §B — the legal entity, ח.פ. / ע.מ., and the owner or founder (no person is named anywhere).
    {
      id: "identity",
      re: any(
        r`ח\.פ|ח[״"']פ(?![א-ת])|ע\.מ\.|עוסק\s+(?:מורשה|פטור|זעיר)|בע[״"']מ|חברה\s+רשומה|רשומים\s+ב`,
        r`בעל(?:י)?\s+העסק|(?<![א-ת])[וה]?בעלים(?![א-ת])|(?<![א-ת])[וה]?מייסד(?:ת|ים)?(?![א-ת])|מנהל\s+(?:ה)?עסק|(?<![א-ת])(?:אני|שמי)\s+[א-ת]+`,
        // Review 2026-10-12: "דן עונה לכל שיחה בעצמו" (a person named Dan — nobody is named; the
        // brand "דן שערים" stays allowed), "מבעל המקצוע עצמו", "אבא שלי התחיל את העסק" passed.
        r`(?<![א-ת])דן(?![א-ת])(?!\s+שערים)|(?:מ|ה)?בעל\s+(?:ה)?מקצוע\s+(?:עצמו|שלנו|בעצמו)|(?:התחיל|הקים|ייסד|פתח)\s+את\s+העסק`,
      ),
    },
    // §C — licence, insurance, training, association, standards. "גישה לא מורשית" (unauthorized
    // access) and "לתקן" (to repair) are on the site's own pages.
    {
      id: "credentials",
      re: any(
        r`(?<![א-ת])[וש]?מאושר(?:ת|ים|ות)?(?![א-ת])`,
        r`רי?שיון|(?<!לא\s)מורש(?:ה|ים|ית|ות)?(?![א-ת])|מוסמ[כך]|הוסמכ|הסמכ|תעוד(?:ה|ות|ת)\s+(?:מקצועי|הסמכה|חשמלאי|מוכר)|בעלי\s+תעוד|חשמלאי`,
        r`ביטוח|מבוטח|צד\s+ג[׳']`,
        r`(?<![א-ת])[ובה]?הכשר(?:ה|ות|נו)(?![א-ת])|הוכשר|מוכשר(?:ים|ת)?(?![א-ת])|(?:קורס|השתלמות)\s+(?:של|מטעם)`,
        r`איגוד|התאחדות|לשכת|ת[״"']י\s*\d|מכון\s+התקנים|תו\s+(?:תקן|איכות)|(?:לפי|בהתאם\s+ל|על\s+פי)\s*(?:כל\s+)?(?:ה)?(?:תקן|תקנים|תקנות|תקני)(?![א-ת])|עומד(?:ים|ת)?\s+ב(?:כל\s+)?(?:ה)?(?:תקן|תקנים|תקני|דרישות)|תקן\s+(?:ה)?(?:ישראלי|אירופאי|אירופי|בינלאומי)|\bISO\b|\bCE\b|חוק\s+החשמל`,
        // Review 2026-10-12: "עברנו השתלמות אצל היצרן", "חברים בארגון מתקיני השערים" passed.
        r`השתלמ(?:ות|ויות)|(?:ארגון|עמותת|פורום|רשת)\s+(?:ה)?(?:מתקינים|מתקיני|קבלני|בעלי)|רישוי\s+(?:מלא|מקצועי|בתוקף)|(?:עם|בעלי|בעל)\s+רישוי`,
      ),
    },
    // §C — named motor systems and "original parts" — unconfirmed (manufacturer training / brands).
    {
      id: "brands",
      re: any(
        r`(?<![א-ת])[והבלמש]{0,2}(?:פאאק|פאק|קאמה|קאמי|בנינקה|סומפי|זומר|דיטק|רוג[׳']ר|ג[׳']יבידי|פרוטקו|הורמן|מרנטק)(?![א-ת])|(?<![א-ת])[והבלמש]{0,2}ניס(?![א-ת])`,
        r`\b(?:FAAC|BFT|Nice|CAME|Beninca|Somfy|Sommer|Ditec|Roger|Gibidi|Proteco|DEA|Hormann|Hörmann|Marantec|Chamberlain|LiftMaster|Genie)\b`,
        r`מקורי(?:ים|ות|ת)?(?![א-ת])|יבוא[נן]|נציג(?:ים)?\s+(?:רשמי|מורשה)|מותג(?:ים)?\s+(?:מוביל|מוכר|איכותי)|(?:חלקי|חלקים|חלפים)\s+(?:\S+\s+)?(?:מהיצרן|של\s+היצרן)`,
        // Review 2026-10-12: "מנועי נייס", "מנועי ביאפטי", "מנועים איטלקיים" passed.
        r`(?<![א-ת])[והבלמש]{0,2}(?:נייס|ביאפטי|דיאה|צ[׳']מברליין|ליפטמאסטר)(?![א-ת])|(?:מנוע|מנועים|מנועי|חלקים|חלפים|ציוד)\s+(?:\S+\s+)?(?:איטלקי|גרמני|אירופא?י|ספרדי|צרפתי|יפני|אמריקאי)`,
      ),
    },
    // §D — prices, the visit fee and its waiver, what a price includes, payment. A shekel needs
    // to be a word: "ולמשקל השער" (weight) and "אשקלון" are on the pages.
    {
      id: "price",
      re: any(
        r`₪|ש[״"']ח|(?<![א-ת])[ובלה]?שקל(?:ים)?(?![א-ת])|אגור(?:ה|ות)|\bNIS\b|מחיר|מחירון|(?<![א-ת])[הול]?עלו(?:ת|יות)(?![א-ת])|תעריף|תמחור`,
        r`(?<![א-ת])[וב]?זול(?:ה|ים)?(?![א-ת])|משתלם(?:ת|ים|ות)?(?![א-ת])|בזיל\s+הזול|מוזל|הוזל|מבצע|הנחה|קופון|(?<![א-ת])ב?מתנ(?:ה|ות)(?![א-ת])`,
        r`(?:דמי|עלות|מחיר)\s+(?:ה)?(?:ביקור|הגעה|יציאה|נסיעה|אבחון|בדיקה|קריאה)|ביקור\s+(?:ה)?טכנאי|קריאת\s+שירות|(?:מקוזז|מקזזים|יקוזז|קיזוז)`,
        r`(?:ביקור|בדיקה|אבחון|ייעוץ|הגעה|הצעה)\s+(?:\S+\s+)?(?:חינם|בחינם|ללא\s+עלות|בלי\s+עלות|על\s+חשבוננו|במתנה)|על\s+חשבוננו|חינם|(?<![א-ת])עלינו(?![א-ת])`,
        r`(?<![א-ת])[וש]?(?:תשלמו|תחויבו|נחייב|לשלם|משלמים|תשלום)(?![א-ת])`,
        r`(?:בלי|ללא|אין)\s+(?:שום\s+)?(?:הפתעות|תוספות|חיוב|חיובים|מינימום)|עלויות\s+נסתרות|(?:הכל|הכול)\s+כלול|כולל\s+(?:הכל|הכול)|(?:הצעה|הצעת)\s+(?:\S+\s+)?שקופה|שקיפות\s+מלאה|(?<![א-ת])ו?ה?הוגנ(?:ים|ות|ת)?(?![א-ת])|(?<![א-ת])ו?ה?הוגן(?![א-ת])`,
        r`(?:תנאי|דרכי|אמצעי)\s+(?:ה)?תשלום|(?<![א-ת])[ובה]?תשלומים(?![א-ת])|(?<![א-ת])[ובה]?אשראי|(?<![א-ת])[וב]?ביט(?![א-ת])|פייבוקס|מזומן|צ[׳']קים|שיקים|העברה\s+בנקאית|מקדמה|(?:משלמים|תשלמו|התשלום|תשלום)\s+(?:רק\s+)?(?:בסוף|בסיום|אחרי|לאחר|בגמר|בתום)`,
        // Review 2026-10-12: "פריסה לתשלומים", "בלי לפתוח את הארנק" and a bare-number visit fee
        // ("רק 99 לביקור", "מאה וחמישים לביקור" — the 150–350 ₪ row with no currency) passed.
        r`(?<![א-ת])ל(?:תשלומים|תשלום)(?![א-ת])|ארנק|\d{2,4}\s*ל(?:ביקור|בדיקה|קריאה|הגעה|אבחון|שעת|שעה)(?![א-ת])|(?:מאה|מאתיים|חמישים|שישים|שבעים|שמונים|תשעים|(?:שלוש|ארבע|חמש)\s+מאות)(?:\s+ו[א-ת]+)?\s+ל(?:ביקור|בדיקה|קריאה|הגעה|אבחון)(?![א-ת])|כולל(?:ת|ים|ות)\s+(?:את\s+)?(?:הכל|הכול)`,
      ),
    },
    // §D — the warranty and every other promise about the outcome or how long it lasts.
    // "ללא התחייבות" (no obligation) is the site's own and stays allowed.
    {
      id: "warranty",
      re: any(
        r`(?<![א-ת])[וש]?מגוב(?:ה|ים|ות)(?![א-ת])|(?:ש)?(?:לא|בלי)\s+(?:י|ת)חזור(?:ו)?\s+(?:על\s+עצמ|שוב|יותר|לעולם)|ידי\s+זהב|יד\s+טובה`,
        r`אחריות|ערבות|מכוס(?:ה|ים|ות)\s+(?:ל|על|באחריות)|(?<![א-ת])[וש]?(?:מבטיח|מבטיחה|מבטיחים|נבטיח|מתחייב|מתחייבים|נתחייב)(?![א-ת])|(?<!(?:ללא|בלי)\s)התחייבות`,
        r`כיסוי\s+(?:מלא|לכל|על|ל)|(?:שנה|שנתיים|\d+\s*שנים|(?:שלוש|ארבע|חמש|עשר)\s+שנים|\d+\s*חודשים|חצי\s+שנה)\s+(?:של\s+)?(?:שקט|ראש\s+שקט|כיסוי|ביטחון|רוגע)|(?<![א-ת])לשנים(?![א-ת])|פעם\s+אחת\s+(?:וזהו|וגמרנו|ודי)`,
        r`שקט\s+נפשי|ראש\s+שקט|כאב\s+ראש|לתמיד|לנצח|לכל\s+החיים|פעם\s+אחת\s+ולתמיד|(?:פתרון|תיקון|עבודה|שקט)\s+(?:\S+\s+)?לטווח\s+(?:ה)?ארוך|לשנים\s+(?:קדימה|ארוכות|רבות)`,
        r`(?:תיקון|תיקונים|עבודה|פתרון|חלקים|חלק|ציוד|שירות|טיפול|התקנה)\s+(?:\S+\s+)?(?:עמיד(?:ים|ה|ות)?|ש?(?:מחזיק|מחזיקים|יחזיק|יחזיקו|תחזיק)|איכותי(?:ים|ת|ות)?)(?![א-ת])`,
        r`(?:מחזיק|יחזיק|מחזיקים|יחזיקו|תחזיק)\s+(?:\S+\s+)?(?:מעמד|לאורך|שנים|לשנים|שנה)|(?:לא|בלי)\s+(?:תצטרכו|צריך)\s+(?:לתקן|להזמין|לחזור)\s+שוב|נחזור\s+בלי|ללא\s+פשרות|ברמה\s+(?:ה)?גבוהה`,
        // Review 2026-10-12: "עומדים מאחורי כל עבודה", "שנה שלמה של שקט", "כל עבודה מכוסה",
        // "שער שלא יתקע שוב", "לא תצטרכו לחזור אלינו", "התיקון נשאר תקין שנים" passed.
        r`עומד(?:ים|ת)?\s+מאחורי\s+(?:כל\s+)?(?:ה)?(?:עבודה|עבודות|תיקון|תיקונים|התקנה|התקנות|שירות|מוצר|מילה|הבטחה)|(?:שנה|שנתיים|\d+\s*שנים|חצי\s+שנה)\s+[א-ת]+\s+של\s+(?:שקט|ראש\s+שקט|כיסוי|ביטחון|רוגע)|(?:כל\s+|ה)(?:עבודה|תיקון|התקנה|החלפה)\s+(?:\S+\s+)?מכוס|(?:לא|בלי)\s+(?:\S+\s+)?(?:יתקע|ייתקע|יתקלקל|יישבר|תתקלקל|ייפול)\s+(?:שוב|יותר|לעולם)|(?:לא|בלי)\s+(?:תצטרכו|צריך)\s+לחזור\s+אלי|(?:תיקון|התיקון|העבודה|ההתקנה)\s+(?:\S+\s+){0,2}(?:תקין|תקינה|עובד|עובדת)\s+(?:\S+\s+)?(?:שנים|לשנים|שנה)(?![א-ת])|(?:עובד|יעבוד|תעבוד|עובדת|תקין|תקינה|יחזיק|מחזיק)\s+(?:\S+\s+){0,2}בעוד\s+(?:\S+\s+)?(?:שנה|שנים|שנתיים)(?![א-ת])`,
        // The feminine forms the durability stems above miss ("עבודה שמחזיקה שנים") — with the
        // business's own work as the subject: the site's "מערכות איכותיות מחזיקות מעמד לאורך
        // שנים" is general advice and stays allowed.
        r`(?:עבודה|העבודה|עבודות|התקנה|ההתקנה|התקנות|החלפה|ההחלפה)\s+(?:\S+\s+)?ש?(?:מחזיקה|מחזיקות|תחזיק)\s+(?:\S+\s+)?(?:מעמד|לאורך|שנים|לשנים|שנה)(?![א-ת])`,
      ),
    },
    // §E — coverage: national, the named regions, "your area", the travel fee. "מכל מקום"
    // (remote control), "לכל שער חשמלי יש" and "באזורים בהם יש מסילות" are on the pages.
    {
      id: "coverage",
      re: any(
        r`(?:ב|ל|מ)?כל\s+(?:רחבי\s+)?(?:הארץ|ישראל|המדינה|האזורים|הערים|אזור|עיר|יישוב|ישוב|כתובת)(?![א-ת])|ארצי(?:ת)?(?![א-ת])|פריס(?:ה|ת)\s+(?:ארצית|רחבה|מלאה|שירות)|בכל\s+רחבי|מרכז\s+(?:ה)?ארץ`,
        r`(?<![א-ת])[ובלמהש]{0,2}(?:${PLACE})(?![א-ת])`,
        r`באזור(?:ך|כם|\s+שלך|\s+שלכם)|בעיר(?:ך|כם|\s+שלך|\s+שלכם)|בסביב(?:תך|תכם|ה\s+שלך|ה\s+שלכם)|בשכונ(?:תך|תכם|ה\s+שלך|ה\s+שלכם)|לידכם|לידך|קרוב(?:ים)?\s+אליכם|(?:טכנאי|צוות|ניידת)\s+(?:\S+\s+)?באזור`,
        r`(?:משרתים|מגיעים|נגיע|פועלים|נותנים\s+שירות|עובדים|מכסים)\s+(?:\S+\s+){0,2}(?:בכל|לכל|את\s+כל|גם\s+ל|גם\s+ב|עד\s+ל?)`,
        r`מדן\s+(?:ו?עד|עד)\s+אילת|פריפרי|סניף|סניפים|(?:תוספת|דמי)\s+(?:מרחק|נסיעה|הגעה|דרך)|והסביבה(?![א-ת])`,
        // Review 2026-10-12: "בכל מקום שתהיו" (the site's "מכל מקום" — a remote — stays allowed),
        // "לא משנה איפה אתם גרים", "בלי תוספת על המרחק", "מקצה לקצה של הארץ" passed.
        // Kept narrow: "נקו בכל מקום שהלכלוך מצטבר" and "נקו את המסילה מקצה לקצה" are gate tips.
        r`(?:ל|ב)כל\s+מקום\s+ש(?:תהיו|אתם|תצטרכו|תבחרו)|(?:ל|ב)כל\s+מקום\s+ב(?:ארץ|ישראל|אזור)|(?:נגיע|מגיעים|מגיע|יגיע|באים)\s+(?:\S+\s+)?לכל\s+מקום|לא\s+משנה\s+(?:איפה|היכן|באיזה|לאן|מאיפה)|תוספת\s+(?:\S+\s+){1,2}(?:ה)?(?:מרחק|נסיעה|הגעה|דרך)|מקצה\s+(?:ה)?ארץ|מקצה\s+לקצה\s+(?:של\s+)?(?:ה)?(?:ארץ|מדינה|ישראל)`,
        // The construct and plural forms the first stem misses: "בכל אזורי הארץ", "בכל הישובים"
        // (not "כל אזורי המסילה").
        r`(?:ב|ל|מ)?כל\s+(?:אזורי|יישובי|ישובי|ערי)\s+(?:ה)?(?:ארץ|מרכז|צפון|דרום|שרון|שפלה|גוש|מדינה|ישראל|גליל|נגב)|(?:ב|ל|מ)?כל\s+(?:היישובים|הישובים|השכונות)(?![א-ת])`,
      ),
    },
    // §A — reviews, ratings, rank, superlatives (content-standards §6), the social accounts.
    // "המלצה חמה" is the site's own maintenance advice, and "מומלץ" alone means "advisable".
    {
      id: "reviews",
      re: any(
        r`ביקורות|ביקורת\s+(?:של|מ|חיובית|מעולה|מצוינת|טובה|לקוחות|גוגל)|חוות\s+דעת|המלצות|ממליצ(?:ים|ות|ה)|הכי\s+מומל|המומלצ(?:ים|ת|ות)|מומלצ(?:ים|ת|ות)\s+(?:ביותר|על\s+ידי|בגוגל|ע[״"]י)`,
        r`דירוג|(?<![א-ת])[וב]?כוכב(?:ים|י)?(?![א-ת])|גוגל|\bgoogle\b|(?<![א-ת])[וה]?מרוצ(?:ים|ה|ות)(?![א-ת])|שביעות\s+(?:ה)?רצון|שם\s+טוב|(?:סומכים|בוחרים|בחרו)\s+(?:\S+\s+)?(?:עלינו|בנו)|מפה\s+לאוזן|(?:לקוחות|ועדי\s+בתים|שכנים|דיירים)\s+(?:\S+\s+)?(?:ממליצ|מרוצ|חוזרים|סומכים)|מכירים\s+אותנו|(?:כולם|רבים|שכנים|לקוחות|כל\s+השכונה)\s+(?:\S+\s+)?(?:מכירים|יודעים\s+עלינו)`,
        r`(?:ה)?מוביל(?:ים|ה|ות)?\s+ב(?:תחום|ענף|ישראל|ארץ|שוק)|החברה\s+המובילה|המובילים|הכי\s+(?:טוב|טובים|מקצועי|אמינ|מנוס|זול|מוכר|ידוע|גדול|ותיק|מבוקש|מהיר|זמינ|חזק|מוביל)|מספר\s*(?:1|אחת|אחד)(?!\d)|מס[׳'.]\s*1(?!\d)|מקום\s+(?:ה)?ראשון`,
        r`(?:ה)?(?:טוב|טובה|טובים|טובות|גבוה|גבוהה|מקצועי|מקצועית|מקצועיים|אמין|אמינה|אמינים|מנוס|מנוסה|מנוסים|מהיר|מהירה|מהירים|זול|זולה|זולים|מתקדם|מתקדמת|מתקדמים|איכותי|איכותית|איכותיים|משתלם|גדול|גדולה|גדולים)\s+ביותר`,
        r`\d[.,]\d\s*(?:\/\s*5|מתוך|כוכב|★|בגוגל)|★|פייסבוק|אינסטגרם|טיקטוק|\b(?:facebook|instagram|tiktok)\b`,
        // Review 2026-10-12: "שירות שזוכה לשבחים", "החברה הגדולה בתחום", "מומלצים בפורומים" passed.
        r`שבחים|מחמאות|משבחים|(?<![א-ת])ה(?:גדול|גדולה|גדולים|ותיק|ותיקה|חזק|חזקה|מוכר|מוכרת|ידוע|ידועה)\s+ב(?:תחום|ענף|ארץ|ישראל|אזור|שוק)(?![א-ת])|מומלצ(?:ים|ות|ת)\s+(?:בפורומים|ברשת|בקבוצות|ברשתות|בפייסבוק|אצל|על\s+ידי)|מדברים\s+עלי(?:נו|ו)(?![א-ת])`,
      ),
    },
    // Counts of jobs, customers, staff — none exists, and none may be added.
    {
      id: "counts",
      re: any(
        r`(?:\d[\d,]*|מאות|אלפי|אלפים|עשרות|רבבות|(?<![א-ת])[לכמב]?מאה|(?<![א-ת])[לכמב]?אלף)\s*\+?\s*(?:ה)?(?:שערים|שער|לקוחות|לקוח|עבודות|התקנות|תיקונים|קריאות|פניות|פרויקטים|ועדי|בתים|בניינים|משפחות|עסקים|טכנאים|מנועים|תריסים)(?![א-ת])`,
        r`(?:יותר\s+מ|מעל|למעלה\s+מ|קרוב\s+ל|כמעט|בערך)\s*-?\s*(?:\d[\d,]*|מאה|אלף|מאות|אלפי)|(?:תיקנו|התקנו|טיפלנו|שירתנו|החלפנו|ביצענו)\s+(?:כבר\s+)?(?:\S+\s+)?(?:\d|מאות|אלפי|עשרות|המון|הרבה|אינספור)`,
        r`(?<![א-ת])(?:שני|שתי|שלושה|ארבעה|חמישה|שישה|שבעה|שמונה|תשעה|עשרה)\s+(?:טכנאים|צוותים|עובדים|אנשי\s+מקצוע|רכבי\s+שירות|ניידות)|קהל\s+לקוחות`,
      ),
    },
  ],
  allowClaims: [],

  /**
   * Files this site renders but cannot vouch for: a line may never cite them (kit README step 1).
   * The synced manifest carries the 🔶 shortPitch ("אחריות מלאה וזמינות 24/7 לחירום, בפריסה
   * ארצית"); the reviews component renders nothing until a real source exists (golden rule 1);
   * scripts, the .claude layer and the type stubs render no visible copy at all.
   */
  forbiddenSources: [
    "site.config.json",
    "components/marketing/Reviews.tsx",
    "scripts/",
    ".claude/",
    "types/",
  ],

  /**
   * The page a quoted sentence renders on, so a tip must link to the page that carries it (the
   * gate asks once per quote, with source = `<file> — ״<that one quote>״`; check-live-out then
   * proves it on the built page). app/<route>/page.tsx → /<route>/; a sentence in lib/posts.ts →
   * the /blog/<slug>/ of the post it sits in — null when it sits in two posts, where the built-page
   * check alone decides; a serviceTriggers entry in lib/content.ts → its /services/<slug>/.
   * Anything that feeds many pages (the rest of lib/content.ts, components) answers null. Only
   * scripts/live/ calls this — the Next build bundles this file but never runs it.
   */
  pageOfSource: (file, source) => {
    const app = /^app\/((?:[^/[\]]+\/)*)page\.tsx$/.exec(file);
    if (app) return `/${app[1]}`;
    if (file !== "lib/posts.ts" && file !== "lib/content.ts") return null;
    const one = /״(.+)״\s*$/.exec(String(source ?? ""));
    const pieces = one
      ? one[1]
          .split("…")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];
    const quote = pieces.sort((a, b) => b.length - a.length)[0] ?? "";
    if (!quote) return null;
    const text = readFileSync(join(ROOT, file), "utf8");
    const at = text.indexOf(quote);
    if (at < 0) return null; // the register gate reports a missing sentence on its own
    const before = text.slice(0, at);
    if (file === "lib/posts.ts") {
      if (text.indexOf(quote, at + 1) >= 0) return null; // in two posts: the built page decides
      const slugs = [...before.matchAll(/^ {4}slug: "([^"]+)",$/gm)];
      const slug = slugs.length ? slugs[slugs.length - 1][1] : null;
      return slug ? `/blog/${slug}/` : null;
    }
    // lib/content.ts: only the per-service trigger lists render on one page each.
    const blocks = [...before.matchAll(/^export const (\w+)/gm)];
    const block = blocks.length ? blocks[blocks.length - 1][1] : "";
    if (block !== "serviceTriggers") return null;
    const keys = [...before.matchAll(/^ {2}"([^"]+)": \[$/gm)];
    const key = keys.length ? keys[keys.length - 1][1] : null;
    return key ? `/services/${key}/` : null;
  },
};
