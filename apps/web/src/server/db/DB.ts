import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "@/server/db/models/Schema";
import { Env } from "@/libs/Env";
import { createDbConnection } from "@/server/lib/db-connection";
import type { D1DrizzleInstance } from "@/server/lib/d1-connection";
import { createD1Connection } from "@/server/lib/d1-connection";

/**
 * Unified database entrypoint.
 *
 * - In local development / Node runtime: uses Postgres-compatible driver (PGlite).
 * - In Cloudflare production: uses D1 via the `env.DB` binding.
 */
type DbInstance = NodePgDatabase<typeof schema> | D1DrizzleInstance;

// Stores the db connection in the global scope to prevent multiple instances
// due to hot reloading with Next.js in development.
const globalForDb = globalThis as unknown as {
  drizzle?: DbInstance;
};

const isD1Environment = () => {
  try {
    const globalEnv = (globalThis as any).env;
    return !!globalEnv && !!globalEnv.DB;
  } catch {
    return false;
  }
};

const createDb = (): DbInstance => {
  if (isD1Environment()) {
    const env = (globalThis as any).env;
    return createD1Connection(env.DB);
  }

  return createDbConnection();
};

const db: DbInstance = globalForDb.drizzle ?? createDb();

// Only store in global during development to prevent hot reload issues
if (Env.NODE_ENV !== "production") {
  globalForDb.drizzle = db;
}

export { db };
export type { DbInstance };
