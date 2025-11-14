/**
 * Auth Service Tests
 *
 * Co-located test file for auth.service.ts
 * Tests session management, validation, and security features
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthService } from './auth.service';
import * as userRepo from '@/server/db/repositories/user.repository';
import * as sessionRepo from '@/server/db/repositories/session.repository';

// Test data
let authService: AuthService;
let testUserIds: number[] = [];
let testSessionIds: number[] = [];

describe('AuthService', () => {
  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(async () => {
    // Clean up test sessions
    for (const id of testSessionIds) {
      await sessionRepo.deleteSession(id);
    }
    // Clean up test users
    for (const id of testUserIds) {
      await userRepo.permanentlyDeleteUser(id);
    }
    testUserIds = [];
    testSessionIds = [];
  });

  describe('createSession', () => {
    let testUserId: number;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);
    });

    it('should create a new session for user', async () => {
      const session = await authService.createSession(testUserId);
      testSessionIds.push(session.id);

      expect(session).toBeDefined();
      expect(session.userId).toBe(testUserId);
      expect(session.sessionToken).toBeDefined();
      expect(session.sessionToken.length).toBe(64); // 32 bytes hex = 64 chars
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should create session with 30-day expiration by default', async () => {
      const session = await authService.createSession(testUserId);
      testSessionIds.push(session.id);

      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const expectedExpiry = Date.now() + thirtyDays;

      expect(session.expiresAt.getTime()).toBeLessThanOrEqual(
        expectedExpiry + 1000,
      );
      expect(session.expiresAt.getTime()).toBeGreaterThan(
        expectedExpiry - 10000,
      );
    });

    it('should store client information when provided', async () => {
      const clientInfo = {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Test Browser)',
        deviceFingerprint: 'test-device-123',
      };

      const session = await authService.createSession(testUserId, clientInfo);
      testSessionIds.push(session.id);

      expect(session.ipAddress).toBe('192.168.1.1');
      expect(session.userAgent).toBe('Mozilla/5.0 (Test Browser)');
      expect(session.deviceFingerprint).toBe('test-device-123');
    });

    it('should create session without client information', async () => {
      const session = await authService.createSession(testUserId, {});
      testSessionIds.push(session.id);

      expect(session.ipAddress).toBeNull();
      expect(session.userAgent).toBeNull();
      expect(session.deviceFingerprint).toBeNull();
    });
  });

  describe('validateSession', () => {
    let testUserId: number;
    let testSessionToken: string;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `validate-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);

      const session = await authService.createSession(testUserId);
      testSessionToken = session.sessionToken;
      testSessionIds.push(session.id);
    });

    it('should return user for valid session token', async () => {
      const user = await authService.validateSession(testSessionToken);

      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
      expect(user?.isActive).toBe(true);
    });

    it('should return null for non-existent session token', async () => {
      const user = await authService.validateSession('nonexistent-token');

      expect(user).toBeNull();
    });

    it('should return null for expired session', async () => {
      // Create an expired session
      const expiredSession = await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'expired-token',
        expiresAt: new Date(Date.now() - 1000), // Already expired
      });
      testSessionIds.push(expiredSession.id);

      const user = await authService.validateSession('expired-token');

      expect(user).toBeNull();

      // Verify session was cleaned up
      const session = await sessionRepo.findSessionByToken('expired-token');
      expect(session).toBeNull();
    });

    it('should return null for inactive user', async () => {
      await userRepo.deactivateUser(testUserId);

      const user = await authService.validateSession(testSessionToken);

      expect(user).toBeNull();
    });

    it('should update session activity on validation', async () => {
      const sessionBefore = await sessionRepo.findSessionByToken(
        testSessionToken,
      );
      const activityBefore = sessionBefore?.lastActivityAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));

      await authService.validateSession(testSessionToken);

      const sessionAfter = await sessionRepo.findSessionByToken(
        testSessionToken,
      );
      const activityAfter = sessionAfter?.lastActivityAt;

      expect(activityAfter).not.toBeNull();
      if (activityBefore) {
        expect(activityAfter?.getTime()).toBeGreaterThan(
          activityBefore.getTime(),
        );
      }
    });
  });

  describe('refreshSession', () => {
    let testUserId: number;
    let testSessionToken: string;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `refresh-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);

      const session = await authService.createSession(testUserId);
      testSessionToken = session.sessionToken;
      testSessionIds.push(session.id);
    });

    it('should extend session expiration', async () => {
      const sessionBefore = await sessionRepo.findSessionByToken(
        testSessionToken,
      );
      const expiryBefore = sessionBefore?.expiresAt.getTime();

      await new Promise(resolve => setTimeout(resolve, 100));

      const refreshedSession = await authService.refreshSession(
        testSessionToken,
      );

      expect(refreshedSession).not.toBeNull();
      expect(refreshedSession?.expiresAt.getTime()).toBeGreaterThan(
        expiryBefore!,
      );
    });

    it('should return null for non-existent session', async () => {
      const refreshed = await authService.refreshSession('nonexistent-token');

      expect(refreshed).toBeNull();
    });

    it('should return null and clean up expired session', async () => {
      // Create expired session
      const expiredSession = await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'expired-refresh-token',
        expiresAt: new Date(Date.now() - 1000),
      });
      testSessionIds.push(expiredSession.id);

      const refreshed = await authService.refreshSession(
        'expired-refresh-token',
      );

      expect(refreshed).toBeNull();

      // Verify session was deleted
      const found = await sessionRepo.findSessionByToken(
        'expired-refresh-token',
      );
      expect(found).toBeNull();
    });

    it('should extend by 30 days from current time', async () => {
      const refreshed = await authService.refreshSession(testSessionToken);

      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const expectedExpiry = Date.now() + thirtyDays;

      expect(refreshed?.expiresAt.getTime()).toBeLessThanOrEqual(
        expectedExpiry + 1000,
      );
      expect(refreshed?.expiresAt.getTime()).toBeGreaterThan(
        expectedExpiry - 10000,
      );
    });
  });

  describe('destroySession', () => {
    let testUserId: number;
    let testSessionToken: string;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `destroy-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);

      const session = await authService.createSession(testUserId);
      testSessionToken = session.sessionToken;
      testSessionIds.push(session.id);
    });

    it('should destroy session by token', async () => {
      const destroyed = await authService.destroySession(testSessionToken);

      expect(destroyed).toBe(true);

      // Verify session is gone
      const found = await sessionRepo.findSessionByToken(testSessionToken);
      expect(found).toBeNull();
    });

    it('should return false for non-existent session', async () => {
      const destroyed = await authService.destroySession('nonexistent-token');

      expect(destroyed).toBe(false);
    });
  });

  describe('destroyAllSessions', () => {
    let testUserId: number;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `destroyall-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);
    });

    it('should destroy all sessions for a user', async () => {
      // Create multiple sessions
      const session1 = await authService.createSession(testUserId);
      const session2 = await authService.createSession(testUserId);
      const session3 = await authService.createSession(testUserId);

      testSessionIds.push(session1.id, session2.id, session3.id);

      const count = await authService.destroyAllSessions(testUserId);

      expect(count).toBe(3);

      // Verify all sessions are gone
      const found1 = await sessionRepo.findSessionByToken(
        session1.sessionToken,
      );
      const found2 = await sessionRepo.findSessionByToken(
        session2.sessionToken,
      );
      const found3 = await sessionRepo.findSessionByToken(
        session3.sessionToken,
      );

      expect(found1).toBeNull();
      expect(found2).toBeNull();
      expect(found3).toBeNull();
    });

    it('should return 0 for user with no sessions', async () => {
      const count = await authService.destroyAllSessions(testUserId);

      expect(count).toBe(0);
    });
  });

  describe('getUserSessions', () => {
    let testUserId: number;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `getsessions-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);
    });

    it('should return all active sessions for user', async () => {
      // Create active sessions
      const session1 = await authService.createSession(testUserId);
      const session2 = await authService.createSession(testUserId);
      testSessionIds.push(session1.id, session2.id);

      const sessions = await authService.getUserSessions(testUserId);

      expect(sessions.length).toBe(2);
      expect(sessions[0]?.userId).toBe(testUserId);
      expect(sessions[1]?.userId).toBe(testUserId);
    });

    it('should not return expired sessions', async () => {
      // Create active session
      const activeSession = await authService.createSession(testUserId);
      testSessionIds.push(activeSession.id);

      // Create expired session
      const expiredSession = await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'expired-getsessions',
        expiresAt: new Date(Date.now() - 1000),
      });
      testSessionIds.push(expiredSession.id);

      const sessions = await authService.getUserSessions(testUserId);

      expect(sessions.length).toBe(1);
      expect(sessions[0]?.sessionToken).toBe(activeSession.sessionToken);
    });

    it('should return empty array for user with no sessions', async () => {
      const sessions = await authService.getUserSessions(testUserId);

      expect(sessions).toEqual([]);
    });
  });

  describe('destroyOtherSessions', () => {
    let testUserId: number;
    let currentSessionId: number;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `destroyother-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);

      const currentSession = await authService.createSession(testUserId);
      currentSessionId = currentSession.id;
      testSessionIds.push(currentSessionId);
    });

    it('should destroy all sessions except current one', async () => {
      // Create other sessions
      const session2 = await authService.createSession(testUserId);
      const session3 = await authService.createSession(testUserId);
      testSessionIds.push(session2.id, session3.id);

      const count = await authService.destroyOtherSessions(
        testUserId,
        currentSessionId,
      );

      expect(count).toBe(2);

      // Verify current session still exists
      const currentExists = await sessionRepo.findSessionById(currentSessionId);
      expect(currentExists).not.toBeNull();

      // Verify other sessions are gone
      const session2Exists = await sessionRepo.findSessionById(session2.id);
      const session3Exists = await sessionRepo.findSessionById(session3.id);
      expect(session2Exists).toBeNull();
      expect(session3Exists).toBeNull();
    });

    it('should return 0 if only current session exists', async () => {
      const count = await authService.destroyOtherSessions(
        testUserId,
        currentSessionId,
      );

      expect(count).toBe(0);
    });
  });

  describe('isSessionValid', () => {
    let testUserId: number;
    let testSessionToken: string;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `isvalid-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);

      const session = await authService.createSession(testUserId);
      testSessionToken = session.sessionToken;
      testSessionIds.push(session.id);
    });

    it('should return true for valid session', async () => {
      const isValid = await authService.isSessionValid(testSessionToken);

      expect(isValid).toBe(true);
    });

    it('should return false for non-existent session', async () => {
      const isValid = await authService.isSessionValid('nonexistent-token');

      expect(isValid).toBe(false);
    });

    it('should return false for expired session', async () => {
      const expiredSession = await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'expired-isvalid',
        expiresAt: new Date(Date.now() - 1000),
      });
      testSessionIds.push(expiredSession.id);

      const isValid = await authService.isSessionValid('expired-isvalid');

      expect(isValid).toBe(false);
    });
  });

  describe('getSession', () => {
    let testUserId: number;
    let testSessionToken: string;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `getsession-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);

      const session = await authService.createSession(testUserId);
      testSessionToken = session.sessionToken;
      testSessionIds.push(session.id);
    });

    it('should return session by token', async () => {
      const session = await authService.getSession(testSessionToken);

      expect(session).not.toBeNull();
      expect(session?.sessionToken).toBe(testSessionToken);
      expect(session?.userId).toBe(testUserId);
    });

    it('should return null for non-existent token', async () => {
      const session = await authService.getSession('nonexistent-token');

      expect(session).toBeNull();
    });
  });

  describe('cleanupExpiredSessions', () => {
    let testUserId: number;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `cleanup-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);
    });

    it('should delete expired sessions', async () => {
      // Create expired sessions
      const expired1 = await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'cleanup-expired-1',
        expiresAt: new Date(Date.now() - 1000),
      });
      const expired2 = await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'cleanup-expired-2',
        expiresAt: new Date(Date.now() - 2000),
      });

      // Create active session
      const active = await authService.createSession(testUserId);

      testSessionIds.push(expired1.id, expired2.id, active.id);

      const count = await authService.cleanupExpiredSessions();

      expect(count).toBeGreaterThanOrEqual(2);

      // Verify expired sessions are gone
      const found1 = await sessionRepo.findSessionByToken('cleanup-expired-1');
      const found2 = await sessionRepo.findSessionByToken('cleanup-expired-2');
      expect(found1).toBeNull();
      expect(found2).toBeNull();

      // Verify active session still exists
      const foundActive = await sessionRepo.findSessionByToken(
        active.sessionToken,
      );
      expect(foundActive).not.toBeNull();
    });

    it('should return 0 if no expired sessions', async () => {
      // Create only active sessions
      const active1 = await authService.createSession(testUserId);
      const active2 = await authService.createSession(testUserId);
      testSessionIds.push(active1.id, active2.id);

      const count = await authService.cleanupExpiredSessions();

      expect(count).toBe(0);
    });
  });

  describe('getSessionStats', () => {
    let testUserId: number;

    beforeEach(async () => {
      const user = await userRepo.createUser({
        email: `stats-${Date.now()}@example.com`,
        passwordHash: 'hash',
        authProvider: 'local',
        isActive: true,
      });
      testUserId = user.id;
      testUserIds.push(testUserId);
    });

    it('should return session statistics', async () => {
      // Create active sessions
      const active1 = await authService.createSession(testUserId);
      const active2 = await authService.createSession(testUserId);

      // Create expired session
      const expired = await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'stats-expired',
        expiresAt: new Date(Date.now() - 1000),
      });

      testSessionIds.push(active1.id, active2.id, expired.id);

      const stats = await authService.getSessionStats();

      expect(stats.total).toBeGreaterThanOrEqual(3);
      expect(stats.active).toBeGreaterThanOrEqual(2);
      expect(stats.active).toBeLessThanOrEqual(stats.total);
    });
  });
});
