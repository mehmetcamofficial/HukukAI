/**
 * Global workspace search — plain indexed text search (NOT semantic).
 *
 * Builds a flat list of hits from the demo workspace plus the verified static
 * legal sources, then filters by AND-matching normalised query tokens.
 */

import type { WorkspaceState } from '@/lib/demo-repository';
import {
  caseStatusLabels,
  caseTypeLabels,
  documentTypeLabels,
  draftStatusLabels,
  taskStatusLabels,
} from '@/lib/demo-repository';
import { verifiedLegislation, verifiedPrecedents } from '@/lib/legal-sources';

export type SearchGroup =
  | 'DAVALAR'
  | 'MÜVEKKİLLER'
  | 'BELGELER'
  | 'GÖREVLER'
  | 'KRONOLOJİ'
  | 'DELİLLER'
  | 'EMSAL KARARLAR'
  | 'MEVZUAT'
  | 'TASLAKLAR';

export const SEARCH_GROUP_ORDER: SearchGroup[] = [
  'DAVALAR',
  'MÜVEKKİLLER',
  'GÖREVLER',
  'BELGELER',
  'KRONOLOJİ',
  'DELİLLER',
  'TASLAKLAR',
  'EMSAL KARARLAR',
  'MEVZUAT',
];

export interface SearchHit {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
}

/** Lowercase (tr) + fold Turkish diacritics so "iscilik" matches "İşçilik". */
export function normalize(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/â/g, 'a')
    .trim();
}

export function buildSearchHits(ws: WorkspaceState): SearchHit[] {
  const hits: SearchHit[] = [];
  const caseHref = (id: string | null | undefined) => (id ? `/davalar/${id}` : '/davalar');
  const caseLabel = (id: string | null | undefined) => {
    const c = ws.cases.find((x) => x.id === id);
    return c ? `${c.caseNumber ?? ''} ${c.title}`.trim() : '';
  };

  for (const c of ws.cases) {
    hits.push({
      id: `case-${c.id}`,
      group: 'DAVALAR',
      title: `${c.caseNumber ? `${c.caseNumber} · ` : ''}${c.title}`,
      subtitle: `${c.clientName} — ${caseStatusLabels[c.status]} · ${caseTypeLabels[c.caseType]}`,
      href: `/davalar/${c.id}`,
      keywords: normalize([c.title, c.caseNumber, c.court, c.clientName, c.opposingParty, c.summary, caseTypeLabels[c.caseType]].filter(Boolean).join(' ')),
    });
  }

  for (const cl of ws.clients) {
    const related = ws.cases.filter((c) => c.clientId === cl.id).length;
    hits.push({
      id: `client-${cl.id}`,
      group: 'MÜVEKKİLLER',
      title: cl.name,
      subtitle: `${cl.type === 'individual' ? 'Gerçek Kişi' : 'Tüzel Kişi'}${related ? ` · ${related} dosya` : ''}`,
      href: `/muvekkiller?q=${encodeURIComponent(cl.name)}`,
      keywords: normalize([cl.name, cl.email, cl.phone, cl.note].filter(Boolean).join(' ')),
    });
  }

  for (const t of ws.tasks) {
    hits.push({
      id: `task-${t.id}`,
      group: 'GÖREVLER',
      title: t.title,
      subtitle: `${taskStatusLabels[t.status]}${t.caseId ? ` · ${caseLabel(t.caseId)}` : ''}`,
      href: `/gorevler?q=${encodeURIComponent(t.title)}`,
      keywords: normalize([t.title, t.description, t.assignedTo, caseLabel(t.caseId)].filter(Boolean).join(' ')),
    });
  }

  for (const d of ws.documents) {
    hits.push({
      id: `doc-${d.id}`,
      group: 'BELGELER',
      title: d.name,
      subtitle: `${documentTypeLabels[d.docType]}${d.caseId ? ` · ${caseLabel(d.caseId)}` : ''}`,
      href: d.caseId ? `${caseHref(d.caseId)}?tab=documents` : '/belgeler',
      keywords: normalize([d.name, d.fileName, documentTypeLabels[d.docType], d.source, d.description, d.verificationStatus].filter(Boolean).join(' ')),
    });
  }

  for (const e of ws.timeline) {
    hits.push({
      id: `timeline-${e.id}`,
      group: 'KRONOLOJİ',
      title: e.title,
      subtitle: `${e.date} · ${caseLabel(e.caseId)}`,
      href: `${caseHref(e.caseId)}?tab=timeline`,
      keywords: normalize([e.title, e.description, e.date, caseLabel(e.caseId)].filter(Boolean).join(' ')),
    });
  }

  for (const ev of ws.evidence) {
    hits.push({
      id: `evidence-${ev.id}`,
      group: 'DELİLLER',
      title: ev.title,
      subtitle: `${caseLabel(ev.caseId)}${ev.legalIssue ? ` · ${ev.legalIssue}` : ''}`,
      href: `${caseHref(ev.caseId)}?tab=evidence`,
      keywords: normalize(
        [ev.title, ev.legalIssue, ev.lawyerAssessment, ...ev.supporting.map((r) => r.label), ...ev.opposing.map((r) => r.label), ...ev.missing.map((r) => r.label)]
          .filter(Boolean)
          .join(' '),
      ),
    });
  }

  for (const dr of ws.drafts) {
    hits.push({
      id: `draft-${dr.id}`,
      group: 'TASLAKLAR',
      title: dr.title,
      subtitle: `${draftStatusLabels[dr.status]}${dr.caseId ? ` · ${caseLabel(dr.caseId)}` : ''}`,
      href: `/dilekceler?q=${encodeURIComponent(dr.title)}`,
      keywords: normalize([dr.title, dr.body.slice(0, 400), caseLabel(dr.caseId)].filter(Boolean).join(' ')),
    });
  }

  for (const p of verifiedPrecedents) {
    hits.push({
      id: `prec-${p.id}`,
      group: 'EMSAL KARARLAR',
      title: `${p.chamber} — ${p.legalTopic}`,
      subtitle: `${p.caseNumber} / ${p.decisionNumber} · ${p.decisionDate} · ${p.verificationStatus}`,
      href: `/emsal-kararlar?q=${encodeURIComponent(p.caseNumber)}`,
      keywords: normalize([p.court, p.chamber, p.caseNumber, p.decisionNumber, p.legalTopic, p.summary].join(' ')),
    });
  }

  for (const l of verifiedLegislation) {
    hits.push({
      id: `leg-${l.id}`,
      group: 'MEVZUAT',
      title: `${l.lawNumber} sayılı ${l.lawName} — m.${l.articleNumber}`,
      subtitle: `${l.articleTitle} · ${l.verificationStatus}`,
      href: `/mevzuat?q=${encodeURIComponent(l.articleNumber)}`,
      keywords: normalize([l.lawNumber, l.lawName, l.articleNumber, l.articleTitle, l.articleText].join(' ')),
    });
  }

  return hits;
}

export function filterHits(hits: SearchHit[], query: string, perGroup = 6): SearchHit[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const matched = hits.filter((h) => {
    const haystack = `${normalize(h.title)} ${normalize(h.subtitle ?? '')} ${h.keywords}`;
    return tokens.every((tok) => haystack.includes(tok));
  });
  const counts = new Map<SearchGroup, number>();
  const capped: SearchHit[] = [];
  for (const group of SEARCH_GROUP_ORDER) {
    for (const h of matched.filter((m) => m.group === group)) {
      const n = counts.get(group) ?? 0;
      if (n >= perGroup) break;
      counts.set(group, n + 1);
      capped.push(h);
    }
  }
  return capped;
}
