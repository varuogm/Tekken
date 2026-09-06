import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "us-east-1-bandai.graphassets.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
