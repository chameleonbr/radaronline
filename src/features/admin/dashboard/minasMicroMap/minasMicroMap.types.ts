import type { Action } from "../../../../types";

export type MapViewLevel = "MACRO" | "MICRO";

export type MapHealthStatus = "otimo" | "bom" | "atencao" | "critico" | "sem_dados";

export interface MinasMicroMapProps {
    onMacroSelect?: (macroName: string | null) => void;
    onMicroSelect?: (microName: string | null) => void;
    onNavigateToObjectives?: (microId: string) => void;
    selectedMacroId?: string | null;
    selectedMicroId?: string | null;
    actions?: Action[];
}

export interface HoveredInfo {
    muni?: string | null;
    micro?: string | null;
    macro?: string | null;
}

export interface MapThemeColors {
    bg: string;
    border: string;
    text: string;
    textSecondary: string;
    headerBg: string;
    headerBorder: string;
    mapBg: string;
    macroFill: string;
    macroColor: string;
    macroOpacity: number;
    macroBorder: string;
    microBorder: string;
    unselectedFill: string;
    unselectedColor: string;
    muniUnselectedFill: string;
}

export interface MicroPerformanceStats {
    status: MapHealthStatus;
    concluidas: number;
    atrasadas: number;
    total: number;
}

export interface MacroPerformanceStats {
    total: number;
    concluidas: number;
    atrasadas: number;
}
