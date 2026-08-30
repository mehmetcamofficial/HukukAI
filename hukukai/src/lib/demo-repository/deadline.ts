/**
 * Deadline urgency — pure, deterministic, timezone-stable (date-only maths).
 * Red is reserved for genuinely overdue items; near-term is amber, not red.
 */

export type DeadlineStatus =
  | 'overdue'
  | 'today'
  | 'tomorrow'
  | 'soon'
  | 'upcoming'
  | 'none';

export interface DeadlineInfo {
  status: DeadlineStatus;
  daysLeft: number | null;
  label: string;
  tone: 'danger' | 'warning' | 'neutral';
}

/** Parse a YYYY-MM-DD (or ISO) string into a UTC midnight timestamp. */
function toUtcDay(value: string): number {
  const datePart = value.slice(0, 10);
  const [y, m, d] = datePart.split('-').map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

export function getDeadlineInfo(
  date: string | null | undefined,
  reference: Date = new Date(),
): DeadlineInfo {
  if (!date) return { status: 'none', daysLeft: null, label: '—', tone: 'neutral' };

  const refDay = Date.UTC(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const targetDay = toUtcDay(date);
  const daysLeft = Math.round((targetDay - refDay) / 86_400_000);

  if (daysLeft < 0) {
    const overdueBy = Math.abs(daysLeft);
    return {
      status: 'overdue',
      daysLeft,
      label: overdueBy === 1 ? '1 gün gecikti' : `${overdueBy} gün gecikti`,
      tone: 'danger',
    };
  }
  if (daysLeft === 0) return { status: 'today', daysLeft, label: 'Bugün', tone: 'warning' };
  if (daysLeft === 1) return { status: 'tomorrow', daysLeft, label: 'Yarın', tone: 'warning' };
  if (daysLeft <= 7) return { status: 'soon', daysLeft, label: `${daysLeft} gün kaldı`, tone: 'warning' };
  return { status: 'upcoming', daysLeft, label: `${daysLeft} gün kaldı`, tone: 'neutral' };
}

/** Sort comparator: overdue first, then soonest upcoming, then undated. */
export function byDeadlineUrgency(a: string | null | undefined, b: string | null | undefined): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return toUtcDay(a) - toUtcDay(b);
}
