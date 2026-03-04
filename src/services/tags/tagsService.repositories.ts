import { getPlatformClient } from '../platformClient';
import type {
  ActionTagAssignmentRow,
  ActionTagRow,
} from './tagsService.types';

const platformClient = getPlatformClient;

export async function listTagRows(): Promise<ActionTagRow[]> {
  const { data, error } = await platformClient()
    .from('action_tags')
    .select('id, name, color, favorite_micros')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Erro ao carregar tags');
  }

  return (data as ActionTagRow[] | null) || [];
}

export async function fetchTagFavoriteMicros(tagId: string): Promise<string[] | null> {
  const { data, error } = await platformClient()
    .from('action_tags')
    .select('favorite_micros')
    .eq('id', tagId)
    .single();

  if (error) {
    throw error;
  }

  return (data?.favorite_micros as string[] | null) || [];
}

export async function updateTagFavoriteMicros(tagId: string, favoriteMicros: string[]): Promise<void> {
  const { error } = await platformClient()
    .from('action_tags')
    .update({ favorite_micros: favoriteMicros })
    .eq('id', tagId);

  if (error) {
    throw error;
  }
}

export async function insertTagRow(
  name: string,
  color: string,
  currentUserId: string
): Promise<ActionTagRow> {
  const { data, error } = await platformClient()
    .from('action_tags')
    .insert({
      name: name.toUpperCase(),
      color,
      created_by: currentUserId,
    })
    .select('id, name, color, favorite_micros')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Erro ao criar tag');
  }

  return data as ActionTagRow;
}

export async function upsertActionTagAssignment(
  actionUid: string,
  tagId: string,
  actionDbId?: string | null
): Promise<void> {
  const insertPayload: Record<string, string> = {
    action_uid: actionUid,
    tag_id: tagId,
  };

  if (actionDbId) {
    insertPayload.action_id = actionDbId;
  }

  const { error } = await platformClient()
    .from('action_tag_assignments')
    .upsert(insertPayload, { onConflict: 'action_uid,tag_id' })
    .select();

  if (error) {
    throw new Error(error.message || 'Erro ao adicionar tag');
  }
}

export async function deleteActionTagAssignment(actionUid: string, tagId: string): Promise<void> {
  const { error } = await platformClient()
    .from('action_tag_assignments')
    .delete()
    .eq('action_uid', actionUid)
    .eq('tag_id', tagId);

  if (error) {
    throw new Error(error.message || 'Erro ao remover tag');
  }
}

export async function listActionTagAssignments(actionUid: string): Promise<ActionTagAssignmentRow[]> {
  const { data, error } = await platformClient()
    .from('action_tag_assignments')
    .select(`
      tag_id,
      tag:action_tags(id, name, color)
    `)
    .eq('action_uid', actionUid);

  if (error) {
    throw error;
  }

  return (data as ActionTagAssignmentRow[] | null) || [];
}

export async function deleteTagRow(tagId: string): Promise<void> {
  const { error } = await platformClient()
    .from('action_tags')
    .delete()
    .eq('id', tagId);

  if (error) {
    throw new Error(error.message || 'Erro ao excluir tag');
  }
}
