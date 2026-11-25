import { posts } from "../data/blog";
import { site } from "../data/site";

const ORIGIN = "https://www.tinyrobotcompany.io";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function rssFeed() {
  const items = posts
    .map((p) => {
      const url = `${ORIGIN}/blog/${p.slug}/`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.name)} · Blog</title>
    <link>${ORIGIN}/blog/</link>
    <description>Build notes from the Tiny Robot Company bench.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}
