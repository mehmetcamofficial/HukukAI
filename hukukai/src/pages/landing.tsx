import { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, FileText,
  Gavel, Menu, Scale, Search, ShieldCheck, X,
} from 'lucide-react';

const caseHref = '/davalar/case-2026-145';

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

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <div className="landing-page">
    <header className="landing-nav"><Link href="/" className="landing-logo"><span><Scale size={17} /></span>Hukuk<em>AI</em></Link><nav className={menuOpen ? 'open' : ''}><a href="#urun" onClick={closeMenu}>Ürün</a><a href="#dava-yonetimi" onClick={closeMenu}>Dava Yönetimi</a><a href="#kaynaklar" onClick={closeMenu}>Kaynaklar</a><a href="#takvim" onClick={closeMenu}>Takvim</a><a href="#mobil" onClick={closeMenu}>Mobil</a><Link href="/app" onClick={closeMenu} className="nav-demo-mobile">Demoyu İncele <ArrowRight size={14} /></Link></nav><Link href="/app" className="nav-cta">Demoyu İncele <ArrowRight size={14} /></Link><button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Menüyü aç veya kapat">{menuOpen ? <X /> : <Menu />}</button></header>

    <main>
      <section className="hero-section"><div className="hero-copy"><p className="landing-kicker"><span>01</span>HUKUK ÇALIŞMA SİSTEMİ</p><h1>Dava, belge, emsal ve süre yönetimini <i>tek çalışma alanında</i> birleştirin.</h1><p className="hero-description">HukukAI; dava yönetimini, belge ve delil analizini, emsal araştırmasını, mevzuat takibini ve süre yönetimini tek bir kurumsal sistemde birleştirir.</p><div className="hero-actions"><Link href="/app" className="button-primary">Demoyu İncele <ArrowRight size={16} /></Link><a href="#nasil-calisir" className="button-secondary">Nasıl Çalışır? <ChevronDown size={15} /></a></div><p className="trust-line"><span /> Kurgusal demo dosyaları <i>·</i> Doğrulanmış kamu kaynakları</p></div><div className="hero-visual"><HeroSimulation /></div></section>

      <section className="principle-section" id="nasil-calisir"><SectionIntro number="02" eyebrow="ÇALIŞMA PRENSİBİ" title={<>Dosya merkezli <i>çalışma.</i></>} copy="Her dava; belgeleri, delilleri, araştırmaları, duruşmaları, süreleri ve hukuki değerlendirmeleriyle tek bir çalışma alanında tutulur." centered /><div className="case-architecture">{['Dava Dosyası', 'Belgeler', 'Deliller', 'Emsaller', 'Mevzuat', 'Süreler', 'Taslaklar'].map((item, i) => <div key={item} className={i === 0 ? 'architecture-root' : ''}><span>{String(i + 1).padStart(2, '0')}</span>{item}{i < 6 && <b>→</b>}</div>)}</div></section>

      <section className="workspace-section" id="urun"><SectionIntro number="03" eyebrow="DAVA YÖNETİMİ" title={<>Bir dava dosyasının tamamını <i>tek ekranda</i> yönetin.</>} copy="Dosyanın hangi aşamada olduğunu, hangi belgelerin eksik kaldığını ve sıradaki hukuki işi aynı bağlamda görün." /><ProductFrame /></section>

      <section className="evidence-section" id="dava-yonetimi"><div className="evidence-content"><SectionIntro number="04" eyebrow="BELGE VE DELİL" title={<>Belgeleri yalnızca saklamayın.<br /><i>Dosyanın içindeki ilişkileri görün.</i></>} copy="Dağınık kayıtları dosya bağlamında okuyun; iddiayı destekleyen, karşılayan ve eksik kalan delilleri birlikte değerlendirin." /><div className="evidence-list">{['Bilirkişi Raporu', 'Dava Dilekçesi', 'Cevap Dilekçesi', 'Bordro', 'Puantaj', 'WhatsApp Dökümü'].map((file, i) => <div key={file}><span>{String(i + 1).padStart(2, '0')}</span><FileText size={15} />{file}<ArrowUpRight size={14} /></div>)}</div></div><div className="matrix-card"><div className="matrix-top"><p>DELİL MATRİSİ</p><h3>Fazla çalışma alacağı</h3><span>2026/145</span></div>{[['İddia', 'Haftalık fazla çalışma'], ['Destekleyen', 'WhatsApp · Tanık beyanı'], ['Karşı', 'İmzalı ücret bordrosu'], ['Eksik', 'Kartlı geçiş kayıtları'], ['Değerlendirme', 'Bordro ve puantaj karşılaştırılmalı']].map(([a,b], i) => <div className={`matrix-row row-${i}`} key={a}><b>{a}</b><span>{b}</span></div>)}</div></section>

      <section className="sources-section" id="kaynaklar"><SectionIntro number="05" eyebrow="KAYNAK BÜTÜNLÜĞÜ" title={<>Kaynak ile yorum <i>birbirinden ayrılır.</i></>} copy="HukukAI, hukuki değerlendirmeleri resmî kaynaklardan ayrı gösterir. Emsal kararlar ve mevzuat kayıtları kaynak, tarih ve doğrulama durumu ile sunulur." centered /><div className="source-grid"><SourcePanel type="YARGITAY" title="Yargıtay 9. Hukuk Dairesi" detail="Fazla çalışma / bordro / ispat" href="https://www.alomaliye.com/2026/08/25/ucret-hesap-pusulasi-rehberi-2026/"><div className="ek-grid"><span>E. <b>2023/7974</b></span><span>K. <b>2023/11786</b></span><span>Tarih <b>12.09.2023</b></span></div><Mark>DOĞRULANDI</Mark></SourcePanel><SourcePanel type="MEVZUAT" title="4857 Sayılı İş Kanunu" detail="Madde 41 · Fazla çalışma ücreti" href="https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm"><p className="law-summary">ÖZET · Haftalık kırk beş saati aşan çalışmalar için ücret hesabına ilişkin hüküm.</p><Mark>DOĞRULANDI</Mark></SourcePanel></div><div className="gazette-strip"><div><p>RESMÎ GAZETE ENTEGRASYONU</p><h3>Kamu kaynaklarını dosya bağlamında izlemek için hazırlanmış yapı.</h3></div><span><ShieldCheck size={17} /> Kaynak ve erişim durumu görünür kılınır</span></div></section>

      <section className="research-section"><div className="research-head"><SectionIntro number="06" eyebrow="EMSAL ARAŞTIRMASI" title={<>Emsal araştırmasını dosyanın <i>bağlamından çıkarın.</i></>} copy="Arama sonuçlarını yalnızca listelemeyin; dosyanın delilleri ve hukuki sorusuyla birlikte değerlendirin." /><div className="research-query"><Search size={16} /><span>“Fazla çalışma — imzalı bordro — tanık delili”</span></div></div><div className="research-results">{[['LEHE', 'Yargıtay 9. HD', 'E. 2023/7974 · K. 2023/11786', 'Sembolik tahakkuklar ve mahsup'], ['ALEYHE', 'Yargıtay 9. HD', 'E. 2024/7636 · K. 2024/12837', 'İşyeri kayıtları ve tanık değerlendirmesi'], ['KARMA', '4857 Sayılı İş Kanunu', 'Madde 41', 'Fazla çalışma hesabı']].map(([type, court, id, principle]) => <article key={type}><span className={`research-type ${type.toLocaleLowerCase('tr-TR')}`}>{type}</span><h3>{court}</h3><p>{id}</p><strong>{principle}</strong><Mark>DOĞRULANDI</Mark></article>)}</div></section>

      <section className="counterparty-section"><div className="current-file"><p className="landing-kicker"><span>07</span>DOSYA OKUMASI</p><h2>Dosyaya karşı tarafın açısından da bakın.</h2><p>Tek taraflı dosya özetinin ötesine geçin; muhtemel karşı argümanları ve hazırlanması gerekenleri çalışma alanında görün.</p><div className="argument-card"><p>MEVCUT DOSYA</p><h3>Fazla çalışma talebi</h3><span>Destekleyen kayıtlar <b>WhatsApp · Tanık</b></span><span>İncelenecek nokta <b>Kart kayıtları</b></span></div></div><div className="counter-analysis"><p>KARŞI TARAF ANALİZİ</p>{['Muhtemel Karşı Argümanlar', 'Kullanabilecekleri Deliller', 'Dosyamızdaki Zayıf Noktalar', 'Hazırlanması Gerekenler'].map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, '0')}</span><h3>{item}</h3><ArrowRight size={16} /></div>)}</div></section>

      <section className="memory-section"><SectionIntro number="08" eyebrow="HUKUKİ HAFIZA" title={<>Geçmiş dosyalar yalnızca <i>arşivde kalmaz.</i></>} copy="Benzer dosyaları, kullanılan argümanları, avukat notlarını ve sonuçları yeni çalışma bağlamında görün." /><div className="memory-layout"><div className="memory-current"><p>MEVCUT DOSYA</p><h3>2026/145</h3><span>İşçilik Alacağı</span></div><div className="similar-cases">{[['2024/381', '%90', 'Kısmen Kabul', 'Bordro ve tanık dengesi'], ['2025/077', '%82', 'Kabul', 'Fazla çalışma hesabı']].map(([id, similarity, outcome, note]) => <article key={id}><p>BENZER DOSYA</p><h3>{id}<small>Semantik benzerlik <b>{similarity}</b></small></h3><span>{outcome}</span><em>Kullanılan argüman · {note}</em></article>)}</div></div></section>

      <section className="calendar-section" id="takvim"><SectionIntro number="09" eyebrow="TAKVİM VE SÜRELER" title={<>Duruşmalar ve kritik süreler <i>tek takvimde.</i></>} copy="Dosya işleri, duruşmalar ve süreler ekip için ortak bir gündemde tutulur." centered /><CalendarVisual /></section>

      <section className="team-section"><div><SectionIntro number="10" eyebrow="EKİP ÇALIŞMASI" title={<>Dosya yalnızca <i>bir kişide kalmaz.</i></>} copy="Dosya üzerindeki güncellemeler, sorumluluklar ve inceleme notları aynı çalışma bağlamında kalır." /><div className="team-people"><div className="lead-lawyer"><span>BA</span><div><b>Av. Behçet Alp</b><small>Dosya Sorumlusu</small></div></div><div className="neutral-lawyers"><span><i>Ç</i> Çalışma Arkadaşı <small>Avukat</small></span><span><i>Ç</i> Çalışma Arkadaşı <small>Avukat</small></span></div></div></div><div className="activity-feed"><p>GÜNCEL HAREKETLER</p>{['Bilirkişi raporu inceleme notu eklendi', 'Emsal araştırması güncellendi', 'Duruşma hazırlık notu eklendi'].map((item, i) => <div key={item}><span>{['09:14', '09:21', '09:32'][i]}</span><i /><b>{item}</b></div>)}</div></section>

      <section className="mobile-section" id="mobil"><div className="mobile-copy"><SectionIntro number="11" eyebrow="MOBİL DENEYİM" title={<>Ofiste, duruşma öncesinde <i>veya yolda.</i></>} copy="Dosya önceliklerini, yaklaşan süreleri ve doğrulanmış kaynak kayıtlarını gerektiğinde yanınızda görün." /><Link href="/app" className="text-link">Demo çalışma alanını aç <ArrowRight size={16} /></Link></div><div className="phone"><div className="phone-island" /><div className="phone-screen"><div className="phone-head"><span>09:41</span><b>HukukAI</b><i>•••</i></div><p>DAVA DOSYASI</p><h3>2026/145</h3><span>İşçilik Alacağı</span><div className="phone-alert"><small>SON SÜRE · 02 EYL</small><b>Bilirkişi raporuna itiraz</b></div><div className="phone-precedent"><small>DOĞRULANMIŞ EMSAL</small><b>Yargıtay 9. HD</b><span>E. 2023/7974 · K. 2023/11786</span></div><div className="phone-agenda"><small>BUGÜNÜN GÜNDEMİ</small><b>Rapor inceleme</b><span>Takvim · 14:00</span></div></div></div></section>

      <section className="trust-section"><SectionIntro number="12" eyebrow="GÜVEN İLKELERİ" title={<>Hukuki çalışmada güven, <i>özellikten önce gelir.</i></>} centered /><div className="trust-grid">{['Kaynak doğrulama', 'Avukat kontrolü', 'Demo ve gerçek veri ayrımı', 'Kaynak provenance', 'Kurumsal mimari', 'Yetkilendirme için hazırlanmış yapı'].map(item => <div key={item}><ShieldCheck size={16} /><span>{item}</span></div>)}</div></section>

      <section className="workflow-section"><div className="workflow-heading"><p className="landing-kicker"><span>13</span>GÜNLÜK AKIŞ</p><h2>Bir çalışma gününün <i>dosya izi.</i></h2><small>Demo simülasyonu</small></div><div className="workflow-line">{[['09:10', 'Yeni belge eklendi'], ['09:14', 'Delil matrisi güncellendi'], ['09:21', 'Emsal araştırması tamamlandı'], ['09:32', 'Yaklaşan süre takvime işlendi'], ['09:45', 'Taslak avukat incelemesine hazır']].map(([time, event], i) => <div key={time}><span>{time}</span><i>{i + 1}</i><p>{event}</p></div>)}</div></section>

      <section className="final-cta"><p className="landing-kicker"><span>14</span>HUKUKAI DEMO</p><h2>Hukuk çalışmalarını <i>tek bir sistemde görün.</i></h2><p>HukukAI demosunda dava yönetimini, belge analizini, emsal araştırmasını ve süre takibini birlikte inceleyin.</p><div><Link href="/app" className="button-primary">Demoyu Aç <ArrowRight size={16} /></Link><Link href={caseHref} className="button-secondary">2026/145 Dosyasını İncele <ArrowRight size={15} /></Link></div></section>
    </main>
    <footer className="landing-footer"><Link href="/" className="landing-logo"><span><Scale size={15} /></span>Hukuk<em>AI</em></Link><p>Kurgusal demo deneyimi · Hukuki görüş veya tavsiye değildir.</p><Link href="/app">Çalışma alanı <ArrowRight size={14} /></Link></footer>
  </div>;
}
