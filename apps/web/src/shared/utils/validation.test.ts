import { describe, expect, it } from 'vitest';
import {
  hasMaxLength,
  hasMinLength,
  isNonEmptyString,
  isPositiveNumber,
  isValidEmail,
  isValidUrl,
  isValidUUID,
} from './validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('user_name@example-domain.com')).toBe(true);
      expect(isValidEmail('123@test.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('user@exam ple.com')).toBe(false);
      expect(isValidEmail('user@@example.com')).toBe(false);
    });

    it('should return false for emails without TLD', () => {
      expect(isValidEmail('user@localhost')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });

    // Note: The current regex allows consecutive dots - this is a limitation
    // of the simple regex pattern used. For production, consider using a more
    // robust email validation library
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('https://example.com:8080')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true);
      expect(isValidUrl('https://example.com/path#hash')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('//example.com')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      // Note: 'http://.' is technically valid for URL constructor
    });

    it('should return true for URLs with special characters', () => {
      expect(isValidUrl('https://example.com/path?a=1&b=2')).toBe(true);
      expect(isValidUrl('https://example.com/path%20with%20spaces')).toBe(
        true,
      );
      expect(isValidUrl('https://user:pass@example.com')).toBe(true);
    });
  });

  describe('isValidUUID', () => {
    it('should return true for valid UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
      expect(isValidUUID('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')).toBe(true);
    });

    it('should return true for UUIDs with uppercase letters', () => {
      expect(isValidUUID('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
      expect(isValidUUID('A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11')).toBe(true);
    });

    it('should return false for invalid UUIDs', () => {
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false); // Too short
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000-extra')).toBe(
        false,
      ); // Too long
      expect(isValidUUID('123e4567e89b12d3a456426614174000')).toBe(false); // No hyphens
      expect(isValidUUID('123e4567-e89b-72d3-a456-426614174000')).toBe(false); // Invalid version (7)
      expect(isValidUUID('123e4567-e89b-12d3-f456-426614174000')).toBe(false); // Invalid variant (f)
    });

    it('should validate UUID version field (1-5)', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true); // v1
      expect(isValidUUID('123e4567-e89b-22d3-a456-426614174000')).toBe(true); // v2
      expect(isValidUUID('123e4567-e89b-32d3-a456-426614174000')).toBe(true); // v3
      expect(isValidUUID('123e4567-e89b-42d3-a456-426614174000')).toBe(true); // v4
      expect(isValidUUID('123e4567-e89b-52d3-a456-426614174000')).toBe(true); // v5
      expect(isValidUUID('123e4567-e89b-62d3-a456-426614174000')).toBe(false); // v6 (invalid)
    });

    it('should validate UUID variant field (8, 9, a, b)', () => {
      expect(isValidUUID('123e4567-e89b-12d3-8456-426614174000')).toBe(true);
      expect(isValidUUID('123e4567-e89b-12d3-9456-426614174000')).toBe(true);
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('123e4567-e89b-12d3-b456-426614174000')).toBe(true);
      expect(isValidUUID('123e4567-e89b-12d3-c456-426614174000')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-d456-426614174000')).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString('  text  ')).toBe(true);
      expect(isNonEmptyString('123')).toBe(true);
      expect(isNonEmptyString('!@#$%')).toBe(true);
    });

    it('should return false for empty or whitespace-only strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString('\t')).toBe(false);
      expect(isNonEmptyString('\n')).toBe(false);
      expect(isNonEmptyString('  \t\n  ')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(true)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
      expect(isNonEmptyString([])).toBe(false);
    });

    it('should provide type narrowing', () => {
      const value: unknown = 'test';
      if (isNonEmptyString(value)) {
        // TypeScript should recognize value as string here
        const length: number = value.length;
        expect(length).toBe(4);
      }
    });
  });

  describe('isPositiveNumber', () => {
    it('should return true for positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(0.1)).toBe(true);
      expect(isPositiveNumber(1000)).toBe(true);
      expect(isPositiveNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isPositiveNumber(Number.MIN_VALUE)).toBe(true);
    });

    it('should return false for zero and negative numbers', () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(-0.1)).toBe(false);
      expect(isPositiveNumber(-1000)).toBe(false);
    });

    it('should handle special numeric values', () => {
      expect(isPositiveNumber(Number.NaN)).toBe(false);
      // Note: POSITIVE_INFINITY is technically > 0, so it returns true
      expect(isPositiveNumber(Number.POSITIVE_INFINITY)).toBe(true);
      expect(isPositiveNumber(Number.NEGATIVE_INFINITY)).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(isPositiveNumber('1')).toBe(false);
      expect(isPositiveNumber(null)).toBe(false);
      expect(isPositiveNumber(undefined)).toBe(false);
      expect(isPositiveNumber(true)).toBe(false);
      expect(isPositiveNumber({})).toBe(false);
      expect(isPositiveNumber([])).toBe(false);
    });

    it('should provide type narrowing', () => {
      const value: unknown = 42;
      if (isPositiveNumber(value)) {
        // TypeScript should recognize value as number here
        const doubled: number = value * 2;
        expect(doubled).toBe(84);
      }
    });
  });

  describe('hasMinLength', () => {
    it('should return true when string meets minimum length', () => {
      expect(hasMinLength('hello', 5)).toBe(true);
      expect(hasMinLength('hello', 3)).toBe(true);
      expect(hasMinLength('hello', 1)).toBe(true);
      expect(hasMinLength('a', 1)).toBe(true);
    });

    it('should return false when string is shorter than minimum', () => {
      expect(hasMinLength('hello', 6)).toBe(false);
      expect(hasMinLength('hi', 3)).toBe(false);
      expect(hasMinLength('', 1)).toBe(false);
    });

    it('should handle zero minimum length', () => {
      expect(hasMinLength('', 0)).toBe(true);
      expect(hasMinLength('hello', 0)).toBe(true);
    });

    it('should count all characters including spaces', () => {
      expect(hasMinLength('hello world', 11)).toBe(true);
      expect(hasMinLength('   ', 3)).toBe(true);
    });

    it('should handle unicode characters', () => {
      expect(hasMinLength('🎉🎊', 2)).toBe(true);
      expect(hasMinLength('café', 4)).toBe(true);
    });
  });

  describe('hasMaxLength', () => {
    it('should return true when string is within maximum length', () => {
      expect(hasMaxLength('hello', 5)).toBe(true);
      expect(hasMaxLength('hello', 10)).toBe(true);
      expect(hasMaxLength('', 0)).toBe(true);
      expect(hasMaxLength('', 10)).toBe(true);
    });

    it('should return false when string exceeds maximum length', () => {
      expect(hasMaxLength('hello', 4)).toBe(false);
      expect(hasMaxLength('hello world', 10)).toBe(false);
      expect(hasMaxLength('a', 0)).toBe(false);
    });

    it('should count all characters including spaces', () => {
      expect(hasMaxLength('hello world', 11)).toBe(true);
      expect(hasMaxLength('   ', 3)).toBe(true);
      expect(hasMaxLength('   ', 2)).toBe(false);
    });

    it('should handle unicode characters', () => {
      // Note: Emojis count as 2 code units each in JavaScript
      expect(hasMaxLength('🎉🎊', 4)).toBe(true); // 2 emojis = 4 code units
      expect(hasMaxLength('🎉🎊', 3)).toBe(false);
      expect(hasMaxLength('café', 4)).toBe(true);
    });

    it('should work with very long strings', () => {
      const longString = 'a'.repeat(10000);
      expect(hasMaxLength(longString, 10000)).toBe(true);
      expect(hasMaxLength(longString, 9999)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle strings with special characters', () => {
      expect(isValidEmail('user+test@example.com')).toBe(true);
      expect(hasMinLength('!@#$%^&*()', 10)).toBe(true);
      expect(hasMaxLength('!@#$%^&*()', 10)).toBe(true);
    });

    it('should handle strings with newlines and tabs', () => {
      expect(hasMinLength('hello\nworld', 11)).toBe(true);
      expect(hasMinLength('hello\tworld', 11)).toBe(true);
      expect(isNonEmptyString('hello\nworld')).toBe(true);
    });

    it('should handle very long inputs', () => {
      const longString = 'a'.repeat(100000);
      expect(hasMinLength(longString, 100000)).toBe(true);
      expect(hasMaxLength(longString, 100001)).toBe(true);
    });
  });
});
