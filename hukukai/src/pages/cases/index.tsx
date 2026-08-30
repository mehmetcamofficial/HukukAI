import { useState } from 'react';
import { Link } from 'wouter';
import {
  getGetCasesQueryKey,
  useCreateCase,
  useGetCases,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FileText,
  LoaderCircle,
  Plus,
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

const fallbackCases = [
  {
    id: 'case-2026-145',
    title: 'İşçilik Alacağı',
    caseNumber: '2026/145',
    court: 'Kurgu 14. İş Mahkemesi',
    category: 'İş Hukuku',
    clientName: 'Deniz Aras',
    opposingParty: 'Marmara Lojistik A.Ş.',
    status: 'ACTIVE',
    nextHearing: '2026-09-14',
    nextDeadline: '2026-09-02',
    responsible: 'Av. Behçet Alp',
    documentCount: 10,
  },
  {
    id: 'case-2024-381',
    title: 'Fazla Mesai Alacağı',
    caseNumber: '2024/381',
    court: 'Kurgu 8. İş Mahkemesi',
    category: 'İş Hukuku',
    clientName: 'Ece Korkmaz',
    opposingParty: 'Anadolu Tekstil Ltd. Şti.',
    status: 'CLOSED',
    nextHearing: null,
    nextDeadline: null,
    responsible: 'Av. Behçet Alp',
    documentCount: 0,
  },
  {
    id: 'case-2025-077',
    title: 'Yıllık İzin ve Ücret Alacağı',
    caseNumber: '2025/077',
    court: 'Kurgu 5. İş Mahkemesi',
    category: 'İş Hukuku',
    clientName: 'Kuzey Yapı A.Ş.',
    opposingParty: 'Mehmet Yıldız',
    status: 'CLOSED',
    nextHearing: null,
    nextDeadline: null,
    responsible: 'Av. Behçet Alp',
    documentCount: 0,
  },
];

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '—';

export function CasesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', caseNumber: '', court: '', category: 'İş Hukuku', clientName: '', opposingParty: '', summary: '' });
  const queryClient = useQueryClient();
  const casesQuery = useGetCases({ search: search || undefined, status: status || undefined });
  const createCase = useCreateCase();
  const cases = casesQuery.data ?? fallbackCases;
  const setField = (key: keyof typeof form, value: string) => setForm((c) => ({ ...c, [key]: value }));
  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createCase.mutate(
      { data: form },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetCasesQueryKey() }); setShowModal(false); } },
    );
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Davalar"
        description="Aktif dosyalar, tarihler ve durum takibi."
        action={
          <button
            onClick={() => setShowModal(true)}
            data-testid="button-new-case"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} />
            Yeni dava
          </button>
        }
      >
        <div className="flex items-center gap-2 rounded border border-amber-300/40 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Demo
        </div>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Dosya, müvekkil veya karşı taraf ara"
          testId="input-search-cases"
          className="flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          data-testid="select-case-status"
          className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Tüm durumlar</option>
          <option value="ACTIVE">Aktif</option>
          <option value="WAITING">Bekliyor</option>
          <option value="APPEAL">İstinaf</option>
        </select>
      </div>

      {casesQuery.isLoading && !casesQuery.data ? (
        <div className="space-y-2" data-testid="status-loading">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 shimmer rounded-md" />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-md border border-border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Dosya ↕</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Müvekkil</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Mahkeme</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Konu</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Duruşma</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Son Süre</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Sorumlu</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer" onClick={() => window.location.href = `/davalar/${item.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness size={14} className="text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="mono text-[11px] text-muted-foreground">{item.caseNumber} · {item.clientName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{item.clientName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.court}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(item.nextHearing)}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-amber-700 dark:text-amber-300">{formatDate(item.nextDeadline)}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{'responsible' in item ? item.responsible : 'Av. Behçet Alp'}</TableCell>
                    <TableCell>
                      <StatusBadge tone={item.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {item.status === 'ACTIVE' ? 'Aktif' : item.status === 'WAITING' ? 'Bekliyor' : 'Kapandı'}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile rows */}
          <div className="space-y-2 lg:hidden">
            {cases.map((item) => (
              <Link
                key={item.id}
                href={`/davalar/${item.id}`}
                className="block rounded-md border border-border bg-card p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge tone={item.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {item.status === 'ACTIVE' ? 'Aktif' : 'Kapandı'}
                      </StatusBadge>
                      <span className="mono text-[11px] text-muted-foreground">{item.caseNumber}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.court}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><BriefcaseBusiness size={10} /> {item.clientName}</span>
                  {item.nextHearing && <span className="flex items-center gap-1"><CalendarDays size={10} /> {formatDate(item.nextHearing)}</span>}
                  {item.nextDeadline && <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300"><Clock3 size={10} /> Son süre: {formatDate(item.nextDeadline)}</span>}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm" data-testid="dialog-modal">
          <div className="w-full max-w-lg rounded-md border border-border bg-card p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Yeni dava kaydı</h2>
              <button onClick={() => setShowModal(false)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <span className="sr-only">Kapat</span>×
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Dava başlığı *</span>
                <input name="case-title" value={form.title} onChange={(e) => setField('title', e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium">Esas numarası *</span>
                  <input name="case-number" value={form.caseNumber} onChange={(e) => setField('caseNumber', e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium">Mahkeme *</span>
                  <input name="case-court" value={form.court} onChange={(e) => setField('court', e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium">Müvekkil *</span>
                  <input name="case-client" value={form.clientName} onChange={(e) => setField('clientName', e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium">Karşı taraf *</span>
                  <input name="case-opposing" value={form.opposingParty} onChange={(e) => setField('opposingParty', e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted" data-testid="button-cancel-case">
                  Vazgeç
                </button>
                <button type="submit" disabled={createCase.isPending} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50" data-testid="button-submit-case">
                  {createCase.isPending && <LoaderCircle size={14} className="animate-spin" />}
                  Dosyayı oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
