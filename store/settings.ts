import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccentColor, SettingsState, WallpaperId } from "@/types";

interface SettingsStore extends SettingsState {
  setTheme: (theme: SettingsState["theme"]) => void;
  setAccent: (accent: AccentColor) => void;
  setWallpaper: (wallpaper: WallpaperId) => void;
  setAnimations: (v: boolean) => void;
  setSound: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  setTransparency: (v: boolean) => void;
  setFontSize: (size: SettingsState["fontSize"]) => void;
  update: (partial: Partial<SettingsState>) => void;
}

const defaults: SettingsState = {
  theme: "light",
  accent: "blue",
  wallpaper: "grid",
  animations: true,
  sound: false,
  reduceMotion: false,
  transparency: true,
  fontSize: "medium",
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setAnimations: (animations) => set({ animations }),
      setSound: (sound) => set({ sound }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setTransparency: (transparency) => set({ transparency }),
      setFontSize: (fontSize) => set({ fontSize }),
      update: (partial) => set(partial),
    }),
    { name: "mac-portfolio-settings" },
  ),
);
