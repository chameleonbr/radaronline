
import type { ActionTag } from '../types';
import { log, logError, logWarn } from '../lib/logger';
import { shouldUseBackendTagsApi } from './apiClient';
import { requireCurrentUserId } from './sessionService';
import { getActionDbIdByUid } from './actionLookupService';
import {
  assignTagToActionViaBackendApi,
  createTagViaBackendApi,
  deleteTagViaBackendApi,
  listActionTagsViaBackendApi,
  listTagsViaBackendApi,
  removeTagFromActionViaBackendApi,
  toggleTagFavoriteViaBackendApi,
} from './tagsApi';
import {
  buildNextFavoriteState,
  generateTagColor,
  mapActionTagAssignments,
  mapLoadedTags,
  persistLocalFavoriteTags,
  readLocalFavoriteTags,
} from './tags/tagsService.helpers';
import {
  deleteActionTagAssignment,
  deleteTagRow,
  fetchTagFavoriteMicros,
  insertTagRow,
  listActionTagAssignments,
  listTagRows,
  updateTagFavoriteMicros,
  upsertActionTagAssignment,
} from './tags/tagsService.repositories';

export async function loadTags(microId?: string): Promise<ActionTag[]> {
  try {
    if (shouldUseBackendTagsApi()) {
      return await listTagsViaBackendApi(microId);
    }

    let localFavorites: string[] = [];
    if (microId) {
      try {
        localFavorites = readLocalFavoriteTags(microId);
      } catch (e) {
        logWarn('tagsService', 'Erro ao ler localStorage', e);
      }
    }

    return mapLoadedTags(await listTagRows(), microId, localFavorites);
  } catch (error) {
    logError('tagsService', 'Erro inesperado ao carregar tags', error);
    throw error;
  }
}

export async function toggleTagFavorite(tagId: string, microId: string): Promise<boolean> {
  try {
    if (shouldUseBackendTagsApi()) {
      return await toggleTagFavoriteViaBackendApi(tagId, microId);
    }

    log('tagsService', 'Alternando favorito hibrido de tag', { tagId, microId });

    let newLocalState = false;
    try {
      const favoriteState = buildNextFavoriteState(readLocalFavoriteTags(microId), tagId);
      persistLocalFavoriteTags(microId, favoriteState.nextLocalFavorites);
      newLocalState = favoriteState.isFavorite;
      log('tagsService', 'Persistencia local de favorito atualizada', { newLocalState });
    } catch (e) {
      logError('tagsService', 'Falha no LocalStorage ao alternar favorito', e);
    }

    let currentMicros: string[] | null = null;
    try {
      currentMicros = await fetchTagFavoriteMicros(tagId);
    } catch (fetchError) {
      logWarn('tagsService', 'Nao foi possivel ler do banco para sync de favorito; usando apenas local', fetchError);
      return newLocalState;
    }

    const safeMicros = currentMicros || [];
    const isDbFavorited = safeMicros.includes(microId);
    const newMicros = isDbFavorited
      ? safeMicros.filter(id => id !== microId)
      : [...safeMicros, microId];

    try {
      await updateTagFavoriteMicros(tagId, newMicros);
    } catch (updateError) {
      logWarn('tagsService', 'Falha ao persistir favorito no banco; mantendo persistencia local', updateError);
      return newLocalState;
    }

    log('tagsService', 'Sync de favorito com banco concluido com sucesso');
    return newLocalState;
  } catch (error) {
    logError('tagsService', 'Erro hibrido ao alternar favorito', error);
    return false;
  }
}

export async function createTag(name: string): Promise<ActionTag> {
  try {
    if (shouldUseBackendTagsApi()) {
      return await createTagViaBackendApi(name);
    }

    const currentUserId = await requireCurrentUserId('Usuario nao autenticado');
    const data = await insertTagRow(name, generateTagColor(name), currentUserId);

    return {
      id: data.id,
      name: data.name,
      color: data.color,
    };
  } catch (error) {
    logError('tagsService', 'Erro inesperado ao criar tag', error);
    throw error;
  }
}


export async function addTagToAction(actionUid: string, tagId: string, actionDbUuid?: string): Promise<void> {
  try {
    if (shouldUseBackendTagsApi()) {
      await assignTagToActionViaBackendApi(actionUid, tagId);
      return;
    }

    let actionDbId: string | null = actionDbUuid || null;
    if (!actionDbId) {
      actionDbId = await getActionDbIdByUid(actionUid);
    }

    await upsertActionTagAssignment(actionUid, tagId, actionDbId);
  } catch (error) {
    logError('tagsService', 'Erro inesperado ao adicionar tag', error);
    throw error;
  }
}

export async function removeTagFromAction(actionUid: string, tagId: string): Promise<void> {
  try {
    if (shouldUseBackendTagsApi()) {
      await removeTagFromActionViaBackendApi(actionUid, tagId);
      return;
    }

    await deleteActionTagAssignment(actionUid, tagId);
  } catch (error) {
    logError('tagsService', 'Erro inesperado ao remover tag', error);
    throw error;
  }
}

export async function loadTagsForAction(actionUid: string): Promise<ActionTag[]> {
  try {
    if (shouldUseBackendTagsApi()) {
      return await listActionTagsViaBackendApi(actionUid);
    }

    return mapActionTagAssignments(await listActionTagAssignments(actionUid));
  } catch (error) {
    logError('tagsService', 'Erro inesperado ao carregar tags da acao', error);
    return [];
  }
}

export async function deleteTag(tagId: string): Promise<void> {
  try {
    if (shouldUseBackendTagsApi()) {
      await deleteTagViaBackendApi(tagId);
      return;
    }

    await deleteTagRow(tagId);
  } catch (error) {
    logError('tagsService', 'Erro inesperado ao excluir tag', error);
    throw error;
  }
}






