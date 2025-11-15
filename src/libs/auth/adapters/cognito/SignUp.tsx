'use client';

import { useState } from 'react';
import { TenantLink } from '@/client/components/navigation/TenantLink';
import { useTenantPath } from '@/shared/hooks/useTenantPath';
import { getHostedUIUrl, getOAuthSignInUrl } from './amplify-config';
import { getAvailableOAuthProviders, getOAuthProviderInfo } from './utils';

type SignUpProps = {
  path: string;
  locale: string;
};

/**
 * AWS Cognito Sign Up Component
 *
 * Supports:
 * - OAuth2 social sign-up (Google, Facebook, Apple)
 * - Email/password registration
 * - Email verification
 */
export function CognitoSignUp({ path: _path, locale: _locale }: SignUpProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('');
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [email, setEmail] = useState('');

  const oauthProviders = getAvailableOAuthProviders();
  const hasOAuth = oauthProviders.length > 0;
  const useHostedUI = !!process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN;
  const resolveTenantPath = useTenantPath();

  const handleOAuthSignUp = async (provider: 'Google' | 'Facebook' | 'Apple') => {
    try {
      setLoading(true);
      setError('');

      const signInUrl = getOAuthSignInUrl(provider);
      window.location.href = signInUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initiate sign-up');
      setLoading(false);
    }
  };

  const handleHostedUISignUp = () => {
    try {
      setLoading(true);
      const hostedUIUrl = getHostedUIUrl();
      window.location.href = hostedUIUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to redirect to Hosted UI');
      setLoading(false);
    }
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatusMessage('');

    const formData = new FormData(e.currentTarget);
    const userEmail = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const { signUp } = await import('aws-amplify/auth');
      const result = await signUp({
        username: userEmail,
        password,
        options: {
          userAttributes: {
            email: userEmail,
            name,
          },
        },
      });

      setEmail(userEmail);

      // Check if email verification is required
      if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setVerificationRequired(true);
      } else {
        // Sign up complete, redirect to sign in
        window.location.href = resolveTenantPath('/sign-in');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatusMessage('');

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    try {
      const { confirmSignUp } = await import('aws-amplify/auth');
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      // Verification successful, redirect to sign in
      window.location.href = resolveTenantPath('/sign-in?verified=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setLoading(true);
    setError('');
    setStatusMessage('');

    try {
      const { resendSignUpCode } = await import('aws-amplify/auth');
      await resendSignUpCode({ username: email });
      setStatusMessage('Verification code resent! Check your email.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
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

  // Email Verification Form
  if (verificationRequired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
              <p className="mt-2 text-gray-600">
                We sent a verification code to
                {' '}
                <strong>{email}</strong>
                . Enter it below to complete your sign up.
              </p>
              {statusMessage && (
                <p className="mt-2 text-sm text-blue-600">
                  {statusMessage}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerification} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              Didn't receive the code?
              {' '}
              <button
                type="button"
                onClick={resendVerificationCode}
                disabled={loading}
                className="font-medium text-blue-600 hover:underline disabled:opacity-50"
              >
                Resend
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sign Up Form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="mt-2 text-gray-600">Get started with your free account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* OAuth Social Sign-Up */}
          {hasOAuth && (
            <div className="space-y-3">
              {oauthProviders.map((provider) => {
                const providerInfo = getOAuthProviderInfo(provider);
                return (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => handleOAuthSignUp(provider)}
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
              onClick={handleHostedUISignUp}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Redirecting...' : 'Sign up with Cognito Hosted UI'}
            </button>
          )}

          {/* Email/Password Form */}
          {!useHostedUI && (
            <form onSubmit={handleEmailPasswordSignUp} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

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
                  minLength={8}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            {' '}
            <TenantLink href="/sign-in" className="font-medium text-blue-600 hover:underline">
              Sign in
            </TenantLink>
          </div>
        </div>
      </div>
    </div>
  );
}
