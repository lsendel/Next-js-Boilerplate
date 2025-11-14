/**
 * Integration Tests for Utility Functions
 *
 * Tests how utility functions work together and interact with each other
 */

import { describe, expect, it } from 'vitest';
import {
  capitalize,
  formatCurrency,
  formatDate,
  formatNumber,
  slugify,
  truncate,
} from '@/shared/utils/format';
import { generateRandomString, simpleHash } from '@/shared/utils/crypto';
import {
  hasMaxLength,
  hasMinLength,
  isNonEmptyString,
  isValidEmail,
  isValidUrl,
  isValidUUID,
} from '@/shared/utils/validation';

describe('Utility Functions Integration Tests', () => {
  describe('Format + Validation Integration', () => {
    it('should format and validate blog post metadata', () => {
      const title = 'How to Build Modern Web Applications';
      const author = 'john doe';
      const publishDate = new Date('2024-01-15T12:00:00.000Z');
      const views = 12345;
      const summary = 'This is a comprehensive guide to building modern web applications with Next.js, React, and TypeScript. Learn best practices and advanced techniques.';

      // Format the data
      const formattedTitle = capitalize(title.toLowerCase());
      const slug = slugify(title);
      const formattedAuthor = capitalize(author);
      const formattedDate = formatDate(publishDate, 'en-US');
      const formattedViews = formatNumber(views, 'en-US');
      const truncatedSummary = truncate(summary, 100);

      // Validate the formatted data
      expect(isNonEmptyString(formattedTitle)).toBe(true);
      expect(isNonEmptyString(slug)).toBe(true);
      expect(isNonEmptyString(formattedAuthor)).toBe(true);
      expect(hasMinLength(slug, 1)).toBe(true);
      expect(hasMaxLength(truncatedSummary, 103)).toBe(true); // 100 chars + "..."

      // Verify formatting worked correctly
      expect(formattedTitle).toContain('How to build');
      expect(slug).toBe('how-to-build-modern-web-applications');
      expect(formattedAuthor).toBe('John doe');
      expect(formattedDate).toContain('2024');
      expect(formattedViews).toBe('12,345');
      expect(truncatedSummary.length).toBeLessThanOrEqual(103);
    });

    it('should format and validate user profile data', () => {
      const name = 'JANE SMITH';
      const email = 'jane.smith@example.com';
      const bio = 'Software engineer passionate about web development and open source. Building amazing things with React and TypeScript!';
      const website = 'https://janesmith.dev';

      // Format the data
      const formattedName = capitalize(name);
      const truncatedBio = truncate(bio, 80);

      // Validate the data
      expect(isValidEmail(email)).toBe(true);
      expect(isValidUrl(website)).toBe(true);
      expect(hasMinLength(formattedName, 1)).toBe(true);
      expect(hasMaxLength(truncatedBio, 83)).toBe(true);

      // Verify formatting
      expect(formattedName).toBe('Jane smith');
      expect(truncatedBio.length).toBeLessThanOrEqual(83);
    });

    it('should format and validate e-commerce product', () => {
      const productName = 'premium wireless headphones 2024';
      const price = 299.99;
      const description = 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.';
      const sku = 'WH-2024-PRO';

      // Format the data
      const formattedName = capitalize(productName);
      const slug = slugify(productName);
      const formattedPrice = formatCurrency(price, 'USD', 'en-US');
      const truncatedDescription = truncate(description, 120);

      // Validate
      expect(isNonEmptyString(formattedName)).toBe(true);
      expect(isNonEmptyString(slug)).toBe(true);
      expect(hasMinLength(sku, 5)).toBe(true);
      expect(hasMaxLength(truncatedDescription, 123)).toBe(true);

      // Verify
      expect(formattedName).toBe('Premium wireless headphones 2024');
      expect(slug).toBe('premium-wireless-headphones-2024');
      expect(formattedPrice).toBe('$299.99');
    });
  });

  describe('Crypto + Validation Integration', () => {
    it('should generate and validate session tokens', () => {
      const tokenLength = 32;
      const token = generateRandomString(tokenLength);

      // Validate token properties
      expect(token).toHaveLength(tokenLength);
      expect(isNonEmptyString(token)).toBe(true);
      expect(hasMinLength(token, 32)).toBe(true);
      expect(hasMaxLength(token, 32)).toBe(true);

      // Generate hash of token
      const hash = simpleHash(token);
      expect(isNonEmptyString(hash)).toBe(true);

      // Verify consistency
      const hash2 = simpleHash(token);
      expect(hash).toBe(hash2);
    });

    it('should generate and validate API keys', () => {
      const prefix = 'sk';
      const randomPart = generateRandomString(48);
      const apiKey = `${prefix}_${randomPart}`;

      // Validate format
      expect(apiKey.startsWith('sk_')).toBe(true);
      expect(hasMinLength(apiKey, 48)).toBe(true);
      expect(isNonEmptyString(apiKey)).toBe(true);

      // Create deterministic hash for lookup
      const keyHash = simpleHash(apiKey);
      expect(isNonEmptyString(keyHash)).toBe(true);

      // Verify hash consistency (for database lookups)
      expect(simpleHash(apiKey)).toBe(keyHash);
    });

    it('should generate and validate UUIDs with hashing', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';

      // Validate UUID
      expect(isValidUUID(uuid)).toBe(true);

      // Generate hash for quick lookups
      const hash = simpleHash(uuid);
      expect(isNonEmptyString(hash)).toBe(true);

      // Verify hash is deterministic
      expect(simpleHash(uuid)).toBe(hash);
    });
  });

  describe('Multi-Format Data Pipeline', () => {
    it('should process user registration data end-to-end', () => {
      // Raw user input
      const rawData = {
        firstName: '  john  ',
        lastName: '  DOE  ',
        email: 'john.doe@EXAMPLE.com',
        username: 'John_Doe_2024',
        bio: 'Passionate developer building amazing products. Love coding, coffee, and open source. Always learning new technologies and sharing knowledge with the community.',
      };

      // Step 1: Normalize and format
      const firstName = capitalize(rawData.firstName.trim().toLowerCase());
      const lastName = capitalize(rawData.lastName.trim().toLowerCase());
      const email = rawData.email.toLowerCase();
      const username = slugify(rawData.username);
      const bio = truncate(rawData.bio, 150);

      // Step 2: Validate formatted data
      expect(isNonEmptyString(firstName)).toBe(true);
      expect(isNonEmptyString(lastName)).toBe(true);
      expect(isValidEmail(email)).toBe(true);
      expect(hasMinLength(username, 3)).toBe(true);
      expect(hasMaxLength(bio, 153)).toBe(true);

      // Step 3: Generate user-specific tokens
      const userId = generateRandomString(16);
      const sessionToken = generateRandomString(64);
      const userHash = simpleHash(email);

      // Step 4: Final validation
      expect(isNonEmptyString(userId)).toBe(true);
      expect(isNonEmptyString(sessionToken)).toBe(true);
      expect(isNonEmptyString(userHash)).toBe(true);

      // Step 5: Verify final output
      expect(firstName).toBe('John');
      expect(lastName).toBe('Doe');
      expect(email).toBe('john.doe@example.com');
      expect(username).toBe('john-doe-2024');
      expect(userId).toHaveLength(16);
      expect(sessionToken).toHaveLength(64);
    });

    it('should process article publishing workflow', () => {
      // Raw article data
      const article = {
        title: '  UNDERSTANDING REACT SERVER COMPONENTS  ',
        author: 'jane smith',
        content: 'Lorem ipsum '.repeat(100), // Very long content
        tags: ['React', 'Server Components', 'Next.js'],
        publishDate: new Date('2024-01-15T12:00:00.000Z'),
        views: 0,
      };

      // Step 1: Format metadata
      const title = capitalize(article.title.trim().toLowerCase());
      const slug = slugify(article.title);
      const author = article.author.split(' ').map(capitalize).join(' ');
      const excerpt = truncate(article.content, 200);
      const formattedDate = formatDate(article.publishDate, 'en-US');
      const formattedViews = formatNumber(article.views, 'en-US');

      // Step 2: Process tags
      const formattedTags = article.tags.map((tag) => slugify(tag));

      // Step 3: Generate identifiers
      const articleId = generateRandomString(12);
      const contentHash = simpleHash(article.content);

      // Step 4: Validate all processed data
      expect(isNonEmptyString(title)).toBe(true);
      expect(isNonEmptyString(slug)).toBe(true);
      expect(isNonEmptyString(author)).toBe(true);
      expect(hasMaxLength(excerpt, 203)).toBe(true);
      expect(formattedTags.every((tag) => isNonEmptyString(tag))).toBe(true);
      expect(articleId).toHaveLength(12);
      expect(isNonEmptyString(contentHash)).toBe(true);

      // Step 5: Verify specific formats
      expect(title).toBe('Understanding react server components');
      expect(slug).toBe('understanding-react-server-components');
      expect(author).toBe('Jane Smith');
      expect(formattedTags).toEqual(['react', 'server-components', 'nextjs']);
      expect(formattedDate).toContain('2024');
      expect(formattedViews).toBe('0');
    });

    it('should process e-commerce order pipeline', () => {
      const order = {
        customerName: 'JOHN DOE',
        email: 'john@example.com',
        total: 1234.56,
        items: [
          { name: 'Premium Widget', price: 299.99, quantity: 2 },
          { name: 'Super Gadget Pro', price: 634.58, quantity: 1 },
        ],
        shippingAddress: '123 Main Street, Apt 4B',
        orderDate: new Date('2024-01-20T15:30:00.000Z'),
      };

      // Step 1: Format customer data
      const customerName = capitalize(order.customerName);
      const email = order.email.toLowerCase();

      // Step 2: Format financial data
      const formattedTotal = formatCurrency(order.total, 'USD', 'en-US');
      const formattedItems = order.items.map((item) => ({
        name: capitalize(item.name.toLowerCase()),
        price: formatCurrency(item.price, 'USD', 'en-US'),
        quantity: formatNumber(item.quantity, 'en-US'),
      }));

      // Step 3: Format address
      truncate(order.shippingAddress, 50);

      // Step 4: Generate order identifiers
      const orderId = `ORD-${generateRandomString(8).toUpperCase()}`;
      const orderHash = simpleHash(
        `${email}-${order.orderDate.toISOString()}-${order.total}`,
      );

      // Step 5: Validate all data
      expect(isValidEmail(email)).toBe(true);
      expect(isNonEmptyString(customerName)).toBe(true);
      expect(hasMinLength(orderId, 12)).toBe(true);
      expect(isNonEmptyString(orderHash)).toBe(true);

      // Step 6: Verify formatting
      expect(customerName).toBe('John doe');
      expect(formattedTotal).toBe('$1,234.56');
      expect(formattedItems[0]?.name).toBe('Premium widget');
      expect(formattedItems[0]?.price).toBe('$299.99');
      expect(formattedItems[1]?.price).toBe('$634.58');
      expect(orderId.startsWith('ORD-')).toBe(true);
      expect(orderId).toHaveLength(12);
    });
  });

  describe('Security and Data Integrity', () => {
    it('should maintain data integrity through format-validate cycle', () => {
      const email = 'user@example.com';

      // Format and validate multiple times
      for (let i = 0; i < 5; i++) {
        const lower = email.toLowerCase();
        expect(isValidEmail(lower)).toBe(true);
        expect(lower).toBe('user@example.com');
      }
    });

    it('should generate consistent hashes for cache keys', () => {
      const cacheKeys = [
        'user:123:profile',
        'post:456:comments',
        'session:789:data',
      ];

      const hashes = cacheKeys.map((key) => simpleHash(key));

      // Hashes should be consistent
      expect(simpleHash(cacheKeys[0]!)).toBe(hashes[0]);
      expect(simpleHash(cacheKeys[1]!)).toBe(hashes[1]);
      expect(simpleHash(cacheKeys[2]!)).toBe(hashes[2]);

      // Hashes should be unique
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(3);
    });

    it('should validate formatted URLs before redirect', () => {
      const userInput = 'https://example.com/path?query=value';

      // Validate
      expect(isValidUrl(userInput)).toBe(true);

      // Format for display
      const truncatedUrl = truncate(userInput, 30);
      expect(truncatedUrl.length).toBeLessThanOrEqual(33);

      // Generate hash for tracking
      const urlHash = simpleHash(userInput);
      expect(isNonEmptyString(urlHash)).toBe(true);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large data volumes efficiently', () => {
      // Generate many random tokens
      const tokens = Array.from({ length: 100 }, () =>
        generateRandomString(32),
      );

      // All should be valid
      expect(tokens.every((t) => hasMinLength(t, 32))).toBe(true);
      expect(tokens.every((t) => hasMaxLength(t, 32))).toBe(true);

      // All should be unique
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(100);

      // Hashing should be fast and consistent
      const hashes = tokens.map((t) => simpleHash(t));
      expect(hashes.length).toBe(100);

      // Verify hash consistency
      expect(simpleHash(tokens[0]!)).toBe(hashes[0]);
    });

    it('should handle unicode and special characters across utilities', () => {
      const text = 'Café naïve 🎉';

      // Formatting
      const capitalized = capitalize(text.toLowerCase());
      const slug = slugify(text);

      // Validation
      expect(isNonEmptyString(capitalized)).toBe(true);
      expect(isNonEmptyString(slug)).toBe(true);

      // Hashing
      const hash = simpleHash(text);
      expect(isNonEmptyString(hash)).toBe(true);
      expect(simpleHash(text)).toBe(hash);
    });

    it('should handle empty and edge case inputs gracefully', () => {
      // Empty strings
      expect(isNonEmptyString('')).toBe(false);
      expect(slugify('')).toBe('');
      expect(truncate('', 10)).toBe('');

      // Single character
      expect(capitalize('a')).toBe('A');
      expect(slugify('a')).toBe('a');
      expect(truncate('a', 1)).toBe('a');

      // Zero values
      expect(formatNumber(0, 'en-US')).toBe('0');
      expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0.00');
    });
  });
});
