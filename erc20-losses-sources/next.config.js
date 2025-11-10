/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath: isProd ? "/erc20-losses" : undefined,
};

module.exports = nextConfig;
