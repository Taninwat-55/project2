import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
  // output: "export",
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;
