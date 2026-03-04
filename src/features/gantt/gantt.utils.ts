import type { Action, GanttRange, Status } from "../../types";
import { getTodayStr, parseDateLocal } from "../../lib/date";

import {
  GANTT_MIN_CHART_WIDTH,
  GANTT_SIDEBAR_WIDTH,
  ROLE_PRIORITY,
} from "./gantt.constants";
import type { GanttConfig, GanttStatusFilter, GanttStatusStyle } from "./gantt.types";

export function getSortedFilteredActions(actions: Action[], statusFilter: GanttStatusFilter) {
  return actions
    .filter((action) => statusFilter === "all" || action.status === statusFilter)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export function buildGanttConfig(
  filteredActions: Action[],
  ganttRange: GanttRange,
  containerWidth: number,
): GanttConfig {
  const actionDates = filteredActions
    .flatMap((action) => [
      parseDateLocal(action.startDate),
      parseDateLocal(action.endDate),
      parseDateLocal(action.plannedEndDate),
    ])
    .filter((date): date is Date => date !== null && !Number.isNaN(date.getTime()));

  let minDate: Date;
  let maxDate: Date;

  if (filteredActions.length > 0 && actionDates.length > 0) {
    minDate = new Date(Math.min(...actionDates.map((date) => date.getTime())));
    maxDate = new Date(Math.max(...actionDates.map((date) => date.getTime())));
  } else {
    const now = parseDateLocal(getTodayStr()) || new Date();
    minDate = new Date(now.getFullYear(), 11, 1);
    maxDate = new Date(now.getFullYear() + 1, 1, 1);
  }

  const startDate = new Date(minDate);
  startDate.setDate(startDate.getDate() - 15);

  const endDate = new Date(maxDate);
  endDate.setDate(endDate.getDate() + 45);

  const totalDaysInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const availableWidth = Math.max(containerWidth - (GANTT_SIDEBAR_WIDTH + 2), GANTT_MIN_CHART_WIDTH);

  const targetDaysInView =
    ganttRange === "all" ? totalDaysInRange : ganttRange === "90d" ? 90 : ganttRange === "60d" ? 60 : 30;

  let columnWidth = availableWidth / targetDaysInView;
  if (ganttRange === "all") {
    columnWidth = Math.max(columnWidth, 5);
  } else if (ganttRange === "90d") {
    columnWidth = Math.max(columnWidth, 10);
  } else if (ganttRange === "60d") {
    columnWidth = Math.max(columnWidth, 15);
  } else {
    columnWidth = Math.max(columnWidth, 30);
  }

  const totalWidth = totalDaysInRange * columnWidth;
  const days: Date[] = [];
  const cursor = new Date(startDate);
  const maxDays = 365 * 5;

  for (let count = 0; cursor <= endDate && count < maxDays; count += 1) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const months: GanttConfig["months"] = [];
  if (days.length > 0) {
    let currentMonth = days[0].getMonth();
    let currentYear = days[0].getFullYear();
    let startIdx = 0;

    days.forEach((day, index) => {
      if (day.getMonth() !== currentMonth || day.getFullYear() !== currentYear) {
        months.push({
          date: new Date(currentYear, currentMonth, 1),
          startIdx,
          count: index - startIdx,
        });
        currentMonth = day.getMonth();
        currentYear = day.getFullYear();
        startIdx = index;
      }
    });

    months.push({
      date: new Date(currentYear, currentMonth, 1),
      startIdx,
      count: days.length - startIdx,
    });
  }

  return { start: startDate, end: endDate, days, months, columnWidth, totalWidth };
}

export function getDatePosition(date: Date | null, ganttConfig: GanttConfig) {
  if (!date) return -1000;
  const diffTime = date.getTime() - ganttConfig.start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays * ganttConfig.columnWidth;
}

export function getHeaderDayLabel(day: Date, columnWidth: number) {
  if (columnWidth < 12) return null;
  if (columnWidth < 20) return day.getDate() % 5 === 0 ? day.getDate() : null;
  return day.getDate();
}

export function getOrderedRaci(action: Action) {
  return [...action.raci].sort((a, b) => ROLE_PRIORITY[a.role] - ROLE_PRIORITY[b.role]);
}

export function getStatusStyle(status: Status): GanttStatusStyle {
  if (status === "Conclu\u00EDdo") {
    return {
      badgeClassName: "bg-emerald-100 text-emerald-700",
      mobileBorderClassName: "border-l-emerald-500",
      barClassName: "bg-emerald-200 dark:bg-emerald-900/70 border-emerald-300 dark:border-emerald-700",
      progressClassName: "bg-emerald-500",
      borderColor: "#10b981",
      tooltipClassName: "text-emerald-400",
    };
  }

  if (status === "Em Andamento") {
    return {
      badgeClassName: "bg-blue-100 text-blue-700",
      mobileBorderClassName: "border-l-blue-500",
      barClassName: "bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500",
      progressClassName: "bg-blue-500",
      borderColor: "#3b82f6",
      tooltipClassName: "text-blue-400",
    };
  }

  if (status === "Atrasado") {
    return {
      badgeClassName: "bg-rose-100 text-rose-700",
      mobileBorderClassName: "border-l-rose-500",
      barClassName: "bg-rose-200 dark:bg-rose-900/70 border-rose-300 dark:border-rose-700",
      progressClassName: "bg-rose-500",
      borderColor: "#f43f5e",
      tooltipClassName: "text-rose-400",
    };
  }

  return {
    badgeClassName: "bg-slate-100 text-slate-600",
    mobileBorderClassName: "border-l-slate-400",
    barClassName: "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600",
    progressClassName: "bg-slate-400",
    borderColor: "#64748b",
    tooltipClassName: "",
  };
}
