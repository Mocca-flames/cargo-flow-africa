
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your local network device to access Next.js dev resources
  allowedDevOrigins: ["192.168.18.33"],

  output: "export",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
