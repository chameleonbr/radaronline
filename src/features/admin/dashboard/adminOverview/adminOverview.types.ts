import type {
  DeadlineItem,
  MicroCoverage,
  ObjectiveProgress,
  OverdueAction,
  StatusItem,
} from "../kpiDetailModal/kpiDetailModal.types";

export interface AdminOverviewMetricItem {
  [key: string]: string | number;
  name: string;
  value: number;
  color: string;
}

export interface AdminOverviewMetrics {
  totalAcoes: number;
  concluidas: number;
  andamento: number;
  naoIniciadas: number;
  atrasadas: number;
  taxaConclusao: number;
  taxaCobertura: number;
  usuariosAtivos: number;
  concluidasComAtraso: number;
  concluidasAntes: number;
  deadlineHorizon: AdminOverviewMetricItem[];
}

export interface ReprogrammedAction {
  uid: string;
  id: string;
  title: string;
  plannedEndDate: string;
  actualEndDate: string;
  responsible: string;
  daysLate?: number;
  daysEarly?: number;
}

export interface AdminOverviewDetailedData {
  objectiveProgress: ObjectiveProgress[];
  overdueActions: OverdueAction[];
  microCoverage: MicroCoverage[];
  deadlineHorizonWithActions: DeadlineItem[];
  statusWithActions: StatusItem[];
  lateCompletions: ReprogrammedAction[];
  earlyCompletions: ReprogrammedAction[];
}
