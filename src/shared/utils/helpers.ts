import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { headers } from 'next/headers';
import { buildTenantPath } from './tenant-context';

const isPromise = (value: unknown): value is Promise<unknown> => {
  return typeof value === 'object'
    && value !== null
    && 'then' in value
    && typeof (value as any).then === 'function';
};

const getHeadersSafe = (): ReadonlyHeaders | null => {
  try {
    const result = headers();
    return isPromise(result) ? null : result as ReadonlyHeaders;
  } catch {
    return null;
  }
};

export const getBaseUrl = () => {
  const headerList = getHeadersSafe();

  let protocol: string | null = null;
  let host: string | null = null;

  if (headerList) {
    protocol = headerList.get('x-forwarded-proto') || headerList.get('protocol');
    host = headerList.get('x-forwarded-host') || headerList.get('host');
  }

  if (protocol && host) {
    return `${protocol}://${host}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  return buildTenantPath(url, locale);
};

export const isServer = () => {
  return typeof window === 'undefined';
};
