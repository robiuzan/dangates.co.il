/**
 * The content entry for /מדריכים/ (the guides hub) (Sprint 7, backlog §6.2 / §3.13). The field rules are the JSDoc on
 * `PageContent` in lib/page-content.ts; the bar is docs/content-standards.md §1, §4–§5.
 *
 * What the hub is for and how it is organised: the reading order (symptom → the part → choosing a
 * gate), safety and the building committee as subjects of their own, how every guide is laid out,
 * and where a home check stops. The hub OWNS the description of how a guide is built and of the
 * stop-here boundary; /blog/ hands off to it in one sentence. The index floor is 250 unique words
 * (thresholds.json).
 *
 * Written 2026-11-09, revised the same day after review. What this copy may and may not say:
 * - It describes the guides by what the family templates require and the registry enforces (an
 *   answer first, a table, 3+ FAQs, a ״עצרו כאן״ warn callout on symptom guides). There are two
 *   symptom guides since N29 (שער-חשמלי-רועש, שער-חשמלי-לא-נסגר), so ״מדריך תקלה״ names the kind
 *   of guide and the copy never says there is only one. There is still NO רכיבים guide, so the
 *   parts step points at the service pages. When a component guide ships, update the parts lines.
 * - ת״י 900 חלק 21.03 is named only; its scope, exclusions and source live in the safety guide
 *   (which carries the sii.org.il URLs in `sources`). The hub restates none of it — cannibalisation.
 * - The committee section follows the committee guide and the fact sheet §C: under התקנון המצוי
 *   (model bylaws §5(א)) the general assembly of apartment owners decides on the common property;
 *   a building's registered bylaws may differ from התקנון המצוי (not from the law); disputes go to
 *   a lawyer or the מפקח על רישום מקרקעין. No majority is named; no committee power is stated.
 *   The copy never says that a parking gate, a barrier or an entrance door IS common property — the
 *   fact sheet carries §5(א), not the statute's definition (claims-verifier stop-ship, 2026-11-09);
 *   the reader is sent to the building's registration instead.
 * - The sliding-vs-swing space rule is NOT restated (it lives in the homepage FAQ, the comparison
 *   guide and a city page) — one pointer sentence only. קונזולי is left to the comparison guide.
 * - The lifting-gate release line matches services-index and the depth modules.
 * - The phone comes from `siteConfig`; WhatsApp is pointed at the site's button, never typed —
 *   072-2587772 is not on WhatsApp (business-facts §I). No hours, speed, availability, price or
 *   coverage claim.
 *
 * The copy describes guides that are registered in lib/guides.ts (five since N29). The in-copy
 * links (N31) are checked there at module load, so a guide that is removed fails the build here.
 */
import { siteConfig } from "@/lib/site-config";
import type { PageContent } from "@/lib/page-content";

export const page: PageContent = {
  answerHeading: "מה תמצאו במדריכים, ואיך כדאי לקרוא אותם?",
  answer:
    "המדריכים עונים על שאלה אחת בכל פעם: מה גורם לתקלה בשער חשמלי, איך בוחרים שער, מה חשוב לבטיחות ומה ועד הבית צריך להחליט. כשהשער תקול, התחילו מהסימן שאתם רואים או שומעים, קראו על החלק שגורם לו בעמוד השירות, ורק אז שאלו איזה שער לבחור. בטיחות והחלטות של ועד הבית הם נושאים בפני עצמם, שכדאי לקרוא גם כשהשער עובד.",
  sections: [
    {
      heading: "למה מתחילים מהסימן, ולא מהחלק שנראה חשוד?",
      paragraphs: [
        "מי שעומד מול שער תקול רואה סימן, לא רכיב. השער נעצר באמצע, חוזר לאחור, לא מגיב לשלט או משמיע חריקה שלא הייתה קודם. לכן מדריך תקלה בנוי סביב הסימן, ולא סביב החלק.",
        "סימן אחד יכול לנבוע מכמה חלקים שונים. שער שנעצר לפני הסוף יכול לעשות זאת בגלל עינית מלוכלכת, אבן במסילה או מפסק גבול שזז ממקומו. מדריך תקלה מסדר את הסיבות האפשריות בטבלה: מה בודקים, מה רואים, ומתי זו כבר עבודה לטכנאי.",
        "רק כשהסימן מצביע על חלק מסוים, כדאי לקרוא עליו לעומק: מה הוא עושה, איך הוא נשחק או מתקלקל, ומתי מתקנים אותו ומתי מחליפים. רכיבים כמו לוח הפיקוד, העינית והגלגלים מוסברים בעמודי השירות, לפי סוג השער.",
      ],
      links: [
        { anchor: "חריקה שלא הייתה קודם", href: "/מדריכים/שער-חשמלי-רועש/" },
        { anchor: "שער שנעצר לפני הסוף", href: "/מדריכים/שער-חשמלי-לא-נסגר/" },
        { anchor: "בעמודי השירות", href: "/שירותים/" },
      ],
    },
    {
      heading: "איך בנוי כל מדריך?",
      paragraphs: [
        "כל מדריך נפתח בתשובה קצרה לשאלה שבכותרת. אם זה כל מה שחיפשתם, אפשר לעצור שם. אחרי התשובה בא ההסבר המלא, טבלה שמרכזת את העיקר, ובסוף שאלות נפוצות.",
        "כשמדריך נשען על מקור רשמי, כמו תקן או חוק, הקישור למקור מופיע ליד המשפט שמסתמך עליו. כך אפשר לבדוק בעצמכם מה כתוב שם, ולא להסתמך רק על הסיכום שלנו.",
      ],
    },
    {
      heading: "מה אפשר לבדוק לבד, ואיפה עוצרים?",
      paragraphs: [
        "בדיקה ביתית היא בדיקה שלא דורשת כלי עבודה ולא פתיחה של מכסה בשער, במנוע או בלוח הפיקוד. למשל: להחליף סוללה בשלט, לנגב את עדשת העינית, לפנות עלים או אבנים מהמסילה, ולוודא שהשער לא נשאר במצב שחרור ידני. את המסילה מפנים ביד רק כשהשער כבוי במפסק שלו, כל השלטים אצלכם, ולחיצה על שלט מחוץ למסלול הכנף לא מפעילה אותו. אם אין מפסק מסומן או שהשער הגיב, עבדו רק מחוץ למסלול הכנף, עם מטאטא ארוך.",
        "רצף הבדיקות במדריך תקלה מסתיים באזהרה מסומנת: ״עצרו כאן״. מעבר לה נמצאים אספקת החשמל של 230 וולט, לוח פיקוד פתוח, הקפיצים של שער מתרומם, ושחרור של שער מתרומם שנעצר למעלה או באמצע הדרך. אלה לא בדיקות ביתיות, גם כשהן נראות פשוטות.",
        "שער שלא עוצר, או לא חוזר לאחור, כשמשהו עומד בדרכו, הוא סיבה להפסיק להשתמש בו עד שהוא נבדק. זה נכון לכל סוג שער ולכל מחסום.",
      ],
    },
    {
      heading: "מתי השאלה היא כבר איזה שער לבחור?",
      paragraphs: [
        "יש מצבים שבהם תיקון לא עונה על השאלה: כניסה חדשה, שער ידני שרוצים להפוך לחשמלי, או שער שהתקלות בו חוזרות שוב ושוב. כאן מתחיל תחום הבחירה.",
        "מדריך ההשוואה בין סוגי השערים יוצא מהכניסה עצמה: כמה מקום יש לצד הפתח ולפניו, איך נראית הקרקע והאם יש שיפוע. אחר כך הוא עובר למשקל ולרוחב של הכנף, ולמה שמשפיע על העלות.",
        "המדריך לא נותן מחיר. מה שקובע את המחיר מוסבר בעמוד המחירון.",
      ],
      links: [
        {
          anchor: "מדריך ההשוואה בין סוגי השערים",
          href: "/מדריכים/שער-נגרר-כנף-או-קונזולי/",
        },
        { anchor: "מה שקובע את המחיר", href: "/מחירון/" },
      ],
    },
    {
      heading: "למה בטיחות ותקנים מקבלים מדור משלהם?",
      paragraphs: [
        "מדריך תקלה שואל אם השער עובד. מדריך בטיחות שואל מה קורה כשאדם, ילד או רכב נמצאים בדרכו. שער יכול להיפתח ולהיסגר בלי שום בעיה, ועדיין לא לעצור בזמן.",
        "מדריך הבטיחות עוסק בתקן הישראלי ת״י 900 חלק 21.03. הוא מסביר על אילו שערים התקן חל ועל אילו לא, ומה מכון התקנים מפרסם עליו, עם קישור למקור.",
        "המדריך מפריד בין מה שמכון התקנים כותב לבין מה שלא מצאנו לו מקור. הוא לא מחליף ייעוץ משפטי או בדיקה של מעבדה. הוא עוזר לדעת מה לשאול את מי שמתקין או מתחזק את השער.",
      ],
      links: [{ anchor: "מדריך הבטיחות", href: "/מדריכים/תקן-900-שער-חשמלי/" }],
    },
    {
      heading: "למה לוועד הבית יש מדור נפרד?",
      paragraphs: [
        "בבית משותף, שער החניה, המחסום ודלת הכניסה לבניין משמשים את כל הדיירים. לפי סעיף 5(א) לתקנון המצוי בחוק המקרקעין, האסיפה הכללית של בעלי הדירות מחליטה על ״דרכי ניהולו של הרכוש המשותף והשימוש בו״. מה בבניין שלכם רשום כרכוש משותף, ומה הוצמד לדירות, בודקים ברישום של הבית.",
        "מדריך ועד הבית עוסק בשאלות שבעל בית פרטי לא פוגש: מי מחליט, מי משלם, ומה לכתוב בבקשה להצעת מחיר. הוא מבחין בין התקנון המצוי שבחוק המקרקעין לבין התקנון הרשום של הבית, שיכול להיות שונה ממנו.",
        "כשיש מחלוקת בין בעלי הדירות, או כשרוצים לחייב בעל דירה שהתנגד, זו כבר שאלה לעורך דין או למפקח על רישום מקרקעין, ולא למדריך.",
      ],
      links: [{ anchor: "מדריך ועד הבית", href: "/מדריכים/מחסום-חניה-ועד-בית/" }],
    },
    {
      heading: "מתי עדיף להפסיק לקרוא ולהתקשר?",
      paragraphs: [
        "מדריך עוזר להבין את התקלה, אבל הוא לא מתקן אותה. אם הבדיקה הביתית לא פתרה את הבעיה, או שהגעתם לאזהרת ״עצרו כאן״, זה הזמן לטכנאי.",
        `התקשרו לטלפון ${siteConfig.phone} וספרו מה הסימן, באיזה סוג שער מדובר ומה כבר בדקתם. תמונה או סרטון קצר של השער בזמן התקלה אפשר לשלוח בוואטסאפ, דרך הכפתור באתר. הם עוזרים לזהות מאיפה הבעיה מגיעה.`,
      ],
    },
  ],
};
