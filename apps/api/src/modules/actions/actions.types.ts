export type ActionStatus = 'Concluido' | 'Em Andamento' | 'Nao Iniciado' | 'Atrasado';

export interface ActionRecord {
  dbId: string;
  uid: string;
  actionId: string;
  activityId: string;
  microregionId: string;
  title: string;
  status: ActionStatus;
  startDate: string | null;
  plannedEndDate: string | null;
  endDate: string | null;
  progress: number;
  notes: string;
}

export interface CreateActionInput {
  activityId: string;
  microregionId: string;
  actionNumber: number;
  title: string;
  createdBy: string;
}

export interface UpdateActionInput {
  title?: string;
  status?: ActionStatus;
  startDate?: string | null;
  plannedEndDate?: string | null;
  endDate?: string | null;
  progress?: number;
  notes?: string;
}
