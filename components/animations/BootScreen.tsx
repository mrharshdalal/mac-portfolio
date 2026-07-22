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
      height="72"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.22-1.98 1.09-3.13-1.05.04-2.32.7-3.07 1.58-.67.78-1.26 2.03-1.1 3.22 1.16.09 2.35-.66 3.08-1.67" />
    </svg>
  );
}
