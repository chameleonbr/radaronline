import type { Action } from '../types';
import { generateActionUid } from '../types';

import { apiRequest } from './apiClient';

type BackendAction = {
  dbId: string;
  uid: string;
  actionId: string;
  activityId: string;
  microregionId: string;
  title: string;
  status: 'Concluido' | 'Em Andamento' | 'Nao Iniciado' | 'Atrasado';
  startDate: string | null;
  plannedEndDate: string | null;
  endDate: string | null;
  progress: number;
  notes: string;
};

function toFrontendStatus(status: BackendAction['status']): Action['status'] {
  switch (status) {
    case 'Concluido':
      return 'Concluído';
    case 'Nao Iniciado':
      return 'Não Iniciado';
    default:
      return status;
  }
}

function toBackendStatus(status: Action['status']): BackendAction['status'] {
  switch (status) {
    case 'Concluído':
      return 'Concluido';
    case 'Não Iniciado':
      return 'Nao Iniciado';
    default:
      return status;
  }
}

function mapBackendAction(action: BackendAction): Action & { dbId: string } {
  return {
    dbId: action.dbId,
    uid: action.uid,
    id: action.actionId,
    activityId: action.activityId,
    microregiaoId: action.microregionId,
    title: action.title,
    status: toFrontendStatus(action.status),
    startDate: action.startDate || '',
    plannedEndDate: action.plannedEndDate || '',
    endDate: action.endDate || '',
    progress: action.progress,
    notes: action.notes || '',
    comments: [],
    raci: [],
    tags: [],
    commentCount: 0,
  };
}

export async function listActionsViaBackendApi(microregiaoId?: string): Promise<Action[]> {
  const query = microregiaoId ? `?microregionId=${encodeURIComponent(microregiaoId)}` : '';
  const response = await apiRequest<{ items: BackendAction[] }>(`/v1/actions${query}`);
  return response.items.map((item) => mapBackendAction(item));
}

export async function getActionViaBackendApi(uid: string): Promise<Action & { dbId: string }> {
  const action = await apiRequest<BackendAction>(`/v1/actions/${encodeURIComponent(uid)}`);
  return mapBackendAction(action);
}

export async function createActionViaBackendApi(input: {
  microregiaoId: string;
  activityId: string;
  actionNumber: number;
  title?: string;
}): Promise<Action & { dbId: string }> {
  const action = await apiRequest<BackendAction>('/v1/actions', {
    method: 'POST',
    body: {
      microregionId: input.microregiaoId,
      activityId: input.activityId,
      actionNumber: input.actionNumber,
      title: input.title || 'Nova ação',
    },
  });

  return mapBackendAction(action);
}

export async function updateActionViaBackendApi(
  uid: string,
  updates: Partial<Omit<Action, 'uid' | 'id' | 'activityId' | 'microregiaoId' | 'comments' | 'raci'>>
): Promise<Action> {
  const action = await apiRequest<BackendAction>(`/v1/actions/${encodeURIComponent(uid)}`, {
    method: 'PATCH',
    body: {
      title: updates.title,
      status: updates.status ? toBackendStatus(updates.status) : undefined,
      startDate: updates.startDate || null,
      plannedEndDate: updates.plannedEndDate || null,
      endDate: updates.endDate || null,
      progress: updates.progress,
      notes: updates.notes,
    },
  });

  return mapBackendAction(action);
}

export async function deleteActionViaBackendApi(uid: string): Promise<void> {
  await apiRequest<void>(`/v1/actions/${encodeURIComponent(uid)}`, {
    method: 'DELETE',
  });
}

export async function upsertActionViaBackendApi(action: Action): Promise<Action> {
  try {
    await getActionViaBackendApi(action.uid);
    return updateActionViaBackendApi(action.uid, {
      title: action.title,
      status: action.status,
      startDate: action.startDate,
      plannedEndDate: action.plannedEndDate,
      endDate: action.endDate,
      progress: action.progress,
      notes: action.notes,
      tags: action.tags,
      commentCount: action.commentCount,
    });
  } catch {
    const parts = action.id.split('.');
    const actionNumber = Number(parts[parts.length - 1]);

    if (!Number.isFinite(actionNumber) || actionNumber <= 0) {
      throw new Error('Nao foi possivel inferir o numero da acao para create via API');
    }

    const created = await createActionViaBackendApi({
      microregiaoId: action.microregiaoId,
      activityId: action.activityId,
      actionNumber,
      title: action.title,
    });

    return updateActionViaBackendApi(created.uid, {
      status: action.status,
      startDate: action.startDate,
      plannedEndDate: action.plannedEndDate,
      endDate: action.endDate,
      progress: action.progress,
      notes: action.notes,
    });
  }
}

export function buildBackendActionUid(microregiaoId: string, actionId: string): string {
  return generateActionUid(microregiaoId, actionId);
}
