import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/**",
      },
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
      },
      {
        protocol: "https",
        hostname: "cdn.jim-nielsen.com",
      },
      {
        protocol:"https",
        hostname:"sindresorhus.com"
      },
      {
        protocol:"https",
        hostname:"framerusercontent.com"
      },
      {
        protocol:"https",
        hostname:"e4iz70yuw6.ufs.sh"
      }
    ],
  },
};

export default nextConfig;
