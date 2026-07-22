"use client";

import { stickyTodo } from "@/data/portfolio";
import { cn } from "@/lib/cn";

export function StickyNote() {
  return (
    <div className="h-full bg-[#fef08a] p-4 text-zinc-800 shadow-inner">
      <p className="mb-3 font-[family-name:var(--font-instrument)] text-xl italic">
        {stickyTodo.title}
      </p>
      <ul className="space-y-2 text-sm">
        {stickyTodo.content.split("\n").map((line) => {
          const done = line.startsWith("~~") && line.endsWith("~~");
          const text = done ? line.slice(2, -2) : line;
          return (
            <li key={line} className={cn(done && "text-zinc-500 line-through")}>
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
