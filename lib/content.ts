/**
 * content.ts — display content for the site, derived from the dangates.co.il live-site audit
 * (דן שערים חשמליים). Business data (NAP, slugs, locations) stays in site-config.ts; this file
 * holds the Hebrew marketing copy and per-section content. Faithful to the live site; no
 * invented facts — the only published price is the technician visit band (`priceRows`).
 */
import { locations, services, siteConfig, type ServiceSlug } from "@/lib/site-config";

/** Lucide icon names used by the service cards. */
export type IconName =
  | "MoveHorizontal"
  | "DoorOpen"
  | "ArrowUpDown"
  | "Car"
  | "DoorClosed"
  | "Blinds"
  | "Building2";

interface ServiceMeta {
  tagline: string;
  /**
   * The page's opening paragraph and the grid card text. It is the only paragraph unique to each
   * service page, so shortening it lowers the doorway delta (content-depth.mjs) — keep its length.
   */
  description: string;
  icon: IconName;
}

/** Per-service display copy, keyed by the slugs in site-config (live services silo). */
const serviceMeta: Record<ServiceSlug, ServiceMeta> = {
  "שערים-נגררים": {
    tagline: "אמינות ועמידות לכל שער",
    description:
      "שערים נגררים מתאימים לבתים פרטיים, לעסקים ולמתחמים תעשייתיים, כשיש לאורך הגדר מקום שהשער יחליק אליו. אנחנו מתקינים ומתקנים אותם: החלפת פס שיניים שנשחק, מעצורי קצה וגלגלים, יישור המסילה והתאמת המנוע למשקל השער ולרוחב הכניסה.",
    icon: "MoveHorizontal",
  },
  "שערי-כנף": {
    tagline: "פתרון אלגנטי וחזק",
    description:
      "שערי כנף נפתחים על צירים, פנימה או החוצה, ומתאימים לבתים פרטיים, למתחמים מסחריים ולמוסדות, כשיש מרחב פתיחה לפני השער. אנחנו מתקינים ומתקנים אותם: כיוון צירים, תיקון כנף כבדה ששוקעת ונגררת על הקרקע, ובחירת מנוע לפי רוחב הכנף ומשקלה.",
    icon: "DoorOpen",
  },
  "שערים-מתרוממים": {
    tagline: "טכנולוגיה מתקדמת ומדויקת",
    description:
      "שער מתרומם עולה כלפי מעלה במקום לנוע הצידה, ולכן מתאים לכניסה צרה שאין בה מקום לגרירה או לפתיחת כנפיים. אנחנו מתקינים ומתקנים שערים מתרוממים: החלפת קפיצים וכבלים, כיוון האיזון, יישור המסילות ותיקון המנוע.",
    icon: "ArrowUpDown",
  },
  "שערים-לחניה": {
    tagline: "שליטה נוחה בכניסה לחניה",
    description:
      "שערים לחניה בבניין משותף או בחניון של עסק — התקנה ותיקון של המנוע, לוח הפיקוד, העיניות ומנורת האזהרה, ושל השלטים שכל הדיירים פותחים בהם את השער.",
    icon: "Car",
  },
  "שער-זרוע": {
    tagline: "מחסומים וזרועות הפעלה",
    description:
      "התקנה ותיקון של שערי זרוע ומחסומים לחניה — אבחון המנוע, קפיץ האיזון, לוח הפיקוד, העיניות והשלטים, וכיוון הזרוע כך שתעצור בגובה ובמיקום הנכונים.",
    icon: "DoorClosed",
  },
  "תריסי-גלילה-חשמליים": {
    tagline: "ביטחון ונוחות לבית ולעסק",
    description:
      "תריסי גלילה חשמליים מופעלים במנוע צינורי שיושב בתוך ציר הגלילה, ונשלטים במתג על הקיר או בשלט. אנחנו מתקינים תריסים חשמליים, ומתקנים ומתחזקים תריסים קיימים: תיקון מנוע שלא מגיב או תריס שנעצר באמצע, החזרת שלבים שיצאו מהמסילה וכיוון נקודות העצירה.",
    icon: "Blinds",
  },
  "שערים-לדירה": {
    tagline: "פתרונות לבנייני מגורים",
    description:
      "שער ודלת הכניסה לבניין מגורים — התקנה ותיקון של הנעילה החשמלית, מחזיר הדלת, הקודן והחיבור לאינטרקום, כדי שהכניסה המשותפת תיפתח לדיירים ותינעל אחריהם.",
    icon: "Building2",
  },
};

export interface ServiceCard {
  slug: ServiceSlug;
  name: string;
  tagline: string;
  description: string;
  icon: IconName;
}

/** Service cards (name from site-config + display copy here), flagship first. */
export const serviceCards: ServiceCard[] = services.map((s) => ({
  slug: s.slug,
  name: s.name,
  ...serviceMeta[s.slug],
}));

/**
 * Per-service "מתי כדאי לפנות אלינו" triggers, keyed on `ServiceSlug`. This is the field the
 * `new-service` skill's `serviceDepth` model calls `triggers` — added here on its own ahead of
 * the rest of that model (Phase 3, `/new-service`) so `app/services/[service]/page.tsx` stops
 * rendering the same four generic bullets on all 7 pages (backlog §3.3) — the bug that put
 * "השער נתקע" on the shutters page, which is not a gate. Specific to each gate type's own
 * moving parts; no claim, no price.
 */
export const serviceTriggers: Record<ServiceSlug, readonly string[]> = {
  "שערים-נגררים": [
    "השער נתקע באמצע המסילה ולא מגיע עד הקצה",
    "הגלגלים חורקים, תקועים במסילה או שחוקים",
    "המנוע לא מגיב לשלט או עוצר באמצע התנועה",
    "המסילה עקומה, שבורה או חסומה בלכלוך, אבנים וענפים",
  ],
  "שערי-כנף": [
    "אחד הצירים חורק, תקוע או משוחרר מהמסגרת",
    "זרוע ההנעה לא דוחפת את הכנף עד הסוף",
    "הבוכנה ההידראולית דולפת שמן או לא חוזרת למקומה",
    "הכנפיים לא נסגרות בסנכרון ונשאר רווח ביניהן",
  ],
  "שערים-מתרוממים": [
    "הקפיצים משוחררים או קרועים והשער נופל מהר מדי",
    "השער לא עולה עד הסוף או נעצר באמצע הדרך",
    "המנוע נאבק להרים את השער או מפסיק לפעול",
    "ניכר חוסר איזון בין צדי השער בזמן התנועה",
  ],
  "שערים-לחניה": [
    "העינית לא מזהה רכב בכניסה והשער לא נסגר",
    "השער לא נפתח בלחיצה על השלט בכניסה לחניה",
    "השער נעצר באמצע התנועה או נסגר לאט מדי",
    "נוצר עיכוב לרכבים בכניסה לחניה בגלל תגובה איטית של המערכת",
  ],
  "שער-זרוע": [
    "הזרוע לא עולה או לא יורדת בלחיצה על השלט",
    "הזרוע נעצרת באמצע התנועה או חוזרת לאחור לבד",
    "המחסום לא נעצר בגובה הנכון או במיקום המדויק",
    "קפיץ האיזון של הזרוע רופף, שבור או מרעיש",
  ],
  "תריסי-גלילה-חשמליים": [
    "התריס לא עולה או לא יורד בלחיצה על המתג",
    "התריס נעצר באמצע התנועה ולא משלים את הפעולה",
    "נשמע רעש חריג בזמן גלילת התריס",
    "השלט לא מגיב או שהתריס מגיב רק לחלק מהפקודות",
  ],
  "שערים-לדירה": [
    "האינטרקום לא פותח את השער בלחיצת הדיירים",
    "המנעול החשמלי לא משתחרר או נשאר נעול אחרי הקוד",
    "השער בכניסה המשותפת נשאר פתוח ולא נסגר אחרי הדיירים",
    "יש עיכוב בין הקשת הקוד לבין פתיחת השער",
  ],
};

/** Why-us differentiators (live homepage "למה לבחור בנו?", 6 items). */
export const differentiators = [
  {
    icon: "Award",
    title: "אבחון לפני תיקון",
    body: "בודקים את המנוע, את לוח הפיקוד, את העיניות, את השלט והמקלט שלו ואת אספקת החשמל. רק אחרי שברור מה התקלה, מסבירים מה העלות.",
  },
  {
    icon: "Timer",
    title: "תיאום מועד מראש",
    body: "מתאמים איתכם מועד להגעה בשעות הפעילות. בשיחה הראשונה מבררים את סוג השער ומה בדיוק קורה לו, כדי שהביקור יתחיל מהמקום הנכון.",
  },
  {
    icon: "ShieldCheck",
    title: "אחריות על העבודה",
    body: "אנחנו נותנים אחריות על העבודה בתיקונים ובהתקנות שביצענו. לפני שמסיימים, בודקים שהשער נפתח ונסגר עד הסוף ועוצר כשהעינית מזהה מכשול.",
  },
  {
    icon: "Users",
    title: "מנגנון אחר לכל סוג שער",
    body: "אנחנו מאבחנים כל שער לפי המנגנון שלו: מסילה וגלגלים בשער נגרר, צירים ובוכנות בשער כנף, קפיצי איזון בשער מתרומם ובשער זרוע, ציר גלילה בתריס.",
  },
  {
    icon: "Wrench",
    // Was "ציוד מתקדם" — an unsourced quality claim. Now the repair-or-replace mechanism that
    // /מחירון/ already states (pricingPageCopy, "motor-reuse"), with no "only"/"never" absolute.
    title: "תיקון לפי החלק שנכשל",
    body: "כשהמנוע הקיים תקין או ניתן לתיקון, משאירים אותו ומטפלים במה שנכשל, למשל בקבל ההנעה או בגלגלי השיניים שבתוכו. כשצריך מנוע חדש, מתאימים אותו לשער ולשימוש, ולא בהכרח לדגם הישן.",
  },
  {
    icon: "Settings2",
    title: "פתרונות מותאמים אישית",
    body: "כל שער מקבל פתרון מותאם אישית — לפי סוג השער, אופן הפתיחה והצרכים שלכם.",
  },
] as const;

/**
 * End-to-end service process — rendered on the homepage (`Process`) AND on all 7 service pages,
 * one of which is the rolling-shutters page. So every step names only what a gate and a shutter
 * share (the mechanism, the motor, the way it is operated, its stop points and safety devices):
 * "השער", "לוח הפיקוד" and "העינית" were false on /services/תריסי-גלילה-חשמליים/ (Sprint 5
 * review). The gate-specific detail lives in each page's own depth entry (content/services/).
 * Steps 2–3 state no pricing policy: "הצעת מחיר שקופה", "מסביר ... מה העלות לפני שמתחילים" and
 * "אתם מחליטים אם להמשיך" are a quote-before-work commitment with no business-facts §D row
 * (claims-verifier, Sprint 5 page review — stop-ship). They say only what the visit does.
 */
export const processSteps = [
  {
    title: "פנייה וייעוץ",
    body: "מתקשרים או משאירים פרטים, מתארים את התקלה או הצורך ומקבלים ייעוץ ראשוני.",
  },
  {
    title: "אבחון והסבר",
    body: "טכנאי מגיע לבדיקה, מאבחן את המנגנון ואת המנוע, ומסביר מה התקלה ומה צריך לתקן.",
  },
  {
    title: "תיאום העבודה",
    body: "מתאמים מועד נוח בשעות הפעילות. תקלה דחופה? אמרו זאת בשיחה, ונבדוק יחד מתי אפשר להגיע.",
  },
  {
    title: "ביצוע העבודה",
    body: "מתקנים את מה שנמצא באבחון, או מתקינים מערכת חדשה: מנוע, אמצעי הפעלה ואמצעי בטיחות שמתאימים לה.",
  },
  {
    title: "בדיקה ואחריות",
    body: "בודקים מקצה לקצה — פתיחה וסגירה מלאות, נקודות העצירה, אמצעי הבטיחות והתגובה לשלט או למתג — ונותנים אחריות על העבודה.",
  },
] as const;

/**
 * Counts taken from the data, for any copy that states one ("7 סוגי שערים", "18 אזורים"). A number
 * in copy is built from these, never typed — adding a service or a location moves it for free.
 */
export const publishedCounts = {
  services: services.length,
  locations: locations.length,
} as const;

/** One cell of the trust bar. `value` may be a template built from `publishedCounts` or `siteConfig`. */
export interface TrustStat {
  value: string;
  label: string;
}

/**
 * Trust stats for the trust bar — each one true from the data or a confirmed fact: the service
 * count from `services`, the hours from the manifest rows behind `siteConfig.hours`, the warranty
 * in the only wording business-facts §D allows, and the diagnose-before-quoting step the process
 * section already states. No experience, availability or coverage claim, and no count of areas.
 */
export const trustStats: readonly TrustStat[] = [
  {
    value: `${publishedCounts.services} סוגי שירות`,
    label: "שערים חשמליים ותריסי גלילה",
  },
  {
    value: "שעות פעילות",
    label: `${siteConfig.hours.weekday} · ${siteConfig.hours.friday}`,
  },
  { value: "אחריות על העבודה", label: "על התיקון ועל ההתקנה" },
  { value: "אבחון לפני מחיר", label: "מסבירים מה העלות לפני שמתחילים" },
];

/**
 * The one price this site publishes: the technician visit and diagnosis band, from the live-site
 * FAQ. The eight per-gate repair and install ranges that used to follow it were authored estimates
 * (business-facts §D ⛔), and real prices are not coming — so they are deleted, and /מחירון/
 * explains what determines the price instead (`pricingPageCopy`, backlog N14). Copy that names
 * the band interpolates `visitFeeRange`; nothing retypes it.
 */
export const priceRows = [
  // 🔶 confirm — business-facts §D: is the 150–350 ₪ visit fee still current
  { service: "ביקור טכנאי ואבחון", from: "150–350 ₪" },
] as const;

/** The visit band, for interpolation — the only number any pricing copy may carry. */
export const visitFeeRange: string = priceRows[0].from;

/** An optional link from a homepage FAQ answer to the page that answers it in full. */
export interface FaqLink {
  /** An existing route, trailing slash. */
  href: string;
  /** Hebrew link text, rendered after the answer — never inside the `a` string. */
  label: string;
}

/** One homepage FAQ item. `q` and `a` feed the `FAQPage`; `moreAt` is visible only. */
export interface HomeFaq {
  q: string;
  a: string;
  moreAt?: FaqLink;
}

/**
 * Homepage FAQ — the site's only `FAQPage` (backlog §3.5, §4.13). Every answer is true per
 * docs/business-facts.md: no availability outside the hours, no response time, no warranty term,
 * no price beyond the visit band. `moreAt` (content-hub contract) points at a route that exists
 * today and answers more fully; `Faq.tsx` renders it after the answer, outside the `a` string, so
 * `faqJsonLd` still receives clean text. No question here appears in lib/posts.ts or elsewhere in
 * this file — one Q/A per `FAQPage` sitewide.
 */
export const faqs: readonly HomeFaq[] = [
  {
    q: "כמה זמן לוקח לתקן שער חשמלי?",
    a: "משך התיקון תלוי בתקלה. ניקוי ויישור של עינית, החלפת סוללה בשלט או קידוד שלט מחדש הם בדרך כלל עבודה קצרה. החלפת לוח פיקוד, קבל הנעה או מנוע לוקחת יותר זמן, ותלויה גם בזמינות החלק המתאים לדגם. תיקון מכני, כמו מסילה עקומה, גלגל שחוק או ציר שבור, תלוי בהיקף הנזק. האבחון מברר איזה מהמקרים האלה הוא שלכם.",
    moreAt: {
      href: "/blog/תקלות-נפוצות-בשערים-חשמליים/",
      label: "על התקלות הנפוצות בשערים חשמליים",
    },
  },
  {
    q: "האם יש אחריות על התיקון?",
    // The warranty term, scope and exclusions are unconfirmed (business-facts §D), so the answer
    // uses the one allowed wording and sends the scope question to the visit — it states no term.
    a: "כן. על תיקונים ועל התקנות שביצענו אנחנו נותנים אחריות על העבודה. לפני שמסיימים בודקים את השער מקצה לקצה: פתיחה וסגירה עד הסוף, תגובה לשלט, ועצירה כשהעינית מזהה מכשול. אם אחרי הביקור השער לא מתנהג כמו שצריך, התקשרו ותארו מה קורה. מה בדיוק כוללת האחריות על העבודה בשער שלכם? שאלו את הטכנאי לפני שהוא מתחיל.",
  },
  {
    q: "מה כוללת תחזוקה שוטפת לשער?",
    a: "תחזוקה שוטפת עוברת על החלקים שנשחקים. מנקים את המסילה מאבנים, מחול ומעלים, ומשמנים את הצירים, את הגלגלים או את הקפיצים, לפי סוג השער. מנקים ומיישרים את העיניות, ובודקים שהשער עוצר כשיש מכשול בדרכו. בודקים גם את המנוע, את לוח הפיקוד ואת החיווט, ואת השלטים והסוללות שלהם. המטרה היא לתפוס שחיקה לפני שהיא מעמיסה על המנוע.",
    moreAt: {
      href: "/blog/תחזוקה-מונעת-לשערים-חשמליים/",
      label: "המדריך לתחזוקה מונעת של שערים חשמליים",
    },
  },
  {
    q: "איך לבחור שער חשמלי חדש?",
    a: "מתחילים מהמקום שיש בכניסה. שער נגרר צריך לאורך הגדר מקום פנוי ברוחב הפתח, כדי שהשער יחליק לצדו. שער כנף צריך שטח פנוי לתנועת הכנפיים, וקרקע שאינה עולה בכיוון הפתיחה. שער מתרומם חוסך מקום בחזית חניה סגורה, ומחסום זרוע מתאים לחניה משותפת עם תנועה רבה. אחר כך משקל השער ורוחבו קובעים איזה מנוע מתאים לו.",
    moreAt: {
      href: "/blog/שערים-חשמליים-השקעה/",
      label: "מה כדאי לדעת לפני התקנת שער חשמלי",
    },
  },
  {
    q: "מה העלות של ביקור טכנאי לבדיקה?",
    // 🔶 confirm — business-facts §D: the band is still current; whether it is credited against
    // the repair is unconfirmed, so it is a question to ask, never a policy.
    a: `עלות ביקור טכנאי לבדיקת שער היא ${visitFeeRange}. בביקור מאבחנים את התקלה, ומחיר התיקון עצמו תלוי בחלק שנכשל, בסוג השער ובעבודה שנדרשת סביבו. את הסכום המדויק של הביקור לשער שלכם, ואם הוא מתקזז ממחיר התיקון, שאלו אותנו בטלפון עוד לפני הביקור.`,
    moreAt: { href: "/מחירון/", label: "מה קובע את המחיר של תיקון שער חשמלי" },
  },
  {
    q: "האם אתם עובדים עם לקוחות פרטיים ועסקיים?",
    a: "כן. אנחנו עובדים עם בעלי בתים פרטיים, ועדי בתים, חברות ניהול ועסקים. כל אחד מהם מגיע עם שער אחר. בבית פרטי זה לרוב שער נגרר או שער כנף בכניסה לחניה. בבניין מגורים זה שער חניה משותף או מחסום, עם שלטים רבים ולעתים אינטרקום. בעסק זה שער שנפתח פעמים רבות ביום, ולכן נשחק מהר יותר.",
    moreAt: {
      href: "/services/שערים-לדירה/",
      label: "שערים חשמליים לבנייני מגורים",
    },
  },
  {
    // What a fitting involves as a job, not a package — what a quote includes is 🔶
    // (business-facts §D "What the price includes / excludes").
    q: "מה כוללת התקנה של שער חדש?",
    a: "התקנה מתחילה במדידה: רוחב הפתח, משקל השער, סוג הקרקע ונקודת החשמל הקרובה. לפי המדידה בוחרים את סוג השער ואת המנוע שמתאים לו. העבודה עצמה כוללת את המסילה או הצירים, את המנוע ואת לוח הפיקוד, את העיניות והשלטים, ואת החיווט שמחבר ביניהם. בסוף מכוונים את נקודות העצירה ובודקים את השער מקצה לקצה.",
  },
  {
    q: "איך ניתן ליצור קשר?",
    a: `בטלפון ${siteConfig.phone}, בוואטסאפ דרך הכפתור באתר, בדוא״ל ${siteConfig.email} או בטופס הפנייה. שעות הפעילות: ${siteConfig.hours.weekday}, ${siteConfig.hours.friday}. כדי שהשיחה תתחיל מהמקום הנכון, ספרו מה סוג השער, מה בדיוק קורה לו ובאיזו עיר הוא נמצא. תמונה או סרטון קצר בוואטסאפ עוזרים להבין את התקלה עוד לפני הביקור.`,
    moreAt: { href: "/צור-קשר/", label: "כל דרכי הפנייה בעמוד צור קשר" },
  },
  {
    q: "האם אתם מציעים שירותי חירום?",
    a: `בשעות הפעילות (${siteConfig.hours.weekday}, ${siteConfig.hours.friday}) מטפלים גם בתקלות דחופות, כמו שער שנתקע פתוח או רכב שנשאר סגור בחניה. התקשרו, ונבדוק יחד מתי אפשר להגיע. עד אז, ברוב השערים יש מנגנון שחרור ידני שמאפשר להזיז את השער ביד. בדקו איך הוא פועל בהוראות היצרן, ואל תפעילו כוח על שער שתקוע במסילה.`,
    moreAt: {
      href: "/blog/שער-חשמלי-לא-מגיב/",
      label: "מה עושים כשהשער החשמלי לא מגיב",
    },
  },
  {
    q: "כמה זמן לוקחת התקנה?",
    a: "זה תלוי בעיקר בשאלה אם השער עצמו כבר קיים. מינוע שער קיים, כלומר הוספת מנוע, לוח פיקוד ועיניות לשער ידני תקין, קצר בהרבה מהתקנת שער חדש, שצריך קודם לייצר או להזמין. גם עבודות הכנה מאריכות את הזמן: יציקת בסיס למנוע, הנחת מסילה, או העברת כבל חשמל ארוך מהבית אל השער.",
  },
];

/**
 * Customer reviews — EMPTY BY DESIGN.
 *
 * This array previously held ten five-star testimonials whose TEXT was authored (the old
 * comment called it "a faithful reconstruction") and attributed to ten REAL named reviewers,
 * shipped as Review + AggregateRating JSON-LD with no public profile to verify them against.
 * Invented words in a named real person's mouth is a Google structured-data policy violation
 * and a consumer-protection exposure. Removed 2026-08-17.
 *
 * TO RESTORE, all three are required — the code enforces it:
 *   1. Paste the REAL review text, quoted verbatim from a public profile.
 *   2. Set REVIEW_SOURCE_URL to that profile.
 *   3. Add the profile to schema.sameAs in the ROSTER manifest, then sync.
 *
 * Reviews render and emit schema ONLY when the array and the source URL are both populated
 * (components/marketing/Reviews.tsx returns null otherwise). NEVER author review text.
 * See docs/business-facts.md §A.
 */
export interface Review {
  /** Reviewer name, exactly as it appears on the public profile. */
  name: string;
  /** City or context shown under the name. */
  role: string;
  /** 1–5, as given on the profile. Never rounded up. */
  rating: number;
  /** Verbatim review text. Never paraphrased, never authored. */
  text: string;
}

export const reviews: readonly Review[] = [];

/**
 * Public URL the reviews above are quoted from (the Google Business Profile).
 * `null` means nothing may be rendered or marked up — this is the gate, not a formality.
 */
export const REVIEW_SOURCE_URL: string | null = null;

export const REVIEW_COUNT = reviews.length;

/** Derived from the ratings above — never hand-set. `null` when there are no reviews. */
export const REVIEW_AVG: string | null =
  REVIEW_COUNT > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / REVIEW_COUNT).toFixed(1)
    : null;

/** About-page core values (live-site audit "למה לבחור בנו?" / values, 6 items). */
export const aboutValues = [
  {
    // Was "מצוינות" / "שואפים למצוינות בכל היבט של העבודה" — an unsourced quality claim
    // (content-standards §6). Now what the visit actually delivers: the fault named, and the upkeep
    // the blog's maintenance posts describe.
    title: "הסבר על התקלה",
    body: "אחרי האבחון מסבירים מה נכשל ולמה, ומה אפשר לעשות כדי שהשער יחזיק מעמד: ניקוי העיניות, שימון המסילה או הצירים והחלפת סוללה בשלט.",
  },
  {
    title: "גם אחרי הביקור",
    // Was an absolute workmanship promise ("…עד שהשער עובד בדיוק כמו שצריך"), unsourced
    // (business-facts §D). Now only the step the original offered — call and describe — with no
    // outcome promised, and without restating the end-of-visit check aboutIntro already describes.
    body: "אם אחרי הביקור השער לא נפתח, לא נסגר או לא מגיב לשלט כמו שצריך, התקשרו אלינו ותארו מה קורה.",
  },
  {
    title: "יושרה ושקיפות",
    body: "מחיר הוגן והצעה שקופה מראש, בלי הפתעות ובלי עבודות מיותרות.",
  },
  {
    title: "אבחון לפי המנגנון",
    body: "בכל סוג שער התקלות מגיעות ממקום אחר: גלגלים ומסילה בשער נגרר, צירים ובוכנה בשער כנף, קפיצים בשער מתרומם. מאבחנים לפי המנגנון, לא לפי ניחוש.",
  },
  {
    title: "שירות אישי",
    body: "פתרון מותאם אישית לכל לקוח, לפי סוג השער והצרכים שלו.",
  },
  {
    title: "תיקונים עמידים ואיכותיים",
    body: "עבודה יסודית בחלקים איכותיים, לתיקונים שמחזיקים לאורך זמן.",
  },
] as const;

/** About-page narrative sections (live-site "אודות"). */
export const aboutSections = [
  {
    title: "החזון והמשימה",
    body: "אנחנו מאמינים ששירות איכותי מתחיל בהבנה מעמיקה של צורכי הלקוח. המשימה שלנו היא להעניק לכל לקוח פתרון שמתאים לשער ולשימוש שלו, עם דגש על בטיחות ואמינות.",
  },
  {
    title: "תחומי ההתמחות",
    body: "מטפלים בשערים נגררים, בשערי כנף, בשערים מתרוממים, בשערי זרוע ומחסומי חניה ובתריסי גלילה חשמליים. אנחנו עובדים עם לקוחות פרטיים, ועדי בתים, עסקים, מפעלים וארגונים מוסדיים.",
  },
  {
    title: "המחויבות ללקוחות",
    body: "אנחנו לא רק מתקינים ומתקנים שערים — אנחנו מחויבים להעניק לכם ביטחון ושקט נפשי. כל שירות שאנחנו מספקים מכוון לשיפור הבטיחות, השימושיות והאסתטיקה של השערים שלכם.",
  },
] as const;

/** Header / footer navigation (live Hebrew URLs). */
export const navItems = [
  { label: "השירותים שלנו", href: "/שירותים/" },
  { label: "אזורי שירות", href: "/איזורי-שירות/" },
  { label: "מחירון", href: "/מחירון/" },
  { label: "בלוג", href: "/blog/" },
  { label: "אודות", href: "/אודות/" },
  { label: "צור קשר", href: "/צור-קשר/" },
] as const;

/** components/layout/Header.tsx + MobileMenu.tsx — landmark and control labels (wording unchanged). */
export const headerCopy = {
  homeLabel: "דף הבית",
  navLabel: "ראשי",
  mobileNavLabel: "ראשי נייד",
  openMenu: "פתיחת תפריט",
  closeMenu: "סגירת תפריט",
  callNow: "חייגו עכשיו:",
} as const;

/** app/layout.tsx — the skip link, first focusable element on every page; targets <main id="main">. */
export const skipLinkLabel = "דלג לתוכן הראשי";

// ── Route & component copy (moved out of JSX per backlog N13) ──────────────
// Verbatim from the route files and the three marketing components named in the sprint row —
// wording is unchanged; only the location has moved. Sprint 4 is where any of this gets rewritten.

/** Shared breadcrumb labels — a route file never types a crumb label directly. */
export const crumbLabels = {
  home: "בית",
  services: "השירותים שלנו",
  areas: "אזורי שירות",
  blog: "בלוג",
  about: "אודות",
  contact: "צור קשר",
} as const;

/** Legal-page names — the `WebPage` name in their graph and their own title / crumb / H1. */
export const legalPageNames = {
  privacy: "מדיניות פרטיות",
  accessibility: "הצהרת נגישות",
} as const;

/**
 * app/הצהרת-נגישות/page.tsx — <meta name="description"> (backlog §2.4). Names only what that
 * page lists under "מה הונגש באתר" and its contact paragraph; no compliance claim beyond it.
 * Read by the metadata of that route (a11yDescription in app/הצהרת-נגישות/page.tsx).
 */
export const accessibilityMetaDescription =
  "הצהרת הנגישות של אתר דן שערים חשמליים: מה הונגש באתר — ניווט במקלדת, ניגודיות, טקסט חלופי וקוראי מסך — ואיך פונים אלינו אם נתקלתם בקושי.";

/**
 * app/blog/page.tsx — <meta name="description"> (backlog §2.4). Lists the subjects the 11 posts
 * actually cover. Read by the metadata of the blog index (blogDescription in app/blog/page.tsx).
 */
export const blogIndexMetaDescription =
  "מדריכים מעשיים על שערים חשמליים: תקלות נפוצות ומה בודקים לבד, תחזוקה מונעת, בטיחות, שדרוג לשער חכם, ומתי לתקן שער קיים ומתי להחליף אותו.";

/** One post's SEO overrides — see `postSeo`. */
export interface PostSeo {
  /** The <title> subject. The layout template appends the brand, so ≤ 41 chars keeps it ≤ 60. */
  title?: string;
  /** Replaces `Post.excerpt` as the meta description; 120–160 chars, terminal punctuation. */
  description?: string;
}

/**
 * app/blog/[slug]/page.tsx — per-post SEO title and description, keyed by `Post.slug` (backlog
 * §2.4–§2.6). `Post.title` stays the H1 and is never shortened here: it is the question in full,
 * and the live registers quote one of them. A post absent from this map, or a field absent from
 * its entry, keeps `post.title` / `post.excerpt`. `Post.excerpt` still feeds the blog index card.
 * Every title is unique sitewide; no speed, availability, coverage, warranty or price promise.
 * Read by `generateMetadata` (title, description, openGraph) in app/blog/[slug]/page.tsx, which
 * also throws at module load on a key that is not a post slug.
 */
export const postSeo: Readonly<Record<string, PostSeo>> = {
  "שערים-חשמליים-השקעה": {
    title: "האם שער חשמלי הוא השקעה משתלמת?",
    description:
      "האם שער חשמלי משתלם? מה הוא נותן לבית ולעסק באבטחה ובנוחות, מה כדאי לדעת לפני ההתקנה, ומתי נכון לתקן שער קיים ומתי לשדרג אותו.",
  },
  "תקלות-נפוצות-בשערים-חשמליים": {
    title: "תקלות נפוצות בשער חשמלי ומה בודקים לבד",
  },
  "שדרוג-לשער-חשמלי-חכם": {
    title: "האם כדאי לשדרג לשער חשמלי חכם?",
    description:
      "מה ההבדל בין שער חשמלי רגיל לשער חכם, למי השדרוג מתאים, האם הוא משתלם ומה לבדוק לפני שבוחרים מערכת — עם שאלות שכדאי לשאול לפני ההחלטה.",
  },
  "בטיחות-שער-חשמלי-3-שלבים": {
    title: "בטיחות שער חשמלי ב-3 שלבים פשוטים",
  },
  "שער-חשמלי-חוסך-זמן": {
    description:
      "האם שער חשמלי באמת חוסך זמן? מה הוא חוסך בכל כניסה ויציאה, מה הוא דורש בתחזוקה ובתיקונים, ואיך שומרים על השער יעיל לאורך זמן.",
  },
  "תחזוקה-מונעת-לשערים-חשמליים": {
    description:
      "תחזוקה מונעת לשער חשמלי, שלב אחר שלב: מה לבדוק בבדיקה התקופתית, איך לנקות ולשמן, איך בודקים את העיניות, ומה משתנה בין שער מתכת לשער עץ.",
  },
  "חשיבות-תחזוקת-שערים-חשמליים": {
    description:
      "למה תחזוקה שוטפת מאריכה את חיי השער החשמלי: ניקוי, שימון, בדיקת מערכת החשמל, מתי להזמין טכנאי ואיך תחזוקה נכונה משפרת את הבטיחות.",
  },
  "החלפה-או-תיקון-שער-חשמלי": {
    title: "שער חשמלי: לתקן או להחליף?",
  },
  "שער-חשמלי-לא-מגיב": {
    title: "שער חשמלי לא מגיב? מה בודקים קודם",
  },
  "שער-חשמלי-שעובד-כמו-חדש": {
    title: "איך שומרים על שער חשמלי כמו חדש?",
    description:
      "איך שומרים על שער חשמלי במצב טוב לאורך שנים: ניקוי המסילות, שימון החלקים הנעים, בדיקת מערכת החשמל, ומה עושים כשהשער רועש או נעצר באמצע.",
  },
};

/** app/איזורי-שירות/page.tsx — the visible link label for one city, and its `ItemList` name. */
export function areaLinkLabel(cityName: string): string {
  return `שערים חשמליים ב${cityName}`;
}

/** Shared WhatsApp click-to-chat opener, used wherever no service name is interpolated in. */
export const defaultWhatsappMessage =
  "היי, אני מעוניין/ת בהצעת מחיר לתיקון/התקנת שער חשמלי";

/** Per-service WhatsApp opener (service page sticky CTA card). */
export function serviceWhatsappMessage(serviceName: string): string {
  return `היי, אני מעוניין/ת בהצעת מחיר ל${serviceName}`;
}

/** Shared lead-form card heading ("קבלו הצעת מחיר חינם" — Hero.tsx and /צור-קשר/). */
export const leadFormHeading = "קבלו הצעת מחיר חינם";

/** components/marketing/Hero.tsx — homepage hero copy. */
export const heroCopy = {
  // The eyebrow and the points name the diagnosis rather than "מחיר לפני העבודה" — a wording
  // choice, not a gate: business-facts has no row on explaining the cost before work starts, and
  // the lead keeps that clause because it is content-standards §4's reference line.
  eyebrow: "תיקון · תחזוקה · התקנה · מרכז הארץ",
  h1: "דן שערים חשמליים – תיקון והתקנה מקצועית",
  lead: "השער נתקע או לא נסגר עד הסוף? טכנאי מגיע לאבחון, בודק את המנוע, את לוח הפיקוד ואת העיניות, ומסביר מה התקלה ומה העלות לפני שמתחילים — עם אחריות על העבודה.",
  points: ["אבחון לפני תיקון", "אחריות על העבודה", "תיאום מועד בשעות הפעילות"],
  callLabel: "חייגו עכשיו:",
  whatsappLabel: "וואטסאפ",
  formSubtitle: "השאירו פרטים ונחזור אליכם עם פתרון — ללא התחייבות.",
} as const;

/**
 * components/marketing/FinalCta.tsx — sitewide closing CTA copy. It closes the rolling-shutters
 * page too, so the headline names both (it said "השער תקוע" there — Sprint 5 review). "ייעוץ
 * והצעת מחיר שקופה — ללא התחייבות" left the body: a no-obligation / quote policy with no
 * business-facts §D row, and so did "מסבירים מה העלות לפני שמתחילים" (a quote-before-work
 * commitment, same missing row — claims-verifier, Sprint 5 page review). "אחריות על העבודה" is
 * the allowed warranty wording.
 */
export const finalCtaCopy = {
  title: "שער או תריס חשמלי לא עובד כמו שצריך? דברו איתנו ונתאם ביקור.",
  body: `מאבחנים את התקלה, מסבירים מה נמצא ונותנים אחריות על העבודה. שעות הפעילות: ${siteConfig.hours.weekday}, ${siteConfig.hours.friday}.`,
  callLabel: "חייגו עכשיו:",
  whatsappLabel: "שלחו וואטסאפ",
} as const;

/** components/marketing/ServiceAreas.tsx — homepage service-area teaser copy. */
export const serviceAreasCopy = {
  eyebrow: "אזורי שירות",
  title: "נותנים שירות במרכז הארץ ובאזורים שברשימה",
  subtitle:
    "לא בטוחים שאתם בטווח? התקשרו בשעות הפעילות, ספרו לנו איפה השער ומה התקלה, ונבדוק יחד אם ומתי אפשר להגיע.",
} as const;

/** app/page.tsx — homepage <meta name="description">. */
export const homeMetaDescription = `תיקון והתקנת שערים חשמליים לבתים, ועדי בתים ועסקים — שערים נגררים, כנף, מתרוממים ותריסי גלילה. אבחון במקום לפני כל תיקון ואחריות על העבודה. חייגו ${siteConfig.phone}.`;

/** app/page.tsx — the homepage FAQ section heading. */
export const homeFaqHeading = {
  eyebrow: "שאלות נפוצות",
  title: "מידע חשוב לפני תיקון שער חשמלי",
} as const;

/** app/services/[service]/page.tsx — static section copy shared by all 7 service pages. */
export const servicePageCopy = {
  triggersHeading: "מתי כדאי לפנות אלינו?",
  // Question form (content-standards §4); the steps under it are `processSteps`.
  processHeading: "מה קורה מהפנייה ועד סוף העבודה?",
  // Was "ביקור, אבחון והצעה שקופה — ללא התחייבות." — a no-obligation policy with no
  // business-facts §D row; a cost-before-work clause has no row either (see processSteps).
  ctaSubtitle: "ביקור טכנאי ואבחון של התקלה.",
  whatsappLabel: "וואטסאפ",
} as const;

/**
 * app/services/[service]/page.tsx — the UI labels for the sections `serviceDepth` fills
 * (lib/service-depth.ts). Headings and link frames only; the per-service text itself lives in
 * content/services/<slug>.ts. A section whose data is empty renders nothing, so none of these
 * shows on a page until its depth entry is written.
 */
export const serviceDepthCopy = {
  /** Caveats: when this gate type is the wrong answer, what shortens motor life. */
  caveatsHeading: "מה כדאי לדעת לפני שמחליטים?",
  relatedServicesHeading: "שירותים קשורים",
  // Every service's list holds cities only — never קריות, שרון, צפון, דרום or באר שבע, whose
  // coverage is unconfirmed (business-facts §E) — so the heading may ask about cities. Question
  // form (content-standards §4), and it promises nothing beyond the published location pages.
  locationsHeading: "מחפשים שירות בעיר שלכם?",
  relatedPostsHeading: "מאמרים קשורים",
  /** Visible heading of the per-service FAQ; the questions themselves are `ServiceDepth.faqs`. */
  faqHeading: (serviceName: string): string => `שאלות נפוצות על ${serviceName}`,
  /** Stable name for the per-service FAQ's exclusive <details> group. */
  faqGroupName: "service-faq",
} as const;

/**
 * The technician-visit line on a service page: the band from `visitFeeRange` is rendered between
 * `before` and `after` as an LTR island, then `linkLabel` links to /מחירון/. 🔶 confirm —
 * business-facts §D: the band is still current. It is a visit-and-diagnosis fee only, so the
 * line states no repair price and does not say whether the fee is credited against the repair.
 */
export const serviceVisitBandCopy = {
  before: (serviceName: string): string => `ביקור טכנאי ואבחון ל${serviceName} עולה `,
  after: ". מחיר התיקון עצמו תלוי בחלק שנכשל ובעבודה שנדרשת סביבו. ",
  /** The no-number form, for a service the band does not cover: no price, only what drives it. */
  withoutBand: "מחיר התיקון תלוי בחלק שנכשל ובעבודה שנדרשת סביבו. ",
  linkLabel: "מה קובע את המחיר בעמוד המחירון",
  href: "/מחירון/",
} as const;

/**
 * Whether the published visit band covers a service. Its source is the live-site FAQ on a gate
 * visit ("עלות ביקור טכנאי לבדיקת שער"), so the six gate pages may print it. No source covers a
 * shutter visit, so that page shows `serviceVisitBandCopy.withoutBand` instead.
 * 🔶 confirm — business-facts §D: does the visit band also cover a rolling-shutter visit? Until
 * the owner answers, the shutters entry stays `false`. A total record, so a new service must decide.
 */
export const serviceVisitBandApplies: Record<ServiceSlug, boolean> = {
  "שערים-נגררים": true,
  "שערי-כנף": true,
  "שערים-מתרוממים": true,
  "שערים-לחניה": true,
  "שער-זרוע": true,
  "תריסי-גלילה-חשמליים": false,
  "שערים-לדירה": true,
};

/** app/services/[service]/page.tsx — the sticky CTA card title, per service. */
export function serviceCtaCardTitle(serviceName: string): string {
  return `רוצים הצעת מחיר ל${serviceName}?`;
}

/** app/locations/[city]/page.tsx — <title> / meta description, per city. */
export function locationPageTitle(cityName: string): string {
  return `תיקון שערים חשמליים ב${cityName}`;
}

export function locationMetaDescription(cityName: string): string {
  // Names what the diagnosis checks instead of "מחיר לפני העבודה" — a wording choice for the
  // character budget, not a gate (business-facts has no row on it; see heroCopy).
  return `תיקון והתקנת שערים חשמליים ב${cityName} — אבחון המנוע, לוח הפיקוד והעיניות, ואחריות על העבודה. שערים נגררים, שערי כנף, מתרוממים, חניה, זרוע ותריסי גלילה.`;
}

/**
 * app/locations/[city]/page.tsx — the service named in every location H1, and the `serviceType`
 * of that page's `Service` node (lib/jsonld.ts). One string, so the schema cannot drift from the H1.
 */
export const locationServiceType = "תיקון והתקנת שערים חשמליים";

/** app/locations/[city]/page.tsx — PageHeader title / subtitle, per city. */
export function locationHeroTitle(cityName: string): string {
  return `${locationServiceType} ב${cityName}`;
}

export function locationHeroSubtitle(cityName: string): string {
  return `שירות מקצועי לתיקון והתקנת שערים חשמליים ב${cityName} והסביבה — אבחון התקלה במקום, הסבר על העלות לפני שמתחילים ואחריות על העבודה.`;
}

/** app/locations/[city]/page.tsx — the two intro paragraphs, per city. */
export function locationIntroParagraph1(cityName: string): string {
  return `מחפשים תיקון או התקנה של שער חשמלי ב${cityName}? ב${siteConfig.name} מטפלים בשערים נגררים, בשערי כנף, בשערים מתרוממים, בשערים לחניה, בשערי זרוע, במחסומים ובתריסי גלילה חשמליים. כשמזמינים תיקון, כל ביקור מתחיל באבחון לפי סדר: חשמל, שלט ומקלט, עיניות ולוח פיקוד, ואז המנוע והמכניקה.`;
}

export function locationIntroParagraph2(cityName: string): string {
  return `אנחנו נותנים שירות ללקוחות פרטיים, ועדי בתים ועסקים ב${cityName} והסביבה, ומתאמים איתם מועד בשעות הפעילות. השער תקוע, לא נסגר או שהמנוע לא מגיב? התקשרו, תארו את התקלה, ונבדוק יחד מתי אפשר להגיע לבדיקה ולתיקון.`;
}

export function locationServicesHeading(cityName: string): string {
  return `השירותים שלנו ב${cityName}`;
}

/** app/אודות/page.tsx — metadata + copy. */
export const aboutMetaDescription =
  "דן שערים חשמליים — תיקון, תחזוקה והתקנה של שערים חשמליים ותריסי גלילה. אבחון המנוע, לוח הפיקוד והעיניות לפני כל תיקון, ואחריות על העבודה.";

export const aboutHeroTitle = "אודות דן שערים חשמליים";
export const aboutHeroSubtitle =
  "תיקון והתקנת שערים חשמליים — פתרון מותאם אישית לכל שער, עם דגש על איכות, מקצועיות ובטיחות.";

export const aboutIntro = `ברוכים הבאים ל${siteConfig.name} — תיקון, תחזוקה והתקנה של שערים חשמליים ותריסי גלילה חשמליים. כל ביקור מתחיל באבחון: בודקים את המנוע, את לוח הפיקוד, את העיניות, את השלט והמקלט שלו, את המסילות או הצירים ואת אספקת החשמל. רק אחרי שברור מה התקלה, מסבירים מה העלות ומתחילים בעבודה. בסיום בודקים את השער מקצה לקצה — פתיחה, סגירה ועצירה כשהעינית מזהה מכשול — ונותנים אחריות על העבודה.`;

export const aboutValuesHeading = "הערכים שלנו";

/**
 * app/אודות/page.tsx — `knowsAbout` on the business node of that page's graph (lib/jsonld.ts).
 * Only subjects this site actually covers: the seven service names, then three generic subjects.
 * No credential, no licence, no standard-compliance claim.
 */
export const aboutKnowsAbout: readonly string[] = [
  ...services.map((s) => s.name),
  "תיקון שערים חשמליים",
  "מנועי שערים",
  "בטיחות שערים חשמליים",
];

/** app/שירותים/page.tsx — metadata + copy. */
export const servicesIndexMetaDescription =
  "שירותי תיקון והתקנת שערים חשמליים: שערים נגררים, שערי כנף, שערים מתרוממים, שערים לחניה, שער זרוע, תריסי גלילה חשמליים ושערים לדירה — עם אחריות על העבודה.";

export const servicesIndexHeroTitle = "השירותים שלנו";
export const servicesIndexHeroSubtitle =
  "מטפלים בשערים נגררים, בשערי כנף, בשערים מתרוממים, בשערים לחניה, בשערי זרוע, בשערים לבנייני מגורים ובתריסי גלילה. מתקנים תקלות ומנועים ומתקינים שערים חדשים, עם אבחון לפני תיקון ואחריות על העבודה.";

/** app/צור-קשר/page.tsx — metadata + copy. */
export const contactMetaDescription =
  "צרו קשר עם דן שערים חשמליים לתיקון והתקנת שערים חשמליים במרכז הארץ. טלפון, וואטסאפ או טופס — נחזור אליכם בשעות הפעילות עם ייעוץ והצעת מחיר.";

export const contactHeroTitle = "צור קשר";
export const contactHeroSubtitle =
  "ייעוץ ראשוני בטלפון ללא התחייבות. אבחון במקום בתיאום מראש, ולפני שמתחילים מסבירים מה העלות.";

/**
 * The visible service-area line (Footer, /צור-קשר/) — copy, so it lives here, not in site-config.
 * Deliberately NOT the manifest `schema.areaServed` phrase: its national-coverage half is
 * unconfirmed (business-facts §E; the roster value is owner item B5), and so is whether the
 * regional pages are served. It names מרכז הארץ and points at the published location pages —
 * nothing wider, no count. The JSON-LD never read it: `businessNode` builds `areaServed` from
 * `locations`.
 */
export const serviceAreaLine = "מרכז הארץ והאזורים שמופיעים באתר";

export const contactPageCopy = {
  detailsHeading: "פרטי התקשרות",
  whatsappLabel: "וואטסאפ",
  /** The label above `serviceAreaLine` — a label only, so it promises no coverage. */
  areaLine: "אזור השירות",
  /**
   * The line under the opening hours (was `siteConfig.hours.emergency`) — copy, not a schedule.
   * It promises no availability outside the hours above it (business-facts §E, owner-actions 3.5).
   */
  emergencyLine: "תקלה דחופה? התקשרו ונבדוק יחד מתי אפשר להגיע.",
  formSubtitle: "השאירו פרטים ונחזור אליכם בשעות הפעילות.",
} as const;

/**
 * app/איזורי-שירות/page.tsx — <meta name="description">, title and PageHeader subtitle.
 * Names מרכז הארץ and the published list, never a wider coverage or availability promise
 * (business-facts §E — the manifest `areaServed` phrase is a roster question).
 */
export const areasPageCopy = {
  title: "אזורי שירות",
  metaDescription:
    "תיקון והתקנת שערים חשמליים במרכז הארץ ובאזורים שברשימה. בחרו את העיר או האזור שלכם, ותאמו איתנו ביקור לאבחון בשעות הפעילות.",
  subtitle:
    "נותנים שירות במרכז הארץ ובאזורים שברשימה למטה. בחרו את העיר או האזור שלכם, או התקשרו ונבדוק יחד אם ומתי אפשר להגיע.",
} as const;

/** components/marketing/ServicesGrid.tsx — homepage services section heading. */
export const servicesGridCopy = {
  eyebrow: "השירותים שלנו",
  title: "תיקון והתקנת שערים חשמליים",
  // "אחריות על העבודה" is already in the TrustBar, WhyUs and the /שירותים/ hero — not repeated here.
  // No list of the services either: the cards right below name all of them, and on /שירותים/ the
  // hero subtitle already lists them. The count's noun ("סוגי שירות") matches trustStats.
  subtitle: `${publishedCounts.services} סוגי שירות, בהתקנה ובתיקון, ולכל אחד מהם עמוד משלו. בחרו את השירות שמתאים לכם.`,
  moreLabel: "למידע נוסף",
} as const;

/** components/layout/Footer.tsx — the tagline paragraph in the bottom strip. */
export const footerCopy = {
  tagline: "תיקון, תחזוקה והתקנה של שערים חשמליים ותריסי גלילה חשמליים",
} as const;

/** components/layout/MobileCtaBar.tsx — the two sticky labels (the WhatsApp opener is `defaultWhatsappMessage`). */
export const mobileCtaCopy = {
  callLabel: "חייגו עכשיו",
  whatsappLabel: "וואטסאפ",
} as const;

/**
 * components/forms/LeadForm.tsx — the delivery-failure fallback (backlog N1, §8.6). Shown when
 * the Web3Forms POST fails or the WhatsApp popup is blocked; the details were not lost, so the
 * copy points straight at the two direct channels instead of asking the visitor to try again
 * blind. No claim, no promised response time.
 */
export const leadFormErrorCopy = {
  heading: "לא הצלחנו לשלוח את הפנייה כרגע",
  body: "הפרטים שהזנתם לא אבדו — אפשר לפנות ישירות בוואטסאפ או בטלפון, או לנסות לשלוח שוב.",
  whatsappLabel: "שליחה בוואטסאפ",
  callLabel: "התקשרו עכשיו",
  retryLabel: "נסו לשלוח שוב",
} as const;

/**
 * components/forms/LeadForm.tsx — the inline success state, shown only when the redirect to
 * `thanksPath` is blocked. Replaces the heading and line typed in its JSX, whose "בהקדם" and
 * "מענה מיידי" were a response-time promise no business-facts row confirms (§E). It says when we
 * call back from the manifest hours behind `siteConfig.hours`, as `contactPageCopy.formSubtitle`
 * does, and points at the phone without implying it is answered at every hour.
 */
export const leadFormSuccessCopy = {
  heading: "תודה! קיבלנו את הפנייה",
  body: `נחזור אליכם למספר שהשארתם בשעות הפעילות: ${siteConfig.hours.weekday}, ${siteConfig.hours.friday}. אפשר גם להתקשר אלינו ישירות.`,
} as const;

/**
 * components/forms/LeadForm.tsx — per-field validation messages (backlog §8.1) and the optional
 * city field (§8.4). Each message names the field and says what to do; none promises anything.
 */
export const leadFormValidationCopy = {
  nameRequired: "נא למלא את השם",
  phoneRequired: "נא למלא מספר טלפון, כדי שנוכל לחזור אליכם",
  phoneInvalid: "המספר לא נראה תקין. כתבו מספר ישראלי, למשל 050-1234567 או 03-1234567",
  citySelect: "העיר או האזור (אופציונלי)",
  cityPlaceholder: "בחירת עיר או אזור…",
  /** The last option — for a visitor outside the 18 published locations (ux-cro-security §2.2 row 5). */
  cityOther: "אחר",
} as const;

/**
 * components/forms/LeadForm.tsx — the fragments the form assembles into the WhatsApp fallback
 * message and the Web3Forms email. Each is a label followed by the visitor's own value.
 */
export const leadFormMessageCopy = {
  greeting: "שלום, אני",
  service: "מעוניין/ת ב:",
  city: "אזור:",
  phone: "טלפון לחזרה:",
  notSpecified: "לא צוין",
  emailSubject: "פנייה חדשה מהאתר —",
} as const;

/** The privacy route — the consent line links it, and its own page uses it as the path. */
export const privacyPath = "/מדיניות-פרטיות/";

/**
 * components/forms/LeadForm.tsx — the one-line notice under the submit button (backlog §8.2,
 * ux-cro-security §2.2 row 4). A notice, not a checkbox. It says only what the code does:
 * the fields go by email to the business inbox through Web3Forms, and the callback goes to the
 * number the visitor typed (a call or a WhatsApp message both reach it). The standard's fourth
 * element, "not used for mailing", is an owner policy no business-facts row confirms, so it is
 * left out until one does — as is any "only" assurance about later use.
 * Rendered as `text`, then `moreLead`, then a link to `privacyPath` reading `linkLabel`.
 */
export const leadFormConsentCopy = {
  text: "שליחת הטופס מעבירה את הפרטים אלינו בדוא״ל, דרך שירות הטפסים Web3Forms. הם משמשים כדי לחזור אליכם למספר שהשארתם, בנוגע לפנייה.",
  moreLead: "פרטים נוספים",
  linkLabel: "במדיניות הפרטיות",
} as const;

/**
 * app/תודה/page.tsx — the thank-you route a confirmed lead lands on (backlog §8.3).
 *
 * No response time, no availability, no coverage claim — nothing from docs/business-facts.md that
 * is unconfirmed. The next step is the photo bridge (ux-cro-security §1.2): a picture of the gate
 * or the לוח פיקוד sent on WhatsApp, which is claim-free and helps the call that follows.
 */
export const thanksPath = "/תודה/";

export const thanksPageCopy = {
  /** <title> — the root template appends the brand, so it is not repeated here. */
  metaTitle: "תודה, הפנייה התקבלה",
  metaDescription:
    "הפנייה שלכם לדן שערים חשמליים התקבלה. אפשר להוסיף לה תמונה של השער בוואטסאפ, להתקשר אלינו ישירות, או לעבור על השירותים שלנו לתיקון ולהתקנה.",
  h1: "תודה, הפנייה שלכם התקבלה",
  lead: "הפרטים הגיעו אלינו בדוא״ל. נחזור אליכם למספר הטלפון שהשארתם.",
  nextHeading: "רוצים להוסיף פרטים?",
  nextBody:
    "תמונה או סרטון קצר של השער, של המנוע או של לוח הפיקוד עוזרים לנו להבין את התקלה עוד לפני השיחה. אפשר לשלוח אותם בוואטסאפ, או להתקשר אלינו ישירות.",
  callLabel: "התקשרו אלינו",
  whatsappLabel: "שליחת תמונה בוואטסאפ",
  whatsappMessage: "היי, השארתי פנייה באתר. מצרף/ת תמונה של השער והתקלה:",
  servicesLabel: "לכל השירותים שלנו",
} as const;

/**
 * app/מדיניות-פרטיות/page.tsx — the privacy policy (backlog §8.2; data-tracking-infrastructure §6;
 * ux-cro-security §4.5; business-facts §I). Every sentence describes what the code does today:
 *
 *  - the form: `LeadForm` posts name, phone, the optional service, city and message, and the page
 *    path, to Web3Forms, which emails them to `siteConfig.email`;
 *  - measurement: the GTM loader in app/layout.tsx; the dataLayer pushes carry `form`, `page`,
 *    `site`, `placement`, the service and city slugs and a failure `reason` — never the text fields
 *    (docs/event-taxonomy.md) — plus the live card's `surface_view` / `surface_dismiss`;
 *  - the live-kit (public/assets/live.js, lib/live/head-script.mjs): one read of
 *    https://imgquarry.com/status/fleet.json with `credentials: "omit"`, and four storage values.
 *
 * Deliberately absent, because nothing proves them: a retention period, a claim of compliance
 * with any named law, a response time for a privacy request. The phone and email come from
 * `siteConfig` in the route, never typed here. The policy names Google Tag Manager, which the
 * manifest's `analytics.gtmId` proves loads. It does not name Google Analytics: the manifest's
 * `ga4MeasurementId` is null and whether GA4 resolves for this hostname inside the shared
 * container is the open "GA4 measurement ID" row in docs/business-facts.md. Name it once that
 * row is confirmed. Equally unconfirmed owner policies — "only" for a stated use, no mailing, no
 * sale of leads, access / correction / deletion on request — are left out until a row covers them.
 */
export interface PrivacyListItem {
  /** A Latin key or name — the route isolates it with dir="ltr". */
  label: string;
  text: string;
}

export interface PrivacySection {
  heading: string;
  paragraphs: readonly string[];
  list?: readonly PrivacyListItem[];
  /** A paragraph after the list. */
  after?: string;
}

export const privacyPageCopy = {
  metaDescription:
    "מה קורה לפרטים שאתם משאירים באתר דן שערים חשמליים: מה הטופס שולח ולמי, מה נמדד בכלי Google, מה נשמר בדפדפן, ואיך פונים אלינו בנושא פרטיות.",
  intro:
    "בעמוד הזה מוסבר אילו פרטים מגיעים אלינו כשאתם משתמשים באתר, דרך אילו שירותים הם עוברים, ולשם מה. הוא מתאר את מה שהאתר עושה בפועל.",
  updatedLabel: "עודכן לאחרונה:",
  sections: [
    {
      heading: "מה נשלח כשאתם ממלאים את טופס הפנייה?",
      paragraphs: [
        "הטופס שולח אלינו את השם ואת מספר הטלפון שמילאתם. אם בחרתם שירות או עיר מהרשימה, או כתבתם פרטים על התקלה, גם הם נשלחים.",
        "בנוסף נשלחת כתובת העמוד באתר שממנו שלחתם את הטופס, כדי שנדע על איזה שירות או אזור מדובר.",
        "את הפרטים מעביר אלינו שירות חיצוני לשליחת טפסים, Web3Forms. השירות שולח אותם כהודעת דוא״ל לתיבת הדואר של העסק.",
        "הפרטים משמשים אותנו כדי לחזור אליכם בנוגע לפנייה.",
        "אם השליחה נכשלת, הטופס מציע לשלוח את אותם פרטים בוואטסאפ. ההודעה נפתחת באפליקציה שלכם, ויוצאת רק אם תלחצו בעצמכם על שליחה.",
      ],
    },
    {
      heading: "מה קורה כשאתם מתקשרים או שולחים הודעה בוואטסאפ?",
      paragraphs: [
        "שיחה או הודעה מגיעות אלינו ישירות, עם המספר שממנו פניתם ועם מה שכתבתם או אמרתם. הודעת וואטסאפ עוברת דרך השירות של וואטסאפ עצמה.",
        "גם הפרטים האלה משמשים אותנו כדי לטפל בפנייה שלכם.",
      ],
    },
    {
      heading: "מה נמדד באתר, ובאילו כלים?",
      paragraphs: [
        "בכל עמוד באתר נטען כלי של Google לניהול קוד מדידה, Google Tag Manager. דרכו נמדדים צפיות בעמודים ואירועים באתר.",
        "המדידה כוללת צפיות בעמודים, לחיצות על כפתורי החיוג והוואטסאפ, ואירועים של הטופס: שהתחלתם למלא אותו, שניסיתם לשלוח, ושהשליחה הצליחה או נכשלה.",
        "עם אירועי הטופס נשלחים רק העמוד, שם האתר, מיקום הטופס בעמוד, השירות והעיר שבחרתם מהרשימה, ואם השליחה נכשלה — גם הסיבה הטכנית לכישלון.",
        "האתר לא מעביר לכלי המדידה את השם, את מספר הטלפון או את הטקסט שכתבתם בטופס.",
        "אם הוצג לכם כרטיס עונתי, נמדד גם שהוא הוצג ואיך נסגר.",
        "כלי Google עשויים לשמור בדפדפן קובצי עוגיות, כדי להבחין בין ביקור לביקור. אפשר לחסום או למחוק אותם בהגדרות הדפדפן.",
      ],
    },
    {
      heading: "מה האתר בודק ושומר בדפדפן שלכם?",
      paragraphs: [
        "לפעמים מוצג בראש העמוד פס הודעות קצר, ולפעמים כרטיס עונתי. כדי להחליט אם להציג אותם, כל עמוד קורא קובץ מצב קטן מהכתובת imgquarry.com/status/fleet.json.",
        "הקובץ אומר רק אם להציג את ההודעות כרגיל, לצמצם אותן או להשתיק אותן. שום דבר ממנו לא מוצג לכם כטקסט.",
        "הבקשה לקובץ נשלחת בלי קובצי עוגיות ובלי שום פרט מהטופס. כמו בכל בקשה באינטרנט, השרת רואה את כתובת הרשת של המכשיר.",
        "בנוסף נשמרים בדפדפן שלכם ארבעה ערכים קטנים. הם לא נשלחים לשום מקום ואינם כוללים פרטים אישיים:",
      ],
      list: [
        {
          label: "ls-status",
          text: "התשובה של קובץ המצב, כשהיא שונה מהרגיל, יחד עם מועד תפוגה. כך העמוד הבא מציג מיד את ההודעות הנכונות. הערך תקף עד 30 דקות, או עד המועד שנקבע בקובץ אם הוא מוקדם יותר. אחרי קריאה שנכשלה הוא תקף 5 דקות, והוא נמחק כשהמצב חוזר לרגיל.",
        },
        {
          label: "ls-dlg-*",
          text: "מתי הוצג לכם כרטיס עונתי. במקום הכוכבית מופיע שם הכרטיס. כך אותו כרטיס לא מוצג לכם שוב במשך 14 יום.",
        },
        {
          label: "ls-pv",
          text: "כמה עמודים פתחתם בביקור הנוכחי, כדי לקבוע מתי אפשר להציג כרטיס. הערך נמחק כשסוגרים את הלשונית.",
        },
        {
          label: "ls-t",
          text: "ערך בדיקה שנכתב ונמחק מיד, רק כדי לבדוק שהדפדפן מאפשר לשמור. אם הוא לא מאפשר, הכרטיס לא מוצג בכלל.",
        },
      ],
      after: "אפשר למחוק את כל הערכים האלה בהגדרות הדפדפן, דרך מחיקת הנתונים של האתר.",
    },
  ] satisfies readonly PrivacySection[],
  request: {
    heading: "איך פונים אלינו בנושא פרטיות?",
    body: "לשאלה או לבקשה בנוגע לפרטים שמסרתם, פנו אלינו:",
    phoneLabel: "בטלפון",
    emailLabel: "בדוא״ל",
  },
} as const;

/** components/marketing/PricingTeaser.tsx — the call / WhatsApp pair beside the quote button (§8.5). */
export const pricingCtaCopy = {
  callLabel: "התקשרו לקבלת הצעה",
  whatsappLabel: "שלחו הודעה בוואטסאפ",
} as const;

// ── Sprint 4B: the pricing pivot, the homepage answer and mechanism, the transparency surface ──
// Copy only — the route and component wiring renders these exports (no JSX here). Every number is
// the visit band from `visitFeeRange`; every contact detail comes from `siteConfig`.

/**
 * components/marketing/PricingTeaser.tsx — on / and /מחירון/ (backlog N14). Replaces the
 * "ranges for reference" copy hardcoded in the component: the table now holds the visit band
 * only, so the copy says what the repair price depends on and links to /מחירון/. `more` is for
 * the homepage; on /מחירון/ itself it would link the page to itself.
 */
export const pricingTeaserCopy = {
  eyebrow: "מחירון",
  // The title answers what the table shows, so it does not re-ask the pricing question that the
  // Diagnosis section (on /) and the answer block (on /מחירון/) ask above it. The band is in the
  // table row only (`priceRows`), never retyped here — /מחירון/ shows it at most twice.
  title: "איזה מחיר ידוע עוד לפני הביקור?",
  // What the repair price depends on is said once per page: by faqs[4] on / and by the answer
  // block on /מחירון/ — so the subtitle answers the title and nothing else.
  subtitle: "רק עלות ביקור הטכנאי והאבחון, שמופיעה בטבלה.",
  tableCaption: "עלות ביקור טכנאי ואבחון",
  serviceHeader: "שירות",
  priceHeader: "מחיר",
  note: "* לסכום המדויק לשער שלכם, התקשרו אלינו בשעות הפעילות.",
  quoteLabel: "בקשו הצעת מחיר לשער שלכם",
  more: { href: "/מחירון/", label: "מה קובע את המחיר — בעמוד המחירון" },
} as const;

/** One "what drives the price" section on /מחירון/: a question-form H2, prose, an optional list. */
export interface PriceDriver {
  /** A stable Latin id for the section anchor. */
  id: string;
  heading: string;
  paragraphs: readonly string[];
  /** Rendered as a bulleted list after the paragraphs. */
  items?: readonly string[];
  /** A paragraph after the list. */
  after?: string;
}

/**
 * app/מחירון/page.tsx — the page becomes "what determines the price" (backlog N14, §3.13;
 * keyword-map §10; eeat-and-trust §5.1). Render order: `h1` → `answer` (heading + text, directly
 * under the H1) → each of `drivers` → `quoteTips` → the PricingTeaser (the visit band and the
 * CTAs) → `footnote`. Each driver says WHY it moves the price, with no ₪ figure: real per-job
 * prices are ❌ not coming (business-facts §D), and the visit band is 🔶 still current. Whether the
 * visit fee is credited against the repair is 🔶 — written as a question to ask, never a policy.
 * No `Offer` schema (backlog §4.10).
 */
export const pricingPageCopy = {
  /** <title> — keyword-map §3 pricing formula; the layout template appends the brand. */
  metaTitle: "מחירון תיקון שערים חשמליים",
  metaDescription: `מה קובע את מחיר תיקון שער חשמלי: סוג התקלה, משקל השער ורוחבו, סוג המנוע, מינוע שער קיים וחיווט. ביקור טכנאי ואבחון ${visitFeeRange}, ומחיר התיקון נקבע באבחון במקום.`,
  /** keyword-map §4 pricing H1 — also the `WebPage` name and the crumb's page. */
  h1: "מחירון תיקון והתקנת שערים חשמליים",
  crumbLabel: "מחירון",
  subtitle:
    "בהמשך העמוד מוסבר מה מזיז את המחיר של תיקון שער ולמה, ומה כדאי לספר לנו בטלפון כדי שנבין מראש איזו עבודה צפויה.",
  answer: {
    heading: "כמה עולה תיקון שער חשמלי, ומה קובע את המחיר?",
    text: `מחיר תיקון שער חשמלי נקבע באבחון במקום: ביקור טכנאי ואבחון עולה ${visitFeeRange}, ומחיר התיקון עצמו תלוי בחלק שנכשל. אותו סימן יכול לנבוע מסוללה בשלט, מעינית, מלוח הפיקוד או מהמנוע. את המחיר מזיזים גם משקל השער ורוחבו, סוג המנוע, האפשרות להשאיר את המנוע הקיים, והגישה והחיווט.`,
  },
  drivers: [
    {
      id: "fault",
      heading: "למה סוג התקלה משנה את המחיר יותר מכל דבר אחר?",
      paragraphs: [
        "כל רכיב בשער הוא עבודה אחרת, עם חלק אחר וזמן עבודה אחר. לכן השאלה הראשונה היא לא איזה שער יש לכם, אלא מה בדיוק נכשל בו.",
      ],
      items: [
        "מנוע — החלק היקר במערכת. לפעמים התקלה היא רק קבל ההנעה או גלגלי השיניים שבתוכו, ואז מתקנים בלי להחליף את המנוע כולו.",
        "לוח פיקוד — הכרטיס האלקטרוני שמנהל את המנוע, את העיניות ואת השלטים. כרטיס שנשרף בנחשול מתח מוחלף, והגדרה שזזה מתוקנת בכיוון.",
        "עיניות — לרוב ניקוי ויישור, ולעתים החלפת זוג עיניות או חיווט שנפגע. זו בדרך כלל עבודה קטנה יחסית.",
        "שלט ומקלט — סוללה, קידוד מחדש או שלט חדש. כשכל השלטים מפסיקים לעבוד יחד, הבעיה עשויה להיות במקלט, וזו עבודה אחרת.",
        "מסילה — בשער נגרר, מסילה עקומה או שקועה מעמיסה על המנוע. יישור של קטע קצר שונה מהחלפת המסילה לכל אורך השער.",
        "צירים — בשער כנף, ציר שחוק או משוחרר גורם לכנף לשקוע ולהתחכך. החלפת ציר כוללת לפעמים גם ריתוך במסגרת.",
        "ספק כוח — שנאי או ספק שנכשלו משביתים את כל המערכת, גם כשהמנוע והכרטיס תקינים. החלק קטן, אבל צריך לאתר אותו נכון.",
      ],
      after:
        "תקלה אחת יכולה להסתיר אחרת. מסילה תקועה מאלצת את המנוע לעבוד קשה מדי, ומנוע חדש על אותה מסילה יישחק גם הוא.",
    },
    {
      id: "weight-width",
      heading: "איך משקל השער ורוחבו משפיעים על המחיר?",
      paragraphs: [
        "שער כבד ורחב צריך מנוע חזק יותר, מסילה וגלגלים שנושאים את המשקל, וצירים עבים יותר. כל אחד מהחלקים האלה עולה יותר בגרסה הכבדה.",
        "גם העבודה עצמה משתנה. פירוק והרכבה של כנף כבדה דורשים יותר ידיים וזמן, ושער כנף כפול מופעל בדרך כלל בשני מנועים ובשתי זרועות.",
        "לכן כדאי לדעת כבר בשיחה הראשונה מה רוחב הפתח בערך, ומה חומר השער: ברזל מלא, פרופילים או אלומיניום.",
      ],
    },
    {
      id: "motor-class",
      heading: "למה סוג המנוע משנה את המחיר?",
      paragraphs: [
        "מנועים נבדלים בכוח, בעומס העבודה שהם בנויים לו ובמנגנון ההנעה. מנוע לשער של בית פרטי, שנפתח כמה פעמים ביום, שונה ממנוע לשער חניה של בניין או של עסק.",
        "בשער כנף יש מנועי זרוע, מנועים הידראוליים עם בוכנה ומנועים תת־קרקעיים. בשער נגרר המנוע מניע את השער דרך פס שיניים. לכל סוג חלקי חילוף אחרים, במחיר ובזמינות שונים.",
        "כשמחליפים מנוע, מתאימים אותו לשער ולשימוש, ולא בהכרח לדגם הישן. מנוע חלש מדי לשער כבד יישחק מהר ויחזור להיתקע.",
      ],
    },
    {
      id: "motor-reuse",
      heading: "אפשר להשאיר את המנוע הקיים, או שצריך מנוע חדש?",
      paragraphs: [
        "כשהמנוע הקיים תקין או ניתן לתיקון, משאירים אותו ומטפלים רק במה שנכשל. זה בדרך כלל הכיוון החסכוני יותר, אבל לא תמיד הנכון.",
        "מנוע חדש נדרש כשהמנוע נשרף, כשחלקי החילוף שלו כבר לא זמינים, או כשהוא חלש מדי לשער. תיקון של מנוע שלא מתאים לשער רק דוחה את התקלה הבאה.",
        "מינוע שער קיים, כלומר הוספת מנוע לשער ידני, הוא מקרה אחר: שם המחיר תלוי במצב השער עצמו. שער שתקוע במסילה או שוקע על הציר צריך תיקון מכני לפני שמחברים אליו מנוע.",
      ],
    },
    {
      id: "access-cabling",
      heading: "למה הגישה לשער והחיווט משפיעים על המחיר?",
      paragraphs: [
        "מנוע צריך חשמל, ולוח הפיקוד צריך חיבור לעיניות, לשלטים ולפעמים לאינטרקום. כשנקודת החשמל רחוקה מהשער, צריך להעביר כבל, לפעמים בחפירה מתחת לשביל או לאספלט.",
        "בבית עם חצר ארוכה, במגרש במושב או בחניה תת־קרקעית של בניין, מעבר הכבל יכול להיות חלק משמעותי מהעבודה. גם גישה קשה למנוע, מאחורי צמחייה, בתוך קיר או בבור, מאריכה את העבודה.",
        "שווה לספר בשיחה איפה נמצא השקע או לוח החשמל הקרוב לשער, והאם כבר יש צנרת לכבלים.",
      ],
    },
    {
      // 🔶 confirm — business-facts §D: "Is the 150–350 ₪ visit fee still current" and "Is the
      // visit fee waived on repair". The band interpolates; the credit is a question, not a policy.
      // When and how a repair quote is given before work starts is not confirmed either — it is
      // written as a question to ask, never as a stated practice. Restore the original credit
      // question as the heading only once §D answers it.
      id: "visit-fee",
      heading: "מה כולל ביקור הטכנאי, ומה כדאי לשאול לפני שקובעים אותו?",
      // The band itself is in the answer block above and in the PricingTeaser table below, so this
      // section does not repeat it (the page carries it twice, both from `visitFeeRange`/`priceRows`).
      paragraphs: [
        "בביקור בודקים את השער לפי סדר: חשמל, שלט ומקלט, עיניות, לוח פיקוד, מנוע ומכניקה, עד שמגיעים למקור התקלה.",
        "לפני שקובעים את הביקור, כדאי לשאול אותנו בטלפון שלוש שאלות:",
      ],
      items: [
        "מה הסכום המדויק של הביקור לשער שלכם.",
        "האם עלות הביקור מתקזזת ממחיר התיקון, אם מחליטים לתקן.",
        "איך ומתי מקבלים את הצעת המחיר לתיקון.",
      ],
      after: "כך התשובות ברורות עוד לפני שהטכנאי מגיע.",
    },
    {
      id: "found-on-opening",
      heading: "מה יכול להתגלות רק כשפותחים את המנוע?",
      paragraphs: [
        "חלק מהתקלות נראות רק בפירוק: גלגל שיניים שחוק בתוך המנוע, חיווט שאכלו מכרסמים, או חלודה בבסיס שמתחת לכיסוי. ממצא כזה יכול לשנות את היקף העבודה.",
        "כדי שלא תהיה הפתעה, סכמו איתנו לפני התיקון מה עושים אם מתגלה בפירוק תקלה נוספת.",
      ],
    },
  ] satisfies readonly PriceDriver[],
  quoteTips: {
    heading: "איך מקבלים הערכה קרובה יותר כבר בטלפון?",
    intro:
      "ככל שנדע יותר לפני הביקור, כך יהיה ברור יותר איזו עבודה צפויה ואילו חלקים כדאי להביא. ספרו לנו:",
    items: [
      "סוג השער: נגרר, כנף אחת או שתיים, מתרומם, מחסום זרוע או תריס גלילה.",
      "מה בדיוק קורה: לא נפתח, נעצר באמצע, לא נסגר עד הסוף, מרעיש או לא מגיב לשלט.",
      "מתי זה התחיל: אחרי הפסקת חשמל, אחרי סערה, אחרי מכה מרכב, או בהדרגה.",
      "האם יש סימן חיים: נורית שנדלקת במקלט, צפצוף, או זמזום מהמנוע בלי תנועה.",
      "רוחב הפתח בערך, וממה השער עשוי.",
      "הדגם והיצרן, אם הם כתובים על המנוע או על לוח הפיקוד.",
      "תמונה או סרטון קצר בוואטסאפ: השער בתנועה, המנוע ולוח הפיקוד מבחוץ, בלי לפתוח מכסים שיש מתחתם חשמל.",
    ],
    after:
      "גם עם כל הפרטים, את המחיר הסופי אפשר לדעת רק אחרי שהטכנאי רואה את השער. השיחה עוזרת להבין מראש אם מדובר בכיוון, בהחלפת חלק או בעבודה גדולה יותר.",
    whatsappMessage:
      "היי, אני רוצה לברר מחיר לתיקון שער חשמלי. מצרף/ת תמונה של השער ותיאור של התקלה:",
  },
  footnote: "מחיר כל תיקון או התקנה תלוי בגורמים שתוארו בעמוד, ומתברר באבחון.",
} as const;

/**
 * app/page.tsx — the homepage answer block (backlog §6.2, content-standards §5), rendered as the
 * first paragraph directly under the H1. What the business does, for whom, where (מרכז הארץ and
 * the published areas — no wider region promised, business-facts §E) and how to reach it.
 */
export const homeAnswerBlock = `ב${siteConfig.name} מתקנים, מתחזקים ומתקינים שערים חשמליים ותריסי גלילה חשמליים: שערים נגררים, שערי כנף, שערים מתרוממים, שערים לחניה, שערי זרוע ומחסומים. אנחנו עובדים עם בעלי בתים, ועדי בתים, חברות ניהול ועסקים, במרכז הארץ ובאזורים שברשימת אזורי השירות באתר. אפשר להתקשר בטלפון ${siteConfig.phone}, לשלוח הודעה דרך כפתור הוואטסאפ באתר או להשאיר פרטים בטופס.`;

/** A titled short paragraph — one diagnosis step on the homepage, one topic on /צור-קשר/. */
export interface TitledText {
  title: string;
  body: string;
}

/**
 * app/page.tsx — the homepage section on how a fault is diagnosed and how the price is formed
 * (backlog §3.13, §6.2). Page-unique: none of it repeats `differentiators`, `processSteps`, a
 * service card or `pricingPageCopy` verbatim. Render: eyebrow + `heading` → `intro` → `checks` as
 * an ordered list → `priceHeading` (H3) → `priceParagraphs` → a link to `link.href`.
 */
export const homeDiagnosisCopy = {
  eyebrow: "אבחון ומחיר",
  heading: "איך מאבחנים תקלה בשער חשמלי, ואיך נקבע המחיר?",
  intro:
    "אותו סימן יכול להגיע מכמה מקומות שונים. שער שלא נסגר עד הסוף יכול לנבוע מעינית מלוכלכת, מגלגל תקוע, מהגדרה בלוח הפיקוד או ממנוע שמאבד כוח. לכן האבחון עובר על המערכת לפי סדר, מהפשוט אל המורכב: מאספקת החשמל והשלט, דרך העיניות ולוח הפיקוד, ועד המנוע והמכניקה. כך מאתרים את הרכיב שגורם לתקלה, ולא רק את הסימן שלה.",
  checks: [
    {
      title: "אספקת החשמל",
      body: "בודקים שהחשמל מגיע ללוח הפיקוד: המפסק, הנתיך והחיבורים. שער שלא מגיב בכלל נבדק קודם כאן, כי בלי מתח אף רכיב אחר לא יפעל.",
    },
    {
      title: "השלט והמקלט",
      body: "בודקים את הסוללה בשלט ואת הקידוד שלו מול המקלט. כשרק שלט אחד לא עובד והשאר כן, התקלה כמעט תמיד בשלט עצמו ולא בשער.",
    },
    {
      title: "העיניות",
      body: "עינית מלוכלכת, מוסטת או מסונוורת משמש נמוכה מזהה מכשול שלא קיים, ועוצרת את הסגירה. ניקוי ויישור פותרים חלק גדול מהמקרים של שער שלא נסגר.",
    },
    {
      title: "לוח הפיקוד",
      body: "בודקים את ההגדרות, כמו נקודות העצירה, כוח המנוע וזמן הסגירה האוטומטית, ואת הכרטיס עצמו. נחשול מתח או ברק יכולים לשרוף רכיב בכרטיס, ואז השער נראה כאילו המנוע מת.",
    },
    {
      title: "המנוע",
      body: "מקשיבים למנוע ובודקים אם הוא מזמזם בלי לזוז, מתחמם או מאבד כוח באמצע התנועה. לפעמים האשם הוא קבל ההנעה, חלק קטן שמחליפים בלי להחליף את המנוע.",
    },
    {
      title: "המכניקה",
      body: "בודקים את המסילה והגלגלים, את הצירים ואת קפיצי האיזון. כל גרירה מכנית מעמיסה על המנוע, ולכן מתקנים אותה לפני שמחליטים שהמנוע הוא הבעיה.",
    },
  ] satisfies readonly TitledText[],
  // The visit band and the "what the repair price depends on" line live in `pricingTeaserCopy`,
  // which renders directly after this section on / — so this closing says only what the teaser
  // does not, and carries no number.
  priceHeading: "למה אין מחיר אחד לשער שלא נפתח?",
  priceParagraphs: [
    "החלפת עינית, החלפת לוח פיקוד והחלפת מנוע הן שלוש עבודות שונות, עם חלק אחר וזמן עבודה אחר. לכן מחיר התיקון נקבע רק אחרי האבחון, כשכבר ברור מה נכשל.",
  ],
  link: { href: "/מחירון/", label: "כל מה שקובע את המחיר, בעמוד המחירון" },
} as const;

/**
 * app/צור-קשר/page.tsx — the transparency surface (backlog N15; eeat-and-trust §5.1). How to raise
 * a complaint, cancel or move a visit, or ask about an invoice, through the channels that already
 * exist — phone, WhatsApp and email, rendered from `siteConfig` / `telHref` / `whatsappHref` beside
 * each label. No response-time promise, no fee or refund policy, no legal citation. Render as a
 * section with `id={contactTransparencyCopy.id}` so the footer link lands on it.
 */
export const contactTransparencyCopy = {
  id: "complaints",
  heading: "איך מגישים תלונה, מבטלים ביקור או שואלים על חשבונית?",
  intro:
    "פניות כאלה עוברות באותם ערוצים שבהם פונים אלינו לתיקון: טלפון, וואטסאפ ודוא״ל. כתבו או אמרו בתחילת הפנייה במה מדובר, כדי שנדע לאן לשייך אותה.",
  topics: [
    {
      title: "תלונה על עבודה שבוצעה",
      body: "ספרו מה בוצע, מתי ובאיזו כתובת, ומה לדעתכם לא תקין. תמונה או סרטון של השער עוזרים להבין מה קורה.",
    },
    {
      title: "ביטול ביקור או שינוי המועד",
      body: "התקשרו או כתבו בוואטסאפ, וציינו את השם ואת המועד שתיאמנו. כדאי להודיע מוקדם ככל האפשר, כדי שאפשר יהיה לתאם מועד אחר.",
    },
    {
      title: "שאלה על חשבונית או על תשלום",
      body: "כתבו בדוא״ל את השם, את תאריך העבודה ואת השאלה. אם יש בידיכם את החשבונית או את הקבלה, צרפו אותה.",
    },
  ] satisfies readonly TitledText[],
  channelsLead: "אפשר לפנות בכל אחד מהערוצים:",
  phoneLabel: "טלפון",
  whatsappLabel: "וואטסאפ",
  emailLabel: "דוא״ל",
  hoursLine: `שעות הפעילות: ${siteConfig.hours.weekday}, ${siteConfig.hours.friday}. הודעה בוואטסאפ או בדוא״ל אפשר לשלוח גם מחוץ לשעות האלה.`,
  whatsappMessage: "היי, יש לי פנייה בנוגע לביקור או לעבודה שבוצעה:",
  // 🔶 confirm ח.פ. — business-facts: the legal entity name and its ח״פ / ע״מ number would go here,
  // as a line under `hoursLine`, once the owner supplies them. Nothing renders until then.
} as const;

/** components/layout/Footer.tsx — the one-line link to the transparency block on /צור-קשר/. */
export const footerTransparencyLink = {
  label: "תלונות, ביטולים ושאלות על חשבונית",
  href: `/צור-קשר/#${contactTransparencyCopy.id}`,
} as const;
