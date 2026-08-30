import { useMemo, useState } from 'react';
import { Link, useParams, useLocation, useSearch } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock3,
  FileText,
  ListChecks,
  Pencil,
  Pin,
  PinOff,
  Plus,
  RotateCcw,
  Scale,
  Trash2,
  Users,
} from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  byDeadlineUrgency,
  calendarEventTypeLabels,
  caseOutcomeLabels,
  caseStatusLabels,
  caseStatusTone,
  caseTypeLabels,
  demoRepo,
  documentTypeLabels,
  draftStatusLabels,
  evidenceStatusLabels,
  getDeadlineInfo,
  researchRelationLabels,
  taskPriorityLabels,
  taskStatusLabels,
  timelineEventTypeLabels,
  useCase,
  useCaseBundle,
  useWorkspace,
  type CaseStatus,
} from '@/lib/demo-repository';
import {
  buildCaseAnalysis,
  buildCounterpartyAnalysis,
  SIMILAR_CASES,
  type CounterpartyRisk,
} from '@/lib/demo-analysis';

type TabKey = 'overview' | 'tasks' | 'notes' | 'documents' | 'timeline' | 'evidence' | 'research' | 'similar' | 'drafts';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Genel' },
  { key: 'tasks', label: 'Görevler' },
  { key: 'notes', label: 'Notlar' },
  { key: 'documents', label: 'Belgeler' },
  { key: 'timeline', label: 'Kronoloji' },
  { key: 'evidence', label: 'Deliller' },
  { key: 'research', label: 'Emsal & Mevzuat' },
  { key: 'similar', label: 'Benzer Dosyalar' },
  { key: 'drafts', label: 'Taslaklar' },
];

const fmtDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value)) : '—';
const fmtShort = (value?: string | null) =>
  value ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' }).format(new Date(value)) : '—';
const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export function CaseWorkspacePage() {
  const { caseId = '' } = useParams<{ caseId: string }>();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const actions = useWorkspaceActions();

  const ws = useWorkspace();
  const item = useCase(caseId);
  const bundle = useCaseBundle(caseId);

  const tabParam = new URLSearchParams(searchString).get('tab') as TabKey | null;
  const [tab, setTab] = useState<TabKey>(tabParam && TABS.some((t) => t.key === tabParam) ? tabParam : 'overview');

  const [closeOpen, setCloseOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<CaseStatus | null>(null);
  const [outcome, setOutcome] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ kind: 'note' | 'task' | 'evidence' | 'timeline' | 'bookmark'; id: string } | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);

  const analysis = useMemo(() => (item ? buildCaseAnalysis(caseId, ws) : null), [item, caseId, ws]);
  const counterparty = useMemo(() => (item ? buildCounterpartyAnalysis(caseId, ws) : null), [item, caseId, ws]);

  const nearestDeadline = useMemo(() => {
    const dates = [
      item?.nextDeadline ?? null,
      ...bundle.calendar.filter((e) => e.eventType === 'son-sure' || e.eventType === 'durusma').map((e) => e.date),
      ...bundle.tasks.filter((t) => t.status !== 'done' && t.dueDate).map((t) => t.dueDate as string),
    ].filter(Boolean) as string[];
    return dates.sort(byDeadlineUrgency)[0] ?? null;
  }, [item, bundle]);

  const goTab = (k: TabKey) => {
    setTab(k);
    navigate(`/davalar/${caseId}?tab=${k}`, { replace: true });
  };

  if (!item) {
    return (
      <div className="mx-auto max-w-[900px]">
        <button onClick={() => navigate('/davalar')} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Tüm davalar
        </button>
        <div className="rounded-md border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm font-medium">Dosya bulunamadı</p>
          <p className="mt-1 text-xs text-muted-foreground">Bu dosya silinmiş olabilir veya demo verileri sıfırlanmış olabilir.</p>
        </div>
      </div>
    );
  }

  const changeStatus = (next: CaseStatus) => {
    if (next === item.status) return;
    if (next === 'closed') {
      setPendingStatus('closed');
      setOutcome(item.outcome ?? '');
      setCloseOpen(true);
      return;
    }
    demoRepo.changeCaseStatus(item.id, next);
    toast({ title: 'Dosya durumu güncellendi.', description: caseStatusLabels[next] });
  };

  const tabCount = (k: TabKey) =>
    k === 'tasks' ? bundle.tasks.length
    : k === 'notes' ? bundle.notes.length
    : k === 'documents' ? bundle.documents.length
    : k === 'timeline' ? bundle.timeline.length + bundle.calendar.length
    : k === 'evidence' ? bundle.evidence.length
    : k === 'research' ? bundle.researchBookmarks.length
    : k === 'drafts' ? bundle.drafts.length
    : k === 'similar' ? SIMILAR_CASES.length
    : 0;

  return (
    <div className="mx-auto max-w-[1280px]">
      <button
        onClick={() => navigate('/davalar')}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        data-testid="button-back-cases"
      >
        <ArrowLeft size={14} /> Tüm davalar
      </button>

      {/* Control surface header */}
      <div className="mb-4 overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
          <span>Dava çalışma alanı <span className="ml-1 text-primary">DEMO</span></span>
          {item.seeded && <span className="text-muted-foreground/70">Kurgusal dava verisi</span>}
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge tone={caseStatusTone[item.status]}>{caseStatusLabels[item.status]}</StatusBadge>
                {item.status === 'closed' && item.outcome && (
                  <StatusBadge tone="neutral">Sonuç: {caseOutcomeLabels[item.outcome]}</StatusBadge>
                )}
                <span className="mono text-[11px] text-muted-foreground">{item.caseNumber ?? '—'}</span>
                <span className="text-[11px] text-muted-foreground">{caseTypeLabels[item.caseType]}</span>
              </div>
              <h1 className="text-xl font-semibold tracking-tight">{item.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{item.court ?? 'Mahkeme belirtilmedi'}</p>

              <div className="mt-4 grid max-w-[820px] gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                <Fact label="Müvekkil" value={item.clientName} />
                <Fact label="Karşı Taraf" value={item.opposingParty ?? '—'} />
                <Fact label="Dosya Sorumlusu" value={item.responsible ?? 'Av. Behçet Alp'} />
                <Fact
                  label="En Yakın Süre"
                  value={nearestDeadline ? `${fmtDate(nearestDeadline)} · ${getDeadlineInfo(nearestDeadline).label}` : '—'}
                  tone={nearestDeadline ? getDeadlineInfo(nearestDeadline).tone : 'neutral'}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                {item.nextHearing && (
                  <span className="flex items-center gap-1"><CalendarDays size={11} /> Sonraki duruşma: {fmtDate(item.nextHearing)}</span>
                )}
                <span className="flex items-center gap-1"><Clock3 size={11} /> Açılış: {fmtDate(item.openedAt)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 xl:w-[300px]">
              <div className="flex flex-wrap gap-1.5">
                <HeaderBtn onClick={() => actions.newTask(item.id)} icon={<ListChecks size={13} />}>Görev</HeaderBtn>
                <HeaderBtn onClick={() => actions.newNote(item.id)} icon={<Pencil size={13} />}>Not</HeaderBtn>
                <HeaderBtn onClick={() => actions.newDocument(item.id)} icon={<FileText size={13} />}>Belge</HeaderBtn>
                <HeaderBtn onClick={() => actions.newCalendarEvent({ caseId: item.id, type: 'durusma' })} icon={<CalendarPlus size={13} />}>Duruşma</HeaderBtn>
                <HeaderBtn onClick={() => actions.newCalendarEvent({ caseId: item.id, type: 'son-sure' })} icon={<Clock3 size={13} />}>Süre</HeaderBtn>
                <HeaderBtn onClick={() => actions.editCase(item.id)} icon={<Pencil size={13} />}>Düzenle</HeaderBtn>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setAnalysisOpen(true)} data-testid="button-generate-analysis" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  <Scale size={13} /> Dosyayı Analiz Et
                </button>
                <button onClick={() => setCounterOpen(true)} data-testid="button-counterparty-analysis" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                  <Users size={13} /> Karşı Taraf Gibi Analiz Et
                </button>
              </div>
              <label className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dosya Durumu</label>
              <Select value={item.status} onValueChange={(v) => changeStatus(v as CaseStatus)}>
                <SelectTrigger className="h-9 text-xs" data-testid="select-case-workspace-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(caseStatusLabels) as CaseStatus[]).map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">{caseStatusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border" role="tablist" aria-label="Dava dosyası bölümleri">
        {TABS.map(({ key, label }) => {
          const count = tabCount(key);
          return (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => goTab(key)}
              data-testid={`tab-case-${key}`}
              className={`min-h-11 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                tab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}{count ? <span className="ml-1 text-muted-foreground">{count}</span> : null}
            </button>
          );
        })}
      </div>

      {tab === 'overview' && analysis && (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <div className="space-y-4">
            <Panel title="Dava Özeti">
              <p className="text-sm leading-6 text-muted-foreground">{item.summary || 'Özet girilmemiş.'}</p>
              {item.note && <p className="mt-3 rounded bg-muted/50 p-2 text-xs text-muted-foreground">{item.note}</p>}
            </Panel>

            <section className="rounded-md border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dosya Değerlendirmesi</h3>
                <StatusBadge tone="warning">DEMO AI ÇIKTISI</StatusBadge>
              </div>
              <p className="mb-3 text-[11px] text-muted-foreground/70">Ağ üzerinden model çağrılmadı. Sonuçlar dosya verisinden üretildi: {analysis.generatedFrom}.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniList title="Güçlü Noktalar" tone="emerald" items={analysis.strengths} />
                <MiniList title="Zayıf Noktalar" tone="amber" items={analysis.weaknesses} />
              </div>
              {analysis.contradictions.length > 0 && (
                <div className="mt-3">
                  <MiniList title="Çelişkiler" tone="red" items={analysis.contradictions} />
                </div>
              )}
              <button onClick={() => setAnalysisOpen(true)} className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                Tüm analizi ve önerilen işlemleri gör <ArrowRight size={12} />
              </button>
            </section>

            <Panel title="Açık Görevler">
              {bundle.tasks.filter((t) => t.status !== 'done').length === 0 ? (
                <Empty text="Bu dosyada açık görev yok." />
              ) : (
                <ul className="space-y-2">
                  {bundle.tasks.filter((t) => t.status !== 'done').sort((a, b) => byDeadlineUrgency(a.dueDate, b.dueDate)).map((t) => {
                    const d = getDeadlineInfo(t.dueDate);
                    return (
                      <li key={t.id} className="flex items-center justify-between gap-3 rounded border border-border px-3 py-2">
                        <span className="text-xs font-medium">{t.title}</span>
                        <span className={`mono shrink-0 text-[11px] ${d.tone === 'danger' ? 'text-red-600' : d.tone === 'warning' ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>
                          {t.dueDate ? d.label : taskStatusLabels[t.status]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>

          <Panel title="Son Hareketler">
            {bundle.activities.length === 0 ? (
              <Empty text="Bu dosyada henüz hareket kaydı yok." />
            ) : (
              <ol className="space-y-3">
                {bundle.activities.slice(0, 14).map((a) => (
                  <li key={a.id} className="border-l-2 border-border pl-3">
                    <p className="mono text-[10px] text-muted-foreground/70">{fmtDateTime(a.at)}</p>
                    <p className="text-xs font-medium">{a.summary}</p>
                    {a.detail && <p className="text-[11px] text-muted-foreground">{a.detail}</p>}
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 text-[10px] text-muted-foreground/60">“Son Hareketler” — demo etkinlik akışı; denetim kaydı değildir.</p>
          </Panel>
        </div>
      )}

      {tab === 'tasks' && (
        <Section onAdd={() => actions.newTask(item.id)} addLabel="Görev Ekle" empty={bundle.tasks.length === 0 ? 'Bu dosyada henüz görev bulunmuyor.' : undefined}>
          <ul className="space-y-2">
            {bundle.tasks.sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0) || byDeadlineUrgency(a.dueDate, b.dueDate)).map((t) => {
              const d = getDeadlineInfo(t.dueDate);
              return (
                <li key={t.id} className="flex flex-col gap-2 rounded-md border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${t.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>{t.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <StatusBadge tone={t.priority === 'critical' ? 'danger' : t.priority === 'high' ? 'warning' : 'neutral'}>{taskPriorityLabels[t.priority]}</StatusBadge>
                      <StatusBadge tone={t.status === 'done' ? 'success' : t.status === 'in-progress' ? 'warning' : 'neutral'}>{taskStatusLabels[t.status]}</StatusBadge>
                      {t.dueDate && <span className={d.tone === 'danger' ? 'text-red-600' : ''}>{fmtShort(t.dueDate)} · {d.label}</span>}
                      {t.origin === 'missing-evidence' && <span className="text-muted-foreground/70">Eksik delilden</span>}
                      {t.origin === 'counterparty' && <span className="text-muted-foreground/70">Karşı taraf analizinden</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    {t.status === 'done' ? (
                      <RowIcon label="Yeniden aç" onClick={() => { demoRepo.reopenTask(t.id); toast({ title: 'Görev yeniden açıldı.' }); }}><RotateCcw size={14} /></RowIcon>
                    ) : (
                      <RowIcon label="Tamamla" onClick={() => { demoRepo.completeTask(t.id); toast({ title: 'Görev tamamlandı.' }); }}><Check size={14} /></RowIcon>
                    )}
                    <RowIcon label="Düzenle" onClick={() => actions.editTask(t.id)}><Pencil size={14} /></RowIcon>
                    <RowIcon label="Sil" onClick={() => setConfirmDelete({ kind: 'task', id: t.id })}><Trash2 size={14} /></RowIcon>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {tab === 'notes' && (
        <Section onAdd={() => actions.newNote(item.id)} addLabel="Not Ekle" empty={bundle.notes.length === 0 ? 'Bu dosyada henüz iç not bulunmuyor.' : undefined}>
          <div className="space-y-2">
            {[...bundle.notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt.localeCompare(a.updatedAt)).map((n) => (
              <div key={n.id} className="rounded-md border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="neutral">İç Not</StatusBadge>
                      {n.pinned && <StatusBadge tone="warning">Sabitlendi</StatusBadge>}
                      {n.title && <span className="text-sm font-semibold">{n.title}</span>}
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">{n.body}</p>
                    <p className="mono mt-2 text-[10px] text-muted-foreground/70">{n.author} · {fmtDateTime(n.updatedAt)}</p>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <RowIcon label={n.pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'} onClick={() => demoRepo.toggleNotePin(n.id)}>
                      {n.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                    </RowIcon>
                    <RowIcon label="Düzenle" onClick={() => actions.editNote(item.id, n.id)}><Pencil size={14} /></RowIcon>
                    <RowIcon label="Sil" onClick={() => setConfirmDelete({ kind: 'note', id: n.id })}><Trash2 size={14} /></RowIcon>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {tab === 'documents' && (
        <Section onAdd={() => actions.newDocument(item.id)} addLabel="Belge Ekle" empty={bundle.documents.length === 0 ? 'Bu dosyaya bağlı belge yok.' : undefined}>
          <p className="mb-3 text-[11px] text-muted-foreground/70">Yalnızca üst veri saklanır; dosya içeriği (byte) yüklenmez.</p>
          <div className="space-y-2">
            {bundle.documents.map((d) => (
              <button
                key={d.id}
                onClick={() => actions.viewDocument(d.id)}
                data-testid={`doc-row-${d.id}`}
                className="flex w-full items-start gap-3 rounded-md border border-border bg-card p-3 text-left transition-colors hover:bg-muted/40"
              >
                <FileText size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {documentTypeLabels[d.docType]}{d.documentDate ? ` · ${fmtShort(d.documentDate)}` : ''}{d.source ? ` · ${d.source}` : ''}
                  </p>
                </div>
                <StatusBadge tone="neutral">{d.verificationStatus}</StatusBadge>
              </button>
            ))}
          </div>
        </Section>
      )}

      {tab === 'timeline' && (
        <div className="space-y-5">
          <Section onAdd={() => actions.newCalendarEvent({ caseId: item.id, type: 'durusma' })} addLabel="Duruşma / Süre Ekle" empty={bundle.calendar.length === 0 ? 'Bu dosyada takvim kaydı yok.' : undefined}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duruşma & Süreler (Takvim)</h3>
            <div className="space-y-2">
              {[...bundle.calendar].sort((a, b) => byDeadlineUrgency(a.date, b.date)).map((e) => {
                const d = getDeadlineInfo(e.date);
                return (
                  <button key={e.id} onClick={() => actions.editCalendarEvent(e.id)} data-testid={`cal-row-${e.id}`} className="flex w-full items-center gap-3 rounded-md border border-border bg-card p-3 text-left transition-colors hover:bg-muted/40">
                    <span className="mono shrink-0 text-[11px] text-muted-foreground">{fmtShort(e.date)}{e.time ? ` ${e.time}` : ''}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{e.title}</p>
                        <StatusBadge tone="neutral">{calendarEventTypeLabels[e.eventType]}</StatusBadge>
                        {(d.status === 'overdue' || d.status === 'today') && <StatusBadge tone={d.tone}>{d.label}</StatusBadge>}
                      </div>
                    </div>
                    <Pencil size={13} className="shrink-0 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </Section>

          <Section onAdd={() => actions.newTimelineEvent(item.id)} addLabel="Olay Ekle" empty={bundle.timeline.length === 0 ? 'Bu dosyada kronoloji olayı yok.' : undefined}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kronoloji Olayları</h3>
            <div className="space-y-2">
              {bundle.timeline.map((e) => (
                <div key={e.id} className="flex gap-3 rounded-md border border-border bg-card p-3">
                  <span className="mono shrink-0 text-[11px] text-muted-foreground">{e.date}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{e.title}</p>
                      <StatusBadge tone="neutral">{timelineEventTypeLabels[e.eventType]}</StatusBadge>
                    </div>
                    {e.description && <p className="mt-0.5 text-xs text-muted-foreground">{e.description}</p>}
                    {e.sourceStatus && <StatusBadge tone={e.sourceStatus === 'DOĞRULANDI' ? 'success' : 'neutral'}>{e.sourceStatus}</StatusBadge>}
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <RowIcon label="Düzenle" onClick={() => actions.editTimelineEvent(item.id, e.id)}><Pencil size={14} /></RowIcon>
                    <RowIcon label="Sil" onClick={() => setConfirmDelete({ kind: 'timeline', id: e.id })}><Trash2 size={14} /></RowIcon>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === 'evidence' && (
        <Section onAdd={() => actions.newEvidence(item.id)} addLabel="İddia Ekle" empty={bundle.evidence.length === 0 ? 'Bu dosyada delil iddiası yok.' : undefined}>
          <div className="space-y-3">
            {bundle.evidence.map((ev) => (
              <div key={ev.id} className="rounded-md border border-border bg-card p-4" data-testid={`evidence-card-${ev.id}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{ev.title}</h3>
                      <StatusBadge tone={ev.status === 'hazir' ? 'success' : ev.status === 'inceleniyor' ? 'warning' : 'neutral'}>{evidenceStatusLabels[ev.status]}</StatusBadge>
                    </div>
                    {ev.legalIssue && <p className="mt-1 text-[11px] text-muted-foreground">{ev.legalIssue}</p>}
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <RowIcon label="Düzenle" onClick={() => actions.editEvidence(item.id, ev.id)}><Pencil size={14} /></RowIcon>
                    <RowIcon label="Sil" onClick={() => setConfirmDelete({ kind: 'evidence', id: ev.id })}><Trash2 size={14} /></RowIcon>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <EvidenceCol title="Destekleyen" tone="emerald" items={ev.supporting.map((r) => r.label)} />
                  <EvidenceCol title="Karşı" tone="red" items={ev.opposing.map((r) => r.label)} />
                  <div className="rounded border border-amber-200 bg-amber-50/50 p-3 text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                    <p className="mb-1 text-[10px] font-semibold uppercase">Eksik Delil</p>
                    {ev.missing.length ? (
                      <ul className="space-y-1.5">
                        {ev.missing.map((r) => (
                          <li key={r.id} className="text-[11px]">
                            <span>· {r.label}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const t = demoRepo.convertMissingEvidenceToTask(ev.id, r.id);
                                if (t) toast({ title: 'Eksik delil göreve dönüştürüldü.', description: t.title });
                              }}
                              data-testid={`convert-missing-${r.id}`}
                              className="ml-1 rounded border border-amber-300/60 px-1.5 py-px text-[10px] font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40"
                            >
                              Göreve Dönüştür
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] opacity-70">—</p>
                    )}
                  </div>
                </div>
                {ev.lawyerAssessment && (
                  <p className="mt-3 rounded bg-muted/50 p-2 text-[11px] text-muted-foreground">
                    <span className="font-semibold">Avukat değerlendirmesi: </span>{ev.lawyerAssessment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {tab === 'research' && (
        <div className="space-y-5">
          {(['precedent', 'legislation'] as const).map((kind) => {
            const rows = bundle.researchBookmarks.filter((b) => b.sourceKind === kind);
            return (
              <div key={kind}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {kind === 'precedent' ? 'Emsal Kararlar' : 'Mevzuat'}
                  </h3>
                  <Link href={kind === 'precedent' ? '/emsal-kararlar' : '/mevzuat'} className="text-[11px] text-primary hover:underline">
                    Kaynak ekle
                  </Link>
                </div>
                {rows.length === 0 ? (
                  <Empty text={`Bu dosyaya kaydedilmiş ${kind === 'precedent' ? 'emsal karar' : 'mevzuat'} yok.`} />
                ) : (
                  <div className="space-y-2">
                    {rows.map((b) => (
                      <div key={b.id} className="rounded-md border border-border bg-card p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge tone={b.relation === 'destekleyen' ? 'success' : b.relation === 'karsi' ? 'danger' : 'neutral'}>{researchRelationLabels[b.relation]}</StatusBadge>
                          <StatusBadge tone={b.verificationStatus === 'DOĞRULANDI' ? 'success' : 'warning'}>{b.verificationStatus}</StatusBadge>
                          <span className="text-sm font-medium">{b.title}</span>
                        </div>
                        {b.citation && <p className="mono mt-1 text-[11px] text-muted-foreground">{b.citation}</p>}
                        <NoteEditor bookmarkId={b.id} initial={b.note ?? ''} />
                        <div className="mt-2 flex items-center gap-3">
                          {b.sourceUrl && (
                            <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-primary hover:underline">Resmî Kaynağı Aç</a>
                          )}
                          <button onClick={() => setConfirmDelete({ kind: 'bookmark', id: b.id })} className="text-[11px] font-medium text-muted-foreground hover:text-red-600">Kaldır</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'similar' && (
        <div>
          <p className="mb-3 text-[11px] text-muted-foreground/70">
            Semantik Benzerlik göstergesi geçmiş kurgusal dosyalarla karşılaştırmadır — başarı olasılığı veya sonuç tahmini değildir.
          </p>
          <div className="space-y-3">
            {SIMILAR_CASES.map((m) => (
              <div key={m.id} className="rounded-md border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{m.caseNumber} — {m.title}</span>
                  <StatusBadge tone="neutral">{m.outcome}</StatusBadge>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  <span>{m.court}</span><span>Müvekkil: {m.clientName}</span><span>Karşı taraf: {m.opposingParty}</span>
                </div>
                <div className="mt-2 rounded bg-muted/50 p-2">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Semantik Benzerlik</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${m.similarity * 100}%` }} />
                    </div>
                    <span className="mono text-[11px] text-muted-foreground">{(m.similarity * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.commonIssues.map((i) => <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{i}</span>)}
                </div>
                <p className="mt-2 text-xs text-muted-foreground"><strong>Yararlı argüman:</strong> {m.usefulArgument}</p>
                <p className="mt-1 text-xs text-muted-foreground"><strong>Avukat notu:</strong> {m.lawyerNote}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'drafts' && (
        <Section onAdd={() => actions.newDraft(item.id)} addLabel="Yeni Taslak" empty={bundle.drafts.length === 0 ? 'Bu dosyada taslak yok.' : undefined}>
          <div className="space-y-2">
            {bundle.drafts.map((d) => (
              <Link key={d.id} href={`/dilekceler/${d.id}`} className="block rounded-md border border-border bg-card p-3 hover:bg-muted/40">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{d.title}</span>
                  <StatusBadge tone={d.status === 'onaylandi' ? 'success' : d.status === 'incelemede' ? 'warning' : 'neutral'}>{draftStatusLabels[d.status]}</StatusBadge>
                  <span className="text-[11px] text-muted-foreground">v{d.version}</span>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Close-case dialog */}
      <Dialog open={closeOpen} onOpenChange={(o) => { setCloseOpen(o); if (!o) setPendingStatus(null); }}>
        <DialogContent className="gap-0 p-0 sm:max-w-sm">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-sm">Dosyayı kapat</DialogTitle>
            <DialogDescription className="text-xs">Dosya “Kapandı” olarak işaretlenecek. İsterseniz bir sonuç seçin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-5 py-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Sonuç (isteğe bağlı)</span>
              <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary">
                <option value="">Belirtilmedi</option>
                {Object.entries(caseOutcomeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <span className="mt-1 block text-[10px] text-muted-foreground">Sonuç etiketi bir hukuki tahmin veya istatistik değildir.</span>
            </label>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <button type="button" onClick={() => { setCloseOpen(false); setPendingStatus(null); }} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Vazgeç</button>
              <button
                type="button"
                onClick={() => {
                  if (pendingStatus === 'closed') {
                    demoRepo.changeCaseStatus(item.id, 'closed', (outcome || null) as never);
                    toast({ title: 'Dosya kapandı.' });
                  }
                  setCloseOpen(false);
                  setPendingStatus(null);
                }}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Kapat
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analysis dialog */}
      {analysis && (
        <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
          <DialogContent className="max-h-[88vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
            <DialogHeader className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-sm">Dosya Analizi</DialogTitle>
                <StatusBadge tone="warning">DEMO AI ÇIKTISI</StatusBadge>
              </div>
              <DialogDescription className="text-xs">Ağ üzerinden model çağrılmadı. {analysis.generatedFrom}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-5 py-4 text-xs">
              <MiniList title="Güçlü Noktalar" tone="emerald" items={analysis.strengths} />
              <MiniList title="Zayıf Noktalar" tone="amber" items={analysis.weaknesses} />
              <MiniList title="Çelişkiler" tone="red" items={analysis.contradictions} />
              <div>
                <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Yaklaşan Süreler</h4>
                {analysis.upcomingDeadlines.length ? (
                  <ul className="space-y-1">
                    {analysis.upcomingDeadlines.map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-2 rounded border border-border px-2 py-1">
                        <span>{d.label}</span>
                        <span className="mono text-[11px] text-muted-foreground">{d.date} · {d.urgency}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground">30 gün içinde yaklaşan süre yok.</p>}
              </div>
              <div>
                <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Önerilen Sonraki İşlemler</h4>
                <ul className="space-y-1.5">
                  {analysis.nextActions.map((na, i) => (
                    <li key={i} className="flex flex-col gap-1.5 rounded border border-border p-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-muted-foreground">{na.text}</span>
                      {na.action && (
                        <button
                          onClick={() => {
                            const a = na.action!;
                            if (a.kind === 'task' && a.payload) {
                              demoRepo.createTask({ caseId, title: a.payload, priority: 'normal' });
                              toast({ title: 'Görev oluşturuldu.', description: a.payload });
                            } else if (a.kind === 'evidence') { setAnalysisOpen(false); goTab('evidence'); }
                            else if (a.kind === 'calendar') { setAnalysisOpen(false); navigate('/takvim'); }
                            else if (a.kind === 'document') { setAnalysisOpen(false); goTab('documents'); }
                          }}
                          className="shrink-0 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium hover:bg-muted"
                        >
                          {na.action.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {analysis.missingEvidence.length > 0 && (
                <div>
                  <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Eksik Deliller</h4>
                  <ul className="space-y-1">
                    {analysis.missingEvidence.map((m) => (
                      <li key={m.refId} className="flex items-center justify-between gap-2 rounded border border-border px-2 py-1">
                        <span className="min-w-0 truncate text-muted-foreground">{m.label} <span className="text-muted-foreground/60">· {m.claimTitle}</span></span>
                        <button
                          onClick={() => {
                            const t = demoRepo.convertMissingEvidenceToTask(m.claimId, m.refId);
                            if (t) toast({ title: 'Eksik delil göreve dönüştürüldü.', description: t.title });
                          }}
                          className="shrink-0 rounded border border-border px-1.5 py-px text-[10px] font-medium hover:bg-muted"
                        >
                          Göreve Dönüştür
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground/60">Bu çıktı bir hukuki görüş değildir; avukat değerlendirmesi gerektirir.</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Counterparty dialog */}
      {counterparty && (
        <Dialog open={counterOpen} onOpenChange={setCounterOpen}>
          <DialogContent className="max-h-[88vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
            <DialogHeader className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-sm">Karşı Taraf Gibi Analiz</DialogTitle>
                <StatusBadge tone="warning">DEMO AI ÇIKTISI</StatusBadge>
              </div>
              <DialogDescription className="text-xs">Deterministik demo çıktısı — her açılışta aynıdır, ağ çağrısı yapılmaz.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-5 py-4 text-xs">
              <MiniList title="Muhtemel Karşı Argümanlar" tone="neutral" items={counterparty.likelyArguments} />
              <div>
                <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Riskler</h4>
                <ul className="space-y-2">
                  {counterparty.risks.map((r) => (
                    <li key={r.id} className="rounded border border-border p-2.5">
                      <p className="text-xs font-semibold">{r.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{r.detail}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <RiskAction onClick={() => {
                          const t = demoRepo.createTask({ caseId, title: `Karşı taraf riski: ${r.title}`, description: r.detail, priority: 'high', origin: 'counterparty' });
                          toast({ title: 'Risk göreve dönüştürüldü.', description: t.title });
                        }}>Göreve Dönüştür</RiskAction>
                        <RiskAction onClick={() => {
                          demoRepo.createEvidenceClaim({ caseId, title: r.title, opposing: [{ id: `evref-${Date.now().toString(36)}`, label: r.evidenceLabel, documentId: null }], status: 'inceleniyor' });
                          toast({ title: 'Delil matrisine karşı delil olarak eklendi.' });
                        }}>Delil Matrisine Ekle</RiskAction>
                        <RiskAction onClick={() => {
                          demoRepo.createNote({ caseId, title: 'Karşı taraf riski', body: `${r.title}\n\n${r.detail}` });
                          toast({ title: 'İç not oluşturuldu.' });
                        }}>İç Not Oluştur</RiskAction>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <MiniList title="Hazırlanması Gerekenler" tone="amber" items={counterparty.preparation} />
              <p className="text-[10px] text-muted-foreground/60">Bu çıktı bir hukuki görüş değildir; avukat değerlendirmesi gerektirir.</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={
          confirmDelete?.kind === 'note' ? 'İç not silinsin mi?'
          : confirmDelete?.kind === 'task' ? 'Görev silinsin mi?'
          : confirmDelete?.kind === 'evidence' ? 'İddia silinsin mi?'
          : confirmDelete?.kind === 'timeline' ? 'Kronoloji olayı silinsin mi?'
          : 'Kayıt kaldırılsın mı?'
        }
        confirmLabel="Sil"
        onConfirm={() => {
          if (!confirmDelete) return;
          const { kind, id } = confirmDelete;
          if (kind === 'note') { demoRepo.deleteNote(id); toast({ title: 'Not silindi.' }); }
          if (kind === 'task') { demoRepo.deleteTask(id); toast({ title: 'Görev silindi.' }); }
          if (kind === 'evidence') { demoRepo.deleteEvidenceClaim(id); toast({ title: 'İddia silindi.' }); }
          if (kind === 'timeline') { demoRepo.deleteTimelineEvent(id); toast({ title: 'Kronoloji olayı silindi.' }); }
          if (kind === 'bookmark') { demoRepo.deleteResearchBookmark(id); toast({ title: 'Kaydedilen kaynak kaldırıldı.' }); }
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}

/* ---------------------------------- bits ---------------------------------- */

function NoteEditor({ bookmarkId, initial }: { bookmarkId: string; initial: string }) {
  const { toast } = useToast();
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  if (!editing) {
    return (
      <p className="mt-1 text-xs text-muted-foreground">
        {value ? value : <span className="italic text-muted-foreground/60">Not yok.</span>}{' '}
        <button onClick={() => setEditing(true)} className="text-[11px] font-medium text-primary hover:underline">Notu düzenle</button>
      </p>
    );
  }
  return (
    <div className="mt-1.5 flex items-start gap-2">
      <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={2} className="w-full resize-none rounded border border-input bg-background px-2 py-1 text-xs outline-none focus:border-primary" />
      <button
        onClick={() => {
          demoRepo.updateResearchBookmarkNote(bookmarkId, value);
          toast({ title: 'Not güncellendi.' });
          setEditing(false);
        }}
        className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground"
      >
        Kaydet
      </button>
    </div>
  );
}

function Fact({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'warning' | 'danger' }) {
  return (
    <div className={`px-3 py-2.5 ${tone === 'danger' ? 'bg-red-50/70 dark:bg-red-950/20' : tone === 'warning' ? 'bg-amber-50/60 dark:bg-amber-950/20' : 'bg-card'}`}>
      <p className={`text-[9px] font-semibold uppercase tracking-wider ${tone === 'danger' ? 'text-red-700 dark:text-red-400' : tone === 'warning' ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'}`}>{label}</p>
      <p className="mt-1 truncate text-xs font-semibold">{value}</p>
    </div>
  );
}

function HeaderBtn({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 text-[11px] font-medium hover:bg-muted">
      {icon}{children}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Section({ children, onAdd, addLabel, empty }: { children: React.ReactNode; onAdd?: () => void; addLabel?: string; empty?: string }) {
  return (
    <div>
      {onAdd && (
        <div className="mb-3 flex justify-end">
          <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            <Plus size={14} /> {addLabel}
          </button>
        </div>
      )}
      {empty ? <Empty text={empty} action={onAdd && addLabel ? { label: addLabel, onClick: onAdd } : undefined} /> : children}
    </div>
  );
}

function Empty({ text, action }: { text: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center">
      <p className="text-sm font-medium">{text}</p>
      {action && (
        <button onClick={action.onClick} className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={14} /> {action.label}
        </button>
      )}
    </div>
  );
}

function RowIcon({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
      {children}
    </button>
  );
}

function RiskAction({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="rounded-md border border-border px-2 py-1 text-[11px] font-medium hover:bg-muted">
      {children}
    </button>
  );
}

function MiniList({ title, tone, items }: { title: string; tone: 'emerald' | 'amber' | 'red' | 'neutral'; items: string[] }) {
  if (!items.length) return null;
  const dot = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500', neutral: 'bg-muted-foreground/50' }[tone];
  return (
    <div>
      <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2 text-[11px] text-muted-foreground">
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${dot}`} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EvidenceCol({ title, tone, items }: { title: string; tone: 'emerald' | 'red'; items: string[] }) {
  const cls = {
    emerald: 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300',
    red: 'border-red-200 bg-red-50/50 text-red-800 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300',
  }[tone];
  return (
    <div className={`rounded border p-3 ${cls}`}>
      <p className="mb-1 text-[10px] font-semibold uppercase">{title} Delil</p>
      {items.length ? <ul className="space-y-1">{items.map((s, i) => <li key={i} className="text-[11px]">· {s}</li>)}</ul> : <p className="text-[11px] opacity-70">—</p>}
    </div>
  );
}
