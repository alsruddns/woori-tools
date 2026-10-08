import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  assetPrefix: "/_assets/tools",
  images: {
    path: "/_assets/tools/_next/image",
  },
  async rewrites() {
    return { beforeFiles: [{ source: "/tools-sitemap.xml", destination: "/sitemap.xml" }] };
  },
  async redirects() {
    return [
      { source: "/", destination: "/ko/tools", permanent: true },
      { source: "/tools", destination: "/ko/tools", permanent: true },
      { source: "/tools/en/:slug", destination: "/en/tools/:slug", permanent: true },
      { source: "/tools/ja/:slug", destination: "/ja/tools/:slug", permanent: true },
      { source: "/tools/zh/:slug", destination: "/zh/tools/:slug", permanent: true },
      { source: "/tools/:path*", destination: "/ko/tools/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
