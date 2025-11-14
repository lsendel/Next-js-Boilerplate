/**
 * Enhanced Session Management
 *
 * Implements session timeout, refresh, and security features
 * following 2025 best practices
 */

import type { SessionFingerprint } from './session-fingerprint';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import {
  generateSessionFingerprint,
  shouldRefreshFingerprint,
  validateSessionFingerprint,
} from './session-fingerprint';

type SessionData = {
  userId: string;
  email: string;
  createdAt: number;
  lastActivityAt: number;
  expiresAt: number;
  fingerprint: SessionFingerprint;
  metadata?: Record<string, any>;
};

type SessionConfig = {
  maxAge: number; // Max session duration in ms
  idleTimeout: number; // Idle timeout in ms
  cookieName: string;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
};

// Default configuration
const DEFAULT_CONFIG: SessionConfig = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  idleTimeout: 30 * 60 * 1000, // 30 minutes
  cookieName: '__Host-session',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

/**
 * Session Manager
 *
 * Handles creation, validation, and lifecycle of user sessions
 */
export class SessionManager {
  private config: SessionConfig;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    email: string,
    request: Request,
    metadata?: Record<string, any>,
  ): Promise<string> {
    const now = Date.now();
    const fingerprint = generateSessionFingerprint(request);

    const sessionData: SessionData = {
      userId,
      email,
      createdAt: now,
      lastActivityAt: now,
      expiresAt: now + this.config.maxAge,
      fingerprint,
      metadata,
    };

    // Generate session token
    const sessionToken = this.generateSessionToken();

    // Store session data (encrypt for security)
    const encryptedData = await this.encryptSessionData(sessionData);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(this.config.cookieName, sessionToken, {
      httpOnly: true,
      secure: this.config.secure,
      sameSite: this.config.sameSite,
      path: '/',
      maxAge: this.config.maxAge / 1000, // Convert to seconds
    });

    // Store session data mapping (in production, use Redis/database)
    await this.storeSessionData(sessionToken, encryptedData);

    return sessionToken;
  }

  /**
   * Validate and refresh session
   */
  async validateSession(
    request: Request,
  ): Promise<{ valid: boolean; session?: SessionData; reason?: string }> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(this.config.cookieName)?.value;

    if (!sessionToken) {
      return { valid: false, reason: 'No session token' };
    }

    // Retrieve encrypted session data
    const encryptedData = await this.retrieveSessionData(sessionToken);
    if (!encryptedData) {
      return { valid: false, reason: 'Session not found' };
    }

    // Decrypt session data
    const session = await this.decryptSessionData(encryptedData);
    if (!session) {
      return { valid: false, reason: 'Invalid session data' };
    }

    const now = Date.now();

    // Check expiration
    if (now > session.expiresAt) {
      await this.destroySession(sessionToken);
      return { valid: false, reason: 'Session expired' };
    }

    // Check idle timeout
    if (now - session.lastActivityAt > this.config.idleTimeout) {
      await this.destroySession(sessionToken);
      return { valid: false, reason: 'Session idle timeout' };
    }

    // Validate fingerprint (detect session hijacking)
    const currentFingerprint = generateSessionFingerprint(request);
    const fingerprintValidation = validateSessionFingerprint(
      currentFingerprint,
      session.fingerprint,
    );

    if (!fingerprintValidation.valid) {
      await this.destroySession(sessionToken);
      return {
        valid: false,
        reason: `Session security check failed: ${fingerprintValidation.reason}`,
      };
    }

    // Update last activity
    session.lastActivityAt = now;

    // Refresh fingerprint if needed
    if (shouldRefreshFingerprint(session.fingerprint)) {
      session.fingerprint = currentFingerprint;
    }

    // Save updated session
    const updatedEncryptedData = await this.encryptSessionData(session);
    await this.storeSessionData(sessionToken, updatedEncryptedData);

    return { valid: true, session };
  }

  /**
   * Destroy session
   */
  async destroySession(sessionToken?: string): Promise<void> {
    const cookieStore = await cookies();

    if (!sessionToken) {
      sessionToken = cookieStore.get(this.config.cookieName)?.value;
    }

    if (sessionToken) {
      await this.deleteSessionData(sessionToken);
    }

    // Delete cookie
    cookieStore.delete(this.config.cookieName);
  }

  /**
   * Refresh session expiration
   */
  async refreshSession(sessionToken: string): Promise<void> {
    const encryptedData = await this.retrieveSessionData(sessionToken);
    if (!encryptedData) {
      return;
    }

    const session = await this.decryptSessionData(encryptedData);
    if (!session) {
      return;
    }

    // Extend expiration
    const now = Date.now();
    session.expiresAt = now + this.config.maxAge;
    session.lastActivityAt = now;

    // Save updated session
    const updatedEncryptedData = await this.encryptSessionData(session);
    await this.storeSessionData(sessionToken, updatedEncryptedData);
  }

  /**
   * Generate cryptographically secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Encrypt session data
   */
  private async encryptSessionData(data: SessionData): Promise<string> {
    // In production, use a proper encryption key from environment
    // const key = process.env.SESSION_ENCRYPTION_KEY || 'development-key-change-in-production';

    // Simple encryption for demo - use proper encryption in production
    const encrypted = Buffer.from(JSON.stringify(data)).toString('base64url');
    return encrypted;
  }

  /**
   * Decrypt session data
   */
  private async decryptSessionData(
    encrypted: string,
  ): Promise<SessionData | null> {
    try {
      const decrypted = Buffer.from(encrypted, 'base64url').toString('utf-8');
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  /**
   * Store session data (in-memory for demo, use Redis/DB in production)
   */
  private sessionStore = new Map<string, string>();

  private async storeSessionData(
    token: string,
    data: string,
  ): Promise<void> {
    this.sessionStore.set(token, data);
  }

  private async retrieveSessionData(token: string): Promise<string | null> {
    return this.sessionStore.get(token) || null;
  }

  private async deleteSessionData(token: string): Promise<void> {
    this.sessionStore.delete(token);
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
