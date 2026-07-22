"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { portfolio } from "@/data/portfolio";
import { useSettingsStore } from "@/store/settings";
import type { WallpaperId } from "@/types";

const WALLPAPERS: Record<
  WallpaperId,
  { className: string; glow?: string; showHero?: boolean }
> = {
  grid: {
    className: "bg-[#e9edf2]",
    glow: [
      "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(255,255,255,0.95), transparent 55%)",
      "radial-gradient(ellipse 50% 40% at 15% 70%, rgba(186,210,230,0.45), transparent 60%)",
      "radial-gradient(ellipse 45% 35% at 88% 75%, rgba(210,200,190,0.35), transparent 55%)",
      "linear-gradient(180deg, rgba(232,236,242,0.2) 0%, rgba(220,226,234,0.85) 100%)",
    ].join(", "),
    showHero: true,
  },
  gradient: {
    className: "bg-gradient-to-br from-sky-100 via-slate-100 to-stone-200",
    glow: "radial-gradient(circle at 40% 30%, rgba(255,255,255,0.55), transparent 42%)",
    showHero: true,
  },
  mountain: {
    className:
      "bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')] bg-cover bg-center",
  },
  abstract: {
    className:
      "bg-[radial-gradient(ellipse_at_top_left,#bfdbfe,transparent_50%),radial-gradient(ellipse_at_bottom_right,#e7e5e4,transparent_50%),radial-gradient(ellipse_at_center,#f8fafc_0%,#e2e8f0_70%)]",
    showHero: true,
  },
  dark: {
    className: "bg-gradient-to-b from-zinc-900 via-slate-900 to-black",
    glow: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.22), transparent 50%)",
  },
  dynamic: {
    className:
      "bg-[conic-gradient(from_210deg_at_50%_40%,#dbeafe,#e7e5e4,#cffafe,#dbeafe)]",
    showHero: true,
  },
};

interface WallpaperProps {
  visible?: boolean;
}

export function Wallpaper({ visible = true }: WallpaperProps) {
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const config = WALLPAPERS[wallpaper];
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const transform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0) scale(1.04)`;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ny = (e.clientY / window.innerHeight - 0.5) * 10;
      mx.set(nx);
      my.set(ny);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <motion.div className={cn("absolute inset-[-2%]", config.className)} style={{ transform }} />
      {config.glow && (
        <div className="absolute inset-0" style={{ background: config.glow }} />
      )}
      {wallpaper === "grid" && <SoftGrid />}
      <div className="noise-overlay" />
      {config.showHero && <HeroText visible={visible} />}
    </motion.div>
  );
}

function SoftGrid() {
  return (
    <div
      className="absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(120,130,145,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,130,145,0.18) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%)",
      }}
    />
  );
}

function HeroText({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <motion.p
          className="mb-5 text-[11px] font-medium tracking-[0.28em] text-zinc-500 uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {portfolio.name}
        </motion.p>
        <motion.p
          className="mb-2 text-[clamp(1.35rem,2.8vw,2rem)] font-light tracking-tight text-zinc-500"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 14 }}
          transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {portfolio.tagline}
        </motion.p>
        <motion.p
          className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,8vw,6rem)] italic leading-[0.92] text-zinc-800"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 18,
            filter: visible ? "blur(0px)" : "blur(6px)",
          }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {portfolio.taglineAccent}
        </motion.p>
        <motion.p
          className="mt-6 text-[13px] tracking-wide text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {portfolio.title}
        </motion.p>
      </div>
    </div>
  );
}
