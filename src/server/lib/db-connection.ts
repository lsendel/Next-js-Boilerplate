import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from '@/libs/Env';
import { dbLogger } from '@/libs/Logger';
import * as schema from '@/server/db/models/Schema';

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate
export const createDbConnection = () => {
  const pool = new Pool({
    connectionString: Env.DATABASE_URL,
    // Optimized pool settings for better concurrency
    max: Env.NODE_ENV === 'production' ? 10 : 5,
    min: 0, // Allow pool to scale down when not in use
    idleTimeoutMillis: 60000, // 60 seconds
    connectionTimeoutMillis: 30000, // 30 seconds (increased for tests)
    allowExitOnIdle: false, // Keep connections alive during tests
  });

  // Handle pool errors to prevent crashes
  pool.on('error', (err) => {
    dbLogger.error('Unexpected database pool error', { error: err });
  });

  return drizzle({
    client: pool,
    schema,
  });
};
