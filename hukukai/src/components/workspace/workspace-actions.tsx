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
import { CommandPalette } from '@/components/search/command-palette';

interface WorkspaceActions {
  openSearch: () => void;
  newCase: () => void;
  editCase: (caseId: string) => void;
  newTask: (presetCaseId?: string) => void;
  editTask: (taskId: string) => void;
  newNote: (caseId: string) => void;
  editNote: (caseId: string, noteId: string) => void;
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

export function WorkspaceActionsProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState(false);
  const [caseState, setCaseState] = useState<CaseState>({ open: false, caseId: null });
  const [taskState, setTaskState] = useState<TaskState>({ open: false, taskId: null, presetCaseId: null });
  const [noteState, setNoteState] = useState<NoteState>({ open: false, caseId: null, noteId: null });

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
    }),
    [],
  );

  const paletteActions = useMemo(
    () => ({
      newCase: value.newCase,
      newTask: () => value.newTask(),
    }),
    [value],
  );

  const closeCase = useCallback((open: boolean) => setCaseState((s) => ({ ...s, open })), []);
  const closeTask = useCallback((open: boolean) => setTaskState((s) => ({ ...s, open })), []);
  const closeNote = useCallback((open: boolean) => setNoteState((s) => ({ ...s, open })), []);

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
        <NoteDialog
          open={noteState.open}
          onOpenChange={closeNote}
          caseId={noteState.caseId}
          noteId={noteState.noteId}
        />
      )}
    </WorkspaceActionsContext.Provider>
  );
}
