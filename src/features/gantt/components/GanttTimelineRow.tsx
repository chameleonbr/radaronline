import { Calendar } from "lucide-react";
import type React from "react";

import { RaciCompactPill } from "../../../components/common/RaciPill";
import { formatDateShort, parseDateLocal } from "../../../lib/date";
import { getActionDisplayId } from "../../../lib/text";
import type { Action } from "../../../types";

import type { GanttConfig } from "../gantt.types";
import { getOrderedRaci, getStatusStyle } from "../gantt.utils";

interface GanttTimelineRowProps {
  action: Action;
  ganttConfig: GanttConfig;
  isFocused: boolean;
  getPosition: (date: Date | null) => number;
  onActionClick: (action: Action) => void;
  onBarMouseEnter: (action: Action, event: React.MouseEvent<HTMLDivElement>) => void;
  onBarMouseLeave: () => void;
  onScrollToPosition: (position: number, smooth?: boolean) => void;
}

export function GanttTimelineRow({
  action,
  ganttConfig,
  isFocused,
  getPosition,
  onActionClick,
  onBarMouseEnter,
  onBarMouseLeave,
  onScrollToPosition,
}: GanttTimelineRowProps) {
  const orderedRaci = getOrderedRaci(action);
  const extraRaci = orderedRaci.slice(2);
  const extraTitle = extraRaci.map((person) => `${person.role}: ${person.name}`).join(", ");
  const startDate = parseDateLocal(action.startDate);
  const plannedEnd = parseDateLocal(action.plannedEndDate);
  const actualEnd = parseDateLocal(action.endDate);
  const effectivePlanned = plannedEnd || actualEnd;
  const leftStart = getPosition(startDate);
  const plannedWidth =
    effectivePlanned && startDate ? getPosition(effectivePlanned) - getPosition(startDate) + ganttConfig.columnWidth : 0;

  const isLate = Boolean(actualEnd && plannedEnd && actualEnd > plannedEnd);
  const isEarly = Boolean(
    actualEnd && plannedEnd && actualEnd < plannedEnd && (action.status === "Conclu\u00EDdo" || action.progress === 100),
  );
  const isDeviation = isLate || isEarly;
  const statusStyle = getStatusStyle(action.status);

  let deviationBar: React.ReactNode = null;
  if (isLate && plannedEnd && actualEnd) {
    const widthLate = Math.max(48, getPosition(actualEnd) - getPosition(plannedEnd));
    const daysDiff = Math.max(1, Math.round((actualEnd.getTime() - plannedEnd.getTime()) / (1000 * 60 * 60 * 24)));

    deviationBar = (
      <div
        className="absolute top-0 bottom-0 bg-orange-500 rounded-r-md shadow-sm z-20 flex items-center justify-center overflow-hidden"
        style={{ left: "100%", width: widthLate, minWidth: 48 }}
        title={`Atraso: ${daysDiff} dias`}
      >
        <span className="text-[10px] font-bold text-white drop-shadow-sm px-1 w-full text-center whitespace-nowrap">
          +{daysDiff}d
        </span>
      </div>
    );
  } else if (isEarly && plannedEnd && actualEnd) {
    const widthSaved = Math.max(48, getPosition(plannedEnd) - getPosition(actualEnd));
    const daysDiff = Math.max(1, Math.round((plannedEnd.getTime() - actualEnd.getTime()) / (1000 * 60 * 60 * 24)));

    deviationBar = (
      <div
        className="absolute top-0 bottom-0 bg-orange-300/40 border-l-2 border-orange-400 z-20 flex items-center justify-center overflow-hidden stripe-bg"
        style={{
          right: 0,
          width: widthSaved,
          minWidth: 48,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(251, 146, 60, 0.3), rgba(251, 146, 60, 0.3) 10px, rgba(255, 255, 255, 0.2) 10px, rgba(255, 255, 255, 0.2) 20px)",
        }}
        title={`Economia: ${daysDiff} dias`}
      >
        <span className="text-[10px] font-bold text-orange-700 bg-white/50 px-1 rounded-sm w-full text-center whitespace-nowrap shadow-sm">
          −{daysDiff}d
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex h-auto min-h-[3.6rem] border-b border-slate-100 dark:border-slate-700/50 relative hover:bg-slate-50/50 dark:hover:bg-slate-700/30 group ${isFocused ? "bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-300 dark:ring-blue-600 ring-inset" : ""}`}
      style={{ overflow: "visible" }}
    >
      <div className="sticky left-0 z-30 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 w-[300px] shrink-0 px-2 py-1 flex flex-col justify-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
        <div
          className="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm p-2 h-full flex flex-col justify-center relative overflow-hidden border-l-4 cursor-pointer hover:shadow-md transition-shadow gap-1"
          style={{ borderLeftColor: statusStyle.borderColor }}
          onClick={() => onScrollToPosition(leftStart)}
          tabIndex={0}
          role="button"
          aria-label={`Focar barra da ação ${action.title}`}
        >
          <div className="min-w-0 flex-1 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 rounded px-1.5 py-0.5 text-[10px] font-mono border border-slate-200 dark:border-slate-500">
                {getActionDisplayId(action.id)}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${statusStyle.badgeClassName}`}>
                {action.status}
              </span>
            </div>

            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight mb-1 line-clamp-2" title={action.title}>
              {action.title}
            </div>

            <div className="flex items-end justify-between gap-1 mt-auto">
              <div className="flex flex-col gap-0.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 leading-none">
                  <Calendar size={11} /> {formatDateShort(plannedEnd)}
                </span>
                {actualEnd ? (
                  <span className={`leading-none ${isDeviation ? "text-orange-600 font-bold" : "text-slate-500"}`}>
                    Real: {formatDateShort(actualEnd)}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-1 overflow-hidden justify-end max-w-[120px] flex-wrap">
                {orderedRaci.slice(0, 2).map((person, personIndex) => (
                  <RaciCompactPill key={`${action.id}-${person.name}-${personIndex}`} person={person} />
                ))}
                {action.raci.length > 2 ? (
                  <span className="text-[10px] text-slate-400" title={extraTitle}>
                    +{action.raci.length - 2}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ width: ganttConfig.totalWidth, overflow: "visible" }}>
        {startDate && leftStart > 0 ? (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-px border-t border-dashed border-slate-300 dark:border-slate-600"
            style={{ left: 0, width: Math.max(0, leftStart) }}
          />
        ) : null}

        {startDate && effectivePlanned && plannedWidth > 0 ? (
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-6 rounded-md shadow-sm border cursor-pointer hover:brightness-110 hover:shadow-md transition-all group/bar ${statusStyle.barClassName}`}
            style={{ left: leftStart, width: Math.max(plannedWidth, ganttConfig.columnWidth * 0.6) }}
            onClick={() => onActionClick(action)}
            onMouseEnter={(event) => onBarMouseEnter(action, event)}
            onMouseLeave={onBarMouseLeave}
            role="button"
            aria-label={`Editar ação ${action.title}`}
            tabIndex={0}
          >
            <div
              className={`h-full rounded-l-md ${isLate ? "rounded-r-none" : "rounded-r-md"} ${action.status === "Em Andamento" ? "bg-blue-500" : statusStyle.progressClassName} relative overflow-hidden transition-all duration-500 ease-out`}
              style={{
                width:
                  isEarly && actualEnd && startDate
                    ? getPosition(actualEnd) - getPosition(startDate) + ganttConfig.columnWidth
                    : isLate
                      ? "100%"
                      : `${Math.max(action.progress, 5)}%`,
                backgroundColor: action.status === "Em Andamento" ? "#1d4ed8" : undefined,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              {action.status === "Em Andamento" && action.progress > 0 && action.progress < 100 ? (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              ) : null}
            </div>

            {deviationBar}

            {plannedWidth > 60 ? (
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80 pointer-events-none">
                {action.progress}%
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
