import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// This file defines the D1 (SQLite) version of the database schema
// Converted from PostgreSQL schema for Cloudflare D1 compatibility

// Helper function to create timestamp columns for SQLite
const timestamp = (name: string) =>
  integer(name, { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date());

const timestampOptional = (name: string) =>
  integer(name, { mode: 'timestamp' });

// User table for authentication and user management
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Authentication fields
  email: text('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash', { length: 255 }), // Nullable for OAuth users

  // Profile fields
  firstName: text('first_name', { length: 100 }),
  lastName: text('last_name', { length: 100 }),
  displayName: text('display_name', { length: 200 }),
  avatarUrl: text('avatar_url'),

  // Auth provider tracking
  authProvider: text('auth_provider', { length: 50 })
    .default('local')
    .notNull(), // 'local', 'clerk', 'cloudflare', 'cognito'
  externalId: text('external_id', { length: 255 }), // ID from external auth provider

  // Account status
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  isEmailVerified: integer('is_email_verified', { mode: 'boolean' })
    .default(false)
    .notNull(),

  // Security fields
  lastLoginAt: timestampOptional('last_login_at'),
  passwordChangedAt: timestampOptional('password_changed_at'),

  // Account locking (security)
  failedLoginAttempts: integer('failed_login_attempts').default(0).notNull(),
  lockedUntil: timestampOptional('locked_until'),
  lastFailedLogin: timestampOptional('last_failed_login'),

  // Metadata
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestampOptional('deleted_at'), // Soft delete
});

// Session table for managing user sessions
export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Session data
  sessionToken: text('session_token', { length: 255 }).notNull().unique(),
  deviceFingerprint: text('device_fingerprint', { length: 255 }),
  ipAddress: text('ip_address', { length: 45 }), // IPv6 compatible
  userAgent: text('user_agent'),

  // Session lifecycle
  expiresAt: timestamp('expires_at'),
  lastActivityAt: timestamp('last_activity_at'),

  // Metadata
  createdAt: timestamp('created_at'),
});

// Password reset tokens table for secure password recovery
export const passwordResetTokens = sqliteTable('password_reset_tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Token data
  token: text('token', { length: 255 }).notNull().unique(), // Hashed token
  expiresAt: timestamp('expires_at'),
  usedAt: timestampOptional('used_at'), // Mark as used after successful reset

  // Metadata
  createdAt: timestamp('created_at'),
});

// User preferences table for storing user-specific settings
export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),

  // UI preferences
  theme: text('theme', { length: 20 }).default('light'), // 'light', 'dark', 'auto'
  language: text('language', { length: 10 }).default('en'), // 'en', 'fr', 'es', etc.

  // Notification preferences
  emailNotifications: integer('email_notifications', { mode: 'boolean' })
    .default(true)
    .notNull(),
  pushNotifications: integer('push_notifications', { mode: 'boolean' })
    .default(false)
    .notNull(),

  // Display preferences
  timezone: text('timezone', { length: 50 }).default('UTC'),
  dateFormat: text('date_format', { length: 20 }).default('MM/DD/YYYY'),

  // Metadata
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// Counter table (example/demo table)
export const counter = sqliteTable('counter', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at'),
  createdAt: timestamp('created_at'),
});

// Tenants table for multi-tenant support
export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug', { length: 96 }).notNull().unique(),
  name: text('name', { length: 255 }).notNull(),
  status: text('status', { length: 32 }).notNull().default('active'), // active, suspended, archived
  defaultLocale: text('default_locale', { length: 8 }).notNull().default('en'),
  plan: text('plan', { length: 64 }).notNull().default('free'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// Tenant domains table
export const tenantDomains = sqliteTable('tenant_domains', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: integer('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  domain: text('domain', { length: 255 }).notNull().unique(),
  provider: text('provider', { length: 32 }).notNull().default('custom'),
  verifiedAt: timestampOptional('verified_at'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// Tenant members table
export const tenantMembers = sqliteTable('tenant_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: integer('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  role: text('role', { length: 32 }).notNull().default('member'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// Relation definitions for DrizzleORM relational queries
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  tenantMemberships: many(tenantMembers),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  domains: many(tenantDomains),
  members: many(tenantMembers),
}));

export const tenantDomainsRelations = relations(tenantDomains, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantDomains.tenantId],
    references: [tenants.id],
  }),
}));

export const tenantMembersRelations = relations(tenantMembers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantMembers.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [tenantMembers.userId],
    references: [users.id],
  }),
}));
