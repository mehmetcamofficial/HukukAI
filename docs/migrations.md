# Database migrations

The Drizzle schema under `lib/db/src/schema` is the source of truth for the development database. Run `pnpm --filter @workspace/db run push` during development. Production schema changes should use the platform's publish-time schema flow; do not run destructive DDL from application startup.