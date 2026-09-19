/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    domains: [
      'localhost', 
      '127.0.0.1',
      'serlesbake.in',
      'www.serlesbake.in',
      'serlesbackend.vercel.app',
      'shop.serlesbake.in',
      'cdn.serlesbake.in'
    ],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimised images were re-generated after only 60s, so repeat visitors kept
    // re-fetching them. A week keeps them cached without stranding updates for
    // long: CMS images get timestamped filenames (a new URL), and static files
    // under /img only change on deploy.
    minimumCacheTTL: 604800,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'serlesbackend.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shop.serlesbake.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.serlesbake.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['react-icons'],
    optimizeCss: true,
  },
  
  // Static file serving
  async rewrites() {
    return [
      {
        source: '/css/:path*',
        destination: '/css/:path*',
      },
      {
        source: '/js/:path*',
        destination: '/js/:path*',
      },
    ];
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: true,
  trailingSlash: false,
  
  // NOTE: a webpack rule used to live here routing png/jpg/gif/svg/webp imports
  // through url-loader with a file-loader fallback. Neither package is installed,
  // so the rule would have failed the build the moment any module imported an
  // image - and it also bypassed Next's own image pipeline. Next 15 handles
  // static image imports natively, so the rule is simply removed.

  // Security headers - less restrictive for development
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: isDev ? 'nosniff' : 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: isDev ? 'no-referrer-when-downgrade' : 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      // Add cache headers for images
      {
        source: '/img/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Add cache headers for CSS files
      {
        source: '/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Add cache headers for JS files
      {
        source: '/js/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Fix MIME type issues for static files
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // The product "Choclate" was misspelled, so its slug was too. Renaming it in
      // the admin changes the url, which would otherwise 404 for anyone holding the
      // old link and discard whatever ranking that url had earned. A 308 passes
      // that on to the corrected url.
      //
      // Both category paths are covered: the product lives under flavoured-cakes,
      // but the wildcard catches it if it is ever recategorised.
      {
        source: '/cakes/flavoured-cakes/choclate',
        destination: '/cakes/flavoured-cakes/chocolate',
        permanent: true,
      },
      {
        source: '/cakes/:category/choclate',
        destination: '/cakes/:category/chocolate',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
