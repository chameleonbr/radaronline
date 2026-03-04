import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

export function SafeResponsiveContainer({
  children,
  minHeight = 150,
}: {
  children: ReactNode;
  minHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const checkDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
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
    <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: `${minHeight}px` }}>
      {dimensions ? (
        <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: `${minHeight}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c757d",
          }}
        >
          Carregando...
        </div>
      )}
    </div>
  );
}
