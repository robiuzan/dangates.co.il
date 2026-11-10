/**
 * The content entry for /אודות/ (backlog §3.13, Sprint 6). The field rules are the JSDoc on
 * `PageContent` in lib/page-content.ts; the bar is docs/content-standards.md §1, §4–§5.
 *
 * What the business does, and how a gate fault is diagnosed IN GENERAL: the fault reproduced, the
 * checks in the order the homepage gives them (power, remote, eyes, then motor and mechanics), why
 * the diagnosis comes before any repair — written as how diagnosis works, never as a visit
 * procedure "אנחנו" promise (no business-facts row; claims-verifier, Sprint 6 page review), the
 * seven services by the parts the work touches, the safety devices explained in general terms (עיניות, מנורת האזהרה, the manual release) and which contact channel
 * suits which situation. General technical knowledge stated as how gates and shutters work.
 *
 * It may NOT claim (docs/business-facts.md §B–§E): a named person, years in the trade or a founding
 * year, a licence, insurance, a certification or compliance with a standard, a warranty term or
 * scope, a job count, a response time, availability outside the hours, coverage, brands, or any
 * price — and it states no quote-before-work or no-obligation policy (no §D row). It claims no work
 * type for every service beyond what serviceMeta and the service pages say. It repeats no sentence
 * from `aboutIntro`, `aboutSections`, `aboutValues`, `homeAnswerBlock`, the homepage teasers and
 * FAQ, or the /שירותים/ entry. Contact details and hours are interpolated from `siteConfig`, never
 * typed. The lead form has no file field: a photo goes by email or WhatsApp, never "attach to the form".
 *
 * Safety (the safety canon, 2026-11-10): this page carries NO release, clearing or eye-test
 * procedure. It says what each device does, gives the one-sentence short form (the gate off so no
 * remote or automatic closing can move it before anyone goes to the motor or into the path; if that
 * cannot be confirmed, look from outside the path and call) and links the steps:
 * /מדריכים/שער-חשמלי-לא-נסגר/ for release and clearing, /מדריכים/תקן-900-שער-חשמלי/ for testing the
 * eyes. Never a longer variant in new words; never the reader's hand in the closing path.
 */
import { siteConfig } from "@/lib/site-config";
import type { PageContent } from "@/lib/page-content";

export const page: PageContent = {
  answerHeading: "מה עושה דן שערים חשמליים?",
  answer: `${siteConfig.name} הוא עסק לתיקון, תחזוקה והתקנה של שערים חשמליים ותריסי גלילה חשמליים, שמתחיל כל תיקון באיתור החלק שנכשל. אבחון של שער תקול מתחיל בשחזור התקלה, עובר בחשמל, בשלט ובעיניות, ורק אז מגיע למנוע ולמכניקה. כדאי גם לדעת אילו אמצעי בטיחות יש בשער שלכם, ומתי משאירים אותו לטכנאי.`,
  sections: [
    {
      heading: "איך מאבחנים שער תקול, ולמה האבחון בא לפני התיקון?",
      paragraphs: [
        "שער שלא זז לא מספר בעצמו מה נכשל בו. לכן האבחון מתחיל בשחזור התקלה: מפעילים את השער מהשלט ומהמתג, ורואים בדיוק איפה התנועה נעצרת.",
        "בבדיקה של טכנאי, כשיש מתח בשער והשלט והעיניות תקינים, מפרידים בין החשמל למכניקה: מנתקים את המתח, משחררים את המנוע ומזיזים את השער ביד. כשהשער זז בקלות, החיפוש עובר ללוח הפיקוד ולמנוע. כשהוא כבד או נתקע גם ביד, בודקים את המסילה, הצירים, הגלגלים או הקפיצים.",
        "רק כשברור איזה חלק נכשל אפשר לומר מה התיקון כולל. לפעמים מספיק לכוון, לנקות או להחליף רכיב קטן במקום. לפעמים צריך להזמין חלק שמתאים לדגם, ואז ייתכן שהתיקון יושלם בביקור נוסף.",
      ],
    },
    {
      heading: "מה כדאי להכין לפני שהטכנאי מגיע?",
      paragraphs: [
        "כמה הכנות קטנות מאפשרות לבדוק את השער כולו, ולא רק את החלק שנראה תקול:",
      ],
      list: [
        "גישה חופשית לשער משני צדדיו, למנוע או לארון שלו, ולמפסק שמזין את השער, כדי שאפשר יהיה לנתק את המתח בזמן העבודה.",
        "השלטים שבשימוש, כולל שלט שהפסיק לעבוד, ומפתח השחרור של המנוע, אם יש כזה.",
        "בבניין משותף: הודעה לדיירים שבזמן הבדיקה השער עשוי לעמוד פתוח או סגור לזמן מה.",
      ],
    },
    {
      heading: "באילו שערים ותריסים אנחנו מטפלים?",
      paragraphs: [
        "העבודה כוללת תיקון תקלות והתקנה. לשער ידני קיים אפשר גם להוסיף מנוע, ותריס ידני עם רצועה אפשר להסב לחשמלי. אלה החלקים שהעבודה נוגעת בהם בכל סוג:",
      ],
      list: [
        "שערים נגררים: המנוע, גלגל השיניים ופס השיניים, המסילה והגלגלים.",
        "שערי כנף: זרועות ההנעה או הבוכנות, הצירים, ותזמון הסגירה בין שתי כנפיים.",
        "שערים מתרוממים: המנוע, קפיצי האיזון ומנגנון ההרמה.",
        "שערים לחניה: כנף כבדה שנפתחת פעמים רבות ביום, השלטים של כל הדיירים והעיניות בנתיב הרכבים.",
        "שערי זרוע ומחסומים: הזרוע, קפיץ האיזון וזיהוי הרכב בחיישן כביש או בעינית.",
        "שערים לדירה: המנעול החשמלי, הקודן והחיבור לאינטרקום בכניסה לבניין משותף.",
        "תריסי גלילה חשמליים: המנוע הצינורי שבתוך ציר הגלילה, השלבים, התעלות והמתג או השלט.",
      ],
    },
    {
      heading: "אילו אמצעי בטיחות יש בשער חשמלי, ומה כל אחד מהם עושה?",
      paragraphs: [
        "שער חשמלי מזיז משקל רב בכוח של מנוע. אמצעי הבטיחות קיימים כדי שהתנועה תיעצר כשמשהו בדרך, ושמי שעומד ליד השער יידע שהוא זז.",
        "העיניות הן זוג רכיבים משני צדי הפתח, משדר ומקלט, וביניהם עוברת קרן אור שאינה נראית לעין. כשמשהו חוצה את הקרן בזמן סגירה, לוח הפיקוד עוצר את השער או מחזיר אותו לאחור. עדשה מלוכלכת או עינית שזזה ממקומה גורמות לשער להיעצר כשאין שום דבר בדרך. מדריך הבטיחות מסביר איך בודקים את העיניות בלי להכניס יד לנתיב.",
        "אל תנתקו ואל תעקפו עינית שגורמת לתקלות חוזרות: שער שנסגר בלי עיניות עלול לא לעצור מול רכב, אדם או בעל חיים.",
        "מנורת האזהרה מהבהבת כשהשער זז, ובחלק מההגדרות גם רגע לפני שהוא מתחיל. היא לא עוצרת את השער, אבל מזהירה את מי שעומד בצד השני של הכנף. מנורה שהפסיקה להבהב כדאי לתקן, גם כשהשער עובד.",
        "השחרור הידני מנתק את המנוע מהשער, כדי שאפשר יהיה להזיז אותו ביד בהפסקת חשמל או בתקלה. לפני שניגשים למנוע או לנתיב, השער צריך להיות כבוי כך ששלט או סגירה אוטומטית לא יזיזו אותו, ואם אי אפשר לוודא, מסתכלים מחוץ לנתיב ומתקשרים. המדריך לשער שלא נסגר עד הסוף מסביר מתי אפשר לשחרר את המנוע, ומתי זו עבודה לטכנאי.",
      ],
      links: [
        { anchor: "מדריך הבטיחות", href: "/מדריכים/תקן-900-שער-חשמלי/" },
        { anchor: "המדריך לשער שלא נסגר עד הסוף", href: "/מדריכים/שער-חשמלי-לא-נסגר/" },
      ],
    },
    {
      heading: "איזו דרך פנייה מתאימה לכל מצב?",
      paragraphs: [
        `כשהשער תקוע עכשיו, פתוח או סגור, התקשרו לטלפון ${siteConfig.phone}. שעות הפעילות הן ${siteConfig.hours.weekday}, ${siteConfig.hours.friday}.`,
        "כשקשה לתאר את התקלה במילים, שלחו בוואטסאפ, דרך הכפתור באתר, סרטון קצר של השער שצולם מחוץ לנתיב שלו.",
        `להתקנה חדשה או להוספת מנוע לשער קיים, כתבו בטופס באתר את רוחב הפתח בערך, ואיפה נמצאת נקודת החשמל הקרובה לשער. תמונה של הכניסה אפשר לשלוח בדוא״ל לכתובת ${siteConfig.email}.`,
      ],
    },
  ],
};
