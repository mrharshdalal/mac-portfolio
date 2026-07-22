"use client";

import { cn } from "@/lib/cn";
import { Minus, X, Maximize2 } from "lucide-react";

interface TrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  focused?: boolean;
}

export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  focused = true,
}: TrafficLightsProps) {
  return (
    <div
      className="group/traffic flex items-center gap-[7px] px-1"
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Close"
        className={cn(
          "flex size-3 items-center justify-center rounded-full transition-colors",
          focused ? "bg-mac-red" : "bg-zinc-300",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="size-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" strokeWidth={3} />
      </button>
      <button
        type="button"
        aria-label="Minimize"
        className={cn(
          "flex size-3 items-center justify-center rounded-full transition-colors",
          focused ? "bg-mac-yellow" : "bg-zinc-300",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
      >
        <Minus className="size-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" strokeWidth={3} />
      </button>
      <button
        type="button"
        aria-label="Fullscreen"
        className={cn(
          "flex size-3 items-center justify-center rounded-full transition-colors",
          focused ? "bg-mac-green" : "bg-zinc-300",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
      >
        <Maximize2 className="size-1.5 text-black/60 opacity-0 group-hover/traffic:opacity-100" strokeWidth={3} />
      </button>
    </div>
  );
}
