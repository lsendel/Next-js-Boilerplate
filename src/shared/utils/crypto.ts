/**
 * Cryptographic Utilities
 *
 * Pure crypto utility functions (client-safe)
 */

/**
 * Generate a random string (browser-safe)
 */
export function generateRandomString(length: number): string {
  const chars
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);

  if (typeof window !== 'undefined' && window.crypto) {
    // Browser
    window.crypto.getRandomValues(randomValues);
  } else if (typeof globalThis.crypto !== 'undefined') {
    // Node.js 19+
    globalThis.crypto.getRandomValues(randomValues);
  } else {
    // Fallback (less secure)
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i]! % chars.length];
  }

  return result;
}

/**
 * Simple hash function (non-cryptographic, for client-side use)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
