/**
 * The content entry for /צור-קשר/ (the contact page) (Sprint 7, backlog §6.2 / §3.13). The field rules are the JSDoc on
 * `PageContent` in lib/page-content.ts; the bar is docs/content-standards.md §1, §4–§5.
 *
 * The brief is the answer block only (40–60 words, rendered first in <main>): the three channels,
 * the hours, and what to send so the fault is easier to diagnose (the gate type, what it does when
 * operated, a photo or a short video). `sections` stays empty — the page already carries the
 * details list, the form and the transparency block (`contactTransparencyCopy`), whose sentences
 * this answer must not repeat (its "שעות הפעילות: …" line and its photo line are worded apart here).
 *
 * No response-time promise, no availability outside siteConfig.hours, no "no obligation" or
 * quote-before-work policy (business-facts §D–§E). Only the phone call is tied to the hours: the
 * transparency block says a WhatsApp message or an email may be sent outside them. The lead form
 * has no file field, so a photo goes by WhatsApp or email. The WhatsApp number is not printed and
 * WhatsApp never shares a clause with the phone number (business-facts §I: 072-2587772 is not on
 * WhatsApp) — the block points to the site's WhatsApp button instead. The first sentence answers
 * both halves of the heading (§5); the form is named in full so the block stands alone. The
 * phone, the email and the hours are interpolated from `siteConfig`, never typed.
 */
import { siteConfig } from "@/lib/site-config";
import type { PageContent } from "@/lib/page-content";

export const page: PageContent = {
  answerHeading: "איך יוצרים קשר, ומה כדאי לשלוח לנו?",
  answer: `התקשרו למספר ${siteConfig.phone} בשעות הפעילות, ${siteConfig.hours.weekday} ו${siteConfig.hours.friday}, כתבו לדוא״ל ${siteConfig.email} או שלחו הודעה בכפתור הוואטסאפ שבאתר, וצרפו תמונה או סרטון קצר של התקלה. כדי להקל על האבחון, ציינו מה מותקן אצלכם, למשל שער נגרר, שער כנף, שער מתרומם, מחסום או תריס גלילה, ומה הוא עושה כשמפעילים אותו. לטופס הפנייה באתר אי אפשר לצרף קובץ.`,
  sections: [],
};
