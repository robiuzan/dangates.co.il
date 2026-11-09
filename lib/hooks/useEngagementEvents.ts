/**
 * useEngagementEvents — the six engagement events of docs/event-taxonomy.md, pushed to dataLayer.
 *
 *   scroll_depth   25 / 50 / 75 / 90 % of <main>, each once per page view   { percent }
 *   engaged_time   15 / 45 / 120 s visible AND focused, each once           { seconds }
 *   toc_click      a link inside the nav[data-toc]                          { target: heading id }
 *   faq_open       a <details> in <main> toggled open by the reader         { question: <= 80 chars }
 *   related_click  a link carrying data-related="service|location|guide|post"  { target: path, kind }
 *   outbound_click a link to another host (not a data-cta call/WhatsApp link)  { target_host }
 *
 * Every push carries page, page_type and site: "dangates". NO PII (golden rule 10): never the
 * lead's name, phone, email or message, and never page text beyond the FAQ question (<= 80 chars,
 * a string the site itself wrote). Passive listeners, one rAF-throttled scroll handler, no polling
 * once the last time mark is out; `toggle` does not bubble, so it is captured at the document.
 *
 * This file carries no "use client": it is imported only by components/engagement/EngagementEvents.tsx,
 * the one client leaf (CLAUDE.md §7 ledger). GTM reads the events as Custom Event triggers; GA4 is
 * owner-blocked (B2), so they are counted nowhere until the property lands.
 */
import { useEffect } from "react";

/** docs/event-taxonomy.md vocabulary — the subset of scripts/audit/lib/pages.mjs routeType(). */
type PageType =
  | "home"
  | "service"
  | "location"
  | "post"
  | "guide"
  | "pricing"
  | "about"
  | "contact"
  | "other";

type EngagementEvent =
  | { event: "scroll_depth"; percent: "25" | "50" | "75" | "90" }
  | { event: "engaged_time"; seconds: "15" | "45" | "120" }
  | { event: "toc_click"; target: string }
  | { event: "faq_open"; question: string }
  | { event: "related_click"; target: string; kind: string }
  | { event: "outbound_click"; target_host: string };

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const SITE_ID = "dangates";
const SCROLL_MARKS = ["25", "50", "75", "90"] as const;
const TIME_MARKS = ["15", "45", "120"] as const;
const QUESTION_MAX = 80;

/** The path as a reader sees it: decoded when it is percent-encoded, left alone when it is not. */
function readablePath(pathname: string): string {
  try {
    return decodeURI(pathname);
  } catch {
    return pathname;
  }
}

function pageTypeOf(path: string): PageType {
  if (path === "/") return "home";
  if (path.startsWith("/services/")) return "service";
  if (path.startsWith("/locations/")) return "location";
  if (path.startsWith("/blog/") && path !== "/blog/") return "post";
  if (path.startsWith("/מדריכים/") && path !== "/מדריכים/") return "guide";
  if (path === "/מחירון/") return "pricing";
  if (path === "/אודות/") return "about";
  if (path === "/צור-קשר/") return "contact";
  return "other";
}

/** `pathname` re-arms every once-per-page-view mark when a soft navigation changes the page. */
export function useEngagementEvents(pathname: string): void {
  useEffect(() => {
    const page = readablePath(pathname);
    const pageType = pageTypeOf(page);
    const push = (e: EngagementEvent): void => {
      (window.dataLayer ??= []).push({
        ...e,
        page,
        page_type: pageType,
        site: SITE_ID,
      });
    };

    // scroll_depth — share of <main> scrolled past, each mark once. No call at load: a mark fires
    // only after the reader actually scrolls.
    const main = document.querySelector("main");
    const seenScroll = new Set<string>();
    let ticking = false;
    const onScroll = (): void => {
      if (ticking || !main) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const rect = main.getBoundingClientRect();
        if (rect.height <= 0) return;
        const viewed = window.innerHeight - rect.top;
        const pct = Math.max(0, Math.min(100, (viewed / rect.height) * 100));
        for (const mark of SCROLL_MARKS) {
          if (pct >= Number(mark) && !seenScroll.has(mark)) {
            seenScroll.add(mark);
            push({ event: "scroll_depth", percent: mark });
          }
        }
      });
    };

    // engaged_time — seconds the tab was visible AND the window focused; a background tab adds none.
    let engaged = 0;
    let last = performance.now();
    let active = !document.hidden && document.hasFocus();
    const seenTime = new Set<string>();
    let timer: number | undefined;
    const tick = (): void => {
      const now = performance.now();
      if (active) engaged += (now - last) / 1000;
      last = now;
      for (const mark of TIME_MARKS) {
        if (engaged >= Number(mark) && !seenTime.has(mark)) {
          seenTime.add(mark);
          push({ event: "engaged_time", seconds: mark });
        }
      }
      if (seenTime.size === TIME_MARKS.length && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };
    const onActivity = (): void => {
      tick();
      active = !document.hidden && document.hasFocus();
    };
    timer = window.setInterval(tick, 1000);

    // faq_open — a native <details> in <main> opened by the reader. The first FAQ item ships with
    // `open`, and the browser may report that as a toggle at load, so nothing counts until the
    // reader has pressed a key or a pointer.
    let touched = false;
    const onTouch = (): void => {
      touched = true;
    };
    const onToggle = (ev: Event): void => {
      const el = ev.target;
      if (!touched || !(el instanceof HTMLDetailsElement) || !el.open) return;
      if (!el.closest("main") || el.closest("[data-toc]")) return;
      const question = el
        .querySelector("summary")
        ?.textContent?.replace(/\s+/g, " ")
        .trim()
        .slice(0, QUESTION_MAX);
      if (question) push({ event: "faq_open", question });
    };

    // toc_click / related_click / outbound_click — one delegated click listener, nearest anchor.
    const onClick = (ev: MouseEvent): void => {
      const target = ev.target;
      if (!(target instanceof Element)) return;
      const a = target.closest("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;

      if (a.closest("[data-toc]")) {
        push({ event: "toc_click", target: readablePath(a.hash.replace(/^#/, "")) });
        return;
      }
      const kind = a.dataset.related;
      if (kind) {
        push({ event: "related_click", target: readablePath(a.pathname), kind });
        return;
      }
      // Call and WhatsApp links are conversion events (data-cta), not outbound citations.
      if (a.dataset.cta) return;
      if (a.host && a.host !== window.location.host && /^https?:$/.test(a.protocol)) {
        push({ event: "outbound_click", target_host: a.host });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onActivity);
    window.addEventListener("focus", onActivity);
    window.addEventListener("blur", onActivity);
    document.addEventListener("pointerdown", onTouch, { capture: true, passive: true });
    document.addEventListener("keydown", onTouch, { capture: true, passive: true });
    document.addEventListener("toggle", onToggle, { capture: true });
    document.addEventListener("click", onClick, { passive: true });

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onActivity);
      window.removeEventListener("focus", onActivity);
      window.removeEventListener("blur", onActivity);
      document.removeEventListener("pointerdown", onTouch, { capture: true });
      document.removeEventListener("keydown", onTouch, { capture: true });
      document.removeEventListener("toggle", onToggle, { capture: true });
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);
}
