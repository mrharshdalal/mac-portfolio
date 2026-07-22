"use client";

import { useEffect, useRef } from "react";
import { GRID } from "@/lib/apps-registry";
import { useDesktopStore } from "@/store/desktop";
import { useWindowsStore } from "@/store/windows";
import type { AppId } from "@/types";

export function DesktopSurface({
  children,
}: {
  children: React.ReactNode;
}) {
  const clearSelection = useDesktopStore((s) => s.clearSelection);
  const setSelectionBox = useDesktopStore((s) => s.setSelectionBox);
  const selectionBox = useDesktopStore((s) => s.selectionBox);
  const openContextMenu = useDesktopStore((s) => s.openContextMenu);
  const closeContextMenu = useDesktopStore((s) => s.closeContextMenu);
  const icons = useDesktopStore((s) => s.icons);
  const selectIcons = useDesktopStore((s) => s.selectIcons);
  const blurAll = useWindowsStore((s) => s.blurAll);
  const selecting = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("[data-desktop-icon]")) return;
    closeContextMenu();
    clearSelection();
    blurAll();
    selecting.current = true;
    start.current = { x: e.clientX, y: e.clientY };
    setSelectionBox({
      start: { ...start.current },
      end: { ...start.current },
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!selecting.current) return;
    setSelectionBox({
      start: { ...start.current },
      end: { x: e.clientX, y: e.clientY },
    });
  };

  const onPointerUp = () => {
    if (!selecting.current) return;
    selecting.current = false;
    const box = useDesktopStore.getState().selectionBox;
    setSelectionBox(null);
    if (!box) return;
    const left = Math.min(box.start.x, box.end.x);
    const right = Math.max(box.start.x, box.end.x);
    const top = Math.min(box.start.y, box.end.y);
    const bottom = Math.max(box.start.y, box.end.y);
    if (right - left < 4 && bottom - top < 4) return;

    const hit = icons.filter((icon) => {
      const iw = icon.type === "sticky" ? 210 : GRID.iconWidth;
      const ih = icon.type === "sticky" ? 200 : 96;
      const ix =
        icon.align === "right"
          ? window.innerWidth - GRID.offsetX - icon.gridX * GRID.cellWidth - iw
          : GRID.offsetX + icon.gridX * GRID.cellWidth;
      const iy = GRID.offsetY + icon.gridY * GRID.cellHeight;
      return ix < right && ix + iw > left && iy < bottom && iy + ih > top;
    });
    selectIcons(hit.map((h) => h.id));
  };

  return (
    <div
      className="absolute inset-0"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY);
      }}
    >
      {children}
      {selectionBox && <SelectionRect box={selectionBox} />}
      <DesktopContextMenu />
    </div>
  );
}

function SelectionRect({
  box,
}: {
  box: { start: { x: number; y: number }; end: { x: number; y: number } };
}) {
  const left = Math.min(box.start.x, box.end.x);
  const top = Math.min(box.start.y, box.end.y);
  const width = Math.abs(box.end.x - box.start.x);
  const height = Math.abs(box.end.y - box.start.y);
  return (
    <div
      className="pointer-events-none fixed z-[100] border border-mac-blue/60 bg-mac-blue/15"
      style={{ left, top, width, height }}
    />
  );
}

function DesktopContextMenu() {
  const menu = useDesktopStore((s) => s.contextMenu);
  const close = useDesktopStore((s) => s.closeContextMenu);
  const open = useWindowsStore((s) => s.open);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menu, close]);

  if (!menu) return null;

  const items: { label: string; action?: () => void; sep?: boolean }[] = [
    { label: "New Folder", action: () => undefined },
    { sep: true, label: "sep1" },
    { label: "Get Info" },
    { label: "Change Wallpaper…", action: () => open("settings") },
    { sep: true, label: "sep2" },
    { label: "Open Finder", action: () => open("finder") },
    { label: "Open Terminal", action: () => open("terminal" as AppId) },
    { sep: true, label: "sep3" },
    { label: "Clean Up" },
  ];

  return (
    <div
      ref={ref}
      className="fixed z-[6000] min-w-[200px] overflow-hidden rounded-lg border border-black/10 bg-white/90 py-1 text-[13px] shadow-xl backdrop-blur-xl"
      style={{ left: menu.x, top: menu.y }}
      role="menu"
    >
      {items.map((item) =>
        item.sep ? (
          <div key={item.label} className="my-1 h-px bg-black/10" />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className="flex w-full px-3 py-1 text-left hover:bg-mac-blue hover:text-white"
            onClick={() => {
              item.action?.();
              close();
            }}
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  );
}
