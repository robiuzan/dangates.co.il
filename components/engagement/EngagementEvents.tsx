"use client";

import { usePathname } from "next/navigation";
import { useEngagementEvents } from "@/lib/hooks/useEngagementEvents";

/**
 * The one client leaf behind the six engagement events (docs/event-taxonomy.md): it renders
 * nothing, mounts once in app/layout.tsx, and wires the listeners in `useEngagementEvents`. It is
 * on the client-component ledger (CLAUDE.md §7, `KNOWN_CLIENT` in scripts/audit/rtl-lint.mjs).
 * `usePathname` re-arms the once-per-page-view marks if a soft navigation ever happens.
 */
export function EngagementEvents(): null {
  useEngagementEvents(usePathname());
  return null;
}
