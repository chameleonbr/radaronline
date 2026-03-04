import { formatDateShort, parseDateLocal } from "../../../lib/date";

import type { HoveredActionState } from "../gantt.types";
import { getStatusStyle } from "../gantt.utils";

interface GanttTooltipProps {
  hoveredAction: HoveredActionState | null;
}

export function GanttTooltip({ hoveredAction }: GanttTooltipProps) {
  if (!hoveredAction) return null;

  const statusStyle = getStatusStyle(hoveredAction.action.status);

  return (
    <div
      className="fixed z-[100] bg-slate-800 text-white text-[10px] p-2.5 rounded-lg shadow-xl pointer-events-none min-w-[180px] max-w-[220px] whitespace-normal animate-in fade-in duration-150"
      style={{
        top: hoveredAction.rect.top < 150 ? hoveredAction.rect.bottom + 8 : hoveredAction.rect.top - 8,
        left: hoveredAction.rect.left + hoveredAction.rect.width / 2,
        transform: `translateX(-20%) ${hoveredAction.rect.top < 150 ? "" : "translateY(-100%)"}`,
      }}
    >
      <div className="font-bold mb-1.5 text-[11px] border-b border-slate-600 pb-1 truncate">{hoveredAction.action.title}</div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Progresso:</span>
          <span className="font-bold text-emerald-400">{hoveredAction.action.progress}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Início:</span>
          <span>{formatDateShort(parseDateLocal(hoveredAction.action.startDate))}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Término:</span>
          <span>{formatDateShort(parseDateLocal(hoveredAction.action.plannedEndDate))}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Status:</span>
          <span className={statusStyle.tooltipClassName}>{hoveredAction.action.status}</span>
        </div>
        {hoveredAction.action.raci.length > 0 ? (
          <div className="flex justify-between gap-4 pt-1 border-t border-slate-600">
            <span className="text-slate-400">Resp.:</span>
            <span className="truncate">{hoveredAction.action.raci[0]?.name || "-"}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
