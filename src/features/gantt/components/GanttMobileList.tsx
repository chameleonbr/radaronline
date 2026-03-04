import { Calendar } from "lucide-react";

import { RaciCompactPill } from "../../../components/common/RaciPill";
import { formatDateShort, parseDateLocal } from "../../../lib/date";
import { getActionDisplayId } from "../../../lib/text";
import type { Action } from "../../../types";

import { GANTT_STATUS_OPTIONS } from "../gantt.constants";
import type { GanttStatusFilter } from "../gantt.types";
import { getOrderedRaci, getStatusStyle } from "../gantt.utils";

interface GanttMobileListProps {
  filteredActions: Action[];
  statusFilter: GanttStatusFilter;
  onStatusFilterChange: (filter: GanttStatusFilter) => void;
  onActionClick: (action: Action) => void;
}

export function GanttMobileList({
  filteredActions,
  statusFilter,
  onStatusFilterChange,
  onActionClick,
}: GanttMobileListProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Cronograma</h3>
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as GanttStatusFilter)}
            className="text-xs border border-slate-200 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 dark:text-slate-100"
          >
            {GANTT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[60vh] overflow-y-auto">
        {filteredActions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Nenhuma ação encontrada</div>
        ) : (
          filteredActions.map((action) => {
            const orderedRaci = getOrderedRaci(action);
            const startDate = parseDateLocal(action.startDate);
            const endDate = parseDateLocal(action.plannedEndDate || action.endDate);
            const statusStyle = getStatusStyle(action.status);

            return (
              <button
                key={action.id}
                onClick={() => onActionClick(action)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors border-l-4 ${statusStyle.mobileBorderClassName}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {getActionDisplayId(action.id)}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusStyle.badgeClassName}`}>
                        {action.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 line-clamp-2">{action.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-teal-600">{action.progress}%</p>
                  </div>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full transition-all ${statusStyle.progressClassName}`} style={{ width: `${action.progress}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 gap-3">
                  <span className="flex items-center gap-1 min-w-0">
                    <Calendar size={12} />
                    <span className="truncate">
                      {formatDateShort(startDate)} → {formatDateShort(endDate)}
                    </span>
                  </span>
                  <div className="flex gap-1 shrink-0">
                    {orderedRaci.slice(0, 2).map((person, index) => (
                      <RaciCompactPill key={`${action.id}-${person.name}-${index}`} person={person} />
                    ))}
                    {orderedRaci.length > 2 ? <span className="text-slate-400">+{orderedRaci.length - 2}</span> : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
