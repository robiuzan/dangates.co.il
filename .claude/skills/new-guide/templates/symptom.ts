import type { Guide } from "@/lib/guide-types";
import { priceRows } from "@/lib/content";

/**
 * SYMPTOM family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 5 (`שער חשמלי לא נסגר`). One symptom per URL.
 *
 * Block order is the family contract (content-standards §3 "Blog post / guide"; /new-guide):
 *   answer → context → DIY order → the cause table → safety gate → when it is no longer yours →
 *   quote CTA → what the visit involves → FAQ.
 * The DIY diagnosis comes FIRST and is given away (keyword-map §11.3) — the residual cases are the
 * paying ones. The skeleton is ~300 words; lib/guides.ts throws below 900. That is the point.
 *
 * 🔶 = a business fact that is not confirmed (business-facts §D/§E). Write around it, never fill it.
 */
const VISIT_FEE = priceRows[0].from; // 150–350 ₪ — the only sourced price; 🔶 still current (§D)

export const guide = {
  slug: "שער-חשמלי-לא-נסגר",
  title: "שער חשמלי לא נסגר עד הסוף — מה לבדוק, לפי הסדר",
  crumbLabel: "השער לא נסגר",
  description:
    "⟨TODO: 120–160 תווים — הסימפטום, שתי הסיבות השכיחות, מה אפשר לבדוק לבד ומתי מזמינים טכנאי.⟩",
  family: "symptom",
  targetQuery: "שער חשמלי לא נסגר",
  datePublished: "⟨TODO: yyyy-mm-dd — the real publish day⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  relatedServices: ["שערים-נגררים", "שערי-כנף"],

  blocks: [
    // content-standards §5 — this answer block is the standard's own "good" example. Keep it.
    {
      kind: "answer",
      q: "למה השער החשמלי לא נסגר עד הסוף?",
      a: "ברוב המקרים הסיבה היא עינית בטיחות מלוכלכת או לא מיושרת, שמזהה מכשול מדומה ועוצרת את התנועה. ניקוי עדשת העינית ויישור מחדש פותרים את התקלה בדקות. אם השער עדיין נעצר, הבעיה בדרך כלל בהגדרות מרחק הסגירה בלוח הפיקוד — שם נדרש טכנאי.",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — מה המשתמש רואה בפועל (נסגר וחוזר, נעצר באמצע, נסגר רק ידנית), למה זה דחוף מבחינת אבטחה, ומה המדריך יעשה: סדר בדיקה ביתי, ואז הקו שבו קוראים לטכנאי.⟩",
    },

    { kind: "heading", level: 2, text: "מה לבדוק לבד לפני שקוראים לטכנאי?" },
    {
      kind: "list",
      ordered: true,
      items: [
        "⟨TODO: חשמל — מפסק הפחת ונורית הלוח; מה רואים כשאין מתח⟩",
        "⟨TODO: העינית — עדשה מלוכלכת, נורית מהבהבת, עמוד שזז; איך מנקים ומיישרים⟩",
        "⟨TODO: מכשול פיזי — אבן במסילה, ענף, רכב; מה לבדוק בשער נגרר מול שער כנף⟩",
        "⟨TODO: שחרור ידני שנשאר פתוח אחרי הפסקת חשמל⟩",
        "⟨TODO: סוללת השלט — למה ״נסגר רק לפעמים״ הוא לרוב שלט ולא מנוע⟩",
      ],
    },

    { kind: "heading", level: 2, text: "מה גורם לשער לא להיסגר, ומה עושים בכל מקרה?" },
    // The citable asset of the symptom family: cause → DIY check → when to call → typical fix.
    {
      kind: "table",
      caption:
        "סיבות נפוצות לשער חשמלי שלא נסגר, הבדיקה הביתית, מתי מזמינים טכנאי והתיקון האופייני — דן שערים חשמליים",
      head: ["הסיבה", "מה בודקים לבד", "מתי קוראים לטכנאי", "התיקון האופייני"],
      rows: [
        ["עינית מלוכלכת או לא מיושרת", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["מכשול במסילה או בציר", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["מרחק סגירה בלוח הפיקוד", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["מפסק גבול שזז", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: סיבה חמישית לפי סוג השער⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      text: "⟨TODO: שער הבטיחות — מתי מפסיקים לבדוק לבד: שער שזז מעצמו, ריח שרוף, מנוע שמזמזם ולא זז, כל פתיחה של מכסה המנוע (230V). בלי לציין licence / certification (claims.json ids) — business-facts §C.⟩",
    },

    { kind: "heading", level: 2, text: "מתי התקלה כבר לא בידיים שלכם?" },
    {
      kind: "paragraph",
      text: "⟨TODO: הפסקה שמסבירה מה קורה כשהבדיקות הביתיות לא פתרו — לוח פיקוד, מנוע, קבל. ⟩ בשער נגרר הבעיה מתחילה לרוב בגלגלים ובמסילה, ובשער כנף בצירים ובבוכנות. על תפקיד העינית ומתי מחליפים אותה כתבנו במדריך על עינית לשער חשמלי.",
      links: [
        { anchor: "שער נגרר", href: "/services/שערים-נגררים/" },
        { anchor: "שער כנף", href: "/services/שערי-כנף/" },
        { anchor: "במדריך על עינית לשער חשמלי", href: "/מדריכים/עינית-לשער-חשמלי/" },
      ],
    },
    // The quote CTA sits after the unresolved variable ("which of these is mine?") — never mid-answer.
    {
      kind: "cta",
      variant: "quote",
      text: "לא בטוחים איזו מהסיבות זו אצלכם? צלמו סרטון קצר של השער בזמן שהוא נעצר ושלחו בוואטסאפ — נגיד לכם מה זה נראה ומה הצעד הבא.",
      service: "שערים-נגררים",
    },

    { kind: "heading", level: 2, text: "מה קורה בביקור הטכנאי?" },
    {
      kind: "paragraph",
      text: `⟨TODO: סדר האבחון בשטח, מה נבדק, מה מוחלף במקום ומה דורש חלק.⟩ ביקור אבחון עולה ${VISIT_FEE}, ומה שקובע את מחיר התיקון עצמו מפורט במחירון.`,
      links: [{ anchor: "במחירון", href: "/מחירון/" }],
    },

    {
      kind: "faq",
      items: [
        {
          q: "⟨TODO: שאלה ייחודית — לא מופיעה ב-faqs של דף הבית ולא במדריך אחר⟩",
          a: "⟨TODO: 40–80 מילים⟩",
        },
        { q: "⟨TODO: ״זה העינית או המנוע?״ — שאלת הבחנה⟩", a: "⟨TODO⟩" },
        { q: "⟨TODO: ״כמה דחוף זה?״ — שאלת דחיפות⟩", a: "⟨TODO⟩" },
      ],
    },
  ],
} as const satisfies Guide;
