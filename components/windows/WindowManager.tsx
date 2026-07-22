"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";
import { Window } from "./Window";
import { useWindowsStore } from "@/store/windows";
import type { AppId } from "@/types";

const FinderApp = dynamic(
  () => import("@/components/finder/FinderApp").then((m) => m.FinderApp),
  { ssr: false },
);
const TerminalApp = dynamic(
  () => import("@/components/terminal/TerminalApp").then((m) => m.TerminalApp),
  { ssr: false },
);
const AboutApp = dynamic(
  () => import("@/components/finder/AboutContent").then((m) => m.AboutContent),
  { ssr: false },
);
const ProjectsApp = dynamic(
  () =>
    import("@/components/finder/ProjectsContent").then((m) => m.ProjectsContent),
  { ssr: false },
);
const ResumeApp = dynamic(
  () => import("@/components/finder/ResumeContent").then((m) => m.ResumeContent),
  { ssr: false },
);
const NotesApp = dynamic(
  () => import("@/components/notes/NotesApp").then((m) => m.NotesApp),
  { ssr: false },
);
const TrashApp = dynamic(
  () => import("@/components/finder/TrashContent").then((m) => m.TrashContent),
  { ssr: false },
);
const StickyApp = dynamic(
  () => import("@/components/notes/StickyNote").then((m) => m.StickyNote),
  { ssr: false },
);
const ContactApp = dynamic(
  () =>
    import("@/components/finder/ContactContent").then((m) => m.ContactContent),
  { ssr: false },
);
const SettingsApp = dynamic(
  () =>
    import("@/components/finder/SettingsContent").then(
      (m) => m.SettingsContent,
    ),
  { ssr: false },
);

const APP_CONTENT: Partial<Record<AppId, ComponentType>> = {
  finder: FinderApp,
  terminal: TerminalApp,
  about: AboutApp,
  projects: ProjectsApp,
  resume: ResumeApp,
  notes: NotesApp,
  trash: TrashApp,
  sticky: StickyApp,
  contact: ContactApp,
  settings: SettingsApp,
  photos: ProjectsApp,
  safari: FinderApp,
  music: NotesApp,
};

export function WindowManager() {
  const windows = useWindowsStore((s) => s.windows);
  const openIds = (Object.keys(windows) as AppId[]).filter(
    (id) => windows[id].isOpen && !windows[id].isMinimized,
  );

  return (
    <AnimatePresence>
      {openIds.map((id) => {
        const Content = APP_CONTENT[id];
        if (!Content) return null;
        return (
          <Window key={id} id={id}>
            <Content />
          </Window>
        );
      })}
    </AnimatePresence>
  );
}
