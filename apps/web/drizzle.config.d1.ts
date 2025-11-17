import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit configuration for Cloudflare D1
 *
 * This configuration is used for:
 * - Generating migrations for D1 (SQLite)
 * - Applying migrations to D1 databases
 * - Introspecting D1 schema
 *
 * Usage:
 * - Generate migration: drizzle-kit generate --config=drizzle.config.d1.ts
 * - Apply migration: wrangler d1 migrations apply next-boilerplate-db --local
 */
export default defineConfig({
  out: './migrations-d1',
  schema: './src/server/db/models/SchemaD1.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
    databaseId: process.env.D1_DATABASE_ID ?? '',
    token: process.env.CLOUDFLARE_API_TOKEN ?? '',
  },
  verbose: true,
  strict: true,
});
