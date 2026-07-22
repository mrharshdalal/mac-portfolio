"use client";

import {
  motion,
  useDragControls,
  type PanInfo,
} from "framer-motion";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { TrafficLights } from "./TrafficLights";
import { APP_DEFINITIONS } from "@/lib/apps-registry";
import { springs } from "@/lib/spring-presets";
import { cn } from "@/lib/cn";
import { useWindowsStore } from "@/store/windows";
import type { AppId } from "@/types";

interface WindowProps {
  id: AppId;
  children: ReactNode;
}

export function Window({ id, children }: WindowProps) {
  const win = useWindowsStore((s) => s.windows[id]);
  const close = useWindowsStore((s) => s.close);
  const minimize = useWindowsStore((s) => s.minimize);
  const maximize = useWindowsStore((s) => s.maximize);
  const focus = useWindowsStore((s) => s.focus);
  const updatePosition = useWindowsStore((s) => s.updatePosition);
  const setBounds = useWindowsStore((s) => s.setBounds);
  const dragControls = useDragControls();
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, px: 0, py: 0 });
  const def = APP_DEFINITIONS[id];
  const minW = def.minSize?.width ?? 320;
  const minH = def.minSize?.height ?? 240;

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setDragging(false);
      if (!win || win.isMaximized) return;
      let x = win.position.x + info.offset.x;
      let y = win.position.y + info.offset.y;
      // Edge snap
      const snap = 12;
      if (x < snap) x = 0;
      if (y < 28 + snap) y = 28;
      if (typeof window !== "undefined") {
        if (x + win.size.width > window.innerWidth - snap) {
          x = window.innerWidth - win.size.width;
        }
      }
      updatePosition(id, { x, y });
    },
    [id, updatePosition, win],
  );

  const startResize = (e: React.PointerEvent) => {
    if (win?.isMaximized || def.resizable === false) return;
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    focus(id);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: win.size.width,
      h: win.size.height,
      px: win.position.x,
      py: win.position.y,
    };

    const onMove = (ev: PointerEvent) => {
      const dw = ev.clientX - resizeStart.current.x;
      const dh = ev.clientY - resizeStart.current.y;
      setBounds(
        id,
        { x: resizeStart.current.px, y: resizeStart.current.py },
        {
          width: Math.max(minW, resizeStart.current.w + dw),
          height: Math.max(minH, resizeStart.current.h + dh),
        },
      );
    };
    const onUp = () => {
      setResizing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  if (!win || !win.isOpen || win.isMinimized) return null;

  return (
    <motion.div
      role="dialog"
      aria-label={win.title}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white/90 backdrop-blur-2xl",
        dragging || resizing ? "shadow-[0_30px_80px_rgba(0,0,0,0.4)]" : "shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
        win.isFocused ? "ring-1 ring-black/5" : "opacity-[0.97]",
      )}
      style={{
        zIndex: win.zIndex,
        width: win.size.width,
        height: win.size.height,
        left: win.position.x,
        top: win.position.y,
      }}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        width: win.size.width,
        height: win.size.height,
        left: win.position.x,
        top: win.position.y,
      }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
      transition={springs.window}
      drag={!win.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={() => {
        setDragging(true);
        focus(id);
      }}
      onDragEnd={onDragEnd}
      onPointerDown={() => focus(id)}
    >
      {/* Title bar */}
      <div
        className={cn(
          "relative flex h-11 shrink-0 items-center px-3",
          id === "terminal" ? "bg-zinc-800 text-white" : "bg-white/60",
        )}
        onPointerDown={(e) => {
          focus(id);
          dragControls.start(e);
        }}
        onDoubleClick={() => maximize(id)}
      >
        <TrafficLights
          focused={win.isFocused}
          onClose={() => close(id)}
          onMinimize={() => minimize(id)}
          onMaximize={() => maximize(id)}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "text-[13px] font-medium",
              id === "terminal" ? "text-white/90" : "text-zinc-700",
            )}
          >
            {win.title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>

      {/* Resize handle */}
      {def.resizable !== false && !win.isMaximized && (
        <div
          className="absolute right-0 bottom-0 size-4 cursor-nwse-resize"
          onPointerDown={startResize}
          aria-hidden
        />
      )}
    </motion.div>
  );
}
