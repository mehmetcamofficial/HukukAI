import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CaseDialog } from '@/components/dialogs/case-dialog';
import { TaskDialog } from '@/components/dialogs/task-dialog';
import { NoteDialog } from '@/components/dialogs/note-dialog';
import { CalendarEventDialog } from '@/components/dialogs/calendar-event-dialog';
import { TimelineEventDialog } from '@/components/dialogs/timeline-event-dialog';
import { DocumentDialog } from '@/components/dialogs/document-dialog';
import { DocumentDetailDrawer } from '@/components/dialogs/document-detail-drawer';
import { EvidenceClaimDialog } from '@/components/dialogs/evidence-claim-dialog';
import { DraftDialog } from '@/components/dialogs/draft-dialog';
import { ResearchSaveDialog } from '@/components/dialogs/research-save-dialog';
import { CommandPalette } from '@/components/search/command-palette';
import type { CalendarEventType } from '@/lib/demo-repository';
import type { ResearchSaveSource } from '@/components/dialogs/research-save-dialog';

interface WorkspaceActions {
  openSearch: () => void;
  newCase: () => void;
  editCase: (caseId: string) => void;
  newTask: (presetCaseId?: string) => void;
  editTask: (taskId: string) => void;
  newNote: (caseId: string) => void;
  editNote: (caseId: string, noteId: string) => void;
  newCalendarEvent: (preset?: { caseId?: string; type?: CalendarEventType }) => void;
  editCalendarEvent: (eventId: string) => void;
  newTimelineEvent: (caseId: string) => void;
  editTimelineEvent: (caseId: string, eventId: string) => void;
  newDocument: (presetCaseId?: string) => void;
  editDocument: (documentId: string) => void;
  viewDocument: (documentId: string) => void;
  newEvidence: (caseId: string) => void;
  editEvidence: (caseId: string, claimId: string) => void;
  newDraft: (presetCaseId?: string) => void;
  saveResearch: (source: ResearchSaveSource) => void;
}

const WorkspaceActionsContext = createContext<WorkspaceActions | null>(null);

export function useWorkspaceActions(): WorkspaceActions {
  const ctx = useContext(WorkspaceActionsContext);
  if (!ctx) throw new Error('useWorkspaceActions must be used within WorkspaceActionsProvider');
  return ctx;
}

type CaseState = { open: boolean; caseId: string | null };
type TaskState = { open: boolean; taskId: string | null; presetCaseId: string | null };
type NoteState = { open: boolean; caseId: string | null; noteId: string | null };
type CalState = { open: boolean; eventId: string | null; presetCaseId: string | null; presetType: CalendarEventType | null };
type TimelineState = { open: boolean; caseId: string | null; eventId: string | null };
type DocState = { open: boolean; documentId: string | null; presetCaseId: string | null };
type DrawerState = { open: boolean; documentId: string | null };
type EvidenceState = { open: boolean; caseId: string | null; claimId: string | null };
type DraftState = { open: boolean; presetCaseId: string | null };
type ResearchState = { open: boolean; source: ResearchSaveSource | null };

export function WorkspaceActionsProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState(false);
  const [caseState, setCaseState] = useState<CaseState>({ open: false, caseId: null });
  const [taskState, setTaskState] = useState<TaskState>({ open: false, taskId: null, presetCaseId: null });
  const [noteState, setNoteState] = useState<NoteState>({ open: false, caseId: null, noteId: null });
  const [calState, setCalState] = useState<CalState>({ open: false, eventId: null, presetCaseId: null, presetType: null });
  const [timelineState, setTimelineState] = useState<TimelineState>({ open: false, caseId: null, eventId: null });
  const [docState, setDocState] = useState<DocState>({ open: false, documentId: null, presetCaseId: null });
  const [drawerState, setDrawerState] = useState<DrawerState>({ open: false, documentId: null });
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({ open: false, caseId: null, claimId: null });
  const [draftState, setDraftState] = useState<DraftState>({ open: false, presetCaseId: null });
  const [researchState, setResearchState] = useState<ResearchState>({ open: false, source: null });

  // Cmd/Ctrl + K — a deliberate chord, safe to trigger from any field.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = useMemo<WorkspaceActions>(
    () => ({
      openSearch: () => setSearch(true),
      newCase: () => setCaseState({ open: true, caseId: null }),
      editCase: (caseId) => setCaseState({ open: true, caseId }),
      newTask: (presetCaseId) => setTaskState({ open: true, taskId: null, presetCaseId: presetCaseId ?? null }),
      editTask: (taskId) => setTaskState({ open: true, taskId, presetCaseId: null }),
      newNote: (caseId) => setNoteState({ open: true, caseId, noteId: null }),
      editNote: (caseId, noteId) => setNoteState({ open: true, caseId, noteId }),
      newCalendarEvent: (preset) =>
        setCalState({ open: true, eventId: null, presetCaseId: preset?.caseId ?? null, presetType: preset?.type ?? null }),
      editCalendarEvent: (eventId) => setCalState({ open: true, eventId, presetCaseId: null, presetType: null }),
      newTimelineEvent: (caseId) => setTimelineState({ open: true, caseId, eventId: null }),
      editTimelineEvent: (caseId, eventId) => setTimelineState({ open: true, caseId, eventId }),
      newDocument: (presetCaseId) => setDocState({ open: true, documentId: null, presetCaseId: presetCaseId ?? null }),
      editDocument: (documentId) => setDocState({ open: true, documentId, presetCaseId: null }),
      viewDocument: (documentId) => setDrawerState({ open: true, documentId }),
      newEvidence: (caseId) => setEvidenceState({ open: true, caseId, claimId: null }),
      editEvidence: (caseId, claimId) => setEvidenceState({ open: true, caseId, claimId }),
      newDraft: (presetCaseId) => setDraftState({ open: true, presetCaseId: presetCaseId ?? null }),
      saveResearch: (source) => setResearchState({ open: true, source }),
    }),
    [],
  );

  const paletteActions = useMemo(
    () => ({
      newCase: value.newCase,
      newTask: () => value.newTask(),
      newCalendarEvent: () => value.newCalendarEvent(),
      newDocument: () => value.newDocument(),
      newDraft: () => value.newDraft(),
    }),
    [value],
  );

  const closeCase = useCallback((open: boolean) => setCaseState((s) => ({ ...s, open })), []);
  const closeTask = useCallback((open: boolean) => setTaskState((s) => ({ ...s, open })), []);
  const closeNote = useCallback((open: boolean) => setNoteState((s) => ({ ...s, open })), []);
  const closeCal = useCallback((open: boolean) => setCalState((s) => ({ ...s, open })), []);
  const closeTimeline = useCallback((open: boolean) => setTimelineState((s) => ({ ...s, open })), []);
  const closeDoc = useCallback((open: boolean) => setDocState((s) => ({ ...s, open })), []);
  const closeDrawer = useCallback((open: boolean) => setDrawerState((s) => ({ ...s, open })), []);
  const closeEvidence = useCallback((open: boolean) => setEvidenceState((s) => ({ ...s, open })), []);
  const closeDraft = useCallback((open: boolean) => setDraftState((s) => ({ ...s, open })), []);
  const closeResearch = useCallback((open: boolean) => setResearchState((s) => ({ ...s, open })), []);

  return (
    <WorkspaceActionsContext.Provider value={value}>
      {children}

      <CommandPalette open={search} onOpenChange={setSearch} actions={paletteActions} />

      <CaseDialog open={caseState.open} onOpenChange={closeCase} caseId={caseState.caseId} />

      <TaskDialog
        open={taskState.open}
        onOpenChange={closeTask}
        taskId={taskState.taskId}
        presetCaseId={taskState.presetCaseId}
      />

      {noteState.caseId && (
        <NoteDialog open={noteState.open} onOpenChange={closeNote} caseId={noteState.caseId} noteId={noteState.noteId} />
      )}

      <CalendarEventDialog
        open={calState.open}
        onOpenChange={closeCal}
        eventId={calState.eventId}
        presetCaseId={calState.presetCaseId}
        presetType={calState.presetType}
      />

      {timelineState.caseId && (
        <TimelineEventDialog
          open={timelineState.open}
          onOpenChange={closeTimeline}
          caseId={timelineState.caseId}
          eventId={timelineState.eventId}
        />
      )}

      <DocumentDialog
        open={docState.open}
        onOpenChange={closeDoc}
        documentId={docState.documentId}
        presetCaseId={docState.presetCaseId}
      />

      <DocumentDetailDrawer open={drawerState.open} onOpenChange={closeDrawer} documentId={drawerState.documentId} />

      {evidenceState.caseId && (
        <EvidenceClaimDialog
          open={evidenceState.open}
          onOpenChange={closeEvidence}
          caseId={evidenceState.caseId}
          claimId={evidenceState.claimId}
        />
      )}

      <DraftDialog open={draftState.open} onOpenChange={closeDraft} presetCaseId={draftState.presetCaseId} />

      {researchState.source && (
        <ResearchSaveDialog open={researchState.open} onOpenChange={closeResearch} source={researchState.source} />
      )}
    </WorkspaceActionsContext.Provider>
  );
}
