import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  demoRepo,
  taskPriorityLabels,
  taskStatusLabels,
  useWorkspace,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/demo-repository';

export interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string | null;
  presetCaseId?: string | null;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function TaskDialog({ open, onOpenChange, taskId, presetCaseId }: TaskDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const editing = useMemo(() => ws.tasks.find((t) => t.id === taskId), [ws.tasks, taskId]);

  const [form, setForm] = useState(() => blank(presetCaseId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description ?? '',
        caseId: editing.caseId ?? '',
        assignedTo: editing.assignedTo ?? '',
        dueDate: (editing.dueDate ?? '').slice(0, 10),
        priority: editing.priority,
        status: editing.status,
      });
    } else {
      setForm(blank(presetCaseId));
    }
  }, [open, editing, presetCaseId]);

  const set = <K extends keyof ReturnType<typeof blank>>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Görev başlığı zorunludur.');

    const payload = {
      title: form.title,
      description: form.description,
      caseId: form.caseId || null,
      assignedTo: form.assignedTo,
      dueDate: form.dueDate || null,
      priority: form.priority as TaskPriority,
      status: form.status as TaskStatus,
    };

    if (editing) {
      demoRepo.updateTask(editing.id, payload);
      toast({ title: 'Görev güncellendi.' });
    } else {
      demoRepo.createTask(payload);
      toast({ title: 'Görev oluşturuldu.' });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-sm">{editing ? 'Görevi düzenle' : 'Yeni görev'}</DialogTitle>
          <DialogDescription className="text-xs">Görevler bir dosyaya bağlanabilir.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Görev *</span>
            <input autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Açıklama</span>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Dosya</span>
            <select value={form.caseId} onChange={(e) => set('caseId', e.target.value)} className={inputCls}>
              <option value="">Dosyasız</option>
              {ws.cases.map((c) => (
                <option key={c.id} value={c.id}>{c.caseNumber ? `${c.caseNumber} · ` : ''}{c.title}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Sorumlu</span>
              <input value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)} placeholder="Av. Behçet Alp" className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Son Tarih</span>
              <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className={inputCls} />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Öncelik</span>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)} className={inputCls}>
                {(Object.keys(taskPriorityLabels) as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>{taskPriorityLabels[p]}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Durum</span>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                {(Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => (
                  <option key={s} value={s}>{taskStatusLabels[s]}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Vazgeç
            </button>
            <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              {editing ? 'Kaydet' : 'Görev oluştur'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function blank(presetCaseId?: string | null) {
  return {
    title: '',
    description: '',
    caseId: presetCaseId ?? '',
    assignedTo: '',
    dueDate: '',
    priority: 'normal' as string,
    status: 'open' as string,
  };
}
