
import { logError } from '../lib/logger';
import type { Activity } from '../types';
import {
  createActivityViaBackendApi,
  createObjectiveViaBackendApi,
  deleteActivityViaBackendApi,
  deleteObjectiveViaBackendApi,
  loadActivitiesViaBackendApi,
  loadObjectivesViaBackendApi,
  updateActionActivityIdViaBackendApi,
  updateActivityViaBackendApi,
  updateObjectiveViaBackendApi,
} from './objectivesActivitiesApi';
import {
  buildObjectiveUpdatePayload,
  groupActivitiesByObjective,
  mapObjectiveDTOToObjective,
} from './objectivesActivities/objectivesActivitiesService.helpers';
import {
  deleteActivityRow,
  deleteObjectiveRow,
  insertActivityRow,
  insertObjectiveRow,
  listActivityRows,
  listObjectiveRows,
  updateActionActivityReference,
  updateActivityRow,
  updateObjectiveRow,
} from './objectivesActivities/objectivesActivitiesService.repositories';
import type {
  ActivityUpdateInput,
  ObjectiveRecord,
  ObjectiveUpdateInput,
} from './objectivesActivities/objectivesActivitiesService.types';
import { shouldUseBackendObjectivesActivitiesApi } from './apiClient';

export async function loadObjectives(microregiaoId?: string): Promise<ObjectiveRecord[]> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      return await loadObjectivesViaBackendApi(microregiaoId);
    }

    return (await listObjectiveRows(microregiaoId)).map(mapObjectiveDTOToObjective);
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro inesperado ao carregar objetivos', error);
    throw error;
  }
}

export async function loadActivities(microregiaoId?: string): Promise<Record<number, Activity[]>> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      return await loadActivitiesViaBackendApi(microregiaoId);
    }

    return groupActivitiesByObjective(await listActivityRows(microregiaoId));
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro inesperado ao carregar atividades', error);
    throw error;
  }
}

export async function createObjective(
  title: string,
  microregiaoId: string
): Promise<{ id: number; title: string; status: 'on-track' | 'delayed' }> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      return await createObjectiveViaBackendApi(title, microregiaoId);
    }

    const data = await insertObjectiveRow(title, microregiaoId);

    return {
      id: data.id,
      title: data.title,
      status: 'on-track',
    };
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro ao criar objetivo', error);
    throw error;
  }
}

export async function updateObjective(
  id: number,
  updates: ObjectiveUpdateInput
): Promise<void> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      await updateObjectiveViaBackendApi(id, updates);
      return;
    }

    await updateObjectiveRow(id, buildObjectiveUpdatePayload(updates));
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro ao atualizar objetivo', error);
    throw error;
  }
}

export async function deleteObjective(id: number): Promise<void> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      await deleteObjectiveViaBackendApi(id);
      return;
    }

    await deleteObjectiveRow(id);
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro ao excluir objetivo', error);
    throw error;
  }
}

export async function createActivity(
  objectiveId: number,
  id: string,
  title: string,
  microregiaoId: string,
  description: string = ''
): Promise<Pick<Activity, 'id' | 'title' | 'description'>> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      return await createActivityViaBackendApi(objectiveId, id, title, microregiaoId, description);
    }

    return await insertActivityRow(objectiveId, id, title, microregiaoId, description);
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro ao criar atividade', error);
    throw error;
  }
}

export async function updateActivity(
  id: string,
  updates: ActivityUpdateInput
): Promise<void> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      await updateActivityViaBackendApi(id, updates);
      return;
    }

    await updateActivityRow(id, updates);
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro ao atualizar atividade', error);
    throw error;
  }
}

export async function deleteActivity(id: string): Promise<void> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      await deleteActivityViaBackendApi(id);
      return;
    }

    await deleteActivityRow(id);
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro ao excluir atividade', error);
    throw error;
  }
}

export async function updateActionActivityId(uid: string, newActivityId: string): Promise<void> {
  try {
    if (shouldUseBackendObjectivesActivitiesApi()) {
      await updateActionActivityIdViaBackendApi(uid, newActivityId);
      return;
    }

    await updateActionActivityReference(uid, newActivityId);
  } catch (error) {
    logError('objectivesActivitiesService', 'Erro inesperado ao mover acao', error);
    throw error;
  }
}





