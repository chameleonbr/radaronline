import {
  AlertTriangle,
  BarChart2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  TrendingUp,
} from "lucide-react";

import { getActionDisplayId } from "../../../../lib/text";

import { KpiActionList } from "./KpiActionList";
import type { KpiDetailModalProps } from "./kpiDetailModal.types";

interface KpiDetailContentProps extends Pick<
  KpiDetailModalProps,
  "type" | "objectiveProgress" | "overdueActions" | "microCoverage" | "deadlineHorizon" | "statusData" | "onViewMicro"
> {
  expandedCategory: string | null;
  onToggleCategory: (name: string) => void;
}

export function KpiDetailContent({
  type,
  objectiveProgress = [],
  overdueActions = [],
  microCoverage = [],
  deadlineHorizon = [],
  statusData = [],
  onViewMicro,
  expandedCategory,
  onToggleCategory,
}: KpiDetailContentProps) {
  const deadlineTotal = deadlineHorizon.reduce((sum, item) => sum + item.value, 0);
  const statusTotal = statusData.reduce((sum, item) => sum + item.value, 0);

  if (type === "conclusao") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          Progresso por Objetivo
        </h3>
        {objectiveProgress.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Nenhum objetivo encontrado</p>
        ) : (
          objectiveProgress.map((objective) => (
            <div key={objective.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">{objective.name}</span>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  {objective.completed}/{objective.total} ({objective.percentage}%)
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${objective.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  if (type === "risco") {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Ações Atrasadas
        </h3>
        {overdueActions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">Nenhuma ação atrasada!</p>
            <p className="text-slate-500 text-sm">Todas as ações estão dentro do prazo</p>
          </div>
        ) : (
          overdueActions.map((action) => (
            <div key={action.uid} className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      #{getActionDisplayId(action.id)}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">{action.title}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Prazo: {action.plannedEndDate}
                    </span>
                    {action.responsible ? <span>Resp: {action.responsible}</span> : null}
                  </div>
                </div>
                <span className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                  {action.daysOverdue} dias
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  if (type === "cobertura") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Status por Microrregião
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              Com ações
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              Sem ações
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {microCoverage.map((micro) => (
            <div
              key={micro.id}
              className={`p-3 rounded-lg border transition-colors ${
                micro.hasActions
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50"
                  : "bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700"
              } ${onViewMicro ? "cursor-pointer hover:shadow-md hover:scale-[1.01] transition-transform" : ""}`}
              onClick={() => onViewMicro?.(micro.id)}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium text-sm ${micro.hasActions ? "text-emerald-800 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}`}>
                  {micro.nome}
                </span>
                {micro.hasActions ? (
                  <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{micro.actionCount}</span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{micro.macrorregiao}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "horizonte") {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-amber-600" />
          Clique para ver as ações de cada período
        </h3>
        {deadlineHorizon.map((item, index) => {
          const percentage = deadlineTotal > 0 ? Math.round((item.value / deadlineTotal) * 100) : 0;
          const isExpanded = expandedCategory === item.name;

          return (
            <div key={`${item.name}-${index}`} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => item.value > 0 && onToggleCategory(item.name)}
                disabled={item.value === 0}
                className={`w-full p-4 text-left transition-all ${
                  item.value > 0 ? "hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer" : "cursor-default opacity-60"
                } ${isExpanded ? "bg-slate-100 dark:bg-slate-700/50" : "bg-slate-50 dark:bg-slate-700/30"}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                    {item.value > 0 ? isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" /> : null}
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>
                    {item.value} ações ({percentage}%)
                  </span>
                </div>
                <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                </div>
              </button>

              {isExpanded ? (
                <div className="px-4 pb-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-600">
                  <KpiActionList actions={item.actions} />
                </div>
              ) : null}
            </div>
          );
        })}

        {deadlineHorizon.length > 0 && deadlineHorizon[0].value > 0 ? (
          <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold text-sm">Atenção!</span>
            </div>
            <p className="text-rose-600 dark:text-rose-400 text-sm mt-1">
              {deadlineHorizon[0].value} ação(ões) já está(ão) atrasada(s) e requer(em) ação imediata.
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-violet-600" />
        Clique para ver as ações de cada status
      </h3>
      {statusData.map((item, index) => {
        const percentage = statusTotal > 0 ? Math.round((item.value / statusTotal) * 100) : 0;
        const isExpanded = expandedCategory === item.name;

        return (
          <div key={`${item.name}-${index}`} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => item.value > 0 && onToggleCategory(item.name)}
              disabled={item.value === 0}
              className={`w-full p-4 text-left transition-all ${
                item.value > 0 ? "hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer" : "cursor-default opacity-60"
              } ${isExpanded ? "bg-slate-100 dark:bg-slate-700/50" : "bg-slate-50 dark:bg-slate-700/30"}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                  {item.value > 0 ? isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" /> : null}
                </div>
                <span className="text-sm font-bold" style={{ color: item.color }}>
                  {item.value} ({percentage}%)
                </span>
              </div>
              <div className="mt-2 h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
              </div>
            </button>

            {isExpanded ? (
              <div className="px-4 pb-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-600">
                <KpiActionList actions={item.actions} />
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{statusData.find((item) => item.name === "Concluídas")?.value || 0}</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Concluídas</p>
        </div>
        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{statusData.find((item) => item.name === "Atrasadas")?.value || 0}</p>
          <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Atrasadas</p>
        </div>
      </div>
    </div>
  );
}
