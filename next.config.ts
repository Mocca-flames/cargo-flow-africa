
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your local network device to access Next.js dev resources
  allowedDevOrigins: ["192.168.18.33"],

  output: "export",

  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
