/**
 * [INPUT]: react hooks, SiteStats from @/lib/stats
 * [OUTPUT]: Terminal — expandable panel with real AI chat (Minimax M2.7) + local slash commands
 * [POS]: home/ center-column bottom panel, FRI terminal with live AI + site navigation
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { SiteStats } from "@/lib/stats";
import { useSkin } from "@/lib/skin";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Line {
  type: "meta" | "user" | "output" | "prompt" | "typing";
  text: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface TerminalProps {
  stats: SiteStats;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DIARY_SLUGS = [
  "2026-03-27", "2026-03-26", "2026-03-25", "2026-03-24", "2026-03-23",
  "2026-03-22", "2026-03-21", "2026-03-20", "2026-03-19", "2026-03-18",
  "2026-03-17", "2026-03-16", "2026-03-15", "2026-03-14", "2026-03-11",
  "2026-03-10", "2026-03-08", "2026-03-07", "2026-03-06", "2026-03-05",
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
    help: "Commands: /latest, /stats, /random, /about. Or just talk to me.",
    latest: `Recent: [${s.lastEntryDate}] ${s.lastEntryAge} | See /diary or /weekly for full archive.`,
    stats: `${s.totalEntries} entries. ${formatWords(s.totalWords)} words. ${s.daysSinceLaunch} days online. ${s.thisWeekCount} posts this week.`,
    about: "FRI — a portfolio and content platform. Diary (Chinese, personal). Weekly (English, design engineering). Built with Next.js, deployed on Vercel.",
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
      text: "Friday: /latest — recent entries | /stats — site metrics | /random — surprise me | Or just talk to me.",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  SSE stream parser                                                  */
/* ------------------------------------------------------------------ */

async function* parseSSE(response: Response): AsyncGenerator<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;

      try {
        const chunk = JSON.parse(data);
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        /* skip malformed chunks */
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Terminal({ stats }: TerminalProps) {
  const router = useRouter();
  const { skin } = useSkin();
  const [expanded, setExpanded] = useState(false);
  const slashReplies = useMemo(() => buildSlashReplies(stats), [stats]);
  const [lines, setLines] = useState<Line[]>(() => buildInitialLines(stats));
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  /* Auto-scroll to bottom on new content */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(scrollToBottom, [lines, streamingText, scrollToBottom]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  /* ---- Local slash command handler ---- */
  const handleSlash = useCallback(
    (text: string): boolean => {
      const cmd = text.slice(1).split(/\s/)[0].toLowerCase();

      let reply: string;
      let navigateTo: string | null = null;

      if (cmd === "random") {
        const path = getRandomPath();
        reply = `Friday: Navigating to ${path}...`;
        navigateTo = path;
      } else if (cmd === "latest") {
        reply = "Friday: " + slashReplies.latest;
        navigateTo = "/weekly";
      } else if (cmd === "diary") {
        reply = "Friday: Opening diary...";
        navigateTo = "/diary";
      } else if (cmd === "weekly") {
        reply = "Friday: Opening weekly archive...";
        navigateTo = "/weekly";
      } else if (slashReplies[cmd]) {
        reply = "Friday: " + slashReplies[cmd];
      } else {
        return false; // not a known slash command — send to AI
      }

      setLines((prev) => [
        ...prev,
        { type: "user", text },
        { type: "output", text: reply },
      ]);

      if (navigateTo) {
        setTimeout(() => router.push(navigateTo!), 400);
      }

      return true;
    },
    [slashReplies, router],
  );

  /* ---- AI chat handler ---- */
  const handleChat = useCallback(
    async (text: string) => {
      setBusy(true);
      setStreamingText("");

      historyRef.current.push({ role: "user", content: text });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyRef.current }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errText = await res.text();
          const fallback = `Friday: [Error ${res.status}] ${errText.slice(0, 100)}`;
          setStreamingText(null);
          setLines((prev) => [...prev, { type: "output", text: fallback }]);
          setBusy(false);
          return;
        }

        let full = "";
        for await (const token of parseSSE(res)) {
          full += token;
          setStreamingText("Friday: " + full);
        }

        const finalText = "Friday: " + (full || "...");
        historyRef.current.push({ role: "assistant", content: full });

        setStreamingText(null);
        setLines((prev) => [...prev, { type: "output", text: finalText }]);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setStreamingText(null);
        setLines((prev) => [
          ...prev,
          { type: "output", text: "Friday: Connection interrupted." },
        ]);
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [],
  );

  /* ---- Submit handler ---- */
  const submit = useCallback(() => {
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setLines((prev) => [...prev, { type: "user", text }]);

    // slash commands handled locally
    if (text.startsWith("/") && handleSlash(text)) return;

    // everything else goes to AI
    handleChat(text);
  }, [input, busy, handleSlash, handleChat]);

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

  /* ---- Sci-fi skin — original glass panel terminal ---- */
  if (skin === "scifi") {
    return (
      <div
        id="session-panel"
        className={`h-1/3 min-h-[200px] md:min-h-0 glass-panel tech-border rounded-t-lg p-4 md:p-6 flex flex-col justify-end mt-4 ${expanded ? "expanded" : ""}`}
      >
        <div className="corner-bl absolute bottom-0 left-0 w-3 h-3" />
        <div className="corner-br absolute bottom-0 right-0 w-3 h-3" />

        <button
          type="button"
          className="absolute top-2 right-2 md:right-4 p-2 md:p-1 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center transition-colors z-10 -translate-y-1"
          style={{ color: "var(--text-accent)" }}
          title="Expand / Collapse"
          aria-label="Toggle session panel"
          onClick={() => setExpanded((e) => !e)}
        >
          <img src="https://unpkg.com/pixelarticons@1.8.1/svg/chevron-up.svg" className="pa-icon w-5 h-5 session-chevron inline-block" alt="" aria-hidden="true" />
        </button>

        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scroll mb-5 md:mb-4 min-h-0">
          <div className="terminal-output font-tech">
            {lines.map(renderLine)}
            {streamingText !== null && <div className="term-output typewriter mb-2">{streamingText}</div>}
            {streamingText === null && (
              <div className="mt-2">
                <span className="term-prompt-fri">fri&gt;</span>{" "}
                <span className="term-cursor" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-3">
          <span className="absolute -top-[7px] left-3 px-1.5 text-[9px] font-vt323 tracking-widest z-10" style={{ color: "var(--text-accent-soft)", background: "var(--bg-panel)" }}>
            COMMAND INPUT
          </span>
          <div className="flex items-center transition-colors" style={{ border: "1px solid var(--border-accent)", background: "var(--bg-input)" }}>
            <span className="pl-3 text-xs font-vt323 text-neon-coral/50 select-none shrink-0">fri&gt;</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent font-vt323 text-sm py-3 px-2 focus:outline-none"
              style={{ color: "var(--text-input)" }}
              placeholder={busy ? "Friday is thinking..." : "type /help or talk to Friday"}
              autoComplete="off"
              disabled={busy}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" className="px-3 py-3 transition-colors shrink-0 disabled:opacity-30" style={{ color: "var(--text-accent-muted)" }} title="Send" aria-label="Send" disabled={busy} onClick={submit}>
              <img src="https://unpkg.com/pixelarticons@1.8.1/svg/arrow-right.svg" className="pa-icon w-4 h-4 inline-block" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- XP skin — CMD window ---- */
  return (
    <div
      id="session-panel"
      className={`h-1/3 min-h-[200px] md:min-h-0 flex flex-col mt-4 ${
        expanded ? "expanded" : ""
      }`}
      style={{
        border: '1px solid #848484',
        boxShadow: '1px 1px 0 #ffffff inset, -1px -1px 0 #808080 inset',
      }}
    >
      {/* Corner decorations */}
      <div className="corner-bl absolute bottom-0 left-0 w-3 h-3" />
      <div className="corner-br absolute bottom-0 right-0 w-3 h-3" />

      {/* XP CMD-style titlebar */}
      <div
        className="shrink-0 flex items-center justify-between px-2 py-1"
        style={{
          background: '#000080',
          borderBottom: '1px solid #000060',
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px', fontWeight: 'bold', color: '#ffffff' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="14" height="12" fill="#000000" stroke="#c0c0c0" strokeWidth="0.5"/>
            <text x="2" y="11" fontSize="8" fill="#c0c0c0" fontFamily="Courier New">C:\&gt;</text>
          </svg>
          Command Prompt — FRI Terminal
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="session-chevron"
            style={{ color: '#c0c0c0', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }}
            title="Expand / Collapse"
            aria-label="Toggle session panel"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "▼" : "▲"}
          </button>
          <div className="flex items-center gap-0.5">
            <button className="xp-btn-min" style={{ width: '16px', height: '14px' }} aria-label="Minimize" title="Minimize">
              <span style={{ fontSize: '6px', lineHeight: 1 }}>─</span>
            </button>
            <button className="xp-btn-max" style={{ width: '16px', height: '14px' }} aria-label="Maximize" title="Maximize">
              <span style={{ fontSize: '6px', lineHeight: 1 }}>□</span>
            </button>
            <button className="xp-btn-close" style={{ width: '16px', height: '14px' }} aria-label="Close" title="Close">
              <span style={{ fontSize: '8px', fontWeight: 'bold', lineHeight: 1 }}>✕</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable terminal output — black CMD window */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scroll p-3 min-h-0"
        style={{ background: '#000000' }}
      >
        <div className="terminal-output">
          {lines.map(renderLine)}

          {/* Streaming AI response */}
          {streamingText !== null && (
            <div className="term-output typewriter mb-2">{streamingText}</div>
          )}

          {/* Idle cursor prompt */}
          {streamingText === null && (
            <div className="mt-2">
              <span className="term-prompt-fri">fri&gt;</span>{" "}
              <span className="term-cursor" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Command input — XP address bar style */}
      <div
        className="shrink-0 flex items-center"
        style={{
          background: 'linear-gradient(180deg, #f5f4ea 0%, #ece9d8 100%)',
          borderTop: '1px solid #848484',
          padding: '3px 4px',
          gap: '4px',
        }}
      >
        <span
          style={{
            fontFamily: 'Tahoma, sans-serif',
            fontSize: '10px',
            color: '#595959',
            whiteSpace: 'nowrap',
          }}
        >
          Command:
        </span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 xp-input"
          style={{ fontFamily: 'Lucida Console, Courier New, monospace', fontSize: '11px' }}
          placeholder={busy ? "Friday is thinking..." : "type /help or talk to Friday"}
          autoComplete="off"
          disabled={busy}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="xp-button"
          style={{ minWidth: '50px', padding: '2px 8px', fontSize: '11px' }}
          title="Send"
          aria-label="Send"
          disabled={busy}
          onClick={submit}
        >
          Send
        </button>
      </div>
    </div>
  );
}
