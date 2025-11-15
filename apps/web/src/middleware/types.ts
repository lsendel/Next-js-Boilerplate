import type { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

/**
 * Middleware Types and Interfaces
 *
 * Following 2025 best practices for composable middleware architecture.
 */

/**
 * Middleware function signature
 */
export type MiddlewareFunction = (
  request: NextRequest,
  event: NextFetchEvent,
  context: MiddlewareContext,
) => Promise<NextResponse | null>;

/**
 * Middleware context for passing data between middleware layers
 */
export type MiddlewareContext = {
  /**
   * Start time for performance monitoring
   */
  startTime: number;

  /**
   * User/session data from authentication
   */
  user?: {
    id: string;
    email?: string;
    role?: string;
  };

  /**
   * Request metadata
   */
  metadata: {
    isBot?: boolean;
    isAuthenticated?: boolean;
    locale?: string;
    pathname?: string;
  };

  /**
   * Custom data that middleware can set
   */
  data: Record<string, any>;
};

/**
 * Middleware configuration
 */
export type MiddlewareConfig = {
  /**
   * Whether this middleware should run
   */
  enabled?: boolean;

  /**
   * Priority/order (lower runs first)
   */
  priority?: number;

  /**
   * Path patterns to match
   */
  matcher?: string[] | ((path: string) => boolean);

  /**
   * Skip patterns (takes precedence over matcher)
   */
  skip?: string[] | ((path: string) => boolean);
};

/**
 * Middleware with configuration
 */
export type ConfiguredMiddleware = {
  name: string;
  config: MiddlewareConfig;
  handler: MiddlewareFunction;
};
