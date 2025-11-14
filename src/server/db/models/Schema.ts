import { boolean, integer, pgTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the Next.js initialization process through `instrumentation.ts`.
// Simply restart your Next.js server to apply the database changes.
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate

// User table for authentication and user management
export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  // Authentication fields
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // Nullable for OAuth users

  // Profile fields
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  displayName: varchar('display_name', { length: 200 }),
  avatarUrl: text('avatar_url'),

  // Auth provider tracking
  authProvider: varchar('auth_provider', { length: 50 }).default('local').notNull(), // 'local', 'clerk', 'cloudflare', 'cognito'
  externalId: varchar('external_id', { length: 255 }), // ID from external auth provider

  // Account status
  isActive: boolean('is_active').default(true).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),

  // Security fields
  lastLoginAt: timestamp('last_login_at', { mode: 'date' }),
  passwordChangedAt: timestamp('password_changed_at', { mode: 'date' }),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }), // Soft delete
});

// Session table for managing user sessions
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Session data
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  deviceFingerprint: varchar('device_fingerprint', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 compatible
  userAgent: text('user_agent'),

  // Session lifecycle
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  lastActivityAt: timestamp('last_activity_at', { mode: 'date' }).defaultNow().notNull(),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Counter table (example/demo table)
export const counter = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Tenants table for multi-tenant support
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 96 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('active'), // active, suspended, archived
  defaultLocale: varchar('default_locale', { length: 8 }).notNull().default('en'),
  plan: varchar('plan', { length: 64 }).notNull().default('free'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, table => ({
  slugIdx: uniqueIndex('tenants_slug_unique').on(table.slug),
}));

// Tenant domains table
export const tenantDomains = pgTable('tenant_domains', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  domain: varchar('domain', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 32 }).notNull().default('custom'),
  verifiedAt: timestamp('verified_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, table => ({
  domainIdx: uniqueIndex('tenant_domains_domain_unique').on(table.domain),
}));

// Tenant members table
export const tenantMembers = pgTable('tenant_members', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 32 }).notNull().default('member'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, table => ({
  uniqueMembership: uniqueIndex('tenant_members_unique').on(table.tenantId, table.userId),
}));

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
