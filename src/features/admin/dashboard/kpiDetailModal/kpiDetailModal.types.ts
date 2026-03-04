export type KpiType = "conclusao" | "risco" | "cobertura" | "horizonte" | "status";

export interface ObjectiveProgress {
  id: number;
  name: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface OverdueAction {
  uid: string;
  id: string;
  title: string;
  plannedEndDate: string;
  responsible: string;
  daysOverdue: number;
}

export interface MicroCoverage {
  id: string;
  nome: string;
  macrorregiao: string;
  hasActions: boolean;
  actionCount: number;
}

export interface ActionSummary {
  uid: string;
  id: string;
  title: string;
  status: string;
  plannedEndDate: string;
  responsible?: string;
  microName?: string;
}

export interface DeadlineItem {
  name: string;
  value: number;
  color: string;
  actions?: ActionSummary[];
}

export interface StatusItem {
  name: string;
  value: number;
  color: string;
  actions?: ActionSummary[];
}

export interface KpiDetailModalProps {
  type: KpiType;
  isOpen: boolean;
  onClose: () => void;
  objectiveProgress?: ObjectiveProgress[];
  overdueActions?: OverdueAction[];
  microCoverage?: MicroCoverage[];
  deadlineHorizon?: DeadlineItem[];
  statusData?: StatusItem[];
  totalActions?: number;
  completedActions?: number;
  completionRate?: number;
  coverageRate?: number;
  onViewMicro?: (id: string) => void;
}
