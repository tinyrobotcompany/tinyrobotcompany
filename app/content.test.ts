/**
 * Content guards: checks over the site's source text that catch the kind
 * of mistakes a reviewer would (stale facts, dead links, leaked names).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const files = sourceFiles(join(ROOT, "app")).map((path) => ({
  path: relative(ROOT, path),
  text: readFileSync(path, "utf8"),
}));

const occurrences = (pattern: RegExp) =>
  files.filter((f) => pattern.test(f.text)).map((f) => f.path);

describe("confidentiality", () => {
  it("never names the former employer", () => {
    expect(occurrences(/forvia|faurecia|siemens/i)).toEqual([]);
  });

  it("never publishes personal contact details", () => {
    expect(occurrences(/gmail\.com|\+33\s?6/i)).toEqual([]);
  });
});

describe("stale or inconsistent facts", () => {
  it("has no leftover placeholder projects", () => {
    expect(occurrences(/Signal Sketchbook|Small Voice|Servo Loom|Retina Kit/)).toEqual([]);
  });

  it("states one location (Paris), not Brussels", () => {
    expect(occurrences(/Brussels/)).toEqual([]);
  });

  it("has no dated availability like 'Q4 2026' or '2 slots'", () => {
    expect(occurrences(/Q4 2026|2 slots|2 \/ Q4/)).toEqual([]);
  });
});

describe("links", () => {
  it("has no dead '#' links", () => {
    expect(occurrences(/href="#"/)).toEqual([]);
  });

  it("opens external links safely", () => {
    for (const f of files) {
      for (const tag of f.text.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) {
        expect(tag, f.path).toMatch(/rel="[^"]*noopener[^"]*"/);
      }
    }
  });
});

describe("canonical domain", () => {
  it("uses www for absolute site URLs (the bare domain's redirect drops the path)", () => {
    expect(occurrences(/https:\/\/tinyrobotcompany\.io/)).toEqual([]);
  });
});
