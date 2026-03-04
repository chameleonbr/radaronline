import type { Activity } from '../types';

import { apiRequest } from './apiClient';
import type {
  ActivityCreateResult,
  ActivityUpdateInput,
  ObjectiveRecord,
  ObjectiveUpdateInput,
} from './objectivesActivities/objectivesActivitiesService.types';

type BackendObjective = {
  id: number;
  title: string;
  status: 'on-track' | 'delayed';
  microregionId: string;
  eixo?: number;
  description?: string;
  eixoLabel?: string;
  eixoColor?: string;
};

type BackendActivity = {
  id: string;
  objectiveId: number;
  title: string;
  description: string;
  microregionId: string;
};

function buildQuery(microregionId?: string): string {
  if (!microregionId || microregionId === 'all') {
    return '';
  }

  return `?microregionId=${encodeURIComponent(microregionId)}`;
}

function mapObjective(item: BackendObjective): ObjectiveRecord {
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    microregiaoId: item.microregionId,
    eixo: item.eixo,
    description: item.description,
    eixoLabel: item.eixoLabel,
    eixoColor: item.eixoColor,
  };
}

function mapActivity(item: BackendActivity): Activity {
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    microregiaoId: item.microregionId,
  };
}

export async function loadObjectivesViaBackendApi(microregiaoId?: string): Promise<ObjectiveRecord[]> {
  const response = await apiRequest<{ items: BackendObjective[] }>(`/v1/objectives${buildQuery(microregiaoId)}`);
  return response.items.map(mapObjective);
}

export async function loadActivitiesViaBackendApi(
  microregiaoId?: string
): Promise<Record<number, Activity[]>> {
  const response = await apiRequest<{ itemsByObjective: Record<string, BackendActivity[]> }>(
    `/v1/activities${buildQuery(microregiaoId)}`
  );

  return Object.fromEntries(
    Object.entries(response.itemsByObjective).map(([objectiveId, activities]) => [
      Number(objectiveId),
      activities.map(mapActivity),
    ])
  );
}

export async function createObjectiveViaBackendApi(
  title: string,
  microregiaoId: string
): Promise<{ id: number; title: string; status: 'on-track' | 'delayed' }> {
  const item = await apiRequest<BackendObjective>('/v1/objectives', {
    method: 'POST',
    body: {
      title,
      microregionId: microregiaoId,
    },
  });

  return {
    id: item.id,
    title: item.title,
    status: item.status,
  };
}

export async function updateObjectiveViaBackendApi(
  id: number,
  updates: ObjectiveUpdateInput
): Promise<void> {
  await apiRequest<void>(`/v1/objectives/${id}`, {
    method: 'PATCH',
    body: updates,
  });
}

export async function deleteObjectiveViaBackendApi(id: number): Promise<void> {
  await apiRequest<void>(`/v1/objectives/${id}`, {
    method: 'DELETE',
  });
}

export async function createActivityViaBackendApi(
  objectiveId: number,
  id: string,
  title: string,
  microregiaoId: string,
  description = ''
): Promise<ActivityCreateResult> {
  const item = await apiRequest<BackendActivity>('/v1/activities', {
    method: 'POST',
    body: {
      objectiveId,
      id,
      title,
      microregionId: microregiaoId,
      description,
    },
  });

  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
  };
}

export async function updateActivityViaBackendApi(
  id: string,
  updates: ActivityUpdateInput
): Promise<void> {
  await apiRequest<void>(`/v1/activities/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: updates,
  });
}

export async function deleteActivityViaBackendApi(id: string): Promise<void> {
  await apiRequest<void>(`/v1/activities/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function updateActionActivityIdViaBackendApi(
  uid: string,
  newActivityId: string
): Promise<void> {
  await apiRequest<void>('/v1/actions/move-activity', {
    method: 'POST',
    body: {
      uid,
      newActivityId,
    },
  });
}
