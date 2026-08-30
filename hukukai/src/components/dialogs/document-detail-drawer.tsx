import { useMemo } from 'react';
import { Link } from 'wouter';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { StatusBadge } from '@/components/status-badge';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { useWorkspaceActions } from '@/components/workspace/workspace-actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  demoRepo,
  documentTypeLabels,
  timelineEventTypeLabels,
  useWorkspace,
} from '@/lib/demo-repository';

export interface DocumentDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string | null;
}

const fmtDate = (v?: string | null) =>
  v ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(v)) : '—';

export function DocumentDetailDrawer({ open, onOpenChange, documentId }: DocumentDetailDrawerProps) {
  const ws = useWorkspace();
  const actions = useWorkspaceActions();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const doc = useMemo(() => ws.documents.find((d) => d.id === documentId), [ws.documents, documentId]);
  const relatedCase = useMemo(() => ws.cases.find((c) => c.id === doc?.caseId), [ws.cases, doc]);
  const timelineRefs = useMemo(
    () => ws.timeline.filter((e) => e.relatedDocumentId === doc?.id),
    [ws.timeline, doc],
  );
  const evidenceRefs = useMemo(() => {
    if (!doc) return [];
    return ws.evidence
      .filter((c) => c.caseId === doc.caseId)
      .flatMap((c) =>
        [...c.supporting.map((r) => ({ ...r, kind: 'Destekleyen', claim: c.title })),
         ...c.opposing.map((r) => ({ ...r, kind: 'Karşı', claim: c.title })),
         ...c.missing.map((r) => ({ ...r, kind: 'Eksik', claim: c.title }))]
          .filter((r) => r.documentId === doc.id),
      );
  }, [ws.evidence, doc]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
          {doc ? (
            <>
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-muted-foreground" />
                  <SheetTitle className="text-sm">{doc.name}</SheetTitle>
                </div>
                <SheetDescription className="text-xs">
                  {documentTypeLabels[doc.docType]}
                  {doc.seeded ? ' · Kurgusal demo belgesi' : ' · Üst veri kaydı (dosya içeriği saklanmaz)'}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-5 py-4 text-xs">
                <section>
                  <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Üst Veri</h4>
                  <dl className="space-y-1.5">
                    <Row label="Dosya adı" value={doc.fileName ?? '—'} mono />
                    <Row label="Belge tarihi" value={fmtDate(doc.documentDate)} />
                    <Row label="Kaynak" value={doc.source ?? '—'} />
                    <Row label="Doğrulama" value={doc.verificationStatus} />
                    {doc.fileMime && <Row label="MIME" value={doc.fileMime} mono />}
                  </dl>
                  {doc.description && <p className="mt-2 rounded bg-muted/50 p-2 text-[11px] text-muted-foreground">{doc.description}</p>}
                </section>

                <section>
                  <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">İlgili Dava</h4>
                  {relatedCase ? (
                    <Link href={`/davalar/${relatedCase.id}?tab=documents`} className="text-primary hover:underline">
                      {relatedCase.caseNumber ? `${relatedCase.caseNumber} · ` : ''}{relatedCase.title}
                    </Link>
                  ) : (
                    <p className="text-muted-foreground">Dosyaya bağlı değil.</p>
                  )}
                </section>

                <section>
                  <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Kronoloji İlişkisi</h4>
                  {timelineRefs.length ? (
                    <ul className="space-y-1">
                      {timelineRefs.map((e) => (
                        <li key={e.id} className="text-muted-foreground">
                          {e.date} · {e.title} <span className="text-muted-foreground/60">({timelineEventTypeLabels[e.eventType]})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Bu belgeye bağlı kronoloji olayı yok.</p>
                  )}
                </section>

                <section>
                  <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Delil Matrisi İlişkisi</h4>
                  {evidenceRefs.length ? (
                    <ul className="space-y-1">
                      {evidenceRefs.map((r) => (
                        <li key={r.id} className="text-muted-foreground">
                          <StatusBadge tone={r.kind === 'Destekleyen' ? 'success' : r.kind === 'Karşı' ? 'danger' : 'warning'}>{r.kind}</StatusBadge>{' '}
                          {r.claim}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Delil matrisinde kullanılmıyor.</p>
                  )}
                </section>

                {doc.seeded && doc.demoExcerpt ? (
                  <section>
                    <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Demo Belge İçeriği</h4>
                    <p className="rounded bg-muted/50 p-2 text-[11px] text-muted-foreground">{doc.demoExcerpt}</p>
                  </section>
                ) : (
                  <p className="rounded border border-dashed border-border p-2 text-[11px] text-muted-foreground/70">
                    Bu belge için gerçek dosya içeriği yoktur; yalnızca üst veri kaydı tutulur.
                  </p>
                )}

                {!doc.seeded && (
                  <div className="flex gap-2 border-t border-border pt-3">
                    <button
                      onClick={() => { onOpenChange(false); actions.editDocument(doc.id); }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      <Pencil size={13} /> Düzenle
                    </button>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={13} /> Sil
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-10 text-center text-sm text-muted-foreground">Belge bulunamadı.</div>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Belge üst verisi silinsin mi?"
        description={doc ? `“${doc.name}” kaydı kalıcı olarak silinecek.` : undefined}
        confirmLabel="Sil"
        onConfirm={() => {
          if (doc) { demoRepo.deleteDocument(doc.id); toast({ title: 'Belge silindi.' }); }
          setConfirmDelete(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={`text-right ${mono ? 'mono text-[11px]' : ''}`}>{value}</dd>
    </div>
  );
}
