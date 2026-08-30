import { useMemo, useState } from 'react';
import { Link, useSearch } from 'wouter';
import {
  ArrowDownUp,
  BookmarkPlus,
  FileText,
  FolderOpen,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { SearchInput } from '@/components/search-input';
import { useWorkspaceActions } from '@/components/workspace/workspace-actions';
import type { ResearchSaveSource } from '@/components/dialogs/research-save-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { verifiedLegislation, verifiedPrecedents } from '@/lib/legal-sources';
import {
  caseOutcomeLabels,
  caseStatusLabels,
  caseTypeLabels,
  documentTypeLabels,
  useWorkspace,
  type DocumentType,
} from '@/lib/demo-repository';

/* -------------------------------------------------------------------------- */
/*                              SHARED PIECES                                 */
/* -------------------------------------------------------------------------- */

function EmptyBlock({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center">
      <FolderOpen size={20} className="mb-3 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

const fmtDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '—';

/* -------------------------------------------------------------------------- */
/*                       VERIFIED SOURCES + SAVE TO CASE                      */
/* -------------------------------------------------------------------------- */

function SaveToCaseButton({ source }: { source: ResearchSaveSource }) {
  const { saveResearch } = useWorkspaceActions();
  return (
    <button
      type="button"
      onClick={() => saveResearch(source)}
      data-testid="button-save-to-case"
      className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted"
    >
      <BookmarkPlus size={11} /> Dosyaya Kaydet
    </button>
  );
}

function PrecedentCard({ p }: { p: (typeof verifiedPrecedents)[number] }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={p.position === 'LEHE' ? 'success' : p.position === 'ALEYHE' ? 'danger' : 'warning'}>{p.position}</StatusBadge>
            <span className="text-sm font-medium">{p.legalTopic}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.summary}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span>{p.court} · {p.chamber}</span>
            <span className="mono">{p.caseNumber} / {p.decisionNumber}</span>
            <span>{p.decisionDate}</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <StatusBadge tone="success">{p.verificationStatus}</StatusBadge>
          <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted">
            Resmî Kaynağı Aç
          </a>
          <SaveToCaseButton
            source={{
              sourceKind: 'precedent',
              sourceId: p.id,
              title: `${p.chamber} — ${p.legalTopic}`,
              citation: `${p.caseNumber} / ${p.decisionNumber} · ${p.decisionDate}`,
              verificationStatus: p.verificationStatus,
              sourceUrl: p.sourceUrl,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function LegislationCard({ leg }: { leg: (typeof verifiedLegislation)[number] }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{leg.lawNumber} Sayılı {leg.lawName}</span>
            <span className="mono text-[11px] text-muted-foreground">Madde {leg.articleNumber}</span>
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">{leg.articleTitle}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{leg.articleText}</p>
          <div className="mt-2 text-[11px] text-muted-foreground">{leg.sourceName}</div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <StatusBadge tone="success">{leg.verificationStatus}</StatusBadge>
          <a href={leg.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted">
            Resmî Kaynağı Aç
          </a>
          <SaveToCaseButton
            source={{
              sourceKind: 'legislation',
              sourceId: leg.id,
              title: `${leg.lawNumber} sayılı ${leg.lawName} — m.${leg.articleNumber}`,
              citation: `${leg.lawNumber} s.K. m.${leg.articleNumber} · ${leg.articleTitle}`,
              verificationStatus: leg.verificationStatus,
              sourceUrl: leg.sourceUrl,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function PrecedentPage() {
  const searchString = useSearch();
  const [q, setQ] = useState(new URLSearchParams(searchString).get('q') ?? '');
  const norm = q.toLocaleLowerCase('tr-TR');
  const rows = verifiedPrecedents.filter((p) =>
    !norm || `${p.chamber} ${p.caseNumber} ${p.decisionNumber} ${p.legalTopic} ${p.summary}`.toLocaleLowerCase('tr-TR').includes(norm),
  );
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Emsal Kararlar" description="Yargıtay ve mahkeme kararlarından doğrulanmış içtihatlar." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Kaynaklar doğrulanmıştır. Kaydetme, doğrulama durumunu değiştirmez.
      </div>
      <SearchInput value={q} onChange={setQ} placeholder="Konu, esas/karar no ara" className="mb-4 max-w-md" testId="input-search-precedents" />
      <div className="space-y-3">
        {rows.map((p) => <PrecedentCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

export function LegislationPage() {
  const searchString = useSearch();
  const [q, setQ] = useState(new URLSearchParams(searchString).get('q') ?? '');
  const norm = q.toLocaleLowerCase('tr-TR');
  const rows = verifiedLegislation.filter((l) =>
    !norm || `${l.lawNumber} ${l.lawName} ${l.articleNumber} ${l.articleTitle} ${l.articleText}`.toLocaleLowerCase('tr-TR').includes(norm),
  );
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Mevzuat" description="İlgili kanun maddeleri ve Resmî Gazete kaynakları." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Kaynaklar Resmî Gazete üzerinden doğrulanmıştır. Kaydetme, doğrulama durumunu değiştirmez.
      </div>
      <SearchInput value={q} onChange={setQ} placeholder="Kanun no veya madde ara" className="mb-4 max-w-md" testId="input-search-legislation" />
      <div className="space-y-3">
        {rows.map((leg) => <LegislationCard key={leg.id} leg={leg} />)}
      </div>
    </div>
  );
}

export function ResearchRoutePage() {
  const searchString = useSearch();
  const [q, setQ] = useState(new URLSearchParams(searchString).get('q') ?? '');
  const [kind, setKind] = useState<'all' | 'precedent' | 'legislation'>('all');
  const norm = q.toLocaleLowerCase('tr-TR');
  const precedents = kind === 'legislation' ? [] : verifiedPrecedents.filter((p) =>
    !norm || `${p.chamber} ${p.caseNumber} ${p.legalTopic} ${p.summary}`.toLocaleLowerCase('tr-TR').includes(norm),
  );
  const legislation = kind === 'precedent' ? [] : verifiedLegislation.filter((l) =>
    !norm || `${l.lawNumber} ${l.lawName} ${l.articleNumber} ${l.articleTitle} ${l.articleText}`.toLocaleLowerCase('tr-TR').includes(norm),
  );
  const total = precedents.length + legislation.length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Hukuki Araştırma" description="Doğrulanmış emsal ve mevzuat kaynaklarında arama yapın; dosyaya kaydedin." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Demo veri kümesi · canlı sağlayıcı bağlı değildir. Anlamsal (semantik) arama taklit edilmez.
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={q} onChange={setQ} placeholder="Konu, kanun no, esas/karar no ara" testId="input-research-query" className="flex-1" />
        <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary">
          <option value="all">Tüm kaynaklar</option>
          <option value="precedent">Emsal Kararlar</option>
          <option value="legislation">Mevzuat</option>
        </select>
        <span className="mono self-center text-[11px] text-muted-foreground">{total} kayıt</span>
      </div>
      {total === 0 ? (
        <EmptyBlock title="Sonuç yok" detail="Aramayı değiştirin. Kaynaklar doğrulanmış demo veri kümesindendir." />
      ) : (
        <div className="space-y-3">
          {precedents.map((p) => <PrecedentCard key={p.id} p={p} />)}
          {legislation.map((leg) => <LegislationCard key={leg.id} leg={leg} />)}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DOCUMENTS (repo)                              */
/* -------------------------------------------------------------------------- */

export function DocumentsPage() {
  const ws = useWorkspace();
  const actions = useWorkspaceActions();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'' | DocumentType>('');
  const [caseId, setCaseId] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
    const norm = search.toLocaleLowerCase('tr-TR');
    return [...ws.documents]
      .filter((d) => {
        if (type && d.docType !== type) return false;
        if (caseId && d.caseId !== caseId) return false;
        if (!norm) return true;
        return `${d.name} ${d.fileName ?? ''} ${d.source ?? ''} ${d.description ?? ''}`.toLocaleLowerCase('tr-TR').includes(norm);
      })
      .sort((a, b) => {
        const av = a.documentDate ?? a.createdAt;
        const bv = b.documentDate ?? b.createdAt;
        return sortDesc ? bv.localeCompare(av) : av.localeCompare(bv);
      });
  }, [ws.documents, search, type, caseId, sortDesc]);

  const caseLabel = (id?: string | null) => ws.cases.find((c) => c.id === id)?.title ?? '—';

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Belgeler"
        description="Dosya belgeleri ve kaynak doğrulama durumu. Yalnızca üst veri saklanır."
        action={
          <button
            onClick={() => actions.newDocument()}
            data-testid="button-new-document"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} /> Belge Ekle
          </button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Belge adı ara" testId="input-search-documents" className="flex-1" />
        <select value={type} onChange={(e) => setType(e.target.value as DocumentType | '')} className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary">
          <option value="">Tüm türler</option>
          {Object.entries(documentTypeLabels).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select value={caseId} onChange={(e) => setCaseId(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary">
          <option value="">Tüm dosyalar</option>
          {ws.cases.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button
          onClick={() => setSortDesc((v) => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          <ArrowDownUp size={13} /> Tarih {sortDesc ? '↓' : '↑'}
        </button>
      </div>

      {rows.length === 0 ? (
        <EmptyBlock title="Belge bulunamadı" detail="Filtreleri değiştirin ya da yeni bir belge ekleyin." />
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Belge</TableHead>
                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Dosya</TableHead>
                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Tür</TableHead>
                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider hidden sm:table-cell">Tarih</TableHead>
                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Doğrulama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow
                  key={d.id}
                  className="cursor-pointer"
                  data-testid={`doc-row-${d.id}`}
                  onClick={() => actions.viewDocument(d.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{d.name}</p>
                        {d.fileName && <p className="mono text-[11px] text-muted-foreground">{d.fileName}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                    {d.caseId ? <Link href={`/davalar/${d.caseId}?tab=documents`} className="hover:underline">{caseLabel(d.caseId)}</Link> : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{documentTypeLabels[d.docType]}</TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{fmtDate(d.documentDate)}</TableCell>
                  <TableCell><StatusBadge tone="neutral">{d.verificationStatus}</StatusBadge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ARCHIVE (repo)                              */
/* -------------------------------------------------------------------------- */

export function ArchivePage() {
  const ws = useWorkspace();
  const [q, setQ] = useState('');
  const norm = q.toLocaleLowerCase('tr-TR');
  const rows = ws.cases
    .filter((c) => c.status === 'closed')
    .filter((c) => !norm || `${c.title} ${c.caseNumber ?? ''} ${c.clientName}`.toLocaleLowerCase('tr-TR').includes(norm));

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader title="Arşiv" description="Kapanmış dosyalar. Ayrı bir veri kopyası tutulmaz." />
      <SearchInput value={q} onChange={setQ} placeholder="Kapanmış dosya ara" className="mb-4 max-w-md" testId="input-search-archive" />
      {rows.length === 0 ? (
        <EmptyBlock title="Arşivde dosya yok" detail="Bir dosyayı kapattığınızda burada görünür." />
      ) : (
        <div className="space-y-2">
          {rows.map((c) => (
            <Link key={c.id} href={`/davalar/${c.id}`} className="block rounded-md border border-border bg-card p-3 hover:bg-muted/40">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="neutral">{caseStatusLabels[c.status]}</StatusBadge>
                <span className="mono text-[11px] text-muted-foreground">{c.caseNumber ?? '—'}</span>
                <span className="text-sm font-medium">{c.title}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {caseTypeLabels[c.caseType]} · {c.clientName}
                {c.outcome ? ` · Sonuç: ${caseOutcomeLabels[c.outcome]}` : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
