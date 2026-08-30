import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, Menu, Scale, X } from 'lucide-react';

const productItems = [
  ['Genel Bakış', '/urun'], ['Belge ve Delil Analizi', '/belge-delil'], ['Emsal Karar Araştırması', '/emsal-arastirma'], ['Mevzuat', '/mevzuat?public=1'], ['Takvim ve Süreler', '/takvim-sureler'], ['Taslaklar', '/taslaklar'], ['Hukuki Asistan', '/hukuki-asistan'],
] as const;
const caseItems = [['Dosya Merkezli Çalışma', '/urun#dava-yonetimi'], ['Delil Matrisi', '/belge-delil#delil-matrisi'], ['Süre Yönetimi', '/takvim-sureler']] as const;

export function PublicHeader({ active }: { active?: 'product' | 'services' | 'about' | 'announcements' | 'contact' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const close = () => { setMobileOpen(false); setOpenGroup(null); };
  useEffect(() => {
    const outside = (event: MouseEvent) => { if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) setOpenGroup(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('mousedown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  const group = (label: string, items: readonly (readonly [string, string])[], isActive = false) => <div className="nav-group"><button type="button" aria-expanded={openGroup === label} onClick={() => setOpenGroup((current) => current === label ? null : label)} className={isActive ? 'public-nav-active' : ''}>{label}<ChevronDown size={13} /></button><div className={`nav-dropdown ${openGroup === label ? 'open' : ''}`} role="menu">{items.map(([text, href]) => <Link key={href} href={href} role="menuitem" onClick={close}>{text}</Link>)}</div></div>;
  return <header className="landing-nav public-header" ref={ref}><Link href="/" className="landing-logo"><span><Scale size={17} /></span>Hukuk<em>AI</em></Link><nav className={`landing-nav-links ${mobileOpen ? 'open' : ''}`} aria-label="Ana gezinme">{group('Ürün', productItems, active === 'product')}{group('Dava Yönetimi', caseItems, active === 'product')}<Link href="/hizmet-alanlari" className={active === 'services' ? 'public-nav-active' : ''} onClick={close}>Hizmet Alanları</Link><Link href="/hakkinda" className={active === 'about' ? 'public-nav-active' : ''} onClick={close}>Hakkında</Link><Link href="/duyurular" className={active === 'announcements' ? 'public-nav-active' : ''} onClick={close}>Duyurular</Link><Link href="/iletisim" className={active === 'contact' ? 'public-nav-active' : ''} onClick={close}>İletişim</Link><Link href="/login" className="nav-demo-mobile" onClick={close}>Demoyu İncele <ArrowRight size={14} /></Link></nav><Link href="/login" className="nav-cta">Demoyu İncele <ArrowRight size={14} /></Link><button type="button" className="menu-toggle" aria-label="Menüyü aç veya kapat" aria-expanded={mobileOpen} onClick={() => { setMobileOpen((value) => !value); setOpenGroup(null); }}>{mobileOpen ? <X /> : <Menu />}</button></header>;
}

export function PublicFooter() {
  return <footer className="landing-footer public-footer"><div className="footer-inner"><Link href="/" className="landing-logo"><span><Scale size={15} /></span>Hukuk<em>AI</em></Link><nav className="footer-links" aria-label="Alt menü"><Link href="/urun">Ürün</Link><Link href="/hakkinda">Hakkında</Link><Link href="/iletisim">İletişim</Link><Link href="/login">Demoyu İncele</Link></nav><p className="footer-copy">Kurgusal demo deneyimi · Hukuki görüş veya tavsiye değildir.</p></div></footer>;
}

export function PublicPageLayout({ active, children }: { active?: 'product' | 'services' | 'about' | 'announcements' | 'contact'; children: ReactNode }) {
  return <div className="landing-page public-page"><PublicHeader active={active} /><main>{children}</main><PublicFooter /></div>;
}
