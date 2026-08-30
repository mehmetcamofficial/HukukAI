# HukukAI

HukukAI is a source-grounded legal workspace for Turkish lawyers. It brings cases, clients, documents, chronology, research, deadlines, and reviewable AI assistance into one focused workspace.

## Current MVP

The first build is intentionally honest about what is and is not connected:

- The main workspace, dashboard, case list, case workspace, clients, archive, research, chronology, drafting, assistant, and settings surfaces are present.
- The included records are fictional and marked `DEMO VERİ`. They are not legal sources.
- The API uses a typed contract and a demo provider so the product can be explored without inventing legal citations.
- Document records and upload flows are ready for a secure storage adapter; confidential file bytes are not cached by the service worker.
- PostgreSQL schema is prepared for organizations, roles, cases, clients, documents, audit logs, timeline events, research, and retrieval-ready memory chunks.

## Architecture

* `hukukai/` — Vite/React PWA frontend (SPA, client-side routing via wouter)
* `api-server/` — Express typed API prototype (long-running Node server, not yet Vercel serverless)
* `lib/api-spec/` — OpenAPI contract (`openapi.yaml`)
* `lib/api-client-react/` — generated React Query hooks from the contract (via Orval)
* `lib/api-zod/` — generated Zod validation schemas from the contract
* `lib/db/` — Drizzle ORM + PostgreSQL persistence layer (`lib/db/src/schema/hukukai.ts`)
* `api-server/src/routes/hukukai.ts` — thin, validated demo handlers
* `api-server/src/lib/demo-data.ts` — clearly labeled demo provider (fictional data)

## Local Development

Prerequisites: Node.js 24, pnpm

```bash
# Install all workspace packages
pnpm install

# Run frontend only (http://localhost:5173)
pnpm dev
# or explicitly:
pnpm --filter @workspace/hukukai run dev

# Optional: customize dev server
# PORT=5173 BASE_PATH=/ pnpm --filter @workspace/hukukai run dev

# Typecheck entire workspace
pnpm run typecheck

# Build entire workspace
pnpm run build

# Build / typecheck individual packages
pnpm --filter @workspace/hukukai run build
pnpm --filter @workspace/hukukai run typecheck
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run typecheck

# Regenerate API client + Zod from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Database (requires DATABASE_URL)
pnpm --filter @workspace/db run push
```

No `REPL_ID`, `PORT`, or `BASE_PATH` is required for local development or production build. Sensible defaults are used (`/` for base, `5173` for dev port).

## Deployment Status

**Frontend:** Prepared for Vercel static deployment.
- Vite production build outputs to `hukukai/dist/public`.
- SPA rewrites are configured via `hukukai/vercel.json` and root `vercel.json` so direct refresh on `/davalar`, `/muvekkiller`, `/hukuki-arastirma`, `/ai-asistan`, `/davalar/:caseId` and other client routes works.
- Build command: `pnpm --filter @workspace/hukukai run build`
- Output directory: `hukukai/dist/public`
- No Replit infrastructure required.

**Backend:** Current Express API prototype is **not** yet finalized for Vercel serverless.
- `api-server` runs as a traditional long-running Express server (`node ./dist/index.mjs`).
- It is incompatible with Vercel's serverless function model without adaptation.
- See `docs/deployment.md` for options (adapt to Vercel Functions, deploy separately on a Node host, or consolidate later). No backend deployment is performed in Phase 0A.

**Database:** PostgreSQL schema is defined via Drizzle ORM in `lib/db`. No production database is connected in this phase.

**No production legal data source is currently integrated.** Official sources (UYAP, Yargıtay, Danıştay, AYM, Resmî Gazete) remain Phase 0B+ work behind `LegalSourceProvider` adapters. See `docs/legal-source-verification.md`.

## Safety boundaries

HukukAI must never present invented statutes, article numbers, decisions, dates, quotations, deadlines, or citations as confirmed law. Unverified statements use `Kaynak doğrulanamadı.` and AI outputs remain reviewable. Calculated deadlines show `Avukat kontrolü gerektirir.`. Generated documents do not become final documents automatically.

Authentication, tenant isolation, secure object storage, rate limiting, and audit enforcement are represented in the architecture and are the next production hardening step. Do not treat the demo provider as production legal data.

## Future Legal Data Integrations

Official integrations should be added behind `LegalSourceProvider` adapters rather than in UI components:

1. Add a provider under the API server service layer for verified Resmî Gazete, UYAP Mevzuat, Yargıtay, Danıştay, Anayasa Mahkemesi, and Uyuşmazlık Mahkemesi sources where access is legally and technically available.
2. Implement `searchLegislation`, `searchPrecedents`, `getSource`, and `verifyCitation`.
3. Persist provider identifiers, retrieval timestamps, excerpts, URL/reference, and verification status with each source.
4. Keep the demo provider selectable in development and label it visibly.
5. Never scrape a site that prohibits automated access and do not automate UYAP actions in the MVP.
6. Connect verified provider results to the research, precedent, comparison, contradiction, and drafting workflows through the existing source shape.

## Quality commands

```bash
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/api-spec run codegen
```

Lint and test infrastructure is planned for Phase 0B. See `docs/technical-debt.md`. Root `pnpm lint` / `pnpm test` delegate to workspace packages via `pnpm -r --if-present`.
