import styles from "./ticker.module.css";
import { DAY_RATE_EUR, euro, site } from "../data/site";
import { BUILD_FROM_EUR } from "../data/build-levels";

const ITEMS: Array<React.ReactNode> = [
  <span key="live" className="inline-flex items-center gap-2">
    <span className={styles.dot} />
    Consulting: <em>new projects from {site.nextStart}</em>
  </span>,
  <span key="who">
    Simon Holmes, PhD / <em>AI engineer &amp; solutions architect</em>
  </span>,
  <span key="ship">
    In beta: <em>Voxa · Déjà Groove</em>, App Store soon
  </span>,
  <span key="bench">
    On the bench: <em>Tempo · Waveform One</em>
  </span>,
  <span key="offer">
    Advice &amp; training: <em>{euro(DAY_RATE_EUR)} / day</em> · Building: <em>from {euro(BUILD_FROM_EUR)} / day, by complexity</em>
  </span>,
  <span key="loc">
    Location: <em>{site.location} ↔ Anywhere</em>
  </span>,
  <span key="dom">◆ tinyrobotcompany.io</span>,
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
