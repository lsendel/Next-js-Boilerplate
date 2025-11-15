/**
 * Validation Utilities
 *
 * Pure validation functions
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return Boolean(parsedUrl);
  } catch {
    return false;
  }
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex
    = /^[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0;
}

export function hasMinLength(str: string, minLength: number): boolean {
  return str.length >= minLength;
}

export function hasMaxLength(str: string, maxLength: number): boolean {
  return str.length <= maxLength;
}
