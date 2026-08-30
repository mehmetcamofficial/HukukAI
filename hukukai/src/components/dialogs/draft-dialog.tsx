import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { demoRepo, draftTypeLabels, useWorkspace, type DraftType } from '@/lib/demo-repository';

export interface DraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetCaseId?: string | null;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function DraftDialog({ open, onOpenChange, presetCaseId }: DraftDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [form, setForm] = useState(() => blank(presetCaseId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setForm(blank(presetCaseId));
    }
  }, [open, presetCaseId]);

  const set = <K extends keyof ReturnType<typeof blank>>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Taslak başlığı zorunludur.');
    const created = demoRepo.createDraft({
      title: form.title,
      draftType: form.draftType as DraftType,
      caseId: form.caseId || null,
      body: form.body,
      status: 'taslak',
    });
    toast({ title: 'Taslak oluşturuldu.' });
    onOpenChange(false);
    navigate(`/dilekceler/${created.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-sm">Yeni taslak</DialogTitle>
          <DialogDescription className="text-xs">
            Taslaklar avukat incelemesi gerektirir; otomatik onay yapılmaz.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Başlık *</span>
            <input autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} data-testid="input-draft-title" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Tür</span>
              <select value={form.draftType} onChange={(e) => set('draftType', e.target.value)} className={inputCls} data-testid="select-draft-type">
                {(Object.keys(draftTypeLabels) as DraftType[]).map((t) => (
                  <option key={t} value={t}>{draftTypeLabels[t]}</option>
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
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Başlangıç metni (isteğe bağlı)</span>
            <textarea value={form.body} onChange={(e) => set('body', e.target.value)} rows={3} className={`${inputCls} h-auto resize-none py-2`} />
          </label>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Vazgeç</button>
            <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">Oluştur ve düzenle</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function blank(presetCaseId?: string | null) {
  return {
    title: '',
    draftType: 'dava-dilekcesi' as string,
    caseId: presetCaseId ?? '',
    body: '',
  };
}
