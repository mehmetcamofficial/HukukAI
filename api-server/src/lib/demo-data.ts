type Source = {
  id: string;
  name: string;
  title: string;
  status: string;
  reference: string;
  excerpt: string;
};

export const demoSources: Source[] = [
  {
    id: "source-demo-1",
    name: "HukukAI Demo Kaynak",
    title: "Kurgusal İşçilik Alacağı Kaynağı",
    status: "DEMO VERİ",
    reference: "DEMO-2026-001",
    excerpt:
      "Bu kayıt yalnızca ürün akışını göstermek için oluşturulmuştur. Gerçek hukuki kaynak değildir.",
  },
  {
    id: "source-demo-2",
    name: "HukukAI Demo İçtihat",
    title: "Kurgusal Bölge Adliye Mahkemesi Kararı",
    status: "DOĞRULANAMADI",
    reference: "Kaynak doğrulanamadı.",
    excerpt:
      "Kaynak sağlayıcı bağlantısı kurulana kadar bu karar doğrulanmış hukuk olarak sunulamaz.",
  },
];

export const demoClients = [
  {
    id: "client-deniz",
    name: "Deniz Aras",
    type: "INDIVIDUAL",
    email: "deniz.aras@example.test",
    phone: "+90 212 555 01 24",
    caseCount: 1,
    tags: ["İş Hukuku", "Öncelikli"],
  },
  {
    id: "client-kuzey",
    name: "Kuzey Yapı A.Ş.",
    type: "COMPANY",
    email: "hukuk@kuzeyyapi.example.test",
    phone: "+90 216 555 02 16",
    caseCount: 2,
    tags: ["Ticaret", "Kurumsal"],
  },
  {
    id: "client-ece",
    name: "Ece Korkmaz",
    type: "INDIVIDUAL",
    email: "ece.korkmaz@example.test",
    phone: "+90 532 555 03 18",
    caseCount: 1,
    tags: ["Kira"],
  },
];

export type DemoCase = {
  id: string;
  title: string;
  caseNumber: string;
  court: string;
  chamber: string | null;
  category: string;
  clientName: string;
  opposingParty: string;
  status: string;
  filingDate: string;
  nextHearing: string | null;
  nextDeadline: string | null;
  updatedAt: string;
  summary: string;
  tags: string[];
  documentCount: number;
};

export const demoCases: DemoCase[] = [
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
    updatedAt: "2026-08-27T15:40:00.000Z",
    summary:
      "Fazla çalışma ve yıllık izin ücretlerinin tahsili talebiyle açılan kurgusal dosya.",
    tags: ["İşçilik alacağı", "Bilirkişi", "Öncelikli"],
    documentCount: 6,
  },
  {
    id: "case-2025-311",
    title: "Kira Bedelinin Uyarlanması",
    caseNumber: "2025/311",
    court: "İstanbul 8. Sulh Hukuk Mahkemesi",
    chamber: "—",
    category: "Kira Hukuku",
    clientName: "Ece Korkmaz",
    opposingParty: "Atlas Gayrimenkul Ltd.",
    status: "WAITING",
    filingDate: "2025-11-03",
    nextHearing: "2026-10-06",
    nextDeadline: null,
    updatedAt: "2026-08-21T09:10:00.000Z",
    summary:
      "Kurgusal kira uyarlama dosyasında emsal kira araştırması ve bilirkişi bekleniyor.",
    tags: ["Kira", "Emsal araştırması"],
    documentCount: 4,
  },
  {
    id: "case-2024-089",
    title: "Tedarik Sözleşmesi Feshi",
    caseNumber: "2024/089",
    court: "İstanbul 3. Asliye Ticaret Mahkemesi",
    chamber: "—",
    category: "Ticaret Hukuku",
    clientName: "Kuzey Yapı A.Ş.",
    opposingParty: "Güney Endüstri A.Ş.",
    status: "APPEAL",
    filingDate: "2024-04-12",
    nextHearing: null,
    nextDeadline: "2026-09-18",
    updatedAt: "2026-08-18T12:25:00.000Z",
    summary:
      "Sözleşmenin haksız feshi iddiasına ilişkin kurgusal ticari uyuşmazlık.",
    tags: ["Ticaret", "İstinaf"],
    documentCount: 9,
  },
];

export const demoDocuments = [
  {
    id: "doc-1",
    caseId: "case-2026-145",
    filename: "Dava_Dilekcesi_Deniz_Aras.pdf",
    category: "Dava Dilekçesi",
    type: "PDF",
    uploadedAt: "27 Ağu 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO VERİ",
    sizeLabel: "1.8 MB",
    excerpt: "Fazla çalışma alacağı ve yıllık izin taleplerine ilişkin kurgusal metin.",
  },
  {
    id: "doc-2",
    caseId: "case-2026-145",
    filename: "Bilirkişi_Raporu_01.pdf",
    category: "Bilirkişi Raporu",
    type: "PDF",
    uploadedAt: "26 Ağu 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO VERİ",
    sizeLabel: "2.4 MB",
    excerpt: "Kurgusal hesap tablosu ve inceleme notları.",
  },
  {
    id: "doc-3",
    caseId: "case-2026-145",
    filename: "WhatsApp_Yazismalari.zip",
    category: "Yazışma",
    type: "ZIP",
    uploadedAt: "23 Ağu 2026",
    processingStatus: "İNCELENİYOR",
    verificationStatus: "DOĞRULANAMADI",
    sizeLabel: "8.1 MB",
    excerpt: "Belge içeriği henüz işleniyor.",
  },
  {
    id: "doc-4",
    caseId: "case-2025-311",
    filename: "Kira_Sozlesmesi.docx",
    category: "Sözleşme",
    type: "DOCX",
    uploadedAt: "21 Ağu 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO VERİ",
    sizeLabel: "342 KB",
    excerpt: "Kurgusal taşınmaz kira sözleşmesi.",
  },
  {
    id: "doc-5",
    caseId: "case-2024-089",
    filename: "Ihtarname_2024.pdf",
    category: "İhtarname",
    type: "PDF",
    uploadedAt: "18 Ağu 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO VERİ",
    sizeLabel: "620 KB",
    excerpt: "Kurgusal fesih bildirimi ve teslim iddiaları.",
  },
];

export const demoTimeline = [
  {
    id: "event-1",
    date: "12.01.2025",
    title: "İş sözleşmesi imzalandı",
    description: "Kurgusal iş sözleşmesi başlangıç tarihi.",
    sourceStatus: "DEMO VERİ",
    editable: true,
  },
  {
    id: "event-2",
    date: "24.03.2025",
    title: "İhtar gönderildi",
    description: "Fazla çalışma kayıtlarının talep edildiği kurgusal ihtar.",
    sourceStatus: "DEMO VERİ",
    editable: true,
  },
  {
    id: "event-3",
    date: "18.04.2025",
    title: "İş ilişkisi sona erdi",
    description: "Taraf beyanlarından çıkarılan ve avukat incelemesi bekleyen olay.",
    sourceStatus: "DOĞRULANAMADI",
    editable: true,
  },
  {
    id: "event-4",
    date: "22.06.2026",
    title: "Dava açıldı",
    description: "Kurgusal dava açılış tarihi.",
    sourceStatus: "DEMO VERİ",
    editable: true,
  },
];

export const demoAnalysis = {
  id: "analysis-1",
  caseId: "case-2026-145",
  generatedAt: "28 Ağustos 2026, 09:42",
  status: "AVUKAT İNCELEMESİNDE",
  dispute: "Fazla çalışma ve kullanılmayan yıllık izin ücretlerinin tahsili.",
  claims: [
    "Fazla çalışma yapıldığı ve karşılığının ödenmediği ileri sürülüyor.",
    "Kullanılmayan yıllık izin ücretinin fesihte ödenmediği iddia ediliyor.",
  ],
  defenses: [
    "Çalışma saatlerinin bordrolarla sınırlı olduğu savunulabilir.",
    "Fesih tarihine ilişkin taraf anlatımları farklı görünüyor.",
  ],
  strengths: [
    "Mesaj kayıtları ve tanık listesi iddianın kronolojisini destekleyebilir.",
    "Bilirkişi raporu hesaplamayı görünür hale getiriyor.",
  ],
  weaknesses: [
    "Giriş-çıkış kayıtlarının tam dönemi dosyada görünmüyor.",
    "Bordro imzalarının hangi aylara ait olduğu ayrıca doğrulanmalı.",
  ],
  missingEvidence: [
    "İşyeri giriş-çıkış kayıtları",
    "Yıllık izin formları",
    "Tanık iletişim bilgilerinin teyidi",
  ],
  risks: [
    "Tarihlere ilişkin çelişki var. Kaynak doğrulanamadı.",
    "Süre hesabı avukat tarafından ayrıca kontrol edilmelidir.",
  ],
  sources: demoSources,
  disclaimer:
    "Bu analiz demo verisiyle oluşturulmuştur. Hukuki görüş veya doğrulanmış kaynak yerine geçmez; avukat kontrolü gerektirir.",
};

export const demoResearch = [
  {
    id: "research-1",
    query: "Fazla çalışma ispatında elektronik yazışmalar",
    issue: "İspat araçları ve delil değerlendirmesi",
    createdAt: "28 Ağustos 2026",
    confidence: "LOW",
    result:
      "Demo kaynak sağlayıcısı bağlı olmadığı için doğrulanmış bir hukuki sonuç üretilemedi. Kaynak doğrulanamadı.",
    demo: true,
    sources: demoSources,
  },
  {
    id: "research-2",
    query: "Kira bedelinin uyarlanmasında emsal araştırması",
    issue: "Kira uyarlama ve emsal değerlendirmesi",
    createdAt: "26 Ağustos 2026",
    confidence: "MEDIUM",
    result:
      "Bu çıktı yalnızca arayüz ve inceleme akışını göstermek için oluşturulmuş demo araştırmadır.",
    demo: true,
    sources: demoSources,
  },
];

export const demoActivity = [
  {
    id: "activity-1",
    action: "BELGE YÜKLENDİ",
    detail: "Bilirkişi_Raporu_01.pdf · 2026/145",
    createdAt: "26 Ağu · 14:18",
    actor: "Siz",
  },
  {
    id: "activity-2",
    action: "AI ARAŞTIRMASI",
    detail: "Fazla çalışma ispatında elektronik yazışmalar",
    createdAt: "28 Ağu · 09:42",
    actor: "HukukAI",
  },
  {
    id: "activity-3",
    action: "DURUŞMA EKLENDİ",
    detail: "2026/145 · 14 Eylül 2026",
    createdAt: "25 Ağu · 11:05",
    actor: "Siz",
  },
];
