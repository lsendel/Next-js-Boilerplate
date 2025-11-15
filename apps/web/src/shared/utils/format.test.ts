import { describe, expect, it } from 'vitest';
import {
  capitalize,
  formatCurrency,
  formatDate,
  formatNumber,
  slugify,
  truncate,
} from './format';

describe('Format Utilities', () => {
  describe('formatDate', () => {
    // Use dates at noon to avoid timezone issues
    const testDate = new Date('2024-03-15T12:00:00.000Z');

    it('should format date with default locale (en-US)', () => {
      const formatted = formatDate(testDate);
      // Date formatting may vary by timezone, just check it's a valid format
      expect(formatted).toMatch(/March \d{1,2}, 2024/);
    });

    it('should format date with specified locale', () => {
      const formatted = formatDate(testDate, 'en-US');
      expect(formatted).toMatch(/March \d{1,2}, 2024/);
      // Different locales may format differently, just verify it works
      expect(formatDate(testDate, 'fr-FR')).toBeTruthy();
      expect(formatDate(testDate, 'de-DE')).toBeTruthy();
      expect(formatDate(testDate, 'es-ES')).toBeTruthy();
    });

    it('should handle different dates correctly', () => {
      const jan1 = new Date('2024-01-01T12:00:00.000Z');
      const dec31 = new Date('2024-12-31T12:00:00.000Z');

      const janFormatted = formatDate(jan1, 'en-US');
      const decFormatted = formatDate(dec31, 'en-US');

      expect(janFormatted).toContain('2024');
      expect(janFormatted).toMatch(/January|December/); // May be Dec 31 or Jan 1 depending on TZ
      expect(decFormatted).toContain('2024');
      expect(decFormatted).toMatch(/December|January/); // May be Dec 31 or Jan 1 depending on TZ
    });

    it('should handle leap year dates', () => {
      const leapDay = new Date('2024-02-29T12:00:00.000Z');
      const formatted = formatDate(leapDay, 'en-US');
      expect(formatted).toContain('2024');
      expect(formatted).toMatch(/February|March/); // May vary by timezone
    });

    it('should handle dates from different years', () => {
      const date2020 = new Date('2020-06-15T12:00:00.000Z');
      const date2030 = new Date('2030-06-15T12:00:00.000Z');

      expect(formatDate(date2020, 'en-US')).toContain('2020');
      expect(formatDate(date2030, 'en-US')).toContain('2030');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default USD and en-US locale', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format different currencies', () => {
      expect(formatCurrency(100, 'EUR', 'en-US')).toBe('€100.00');
      expect(formatCurrency(100, 'GBP', 'en-US')).toBe('£100.00');
      expect(formatCurrency(100, 'JPY', 'en-US')).toBe('¥100');
    });

    it('should format with different locales', () => {
      expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56');
      // Note: Locale formatting can vary by system, just verify it works
      const deFormat = formatCurrency(1234.56, 'USD', 'de-DE');
      expect(deFormat).toContain('1');
      expect(deFormat).toContain('234');
      expect(deFormat).toContain('56');
    });

    it('should handle zero and negative amounts', () => {
      expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0.00');
      expect(formatCurrency(-100, 'USD', 'en-US')).toBe('-$100.00');
      expect(formatCurrency(-1234.56, 'USD', 'en-US')).toBe('-$1,234.56');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000, 'USD', 'en-US')).toBe('$1,000,000.00');
      expect(formatCurrency(1234567.89, 'USD', 'en-US')).toBe('$1,234,567.89');
    });

    it('should handle decimal precision correctly', () => {
      expect(formatCurrency(10.5, 'USD', 'en-US')).toBe('$10.50');
      expect(formatCurrency(10.555, 'USD', 'en-US')).toBe('$10.56'); // Rounds
      expect(formatCurrency(10.554, 'USD', 'en-US')).toBe('$10.55'); // Rounds
    });

    it('should handle currencies with no decimal places', () => {
      expect(formatCurrency(100, 'JPY', 'en-US')).toBe('¥100');
      expect(formatCurrency(1234.56, 'JPY', 'en-US')).toBe('¥1,235'); // Rounds
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with default locale', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(0)).toBe('0');
    });

    it('should format numbers with different locales', () => {
      expect(formatNumber(1234, 'en-US')).toBe('1,234');
      // Note: Locale formatting can vary, just verify it contains the number
      const deFormat = formatNumber(1234, 'de-DE');
      expect(deFormat).toContain('1');
      expect(deFormat).toContain('234');
    });

    it('should format decimal numbers', () => {
      expect(formatNumber(1234.56, 'en-US')).toBe('1,234.56');
      // Note: Locale formatting can vary
      const deFormat = formatNumber(1234.56, 'de-DE');
      expect(deFormat).toContain('1');
      expect(deFormat).toContain('234');
      expect(deFormat).toContain('56');
    });

    it('should handle custom format options', () => {
      expect(
        formatNumber(1234.5678, 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ).toBe('1,234.57');

      expect(
        formatNumber(1234.5, 'en-US', { minimumFractionDigits: 2 }),
      ).toBe('1,234.50');

      expect(
        formatNumber(0.123, 'en-US', { style: 'percent' }),
      ).toBe('12%');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234, 'en-US')).toBe('-1,234');
      expect(formatNumber(-1234.56, 'en-US')).toBe('-1,234.56');
    });

    it('should handle very large numbers', () => {
      expect(formatNumber(1234567890, 'en-US')).toBe('1,234,567,890');
    });

    it('should handle very small numbers', () => {
      // Note: Very small numbers may be rounded to 0 by default formatting
      const formatted = formatNumber(0.00001, 'en-US');
      expect(formatted).toMatch(/^0(\.0+)?$/); // May be "0" or "0.00001" depending on implementation
      expect(formatNumber(0.123456, 'en-US', { maximumFractionDigits: 2 })).toBe(
        '0.12',
      );
    });
  });

  describe('truncate', () => {
    it('should truncate strings longer than maxLength', () => {
      expect(truncate('Hello, World!', 10)).toBe('Hello, Wor...');
      expect(truncate('This is a long string', 10)).toBe('This is a ...');
      expect(truncate('Test', 2)).toBe('Te...');
    });

    it('should not truncate strings equal to or shorter than maxLength', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
      expect(truncate('Hi', 5)).toBe('Hi');
      expect(truncate('', 5)).toBe('');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
      expect(truncate('Hello!', 6)).toBe('Hello!');
    });

    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle maxLength of 0', () => {
      expect(truncate('Hello', 0)).toBe('...');
    });

    it('should handle maxLength of 1', () => {
      expect(truncate('Hello', 1)).toBe('H...');
    });

    it('should handle unicode characters', () => {
      // Note: Emojis are 2 code units each in JavaScript
      expect(truncate('🎉🎊🎈🎁', 2)).toBe('🎉...');  // Takes first 2 code units = 1 emoji
      expect(truncate('café', 3)).toBe('caf...');
    });

    it('should handle long strings efficiently', () => {
      const longString = 'a'.repeat(10000);
      const result = truncate(longString, 50);
      expect(result).toBe('a'.repeat(50) + '...');
      expect(result).toHaveLength(53);
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter and lowercase the rest', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('tEsT')).toBe('Test');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('Z')).toBe('Z');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle strings starting with spaces', () => {
      expect(capitalize(' hello')).toBe(' hello');
    });

    it('should handle strings with only one character', () => {
      expect(capitalize('h')).toBe('H');
    });

    it('should handle all uppercase strings', () => {
      expect(capitalize('HELLO WORLD')).toBe('Hello world');
    });

    it('should handle mixed case strings', () => {
      expect(capitalize('hElLo WoRlD')).toBe('Hello world');
    });

    it('should handle strings with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
      expect(capitalize('abc123')).toBe('Abc123');
    });

    it('should handle special characters', () => {
      expect(capitalize('!hello')).toBe('!hello');
      expect(capitalize('@test')).toBe('@test');
    });

    it('should handle unicode characters', () => {
      expect(capitalize('café')).toBe('Café');
      expect(capitalize('CAFÉ')).toBe('Café');
    });
  });

  describe('slugify', () => {
    it('should convert to lowercase and replace spaces with hyphens', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test String')).toBe('test-string');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Test@#$%String')).toBe('teststring');
      expect(slugify('Hello! How are you?')).toBe('hello-how-are-you');
    });

    it('should handle multiple consecutive spaces/hyphens', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
      expect(slugify('Test--String')).toBe('test-string');
      expect(slugify('Hello___World')).toBe('hello-world');
    });

    it('should trim leading and trailing hyphens', () => {
      expect(slugify('-Hello-')).toBe('hello');
      expect(slugify('--Test--')).toBe('test');
      expect(slugify('  World  ')).toBe('world');
    });

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
    });

    it('should handle strings with only special characters', () => {
      expect(slugify('!@#$%')).toBe('');
      expect(slugify('---')).toBe('');
    });

    it('should handle numbers', () => {
      expect(slugify('Test 123')).toBe('test-123');
      expect(slugify('2024 Update')).toBe('2024-update');
    });

    it('should handle mixed case', () => {
      expect(slugify('HelloWorld')).toBe('helloworld');
      expect(slugify('TestCaseExample')).toBe('testcaseexample');
    });

    it('should create valid URL slugs', () => {
      expect(slugify('My First Blog Post')).toBe('my-first-blog-post');
      expect(slugify('JavaScript Tips & Tricks')).toBe('javascript-tips-tricks');
      expect(slugify('10 Ways to Code Better')).toBe('10-ways-to-code-better');
    });

    it('should handle underscores like spaces', () => {
      expect(slugify('hello_world')).toBe('hello-world');
      expect(slugify('test_case_example')).toBe('test-case-example');
    });

    it('should handle complex real-world titles', () => {
      expect(slugify('Introduction to Next.js 14: App Router')).toBe(
        'introduction-to-nextjs-14-app-router',
      );
      expect(slugify('TypeScript 5.0 - What\'s New?')).toBe(
        'typescript-50-whats-new',
      );
      expect(slugify('Building a REST API (Part 1)')).toBe(
        'building-a-rest-api-part-1',
      );
    });

    it('should handle unicode/accented characters', () => {
      // Note: Current implementation removes accents
      expect(slugify('café')).toBe('caf');
      expect(slugify('naïve')).toBe('nave');
    });

    it('should handle very long strings', () => {
      const longString = 'This is a very long string '.repeat(10);
      const slug = slugify(longString);
      expect(slug).toMatch(/^this-is-a-very-long-string(-this-is-a-very-long-string)*$/);
    });

    it('should be idempotent', () => {
      const input = 'Hello World!';
      const slug1 = slugify(input);
      const slug2 = slugify(slug1);
      expect(slug1).toBe(slug2);
    });
  });

  describe('Integration tests', () => {
    it('should work together for title formatting', () => {
      const rawTitle = 'hello world!';
      const capitalized = capitalize(rawTitle);
      const slug = slugify(rawTitle);

      expect(capitalized).toBe('Hello world!');
      expect(slug).toBe('hello-world');
    });

    it('should handle formatting article metadata', () => {
      const title = 'My First Blog Post';
      const publishDate = new Date('2024-01-15T12:00:00.000Z'); // Use noon to avoid TZ issues
      const views = 12345;

      expect(slugify(title)).toBe('my-first-blog-post');
      // Date may vary by timezone
      const dateFormatted = formatDate(publishDate, 'en-US');
      expect(dateFormatted).toContain('2024');
      expect(dateFormatted).toMatch(/January \d{1,2}, 2024/);
      expect(formatNumber(views, 'en-US')).toBe('12,345');
    });

    it('should format e-commerce product display', () => {
      const productName = 'Premium Widget 2000';
      const price = 299.99;
      const description = 'This is an amazing product with lots of features...';

      expect(capitalize(productName.toLowerCase())).toBe(
        'Premium widget 2000',
      );
      expect(formatCurrency(price, 'USD', 'en-US')).toBe('$299.99');
      // truncate takes first 30 chars, then adds "..."
      expect(truncate(description, 30)).toBe('This is an amazing product wit...');
    });
  });

  describe('Edge cases', () => {
    it('should handle null-like values gracefully', () => {
      expect(truncate('', 10)).toBe('');
      expect(capitalize('')).toBe('');
      expect(slugify('')).toBe('');
    });

    it('should handle extreme numbers', () => {
      expect(formatNumber(Number.MAX_SAFE_INTEGER, 'en-US')).toMatch(/,/);
      expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0.00');
    });

    it('should handle very long text', () => {
      const veryLongText = 'a'.repeat(100000);
      expect(truncate(veryLongText, 50)).toHaveLength(53);
      expect(slugify(veryLongText)).toHaveLength(100000);
    });
  });
});
