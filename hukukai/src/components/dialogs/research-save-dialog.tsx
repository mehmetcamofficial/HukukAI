import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/hooks/use-toast';
import {
  demoRepo,
  researchRelationLabels,
  useWorkspace,
  type ResearchRelation,
  type ResearchSourceKind,
} from '@/lib/demo-repository';

/** The verified source being saved. Verification status is copied verbatim. */
export interface ResearchSaveSource {
  sourceKind: ResearchSourceKind;
  sourceId: string;
  title: string;
  citation?: string;
  verificationStatus: string;
  sourceUrl?: string;
}

export interface ResearchSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: ResearchSaveSource;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function ResearchSaveDialog({ open, onOpenChange, source }: ResearchSaveDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const openCases = useMemo(() => ws.cases.filter((c) => c.status !== 'closed'), [ws.cases]);

  const [caseId, setCaseId] = useState('');
  const [relation, setRelation] = useState<ResearchRelation>('genel-referans');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setCaseId(openCases[0]?.id ?? ws.cases[0]?.id ?? '');
    setRelation('genel-referans');
    setNote('');
  }, [open, openCases, ws.cases]);

  const already = ws.researchBookmarks.some((b) => b.caseId === caseId && b.sourceId === source.sourceId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return setError('Bir dosya seçin.');
    if (already) return setError('Bu kaynak bu dosyaya zaten kaydedilmiş.');
    demoRepo.saveResearchBookmark({
      caseId,
      sourceKind: source.sourceKind,
      sourceId: source.sourceId,
      title: source.title,
      citation: source.citation,
      relation,
      note: note.trim() || undefined,
      // verbatim — never upgraded on save
      verificationStatus: source.verificationStatus,
      sourceUrl: source.sourceUrl,
    });
    toast({ title: 'Emsal karar dosyaya kaydedildi.' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-sm">Dosyaya Kaydet</DialogTitle>
          <DialogDescription className="text-xs">
            Kaynak doğrulama durumu değiştirilmeden aktarılır.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={source.verificationStatus === 'DOĞRULANDI' ? 'success' : 'warning'}>{source.verificationStatus}</StatusBadge>
              <span className="text-xs font-medium">{source.title}</span>
            </div>
            {source.citation && <p className="mono mt-1 text-[11px] text-muted-foreground">{source.citation}</p>}
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Dosya *</span>
            <select value={caseId} onChange={(e) => setCaseId(e.target.value)} className={inputCls} data-testid="select-research-case">
              <option value="">Seçin…</option>
              {ws.cases.map((c) => (
                <option key={c.id} value={c.id}>{c.caseNumber ? `${c.caseNumber} · ` : ''}{c.title}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">İlişki</span>
            <select value={relation} onChange={(e) => setRelation(e.target.value as ResearchRelation)} className={inputCls} data-testid="select-research-relation">
              {(Object.keys(researchRelationLabels) as ResearchRelation[]).map((r) => (
                <option key={r} value={r}>{researchRelationLabels[r]}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Avukat notu (isteğe bağlı)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
          </label>

          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Vazgeç</button>
            <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90" data-testid="button-submit-research-save">
              Kaydet
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
