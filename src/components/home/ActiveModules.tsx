/**
 * [INPUT]: TechBorder, useSkin
 * [OUTPUT]: ActiveModules — skin-aware panel with jittery progress bars
 * [POS]: home/ left-column bottom panel
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useEffect, useRef } from "react";
import { TechBorder } from "@/components/ui/TechBorder";
import { useSkin } from "@/lib/skin";

/* ------------------------------------------------------------------ */
/*  Static module data                                                 */
/* ------------------------------------------------------------------ */

const modules = [
  { name: "Next.js 16", status: "SSG", ok: true, base: 100 },
  { name: "Tailwind v4", status: "LOADED", ok: true, base: 100 },
  { name: "Markdown Pipeline", status: "ACTIVE", ok: true, base: 100 },
  { name: "Link Preview (OG)", status: "CACHED", ok: true, base: 92 },
  { name: "Geist Pixel", status: "LOADED", ok: true, base: 100 },
  { name: "Pretext", status: "READY", ok: false, base: 65 },
  { name: "Vercel Deploy", status: "CONNECTED", ok: true, base: 100 },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ActiveModules() {
  const { skin } = useSkin();
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    barsRef.current.forEach((el, i) => {
      if (!el) return;
      const base = modules[i].base;
      const interval = Math.random() * 1200 + 1600;

      function update() {
        const delta = (Math.random() - 0.5) * 30;
        const w = Math.min(100, Math.max(0, base + delta));
        el!.style.width = w + "%";
      }

      function schedule() {
        update();
        const id = setTimeout(schedule, interval);
        timers.push(id);
      }

      const delayId = setTimeout(schedule, Math.random() * 1800 + 400);
      timers.push(delayId);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  /* ---- XP skin ---- */
  if (skin === "xp") {
    return (
      <TechBorder className="flex-1 overflow-hidden flex flex-col">
        {/* XP Titlebar */}
        <div className="xp-titlebar shrink-0">
          <div className="xp-titlebar-text">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="6" height="6" fill="#316ac5"/>
              <rect x="9" y="1" width="6" height="6" fill="#6cbd00"/>
              <rect x="1" y="9" width="6" height="6" fill="#e86c00"/>
              <rect x="9" y="9" width="6" height="6" fill="#b0b0b0"/>
            </svg>
            ACTIVE_MODULES
          </div>
          <div className="flex items-center gap-0.5">
            <button className="xp-btn-min" aria-label="Minimize" title="Minimize"><span style={{ fontSize: "7px", lineHeight: 1 }}>─</span></button>
            <button className="xp-btn-max" aria-label="Maximize" title="Maximize"><span style={{ fontSize: "7px", lineHeight: 1 }}>□</span></button>
            <button className="xp-btn-close" aria-label="Close" title="Close"><span style={{ fontSize: "9px", fontWeight: "bold", lineHeight: 1 }}>✕</span></button>
          </div>
        </div>

        {/* Content */}
        <div className="custom-scroll overflow-y-auto pr-2 space-y-0 flex-1" style={{ background: "#f5f4ea", padding: "4px" }}>
          {/* Column header */}
          <div style={{ background: "linear-gradient(180deg, #f5f4ea 0%, #ece9d8 100%)", borderBottom: "1px solid #848484", padding: "2px 8px", display: "grid", gridTemplateColumns: "1fr auto auto", gap: "8px", fontFamily: "Tahoma, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#0a246a" }}>
            <span>Module</span>
            <span style={{ width: "80px" }}>Load</span>
            <span style={{ width: "50px", textAlign: "right" }}>Status</span>
          </div>

          {modules.map((mod, i) => (
            <div
              key={mod.name}
              style={{
                background: i % 2 === 0 ? "#f5f4ea" : "#ffffff",
                borderBottom: i < modules.length - 1 ? "1px solid #d4d0c8" : "none",
                padding: "3px 8px",
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", color: "#000000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.name}</span>
              <div style={{ width: "80px", height: "8px", background: "#c0c0c0", border: "1px inset", borderColor: "#808080", boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.3)" }}>
                <div
                  ref={(el) => { barsRef.current[i] = el; }}
                  style={{
                    height: "100%",
                    width: `${mod.base}%`,
                    background: mod.ok
                      ? "linear-gradient(180deg, #6cbd00 0%, #3c8000 100%)"
                      : "linear-gradient(180deg, #e8c000 0%, #a08000 100%)",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span style={{ fontFamily: "Tahoma, sans-serif", fontSize: "9px", color: mod.ok ? "#3a6e00" : "#806000", fontWeight: "bold", width: "50px", textAlign: "right" }}>{mod.status}</span>
            </div>
          ))}
        </div>
      </TechBorder>
    );
  }

  /* ---- Sci-fi skin — original ---- */
  return (
    <TechBorder className="p-5 flex-1 overflow-hidden flex flex-col">
      <h2 className="text-lg font-bold font-vt323 text-pink-400 mb-5 flex items-center gap-2">
        <img
          src="https://unpkg.com/pixelarticons@1.8.1/svg/grid.svg"
          className="pa-icon w-4 h-4 inline-block"
          alt=""
          aria-hidden="true"
        />
        ACTIVE_MODULES
      </h2>

      <div className="custom-scroll overflow-y-auto pr-2 space-y-3 flex-1">
        {modules.map((mod, i) => (
          <div key={mod.name} className="group cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-vt323 group-hover:text-pink-300 transition-colors">{mod.name}</span>
              <span className={`text-[10px] font-tech ${mod.ok ? "text-green-400" : "text-yellow-400"}`}>{mod.status}</span>
            </div>
            <div className="progress-bar-bg">
              <div
                ref={(el) => { barsRef.current[i] = el; }}
                className="progress-bar-fill module-bar"
                style={{ width: `${mod.base}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </TechBorder>
  );
}
