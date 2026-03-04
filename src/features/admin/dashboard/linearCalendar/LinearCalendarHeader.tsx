import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Target, ZoomIn, ZoomOut } from "lucide-react";

import type { Objective } from "../../../../types";
import { OBJECTIVE_COLORS } from "./linearCalendar.constants";

export type ViewType = "year" | "month" | "week" | "day";

interface LinearCalendarHeaderProps {
    microName: string;
    actionStats: { total: number; withDate: number; withoutDate: number };
    navTitle: string;
    viewType: ViewType;
    filteredObjectives: Objective[];
    selectedObjective: number | "all";
    zoomLevel: number;
    onNavigate: (direction: number) => void;
    onViewChange: (viewType: ViewType) => void;
    onObjectiveChange: (objectiveId: number | "all") => void;
    onZoomLevelChange: (zoomLevel: number) => void;
}

export function LinearCalendarHeader({
    microName,
    actionStats,
    navTitle,
    viewType,
    filteredObjectives,
    selectedObjective,
    zoomLevel,
    onNavigate,
    onViewChange,
    onObjectiveChange,
    onZoomLevelChange,
}: LinearCalendarHeaderProps) {
    return (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm z-20 shrink-0">
            <div className="px-4 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">Agenda de Ações</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {microName} • {actionStats.total} ações
                            {actionStats.withoutDate > 0 ? (
                                <span className="text-amber-500 dark:text-amber-400 ml-1">({actionStats.withoutDate} sem data)</span>
                            ) : null}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        <button onClick={() => onNavigate(-1)} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-colors">
                            <ChevronLeft size={16} className="text-slate-600 dark:text-slate-300" />
                        </button>
                        <span className="text-sm font-bold min-w-[140px] text-center text-slate-700 dark:text-slate-200 select-none">{navTitle}</span>
                        <button onClick={() => onNavigate(1)} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-colors">
                            <ChevronRight size={16} className="text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        {(["day", "week", "month", "year"] as ViewType[]).map((nextView) => (
                            <button
                                key={nextView}
                                onClick={() => onViewChange(nextView)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === nextView ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
                            >
                                {nextView === "day" ? "Dia" : nextView === "week" ? "Semana" : nextView === "month" ? "Mês" : "Ano"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                    <Target size={14} className="text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Objetivos:</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onObjectiveChange("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedObjective === "all" ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-slate-800 dark:border-slate-200" : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"}`}
                    >
                        Todos
                    </button>
                    {filteredObjectives.map((objective, index) => {
                        const displayNumber = index + 1;
                        const colors = OBJECTIVE_COLORS[displayNumber] || OBJECTIVE_COLORS[1];
                        const isSelected = selectedObjective === objective.id;

                        return (
                            <button
                                key={objective.id}
                                onClick={() => onObjectiveChange(objective.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${isSelected ? `${colors.bar} text-white border-transparent` : `bg-white dark:bg-slate-700 ${colors.text} ${colors.border} hover:${colors.bg}`}`}
                            >
                                <Target size={12} />
                                Obj. {displayNumber}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-200 dark:border-slate-600">
                    <ZoomOut size={14} className="text-slate-400" />
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={zoomLevel}
                        onChange={(event) => onZoomLevelChange(parseFloat(event.target.value))}
                        className="w-24 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-indigo-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                        title={`Zoom: ${Math.round(zoomLevel * 100)}%`}
                    />
                    <ZoomIn size={14} className="text-slate-400" />
                </div>

                <div className="ml-auto flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500"></span> Concluído</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> Em Andamento</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500"></span> Atrasado</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-400"></span> Não Iniciado</span>
                </div>
            </div>
        </div>
    );
}
