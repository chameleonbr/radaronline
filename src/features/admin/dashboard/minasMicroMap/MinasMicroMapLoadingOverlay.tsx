import type { MapThemeColors } from "./minasMicroMap.types";

export function MinasMicroMapLoadingOverlay({
    loading,
    themeColors,
}: {
    loading: boolean;
    themeColors: MapThemeColors;
}) {
    if (!loading) {
        return null;
    }

    return (
        <div className={`absolute inset-0 flex items-center justify-center z-[90] ${themeColors.bg}`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-teal-500 font-medium animate-pulse">Carregando mapa...</p>
            </div>
        </div>
    );
}
