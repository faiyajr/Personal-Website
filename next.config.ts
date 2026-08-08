import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local screenshots live in /public/images. Add a remotePatterns entry here
    // if you later move media to Cloudinary / S3 — see README "Media storage".
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Spotify album art.
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
