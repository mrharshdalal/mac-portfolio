"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useMagnification, useDockItemScale } from "@/hooks/useMagnification";
import { springs } from "@/lib/spring-presets";
import { useAppsStore } from "@/store/apps";
import { useWindowsStore } from "@/store/windows";
import type { AppId } from "@/types";

const DOCK_HEIGHT = 56;
const ICON_SIZE = 42;

interface DockProps {
  visible?: boolean;
}

export function Dock({ visible = true }: DockProps) {
  const dockApps = useAppsStore((s) => s.dockApps);
  const windows = useWindowsStore((s) => s.windows);
  const open = useWindowsStore((s) => s.open);
  const restore = useWindowsStore((s) => s.restore);
  const focus = useWindowsStore((s) => s.focus);
  const minimize = useWindowsStore((s) => s.minimize);
  const { mouseX, containerRef, onMouseMove, onMouseLeave } = useMagnification(
    dockApps.length,
  );
  const [bouncing, setBouncing] = useState<string | null>(null);

  const handleClick = (slotId: string, appId: AppId) => {
    setBouncing(slotId);
    setTimeout(() => setBouncing(null), 600);
    const win = windows[appId];
    if (!win?.isOpen) {
      open(appId);
    } else if (win.isMinimized) {
      restore(appId);
    } else if (win.isFocused) {
      minimize(appId);
    } else {
      focus(appId);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-2 z-[4000] flex justify-center px-3"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={springs.open}
        >
          <div
            ref={containerRef}
            className="pointer-events-auto relative mx-auto flex items-center justify-center"
            style={{ height: DOCK_HEIGHT }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            role="toolbar"
            aria-label="Dock"
          >
            {/*
              Dock Base — Framer reference (inikaj.com):
              blur(57px) + border + soft shadow + dock-base.png
            */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[17px] border-[0.84px] border-solid border-white/15 shadow-[0_0_31px_rgba(0,0,0,0.25),0_0_1.5px_rgba(0,0,0,0.3)] backdrop-blur-[57px]"
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/dock/dock-base.png"
                alt=""
                className="h-full w-full object-fill"
                draggable={false}
              />
            </div>

            <div
              className="relative z-10 flex h-full items-center justify-center gap-0 px-2.5"
              style={{ height: DOCK_HEIGHT }}
            >
              {dockApps.map((item, index) => (
                <DockIcon
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                  index={index}
                  mouseX={mouseX}
                  running={
                    windows[item.appId]?.isOpen &&
                    !windows[item.appId]?.isMinimized
                  }
                  bouncing={bouncing === item.id}
                  separatorAfter={item.separatorAfter}
                  onClick={() => handleClick(item.id, item.appId)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({
  title,
  icon,
  index,
  mouseX,
  running,
  bouncing,
  separatorAfter,
  onClick,
}: {
  title: string;
  icon: string;
  index: number;
  mouseX: ReturnType<typeof useMagnification>["mouseX"];
  running?: boolean;
  bouncing: boolean;
  separatorAfter?: boolean;
  onClick: () => void;
}) {
  const { ref, scale } = useDockItemScale(mouseX, index);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div className="relative flex h-full items-center justify-center px-px">
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded-md border border-black/10 bg-[#2c2c2e]/92 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-white shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.12 }}
            >
              {title}
              <div
                className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-4 border-transparent border-t-[#2c2c2e]/92"
                aria-hidden
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          ref={ref}
          type="button"
          aria-label={title}
          className="origin-bottom will-change-transform"
          style={{ scale }}
          animate={bouncing ? { y: [0, -14, 0, -7, 0] } : { y: 0 }}
          transition={
            bouncing ? { duration: 0.5, ease: "easeOut" } : springs.dock
          }
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AppIcon name={icon} size={ICON_SIZE} variant="dock" />
        </motion.button>
        {/* Running indicator — absolute so it doesn't shift icon vertical centering */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[3px] flex items-center justify-center"
          aria-hidden
        >
          {running ? (
            <Image
              src="/dock/icons/dot.png"
              alt=""
              width={3}
              height={3}
              className="opacity-80"
              unoptimized
            />
          ) : null}
        </div>
      </div>
      {separatorAfter && (
        <div
          className="mx-1.5 flex h-full items-center self-center"
          aria-hidden
        >
          <Image
            src="/dock/icons/divider.png"
            alt=""
            width={2}
            height={32}
            className="h-8 w-[2px] opacity-70"
            unoptimized
          />
        </div>
      )}
    </>
  );
}
