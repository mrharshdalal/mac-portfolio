"use client";

import { useCallback, useState } from "react";
import { BootScreen } from "@/components/animations/BootScreen";
import { CustomCursor } from "@/components/desktop/CustomCursor";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { DesktopSurface } from "@/components/desktop/DesktopSurface";
import { Dock } from "@/components/dock/Dock";
import { MenuBar } from "@/components/menu-bar/MenuBar";
import { Wallpaper } from "@/components/wallpaper/Wallpaper";
import { WindowManager } from "@/components/windows/WindowManager";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useDesktopStore } from "@/store/desktop";

export function DesktopShell() {
  const [booting, setBooting] = useState(true);
  const [stage, setStage] = useState({
    wallpaper: false,
    chrome: false,
    icons: false,
    dock: false,
  });
  const setDesktopReady = useDesktopStore((s) => s.setDesktopReady);

  useKeyboardShortcuts();

  const onBootComplete = useCallback(() => {
    setBooting(false);
    // Orchestrated reveal
    setStage((s) => ({ ...s, wallpaper: true }));
    setTimeout(() => setStage((s) => ({ ...s, chrome: true })), 200);
    setTimeout(() => setStage((s) => ({ ...s, icons: true })), 450);
    setTimeout(() => {
      setStage((s) => ({ ...s, dock: true }));
      setDesktopReady(true);
    }, 700);
  }, [setDesktopReady]);

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-black">
      {booting && <BootScreen onComplete={onBootComplete} />}

      <DesktopSurface>
        <Wallpaper visible={stage.wallpaper} />
        <DesktopIcons visible={stage.icons} />
        <WindowManager />
      </DesktopSurface>

      <MenuBar visible={stage.chrome} />
      <Dock visible={stage.dock} />
      <CustomCursor />
    </div>
  );
}
