/**
 * HukukAI — seeded demo dataset (Demo Dataset v1).
 *
 * Deterministic. `createSeedState()` returns a fresh, independent copy every
 * call so callers can freely mutate the result. All content is fictional
 * ("KURGUSAL DAVA VERİSİ"); verified public legal sources live in the static
 * `legal-sources` module and are referenced by id from research bookmarks.
 *
 * Ownership distinction (do not regress):
 *   - Mehmet Cam  = Ürün Sahibi & Geliştirici (not modelled here)
 *   - Av. Behçet Alp = Hukuki Danışman & seeded "Dosya Sorumlusu"
 */

import type { WorkspaceState } from './types.ts';

export const WORKSPACE_VERSION = 1;
export const SEEDED_AT = '2026-08-30T08:00:00.000Z';

export const PRIMARY_LAWYER = 'Av. Behçet Alp';
export const PRIMARY_CASE_ID = 'case-2026-145';

const ts = (date: string) => `${date}T08:00:00.000Z`;

export function createSeedState(): WorkspaceState {
  return structuredCloneSafe<WorkspaceState>({
    meta: { version: WORKSPACE_VERSION, seededAt: SEEDED_AT },

    clients: [
      { id: 'client-001', name: 'Deniz Aras', type: 'individual', createdAt: ts('2026-01-05'), updatedAt: ts('2026-01-05'), seeded: true },
      { id: 'client-002', name: 'Ece Korkmaz', type: 'individual', createdAt: ts('2024-03-01'), updatedAt: ts('2024-03-01'), seeded: true },
      { id: 'client-003', name: 'Kuzey Yapı A.Ş.', type: 'corporate', createdAt: ts('2025-02-10'), updatedAt: ts('2025-02-10'), seeded: true },
    ],

    cases: [
      {
        id: PRIMARY_CASE_ID,
        title: 'İşçilik Alacağı',
        caseType: 'is',
        caseNumber: '2026/145',
        court: 'Kurgu 14. İş Mahkemesi',
        clientId: 'client-001',
        clientName: 'Deniz Aras',
        opposingParty: 'Marmara Lojistik A.Ş.',
        responsible: PRIMARY_LAWYER,
        openedAt: ts('2026-02-25'),
        nextHearing: '2026-09-14',
        nextDeadline: '2026-09-02',
        summary: 'Fazla çalışma ve yıllık ücretli izin ile ücret alacağının tahsili.',
        note: '',
        status: 'active',
        outcome: null,
        categoryLabel: 'İş Hukuku',
        createdAt: ts('2026-02-25'),
        updatedAt: ts('2026-08-27'),
        seeded: true,
      },
      {
        id: 'case-2024-381',
        title: 'Fazla Mesai Alacağı',
        caseType: 'is',
        caseNumber: '2024/381',
        court: 'Kurgu 8. İş Mahkemesi',
        clientId: 'client-002',
        clientName: 'Ece Korkmaz',
        opposingParty: 'Anadolu Tekstil Ltd. Şti.',
        responsible: PRIMARY_LAWYER,
        openedAt: ts('2024-03-10'),
        nextHearing: null,
        nextDeadline: null,
        summary: 'Fazla mesai alacağının tahsili — bilirkişi incelemesi sonrası karar.',
        status: 'closed',
        outcome: 'kismen-kabul',
        categoryLabel: 'İş Hukuku',
        createdAt: ts('2024-03-10'),
        updatedAt: ts('2024-11-20'),
        seeded: true,
      },
      {
        id: 'case-2025-077',
        title: 'Yıllık İzin ve Ücret Alacağı',
        caseType: 'is',
        caseNumber: '2025/077',
        court: 'Kurgu 5. İş Mahkemesi',
        clientId: 'client-003',
        clientName: 'Kuzey Yapı A.Ş.',
        opposingParty: 'Mehmet Yıldız',
        responsible: PRIMARY_LAWYER,
        openedAt: ts('2025-02-10'),
        nextHearing: null,
        nextDeadline: null,
        summary: 'Yıllık izin ve ücret alacağı — izin defteri kayıtları esas alındı.',
        status: 'closed',
        outcome: 'kabul',
        categoryLabel: 'İş Hukuku',
        createdAt: ts('2025-02-10'),
        updatedAt: ts('2025-09-15'),
        seeded: true,
      },
    ],

    tasks: [
      {
        id: 'task-001',
        caseId: PRIMARY_CASE_ID,
        title: 'Bilirkişi raporuna itiraz dilekçesini tamamla',
        description: 'WhatsApp dökümü ve puantaj verilerini itiraz gerekçesi olarak işle.',
        assignedTo: PRIMARY_LAWYER,
        dueDate: '2026-09-02',
        priority: 'critical',
        status: 'in-progress',
        createdAt: ts('2026-08-25'),
        completedAt: null,
        seeded: true,
      },
      {
        id: 'task-002',
        caseId: PRIMARY_CASE_ID,
        title: 'Kartlı geçiş kayıtlarını işyerinden talep et',
        description: 'Fazla çalışma iddiası için eksik delil.',
        assignedTo: PRIMARY_LAWYER,
        dueDate: '2026-09-05',
        priority: 'high',
        status: 'open',
        createdAt: ts('2026-08-26'),
        completedAt: null,
        origin: 'missing-evidence',
        seeded: true,
      },
      {
        id: 'task-003',
        caseId: PRIMARY_CASE_ID,
        title: 'Duruşma hazırlık notlarını güncelle',
        assignedTo: PRIMARY_LAWYER,
        dueDate: '2026-09-12',
        priority: 'normal',
        status: 'open',
        createdAt: ts('2026-08-27'),
        completedAt: null,
        seeded: true,
      },
      {
        id: 'task-004',
        caseId: PRIMARY_CASE_ID,
        title: 'İtiraz dilekçesi taslağını hazırla',
        assignedTo: PRIMARY_LAWYER,
        dueDate: '2026-08-28',
        priority: 'high',
        status: 'done',
        createdAt: ts('2026-08-20'),
        completedAt: ts('2026-08-28'),
        seeded: true,
      },
    ],

    notes: [
      {
        id: 'note-001',
        caseId: PRIMARY_CASE_ID,
        title: 'Bilirkişi raporu ilk değerlendirme',
        body: 'Rapor fazla çalışma iddiasını yetersiz buluyor. WhatsApp talimatları ve puantaj çıkış saatleri rapora yansıtılmamış. İtiraz dilekçesinde bu iki nokta öne çıkarılmalı.',
        author: PRIMARY_LAWYER,
        pinned: true,
        createdAt: ts('2026-08-21'),
        updatedAt: ts('2026-08-21'),
        seeded: true,
      },
      {
        id: 'note-002',
        caseId: PRIMARY_CASE_ID,
        title: 'Fesih tarihi çelişkisi',
        body: 'Müvekkil 20.01, davalı 18.01 diyor. Tebligat kayıtları ve SGK çıkış bildirimi ile netleştirilecek.',
        author: PRIMARY_LAWYER,
        pinned: false,
        createdAt: ts('2026-08-24'),
        updatedAt: ts('2026-08-24'),
        seeded: true,
      },
    ],

    documents: [
      { id: 'doc-010', caseId: PRIMARY_CASE_ID, name: 'Bilirkişi Raporu (2026/145)', docType: 'bilirkisi-raporu', fileName: 'Bilirkisi_Raporu_2026_145.pdf', fileMime: 'application/pdf', documentDate: '2026-06-20', source: 'Mahkeme', verificationStatus: 'DEMO — KURGUSAL DAVA VERİSİ', demoExcerpt: 'DEMO — KURGUSAL DAVA VERİSİ. Bilirkişi raporu: Fazla çalışma iddiası için yeterli delil bulunamamıştır.', createdAt: ts('2026-06-20'), updatedAt: ts('2026-06-20'), seeded: true },
      { id: 'doc-009', caseId: PRIMARY_CASE_ID, name: 'Duruşma Tutanağı (14.09.2026)', docType: 'mahkeme-evraki', fileName: 'Durusma_Tutanagi_14_09_2026.pdf', fileMime: 'application/pdf', documentDate: '2026-09-14', source: 'Mahkeme', verificationStatus: 'DEMO — KURGUSAL DAVA VERİSİ', demoExcerpt: 'DEMO — KURGUSAL DAVA VERİSİ. 14.09.2026 tarihli duruşma tutanağı.', createdAt: ts('2026-09-14'), updatedAt: ts('2026-09-14'), seeded: true },
      { id: 'doc-008', caseId: PRIMARY_CASE_ID, name: 'İhtarname (12.01.2026)', docType: 'ihtarname', fileName: 'Ihtarname_12_01_2026.pdf', fileMime: 'application/pdf', documentDate: '2026-01-12', source: 'Müvekkil', verificationStatus: 'DOĞRULANDI', demoExcerpt: 'DEMO — KURGUSAL DAVA VERİSİ. Fazla çalışma ve izin ücreti alacağının ödenmesi için ihtarname.', createdAt: ts('2026-01-12'), updatedAt: ts('2026-01-12'), seeded: true },
      { id: 'doc-007', caseId: PRIMARY_CASE_ID, name: 'Yıllık İzin Formu', docType: 'delil', fileName: 'Yillik_Izin_Formu.pdf', fileMime: 'application/pdf', documentDate: '2025-12-15', source: 'Karşı taraf', verificationStatus: 'DEMO — KURGUSAL DAVA VERİSİ', demoExcerpt: 'DEMO — KURGUSAL DAVA VERİSİ. 14 gün izin kullandığına dair form.', createdAt: ts('2025-12-15'), updatedAt: ts('2025-12-15'), seeded: true },
      { id: 'doc-006', caseId: PRIMARY_CASE_ID, name: 'WhatsApp Yazışması Dökümü', docType: 'mesajlasma', fileName: 'WhatsApp_Yazismasi_Dokumu.pdf', fileMime: 'application/pdf', documentDate: '2026-03-10', source: 'Müvekkil', verificationStatus: 'DOĞRULANAMADI', demoExcerpt: 'DEMO — KURGUSAL DAVA VERİSİ. Davacı ile iş yeri yöneticisi arasındaki WhatsApp yazışmaları.', createdAt: ts('2026-03-10'), updatedAt: ts('2026-03-10'), seeded: true },
      { id: 'doc-005', caseId: PRIMARY_CASE_ID, name: 'Puantaj Çizelgesi (2025)', docType: 'puantaj', fileName: 'Puantaj_Cizelgesi_2025.pdf', fileMime: 'application/pdf', documentDate: '2026-01-05', source: 'Müvekkil', verificationStatus: 'DEMO — KURGUSAL DAVA VERİSİ', demoExcerpt: 'DEMO — KURGUSAL DAVA VERİSİ. Aylık puantaj çizelgesi. Bazı aylarda 20:00 sonrası çıkış saatleri.', createdAt: ts('2026-01-05'), updatedAt: ts('2026-01-05'), seeded: true },
      { id: 'doc-004', caseId: PRIMARY_CASE_ID, name: 'Ücret Bordrosu (Ekim 2025)', docType: 'bordro', fileName: 'Ucret_Bordrosu_Oct_2025.pdf', fileMime: 'application/pdf', documentDate: '2025-10-31', source: 'Karşı taraf', verificationStatus: 'DEMO — KURGUSAL DAVA VERİSİ', demoExcerpt: 'DEMO — KURGUSAL DAVA VERİSİ. Aylık ücret bordrosu. Brüt 28.000 TL.', createdAt: ts('2025-10-31'), updatedAt: ts('2025-10-31'), seeded: true },
    ],

    timeline: [
      { id: 'event-001', caseId: PRIMARY_CASE_ID, date: '2025-01-12', title: 'İş sözleşmesi imzalandı', eventType: 'islem', description: 'Deniz Aras ile Marmara Lojistik A.Ş. arasında iş sözleşmesi imzalandı.', sourceStatus: 'DOĞRULANDI', createdAt: ts('2025-01-12'), updatedAt: ts('2025-01-12'), seeded: true },
      { id: 'event-002', caseId: PRIMARY_CASE_ID, date: '2025-08-18', title: 'Mesai sonrası WhatsApp mesajları', eventType: 'belge', description: "İş yeri yöneticisi tarafından 20:00'den sonra gönderilen iş talimatları.", relatedDocumentId: 'doc-006', sourceStatus: 'DOĞRULANAMADI', createdAt: ts('2025-08-18'), updatedAt: ts('2025-08-18'), seeded: true },
      { id: 'event-003', caseId: PRIMARY_CASE_ID, date: '2026-01-12', title: 'İhtarname gönderildi', eventType: 'ihtar', description: 'Fazla çalışma ve izin ücreti alacağının ödenmesi için ihtarname.', relatedDocumentId: 'doc-008', sourceStatus: 'DOĞRULANDI', createdAt: ts('2026-01-12'), updatedAt: ts('2026-01-12'), seeded: true },
      { id: 'event-004', caseId: PRIMARY_CASE_ID, date: '2026-01-18', title: 'İş ilişkisi sona erdi', eventType: 'islem', description: 'Davacının iş sözleşmesi feshedildi.', sourceStatus: 'DOĞRULANAMADI', createdAt: ts('2026-01-18'), updatedAt: ts('2026-01-18'), seeded: true },
      { id: 'event-005', caseId: PRIMARY_CASE_ID, date: '2026-02-05', title: 'Arabuluculuk başvurusu', eventType: 'islem', description: 'Arabuluculuk bürosuna başvuru yapılmıştır.', sourceStatus: 'DOĞRULANDI', createdAt: ts('2026-02-05'), updatedAt: ts('2026-02-05'), seeded: true },
      { id: 'event-006', caseId: PRIMARY_CASE_ID, date: '2026-02-18', title: 'Arabuluculuk tutanağı', eventType: 'islem', description: 'Arabuluculuk görüşmesi sonuçsuz kalmıştır.', sourceStatus: 'DOĞRULANDI', createdAt: ts('2026-02-18'), updatedAt: ts('2026-02-18'), seeded: true },
      { id: 'event-007', caseId: PRIMARY_CASE_ID, date: '2026-02-25', title: 'Dava açıldı', eventType: 'dava-acilisi', description: "Kurgu 14. İş Mahkemesi'ne dava dilekçesi sunulmuştur.", sourceStatus: 'DOĞRULANDI', createdAt: ts('2026-02-25'), updatedAt: ts('2026-02-25'), seeded: true },
      { id: 'event-008', caseId: PRIMARY_CASE_ID, date: '2026-06-20', title: 'Bilirkişi raporu açıklandı', eventType: 'bilirkisi', description: 'Bilirkişi heyeti raporunu mahkemeye sundu.', relatedDocumentId: 'doc-010', sourceStatus: 'DOĞRULANAMADI', createdAt: ts('2026-06-20'), updatedAt: ts('2026-06-20'), seeded: true },
      { id: 'event-009', caseId: PRIMARY_CASE_ID, date: '2026-09-14', title: 'Duruşma yapıldı', eventType: 'durusma', description: 'Taraflar bilirkişi raporuna ilişkin beyanlarını sundu.', relatedDocumentId: 'doc-009', sourceStatus: 'DEMO — KURGUSAL DAVA VERİSİ', createdAt: ts('2026-09-14'), updatedAt: ts('2026-09-14'), seeded: true },
    ],

    evidence: [
      {
        id: 'evidence-001',
        caseId: PRIMARY_CASE_ID,
        title: 'Fazla çalışma ücreti alacağının ödenmemesi',
        legalIssue: '4857 sayılı İş Kanunu m.41 — fazla çalışma ücreti',
        supporting: [
          { id: 'ev-s-001', label: 'WhatsApp yazışmalarında mesai sonrası çalışma talimatları', documentId: 'doc-006' },
          { id: 'ev-s-002', label: 'Puantaj çizelgesinde bazı aylarda 20:00 sonrası çıkış saatleri', documentId: 'doc-005' },
          { id: 'ev-s-003', label: 'Tanık beyanları: mesai sonrası çalışmayı doğrulayan iş arkadaşları', documentId: null },
        ],
        opposing: [
          { id: 'ev-o-001', label: 'Bordrolarda fazla çalışma tahakkuku yok', documentId: 'doc-004' },
          { id: 'ev-o-002', label: 'Davalı beyanı: tüm çalışma mesai içinde tamamlandı', documentId: null },
        ],
        missing: [
          { id: 'ev-m-001', label: 'Kartlı geçiş kayıtları (access logları)', documentId: null },
          { id: 'ev-m-002', label: 'İş yeri güvenlik kamerası kayıtları', documentId: null },
        ],
        lawyerAssessment: 'WhatsApp ve puantaj kısmi destek sağlıyor. Kesin ispat için kartlı geçiş kayıtları gerekli.',
        status: 'inceleniyor',
        createdAt: ts('2026-07-01'),
        updatedAt: ts('2026-08-20'),
        seeded: true,
      },
      {
        id: 'evidence-002',
        caseId: PRIMARY_CASE_ID,
        title: 'Yıllık ücretli iznin kullandırılmamış olması',
        legalIssue: '4857 sayılı İş Kanunu m.53 — yıllık ücretli izin',
        supporting: [
          { id: 'ev-s-101', label: 'Davacı beyanı: izinlerin kullandırılmadığı', documentId: null },
          { id: 'ev-s-102', label: 'Banka hesap özeti: izin ücreti ödemesi görünmüyor', documentId: null },
        ],
        opposing: [
          { id: 'ev-o-101', label: 'Yıllık izin formu: 14 gün izin kullandığı gösterilmiş', documentId: 'doc-007' },
        ],
        missing: [
          { id: 'ev-m-101', label: 'İmza doğrulaması (form davacıya ait mi)', documentId: null },
          { id: 'ev-m-102', label: 'Orijinal izin defteri kayıtları', documentId: null },
        ],
        lawyerAssessment: 'İzin formu mevcut ancak imza itirazlı. İmza incelemesi yapılmadan çelişki sürüyor.',
        status: 'incelenmedi',
        createdAt: ts('2026-07-01'),
        updatedAt: ts('2026-07-01'),
        seeded: true,
      },
    ],

    calendar: [
      { id: 'cal-001', caseId: PRIMARY_CASE_ID, title: 'Bilirkişi raporuna itiraz son günü', eventType: 'son-sure', date: '2026-09-02', time: null, responsible: PRIMARY_LAWYER, createdAt: ts('2026-06-20'), updatedAt: ts('2026-06-20'), seeded: true },
      { id: 'cal-002', caseId: PRIMARY_CASE_ID, title: 'Duruşma — Bilirkişi raporu değerlendirmesi', eventType: 'durusma', date: '2026-09-14', time: '10:00', responsible: PRIMARY_LAWYER, createdAt: ts('2026-06-20'), updatedAt: ts('2026-06-20'), seeded: true },
      { id: 'cal-003', caseId: PRIMARY_CASE_ID, title: 'Duruşma — Son savunma', eventType: 'durusma', date: '2027-01-20', time: '10:00', responsible: PRIMARY_LAWYER, createdAt: ts('2026-06-20'), updatedAt: ts('2026-06-20'), seeded: true },
      { id: 'cal-004', caseId: PRIMARY_CASE_ID, title: 'Bilirkişi raporu inceleme', eventType: 'bilirkisi', date: '2026-09-05', time: null, responsible: PRIMARY_LAWYER, createdAt: ts('2026-06-21'), updatedAt: ts('2026-06-21'), seeded: true },
      { id: 'cal-005', caseId: PRIMARY_CASE_ID, title: 'Müvekkil görüşmesi — Dava stratejisi', eventType: 'muvekkil-gorusmesi', date: '2026-09-08', time: '14:00', responsible: PRIMARY_LAWYER, createdAt: ts('2026-06-21'), updatedAt: ts('2026-06-21'), seeded: true },
      { id: 'cal-009', caseId: PRIMARY_CASE_ID, title: 'Arabuluculuk tutanağı alındı', eventType: 'arabuluculuk', date: '2026-02-18', time: null, responsible: PRIMARY_LAWYER, createdAt: ts('2026-02-18'), updatedAt: ts('2026-02-18'), seeded: true },
    ],

    researchBookmarks: [
      {
        id: 'bookmark-001',
        caseId: PRIMARY_CASE_ID,
        sourceKind: 'precedent',
        sourceId: 'prec-v002',
        title: 'Yargıtay 9. HD — İhtirazi kayıtlı imzalı bordro / fazla çalışmanın her türlü delille ispatı',
        citation: '9. HD 2022/5402',
        relation: 'destekleyen',
        note: 'Bordrolarda tahakkuk olsa da ihtirazi kayıt varsa fazla çalışma tanıkla ispatlanabilir.',
        verificationStatus: 'DOĞRULANDI',
        sourceUrl: 'https://kazanci.com.tr/gunluk/9hd-2022-5402.htm',
        createdAt: ts('2026-07-15'),
        seeded: true,
      },
      {
        id: 'bookmark-002',
        caseId: PRIMARY_CASE_ID,
        sourceKind: 'legislation',
        sourceId: 'leg-001',
        title: '4857 sayılı İş Kanunu — Madde 41 (Fazla çalışma ücreti)',
        citation: '4857 s.K. m.41',
        relation: 'genel-referans',
        verificationStatus: 'DOĞRULANDI',
        sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.htm',
        createdAt: ts('2026-07-15'),
        seeded: true,
      },
    ],

    drafts: [
      {
        id: 'draft-001',
        caseId: PRIMARY_CASE_ID,
        title: 'Bilirkişi Raporuna İtiraz Dilekçesi',
        draftType: 'bilirkisi-itirazi',
        body:
          'DEMO — KURGUSAL DİLEKÇE\n\nBilirkişi raporuna ilişkin itirazlarımız:\n\n' +
          '1. Bilirkişi, WhatsApp mesajlarını delil olarak değerlendirmemiştir. Mesai sonrası gönderilen iş talimatları fazla çalışmanın kanıtıdır.\n\n' +
          '2. Puantaj çizelgesindeki 20:00 sonrası çıkış saatleri rapora yansıtılmamıştır.\n\n' +
          '3. Bordro ile banka hesap arasındaki aylık fark salt kesintilerle açıklanamaz.\n\n' +
          'Sonuç: Raporun eksikliklerinin giderilerek yeniden düzenlenmesini talep ederiz.',
        status: 'taslak',
        version: 2,
        versions: [
          { version: 1, timestamp: ts('2026-08-18'), author: PRIMARY_LAWYER, body: 'DEMO — KURGUSAL DİLEKÇE\n\nBilirkişi raporuna itiraz — ilk taslak.' },
          { version: 2, timestamp: ts('2026-08-22'), author: PRIMARY_LAWYER, body: 'DEMO — KURGUSAL DİLEKÇE\n\nBilirkişi raporuna ilişkin itirazlarımız: (genişletilmiş taslak)' },
        ],
        approvedAt: null,
        approvedBy: null,
        createdAt: ts('2026-08-18'),
        updatedAt: ts('2026-08-22'),
        seeded: true,
      },
      {
        id: 'draft-002',
        caseId: PRIMARY_CASE_ID,
        title: 'Beyan Dilekçesi — Duruşma Öncesi',
        draftType: 'beyan',
        body: 'DEMO — KURGUSAL DİLEKÇE\n\nSayın Mahkemeye;\n\nBilirkişi raporuna karşı beyanlarımız ve delil listemiz ektedir.',
        status: 'incelemede',
        version: 1,
        versions: [
          { version: 1, timestamp: ts('2026-08-26'), author: PRIMARY_LAWYER, body: 'DEMO — KURGUSAL DİLEKÇE\n\nSayın Mahkemeye; beyan dilekçesi ilk taslak.' },
        ],
        approvedAt: null,
        approvedBy: null,
        createdAt: ts('2026-08-26'),
        updatedAt: ts('2026-08-26'),
        seeded: true,
      },
    ],

    activities: [
      { id: 'act-seed-001', kind: 'document-added', caseId: PRIMARY_CASE_ID, summary: 'Belge eklendi', detail: 'Bilirkişi Raporu (2026/145)', actor: PRIMARY_LAWYER, at: ts('2026-08-27') },
      { id: 'act-seed-002', kind: 'note-added', caseId: PRIMARY_CASE_ID, summary: 'İç not eklendi', detail: 'Bilirkişi raporu ilk değerlendirme', actor: PRIMARY_LAWYER, at: ts('2026-08-21') },
      { id: 'act-seed-003', kind: 'task-completed', caseId: PRIMARY_CASE_ID, summary: 'Görev tamamlandı', detail: 'İtiraz dilekçesi taslağını hazırla', actor: PRIMARY_LAWYER, at: ts('2026-08-28') },
      { id: 'act-seed-004', kind: 'calendar-event-created', caseId: PRIMARY_CASE_ID, summary: 'Takvim kaydı eklendi', detail: 'Duruşma — Bilirkişi raporu değerlendirmesi (14.09.2026)', actor: PRIMARY_LAWYER, at: ts('2026-06-20') },
    ],
  });
}

/** structuredClone with a JSON fallback for older runtimes. */
function structuredCloneSafe<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}
