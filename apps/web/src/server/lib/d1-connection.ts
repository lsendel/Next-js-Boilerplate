import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from '@/server/db/models/SchemaD1';
import { dbLogger } from '@/libs/Logger';

/**
 * Create a Drizzle ORM instance for Cloudflare D1
 * 
 * @param d1 - D1 database binding from Cloudflare Workers environment
 * @returns Drizzle ORM instance configured for D1
 */
export function createD1Connection(d1: D1Database) {
  try {
    return drizzle(d1, { schema });
  } catch (error) {
    dbLogger.error('Failed to create D1 database connection', { error });
    throw new Error('D1 database connection failed');
  }
}

/**
 * Get D1 database instance from Cloudflare Workers environment
 * 
 * This function is used in Server Components, API Routes, and Server Actions
 * to access the D1 database binding.
 * 
 * @example
 * ```typescript
 * // In a Server Component or API Route
 * import { getD1 } from '@/server/lib/d1-connection';
 * 
 * export async function GET(request: Request) {
 *   const db = await getD1(request);
 *   const users = await db.select().from(schema.users);
 *   return Response.json(users);
 * }
 * ```
 */
export async function getD1(request?: Request): Promise<ReturnType<typeof createD1Connection>> {
  // In Cloudflare Workers, the D1 binding is available via the env object
  // The env object is passed through the request context
  
  // For Next.js on Cloudflare Pages, the env is available via globalThis
  const env = (globalThis as any).env;
  
  if (!env?.DB) {
    dbLogger.error('D1 database binding not found in environment');
    throw new Error(
      'D1 database binding not found. Make sure wrangler.jsonc has d1_databases configured.'
    );
  }
  
  return createD1Connection(env.DB);
}

/**
 * Type-safe D1 database instance
 * Use this type for function parameters that accept a database instance
 */
export type D1DrizzleInstance = ReturnType<typeof createD1Connection>;

