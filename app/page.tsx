import { Fragment } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Mascot } from "./components/Mascot";
import { Spotlight } from "./components/Spotlight";
import { Ticker } from "./components/Ticker";
import { Arrow, RightArrow, SocialIcon } from "./components/Icons";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { AppIcon, CharacterPlate, FlowStrip } from "./components/WorkVisuals";
import { capacity, DAY_RATE_EUR, EMAIL, euro, introCallLink, site, socials } from "./data/site";
import { IntroCallLink } from "./components/IntroCallLink";
import { priceLabel, serviceAnchor, serviceCta, services, serviceTitle, starters, tierValue, type Service } from "./data/services";
import { BUILD_FROM_EUR, BUILD_MOBILE_NOTE, BUILD_PRICING_RULE, BUILD_RANGE_NOTE, BUILD_TO_EUR, buildLevels, levelRate } from "./data/build-levels";
import { caseStudies, FORMER_EMPLOYER, stats, testimonials } from "./data/track-record";
import { sectorExamples } from "./data/sectors";
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
      <p className={styles.cardStatusLine}>{work.status.availability}</p>
      <div className={styles.cardFoot}>
        <span>{work.stack.slice(0, 3).join(" · ")}</span>
        <span className={styles.cardArrow}><Arrow /></span>
      </div>
    </Link>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cta = serviceCta(service);
  return (
    <article className={styles.service} id={serviceAnchor(service)}>
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
      {service.tiers && (
        <dl className={styles.tiers}>
          {service.tiers.map((t) => (
            <div key={t.label} className={styles.tier}>
              <dt>{t.label}</dt>
              <dd>{tierValue(t)}</dd>
            </div>
          ))}
        </dl>
      )}
      <IntroCallLink className={styles.serviceFoot} link={cta}>
        <span className={styles.price}>{priceLabel(service.price)}</span>
        <span className={styles.enquire}>{cta.external ? "Book a call" : cta.label} <Arrow /></span>
      </IntroCallLink>
    </article>
  );
}

export default async function Home() {
  const versions = await latestVersions(works);
  const w = (slug: string) => getWork(slug)!;
  const featured = w("voxa");

  return (
    <>
      <Spotlight />
      <SiteHeader />

      <Ticker />

      <main id="top" className={styles.wrap}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <div className={styles.heroMeta}>
              <span><span className={styles.liveDot} aria-hidden="true" /> Consulting · <em>{site.availability}</em></span>
              <span>{site.location} <em>→ anywhere</em></span>
              <span><a className={styles.heroMail} href={`mailto:${EMAIL}`}>{EMAIL}</a></span>
            </div>

            <h1 className={styles.heroTitle} id="hero-title">
              Small studio.<br />
              Serious AI, <span className={`${styles.serif} ${styles.nowrap}`}>built to work.</span>
            </h1>

            <p className={styles.heroLede}>
              Tiny Robot Company is the independent AI studio of <span className={styles.hl}>Dr Simon Holmes</span>.
              I help companies work out where AI pays, then <span className={styles.hl}>design, build and run it</span>{" "}
              with them and <span className={styles.hl}>get their teams using it</span>, from strategy to production code, on whichever cloud you already use. My own apps and
              devices are where I test my ideas in public.
            </p>

            <ul className={styles.offerChips} aria-label="Services">
              {services.map((s) => (
                <li key={s.id}><a href={`#${serviceAnchor(s)}`}>{s.chip}</a></li>
              ))}
            </ul>

            <div className={styles.heroActions}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="#services">
                Services &amp; prices <RightArrow />
              </a>
              <IntroCallLink className={`${styles.btn} ${styles.btnGhost}`}>
                Book a free intro call
              </IntroCallLink>
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
                <span><em>Priced by the work</em></span>
              </div>
              <div className={styles.statValue}>
                <span className={styles.unitLead}>from</span>{euro(BUILD_FROM_EUR)}<span className={styles.unit}>/ day</span>
              </div>
              <dl className={`${styles.rateTerms} ${styles.rateStarters}`}>
                <dt>Building</dt>
                <dd>
                  <a className={styles.rateLink} href="#build-levels">
                    {euro(BUILD_FROM_EUR)}–{euro(BUILD_TO_EUR).replace("€", "")} / day, by complexity
                  </a>
                </dd>
                <dt>Advice</dt> <dd>{euro(DAY_RATE_EUR)} / day: strategy, reviews, training</dd>
              </dl>
              <dl className={`${styles.rateTerms} ${styles.rateStarters}`}>
                {starters.map((x) => (
                  <Fragment key={x.label}>
                    <dt>{x.label}</dt>
                    <dd>
                      <a className={styles.rateLink} href={`#${x.anchor}`}>
                        {x.detail} · {x.from ? "from " : ""}{euro(x.eur)}
                      </a>
                    </dd>
                  </Fragment>
                ))}
              </dl>
              <dl className={styles.rateTerms}>
                <dt>VAT</dt>       <dd>Prices exclude VAT</dd>
                <dt>Base</dt>      <dd>{site.location} · {site.travel.toLowerCase()}</dd>
                <dt>Languages</dt> <dd>{site.languageLine}</dd>
                <dt>Cloud</dt>     <dd>Cloud-agnostic: AWS, Azure or Google Cloud</dd>
                <dt>Capacity</dt>  <dd>Max. {capacity.maxClients} clients at a time</dd>
              </dl>
              <a className={styles.rateProof} href="#record">
                Track record: {stats[0].value}{stats[0].unit} delivered, {stats[1].value} saved <RightArrow />
              </a>
              <IntroCallLink className={`${styles.btn} ${styles.btnPrimary} ${styles.rateCta}`}>
                Start with a free 30-min call <RightArrow />
              </IntroCallLink>
            </aside>
          </div>

          <p className={styles.capacity}>
            <span className={styles.capacityK}>Capacity</span>
            At most {capacity.maxClients} clients at a time, so each one gets real attention. {capacity.partners}{" "}
            {capacity.subcontracting}
          </p>

          <div className={`${styles.sectorsHead} ${styles.anchorTarget}`} id="build-levels">
            <h3 className={styles.sectorsTitle}>How building is <span className={styles.serif}>priced</span></h3>
            <p className={styles.sectorsNote}>
              Advice and training: {euro(DAY_RATE_EUR)} / day. Building: by complexity, and AI is what moves it up.
            </p>
          </div>
          <div className={styles.sectors}>
            {buildLevels.map((l, i) => (
              <article key={l.id} className={styles.service}>
                <div className={styles.cardLabel}>
                  <span>{String(i + 1).padStart(2, "0")} · <em>Build level</em></span>
                </div>
                <h4 className={styles.cardTitle}>
                  {l.name} <span className={styles.serif}>{levelRate(l)}</span>
                </h4>
                <p className={styles.cardDesc}>{l.summary}</p>
                <ul className={styles.includes}>
                  {l.examples.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <p className={styles.capacity}>
            <span className={styles.capacityK}>Quotes</span>
            {BUILD_PRICING_RULE} {BUILD_RANGE_NOTE}
          </p>
          <p className={styles.capacity}>
            <span className={styles.capacityK}>Mobile</span>
            {BUILD_MOBILE_NOTE}
          </p>

          <div className={styles.sectorsHead}>
            <h3 className={styles.sectorsTitle}>What it could look like <span className={styles.serif}>in your sector</span></h3>
            <p className={styles.sectorsNote}>Illustrative examples of how the services apply, not client case studies.</p>
          </div>
          <div className={styles.sectors}>
            {sectorExamples.map((x) => (
              <article key={x.id} className={styles.service}>
                <div className={styles.cardLabel}>
                  <span>Example · <em>{x.sector}</em></span>
                </div>
                <h4 className={styles.cardTitle}>{x.title}</h4>
                <dl className={styles.sectorBody}>
                  <dt>The situation</dt><dd>{x.situation}</dd>
                  <dt>What I&rsquo;d build</dt><dd>{x.build}</dd>
                </dl>
                <div className={styles.cardFoot}>
                  <span>Start with: {x.startWith.map((id) => serviceTitle(services.find((s) => s.id === id)!)).join(" → ")}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* -------------------- TRACK RECORD -------------------- */}
        <section className={styles.section} id="record" aria-labelledby="record-h">
          <div className={styles.sectionHead}>
            <div className={styles.sectionNo}><em>§ 02</em> · Track record</div>
            <h2 className={styles.sectionTitle} id="record-h">
              Ten years building AI <span className={styles.serif}>that runs</span>.
            </h2>
          </div>

          <p className={styles.recordLede}>
            Before Tiny Robot Company, I founded and led the AI development function at {FORMER_EMPLOYER}:
            quality-control AI in production on the factory floor, multi-agent GenAI in production, and a team of 40
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

          {testimonials.length > 0 && (
            <div className={styles.quotes}>
              {testimonials.map((t) => (
                <figure key={t.name} className={styles.quote}>
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption>
                    <em>{t.name}</em> · {t.role} · {t.relationship}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

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
              R&amp;D, <span className={styles.serif}>in public</span>.
            </h2>
            <div className={styles.sectionCount}>{String(works.length).padStart(2, "0")} · on the bench · 2026</div>
          </div>

          <p className={styles.benchLede}>
            The apps and devices I build for myself, with the same tools and discipline I bring to client work:
            realtime voice, local-first apps, edge AI on small chips. The apps are heading for the App Store; the
            devices are working prototypes, and the code is public.
          </p>

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
              <div className={styles.cardHead}>
                {featured.icon && <AppIcon src={featured.icon} name={fullName(featured)} size={48} />}
                <WorkTitle work={featured} />
              </div>
              <p className={styles.cardDesc}>{featured.summary}</p>
              <p className={styles.cardStatusLine}>{featured.status.availability}</p>
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

            {/* Availability: the real facts a buyer needs, next to the work */}
            <IntroCallLink className={`${styles.card} ${styles.cardStatus} ${styles.cardSide}`}>
              <div className={styles.cardLabel}>
                <span>Availability</span>
                <span><em>{site.availability}</em></span>
              </div>
              <dl className={styles.statusGrid}>
                <dt>Intro call</dt><dd className={styles.statusUp}>Free · 30 min</dd>
                <dt>First reply</dt><dd>Within 2 working days</dd>
                <dt>Base</dt><dd>{site.location} → anywhere</dd>
              </dl>
              <div className={styles.cardFoot}>
                <span>Book a free intro call</span>
                <span className={styles.cardArrow}><Arrow /></span>
              </div>
            </IntroCallLink>

            <WorkCard work={w("deja-groove")} version={versions["deja-groove"]} className={styles.cardSide} />
            <WorkCard work={w("tempo")} version={versions.tempo} className={styles.cardHalf} />
            <WorkCard work={w("waveform-one")} version={versions["waveform-one"]} className={styles.cardHalf} />

            {/* AI Function, Standing Start — field work, links to the track record */}
            <a className={`${styles.card} ${styles.cardFull}`} href="#record">
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
          </div>

          <div className={styles.joinStrip}>
            <div>
              <div className={styles.joinTitle}>Want one?</div>
              <p className={styles.joinText}>
                The apps are in iPhone beta, coming soon to the App Store, with Android in development. The devices
                are prototypes. Join a beta, or get on the waitlist to hear first when one is ready.
              </p>
            </div>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} href="/join/">
              Join a waitlist or beta <RightArrow />
            </Link>
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
              <dt>Languages</dt>       <dd>{site.languageLine}</dd>
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
                prototype within four weeks where the scope allows. New projects can start from {site.nextStart}.
              </p>
              <p className={styles.contactLede}>
                Write in whichever language you&rsquo;re most comfortable with, and I&rsquo;ll reply in the same one
                using the translation built into <Link href="/works/voxa">Voxa</Link>, my language app.
              </p>
            </div>

            <div className={styles.contactPanel}>
              <IntroCallLink className={styles.contactRow}>
                <span className={styles.contactK}>Call</span>
                <span className={styles.contactV}>{introCallLink().external ? "Book a free 30-min intro" : "Ask for a free 30-min intro"}</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </IntroCallLink>
              <Link className={styles.contactRow} href="/join/">
                <span className={styles.contactK}>Products</span>
                <span className={styles.contactV}>Join a waitlist or beta</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </Link>
              <a className={styles.contactRow} href={`mailto:${EMAIL}`}>
                <span className={styles.contactK}>Mail</span>
                <span className={styles.contactV}>{EMAIL}</span>
                <span className={styles.contactArrow}><Arrow /></span>
              </a>
              <div className={styles.socialRow}>
                <span className={styles.contactK}>Follow</span>
                <ul className={styles.socialIcons}>
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        className={styles.socialIcon}
                        href={s.href}
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label={`${s.label} ${s.handle}`}
                        title={s.label}
                      >
                        <SocialIcon name={s.label} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
