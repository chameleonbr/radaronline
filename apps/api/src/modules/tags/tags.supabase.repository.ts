import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAdminClient } from '../../shared/persistence/supabase-admin.js';
import type { CreateTagInput, TagRecord } from './tags.types.js';
import type { TagsRepository } from './tags.repository.js';

type TagRow = {
  id: string;
  name: string;
  color: string;
  favorite_micros: string[] | null;
};

type ActionTagAssignmentRow = {
  tag_id: string;
  tag: TagRow | TagRow[] | null;
};

async function lookupActionDbId(client: SupabaseClient, actionUid: string): Promise<string | null> {
  const { data, error } = await client.from('actions').select('id').eq('uid', actionUid).maybeSingle();
  if (error) throw new Error(error.message || 'Failed to resolve action uid');
  return (data as { id: string } | null)?.id || null;
}

function mapTagRow(row: TagRow): TagRecord {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    favoriteMicros: row.favorite_micros || [],
  };
}

export class SupabaseTagsRepository implements TagsRepository {
  constructor(private readonly client: SupabaseClient = getSupabaseAdminClient()) {}

  async list(): Promise<TagRecord[]> {
    const { data, error } = await this.client
      .from('action_tags')
      .select('id, name, color, favorite_micros')
      .order('name', { ascending: true });
    if (error) throw new Error(error.message || 'Failed to list tags');
    return ((data || []) as TagRow[]).map(mapTagRow);
  }

  async getById(tagId: string): Promise<TagRecord | null> {
    const { data, error } = await this.client
      .from('action_tags')
      .select('id, name, color, favorite_micros')
      .eq('id', tagId)
      .maybeSingle();
    if (error) throw new Error(error.message || 'Failed to get tag');
    return data ? mapTagRow(data as TagRow) : null;
  }

  async create(input: CreateTagInput): Promise<TagRecord> {
    const { data, error } = await this.client
      .from('action_tags')
      .insert({
        name: input.name.toUpperCase(),
        color: `hsl(${Math.abs(input.name.length * 37) % 360}, 70%, 45%)`,
        created_by: input.createdBy,
      })
      .select('id, name, color, favorite_micros')
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to create tag');
    return mapTagRow(data as TagRow);
  }

  async delete(tagId: string): Promise<boolean> {
    const { error } = await this.client.from('action_tags').delete().eq('id', tagId);
    if (error) throw new Error(error.message || 'Failed to delete tag');
    return true;
  }

  async updateFavoriteMicros(tagId: string, favoriteMicros: string[]): Promise<boolean> {
    const { error } = await this.client
      .from('action_tags')
      .update({ favorite_micros: favoriteMicros })
      .eq('id', tagId);
    if (error) throw new Error(error.message || 'Failed to update favorite micros');
    return true;
  }

  async listActionTags(actionUid: string): Promise<TagRecord[]> {
    const { data, error } = await this.client
      .from('action_tag_assignments')
      .select(`
        tag_id,
        tag:action_tags(id, name, color, favorite_micros)
      `)
      .eq('action_uid', actionUid);
    if (error) throw new Error(error.message || 'Failed to list action tags');

    return ((data || []) as ActionTagAssignmentRow[])
      .map((row) => Array.isArray(row.tag) ? row.tag[0] : row.tag)
      .filter((item): item is TagRow => Boolean(item))
      .map(mapTagRow);
  }

  async assignToAction(actionUid: string, tagId: string): Promise<void> {
    const actionDbId = await lookupActionDbId(this.client, actionUid);
    const payload: Record<string, string> = {
      action_uid: actionUid,
      tag_id: tagId,
    };
    if (actionDbId) {
      payload.action_id = actionDbId;
    }

    const { error } = await this.client
      .from('action_tag_assignments')
      .upsert(payload, { onConflict: 'action_uid,tag_id' });
    if (error) throw new Error(error.message || 'Failed to assign tag');
  }

  async removeFromAction(actionUid: string, tagId: string): Promise<void> {
    const { error } = await this.client
      .from('action_tag_assignments')
      .delete()
      .eq('action_uid', actionUid)
      .eq('tag_id', tagId);
    if (error) throw new Error(error.message || 'Failed to remove tag assignment');
  }
}
