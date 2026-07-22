"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  FileText,
  Folder,
  Grid2x2,
  Image as ImageIcon,
  List,
  Search,
  Sparkles,
  Star,
  Trash2,
  User,
  Mail,
  Briefcase,
} from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  education,
  experiences,
  portfolio,
  projects,
  skills,
  timeline,
} from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { springs } from "@/lib/spring-presets";
import { useAppsStore } from "@/store/apps";
import { useTrashStore } from "@/store/trash";
import { useWindowsStore } from "@/store/windows";
import type { AppId } from "@/types";

const SIDEBAR = [
  { id: "favorites", label: "Favorites", icon: Star, group: "favorites" as const },
  { id: "about", label: "About Me", icon: User, group: "favorites" as const },
  { id: "resume", label: "Resume", icon: FileText, group: "favorites" as const },
  { id: "contact", label: "Contact", icon: Mail, group: "favorites" as const },
  { id: "skills", label: "Skills", icon: Sparkles, group: "favorites" as const },
  { id: "timeline", label: "Timeline", icon: Clock, group: "favorites" as const },
  { id: "gallery", label: "Gallery", icon: ImageIcon, group: "favorites" as const },
  { id: "projects", label: "Projects", icon: Briefcase, group: "projects" as const },
  { id: "trash", label: "Trash", icon: Trash2, group: "projects" as const },
];

export function FinderApp() {
  const path = useAppsStore((s) => s.finderPath);
  const view = useAppsStore((s) => s.finderView);
  const setPath = useAppsStore((s) => s.setFinderPath);
  const setView = useAppsStore((s) => s.setFinderView);
  const [query, setQuery] = useState("");
  const open = useWindowsStore((s) => s.open);

  const crumbs = useMemo(() => {
    const item = SIDEBAR.find((s) => s.id === path);
    return ["Macintosh HD", "Users", "harsh", item?.label ?? "Favorites"];
  }, [path]);

  return (
    <div className="flex h-full bg-[#f5f5f7] text-zinc-800">
      {/* Sidebar */}
      <aside className="flex w-[180px] shrink-0 flex-col border-r border-black/8 bg-[#ececef]/80 p-2">
        <p className="px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
          Favorites
        </p>
        {SIDEBAR.filter((s) => s.group === "favorites").map((item) => (
          <SidebarItem
            key={item.id}
            active={path === item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => setPath(item.id)}
          />
        ))}
        <p className="mt-3 px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
          Projects
        </p>
        {SIDEBAR.filter((s) => s.group === "projects").map((item) => (
          <SidebarItem
            key={item.id}
            active={path === item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => setPath(item.id)}
          />
        ))}
        {projects.map((p, i) => (
          <SidebarItem
            key={p.id}
            active={path === p.id}
            icon={Folder}
            label={`Project 0${i + 1}`}
            onClick={() => setPath(p.id)}
          />
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-black/8 bg-white/50 px-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-[12px] text-zinc-500">
            {crumbs.map((c, i) => (
              <span key={`${c}-${i}`} className="flex items-center gap-1 truncate">
                {i > 0 && <span className="text-zinc-300">/</span>}
                <span className={cn(i === crumbs.length - 1 && "font-medium text-zinc-700")}>
                  {c}
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-md border border-black/10 bg-white px-2 py-1">
            <Search className="size-3 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-28 bg-transparent text-[12px] outline-none"
            />
          </div>
          <button
            type="button"
            aria-label="Grid view"
            className={cn(
              "rounded p-1",
              view === "grid" ? "bg-black/10" : "hover:bg-black/5",
            )}
            onClick={() => setView("grid")}
          >
            <Grid2x2 className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="List view"
            className={cn(
              "rounded p-1",
              view === "list" ? "bg-black/10" : "hover:bg-black/5",
            )}
            onClick={() => setView("list")}
          >
            <List className="size-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={path + view + query}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6 }}
              transition={springs.soft}
            >
              <FinderBody
                path={path}
                view={view}
                query={query}
                onOpenApp={(id) => open(id)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px]",
        active ? "bg-mac-blue text-white" : "text-zinc-700 hover:bg-black/5",
      )}
      onClick={onClick}
    >
      <Icon className="size-3.5 shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function FinderBody({
  path,
  view,
  query,
  onOpenApp,
}: {
  path: string;
  view: "grid" | "list";
  query: string;
  onOpenApp: (id: AppId) => void;
}) {
  const trash = useTrashStore((s) => s.items);
  const q = query.toLowerCase();

  if (path === "about") return <AboutContent />;
  if (path === "resume") return <ResumeContent />;
  if (path === "contact") return <ContactContent />;
  if (path === "skills") {
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills
            .filter((s) => s.toLowerCase().includes(q))
            .map((s) => (
              <span
                key={s}
                className="rounded-full bg-white px-3 py-1 text-sm shadow-sm ring-1 ring-black/5"
              >
                {s}
              </span>
            ))}
        </div>
      </div>
    );
  }
  if (path === "timeline") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Timeline</h2>
        {timeline.map((t) => (
          <div key={t.year} className="flex gap-4 border-l-2 border-mac-blue/40 pl-4">
            <span className="w-12 font-semibold text-mac-blue">{t.year}</span>
            <p className="text-sm text-zinc-600">{t.event}</p>
          </div>
        ))}
      </div>
    );
  }
  if (path === "trash") return <TrashContent />;

  const project = projects.find((p) => p.id === path);
  if (project) {
    return (
      <div className="max-w-xl">
        <Image
          src={project.image}
          alt={project.title}
          width={800}
          height={384}
          className="mb-4 h-48 w-full rounded-xl object-cover"
        />
        <p className="text-sm text-zinc-400">{project.subtitle} · {project.year}</p>
        <h2 className="mb-2 text-2xl font-semibold">{project.title}</h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600">
          {project.description}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs">
              {t}
            </span>
          ))}
        </div>
        <p className="text-sm text-zinc-500">Role: {project.role}</p>
      </div>
    );
  }

  // Favorites / Projects / Gallery grid
  const items =
    path === "projects" || path === "gallery" || path === "favorites"
      ? [
          ...projects.map((p) => ({
            id: p.id,
            label: p.title,
            icon: "folder" as const,
            kind: "project" as const,
          })),
          {
            id: "about",
            label: "About Me",
            icon: "about" as const,
            kind: "app" as const,
          },
          {
            id: "resume",
            label: "Resume.pdf",
            icon: "resume" as const,
            kind: "app" as const,
          },
          {
            id: "terminal",
            label: "Terminal",
            icon: "terminal" as const,
            kind: "app" as const,
          },
        ].filter((i) => i.label.toLowerCase().includes(q))
      : [];

  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 bg-zinc-50 text-[11px] text-zinc-400 uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Kind</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b border-black/5 hover:bg-mac-blue/10"
                onDoubleClick={() => {
                  if (item.kind === "app") onOpenApp(item.id as AppId);
                  else useAppsStore.getState().setFinderPath(item.id);
                }}
              >
                <td className="flex items-center gap-2 px-3 py-2">
                  <AppIcon name={item.icon} size={28} />
                  {item.label}
                </td>
                <td className="px-3 py-2 text-zinc-500 capitalize">{item.kind}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-mac-blue/10"
          onDoubleClick={() => {
            if (item.kind === "app") onOpenApp(item.id as AppId);
            else useAppsStore.getState().setFinderPath(item.id);
          }}
        >
          <motion.div layoutId={`finder-${item.id}`} transition={springs.soft}>
            <AppIcon name={item.icon} size={64} />
          </motion.div>
          <span className="text-center text-[12px] font-medium">{item.label}</span>
        </button>
      ))}
      {path === "favorites" && trash.length > 0 && (
        <p className="col-span-full text-xs text-zinc-400">
          Tip: open Trash from the dock — I said don&apos;t look.
        </p>
      )}
    </div>
  );
}

export function AboutContent() {
  return (
    <div className="flex flex-col gap-6 p-2 md:flex-row">
      <div className="shrink-0">
        <div className="flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-indigo-500 text-4xl font-semibold text-white shadow-lg">
          HD
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{portfolio.name}</h1>
        <h2 className="mb-3 text-lg text-zinc-500">{portfolio.title}</h2>
        <p className="mb-4 leading-relaxed text-zinc-700">{portfolio.bio}</p>
        <p className="mb-4 text-sm text-zinc-500">{portfolio.shortBio}</p>
        <div className="flex flex-wrap gap-2">
          {["Java", "TypeScript", "Spring Boot", "SvelteKit"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsContent() {
  return (
    <div className="p-2">
      <h1 className="mb-4 text-xl font-semibold">Projects</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.id}
            className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5"
          >
            <Image
              src={p.image}
              alt={p.title}
              width={640}
              height={288}
              className="h-36 w-full object-cover"
            />
            <div className="p-3">
              <p className="text-xs text-zinc-400">{p.subtitle}</p>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{p.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ResumeContent() {
  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Resume</h1>
        <div className="flex gap-2">
          <a
            href={portfolio.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50"
          >
            View PDF
          </a>
          <a
            href={portfolio.resumeUrl}
            download="HarshDalalResume.pdf"
            className="rounded-md bg-mac-blue px-3 py-1.5 text-sm text-white"
          >
            Download PDF
          </a>
        </div>
      </div>
      <iframe
        src={`${portfolio.resumeUrl}#view=FitH`}
        title="Harsh Dalal Resume"
        className="h-[520px] w-full rounded-lg border border-zinc-200 bg-white"
      />
      <section>
        <h2 className="mb-3 border-b border-zinc-200 pb-1 text-lg font-semibold">
          Experience
        </h2>
        <div className="space-y-4">
          {experiences.map((job) => (
            <div key={job.company + job.role}>
              <div className="flex justify-between gap-2">
                <h3 className="font-semibold">{job.role}</h3>
                <span className="text-sm text-zinc-400">{job.period}</span>
              </div>
              <p className="text-mac-blue">{job.company}</p>
              <p className="mt-1 text-sm text-zinc-600">{job.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 border-b border-zinc-200 pb-1 text-lg font-semibold">
          Education
        </h2>
        {education.map((edu) => (
          <div key={edu.institution}>
            <div className="flex justify-between">
              <h3 className="font-semibold">{edu.degree}</h3>
              <span className="text-sm text-zinc-400">{edu.period}</span>
            </div>
            <p className="text-mac-blue">{edu.institution}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="mb-3 border-b border-zinc-200 pb-1 text-lg font-semibold">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="rounded-full bg-zinc-100 px-3 py-1 text-sm">
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ContactContent() {
  return (
    <div className="space-y-4 p-2">
      <h1 className="text-xl font-semibold">Contact</h1>
      <p className="text-zinc-600">
        Open to full-stack roles, freelance builds, and interesting engineering problems.
      </p>
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-zinc-400">Email · </span>
          <a className="text-mac-blue" href={`mailto:${portfolio.email}`}>
            {portfolio.email}
          </a>
        </p>
        <p>
          <span className="text-zinc-400">Phone · </span>
          <a className="text-mac-blue" href={`tel:${portfolio.phone.replace(/\s/g, "")}`}>
            {portfolio.phone}
          </a>
        </p>
        <p>
          <span className="text-zinc-400">GitHub · </span>
          <a
            className="text-mac-blue"
            href={portfolio.socials.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {portfolio.website}
          </a>
        </p>
        <p>
          <span className="text-zinc-400">LinkedIn · </span>
          <a
            className="text-mac-blue"
            href={portfolio.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/mrharshdalal
          </a>
        </p>
        <p>
          <span className="text-zinc-400">Location · </span>
          {portfolio.location}
        </p>
      </div>
    </div>
  );
}

export function TrashContent() {
  const items = useTrashStore((s) => s.items);
  const empty = useTrashStore((s) => s.empty);
  const restore = useTrashStore((s) => s.restoreItem);

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Trash</h1>
          <p className="text-sm text-zinc-400">I said, don&apos;t look!</p>
        </div>
        <button
          type="button"
          className="rounded-md bg-zinc-200 px-3 py-1 text-sm hover:bg-zinc-300"
          onClick={empty}
        >
          Empty Trash
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-400">Trash is empty. Relieved?</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-black/5"
              onDoubleClick={() => restore(item.id)}
              title="Double-click to restore"
            >
              <AppIcon
                name={
                  item.type === "pdf"
                    ? "resume"
                    : item.type === "img"
                      ? "photos"
                      : item.type === "link"
                        ? "safari"
                        : "notes"
                }
                size={48}
              />
              <span className="text-center text-[11px]">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
