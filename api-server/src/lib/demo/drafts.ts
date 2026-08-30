export type ApprovedPleading = {
  id: string;
  caseId: string;
  type: string;
  title: string;
  content: string;
  status: string;
  approvedAt: string;
  styleTags: string[];
};

export const demoDrafts: ApprovedPleading[] = [
  {
    id: "draft-001",
    caseId: "case-2024-381",
    type: "Cevap Dilekçesi",
    title: "Fazla Mesai Alacağı — Cevap Dilekçesi (Nihai)",
    content:
      "DEMO — KURGUSAL DİLEKÇE\n\nMahkemenize sunulan davanın savunmasına ilişkin cevap dilekçemizdir.\n\n1. Davacının fazla çalışma iddiası, bordroların imzalı olması nedeniyle asılsızdır. Davacı, her ay bordrosunu imzalamış ve fazla çalışma ücreti almadığını beyan etmemiştir.\n\n2. Haftalık çalışma süresi 45 saati aşmamaktadır. Şirket politikası gereği fazla çalışma önceden onay gerektirmektedir.\n\n3. Tanık beyanları çelişkilidir ve mahkeme tarafından dikkate alınmamalıdır.\n\nSonuç: Davanın reddini talep ederiz.",
    status: "NİHAİ",
    approvedAt: "15 Mayıs 2024",
    styleTags: ["Cevap Dilekçesi", "Fazla Mesai", "İş Hukuku"],
  },
  {
    id: "draft-002",
    caseId: "case-2025-077",
    type: "Dava Dilekçesi",
    title: "Yıllık İzin ve Ücret Alacağı — Dava Dilekçesi (Nihai)",
    content:
      "DEMO — KURGUSAL DİLEKÇE\n\nAşağıda arz ve talep edilen hususlar->___\n\nMüvekkil Kuzey Yapı A.Ş., davalı Mehmet Yıldız'ın yıllık izin hakkını kullandığını ve ücretinin tam olarak ödendiğini ispatlamıştır.\n\n1. İzin defteri kayıtları ve imzalı formlar mevcuttur.\n\n2. Bordro ile banka hesap özeti uyumludur.\n\n3. SGK kayıtları ile çalışma süresi uyumludur.\n\nSonuç: Davanın kabulüne karar verilmesini talep ederiz.",
    status: "NİHAİ",
    approvedAt: "10 Mart 2025",
    styleTags: ["Dava Dilekçesi", "Yıllık İzin", "İş Hukuku"],
  },
  {
    id: "draft-003",
    caseId: "case-2026-145",
    type: "Bilirkişi Raporuna İtiraz",
    title: "Bilirkişi Raporuna İtiraz Dilekçesi (Taslak)",
    content:
      "DEMO — KURGUSAL DİLEKÇE\n\nBilirkişi raporuna ilişkin itirazlarımız以下:\n\n1. Bilirkişi, WhatsApp mesajlarını delil olarak değerlendirmemiştir. Mesai sonrası gönderilen iş talimatları fazla çalışmanın kanıtıdır.\n\n2. Puantaj çizelgesindeki eksik giriş-çıkış kayıtları, bilirkişi tarafından yeterince incelenmemiştir.\n\n3. Bordro ile banka hesap arasındaki fark, SGK kesintileriyle açıklanamaz. 2.500 TL'lik aylık fark sabittir ve kesinti kalemleriyle uyumlu değildir.\n\nSonuç: Raporun eksikliklerinin giderilmesi ve yeniden düzenlenmesini talep ederiz.",
    status: "TASLAK",
    approvedAt: "",
    styleTags: ["Bilirkişi İtirazı", "İş Hukuku", "Taslak"],
  },
];
