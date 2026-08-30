import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, ExternalLink,
  FileText, Gavel, Globe, MapPin, Menu, Phone, Scale, Search, Send,
  ShieldCheck, Star, X,
} from 'lucide-react';
import { demoAnnouncements } from '@/lib/demo-announcements';

const caseHref = '/davalar/case-2026-145';

const practiceAreas = [
  { title: 'Ticaret ve Şirketler Hukuku', summary: 'Şirketlerin kuruluşundan günlük hukuki ihtiyaçlarına uzanan danışmanlık.', services: 'Şirket kuruluşu · Sözleşmeler · Uyuşmazlık yönetimi' },
  { title: 'Gayrimenkul ve Kira Hukuku', summary: 'Taşınmaz, kira ilişkisi ve ilgili uyuşmazlıklarda hukuki destek.', services: 'Kira tespit · Tahliye · Taşınmaz işlemleri' },
  { title: 'Yabancılar Hukuku ve Uluslararası Yatırımlar', summary: 'Türkiye ile bağlantılı yatırımlar ve yabancı unsurlu işlemler için yaklaşım.', services: 'Yatırım süreçleri · İkamet · Uyumlu işlem akışı' },
  { title: 'Aile Hukuku ve Tanıma-Tenfiz', summary: 'Aile hukuku uyuşmazlıkları ile yabancı kararların Türkiye’deki etkisi.', services: 'Boşanma · Tanıma-tenfiz · Mal rejimi' },
  { title: 'İcra ve İflas Hukuku', summary: 'Alacakların takibi ve ticari uyuşmazlıklarda hukuki süreç yönetimi.', services: 'İcra takibi · İtiraz · İflas süreçleri' },
  { title: 'İş Hukuku', summary: 'İş ilişkilerinin kurulması, sürdürülmesi ve uyuşmazlıkların değerlendirilmesi.', services: 'İş sözleşmeleri · Arabuluculuk · Dava takibi' },
];

const principles = ['Gizlilik ve sır saklama', 'Ön analiz ve şeffaflık', 'Düzenli raporlama ve bilgilendirme', 'Uluslararası hizmet yaklaşımı', 'Çıkar çatışması kontrolü'];

const faqs = [
  ['Yabancılar Türkiye’de mülk edinebilir mi?', 'Mülk edinimi; kişinin uyruğu, taşınmazın niteliği ve ilgili mevzuat çerçevesinde değerlendirilir. Somut işlem öncesinde güncel koşulların incelenmesi gerekir.'],
  ['Yabancı mahkeme boşanma kararları Türkiye’de tanınır mı?', 'Yabancı mahkeme kararlarının Türkiye’de hüküm doğurması, kararın niteliğine ve gerekli tanıma veya tenfiz koşullarına bağlıdır.'],
  ['Kira tespit veya tahliye sürecinde arabuluculuk gerekli midir?', 'Uyuşmazlığın türüne göre dava öncesi arabuluculuk şartı ve başvuru yolu değişebilir. Süreç, somut kira ilişkisine göre değerlendirilmelidir.'],
  ['Şirketler sürekli hukuki danışmanlık alabilir mi?', 'Şirketlerin sözleşme, yönetim, uyuşmazlık ve günlük operasyon ihtiyaçlarına uygun sürekli danışmanlık modelleri değerlendirilebilir.'],
];

const navigationGroups = [
  { label: 'Ürün', items: [['Genel Bakış', '/urun'], ['Belge ve Delil Analizi', '/belge-delil'], ['Emsal Karar Araştırması', '/emsal-arastirma'], ['Mevzuat', '/mevzuat?public=1'], ['Takvim ve Süreler', '/takvim-sureler'], ['Taslaklar', '/taslaklar'], ['Hukuki Asistan', '/hukuki-asistan']] },
  { label: 'Dava Yönetimi', items: [['Dava Dosyası', '/urun#dava-yonetimi'], ['Belgeler', '/belge-delil#belgeler'], ['Kronoloji', '/urun#kaynaklar'], ['Delil Matrisi', '/belge-delil#delil-matrisi'], ['Emsal Kararlar', '/emsal-arastirma'], ['Benzer Dosyalar', '/urun#dava-yonetimi'], ['Taslaklar', '/taslaklar']] },
  { label: 'Hizmet Alanları', items: [['Hizmet Alanları', '/hizmet-alanlari']] },
  { label: 'Hakkında', items: [['HukukAI Hakkında', '/hakkinda'], ['Duyurular', '/duyurular'], ['İletişim', '/iletisim']] },
] as const;

function Mark({ children }: { children: ReactNode }) {
  return <span className="landing-mark"><Check size={11} strokeWidth={2.5} />{children}</span>;
}

function SectionIntro({ number, eyebrow, title, copy, centered = false }: { number: string; eyebrow: string; title: ReactNode; copy?: string; centered?: boolean }) {
  return <div className={`landing-intro ${centered ? 'landing-intro-center' : ''}`}>
    <p className="landing-kicker"><span>{number}</span>{eyebrow}</p>
    <h2>{title}</h2>
    {copy && <p className="landing-copy">{copy}</p>}
  </div>;
}

function ProductFrame({ compact = false }: { compact?: boolean }) {
  const tabs = ['Genel Bakış', 'Belgeler', 'Kronoloji', 'Deliller', 'Emsal Kararlar', 'Mevzuat', 'Benzer Dosyalar', 'Taslaklar'];
  return <div className={`product-frame ${compact ? 'product-frame-compact' : ''}`}>
    <div className="product-topbar"><span className="dot" /><span className="dot" /><span className="dot" /><span className="frame-address">hukukai / dava dosyası</span><span className="frame-status">DEMO</span></div>
    <div className="product-body">
      <aside className="product-rail"><span className="rail-logo"><Scale size={16} /></span><span className="rail-active" /><span /><span /><span /><span /></aside>
      <div className="product-content">
        <div className="product-header"><div><p className="product-eyebrow">DAVA DOSYASI <i>•</i> 2026/145</p><h3>İşçilik Alacağı</h3></div><span className="case-state">AKTİF</span></div>
        <div className="product-tabs">{tabs.map((tab, index) => <span key={tab} className={index === 3 ? 'active' : ''}>{tab}</span>)}</div>
        <div className="product-grid">
          <div className="product-main">
            <div className="product-section-head"><strong>Dosya Özeti</strong><small>Son güncelleme · bugün</small></div>
            <div className="meta-grid"><span><b>Mahkeme</b>Kurgu 14. İş Mahkemesi</span><span><b>Müvekkil</b>Deniz Aras</span><span><b>Karşı taraf</b>Örnek Tic. A.Ş.</span><span className="deadline"><b>Son süre</b>02 Eylül 2026</span></div>
            <div className="evidence-panel"><div className="evidence-title"><span>DELİL MATRİSİ</span><em>Fazla çalışma</em></div><div className="evidence-columns"><div><b>Destekleyen</b><p>WhatsApp</p><p>Tanık beyanı</p></div><div><b>Karşı</b><p>Bordro</p></div><div><b>Eksik</b><p>Kart kayıtları</p></div></div></div>
          </div>
          <aside className="product-side"><div className="side-title">YAKLAŞANLAR</div><div className="deadline-card"><b>02</b><span>EYL</span><p>Bilirkişi raporuna itiraz</p></div><div className="source-mini"><p>EMSAL</p><b>Yargıtay 9. HD</b><span>E. 2023/7974 · K. 2023/11786</span><Mark>DOĞRULANDI</Mark></div></aside>
        </div>
      </div>
    </div>
  </div>;
}

function HeroSimulation() {
  return <div className="hero-simulation" aria-label="HukukAI dosya çalışma alanı örneği">
    <div className="sim-top"><span className="sim-brand"><Scale size={15} /> Hukuk<span>AI</span></span><span className="sim-case">DAVA DOSYASI <b>2026/145</b></span><span className="sim-live"><i /> ÇALIŞMA ALANI</span></div>
    <div className="sim-content">
      <aside className="sim-nav"><span className="sim-nav-active">Genel Bakış</span><span>Belgeler <b>12</b></span><span>Deliller</span><span>Emsaller</span><span>Mevzuat</span><span>Taslaklar</span></aside>
      <div className="sim-work">
        <div className="sim-case-head"><div><p>2026 / 145</p><h3>İşçilik Alacağı</h3></div><span>AKTİF DOSYA</span></div>
        <div className="sim-metadata"><div><small>MAHKEME</small><b>Kurgu 14. İş Mahkemesi</b></div><div><small>MÜVEKKİL</small><b>Deniz Aras</b></div><div><small>KARŞI TARAF</small><b>Örnek Tic. A.Ş.</b></div><div className="sim-due"><small>SON SÜRE</small><b>02 Eylül</b></div></div>
        <div className="sim-docs"><div className="sim-label">DOSYA BELGELERİ <span>4 kayıt</span></div>{['Bilirkişi Raporu', 'Ücret Bordrosu', 'WhatsApp Yazışmaları', 'Puantaj'].map((doc, i) => <div className={`sim-doc sim-step-${i}`} key={doc}><FileText size={13} /><span>{doc}</span><small>{i === 0 ? 'PDF · 4.2 MB' : 'Kaynak belgesi'}</small></div>)}</div>
        <div className="sim-insight"><div><p>DELİL MATRİSİ</p><h4>Fazla çalışma</h4></div><div className="insight-row"><span>Destekleyen</span><b>WhatsApp · Tanık</b></div><div className="insight-row opposing"><span>Karşı</span><b>Bordro</b></div><div className="insight-row missing"><span>Eksik</span><b>Kart kayıtları</b></div></div>
      </div>
      <aside className="sim-side"><div className="sim-side-title">DOĞRULANMIŞ KAYNAK</div><div className="sim-precedent"><p>YARGITAY 9. HUKUK DAİRESİ</p><b>E. 2023/7974</b><b>K. 2023/11786</b><Mark>DOĞRULANDI</Mark></div><div className="sim-calendar"><p><CalendarDays size={13} /> TAKVİM</p><b>02 Eyl</b><span>Bilirkişi raporuna itiraz</span></div><div className="sim-similar"><p>BENZER DOSYA</p><b>2024/381</b><span>Semantik benzerlik <strong>%90</strong></span></div><div className="sim-draft"><p>TASLAK</p><b>Bilirkişi Raporuna İtiraz</b><span>Avukat incelemesine hazır</span></div></aside>
    </div>
    <div className="sim-progress"><i /><i /><i /><i /><i /><i /><i /><i /></div>
  </div>;
}

function SourcePanel({ type, title, detail, children, href }: { type: string; title: string; detail: string; children: ReactNode; href: string }) {
  return <article className="source-panel"><p className="source-type">{type}</p><h3>{title}</h3><p className="source-detail">{detail}</p>{children}<a href={href} target="_blank" rel="noreferrer">Resmî Kaynağı Aç <ArrowUpRight size={14} /></a></article>;
}

function CalendarVisual() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return <div className="calendar-showcase"><div className="calendar-main"><div className="calendar-heading"><div><p>TAKVİM</p><h3>Eylül 2026</h3></div><span>‹ &nbsp; ›</span></div><div className="calendar-week">{['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => <span key={d}>{d}</span>)}</div><div className="calendar-days">{Array.from({ length: 1 }).map((_, i) => <span className="empty" key={i} />)}{days.map(day => <span className={day === 2 ? 'deadline-day' : day === 14 ? 'hearing-day' : ''} key={day}>{day}{day === 2 && <i />}{day === 14 && <i />}</span>)}</div></div><aside className="agenda"><p>YAKLAŞAN GÜNDEM</p><div className="agenda-item critical"><b><span>02</span>EYL</b><div><small>SON SÜRE</small><h4>Bilirkişi raporuna itiraz</h4><em>Av. Behçet Alp</em></div></div><div className="agenda-item hearing"><b><span>14</span>EYL</b><div><small>DURUŞMA · 10:00</small><h4>Rapor değerlendirmesi</h4><em>Kurgu 14. İş Mahkemesi</em></div></div><div className="agenda-item"><b><span>05</span>EYL</b><div><small>BİLİRKİŞİ</small><h4>Rapor inceleme</h4><em>Çalışma Arkadaşı</em></div></div></aside></div>;
}

type PreviewKind = 'case' | 'documents' | 'evidence' | 'timeline' | 'precedents' | 'legislation' | 'calendar' | 'drafts';

const previewMeta: Record<PreviewKind, { label: string; title: string; detail: string }> = {
  case: { label: 'DAVA DOSYASI', title: '2026/145 · İşçilik Alacağı', detail: 'Dosyanın tamamı aynı çalışma bağlamında.' },
  documents: { label: 'BELGELER', title: 'Dosya belgeleri', detail: 'Belge türü, kaynak ve durum bir arada.' },
  evidence: { label: 'DELİL MATRİSİ', title: 'Fazla çalışma alacağı', detail: 'İddiayla ilişkili delilleri birlikte değerlendirin.' },
  timeline: { label: 'KRONOLOJİ', title: 'Dosya zaman çizelgesi', detail: 'Süreçteki olayları tarih sırasıyla görün.' },
  precedents: { label: 'EMSAL BAĞLANTILARI', title: 'Doğrulanmış kaynak', detail: 'Kararın kimliği, ilkesi ve kaynak durumu görünür.' },
  legislation: { label: 'MEVZUAT', title: '4857 Sayılı İş Kanunu', detail: 'Resmî metin, özet ve kaynak ayrımıyla.' },
  calendar: { label: 'SÜRELER', title: 'Yaklaşan dosya işleri', detail: 'Duruşma ve kritik süreleri dosya bağlamında tutun.' },
  drafts: { label: 'TASLAKLAR', title: 'Avukat incelemesi', detail: 'Taslaklar gönderimden önce açık bir inceleme durumunda tutulur.' },
};

function ProductPreview({ kind }: { kind: PreviewKind }) {
  const meta = previewMeta[kind];
  const documents = ['Bilirkişi Raporu', 'Dava Dilekçesi', 'Cevap Dilekçesi', 'Bordro', 'Puantaj', 'WhatsApp Dökümü'];
  return <div className="interactive-preview" aria-live="polite">
    <div className="preview-top"><span><Scale size={13} /> Hukuk<span>AI</span></span><em>DEMO ÇALIŞMA ALANI</em></div>
    <div className="preview-shell"><aside><b>2026/145</b><span className={kind === 'case' ? 'selected' : ''}>Genel</span><span className={kind === 'documents' ? 'selected' : ''}>Belgeler</span><span className={kind === 'timeline' ? 'selected' : ''}>Kronoloji</span><span className={kind === 'evidence' ? 'selected' : ''}>Deliller</span><span className={kind === 'precedents' ? 'selected' : ''}>Emsaller</span></aside><section key={kind} className="preview-content"><p>{meta.label}</p><h3>{meta.title}</h3><span className="preview-detail">{meta.detail}</span>
      {kind === 'case' && <div className="preview-cards"><div><small>MAHKEME</small><b>Kurgu 14. İş Mahkemesi</b></div><div><small>MÜVEKKİL</small><b>Deniz Aras</b></div><div><small>SON SÜRE</small><b>02 Eylül</b></div></div>}
      {kind === 'documents' && <div className="preview-list">{documents.map((item, i) => <div key={item}><FileText size={13} /><b>{item}</b><span>{i < 2 ? 'PDF · Hazır' : 'Kaynak belgesi'}</span></div>)}</div>}
      {kind === 'evidence' && <div className="preview-matrix"><div><b>İddia</b><span>Haftalık fazla çalışma</span></div><div className="support"><b>Destekleyen</b><span>WhatsApp · Tanık beyanı</span></div><div className="opposite"><b>Karşı</b><span>İmzalı ücret bordrosu</span></div><div className="missing"><b>Eksik</b><span>Kartlı geçiş kayıtları</span></div><div><b>Değerlendirme</b><span>Bordro ve puantaj karşılaştırılmalı</span></div></div>}
      {kind === 'timeline' && <div className="preview-timeline">{[['2004', 'İşe giriş kaydı'], ['2025', 'Ücret ve bordro kayıtları'], ['2026', 'İhtar ve dava başvurusu'], ['Ağu', 'Bilirkişi raporu'], ['14 Eyl', 'Duruşma']].map(([date, event]) => <div key={event}><b>{date}</b><i /><span>{event}</span></div>)}</div>}
      {kind === 'precedents' && <div className="preview-source"><p>YARGITAY 9. HUKUK DAİRESİ</p><h4>E. 2023/7974 · K. 2023/11786</h4><span>Fazla çalışma / bordro / ispat</span><Mark>DOĞRULANDI</Mark></div>}
      {kind === 'legislation' && <div className="preview-source legislation"><p>RESMÎ KAYNAK</p><h4>Madde 41 · Fazla çalışma</h4><span>Özet ve resmî metin ayrımıyla kaydedilir.</span><Mark>DOĞRULANDI</Mark></div>}
      {kind === 'calendar' && <div className="preview-deadlines"><div><b>02</b><span>EYL</span><p>Bilirkişi raporuna itiraz</p></div><div><b>14</b><span>EYL</span><p>Duruşma · 10:00</p></div><div><b>05</b><span>EYL</span><p>Rapor inceleme</p></div></div>}
      {kind === 'drafts' && <div className="preview-list drafts">{[['Dava Dilekçesi', 'Onaylandı'], ['Cevap Dilekçesi', 'Avukat İncelemesinde'], ['Bilirkişi Raporuna İtiraz', 'Taslak']].map(([name, status]) => <div key={name}><FileText size={13} /><b>{name}</b><span>{status}</span></div>)}</div>}
    </section></div>
  </div>;
}

function InteractiveFeatureShowcase() {
  const features: { label: string; kind: PreviewKind }[] = [{ label: 'Belgeler', kind: 'documents' }, { label: 'Delil Matrisi', kind: 'evidence' }, { label: 'Kronoloji', kind: 'timeline' }, { label: 'Emsal Bağlantıları', kind: 'precedents' }];
  const [active, setActive] = useState<PreviewKind>('documents');
  return <section className="evidence-section" id="belge-delil"><div className="evidence-content"><SectionIntro number="04" eyebrow="BELGE VE DELİL" title={<>Belgeleri yalnızca saklamayın.<br /><i>Dosyanın içindeki ilişkileri görün.</i></>} copy="Dağınık kayıtları dosya bağlamında okuyun; iddiayı destekleyen, karşılayan ve eksik kalan delilleri birlikte değerlendirin." /><div className="feature-selector" role="tablist" aria-label="Belge ve delil çalışma alanı">{features.map((feature) => <button key={feature.kind} role="tab" aria-selected={active === feature.kind} onClick={() => setActive(feature.kind)} className={active === feature.kind ? 'active' : ''}><span>{String(features.indexOf(feature) + 1).padStart(2, '0')}</span>{feature.label}</button>)}</div></div><ProductPreview kind={active} /></section>;
}

function WorkflowShowcase() {
  const steps: { label: string; kind: PreviewKind }[] = [{ label: 'Dava Dosyası', kind: 'case' }, { label: 'Belgeler', kind: 'documents' }, { label: 'Deliller', kind: 'evidence' }, { label: 'Emsaller', kind: 'precedents' }, { label: 'Mevzuat', kind: 'legislation' }, { label: 'Süreler', kind: 'calendar' }, { label: 'Taslaklar', kind: 'drafts' }];
  const [active, setActive] = useState<PreviewKind>('case');
  return <section className="principle-section workflow-showcase" id="dava-yonetimi"><SectionIntro number="02" eyebrow="ÇALIŞMA PRENSİBİ" title={<>Dosya merkezli <i>çalışma.</i></>} copy="Her dava; belgeleri, delilleri, araştırmaları, duruşmaları, süreleri ve hukuki değerlendirmeleriyle tek bir çalışma alanında tutulur." /><div className="workflow-interaction"><div className="workflow-steps" role="tablist" aria-label="Dava dosyası çalışma akışı">{steps.map((step, index) => <button key={step.kind} role="tab" aria-selected={active === step.kind} onClick={() => setActive(step.kind)} className={active === step.kind ? 'active' : ''}><span>{String(index + 1).padStart(2, '0')}</span><b>{step.label}</b><ArrowRight size={14} /></button>)}</div><ProductPreview kind={active} /></div></section>;
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navRef = useRef<HTMLElement>(null);
  const closeMenu = () => { setMenuOpen(false); setOpenGroup(null); };

  useEffect(() => { document.title = 'HukukAI — Hukuk Çalışma Sistemi'; }, []);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (navRef.current && event.target instanceof Node && !navRef.current.contains(event.target)) setOpenGroup(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpenGroup(null); setMenuOpen(false); }
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('mousedown', closeOnOutside); document.removeEventListener('keydown', closeOnEscape); };
  }, []);

  useEffect(() => {
    const openLinkedPracticeArea = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target instanceof HTMLDetailsElement && target.id.startsWith('practice-')) target.open = true;
    };
    openLinkedPracticeArea();
    window.addEventListener('hashchange', openLinkedPracticeArea);
    return () => window.removeEventListener('hashchange', openLinkedPracticeArea);
  }, []);

  const validateForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string || '').trim();
    const phone = (fd.get('phone') as string || '').trim();
    const email = (fd.get('email') as string || '').trim();
    const message = (fd.get('message') as string || '').trim();
    const errors: Record<string, string> = {};
    if (!name) errors.name = 'Ad Soyad gerekli';
    if (!phone && !email) errors.contact = 'Telefon veya E-posta gerekli';
    if (!message) errors.message = 'Mesaj gerekli';
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) setFormSent(true);
  };
  return <div className="landing-page">
    <header className="landing-nav" ref={navRef}><Link href="/" className="landing-logo"><span><Scale size={17} /></span>Hukuk<em>AI</em></Link><nav className={`landing-nav-links ${menuOpen ? 'open' : ''}`} aria-label="Ana gezinme">{navigationGroups.map((group) => <div className="nav-group" key={group.label}><button type="button" aria-expanded={openGroup === group.label} aria-controls={`nav-${group.label.toLocaleLowerCase('tr-TR').replaceAll(' ', '-')}`} onClick={() => setOpenGroup((current) => current === group.label ? null : group.label)}>{group.label}<ChevronDown size={13} /></button><div className={`nav-dropdown ${openGroup === group.label ? 'open' : ''}`} id={`nav-${group.label.toLocaleLowerCase('tr-TR').replaceAll(' ', '-')}`} role="menu">{group.items.map(([label, href]) => <Link key={label} href={href} role="menuitem" onClick={closeMenu}>{label}</Link>)}</div></div>)}<Link href="/duyurular" onClick={closeMenu}>Duyurular</Link><Link href="/iletisim" onClick={closeMenu}>İletişim</Link><Link href="/login" onClick={closeMenu} className="nav-demo-mobile">Demoyu İncele <ArrowRight size={14} /></Link></nav><Link href="/login" className="nav-cta">Demoyu İncele <ArrowRight size={14} /></Link><button className="menu-toggle" onClick={() => { setMenuOpen((value) => !value); setOpenGroup(null); }} aria-label="Menüyü aç veya kapat" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button></header>

    <main>
      <section className="hero-section"><div className="hero-copy"><p className="landing-kicker"><span>01</span>HUKUK ÇALIŞMA SİSTEMİ</p><h1>Dava, belge, emsal ve süre yönetimini <i>tek çalışma alanında</i> birleştirin.</h1><p className="hero-description">HukukAI; dava yönetimini, belge ve delil analizini, emsal araştırmasını, mevzuat takibini ve süre yönetimini tek bir kurumsal sistemde birleştirir.</p><div className="hero-actions"><Link href="/login" className="button-primary">Demoyu İncele <ArrowRight size={16} /></Link><a href="#dava-yonetimi" className="button-secondary">Nasıl Çalışır? <ChevronDown size={15} /></a></div><p className="trust-line"><span /> Kurgusal demo dosyaları <i>·</i> Doğrulanmış kamu kaynakları</p></div><div className="hero-visual"><HeroSimulation /></div></section>

      <WorkflowShowcase />

      <section className="workspace-section" id="urun"><SectionIntro number="03" eyebrow="DAVA YÖNETİMİ" title={<>Bir dava dosyasının tamamını <i>tek ekranda</i> yönetin.</>} copy="Dosyanın hangi aşamada olduğunu, hangi belgelerin eksik kaldığını ve sıradaki hukuki işi aynı bağlamda görün." /><ProductFrame /></section>

      <InteractiveFeatureShowcase />

      <section className="landing-hub" aria-labelledby="landing-hub-title">
        <div className="landing-hub-heading"><p className="landing-kicker"><span>05</span>ÇALIŞMA ALANLARI</p><h2 id="landing-hub-title">İhtiyacınız olan ayrıntıya <i>doğrudan gidin.</i></h2><p>HukukAI’nin her çalışma alanı, kendi örneği ve iş akışıyla ayrı bir bilgi sayfasında anlatılır.</p></div>
        <div className="landing-hub-grid">
          {[['Belge ve Delil', 'İddia, karşı delil ve eksik kayıtları aynı bağlamda inceleyin.', '/belge-delil'], ['Emsal Araştırma', 'Emsal ilkeleri kaynak ve doğrulama durumu ile değerlendirin.', '/emsal-arastirma'], ['Mevzuat', 'Resmî metin, özet ve dosya yorumunu birbirinden ayırın.', '/mevzuat?public=1'], ['Takvim ve Süreler', 'Duruşma, son süre ve dosya işlerini ortak gündemde tutun.', '/takvim-sureler'], ['Taslaklar', 'Taslağı, avukat incelemesini ve onay durumunu görün.', '/taslaklar'], ['Hukuki Asistan', 'Dosya bağlamında çalışma desteğinin sınırlarını inceleyin.', '/hukuki-asistan']].map(([title, copy, href], index) => <Link href={href} key={title} className="landing-hub-card"><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy}</p><b>İncele <ArrowRight size={14} /></b></Link>)}
        </div>
        <div className="landing-hub-meta"><div><p>HUKUKAI HAKKINDA</p><span>Ürün sahibi Mehmet Cam ile hukuki danışman Av. Behçet Alp’in rolleri açıkça ayrılmıştır.</span><Link href="/hakkinda">Hakkında sayfası <ArrowRight size={14} /></Link></div><div><p>İLETİŞİM</p><span>Demo, çalışma modeli veya hukuk bürosu ihtiyaçları için doğrudan iletişim bilgilerine ulaşın.</span><Link href="/iletisim">İletişim bilgileri <ArrowRight size={14} /></Link></div></div>
      </section>

      <div className="home-detail-content">
      <section className="sources-section" id="kaynaklar"><SectionIntro number="05" eyebrow="KAYNAK BÜTÜNLÜĞÜ" title={<>Kaynak ile yorum <i>birbirinden ayrılır.</i></>} copy="HukukAI, hukuki değerlendirmeleri resmî kaynaklardan ayrı gösterir. Emsal kararlar ve mevzuat kayıtları kaynak, tarih ve doğrulama durumu ile sunulur." centered /><div className="source-grid"><SourcePanel type="YARGITAY" title="Yargıtay 9. Hukuk Dairesi" detail="Fazla çalışma / bordro / ispat" href="https://www.alomaliye.com/2026/08/25/ucret-hesap-pusulasi-rehberi-2026/"><div className="ek-grid"><span>E. <b>2023/7974</b></span><span>K. <b>2023/11786</b></span><span>Tarih <b>12.09.2023</b></span></div><Mark>DOĞRULANDI</Mark></SourcePanel><SourcePanel type="MEVZUAT" title="4857 Sayılı İş Kanunu" detail="Madde 41 · Fazla çalışma ücreti" href="https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm"><p className="law-summary">ÖZET · Haftalık kırk beş saati aşan çalışmalar için ücret hesabına ilişkin hüküm.</p><Mark>DOĞRULANDI</Mark></SourcePanel></div><div className="gazette-strip"><div><p>RESMÎ GAZETE ENTEGRASYONU</p><h3>Kamu kaynaklarını dosya bağlamında izlemek için hazırlanmış yapı.</h3></div><span><ShieldCheck size={17} /> Kaynak ve erişim durumu görünür kılınır</span></div></section>

      <section className="research-section" id="emsal-kararlar"><div className="research-head"><SectionIntro number="06" eyebrow="EMSAL ARAŞTIRMASI" title={<>Emsal araştırmasını dosyanın <i>bağlamından çıkarın.</i></>} copy="Arama sonuçlarını yalnızca listelemeyin; dosyanın delilleri ve hukuki sorusuyla birlikte değerlendirin." /><div className="research-query"><Search size={16} /><span>“Fazla çalışma — imzalı bordro — tanık delili”</span></div></div><div className="research-results">{[['LEHE', 'Yargıtay 9. HD', 'E. 2023/7974 · K. 2023/11786', 'Sembolik tahakkuklar ve mahsup'], ['ALEYHE', 'Yargıtay 9. HD', 'E. 2024/7636 · K. 2024/12837', 'İşyeri kayıtları ve tanık değerlendirmesi'], ['KARMA', '4857 Sayılı İş Kanunu', 'Madde 41', 'Fazla çalışma hesabı']].map(([type, court, id, principle]) => <article key={type}><span className={`research-type ${type.toLocaleLowerCase('tr-TR')}`}>{type}</span><h3>{court}</h3><p>{id}</p><strong>{principle}</strong><Mark>DOĞRULANDI</Mark></article>)}</div></section>

      <section className="counterparty-section"><div className="current-file"><p className="landing-kicker"><span>07</span>DOSYA OKUMASI</p><h2>Dosyaya karşı tarafın açısından da bakın.</h2><p>Tek taraflı dosya özetinin ötesine geçin; muhtemel karşı argümanları ve hazırlanması gerekenleri çalışma alanında görün.</p><div className="argument-card"><p>MEVCUT DOSYA</p><h3>Fazla çalışma talebi</h3><span>Destekleyen kayıtlar <b>WhatsApp · Tanık</b></span><span>İncelenecek nokta <b>Kart kayıtları</b></span></div></div><div className="counter-analysis"><p>KARŞI TARAF ANALİZİ</p>{['Muhtemel Karşı Argümanlar', 'Kullanabilecekleri Deliller', 'Dosyamızdaki Zayıf Noktalar', 'Hazırlanması Gerekenler'].map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, '0')}</span><h3>{item}</h3><ArrowRight size={16} /></div>)}</div></section>

      <section className="memory-section"><SectionIntro number="08" eyebrow="HUKUKİ HAFIZA" title={<>Geçmiş dosyalar yalnızca <i>arşivde kalmaz.</i></>} copy="Benzer dosyaları, kullanılan argümanları, avukat notlarını ve sonuçları yeni çalışma bağlamında görün." /><div className="memory-layout"><div className="memory-current"><p>MEVCUT DOSYA</p><h3>2026/145</h3><span>İşçilik Alacağı</span></div><div className="similar-cases">{[['2024/381', '%90', 'Kısmen Kabul', 'Bordro ve tanık dengesi'], ['2025/077', '%82', 'Kabul', 'Fazla çalışma hesabı']].map(([id, similarity, outcome, note]) => <article key={id}><p>BENZER DOSYA</p><h3>{id}<small>Semantik benzerlik <b>{similarity}</b></small></h3><span>{outcome}</span><em>Kullanılan argüman · {note}</em></article>)}</div></div></section>

      <section className="calendar-section" id="takvim"><SectionIntro number="09" eyebrow="TAKVİM VE SÜRELER" title={<>Duruşmalar ve kritik süreler <i>tek takvimde.</i></>} copy="Dosya işleri, duruşmalar ve süreler ekip için ortak bir gündemde tutulur." centered /><CalendarVisual /></section>

      <section className="team-section" id="ekip"><div><SectionIntro number="10" eyebrow="EKİP ÇALIŞMASI" title={<>Dosya yalnızca <i>bir kişide kalmaz.</i></>} copy="Dosya sorumluluğu ve güncellemeler aynı çalışma bağlamında tutulur." /><div className="team-people"><div className="lead-lawyer"><span>BA</span><div><b>Av. Behçet Alp</b><small>Dosya Sorumlusu</small></div></div><div className="neutral-lawyers"><span><i>Ç</i> Çalışma Arkadaşı <small>Avukat</small></span><span><i>Ç</i> Çalışma Arkadaşı <small>Avukat</small></span></div></div></div><div className="activity-feed"><p>GÜNCEL HAREKETLER</p>{['Bilirkişi raporu inceleme notu eklendi', 'Emsal araştırması güncellendi', 'Duruşma hazırlık notu eklendi'].map((item, i) => <div key={item}><span>{['09:14', '09:21', '09:32'][i]}</span><i /><b>{item}</b></div>)}</div></section>

      <section className="mobile-section" id="mobil"><div className="mobile-copy"><SectionIntro number="11" eyebrow="MOBİL DENEYİM" title={<>Ofiste, duruşma öncesinde <i>veya yolda.</i></>} copy="Dosya önceliklerini, yaklaşan süreleri ve doğrulanmış kaynak kayıtlarını gerektiğinde yanınızda görün." /><Link href="/login" className="text-link">Demo çalışma alanını aç <ArrowRight size={16} /></Link></div><div className="phone"><div className="phone-island" /><div className="phone-screen"><div className="phone-head"><span>09:41</span><b>HukukAI</b><i>•••</i></div><p>DAVA DOSYASI</p><h3>2026/145</h3><span>İşçilik Alacağı</span><div className="phone-alert"><small>SON SÜRE · 02 EYL</small><b>Bilirkişi raporuna itiraz</b></div><div className="phone-precedent"><small>DOĞRULANMIŞ EMSAL</small><b>Yargıtay 9. HD</b><span>E. 2023/7974 · K. 2023/11786</span></div><div className="phone-agenda"><small>BUGÜNÜN GÜNDEMİ</small><b>Rapor inceleme</b><span>Takvim · 14:00</span></div></div></div></section>

      <section className="trust-section"><SectionIntro number="12" eyebrow="GÜVEN İLKELERİ" title={<>Hukuki çalışmada güven, <i>özellikten önce gelir.</i></>} centered /><div className="trust-grid">{['Kaynak doğrulama', 'Avukat kontrolü', 'Demo ve gerçek veri ayrımı', 'Kaynak provenance', 'Kurumsal mimari', 'Yetkilendirme için hazırlanmış yapı'].map(item => <div key={item}><ShieldCheck size={16} /><span>{item}</span></div>)}</div></section>

      <section className="workflow-section"><div className="workflow-heading"><p className="landing-kicker"><span>13</span>GÜNLÜK AKIŞ</p><h2>Bir çalışma gününün <i>dosya izi.</i></h2><small>Demo simülasyonu</small></div><div className="workflow-line">{[['09:10', 'Yeni belge eklendi'], ['09:14', 'Delil matrisi güncellendi'], ['09:21', 'Emsal araştırması tamamlandı'], ['09:32', 'Yaklaşan süre takvime işlendi'], ['09:45', 'Taslak avukat incelemesine hazır']].map(([time, event], i) => <div key={time}><span>{time}</span><i>{i + 1}</i><p>{event}</p></div>)}</div></section>

      <section className="profile-section" id="hakkinda">
        <SectionIntro number="14" eyebrow="HAKKINDA" title={<>Hakkında <i>HukukAI</i></>} copy="HukukAI; hukuk profesyonelleri için dava, belge, delil, emsal, mevzuat ve süre yönetimini tek bir çalışma alanında birleştiren bir hukuk çalışma sistemidir." />
        <div className="ownership-grid">
          <article className="ownership-card">
            <span className="ownership-monogram">MC</span>
            <p className="ownership-role">ÜRÜN SAHİBİ &amp; GELİŞTİRİCİ</p>
            <h3>Mehmet Cam</h3>
            <p className="ownership-subtitle">AI Systems Builder · Data Scientist · EU Innovation Strategist</p>
            <p className="ownership-subtitle">Founder of CamFrontier</p>
            <p className="ownership-bio">Yapay zekâ destekli sistemler, veri zekâsı platformları ve uygulamalı araştırma altyapıları geliştiren Mehmet Cam; farklı alanlardaki veriyi, karar süreçlerini ve uzman bilgisini tek sistem içinde bir araya getiren çözümler tasarlar.</p>
            <p className="ownership-bio">HukukAI, bu yaklaşımın hukuk profesyonellerinin dava, belge, delil, emsal, mevzuat ve süre yönetimine uygulanmış ürünüdür.</p>
            <ul className="ownership-expertise">
              {['Yapay Zekâ ve Otomasyon Sistemleri', 'Veri Bilimi ve Öngörücü Analitik', 'AB Araştırma ve İnovasyon', 'Coğrafi Bilgi Sistemleri', 'Uygulamalı Araştırma Sistemleri'].map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="ownership-links">
              <a href="https://linkedin.com/in/mehmet-cam09" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={12} /></a>
              <a href="https://github.com/mehmetcamofficial" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={12} /></a>
              <a href="https://mehmetcamofficial.github.io" target="_blank" rel="noopener noreferrer">Website <ArrowUpRight size={12} /></a>
            </div>
          </article>
          <article className="ownership-card advisor-card">
            <span className="ownership-monogram advisor-monogram">BA</span>
            <p className="ownership-role">HUKUKİ DANIŞMAN</p>
            <h3>Av. Behçet Alp</h3>
            <p className="ownership-subtitle">Hukuki Danışman — HukukAI</p>
            <p className="ownership-bio">Ürünün hukuk pratiğine uygunluğu, dava çalışma süreçleri ve hukuk profesyonellerinin ihtiyaçları konusunda danışmanlık sağlar.</p>
          </article>
        </div>
        <div className="lawyer-profile-row">
          <p className="landing-kicker"><span>14.1</span>AVUKAT PROFİLİ</p>
          <div className="lawyer-profile-grid">
            <div className="profile-monogram"><span>BA</span><p>1982<br />Kuşadası</p></div>
            <div>
              <h3 className="lawyer-profile-name">Av. Behçet Alp</h3>
              <p className="landing-copy">Kurucu Ortak · Alp Hukuk Bürosu</p>
              <div className="profile-biography"><p>İstanbul Kültür Üniversitesi Hukuk Fakültesi’nden 2004 yılında mezun oldu. 2007 yılında Kuşadası’nda kendi hukuk bürosunu kurdu.</p><p>Mesleki faaliyetlerini Alp Hukuk Bürosu ve B&B Avukatlık Ortaklığı bünyesinde; yerel ve uluslararası müvekkillerle yürütmektedir.</p></div>
              <a href="#iletisim" className="text-link profile-link">İletişime geçin <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="practice-section" id="hizmet-alanlari"><SectionIntro number="15" eyebrow="HİZMET ALANLARI" title={<>Hukuki ihtiyaçlara <i>odaklı yaklaşım.</i></>} copy="Her çalışma alanı, somut ihtiyacın kapsamına ve izlenecek hukuki sürece göre değerlendirilir." /><div className="practice-grid">{practiceAreas.map((area, index) => <details id={`practice-${index}`} key={area.title} className="practice-card"><summary><span>{String(index + 1).padStart(2, '0')}</span><h3>{area.title}</h3><ChevronDown size={17} /></summary><p>{area.summary}</p><small>{area.services}</small></details>)}</div></section>

      <section className="principles-section" id="calisma-ilkeleri"><div className="principles-intro"><SectionIntro number="16" eyebrow="ÇALIŞMA İLKELERİMİZ" title={<>Özenli, şeffaf ve <i>dosya odaklı.</i></>} copy="Hukuki hizmetin her aşamasında iletişim ve süreç yönetimine ilişkin temel yaklaşım." /></div><div className="principles-list">{principles.map((principle, index) => <div key={principle}><span>{String(index + 1).padStart(2, '0')}</span><h3>{principle}</h3><Check size={16} /></div>)}</div></section>

      <section className="announcements-section" id="duyurular"><SectionIntro number="17" eyebrow="DUYURULAR" title={<>Güncel <i>bilgilendirmeler.</i></>} /><div className="announcement-list">{demoAnnouncements.filter((item) => item.status === 'published').map((item) => <article key={item.id}><p>{item.category}</p><h3>{item.title}</h3><span>{item.excerpt}</span><button type="button" aria-label={`${item.title} duyurusunu oku`}>Duyuruyu Oku <ArrowRight size={15} /></button></article>)}</div></section>

      <section className="faq-section" id="sss"><SectionIntro number="18" eyebrow="SIKÇA SORULANLAR" title={<>İlk çerçeve için <i>bilgilendirme.</i></>} copy="Genel bilgi amaçlıdır; somut olayın koşullarına göre hukuki değerlendirme değişebilir." centered /><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, '0')}</span><h3>{question}</h3><ChevronDown size={17} /></summary><p>{answer}</p></details>)}</div></section>

      <section className="contact-section" id="iletisim">
        <SectionIntro number="19" eyebrow="İLETİŞİM" title={<>Av. Behçet Alp ile <i>iletişime geçin.</i></>} copy="HukukAI demosunu incelemek, çalışma modelini değerlendirmek veya hukuk bürosu ihtiyaçlarını konuşmak için iletişime geçebilirsiniz." />
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-card-header">
              <div className="contact-avatar">BA</div>
              <div>
                <h3>Avukat Behçet Alp</h3>
                <p>Kuşadası / Aydın</p>
              </div>
            </div>
            <address className="contact-details">
              <div className="contact-row">
                <MapPin size={15} />
                <span>İnönü Bulv. Ege İş Hanı 83/9<br />Kuşadası / Aydın</span>
              </div>
              <div className="contact-row">
                <Phone size={15} />
                <a href="tel:+902566142233" aria-label="Telefon: (0256) 614 22 33">(0256) 614 22 33</a>
              </div>
              <div className="contact-row">
                <Globe size={15} />
                <a href="http://www.behcetalp.av.tr/" target="_blank" rel="noopener noreferrer" aria-label="Web sitesini aç (yeni sekme)">behcetalp.av.tr <ExternalLink size={11} /></a>
              </div>
              <div className="contact-row contact-rating">
                <Star size={15} />
                <span><strong>5,0</strong> · 11 Google yorumu</span>
              </div>
            </address>
            <div className="contact-actions">
              <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x14bea92e87fa652f:0xb952932c874c7131?sa=X&ved=1t:8290&ictx=111" target="_blank" rel="noopener noreferrer" className="button-primary contact-btn" aria-label="Google Haritalar'da yol tarifi al (yeni sekme)">
                <MapPin size={15} /> Yol Tarifi Al
              </a>
              <a href="tel:+902566142233" className="button-secondary contact-btn" aria-label="Telefon et">
                <Phone size={15} /> Ara
              </a>
              <a href="http://www.behcetalp.av.tr/" target="_blank" rel="noopener noreferrer" className="button-secondary contact-btn" aria-label="Web sitesini aç (yeni sekme)">
                <Globe size={15} /> Web Sitesini Aç
              </a>
            </div>
            <div className="contact-map-card">
              <div className="contact-map-visual">
                <MapPin size={24} />
                <span>Kuşadası / Aydın</span>
              </div>
              <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x14bea92e87fa652f:0xb952932c874c7131?sa=X&ved=1t:8290&ictx=111" target="_blank" rel="noopener noreferrer" className="map-link">
                Yol Tarifi Al <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="contact-form-wrap">
            {formSent ? (
              <div className="contact-form-success">
                <Check size={20} />
                <p>Demo iletişim formu — gerçek gönderim altyapısı henüz bağlı değildir.</p>
                <span>Form içeriğiniz korunmuştur. Teşekkürler.</span>
              </div>
            ) : (
              <form onSubmit={validateForm} noValidate className="contact-form">
                <div className="form-field">
                  <label htmlFor="contact-name">Ad Soyad</label>
                  <input id="contact-name" name="name" type="text" required placeholder="Adınız Soyadınız" />
                  {formErrors.name && <span className="form-error" role="alert">{formErrors.name}</span>}
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="contact-phone">Telefon</label>
                    <input id="contact-phone" name="phone" type="tel" placeholder="(0XXX) XXX XX XX" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email">E-posta</label>
                    <input id="contact-email" name="email" type="email" placeholder="ornek@ornek.com" />
                  </div>
                </div>
                {formErrors.contact && <span className="form-error form-error-global" role="alert">{formErrors.contact}</span>}
                <div className="form-field">
                  <label htmlFor="contact-subject">Konu</label>
                  <select id="contact-subject" name="subject" defaultValue="">
                    <option value="" disabled>Seçiniz</option>
                    <option>HukukAI Demo</option>
                    <option>Hukuki Hizmet</option>
                    <option>Randevu Talebi</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="contact-message">Mesaj</label>
                  <textarea id="contact-message" name="message" rows={4} required placeholder="Mesajınızı yazın" />
                  {formErrors.message && <span className="form-error" role="alert">{formErrors.message}</span>}
                </div>
                <button type="submit" className="button-primary contact-submit">
                  <Send size={14} /> Mesaj Gönder
                </button>
                <p className="form-privacy">Bu form demo amaçlıdır. Gerçek iletişim gönderimi henüz aktif değildir.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      </div>
      <section className="final-cta"><p className="landing-kicker"><span>20</span>HUKUKAI DEMO</p><h2>Hukuk çalışmalarını <i>tek bir sistemde görün.</i></h2><p>HukukAI demosunda dava yönetimini, belge analizini, emsal araştırmasını ve süre takibini birlikte inceleyin.</p><div><Link href="/login" className="button-primary">Demoyu Aç <ArrowRight size={16} /></Link><Link href={caseHref} className="button-secondary">2026/145 Dosyasını İncele <ArrowRight size={15} /></Link></div></section>
      <aside className="legal-notice" aria-label="Hukuki bilgilendirme"><ShieldCheck size={16} /><p>Bu sitedeki içerikler genel bilgilendirme amaçlıdır ve hukuki görüş yerine geçmez. Site üzerinden bilgi paylaşılması tek başına avukat-müvekkil ilişkisi oluşturmaz.</p></aside>
    </main>
    <footer className="landing-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-brand">
            <Link href="/" className="landing-logo"><span><Scale size={15} /></span>Hukuk<em>AI</em></Link>
            <p className="footer-tagline">Hukuk profesyonelleri için geliştirilen dava ve hukuki çalışma platformu.</p>
          </div>
          <div className="footer-credit">
            <p className="footer-credit-role">ÜRÜN SAHİBİ &amp; GELİŞTİRİCİ</p>
            <p className="footer-credit-name">Mehmet Cam</p>
            <div className="footer-credit-links">
              <a href="https://linkedin.com/in/mehmet-cam09" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/mehmetcamofficial" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://mehmetcamofficial.github.io" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
          </div>
          <div className="footer-credit">
            <p className="footer-credit-role">HUKUKİ DANIŞMAN</p>
            <p className="footer-credit-name">Av. Behçet Alp</p>
            <address className="footer-address">
              İnönü Bulv. Ege İş Hanı 83/9, Kuşadası / Aydın<br />
              <a href="tel:+902566142233" aria-label="Telefon">(0256) 614 22 33</a> · <a href="http://www.behcetalp.av.tr/" target="_blank" rel="noopener noreferrer" aria-label="Web sitesi">behcetalp.av.tr</a>
            </address>
          </div>
        </div>
        <nav className="footer-links" aria-label="Alt menü">
          <Link href="/urun">Ürün</Link>
          <Link href="/iletisim">İletişim</Link>
          <Link href="/login">Demoyu İncele</Link>
          <Link href="/">Ana Sayfa</Link>
        </nav>
        <p className="footer-copy">Kurgusal demo deneyimi · Hukuki görüş veya tavsiye değildir.</p>
      </div>
    </footer>
  </div>;
}
