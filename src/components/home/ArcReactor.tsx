/**
 * [INPUT]:  react hooks, diary fragments, MatrixRain, useSkin
 * [OUTPUT]: ArcReactor — skin-aware center visual: XP media player or sci-fi reactor
 * [POS]:    home/ center-column visual centerpiece
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MatrixRain } from "./MatrixRain";
import type { CircleInfo } from "./MatrixRain";
import { useSkin } from "@/lib/skin";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUSES = ["Standby", "Replying", "Thinking"] as const;
const UPTIME_ORIGIN = new Date(2026, 0, 30, 22, 0, 0);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatUptime(start: Date): string {
  const ms = Date.now() - start.getTime();
  if (ms < 0) return "0d 0h 0m 0s";
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hour = Math.floor(ms / 3600000) % 24;
  const day = Math.floor(ms / 86400000);
  return `${day}d ${hour}h ${min}m ${sec}s`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ArcReactor({ fragments = [] }: { fragments?: string[] }) {
  const { skin } = useSkin();
  const [status, setStatus] = useState<string>("");
  const [uptime, setUptime] = useState<string>("--");
  const [circle, setCircle] = useState<CircleInfo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setStatus(pickRandom(STATUSES));
    const tick = () => setUptime(formatUptime(UPTIME_ORIGIN));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const measureCircle = useCallback(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    const cRect = container.getBoundingClientRect();
    const vRect = video.getBoundingClientRect();
    setCircle({
      cx: vRect.left - cRect.left + vRect.width / 2,
      cy: vRect.top - cRect.top + vRect.height / 2,
      r: vRect.width / 2,
    });
  }, []);

  useEffect(() => {
    measureCircle();
    window.addEventListener("resize", measureCircle);
    const timer = setTimeout(measureCircle, 500);
    return () => {
      window.removeEventListener("resize", measureCircle);
      clearTimeout(timer);
    };
  }, [measureCircle]);

  /* ---- XP skin ---- */
  if (skin === "xp") {
    return (
      <div
        className="flex-1 relative flex flex-col min-h-0"
        style={{ background: "#000020", border: "1px solid #848484", boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.1)" }}
      >
        {/* XP titlebar */}
        <div className="xp-titlebar shrink-0">
          <div className="xp-titlebar-text">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="none" stroke="#7090c0" strokeWidth="1"/>
              <circle cx="8" cy="8" r="4" fill="#c8e0f8" stroke="#316ac5" strokeWidth="0.8"/>
              <circle cx="8" cy="8" r="1.5" fill="#316ac5"/>
            </svg>
            FRI CORE — MEDIA PLAYER
          </div>
          <div className="flex items-center gap-4 mr-2" style={{ fontSize: "10px", fontFamily: "Tahoma, sans-serif", color: "rgba(255,255,255,0.8)" }}>
            <span>Status: {status || "FRI CORE"}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="xp-btn-min" aria-label="Minimize" title="Minimize"><span style={{ fontSize: "7px", lineHeight: 1 }}>─</span></button>
            <button className="xp-btn-max" aria-label="Maximize" title="Maximize"><span style={{ fontSize: "7px", lineHeight: 1 }}>□</span></button>
            <button className="xp-btn-close" aria-label="Close" title="Close"><span style={{ fontSize: "9px", fontWeight: "bold", lineHeight: 1 }}>✕</span></button>
          </div>
        </div>

        {/* Main display */}
        <div ref={containerRef} className="flex-1 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-px h-full" style={{ background: "linear-gradient(to bottom, transparent, rgba(49,104,213,0.2), transparent)" }} />
            <div className="absolute top-1/2 left-0 w-full h-px" style={{ background: "linear-gradient(to right, transparent, rgba(49,104,213,0.2), transparent)" }} />
          </div>

          {fragments.length > 0 && <MatrixRain fragments={fragments} circle={circle} />}

          <div className="arc-reactor relative z-10">
            <div className="arc-ring arc-ring-3" />
            <div className="arc-ring arc-ring-4" />
            <div className="arc-ring arc-ring-5" />
            <video
              ref={videoRef}
              src="/core.mp4"
              autoPlay loop muted playsInline
              className="arc-video w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover"
              style={{ border: "2px solid #316ac5", boxShadow: "0 0 20px rgba(49,104,213,0.5), 0 0 40px rgba(49,104,213,0.2)" }}
            />
            <div className="absolute -bottom-10 md:-bottom-12 text-center">
              <div className="neon-shimmer" style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", letterSpacing: "0.15em" }}>
                {status || "FRI CORE"}
              </div>
            </div>
          </div>

          {/* Uptime — XP properties panel style */}
          <div className="absolute top-2 right-2 z-10 p-2" style={{ background: "rgba(0, 0, 60, 0.85)", border: "1px solid #316ac5", fontFamily: "Lucida Console, Courier New, monospace" }}>
            <div style={{ fontSize: "9px", color: "#6090d0", marginBottom: "2px", textTransform: "uppercase" }}>Cumulative runtime</div>
            <div style={{ fontSize: "12px", color: "#80c0ff", fontWeight: "bold" }}>{uptime}</div>
          </div>
        </div>

        {/* XP media player controls bar */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5" style={{ background: "linear-gradient(180deg, #1a1a3a 0%, #0a0a20 100%)", borderTop: "1px solid #316ac5" }}>
          <div className="flex gap-1">
            {["⏮", "⏪", "▶", "⏩", "⏭"].map((btn, i) => (
              <button key={i} className="xp-button" style={{ minWidth: "auto", padding: "1px 6px", fontSize: "10px", background: "linear-gradient(180deg, #2a2a5a 0%, #1a1a3a 100%)", borderColor: "#316ac5", color: "#80c0ff" }} aria-label={`Media control ${btn}`}>{btn}</button>
            ))}
          </div>
          <div className="flex-1 h-3 mx-2" style={{ background: "#000010", border: "1px inset", borderColor: "#316ac5", boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.5)" }}>
            <div style={{ height: "100%", width: "35%", background: "linear-gradient(90deg, #1040a0, #3168d5)" }} />
          </div>
          <span style={{ fontFamily: "Lucida Console, monospace", fontSize: "9px", color: "#6090d0" }}>LIVE FEED</span>
        </div>
      </div>
    );
  }

  /* ---- Sci-fi skin — original ---- */
  return (
    <div ref={containerRef} className="flex-1 relative flex items-center justify-center">
      {/* crosshair grid */}
      <div className="absolute inset-0 border pointer-events-none" style={{ borderColor: "var(--border-crosshair)" }}>
        <div className="absolute top-0 left-1/2 w-px h-full" style={{ background: "linear-gradient(to bottom, transparent, var(--crosshair-via), transparent)" }} />
        <div className="absolute top-1/2 left-0 w-full h-px" style={{ background: "linear-gradient(to right, transparent, var(--crosshair-via), transparent)" }} />
      </div>

      {fragments.length > 0 && <MatrixRain fragments={fragments} circle={circle} />}

      <div className="arc-reactor relative z-10">
        <div className="arc-ring arc-ring-3" />
        <div className="arc-ring arc-ring-4" />
        <div className="arc-ring arc-ring-5" />
        <video
          ref={videoRef}
          src="/core.mp4"
          autoPlay loop muted playsInline
          className="arc-video w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover border-2"
          style={{ borderColor: "var(--border-video)" }}
        />
        <div className="absolute -bottom-10 md:-bottom-12 text-center">
          <div className="text-[10px] md:text-xs font-tech tracking-widest neon-shimmer">
            {status || "FRI CORE"}
          </div>
        </div>
      </div>

      {/* uptime */}
      <div className="absolute top-4 right-4 md:top-10 md:right-10 text-right z-10">
        <div className="text-[10px] font-tech mb-1" style={{ color: "var(--text-accent)" }}>Cumulative runtime</div>
        <div className="text-sm font-vt323" style={{ color: "var(--text-value)" }}>{uptime}</div>
      </div>
    </div>
  );
}
