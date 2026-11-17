import { rssFeed } from "../../lib/rss";

// Static export: prerendered at build time into out/log/feed.xml.
export const dynamic = "force-static";

export function GET() {
  return new Response(rssFeed(), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
