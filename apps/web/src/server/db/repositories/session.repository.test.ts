/**
 * Session Repository Tests
 *
 * Co-located test file for session.repository.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as sessionRepo from './session.repository';
import * as userRepo from './user.repository';
import type { NewSession } from './session.repository';
import type { NewUser } from './user.repository';

// Test data
let testUserId: number;

describe('SessionRepository', () => {
  beforeEach(async () => {
    // Create a test user for session tests
    const userData: NewUser = {
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'test-hash',
      authProvider: 'local',
      isActive: true,
    };
    const user = await userRepo.createUser(userData);
    testUserId = user.id;
  });

  afterEach(async () => {
    // Clean up: delete all test sessions
    if (testUserId) {
      await sessionRepo.deleteSessionsByUserId(testUserId);
      await userRepo.deleteUser(testUserId);
    }
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: 'test-token-123',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const session = await sessionRepo.createSession(sessionData);

      expect(session).toBeDefined();
      expect(session.id).toBeTypeOf('number');
      expect(session.userId).toBe(testUserId);
      expect(session.sessionToken).toBe('test-token-123');
      expect(session.expiresAt).toBeInstanceOf(Date);
    });

    it('should create session with full client info', async () => {
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: 'test-token-456',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        deviceFingerprint: 'device-123',
      };

      const session = await sessionRepo.createSession(sessionData);

      expect(session.ipAddress).toBe('192.168.1.1');
      expect(session.userAgent).toBe('Mozilla/5.0');
      expect(session.deviceFingerprint).toBe('device-123');
    });
  });

  describe('findSessionByToken', () => {
    it('should find session by token', async () => {
      const token = `test-token-${Date.now()}`;
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await sessionRepo.createSession(sessionData);
      const found = await sessionRepo.findSessionByToken(token);

      expect(found).toBeDefined();
      expect(found?.sessionToken).toBe(token);
    });

    it('should return null for non-existent token', async () => {
      const found = await sessionRepo.findSessionByToken('non-existent-token');
      expect(found).toBeNull();
    });
  });

  describe('getActiveSessions', () => {
    it('should return only non-expired sessions', async () => {
      // Create expired session
      const expiredSession: NewSession = {
        userId: testUserId,
        sessionToken: `expired-${Date.now()}`,
        expiresAt: new Date(Date.now() - 1000), // Already expired
      };

      // Create active session
      const activeSession: NewSession = {
        userId: testUserId,
        sessionToken: `active-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await sessionRepo.createSession(expiredSession);
      await sessionRepo.createSession(activeSession);

      const activeSessions = await sessionRepo.getActiveSessions(testUserId);

      expect(activeSessions.length).toBe(1);
      expect(activeSessions[0]?.sessionToken).toBe(activeSession.sessionToken);
    });
  });

  describe('updateActivity', () => {
    it('should update last activity timestamp', async () => {
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: `test-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const session = await sessionRepo.createSession(sessionData);
      const originalActivity = session.lastActivityAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));

      await sessionRepo.updateActivity(session.id);

      const updated = await sessionRepo.findSessionById(session.id);
      expect(updated?.lastActivityAt.getTime()).toBeGreaterThan(
        originalActivity.getTime(),
      );
    });
  });

  describe('deleteSession', () => {
    it('should delete session by ID', async () => {
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: `test-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const session = await sessionRepo.createSession(sessionData);
      const deleted = await sessionRepo.deleteSession(session.id);

      expect(deleted).toBe(true);

      const found = await sessionRepo.findSessionById(session.id);
      expect(found).toBeNull();
    });

    it('should return false for non-existent session', async () => {
      const deleted = await sessionRepo.deleteSession(999999);
      expect(deleted).toBe(false);
    });
  });

  describe('deleteSessionByToken', () => {
    it('should delete session by token', async () => {
      const token = `test-${Date.now()}`;
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await sessionRepo.createSession(sessionData);
      const deleted = await sessionRepo.deleteSessionByToken(token);

      expect(deleted).toBe(true);

      const found = await sessionRepo.findSessionByToken(token);
      expect(found).toBeNull();
    });
  });

  describe('deleteSessionsByUserId', () => {
    it('should delete all sessions for a user', async () => {
      // Create multiple sessions
      const session1: NewSession = {
        userId: testUserId,
        sessionToken: `test-1-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const session2: NewSession = {
        userId: testUserId,
        sessionToken: `test-2-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await sessionRepo.createSession(session1);
      await sessionRepo.createSession(session2);

      const deletedCount = await sessionRepo.deleteSessionsByUserId(testUserId);

      expect(deletedCount).toBeGreaterThanOrEqual(2);

      const remaining = await sessionRepo.findSessionsByUserId(testUserId);
      expect(remaining.length).toBe(0);
    });
  });

  describe('deleteExpiredSessions', () => {
    it('should delete only expired sessions', async () => {
      // Create expired session
      const expiredSession: NewSession = {
        userId: testUserId,
        sessionToken: `expired-${Date.now()}`,
        expiresAt: new Date(Date.now() - 1000),
      };

      // Create active session
      const activeSession: NewSession = {
        userId: testUserId,
        sessionToken: `active-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const expired = await sessionRepo.createSession(expiredSession);
      await sessionRepo.createSession(activeSession);

      const deletedCount = await sessionRepo.deleteExpiredSessions();

      expect(deletedCount).toBeGreaterThanOrEqual(1);

      // Verify expired session was deleted
      const found = await sessionRepo.findSessionById(expired.id);
      expect(found).toBeNull();

      // Verify active session still exists
      const active = await sessionRepo.findSessionByToken(
        activeSession.sessionToken,
      );
      expect(active).toBeDefined();
    });
  });

  describe('isSessionValid', () => {
    it('should return true for valid non-expired session', async () => {
      const token = `test-${Date.now()}`;
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await sessionRepo.createSession(sessionData);
      const isValid = await sessionRepo.isSessionValid(token);

      expect(isValid).toBe(true);
    });

    it('should return false for expired session', async () => {
      const token = `test-${Date.now()}`;
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: token,
        expiresAt: new Date(Date.now() - 1000),
      };

      await sessionRepo.createSession(sessionData);
      const isValid = await sessionRepo.isSessionValid(token);

      expect(isValid).toBe(false);
    });

    it('should return false for non-existent session', async () => {
      const isValid = await sessionRepo.isSessionValid('non-existent-token');
      expect(isValid).toBe(false);
    });
  });

  describe('extendSession', () => {
    it('should extend session expiration', async () => {
      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: `test-${Date.now()}`,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      };

      const session = await sessionRepo.createSession(sessionData);
      const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const extended = await sessionRepo.extendSession(session.id, newExpiresAt);

      expect(extended).toBeDefined();
      expect(extended?.expiresAt.getTime()).toBe(newExpiresAt.getTime());
    });
  });

  describe('getSessionCount', () => {
    it('should return total session count', async () => {
      const before = await sessionRepo.getSessionCount();

      const sessionData: NewSession = {
        userId: testUserId,
        sessionToken: `test-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await sessionRepo.createSession(sessionData);

      const after = await sessionRepo.getSessionCount();

      expect(after).toBeGreaterThan(before);
    });
  });

  describe('getActiveSessionCount', () => {
    it('should return only active session count', async () => {
      // Create expired session
      const expiredSession: NewSession = {
        userId: testUserId,
        sessionToken: `expired-${Date.now()}`,
        expiresAt: new Date(Date.now() - 1000),
      };

      // Create active session
      const activeSession: NewSession = {
        userId: testUserId,
        sessionToken: `active-${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await sessionRepo.createSession(expiredSession);
      const before = await sessionRepo.getActiveSessionCount();

      await sessionRepo.createSession(activeSession);
      const after = await sessionRepo.getActiveSessionCount();

      // Only active session should increment count
      expect(after).toBe(before + 1);
    });
  });
});
