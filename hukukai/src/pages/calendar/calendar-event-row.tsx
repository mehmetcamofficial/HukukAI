import { Link } from "wouter";
import { CalendarDays, Clock3, Gavel, FileText, Users, Briefcase } from "lucide-react";
import type { CalendarEvent, CalendarEventType } from "@/lib/demo-calendar";
import { getTeamMember } from "@/lib/demo-team";

const typeConfig: Record<CalendarEventType, { label: string; icon: typeof CalendarDays; color: string }> = {
  Duruşma: { label: "Duruşma", icon: Gavel, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  Son_süre: { label: "Son Süre", icon: Clock3, color: "text-red-600 bg-red-50 dark:bg-red-950/30" },
  Arabuluculuk: { label: "Arabuluculuk", icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  Bilirkişi: { label: "Bilirkişi", icon: FileText, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30" },
  Müvekkil_görüşmesi: { label: "Görüşme", icon: Briefcase, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
  İç_görev: { label: "İç Görev", icon: CalendarDays, color: "text-muted-foreground bg-muted" },
};

function priorityDot(priority: CalendarEvent["priority"]): string {
  if (priority === "high") return "bg-red-500";
  if (priority === "medium") return "bg-amber-500";
  return "bg-muted-foreground/40";
}

export function CalendarEventRow({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const config = typeConfig[event.type];
  const Icon = config.icon;
  const lawyer = getTeamMember(event.lawyerId);
  const dateStr = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short" }).format(new Date(event.date));

  const content = (
    <div className={`flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/50 ${compact ? "" : ""}`}>
      <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${priorityDot(event.priority)}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${config.color}`}>
            <Icon size={10} />
            {config.label}
          </span>
          {event.status === "completed" && (
            <span className="text-[10px] text-muted-foreground/60 line-through">Tamamlandı</span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium leading-tight">{event.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays size={10} />
            {dateStr}
            {event.time && ` · ${event.time}`}
          </span>
          {event.caseNumber && (
            <span className="flex items-center gap-1">
              <Briefcase size={10} />
              {event.caseNumber}
            </span>
          )}
          {lawyer && (
            <span className="text-muted-foreground/70">{lawyer.title} {lawyer.name}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (event.caseId) {
    return <Link href={`/davalar/${event.caseId}`}>{content}</Link>;
  }
  return content;
}
