/**
 * [INPUT]: react hooks, SiteStats from @/lib/stats
 * [OUTPUT]: Terminal — expandable session panel with real stats, navigation commands, and typing effect
 * [POS]: home/ center-column bottom panel, simulates FRI terminal with live site metrics
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { SiteStats } from "@/lib/stats";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Line {
  type: "meta" | "user" | "output" | "prompt" | "typing";
  text: string;
}

interface TerminalProps {
  stats: SiteStats;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TYPE_MS = 45;

const DIARY_SLUGS = [
  "2026-03-27", "2026-03-26", "2026-03-25", "2026-03-24", "2026-03-23",
  "2026-03-22", "2026-03-21", "2026-03-20", "2026-03-19", "2026-03-18",
  "2026-03-17", "2026-03-16", "2026-03-15", "2026-03-14", "2026-03-11",
  "2026-03-10", "2026-03-08", "2026-03-07", "2026-03-06", "2026-03-05",
];

const GENERIC_REPLIES = [
  "Noted. Anything else?",
  "Processing. Done.",
  "Understood.",
  "Acknowledged.",
  "Input received.",
  "Logged.",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatWords(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function getRandomPath(): string {
  const slug = DIARY_SLUGS[Math.floor(Math.random() * DIARY_SLUGS.length)];
  return `/diary/${slug}`;
}

function buildSlashReplies(s: SiteStats): Record<string, string> {
  return {
    help: "Commands: /latest, /stats, /random, /about. Or type anything.",
    latest: `Recent: [${s.lastEntryDate}] ${s.lastEntryAge} | See /diary or /weekly for full archive.`,
    stats: `${s.totalEntries} entries. ${formatWords(s.totalWords)} words. ${s.daysSinceLaunch} days online. ${s.thisWeekCount} posts this week.`,
    about: "FRI \u2014 a portfolio and content platform. Diary (Chinese, personal). Weekly (English, design engineering). Built with Next.js, deployed on Vercel.",
    status: `${s.totalEntries} entries indexed. ${s.cachedUrls} link previews cached. Deploy: Vercel. All systems nominal.`,
  };
}

function buildInitialLines(s: SiteStats): Line[] {
  return [
    { type: "meta", text: "# FRI system initialized" },
    { type: "user", text: "status" },
    {
      type: "output",
      text: `Friday: All systems nominal. ${s.totalEntries} entries indexed, ${formatWords(s.totalWords)} words processed. Uptime: ${s.daysSinceLaunch} days.`,
    },
    { type: "user", text: "help" },
    {
      type: "output",
      text: "Friday: /latest \u2014 recent entries | /stats \u2014 site metrics | /random \u2014 surprise me | /about \u2014 what is this",
    },
  ];
}

function getReply(text: string, slashReplies: Record<string, string>): string {
  const t = text.trim();
  let body: string;
  if (t.startsWith("/")) {
    const cmd = t.slice(1).split(/\s/)[0].toLowerCase();
    body = slashReplies[cmd] || "Unknown command. Type /help for options.";
  } else {
    body = GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)];
  }
  return "Friday: " + body;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Terminal({ stats }: TerminalProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const slashReplies = useMemo(() => buildSlashReplies(stats), [stats]);
  const [lines, setLines] = useState<Line[]>(() => buildInitialLines(stats));
  const [typingText, setTypingText] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auto-scroll to bottom on new content */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(scrollToBottom, [lines, typingText, scrollToBottom]);

  /* Cleanup typing timer on unmount */
  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  /* ---- Submit handler ---- */
  const submit = useCallback(() => {
    const text = input.trim();
    if (!text || typingText !== null) return;

    const cmd = text.startsWith("/") ? text.slice(1).split(/\s/)[0].toLowerCase() : "";
    let reply: string;
    let navigateTo: string | null = null;

    if (cmd === "random") {
      const path = getRandomPath();
      reply = `Friday: Navigating to ${path}...`;
      navigateTo = path;
    } else if (cmd === "latest") {
      reply = getReply(text, slashReplies);
      navigateTo = "/weekly";
    } else if (cmd === "diary") {
      reply = "Friday: Opening diary...";
      navigateTo = "/diary";
    } else if (cmd === "weekly") {
      reply = "Friday: Opening weekly archive...";
      navigateTo = "/weekly";
    } else {
      reply = getReply(text, slashReplies);
    }

    setInput("");
    setLines((prev) => [...prev, { type: "user", text }]);

    setTypingText("");
    let pos = 0;

    function typeTick() {
      pos++;
      setTypingText(reply.slice(0, pos));
      if (pos < reply.length) {
        typingRef.current = setTimeout(typeTick, TYPE_MS);
      } else {
        setTypingText(null);
        setLines((prev) => [...prev, { type: "output", text: reply }]);
        if (navigateTo) {
          setTimeout(() => router.push(navigateTo!), 400);
        }
      }
    }

    typingRef.current = setTimeout(typeTick, TYPE_MS);
  }, [input, typingText, slashReplies, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  /* ---- Render a single line ---- */
  function renderLine(line: Line, i: number) {
    switch (line.type) {
      case "meta":
        return (
          <div
            key={i}
            className="term-meta mb-3 cursor-pointer"
            onClick={() => setExpanded((e) => !e)}
          >
            {line.text}
          </div>
        );
      case "user":
        return (
          <div key={i} className="mb-1">
            <span className="term-prompt-user">zihan@fri:~$</span>{" "}
            {line.text}
          </div>
        );
      case "output":
        return (
          <div key={i} className="term-output mb-2">
            {line.text}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div
      id="session-panel"
      className={`h-1/3 min-h-[200px] md:min-h-0 glass-panel tech-border rounded-t-lg p-4 md:p-6 flex flex-col justify-end mt-4 ${
        expanded ? "expanded" : ""
      }`}
    >
      {/* Corner decorations */}
      <div className="corner-bl absolute bottom-0 left-0 w-3 h-3" />
      <div className="corner-br absolute bottom-0 right-0 w-3 h-3" />

      {/* Toggle button */}
      <button
        type="button"
        className="absolute top-2 right-2 md:right-4 p-2 md:p-1 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center text-pink-500 hover:text-pink-300 transition-colors z-10 -translate-y-1"
        title="Expand / Collapse"
        aria-label="Toggle session panel"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://unpkg.com/pixelarticons@1.8.1/svg/chevron-up.svg"
          className="pa-icon w-5 h-5 session-chevron inline-block"
          alt=""
          aria-hidden="true"
        />
      </button>

      {/* Scrollable terminal output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scroll mb-5 md:mb-4 min-h-0"
      >
        <div className="terminal-output font-tech">
          {lines.map(renderLine)}

          {/* Typing-in-progress line */}
          {typingText !== null && (
            <div className="term-output typewriter mb-2">{typingText}</div>
          )}

          {/* Idle cursor prompt */}
          {typingText === null && (
            <div className="mt-2">
              <span className="term-prompt-fri">fri&gt;</span>{" "}
              <span className="term-cursor" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Command input */}
      <div className="relative group pt-5 mt-1">
        <div className="absolute -top-3 left-2 text-[10px] text-pink-500 bg-[#0a1525] px-1 font-tech">
          COMMAND INPUT
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-[#0a1525]/50 border border-pink-500/30 text-pink-100 font-tech py-3.5 px-4 pr-14 rounded focus:outline-none focus:border-pink-400 transition-all placeholder-pink-900/60 text-base min-h-[48px]"
          placeholder="Enter command or query... (try /help)"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-pink-500 hover:text-white transition-colors"
          title="Send"
          aria-label="Send"
          onClick={submit}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://unpkg.com/pixelarticons@1.8.1/svg/arrow-right.svg"
            className="pa-icon w-5 h-5 inline-block"
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
