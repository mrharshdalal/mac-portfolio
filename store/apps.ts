import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DOCK_ITEMS } from "@/lib/apps-registry";
import type { AppId, DockItem } from "@/types";

interface AppsStore {
  dockApps: DockItem[];
  finderPath: string;
  finderView: "grid" | "list";
  lastActiveApp: AppId | null;
  setFinderPath: (path: string) => void;
  setFinderView: (view: "grid" | "list") => void;
  setLastActive: (id: AppId | null) => void;
}

export const useAppsStore = create<AppsStore>()(
  persist(
    (set) => ({
      dockApps: DOCK_ITEMS,
      finderPath: "favorites",
      finderView: "grid",
      lastActiveApp: null,
      setFinderPath: (finderPath) => set({ finderPath }),
      setFinderView: (finderView) => set({ finderView }),
      setLastActive: (lastActiveApp) => set({ lastActiveApp }),
    }),
    {
      name: "mac-portfolio-apps",
      partialize: (s) => ({
        finderPath: s.finderPath,
        finderView: s.finderView,
        lastActiveApp: s.lastActiveApp,
      }),
    },
  ),
);
