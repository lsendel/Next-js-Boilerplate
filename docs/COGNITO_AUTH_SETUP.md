# AWS Cognito Authentication Setup Guide

This guide walks you through setting up AWS Cognito as your authentication provider with OAuth2 social sign-in and Multi-Factor Authentication (MFA).

## Table of Contents

- [Prerequisites](#prerequisites)
- [AWS Cognito Setup](#aws-cognito-setup)
- [OAuth2 Provider Configuration](#oauth2-provider-configuration)
- [MFA Configuration](#mfa-configuration)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Comparison with Other Providers](#comparison-with-other-providers)

## Prerequisites

- AWS account with access to Cognito
- Node.js 22+ and npm installed
- AWS Amplify library: `npm install aws-amplify`

## AWS Cognito Setup

### Step 1: Create a Cognito User Pool

1. **Navigate to AWS Cognito Console**
   - Go to https://console.aws.amazon.com/cognito/
   - Select your region (e.g., `us-east-1`)

2. **Create User Pool**
   - Click "Create user pool"
   - **Sign-in experience**: Select "Email" and optionally "Username"
   - **Security requirements**:
     - Password policy: Customize as needed (default: 8+ chars, uppercase, lowercase, numbers)
     - Multi-factor authentication: Select "Optional" (we'll configure this later)
   - **Sign-up experience**:
     - Enable self-registration
     - Required attributes: Email, Name
   - **Message delivery**:
     - Email provider: Choose "Send email with Amazon SES" (production) or "Send email with Cognito" (development)
   - **App integration**:
     - User pool name: `my-app-users`
     - App client name: `my-app-client`
     - Client secret: "Don't generate" (for public client apps)

3. **Note Your Configuration**
   - Copy the **User Pool ID** (e.g., `us-east-1_XXXXXXXXX`)
   - Copy the **App Client ID** (e.g., `xxxxxxxxxxxxxxxxxxxx`)
   - Copy the **Region** (e.g., `us-east-1`)

### Step 2: Configure App Client Settings

1. **In your User Pool** → App integration → App clients
2. Click on your app client
3. **Hosted UI Configuration**:
   - Allowed callback URLs: `http://localhost:3000/dashboard,https://yourdomain.com/dashboard`
   - Allowed sign-out URLs: `http://localhost:3000/,https://yourdomain.com/`
   - OAuth 2.0 grant types: ✅ Authorization code grant
   - OAuth scopes: ✅ email, ✅ profile, ✅ openid

4. **Domain Name**:
   - Go to App integration → Domain
   - Create a Cognito domain: `your-app-name` (results in `your-app-name.auth.us-east-1.amazoncognito.com`)
   - Or use a custom domain if you have one

## OAuth2 Provider Configuration

### Google OAuth Setup

1. **Google Cloud Console**
   - Go to https://console.cloud.google.com/
   - Create a new project or select an existing one
   - Enable "Google+ API"

2. **Create OAuth Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     ```
     https://your-app-name.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
     ```
   - Copy **Client ID** and **Client Secret**

3. **Configure in Cognito**
   - User Pool → Sign-in experience → Federated identity provider sign-in → Add identity provider
   - Provider type: Google
   - Client ID: Paste Google Client ID
   - Client secret: Paste Google Client Secret
   - Authorize scope: `profile email openid`

### Facebook OAuth Setup

1. **Facebook Developers Console**
   - Go to https://developers.facebook.com/
   - Create a new app → "Consumer" type
   - Add "Facebook Login" product

2. **Configure OAuth Settings**
   - Valid OAuth Redirect URIs:
     ```
     https://your-app-name.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
     ```
   - Copy **App ID** and **App Secret**

3. **Configure in Cognito**
   - User Pool → Sign-in experience → Federated identity provider sign-in → Add identity provider
   - Provider type: Facebook
   - Client ID: Paste Facebook App ID
   - Client secret: Paste Facebook App Secret
   - Authorize scope: `public_profile,email`

### Apple OAuth Setup

1. **Apple Developer Console**
   - Go to https://developer.apple.com/account/resources/identifiers/
   - Create a new Services ID
   - Configure Sign in with Apple
   - Return URLs:
     ```
     https://your-app-name.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
     ```

2. **Configure in Cognito**
   - User Pool → Sign-in experience → Federated identity provider sign-in → Add identity provider
   - Provider type: Apple
   - Services ID: Your Apple Services ID
   - Team ID: Your Apple Team ID
   - Key ID: Your Apple Key ID
   - Private key: Upload your .p8 key file

3. **Update App Client**
   - Go to App integration → App clients → Your app client
   - Hosted UI → Identity providers: ✅ Google, ✅ Facebook, ✅ Apple

## MFA Configuration

### TOTP (Authenticator App) Setup

1. **Enable MFA in User Pool**
   - User Pool → Sign-in experience → Multi-factor authentication
   - MFA enforcement: "Optional" (users can choose to enable)
   - MFA methods: ✅ Authenticator apps (TOTP)

2. **Configure TOTP Settings**
   - The implementation automatically generates QR codes for apps like:
     - Google Authenticator
     - Microsoft Authenticator
     - Authy
     - 1Password

### SMS MFA Setup (Optional)

1. **Configure SMS**
   - User Pool → Messaging → SMS
   - IAM role: Create a new role or select existing one with SNS permissions
   - Phone number: Add your origination identity

2. **Enable SMS MFA**
   - Sign-in experience → Multi-factor authentication
   - MFA methods: ✅ SMS text message

Note: SMS MFA requires additional AWS SNS configuration and may incur costs.

## Environment Variables

### Install Dependencies

```bash
npm install aws-amplify
```

### Configure .env

Add the following to your `.env` file:

```bash
# Authentication Provider
NEXT_PUBLIC_AUTH_PROVIDER=cognito

# AWS Cognito Core Configuration
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx

# OAuth2 Configuration
NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN=your-app-name.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_OAUTH_SCOPE=email,profile,openid
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN=http://localhost:3000/dashboard
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT=http://localhost:3000/

# OAuth2 Providers (set to 'true' to enable)
NEXT_PUBLIC_COGNITO_OAUTH_GOOGLE=true
NEXT_PUBLIC_COGNITO_OAUTH_FACEBOOK=true
NEXT_PUBLIC_COGNITO_OAUTH_APPLE=false

# MFA Configuration
NEXT_PUBLIC_COGNITO_MFA_ENABLED=true
NEXT_PUBLIC_COGNITO_MFA_METHOD=TOTP  # TOTP or SMS
NEXT_PUBLIC_COGNITO_MFA_ISSUER=MyApp  # Name shown in authenticator apps
```

### Production Environment

For production, update the redirect URLs:

```bash
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN=https://yourdomain.com/dashboard
NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT=https://yourdomain.com/
```

## Testing

### Local Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Sign-Up Flow**
   - Navigate to http://localhost:3000/sign-up
   - Try email/password registration
   - Verify email code is received
   - Try OAuth social sign-up (Google, Facebook, Apple)

3. **Test Sign-In Flow**
   - Navigate to http://localhost:3000/sign-in
   - Try email/password login
   - Test OAuth social sign-in
   - Verify dashboard redirect

4. **Test MFA**
   - Sign in to an account
   - Go to http://localhost:3000/dashboard/user-profile
   - Click "Setup TOTP MFA"
   - Scan QR code with authenticator app
   - Enter verification code
   - Sign out and sign in again to test MFA challenge

### TypeScript Type Checking

```bash
npm run check:types
```

### Run Tests

```bash
npm run test
```

## Troubleshooting

### Common Issues

#### 1. "User does not exist" Error

**Problem**: User registration succeeds but sign-in fails.

**Solution**: Check that email verification is complete. Cognito requires email verification before sign-in.

```typescript
// In SignUp.tsx, ensure verification flow completes
if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
  setVerificationRequired(true);
}
```

#### 2. OAuth Redirect URI Mismatch

**Problem**: OAuth sign-in fails with "redirect_uri_mismatch" error.

**Solution**: Ensure callback URLs match exactly:
- Cognito User Pool callback: `http://localhost:3000/dashboard`
- OAuth provider callback: `https://your-domain.auth.region.amazoncognito.com/oauth2/idpresponse`

#### 3. MFA QR Code Not Displaying

**Problem**: TOTP setup page shows no QR code.

**Solution**: Check browser console for errors. Ensure:
```bash
NEXT_PUBLIC_COGNITO_MFA_ENABLED=true
NEXT_PUBLIC_COGNITO_MFA_ISSUER=MyApp
```

#### 4. CORS Errors

**Problem**: API calls to Cognito fail with CORS errors.

**Solution**: Cognito automatically handles CORS. If errors persist:
- Verify your User Pool is in the correct region
- Check that `NEXT_PUBLIC_COGNITO_REGION` matches your User Pool region
- Clear browser cache and cookies

#### 5. "Invalid session for the user, session is expired"

**Problem**: Token expires quickly or session not persisting.

**Solution**: Amplify handles token refresh automatically. Check:
```typescript
// In amplify-config.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      // ... configuration
    },
  },
});
```

### Debug Mode

Enable Amplify debug logging:

```typescript
// In amplify-config.ts
import { Amplify } from 'aws-amplify';

if (process.env.NODE_ENV === 'development') {
  Amplify.configure({
    // ... existing config
  }, {
    ssr: false,
    logLevel: 'DEBUG',
  });
}
```

## Comparison with Other Providers

| Feature | Clerk | Cloudflare Access | AWS Cognito |
|---------|-------|-------------------|-------------|
| **Setup Complexity** | Easy | Moderate | Moderate-Complex |
| **OAuth Social Sign-In** | ✅ Built-in | ❌ Not supported | ✅ Configurable |
| **MFA Support** | ✅ TOTP, SMS, Passkeys | ✅ Enterprise only | ✅ TOTP, SMS |
| **Hosted UI** | ✅ Customizable | ✅ Cloudflare portal | ✅ Customizable |
| **Custom UI** | ✅ React components | ⚠️ Limited | ✅ Full control |
| **Pricing** | Free tier + usage | Enterprise pricing | AWS free tier + usage |
| **Best For** | SaaS applications | Enterprise security | AWS ecosystem apps |
| **Email Verification** | ✅ Automatic | ✅ Automatic | ✅ Automatic |
| **Session Management** | ✅ Built-in | ✅ JWT-based | ✅ Token-based |
| **User Management UI** | ✅ Dashboard | ✅ Dashboard | ✅ AWS Console |
| **Scalability** | ✅ Automatic | ✅ Cloudflare edge | ✅ AWS scale |

### When to Use AWS Cognito

**Choose Cognito if**:
- ✅ Already using AWS services (Lambda, S3, DynamoDB)
- ✅ Need fine-grained control over authentication flow
- ✅ Want to avoid vendor lock-in with open standards (OAuth2, OIDC)
- ✅ Need custom attribute mapping
- ✅ Require user pool groups and fine-grained permissions
- ✅ Want pay-per-use pricing after AWS free tier

**Choose Clerk if**:
- ✅ Want fastest setup with minimal configuration
- ✅ Need pre-built UI components
- ✅ Prefer managed service with less maintenance

**Choose Cloudflare Access if**:
- ✅ Using Cloudflare for edge/CDN
- ✅ Need Zero Trust security model
- ✅ Enterprise customers with SSO requirements

## Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [TOTP Algorithm (RFC 6238)](https://tools.ietf.org/html/rfc6238)

## Security Best Practices

1. **Never commit secrets to Git**
   - Use `.env.local` for sensitive keys
   - Add `.env.local` to `.gitignore`

2. **Production Checklist**
   - [ ] Use custom domain instead of Cognito domain
   - [ ] Enable MFA for all admin users
   - [ ] Configure account takeover protection
   - [ ] Set up CloudWatch logging
   - [ ] Review IAM permissions
   - [ ] Configure password complexity requirements
   - [ ] Set up SNS notifications for security events

3. **Token Security**
   - Tokens are stored in browser localStorage by Amplify
   - Use HTTPS in production to protect token transmission
   - Configure appropriate token expiration times

## Support

For issues specific to this implementation, check:
- `src/libs/auth/adapters/cognito/` - Implementation files
- `src/libs/auth/adapters/CognitoAdapter.tsx` - Main adapter

For AWS Cognito issues, consult:
- AWS Cognito Forums
- AWS Support
