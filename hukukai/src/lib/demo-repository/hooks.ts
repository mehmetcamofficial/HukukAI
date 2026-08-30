/**
 * React bindings for the DemoRepository.
 *
 * `useWorkspace()` subscribes a component to the whole demo state via
 * `useSyncExternalStore` (updates also arrive from other tabs). Thin selector
 * hooks derive the common slices with memoisation.
 */

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { demoRepo } from './repository.ts';
import { getDeadlineInfo, byDeadlineUrgency } from './deadline.ts';
import type { DemoCase, ID, WorkspaceState } from './types.ts';

export function useWorkspace(): WorkspaceState {
  return useSyncExternalStore(demoRepo.subscribe, demoRepo.getSnapshot, demoRepo.getSnapshot);
}

/** Stable reference to the repository for actions. */
export function useDemoRepo() {
  return demoRepo;
}

export function useCases() {
  const { cases } = useWorkspace();
  return cases;
}

export function useCase(caseId: ID | undefined) {
  const { cases } = useWorkspace();
  return useMemo(() => cases.find((c) => c.id === caseId), [cases, caseId]);
}

export interface CaseBundle {
  tasks: WorkspaceState['tasks'];
  notes: WorkspaceState['notes'];
  documents: WorkspaceState['documents'];
  timeline: WorkspaceState['timeline'];
  evidence: WorkspaceState['evidence'];
  calendar: WorkspaceState['calendar'];
  researchBookmarks: WorkspaceState['researchBookmarks'];
  drafts: WorkspaceState['drafts'];
  activities: WorkspaceState['activities'];
}

export function useCaseBundle(caseId: ID | undefined): CaseBundle {
  const ws = useWorkspace();
  return useMemo(
    () => ({
      tasks: ws.tasks.filter((t) => t.caseId === caseId),
      notes: ws.notes.filter((n) => n.caseId === caseId),
      documents: ws.documents.filter((d) => d.caseId === caseId),
      timeline: [...ws.timeline.filter((e) => e.caseId === caseId)].sort((a, b) => a.date.localeCompare(b.date)),
      evidence: ws.evidence.filter((e) => e.caseId === caseId),
      calendar: [...ws.calendar.filter((e) => e.caseId === caseId)].sort((a, b) => a.date.localeCompare(b.date)),
      researchBookmarks: ws.researchBookmarks.filter((b) => b.caseId === caseId),
      drafts: ws.drafts.filter((d) => d.caseId === caseId),
      activities: ws.activities.filter((a) => a.caseId === caseId),
    }),
    [ws, caseId],
  );
}

export interface TodayItem {
  id: string;
  kind: 'calendar' | 'task';
  eventType?: string;
  title: string;
  date: string;
  time?: string | null;
  caseId?: ID | null;
  caseLabel?: string;
  responsible?: string;
  status: string;
  deadline: ReturnType<typeof getDeadlineInfo>;
}

/**
 * "Bugün" + "Yaklaşan Süreler" feed: overdue and near-term calendar events and
 * dated open tasks, urgency-sorted. `horizonDays` bounds the look-ahead.
 */
export function useAgendaFeed(horizonDays = 14, reference: Date = new Date()) {
  const ws = useWorkspace();
  return useMemo(() => {
    const caseLabel = (id?: ID | null) => {
      const c = ws.cases.find((x) => x.id === id);
      return c ? `${c.caseNumber ?? c.title}` : undefined;
    };

    const calItems: TodayItem[] = ws.calendar.map((e) => ({
      id: e.id,
      kind: 'calendar' as const,
      eventType: e.eventType,
      title: e.title,
      date: e.date,
      time: e.time,
      caseId: e.caseId,
      caseLabel: caseLabel(e.caseId),
      responsible: e.responsible,
      status: 'upcoming',
      deadline: getDeadlineInfo(e.date, reference),
    }));

    const taskItems: TodayItem[] = ws.tasks
      .filter((t) => t.dueDate && t.status !== 'done')
      .map((t) => ({
        id: t.id,
        kind: 'task' as const,
        eventType: 'ic-gorev',
        title: t.title,
        date: t.dueDate as string,
        caseId: t.caseId,
        caseLabel: caseLabel(t.caseId),
        responsible: t.assignedTo,
        status: t.status,
        deadline: getDeadlineInfo(t.dueDate, reference),
      }));

    const all = [...calItems, ...taskItems].filter(
      (i) => i.deadline.status === 'overdue' || (i.deadline.daysLeft ?? Infinity) <= horizonDays,
    );
    all.sort((a, b) => byDeadlineUrgency(a.date, b.date));

    return {
      today: all.filter((i) => i.deadline.status === 'today'),
      overdue: all.filter((i) => i.deadline.status === 'overdue'),
      upcoming: all.filter((i) => i.deadline.status !== 'today' && i.deadline.status !== 'overdue'),
      all,
    };
  }, [ws, horizonDays, reference]);
}

export function useOpenTasks() {
  const { tasks } = useWorkspace();
  return useMemo(() => tasks.filter((t) => t.status !== 'done'), [tasks]);
}

export function useActivities(limit = 12) {
  const { activities } = useWorkspace();
  return useMemo(() => activities.slice(0, limit), [activities, limit]);
}

/** Convenience: bound reset action for menus/settings. */
export function useDemoReset() {
  return useCallback(() => demoRepo.resetToSeed(), []);
}

export const caseStatusLabel: Record<DemoCase['status'], string> = {
  draft: 'Taslak',
  active: 'Aktif',
  pending: 'Beklemede',
  closed: 'Kapandı',
};

export const caseStatusTone: Record<DemoCase['status'], 'success' | 'warning' | 'neutral' | 'danger'> = {
  draft: 'neutral',
  active: 'success',
  pending: 'warning',
  closed: 'neutral',
};
