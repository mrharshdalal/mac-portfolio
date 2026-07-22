"use client";

import { useState } from "react";
import {
  Battery,
  Bluetooth,
  Search,
  Wifi,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useClock } from "@/hooks/useClock";
import { portfolio } from "@/data/portfolio";
import { useWindowsStore } from "@/store/windows";
import type { AppId } from "@/types";

const MENUS: Record<string, string[]> = {
  Apple: [
    "About This Mac",
    "System Settings…",
    "App Store…",
    "—",
    "Recent Items",
    "—",
    "Force Quit…",
    "—",
    "Sleep",
    "Restart…",
    "Shut Down…",
  ],
  Finder: ["About Finder", "—", "Settings…", "—", "Empty Trash…"],
  File: ["New Finder Window", "New Folder", "Open", "Close Window"],
  Edit: ["Undo", "Redo", "—", "Cut", "Copy", "Paste", "Select All"],
  View: ["as Icons", "as List", "as Columns", "—", "Show Preview"],
  Go: ["Back", "Forward", "—", "Home", "Documents", "Downloads"],
  Window: ["Minimize", "Zoom", "—", "Bring All to Front"],
  Help: ["macOS Help", "—", "Search"],
};

interface MenuBarProps {
  visible?: boolean;
}

export function MenuBar({ visible = true }: MenuBarProps) {
  const { date, time } = useClock();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const windows = useWindowsStore((s) => s.windows);
  const open = useWindowsStore((s) => s.open);

  const focused = Object.values(windows).find((w) => w.isFocused && w.isOpen);
  const appName = focused?.title ?? `${portfolio.name}'s Portfolio`;

  if (!visible) return null;

  const handleItem = (label: string) => {
    setOpenMenu(null);
    if (label === "System Settings…") open("settings");
    if (label === "Empty Trash…") open("trash");
    if (label === "New Finder Window") open("finder");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-[5000] flex h-7 items-center justify-between px-3 text-[13px]",
        "border-b border-black/5 bg-[rgba(246,246,246,0.72)] text-zinc-900",
        "shadow-[0_0.5px_0_rgba(255,255,255,0.5)_inset] backdrop-blur-2xl backdrop-saturate-150",
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="flex h-full items-center gap-0.5">
        <MenuButton
          label={<AppleGlyph />}
          open={openMenu === "Apple"}
          onOpen={() => setOpenMenu("Apple")}
          items={MENUS.Apple}
          onSelect={handleItem}
        />
        <MenuButton
          label={<span className="font-semibold">{appName}</span>}
          open={openMenu === "App"}
          onOpen={() => setOpenMenu("App")}
          items={[
            `About ${appName}`,
            "—",
            "Contact",
            "Resume",
            "—",
            "Hide",
            "Quit",
          ]}
          onSelect={(item) => {
            if (item === "Contact") open("contact" as AppId);
            if (item === "Resume") open("resume");
            handleItem(item);
          }}
        />
        {(["Finder", "File", "Edit", "View", "Go", "Window", "Help"] as const).map(
          (name) => (
            <MenuButton
              key={name}
              label={name}
              open={openMenu === name}
              onOpen={() => setOpenMenu(name)}
              items={MENUS[name]}
              onSelect={handleItem}
            />
          ),
        )}
      </div>

      <div className="flex items-center gap-3 text-zinc-800">
        <ControlCenterIcon />
        <Bluetooth className="size-3.5 opacity-80" aria-hidden />
        <span className="flex items-center gap-1 text-xs">
          <Battery className="size-3.5" aria-hidden />
          100%
        </span>
        <Wifi className="size-3.5" aria-hidden />
        <Search className="size-3.5 opacity-80" aria-hidden />
        <User className="size-3.5 opacity-80" aria-hidden />
        <time className="tabular-nums" dateTime={new Date().toISOString()}>
          {date} {time}
        </time>
      </div>
    </header>
  );
}

function MenuButton({
  label,
  open,
  onOpen,
  items,
  onSelect,
}: {
  label: React.ReactNode;
  open: boolean;
  onOpen: () => void;
  items: string[];
  onSelect: (item: string) => void;
}) {
  return (
    <div className="relative h-full">
      <button
        type="button"
        className={cn(
          "flex h-full items-center rounded px-2 transition-colors",
          open ? "bg-mac-blue text-white" : "hover:bg-black/5",
        )}
        onMouseEnter={onOpen}
        onClick={onOpen}
      >
        {label}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-50 min-w-[220px] overflow-hidden rounded-lg border border-black/10 bg-white/90 py-1 shadow-xl backdrop-blur-xl"
          role="menu"
        >
          {items.map((item, i) =>
            item === "—" ? (
              <div key={`sep-${i}`} className="my-1 h-px bg-black/10" />
            ) : (
              <button
                key={item}
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-1 text-left text-[13px] hover:bg-mac-blue hover:text-white"
                onClick={() => onSelect(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function AppleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.22-1.98 1.09-3.13-1.05.04-2.32.7-3.07 1.58-.67.78-1.26 2.03-1.1 3.22 1.16.09 2.35-.66 3.08-1.67" />
    </svg>
  );
}

function ControlCenterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="opacity-80">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}
