import { format } from "date-fns";
import { X } from "lucide-react";

import type { Action } from "../../../../types";
import { OBJECTIVE_COLORS, STATUS_COLORS } from "./linearCalendar.constants";

interface LinearCalendarActionModalProps {
    action: Action | null;
    onClose: () => void;
    getObjectiveDisplayNumber: (action: Action) => number;
    getCorrectId: (action: Action) => string;
}

export function LinearCalendarActionModal({
    action,
    onClose,
    getObjectiveDisplayNumber,
    getCorrectId,
}: LinearCalendarActionModalProps) {
    if (!action) {
        return null;
    }

    const objectiveNumber = getObjectiveDisplayNumber(action);
    const objectiveColors = OBJECTIVE_COLORS[objectiveNumber] || OBJECTIVE_COLORS[1];

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className={`px-5 py-4 ${objectiveColors.bg} border-b ${objectiveColors.border} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${objectiveColors.bar}`}>
                            {objectiveNumber}
                        </div>
                        <div>
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">A{getCorrectId(action)}</span>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">{action.title}</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Status</label>
                            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold text-white ${STATUS_COLORS[action.status]}`}>
                                {action.status}
                            </span>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Progresso</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                    <div className={`h-full ${action.progress >= 100 ? "bg-emerald-500" : action.progress >= 50 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${action.progress}%` }} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{action.progress}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Início</label>
                            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{action.startDate ? format(new Date(action.startDate), "dd/MM/yyyy") : "-"}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Previsão de Término</label>
                            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{action.plannedEndDate ? format(new Date(action.plannedEndDate), "dd/MM/yyyy") : "-"}</p>
                        </div>
                    </div>
                    {action.endDate ? (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Término Real</label>
                            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{format(new Date(action.endDate), "dd/MM/yyyy")}</p>
                        </div>
                    ) : null}
                    {action.raci && action.raci.length > 0 ? (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Equipe RACI</label>
                            <div className="flex flex-wrap gap-2">
                                {action.raci.map((member, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
                                        <span className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center text-white ${member.role === "R" ? "bg-blue-500" : member.role === "A" ? "bg-purple-500" : "bg-slate-400"}`}>
                                            {member.role}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-200">{member.name}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </>
    );
}
