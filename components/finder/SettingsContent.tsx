"use client";

import { cn } from "@/lib/cn";
import { useSettingsStore } from "@/store/settings";
import type { WallpaperId } from "@/types";

const WALLS: WallpaperId[] = [
  "grid",
  "gradient",
  "mountain",
  "abstract",
  "dark",
  "dynamic",
];

export function SettingsContent() {
  const wp = useSettingsStore((s) => s.wallpaper);
  const setWallpaper = useSettingsStore((s) => s.setWallpaper);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const animations = useSettingsStore((s) => s.animations);
  const setAnimations = useSettingsStore((s) => s.setAnimations);
  const sound = useSettingsStore((s) => s.sound);
  const setSound = useSettingsStore((s) => s.setSound);
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const setReduceMotion = useSettingsStore((s) => s.setReduceMotion);
  const transparency = useSettingsStore((s) => s.transparency);
  const setTransparency = useSettingsStore((s) => s.setTransparency);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-semibold">System Settings</h1>
      <section>
        <h2 className="mb-2 font-medium">Wallpaper</h2>
        <div className="grid grid-cols-3 gap-2">
          {WALLS.map((id) => (
            <button
              key={id}
              type="button"
              className={cn(
                "rounded-lg border-2 p-3 text-sm capitalize",
                wp === id ? "border-mac-blue" : "border-transparent bg-zinc-100",
              )}
              onClick={() => setWallpaper(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="font-medium">Appearance</h2>
        <label className="flex items-center justify-between text-sm">
          Theme
          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value as "light" | "dark" | "auto")
            }
            className="rounded border border-zinc-200 px-2 py-1"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </label>
        {(
          [
            ["Animations", animations, setAnimations],
            ["Sound effects", sound, setSound],
            ["Reduce motion", reduceMotion, setReduceMotion],
            ["Transparency", transparency, setTransparency],
          ] as const
        ).map(([label, value, setter]) => (
          <label
            key={label}
            className="flex items-center justify-between text-sm"
          >
            {label}
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setter(e.target.checked)}
            />
          </label>
        ))}
      </section>
    </div>
  );
}
