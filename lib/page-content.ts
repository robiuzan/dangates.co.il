/**
 * page-content.ts — the typed copy of the three index pages that need depth of their own:
 * /שירותים/, /איזורי-שירות/ and /אודות/ — and, since Sprint 7, /מדריכים/, /blog/ and /צור-קשר/ (backlog §3.13, content-standards §1 — index 250, about 500
 * unique words). One module per page under content/pages/ (`export const page: PageContent`), so the
 * three drafters never share a file. This file only types and assembles them.
 *
 * A module is EMPTY while its drafter has not reached it (`answer === ""`): the page then renders
 * exactly what it rendered before. Written, the answer block is the FIRST paragraph in <main>
 * (the PageHeader subtitle steps aside) and the sections follow it, ahead of the page's existing
 * content (the grid, the list, the values).
 *
 * Copy is Hebrew prose to the bar in docs/content-standards.md §3–§5 and §7 and carries no
 * unconfirmed business fact (docs/business-facts.md); it must not repeat a paragraph the page
 * already shows or one the homepage shows. UI frames need no labels: every heading is in the module.
 */
import { page as areasIndex } from "@/content/pages/areas-index";
import { page as servicesIndex } from "@/content/pages/services-index";
import { page as about } from "@/content/pages/about";
import { page as guidesIndex } from "@/content/pages/guides-index";
import { page as blogIndex } from "@/content/pages/blog-index";
import { page as contact } from "@/content/pages/contact";

/** One section: a question-form H2, prose, and an optional bulleted list after it. */
export interface PageContentSection {
  /** Question-form H2 (content-standards §4). */
  heading: string;
  paragraphs: readonly string[];
  /** Rendered as a bulleted list after the paragraphs. */
  list?: readonly string[];
}

export interface PageContent {
  /** Question-form H2 shown above `answer`. */
  answerHeading: string;
  /**
   * 40–60 words, self-contained, complete in its first sentence (content-standards §5). Rendered as
   * the FIRST paragraph inside <main>. Empty → the page renders as before and `sections` is ignored.
   */
  answer: string;
  /** Rendered after the answer block, question-form H2s. */
  sections: readonly PageContentSection[];
}

export const pageContent: {
  servicesIndex: PageContent;
  areasIndex: PageContent;
  about: PageContent;
  guidesIndex: PageContent;
  blogIndex: PageContent;
  contact: PageContent;
} = {
  servicesIndex,
  areasIndex,
  about,
  guidesIndex,
  blogIndex,
  contact,
};

/** Whether a page's drafter has written it (the answer block is the gate). */
export function isPageWritten(content: PageContent): boolean {
  return content.answer !== "";
}
