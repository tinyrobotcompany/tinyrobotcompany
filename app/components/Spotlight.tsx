"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle warm spotlight that follows the cursor. Disabled on touch and
 * when the user prefers reduced motion.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    let x = -9999;
    let y = -9999;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
          raf = 0;
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 640,
        height: 640,
        borderRadius: "50%",
        pointerEvents: "none",
        background:
          "radial-gradient(circle at center, rgba(255,255,255,0.055), transparent 60%)",
        transform: "translate3d(-9999px, -9999px, 0) translate3d(-50%, -50%, 0)",
        zIndex: 0,
      }}
    />
  );
}
