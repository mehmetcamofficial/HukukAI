import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { CalendarEventDialog } from '@/components/dialogs/calendar-event-dialog';
import {
  byDeadlineUrgency,
  calendarEventTypeLabels,
  getDeadlineInfo,
  useWorkspace,
  type CalendarEventType,
  type DemoCalendarEvent,
} from '@/lib/demo-repository';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];
const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const typeChip: Record<CalendarEventType, string> = {
  durusma: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'son-sure': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  bilirkisi: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  arabuluculuk: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'muvekkil-gorusmesi': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'ic-gorev': 'bg-muted text-muted-foreground',
};

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function monthCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export function CalendarPage() {
  const ws = useWorkspace();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; eventId: string | null; presetDate: string | null }>({
    open: false,
    eventId: null,
    presetDate: null,
  });

  const prevMonth = () => (month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1));
  const nextMonth = () => (month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1));
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDate(null); };

  const cells = useMemo(() => monthCells(year, month), [year, month]);
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DemoCalendarEvent[]>();
    for (const e of ws.calendar) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [ws.calendar]);

  const agenda = useMemo(() => {
    const base = selectedDate
      ? ws.calendar.filter((e) => e.date === selectedDate)
      : ws.calendar.filter((e) => {
          const d = getDeadlineInfo(e.date, today);
          return d.status === 'overdue' || (d.daysLeft ?? Infinity) <= 45;
        });
    return [...base].sort((a, b) => byDeadlineUrgency(a.date, b.date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.calendar, selectedDate]);

  const caseNumber = (id?: string | null) => ws.cases.find((c) => c.id === id)?.caseNumber;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Takvim & Süreler"
        description="Duruşmalar, son süreler ve dosya işleri — tek kaynaktan (demo çalışma alanı)."
        action={
          <button
            onClick={() => setDialog({ open: true, eventId: null, presetDate: selectedDate })}
            data-testid="button-new-calendar-event"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} /> Kayıt Ekle
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-[1fr_340px]">
        {/* Month grid */}
        <div className="rounded-md border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold">{MONTH_NAMES[month]} {year}</h2>
            <div className="flex items-center gap-1">
              <button onClick={goToday} className="rounded border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted">Bugün</button>
              <button onClick={prevMonth} className="rounded p-1 hover:bg-muted" aria-label="Önceki ay"><ChevronLeft size={14} /></button>
              <button onClick={nextMonth} className="rounded p-1 hover:bg-muted" aria-label="Sonraki ay"><ChevronRight size={14} /></button>
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-7 gap-px">
              {WEEKDAYS.map((wd) => (
                <div key={wd} className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{wd}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {cells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="min-h-[68px] bg-muted/20" />;
                const dk = dateKey(year, month, day);
                const dayEvents = eventsByDate.get(dk) ?? [];
                const isToday = dk === todayKey;
                const isSelected = dk === selectedDate;
                return (
                  <button
                    key={dk}
                    onClick={() => setSelectedDate(isSelected ? null : dk)}
                    className={`group relative min-h-[68px] border border-border p-1 text-left transition-colors hover:bg-muted/50 ${isSelected ? 'border-primary/40 bg-primary/5' : ''}`}
                  >
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="mt-0.5 space-y-px">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div key={e.id} className={`truncate rounded px-1 py-px text-[9px] font-medium leading-tight ${typeChip[e.eventType]}`}>{e.title}</div>
                        ))}
                        {dayEvents.length > 2 && <span className="block text-[8px] text-muted-foreground/60">+{dayEvents.length - 2}</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Agenda */}
        <div className="rounded-md border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold">{selectedDate ? 'Seçili gün' : 'Yaklaşan & Geciken'}</h2>
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className="text-[11px] text-primary hover:underline">Tümü</button>
            )}
          </div>
          <div className="max-h-[560px] space-y-2 overflow-y-auto p-3">
            {agenda.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">Kayıt yok.</p>
            ) : (
              agenda.map((e) => {
                const d = getDeadlineInfo(e.date, today);
                return (
                  <button
                    key={e.id}
                    onClick={() => setDialog({ open: true, eventId: e.id, presetDate: null })}
                    data-testid={`calendar-event-${e.id}`}
                    className="block w-full rounded-md border border-border bg-card p-2.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeChip[e.eventType]}`}>{calendarEventTypeLabels[e.eventType]}</span>
                      {(d.status === 'overdue' || d.status === 'today') && (
                        <StatusBadge tone={d.tone}>{d.label}</StatusBadge>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium leading-tight">{e.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span>{new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' }).format(new Date(e.date))}{e.time ? ` · ${e.time}` : ''}</span>
                      {d.status !== 'overdue' && d.status !== 'today' && <span className="text-muted-foreground/70">{d.label}</span>}
                      {e.caseId && caseNumber(e.caseId) && (
                        <Link href={`/davalar/${e.caseId}`} onClick={(ev) => ev.stopPropagation()} className="hover:text-foreground hover:underline">
                          {caseNumber(e.caseId)}
                        </Link>
                      )}
                      {e.responsible && <span className="text-muted-foreground/70">{e.responsible}</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <CalendarEventDialog
        open={dialog.open}
        onOpenChange={(o) => setDialog((s) => ({ ...s, open: o }))}
        eventId={dialog.eventId}
      />
    </div>
  );
}
