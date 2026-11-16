import Link from "next/link";
import styles from "./page.module.css";
import { Mascot } from "./components/Mascot";
import { Spotlight } from "./components/Spotlight";
import { Ticker } from "./components/Ticker";
import { Arrow, RightArrow } from "./components/Icons";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { AppIcon, CharacterPlate, FlowStrip } from "./components/WorkVisuals";
import { fullName, getWork, works, type Work } from "./data/works";
import { latestVersions } from "./lib/github";

function WorkTitle({ work }: { work: Work }) {
  return (
    <h3 className={styles.cardTitle}>
      {work.name.lead}
      {work.name.serif && <> <span className={styles.serif}>{work.name.serif}</span></>}.
    </h3>
  );
}

function WorkCard({ work, version, className }: { work: Work; version: string; className: string }) {
  return (
    <Link className={`${styles.card} ${className}`} href={`/works/${work.slug}`} aria-label={`${fullName(work)}: ${work.tagline}`}>
      <div className={styles.cardLabel}>
        <span>{work.no} · <em>{work.year}</em></span>
        <span>{work.stage} · {version}</span>
      </div>
      <div className={styles.cardHead}>
        {work.icon && <AppIcon src={work.icon} name={fullName(work)} size={36} />}
        <WorkTitle work={work} />
      </div>
      <p className={styles.cardDesc}>{work.summary}</p>
      <div className={styles.cardFoot}>
        <span>{work.stack.slice(0, 3).join(" · ")}</span>
        <span className={styles.cardArrow}><Arrow /></span>
      </div>
    </Link>
  );
}

export default async function Home() {
  const versions = await latestVersions(works);
  const w = (slug: string) => getWork(slug)!;
  const featured = w("pico-pie");

  return (
    <>
      <Spotlight />
      <SiteHeader />


      <Ticker />

      <main id="top" className={styles.wrap}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <div className={styles.heroMeta}>
              <span><span className={styles.liveDot} aria-hidden="true" /> Workshop live</span>
              <span>Est. <em>2026</em></span>
              <span>Rev. <em>A.03</em></span>
              <span>Simon@<em>trc</em></span>
            </div>

            <h1 className={styles.heroTitle} id="hero-title">
              Small machines,<span className={styles.and}>&mdash;</span>
              <span className={styles.serif}>large</span> ideas.
            </h1>

            <p className={styles.heroLede}>
              Tiny Robot Company is a <span className={styles.hl}>studio of one</span> working at the seam
              between language models, circuits and things that move. Applied GenAI, small-batch
              electronics, and the occasional robot that behaves.
            </p>

            <div className={styles.heroActions}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="#works">
                See recent work <RightArrow />
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href="#signal">
                hello@tinyrobotcompany.io
              </a>
            </div>
          </div>

          <div className={styles.heroStage}>
            <Mascot />
          </div>
        </section>

        {/* -------------------- WORKS -------------------- */}
        <section className={styles.section} id="works" aria-labelledby="works-h">
          <div className={styles.sectionHead}>
            <div className={styles.sectionNo}><em>§ 01</em> · Works</div>
            <h2 className={styles.sectionTitle} id="works-h">
              Selected <span className={styles.serif}>benchwork</span>.
            </h2>
            <div className={styles.sectionCount}>{String(works.length).padStart(2, "0")} · on the bench · 2026</div>
          </div>

          <div className={styles.bento}>
            {/* Featured */}
            <Link
              className={`${styles.card} ${styles.cardFeature}`}
              href={`/works/${featured.slug}`}
              aria-label={`${fullName(featured)}, featured project: ${featured.tagline}`}
            >
              <div className={styles.cardLabel}>
                <span>Featured · <em>{featured.year}</em></span>
                <span>{featured.no} · {featured.stage} · {versions[featured.slug]}</span>
              </div>
              <WorkTitle work={featured} />
              <p className={styles.cardDesc}>{featured.summary}</p>
              <div className={styles.featureVisual}>
                {featured.visual?.kind === "family" ? (
                  <CharacterPlate characters={featured.visual.characters} />
                ) : (
                  <FlowStrip flow={featured.flow} />
                )}
              </div>
              <div className={styles.cardFoot}>
                <span>{featured.stack.join(" · ")}</span>
                <span className={styles.cardArrow}><Arrow /></span>
              </div>
            </Link>

            {/* Live status */}
            <div className={`${styles.card} ${styles.cardStatus} ${styles.cardSide}`}>
              <div className={styles.cardLabel}>
                <span>System · <em>Live</em></span>
                <span>UTC</span>
              </div>
              <dl className={styles.statusGrid}>
                <dt>Workshop</dt><dd className={styles.statusUp}>Online</dd>
                <dt>Response</dt><dd>~ 12h</dd>
                <dt>Focus</dt><dd>GenAI + HW</dd>
                <dt>Slots</dt><dd>2 / Q4</dd>
              </dl>
              <svg className={styles.wave} viewBox="0 0 200 42" preserveAspectRatio="none" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  d="M0 21 L10 21 L14 8 L18 33 L22 15 L26 28 L32 21 L46 21 L50 12 L54 30 L58 21 L74 21 L78 6 L82 35 L86 18 L90 24 L96 21 L118 21 L122 14 L126 27 L130 20 L146 21 L150 9 L154 32 L158 21 L200 21"
                />
              </svg>
            </div>

            <WorkCard work={w("voxa")} version={versions.voxa} className={styles.cardSide} />
            <WorkCard work={w("deja-groove")} version={versions["deja-groove"]} className={styles.cardThird} />
            <WorkCard work={w("tempo")} version={versions.tempo} className={styles.cardThird} />
            <WorkCard work={w("waveform-one")} version={versions["waveform-one"]} className={styles.cardThird} />

            {/* AI Function, Standing Start — field work, no detail page */}
            <a className={`${styles.card} ${styles.cardWide}`} href="#signal">
              <div className={styles.cardLabel}>
                <span>TRC / 00 · <em>Before TRC</em></span>
                <span>Field</span>
              </div>
              <h3 className={styles.cardTitle}>AI Function, <span className={styles.serif}>Standing Start</span>.</h3>
              <p className={styles.cardDesc}>
                Built and led an AI engineering function from zero inside a global
                industrial supplier — architecture, hiring, delivery. No pilots that
                died in committee; this one runs.
              </p>
              <div className={styles.cardFoot}>
                <span>Fractional lead · 0→N team</span>
                <span className={styles.cardArrow}><Arrow /></span>
              </div>
            </a>

            {/* Uptime stat */}
            <div className={`${styles.card} ${styles.cardStat}`}>
              <div className={styles.cardLabel}>
                <span>Uptime · <em>12 mo</em></span>
                <span>Live</span>
              </div>
              <div className={styles.statValue}>99.4<span className={styles.unit}>%</span></div>
              <div className={styles.statLabel}>Coffee-to-commit ratio, self-reported.</div>
              <svg className={styles.spark} viewBox="0 0 200 34" preserveAspectRatio="none" aria-hidden="true">
                <path fill="var(--fg)" opacity="0.05" d="M0 26 L20 22 L40 24 L60 18 L80 20 L100 12 L120 15 L140 8 L160 10 L180 6 L200 9 L200 34 L0 34 Z"/>
                <path fill="none" stroke="var(--fg-2)" strokeWidth="1.5" d="M0 26 L20 22 L40 24 L60 18 L80 20 L100 12 L120 15 L140 8 L160 10 L180 6 L200 9"/>
              </svg>
            </div>
          </div>
        </section>

        {/* -------------------- STUDIO -------------------- */}
        <section className={styles.section} id="studio">
          <div className={styles.sectionHead}>
            <div className={styles.sectionNo}><em>§ 02</em> · Studio</div>
            <h2 className={styles.sectionTitle}>
              One operator, one <span className={styles.serif}>bench</span>.
            </h2>
            <div className={styles.sectionCount}>2026 —</div>
          </div>

          <div className={styles.statementBody}>
            <p className={styles.statementQuote}>
              <span className={styles.mute}>Before the bench,</span> 10 years building things that actually had to work,
              <span className={styles.serif}> leading AI engineering</span> inside a global industrial company.
              <span className={styles.mute}> Shipping software,</span> that ran in production, not in slideshows. 
              <br />
              <br />
              The
              <span className={styles.mute}>Tiny Robot Company </span>
              is what happens when that same discipline gets pointed at two things: 
              <span className={styles.serif}> small self contained machines,  </span>
              and
              <span className={styles.serif}> AI functions that companies need </span>  
              <span className={styles.serif}> to build properly,</span>
              <span className={styles.mute}> not just talked about</span> 
            </p>

            <dl className={styles.statementMeta}>
              <dt>Name</dt>              <dd>Simon Holmes, PhD</dd>
              <dt>Role</dt>              <dd>Full-stack GenAI architect / engineer</dd>
              <dt>Base</dt>              <dd>Paris · remote-first</dd>
              <dt>Available</dt>         <dd>Consulting · Q4 2026 · 2 slots</dd>
              <dt>Preferred brief</dt>   <dd>Small, weird, well-defined.</dd>
            </dl>
          </div>
        </section>

        {/* -------------------- CONTACT -------------------- */}
        <section className={styles.section} id="signal">
          <div className={styles.contactInner}>
            <div>
              <div className={styles.sectionNo} style={{ marginBottom: "1.25rem" }}>
                <em>§ 03</em> · Signal
              </div>
              <h2 className={styles.contactH2}>
                Have something big or small<br />
                that needs to <span className={styles.serif}>think,</span>
                <span className={styles.serif}> move</span> or{" "}
                <span className={styles.serif}>scale</span>?
              </h2>
              <p className={styles.contactLede}>
                Briefs are read the same day. Fit-check reply within two working days,
                prototype within four weeks where the scope allows.
              </p>
            </div>

            <div className={styles.contactPanel}>
              <a className={styles.contactRow} href="mailto:hello@tinyrobotcompany.io">
                <span className={styles.contactK}>Mail</span>
                <span className={styles.contactV}>hello@tinyrobotcompany.io</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </a>
              <a className={styles.contactRow} href="https://github.com/tinyrobotcompany" target="_blank" rel="me noopener noreferrer">
                <span className={styles.contactK}>GitHub</span>
                <span className={styles.contactV}>/tinyrobotcompany</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </a>
              <a className={styles.contactRow} href="#" rel="me">
                <span className={styles.contactK}>Log</span>
                <span className={styles.contactV}>/notes</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
