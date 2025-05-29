import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore TypeScript build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint build errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        //  destination: "http://localhost:8082/api/:path*", // Proxy to backend if runned locally
        destination: "http://backend:8082/api/:path*", //proxy for backend if runned from docker 
      },
    ];
  },
};

export default nextConfig;


