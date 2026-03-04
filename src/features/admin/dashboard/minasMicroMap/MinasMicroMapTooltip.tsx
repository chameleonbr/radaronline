import type { HoveredInfo, MapViewLevel } from "./minasMicroMap.types";

export function MinasMicroMapTooltip({
    hoveredInfo,
    mousePos,
    viewLevel,
}: {
    hoveredInfo: HoveredInfo | null;
    mousePos: { x: number; y: number };
    viewLevel: MapViewLevel;
}) {
    if (!hoveredInfo?.micro || viewLevel !== "MICRO") {
        return null;
    }

    return (
        <div className="magnetic-tooltip flex flex-col items-center gap-0.5" style={{ left: mousePos.x, top: mousePos.y }}>
            <span className="text-[9px] opacity-50 font-semibold leading-none mb-0.5">{hoveredInfo.macro}</span>
            <span className="whitespace-nowrap leading-none">{hoveredInfo.micro}</span>
        </div>
    );
}
