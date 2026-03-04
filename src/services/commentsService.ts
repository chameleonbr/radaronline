
import type { ActionComment } from '../types';
import { logError, logWarn } from '../lib/logger';
import { shouldUseBackendCommentsApi } from './apiClient';
import { getActionDbIdByUid } from './actionLookupService';
import {
  createCommentViaBackendApi,
  deleteCommentViaBackendApi,
  listCommentsViaBackendApi,
  updateCommentViaBackendApi,
} from './commentsApi';
import { requireCurrentAuthUser } from './sessionService';
import { createUserRequest } from './requestsService';
import {
  buildInsertedCommentModel,
  extractMentionedNames,
  filterMentionTargets,
  mapActionCommentDTO,
} from './comments/commentsService.helpers';
import {
  deleteChildCommentRows,
  deleteCommentRow,
  fetchCommentAuthorProfile,
  insertCommentRow,
  listActionCommentRows,
  listMentionedProfiles,
  updateCommentRow,
} from './comments/commentsService.repositories';

export async function loadActionComments(actionUid: string): Promise<ActionComment[]> {
  try {
    if (shouldUseBackendCommentsApi()) {
      return listCommentsViaBackendApi(actionUid);
    }
    const actionId = await getActionDbIdByUid(actionUid);
    if (!actionId) {
      logWarn('commentsService', 'Acao nao encontrada ao carregar comentarios', { actionUid });
      return [];
    }

    return (await listActionCommentRows(actionId)).map(mapActionCommentDTO);
  } catch (error) {
    logError('commentsService', 'Erro ao carregar comentarios', error);
    return [];
  }
}

export async function addComment(
  actionUid: string,
  content: string,
  parentId?: string | null
): Promise<ActionComment> {
  try {
    if (shouldUseBackendCommentsApi()) {
      return createCommentViaBackendApi({ actionUid, content, parentId });
    }
    const user = await requireCurrentAuthUser('Usuario nao autenticado');
    const actionId = await getActionDbIdByUid(actionUid);
    if (!actionId) {
      throw new Error('Acao nao encontrada');
    }

    let profile = null;
    try {
      profile = await fetchCommentAuthorProfile(user.id);
    } catch (profileError) {
      logError('commentsService', 'Erro ao buscar perfil do autor', profileError);
    }

    const data = await insertCommentRow({
        action_id: actionId,
        author_id: user.id,
        parent_id: parentId || null,
        content,
      });

    return buildInsertedCommentModel(data, user.id, profile);
  } catch (error) {
    logError('commentsService', 'Erro inesperado ao adicionar comentario', error);
    throw error;
  }
}

export async function updateComment(commentId: string, content: string): Promise<void> {
  try {
    if (shouldUseBackendCommentsApi()) {
      await updateCommentViaBackendApi(commentId, content);
      return;
    }
    await updateCommentRow(commentId, content);
  } catch (error) {
    logError('commentsService', 'Erro ao atualizar comentario', error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  if (shouldUseBackendCommentsApi()) {
    try {
      await deleteCommentViaBackendApi(commentId);
      return;
    } catch (error) {
      logError('commentsService', 'Erro ao excluir comentario via API', error);
      throw error;
    }
  }

  try {
    await deleteChildCommentRows(commentId);
  } catch (childError) {
    logError('commentsService', 'Erro ao excluir respostas do comentario', childError);
  }

  try {
    await deleteCommentRow(commentId);
  } catch (error) {
    logError('commentsService', 'Erro ao excluir comentario', error);
    throw error;
  }
}

export async function createMentionNotification(
  mentionedUserName: string,
  actionTitle: string,
  authorName: string
): Promise<void> {
  try {
    const profiles = await listMentionedProfiles(mentionedUserName);

    if (profiles.length === 0) {
      logWarn('commentsService', 'Usuario mencionado nao encontrado', { mentionedUserName });
      return;
    }

    const mentionedUserId = profiles[0].id;
    const { error } = await createUserRequest(
      mentionedUserId,
      'mention',
      `${authorName} mencionou voce em um comentario na acao "${actionTitle}"`
    );

    if (error) {
      logError('commentsService', 'Erro ao criar notificacao de mencao', { error });
    }
  } catch (error) {
    logError('commentsService', 'Erro inesperado ao criar notificacao de mencao', error);
  }
}

export async function processMentions(
  commentContent: string,
  actionTitle: string,
  authorName: string
): Promise<void> {
  const mentionedNames = filterMentionTargets(extractMentionedNames(commentContent), authorName);
  await Promise.all(
    mentionedNames.map((mentionedName) =>
      createMentionNotification(mentionedName, actionTitle, authorName)
    )
  );
}






