/**
 * Turkish display labels for demo domain enums. Kept in one place so tables,
 * dialogs, search and the command palette stay consistent.
 */

import type {
  CalendarEventType,
  CaseOutcome,
  CaseStatus,
  CaseType,
  DocumentType,
  DraftStatus,
  DraftType,
  EvidenceStatus,
  ResearchRelation,
  TaskPriority,
  TaskStatus,
  TimelineEventType,
} from './types.ts';

export const caseTypeLabels: Record<CaseType, string> = {
  is: 'İş',
  ticaret: 'Ticaret',
  kira: 'Kira',
  gayrimenkul: 'Gayrimenkul',
  aile: 'Aile',
  icra: 'İcra',
  ceza: 'Ceza',
  idare: 'İdare',
  diger: 'Diğer',
};

export const caseStatusLabels: Record<CaseStatus, string> = {
  draft: 'Taslak',
  active: 'Aktif',
  pending: 'Beklemede',
  closed: 'Kapandı',
};

export const caseOutcomeLabels: Record<CaseOutcome, string> = {
  kabul: 'Kabul',
  'kismen-kabul': 'Kısmen Kabul',
  ret: 'Ret',
  sulh: 'Sulh',
  feragat: 'Feragat',
  diger: 'Diğer',
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  open: 'Açık',
  'in-progress': 'Devam Ediyor',
  done: 'Tamamlandı',
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Düşük',
  normal: 'Normal',
  high: 'Yüksek',
  critical: 'Kritik',
};

export const documentTypeLabels: Record<DocumentType, string> = {
  dilekce: 'Dilekçe',
  'mahkeme-evraki': 'Mahkeme Evrakı',
  sozlesme: 'Sözleşme',
  bordro: 'Bordro',
  puantaj: 'Puantaj',
  mesajlasma: 'Mesajlaşma',
  'bilirkisi-raporu': 'Bilirkişi Raporu',
  ihtarname: 'İhtarname',
  delil: 'Delil',
  diger: 'Diğer',
};

export const timelineEventTypeLabels: Record<TimelineEventType, string> = {
  'dava-acilisi': 'Dava Açılışı',
  durusma: 'Duruşma',
  teblig: 'Tebligat',
  ihtar: 'İhtar',
  bilirkisi: 'Bilirkişi',
  belge: 'Belge',
  odeme: 'Ödeme',
  islem: 'İşlem',
  diger: 'Diğer',
};

export const evidenceStatusLabels: Record<EvidenceStatus, string> = {
  incelenmedi: 'İncelenmedi',
  inceleniyor: 'İnceleniyor',
  hazir: 'Hazır',
};

export const calendarEventTypeLabels: Record<CalendarEventType, string> = {
  durusma: 'Duruşma',
  'son-sure': 'Son Süre',
  bilirkisi: 'Bilirkişi',
  arabuluculuk: 'Arabuluculuk',
  'muvekkil-gorusmesi': 'Müvekkil Görüşmesi',
  'ic-gorev': 'İç Görev',
};

export const draftTypeLabels: Record<DraftType, string> = {
  'dava-dilekcesi': 'Dava Dilekçesi',
  'cevap-dilekcesi': 'Cevap Dilekçesi',
  beyan: 'Beyan',
  'bilirkisi-itirazi': 'Bilirkişi İtirazı',
  istinaf: 'İstinaf',
  temyiz: 'Temyiz',
  ihtarname: 'İhtarname',
  'hukuki-gorus': 'Hukuki Görüş',
  diger: 'Diğer',
};

export const draftStatusLabels: Record<DraftStatus, string> = {
  taslak: 'Taslak',
  incelemede: 'İncelemede',
  onaylandi: 'Onaylandı',
};

export const researchRelationLabels: Record<ResearchRelation, string> = {
  destekleyen: 'Destekleyen',
  karsi: 'Karşı',
  'genel-referans': 'Genel Referans',
};
