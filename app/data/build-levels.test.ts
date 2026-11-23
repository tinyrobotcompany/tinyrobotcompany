import { describe, expect, it } from "vitest";
import { DAY_RATE_EUR } from "./site";
import { BUILD_FROM_EUR, BUILD_MOBILE_NOTE, BUILD_TO_EUR, buildLevels, levelRate } from "./build-levels";

const plain = (s: string) => s.replace(/\s/g, " ");

describe("build levels", () => {
  it("are simple, medium and complex, in that order", () => {
    expect(buildLevels.map((l) => l.id)).toEqual(["simple", "medium", "complex"]);
  });

  it("charge about €600 for simple work and €800–1,200 above it", () => {
    const [simple, medium, complex] = buildLevels;
    expect(simple.min).toBe(600);
    expect(medium.min).toBeGreaterThanOrEqual(800);
    expect(complex.max).toBeLessThanOrEqual(1200);
    expect([BUILD_FROM_EUR, BUILD_TO_EUR]).toEqual([600, 1200]);
  });

  it("go up without overlapping, and stay below the advisory rate", () => {
    for (const l of buildLevels) expect(l.max, l.id).toBeGreaterThanOrEqual(l.min);
    for (let i = 1; i < buildLevels.length; i++) expect(buildLevels[i].min).toBeGreaterThan(buildLevels[i - 1].max);
    expect(BUILD_TO_EUR).toBeLessThan(DAY_RATE_EUR);
  });

  it("keep AI out of simple work: AI is what moves work up a level", () => {
    const ai = /\bAI\b|model|agent|RAG|machine.learning|vision/i;
    const [simple, medium, complex] = buildLevels;
    expect(simple.examples.filter((x) => ai.test(x))).toEqual([]);
    expect(simple.summary).toMatch(/no AI/);
    expect(medium.examples.some((x) => ai.test(x))).toBe(true);
    expect(complex.examples.filter((x) => ai.test(x)).length).toBeGreaterThanOrEqual(3);
  });

  it("format single rates and ranges", () => {
    expect(buildLevels.map((l) => plain(levelRate(l)))).toEqual(["€600 / day", "€800–900 / day", "€1,000–1,200 / day"]);
  });

  it("cover iOS and Android apps at every level", () => {
    for (const l of buildLevels) expect(l.examples.some((x) => /mobile|iOS|Android/i.test(x)), l.id).toBe(true);
  });

  it("explain what a second platform and store release add", () => {
    expect(BUILD_MOBILE_NOTE).toMatch(/SwiftUI/);
    expect(BUILD_MOBILE_NOTE).toMatch(/second platform adds about 60–80%/);
    expect(BUILD_MOBILE_NOTE).toMatch(/App Store or Google Play takes 1–2 days per store, at the simple rate/);
  });

  it("only name apps that are on the site", async () => {
    const { fullName, works } = await import("./works");
    const names = new Set(works.map(fullName));
    for (const x of buildLevels.flatMap((l) => l.examples))
      for (const m of x.matchAll(/like (.+?) and (.+)$/g))
        for (const n of [m[1], m[2]]) expect(names.has(n), n).toBe(true);
  });
});
