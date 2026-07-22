/** Apple-like spring presets for Framer Motion */
export const springs = {
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
  soft: { type: "spring" as const, stiffness: 260, damping: 28 },
  bouncy: { type: "spring" as const, stiffness: 500, damping: 18 },
  dock: { type: "spring" as const, stiffness: 350, damping: 22, mass: 0.6 },
  window: { type: "spring" as const, stiffness: 300, damping: 32, mass: 0.8 },
  open: { type: "spring" as const, stiffness: 280, damping: 26 },
  close: { type: "spring" as const, stiffness: 400, damping: 35 },
};

export const appleEase = [0.22, 1, 0.36, 1] as const;
