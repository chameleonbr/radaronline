import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";

import { getActionDisplayId } from "../../../lib/text";
import type { DashboardMetrics } from "./dashboard.types";

interface DashboardSummaryPanelsProps {
    isMobile: boolean;
    metrics: DashboardMetrics;
}

export function DashboardSummaryPanels({ isMobile, metrics }: DashboardSummaryPanelsProps) {
    return (
        <div className={`grid grid-cols-1 ${isMobile ? "gap-4" : "lg:grid-cols-2 gap-6"}`}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-amber-500" />
                    Próximos Prazos (7 dias)
                </h3>
                <div className="space-y-3">
                    {metrics.upcomingDeadlines.length > 0 ? metrics.upcomingDeadlines.map((action) => (
                        <div key={action.uid} className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-200 font-bold text-xs shadow-sm">
                                {getActionDisplayId(action.id)}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{action.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {action.plannedEndDate || action.endDate}
                                </p>
                            </div>
                            <div className="ml-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${action.status === "Atrasado" ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"}`}>
                                    {action.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-700/50 rounded-xl border-dashed border-2 border-slate-200 dark:border-slate-600">
                            <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
                            <p className="text-slate-600 dark:text-slate-300 font-medium">Tudo tranquilo!</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Nenhuma entrega urgente para os próximos dias.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-violet-500" />
                    Ações Pendentes por Membro
                </h3>
                <div className="space-y-4">
                    {metrics.actionsByMember.map((member, index) => (
                        <div key={`${member.fullName}-${index}`} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-slate-600">
                                {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{member.fullName}</span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">{member.count} ações</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min((member.count / 10) * 100, 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {metrics.actionsByMember.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm italic">
                            Nenhuma ação atribuída ainda.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
