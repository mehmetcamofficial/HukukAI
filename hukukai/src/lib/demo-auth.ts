export const DEMO_SESSION_KEY = 'hukukai-demo-session';

// DEMO AUTH ONLY — replace with server-side auth later.
export function hasDemoSession(): boolean {
  return typeof window !== 'undefined' && window.localStorage.getItem(DEMO_SESSION_KEY) === 'true';
}

// DEMO AUTH ONLY — replace with server-side auth later.
export function createDemoSession(): void {
  window.localStorage.setItem(DEMO_SESSION_KEY, 'true');
}

// DEMO AUTH ONLY — replace with server-side auth later.
export function clearDemoSession(): void {
  window.localStorage.removeItem(DEMO_SESSION_KEY);
}
