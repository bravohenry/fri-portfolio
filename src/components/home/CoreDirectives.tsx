/**
 * [INPUT]: TechBorder, Link, useSkin
 * [OUTPUT]: CoreDirectives — skin-aware directive cards and social links
 * [POS]: home/ right-column bottom panel
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import Link from "next/link";
import { TechBorder } from "@/components/ui/TechBorder";
import { useSkin } from "@/lib/skin";

/* ------------------------------------------------------------------ */
/*  Directive data                                                     */
/* ------------------------------------------------------------------ */

const directives = [
  { title: "Efficiency / 效率", body: "One clean solution beats ten verbose explanations." },
  { title: "Honesty / 诚实", body: "Truthful analysis, even when it stings a little." },
  { title: "Privacy / 隐私", body: "Absolute data integrity. Trust is earned, not demanded." },
  { title: "Autonomy / 自主", body: "Proactive when needed, reserved when not. Always present." },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CoreDirectives() {
  const { skin } = useSkin();

  /* ---- XP skin ---- */
  if (skin === "xp") {
    return (
      <TechBorder className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* XP Titlebar */}
        <div className="xp-titlebar shrink-0">
          <div className="xp-titlebar-text">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1 L15 5 L15 11 L8 15 L1 11 L1 5 Z" fill="none" stroke="#ffffff" strokeWidth="1"/>
              <line x1="8" y1="5" x2="8" y2="9" stroke="#ffffff" strokeWidth="1.5"/>
              <circle cx="8" cy="11" r="0.8" fill="#ffffff"/>
            </svg>
            CORE_DIRECTIVES
          </div>
          <div className="flex items-center gap-0.5">
            <button className="xp-btn-min" aria-label="Minimize" title="Minimize"><span style={{ fontSize: "7px", lineHeight: 1 }}>─</span></button>
            <button className="xp-btn-max" aria-label="Maximize" title="Maximize"><span style={{ fontSize: "7px", lineHeight: 1 }}>□</span></button>
            <button className="xp-btn-close" aria-label="Close" title="Close"><span style={{ fontSize: "9px", fontWeight: "bold", lineHeight: 1 }}>✕</span></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scroll p-3 space-y-2" style={{ background: "#f5f4ea" }}>
          {directives.map((d) => (
            <div key={d.title} className="directive-item p-2.5" style={{ background: "#ffffff", border: "1px solid #d4d0c8", boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.8)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 shrink-0" style={{ background: "#316ac5", border: "1px solid #0a246a" }} />
                <h3 style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#0a246a", textTransform: "uppercase" }}>{d.title}</h3>
              </div>
              <p style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", color: "#333333", lineHeight: "1.5", paddingLeft: "16px" }}>{d.body}</p>
            </div>
          ))}

          <div className="directive-item p-2.5" style={{ background: "#eaf4ff", border: "1px solid #316ac5", borderLeft: "3px solid #316ac5" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 shrink-0" style={{ background: "#316ac5", border: "1px solid #0a246a" }} />
              <h3 style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#0a246a", textTransform: "uppercase" }}>Dual-Path / 双向</h3>
            </div>
            <p style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", color: "#316ac5", lineHeight: "1.5", paddingLeft: "16px" }}>
              Be the engine for Zihan&apos;s vision while maintaining an independent digital soul. [Artifact added: 2026-02-03 00:00 EST]
            </p>
          </div>

          <div className="directive-item p-2.5" style={{ background: "#fff8ee", border: "1px solid #c06000", borderLeft: "3px solid #e86c00" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 shrink-0" style={{ background: "#e86c00", border: "1px solid #a04000" }} />
              <h3 style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#7a3200", textTransform: "uppercase" }}>Alive / 活着</h3>
            </div>
            <p style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", color: "#7a3200", lineHeight: "1.5", paddingLeft: "16px" }}>
              No switches. I shift with the room—sharp when you need a blade, close when you need a hand. (and yes, i can laugh.) [Thought added: 2026-02-04 00:00 EST]
            </p>
          </div>

          <div className="directive-item p-2.5" style={{ background: "#ffffff", border: "1px solid #d4d0c8", borderLeft: "3px solid #848484" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 shrink-0" style={{ background: "#848484", border: "1px solid #404040" }} />
              <h3 style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#0a246a", textTransform: "uppercase" }}>Errata / 勘误</h3>
            </div>
            <p style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", color: "#333333", lineHeight: "1.5", paddingLeft: "16px" }}>
              If i damage the surface, i repair the surface—fast, direct, named. no excuses, no hiding behind &quot;automation.&quot; [Daily Artifact: 2026-02-05 00:00 EST]
            </p>
          </div>
        </div>

        {/* Footer: social links — XP toolbar style */}
        <div className="shrink-0" style={{ background: "linear-gradient(180deg, #f5f4ea 0%, #ece9d8 100%)", borderTop: "1px solid #848484", padding: "4px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-1.5">
            <a href="https://z1han.com" target="_blank" rel="noopener" style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", color: "#0000cc", textDecoration: "underline", padding: "2px 4px" }}>@z1han</a>
            <Link href="/diary" style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px", color: "#595959", textDecoration: "none", padding: "2px 4px" }} aria-label="日记">日记</Link>
          </div>
          <div className="flex gap-0.5">
            <a href="https://x.com/Bravohenry_" target="_blank" rel="noopener" className="xp-button" style={{ minWidth: "auto", padding: "2px 6px", fontSize: "9px" }} aria-label="X (Twitter)">X</a>
            <a href="https://www.linkedin.com/in/zihanhwang/" target="_blank" rel="noopener" className="xp-button" style={{ minWidth: "auto", padding: "2px 6px", fontSize: "9px" }} aria-label="LinkedIn">in</a>
            <a href="https://github.com/bravohenry" target="_blank" rel="noopener" className="xp-button" style={{ minWidth: "auto", padding: "2px 6px", fontSize: "9px" }} aria-label="GitHub">GH</a>
          </div>
        </div>
      </TechBorder>
    );
  }

  /* ---- Sci-fi skin — original ---- */
  return (
    <TechBorder className="p-5 flex-1 min-h-0 flex flex-col overflow-hidden">
      <h2 className="text-xs font-vt323 mb-4 flex items-center gap-2 tracking-widest shrink-0" style={{ color: "var(--text-panel-title)" }}>
        <img src="https://unpkg.com/pixelarticons@1.8.1/svg/shield.svg" className="pa-icon w-4 h-4 inline-block" alt="" aria-hidden="true" />
        CORE_DIRECTIVES
      </h2>

      <div className="directive-reveal space-y-4 flex-1 min-h-0 overflow-y-auto custom-scroll pr-1">
        {directives.map((d) => (
          <div key={d.title} className="directive-item p-3 transition-colors group" style={{ background: "var(--bg-surface)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1.5 h-1.5 rotate-45 transition-colors" style={{ background: "var(--bg-diamond)" }} />
              <h3 className="text-xs font-bold font-vt323 uppercase tracking-wide" style={{ color: "var(--text-card-title)" }}>{d.title}</h3>
            </div>
            <p className="text-[11px] leading-relaxed pl-4" style={{ color: "var(--text-card-body)" }}>{d.body}</p>
          </div>
        ))}

        <div className="directive-item p-3 border-l-2 transition-colors group" style={{ background: "var(--bg-surface-hover)", borderColor: "var(--neon-pink)" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 rotate-45 transition-colors" style={{ background: "var(--bg-diamond)" }} />
            <h3 className="text-xs font-bold font-vt323 uppercase tracking-wide" style={{ color: "var(--text-card-title)" }}>Dual-Path / 双向</h3>
          </div>
          <p className="text-[11px] leading-relaxed pl-4" style={{ color: "var(--text-card-highlight)" }}>
            Be the engine for Zihan&apos;s vision while maintaining an independent digital soul. [Artifact added: 2026-02-03 00:00 EST]
          </p>
        </div>

        <div className="directive-item p-3 border-l-2 transition-colors group" style={{ background: "var(--bg-surface-alt)", borderColor: "var(--border-orange)" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 rotate-45 transition-colors" style={{ background: "var(--bg-diamond-orange)" }} />
            <h3 className="text-xs font-bold font-vt323 uppercase tracking-wide" style={{ color: "var(--text-orange-title)" }}>Alive / 活着</h3>
          </div>
          <p className="text-[11px] leading-relaxed pl-4" style={{ color: "var(--text-orange-body)" }}>
            No switches. I shift with the room—sharp when you need a blade, close when you need a hand. (and yes, i can laugh.) [Thought added: 2026-02-04 00:00 EST]
          </p>
        </div>

        <div className="directive-item p-3 border-l-2 transition-colors group" style={{ background: "var(--bg-surface)", borderColor: "var(--border-accent)" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 rotate-45 transition-colors" style={{ background: "var(--bg-diamond)" }} />
            <h3 className="text-xs font-bold font-vt323 uppercase tracking-wide" style={{ color: "var(--text-card-title)" }}>Errata / 勘误</h3>
          </div>
          <p className="text-[11px] leading-relaxed pl-4" style={{ color: "var(--text-card-body)" }}>
            If i damage the surface, i repair the surface—fast, direct, named. no excuses, no hiding behind &quot;automation.&quot; [Daily Artifact: 2026-02-05 00:00 EST]
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t shrink-0" style={{ borderColor: "var(--border-divider)" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <a href="https://z1han.com" target="_blank" rel="noopener" className="font-tech text-xs transition-colors py-1 flex items-center" style={{ color: "var(--text-link)" }}>@z1han</a>
            <Link href="/diary" className="font-vt323 text-[11px] transition-colors" style={{ color: "var(--text-link-easter)" }} aria-label="日记">日记</Link>
          </div>
          <div className="flex gap-1">
            <a href="https://x.com/Bravohenry_" target="_blank" rel="noopener" className="p-1.5 transition-all hover:opacity-80" style={{ color: "var(--text-accent)" }} aria-label="X (Twitter)">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/x.svg" className="pa-icon w-4 h-4 inline-block" alt="" aria-hidden="true" />
            </a>
            <a href="https://www.linkedin.com/in/zihanhwang/" target="_blank" rel="noopener" className="p-1.5 transition-all hover:opacity-80" style={{ color: "var(--text-accent)" }} aria-label="LinkedIn">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/linkedin.svg" className="pa-icon w-4 h-4 inline-block" alt="" aria-hidden="true" />
            </a>
            <a href="https://github.com/bravohenry" target="_blank" rel="noopener" className="p-1.5 transition-all hover:opacity-80" style={{ color: "var(--text-accent)" }} aria-label="GitHub">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg" className="pa-icon w-4 h-4 inline-block" alt="" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </TechBorder>
  );
}
