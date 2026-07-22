"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    document.documentElement.classList.add("custom-cursor-active");
    setVisible(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = el?.closest(
        "button, a, [role='button'], [role='menuitem'], input, textarea, [data-magnetic]",
      );
      setHovering(Boolean(clickable));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9998]"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      aria-hidden
    >
      <div
        className={cn(
          "rounded-full border border-white/80 bg-zinc-900/55 shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-[width,height,background-color] duration-200",
          hovering ? "size-7 bg-zinc-900/35" : "size-2.5",
        )}
      />
    </motion.div>
  );
}
