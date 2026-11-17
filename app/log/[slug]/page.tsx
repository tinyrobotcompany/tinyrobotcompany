import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import base from "../../page.module.css";
import work from "../../works/[slug]/work.module.css";
import styles from "../log.module.css";
import { RightArrow } from "../../components/Icons";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { Spotlight } from "../../components/Spotlight";
import { formatDate, getPost, posts, type Block } from "../../data/log";
import { fullName, getWork } from "../../data/works";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/log/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h":
      return <h2>{block.text}</h2>;
    case "list":
      return <ul>{block.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    default:
      return <p>{block.text}</p>;
  }
}

export default async function PostPage({ params }: PageProps<"/log/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const related = post.works.map(getWork).filter((w) => w !== undefined);

  return (
    <>
      <Spotlight />
      <SiteHeader />

      <main id="top" className={base.wrap}>
        <Link className={work.back} href="/log/">
          <RightArrow flip /> The log
        </Link>

        <article aria-labelledby="post-title">
          <header className={work.head}>
            <div className={work.meta}>
              <time dateTime={post.date}><em>{formatDate(post.date)}</em></time>
              <span>{post.tags.join(" · ")}</span>
            </div>
            <h1 className={work.title} id="post-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {post.title}
            </h1>
            <p className={work.lede} style={{ marginTop: "1.25rem" }}>{post.summary}</p>
          </header>

          <div className={styles.article}>
            {post.body.map((b, i) => <BlockView key={i} block={b} />)}

            {related.length > 0 && (
              <div className={styles.related}>
                <span className={styles.relatedK}>On the bench</span>
                {related.map((w) => (
                  <Link key={w.slug} className={`${base.btn} ${base.btnGhost}`} href={`/works/${w.slug}/`}>
                    {fullName(w)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
