/**
 * The content entry for /איזורי-שירות/ (backlog §3.13, Sprint 6). The field rules are the JSDoc on
 * `PageContent` in lib/page-content.ts; the bar is docs/content-standards.md §1, §4–§5.
 *
 * How the area pages work without promising any address: what a city page and the region page
 * describe, that the way to know whether a visit is possible is to call and ask, and what to have
 * ready. The owner answered owner-actions 3.6 on 2026-11-09: חיפה, אשקלון and אזור השרון are
 * served; the קריות, צפון הארץ, דרום הארץ and באר שבע are not, and their pages were retired — their
 * old URLs 301 here, so a reader from one of them may land on this page. The answer named no other
 * listed page, so this page never says every listed area is served: it names the service area only
 * as `serviceAreaLine` does (מרכז הארץ and the listed places), always beside the per-address check
 * by phone, and says that an unlisted place outside מרכז הארץ is outside it. ירושלים is served
 * (owner-actions 3.11, answered «yes» in chat on 2026-11-11): it gets the same per-address check as
 * every other place, and no sentence of its own. Being served is still not a promise:
 * this page may NOT state a response or arrival time, same-day or emergency availability, a travel
 * fee, any price, or how jobs are scheduled or prioritised, and it may not name any retired area or
 * invite its residents to call. No national coverage (lexicon id national-coverage): the business
 * does not serve the whole country. The one region left, אזור השרון, is named in its `prefixed`
 * form (content-standards §8). No sentence lifted from areasPageCopy, serviceAreasCopy, the homepage
 * FAQ, a city module or the /שירותים/ call checklist.
 * The section "מה קובע אם אפשר לתאם ביקור, ומתי?" is gone (claims-verifier, Sprint 6 page review):
 * its list of distance, hour, fault severity and part stock stated a dispatch and triage policy that
 * business-facts §E has no row for. What is left is the non-promise and what to have ready.
 */
import type { PageContent } from "@/lib/page-content";

export const page: PageContent = {
  answerHeading: "איך בודקים אם אפשר להגיע אליכם?",
  answer:
    "כדי לדעת אם נוכל להגיע לכתובת שלכם, התקשרו ושאלו אותנו. ספרו לנו באיזה יישוב השער, איזה סוג שער זה ומה קרה לו, ונגיד לכם אם אפשר לתאם ביקור ומתי. עמודי הערים ועמוד אזור השרון באתר מתארים אילו שערים נפוצים בכל אחד מהמקומות האלה, ואינם מבטיחים הגעה לכתובת מסוימת.",
  sections: [
    {
      heading: "מה מתאר עמוד של עיר?",
      paragraphs: [
        "רוב עמודי הערים מתארים את השערים שנפוצים בעיר ואת הסיבות לתקלות שלהם. בעיר של בנייני מגורים אלה בעיקר שערי חניה משותפים, שערים מתרוממים בירידה לחניון ומחסומים. בשכונות של בתים צמודי קרקע אלה שערים נגררים ושערי כנף בכניסה לחצר.",
        "גם הסביבה משנה את התמונה. ליד הים, המלח שבאוויר מאכל חלקי פלדה: פס שיניים ממתכת, צירים, ברגים ומסילות. באזורים יבשים אבק נכנס למסילה ולמנגנון, ושמש ישירה מחממת את ארון לוח הפיקוד.",
        // Every city page links to its nearby pages (lib/nearby.ts → nearbyPairs), so the links are
        // not under «ברוב»; and they are neighbours, not "the closest" — only חיפה's single link is
        // documented as its nearest page.
        "ברוב העמודים האלה תמצאו גם שאלות שנוגעות רק לאותה עיר ואת סוגי השערים שמתאימים לבנייה בה. כל עמוד מקשר גם לעמודים של מקומות שכנים, או, כשאין לו שכן באתר, לעמוד הקרוב אליו ביותר. העמוד לא מפרט זמני הגעה ולא מחירים.",
      ],
      links: [{ anchor: "סוגי השערים", href: "/שירותים/" }],
    },
    {
      heading: "מה שונה בעמוד של אזור השרון?",
      paragraphs: [
        "עמוד אחד ברשימה מתאר אזור ולא עיר: אזור השרון, חבל ארץ במישור החוף צפונית לתל אביב, עם ערים ובחלקים ממנו גם מושבים וקיבוצים. לכן במקום רשימת שכונות, העמוד מונה את היישובים והאזורים שנכללים בו. הוא מתאר שני גורמים שחוזרים בשערים בכל האזור: ממטרות גינה שמרטיבות את השער, ועלווה של עצים בוגרים שמסתירה את העיניות. הוא מסביר גם מה אדמת החמרה עושה לעמודי השער בחורף, ומה מבדיל שער ליד הים משער רחוק ממנו.",
        "לשתי ערים באזור השרון, נתניה וכפר סבא, יש עמודים משלהן, עם השכונות והשאלות של כל אחת מהן. אם השער שלכם באחת מהן, התחילו בעמוד של העיר. אם הוא ביישוב אחר באזור השרון, עמוד האזור הוא נקודת ההתחלה, ואת השאלה אם נגיע ליישוב שלכם, ומתי, בודקים בשיחה לפי הכתובת המדויקת.",
      ],
    },
    {
      heading: "מה אם היישוב שלכם לא מופיע ברשימה?",
      paragraphs: [
        // The retired קריות, צפון, דרום and באר שבע URLs 301 here (owner-actions 3.6), so this section
        // must not invite a reader from an unserved area to call: the invitation is bounded to מרכז
        // הארץ, and the service area is the site's own serviceAreaLine (מרכז הארץ and the listed areas).
        "אנחנו לא נותנים שירות בכל אזור בארץ. אזור השירות שלנו הוא מרכז הארץ והמקומות שמופיעים ברשימה, ובכל כתובת בודקים בשיחה אם נוכל להגיע אליה, ומתי. אם היישוב שלכם במרכז הארץ ואין לו עמוד באתר, זה אומר רק שלא כתבנו עליו עמוד, ואפשר לשאול עליו בטלפון. יישוב מחוץ למרכז הארץ שאינו ברשימה נמצא מחוץ לאזור השירות.",
      ],
    },
    {
      heading: "מה כדאי להכין לפני שמתקשרים?",
      paragraphs: ["פתחו את השיחה בפרטי המקום, ורק אחר כך תארו את התקלה:"],
      list: [
        "שם היישוב, ובעיר גדולה גם השכונה. ביישוב קטן ציינו גם את העיר הקרובה אליו.",
        "סוג הנכס: בית פרטי, בניין משותף, חניון של עסק או שער הכניסה של יישוב.",
        "הדרך אל השער: שומר, קוד בכניסה לחניון, שער נוסף או חדר חשמל נעול, ומי יוכל לפתוח אותם בזמן הביקור.",
      ],
    },
  ],
};
