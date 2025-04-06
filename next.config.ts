import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['swiper'],
  images: {
    domains: [
      'toryskateshop.com',
      'ritzyshoes.vercel.app'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toryskateshop.com',
        pathname: '/wp-content/uploads/**',
      }
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  experimental: {
    scrollRestoration: true,
    // legacyBrowsers fue removido en Next.js 13+
    optimizeCss: false, // Habilita optimización CSS (válido desde Next.js 13.2)
    nextScriptWorkers: false, // Mejor rendimiento para scripts
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'x-robot-tag',
          value: 'all',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=60',
        },
      ],
    },
  ],
  optimizeFonts: true,
};

export default nextConfig;