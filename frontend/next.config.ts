import type { NextConfig } from "next";

// Backend URL — set NEXT_PUBLIC_API_URL in Vercel env vars to your deployed server URL
// e.g. https://your-server.onrender.com
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Cloudinary CDN
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
