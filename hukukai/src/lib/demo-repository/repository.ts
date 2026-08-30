/**
 * HukukAI — DemoRepository.
 *
 * A single in-memory + localStorage-backed store for the demo workspace.
 * Every mutating call persists synchronously, appends a "Son Hareketler"
 * activity entry where relevant, and notifies subscribers (incl. other tabs
 * via the `storage` event).
 *
 * This is demo infrastructure only — no server, no multi-user sync, no audit
 * guarantees. The activity stream is labelled "Son Hareketler", never
 * "Denetim Kaydı".
 */

import { loadState, resetState, saveState } from './storage.ts';
import { PRIMARY_LAWYER } from './seed.ts';
import type {
  ActivityKind,
  DemoActivity,
  DemoCalendarEvent,
  DemoCase,
  DemoClient,
  DemoDocument,
  DemoDraft,
  DemoEvidenceClaim,
  DemoNote,
  DemoResearchBookmark,
  DemoTask,
  DemoTimelineEvent,
  DraftVersion,
  ID,
  WorkspaceState,
} from './types.ts';

type Listener = () => void;

const nowISO = () => new Date().toISOString();

let idCounter = 0;
function makeId(prefix: string): ID {
  idCounter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}${rand}`;
}

interface ActivityInput {
  kind: ActivityKind;
  summary: string;
  detail?: string;
  caseId?: ID | null;
  actor?: string;
}

class DemoRepository {
  private state: WorkspaceState = loadState();
  private listeners = new Set<Listener>();
  private storageBound = false;

  /* --------------------------- store plumbing --------------------------- */

  getSnapshot = (): WorkspaceState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    this.bindStorageSync();
    return () => {
      this.listeners.delete(listener);
    };
  };

  private bindStorageSync() {
    if (this.storageBound || typeof window === 'undefined') return;
    this.storageBound = true;
    window.addEventListener('storage', (event) => {
      if (event.key && event.key !== 'hukukai.demo.workspace.v1') return;
      this.state = loadState();
      this.emit();
    });
  }

  private emit() {
    for (const l of this.listeners) l();
  }

  private commit(next: WorkspaceState, activity?: ActivityInput | ActivityInput[]) {
    let state = next;
    const inputs = activity ? (Array.isArray(activity) ? activity : [activity]) : [];
    if (inputs.length) {
      const entries: DemoActivity[] = inputs.map((a) => ({
        id: makeId('act'),
        kind: a.kind,
        caseId: a.caseId ?? null,
        summary: a.summary,
        detail: a.detail,
        actor: a.actor ?? PRIMARY_LAWYER,
        at: nowISO(),
      }));
      state = { ...state, activities: [...entries, ...state.activities].slice(0, 300) };
    }
    this.state = state;
    saveState(state);
    this.emit();
  }

  /* ------------------------------- reset ------------------------------- */

  resetToSeed() {
    this.state = resetState();
    // Record the reset in the fresh stream so the action is visible.
    this.commit(this.state, {
      kind: 'demo-reset',
      summary: 'Demo verileri sıfırlandı',
      detail: 'Çalışma alanı başlangıç demo veri kümesine döndürüldü.',
    });
  }

  /* ------------------------------ clients ----------------------------- */

  createClient(input: Pick<DemoClient, 'name' | 'type'> & Partial<DemoClient>): DemoClient {
    const client: DemoClient = {
      id: makeId('client'),
      name: input.name.trim(),
      type: input.type,
      phone: input.phone?.trim() || undefined,
      email: input.email?.trim() || undefined,
      note: input.note?.trim() || undefined,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, clients: [...this.state.clients, client] },
      { kind: 'client-created', summary: 'Müvekkil oluşturuldu', detail: client.name },
    );
    return client;
  }

  updateClient(id: ID, patch: Partial<DemoClient>): DemoClient | undefined {
    const existing = this.state.clients.find((c) => c.id === id);
    if (!existing) return undefined;
    const updated: DemoClient = { ...existing, ...patch, id, updatedAt: nowISO() };
    this.commit(
      { ...this.state, clients: this.state.clients.map((c) => (c.id === id ? updated : c)) },
      { kind: 'client-updated', summary: 'Müvekkil güncellendi', detail: updated.name },
    );
    return updated;
  }

  /* ------------------------------- cases ----------------------------- */

  createCase(
    input: Pick<DemoCase, 'title' | 'caseType' | 'clientName'> & Partial<DemoCase>,
  ): DemoCase {
    const item: DemoCase = {
      id: makeId('case'),
      title: input.title.trim(),
      caseType: input.caseType,
      caseNumber: input.caseNumber?.trim() || undefined,
      court: input.court?.trim() || undefined,
      clientId: input.clientId ?? null,
      clientName: input.clientName.trim(),
      opposingParty: input.opposingParty?.trim() || undefined,
      responsible: input.responsible?.trim() || PRIMARY_LAWYER,
      openedAt: input.openedAt ?? nowISO(),
      nextHearing: input.nextHearing ?? null,
      nextDeadline: input.nextDeadline ?? null,
      note: input.note?.trim() || undefined,
      summary: input.summary?.trim() || undefined,
      status: input.status ?? 'active',
      outcome: input.outcome ?? null,
      categoryLabel: input.categoryLabel,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, cases: [item, ...this.state.cases] },
      { kind: 'case-created', caseId: item.id, summary: 'Dava oluşturuldu', detail: `${item.title}${item.caseNumber ? ` · ${item.caseNumber}` : ''}` },
    );
    return item;
  }

  /** Case creation with an inline new client, without leaving the flow. */
  createCaseWithNewClient(
    caseInput: Pick<DemoCase, 'title' | 'caseType'> & Partial<DemoCase>,
    clientInput: Pick<DemoClient, 'name' | 'type'> & Partial<DemoClient>,
  ): { case: DemoCase; client: DemoClient } {
    const client = this.createClient(clientInput);
    const created = this.createCase({ ...caseInput, clientId: client.id, clientName: client.name });
    return { case: created, client };
  }

  updateCase(id: ID, patch: Partial<DemoCase>): DemoCase | undefined {
    const existing = this.state.cases.find((c) => c.id === id);
    if (!existing) return undefined;
    const updated: DemoCase = { ...existing, ...patch, id, updatedAt: nowISO() };
    this.commit(
      { ...this.state, cases: this.state.cases.map((c) => (c.id === id ? updated : c)) },
      { kind: 'case-updated', caseId: id, summary: 'Dava güncellendi', detail: updated.title },
    );
    return updated;
  }

  changeCaseStatus(id: ID, status: DemoCase['status'], outcome?: DemoCase['outcome']): DemoCase | undefined {
    const existing = this.state.cases.find((c) => c.id === id);
    if (!existing) return undefined;
    const updated: DemoCase = {
      ...existing,
      status,
      outcome: status === 'closed' ? (outcome ?? existing.outcome ?? null) : null,
      updatedAt: nowISO(),
    };
    const labels: Record<DemoCase['status'], string> = {
      draft: 'Taslak',
      active: 'Aktif',
      pending: 'Beklemede',
      closed: 'Kapandı',
    };
    this.commit(
      { ...this.state, cases: this.state.cases.map((c) => (c.id === id ? updated : c)) },
      {
        kind: 'case-status-changed',
        caseId: id,
        summary: 'Dosya durumu değişti',
        detail: `${updated.title} → ${labels[status]}`,
      },
    );
    return updated;
  }

  deleteCase(id: ID): void {
    const existing = this.state.cases.find((c) => c.id === id);
    if (!existing) return;
    this.commit(
      {
        ...this.state,
        cases: this.state.cases.filter((c) => c.id !== id),
        tasks: this.state.tasks.filter((t) => t.caseId !== id),
        notes: this.state.notes.filter((n) => n.caseId !== id),
        documents: this.state.documents.filter((d) => d.caseId !== id),
        timeline: this.state.timeline.filter((e) => e.caseId !== id),
        evidence: this.state.evidence.filter((e) => e.caseId !== id),
        calendar: this.state.calendar.filter((e) => e.caseId !== id),
        researchBookmarks: this.state.researchBookmarks.filter((b) => b.caseId !== id),
        drafts: this.state.drafts.filter((d) => d.caseId !== id),
      },
      { kind: 'case-updated', summary: 'Dava silindi', detail: existing.title },
    );
  }

  /* ------------------------------- tasks ----------------------------- */

  createTask(
    input: Pick<DemoTask, 'title'> & Partial<DemoTask>,
  ): DemoTask {
    const task: DemoTask = {
      id: makeId('task'),
      caseId: input.caseId ?? null,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      assignedTo: input.assignedTo?.trim() || PRIMARY_LAWYER,
      dueDate: input.dueDate ?? null,
      priority: input.priority ?? 'normal',
      status: input.status ?? 'open',
      origin: input.origin,
      createdAt: nowISO(),
      completedAt: input.status === 'done' ? nowISO() : null,
    };
    this.commit(
      { ...this.state, tasks: [task, ...this.state.tasks] },
      { kind: 'task-created', caseId: task.caseId, summary: 'Yeni görev oluşturuldu', detail: task.title },
    );
    return task;
  }

  updateTask(id: ID, patch: Partial<DemoTask>): DemoTask | undefined {
    const existing = this.state.tasks.find((t) => t.id === id);
    if (!existing) return undefined;
    const status = patch.status ?? existing.status;
    const updated: DemoTask = {
      ...existing,
      ...patch,
      id,
      completedAt:
        status === 'done'
          ? existing.completedAt ?? nowISO()
          : status !== existing.status
            ? null
            : existing.completedAt,
    };
    let activity: ActivityInput;
    if (patch.status === 'done' && existing.status !== 'done') {
      activity = { kind: 'task-completed', caseId: updated.caseId, summary: 'Görev tamamlandı', detail: updated.title };
    } else if (existing.status === 'done' && patch.status && patch.status !== 'done') {
      activity = { kind: 'task-reopened', caseId: updated.caseId, summary: 'Görev yeniden açıldı', detail: updated.title };
    } else {
      activity = { kind: 'task-updated', caseId: updated.caseId, summary: 'Görev güncellendi', detail: updated.title };
    }
    this.commit({ ...this.state, tasks: this.state.tasks.map((t) => (t.id === id ? updated : t)) }, activity);
    return updated;
  }

  completeTask(id: ID) {
    return this.updateTask(id, { status: 'done' });
  }

  reopenTask(id: ID) {
    return this.updateTask(id, { status: 'open' });
  }

  deleteTask(id: ID): void {
    const existing = this.state.tasks.find((t) => t.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, tasks: this.state.tasks.filter((t) => t.id !== id) },
      { kind: 'task-deleted', caseId: existing.caseId, summary: 'Görev silindi', detail: existing.title },
    );
  }

  /* ------------------------------- notes ----------------------------- */

  createNote(input: Pick<DemoNote, 'caseId' | 'body'> & Partial<DemoNote>): DemoNote {
    const note: DemoNote = {
      id: makeId('note'),
      caseId: input.caseId,
      title: input.title?.trim() || undefined,
      body: input.body.trim(),
      author: input.author?.trim() || PRIMARY_LAWYER,
      pinned: input.pinned ?? false,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, notes: [note, ...this.state.notes] },
      { kind: 'note-added', caseId: note.caseId, summary: 'İç not eklendi', detail: note.title || note.body.slice(0, 60) },
    );
    return note;
  }

  updateNote(id: ID, patch: Partial<DemoNote>): DemoNote | undefined {
    const existing = this.state.notes.find((n) => n.id === id);
    if (!existing) return undefined;
    const updated: DemoNote = { ...existing, ...patch, id, updatedAt: nowISO() };
    this.commit(
      { ...this.state, notes: this.state.notes.map((n) => (n.id === id ? updated : n)) },
      { kind: 'note-updated', caseId: updated.caseId, summary: 'İç not güncellendi', detail: updated.title || updated.body.slice(0, 60) },
    );
    return updated;
  }

  toggleNotePin(id: ID) {
    const existing = this.state.notes.find((n) => n.id === id);
    if (!existing) return undefined;
    return this.updateNote(id, { pinned: !existing.pinned });
  }

  deleteNote(id: ID): void {
    const existing = this.state.notes.find((n) => n.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, notes: this.state.notes.filter((n) => n.id !== id) },
      { kind: 'note-deleted', caseId: existing.caseId, summary: 'İç not silindi', detail: existing.title || existing.body.slice(0, 60) },
    );
  }

  /* ----------------------------- documents --------------------------- */

  createDocument(input: Pick<DemoDocument, 'name' | 'docType'> & Partial<DemoDocument>): DemoDocument {
    const doc: DemoDocument = {
      id: makeId('doc'),
      caseId: input.caseId ?? null,
      name: input.name.trim(),
      docType: input.docType,
      fileName: input.fileName?.trim() || undefined,
      fileMime: input.fileMime || undefined,
      documentDate: input.documentDate ?? null,
      source: input.source?.trim() || undefined,
      description: input.description?.trim() || undefined,
      verificationStatus: input.verificationStatus?.trim() || 'DEMO — YALNIZCA ÜST VERİ',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, documents: [doc, ...this.state.documents] },
      { kind: 'document-added', caseId: doc.caseId, summary: 'Belge eklendi', detail: doc.name },
    );
    return doc;
  }

  updateDocument(id: ID, patch: Partial<DemoDocument>): DemoDocument | undefined {
    const existing = this.state.documents.find((d) => d.id === id);
    if (!existing) return undefined;
    const updated: DemoDocument = { ...existing, ...patch, id, updatedAt: nowISO() };
    this.commit(
      { ...this.state, documents: this.state.documents.map((d) => (d.id === id ? updated : d)) },
      { kind: 'document-updated', caseId: updated.caseId, summary: 'Belge güncellendi', detail: updated.name },
    );
    return updated;
  }

  deleteDocument(id: ID): void {
    const existing = this.state.documents.find((d) => d.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, documents: this.state.documents.filter((d) => d.id !== id) },
      { kind: 'document-deleted', caseId: existing.caseId, summary: 'Belge silindi', detail: existing.name },
    );
  }

  /* ----------------------------- timeline --------------------------- */

  createTimelineEvent(input: Pick<DemoTimelineEvent, 'caseId' | 'date' | 'title' | 'eventType'> & Partial<DemoTimelineEvent>): DemoTimelineEvent {
    const event: DemoTimelineEvent = {
      id: makeId('event'),
      caseId: input.caseId,
      date: input.date,
      title: input.title.trim(),
      eventType: input.eventType,
      description: input.description?.trim() || undefined,
      relatedDocumentId: input.relatedDocumentId ?? null,
      sourceStatus: input.sourceStatus?.trim() || 'DEMO — KURGUSAL DAVA VERİSİ',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, timeline: [...this.state.timeline, event] },
      { kind: 'timeline-event-created', caseId: event.caseId, summary: 'Kronoloji olayı eklendi', detail: `${event.date} · ${event.title}` },
    );
    return event;
  }

  updateTimelineEvent(id: ID, patch: Partial<DemoTimelineEvent>): DemoTimelineEvent | undefined {
    const existing = this.state.timeline.find((e) => e.id === id);
    if (!existing) return undefined;
    const updated: DemoTimelineEvent = { ...existing, ...patch, id, updatedAt: nowISO() };
    this.commit(
      { ...this.state, timeline: this.state.timeline.map((e) => (e.id === id ? updated : e)) },
      { kind: 'timeline-event-updated', caseId: updated.caseId, summary: 'Kronoloji olayı güncellendi', detail: updated.title },
    );
    return updated;
  }

  deleteTimelineEvent(id: ID): void {
    const existing = this.state.timeline.find((e) => e.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, timeline: this.state.timeline.filter((e) => e.id !== id) },
      { kind: 'timeline-event-deleted', caseId: existing.caseId, summary: 'Kronoloji olayı silindi', detail: existing.title },
    );
  }

  /* ----------------------------- evidence -------------------------- */

  createEvidenceClaim(input: Pick<DemoEvidenceClaim, 'caseId' | 'title'> & Partial<DemoEvidenceClaim>): DemoEvidenceClaim {
    const claim: DemoEvidenceClaim = {
      id: makeId('evidence'),
      caseId: input.caseId,
      title: input.title.trim(),
      legalIssue: input.legalIssue?.trim() || undefined,
      supporting: input.supporting ?? [],
      opposing: input.opposing ?? [],
      missing: input.missing ?? [],
      lawyerAssessment: input.lawyerAssessment?.trim() || undefined,
      status: input.status ?? 'incelenmedi',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, evidence: [...this.state.evidence, claim] },
      { kind: 'evidence-created', caseId: claim.caseId, summary: 'Delil iddiası eklendi', detail: claim.title },
    );
    return claim;
  }

  updateEvidenceClaim(id: ID, patch: Partial<DemoEvidenceClaim>): DemoEvidenceClaim | undefined {
    const existing = this.state.evidence.find((e) => e.id === id);
    if (!existing) return undefined;
    const updated: DemoEvidenceClaim = { ...existing, ...patch, id, updatedAt: nowISO() };
    this.commit(
      { ...this.state, evidence: this.state.evidence.map((e) => (e.id === id ? updated : e)) },
      { kind: 'evidence-updated', caseId: updated.caseId, summary: 'Delil matrisi güncellendi', detail: updated.title },
    );
    return updated;
  }

  deleteEvidenceClaim(id: ID): void {
    const existing = this.state.evidence.find((e) => e.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, evidence: this.state.evidence.filter((e) => e.id !== id) },
      { kind: 'evidence-updated', caseId: existing.caseId, summary: 'Delil iddiası silindi', detail: existing.title },
    );
  }

  /** Cross-feature: turn a missing-evidence gap into a linked case task. */
  convertMissingEvidenceToTask(claimId: ID, refId: ID): DemoTask | undefined {
    const claim = this.state.evidence.find((e) => e.id === claimId);
    if (!claim) return undefined;
    const ref = claim.missing.find((m) => m.id === refId);
    if (!ref) return undefined;
    return this.createTask({
      caseId: claim.caseId,
      title: `${ref.label} — temin et`,
      description: `"${claim.title}" iddiası için eksik delil. Delil matrisinden göreve dönüştürüldü.`,
      priority: 'high',
      origin: 'missing-evidence',
    });
  }

  /* -------------------------- calendar events ---------------------- */

  createCalendarEvent(input: Pick<DemoCalendarEvent, 'title' | 'eventType' | 'date'> & Partial<DemoCalendarEvent>): DemoCalendarEvent {
    const event: DemoCalendarEvent = {
      id: makeId('cal'),
      caseId: input.caseId ?? null,
      title: input.title.trim(),
      eventType: input.eventType,
      date: input.date,
      time: input.time ?? null,
      description: input.description?.trim() || undefined,
      responsible: input.responsible?.trim() || PRIMARY_LAWYER,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, calendar: [...this.state.calendar, event] },
      { kind: 'calendar-event-created', caseId: event.caseId, summary: 'Takvim kaydı eklendi', detail: `${event.title} (${event.date})` },
    );
    return event;
  }

  updateCalendarEvent(id: ID, patch: Partial<DemoCalendarEvent>): DemoCalendarEvent | undefined {
    const existing = this.state.calendar.find((e) => e.id === id);
    if (!existing) return undefined;
    const updated: DemoCalendarEvent = { ...existing, ...patch, id, updatedAt: nowISO() };
    this.commit(
      { ...this.state, calendar: this.state.calendar.map((e) => (e.id === id ? updated : e)) },
      { kind: 'calendar-event-updated', caseId: updated.caseId, summary: 'Takvim kaydı güncellendi', detail: updated.title },
    );
    return updated;
  }

  deleteCalendarEvent(id: ID): void {
    const existing = this.state.calendar.find((e) => e.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, calendar: this.state.calendar.filter((e) => e.id !== id) },
      { kind: 'calendar-event-deleted', caseId: existing.caseId, summary: 'Takvim kaydı silindi', detail: existing.title },
    );
  }

  /* ------------------------ research bookmarks -------------------- */

  saveResearchBookmark(input: Omit<DemoResearchBookmark, 'id' | 'createdAt'>): DemoResearchBookmark {
    const bookmark: DemoResearchBookmark = {
      ...input,
      id: makeId('bookmark'),
      createdAt: nowISO(),
    };
    this.commit(
      { ...this.state, researchBookmarks: [bookmark, ...this.state.researchBookmarks] },
      { kind: 'research-saved', caseId: bookmark.caseId, summary: 'Kaynak dosyaya kaydedildi', detail: bookmark.title },
    );
    return bookmark;
  }

  deleteResearchBookmark(id: ID): void {
    const existing = this.state.researchBookmarks.find((b) => b.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, researchBookmarks: this.state.researchBookmarks.filter((b) => b.id !== id) },
      { kind: 'research-saved', caseId: existing.caseId, summary: 'Kaydedilen kaynak kaldırıldı', detail: existing.title },
    );
  }

  /* ------------------------------- drafts ------------------------ */

  createDraft(input: Pick<DemoDraft, 'title' | 'draftType'> & Partial<DemoDraft>): DemoDraft {
    const body = input.body ?? '';
    const draft: DemoDraft = {
      id: makeId('draft'),
      caseId: input.caseId ?? null,
      title: input.title.trim(),
      draftType: input.draftType,
      body,
      status: input.status ?? 'taslak',
      version: 1,
      versions: [{ version: 1, timestamp: nowISO(), author: input.approvedBy ?? PRIMARY_LAWYER, body }],
      approvedAt: null,
      approvedBy: null,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, drafts: [draft, ...this.state.drafts] },
      { kind: 'draft-created', caseId: draft.caseId, summary: 'Taslak oluşturuldu', detail: draft.title },
    );
    return draft;
  }

  /** Save an edit. When the body changed, push a new version entry. */
  saveDraft(id: ID, patch: { title?: string; body?: string; author?: string }): DemoDraft | undefined {
    const existing = this.state.drafts.find((d) => d.id === id);
    if (!existing) return undefined;
    const nextBody = patch.body ?? existing.body;
    const bodyChanged = patch.body !== undefined && patch.body !== existing.body;
    const nextVersion = bodyChanged ? existing.version + 1 : existing.version;
    const versions: DraftVersion[] = bodyChanged
      ? [
          ...existing.versions,
          { version: nextVersion, timestamp: nowISO(), author: patch.author ?? PRIMARY_LAWYER, body: nextBody },
        ]
      : existing.versions;
    const updated: DemoDraft = {
      ...existing,
      title: patch.title?.trim() ?? existing.title,
      body: nextBody,
      version: nextVersion,
      versions,
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, drafts: this.state.drafts.map((d) => (d.id === id ? updated : d)) },
      {
        kind: 'draft-updated',
        caseId: updated.caseId,
        summary: bodyChanged ? `Taslak kaydedildi (v${nextVersion})` : 'Taslak güncellendi',
        detail: updated.title,
      },
    );
    return updated;
  }

  duplicateDraft(id: ID): DemoDraft | undefined {
    const existing = this.state.drafts.find((d) => d.id === id);
    if (!existing) return undefined;
    return this.createDraft({
      title: `${existing.title} (kopya)`,
      draftType: existing.draftType,
      caseId: existing.caseId,
      body: existing.body,
      status: 'taslak',
    });
  }

  /** Status workflow only. "onaylandi" must be an explicit lawyer action. */
  changeDraftStatus(id: ID, status: DemoDraft['status'], approver?: string): DemoDraft | undefined {
    const existing = this.state.drafts.find((d) => d.id === id);
    if (!existing) return undefined;
    const approved = status === 'onaylandi';
    const labels: Record<DemoDraft['status'], string> = {
      taslak: 'Taslak',
      incelemede: 'İncelemede',
      onaylandi: 'Onaylandı',
    };
    const updated: DemoDraft = {
      ...existing,
      status,
      approvedAt: approved ? nowISO() : null,
      approvedBy: approved ? approver ?? PRIMARY_LAWYER : null,
      updatedAt: nowISO(),
    };
    this.commit(
      { ...this.state, drafts: this.state.drafts.map((d) => (d.id === id ? updated : d)) },
      { kind: 'draft-status-changed', caseId: updated.caseId, summary: 'Taslak durumu değişti', detail: `${updated.title} → ${labels[status]}` },
    );
    return updated;
  }

  deleteDraft(id: ID): void {
    const existing = this.state.drafts.find((d) => d.id === id);
    if (!existing) return;
    this.commit(
      { ...this.state, drafts: this.state.drafts.filter((d) => d.id !== id) },
      { kind: 'draft-updated', caseId: existing.caseId, summary: 'Taslak silindi', detail: existing.title },
    );
  }
}

export const demoRepo = new DemoRepository();
export { DemoRepository };
/** Fresh, isolated instance — used by tests and never wired into the UI. */
export function createRepository(): DemoRepository {
  return new DemoRepository();
}
