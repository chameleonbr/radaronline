import { Download, Maximize2, Minimize2 } from "lucide-react";

import { Tooltip } from "../../../components/common/Tooltip";
import { ZOOM_LEVELS } from "../../../lib/date";

import { GANTT_LEGEND_ITEMS, GANTT_STATUS_OPTIONS, GANTT_ZOOM_LABELS } from "../gantt.constants";
import type { GanttStatusFilter } from "../gantt.types";

interface GanttToolbarProps {
  ganttRange: (typeof ZOOM_LEVELS)[number];
  statusFilter: GanttStatusFilter;
  showLegend: boolean;
  isExporting: boolean;
  isFullscreen: boolean;
  onStatusFilterChange: (filter: GanttStatusFilter) => void;
  onRangeChange: (range: (typeof ZOOM_LEVELS)[number]) => void;
  onExport: () => void;
  onToggleFullscreen: () => void;
  onToggleLegend: () => void;
}

export function GanttToolbar({
  ganttRange,
  statusFilter,
  showLegend,
  isExporting,
  isFullscreen,
  onStatusFilterChange,
  onRangeChange,
  onExport,
  onToggleFullscreen,
  onToggleLegend,
}: GanttToolbarProps) {
  return (
    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-700/50 shrink-0">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Cronograma</h3>
          <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded hidden sm:inline">
            ↑↓ Navegar • Enter Editar
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as GanttStatusFilter)}
            className="text-[11px] border border-slate-200 dark:border-slate-600 rounded px-2 py-1.5 bg-white dark:bg-slate-700 dark:text-slate-100 font-medium"
            aria-label="Filtrar por status"
          >
            {GANTT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-0.5 shadow-sm" role="tablist">
            {ZOOM_LEVELS.map((range) => (
              <button
                key={range}
                onClick={() => onRangeChange(range)}
                role="tab"
                aria-selected={ganttRange === range}
                className={`px-3 py-1.5 text-[11px] font-bold rounded transition-all ${
                  ganttRange === range
                    ? "bg-slate-800 dark:bg-slate-500 text-white"
                    : "text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                {GANTT_ZOOM_LABELS[range]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <Tooltip content="Exportar como PNG">
              <button
                onClick={onExport}
                disabled={isExporting}
                className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors disabled:opacity-50"
                aria-label="Exportar cronograma"
              >
                <Download size={16} />
              </button>
            </Tooltip>

            <Tooltip content={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}>
              <button
                onClick={onToggleFullscreen}
                className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {showLegend ? (
        <div className="flex flex-wrap items-center gap-3 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-600">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Legenda:</span>
          {GANTT_LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 ${item.colorClassName}`} />
              <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
            </div>
          ))}
          <button onClick={onToggleLegend} className="ml-auto text-slate-400 hover:text-slate-600 text-[11px]">
            Ocultar
          </button>
        </div>
      ) : (
        <button onClick={onToggleLegend} className="text-[11px] text-teal-600 hover:underline self-start">
          Mostrar legenda
        </button>
      )}
    </div>
  );
}
