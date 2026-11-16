import styles from "./legalPage.module.css";
import base from "../page.module.css";
import { SiteFooter, SiteHeader } from "./SiteChrome";

/** Shell for long-form legal pages: shared header/footer, readable measure. */
export function LegalPage({
  kicker,
  title,
  notice,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  notice?: React.ReactNode;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="top" className={base.wrap}>
        <article className={styles.doc}>
          <div className={base.sectionNo}>{kicker}</div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>Last updated {updated}</p>
          {notice && <div className={styles.notice} role="note">{notice}</div>}
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

/** A value that isn't known yet renders as an explicit placeholder. */
export function Field({ value, todo = "To be completed once the company is registered" }: { value: string | null; todo?: string }) {
  return value ? <>{value}</> : <span className={styles.todo}>[{todo}]</span>;
}
