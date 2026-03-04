import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";

import { getTodayStr, parseDateLocal, ZOOM_LEVELS } from "../../lib/date";
import { logError } from "../../lib/logger";

import { GANTT_EXPORT_SCALE, GANTT_SIDEBAR_WIDTH } from "./gantt.constants";
import { GanttDesktopContent } from "./components/GanttDesktopContent";
import { GanttMobileList } from "./components/GanttMobileList";
import { GanttToolbar } from "./components/GanttToolbar";
import { GanttTooltip } from "./components/GanttTooltip";
import type { GanttChartProps, HoveredActionState } from "./gantt.types";
import { buildGanttConfig, getDatePosition, getSortedFilteredActions } from "./gantt.utils";

export const GanttChart: React.FC<GanttChartProps> = ({
  actions,
  ganttRange,
  setGanttRange,
  containerWidth,
  statusFilter,
  setStatusFilter,
  onActionClick,
  showToast,
  isMobile = false,
}) => {
  const [showLegend, setShowLegend] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [hoveredAction, setHoveredAction] = useState<HoveredActionState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const ganttRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredActions = useMemo(() => getSortedFilteredActions(actions, statusFilter), [actions, statusFilter]);
  const ganttConfig = useMemo(
    () => buildGanttConfig(filteredActions, ganttRange, containerWidth),
    [filteredActions, ganttRange, containerWidth],
  );

  const getPosition = useCallback(
    (date: Date | null) => getDatePosition(date, ganttConfig),
    [ganttConfig],
  );

  const todayPos = getPosition(parseDateLocal(getTodayStr())) + ganttConfig.columnWidth / 2;

  const handleBarMouseEnter = useCallback((action: HoveredActionState["action"], event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredAction({ action, rect: event.currentTarget.getBoundingClientRect() });
  }, []);

  const handleBarMouseLeave = useCallback(() => {
    setHoveredAction(null);
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    if ((event.target as HTMLElement).closest(".group\\/bar")) return;

    setIsDragging(true);
    setStartX(event.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return;

      event.preventDefault();
      const x = event.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, scrollLeft, startX],
  );

  const scrollToPosition = useCallback(
    (position: number, smooth = true) => {
      if (!scrollContainerRef.current) return;
      if (position < 0 || position > ganttConfig.totalWidth) return;

      const containerWidthWithoutSidebar = scrollContainerRef.current.clientWidth - GANTT_SIDEBAR_WIDTH;
      const centerOffset = Math.max(0, containerWidthWithoutSidebar / 2);
      const target = Math.max(0, position - centerOffset);

      scrollContainerRef.current.scrollTo({
        left: target,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [ganttConfig.totalWidth],
  );

  useEffect(() => {
    setFocusedIdx((previous) => {
      if (filteredActions.length === 0) return -1;
      return Math.min(previous, filteredActions.length - 1);
    });
  }, [filteredActions.length]);

  useEffect(() => {
    const handleScroll = () => {
      setHoveredAction((previous) => (previous ? null : previous));
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const timer = window.setTimeout(() => {
      const firstTaskStart = actions.length > 0 ? parseDateLocal(actions[0].startDate) : null;
      const today = new Date();
      const isTodayInRange = today >= ganttConfig.start && today <= ganttConfig.end;

      if (isTodayInRange && todayPos > 0) {
        scrollToPosition(todayPos, true);
      } else if (firstTaskStart) {
        scrollToPosition(getPosition(firstTaskStart), true);
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [actions, ganttConfig.end, ganttConfig.start, getPosition, ganttRange, scrollToPosition, todayPos]);

  const exportAsPng = useCallback(async () => {
    if (!ganttRef.current || isExporting) return;

    setIsExporting(true);
    showToast("Gerando imagem...", "info");

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(ganttRef.current, {
        backgroundColor: "#ffffff",
        scale: GANTT_EXPORT_SCALE,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `gantt-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      showToast("Imagem exportada com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao exportar imagem", "error");
      logError("GanttChart", "Export error", error);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, showToast]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const isHeaderHover = target.closest(".gantt-header");

      if (!isHeaderHover && !event.ctrlKey) return;

      event.preventDefault();
      const currentIndex = ZOOM_LEVELS.indexOf(ganttRange);
      if (currentIndex === -1) return;

      if (event.deltaY < 0) {
        const nextIndex = Math.max(0, currentIndex - 1);
        if (nextIndex !== currentIndex) {
          setGanttRange(ZOOM_LEVELS[nextIndex]);
        }
        return;
      }

      const nextIndex = Math.min(ZOOM_LEVELS.length - 1, currentIndex + 1);
      if (nextIndex !== currentIndex) {
        setGanttRange(ZOOM_LEVELS[nextIndex]);
      }
    },
    [ganttRange, setGanttRange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (filteredActions.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIdx((previous) => Math.min(previous + 1, filteredActions.length - 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIdx((previous) => Math.max(previous - 1, 0));
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIdx >= 0 && focusedIdx < filteredActions.length) {
            onActionClick(filteredActions[focusedIdx]);
          }
          break;
        case "Home":
          event.preventDefault();
          setFocusedIdx(0);
          break;
        case "End":
          event.preventDefault();
          setFocusedIdx(filteredActions.length - 1);
          break;
        default:
          break;
      }
    },
    [filteredActions, focusedIdx, onActionClick],
  );

  if (isMobile) {
    return (
      <GanttMobileList
        filteredActions={filteredActions}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onActionClick={onActionClick}
      />
    );
  }

  return (
    <>
      <div
        className={`flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all ${isFullscreen ? "fixed inset-4 z-50" : "h-full"}`}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={ganttRef}
      >
        <GanttToolbar
          ganttRange={ganttRange}
          statusFilter={statusFilter}
          showLegend={showLegend}
          isExporting={isExporting}
          isFullscreen={isFullscreen}
          onStatusFilterChange={setStatusFilter}
          onRangeChange={setGanttRange}
          onExport={exportAsPng}
          onToggleFullscreen={() => setIsFullscreen((previous) => !previous)}
          onToggleLegend={() => setShowLegend((previous) => !previous)}
        />

        <GanttDesktopContent
          filteredActions={filteredActions}
          ganttConfig={ganttConfig}
          todayPos={todayPos}
          focusedIdx={focusedIdx}
          isDragging={isDragging}
          scrollContainerRef={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onActionClick={onActionClick}
          onBarMouseEnter={handleBarMouseEnter}
          onBarMouseLeave={handleBarMouseLeave}
          onScrollToPosition={scrollToPosition}
          getPosition={getPosition}
        />
      </div>

      <GanttTooltip hoveredAction={hoveredAction} />
    </>
  );
};
