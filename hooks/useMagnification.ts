"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

const MAX_SCALE = 1.22;
const DISTANCE = 90;
const BASE_SIZE = 42;

/**
 * Dock magnification based on cursor distance — Apple-style continuous scale.
 */
export function useMagnification(itemCount: number) {
  const mouseX = useMotionValue<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX);
    },
    [mouseX],
  );

  const onMouseLeave = useCallback(() => {
    mouseX.set(null);
  }, [mouseX]);

  return {
    mouseX,
    containerRef,
    onMouseMove,
    onMouseLeave,
    itemCount,
    baseSize: BASE_SIZE,
  };
}

export function useDockItemScale(
  mouseX: ReturnType<typeof useMotionValue<number | null>>,
  index: number,
  baseSize = BASE_SIZE,
) {
  const rawScale = useMotionValue(1);
  const scale = useSpring(rawScale, { stiffness: 280, damping: 28, mass: 0.55 });
  const size = useTransform(scale, (s) => baseSize * s);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const unsub = mouseX.on("change", (x) => {
      if (x === null || !ref.current) {
        rawScale.set(1);
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(x - center);
      const proximity = Math.max(0, 1 - distance / DISTANCE);
      // Smooth falloff (cosine-ish) for neighbor influence
      const eased = (1 - Math.cos(proximity * Math.PI)) / 2;
      rawScale.set(1 + (MAX_SCALE - 1) * eased);
    });
    return () => unsub();
  }, [mouseX, rawScale]);

  return { ref, scale, size };
}
