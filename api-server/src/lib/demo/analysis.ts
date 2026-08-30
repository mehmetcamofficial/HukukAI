export type CaseAnalysis = {
  id: string;
  caseId: string;
  generatedAt: string;
  status: string;
  dispute: string;
  claims: string[];
  defenses: string[];
  strengths: string[];
  weaknesses: string[];
  missingEvidence: string[];
  risks: string[];
  sources: Array<{
    id: string;
    name: string;
    title: string;
    status: string;
    reference: string;
    excerpt: string;
  }>;
  disclaimer: string;
};

export const demoAnalysis: CaseAnalysis = {
  id: "analysis-demo",
  caseId: "case-2026-145",
  generatedAt: "28 Ağustos 2026, 09:42",
  status: "DEMO ANALİZİ",
  dispute:
    "Fazla çalışma ve kullanılmayan yıllık izin ücretlerinin tahsili ile ücret bordrosu ile banka hesap özeti arasındaki uyumsuzluğun giderilmesi.",
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
  disclaimer:
    "DEMO ANALİZİ — Bu analiz demo verisiyle oluşturulmuştur. Hukuki görüş yerine geçmez; avukat kontrolü gerektirir. DEMO — KURGUSAL DAVA VERİSİ",
};
