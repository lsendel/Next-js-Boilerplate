import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // Advanced caching configuration for Cloudflare CDN
  // Note: caching property not available in current @opennextjs/cloudflare version
  // caching: {
  //   // Cache static assets for 1 year (immutable)
  //   static: {
  //     maxAge: 31536000, // 1 year in seconds
  //     immutable: true,
  //   },
  //   // Cache dynamic content with stale-while-revalidate
  //   dynamic: {
  //     maxAge: 3600, // 1 hour
  //     staleWhileRevalidate: 86400, // 24 hours
  //   },
  // },

  // Note: Most advanced configuration options are not available in current version
  // The following properties are commented out until supported:

  // Image optimization via Cloudflare Images
  // imageOptimization: {
  //   enabled: true,
  //   loader: 'cloudflare',
  // },

  // Middleware configuration
  // middleware: {
  //   external: true,
  // },

  // Server-side rendering configuration
  // ssr: {
  //   streaming: true,
  // },

  // Incremental Static Regeneration (ISR)
  // isr: {
  //   enabled: true,
  //   revalidate: 60,
  // },

  // Build configuration
  // build: {
  //   minify: true,
  //   sourceMaps: process.env.NODE_ENV === 'development',
  // },

  // Cloudflare-specific optimizations
  // cloudflare: {
  //   runtime: 'edge',
  //   apo: true,
  // },
});

