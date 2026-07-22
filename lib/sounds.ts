/** Sound helpers — muted by default; wired for Phase 3 */
const SOUND_MAP = {
  boot: "/sounds/boot.mp3",
  open: "/sounds/open.mp3",
  close: "/sounds/close.mp3",
  bounce: "/sounds/bounce.mp3",
  trash: "/sounds/trash.mp3",
  hover: "/sounds/hover.mp3",
} as const;

export type SoundId = keyof typeof SOUND_MAP;

export function playSound(id: SoundId, enabled = false) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const audio = new Audio(SOUND_MAP[id]);
    audio.volume = 0.35;
    void audio.play().catch(() => undefined);
  } catch {
    // Sounds are optional assets
  }
}
