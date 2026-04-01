/**
 * [INPUT]: react hooks for clock
 * [OUTPUT]: XPTaskbar — Windows XP taskbar at bottom of screen
 * [POS]: home/ bottom bar — Start button, task buttons, system tray
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSkin } from "@/lib/skin";

const clockFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour12: true,
  hour: "numeric",
  minute: "2-digit",
});

export default function XPTaskbar() {
  const { skin } = useSkin();
  const [clock, setClock] = useState("");
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const tick = () => setClock(clockFmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  /* scifi skin: no taskbar */
  if (skin === "scifi") return null;

  return (
    <>
      {/* Start Menu popup */}
      {startOpen && (
        <div
          className="fixed bottom-8 left-0 z-50"
          style={{
            width: '220px',
            background: '#ece9d8',
            border: '1px solid #848484',
            boxShadow: '2px -2px 8px rgba(0,0,0,0.4)',
          }}
          onClick={() => setStartOpen(false)}
        >
          {/* User banner */}
          <div
            style={{
              background: 'linear-gradient(90deg, #2458cc 0%, #3a6ea5 100%)',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: '40px', height: '40px', background: '#ffffff', border: '1px solid #c0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              👤
            </div>
            <span style={{ fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 'bold', color: '#ffffff', fontSize: '13px' }}>
              bravohenry
            </span>
          </div>

          {/* Menu items */}
          <div style={{ display: 'flex' }}>
            {/* Left: pinned */}
            <div style={{ flex: 1, padding: '4px 0', borderRight: '1px solid #d4d0c8' }}>
              {[
                { label: "Daily", href: "/daily", icon: "📄" },
                { label: "Weekly", href: "/weekly", icon: "📅" },
                { label: "Diary", href: "/diary", icon: "📓" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-xp-accent hover:text-white transition-colors"
                  style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px', color: '#000000', textDecoration: 'none' }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
            {/* Right: system */}
            <div style={{ flex: 1, padding: '4px 0' }}>
              {[
                { label: "My Computer", icon: "💻" },
                { label: "Control Panel", icon: "⚙️" },
                { label: "Help & Support", icon: "❓" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
                  style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px', color: '#000000' }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom buttons */}
          <div
            style={{
              borderTop: '1px solid #848484',
              background: '#d4d0c8',
              padding: '4px 8px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '4px',
            }}
          >
            <button className="xp-button" style={{ fontSize: '10px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔒 Log Off
            </button>
            <button className="xp-button" style={{ fontSize: '10px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ⏻ Turn Off
            </button>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="xp-taskbar flex-none z-40">
        {/* Start button */}
        <button
          className="xp-start-btn"
          onClick={() => setStartOpen((v) => !v)}
          aria-label="Start"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
            <circle cx="5" cy="6" r="2" fill="#ff4444"/>
            <circle cx="11" cy="6" r="2" fill="#44ff44"/>
            <circle cx="5" cy="11" r="2" fill="#4444ff"/>
            <circle cx="11" cy="11" r="2" fill="#ffff44"/>
          </svg>
          start
        </button>

        {/* Quick launch separator */}
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '2px 4px', height: '20px' }} />

        {/* Task buttons */}
        <div className="flex items-center gap-1 flex-1 overflow-hidden">
          {[
            { label: "FRI Interface", active: true },
            { label: "Daily Log", active: false },
            { label: "Weekly", active: false },
          ].map((task) => (
            <button
              key={task.label}
              style={{
                background: task.active
                  ? 'linear-gradient(180deg, #1a3080 0%, #2040a0 100%)'
                  : 'linear-gradient(180deg, #3168d5 0%, #2050c0 100%)',
                border: task.active ? '1px inset #0020a0' : '1px solid #5080e0',
                boxShadow: task.active
                  ? 'inset 1px 1px 0 rgba(0,0,0,0.3)'
                  : 'inset 1px 1px 0 rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontFamily: 'Tahoma, sans-serif',
                fontSize: '10px',
                padding: '2px 8px',
                minWidth: '80px',
                maxWidth: '150px',
                whiteSpace: 'nowrap' as const,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
              }}
            >
              {task.label}
            </button>
          ))}
        </div>

        {/* System tray */}
        <div className="xp-systray">
          <span style={{ fontSize: '12px' }}>🔊</span>
          <span style={{ fontSize: '12px' }}>🌐</span>
          <div
            style={{
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              paddingLeft: '8px',
              fontFamily: 'Tahoma, sans-serif',
              fontSize: '10px',
              color: '#ffffff',
              whiteSpace: 'nowrap' as const,
              textAlign: 'right' as const,
            }}
          >
            <div>{clock}</div>
            <div style={{ fontSize: '9px', color: '#a0b8e0' }}>EST</div>
          </div>
        </div>
      </div>
    </>
  );
}
