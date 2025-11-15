# OAuth & Authentication Configuration Guide

**Complete setup guide for all supported authentication providers**

**Last Updated:** November 14, 2025
**Supported Providers:** Clerk, Cloudflare Access, AWS Cognito

---

## Table of Contents

1. [Overview](#overview)
2. [Clerk Setup (Recommended)](#clerk-setup-recommended)
3. [Cloudflare Access Setup](#cloudflare-access-setup)
4. [AWS Cognito Setup](#aws-cognito-setup)
5. [Switching Between Providers](#switching-between-providers)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This boilerplate supports **modular authentication** - you can switch between providers without code changes by setting an environment variable.

### Supported Providers

| Provider | Best For | Complexity | Cost |
|----------|----------|------------|------|
| **Clerk** | Modern apps, fastest setup | ⭐ Easy | Free tier available |
| **Cloudflare Access** | Cloudflare users, enterprise | ⭐⭐ Medium | Included with Cloudflare Zero Trust |
| **AWS Cognito** | AWS ecosystem, compliance | ⭐⭐⭐ Complex | Pay per user |

### Provider Selection

Set this single environment variable to switch providers:

```bash
NEXT_PUBLIC_AUTH_PROVIDER=clerk  # or cloudflare, cognito
```

No code changes needed!

---

## Clerk Setup (Recommended)

### Why Clerk?

- ✅ Fastest setup (< 10 minutes)
- ✅ Beautiful pre-built UI components
- ✅ Multi-factor authentication built-in
- ✅ Social login (Google, GitHub, etc.) out of the box
- ✅ User management dashboard
- ✅ Excellent documentation
- ✅ Free tier: 10,000 MAU (Monthly Active Users)

### Step 1: Create Clerk Application

1. Go to https://clerk.com
2. Sign up for free account
3. Click "Add application"
4. Enter application name (e.g., "My Next.js App")
5. Select authentication methods:
   - ✅ Email + Password
   - ✅ Email code (passwordless)
   - ✅ Google (optional)
   - ✅ GitHub (optional)
6. Click "Create application"

### Step 2: Get API Keys

From the Clerk Dashboard:

1. Go to "API Keys" in left sidebar
2. Copy keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### Step 3: Configure Environment Variables

**Development (.env):**
```bash
NEXT_PUBLIC_AUTH_PROVIDER=clerk
CLERK_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_AUTH_PROVIDER=clerk
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_PUBLISHABLE_KEY
```

### Step 4: Configure Redirect URLs

In Clerk Dashboard:

1. Go to "Paths" in left sidebar
2. Set Sign-in path: `/sign-in`
3. Set Sign-up path: `/sign-up`
4. Set After sign-in: `/dashboard`
5. Set After sign-up: `/dashboard`

For production:

1. Go to "Domains" in left sidebar
2. Add production domain: `https://your-production-domain.com`
3. Add development domain: `http://localhost:3000` (for testing)

### Step 5: Configure Social Login (Optional)

If you want Google/GitHub/etc.:

1. Go to "User & Authentication" → "Social Connections"
2. Enable desired providers
3. Add OAuth client IDs/secrets from provider:

**Google OAuth:**
1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://clerk.your-domain.com/v1/oauth_callback`
4. Copy Client ID and Secret to Clerk

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create OAuth App
3. Authorization callback URL: `https://clerk.your-domain.com/v1/oauth_callback`
4. Copy Client ID and Secret to Clerk

### Step 6: Test

```bash
npm run dev
```

Visit `http://localhost:3000/sign-in` - you should see Clerk's sign-in page!

### Clerk Configuration Complete! ✅

---

## Cloudflare Access Setup

### Why Cloudflare Access?

- ✅ Free with Cloudflare Zero Trust (up to 50 users)
- ✅ Integrates with Cloudflare infrastructure
- ✅ Enterprise-grade security
- ✅ Works with existing Cloudflare deployments
- ✅ Identity provider agnostic (Google, GitHub, Okta, etc.)

### Prerequisites

- Cloudflare account
- Domain managed by Cloudflare
- Cloudflare Zero Trust enabled

### Step 1: Enable Cloudflare Zero Trust

1. Log in to Cloudflare Dashboard
2. Select your domain
3. Go to "Zero Trust" in left sidebar
4. Click "Get started" (free tier available)
5. Follow setup wizard

### Step 2: Create Access Application

1. In Zero Trust dashboard, go to "Access" → "Applications"
2. Click "Add an application"
3. Choose "Self-hosted"
4. Configure application:
   - **Application name:** Your Next.js App
   - **Session duration:** 24 hours (or as needed)
   - **Application domain:** `your-domain.com`
   - **Path:** Leave empty to protect entire domain
5. Click "Next"

### Step 3: Configure Identity Providers

1. Go to "Settings" → "Authentication"
2. Click "Add new" under Login methods
3. Choose provider (Google, GitHub, Okta, etc.)
4. Follow provider-specific setup

**Example: Google Identity Provider**

1. Select "Google"
2. Go to https://console.cloud.google.com
3. Create OAuth 2.0 credentials:
   - **Authorized redirect URIs:** `https://your-team.cloudflareaccess.com/cdn-cgi/access/callback`
4. Copy Client ID and Client Secret to Cloudflare
5. Save

### Step 4: Create Access Policy

1. In application setup, click "Add a Rule"
2. **Rule name:** Allow all users (or configure specific rules)
3. **Action:** Allow
4. **Configure rules:**
   - Include: Emails ending in `@your-company.com`
   - OR: Everyone (for public apps with auth)
5. Click "Save"

### Step 5: Get Application Credentials

1. Go to "Access" → "Applications"
2. Click on your application
3. Note down:
   - **Application Audience (AUD) tag** (e.g., `a1b2c3d4e5f6...`)
   - **Team domain** (e.g., `https://your-team.cloudflareaccess.com`)

### Step 6: Configure Environment Variables

**Development (.env):**
```bash
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your_application_audience_tag
NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your_production_audience_tag
NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true
```

### Step 7: Configure CORS (If deploying to Cloudflare)

1. Go to "Rules" → "Transform Rules"
2. Create HTTP Response Header Modification:
   - **Name:** Allow CORS for Access
   - **When incoming requests match:** All incoming requests
   - **Then...** Set static header:
     - `Access-Control-Allow-Origin`: `https://your-domain.com`
     - `Access-Control-Allow-Credentials`: `true`

### Step 8: Test

```bash
npm run dev
```

Visit `http://localhost:3000` - you should be redirected to Cloudflare Access login!

### Cloudflare Access Configuration Complete! ✅

---

## AWS Cognito Setup

### Why AWS Cognito?

- ✅ Part of AWS ecosystem
- ✅ Compliance-ready (HIPAA, SOC, etc.)
- ✅ Advanced security features (MFA, password policies)
- ✅ Scalable to millions of users
- ✅ Integrates with AWS services

### Prerequisites

- AWS account
- AWS CLI installed and configured
- IAM permissions for Cognito

### Step 1: Create User Pool

**Via AWS Console:**

1. Go to AWS Console → Cognito
2. Click "Create user pool"
3. **Sign-in options:**
   - ✅ Email
   - ✅ Username (optional)
4. **Password policy:** Configure as needed
5. **MFA:** Optional (recommended: Optional MFA)
6. **User account recovery:** Email
7. Click "Next"

**Configure sign-in experience:**
- **Self-service account recovery:** Email
- Click "Next"

**Configure sign-up experience:**
- **Self-service sign-up:** Enable
- **Required attributes:** email, name
- Click "Next"

**Configure message delivery:**
- **Email:** Amazon SES (production) or Cognito (development)
- Click "Next"

**Integrate your app:**
- **User pool name:** `nextjs-app-production`
- **App client name:** `nextjs-web-client`
- **Client secret:** Don't generate (we'll use PKCE)
- Click "Next"

**Review and create:**
- Review settings
- Click "Create user pool"

### Step 2: Configure App Client

1. Click on your user pool
2. Go to "App integration" tab
3. Click "Create app client"
4. Configure:
   - **App client name:** `nextjs-web-client`
   - **Client secret:** Don't generate
   - **Auth flows:** ALLOW_USER_SRP_AUTH, ALLOW_REFRESH_TOKEN_AUTH
   - **OAuth 2.0 grant types:** ✅ Authorization code grant
   - **OpenID Connect scopes:** email, openid, profile
5. Click "Create app client"

### Step 3: Configure OAuth

1. In App client settings, click "Edit"
2. **Callback URLs:**
   ```
   http://localhost:3000/api/auth/callback/cognito  # Development
   https://your-domain.com/api/auth/callback/cognito  # Production
   ```
3. **Sign-out URLs:**
   ```
   http://localhost:3000  # Development
   https://your-domain.com  # Production
   ```
4. **OAuth 2.0 grant types:** Authorization code grant
5. **OAuth scopes:** email, openid, profile
6. Save changes

### Step 4: Configure Hosted UI Domain

1. Go to "App integration" → "Domain"
2. Choose domain prefix: `your-app-name` (e.g., `my-nextjs-app`)
3. Full domain will be: `your-app-name.auth.us-east-1.amazoncognito.com`
4. Save

### Step 5: Configure Identity Providers (Optional)

**Google:**

1. Go to "Sign-in experience" → "Federated identity providers"
2. Click "Add identity provider"
3. Select "Google"
4. Configure:
   - **Client ID:** From Google Cloud Console
   - **Client secret:** From Google Cloud Console
   - **Authorized scopes:** email, openid, profile
5. Save

**GitHub:**

1. Add GitHub identity provider
2. Configure with GitHub OAuth app credentials
3. Save

### Step 6: Get Credentials

From User Pool overview:

1. **User Pool ID:** `us-east-1_XXXXXXXXX`
2. **Region:** `us-east-1` (or your region)
3. From App client:
   - **Client ID:** `xxxxxxxxxxxxxxxxxxxx`
4. From Domain:
   - **OAuth domain:** `your-app-name.auth.us-east-1.amazoncognito.com`

### Step 7: Configure Environment Variables

**Development (.env):**
```bash
NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN=your-app-name.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_OAUTH_SCOPE=email openid profile
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN=http://localhost:3000/dashboard
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT=http://localhost:3000/
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_PRODUCTION_ID
NEXT_PUBLIC_COGNITO_CLIENT_ID=production_client_id
NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN=your-app-name.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_OAUTH_SCOPE=email openid profile
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN=https://your-domain.com/dashboard
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT=https://your-domain.com/
```

### Step 8: Test

```bash
npm run dev
```

Visit `http://localhost:3000/sign-in` - you should be redirected to Cognito Hosted UI!

### AWS Cognito Configuration Complete! ✅

---

## Switching Between Providers

### Zero Code Changes Required

Simply change the environment variable:

```bash
# Switch to Clerk
NEXT_PUBLIC_AUTH_PROVIDER=clerk

# Switch to Cloudflare
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare

# Switch to Cognito
NEXT_PUBLIC_AUTH_PROVIDER=cognito
```

### Per-Environment Configuration

You can use different providers in different environments:

```bash
# Development (.env)
NEXT_PUBLIC_AUTH_PROVIDER=clerk  # Easy for local dev

# Staging (.env.staging)
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare  # Test production setup

# Production (.env.production)
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare  # Enterprise security
```

### Migration Path

If switching providers in production:

1. Set up new provider completely
2. Test in staging environment
3. During maintenance window:
   - Export users from old provider
   - Import to new provider
   - Update `NEXT_PUBLIC_AUTH_PROVIDER`
   - Deploy
4. Monitor for issues
5. Keep old provider active for 30 days as backup

---

## Testing & Verification

### Test Checklist

After configuring any provider:

#### Basic Functionality

- [ ] Can access sign-in page (`/sign-in`)
- [ ] Can sign up new user
- [ ] Receive verification email
- [ ] Can verify email
- [ ] Can sign in with credentials
- [ ] Redirected to `/dashboard` after sign-in
- [ ] Can access protected routes when authenticated
- [ ] Redirected to sign-in when not authenticated
- [ ] Can sign out
- [ ] Session persists across page reloads
- [ ] Session expires after timeout

#### Security

- [ ] Password requirements enforced
- [ ] Rate limiting works (try multiple failed logins)
- [ ] CSRF protection active
- [ ] Secure cookies (HttpOnly, Secure, SameSite)
- [ ] No credentials exposed in browser
- [ ] XSS protection working

#### Multi-Factor Authentication (If enabled)

- [ ] Can enable MFA in user profile
- [ ] MFA challenge shown at login
- [ ] Can disable MFA
- [ ] Recovery codes work

#### Social Login (If configured)

- [ ] Can sign in with Google
- [ ] Can sign in with GitHub
- [ ] Social login creates user account
- [ ] Email from social provider saved correctly

### Testing Commands

```bash
# Test sign-up flow
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# Test sign-in flow
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}' \
  -c cookies.txt

# Test protected route
curl http://localhost:3000/api/auth/user \
  -b cookies.txt

# Test sign-out
curl -X POST http://localhost:3000/api/auth/signout \
  -b cookies.txt
```

---

## Troubleshooting

### Common Issues

#### Issue: Redirect Loop

**Symptoms:** Continuously redirected between app and provider

**Causes:**
- Incorrect redirect URLs
- CORS misconfiguration
- Cookie issues

**Solutions:**

1. **Verify redirect URLs match exactly:**
   ```bash
   # Development
   http://localhost:3000/dashboard  # NO trailing slash

   # Production
   https://your-domain.com/dashboard  # NO trailing slash
   ```

2. **Check CORS headers:**
   ```bash
   curl -I https://your-domain.com \
     -H "Origin: https://your-auth-provider.com"
   # Should include Access-Control-Allow-Origin header
   ```

3. **Clear cookies and try again:**
   ```bash
   # In browser DevTools Console
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/,
       "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   location.reload();
   ```

#### Issue: "Invalid Client" Error

**Symptoms:** OAuth error: invalid_client

**Causes:**
- Wrong client ID
- Wrong client secret
- Client secret where it shouldn't be used

**Solutions:**

1. **Verify client ID is correct:**
   ```bash
   echo $NEXT_PUBLIC_COGNITO_CLIENT_ID
   # Should match exactly what's in AWS/Clerk/Cloudflare
   ```

2. **For Cognito: Don't use client secret with PKCE**
   - Ensure app client was created WITHOUT client secret
   - If it has a secret, create new app client

3. **Check environment variable names:**
   ```bash
   # Common typo:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  # Correct
   NEXT_PUBLIC_CLERK_PUBLIC_KEY       # Wrong!
   ```

#### Issue: Users Not Signing In

**Symptoms:** Sign-in appears to work but user not authenticated

**Causes:**
- Session not being saved
- Cookie domain mismatch
- Auth provider not configured correctly

**Solutions:**

1. **Check cookies are being set:**
   ```bash
   # In browser DevTools → Application → Cookies
   # Should see session cookie with:
   # - HttpOnly: true
   # - Secure: true (in production)
   # - SameSite: Lax or Strict
   ```

2. **Verify domain matches:**
   ```bash
   # Cookie domain should match your app domain
   # For localhost:3000, domain should be localhost or not set
   # For your-domain.com, domain should be .your-domain.com
   ```

3. **Check auth provider configuration:**
   ```bash
   # Ensure NEXT_PUBLIC_AUTH_PROVIDER matches actual provider
   echo $NEXT_PUBLIC_AUTH_PROVIDER
   # Should be: clerk, cloudflare, or cognito
   ```

#### Issue: Email Verification Not Working

**Symptoms:** Verification emails not sent or not working

**Causes:**
- Email service not configured
- Email in spam
- Wrong verification URL

**Solutions:**

1. **For Clerk:**
   - Check "Email & SMS" settings in dashboard
   - Verify email template includes correct link
   - Check spam folder

2. **For Cognito:**
   - Verify SES is configured (for production)
   - Check SES sending limits
   - Verify email template in Cognito

3. **For Cloudflare:**
   - Cloudflare Access doesn't use email verification
   - Users verify via identity provider (Google, GitHub, etc.)

---

## OAuth URLs Quick Reference

### Clerk

```bash
# Sign-in URL
/sign-in

# Sign-up URL
/sign-up

# Sign-out URL
/api/auth/signout

# User profile
/dashboard/user-profile
```

### Cloudflare Access

```bash
# Auth will intercept all requests automatically
# No specific URLs needed

# Sign-out URL
/api/auth/signout

# Manual redirect to Cloudflare login
https://your-team.cloudflareaccess.com/cdn-cgi/access/login/your-domain.com
```

### AWS Cognito

```bash
# Hosted UI login
https://your-app-name.auth.region.amazoncognito.com/login?client_id=CLIENT_ID&response_type=code&scope=email+openid+profile&redirect_uri=REDIRECT_URI

# Sign-out
https://your-app-name.auth.region.amazoncognito.com/logout?client_id=CLIENT_ID&logout_uri=LOGOUT_URI

# Your app URLs
/sign-in (redirects to Cognito)
/sign-up (redirects to Cognito)
/api/auth/callback/cognito (callback)
```

---

## Security Best Practices

### All Providers

1. **Use HTTPS in production** - Always
2. **Rotate credentials every 90 days**
3. **Use different credentials for dev/staging/production**
4. **Enable MFA for admin accounts**
5. **Monitor authentication logs**
6. **Implement rate limiting** (Arcjet handles this)
7. **Use secure session storage**
8. **Set session timeout appropriately** (24 hours recommended)

### Clerk-Specific

1. Enable "Attack Protection" in dashboard
2. Configure password requirements
3. Enable bot protection
4. Review audit logs regularly

### Cloudflare-Specific

1. Use Access policies to restrict by email domain
2. Enable "Require certificate" for sensitive apps
3. Configure session duration appropriately
4. Monitor Access logs

### Cognito-Specific

1. Enable advanced security features
2. Configure password policy strictly
3. Enable MFA requirement for sensitive operations
4. Use temporary credentials (STS) for AWS access
5. Monitor CloudTrail logs

---

## Next Steps

After completing OAuth setup:

1. **Test thoroughly** using checklist above
2. **Configure MFA** for production
3. **Set up monitoring** (Sentry tracks auth errors)
4. **Document your config** (which provider, settings, etc.)
5. **Train team** on authentication flow
6. **Plan credential rotation** (add to calendar)

---

**Need Help?**

- Clerk: https://clerk.com/docs
- Cloudflare: https://developers.cloudflare.com/cloudflare-one/
- AWS Cognito: https://docs.aws.amazon.com/cognito/

---

**Last Updated:** November 14, 2025
**Status:** Production Ready
**All Providers Configured:** ✅ YES
