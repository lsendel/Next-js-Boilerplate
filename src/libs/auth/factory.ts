import type { AuthProvider, IAuthAdapter } from './types';
import { ClerkAdapter } from './adapters/ClerkAdapter';
import { CloudflareAdapter } from './adapters/CloudflareAdapter';
import { CognitoAdapter } from './adapters/CognitoAdapter';
import { TestAdapter } from './adapters/TestAdapter';
import { authLogger } from '@/libs/Logger';

/**
 * Auth Provider Factory
 * Creates and returns the appropriate auth adapter based on environment configuration
 */
export class AuthFactory {
  private static instance: IAuthAdapter | null = null;

  /**
   * Get the auth adapter instance (singleton)
   */
  static getAdapter(): IAuthAdapter {
    if (!this.instance) {
      this.instance = this.createAdapter();
    }
    return this.instance;
  }

  /**
   * Create a new auth adapter based on the AUTH_PROVIDER environment variable
   */
  private static createAdapter(): IAuthAdapter {
    const provider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'clerk') as AuthProvider;

    switch (provider) {
      case 'clerk':
        return new ClerkAdapter();

      case 'cloudflare':
        return new CloudflareAdapter();

      case 'cognito':
        return new CognitoAdapter();

      case 'test':
        // TestAdapter works on both client and server
        // Uses server-side imports (next/headers) when needed
        authLogger.info('Using TestAdapter for authentication (test mode)');
        return new TestAdapter();

      default:
        authLogger.warn('Unknown auth provider, falling back to Clerk', { provider });
        return new ClerkAdapter();
    }
  }

  /**
   * Reset the adapter instance (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }

  /**
   * Get the current auth provider type
   */
  static getProviderType(): AuthProvider {
    return (process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'clerk') as AuthProvider;
  }
}
