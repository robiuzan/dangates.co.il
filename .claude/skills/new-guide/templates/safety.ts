import type { Guide } from "@/lib/guide-types";

/**
 * SAFETY family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 1 (ת״י 900 חלק 21.03) — the E-E-A-T anchor (keyword-map §12).
 *
 * Block order (content-standards §3; /new-guide family table): answer → context → what the standard
 * requires + table → who is liable → conformity checklist (ordered) → inline CTA → periodic checks →
 * FAQ → `sources`. Schema: TechArticle + FAQPage + BreadcrumbList; `sources` → `citation` (schema-graph §8).
 *
 * Every external fact is citable ONLY with the SII URL beside the sentence AND in `sources`
 * (content-hub; claims-verifier). Verified 2026-08-24 on https://www.sii.org.il/he/safety-gates:
 * the standard is ת״י 900 חלק 21.03 · a non-compliant installation is called עבירה פלילית · a Tel
 * Aviv District Court awarded ₪800,000 · fatalities and injuries are listed · only a laboratory
 * approved for the standard may test.
 * 🔶 UNVERIFIED — must NOT ship as fact until sii.org.il or gov.il says so (keyword-map §12):
 *   (1) the "October 2006" date the standard became official — competitor-sourced only;
 *   (2) whether installation legally requires a licensed electrician, or only the 230V connection.
 * The insurance consequence is competitor-sourced too; its Hebrew word and the licence words are in
 * the claim lexicon (scripts/audit/claims.json ids `insurance`, `licence`) — write around all three.
 * The skeleton is ~300 words; lib/guides.ts throws below 900.
 */
export const guide = {
  slug: "תקן-900-שער-חשמלי",
  title: "ת״י 900 חלק 21.03 — מה התקן דורש משער חשמלי, ומי אחראי כשהוא לא עומד בו",
  crumbLabel: "תקן 900 לשערים חשמליים",
  description:
    "⟨TODO: 120–160 תווים — מה התקן מכסה, מי נושא באחריות, ומה בודקים בשער קיים לפני שממשיכים להפעיל אותו.⟩",
  family: "safety",
  targetQuery: "תקן שערים חשמליים",
  datePublished: "⟨TODO: yyyy-mm-dd — the real publish day⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  // Every service: a compliant installation is a property of all seven gate types (content-hub pillar table).
  relatedServices: [
    "שערים-נגררים",
    "שערי-כנף",
    "שערים-מתרוממים",
    "שערים-לחניה",
    "שער-זרוע",
    "תריסי-גלילה-חשמליים",
    "שערים-לדירה",
  ],

  blocks: [
    // Safety question form: scope of the standard, the consequence, the SII as source (content-standards §5).
    {
      kind: "answer",
      q: "מה דורש ת״י 900 חלק 21.03 משער חשמלי?",
      a: "⟨TODO: 40–60 מילים — התקן הישראלי לבטיחות שערים ממונעים; חל על ייצור, התקנה ושיווק; מכון התקנים מגדיר התקנה שאינה עומדת בו כעבירה פלילית; רק מעבדה מאושרת לתקן רשאית לבדוק. אין תאריך ואין דרישת חשמלאי בתשובה — שניהם 🔶.⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — למה דף על תקן מעניין מישהו שהשער שלו סתם נתקע: מי נפגע, מי שילם, ומה המדריך נותן — הדרישות, האחריות, רשימת בדיקה.⟩ מכון התקנים הישראלי מתעד מקרי מוות ופציעה משערים שלא עמדו בתקן, ופסק דין שבו נפסקו 800,000 ₪ פיצויים לאישה שנפגעה ממחסום.",
      links: [
        {
          anchor: "מכון התקנים הישראלי מתעד",
          href: "https://www.sii.org.il/he/safety-gates",
        },
      ], // also in `sources`
    },

    { kind: "heading", level: 2, text: "מה התקן דורש בפועל משער ממונע?" },
    // The citable asset: one requirement per row, an SII citation per row. The 9-point list online is
    // competitor-sourced (keyword-map §12) — a row with no SII source is deleted, not softened.
    {
      kind: "table",
      caption:
        "דרישות הבטיחות המרכזיות של ת״י 900 חלק 21.03 לשערים ממונעים, לפי פרסומי מכון התקנים הישראלי — דן שערים חשמליים",
      head: ["הדרישה", "מה היא מונעת", "איך זה נראה בשער תקין", "מקור"],
      rows: [
        [
          "הגנה מפני לכידה ומעיכה",
          "⟨TODO⟩",
          "⟨TODO: חיישני כוח / היפוך תנועה⟩",
          "⟨TODO: sii.org.il URL⟩",
        ],
        ["עיניות בטיחות בקו הסגירה", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO: sii.org.il URL⟩"],
        [
          "מנורת אזהרה, שילוט והוראות חירום",
          "⟨TODO⟩",
          "⟨TODO⟩",
          "⟨TODO: sii.org.il URL⟩",
        ],
        [
          "תו תקן או תעודת בדיקה ממעבדה מאושרת",
          "⟨TODO⟩",
          "⟨TODO⟩",
          "https://www.sii.org.il/he/safety-gates",
        ],
      ],
    },

    { kind: "heading", level: 2, text: "מי אחראי כשהשער לא עומד בתקן?" },
    {
      kind: "paragraph",
      text: "⟨TODO: בעל הנכס, ועד הבית, חברת הניהול והמתקין — מה מכון התקנים אומר על כל אחד; פסק הדין של 800,000 ₪ נגד מנהלי נכס, בציטוט מהמקור. Lexicon ids `insurance` and `licence` are off-limits here.⟩ בבית משותף השאלה מי מחליט ומי משלם מתחילה עוד לפני ההתקנה, ופירטנו אותה במדריך על מחסום חניה בבית משותף.",
      links: [
        {
          anchor: "במדריך על מחסום חניה בבית משותף",
          href: "/מדריכים/מחסום-חניה-ועד-בית/",
        },
      ],
    },

    { kind: "heading", level: 2, text: "איך בודקים שער קיים מול התקן, לפי הסדר?" },
    {
      kind: "list",
      ordered: true,
      items: [
        "⟨TODO: תעודת בדיקה או תו תקן — איפה מחפשים, מה כתוב בה⟩",
        "⟨TODO: בדיקת היפוך — מה קורה כשהשער פוגש התנגדות קלה⟩",
        "⟨TODO: העיניות — מיקום, גובה, נורית⟩",
        "⟨TODO: מנורת האזהרה — פועלת לפני ובזמן התנועה⟩",
        "⟨TODO: שחרור חירום ושילוט — נגישים, מסומנים, עובדים בלי חשמל⟩",
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      text: "⟨TODO: הקו האדום — בדיקה שנכשלה בסעיף היפוך או עיניות = לא מפעילים את השער עד תיקון. חיבור לרשת 230V אינו עבודה לבעלי הבית — בלי לטעון שהחוק דורש בעל מקצוע מסוים (🔶 keyword-map §12).⟩",
    },
    // Inline CTA after the checklist: the reader now holds an unresolved variable — "did mine pass?"
    {
      kind: "cta",
      variant: "inline",
      text: "לא בטוחים אם השער שלכם עובר את הרשימה? טכנאי עובר עליה איתכם בשטח ומסביר מה חסר ומה זה דורש.",
      service: "שערים-לחניה",
    },

    { kind: "heading", level: 2, text: "כל כמה זמן בודקים שער חשמלי, ומה בודקים?" },
    {
      kind: "paragraph",
      text: "⟨TODO: תחזוקה תקופתית — מה מכון התקנים ממליץ (בציטוט), מה מתבלה בין בדיקה לבדיקה; בלי לנקוב בתדירות שאין לה מקור.⟩ מה כולל ביקור תחזוקה, ומה קובע את מחירו, מפורט בעמוד מה משפיע על מחיר תיקון שער.",
      links: [{ anchor: "מה משפיע על מחיר תיקון שער", href: "/מחירון/" }],
    },

    {
      kind: "faq",
      items: [
        {
          q: "⟨TODO: ״האם שער ישן חייב לעמוד בתקן?״ — רק אם יש מקור⟩",
          a: "⟨TODO: 40–80 מילים⟩",
        },
        {
          q: "⟨TODO: ״מי רשאי לבדוק שער לפי ת״י 900?״⟩",
          a: "⟨TODO: מעבדה מאושרת לתקן — SII⟩",
        },
        { q: "⟨TODO: ״מה ההבדל בין תו תקן לתעודת בדיקה?״⟩", a: "⟨TODO⟩" },
      ],
    },
  ],

  // Required on the safety family — lib/guides.ts throws without it; articleJsonLd maps it to `citation`.
  // Only sii.org.il / gov.il / nevo.co.il here, never a competitor.
  sources: [
    {
      label: "מכון התקנים הישראלי — שער חשמלי עלול גם להרוג",
      url: "https://www.sii.org.il/he/safety-gates",
    },
    {
      label:
        "⟨TODO: the SII page for the standard itself, once its URL is confirmed to resolve⟩",
      url: "⟨TODO⟩",
    },
  ],
} as const satisfies Guide;
