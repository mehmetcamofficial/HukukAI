/**
 * Demo Calendar Events — Takvim & Süreler
 *
 * All dates are consistent with the existing Demo Dataset v1.
 * Events are derived from case timelines, deadlines, and hearings.
 *
 * Event types:
 * - Duruşma: Court hearing
 * - Son_süre: Filing deadline
 * - Arabuluculuk: Mediation session
 * - Bilirkişi: Expert report / review
 * - Müvekkil_görüşmesi: Client meeting
 * - İç_görev: Internal task
 */

export type CalendarEventType =
  | "Duruşma"
  | "Son_süre"
  | "Arabuluculuk"
  | "Bilirkişi"
  | "Müvekkil_görüşmesi"
  | "İç_görev";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM
  type: CalendarEventType;
  caseId?: string;
  caseNumber?: string;
  caseTitle?: string;
  lawyerId: string; // team member id
  priority: "high" | "medium" | "low";
  status: "upcoming" | "completed" | "overdue";
};

export const demoCalendarEvents: CalendarEvent[] = [
  {
    id: "cal-001",
    title: "Bilirkişi raporuna itiraz son günü",
    date: "2026-09-02",
    type: "Son_süre",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "behcet-alp",
    priority: "high",
    status: "upcoming",
  },
  {
    id: "cal-002",
    title: "Duruşma — Bilirkişi raporu değerlendirilmesi",
    date: "2026-09-14",
    time: "10:00",
    type: "Duruşma",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "behcet-alp",
    priority: "high",
    status: "upcoming",
  },
  {
    id: "cal-003",
    title: "Duruşma — Son savunma",
    date: "2027-01-20",
    time: "10:00",
    type: "Duruşma",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "behcet-alp",
    priority: "medium",
    status: "upcoming",
  },
  {
    id: "cal-004",
    title: "Bilirkişi raporu inceleme",
    date: "2026-09-05",
    type: "Bilirkişi",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "colleague-2",
    priority: "medium",
    status: "upcoming",
  },
  {
    id: "cal-005",
    title: "Müvekkil görüşmesi — Dava stratejisi",
    date: "2026-09-08",
    time: "14:00",
    type: "Müvekkil_görüşmesi",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "behcet-alp",
    priority: "medium",
    status: "upcoming",
  },
  {
    id: "cal-006",
    title: "Emsal karar araştırması tamamlanacak",
    date: "2026-09-10",
    type: "İç_görev",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "colleague-3",
    priority: "low",
    status: "upcoming",
  },
  {
    id: "cal-007",
    title: "Duruşma hazırlık notları güncelle",
    date: "2026-09-12",
    type: "İç_görev",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "colleague-2",
    priority: "medium",
    status: "upcoming",
  },
  {
    id: "cal-008",
    title: "İtiraz dilekçesi taslağı hazırla",
    date: "2026-08-28",
    type: "İç_görev",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "behcet-alp",
    priority: "high",
    status: "completed",
  },
  {
    id: "cal-009",
    title: "Arabuluculuk tutanağı alındı",
    date: "2026-02-18",
    type: "Arabuluculuk",
    caseId: "case-2026-145",
    caseNumber: "2026/145",
    caseTitle: "İşçilik Alacağı",
    lawyerId: "behcet-alp",
    priority: "low",
    status: "completed",
  },
];
