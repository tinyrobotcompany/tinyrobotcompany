import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import base from "../../page.module.css";
import styles from "./work.module.css";
import { Arrow, RightArrow } from "../../components/Icons";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { Spotlight } from "../../components/Spotlight";
import { AppIcon, CharacterPlate, FlowStrip } from "../../components/WorkVisuals";
import { fullName, getWork, repoUrl, works, type Work } from "../../data/works";
import { postsForWork } from "../../data/log";
import { latestVersion } from "../../lib/github";


export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const work = getWork((await params).slug);
  if (!work) return {};
  return {
    title: fullName(work),
    description: work.tagline,
    openGraph: { title: `${fullName(work)} · Tiny Robot Company`, description: work.tagline },
  };
}

type ScreenVisual = Extract<NonNullable<Work["visual"]>, { kind: "screen" }>;

/** One screen, or several of the same size side by side. */
function ScreenSet({ visual }: { visual: ScreenVisual }) {
  const images = [{ src: visual.src, alt: visual.alt }, ...(visual.more ?? [])];
  return (
    <div className={images.length > 1 ? styles.screens : undefined}>
      {images.map((img, i) => (
        <Image
          key={img.src}
          className={styles.screen}
          src={img.src}
          alt={img.alt}
          width={visual.width}
          height={visual.height}
          unoptimized
          priority={i === 0}
        />
      ))}
    </div>
  );
}

export default async function WorkPage({ params }: PageProps<"/works/[slug]">) {
  const work = getWork((await params).slug);
  if (!work) notFound();

  const version = await latestVersion(work);
  const name = fullName(work);

  return (
    <>
      <Spotlight />
      <SiteHeader />

      <main id="top" className={base.wrap}>
        <Link className={styles.back} href="/#works">
          <RightArrow flip /> All works
        </Link>

        {/* -------------------- HEAD -------------------- */}
        <section className={styles.head} aria-labelledby="work-title">
          <div className={styles.meta}>
            <span><em>{work.no}</em></span>
            <span>{work.pillars.join(" · ")}</span>
            <span>Est. <em>{work.year}</em></span>
            <span>{work.stage}</span>
            <span>Rev. <em>{version}</em></span>
          </div>

          <div className={styles.titleRow}>
            {work.icon && <AppIcon src={work.icon} name={name} size={64} />}
            <h1 className={styles.title} id="work-title">
              {work.name.lead}
              {work.name.serif && <> <span className={base.serif}>{work.name.serif}</span></>}.
            </h1>
          </div>

          <p className={styles.lede}>{work.tagline}</p>

          <div className={base.heroActions}>
            <Link className={`${base.btn} ${base.btnPrimary}`} href={`/join/?for=${work.slug}`}>
              {work.beta ? "Join the beta" : "Join the waitlist"} <RightArrow />
            </Link>
            <a className={`${base.btn} ${base.btnGhost}`} href={repoUrl(work)} target="_blank" rel="noopener noreferrer">
              View the code <Arrow />
            </a>
            {!work.beta && (
              <Link className={`${base.btn} ${base.btnGhost}`} href="/#services">
                Commission something similar
              </Link>
            )}
          </div>
        </section>

        {/* -------------------- VISUAL -------------------- */}
        {work.visual && (
          <figure className={styles.visual}>
            {work.visual.kind === "family" ? (
              <CharacterPlate characters={work.visual.characters} showNames priority />
            ) : (
              <ScreenSet visual={work.visual} />
            )}
            {work.visual.kind === "screen" && work.visual.caption && (
              <figcaption className={styles.caption}>{work.visual.caption}</figcaption>
            )}
          </figure>
        )}

        {/* -------------------- ABOUT -------------------- */}
        <section className={base.section} aria-labelledby="about-h">
          <div className={base.sectionHead}>
            <div className={base.sectionNo}><em>§ 01</em> · About</div>
            <h2 className={base.sectionTitle} id="about-h">
              What it <span className={base.serif}>does</span>.
            </h2>
            <div className={base.sectionCount}>{work.stage}</div>
          </div>

          <div className={styles.about}>
            <div className={styles.body}>
              {work.intro.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
            </div>

            <dl className={base.statementMeta}>
              <dt>Works today</dt> <dd>{work.status.today}</dd>
              <dt>Next</dt>        <dd>{work.status.next}</dd>
              <dt>Get one</dt>     <dd>{work.status.availability}</dd>
              <dt>Release</dt>     <dd>{version}</dd>
              <dt>Pillar</dt>  <dd>{work.pillars.join(" · ")}</dd>
              <dt>Stack</dt>   <dd>{work.stack.join(" · ")}</dd>
              <dt>Source</dt>
              <dd>
                <a className={styles.inlineLink} href={repoUrl(work)} target="_blank" rel="noopener noreferrer">
                  github.com/{work.repo.owner}/{work.repo.name}
                </a>
              </dd>
            </dl>
          </div>
        </section>

        {/* -------------------- HIGHLIGHTS -------------------- */}
        <section className={base.section} aria-labelledby="highlights-h">
          <div className={base.sectionHead}>
            <div className={base.sectionNo}><em>§ 02</em> · Highlights</div>
            <h2 className={base.sectionTitle} id="highlights-h">
              Why it&rsquo;s <span className={base.serif}>interesting</span>.
            </h2>
            <div className={base.sectionCount}>{String(work.highlights.length).padStart(2, "0")}</div>
          </div>

          <div className={styles.highlights}>
            {work.highlights.map((h, i) => (
              <div key={h.title} className={styles.highlight}>
                <div className={base.cardLabel}><span>{String(i + 1).padStart(2, "0")}</span></div>
                <h3 className={base.cardTitle}>{h.title}</h3>
                <p className={base.cardDesc}>{h.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------- YOUR DATA -------------------- */}
        {work.dataNote && (
          <section className={base.section} aria-labelledby="data-h">
            <div className={base.sectionHead}>
              <div className={base.sectionNo}>Privacy</div>
              <h2 className={base.sectionTitle} id="data-h">
                Where your <span className={base.serif}>data goes</span>.
              </h2>
            </div>
            <div className={styles.body}>
              {work.dataNote.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
              <p>
                More in the <Link className={styles.inlineLink} href="/privacy/">privacy policy</Link>.
              </p>
            </div>
          </section>
        )}

        {/* -------------------- FLOW -------------------- */}
        <section className={base.section} aria-labelledby="flow-h">
          <div className={base.sectionHead}>
            <div className={base.sectionNo}><em>§ 03</em> · Signal path</div>
            <h2 className={base.sectionTitle} id="flow-h">
              How it fits <span className={base.serif}>together</span>.
            </h2>
            <div className={base.sectionCount}>03 stages</div>
          </div>
          <FlowStrip flow={work.flow} className={styles.flow} />
        </section>

        {postsForWork(work.slug).length > 0 && (
          <section className={base.section} aria-labelledby="notes-h">
            <div className={base.sectionHead}>
              <div className={base.sectionNo}>Build notes</div>
              <h2 className={base.sectionTitle} id="notes-h">From the <span className={base.serif}>log</span>.</h2>
            </div>
            <div className={base.heroActions}>
              {postsForWork(work.slug).map((p) => (
                <Link key={p.slug} className={`${base.btn} ${base.btnGhost}`} href={`/log/${p.slug}/`}>
                  {p.title} <Arrow />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
