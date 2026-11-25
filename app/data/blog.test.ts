import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { allPosts, formatDate, getPost, posts, postsForWork } from "./blog";
import { getWork } from "./works";
import { rssFeed } from "../lib/rss";

describe("blog posts", () => {
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

  it("leaves hidden posts out of the blog, the pages and the feed", () => {
    const hidden = allPosts.filter((p) => p.hidden);
    expect(hidden.length).toBeGreaterThan(0);
    for (const p of hidden) {
      expect(getPost(p.slug)).toBeUndefined();
      expect(rssFeed()).not.toContain(`/blog/${p.slug}/`);
    }
  });

  it("formats dates in British English", () => {
    expect(formatDate("2026-11-17")).toBe("17 November 2026");
  });
});

describe("RSS feed", () => {
  const xml = rssFeed();

  it("lists every post with an absolute www link", () => {
    for (const p of posts) expect(xml).toContain(`<link>https://www.tinyrobotcompany.io/blog/${p.slug}/</link>`);
  });

  it("escapes XML special characters", () => {
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });
});

describe("old /log/ addresses", () => {
  type Route = { route: string; redirect?: string; statusCode?: number };
  const routes: Route[] = JSON.parse(readFileSync("public/staticwebapp.config.json", "utf8")).routes ?? [];
  const target = (path: string) => routes.find((r) => r.route === path);

  it("redirect every post to its /blog/ page", () => {
    for (const p of posts) expect(target(`/log/${p.slug}*`)).toEqual({ route: `/log/${p.slug}*`, redirect: `/blog/${p.slug}/`, statusCode: 301 });
  });

  it("redirect the feed and the index, after the posts", () => {
    expect(target("/log/feed.xml")?.redirect).toBe("/blog/feed.xml");
    expect(target("/log/*")?.redirect).toBe("/blog/");
    expect(target("/log")?.redirect).toBe("/blog/");
    const catchAll = routes.findIndex((r) => r.route === "/log/*");
    for (const p of posts) expect(routes.findIndex((r) => r.route === `/log/${p.slug}*`)).toBeLessThan(catchAll);
  });
});
