import { getPlatformClient } from '../platformClient';
import type {
  ActionCommentDTO,
  CommentAuthorProfile,
  InsertCommentInput,
  InsertedCommentRow,
} from './commentsService.types';

const platformClient = getPlatformClient;
const COMMENT_AUTHOR_FIELDS = 'nome, microregiao_id, avatar_id, role, municipio';

export async function listActionCommentRows(actionId: string): Promise<ActionCommentDTO[]> {
  const { data, error } = await platformClient()
    .from('action_comments')
    .select(`
      id, action_id, author_id, parent_id, content, created_at,
      author:profiles(${COMMENT_AUTHOR_FIELDS})
    `)
    .eq('action_id', actionId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as ActionCommentDTO[] | null) || [];
}

export async function fetchCommentAuthorProfile(
  userId: string
): Promise<CommentAuthorProfile | null> {
  const { data, error } = await platformClient()
    .from('profiles')
    .select(COMMENT_AUTHOR_FIELDS)
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return (data as CommentAuthorProfile | null) || null;
}

export async function insertCommentRow(
  input: InsertCommentInput
): Promise<InsertedCommentRow> {
  const { data, error } = await platformClient()
    .from('action_comments')
    .insert(input)
    .select('id, parent_id, content, created_at')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Erro ao adicionar comentario');
  }

  return data as InsertedCommentRow;
}

export async function updateCommentRow(commentId: string, content: string): Promise<void> {
  const { error } = await platformClient()
    .from('action_comments')
    .update({ content })
    .eq('id', commentId);

  if (error) {
    throw new Error(error.message || 'Erro ao atualizar comentario');
  }
}

export async function deleteChildCommentRows(commentId: string): Promise<void> {
  const { error } = await platformClient()
    .from('action_comments')
    .delete()
    .eq('parent_id', commentId);

  if (error) {
    throw error;
  }
}

export async function deleteCommentRow(commentId: string): Promise<void> {
  const { error } = await platformClient()
    .from('action_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    throw new Error(error.message || 'Erro ao excluir comentario');
  }
}

export async function listMentionedProfiles(mentionedUserName: string): Promise<Array<{ id: string }>> {
  const { data, error } = await platformClient()
    .from('profiles')
    .select('id')
    .ilike('nome', mentionedUserName);

  if (error) {
    throw error;
  }

  return ((data || []) as Array<{ id: string }>);
}
