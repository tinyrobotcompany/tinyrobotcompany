// Fails the build if any page the home page links to is missing from the
// static export. Usage: node scripts/check-export.mjs out
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { internalLinks } from "./internal-links.mjs";

const outDir = process.argv[2] ?? "out";
const home = readFileSync(join(outDir, "index.html"), "utf8");
const missing = internalLinks(home).filter((p) => !existsSync(join(outDir, p, "index.html")));

for (const p of internalLinks(home)) console.log(`${missing.includes(p) ? "MISSING" : "ok     "} ${p}`);
if (missing.length) {
  console.error(`\n${missing.length} linked page(s) were not exported.`);
  process.exit(1);
}
