import { Clock, MapPin, User } from "lucide-react";

import { getActionDisplayId } from "../../../../lib/text";

import type { ActionSummary } from "./kpiDetailModal.types";

export function KpiActionList({ actions }: { actions?: ActionSummary[] }) {
  if (!actions || actions.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400 text-sm italic py-2 px-3">Nenhuma ação nesta categoria</p>;
  }

  return (
    <div className="space-y-2 py-2">
      {actions.map((action) => (
        <div
          key={action.uid}
          className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600 shadow-sm"
        >
          <div className="flex items-start gap-2">
            <span className="bg-slate-600 dark:bg-slate-500 text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">
              #{getActionDisplayId(action.id)}
            </span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100 flex-1">{action.title}</span>
          </div>

          <div className="flex items-center flex-wrap gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
            {action.microName ? (
              <span className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-medium">
                <MapPin className="w-3 h-3" />
                {action.microName}
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {action.plannedEndDate}
            </span>
            {action.responsible ? (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {action.responsible}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
