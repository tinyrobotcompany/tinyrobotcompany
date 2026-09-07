"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./mascot.module.css";

const FACES = ["happy", "focus", "wink", "sleep"] as const;
type Face = (typeof FACES)[number];

/**
 * The animated Tiny Robot Company mascot.
 *
 * Motion is a DVD-screensaver bounce: constant speed, reflects off the stage
 * walls with a small random angle jitter each bounce (so she doesn't lock
 * into a repeating diagonal pattern).
 *
 * Rotation: gentle continuous wobble (±5° over 2s), interrupted every 6–14s
 * by a full 360° spin (~1.6s, random direction).
 *
 * Face cycles on its own randomised timer (every ~1.4–2.4s), picking one of
 * the three non-current expressions each time.
 *
 * Falls back to static-centred (default Happy face) under prefers-reduced-motion.
 */
export function Mascot() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [face, setFace] = useState<Face>("happy");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!stage || !wrap) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Physics state — refs of primitives via closure vars (faster than React state).
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;
    let raf = 0;
    let lastTime = 0;

    // Rotation state: a slowly-updating base angle plus a continuous sine
    // wobble. Occasionally interrupted by a full 360° spin.
    let baseAngle = 0;
    let spinning = false;
    let spinStart = 0;
    let spinDir: 1 | -1 = 1;

    const SPEED = 95;            // pixels/sec — feels lively without being frantic
    const WOBBLE_AMP = 5;        // degrees (±)
    const WOBBLE_PERIOD_MS = 2000;
    const SPIN_DURATION_MS = 1600;

    /** (Re-)measure the stage and wrap; place the mascot at centre with a random heading. */
    const reset = () => {
      const s = stage.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      x = (s.width - w.width) / 2;
      y = (s.height - w.height) / 2;
      // Start heading somewhere in the general "down-right" quadrant, then randomised.
      const angle = (Math.random() * 0.5 + 0.25) * Math.PI + (Math.random() < 0.5 ? 0 : Math.PI);
      vx = Math.cos(angle) * SPEED;
      vy = Math.sin(angle) * SPEED;
      applyTransform();
    };

    const applyTransform = (rotDeg = baseAngle) => {
      wrap.style.transform =
        `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotDeg.toFixed(2)}deg)`;
    };

    // Under reduced motion: just show the mascot centred with the default face.
    if (reducedMotion) {
      reset();
      setReady(true);
      return;
    }

    const step = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const s = stage.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      const maxX = Math.max(0, s.width - w.width);
      const maxY = Math.max(0, s.height - w.height);

      x += vx * dt;
      y += vy * dt;

      let bounced = false;

      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
        bounced = true;
      } else if (x >= maxX) {
        x = maxX;
        vx = -Math.abs(vx);
        bounced = true;
      }

      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
        bounced = true;
      } else if (y >= maxY) {
        y = maxY;
        vy = -Math.abs(vy);
        bounced = true;
      }

      if (bounced) {
        // Rotate velocity by a small random amount so the trajectory doesn't
        // lock into an infinite diagonal.
        const jitter = (Math.random() - 0.5) * 0.5; // ~±14°
        const speed = Math.hypot(vx, vy);
        const angle = Math.atan2(vy, vx) + jitter;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      // Rotation: full-spin overrides the wobble while it's in progress.
      let rot: number;
      if (spinning) {
        const t = Math.min(1, (time - spinStart) / SPIN_DURATION_MS);
        // easeInOutQuad
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        rot = baseAngle + eased * 360 * spinDir;
        if (t >= 1) {
          baseAngle += 360 * spinDir;
          spinning = false;
          scheduleNextSpin();
        }
      } else {
        const wobble = Math.sin((time / WOBBLE_PERIOD_MS) * Math.PI * 2) * WOBBLE_AMP;
        rot = baseAngle + wobble;
      }

      applyTransform(rot);
      raf = requestAnimationFrame(step);
    };

    // Occasional full spin — every 6–14s, alternating direction randomly.
    let spinTimer = 0;
    const triggerSpin = () => {
      if (spinning) return;
      spinning = true;
      spinStart = performance.now();
      spinDir = Math.random() < 0.5 ? 1 : -1;
    };
    const scheduleNextSpin = () => {
      const delay = 6000 + Math.random() * 8000;
      spinTimer = window.setTimeout(triggerSpin, delay);
    };

    // Face cycler — self-scheduling timer so we can randomise each interval.
    // Picks a random face from the three that aren't current, so every tick
    // is a visible change.
    let currentFace: Face = "happy";
    let faceTimer = 0;
    const scheduleFace = () => {
      const delay = 1400 + Math.random() * 1000; // 1.4–2.4s
      faceTimer = window.setTimeout(() => {
        const others = FACES.filter((f) => f !== currentFace);
        const next = others[Math.floor(Math.random() * others.length)];
        currentFace = next;
        setFace(next);
        scheduleFace();
      }, delay);
    };

    reset();
    setReady(true);
    raf = requestAnimationFrame(step);
    scheduleFace();
    scheduleNextSpin();

    // Re-centre on resize — otherwise she can end up stuck outside the new bounds.
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // Clamp position into the new box without teleporting the whole thing.
        const s = stage.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        x = Math.min(Math.max(0, x), Math.max(0, s.width - w.width));
        y = Math.min(Math.max(0, y), Math.max(0, s.height - w.height));
        applyTransform();
      }, 100);
    };
    window.addEventListener("resize", onResize);

    // Pause everything when the tab isn't visible.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        window.clearTimeout(faceTimer);
        window.clearTimeout(spinTimer);
      } else {
        lastTime = 0;
        raf = requestAnimationFrame(step);
        scheduleFace();
        if (!spinning) scheduleNextSpin();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(faceTimer);
      window.clearTimeout(spinTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage} aria-label="Tiny Robot Company mascot">
      <div className={styles.badge}>TR·01 / mascot</div>

      <div
        ref={wrapRef}
        className={styles.wrap}
        data-face={face}
        style={{ visibility: ready ? "visible" : "hidden" }}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 300 320"
          role="img"
          aria-labelledby="mascotTitle mascotDesc"
        >
          <title id="mascotTitle">Tiny Robot Company</title>
          <desc id="mascotDesc">
            A small red robot with a signal antenna, bouncing around her zone and switching between happy, focused, winking, and sleeping expressions.
          </desc>

          <ellipse cx="150" cy="308" rx="90" ry="7" fill="#000" opacity="0.35" />

          {/* Antenna: stem, radar rings, beacon, rim */}
          <line x1="150" y1="36" x2="150" y2="66" stroke="var(--robot)" strokeWidth="6" strokeLinecap="round" />
          <circle className={styles.pulse} cx="150" cy="28" r="9" fill="none" stroke="var(--cream)" strokeWidth="3" />
          <circle className={`${styles.pulse} ${styles["pulse--2"]}`} cx="150" cy="28" r="9" fill="none" stroke="var(--cream)" strokeWidth="3" />
          <circle className={styles.beacon} cx="150" cy="28" r="9" fill="var(--cream)" />
          <circle cx="150" cy="28" r="9" fill="none" stroke="var(--robot-lo)" strokeWidth="1.5" opacity="0.4" />

          {/* Head */}
          <rect x="52" y="60" width="196" height="140" rx="42" fill="var(--robot)" />
          <ellipse cx="80" cy="89" rx="18" ry="10" fill="#FFF" opacity="0.09" />
          <path d="M 208 84 Q 220 132 208 184 L 218 184 Q 230 132 218 84 Z" fill="#000" opacity="0.08" />

          {/* Faces — visibility gated by [data-face] on .wrap */}
          <g className={`${styles.face} ${styles["face--happy"]}`}>
            <path className={styles.eye} d="M 86 136 Q 106 102 126 136" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path className={styles.eye} d="M 174 136 Q 194 102 214 136" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <ellipse cx="78" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <ellipse cx="222" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <path d="M 138 166 Q 150 176 162 166" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          <g className={`${styles.face} ${styles["face--focus"]}`}>
            <circle cx="106" cy="128" r="10" fill="var(--ink)" />
            <circle cx="194" cy="128" r="10" fill="var(--ink)" />
            <circle cx="106" cy="125" r="3" fill="#FFF" opacity="0.85" />
            <circle cx="194" cy="125" r="3" fill="#FFF" opacity="0.85" />
            <ellipse cx="78" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <ellipse cx="222" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <path d="M 138 168 Q 150 180 162 168" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          <g className={`${styles.face} ${styles["face--wink"]}`}>
            <path d="M 86 136 Q 106 102 126 136" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="194" cy="128" r="10" fill="var(--ink)" />
            <circle cx="194" cy="125" r="3" fill="#FFF" opacity="0.85" />
            <ellipse cx="78" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <ellipse cx="222" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <path d="M 130 164 Q 150 186 170 164" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          <g className={`${styles.face} ${styles["face--sleep"]}`}>
            <path d="M 86 132 L 126 132" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 174 132 L 214 132" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 138 166 Q 150 158 162 166" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <text x="234" y="56" fill="var(--fg-2)" fontFamily="var(--font-instrument-serif), Georgia, serif" fontStyle="italic" fontSize="30">z</text>
            <text x="254" y="38" fill="var(--fg-2)" fontFamily="var(--font-instrument-serif), Georgia, serif" fontStyle="italic" fontSize="20" opacity="0.6">z</text>
          </g>

          {/* Body */}
          <rect x="66" y="216" width="168" height="72" rx="20" fill="var(--robot)" />
          <rect x="106" y="228" width="88" height="46" rx="6" fill="var(--robot-ink)" opacity="0.55" />
          <circle cx="150" cy="251" r="5" fill="var(--cream)" />
          <line x1="122" y1="266" x2="178" y2="266" stroke="var(--cream)" strokeWidth="1.5" opacity="0.5" />

          {/* Arms */}
          <rect x="38" y="226" width="26" height="58" rx="13" fill="var(--robot)" />
          <rect x="236" y="226" width="26" height="58" rx="13" fill="var(--robot)" />

          {/* Feet */}
          <rect x="82" y="288" width="52" height="18" rx="6" fill="var(--ink)" />
          <rect x="166" y="288" width="52" height="18" rx="6" fill="var(--ink)" />
        </svg>
      </div>

      <div className={styles.cap}>
        <span><em>Primary mark</em></span>
        <span>Scale · 1:1</span>
      </div>
    </div>
  );
}
