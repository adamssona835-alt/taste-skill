import type { NextConfig } from "next";

const config: NextConfig = {
  // Fully static: deployable to any CDN. Clean URLs via trailing-slash folders.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
