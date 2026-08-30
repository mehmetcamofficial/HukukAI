import { Link } from 'wouter';
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FileText,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  useGetActivity,
  useGetDashboard,
  useHealthCheck,
} from '@workspace/api-client-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';

const fallbackDashboard = {
  activeCases: 2,
  upcomingHearings: 1,
  upcomingDeadlines: 1,
  documentsThisMonth: 10,
  closedCases: 2,
  alerts: [
    { id: 'alert-1', title: 'Bilirkişi raporuna itiraz süresi', detail: '2026/145 — 02.09.2026 tarihine kadar itiraz dilekçesi sunulmalıdır', severity: 'HIGH', dueDate: '2026-09-02' },
    { id: 'alert-2', title: 'Duruşma hazırlığı', detail: '2026/145 — 20.01.2027 saat 10:00, Kurgu 14. İş Mahkemesi', severity: 'MEDIUM', dueDate: '2027-01-20' },
  ],
  recentDocuments: [
    { id: 'doc-010', filename: 'Bilirkişi_Raporu_2026_145.pdf', category: 'Bilirkişi Raporu', sizeLabel: '4.2 MB', verificationStatus: 'DEMO — KURGUSAL DAVA VERİSİ' },
    { id: 'doc-009', filename: 'Durusma_Tutancagi_14_09_2026.pdf', category: 'Duruşma Tutanağı', sizeLabel: '0.6 MB', verificationStatus: 'DEMO — KURGUSAL DAVA VERİSİ' },
    { id: 'doc-006', filename: 'WhatsApp_Yazismasi_Dokumu.pdf', category: 'İletişim Kaydı', sizeLabel: '3.5 MB', verificationStatus: 'DOĞRULANAMADI' },
  ],
  recentResearch: [
    { id: 'research-001', query: 'Fazla mesai ispat yükü', result: 'Fazla çalışmada ispat yükü işçidedir. Ancak işverenin tutmakla yükümlü olduğu kayıt ve belgelerin işverende olması nedeniyle, işveren bu kayıtları sunmak zorundadır.', confidence: 'YÜKSEK', demo: true },
    { id: 'research-002', query: 'Bilirkişi raporuna itiraz usulü', result: 'Bilirkişi raporuna karşı taraflar yazılı olarak itiraz edebilir. Mahkeme, itirazları değerlendirerek raporu kabul veya reddedebilir.', confidence: 'YÜKSEK', demo: true },
  ],
};

const fallbackActivity = [
  { id: 'act-001', action: 'Belge eklendi', detail: 'Bilirkişi_Raporu_2026_145.pdf — 2026/145', createdAt: '2026-08-27', actor: 'Av. Behçet Alp' },
  { id: 'act-002', action: 'Duruşma notu', detail: '14.09.2026 tarihli duruşma tutanağı eklendi', createdAt: '2026-08-26', actor: 'Ekip Avukatı' },
  { id: 'act-003', action: 'Duruşma eklendi', detail: 'Sonraki duruşma: 20.01.2027 — Kurgu 14. İş Mahkemesi', createdAt: '2026-08-25', actor: 'Sistem' },
];

function isValidDashboard(d: unknown): d is typeof fallbackDashboard {
  return !!d && typeof d === 'object' && 'alerts' in (d as Record<string, unknown>) && Array.isArray((d as Record<string, unknown>).alerts);
}

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '—';

const stats = [
  { key: 'activeCases', label: 'Aktif Dava', icon: BriefcaseBusiness, color: 'text-primary' },
  { key: 'upcomingHearings', label: 'Duruşma', icon: CalendarDays, color: 'text-amber-600' },
  { key: 'upcomingDeadlines', label: 'Süre', icon: Clock3, color: 'text-red-600' },
  { key: 'documentsThisMonth', label: 'Belge', icon: FileText, color: 'text-muted-foreground' },
  { key: 'closedCases', label: 'Kapanan', icon: CheckCircle2, color: 'text-emerald-600' },
] as const;

export function DashboardPage() {
  const dashboardQuery = useGetDashboard();
  const activityQuery = useGetActivity();
  const healthQuery = useHealthCheck();
  const rawDashboard = dashboardQuery.data as unknown;
  const dashboard = isValidDashboard(rawDashboard) ? rawDashboard : fallbackDashboard;
  const activity = Array.isArray(activityQuery.data) ? activityQuery.data : fallbackActivity;
  const isDemoMode = !isValidDashboard(rawDashboard) || dashboardQuery.isError || healthQuery.isError;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Genel Bakış"
        description="Hoş geldiniz, Av. Behçet Alp · Dosyalarınızın durumu ve öncelikler."
      />

      {isDemoMode && (
        <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70" data-testid="status-health">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Demo Modu · Kurgusal dava verisi + doğrulanmış kamu kaynakları
        </div>
      )}

      {dashboardQuery.isLoading ? (
        <div className="space-y-4" data-testid="status-loading">
          <div className="h-10 w-48 shimmer rounded-md" />
          <div className="grid gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 shimmer rounded-md" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aktif Dosyalar</h2><Link href="/davalar" className="text-xs font-semibold text-primary hover:underline">Tüm davalar</Link></div>
          <Link
            href="/davalar/case-2026-145"
            className="mb-5 block rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/50"
            data-testid="card-primary-case"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge tone="success">Aktif</StatusBadge>
                  <span className="mono text-[11px] text-muted-foreground">2026/145</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-[11px] text-muted-foreground">İş Hukuku</span>
                </div>
                <h2 className="text-base font-semibold">İşçilik Alacağı</h2>
                <p className="mt-1 text-sm text-muted-foreground">Kurgu 14. İş Mahkemesi · Müvekkil: Deniz Aras</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><CalendarDays size={12} /> Duruşma: 20.01.2027</span>
                  <span className="flex items-center gap-1.5"><Clock3 size={12} /> Süre: 02.09.2026</span>
                  <span className="flex items-center gap-1.5"><FileText size={12} /> 10 belge</span>
                </div>
              </div>
              <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                Dosyayı Aç <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          <div className="grid gap-2 sm:grid-cols-5">
            {stats.map(({ key, label, icon: Icon, color }) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3"
                data-testid={`card-stat-${label}`}
              >
                <Icon size={16} className={color} />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold leading-tight">{dashboard[key]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
            <section className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <h2 className="text-sm font-semibold">Öncelikli Görevler</h2>
                <Link href="/takvim" className="text-xs text-primary hover:underline">
                  Takvim
                </Link>
              </div>
              <div>
                {dashboard.alerts.map((alert, index) => (
                  <Link
                    href="/davalar/case-2026-145"
                    key={alert.id}
                    className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/50"
                  >
                    <AlertTriangle
                      size={14}
                      className={index === 0 ? 'text-red-500' : 'text-amber-500'}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <StatusBadge tone={index === 0 ? 'danger' : 'warning'}>
                          {alert.severity === 'HIGH' ? 'Yüksek' : 'Orta'}
                        </StatusBadge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{alert.detail}</p>
                    </div>
                    <span className="mono shrink-0 text-[11px] text-muted-foreground">
                      {formatDate(alert.dueDate)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <h2 className="text-sm font-semibold">Son Hareketler</h2>
              </div>
              <div className="divide-y divide-border">
                {activity.slice(0, 4).map((event) => (
                  <div key={event.id} className="px-4 py-3">
                    <p className="text-sm font-medium">{event.action}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{event.detail}</p>
                    <p className="mono mt-1 text-[10px] text-muted-foreground/70">
                      {event.actor} · {event.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <h2 className="text-sm font-semibold">Son Belgeler</h2>
                <Link href="/belgeler" className="text-xs text-primary hover:underline">
                  Tümünü gör
                </Link>
              </div>
              <div className="divide-y divide-border">
                {dashboard.recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 px-4 py-3">
                    <FileText size={14} className="text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{doc.filename}</p>
                      <p className="mono text-[11px] text-muted-foreground">
                        {doc.category} · {doc.sizeLabel}
                      </p>
                    </div>
                    <StatusBadge tone="neutral">{doc.verificationStatus}</StatusBadge>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <h2 className="text-sm font-semibold">Son Araştırmalar</h2>
                <Link href="/hukuki-arastirma" className="text-xs text-primary hover:underline">
                  Tümünü gör
                </Link>
              </div>
              <div className="divide-y divide-border">
                {dashboard.recentResearch.map((item) => (
                  <Link
                    href="/hukuki-arastirma"
                    key={item.id}
                    className="block px-4 py-3 hover:bg-muted/50"
                  >
                    <p className="text-sm font-medium">{item.query}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {item.result}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
