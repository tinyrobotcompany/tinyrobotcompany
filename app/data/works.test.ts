import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { betaMailto, enquiryMailto, fullName, getWork, repoUrl, works } from "./works";

const publicFile = (src: string) => join(process.cwd(), "public", src);

describe("works data", () => {
  it("has unique slugs and catalogue numbers", () => {
    expect(new Set(works.map((w) => w.slug)).size).toBe(works.length);
    expect(new Set(works.map((w) => w.no)).size).toBe(works.length);
  });

  it("uses URL-safe slugs", () => {
    for (const w of works) expect(w.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(works.map((w) => [w.slug, w] as const))("%s has complete content", (_slug, w) => {
    expect(w.tagline.length).toBeGreaterThan(10);
    expect(w.summary.length).toBeGreaterThan(20);
    expect(w.intro.length).toBeGreaterThanOrEqual(1);
    expect(w.highlights).toHaveLength(4);
    expect(w.flow).toHaveLength(3);
    expect(w.stack.length).toBeGreaterThan(0);
    expect(w.fallbackVersion).toMatch(/^v\d+\.\d+\.\d+$/);
  });

  it.each(works.map((w) => [w.slug, w] as const))("%s references images that exist", (_slug, w) => {
    if (w.icon) expect(existsSync(publicFile(w.icon)), w.icon).toBe(true);
    if (w.visual?.kind === "screen") expect(existsSync(publicFile(w.visual.src)), w.visual.src).toBe(true);
    if (w.visual?.kind === "family") {
      for (const c of w.visual.characters) expect(existsSync(publicFile(c.src)), c.src).toBe(true);
    }
  });

  it("only offers beta access for TestFlight apps", () => {
    for (const w of works) expect(Boolean(w.beta)).toBe(w.stage === "TestFlight beta");
  });

  it("looks works up by slug", () => {
    expect(getWork("voxa")?.name.lead).toBe("Voxa");
    expect(getWork("does-not-exist")).toBeUndefined();
  });
});

describe("works helpers", () => {
  const dg = getWork("deja-groove")!;
  const pico = getWork("pico-pie")!;

  it("joins two-part names with a space", () => {
    expect(fullName(dg)).toBe("Déjà Groove");
    expect(fullName(getWork("tempo")!)).toBe("Tempo");
  });

  it("builds GitHub repo URLs", () => {
    expect(repoUrl(pico)).toBe("https://github.com/tinyrobotcompany/Pico_Pie");
  });

  it("builds an encoded beta-access email", () => {
    const url = new URL(betaMailto(dg));
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("hello@tinyrobotcompany.io");
    expect(url.searchParams.get("subject")).toBe("Beta access: Déjà Groove");
    expect(url.searchParams.get("body")).toContain("TestFlight");
  });

  it("builds a hardware enquiry email", () => {
    const url = new URL(enquiryMailto(pico));
    expect(url.searchParams.get("subject")).toBe("Enquiry: Pico Pie");
  });
});
