import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Royalty-free photography is hot-linked from Unsplash. Keep the pattern
    // tight so only Unsplash image URLs can be optimised through next/image.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
