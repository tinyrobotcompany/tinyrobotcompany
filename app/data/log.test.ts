import { describe, expect, it } from "vitest";
import { allPosts, formatDate, getPost, posts, postsForWork } from "./log";
import { getWork } from "./works";
import { rssFeed } from "../lib/rss";

describe("log posts", () => {
  it("have unique, URL-safe slugs", () => {
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
    for (const p of posts) expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("have valid dates, newest first", () => {
    for (const p of posts) expect(Number.isNaN(Date.parse(p.date))).toBe(false);
    const dates = posts.map((p) => p.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("only link to projects that exist", () => {
    for (const p of posts) for (const slug of p.works) expect(getWork(slug), `${p.slug} → ${slug}`).toBeDefined();
  });

  it("have a summary and a body", () => {
    for (const p of posts) {
      expect(p.summary.length).toBeGreaterThan(40);
      expect(p.body.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("finds posts by slug and by project", () => {
    expect(getPost(posts[0].slug)).toBe(posts[0]);
    expect(postsForWork("voxa").length).toBeGreaterThan(0);
  });

  it("leaves hidden posts out of the Log, the pages and the feed", () => {
    const hidden = allPosts.filter((p) => p.hidden);
    expect(hidden.length).toBeGreaterThan(0);
    for (const p of hidden) {
      expect(getPost(p.slug)).toBeUndefined();
      expect(rssFeed()).not.toContain(`/log/${p.slug}/`);
    }
  });

  it("formats dates in British English", () => {
    expect(formatDate("2026-11-17")).toBe("17 November 2026");
  });
});

describe("RSS feed", () => {
  const xml = rssFeed();

  it("lists every post with an absolute www link", () => {
    for (const p of posts) expect(xml).toContain(`<link>https://www.tinyrobotcompany.io/log/${p.slug}/</link>`);
  });

  it("escapes XML special characters", () => {
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });
});
