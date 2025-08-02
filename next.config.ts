import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  devIndicators: false,
  images: {
    domains: ["https://bpvldhvcpcjqplujenfx.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bpvldhvcpcjqplujenfx.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
