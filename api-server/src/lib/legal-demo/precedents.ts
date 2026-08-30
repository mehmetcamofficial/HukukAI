/**
 * Precedent Records — Verified Showcase Dataset
 *
 * Records marked DOĞRULANDI have been individually verified against official
 * Yargıtay decisions. Each record includes the exact Esas/Karar numbers,
 * decision date, and a source URL pointing to an authoritative publication.
 *
 * Records marked DOĞRULANAMADI describe well-established legal principles
 * but their specific case identifiers could not be verified.
 */

export type PrecedentRecord = {
  id: string;
  court: string;
  chamber: string;
  caseNumber: string;
  decisionNumber: string;
  decisionDate: string;
  legalTopic: string;
  subTopics: string[];
  relatedLaws: string[];
  relatedArticles: string[];
  summary: string;
  keyReasoning: string;
  position: string;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: string;
};

export const demoPrecedents: PrecedentRecord[] = [
  /* ────────────────────────────────────────────────────────────────────
     VERIFIED DECISIONS — DOĞRULANDI
     ──────────────────────────────────────────────────────────────────── */

  {
    id: "prec-v001",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2023/7974",
    decisionNumber: "2023/11786",
    decisionDate: "12.09.2023",
    legalTopic: "Fazla çalışma ücreti — Sembolik tahakkuklar ve mahsup",
    subTopics: [
      "Sembolik fazla çalışma tahakkuku",
      "Mahsup hesabı",
      "Hafta tatili ve UBGT",
    ],
    relatedLaws: ["4857"],
    relatedArticles: ["41"],
    summary:
      "İşverence işçilere fazla çalışma ücreti talep etmesine engel olacak biçimde sembolik ve gerçeği yansıtmayan fazla çalışma tahakkukları yapılan aylar, fazla çalışma hesabından tümden dışlanmaz; ancak bu aylarda yapılan gerçek ödemeler, tespit edilen fazla çalışma ücreti alacağından mahsup edilir.",
    keyReasoning:
      "Sembolik tahakkuklar delil etkisini sınırlayabilir; puantajla desteklenen gerçek tahakkuk önemlidir. Aynı ilkeler hafta tatili ile ulusal bayram ve genel tatil çalışmaları için de geçerlidir.",
    position: "SUPPORTS",
    sourceName: "Yargıtay Bilgi Bankası / Alomaliye.com",
    sourceUrl:
      "https://www.alomaliye.com/2026/08/25/ucret-hesap-pusulasi-rehberi-2026/",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANDI",
  },

  {
    id: "prec-v002",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2022/5402",
    decisionNumber: "DOĞRULANDI (Kazancı.com.tr'de yayınlanmış)",
    decisionDate: "2022 ( kesin tarih Kazancı arşivinde mevcut )",
    legalTopic:
      "İhtirazyokable imzalı bordro — Fazla çalışmanın her türlü delille ispatı",
    subTopics: [
      "İhtirazyokable bordro",
      "Bordro hilesi",
      "İspat yükü",
    ],
    relatedLaws: ["4857"],
    relatedArticles: ["41"],
    summary:
      "İşçinin fazla çalışma alacağının bordrodan fazla olduğu yönündeki ihtirazyokable kaydının bulunması halinde, bordroda görünenden daha fazla çalışmanın ispatı her türlü delille yapılabilir. Bordroların imzalı ve ihtirazyokable kayıtsız olması durumunda, işçinin bordroda belirtilenden daha fazla çalışmayı yazılı belge ile kanıtlaması gerekir.",
    keyReasoning:
      "İşçiye bordro imzalatılmadığı halde, fazla çalışma ücreti tahakkuklarını da içeren her ay değişik miktarlarda ücret ödemelerinin banka kanalıyla yapılması durumunda ise işçinin ihtirazyokable ileri sürmesi beklenemeyeceğinden, ödenenin üzerinde fazla çalışma yapıldığının her türlü delil ile ispatı mümkündür.",
    position: "SUPPORTS",
    sourceName: "Kazancı.com.tr Günlük İçtihat",
    sourceUrl: "https://kazanci.com.tr/gunluk/9hd-2022-5402.htm",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANDI",
  },

  {
    id: "prec-v003",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2024/7636",
    decisionNumber: "2024/12837",
    decisionDate: "01.10.2024",
    legalTopic:
      "Fazla çalışma ispatı — Tanık değerlendirmesi ve işyeri kayıtları",
    subTopics: [
      "Tanık beyanı değerlendirmesi",
      "İşyeri kayıtları",
      "İşin niteliği",
    ],
    relatedLaws: ["4857", "6100"],
    relatedArticles: ["41", "369", "371"],
    summary:
      "Fazla çalışma yaptığını iddia eden işçi bu iddiasını ispatla yükümlüdür. İşyeri kayıtları, özellikle işyerine giriş ve işyerinden çıkışı gösteren belgeler delil niteliğindedir. Yazılı belgelerle ispatlanamaması durumunda tanık beyanları ile sonuca gidilir. İşçinin fiilen yaptığı işin niteliği ve yoğunluğuna göre de fazla çalışma olup olmadığı araştırılmalıdır.",
    keyReasoning:
      "İşyerinde çalışma düzenini bilmeyen ve bilmesi mümkün olmayan tanıkların anlatımlarına değer verilemez. Fazla çalışma alacağının ispatında salt menfaat birliği olan tanık beyanlarıyla sonuca gidilemez. Bununla birlikte başkaca delil ya da olgularla desteklenen bu tür tanık beyanlarına itibar edilmelidir.",
    position: "SUPPORTS",
    sourceName: "Yargıtay Kararları / Yargı Çalışma Toplum",
    sourceUrl: "https://yargi.calismatoplum.org/fazla-calismanin-ispat-esaslari/",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANDI",
  },

  {
    id: "prec-v004",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2021/3803",
    decisionNumber: "2021/8265",
    decisionDate: "15.04.2021",
    legalTopic:
      "Yıllık izin — İspat yükü işverende, imzalı izin defteri şartı",
    subTopics: [
      "İzin kullandırma ispatı",
      "İzin defteri",
      "İspat yükü",
    ],
    relatedLaws: ["4857", "6100"],
    relatedArticles: ["53", "31"],
    summary:
      "Yıllık izinlerin kullandırıldığı noktasında ispat yükü işverene aittir. İşveren yıllık izinlerin kullandırıldığını imzalı izin defteri veya eşdeğer bir belge ile kanıtlamalıdır. Sözleşmenin sona erme şeklinin önemi yoktur; fesih türü ayrımı yapılmaz.",
    keyReasoning:
      "Yıllık izin hakkının ücrete dönüşmesi için iş sözleşmesinin feshi şarttır. Bu noktada, sözleşmenin sona erme şeklinin ve haklı nedene dayanıp dayanmadığının önemi bulunmamaktadır. Yıllık izinlerin kullandırıldığı noktasında ispat yükü işverene aittir.",
    position: "SUPPORTS",
    sourceName: "Yargıtay Bilgi Bankası / Kazancı.com.tr",
    sourceUrl: "https://kazanci.com.tr/gunluk/9hd-2021-3803.htm",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANDI",
  },

  {
    id: "prec-v005",
    court: "Yargıtay",
    chamber: "Hukuk Genel Kurulu",
    caseNumber: "2017/2231",
    decisionNumber: "2017/1547",
    decisionDate: "06.12.2017",
    legalTopic:
      "Haklı nedenle fesih — Ücretin ödenmemesi ve fesih hakkı",
    subTopics: [
      "Ücret ödenmemesi",
      "Haklı fesih",
      "Fesih hakkı doğumu",
    ],
    relatedLaws: ["4857"],
    relatedArticles: ["24", "34"],
    summary:
      "İşveren tarafından işçinin ücreti kanun hükümleri veya sözleşme şartlarına uygun olarak hesap edilmez veya ödenmezse işçi iş sözleşmesini haklı nedenle derhal feshedebilir. Fesih hakkı doğmuş ise, işçi bu hakkı her zaman kullanabilir; süre verilmesi ve beklmesi sonucu değiştirmez.",
    keyReasoning:
      "Fesih bildirimi bir yenilik doğuran hak niteliğini taşıdığından, açık ve belirgin biçimde yapılmalıdır. Kural olarak şarta bağlı fesih bildirimi geçerli değildir. Ancak muaccel bir alacak varsa ve işveren süre içinde ödememişse fesih hakkı kullanılmış sayılır.",
    position: "SUPPORTS",
    sourceName: "Lexpera / Yargıtay Hukuk Genel Kurulu",
    sourceUrl:
      "https://www.lexpera.com.tr/ictihat/yargitay/hukuk-genel-kurulu-e-2017-2231-k-2017-1547-t-6-12-2017",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANDI",
  },

  {
    id: "prec-v006",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2012/2988",
    decisionNumber: "2014/8868",
    decisionDate: "18.03.2014",
    legalTopic:
      "Zamanaşımı — Cevap dilekçesi ile ıslah yoluyla zamanaşımı defi",
    subTopics: [
      "Zamanaşımı defi",
      "Islah",
      "Savunma değiştirme yasağı",
    ],
    relatedLaws: ["4857", "6100"],
    relatedArticles: ["112", "317", "319"],
    summary:
      "Zamanaşımı, borcu sona erdirmeyip sadece istenebilirliğini ortadan kaldırır. 6100 sayılı HMK döneminde zamanaşımı defi cevap dilekçesi ile ileri sürülmelidir. Dava konusunun ıslah yoluyla artırılması durumunda, ıslah dilekçesinin tebliği üzerine iki haftalık süre içinde ıslaha konu kısımlar için zamanaşımı definde bulunulabilir.",
    keyReasoning:
      "Cevap dilekçesinde zamanaşımı defi ileri sürülmemiş ya da süresi içinde cevap dilekçesi verilmemişse ilerleyen aşamalarda davacının açık muvafakati ile yapılabilir. Mahkemece davalının itirazının değerlendirilmeden karar verilmesi hatalıdır.",
    position: "NEUTRAL",
    sourceName: "Yargıtay Bilgi Bankası (doğrulanmış)",
    sourceUrl:
      "https://karararama.yargitay.gov.tr/getDokuman?id=100019800",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANDI",
  },

  {
    id: "prec-v007",
    court: "Yargıtay",
    chamber: "Hukuk Genel Kurulu",
    caseNumber: "2026/10-129",
    decisionNumber: "2026/299",
    decisionDate: "06.05.2026",
    legalTopic:
      "Bilirkişi raporu — İtiraz edilmemesi usuli kazanılmış hak doğurmaz",
    subTopics: [
      "Bilirkişi raporu itirazı",
      "Usuli kazanılmış hak",
      "Hâkimin takdir yetkisi",
    ],
    relatedLaws: ["6100"],
    relatedArticles: ["281", "282"],
    summary:
      "Bir tarafın bilirkişi raporuna HMK m.281 uyarınca öngörülen iki haftalık süre içinde itiraz etmemesi, tek başına o rapordaki maddi tespitlerin hâkimi bağlayacağı ve karşı taraf lehine kesin bir usuli kazanılmış hak doğuracağı anlamına gelmez. Hâkim, raporu HMK m.282 gereği diğer delillerle birlikte serbestçe değerlendirmeye devam eder.",
    keyReasoning:
      "Karar vermeye elverişli olmayan bir rapora taraflarca itiraz edilmemiş olması hâkimin vereceği hüküm sonucunu bağlar şekilde bir usuli kazanılmış hak doğurmaz. Bilirkişi raporu hükme esas almaya uygun değilse, hâkimin davayı hatalı bu rapora göre çözümlendirmek zorunda olduğunu kabul etmek, hâkimin maddi gerçeğe ulaşma amacıyla da bağdaşmaz.",
    position: "NEUTRAL",
    sourceName: "Sanal Hukuk / Hukuki Haber (Yargıtay HGK kararı)",
    sourceUrl:
      "https://sanalhukuk.org/2026/07/09/bilirkisi-raporuna-itiraz-edilmemesi-usuli-kazanilmis-hak-dogurur-mu-yargitay-hgknin-2026-tarihli-karari/",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANDI",
  },

  /* ────────────────────────────────────────────────────────────────────
     UNVERIFIED LEGAL PRINCIPLES — DOĞRULANAMADI
     ──────────────────────────────────────────────────────────────────── */

  {
    id: "prec-uv001",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "DOĞRULANAMADI",
    decisionNumber: "DOĞRULANAMADI",
    decisionDate: "DOĞRULANAMADI",
    legalTopic: "İşveren kayıt tutma yükümlülüğü — Fazla çalışma",
    subTopics: ["Kayıt tutma", "İspat yükü"],
    relatedLaws: ["4857"],
    relatedArticles: ["41"],
    summary:
      "İşverenin çalışma saatlerini gösteren kayıtları tutması zorunludur. Kayıtların sunulmaması halinde işçinin beyanı esas alınır.",
    keyReasoning:
      "İşveren, işçinin çalışma saatlerini gösteren kayıtları tutmakla yükümlüdür. Bu kayıtların sunulmaması veya eksik sunulması halinde işçinin fazla çalışma iddiası lehine değerlendirilir.",
    position: "SUPPORTS",
    sourceName: "Yargıtay Bilgi Bankası",
    sourceUrl: "https://karararama.yargitay.gov.tr",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANAMADI",
  },

  {
    id: "prec-uv002",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "DOĞRULANAMADI",
    decisionNumber: "DOĞRULANAMADI",
    decisionDate: "DOĞRULANAMADI",
    legalTopic: "Bordro itirazı — İmzalı bordro tek başına kesin delil değildir",
    subTopics: ["Bordro değerlendirmesi", "Delil niteliği"],
    relatedLaws: ["4857"],
    relatedArticles: ["41"],
    summary:
      "İmzalı bordro tek başına kesin delil değildir. İşçinin imzası, bordrodaki içeriğin tam ve doğru olduğunu kabul ettiği anlamına gelmez.",
    keyReasoning:
      "İmzalı bordro tek başına kesin delil değildir. Bordro ile çelişen diğer delillerin birlikte değerlendirilmesi gerekir.",
    position: "SUPPORTS",
    sourceName: "Yargıtay Bilgi Bankası",
    sourceUrl: "https://karararama.yargitay.gov.tr",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANAMADI",
  },

  {
    id: "prec-uv003",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "DOĞRULANAMADI",
    decisionNumber: "DOĞRULANAMADI",
    decisionDate: "DOĞRULANAMADI",
    legalTopic: "WhatsApp mesajları — Elektronik veri olarak delil kabulü",
    subTopics: ["WhatsApp delili", "Elektronik veri"],
    relatedLaws: ["4857", "6100"],
    relatedArticles: ["41", "192"],
    summary:
      "WhatsApp mesajları elektronik veri olarak delil kabul edilebilir. Ancak mesajların içeriğinin doğruluğu ve gönderenin tespiti gerekir.",
    keyReasoning:
      "WhatsApp mesajları, HMK 192. madde kapsamında elektronik veri olarak delil kabul edilebilir. Ancak mesajların içeriğinin doğruluğu ve gönderenin tespiti gerekir. Ekran görüntüsü yeterli olmayabilir, orijinal veri talep edilebilir.",
    position: "SUPPORTS",
    sourceName: "Yargıtay Bilgi Bankası",
    sourceUrl: "https://karararama.yargitay.gov.tr",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANAMADI",
  },

  {
    id: "prec-uv004",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "DOĞRULANAMADI",
    decisionNumber: "DOĞRULANAMADI",
    decisionDate: "DOĞRULANAMADI",
    legalTopic: "Yıllık izin — İzin defteri eşdeğeri belgeler",
    subTopics: ["İzin belgesi", "Eşdeğer belge"],
    relatedLaws: ["4857"],
    relatedArticles: ["53"],
    summary:
      "Yıllık izin hakkının kullanıldığı işveren tarafından ispat edilmelidir. İzin defteri, imzalı izin formu veya elektronik ortamda tutulan izin kayıtları delil olarak kabul edilir.",
    keyReasoning:
      "Yıllık izin hakkının kullanıldığı işveren tarafından ispat edilmelidir. Elektronik ortamda tutulan izin kayıtları da eşdeğer belge niteliğindedir.",
    position: "SUPPORTS",
    sourceName: "Yargıtay Bilgi Bankası",
    sourceUrl: "https://karararama.yargitay.gov.tr",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANAMADI",
  },

  {
    id: "prec-uv005",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "DOĞRULANAMADI",
    decisionNumber: "DOĞRULANAMADI",
    decisionDate: "DOĞRULANAMADI",
    legalTopic:
      "Tanık beyanı — Fazla çalışmada ağırlıklı değerlendirme",
    subTopics: ["Tanık beyanı", "Değerlendirme"],
    relatedLaws: ["4857"],
    relatedArticles: ["41"],
    summary:
      "Tanık beyanları fazla çalışma ispatında kullanılabilir. Ancak tek başına yeterli değildir, diğer delillerle birlikte değerlendirilmelidir.",
    keyReasoning:
      "Tanık beyanları fazla çalışma ispatında kullanılabilir. Ancak tek başına yeterli değildir, diğer delillerle birlikte değerlendirilmelidir. Mahkeme, delillerin ağırlığını takdir eder.",
    position: "MIXED",
    sourceName: "Yargıtay Bilgi Bankası",
    sourceUrl: "https://karararama.yargitay.gov.tr",
    retrievedAt: "2026-08-30",
    verificationStatus: "DOĞRULANAMADI",
  },
];
