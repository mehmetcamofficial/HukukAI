export type SimilarCaseMemory = {
  caseId: string;
  similarCaseId: string;
  similarityScore: number;
  commonIssues: string[];
  commonEvidence: string[];
  whySimilar: string;
};

export const demoMemory: SimilarCaseMemory[] = [
  {
    caseId: "case-2026-145",
    similarCaseId: "case-2024-381",
    similarityScore: 0.9,
    commonIssues: ["Fazla çalışma ücreti", "Bordro itirazı", "Tanık beyanı"],
    commonEvidence: [
      "Bordro ile banka hesap karşılaştırması",
      "Çalışma saati kayıtları",
      "Tanık beyanları",
    ],
    whySimilar:
      "Her iki davada da fazla çalışma ücreti talep edilmiş, bordrolar itiraz konusu olmuştur. Benzer delil yapısı mevcuttur.",
  },
  {
    caseId: "case-2026-145",
    similarCaseId: "case-2025-077",
    similarityScore: 0.82,
    commonIssues: ["Yıllık izin hakkı", "Ücret alacağı", "İzin formu geçerliliği"],
    commonEvidence: [
      "Yıllık izin formu",
      "Bordro kayıtları",
      "SGK kesinti dökümleri",
    ],
    whySimilar:
      "Yıllık izin ve ücret alacağının birlikte talep edildiği benzer bir dava yapısı mevcuttur. Davalı lehine sonuçlanmış olması karşılaştırma açısından faydalıdır.",
  },
];
