import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAdminClient } from '../../shared/persistence/supabase-admin.js';
import type { ActionCommentRecord, CreateCommentInput } from './comments.types.js';
import type { CommentsRepository } from './comments.repository.js';

type CommentAuthorRow = {
  nome: string | null;
  microregiao_id: string | null;
  avatar_id: string | null;
  role: string | null;
  municipio: string | null;
};

type CommentRow = {
  id: string;
  action_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  author?: CommentAuthorRow | CommentAuthorRow[] | null;
};

async function lookupActionDbId(client: SupabaseClient, actionUid: string): Promise<string | null> {
  const { data, error } = await client.from('actions').select('id').eq('uid', actionUid).maybeSingle();
  if (error) {
    throw new Error(error.message || 'Failed to resolve action uid');
  }

  return (data as { id: string } | null)?.id || null;
}

function mapCommentRow(row: CommentRow, actionUid: string): ActionCommentRecord {
  const author = Array.isArray(row.author) ? row.author[0] : row.author;
  return {
    id: row.id,
    actionUid,
    parentId: row.parent_id,
    authorId: row.author_id,
    authorName: author?.nome || 'Usuario',
    authorMunicipio: author?.municipio || author?.microregiao_id || '',
    authorAvatarId: author?.avatar_id || 'zg10',
    authorRole: author?.role || undefined,
    content: row.content,
    createdAt: row.created_at,
  };
}

export class SupabaseCommentsRepository implements CommentsRepository {
  constructor(private readonly client: SupabaseClient = getSupabaseAdminClient()) {}

  async listByActionUid(actionUid: string): Promise<ActionCommentRecord[]> {
    const actionDbId = await lookupActionDbId(this.client, actionUid);
    if (!actionDbId) return [];

    const { data, error } = await this.client
      .from('action_comments')
      .select(`
        id, action_id, author_id, parent_id, content, created_at,
        author:profiles(nome, microregiao_id, avatar_id, role, municipio)
      `)
      .eq('action_id', actionDbId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message || 'Failed to list comments');
    }

    return ((data || []) as CommentRow[]).map((item) => mapCommentRow(item, actionUid));
  }

  async getById(commentId: string): Promise<ActionCommentRecord | null> {
    const { data, error } = await this.client
      .from('action_comments')
      .select(`
        id, action_id, author_id, parent_id, content, created_at,
        action:actions(uid),
        author:profiles(nome, microregiao_id, avatar_id, role, municipio)
      `)
      .eq('id', commentId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || 'Failed to get comment');
    }

    if (!data) return null;
    const row = data as CommentRow & { action?: { uid?: string } | Array<{ uid?: string }> | null };
    const action = Array.isArray(row.action) ? row.action[0] : row.action;
    return mapCommentRow(row, action?.uid || '');
  }

  async create(input: CreateCommentInput): Promise<ActionCommentRecord> {
    const actionDbId = await lookupActionDbId(this.client, input.actionUid);
    if (!actionDbId) {
      throw new Error('ACTION_NOT_FOUND');
    }

    const { data, error } = await this.client
      .from('action_comments')
      .insert({
        action_id: actionDbId,
        author_id: input.authorId,
        parent_id: input.parentId || null,
        content: input.content.trim(),
      })
      .select(`
        id, action_id, author_id, parent_id, content, created_at,
        author:profiles(nome, microregiao_id, avatar_id, role, municipio)
      `)
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create comment');
    }

    return mapCommentRow(data as CommentRow, input.actionUid);
  }

  async update(commentId: string, content: string): Promise<boolean> {
    const { error } = await this.client.from('action_comments').update({ content }).eq('id', commentId);
    if (error) {
      throw new Error(error.message || 'Failed to update comment');
    }

    return true;
  }

  async deleteChildren(commentId: string): Promise<void> {
    const { error } = await this.client.from('action_comments').delete().eq('parent_id', commentId);
    if (error) {
      throw new Error(error.message || 'Failed to delete child comments');
    }
  }

  async delete(commentId: string): Promise<boolean> {
    const { error } = await this.client.from('action_comments').delete().eq('id', commentId);
    if (error) {
      throw new Error(error.message || 'Failed to delete comment');
    }

    return true;
  }
}
