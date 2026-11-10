import Link from "next/link";
import type { InlineLink } from "@/lib/guide-types";

/**
 * In-copy links for prose that carries an `InlineLink[]` (guides, service depth, city content,
 * page content). A server-side helper: no state, no client JS.
 */

const linkClass =
  "font-semibold text-secondary underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

/**
 * Splits a paragraph on each anchor and links it in place. Anchors match on first occurrence and
 * each is applied once; `lib/guides.ts` rejects an anchor that is not present, which is the failure
 * worth catching.
 */
export function withLinks(text: string, links?: readonly InlineLink[]): React.ReactNode {
  if (!links || links.length === 0) return text;

  let nodes: React.ReactNode[] = [text];
  for (const { anchor, href } of links) {
    const next: React.ReactNode[] = [];
    let linked = false;
    for (const node of nodes) {
      if (linked || typeof node !== "string") {
        next.push(node);
        continue;
      }
      const i = node.indexOf(anchor);
      if (i === -1) {
        next.push(node);
        continue;
      }
      linked = true;
      next.push(
        node.slice(0, i),
        /^https?:\/\//.test(href) ? (
          <a key={href} href={href} className={linkClass} rel="noopener">
            {anchor}
          </a>
        ) : (
          <Link
            key={href}
            href={href}
            className={linkClass}
            {...(href === "/צור-קשר/" ? { "data-cta": "article-contact" } : {})}
          >
            {anchor}
          </Link>
        ),
        node.slice(i + anchor.length),
      );
    }
    nodes = next;
  }
  return nodes;
}
