/**
 * [INPUT]: @/components/ui/TechBorder, ./TypeWriter
 * [OUTPUT]: IdentityMatrix — identity panel with key-value pairs and cycling quotes
 * [POS]: home/ top-left panel, displays FRI designation/specs, anchors personality
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { TechBorder } from "@/components/ui/TechBorder";
import { TypeWriter } from "./TypeWriter";

/* ── static data ─────────────────────────────────────────────── */

const specs: [string, string][] = [
  ["Designation", "fri"],
  ["Voice Model", "Bella [ElevenLabs]"],
  ["Brain", "Minimax-M2.7"],
  ["Memory", "OrbitOS"],
  ["Version", "v3.28"],
];

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

export function IdentityMatrix() {
  return (
    <TechBorder className="p-5">
      <h2 className="text-lg font-bold font-vt323 text-pink-400 mb-5 flex items-center gap-2">
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
              i < specs.length - 1
                ? " border-b border-pink-500/25 pb-3 pt-0.5"
                : " pb-3 pt-0.5"
            }`}
          >
            <span className="text-gray-400">{label}</span>
            <span className="font-bold font-vt323 text-pink-300">{value}</span>
          </div>
        ))}
      </div>

      <TypeWriter sayings={sayings} />
    </TechBorder>
  );
}
