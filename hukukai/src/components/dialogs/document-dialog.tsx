import { useEffect, useMemo, useRef, useState } from 'react';
import { Trash2, UploadCloud } from 'lucide-react';
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
  documentTypeLabels,
  useWorkspace,
  type DocumentType,
} from '@/lib/demo-repository';

export interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId?: string | null;
  presetCaseId?: string | null;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function DocumentDialog({ open, onOpenChange, documentId, presetCaseId }: DocumentDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const editing = useMemo(() => ws.documents.find((d) => d.id === documentId), [ws.documents, documentId]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() => blank(presetCaseId));
  const [pickedFile, setPickedFile] = useState<{ name: string; type: string } | null>(null);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    setPickedFile(null);
    if (editing) {
      setForm({
        name: editing.name,
        docType: editing.docType,
        caseId: editing.caseId ?? '',
        fileName: editing.fileName ?? '',
        documentDate: (editing.documentDate ?? '').slice(0, 10),
        source: editing.source ?? '',
        description: editing.description ?? '',
      });
    } else {
      setForm(blank(presetCaseId));
    }
  }, [open, editing, presetCaseId]);

  const set = <K extends keyof ReturnType<typeof blank>>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPickedFile({ name: f.name, type: f.type || 'bilinmiyor' });
    setForm((s) => ({ ...s, fileName: f.name, name: s.name || f.name.replace(/\.[^.]+$/, '') }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Belge adı zorunludur.');
    if (!form.docType) return setError('Belge türü zorunludur.');
    if (!editing && !form.caseId) return setError('Bir dosya seçin.');
    if (!form.fileName.trim()) return setError('Dosya adı zorunludur (yerel dosya seçin veya elle yazın).');

    const payload = {
      name: form.name,
      docType: form.docType as DocumentType,
      caseId: form.caseId || null,
      fileName: form.fileName,
      fileMime: pickedFile?.type,
      documentDate: form.documentDate || null,
      source: form.source,
      description: form.description,
    };

    if (editing) {
      demoRepo.updateDocument(editing.id, payload);
      toast({ title: 'Belge güncellendi.' });
    } else {
      demoRepo.createDocument(payload);
      toast({ title: 'Belge eklendi.', description: 'Yalnızca üst veri kaydedildi.' });
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-sm">{editing ? 'Belge üst verisini düzenle' : 'Belge ekle'}</DialogTitle>
            <DialogDescription className="text-xs">
              Yalnızca üst veri saklanır. Dosya içeriği (byte) yüklenmez / saklanmaz.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3 px-5 py-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Belge Adı *</span>
              <input autoFocus value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} data-testid="input-document-name" />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Belge Türü *</span>
                <select value={form.docType} onChange={(e) => set('docType', e.target.value)} className={inputCls} data-testid="select-document-type">
                  {(Object.keys(documentTypeLabels) as DocumentType[]).map((t) => (
                    <option key={t} value={t}>{documentTypeLabels[t]}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Dosya *</span>
                <select value={form.caseId} onChange={(e) => set('caseId', e.target.value)} className={inputCls} disabled={Boolean(editing)}>
                  <option value="">Seçin…</option>
                  {ws.cases.map((c) => (
                    <option key={c.id} value={c.id}>{c.caseNumber ? `${c.caseNumber} · ` : ''}{c.title}</option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <span className="mb-1 block text-xs font-medium">Dosya adı *</span>
              <div className="flex gap-2">
                <input value={form.fileName} onChange={(e) => set('fileName', e.target.value)} placeholder="ornek_belge.pdf" className={inputCls} data-testid="input-document-filename" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted"
                >
                  <UploadCloud size={13} /> Seç
                </button>
                <input ref={fileRef} type="file" className="hidden" onChange={onFile} />
              </div>
              {pickedFile && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Seçilen: {pickedFile.name} ({pickedFile.type}) — yalnızca ad ve tür okunur, dosya yüklenmez.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Belge Tarihi</span>
                <input type="date" value={form.documentDate} onChange={(e) => set('documentDate', e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Kaynak</span>
                <input value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="Mahkeme / Müvekkil / Karşı taraf" className={inputCls} />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-medium">Açıklama</span>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
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
                <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90" data-testid="button-submit-document">
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
        title="Belge üst verisi silinsin mi?"
        description={editing ? `“${editing.name}” kaydı kalıcı olarak silinecek.` : undefined}
        confirmLabel="Sil"
        onConfirm={() => {
          if (editing) {
            demoRepo.deleteDocument(editing.id);
            toast({ title: 'Belge silindi.' });
          }
          setConfirmDelete(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

function blank(presetCaseId?: string | null) {
  return {
    name: '',
    docType: 'dilekce' as string,
    caseId: presetCaseId ?? '',
    fileName: '',
    documentDate: '',
    source: '',
    description: '',
  };
}
