import type { Guide } from "@/lib/guide-types";

/**
 * COMMITTEE family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 3 (מחסום חניה בבית משותף). B2B: the ועד בית audience the
 * site names and never serves (keyword-map §8.6).
 *
 * Block order (content-standards §3; /new-guide family table):
 *   answer → context → why approval is needed → approval steps + table → who pays → quote CTA →
 *   what to put in the tender → FAQ.
 * Schema: Article + FAQPage + BreadcrumbList.
 *
 * Verified (keyword-map §8.6): a shared underground car park is communal property, so a barrier
 * installation needs house-committee approval and sometimes an owners' majority.
 * NOT verified: the actual majority thresholds and which decisions need which majority. Every
 * threshold cell cites the law text itself (חוק המקרקעין, התשכ״ט-1969, פרק ו׳ — on nevo.co.il or
 * gov.il), never a competitor page; claims-verifier marks a cell without a URL ⛔ (calendar row 3).
 * The lexicon ids `insurance` and `licence` (scripts/audit/claims.json) name Hebrew words the
 * liability paragraph must be written without. Buyer vocabulary: מחסום alongside שער זרוע (§2).
 * The skeleton is ~280 words; lib/guides.ts throws below 900.
 */
export const guide = {
  slug: "מחסום-חניה-ועד-בית",
  title: "מחסום חניה בבית משותף — מה ועד הבית צריך לאשר, ומתי נדרש רוב של בעלי הדירות",
  crumbLabel: "מחסום חניה וועד בית",
  description:
    "⟨TODO: 120–160 תווים — מי מאשר התקנת מחסום בחניה משותפת, מתי צריך רוב, מי משלם ומה כותבים בהצעת המחיר.⟩",
  family: "committee",
  targetQuery: "מחסום חניה ועד בית",
  datePublished: "⟨TODO: yyyy-mm-dd — the real publish day⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  relatedServices: ["שער-זרוע", "שערים-לחניה", "שערים-לדירה"],

  blocks: [
    // Question form for the committee family: "מה ועד הבית צריך לאשר לפני התקנת מחסום?" — the rule
    // (communal property → committee decision), the exception (when a majority is needed), the
    // pointer to the law. 40–60 words, no threshold number without its source (content-standards §5).
    {
      kind: "answer",
      q: "מה ועד הבית צריך לאשר לפני התקנת מחסום בחניה?",
      a: "⟨TODO: 40–60 מילים — החניה המשותפת היא רכוש משותף, ולכן התקנת מחסום היא החלטה של הבית המשותף ולא של דייר; ועד הבית מביא אותה לאסיפה; בחלק מהמקרים נדרש רוב של בעלי הדירות (🔶 איזה רוב — רק עם ציטוט החוק). מי משלם נקבע יחד עם ההחלטה.⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — המצב הטיפוסי: רכבים זרים בחניה, דייר שרוצה מחסום, ועד שלא יודע אם הוא רשאי להחליט לבד. מה המדריך נותן: סדר האישורים, מי משלם, ומה לדרוש מהמתקין.⟩",
    },

    {
      kind: "heading",
      level: 2,
      text: "למה מחסום בחניה משותפת דורש אישור, ולא רק החלטה של הוועד?",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: רכוש משותף — מה זה כולל (חניה תת-קרקעית, שביל הגישה), ומה ההבדל בין תחזוקה שוטפת לשינוי ברכוש המשותף. ציטוט הסעיף הרלוונטי בחוק המקרקעין עם הקישור, לא פרפרזה.⟩",
      links: [
        {
          anchor: "⟨TODO: anchor verbatim from text⟩",
          href: "⟨TODO: nevo.co.il / gov.il URL of חוק המקרקעין, פרק ו׳⟩",
        },
      ],
    },

    { kind: "heading", level: 2, text: "מה סדר האישורים, ומי מחליט בכל שלב?" },
    // The citable asset of the committee family: step → who decides → threshold (law citation) → who pays.
    // A threshold cell without a law URL beside it is a ⛔ — delete the row rather than guess.
    {
      kind: "table",
      caption:
        "שלבי האישור להתקנת מחסום חניה בבית משותף — מי מחליט, איזה רוב נדרש לפי חוק המקרקעין, ומי נושא בעלות — דן שערים חשמליים",
      head: ["השלב", "מי מחליט", "הרוב הנדרש (סעיף בחוק)", "מי משלם"],
      rows: [
        ["העלאת הנושא לאסיפת הדיירים", "ועד הבית", "⟨TODO: 🔶 סעיף + URL⟩", "—"],
        [
          "החלטה על התקנת מחסום ברכוש המשותף",
          "אסיפת בעלי הדירות",
          "⟨TODO: 🔶 סעיף + URL⟩",
          "⟨TODO⟩",
        ],
        [
          "בחירת סוג המחסום ומספר השלטים",
          "⟨TODO⟩",
          "⟨TODO: 🔶 או ״אין דרישת רוב מיוחדת״ עם מקור⟩",
          "⟨TODO⟩",
        ],
        [
          "תחזוקה שוטפת ותיקונים",
          "ועד הבית",
          "⟨TODO: 🔶 סעיף + URL⟩",
          "⟨TODO: קופת הוועד לפי חלקים⟩",
        ],
        ["שלט נוסף לדייר", "⟨TODO⟩", "—", "⟨TODO: הדייר⟩"],
      ],
    },

    { kind: "heading", level: 2, text: "מי משלם על המחסום, ומי על התחזוקה שלו?" },
    {
      kind: "paragraph",
      text: "⟨TODO: החלוקה המקובלת — ההתקנה מקופת הבית לפי חלק ברכוש המשותף, שלטים לפי דירה, תחזוקה מקופת הוועד; מה קורה עם דייר שמתנגד. בלי סכומים (business-facts §D ❌) ובלי מילים מלקסיקון `insurance`.⟩ סוגי המחסומים והשערים שמתאימים לחניה משותפת מפורטים בעמוד שער זרוע ובעמוד שערים לחניה.",
      links: [
        { anchor: "שער זרוע", href: "/services/שער-זרוע/" },
        { anchor: "שערים לחניה", href: "/services/שערים-לחניה/" },
      ],
    },
    // Quote CTA after "who pays": the committee now needs a number to bring to the meeting.
    {
      kind: "cta",
      variant: "quote",
      text: "מכינים את הנושא לאסיפה? שלחו בוואטסאפ תמונה של הכניסה לחניה ומספר הדירות — נחזור עם הצעה כתובה שאפשר להביא לדיירים.",
      service: "שער-זרוע",
    },

    { kind: "heading", level: 2, text: "מה לדרוש בהצעת המחיר לפני שהוועד חותם?" },
    {
      kind: "list",
      items: [
        "⟨TODO: עמידה בת״י 900 חלק 21.03 ותעודת בדיקה — קישור למדריך התקן⟩",
        "⟨TODO: פירוט רכיבים — מנוע, זרוע, עיניות, לולאת כביש, שלטים⟩",
        "⟨TODO: מה כלול ומה לא — תשתית חשמל, חפירה, שילוט⟩",
        "⟨TODO: אחריות על העבודה — בלי תקופה (business-facts §D 🔶)⟩",
        "⟨TODO: הסדר תחזוקה ומי מקבל את קריאת השירות⟩",
      ],
    },
    {
      kind: "paragraph",
      text: "⟨TODO: משפט מעבר.⟩ מה התקן דורש ממחסום ומי נושא באחריות כשהוא לא עומד בו — במדריך על תקן 900 לשערים חשמליים. לפנייה מסודרת של ועד או חברת ניהול, עמוד צור קשר.",
      links: [
        {
          anchor: "במדריך על תקן 900 לשערים חשמליים",
          href: "/מדריכים/תקן-900-שער-חשמלי/",
        },
        { anchor: "צור קשר", href: "/צור-קשר/" },
      ],
    },

    {
      kind: "faq",
      items: [
        // "האם אתם עובדים עם לקוחות פרטיים ועסקיים?" is a homepage FAQ that gains a moreAt to this guide
        // (content-hub contract) — do NOT repeat that question here; ask the committee's own questions.
        {
          q: "⟨TODO: ״דייר אחד מתנגד — אפשר להתקין בכל זאת?״ — רק עם ציטוט החוק⟩",
          a: "⟨TODO: 40–80 מילים⟩",
        },
        {
          q: "⟨TODO: ״כמה שלטים מקבלת כל דירה?״ — מה נהוג, בלי לטעון חובה⟩",
          a: "⟨TODO⟩",
        },
        { q: "⟨TODO: ״מי מטפל בתקלה במחסום — הדייר או הוועד?״⟩", a: "⟨TODO⟩" },
      ],
    },
  ],
} as const satisfies Guide;
