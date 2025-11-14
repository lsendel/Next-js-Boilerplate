/**
 * Session Repository
 *
 * Data access layer for session management
 */

import { and, count, eq, gt, lt } from 'drizzle-orm';
import { db } from '@/server/db/DB';
import { sessions } from '@/server/db/models/Schema';

/**
 * Session type based on database schema
 */
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

/**
 * Create new session
 */
export async function createSession(data: NewSession): Promise<Session> {
  const result = await db.insert(sessions).values(data).returning();

  return result[0]!;
}

/**
 * Find session by token
 */
export async function findSessionByToken(token: string): Promise<Session | null> {
  const result = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, token))
    .limit(1);

  return result[0] || null;
}

/**
 * Find session by ID
 */
export async function findSessionById(id: number): Promise<Session | null> {
  const result = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Find all sessions for a user
 */
export async function findSessionsByUserId(userId: number): Promise<Session[]> {
  return await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId));
}

/**
 * Get active sessions for a user (not expired)
 */
export async function getActiveSessions(userId: number): Promise<Session[]> {
  const now = new Date();

  return await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        gt(sessions.expiresAt, now),
      ),
    );
}

/**
 * Update session's last activity timestamp
 */
export async function updateActivity(id: number): Promise<void> {
  await db
    .update(sessions)
    .set({ lastActivityAt: new Date() })
    .where(eq(sessions.id, id));
}

/**
 * Update session's last activity by token
 */
export async function updateActivityByToken(token: string): Promise<void> {
  await db
    .update(sessions)
    .set({ lastActivityAt: new Date() })
    .where(eq(sessions.sessionToken, token));
}

/**
 * Delete session by ID
 */
export async function deleteSession(id: number): Promise<boolean> {
  const result = await db
    .delete(sessions)
    .where(eq(sessions.id, id))
    .returning();

  return result.length > 0;
}

/**
 * Delete session by token
 */
export async function deleteSessionByToken(token: string): Promise<boolean> {
  const result = await db
    .delete(sessions)
    .where(eq(sessions.sessionToken, token))
    .returning();

  return result.length > 0;
}

/**
 * Delete all sessions for a user
 */
export async function deleteSessionsByUserId(userId: number): Promise<number> {
  const result = await db
    .delete(sessions)
    .where(eq(sessions.userId, userId))
    .returning();

  return result.length;
}

/**
 * Delete all sessions except the current one
 *
 * Uses a single DELETE query for performance (avoids N+1 query problem)
 */
export async function deleteAllButCurrent(
  userId: number,
  currentSessionId: number,
): Promise<number> {
  const { ne } = await import('drizzle-orm');

  const result = await db
    .delete(sessions)
    .where(and(eq(sessions.userId, userId), ne(sessions.id, currentSessionId)))
    .returning();

  return result.length;
}

/**
 * Delete all expired sessions
 */
export async function deleteExpiredSessions(): Promise<number> {
  const now = new Date();

  const result = await db
    .delete(sessions)
    .where(lt(sessions.expiresAt, now))
    .returning();

  return result.length;
}

/**
 * Check if session is valid (exists and not expired)
 */
export async function isSessionValid(token: string): Promise<boolean> {
  const now = new Date();

  const result = await db
    .select({ count: count() })
    .from(sessions)
    .where(
      and(
        eq(sessions.sessionToken, token),
        gt(sessions.expiresAt, now),
      ),
    );

  return (result[0]?.count || 0) > 0;
}

/**
 * Extend session expiration
 */
export async function extendSession(
  id: number,
  expiresAt: Date,
): Promise<Session | null> {
  const result = await db
    .update(sessions)
    .set({ expiresAt })
    .where(eq(sessions.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Get total session count
 */
export async function getSessionCount(): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(sessions);

  return result[0]?.count || 0;
}

/**
 * Get active session count across all users
 */
export async function getActiveSessionCount(): Promise<number> {
  const now = new Date();

  const result = await db
    .select({ count: count() })
    .from(sessions)
    .where(gt(sessions.expiresAt, now));

  return result[0]?.count || 0;
}
