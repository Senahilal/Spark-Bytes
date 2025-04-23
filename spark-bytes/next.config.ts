import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment any of these blocks to enable additional features

  // Ignore ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow optimized images to be served from Firebase Storage
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },

  // Add other Next.js config options here
  // For example:
  // reactStrictMode: true,
  // swcMinify: true,
};

export default nextConfig;
