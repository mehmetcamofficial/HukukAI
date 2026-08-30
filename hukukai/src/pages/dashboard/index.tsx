import { useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  Gavel,
  ListChecks,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { useWorkspaceActions } from '@/components/workspace/workspace-actions';
import {
  byDeadlineUrgency,
  caseStatusLabels,
  caseStatusTone,
  getDeadlineInfo,
  taskPriorityLabels,
  taskStatusLabels,
  useAgendaFeed,
  useWorkspace,
} from '@/lib/demo-repository';

const fmtDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' }).format(new Date(value)) : '—';

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export function DashboardPage() {
  const ws = useWorkspace();
  const actions = useWorkspaceActions();
  const [, navigate] = useLocation();
  const agenda = useAgendaFeed(21);

  const activeCases = useMemo(
    () =>
      ws.cases
        .filter((c) => c.status !== 'closed')
        .sort((a, b) => byDeadlineUrgency(a.nextDeadline ?? a.nextHearing, b.nextDeadline ?? b.nextHearing)),
    [ws.cases],
  );

  const openTasks = useMemo(
    () =>
      ws.tasks
        .filter((t) => t.status !== 'done')
        .sort((a, b) => byDeadlineUrgency(a.dueDate, b.dueDate))
        .slice(0, 6),
    [ws.tasks],
  );

  const caseLabel = (id?: string | null) => ws.cases.find((c) => c.id === id)?.title ?? 'Dosyasız';

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Genel Bakış" description="Bugün ne yapmam gerekiyor?">
        <div className="flex items-center gap-2 rounded border border-amber-300/40 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Demo · yerel veri
        </div>
      </PageHeader>

      {/* Quick actions */}
      <div className="mb-5 flex flex-wrap gap-2">
        <QuickAction onClick={() => actions.newCase()} icon={<BriefcaseBusiness size={14} />}>Yeni Dava</QuickAction>
        <QuickAction onClick={() => actions.newTask()} icon={<ListChecks size={14} />}>Görev Ekle</QuickAction>
        <QuickAction onClick={() => navigate('/takvim')} icon={<CalendarDays size={14} />}>Takvim</QuickAction>
        <QuickAction onClick={() => navigate('/emsal-kararlar')} icon={<Gavel size={14} />}>Emsal Ara</QuickAction>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {/* Bugün + Geciken */}
          <section className="rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="text-sm font-semibold">Bugün &amp; Yaklaşan Süreler</h2>
              <Link href="/takvim" className="text-xs text-primary hover:underline">Takvim</Link>
            </div>
            {agenda.all.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">Yaklaşan süre veya duruşma yok.</p>
            ) : (
              <ul className="divide-y divide-border">
                {[...agenda.overdue, ...agenda.today, ...agenda.upcoming].slice(0, 8).map((it) => (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => navigate(it.caseId ? `/davalar/${it.caseId}` : '/takvim')}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50"
                    >
                      {it.deadline.status === 'overdue' ? (
                        <AlertTriangle size={14} className="shrink-0 text-red-500" />
                      ) : it.deadline.status === 'today' ? (
                        <AlertTriangle size={14} className="shrink-0 text-amber-500" />
                      ) : it.kind === 'task' ? (
                        <ListChecks size={14} className="shrink-0 text-muted-foreground" />
                      ) : (
                        <CalendarDays size={14} className="shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{it.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {it.caseLabel ? `${it.caseLabel} · ` : ''}{it.responsible ?? ''}
                        </p>
                      </div>
                      <span
                        className={`mono shrink-0 text-[11px] ${
                          it.deadline.tone === 'danger' ? 'text-red-600' : it.deadline.tone === 'warning' ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'
                        }`}
                      >
                        {fmtDate(it.date)}{it.time ? ` ${it.time}` : ''} · {it.deadline.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Aktif Dosyalar */}
          <section className="rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="text-sm font-semibold">Aktif Dosyalar</h2>
              <Link href="/davalar" className="text-xs text-primary hover:underline">Tüm davalar</Link>
            </div>
            {activeCases.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">Aktif dosya yok.</p>
            ) : (
              <ul className="divide-y divide-border">
                {activeCases.slice(0, 5).map((c) => {
                  const dl = getDeadlineInfo(c.nextDeadline);
                  return (
                    <li key={c.id}>
                      <Link href={`/davalar/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge tone={caseStatusTone[c.status]}>{caseStatusLabels[c.status]}</StatusBadge>
                            <span className="mono text-[11px] text-muted-foreground">{c.caseNumber ?? '—'}</span>
                            <span className="text-sm font-medium">{c.title}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{c.court ?? '—'} · {c.clientName}</p>
                        </div>
                        {c.nextDeadline && (
                          <span className={`mono shrink-0 text-[11px] ${dl.tone === 'danger' ? 'text-red-600' : 'text-amber-700 dark:text-amber-300'}`}>
                            {dl.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-4">
          {/* Açık Görevler */}
          <section className="rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="text-sm font-semibold">Açık Görevler</h2>
              <Link href="/gorevler" className="text-xs text-primary hover:underline">Görevler</Link>
            </div>
            {openTasks.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-muted-foreground">Açık görev yok.</p>
                <button onClick={() => actions.newTask()} className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium hover:bg-muted">
                  <Plus size={12} /> Görev Ekle
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {openTasks.map((t) => {
                  const d = getDeadlineInfo(t.dueDate);
                  return (
                    <li key={t.id}>
                      <button type="button" onClick={() => actions.editTask(t.id)} className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-muted/50">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{t.title}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {caseLabel(t.caseId)} · {taskStatusLabels[t.status]}
                          </p>
                        </div>
                        <StatusBadge tone={t.priority === 'critical' ? 'danger' : t.priority === 'high' ? 'warning' : 'neutral'}>
                          {taskPriorityLabels[t.priority]}
                        </StatusBadge>
                        {t.dueDate && (
                          <span className={`mono shrink-0 text-[11px] ${d.tone === 'danger' ? 'text-red-600' : d.tone === 'warning' ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>
                            {d.label}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Son Hareketler */}
          <section className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-2.5">
              <h2 className="text-sm font-semibold">Son Hareketler</h2>
            </div>
            {ws.activities.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">Kayıt yok.</p>
            ) : (
              <ul className="divide-y divide-border">
                {ws.activities.slice(0, 8).map((a) => (
                  <li key={a.id} className="px-4 py-2.5">
                    <p className="text-xs font-medium">{a.summary}</p>
                    {a.detail && <p className="mt-0.5 text-[11px] text-muted-foreground">{a.detail}</p>}
                    <p className="mono mt-1 text-[10px] text-muted-foreground/70">{a.actor} · {fmtTime(a.at)}</p>
                  </li>
                ))}
              </ul>
            )}
            <p className="px-4 py-2 text-[10px] text-muted-foreground/60">
              Demo etkinlik akışı — denetim kaydı değildir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted"
    >
      {icon}
      {children}
    </button>
  );
}
