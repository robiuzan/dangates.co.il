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
