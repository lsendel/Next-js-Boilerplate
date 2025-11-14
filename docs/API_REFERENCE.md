# API Reference

This document provides comprehensive documentation for all API endpoints in the Next.js Boilerplate application.

## Table of Contents

- [Overview](#overview)
- [Authentication & Security](#authentication--security)
  - [Rate Limiting](#rate-limiting)
  - [CSRF Protection](#csrf-protection)
- [Authentication Endpoints](#authentication-endpoints)
  - [GET /api/auth/csrf](#get-apiauthcsrf)
  - [GET /api/auth/user](#get-apiauthuser)
  - [POST /api/auth/validate-password](#post-apiauthvalidate-password)
- [Example Endpoints](#example-endpoints)
  - [PUT /api/counter](#put-apicounter)

---

## Overview

All API endpoints follow REST principles and return JSON responses. The API implements comprehensive security measures including:

- CSRF token protection for state-changing operations
- Rate limiting per endpoint type
- Bot detection via Arcjet
- Authentication via modular auth system (Clerk/Cloudflare/Cognito)

### Base URL

- **Development**: `http://localhost:3000`
- **Production**: Your deployed domain

### Common Response Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Invalid CSRF token or blocked by security |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Authentication & Security

### Rate Limiting

All authentication endpoints are protected by rate limiting to prevent brute force attacks. Rate limits vary by operation:

| Operation | Max Attempts | Window | Block Duration |
|-----------|-------------|--------|----------------|
| Sign In | 5 | 15 minutes | 1 hour |
| Sign Up | 3 | 1 hour | 24 hours |
| Password Reset | 3 | 1 hour | 2 hours |
| MFA Verify | 5 | 10 minutes | 30 minutes |
| OAuth Callback | 10 | 1 minute | 5 minutes |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 2025-11-14T10:30:00.000Z
Retry-After: 3600
```

**Rate Limit Error Response:**

```json
{
  "error": "Too many attempts. Please try again in 45 minutes.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### CSRF Protection

State-changing requests (POST, PUT, PATCH, DELETE) require CSRF token validation using the double-submit cookie pattern.

**How to use:**

1. Fetch CSRF token from `/api/auth/csrf`
2. Include token in `x-csrf-token` header for protected requests
3. Token is also set as `__Host-csrf-token` cookie (httpOnly, secure, sameSite: strict)

**Token Properties:**

- Length: 32 bytes (base64url encoded)
- Lifetime: 24 hours
- Storage: HttpOnly cookie + request header
- Validation: Constant-time comparison to prevent timing attacks

---

## Authentication Endpoints

### GET /api/auth/csrf

Generates and returns a CSRF token for client-side authentication operations.

#### Request

**Method:** `GET`

**Headers:**
```
(No special headers required)
```

#### Response

**Success (200):**

```json
{
  "csrfToken": "xY7zK9mN4pQ2rT8vW5hL3jD6fG1sA0bC"
}
```

**Headers:**
```
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Set-Cookie: __Host-csrf-token=xY7zK9mN4pQ2rT8vW5hL3jD6fG1sA0bC; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
```

**Error (500):**

```json
{
  "error": "Failed to generate CSRF token",
  "code": "CSRF_TOKEN_GENERATION_FAILED"
}
```

#### Example

**cURL:**

```bash
curl -X GET https://your-domain.com/api/auth/csrf
```

**JavaScript (Fetch):**

```javascript
const response = await fetch('/api/auth/csrf');
const data = await response.json();
const csrfToken = data.csrfToken;

// Store token for subsequent requests
localStorage.setItem('csrfToken', csrfToken);
```

**Next.js Client Component:**

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function CsrfExample() {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    async function fetchCsrfToken() {
      const response = await fetch('/api/auth/csrf');
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    }
    fetchCsrfToken();
  }, []);

  return <div>CSRF Token: {csrfToken}</div>;
}
```

---

### GET /api/auth/user

Retrieves the current authenticated user's information.

#### Request

**Method:** `GET`

**Authentication:** Required (session-based)

**Headers:**
```
Cookie: __session=<session-cookie>
```

#### Response

**Success (200):**

```json
{
  "id": "user_2abc123def456",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "imageUrl": "https://img.clerk.com/user_2abc123def456"
}
```

**Unauthorized (401):**

```json
{
  "error": "Not authenticated"
}
```

**Error (500):**

```json
{
  "error": "Failed to fetch user"
}
```

#### Example

**cURL:**

```bash
curl -X GET https://your-domain.com/api/auth/user \
  -H "Cookie: __session=<your-session-cookie>"
```

**JavaScript (Fetch):**

```javascript
const response = await fetch('/api/auth/user', {
  credentials: 'include', // Include cookies
});

if (response.ok) {
  const user = await response.json();
  console.log('Current user:', user);
} else if (response.status === 401) {
  console.log('User not authenticated');
}
```

**Next.js Server Component:**

```typescript
import { getCurrentUser } from '@/libs/auth';

export default async function UserProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

### POST /api/auth/validate-password

Validates password strength and checks if the password has been compromised in data breaches using the Have I Been Pwned (HIBP) API with k-anonymity protection.

#### Request

**Method:** `POST`

**Rate Limit:** 3 attempts per hour (Sign Up rate limit)

**CSRF Protection:** Required

**Headers:**
```
Content-Type: application/json
x-csrf-token: <csrf-token>
Cookie: __Host-csrf-token=<csrf-token>
```

**Body:**

```json
{
  "password": "MySecurePassword123!"
}
```

**Body Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| password | string | Yes | Password to validate |

#### Response

**Success (200):**

```json
{
  "valid": true,
  "score": 85,
  "message": null,
  "feedback": [],
  "breached": false,
  "occurrences": 0
}
```

**Response with validation errors:**

```json
{
  "valid": false,
  "score": 45,
  "message": "Password must be at least 8 characters long. Include special characters.",
  "feedback": [
    "Password must be at least 8 characters long",
    "Include special characters"
  ],
  "breached": false,
  "occurrences": 0
}
```

**Response with breached password:**

```json
{
  "valid": false,
  "score": 75,
  "message": "This password has been found in 23,547 data breaches. Please choose a different password.",
  "feedback": [],
  "breached": true,
  "occurrences": 23547
}
```

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| valid | boolean | Overall validation result (strength + breach check) |
| score | number | Password strength score (0-100) |
| message | string \| null | User-friendly error message |
| feedback | string[] | Array of improvement suggestions |
| breached | boolean | Whether password was found in breaches |
| occurrences | number | Number of times found in breach databases |

**Bad Request (400):**

```json
{
  "error": "Password is required",
  "code": "INVALID_REQUEST"
}
```

**CSRF Error (403):**

```json
{
  "error": "Invalid CSRF token",
  "code": "CSRF_TOKEN_INVALID"
}
```

**Rate Limit (429):**

```json
{
  "error": "Too many attempts. Please try again in 45 minutes.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

**Headers:**
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 2025-11-14T11:00:00.000Z
Retry-After: 2700
```

**Server Error (500):**

```json
{
  "error": "Password validation failed",
  "code": "VALIDATION_ERROR"
}
```

#### Password Validation Rules

**Strength Criteria:**

| Criteria | Score | Requirement |
|----------|-------|-------------|
| Length >= 8 | 20 | Minimum 8 characters |
| Length >= 12 | +10 | Bonus for 12+ characters |
| Length >= 16 | +10 | Bonus for 16+ characters |
| Lowercase letters | 15 | At least one lowercase letter |
| Uppercase letters | 15 | At least one uppercase letter |
| Numbers | 15 | At least one number |
| Special characters | 15 | At least one special character |

**Penalties:**

- Common patterns (123, abc, qwerty, password, admin): -20 points
- Repeated characters (aaa, 111): -20 points
- Only numbers or only letters: -20 points

**Minimum passing score:** 60 points with no feedback issues

**Breach Check:**

- Uses Have I Been Pwned API with k-anonymity
- Only first 5 characters of SHA-1 hash are sent
- Cached for 24 hours
- Fails open (allows password) if API is unavailable

#### Example

**cURL:**

```bash
# First, get CSRF token
CSRF_TOKEN=$(curl -s -c cookies.txt https://your-domain.com/api/auth/csrf | jq -r '.csrfToken')

# Then validate password
curl -X POST https://your-domain.com/api/auth/validate-password \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: $CSRF_TOKEN" \
  -b cookies.txt \
  -d '{"password":"MySecurePassword123!"}'
```

**JavaScript (Fetch):**

```javascript
// First fetch CSRF token
const csrfResponse = await fetch('/api/auth/csrf');
const { csrfToken } = await csrfResponse.json();

// Then validate password
const response = await fetch('/api/auth/validate-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken,
  },
  credentials: 'include', // Include cookies
  body: JSON.stringify({
    password: 'MySecurePassword123!',
  }),
});

const result = await response.json();

if (result.valid) {
  console.log('Password is strong and not breached');
} else {
  console.log('Password validation failed:', result.message);
  console.log('Suggestions:', result.feedback);
}
```

**React Hook Example:**

```typescript
'use client';

import { useState } from 'react';

export function usePasswordValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState(null);

  const validatePassword = async (password: string) => {
    setIsValidating(true);

    try {
      // Fetch CSRF token
      const csrfResponse = await fetch('/api/auth/csrf');
      const { csrfToken } = await csrfResponse.json();

      // Validate password
      const response = await fetch('/api/auth/validate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setResult(data);
      return data;
    } catch (error) {
      console.error('Password validation failed:', error);
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  return { validatePassword, isValidating, result };
}
```

---

## Example Endpoints

### PUT /api/counter

Increments a counter value in the database. This is a demonstration endpoint showing form validation and database operations.

#### Request

**Method:** `PUT`

**Rate Limit:** API rate limit applies (configurable via environment variables)

**Headers:**
```
Content-Type: application/json
x-e2e-random-id: 0 (optional, for E2E testing isolation)
```

**Body:**

```json
{
  "increment": 2
}
```

**Body Schema:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| increment | number | Yes | min: 1, max: 3 | Amount to increment counter by |

**Validation:**

The request body is validated using Zod schema:
- `increment` must be a number
- `increment` must be between 1 and 3 (inclusive)

#### Response

**Success (200):**

```json
{
  "count": 5
}
```

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| count | number | Updated counter value after increment |

**Validation Error (422):**

```json
{
  "_root": [
    {
      "message": "Number must be greater than or equal to 1",
      "path": ["increment"]
    }
  ]
}
```

Validation errors use Zod's `treeifyError` format, providing detailed error paths and messages.

**Rate Limit (429):**

```json
{
  "error": "Too many requests"
}
```

**Headers:**
```
Retry-After: 60
```

#### Example

**cURL:**

```bash
curl -X PUT https://your-domain.com/api/counter \
  -H "Content-Type: application/json" \
  -d '{"increment":2}'
```

**JavaScript (Fetch):**

```javascript
const response = await fetch('/api/counter', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    increment: 2,
  }),
});

if (response.ok) {
  const data = await response.json();
  console.log('New count:', data.count);
} else if (response.status === 422) {
  const errors = await response.json();
  console.error('Validation errors:', errors);
}
```

**React Component Example:**

```typescript
'use client';

import { useState } from 'react';

export default function CounterForm() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleIncrement = async (increment: number) => {
    setError(null);

    try {
      const response = await fetch('/api/counter', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment }),
      });

      if (response.ok) {
        const data = await response.json();
        setCount(data.count);
      } else if (response.status === 422) {
        const errors = await response.json();
        setError('Invalid increment value (must be 1-3)');
      } else {
        setError('Failed to update counter');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => handleIncrement(1)}>+1</button>
      <button onClick={() => handleIncrement(2)}>+2</button>
      <button onClick={() => handleIncrement(3)}>+3</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

**E2E Testing with Isolation:**

```typescript
// For E2E tests, use x-e2e-random-id header to isolate test data
const testId = Math.floor(Math.random() * 1000000);

const response = await fetch('/api/counter', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-e2e-random-id': testId.toString(),
  },
  body: JSON.stringify({ increment: 1 }),
});
```

#### Implementation Notes

1. **Database Operations:**
   - Uses Drizzle ORM with PostgreSQL (production) or PGlite (development)
   - Implements upsert logic (insert or update on conflict)
   - Counter ID is derived from `x-e2e-random-id` header (default: 0)

2. **Logging:**
   - Counter increments are logged using LogTape
   - Logs include timestamp and structured data

3. **Validation:**
   - Zod schema validates request body before database operation
   - Invalid requests return 422 with detailed error tree

---

## Error Codes Reference

| Code | Description | Typical Status |
|------|-------------|----------------|
| CSRF_TOKEN_INVALID | CSRF token missing or invalid | 403 |
| CSRF_TOKEN_GENERATION_FAILED | Failed to generate CSRF token | 500 |
| RATE_LIMIT_EXCEEDED | Too many requests within time window | 429 |
| INVALID_REQUEST | Malformed request or missing required fields | 400 |
| VALIDATION_ERROR | Server-side validation failed | 500 |

---

## Security Considerations

### 1. CSRF Protection

All state-changing endpoints (POST, PUT, PATCH, DELETE) implement CSRF protection:

- Uses double-submit cookie pattern
- Tokens are cryptographically secure (32-byte random)
- Constant-time comparison prevents timing attacks
- 24-hour token lifetime

### 2. Rate Limiting

Multi-layered rate limiting:

- **Arcjet WAF:** Global bot detection and shield
- **API Rate Limiting:** Token bucket algorithm for API endpoints
- **Auth Rate Limiting:** Operation-specific limits with progressive block durations

### 3. Password Security

Password validation endpoint:

- Checks against 800M+ breached passwords via HIBP
- Uses k-anonymity (only 5-char hash prefix sent)
- Enforces strength requirements (length, diversity, patterns)
- Cached breach results for 24 hours

### 4. Headers

Security headers applied by middleware:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 5. Authentication

- Supports multiple providers: Clerk, Cloudflare Access, AWS Cognito
- Session-based authentication with secure cookies
- Protected routes enforced at middleware level
- Automatic session refresh

---

## Environment Configuration

### API Rate Limiting

Configure rate limits via environment variables:

```bash
# Arcjet Configuration
ARCJET_KEY=your_arcjet_key
ARCJET_MODE=LIVE              # LIVE or DRY_RUN
ARCJET_ALLOWED_BOTS=CATEGORY:SEARCH_ENGINE,CATEGORY:PREVIEW

# API Rate Limiting
ARCJET_API_REFILL_RATE=60     # Tokens per interval
ARCJET_API_INTERVAL=60s       # Time window (s/m/h/d)
ARCJET_API_CAPACITY=120       # Bucket capacity
ARCJET_API_RETRY_AFTER=60     # Seconds to retry after rate limit
```

### Authentication Provider

Switch authentication providers without code changes:

```bash
# Provider Selection
NEXT_PUBLIC_AUTH_PROVIDER=clerk  # clerk, cloudflare, or cognito

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudflare Access Configuration
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=your-team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your_audience_tag
NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true

# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_...
NEXT_PUBLIC_COGNITO_CLIENT_ID=...
```

### Database

```bash
# Production
DATABASE_URL=postgresql://user:password@host:5432/database

# Development (auto-configured)
# Uses PGlite in-memory database
```

---

## Additional Resources

- **API Playground:** Use tools like Postman or Insomnia with the examples above
- **Source Code:**
  - Counter endpoint: `/src/app/[locale]/api/counter/route.ts`
  - CSRF endpoint: `/src/app/api/auth/csrf/route.ts`
  - User endpoint: `/src/app/api/auth/user/route.ts`
  - Password validation: `/src/app/api/auth/validate-password/route.ts`
- **Middleware:** `/src/middleware.ts`
- **Validators:** `/src/shared/validators/`
- **Auth System:** `/src/libs/auth/`

---

## Support

For issues or questions:

1. Check the project README
2. Review CLAUDE.md for project-specific guidance
3. Check environment variables in `.env` and `.env.local`
4. Review logs in development (console) or production (Better Stack)
5. Check Sentry for error tracking

---

**Last Updated:** 2025-11-14

**API Version:** Next.js 16+ with App Router
