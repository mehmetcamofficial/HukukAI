export type Activity = {
  id: string;
  action: string;
  detail: string;
  createdAt: string;
  actor: string;
};

export const demoActivity: Activity[] = [
  {
    id: "act-001",
    action: "Belge eklendi",
    detail: "Bilirkişi_Raporu_2026_145.pdf — 2026/145",
    createdAt: "2026-08-27",
    actor: "Av. Ayşe Yılmaz",
  },
  {
    id: "act-002",
    action: "Duruşma notu",
    detail: "14.09.2026 tarihli duruşma tutanağı eklendi",
    createdAt: "2026-08-26",
    actor: "Av. Ayşe Yılmaz",
  },
  {
    id: "act-003",
    action: "Duruşma eklendi",
    detail: "Sonraki duruşma: 20.01.2027 — Kurgu 14. İş Mahkemesi",
    createdAt: "2026-08-25",
    actor: "Sistem",
  },
  {
    id: "act-004",
    action: "Araştırma yapıldı",
    detail: "Bilirkişi raporuna itiraz usulü araştırıldı",
    createdAt: "2026-08-20",
    actor: "Av. Ayşe Yılmaz",
  },
  {
    id: "act-005",
    action: "Belge güncellendi",
    detail: "Puantaj çizelgesi güncellendi — 2025 tam yıl",
    createdAt: "2026-08-15",
    actor: "Av. Ayşe Yılmaz",
  },
  {
    id: "act-006",
    action: "Dava kapatıldı",
    detail: "2024/381 — Fazla Mesai Alacağı — Kısmen Kabul",
    createdAt: "2025-03-15",
    actor: "Sistem",
  },
  {
    id: "act-007",
    action: "Dava kapatıldı",
    detail: "2025/077 — Yıllık İzin ve Ücret Alacağı — Kabul",
    createdAt: "2025-11-22",
    actor: "Sistem",
  },
];
