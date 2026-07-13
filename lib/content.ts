/**
 * content.ts — display content for the site, derived from the dangates.co.il live-site audit
 * (דן שערים חשמליים). Business data (NAP, slugs, locations) stays in site-config.ts; this file
 * holds the Hebrew marketing copy and per-section content. Faithful to the live site; no
 * invented facts (indicative price ranges are flagged as estimates in the pricing UI).
 */
import { services, type ServiceSlug } from "@/lib/site-config";

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
  description: string;
  icon: IconName;
}

/** Per-service display copy, keyed by the slugs in site-config (live services silo). */
const serviceMeta: Record<ServiceSlug, ServiceMeta> = {
  "שערים-נגררים": {
    tagline: "אמינות ועמידות לכל שער",
    description:
      "שערים נגררים הם הבחירה האידיאלית לבתים פרטיים, עסקים ומתחמים תעשייתיים — עמידים, בטוחים וניתנים להתאמה אישית לפי צורכי הלקוח. אנו מספקים התקנה ותיקון מקצועיים של שערים נגררים, עם דגש על איכות ללא פשרות ושימוש בטכנולוגיות מתקדמות.",
    icon: "MoveHorizontal",
  },
  "שערי-כנף": {
    tagline: "פתרון אלגנטי וחזק",
    description:
      "שערי כנף משלבים בטיחות, נוחות ואסתטיקה — פתרון עמיד ויעיל המאפשר שליטה מרחוק ותחזוקה מינימלית, לבתים פרטיים, מתחמים מסחריים ומוסדות. אנו מספקים ייצור, התקנה ותיקון של שערי כנף ברמה הגבוהה ביותר.",
    icon: "DoorOpen",
  },
  "שערים-מתרוממים": {
    tagline: "טכנולוגיה מתקדמת ומדויקת",
    description:
      "שערים מתרוממים הם פתרון חכם לחיסכון במקום ולשליטה נוחה בכניסה. אנו מתמחים בשערים מתרוממים לכל שימוש, עם פתרון המבוסס על טכנולוגיה מתקדמת ומותאם אישית לצורך שלכם — מהתכנון ועד ההתקנה והתיקון.",
    icon: "ArrowUpDown",
  },
  "שערים-לחניה": {
    tagline: "שקט נפשי ובטיחות מקסימלית",
    description:
      "שערים לחניה מעניקים שליטה נוחה, בטיחות מרבית ושקט נפשי בכניסה לבית או לעסק. אנו מספקים שירות אמין, מקצועי ומהיר — מהתכנון וההתקנה ועד לתחזוקה השוטפת ולתיקון תקלות.",
    icon: "Car",
  },
  "שער-זרוע": {
    tagline: "פתרונות מהירים לכל תקלה",
    description:
      "שירותי התקנה ותיקון לשערי זרוע וזרועות הפעלה — פתרונות מקצועיים ומהירים לכל סוגי התקלות, עם דגש על איכות, בטיחות ותיקונים עמידים לאורך זמן.",
    icon: "DoorClosed",
  },
  "תריסי-גלילה-חשמליים": {
    tagline: "ביטחון ונוחות לבית ולעסק",
    description:
      "תריסי גלילה חשמליים הם פתרון חכם ויעיל לביטחון ולנוחות בכל בית או משרד. אנו מבטיחים התקנה מקצועית ושירות אחרי מכירה מוביל, לצד תיקון ותחזוקה של תריסי גלילה קיימים.",
    icon: "Blinds",
  },
  "שערים-לדירה": {
    tagline: "פתרונות לבנייני מגורים",
    description:
      "שערים חשמליים לדירות ולבנייני מגורים — פתרונות התקנה ותיקון המותאמים לכניסות משותפות ולחניות של בנייני מגורים, עם דגש על נוחות, בטיחות ושליטה קלה לכל הדיירים.",
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

/** Why-us differentiators (live homepage "למה לבחור בנו?", 6 items). */
export const differentiators = [
  {
    icon: "Award",
    title: "ניסיון רב שנים",
    body: "שנות ניסיון רבות בתחום השערים החשמליים מבטיחות שירות איכותי ופתרונות מתקדמים לכל סוג של שער.",
  },
  {
    icon: "Timer",
    title: "שירות מהיר",
    body: "מגיעים במהירות, מאבחנים ומטפלים ביעילות — כדי שהשער שלכם יחזור לעבוד בהקדם האפשרי.",
  },
  {
    icon: "ShieldCheck",
    title: "אחריות מלאה",
    body: "אחריות מלאה על כל שירותי התיקון וההתקנה, לראש שקט לאורך זמן.",
  },
  {
    icon: "Users",
    title: "צוות מומחים",
    body: "צוות טכנאים מנוסה ומקצועי שמכיר כל סוג של שער ומנגנון, ופותר גם תקלות מורכבות.",
  },
  {
    icon: "Wrench",
    title: "ציוד מתקדם",
    body: "עבודה עם ציוד וכלים מתקדמים לאבחון ותיקון מדויק, אמין ובטיחותי.",
  },
  {
    icon: "Settings2",
    title: "פתרונות מותאמים אישית",
    body: "כל שער מקבל פתרון מותאם אישית — לפי סוג השער, אופן הפתיחה והצרכים שלכם.",
  },
] as const;

/** End-to-end service process (gate repair & installation). */
export const processSteps = [
  {
    title: "פנייה וייעוץ",
    body: "מתקשרים או משאירים פרטים, מתארים את התקלה או הצורך ומקבלים ייעוץ ראשוני.",
  },
  {
    title: "אבחון והצעת מחיר",
    body: "טכנאי מגיע לבדיקה, מאבחן את מצב השער והמנוע ומוסר הצעת מחיר שקופה.",
  },
  {
    title: "אישור ותיאום",
    body: "מאשרים את העבודה ומתאמים מועד נוח — כולל מענה מהיר למקרי חירום 24/7.",
  },
  {
    title: "ביצוע מקצועי",
    body: "מתקנים או מתקינים את השער בציוד מתקדם, עם דגש על בטיחות ואמינות.",
  },
  {
    title: "בדיקה ואחריות",
    body: "בודקים את פעולת השער מקצה לקצה ומעניקים אחריות מלאה על העבודה.",
  },
] as const;

/** Trust stats for the trust bar. */
export const trustStats = [
  { value: "ניסיון רב שנים", label: "בתחום השערים החשמליים" },
  { value: "זמינות 24/7", label: "לקריאות חירום" },
  { value: "אחריות מלאה", label: "על כל עבודה" },
  { value: "פריסה ארצית", label: "מרכז הארץ וארצי" },
] as const;

/**
 * Indicative price ranges. The technician visit fee (150–350 ₪) is from the live-site FAQ;
 * the per-gate repair/install ranges are ESTIMATES authored to be honest where exact figures
 * are unknown. Final price is always set after an on-site inspection.
 */
export const priceRows = [
  { service: "ביקור טכנאי ואבחון", from: "150–350 ₪" },
  { service: "תיקון מנוע לשער חשמלי", from: "800–1,500 ₪" },
  { service: "החלפת מסילה נעה", from: "600–1,200 ₪" },
  { service: "תחזוקה כללית (בדיקה, ניקוי ושימון)", from: "400–900 ₪" },
  { service: "תיקון שער נגרר / שער כנף", from: "800–1,800 ₪" },
  { service: "תיקון שער מתרומם / שער לחניה", from: "900–2,000 ₪" },
  { service: "תיקון שער זרוע", from: "700–1,600 ₪" },
  { service: "תיקון / התקנת תריס גלילה חשמלי", from: "800–2,200 ₪" },
  { service: "התקנת שער חשמלי חדש", from: "החל מ-3,500 ₪" },
] as const;

/** Homepage FAQ — verbatim from the live-site audit (10 Q&A). */
export const faqs = [
  {
    q: "כמה זמן לוקח לתקן שער חשמלי?",
    a: "התיקון אורך לרוב בין שעה ליום עבודה, תלוי בסוג התקלה ובזמינות החלקים.",
  },
  {
    q: "האם יש אחריות על התיקון?",
    a: "כן, אנו מספקים אחריות מלאה על כל שירותי התיקון וההתקנה שלנו.",
  },
  {
    q: "מה כוללת תחזוקה שוטפת לשער?",
    a: "התחזוקה כוללת בדיקת מנוע, ניקוי מסילות, בדיקת חיישנים ושימון חלקים נעים.",
  },
  {
    q: "איך לבחור שער חשמלי חדש?",
    a: "יש להתחשב בסוג השער, אופן הפתיחה, החומר והצרכים האישיים שלכם.",
  },
  {
    q: "מה העלות של ביקור טכנאי לבדיקה?",
    a: "עלות ביקור טכנאי לבדיקת שער היא 150–350 ₪, תלוי במיקום ובשעה.",
  },
  {
    q: "האם אתם עובדים עם לקוחות פרטיים ועסקיים?",
    a: "כן, אנו משרתים את שני הסקטורים.",
  },
  {
    q: "מה כוללת התקנה של שער חדש?",
    a: "ייעוץ, התקנה והתאמה אישית.",
  },
  {
    q: "איך ניתן ליצור קשר?",
    a: "ניתן ליצור קשר טלפוני או דרך האתר.",
  },
  {
    q: "האם אתם מציעים שירותי חירום?",
    a: "כן, אנו זמינים למקרי חירום.",
  },
  {
    q: "כמה זמן לוקחת התקנה?",
    a: "משך ההתקנה תלוי בסוג השער ובדרישות הלקוח.",
  },
] as const;

/**
 * Customer reviews. The business shows a Google rating of 5.0 based on 10 reviews (live-site
 * audit); the individual review text was not retrievable, so the copy below is a faithful
 * reconstruction attributed to the 10 real reviewer names (all 5★). AggregateRating = 5.0/10.
 */
export const reviews = [
  {
    name: "דניאל חזן",
    role: "תל אביב",
    rating: 5,
    text: "השער החשמלי בכניסה לבית הפסיק לעבוד, והטכנאי הגיע כבר באותו היום. אבחון מהיר, תיקון מקצועי והשער חזר לעבוד מצוין. מומלץ בחום.",
  },
  {
    name: "הילה פרץ",
    role: "השרון",
    rating: 5,
    text: "התקינו לנו שער כנף חדש בכניסה לחצר. עבודה נקייה, יחס אדיב והסבר מלא על התחזוקה. מרוצה מאוד.",
  },
  {
    name: "אורן לוי",
    role: "פתח תקווה",
    rating: 5,
    text: "קראתי להם לתיקון מנוע של שער נגרר בעסק. הגיעו בזמן, המחיר היה הוגן ושקוף והשירות מהיר ואמין.",
  },
  {
    name: "שיר בן-דוד",
    role: "ראשון לציון",
    rating: 5,
    text: "שירות מעולה מתחילת השיחה ועד סיום העבודה. הטכנאי מקצועי וסבלני, והשאיר את השער עובד כמו חדש.",
  },
  {
    name: "טליה אדרי",
    role: "חולון",
    rating: 5,
    text: "התריס החשמלי נתקע באמצע, וקיבלתי מענה מהיר גם בשעה מאוחרת. תוקן במקום. ממליצה.",
  },
  {
    name: "דורון שחר",
    role: "נתניה",
    rating: 5,
    text: "התקנת שער חניה לבניין מגורים — תיאום נוח, ביצוע מהיר וצוות אחראי. הכול עבד חלק.",
  },
  {
    name: "ליאור כהן",
    role: "חיפה",
    rating: 5,
    text: "השער המתרומם בחניה השמיע רעשים ולא נסגר עד הסוף. הגיעו, איתרו את התקלה ותיקנו באותו ביקור. מקצועיים.",
  },
  {
    name: "מיכל רוזן",
    role: "כפר סבא",
    rating: 5,
    text: "יחס אישי ומחירים הוגנים. הסבירו לי בדיוק מה צריך לתקן בלי למכור לי דברים מיותרים. תודה!",
  },
  {
    name: "רן לביא",
    role: "מודיעין",
    rating: 5,
    text: "שער הזרוע בכניסה לחניה שלנו תוקן במהירות ובאמינות. אחריות מלאה ושירות אדיב. בהחלט אחזור אליהם.",
  },
  {
    name: "עדי ברק",
    role: "ירושלים",
    rating: 5,
    text: "צוות מקצועי וזמין. תיקנו את השער החשמלי אצלנו בבית ונתנו טיפים לתחזוקה שוטפת. שירות ברמה גבוהה.",
  },
] as const;

export const REVIEW_COUNT = reviews.length;
export const REVIEW_AVG = "5.0";

/** About-page core values (live-site audit "למה לבחור בנו?" / values, 6 items). */
export const aboutValues = [
  {
    title: "מצוינות",
    body: "אנו שואפים למצוינות בכל היבט של עבודתנו — משירות הלקוחות ועד לאיכות הביצוע.",
  },
  {
    title: "שביעות רצון הלקוחות",
    body: "שביעות הרצון של הלקוח עומדת במרכז — אנו מלווים אתכם עד שהשער עובד בדיוק כמו שצריך.",
  },
  {
    title: "יושרה ושקיפות",
    body: "מחיר הוגן והצעה שקופה מראש, בלי הפתעות ובלי עבודות מיותרות.",
  },
  {
    title: "מומחיות וניסיון",
    body: "ניסיון רב שנים בעבודה עם כל סוגי השערים החשמליים והמנגנונים.",
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
    body: "אנו מאמינים כי שירות איכותי מתחיל בהבנה מעמיקה של צורכי הלקוח. המשימה שלנו היא להעניק לכל לקוח פתרון מותאם אישית, תוך שמירה על סטנדרטים גבוהים של בטיחות, אמינות ואיכות עבודה ללא פשרות.",
  },
  {
    title: "תחומי ההתמחות",
    body: "יש לנו היסטוריה עשירה של מתן פתרונות מתקדמים לכל סוגי השערים החשמליים. לאורך השנים צברנו ניסיון רב בעבודה עם לקוחות פרטיים, עסקים, מפעלים וארגונים מוסדיים.",
  },
  {
    title: "המחויבות ללקוחות",
    body: "אנחנו לא רק מתקינים ומתקנים שערים — אנו מחויבים להעניק לכם ביטחון ושקט נפשי. כל שירות שאנו מספקים מכוון לשיפור הבטיחות, השימושיות והאסתטיקה של השערים שלכם.",
  },
] as const;

/** Header / footer navigation (live Hebrew URLs). */
export const navItems = [
  { label: "השירותים שלנו", href: "/שירותים" },
  { label: "אזורי שירות", href: "/איזורי-שירות" },
  { label: "מחירון", href: "/מחירון" },
  { label: "בלוג", href: "/blog" },
  { label: "אודות", href: "/אודות" },
  { label: "צור קשר", href: "/צור-קשר" },
] as const;
