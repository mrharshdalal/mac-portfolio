import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APP_DEFINITIONS } from "@/lib/apps-registry";
import type { AppId, Position, Size, WindowState } from "@/types";

function createWindow(id: AppId): WindowState {
  const def = APP_DEFINITIONS[id];
  return {
    id,
    title: def.title,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex: 0,
    position: { ...def.defaultPosition },
    size: { ...def.defaultSize },
  };
}

const ALL_APPS = Object.keys(APP_DEFINITIONS) as AppId[];

interface WindowsStore {
  windows: Record<AppId, WindowState>;
  topZ: number;
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  minimize: (id: AppId) => void;
  restore: (id: AppId) => void;
  maximize: (id: AppId) => void;
  focus: (id: AppId) => void;
  blurAll: () => void;
  updatePosition: (id: AppId, position: Position) => void;
  updateSize: (id: AppId, size: Size) => void;
  setBounds: (id: AppId, position: Position, size: Size) => void;
  getOpenWindows: () => WindowState[];
  isRunning: (id: AppId) => boolean;
}

export const useWindowsStore = create<WindowsStore>()(
  persist(
    (set, get) => ({
      windows: Object.fromEntries(
        ALL_APPS.map((id) => [id, createWindow(id)]),
      ) as Record<AppId, WindowState>,
      topZ: 10,

      open: (id) => {
        const { windows, topZ } = get();
        const nextZ = topZ + 1;
        set({
          topZ: nextZ,
          windows: {
            ...windows,
            [id]: {
              ...windows[id],
              isOpen: true,
              isMinimized: false,
              isFocused: true,
              zIndex: nextZ,
            },
          },
        });
        // Unfocus others
        const updated = { ...get().windows };
        for (const key of ALL_APPS) {
          if (key !== id && updated[key]) {
            updated[key] = { ...updated[key], isFocused: false };
          }
        }
        set({ windows: updated });
      },

      close: (id) => {
        const { windows } = get();
        set({
          windows: {
            ...windows,
            [id]: {
              ...windows[id],
              isOpen: false,
              isMinimized: false,
              isMaximized: false,
              isFocused: false,
              zIndex: 0,
            },
          },
        });
      },

      minimize: (id) => {
        const { windows } = get();
        set({
          windows: {
            ...windows,
            [id]: {
              ...windows[id],
              isMinimized: true,
              isFocused: false,
            },
          },
        });
      },

      restore: (id) => {
        get().open(id);
      },

      maximize: (id) => {
        const { windows, topZ } = get();
        const win = windows[id];
        if (!win) return;

        if (win.isMaximized) {
          set({
            topZ: topZ + 1,
            windows: {
              ...windows,
              [id]: {
                ...win,
                isMaximized: false,
                isFocused: true,
                zIndex: topZ + 1,
                position: win.prevPosition ?? win.position,
                size: win.prevSize ?? win.size,
                prevPosition: undefined,
                prevSize: undefined,
              },
            },
          });
        } else {
          set({
            topZ: topZ + 1,
            windows: {
              ...windows,
              [id]: {
                ...win,
                isMaximized: true,
                isFocused: true,
                zIndex: topZ + 1,
                prevPosition: win.position,
                prevSize: win.size,
                position: { x: 0, y: 28 },
                size: {
                  width: typeof window !== "undefined" ? window.innerWidth : 1280,
                  height:
                    typeof window !== "undefined" ? window.innerHeight - 28 - 80 : 800,
                },
              },
            },
          });
        }
      },

      focus: (id) => {
        const { windows, topZ } = get();
        if (!windows[id]?.isOpen || windows[id].isMinimized) return;
        const nextZ = topZ + 1;
        const updated = { ...windows };
        for (const key of ALL_APPS) {
          if (!updated[key]) continue;
          updated[key] = {
            ...updated[key],
            isFocused: key === id,
            zIndex: key === id ? nextZ : updated[key].zIndex,
          };
        }
        set({ windows: updated, topZ: nextZ });
      },

      blurAll: () => {
        const { windows } = get();
        const updated = { ...windows };
        for (const key of ALL_APPS) {
          if (updated[key]) {
            updated[key] = { ...updated[key], isFocused: false };
          }
        }
        set({ windows: updated });
      },

      updatePosition: (id, position) => {
        const { windows } = get();
        set({
          windows: {
            ...windows,
            [id]: { ...windows[id], position },
          },
        });
      },

      updateSize: (id, size) => {
        const { windows } = get();
        set({
          windows: {
            ...windows,
            [id]: { ...windows[id], size },
          },
        });
      },

      setBounds: (id, position, size) => {
        const { windows } = get();
        set({
          windows: {
            ...windows,
            [id]: { ...windows[id], position, size },
          },
        });
      },

      getOpenWindows: () =>
        Object.values(get().windows).filter((w) => w.isOpen && !w.isMinimized),

      isRunning: (id) => get().windows[id]?.isOpen ?? false,
    }),
    {
      name: "mac-portfolio-windows",
      partialize: (s) => ({
        windows: s.windows,
        topZ: s.topZ,
      }),
    },
  ),
);
