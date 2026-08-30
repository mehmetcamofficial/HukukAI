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
    court: "Kurgu 14. İş Mahkemesi",
    chamber: null,
    category: "İş Hukuku",
    clientName: "Deniz Aras",
    opposingParty: "Marmara Lojistik A.Ş.",
    status: "ACTIVE",
    filingDate: "2026-02-25",
    nextHearing: "2026-09-14",
    nextDeadline: "2026-09-02",
    updatedAt: "2026-08-27",
    summary:
      "Fazla çalışma ve yıllık ücretli izin ile ücret alacağının tahsili. Davacı, iş sözleşmesinin feshinden sonra kullanılmayan izinler ve fazla çalışma ücretinin ödenmediğini ileri sürmektedir. Davalı, bordroların imzalı olduğunu ve fazla çalışma iddiasını reddetmektedir.",
    tags: ["Fazla çalışma", "Yıllık izin", "Ücret alacağı", "Fesih"],
    documentCount: 10,
  },
  {
    id: "case-2024-381",
    title: "Fazla Mesai Alacağı",
    caseNumber: "2024/381",
    court: "Kurgu 8. İş Mahkemesi",
    chamber: "3. Hukuk Dairesi",
    category: "İş Hukuku",
    clientName: "Ece Korkmaz",
    opposingParty: "Anadolu Tekstil Ltd. Şti.",
    status: "CLOSED",
    filingDate: "2024-04-10",
    nextHearing: null,
    nextDeadline: null,
    updatedAt: "2025-03-15",
    summary:
      "Fazla mesai ücreti alacağı. Davacı, haftalık 45 saati aşan çalışmaların ücretinin ödenmediğini iddia etti. Mahkeme, delillerin yetersizliği nedeniyle iddianın kısmen kabulüne karar verdi.",
    tags: ["Fazla mesai", "Ücret alacağı", "Kısmen Kabul"],
    documentCount: 0,
  },
  {
    id: "case-2025-077",
    title: "Yıllık İzin ve Ücret Alacağı",
    caseNumber: "2025/077",
    court: "Kurgu 5. İş Mahkemesi",
    chamber: null,
    category: "İş Hukuku",
    clientName: "Kuzey Yapı A.Ş.",
    opposingParty: "Mehmet Yıldız",
    status: "CLOSED",
    filingDate: "2025-01-20",
    nextHearing: null,
    nextDeadline: null,
    updatedAt: "2025-11-22",
    summary:
      "Davalı işçinin yıllık ücretli izin hakkını kullandığı ve ücretinin tam olarak ödendiği savunulmuştur. Mahkeme, davacının izin kayıtlarını sunduğunu ve ücret bordrosunun uyumlu olduğunu tespit ederek davanın kabulüne karar vermiştir.",
    tags: ["Yıllık izin", "Ücret alacağı", "Kabul"],
    documentCount: 0,
  },
];
