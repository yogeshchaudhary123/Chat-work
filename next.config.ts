import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */  
  srcDir: "src",
  experimental: {
    typedRoutes: true
  },
  devIndicators: false
};

export default nextConfig;
