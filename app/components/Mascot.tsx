import styles from "./mascot.module.css";

/**
 * The animated Tiny Robot Company mascot.
 * Server component — pure CSS animation, no client JS.
 * The drift lives on the outer `.wrap`; per-part motion (radar, blink,
 * face cycling, bob) is scoped inside the SVG.
 */
export function Mascot() {
  return (
    <div className={styles.stage} aria-label="Tiny Robot Company mascot">
      <div className={styles.badge}>TR·01 / mascot</div>

      <div className={styles.wrap}>
        <svg
          className={styles.svg}
          viewBox="0 0 300 320"
          role="img"
          aria-labelledby="mascotTitle mascotDesc"
        >
          <title id="mascotTitle">Tiny Robot Company</title>
          <desc id="mascotDesc">
            A small red robot with a signal antenna, cycling through happy, focused, winking and sleeping.
          </desc>

          <ellipse cx="150" cy="308" rx="90" ry="7" fill="#000" opacity="0.35" />

          {/* Antenna: stem, radar rings, beacon, rim */}
          <line x1="150" y1="36" x2="150" y2="66" stroke="var(--robot)" strokeWidth="6" strokeLinecap="round" />
          <circle className={`${styles.pulse}`} cx="150" cy="28" r="9" fill="none" stroke="var(--cream)" strokeWidth="3" />
          <circle className={`${styles.pulse} ${styles["pulse--2"]}`} cx="150" cy="28" r="9" fill="none" stroke="var(--cream)" strokeWidth="3" />
          <circle className={styles.beacon} cx="150" cy="28" r="9" fill="var(--cream)" />
          <circle cx="150" cy="28" r="9" fill="none" stroke="var(--robot-lo)" strokeWidth="1.5" opacity="0.4" />

          {/* Head */}
          <rect x="52" y="60" width="196" height="140" rx="42" fill="var(--robot)" />
          <ellipse cx="80" cy="89" rx="18" ry="10" fill="#FFF" opacity="0.09" />
          <path d="M 208 84 Q 220 132 208 184 L 218 184 Q 230 132 218 84 Z" fill="#000" opacity="0.08" />

          {/* Faces (cycle) */}
          <g className={styles["face--happy"]}>
            <path className={styles.eye} d="M 86 136 Q 106 102 126 136" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path className={styles.eye} d="M 174 136 Q 194 102 214 136" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <ellipse cx="78" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <ellipse cx="222" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <path d="M 138 166 Q 150 176 162 166" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          <g className={styles["face--focus"]}>
            <circle cx="106" cy="128" r="10" fill="var(--ink)" />
            <circle cx="194" cy="128" r="10" fill="var(--ink)" />
            <circle cx="106" cy="125" r="3" fill="#FFF" opacity="0.85" />
            <circle cx="194" cy="125" r="3" fill="#FFF" opacity="0.85" />
            <ellipse cx="78" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <ellipse cx="222" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <path d="M 138 168 Q 150 180 162 168" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          <g className={styles["face--wink"]}>
            <path d="M 86 136 Q 106 102 126 136" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="194" cy="128" r="10" fill="var(--ink)" />
            <circle cx="194" cy="125" r="3" fill="#FFF" opacity="0.85" />
            <ellipse cx="78" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <ellipse cx="222" cy="159" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.6" />
            <path d="M 130 164 Q 150 186 170 164" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          <g className={styles["face--sleep"]}>
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
