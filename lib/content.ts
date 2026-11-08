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
