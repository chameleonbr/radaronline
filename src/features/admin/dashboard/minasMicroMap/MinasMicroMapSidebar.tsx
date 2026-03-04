import { Activity, ChevronRight } from "lucide-react";

import { normalize } from "../../../../utils/geoUtils";
import { getStatusColor } from "./minasMicroMap.constants";
import type {
    MacroPerformanceStats,
    MapThemeColors,
    MicroPerformanceStats,
} from "./minasMicroMap.types";

export function MinasMicroMapSidebar({
    isDark,
    themeColors,
    selectedMacro,
    selectedMicro,
    microNames,
    selectedMacroStats,
    selectedMicroStats,
    microStats,
    onClose,
    onMicroSelect,
    resolveMacroName,
}: {
    isDark: boolean;
    themeColors: MapThemeColors;
    selectedMacro: string | null;
    selectedMicro: string | null;
    microNames: string[];
    selectedMacroStats: MacroPerformanceStats | null;
    selectedMicroStats: MicroPerformanceStats | null;
    microStats: Record<string, MicroPerformanceStats>;
    onClose: () => void;
    onMicroSelect: (microName: string, isSelected: boolean) => void;
    resolveMacroName: (term: string | null) => string | null;
}) {
    if (!selectedMacro) {
        return null;
    }

    return (
        <div className={`absolute top-24 right-6 w-80 max-h-[70vh] z-[1100] rounded-2xl flex flex-col animate-in slide-in-from-right-10 duration-500 shadow-2xl ring-1 ring-black/5 ${isDark ? "bg-slate-900/95 ring-white/10" : "bg-white/95"} backdrop-blur-xl`}>
            <div className={`p-5 border-b flex items-center justify-between sticky top-0 bg-inherit z-10 ${isDark ? "border-white/10" : "border-slate-100"}`}>
                <div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${themeColors.textSecondary} mb-1 block`}>Macrorregiao</span>
                    <h3 className="text-lg font-bold leading-none bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                        {resolveMacroName(selectedMacro)}
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-full transition-all active:scale-95 group ${isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"}`}
                >
                    <span className="sr-only">Fechar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                <div className="space-y-1">
                    {microNames.map((microName) => {
                        const isSelected = Boolean(selectedMicro && normalize(microName) === normalize(selectedMicro));
                        const stat = microStats[normalize(microName)];
                        const statusColor = getStatusColor(stat?.status || "sem_dados", isDark);

                        return (
                            <button
                                key={microName}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onMicroSelect(microName, isSelected);
                                }}
                                className={`w-full text-left p-2.5 rounded-lg text-sm transition-all flex items-center gap-3 group ${isSelected ? (isDark ? "bg-blue-900/30 ring-1 ring-blue-500/50 shadow-[0_4px_15px_rgba(59,130,246,0.3)]" : "bg-blue-50/80 ring-1 ring-blue-200 shadow-[0_4px_12px_rgba(59,130,246,0.15)]") : "hover:bg-slate-800/10 dark:hover:bg-slate-800/50"}`}
                            >
                                <div className="relative">
                                    <span
                                        className={`w-3 h-3 rounded-full flex-shrink-0 transition-transform block ${isSelected ? "scale-110 shadow-lg" : "scale-100 group-hover:scale-110"}`}
                                        style={{ backgroundColor: statusColor }}
                                    />
                                    {stat?.atrasadas ? <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm" /> : null}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium truncate ${isSelected ? (isDark ? "text-blue-300" : "text-blue-700") : themeColors.textSecondary}`}>
                                            {microName}
                                        </span>
                                    </div>

                                    {stat?.total ? (
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                            <span>{stat.concluidas}/{stat.total}</span>
                                            {stat.atrasadas ? <span className="text-red-500 dark:text-red-400 font-bold ml-1">{stat.atrasadas} atrasos</span> : null}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-slate-400">Sem dados</div>
                                    )}
                                </div>

                                {isSelected ? <ChevronRight className="w-4 h-4 text-teal-500 animate-in fade-in slide-in-from-left-1" /> : null}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedMicro && selectedMicroStats ? (
                <div className={`p-4 border-t ${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${themeColors.textSecondary}`}>
                            Performance Microrregiao
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className={`flex flex-col items-center p-2 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                            <span className="text-xl font-bold text-blue-500">{selectedMicroStats.total}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Total</span>
                        </div>
                        <div className={`flex flex-col items-center p-2 rounded-xl border ${isDark ? "bg-emerald-900/10 border-emerald-900/20" : "bg-emerald-50 border-emerald-100"}`}>
                            <span className="text-xl font-bold text-emerald-500">{selectedMicroStats.concluidas}</span>
                            <span className="text-[10px] text-emerald-600/70 uppercase tracking-wide font-medium">Fim</span>
                        </div>
                        <div className={`flex flex-col items-center p-2 rounded-xl border ${isDark ? "bg-red-900/10 border-red-900/20" : "bg-red-50 border-red-100"}`}>
                            <span className="text-xl font-bold text-red-500">{selectedMicroStats.atrasadas}</span>
                            <span className="text-[10px] text-red-600/70 uppercase tracking-wide font-medium">Atraso</span>
                        </div>
                    </div>
                </div>
            ) : selectedMacroStats ? (
                <div className={`p-4 border-t ${isDark ? "bg-black/10 border-white/5" : "bg-slate-50/50 border-slate-100"}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className={`w-4 h-4 ${isDark ? "text-teal-400" : "text-teal-500"}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${themeColors.textSecondary}`}>
                            Resumo Macrorregiao
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center">
                            <span className={`text-lg font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{selectedMacroStats.total}</span>
                            <span className="text-[9px] uppercase tracking-tighter opacity-70">Total</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-slate-500/10">
                            <span className="text-lg font-bold text-emerald-500">{selectedMacroStats.concluidas}</span>
                            <span className="text-[9px] uppercase tracking-tighter text-emerald-500/70">Concluidas</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-red-500">{selectedMacroStats.atrasadas}</span>
                            <span className="text-[9px] uppercase tracking-tighter text-red-500/70">Atrasos</span>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
