import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { legal, site } from "../data/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How tinyrobotcompany.io handles personal data, and how client data is handled in AI work.",
};

export default function Privacy() {
  return (
    <LegalPage
      kicker="Legal · GDPR"
      title="Privacy policy"
      updated={legal.lastUpdated}
      notice={
        <>
          Short version: this site sets no cookies, runs no analytics and loads no third-party trackers. If you
          email me, I use your message to reply, and that&rsquo;s it.
        </>
      }
    >
      <h2>Who is responsible</h2>
      <p>
        The data controller is {legal.publisher}, trading as {site.name}. Contact:{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>. Full details are in the{" "}
        <a href="/legal/">legal notice</a>.
      </p>

      <h2>Visiting this site</h2>
      <ul>
        <li>
          <strong>No cookies, analytics or tracking.</strong> Fonts and images are served from this site, so your
          browser doesn&rsquo;t contact Google or any other third party while you browse it.
        </li>
        <li>
          <strong>Theme preference.</strong> If you switch between light and dark mode, that choice is saved in your
          own browser (local storage). It is never sent anywhere.
        </li>
        <li>
          <strong>Server logs.</strong> Like every website, the hosting provider ({legal.host.name}) processes
          technical data such as your IP address and the pages requested, to deliver the site and keep it secure.
          The legal basis is legitimate interest (GDPR Art. 6(1)(f)). Microsoft&rsquo;s retention rules apply.
        </li>
      </ul>

      <h2>When you get in touch</h2>
      <p>
        If you email me, including through a &ldquo;request beta access&rdquo; or &ldquo;enquire&rdquo; link, I
        receive your name, email address and whatever you write. I use it only to reply, and to prepare a
        proposal or contract if you ask for one (GDPR Art. 6(1)(b) and (f)). It is not shared or sold, and is
        deleted within 24 months of our last exchange unless it must be kept longer for legal or accounting
        reasons. Beta testers&rsquo; email addresses are shared with Apple only to send the TestFlight invitation.
      </p>

      <h2>Client data in AI work</h2>
      <p>For consulting and development projects, client data is handled under a written agreement:</p>
      <ul>
        <li>Processed only for the agreed project, under confidentiality and, where needed, a data processing agreement (DPA).</li>
        <li>Hosted in EU cloud regions by default (for example Azure EU regions), unless you choose otherwise.</li>
        <li>Never used to train third-party models; AI providers are configured with training on customer data disabled.</li>
        <li>Returned or deleted at the end of the engagement.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct, delete or export your data, or object to or restrict its use, by emailing{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>. You also have the right to complain to the French data
        protection authority, the{" "}
        <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer">CNIL</a>, or to the authority where
        you live.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, the date at the top of this page changes with it.</p>
    </LegalPage>
  );
}
