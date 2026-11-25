import Link from "next/link";
import type { Metadata } from "next";
import base from "../page.module.css";
import work from "../works/[slug]/work.module.css";
import { RightArrow } from "../components/Icons";
import { NewsletterForm } from "../components/NewsletterForm";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { Spotlight } from "../components/Spotlight";

export const metadata: Metadata = {
  title: "The Weekly Brief",
  description:
    "The week's most important AI and robotics news, explained simply, and what it means for your business. Free, every Monday.",
};

export default function Newsletter() {
  return (
    <>
      <Spotlight />
      <SiteHeader />

      <main id="top" className={base.wrap}>
        <Link className={work.back} href="/blog/">
          <RightArrow flip /> The blog
        </Link>

        <section className={work.head} aria-labelledby="newsletter-title">
          <div className={work.meta}>
            <span>Every <em>Monday</em></span>
            <span>AI &amp; robotics</span>
            <span>Free · <em>no spam</em></span>
          </div>
          <div className={work.titleRow}>
            <h1 className={work.title} id="newsletter-title">
              The Weekly <span>Brief</span>.
            </h1>
          </div>
          <p className={work.lede}>
            AI and robotics move every week. Each Monday you get the few developments that actually matter,
            explained in plain English, and what they mean for your business. No hype, no jargon. Five minutes to
            read.
          </p>
        </section>

        <section className={base.section} style={{ paddingTop: 0 }} aria-label="Subscribe">
          <NewsletterForm />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
