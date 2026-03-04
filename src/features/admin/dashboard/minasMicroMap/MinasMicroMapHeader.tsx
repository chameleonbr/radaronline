import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";

import type { HoveredInfo, MapThemeColors, MapViewLevel } from "./minasMicroMap.types";

export function MinasMicroMapHeader({
    isDark,
    themeColors,
    viewLevel,
    selectedMacro,
    selectedMicro,
    hoveredInfo,
    onBack,
    onResetToMacro,
    onClearSelectedMicro,
    resolveMacroName,
}: {
    isDark: boolean;
    themeColors: MapThemeColors;
    viewLevel: MapViewLevel;
    selectedMacro: string | null;
    selectedMicro: string | null;
    hoveredInfo: HoveredInfo | null;
    onBack: () => void;
    onResetToMacro: () => void;
    onClearSelectedMicro: () => void;
    resolveMacroName: (term: string | null) => string | null;
}) {
    return (
        <div className={`absolute top-0 left-0 right-0 z-[1000] backdrop-blur-md border-b p-3 shadow-md transition-all ${themeColors.headerBg} ${themeColors.headerBorder}`}>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-500/10 rounded-lg">
                            <MapPin className="w-5 h-5 text-teal-500" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg leading-tight ${themeColors.text}`}>Mapa Estrategico de MG</h3>
                            <div className={`flex items-center gap-2 mt-0.5 text-sm ${themeColors.textSecondary}`}>
                                <span
                                    className={viewLevel === "MACRO" ? "text-teal-500 font-medium" : "hover:text-teal-400 cursor-pointer transition"}
                                    onClick={onResetToMacro}
                                >
                                    Minas Gerais
                                </span>
                                {selectedMacro ? (
                                    <>
                                        <ChevronRight className="w-3 h-3 text-slate-400" />
                                        <span
                                            className={viewLevel === "MICRO" ? "text-teal-500 font-medium" : "hover:text-teal-400 cursor-pointer transition"}
                                            onClick={onClearSelectedMicro}
                                        >
                                            {resolveMacroName(selectedMacro)}
                                        </span>
                                    </>
                                ) : null}
                                {selectedMicro ? (
                                    <>
                                        <ChevronRight className="w-3 h-3 text-slate-400" />
                                        <span className="text-teal-500 font-medium">{selectedMicro}</span>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={`hidden md:flex items-center gap-3 text-xs p-2 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-100/80 border-slate-200"}`}>
                            <span className={`font-semibold px-1 ${themeColors.textSecondary}`}>Legenda:</span>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /><span className={themeColors.textSecondary}>Otimo</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" /><span className={themeColors.textSecondary}>Bom</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" /><span className={themeColors.textSecondary}>Atencao</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" /><span className={themeColors.textSecondary}>Critico</span></div>
                        </div>

                        {viewLevel !== "MACRO" ? (
                            <button
                                onClick={onBack}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border shadow-lg active:scale-95 text-sm font-medium ${isDark ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-600 hover:border-slate-500" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"}`}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="h-6 flex items-center">
                    {hoveredInfo ? (
                        <div className="flex items-center gap-2 text-sm animate-in fade-in slide-in-from-left-2 duration-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                            <span className={`font-semibold ${themeColors.text}`}>{hoveredInfo.macro}</span>
                            {hoveredInfo.micro ? (
                                <>
                                    <span className={themeColors.textSecondary}>{">"}</span>
                                    <span className={themeColors.text}>{hoveredInfo.micro}</span>
                                </>
                            ) : null}
                        </div>
                    ) : (
                        <div className={`flex items-center gap-2 text-sm italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            <span>Passe o mouse sobre uma regiao para ver detalhes</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
