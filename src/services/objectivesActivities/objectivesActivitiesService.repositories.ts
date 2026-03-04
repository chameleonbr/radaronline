import type {
  ActivityCreateResult,
  ActivityDTO,
  ActivityUpdateInput,
  ObjectiveDTO,
} from './objectivesActivitiesService.types';
import { getPlatformClient } from '../platformClient';

const platformClient = getPlatformClient;
const OBJECTIVE_FIELDS =
  'id, title, status, microregiao_id, created_at, eixo, description, eixo_label, eixo_color';
const ACTIVITY_FIELDS = 'id, objective_id, title, description, microregiao_id, created_at';

export async function listObjectiveRows(microregiaoId?: string): Promise<ObjectiveDTO[]> {
  let query = platformClient()
    .from('objectives')
    .select(OBJECTIVE_FIELDS)
    .order('id', { ascending: true });

  if (microregiaoId && microregiaoId !== 'all') {
    query = query.eq('microregiao_id', microregiaoId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message || 'Erro ao carregar objetivos');
  }

  return (data as ObjectiveDTO[] | null) || [];
}

export async function listActivityRows(microregiaoId?: string): Promise<ActivityDTO[]> {
  let query = platformClient()
    .from('activities')
    .select(ACTIVITY_FIELDS)
    .order('id', { ascending: true });

  if (microregiaoId && microregiaoId !== 'all') {
    query = query.eq('microregiao_id', microregiaoId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message || 'Erro ao carregar atividades');
  }

  return (data as ActivityDTO[] | null) || [];
}

export async function insertObjectiveRow(
  title: string,
  microregiaoId: string
): Promise<Pick<ObjectiveDTO, 'id' | 'title'>> {
  const { data, error } = await platformClient()
    .from('objectives')
    .insert({ title, status: 'on-track', microregiao_id: microregiaoId })
    .select('id, title')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Erro ao criar objetivo');
  }

  return data as Pick<ObjectiveDTO, 'id' | 'title'>;
}

export async function updateObjectiveRow(
  id: number,
  payload: Record<string, unknown>
): Promise<void> {
  const { error } = await platformClient()
    .from('objectives')
    .update(payload)
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Erro ao atualizar objetivo');
  }
}

export async function deleteObjectiveRow(id: number): Promise<void> {
  const { error } = await platformClient()
    .from('objectives')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Erro ao excluir objetivo');
  }
}

export async function insertActivityRow(
  objectiveId: number,
  id: string,
  title: string,
  microregiaoId: string,
  description: string
): Promise<ActivityCreateResult> {
  const { data, error } = await platformClient()
    .from('activities')
    .insert({
      id,
      objective_id: objectiveId,
      title,
      description,
      microregiao_id: microregiaoId,
    })
    .select('id, title, description')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Erro ao criar atividade');
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
  };
}

export async function updateActivityRow(
  id: string,
  updates: ActivityUpdateInput
): Promise<void> {
  const { error } = await platformClient()
    .from('activities')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Erro ao atualizar atividade');
  }
}

export async function deleteActivityRow(id: string): Promise<void> {
  const { error } = await platformClient()
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Erro ao excluir atividade');
  }
}

export async function updateActionActivityReference(
  uid: string,
  newActivityId: string
): Promise<void> {
  const { error } = await platformClient()
    .from('actions')
    .update({ activity_id: newActivityId })
    .eq('uid', uid);

  if (error) {
    throw new Error(error.message || 'Erro ao mover acao');
  }
}
