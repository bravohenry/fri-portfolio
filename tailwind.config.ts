/**
 * [INPUT]:  Tailwind CSS v4 engine (primary config lives in globals.css @theme)
 * [OUTPUT]: Type-safe theme reference for tooling + IDE
 * [POS]:    Supplementary config — v4 reads @theme from CSS, this aids DX
 * [PROTOCOL]: Update this header on any theme change, then check CLAUDE.md
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-pink": "#ec4899",
        "neon-coral": "#fb923c",
        "neon-dim": "#4d2d3d",
        "bg-dark": "#050510",
      },
      fontFamily: {
        tech: ["'Geist'", "monospace"],
        workbench: ["'Geist'", "sans-serif"],
        vt323: ["'Geist Mono'", "monospace"],
        suse: ["'Geist'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
