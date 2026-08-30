/**
 * HukukAI — deterministic, repository-derived demo analysis.
 *
 * NO network AI is called. Every output here is computed synchronously from the
 * current DemoRepository state (plus a small deterministic seed for the primary
 * fictional case). UI must label results "DEMO AI ÇIKTISI" / "DEMO YANIT".
 */

import { getDeadlineInfo, byDeadlineUrgency } from './demo-repository/deadline.ts';
import { PRIMARY_CASE_ID } from './demo-repository/seed.ts';
import type { WorkspaceState } from './demo-repository/types.ts';

const fmt = (v?: string | null) =>
  v ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(v)) : '—';

/* -------------------------------------------------------------------------- */
/*                            CASE ANALYSIS                                   */
/* -------------------------------------------------------------------------- */

export interface AnalysisAction {
  kind: 'task' | 'evidence' | 'calendar' | 'document' | 'note';
  label: string;
  payload?: string;
}

export interface CaseAnalysis {
  generatedFrom: string;
  strengths: string[];
  weaknesses: string[];
  missingEvidence: { claimId: string; refId: string; label: string; claimTitle: string }[];
  upcomingDeadlines: { id: string; label: string; date: string; urgency: string }[];
  contradictions: string[];
  nextActions: { text: string; action?: AnalysisAction }[];
}

export function buildCaseAnalysis(caseId: string, ws: WorkspaceState, reference: Date = new Date()): CaseAnalysis {
  const evidence = ws.evidence.filter((e) => e.caseId === caseId);
  const timeline = ws.timeline.filter((e) => e.caseId === caseId);
  const documents = ws.documents.filter((d) => d.caseId === caseId);
  const calendar = ws.calendar.filter((e) => e.caseId === caseId);
  const tasks = ws.tasks.filter((t) => t.caseId === caseId);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const contradictions: string[] = [];

  for (const claim of evidence) {
    if (claim.supporting.length >= 2) {
      strengths.push(`"${claim.title}" iddiası ${claim.supporting.length} destekleyen delil ile besleniyor.`);
    }
    if (claim.opposing.length > 0 && claim.supporting.length > 0) {
      contradictions.push(`"${claim.title}": ${claim.supporting.length} destekleyen / ${claim.opposing.length} karşı delil — çelişki değerlendirilmeli.`);
    }
    if (claim.missing.length > 0) {
      weaknesses.push(`"${claim.title}" için ${claim.missing.length} eksik delil bulunuyor.`);
    }
    if (claim.status === 'hazir') {
      strengths.push(`"${claim.title}" iddiası "Hazır" durumunda.`);
    }
  }

  const unverifiedDocs = documents.filter((d) => d.verificationStatus === 'DOĞRULANAMADI');
  if (unverifiedDocs.length) {
    weaknesses.push(`${unverifiedDocs.length} belge "DOĞRULANAMADI" durumunda: ${unverifiedDocs.map((d) => d.name).join(', ')}.`);
  }
  const verifiedDocs = documents.filter((d) => d.verificationStatus === 'DOĞRULANDI');
  if (verifiedDocs.length) {
    strengths.push(`${verifiedDocs.length} belge "DOĞRULANDI": ${verifiedDocs.map((d) => d.name).join(', ')}.`);
  }

  const unverifiedTimeline = timeline.filter((e) => e.sourceStatus === 'DOĞRULANAMADI');
  for (const e of unverifiedTimeline) {
    contradictions.push(`Kronoloji: "${e.title}" (${e.date}) kaynağı doğrulanamadı.`);
  }

  const missingEvidence = evidence.flatMap((claim) =>
    claim.missing.map((ref) => ({ claimId: claim.id, refId: ref.id, label: ref.label, claimTitle: claim.title })),
  );

  const upcomingDeadlines = [
    ...calendar.map((e) => ({ id: e.id, label: e.title, date: e.date })),
    ...tasks.filter((t) => t.dueDate && t.status !== 'done').map((t) => ({ id: t.id, label: t.title, date: t.dueDate as string })),
  ]
    .filter((x) => {
      const d = getDeadlineInfo(x.date, reference);
      return d.status === 'overdue' || (d.daysLeft ?? Infinity) <= 30;
    })
    .sort((a, b) => byDeadlineUrgency(a.date, b.date))
    .map((x) => {
      const d = getDeadlineInfo(x.date, reference);
      return { id: x.id, label: x.label, date: fmt(x.date), urgency: d.label };
    });

  const nextActions: CaseAnalysis['nextActions'] = [];
  if (missingEvidence.length) {
    nextActions.push({
      text: `${missingEvidence.length} eksik delili göreve dönüştürün ve temin planı yapın.`,
      action: { kind: 'evidence', label: 'Delil matrisine git' },
    });
  }
  if (upcomingDeadlines.length) {
    nextActions.push({
      text: `En yakın süre: ${upcomingDeadlines[0].label} (${upcomingDeadlines[0].urgency}). Takvimi kontrol edin.`,
      action: { kind: 'calendar', label: 'Takvime git' },
    });
  }
  if (unverifiedDocs.length) {
    nextActions.push({
      text: `Doğrulanamayan belgelerin kaynak doğrulamasını tamamlayın.`,
      action: { kind: 'task', label: 'Görev oluştur', payload: 'Doğrulanamayan belgelerin kaynak doğrulamasını tamamla' },
    });
  }
  if (!evidence.length) {
    nextActions.push({
      text: 'Delil matrisi boş. İlk iddiayı ekleyerek delilleri yapılandırın.',
      action: { kind: 'evidence', label: 'Delil matrisine git' },
    });
  }
  nextActions.push({
    text: 'Bilirkişi raporuna itiraz başlıklarını taslak haline getirin.',
    action: { kind: 'task', label: 'Görev oluştur', payload: 'Bilirkişi raporuna itiraz başlıklarını taslak haline getir' },
  });

  return {
    generatedFrom: `${evidence.length} iddia · ${documents.length} belge · ${timeline.length} kronoloji · ${calendar.length} takvim kaydı`,
    strengths: dedupe(strengths),
    weaknesses: dedupe(weaknesses),
    missingEvidence,
    upcomingDeadlines,
    contradictions: dedupe(contradictions),
    nextActions,
  };
}

/* -------------------------------------------------------------------------- */
/*                        COUNTERPARTY ANALYSIS                               */
/* -------------------------------------------------------------------------- */

export interface CounterpartyRisk {
  id: string;
  title: string;
  detail: string;
  /** Suggested evidence label if converted to an opposing evidence ref. */
  evidenceLabel: string;
}

export interface CounterpartyAnalysis {
  likelyArguments: string[];
  risks: CounterpartyRisk[];
  preparation: string[];
}

/** Deterministic seeded analysis for the primary fictional case + a generic
 *  derivation for any other case. Never random per render. */
export function buildCounterpartyAnalysis(caseId: string, ws: WorkspaceState): CounterpartyAnalysis {
  if (caseId === PRIMARY_CASE_ID) {
    return {
      likelyArguments: [
        'Çalışma saatlerinin yalnızca bordroda yazan saatlerle sınırlı olduğu.',
        'Fazla çalışmanın işveren yazılı onayı olmadan yapılamayacağı.',
        'Yıllık izinlerin izin formu ve defter kayıtları ile kullandırıldığı.',
        'Bordro ile banka hesap arasındaki farkın SGK ve vergi kesintilerinden kaynaklandığı.',
      ],
      risks: [
        { id: 'cp-1', title: 'Fazla mesai bordrolarında imza mevcut.', detail: 'İmzalı bordrolar, fazla çalışma iddiasına karşı güçlü bir belge olarak sunulabilir; ihtirazi kayıt yoksa aleyhe değerlendirilebilir.', evidenceLabel: 'İmzalı ücret bordroları (karşı taraf beyanı)' },
        { id: 'cp-2', title: 'İmzalı yıllık izin formu ibraz edilecek.', detail: '14 gün izin kullanıldığını gösteren imzalı form, izin ücreti talebini zayıflatır.', evidenceLabel: 'İmzalı yıllık izin formu' },
        { id: 'cp-3', title: 'Devamsızlık tutanaklarına dayanılacak.', detail: 'Fesih gerekçesi olarak devamsızlık tutanakları sunularak haklı fesih iddia edilebilir.', evidenceLabel: 'Devamsızlık tutanakları' },
        { id: 'cp-4', title: 'Tanık beyanlarının çelişkili olduğu ileri sürülecek.', detail: 'Karşı taraf, davacı tanıklarının husumetli olduğunu ve beyanların tek başına yeterli olmadığını savunabilir.', evidenceLabel: 'Karşı taraf tanık listesi' },
      ],
      preparation: [
        'Bordrolardaki imzalara ihtirazi kayıt / itiraz durumunu netleştir.',
        'Kartlı geçiş kayıtlarını ve işyeri giriş-çıkış loglarını temin et.',
        'Tanık beyanlarını mahkeme huzurunda teyit ettir.',
        'Bordro–banka hesap farkını dönemsel ve kalem bazında karşılaştırmalı hazırla.',
      ],
    };
  }

  // Generic derivation from repo state for user-created cases.
  const c = ws.cases.find((x) => x.id === caseId);
  const evidence = ws.evidence.filter((e) => e.caseId === caseId);
  const risks: CounterpartyRisk[] = evidence
    .filter((e) => e.opposing.length > 0)
    .map((e, i) => ({
      id: `cp-gen-${i}`,
      title: `"${e.title}" iddiasına karşı ${e.opposing.length} delil var.`,
      detail: `Karşı taraf şu delillere dayanabilir: ${e.opposing.map((r) => r.label).join(', ')}.`,
      evidenceLabel: e.opposing[0]?.label ?? 'Karşı taraf delili',
    }));
  if (!risks.length) {
    risks.push({
      id: 'cp-gen-0',
      title: 'Karşı taraf delilleri henüz yapılandırılmadı.',
      detail: 'Delil matrisine karşı delilleri ekledikçe bu analiz zenginleşir.',
      evidenceLabel: 'Karşı taraf delili',
    });
  }
  return {
    likelyArguments: [
      `${c?.opposingParty ?? 'Karşı taraf'} muhtemelen iddiaların ispat yükünün müvekkilde olduğunu vurgulayacaktır.`,
      'Sunulan belgelerin doğrulanamadığı ve tek başına yeterli olmadığı ileri sürülebilir.',
    ],
    risks,
    preparation: [
      'Her iddia için eksik delilleri göreve dönüştür.',
      'Doğrulanamayan belgelerin kaynağını netleştir.',
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*                          SIMILAR CASES (demo memory)                      */
/* -------------------------------------------------------------------------- */

export interface SimilarCase {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  clientName: string;
  opposingParty: string;
  /** HISTORICAL demo outcome — not a prediction. */
  outcome: string;
  similarity: number;
  commonIssues: string[];
  usefulArgument: string;
  lawyerNote: string;
}

export const SIMILAR_CASES: SimilarCase[] = [
  {
    id: 'mem-001',
    caseNumber: '2024/381',
    title: 'Fazla Mesai Alacağı',
    court: 'Kurgu 8. İş Mahkemesi',
    clientName: 'Ece Korkmaz',
    opposingParty: 'Anadolu Tekstil Ltd. Şti.',
    outcome: 'Kısmen Kabul',
    similarity: 0.9,
    commonIssues: ['Fazla çalışma ücreti', 'Bordro itirazı', 'Tanık beyanı'],
    usefulArgument: 'Bordro ile banka hesap özeti arasındaki farkın somut gösterilmesi mahkeme tarafından olumlu değerlendirilmişti.',
    lawyerNote: 'Bu davada bilirkişi raporundaki eksiklikler giderilerek karar alınmıştı. Benzer strateji uygulanabilir.',
  },
  {
    id: 'mem-002',
    caseNumber: '2025/077',
    title: 'Yıllık İzin ve Ücret Alacağı',
    court: 'Kurgu 5. İş Mahkemesi',
    clientName: 'Kuzey Yapı A.Ş.',
    opposingParty: 'Mehmet Yıldız',
    outcome: 'Kabul',
    similarity: 0.82,
    commonIssues: ['Yıllık izin hakkı', 'Ücret alacağı', 'İzin formu geçerliliği'],
    usefulArgument: 'İzin defteri kayıtlarının düzenli tutulması ve imzalı formların mevcut olması davayı güçlendirmişti.',
    lawyerNote: 'İzin formu itirazının ne kadar kritik olduğunu gösteren bir karşılaştırma.',
  },
];

/* -------------------------------------------------------------------------- */
/*                          LEGAL ASSISTANT (deterministic)                  */
/* -------------------------------------------------------------------------- */

export type AssistantPromptKey = 'missing-evidence' | 'upcoming-deadlines' | 'precedent-conflicts' | 'objection-headings';

export const ASSISTANT_PROMPTS: { key: AssistantPromptKey; label: string }[] = [
  { key: 'missing-evidence', label: 'Bu dosyadaki eksik delilleri göster' },
  { key: 'upcoming-deadlines', label: 'Yaklaşan süreleri özetle' },
  { key: 'precedent-conflicts', label: 'Emsal kararlarla çelişen noktaları göster' },
  { key: 'objection-headings', label: 'Bilirkişi raporuna itiraz başlıklarını çıkar' },
];

export function matchAssistantPrompt(text: string): AssistantPromptKey | null {
  const t = text.toLocaleLowerCase('tr-TR');
  if (/eksik.*delil|delil.*eksik/.test(t)) return 'missing-evidence';
  if (/süre|duruşma|takvim|deadline/.test(t)) return 'upcoming-deadlines';
  if (/emsal|içtihat|çeliş/.test(t)) return 'precedent-conflicts';
  if (/itiraz|bilirkişi|başlık/.test(t)) return 'objection-headings';
  return null;
}

export interface AssistantResponse {
  heading: string;
  lines: string[];
  empty?: boolean;
}

export function buildAssistantResponse(key: AssistantPromptKey, caseId: string, ws: WorkspaceState): AssistantResponse {
  const c = ws.cases.find((x) => x.id === caseId);
  const label = c ? `${c.caseNumber ?? c.title}` : 'seçili dosya';

  if (key === 'missing-evidence') {
    const claims = ws.evidence.filter((e) => e.caseId === caseId);
    const lines = claims.flatMap((claim) =>
      claim.missing.length
        ? [`• ${claim.title}: ${claim.missing.map((m) => m.label).join(' · ')}`]
        : [],
    );
    return {
      heading: `${label} — eksik deliller`,
      lines: lines.length ? lines : ['Bu dosyada işaretlenmiş eksik delil bulunmuyor.'],
      empty: lines.length === 0,
    };
  }

  if (key === 'upcoming-deadlines') {
    const analysis = buildCaseAnalysis(caseId, ws);
    return {
      heading: `${label} — yaklaşan süreler`,
      lines: analysis.upcomingDeadlines.length
        ? analysis.upcomingDeadlines.map((d) => `• ${d.date} — ${d.label} (${d.urgency})`)
        : ['30 gün içinde yaklaşan süre veya duruşma yok.'],
      empty: analysis.upcomingDeadlines.length === 0,
    };
  }

  if (key === 'precedent-conflicts') {
    const bookmarks = ws.researchBookmarks.filter((b) => b.caseId === caseId);
    const against = bookmarks.filter((b) => b.relation === 'karsi');
    const lines: string[] = [];
    for (const b of against) lines.push(`• Aleyhe: ${b.title}${b.note ? ` — ${b.note}` : ''}`);
    const unverified = bookmarks.filter((b) => b.verificationStatus !== 'DOĞRULANDI');
    for (const b of unverified) lines.push(`• Dikkat: "${b.title}" kaynağı ${b.verificationStatus}.`);
    return {
      heading: `${label} — emsal/mevzuat çelişkileri`,
      lines: lines.length ? lines : ['Dosyaya kayıtlı, çelişki oluşturan aleyhe emsal veya doğrulanmamış kaynak yok.'],
      empty: lines.length === 0,
    };
  }

  // objection-headings
  const analysis = buildCaseAnalysis(caseId, ws);
  const lines = [
    ...analysis.weaknesses.map((w) => `• ${w}`),
    ...analysis.contradictions.map((cc) => `• ${cc}`),
    '• Bilirkişi hesabının dayanaklarının denetime elverişli sunulması talebi.',
  ];
  return {
    heading: `${label} — bilirkişi raporuna itiraz başlıkları`,
    lines,
  };
}

function dedupe(arr: string[]) {
  return [...new Set(arr)];
}
