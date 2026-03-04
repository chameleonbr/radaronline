import type { GanttConfig } from "../gantt.types";

interface GanttGridBackgroundProps {
  ganttConfig: GanttConfig;
  todayPos: number;
}

export function GanttGridBackground({ ganttConfig, todayPos }: GanttGridBackgroundProps) {
  return (
    <div className="absolute top-0 bottom-0 left-[300px] pointer-events-none z-0" style={{ width: ganttConfig.totalWidth }}>
      {ganttConfig.months.map((month, index) => (
        <div
          key={`month-${month.date.toISOString()}-${index}`}
          className={`absolute top-0 bottom-0 ${index % 2 === 0 ? "bg-slate-50/40 dark:bg-slate-700/30" : "bg-white dark:bg-slate-800/50"}`}
          style={{ left: month.startIdx * ganttConfig.columnWidth, width: month.count * ganttConfig.columnWidth }}
        />
      ))}

      {ganttConfig.days.map((day, index) => {
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

        return (
          <div
            key={`day-${day.toISOString()}-${index}`}
            className={`absolute top-0 bottom-0 border-r border-slate-100/60 dark:border-slate-700/30 ${isWeekend ? "bg-slate-50/50 dark:bg-slate-600/20" : ""}`}
            style={{ left: index * ganttConfig.columnWidth, width: ganttConfig.columnWidth }}
          />
        );
      })}

      {todayPos >= 0 && todayPos <= ganttConfig.totalWidth ? (
        <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-[100] pointer-events-none" style={{ left: todayPos }}>
          <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded absolute -top-0 left-1 shadow-md whitespace-nowrap">
            Hoje
          </div>
        </div>
      ) : null}
    </div>
  );
}
