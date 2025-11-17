import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/token-converter",
  assetPrefix: "/token-converter/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
