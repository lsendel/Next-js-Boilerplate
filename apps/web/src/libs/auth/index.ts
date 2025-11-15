/**
 * Modular Authentication System
 *
 * This module provides a unified interface for authentication that can switch
 * between different providers (Clerk, Cloudflare Access, AWS Cognito, Test) based
 * on the NEXT_PUBLIC_AUTH_PROVIDER environment variable.
 *
 * Usage:
 * - Set NEXT_PUBLIC_AUTH_PROVIDER to 'clerk', 'cloudflare', 'cognito', or 'test'
 * - Use the exported functions and components throughout your app
 * - The implementation details are abstracted away
 *
 * Providers:
 * - 'clerk' - Clerk authentication (production-ready)
 * - 'cloudflare' - Cloudflare Access (production-ready)
 * - 'cognito' - AWS Cognito (stub implementation)
 * - 'test' - Simple form-based auth for E2E testing (DO NOT USE IN PRODUCTION)
 */

import { AuthFactory } from './factory';

// Export adapters for direct use if needed
export { ClerkAdapter } from './adapters/ClerkAdapter';
export { CloudflareAdapter } from './adapters/CloudflareAdapter';
export { CognitoAdapter } from './adapters/CognitoAdapter';
export { TestAdapter } from './adapters/TestAdapter';
// Export factory
export { AuthFactory } from './factory';

// Export types
export type { AuthMiddlewareConfig, AuthProvider, AuthSession, AuthUser, IAuthAdapter } from './types';

/**
 * Get the current auth adapter instance
 */
export const getAuthAdapter = () => AuthFactory.getAdapter();

/**
 * Get the current auth provider type
 */
export const getAuthProvider = () => AuthFactory.getProviderType();

/**
 * Server-side: Get the current authenticated user
 */
export const getCurrentUser = async () => {
  const adapter = getAuthAdapter();
  return adapter.getCurrentUser();
};

/**
 * Server-side: Get the current session
 */
export const getSession = async () => {
  const adapter = getAuthAdapter();
  return adapter.getSession();
};

/**
 * Server-side: Sign out the current user
 */
export const signOut = async () => {
  const adapter = getAuthAdapter();
  return adapter.signOut();
};

/**
 * Helper to check if user is authenticated
 */
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};
