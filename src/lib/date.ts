import { GanttRange } from "../types";

export const formatISODate = (date: Date | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayStr = () => formatISODate(new Date());

export const parseDateLocal = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const formatDateBr = (dateString: string) => {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const formatDateShort = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export const ZOOM_LEVELS: GanttRange[] = ['30d', '60d', '90d', 'all'];
export const COLUMN_WIDTHS: Record<GanttRange, number> = { '30d': 40, '60d': 30, '90d': 20, 'all': 12 };

