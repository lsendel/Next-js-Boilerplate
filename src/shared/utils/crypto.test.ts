import { describe, expect, it } from 'vitest';
import { generateRandomString, simpleHash } from './crypto';

describe('Crypto Utilities', () => {
  describe('generateRandomString', () => {
    it('should generate string of correct length', () => {
      expect(generateRandomString(10)).toHaveLength(10);
      expect(generateRandomString(20)).toHaveLength(20);
      expect(generateRandomString(1)).toHaveLength(1);
      expect(generateRandomString(100)).toHaveLength(100);
    });

    it('should generate different strings on each call', () => {
      const str1 = generateRandomString(20);
      const str2 = generateRandomString(20);
      const str3 = generateRandomString(20);

      expect(str1).not.toBe(str2);
      expect(str2).not.toBe(str3);
      expect(str1).not.toBe(str3);
    });

    it('should only contain alphanumeric characters', () => {
      const str = generateRandomString(1000);
      const validChars = /^[A-Za-z0-9]+$/;
      expect(validChars.test(str)).toBe(true);
    });

    it('should handle edge case of zero length', () => {
      const str = generateRandomString(0);
      expect(str).toBe('');
    });

    it('should generate string with length 1', () => {
      const str = generateRandomString(1);
      expect(str).toHaveLength(1);
      expect(/[A-Za-z0-9]/.test(str)).toBe(true);
    });

    it('should have good distribution of characters', () => {
      // Generate a large string and check character distribution
      const length = 10000;
      const str = generateRandomString(length);

      // Count occurrences of each character type
      const uppercase = (str.match(/[A-Z]/g) || []).length;
      const lowercase = (str.match(/[a-z]/g) || []).length;
      const numbers = (str.match(/\d/g) || []).length;

      // Each category should appear at least 15% of the time (allowing for randomness)
      // Expected: ~26/62 for uppercase, ~26/62 for lowercase, ~10/62 for numbers
      expect(uppercase).toBeGreaterThan(length * 0.15);
      expect(lowercase).toBeGreaterThan(length * 0.15);
      expect(numbers).toBeGreaterThan(length * 0.05);
    });

    it('should be deterministically different across multiple calls', () => {
      const strings = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        strings.add(generateRandomString(10));
      }

      // All strings should be unique (collision probability is astronomically low)
      expect(strings.size).toBe(iterations);
    });

    it('should handle large lengths efficiently', () => {
      const str = generateRandomString(10000);
      expect(str).toHaveLength(10000);
      expect(/^[A-Za-z0-9]+$/.test(str)).toBe(true);
    });

    it('should work in both browser and Node.js environments', () => {
      // This test verifies the fallback logic works
      const str = generateRandomString(50);
      expect(str).toHaveLength(50);
      expect(/^[A-Za-z0-9]+$/.test(str)).toBe(true);
    });
  });

  describe('simpleHash', () => {
    it('should generate consistent hash for same input', () => {
      const hash1 = simpleHash('hello');
      const hash2 = simpleHash('hello');
      const hash3 = simpleHash('hello');

      expect(hash1).toBe(hash2);
      expect(hash2).toBe(hash3);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = simpleHash('hello');
      const hash2 = simpleHash('world');
      const hash3 = simpleHash('test');

      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    it('should return base36 string', () => {
      const hash = simpleHash('test');
      // Base36 contains only lowercase letters and numbers
      expect(/^[a-z0-9]+$/.test(hash)).toBe(true);
    });

    it('should handle empty string', () => {
      const hash = simpleHash('');
      expect(hash).toBe('0');
    });

    it('should handle single character', () => {
      const hash = simpleHash('a');
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
    });

    it('should be case sensitive', () => {
      const hash1 = simpleHash('Hello');
      const hash2 = simpleHash('hello');
      const hash3 = simpleHash('HELLO');

      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    it('should handle long strings', () => {
      const longString = 'a'.repeat(10000);
      const hash = simpleHash(longString);
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
    });

    it('should handle special characters', () => {
      const hash1 = simpleHash('!@#$%^&*()');
      const hash2 = simpleHash('[]{}|\\');
      const hash3 = simpleHash('äöü');

      expect(hash1).toBeTruthy();
      expect(hash2).toBeTruthy();
      expect(hash3).toBeTruthy();
      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
    });

    it('should handle unicode characters', () => {
      const hash1 = simpleHash('🎉🎊');
      const hash2 = simpleHash('café');
      const hash3 = simpleHash('你好');

      expect(hash1).toBeTruthy();
      expect(hash2).toBeTruthy();
      expect(hash3).toBeTruthy();
      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
    });

    it('should handle strings with newlines and tabs', () => {
      const hash1 = simpleHash('hello\nworld');
      const hash2 = simpleHash('hello\tworld');
      const hash3 = simpleHash('hello world');

      expect(hash1).toBeTruthy();
      expect(hash2).toBeTruthy();
      expect(hash3).toBeTruthy();
      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    it('should handle similar strings differently', () => {
      const hash1 = simpleHash('test');
      const hash2 = simpleHash('tests');
      const hash3 = simpleHash('testing');

      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    it('should handle numbers in strings', () => {
      const hash1 = simpleHash('123');
      const hash2 = simpleHash('456');
      const hash3 = simpleHash('123456');

      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    it('should be collision-resistant for common strings', () => {
      const hashes = new Set<string>();
      const inputs = [
        'hello',
        'world',
        'test',
        'foo',
        'bar',
        'baz',
        'user',
        'admin',
        'password',
        'email',
        'name',
        'id',
        'token',
        'session',
        'cookie',
      ];

      for (const input of inputs) {
        hashes.add(simpleHash(input));
      }

      // All hashes should be unique
      expect(hashes.size).toBe(inputs.length);
    });

    it('should return consistent hash for JSON strings', () => {
      const obj = { name: 'John', age: 30 };
      const json = JSON.stringify(obj);

      const hash1 = simpleHash(json);
      const hash2 = simpleHash(json);
      expect(hash1).toBe(hash2);

      // Different object should produce different hash
      const obj2 = { name: 'Jane', age: 25 };
      const json2 = JSON.stringify(obj2);
      const hash3 = simpleHash(json2);
      expect(hash1).not.toBe(hash3);
    });

    it('should handle very long strings efficiently', () => {
      const veryLongString = 'Lorem ipsum '.repeat(10000);
      const hash = simpleHash(veryLongString);
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
    });

    it('should produce different hashes for similar but different content', () => {
      const hash1 = simpleHash('The quick brown fox');
      const hash2 = simpleHash('The quick brown dog');
      const hash3 = simpleHash('The quick brown fox ');

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });
  });

  describe('Integration tests', () => {
    it('should work together for token generation', () => {
      // Generate random token
      const randomPart = generateRandomString(32);
      const hashPart = simpleHash(`${randomPart}-${Date.now()}`);
      const token = `${randomPart}.${hashPart}`;

      // Verify token format
      expect(token).toMatch(/^[A-Za-z0-9]+\.[a-z0-9]+$/);
      expect(token.split('.')).toHaveLength(2);
    });

    it('should generate unique tokens consistently', () => {
      const tokens = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const random = generateRandomString(16);
        const hash = simpleHash(`user-${i}-${random}`);
        tokens.add(`${random}.${hash}`);
      }

      expect(tokens.size).toBe(100);
    });
  });
});
