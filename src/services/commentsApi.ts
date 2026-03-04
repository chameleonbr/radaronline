import type { ActionComment } from '../types';

import { apiRequest } from './apiClient';

export async function listCommentsViaBackendApi(actionUid: string): Promise<ActionComment[]> {
  const response = await apiRequest<{ items: ActionComment[] }>(
    `/v1/actions/${encodeURIComponent(actionUid)}/comments`
  );
  return response.items;
}

export async function createCommentViaBackendApi(args: {
  actionUid: string;
  content: string;
  parentId?: string | null;
}): Promise<ActionComment> {
  return apiRequest<ActionComment>(`/v1/actions/${encodeURIComponent(args.actionUid)}/comments`, {
    method: 'POST',
    body: {
      content: args.content,
      parentId: args.parentId ?? null,
    },
  });
}

export async function updateCommentViaBackendApi(commentId: string, content: string): Promise<void> {
  await apiRequest<void>(`/v1/comments/${encodeURIComponent(commentId)}`, {
    method: 'PATCH',
    body: { content },
  });
}

export async function deleteCommentViaBackendApi(commentId: string): Promise<void> {
  await apiRequest<void>(`/v1/comments/${encodeURIComponent(commentId)}`, {
    method: 'DELETE',
  });
}
