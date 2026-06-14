import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — produces a fully static `out/` directory that Cloudflare
  // Pages serves directly (no server runtime needed). The app uses no server
  // features (no API routes, server actions, middleware or runtime data).
  output: "export",
  images: {
    // The export target has no Image Optimization server.
    unoptimized: true,
  },
  // Emit /path/index.html so Cloudflare Pages resolves clean URLs reliably.
  trailingSlash: true,
};

export default nextConfig;
