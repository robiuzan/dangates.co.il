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
 * The do-it-yourself boundary matches the service depth modules: the track is cleared only with the
 * motor released, never by opening the control board, touching 230V wiring or a lifting gate's
 * springs.
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
        "גם כשפוסט מציע לבדוק משהו לבד, שמרו על גבול ברור. אפשר לנגב בעצמכם את העדשה של העינית, להחליף סוללה בשלט ולהוציא אבן מהמסילה. את האבן מוציאים ביד רק כשהשער לא יכול לזוז. כבו אותו במפסק שלו, אם הוא מסומן, והחזיקו אצלכם את כל השלטים. לחצו על שלט מחוץ למסלול הכנף: השער לא אמור להגיב. אם אין מפסק מסומן או שהשער הגיב, הוא לא כבוי, ושלט של מישהו אחר או סגירה אוטומטית יכולים להזיז את הכנף בלי אזהרה. במצב כזה עבדו רק מחוץ למסלול הכנף, עם מטאטא ארוך. פתיחה של לוח הפיקוד, חיבורים של 230 וולט וקפיצים של שער מתרומם הם עבודה לטכנאי.",
      ],
      links: [{ anchor: "עברו לעמוד המדריכים", href: "/מדריכים/" }],
    },
  ],
};
