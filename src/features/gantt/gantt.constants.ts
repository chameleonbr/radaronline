import type { GanttRange, RaciRole } from "../../types";

import type { GanttStatusFilter } from "./gantt.types";

export const GANTT_SIDEBAR_WIDTH = 300;
export const GANTT_MIN_CHART_WIDTH = 600;
export const GANTT_EXPORT_SCALE = 2;

export const ROLE_PRIORITY: Record<RaciRole, number> = { R: 0, A: 1, I: 2 };

export const GANTT_STATUS_OPTIONS: Array<{ value: GanttStatusFilter; label: string }> = [
  { value: "all", label: "Todos Status" },
  { value: "N\u00E3o Iniciado", label: "N\u00E3o Iniciado" },
  { value: "Em Andamento", label: "Em Andamento" },
  { value: "Conclu\u00EDdo", label: "Conclu\u00EDdo" },
  { value: "Atrasado", label: "Atrasado" },
];

export const GANTT_ZOOM_LABELS: Record<GanttRange, string> = {
  "30d": "30 Dias",
  "60d": "60 Dias",
  "90d": "90 Dias",
  all: "Ver Tudo",
};

export const GANTT_LEGEND_ITEMS = [
  { label: "Conclu\u00EDdo", colorClassName: "bg-emerald-500" },
  { label: "Em Andamento", colorClassName: "bg-blue-500" },
  { label: "N\u00E3o Iniciado", colorClassName: "bg-slate-500" },
  { label: "Atrasado", colorClassName: "bg-rose-500" },
  { label: "Desvio", colorClassName: "bg-orange-500" },
  { label: "Hoje", colorClassName: "bg-red-500 rounded-full" },
] as const;
