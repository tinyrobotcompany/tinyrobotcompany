import styles from "./blog.module.css";
import { NewsletterForm } from "../components/NewsletterForm";

/** "Get the Weekly Brief" box shown under the blog index and every post. */
export function NewsletterBox() {
  return (
    <aside className={styles.subscribe} aria-labelledby="subscribe-title">
      <span className={styles.subscribeK}>The Weekly Brief</span>
      <h2 className={styles.subscribeTitle} id="subscribe-title">AI and robotics, explained every Monday.</h2>
      <p className={styles.subscribeText}>
        The week&rsquo;s developments that matter, in plain English, and what they mean for your business. Free.
      </p>
      <NewsletterForm idPrefix="box" />
    </aside>
  );
}
