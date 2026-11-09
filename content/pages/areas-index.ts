/**
 * The content entry for /איזורי-שירות/ (backlog §3.13, Sprint 6). The field rules are the JSDoc on
 * `PageContent` in lib/page-content.ts; the bar is docs/content-standards.md §1, §4–§5.
 *
 * How the area pages work without promising any area: what a city page and a region page describe,
 * that the way to know whether a visit is possible is to call and ask, and what decides the answer.
 * It may NOT claim coverage of any city or region (business-facts §E: קריות, שרון, צפון, דרום and
 * באר שבע are 🔶), national coverage (lexicon id national-coverage), a response or arrival time,
 * same-day or emergency availability, a travel fee, any price, or how jobs are scheduled or
 * prioritised. The four regions are named only as entries of the list, with the non-promise beside
 * them, and in their `prefixed` forms (content-standards §8). The city and region paragraphs describe
 * the list entries and "most" city pages, so they stay true while a page is still a stub. No sentence
 * lifted from areasPageCopy, serviceAreasCopy, the homepage FAQ, a city module or the /שירותים/ call
 * checklist.
 * The section "מה קובע אם אפשר לתאם ביקור, ומתי?" is gone (claims-verifier, Sprint 6 page review):
 * its list of distance, hour, fault severity and part stock stated a dispatch and triage policy that
 * business-facts §E has no row for. What is left is the non-promise and what to have ready.
 */
import type { PageContent } from "@/lib/page-content";

export const page: PageContent = {
  answerHeading: "איך בודקים אם אפשר להגיע אליכם?",
  answer:
    "כדי לדעת אם נוכל להגיע לכתובת שלכם, התקשרו ושאלו אותנו. ספרו לנו באיזה יישוב השער, איזה סוג שער זה ומה קרה לו, ונגיד לכם אם אפשר לתאם ביקור ומתי. עמודי הערים והאזורים באתר מתארים את השערים שנפוצים בכל אחד מהם, ואינם מבטיחים הגעה לכתובת מסוימת.",
  sections: [
    {
      heading: "מה מתאר עמוד של עיר?",
      paragraphs: [
        "רוב עמודי הערים מתארים את השערים שנפוצים בעיר ואת הסיבות לתקלות שלהם. בעיר של בנייני מגורים אלה בעיקר שערי חניה משותפים, שערים מתרוממים בירידה לחניון ומחסומים. בשכונות של בתים צמודי קרקע אלה שערים נגררים ושערי כנף בכניסה לחצר.",
        "גם הסביבה משנה את התמונה. ליד הים, המלח שבאוויר מאכל חלקי פלדה: פס שיניים ממתכת, צירים, ברגים ומסילות. באזורים יבשים אבק נכנס למסילה ולמנגנון, ושמש ישירה מחממת את ארון לוח הפיקוד. העמוד מקשר בין התנאים המקומיים לתקלות שאתם עשויים לראות בשער שלכם.",
        "ברוב העמודים האלה תמצאו גם שאלות שנוגעות רק לאותה עיר, את סוגי השערים שמתאימים לבנייה בה, וקישורים לערים ולאזורים הסמוכים. בחלק מהעמודים מופיעות גם שכונות ואזורים בתוך העיר. העמוד לא מפרט זמני הגעה ולא מחירים.",
      ],
    },
    {
      heading: "מה שונה בעמוד של אזור?",
      paragraphs: [
        "ארבעה מהעמודים ברשימה מתארים אזור ולא עיר: הקריות, אזור השרון, צפון הארץ ודרום הארץ. הקריות הן כמה ערים ושכונות סמוכות זו לזו, אבל צפון הארץ, דרום הארץ ואזור השרון כוללים יישובים רבים, והמרחקים בתוכם גדולים. בצפון הארץ, בדרום הארץ ובחלק מאזור השרון יש לצד הערים גם מושבים וקיבוצים.",
        "לכן שם של אזור ברשימה הוא נקודת התחלה כללית, ולא תיאור של יישוב מסוים. גם אם האזור מופיע ברשימה, אפשר לדעת אם נגיע ליישוב שלכם, ומתי, רק בשיחה, לפי הכתובת המדויקת.",
        "אם היישוב שלכם לא מופיע ברשימה בכלל, זה לא אומר שהתשובה שלילית. זה אומר רק שאין לו עמוד באתר. גם במקרה כזה, התקשרו ושאלו.",
      ],
    },
    {
      heading: "מה כדאי להכין לפני שמתקשרים מעיר או מאזור?",
      paragraphs: [
        "כדי שהשיחה תסתיים בתשובה ברורה, פתחו בפרטי המקום, ורק אחר כך תארו את התקלה. אלה הפרטים שכדאי שיהיו לפניכם:",
      ],
      list: [
        "שם היישוב, ובעיר גדולה גם השכונה. ביישוב קטן ציינו גם את העיר הקרובה אליו.",
        "סוג הנכס: בית פרטי, בניין משותף, חניון של עסק או שער הכניסה של יישוב.",
        "הדרך אל השער: שומר, קוד בכניסה לחניון, שער נוסף או חדר חשמל נעול, ומי יוכל לפתוח אותם בזמן הביקור.",
        "תמונות של המנוע ושל ארון לוח הפיקוד, אם תוכלו לשלוח אותן דרך כפתור הוואטסאפ באתר.",
      ],
    },
  ],
};
