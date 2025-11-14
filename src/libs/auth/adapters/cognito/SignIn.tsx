'use client';

import { useState } from 'react';
import { TenantLink } from '@/client/components/navigation/TenantLink';
import { useTenantPath } from '@/shared/hooks/useTenantPath';
import { getHostedUIUrl, getOAuthSignInUrl } from './amplify-config';
import { getAvailableOAuthProviders, getOAuthProviderInfo } from './utils';

type SignInProps = {
  path: string;
  locale: string;
};

/**
 * AWS Cognito Sign In Component
 *
 * Supports:
 * - OAuth2 social sign-in (Google, Facebook, Apple)
 * - Cognito Hosted UI
 * - Email/password authentication
 * - MFA (handled automatically by Cognito)
 */
export function CognitoSignIn({ path: _path, locale: _locale }: SignInProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const useHostedUI = Boolean(process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN);

  const oauthProviders = getAvailableOAuthProviders();
  const hasOAuth = oauthProviders.length > 0;
  const resolveTenantPath = useTenantPath();

  const handleOAuthSignIn = async (provider: 'Google' | 'Facebook' | 'Apple') => {
    try {
      setLoading(true);
      setError('');

      const signInUrl = getOAuthSignInUrl(provider);
      window.location.href = signInUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to initiate sign-in');
      setLoading(false);
    }
  };

  const handleHostedUISignIn = () => {
    try {
      setLoading(true);
      const hostedUIUrl = getHostedUIUrl();
      window.location.href = hostedUIUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to redirect to Hosted UI');
      setLoading(false);
    }
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { signIn } = await import('aws-amplify/auth');
      const result = await signIn({
        username: email,
        password,
      });

      // Check if MFA is required
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        // Redirect to MFA page or show MFA input
        window.location.href = resolveTenantPath('/sign-in/mfa?method=totp');
        return;
      }

      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        window.location.href = resolveTenantPath('/sign-in/mfa?method=sms');
        return;
      }

      // Sign in successful
      window.location.href = resolveTenantPath('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
      setLoading(false);
    }
  };

  if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="font-semibold text-red-800">Configuration Error</p>
            <p className="mt-1 text-sm text-red-600">
              AWS Cognito is not configured. Please set the required environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-2 text-gray-600">Welcome back</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* OAuth Social Sign-In */}
          {hasOAuth && (
            <div className="space-y-3">
              {oauthProviders.map((provider) => {
                const providerInfo = getOAuthProviderInfo(provider);
                return (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => handleOAuthSignIn(provider)}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ borderColor: providerInfo.color }}
                  >
                    <span className="text-xl">{providerInfo.icon}</span>
                    <span>
                      Continue with
                      {providerInfo.name}
                    </span>
                  </button>
                );
              })}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">or</span>
                </div>
              </div>
            </div>
          )}

          {/* Hosted UI Button */}
          {useHostedUI && !hasOAuth && (
            <button
              type="button"
              onClick={handleHostedUISignIn}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Redirecting...' : 'Sign in with Cognito Hosted UI'}
            </button>
          )}

          {/* Email/Password Form */}
          {!useHostedUI && (
            <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          )}

          {/* Additional Options */}
          <div className="mt-6 text-center text-sm">
            <TenantLink href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </TenantLink>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?
            {' '}
            <TenantLink href="/sign-up" className="font-medium text-blue-600 hover:underline">
              Sign up
            </TenantLink>
          </div>

          {/* MFA Info */}
          {process.env.NEXT_PUBLIC_COGNITO_MFA_ENABLED === 'true' && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Multi-Factor Authentication Enabled
                  </h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>
                      After signing in, you'll be prompted to enter a verification code from your
                      authenticator app or receive it via SMS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
