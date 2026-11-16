"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "auto" | "dark" | "light";
const STATES: Theme[] = ["auto", "dark", "light"];
const KEY = "trc.theme";
const EVENT = "trc-theme-change";

/* The saved theme lives in localStorage; useSyncExternalStore reads it
   without a setState-in-effect, and renders "auto" on the server so the
   static HTML and the first client render agree. */

function readTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(KEY) as Theme | null;
    return saved && STATES.includes(saved) ? saved : "auto";
  } catch {
    return "auto"; // storage disabled
  }
}

function writeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // storage disabled — the choice still applies for this page view
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "auto" as Theme);

  useEffect(() => {
    if (theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const label = "Theme · " + theme[0].toUpperCase() + theme.slice(1);

  return (
    <button
      type="button"
      onClick={() => writeTheme(STATES[(STATES.indexOf(theme) + 1) % STATES.length])}
      aria-label="Toggle colour theme"
      className="border border-[var(--line-2)] bg-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
    >
      {label}
    </button>
  );
}
