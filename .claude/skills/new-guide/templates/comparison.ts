import type { Guide } from "@/lib/guide-types";

/**
 * COMPARISON family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 4 (gate-type matrix). Also the shape for
 * `מינוע שער קיים` (row 8) and `לתקן או להחליף` (row 12) — swap the options, keep the three axes.
 *
 * Block order (content-standards §3; /new-guide):
 *   answer (the decision rule) → context → what differs → the 3-axis matrix → one section per
 *   option → note → quote CTA → what moves the price → FAQ.
 * The matrix is the citable asset: an assistant asked "נגרר או כנף" prefers an explicit side-by-side.
 * Rows are the options, columns are the three decision axes — never a price column (§D ❌).
 * 🔶 קונזולי: whether the business installs cantilever gates is unconfirmed. It shapes the CTA and
 * the "מתי" section, never the matrix; no 8th service is added (CLAUDE.md §12).
 * The skeleton is ~250 words; lib/guides.ts throws below 900.
 */
export const guide = {
  slug: "שער-נגרר-כנף-או-קונזולי",
  title: "שער נגרר, שער כנף או שער קונזולי — איזה שער מתאים לכניסה שלכם?",
  crumbLabel: "נגרר, כנף או קונזולי",
  description:
    "⟨TODO: 120–160 תווים — שלושת הסוגים, שלושת הצירים שמכריעים (רוחב ושיפוע, מקום ותשתית, תחזוקה), ולמי כל אחד מתאים.⟩",
  family: "comparison",
  targetQuery: "שער נגרר או כנף",
  datePublished: "⟨TODO: yyyy-mm-dd⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  relatedServices: ["שערים-נגררים", "שערי-כנף", "שערים-לחניה"],

  blocks: [
    // Question form for the comparison family: "{A} או {B} — מה מתאים ל…?" — the decision rule in
    // the first sentence, the exceptions after it (content-standards §5).
    {
      kind: "answer",
      q: "שער נגרר, שער כנף או שער קונזולי — מה מתאים לכניסה שלכם?",
      a: "⟨TODO: 40–60 מילים — הכלל: פתח רחב או חצר בשיפוע → נגרר; מקום לצדדים ופתח עד רוחב מסוים → כנף; אין מקום למסילה ברצפה או שלג/בוץ → קונזולי. ואז החריג האחד שהכי מבלבל אנשים.⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — למה השאלה הזו נשאלת רק פעם אחת בעשרים שנה, ולמה הבחירה הלא נכונה מתגלה רק בחורף הראשון.⟩",
    },

    { kind: "heading", level: 2, text: "מה באמת שונה בין שלושת סוגי השערים?" },
    {
      kind: "paragraph",
      text: "⟨TODO: המכניקה בשתי-שלוש שורות לכל סוג — איפה המנוע, מה נושא את המשקל, מה מתבלה ראשון.⟩",
    },
    // The citable asset of the comparison family: options × three decision axes.
    {
      kind: "table",
      caption:
        "השוואה בין שער נגרר, שער כנף ושער קונזולי לפי שלושת הצירים שמכריעים את הבחירה — דן שערים חשמליים",
      head: ["סוג השער", "רוחב הפתח ושיפוע", "מקום פנוי ותשתית נדרשת", "תחזוקה ובלאי"],
      rows: [
        [
          "שער נגרר",
          "⟨TODO⟩",
          "⟨TODO: מסילה ברצפה, מקום לצד אחד באורך השער⟩",
          "⟨TODO: גלגלים, מסילה, פס שיניים⟩",
        ],
        [
          "שער כנף",
          "⟨TODO⟩",
          "⟨TODO: קשת פתיחה פנויה, עמודים נושאים⟩",
          "⟨TODO: צירים, בוכנות⟩",
        ],
        [
          "שער קונזולי",
          "⟨TODO⟩",
          "⟨TODO: בלי מסילה ברצפה, יסוד כבד בצד⟩",
          "⟨TODO: מיסבים, קורה נושאת⟩",
        ],
      ],
    },

    { kind: "heading", level: 2, text: "מתי שער נגרר הוא הבחירה הנכונה?" },
    {
      kind: "paragraph",
      text: "⟨TODO: המצבים — פתח רחב, חצר בשיפוע, רכב שחונה קרוב לשער.⟩ את סוגי המנועים והתקלות האופייניות לסוג הזה פירטנו בעמוד השירות לשערים נגררים.",
      links: [{ anchor: "בעמוד השירות לשערים נגררים", href: "/services/שערים-נגררים/" }],
    },

    { kind: "heading", level: 2, text: "מתי שער כנף עדיף?" },
    {
      kind: "paragraph",
      text: "⟨TODO: המצבים — פתח צר, רצון באסתטיקה סימטרית, אין מקום לצד.⟩ התיקון והתחזוקה של שערי כנף שונים לגמרי מאלה של שער נגרר, ולכן מי שכבר יש לו כנף כדאי שיקרא את העמוד על שערי כנף לפני שהוא מחליט להחליף.",
      links: [{ anchor: "העמוד על שערי כנף", href: "/services/שערי-כנף/" }],
    },

    { kind: "heading", level: 2, text: "מתי שער קונזולי שווה את העלות הנוספת?" },
    {
      kind: "paragraph",
      text: "⟨TODO: המצבים — בוץ, חול או שלג על הרצפה, רצפה שאי אפשר לחתוך. 🔶 אל תכתבו ״אנחנו מתקינים שערים קונזוליים״ עד שזה מאושר (business-facts §C); כתבו מה השער דורש.⟩",
    },
    {
      kind: "callout",
      tone: "note",
      text: "⟨TODO: ההערה שחוסכת טעות — בחניה משותפת הבחירה היא לרוב לא של הדייר אלא של ועד הבית; הפניה למדריך ועד הבית.⟩",
    },
    // Quote CTA after the unresolved variable: the reader cannot measure their own entrance from here.
    {
      kind: "cta",
      variant: "quote",
      text: "צלמו את הכניסה מבחוץ, כולל הרצפה והצדדים, ושלחו בוואטסאפ — נגיד לכם איזה סוג שער נכנס שם בלי שבירה.",
      service: "שערים-נגררים",
    },

    { kind: "heading", level: 2, text: "מה קובע את ההפרש במחיר בין הסוגים?" },
    {
      kind: "paragraph",
      text: "⟨TODO: הגורמים בלי מספרים — משקל השער, כמות עבודת התשתית, סוג המנוע.⟩ הפירוט של מה שמזיז את המחיר בכל התקנה נמצא בעמוד מה משפיע על מחיר התקנת שער.",
      links: [{ anchor: "מה משפיע על מחיר התקנת שער", href: "/מחירון/" }],
    },

    {
      kind: "faq",
      items: [
        { q: "⟨TODO: ״אפשר להפוך שער כנף לשער נגרר?״⟩", a: "⟨TODO: 40–80 מילים⟩" },
        {
          q: "⟨TODO: ״איזה סוג שער הכי פחות מתקלקל?״ — תשובה לפי מנגנון, לא לפי מותג⟩",
          a: "⟨TODO⟩",
        },
        { q: "⟨TODO: ״מה עושים כשהפתח בשיפוע לשני הכיוונים?״⟩", a: "⟨TODO⟩" },
      ],
    },
  ],
} as const satisfies Guide;
