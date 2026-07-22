"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

/** Real macOS-style icons sourced from the reference Framer portfolio */
const PNG_ICONS: Record<string, string> = {
  finder: "/dock/icons/finder.png",
  launchpad: "/dock/icons/launchpad.png",
  safari: "/dock/icons/safari.png",
  messages: "/dock/icons/messages.png",
  mail: "/dock/icons/mail.png",
  maps: "/dock/icons/maps.png",
  photos: "/dock/icons/photos.png",
  facetime: "/dock/icons/facetime.png",
  calendar: "/dock/icons/calendar.png",
  contacts: "/dock/icons/contacts.png",
  contact: "/dock/icons/mail.png",
  reminders: "/dock/icons/reminders.png",
  notes: "/dock/icons/notes.png",
  tv: "/dock/icons/tv.png",
  music: "/dock/icons/music.png",
  podcasts: "/dock/icons/podcasts.png",
  appstore: "/dock/icons/appstore.png",
  settings: "/dock/icons/settings.png",
  folder: "/dock/icons/folder.png",
  projects: "/dock/icons/folder.png",
  about: "/dock/icons/folder.png",
  trash: "/dock/icons/trash.png",
  resume: "/dock/icons/resume.png",
};

interface AppIconProps {
  name: string;
  size?: number;
  className?: string;
  variant?: "dock" | "desktop" | "plain";
}

export function AppIcon({
  name,
  size = 48,
  className,
  variant = "dock",
}: AppIconProps) {
  const src = PNG_ICONS[name];

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className={cn(
          "pointer-events-none select-none object-contain",
          variant === "dock" &&
            "drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]",
          variant === "desktop" &&
            "drop-shadow-[0_3px_6px_rgba(0,0,0,0.22)]",
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  // Fallback for icons without PNG assets (e.g. terminal)
  return <FallbackIcon name={name} size={size} className={className} />;
}

function FallbackIcon({
  name,
  size,
  className,
}: {
  name: string;
  size: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[22.5%] shadow-md",
        name === "terminal"
          ? "bg-gradient-to-b from-zinc-700 to-zinc-900"
          : "bg-gradient-to-br from-slate-300 to-slate-500",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {name === "terminal" ? (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#28C840"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7 10 3 2-3 2M12 14h5" />
        </svg>
      ) : (
        <div className="size-1/2 rounded bg-white/40" />
      )}
    </div>
  );
}
