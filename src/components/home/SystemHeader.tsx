/**
 * [INPUT]:  react useState/useEffect for clock + resource jitter
 * [OUTPUT]: SystemHeader — top bar with logo, status, CPU/MEM gauges, NYC clock
 * [POS]:    home/ layout header, first visual element on the homepage
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CPU_BASE = 18;
const MEM_BASE_GB = 1.2;
const MEM_MAX_GB = 1.6;
const MEM_LO = 1.14;
const MEM_HI = 1.26;

const clockFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SystemHeader() {
  const [clock, setClock] = useState("");
  const [cpu, setCpu] = useState(CPU_BASE);
  const [mem, setMem] = useState(MEM_BASE_GB);

  /* --- NYC clock (1 s) --- */
  useEffect(() => {
    const tick = () => setClock(clockFmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* --- CPU / MEM jitter (2.5 s) --- */
  useEffect(() => {
    const tick = () => {
      const rawCpu = Math.round(CPU_BASE + (Math.random() - 0.5) * 10);
      setCpu(Math.min(100, Math.max(0, rawCpu)));

      const rawMem = MEM_BASE_GB + (Math.random() - 0.5) * 0.12;
      setMem(Math.max(MEM_LO, Math.min(MEM_HI, rawMem)));
    };
    tick();
    const id = setInterval(tick, 2500);
    return () => clearInterval(id);
  }, []);

  const memPct = Math.round((mem / MEM_MAX_GB) * 100);

  return (
    <header className="flex-none min-h-14 md:h-16 border-b border-[#ec4899]/25 bg-[#050510]/90 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50">
      {/* --- Left: logo + subtitle --- */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-thin font-workbench tracking-widest truncate">
            Friday
          </h1>
          <p className="text-[9px] md:text-[10px] font-tech text-pink-400/80 tracking-[0.15em] md:tracking-[0.2em]">
            INTELLIGENT ASSISTANT V2026.2.1
          </p>
        </div>
      </div>

      {/* --- Right: status / gauges / clock --- */}
      <div className="flex items-center gap-3 md:gap-12 font-tech text-[10px] md:text-xs text-pink-400/85 shrink-0">
        {/* status dot */}
        <div className="flex items-center gap-2">
          <span className="status-dot w-2 h-2 bg-green-500 animate-pulse shrink-0" />
          <span className="hidden sm:inline">SYSTEM ONLINE</span>
        </div>

        {/* CPU gauge */}
        <div className="hidden sm:flex flex-col items-end">
          <span>CPU: {cpu}%</span>
          <div className="w-24 h-1 bg-pink-950 mt-1">
            <div
              className="h-full bg-pink-400 transition-all duration-700"
              style={{ width: `${cpu}%` }}
            />
          </div>
        </div>

        {/* MEM gauge */}
        <div className="hidden sm:flex flex-col items-end">
          <span>MEM: {mem.toFixed(1)}GB</span>
          <div className="w-24 h-1 bg-pink-950 mt-1">
            <div
              className="h-full bg-pink-400 transition-all duration-700"
              style={{ width: `${memPct}%` }}
            />
          </div>
        </div>

        {/* NYC clock */}
        <div className="text-right">
          <div className="text-base md:text-lg font-bold text-white font-vt323">
            {clock}
          </div>
          <div className="text-[9px] md:text-[10px] opacity-60">
            EST [NEW YORK]
          </div>
        </div>
      </div>
    </header>
  );
}
