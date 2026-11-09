/**
 * related-posts.ts — which posts a blog post links to under "מאמרים נוספים" (backlog §9.4, audit
 * 2026-11-09 M7). It replaced `posts.filter(...).slice(0, 4)`, which sent the same five leading
 * posts to every page and left six of the eleven with no inbound related link.
 *
 * Relevance is measured from the post's own text, so a new post is placed with no hand-kept list:
 * each post is reduced to a weighted set of word stems (title ×3, excerpt ×2, section headings ×1),
 * and two posts score the sum, over the stems they share, of that stem's rarity (`ln(N / df)`) times
 * the smaller of the two weights. A stem every post uses ("שער", "חשמלי") scores nothing; one that
 * only two posts use scores most. Nothing reads or edits a sentence of `lib/posts.ts`.
 *
 * Deterministic: no clock, no randomness. Ties go to the post with fewer inbound links so far
 * (posts are processed in array order), then to the slug. A repair pass then guarantees that every
 * post receives at least one related link from some other post, and the module-load check below
 * throws (so `next build` fails) on a self-link, a duplicate, a wrong count or an unreached post.
 */
import { posts, type Post } from "@/lib/posts";

/** Related posts shown on each post page. */
export const RELATED_POST_COUNT = 4;

const PREFIXES = "הוכלמבש";

/** Function words and the words every post shares by topic; they carry no relevance. */
const STOPWORDS = new Set<string>([
  "של",
  "את",
  "על",
  "עם",
  "או",
  "גם",
  "כל",
  "לא",
  "זה",
  "זו",
  "הוא",
  "היא",
  "אם",
  "כי",
  "אל",
  "מה",
  "איך",
  "למה",
  "כדי",
  "רק",
  "יותר",
  "אתם",
  "שלכם",
  "שלך",
  "כאן",
  "עליכם",
  "אפשר",
  "צריך",
  "כמה",
  "אחרי",
  "לפני",
  "בין",
  "עד",
  "מאוד",
  "באמת",
  "הכי",
  "זהו",
  "אלה",
  "אלא",
  "כך",
  "שלכן",
  "ידי",
  "דרך",
]);

/** A rough Hebrew stem: the letters only, one leading ו, one leading prefix letter, a plural ending off. */
function stem(raw: string): string {
  let w = raw;
  if (w.length >= 4 && w.startsWith("ו")) w = w.slice(1);
  if (w.length >= 4 && PREFIXES.includes(w.charAt(0))) w = w.slice(1);
  if (w.length >= 5 && (w.endsWith("ים") || w.endsWith("ות"))) w = w.slice(0, -2);
  return w;
}

function stems(text: string): string[] {
  return text
    .normalize("NFC")
    .split(/[^א-ת]+/)
    .filter((w) => w.length > 0)
    .map(stem)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/** stem → weight, the heaviest field the stem appears in. */
function weights(post: Post): Map<string, number> {
  const out = new Map<string, number>();
  const add = (text: string, weight: number) => {
    for (const s of stems(text)) out.set(s, Math.max(out.get(s) ?? 0, weight));
  };
  add(post.title, 3);
  add(post.excerpt, 2);
  for (const b of post.blocks) if (b.type === "h") add(b.text, 1);
  return out;
}

function buildRelated(list: readonly Post[]): Map<string, readonly Post[]> {
  const bags = list.map(weights);
  const df = new Map<string, number>();
  for (const bag of bags) for (const s of bag.keys()) df.set(s, (df.get(s) ?? 0) + 1);

  const score = (i: number, j: number): number => {
    const a = bags[i];
    const b = bags[j];
    if (!a || !b) return 0;
    let total = 0;
    for (const [s, wa] of a) {
      const wb = b.get(s);
      if (wb === undefined) continue;
      total += Math.log(list.length / (df.get(s) ?? 1)) * Math.min(wa, wb);
    }
    return total;
  };

  const n = list.length;
  const count = Math.min(RELATED_POST_COUNT, n - 1);
  const inbound = new Array<number>(n).fill(0);
  const chosen: number[][] = [];

  const slugOf = (i: number) => list[i]?.slug.normalize("NFC") ?? "";

  for (let i = 0; i < n; i++) {
    const ranked = Array.from({ length: n }, (_, j) => j)
      .filter((j) => j !== i)
      .sort(
        (x, y) =>
          score(i, y) - score(i, x) ||
          (inbound[x] ?? 0) - (inbound[y] ?? 0) ||
          slugOf(x).localeCompare(slugOf(y), "he"),
      )
      .slice(0, count);
    for (const j of ranked) inbound[j] = (inbound[j] ?? 0) + 1;
    chosen.push(ranked);
  }

  // Repair: a post nobody links to takes the place of the weakest link, on the post most like it,
  // whose target is still linked from somewhere else.
  for (let u = 0; u < n; u++) {
    if ((inbound[u] ?? 0) > 0) continue;
    const hosts = Array.from({ length: n }, (_, s) => s)
      .filter((s) => s !== u)
      .sort(
        (x, y) => score(y, u) - score(x, u) || slugOf(x).localeCompare(slugOf(y), "he"),
      );
    for (const s of hosts) {
      const links = chosen[s];
      if (!links) continue;
      const weakest = links
        .filter((t) => (inbound[t] ?? 0) > 1)
        .sort(
          (x, y) => score(s, x) - score(s, y) || slugOf(x).localeCompare(slugOf(y), "he"),
        )[0];
      if (weakest === undefined) continue;
      links[links.indexOf(weakest)] = u;
      inbound[weakest] = (inbound[weakest] ?? 0) - 1;
      inbound[u] = (inbound[u] ?? 0) + 1;
      break;
    }
  }

  const out = new Map<string, readonly Post[]>();
  list.forEach((post, i) => {
    const related = (chosen[i] ?? []).flatMap((j) => list[j] ?? []);
    // Strongest first, so the page reads most relevant to least.
    related.sort(
      (x, y) =>
        score(i, list.indexOf(y)) - score(i, list.indexOf(x)) ||
        x.slug.normalize("NFC").localeCompare(y.slug.normalize("NFC"), "he"),
    );
    out.set(post.slug, related);
  });
  return out;
}

const relatedBySlug = buildRelated(posts);

/** The posts a post page links to, most relevant first; never the post itself. */
export function relatedPosts(slug: string): readonly Post[] {
  return relatedBySlug.get(slug) ?? [];
}

// ── module-load checks ───────────────────────────────────────────────────────

function validateRelatedPosts(): void {
  const reached = new Set<string>();
  const expected = Math.min(RELATED_POST_COUNT, posts.length - 1);
  for (const post of posts) {
    const related = relatedPosts(post.slug);
    const seen = new Set<string>();
    for (const r of related) {
      if (r.slug === post.slug) {
        throw new Error(`relatedPosts("${post.slug}") lists the post itself.`);
      }
      if (seen.has(r.slug)) {
        throw new Error(`relatedPosts("${post.slug}") lists "${r.slug}" twice.`);
      }
      seen.add(r.slug);
      reached.add(r.slug);
    }
    if (related.length !== expected) {
      throw new Error(
        `relatedPosts("${post.slug}") has ${related.length} links, expected ${expected}.`,
      );
    }
  }
  for (const post of posts) {
    if (!reached.has(post.slug)) {
      throw new Error(
        `No post links to "${post.slug}" — every post must receive at least one related link.`,
      );
    }
  }
}

validateRelatedPosts();
