'use client';

import { authLogger } from '@/libs/Logger';

/**
 * Sign Out Button Component for Test Authentication
 */
export function TestSignOutButton({ children }: { children: React.ReactNode }) {
  const handleSignOut = async () => {
    try {
      // Clear session cookie via API route
      await fetch('/api/test-auth/signout', {
        method: 'POST',
        credentials: 'same-origin', // Required to send session cookies
      });

      // Redirect to home page
      window.location.href = '/';
    } catch (err) {
      authLogger.error('Test auth sign out error', { error: err });
    }
  };

  return (
    <button type="button" onClick={handleSignOut}>
      {children}
    </button>
  );
}
