import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
};

export default nextConfig;
