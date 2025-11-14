import type { NextFetchEvent, NextRequest } from 'next/server';
import type { AuthMiddlewareConfig } from './types';
import { ClerkAdapter } from './adapters/ClerkAdapter';
import { CloudflareAdapter } from './adapters/CloudflareAdapter';
import { CognitoAdapter } from './adapters/CognitoAdapter';
import { TestAdapter } from './adapters/TestAdapter';
import { AuthFactory } from './factory';

/**
 * Create auth middleware based on the current provider
 */
export function createAuthMiddleware(config: AuthMiddlewareConfig) {
  const provider = AuthFactory.getProviderType();

  switch (provider) {
    case 'clerk':
      return ClerkAdapter.createMiddleware(config);

    case 'cloudflare':
      return CloudflareAdapter.createMiddleware(config);

    case 'cognito':
      return CognitoAdapter.createMiddleware(config);

    case 'test':
      return TestAdapter.createMiddleware(config);

    default:
      // Fallback to Clerk
      return ClerkAdapter.createMiddleware(config);
  }
}

/**
 * Wrapper to handle both Clerk-style and standard middleware
 */
export async function executeAuthMiddleware(
  request: NextRequest,
  event: NextFetchEvent,
  config: AuthMiddlewareConfig,
) {
  const middleware = createAuthMiddleware(config);

  // Clerk middleware has a different signature
  if (AuthFactory.getProviderType() === 'clerk') {
    // Clerk middleware expects (request, event)
    return (middleware as any)(request, event);
  }

  // Standard middleware - we can ignore event parameter for non-Clerk providers
  return (middleware as any)(request);
}
