export type EvidenceRecord = {
  id: string;
  claim: string;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  missingEvidence: string[];
  aiAssessment: string;
  lawyerAssessment: string;
  verificationStatus: string;
};

export const demoEvidence: EvidenceRecord[] = [
  {
    id: "evidence-001",
    claim: "Fazla çalışma ücreti alacağının ödenmemesi",
    supportingEvidence: [
      "WhatsApp yazışmalarında mesai sonrası çalışma talimatları (doc-006)",
      "Tanık beyanları: Mesai sonrası çalışmaları doğrulayan iş arkadaşları",
      "Puantaj çizelgesinde bazı aylarda 20:00 sonrası çıkış saatleri (doc-005)",
    ],
    contradictingEvidence: [
      "Bordrolarda fazla çalışma ücreti gösterilmemiş (doc-004)",
      "Davalı şirketin beyanı: Tüm çalışmaların mesai içinde tamamlandığı",
    ],
    missingEvidence: [
      "Tam giriş-çıkış kayıtları (access kartı logları)",
      "İş yeri güvenlik kamerası kayıtları",
      "Resmi fazla çalışma onay formu",
    ],
    aiAssessment:
      "WhatsApp mesajları ve puantaj verileri kısmi destek sağlamaktadır. Ancak kesin ispat için tam giriş-çıkış kayıtları gereklidir. Bilirkişi raporunda da bu eksiklik vurgulanmıştır.",
    lawyerAssessment:
      "Deliller yetersiz görünmektedir. Tanık beyanları destekleyici olabilir ancak mahkeme genellikle yazılı delil tercih etmektedir.",
    verificationStatus: "DOĞRULANAMADI",
  },
  {
    id: "evidence-002",
    claim: "Yıllık ücretli izin kullanılmamış olması",
    supportingEvidence: [
      "Davacı beyanı: İzinlerin kullandırılmadığı",
      "Banka hesap özeti: İzin ücreti ödemesinin yapılmamış olması",
    ],
    contradictingEvidence: [
      "Yıllık izin formu: 14 gün izin kullandığı gösterilmiş (doc-007)",
      "Davalı şirkin beyanı: İzinlerin kullandırıldığına dair kayıt mevcut",
    ],
    missingEvidence: [
      "İmza doğrulaması (formun davacıya ait olup olmadığı)",
      "Orijinal izin defteri kayıtları",
      "İzin onay e-postaları veya yazışmaları",
    ],
    aiAssessment:
      "İzin formu mevcut ancak imza sahte olabilir. İmza doğrulaması yapılmadığı sürece çelişki devam etmektedir.",
    lawyerAssessment:
      "İmza itiraz edilirse bilirkişi incelemesi gerekecektir. Form tek başına yeterli değildir.",
    verificationStatus: "DOĞRULANAMADI",
  },
  {
    id: "evidence-003",
    claim: "Bordro ile banka hesap arasında ücret uyumsuzluğu",
    supportingEvidence: [
      "Banka hesap özeti: Aylık 28.000 TL yerine 25.500 TL yattığı",
      "Bordro: Brüt 28.000 TL olarak gösterilmiş",
    ],
    contradictingEvidence: [
      "Davalı şirketin beyanı: Farkın SGK kesintilerinden kaynaklandığı",
    ],
    missingEvidence: [
      "Tam banka-hesap özeti karşılaştırması",
      "SGK kesinti dökümleri",
      "Vergi matrah bilgileri",
    ],
    aiAssessment:
      "Banka hesap ile bordro arasında net fark mevcuttur. Farkın kesintilerden kaynaklanıp değerlendirilmesi gereklidir.",
    lawyerAssessment:
      "Bu güçlü bir delildir. Mahkeme banka hesap özetini genellikle tercih eder. Kesinti savunmasını çürütmek için detaylı hesaplama gerekebilir.",
    verificationStatus: "DOĞRULANAMADI",
  },
  {
    id: "evidence-004",
    claim: "Haksız fesih",
    supportingEvidence: [
      "İhtarname: Fesih öncesi alacakların ödemesi talep edilmiş (doc-008)",
      "Fesih tarihine ilişkin çelişki: Davacı 20.01, davalı 18.01",
    ],
    contradictingEvidence: [
      "Davalı şirketin devam eden devamsızlık kayıtları",
      "Fesih bildirimi: Davacının devamsızlığı gerekçesi",
    ],
    missingEvidence: [
      "Bildirim tebligat kayıtları",
      "Devamsızlık tutanakları",
      "Fesih sonrası banco ve SGK bildirimleri",
    ],
    aiAssessment:
      "Fesih yasallığı tartışmalıdır. Davacı lehine ihtarname mevcut ancak devamsızlık iddiası da değerlendirilmelidir.",
    lawyerAssessment:
      "Fesih davası ayrı bir dava konusu olabilir. Mevcut davada sadece alacak talepleri değerlendirilmektedir.",
    verificationStatus: "DOĞRULANAMADI",
  },
];
