import { createContext, useContext } from "react";
import type { NavItem, NavMenu } from "@/lib/nav";

/** The header's link data, handed over once so the two navigation leaves share one copy. */
export interface NavData {
  /** The disclosures — services, then service areas. */
  menus: readonly NavMenu[];
  /** The remaining plain links, after the disclosures. */
  links: readonly NavItem[];
}

const NavDataContext = createContext<NavData | null>(null);

/** Provided by `DesktopNav`; read by `DesktopNav` and `MobileMenu`. Client code only (no directive needed: both importers are client leaves). */
export const NavDataProvider = NavDataContext.Provider;

/** The shared link data. Throws outside `DesktopNav`: an empty menu would ship a header with no links. */
export function useNavData(): NavData {
  const data = useContext(NavDataContext);
  if (!data) {
    throw new Error("useNavData: the header navigation must render inside <DesktopNav>.");
  }
  return data;
}
