/**
 * [INPUT]:  react useState/useEffect for NYC clock; props totalEntries, totalWords, daysSinceLaunch
 * [OUTPUT]: SystemHeader — renders XP titlebar+menubar in xp skin, or original sci-fi header in scifi skin
 * [POS]:    home/ layout header, first visual element on the homepage
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSkin } from "@/lib/skin";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SystemHeaderProps {
  totalEntries: number;
  totalWords: number;
  daysSinceLaunch: number;
}

/* ------------------------------------------------------------------ */
/*  Clock formatters                                                   */
/* ------------------------------------------------------------------ */

const clockFmtXP = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour12: true,
  hour: "numeric",
  minute: "2-digit",
});

const clockFmtScifi = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SystemHeader({ totalEntries, totalWords }: SystemHeaderProps) {
  const { skin } = useSkin();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const fmt = skin === "xp" ? clockFmtXP : clockFmtScifi;
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [skin]);

  const entriesPct = Math.min(100, totalEntries);
  const wordsPct = Math.min(100, Math.round(totalWords / 500));

  /* ---- XP skin ---- */
  if (skin === "xp") {
    return (
      <header className="flex-none z-50 xp-window" style={{ borderRadius: "0 !important" }}>
        {/* XP Titlebar */}
        <div className="xp-titlebar">
          <div className="xp-titlebar-text">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="12" height="14" fill="#ffffff" stroke="#c0c0c0" strokeWidth="0.5"/>
              <rect x="9" y="1" width="4" height="4" fill="#b0c8e8"/>
              <polygon points="9,1 13,1 13,5 9,5" fill="#7090c0"/>
              <line x1="3" y1="6" x2="11" y2="6" stroke="#c0c0c0" strokeWidth="0.8"/>
              <line x1="3" y1="8" x2="11" y2="8" stroke="#c0c0c0" strokeWidth="0.8"/>
              <line x1="3" y1="10" x2="9" y2="10" stroke="#c0c0c0" strokeWidth="0.8"/>
            </svg>
            Friday — Intelligent Assistant v3.28
          </div>

          {/* Status area */}
          <div className="flex items-center gap-3 mr-2 text-white" style={{ fontSize: "10px", fontFamily: "Tahoma, sans-serif" }}>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <span className="status-dot w-2 h-2 animate-pulse" style={{ background: "#6cbd00", boxShadow: "0 0 3px #6cbd00" }} />
              <span className="opacity-90">ONLINE</span>
            </div>
            <div className="hidden md:flex flex-col items-end gap-0.5">
              <span className="opacity-80">POSTS: {totalEntries}</span>
              <div className="w-20 h-1.5" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div className="h-full" style={{ width: `${entriesPct}%`, background: "linear-gradient(90deg, #50d000, #6cbd00)" }} />
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-0.5">
              <span className="opacity-80">WORDS: {(totalWords / 1000).toFixed(1)}k</span>
              <div className="w-20 h-1.5" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div className="h-full" style={{ width: `${wordsPct}%`, background: "linear-gradient(90deg, #50d000, #6cbd00)" }} />
              </div>
            </div>
          </div>

          {/* Window control buttons */}
          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <button className="xp-btn-min" title="Minimize" aria-label="Minimize">
              <span style={{ fontSize: "8px", lineHeight: 1 }}>─</span>
            </button>
            <button className="xp-btn-max" title="Maximize" aria-label="Maximize">
              <span style={{ fontSize: "8px", lineHeight: 1 }}>□</span>
            </button>
            <button className="xp-btn-close" title="Close" aria-label="Close">
              <span style={{ fontSize: "10px", fontWeight: "bold", lineHeight: 1 }}>✕</span>
            </button>
          </div>
        </div>

        {/* XP Menu bar */}
        <div className="xp-menubar">
          <span className="xp-menubar-item">File</span>
          <span className="xp-menubar-item">Edit</span>
          <span className="xp-menubar-item">View</span>
          <span className="xp-menubar-item">Tools</span>
          <span className="xp-menubar-item">Help</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-2" style={{ borderLeft: "1px solid #d4d0c8", fontSize: "10px", color: "#000000", fontFamily: "Tahoma, sans-serif" }}>
            <span style={{ color: "#595959" }}>EST [NEW YORK]</span>
            <span style={{ fontWeight: "bold", color: "#0a246a" }}>{clock}</span>
          </div>
        </div>
      </header>
    );
  }

  /* ---- Sci-fi skin — original header ---- */
  return (
    <header
      className="flex-none min-h-14 md:h-16 border-b backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50"
      style={{ borderColor: "var(--border-accent)", backgroundColor: "var(--header-bg)" }}
    >
      {/* Left: logo + subtitle */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-thin font-workbench tracking-widest truncate" style={{ color: "var(--text-primary)" }}>
            Friday
          </h1>
          <p className="text-[9px] md:text-[10px] font-tech tracking-[0.15em] md:tracking-[0.2em]" style={{ color: "var(--text-accent-soft)" }}>
            INTELLIGENT ASSISTANT V3.28
          </p>
        </div>
      </div>

      {/* Right: status / gauges / clock / toggle */}
      <div className="flex items-center gap-3 md:gap-12 font-tech text-[10px] md:text-xs shrink-0" style={{ color: "var(--text-accent-soft)" }}>
        <div className="flex items-center gap-2">
          <span className="status-dot w-2 h-2 animate-pulse shrink-0" style={{ background: "var(--text-status)" }} />
          <span className="hidden sm:inline">SYSTEM ONLINE</span>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span>POSTS: {totalEntries}</span>
          <div className="w-24 h-1 mt-1" style={{ background: "var(--gauge-track)" }}>
            <div className="h-full transition-all duration-700" style={{ width: `${entriesPct}%`, background: "var(--gauge-fill)" }} />
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span>WORDS: {(totalWords / 1000).toFixed(1)}k</span>
          <div className="w-24 h-1 mt-1" style={{ background: "var(--gauge-track)" }}>
            <div className="h-full transition-all duration-700" style={{ width: `${wordsPct}%`, background: "var(--gauge-fill)" }} />
          </div>
        </div>
        <ThemeToggle />
        <div className="hidden sm:block font-tech text-[10px]" style={{ color: "var(--text-accent-soft)" }}>
          {clock} <span className="opacity-50 text-[9px]">NYC</span>
        </div>
      </div>
    </header>
  );
}
