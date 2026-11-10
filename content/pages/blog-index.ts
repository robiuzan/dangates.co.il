/**
 * The content entry for /blog/ (the posts index) (Sprint 7, backlog §6.2 / §3.13). The field rules are the JSDoc on
 * `PageContent` in lib/page-content.ts; the bar is docs/content-standards.md §1, §4–§5.
 *
 * What the blog holds and where a long answer lives instead (the guides hub). Written as how the
 * two sections differ, never as a claim about the posts' authorship or the business's experience.
 *
 * The topic list names only the three posts Sprint 7.4 keeps (תחזוקה מונעת, שדרוג לשער חכם,
 * שערים חשמליים השקעה), with "למשל", so it is true before and after the fold. Faults, safety and
 * repair-or-replace are left to the guides hub — they are the hub's queries (content-calendar §4).
 * Review this page again in the same change as 7.4.
 *
 * What a guide carries is limited to what `lib/guides.ts` enforces at module load: an answer block in
 * the first two blocks, at least one captioned table, and `sources` on a safety (standard) guide. No
 * claim about block order or a FAQ block, which the registry does not require. The layout question
 * itself belongs to the /מדריכים/ answer block — do not repeat it here.
 *
 * Safety canon (2026-11-10): no release or clearing procedure here. The do-it-yourself boundary is
 * the one-sentence short form plus a link to /מדריכים/שער-חשמלי-לא-נסגר/, which holds the steps;
 * the motor cover, the control board (230 וולט) and a lifting gate's springs stay a technician's.
 *
 * The answer's pointer to the guides page stays plain text: `answer` has no link field and
 * AnswerBlock renders a bare string. The working link is the same imperative in the first section
 * (N31). Ship this module only in a build where `hasGuides` is true, so the header nav links to
 * /מדריכים/.
 *
 * Copy states how things work in general and carries no unconfirmed business fact
 * (docs/business-facts.md); contact details and hours are interpolated from `siteConfig`, never
 * typed.
 */
import type { PageContent } from "@/lib/page-content";

export const page: PageContent = {
  answerHeading: "על מה כותבים בבלוג?",
  answer:
    "הפוסטים בבלוג הם סקירות קצרות וכלליות, למשל על תחזוקה מונעת, על שדרוג לשער חכם ועל השאלה אם שער חשמלי משתלם. הם לא נכנסים לדגם מסוים ולא מפנים למקור רשמי. לתשובה מפורטת על תקלה אחת, על בטיחות ותקנים או על בחירה בין סוגי שערים, עברו לעמוד המדריכים.",
  sections: [
    {
      heading: "מה ההבדל בין פוסט בבלוג לבין מדריך?",
      paragraphs: [
        "פוסט בבלוג הוא סקירה רחבה: רשימת טיפים לתחזוקה, או שיקולים בעד ונגד שדרוג לשער חכם. מדריך עוסק בשאלה אחת, ועונה עליה עד הסוף. יש לכם שאלה ממוקדת? עברו לעמוד המדריכים.",
        "בכל מדריך יש גם טבלה שמרכזת את העיקר. מדריך על תקן מפנה למקור הרשמי, כדי שתוכלו לבדוק בעצמכם.",
        "גם כשפוסט מציע לבדוק משהו לבד, שמרו על גבול ברור. אפשר להחליף סוללה בשלט. לפני שמנגבים את עדשת העינית במטלית יבשה, או נכנסים לנתיב, השער צריך להיות כבוי כך ששלט או סגירה אוטומטית לא יזיזו אותו. אם אי אפשר לוודא, מסתכלים מחוץ לנתיב ומתקשרים. המדריך לשער שנעצר לפני הסוף מפרט את הבדיקות לפי הסדר. מכסה המנוע, לוח הפיקוד (230 וולט) והקפיצים של שער מתרומם הם עבודה לטכנאי.",
      ],
      links: [
        { anchor: "עברו לעמוד המדריכים", href: "/מדריכים/" },
        { anchor: "המדריך לשער שנעצר לפני הסוף", href: "/מדריכים/שער-חשמלי-לא-נסגר/" },
      ],
    },
  ],
};
