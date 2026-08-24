"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useDesktopStore } from "@/store/desktop";
import { useSettingsStore } from "@/store/settings";

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const setBootComplete = useDesktopStore((s) => s.setBootComplete);
  const skip = reduced || reduceMotion;

  useEffect(() => {
    if (skip) {
      setBootComplete(true);
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setBootComplete(true);
          onComplete();
        },
      });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
      )
        .fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "power1.inOut" },
          "-=0.2",
        )
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          delay: 0.15,
        });
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete, setBootComplete, skip]);

  if (skip) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      role="status"
      aria-label="Booting"
    >
      <div ref={logoRef} className="mb-16 text-white opacity-0">
        <AppleLogo />
      </div>
      <div className="h-[4px] w-40 overflow-hidden rounded-full bg-white/15">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 rounded-full bg-white/90"
        />
      </div>
    </div>
  );
}

function AppleLogo() {
  return (
    <svg
      width="72"
      height="88"
      viewBox="0 0 814 1000"
      fill="currentColor"
      aria-hidden
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.6 71.9-68.7 141.9-42.8 61.6-87.5 123.1-157.3 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-108.8-57.3-157.3-131C46.1 759.2 0 637 0 521.6c0-199.6 129.4-304.9 257-304.9 67.9 0 124.4 44.5 167.1 44.5 40.8 0 104.3-47.1 181.2-47.1 58.4-.1 112.5 15.7 182.8 51.8zM554.1 159.4C589.2 116.9 613.9 57.9 606.1 0c-52.8 2.1-116.5 35.2-154.3 76.8-33.8 36.7-63.5 95.5-52.2 151.3 58.5 4.6 118.7-29.7 154.5-68.7z" />
    </svg>
  );
}
