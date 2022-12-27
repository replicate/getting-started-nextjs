/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["replicate.com", "replicate.delivery"],
  },
};

module.exports = nextConfig;
