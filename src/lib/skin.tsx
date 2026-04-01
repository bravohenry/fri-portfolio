/**
 * [INPUT]: react context, localStorage
 * [OUTPUT]: SkinContext — "xp" | "scifi" skin switcher, persisted in localStorage
 * [POS]: lib/ shared primitive — wraps the whole app so all components can read skin
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type Skin = "xp" | "scifi";

interface SkinContextValue {
  skin: Skin;
  toggle: () => void;
}

const SkinContext = createContext<SkinContextValue>({
  skin: "xp",
  toggle: () => {},
});

export function SkinProvider({ children }: { children: ReactNode }) {
  const [skin, setSkin] = useState<Skin>("xp");

  useEffect(() => {
    const saved = localStorage.getItem("fri-skin") as Skin | null;
    const initial: Skin = saved === "scifi" ? "scifi" : "xp";
    setSkin(initial);
    document.documentElement.setAttribute("data-skin", initial);
  }, []);

  const toggle = useCallback(() => {
    setSkin((prev) => {
      const next: Skin = prev === "xp" ? "scifi" : "xp";
      document.documentElement.setAttribute("data-skin", next);
      localStorage.setItem("fri-skin", next);
      return next;
    });
  }, []);

  return (
    <SkinContext.Provider value={{ skin, toggle }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  return useContext(SkinContext);
}
