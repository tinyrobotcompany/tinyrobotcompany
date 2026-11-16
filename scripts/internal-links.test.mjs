import { describe, expect, it } from "vitest";
import { internalLinks } from "./internal-links.mjs";

describe("internalLinks", () => {
  it("collects page links, normalised with a trailing slash", () => {
    const html = `
      <a href="/works/voxa">Voxa</a>
      <a href="/legal/">Legal</a>
      <a href="/#services">Services</a>
      <a href="/privacy?x=1">Privacy</a>`;
    expect(internalLinks(html)).toEqual(["/", "/legal/", "/privacy/", "/works/voxa/"]);
  });

  it("ignores external, mail, asset and build links", () => {
    const html = `
      <a href="https://github.com/x">GitHub</a>
      <a href="mailto:hello@example.com">Mail</a>
      <link href="/_next/static/chunks/app.css">
      <img href="/works/voxa-icon.webp">
      <a href="#top">Top</a>`;
    expect(internalLinks(html)).toEqual(["/"]);
  });
});
