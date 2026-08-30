/**
 * HukukAI demo persistence layer — browser-only, versioned localStorage.
 *
 * NOT a production backend: no server, no auth, no cloud storage, no
 * multi-user sync, no audit trail. State lives under one key
 * (`hukukai.demo.workspace.v1`) and falls back to a deterministic seed.
 */

export * from './types.ts';
export * from './labels.ts';
export { demoRepo, DemoRepository, createRepository } from './repository.ts';
export {
  STORAGE_KEY,
  loadState,
  saveState,
  resetState,
} from './storage.ts';
export {
  createSeedState,
  WORKSPACE_VERSION,
  SEEDED_AT,
  PRIMARY_LAWYER,
  PRIMARY_CASE_ID,
} from './seed.ts';
export {
  getDeadlineInfo,
  byDeadlineUrgency,
  type DeadlineInfo,
  type DeadlineStatus,
} from './deadline.ts';
export {
  useWorkspace,
  useDemoRepo,
  useCases,
  useCase,
  useCaseBundle,
  useAgendaFeed,
  useOpenTasks,
  useActivities,
  useDemoReset,
  caseStatusLabel,
  caseStatusTone,
  type CaseBundle,
  type TodayItem,
} from './hooks.ts';
