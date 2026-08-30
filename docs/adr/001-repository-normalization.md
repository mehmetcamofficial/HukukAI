# ADR 001 — Repository Normalization for GitHub & Vercel (Phase 0A)

Date: 2026-08-30
Status: Accepted
Phase: 0A — Repository Normalization & Vercel Foundation

## Context

The repository originated from Replit and was uploaded manually to GitHub. It carried Replit-specific assumptions inconsistent with the current filesystem layout:

* `pnpm-workspace.yaml` referenced `artifacts/*`, `lib/integrations/*`, `scripts` — but actual application directories live at repository root as `hukukai/` and `api-server/` (previously `artifacts/hukukai`, `artifacts/api-server` on Replit). This caused workspace packages to not resolve, breaking `pnpm install` and category catalog resolution.
* `README.md` referenced `artifacts/api-server` and `artifacts/hukukai`, which no longer matched reality, misleading contributors.
* `hukukai/vite.config.ts` required `PORT` and `BASE_PATH` env variables unconditionally (throwing at import time) and hard-imported `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`. Production build failed without `REPL_ID`, `PORT`, `BASE_PATH`, blocking local development and Vercel deployment.
* `api-server` was a traditional long-running Express server (`node ./dist/index.mjs`), incompatible with Vercel's serverless function model. Rewriting it in Phase 0A would be destructive and out of scope.
* Generated build artifacts (`api-server/dist/`, `lib/**/dist/`, `*.tsbuildinfo`, `*.map`) were tracked in git, polluting history and diverging from reproducible builds.
* `replit.md` described obsolete Replit workflows and contained template placeholders.
* No `.gitignore` existed; no SPA fallback was configured for client-side routes.

Engineering rules for this phase: Kaizen/PDCA, Clean Code, Security by Design, Minimal Safe Changes, Boy Scout Rule, no shortcuts, no hidden problems, no broad `any`, no disabled TypeScript.

## Decision

1. **Preserve current root folders** (`hukukai/`, `api-server/`, `lib/`). Normalize workspace configuration around them rather than recreating Replit's `artifacts/` layout. Final structure:
   ```
   HukukAI/
   ├── api-server/
   ├── hukukai/
   ├── lib/{api-client-react,api-spec,api-zod,db}
   ├── docs/
   ├── mockup-sandbox/  (kept — contains useful source material)
   ├── vercel.json
   └── hukukai/vercel.json
   ```
   * `mockup-sandbox` is retained; it contains mockup tooling that may inform future UI work. Not added blindly to build, but kept in workspace as optional package.

2. **Fix `pnpm-workspace.yaml`** to list actual packages:
   ```yaml
   packages:
     - hukukai
     - api-server
     - lib/*
     - mockup-sandbox
   ```
   Removed stale `artifacts/*`, `lib/integrations/*`, `scripts` globs. Catalog and overrides preserved. Workspace dependencies (`@workspace/api-client-react`, `@workspace/api-zod`, `@workspace/db`) now resolve correctly.

3. **Normalize root `package.json` scripts** to generic, non-Replit commands:
   - `pnpm dev` → delegates to frontend
   - `pnpm build` → typecheck + recursive build
   - `pnpm typecheck` → `tsc --build` for libs + recursive typecheck for apps
   - `pnpm lint` / `pnpm test` → `pnpm -r --if-present` delegation (no fake passes; gaps documented as Phase 0B debt)

4. **Refactor `hukukai/vite.config.ts`** for portable builds:
   - Default `base: "/"` (override via `BASE_PATH` if set)
   - Default `port: 5173` (override via `PORT` if set; no throw)
   - Replit plugins dynamically imported and gated behind `process.env.REPL_ID !== undefined && NODE_ENV !== "production"`; `runtimeErrorOverlay` also optional via try/catch. Production build no longer requires Replit infrastructure.
   - Keep standard Vite behavior; no Vercel-specific code injected into React app.

5. **Preserve Vite frontend, do not migrate to Next.js** in Phase 0A. The frontend is a mature Vite + React + TypeScript SPA; migration would be high-risk and unnecessary for static deployment.

6. **Do not rewrite backend yet.** Document incompatibility with Vercel serverless explicitly in `docs/deployment.md` and `docs/technical-debt.md`. Offer options A (adapt to Vercel Functions), B (deploy Express separately), C (defer consolidation) without destructive migration now.

7. **Vercel frontend preparation only:**
   - Production build outputs to `hukukai/dist/public` (clean static output)
   - SPA rewrites added in both `hukukai/vercel.json` and root `vercel.json` to support refresh on `/davalar`, `/muvekkiller`, `/hukuki-arastirma`, `/ai-asistan`, etc.
   - No fake API proxy.

8. **Generated file cleanup:**
   - Created `.gitignore` covering `dist/`, `**/dist/`, `*.tsbuildinfo`, `*.map`, `node_modules/`, `.env`, coverage, `.vercel`, OS files.
   - Removed tracked build outputs via `git rm --cached` (api-server/dist, lib/*/dist, tsbuildinfo). Source-generated API contracts (`lib/api-client-react/src/generated`, `lib/api-zod/src/generated`) remain tracked intentionally.

9. **Handle `replit.md`:**
   - Useful run info migrated to `README.md` and `docs/deployment.md`.
   - File removed via `git rm` (now obsolete; no misleading instructions kept). If architecture info were still needed it would have been preserved — inspection showed only template placeholders.

10. **GitHub as source of truth:** Branch `phase-0-foundation` used; no direct `main` mutation; PR-ready summary produced. Vercel will deploy from GitHub, not Replit.

## Alternatives Considered

* **Restore `artifacts/` layout:** Would require moving `hukukai/` and `api-server/` back under `artifacts/` to match old `pnpm-workspace.yaml` and `README`. Rejected: large git moves, history churn, breaks current developer expectations, reintroduces Replit coupling. Minimal safe change is to fix config to match filesystem, not vice versa.
* **Rewrite `api-server` to Vercel Functions now (Option A):** Rejected for Phase 0A — high risk, out of scope, violates Minimal Safe Changes. Would also need auth, storage, and validation rework simultaneously.
* **Migrate frontend to Next.js:** Rejected — no requirement, would invalidate existing SPA routing, PWA manifest, and component library investment.
* **Delete `mockup-sandbox`:** Considered but inspection showed useful source material (mockupPreviewPlugin, alternate vite config). Retained as optional workspace package; not included in production build path.
* **Keep hard `PORT`/`BASE_PATH` requirements:** Rejected — violates Security by Design portability and blocks Vercel and clean local dev.
* **Keep tracked `dist/`:** Rejected — violates reproducible builds, bloats repo, hides build failures.

## Consequences

* **Positive:**
  - `pnpm install` resolves all packages correctly; catalog dependencies deduplicated.
  - `pnpm run typecheck` and `pnpm run build` succeed cleanly without Replit env.
  - Frontend builds on clean environment (`REPL_ID= PORT= BASE_PATH= pnpm --filter @workspace/hukukai run build`) — verified Vercel proof.
  - SPA routing survives refresh on deep links.
  - Git history cleaned of reproducible artifacts; future CI can rebuild deterministically.
  - Honest deployment docs prevent false production readiness claims.

* **Negative / Deferred:**
  - Backend still not deployable to Vercel — must be resolved in Phase 0B+ (tradeoff explicitly accepted).
  - `mockup-sandbox` remains but is not part of deployment; may be archived later if unused.
  - Lint/test infra still absent — documented as debt, not faked.

* **Risks mitigated:**
  - No secrets committed; `.env` ignored, `.env.example` provided.
  - No TypeScript weakening, no test deletions, no security assumptions weakened.

## References

* `pnpm-workspace.yaml` (before/after)
* `hukukai/vite.config.ts` (before/after)
* `README.md` (stale path fix)
* `docs/deployment.md` (new)
* `docs/technical-debt.md` (new)
* `vercel.json` + `hukukai/vercel.json` (new SPA rewrites)
