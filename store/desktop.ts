import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_DESKTOP_ICONS } from "@/lib/apps-registry";
import type { DesktopIcon, Position } from "@/types";

interface SelectionBox {
  start: Position;
  end: Position;
}

interface DesktopStore {
  icons: DesktopIcon[];
  selectedIds: string[];
  selectionBox: SelectionBox | null;
  contextMenu: { x: number; y: number; targetId?: string } | null;
  bootComplete: boolean;
  desktopReady: boolean;
  setBootComplete: (v: boolean) => void;
  setDesktopReady: (v: boolean) => void;
  moveIcon: (id: string, gridX: number, gridY: number) => void;
  selectIcons: (ids: string[]) => void;
  clearSelection: () => void;
  setSelectionBox: (box: SelectionBox | null) => void;
  openContextMenu: (x: number, y: number, targetId?: string) => void;
  closeContextMenu: () => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      icons: DEFAULT_DESKTOP_ICONS,
      selectedIds: [],
      selectionBox: null,
      contextMenu: null,
      bootComplete: false,
      desktopReady: false,

      setBootComplete: (v) => set({ bootComplete: v }),
      setDesktopReady: (v) => set({ desktopReady: v }),

      moveIcon: (id, gridX, gridY) =>
        set((s) => ({
          icons: s.icons.map((icon) =>
            icon.id === id ? { ...icon, gridX, gridY } : icon,
          ),
        })),

      selectIcons: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),
      setSelectionBox: (box) => set({ selectionBox: box }),
      openContextMenu: (x, y, targetId) =>
        set({ contextMenu: { x, y, targetId } }),
      closeContextMenu: () => set({ contextMenu: null }),
    }),
    {
      name: "mac-portfolio-desktop-v6",
      partialize: (s) => ({ icons: s.icons }),
    },
  ),
);
