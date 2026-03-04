import type { MapThemeColors } from "./minasMicroMap.types";

export function MinasMicroMapStyles({
    isDark,
    themeColors,
}: {
    isDark: boolean;
    themeColors: MapThemeColors;
}) {
    return (
        <style>{`
            .leaflet-interactive {
                cursor: pointer !important;
                transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                            fill-opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                            stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .leaflet-container { background: ${themeColors.mapBg}; }

            .magnetic-tooltip {
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                padding: 8px 14px;
                background: ${isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)"};
                backdrop-filter: blur(8px);
                color: ${isDark ? "white" : "#1e293b"};
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.03em;
                border-radius: 10px;
                transform: translate(-50%, -150%);
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                border: 1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};
            }
        `}</style>
    );
}
