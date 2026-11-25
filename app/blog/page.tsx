import Link from "next/link";
import type { Metadata } from "next";
import base from "../page.module.css";
import work from "../works/[slug]/work.module.css";
import styles from "./blog.module.css";
import { Arrow, RightArrow } from "../components/Icons";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { Spotlight } from "../components/Spotlight";
import { NewsletterBox } from "./NewsletterBox";
import { formatDate, posts } from "../data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Build notes from the Tiny Robot Company bench: architecture, firmware, AI security and shipping habits.",
  alternates: { types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default function BlogIndex() {
  return (
    <>
      <Spotlight />
      <SiteHeader />

      <main id="top" className={base.wrap}>
        <Link className={work.back} href="/#works">
          <RightArrow flip /> The bench
        </Link>

        <section className={work.head} aria-labelledby="blog-title">
          <div className={work.meta}>
            <span><em>{posts.length}</em> notes</span>
            <span>Build notes from the bench</span>
          </div>
          <div className={work.titleRow}>
            <h1 className={work.title} id="blog-title">
              The <span>blog</span>.
            </h1>
          </div>
          <p className={work.lede}>
            How the things on the bench are built, and the decisions behind them. Short, practical and true.
          </p>
        </section>

        <section className={base.section} style={{ paddingTop: 0 }} aria-label="Posts">
          <ul className={styles.list}>
            {posts.map((p) => (
              <li key={p.slug}>
                <Link className={styles.item} href={`/blog/${p.slug}/`}>
                  <time className={styles.date} dateTime={p.date}>{formatDate(p.date)}</time>
                  <div>
                    <h2 className={styles.itemTitle}>{p.title}</h2>
                    <p className={styles.itemSummary}>{p.summary}</p>
                    <div className={styles.tags}>
                      {p.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                  </div>
                  <span className={base.cardArrow}><Arrow /></span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.feed}>
            Follow along: <a href="/newsletter/">by email</a> or <a href="/blog/feed.xml">RSS feed</a>
          </p>
          <NewsletterBox />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
