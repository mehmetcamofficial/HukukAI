import { useMemo } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import {
  Check,
  ListChecks,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { SearchInput } from '@/components/search-input';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { useWorkspaceActions } from '@/components/workspace/workspace-actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  demoRepo,
  getDeadlineInfo,
  byDeadlineUrgency,
  PRIMARY_LAWYER,
  taskPriorityLabels,
  taskStatusLabels,
  useWorkspace,
  type DemoTask,
} from '@/lib/demo-repository';

type FilterKey = 'all' | 'mine' | 'open' | 'today' | 'overdue' | 'done';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'mine', label: 'Benim Görevlerim' },
  { key: 'open', label: 'Açık' },
  { key: 'today', label: 'Bugün' },
  { key: 'overdue', label: 'Geciken' },
  { key: 'done', label: 'Tamamlanan' },
];

const priorityTone: Record<DemoTask['priority'], 'neutral' | 'warning' | 'danger'> = {
  low: 'neutral',
  normal: 'neutral',
  high: 'warning',
  critical: 'danger',
};

export function TasksPage() {
  const ws = useWorkspace();
  const actions = useWorkspaceActions();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const q = params.get('q') ?? '';
  const filter = (params.get('filter') as FilterKey) || 'all';

  const [confirmId, setConfirmId] = useState<string | null>(null);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchString);
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    navigate(`/gorevler${qs ? `?${qs}` : ''}`);
  };

  const caseLabel = (id?: string | null) => {
    const c = ws.cases.find((x) => x.id === id);
    return c ? `${c.caseNumber ?? c.title}` : '—';
  };

  const rows = useMemo(() => {
    const norm = q.toLocaleLowerCase('tr-TR');
    return ws.tasks
      .filter((t) => {
        if (norm && !`${t.title} ${t.description ?? ''} ${caseLabel(t.caseId)}`.toLocaleLowerCase('tr-TR').includes(norm)) return false;
        const d = getDeadlineInfo(t.dueDate);
        switch (filter) {
          case 'mine':
            return t.assignedTo === PRIMARY_LAWYER;
          case 'open':
            return t.status !== 'done';
          case 'today':
            return t.status !== 'done' && d.status === 'today';
          case 'overdue':
            return t.status !== 'done' && d.status === 'overdue';
          case 'done':
            return t.status === 'done';
          default:
            return true;
        }
      })
      .sort((a, b) => {
        if ((a.status === 'done') !== (b.status === 'done')) return a.status === 'done' ? 1 : -1;
        return byDeadlineUrgency(a.dueDate, b.dueDate);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.tasks, ws.cases, q, filter]);

  const confirmTask = ws.tasks.find((t) => t.id === confirmId);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Görevler"
        description="Tüm dosyalardaki görevler, öncelikler ve son tarihler."
        action={
          <button
            onClick={() => actions.newTask()}
            data-testid="button-new-task"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} />
            Görev Ekle
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={q}
          onChange={(v) => setParam('q', v)}
          placeholder="Görev veya dosya ara"
          testId="input-search-tasks"
          className="lg:max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setParam('filter', f.key === 'all' ? '' : f.key)}
              data-testid={`filter-tasks-${f.key}`}
              aria-pressed={filter === f.key}
              className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filter === f.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="mono text-[11px] text-muted-foreground lg:ml-auto">{rows.length} görev</span>
      </div>

      {rows.length === 0 ? (
        <EmptyTasks onAdd={() => actions.newTask()} />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-md border border-border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-wider">Görev</TableHead>
                  <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-wider">Dosya</TableHead>
                  <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-wider">Sorumlu</TableHead>
                  <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-wider">Son Tarih</TableHead>
                  <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-wider">Öncelik</TableHead>
                  <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-wider">Durum</TableHead>
                  <TableHead className="h-9 w-[110px] text-right text-[10px] font-semibold uppercase tracking-wider">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => {
                  const d = getDeadlineInfo(t.dueDate);
                  return (
                    <TableRow key={t.id} data-testid={`row-task-${t.id}`}>
                      <TableCell>
                        <p className={`text-sm font-medium ${t.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>{t.title}</p>
                        {t.description && <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{t.description}</p>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {t.caseId ? (
                          <Link href={`/davalar/${t.caseId}`} className="hover:text-foreground hover:underline">
                            {caseLabel(t.caseId)}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{t.assignedTo || '—'}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs">
                        {t.dueDate ? (
                          <span className={d.tone === 'danger' ? 'text-red-600' : d.tone === 'warning' ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}>
                            {formatDate(t.dueDate)} · {d.label}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={priorityTone[t.priority]}>{taskPriorityLabels[t.priority]}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={t.status === 'done' ? 'success' : t.status === 'in-progress' ? 'warning' : 'neutral'}>
                          {taskStatusLabels[t.status]}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-0.5">
                          {t.status === 'done' ? (
                            <IconBtn label="Yeniden aç" onClick={() => { demoRepo.reopenTask(t.id); toast({ title: 'Görev yeniden açıldı.' }); }}>
                              <RotateCcw size={14} />
                            </IconBtn>
                          ) : (
                            <IconBtn label="Tamamla" onClick={() => { demoRepo.completeTask(t.id); toast({ title: 'Görev tamamlandı.' }); }}>
                              <Check size={14} />
                            </IconBtn>
                          )}
                          <IconBtn label="Düzenle" onClick={() => actions.editTask(t.id)}>
                            <Pencil size={14} />
                          </IconBtn>
                          <IconBtn label="Sil" onClick={() => setConfirmId(t.id)}>
                            <Trash2 size={14} />
                          </IconBtn>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile stacked rows */}
          <div className="space-y-2 lg:hidden">
            {rows.map((t) => {
              const d = getDeadlineInfo(t.dueDate);
              return (
                <div key={t.id} className="rounded-md border border-border bg-card p-3" data-testid={`row-task-${t.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${t.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>{t.title}</p>
                    <StatusBadge tone={priorityTone[t.priority]}>{taskPriorityLabels[t.priority]}</StatusBadge>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    {t.caseId && <Link href={`/davalar/${t.caseId}`} className="hover:underline">{caseLabel(t.caseId)}</Link>}
                    {t.dueDate && (
                      <span className={d.tone === 'danger' ? 'text-red-600' : d.tone === 'warning' ? 'text-amber-700 dark:text-amber-300' : ''}>
                        {formatDate(t.dueDate)} · {d.label}
                      </span>
                    )}
                    <StatusBadge tone={t.status === 'done' ? 'success' : t.status === 'in-progress' ? 'warning' : 'neutral'}>
                      {taskStatusLabels[t.status]}
                    </StatusBadge>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    {t.status === 'done' ? (
                      <MobileBtn onClick={() => { demoRepo.reopenTask(t.id); toast({ title: 'Görev yeniden açıldı.' }); }}>Yeniden aç</MobileBtn>
                    ) : (
                      <MobileBtn onClick={() => { demoRepo.completeTask(t.id); toast({ title: 'Görev tamamlandı.' }); }}>Tamamla</MobileBtn>
                    )}
                    <MobileBtn onClick={() => actions.editTask(t.id)}>Düzenle</MobileBtn>
                    <MobileBtn onClick={() => setConfirmId(t.id)}>Sil</MobileBtn>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirmId)}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Görev silinsin mi?"
        description={confirmTask ? `“${confirmTask.title}” görevi kalıcı olarak silinecek.` : undefined}
        confirmLabel="Sil"
        onConfirm={() => {
          if (confirmId) {
            demoRepo.deleteTask(confirmId);
            toast({ title: 'Görev silindi.' });
          }
          setConfirmId(null);
        }}
      />
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

function MobileBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}

function EmptyTasks({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center">
      <ListChecks size={20} className="mb-3 text-muted-foreground" />
      <p className="text-sm font-medium">Bu görünümde görev bulunmuyor</p>
      <p className="mt-1 text-xs text-muted-foreground">Filtreyi değiştirin ya da yeni bir görev ekleyin.</p>
      <button
        onClick={onAdd}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Plus size={14} />
        Görev Ekle
      </button>
    </div>
  );
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
