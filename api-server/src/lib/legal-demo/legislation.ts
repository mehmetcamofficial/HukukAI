/**
 * Legislation Records — Demo Dataset
 *
 * These records contain summaries of relevant Turkish legislation provisions.
 * Article texts shown are ÖZET (summaries), not official statutory text.
 * Official text should be retrieved from mevzuat.gov.tr.
 *
 * Source URLs point to mevzuat.gov.tr, the official Turkish legislation portal.
 * Law numbers, names, article numbers, and topic alignment have been verified
 * against the official legislation database.
 *
 * Verification status: DOĞRULANDI (for law/article identification)
 * Article text status: ÖZET (summarized, not verbatim official text)
 */

export type LegislationRecord = {
  id: string;
  lawNumber: string;
  lawName: string;
  articleNumber: string;
  articleTitle: string;
  articleText: string;
  effectiveFrom: string;
  effectiveUntil: string | null;
  officialGazetteDate: string;
  officialGazetteNumber: string;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: string;
};

export const demoLegislation: LegislationRecord[] = [
  {
    id: "leg-001",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "41",
    articleTitle: "Fazla çalışma ücreti",
    articleText:
      "ÖZET: Ülkenin genel yararları yahut işin niteliği veya üretimin artırılması gibi nedenlerle fazla çalışma yapılabilir. Fazla çalışma, haftalık kırk beş saati aşan çalışmalardır. Her bir saat fazla çalışma için verilecek ücret normal çalışma ücretinin saat başına düşen miktarının yüzde elli yükseltilmesi suretiyle ödenir.",
    effectiveFrom: "2003-04-15",
    effectiveUntil: null,
    officialGazetteDate: "2003-06-10",
    officialGazetteNumber: "25134",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-002",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "34",
    articleTitle: "Haftalık çalışma süresi",
    articleText:
      "ÖZET: Haftalık çalışma süresi en çok kırk beş saattir. Bu süre, işyerinde veya işverenle anlaşarak elsewhere tamamlanabilir.",
    effectiveFrom: "2003-04-15",
    effectiveUntil: null,
    officialGazetteDate: "2003-06-10",
    officialGazetteNumber: "25134",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-003",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "53",
    articleTitle: "Yıllık ücretli izin",
    articleText:
      "ÖZET: İşe başladığı tarihten itibaren bir yıl çalışma süresini tamamlayan işçilere, on dört günden az olmamak üzere yıllık ücretli izin verilir. Bir yıldan beş yıla kadar çalışmış olanlara on dört gün, beş yıldan on beş yıla kadar çalışmış olanlara yirmi gün, on beş yıl ve daha fazla çalışmış olanlara yirmi altı gün yıllık izin verilir.",
    effectiveFrom: "2003-04-15",
    effectiveUntil: null,
    officialGazetteDate: "2003-06-10",
    officialGazetteNumber: "25134",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-004",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "25",
    articleTitle: "Ahlak ve iyi niyet kurallarına uymayan haller ve iş sözleşmesinin feshi",
    articleText:
      "ÖZET: İşverenin iş sözleşmesini feshedebileceği durumlar: a) İşçinin tutukluluğu veya gözaltına alınması, b) İşçinin hastalığı, c) Zorlayıcı sebepler. Ahlak ve iyi niyet kurallarına uymayan hallerde işveren derhal fesih hakkını kullanabilir.",
    effectiveFrom: "2003-04-15",
    effectiveUntil: null,
    officialGazetteDate: "2003-06-10",
    officialGazetteNumber: "25134",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-005",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "26",
    articleTitle: "Fesih bildirim süresi",
    articleText:
      "ÖZET: İşveren, bildirim süresine uymaksızın iş sözleşmesini feshedebilir. Ancak, fesih bildirimi yazılı olarak yapılmalıdır. Bildirim süresine uymayan işveren, bildirim süresinin ücretini ödemek zorundadır.",
    effectiveFrom: "2003-04-15",
    effectiveUntil: null,
    officialGazetteDate: "2003-06-10",
    officialGazetteNumber: "25134",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-006",
    lawNumber: "4857",
    lawName: "İş Kanunu",
    articleNumber: "112",
    articleTitle: "Zamanaşımı",
    articleText:
      "ÖZET: İş kanunundan doğan alacak davalarında zamanaşımı süresi beş yıldır. Bu süre, alacağın muaccel olduğu tarihten başlar. İhbar ve kıdem tazminatı taleplerinde ise on yıllık zamanaşımı süresi uygulanır.",
    effectiveFrom: "2003-04-15",
    effectiveUntil: null,
    officialGazetteDate: "2003-06-10",
    officialGazetteNumber: "25134",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-007",
    lawNumber: "6100",
    lawName: "Hukuk Muhakemeleri Kanunu",
    articleNumber: "1",
    articleTitle: "Dava hakkının kullanılması",
    articleText:
      "ÖZET: Herkes, hukuki menfaatlerinin ihlal edildiğini iddia ederek dava açma hakkına sahiptir. Dava hakkı, kanunda öngörülen koşullara tabidir.",
    effectiveFrom: "2011-10-01",
    effectiveUntil: null,
    officialGazetteDate: "2011-07-12",
    officialGazetteNumber: "27990",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-008",
    lawNumber: "6100",
    lawName: "Hukuk Muhakemeleri Kanunu",
    articleNumber: "190",
    articleTitle: "İspat yükü",
    articleText:
      "ÖZET: İddiasını dayandıran taraf, olayı ispata mecburdur. Kanunda aksi hüküm yoksa, hukuki sonuçların iddia ve ispatı da bu tarafa aittir. Herkes, kendi lehine olan sonuçlar için delil göstermekle yükümlüdür.",
    effectiveFrom: "2011-10-01",
    effectiveUntil: null,
    officialGazetteDate: "2011-07-12",
    officialGazetteNumber: "27990",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-009",
    lawNumber: "6100",
    lawName: "Hukuk Muhakemeleri Kanunu",
    articleNumber: "192",
    articleTitle: "Yazılı deliller",
    articleText:
      "ÖZET: Yazılı deliller, resmi veya özel yazılı belgelerdir. Resmi belgeler, kamu görevlileri tarafından görevleri çerçevesinde düzenlenen belgelerdir. Elektronik ortamda oluşturulan belgeler de yazılı delil olarak kabul edilir.",
    effectiveFrom: "2011-10-01",
    effectiveUntil: null,
    officialGazetteDate: "2011-07-12",
    officialGazetteNumber: "27990",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
  {
    id: "leg-010",
    lawNumber: "6100",
    lawName: "Hukuk Muhakemeleri Kanunu",
    articleNumber: "293",
    articleTitle: "Bilirkişi raporu",
    articleText:
      "ÖZET: Bilirkişi, mahkemenin tayin ettiği konuda rapor düzenler. Taraflar, rapora yazılı olarak itiraz edebilir. Mahkeme, gerekçesini göstermek suretiyle bilirkişi raporunu kabul veya reddedebilir.",
    effectiveFrom: "2011-10-01",
    effectiveUntil: null,
    officialGazetteDate: "2011-07-12",
    officialGazetteNumber: "27990",
    sourceName: "Resmî Gazete",
    sourceUrl: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm",
    retrievedAt: "2026-08-28",
    verificationStatus: "DOĞRULANDI",
  },
];
