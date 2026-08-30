import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { LoaderCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  caseOutcomeLabels,
  caseStatusLabels,
  caseTypeLabels,
  demoRepo,
  useWorkspace,
  type CaseOutcome,
  type CaseStatus,
  type CaseType,
} from '@/lib/demo-repository';

export interface CaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present → edit mode. */
  caseId?: string | null;
  /** Pre-select a client (e.g. opened from a client detail page). */
  presetClientId?: string | null;
}

const NEW_CLIENT = '__new__';
const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function CaseDialog({ open, onOpenChange, caseId, presetClientId }: CaseDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const editing = useMemo(() => ws.cases.find((c) => c.id === caseId), [ws.cases, caseId]);

  const [form, setForm] = useState(() => blankForm());
  const [clientChoice, setClientChoice] = useState<string>(presetClientId ?? '');
  const [newClientName, setNewClientName] = useState('');
  const [newClientType, setNewClientType] = useState<'individual' | 'corporate'>('individual');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset the form whenever the dialog (re)opens.
  useEffect(() => {
    if (!open) return;
    setError('');
    if (editing) {
      setForm({
        title: editing.title,
        caseType: editing.caseType,
        court: editing.court ?? '',
        caseNumber: editing.caseNumber ?? '',
        opposingParty: editing.opposingParty ?? '',
        responsible: editing.responsible ?? '',
        openedAt: (editing.openedAt ?? '').slice(0, 10),
        nextHearing: (editing.nextHearing ?? '').slice(0, 10),
        note: editing.note ?? '',
        status: editing.status,
        outcome: editing.outcome ?? '',
      });
      setClientChoice(editing.clientId ?? '');
    } else {
      setForm(blankForm());
      setClientChoice(presetClientId ?? '');
    }
    setNewClientName('');
    setNewClientType('individual');
  }, [open, editing, presetClientId]);

  const set = <K extends keyof ReturnType<typeof blankForm>>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Dosya başlığı zorunludur.');
    if (!form.caseType) return setError('Dosya türü zorunludur.');

    const creatingClient = clientChoice === NEW_CLIENT;
    if (!clientChoice) return setError('Müvekkil seçin veya yeni müvekkil oluşturun.');
    if (creatingClient && !newClientName.trim()) return setError('Yeni müvekkil adı zorunludur.');

    setSubmitting(true);
    try {
      const base = {
        title: form.title,
        caseType: form.caseType as CaseType,
        court: form.court,
        caseNumber: form.caseNumber,
        opposingParty: form.opposingParty,
        responsible: form.responsible,
        openedAt: form.openedAt || null,
        nextHearing: form.nextHearing || null,
        note: form.note,
      };

      if (editing) {
        const client = ws.clients.find((c) => c.id === clientChoice);
        demoRepo.updateCase(editing.id, {
          ...base,
          clientId: client?.id ?? editing.clientId,
          clientName: client?.name ?? editing.clientName,
        });
        toast({ title: 'Dosya güncellendi.' });
        onOpenChange(false);
        return;
      }

      let created;
      if (creatingClient) {
        const res = demoRepo.createCaseWithNewClient(base, {
          name: newClientName,
          type: newClientType,
        });
        created = res.case;
      } else {
        const client = ws.clients.find((c) => c.id === clientChoice);
        created = demoRepo.createCase({
          ...base,
          clientId: client?.id ?? null,
          clientName: client?.name ?? '',
        });
      }
      toast({ title: 'Dava oluşturuldu.', description: `${created.title}` });
      onOpenChange(false);
      setLocation(`/davalar/${created.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-sm">{editing ? 'Dosyayı düzenle' : 'Yeni dava'}</DialogTitle>
          <DialogDescription className="text-xs">
            Demo ortamı · veriler yalnızca bu tarayıcıda saklanır.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Dosya Başlığı *</span>
            <input autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Dosya Türü *</span>
              <select value={form.caseType} onChange={(e) => set('caseType', e.target.value)} className={inputCls}>
                {Object.entries(caseTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Esas No</span>
              <input value={form.caseNumber} onChange={(e) => set('caseNumber', e.target.value)} placeholder="2026/145" className={inputCls} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Mahkeme</span>
            <input value={form.court} onChange={(e) => set('court', e.target.value)} className={inputCls} />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Müvekkil *</span>
            <select value={clientChoice} onChange={(e) => setClientChoice(e.target.value)} className={inputCls}>
              <option value="">Seçin…</option>
              {ws.clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value={NEW_CLIENT}>+ Yeni Müvekkil Oluştur</option>
            </select>
          </label>

          {clientChoice === NEW_CLIENT && (
            <div className="grid gap-3 rounded-md border border-dashed border-border bg-muted/40 p-3 sm:grid-cols-[1fr_140px]">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Yeni müvekkil adı *</span>
                <input value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Tür</span>
                <select value={newClientType} onChange={(e) => setNewClientType(e.target.value as 'individual' | 'corporate')} className={inputCls}>
                  <option value="individual">Gerçek Kişi</option>
                  <option value="corporate">Tüzel Kişi</option>
                </select>
              </label>
            </div>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Karşı Taraf</span>
            <input value={form.opposingParty} onChange={(e) => set('opposingParty', e.target.value)} className={inputCls} />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Dosya Sorumlusu</span>
              <input value={form.responsible} onChange={(e) => set('responsible', e.target.value)} placeholder="Av. Behçet Alp" className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Açılış Tarihi</span>
              <input type="date" value={form.openedAt} onChange={(e) => set('openedAt', e.target.value)} className={inputCls} />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Sonraki Duruşma</span>
              <input type="date" value={form.nextHearing} onChange={(e) => set('nextHearing', e.target.value)} className={inputCls} />
            </label>
            {editing && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Durum</span>
                <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                  {(Object.keys(caseStatusLabels) as CaseStatus[]).map((s) => (
                    <option key={s} value={s}>{caseStatusLabels[s]}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {editing && form.status === 'closed' && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Sonuç</span>
              <select value={form.outcome} onChange={(e) => set('outcome', e.target.value)} className={inputCls}>
                <option value="">Belirtilmedi</option>
                {(Object.keys(caseOutcomeLabels) as CaseOutcome[]).map((o) => (
                  <option key={o} value={o}>{caseOutcomeLabels[o]}</option>
                ))}
              </select>
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Sonuç etiketi bir hukuki tahmin veya istatistik değildir.
              </span>
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Not</span>
            <textarea value={form.note} onChange={(e) => set('note', e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
          </label>

          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Vazgeç
            </button>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {submitting && <LoaderCircle size={14} className="animate-spin" />}
              {editing ? 'Kaydet' : 'Dosyayı oluştur'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function blankForm() {
  return {
    title: '',
    caseType: 'is' as string,
    court: '',
    caseNumber: '',
    opposingParty: '',
    responsible: '',
    openedAt: '',
    nextHearing: '',
    note: '',
    status: 'active' as string,
    outcome: '' as string,
  };
}
