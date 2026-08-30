import { useMemo } from "react";
import { CalendarEventRow } from "./calendar-event-row";
import type { CalendarEvent } from "@/lib/demo-calendar";

type Props = {
  events: CalendarEvent[];
  selectedDate: string | null;
};

function isSameDay(a: string, b: string): boolean {
  return a === b;
}

function isWeekOf(dateStr: string, refDate: Date): boolean {
  const d = new Date(dateStr);
  const startOfWeek = new Date(refDate);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7)); // Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  return d >= startOfWeek && d <= endOfWeek;
}

const sectionDateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

export function CalendarAgenda({ events, selectedDate }: Props) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const sections = useMemo(() => {
    const upcoming = events
      .filter((e) => e.status !== "completed" && e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (selectedDate) {
      const dayEvents = events.filter((e) => isSameDay(e.date, selectedDate));
      if (dayEvents.length > 0) {
        return [
          {
            label: sectionDateFormatter.format(new Date(selectedDate)),
            events: dayEvents,
          },
        ];
      }
      return [];
    }

    const todayEvents = upcoming.filter((e) => isSameDay(e.date, todayStr));
    const weekEvents = upcoming.filter(
      (e) => !isSameDay(e.date, todayStr) && isWeekOf(e.date, today)
    );
    const laterEvents = upcoming.filter(
      (e) => !isSameDay(e.date, todayStr) && !isWeekOf(e.date, today)
    );

    const result: { label: string; events: CalendarEvent[] }[] = [];
    if (todayEvents.length > 0) result.push({ label: "Bugün", events: todayEvents });
    if (weekEvents.length > 0) result.push({ label: "Bu Hafta", events: weekEvents });
    if (laterEvents.length > 0) result.push({ label: "Yaklaşan", events: laterEvents });

    // If nothing upcoming, show completed
    if (result.length === 0) {
      const completed = events
        .filter((e) => e.status === "completed")
        .sort((a, b) => b.date.localeCompare(a.date));
      if (completed.length > 0) result.push({ label: "Tamamlanan", events: completed });
    }

    return result;
  }, [events, selectedDate, todayStr]);

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">Bu tarihte etkinlik yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.label}>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.label}
          </h3>
          <div className="space-y-1.5">
            {section.events.map((ev) => (
              <CalendarEventRow key={ev.id} event={ev} compact />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
