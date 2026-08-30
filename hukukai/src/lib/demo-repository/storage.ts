/**
 * HukukAI — versioned localStorage access for the demo workspace.
 *
 * One key, one JSON blob, safe parsing, deterministic fallback to the seeded
 * dataset. No other browser storage is touched. This is a demo convenience,
 * not a persistence guarantee.
 */

import { createSeedState, WORKSPACE_VERSION } from './seed.ts';
import type { WorkspaceState, WorkspaceCollectionKey } from './types.ts';

export const STORAGE_KEY = 'hukukai.demo.workspace.v1';

const COLLECTION_KEYS: WorkspaceCollectionKey[] = [
  'clients',
  'cases',
  'tasks',
  'notes',
  'documents',
  'timeline',
  'evidence',
  'calendar',
  'researchBookmarks',
  'drafts',
  'activities',
];

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

/** Shallow structural check so a corrupt / stale blob falls back to the seed. */
function isWorkspaceShape(value: unknown): value is WorkspaceState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (!v.meta || typeof v.meta !== 'object') return false;
  if ((v.meta as { version?: unknown }).version !== WORKSPACE_VERSION) return false;
  return COLLECTION_KEYS.every((key) => Array.isArray(v[key]));
}

/** Guarantee every collection key exists even if a future seed adds one. */
function normalize(state: WorkspaceState): WorkspaceState {
  const seed = createSeedState();
  const next = { ...state, meta: { ...seed.meta, ...state.meta } } as WorkspaceState;
  for (const key of COLLECTION_KEYS) {
    if (!Array.isArray(next[key])) {
      // @ts-expect-error index write across the heterogeneous union is safe here
      next[key] = seed[key];
    }
  }
  return next;
}

export function loadState(): WorkspaceState {
  if (!hasStorage()) return createSeedState();
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return createSeedState();
  }
  if (!raw) {
    const seeded = createSeedState();
    saveState(seeded);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isWorkspaceShape(parsed)) {
      const seeded = createSeedState();
      saveState(seeded);
      return seeded;
    }
    return normalize(parsed);
  } catch {
    const seeded = createSeedState();
    saveState(seeded);
    return seeded;
  }
}

export function saveState(state: WorkspaceState): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — demo tolerates a non-persistent session */
  }
}

/** Clear ONLY the HukukAI demo workspace key and return a fresh seeded state. */
export function resetState(): WorkspaceState {
  if (hasStorage()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  const seeded = createSeedState();
  saveState(seeded);
  return seeded;
}
