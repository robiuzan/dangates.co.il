import type { Guide } from "@/lib/guide-types";

/**
 * SAFETY family skeleton — copy to content/guides/<slug>.ts and replace every ⟨TODO⟩.
 * Worked against content-calendar §2 row 1, which shipped in Sprint 7 (89439b7) as
 * content/guides/תקן-900-שער-חשמלי.ts — read that module before writing a second safety guide, and
 * give the new one its own slug, target query and H2s (lib/guides.ts throws on a repeated H2).
 *
 * Block order (content-standards §3; /new-guide family table): answer → context → what the standard
 * is → its official status → the building rule → what SII says and advises → the devices gates are
 * usually built with → what to check on an existing gate + table → check order + warn callout →
 * inline CTA → who may work on the supply → periodic checks → FAQ → `sources`.
 * Schema: TechArticle + FAQPage + BreadcrumbList; `sources` → `citation` (schema-graph §8).
 *
 * The facts — read on primary sources 2026-11-08/09, docs/research/2026-11-08-standards-and-law.md
 * (it outranks keyword-map §12, which predates it). Every external fact carries its URL beside the
 * sentence AND in `sources`.
 *   VERIFIED: the standard's title and scope (two voltage ceilings, never one); SII lists it
 *     "מעמד: רשמי" — which SII notes may be in whole or in part; the November 2011 edition, יפ 6351 of
 *     29/12/2011; the 2006 edition it replaced shows "תאריך ביטול 28/03/2012" on the SII page — state
 *     that only as the SII page gives it. תקנה 8 of the 2019 building-safety regulations (statute
 *     wording read on he.wikisource — say so beside the quote). חוק החשמל §6(א): electrical work on the
 *     supply is licensed work.
 *   SII's OWN STATEMENTS — attribute them to SII, never as findings: a non-compliant installation
 *     "נחשבת כעבירה פלילית"; the ₪800,000 award "according to SII" (no case name or date); cover "may"
 *     be cancelled (עשויה לבטל); the deaths and injuries are news headlines SII quotes.
 *   ⛔ NEVER: the "official since October 2006" date (REFUTED) or any first-declaration date; a single
 *     voltage ceiling; photocells (עיניות), a flashing light, force limitation, safety edges or a manual
 *     release presented as a requirement of ת״י 900 or of Israeli law — no primary list exists, the
 *     requirements are in the paid standard text; which licence grade a gate motor needs (UNVERIFIED);
 *     "only an accredited lab may test" as law (it is SII describing its own service); the 2023
 *     renumbering (UNVERIFIED).
 * The licence and insurance words are in the claim lexicon (scripts/audit/claims.json ids `licence`,
 * `insurance`) — about THIS business they never appear; about the law, only as above.
 * The skeleton is ~400 words; lib/guides.ts throws below 900.
 */

const SII_STANDARD =
  "https://www.sii.org.il/he/%D7%93%D7%A4%D7%99-%D7%9C%D7%95%D7%91%D7%99/%D7%9B%D7%9C%D7%9C%D7%99/%D7%AA%D7%A7%D7%99%D7%A0%D7%94/%D7%93%D7%A3-%D7%AA%D7%A7%D7%9F/?id=95af3efb-dc76-4640-a641-14a21a05d960";
const SII_WARNING =
  "https://www.sii.org.il/he/lobby/lab-tests-search/laboratory-test/electric-gates/safety-gates/";
const SII_ADVICE = "https://www.sii.org.il/he/electric-gates";

export const guide = {
  slug: "⟨TODO: a new Hebrew slug — תקן-900-שער-חשמלי is taken⟩",
  title: "⟨TODO: the question verbatim, bare — the layout appends the brand⟩",
  crumbLabel: "⟨TODO⟩",
  description:
    "⟨TODO: 120–160 תווים — מה התקן מכסה, מה מכון התקנים אומר, ומה בודקים בשער קיים לפני שממשיכים להפעיל אותו.⟩",
  family: "safety",
  targetQuery: "⟨TODO: one Tier-3 query no other guide targets⟩",
  // Placeholders until the deploy: set both to the real deploy day in the deploy commit, never
  // backdated (deploy-dangates, "Before you deploy").
  datePublished: "⟨TODO: yyyy-mm-dd — the deploy day⟩",
  dateModified: "⟨TODO: same as datePublished⟩",
  // Only the services the guide actually discusses — the reverse index puts it on each one.
  relatedServices: ["שערים-נגררים", "שערי-כנף", "שער-זרוע", "שערים-לחניה"],

  blocks: [
    // Safety question form: what the standard is and what it covers (content-standards §5). The
    // official status may be "in whole or in part" — say so in the answer itself, not later.
    {
      kind: "answer",
      q: "⟨TODO: question-form H2 — unique across the hub⟩",
      a: "⟨TODO: 40–60 מילים — שם התקן והיקפו כפי שמכון התקנים מציג אותם; מעמדו רשמי, ומכון התקנים מציין שרשמי יכול להיות בשלמותו או בחלקו; אין תאריך הכרזה ראשון ואין רשימת אמצעים ״שהחוק דורש״.⟩",
    },
    {
      kind: "paragraph",
      text: "⟨TODO: 60–90 מילים — למה דף על תקן מעניין מישהו שהשער שלו סתם נתקע.⟩ מכון התקנים כותב שהתקנה של שער שאינו עומד בתקן נחשבת לדבריו כעבירה פלילית.",
      links: [{ anchor: "מכון התקנים כותב", href: SII_WARNING }], // also in `sources`
    },

    { kind: "heading", level: 2, text: "⟨TODO: האם התקן רשמי, ומה זה אומר?⟩" },
    {
      kind: "paragraph",
      text: "⟨TODO: ״מעמד: רשמי״ ומהדורת 2011 (יפ 6351), כפי שהם מופיעים בדף התקן; ביטול מהדורת 2006 — רק בתאריך שדף התקן נותן ובייחוס אליו. בלי ״מאז אוקטובר 2006״.⟩ הפרטים מופיעים בדף התקן באתר מכון התקנים.",
      links: [{ anchor: "בדף התקן באתר מכון התקנים", href: SII_STANDARD }],
    },

    { kind: "heading", level: 2, text: "⟨TODO: מה מכון התקנים ממליץ לבעלי שערים?⟩" },
    // SII's own advice — the one list a primary source gives: a warning sign, periodic checks, a
    // qualified inspector (בודק מוסמך), the maker's and installer's details and instructions.
    {
      kind: "list",
      ordered: false,
      items: [
        "⟨TODO: שלט אזהרה מתאים על השער⟩",
        "⟨TODO: בדיקות תקופתיות — בלי תדירות שאין לה מקור⟩",
        "⟨TODO: בודק מוסמך⟩",
        "⟨TODO: פרטי היצרן והמתקין, הוראות תחזוקה והוראות בטיחות⟩",
      ],
    },
    {
      kind: "paragraph",
      text: "⟨TODO: משפט מעבר שמייחס את הרשימה למקור.⟩ את ההמלצות האלה מכון התקנים מפרסם בעמוד על שערים חשמליים.",
      links: [{ anchor: "בעמוד על שערים חשמליים", href: SII_ADVICE }],
    },

    {
      kind: "heading",
      level: 2,
      text: "⟨TODO: אילו אמצעי בטיחות בנויים בדרך כלל בשער חשמלי?⟩",
    },
    // The citable asset. Common construction, described by how it works — the caption says so. No
    // "required by" column and no row that reads as a legal requirement (research §A).
    {
      kind: "table",
      caption:
        "⟨TODO: אמצעי הבטיחות הנפוצים בשערים חשמליים, מה כל אחד עושה ואיך בודקים אותו בבטחה — תיאור של בנייה מקובלת, לא רשימת דרישות של התקן או של החוק⟩",
      head: [
        "אמצעי הבטיחות",
        "מה הוא עושה",
        "איך בודקים בבטחה",
        "מתי מפסיקים להפעיל את השער",
      ],
      rows: [
        ["⟨TODO: היפוך תנועה במגע / הגבלת כוח⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: עיניות בקו הסגירה⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: נורת אזהרה⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
        ["⟨TODO: שחרור ידני⟩", "⟨TODO⟩", "⟨TODO⟩", "⟨TODO⟩"],
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      text: "⟨TODO: הקו האדום — שער שלא נעצר או לא מתהפך כשהוא פוגש התנגדות לא מפעילים עד בדיקה. בלי ״התקן מחייב עיניות״ ובלי ״החוק דורש״.⟩",
    },
    // Inline CTA after the check: the reader now holds an unresolved variable — "is mine safe?"
    {
      kind: "cta",
      variant: "inline",
      text: "⟨TODO: הזמנה לבדיקה בשטח שאומרת רק מה שהאתר כבר אומר — אבחון לפני תיקון, בשעות הפעילות.⟩",
      service: "שערים-לחניה",
    },

    { kind: "heading", level: 2, text: "⟨TODO: מי רשאי לעבוד על חיבור החשמל של השער?⟩" },
    {
      kind: "paragraph",
      text: "⟨TODO: לפי סעיף 6(א) לחוק החשמל, בנוסח שקראנו בוויקיטקסט, עבודת חשמל דורשת רישיון — שאלו את מי שמחבר את הזינה לרישיון שלו. בלי דרגת רישיון ובלי טענה על רישיון של העסק.⟩ סוגי השערים והמנועים שלהם מפורטים בעמוד שערים נגררים.",
      links: [{ anchor: "בעמוד שערים נגררים", href: "/services/שערים-נגררים/" }],
    },

    {
      kind: "faq",
      items: [
        { q: "⟨TODO: שאלה שאף עמוד אחר לא שואל⟩", a: "⟨TODO: 40–80 מילים⟩" },
        { q: "⟨TODO⟩", a: "⟨TODO⟩" },
        { q: "⟨TODO⟩", a: "⟨TODO⟩" },
      ],
    },
  ],

  // Required on the safety family — lib/guides.ts throws without it; articleJsonLd maps it to
  // `citation`. Only sii.org.il / gov.il / the statute text, never a competitor. A he.wikisource link
  // says in its label that it is not the official publication (owner-actions 3.10).
  sources: [
    { label: "מכון התקנים הישראלי — דף התקן ת״י 900 חלק 21.03", url: SII_STANDARD },
    { label: "מכון התקנים הישראלי — שער חשמלי עלול גם להרוג", url: SII_WARNING },
    { label: "מכון התקנים הישראלי — שערים חשמליים", url: SII_ADVICE },
    {
      label: "חוק החשמל, התשי״ד־1954 — נוסח בוויקיטקסט, לא הפרסום הרשמי",
      url: "https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%97%D7%A9%D7%9E%D7%9C",
    },
  ],
} as const satisfies Guide;
