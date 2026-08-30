# Current Deployment Architecture

## Frontend: Vite React PWA → Vercel static deployment

* Stack: Vite 7 + React 19 + TypeScript + Tailwind + wouter (SPA routing)
* Source: `hukukai/`
* Build command: `pnpm --filter @workspace/hukukai run build` (or root `pnpm run build`)
* Output directory: `hukukai/dist/public`
* Base path: `/` by default (override via `BASE_PATH` env if needed)
* Dev port: `5173` by default (override via `PORT` env if needed)
* SPA fallback: configured via `hukukai/vercel.json` and root `vercel.json`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
  Ensures direct navigation / refresh on client routes works:
  `/`, `/davalar`, `/davalar/:caseId`, `/muvekkiller`, `/belgeler`,
  `/hukuki-arastirma`, `/emsal-kararlar`, `/mevzuat`, `/dilekceler`,
  `/takvim`, `/ai-asistan`, `/arsiv`, `/ayarlar`
* No Replit dependency: production build succeeds without `REPL_ID`, `PORT`, or `BASE_PATH`. Replit plugins are optional and dynamically imported only when `REPL_ID` is present.
* Vercel project settings recommendation:
  - Framework preset: Vite
  - Root directory: `hukukai` **or** repository root with custom build/output (both `vercel.json` variants are provided)
  - Install command: `pnpm install`
  - Build command: `pnpm --filter @workspace/hukukai run build`
  - Output directory: `dist/public` (if root = `hukukai`) or `hukukai/dist/public` (if root = repo)

## Backend: Current Express API prototype

* Source: `api-server/`
* Runtime: Node.js 24, Express 5, esbuild bundle (`node --enable-source-maps ./dist/index.mjs`)
* Contract: validated via generated Zod schemas from `lib/api-spec/openapi.yaml`
* Data: demo provider (`api-server/src/lib/demo-data.ts`) — deterministic fictional data, clearly labeled `DEMO VERİ`
* Persistence: Drizzle ORM schema in `lib/db/src/schema/hukukai.ts` (PostgreSQL), not yet enforced at runtime for demo
* **Current status:** Long-running server (`pnpm --filter @workspace/api-server run dev` → build + start). Requires `DATABASE_URL` for real DB path.

### Vercel incompatibility / risk

Vercel's default deployment model is serverless/edge functions. The current `api-server` is a traditional `app.listen()` Express server and is **not** compatible with that model without adaptation:

* It expects a persistent process and port
* It bundles with esbuild for a long-running Node host
* It is not structured as `api/*.ts` serverless handlers
* Deploying it as-is to Vercel would fail (no function entry, no serverless adapter)

This is intentionally **not** rewritten in Phase 0A to avoid destructive changes. The limitation is documented and deferred.

## Database: PostgreSQL planned / current schema

* ORM: Drizzle ORM
* Config: `lib/db/drizzle.config.ts`
* Schema: `lib/db/src/schema/hukukai.ts` — organizations, roles, cases, clients, documents, audit logs, timeline events, research, memory_chunks
* Memory: `memory_chunks` is vector-ready abstraction; true `pgvector` extension is not yet configured — see technical debt
* No production database is connected in Phase 0A; demo provider bypasses persistence for fast preview

---

## Backend options for later phases

### Option A — Adapt API routes to Vercel Functions

**Approach:** Refactor `api-server/src/routes/*` into Vercel Serverless Functions (`api/**/*.ts` or `hukukai/api` or standalone `api/`). Use `@vercel/node` or similar adapter. Keep Zod validation and Drizzle.

**Pros:**
* Single deployment (frontend + API) on Vercel
* Automatic scaling, preview deployments include API
* Simplifies CORS (same origin)

**Cons / Risks:**
* Requires architectural refactor (lifecycle, not just move files)
* Long-running concerns (websockets, file uploads, background jobs) poorly suited to serverless timeouts (10s/60s limits)
* Cold starts; vendor lock-in to Vercel function constraints
* Need to rework logging (`pino` workers), file handling

**When justified:** If API remains CRUD-light, stateless, and within serverless limits.

### Option B — Deploy Express API separately on a suitable Node host

**Approach:** Keep Express as-is, deploy to a Node-friendly host (e.g., Fly.io, Render, Railway, AWS ECS/Fargate, DigitalOcean App Platform). Frontend on Vercel points to API via `VITE_API_URL`.

**Pros:**
* Minimal code change; preserves current architecture
* Supports long-running, streaming, file uploads, websockets
* Clear separation of concerns; easier to add rate limiting, audit, object storage

**Cons / Risks:**
* Two deployments to manage (CORS, env coordination)
* Separate scaling, monitoring, preview envs

**When justified:** Default safe choice for Phase 0B; preserves momentum without forcing serverless migration.

### Option C — Later consolidate architecture if justified

**Approach:** Defer decision until product requirements clarify. Keep contract (`lib/api-spec`) stable so either path works. Evaluate after auth, storage, and legal integrations are defined.

**Pros:**
* No premature optimization; contract-first allows swap
* PDCA-friendly: measure real load, latency, and hosting needs first

**Cons / Risks:**
* Decision delay if not time-boxed

**Decision for Phase 0A:** No destructive migration. Document options, keep `api-server` intact, prepare only frontend for Vercel. Backend deployment will be finalized in a later Phase 0 task (0B+).

---

## Environment variables (Phase 0A)

| Variable | Required | Used by | Notes |
|----------|----------|---------|-------|
| `DATABASE_URL` | Yes for real DB | `api-server`, `lib/db` | Postgres connection string; not required for frontend static build or demo mode |
| `PORT` | No | `hukukai` dev/preview, `api-server` | Defaults to 5173 (frontend) / 5000 (api-server convention). Overridable. |
| `BASE_PATH` | No | `hukukai` vite base | Defaults to `/`. |
| `REPL_ID` | No | `hukukai` vite (optional cartographer/banner) | Only inside Replit; not required elsewhere. |

See `.env.example` for placeholders.

## Tradeoffs recorded

* Preserving `hukukai/` + `api-server/` at repo root avoids large git moves and keeps history, at cost of diverging from Replit's `artifacts/` layout (intentionally abandoned).
* Keeping Vite (not migrating to Next.js) preserves SPA investment; Vercel static hosting is the minimal viable deployment, not a full SSR migration.
* Ignoring `dist/` and `*.tsbuildinfo` cleans git history but requires CI to rebuild — acceptable and desired.
* Not rewriting backend now avoids risk of breaking demo contract; cost is documented deployment gap that must be resolved before production data.

## Verification

```bash
# Frontend builds without Replit env
REPL_ID= PORT= BASE_PATH= pnpm --filter @workspace/hukukai run build
# Expected: vite build succeeds, outputs to hukukai/dist/public/index.html + assets

# Full workspace
pnpm run typecheck
pnpm run build
```
