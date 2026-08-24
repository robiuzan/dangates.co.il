import type { Guide } from "@/lib/guide-types";

/**
 * COMPONENT family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 7 (`עינית לשער חשמלי`). One part per URL.
 *
 * Block order (content-standards §3; /new-guide):
 *   answer → context → how it works and why it is mandatory → how failure shows → the failure-mode
 *   table → note → replace-or-repair → inline CTA → what determines the price → FAQ.
 * Buyer vocabulary is binding: עינית (never חיישן), לוח פיקוד (never לוח בקרה) — keyword-map §2.
 * Price: ❌ not coming (business-facts §D). This family NEVER states a part or labour figure; it
 * explains what moves the price and hands off to /מחירון/ (keyword-map §10).
 * The skeleton is ~250 words; lib/guides.ts throws below 900.
 */
export const guide = {
  slug: "עינית-לשער-חשמלי",
  title: "עינית לשער חשמלי — מה היא עושה, למה היא נכשלת ומתי מחליפים אותה",
  crumbLabel: "עינית לשער חשמלי",
  description:
    "⟨TODO: 120–160 תווים — תפקיד העינית, סימני הכשל השכיחים, ומתי ניקוי מספיק לעומת החלפה.⟩",
  family: "component",
  targetQuery: "עינית לשער חשמלי",
  datePublished: "⟨TODO: yyyy-mm-dd⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  relatedServices: ["שערים-לחניה", "שערים-נגררים", "שערי-כנף"],

  blocks: [
    // Question form for the component family: "מה עושה {part} בשער חשמלי?" — role, the failure
    // sign, the replace-or-repair verdict, all inside 40–60 words (content-standards §5).
    {
      kind: "answer",
      q: "מה עושה העינית בשער חשמלי?",
      a: "⟨TODO: 40–60 מילים — זוג משדר ומקלט שמזהה מכשול בקו הסגירה ועוצר או הופך את תנועת השער; הסימן הראשון לכשל הוא שער שלא נסגר או נסגר רק בלחיצה רצופה; ניקוי ויישור פותרים את הרוב, עינית רטובה או סדוקה מוחלפת.⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — למה דווקא הרכיב הזה מייצר כל כך הרבה קריאות שירות, ומה המדריך מכסה.⟩",
    },

    { kind: "heading", level: 2, text: "איך העינית עובדת, ולמה היא לא רכיב אופציונלי?" },
    {
      kind: "paragraph",
      text: "⟨TODO: המנגנון — קרן אינפרא-אדום בין עמוד לעמוד, הפסקת הקרן = מכשול, מה לוח הפיקוד עושה עם האות.⟩ עיניות בטיחות הן אחד הפריטים שהתקן הישראלי לשערים חשמליים דורש, ולכן שער בלי עינית תקינה הוא לא רק שער מעצבן אלא שער שאסור להפעיל.",
      links: [
        { anchor: "התקן הישראלי לשערים חשמליים", href: "/מדריכים/תקן-900-שער-חשמלי/" },
      ],
    },

    { kind: "heading", level: 2, text: "איך מזהים שהעינית נכשלה?" },
    {
      kind: "list",
      items: [
        "⟨TODO: השער נפתח כרגיל ולא נסגר, או נסגר ומיד חוזר⟩",
        "⟨TODO: נורית על העינית כבויה או מהבהבת — מה כל מצב אומר⟩",
        "⟨TODO: נסגר רק בלחיצה רצופה על השלט — מצב ״איש מת״⟩",
        "⟨TODO: עובד בבוקר ונכשל בצהריים — שמש ישירה על המקלט⟩",
      ],
    },
    // The citable asset of the component family: failure mode → symptom → replace-or-repair.
    {
      kind: "table",
      caption:
        "אופני הכשל של עינית בטיחות לשער חשמלי, איך הם נראים ומה הפתרון — דן שערים חשמליים",
      head: ["אופן הכשל", "הסימפטום בשער", "תיקון או החלפה"],
      rows: [
        ["עדשה מלוכלכת", "⟨TODO⟩", "ניקוי — אין צורך בטכנאי"],
        ["עמוד שזז או קרן לא מיושרת", "⟨TODO⟩", "יישור; החלפה רק אם התושבת שבורה"],
        ["לחות בתוך הגוף", "⟨TODO⟩", "⟨TODO⟩"],
        ["כבל חתוך או מחובר לא נכון בלוח", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: אופן כשל חמישי⟩", "⟨TODO⟩", "⟨TODO⟩"],
      ],
    },
    {
      kind: "callout",
      tone: "note",
      text: "⟨TODO: מה לא לעשות — לא לגשר על העינית בלוח כדי ״שהשער יעבוד״. למה זה מסוכן ומה זה אומר מבחינת אחריות (בלי לצטט סעיף חוק שלא אומת — business-facts §C, keyword-map §12).⟩",
    },

    { kind: "heading", level: 2, text: "להחליף או לתקן — מה קובע?" },
    {
      kind: "paragraph",
      text: "⟨TODO: כלל ההחלטה — ניקוי ויישור קודם, החלפה כשיש לחות, סדק או מקלט שרוף; התאמה בין עינית חדשה ללוח פיקוד קיים.⟩ אם השער שלכם נעצר באמצע הסגירה, סדר הבדיקה המלא נמצא במדריך על שער חשמלי שלא נסגר, ובשערי חניה משותפים כדאי לבדוק גם את השער לחניה עצמו.",
      links: [
        { anchor: "במדריך על שער חשמלי שלא נסגר", href: "/מדריכים/שער-חשמלי-לא-נסגר/" },
        { anchor: "השער לחניה", href: "/services/שערים-לחניה/" },
      ],
    },
    {
      kind: "cta",
      variant: "inline",
      text: "עינית שלא מגיבה גם אחרי ניקוי? טכנאי בודק את הקו, את החיווט ואת לוח הפיקוד בביקור אחד.",
      service: "שערים-לחניה",
    },

    { kind: "heading", level: 2, text: "מה קובע את מחיר ההחלפה?" },
    {
      kind: "paragraph",
      text: "⟨TODO: הגורמים בלי מספרים — סוג העינית (קווית/אלחוטית), מרחק בין העמודים, האם נדרש חיווט חדש, האם לוח הפיקוד תומך.⟩ פירוט מלא של מה שמזיז את המחיר בכל תיקון נמצא בעמוד מה משפיע על מחיר תיקון שער.",
      links: [{ anchor: "מה משפיע על מחיר תיקון שער", href: "/מחירון/" }],
    },

    {
      kind: "faq",
      items: [
        { q: "⟨TODO: ״אפשר להחליף עינית לבד?״⟩", a: "⟨TODO: 40–80 מילים⟩" },
        { q: "⟨TODO: ״עינית קווית או אלחוטית?״⟩", a: "⟨TODO⟩" },
        { q: "⟨TODO: ״כל עינית מתאימה לכל לוח פיקוד?״⟩", a: "⟨TODO⟩" },
      ],
    },
  ],
} as const satisfies Guide;
