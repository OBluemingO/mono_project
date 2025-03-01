import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:8000'],
    },
  },
};

export default nextConfig;
