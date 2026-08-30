/**
 * Verified public legal sources for the demo (Emsal Kararlar + Mevzuat).
 *
 * INTEGRITY RULES — do not regress:
 *  - Verification status strings are explicit (DOĞRULANDI / DOĞRULANAMADI / ÖZET)
 *    and must never be silently upgraded.
 *  - E/K numbers, court, date, article text and official links are preserved
 *    verbatim — never invented or "filled in".
 *  - This dataset is reference material, not user data; it lives outside the
 *    localStorage workspace and is referenced by id from research bookmarks.
 *
 * Moved verbatim out of `pages/hukuk-pages.tsx` to shrink that file and make the
 * data available to global search.
 */

export interface VerifiedPrecedent {
  id: string;
  court: string;
  chamber: string;
  caseNumber: string;
  decisionNumber: string;
  decisionDate: string;
  legalTopic: string;
  summary: string;
  position: 'LEHE' | 'ALEYHE' | 'KARMA';
  verificationStatus: string;
  sourceUrl: string;
}

export interface VerifiedLegislation {
  id: string;
  lawNumber: string;
  lawName: string;
  articleNumber: string;
  articleTitle: string;
  articleText: string;
  verificationStatus: string;
  sourceName: string;
  sourceUrl: string;
}

export const verifiedPrecedents: VerifiedPrecedent[] = [
  {
    id: 'prec-v001',
    court: 'Yargıtay',
    chamber: '9. Hukuk Dairesi',
    caseNumber: '2023/7974',
    decisionNumber: '2023/11786',
    decisionDate: '12.09.2023',
    legalTopic: 'Fazla çalışma ücreti — Sembolik tahakkuklar ve mahsup',
    summary:
      'İşverence işçilere fazla çalışma ücreti talep etmesine engel olacak biçimde sembolik ve gerçeği yansıtmayan fazla çalışma tahakkukları yapılan aylar, fazla çalışma hesabından tümden dışlanmaz; ancak bu aylarda yapılan gerçek ödemeler, tespit edilen fazla çalışma ücreti alacağından mahsup edilir.',
    position: 'LEHE',
    verificationStatus: 'DOĞRULANDI',
    sourceUrl: 'https://www.alomaliye.com/2026/08/25/ucret-hesap-pusulasi-rehberi-2026/',
  },
  {
    id: 'prec-v002',
    court: 'Yargıtay',
    chamber: '9. Hukuk Dairesi',
    caseNumber: '2022/5402',
    decisionNumber: 'DOĞRULANDI',
    decisionDate: '2022',
    legalTopic: 'İhtirazi kayıtlı imzalı bordro — Fazla çalışmanın her türlü delille ispatı',
    summary:
      'İşçinin fazla çalışma alacağının bordrodan fazla olduğu yönündeki ihtirazi kaydının bulunması halinde, bordroda görünenden daha fazla çalışmanın ispatı her türlü delille yapılabilir.',
    position: 'LEHE',
    verificationStatus: 'DOĞRULANDI',
    sourceUrl: 'https://kazanci.com.tr/gunluk/9hd-2022-5402.htm',
  },
  {
    id: 'prec-v003',
    court: 'Yargıtay',
    chamber: '9. Hukuk Dairesi',
    caseNumber: '2024/7636',
    decisionNumber: '2024/12837',
    decisionDate: '01.10.2024',
    legalTopic: 'Fazla çalışma ispatı — Tanık değerlendirmesi ve işyeri kayıtları',
    summary:
      'Fazla çalışma yaptığını iddia eden işçi bu iddiasını ispatla yükümlüdür. İşyeri kayıtları delil niteliğindedir. Yazılı belgelerle ispatlanamaması durumunda tanık beyanları ile sonuca gidilir.',
    position: 'LEHE',
    verificationStatus: 'DOĞRULANDI',
    sourceUrl: 'https://yargi.calismatoplum.org/fazla-calismanin-ispat-esaslari/',
  },
  {
    id: 'prec-v004',
    court: 'Yargıtay',
    chamber: '9. Hukuk Dairesi',
    caseNumber: '2021/3803',
    decisionNumber: '2021/8265',
    decisionDate: '15.04.2021',
    legalTopic: 'Yıllık izin — İspat yükü işverende, imzalı izin defteri şartı',
    summary:
      'Yıllık izinlerin kullandırıldığı noktasında ispat yükü işverene aittir. İşveren yıllık izinlerin kullandırıldığını imzalı izin defteri veya eşdeğer bir belge ile kanıtlamalıdır.',
    position: 'ALEYHE',
    verificationStatus: 'DOĞRULANDI',
    sourceUrl: 'https://kazanci.com.tr/gunluk/9hd-2021-3803.htm',
  },
  {
    id: 'prec-v005',
    court: 'Yargıtay',
    chamber: 'Hukuk Genel Kurulu',
    caseNumber: '2017/2231',
    decisionNumber: '2017/1547',
    decisionDate: '06.12.2017',
    legalTopic: 'Haklı nedenle fesih — Ücretin ödenmemesi',
    summary:
      'İşveren tarafından işçinin ücreti kanun hükümleri veya sözleşme şartlarına uygun olarak hesap edilmez veya ödenmezse işçi iş sözleşmesini haklı nedenle derhal feshedebilir.',
    position: 'LEHE',
    verificationStatus: 'DOĞRULANDI',
    sourceUrl: 'https://www.lexpera.com.tr/ictihat/yargitay/hukuk-genel-kurulu-e-2017-2231-k-2017-1547-t-6-12-2017',
  },
  {
    id: 'prec-v006',
    court: 'Yargıtay',
    chamber: '9. Hukuk Dairesi',
    caseNumber: '2012/2988',
    decisionNumber: '2014/8868',
    decisionDate: '18.03.2014',
    legalTopic: 'Zamanaşımı — Islah yoluyla zamanaşımı defi',
    summary:
      'Zamanaşımı borcu sona erdirmeyip sadece istenebilirliğini ortadan kaldırır. Cevap dilekçesinde ileri sürülmeyen zamanaşımı defi, ıslah yoluyla ileri sürülebilir.',
    position: 'ALEYHE',
    verificationStatus: 'DOĞRULANDI',
    sourceUrl: 'https://karararama.yargitay.gov.tr/getDokuman?id=100019800',
  },
  {
    id: 'prec-v007',
    court: 'Yargıtay',
    chamber: 'Hukuk Genel Kurulu',
    caseNumber: '2026/10-129',
    decisionNumber: '2026/299',
    decisionDate: '06.05.2026',
    legalTopic: 'Bilirkişi raporu — İtiraz edilmemesi usuli kazanılmış hak doğurmaz',
    summary:
      'Bir tarafın bilirkişi raporuna iki haftalık süre içinde itiraz etmemesi, tek başına o raporun hâkimi bağlayacağı anlamına gelmez. Hâkim raporu diğer delillerle birlikte serbestçe değerlendirir.',
    position: 'KARMA',
    verificationStatus: 'DOĞRULANDI',
    sourceUrl:
      'https://sanalhukuk.org/2026/07/09/bilirkisi-raporuna-itiraz-edilmemesi-usuli-kazanilmis-hak-dogurur-mu-yargitay-hgknin-2026-tarihli-karari/',
  },
];

export const verifiedLegislation: VerifiedLegislation[] = [
  {
    id: 'leg-001',
    lawNumber: '4857',
    lawName: 'İş Kanunu',
    articleNumber: '41',
    articleTitle: 'Fazla çalışma ücreti',
    articleText:
      'ÖZET: Ülkenin genel yararları yahut işin niteliği veya üretimin artırılması gibi nedenlerle fazla çalışma yapılabilir. Fazla çalışma, haftalık kırk beş saati aşan çalışmalardır. Her bir saat fazla çalışma için verilecek ücret normal çalışma ücretinin saat başına düşen miktarının yüzde elli yükseltilmesi suretiyle ödenir.',
    verificationStatus: 'DOĞRULANDI',
    sourceName: 'Resmî Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm',
  },
  {
    id: 'leg-002',
    lawNumber: '4857',
    lawName: 'İş Kanunu',
    articleNumber: '53',
    articleTitle: 'Yıllık ücretli izin',
    articleText:
      'ÖZET: İşe başladığı tarihten itibaren bir yıl çalışma süresini tamamlayan işçilere, on dört günden az olmamak üzere yıllık ücretli izin verilir. Bir yıldan beş yıla kadar çalışmış olanlara on dört gün, beş yıldan on beş yıla kadar çalışmış olanlara yirmi gün izin verilir.',
    verificationStatus: 'DOĞRULANDI',
    sourceName: 'Resmî Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm',
  },
  {
    id: 'leg-003',
    lawNumber: '4857',
    lawName: 'İş Kanunu',
    articleNumber: '34',
    articleTitle: 'Haftalık çalışma süresi',
    articleText: 'ÖZET: Haftalık çalışma süresi en çok kırk beş saattir.',
    verificationStatus: 'DOĞRULANDI',
    sourceName: 'Resmî Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm',
  },
  {
    id: 'leg-004',
    lawNumber: '4857',
    lawName: 'İş Kanunu',
    articleNumber: '25',
    articleTitle: 'Ahlak ve iyi niyet kurallarına uymayan haller',
    articleText:
      'ÖZET: İşverenin iş sözleşmesini feshedebileceği durumlar: a) İşçinin tutukluluğu veya gözaltına alınması, b) İşçinin hastalığı, c) Zorlayıcı sebepler.',
    verificationStatus: 'DOĞRULANDI',
    sourceName: 'Resmî Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm',
  },
  {
    id: 'leg-005',
    lawNumber: '6100',
    lawName: 'Hukuk Muhakemeleri Kanunu',
    articleNumber: '190',
    articleTitle: 'İspat yükü',
    articleText:
      'ÖZET: İddiasını dayandıran taraf, olayı ispata mecburdur. Kanunda aksi hüküm yoksa, hukuki sonuçların iddia ve ispatı da bu tarafa aittir.',
    verificationStatus: 'DOĞRULANDI',
    sourceName: 'Resmî Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm',
  },
  {
    id: 'leg-006',
    lawNumber: '6100',
    lawName: 'Hukuk Muhakemeleri Kanunu',
    articleNumber: '293',
    articleTitle: 'Bilirkişi raporu',
    articleText:
      'ÖZET: Bilirkişi, mahkemenin tayin ettiği konuda rapor düzenler. Taraflar, rapora yazılı olarak itiraz edebilir.',
    verificationStatus: 'DOĞRULANDI',
    sourceName: 'Resmî Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6100.htm',
  },
];
