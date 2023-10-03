/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  basePath: isProd ? "/token-converter" : undefined,
};

module.exports = nextConfig;
