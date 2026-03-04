import type { RaciRole } from "../../../types";

export const rolePriority: Record<RaciRole, number> = { R: 0, A: 1, I: 2 };

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;
  if (weeks < 5) return `há ${weeks} sem`;
  if (months < 12) return `há ${months} mes`;

  return `há ${years}a`;
}

export function formatDateShortYear(dateString?: string) {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year.slice(2)}`;
}
