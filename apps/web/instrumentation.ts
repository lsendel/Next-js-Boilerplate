/**
 * Next.js Instrumentation Hook
 * This runs once when the Next.js server starts, before any middleware or routes are initialized
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // In development with pglite-server, migrations are handled by the --run flag
  // In production builds, migrations run via the build script
  // This hook is mainly for initialization tasks, not migrations

  if (process.env.NEXT_RUNTIME === 'nodejs' || !process.env.NEXT_RUNTIME) {
    // Initialization logic can go here
    // For now, we'll let pglite-server and build scripts handle migrations
  }
}
