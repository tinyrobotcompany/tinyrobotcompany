// After deploy: every page the live home page links to must return 200.
// Retries for a short while because a fresh SWA deploy can take a moment
// to propagate. Usage: node scripts/smoke-test.mjs https://www.example.com
import { internalLinks } from "./internal-links.mjs";

const base = (process.argv[2] ?? "").replace(/\/$/, "");
if (!base) throw new Error("Pass the site origin, e.g. https://www.tinyrobotcompany.io");

const ATTEMPTS = 10;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function status(path) {
  const res = await fetch(base + path, { redirect: "follow", cache: "no-store" });
  return res.status;
}

let failures = [];
for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const home = await (await fetch(`${base}/`, { cache: "no-store" })).text();
  const paths = internalLinks(home);
  const results = await Promise.all(paths.map(async (p) => [p, await status(p)]));
  failures = results.filter(([, s]) => s !== 200);
  if (!failures.length) {
    for (const [p, s] of results) console.log(`${s} ${p}`);
    process.exit(0);
  }
  console.log(`Attempt ${attempt}/${ATTEMPTS}: ${failures.map(([p, s]) => `${s} ${p}`).join(", ")}`);
  await wait(15_000);
}
console.error("Live site still has broken pages after deploy.");
process.exit(1);
