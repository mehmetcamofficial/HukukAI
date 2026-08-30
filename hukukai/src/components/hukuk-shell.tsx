import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Archive,
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
  Users,
  X,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const primaryNav: NavItem[] = [
  { href: '/', label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/davalar', label: 'Davalar', icon: BriefcaseBusiness },
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
  { href: '/takvim', label: 'Takvim & Süreler', icon: CalendarDays },
  { href: '/ai-asistan', label: 'Hukuki Asistan', icon: FolderSearch },
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
      className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors min-h-[40px] ${
        active
          ? 'bg-sidebar-accent text-sidebar-foreground'
          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      }`}
    >
      <Icon size={15} strokeWidth={active ? 2 : 1.5} className={active ? 'text-sidebar-primary' : 'text-sidebar-foreground/40'} />
      <span className="flex-1">{item.label}</span>
    </Link>
  );
}

function Sidebar({ collapsed, onCollapse, onNavigate }: { collapsed: boolean; onCollapse: () => void; onNavigate?: () => void }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col bg-sidebar text-sidebar-foreground transition-all duration-200 md:translate-x-0 ${collapsed ? '-translate-x-full md:w-[60px] md:translate-x-0' : ''}`}>
      <div className="flex h-[49px] items-center justify-between border-b border-sidebar-border px-3">
        <Link href="/" onClick={onNavigate} data-testid="link-brand" className={`flex items-center gap-2 ${collapsed ? 'md:mx-auto' : ''}`}>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck size={15} strokeWidth={2.2} />
          </span>
          <span className={`${collapsed ? 'md:hidden' : ''} text-[14px] font-semibold`}>
            Hukuk<span className="text-sidebar-primary">AI</span>
          </span>
        </Link>
        <button
          onClick={onCollapse}
          data-testid="button-collapse-sidebar"
          aria-label="Kenar çubuğunu daralt"
          className="hidden rounded p-1 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground md:block"
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4" aria-label="Ana gezinme">
        <div>
          <div className="space-y-0.5">{primaryNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        </div>
        <div>
          <div className="space-y-0.5">{researchNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        </div>
        <div>
          <div className="space-y-0.5">{utilityNav.map((item) => <NavLink key={item.href} item={item} onNavigate={onNavigate} />)}</div>
        </div>
      </nav>

      <div className={`border-t border-sidebar-border px-2 py-3 ${collapsed ? 'md:hidden' : ''}`}>
        <Link href="/ayarlar" onClick={onNavigate} data-testid="link-nav-ayarlar" className="flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground min-h-[40px]">
          <Settings2 size={15} className="text-sidebar-foreground/40" />
          Ayarlar
        </Link>
        <div className="mt-2 flex items-center gap-2.5 rounded bg-sidebar-accent/50 px-2.5 py-2">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sidebar-foreground/10 text-[10px] font-bold text-sidebar-foreground/70">AY</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-sidebar-foreground">Av. Ayşe Yılmaz</p>
            <p className="truncate text-[10px] text-sidebar-foreground/40">Yönetici</p>
          </div>
          <ChevronRight size={12} className="text-sidebar-foreground/30" />
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
    <div className="min-h-[100dvh] bg-background">
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((v) => !v)} onNavigate={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <>
          <button
            aria-label="Menüyü kapat"
            data-testid="button-close-mobile-menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
          />
          <div className="fixed top-0 right-0 z-50 flex h-[49px] items-center md:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Menüyü kapat"
              className="flex h-11 w-11 items-center justify-center rounded text-foreground/70 hover:bg-muted"
            >
              <X size={18} />
            </button>
          </div>
        </>
      )}

      <div className={`transition-[padding] duration-200 ${collapsed ? 'md:pl-[60px]' : 'md:pl-[240px]'}`}>
        <header className="sticky top-0 z-20 flex h-[49px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              data-testid="button-open-mobile-menu"
              aria-label="Menüyü aç"
              className="flex h-10 w-10 items-center justify-center rounded border border-border text-muted-foreground md:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="hidden items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground sm:flex sm:w-[240px]">
              <Search size={14} />
              <span className="flex-1">Ara</span>
              <span className="mono rounded border border-border px-1 py-0.5 text-[9px]">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => document.documentElement.classList.toggle('dark')} data-testid="button-toggle-theme" aria-label="Tema değiştir" className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted">
              <Moon size={15} />
            </button>
            <div className="h-4 w-px bg-border" />
            <button data-testid="button-notifications" aria-label="Bildirimler" className="relative flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V1.5C9.93299 1.5 11.5 3.06701 11.5 5V5.5L12.5 7.5V8.5H2.5V7.5L3.5 5.5V5C3.5 3.06701 5.06701 1.5 7 1.5V0.5C7 0.223858 7.22386 0 7.5 0ZM6 10.5V12C6 12.5523 6.44772 13 7 13H8C8.55228 13 9 12.5523 9 12V10.5H6Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" /></svg>
            </button>
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">AY</div>
          </div>
        </header>
        <main className="min-h-[calc(100dvh-49px)] px-4 py-5 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
