import type { MapHealthStatus, MapThemeColors } from "./minasMicroMap.types";

export function getStatusColor(status: MapHealthStatus, isDark: boolean) {
    switch (status) {
        case "otimo":
            return isDark ? "#059669" : "#10b981";
        case "bom":
            return isDark ? "#2563eb" : "#3b82f6";
        case "atencao":
            return isDark ? "#d97706" : "#f59e0b";
        case "critico":
            return isDark ? "#dc2626" : "#ef4444";
        default:
            return isDark ? "#475569" : "#cbd5e1";
    }
}

export function buildThemeColors(isDark: boolean): MapThemeColors {
    return {
        bg: isDark ? "bg-slate-900" : "bg-white",
        border: isDark ? "border-slate-800" : "border-slate-200",
        text: isDark ? "text-white" : "text-slate-900",
        textSecondary: isDark ? "text-slate-400" : "text-slate-500",
        headerBg: isDark ? "bg-slate-900/95" : "bg-white/95",
        headerBorder: isDark ? "border-slate-700" : "border-slate-200",
        mapBg: isDark ? "#0f172a" : "#ffffff",
        macroFill: isDark ? "#f8fafc" : "#f1f5f9",
        macroColor: isDark ? "#94a3b8" : "#64748b",
        macroOpacity: isDark ? 0.3 : 0.5,
        macroBorder: isDark ? "#cbd5e1" : "#64748b",
        microBorder: isDark ? "#475569" : "#94a3b8",
        unselectedFill: isDark ? "#e2e8f0" : "#e2e8f0",
        unselectedColor: isDark ? "#e2e8f0" : "#cbd5e1",
        muniUnselectedFill: isDark ? "#f1f5f9" : "#f8fafc",
    };
}
