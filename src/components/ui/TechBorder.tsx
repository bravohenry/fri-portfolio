/**
 * [INPUT]: react ReactNode type
 * [OUTPUT]: TechBorder — skin-aware panel wrapper:
 *   xp skin → xp-window chrome
 *   scifi skin → glass-panel with neon corner accents
 * [POS]: ui/ shared primitive, extends panel styling with skin-appropriate chrome
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

import { ReactNode } from "react";

export function TechBorder({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-panel tech-border relative ${className}`}>
      <div className="corner-bl absolute bottom-0 left-0 w-3 h-3" />
      <div className="corner-br absolute bottom-0 right-0 w-3 h-3" />
      {children}
    </div>
  );
}
