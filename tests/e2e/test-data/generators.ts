/**
 * Test Data Generators
 *
 * Provides realistic test data for E2E tests
 */

/**
 * Generate test user credentials
 */
export function generateUserCredentials() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  return {
    email: `test-${timestamp}-${random}@example.com`,
    password: 'Test@Password123!',
    firstName: 'Test',
    lastName: 'User',
  };
}

/**
 * Generate invalid email addresses for testing
 */
export function getInvalidEmails(): string[] {
  return [
    '',
    'invalid',
    'invalid@',
    '@invalid.com',
    'invalid@.com',
    'invalid@com',
    'invalid..email@example.com',
    'invalid email@example.com',
  ];
}

/**
 * Generate weak passwords for testing
 */
export function getWeakPasswords(): string[] {
  return [
    '',
    '12345',
    'password',
    'Password',
    'password123',
    '12345678',
    'abc123',
  ];
}

/**
 * Generate strong passwords for testing
 */
export function getStrongPasswords(): string[] {
  return [
    'Test@Password123!',
    'SecureP@ssw0rd!',
    'MyStr0ng!P@ss',
    'C0mplex!Pass#2024',
  ];
}

/**
 * Generate blog post data
 */
export function generateBlogPost() {
  const timestamp = Date.now();

  return {
    title: `Test Blog Post ${timestamp}`,
    slug: `test-blog-post-${timestamp}`,
    excerpt: 'This is a test blog post excerpt for E2E testing purposes.',
    content: `
      # Test Blog Post Content

      This is the main content of the test blog post. It includes:

      - **Bold text**
      - *Italic text*
      - [Links](https://example.com)
      - Lists
      - And more formatting options

      ## Subsection

      Additional content to test rendering and display.
    `,
    author: 'Test Author',
    publishedAt: new Date().toISOString(),
    tags: ['test', 'e2e', 'automation'],
    featured: false,
  };
}

/**
 * Generate portfolio item data
 */
export function generatePortfolioItem() {
  const timestamp = Date.now();

  return {
    title: `Test Portfolio Item ${timestamp}`,
    slug: `test-portfolio-${timestamp}`,
    description: 'This is a test portfolio item for E2E testing.',
    image: '/images/portfolio-placeholder.jpg',
    url: 'https://example.com',
    technologies: ['React', 'TypeScript', 'Next.js'],
    category: 'Web Development',
  };
}

/**
 * Generate comment data
 */
export function generateComment() {
  const timestamp = Date.now();

  return {
    author: `Test User ${timestamp}`,
    email: `test-${timestamp}@example.com`,
    content: `This is a test comment generated at ${new Date().toISOString()}`,
  };
}

/**
 * Generate form submission data
 */
export function generateContactForm() {
  const timestamp = Date.now();

  return {
    name: `Test User ${timestamp}`,
    email: `test-${timestamp}@example.com`,
    subject: 'Test Subject',
    message: 'This is a test message for the contact form.',
  };
}

/**
 * Generate pricing plan data
 */
export function getPricingPlans() {
  return [
    {
      name: 'Free',
      price: 0,
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      price: 29,
      features: ['All Free features', 'Feature 4', 'Feature 5', 'Priority Support'],
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: 99,
      features: [
        'All Pro features',
        'Feature 6',
        'Feature 7',
        'Dedicated Support',
        'Custom Integration',
      ],
      cta: 'Contact Sales',
    },
  ];
}

/**
 * Generate test locales
 */
export function getTestLocales() {
  return [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ];
}

/**
 * Generate random integer between min and max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random string
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 */
export function randomEmail(): string {
  return `test-${randomString(10)}@example.com`;
}

/**
 * Select random item from array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T;
}
