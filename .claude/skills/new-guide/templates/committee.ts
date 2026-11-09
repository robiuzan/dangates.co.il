import type { Guide } from "@/lib/guide-types";

/**
 * COMMITTEE family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 3, which shipped in Sprint 7 (89439b7) as
 * content/guides/מחסום-חניה-ועד-בית.ts — read that module before writing a second committee guide,
 * and give the new one its own slug, target query and H2s (lib/guides.ts throws on a repeated H2).
 * B2B: the ועד בית audience the site names and never served (keyword-map §8.6).
 *
 * Block order (content-standards §3; /new-guide family table):
 *   answer → context → why it is a building decision → what the model bylaws say, and what they do
 *   not → the decision steps + table → which costs are voted on → quote CTA → what the quote must
 *   show → FAQ.
 * Schema: Article + FAQPage + BreadcrumbList.
 *
 * The law — read 2026-11-09 on the he.wikisource consolidated text of חוק המקרקעין, התשכ״ט-1969
 * (NOT the official Reshumot publication — the copy says so beside every quote; whether that source
 * is acceptable is owner-actions 3.10), recorded in docs/research/2026-11-08-standards-and-law.md §C:
 *   ⛔ NO section sets a majority for the general assembly's own decision to install a gate or a
 *     parking barrier. Never state one, never imply one, and never give the table a "majority
 *     required" column. §59ג (an owner's accessibility route) is a separate provision — see the
 *     research file §C.
 *   VERIFIED model bylaws (they apply under §64 where the building's own registered bylaws are
 *     silent — say the building's bylaws may differ): §5(א) the assembly decides "דרכי ניהולו של
 *     הרכוש המשותף והשימוש בו"; §12(א) "יתקבלו ברוב דעות"; §13(ב) one vote per apartment; §7(א) notice
 *     four days ahead; §8(א) the quorum of half the apartments ONLY with its notice condition, and
 *     §8(ב) (the notice may set «שעה אחרת באותו יום» — another hour, never "a later" one; that
 *     meeting is lawful "בכל מספר של משתתפים") beside it.
 *   §12(ב) is never cut before "מסוג או שיעור שלא פורשו"; §58(א) does spell out a charge (upkeep and
 *     management), so whether a barrier cost binds an objecting owner is OPEN — a question for a
 *     lawyer or the מפקח על רישום מקרקעין, never answered by the guide. Never legal advice.
 *   §62(א) (changing the bylaws) and "הסכמת כל בעלי הדירות" (attaching common property to one
 *     apartment) are about other decisions — never present them as the barrier rule.
 * The lexicon ids `insurance` and `licence` (scripts/audit/claims.json) name Hebrew words the copy
 * about this business is written without. Buyer vocabulary: מחסום alongside שער זרוע (§2).
 * The skeleton is ~350 words; lib/guides.ts throws below 900.
 */

const LAW_WIKISOURCE =
  "https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%9E%D7%A7%D7%A8%D7%A7%D7%A2%D7%99%D7%9F";
const LAW_KNESSET_PDF = "https://fs.knesset.gov.il/6/law/6_lsr_208977.pdf";

export const guide = {
  slug: "⟨TODO: a new Hebrew slug — מחסום-חניה-ועד-בית is taken⟩",
  title: "⟨TODO: the question verbatim, bare — never ״מתי נדרש רוב״⟩",
  crumbLabel: "⟨TODO⟩",
  description:
    "⟨TODO: 120–160 תווים — מה האסיפה מחליטה לפי התקנון, מה בודקים בהצעת המחיר, ומה שאלה לעורך דין. בלי ״רוב נדרש״.⟩",
  family: "committee",
  targetQuery: "⟨TODO: one Tier-3 query no other guide targets⟩",
  // Placeholders until the deploy: set both to the real deploy day in the deploy commit, never
  // backdated (deploy-dangates, "Before you deploy").
  datePublished: "⟨TODO: yyyy-mm-dd — the deploy day⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  relatedServices: ["שער-זרוע", "שערים-לחניה", "שערים-לדירה"],

  blocks: [
    // Question form for the committee family: what the committee checks — the decision belongs to the
    // building, the building's bylaws may differ from the model ones, and no section we read sets a
    // majority for the general assembly's own decision to install a barrier for the building
    // (§59ג's accessibility route is separate).
    {
      kind: "answer",
      q: "⟨TODO: question-form H2 — unique across the hub⟩",
      a: "⟨TODO: 40–60 מילים — מה הוועד בודק (רישום החניה, חלוקת העלות, המפרט); לפי התקנון המצוי האסיפה מחליטה על ניהול הרכוש המשותף והשימוש בו (סעיף 5(א)); בלי רוב, בלי ״רכוש משותף״ כעובדה, בלי ״אין רוב מיוחד״; מתנגד לתשלום — שאלה לעורך דין⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — המצב הטיפוסי: רכבים זרים בחניה, דייר שרוצה מחסום, ועד שלא יודע מה לבדוק. מה המדריך נותן: סדר ההחלטה, מה בודקים בהצעת המחיר, ומתי פונים לעורך דין.⟩",
    },

    {
      kind: "heading",
      level: 2,
      text: "⟨TODO: מה התקנון המצוי קובע על החלטות האסיפה, ומה אין בו?⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: ציטוט מדויק של סעיפים 5(א), 12(א) ו־13(ב) בתקנון המצוי, ושל סעיף 64 — עם האמירה שהנוסח נקרא בוויקיטקסט ולא בפרסום הרשמי.⟩ קראנו אותם בנוסח המשולב של חוק המקרקעין בוויקיטקסט.",
      links: [
        {
          anchor: "בנוסח המשולב של חוק המקרקעין בוויקיטקסט",
          href: LAW_WIKISOURCE,
        },
      ],
    },

    { kind: "heading", level: 2, text: "⟨TODO: מה השלבים בהחלטה, ומי מעורב בכל אחד?⟩" },
    // The citable asset of the committee family: step → who is involved → what to check → source.
    // The source cell names a statute section (read on wikisource) or an SII URL — never a majority.
    {
      kind: "table",
      caption:
        "⟨TODO: שלבי ההחלטה על מחסום חניה בבית משותף — מי מעורב, מה בודקים ומה המקור, לפי נוסח חוק המקרקעין והתקנון המצוי שבתוספת לו (נוסח משולב, לא הפרסום הרשמי)⟩",
      head: ["שלב", "מי מעורב", "מה בודקים", "מקור"],
      rows: [
        [
          "⟨TODO: הודעה על האסיפה⟩",
          "⟨TODO⟩",
          "⟨TODO: ארבעה ימים מראש⟩",
          "⟨TODO: תקנון מצוי, סעיף 7(א)⟩",
        ],
        [
          "⟨TODO: מניין חוקי⟩",
          "⟨TODO⟩",
          "⟨TODO: עם תנאי ההודעה וסעיף 8(ב)⟩",
          "⟨TODO: סעיף 8(א)–(ב)⟩",
        ],
        [
          "⟨TODO: ההחלטה⟩",
          "⟨TODO⟩",
          "⟨TODO: התקנון הרשום של הבית קודם⟩",
          "⟨TODO: סעיפים 12(א), 64⟩",
        ],
        ["⟨TODO: בדיקת הצעת המחיר⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO: sii.org.il URL⟩"],
      ],
    },

    {
      kind: "heading",
      level: 2,
      text: "⟨TODO: על אילו הוצאות מצביעים, ומה קורה עם מי שלא הסכים?⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: סעיף 58(א) והשאלה הפתוחה — אם עלות מחסום מחייבת בעל דירה שהתנגד זו שאלה לעורך דין או למפקח על רישום מקרקעין; בלי סכומים (business-facts §D ❌) ובלי תשובה משפטית.⟩ סוגי המחסומים שמתאימים לחניה משותפת מפורטים בעמוד שער זרוע ובעמוד שערים לחניה.",
      links: [
        { anchor: "שער זרוע", href: "/services/שער-זרוע/" },
        { anchor: "שערים לחניה", href: "/services/שערים-לחניה/" },
      ],
    },
    // Quote CTA after the costs: the committee now needs a written quote to bring to the meeting.
    // Say only what the site already states — no walk-through or callback promise.
    {
      kind: "cta",
      variant: "quote",
      text: "⟨TODO: תמונה של הכניסה לחניה בוואטסאפ, שיחה בשעות הפעילות — בלי הבטחת זמן חזרה.⟩",
      service: "שער-זרוע",
    },

    {
      kind: "heading",
      level: 2,
      text: "⟨TODO: מה צריך להופיע בהצעת המחיר לפני ההצבעה?⟩",
    },
    {
      kind: "list",
      items: [
        "⟨TODO: פרטי היצרן והמתקין, הוראות תחזוקה והוראות בטיחות — מה שמכון התקנים ממליץ לבקש⟩",
        "⟨TODO: פירוט רכיבים — מנוע, זרוע, לולאת כביש, שלטים (עיניות כאמצעי נפוץ, לא כדרישת חוק)⟩",
        "⟨TODO: מה כלול ומה לא — תשתית חשמל, חפירה, שילוט⟩",
        "⟨TODO: אחריות על העבודה — בלי תקופה (business-facts §D 🔶)⟩",
      ],
    },
    {
      kind: "paragraph",
      text: "⟨TODO: משפט מעבר.⟩ על מה ת״י 900 חל ומה מכון התקנים ממליץ — במדריך על תקן 900 לשערים חשמליים. לפנייה מסודרת של ועד או חברת ניהול, עמוד צור קשר.",
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
        // A question the homepage, a service, a city or another guide already marks up throws at
        // module load — ask the committee's own questions.
        {
          q: "⟨TODO: שאלה שאף עמוד אחר לא שואל⟩",
          a: "⟨TODO: 40–80 מילים, בלי רוב ובלי ייעוץ משפטי⟩",
        },
        { q: "⟨TODO⟩", a: "⟨TODO⟩" },
        { q: "⟨TODO⟩", a: "⟨TODO⟩" },
      ],
    },
  ],

  // Not required on the committee family, but every quote needs its URL here and beside it.
  sources: [
    {
      label: "חוק המקרקעין, התשכ״ט-1969 — נוסח משולב בוויקיטקסט, לא הפרסום הרשמי",
      url: LAW_WIKISOURCE,
    },
    { label: "חוק המקרקעין — אתר הכנסת (PDF)", url: LAW_KNESSET_PDF },
  ],
} as const satisfies Guide;
