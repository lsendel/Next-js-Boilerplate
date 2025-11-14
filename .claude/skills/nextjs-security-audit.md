---
name: nextjs-security-audit
description: Security audit for Next.js with authentication, database, and API security
tools:
  - Bash
  - Read
  - Grep
---

# Next.js Security Audit Skill

Comprehensive security audit for this Next.js application.

## Security Layers:

### 1. Dependency Vulnerabilities
**Run**: `npm audit`
- Check for known CVEs
- Identify vulnerable packages
- Suggest updates or patches

### 2. Authentication Security (Clerk/Cloudflare Access)
**Audit**:
- [ ] Middleware protects `/dashboard` routes
- [ ] API routes validate authentication
- [ ] Server Actions check auth before execution
- [ ] Session management is secure
- [ ] No authentication bypass vulnerabilities
- [ ] Proper sign-out implementation

**Code patterns to check**:
```typescript
// ✅ Good: Check auth in Server Component
const user = await getCurrentUser();
if (!user) redirect('/sign-in');

// ❌ Bad: No auth check
export async function deleteUser(id: string) {
  // Anyone can call this!
}
```

### 3. API Security
**Check**:
- [ ] CSRF protection enabled
- [ ] Rate limiting configured (Arcjet)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] Proper error handling (no sensitive info leaks)
- [ ] API keys not exposed to client

**Scan for**:
```bash
# Direct SQL string concatenation (SQL injection risk)
grep -r 'db.execute.*\${' src/

# API keys in client components
grep -r 'process.env' src/app --include="*.tsx" | grep -v 'NEXT_PUBLIC'

# Unsafe JSON parsing
grep -r 'JSON.parse' src/
```

### 4. XSS Prevention
**Check**:
- [ ] All user input is sanitized
- [ ] `dangerouslySetInnerHTML` is properly sanitized (isomorphic-dompurify)
- [ ] No `eval()` or `Function()` constructor
- [ ] Content Security Policy (CSP) headers

**Scan for**:
```bash
# Unsafe HTML rendering
grep -r 'dangerouslySetInnerHTML' src/

# Direct DOM manipulation
grep -r 'innerHTML' src/
```

### 5. Environment Variables
**Audit**:
- [ ] Secrets in `.env.local` (NOT `.env`)
- [ ] No API keys in client components (unless `NEXT_PUBLIC_*`)
- [ ] Proper validation in `src/libs/Env.ts`
- [ ] No secrets committed to Git

**Check**:
```bash
# Scan for potential secrets
grep -rE '(api[_-]?key|secret|password|token)' .env*

# Check Git history for leaked secrets
git log -p | grep -E '(api[_-]?key|secret|password)'
```

### 6. Database Security
**Check**:
- [ ] DrizzleORM prevents SQL injection (parameterized queries)
- [ ] No raw SQL with user input
- [ ] Proper access control on database operations
- [ ] Connection strings not exposed

### 7. File Upload Security (if implemented)
**Check**:
- [ ] File type validation
- [ ] File size limits
- [ ] Virus scanning
- [ ] Files not executed by server
- [ ] Proper access control

### 8. Middleware Security
**Review** `src/middleware.ts`:
- [ ] Arcjet Shield WAF enabled
- [ ] Bot detection configured
- [ ] Rate limiting active
- [ ] Auth protection on sensitive routes

### 9. Third-Party Integrations
**Audit**:
- **Clerk**: Proper keyless mode config, webhook signature verification
- **Sentry**: No sensitive data in error logs
- **PostHog**: No PII in analytics events
- **Arcjet**: Properly configured rules

### 10. Next.js-Specific Security
**Check**:
- [ ] Server Actions have proper auth checks
- [ ] No sensitive data in client components
- [ ] Proper use of `server-only` package
- [ ] API routes validate request methods
- [ ] Metadata doesn't leak sensitive info

## Security Scanning Tools:

### Built-in
```bash
npm audit                    # Dependency vulnerabilities
npm run check:deps           # Unused dependencies (supply chain risk)
```

### Additional (install if needed)
```bash
# OWASP Dependency Check
npx @cyclonedx/cyclonedx-npm --output-file sbom.json

# Semgrep (static analysis)
npx semgrep scan --config auto

# ESLint security plugins
npm install -D eslint-plugin-security eslint-plugin-no-secrets
```

## Output Format:
```
🔒 Security Audit Report
========================

📊 Vulnerability Summary:
- Critical: X
- High: Y
- Medium: Z
- Low: A

🚨 Critical Issues:
1. [CVE-2024-XXXX] Package: vulnerable-package@1.0.0
   Severity: Critical
   Fix: npm install vulnerable-package@1.1.0

2. [AUTH-001] Missing authentication check in Server Action
   File: src/app/actions.ts:45
   Fix: Add `await getCurrentUser()` check

🔶 High Priority:
1. API keys exposed in client component
2. SQL injection risk in custom query

🔵 Recommendations:
1. Enable Arcjet Shield WAF
2. Add Content Security Policy headers
3. Implement rate limiting on API routes
4. Set up secret scanning in CI/CD

✅ Security Best Practices in Place:
- DrizzleORM prevents SQL injection
- Clerk authentication properly configured
- Input validation with Zod schemas
- DOMPurify sanitizes HTML
```

## Action Plan:
1. **Immediate**: Fix critical and high vulnerabilities
2. **Short-term**: Address medium issues, add security headers
3. **Long-term**: Implement comprehensive security testing in CI/CD
4. **Ongoing**: Regular dependency updates, security audits
