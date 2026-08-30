/**
 * HukukAI — Demo domain types.
 *
 * These types describe the LOCAL, browser-only demo workspace. They are NOT
 * backend models and imply no server persistence, authentication or storage
 * guarantees. All data lives in `localStorage` under a single versioned key.
 */

export type ID = string;

/* -------------------------------------------------------------------------- */
/*                                  CLIENTS                                   */
/* -------------------------------------------------------------------------- */

export type ClientType = 'individual' | 'corporate';

export interface DemoClient {
  id: ID;
  name: string;
  type: ClientType;
  phone?: string;
  email?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   CASES                                    */
/* -------------------------------------------------------------------------- */

export type CaseStatus = 'draft' | 'active' | 'pending' | 'closed';

/** Non-exhaustive. Legal categorisation is not fully modelled in the demo. */
export type CaseType =
  | 'is'
  | 'ticaret'
  | 'kira'
  | 'gayrimenkul'
  | 'aile'
  | 'icra'
  | 'ceza'
  | 'idare'
  | 'diger';

/** Non-exhaustive outcome labels. Not a legal prediction or statistic. */
export type CaseOutcome =
  | 'kabul'
  | 'kismen-kabul'
  | 'ret'
  | 'sulh'
  | 'feragat'
  | 'diger';

export interface DemoCase {
  id: ID;
  title: string;
  caseType: CaseType;
  caseNumber?: string;
  court?: string;
  clientId?: ID | null;
  /** Denormalised client label for display + search. */
  clientName: string;
  opposingParty?: string;
  responsible?: string;
  openedAt?: string | null;
  nextHearing?: string | null;
  nextDeadline?: string | null;
  note?: string;
  summary?: string;
  status: CaseStatus;
  outcome?: CaseOutcome | null;
  /** Legacy display category kept for the seeded case ("İş Hukuku"). */
  categoryLabel?: string;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   TASKS                                    */
/* -------------------------------------------------------------------------- */

export type TaskStatus = 'open' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';

export interface DemoTask {
  id: ID;
  caseId?: ID | null;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string | null;
  /** Provenance marker, e.g. "missing-evidence" when converted from a gap. */
  origin?: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                CASE NOTES                                  */
/* -------------------------------------------------------------------------- */

export interface DemoNote {
  id: ID;
  caseId: ID;
  title?: string;
  body: string;
  author: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             DOCUMENT METADATA                              */
/* -------------------------------------------------------------------------- */

export type DocumentType =
  | 'dilekce'
  | 'mahkeme-evraki'
  | 'sozlesme'
  | 'bordro'
  | 'puantaj'
  | 'mesajlasma'
  | 'bilirkisi-raporu'
  | 'ihtarname'
  | 'delil'
  | 'diger';

export interface DemoDocument {
  id: ID;
  caseId?: ID | null;
  name: string;
  docType: DocumentType;
  /** Filename from a local file selection — bytes are NOT stored. */
  fileName?: string;
  fileMime?: string;
  documentDate?: string | null;
  source?: string;
  description?: string;
  /** Preserves existing verification vocabulary (DOĞRULANDI / DOĞRULANAMADI …). */
  verificationStatus: string;
  /** Only present for the seeded fictional documents. */
  demoExcerpt?: string;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              TIMELINE EVENTS                               */
/* -------------------------------------------------------------------------- */

export type TimelineEventType =
  | 'dava-acilisi'
  | 'durusma'
  | 'teblig'
  | 'ihtar'
  | 'bilirkisi'
  | 'belge'
  | 'odeme'
  | 'islem'
  | 'diger';

export interface DemoTimelineEvent {
  id: ID;
  caseId: ID;
  date: string;
  title: string;
  eventType: TimelineEventType;
  description?: string;
  relatedDocumentId?: ID | null;
  /** Source provenance label, never silently upgraded. */
  sourceStatus?: string;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              EVIDENCE MATRIX                               */
/* -------------------------------------------------------------------------- */

export type EvidenceStatus = 'incelenmedi' | 'inceleniyor' | 'hazir';

export interface EvidenceRef {
  id: ID;
  label: string;
  /** Set when the ref points at a case document. */
  documentId?: ID | null;
}

export interface DemoEvidenceClaim {
  id: ID;
  caseId: ID;
  title: string;
  legalIssue?: string;
  supporting: EvidenceRef[];
  opposing: EvidenceRef[];
  missing: EvidenceRef[];
  lawyerAssessment?: string;
  status: EvidenceStatus;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              CALENDAR EVENTS                               */
/* -------------------------------------------------------------------------- */

export type CalendarEventType =
  | 'durusma'
  | 'son-sure'
  | 'bilirkisi'
  | 'arabuluculuk'
  | 'muvekkil-gorusmesi'
  | 'ic-gorev';

export interface DemoCalendarEvent {
  id: ID;
  caseId?: ID | null;
  title: string;
  eventType: CalendarEventType;
  date: string;
  time?: string | null;
  description?: string;
  responsible?: string;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                            RESEARCH BOOKMARKS                              */
/* -------------------------------------------------------------------------- */

export type ResearchRelation = 'destekleyen' | 'karsi' | 'genel-referans';
export type ResearchSourceKind = 'precedent' | 'legislation';

export interface DemoResearchBookmark {
  id: ID;
  caseId: ID;
  sourceKind: ResearchSourceKind;
  /** Id of the verified static source (precedent/legislation dataset). */
  sourceId: string;
  title: string;
  citation?: string;
  relation: ResearchRelation;
  note?: string;
  /** Copied verbatim from the verified source — never upgraded. */
  verificationStatus: string;
  sourceUrl?: string;
  createdAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  DRAFTS                                    */
/* -------------------------------------------------------------------------- */

export type DraftStatus = 'taslak' | 'incelemede' | 'onaylandi';

export type DraftType =
  | 'dava-dilekcesi'
  | 'cevap-dilekcesi'
  | 'beyan'
  | 'bilirkisi-itirazi'
  | 'istinaf'
  | 'temyiz'
  | 'ihtarname'
  | 'hukuki-gorus'
  | 'diger';

export interface DraftVersion {
  version: number;
  timestamp: string;
  author: string;
  body: string;
}

export interface DemoDraft {
  id: ID;
  caseId?: ID | null;
  title: string;
  draftType: DraftType;
  body: string;
  status: DraftStatus;
  version: number;
  versions: DraftVersion[];
  approvedAt?: string | null;
  approvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             DEMO ACTIVITY FEED                             */
/* -------------------------------------------------------------------------- */

export type ActivityKind =
  | 'case-created'
  | 'case-updated'
  | 'case-status-changed'
  | 'task-created'
  | 'task-updated'
  | 'task-completed'
  | 'task-reopened'
  | 'task-deleted'
  | 'note-added'
  | 'note-updated'
  | 'note-deleted'
  | 'document-added'
  | 'document-updated'
  | 'document-deleted'
  | 'timeline-event-created'
  | 'timeline-event-updated'
  | 'timeline-event-deleted'
  | 'evidence-created'
  | 'evidence-updated'
  | 'calendar-event-created'
  | 'calendar-event-updated'
  | 'calendar-event-deleted'
  | 'research-saved'
  | 'draft-created'
  | 'draft-updated'
  | 'draft-status-changed'
  | 'client-created'
  | 'client-updated'
  | 'demo-reset';

export interface DemoActivity {
  id: ID;
  kind: ActivityKind;
  caseId?: ID | null;
  summary: string;
  detail?: string;
  actor: string;
  at: string;
}

/* -------------------------------------------------------------------------- */
/*                              WORKSPACE STATE                               */
/* -------------------------------------------------------------------------- */

export interface WorkspaceMeta {
  version: number;
  seededAt: string;
}

export interface WorkspaceState {
  meta: WorkspaceMeta;
  clients: DemoClient[];
  cases: DemoCase[];
  tasks: DemoTask[];
  notes: DemoNote[];
  documents: DemoDocument[];
  timeline: DemoTimelineEvent[];
  evidence: DemoEvidenceClaim[];
  calendar: DemoCalendarEvent[];
  researchBookmarks: DemoResearchBookmark[];
  drafts: DemoDraft[];
  activities: DemoActivity[];
}

export type WorkspaceCollectionKey = Exclude<keyof WorkspaceState, 'meta'>;
