export type Research = {
  id: string;
  query: string;
  issue: string;
  createdAt: string;
  confidence: string;
  result: string;
  demo: boolean;
  sources: Array<{
    id: string;
    name: string;
    title: string;
    status: string;
    reference: string;
    excerpt: string;
  }>;
};

export const demoResearch: Research[] = [
  {
    id: "research-001",
    query: "Fazla mesai ispat yükü",
    issue: "Fazla çalışma ücreti talebinde ispat yükü",
    createdAt: "2026-03-10",
    confidence: "YÜKSEK",
    result:
      "Fazla çalışmada ispat yükü işçidedir. Ancak işverenin tutmakla yükümlü olduğu kayıt ve belgelerin işverende olması nedeniyle, işveren bu kayıtları sunmak zorundadır. Kayıtların sunulmaması veya eksik sunulması halinde işçinin beyanı esas alınabilir.",
    demo: true,
    sources: [
      {
        id: "source-demo-1",
        name: "Yargıtay 9. Hukuk Dairesi",
        title: "Emsal Karar — Fazla Çalışma İspatı",
        status: "DOĞRULANDI",
        reference: "Yargıtay 9. HD, E. 2019/12345, K. 2020/6789",
        excerpt:
          "İşveren, işçinin çalışma saatlerini gösteren kayıtları tutmakla yükümlüdür. Bu kayıtların sunulmaması halinde, işçinin fazla çalışma iddiası lehine değerlendirilir.",
      },
    ],
  },
  {
    id: "research-002",
    query: "İmzalı bordronun hukuki etkisi",
    issue: "İmzalı bordronun fazla çalışma iddiasına etkisi",
    createdAt: "2026-03-12",
    confidence: "ORTA",
    result:
      "İmzalı bordro, işçinin çalışma şartlarını kabul ettiği anlamına gelmez. Ancak mahkeme, bordroyu tek başına delil olarak değerlendirebilir. Bordro ile çelişen diğer delillerin birlikte değerlendirilmesi gerekir.",
    demo: true,
    sources: [
      {
        id: "source-demo-2",
        name: "Yargıtay 9. Hukuk Dairesi",
        title: "Emsal Karar — Bordro İtirazı",
        status: "DOĞRULANDI",
        reference: "Yargıtay 9. HD, E. 2020/23456, K. 2021/7890",
        excerpt:
          "İmzalı bordro tek başına kesin delil değildir. İşçinin imzası, bordrodaki içeriğin tam ve doğru olduğunu kabul ettiği anlamına gelmez.",
      },
    ],
  },
  {
    id: "research-003",
    query: "Yıllık izin kullandırıldığının ispatı",
    issue: "Yıllık izin hakkının kullanıldığına dair ispat",
    createdAt: "2026-03-15",
    confidence: "YÜKSEK",
    result:
      "Yıllık izin hakkının kullanıldığı işveren tarafından ispat edilmelidir. İzin defteri, imzalı izin formu veya elektronik ortamda tutulan izin kayıtları delil olarak kabul edilir. İzin formundaki imzanın işçiye ait olmadığının ispatı gerekir.",
    demo: true,
    sources: [],
  },
  {
    id: "research-004",
    query: "WhatsApp delilinin değerlendirilmesi",
    issue: "Elektronik yazışmaların delil değeri",
    createdAt: "2026-03-18",
    confidence: "ORTA",
    result:
      "WhatsApp mesajları, HMK gereği elektronik veri olarak delil kabul edilebilir. Ancak mesajların içeriğinin doğruluğu ve gönderenin tespiti gerekir. Ekran görüntüsü yeterli olmayabilir, orijinal veri talep edilebilir.",
    demo: true,
    sources: [],
  },
  {
    id: "research-005",
    query: "Bilirkişi raporuna itiraz usulü",
    issue: "Bilirkişi raporuna karşı itiraz süreci",
    createdAt: "2026-06-25",
    confidence: "YÜKSEK",
    result:
      "Bilirkişi raporuna karşı taraflar yazılı itirazlarını sunabilir. Mahkeme, itirazları değerlendirerek raporu kabul, reddedebilir veya bilirkişiden ek rapor isteyebilir.EMY义",
    demo: true,
    sources: [
      {
        id: "source-demo-3",
        name: "HMK Madde 293",
        title: "Bilirkişi Raporuna İtiraz",
        status: "DOĞRULANDI",
        reference: "HMK Madde 293",
        excerpt:
          "Taraflar, bilirkişi raporuna yazılı olarak itiraz edebilir. Mahkeme, itirazları değerlendirerek karar verir.",
      },
    ],
  },
  {
    id: "research-006",
    query: "Fazla çalışma ispatında elektronik yazışmalar",
    issue: "WhatsApp ve e-postanın fazla çalışma ispatındaki rolü",
    createdAt: "2026-04-02",
    confidence: "ORTA",
    result:
      "Elektronik yazışmalar, fazla çalışmanın kanıtı olabilir. Ancak tek başına yeterli değildir. Puantaj, giriş-çıkış kayıtları ve tanık beyanlarıyla birlikte değerlendirilmelidir.",
    demo: true,
    sources: [],
  },
  {
    id: "research-007",
    query: "Kısmen kabul kararında gerekçe ağırılığı",
    issue: "Kısmi kabul halinde gerekçe ve oran belirleme",
    createdAt: "2025-02-10",
    confidence: "DÜŞÜK",
    result:
      "DEMO ANALİZİ — Kısmen kabul kararında mahkeme, her bir talep ayrı ayrı değerlendirir. Delillerin ağırlığı ve ikna ediciliğine göre oran belirlenir. Gerekçe kısmında her iddia için ayrı ayrı değerlendirme yapılır.",
    demo: true,
    sources: [],
  },
  {
    id: "research-008",
    query: "Fesih tarihi çelişkisi",
    issue: "İş sözleşmesi fesih tarihine ilişkin çelişkinin giderilmesi",
    createdAt: "2026-05-05",
    confidence: "ORTA",
    result:
      "Fesih tarihine ilişkin çelişkide SGK bildirim tarihi, banka hesap kesim tarihi ve fesih bildirimi birlikte değerlendirilir. Hangi tarihin esas alınacağı mahkemenin takdirindedir.",
    demo: true,
    sources: [],
  },
];
