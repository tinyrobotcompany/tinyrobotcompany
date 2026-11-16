import Link from "next/link";
import styles from "../page.module.css";
import { BrandMark } from "./BrandMark";
import { Clock } from "./Clock";
import { Arrow } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

/* Header and footer shared by the home page and the /works pages.
   Links are root-relative ("/#works") so they work from any route. */

export function SiteHeader() {
  return (
    <header className={styles.nav} role="banner">
      <Link href="/#top" className={styles.brand} aria-label="Tiny Robot Company, home">
        <BrandMark size={22} />
        tinyrobotcompany.io
      </Link>
      <ul className={styles.navLinks}>
        <li><Link href="/#works">Works</Link></li>
        <li><Link href="/#studio">Studio</Link></li>
        <li><Link href="/#signal">Signal</Link></li>
      </ul>
      <div className={styles.navActions}>
        <Clock />
        <Link className={styles.cta} href="/#signal">
          Start a brief
          <Arrow />
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.foot}>
      <div>© <em>Tiny Robot Company</em> · 2026 — Assembled by hand.</div>
      <div className={styles.footSide}>
        <span>Build 12 · <em>A.03</em></span>
        <a href="#top">Back to top ↑</a>
        <ThemeToggle />
      </div>
    </footer>
  );
}
