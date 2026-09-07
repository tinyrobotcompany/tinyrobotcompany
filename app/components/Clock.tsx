"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");
const format = (d: Date) =>
  `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;

export function Clock() {
  const [time, setTime] = useState<string>("--:--:-- UTC");

  useEffect(() => {
    setTime(format(new Date()));
    const id = window.setInterval(() => setTime(format(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-live="off"
      className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1 font-mono text-[12px] tracking-wide text-[var(--mute)] tabular-nums"
    >
      {time}
    </div>
  );
}
