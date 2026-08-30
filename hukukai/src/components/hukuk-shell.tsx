import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { clearDemoSession } from '@/lib/demo-auth';
import { useWorkspaceActions } from '@/components/workspace/workspace-actions';
import {
  Archive,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  FileText,
  FolderSearch,
  Gavel,
  House,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const demoUser = {
  name: 'Av. Behçet Alp',
  initials: 'BA',
  role: 'Dosya Sorumlusu',
} as const;

const primaryNav: NavItem[] = [
  { href: '/app', label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/davalar', label: 'Davalar', icon: BriefcaseBusiness },
  { href: '/gorevler', label: 'Görevler', icon: ListChecks },
  { href: '/takvim', label: 'Takvim & Süreler', icon: CalendarDays },
  { href: '/muvekkiller', label: 'Müvekkiller', icon: Users },
  { href: '/belgeler', label: 'Belgeler', icon: FileText },
];

const researchNav: NavItem[] = [
  { href: '/hukuki-arastirma', label: 'Hukuki Araştırma', icon: FolderSearch },
  { href: '/emsal-kararlar', label: 'Emsal Kararlar', icon: Gavel },
  { href: '/mevzuat', label: 'Mevzuat', icon: Archive },
  { href: '/dilekceler', label: 'Dilekçeler', icon: FileText },
  { href: '/ai-asistan', label: 'Hukuki Asistan', icon: FolderSearch },
];

const utilityNav: NavItem[] = [
  { href: '/arsiv', label: 'Arşiv', icon: Archive },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const [location, setLocation] = useLocation();

  const logout = () => {
    // DEMO AUTH ONLY — replace with server-side auth later.
    clearDemoSession();
    setLocation('/login');
  };
  const active = item.href === '/app' ? location === '/app' : location.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      data-testid={`link-nav-${item.label.toLocaleLowerCase('tr-TR').replaceAll(' ', '-')}`}
      className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-colors md:min-h-[40px] md:gap-2.5 md:px-2.5 md:text-[13px] ${
        active
          ? 'bg-sidebar-accent text-sidebar-foreground'
          : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2 : 1.5} className={active ? 'text-sidebar-primary' : 'text-sidebar-foreground/45'} />
      <span className="flex-1">{item.label}</span>
    </Link>
  );
}

function Sidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onNavigate,
  onCloseMobile,
  onLogout,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onNavigate?: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}) {
  return (
    <aside
      role={mobileOpen ? 'dialog' : undefined}
      aria-modal={mobileOpen ? true : undefined}
      aria-label={mobileOpen ? 'Mobil gezinme menüsü' : undefined}
      className={`fixed inset-y-0 left-0 z-40 flex w-[min(86vw,340px)] flex-col bg-sidebar text-sidebar-foreground shadow-2xl transition-[transform,width] duration-200 md:w-[240px] md:translate-x-0 md:shadow-none ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } ${collapsed ? 'md:w-[60px]' : ''}`}
    >
      <div className="flex h-[56px] items-center justify-between border-b border-sidebar-border px-3 md:h-[49px]">
        <Link href="/app" onClick={onNavigate} data-testid="link-brand" className={`flex items-center gap-2 ${collapsed ? 'md:mx-auto' : ''}`}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground md:h-7 md:w-7">
            <ShieldCheck size={16} strokeWidth={2.2} />
          </span>
          <span className={`${collapsed ? 'md:hidden' : ''} text-[15px] font-semibold md:text-[14px]`}>
            Hukuk<span className="text-sidebar-primary">AI</span>
          </span>
        </Link>
        <button
          onClick={onCloseMobile}
          aria-label="Menüyü kapat"
          data-testid="button-close-mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
        >
          <X size={19} />
        </button>
        <button
          onClick={onCollapse}
          data-testid="button-collapse-sidebar"
          aria-label="Kenar çubuğunu daralt"
          className="hidden rounded p-1 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground md:block"
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3" aria-label="Ana gezinme">
        <div className="space-y-1 md:space-y-0.5">{primaryNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        <div className="space-y-1 md:space-y-0.5">{researchNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        <div className="space-y-1 md:space-y-0.5">{utilityNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
      </nav>

      <div className={`border-t border-sidebar-border px-2.5 py-3 ${collapsed ? 'md:hidden' : ''}`}>
        <Link href="/" onClick={onNavigate} className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground md:min-h-[40px] md:gap-2.5 md:px-2.5 md:text-[13px]">
          <House size={16} className="text-sidebar-foreground/45" />
          Ana Sayfaya Dön
        </Link>
        <Link href="/ayarlar" onClick={onNavigate} data-testid="link-nav-ayarlar" className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground md:min-h-[40px] md:gap-2.5 md:px-2.5 md:text-[13px]">
          <Settings2 size={16} className="text-sidebar-foreground/45" />
          Ayarlar
        </Link>
        <div className="mt-2 flex items-center gap-2.5 border-t border-sidebar-border/70 px-2.5 pt-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-foreground/10 text-[11px] font-bold text-sidebar-foreground/75">{demoUser.initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-sidebar-foreground">{demoUser.name}</p>
            <p className="truncate text-[10px] text-sidebar-foreground/45">{demoUser.role}</p>
          </div>
          <ChevronRight size={13} className="text-sidebar-foreground/30" />
        </div>
        <button onClick={onLogout} className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[14px] font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground md:min-h-[40px] md:gap-2.5 md:px-2.5 md:text-[13px]" data-testid="button-logout">
          <LogOut size={16} className="text-sidebar-foreground/45" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

export function HukukShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [location, setLocation] = useLocation();
  const { openSearch } = useWorkspaceActions();

  const logout = () => {
    // DEMO AUTH ONLY — replace with server-side auth later.
    clearDemoSession();
    setLocation('/login');
  };

  useEffect(() => { setSidebarOpen(false); }, [location]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={sidebarOpen}
        onCollapse={() => setCollapsed((v) => !v)}
        onNavigate={() => setSidebarOpen(false)}
        onCloseMobile={() => setSidebarOpen(false)}
        onLogout={logout}
      />

      {sidebarOpen ? (
        <button
          aria-label="Menüyü kapat"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      ) : null}

      <div className={`transition-[padding] duration-200 ${collapsed ? 'md:pl-[60px]' : 'md:pl-[240px]'}`}>
        <header className="sticky top-0 z-20 flex h-[49px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              data-testid="button-open-mobile-menu"
              aria-label="Menüyü aç"
              aria-expanded={sidebarOpen}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted md:hidden"
            >
              <Menu size={19} />
            </button>
            <button
              type="button"
              onClick={openSearch}
              data-testid="button-open-search"
              aria-keyshortcuts="Meta+K Control+K"
              className="hidden items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-muted sm:flex sm:w-[240px]"
            >
              <Search size={14} />
              <span className="flex-1 text-left">Ara veya işlem çalıştır</span>
              <span className="mono rounded border border-border px-1 py-0.5 text-[9px]">⌘K</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSearch}
              data-testid="button-open-search-mobile"
              aria-label="Ara"
              className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted sm:hidden"
            >
              <Search size={15} />
            </button>
            <button onClick={() => document.documentElement.classList.toggle('dark')} data-testid="button-toggle-theme" aria-label="Tema değiştir" className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted">
              <Moon size={15} />
            </button>
            <div className="h-4 w-px bg-border" />
            <button data-testid="button-notifications" aria-label="Bildirimler" className="relative flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V1.5C9.93299 1.5 11.5 3.06701 11.5 5V5.5L12.5 7.5V8.5H2.5V7.5L3.5 5.5V5C3.5 3.06701 5.06701 1.5 7 1.5V0.5C7 0.223858 7.22386 0 7.5 0ZM6 10.5V12C6 12.5523 6.44772 13 7 13H8C8.55228 13 9 12.5523 9 12V10.5H6Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" /></svg>
            </button>
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{demoUser.initials}</div>
          </div>
        </header>
        <main className="min-h-[calc(100dvh-49px)] px-4 py-5 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
