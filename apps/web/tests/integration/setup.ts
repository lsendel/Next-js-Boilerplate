/**
 * Integration Test Setup
 *
 * Configures the test environment for integration tests with real services
 * (PostgreSQL, Redis, etc.)
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { afterAll, beforeAll, beforeEach } from 'vitest';

const execAsync = promisify(exec);

// Database configuration for tests
const TEST_DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nextjs_test';
const TEST_REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Global setup - runs once before all tests
 */
beforeAll(async () => {
  console.log('🔧 Setting up integration test environment...');

  // Verify database connection
  try {
    await execAsync('pg_isready -h localhost -p 5432');
    console.log('✅ PostgreSQL connection verified');
  } catch (error) {
    console.error('❌ PostgreSQL is not available');
    throw error;
  }

  // Verify Redis connection
  try {
    await execAsync('redis-cli -h localhost -p 6379 ping');
    console.log('✅ Redis connection verified');
  } catch (error) {
    console.error('❌ Redis is not available');
    throw error;
  }

  // Run database migrations
  try {
    console.log('🔄 Running database migrations...');
    await execAsync('npm run db:migrate');
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Database migrations failed');
    throw error;
  }

  console.log('✅ Integration test environment ready');
});

/**
 * Clean up before each test
 */
beforeEach(async () => {
  // Clear Redis cache before each test
  try {
    await execAsync('redis-cli -h localhost -p 6379 FLUSHDB');
  } catch (error) {
    console.warn('Warning: Could not flush Redis database');
  }

  // Truncate test tables (preserve schema)
  // Add your table truncation logic here if needed
});

/**
 * Global teardown - runs once after all tests
 */
afterAll(async () => {
  console.log('🧹 Cleaning up integration test environment...');

  // Clean up test database
  // Add cleanup logic here if needed

  console.log('✅ Cleanup completed');
});

export { TEST_DATABASE_URL, TEST_REDIS_URL };
