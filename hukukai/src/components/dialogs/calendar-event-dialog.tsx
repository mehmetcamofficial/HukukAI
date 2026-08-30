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
  calendarEventTypeLabels,
  demoRepo,
  useWorkspace,
  type CalendarEventType,
} from '@/lib/demo-repository';

export interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string | null;
  presetCaseId?: string | null;
  presetType?: CalendarEventType | null;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function CalendarEventDialog({
  open,
  onOpenChange,
  eventId,
  presetCaseId,
  presetType,
}: CalendarEventDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const editing = useMemo(() => ws.calendar.find((e) => e.id === eventId), [ws.calendar, eventId]);

  const [form, setForm] = useState(() => blank(presetCaseId, presetType));
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editing) {
      setForm({
        title: editing.title,
        caseId: editing.caseId ?? '',
        eventType: editing.eventType,
        date: (editing.date ?? '').slice(0, 10),
        time: editing.time ?? '',
        responsible: editing.responsible ?? '',
        description: editing.description ?? '',
      });
    } else {
      setForm(blank(presetCaseId, presetType));
    }
  }, [open, editing, presetCaseId, presetType]);

  const set = <K extends keyof ReturnType<typeof blank>>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Başlık zorunludur.');
    if (!form.date) return setError('Tarih zorunludur.');

    const payload = {
      title: form.title,
      caseId: form.caseId || null,
      eventType: form.eventType as CalendarEventType,
      date: form.date,
      time: form.time || null,
      responsible: form.responsible,
      description: form.description,
    };

    if (editing) {
      demoRepo.updateCalendarEvent(editing.id, payload);
      toast({ title: 'Takvim kaydı güncellendi.' });
    } else {
      demoRepo.createCalendarEvent(payload);
      const label = form.eventType === 'durusma' ? 'Duruşma takvime eklendi.' : form.eventType === 'son-sure' ? 'Süre takvime eklendi.' : 'Takvim kaydı eklendi.';
      toast({ title: label });
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-sm">{editing ? 'Takvim kaydını düzenle' : 'Takvime kayıt ekle'}</DialogTitle>
            <DialogDescription className="text-xs">
              Duruşma ve süreler dosya bağlamıyla birlikte takvimde tutulur.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3 px-5 py-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Başlık *</span>
              <input autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Tür</span>
                <select value={form.eventType} onChange={(e) => set('eventType', e.target.value)} className={inputCls} data-testid="select-calendar-type">
                  {(Object.keys(calendarEventTypeLabels) as CalendarEventType[]).map((t) => (
                    <option key={t} value={t}>{calendarEventTypeLabels[t]}</option>
                  ))}
                </select>
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
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Tarih *</span>
                <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} data-testid="input-calendar-date" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Saat (isteğe bağlı)</span>
                <input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className={inputCls} />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-medium">Sorumlu</span>
              <input value={form.responsible} onChange={(e) => set('responsible', e.target.value)} placeholder="Av. Behçet Alp" className={inputCls} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium">Açıklama</span>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
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
        title="Takvim kaydı silinsin mi?"
        description={editing ? `“${editing.title}” kaydı kalıcı olarak silinecek.` : undefined}
        confirmLabel="Sil"
        onConfirm={() => {
          if (editing) {
            demoRepo.deleteCalendarEvent(editing.id);
            toast({ title: 'Takvim kaydı silindi.' });
          }
          setConfirmDelete(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

function blank(presetCaseId?: string | null, presetType?: CalendarEventType | null) {
  return {
    title: '',
    caseId: presetCaseId ?? '',
    eventType: (presetType ?? 'durusma') as string,
    date: '',
    time: '',
    responsible: '',
    description: '',
  };
}
