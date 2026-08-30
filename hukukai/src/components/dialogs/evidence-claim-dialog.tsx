import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
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
  evidenceStatusLabels,
  useWorkspace,
  type EvidenceRef,
  type EvidenceStatus,
} from '@/lib/demo-repository';

export interface EvidenceClaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  claimId?: string | null;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

let refCounter = 0;
const makeRefId = () => `evref-${Date.now().toString(36)}-${(refCounter++).toString(36)}`;

export function EvidenceClaimDialog({ open, onOpenChange, caseId, claimId }: EvidenceClaimDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const editing = useMemo(() => ws.evidence.find((e) => e.id === claimId), [ws.evidence, claimId]);
  const caseDocs = useMemo(() => ws.documents.filter((d) => d.caseId === caseId), [ws.documents, caseId]);

  const [title, setTitle] = useState('');
  const [legalIssue, setLegalIssue] = useState('');
  const [assessment, setAssessment] = useState('');
  const [status, setStatus] = useState<EvidenceStatus>('incelenmedi');
  const [supporting, setSupporting] = useState<EvidenceRef[]>([]);
  const [opposing, setOpposing] = useState<EvidenceRef[]>([]);
  const [missing, setMissing] = useState<EvidenceRef[]>([]);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    setTitle(editing?.title ?? '');
    setLegalIssue(editing?.legalIssue ?? '');
    setAssessment(editing?.lawyerAssessment ?? '');
    setStatus(editing?.status ?? 'incelenmedi');
    setSupporting(editing ? editing.supporting.map((r) => ({ ...r })) : []);
    setOpposing(editing ? editing.opposing.map((r) => ({ ...r })) : []);
    setMissing(editing ? editing.missing.map((r) => ({ ...r })) : []);
  }, [open, editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError('İddia / hukuki konu zorunludur.');
    const payload = {
      title,
      legalIssue,
      lawyerAssessment: assessment,
      status,
      supporting,
      opposing,
      missing,
    };
    if (editing) {
      demoRepo.updateEvidenceClaim(editing.id, payload);
      toast({ title: 'Delil matrisi güncellendi.' });
    } else {
      demoRepo.createEvidenceClaim({ caseId, ...payload });
      toast({ title: 'Delil iddiası eklendi.' });
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-sm">{editing ? 'İddiayı düzenle' : 'İddia ekle'}</DialogTitle>
            <DialogDescription className="text-xs">
              Delilleri dosya belgelerinden seçin ya da elle ekleyin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3 px-5 py-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">İddia *</span>
              <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} data-testid="input-evidence-title" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Hukuki Konu</span>
              <input value={legalIssue} onChange={(e) => setLegalIssue(e.target.value)} placeholder="Örn. 4857 s.K. m.41" className={inputCls} />
            </label>

            <RefEditor label="Destekleyen Deliller" tone="emerald" refs={supporting} setRefs={setSupporting} caseDocs={caseDocs} testId="supporting" />
            <RefEditor label="Karşı Deliller" tone="red" refs={opposing} setRefs={setOpposing} caseDocs={caseDocs} testId="opposing" />
            <RefEditor label="Eksik Deliller" tone="amber" refs={missing} setRefs={setMissing} caseDocs={caseDocs} testId="missing" />

            <label className="block">
              <span className="mb-1 block text-xs font-medium">Avukat Değerlendirmesi</span>
              <textarea value={assessment} onChange={(e) => setAssessment(e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Durum</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as EvidenceStatus)} className={inputCls} data-testid="select-evidence-status">
                {(Object.keys(evidenceStatusLabels) as EvidenceStatus[]).map((s) => (
                  <option key={s} value={s}>{evidenceStatusLabels[s]}</option>
                ))}
              </select>
            </label>

            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

            <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
              {editing ? (
                <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2 size={13} /> Sil
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Vazgeç</button>
                <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90" data-testid="button-submit-evidence">
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
        title="İddia silinsin mi?"
        description={editing ? `“${editing.title}” iddiası ve delil ilişkileri silinecek.` : undefined}
        confirmLabel="Sil"
        onConfirm={() => {
          if (editing) { demoRepo.deleteEvidenceClaim(editing.id); toast({ title: 'İddia silindi.' }); }
          setConfirmDelete(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

function RefEditor({
  label,
  tone,
  refs,
  setRefs,
  caseDocs,
  testId,
}: {
  label: string;
  tone: 'emerald' | 'red' | 'amber';
  refs: EvidenceRef[];
  setRefs: React.Dispatch<React.SetStateAction<EvidenceRef[]>>;
  caseDocs: { id: string; name: string }[];
  testId: string;
}) {
  const [docId, setDocId] = useState('');
  const [free, setFree] = useState('');

  const toneCls = {
    emerald: 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20',
    red: 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20',
    amber: 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
  }[tone];

  const addDoc = () => {
    const doc = caseDocs.find((d) => d.id === docId);
    if (!doc) return;
    if (refs.some((r) => r.documentId === doc.id)) return;
    setRefs((s) => [...s, { id: makeRefId(), label: doc.name, documentId: doc.id }]);
    setDocId('');
  };
  const addFree = () => {
    if (!free.trim()) return;
    setRefs((s) => [...s, { id: makeRefId(), label: free.trim(), documentId: null }]);
    setFree('');
  };

  return (
    <div className={`rounded-md border p-2.5 ${toneCls}`} data-testid={`evidence-refs-${testId}`}>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {refs.length > 0 && (
        <ul className="mb-2 space-y-1">
          {refs.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 rounded bg-background/60 px-2 py-1 text-[11px]">
              <span className="min-w-0 truncate">{r.label}{r.documentId ? ' · belge' : ''}</span>
              <button type="button" aria-label="Kaldır" onClick={() => setRefs((s) => s.filter((x) => x.id !== r.id))} className="shrink-0 text-muted-foreground hover:text-foreground">
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        <select value={docId} onChange={(e) => setDocId(e.target.value)} className="h-8 min-w-0 flex-1 rounded border border-input bg-background px-2 text-[11px] outline-none">
          <option value="">Belge seç…</option>
          {caseDocs.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <button type="button" onClick={addDoc} disabled={!docId} className="inline-flex h-8 items-center gap-1 rounded border border-border px-2 text-[11px] font-medium hover:bg-muted disabled:opacity-40">
          <Plus size={12} /> Ekle
        </button>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <input
          value={free}
          onChange={(e) => setFree(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFree(); } }}
          placeholder="veya elle yaz (Tanık beyanı…)"
          className="h-8 min-w-0 flex-1 rounded border border-input bg-background px-2 text-[11px] outline-none"
          data-testid={`evidence-free-${testId}`}
        />
        <button type="button" onClick={addFree} disabled={!free.trim()} className="inline-flex h-8 items-center gap-1 rounded border border-border px-2 text-[11px] font-medium hover:bg-muted disabled:opacity-40">
          <Plus size={12} /> Ekle
        </button>
      </div>
    </div>
  );
}
