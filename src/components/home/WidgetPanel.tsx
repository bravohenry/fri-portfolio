/**
 * [INPUT]: TechBorder, Entry type, next/link
 * [OUTPUT]: WidgetPanel — XP-style switchable widget panel
 * [POS]: home/ left-column bottom panel
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TechBorder } from "@/components/ui/TechBorder";
import { CoverImage } from "@/components/content/CoverImage";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContentEntry {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  cover?: string;
}

interface WidgetPanelProps {
  dailyEntries: ContentEntry[];
  weeklyEntries: ContentEntry[];
}

type Tab = "daily" | "weekly" | "stack";

/* ------------------------------------------------------------------ */
/*  Stack data                                                         */
/* ------------------------------------------------------------------ */

const modules = [
  { name: "Next.js 16", status: "SSG", statusVar: "#3a6e00", base: 100 },
  { name: "Tailwind v4", status: "LOADED", statusVar: "#3a6e00", base: 100 },
  { name: "Markdown Pipeline", status: "ACTIVE", statusVar: "#3a6e00", base: 100 },
  { name: "Link Preview (OG)", status: "CACHED", statusVar: "#3a6e00", base: 92 },
  { name: "Geist Pixel", status: "LOADED", statusVar: "#3a6e00", base: 100 },
  { name: "Pretext", status: "READY", statusVar: "#7a5200", base: 65 },
  { name: "Vercel Deploy", status: "CONNECTED", statusVar: "#3a6e00", base: 100 },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WidgetPanel({ dailyEntries, weeklyEntries }: WidgetPanelProps) {
  const [tab, setTab] = useState<Tab>("daily");
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  /* jitter effect for stack bars */
  useEffect(() => {
    if (tab !== "stack") return;
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
  }, [tab]);

  const recent = weeklyEntries.slice(0, 5);

  return (
    <TechBorder className="flex-1 overflow-hidden flex flex-col">
      {/* XP Titlebar */}
      <div className="xp-titlebar shrink-0">
        <div className="xp-titlebar-text">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="3" width="14" height="10" fill="#c8e0f8" stroke="#7090c0" strokeWidth="0.8"/>
            <rect x="1" y="3" width="14" height="3" fill="#7090c0"/>
            <line x1="4" y1="10" x2="12" y2="10" stroke="#7090c0" strokeWidth="0.8"/>
          </svg>
          CONTENT BROWSER
        </div>
        <div className="flex items-center gap-0.5">
          <button className="xp-btn-min" aria-label="Minimize" title="Minimize">
            <span style={{ fontSize: '7px', lineHeight: 1 }}>─</span>
          </button>
          <button className="xp-btn-max" aria-label="Maximize" title="Maximize">
            <span style={{ fontSize: '7px', lineHeight: 1 }}>□</span>
          </button>
          <button className="xp-btn-close" aria-label="Close" title="Close">
            <span style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: 1 }}>✕</span>
          </button>
        </div>
      </div>

      {/* XP tab bar */}
      <div
        className="flex items-center gap-0 shrink-0"
        style={{
          background: 'linear-gradient(180deg, #f5f4ea 0%, #ece9d8 100%)',
          borderBottom: '2px solid #0a246a',
          padding: '4px 4px 0',
        }}
      >
        {(["daily", "weekly", "stack"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1 text-xs transition-colors"
            style={
              tab === t
                ? {
                    background: '#ece9d8',
                    border: '1px solid #848484',
                    borderBottom: '1px solid #ece9d8',
                    color: '#000000',
                    fontFamily: 'Tahoma, sans-serif',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '-2px',
                    zIndex: 1,
                    position: 'relative',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: '#595959',
                    fontFamily: 'Tahoma, sans-serif',
                    fontSize: '11px',
                  }
            }
          >
            {t === "daily" ? "Daily" : t === "weekly" ? "Weekly" : "Stack"}
          </button>
        ))}
        {(tab === "daily" || tab === "weekly") && (
          <Link
            href={`/${tab}`}
            className="ml-auto mr-2 text-xs transition-colors"
            style={{ color: '#0000cc', fontSize: '10px', fontFamily: 'Tahoma, sans-serif', textDecoration: 'underline' }}
          >
            View All
          </Link>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden p-2" style={{ background: '#ffffff' }}>

        {/* ---- Daily digest preview ---- */}
        {tab === "daily" && (
          <div className="custom-scroll overflow-y-auto h-full pr-1 space-y-0.5">
            {dailyEntries.slice(0, 5).map((entry, i) => (
              <Link
                key={entry.slug}
                href={`/daily/${entry.slug}`}
                className="group flex gap-2 p-2 transition-all block"
                style={{
                  background: i % 2 === 0 ? '#f5f4ea' : '#ffffff',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#dff0ff';
                  (e.currentTarget as HTMLElement).style.borderColor = '#316ac5';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#f5f4ea' : '#ffffff';
                  (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                }}
              >
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xs truncate"
                    style={{ color: '#0000cc', fontFamily: 'Tahoma, sans-serif', fontSize: '11px', textDecoration: 'underline' }}
                  >
                    {entry.title}
                  </h3>
                  <time
                    className="text-xs"
                    style={{ color: '#595959', fontFamily: 'Tahoma, sans-serif', fontSize: '10px' }}
                  >
                    {entry.date}
                  </time>
                  {entry.summary && (
                    <p
                      className="text-xs line-clamp-2 mt-0.5"
                      style={{ color: '#333333', fontFamily: 'Tahoma, sans-serif', fontSize: '10px' }}
                    >
                      {entry.summary}
                    </p>
                  )}
                </div>
              </Link>
            ))}
            {dailyEntries.length === 0 && (
              <p className="text-xs py-4 text-center" style={{ color: '#595959', fontFamily: 'Tahoma, sans-serif' }}>
                No digests yet — awaiting first dispatch.
              </p>
            )}
          </div>
        )}

        {/* ---- Weekly preview ---- */}
        {tab === "weekly" && (
          <div className="custom-scroll overflow-y-auto h-full pr-1 space-y-0.5">
            {recent.map((entry, i) => (
              <Link
                key={entry.slug}
                href={`/weekly/${entry.slug}`}
                className="group flex gap-2 p-2 transition-all block"
                style={{
                  background: i % 2 === 0 ? '#f5f4ea' : '#ffffff',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#dff0ff';
                  (e.currentTarget as HTMLElement).style.borderColor = '#316ac5';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#f5f4ea' : '#ffffff';
                  (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                }}
              >
                {entry.cover ? (
                  <div
                    className="w-14 h-10 shrink-0 overflow-hidden"
                    style={{ border: '1px solid #d4d0c8' }}
                  >
                    <CoverImage src={entry.cover} />
                  </div>
                ) : (
                  <div
                    className="w-14 h-10 shrink-0 flex items-center justify-center"
                    style={{ background: '#d4d0c8', border: '1px solid #a0a0a0' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#808080" aria-hidden="true">
                      <rect x="2" y="2" width="16" height="16" fill="none" stroke="#808080" strokeWidth="1"/>
                      <path d="M2 14 L6 10 L9 13 L13 8 L18 14Z" fill="#a0a0a0"/>
                      <circle cx="13" cy="7" r="2" fill="#a0a0a0"/>
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xs truncate"
                    style={{ color: '#0000cc', fontFamily: 'Tahoma, sans-serif', fontSize: '11px', textDecoration: 'underline' }}
                  >
                    {entry.title}
                  </h3>
                  <time
                    className="text-xs"
                    style={{ color: '#595959', fontFamily: 'Tahoma, sans-serif', fontSize: '10px' }}
                  >
                    {entry.date}
                  </time>
                  {entry.summary && (
                    <p
                      className="text-xs line-clamp-1 mt-0.5"
                      style={{ color: '#333333', fontFamily: 'Tahoma, sans-serif', fontSize: '10px' }}
                    >
                      {entry.summary}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ---- Stack / modules ---- */}
        {tab === "stack" && (
          <div className="custom-scroll overflow-y-auto h-full pr-1 space-y-3 p-1">
            {modules.map((mod, i) => (
              <div key={mod.name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px', color: '#000000' }}>
                    {mod.name}
                  </span>
                  <span style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '10px', color: mod.statusVar, fontWeight: 'bold' }}>
                    {mod.status}
                  </span>
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
        )}
      </div>

      {/* XP status bar */}
      <div
        className="shrink-0 px-2 py-1 flex items-center"
        style={{
          background: 'linear-gradient(180deg, #f5f4ea 0%, #ece9d8 100%)',
          borderTop: '1px solid #848484',
          fontSize: '10px',
          fontFamily: 'Tahoma, sans-serif',
          color: '#595959',
        }}
      >
        <div style={{ borderRight: '1px solid #d4d0c8', paddingRight: '8px', marginRight: '8px' }}>
          {tab === "daily" ? dailyEntries.length : tab === "weekly" ? weeklyEntries.length : modules.length} items
        </div>
        <span>Ready</span>
      </div>
    </TechBorder>
  );
}
