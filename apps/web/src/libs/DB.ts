// Unified database entrypoint
//
// This file re-exports the server database instance so that all server-side
// code can import from `@/libs/DB` or `@/server/db/DB` interchangeably.
//
// In development (Node + PGlite), `@/server/db/DB` uses the PostgreSQL
// driver. In production on Cloudflare, we'll switch `@/server/db/DB`
// to use the D1 driver while keeping this public API stable.

export { db } from "@/server/db/DB";
