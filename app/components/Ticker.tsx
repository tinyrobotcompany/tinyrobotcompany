import styles from "./ticker.module.css";

const ITEMS: Array<React.ReactNode> = [
  <span key="live" className="inline-flex items-center gap-2">
    <span className={styles.dot} />
    Workshop live
  </span>,
  <span key="who">
    Simon Holmes / <em>full-stack GenAI engineer</em>
  </span>,
  <span key="focus">
    Focus: <em>robotics · AI systems · practical GenAI</em>
  </span>,
  <span key="who-for">
    For: <em>small and mid-sized manufacturers</em>
  </span>,
  <span key="ship">
    Latest ship: <em>Small Voice · v0.3</em>
  </span>,
  <span key="bench">
    Currently on the bench: <em>Servo Loom · calibration</em>
  </span>,
  <span key="slot">
    Consulting slots: <em>Q4 2026 · 2 open</em>
  </span>,
  <span key="loc">
    Location: <em>Paris ↔ Anywhere</em>
  </span>,
  <span key="dom">◆ The Little Systems Company</span>,
];

/**
 * Endless-scroll marquee. Content is duplicated so the loop is seamless.
 * Pure CSS animation, server-rendered, honours prefers-reduced-motion.
 */
export function Ticker() {
  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        {ITEMS.map((item, i) => (
          <span key={`a-${i}`}>{item}</span>
        ))}
        {ITEMS.map((item, i) => (
          <span key={`b-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
