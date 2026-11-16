import Link from "next/link";
import styles from "./page.module.css";
import { Mascot } from "./components/Mascot";
import { Spotlight } from "./components/Spotlight";
import { Ticker } from "./components/Ticker";
import { Arrow, RightArrow } from "./components/Icons";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { AppIcon, CharacterPlate, FlowStrip } from "./components/WorkVisuals";
import { DAY_RATE_EUR, EMAIL, euro, mailto, site, socials } from "./data/site";
import { priceLabel, serviceEnquiry, services, type Service } from "./data/services";
import { caseStudies, FORMER_EMPLOYER, stats } from "./data/track-record";
import { fullName, getWork, works, type Work } from "./data/works";
import { latestVersions } from "./lib/github";

const INTRO_CALL = mailto(
  "Intro call",
  "Hi Simon,\n\nI'd like to book a 30-minute intro call.\n\nCompany:\nWhat we're working on:\nA few times that suit me:\n",
);

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

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className={styles.service}>
      <div className={styles.cardLabel}>
        <span>{String(index + 1).padStart(2, "0")} · <em>{service.kind}</em></span>
        <span>{service.format}</span>
      </div>
      <h3 className={styles.cardTitle}>
        {service.title.lead}
        {service.title.serif && <> <span className={styles.serif}>{service.title.serif}</span></>}
      </h3>
      <p className={styles.serviceFor}>For {service.audience}</p>
      <p className={styles.cardDesc}>{service.summary}</p>
      <ul className={styles.includes}>
        {service.includes.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <a className={styles.serviceFoot} href={serviceEnquiry(service)}>
        <span className={styles.price}>{priceLabel(service.price)}</span>
        <span className={styles.enquire}>Enquire <Arrow /></span>
      </a>
    </article>
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
              <span>{site.location} · <em>{site.availability}</em></span>
              <span>Simon@<em>trc</em></span>
            </div>

            <h1 className={styles.heroTitle} id="hero-title">
              Small machines,<span className={styles.and}>&mdash;</span>
              <span className={styles.serif}>large</span> ideas.
            </h1>

            <p className={styles.heroLede}>
              Tiny Robot Company is the independent AI studio of <span className={styles.hl}>Simon Holmes, PhD</span>.
              I help companies in any industry work out where AI pays, then <span className={styles.hl}>architect,
              build and teach it</span>, from strategy to shipped code. On the side: small machines that think.
            </p>

            <ul className={styles.offerChips} aria-label="Services">
              {["AI consulting", "Architecture", "Design & build", "Fractional head of AI", "Training", "Hardware"].map((s) => (
                <li key={s}><a href="#services">{s}</a></li>
              ))}
            </ul>

            <div className={styles.heroActions}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="#services">
                Services &amp; prices <RightArrow />
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href={INTRO_CALL}>
                Book a free intro call
              </a>
            </div>
          </div>

          <div className={styles.heroStage}>
            <Mascot />
          </div>
        </section>

        {/* -------------------- SERVICES -------------------- */}
        <section className={styles.section} id="services" aria-labelledby="services-h">
          <div className={styles.sectionHead}>
            <div className={styles.sectionNo}><em>§ 01</em> · For companies</div>
            <h2 className={styles.sectionTitle} id="services-h">
              AI that ships, <span className={styles.serif}>not slideshows</span>.
            </h2>
            <div className={styles.sectionCount}>{services.length} ways to work together</div>
          </div>

          <div className={styles.services}>
            {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}

            <aside className={`${styles.service} ${styles.rateCard}`} aria-label="Rates and terms">
              <div className={styles.cardLabel}>
                <span>Rate card</span>
                <span><em>{site.availability}</em></span>
              </div>
              <div className={styles.statValue}>
                {euro(DAY_RATE_EUR)}<span className={styles.unit}>/ day</span>
              </div>
              <dl className={styles.rateTerms}>
                <dt>VAT</dt>       <dd>Prices exclude VAT</dd>
                <dt>Base</dt>      <dd>{site.location} · {site.travel.toLowerCase()}</dd>
                <dt>Languages</dt> <dd>{site.languages.join(" · ")}</dd>
                <dt>Industries</dt><dd>All. Deepest in manufacturing</dd>
              </dl>
              <a className={`${styles.btn} ${styles.btnPrimary} ${styles.rateCta}`} href={INTRO_CALL}>
                Start with a free 30-min call <RightArrow />
              </a>
            </aside>
          </div>
        </section>

        {/* -------------------- TRACK RECORD -------------------- */}
        <section className={styles.section} id="record" aria-labelledby="record-h">
          <div className={styles.sectionHead}>
            <div className={styles.sectionNo}><em>§ 02</em> · Track record</div>
            <h2 className={styles.sectionTitle} id="record-h">
              Eight years building AI <span className={styles.serif}>that runs</span>.
            </h2>
            <div className={styles.sectionCount}>2018 → 2026</div>
          </div>

          <p className={styles.recordLede}>
            Before Tiny Robot Company, I founded and led the AI development function at {FORMER_EMPLOYER}:
            quality-control AI in production on the factory floor, multi-agent GenAI on Azure, and a team of 40
            across three countries. I also spent fifteen years in plant operations and finance, up to senior
            finance director, so I write the business case as well as the code.
          </p>

          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.statTile}>
                <div className={styles.statValue}>
                  {s.value}{s.unit && <span className={styles.unit}>{s.unit}</span>}
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
          <p className={styles.footnote}>
            Figures from in-house roles. The employer is not named for confidentiality.
          </p>

          {caseStudies.length > 0 && (
            <div className={styles.cases}>
              {caseStudies.map((c) => (
                <article key={c.id} className={styles.service}>
                  <div className={styles.cardLabel}><span>Case study · <em>{c.industry}</em></span></div>
                  <h3 className={styles.cardTitle}>{c.client}</h3>
                  {c.metric && <div className={styles.statValue}>{c.metric}</div>}
                  <p className={styles.cardDesc}><strong>Problem.</strong> {c.problem}</p>
                  <p className={styles.cardDesc}><strong>Outcome.</strong> {c.outcome}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* -------------------- WORKS -------------------- */}
        <section className={styles.section} id="works" aria-labelledby="works-h">
          <div className={styles.sectionHead}>
            <div className={styles.sectionNo}><em>§ 03</em> · The bench</div>
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
                <dt>Status</dt><dd>{site.availability}</dd>
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

            {/* AI Function, Standing Start — field work, links to the track record */}
            <a className={`${styles.card} ${styles.cardWide}`} href="#record">
              <div className={styles.cardLabel}>
                <span>TRC / 00 · <em>Before TRC</em></span>
                <span>Field</span>
              </div>
              <h3 className={styles.cardTitle}>AI Function, <span className={styles.serif}>Standing Start</span>.</h3>
              <p className={styles.cardDesc}>
                Founded and led an AI engineering function inside {FORMER_EMPLOYER}:
                architecture, hiring, delivery, and €30M+ in measurable value. No pilots
                that died in committee; this one runs.
              </p>
              <div className={styles.cardFoot}>
                <span>Head of AI · 0→40 team</span>
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
            <div className={styles.sectionNo}><em>§ 04</em> · About</div>
            <h2 className={styles.sectionTitle}>
              One operator, one <span className={styles.serif}>bench</span>.
            </h2>
            <div className={styles.sectionCount}>2026 —</div>
          </div>

          <div className={styles.statementBody}>
            <p className={styles.statementQuote}>
              <span className={styles.mute}>Before the bench,</span> fifteen years inside factories and their finances,
              and eight <span className={styles.serif}>leading AI engineering</span> at a global automotive supplier.
              <span className={styles.mute}> Shipping software</span> that ran in production, not in slideshows.
              <br />
              <br />
              <span className={styles.mute}>Tiny Robot Company</span> is what happens when that same discipline gets
              pointed at two things:
              <span className={styles.serif}> AI that companies need built properly</span>
              <span className={styles.mute}>, not just talked about,</span> and
              <span className={styles.serif}> small, self-contained machines</span>.
            </p>

            <dl className={styles.statementMeta}>
              <dt>Name</dt>            <dd>{site.owner}</dd>
              <dt>Role</dt>            <dd>AI architect, engineer and teacher</dd>
              <dt>Base</dt>            <dd>{site.location} · {site.travel.toLowerCase()}</dd>
              <dt>Languages</dt>       <dd>{site.languages.join(" · ")}</dd>
              <dt>Available</dt>       <dd>{site.availability}</dd>
              <dt>Education</dt>       <dd>PhD, University of Cambridge</dd>
              <dt>Preferred brief</dt> <dd>Small, weird, well-defined.</dd>
            </dl>
          </div>
        </section>

        {/* -------------------- CONTACT -------------------- */}
        <section className={styles.section} id="signal">
          <div className={styles.contactInner}>
            <div>
              <div className={styles.sectionNo} style={{ marginBottom: "1.25rem" }}>
                <em>§ 05</em> · Contact
              </div>
              <h2 className={styles.contactH2}>
                Have something big or small<br />
                that needs to <span className={styles.serif}>think,</span>
                <span className={styles.serif}> move</span> or{" "}
                <span className={styles.serif}>scale</span>?
              </h2>
              <p className={styles.contactLede}>
                Briefs are read the same day. Fit-check reply within two working days,
                prototype within four weeks where the scope allows. Now {site.availability.toLowerCase()}.
              </p>
              <p className={styles.contactLede} lang="fr">
                <em>Vous préférez le français ? Écrivez-moi en français.</em>
              </p>
            </div>

            <div className={styles.contactPanel}>
              <a className={styles.contactRow} href={INTRO_CALL}>
                <span className={styles.contactK}>Call</span>
                <span className={styles.contactV}>Book a free 30-min intro</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </a>
              <a className={styles.contactRow} href={`mailto:${EMAIL}`}>
                <span className={styles.contactK}>Mail</span>
                <span className={styles.contactV}>{EMAIL}</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </a>
              {socials.slice(0, 2).map((s) => (
                <a key={s.label} className={styles.contactRow} href={s.href} target="_blank" rel="me noopener noreferrer">
                  <span className={styles.contactK}>{s.label}</span>
                  <span className={styles.contactV}>{s.handle}</span>
                  <span className={styles.contactArrow}><Arrow /></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
