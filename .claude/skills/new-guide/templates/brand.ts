import type { Guide } from "@/lib/guide-types";

/**
 * BRAND family skeleton — 🔶 BLOCKED until business-facts §C "Manufacturer training / brands" has a
 * value. Do not copy this file to content/guides/ before that row is filled by the owner.
 *
 * A brand page is honest only for a brand the business actually services (keyword-map §9 warning;
 * content-hub). A page for a motor nobody on the team can service is a lead the business cannot
 * fulfil. Until §C is answered, content-calendar #16 allows AT MOST one overview guide that names no
 * brand as "ours" — this per-brand skeleton is for the day §C lists the brands.
 * Never, in any state: dealer status, factory training, a manufacturer warranty, "יבואן", "מפיץ",
 * or a `brand` property in JSON-LD (Article + FAQPage + BreadcrumbList only). The Hebrew phrases for
 * factory training are the claim-lexicon id `certification` (scripts/audit/claims.json) and fail the audit.
 *
 * Block order (content-standards §3; /new-guide family table):
 *   answer → context → what characterises the motors → what fails first + table → parts and repair
 *   economics → inline CTA → FAQ.
 * Brands with verified Israeli presence (keyword-map §9): BFT, Nice, Somfy, Beninca; Roger is the
 * weakest evidence. Latin brand names inside Hebrew get the LTR treatment at render time — keep them
 * as plain tokens here. The skeleton is ~250 words; lib/guides.ts throws below 900.
 */
export const guide = {
  slug: "מנוע-⟨TODO: brand-slug, e.g. bft⟩-לשער-חשמלי",
  title:
    "מנועי ⟨TODO: Brand⟩ לשערים חשמליים — מה מאפיין אותם, מה נכשל ראשון ומה אפשר לתקן",
  crumbLabel: "מנועי ⟨TODO: Brand⟩",
  description:
    "⟨TODO: 120–160 תווים — סדרות המנועים הנפוצות בישראל, הכשל האופייני של כל אחת, ומה מתקנים לעומת מה מחליפים.⟩",
  family: "brand",
  targetQuery: "מנוע ⟨TODO: Brand⟩",
  datePublished: "⟨TODO: yyyy-mm-dd — the real publish day⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  // The services the motor is fitted on — never all seven; a brand rarely spans shutters and barriers.
  relatedServices: ["שערים-נגררים", "שערי-כנף"],

  blocks: [
    // Question form for the brand family: "מה מאפיין מנועי {brand} ומה נכשל בהם?" — the mechanism
    // trait, the first failure, the repair verdict. 40–60 words, no affiliation claim (content-standards §5).
    {
      kind: "answer",
      q: "מה מאפיין מנועי ⟨TODO: Brand⟩ ומה נכשל בהם ראשון?",
      a: "⟨TODO: 40–60 מילים — סוג ההנעה ולוח הפיקוד שמאפיינים את המותג; הכשל הראשון בשטח (קבל, מפסק גבול, מקלט); מה מתקנים במקום ומה דורש חלק. 🔶 המשפט ״אנחנו מתקנים מנועי X״ מותר רק אם §C אומר כך.⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — למה מי שמחפש לפי מותג הוא לרוב בעל שער קיים עם תקלה, לא קונה חדש; מה המדריך מכסה ומה לא (לא קטלוג, לא מחירון).⟩",
    },

    { kind: "heading", level: 2, text: "מה מייחד את מנועי ⟨TODO: Brand⟩ מבחינה מכנית?" },
    {
      kind: "paragraph",
      text: "⟨TODO: הנעה (בורג אינסופי / בוכנה / פס שיניים), סוג לוח הפיקוד, עינית ושלט מקוריים לעומת אוניברסליים — עובדות שאפשר לגבות מאתר היצרן, עם קישור. בלי ״איכות גרמנית/איטלקית״ ובלי סופרלטיבים.⟩ ההבדל בין הנעת שער נגרר להנעת שער כנף קובע גם מה מתבלה, ופירטנו אותו בעמוד שערים נגררים ובעמוד שערי כנף.",
      links: [
        { anchor: "שערים נגררים", href: "/services/שערים-נגררים/" },
        { anchor: "שערי כנף", href: "/services/שערי-כנף/" },
      ],
    },

    {
      kind: "heading",
      level: 2,
      text: "מה נכשל ראשון במנועי ⟨TODO: Brand⟩, ואיך זה נראה בשער?",
    },
    // The citable asset of the brand family: model line → typical failure → symptom → repairable?
    // Rows come from the technician's own job history (business-facts §F photos, §C brands) — not
    // from a competitor's brand page. An invented row is a fabricated business fact (golden rule 1).
    {
      kind: "table",
      caption:
        "סדרות המנועים הנפוצות של ⟨TODO: Brand⟩ בישראל, הכשל האופייני של כל סדרה, איך הוא נראה בשער והאם הוא בר-תיקון — דן שערים חשמליים",
      head: ["סדרת המנוע", "הכשל האופייני", "מה רואים בשער", "תיקון או החלפה"],
      rows: [
        ["⟨TODO: סדרה לשער נגרר⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: סדרה לשער כנף⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: לוח פיקוד⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: שלט / מקלט⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
      ],
    },
    {
      kind: "paragraph",
      text: "⟨TODO: משפט מעבר.⟩ כשהתסמין הוא שער שלא נסגר עד הסוף, סדר הבדיקה זהה לכל מותג ומפורט במדריך על שער חשמלי שלא נסגר.",
      links: [
        { anchor: "במדריך על שער חשמלי שלא נסגר", href: "/מדריכים/שער-חשמלי-לא-נסגר/" },
      ],
    },

    {
      kind: "heading",
      level: 2,
      text: "חלקי חילוף ל-⟨TODO: Brand⟩ — מה משתלם לתקן ומה לא?",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: זמינות חלקים בישראל (עם מקור — אתר היבואן, בלי לטעון קשר אליו), חלק מקורי מול תואם, מתי מנוע ישן לא שווה תיקון. בלי מחירים (business-facts §D ❌).⟩ מה קובע את מחיר התיקון בכל מנוע מפורט בעמוד מה משפיע על מחיר תיקון שער.",
      links: [{ anchor: "מה משפיע על מחיר תיקון שער", href: "/מחירון/" }],
    },
    {
      kind: "callout",
      tone: "note",
      text: "⟨TODO: 🔶 אחריות היצרן — אם קיימת, מי מכבד אותה ובאילו תנאים; לא לכתוב עד ש-§D מאשר. ״אחריות על העבודה״ בלבד.⟩",
    },
    // Inline CTA after the repair-economics section: the reader wants to know if THEIR unit is worth it.
    {
      kind: "cta",
      variant: "inline",
      text: "צלמו את מדבקת הדגם על המנוע ושלחו בוואטסאפ — נגיד לכם אם זו תקלה שמתקנים במקום או מנוע שהגיע לסוף דרכו.",
      service: "שערים-נגררים",
    },

    {
      kind: "faq",
      items: [
        {
          q: "⟨TODO: ״אפשר להחליף מנוע ⟨Brand⟩ במנוע אחר על אותו שער?״⟩",
          a: "⟨TODO: 40–80 מילים⟩",
        },
        { q: "⟨TODO: ״שלט אוניברסלי עובד עם ⟨Brand⟩?״⟩", a: "⟨TODO⟩" },
        { q: "⟨TODO: ״איך מזהים את דגם המנוע?״ — איפה המדבקה⟩", a: "⟨TODO⟩" },
      ],
    },
  ],
} as const satisfies Guide;
