import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearch } from 'wouter';
import {
  ArrowLeft,
  Copy,
  FileText,
  History,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { SearchInput } from '@/components/search-input';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { useWorkspaceActions } from '@/components/workspace/workspace-actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  demoRepo,
  draftStatusLabels,
  draftTypeLabels,
  useWorkspace,
  type DraftStatus,
} from '@/lib/demo-repository';

const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

/* -------------------------------------------------------------------------- */
/*                                  LIST                                     */
/* -------------------------------------------------------------------------- */

export function DraftsPage() {
  const ws = useWorkspace();
  const actions = useWorkspaceActions();
  const searchString = useSearch();
  const [q, setQ] = useState(new URLSearchParams(searchString).get('q') ?? '');
  const norm = q.toLocaleLowerCase('tr-TR');
  const rows = ws.drafts.filter((d) => !norm || `${d.title} ${d.body}`.toLocaleLowerCase('tr-TR').includes(norm));
  const caseLabel = (id?: string | null) => ws.cases.find((c) => c.id === id)?.title;

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader
        title="Dilekçeler"
        description="Dosya taslakları, sürümleri ve durumları."
        action={
          <button
            onClick={() => actions.newDraft()}
            data-testid="button-new-draft"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} /> Yeni Taslak
          </button>
        }
      />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Taslaklar avukat incelemesi gerektirir; otomatik onay yapılmaz. Nitelikli elektronik imza / resmî tevdi anlamına gelmez.
      </div>
      <SearchInput value={q} onChange={setQ} placeholder="Taslak ara" className="mb-4 max-w-md" testId="input-search-drafts" />
      {rows.length === 0 ? (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center">
          <FileText size={20} className="mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Taslak yok</p>
          <p className="mt-1 text-xs text-muted-foreground">Yeni bir taslak oluşturarak başlayın.</p>
          <button onClick={() => actions.newDraft()} className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            <Plus size={14} /> Yeni Taslak
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((d) => (
            <Link key={d.id} href={`/dilekceler/${d.id}`} data-testid={`draft-row-${d.id}`} className="block rounded-md border border-border bg-card p-4 hover:bg-muted/40">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{d.title}</span>
                <StatusBadge tone={d.status === 'onaylandi' ? 'success' : d.status === 'incelemede' ? 'warning' : 'neutral'}>{draftStatusLabels[d.status]}</StatusBadge>
                <span className="text-[11px] text-muted-foreground">
                  {draftTypeLabels[d.draftType]} · v{d.version}{caseLabel(d.caseId) ? ` · ${caseLabel(d.caseId)}` : ''}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{d.body || 'Boş taslak.'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 EDITOR                                    */
/* -------------------------------------------------------------------------- */

export function DraftEditorPage() {
  const { draftId = '' } = useParams<{ draftId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const ws = useWorkspace();
  const draft = useMemo(() => ws.drafts.find((d) => d.id === draftId), [ws.drafts, draftId]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [viewVersion, setViewVersion] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);

  useEffect(() => {
    if (draft) {
      setTitle(draft.title);
      setBody(draft.body);
    }
  }, [draft?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!draft) {
    return (
      <div className="mx-auto max-w-[900px]">
        <Link href="/dilekceler" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Tüm taslaklar
        </Link>
        <div className="rounded-md border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm font-medium">Taslak bulunamadı</p>
          <p className="mt-1 text-xs text-muted-foreground">Silinmiş olabilir veya demo verileri sıfırlanmış olabilir.</p>
        </div>
      </div>
    );
  }

  const dirty = title !== draft.title || body !== draft.body;
  const bodyChanged = body !== draft.body;
  const relatedCase = ws.cases.find((c) => c.id === draft.caseId);

  const save = () => {
    const updated = demoRepo.saveDraft(draft.id, { title, body });
    if (updated) {
      toast({
        title: bodyChanged ? `Taslak v${updated.version} olarak kaydedildi.` : 'Taslak güncellendi.',
      });
    }
  };

  const changeStatus = (next: DraftStatus) => {
    if (next === draft.status) return;
    if (next === 'onaylandi') {
      setApproveOpen(true);
      return;
    }
    demoRepo.changeDraftStatus(draft.id, next);
    toast({ title: 'Taslak durumu değişti.', description: draftStatusLabels[next] });
  };

  const historyEntry = viewVersion != null ? draft.versions.find((v) => v.version === viewVersion) : null;

  return (
    <div className="mx-auto max-w-[1080px]">
      <Link href="/dilekceler" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} /> Tüm taslaklar
      </Link>

      <div className="mb-4 flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={draft.status === 'onaylandi' ? 'success' : draft.status === 'incelemede' ? 'warning' : 'neutral'}>
              {draftStatusLabels[draft.status]}
            </StatusBadge>
            <span className="text-[11px] text-muted-foreground">{draftTypeLabels[draft.draftType]} · v{draft.version}</span>
            {relatedCase && (
              <Link href={`/davalar/${relatedCase.id}?tab=drafts`} className="text-[11px] text-primary hover:underline">
                {relatedCase.caseNumber ?? relatedCase.title}
              </Link>
            )}
          </div>
          {draft.approvedAt && (
            <p className="mt-1 text-[10px] text-muted-foreground/70">
              Avukat incelemesi tamamlandı olarak işaretlendi · {draft.approvedBy} · {fmtDateTime(draft.approvedAt)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <select
            value={draft.status}
            onChange={(e) => changeStatus(e.target.value as DraftStatus)}
            data-testid="select-draft-status"
            className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary"
          >
            {(Object.keys(draftStatusLabels) as DraftStatus[]).map((s) => (
              <option key={s} value={s}>{draftStatusLabels[s]}</option>
            ))}
          </select>
          <button onClick={() => setShowHistory((v) => !v)} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
            <History size={13} /> Sürümler ({draft.versions.length})
          </button>
          <button
            onClick={() => {
              const dup = demoRepo.duplicateDraft(draft.id);
              if (dup) { toast({ title: 'Taslak çoğaltıldı.' }); navigate(`/dilekceler/${dup.id}`); }
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Copy size={13} /> Çoğalt
          </button>
          <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <Trash2 size={13} /> Sil
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="mb-4 rounded-md border border-border bg-card p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sürüm Geçmişi</h3>
          <ul className="space-y-1.5">
            {[...draft.versions].reverse().map((v) => (
              <li key={v.version} className="flex items-center justify-between gap-2 rounded border border-border px-2.5 py-1.5 text-xs">
                <span className="font-medium">v{v.version}</span>
                <span className="mono text-[11px] text-muted-foreground">{v.author} · {fmtDateTime(v.timestamp)}</span>
                <button onClick={() => setViewVersion(v.version)} className="rounded border border-border px-2 py-0.5 text-[11px] font-medium hover:bg-muted">Görüntüle</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-md border border-border bg-card p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium">Başlık</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} data-testid="input-draft-editor-title" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-medium">İçerik</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={16}
            data-testid="textarea-draft-body"
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 font-mono text-[12px] leading-5 outline-none focus:border-primary"
          />
        </label>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground/70">
            {bodyChanged ? 'İçerik değişti — kaydetme yeni sürüm oluşturur.' : dirty ? 'Kaydedilmemiş değişiklik var.' : 'Tüm değişiklikler kayıtlı.'}
          </p>
          <button
            onClick={save}
            disabled={!dirty}
            data-testid="button-save-draft"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Save size={14} /> Kaydet{bodyChanged ? ` (v${draft.version + 1})` : ''}
          </button>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground/60">DEMO — KURGUSAL DİLEKÇE · Avukat kontrolü gerekir.</p>

      {/* Read-only version viewer */}
      <Dialog open={viewVersion != null} onOpenChange={(o) => !o && setViewVersion(null)}>
        <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-sm">Sürüm v{viewVersion} (salt okunur)</DialogTitle>
            <DialogDescription className="text-xs">
              {historyEntry ? `${historyEntry.author} · ${fmtDateTime(historyEntry.timestamp)}` : ''}
            </DialogDescription>
          </DialogHeader>
          <pre className="whitespace-pre-wrap px-5 py-4 font-mono text-[12px] leading-5 text-muted-foreground">{historyEntry?.body}</pre>
        </DialogContent>
      </Dialog>

      {/* Explicit approval confirmation */}
      <ConfirmDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Taslağı onayla"
        description="Bu taslağı avukat incelemesi tamamlanmış olarak işaretlemek istiyor musunuz? Bu işlem elektronik imza, UYAP tevdii veya mahkemeye sunum anlamına gelmez."
        destructive={false}
        confirmLabel="Onayla"
        onConfirm={() => {
          demoRepo.changeDraftStatus(draft.id, 'onaylandi');
          toast({ title: 'Taslak “Onaylandı” olarak işaretlendi.' });
          setApproveOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Taslak silinsin mi?"
        description={`“${draft.title}” taslağı ve tüm sürümleri kalıcı olarak silinecek.`}
        confirmLabel="Sil"
        onConfirm={() => {
          demoRepo.deleteDraft(draft.id);
          toast({ title: 'Taslak silindi.' });
          setConfirmDelete(false);
          navigate('/dilekceler');
        }}
      />
    </div>
  );
}
