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

  // The 640px glow sits inside a viewport-sized clipping layer: a fixed
  // element wider than a phone screen would otherwise widen the layout.
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
    >
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.055), transparent 60%)",
          transform: "translate3d(-9999px, -9999px, 0) translate3d(-50%, -50%, 0)",
        }}
      />
    </div>
  );
}
