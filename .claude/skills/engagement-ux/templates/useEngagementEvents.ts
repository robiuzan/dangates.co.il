"use client";

import { useEffect } from "react";

/**
 * useEngagementEvents — the six engagement events of docs/event-taxonomy.md, pushed to dataLayer.
 *
 *   scroll_depth   25 / 50 / 75 / 90 % of <main>            { percent }
 *   engaged_time   15 / 45 / 120 s visible AND focused       { seconds }
 *   toc_click      a link inside nav[aria-label="תוכן העניינים"]   { target: heading id }
 *   faq_open       a <details> toggled open                  { question: summary text ≤ 80 chars }
 *   related_click  a link carrying data-related="…"          { target: path, kind }
 *   outbound_click a link to another host                    { target_host }
 *
 * Every push carries page, page_type and site: "dangates". NO PII (golden rule 10): never the
 * lead's name, phone, email or message — a path and a question string are the most specific
 * values allowed.
 *
 * Lives at lib/hooks/useEngagementEvents.ts and is mounted ONCE by a null-rendering client leaf
 * (components/engagement/EngagementEvents.tsx) in app/layout.tsx. Passive listeners and one
 * rAF-throttled scroll handler keep the INP cost at zero. `toggle` does not bubble, so it is
 * captured at the document. GTM reads these as Custom Event triggers; GA4 is owner-blocked
 * (backlog §13.7) so they are counted nowhere until the property lands.
 */

/** docs/event-taxonomy.md vocabulary (the 9-value subset of scripts/audit/lib/pages.mjs routeType). */
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

const SCROLL_MARKS = ["25", "50", "75", "90"] as const;
const TIME_MARKS = ["15", "45", "120"] as const;

function pageTypeOf(pathname: string): PageType {
  const p = decodeURI(pathname);
  if (p === "/") return "home";
  if (p.startsWith("/services/")) return "service";
  if (p.startsWith("/locations/")) return "location";
  if (p.startsWith("/blog/") && p !== "/blog/") return "post";
  if (p.startsWith("/מדריכים/") && p !== "/מדריכים/") return "guide";
  if (p === "/מחירון/") return "pricing";
  if (p === "/אודות/") return "about";
  if (p === "/צור-קשר/") return "contact";
  return "other";
}

export function useEngagementEvents(): void {
  useEffect(() => {
    const page = decodeURI(window.location.pathname);
    const pageType = pageTypeOf(window.location.pathname);
    const push = (e: EngagementEvent): void => {
      (window.dataLayer ??= []).push({
        ...e,
        page,
        page_type: pageType,
        site: "dangates",
      });
    };

    // scroll_depth — percentage of <main> scrolled past, each mark once, rAF-throttled.
    const main = document.querySelector("main");
    const seenScroll = new Set<string>();
    let ticking = false;
    const onScroll = (): void => {
      if (ticking || !main) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const rect = main.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const viewed = window.scrollY + window.innerHeight - top;
        const pct = Math.max(0, Math.min(100, (viewed / rect.height) * 100));
        for (const mark of SCROLL_MARKS) {
          if (pct >= Number(mark) && !seenScroll.has(mark)) {
            seenScroll.add(mark);
            push({ event: "scroll_depth", percent: mark });
          }
        }
      });
    };

    // engaged_time — seconds the tab was visible and the window focused; background tabs do not count.
    let engaged = 0;
    let last = performance.now();
    let active = !document.hidden && document.hasFocus();
    const seenTime = new Set<string>();
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
    };
    const onActivity = (): void => {
      tick();
      active = !document.hidden && document.hasFocus();
    };
    const timer = window.setInterval(tick, 1000);

    // faq_open — native <details> toggled open; `toggle` does not bubble, hence capture.
    const onToggle = (ev: Event): void => {
      const el = ev.target;
      if (!(el instanceof HTMLDetailsElement) || !el.open) return;
      const question =
        el.querySelector("summary")?.textContent?.trim().slice(0, 80) ?? "";
      if (question) push({ event: "faq_open", question });
    };

    // toc_click / related_click / outbound_click — one delegated click listener, closest anchor.
    const onClick = (ev: MouseEvent): void => {
      const target = ev.target;
      if (!(target instanceof Element)) return;
      const a = target.closest("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;

      if (a.closest('nav[aria-label="תוכן העניינים"]')) {
        push({ event: "toc_click", target: a.hash.replace(/^#/, "") });
        return;
      }
      const kind = a.dataset.related;
      if (kind) {
        push({ event: "related_click", target: decodeURI(a.pathname), kind });
        return;
      }
      if (a.host && a.host !== window.location.host && /^https?:$/.test(a.protocol)) {
        push({ event: "outbound_click", target_host: a.host });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onActivity);
    window.addEventListener("focus", onActivity);
    window.addEventListener("blur", onActivity);
    document.addEventListener("toggle", onToggle, { capture: true });
    document.addEventListener("click", onClick, { passive: true });
    onScroll();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onActivity);
      window.removeEventListener("focus", onActivity);
      window.removeEventListener("blur", onActivity);
      document.removeEventListener("toggle", onToggle, { capture: true });
      document.removeEventListener("click", onClick);
    };
  }, []);
}
