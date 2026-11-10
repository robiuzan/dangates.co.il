import type { Guide } from "@/lib/guide-types";

/**
 * SYMPTOM family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 5 (`שער חשמלי לא נסגר`). One symptom per URL.
 *
 * Block order is the family contract (content-standards §3 "Blog post / guide"; /new-guide):
 *   answer → context → DIY order → the cause table → safety gate → when it is no longer yours →
 *   quote CTA → the visit (diagnosis, coordinating the work) → the repair and the re-test → what
 *   moves the cost → what to ask → FAQ.
 * The DIY diagnosis comes FIRST and is given away (keyword-map §11.3) — the residual cases are the
 * paying ones. The skeleton is ~300 words; lib/guides.ts throws below 900. That is the point.
 *
 * 🔶 = a business fact that is not confirmed (business-facts §D/§E). Write around it, never fill it.
 *
 * No price on a guide: no ₪ figure and no visitFeeRange (owner decision 2026-11-10). The cost H2 names
 * what moves the price, and says nothing about when a price is given or whether the fee is credited.
 */
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
      text: "⟨TODO: הפסקה שמסבירה מה קורה כשהבדיקות הביתיות לא פתרו — לוח פיקוד, מנוע, קבל. ⟩ בשער נגרר הבעיה מתחילה לרוב בגלגלים ובמסילה, ובשער כנף בצירים ובבוכנות.",
      links: [
        { anchor: "שער נגרר", href: "/services/שערים-נגררים/" },
        { anchor: "שער כנף", href: "/services/שערי-כנף/" },
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
    // Follows processSteps in lib/content.ts: diagnosis, coordinating the work, repair, re-test. No
    // line may imply a repair on the same visit, or say when the repair happens.
    {
      kind: "paragraph",
      text: "⟨TODO: האבחון — סדר הבדיקה בשטח ומה נבדק, עד שהטכנאי מסביר מה נכשל ומה צריך לתקן. אחריו, בניסוח של המדריך: את העבודה מתאמים למועד נוח בשעות הפעילות, בלי לומר מתי.⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: התיקון — מה מתקנים בלי חלקים ומה דורש חלק שמתאים לשער. זה קורה במועד שתואם: לא לרמוז שזה אותו ביקור.⟩ הנחת קו חשמל חדש, החלפת כבל בקרקע או עבודה בלוח החשמל של הבית או הבניין הן עבודה של חשמלאי, לא של טכנאי שערים.",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: הבדיקה החוזרת — מה מפעילים בסיום התיקון, לא בסיום הביקור: סגירה עד הסוף, תגובה לשלט, עצירה בקרן העינית (רק מה ש־lib/content.ts כבר אומר).⟩",
    },

    // lib/guides.ts throws on a repeated H2: name this guide's symptom so the heading is unique.
    {
      kind: "heading",
      level: 2,
      text: "מה קובע את מחיר התיקון כש⟨TODO: הסימפטום של המדריך⟩?",
    },
    // content-standards §6: the pointer is tied to this guide's own cost list, never one fixed
    // sentence. The anchor is absent from the text on purpose: lib/guides.ts throws until both are written.
    {
      kind: "paragraph",
      text: "⟨TODO: מה משנה את המחיר בתקלה הזו — איזה רכיב נכשל, משקל הכנף, אם העומס כבר הגיע למנוע. בלי מספר.⟩ ⟨TODO: משפט שקושר את התקלה של המדריך הזה לעמוד המחירון, בניסוח של המדריך. לא משפט קבוע.⟩",
      links: [{ anchor: "⟨TODO: עוגן תיאורי, מילה במילה מתוך המשפט⟩", href: "/מחירון/" }],
    },

    // Questions about the mechanism only: never a licence, insurance, warranty length or arrival
    // time, which the site cannot answer about itself.
    {
      kind: "heading",
      level: 2,
      text: "מה כדאי לשאול את הטכנאי על ⟨TODO: הסימפטום של המדריך⟩?",
    },
    {
      kind: "list",
      items: [
        "⟨TODO: איזה חלק נכשל, ואיך זה קשור לסימפטום?⟩",
        "⟨TODO: מה גרם לשחיקה, והאם הטיפול נעשה גם שם?⟩",
        "⟨TODO: האם המנוע מתאים למשקל הכנף ולמספר ההפעלות?⟩",
        "⟨TODO: מה נבדק אחרי התיקון?⟩",
      ],
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
