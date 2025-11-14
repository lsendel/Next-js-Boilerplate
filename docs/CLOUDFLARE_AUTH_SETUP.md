# Cloudflare Access Authentication Setup

This guide explains how to use Cloudflare Access as your authentication provider in this Next.js application.

## What is Cloudflare Access?

Cloudflare Access is a Zero Trust security service that provides authentication at the edge, before requests reach your application. It's ideal for:
- Enterprise applications requiring SSO
- Internal tools and dashboards
- Applications needing IP/location-based access control
- Teams already using Cloudflare infrastructure

## Prerequisites

1. A Cloudflare account
2. A domain configured in Cloudflare
3. Cloudflare Zero Trust subscription (Free tier available)

## Step 1: Configure Cloudflare Access

### 1.1 Create a Cloudflare Access Application

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Access** > **Applications**
3. Click **Add an application**
4. Select **Self-hosted**
5. Configure your application:
   - **Application name**: Your Next.js App
   - **Session Duration**: 24 hours (or your preference)
   - **Application domain**: Your domain (e.g., `app.yourdomain.com`)
   - **Subdomain**: Your subdomain (e.g., `app`)
   - **Path**: Leave blank to protect entire app, or specify paths

### 1.2 Configure Authentication Policies

1. In the policy configuration:
   - **Policy name**: Allow authenticated users
   - **Action**: Allow
   - **Include**: Add rules (e.g., Emails ending in @yourcompany.com)

2. Save the application

### 1.3 Get Your Team Domain and Audience Tag

1. Your **Team Domain** is in the format: `https://your-team.cloudflareaccess.com`
   - Find it in: Zero Trust Dashboard > Settings > Custom Pages
2. Your **Audience Tag** (AUD):
   - Go to your application settings
   - Copy the **Application Audience (AUD) Tag**

## Step 2: Configure Your Next.js Application

### 2.1 Update Environment Variables

Create or update `.env.local`:

```bash
# Switch to Cloudflare Access
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare

# Cloudflare Access Configuration
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your-application-audience-tag

# Optional: Enable JWT verification (recommended for production)
NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true
```

### 2.2 Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Restart
npm run dev
```

## Step 3: Test the Integration

1. Navigate to `http://localhost:3000`
2. Try to access a protected route (e.g., `/dashboard`)
3. You should be redirected to Cloudflare Access login
4. After authentication, you'll be redirected back to your app

## Features

### Implemented Features

✅ **Automatic Authentication**: Users are authenticated at the edge before reaching your app

✅ **JWT Verification** (Optional): Verify Cloudflare's JWT tokens in middleware

✅ **Custom Sign-in UI**: Branded redirect page with loading animation

✅ **User Profile**: Display user email and ID from Cloudflare headers

✅ **Sign-out**: Proper logout with redirect back to app

✅ **Protected Routes**: Middleware integration for route protection

✅ **Error Handling**: Graceful handling of missing configuration

### How It Works

1. **Authentication Flow**:
   ```
   User → Cloudflare Access → Authentication → Your Next.js App
   ```

2. **User Information**: Cloudflare passes user data via headers:
   - `Cf-Access-Authenticated-User-Email`: User's email
   - `Cf-Access-Authenticated-User-Id`: User's unique ID
   - `CF_Authorization`: JWT token (cookie)

3. **Middleware Protection**: The adapter checks for these headers on protected routes

## JWT Verification (Production Recommended)

### Why Enable JWT Verification?

- Validates that requests actually came through Cloudflare Access
- Prevents header spoofing
- Ensures token hasn't expired
- Validates audience tag matches your application

### How to Enable

1. Set in your `.env.local`:
   ```bash
   NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true
   ```

2. The middleware will automatically:
   - Extract the JWT from `CF_Authorization` cookie
   - Decode and validate the payload
   - Check expiration time
   - Verify audience tag
   - Reject invalid or expired tokens

### Production JWT Verification

For full production security, you should:

1. Fetch Cloudflare's public keys:
   ```
   https://your-team.cloudflareaccess.com/cdn-cgi/access/certs
   ```

2. Use a library like `jsonwebtoken` or `jose` to verify signatures

3. Update `src/libs/auth/adapters/cloudflare/utils.ts` with proper verification

Example with `jose`:
```bash
npm install jose
```

```typescript
import { jwtVerify } from 'jose';

// Fetch Cloudflare's public key (cache this)
const JWKS = jose.createRemoteJWKSet(
  new URL('https://your-team.cloudflareaccess.com/cdn-cgi/access/certs')
);

// Verify token
const { payload } = await jwtVerify(token, JWKS, {
  audience,
  issuer: teamDomain,
});
```

## API Endpoint

The app includes `/api/auth/user` endpoint that:
- Reads user information from Cloudflare headers
- Returns user data as JSON
- Used by the UserProfile component

Example response:
```json
{
  "id": "user-id-or-email",
  "email": "user@example.com",
  "firstName": null,
  "lastName": null,
  "imageUrl": null
}
```

## Customization

### Custom User Profile

Edit `src/libs/auth/adapters/cloudflare/UserProfile.tsx` to:
- Add more user fields
- Integrate with your database for extended profiles
- Add profile editing functionality
- Customize styling

### Middleware Configuration

Edit `src/middleware.ts` to change:
- Protected routes
- Redirect URLs
- Authentication behavior

### Sign-in UI

Edit the `renderSignIn` method in `src/libs/auth/adapters/CloudflareAdapter.tsx` to:
- Customize the loading page
- Add your branding
- Change redirect behavior

## Troubleshooting

### Issue: "Authentication required" error

**Solution**: Ensure `NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN` is set correctly in `.env.local`

### Issue: Stuck in redirect loop

**Solutions**:
1. Check that your domain is correctly configured in Cloudflare Access
2. Verify the application's domain matches your Next.js URL
3. Clear cookies and try again

### Issue: "JWT verification failed"

**Solutions**:
1. Check that `NEXT_PUBLIC_CLOUDFLARE_AUDIENCE` matches your application's AUD tag
2. Verify tokens haven't expired (increase session duration in Cloudflare)
3. Try disabling JWT verification temporarily: `NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=false`

### Issue: User profile shows "Not authenticated"

**Solutions**:
1. Verify Cloudflare Access is properly sending headers
2. Check that middleware is running on protected routes
3. Inspect request headers in browser DevTools

## Security Best Practices

1. ✅ **Always use HTTPS** in production
2. ✅ **Enable JWT verification** for production deployments
3. ✅ **Restrict access policies** to specific email domains or groups
4. ✅ **Set appropriate session durations** (not too long)
5. ✅ **Monitor access logs** in Cloudflare Dashboard
6. ✅ **Use device posture checks** for sensitive applications
7. ✅ **Enable MFA** for admin users

## Cloudflare Access vs Clerk

| Feature | Cloudflare Access | Clerk |
|---------|------------------|-------|
| Edge Authentication | ✅ Yes | ❌ No |
| Built-in UI | ✅ Yes | ✅ Yes |
| Customizable UI | ⚠️ Limited | ✅ Fully |
| Social Auth | ✅ Via IdP | ✅ Built-in |
| MFA | ✅ Via IdP | ✅ Built-in |
| User Management | ⚠️ External | ✅ Built-in |
| Zero Trust Features | ✅ Advanced | ❌ No |
| Pricing | Enterprise | Freemium |
| Best For | Enterprise/Internal | SaaS/Public Apps |

## Additional Resources

- [Cloudflare Access Documentation](https://developers.cloudflare.com/cloudflare-one/identity/access/)
- [JWT Validation Guide](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/)
- [Zero Trust Dashboard](https://one.dash.cloudflare.com/)
- [Cloudflare Access Policies](https://developers.cloudflare.com/cloudflare-one/policies/access/)

## Support

For issues with:
- **Cloudflare Access configuration**: Contact Cloudflare Support
- **Adapter implementation**: Check `src/libs/auth/README.md`
- **General authentication**: See the main project documentation
