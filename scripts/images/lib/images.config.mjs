/**
 * images.config.mjs — every site-specific constant of the images kit, in ONE place.
 *
 * Rendered by the Media Studio page-images toolkit (`port --site dangates`) from
 * sites/dangates/site.json, which stays the source of truth: `doctor` compares the people ids and
 * the banned stems below with that file and fails on a difference. manifest-rules.mjs,
 * check-images-out.mjs, images-status.mjs and lib/images.ts read everything site-specific from
 * here; nothing else in scripts/images/ knows this site.
 *
 * Pure data: no fs, no network, because lib/images.ts imports it at build time.
 *
 * Routes are RAW strings, the way the directories of out/ and the hrefs of the built pages carry
 * them (Hebrew stays literal there). Canonicals and sitemap <loc>s are percent-escaped: never
 * compare a route below with one of those.
 */

/** The site, as content/images/manifest.json names it. */
export const domain = "dangates.co.il";

/**
 * Where each list lives: `{ file, const, nameKey, route }` for a TS array, or `{ dir, route }` for
 * a folder with one data file per row. `route` is a pattern over the row's strings; a null route
 * means the rows are only names (banned in alt text and file names), with no pages behind them.
 */
export const lists = {
  services: {
    file: "lib/site-config.ts",
    const: "services",
    nameKey: "name",
    route: "/services/{slug}/",
    key: "services-{slug}",
    keyMap: {
      "שערים-נגררים": "sliding",
      "שערי-כנף": "swing",
      "שערים-מתרוממים": "overhead",
      "שערים-לחניה": "parking",
      "שער-זרוע": "barrier",
      "תריסי-גלילה-חשמליים": "shutters",
      "שערים-לדירה": "entrance",
    },
  },
  areas: {
    file: "lib/site-config.ts",
    const: "locations",
    route: "/locations/{slug}/",
    key: "cities-{slug}",
    keyMap: {
      "תל-אביב": "tel-aviv",
      ירושלים: "jerusalem",
      חיפה: "haifa",
      "ראשון-לציון": "rishon-lezion",
      "פתח-תקווה": "petah-tikva",
      נתניה: "netanya",
      חולון: "holon",
      "כפר-סבא": "kfar-saba",
      מודיעין: "modiin",
      רחובות: "rehovot",
      יבנה: "yavne",
      אשדוד: "ashdod",
      אשקלון: "ashkelon",
      שרון: "sharon",
    },
  },
  articles: {
    dir: "content/guides",
    route: "/מדריכים/{slug}/",
    key: "guides-{slug}",
    keyMap: {
      "תקן-900-שער-חשמלי": "standard-900",
      "שער-חשמלי-רועש": "noisy-gate",
      "מחסום-חניה-ועד-בית": "parking-barrier",
      "שער-נגרר-כנף-או-קונזולי": "gate-types",
      "שער-חשמלי-לא-נסגר": "not-closing",
    },
  },
  posts: {
    file: "lib/posts.ts",
    const: "posts",
    nameKey: "title",
    route: "/blog/{slug}/",
    template: "topic",
    group: "blog",
    key: "blog-{slug}",
    keyMap: {
      "שערים-חשמליים-השקעה": "investment",
      "תקלות-נפוצות-בשערים-חשמליים": "common-faults",
      "שדרוג-לשער-חשמלי-חכם": "smart-upgrade",
      "בטיחות-שער-חשמלי-3-שלבים": "safety-3-steps",
      "שער-חשמלי-חוסך-זמן": "saves-time",
      "תחזוקה-מונעת-לשערים-חשמליים": "preventive-maintenance",
      "יתרונות-שער-חשמלי-לעסק": "business-benefits",
      "חשיבות-תחזוקת-שערים-חשמליים": "maintenance-importance",
      "החלפה-או-תיקון-שער-חשמלי": "repair-or-replace",
      "שער-חשמלי-לא-מגיב": "not-responding",
      "שער-חשמלי-שעובד-כמו-חדש": "like-new",
    },
  },
};

/** Every content route in order: a `{ route, template }`, or a `{ group }` standing for a list. */
export const layout = [
  {
    route: "/",
    template: "home",
  },
  {
    route: "/שירותים/",
    template: "services-hub",
  },
  {
    group: "services",
  },
  {
    route: "/איזורי-שירות/",
    template: "areas-hub",
  },
  {
    group: "areas",
  },
  {
    route: "/אודות/",
    template: "about",
  },
  {
    route: "/צור-קשר/",
    template: "contact",
  },
  {
    route: "/מחירון/",
    template: "pricing",
  },
  {
    route: "/גלריה/",
    template: "gallery",
  },
  {
    route: "/מדריכים/",
    template: "blog-index",
  },
  {
    group: "articles",
  },
  {
    route: "/blog/",
    template: "topics-hub",
  },
  {
    group: "posts",
  },
];

/** The routes that never carry a content image. */
export const excludedRoutes = [
  "/מדיניות-פרטיות/",
  "/הצהרת-נגישות/",
  "/תודה/",
  "/404/",
  "/_not-found/",
];

/** The gallery: the home of the disclosure note. */
export const galleryRoute = "/גלריה/";

/** The about page, the only place a first name may appear in a caption. Null when there is none. */
export const aboutRoute = "/אודות/";

/** The index whose cards show the derived 480-px thumbnails. Null when there is none. */
export const blogIndexRoute = "/מדריכים/";

/** A city page. No file may be shared between two of them. Null when the site has no city pages. */
export const cityRoutePattern = /^\/locations\/[^/]+\/$/;

/** The people in the frames, as manifest `people` ids. */
export const peopleIds = ["tech-a", "tech-b"];

/** First names, allowed ONLY in a caption whose every placement is the about page. */
export const firstNamesHe = ["דמות א׳", "דמות ב׳"];

/**
 * Always empty. No surname appears in any file of a site repo, and this file is in the repo, so
 * surnames and full names stay in site.json and the toolkit's own validators refuse them before an
 * alt or a caption ever reaches this manifest.
 */
export const bannedNamesHe = [];

/** Area and city tokens that may never sit inside a file name, beside the slugs of the area list. */
export const areaSlugs = [
  "tel-aviv",
  "jerusalem",
  "haifa",
  "rishon-lezion",
  "petah-tikva",
  "netanya",
  "holon",
  "kfar-saba",
  "modiin",
  "rehovot",
  "yavne",
  "ashdod",
  "ashkelon",
  "sharon",
];

/** City names that are also ordinary nouns: refused only alone at the end of a clause. */
export const ambiguousCityNames = ["רחובות"];

/** `public/images/<group>/<file>`: the toolkit's plan `group`s. */
export const fileGroups = [
  "home",
  "services",
  "areas",
  "cities",
  "about",
  "contact",
  "pricing",
  "gallery",
  "blog",
  "guides",
];

/** The long edge the finish step resizes to and the byte budget of each size class. */
export const sizeClasses = {
  large: {
    longEdge: 1400,
    maxBytes: 204800,
  },
  half: {
    longEdge: 1200,
    maxBytes: 174080,
  },
  tile: {
    longEdge: 960,
    maxBytes: 122880,
  },
  thumb: {
    longEdge: 480,
    maxBytes: 46080,
  },
};

/** How long an alt and a caption may be: the toolkit's own limits (page-images lib/alt.mjs). */
export const textLimits = {
  alt: {
    min: 40,
    max: 160,
  },
  caption: {
    min: 40,
    max: 200,
  },
};

/** site.json claims.extraBanned: a plain substring, refused in any alt or caption. */
export const extraBanned = [
  "תמונה של",
  "לפני ואחרי",
  "הדמיה",
  "בינה מלאכותית",
  "שלנו",
  "אצלנו",
  "טכנאים",
  "מומחה",
  "מומחים",
  "מקצועיות",
  "אמינות",
  "אנשי שטח",
  "המתקינים",
  "בעלי העסק",
  "בעל העסק",
  "מייסד",
  "הבעלים",
  "רישיון",
  "רשיון",
  "מורשה",
  "מוסמך",
  "מוסמכ",
  "הסמכ",
  "ביטוח",
  "מבוטח",
  "תעוד",
  "שנות ניסיון",
  "נוסד",
  "הוקמ",
  "אחריות",
  "פריסה ארצית",
  "בכל הארץ",
  "ארצי",
  "סניף",
  "24/7",
  "מסביב לשעון",
  "שעות ביממה",
  "באותו יום",
  "באותו היום",
  "תוך שעה",
  "מיידי",
  "בהקדם",
  "חירום",
  "דחוף",
  "דחופ",
  "זמינות",
  "חינם",
  "ללא עלות",
  "ללא התחייבות",
  "בלי התחייבות",
  "הצעת מחיר",
  "מחיר",
  "תעריף",
  "₪",
  "ש״ח",
  "מע״מ",
  "דמי ביקור",
  "תוספות",
  "ממליצ",
  "המלצ",
  "דירוג",
  "כוכב",
  "הטוב ביותר",
  "הטובה ביותר",
  "מספר 1",
  "מס׳ 1",
  "הכי טוב",
  "ללא פשרות",
  "בלי פשרות",
  "מצוינות",
  "מתחייב",
  "מבטיח",
  "מובטח",
  "לאורך זמן",
  "לאורך שנים",
  "עמידות",
  "מכון התקנים",
  "תו תקן",
  "מאושר",
  "בטיחותי",
  "ביצענו",
  "החלפנו",
  "תיקנו",
  "כיוונו",
  "איזנו",
  "תוקן",
  "נפתר",
  "הושלם",
  "בהצלחה",
  "לקוח",
  "דייר",
  "השרון",
  "גוש דן",
  "מרכז הארץ",
  "ירושלמי",
  "FAAC",
  "BFT",
  "CAME",
  "Beninca",
  "Benincà",
  "Somfy",
  "LiftMaster",
  "Chamberlain",
  "Genie",
  "Hormann",
  "Hörmann",
  "Ditec",
  "Doorhan",
  "Alutech",
  "Marantec",
  "פאק",
  "בי.אף.טי",
  "קאמה",
  "בנינקה",
  "סומפי",
  "ליפטמסטר",
  "צ׳מברליין",
  "ג׳יני",
  "הורמן",
  "דיטק",
  "דורהאן",
  "המובילים",
  "המובילה",
];

/** site.json claims.extraBannedRegex: regular-expression sources, compiled with no flags. */
export const extraBannedRegex = [
  "(?<![א-ת])[הו]?ותק(?![א-ת])|ניסיון של \\d+|מעל \\d+ שנ|למעלה מ-?\\d+ שנ|עשרות שנים",
  "מאז \\d{4}|משנת \\d{4}",
  "אחריות (?:של|ל-?|למשך )\\s*\\d+|אחריות מלאה",
  "תוך \\d+ (?:דקות|שעות)|הגעה מיידית|(?<![א-ת])מהיר(?:ה|ים|ות)?(?![א-ת])|במהירות|(?<![א-ת])תוך\\s*כ?(?:\\d|שעה|שעות|דקות|יום)",
  '(?<![א-ת])שעות(?![א-ת])|(?<![א-ת])בשבת(?![א-ת])|(?<![א-ת])בלילה(?![א-ת])|סופ[״"]?ש(?![א-ת])|(?<![א-ת])[ושבלכה]?זמי[נן](?:ה|ים|ות)?(?![א-ת])',
  "דירוג \\d|\\d(?:\\.\\d)? כוכבים|\\d+ ביקורות|\\d+ לקוחות|5\\.0",
  "הבעלים [א-ת]+|המייסד [א-ת]+|הטכנאי שלנו [א-ת]+|(?<![א-ת])דן(?![א-ת])",
  "מסביר(?:ים)? (?:לכם )?(?:מה התקלה ו)?מה (?:ה)?עלות|מה (?:ה)?עלות לפני|הסבר על העלות לפני|הצעה שקופה|מחיר שקוף|מחיר לפני העבודה|אבחון לפני מחיר|(?:בלי|ללא) הפתעות|ייעוץ והצעת מחיר|המחיר נקבע באבחון",
  "(?:ללא|בלי|אין) (?:התחייבות|מחויבות)|(?:ייעוץ|אבחון|ביקור|בדיקה|הצעת מחיר) (?:חינם|ללא עלות|ללא תשלום)|בחינם",
  "להבטחת תוצאות|תוצאות (?:לאורך|מובטחות)|שמחזיק(?:ה|ים)? (?:שנים|לאורך)",
  "במחירון|למחירון|ב-מחירון|מחירוני|מחירון|מחירי|תמחור|(?<![א-ת])[הב]?עלות(?![א-ת])|(?<![א-ת])יקר(?:ה|ים)?(?![א-ת])|(?<![א-ת])זול(?:ה|ים)?(?![א-ת])|משתלם",
  "טכנאי(?:ת)?\\s+(?:שלנו|מוסמך|מנוסה|מקצועי|מיומן|בכיר)|(?<![א-ת])[הו]?(?:מומח|מנוס[הי]|מיומנ|מוסמ[כך]|מקצועי|מקצוענ)",
  '(?<![א-ת])[הב]?תקן(?![א-ת])|(?<![א-ת])תקני(?:ת|ים|ות)?(?![א-ת])|ת[״"]?י\\s*900|(?<![א-ת])ת[״"]י(?![א-ת])|(?<![א-ת])בתקנות',
  "(?<![א-ת])[ושה]?(?:ביצענו|החלפנו|תיקנו|התקנו|מצאנו|פירקנו|בדקנו|אבחנו|ניקינו|הגענו|סיימנו|טיפלנו|כיוונו|איזנו)(?![א-ת])",
  "(?<![א-ת])[הו]?(?:תוקן|תוקנה|נפתר|נפתרה|הוחלף|הוחלפה|הותקן|הותקנה)(?![א-ת])|הושלמ|הסתיימ|פועל שוב|עובד שוב|חזר לעבוד|בהצלחה",
  "(?<![א-ת])(?:שלנו|אצלנו)(?![א-ת])|(?<![א-ת])[ובלמהשכ]{0,2}(?:צוות|צוותי|צוותים|עובד|עובדי|עובדים)(?![א-ת])",
  "(?:מאות|אלפי|עשרות)\\s+(?:שערים|תיקונים|עבודות|בתים|לקוחות|בניינים)|\\d\\s*(?:תיקונים|שערים|טכנאים|לקוחות|דיירים|קומות|שנים|שנה)(?![א-ת])",
  '\\d\\s*(?:וולט|וו?אט|קילוו?אט|אמפר|ק[״"]?ג|קילו|טון|מטר|מ[׳\']|ס[״"]?מ|מ[״"]?מ|°)(?![א-ת])|\\d\\s*(?:דקות|שעות|ימים|שבועות|חודשים|שנים)(?![א-ת])',
  "(?<![א-ת])[ובלמהשכ]{0,2}(?:אזור[\\s־-]התעשייה[\\s־-]פולג[\\s־-]\\(קריית[\\s־-]ספיר\\)|אזור[\\s־-]התעשייה[\\s־-]הדרומי|אזור[\\s־-]התעשייה[\\s־-]הצפוני|קריית[\\s־-]פנחס[\\s־-]אילון|קריית[\\s־-]בן[\\s־-]גוריון|רחובות[\\s־-]ההולנדית|המושבה[\\s־-]הגרמנית|כפר[\\s־-]סבא[\\s־-]הירוקה|אזור[\\s־-]עתיר[\\s־-]ידע|המפדה[\\s־-]האזרחי|הרצליה[\\s־-]פיתוח|פארק[\\s־-]התעשייה|קריית[\\s־-]נורדאו|שיכוני[\\s־-]המזרח|העיר[\\s־-]התחתית|כרם[\\s־-]התימנים|קריית[\\s־-]היובל|קריית[\\s־-]השרון|קריית[\\s־-]מטלון|אם[\\s־-]המושבות|הצפון[\\s־-]החדש|הצפון[\\s־-]הישן|כפר[\\s־-]גבירול|מחנה[\\s־-]יהודה|מרכז[\\s־-]הכרמל|נאות[\\s־-]אשלים|נווה[\\s־-]ארזים|נחלת[\\s־-]יהודה|קריית[\\s־-]אריה|תל[\\s־-]גיבורים|גבעת[\\s־-]ציון|גבעת[\\s־-]שאול|הדר[\\s־-]הכרמל|הוד[\\s־-]השרון|הר[\\s־-]חוצבים|יבנה[\\s־-]מזרח|כפר[\\s־-]אברהם|מב״ת[\\s־-]מערב|מב״ת[\\s־-]צפון|מרכז[\\s־-]הארץ|נאות[\\s־-]בגין|נאות[\\s־-]גנים|נאות[\\s־-]רבין|נאות[\\s־-]שמיר|נווה[\\s־-]אילן|נווה[\\s־-]עמית|נווה[\\s־-]שאנן|נמל[\\s־-]אשדוד|פארק[\\s־-]המדע|קריית[\\s־-]משה|קריית[\\s־-]שרת|רמת[\\s־-]אליהו|רמת[\\s־-]החייל|בית[\\s־-]הכרם|בית[\\s־-]ונוף|ג׳סי[\\s־-]כהן|הציפורים|יד[\\s־-]אליהו|כפר[\\s־-]גנים|נווה[\\s־-]חוף|נווה[\\s־-]עוז|נווה[\\s־-]צדק|עין[\\s־-]גנים|עיר[\\s־-]ימים|פלורנטין|פסגת[\\s־-]זאב|רובע[\\s־-]ט״ו|רובע[\\s־-]ט״ז|רובע[\\s־-]י״א|רובע[\\s־-]י״ז|רמת[\\s־-]אביב|רמת[\\s־-]פולג|אבני[\\s־-]חן|אגרובנק|בית[\\s־-]וגן|בת[\\s־-]גלים|הנביאים|כפר[\\s־-]סבא|נווה[\\s־-]ים|נוף[\\s־-]חפר|עין[\\s־-]כרם|רובע[\\s־-]א׳|רובע[\\s־-]ב׳|רובע[\\s־-]ד׳|רובע[\\s־-]ט׳|רמת[\\s־-]סיב|אושיות|אפרידר|גאולים|גוש[\\s־-]דן|האירוס|הדיונה|הרצליה|השבטים|ניצנים|שעריים|תלפיות|אגמים|אחוזה|הדרים|הכרמל|השפלה|השרון|מוריה|מכבים|נתניה|סגולה|רוממה|רעננה|שמשון|שעריה|אפקה|בבלי|ברנע|גילה|דניה|פולג|צהלה|רמות|רעות|שבזי|שרון|יפו)(?![א-ת])",
  "(?<![A-Za-z])(?:Tel Aviv|tel aviv|Jerusalem|Haifa|Rishon|Petah Tikva|Netanya|Holon|Kfar Saba|Modi'?in|Rehovot|Yavne|Ashdod|Ashkelon|Sharon|Herzliya|Ra'?anana|Hod Hasharon|Jaffa|Carmel)(?![A-Za-z])",
  "(?<![A-Za-z0-9])(?:FAAC|BFT|Nice|CAME|Benin[cç]a|Somfy|LiftMaster|Chamberlain|Genie|H[oö]rmann|Ditec|DEA|Roger|Doorhan|Alutech|Marantec|Aprimatic|Mhouse|Sommer|Proteco|Gibidi|Key Automation|King Gates)(?![A-Za-z0-9])|נייס|פרוטקו|אפרימטיק",
];

/** The disclosure texts, asserted verbatim on the built pages. */
export const noticeFile = "content/images/notice.json";
