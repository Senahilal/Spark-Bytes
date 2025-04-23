import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    //Ignoring ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
