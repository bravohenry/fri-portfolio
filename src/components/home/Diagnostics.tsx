/**
 * [INPUT]: @/components/ui/TechBorder, useSkin, props from page.tsx
 * [OUTPUT]: Diagnostics — skin-aware panel: XP style or original sci-fi
 * [POS]: home/ top-level section, renders in the 3-col grid right column
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState } from "react";
import { TechBorder } from "@/components/ui/TechBorder";
import { useSkin } from "@/lib/skin";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface DiagnosticsProps {
  thisWeekCount: number;
  thisMonthCount: number;
  dailyActivity: { date: string; count: number }[];
  diaryCount: number;
  weeklyCount: number;
  cachedUrls: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Diagnostics({
  thisWeekCount,
  thisMonthCount,
  dailyActivity,
  diaryCount,
  weeklyCount,
  cachedUrls,
}: DiagnosticsProps) {
  const { skin } = useSkin();
  const [hovered, setHovered] = useState<number | null>(null);

  const services = [
    { name: "DIARY", status: `${diaryCount} entries`, ok: true },
    { name: "WEEKLY", status: `${weeklyCount} entries`, ok: true },
    { name: "LINK_PREVIEW", status: `CACHED (${cachedUrls})`, ok: true },
    { name: "DEPLOY", status: "VERCEL", ok: true },
  ];

  const hoveredDay = hovered !== null ? dailyActivity[hovered] : null;

  /* ---- XP skin ---- */
  if (skin === "xp") {
    return (
      <TechBorder>
        {/* XP Titlebar */}
        <div className="xp-titlebar">
          <div className="xp-titlebar-text">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="8" width="3" height="6" fill="#6cbd00"/>
              <rect x="5" y="5" width="3" height="9" fill="#316ac5"/>
              <rect x="9" y="2" width="3" height="12" fill="#0a246a"/>
              <rect x="13" y="4" width="3" height="10" fill="#7a5200"/>
            </svg>
            DIAGNOSTICS
          </div>
          <div className="flex items-center gap-0.5">
            <button className="xp-btn-min" aria-label="Minimize" title="Minimize">
              <span style={{ fontSize: "7px", lineHeight: 1 }}>─</span>
            </button>
            <button className="xp-btn-max" aria-label="Maximize" title="Maximize">
              <span style={{ fontSize: "7px", lineHeight: 1 }}>□</span>
            </button>
            <button className="xp-btn-close" aria-label="Close" title="Close">
              <span style={{ fontSize: "9px", fontWeight: "bold", lineHeight: 1 }}>✕</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Stat boxes — XP groupbox style */}
          <div
            className="mb-4 p-3 pt-4"
            style={{
              border: "1px solid #848484",
              boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.8)",
              background: "#f5f4ea",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-8px",
                left: "8px",
                background: "#f5f4ea",
                padding: "0 4px",
                fontFamily: "Tahoma, sans-serif",
                fontSize: "10px",
                color: "#0a246a",
                fontWeight: "bold",
              }}
            >
              Publishing Stats
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2" style={{ background: "#ffffff", border: "1px inset", borderColor: "#d4d0c8", boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff" }}>
                <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: "9px", color: "#595959", marginBottom: "4px", textTransform: "uppercase" }}>This Week</div>
                <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: "22px", fontWeight: "bold", color: "#0a246a" }}>{thisWeekCount}</div>
              </div>
              <div className="text-center p-2" style={{ background: "#ffffff", border: "1px inset", borderColor: "#d4d0c8", boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff" }}>
                <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: "9px", color: "#595959", marginBottom: "4px", textTransform: "uppercase" }}>This Month</div>
                <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: "22px", fontWeight: "bold", color: "#0a246a" }}>{thisMonthCount}</div>
              </div>
            </div>
          </div>

          {/* Bar chart — CMD-style */}
          <div className="relative mb-4" style={{ border: "1px solid #848484", boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.2)", background: "#000000" }}>
            <div style={{ background: "#000080", borderBottom: "1px solid #000060", padding: "2px 4px", fontFamily: "Tahoma, sans-serif", fontSize: "9px", color: "#c0c0c0" }}>
              {hoveredDay ? `${formatDate(hoveredDay.date)} · ${hoveredDay.count} ${hoveredDay.count === 1 ? "entry" : "entries"}` : "PUBLISHING FREQUENCY"}
            </div>
            <div className="flex items-end gap-[2px] p-1" style={{ height: "80px" }} onMouseLeave={() => setHovered(null)}>
              {dailyActivity.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 transition-opacity duration-100 cursor-crosshair"
                  style={{
                    height: `${day.count > 0 ? Math.max(20, day.count * 33) : 8}%`,
                    minWidth: "3px",
                    background: hovered === i ? "#5ca0ff" : hovered !== null ? (day.count > 0 ? "#2060c0" : "#103060") : day.count > 0 ? "#3168d5" : "#102040",
                  }}
                  onMouseEnter={() => setHovered(i)}
                />
              ))}
            </div>
          </div>

          {/* Service status — XP list view */}
          <div style={{ border: "1px solid #848484", boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.1)", background: "#ffffff" }}>
            <div style={{ background: "linear-gradient(180deg, #f5f4ea 0%, #ece9d8 100%)", borderBottom: "1px solid #848484", padding: "2px 6px", fontFamily: "Tahoma, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#0a246a", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <span>Service</span>
              <span>Status</span>
            </div>
            {services.map((svc, i) => (
              <div key={svc.name} style={{ background: i % 2 === 0 ? "#f5f4ea" : "#ffffff", padding: "3px 6px", borderBottom: i < services.length - 1 ? "1px solid #d4d0c8" : "none", fontFamily: "Tahoma, sans-serif", fontSize: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
                <span style={{ color: "#000000" }}>{svc.name}</span>
                <span style={{ color: svc.ok ? "#3a6e00" : "#cc0000", fontWeight: "bold" }}>{svc.status}</span>
              </div>
            ))}
          </div>
        </div>
      </TechBorder>
    );
  }

  /* ---- Sci-fi skin — original ---- */
  return (
    <TechBorder className="p-6 md:p-5">
      <h2
        className="text-xs font-vt323 mb-4 flex items-center gap-2 tracking-widest"
        style={{ color: "var(--text-panel-title)" }}
      >
        <img
          src="https://unpkg.com/pixelarticons@1.8.1/svg/chart.svg"
          className="pa-icon w-4 h-4 inline-block"
          alt=""
          aria-hidden="true"
        />
        DIAGNOSTICS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="p-4 text-center" style={{ background: "var(--bg-surface)" }}>
          <div className="text-[10px] uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>This Week</div>
          <div className="text-xl font-bold font-vt323" style={{ color: "var(--text-value)" }}>{thisWeekCount}</div>
        </div>
        <div className="p-4 text-center" style={{ background: "var(--bg-surface)" }}>
          <div className="text-[10px] uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>This Month</div>
          <div className="text-xl font-bold font-vt323" style={{ color: "var(--text-value)" }}>{thisMonthCount}</div>
        </div>
      </div>

      <div
        className="relative h-24 overflow-hidden flex items-end gap-[2px] p-[1px] mb-5"
        style={{ background: "var(--bg-bar-area)" }}
        onMouseLeave={() => setHovered(null)}
      >
        {hoveredDay && (
          <div className="absolute top-1 left-1 text-[9px] font-tech z-10" style={{ color: "var(--bar-label)" }}>
            {formatDate(hoveredDay.date)} · {hoveredDay.count} {hoveredDay.count === 1 ? "entry" : "entries"}
          </div>
        )}
        {dailyActivity.map((day, i) => (
          <div
            key={i}
            className="flex-1 transition-opacity duration-100 cursor-crosshair network-bar"
            style={{
              height: `${day.count > 0 ? Math.max(20, day.count * 33) : 8}%`,
              minWidth: "3px",
              background: hovered === i ? "var(--bar-hovered)" : hovered !== null ? (day.count > 0 ? "var(--bar-dimmed)" : "var(--bar-dimmed-inactive)") : day.count > 0 ? "var(--bar-active)" : "var(--bar-inactive)",
            }}
            onMouseEnter={() => setHovered(i)}
          />
        ))}
      </div>

      <div className="space-y-1.5">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="flex justify-between items-center text-[11px] p-2 border"
            style={{ background: "var(--bg-hover-row)", borderColor: "var(--border-hover-row)" }}
          >
            <span className="font-tech" style={{ color: "var(--text-muted)" }}>{svc.name}</span>
            <span className="font-vt323 text-xs" style={{ color: "var(--text-status)" }}>{svc.status}</span>
          </div>
        ))}
      </div>
    </TechBorder>
  );
}
