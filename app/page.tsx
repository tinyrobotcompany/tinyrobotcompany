import styles from "./page.module.css";
import { BrandMark } from "./components/BrandMark";
import { Clock } from "./components/Clock";
import { Mascot } from "./components/Mascot";
import { Spotlight } from "./components/Spotlight";
import { ThemeToggle } from "./components/ThemeToggle";
import { Ticker } from "./components/Ticker";

const Arrow = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RightArrow = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Home() {
  return (
    <>
      <Spotlight />

      <header className={styles.nav} role="banner">
        <a href="#top" className={styles.brand} aria-label="The Little Systems Company, home">
          <BrandMark size={22} />
          The Little Systems Company
        </a>
        <ul className={styles.navLinks}>
          <li><a href="#works">Works</a></li>
          <li><a href="#studio">Studio</a></li>
          <li><a href="#signal">Signal</a></li>
        </ul>
        <div className={styles.navActions}>
          <Clock />
          <a className={styles.cta} href="#signal">
            Start a brief
            <Arrow />
          </a>
        </div>
      </header>

      <Ticker />

      <main id="top" className={styles.wrap}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <div className={styles.heroMeta}>
              <span><span className={styles.liveDot} aria-hidden="true" /> Workshop live</span>
              <span>Est. <em>2026</em></span>
              <span>Rev. <em>A.04</em></span>
              <span>Simon@<em>lsc</em></span>
            </div>

            <h1 className={styles.heroTitle} id="hero-title">
              Little systems,<span className={styles.and}>&mdash;</span>
              <span className={styles.serif}>real</span> work.
            </h1>

            <p className={styles.heroLede}>
              The Little Systems Company builds <span className={styles.hl}>robotics, AI systems,
              and practical GenAI</span> for small and mid-sized manufacturers &mdash; building,
              education and consultancy from a workshop of one.
            </p>

            <div className={styles.heroActions}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="#works">
                See recent work <RightArrow />
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href="#signal">
                hello@TheLittleSystemsCompany.io
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
            <div className={styles.sectionCount}>04 · 2024 → 2026</div>
          </div>

          <div className={styles.bento}>
            {/* Featured */}
            <a className={`${styles.card} ${styles.cardFeature}`} href="#" aria-label="Signal Sketchbook — featured project">
              <div className={styles.cardLabel}>
                <span>Featured · <em>2026</em></span>
                <span>LSC / 04</span>
              </div>
              <h3 className={styles.cardTitle}>Signal <span className={styles.serif}>Sketchbook</span>.</h3>
              <p className={styles.cardDesc}>
                A live visualiser that turns conversation and ambient audio into evolving
                generative graphics. Runs entirely offline on a mid-range laptop — Whisper
                into a custom WebGL pipeline, no cloud round-trips, no waiting.
              </p>
              <div className={styles.featureVisual} aria-hidden="true">
                <div className={styles.fvNode}>MIC<small>INPUT</small></div>
                <div className={styles.fvArrow}>→</div>
                <div className={styles.fvNode}>WHISPER<small>LOCAL</small></div>
                <div className={styles.fvArrow}>→</div>
                <div className={styles.fvNode}>GL PIPE<small>OUTPUT</small></div>
              </div>
              <div className={styles.cardFoot}>
                <span>Whisper · WGPU · Rust</span>
                <span className={styles.cardArrow}><Arrow /></span>
              </div>
            </a>

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

            {/* Small Voice */}
            <a className={`${styles.card} ${styles.cardSide}`} href="#">
              <div className={styles.cardLabel}>
                <span>LSC / 03 · <em>2026</em></span>
                <span>Ship</span>
              </div>
              <h3 className={styles.cardTitle}>Small <span className={styles.serif}>Voice</span>.</h3>
              <p className={styles.cardDesc}>
                A local assistant on a Pi Zero 2 W. Wake-word, no cloud, low-milliwatt.
              </p>
              <div className={styles.cardFoot}>
                <span>Llama.cpp · KiCad</span>
                <span className={styles.cardArrow}><Arrow /></span>
              </div>
            </a>

            {/* Servo Loom */}
            <a className={`${styles.card} ${styles.cardThird}`} href="#">
              <div className={styles.cardLabel}>
                <span>LSC / 02 · <em>2025</em></span>
                <span>Ship</span>
              </div>
              <h3 className={styles.cardTitle}>Servo <span className={styles.serif}>Loom</span>.</h3>
              <p className={styles.cardDesc}>
                Four-axis textile plotter driven by an LLM planner. Type a phrase, weave a pattern.
              </p>
              <div className={styles.cardFoot}>
                <span>ESP32 · GPT-4o</span>
                <span className={styles.cardArrow}><Arrow /></span>
              </div>
            </a>

            {/* Retina Kit */}
            <a className={`${styles.card} ${styles.cardThird}`} href="#">
              <div className={styles.cardLabel}>
                <span>LSC / 01 · <em>2024</em></span>
                <span>Archive</span>
              </div>
              <h3 className={styles.cardTitle}>Retina <span className={styles.serif}>Kit</span>.</h3>
              <p className={styles.cardDesc}>
                A breadboard-scale computer-vision teaching kit. Pixels to inference in a weekend.
              </p>
              <div className={styles.cardFoot}>
                <span>OpenMV · TinyML</span>
                <span className={styles.cardArrow}><Arrow /></span>
              </div>
            </a>

            {/* AI Function, Standing Start */}
            <a className={`${styles.card} ${styles.cardThird}`} href="#">
              <div className={styles.cardLabel}>
                <span>LSC / 05 · <em>2026</em></span>
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
              <span className={styles.mute}>The Little Systems Company</span> is what happens when that same
              discipline gets pointed at three things:
              <span className={styles.serif}> small self-contained machines,</span>
              <span className={styles.serif}> AI systems that companies need to build properly,</span> and
              <span className={styles.serif}> the education</span> that makes the difference between AI
              that ships and AI that gets talked about.
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
              <a className={styles.contactRow} href="mailto:hello@TheLittleSystemsCompany.io">
                <span className={styles.contactK}>Mail</span>
                <span className={styles.contactV}>hello@TheLittleSystemsCompany.io</span>
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

      <footer className={styles.foot}>
        <div>© <em>The Little Systems Company</em> · 2026 — Assembled by hand.</div>
        <div className={styles.footSide}>
          <span>Build 13 · <em>A.04</em></span>
          <a href="#top">Back to top ↑</a>
          <ThemeToggle />
        </div>
      </footer>
    </>
  );
}
