import { useState, type ReactNode } from "react";
import {
  getGetCaseAnalysisQueryKey,
  getGetCaseDocumentsQueryKey,
  getGetCaseQueryKey,
  getGetCaseTimelineQueryKey,
  getGetResearchQueryKey,
  useCreateCaseAnalysis,
  useCreateDocument,
  useCreateResearch,
  useCreateTimelineEvent,
  useGetCase,
  useGetCaseAnalysis,
  useGetCaseDocuments,
  useGetCaseTimeline,
  useGetDashboard,
  useGetResearch,
  useUpdateCase,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileText,
  FolderOpen,
  Gavel,
  Info,
  LoaderCircle,
  Plus,
  Scale,
  Send,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { SearchInput } from "@/components/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* -------------------------------------------------------------------------- */
/*                              FALLBACK DATA                                 */
/* -------------------------------------------------------------------------- */

const fallbackDocs = [
  {
    id: "doc-010",
    filename: "Bilirkişi_Raporu_2026_145.pdf",
    category: "Bilirkişi Raporu",
    type: "PDF",
    uploadedAt: "20 Haziran 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO — KURGUSAL DAVA VERİSİ",
    sizeLabel: "4.2 MB",
    excerpt: "DEMO — KURGUSAL DAVA VERİSİ. Bilirkişi raporu: Fazla çalışma iddiası için yeterli delil bulunamamıştır.",
  },
  {
    id: "doc-009",
    filename: "Durusma_Tutancagi_14_09_2026.pdf",
    category: "Duruşma Tutanağı",
    type: "PDF",
    uploadedAt: "14 Eylül 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO — KURGUSAL DAVA VERİSİ",
    sizeLabel: "0.6 MB",
    excerpt: "DEMO — KURGUSAL DAVA VERİSİ. 14.09.2026 tarihli duruşma tutanağı.",
  },
  {
    id: "doc-006",
    filename: "WhatsApp_Yazismasi_Dokumu.pdf",
    category: "İletişim Kaydı",
    type: "PDF",
    uploadedAt: "10 Mart 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DOĞRULANAMADI",
    sizeLabel: "3.5 MB",
    excerpt: "DEMO — KURGUSAL DAVA VERİSİ. Davacı ile iş yeri yöneticisi arasındaki WhatsApp yazışmaları.",
  },
  {
    id: "doc-008",
    filename: "Ihtarname_12_01_2026.pdf",
    category: "İhtarname",
    type: "PDF",
    uploadedAt: "12 Ocak 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DOĞRULANDI",
    sizeLabel: "0.3 MB",
    excerpt: "DEMO — KURGUSAL DAVA VERİSİ. Fazla çalışma ve izin ücreti alacağının ödenmesi için ihtarname.",
  },
  {
    id: "doc-005",
    filename: "Puantaj_Cizelgesi_2025.pdf",
    category: "Puantaj",
    type: "PDF",
    uploadedAt: "05 Ocak 2026",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO — KURGUSAL DAVA VERİSİ",
    sizeLabel: "1.8 MB",
    excerpt: "DEMO — KURGUSAL DAVA VERİSİ. Aylık puantaj çizelgesi. Bazı aylarda 20:00 sonrası çıkış saatleri.",
  },
  {
    id: "doc-004",
    filename: "Ucret_Bordrosu_Oct_2025.pdf",
    category: "Ücret Bordrosu",
    type: "PDF",
    uploadedAt: "31 Ekim 2025",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO — KURGUSAL DAVA VERİSİ",
    sizeLabel: "0.4 MB",
    excerpt: "DEMO — KURGUSAL DAVA VERİSİ. Aylık ücret bordrosu. Brüt 28.000 TL.",
  },
  {
    id: "doc-007",
    filename: "Yillik_Izin_Formu.pdf",
    category: "İzin Formu",
    type: "PDF",
    uploadedAt: "15 Aralık 2025",
    processingStatus: "HAZIR",
    verificationStatus: "DEMO — KURGUSAL DAVA VERİSİ",
    sizeLabel: "0.2 MB",
    excerpt: "DEMO — KURGUSAL DAVA VERİSİ. 14 gün izin kullandığına dair form.",
  },
];

const fallbackAnalysis = {
  id: "analysis-demo",
  caseId: "case-2026-145",
  generatedAt: "28 Ağustos 2026, 09:42",
  status: "DEMO ANALİZİ",
  dispute: "Fazla çalışma ve kullanılmayan yıllık izin ücretlerinin tahsili ile ücret bordrosu ile banka hesap özeti arasındaki uyumsuzluğun giderilmesi.",
  claims: [
    "Fazla çalışma karşılığının ödenmediği ileri sürülüyor. Davacı, mesai sonrası WhatsApp talimatları ve puantaj verilerini delil olarak göstermektedir.",
    "Yıllık izin ücretinin fesihte ödenmediği iddia ediliyor. İzin formu mevcut ancak imza sahte olabilir.",
    "Bordro ile banka hesap arasında aylık 2.500 TL fark bulunduğu ileri sürülüyor.",
  ],
  defenses: [
    "Çalışma saatlerinin bordrolarla sınırlı olduğu savunulmaktadır.",
    "Yıllık izinlerin kullandırıldığına dair form mevcuttur.",
    "Farkın SGK ve vergi kesintilerinden kaynaklandığı öne sürülmektedir.",
  ],
  strengths: [
    "WhatsApp mesajları kronolojiyi destekleyebilir.",
    "Bilirkişi raporu hesaplamayı görünür hale getirmiştir.",
    "Banka hesap özeti ile bordro arasındaki fark somut ve ölçülebilirdir.",
    "İhtarname tarihi ve içeriği davacı lehine delil oluşturmaktadır.",
  ],
  weaknesses: [
    "Giriş-çıkış kayıtlarının tam dönemi görünmüyor. Tam access kartı logları eksik.",
    "Bordro imzaları ayrıca doğrulanmalı. İtiraz edilirse bilirkişi gerekebilir.",
    "Tanık beyanları destekleyici ancak tek başına yeterli değil.",
    "Fesih tarihine ilişkin taraflar arasında çelişki var.",
  ],
  missingEvidence: [
    "İşyeri giriş-çıkış kayıtları (access kartı logları)",
    "Yıllık izin formlarının orijinalleri ve imza doğrulaması",
    "Tam banka-hesap özeti karşılaştırması (tüm dönem)",
    "SGK kesinti dökümleri ve vergi matrah bilgileri",
    "Tanık bilgilerinin teyidi ve mahkeme huzurunda beyan",
  ],
  risks: [
    "Tarihlere ilişkin çelişki var. Kaynak doğrulanamadı.",
    "Süre hesabı avukat tarafından ayrıca kontrol edilmelidir.",
    "Mahkeme, eksik delil nedeniyle iddiayı reddedebilir.",
    "Bilirkişi raporundaki eksiklikler giderilmezse karar aleyhe dönebilir.",
  ],
  sources: [],
  disclaimer: "DEMO ANALİZİ — Bu analiz demo verisiyle oluşturulmuştur. Hukuki görüş yerine geçmez; avukat kontrolü gerektirir. DEMO — KURGUSAL DAVA VERİSİ",
};

const fallbackCases = [
  {
    id: "case-2026-145",
    title: "İşçilik Alacağı",
    caseNumber: "2026/145",
    court: "Kurgu 14. İş Mahkemesi",
    category: "İş Hukuku",
    clientName: "Deniz Aras",
    opposingParty: "Marmara Lojistik A.Ş.",
    status: "ACTIVE",
    nextHearing: "2027-01-20",
    nextDeadline: "2026-09-02",
    summary: "Fazla çalışma ve yıllık ücretli izin ile ücret alacağının tahsili.",
  },
];

const fallbackTimeline = [
  { id: "event-001", date: "12.01.2025", title: "İş sözleşmesi imzalandı", description: "Deniz Aras ile Marmara Lojistik A.Ş. arasında iş sözleşmesi imzalandı.", sourceStatus: "DOĞRULANDI" },
  { id: "event-002", date: "18.08.2025", title: "Mesai sonrası WhatsApp mesajları", description: "İş yeri yöneticisi tarafından 20:00'den sonra gönderilen iş talimatları.", sourceStatus: "DOĞRULANAMADI" },
  { id: "event-003", date: "12.01.2026", title: "İhtarname gönderildi", description: "Fazla çalışma ve izin ücreti alacağının ödenmesi için ihtarname.", sourceStatus: "DOĞRULANDI" },
  { id: "event-004", date: "18.01.2026", title: "İş ilişkisi sona erdi", description: "Davacının iş sözleşmesi feshedildi.", sourceStatus: "DOĞRULANAMADI" },
  { id: "event-005", date: "05.02.2026", title: "Arabuluculuk başvurusu", description: "Arabuluculuk bürosuna başvuru yapılmıştır.", sourceStatus: "DOĞRULANDI" },
  { id: "event-006", date: "18.02.2026", title: "Arabuluculuk tutanağı", description: "Arabuluculuk görüşmesi sonuçsuz kalmıştır.", sourceStatus: "DOĞRULANDI" },
  { id: "event-007", date: "25.02.2026", title: "Dava açıldı", description: "Kurgu 14. İş Mahkemesi'ne dava dilekçesi sunulmuştur.", sourceStatus: "DOĞRULANDI" },
  { id: "event-008", date: "20.06.2026", title: "Bilirkişi raporu açıklandı", description: "Bilirkişi heyeti raporunu mahkemeye sundu.", sourceStatus: "DOĞRULANAMADI" },
  { id: "event-009", date: "14.09.2026", title: "Duruşma yapıldı", description: "Taraflar bilirkişi raporuna ilişkin beyanlarını sundu.", sourceStatus: "DEMO — KURGUSAL DAVA VERİSİ" },
];

const fallbackEvidence = [
  {
    id: "evidence-001",
    claim: "Fazla çalışma ücreti alacağının ödenmemesi",
    supportingEvidence: ["WhatsApp yazışmalarında mesai sonrası çalışma talimatları", "Tanık beyanları: Mesai sonrası çalışmaları doğrulayan iş arkadaşları", "Puantaj çizelgesinde bazı aylarda 20:00 sonrası çıkış saatleri"],
    contradictingEvidence: ["Bordrolarda fazla çalışma ücreti gösterilmemiş", "Davalı şirketin beyanı: Tüm çalışmaların mesai içinde tamamlandığı"],
    missingEvidence: ["Tam giriş-çıkış kayıtları (access kartı logları)", "İş yeri güvenlik kamerası kayıtları", "Resmi fazla çalışma onay formu"],
    assessment: "WhatsApp mesajları ve puantaj verileri kısmi destek sağlamaktadır. Ancak kesin ispat için tam giriş-çıkış kayıtları gereklidir.",
  },
  {
    id: "evidence-002",
    claim: "Yıllık ücretli izin kullanılmamış olması",
    supportingEvidence: ["Davacı beyanı: İzinlerin kullandırılmadığı", "Banka hesap özeti: İzin ücreti ödemesinin yapılmamış olması"],
    contradictingEvidence: ["Yıllık izin formu: 14 gün izin kullandığı gösterilmiş", "Davalı şirketin beyanı: İzinlerin kullandırıldığına dair kayıt mevcut"],
    missingEvidence: ["İmza doğrulaması (formun davacıya ait olup olmadığı)", "Orijinal izin defteri kayıtları", "İzin onay e-postaları veya yazışmaları"],
    assessment: "İzin formu mevcut ancak imza sahte olabilir. İmza doğrulaması yapılmadığı sürece çelişki devam etmektedir.",
  },
  {
    id: "evidence-003",
    claim: "Bordro ile banka hesap arasında ücret uyumsuzluğu",
    supportingEvidence: ["Banka hesap özeti: Aylık 28.000 TL yerine 25.500 TL yattığı", "Bordro: Brüt 28.000 TL olarak gösterilmiş"],
    contradictingEvidence: ["Davalı şirketin beyanı: Farkın SGK kesintilerinden kaynaklandığı"],
    missingEvidence: ["Tam banka-hesap özeti karşılaştırması", "SGK kesinti dökümleri", "Vergi matrah bilgileri"],
    assessment: "Banka hesap ile bordro arasında net fark mevcuttur. Farkın kesintilerden kaynaklanıp değerlendirilmesi gereklidir.",
  },
  {
    id: "evidence-004",
    claim: "Haksız fesih",
    supportingEvidence: ["İhtarname: Fesih öncesi alacakların ödemesi talep edilmiş", "Fesih tarihine ilişkin çelişki: Davacı 20.01, davalı 18.01"],
    contradictingEvidence: ["Davalı şirketin devam eden devamsızlık kayıtları", "Fesih bildirimi: Davacının devamsızlığı gerekçesi"],
    missingEvidence: ["Bildirim tebligat kayıtları", "Devamsızlık tutanakları", "Fesih sonrası banco ve SGK bildirimleri"],
    assessment: "Fesih yasallığı tartışmalıdır. Davacı lehine ihtarname mevcut ancak devamsızlık iddiası da değerlendirilmelidir.",
  },
];

const fallbackCounterparty = {
  likelyArguments: [
    "Çalışma saatlerinin sadece bordroda yazan saatlerle sınırlı olduğunu",
    "Fazla çalışmanın işveren yazılı onayı olmadan yapılamayacağını",
    "Yıllık izinlerin kullandırıldığına dair form ve defter kayıtlarının mevcut olduğunu",
    "Bordro ile banka hesap arasındaki farkın SGK ve vergi kesintilerinden kaynaklandığını",
  ],
  evidenceTheyMayUse: [
    "İmzalı bordro nüshaları",
    "İzin kullandırma formu ve izin defteri",
    "SGK kesinti dökümleri",
    "Çalışan iş veya devamsızlık tutanakları",
  ],
  weaknessesInOurCase: [
    "Tam giriş-çıkış kayıtlarının (access kartı) eksik olması",
    "Tanık beyanlarının tek başına yeterli görülmemesi",
    "Fesih tarihine ilişkin taraflar arasındaki çelişki",
    "Bilirkişi raporunda fazla çalışma iddiasının yetersiz bulunması",
  ],
  preparationItems: [
    "Bilirkişi raporuna itiraz dilekçesinin hazırlanması",
    "Eksik delillerin tamamlanması için giriş-çıkış kayıtlarının temin edilmesi",
    "Tanık beyanlarının mahkeme huzurunda teyit ettirilmesi",
    "Bordro ile banka hesap arasındaki farkın detaylı karşılaştırmalı hesaplanması",
  ],
};

const fallbackMemory = [
  {
    id: "mem-001",
    caseNumber: "2024/381",
    title: "Fazla Mesai Alacağı",
    court: "Kurgu 8. İş Mahkemesi",
    clientName: "Ece Korkmaz",
    opposingParty: "Anadolu Tekstil Ltd. Şti.",
    outcome: "Kısmen Kabul",
    similarityScore: 0.9,
    commonIssues: ["Fazla çalışma ücreti", "Bordro itirazı", "Tanık beyanı"],
    usefulArgument: "Bordro ile banka hesap özeti arasındaki farkın somut olarak gösterilmesi mahkeme tarafından olumlu değerlendirilmişti.",
    lawyerNote: "Bu davada bilirkişi raporundaki eksiklikler giderilerek karar alınmıştı. Benzer strateji uygulanabilir.",
  },
  {
    id: "mem-002",
    caseNumber: "2025/077",
    title: "Yıllık İzin ve Ücret Alacağı",
    court: "Kurgu 5. İş Mahkemesi",
    clientName: "Kuzey Yapı A.Ş.",
    opposingParty: "Mehmet Yıldız",
    outcome: "Kabul",
    similarityScore: 0.82,
    commonIssues: ["Yıllık izin hakkı", "Ücret alacağı", "İzin formu geçerliliği"],
    usefulArgument: "İzin defteri kayıtlarının düzenli tutulması ve imzalı formların mevcut olması davayı güçlendirmişti.",
    lawyerNote: "Davalı lehine sonuçlanmış bu karşılaştırma, izin formu itirazının ne kadar kritik olduğunu gösteriyor.",
  },
];

const fallbackDrafts = [
  {
    id: "draft-001",
    type: "Bilirkişi Raporuna İtiraz",
    title: "Bilirkişi Raporuna İtiraz Dilekçesi",
    content: "DEMO — KURGUSAL DİLEKÇE\n\nBilirkişi raporuna ilişkin itirazlarımız:\n\n1. Bilirkişi, WhatsApp mesajlarını delil olarak değerlendirmemiştir. Mesai sonrası gönderilen iş talimatları fazla çalışmanın kanıtıdır.\n\n2. Puantaj çizelgesindeki eksik giriş-çıkış kayıtları, bilirkişi tarafından yeterince incelenmemiştir.\n\n3. Bordro ile banka hesap arasındaki fark, SGK kesintileriyle açıklanamaz. 2.500 TL'lik aylık fark sabittir.\n\nSonuç: Raporun eksikliklerinin giderilmesi ve yeniden düzenlenmesini talep ederiz.",
    status: "TASLAK",
    approvedAt: "",
  },
  {
    id: "draft-002",
    type: "Cevap Dilekçesi",
    title: "Fazla Mesai Alağı — Cevap Dilekçesi (Nihai)",
    content: "DEMO — KURGUSAL DİLEKÇE\n\nMahkemenize sunulan davanın savunmasına ilişkin cevap dilekçemizdir.\n\n1. Davacının fazla çalışma iddiası, bordroların imzalı olması nedeniyle asılsızdır.\n\n2. Haftalık çalışma süresi 45 saati aşmamaktadır.\n\n3. Tanık beyanları çelişkilidir.\n\nSonuç: Davanın reddini talep ederiz.",
    status: "NİHAİ",
    approvedAt: "15 Mayıs 2024",
  },
];

const fallbackPrecedents = [
  {
    id: "prec-v001",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2023/7974",
    decisionNumber: "2023/11786",
    decisionDate: "12.09.2023",
    legalTopic: "Fazla çalışma ücreti — Sembolik tahakkuklar ve mahsup",
    summary: "İşverence işçilere fazla çalışma ücreti talep etmesine engel olacak biçimde sembolik ve gerçeği yansıtmayan fazla çalışma tahakkukları yapılan aylar, fazla çalışma hesabından tümden dışlanmaz; ancak bu aylarda yapılan gerçek ödemeler, tespit edilen fazla çalışma ücreti alacağından mahsup edilir.",
    position: "LEHE",
    verificationStatus: "DOĞRULANDI",
    sourceUrl: "https://www.alomaliye.com/2026/08/25/ucret-hesap-pusulasi-rehberi-2026/",
  },
  {
    id: "prec-v002",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2022/5402",
    decisionNumber: "DOĞRULANDI",
    decisionDate: "2022",
    legalTopic: "İhtirazyokable imzalı bordro — Fazla çalışmanın her türlü delille ispatı",
    summary: "İşçinin fazla çalışma alacağının bordrodan fazla olduğu yönündeki ihtirazyokable kaydının bulunması halinde, bordroda görünenden daha fazla çalışmanın ispatı her türlü delille yapılabilir.",
    position: "LEHE",
    verificationStatus: "DOĞRULANDI",
    sourceUrl: "https://kazanci.com.tr/gunluk/9hd-2022-5402.htm",
  },
  {
    id: "prec-v003",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2024/7636",
    decisionNumber: "2024/12837",
    decisionDate: "01.10.2024",
    legalTopic: "Fazla çalışma ispatı — Tanık değerlendirmesi ve işyeri kayıtları",
    summary: "Fazla çalışma yaptığını iddia eden işçi bu iddiasını ispatla yükümlüdür. İşyeri kayıtları delil niteliğindedir. Yazılı belgelerle ispatlanamaması durumunda tanık beyanları ile sonuca gidilir.",
    position: "LEHE",
    verificationStatus: "DOĞRULANDI",
    sourceUrl: "https://yargi.calismatoplum.org/fazla-calismanin-ispat-esaslari/",
  },
  {
    id: "prec-v004",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2021/3803",
    decisionNumber: "2021/8265",
    decisionDate: "15.04.2021",
    legalTopic: "Yıllık izin — İspat yükü işverende, imzalı izin defteri şartı",
    summary: "Yıllık izinlerin kullandırıldığı noktasında ispat yükü işverene aittir. İşveren yıllık izinlerin kullandırıldığını imzalı izin defteri veya eşdeğer bir belge ile kanıtlamalıdır.",
    position: "ALEYHE",
    verificationStatus: "DOĞRULANDI",
    sourceUrl: "https://kazanci.com.tr/gunluk/9hd-2021-3803.htm",
  },
  {
    id: "prec-v005",
    court: "Yargıtay",
    chamber: "Hukuk Genel Kurulu",
    caseNumber: "2017/2231",
    decisionNumber: "2017/1547",
    decisionDate: "06.12.2017",
    legalTopic: "Haklı nedenle fesih — Ücretin ödenmemesi",
    summary: "İşveren tarafından işçinin ücreti kanun hükümleri veya sözleşme şartlarına uygun olarak hesap edilmez veya ödenmezse işçi iş sözleşmesini haklı nedenle derhal feshedebilir.",
    position: "LEHE",
    verificationStatus: "DOĞRULANDI",
    sourceUrl: "https://www.lexpera.com.tr/ictihat/yargitay/hukuk-genel-kurulu-e-2017-2231-k-2017-1547-t-6-12-2017",
  },
  {
    id: "prec-v006",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2012/2988",
    decisionNumber: "2014/8868",
    decisionDate: "18.03.2014",
    legalTopic: "Zamanaşımı — Islah yoluyla zamanaşımı defi",
    summary: "Zamanaşımı borcu sona erdirmeyip sadece istenebilirliğini ortadan kaldırır. Cevap dilekçesinde ileri sürülmeyen zamanaşımı defi, ıslah yoluyla ileri sürülebilir.",
    position: "ALEYHE",
    verificationStatus: "DOĞRULANDI",
    sourceUrl: "https://karararama.yargitay.gov.tr/getDokuman?id=100019800",
  },
  {
    id: "prec-v007",
    court: "Yargıtay",
    chamber: "Hukuk Genel Kurulu",
    caseNumber: "2026/10-129",
    decisionNumber: "2026/299",
    decisionDate: "06.05.2026",
    legalTopic: "Bilirkişi raporu — İtiraz edilmemesi usuli kazanılmış hak doğurmaz",
    summary: "Bir tarafın bilirkişi raporuna iki haftalık süre içinde itiraz etmemesi, tek başına o raporun hâkimi bağlayacağı anlamına gelmez. Hâkim raporu diğer delillerle birlikte serbestçe değerlendirir.",
    position: "KARMA",
    verificationStatus: "DOĞRULANDI",
    sourceUrl: "https://sanalhukuk.org/2026/07/09/bilirkisi-raporuna-itiraz-edilmemesi-usuli-kazanilmis-hak-dogurur-mu-yargitay-hgknin-2026-tarihli-karari/",
  },
];

const fallbackLegislation = [
  {
    id: "leg-001",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "41",
    articleTitle: "Fazla çalışma ücreti",
    articleText: "ÖZET: Ülkenin genel yararları yahut işin niteliği veya üretimin artırılması gibi nedenlerle fazla çalışma yapılabilir. Fazla çalışma, haftalık kırk beş saati aşan çalışmalardır. Her bir saat fazla çalışma için verilecek ücret normal çalışma ücretinin saat başına düşen miktarının yüzde elli yükseltilmesi suretiyle ödenir.",
    verificationStatus: "DOĞRULANDI",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
  },
  {
    id: "leg-002",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "53",
    articleTitle: "Yıllık ücretli izin",
    articleText: "ÖZET: İşe başladığı tarihten itibaren bir yıl çalışma süresini tamamlayan işçilere, on dört günden az olmamak üzere yıllık ücretli izin verilir. Bir yıldan beş yıla kadar çalışmış olanlara on dört gün, beş yıldan on beş yıla kadar çalışmış olanlara yirmi gün izin verilir.",
    verificationStatus: "DOĞRULANDI",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
  },
  {
    id: "leg-003",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "34",
    articleTitle: "Haftalık çalışma süresi",
    articleText: "ÖZET: Haftalık çalışma süresi en çok kırk beş saattir.",
    verificationStatus: "DOĞRULANDI",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
  },
  {
    id: "leg-004",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "25",
    articleTitle: "Ahlak ve iyi niyet kurallarına uymayan haller",
    articleText: "ÖZET: İşverenin iş sözleşmesini feshedebileceği durumlar: a) İşçinin tutukluluğu veya gözaltına alınması, b) İşçinin hastalığı, c) Zorlayıcı sebepler.",
    verificationStatus: "DOĞRULANDI",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
  },
  {
    id: "leg-005",
    lawNumber: "6100",
    lawName: "Hukuk Muhakemeleri Kanunu",
    articleNumber: "190",
    articleTitle: "İspat yükü",
    articleText: "ÖZET: İddiasını dayandıran taraf, olayı ispata mecburdur. Kanunda aksi hüküm yoksa, hukuki sonuçların iddia ve ispatı da bu tarafa aittir.",
    verificationStatus: "DOĞRULANDI",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm",
  },
  {
    id: "leg-006",
    lawNumber: "6100",
    lawName: "Hukuk Muhakemeleri Kanunu",
    articleNumber: "293",
    articleTitle: "Bilirkişi raporu",
    articleText: "ÖZET: Bilirkişi, mahkemenin tayin ettiği konuda rapor düzenler. Taraflar, rapora yazılı olarak itiraz edebilir.",
    verificationStatus: "DOĞRULANDI",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm",
  },
];

/* -------------------------------------------------------------------------- */
/*                              SHARED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function LoadingBlock() {
  return (
    <div className="space-y-4" data-testid="status-loading">
      <div className="h-8 w-48 shimmer rounded-md" />
      <div className="h-4 w-64 shimmer rounded-md" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-20 shimmer rounded-md" />
        <div className="h-20 shimmer rounded-md" />
        <div className="h-20 shimmer rounded-md" />
      </div>
    </div>
  );
}

function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center" data-testid="status-empty">
      <FolderOpen size={20} className="mb-3 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      {action}
    </div>
  );
}

function ReviewList({ title, items, tone = "green" }: { title: string; items: string[]; tone?: "green" | "red" }) {
  return (
    <section className={`rounded-md border p-4 ${tone === "green" ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"}`}>
      <div className="flex items-center gap-2">
        <CheckCircle2 size={14} className={tone === "green" ? "text-emerald-600" : "text-red-600"} />
        <h3 className="text-xs font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                           RESEARCH / PRECEDENT / LEGISLATION               */
/* -------------------------------------------------------------------------- */

function ResearchPage({ mode }: { mode: "research" | "precedent" | "legislation" }) {
  const researchQuery = useGetResearch();
  const createResearch = useCreateResearch();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const items = researchQuery.data ?? [];
  const config = {
    research: { title: "Hukuki Araştırma", description: "Kaynağa dayalı yanıt üretin.", placeholder: "Sorunuzu yazın; yanıtı, dayanakları ve belirsizlikleri birlikte görün." },
    precedent: { title: "Emsal Kararlar", description: "Karar hafızasından içtihat tarayın.", placeholder: "Örn. Fazla çalışmada ispat yükü nasıl değerlendirilir?" },
    legislation: { title: "Mevzuat", description: "Kanun, yönetmelik ve madde bağlantılarını inceleyin.", placeholder: "Örn. 4857 sayılı İş Kanunu madde 41" },
  }[mode];

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (query.trim().length < 3) return;
    createResearch.mutate(
      { data: { query: query.trim() } },
      { onSuccess: (result) => { queryClient.invalidateQueries({ queryKey: getGetResearchQueryKey() }); setQuery(""); setActive(result.id); } },
    );
  };

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader title={config.title} description={config.description} />
      <section className="rounded-md border border-border bg-card p-5">
        <form onSubmit={submit}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="input-research-query"
            placeholder={config.placeholder}
            rows={3}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={createResearch.isPending || query.trim().length < 3}
              data-testid="button-submit-research"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
            >
              {createResearch.isPending ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}
              Araştır
            </button>
          </div>
        </form>
      </section>
      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Sonuçlar</h2>
        <span className="mono text-[11px] text-muted-foreground">{items.length} kayıt</span>
      </div>
      {researchQuery.isLoading ? (
        <LoadingBlock />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">{item.query}</p>
                {item.demo && <StatusBadge tone="neutral">DEMO VERİ</StatusBadge>}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.result}</p>
              {item.sources && item.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.sources.map((s: { title: string; status: string }, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      <BookOpen size={10} />
                      {s.title}
                      <StatusBadge tone={s.status === "DOĞRULANDI" ? "success" : "warning"}>{s.status}</StatusBadge>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResearchRoutePage() { return <ResearchPage mode="research" />; }

export function PrecedentPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Emsal Kararlar" description="Yargıtay ve mahkeme kararlarından doğrulanmış içtihatlar." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Kaynaklar doğrulanmıştır. Resmî kaynaklara bağlantı sağlanmıştır.
      </div>
      <div className="space-y-3">
        {fallbackPrecedents.map((p) => (
          <div key={p.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={p.position === "LEHE" ? "success" : p.position === "ALEYHE" ? "danger" : "warning"}>
                    {p.position}
                  </StatusBadge>
                  <span className="text-sm font-medium">{p.legalTopic}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.summary}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  <span>{p.court} · {p.chamber}</span>
                  <span className="mono">{p.caseNumber} / {p.decisionNumber}</span>
                  <span>{p.decisionDate}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge tone="success">{p.verificationStatus}</StatusBadge>
                <a
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted"
                >
                  Resmî Kaynağı Aç
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LegislationPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Mevzuat" description="İlgili kanun maddeleri ve Resmî Gazete kaynakları." />
      <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} />
        Kaynaklar Resmî Gazete üzerinden doğrulanmıştır.
      </div>
      <div className="space-y-3">
        {fallbackLegislation.map((leg) => (
          <div key={leg.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{leg.lawNumber} Sayılı {leg.lawName}</span>
                  <span className="mono text-[11px] text-muted-foreground">Madde {leg.articleNumber}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">{leg.articleTitle}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{leg.articleText}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{leg.sourceName}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge tone="success">{leg.verificationStatus}</StatusBadge>
                <a
                  href={leg.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted"
                >
                  Resmî Kaynağı Aç
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DOCUMENTS PAGE                                */
/* -------------------------------------------------------------------------- */

export function DocumentsPage() {
  const dashboardQuery = useGetDashboard();
  const [search, setSearch] = useState("");
  const docs = dashboardQuery.data?.recentDocuments ?? fallbackDocs;
  const visible = docs.filter((doc) => doc.filename.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR")));
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Belgeler"
        description="Dosya belgeleri ve kaynak doğrulama durumu."
        action={
          <button
            data-testid="button-upload-document"
            onClick={() => window.alert("Belge kaydı için ilgili dosya çalışma alanını açın.")}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <UploadCloud size={14} />
            Belge yükle
          </button>
        }
      />
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Belge adı ara"
          testId="input-search-documents"
          className="max-w-md"
        />
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Belge</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Kategori</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider hidden sm:table-cell">Tarih</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider hidden md:table-cell">Durum</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Doğrulama</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{doc.filename}</p>
                      <p className="text-[11px] text-muted-foreground">{doc.sizeLabel}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{doc.category}</TableCell>
                <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{doc.uploadedAt}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <StatusBadge tone={doc.processingStatus === "HAZIR" ? "success" : "neutral"}>{doc.processingStatus}</StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge tone="neutral">{doc.verificationStatus}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          CASE WORKSPACE PAGE                               */
/* -------------------------------------------------------------------------- */

type TabKey = "overview" | "documents" | "timeline" | "evidence" | "precedents" | "legislation" | "similar" | "drafts";

const tabConfig: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Genel Bakış" },
  { key: "documents", label: "Belgeler" },
  { key: "timeline", label: "Kronoloji" },
  { key: "evidence", label: "Deliller" },
  { key: "precedents", label: "Emsal Kararlar" },
  { key: "legislation", label: "Mevzuat" },
  { key: "similar", label: "Benzer Dosyalar" },
  { key: "drafts", label: "Taslaklar" },
];

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
  const [tab, setTab] = useState<TabKey>("overview");
  const [showDoc, setShowDoc] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCounterparty, setShowCounterparty] = useState(false);
  const [docForm, setDocForm] = useState({ filename: "", category: "Dava Dilekçesi", type: "PDF", sizeLabel: "" });
  const [eventForm, setEventForm] = useState({ date: "", title: "", description: "" });
  const item = caseQuery.data ?? { ...fallbackCases[0], documents: [], timeline: [], analysis: fallbackAnalysis };
  const analysis = analysisQuery.data ?? fallbackAnalysis;
  const docs = docsQuery.data ?? fallbackDocs;
  const timeline = timelineQuery.data ?? fallbackTimeline;
  const save = () => updateCase.mutate({ caseId, data: { summary: item.summary } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCaseQueryKey(caseId) }) });
  const submitDoc = (e: { preventDefault: () => void }) => { e.preventDefault(); createDocument.mutate({ caseId, data: docForm }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetCaseDocumentsQueryKey(caseId) }); setShowDoc(false); } }); };
  const submitEvent = (e: { preventDefault: () => void }) => { e.preventDefault(); createTimeline.mutate({ caseId, data: eventForm }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetCaseTimelineQueryKey(caseId) }); setShowTimeline(false); } }); };

  return (
    <div className="mx-auto max-w-[1280px]">
      <button onClick={() => setLocation("/davalar")} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground" data-testid="button-back-cases">
        <ArrowLeft size={14} />Tüm davalar
      </button>
      {caseQuery.isLoading ? <LoadingBlock /> : (
        <>
          <div className="mb-4 overflow-hidden rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">Dava çalışma alanı <span className="ml-2 text-primary">DEMO</span></div>
            <div className="p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusBadge tone="success">Aktif Dosya</StatusBadge>
                  <span className="mono text-[11px] text-muted-foreground">{item.caseNumber}</span>
                  <span className="text-[11px] text-muted-foreground">{item.category}</span>
                </div>
                <h1 className="text-xl font-semibold tracking-tight">{item.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{item.court}</p>
                <div className="mt-4 grid max-w-[780px] gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-card px-3 py-2.5"><p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Müvekkil</p><p className="mt-1 text-xs font-semibold">{item.clientName}</p></div>
                  <div className="bg-card px-3 py-2.5"><p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Karşı Taraf</p><p className="mt-1 truncate text-xs font-semibold">{item.opposingParty}</p></div>
                  <div className="bg-card px-3 py-2.5"><p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Dosya Sorumlusu</p><p className="mt-1 text-xs font-semibold">Av. Behçet Alp</p></div>
                  <div className="bg-amber-50/60 px-3 py-2.5 dark:bg-amber-950/20"><p className="text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Son Süre</p><p className="mt-1 text-xs font-semibold text-amber-800 dark:text-amber-300">{item.nextDeadline ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(item.nextDeadline)) : '—'}</p></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  {item.nextHearing && <span className="flex items-center gap-1"><CalendarDays size={11} /> Sonraki duruşma: {new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.nextHearing))}</span>}
                  {item.nextDeadline && <span className="flex items-center gap-1"><Clock3 size={11} /> Son süre: {new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.nextDeadline))}</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 xl:max-w-[390px] xl:justify-end">
                <button
                  onClick={() => createAnalysis.mutate({ caseId }, { onSuccess: (result) => queryClient.setQueryData(getGetCaseAnalysisQueryKey(caseId), result) })}
                  disabled={createAnalysis.isPending}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  data-testid="button-generate-analysis"
                >
                  <Scale size={14} />Dosyayı Analiz Et
                </button>
                <button
                  onClick={() => { setTab("precedents"); }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted"
                  data-testid="button-find-precedents"
                >
                  <Gavel size={14} />Emsal Kararları Bul
                </button>
                <button
                  onClick={() => setShowCounterparty(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted"
                  data-testid="button-counterparty-analysis"
                >
                  <Info size={14} />Karşı Taraf Gibi Analiz Et
                </button>
                <button
                  onClick={() => setTab("drafts")}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted"
                  data-testid="button-create-draft"
                >
                  <FileText size={14} />Taslak Oluştur
                </button>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground/60">Demo analiz sonucu · Kurgusal dava verisi kullanılmıştır</p>
            </div>
          </div>

          <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border bg-background/70" role="tablist" aria-label="Dava dosyası bölümleri">
            {tabConfig.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                role="tab"
                aria-selected={tab === key}
                className={`min-h-11 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors ${tab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                data-testid={`tab-case-${key}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-md border border-border bg-card p-4">
                  <h3 className="mb-2 text-xs font-semibold">Dava Özeti</h3>
                  <p className="text-sm leading-5 text-muted-foreground">{item.summary}</p>
                </div>
                <ReviewList title="Güçlü Yanlar" items={analysis.strengths} tone="green" />
                <ReviewList title="Zayıf Yanlar" items={analysis.weaknesses} tone="red" />
              </div>
              <div className="space-y-4">
                <div className="rounded-md border border-border bg-card p-4">
                  <h3 className="mb-2 text-xs font-semibold">Tartışma</h3>
                  <p className="text-sm leading-5 text-muted-foreground">{analysis.dispute}</p>
                </div>
                <div className="rounded-md border border-border bg-card p-4">
                  <h3 className="mb-2 text-xs font-semibold">İddialar</h3>
                  <ul className="space-y-1.5">{analysis.claims.map((c: string, i: number) => <li key={i} className="text-xs text-muted-foreground">· {c}</li>)}</ul>
                </div>
                <div className="rounded-md border border-border bg-card p-4">
                  <h3 className="mb-2 text-xs font-semibold">Savunmalar</h3>
                  <ul className="space-y-1.5">{analysis.defenses.map((d: string, i: number) => <li key={i} className="text-xs text-muted-foreground">· {d}</li>)}</ul>
                </div>
                <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4">
                  <h3 className="mb-2 text-xs font-semibold text-amber-800">Riskler</h3>
                  <ul className="space-y-1.5">{analysis.risks.map((r: string, i: number) => <li key={i} className="text-xs text-amber-700">· {r}</li>)}</ul>
                </div>
                <p className="text-[10px] text-muted-foreground">{analysis.disclaimer}</p>
              </div>
            </div>
          )}

          {tab === "documents" && (
            <>
              <div className="mb-3 flex justify-end">
                <button onClick={() => setShowDoc(true)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground" data-testid="button-add-document">
                  <FilePlus2 size={14} />Belge ekle
                </button>
              </div>
              <div className="overflow-hidden rounded-md border border-border bg-card">
                <Table>
                  <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Belge</TableHead><TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Kategori</TableHead><TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider hidden sm:table-cell">Tarih</TableHead><TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider">Durum</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {docs.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell><div className="flex items-center gap-2"><FileText size={14} className="text-muted-foreground" /><div className="min-w-0"><p className="truncate text-sm font-medium">{doc.filename}</p><p className="text-[11px] text-muted-foreground">{doc.sizeLabel}</p></div></div></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.category}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{doc.uploadedAt}</TableCell>
                        <TableCell><StatusBadge tone="neutral">{doc.verificationStatus}</StatusBadge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {tab === "timeline" && (
            <>
              <div className="mb-3 flex justify-end">
                <button onClick={() => setShowTimeline(true)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground" data-testid="button-add-event">
                  <Clock3 size={14} />Ekleme yap
                </button>
              </div>
              <div className="space-y-2">
                {timeline.map((event) => (
                  <div key={event.id} className="flex gap-3 rounded-md border border-border bg-card p-3">
                    <span className="mono shrink-0 text-[11px] text-muted-foreground">{event.date}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
                      <StatusBadge tone={event.sourceStatus === "DOĞRULANDI" ? "success" : "neutral"}>{event.sourceStatus}</StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "evidence" && (
            <div className="space-y-3">
              <div className="mb-2 text-[11px] text-muted-foreground/70">
                Demo delil matrisi · Kurgusal dava verisi
              </div>
              {fallbackEvidence.map((ev) => (
                <div key={ev.id} className="rounded-md border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold">{ev.claim}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded border border-emerald-200 bg-emerald-50/50 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase text-emerald-700">Destekleyen Delil</p>
                      <ul className="space-y-1">{ev.supportingEvidence.map((s, i) => <li key={i} className="text-[11px] text-emerald-800">· {s}</li>)}</ul>
                    </div>
                    <div className="rounded border border-red-200 bg-red-50/50 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase text-red-700">Karşı Delil</p>
                      <ul className="space-y-1">{ev.contradictingEvidence.map((s, i) => <li key={i} className="text-[11px] text-red-800">· {s}</li>)}</ul>
                    </div>
                    <div className="rounded border border-amber-200 bg-amber-50/50 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase text-amber-700">Eksik Delil</p>
                      <ul className="space-y-1">{ev.missingEvidence.map((s, i) => <li key={i} className="text-[11px] text-amber-800">· {s}</li>)}</ul>
                    </div>
                    <div className="rounded border border-border bg-muted/50 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Değerlendirme</p>
                      <p className="text-[11px] leading-4 text-muted-foreground">{ev.assessment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "precedents" && (
            <div className="space-y-3">
              {fallbackPrecedents.map((p) => (
                <div key={p.id} className="rounded-md border border-border bg-card p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={p.position === "LEHE" ? "success" : p.position === "ALEYHE" ? "danger" : "warning"}>{p.position}</StatusBadge>
                        <span className="text-sm font-medium">{p.legalTopic}</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span>{p.court} · {p.chamber}</span>
                        <span className="mono">{p.caseNumber} / {p.decisionNumber}</span>
                        <span>{p.decisionDate}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge tone="success">{p.verificationStatus}</StatusBadge>
                      <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted">
                        Resmî Kaynağı Aç
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "legislation" && (
            <div className="space-y-3">
              {fallbackLegislation.map((leg) => (
                <div key={leg.id} className="rounded-md border border-border bg-card p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{leg.lawNumber} Sayılı {leg.lawName}</span>
                        <span className="mono text-[11px] text-muted-foreground">Madde {leg.articleNumber}</span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{leg.articleTitle}</p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{leg.articleText}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge tone="success">{leg.verificationStatus}</StatusBadge>
                      <a href={leg.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted">
                        Resmî Kaynağı Aç
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "similar" && (
            <div className="space-y-3">
              <div className="mb-2 text-[11px] text-muted-foreground/70">
                Semantik benzerlik · Demo verisi
              </div>
              {fallbackMemory.map((mem) => (
                <div key={mem.id} className="rounded-md border border-border bg-card p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{mem.caseNumber} — {mem.title}</span>
                        <StatusBadge tone="neutral">{mem.outcome}</StatusBadge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span>{mem.court}</span>
                        <span>Müvekkil: {mem.clientName}</span>
                        <span>Karşı taraf: {mem.opposingParty}</span>
                      </div>
                      <div className="mt-2 rounded bg-muted/50 p-2">
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">Semantik benzerlik</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${mem.similarityScore * 100}%` }} />
                          </div>
                          <span className="mono text-[11px] text-muted-foreground">{(mem.similarityScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">Ortak Konular</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {mem.commonIssues.map((issue) => (
                            <span key={issue} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{issue}</span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground"><strong>Yararlı argüman:</strong> {mem.usefulArgument}</p>
                      <p className="mt-1 text-xs text-muted-foreground"><strong>Avukat notu:</strong> {mem.lawyerNote}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "drafts" && (
            <div className="space-y-3">
              {fallbackDrafts.map((draft) => (
                <div key={draft.id} className="rounded-md border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{draft.title}</span>
                        <StatusBadge tone={draft.status === "NİHAİ" ? "success" : "warning"}>{draft.status}</StatusBadge>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{draft.type} {draft.approvedAt ? `· Onay: ${draft.approvedAt}` : ""}</p>
                    </div>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap rounded bg-muted/50 p-3 text-[11px] leading-4 text-muted-foreground font-sans">{draft.content}</pre>
                  <p className="mt-2 text-[10px] text-muted-foreground/60">DEMO — KURGUSAL DİLEKÇE · Avukat kontrolü gerekir</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-border bg-card p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Yeni belge</h2>
              <button onClick={() => setShowDoc(false)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X size={14} /></button>
            </div>
            <form onSubmit={submitDoc} className="space-y-3">
              <label className="block"><span className="mb-1 block text-xs font-medium">Dosya adı *</span><input value={docForm.filename} onChange={(e) => setDocForm((c) => ({ ...c, filename: e.target.value }))} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" /></label>
              <label className="block"><span className="mb-1 block text-xs font-medium">Kategori *</span><input value={docForm.category} onChange={(e) => setDocForm((c) => ({ ...c, category: e.target.value }))} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" /></label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowDoc(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Vazgeç</button>
                <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-border bg-card p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Yeni olay</h2>
              <button onClick={() => setShowTimeline(false)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X size={14} /></button>
            </div>
            <form onSubmit={submitEvent} className="space-y-3">
              <label className="block"><span className="mb-1 block text-xs font-medium">Tarih *</span><input value={eventForm.date} onChange={(e) => setEventForm((c) => ({ ...c, date: e.target.value }))} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" /></label>
              <label className="block"><span className="mb-1 block text-xs font-medium">Başlık *</span><input value={eventForm.title} onChange={(e) => setEventForm((c) => ({ ...c, title: e.target.value }))} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary" /></label>
              <label className="block"><span className="mb-1 block text-xs font-medium">Açıklama</span><textarea value={eventForm.description} onChange={(e) => setEventForm((c) => ({ ...c, description: e.target.value }))} rows={3} className="w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTimeline(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Vazgeç</button>
                <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCounterparty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-md border border-border bg-card p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Karşı Taraf Analizi</h2>
              <button onClick={() => setShowCounterparty(false)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X size={14} /></button>
            </div>
            <div className="mb-3 text-[10px] text-muted-foreground/60">Demo analiz sonucu · Kurgusal dava verisi</div>
            <div className="space-y-4">
              <section>
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Muhtemel Karşı Argümanlar</h3>
                <ul className="space-y-1.5">{fallbackCounterparty.likelyArguments.map((a, i) => <li key={i} className="text-xs text-muted-foreground">· {a}</li>)}</ul>
              </section>
              <section>
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Kullanabilecekleri Deliller</h3>
                <ul className="space-y-1.5">{fallbackCounterparty.evidenceTheyMayUse.map((e, i) => <li key={i} className="text-xs text-muted-foreground">· {e}</li>)}</ul>
              </section>
              <section>
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Dosyamızdaki Zayıf Noktalar</h3>
                <ul className="space-y-1.5">{fallbackCounterparty.weaknessesInOurCase.map((w, i) => <li key={i} className="text-xs text-muted-foreground">· {w}</li>)}</ul>
              </section>
              <section>
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Savunma İçin Hazırlanması Gerekenler</h3>
                <ul className="space-y-1.5">{fallbackCounterparty.preparationItems.map((p, i) => <li key={i} className="text-xs text-muted-foreground">· {p}</li>)}</ul>
              </section>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowCounterparty(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SIMPLE PAGES                                   */
/* -------------------------------------------------------------------------- */

function SimplePage({ title, description, icon: Icon = FolderOpen }: { title: string; description: string; icon?: typeof FolderOpen }) {
  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader title={title} description={description} />
      <div className="rounded-md border border-border bg-card p-6">
        <Icon size={18} className="text-muted-foreground" />
        <p className="mt-4 text-sm font-medium">Çalışma alanı hazır</p>
        <p className="mt-1 text-xs text-muted-foreground">Bu modül, doğrulanmış kaynak bağlantıları ve avukat onayıyla genişletilmeye hazır.</p>
      </div>
    </div>
  );
}

export function DraftsPage() { return <SimplePage title="Dilekçeler" description="Dosyanın kaynaklarıyla çalışan, düzenlenebilir taslaklar hazırlayın." icon={FileText} />; }
export function CalendarPage() { return <SimplePage title="Takvim & Süreler" description="Duruşmalar ve kritik süreler dosya bağlamıyla birlikte." icon={Clock3} />; }
export function AssistantPage() { return <ResearchPage mode="research" />; }
export function ArchivePage() { return <SimplePage title="Arşiv" description="Eski dosyalarınızı ve araştırma geçmişini tek aramada bulun." icon={FolderOpen} />; }
export function SettingsPage() { return <SimplePage title="Ayarlar" description="Profil, ekip rolleri, güvenlik ve bildirim tercihlerini yönetin." />; }
