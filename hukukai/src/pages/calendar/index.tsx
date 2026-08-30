import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { demoCalendarEvents } from "@/lib/demo-calendar";
import { CalendarMonth } from "./calendar-month";
import { CalendarAgenda } from "./calendar-agenda";

const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(null);
  };

  const monthEvents = useMemo(
    () => demoCalendarEvents.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }),
    [year, month]
  );

  const allEvents = demoCalendarEvents;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Takvim & Süreler"
        description="Duruşmalar, son süreler ve görev takibi."
      />

      {/* Desktop: month + agenda side by side */}
      <div className="hidden md:grid md:grid-cols-[1fr_340px] gap-4">
        {/* Left: Calendar month */}
        <div className="rounded-md border border-border bg-card">
          {/* Month controls */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">
                {MONTH_NAMES[month]} {year}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={goToday}
                className="rounded border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted"
              >
                Bugün
              </button>
              <button onClick={prevMonth} className="rounded p-1 hover:bg-muted" aria-label="Önceki ay">
                <ChevronLeft size={14} />
              </button>
              <button onClick={nextMonth} className="rounded p-1 hover:bg-muted" aria-label="Sonraki ay">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="p-3">
            <CalendarMonth
              year={year}
              month={month}
              events={monthEvents}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>

        {/* Right: Agenda */}
        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold">Ajanda</h2>
          </div>
          <div className="p-4">
            <CalendarAgenda events={allEvents} selectedDate={selectedDate} />
          </div>
        </div>
      </div>

      {/* Mobile: agenda view */}
      <div className="md:hidden">
        {/* Mobile month picker - compact */}
        <div className="mb-4 flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
          <button onClick={prevMonth} className="rounded p-1 hover:bg-muted" aria-label="Önceki ay">
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={goToday}
              className="rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted"
            >
              Bugün
            </button>
            <span className="text-sm font-semibold">
              {MONTH_NAMES[month]} {year}
            </span>
          </div>
          <button onClick={nextMonth} className="rounded p-1 hover:bg-muted" aria-label="Sonraki ay">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Mobile: full agenda */}
        <div className="rounded-md border border-border bg-card p-3">
          <CalendarAgenda events={allEvents} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
