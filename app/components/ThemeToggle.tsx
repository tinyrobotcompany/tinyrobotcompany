"use client";

import { useEffect, useState } from "react";

type Theme = "auto" | "dark" | "light";
const STATES: Theme[] = ["auto", "dark", "light"];
const KEY = "trc.theme";

export function ThemeToggle() {
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY) as Theme | null;
      if (saved && STATES.includes(saved)) setI(STATES.indexOf(saved));
    } catch {
      // storage disabled — fall through to default "auto"
    }
  }, []);

  useEffect(() => {
    const s = STATES[i];
    if (s === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", s);
    try {
      window.localStorage.setItem(KEY, s);
    } catch {
      // storage disabled — nothing to persist
    }
  }, [i]);

  const label = "Theme · " + STATES[i][0].toUpperCase() + STATES[i].slice(1);

  return (
    <button
      type="button"
      onClick={() => setI((n) => (n + 1) % STATES.length)}
      aria-label="Toggle colour theme"
      className="border border-[var(--line-2)] bg-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
    >
      {label}
    </button>
  );
}
