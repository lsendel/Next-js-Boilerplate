import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '@/server/db/models/Schema';
import { createDbConnection } from '@/server/lib/db-connection';
import { Env } from './Env';

// Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
const globalForDb = globalThis as unknown as {
  drizzle: NodePgDatabase<typeof schema> | undefined;
};

function initializeDb(): NodePgDatabase<typeof schema> {
  try {
    const connection = globalForDb.drizzle || createDbConnection();

    // Only store in global during development to prevent hot reload issues
    if (Env.NODE_ENV !== 'production') {
      globalForDb.drizzle = connection;
    }

    return connection;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    throw new Error('Database connection failed. Please check your DATABASE_URL configuration.');
  }
}

const db = initializeDb();

export { db };
