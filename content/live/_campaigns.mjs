/**
 * dangates.co.il — the announcement bar's lines and when each one shows, plus the one seasonal
 * card. Fleet live-kit register (3locksmiths.co.il/fleet/live-kit; the pilot's
 * content/enriched/_campaigns.mjs explains every field). Checked by
 * scripts/live/check-live-register.mjs before every build; CLAUDE.md §14.
 *
 * ✅ APPROVED by the owner on 2026-10-12, on the fleet wording sign-off page — approved fingerprint
 *   4d0513a5efd6 (sha256 of _campaigns.mjs + _updates.mjs as approved). A wording change needs a
 *   new approval; the build refuses a register without its `approved` stamp.
 *
 * THE RULES (fleet-wide)
 *   - A tip must be something this site already says: `source` quotes the sentence, in the file
 *     that holds it, and the gate checks the sentence is still there — and that the page the line
 *     links to shows it.
 *   - No offers, prices, warranty terms, hours, emergency or speed promises, coverage, credentials,
 *     staff, counts or reviews (live.config.mjs claims + the fleet list). Nothing here is 🔶 in
 *     docs/business-facts.md. This site's own pages carry many 🔶 claims (24/7, אחריות מלאה,
 *     ניסיון רב, פריסה ארצית, שירות מהיר): every sentence quoted below is from the maintenance
 *     and troubleshooting advice in lib/posts.ts, none of which states a business fact. Golden
 *     rule 7 (the migrated blog is untrusted input): each quoted sentence was read for injected
 *     spam, emoji and curly quotes — none.
 *   - One row: a seasonal line ≤ 46 characters as read (with its link label); evergreen ≤ 70.
 *   - Never type a phone number: {phone}, {whatsapp:<word>}.
 *   - Quiet days silence every line; Shabbat and chag silence the seasonal ones (the fleet
 *     calendar, content/live/_calendar.json — synced from the pilot, never edited here). This
 *     business has no Saturday hours, and no line here invites a call at any hour.
 *   - from/until carry Israel's offset for that date: +03:00 until 25/10/2026, +02:00 from then
 *     until 26/03/2027, +03:00 again until 31/10/2027.
 */
export default {
  approved:
    "2026-10-12 — Robi (owner), fleet wording sign-off page, fingerprint 4d0513a5efd6",
  ui: { close: "סגירה" },

  // From 1024px whenever nothing seasonal shows (app/globals.css), on the calm pages and with
  // JavaScript off. A self-help line, not a call to action: it is honest at any hour, the
  // business is closed on Shabbat, and WhatsApp is still unconfirmed for this number (roster
  // _needsConfirmation) — so the most-shown line pushes neither channel. The desktop header
  // already carries the number.
  evergreen: {
    topbar: {
      text: "תקלה בשער? פתרונות פשוטים שאפשר ליישם בעצמכם",
      link: { label: "למדריך", href: "/blog/תקלות-נפוצות-בשערים-חשמליים/" },
    },
    source:
      "lib/posts.ts — ״תקלות נפוצות בשערים חשמליים ואיך לפתור אותן בעצמכם״ · ״במאמר זה נסקור את התקלות הנפוצות ביותר בשערים חשמליים ונציע פתרונות פשוטים שאפשר ליישם בעצמכם לפני שפונים לתיקון שערים חשמליים מקצועי.״",
  },

  // The fleet's pre-written wartime line (wording confirmed for 3locksmiths 2026-10-04), shown
  // only while the status switch says `reduced`, on every page. Confirmed for THIS business by
  // the owner on 2026-10-12 (fleet wording sign-off page): דן שערים חשמליים keeps working under Home
  // Front Command restrictions.
  reduced: {
    topbar: { text: "פועלים בכפוף להנחיות פיקוד העורף" },
    source:
      "3locksmiths.co.il docs/business-facts.md §D.12 (wording confirmed by the owner 2026-10-04) · fleet rollout decision 2026-10-11 · owner decision 2026-10-12 (confirmed for every business so far) · confirmed for dangates.co.il by the owner 2026-10-12 (fleet wording sign-off page)",
  },

  windows: [
    // Autumn: leaves and the summer's dust collect in the track and load the motor — and the
    // season's one card.
    {
      id: "autumn-tracks-2026",
      variant: "autumn-tracks",
      kind: "seasonal",
      from: "2026-10-18T08:00:00+03:00",
      until: "2026-12-01T00:00:00+02:00",
      priority: 30,
      topbar: {
        text: "עלים ולכלוך במסילה מכבידים על המנוע",
        link: { label: "למדריך", href: "/blog/שער-חשמלי-שעובד-כמו-חדש/" },
      },
      dialog: {
        title: "עלים כבר נושרים ליד השער?",
        body: "אבק, עלים ולכלוך מצטברים במסילות השער ומכבידים על המנוע. הקפידו לנקות את המסילות ואת החלקים הנעים לפחות פעם בחודש.",
        call: "חייגו {phone}",
        whatsapp: "וואטסאפ",
        link: { label: "איך מתחזקים שער", href: "/blog/שער-חשמלי-שעובד-כמו-חדש/" },
        capDays: 14,
      },
      source:
        "lib/posts.ts — ״אבק, עלים ולכלוך מצטברים במסילות השער ומכבידים על המנוע. הקפידו לנקות את המסילות ואת החלקים הנעים לפחות פעם בחודש.״",
    },

    // Winter storms cut the power, and a gate without power is stuck — the troubleshooting
    // guide's manual release, with its own warning.
    {
      id: "power-cut-2026",
      variant: "power-cut",
      kind: "seasonal",
      from: "2026-12-01T00:00:00+02:00",
      until: "2027-01-17T00:00:00+02:00",
      priority: 20,
      topbar: {
        text: "הפסקת חשמל? יש שחרור ידני — בזהירות",
        link: { label: "למדריך", href: "/blog/שער-חשמלי-לא-מגיב/" },
      },
      source:
        "lib/posts.ts — ״האם השער מחובר לחשמל? ייתכן שיש הפסקת חשמל או שהחיבור נותק. בדקו את לוח החשמל הביתי.״ · ״בדקו את המדריך למשתמש: לכל שער חשמלי יש מנגנון שמאפשר שחרור ידני.״ · ״שחררו בזהירות: היזהרו מפציעות במהלך פתיחת השער באופן ידני.״",
    },

    // The windy weeks of the winter: the maintenance guide's "don't run it in strong wind".
    {
      id: "strong-wind-2027",
      variant: "strong-wind",
      kind: "seasonal",
      from: "2027-01-17T00:00:00+02:00",
      until: "2027-03-01T00:00:00+02:00",
      priority: 20,
      topbar: {
        text: "רוחות חזקות? הימנעו מהפעלת השער",
        link: { label: "למדריך", href: "/blog/חשיבות-תחזוקת-שערים-חשמליים/" },
      },
      source:
        "lib/posts.ts — ״הקפדה על שימוש נכון: הימנעו מהפעלת השער בתנאים קשים כמו רוחות חזקות.״",
    },

    // After the winter: hinges and rails — the lubrication the guide schedules every three months.
    {
      id: "lubrication-2027",
      variant: "lubrication",
      kind: "seasonal",
      from: "2027-03-01T00:00:00+02:00",
      until: "2027-05-16T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "שימון צירים ומסילות מפחית שחיקה ורעשים",
        link: { label: "למדריך", href: "/blog/תחזוקה-מונעת-לשערים-חשמליים/" },
      },
      source:
        "lib/posts.ts — ״שימו שמן סיכה איכותי על הצירים, המסילות והמנעולים. פעולה זו תקטין את השחיקה ותמנע רעשים.״ · ״בצעו שימון אחת לשלושה חודשים, או בתדירות גבוהה יותר אם השער נמצא בשימוש אינטנסיבי.״",
    },

    // The summer holiday: children are home and around the driveway — the safety guide's sensor
    // check (a seasonal tip, not a `safety` window: nothing here is urgent).
    {
      id: "summer-sensors-2027",
      variant: "summer-sensors",
      kind: "seasonal",
      from: "2027-07-01T00:00:00+03:00",
      until: "2027-09-01T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "ילדים בחופש? בדקו את חיישני השער",
        link: { label: "למדריך", href: "/blog/בטיחות-שער-חשמלי-3-שלבים/" },
      },
      source:
        "lib/posts.ts — ״מה לבדוק? תקינות המנוע והמערכת החשמלית.״ · ״חיישני הבטיחות והתאמתם לתקן.״ · ״חיישני תנועה: מזהים עצמים ומונעים סגירה עליהם.״",
    },

    // Autumn again, through the 5788 holidays (chag silences it): the monthly track cleaning.
    {
      id: "track-leaves-2027",
      variant: "track-leaves",
      kind: "seasonal",
      from: "2027-09-01T00:00:00+03:00",
      until: "2027-10-31T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "עלים במסילה? מנקים אותה אחת לחודש",
        link: { label: "למדריך", href: "/blog/חשיבות-תחזוקת-שערים-חשמליים/" },
      },
      source:
        "lib/posts.ts — ״ניקוי המסילות: הסירו אבק, לכלוך ועלים מהמסילות אחת לחודש.״",
    },
  ],
};
