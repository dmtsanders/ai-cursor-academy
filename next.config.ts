import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence Turbopack workspace root inference warning in monorepo
  experimental: {
    turbopack: {
      // Use this app directory as the root
      root: __dirname,
    },
  },
};

export default nextConfig;
