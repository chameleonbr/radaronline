import type { ActionTag } from '../types';

import { apiRequest } from './apiClient';

export async function listTagsViaBackendApi(microregiaoId?: string): Promise<ActionTag[]> {
  const query = microregiaoId ? `?microregionId=${encodeURIComponent(microregiaoId)}` : '';
  const response = await apiRequest<{ items: ActionTag[] }>(`/v1/tags${query}`);
  return response.items;
}

export async function createTagViaBackendApi(name: string): Promise<ActionTag> {
  return apiRequest<ActionTag>('/v1/tags', {
    method: 'POST',
    body: { name },
  });
}

export async function deleteTagViaBackendApi(tagId: string): Promise<void> {
  await apiRequest<void>(`/v1/tags/${encodeURIComponent(tagId)}`, {
    method: 'DELETE',
  });
}

export async function toggleTagFavoriteViaBackendApi(tagId: string, microregiaoId: string): Promise<boolean> {
  const response = await apiRequest<{ isFavorite: boolean }>(`/v1/tags/${encodeURIComponent(tagId)}/toggle-favorite`, {
    method: 'POST',
    body: { microregionId: microregiaoId },
  });
  return response.isFavorite;
}

export async function listActionTagsViaBackendApi(actionUid: string, microregiaoId?: string): Promise<ActionTag[]> {
  const query = microregiaoId ? `?microregionId=${encodeURIComponent(microregiaoId)}` : '';
  const response = await apiRequest<{ items: ActionTag[] }>(
    `/v1/actions/${encodeURIComponent(actionUid)}/tags${query}`
  );
  return response.items;
}

export async function assignTagToActionViaBackendApi(actionUid: string, tagId: string): Promise<void> {
  await apiRequest<void>(`/v1/actions/${encodeURIComponent(actionUid)}/tags/${encodeURIComponent(tagId)}`, {
    method: 'PUT',
  });
}

export async function removeTagFromActionViaBackendApi(actionUid: string, tagId: string): Promise<void> {
  await apiRequest<void>(`/v1/actions/${encodeURIComponent(actionUid)}/tags/${encodeURIComponent(tagId)}`, {
    method: 'DELETE',
  });
}
