import { useMemo } from "react";

import { macroregions } from "../../../../data/mapamg/macroregions";
import { MICROREGIOES } from "../../../../data/microregioes";
import type { Action } from "../../../../types";
import { createGeoLookupMaps, normalize, resolveMicroId } from "../../../../utils/geoUtils";
import { getStatusColor } from "./minasMicroMap.constants";
import type { MacroPerformanceStats, MicroPerformanceStats } from "./minasMicroMap.types";

interface UseMinasMicroMapMetricsParams {
    actions: Action[];
    geoMaps: ReturnType<typeof createGeoLookupMaps>;
    isDark: boolean;
    findMacroKey: (name: string | null) => string | null;
    resolveMacroName: (term: string | null) => string | null;
    selectedMacro: string | null;
    selectedMicro: string | null;
}

export function useMinasMicroMapMetrics({
    actions,
    geoMaps,
    isDark,
    findMacroKey,
    resolveMacroName,
    selectedMacro,
    selectedMicro,
}: UseMinasMicroMapMetricsParams) {
    const actionsByMicroId = useMemo(() => {
        const groupedActions: Record<string, Action[]> = {};

        actions.forEach((action) => {
            if (!action.microregiaoId) {
                return;
            }

            const normalizedMicroId = normalize(action.microregiaoId);
            if (!groupedActions[normalizedMicroId]) {
                groupedActions[normalizedMicroId] = [];
            }

            groupedActions[normalizedMicroId].push(action);
        });

        return groupedActions;
    }, [actions]);

    const { macroColorMap, microColorMap, microStats, macroStats } = useMemo(() => {
        const nextMicroStats: Record<string, MicroPerformanceStats> = {};
        const nextMicroColorMap: Record<string, string> = {};
        const macroAggregation: Record<string, MacroPerformanceStats & { originalName: string }> = {};
        const now = new Date();

        MICROREGIOES.forEach((micro) => {
            const normalizedMicroId = normalize(micro.id);
            const microActions = actionsByMicroId[normalizedMicroId] || [];
            const total = microActions.length;
            const concluidas = microActions.filter((action) => action.status === "Concluído").length;
            const atrasadas = microActions.filter((action) => {
                if (action.status === "Concluído") {
                    return false;
                }

                return Boolean(action.plannedEndDate && new Date(action.plannedEndDate) < now);
            }).length;

            let status: MicroPerformanceStats["status"] = "sem_dados";
            if (total > 0) {
                const taxa = (concluidas / total) * 100;
                if (atrasadas > 2) status = "critico";
                else if (taxa >= 80) status = "otimo";
                else if (taxa >= 50) status = "bom";
                else status = "atencao";
            }

            if (micro.macrorregiao) {
                const normalizedMacroName = normalize(micro.macrorregiao);
                if (!macroAggregation[normalizedMacroName]) {
                    macroAggregation[normalizedMacroName] = {
                        atrasadas: 0,
                        concluidas: 0,
                        originalName: micro.macrorregiao,
                        total: 0,
                    };
                }

                macroAggregation[normalizedMacroName].total += total;
                macroAggregation[normalizedMacroName].concluidas += concluidas;
                macroAggregation[normalizedMacroName].atrasadas += atrasadas;
            }

            const stats = { status, concluidas, atrasadas, total };
            const color = getStatusColor(status, isDark);

            nextMicroStats[normalizedMicroId] = stats;
            nextMicroStats[normalize(micro.nome)] = stats;
            nextMicroColorMap[normalizedMicroId] = color;
            nextMicroColorMap[normalize(micro.nome)] = color;
        });

        const nextMacroColorMap: Record<string, string> = {};
        const nextMacroStats: Record<string, MacroPerformanceStats> = {};

        Object.keys(macroregions).forEach((macroName) => {
            const normalizedMacroName = normalize(macroName);
            const data = macroAggregation[normalizedMacroName] || {
                atrasadas: 0,
                concluidas: 0,
                total: 0,
            };

            nextMacroStats[normalizedMacroName] = data;
            nextMacroStats[macroName] = data;

            let status: MicroPerformanceStats["status"] = "sem_dados";
            if (data.total > 0) {
                const taxa = (data.concluidas / data.total) * 100;
                if (data.atrasadas > 5) status = "critico";
                else if (taxa >= 80) status = "otimo";
                else if (taxa >= 50) status = "bom";
                else status = "atencao";
            }

            const color = getStatusColor(status, isDark);
            nextMacroColorMap[normalizedMacroName] = color;
            nextMacroColorMap[macroName] = color;
        });

        return {
            macroColorMap: nextMacroColorMap,
            macroStats: nextMacroStats,
            microColorMap: nextMicroColorMap,
            microStats: nextMicroStats,
        };
    }, [actionsByMicroId, isDark]);

    const currentMacroMicroNames = useMemo(() => {
        const macroKey = findMacroKey(resolveMacroName(selectedMacro)) || "";
        return (macroregions as Record<string, string[]>)[macroKey] || [];
    }, [findMacroKey, resolveMacroName, selectedMacro]);

    const selectedMicroStats = useMemo(() => {
        if (!selectedMicro) {
            return null;
        }

        const normalizedMicro = normalize(selectedMicro);
        const resolvedMicroId = resolveMicroId(selectedMicro, geoMaps);

        return microStats[normalizedMicro] || (resolvedMicroId ? microStats[resolvedMicroId] : null) || null;
    }, [geoMaps, microStats, selectedMicro]);

    const selectedMacroStats = useMemo(() => {
        if (!selectedMacro) {
            return null;
        }

        return macroStats[normalize(selectedMacro)] || null;
    }, [macroStats, selectedMacro]);

    return {
        currentMacroMicroNames,
        macroColorMap,
        macroStats,
        microColorMap,
        microStats,
        selectedMacroStats,
        selectedMicroStats,
    };
}
