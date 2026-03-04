import type React from "react";
import type { MutableRefObject } from "react";

import type { Action } from "../../../types";

import type { GanttConfig } from "../gantt.types";
import { GanttGridBackground } from "./GanttGridBackground";
import { GanttTimelineHeader } from "./GanttTimelineHeader";
import { GanttTimelineRow } from "./GanttTimelineRow";

interface GanttDesktopContentProps {
  filteredActions: Action[];
  ganttConfig: GanttConfig;
  todayPos: number;
  focusedIdx: number;
  isDragging: boolean;
  scrollContainerRef: MutableRefObject<HTMLDivElement | null>;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseUp: () => void;
  onMouseMove: (event: React.MouseEvent) => void;
  onActionClick: (action: Action) => void;
  onBarMouseEnter: (action: Action, event: React.MouseEvent<HTMLDivElement>) => void;
  onBarMouseLeave: () => void;
  onScrollToPosition: (position: number, smooth?: boolean) => void;
  getPosition: (date: Date | null) => number;
}

export function GanttDesktopContent({
  filteredActions,
  ganttConfig,
  todayPos,
  focusedIdx,
  isDragging,
  scrollContainerRef,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  onMouseMove,
  onActionClick,
  onBarMouseEnter,
  onBarMouseLeave,
  onScrollToPosition,
  getPosition,
}: GanttDesktopContentProps) {
  return (
    <div
      className={`flex-1 relative overflow-x-auto ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      ref={scrollContainerRef}
      style={{ overflow: "visible auto" }}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className="min-w-fit relative" style={{ overflow: "visible" }}>
        <GanttTimelineHeader ganttConfig={ganttConfig} />

        <div className="relative" style={{ overflow: "visible" }}>
          <GanttGridBackground ganttConfig={ganttConfig} todayPos={todayPos} />

          {filteredActions.map((action, index) => (
            <GanttTimelineRow
              key={action.id}
              action={action}
              ganttConfig={ganttConfig}
              isFocused={focusedIdx === index}
              getPosition={getPosition}
              onActionClick={onActionClick}
              onBarMouseEnter={onBarMouseEnter}
              onBarMouseLeave={onBarMouseLeave}
              onScrollToPosition={onScrollToPosition}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
