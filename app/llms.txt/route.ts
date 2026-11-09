import { buildLlmsTxt } from "@/lib/llms";

/**
 * /llms.txt — emitted as out/llms.txt by the static export. Generated from the data (lib/llms.ts)
 * so it can never drift from the sitemap: the page list, contact details, hours and the
 * "do not attribute" notes all come from the same sources the site renders. `app/robots.ts` is
 * unchanged — it already allows the AI crawlers that read this file.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
