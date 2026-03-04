import type { Action, Activity, Objective, Status } from "../../../types";

export type OptimizedViewMode = "tree" | "cards" | "list" | "kanban";
export type OptimizedStatusFilter = Status | "all" | "late" | "alert";

export interface OptimizedActivityGroup extends Activity {
  actions: Action[];
  progress: number;
  lateCount: number;
}

export interface OptimizedObjectiveGroup extends Objective {
  activities: OptimizedActivityGroup[];
  actionCount: number;
  progress: number;
  lateCount: number;
}
