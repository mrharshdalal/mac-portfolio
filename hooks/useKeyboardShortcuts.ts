"use client";

import { useEffect } from "react";
import { useWindowsStore } from "@/store/windows";
import { useDesktopStore } from "@/store/desktop";
import type { AppId } from "@/types";

export function useKeyboardShortcuts() {
  const open = useWindowsStore((s) => s.open);
  const close = useWindowsStore((s) => s.close);
  const windows = useWindowsStore((s) => s.windows);
  const clearSelection = useDesktopStore((s) => s.clearSelection);
  const closeContextMenu = useDesktopStore((s) => s.closeContextMenu);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "Escape") {
        closeContextMenu();
        clearSelection();
        return;
      }

      if (typing) return;

      if (meta && e.key === "w") {
        e.preventDefault();
        const focused = Object.values(windows).find((w) => w.isFocused && w.isOpen);
        if (focused) close(focused.id);
      }

      if (meta && e.key === "n") {
        e.preventDefault();
        open("notes");
      }

      if (meta && e.key === "t") {
        e.preventDefault();
        open("terminal" as AppId);
      }

      if (meta && e.key === "f") {
        e.preventDefault();
        open("finder");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, windows, clearSelection, closeContextMenu]);
}
