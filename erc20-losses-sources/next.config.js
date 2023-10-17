/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  basePath: isProd ? "/erc20-losses" : undefined,
};

module.exports = nextConfig;
