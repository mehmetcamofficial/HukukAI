import { useState } from 'react';
import {
  getGetClientsQueryKey,
  useCreateClient,
  useGetClients,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Plus, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ClientsPage() {
  const clientsQuery = useGetClients();
  const createClient = useCreateClient();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'INDIVIDUAL', email: '', phone: '' });
  const fallbackClients = [
  { id: 'client-001', name: 'Deniz Aras', type: 'INDIVIDUAL', email: '', phone: '' },
  { id: 'client-002', name: 'Ece Korkmaz', type: 'INDIVIDUAL', email: '', phone: '' },
  { id: 'client-003', name: 'Kuzey Yapı A.Ş.', type: 'CORPORATE', email: '', phone: '' },
];
const clients = clientsQuery.data ?? fallbackClients;
  const visible = clients.filter((c) =>
    c.name.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')),
  );
  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createClient.mutate(
      { data: form },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetClientsQueryKey() }); setShowModal(false); } },
    );
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Müvekkiller"
        description="Kişi ve kurum kayıtları."
        action={
          <button
            onClick={() => setShowModal(true)}
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
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Müvekkil adı ara"
          testId="input-search-clients"
          className="flex-1"
        />
        <span className="mono text-[11px] text-muted-foreground">{visible.length} kayıt</span>
      </div>

      {clientsQuery.isLoading && !clientsQuery.data ? (
        <div className="space-y-2" data-testid="status-loading">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 shimmer rounded-md" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center" data-testid="status-empty">
          <Users size={20} className="mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Henüz müvekkil yok</p>
          <p className="mt-1 text-xs text-muted-foreground">İlk müvekkil kaydınızı ekleyerek başlayın.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="button-empty-new-client"
          >
            <Plus size={14} />
            Müvekkil ekle
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Müvekkil</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Tür</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">E-posta</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Telefon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((client) => (
                  <TableRow key={client.id} data-testid={`card-client-${client.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                          {client.name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                        </span>
                        <span className="text-sm font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.type === 'INDIVIDUAL' ? 'Bireysel' : 'Kurumsal'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.email || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.phone || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile rows */}
          <div className="md:hidden space-y-2">
            {visible.map((client) => (
              <div key={client.id} className="rounded-md border border-border bg-card p-3" data-testid={`card-client-${client.id}`}>
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                    {client.name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-[11px] text-muted-foreground">{client.type === 'INDIVIDUAL' ? 'Bireysel' : 'Kurumsal'}</p>
                  </div>
                </div>
                {(client.email || client.phone) && (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    {client.email && <span>{client.email}</span>}
                    {client.phone && <span>{client.phone}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm" data-testid="dialog-modal">
          <div className="w-full max-w-md rounded-md border border-border bg-card p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Yeni müvekkil</h2>
              <button onClick={() => setShowModal(false)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <span className="sr-only">Kapat</span>×
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Ad Soyad *</span>
                <input name="name" value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">E-posta</span>
                <input name="email" type="email" value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Telefon</span>
                <input name="phone" value={form.phone} onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                  Vazgeç
                </button>
                <button type="submit" disabled={createClient.isPending} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {createClient.isPending && <LoaderCircle size={14} className="animate-spin" />}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
