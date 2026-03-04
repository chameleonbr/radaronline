import React, { useEffect, useRef, useState } from "react";
import { ResponsiveContainer } from "recharts";

interface DashboardSafeResponsiveContainerProps {
    children: React.ReactNode;
    minHeight?: number;
}

export function DashboardSafeResponsiveContainer({ children, minHeight }: DashboardSafeResponsiveContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<{ height: number; width: number } | null>(null);

    useEffect(() => {
        let animationFrameId = 0;

        const checkDimensions = () => {
            if (!containerRef.current) {
                return;
            }

            const { height, width } = containerRef.current.getBoundingClientRect();
            if (width > 0 && height > 0) {
                setDimensions({ height: Math.floor(height), width: Math.floor(width) });
            }
        };

        checkDimensions();

        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(checkDimensions);
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ height: "100%", minHeight: minHeight ? `${minHeight}px` : "250px", width: "100%" }}>
            {dimensions ? (
                <ResponsiveContainer height={dimensions.height} width={dimensions.width}>
                    {children}
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    Carregando gráfico...
                </div>
            )}
        </div>
    );
}
