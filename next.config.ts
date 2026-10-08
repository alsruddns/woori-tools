import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/", destination: "/ko/tools", permanent: true },
      { source: "/tools", destination: "/ko/tools", permanent: true },
      { source: "/tools/:path*", destination: "/ko/tools/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
