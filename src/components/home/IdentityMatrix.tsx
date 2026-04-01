/**
 * [INPUT]: @/components/ui/TechBorder, ./TypeWriter, useSkin
 * [OUTPUT]: IdentityMatrix — skin-aware identity panel with key-value pairs and cycling quotes
 * [POS]: home/ top-left panel, displays FRI designation/specs, anchors personality
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { TechBorder } from "@/components/ui/TechBorder";
import { TypeWriter } from "./TypeWriter";
import { useSkin } from "@/lib/skin";

/* ── props ───────────────────────────────────────────────────── */

interface IdentityMatrixProps {
  diaryCount: number;
  weeklyCount: number;
  lastEntryAge: string;
}

/* ── static data ─────────────────────────────────────────────── */

const sayings = [
  "まず動かせ。それから速くしろ。",
  "能自动化的，就别动手。",
  "问就行。答不答得上来另说。",
  "少ないほど多い。コードも然り。",
  "Talk is cheap. Show me the code.",
  "必要な時は、ここにいる。",
  "不写注释的代码，是写给三个月后的自己的谜语。",
  "Bug 不会消失，只会转移。",
];

/* ── component ───────────────────────────────────────────────── */

export function IdentityMatrix({ diaryCount, weeklyCount, lastEntryAge }: IdentityMatrixProps) {
  const { skin } = useSkin();

  const specs: [string, string][] = [
    ["Designation", "fri"],
    ["Brain", "Minimax-M2.7"],
    ["Entries", `${diaryCount} diary · ${weeklyCount} weekly`],
    ["Last Post", lastEntryAge],
    ["Version", "v3.28"],
  ];

  /* ---- XP skin ---- */
  if (skin === "xp") {
    return (
      <TechBorder>
        {/* XP Titlebar */}
        <div className="xp-titlebar">
          <div className="xp-titlebar-text">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="1" width="12" height="14" rx="0" fill="#c8e0f8" stroke="#7090c0" strokeWidth="0.8"/>
              <line x1="4" y1="5" x2="12" y2="5" stroke="#7090c0" strokeWidth="0.8"/>
              <line x1="4" y1="7" x2="12" y2="7" stroke="#7090c0" strokeWidth="0.8"/>
              <line x1="4" y1="9" x2="12" y2="9" stroke="#7090c0" strokeWidth="0.8"/>
              <line x1="4" y1="11" x2="9" y2="11" stroke="#7090c0" strokeWidth="0.8"/>
            </svg>
            IDENTITY_MATRIX
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
          <div className="space-y-0">
            {specs.map(([label, value], i) => (
              <div
                key={label}
                className="flex justify-between items-center py-1.5 px-2 text-xs"
                style={{
                  background: i % 2 === 0 ? "#f5f4ea" : "#ece9d8",
                  borderBottom: i < specs.length - 1 ? "1px solid #d4d0c8" : "none",
                }}
              >
                <span style={{ color: "#595959", fontFamily: "Tahoma, sans-serif", fontSize: "11px" }}>{label}</span>
                <span style={{ color: "#0a246a", fontFamily: "Tahoma, sans-serif", fontSize: "11px", fontWeight: "bold" }}>{value}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-3 p-2"
            style={{
              background: "#ece9d8",
              border: "1px inset",
              borderColor: "#d4d0c8",
              boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff",
              fontSize: "10px",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            <TypeWriter sayings={sayings} />
          </div>
        </div>
      </TechBorder>
    );
  }

  /* ---- Sci-fi skin — original ---- */
  return (
    <TechBorder className="p-5">
      <h2
        className="text-xs font-vt323 mb-4 flex items-center gap-2 tracking-widest"
        style={{ color: "var(--text-panel-title)" }}
      >
        <img
          src="https://unpkg.com/pixelarticons@1.8.1/svg/server.svg"
          className="pa-icon w-4 h-4 inline-block"
          alt=""
          aria-hidden="true"
        />
        IDENTITY_MATRIX
      </h2>

      <div className="space-y-4">
        {specs.map(([label, value], i) => (
          <div
            key={label}
            className={`flex justify-between items-center text-sm${
              i < specs.length - 1 ? " border-b pb-3 pt-0.5" : " pb-3 pt-0.5"
            }`}
            style={i < specs.length - 1 ? { borderColor: "var(--border-divider)" } : undefined}
          >
            <span style={{ color: "var(--text-muted)" }}>{label}</span>
            <span className="font-bold font-vt323" style={{ color: "var(--text-value)" }}>{value}</span>
          </div>
        ))}
      </div>

      <TypeWriter sayings={sayings} />
    </TechBorder>
  );
}
