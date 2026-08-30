import { useMemo } from "react";
import type { CalendarEvent } from "@/lib/demo-calendar";

type Props = {
  year: number;
  month: number; // 0-indexed
  events: CalendarEvent[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function getDaysInMonth(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert Sunday=0 to Monday-based (Mon=0, Sun=6)
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CalendarMonth({ year, month, events, selectedDate, onSelectDate }: Props) {
  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const existing = map.get(ev.date);
      if (existing) existing.push(ev);
      else map.set(ev.date, [ev]);
    }
    return map;
  }, [events]);

  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="select-none">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="min-h-[72px] bg-muted/20" />;
          const dk = dateKey(year, month, day);
          const dayEvents = eventsByDate.get(dk) ?? [];
          const isToday = dk === todayKey;
          const isSelected = dk === selectedDate;

          return (
            <button
              key={dk}
              onClick={() => onSelectDate(dk)}
              className={`group relative min-h-[72px] border border-border p-1 text-left transition-colors hover:bg-muted/50 ${
                isSelected ? "bg-primary/5 border-primary/30" : ""
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {day}
              </span>
              {dayEvents.length > 0 && (
                <div className="mt-0.5 space-y-px">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className={`truncate rounded px-1 py-px text-[9px] font-medium leading-tight ${
                        ev.type === "Duruşma"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                          : ev.type === "Son_süre"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          : ev.type === "Bilirkişi"
                          ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
                          : ev.type === "Arabuluculuk"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                          : ev.type === "Müvekkil_görüşmesi"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="block text-[8px] text-muted-foreground/60">+{dayEvents.length - 2}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
