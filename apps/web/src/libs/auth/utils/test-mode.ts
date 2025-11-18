import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const TEST_PROVIDER = 'test';

export const isTestAuthEnabled = () =>
  process.env.NEXT_PUBLIC_AUTH_PROVIDER === TEST_PROVIDER;

export const guardTestAuthRequest = () => {
  if (!isTestAuthEnabled()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  return null;
};

export const hashTestPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const verifyTestPassword = async (
  password: string,
  hash: string,
) => {
  return bcrypt.compare(password, hash);
};
