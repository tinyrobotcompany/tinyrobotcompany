import Link from "next/link";
import styles from "../page.module.css";
import { BrandMark } from "./BrandMark";
import { Clock } from "./Clock";
import { Arrow } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import { site, socials } from "../data/site";

/* Header and footer shared by every page.
   Links are root-relative ("/#works") so they work from any route. */

export const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#record", label: "Track record" },
  { href: "/#works", label: "Bench" },
  { href: "/#signal", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className={styles.nav} role="banner">
      <Link href="/#top" className={styles.brand} aria-label="Tiny Robot Company, home">
        <BrandMark size={22} />
        tinyrobotcompany.io
      </Link>
      <ul className={styles.navLinks}>
        {NAV_LINKS.map((l) => (
          <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
        ))}
      </ul>
      <div className={styles.navActions}>
        <span className={styles.navClock}><Clock /></span>
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
      <div>© <em>{site.name}</em> · 2026 — Assembled by hand in {site.location}.</div>
      <nav className={styles.footSide} aria-label="Site">
        <Link href="/legal">Legal notice</Link>
        <Link href="/privacy">Privacy</Link>
        <a href="#top">Back to top ↑</a>
      </nav>
      <ul className={styles.footLinks} aria-label="Social links">
        {socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="me noopener noreferrer">{s.label}</a>
          </li>
        ))}
      </ul>
      <div className={styles.footTheme}>
        <ThemeToggle />
      </div>
    </footer>
  );
}
