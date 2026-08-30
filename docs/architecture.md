# HukukAI Architecture

## Request flow

The browser calls typed React Query hooks generated from `lib/api-spec/openapi.yaml`. The Express API validates request bodies and path/query values with generated Zod schemas. Domain logic belongs in the API service layer; the browser never receives provider secrets.

## Domain boundaries

- Cases own documents, chronology, parties, deadlines, evidence, and reviewable analysis.
- Clients are organization-scoped and can be connected to multiple cases.
- Research and sources retain confidence and verification status.
- `memory_chunks` is a vector-search-ready abstraction. It can use PostgreSQL vector support later without changing the UI contract.
- `audit_logs` is the append-only event boundary for security-sensitive actions.

## Demo boundary

The current demo provider is deterministic fictional data. It is a development fixture, not an external legal data integration. Persistence schema is in place, while the first preview keeps the interaction loop fast and visibly marks demo content.