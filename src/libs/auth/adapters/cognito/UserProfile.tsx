'use client';

import type { MFAStatus } from './utils';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { authLogger } from '@/libs/Logger';

type UserProfileProps = {
  path: string;
};

type UserData = {
  id: string;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
};

/**
 * AWS Cognito User Profile Component
 *
 * Features:
 * - Display user information
 * - Manage MFA settings (TOTP/SMS)
 * - Update profile information
 */
export function CognitoUserProfile({ path: _path }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mfaStatus, setMFAStatus] = useState<MFAStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState<'totp' | 'sms' | null>(null);
  const [totpQR, setTotpQR] = useState<string>('');
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [pendingDisableConfirmation, setPendingDisableConfirmation] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const data = await response.json();
        setUserData({
          id: data.id,
          email: data.email,
          name: data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.firstName || null,
          phoneNumber: data.phoneNumber || null,
        });
      }
    } catch (err) {
      authLogger.error('Failed to load user data', { error: err });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMFAStatus = useCallback(async () => {
    try {
      const { getMFAStatus } = await import('./utils');
      const status = await getMFAStatus();
      setMFAStatus(status);
    } catch (err) {
      authLogger.error('Failed to load MFA status', { error: err });
    }
  }, []);

  useEffect(() => {
    loadUserData();
    loadMFAStatus();
  }, [loadUserData, loadMFAStatus]);

  const setupTOTP = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { setupTOTPMFA } = await import('./utils');
      const result = await setupTOTPMFA();

      if (result) {
        setTotpQR(result.qrCode);
        setTotpSecret(result.secret);
        setSetupMode('totp');
      } else {
        setError('TOTP setup failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to setup TOTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyTOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    try {
      const { verifyTOTPSetup } = await import('./utils');
      const success = await verifyTOTPSetup(code);

      if (success) {
        setSetupMode(null);
        await loadMFAStatus();
        setSuccessMessage('TOTP MFA enabled successfully!');
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async () => {
    if (!pendingDisableConfirmation) {
      setPendingDisableConfirmation(true);
      setSuccessMessage('Click "Disable MFA" again to confirm.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { disableMFA: disableMFAUtil } = await import('./utils');
      const success = await disableMFAUtil();

      if (success) {
        await loadMFAStatus();
        setSuccessMessage('MFA disabled successfully.');
      } else {
        setError('Failed to disable MFA');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to disable MFA');
    } finally {
      setLoading(false);
      setPendingDisableConfirmation(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and security</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">{successMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Profile Information</h2>

          <div className="space-y-4">
            <div>
              <p className="block text-sm font-medium text-gray-700">Email Address</p>
              <div className="mt-1 rounded-md bg-gray-50 p-3 text-gray-900">
                {userData?.email || 'Not available'}
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700">Full Name</p>
              <div className="mt-1 rounded-md bg-gray-50 p-3 text-gray-900">
                {userData?.name || 'Not set'}
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700">User ID</p>
              <div className="mt-1 rounded-md bg-gray-50 p-3 font-mono text-sm text-gray-900">
                {userData?.id || 'Not available'}
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Factor Authentication */}
        {process.env.NEXT_PUBLIC_COGNITO_MFA_ENABLED === 'true' && (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Multi-Factor Authentication</h2>
              {mfaStatus?.enabled && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Enabled
                </span>
              )}
            </div>

            {!setupMode && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Add an extra layer of security to your account by enabling multi-factor authentication.
                </p>

                {!mfaStatus?.enabled && (
                  <div className="space-y-3">
                    {process.env.NEXT_PUBLIC_COGNITO_MFA_METHOD !== 'SMS' && (
                      <button
                        type="button"
                        onClick={setupTOTP}
                        disabled={loading}
                        className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-4 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900">Authenticator App (TOTP)</h3>
                            <p className="text-sm text-gray-600">
                              Use Google Authenticator or similar apps
                            </p>
                          </div>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {process.env.NEXT_PUBLIC_COGNITO_MFA_METHOD !== 'TOTP' && (
                      <button
                        type="button"
                        disabled
                        className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-4 opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900">SMS / Text Message</h3>
                            <p className="text-sm text-gray-600">
                              Receive codes via text message (Coming soon)
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                )}

                {mfaStatus?.enabled && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="flex">
                        <div className="shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            MFA is enabled
                          </h3>
                          <div className="mt-1 text-sm text-green-700">
                            <p>
                              Your account is protected with
                              {' '}
                              {mfaStatus.preferred === 'TOTP' ? 'authenticator app' : 'SMS'}
                              {' '}
                              multi-factor authentication.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={disableMFA}
                      disabled={loading}
                      className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Disable MFA
                    </button>
                    {pendingDisableConfirmation && (
                      <p className="text-sm text-red-600">
                        Click the button again to confirm.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {setupMode === 'totp' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="font-medium text-blue-900">Setup Authenticator App</h3>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-blue-800">
                    <li>Download an authenticator app like Google Authenticator or Authy</li>
                    <li>Scan the QR code below or enter the secret key manually</li>
                    <li>Enter the 6-digit code from your app to verify</li>
                  </ol>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  {totpQR && (
                    <div className="rounded-lg bg-white p-4 shadow">
                      <Image src={totpQR} alt="TOTP QR Code" width={192} height={192} className="h-48 w-48" />
                    </div>
                  )}

                  <div className="w-full">
                    <p className="block text-sm font-medium text-gray-700">Secret Key</p>
                    <div className="mt-1 flex">
                      <code className="flex-1 rounded-l-md bg-gray-50 px-3 py-2 font-mono text-sm text-gray-900">
                        {totpSecret}
                      </code>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(totpSecret)}
                        className="rounded-r-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <form onSubmit={verifyTOTP} className="w-full space-y-4">
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Verification Code
                      </label>
                      <input
                        id="code"
                        name="code"
                        type="text"
                        required
                        maxLength={6}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-center text-2xl tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="123456"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSetupMode(null)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify & Enable'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AWS Cognito Info */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Authentication Provider</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">AWS Cognito</p>
              <p className="text-sm text-gray-500">
                Your account is managed by AWS Cognito User Pool
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
