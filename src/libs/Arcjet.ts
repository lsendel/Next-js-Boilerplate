import arcjet, { shield } from '@arcjet/next';

const resolveArcjetMode = () => {
  if (process.env.ARCJET_MODE === 'LIVE' || process.env.ARCJET_MODE === 'DRY_RUN') {
    return process.env.ARCJET_MODE;
  }

  return process.env.NODE_ENV === 'production' ? 'LIVE' : 'DRY_RUN';
};

const trustedProxies = (process.env.ARCJET_TRUSTED_PROXIES ?? '')
  .split(',')
  .map(proxy => proxy.trim())
  .filter(Boolean);

// Create a base Arcjet instance which can be imported and extended in each route.
export default arcjet({
  // Get your site key from https://launch.arcjet.com/Q6eLbRE
  // Use `process.env` instead of Env to reduce bundle size in middleware
  key: process.env.ARCJET_KEY ?? '',
  proxies: trustedProxies.length > 0 ? trustedProxies : undefined,
  // Identify the user by their IP address and UA to avoid rate limit bypass
  characteristics: ['ip.src', 'header.user-agent'],
  rules: [
    // Protect against common attacks with Arcjet Shield
    shield({
      mode: resolveArcjetMode(),
    }),
    // Other rules are added in different routes
  ],
});
