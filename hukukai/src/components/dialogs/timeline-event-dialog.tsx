import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  demoRepo,
  timelineEventTypeLabels,
  useWorkspace,
  type TimelineEventType,
} from '@/lib/demo-repository';

export interface TimelineEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  eventId?: string | null;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function TimelineEventDialog({ open, onOpenChange, caseId, eventId }: TimelineEventDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const editing = useMemo(() => ws.timeline.find((e) => e.id === eventId), [ws.timeline, eventId]);
  const caseDocuments = useMemo(() => ws.documents.filter((d) => d.caseId === caseId), [ws.documents, caseId]);

  const [form, setForm] = useState(blank());
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editing) {
      setForm({
        date: (editing.date ?? '').slice(0, 10),
        title: editing.title,
        eventType: editing.eventType,
        description: editing.description ?? '',
        relatedDocumentId: editing.relatedDocumentId ?? '',
      });
    } else {
      setForm(blank());
    }
  }, [open, editing]);

  const set = <K extends keyof ReturnType<typeof blank>>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Başlık zorunludur.');
    if (!form.date) return setError('Tarih zorunludur.');

    const payload = {
      date: form.date,
      title: form.title,
      eventType: form.eventType as TimelineEventType,
      description: form.description,
      relatedDocumentId: form.relatedDocumentId || null,
    };

    if (editing) {
      demoRepo.updateTimelineEvent(editing.id, payload);
      toast({ title: 'Kronoloji olayı güncellendi.' });
    } else {
      demoRepo.createTimelineEvent({ caseId, ...payload });
      toast({ title: 'Kronoloji olayı eklendi.' });
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-sm">{editing ? 'Olayı düzenle' : 'Kronolojiye olay ekle'}</DialogTitle>
            <DialogDescription className="text-xs">
              Kaynak durumu demo etiketleriyle korunur; otomatik doğrulama yapılmaz.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3 px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Tarih *</span>
                <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} data-testid="input-timeline-date" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Tür</span>
                <select value={form.eventType} onChange={(e) => set('eventType', e.target.value)} className={inputCls}>
                  {(Object.keys(timelineEventTypeLabels) as TimelineEventType[]).map((t) => (
                    <option key={t} value={t}>{timelineEventTypeLabels[t]}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-medium">Başlık *</span>
              <input autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} data-testid="input-timeline-title" />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium">Açıklama</span>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium">İlgili belge (isteğe bağlı)</span>
              <select value={form.relatedDocumentId} onChange={(e) => set('relatedDocumentId', e.target.value)} className={inputCls}>
                <option value="">—</option>
                {caseDocuments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </label>

            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

            <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
              {editing ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={13} /> Sil
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                  Vazgeç
                </button>
                <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  {editing ? 'Kaydet' : 'Ekle'}
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Kronoloji olayı silinsin mi?"
        description={editing ? `“${editing.title}” olayı kalıcı olarak silinecek.` : undefined}
        confirmLabel="Sil"
        onConfirm={() => {
          if (editing) {
            demoRepo.deleteTimelineEvent(editing.id);
            toast({ title: 'Kronoloji olayı silindi.' });
          }
          setConfirmDelete(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

function blank() {
  return {
    date: '',
    title: '',
    eventType: 'islem' as string,
    description: '',
    relatedDocumentId: '',
  };
}
