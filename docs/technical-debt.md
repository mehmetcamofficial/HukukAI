# Technical Debt — HukukAI

> Phase 0A records honest debt without fixing out-of-scope items. Each item includes impact and deferred phase.

## P0 — Deployment & Runtime

### 1. Express / Vercel deployment mismatch
* **Status:** Deferred to Phase 0B+
* **Description:** `api-server` is a long-running Express server (`node ./dist/index.mjs`). It is incompatible with Vercel's serverless model. No adapter exists.
* **Impact:** Backend cannot be deployed to Vercel as-is. Frontend is Vercel-ready; backend requires separate host or refactor.
* **Options:** See `docs/deployment.md` — (A) adapt to Vercel Functions, (B) deploy Express on Fly/Render/Railway/ECS, (C) consolidate later.
* **Acceptance:** Documented; no fake proxy.

### 2. Missing test infrastructure
* **Status:** Deferred to Phase 0B
* **Description:** No test framework (Vitest/Jest/Playwright) is configured. Root `pnpm test` delegates to `pnpm -r --if-present run test` (no-op today).
* **Impact:** No automated quality gate; CI cannot verify behavior.
* **Next:** Add Vitest for libs + api-server, add Playwright or Vitest browser for `hukukai`, configure CI.

### 3. Missing lint infrastructure
* **Status:** Deferred to Phase 0B
* **Description:** No ESLint/Prettier CI check. Root `pnpm lint` is delegated via `pnpm -r --if-present`.
* **Impact:** Style drift, no automated Clean Code enforcement.
* **Next:** Add `eslint` with `typescript-eslint`, `prettier` check, `pnpm lint` at root.

## P0 — Security & Correctness

### 4. Missing authentication
* **Status:** Planned Phase 0C
* **Description:** No login, session, or managed auth provider integrated. Routes are unauthenticated.
* **Impact:** Cannot enforce identity; unsuitable for real client data.
* **Next:** Integrate auth provider (e.g., Auth.js / Clerk / custom), protect all API routes and frontend guards.

### 5. Missing server-side authorization enforcement
* **Status:** Planned Phase 0C
* **Description:** No organization scoping or role checks (`OWNER`, `LAWYER`, `PARALEGAL`, `READ_ONLY` are designed but not enforced). See `docs/security.md`.
* **Impact:** Tenant isolation is architectural only; no runtime enforcement. Risk of cross-tenant data access if deployed.
* **Next:** Resolve active organization server-side, scope every query (cases, clients, documents, research, memory, audit) to org + role.

### 6. Demo in-memory API data
* **Status:** By design for MVP, replace in Phase 0D+
* **Description:** `api-server/src/lib/demo-data.ts` and `hukukai/src/pages/hukuk-pages.tsx` fallback cases/timeline are deterministic fictional data (`DEMO VERİ`).
* **Impact:** No persistence for demo; production must not treat demo as legal source.
* **Next:** Wire Drizzle persistence, replace fallbacks with real queries, keep demo provider selectable in development only.

### 7. Missing real document storage
* **Status:** Planned Phase 0E
* **Description:** Document upload flows exist but file bytes are not persisted to secure object storage. PostgreSQL stores metadata only.
* **Impact:** Cannot store confidential files; service worker intentionally does not cache legal files (correct).
* **Next:** Integrate S3-compatible storage, validate MIME/extension/size/malware, store object path not bytes in DB, audit.

### 8. Missing real AI integration
* **Status:** Planned Phase 0F
* **Description:** No OpenAI or other provider calls. AI analysis is mocked (`fallbackAnalysis`).
* **Impact:** No real reviewable AI assistance.
* **Next:** Add provider behind rate limiting, timeouts, redaction, audit; never invent citations.

## P1 — Data & Architecture

### 9. Oversized `hukukai/src/pages/hukuk-pages.tsx`
* **Status:** Deferred — intentional in Phase 0A
* **Description:** Single file (~373 lines, but growing) contains `DashboardPage`, `CasesPage`, `ClientsPage`, `DocumentsPage`, `ResearchPage`, `CaseWorkspacePage`, and shared UI primitives (`Button`, `Modal`, `Field`, `PageHeader`). Violates Single Responsibility / Clean Code.
* **Impact:** Hard to test, review, and extend; high churn risk.
* **Next (Boy Scout Rule, not Phase 0A):** Split by route/domain: `pages/dashboard/`, `pages/cases/`, `pages/clients/`, `pages/research/`, `components/case/*`, extract `ui/primitives`. No visual behavior change.

### 10. Incomplete DB relational constraints
* **Status:** Planned
* **Description:** Schema in `lib/db/src/schema/hukukai.ts` defines organizations, cases, clients, documents, audit_logs, timeline_events, etc., but some foreign keys, cascade rules, and indexes are not yet fully hardened; `memory_chunks` lacks full constraints.
* **Impact:** Risk of orphan records, weak integrity under concurrent writes.
* **Next:** Audit FKs, add `onDelete`, `unique`, and index coverage; add migration tests.

### 11. Memory embedding currently not true pgvector
* **Status:** Planned
* **Description:** `memory_chunks` is a vector-search-ready abstraction (see `docs/ai-memory.md`), but true `pgvector` extension, embedding pipeline, and similarity search are not configured.
* **Impact:** No semantic retrieval; research is keyword/demo only.
* **Next:** Enable `pgvector`, add embedding generation (with provider), store vectors, add HNSW index, test recall.

### 12. `api-server` pino transport bundling
* **Status:** Low priority
* **Description:** `esbuild-plugin-pino` bundles `pino-pretty` workers; configuration was Replit-tuned.
* **Impact:** Minor; works but adds bundle complexity.
* **Next:** Verify logging works on chosen host (Vercel vs Node host), simplify if needed.

### 13. Replit overrides still in `pnpm-workspace.yaml`
* **Status:** Retained intentionally in Phase 0A
* **Description:** Overrides that exclude non-linux-x64 `esbuild`/`rollup`/`lightningcss` platforms and catalog pinning remain. They are harmless for Vercel (linux) but overly specific.
* **Impact:** Low; reduces install size today. May need broadening for macOS/Windows contributors if issues appear.
* **Next:** Re-evaluate if local installs fail on darwin; keep minimal.

## Not debt (intentionally preserved in Phase 0A)

* `lib/api-spec` → `lib/api-client-react` / `lib/api-zod` generated code in `src/generated` is intentional source artifact and remains tracked.
* `lib/db/src/schema` is source of truth — not debt.
* `hukukai` remaining on Vite (not Next.js) is a decision, not debt.

## How to use this file

* Add new debt with: Description, Impact, Next step, Phase.
* Remove entry only when fixed and verified via CI (typecheck + build + test).
* Review before each PDCA cycle.
