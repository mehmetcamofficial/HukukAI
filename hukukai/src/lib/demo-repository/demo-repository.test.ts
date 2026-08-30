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
