import type { MatchWithPlayers } from "@/lib/types";

/** Calendar date YYYY-MM-DD in local timezone. */
export function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parsePlayedAt(match: MatchWithPlayers): string {
  if (match.played_at) {
    return match.played_at.slice(0, 10);
  }
  const created = new Date(match.created_at);
  const y = created.getFullYear();
  const m = String(created.getMonth() + 1).padStart(2, "0");
  const day = String(created.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function compareMatchesChronological(
  a: MatchWithPlayers,
  b: MatchWithPlayers,
): number {
  const dayA = parsePlayedAt(a);
  const dayB = parsePlayedAt(b);
  if (dayA !== dayB) return dayA < dayB ? -1 : 1;
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

export function compareMatchesReverseChronological(
  a: MatchWithPlayers,
  b: MatchWithPlayers,
): number {
  return -compareMatchesChronological(a, b);
}

export function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDayLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = todayLocalDate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  const rest = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  if (dateKey === today) return `Today · ${rest}`;
  if (dateKey === yesterdayKey) return `Yesterday · ${rest}`;
  return `${weekday} · ${rest}`;
}

export function formatBattleDate(match: MatchWithPlayers): string {
  const key = parsePlayedAt(match);
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isDateInCurrentWeek(dateKey: string, now = new Date()): boolean {
  const start = startOfWeekMonday(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const [y, m, d] = dateKey.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  return target >= start && target < end;
}
