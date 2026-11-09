import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * AI crawlers we explicitly allow — fleet-wide policy, identical across all sites.
 *
 * `User-agent: *` already permits these, so this block is **declarative, not
 * enforcing**. It exists so the stance is visible rather than implied, and so it
 * survives a platform default changing underneath us.
 *
 *   - Retrieval bots (OAI-SearchBot, ChatGPT-User, Claude-User, Claude-SearchBot,
 *     PerplexityBot, Perplexity-User) fetch a page to answer a live question and
 *     cite the source. For a lead-gen service site these are the whole point —
 *     a blocked crawler cannot cite what it cannot read.
 *   - Training bots (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot)
 *     bring no direct citation benefit, but there is nothing proprietary here to
 *     protect and no meaningful cost to serving them.
 *
 * ⚠️ Cloudflare can PREPEND a managed block at the edge that overrides everything
 * here — it did exactly that across this fleet until 2026-08. Nothing in this file
 * can undo it; that is a zone setting. Verify the live policy, never infer it here:
 *
 *   curl -sS -H 'Cache-Control: no-cache' "https://dangates.co.il/robots.txt?cb=$RANDOM"
 */
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

/**
 * The RSC payload files Next writes beside every index.html (backlog §1.3). They stay in out/ —
 * a soft link click fetches the target's index.txt, so deleting them would turn every internal
 * link into a full reload — but they carry the full copy of each page at a crawlable URL, so
 * they are disallowed here. There is deliberately no trailing dollar-sign anchor: the router
 * fetches /x/index.txt?_rsc=..., and a pattern matches path plus query, so an anchored rule
 * would miss the real request. /robots.txt, /sitemap.xml and a future /llms.txt contain no
 * "/index.txt" and stay reachable.
 * A bot that matches a named group ignores the star group, so every group repeats the rule.
 * Trade-off: a disallowed URL can never show an X-Robots-Tag noindex, so this is the one
 * mechanism, not a pair; it stops the fetch, which is what the backlog row's goal needs.
 */
const RSC_PAYLOAD_DISALLOW = ["/index.txt", "/*/index.txt"];

// Static /robots.txt — allow all crawling except the RSC payloads, and point to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: RSC_PAYLOAD_DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: RSC_PAYLOAD_DISALLOW },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
  };
}
