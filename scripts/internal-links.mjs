/**
 * Internal page links found in a page's HTML: root-relative hrefs, without
 * hashes, query strings, assets or mail links. Shared by the export check
 * and the live smoke test so both cover exactly the pages the site links to.
 */
export function internalLinks(html) {
  const paths = new Set(["/"]);
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    if (href.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(href)) continue;
    paths.add(href.endsWith("/") ? href : `${href}/`);
  }
  return [...paths].sort();
}
