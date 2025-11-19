/**
 * Clean Test Database Script
 *
 * Cleans the test database before integration tests run in CI.
 * Uses direct PostgreSQL connection to delete data and reset sequences.
 */

/* eslint-disable no-console */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import { sessions, users } from '../src/server/db/models/Schema';

async function cleanTestDatabase() {
  console.log('🧹 Cleaning test database...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
  });

  const db = drizzle(pool);

  try {
    // Delete all data from tables (order matters due to FK constraints)
    await db.delete(sessions);
    console.log('✓ Deleted all sessions');

    await db.delete(users);
    console.log('✓ Deleted all users');

    // Reset sequences to start from 1
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE sessions_id_seq RESTART WITH 1`);
    console.log('✓ Reset sequences');

    console.log('✅ Test database cleaned successfully');
  } catch (error) {
    console.error('❌ Failed to clean test database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

cleanTestDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
