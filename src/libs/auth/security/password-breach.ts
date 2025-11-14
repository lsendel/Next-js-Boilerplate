/**
 * Password Breach Detection
 *
 * Checks passwords against Have I Been Pwned (HIBP) database
 * using k-anonymity to protect user privacy
 */

import crypto from 'node:crypto';

type BreachCheckResult = {
  breached: boolean;
  occurrences: number;
};

/**
 * Check if password has been breached using HIBP API
 *
 * Uses k-anonymity: only sends first 5 chars of SHA-1 hash
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export async function checkPasswordBreach(
  password: string,
): Promise<BreachCheckResult> {
  try {
    // Generate SHA-1 hash of password
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

    // Split into prefix (first 5 chars) and suffix
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Query HIBP API with prefix only (k-anonymity)
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          'User-Agent': 'Next.js-Boilerplate-Password-Check',
          'Add-Padding': 'true', // Request padding for extra privacy
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    );

    if (!response.ok) {
      // If API is down, fail open (allow password) but log warning
      console.warn('HIBP API unavailable, skipping breach check');
      return { breached: false, occurrences: 0 };
    }

    const text = await response.text();

    // Parse response - each line is "SUFFIX:COUNT"
    const lines = text.split('\n');
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        return {
          breached: true,
          occurrences: count ? Number.parseInt(count, 10) : 0,
        };
      }
    }

    // Password not found in breaches
    return { breached: false, occurrences: 0 };
  } catch (error) {
    // Fail open on errors but log them
    console.error('Password breach check failed:', error);
    return { breached: false, occurrences: 0 };
  }
}

/**
 * Validate password strength
 *
 * Checks:
 * - Minimum length
 * - Character diversity
 * - Common patterns
 */
export type PasswordStrengthResult = {
  valid: boolean;
  score: number; // 0-100
  feedback: string[];
};

export function validatePasswordStrength(
  password: string,
): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else if (password.length >= 8) {
    score += 20;
  }
  if (password.length >= 12) {
    score += 10;
  }
  if (password.length >= 16) {
    score += 10;
  }

  // Character diversity
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLowercase) {
    feedback.push('Include lowercase letters');
  } else {
    score += 15;
  }

  if (!hasUppercase) {
    feedback.push('Include uppercase letters');
  } else {
    score += 15;
  }

  if (!hasNumbers) {
    feedback.push('Include numbers');
  } else {
    score += 15;
  }

  if (!hasSpecial) {
    feedback.push('Include special characters');
  } else {
    score += 15;
  }

  // Common patterns check
  const commonPatterns = [
    /^(?:123|abc|qwerty|password|admin|user)/i,
    /(.)\1{2,}/, // Repeated characters (aaa, 111)
    /^(?:\d+|[a-z]+)$/i, // Only numbers or only letters
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      feedback.push('Avoid common patterns and repeated characters');
      score -= 20;
      break;
    }
  }

  return {
    valid: score >= 60 && feedback.length === 0,
    score: Math.max(0, Math.min(100, score)),
    feedback,
  };
}

/**
 * Combined password validation
 *
 * Checks both strength and breach status
 */
export async function validatePassword(
  password: string,
): Promise<{
  valid: boolean;
  strength: PasswordStrengthResult;
  breach: BreachCheckResult;
}> {
  const [strength, breach] = await Promise.all([
    Promise.resolve(validatePasswordStrength(password)),
    checkPasswordBreach(password),
  ]);

  return {
    valid: strength.valid && !breach.breached,
    strength,
    breach,
  };
}

/**
 * Get user-friendly error message for password validation
 */
export function getPasswordValidationMessage(
  strength: PasswordStrengthResult,
  breach: BreachCheckResult,
): string | null {
  if (breach.breached) {
    return `This password has been found in ${breach.occurrences.toLocaleString()} data breaches. Please choose a different password.`;
  }

  if (!strength.valid) {
    return `${strength.feedback.join('. ')}.`;
  }

  return null;
}
