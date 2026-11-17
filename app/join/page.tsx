import Link from "next/link";
import type { Metadata } from "next";
import base from "../page.module.css";
import work from "../works/[slug]/work.module.css";
import { RightArrow } from "../components/Icons";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SignupForm } from "../components/SignupForm";
import { Spotlight } from "../components/Spotlight";
import { signupForm } from "../data/site";
import { works } from "../data/works";
import { signupProducts } from "../lib/signup";

export const metadata: Metadata = {
  title: "Waitlists & betas",
  description: "Join the iPhone betas for Voxa and Déjà Groove, or the waitlist for Pico Pie, Tempo and Waveform One.",
};

export default function Join() {
  const products = signupProducts(works);
  const betas = products.filter((p) => p.list === "beta").length;
  const devices = products.length - betas;

  return (
    <>
      <Spotlight />
      <SiteHeader />

      <main id="top" className={base.wrap}>
        <Link className={work.back} href="/#works">
          <RightArrow flip /> The bench
        </Link>

        <section className={work.head} aria-labelledby="join-title">
          <div className={work.meta}>
            <span><em>{betas}</em> app betas</span>
            <span><em>{devices}</em> devices in the making</span>
            <span>Free · <em>no spam</em></span>
          </div>
          <div className={work.titleRow}>
            <h1 className={work.title} id="join-title">
              Get on <span>the list</span>.
            </h1>
          </div>
          <p className={work.lede}>
            Try the apps before anyone else, or be first to hear when a device is ready to buy or build. One form
            for all of it: pick what you like.
          </p>
        </section>

        <section className={base.section} style={{ paddingTop: 0 }} aria-label="Sign-up form">
          <SignupForm products={products} endpoint={signupForm.endpoint} accessKey={signupForm.accessKey} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
