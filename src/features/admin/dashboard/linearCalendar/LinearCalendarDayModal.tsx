import { differenceInDays, format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { ArrowRight, CalendarDays, Clock, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { Action, Objective } from "../../../../types";
import { OBJECTIVE_COLORS, STATUS_COLORS } from "./linearCalendar.constants";

interface SelectedDay {
    dateKey: string;
    dateObj: Date;
}

interface LinearCalendarDayModalProps {
    selectedDay: SelectedDay | null;
    actionsPerDay: Record<string, Action[]>;
    objectives: Objective[];
    onClose: () => void;
    getObjectiveDisplayNumber: (action: Action) => number;
    getCorrectId: (action: Action) => string;
}

export function LinearCalendarDayModal({
    selectedDay,
    actionsPerDay,
    objectives,
    onClose,
    getObjectiveDisplayNumber,
    getCorrectId,
}: LinearCalendarDayModalProps) {
    const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

    const modalData = useMemo(() => {
        if (!selectedDay) {
            return null;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDateNormalized = new Date(selectedDay.dateObj);
        selectedDateNormalized.setHours(0, 0, 0, 0);

        const dayDiff = differenceInDays(selectedDateNormalized, today);
        const isTodaySelected = isToday(selectedDay.dateObj);
        const dayActions = actionsPerDay[selectedDay.dateKey] || [];
        const actionsByObjective = dayActions.reduce((accumulator, action) => {
            const objectiveId = getObjectiveDisplayNumber(action);
            if (!accumulator[objectiveId]) {
                accumulator[objectiveId] = [];
            }
            accumulator[objectiveId].push(action);
            return accumulator;
        }, {} as Record<number, Action[]>);

        const getDayDiffText = () => {
            if (isTodaySelected) return "Hoje";
            if (dayDiff === 1) return "Amanhã";
            if (dayDiff === -1) return "Ontem";
            if (dayDiff > 0) return `Daqui a ${dayDiff} dias`;
            return `Há ${Math.abs(dayDiff)} dias`;
        };

        const dayOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][selectedDay.dateObj.getDay()];

        return {
            today,
            dayDiff,
            isTodaySelected,
            dayActions,
            actionsByObjective,
            dayOfWeek,
            dayDiffText: getDayDiffText(),
        };
    }, [actionsPerDay, getObjectiveDisplayNumber, selectedDay]);

    if (!selectedDay || !modalData) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 w-full max-w-lg max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-4 text-white shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <CalendarDays size={24} />
                            </div>
                            <div>
                                <p className="text-indigo-100 text-sm font-medium">{modalData.dayOfWeek}</p>
                                <h3 className="text-2xl font-bold leading-tight">
                                    {format(selectedDay.dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </h3>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-2 backdrop-blur-sm">
                            <Clock size={14} />
                            <span>Hoje: {format(modalData.today, "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex items-center text-indigo-100">
                            <ArrowRight size={14} className="mx-2" />
                        </div>
                        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 font-bold ${modalData.isTodaySelected ? "bg-emerald-500/80" : modalData.dayDiff > 0 ? "bg-blue-500/80" : "bg-amber-500/80"}`}>
                            {modalData.dayDiffText}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {modalData.dayActions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <CalendarDays size={28} className="text-slate-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">Nenhuma ação programada</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Não há ações previstas para este dia.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    {modalData.dayActions.length} {modalData.dayActions.length === 1 ? "ação" : "ações"} neste dia
                                </span>
                            </div>

                            {Object.entries(modalData.actionsByObjective)
                                .sort(([left], [right]) => Number(left) - Number(right))
                                .map(([objectiveId, objectiveActions]) => {
                                    const numericObjectiveId = Number(objectiveId);
                                    const colors = OBJECTIVE_COLORS[numericObjectiveId] || OBJECTIVE_COLORS[1];
                                    const objective = objectives.find((item, index) => index + 1 === numericObjectiveId);

                                    return (
                                        <div key={objectiveId} className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
                                            <div className={`px-4 py-3 flex items-center gap-3 border-b ${colors.border}`}>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${colors.bar}`}>
                                                    {numericObjectiveId}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
                                                        Objetivo {numericObjectiveId}
                                                    </span>
                                                    {objective ? <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{objective.title.replace(/^\d+\.\s*/, "")}</p> : null}
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.bar} text-white`}>
                                                    {objectiveActions.length}
                                                </span>
                                            </div>

                                            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                                {objectiveActions.map((action) => {
                                                    const isExpanded = expandedActionId === action.uid;

                                                    return (
                                                        <div key={action.uid} className={`transition-colors ${isExpanded ? "bg-slate-50 dark:bg-slate-800/80" : "hover:bg-white/50 dark:hover:bg-slate-700/30"}`}>
                                                            <div
                                                                className="px-4 py-3 cursor-pointer select-none"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setExpandedActionId(isExpanded ? null : action.uid);
                                                                }}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${STATUS_COLORS[action.status]}`} />
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">A{getCorrectId(action)}</span>
                                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${action.status === "Concluído" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : action.status === "Em Andamento" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : action.status === "Atrasado" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`}>
                                                                                {action.status}
                                                                            </span>
                                                                        </div>
                                                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 line-clamp-2">{action.title}</h5>
                                                                        {!isExpanded ? (
                                                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                                                <span className="flex items-center gap-1">
                                                                                    <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                                                                        <div className={`h-full ${action.progress >= 100 ? "bg-emerald-500" : action.progress >= 50 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${action.progress}%` }} />
                                                                                    </div>
                                                                                    <span className="font-medium">{action.progress}%</span>
                                                                                </span>
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {isExpanded ? (
                                                                <div className="px-4 pb-4 pl-9 animate-in slide-in-from-top-2 duration-200">
                                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                                        <div>
                                                                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Início</label>
                                                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{action.startDate ? format(new Date(action.startDate), "dd/MM/yyyy") : "-"}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Previsão</label>
                                                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{action.plannedEndDate ? format(new Date(action.plannedEndDate), "dd/MM/yyyy") : "-"}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mb-4">
                                                                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Progresso</label>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                                <div className={`h-full ${action.progress >= 100 ? "bg-emerald-500" : action.progress >= 50 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${action.progress}%` }} />
                                                                            </div>
                                                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{action.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    {action.raci && action.raci.length > 0 ? (
                                                                        <div>
                                                                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Equipe RACI</label>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {action.raci.map((member, index) => (
                                                                                    <span key={index} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs">
                                                                                        <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${member.role === "R" ? "bg-blue-500" : member.role === "A" ? "bg-purple-500" : "bg-slate-400"}`}>
                                                                                            {member.role}
                                                                                        </span>
                                                                                        <span className="text-slate-700 dark:text-slate-300">{member.name}</span>
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </>
    );
}
