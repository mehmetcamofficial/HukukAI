import { useState, type ReactNode } from "react";
import {
  getGetCaseAnalysisQueryKey,
  getGetCaseDocumentsQueryKey,
  getGetCaseQueryKey,
  getGetCaseTimelineQueryKey,
  getGetCasesQueryKey,
  getGetClientsQueryKey,
  getGetResearchQueryKey,
  useCreateCase,
  useCreateCaseAnalysis,
  useCreateClient,
  useCreateDocument,
  useCreateResearch,
  useCreateTimelineEvent,
  useGetActivity,
  useGetCase,
  useGetCaseAnalysis,
  useGetCaseDocuments,
  useGetCaseTimeline,
  useGetCases,
  useGetClients,
  useGetDashboard,
  useGetResearch,
  useHealthCheck,
  useUpdateCase,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileCheck2,
  FilePlus2,
  FileText,
  Filter,
  FolderOpen,
  Info,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

const fallbackCases = [
  {
    id: "case-2026-145",
    title: "İşçilik Alacağı",
    caseNumber: "2026/145",
    court: "İstanbul 14. İş Mahkemesi",
    chamber: "—",
    category: "İş Hukuku",
    clientName: "Deniz Aras",
    opposingParty: "Marmara Lojistik A.Ş.",
    status: "ACTIVE",
    filingDate: "2026-02-18",
    nextHearing: "2026-09-14",
    nextDeadline: "2026-09-02",
    updatedAt: "2026-08-27",
    summary: "Fazla çalışma ve yıllık izin ücretlerinin tahsili talebi.",
    tags: ["İşçilik alacağı", "Bilirkişi"],
    documentCount: 6,
  },
];

const fallbackDocs = [
  {
    id: "doc-demo",
    filename: "Bilirkişi_Raporu_01.pdf",
    category: "Bilirkişi Raporu",
    type: "PDF",
    uploadedAt: "26 Ağu 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO VERİ",
    sizeLabel: "2.4 MB",
    excerpt: "Kurgusal hesap tablosu ve inceleme notları.",
  },
];

const fallbackAnalysis = {
  id: "analysis-demo",
  caseId: "case-2026-145",
  generatedAt: "28 Ağustos 2026, 09:42",
  status: "AVUKAT İNCELEMESİNDE",
  dispute: "Fazla çalışma ve kullanılmayan yıllık izin ücretlerinin tahsili.",
  claims: ["Fazla çalışma karşılığının ödenmediği ileri sürülüyor.", "Yıllık izin ücretinin fesihte ödenmediği iddia ediliyor."],
  defenses: ["Çalışma saatlerinin bordrolarla sınırlı olduğu savunulabilir.", "Fesih tarihine ilişkin taraf anlatımları farklı görünüyor."],
  strengths: ["Mesaj kayıtları kronolojiyi destekleyebilir.", "Bilirkişi raporu hesaplamayı görünür hale getiriyor."],
  weaknesses: ["Giriş-çıkış kayıtlarının tam dönemi görünmüyor.", "Bordro imzaları ayrıca doğrulanmalı."],
  missingEvidence: ["İşyeri giriş-çıkış kayıtları", "Yıllık izin formları", "Tanık bilgilerinin teyidi"],
  risks: ["Tarihlere ilişkin çelişki var. Kaynak doğrulanamadı.", "Süre hesabı avukat tarafından ayrıca kontrol edilmelidir."],
  sources: [],
  disclaimer: "Bu analiz demo verisiyle oluşturulmuştur. Hukuki görüş yerine geçmez; avukat kontrolü gerektirir.",
};

const fallbackTimeline = [
  { id: "event-1", date: "12.01.2025", title: "İş sözleşmesi imzalandı", description: "Kurgusal iş sözleşmesi başlangıç tarihi.", sourceStatus: "DEMO VERİ", editable: true },
  { id: "event-2", date: "24.03.2025", title: "İhtar gönderildi", description: "Fazla çalışma kayıtlarının talep edildiği kurgusal ihtar.", sourceStatus: "DEMO VERİ", editable: true },
  { id: "event-3", date: "18.04.2025", title: "İş ilişkisi sona erdi", description: "Taraf beyanlarından çıkarılan olay.", sourceStatus: "DOĞRULANAMADI", editable: true },
];

const fallbackDashboard = {
  activeCases: 3,
  upcomingHearings: 2,
  upcomingDeadlines: 1,
  documentsThisMonth: 6,
  closedCases: 1,
  alerts: [
    { id: "alert-1", title: "Bilirkişi raporuna itiraz", detail: "2026/145 — cevap süresi", severity: "HIGH", dueDate: "2026-09-02" },
    { id: "alert-2", title: "Duruşma hazırlığı", detail: "2026/145 — 14. İş Mahkemesi", severity: "MEDIUM", dueDate: "2026-09-14" },
  ],
  recentDocuments: fallbackDocs,
  recentResearch: [
    {
      id: "research-demo-1",
      query: "Fazla çalışma ispatında elektronik yazışmalar",
      issue: "Fazla çalışma ispatı",
      createdAt: "2026-08-27",
      confidence: "DEMO VERİ",
      result: "Kurgusal ön inceleme — kaynak doğrulaması gerektirir.",
      sources: [],
      demo: true,
    },
  ],
};

const fallbackActivity = [
  { id: "act-1", action: "Belge eklendi", detail: "Bilirkişi_Raporu_01.pdf — 2026/145", createdAt: "2026-08-27", actor: "Av. Ayşe Yılmaz" },
  { id: "act-2", action: "Duruşma notu", detail: "Tahkikat zaptı özeti eklendi", createdAt: "2026-08-26", actor: "Av. Ayşe Yılmaz" },
];

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value))
    : "Belirlenmedi";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-lg ${className}`} />;
}

function LoadingBlock() {
  return (
    <div className="space-y-5" data-testid="status-loading">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}

function ErrorState({ onRetry, label = "Veriler yüklenemedi" }: { onRetry?: () => void; label?: string }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.06)] p-8 text-center" data-testid="status-error">
      <ShieldAlert className="mx-auto mb-3 text-[hsl(var(--destructive))]" size={25} />
      <p className="font-bold">{label}</p>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Bağlantınızı kontrol edin veya daha sonra tekrar deneyin.</p>
      {onRetry ? <button onClick={onRetry} className="mt-4 rounded-lg bg-[hsl(var(--destructive))] px-4 py-2 text-xs font-bold text-white" data-testid="button-retry">Tekrar dene</button> : null}
    </div>
  );
}

function EmptyState({ icon: Icon = FolderOpen, title, detail, action }: { icon?: typeof FolderOpen; title: string; detail: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/.65)] p-8 text-center" data-testid="status-empty">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"><Icon size={21} /></span>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">{detail}</p>
      {action}
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow mb-2 text-[hsl(var(--primary))]">{eyebrow}</p>
        <h1 className="serif text-[clamp(2rem,4vw,3.1rem)] leading-[.95] tracking-[-.045em]">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function StatusChip({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "amber" | "red" | "slate" }) {
  const colors = {
    green: "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]",
    amber: "bg-[hsl(var(--accent)/.16)] text-[hsl(29_65%_39%)]",
    red: "bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]",
    slate: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${colors[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}

function Button({ children, variant = "primary", onClick, type = "button", disabled = false, testId }: { children: ReactNode; variant?: "primary" | "outline" | "quiet"; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; testId: string }) {
  const style = variant === "primary"
    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_6px_14px_hsl(var(--primary)/.18)] hover:-translate-y-0.5"
    : variant === "outline"
      ? "border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/.45)] hover:bg-[hsl(var(--primary)/.06)]"
      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]";
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-extrabold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${style}`}>{children}</button>;
}

function Modal({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(var(--foreground)/.35)] p-0 backdrop-blur-sm sm:items-center sm:p-5" data-testid="dialog-modal">
      <div className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-2xl sm:rounded-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between">
          <div><p className="eyebrow mb-1 text-[hsl(var(--primary))]">{eyebrow}</p><h2 className="serif text-2xl tracking-[-.03em]">{title}</h2></div>
          <button onClick={onClose} className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><X size={17} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, required = false, textarea = false }: { label: string; name: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold">{label}{required ? <span className="ml-1 text-[hsl(var(--primary))]">*</span> : null}</span>
      {textarea
        ? <textarea name={name} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} data-testid={`input-${name}`} className="w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background)/.65)] px-3 py-2.5 text-sm outline-none focus:border-[hsl(var(--primary))]" />
        : <input name={name} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} data-testid={`input-${name}`} className="h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background)/.65)] px-3 text-sm outline-none focus:border-[hsl(var(--primary))]" />}
    </label>
  );
}

export function DashboardPage() {
  const dashboardQuery = useGetDashboard();
  const activityQuery = useGetActivity();
  const healthQuery = useHealthCheck();
  const rawDashboard = dashboardQuery.data as unknown;
  const isValidDashboard = (d: unknown): d is typeof fallbackDashboard =>
    !!d && typeof d === "object" && "alerts" in (d as Record<string, unknown>) && Array.isArray((d as Record<string, unknown>).alerts);
  const dashboard = isValidDashboard(rawDashboard) ? rawDashboard : fallbackDashboard;
  const activity = Array.isArray(activityQuery.data) ? activityQuery.data : fallbackActivity;
  const isDemoMode = !isValidDashboard(rawDashboard) || dashboardQuery.isError || healthQuery.isError;
  return (
    <div className="mx-auto max-w-[1480px]">
      <PageHeader eyebrow="Çalışma alanı" title={<>Günün <em className="not-italic text-[hsl(var(--primary))]">hukuk</em> masası.</>} description="Dosyalarınızın nabzı, bugünün öncelikleri ve kaynak durumu tek bakışta." action={<div className="flex gap-2"><Link href="/arsiv" className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-3.5 py-2.5 text-xs font-extrabold"><Search size={15} />Arşivde ara</Link><Link href="/davalar" className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-3.5 py-2.5 text-xs font-extrabold text-[hsl(var(--primary-foreground))]"><Plus size={15} />Yeni dava</Link></div>} />
      {isDemoMode ? (
        <div className="mb-5 flex items-center gap-2 text-[10px] text-[hsl(var(--muted-foreground))]" data-testid="status-health">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          Demo modu · API bağlı değil — DEMO VERİ gösteriliyor
        </div>
      ) : healthQuery.data ? (
        <div className="mb-5 flex items-center gap-2 text-[10px] text-[hsl(var(--muted-foreground))]" data-testid="status-health">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />Güvenli çalışma alanı senkronize · {healthQuery.data.status}
        </div>
      ) : null}
      {dashboardQuery.isLoading ? <LoadingBlock /> : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {([
              ["Aktif dava", dashboard.activeCases, BriefcaseBusiness, "Takipteki dosyalar"],
              ["Yaklaşan duruşma", dashboard.upcomingHearings, CalendarDays, "Önümüzdeki 30 gün"],
              ["Yaklaşan süre", dashboard.upcomingDeadlines, Clock3, "Aksiyon bekliyor"],
              ["Bu ay belge", dashboard.documentsThisMonth, FileText, "Arşive eklenen"],
              ["Kapanan dava", dashboard.closedCases, CheckCircle2, "Toplam kapanan"],
            ] as Array<[string, number, LucideIcon, string]>).map(([label, value, Icon, detail]) => (
              <div key={String(label)} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.78)] p-4 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5" data-testid={`card-stat-${label}`}>
                <div className="mb-4 flex items-start justify-between"><span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">{label}</span><span className="rounded-lg bg-[hsl(var(--primary)/.1)] p-2 text-[hsl(var(--primary))]"><Icon size={15} /></span></div>
                <div className="mono text-2xl font-medium tracking-[-.06em]">{value}</div><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{detail}</p>
              </div>
            ))}
          </section>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
            <section className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.78)]">
              <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-4"><div><p className="eyebrow text-[hsl(var(--primary))]">Öncelik sırası</p><h2 className="mt-1 text-base font-extrabold">Bugün bakılması gerekenler</h2></div><Link href="/takvim" className="text-xs font-bold text-[hsl(var(--primary))]">Takvimi aç <ArrowRight className="ml-1 inline" size={13} /></Link></div>
              <div className="divide-y divide-[hsl(var(--border))]">{dashboard.alerts.map((alert, index) => <Link href="/davalar/case-2026-145" key={alert.id} className="group flex items-center gap-4 px-5 py-4 hover:bg-[hsl(var(--muted)/.45)]"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${index === 0 ? "bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]" : "bg-[hsl(var(--accent)/.15)] text-[hsl(29_65%_39%)]"}`}><AlertTriangle size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold">{alert.title}</p><StatusChip tone={index === 0 ? "red" : "amber"}>{index === 0 ? "Yüksek" : "Orta"}</StatusChip></div><p className="mt-1 truncate text-xs text-[hsl(var(--muted-foreground))]">{alert.detail}</p></div><span className="mono shrink-0 text-[10px] text-[hsl(var(--muted-foreground))]">{alert.dueDate}</span><ArrowRight size={15} /></Link>)}</div>
            </section>
            <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.78)] p-5"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">Akış</p><h2 className="mt-1 text-base font-extrabold">Son hareketler</h2></div><MoreHorizontal size={16} className="text-[hsl(var(--muted-foreground))]" /></div><div className="space-y-5">{activity.slice(0, 4).map((event, index) => <div key={event.id} className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${index === 0 ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--accent))]"}`} /><div><p className="text-xs font-bold">{event.action}</p><p className="mt-1 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">{event.detail}</p><p className="mono mt-1 text-[9px] text-[hsl(var(--muted-foreground)/.65)]">{event.actor} · {event.createdAt}</p></div></div>)}</div></section>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.78)] p-5"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">Hukuki hafıza</p><h2 className="mt-1 text-base font-extrabold">Son araştırmalar</h2></div><Link href="/hukuki-arastirma" className="text-xs font-bold text-[hsl(var(--primary))]">Tümünü gör</Link></div>{dashboard.recentResearch.map((item) => <Link href="/hukuki-arastirma" key={item.id} className="mb-2 block rounded-xl border border-[hsl(var(--border))] p-3 hover:border-[hsl(var(--primary)/.4)]"><div className="flex items-start gap-3"><BookOpen size={16} className="mt-0.5 text-[hsl(var(--primary))]" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{item.query}</p><p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">{item.result}</p></div><StatusChip tone="amber">{item.confidence}</StatusChip></div></Link>)}</section>
            <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.78)] p-5"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">Arşiv</p><h2 className="mt-1 text-base font-extrabold">Son belgeler</h2></div><Link href="/belgeler" className="text-xs font-bold text-[hsl(var(--primary))]">Arşivi aç</Link></div>{dashboard.recentDocuments.map((doc) => <div key={doc.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--accent)/.14)] text-[hsl(29_65%_39%)]"><FileText size={15} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{doc.filename}</p><p className="mono mt-1 text-[9px] text-[hsl(var(--muted-foreground))]">{doc.category} · {doc.sizeLabel}</p></div><StatusChip tone="amber">{doc.verificationStatus}</StatusChip></div>)}</section>
          </div>
        </>
      )}
    </div>
  );
}

export function CasesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", caseNumber: "", court: "", category: "İş Hukuku", clientName: "", opposingParty: "", summary: "" });
  const queryClient = useQueryClient();
  const casesQuery = useGetCases({ search: search || undefined, status: status || undefined });
  const createCase = useCreateCase();
  const cases = casesQuery.data ?? fallbackCases;
  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    createCase.mutate({ data: form }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetCasesQueryKey() }); setShowModal(false); }, onError: () => window.alert("Dava oluşturulamadı.") });
  };
  return (
    <div className="mx-auto max-w-[1480px]">
      <PageHeader eyebrow="Dosya yönetimi" title="Davalar" description="Aktif dosyalarınızı, kritik tarihleri ve dava riskini tek bir çalışma ekranında yönetin." action={<Button onClick={() => setShowModal(true)} testId="button-new-case"><Plus size={15} />Yeni dava</Button>} />
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.72)] p-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-search-cases" placeholder="Dosya, müvekkil veya karşı taraf ara" className="h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-transparent pl-9 pr-3 text-sm outline-none focus:border-[hsl(var(--primary))]" /></label><div className="flex gap-2"><select value={status} onChange={(event) => setStatus(event.target.value)} data-testid="select-case-status" className="h-10 rounded-lg border border-[hsl(var(--input))] bg-transparent px-3 text-xs font-semibold outline-none"><option value="">Tüm durumlar</option><option value="ACTIVE">Aktif</option><option value="WAITING">Bekliyor</option><option value="APPEAL">İstinaf</option></select><Button variant="outline" testId="button-case-filter"><Filter size={15} />Filtrele</Button></div></div>
      {casesQuery.isLoading ? <LoadingBlock /> : casesQuery.isError && !casesQuery.data ? <ErrorState onRetry={() => casesQuery.refetch()} /> : <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)]"><div className="hidden grid-cols-[1.7fr_1.1fr_1fr_.8fr_1fr] gap-4 border-b border-[hsl(var(--border))] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))] lg:grid"><span>Dava / müvekkil</span><span>Mahkeme</span><span>Karşı taraf</span><span>Durum</span><span>Sonraki adım</span></div>{cases.map((item) => <Link href={`/davalar/${item.id}`} key={item.id} className="group grid gap-3 border-b border-[hsl(var(--border))] px-5 py-4 last:border-0 hover:bg-[hsl(var(--muted)/.42)] lg:grid-cols-[1.7fr_1.1fr_1fr_.8fr_1fr] lg:items-center"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"><BriefcaseBusiness size={16} /></span><div className="min-w-0"><p className="truncate text-sm font-extrabold">{item.title}</p><p className="mono mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{item.caseNumber} · {item.clientName}</p></div></div><div className="ml-12 text-xs text-[hsl(var(--muted-foreground))] lg:ml-0">{item.court}<p className="mono mt-1 text-[9px] opacity-70">{item.category}</p></div><div className="ml-12 text-xs lg:ml-0">{item.opposingParty}</div><div className="ml-12 lg:ml-0"><StatusChip tone={item.status === "ACTIVE" ? "green" : "amber"}>{item.status}</StatusChip></div><div className="ml-12 flex items-center justify-between gap-2 text-xs lg:ml-0"><span><span className="block text-[10px] text-[hsl(var(--muted-foreground))]">Duruşma</span><span className="mono">{formatDate(item.nextHearing)}</span></span><ArrowRight size={15} /></div></Link>)}</div>}
      {showModal ? <Modal title="Yeni dava kaydı" eyebrow="Dosya aç" onClose={() => setShowModal(false)}><form onSubmit={submit} className="space-y-4"><Field label="Dava başlığı" name="case-title" value={form.title} onChange={(value) => setField("title", value)} placeholder="İşçilik alacağı" required /><div className="grid gap-4 sm:grid-cols-2"><Field label="Esas numarası" name="case-number" value={form.caseNumber} onChange={(value) => setField("caseNumber", value)} placeholder="2026/___" required /><Field label="Kategori" name="case-category" value={form.category} onChange={(value) => setField("category", value)} placeholder="İş Hukuku" required /></div><Field label="Mahkeme" name="case-court" value={form.court} onChange={(value) => setField("court", value)} placeholder="İstanbul 14. İş Mahkemesi" required /><div className="grid gap-4 sm:grid-cols-2"><Field label="Müvekkil" name="case-client" value={form.clientName} onChange={(value) => setField("clientName", value)} required /><Field label="Karşı taraf" name="case-opposing" value={form.opposingParty} onChange={(value) => setField("opposingParty", value)} required /></div><Field label="Kısa özet" name="case-summary" value={form.summary} onChange={(value) => setField("summary", value)} textarea /><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowModal(false)} testId="button-cancel-case">Vazgeç</Button><Button type="submit" disabled={createCase.isPending} testId="button-submit-case">{createCase.isPending ? <LoaderCircle size={15} className="animate-spin" /> : <Plus size={15} />}Dosyayı oluştur</Button></div></form></Modal> : null}
    </div>
  );
}

export function ClientsPage() {
  const clientsQuery = useGetClients();
  const createClient = useCreateClient();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "INDIVIDUAL", email: "", phone: "" });
  const clients = clientsQuery.data ?? [];
  const visible = clients.filter((client) => client.name.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR")));
  const submit = (event: { preventDefault: () => void }) => { event.preventDefault(); createClient.mutate({ data: form }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetClientsQueryKey() }); setShowModal(false); }, onError: () => window.alert("Müvekkil kaydedilemedi.") }); };
  return <div className="mx-auto max-w-[1480px]"><PageHeader eyebrow="İlişki yönetimi" title="Müvekkiller" description="Kişi ve kurum kayıtlarını, dosya bağlarını ve iletişim hafızasını düzenli tutun." action={<Button onClick={() => setShowModal(true)} testId="button-new-client"><Plus size={15} />Yeni müvekkil</Button>} /><div className="mb-5 flex items-center gap-3"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-search-clients" placeholder="İsim ara" className="h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card)/.75)] pl-9 pr-3 text-sm outline-none" /></div><span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">{visible.length} kayıt</span></div>{clientsQuery.isLoading ? <LoadingBlock /> : visible.length === 0 ? <EmptyState icon={Users} title="Henüz müvekkil yok" detail="İlk müvekkil kaydınızı ekleyerek dosyalarınızı ilişkilendirin." action={<Button onClick={() => setShowModal(true)} testId="button-empty-new-client"><Plus size={15} />Müvekkil ekle</Button>} /> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((client) => <div key={client.id} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5" data-testid={`card-client-${client.id}`}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[hsl(var(--accent)/.18)] text-xs font-extrabold text-[hsl(29_65%_39%)]">{client.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div><p className="text-sm font-extrabold">{client.name}</p><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{client.type}</p></div></div><div className="mt-5 space-y-2 border-t border-[hsl(var(--border))] pt-4 text-xs"><p className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">E-posta</span><span>{client.email || "—"}</span></p><p className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Telefon</span><span className="mono">{client.phone || "—"}</span></p><p className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Bağlı dosya</span><span className="font-extrabold text-[hsl(var(--primary))]">{client.caseCount}</span></p></div></div>)}</div>}{showModal ? <Modal title="Yeni müvekkil" eyebrow="Kayıt oluştur" onClose={() => setShowModal(false)}><form onSubmit={submit} className="space-y-4"><Field label="Ad / unvan" name="client-name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required /><Field label="E-posta" name="client-email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} /><Field label="Telefon" name="client-phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} /><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowModal(false)} testId="button-cancel-client">Vazgeç</Button><Button type="submit" disabled={createClient.isPending} testId="button-submit-client"><Check size={15} />Kaydet</Button></div></form></Modal> : null}</div>;
}

export function DocumentsPage() {
  const dashboardQuery = useGetDashboard();
  const [search, setSearch] = useState("");
  const docs = dashboardQuery.data?.recentDocuments ?? fallbackDocs;
  const visible = docs.filter((doc) => doc.filename.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR")));
  return <div className="mx-auto max-w-[1480px]"><PageHeader eyebrow="Kaynak arşivi" title="Belgeler" description="Dosya belgeleri, metin işleme durumu ve kaynak doğrulama zinciri." action={<Button testId="button-upload-document" onClick={() => window.alert("Belge kaydı için ilgili dosya çalışma alanını açın.")}><UploadCloud size={15} />Belge yükle</Button>} /><div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-search-documents" placeholder="Belge adı veya içerik ara" className="h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card)/.75)] pl-9 text-sm outline-none" /></div><Button variant="outline" testId="button-document-filter"><SlidersHorizontal size={15} />Filtreler</Button></div><div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)]"><div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/.4)] px-5 py-3"><p className="text-xs font-bold">{visible.length} belge <span className="font-normal text-[hsl(var(--muted-foreground))]">· demo arşivi</span></p></div>{visible.map((doc) => <div key={doc.id} className="flex flex-col gap-3 border-b border-[hsl(var(--border))] px-5 py-4 last:border-0 sm:flex-row sm:items-center"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--accent)/.14)] text-[hsl(29_65%_39%)]"><FileText size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{doc.filename}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{doc.excerpt ?? "Belge metni işleniyor."}</p></div><div className="flex items-center gap-4"><div><p className="text-[10px] font-bold">{doc.category}</p><p className="mono mt-1 text-[9px] text-[hsl(var(--muted-foreground))]">{doc.sizeLabel}</p></div><StatusChip tone="amber">{doc.verificationStatus}</StatusChip><button className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" data-testid={`button-download-document-${doc.id}`}><Download size={15} /></button></div></div>)}</div><div className="mt-4 flex items-center gap-2 rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.06)] p-3 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]"><Info size={15} className="text-[hsl(var(--primary))]" />Doğrulanmamış içerik hukuki görüş olarak kullanılmamalıdır.</div></div>;
}

function ResearchPage({ mode }: { mode: "research" | "precedent" | "legislation" }) {
  const researchQuery = useGetResearch();
  const createResearch = useCreateResearch();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const items = researchQuery.data ?? [];
  const config = {
    research: ["Kaynağa dayalı yanıt", "Hukuki araştırma", "Sorunuzu yazın; yanıtı, dayanakları ve belirsizlikleri birlikte görün.", "Örn. Fazla çalışma ispatında elektronik yazışmalar"],
    precedent: ["Karar hafızası", "Emsal kararlar", "İçtihatları uyuşmazlığınızın ekseninde tarayın. Her sonuç kaynak statüsüyle birlikte gelir.", "Örn. Kira uyarlamasında emsal bedel nasıl belirlenir?"],
    legislation: ["Güncel metinler", "Mevzuat", "Kanun, yönetmelik ve madde bağlantılarını dosyanızın bağlamında inceleyin.", "Örn. TBK 138 aşırı ifa güçlüğü uygulaması"],
  }[mode];
  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (query.trim().length < 3) return;
    createResearch.mutate({ data: { query: query.trim() } }, { onSuccess: (result) => { queryClient.invalidateQueries({ queryKey: getGetResearchQueryKey() }); setQuery(""); setActive(result.id); } });
  };
  return <div className="mx-auto max-w-[1180px]"><PageHeader eyebrow={config[0]} title={config[1]} description={config[2]} /><section className="relative overflow-hidden rounded-2xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--sidebar))] p-5 text-[hsl(var(--sidebar-foreground))] shadow-[var(--shadow)] sm:p-7]"><div className="relative max-w-3xl"><div className="mb-4 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--sidebar-primary)/.16)] text-[hsl(var(--sidebar-primary))]"><Sparkles size={16} /></span><span className="eyebrow text-[hsl(var(--sidebar-primary))]">{config[0]}</span></div><form onSubmit={submit}><textarea value={query} onChange={(event) => setQuery(event.target.value)} data-testid="input-research-query" placeholder={config[3]} rows={3} className="w-full resize-none border-0 bg-transparent text-lg font-semibold leading-7 outline-none placeholder:text-[hsl(var(--sidebar-foreground)/.38)]" /><div className="mt-5 flex justify-end border-t border-[hsl(var(--sidebar-border))] pt-4]"><button type="submit" disabled={createResearch.isPending || query.trim().length < 3} data-testid="button-submit-research" className="inline-flex h-9 items-center gap-2 rounded-md bg-[hsl(var(--sidebar-primary))] px-3.5 text-xs font-extrabold text-[hsl(var(--sidebar-primary-foreground))] disabled:opacity-50">{createResearch.isPending ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}Araştır</button></div></form></div></section><div className="mb-4 mt-8 flex items-center justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">Çalışma geçmişi</p><h2 className="mt-1 text-lg font-extrabold">Son sorular</h2></div><span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">{items.length} kayıt</span></div>{researchQuery.isLoading ? <LoadingBlock /> : <div className="space-y-3">{items.map((item) => <div key={item.id} className={`rounded-2xl border bg-[hsl(var(--card)/.8)] p-5 ${active === item.id ? "border-[hsl(var(--primary)/.45)]" : "border-[hsl(var(--border))]"}`}><button onClick={() => setActive(active === item.id ? null : item.id)} className="flex w-full items-start gap-3 text-left" data-testid={`button-expand-research-${item.id}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"><BookOpen size={15} /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="text-sm font-extrabold">{item.query}</span><StatusChip tone="amber">{item.confidence}</StatusChip><span className="rounded-full bg-[hsl(var(--muted))] px-2 py-1 text-[9px] font-bold">Demo kaynak</span></span><span className="mt-1 block text-xs text-[hsl(var(--muted-foreground))]">{item.issue} · {item.createdAt}</span></span><ChevronDown size={17} className={active === item.id ? "rotate-180" : ""} /></button>{active === item.id ? <div className="ml-11 mt-4 border-t border-[hsl(var(--border))] pt-4"><p className="text-sm leading-7">{item.result}</p>{item.sources.map((source) => <div key={source.id} className="mt-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-3"><p className="text-[11px] font-extrabold">{source.name} · {source.status}</p><p className="mt-1 text-xs font-semibold">{source.title}</p><p className="mt-2 text-[10px] leading-5 text-[hsl(var(--muted-foreground))]">{source.excerpt}</p></div>)}<p className="mt-4 flex items-center gap-2 text-[10px] leading-5 text-[hsl(var(--muted-foreground))]"><AlertTriangle size={13} />Kaynak doğrulanamadı. Hukuki karar yerine geçmez.</p></div> : null}</div>)}</div>}</div>;
}

export function ResearchRoutePage() { return <ResearchPage mode="research" />; }
export function PrecedentPage() { return <ResearchPage mode="precedent" />; }
export function LegislationPage() { return <ResearchPage mode="legislation" />; }

function ReviewList({ title, items, tone = "green" }: { title: string; items: string[]; tone?: "green" | "red" }) {
  return <section className={`rounded-2xl border p-5 ${tone === "green" ? "border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.06)]" : "border-[hsl(var(--destructive)/.2)] bg-[hsl(var(--destructive)/.05)]"}`}><div className="flex items-center gap-2"><CheckCircle2 size={16} className={tone === "green" ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--destructive))]"} /><h3 className="text-xs font-extrabold">{title}</h3></div><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />{item}</li>)}</ul></section>;
}

export function CaseWorkspacePage() {
  const { caseId = "case-2026-145" } = useParams<{ caseId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const caseQuery = useGetCase(caseId);
  const docsQuery = useGetCaseDocuments(caseId);
  const analysisQuery = useGetCaseAnalysis(caseId);
  const timelineQuery = useGetCaseTimeline(caseId);
  const updateCase = useUpdateCase();
  const createDocument = useCreateDocument();
  const createAnalysis = useCreateCaseAnalysis();
  const createTimeline = useCreateTimelineEvent();
  const [tab, setTab] = useState<"overview" | "documents" | "timeline">("overview");
  const [showDoc, setShowDoc] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [docForm, setDocForm] = useState({ filename: "", category: "Dava Dilekçesi", type: "PDF", sizeLabel: "" });
  const [eventForm, setEventForm] = useState({ date: "", title: "", description: "" });
  const item = caseQuery.data ?? { ...fallbackCases[0], documents: [], timeline: [], analysis: fallbackAnalysis };
  const analysis = analysisQuery.data ?? fallbackAnalysis;
  const docs = docsQuery.data ?? fallbackDocs;
  const timeline = timelineQuery.data ?? fallbackTimeline;
  const save = () => updateCase.mutate({ caseId, data: { summary: item.summary } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCaseQueryKey(caseId) }) });
  const submitDoc = (event: { preventDefault: () => void }) => { event.preventDefault(); createDocument.mutate({ caseId, data: docForm }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetCaseDocumentsQueryKey(caseId) }); setShowDoc(false); } }); };
  const submitEvent = (event: { preventDefault: () => void }) => { event.preventDefault(); createTimeline.mutate({ caseId, data: eventForm }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetCaseTimelineQueryKey(caseId) }); setShowTimeline(false); } }); };
  return <div className="mx-auto max-w-[1480px]"><button onClick={() => setLocation("/davalar")} className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--muted-foreground))]" data-testid="button-back-cases"><ArrowLeft size={15} />Tüm davalar</button>{caseQuery.isLoading ? <LoadingBlock /> : <><div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><div className="mb-3 flex flex-wrap items-center gap-2"><StatusChip tone="amber">{item.status}</StatusChip><span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">{item.caseNumber}</span><span className="text-[10px] text-[hsl(var(--muted-foreground))]">·</span><span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">{item.category}</span></div><h1 className="serif text-[clamp(2rem,4vw,3.2rem)] leading-[.95] tracking-[-.05em]">{item.title}</h1><p className="mt-3 flex flex-wrap items-center gap-x-4 text-xs text-[hsl(var(--muted-foreground))]"><span>{item.court}</span><span>·</span><span>Müvekkil: <strong className="text-[hsl(var(--foreground))]">{item.clientName}</strong></span></p></div><div className="flex gap-2"><Button variant="outline" onClick={save} testId="button-save-case"><Check size={15} />Dosyayı güncelle</Button><Button onClick={() => createAnalysis.mutate({ caseId }, { onSuccess: (result) => queryClient.setQueryData(getGetCaseAnalysisQueryKey(caseId), result) })} disabled={createAnalysis.isPending} testId="button-generate-analysis"><Sparkles size={15} />Risk analizi üret</Button></div></div><div className="mb-5 flex gap-1 overflow-x-auto border-b border-[hsl(var(--border))]">{(["overview", "documents", "timeline"] as const).map((key) => <button key={key} onClick={() => setTab(key)} className={`whitespace-nowrap border-b-2 px-3 py-3 text-xs font-extrabold ${tab === key ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]" : "border-transparent text-[hsl(var(--muted-foreground))]"}`} data-testid={`tab-case-${key}`}>{key === "overview" ? "Risk özeti" : key === "documents" ? `Belgeler ${docs.length}` : "Dosya kronolojisi"}</button>)}</div>{tab === "overview" ? <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><div className="space-y-5"><section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5"><p className="eyebrow text-[hsl(var(--primary))]">Dosya okuması</p><h2 className="mt-1 text-base font-extrabold">Uyuşmazlık çerçevesi</h2><p className="mt-4 text-sm leading-7 text-[hsl(var(--foreground)/.78)]">{analysis.dispute}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><ReviewList title="İddialar" items={analysis.claims} /><ReviewList title="Savunmalar" items={analysis.defenses} tone="red" /></div></section><div className="grid gap-5 sm:grid-cols-2"><ReviewList title="Güçlü yanlar" items={analysis.strengths} /><ReviewList title="Zayıf noktalar" items={analysis.weaknesses} tone="red" /></div></div><aside className="space-y-5"><ReviewList title="Eksik delil" items={analysis.missingEvidence} tone="red" /><section className="rounded-2xl border border-[hsl(var(--destructive)/.22)] bg-[hsl(var(--card)/.8)] p-5"><div className="flex items-center gap-2"><ShieldAlert size={17} className="text-[hsl(var(--destructive))]" /><p className="text-xs font-extrabold">Risk alanları</p></div><ul className="mt-4 space-y-3">{analysis.risks.map((risk) => <li key={risk} className="text-xs leading-5 text-[hsl(var(--muted-foreground))]">{risk}</li>)}</ul></section><p className="flex gap-2 px-1 text-[10px] leading-5 text-[hsl(var(--muted-foreground))]"><Info size={14} />{analysis.disclaimer}</p></aside></div> : tab === "documents" ? <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)]"><div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-4"><div><p className="eyebrow text-[hsl(var(--primary))]">Dosya belgeleri</p><h2 className="mt-1 text-base font-extrabold">{docs.length} kaynak</h2></div><Button onClick={() => setShowDoc(true)} testId="button-add-case-document"><FilePlus2 size={15} />Belge kaydet</Button></div>{docs.map((doc) => <div key={doc.id} className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-5 py-4 last:border-0"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--accent)/.13)] text-[hsl(29_65%_39%)]"><FileText size={16} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{doc.filename}</p><p className="mono mt-1 text-[9px] text-[hsl(var(--muted-foreground))]">{doc.category} · {doc.sizeLabel}</p></div><StatusChip tone="amber">{doc.verificationStatus}</StatusChip></div>)}</section> : <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5"><div className="mb-6 flex items-center justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">Zaman çizgisi</p><h2 className="mt-1 text-base font-extrabold">Dosya kronolojisi</h2></div><Button onClick={() => setShowTimeline(true)} testId="button-add-timeline-event"><Plus size={15} />Olay ekle</Button></div><div className="relative ml-2 border-l border-[hsl(var(--border))] pl-7">{timeline.map((event) => <div className="relative mb-7 last:mb-0" key={event.id}><span className="absolute -left-[34px] top-1 h-5 w-5 rounded-full border-4 border-[hsl(var(--card))] bg-[hsl(var(--primary))]" /><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-extrabold">{event.title}</p><span className="mono text-[9px] text-[hsl(var(--muted-foreground))]">{formatDate(event.date)}</span><StatusChip tone="amber">{event.sourceStatus}</StatusChip></div><p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">{event.description}</p></div>)}</div></section>}</>}{showDoc ? <Modal title="Dosyaya belge kaydet" eyebrow="Yeni kaynak" onClose={() => setShowDoc(false)}><form onSubmit={submitDoc} className="space-y-4"><Field label="Dosya adı" name="document-filename" value={docForm.filename} onChange={(value) => setDocForm({ ...docForm, filename: value })} required /><Field label="Kategori" name="document-category" value={docForm.category} onChange={(value) => setDocForm({ ...docForm, category: value })} required /><Field label="Boyut" name="document-size" value={docForm.sizeLabel} onChange={(value) => setDocForm({ ...docForm, sizeLabel: value })} /><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowDoc(false)} testId="button-cancel-document">Vazgeç</Button><Button type="submit" testId="button-submit-document"><Check size={15} />Belgeyi kaydet</Button></div></form></Modal> : null}{showTimeline ? <Modal title="Kronolojiye olay ekle" eyebrow="Manuel kayıt" onClose={() => setShowTimeline(false)}><form onSubmit={submitEvent} className="space-y-4"><Field label="Tarih" name="timeline-date" value={eventForm.date} onChange={(value) => setEventForm({ ...eventForm, date: value })} placeholder="2026-09-01" required /><Field label="Başlık" name="timeline-title" value={eventForm.title} onChange={(value) => setEventForm({ ...eventForm, title: value })} required /><Field label="Açıklama" name="timeline-description" value={eventForm.description} onChange={(value) => setEventForm({ ...eventForm, description: value })} textarea /><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowTimeline(false)} testId="button-cancel-timeline">Vazgeç</Button><Button type="submit" testId="button-submit-timeline"><Plus size={15} />Olayı ekle</Button></div></form></Modal> : null}</div>;
}

function SimplePage({ eyebrow, title, description, icon: Icon = FolderOpen }: { eyebrow: string; title: string; description: string; icon?: typeof FolderOpen }) {
  return <div className="mx-auto max-w-[1180px]"><PageHeader eyebrow={eyebrow} title={title} description={description} /><div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.06)] p-5"><Icon className="text-[hsl(var(--primary))]" size={19} /><p className="mt-5 text-sm font-extrabold">Çalışma alanı hazır</p><p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Bu modül, doğrulanmış kaynak bağlantıları ve avukat onayıyla genişletilmeye hazır.</p></div><div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5 md:col-span-2"><p className="eyebrow text-[hsl(var(--primary))]">Güvenlik notu</p><h2 className="mt-2 text-base font-extrabold">Kaynak doğrulama zorunlu</h2><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Demo içerikler hukuki kaynak değildir. Doğrulanamayan her ifade `Kaynak doğrulanamadı.` olarak işaretlenir ve resmi belgeye dönüşmez.</p></div></div></div>;
}

export function DraftsPage() { return <SimplePage eyebrow="Belge üretimi" title="Dilekçeler" description="Dosyanın kaynaklarıyla çalışan, düzenlenebilir taslaklar hazırlayın." icon={FileText} />; }
export function CalendarPage() { return <SimplePage eyebrow="Zaman yönetimi" title="Takvim & Süreler" description="Duruşmalar ve kritik süreler dosya bağlamıyla birlikte." icon={CalendarDays} />; }
export function AssistantPage() { return <ResearchPage mode="research" />; }
export function ArchivePage() { return <SimplePage eyebrow="Kurumsal hafıza" title="Arşiv" description="Eski dosyalarınızı, onaylanmış metinleri ve araştırma geçmişini tek aramada bulun." icon={FolderOpen} />; }
export function SettingsPage() { return <SimplePage eyebrow="Çalışma alanı" title="Ayarlar" description="Profil, ekip rolleri, güvenlik ve bildirim tercihlerini yönetin." icon={SlidersHorizontal} />; }