/**
 * Pure-logic tests for the demo persistence layer.
 *
 * Runner: Node's built-in test runner with native TS support — no extra deps.
 *   node --test src/lib/demo-repository/
 *
 * These exercise the repository in-memory (no `window`/localStorage in Node,
 * so it transparently falls back to the seeded state).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createSeedState, PRIMARY_CASE_ID } from './seed.ts';
import { loadState } from './storage.ts';
import { createRepository } from './repository.ts';
import { getDeadlineInfo, byDeadlineUrgency } from './deadline.ts';

const REF = new Date('2026-08-30T12:00:00.000Z');

test('seed: deterministic, independent copies, contains the primary case', () => {
  const a = createSeedState();
  const b = createSeedState();
  assert.deepEqual(a, b);
  assert.notEqual(a, b);
  assert.notEqual(a.cases, b.cases);
  assert.ok(a.cases.find((c) => c.id === PRIMARY_CASE_ID));
  assert.equal(a.meta.version, 1);
});

test('storage: loadState returns a valid workspace shape', () => {
  const s = loadState();
  for (const key of ['cases', 'tasks', 'notes', 'documents', 'timeline', 'evidence', 'calendar', 'researchBookmarks', 'drafts', 'activities'] as const) {
    assert.ok(Array.isArray(s[key]), `${key} should be an array`);
  }
});

test('repository: initialises from the seed snapshot', () => {
  const repo = createRepository();
  const snap = repo.getSnapshot();
  assert.equal(snap.cases.length, createSeedState().cases.length);
});

test('repository: createCase adds a case and logs an activity', () => {
  const repo = createRepository();
  const before = repo.getSnapshot().cases.length;
  const created = repo.createCase({ title: 'Kira Tespiti', caseType: 'kira', clientName: 'Test Müvekkil' });
  const after = repo.getSnapshot();
  assert.equal(after.cases.length, before + 1);
  assert.equal(after.cases[0].id, created.id);
  assert.equal(after.cases[0].status, 'active');
  assert.equal(after.activities[0].kind, 'case-created');
  assert.equal(after.activities[0].caseId, created.id);
});

test('repository: createCaseWithNewClient links a fresh client', () => {
  const repo = createRepository();
  const { case: c, client } = repo.createCaseWithNewClient(
    { title: 'Ticari Alacak', caseType: 'ticaret' },
    { name: 'Yeni Ltd. Şti.', type: 'corporate' },
  );
  assert.equal(c.clientId, client.id);
  assert.equal(c.clientName, 'Yeni Ltd. Şti.');
  assert.ok(repo.getSnapshot().clients.find((x) => x.id === client.id));
});

test('repository: task complete/reopen manages completedAt and activity', () => {
  const repo = createRepository();
  const task = repo.createTask({ title: 'Bordro karşılaştırması', caseId: PRIMARY_CASE_ID });
  assert.equal(task.status, 'open');
  assert.equal(task.completedAt, null);

  const done = repo.completeTask(task.id);
  assert.equal(done?.status, 'done');
  assert.ok(done?.completedAt);
  assert.equal(repo.getSnapshot().activities[0].kind, 'task-completed');

  const reopened = repo.reopenTask(task.id);
  assert.equal(reopened?.status, 'open');
  assert.equal(reopened?.completedAt, null);
  assert.equal(repo.getSnapshot().activities[0].kind, 'task-reopened');
});

test('repository: convertMissingEvidenceToTask creates a linked case task', () => {
  const repo = createRepository();
  const claim = repo.getSnapshot().evidence[0];
  const missingRef = claim.missing[0];
  const task = repo.convertMissingEvidenceToTask(claim.id, missingRef.id);
  assert.ok(task);
  assert.equal(task?.caseId, claim.caseId);
  assert.equal(task?.origin, 'missing-evidence');
  assert.match(task?.title ?? '', new RegExp(missingRef.label.slice(0, 6)));
});

test('repository: saveResearchBookmark appends and logs research-saved', () => {
  const repo = createRepository();
  const before = repo.getSnapshot().researchBookmarks.length;
  const bm = repo.saveResearchBookmark({
    caseId: PRIMARY_CASE_ID,
    sourceKind: 'precedent',
    sourceId: 'prec-v003',
    title: 'Yargıtay 9. HD — fazla çalışma ispatı',
    relation: 'destekleyen',
    verificationStatus: 'DOĞRULANDI',
  });
  const snap = repo.getSnapshot();
  assert.equal(snap.researchBookmarks.length, before + 1);
  assert.equal(snap.researchBookmarks[0].id, bm.id);
  assert.equal(snap.activities[0].kind, 'research-saved');
  assert.equal(snap.researchBookmarks[0].verificationStatus, 'DOĞRULANDI');
});

test('repository: draft version increments only when the body changes', () => {
  const repo = createRepository();
  const draft = repo.createDraft({ title: 'Cevap Dilekçesi', draftType: 'cevap-dilekcesi', body: 'ilk hali' });
  assert.equal(draft.version, 1);
  assert.equal(draft.versions.length, 1);

  const titleOnly = repo.saveDraft(draft.id, { title: 'Cevap Dilekçesi (nihai)' });
  assert.equal(titleOnly?.version, 1);
  assert.equal(titleOnly?.versions.length, 1);

  const edited = repo.saveDraft(draft.id, { body: 'genişletilmiş hali' });
  assert.equal(edited?.version, 2);
  assert.equal(edited?.versions.length, 2);
  assert.equal(edited?.versions[1].version, 2);
});

test('repository: draft approval is explicit and stamps approver', () => {
  const repo = createRepository();
  const draft = repo.createDraft({ title: 'Beyan', draftType: 'beyan', body: 'x' });
  const review = repo.changeDraftStatus(draft.id, 'incelemede');
  assert.equal(review?.status, 'incelemede');
  assert.equal(review?.approvedAt, null);

  const approved = repo.changeDraftStatus(draft.id, 'onaylandi', 'Av. Behçet Alp');
  assert.equal(approved?.status, 'onaylandi');
  assert.ok(approved?.approvedAt);
  assert.equal(approved?.approvedBy, 'Av. Behçet Alp');
});

test('repository: changeCaseStatus clears outcome unless closed', () => {
  const repo = createRepository();
  const closed = repo.changeCaseStatus(PRIMARY_CASE_ID, 'closed', 'kismen-kabul');
  assert.equal(closed?.status, 'closed');
  assert.equal(closed?.outcome, 'kismen-kabul');

  const reactivated = repo.changeCaseStatus(PRIMARY_CASE_ID, 'active');
  assert.equal(reactivated?.outcome, null);
  assert.equal(repo.getSnapshot().activities[0].kind, 'case-status-changed');
});

test('repository: resetToSeed restores the seeded dataset', () => {
  const repo = createRepository();
  repo.createCase({ title: 'Silinecek', caseType: 'diger', clientName: 'x' });
  repo.deleteCase(repo.getSnapshot().cases.find((c) => c.title === 'Silinecek')!.id);
  repo.resetToSeed();
  const snap = repo.getSnapshot();
  assert.equal(snap.cases.length, createSeedState().cases.length);
  assert.ok(snap.cases.find((c) => c.id === PRIMARY_CASE_ID));
  assert.equal(snap.activities[0].kind, 'demo-reset');
});

test('deadline: classifies overdue / today / tomorrow / soon / upcoming', () => {
  assert.equal(getDeadlineInfo('2026-08-20', REF).status, 'overdue');
  assert.equal(getDeadlineInfo('2026-08-20', REF).tone, 'danger');
  assert.equal(getDeadlineInfo('2026-08-30', REF).status, 'today');
  assert.equal(getDeadlineInfo('2026-08-30', REF).tone, 'warning');
  assert.equal(getDeadlineInfo('2026-08-31', REF).status, 'tomorrow');
  assert.equal(getDeadlineInfo('2026-09-05', REF).status, 'soon');
  assert.equal(getDeadlineInfo('2026-09-05', REF).tone, 'warning');
  assert.equal(getDeadlineInfo('2026-10-15', REF).status, 'upcoming');
  assert.equal(getDeadlineInfo(null, REF).status, 'none');
  assert.equal(getDeadlineInfo('2026-09-02', REF).daysLeft, 3);
});

test('deadline: byDeadlineUrgency sorts soonest first, undated last', () => {
  const dates = ['2026-09-10', null, '2026-08-01', '2026-09-02'];
  const sorted = [...dates].sort(byDeadlineUrgency);
  assert.deepEqual(sorted, ['2026-08-01', '2026-09-02', '2026-09-10', null]);
});

/* ----------------------- P5–P9 continuation coverage ---------------------- */

test('repository: calendar event create / update / delete + case binding', () => {
  const repo = createRepository();
  const before = repo.getSnapshot().calendar.length;
  const e = repo.createCalendarEvent({ title: 'Duruşma', eventType: 'durusma', date: '2026-09-20', caseId: PRIMARY_CASE_ID });
  assert.equal(repo.getSnapshot().calendar.length, before + 1);
  assert.equal(e.caseId, PRIMARY_CASE_ID);
  assert.equal(repo.getSnapshot().activities[0].kind, 'calendar-event-created');

  const upd = repo.updateCalendarEvent(e.id, { time: '10:30' });
  assert.equal(upd?.time, '10:30');
  assert.equal(repo.getSnapshot().activities[0].kind, 'calendar-event-updated');

  repo.deleteCalendarEvent(e.id);
  assert.equal(repo.getSnapshot().calendar.length, before);
  assert.equal(repo.getSnapshot().activities[0].kind, 'calendar-event-deleted');
});

test('repository: timeline event mutation lifecycle', () => {
  const repo = createRepository();
  const before = repo.getSnapshot().timeline.length;
  const ev = repo.createTimelineEvent({ caseId: PRIMARY_CASE_ID, date: '2026-07-01', title: 'Dilekçe verildi', eventType: 'islem' });
  assert.equal(repo.getSnapshot().timeline.length, before + 1);
  const upd = repo.updateTimelineEvent(ev.id, { title: 'Dilekçe verildi (revize)' });
  assert.equal(upd?.title, 'Dilekçe verildi (revize)');
  repo.deleteTimelineEvent(ev.id);
  assert.equal(repo.getSnapshot().timeline.length, before);
});

test('repository: document create stores metadata only + update + delete', () => {
  const repo = createRepository();
  const doc = repo.createDocument({ name: 'Yeni Dilekçe', docType: 'dilekce', caseId: PRIMARY_CASE_ID, fileName: 'dilekce.pdf' });
  assert.equal(doc.fileName, 'dilekce.pdf');
  assert.equal(doc.verificationStatus, 'DEMO — YALNIZCA ÜST VERİ');
  assert.ok(!('fileBytes' in doc));
  const upd = repo.updateDocument(doc.id, { source: 'Müvekkil' });
  assert.equal(upd?.source, 'Müvekkil');
  repo.deleteDocument(doc.id);
  assert.equal(repo.getSnapshot().documents.find((d) => d.id === doc.id), undefined);
});

test('repository: evidence relation update replaces supporting refs', () => {
  const repo = createRepository();
  const claim = repo.getSnapshot().evidence[0];
  const updated = repo.updateEvidenceClaim(claim.id, {
    supporting: [{ id: 'r-new', label: 'Yeni destekleyen delil', documentId: null }],
    status: 'hazir',
  });
  assert.equal(updated?.supporting.length, 1);
  assert.equal(updated?.supporting[0].label, 'Yeni destekleyen delil');
  assert.equal(updated?.status, 'hazir');
  assert.equal(repo.getSnapshot().activities[0].kind, 'evidence-updated');
});

test('repository: research bookmark keeps verification verbatim; note edit never upgrades it', () => {
  const repo = createRepository();
  const bm = repo.saveResearchBookmark({
    caseId: PRIMARY_CASE_ID,
    sourceKind: 'precedent',
    sourceId: 'prec-v006',
    title: 'Yargıtay 9. HD — zamanaşımı',
    relation: 'karsi',
    verificationStatus: 'DOĞRULANDI',
  });
  assert.equal(bm.verificationStatus, 'DOĞRULANDI');
  const edited = repo.updateResearchBookmarkNote(bm.id, 'Islah ile ileri sürülebilir.');
  assert.equal(edited?.note, 'Islah ile ileri sürülebilir.');
  assert.equal(edited?.verificationStatus, 'DOĞRULANDI'); // unchanged
});

test('repository: draft duplicate copies body + resets status to taslak', () => {
  const repo = createRepository();
  const original = repo.createDraft({ title: 'İstinaf', draftType: 'istinaf', body: 'gövde' });
  repo.changeDraftStatus(original.id, 'incelemede');
  const dup = repo.duplicateDraft(original.id);
  assert.equal(dup?.body, 'gövde');
  assert.equal(dup?.status, 'taslak');
  assert.equal(dup?.version, 1);
  assert.match(dup?.title ?? '', /kopya/);
});

test('repository: reset restores seed even after P5–P9 mutations', () => {
  const repo = createRepository();
  repo.createCalendarEvent({ title: 'x', eventType: 'durusma', date: '2026-10-01' });
  repo.createTimelineEvent({ caseId: PRIMARY_CASE_ID, date: '2026-10-01', title: 'x', eventType: 'islem' });
  repo.createDocument({ name: 'x', docType: 'diger', caseId: PRIMARY_CASE_ID, fileName: 'x.pdf' });
  repo.createEvidenceClaim({ caseId: PRIMARY_CASE_ID, title: 'x' });
  repo.createDraft({ title: 'x', draftType: 'diger' });
  repo.resetToSeed();
  const seed = createSeedState();
  const snap = repo.getSnapshot();
  assert.equal(snap.calendar.length, seed.calendar.length);
  assert.equal(snap.timeline.length, seed.timeline.length);
  assert.equal(snap.documents.length, seed.documents.length);
  assert.equal(snap.evidence.length, seed.evidence.length);
  assert.equal(snap.drafts.length, seed.drafts.length);
  assert.equal(snap.activities[0].kind, 'demo-reset');
});
