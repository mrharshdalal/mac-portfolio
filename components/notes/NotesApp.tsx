"use client";

import { useEffect, useState } from "react";
import { notes as initialNotes } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import type { NoteItem } from "@/types";

const STORAGE_KEY = "mac-portfolio-notes";

export function NotesApp() {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [selectedId, setSelectedId] = useState(initialNotes[0]?.id ?? null);
  const selected = notes.find((n) => n.id === selectedId) ?? null;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as NoteItem[];
        if (parsed.length) {
          setNotes(parsed);
          setSelectedId(parsed[0].id);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const update = (partial: Partial<NoteItem>) => {
    if (!selectedId) return;
    setNotes((ns) =>
      ns.map((n) =>
        n.id === selectedId
          ? { ...n, ...partial, date: new Date().toISOString().slice(0, 10) }
          : n,
      ),
    );
  };

  const create = () => {
    const n: NoteItem = {
      id: String(Date.now()),
      title: "New Note",
      content: "",
      date: new Date().toISOString().slice(0, 10),
    };
    setNotes((ns) => [n, ...ns]);
    setSelectedId(n.id);
  };

  return (
    <div className="flex h-full bg-white">
      <aside className="w-1/3 overflow-auto border-r border-zinc-200 bg-zinc-50 p-2">
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-zinc-600">Notes</h3>
          <button
            type="button"
            className="flex size-6 items-center justify-center rounded-full bg-zinc-200 text-lg leading-none hover:bg-zinc-300"
            onClick={create}
            aria-label="New note"
          >
            +
          </button>
        </div>
        {notes.map((n) => (
          <button
            key={n.id}
            type="button"
            className={cn(
              "mb-1 w-full rounded-md p-2 text-left text-sm",
              selectedId === n.id
                ? "bg-mac-blue text-white"
                : "text-zinc-700 hover:bg-zinc-200",
            )}
            onClick={() => setSelectedId(n.id)}
          >
            <div className="truncate font-medium">{n.title}</div>
            <div className="truncate text-xs opacity-70">{n.date}</div>
          </button>
        ))}
      </aside>
      <div className="flex flex-1 flex-col">
        {selected ? (
          <>
            <input
              value={selected.title}
              onChange={(e) => update({ title: e.target.value })}
              className="border-b border-zinc-200 px-4 py-3 text-lg font-semibold outline-none"
            />
            <textarea
              value={selected.content}
              onChange={(e) => update({ content: e.target.value })}
              className="flex-1 resize-none p-4 font-mono text-sm leading-relaxed outline-none"
              placeholder="Write markdown…"
            />
            <p className="border-t border-zinc-100 px-4 py-1 text-[11px] text-zinc-400">
              Autosaved · Markdown supported
            </p>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-zinc-400">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  );
}
