'use client';

import { useEffect, useState } from 'react';

type UserInfo = {
  email: string;
  id: string;
};

/**
 * Cloudflare Access User Profile Component
 *
 * Since Cloudflare Access doesn't provide a built-in profile UI,
 * this is a basic implementation showing user information.
 *
 * For a full profile management system, you would typically:
 * 1. Store additional user data in your database
 * 2. Provide forms to update profile information
 * 3. Integrate with your backend API
 */
export function CloudflareUserProfile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from an API endpoint
    // This endpoint would read from Cloudflare Access headers
    fetch('/api/auth/user')
      .then(res => res.json())
      .then((data) => {
        setUserInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
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
        <p className="mt-2 text-gray-600">
          Manage your profile information
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="block text-sm font-medium text-gray-700">
                Email Address
              </p>
              <div className="mt-1 rounded-md bg-gray-50 p-3 text-gray-900">
                {userInfo?.email || 'Not available'}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Managed by Cloudflare Access
              </p>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700">
                User ID
              </p>
              <div className="mt-1 rounded-md bg-gray-50 p-3 font-mono text-sm text-gray-900">
                {userInfo?.id || 'Not available'}
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Info Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Authentication
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Cloudflare Access
                </p>
                <p className="text-sm text-gray-500">
                  Your account is secured by Cloudflare Access
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Additional Settings Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Account Settings
          </h2>

          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Manage via Cloudflare
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Profile settings like password, two-factor authentication,
                      and security preferences are managed through Cloudflare Access.
                    </p>
                  </div>
                  <div className="mt-4">
                    <a
                      href={`${process.env.NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Open Cloudflare Dashboard
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
