import { useMemo, useState } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { Pencil, Plus, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { ClientDialog } from '@/components/dialogs/client-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWorkspace } from '@/lib/demo-repository';

export function ClientsPage() {
  const ws = useWorkspace();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const q = new URLSearchParams(searchString).get('q') ?? '';
  const [dialog, setDialog] = useState<{ open: boolean; clientId: string | null }>({ open: false, clientId: null });

  const setQ = (value: string) => {
    const next = new URLSearchParams(searchString);
    if (value) next.set('q', value);
    else next.delete('q');
    const qs = next.toString();
    navigate(`/muvekkiller${qs ? `?${qs}` : ''}`);
  };

  const rows = useMemo(() => {
    const norm = q.toLocaleLowerCase('tr-TR');
    return ws.clients
      .map((c) => ({ ...c, cases: ws.cases.filter((x) => x.clientId === c.id) }))
      .filter((c) => !norm || `${c.name} ${c.email ?? ''} ${c.phone ?? ''}`.toLocaleLowerCase('tr-TR').includes(norm));
  }, [ws.clients, ws.cases, q]);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Müvekkiller"
        description="Kişi ve kurum kayıtları."
        action={
          <button
            onClick={() => setDialog({ open: true, clientId: null })}
            data-testid="button-new-client"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} />
            Yeni müvekkil
          </button>
        }
      >
        <div className="flex items-center gap-2 rounded border border-amber-300/40 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Demo
        </div>
      </PageHeader>

      <div className="mb-4 flex items-center gap-3">
        <SearchInput value={q} onChange={setQ} placeholder="Müvekkil adı ara" testId="input-search-clients" className="flex-1" />
        <span className="mono text-[11px] text-muted-foreground">{rows.length} kayıt</span>
      </div>

      {rows.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center">
          <Users size={20} className="mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Bu aramayla eşleşen müvekkil yok</p>
          <p className="mt-1 text-xs text-muted-foreground">İlk müvekkil kaydınızı ekleyerek başlayın.</p>
          <button
            onClick={() => setDialog({ open: true, clientId: null })}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} /> Müvekkil ekle
          </button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-md border border-border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Müvekkil</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Tür</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">İletişim</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">İlgili Dosyalar</TableHead>
                  <TableHead className="h-9 w-[44px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((client) => (
                  <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                          {client.name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                        </span>
                        <span className="text-sm font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.type === 'individual' ? 'Gerçek Kişi' : 'Tüzel Kişi'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {[client.email, client.phone].filter(Boolean).join(' · ') || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {client.cases.length ? (
                        <span className="flex flex-wrap gap-1">
                          {client.cases.map((c) => (
                            <Link key={c.id} href={`/davalar/${c.id}`} className="rounded bg-muted px-1.5 py-0.5 hover:text-foreground">
                              {c.caseNumber ?? c.title}
                            </Link>
                          ))}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setDialog({ open: true, clientId: client.id })}
                        aria-label="Müvekkili düzenle"
                        title="Müvekkili düzenle"
                        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil size={13} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2 md:hidden">
            {rows.map((client) => (
              <div key={client.id} className="rounded-md border border-border bg-card p-3" data-testid={`row-client-${client.id}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                      {client.name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-[11px] text-muted-foreground">{client.type === 'individual' ? 'Gerçek Kişi' : 'Tüzel Kişi'}</p>
                    </div>
                  </div>
                  <button onClick={() => setDialog({ open: true, clientId: client.id })} aria-label="Düzenle" className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted">
                    <Pencil size={13} />
                  </button>
                </div>
                {client.cases.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 text-[11px]">
                    {client.cases.map((c) => (
                      <Link key={c.id} href={`/davalar/${c.id}`} className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                        {c.caseNumber ?? c.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <ClientDialog
        open={dialog.open}
        onOpenChange={(o) => setDialog((s) => ({ ...s, open: o }))}
        clientId={dialog.clientId}
      />
    </div>
  );
}
