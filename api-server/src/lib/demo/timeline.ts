export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  sourceStatus: string;
  editable: boolean;
};

export const demoTimeline: TimelineEvent[] = [
  {
    id: "event-001",
    date: "12.01.2025",
    title: "İş sözleşmesi imzalandı",
    description:
      "Deniz Aras ile Marmara Lojistik A.Ş. arasında iş sözleşmesi imzalandı. Lojistik Operatör pozisyonunda iş başlangıcı. Aylık brüt ücret: 28.000 TL.",
    sourceStatus: "DOĞRULANDI",
    editable: true,
  },
  {
    id: "event-002",
    date: "18.08.2025",
    title: "Mesai sonrası WhatsApp mesajları",
    description:
      "İş yeri yöneticisi tarafından Deniz Aras'a 20:00'den sonra gönderilen iş talimatları. Gece 23:00'te teslimat planı talep eden mesajlar mevcuttur.",
    sourceStatus: "DOĞRULANAMADI",
    editable: true,
  },
  {
    id: "event-003",
    date: "12.01.2026",
    title: "İhtarname gönderildi",
    description:
      "Davacı avukatı tarafından fazla çalışma ve izin ücreti alacağının ödenmesi için ihtarname gönderildi. 7 günlük süre verildi.",
    sourceStatus: "DOĞRULANDI",
    editable: true,
  },
  {
    id: "event-004",
    date: "18.01.2026",
    title: "İş ilişkisi sona erdi",
    description:
      "Davacının iş sözleşmesi feshedildi. Fesih tarihine ilişkin taraflar arasında çelişki mevcuttur. Davacı 20.01, davalı 18.01 tarihini göstermektedir.",
    sourceStatus: "DOĞRULANAMADI",
    editable: true,
  },
  {
    id: "event-005",
    date: "05.02.2026",
    title: "Arabuluculuk başvurusu",
    description:
      "Davacı, arabuluculuk bürosuna başvurmuştur. Arabuluculuk görüşmesi 12.02.2026 tarihine planlanmıştır.",
    sourceStatus: "DOĞRULANDI",
    editable: true,
  },
  {
    id: "event-006",
    date: "18.02.2026",
    title: "Arabuluculuk tutanağı",
    description:
      "Arabuluculuk görüşmesi sonuçsuz kalmıştır. Uzlaşma sağlanamamıştır. Son tutanak tarihli olarak dava yoluna gidilmiştir.",
    sourceStatus: "DOĞRULANDI",
    editable: true,
  },
  {
    id: "event-007",
    date: "25.02.2026",
    title: "Dava açıldı",
    description:
      "Kurgu 14. İş Mahkemesi'ne dava dilekçesi sunulmuştur. Fazla çalışma, yıllık izin ve ücret alacağının tahsili talep edilmiştir.",
    sourceStatus: "DOĞRULANDI",
    editable: true,
  },
  {
    id: "event-008",
    date: "20.06.2026",
    title: "Bilirkişi raporu açıklandı",
    description:
      "Bilirkişi heyeti raporunu mahkemeye sundu. Fazla çalışma için yeterli delil bulunamadığı, ancak ücret bordrosu ile banka hesap arasında uyumsuzluk olduğu belirtildi.",
    sourceStatus: "DOĞRULANAMADI",
    editable: true,
  },
  {
    id: "event-009",
    date: "14.09.2026",
    title: "Duruşma yapıldı",
    description:
      "Taraflar bilirkişi raporuna ilişkin beyanlarını sundu. Davacı, rapordaki eksiklikleri dile getirdi. Bir sonraki duruşma 20.01.2027.",
    sourceStatus: "DEMO — KURGUSAL DAVA VERİSİ",
    editable: true,
  },
];
