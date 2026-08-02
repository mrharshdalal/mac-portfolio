"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { GRID } from "@/lib/apps-registry";
import { springs } from "@/lib/spring-presets";
import { cn } from "@/lib/cn";
import { stickyTodo } from "@/data/portfolio";
import { useDesktopStore } from "@/store/desktop";
import { useWindowsStore } from "@/store/windows";
import type { DesktopIcon as DesktopIconType } from "@/types";

interface DesktopIconsProps {
  visible?: boolean;
}

export function DesktopIcons({ visible = true }: DesktopIconsProps) {
  const icons = useDesktopStore((s) => s.icons);
  const selectedIds = useDesktopStore((s) => s.selectedIds);
  const selectIcons = useDesktopStore((s) => s.selectIcons);
  const moveIcon = useDesktopStore((s) => s.moveIcon);
  const openContextMenu = useDesktopStore((s) => s.openContextMenu);
  const open = useWindowsStore((s) => s.open);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-10 pt-8" aria-label="Desktop icons">
      {icons.map((icon, i) => (
        <DesktopIconItem
          key={icon.id}
          icon={icon}
          index={i}
          selected={selectedIds.includes(icon.id)}
          onSelect={() => selectIcons([icon.id])}
          onOpen={() => open(icon.appId)}
          onMove={(gx, gy) => moveIcon(icon.id, gx, gy)}
          onContextMenu={(x, y) => openContextMenu(x, y, icon.id)}
        />
      ))}
    </div>
  );
}

function iconPosition(icon: DesktopIconType) {
  if (icon.type === "trash") {
    return {
      top: "auto" as const,
      bottom: 92,
      right: GRID.offsetX,
      left: "auto" as const,
    };
  }
  const top = GRID.offsetY + icon.gridY * GRID.cellHeight;
  if (icon.align === "right") {
    return {
      top,
      bottom: "auto" as const,
      right: GRID.offsetX + icon.gridX * GRID.cellWidth,
      left: "auto" as const,
    };
  }
  return {
    top,
    bottom: "auto" as const,
    left: GRID.offsetX + icon.gridX * GRID.cellWidth,
    right: "auto" as const,
  };
}

function DesktopIconItem({
  icon,
  index,
  selected,
  onSelect,
  onOpen,
  onMove,
  onContextMenu,
}: {
  icon: DesktopIconType;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onMove: (gx: number, gy: number) => void;
  onContextMenu: (x: number, y: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const pos = iconPosition(icon);

  if (icon.type === "sticky") {
    return (
      <motion.button
        type="button"
        data-desktop-icon
        className="absolute w-[210px] origin-top-left rounded-[2px] bg-[#fef08a] p-3.5 text-left shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
        style={{
          left: pos.left,
          top: pos.top,
          right: pos.right,
          bottom: pos.bottom,
        }}
        initial={{ opacity: 0, scale: 0.88, y: -12, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -1.5 }}
        transition={{ ...springs.soft, delay: 0.08 * index }}
        onClick={() => {
          onSelect();
          onOpen();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(e.clientX, e.clientY);
        }}
        drag
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const baseLeft =
            typeof pos.left === "number"
              ? pos.left
              : window.innerWidth - GRID.offsetX - 210;
          const topVal =
            typeof pos.top === "number" ? pos.top : GRID.offsetY;
          const gx = Math.round(
            (baseLeft + info.offset.x - GRID.offsetX) / GRID.cellWidth,
          );
          const gy = Math.round(
            (topVal + info.offset.y - GRID.offsetY) / GRID.cellHeight,
          );
          onMove(Math.max(0, gx), Math.max(0, gy));
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-2 opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)",
          }}
          aria-hidden
        />
        <p className="mb-2.5 font-[family-name:var(--font-instrument)] text-[17px] italic text-zinc-800">
          {stickyTodo.title}
        </p>
        <ul className="space-y-1.5 text-[12px] leading-snug text-zinc-700">
          {stickyTodo.content.split("\n").map((line) => {
            const done = line.startsWith("~~") && line.endsWith("~~");
            const text = done ? line.slice(2, -2) : line;
            return (
              <li
                key={line}
                className={cn(
                  "flex gap-2",
                  done ? "text-zinc-500/80 line-through" : "text-zinc-700",
                )}
              >
                <span className="mt-[2px] text-[10px] opacity-50" aria-hidden>
                  {done ? "✓" : "○"}
                </span>
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      data-desktop-icon
      className={cn(
        "absolute flex w-[88px] flex-col items-center gap-1.5 rounded-lg p-1.5",
        selected && "bg-mac-blue/20 ring-1 ring-mac-blue/35",
        icon.type === "trash" && "max-[720px]:hidden",
      )}
      style={{
        left: pos.left,
        top: pos.top,
        right: pos.right,
        bottom: pos.bottom,
      }}
      initial={{ opacity: 0, scale: 0.72, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...springs.soft, delay: 0.06 * index }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
        onContextMenu(e.clientX, e.clientY);
      }}
      drag
      dragMomentum={false}
      onDragStart={() => {
        setDragging(true);
        onSelect();
      }}
      onDragEnd={(_, info) => {
        setDragging(false);
        if (icon.align === "right") {
          const currentRight =
            typeof pos.right === "number" ? pos.right : GRID.offsetX;
          const gx = Math.round(
            (currentRight - info.offset.x - GRID.offsetX) / GRID.cellWidth,
          );
          const topVal = typeof pos.top === "number" ? pos.top : 0;
          const gy = Math.round(
            (topVal + info.offset.y - GRID.offsetY) / GRID.cellHeight,
          );
          onMove(Math.max(0, gx), Math.max(0, gy));
          return;
        }
        const baseLeft = typeof pos.left === "number" ? pos.left : 0;
        const topVal = typeof pos.top === "number" ? pos.top : 0;
        const gx = Math.round(
          (baseLeft + info.offset.x - GRID.offsetX) / GRID.cellWidth,
        );
        const gy = Math.round(
          (topVal + info.offset.y - GRID.offsetY) / GRID.cellHeight,
        );
        onMove(Math.max(0, gx), Math.max(0, gy));
      }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
    >
      <AppIcon
        name={icon.icon === "folder" ? "folder" : icon.icon}
        size={54}
        variant="desktop"
        className={cn(dragging && "shadow-xl")}
      />
      <span
        className={cn(
          "max-w-full rounded-[4px] px-1 text-center text-[11px] leading-tight font-medium break-words text-zinc-800 [text-shadow:0_1px_0_rgba(255,255,255,0.55)]",
          selected && "bg-mac-blue text-white [text-shadow:none]",
        )}
      >
        {icon.label}
      </span>
    </motion.button>
  );
}
