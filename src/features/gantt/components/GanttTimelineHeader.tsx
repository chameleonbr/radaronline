import { getTodayStr, parseDateLocal } from "../../../lib/date";

import type { GanttConfig } from "../gantt.types";
import { getHeaderDayLabel } from "../gantt.utils";

interface GanttTimelineHeaderProps {
  ganttConfig: GanttConfig;
}

export function GanttTimelineHeader({ ganttConfig }: GanttTimelineHeaderProps) {
  const today = parseDateLocal(getTodayStr());

  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700 h-16 bg-white dark:bg-slate-800 sticky top-0 z-40 w-full gantt-header">
      <div className="sticky left-0 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 w-[300px] shrink-0 px-4 flex items-center text-[11px] font-bold text-slate-400 uppercase shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
        Atividade
      </div>

      <div className="relative h-full flex flex-col" style={{ width: ganttConfig.totalWidth }}>
        <div className="h-8 relative border-b border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50">
          {ganttConfig.months.map((month, index) => {
            const label = month.date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
            const isLongMonth = month.count * ganttConfig.columnWidth > 80;

            return (
              <div
                key={`${month.date.toISOString()}-${index}`}
                className="absolute top-0 bottom-0 border-r border-slate-200 dark:border-slate-600 flex items-center pl-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase whitespace-nowrap overflow-hidden"
                style={{ left: month.startIdx * ganttConfig.columnWidth, width: month.count * ganttConfig.columnWidth }}
                title={label}
              >
                <span className="truncate">{isLongMonth ? label : label.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>

        <div className="h-8 relative">
          {ganttConfig.days.map((day, index) => {
            const isToday = today ? day.getTime() === today.getTime() : false;

            return (
              <div
                key={`${day.toISOString()}-${index}`}
                className={`absolute top-0 bottom-0 border-r border-slate-100 dark:border-slate-700/50 flex flex-col justify-center items-center ${isToday ? "bg-blue-50/50 dark:bg-blue-900/20" : ""}`}
                style={{ left: index * ganttConfig.columnWidth, width: ganttConfig.columnWidth }}
              >
                <span className={`text-[11px] ${isToday ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-400 dark:text-slate-500"}`}>
                  {getHeaderDayLabel(day, ganttConfig.columnWidth)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
