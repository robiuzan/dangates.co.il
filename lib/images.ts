/**
 * images.ts — the site's accessors for content/images/manifest.json.
 *
 * The manifest is WRITTEN by the fleet toolkit (Media Studio/page-images `stage` / `install`) and
 * only READ here. It is validated at module init against the rules in
 * scripts/images/lib/manifest-rules.mjs — the same module `scripts/images/check-images-out.mjs`
 * runs on the export — so a manifest that breaks a rule cannot render a page, let alone ship.
 *
 * WHAT A PAGE MAY SHOW. `approved` entries always. `candidate` entries only when the build or dev
 * server runs with `IMAGES_DRAFT=1` (they are served from /images/_candidates/, which the gate
 * prunes from a non-draft export). `rejected` and `retired` entries never render. Nothing in this
 * file decides WHICH image goes where — that is the manifest's `placements`, authored upstream from
 * content/images/plan.json — it only answers "what renders at (route, slot) right now".
 *
 * Renderings are illustrations, never evidence: nothing exported here feeds JSON-LD or og:image,
 * and `check-images-out.mjs` fails the build if an /images/ path ever appears in one.
 */
import { locations, services } from "@/lib/site-config";
import { guides } from "@/lib/guides";
import { posts } from "@/lib/posts";
import manifestJson from "@/content/images/manifest.json";
import { galleryRoute } from "@/scripts/images/lib/images.config.mjs";
import {
  contentRoutesOf,
  isVisible,
  manifestProblems,
  pageTitles,
  routeOfRow,
  rulesContext,
  serviceName,
  srcOf as srcOfEntry,
  thumbSrcOf,
  PHONE_MEDIA,
  phoneSrcOf,
} from "@/scripts/images/lib/manifest-rules.mjs";

/** The media query below which Figure offers the phone copy (manifest-rules.mjs). */
export { PHONE_MEDIA };

export type ImageStatus = "candidate" | "approved" | "rejected" | "retired";
export type SlotId =
  | "main"
  | "detail"
  | "work"
  | "strip-1"
  | "strip-2"
  | "strip-3"
  | "pair-1"
  | "pair-2"
  | "team"
  | "story"
  | "survey"
  | "layers"
  | "lead"
  | "mid"
  | "end"
  | "supplied"
  | "generated"
  | "thumb";
export type SizeClass = "large" | "half" | "tile" | "thumb";
export type Phase = "done" | "in-progress" | "diagnosis" | "materials";
export type PersonId = "tech-a" | "tech-b";

export interface Placement {
  route: string;
  slot: SlotId;
  order: number;
}

export type Provenance =
  | {
      kind: "ai-generated";
      tool: string;
      model: string;
      created: string;
      prompt: string;
      promptSha: string;
      masterSha?: string | null;
      refs: readonly string[];
    }
  | {
      kind: "owner-supplied";
      received: string;
      /** Always false: a supplied image is never asserted to be a record of a job (contract §0). */
      originAsserted: false;
      note?: string | null;
    };

export interface Watermark {
  logo: "white" | "navy";
  corner: "bottom-right";
  widthPct: number;
}

export interface AutomatedReview {
  verdict: "pass" | "pass-with-note" | "regenerate" | "reject";
  codes: readonly unknown[];
  judges?: Record<string, string>;
  judgesDisagreed?: boolean;
  checkedAt: string | null;
}

export interface OwnerReview {
  decision: "approved" | "rejected" | "regenerate";
  by: string;
  at: string;
  note?: string | null;
}

export interface ImageThumb {
  file: string;
  width: number;
  height: number;
  bytes?: number;
  sha256?: string;
}

/** The smaller copy phones load; written after install by the toolkit's phone-copies.mjs. */
export interface ImagePhone {
  file: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
}

export interface ImageEntry {
  id: string;
  file: string;
  legacySrc: string | null;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  sizeClass: SizeClass;
  alt: string;
  caption: string | null;
  altEn: string | null;
  thumb: ImageThumb | null;
  /** The 720-px copy for phones. Only an approved entry carries one. */
  phone?: ImagePhone | null;
  placements: readonly Placement[];
  status: ImageStatus;
  people: readonly PersonId[];
  phase: Phase | null;
  service: string | null;
  city: string | null;
  provenance: Provenance;
  watermark: Watermark | null;
  review: { automated: AutomatedReview | null; owner: OwnerReview | null };
  approved: string | null;
  retired: string | null;
  /** The day a person's written notice arrived. Only on a retired entry; its file is gone. */
  revoked?: string | null;
}

export interface ImageGates {
  minPerContentPage: number;
  maxImageBytes: number;
  maxPageImageBytes: number;
  maxTotalBytes: number;
  /** A route that is allowed more image bytes than `maxPageImageBytes` (the gallery). */
  pageBudgets?: Record<string, number>;
}

export interface ImageManifest {
  version: 1;
  site: string;
  gates: ImageGates;
  images: readonly ImageEntry[];
}

/** What a component receives: resolved src, the text, and enough to decide the markup. */
export interface PlacedImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
  status: ImageStatus;
  service: string | null;
  people: readonly PersonId[];
  /** The route the image was made for (its first placement) — the gallery links back to it. */
  route: string;
  /** The derived thumbnail (the blog index and other cards), when the toolkit produced one. */
  thumb?: { src: string; width: number; height: number };
  /** The smaller copy for phones. Absent on a candidate: it is made after install. */
  phone?: { src: string; width: number; height: number };
}

/** `IMAGES_DRAFT=1` — read at build/dev time in RSC, like the live-kit's LIVE_DRAFT. */
export const imagesDraftMode = process.env.IMAGES_DRAFT === "1";

/**
 * The arrays the routes are generated from, by route group. The gate reads the same arrays through
 * ts-scan, and proves what it read against the directories of out/.
 */
const rows = {
  services,
  areas: locations,
  articles: guides,
  posts,
};

/**
 * Every route that may carry a content image: the layout in images.config.mjs, each group expanded
 * through these arrays, minus the excluded routes. A placement naming anything else fails
 * validation below.
 */
export function contentRoutes(): readonly string[] {
  return contentRoutesOf(rows);
}

/**
 * Runtime validation of the imported JSON. The assertion signature is what narrows `unknown` to
 * `ImageManifest` — a cast backed by every rule in manifest-rules.mjs, not a bare `as`.
 */
function assertManifest(raw: unknown): asserts raw is ImageManifest {
  const problems = manifestProblems(raw, rulesContext(rows));
  if (problems.length > 0) {
    throw new Error(
      `images manifest: ${problems.length} problem(s) in content/images/manifest.json\n  - ${problems.join("\n  - ")}`,
    );
  }
}

const raw: unknown = manifestJson;
assertManifest(raw);

/** The validated manifest. Read-only; the toolkit owns the file. */
export const imageManifest: ImageManifest = raw;
export const imageGates: ImageGates = imageManifest.gates;

/** Public path for an entry: legacySrc wins; approved → /images/<file>; candidate → /images/_candidates/<file>. */
export function srcOf(entry: ImageEntry): string {
  return srcOfEntry(entry);
}

const visible: readonly ImageEntry[] = imageManifest.images.filter((e) =>
  isVisible(e, imagesDraftMode),
);

function place(entry: ImageEntry): PlacedImage {
  const thumbSrc = thumbSrcOf(entry);
  const placed: PlacedImage = {
    id: entry.id,
    src: srcOf(entry),
    width: entry.width,
    height: entry.height,
    alt: entry.alt,
    caption: entry.caption,
    status: entry.status,
    service: entry.service,
    people: entry.people,
    route: entry.placements[0]?.route ?? "/",
  };
  if (entry.thumb && thumbSrc) {
    placed.thumb = {
      src: thumbSrc,
      width: entry.thumb.width,
      height: entry.thumb.height,
    };
  }
  const phoneSrc = phoneSrcOf(entry);
  if (entry.phone && phoneSrc) {
    placed.phone = {
      src: phoneSrc,
      width: entry.phone.width,
      height: entry.phone.height,
    };
  }
  return placed;
}

/** Every visible image placed at (route, slot), in placement order. Empty when none. */
export function imagesFor(route: string, slot: SlotId): PlacedImage[] {
  const placed = visible
    .flatMap((e) =>
      e.placements
        .filter((p) => p.route === route && p.slot === slot)
        .map((p) => ({ order: p.order, image: place(e) })),
    )
    .sort((a, b) => a.order - b.order);
  // Draft mode previews a candidate IN PLACE of the approved image at the same order, so a page keeps
  // its plan order; production never sees a candidate, so nothing is filtered there.
  const previewed = new Set(
    placed.filter((x) => x.image.status === "candidate").map((x) => x.order),
  );
  return placed
    .filter((x) => x.image.status === "candidate" || !previewed.has(x.order))
    .map((x) => x.image);
}

/**
 * The first of `order` (the slots in the page's DOM order) that has a visible image. That slot's
 * figure is the page's single `priority` (LCP) image, so a page whose `main` was rejected still
 * ends up with exactly one eager image — on its next slot — and never with none.
 */
export function leadSlotOf(route: string, order: readonly SlotId[]): SlotId | undefined {
  return order.find((slot) => imagesFor(route, slot).length > 0);
}

/** The first visible image at (route, slot), or undefined — the common single-figure case. */
export function imageFor(route: string, slot: SlotId): PlacedImage | undefined {
  return imagesFor(route, slot)[0];
}

/** The tiles of a page's strip or pair, in slot order (strip-1..3, then pair-1..2). */
export function stripFor(route: string): PlacedImage[] {
  const slots: SlotId[] = ["strip-1", "strip-2", "strip-3", "pair-1", "pair-2"];
  return slots.flatMap((slot) => imagesFor(route, slot));
}

/** The cards of a route's `thumb` slot: each is a derived thumbnail of its source entry. */
export function thumbsFor(route: string): PlacedImage[] {
  return imagesFor(route, "thumb").filter((image) => image.thumb);
}

const titles: ReadonlyMap<string, string> = pageTitles(rows);

/**
 * Where a gallery tile links. A reused image goes back to the page it was made for (its first
 * placement); an image made for the gallery goes to the service it shows. No such page, no link.
 */
export function pageLinkFor(image: PlacedImage): { href: string; label: string } | null {
  const href =
    image.route !== galleryRoute
      ? image.route
      : image.service
        ? routeOfRow("services", { slug: image.service })
        : null;
  const label = href ? titles.get(href) : undefined;
  return href && label ? { href, label } : null;
}

/**
 * The names of the services with an APPROVED rendering in the gallery's generated group, in list
 * order. Drives the derived «איך זה נראה — בגלריה: …» sentence on service pages, so it never
 * promises a picture the gallery does not show. Empty until the first batch is installed.
 */
export function galleryServiceNames(): readonly string[] {
  const slugs = new Set<string>();
  for (const e of imageManifest.images) {
    if (e.status !== "approved" || !e.service) continue;
    if (e.placements.some((p) => p.route === galleryRoute && p.slot === "generated"))
      slugs.add(e.service);
  }
  return rows.services.filter((s) => slugs.has(s.slug)).map((s) => serviceName(s));
}

/**
 * Whether any approved entry is a rendering. The footer line and the llms.txt note hang on this,
 * so the live site reads exactly as before until the first batch ships.
 */
export function hasApprovedRenderings(): boolean {
  return imageManifest.images.some(
    (e) => e.status === "approved" && e.provenance.kind === "ai-generated",
  );
}
