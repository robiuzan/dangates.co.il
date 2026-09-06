/**
 * content.ts — display content for the site, derived from the dangates.co.il live-site audit
 * (דן שערים חשמליים). Business data (NAP, slugs, locations) stays in site-config.ts; this file
 * holds the Hebrew marketing copy and per-section content. Faithful to the live site; no
 * invented facts (indicative price ranges are flagged as estimates in the pricing UI).
 */
import { services, siteConfig, type ServiceSlug } from "@/lib/site-config";

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
  { label: "השירותים שלנו", href: "/שירותים/" },
  { label: "אזורי שירות", href: "/איזורי-שירות/" },
  { label: "מחירון", href: "/מחירון/" },
  { label: "בלוג", href: "/blog/" },
  { label: "אודות", href: "/אודות/" },
  { label: "צור קשר", href: "/צור-קשר/" },
] as const;

// ── Route & component copy (moved out of JSX per backlog N13) ──────────────
// Verbatim from the route files and the three marketing components named in the sprint row —
// wording is unchanged; only the location has moved. Sprint 4 is where any of this gets rewritten.

/** Shared breadcrumb labels — a route file never types a crumb label directly. */
export const crumbLabels = {
  home: "בית",
  services: "השירותים שלנו",
  areas: "אזורי שירות",
  about: "אודות",
  contact: "צור קשר",
} as const;

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
  eyebrow: "ניסיון רב שנים · מרכז הארץ ופריסה ארצית · זמינות 24/7",
  h1: "דן שערים חשמליים – תיקון והתקנה מקצועית",
  lead: "מתמחים בתיקון והתקנת שערים חשמליים בהתאמה אישית לשירות מהיר ואמין — עם אחריות מלאה וזמינות 24/7 לקריאות חירום.",
  points: ["שירות מהיר ואמין", "אחריות מלאה", "זמינות 24/7 לחירום"],
  callLabel: "חייגו עכשיו:",
  whatsappLabel: "וואטסאפ",
  formSubtitle: "השאירו פרטים ונחזור אליכם עם פתרון — ללא התחייבות.",
} as const;

/** components/marketing/FinalCta.tsx — sitewide closing CTA copy. */
export const finalCtaCopy = {
  title: "השער תקוע או לא נסגר? דברו איתנו עוד היום.",
  body: "ייעוץ והצעת מחיר שקופה — ללא התחייבות. תיקון והתקנת שערים חשמליים במהירות, עם אחריות מלאה וזמינות 24/7 לחירום.",
  callLabel: "חייגו עכשיו:",
  whatsappLabel: "שלחו וואטסאפ",
} as const;

/** components/marketing/ServiceAreas.tsx — homepage service-area teaser copy. */
export const serviceAreasCopy = {
  eyebrow: "אזורי שירות",
  title: "נותנים שירות במרכז הארץ ובפריסה ארצית",
  subtitle:
    "לא בטוחים שאתם בטווח? התקשרו ונבדוק — עם מענה מהיר וזמינות 24/7 לקריאות חירום.",
} as const;

/** app/page.tsx — homepage <meta name="description">. */
export const homeMetaDescription = `תיקון והתקנת שערים חשמליים לבתים, ועדי בתים ועסקים — שערים נגררים, כנף, מתרוממים ותריסי גלילה. אבחון מהיר, מחיר שקוף מראש ואחריות על העבודה. חייגו ${siteConfig.phone}.`;

/** app/page.tsx — the homepage FAQ section heading. */
export const homeFaqHeading = {
  eyebrow: "שאלות נפוצות",
  title: "מידע חשוב לפני תיקון שער חשמלי",
} as const;

/** app/services/[service]/page.tsx — static section copy shared by all 7 service pages. */
export const servicePageCopy = {
  triggersHeading: "מתי כדאי לפנות אלינו?",
  processHeading: "איך אנחנו עובדים",
  ctaSubtitle: "ביקור, אבחון והצעה שקופה — ללא התחייבות.",
  whatsappLabel: "וואטסאפ",
  relatedHeading: "שירותים נוספים",
} as const;

/** app/services/[service]/page.tsx — the sticky CTA card title, per service. */
export function serviceCtaCardTitle(serviceName: string): string {
  return `רוצים הצעת מחיר ל${serviceName}?`;
}

/** app/locations/[city]/page.tsx — <title> / meta description, per city. */
export function locationPageTitle(cityName: string): string {
  return `תיקון שערים חשמליים ב${cityName}`;
}

export function locationMetaDescription(cityName: string): string {
  return `תיקון והתקנת שערים חשמליים ב${cityName} — שירות מהיר ואמין, אחריות מלאה וזמינות 24/7 לקריאות חירום. לכל סוגי השערים: נגררים, כנף, מתרוממים, חניה, זרוע ותריסי גלילה.`;
}

/** app/locations/[city]/page.tsx — PageHeader title / subtitle, per city. */
export function locationHeroTitle(cityName: string): string {
  return `תיקון והתקנת שערים חשמליים ב${cityName}`;
}

export function locationHeroSubtitle(cityName: string): string {
  return `שירות מקצועי לתיקון והתקנת שערים חשמליים ב${cityName} והסביבה — מענה מהיר, אחריות מלאה וזמינות 24/7 לקריאות חירום.`;
}

/** app/locations/[city]/page.tsx — the two intro paragraphs, per city. */
export function locationIntroParagraph1(cityName: string): string {
  return `מחפשים תיקון או התקנה של שער חשמלי ב${cityName}? ב${siteConfig.name} מטפלים בכל סוגי השערים החשמליים — נגררים, כנף, מתרוממים, שערים לחניה, שערי זרוע ותריסי גלילה — עם אבחון מדויק, ציוד מתקדם ותיקונים עמידים לאורך זמן.`;
}

export function locationIntroParagraph2(cityName: string): string {
  return `אנחנו נותנים שירות ללקוחות פרטיים, ועדי בתים ועסקים ב${cityName} והסביבה, עם מענה מהיר וזמינות לקריאות חירום. השער תקוע, לא נסגר או שהמנוע לא מגיב? התקשרו ונגיע לבדוק ולתקן.`;
}

export function locationServicesHeading(cityName: string): string {
  return `השירותים שלנו ב${cityName}`;
}

/** app/אודות/page.tsx — metadata + copy. */
export const aboutMetaDescription =
  "דן שערים חשמליים — מומחים בתיקון והתקנת שערים חשמליים עם ניסיון רב שנים. שירות מהיר ואמין, אחריות מלאה, צוות מומחים וזמינות 24/7 לקריאות חירום.";

export const aboutHeroTitle = "אודות דן שערים חשמליים";
export const aboutHeroSubtitle =
  "מומחים בתיקון והתקנת שערים חשמליים — פתרון מותאם אישית לכל שער, עם דגש על איכות, מקצועיות ובטיחות.";

export const aboutIntro = `ברוכים הבאים ל${siteConfig.name} — מתמחים בתיקון והתקנת שערים חשמליים. עם ניסיון רב שנים בתחום, אנו מספקים שירות ברמה הגבוהה ביותר, תוך הקפדה על איכות, מקצועיות ובטיחות. המטרה שלנו היא להבטיח שהשערים החשמליים שלכם יתפקדו בצורה מושלמת וישרתו אתכם נאמנה לאורך זמן.`;

export const aboutValuesHeading = "הערכים שלנו";

/** app/שירותים/page.tsx — metadata + copy. */
export const servicesIndexMetaDescription =
  "שירותי תיקון והתקנת שערים חשמליים: שערים נגררים, שערי כנף, שערים מתרוממים, שערים לחניה, שער זרוע, תריסי גלילה חשמליים ושערים לדירה — עם אחריות מלאה ושירות מהיר.";

export const servicesIndexHeroTitle = "השירותים שלנו";
export const servicesIndexHeroSubtitle =
  "פתרון לכל סוג שער חשמלי — מתיקון תקלות ומנועים ועד התקנת שער חדש, עם שירות מהיר ואחריות מלאה.";

/** app/צור-קשר/page.tsx — metadata + copy. */
export const contactMetaDescription =
  "צרו קשר עם דן שערים חשמליים לתיקון והתקנת שערים חשמליים במרכז הארץ ובפריסה ארצית. טלפון, וואטסאפ או טופס — נחזור אליכם עם הצעת מחיר. זמינות 24/7 לחירום.";

export const contactHeroTitle = "צור קשר";
export const contactHeroSubtitle = "מענה מהיר, ייעוץ ראשוני והצעת מחיר ללא התחייבות.";

export const contactPageCopy = {
  detailsHeading: "פרטי התקשרות",
  whatsappLabel: "וואטסאפ",
  areaLine: "שירות בפריסה ארצית",
  formSubtitle: "השאירו פרטים ונחזור אליכם בהקדם.",
} as const;
