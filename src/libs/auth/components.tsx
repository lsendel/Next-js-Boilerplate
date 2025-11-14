/**
 * Auth Components
 * These components wrap the auth adapter's render methods
 */

import { getAuthAdapter } from './index';

/**
 * Auth Provider Component
 * Wraps your app with the appropriate auth provider
 */
export function AuthProvider(props: {
  children: React.ReactNode;
  locale: string;
}) {
  const adapter = getAuthAdapter();
  return adapter.renderProvider(props);
}

/**
 * Sign In Component
 * Renders the sign-in UI for the current auth provider
 */
export function SignInComponent(props: {
  path: string;
  locale: string;
}) {
  const adapter = getAuthAdapter();
  return adapter.renderSignIn(props);
}

/**
 * Sign Up Component
 * Renders the sign-up UI for the current auth provider
 */
export function SignUpComponent(props: {
  path: string;
  locale: string;
}) {
  const adapter = getAuthAdapter();
  return adapter.renderSignUp(props);
}

/**
 * Sign Out Button Component
 * Renders a sign-out button for the current auth provider
 */
export function SignOutButtonComponent(props: {
  children: React.ReactNode;
}) {
  const adapter = getAuthAdapter();
  return adapter.renderSignOutButton(props);
}

/**
 * User Profile Component
 * Renders the user profile UI for the current auth provider
 */
export function UserProfileComponent(props: {
  path: string;
}) {
  const adapter = getAuthAdapter();
  return adapter.renderUserProfile(props);
}
