import type { NextConfig } from "next";

/**
 * Fully static export. Azure Static Web Apps serves the files in `out/`
 * directly — no Node server, no hybrid-mode preview runtime. (Hybrid mode
 * built fine but served 404s for /works/* in production.)
 *
 * trailingSlash emits /works/voxa/index.html so every route resolves as a
 * plain folder on any static host.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
