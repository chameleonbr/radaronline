import { useCallback, useEffect, useMemo, useState } from "react";

import { MICROREGIOES } from "../../../../data/microregioes";
import { macroregions } from "../../../../data/mapamg/macroregions";
import { createGeoLookupMaps, findMacroKeyInObject, normalize } from "../../../../utils/geoUtils";
import type { MapViewLevel, MinasMicroMapProps } from "./minasMicroMap.types";

interface UseMinasMicroMapNavigationParams {
    selectedMacroId?: MinasMicroMapProps["selectedMacroId"];
    selectedMicroId?: MinasMicroMapProps["selectedMicroId"];
    onMacroSelect?: MinasMicroMapProps["onMacroSelect"];
    onMicroSelect?: MinasMicroMapProps["onMicroSelect"];
    onNavigateToObjectives?: MinasMicroMapProps["onNavigateToObjectives"];
}

export function useMinasMicroMapNavigation({
    selectedMacroId,
    selectedMicroId,
    onMacroSelect,
    onMicroSelect,
    onNavigateToObjectives,
}: UseMinasMicroMapNavigationParams) {
    const [viewLevel, setViewLevel] = useState<MapViewLevel>("MACRO");
    const [selectedMacro, setSelectedMacro] = useState<string | null>(null);
    const [selectedMicro, setSelectedMicro] = useState<string | null>(null);

    const geoMaps = useMemo(() => createGeoLookupMaps(), []);

    const resolveMacroName = useCallback((term: string | null): string | null => {
        if (!term) return null;

        if (term.startsWith("MAC")) {
            return geoMaps.macroIdToName[term] || null;
        }

        const normalized = normalize(term);
        return geoMaps.macroNormalizedToOriginal[normalized] || term;
    }, [geoMaps]);

    const findMacroKey = useCallback((name: string | null) => {
        return findMacroKeyInObject(name, macroregions);
    }, []);

    useEffect(() => {
        const incomingMacroName = resolveMacroName(selectedMacroId ?? null);
        const currentNorm = selectedMacro ? normalize(selectedMacro) : null;
        const incomingNorm = incomingMacroName ? normalize(incomingMacroName) : null;

        if (incomingNorm === currentNorm) {
            return;
        }

        if (incomingMacroName && selectedMacroId !== "all") {
            setSelectedMacro(incomingMacroName);
            setViewLevel("MICRO");
            return;
        }

        if (!selectedMacroId || selectedMacroId === "all") {
            setSelectedMacro(null);
            setSelectedMicro(null);
            setViewLevel("MACRO");
        }
    }, [resolveMacroName, selectedMacro, selectedMacroId]);

    useEffect(() => {
        if (selectedMicroId === selectedMicro) {
            return;
        }

        if (selectedMicroId && selectedMicroId !== "all") {
            const microObj = MICROREGIOES.find((micro) => micro.id === selectedMicroId);

            if (!microObj) {
                return;
            }

            setSelectedMicro(microObj.nome);

            if (microObj.macrorregiao !== selectedMacro) {
                setSelectedMacro(microObj.macrorregiao);
                setViewLevel("MICRO");
            }

            return;
        }

        if (!selectedMicroId || selectedMicroId === "all") {
            setSelectedMicro(null);
            if (selectedMacro) {
                setViewLevel("MICRO");
            }
        }
    }, [selectedMacro, selectedMicro, selectedMicroId]);

    const resetToMacroView = useCallback(() => {
        setViewLevel("MACRO");
        setSelectedMacro(null);
        setSelectedMicro(null);
        onMacroSelect?.(null);
        onMicroSelect?.(null);
    }, [onMacroSelect, onMicroSelect]);

    const clearSelectedMicro = useCallback(() => {
        setViewLevel("MICRO");
        setSelectedMicro(null);
        onMicroSelect?.(null);
    }, [onMicroSelect]);

    const getMicroIdByName = useCallback((name: string) => {
        const normalized = normalize(name);
        return MICROREGIOES.find((micro) => normalize(micro.nome) === normalized)?.id || null;
    }, []);

    const handleSidebarMicroSelect = useCallback((microName: string, isSelected: boolean) => {
        const microId = getMicroIdByName(microName);

        if (isSelected) {
            if (microId) {
                onNavigateToObjectives?.(microId);
            }
            return;
        }

        setSelectedMicro(microName);
        onMicroSelect?.(microId);
    }, [getMicroIdByName, onMicroSelect, onNavigateToObjectives]);

    const handleBack = useCallback(() => {
        if (viewLevel === "MICRO") {
            resetToMacroView();
        }
    }, [resetToMacroView, viewLevel]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && viewLevel === "MICRO") {
                resetToMacroView();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [resetToMacroView, viewLevel]);

    return {
        geoMaps,
        findMacroKey,
        handleBack,
        handleSidebarMicroSelect,
        resetToMacroView,
        resolveMacroName,
        selectedMacro,
        selectedMicro,
        setSelectedMacro,
        setSelectedMicro,
        setViewLevel,
        clearSelectedMicro,
        viewLevel,
    };
}
