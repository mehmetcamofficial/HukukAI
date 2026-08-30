import { useMemo } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { BriefcaseBusiness, CalendarDays, Clock3, Pencil, Plus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { SearchInput } from '@/components/search-input';
import { useWorkspaceActions } from '@/components/workspace/workspace-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  byDeadlineUrgency,
  caseStatusLabels,
  caseStatusTone,
  caseTypeLabels,
  getDeadlineInfo,
  useWorkspace,
  type CaseStatus,
} from '@/lib/demo-repository';

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '—';

export function CasesPage() {
  const ws = useWorkspace();
  const actions = useWorkspaceActions();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const q = params.get('q') ?? '';
  const status = params.get('status') ?? '';

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchString);
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    navigate(`/davalar${qs ? `?${qs}` : ''}`);
  };

  const rows = useMemo(() => {
    const norm = q.toLocaleLowerCase('tr-TR');
    return ws.cases
      .filter((c) => {
        if (status && c.status !== status) return false;
        if (!norm) return true;
        return `${c.title} ${c.caseNumber ?? ''} ${c.clientName} ${c.opposingParty ?? ''} ${c.court ?? ''}`
          .toLocaleLowerCase('tr-TR')
          .includes(norm);
      })
      .sort((a, b) => {
        const rank = (s: CaseStatus) => (s === 'closed' ? 1 : 0);
        if (rank(a.status) !== rank(b.status)) return rank(a.status) - rank(b.status);
        return byDeadlineUrgency(a.nextDeadline ?? a.nextHearing, b.nextDeadline ?? b.nextHearing);
      });
  }, [ws.cases, q, status]);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Davalar"
        description="Aktif dosyalar, tarihler ve durum takibi."
        action={
          <button
            onClick={() => actions.newCase()}
            data-testid="button-new-case"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} />
            Yeni Dava
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
          value={q}
          onChange={(v) => setParam('q', v)}
          placeholder="Dosya, müvekkil veya karşı taraf ara"
          testId="input-search-cases"
          className="flex-1"
        />
        <select
          value={status}
          onChange={(e) => setParam('status', e.target.value)}
          data-testid="select-case-status"
          className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Tüm durumlar</option>
          {(Object.keys(caseStatusLabels) as CaseStatus[]).map((s) => (
            <option key={s} value={s}>{caseStatusLabels[s]}</option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center">
          <BriefcaseBusiness size={20} className="mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Bu filtreyle eşleşen dosya yok</p>
          <p className="mt-1 text-xs text-muted-foreground">Aramayı temizleyin ya da yeni bir dava oluşturun.</p>
          <button
            onClick={() => actions.newCase()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} />
            Yeni Dava
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-md border border-border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Dosya</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Müvekkil</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Mahkeme</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Tür</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Duruşma</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Son Süre</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Sorumlu</TableHead>
                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-wider">Durum</TableHead>
                  <TableHead className="h-10 w-[44px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item) => {
                  const dl = getDeadlineInfo(item.nextDeadline);
                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer"
                      data-testid={`row-case-${item.id}`}
                      onClick={() => navigate(`/davalar/${item.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BriefcaseBusiness size={14} className="text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="mono text-[11px] text-muted-foreground">
                              {item.caseNumber ?? '—'} · {item.clientName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{item.clientName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.court ?? '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{caseTypeLabels[item.caseType]}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(item.nextHearing)}</TableCell>
                      <TableCell className={`whitespace-nowrap text-xs ${dl.tone === 'danger' ? 'text-red-600' : 'text-amber-700 dark:text-amber-300'}`}>
                        {item.nextDeadline ? `${formatDate(item.nextDeadline)} · ${dl.label}` : '—'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{item.responsible ?? 'Av. Behçet Alp'}</TableCell>
                      <TableCell>
                        <StatusBadge tone={caseStatusTone[item.status]}>{caseStatusLabels[item.status]}</StatusBadge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => actions.editCase(item.id)}
                          aria-label="Dosyayı düzenle"
                          title="Dosyayı düzenle"
                          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil size={13} />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile rows */}
          <div className="space-y-2 lg:hidden">
            {rows.map((item) => {
              const dl = getDeadlineInfo(item.nextDeadline);
              return (
                <Link key={item.id} href={`/davalar/${item.id}`} className="block rounded-md border border-border bg-card p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge tone={caseStatusTone[item.status]}>{caseStatusLabels[item.status]}</StatusBadge>
                    <span className="mono text-[11px] text-muted-foreground">{item.caseNumber ?? '—'}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.court ?? '—'}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><BriefcaseBusiness size={10} /> {item.clientName}</span>
                    {item.nextHearing && <span className="flex items-center gap-1"><CalendarDays size={10} /> {formatDate(item.nextHearing)}</span>}
                    {item.nextDeadline && (
                      <span className={`flex items-center gap-1 ${dl.tone === 'danger' ? 'text-red-600' : 'text-amber-700 dark:text-amber-300'}`}>
                        <Clock3 size={10} /> {dl.label}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
