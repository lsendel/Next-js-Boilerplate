import { NextResponse } from 'next/server';

/**
 * Version API Endpoint
 *
 * Returns the current deployed version and build information
 * Used for:
 * - Deployment verification
 * - Rollback validation
 * - Monitoring and diagnostics
 *
 * @returns JSON with version information
 */
export async function GET() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
  const buildTime = process.env.BUILD_TIME || new Date().toISOString();
  const gitCommit = process.env.GIT_COMMIT || 'unknown';

  return NextResponse.json({
    version,
    environment,
    buildTime,
    gitCommit,
    status: 'ok',
  });
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
