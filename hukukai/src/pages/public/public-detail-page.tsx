import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Check, FileText } from 'lucide-react';
import { demoAnnouncements } from '@/lib/demo-announcements';
import { PublicPageLayout } from '@/components/public/public-page-layout';

export type PublicPageId =
  | 'product'
  | 'documents'
  | 'precedents'
  | 'legislation'
  | 'calendar'
  | 'drafts'
  | 'assistant'
  | 'services'
  | 'about'
  | 'announcements';

type ActiveNav = 'product' | 'services' | 'about' | 'announcements';

type PageData = {
  /** Short Title-Case label for the breadcrumb and browser title. */
  name: string;
  kicker: string;
  title: string;
  intro: string;
  active: ActiveNav;
  nav?: readonly string[];
  blocks: readonly [string, string][];
};

const pages: Record<PublicPageId, PageData> = {
  product: { name: 'Ürün', kicker: 'ÜRÜN GENEL BAKIŞ', title: 'Hukuki çalışmanın tamamı, aynı sistemde.', intro: 'HukukAI; dava, belge, delil, emsal, mevzuat, takvim, taslak ve asistan çalışma alanlarını dosya bağlamında bir araya getirir.', active: 'product', nav: ['dava-yonetimi', 'belge-delil', 'kaynaklar'], blocks: [['Dava dosyası', 'Dosyanın tarafları, süreleri, belgeleri ve hukuki değerlendirmeleri aynı çalışma bağlamında tutulur.'], ['Kaynak bütünlüğü', 'Emsal ve mevzuat kayıtları, kaynak ve doğrulama durumuyla ayrı gösterilir.'], ['Ekip akışı', 'Süreçteki çalışmalar, dosya sorumluluğu ve inceleme notları birlikte izlenir.']] },
  documents: { name: 'Belge ve Delil Analizi', kicker: 'BELGE VE DELİL ANALİZİ', title: 'Dosyadaki ilişkileri görün.', intro: 'Belge kayıtları tek başına durmaz; iddia, karşı delil, eksik delil ve avukat değerlendirmesiyle dosya bağlamında okunur.', active: 'product', nav: ['belgeler', 'delil-matrisi', 'eksik-delil'], blocks: [['Belgeler', 'Bilirkişi raporu, dilekçeler, bordro, puantaj ve yazışmalar aynı dosya düzeninde listelenir.'], ['Delil matrisi', 'Destekleyen, karşılayan ve eksik kayıtlar iddia üzerinden yan yana değerlendirilir.'], ['Eksik delil', 'Kartlı geçiş kayıtları gibi tamamlanması gereken unsurlar açık biçimde işaretlenir.']] },
  precedents: { name: 'Emsal Karar Araştırması', kicker: 'EMSAL KARAR ARAŞTIRMASI', title: 'Emsali dosyanın bağlamıyla okuyun.', intro: 'Araştırma sonuçları lehe, aleyhe ve karma ilkelerle birlikte; kaynak, kimlik ve doğrulama durumu görünür biçimde sunulur.', active: 'product', nav: ['dogrulama-durumu', 'dosya-iliskisi', 'hukuki-hafiza'], blocks: [['Doğrulama durumu', 'DOĞRULANDI ve DOĞRULANAMADI kayıtları birbirine karıştırılmadan sunulur.'], ['Dosya ilişkisi', 'Kararın ilkesi, iddia ve delil bağlamıyla birlikte okunur.'], ['Hukuki hafıza', 'Benzer dosyalar semantik benzerlik göstergesiyle bulunur; sonuç tahmini yapılmaz.']] },
  legislation: { name: 'Mevzuat', kicker: 'MEVZUAT', title: 'Kaynak, özet ve yorumu ayırın.', intro: 'Kanun ve madde araştırması; resmî kaynağa bağlantı, özet bilgisi ve dosya bağlamındaki değerlendirmeyle düzenlenir.', active: 'product', nav: ['resmi-kaynak', 'ozet', 'surum-ve-baglam'], blocks: [['Resmî kaynak', 'Madde kimliği ve bağlantısı, özetten ayrı tutulur.'], ['Özet', 'Gösterilen özetler resmî metnin yerine geçmez.'], ['Sürüm ve bağlam', 'Değişiklik ve olası norm çatışmaları somut dosya kapsamında incelenir.']] },
  calendar: { name: 'Takvim ve Süreler', kicker: 'TAKVİM VE SÜRELER', title: 'Kritik dosya işlerini görün.', intro: 'Duruşmalar, son süreler, bilirkişi işleri, müvekkil görüşmeleri ve iç görevler ortak dosya gündeminde tutulur.', active: 'product', nav: ['dosya-takvim', 'takvim-dashboard', 'takvim-kronoloji'], blocks: [['Dosya → Takvim', 'Dava dosyasındaki tarih ve süreler ortak çalışma takvimine taşınır.'], ['Takvim → Dashboard', 'Yaklaşan işler genel bakışta öncelik olarak görünür.'], ['Takvim → Kronoloji', 'Tamamlanan ve planlanan hareketler dosya izine bağlanır.']] },
  drafts: { name: 'Taslaklar', kicker: 'TASLAKLAR', title: 'Taslağı, incelemeyi ve onayı ayırın.', intro: 'Dilekçe ve çalışma metinleri dosya kaynaklarıyla ilişkilendirilir; insan avukat incelemesi her zaman süreçte kalır.', active: 'product', nav: ['taslak', 'incelemede', 'onaylandi'], blocks: [['Taslak', 'Çalışma metni hazırlık durumunda tutulur.'], ['İncelemede', 'Taslak, avukat değerlendirmesi bekleyen açık bir durumla işaretlenir.'], ['Onaylandı', 'Onay, taslağın dosya içi çalışma durumudur; gönderim veya e-imza anlamına gelmez.']] },
  assistant: { name: 'Hukuki Asistan', kicker: 'HUKUKİ ASİSTAN', title: 'Dosya bağlamında çalışma desteği.', intro: 'Hukuki Asistan, ayrı bir marka değil; dosya, belge, süre ve kaynak çalışma alanını destekleyen bir ürün özelliğidir.', active: 'product', nav: ['eksik-deliller', 'sure-ozeti', 'kaynak-karsilastirmasi'], blocks: [['Eksik deliller', '“Bu dosyadaki eksik delilleri göster”'], ['Süre özeti', '“Yaklaşan süreleri özetle”'], ['Kaynak karşılaştırması', '“Emsal kararlarla çelişen noktaları göster”'], ['Taslak hazırlığı', '“Bilirkişi raporuna itiraz başlıklarını çıkar”']] },
  services: { name: 'Hizmet Alanları', kicker: 'HİZMET ALANLARI', title: 'Hukuki ihtiyaçlara odaklı yaklaşım.', intro: 'Alp Hukuk Bürosu ve B&B Avukatlık Ortaklığı bünyesinde, somut ihtiyacın kapsamına göre hukuk hizmeti değerlendirilir.', active: 'services', nav: ['ticaret', 'gayrimenkul', 'yabancilar'], blocks: [['Ticaret ve Şirketler Hukuku', 'Şirket kuruluşu, sözleşmeler ve uyuşmazlık yönetimi.'], ['Gayrimenkul ve Kira Hukuku', 'Kira tespit, tahliye ve taşınmaz işlemleri.'], ['Yabancılar Hukuku ve Uluslararası Yatırımlar', 'Yatırım süreçleri, ikamet ve yabancı unsurlu işlemler.'], ['Aile Hukuku ve Tanıma-Tenfiz', 'Boşanma, tanıma-tenfiz ve mal rejimi.'], ['İcra ve İflas Hukuku', 'İcra takibi, itiraz ve iflas süreçleri.'], ['İş Hukuku', 'İş sözleşmeleri, arabuluculuk ve dava takibi.']] },
  about: { name: 'Hakkında', kicker: 'HAKKINDA', title: 'Ürün amacı ve hukuki danışmanlık ayrı, birlikte.', intro: 'HukukAI; hukuk profesyonellerinin dosya çalışmalarını bütünleştirmek üzere geliştirilmiş bir ürün deneyimidir.', active: 'about', nav: ['mehmet-cam', 'behcet-alp', 'avukat-profili'], blocks: [['Mehmet Cam', 'Ürün Sahibi & Geliştirici · HukukAI ürününün sistem tasarımı ve geliştirme yönünden sorumludur.'], ['Av. Behçet Alp', 'Hukuki Danışman · Hukuk pratiğine uygunluk, dava çalışma süreçleri ve hukuk profesyonellerinin ihtiyaçları konusunda danışmanlık sağlar.'], ['Avukat profili', '1982 Kuşadası doğumlu Av. Behçet Alp, İstanbul Kültür Üniversitesi Hukuk Fakültesi’nden 2004 yılında mezun oldu; 2007 yılında Kuşadası’nda kendi hukuk bürosunu kurdu.']] },
  announcements: { name: 'Duyurular', kicker: 'DUYURULAR', title: 'Güncel bilgilendirmeler.', intro: 'HukukAI ve hukuk bürosu katmanına ilişkin duyurular, yayın durumu üzerinden merkezi olarak yönetilmeye hazır biçimde tutulur.', active: 'announcements', blocks: [['Yayın akışı', 'Duyurular; taslak, yayınlanmış kayıt ve ileride detay sayfası desteğine uygun bir veri yapısında tutulur.']] },
};

function PagePreview({ id }: { id: PublicPageId }) {
  if (id === 'assistant')
    return (
      <div className="detail-console">
        <p>HUKUKİ ASİSTAN <span>DEMO YANIT</span></p>
        <h3>Dosyadaki eksik deliller</h3>
        <div><b>Eksik kayıtlar</b><span>Kartlı geçiş kayıtları · İş yeri güvenlik kamerası kayıtları</span></div>
        <div><b>İnceleme notu</b><span>Bu kayıtlar, fazla çalışma iddiasının değerlendirilmesinde tamamlanmalıdır.</span></div>
      </div>
    );
  if (id === 'calendar')
    return (
      <div className="detail-calendar">
        <p>EYLÜL 2026</p>
        {[['02', 'Son Süre', 'Bilirkişi raporuna itiraz'], ['05', 'Bilirkişi', 'Rapor inceleme'], ['14', 'Duruşma', 'Rapor değerlendirmesi']].map(([day, kind, title]) => (
          <div key={day}><b>{day}</b><span><small>{kind}</small>{title}</span></div>
        ))}
      </div>
    );
  if (id === 'precedents')
    return (
      <div className="detail-source">
        <p>YARGITAY 9. HUKUK DAİRESİ</p>
        <h3>E. 2023/7974 · K. 2023/11786</h3>
        <span>Fazla çalışma / bordro / ispat</span>
        <b><Check size={12} /> DOĞRULANDI</b>
      </div>
    );
  if (id === 'legislation')
    return (
      <div className="detail-source">
        <p>4857 SAYILI İŞ KANUNU</p>
        <h3>Madde 41 · Fazla çalışma</h3>
        <span>ÖZET · Resmî metin ve kaynak bağlantısı ayrı sunulur.</span>
        <b><Check size={12} /> DOĞRULANDI</b>
      </div>
    );
  if (id === 'drafts')
    return (
      <div className="detail-list">
        {[['Dava Dilekçesi', 'Onaylandı'], ['Cevap Dilekçesi', 'Avukat İncelemesinde'], ['Bilirkişi Raporuna İtiraz', 'Taslak']].map(([title, status]) => (
          <div key={title}><FileText size={15} /><span>{title}</span><small>{status}</small></div>
        ))}
      </div>
    );
  if (id === 'product')
    return (
      <div className="detail-architecture">
        <div className="arch-section">
          <h3>Case</h3>
          <div className="arch-card"><FileText size={12} /><span>İşçilik Alacağı</span><small>2026/145</small></div>
        </div>
        <div className="arch-section">
          <h3>Tasks</h3>
          <div className="arch-card"><FileText size={12} /><span>Bilirkişi raporu</span><small>itiraz aşaması</small></div>
          <div className="arch-card"><FileText size={12} /><span>Emsal araştırma</span><small>kaynak kontrolü</small></div>
        </div>
        <div className="arch-section">
          <h3>Evidence</h3>
          <div className="arch-card"><FileText size={12} /><span>Delil matrisi</span><small>destek / karşı / eksik</small></div>
        </div>
        <div className="arch-section">
          <h3>Deadlines</h3>
          <div className="arch-card"><small>Son süre</small><b>02 Eylül 2026</b></div>
        </div>
        <div className="arch-section">
          <h3>Research</h3>
          <div className="arch-card"><FileText size={12} /><span>Emsal kararlar</span><small>9. HD · 7974</small></div>
        </div>
        <div className="arch-section">
          <h3>Draft Status</h3>
          <div className="arch-card"><FileText size={12} /><span>Onaylandı</span><small>avukat incelemesi</small></div>
        </div>
      </div>
    );
  if (id === 'documents')
    return (
      <div className="detail-registry">
        <div className="registry-header">
          <p>DOKÜMAN KAYDI</p>
          <span>Dosya içindeki kayıtlar</span>
        </div>
        <div className="registry-grid">
          <div className="registry-item"><b>Bilirkişi Raporu</b><span>PDF · Hazır</span></div>
          <div className="registry-item"><b>Dava Dilekçesi</b><span>Avukat İncelemesi</span></div>
          <div className="registry-item"><b>Ücret Bordrosu</b><span>Dosya kaydı</span></div>
          <div className="registry-item"><b>Puantaj</b><span>Kartlı geçiş</span></div>
          <div className="registry-item"><b>WhatsApp Dökümü</b><span>Bağlantı kaydı</span></div>
        </div>
        <div className="evidence-matrix">
          <h4>Delil Matrisi</h4>
          <div className="matrix-row"><b>Destekleyen</b><span>WhatsApp · Tanık beyanı</span></div>
          <div className="matrix-row"><b>Karşı</b><span>Imzalı ücret bordrosu</span></div>
          <div className="matrix-row"><b>Eksik</b><span>Kartlı geçiş kayıtları</span></div>
          <div><b>Değerlendirme</b><span>Bordro ve puantaj karşılaştırılmalı</span></div>
        </div>
        <div className="claim-state">
          <h5>Bağlamdaki İddia Durumu</h5>
          <span>Desteklenen iddia · Karşı iddia · Eksik deliller</span>
        </div>
      </div>
    );
  if (id === 'about')
    return (
      <div className="detail-about">
        <div className="about-identity">
          <h3>HukukAI</h3>
          <p>Bağımsız hukuk teknoloji ürünü</p>
        </div>
        <div className="about-owners">
          <article className="ownership-card">
            <span className="ownership-monogram">MC</span>
            <p className="ownership-role">ÜRÜN SAHİBİ &amp; GELİŞTİRİCİ</p>
            <h3>Mehmet Cam</h3>
            <p className="ownership-subtitle">AI Systems Builder · Data Scientist</p>
          </article>
          <article className="ownership-card advisor-card">
            <span className="ownership-monogram advisor-monogram">BA</span>
            <p className="ownership-role">HUKUKİ DANIŞMAN</p>
            <h3>Av. Behçet Alp</h3>
            <p className="ownership-subtitle">Hukuki Danışman — HukukAI</p>
          </article>
        </div>
        <div className="about-diagram">
          <p>Sistem / Rol ilişkisi: HukukAI → ürün · Mehmet Cam → ürün sahibi &amp; geliştirici · Av. Behçet Alp → hukuki danışman</p>
        </div>
      </div>
    );
  if (id === 'services')
    return (
      <div className="detail-practice">
        <div className="practice-header">
          <h3>Hukuki Hizmet Alanları</h3>
          <p>Alp Hukuk Bürosu ve B&B Avukatlık Ortaklığı</p>
        </div>
        <ul className="practice-list">
          <li><span>Ticaret ve Şirketler Hukuku</span> Şirket kuruluşu, sözleşmeler ve uyuşmazlık yönetimi</li>
          <li><span>Gayrimenkul ve Kira Hukuku</span> Kira tespit, tahliye ve taşınmaz işlemleri</li>
          <li><span>Yabancılar Hukuku ve Uluslararası Yatırımlar</span> Yatırım süreçleri, ikamet ve uyumlu işlem akışı</li>
          <li><span>Aile Hukuku ve Tanıma-Tenfiz</span> Boşanma, tanıma-tenfiz ve mal rejimi</li>
          <li><span>İcra ve İflas Hukuku</span> İcra takibi, itiraz ve iflas süreçleri</li>
          <li><span>İş Hukuku</span> İş sözleşmeleri, arabuluculuk ve dava takibi</li>
        </ul>
      </div>
    );
  if (id === 'announcements')
    return (
      <div className="detail-blocks">
        {demoAnnouncements
          .filter((item) => item.status === 'published')
          .map((item) => (
            <article key={item.id}>
              <p>{item.category}</p>
              <h2>{item.title}</h2>
              <span>{item.excerpt}</span>
            </article>
          ))}
      </div>
    );
  return (
    <div className="detail-list">
      {['Bilirkişi Raporu', 'Dava Dilekçesi', 'Ücret Bordrosu', 'Puantaj', 'WhatsApp Dökümü'].map((title, index) => (
        <div key={title}><FileText size={15} /><span>{title}</span><small>{index === 0 ? 'PDF · Hazır' : 'Dosya kaydı'}</small></div>
      ))}
    </div>
  );
}

export function PublicDetailPage({ page }: { page: PublicPageId }) {
  const data = pages[page];
  useEffect(() => {
    document.title = `HukukAI — ${data.name}`;
  }, [data.name]);

  const isProductChild = data.active === 'product' && page !== 'product';

  return (
    <PublicPageLayout active={data.active}>
      <section className="public-detail-hero">
        <nav className="breadcrumbs" aria-label="İçerik yolu">
          <Link href="/">Ana Sayfa</Link>
          <span aria-hidden="true">/</span>
          {isProductChild && (
            <>
              <Link href="/urun">Ürün</Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page">{data.name}</span>
        </nav>
        <p className="landing-kicker"><span>01</span>{data.kicker}</p>
        <h1>{data.title}</h1>
        <p>{data.intro}</p>
        {data.nav && (
          <nav className="section-nav" aria-label="Sayfa bölümleri">
            {data.nav.map((item) => (
              <a key={item} href={`#${item}`}>{item.replaceAll('-', ' ')}</a>
            ))}
          </nav>
        )}
      </section>

      <section className="public-detail-content">
        {page === 'announcements' ? (
          <div className="detail-blocks">
            {demoAnnouncements
              .filter((item) => item.status === 'published')
              .map((item) => (
                <article key={item.id}>
                  <p>{item.category}</p>
                  <h2>{item.title}</h2>
                  <span>{item.excerpt}</span>
                </article>
              ))}
          </div>
        ) : (
          <>
            <PagePreview id={page} />
            <div className="detail-blocks">
              {data.blocks.map(([title, copy], index) => (
                <article id={data.nav?.[index]} key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h2>{title}</h2>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="public-page-cta">
        <div>
          <p className="landing-kicker"><span>02</span>HUKUKAI DEMO</p>
          <h2>Çalışma alanını yakından inceleyin.</h2>
        </div>
        <div>
          <Link href="/login" className="button-primary">Demoyu İncele <ArrowRight size={16} /></Link>
          <Link href="/" className="button-secondary">Ana Sayfaya Dön</Link>
        </div>
      </section>
    </PublicPageLayout>
  );
}
