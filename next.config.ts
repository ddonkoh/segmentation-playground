import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  
  // Turbopack configuration (Next.js 16+ default)
  // Note: Webpack config is still supported but requires explicit --webpack flag
  turbopack: {
    // Turbopack-specific config can go here if needed
  },
  
  // Webpack configuration to exclude Node.js modules from client bundle
  // This is used when running with --webpack flag
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
