export interface ActionDTO {
  id: string;
  uid: string;
  action_id: string;
  activity_id: string;
  microregiao_id: string;
  title: string;
  status: string;
  start_date: string | null;
  planned_end_date: string | null;
  end_date: string | null;
  progress: number;
  notes: string;
}

export interface ActionRaciDTO {
  id: string;
  action_id: string;
  member_name: string;
  role: string;
}

export interface ActionCommentDTO {
  id: string;
  action_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  author?:
    | {
        nome: string;
        microregiao_id: string | null;
        avatar_id: string | null;
        role: string | null;
        municipio: string | null;
      }
    | Array<{
        nome: string;
        microregiao_id: string | null;
        avatar_id: string | null;
        role: string | null;
        municipio: string | null;
      }>;
}

export interface ActionTagDTO {
  id: string;
  name: string;
  color: string;
}

export interface LoadedActionRow extends ActionDTO {
  raci?: ActionRaciDTO[];
  comments?: Array<{ count?: number }>;
  tags?: Array<{ tag?: ActionTagDTO | null }> | { tag?: ActionTagDTO | null };
}
