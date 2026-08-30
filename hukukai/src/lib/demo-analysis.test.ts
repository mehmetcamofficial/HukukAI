import test from 'node:test';
import assert from 'node:assert/strict';

import { createSeedState, PRIMARY_CASE_ID } from './demo-repository/seed.ts';
import { createRepository } from './demo-repository/repository.ts';
import {
  buildCaseAnalysis,
  buildCounterpartyAnalysis,
  buildAssistantResponse,
  matchAssistantPrompt,
  SIMILAR_CASES,
} from './demo-analysis.ts';

test('analysis: buildCaseAnalysis derives missing evidence + deadlines from state', () => {
  const ws = createSeedState();
  const a = buildCaseAnalysis(PRIMARY_CASE_ID, ws, new Date('2026-08-30T12:00:00Z'));
  assert.ok(a.missingEvidence.length >= 1, 'seeded case has missing evidence');
  assert.ok(a.missingEvidence[0].claimId && a.missingEvidence[0].refId);
  assert.ok(a.upcomingDeadlines.length >= 1, 'seeded case has upcoming deadlines');
  assert.ok(a.nextActions.length >= 1);
});

test('analysis: counterparty output is deterministic (equal across calls)', () => {
  const ws = createSeedState();
  const a = buildCounterpartyAnalysis(PRIMARY_CASE_ID, ws);
  const b = buildCounterpartyAnalysis(PRIMARY_CASE_ID, ws);
  assert.deepEqual(a, b);
  assert.ok(a.risks.length >= 1);
  assert.ok(a.risks.every((r) => r.evidenceLabel && r.title));
});

test('analysis: similar cases carry outcome + similarity, labelled memory only', () => {
  assert.ok(SIMILAR_CASES.length >= 2);
  for (const s of SIMILAR_CASES) {
    assert.ok(s.similarity > 0 && s.similarity <= 1);
    assert.ok(typeof s.outcome === 'string' && s.outcome.length > 0);
  }
});

test('analysis: assistant response for missing-evidence lists seeded gaps', () => {
  const ws = createSeedState();
  const res = buildAssistantResponse('missing-evidence', PRIMARY_CASE_ID, ws);
  assert.match(res.heading, /eksik deliller/i);
  assert.ok(res.lines.some((l) => /Kartlı geçiş/i.test(l)));
});

test('analysis: assistant reflects live repo mutations (convert missing -> fewer gaps unaffected, deadlines update)', () => {
  const repo = createRepository();
  repo.createCalendarEvent({ title: 'Yakın Duruşma', eventType: 'durusma', date: '2026-09-01', caseId: PRIMARY_CASE_ID });
  const res = buildAssistantResponse('upcoming-deadlines', PRIMARY_CASE_ID, repo.getSnapshot());
  assert.ok(res.lines.some((l) => /Yakın Duruşma/.test(l)));
});

test('analysis: matchAssistantPrompt maps free text to prompt keys', () => {
  assert.equal(matchAssistantPrompt('bu dosyadaki eksik delilleri göster'), 'missing-evidence');
  assert.equal(matchAssistantPrompt('yaklaşan süreleri özetle'), 'upcoming-deadlines');
  assert.equal(matchAssistantPrompt('emsal kararlarla çelişen noktalar'), 'precedent-conflicts');
  assert.equal(matchAssistantPrompt('bilirkişi raporuna itiraz başlıkları'), 'objection-headings');
  assert.equal(matchAssistantPrompt('bugün hava nasıl'), null);
});
