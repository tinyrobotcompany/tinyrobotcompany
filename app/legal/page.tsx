import type { Metadata } from "next";
import { Field, LegalPage } from "../components/LegalPage";
import { legal, site } from "../data/site";

export const metadata: Metadata = {
  title: "Legal notice",
  description: "Legal notice (mentions légales / Impressum) for tinyrobotcompany.io.",
};

export default function LegalNotice() {
  return (
    <LegalPage
      kicker="Legal · Mentions légales · Impressum"
      title="Legal notice"
      updated={legal.lastUpdated}
      notice={
        <>
          {site.name} is in the process of being set up as a company. Registration details below are
          placeholders and will be completed as soon as registration is final. Until then, the site is
          published by {legal.publisher} as an individual.
        </>
      }
    >
      <h2>Publisher<small>Éditeur du site · Anbieter</small></h2>
      <dl>
        <dt>Trading name</dt>   <dd>{site.name}</dd>
        <dt>Published by</dt>   <dd>{legal.publisher}</dd>
        <dt>Legal form</dt>     <dd><Field value={legal.legalForm} /></dd>
        <dt>Registration</dt>   <dd><Field value={legal.registration} /></dd>
        <dt>VAT number</dt>     <dd><Field value={legal.vatNumber} /></dd>
        <dt>Share capital</dt>  <dd><Field value={legal.shareCapital} todo="If applicable, once registered" /></dd>
        <dt>Address</dt>        <dd><Field value={legal.address} /></dd>
        <dt>Email</dt>          <dd><a href={`mailto:${legal.email}`}>{legal.email}</a></dd>
      </dl>

      <h2>Publication director<small>Directeur de la publication · Verantwortlich für den Inhalt</small></h2>
      <p>{legal.publicationDirector}</p>

      <h2>Hosting<small>Hébergeur · Hosting</small></h2>
      <p>
        {legal.host.name}
        <br />
        {legal.host.address}
      </p>

      <h2>Intellectual property</h2>
      <p>
        Unless stated otherwise, the text, images, logo and mascot on this site belong to {site.name}.
        Please ask before reusing them. Source code in the linked GitHub repositories is covered by each
        repository&rsquo;s own licence.
      </p>

      <h2>Links to other sites</h2>
      <p>
        This site links to external services such as GitHub, LinkedIn and YouTube. {site.name} is not
        responsible for their content or their privacy practices.
      </p>

      <h2>Language</h2>
      <p>
        This site is published in English. You are welcome to write in any language; replies come in the same
        language.
      </p>

      <h2>Privacy</h2>
      <p>
        How personal data is handled is described in the <a href="/privacy/">privacy policy</a>.
      </p>
    </LegalPage>
  );
}
