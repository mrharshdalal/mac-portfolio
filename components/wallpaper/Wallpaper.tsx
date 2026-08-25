"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { portfolio } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
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
  const accentRef = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const skipHover = reduced || reduceMotion;

  useEffect(() => {
    const accent = accentRef.current;
    if (!accent || skipHover || !visible) return;

    const chars = Array.from(
      accent.querySelectorAll<HTMLElement>("[data-hero-char]"),
    );
    if (!chars.length) return;

    gsap.set(chars, {
      transformOrigin: "50% 100%",
      force3D: true,
      fontWeight: 400,
      webkitTextStroke: "0px currentColor",
    });

    const quickTo = chars.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }),
      rotate: gsap.quickTo(el, "rotation", {
        duration: 0.5,
        ease: "power3.out",
      }),
      scale: gsap.quickTo(el, "scale", { duration: 0.35, ease: "power2.out" }),
      weight: gsap.quickTo(el, "fontWeight", {
        duration: 0.28,
        ease: "power2.out",
      }),
    }));

    const rests = chars.map(() => ({ x: 0, y: 0 }));
    let hovering = false;
    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;

    const cacheRests = () => {
      chars.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        // Undo current transform so magnet math uses resting centers
        const x = Number(gsap.getProperty(el, "x")) || 0;
        const y = Number(gsap.getProperty(el, "y")) || 0;
        rests[i] = {
          x: rect.left + rect.width / 2 - x,
          y: rect.top + rect.height / 2 - y,
        };
      });
    };

    const applyMagnet = () => {
      raf = 0;
      if (!hovering) return;

      // Refresh rests so weight/stroke reflow stays aligned with the pointer
      cacheRests();

      chars.forEach((el, i) => {
        const dx = pointerX - rests[i].x;
        const dy = pointerY - rests[i].y;
        const dist = Math.hypot(dx, dy);
        const radius = 160;
        const force = Math.max(0, 1 - dist / radius);
        const pull = force * force;
        const mid = (i - (chars.length - 1) / 2) / chars.length;

        quickTo[i].x(dx * pull * 0.32);
        quickTo[i].y(dy * pull * 0.24 - pull * 12);
        quickTo[i].rotate(dx * pull * 0.045 + mid * pull * 10);
        quickTo[i].scale(1 + pull * 0.14);
        // Instrument Serif is single-weight — bold + stroke reads as real weight
        quickTo[i].weight(400 + pull * 350);
        el.style.webkitTextStroke = `${(pull * 1.15).toFixed(2)}px currentColor`;
      });
    };

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!raf) raf = requestAnimationFrame(applyMagnet);
    };

    const onEnter = (e: PointerEvent) => {
      hovering = true;
      pointerX = e.clientX;
      pointerY = e.clientY;
      cacheRests();

      gsap.to(accent, {
        letterSpacing: "0.045em",
        duration: 0.55,
        ease: "power3.out",
      });
      gsap.to(chars, {
        color: "#18181b",
        textShadow: "0 14px 32px rgba(24,24,27,0.2)",
        duration: 0.4,
        stagger: { each: 0.018, from: "center" },
        ease: "power2.out",
      });

      if (!raf) raf = requestAnimationFrame(applyMagnet);
    };

    const onLeave = () => {
      hovering = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }

      gsap.to(accent, {
        letterSpacing: "0em",
        duration: 0.7,
        ease: "elastic.out(1, 0.55)",
      });
      gsap.to(chars, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        fontWeight: 400,
        color: "#27272a",
        textShadow: "0 0 0 rgba(0,0,0,0)",
        webkitTextStroke: "0px currentColor",
        duration: 0.9,
        stagger: { each: 0.022, from: "edges" },
        ease: "elastic.out(1, 0.45)",
      });
    };

    accent.addEventListener("pointerenter", onEnter);
    accent.addEventListener("pointermove", onMove);
    accent.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", cacheRests);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      accent.removeEventListener("pointerenter", onEnter);
      accent.removeEventListener("pointermove", onMove);
      accent.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", cacheRests);
      gsap.killTweensOf([accent, ...chars]);
    };
  }, [skipHover, visible]);

  const accentChars = Array.from(portfolio.taglineAccent);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
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
        <motion.h1
          ref={accentRef}
          data-hero-accent
          className="pointer-events-auto font-[family-name:var(--font-instrument)] text-[clamp(3rem,8vw,6rem)] italic leading-[0.92] text-zinc-800"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 18,
            filter: visible ? "blur(0px)" : "blur(6px)",
          }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-label={portfolio.taglineAccent}
        >
          {accentChars.map((char, i) => (
            <span
              key={`${char}-${i}`}
              data-hero-char
              className="inline-block origin-bottom will-change-transform"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </motion.h1>
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
