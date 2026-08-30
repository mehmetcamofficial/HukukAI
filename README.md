# HukukAI

HukukAI is a source-grounded legal workspace for Turkish lawyers. It brings cases, clients, documents, chronology, research, deadlines, and reviewable AI assistance into one focused workspace.

## Current MVP

The first build is intentionally honest about what is and is not connected:

- The main workspace, dashboard, case list, case workspace, clients, archive, research, chronology, drafting, assistant, and settings surfaces are present.
- The included records are fictional and marked `DEMO VERİ`. They are not legal sources.
- The API uses a typed contract and a demo provider so the product can be explored without inventing legal citations.
- Document records and upload flows are ready for a secure storage adapter; confidential file bytes are not cached by the service worker.
- PostgreSQL schema is prepared for organizations, roles, cases, clients, documents, audit logs, timeline events, research, and retrieval-ready memory chunks.

## Run

```bash
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
```

The web preview is started by the managed HukukAI workflow.

## Architecture

- `lib/api-spec/openapi.yaml` is the API contract.
- `lib/api-client-react` and `lib/api-zod` are generated from the contract.
- `artifacts/api-server/src/routes/hukukai.ts` contains thin, validated demo handlers.
- `artifacts/api-server/src/lib/demo-data.ts` is the clearly labeled demo provider.
- `lib/db/src/schema/hukukai.ts` is the persistence schema.
- `artifacts/hukukai/src` contains the browser application.

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