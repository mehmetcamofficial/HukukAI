import { type ReactNode } from 'react';
import { Redirect } from 'wouter';
import { hasDemoSession } from '@/lib/demo-auth';

export function DemoAuthGuard({ children }: { children: ReactNode }) {
  // DEMO AUTH ONLY — replace with server-side auth later.
  if (!hasDemoSession()) return <Redirect to="/login" replace />;
  return <>{children}</>;
}
