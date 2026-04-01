/**
 * [INPUT]: react useState/useEffect hooks
 * [OUTPUT]: TypeWriter — cycling quote animation with type/delete effect
 * [POS]: home/ sub-component, consumed exclusively by IdentityMatrix
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect } from "react";
import { useSkin } from "@/lib/skin";

export function TypeWriter({ sayings }: { sayings: string[] }) {
  const { skin } = useSkin();
  const [text, setText] = useState("");

  useEffect(() => {
    let idx = 0;
    let pos = 0;
    let mode: "type" | "pause" | "delete" = "type";
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const s = '"' + sayings[idx] + '"';
      if (mode === "type") {
        pos++;
        setText(s.slice(0, pos));
        if (pos >= s.length) {
          mode = "pause";
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 120);
      } else if (mode === "pause") {
        mode = "delete";
        tick();
      } else {
        pos--;
        setText(s.slice(0, pos));
        if (pos <= 0) {
          idx = (idx + 1) % sayings.length;
          mode = "type";
          pos = 0;
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, 80);
        }
      }
    }

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [sayings]);

  if (skin === "scifi") {
    return (
      <div className="mt-6 p-3 text-xs font-vt323" style={{ background: "var(--bg-surface)", color: "var(--text-value)" }}>
        <span>{text}</span>
        <span className="quote-cursor">|</span>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Lucida Console, Courier New, monospace",
        fontSize: "10px",
        color: "#0a246a",
        lineHeight: "1.4",
      }}
    >
      <span>{text}</span>
      <span className="quote-cursor" style={{ color: "#316ac5" }}>|</span>
    </div>
  );
}
