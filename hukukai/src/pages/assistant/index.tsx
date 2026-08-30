import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { useWorkspace } from '@/lib/demo-repository';
import {
  ASSISTANT_PROMPTS,
  buildAssistantResponse,
  matchAssistantPrompt,
  type AssistantPromptKey,
} from '@/lib/demo-analysis';

interface Turn {
  id: string;
  question: string;
  heading: string;
  lines: string[];
}

export function AssistantPage() {
  const ws = useWorkspace();
  const openCases = useMemo(() => ws.cases.filter((c) => c.status !== 'closed'), [ws.cases]);
  const [caseId, setCaseId] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState('');
  const [notice, setNotice] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caseId) setCaseId(openCases[0]?.id ?? ws.cases[0]?.id ?? '');
  }, [caseId, openCases, ws.cases]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  const run = (key: AssistantPromptKey, question: string) => {
    if (!caseId) {
      setNotice('Önce bir dosya seçin.');
      return;
    }
    setNotice('');
    const res = buildAssistantResponse(key, caseId, ws);
    setTurns((t) => [
      ...t,
      { id: `turn-${Date.now().toString(36)}-${t.length}`, question, heading: res.heading, lines: res.lines },
    ]);
  };

  const submitFree = (e: React.FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    if (q.length < 3) return;
    const key = matchAssistantPrompt(q);
    if (!key) {
      setTurns((t) => [
        ...t,
        {
          id: `turn-${Date.now().toString(36)}-${t.length}`,
          question: q,
          heading: 'Yanıt üretilemedi',
          lines: [
            'Bu demo asistan yalnızca belirli dosya sorularını deterministik olarak yanıtlar.',
            'Önerilen sorulardan birini seçin: eksik deliller, yaklaşan süreler, emsal çelişkileri, itiraz başlıkları.',
          ],
        },
      ]);
      setText('');
      return;
    }
    run(key, q);
    setText('');
  };

  const selectedCase = ws.cases.find((c) => c.id === caseId);

  return (
    <div className="mx-auto flex h-[calc(100dvh-120px)] max-w-[1000px] flex-col">
      <PageHeader title="Hukuki Asistan" description="Dosya bağlamında çalışan deterministik demo asistan.">
        <StatusBadge tone="warning">DEMO YANIT</StatusBadge>
      </PageHeader>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-xs">
          <span className="font-medium text-muted-foreground">Dosya:</span>
          <select
            value={caseId}
            onChange={(e) => { setCaseId(e.target.value); setTurns([]); }}
            data-testid="select-assistant-case"
            className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
          >
            {ws.cases.map((c) => (
              <option key={c.id} value={c.id}>{c.caseNumber ? `${c.caseNumber} · ` : ''}{c.title}</option>
            ))}
          </select>
        </label>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
          <ShieldCheck size={12} /> Ağ üzerinden model çağrılmaz. Yanıtlar dosya verisinden üretilir.
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto rounded-md border border-border bg-card p-4">
        {turns.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <Bot size={28} className="text-muted-foreground" />
            <p className="text-sm font-medium">{selectedCase ? `${selectedCase.title} için bir soru seçin` : 'Bir dosya seçin'}</p>
            <div className="grid w-full max-w-md gap-2">
              {ASSISTANT_PROMPTS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => run(p.key, p.label)}
                  data-testid={`assistant-prompt-${p.key}`}
                  className="rounded-md border border-border bg-background px-3 py-2 text-left text-xs font-medium hover:bg-muted"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          turns.map((t) => (
            <div key={t.id} className="space-y-2">
              <div className="ml-auto max-w-[80%] rounded-md rounded-br-none bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
                {t.question}
              </div>
              <div className="max-w-[90%] rounded-md rounded-bl-none border border-border bg-background px-3 py-2.5">
                <div className="mb-1.5 flex items-center gap-2">
                  <Bot size={13} className="text-muted-foreground" />
                  <span className="text-[11px] font-semibold">{t.heading}</span>
                  <StatusBadge tone="warning">DEMO YANIT</StatusBadge>
                </div>
                <ul className="space-y-1 text-[12px] leading-5 text-muted-foreground">
                  {t.lines.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {notice && <p className="mt-2 text-[11px] text-red-600" role="alert">{notice}</p>}

      <div className="mt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {ASSISTANT_PROMPTS.map((p) => (
            <button
              key={p.key}
              onClick={() => run(p.key, p.label)}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted"
            >
              {p.label}
            </button>
          ))}
        </div>
        <form onSubmit={submitFree} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-testid="input-assistant"
            placeholder="Dosyaya ilişkin bir soru yazın…"
            className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <button type="submit" disabled={text.trim().length < 3} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
            <Send size={14} /> Sor
          </button>
        </form>
      </div>
    </div>
  );
}
