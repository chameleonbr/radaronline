import type { Activity, Objective } from '../../types';

export interface ObjectiveDTO {
  id: number;
  title: string;
  status: string;
  microregiao_id: string;
  created_at: string;
  eixo?: number;
  description?: string;
  eixo_label?: string;
  eixo_color?: string;
}

export interface ActivityDTO {
  id: string;
  objective_id: number;
  title: string;
  description: string | null;
  microregiao_id: string;
  created_at: string;
}

export type ObjectiveRecord = Pick<
  Objective,
  'id' | 'title' | 'status' | 'eixo' | 'description' | 'eixoLabel' | 'eixoColor'
> & {
  microregiaoId: string;
};

export type ObjectiveUpdateInput = {
  title?: string;
  status?: 'on-track' | 'delayed';
  eixo?: number;
  description?: string;
  eixoLabel?: string;
  eixoColor?: string;
};

export type ActivityCreateResult = Pick<Activity, 'id' | 'title' | 'description'>;
export type ActivityUpdateInput = { title?: string; description?: string };
