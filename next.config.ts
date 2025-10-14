import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedRoutes: true
  },
  srcDir: "src",
  devIndicators: false
};

export default nextConfig;
