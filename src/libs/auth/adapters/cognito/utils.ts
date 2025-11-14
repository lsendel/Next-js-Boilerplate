/**
 * AWS Cognito Utility Functions
 * Helper functions for Cognito authentication, OAuth2, and MFA
 */

import type { AuthUser } from '../../types';

/**
 * Convert Cognito user attributes to AuthUser format
 */
export function cognitoUserToAuthUser(cognitoUser: any): AuthUser {
  const attributes = cognitoUser.signInDetails?.loginId
    ? { email: cognitoUser.signInDetails.loginId }
    : cognitoUser.attributes || {};

  return {
    id: cognitoUser.userId || cognitoUser.username,
    email: attributes.email || null,
    firstName: attributes.given_name || attributes.name?.split(' ')[0] || null,
    lastName: attributes.family_name || attributes.name?.split(' ').slice(1).join(' ') || null,
    imageUrl: attributes.picture || null,
  };
}

/**
 * MFA Setup Status
 */
export type MFAStatus = {
  enabled: boolean;
  preferred?: 'TOTP' | 'SMS';
  totpConfigured: boolean;
  smsConfigured: boolean;
};

/**
 * Get MFA status for current user
 */
export async function getMFAStatus(): Promise<MFAStatus> {
  try {
    // This would use AWS Amplify to get MFA preferences
    // import { fetchMFAPreference } from 'aws-amplify/auth';
    // const mfaPreference = await fetchMFAPreference();

    // For now, return placeholder
    return {
      enabled: false,
      totpConfigured: false,
      smsConfigured: false,
    };
  } catch (error) {
    console.error('Failed to get MFA status:', error);
    return {
      enabled: false,
      totpConfigured: false,
      smsConfigured: false,
    };
  }
}

/**
 * Setup TOTP (Time-based One-Time Password) MFA
 * Returns QR code and secret for user to scan with authenticator app
 */
export async function setupTOTPMFA(): Promise<{
  qrCode: string;
  secret: string;
} | null> {
  try {
    // This would use AWS Amplify to setup TOTP
    // import { setUpTOTP } from 'aws-amplify/auth';
    // const totpSetup = await setUpTOTP();
    // return {
    //   qrCode: totpSetup.getSetupUri('MyApp', user.username).href,
    //   secret: totpSetup.sharedSecret,
    // };

    console.warn('setupTOTPMFA not yet implemented');
    return null;
  } catch (error) {
    console.error('Failed to setup TOTP MFA:', error);
    return null;
  }
}

/**
 * Verify TOTP code and enable TOTP MFA
 */
export async function verifyTOTPSetup(code: string): Promise<boolean> {
  try {
    // This would use AWS Amplify to verify TOTP
    // import { verifyTOTPSetup } from 'aws-amplify/auth';
    // await verifyTOTPSetup({ code });
    // return true;

    console.warn('verifyTOTPSetup not yet implemented:', code);
    return false;
  } catch (error) {
    console.error('Failed to verify TOTP:', error);
    return false;
  }
}

/**
 * Enable SMS MFA for current user
 */
export async function enableSMSMFA(phoneNumber: string): Promise<boolean> {
  try {
    // This would use AWS Amplify to enable SMS MFA
    // import { updateUserAttributes } from 'aws-amplify/auth';
    // await updateUserAttributes({
    //   userAttributes: {
    //     phone_number: phoneNumber,
    //   },
    // });
    // Then update MFA preference to SMS

    console.warn('enableSMSMFA not yet implemented:', phoneNumber);
    return false;
  } catch (error) {
    console.error('Failed to enable SMS MFA:', error);
    return false;
  }
}

/**
 * Disable MFA for current user
 */
export async function disableMFA(): Promise<boolean> {
  try {
    // This would use AWS Amplify to disable MFA
    // import { updateMFAPreference } from 'aws-amplify/auth';
    // await updateMFAPreference({ totp: 'DISABLED', sms: 'DISABLED' });
    // return true;

    console.warn('disableMFA not yet implemented');
    return false;
  } catch (error) {
    console.error('Failed to disable MFA:', error);
    return false;
  }
}

/**
 * Check if user needs to complete MFA challenge
 */
export function needsMFAChallenge(signInResult: any): boolean {
  return signInResult?.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
    || signInResult?.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE';
}

/**
 * Get MFA challenge type from sign-in result
 */
export function getMFAChallengeType(signInResult: any): 'TOTP' | 'SMS' | null {
  if (signInResult?.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
    return 'TOTP';
  }
  if (signInResult?.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
    return 'SMS';
  }
  return null;
}

/**
 * Confirm MFA challenge
 */
export async function confirmMFAChallenge(code: string): Promise<boolean> {
  try {
    // This would use AWS Amplify to confirm MFA
    // import { confirmSignIn } from 'aws-amplify/auth';
    // await confirmSignIn({ challengeResponse: code });
    // return true;

    console.warn('confirmMFAChallenge not yet implemented:', code);
    return false;
  } catch (error) {
    console.error('Failed to confirm MFA challenge:', error);
    return false;
  }
}

/**
 * Parse OAuth2 callback URL and extract tokens/code
 */
export function parseOAuthCallback(url: string): {
  code?: string;
  error?: string;
  error_description?: string;
} {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;

  return {
    code: params.get('code') || undefined,
    error: params.get('error') || undefined,
    error_description: params.get('error_description') || undefined,
  };
}

/**
 * Check if current route is an OAuth callback
 */
export function isOAuthCallback(pathname: string): boolean {
  // Check if pathname matches redirect URI path
  return pathname.includes('/dashboard') || pathname.includes('/auth/callback');
}

/**
 * Get available OAuth providers
 */
export function getAvailableOAuthProviders(): Array<'Google' | 'Facebook' | 'Apple'> {
  const providers: Array<'Google' | 'Facebook' | 'Apple'> = [];

  if (process.env.NEXT_PUBLIC_COGNITO_OAUTH_GOOGLE === 'true') {
    providers.push('Google');
  }
  if (process.env.NEXT_PUBLIC_COGNITO_OAUTH_FACEBOOK === 'true') {
    providers.push('Facebook');
  }
  if (process.env.NEXT_PUBLIC_COGNITO_OAUTH_APPLE === 'true') {
    providers.push('Apple');
  }

  return providers;
}

/**
 * Get OAuth provider display information
 */
export function getOAuthProviderInfo(provider: 'Google' | 'Facebook' | 'Apple'): {
  name: string;
  icon: string;
  color: string;
} {
  const providers = {
    Google: {
      name: 'Google',
      icon: '🔍', // You can replace with actual icon/svg
      color: '#4285F4',
    },
    Facebook: {
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
    },
    Apple: {
      name: 'Apple',
      icon: '',
      color: '#000000',
    },
  };

  return providers[provider];
}
