export interface ObjectiveRecord {
  id: number;
  title: string;
  status: 'on-track' | 'delayed';
  microregionId: string;
  eixo?: number;
  description?: string;
  eixoLabel?: string;
  eixoColor?: string;
}

export interface ActivityRecord {
  id: string;
  objectiveId: number;
  title: string;
  description: string;
  microregionId: string;
}

export interface CreateObjectiveInput {
  title: string;
  microregionId: string;
}

export interface UpdateObjectiveInput {
  title?: string;
  status?: 'on-track' | 'delayed';
  eixo?: number;
  description?: string;
  eixoLabel?: string;
  eixoColor?: string;
}

export interface CreateActivityInput {
  objectiveId: number;
  id: string;
  title: string;
  microregionId: string;
  description?: string;
}

export interface UpdateActivityInput {
  title?: string;
  description?: string;
}
