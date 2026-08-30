import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Archive,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  FileText,
  FolderSearch,
  Gavel,
  LayoutDashboard,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; badge?: string };

const primaryNav: NavItem[] = [
  { href: '/', label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/davalar', label: 'Davalar', icon: BriefcaseBusiness, badge: '1' },
  { href: '/muvekkiller', label: 'Müvekkiller', icon: Users },
  { href: '/belgeler', label: 'Belgeler', icon: FileText },
];

const researchNav: NavItem[] = [
  { href: '/hukuki-arastirma', label: 'Hukuki Araştırma', icon: FolderSearch },
  { href: '/emsal-kararlar', label: 'Emsal Kararlar', icon: Gavel },
  { href: '/mevzuat', label: 'Mevzuat', icon: Archive },
  { href: '/dilekceler', label: 'Dilekçeler', icon: FileText },
];

const utilityNav: NavItem[] = [
  { href: '/takvim', label: 'Takvim', icon: CalendarDays, badge: '3' },
  { href: '/ai-asistan', label: 'AI Asistan', icon: Sparkles },
  { href: '/arsiv', label: 'Arşiv', icon: Archive },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const [location] = useLocation();
  const active = item.href === '/' ? location === '/' : location.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      data-testid={`link-nav-${item.label.toLocaleLowerCase('tr-TR').replaceAll(' ', '-')}`}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
        active
          ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] shadow-[inset_3px_0_0_hsl(var(--sidebar-primary))]'
          : 'text-[hsl(var(--sidebar-foreground)/.64)] hover:bg-[hsl(var(--sidebar-accent)/.72)] hover:text-[hsl(var(--sidebar-foreground))]'
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.8} className={active ? 'text-[hsl(var(--sidebar-primary))]' : 'text-[hsl(var(--sidebar-foreground)/.5)] group-hover:text-[hsl(var(--sidebar-primary))]'} />
      <span className="flex-1">{item.label}</span>
      {item.badge ? <span className={`mono text-[10px] ${active ? 'text-[hsl(var(--sidebar-primary))]' : 'text-[hsl(var(--sidebar-foreground)/.36)]'}`}>{item.badge}</span> : null}
    </Link>
  );
}

function Sidebar({ collapsed, onCollapse, onNavigate }: { collapsed: boolean; onCollapse: () => void; onNavigate?: () => void }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[hsl(var(--sidebar))] px-3 py-4 text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 md:translate-x-0 ${collapsed ? '-translate-x-full md:w-[76px] md:translate-x-0 md:px-2' : ''}`}>
      <div className="mb-8 flex items-center justify-between px-2">
        <Link href="/" onClick={onNavigate} data-testid="link-brand" className={`flex items-center gap-3 ${collapsed ? 'md:mx-auto' : ''}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-[0_8px_18px_hsl(var(--sidebar-primary)/.2)]">
            <ShieldCheck size={19} strokeWidth={2.4} />
          </span>
          <span className={`${collapsed ? 'md:hidden' : ''}`}>
            <span className="block text-[15px] font-extrabold tracking-[-.04em]">Hukuk<span className="text-[hsl(var(--sidebar-primary))]">AI</span></span>
            <span className="mono mt-0.5 block text-[9px] uppercase tracking-[.14em] text-[hsl(var(--sidebar-foreground)/.42)]">Güvenilir çalışma alanı</span>
          </span>
        </Link>
        <button onClick={onCollapse} data-testid="button-collapse-sidebar" className="hidden rounded-md p-1.5 text-[hsl(var(--sidebar-foreground)/.48)] transition hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))] md:block">
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        <div>
          <p className={`eyebrow mb-2 px-3 text-[hsl(var(--sidebar-foreground)/.3)] ${collapsed ? 'md:hidden' : ''}`}>Çalışma alanı</p>
          <div className="space-y-1">{primaryNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        </div>
        <div>
          <p className={`eyebrow mb-2 px-3 text-[hsl(var(--sidebar-foreground)/.3)] ${collapsed ? 'md:hidden' : ''}`}>Hukuk masası</p>
          <div className="space-y-1">{researchNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        </div>
        <div>
          <p className={`eyebrow mb-2 px-3 text-[hsl(var(--sidebar-foreground)/.3)] ${collapsed ? 'md:hidden' : ''}`}>Takip</p>
          <div className="space-y-1">{utilityNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        </div>
      </nav>

      <div className={`mt-4 border-t border-[hsl(var(--sidebar-border))] pt-4 ${collapsed ? 'md:hidden' : ''}`}>
        <Link href="/ayarlar" onClick={onNavigate} data-testid="link-nav-ayarlar" className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-[hsl(var(--sidebar-foreground)/.6)] transition hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]">
          <Settings2 size={16} className="text-[hsl(var(--sidebar-foreground)/.45)] group-hover:text-[hsl(var(--sidebar-primary))]" />
          Ayarlar
        </Link>
        <div className="mt-3 flex items-center gap-3 rounded-lg bg-[hsl(var(--sidebar-accent)/.68)] px-3 py-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--accent)/.22)] text-xs font-extrabold text-[hsl(var(--accent))]">AY</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">Av. Ayşe Yılmaz</p>
            <p className="mono truncate text-[9px] text-[hsl(var(--sidebar-foreground)/.4)]">Yönetici</p>
          </div>
          <ChevronRight size={14} className="text-[hsl(var(--sidebar-foreground)/.35)]" />
        </div>
      </div>
    </aside>
  );
}

export function HukukShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [location]);

  return (
    <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((value) => !value)} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen ? <button aria-label="Menüyü kapat" data-testid="button-close-mobile-menu" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.32)] md:hidden" /> : null}
      <div className={`transition-[padding] duration-300 ${collapsed ? 'md:pl-[76px]' : 'md:pl-[260px]'}`}>
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.9)] px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} data-testid="button-open-mobile-menu" className="rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] md:hidden"><Menu size={18} /></button>
            <div className="hidden h-9 items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-3 text-[12px] text-[hsl(var(--muted-foreground))] shadow-sm transition hover:border-[hsl(var(--primary)/.4)] sm:flex sm:w-[265px]">
              <Search size={15} />
              <span className="flex-1">Hukuki bellekte ara</span>
              <span className="mono rounded border border-[hsl(var(--border))] px-1.5 py-0.5 text-[9px]">⌘ K</span>
            </div>
            <Link href="/arsiv" data-testid="link-mobile-search" className="rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] sm:hidden"><Search size={17} /></Link>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 rounded-full border border-[hsl(var(--primary)/.24)] bg-[hsl(var(--primary)/.07)] px-3 py-1.5 text-[11px] font-semibold text-[hsl(var(--primary))] lg:flex"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />Kaynak doğrulama aktif</span>
            <button onClick={() => document.documentElement.classList.toggle('dark')} data-testid="button-toggle-theme" aria-label="Tema değiştir" className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"><Moon size={17} /></button>
            <div className="hidden h-7 w-px bg-[hsl(var(--border))] sm:block" />
            <button data-testid="button-notifications" className="relative rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"><span className="sr-only">Bildirimler</span><ArrowUpRight size={17} /></button>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--primary)/.14)] text-[11px] font-extrabold text-[hsl(var(--primary))]">AY</div>
          </div>
        </header>
        <main className="workspace-grid min-h-[calc(100dvh-68px)] px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}