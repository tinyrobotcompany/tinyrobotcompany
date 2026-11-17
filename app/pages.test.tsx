import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import LegalNotice from "./legal/page";
import Privacy from "./privacy/page";
import Join from "./join/page";
import { works } from "./data/works";
import { legal, socials } from "./data/site";

describe("site chrome", () => {
  const footer = renderToStaticMarkup(<SiteFooter />);
  const header = renderToStaticMarkup(<SiteHeader />);

  it("links the legal notice and privacy policy from every page", () => {
    expect(footer).toContain('href="/legal"');
    expect(footer).toContain('href="/privacy"');
  });

  it("links every social channel, including LinkedIn", () => {
    for (const s of socials) expect(footer).toContain(`href="${s.href}"`);
    expect(footer).toContain("linkedin.com/in/simon-holmes-phd");
  });

  it("puts Services first in the navigation", () => {
    const order = ["/#services", "/#record", "/#works", "/#signal"].map((h) => header.indexOf(`href="${h}"`));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
});

describe("legal notice", () => {
  const html = renderToStaticMarkup(<LegalNotice />);

  it("names the publisher, publication director and host", () => {
    expect(html).toContain(legal.publisher);
    expect(html).toContain(legal.host.name);
    expect(html).toMatch(/Publication director/);
  });

  it("shows explicit placeholders for registration details not yet known", () => {
    const missing = [legal.legalForm, legal.registration, legal.vatNumber, legal.address].filter((v) => v === null);
    const placeholders = html.match(/To be completed once the company is registered/g) ?? [];
    expect(placeholders.length).toBe(missing.length);
  });
});

describe("privacy policy", () => {
  const html = renderToStaticMarkup(<Privacy />);

  it("states there are no cookies or analytics", () => {
    expect(html).toMatch(/no cookies/i);
  });

  it("explains client-data handling and GDPR rights", () => {
    expect(html).toContain("Client data in AI work");
    expect(html).toContain("CNIL");
  });
});

describe("join page", () => {
  const html = renderToStaticMarkup(<Join />);

  it("lists every product, with consent and a privacy link", () => {
    for (const w of works) expect(html).toContain(`value="${w.slug}"`);
    expect(html).toContain('name="consent"');
    expect(html).toContain('href="/privacy/"');
  });
});

describe("privacy policy covers sign-ups", () => {
  it("explains the waitlist and beta form", () => {
    expect(renderToStaticMarkup(<Privacy />)).toContain("Waitlists and betas");
  });
});
