import { motion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";

import type { AdminOverviewDetailedData, AdminOverviewMetrics } from "./adminOverview.types";

interface ReprogrammedActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: AdminOverviewMetrics;
  detailedData: AdminOverviewDetailedData;
}

export function ReprogrammedActionsModal({
  isOpen,
  onClose,
  metrics,
  detailedData,
}: ReprogrammedActionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-3xl max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarClock className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Ações Reprogramadas</h2>
                <p className="text-amber-100 text-sm">Concluídas fora da data planejada</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowRight className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.concluidasAntes}</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Concluídas antes do prazo</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{metrics.concluidasComAtraso}</div>
              <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">Concluídas após o prazo</div>
            </div>
          </div>

          {detailedData.earlyCompletions.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Concluídas Antecipadamente
              </h3>
              <div className="space-y-2">
                {detailedData.earlyCompletions.map((action) => (
                  <div key={action.uid} className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{action.title}</div>
                      <div className="text-xs text-slate-500">
                        Planejado: {action.plannedEndDate} → Real: {action.actualEndDate}
                        {action.responsible ? <span className="ml-2 text-emerald-600">{action.responsible}</span> : null}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                        -{action.daysEarly}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {detailedData.lateCompletions.length > 0 ? (
            <div>
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Concluídas com Atraso
              </h3>
              <div className="space-y-2">
                {detailedData.lateCompletions.map((action) => (
                  <div key={action.uid} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{action.title}</div>
                      <div className="text-xs text-slate-500">
                        Planejado: {action.plannedEndDate} → Real: {action.actualEndDate}
                        {action.responsible ? <span className="ml-2 text-amber-600">{action.responsible}</span> : null}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                        +{action.daysLate}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {detailedData.earlyCompletions.length === 0 && detailedData.lateCompletions.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <CalendarClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma ação reprogramada encontrada</p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
