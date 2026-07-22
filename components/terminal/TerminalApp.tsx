"use client";

import { useEffect, useRef, useState } from "react";
import {
  education,
  experiences,
  portfolio,
  projects,
  skills,
} from "@/data/portfolio";
import { useSettingsStore } from "@/store/settings";
import { cn } from "@/lib/cn";

type Line = { text: string; type: "system" | "command" | "output" | "error" };

const COMMANDS = [
  "help",
  "about",
  "projects",
  "skills",
  "resume",
  "contact",
  "clear",
  "theme",
  "whoami",
  "date",
  "pwd",
  "ls",
  "cat",
  "history",
] as const;

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { text: `Last login: ${new Date().toDateString()} on ttys001`, type: "system" },
    { text: `Welcome to ${portfolio.name}'s Portfolio Terminal`, type: "system" },
    { text: "Type 'help' for available commands.", type: "system" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setTheme = useSettingsStore((s) => s.setTheme);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typing]);

  const run = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setHistIdx(-1);
    setLines((l) => [...l, { text: `harsh@portfolio ~ % ${cmd}`, type: "command" }]);

    const [name, ...args] = cmd.split(/\s+/);
    const key = name.toLowerCase();

    if (key === "clear") {
      setLines([{ text: "Terminal cleared.", type: "system" }]);
      return;
    }

    let output = "";
    let type: Line["type"] = "output";

    switch (key) {
      case "help":
        output = `Available commands:\n${COMMANDS.map((c) => `  ${c}`).join("\n")}`;
        break;
      case "about":
        output = `${portfolio.name}\n${portfolio.title}\n\n${portfolio.bio}`;
        break;
      case "whoami":
        output = portfolio.name.toLowerCase().replace(/\s+/g, "");
        break;
      case "date":
        output = new Date().toString();
        break;
      case "pwd":
        output = "/Users/harsh/portfolio";
        break;
      case "ls":
        output = "About Me  Projects  Resume.pdf  Notes  Trash  Desktop";
        break;
      case "cat":
        if (args[0] === "readme.md" || !args[0]) {
          output = `# ${portfolio.name}\n\n${portfolio.shortBio}\n\nOpen Finder to explore.`;
        } else {
          output = `cat: ${args[0]}: No such file or directory`;
          type = "error";
        }
        break;
      case "projects":
        output = projects
          .map((p, i) => `${i + 1}. ${p.title} — ${p.description}`)
          .join("\n\n");
        break;
      case "skills":
        output = skills.join(", ");
        break;
      case "resume":
        output = experiences
          .map((e) => `${e.role} @ ${e.company} (${e.period})\n  ${e.description}`)
          .concat(
            education.map(
              (ed) => `${ed.degree} — ${ed.institution} (${ed.period})`,
            ),
          )
          .join("\n\n");
        break;
      case "contact":
        output = `Email: ${portfolio.email}\nPhone: ${portfolio.phone}\nGitHub: ${portfolio.socials.github}\nLinkedIn: ${portfolio.socials.linkedin}\nLocation: ${portfolio.location}`;
        break;
      case "theme":
        if (args[0] === "dark" || args[0] === "light" || args[0] === "auto") {
          setTheme(args[0]);
          output = `Theme set to ${args[0]}`;
        } else {
          output = "Usage: theme [light|dark|auto]";
        }
        break;
      case "history":
        output = history.map((h, i) => `${i + 1}  ${h}`).join("\n") || "(empty)";
        break;
      default:
        output = `zsh: command not found: ${key}\nType 'help' for available commands.`;
        type = "error";
    }

    // Typing animation
    setTyping(true);
    let built = "";
    for (const ch of output) {
      built += ch;
      const current = built;
      setLines((l) => {
        const copy = [...l];
        const last = copy[copy.length - 1];
        if (last?.type === "output" || last?.type === "error") {
          copy[copy.length - 1] = { text: current, type };
        } else {
          copy.push({ text: current, type });
        }
        return copy;
      });
      await new Promise((r) => setTimeout(r, 4));
    }
    setTyping(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(history[next] ?? "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <div
      className="flex h-full flex-col bg-[#1e1e1e] font-mono text-[13px] text-zinc-100"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 space-y-0.5 overflow-auto p-4">
        {lines.map((line, i) => (
          <pre
            key={`${i}-${line.text.slice(0, 12)}`}
            className={cn(
              "m-0 whitespace-pre-wrap break-words",
              line.type === "command" && "text-emerald-400",
              line.type === "error" && "text-red-400",
              line.type === "system" && "text-sky-300",
              line.type === "output" && "text-zinc-200",
            )}
          >
            {line.text}
          </pre>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">harsh@portfolio ~ %</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-zinc-100 outline-none"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            disabled={typing}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
