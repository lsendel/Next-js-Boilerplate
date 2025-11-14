/**
 * AWS Amplify Configuration for Cognito
 *
 * This file configures AWS Amplify with Cognito User Pool settings
 * including OAuth2 social providers and MFA
 */

import { Amplify } from 'aws-amplify';

export type CognitoConfig = {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
  // OAuth2 Configuration
  oauth?: {
    domain: string; // e.g., 'your-domain.auth.us-east-1.amazoncognito.com'
    scope: string[]; // e.g., ['email', 'profile', 'openid']
    redirectSignIn: string; // e.g., 'http://localhost:3000/dashboard'
    redirectSignOut: string; // e.g., 'http://localhost:3000/'
    responseType: 'code' | 'token'; // 'code' for authorization code flow
  };
  // MFA Configuration
  mfa?: {
    enabled: boolean;
    preferredMethod?: 'TOTP' | 'SMS'; // TOTP = Authenticator app, SMS = text message
    totpIssuer?: string; // Issuer name shown in authenticator app
  };
};

/**
 * Get Cognito configuration from environment variables
 */
export function getCognitoConfig(): CognitoConfig {
  const config: CognitoConfig = {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1',
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
  };

  // OAuth2 Configuration
  if (process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN) {
    config.oauth = {
      domain: process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN,
      scope: (process.env.NEXT_PUBLIC_COGNITO_OAUTH_SCOPE || 'email,profile,openid').split(','),
      redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`,
      redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT || `${typeof window !== 'undefined' ? window.location.origin : ''}/`,
      responseType: 'code',
    };
  }

  // MFA Configuration
  if (process.env.NEXT_PUBLIC_COGNITO_MFA_ENABLED === 'true') {
    config.mfa = {
      enabled: true,
      preferredMethod: (process.env.NEXT_PUBLIC_COGNITO_MFA_METHOD as 'TOTP' | 'SMS') || 'TOTP',
      totpIssuer: process.env.NEXT_PUBLIC_COGNITO_MFA_ISSUER || 'MyApp',
    };
  }

  return config;
}

/**
 * Configure AWS Amplify
 * This should be called once when the app initializes
 */
export function configureAmplify(): void {
  const config = getCognitoConfig();

  if (!config.userPoolId || !config.userPoolClientId) {
    console.warn('Cognito configuration incomplete. Please set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID');
    return;
  }

  const amplifyConfig: any = {
    Auth: {
      Cognito: {
        userPoolId: config.userPoolId,
        userPoolClientId: config.userPoolClientId,
        loginWith: {
          email: true,
        },
      },
    },
  };

  // Add OAuth configuration if available
  if (config.oauth) {
    amplifyConfig.Auth.Cognito.loginWith.oauth = {
      domain: config.oauth.domain,
      scopes: config.oauth.scope,
      redirectSignIn: [config.oauth.redirectSignIn],
      redirectSignOut: [config.oauth.redirectSignOut],
      responseType: config.oauth.responseType,
      providers: [], // Will be populated from env vars
    };

    // Add social providers
    const providers: string[] = [];
    if (process.env.NEXT_PUBLIC_COGNITO_OAUTH_GOOGLE === 'true') {
      providers.push('Google');
    }
    if (process.env.NEXT_PUBLIC_COGNITO_OAUTH_FACEBOOK === 'true') {
      providers.push('Facebook');
    }
    if (process.env.NEXT_PUBLIC_COGNITO_OAUTH_APPLE === 'true') {
      providers.push('Apple');
    }

    if (providers.length > 0) {
      amplifyConfig.Auth.Cognito.loginWith.oauth.providers = providers;
    }
  }

  // Configure MFA
  if (config.mfa?.enabled) {
    amplifyConfig.Auth.Cognito.mfa = {
      status: 'on',
      totpEnabled: config.mfa.preferredMethod === 'TOTP',
      smsEnabled: config.mfa.preferredMethod === 'SMS',
    };
  }

  Amplify.configure(amplifyConfig);
}

/**
 * Get OAuth2 sign-in URL for a specific provider
 */
export function getOAuthSignInUrl(provider: 'Google' | 'Facebook' | 'Apple'): string {
  const config = getCognitoConfig();

  if (!config.oauth) {
    throw new Error('OAuth not configured');
  }

  const { domain, redirectSignIn, scope, responseType } = config.oauth;

  const params = new URLSearchParams({
    identity_provider: provider,
    redirect_uri: redirectSignIn,
    response_type: responseType,
    client_id: config.userPoolClientId,
    scope: scope.join(' '),
  });

  return `https://${domain}/oauth2/authorize?${params.toString()}`;
}

/**
 * Get hosted UI sign-in URL
 */
export function getHostedUIUrl(): string {
  const config = getCognitoConfig();

  if (!config.oauth) {
    throw new Error('OAuth not configured');
  }

  const { domain, redirectSignIn, scope, responseType } = config.oauth;

  const params = new URLSearchParams({
    redirect_uri: redirectSignIn,
    response_type: responseType,
    client_id: config.userPoolClientId,
    scope: scope.join(' '),
  });

  return `https://${domain}/login?${params.toString()}`;
}
