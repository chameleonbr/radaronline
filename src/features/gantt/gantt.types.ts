import type { Action, GanttRange, Status } from "../../types";

export type GanttStatusFilter = Status | "all";

export interface GanttChartProps {
  actions: Action[];
  ganttRange: GanttRange;
  setGanttRange: (range: GanttRange) => void;
  containerWidth: number;
  statusFilter: GanttStatusFilter;
  setStatusFilter: (filter: GanttStatusFilter) => void;
  onActionClick: (action: Action) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  isMobile?: boolean;
}

export interface HoveredActionState {
  action: Action;
  rect: DOMRect;
}

export interface GanttMonthSegment {
  date: Date;
  startIdx: number;
  count: number;
}

export interface GanttConfig {
  start: Date;
  end: Date;
  days: Date[];
  months: GanttMonthSegment[];
  columnWidth: number;
  totalWidth: number;
}

export interface GanttStatusStyle {
  badgeClassName: string;
  mobileBorderClassName: string;
  barClassName: string;
  progressClassName: string;
  borderColor: string;
  tooltipClassName: string;
}
