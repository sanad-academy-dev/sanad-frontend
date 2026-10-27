import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "sharply-showoff-scoring.ngrok-free.dev",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok-free.app",
    "localhost:3000",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "sharply-showoff-scoring.ngrok-free.dev",
        "*.ngrok-free.dev",
        "*.ngrok.app",
        "*.ngrok-free.app",
        "localhost:3000",
      ],
    },
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
