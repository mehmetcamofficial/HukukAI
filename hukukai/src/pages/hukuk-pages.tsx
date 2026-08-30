import { useMemo, useState } from 'react';
import {
  getGetResearchQueryKey,
  useCreateResearch,
  useGetResearch,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useSearch } from 'wouter';
import {
  BookOpen,
  FileText,
  FolderOpen,
  LoaderCircle,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { SearchInput } from '@/components/search-input';
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
  caseStatusLabels,
  caseTypeLabels,
  documentTypeLabels,
  draftStatusLabels,
  draftTypeLabels,
  useWorkspace,
  type DocumentType,
} from '@/lib/demo-repository';

/* -------------------------------------------------------------------------- */
/*                              SHARED PIECES                                 */
/* -------------------------------------------------------------------------- */

function LoadingBlock() {
  return (
    <div className="space-y-4" data-testid="status-loading">
      <div className="h-8 w-48 shimmer rounded-md" />
      <div className="h-4 w-64 shimmer rounded-md" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-20 shimmer rounded-md" />
        <div className="h-20 shimmer rounded-md" />
        <div className="h-20 shimmer rounded-md" />
      </div>
    </div>
  );
}

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
/*                       RESEARCH / ASSISTANT (unchanged)                     */
/* -------------------------------------------------------------------------- */

function ResearchPage({ mode }: { mode: 'research' | 'assistant' }) {
  const researchQuery = useGetResearch();
  const createResearch = useCreateResearch();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const items = Array.isArray(researchQuery.data) ? researchQuery.data : [];
  const config = {
    research: {
      title: 'Hukuki Araştırma',
      description: 'Kaynağa dayalı yanıt üretin.',
      placeholder: 'Sorunuzu yazın; yanıtı, dayanakları ve belirsizlikleri birlikte görün.',
    },
    assistant: {
      title: 'Hukuki Asistan',
      description: 'Dosya bağlamıyla çalışan asistan kabuğu.',
      placeholder: 'Örn. Bu dosyadaki eksik delilleri özetle.',
    },
  }[mode];

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (query.trim().length < 3) return;
    createResearch.mutate(
      { data: { query: query.trim() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetResearchQueryKey() });
          setQuery('');
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader title={config.title} description={config.description} />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Canlı sağlayıcı bağlı değilse sonuçlar “Demo veri kümesi” olarak etiketlenir. Anlamsal (semantik) arama taklit edilmez.
      </div>
      <section className="rounded-md border border-border bg-card p-5">
        <form onSubmit={submit}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="input-research-query"
            placeholder={config.placeholder}
            rows={3}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={createResearch.isPending || query.trim().length < 3}
              data-testid="button-submit-research"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
            >
              {createResearch.isPending ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}
              {mode === 'assistant' ? 'Sor' : 'Araştır'}
            </button>
          </div>
        </form>
      </section>

      <div className="mb-3 mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Sonuçlar</h2>
        <span className="mono text-[11px] text-muted-foreground">{items.length} kayıt</span>
      </div>
      {researchQuery.isLoading ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyBlock title="Henüz sonuç yok" detail="Bir soru girin; yanıt kaynak etiketleriyle birlikte listelenecek." />
      ) : (
        <div className="space-y-3">
          {items.map((item: { id: string; query: string; result: string; demo?: boolean; sources?: { title: string; status: string }[] }) => (
            <div key={item.id} className="rounded-md border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">{item.query}</p>
                {item.demo && <StatusBadge tone="neutral">DEMO VERİ</StatusBadge>}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.result}</p>
              {item.sources && item.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.sources.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      <BookOpen size={10} />
                      {s.title}
                      <StatusBadge tone={s.status === 'DOĞRULANDI' ? 'success' : 'warning'}>{s.status}</StatusBadge>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResearchRoutePage() {
  return <ResearchPage mode="research" />;
}

export function AssistantPage() {
  return <ResearchPage mode="assistant" />;
}

/* -------------------------------------------------------------------------- */
/*                       PRECEDENTS / LEGISLATION (verified)                  */
/* -------------------------------------------------------------------------- */

export function PrecedentPage() {
  const searchString = useSearch();
  const initial = new URLSearchParams(searchString).get('q') ?? '';
  const [q, setQ] = useState(initial);
  const norm = q.toLocaleLowerCase('tr-TR');
  const rows = verifiedPrecedents.filter((p) =>
    !norm || `${p.chamber} ${p.caseNumber} ${p.decisionNumber} ${p.legalTopic} ${p.summary}`.toLocaleLowerCase('tr-TR').includes(norm),
  );
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Emsal Kararlar" description="Yargıtay ve mahkeme kararlarından doğrulanmış içtihatlar." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Kaynaklar doğrulanmıştır. Resmî kaynaklara bağlantı sağlanmıştır.
      </div>
      <SearchInput value={q} onChange={setQ} placeholder="Konu, esas/karar no ara" className="mb-4 max-w-md" testId="input-search-precedents" />
      <div className="space-y-3">
        {rows.map((p) => (
          <div key={p.id} className="rounded-md border border-border bg-card p-4">
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
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge tone="success">{p.verificationStatus}</StatusBadge>
                <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted">
                  Resmî Kaynağı Aç
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LegislationPage() {
  const searchString = useSearch();
  const initial = new URLSearchParams(searchString).get('q') ?? '';
  const [q, setQ] = useState(initial);
  const norm = q.toLocaleLowerCase('tr-TR');
  const rows = verifiedLegislation.filter((l) =>
    !norm || `${l.lawNumber} ${l.lawName} ${l.articleNumber} ${l.articleTitle} ${l.articleText}`.toLocaleLowerCase('tr-TR').includes(norm),
  );
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Mevzuat" description="İlgili kanun maddeleri ve Resmî Gazete kaynakları." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Kaynaklar Resmî Gazete üzerinden doğrulanmıştır.
      </div>
      <SearchInput value={q} onChange={setQ} placeholder="Kanun no veya madde ara" className="mb-4 max-w-md" testId="input-search-legislation" />
      <div className="space-y-3">
        {rows.map((leg) => (
          <div key={leg.id} className="rounded-md border border-border bg-card p-4">
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
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge tone="success">{leg.verificationStatus}</StatusBadge>
                <a href={leg.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted">
                  Resmî Kaynağı Aç
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DOCUMENTS (repo)                              */
/* -------------------------------------------------------------------------- */

export function DocumentsPage() {
  const ws = useWorkspace();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'' | DocumentType>('');
  const [caseId, setCaseId] = useState('');

  const rows = useMemo(() => {
    const norm = search.toLocaleLowerCase('tr-TR');
    return [...ws.documents]
      .filter((d) => {
        if (type && d.docType !== type) return false;
        if (caseId && d.caseId !== caseId) return false;
        if (!norm) return true;
        return `${d.name} ${d.fileName ?? ''} ${d.source ?? ''} ${d.description ?? ''}`.toLocaleLowerCase('tr-TR').includes(norm);
      })
      .sort((a, b) => (b.documentDate ?? b.createdAt).localeCompare(a.documentDate ?? a.createdAt));
  }, [ws.documents, search, type, caseId]);

  const caseLabel = (id?: string | null) => ws.cases.find((c) => c.id === id)?.title ?? '—';

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Belgeler" description="Dosya belgeleri ve kaynak doğrulama durumu (üst veri)." />
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
      </div>

      {rows.length === 0 ? (
        <EmptyBlock title="Belge bulunamadı" detail="Filtreleri değiştirin. Bir dosyaya belge eklemek için ilgili dava çalışma alanını açın." />
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
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{d.name}</p>
                        {d.fileName && <p className="mono text-[11px] text-muted-foreground">{d.fileName}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
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
/*                               DRAFTS (repo)                               */
/* -------------------------------------------------------------------------- */

export function DraftsPage() {
  const ws = useWorkspace();
  const searchString = useSearch();
  const initial = new URLSearchParams(searchString).get('q') ?? '';
  const [q, setQ] = useState(initial);
  const norm = q.toLocaleLowerCase('tr-TR');
  const rows = ws.drafts.filter((d) => !norm || `${d.title} ${d.body}`.toLocaleLowerCase('tr-TR').includes(norm));
  const caseLabel = (id?: string | null) => ws.cases.find((c) => c.id === id)?.title;

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader title="Dilekçeler" description="Dosya taslakları ve durumları." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Taslaklar avukat incelemesi gerektirir. Otomatik onay yapılmaz. Nitelikli elektronik imza / resmî tevdi anlamına gelmez.
      </div>
      <SearchInput value={q} onChange={setQ} placeholder="Taslak ara" className="mb-4 max-w-md" testId="input-search-drafts" />
      {rows.length === 0 ? (
        <EmptyBlock title="Taslak yok" detail="Bir dosyaya taslak eklemek için ilgili dava çalışma alanını açın." />
      ) : (
        <div className="space-y-2">
          {rows.map((d) => (
            <div key={d.id} className="rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{d.title}</span>
                <StatusBadge tone={d.status === 'onaylandi' ? 'success' : d.status === 'incelemede' ? 'warning' : 'neutral'}>
                  {draftStatusLabels[d.status]}
                </StatusBadge>
                <span className="text-[11px] text-muted-foreground">
                  {draftTypeLabels[d.draftType]} · v{d.version}{caseLabel(d.caseId) ? ` · ${caseLabel(d.caseId)}` : ''}
                </span>
              </div>
              <pre className="mt-3 max-h-40 overflow-hidden whitespace-pre-wrap rounded bg-muted/50 p-3 font-sans text-[11px] leading-4 text-muted-foreground">
                {d.body}
              </pre>
              {d.approvedAt && (
                <p className="mt-2 text-[10px] text-muted-foreground/70">
                  Avukat incelemesi tamamlandı olarak işaretlendi · {d.approvedBy}
                </p>
              )}
            </div>
          ))}
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
                {c.outcome ? ` · Sonuç: ${c.outcome}` : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
