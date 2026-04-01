/**
 * [INPUT]: useSkin context hook
 * [OUTPUT]: ThemeToggle — skin switcher button (XP ↔ Sci-Fi)
 * [POS]: ui/ shared primitive, placed in SystemHeader
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useSkin } from "@/lib/skin";

export function ThemeToggle() {
  const { skin, toggle } = useSkin();

  if (skin === "xp") {
    return (
      <button
        type="button"
        onClick={toggle}
        className="xp-btn-min"
        style={{ width: "21px", height: "21px", fontSize: "9px", fontWeight: "bold" }}
        aria-label="Switch to Sci-Fi skin"
        title="Switch to Sci-Fi skin"
      >
        ✦
      </button>
    );
  }

  /* sci-fi skin — render a minimal neon button */
  return (
    <button
      type="button"
      onClick={toggle}
      className="p-1.5 transition-colors hover:opacity-80"
      style={{
        background: "transparent",
        border: "1px solid var(--border-accent)",
        color: "var(--text-accent)",
        fontFamily: "monospace",
        fontSize: "9px",
        cursor: "pointer",
        lineHeight: 1,
        padding: "3px 5px",
      }}
      aria-label="Switch to XP skin"
      title="Switch to Windows XP skin"
    >
      XP
    </button>
  );
}
